import { EventEmitter } from "events";
import * as fs from "fs";
import { Convert } from "pvtsutils";
import { Server, Session } from "../connection/server";
import { CryptoKeyPairProto, CryptoKeyProto } from "../core";
import { Event } from "../core";
import { EncryptProto, ExportProto, GenerateKeyProto, ImportProto, SignProto, VerifyProto } from "../core";
import { ActionProto, BaseProto, ResultProto } from "../core";
import { UnwrapKeyProto, WrapKeyProto } from "../core";
import { KeyStorageGetItemProto, KeyStorageKeysProto, KeyStorageRemoveItemProto, KeyStorageSetItemProto } from "../core";
import { DeriveBitsProto, DeriveKeyProto } from "../core";
import {
    CertificateItemProto, CertificateStorageGetItemProto, CertificateStorageImportProto, CertificateStorageKeysProto,
    CertificateStorageRemoveItemProto, CertificateStorageSetItemProto, X509CertificateProto, X509RequestProto,
} from "../core";
import { ServiceCryptoKey } from "./key";
import { OpenSSLCertificateStorage } from "./ossl_cert_storage";
import { OpenSSLKeyStorage } from "./ossl_key_storage";

const WebCryptoOSSL = require("node-webcrypto-ossl");

export class LocalServerEvent extends Event<LocalServer> { }

export interface MemoryStorageItem<T> {
    type: string | "private" | "public" | "x509" | "req";
    id: string;
    session?: Session;
    data: T;
}

export class LocalServerListeningEvent extends LocalServerEvent {
    public readonly address: string;

    constructor(target: LocalServer, address: string) {
        super(target, "listening");
        this.address = address;
    }

}

export class LocalServerCloseEvent extends LocalServerEvent {
    public remoteAddress: string;
    constructor(target: LocalServer, remoteAddress: string) {
        super(target, "close");
        this.remoteAddress = remoteAddress;
    }
}

export class LocalServerErrorEvent extends LocalServerEvent {
    public error: Error;
    constructor(target: LocalServer, error: Error) {
        super(target, "error");
        this.error = error;
    }
}

/**
 * Implementation of NodeJS server for SocketCrypto, based on 2key-ratchet
 */
export class LocalServer extends EventEmitter {

    /**
     * Crypto implementation. OpenSSL | PKCS11 | ...(Service)
     */
    protected crypto: Crypto;

    protected memoryStorage: Array<MemoryStorageItem<any>> = [];

    protected server = new Server();

    constructor() {
        super();
        this.crypto = new WebCryptoOSSL();

        // create folder for OSSL key storage
        if (!fs.existsSync(".keystorage")) {
            fs.mkdirSync(".keystorage");
        }
        // create folder for OSSL cert storage
        if (!fs.existsSync(".certstorage")) {
            fs.mkdirSync(".certstorage");
        }
    }

    public on(event: "listening", listener: (e: LocalServerListeningEvent) => void): this;
    public on(event: "close", listener: (e: LocalServerCloseEvent) => void): this;
    public on(event: "error", listener: (e: LocalServerErrorEvent) => void): this;
    public on(event: string | symbol, listener: Function): this {
        return super.on(event, listener);
    }

    public once(event: "listening", listener: (e: LocalServerListeningEvent) => void): this;
    public once(event: "closed", listener: (e: LocalServerCloseEvent) => void): this;
    public once(event: "error", listener: (e: LocalServerErrorEvent) => void): this;
    public once(event: string | symbol, listener: Function): this {
        return super.once(event, listener);
    }

    public listen(address: string) {
        this.server.listen(address)
            .on("listening", (e) => {
                console.error("Server:Listening", e.address);
                this.emit("listening", new LocalServerListeningEvent(this, e.address));
            })
            .on("error", (e) => {
                console.error("Server:Error", e.error);
                this.emit("error", new LocalServerErrorEvent(this, e.error));
            })
            .on("message", (e) => {
                console.error("Server:Message", e.message.action);

                this.onMessage(e.session, e.message)
                    .then(e.resolve, e.reject);
            })
            .on("close", (e) => {
                console.log("Server:Close");
                this.emit("close", new LocalServerCloseEvent(this, e.remoteAddress));
            });

        return this;
    }

    protected async onMessage(session: Session, message: ActionProto) {
        switch (message.action.toLowerCase()) {
            case "generatekey": {
                const proto = await GenerateKeyProto.importProto(await message.exportProto());
                const keys = await this.crypto.subtle.generateKey(proto.algorithm.toAlgorithm(), proto.extractable, proto.usage);

                // add key to memory storage
                let keyProto: BaseProto;
                if ((keys as CryptoKeyPair).privateKey) {
                    const keyPair = keys as CryptoKeyPair;
                    // CryptoKeyPair
                    const thumbprint = await this.getThumbprint(keyPair.publicKey);
                    const publicKey = new ServiceCryptoKey(thumbprint, keyPair.publicKey);
                    const privateKey = new ServiceCryptoKey(thumbprint, keyPair.privateKey);
                    this.memoryStorage.push({ type: "private", session, data: privateKey, id: thumbprint });
                    this.memoryStorage.push({ type: "public", session, data: publicKey, id: thumbprint });

                    // convert `keys` to CryptoKeyPairProto
                    const keyPairProto = new CryptoKeyPairProto();
                    keyPairProto.privateKey = privateKey.toProto();
                    keyPairProto.publicKey = publicKey.toProto();
                    keyProto = keyPairProto;
                } else {
                    // CryptoKey
                    const key = keys as CryptoKey;
                    const thumbprint = await this.getIdentity();
                    const secretKey = new ServiceCryptoKey(thumbprint, key);
                    this.memoryStorage.push({ type: "secret", session, data: secretKey, id: thumbprint });

                    keyProto = secretKey.toProto();
                }

                // prepare and send data
                const resultProto = new ResultProto(message);
                resultProto.data = await keyProto.exportProto();

                return resultProto;
            }
            case "sign": {
                const proto = await SignProto.importProto(await message.exportProto());

                const key = this.getKeyFromStorage(proto.key);
                const signature = await this.crypto.subtle.sign(proto.algorithm.toAlgorithm(), key.key, proto.data);

                // prepare and send data
                const resultProto = new ResultProto(message);
                resultProto.data = signature;
                return resultProto;
            }
            case "verify": {
                const proto = await VerifyProto.importProto(await message.exportProto());

                const key = this.getKeyFromStorage(proto.key);
                const trusted = await this.crypto.subtle.verify(proto.algorithm.toAlgorithm(), key.key, proto.signature, proto.data);

                // prepare and send data
                const resultProto = new ResultProto(message);
                resultProto.data = new Uint8Array([trusted ? 1 : 0]).buffer;

                return resultProto;
            }
            case "derivebits": {
                const proto = await DeriveBitsProto.importProto(await message.exportProto());

                const key = this.getKeyFromStorage(proto.key);
                const alg = proto.algorithm.toAlgorithm();
                const publicKey = await CryptoKeyProto.importProto(proto.algorithm.public);
                alg.public = this.getKeyFromStorage(publicKey).key;
                const bits = await this.crypto.subtle.deriveBits(alg, key.key, proto.length);

                // prepare and send data
                const resultProto = new ResultProto(message);
                resultProto.data = bits;
                return resultProto;
            }
            case "derivekey": {
                const proto = await DeriveKeyProto.importProto(await message.exportProto());

                // prepare incoming data
                const key = this.getKeyFromStorage(proto.key);
                const alg = proto.algorithm.toAlgorithm();
                const publicKey = await CryptoKeyProto.importProto(proto.algorithm.public);
                alg.public = this.getKeyFromStorage(publicKey).key;
                const derivedKeyType = proto.derivedKeyType.toAlgorithm();

                // derive key
                const derivedKey = await this.crypto.subtle.deriveKey(alg, key.key, derivedKeyType, proto.extractable, proto.usage);

                // save key to session storage
                const thumbprint = await this.getIdentity();
                const secretKey = new ServiceCryptoKey(thumbprint, derivedKey);
                this.memoryStorage.push({ type: "secret", session, data: secretKey, id: thumbprint });
                const keyProto = secretKey.toProto();

                // prepare and send data
                const resultProto = new ResultProto(message);
                resultProto.data = await keyProto.exportProto();
                return resultProto;
            }
            case "wrapkey": {
                const proto = await WrapKeyProto.importProto(await message.exportProto());

                // prepare incoming data
                const key = this.getKeyFromStorage(proto.key);
                const wrappingKey = this.getKeyFromStorage(proto.wrappingKey);
                const wrapAlgorithm = proto.wrapAlgorithm.toAlgorithm();

                // derive key
                const wrappedKey = await this.crypto.subtle.wrapKey(proto.format, key.key, wrappingKey.key, wrapAlgorithm);

                // prepare and send data
                const resultProto = new ResultProto(message);
                resultProto.data = wrappedKey;
                return resultProto;
            }
            case "unwrapkey": {
                const proto = await UnwrapKeyProto.importProto(await message.exportProto());

                // prepare incoming data
                const unwrappingKey = this.getKeyFromStorage(proto.unwrappingKey);
                const unwrapAlgorithm = proto.unwrapAlgorithm.toAlgorithm();
                const unwrappedKeyAlgorithm = proto.unwrappedKeyAlgorithm.toAlgorithm();

                // derive key
                const derivedKey = await this.crypto.subtle.unwrapKey(proto.format, proto.wrappedKey, unwrappingKey.key, unwrapAlgorithm, unwrappedKeyAlgorithm, proto.extractable, proto.keyUsage);

                // save key to session storage
                const thumbprint = await this.getIdentity();
                const key = new ServiceCryptoKey(thumbprint, derivedKey);
                this.memoryStorage.push({ type: derivedKey.type, session, data: key, id: thumbprint });
                const keyProto = key.toProto();

                // prepare and send data
                const resultProto = new ResultProto(message);
                resultProto.data = await keyProto.exportProto();
                return resultProto;
            }
            case "exportkey": {
                const proto = await ExportProto.importProto(await message.exportProto());

                const key = this.getKeyFromStorage(proto.key);
                const exportedKey = await this.crypto.subtle.exportKey(proto.format, key.key);

                // prepare and send data
                const resultProto = new ResultProto(message);
                if (!(exportedKey instanceof ArrayBuffer)) {
                    resultProto.data = Convert.FromBinary(JSON.stringify(exportedKey));
                } else {
                    resultProto.data = exportedKey;
                }

                return resultProto;
            }
            case "importkey": {
                const proto = await ImportProto.importProto(await message.exportProto());

                let keyData;
                if (proto.format === "jwk") {
                    keyData = JSON.parse(Convert.ToBinary(proto.keyData));
                } else {
                    keyData = proto.keyData;
                }

                const key = await this.crypto.subtle.importKey(
                    proto.format,
                    keyData,
                    proto.algorithm.toAlgorithm(), proto.extractable, proto.keyUsages || []);

                // add keys to memory storage
                const thumbprint = this.getIdentity();
                const cryptoKey = new ServiceCryptoKey(thumbprint, key);
                this.memoryStorage.push({ type: key.type, session, data: cryptoKey, id: thumbprint });

                // prepare and send data
                const resultProto = new ResultProto(message);
                resultProto.data = await cryptoKey.toProto().exportProto();

                return resultProto;
            }
            case "decrypt":
            case "encrypt": {
                let cryptoFn: (alg: Algorithm, key: CryptoKey, data: ArrayBuffer) => PromiseLike<ArrayBuffer>;
                if (message.action === "encrypt") {
                    cryptoFn = this.crypto.subtle.encrypt;
                } else {
                    cryptoFn = this.crypto.subtle.decrypt;
                }
                const proto = await EncryptProto.importProto(await message.exportProto());
                const key = this.getKeyFromStorage(proto.key);
                const data = await cryptoFn(
                    proto.algorithm.toAlgorithm(),
                    key.key,
                    proto.data);

                // prepare and send data
                const resultProto = new ResultProto(message);
                resultProto.data = data;

                return resultProto;
            }
            // Key storage
            case KeyStorageGetItemProto.ACTION.toLowerCase(): {
                // prepare incoming data
                const proto = await KeyStorageGetItemProto.importProto(await message.exportProto());
                // load key storage
                const keyStorage = new OpenSSLKeyStorage(`.keystorage/${session.cipher.identity.signingKey.publicKey.id}`);
                // do operation
                const key = await keyStorage.getItem(proto.key);

                // add keys to memory storage
                const thumbprint = this.getIdentity();
                const cryptoKey = new ServiceCryptoKey(thumbprint, key);
                this.memoryStorage.push({ type: key.type, session, data: cryptoKey, id: thumbprint });

                // prepare and send data
                const resultProto = new ResultProto(message);
                resultProto.data = await cryptoKey.toProto().exportProto();
                return resultProto;
            }
            case KeyStorageSetItemProto.ACTION.toLowerCase(): {
                // prepare incoming data
                const proto = await KeyStorageSetItemProto.importProto(await message.exportProto());
                const key = this.getKeyFromStorage(proto.item);
                // load key storage
                const keyStorage = new OpenSSLKeyStorage(`.keystorage/${session.cipher.identity.signingKey.publicKey.id}`);
                // do operation
                await keyStorage.setItem(proto.key, key.key);
                // result
                const resultProto = new ResultProto(message);
                return resultProto;
            }
            case KeyStorageRemoveItemProto.ACTION.toLowerCase(): {
                // prepare incoming data
                const proto = await KeyStorageRemoveItemProto.importProto(await message.exportProto());
                // load key storage
                const keyStorage = new OpenSSLKeyStorage(`.keystorage/${session.cipher.identity.signingKey.publicKey.id}`);
                // do operation
                await keyStorage.removeItem(proto.key);
                // result
                const resultProto = new ResultProto(message);
                return resultProto;
            }
            case KeyStorageKeysProto.ACTION.toLowerCase(): {
                // load key storage
                const keyStorage = new OpenSSLKeyStorage(`.keystorage/${session.cipher.identity.signingKey.publicKey.id}`);
                // do operation
                const keys = await keyStorage.keys();
                // result
                const resultProto = new ResultProto(message);
                resultProto.data = Convert.FromUtf8String(keys.join(";"));
                return resultProto;
            }
            // Certificate storage
            case CertificateStorageGetItemProto.ACTION.toLowerCase(): {
                // prepare incoming data
                const proto = await CertificateStorageGetItemProto.importProto(await message.exportProto());
                // load cert storage
                const certStorage = new OpenSSLCertificateStorage(`.certstorage/${session.cipher.identity.signingKey.publicKey.id}`);
                // do operation
                const item = await certStorage.getItem(proto.key);

                // add key to memory storage
                const thumbprint = await this.getThumbprint(item.publicKey);
                const cryptoKey = new ServiceCryptoKey(thumbprint, item.publicKey);
                this.memoryStorage.push({ type: item.type, session, data: cryptoKey, id: thumbprint });

                // prepare and send data
                const resultProto = new ResultProto(message);
                // create Cert proto
                const certProto = await certItemToProto(item, cryptoKey);
                resultProto.data = await certProto.exportProto();
                return resultProto;
            }
            case CertificateStorageSetItemProto.ACTION.toLowerCase(): {
                // prepare incoming data
                const proto = await CertificateStorageSetItemProto.importProto(await message.exportProto());
                // load cert storage
                const certStorage = new OpenSSLCertificateStorage(`.certstorage/${session.cipher.identity.signingKey.publicKey.id}`);
                // do operation
                let certItem: ICertificateStorageItem;
                switch (proto.item.type) {
                    case "x509": {
                        certItem = await X509CertificateProto.importProto(await proto.item.exportProto());
                        break;
                    }
                    case "request": {
                        certItem = await X509RequestProto.importProto(await proto.item.exportProto());
                        break;
                    }
                    default:
                        throw new Error(`Unsupported CertificateItem type '${proto.item.type}'`);
                }
                await certStorage.setItem(proto.key, certItem);
                // result
                const resultProto = new ResultProto(message);
                return resultProto;
            }
            case CertificateStorageRemoveItemProto.ACTION.toLowerCase(): {
                // prepare incoming data
                const proto = await CertificateStorageRemoveItemProto.importProto(await message.exportProto());
                // load cert storage
                const certStorage = new OpenSSLCertificateStorage(`.certstorage/${session.cipher.identity.signingKey.publicKey.id}`);
                // do operation
                await certStorage.removeItem(proto.key);
                // result
                const resultProto = new ResultProto(message);
                return resultProto;
            }
            case CertificateStorageImportProto.ACTION.toLowerCase(): {
                // prepare incoming data
                const proto = await CertificateStorageImportProto.importProto(await message.exportProto());
                // load cert storage
                const certStorage = new OpenSSLCertificateStorage(`.certstorage/${session.cipher.identity.signingKey.publicKey.id}`);
                // do operation
                const item = await certStorage.importCert(proto.type, proto.data, proto.algorithm, proto.keyUsages);
                // add key to memory storage
                const thumbprint = await this.getThumbprint(item.publicKey);
                const cryptoKey = new ServiceCryptoKey(thumbprint, item.publicKey);
                this.memoryStorage.push({ type: item.type, session, data: cryptoKey, id: thumbprint });
                // convert cert item to proto
                const certProto = await certItemToProto(item, cryptoKey);
                // result
                const resultProto = new ResultProto(message);
                resultProto.data = await certProto.exportProto();
                return resultProto;
            }
            case CertificateStorageKeysProto.ACTION.toLowerCase(): {
                // load cert storage
                const certStorage = new OpenSSLCertificateStorage(`.certstorage/${session.cipher.identity.signingKey.publicKey.id}`);
                // do operation
                const keys = await certStorage.keys();
                // result
                const resultProto = new ResultProto(message);
                resultProto.data = Convert.FromUtf8String(keys.join(";"));
                return resultProto;
            }
            default:
                throw new Error(`Unknown action '${message.action}'`);
        }
    }

    protected async getThumbprint(key: CryptoKey) {
        if (key.type !== "public") {
            throw new Error("Wrong type of CryptoKey, ust be 'public'");
        }
        const raw = await this.crypto.subtle.exportKey("spki", key);
        const thumbprint = await this.crypto.subtle.digest("SHA-256", raw);
        return Convert.ToHex(thumbprint);
    }

    protected getKeyFromStorage(key: CryptoKeyProto) {
        let res: ServiceCryptoKey;
        // search key
        this.memoryStorage.some((item) => {
            if (item.type === key.type &&
                item.id === key.id) {
                res = item.data;
                return true;
            }
            return false;
        });
        return res || null;
    }

    protected getIdentity() {
        return Convert.ToHex(this.crypto.getRandomValues(new Uint8Array(20)).buffer);
    }

}

async function certItemToProto(item: ICertificateStorageItem, publicKey: ServiceCryptoKey) {
    let certProto: CertificateItemProto;
    switch (item.type) {
        case "x509": {
            const x509Proto = new X509CertificateProto();
            const x509 = item as IX509Certificate;
            x509Proto.id = x509.id;
            x509Proto.serialNumber = x509.serialNumber;
            x509Proto.issuerName = x509.issuerName;
            x509Proto.subjectName = x509.subjectName;
            x509Proto.publicKey = await publicKey.toProto();
            x509Proto.type = item.type;
            x509Proto.value = item.value;
            certProto = x509Proto;
            break;
        }
        case "request": {
            const x509Proto = new X509RequestProto();
            const x509 = item as IX509Request;
            x509Proto.id = x509.id;
            x509Proto.subjectName = x509.subjectName;
            x509Proto.publicKey = await publicKey.toProto();
            x509Proto.type = item.type;
            x509Proto.value = item.value;
            certProto = x509Proto;
            break;
        }
        default:
            throw new Error(`Unsupported CertificateItem type '${item.type}'`);
    }
    return certProto;
}
