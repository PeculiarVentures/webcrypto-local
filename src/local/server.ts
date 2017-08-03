import { EventEmitter } from "events";
import * as graphene from "graphene-pk11";
import * as https from "https";
import { Convert } from "pvtsutils";
import * as request from "request";
import { ObjectProto } from "tsprotobuf";
import { challenge } from "../connection/challenge";
import { Server, Session } from "../connection/server";
import { ActionProto, CryptoItemProto, CryptoKeyPairProto, CryptoKeyProto, ResultProto, ServerIsLoggedInActionProto, ServerLoginActionProto } from "../core/proto";
import {
    CertificateStorageClearActionProto, CertificateStorageExportActionProto, CertificateStorageGetChainActionProto,
    CertificateStorageGetChainResultProto, CertificateStorageGetCRLActionProto, CertificateStorageGetItemActionProto,
    CertificateStorageGetOCSPActionProto, CertificateStorageImportActionProto, CertificateStorageIndexOfActionProto,
    CertificateStorageKeysActionProto, CertificateStorageRemoveItemActionProto, CertificateStorageSetItemActionProto, ChainItemProto,
} from "../core/protos/certstorage";
import { ArrayStringConverter } from "../core/protos/converter";
import { IsLoggedInActionProto, LoginActionProto, ResetActionProto, CryptoActionProto } from "../core/protos/crypto";
import {
    KeyStorageClearActionProto, KeyStorageGetItemActionProto, KeyStorageIndexOfActionProto,
    KeyStorageKeysActionProto, KeyStorageRemoveItemActionProto, KeyStorageSetItemActionProto,
} from "../core/protos/keystorage";
import {
    ProviderAuthorizedEventProto, ProviderCryptoProto, ProviderGetCryptoActionProto,
    ProviderInfoActionProto, ProviderTokenEventProto,
} from "../core/protos/provider";
import {
    DecryptActionProto, DeriveBitsActionProto, DeriveKeyActionProto,
    DigestActionProto, EncryptActionProto, ExportKeyActionProto,
    GenerateKeyActionProto, ImportKeyActionProto, SignActionProto,
    UnwrapKeyActionProto, VerifyActionProto, WrapKeyActionProto,
} from "../core/protos/subtle";
import { ServiceCryptoItem } from "./crypto_item";
import { LocalProvider, ProviderCrypto } from "./provider";

import * as asn1js from "asn1js";
import { isEqualBuffer } from "pvutils";
// import { X509Certificate } from "../pki/x509";
const {
    Certificate, CertificateRevocationList, OCSPResponse, CertificateChainValidationEngine, setEngine
 } = require("pkijs");

// register new attribute for pkcs11 modules
graphene.registerAttribute("x509Chain", 2147483905, "buffer");

const crypto: Crypto = new (require("node-webcrypto-ossl"))();

export class LocalServer extends EventEmitter {

    public server: Server;
    public provider: LocalProvider;
    public cryptos: { [id: string]: Crypto } = {};
    public sessions: Session[] = [];

    protected memoryStorage: ServiceCryptoItem[] = [];

    constructor(options: https.ServerOptions) {
        super();

        this.server = new Server(options);
        this.provider = new LocalProvider()
            .on("token", (info) => {
                this.emit("info", `Provider:Tokens changed (+${info.added.length}/-${info.removed.length})`);
                this.sessions.forEach((session) => {
                    if (session.cipher && session.authorized) {
                        info.removed.forEach((item, index) => {
                            info.removed[index] = new ProviderCryptoProto(item);
                        });
                        info.added.forEach((item, index) => {
                            info.added[index] = new ProviderCryptoProto(item);
                        });
                        this.server.send(session, new ProviderTokenEventProto(info))
                            .catch((e) => {
                                console.error(e);
                            });
                    }
                });
            })
            .on("info", (message: string) => {
                this.emit("info", message);
            })
            .on("error", (e) => {
                this.emit("error", e);
            });
    }

    public listen(address: string) {
        this.server.listen(address);
        this.server
            .on("listening", (e) => {
                this.emit("listening", e.address);
                this.provider.open()
                    .catch((err) => {
                        this.emit("info", "Provider:Open Error");
                        this.emit("error", err);
                    })
                    .then(() => {
                        this.emit("info", "Provider:Opened");
                    });
            })
            .on("connect", (session) => {
                this.emit("info", `Server: New session connect ${session.connection.remoteAddress}`);
                // check connection in stack
                if (!(this.sessions.length && this.sessions.some((item) => item === session))) {
                    this.emit("info", `Server: Push session to stack`);
                    this.sessions.push(session);
                }
            })
            .on("disconnect", (e) => {
                // TODO: Remove closed session from `this.sessions`
                this.emit("info", `Server: Close session ${e.description} (code: ${e.reasonCode})`);
            })
            .on("error", (e) => {
                this.emit("error", e.error);
            })
            .on("message", (e) => {
                (async () => {
                    const sessionIdentitySHA256 = await e.session.cipher.remoteIdentity.signingKey.thumbprint();
                    let providerID: string;
                    try {
                        const cryptoMessage = await CryptoActionProto.importProto(e.message);
                        providerID = cryptoMessage.providerID;
                    } catch (err) {
                        providerID = "";
                    }
                    this.emit("info", `Server: session:${sessionIdentitySHA256} ${providerID ? `provider:${providerID}` : ""} ${e.message.action}`);
                    this.onMessage(e.session, e.message)
                        .then(e.resolve, e.reject);
                })()
                    .catch((error) => {
                        this.on("error", error);
                    });
            })
            .on("auth", (session) => {
                this.emit("info", "Server: session auth");
                this.server.send(session, new ProviderAuthorizedEventProto())
                    .catch((e) => {
                        this.emit("error", e);
                    });
            });
        return this;
    }

    public on(event: "info", cb: (message: string) => void): this;
    public on(event: "listening", cb: Function): this;
    public on(event: "error", cb: Function): this;
    public on(event: "close", cb: Function): this;
    public on(event: "notify", cb: Function): this;
    public on(event: string, cb: Function) {
        return super.on(event, cb);
    }

    protected async onMessage(session: Session, action: ActionProto) {
        const resultProto = new ResultProto(action);

        let data: ArrayBuffer | undefined;
        switch (action.action) {
            // Server
            case ServerIsLoggedInActionProto.ACTION: {
                data = new Uint8Array([session.authorized ? 1 : 0]).buffer;
                break;
            }
            case ServerLoginActionProto.ACTION: {
                if (!session.authorized) {
                    // Session is not authorized
                    // generate OTP
                    const pin = await challenge(this.server.identity.signingKey.publicKey, session.cipher.remoteIdentity.signingKey);
                    // Show notice
                    const promise = new Promise<boolean>((resolve, reject) => {
                        this.emit("notify", {
                            type: "2key",
                            pin,
                            resolve,
                            reject,
                        });
                    });
                    const ok = await promise;
                    if (ok) {
                        this.server.storage.saveRemoteIdentity(session.cipher.remoteIdentity.signingKey.id, session.cipher.remoteIdentity);
                        session.authorized = true;
                    } else {
                        throw new Error("PIN is not approved");
                    }
                }
                break;
            }
            // Provider
            case ProviderInfoActionProto.ACTION: {
                const info = this.provider.info;
                data = await info.exportProto();
                break;
            }
            case ProviderGetCryptoActionProto.ACTION: {
                const getCryptoParams = await ProviderGetCryptoActionProto.importProto(action);

                await this.provider.getCrypto(getCryptoParams.cryptoID);

                break;
            }
            // crypto
            case IsLoggedInActionProto.ACTION: {
                const params = await IsLoggedInActionProto.importProto(action);

                const crypto = await this.provider.getCrypto(params.providerID);
                data = new Uint8Array([crypto.isLoggedIn ? 1 : 0]).buffer;
                break;
            }
            case LoginActionProto.ACTION: {
                const params = await LoginActionProto.importProto(action);

                const crypto = await this.provider.getCrypto(params.providerID);

                if (crypto.login) {
                    // show prompt
                    const promise = new Promise<string>((resolve, reject) => {
                        this.emit("notify", {
                            type: "pin",
                            resolve,
                            reject,
                        });
                    });
                    const pin = await promise;
                    crypto.login(pin);
                }
                break;
            }
            case ResetActionProto.ACTION: {
                const params = await ResetActionProto.importProto(action);
                const crypto = await this.provider.getCrypto(params.providerID);

                if ("reset" in crypto) {
                    // node-webcrypto-p11 has reset method
                    await (crypto as any).reset();
                }
                break;
            }
            // crypto/subtle
            case DigestActionProto.ACTION: {
                const params = await DigestActionProto.importProto(action);

                const crypto = await this.provider.getCrypto(params.providerID);

                data = await crypto.subtle.digest(params.algorithm, params.data);
                break;
            }
            case GenerateKeyActionProto.ACTION: {
                const params = await GenerateKeyActionProto.importProto(action);

                const crypto = await this.provider.getCrypto(params.providerID);
                const keys = await crypto.subtle.generateKey(params.algorithm, params.extractable, params.usage);

                // add key to memory storage
                let keyProto: ObjectProto;
                if ((keys as CryptoKeyPair).privateKey) {
                    const keyPair = keys as CryptoKeyPair;
                    // CryptoKeyPair
                    // const thumbprint = await GetIdentity(keyPair.publicKey, crypto);
                    const publicKey = new ServiceCryptoItem(getHandle(), keyPair.publicKey, params.providerID);
                    const privateKey = new ServiceCryptoItem(getHandle(), keyPair.privateKey, params.providerID);
                    this.memoryStorage.push(publicKey);
                    this.memoryStorage.push(privateKey);

                    // convert `keys` to CryptoKeyPairProto
                    const keyPairProto = new CryptoKeyPairProto();
                    keyPairProto.privateKey = privateKey.toProto() as CryptoKeyProto;
                    keyPairProto.publicKey = publicKey.toProto() as CryptoKeyProto;
                    keyProto = keyPairProto;
                } else {
                    // CryptoKey
                    const key: CryptoKey = keys as any;
                    // const thumbprint = await GetIdentity(key, crypto);
                    const secretKey = new ServiceCryptoItem(getHandle(), key, params.providerID);
                    this.memoryStorage.push(secretKey);

                    keyProto = secretKey.toProto();
                }

                data = await keyProto.exportProto();
                break;
            }
            case SignActionProto.ACTION: {
                const params = await SignActionProto.importProto(action);

                const crypto = await this.provider.getCrypto(params.providerID);

                const key = this.getItemFromStorage(params.key).item as CryptoKey;
                data = await crypto.subtle.sign(params.algorithm.toAlgorithm(), key, params.data);
                break;
            }
            case VerifyActionProto.ACTION: {
                const params = await VerifyActionProto.importProto(action);

                const crypto = await this.provider.getCrypto(params.providerID);

                const key = this.getItemFromStorage(params.key).item as CryptoKey;
                const ok = await crypto.subtle.verify(params.algorithm.toAlgorithm(), key, params.signature, params.data);

                data = new Uint8Array([ok ? 1 : 0]).buffer;
                break;
            }
            case EncryptActionProto.ACTION: {
                const params = await EncryptActionProto.importProto(action);

                const crypto = await this.provider.getCrypto(params.providerID);
                const key = this.getItemFromStorage(params.key).item as CryptoKey;

                data = await crypto.subtle.encrypt(params.algorithm.toAlgorithm(), key, params.data);
                break;
            }
            case DecryptActionProto.ACTION: {
                const params = await DecryptActionProto.importProto(action);

                const crypto = await this.provider.getCrypto(params.providerID);
                const key = this.getItemFromStorage(params.key).item as CryptoKey;

                data = await crypto.subtle.decrypt(params.algorithm.toAlgorithm(), key, params.data);
                break;
            }
            case DeriveBitsActionProto.ACTION: {
                const params = await DeriveBitsActionProto.importProto(action);

                const crypto = await this.provider.getCrypto(params.providerID);
                const key = this.getItemFromStorage(params.key).item as CryptoKey;
                const alg = params.algorithm.toAlgorithm();
                const publicKey = await CryptoKeyProto.importProto(alg.public);
                alg.public = this.getItemFromStorage(publicKey).item as CryptoKey;

                data = await crypto.subtle.deriveBits(alg, key, params.length);
                break;
            }
            case DeriveKeyActionProto.ACTION: {
                const params = await DeriveKeyActionProto.importProto(action);

                const crypto = await this.provider.getCrypto(params.providerID);
                const key = this.getItemFromStorage(params.key).item as CryptoKey;
                const alg = params.algorithm.toAlgorithm();
                const publicKey = await CryptoKeyProto.importProto(alg.public);
                alg.public = this.getItemFromStorage(publicKey).item as CryptoKey;

                const derivedKey = await crypto.subtle.deriveKey(alg, key, params.derivedKeyType, params.extractable, params.usage);

                // put key to memory storage
                // const thumbprint = await GetIdentity(derivedKey, crypto);
                const resKey = new ServiceCryptoItem(getHandle(), derivedKey, params.providerID);
                this.memoryStorage.push(resKey);

                data = await resKey.toProto().exportProto();
                break;
            }
            case WrapKeyActionProto.ACTION: {
                const params = await WrapKeyActionProto.importProto(action);

                const crypto = await this.provider.getCrypto(params.providerID);
                const key = await this.getItemFromStorage(params.key).item as CryptoKey;
                const wrappingKey = this.getItemFromStorage(params.wrappingKey).item as CryptoKey;

                data = await crypto.subtle.wrapKey(
                    params.format,
                    key,
                    wrappingKey,
                    params.wrapAlgorithm.toAlgorithm()
                );
                break;
            }
            case UnwrapKeyActionProto.ACTION: {
                const params = await UnwrapKeyActionProto.importProto(action);

                const crypto = await this.provider.getCrypto(params.providerID);
                const unwrappingKey = await this.getItemFromStorage(params.unwrappingKey).item as CryptoKey;

                const key = await crypto.subtle.unwrapKey(
                    params.format,
                    params.wrappedKey,
                    unwrappingKey,
                    params.unwrapAlgorithm.toAlgorithm(),
                    params.unwrappedKeyAlgorithm.toAlgorithm(),
                    params.extractable,
                    params.keyUsage,
                );

                // put key to memory storage
                // const thumbprint = await GetIdentity(key, crypto);
                const resKey = new ServiceCryptoItem(getHandle(), key, params.providerID);
                this.memoryStorage.push(resKey);

                data = await resKey.toProto().exportProto();
                break;
            }
            case ExportKeyActionProto.ACTION: {
                const params = await ExportKeyActionProto.importProto(action);

                const crypto = await this.provider.getCrypto(params.providerID);
                const key = await this.getItemFromStorage(params.key).item as CryptoKey;

                const exportedData = await crypto.subtle.exportKey(
                    params.format,
                    key,
                );

                if (params.format.toLowerCase() === "jwk") {
                    const json = JSON.stringify(exportedData);
                    data = Convert.FromUtf8String(json);
                } else {
                    data = exportedData as ArrayBuffer;
                }

                break;
            }
            case ImportKeyActionProto.ACTION: {
                const params = await ImportKeyActionProto.importProto(action);

                const crypto = await this.provider.getCrypto(params.providerID);

                let keyData: JsonWebKey | ArrayBuffer;
                if (params.format.toLowerCase() === "jwk") {
                    const json = Convert.ToUtf8String(params.keyData);
                    keyData = JSON.parse(json);
                } else {
                    keyData = params.keyData;
                }

                const key = await crypto.subtle.importKey(
                    params.format,
                    keyData,
                    params.algorithm.toAlgorithm(),
                    params.extractable,
                    params.keyUsages,
                );

                // put key to memory storage
                // const thumbprint = await GetIdentity(key, crypto);
                const resKey = new ServiceCryptoItem(getHandle(), key, params.providerID);
                this.memoryStorage.push(resKey);

                data = await resKey.toProto().exportProto();
                break;
            }
            // Key storage
            case KeyStorageGetItemActionProto.ACTION: {
                // prepare incoming data
                const params = await KeyStorageGetItemActionProto.importProto(action);
                const crypto = await this.provider.getCrypto(params.providerID);

                // do operation
                const key = await crypto.keyStorage.getItem(
                    params.key,
                    params.algorithm.isEmpty() ? null : params.algorithm,
                    !params.keyUsages ? null : params.keyUsages,
                );

                if (key) {
                    // add keys to memory storage
                    if (!key) {
                        throw new Error(`Cannot get key by identity '${params.key}'`);
                    }
                    // const thumbprint = await GetIdentity(key, crypto);
                    const cryptoKey = new ServiceCryptoItem(getHandle(), key, params.providerID);
                    this.memoryStorage.push(cryptoKey);

                    data = await cryptoKey.toProto().exportProto();
                }
                break;
            }
            case KeyStorageSetItemActionProto.ACTION: {
                // prepare incoming data
                const params = await KeyStorageSetItemActionProto.importProto(action);
                const key = this.getItemFromStorage(params.item).item as CryptoKey;
                const crypto = await this.provider.getCrypto(params.providerID);
                // do operation
                if ((key.algorithm as any).toAlgorithm) {
                    (key as any).algorithm = (key.algorithm as any).toAlgorithm();
                }
                const index = await crypto.keyStorage.setItem(key);
                data = Convert.FromUtf8String(index);
                // result
                break;
            }
            case KeyStorageRemoveItemActionProto.ACTION: {
                // prepare incoming data
                const params = await KeyStorageRemoveItemActionProto.importProto(action);
                const crypto = await this.provider.getCrypto(params.providerID);
                // do operation
                await crypto.keyStorage.removeItem(params.key);
                // result
                break;
            }
            case KeyStorageKeysActionProto.ACTION: {
                // load key storage
                const params = await KeyStorageKeysActionProto.importProto(action);
                const crypto = await this.provider.getCrypto(params.providerID);
                // do operation
                const keys = await crypto.keyStorage.keys();
                // result
                data = (await ArrayStringConverter.set(keys)).buffer;
                break;
            }
            case KeyStorageIndexOfActionProto.ACTION: {
                // load cert storage
                const params = await KeyStorageIndexOfActionProto.importProto(action);
                const crypto = await this.provider.getCrypto(params.providerID);
                const key = this.getItemFromStorage(params.item).item as CryptoKey;

                // do operation
                const index = await crypto.keyStorage.indexOf(key);
                // result
                if (index) {
                    data = Convert.FromUtf8String(index);
                }
                break;
            }
            case KeyStorageClearActionProto.ACTION: {
                // load cert storage
                const params = await KeyStorageClearActionProto.importProto(action);
                const crypto = await this.provider.getCrypto(params.providerID);

                // do operation
                await crypto.certStorage.clear();
                // result
                break;
            }
            // Certificate storage
            case CertificateStorageGetItemActionProto.ACTION: {
                // prepare incoming data
                const params = await CertificateStorageGetItemActionProto.importProto(action);
                const crypto = await this.provider.getCrypto(params.providerID);
                // do operation
                const item = await crypto.certStorage.getItem(
                    params.key,
                    params.algorithm.isEmpty() ? null : params.algorithm,
                    !params.keyUsages ? null : params.keyUsages,
                );

                if (item) {
                    // add key to memory storage
                    // const thumbprint = await GetIdentity(item.publicKey, crypto);
                    const cryptoKey = new ServiceCryptoItem(getHandle(), item.publicKey, params.providerID);
                    this.memoryStorage.push(cryptoKey);
                    // add cert to memory storage
                    const cryptoCert = new ServiceCryptoItem(getHandle(), item, params.providerID);
                    this.memoryStorage.push(cryptoCert);

                    // create Cert proto
                    data = await cryptoCert.toProto().exportProto();
                }
                break;
            }
            case CertificateStorageSetItemActionProto.ACTION: {
                // prepare incoming data
                const params = await CertificateStorageSetItemActionProto.importProto(action);
                const crypto = await this.provider.getCrypto(params.providerID);
                const cert = this.getItemFromStorage(params.item).item as CryptoCertificate;
                // do operation
                const index = await crypto.certStorage.setItem(cert);
                data = Convert.FromUtf8String(index);
                // result
                break;
            }
            case CertificateStorageRemoveItemActionProto.ACTION: {
                // prepare incoming data
                const params = await CertificateStorageRemoveItemActionProto.importProto(action);
                const crypto = await this.provider.getCrypto(params.providerID);
                // do operation
                await crypto.certStorage.removeItem(params.key);
                // result
                break;
            }
            case CertificateStorageImportActionProto.ACTION: {
                // prepare incoming data
                const params = await CertificateStorageImportActionProto.importProto(action);
                const crypto = await this.provider.getCrypto(params.providerID);
                // do operation
                const item = await crypto.certStorage.importCert(params.type, params.data, params.algorithm, params.keyUsages);
                // add key to memory storage
                // const thumbprint = await GetIdentity(item.publicKey, crypto);
                const cryptoKey = new ServiceCryptoItem(getHandle(), item.publicKey, params.providerID);
                this.memoryStorage.push(cryptoKey);
                // add cert to memory storage
                const cryptoCert = new ServiceCryptoItem(getHandle(), item, params.providerID);
                this.memoryStorage.push(cryptoCert);
                // result
                data = await cryptoCert.toProto().exportProto();
                break;
            }
            case CertificateStorageExportActionProto.ACTION: {
                // prepare incoming data
                const params = await CertificateStorageExportActionProto.importProto(action);
                const crypto = await this.provider.getCrypto(params.providerID);
                const cert = this.getItemFromStorage(params.item).item as CryptoCertificate;
                // do operation
                const exportedData = await crypto.certStorage.exportCert(params.format, cert);

                // result
                if (exportedData instanceof ArrayBuffer) {
                    data = exportedData;
                } else {
                    data = Convert.FromUtf8String(exportedData);
                }
                break;
            }
            case CertificateStorageKeysActionProto.ACTION: {
                // load cert storage
                const params = await CertificateStorageKeysActionProto.importProto(action);
                const crypto = await this.provider.getCrypto(params.providerID);

                // do operation
                const keys = await crypto.certStorage.keys();
                // result
                data = (await ArrayStringConverter.set(keys)).buffer;
                break;
            }
            case CertificateStorageClearActionProto.ACTION: {
                // load cert storage
                const params = await CertificateStorageKeysActionProto.importProto(action);
                const crypto = await this.provider.getCrypto(params.providerID);

                // do operation
                await crypto.certStorage.clear();
                // result
                break;
            }
            case CertificateStorageIndexOfActionProto.ACTION: {
                // load cert storage
                const params = await CertificateStorageIndexOfActionProto.importProto(action);
                const crypto = await this.provider.getCrypto(params.providerID);
                const cert = this.getItemFromStorage(params.item).item as CryptoCertificate;

                // do operation
                const index = await crypto.certStorage.indexOf(cert);
                // result
                if (index) {
                    data = Convert.FromUtf8String(index);
                }
                break;
            }
            case CertificateStorageGetChainActionProto.ACTION: {
                // load cert storage
                const params = await CertificateStorageGetChainActionProto.importProto(action);
                const crypto = await this.provider.getCrypto(params.providerID);
                const cert = this.getItemFromStorage(params.item).item as CryptoCertificate;
                // Get chain works only for x509 item type
                if (cert.type !== "x509") {
                    throw new Error("Wrong item type, must be 'x509'");
                }

                // do operation
                const resultProto = new CertificateStorageGetChainResultProto();
                const pkiEntryCert = await certC2P(crypto, cert);
                if (pkiEntryCert.subject.isEqual(pkiEntryCert.issuer)) { // self-signed
                    // Dont build chain for self-signed certificates 
                    const itemProto = new ChainItemProto();
                    itemProto.type = "x509";
                    itemProto.value = pkiEntryCert.toSchema(true).toBER(false);

                    resultProto.items.push(itemProto);
                } else if ("session" in crypto) {
                    let buffer: Buffer;
                    let isX509ChainSupported = true;
                    try {
                        buffer = (cert as any).p11Object.getAttribute("x509Chain") as Buffer;
                    } catch (e) {
                        isX509ChainSupported = false;
                    }

                    if (isX509ChainSupported) {
                        const ulongSize = (cert as any).p11Object.handle.length;
                        let i = 0;
                        while (i < buffer.length) {
                            const itemType = buffer.slice(i, i + 1)[0];
                            const itemProto = new ChainItemProto();
                            switch (itemType) {
                                case 1:
                                    itemProto.type = "x509";
                                    break;
                                case 2:
                                    itemProto.type = "crl";
                                    break;
                                default:
                                    throw new Error("Unknown type of item of chain");
                            }
                            i++;
                            const itemSizeBuffer = buffer.slice(i, i + ulongSize);
                            const itemSize = itemSizeBuffer.readInt32LE(0);
                            const itemValue = buffer.slice(i + ulongSize, i + ulongSize + itemSize)
                            itemProto.value = new Uint8Array(itemValue).buffer;
                            resultProto.items.push(itemProto);
                            i += ulongSize + itemSize;
                        }
                    } else {
                        // Get all certificates from token
                        const indexes = await crypto.certStorage.keys();
                        const trustedCerts = [];
                        const certs = [];
                        for (const index of indexes) {
                            // only certs
                            const parts = index.split("-");
                            if (parts[0] !== "x509") {
                                continue;
                            }

                            const cryptoCert = await crypto.certStorage.getItem(index);
                            const pkiCert = await certC2P(crypto, cryptoCert);
                            // don't add entry cert
                            // TODO: https://github.com/PeculiarVentures/PKI.js/issues/114
                            if (isEqualBuffer(pkiEntryCert.tbs, pkiCert.tbs)) {
                                continue;
                            }
                            if (pkiCert.subject.isEqual(pkiCert.issuer)) { // Self-signed cert
                                trustedCerts.push(pkiCert);
                            } else {
                                certs.push(pkiCert);
                            }
                        }
                        // Add entry certificate to the end of array
                        // NOTE: PKIjs builds chain for the last certificate in list
                        if (pkiEntryCert.subject.isEqual(pkiEntryCert.issuer)) { // Self-signed cert
                            trustedCerts.push(pkiEntryCert);
                        }
                        certs.push(pkiEntryCert);
                        // Build chain for certs
                        setEngine("PKCS#11 provider", crypto, crypto.subtle);
                        // console.log("Print incoming certificates");
                        // console.log("Trusted:");
                        // console.log("=================================");
                        // await printCertificates(crypto, trustedCerts);
                        // console.log("Certificates:");
                        // console.log("=================================");
                        // await printCertificates(crypto, certs);
                        const chainBuilder = new CertificateChainValidationEngine({
                            trustedCerts,
                            certs,
                        });

                        const chain = await chainBuilder.verify();
                        let resultChain = [];
                        if (chain.result) {
                            // Chain was created
                            resultChain = chainBuilder.certs;
                        } else {
                            // cannot build chain. Return only entry certificate
                            resultChain = [pkiEntryCert];
                        }
                        // Put certs to result
                        for (const item of resultChain) {
                            const itemProto = new ChainItemProto();
                            itemProto.type = "x509";
                            itemProto.value = item.toSchema(true).toBER(false);

                            resultProto.items.push(itemProto);
                        }
                    }
                } else {
                    throw new Error("Provider doesn't support GetChain method");
                }

                // result
                data = await resultProto.exportProto();

                break;
            }
            case CertificateStorageGetCRLActionProto.ACTION: {
                const params = await CertificateStorageGetCRLActionProto.importProto(action);

                // do operation
                const crlArray = await new Promise<ArrayBuffer>((resolve, reject) => {
                    request(params.url, { encoding: null }, (err, response, body) => {
                        try {
                            const message = `Cannot get CRL by URI '${params.url}'`;
                            if (err) {
                                throw new Error(`${message}. ${err.message}`);
                            }
                            if (response.statusCode !== 200) {
                                throw new Error(`${message}. Bad status ${response.statusCode}`);
                            }

                            if (Buffer.isBuffer(body)) {
                                body = body.toString("binary");
                            }
                            body = prepareData(body);
                            // convert body to ArrayBuffer
                            body = new Uint8Array(body).buffer;

                            // try to parse CRL for checking
                            try {
                                const asn1 = asn1js.fromBER(body);
                                if (asn1.result.error) {
                                    throw new Error(`ASN1: ${asn1.result.error}`);
                                }
                                const crl = new CertificateRevocationList({
                                    schema: asn1.result,
                                });
                                if (!crl) {
                                    throw new Error(`variable crl is empty`);
                                }
                            } catch (e) {
                                console.error(e);
                                throw new Error(`Cannot parse received CRL from URI '${params.url}'`);
                            }

                            resolve(body);
                        } catch (e) {
                            reject(e);
                        }
                    });
                });

                // result
                data = crlArray;

                break;
            }
            case CertificateStorageGetOCSPActionProto.ACTION: {
                const params = await CertificateStorageGetOCSPActionProto.importProto(action);

                // do operation
                const ocspArray = await new Promise<ArrayBuffer>((resolve, reject) => {
                    let url = params.url;
                    const options: request.CoreOptions = { encoding: null };
                    if (params.options.method === "get") {
                        // GET
                        const b64 = new Buffer(params.url).toString("hex");
                        url += "/" + b64;
                        options.method = "get";
                    } else {
                        // POST
                        options.method = "post";
                        options.headers = { "Content-Type": "application/ocsp-request" };
                        options.body = new Buffer(params.request).toString("binary");
                    }
                    request(url, options, (err, response, body) => {
                        try {
                            const message = `Cannot get OCSP by URI '${params.url}'`;
                            if (err) {
                                throw new Error(`${message}. ${err.message}`);
                            }
                            if (response.statusCode !== 200) {
                                throw new Error(`${message}. Bad status ${response.statusCode}`);
                            }

                            if (Buffer.isBuffer(body)) {
                                body = body.toString("binary");
                            }
                            body = prepareData(body);
                            // convert body to ArrayBuffer
                            body = new Uint8Array(body).buffer;

                            // try to parse CRL for checking
                            try {
                                const asn1 = asn1js.fromBER(body);
                                if (asn1.result.error) {
                                    throw new Error(`ASN1: ${asn1.result.error}`);
                                }
                                const ocsp = new OCSPResponse({
                                    schema: asn1.result,
                                });
                                if (!ocsp) {
                                    throw new Error(`variable ocsp is empty`);
                                }
                            } catch (e) {
                                console.error(e);
                                throw new Error(`Cannot parse received OCSP from URI '${params.url}'`);
                            }

                            resolve(body);
                        } catch (e) {
                            reject(e);
                        }
                    });
                });

                // result
                data = ocspArray;

                break;
            }
            default:
                throw new Error(`Unknown action '${action.action}'`);
        }
        resultProto.data = data;
        return resultProto;
    }

    protected getItemFromStorage(cryptoItem: CryptoItemProto) {
        let foundKey: ServiceCryptoItem;
        this.memoryStorage.some((item) => {
            if (item.id === cryptoItem.id &&
                item.providerID === cryptoItem.providerID &&
                item.item.type === cryptoItem.type
            ) {
                foundKey = item;
            }
            return !!foundKey;
        });
        if (!foundKey) {
            if (!crypto) {
                throw new Error(`Cannot get CryptoItem by ID '${cryptoItem.id}'`);
            }
        }
        return foundKey;
    }

}

// async function GetIdentity(key: CryptoKey, provider: Crypto) {
//     if (key.type !== "public") {
//         return getHandle(32);
//     } else {
//         const jwk = await provider.subtle.exportKey("jwk", key); // INFO: Not all crypto implementations support spki
//         const osslKey = await crypto.subtle.importKey("jwk", jwk, key.algorithm as any, true, key.usages);
//         const raw = await crypto.subtle.exportKey("spki", osslKey);
//         const thumbprint = await crypto.subtle.digest("SHA-256", raw);
//         return Convert.ToHex(thumbprint);
//     }
// }

function getHandle(size = 20) {
    const rndBytes = crypto.getRandomValues(new Uint8Array(size)) as Uint8Array;
    return Convert.ToHex(rndBytes);
}

function prepareData(data: string) {
    if (data.indexOf("-----") === 0) {
        // incoming data is PEM encoded string
        data = data.replace(/-----[\w\s]+-----/gi, "").replace(/[\n\r]/g, "");
        return new Buffer(data, "base64");
    } else {
        return new Buffer(data, "binary");
    }
}


/**
 * Converts CryptoCertificate to PKIjs Certificate
 * 
 * @param {ProviderCrypto}      crypto      Crypto provider
 * @param {CryptoCertificate}   cert        Crypto certificate
 * @returns 
 */
async function certC2P(provider: ProviderCrypto, cert: CryptoCertificate) {
    const certDer = await provider.certStorage.exportCert("raw", cert);
    const asn1 = asn1js.fromBER(certDer);
    const pkiCert = new Certificate({ schema: asn1.result });
    return pkiCert;
}

// /**
//  * Prints pkijs certificate's names to console
//  * 
//  * @param {ProviderCrypto} crypto 
//  * @param {any[]} pkiCerts 
//  */
// async function printCertificates(crypto: ProviderCrypto, pkiCerts: any[]) {
//     for (const pkiCert of pkiCerts) {
//         const cert = await X509Certificate.importCert(crypto, pkiCert.toSchema(true).toBER(false));
//         console.log("Certificate:");
//         console.log("\tsubject:", cert.subjectName);
//         console.log("\tissuer:", cert.issuerName);
//     }
// }
