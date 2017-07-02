import { AlgorithmNames } from "webcrypto-core";
import { OPENSSL_CERT_STORAGE_DIR, OPENSSL_KEY_STORAGE_DIR } from "../core/const";
import { OpenSSLCertificateStorage } from "./ossl_cert_storage";
import { OpenSSLKeyStorage } from "./ossl_key_storage";

const OSSLCrypto: typeof Crypto = require("node-webcrypto-ossl");

export class OpenSSLCrypto extends OSSLCrypto {

    public name = "OpenSSL";

    public keyStorage: IKeyStorage = new OpenSSLKeyStorage(`${OPENSSL_KEY_STORAGE_DIR}/store.json`);
    public certStorage: ICertificateStorage = new OpenSSLCertificateStorage(`${OPENSSL_CERT_STORAGE_DIR}/store.json`);

    public isLoggedIn = true;

    constructor() {
        super();
    }

    public async info() {
        const res: IModule = {
            name: "OpenSSL",
            providers: [
                {
                    id: "286cb673c23e4decbe22bb71fc04e5ea",
                    name: "OpenSSL",
                    readOnly: false,
                    isRemovable: false,
                    algorithms: [
                        AlgorithmNames.Sha1,
                        AlgorithmNames.Sha256,
                        AlgorithmNames.Sha384,
                        AlgorithmNames.Sha512,
                        AlgorithmNames.RsaSSA,
                        AlgorithmNames.RsaPSS,
                        AlgorithmNames.RsaOAEP,
                        AlgorithmNames.Hmac,
                        AlgorithmNames.AesCBC,
                        AlgorithmNames.AesGCM,
                        AlgorithmNames.AesKW,
                        AlgorithmNames.Pbkdf2,
                        AlgorithmNames.EcDH,
                        AlgorithmNames.EcDSA,
                    ],
                },
            ],
        };

        return res;
    }

}
