import { EventEmitter } from "events";
import { OpenSSLCrypto } from "./ossl";
import * as pkcs11 from "./pkcs11";

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

type CryptoMap = { [id: string]: Crypto };

export class LocalProvider extends EventEmitter {

    public config: LocalProviderConfigure;

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
        // Add OpenSSL
        const openSsl = new OpenSSLCrypto();
        this.crypto["1234567890"] = openSsl;
        let infos: IModule = {
            name: "WebCryptoLocal",
            providers: [],
        };
        infos.providers = infos.providers.concat([], (await openSsl.info()).providers);

        // Add pkcs11
        let ref: RefCount = { counter: 0 };
        for (const lib of this.config.pkcs11) {
            const pkcs11Provider = new pkcs11.Provider(lib);
            ref.counter++;
            pkcs11Provider.on("listening", (info) => {
                infos.providers = infos.providers.concat(info.providers);
                this.clickRefCount(ref, infos);
            })
                .once("error", (err) => {
                    this.clickRefCount(ref, infos);
                })
                .on("token", (info) => {
                    this.emit("token", info);
                })
                .on("error", (err) => {
                    console.log(err);
                });

            pkcs11Provider.open();
        }
    }

    public stop() {
        throw new Error("Not implemented yet");
    }

    protected clickRefCount(ref: RefCount, info: IModule) {
        ref.counter--;
        if (!ref.counter) {
            this.emit("listening", info);
        }
    }

}
