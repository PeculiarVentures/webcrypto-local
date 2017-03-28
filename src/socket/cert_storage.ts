import { Convert } from "pvtsutils";
import { PrepareAlgorithm } from "webcrypto-core";
import { CertificateStorageClearActionProto, CertificateStorageExportActionProto, CertificateStorageGetItemActionProto, CertificateStorageImportActionProto, CertificateStorageKeysActionProto, CertificateStorageRemoveItemActionProto, CertificateStorageSetItemActionProto, CryptoCertificateProto, CryptoX509CertificateProto, CryptoX509CertificateRequestProto } from "../core/protos/certstorage";
import { SocketCrypto } from "./crypto";

export class SocketCertificateStorage implements ICertificateStorage {

    protected readonly service: SocketCrypto;

    constructor(service: SocketCrypto) {
        this.service = service;
    }

    public exportCert(format: "pem", item: CryptoCertificate): Promise<string>
    public exportCert(format: "raw", item: CryptoCertificate): Promise<ArrayBuffer>
    public exportCert(format: CryptoCertificateFormat, item: CryptoCertificate): Promise<ArrayBuffer | string>;
    public async exportCert(format: CryptoCertificateFormat, item: CryptoCertificateProto): Promise<ArrayBuffer | string> {
        // prepare request
        const proto = new CertificateStorageExportActionProto();
        proto.providerID = this.service.id;

        proto.format = format;
        proto.item = item;

        // send and receive result
        const result = await this.service.client.send(proto);

        // prepare result
        if (format === "raw") {
            // raw
            return result;
        } else {
            // jwk
            return Convert.ToUtf8String(result);
        }
    }

    public async importCert(type: string, data: ArrayBuffer, algorithm: Algorithm, keyUsages: string[]): Promise<CryptoX509Certificate | CryptoX509CertificateRequest> {
        const alg = PrepareAlgorithm(algorithm as AlgorithmIdentifier);

        // prepare request
        const proto = new CertificateStorageImportActionProto();
        proto.providerID = this.service.id;
        proto.type = type;
        proto.data = data;
        proto.algorithm.fromAlgorithm(alg);
        proto.keyUsages = keyUsages;

        // send and receive result
        const result = await this.service.client.send(proto);

        // prepare result
        const certItem = await CryptoCertificateProto.importProto(result);
        return prepareCertItem(certItem);
    }

    public async keys() {
        // prepare request
        const proto = new CertificateStorageKeysActionProto();
        proto.providerID = this.service.id;

        // send and receive data
        const result = await this.service.client.send(proto);

        // prepare result
        if (result) {
            const keys = Convert.ToUtf8String(result).split(",");
            return keys;
        }
        return [];
    }

    public async getItem(key: string) {
        // prepare request
        const proto = new CertificateStorageGetItemActionProto();
        proto.providerID = this.service.id;
        proto.key = key;

        // send and receive result
        const result = await this.service.client.send(proto);

        // prepare result
        const certItem = await CryptoCertificateProto.importProto(result);
        return prepareCertItem(certItem);
    }

    public async setItem(value: CryptoCertificateProto) {
        // prepare request
        const proto = new CertificateStorageSetItemActionProto();
        proto.providerID = this.service.id;
        proto.item = value;

        // send and receive result
        const data = await this.service.client.send(proto);
        return Convert.ToUtf8String(data);
    }

    public async removeItem(key: string) {
        // prepare request
        const proto = new CertificateStorageRemoveItemActionProto();
        proto.providerID = this.service.id;
        proto.key = key;

        // send and receive result
        await this.service.client.send(proto);
    }

    public async clear() {
        // prepare request
        const proto = new CertificateStorageClearActionProto();
        proto.providerID = this.service.id;

        // send and receive result
        await this.service.client.send(proto);
    }
}

async function prepareCertItem(item: CryptoCertificateProto) {
    const raw = await item.exportProto();
    switch (item.type) {
        case "x509": {
            return await CryptoX509CertificateProto.importProto(raw);
        }
        case "request": {
            return await CryptoX509CertificateRequestProto.importProto(raw);
        }
        default:
            throw new Error(`Unsupported CertificateItem type '${item.type}'`);
    }
}
