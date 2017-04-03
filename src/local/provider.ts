import { EventEmitter } from "events";
import * as fs from "fs";
import * as pkcs11 from "node-webcrypto-p11";
import { ProviderCryptoProto, ProviderInfoProto } from "../core/protos/provider";
import { OpenSSLCrypto } from "./ossl";

type RefCount = {
    counter: number;
};

type LocalProviderTokenHandler = (info: { removed: IProvider[], added: IProvider[] }) => void;
type LocalProviderListeningHandler = (info: IModule[]) => void;
type LocalProviderErrorHandler = (e: Error) => void;
type LocalProviderStopHandler = () => void;

export interface LocalProviderConfigure {
    /**
     * Paths to PKCS#11 libs
     *
     * @type {string[]}
     * @memberOf LocalProvider
     */
    pkcs11: string[];
}

interface ProviderCrypto extends Crypto {
    isLoggedIn?: boolean;
    login?: (pin: string) => void;
    logout?: () => void;
    keyStorage: IKeyStorage;
    certStorage: ICertificateStorage;
}

type CryptoMap = { [id: string]: ProviderCrypto };

export class LocalProvider extends EventEmitter {

    public config: LocalProviderConfigure;
    public info: ProviderInfoProto;

    public crypto: CryptoMap = {};

    constructor(config: LocalProviderConfigure) {
        super();

        this.config = config;
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
        this.crypto["1234567890"] = openSsl;

        providers = (await openSsl.info()).providers;
        providers.forEach((item) => {
            this.crypto[item.id] = openSsl;
            this.info.providers.push(new ProviderCryptoProto(item));
        });

        // Add pkcs11
        const ref: RefCount = { counter: 0 };
        for (const lib of this.config.pkcs11) {
            if (fs.existsSync(lib)) {
                const pkcs11Provider = new pkcs11.Provider(lib);
                ref.counter++;
                pkcs11Provider.on("listening", (info) => {
                    info.providers.forEach((item, index) => {
                        try {
                            this.crypto[item.id] = new pkcs11.WebCrypto({
                                library: lib,
                                slot: index,
                                readWrite: true,
                            });
                            this.info.providers.push(new ProviderCryptoProto(item));
                        } catch (e) {
                            this.emit("error", e);
                        }
                    });
                    this.clickRefCount(ref, this.info);
                })
                    .once("error", (err) => {
                        this.clickRefCount(ref, this.info);
                    })
                    .on("token", (info) => {
                        this.emit("token", info);
                    })
                    .on("error", (err) => {
                        console.log(err);
                    });

                pkcs11Provider.open();
            } else {
                console.log(`Provider by path ${lib} is not found`);
            }
        }
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

    protected clickRefCount(ref: RefCount, info: IModule) {
        ref.counter--;
        if (!ref.counter) {
            this.emit("listening", info);
        }
    }

}
