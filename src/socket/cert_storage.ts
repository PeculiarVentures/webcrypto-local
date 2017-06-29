import { Convert } from "pvtsutils";
import { PrepareAlgorithm } from "webcrypto-core";
import {
    CertificateStorageClearActionProto, CertificateStorageExportActionProto, CertificateStorageGetChainActionProto,
    CertificateStorageGetChainResultProto, CertificateStorageGetCRLActionProto, CertificateStorageGetItemActionProto,
    CertificateStorageGetOCSPActionProto, CertificateStorageImportActionProto, CertificateStorageIndexOfActionProto,
    CertificateStorageKeysActionProto, CertificateStorageRemoveItemActionProto, CertificateStorageSetItemActionProto,
    CryptoCertificateProto, CryptoX509CertificateProto, CryptoX509CertificateRequestProto,
    OCSPRequestOptions,
} from "../core/protos/certstorage";
import { SocketCrypto } from "./crypto";

export class SocketCertificateStorage implements ICertificateStorage {

    protected readonly provider: SocketCrypto;

    constructor(provider: SocketCrypto) {
        this.provider = provider;
    }

    public async indexOf(item: CryptoCertificateProto): Promise<string> {
        // prepare request
        const proto = new CertificateStorageIndexOfActionProto();
        proto.providerID = this.provider.id;
        proto.item = item;

        // send and receive result
        const result = await this.provider.client.send(proto);
        return result ? Convert.ToUtf8String(result) : null;
    }

    public exportCert(format: "pem", item: CryptoCertificate): Promise<string>;
    public exportCert(format: "raw", item: CryptoCertificate): Promise<ArrayBuffer>;
    public exportCert(format: CryptoCertificateFormat, item: CryptoCertificate): Promise<ArrayBuffer | string>;
    public async exportCert(format: CryptoCertificateFormat, item: CryptoCertificateProto): Promise<ArrayBuffer | string> {
        // prepare request
        const proto = new CertificateStorageExportActionProto();
        proto.providerID = this.provider.id;

        proto.format = "raw"; // export only 'raw' format
        proto.item = item;

        // send and receive result
        const result = await this.provider.client.send(proto);

        // prepare result
        if (format === "raw") {
            // raw
            return result;
        } else {
            // pem
            let header = "";
            switch (item.type) {
                case "x509": {
                    header = "CERTIFICATE";
                    break;
                }
                case "request": {
                    header = "CERTIFICATE REQUEST";
                    break;
                }
                default:
                    throw new Error(`Cannot create PEM for unknown type of certificate item`);
            }
            const res: string[] = [];
            const b64 = Convert.ToBase64(result);
            res.push(`-----BEGIN ${header}-----`);
            let counter = 0;
            let raw = "";
            while (counter < b64.length) {
                if (counter && !(counter % 64)) {
                    res.push(raw);
                    raw = "";
                }
                raw += b64[counter++];
            }
            if (raw) {
                res.push(raw);
            }
            res.push(`-----END ${header}-----`);
            return res.join("\r\n");
        }
    }

    public importCert(type: "request", data: BufferSource, algorithm: Algorithm, keyUsages: string[]): Promise<CryptoX509CertificateRequest>;
    public importCert(type: "x509", data: BufferSource, algorithm: Algorithm, keyUsages: string[]): Promise<CryptoX509Certificate>;
    public async importCert(type: string, data: ArrayBuffer, algorithm: Algorithm, keyUsages: string[]): Promise<CryptoX509Certificate | CryptoX509CertificateRequest> {
        const alg = PrepareAlgorithm(algorithm as AlgorithmIdentifier);

        // prepare request
        const proto = new CertificateStorageImportActionProto();
        proto.providerID = this.provider.id;
        proto.type = type;
        proto.data = data;
        proto.algorithm.fromAlgorithm(alg);
        proto.keyUsages = keyUsages;

        // send and receive result
        const result = await this.provider.client.send(proto);

        // prepare result
        const certItem = await CryptoCertificateProto.importProto(result);
        return this.prepareCertItem(certItem) as any;
    }

    public async keys() {
        // prepare request
        const proto = new CertificateStorageKeysActionProto();
        proto.providerID = this.provider.id;

        // send and receive data
        const result = await this.provider.client.send(proto);

        // prepare result
        if (result) {
            const keys = Convert.ToUtf8String(result).split(",");
            return keys;
        }
        return [];
    }

    public getItem(key: string): Promise<CryptoCertificate>;
    public getItem(key: string, algorithm: Algorithm, keyUsages: string[]): Promise<CryptoCertificate>;
    public async getItem(key: string, algorithm?: Algorithm, keyUsages?: string[]) {
        // prepare request
        const proto = new CertificateStorageGetItemActionProto();
        proto.providerID = this.provider.id;
        proto.key = key;

        if (algorithm) {
            const alg = PrepareAlgorithm(algorithm);
            proto.algorithm.fromAlgorithm(alg);
            proto.keyUsages = keyUsages;
        }

        // send and receive result
        const result = await this.provider.client.send(proto);

        // prepare result
        if (result && result.byteLength) {
            const certItem = await CryptoCertificateProto.importProto(result);
            return this.prepareCertItem(certItem);
        }
        return null;
    }

    public async setItem(value: CryptoCertificateProto) {
        // prepare request
        const proto = new CertificateStorageSetItemActionProto();
        proto.providerID = this.provider.id;
        proto.item = value;

        // send and receive result
        const data = await this.provider.client.send(proto);
        return Convert.ToUtf8String(data);
    }

    public async removeItem(key: string) {
        // prepare request
        const proto = new CertificateStorageRemoveItemActionProto();
        proto.providerID = this.provider.id;
        proto.key = key;

        // send and receive result
        await this.provider.client.send(proto);
    }

    public async clear() {
        // prepare request
        const proto = new CertificateStorageClearActionProto();
        proto.providerID = this.provider.id;

        // send and receive result
        await this.provider.client.send(proto);
    }

    public async getChain(value: CryptoCertificateProto) {
        // prepare request
        const proto = new CertificateStorageGetChainActionProto();
        proto.providerID = this.provider.id;
        proto.item = value;

        // send and receive result
        const data = await this.provider.client.send(proto);
        const resultProto = await CertificateStorageGetChainResultProto.importProto(data);
        return resultProto.items;
    }

    public async getCRL(url: string) {
        // prepare request
        const proto = new CertificateStorageGetCRLActionProto();
        proto.providerID = this.provider.id;
        proto.url = url;

        // send and receive result
        const data = await this.provider.client.send(proto);
        return data;
    }

    public async getOCSP(url: string, request: ArrayBuffer, options?: OCSPRequestOptions) {
        // prepare request
        const proto = new CertificateStorageGetOCSPActionProto();
        proto.providerID = this.provider.id;
        proto.url = url;
        proto.request = request;

        if (options) {
            // copy options to proto
            for (const key in options) {
                (proto as any).options[key] = (options as any)[key];
            }
        }

        // send and receive result
        const data = await this.provider.client.send(proto);
        return data;
    }

    protected async prepareCertItem(item: CryptoCertificateProto) {
        const raw = await item.exportProto();
        let result: CryptoCertificateProto;
        switch (item.type) {
            case "x509": {
                result = await CryptoX509CertificateProto.importProto(raw);
                break;
            }
            case "request": {
                result = await CryptoX509CertificateRequestProto.importProto(raw);
                break;
            }
            default:
                throw new Error(`Unsupported CertificateItem type '${item.type}'`);
        }
        (result as any).provider = this.provider;
        return result;
    }

}
