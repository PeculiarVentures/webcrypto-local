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
import { OpenSSLCrypto } from "./ossl";
import { CardWatcher, PCSCCard } from "./pcsc_watcher";

const CARD_CONFIG_PATH = path.join(__dirname, "../../json/card.json");

interface TokenInfo {
    removed: IProvider[];
    added: IProvider[];
    error?: string;
}

type LocalProviderTokenHandler = (info: TokenInfo) => void;
type LocalProviderTokenNewHandler = (info: PCSCCard) => void;
type LocalProviderListeningHandler = (info: IModule[]) => void;
type LocalProviderErrorHandler = (e: Error) => void;
type LocalProviderStopHandler = () => void;

type CryptoMap = { [id: string]: pkcs11.WebCrypto };

export class LocalProvider extends EventEmitter {

    public info: ProviderInfoProto;
    public crypto: CryptoMap = {};

    protected cards: CardWatcher;

    constructor() {
        super();

        this.cards = new CardWatcher();
    }

    public on(event: "close", listener: LocalProviderStopHandler): this;
    public on(event: "listening", listener: LocalProviderListeningHandler): this;
    public on(event: "token", listener: LocalProviderTokenHandler): this;
    public on(event: "token_new", listener: LocalProviderTokenNewHandler): this;
    public on(event: "error", listener: LocalProviderErrorHandler): this;
    public on(event: "info", listener: (message: string) => void): this;
    // public on(event: string | symbol, listener: Function): this;
    public on(event: string | symbol, listener: Function) {
        return super.on(event, listener);
    }

    public once(event: "close", listener: LocalProviderStopHandler): this;
    public once(event: "listening", listener: LocalProviderListeningHandler): this;
    public once(event: "token", listener: LocalProviderTokenHandler): this;
    public once(event: "token_new", listener: LocalProviderTokenNewHandler): this;
    public once(event: "error", listener: LocalProviderErrorHandler): this;
    public once(event: "info", listener: (message: string) => void): this;
    // public once(event: string | symbol, listener: Function): this;
    public once(event: string | symbol, listener: Function) {
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
        let providers: IProvider[] = [];

        // System via pvpkcs11
        let pvpkcs11Path: string;
        if ((process.versions as any)["electron"]) {
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
                    pvpkcs11Path = "/github/pvpkcs11/build/Debug/pvpkcs11.dll";
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
                    const info = getSlotInfo(crypto);
                    this.emit("info", `Provider: Add crypto ${info.name} ${info.id}`);
                    crypto.isLoggedIn = true;
                    this.info.providers.push(new ProviderCryptoProto(info));
                    this.crypto[info.id] = crypto;
                } catch (e) {
                    this.emit("error", `Cannot load library by path ${pvpkcs11Path}`);
                    this.emit("error", e);
                }
            } else {
                this.emit("error", new Error(`TestPKCS11: Cannot find pvpkcs11 by path ${pvpkcs11Path}`));
            }
        }

        // Add OpenSSL
        const openSsl = new OpenSSLCrypto();
        // this.crypto["286cb673c23e4decbe22bb71fc04e5ea"] = openSsl;

        providers = (await openSsl.info()).providers;
        // providers.forEach((item) => {
        //     this.crypto[item.id] = openSsl;
        //     this.info.providers.push(new ProviderCryptoProto(item));
        // });

        // Add pkcs11
        this.cards.start(CARD_CONFIG_PATH);
        this.cards
            .on("error", (error) => {
                return this.emit("token", {
                    added: [],
                    removed: [],
                    error: error.message,
                });
            })
            .on("new", (card) => {
                return this.emit("token_new", card);
            })
            .on("insert", (card) => {
                try {
                    const EVENT_LOG = "Provider:Token:Insert";
                    this.emit("info", `${EVENT_LOG} reader:'${card.reader}' name:'${card.name}' atr:${card.atr.toString("hex")}`);
                    if (!fs.existsSync(card.library)) {
                        this.emit("token", {
                            added: [],
                            removed: [],
                            error: `Cannot find PKCS#11 library ${card.library}`,
                        });
                        return;
                    }

                    const mod = graphene.Module.load(card.library, card.name);
                    try {
                        mod.initialize();
                    } catch {
                        // error on module initialization
                    }

                    const slots = mod.getSlots();
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
                        throw new Error(`${EVENT_LOG} Cannot find slot with description '${card.reader}'`);
                    }

                    const crypto = new pkcs11.WebCrypto({
                        library: card.library,
                        slot: slotIndex,
                        readWrite: !card.readOnly,
                    });
                    const info = getSlotInfo(crypto);
                    info.atr = Convert.ToHex(card.atr);
                    info.library = card.library;
                    info.id = digest(DEFAULT_HASH_ALG, card.reader + card.atr).toString("hex");
                    this.emit("info", `${EVENT_LOG} Add crypto '${info.name}' ${info.id}`);
                    this.info.providers.push(new ProviderCryptoProto(info));
                    this.crypto[info.id] = crypto;
                    // fire token event
                    this.emit("token", {
                        added: [info],
                        removed: [],
                    });
                } catch (err) {
                    this.emit("error", err);
                }
            })
            .on("remove", (card) => {
                const EVENT_REMOVE = "Provider:Token:Remove";
                this.emit("info", `${EVENT_REMOVE} reader:'${card.reader}' name:'${card.name}' atr:${card.atr.toString("hex")}`);
                const info: any = {
                    added: [],
                    removed: [],
                };
                const provId = digest(DEFAULT_HASH_ALG, card.reader + card.atr).toString("hex");
                delete this.crypto[provId];
                this.info.providers = this.info.providers.filter((provider) => {
                    this.emit("info", `${EVENT_REMOVE} Filtering providers ${provider.id} ${info.id}`);
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
            });

        this.emit("listening", await this.getInfo());
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
