import { Convert } from "pvtsutils";
import { CertificateItemProto, CertificateStorageGetItemProto, CertificateStorageImportProto, CertificateStorageKeysProto, CertificateStorageRemoveItemProto, CertificateStorageSetItemProto, X509CertificateProto } from "../core/proto";
import { SocketCrypto } from "./client";
import { PrepareAlgorithm } from "webcrypto-core";

export class CertificateStorage implements ICertificateStorage {

    protected readonly service: SocketCrypto;

    constructor(service: SocketCrypto) {
        this.service = service;
    }

    public async importCert(type: string, data: ArrayBuffer, algorithm: Algorithm, keyUsages: string[]) {
        const alg = PrepareAlgorithm(algorithm as AlgorithmIdentifier);

        const proto = new CertificateStorageImportProto();
        proto.type = type;
        proto.data = data;
        proto.algorithm.fromAlgorithm(alg);
        proto.keyUsages = keyUsages;
        const result = await this.service.client.send(CertificateStorageImportProto.ACTION, proto);
        const certItem = await CertificateItemProto.importProto(result);
        return prepareCertItem(certItem);
    }

    public async keys() {
        const proto = new CertificateStorageKeysProto();
        const result = await this.service.client.send(CertificateStorageKeysProto.ACTION, proto);
        const keys = Convert.ToUtf8String(result).split(";");
        return keys;
    }

    public async getItem(key: string) {
        // prepare request
        const proto = new CertificateStorageGetItemProto();
        proto.key = key;

        // send and receive result
        const result = await this.service.client.send(CertificateStorageGetItemProto.ACTION, proto);

        // prepare result
        const certItem = await CertificateItemProto.importProto(result);
        return prepareCertItem(certItem);
    }

    public async setItem(key: string, value: CertificateItemProto) {
        // prepare request
        const proto = new CertificateStorageSetItemProto();
        proto.key = key;
        proto.item = value;

        // send and receive result
        await this.service.client.send(CertificateStorageSetItemProto.ACTION, proto);
    }

    public async removeItem(key: string) {
        // prepare request
        const proto = new CertificateStorageRemoveItemProto();
        proto.key = key;

        // send and receive result
        await this.service.client.send(CertificateStorageRemoveItemProto.ACTION, proto);
    }

}

async function prepareCertItem(item: CertificateItemProto) {
    const raw = await item.exportProto();
    switch (item.type) {
        case "x509": {
            return await X509CertificateProto.importProto(raw);
        }
        default:
            throw new Error(`Unsupported CertificateItem type '${item.type}'`);
    }
}
