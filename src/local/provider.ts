import { EventEmitter } from "events";
import * as fs from "fs";
import * as pkcs11 from "node-webcrypto-p11";
import * as path from "path";
import { ProviderCryptoProto, ProviderInfoProto } from "../core/protos/provider";
import { OpenSSLCrypto } from "./ossl";
import { CardWatcher } from "./pcsc_watcher";

// TODO must be fixed in pkcs11 layer
const utils = require("node-webcrypto-p11/built/utils");
import * as graphene from "graphene-pk11";
import { Convert } from "pvtsutils";

const CARD_CONFIG_PATH = path.join(__dirname, "../../json/card.json");

type LocalProviderTokenHandler = (info: { removed: IProvider[], added: IProvider[], error: Error }) => void;
type LocalProviderListeningHandler = (info: IModule[]) => void;
type LocalProviderErrorHandler = (e: Error) => void;
type LocalProviderStopHandler = () => void;

export interface ProviderCrypto extends Crypto {
    isLoggedIn?: boolean;
    login?: (pin: string) => void;
    logout?: () => void;
    keyStorage: IKeyStorage;
    certStorage: ICertificateStorage;
}

type CryptoMap = { [id: string]: ProviderCrypto };

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
    public on(event: "error", listener: LocalProviderErrorHandler): this;
    // public on(event: string | symbol, listener: Function): this;
    public on(event: string | symbol, listener: Function) {
        return super.on(event, listener);
    }

    public once(event: "close", listener: LocalProviderStopHandler): this;
    public once(event: "listening", listener: LocalProviderListeningHandler): this;
    public once(event: "token", listener: LocalProviderTokenHandler): this;
    public once(event: "error", listener: LocalProviderErrorHandler): this;
    // public once(event: string | symbol, listener: Function): this;
    public once(event: string | symbol, listener: Function) {
        return super.once(event, listener);
    }

    public async open() {
        this.info = new ProviderInfoProto();
        this.info.name = "WebcryptoLocal";
        this.info.providers = [];
        let providers: IProvider[] = [];

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
            .on("insert", (card) => {
                if (!fs.existsSync(card.library)) {
                    return this.emit("token", {
                        added: [],
                        removed: [],
                        error: `Cannot find PKCS#11 library ${card.library}`,
                    });
                }
                try {
                    const crypto = new pkcs11.WebCrypto({
                        library: card.library,
                        slot: 0,
                        readWrite: !card.readOnly,
                    });
                    const info = getSlotInfo(crypto);
                    info.atr = Convert.ToHex(card.atr);
                    info.library = card.library;
                    this.info.providers.push(new ProviderCryptoProto(info));
                    this.crypto[info.id] = crypto;
                    // fire token event
                    this.emit("token", {
                        added: [info],
                        removed: [],
                    });
                } catch (e) {
                    this.emit("error", e);
                }
            })
            .on("remove", (card) => {
                const info: any = {
                    added: [],
                    removed: [],
                };
                this.info.providers = this.info.providers.filter((provider) => {
                    console.log("Filter:", provider.library, card.library);
                    if (provider.library === card.library) {
                        // remove crypto
                        delete this.crypto[provider.id];
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

        // SoftHSM
        {
            // const library = "/usr/local/lib/softhsm/libsofthsm2.so";
            // if (fs.existsSync(library)) {
            //     try {
            //         const crypto = new pkcs11.WebCrypto({
            //             library,
            //             slot: 0,
            //             readWrite: true,
            //         });
            //         const info = getSlotInfo(crypto);
            //         this.info.providers.push(new ProviderCryptoProto(info));
            //         this.crypto[info.id] = crypto;
            //     } catch (e) {
            //         console.error("SoftHSM: Cannot to init crypto.");
            //     }
            // }
        }
        // Windows CAPI
        {
            const library = "/github/pvpkcs11/build/Debug/pvpkcs11.dll";
            if (fs.existsSync(library)) {
                try {
                    const crypto = new pkcs11.WebCrypto({
                        library,
                        slot: 0,
                        readWrite: true,
                    });
                    const info = getSlotInfo(crypto);
                    crypto.isLoggedIn = true;
                    this.info.providers.push(new ProviderCryptoProto(info));
                    this.crypto[info.id] = crypto;
                } catch (e) {
                    console.error(e);
                    console.error("TestPKCS11: Cannot to init pvpkcs11.");
                }
            } else {
                console.log("TestPKCS11: Cannot find Windows pvpkcs11.dll");
            }
        }
        // OSX
        {
            const library = "/Users/microshine/github/pv/pvpkcs11/out/Debug_x64/libpvpkcs11.dylib";
            if (fs.existsSync(library)) {
                try {
                    const crypto = new pkcs11.WebCrypto({
                        library,
                        slot: 0,
                        readWrite: true,
                    });
                    const info = getSlotInfo(crypto);
                    crypto.isLoggedIn = true;
                    this.info.providers.push(new ProviderCryptoProto(info));
                    this.crypto[info.id] = crypto;
                } catch (e) {
                    console.error(e);
                    console.error("TestPKCS11: Cannot to init pvpkcs11.");
                }
            } else {
                console.log("TestPKCS11: Cannot find OSX libpvpkcs11.dylib");
            }
        }
        this.emit("listening", this.getInfo());
    }

    public stop() {
        throw new Error("Not implemented yet");
    }

    public async getInfo(): Promise<ProviderInfoProto> {
        const resProto = new ProviderInfoProto();
        console.log(resProto);
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

function getSlotInfo(p11Crypto: any) {
    const session: graphene.Session = p11Crypto.session;
    const info = utils.getProviderInfo(session.slot) as IProvider;
    info.readOnly = !(session.flags & graphene.SessionFlag.RW_SESSION);
    return info;
}
