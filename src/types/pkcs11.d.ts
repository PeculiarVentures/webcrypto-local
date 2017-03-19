declare namespace PKCS11Crypto {
    interface IModule {
        name: string;
        providers: IProvider[];
    }

    interface IProvider {
        id: string;
        name: string;
        algorithms: string[];
    }


    type ProviderTokenHandler = (info: { removed: IProvider[], added: IProvider[] }) => void;
    type ProviderListeningHandler = (info: IModule) => void;
    type ProviderErrorHandler = (e: Error) => void;
    type ProviderStopHandler = () => void;

    class Provider {

        public readonly library: string;
        constructor(lib: string);

        public on(event: "stop", listener: ProviderStopHandler): this;
        public on(event: "listening", listener: ProviderListeningHandler): this;
        public on(event: "token", listener: ProviderTokenHandler): this;
        public on(event: "error", listener: ProviderErrorHandler): this;

        public once(event: "stop", listener: ProviderStopHandler): this;
        public once(event: "listening", listener: ProviderListeningHandler): this;
        public once(event: "token", listener: ProviderTokenHandler): this;
        public once(event: "error", listener: ProviderErrorHandler): this;

        public open(): void;
        public stop(): void;

    }

    class WebCrypto extends Crypto {
        keyStorage: IKeyStorage;
        certStorage: ICertificateStorage;
    }

}