import { Convert } from "pvtsutils";
import * as core from "webcrypto-core";
import {
    CertificateStorageClearActionProto, CertificateStorageExportActionProto, CertificateStorageGetChainActionProto,
    CertificateStorageGetChainResultProto, CertificateStorageGetCRLActionProto, CertificateStorageGetItemActionProto,
    CertificateStorageGetOCSPActionProto, CertificateStorageImportActionProto, CertificateStorageIndexOfActionProto,
    CertificateStorageKeysActionProto, CertificateStorageRemoveItemActionProto, CertificateStorageSetItemActionProto,
    CryptoCertificateProto, CryptoX509CertificateProto, CryptoX509CertificateRequestProto,
    OCSPRequestOptions,
} from "../core/protos/certstorage";
import { SocketCrypto } from "./crypto";
import * as utils from "./utils";

const IMPORT_CERT_FORMATS = ["raw", "pem", "x509", "request"];

export class CertificateStorage implements core.CryptoCertificateStorage {

    protected readonly provider: SocketCrypto;

    constructor(provider: SocketCrypto) {
        this.provider = provider;
    }

    public indexOf(item: core.CryptoCertificate): Promise<string | null>;
    public async indexOf(item: CryptoCertificateProto): Promise<string | null> {
        // check
        utils.checkCryptoCertificate(item, "item");

        // prepare request
        const proto = new CertificateStorageIndexOfActionProto();
        proto.providerID = this.provider.id;
        proto.item = item;

        // send and receive result
        const result = await this.provider.client.send(proto);
        return result ? Convert.ToUtf8String(result) : null;
    }

    public async hasItem(item: core.CryptoCertificate): Promise<boolean> {
        const index = await this.indexOf(item);
        return !!index;
    }

    public exportCert(format: "raw", item: core.CryptoCertificate): Promise<ArrayBuffer>;
    public exportCert(format: "pem", item: core.CryptoCertificate): Promise<string>;
    public exportCert(format: core.CryptoCertificateFormat, item: core.CryptoCertificate): Promise<ArrayBuffer | string>;
    public async exportCert(format: core.CryptoCertificateFormat, item: CryptoCertificateProto): Promise<ArrayBuffer | string> {
        // check
        utils.checkPrimitive(format, "string", "format");
        utils.checkCryptoCertificate(item, "item");

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

    public async importCert(format: "raw" | "x509" | "request", data: BufferSource, algorithm: core.ImportAlgorithms, keyUsages: KeyUsage[]): Promise<core.CryptoCertificate>;
    public async importCert(format: "pem", data: string, algorithm: core.ImportAlgorithms, keyUsages: KeyUsage[]): Promise<core.CryptoCertificate>;
    public async importCert(format: core.CryptoCertificateFormat | "x509" | "request", data: BufferSource | string, algorithm: core.ImportAlgorithms, keyUsages: KeyUsage[]): Promise<core.CryptoCertificate>;
    public async importCert(format: core.CryptoCertificateFormat | "x509" | "request", data: BufferSource | string, algorithm: core.ImportAlgorithms, keyUsages: KeyUsage[]): Promise<core.CryptoCertificate> {
        // check
        utils.checkPrimitive(format, "string", "format");
        if (!~IMPORT_CERT_FORMATS.indexOf(format)) {
            throw new TypeError(`format: Is invalid value. Must be ${IMPORT_CERT_FORMATS.join(", ")}`);
        }
        if (format === "pem") {
            utils.checkPrimitive(data, "string", "data");
        } else {
            utils.checkBufferSource(data, "data");
        }
        utils.checkAlgorithm(algorithm, "algorithm");
        utils.checkArray(keyUsages, "keyUsages");

        // prepare
        const algProto = utils.prepareAlgorithm(algorithm);
        let rawData: ArrayBuffer;
        if (core.BufferSourceConverter.isBufferSource(data)) {
            rawData = core.BufferSourceConverter.toArrayBuffer(data);
        } else if (typeof data === "string") {
            rawData = core.PemConverter.toArrayBuffer(data);
        } else {
            throw new TypeError("data: Is not type String, ArrayBuffer or ArrayBufferView");
        }

        // prepare request
        const proto = new CertificateStorageImportActionProto();
        proto.providerID = this.provider.id;
        proto.format = format === "x509" || format === "request" ? "raw" : format;
        proto.data = rawData;
        proto.algorithm = algProto;
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

    public getItem(key: string): Promise<core.CryptoCertificate>;
    public getItem(key: string, algorithm: Algorithm, keyUsages: string[]): Promise<core.CryptoCertificate>;
    public async getItem(key: string, algorithm?: Algorithm, keyUsages?: KeyUsage[]) {
        // check
        utils.checkPrimitive(key, "string", "key");
        if (algorithm) {
            utils.checkAlgorithm(algorithm, "algorithm");
            utils.checkArray(keyUsages, "keyUsages");
        }

        // prepare request
        const proto = new CertificateStorageGetItemActionProto();
        proto.providerID = this.provider.id;
        proto.key = key;

        if (algorithm) {
            proto.algorithm = utils.prepareAlgorithm(algorithm);
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
        // check
        utils.checkCryptoCertificate(value, "value");

        // prepare request
        const proto = new CertificateStorageSetItemActionProto();
        proto.providerID = this.provider.id;
        proto.item = value;

        // send and receive result
        const data = await this.provider.client.send(proto);
        return Convert.ToUtf8String(data);
    }

    public async removeItem(key: string) {
        // check
        utils.checkPrimitive(key, "string", "key");

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
        // check
        utils.checkCryptoCertificate(value, "value");

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
        // check
        utils.checkPrimitive(url, "string", "url");

        // prepare request
        const proto = new CertificateStorageGetCRLActionProto();
        proto.providerID = this.provider.id;
        proto.url = url;

        // send and receive result
        const data = await this.provider.client.send(proto);
        return data;
    }

    public async getOCSP(url: string, request: BufferSource, options?: OCSPRequestOptions) {
        // check
        utils.checkPrimitive(url, "string", "url");
        utils.checkBufferSource(request, "request");

        // prepare request
        const proto = new CertificateStorageGetOCSPActionProto();
        proto.providerID = this.provider.id;
        proto.url = url;
        proto.request = core.BufferSourceConverter.toArrayBuffer(request);

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
