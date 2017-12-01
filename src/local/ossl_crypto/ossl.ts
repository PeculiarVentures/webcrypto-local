import { IProvider } from "node-webcrypto-p11";
import { AlgorithmNames } from "webcrypto-core";
import { OPENSSL_CERT_STORAGE_DIR, OPENSSL_KEY_STORAGE_DIR } from "../../core/const";
import { OpenSSLCertificateStorage } from "./ossl_cert_storage";
import { OpenSSLKeyStorage } from "./ossl_key_storage";

const OSSLCrypto: typeof Crypto = require("node-webcrypto-ossl");

export class OpenSSLCrypto extends OSSLCrypto {

    public readonly info: IProvider = {
        id: "61e5e90712ba8abfb6bde6b4504b54bf88d36d0c",
        slot: 0,
        name: "OpenSSL",
        reader: "OpenSSL",
        serialNumber: "61e5e90712ba8abfb6bde6b4504b54bf88d36d0c",
        isRemovable: false,
        isHardware: false,
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
    };

    public keyStorage: IKeyStorage = new OpenSSLKeyStorage(`${OPENSSL_KEY_STORAGE_DIR}/store.json`);
    public certStorage: ICertificateStorage = new OpenSSLCertificateStorage(`${OPENSSL_CERT_STORAGE_DIR}/store.json`);

    public isLoggedIn = true;

    constructor() {
        super();
    }

}
