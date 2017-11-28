import { EventEmitter } from "events";
import * as fs from "fs";
import * as graphene from "graphene-pk11";
import * as pkcs11 from "node-webcrypto-p11";
import * as os from "os";
import * as path from "path";
import { Convert } from "pvtsutils";

import { ProviderCryptoProto, ProviderInfoProto } from "../core/protos/provider";
import { DEFAULT_HASH_ALG } from "./const";
import { digest } from "./helper";
import { CardWatcher, PCSCCard } from "./pcsc_watcher";

export interface TokenInfo {
    removed: IProvider[];
    added: IProvider[];
    error?: string;
}

export interface IServerProvider {
    /**
     * Path to PKCS#11 lib
     */
    lib: string;
    /**
     * indexes of using slots. Default [0]
     */
    slots?: number[];
}

export interface IProviderConfig {
    /**
     * List of addition providers
     */
    providers?: IServerProvider[];
    /**
     * Path to card.json
     */
    cards: string;
}

type LocalProviderTokenHandler = (info: TokenInfo) => void;
type LocalProviderTokenNewHandler = (info: PCSCCard) => void;
type LocalProviderListeningHandler = (info: IModule[]) => void;
type LocalProviderErrorHandler = (e: Error) => void;
type LocalProviderStopHandler = () => void;

interface CryptoMap {
    [id: string]: pkcs11.WebCrypto;
}

export class LocalProvider extends EventEmitter {

    public info: ProviderInfoProto;
    public crypto: CryptoMap = {};

    protected cards: CardWatcher;
    protected config: IProviderConfig;

    /**
     *
     * @param config Config params
     */
    constructor(config: IProviderConfig) {
        super();

        this.cards = new CardWatcher();
        this.config = config;
    }

    public on(event: "close", listener: LocalProviderStopHandler): this;
    public on(event: "listening", listener: LocalProviderListeningHandler): this;
    public on(event: "token", listener: LocalProviderTokenHandler): this;
    public on(event: "token_new", listener: LocalProviderTokenNewHandler): this;
    public on(event: "error", listener: LocalProviderErrorHandler): this;
    public on(event: "info", listener: (message: string) => void): this;
    // public on(event: string | symbol, listener: Function): this;
    public on(event: string | symbol, listener: (...args: any[]) => void) {
        return super.on(event, listener);
    }

    public once(event: "close", listener: LocalProviderStopHandler): this;
    public once(event: "listening", listener: LocalProviderListeningHandler): this;
    public once(event: "token", listener: LocalProviderTokenHandler): this;
    public once(event: "token_new", listener: LocalProviderTokenNewHandler): this;
    public once(event: "error", listener: LocalProviderErrorHandler): this;
    public once(event: "info", listener: (message: string) => void): this;
    // public once(event: string | symbol, listener: Function): this;
    public once(event: string | symbol, listener: (...args: any[]) => void) {
        return super.once(event, listener);
    }

    public emit(event: "token", info: TokenInfo): boolean;
    public emit(event: "token_new", info: PCSCCard): boolean;
    public emit(event: "info", message: string): boolean;
    public emit(event: "error", error: Error | string): boolean;
    public emit(event: "listening", info: ProviderInfoProto): boolean;
    public emit(event: string | symbol, ...args: any[]) {
        return super.emit(event, ...args);
    }

    public async open() {
        this.info = new ProviderInfoProto();
        this.info.name = "WebcryptoLocal";
        this.info.providers = [];

        //#region System via pvpkcs11
        let pvpkcs11Path: string;
        if ((process.versions as any).electron) {
            let libName = "";
            switch (os.platform()) {
                case "win32":
                    libName = "pvpkcs11.dll";
                    pvpkcs11Path = path.join(__dirname, "..", "..", "..", "..", "..", "..", libName);
                    break;
                case "darwin":
                    libName = "libpvpkcs11.dylib";
                    pvpkcs11Path = path.join(__dirname, "..", "..", "..", "..", libName);
                    break;
                default:
                    libName = "pvpkcs11.so";
                    pvpkcs11Path = path.join(__dirname, "..", "..", "..", "..", libName);
            }
        } else {
            // Dev paths for different os
            switch (os.platform()) {
                case "win32":
                    pvpkcs11Path = "/github/pv/pvpkcs11/build/Debug/pvpkcs11.dll";
                    break;
                case "darwin":
                    pvpkcs11Path = "/Users/microshine/Library/Developer/Xcode/DerivedData/config-hkruqzwffnciyjeujlpxkaxbdiun/Build/Products/Debug/libpvpkcs11.dylib";
                    break;
                default:
                    // Use SoftHSM by default
                    pvpkcs11Path = "/usr/local/lib/softhsm/libsofthsm2.so";
            }
        }
        {
            if (fs.existsSync(pvpkcs11Path)) {
                try {
                    const crypto = new pkcs11.WebCrypto({
                        library: pvpkcs11Path,
                        slot: 0,
                        readWrite: true,
                    });

                    crypto.isLoggedIn = true;
                    this.addProvider(crypto);
                } catch (e) {
                    this.emit("error", `Cannot load library by path ${pvpkcs11Path}`);
                    this.emit("error", e);
                }
            } else {
                this.emit("error", new Error(`TestPKCS11: Cannot find pvpkcs11 by path ${pvpkcs11Path}`));
            }
        }
        //#endregion

        //#region Add providers from config list
        this.config.providers = this.config.providers || [];
        for (const prov of this.config.providers) {
            prov.slots = prov.slots || [0];
            for (const slot of prov.slots) {
                if (fs.existsSync(prov.lib)) {
                    try {
                        const crypto = new pkcs11.WebCrypto({
                            library: prov.lib,
                            slot,
                            readWrite: true,
                        });
                        this.addProvider(crypto);
                    } catch (e) {
                        this.emit("error", `Cannot load library by path ${prov.lib}`);
                        this.emit("error", e);
                    }
                } else {
                    this.emit("error", new Error(`PKCS11: Cannot find pvpkcs11 by path ${prov.lib}`));
                }
            }
        }
        //#endregion

        //#region Add pkcs11
        this.cards
            .on("error", (err) => {
                this.emit("error", err);
                return this.emit("token", {
                    added: [],
                    removed: [],
                    error: err.message,
                });
            })
            .on("info", (message) => {
                this.emit("info", message);
            })
            .on("new", (card) => {
                return this.emit("token_new", card);
            })
            .on("insert", (card) => {
                const EVENT_LOG = "Provider:Token:Insert";
                this.emit("info", `${EVENT_LOG} reader:'${card.reader}' name:'${card.name}' atr:${card.atr.toString("hex")}`);
                let lastError = "";
                for (const library of card.libraries) {
                    try {
                        if (!fs.existsSync(library)) {
                            lastError = `The inserted smart card is supported by Fortify but we were unable to find middleware for the card. Make sure '${library}' exists, if not install the smart cards middleware and try again.`;
                            continue;
                        }

                        const mod = graphene.Module.load(library, card.name);
                        try {
                            mod.initialize();
                        } catch (err) {
                            if (!/CRYPTOKI_ALREADY_INITIALIZED/.test(err.message)) {
                                this.emit("error", `${EVENT_LOG} Cannot initialize PKCS#11 lib ${library}. ${err.stack}`);
                                continue;
                            } else {
                                lastError = err.message;
                            }
                        }

                        const slots = mod.getSlots(true);
                        if (!slots.length) {
                            this.emit("error", `${EVENT_LOG} No slots found. It's possible token ${card.atr.toString("hex")} uses wrong PKCS#11 lib ${card.libraries}`);
                            lastError = `Token not initialized or unknown card state. No slots found.`;
                            continue;
                        }
                        let slotIndex = -1;
                        this.emit("info", `${EVENT_LOG} Looking for ${card.reader} into ${slots.length} slot(s)`);
                        for (let i = 0; i < slots.length; i++) {
                            const slot = slots.items(i);
                            if (!slot) {
                                continue;
                            }
                            this.emit("info", `${EVENT_LOG} Slot description: ${i} '${slot.slotDescription}'`);
                            if (slot.slotDescription === card.reader) {
                                this.emit("info", `${EVENT_LOG} Index found ${slot.slotDescription} ${i}`);
                                slotIndex = i;
                                break;
                            }
                        }
                        if (slotIndex < 0) {
                            lastError = `Cannot find matching slot for '${card.reader}' reader`;
                            continue;
                        }

                        const crypto = new pkcs11.WebCrypto({
                            library,
                            slot: slotIndex,
                            readWrite: !card.readOnly,
                        });
                        const info = getSlotInfo(crypto);
                        info.atr = Convert.ToHex(card.atr);
                        info.library = library;
                        info.id = digest(DEFAULT_HASH_ALG, card.reader + card.atr).toString("hex");

                        this.addProvider(crypto);

                        // fire token event
                        this.emit("token", {
                            added: [info],
                            removed: [],
                        });
                        lastError = "";
                        break;
                    } catch (err) {
                        lastError = `Unexpected error on token insertion. ${err.message}`;
                        continue;
                    }
                }
                if (lastError) {
                    this.emit("token", {
                        added: [],
                        removed: [],
                        error: lastError,
                    });
                }
            })
            .on("remove", (card) => {
                try {
                    const EVENT_REMOVE = "Provider:Token:Remove";
                    this.emit("info", `${EVENT_REMOVE} reader:'${card.reader}' name:'${card.name}' atr:${card.atr.toString("hex")}`);
                    const info: any = {
                        added: [],
                        removed: [],
                    };
                    const provId = digest(DEFAULT_HASH_ALG, card.reader + card.atr).toString("hex");
                    delete this.crypto[provId];
                    this.info.providers = this.info.providers.filter((provider) => {
                        this.emit("info", `${EVENT_REMOVE} Filtering providers ${provider.id} ${provId}`);
                        if (provider.id === provId) {
                            this.emit("info", `${EVENT_REMOVE} Crypto removed '${provider.name}' ${provider.id}`);
                            // remove crypto
                            info.removed.push(provider);
                            return false;
                        }
                        return true;
                    });
                    // fire token event
                    if (info.removed.length) {
                        this.emit("token", info);
                    }
                } catch (err) {
                    this.emit("token", {
                        added: [],
                        removed: [],
                        error: `Unexpected error on token removing. ${err.message}`,
                    });
                }
            })
            .start(this.config.cards);
        //#endregion

        this.emit("listening", await this.getInfo());
    }

    public addProvider(crypto: pkcs11.WebCrypto) {
        const info = getSlotInfo(crypto);
        this.emit("info", `Provider: Add crypto ${info.name} ${info.id}`);
        this.info.providers.push(new ProviderCryptoProto(info));
        this.crypto[info.id] = crypto;
    }

    public stop() {
        throw new Error("Not implemented yet");
    }

    public async getInfo(): Promise<ProviderInfoProto> {
        const resProto = new ProviderInfoProto();
        return resProto;
    }

    public async getCrypto(cryptoID: string) {
        const crypto = this.crypto[cryptoID];
        if (!crypto) {
            throw new Error(`Cannot get crypto by given ID '${cryptoID}'`);
        }
        return crypto;
    }

}

function getSlotInfo(p11Crypto: pkcs11.WebCrypto) {
    const session: graphene.Session = (p11Crypto as any).session;
    const info: IProvider = p11Crypto.info as any;
    info.readOnly = !(session.flags & graphene.SessionFlag.RW_SESSION);
    return info;
}

// function delay(ms: number) {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             resolve();
//         }, ms);
//     });
// }
