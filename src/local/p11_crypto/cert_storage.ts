/**
 * NOTE: We are using PKCS#11 Certificate storage directly from built folder,
 * because it's not exported from node-webcrypto-p11 module
 */

import { X509Certificate } from "graphene-pk11";
import { CertificateStorage, ICryptoCertificate } from "node-webcrypto-p11";

import { Pkcs11Crypto } from "./crypto";
import { fixObject, isOsslObject } from "./helper";

export class Pkcs11CertificateStorage extends CertificateStorage {

    protected crypto: Pkcs11Crypto;

    constructor(crypto: Pkcs11Crypto) {
        super(crypto);
    }

    public getItem(key: string): Promise<ICryptoCertificate>;
    public getItem(key: string, algorithm: Algorithm, keyUsages: string[]): Promise<ICryptoCertificate>;
    public async getItem(id: string, algorithm?: Algorithm, usages?: string[]) {
        let cert: ICryptoCertificate;

        try {
            cert = await super.getItem(id, algorithm, usages);
        } catch (err) {
            try {
                const object = this.getItemById(id).toType<GraphenePkcs11.X509Certificate>();
                const type = object instanceof X509Certificate ? "x509" : "request";
                cert = await this.crypto.ossl.certStorage.importCert(type, object.value, algorithm, usages);
                fixObject(this.crypto, cert, {
                    index: id,
                    handle: object.handle,
                });
                fixObject(this.crypto, cert.publicKey);
            } catch (err2) {
                throw err;
            }
        }

        if (isOsslObject(cert)) {
            cert.__index = id;
        }

        return cert;
    }

    public importCert(type: "request", data: BufferSource, algorithm: Algorithm, keyUsages: string[]): Promise<CryptoX509CertificateRequest>;
    public importCert(type: "x509", data: BufferSource, algorithm: Algorithm, keyUsages: string[]): Promise<CryptoX509Certificate>;
    public importCert(type: CryptoCertificateFormat, data: BufferSource, algorithm: Algorithm, keyUsages: string[]): Promise<CryptoCertificate>;
    public async importCert(type: CryptoCertificateFormat, data: BufferSource, algorithm?: Algorithm, keyUsages?: string[]) {
        let cert: CryptoCertificate;

        try {
            cert = await super.importCert(type, data, algorithm, keyUsages);
        } catch (err) {
            try {
                cert = await this.crypto.ossl.certStorage.importCert(type, data, algorithm, keyUsages);
                fixObject(this.crypto, cert);
                fixObject(this.crypto, cert.publicKey);
            } catch (e) {
                throw err;
            }
        }

        return cert;
    }

    public exportCert(format: "pem", item: CryptoCertificate): Promise<string>;
    public exportCert(format: "raw", item: CryptoCertificate): Promise<ArrayBuffer>;
    public async exportCert(format: CryptoCertificateFormat, item: CryptoCertificate): Promise<ArrayBuffer | string> {
        if (!isOsslObject(item)) {
            return super.exportCert(format, item);
        } else {
            return this.crypto.ossl.certStorage.exportCert(format, item);
        }
    }

    public async indexOf(item: ICryptoCertificate): Promise<string | null> {
        if (isOsslObject(item)) {
            return item.__index;
        } else {
            return super.indexOf(item);
        }
    }

}
