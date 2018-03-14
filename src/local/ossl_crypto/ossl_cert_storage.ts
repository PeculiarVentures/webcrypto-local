import * as fs from "fs";
import { Convert } from "pvtsutils";
import { WebCryptoLocalError } from "../error";
import { Certificate } from "./pki/cert";
import { X509CertificateRequest } from "./pki/request";
import { X509Certificate } from "./pki/x509";

const crypto: Crypto = new (require("node-webcrypto-ossl"))();

interface IJsonOpenSSLCertificateStorage {
    [key: string]: IJsonOpenSSLCertificate;
}

interface IJsonOpenSSLCertificate {
    algorithm: Algorithm;
    usages: string[];
    type: string;
    raw: string;
    createdAt: string;
    lastUsed: string;
}

export class OpenSSLCertificateStorage implements ICertificateStorage {

    public file: string;

    constructor(file: string) {
        this.file = file;
    }

    public exportCert(format: "pem", item: CryptoCertificate): Promise<string>;
    public exportCert(format: "raw", item: CryptoCertificate): Promise<ArrayBuffer>;
    public exportCert(format: CryptoCertificateFormat, item: CryptoCertificate): Promise<ArrayBuffer | string>;
    public async exportCert(format: CryptoCertificateFormat, item: Certificate): Promise<ArrayBuffer | string> {
        switch (format) {
            case "raw": {
                return item.exportRaw();
            }
            case "pem": {
                throw new WebCryptoLocalError(WebCryptoLocalError.CODE.UNKNOWN, "PEM format is not implemented");
            }
            default:
                throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CASE_ERROR, "Unsupported format for CryptoCertificate. Must be 'raw' or 'pem'");
        }
    }

    public importCert(type: "request", data: BufferSource, algorithm: Algorithm, keyUsages: string[]): Promise<CryptoX509CertificateRequest>;
    public importCert(type: "x509", data: BufferSource, algorithm: Algorithm, keyUsages: string[]): Promise<CryptoX509Certificate>;
    public importCert(type: CryptoCertificateFormat, data: BufferSource, algorithm: Algorithm, keyUsages: string[]): Promise<CryptoCertificate>;
    public async importCert(type: string, data: ArrayBuffer, algorithm: Algorithm, keyUsages: string[]) {
        let res: CryptoCertificate;
        switch (type) {
            case "x509": {
                res = await X509Certificate.importCert(crypto, data, algorithm, keyUsages);
                break;
            }
            case "request": {
                res = await X509CertificateRequest.importCert(crypto, data, algorithm, keyUsages);
                break;
            }
            default:
                throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CASE_ERROR, `Unsupported CertificateStorageItem type '${type}'`);
        }
        return res;
    }

    public async keys() {
        const items = this.readFile();
        return Object.keys(items);
    }

    public setItem(item: Certificate): Promise<string>;
    public async setItem(item: Certificate) {
        const certs = this.readFile();
        const value = await this.certToJson(item);
        certs[item.id] = value;
        this.writeFile(certs);
        return item.id;
    }

    public async indexOf(item: CryptoCertificate): Promise<string> {
        if (item instanceof Certificate) {
            const certs = this.readFile();
            for (const index in certs) {
                const identity = await item.getID(crypto, "SHA-256");
                if (index === identity) {
                    return index;
                }
            }
            return null;
        } else {
            throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CASE_ERROR, `Parameter is not OpenSSL CertificateItem`);
        }
    }

    public async getItem(key: string) {
        const certs = this.readFile();
        const value = certs[key];
        if (!value) {
            return null;
        }

        // Update date of last usage
        value.lastUsed = new Date().toISOString();
        this.writeFile(certs);

        return this.certFromJson(value);
    }

    public async removeItem(key: string) {
        const certs = this.readFile();
        delete certs[key];
        this.writeFile(certs);
    }

    public async clear() {
        this.writeFile({});
    }

    protected async certToJson(cert: Certificate) {
        const date = new Date().toISOString();
        return {
            algorithm: (cert.publicKey.algorithm as any).toAlgorithm ? (cert.publicKey.algorithm as any).toAlgorithm() : cert.publicKey.algorithm,
            usages: cert.publicKey.usages,
            type: cert.type,
            createdAt: date,
            lastUsed: date,
            raw: Convert.ToBase64(cert.exportRaw()),
        } as IJsonOpenSSLCertificate;
    }

    protected async certFromJson(json: IJsonOpenSSLCertificate) {
        return this.importCert(json.type, Convert.FromBase64(json.raw), json.algorithm, json.usages);
    }

    protected readFile(): IJsonOpenSSLCertificateStorage {
        if (!fs.existsSync(this.file)) {
            return {};
        }
        const buf = fs.readFileSync(this.file);
        return JSON.parse(buf.toString());
    }

    protected writeFile(json: IJsonOpenSSLCertificateStorage) {
        const buf = new Buffer(JSON.stringify(json));
        fs.writeFileSync(this.file, buf, {
            encoding: "utf8",
            flag: "w+",
        });
    }

}
