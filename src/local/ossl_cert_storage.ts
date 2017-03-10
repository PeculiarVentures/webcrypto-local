import * as fs from "fs";
import { Convert } from "pvtsutils";
import { X509Certificate } from "../pki/x509";

const crypto: Crypto = new (require("node-webcrypto-ossl"))();

type IJsonOpenSSLCertificateStorage = { [key: string]: IJsonOpenSSLCertificate };

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

    public async importCert(type: string, data: ArrayBuffer, algorithm: Algorithm, keyUsages: string[]) {
        let res: ICertificateStorageItem;
        switch (type) {
            case "x509": {
                const cert = X509Certificate.importRaw(data);
                const id = await cert.thumbprint(crypto, "SHA-256");
                const resX509: IX509Certificate = {
                    id: Convert.ToHex(id),
                    issuerName: cert.issuerName,
                    subjectName: cert.subjectName,
                    publicKey: await cert.exportKey(crypto, algorithm, keyUsages),
                    serialNumber: cert.serialNumber,
                    type,
                    value: data,
                };
                res = resX509;
                break;
            }
            default:
                throw new Error(`Unsupported CertificateStorageItem type '${type}'`);
        }
        return res;
    }

    public async keys() {
        const keys = this.readFile();
        return Object.keys(keys);
    }

    public async setItem(key: string, item: ICertificateStorageItem) {
        const certs = this.readFile();
        const value = await this.certToJson(item);
        certs[key] = value;
        this.writeFile(certs);
    }

    public async getItem(key: string) {
        const certs = this.readFile();
        const value = certs[key];

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

    protected async certToJson(cert: ICertificateStorageItem) {
        const date = new Date().toISOString();
        return {
            // TODO: Can be error, check algorithm type
            algorithm: (cert.publicKey.algorithm as any).toAlgorithm(),
            usages: cert.publicKey.usages,
            type: cert.type,
            createdAt: date,
            lastUsed: date,
            raw: Convert.ToBase64(cert.value),
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
