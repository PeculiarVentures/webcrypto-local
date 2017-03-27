import { Convert } from "pvtsutils";
import { PrepareAlgorithm } from "webcrypto-core";
import { CryptoKeyProto } from "../core/proto";
import { KeyStorageClearActionProto, KeyStorageGetItemActionProto, KeyStorageKeysActionProto, KeyStorageRemoveItemActionProto, KeyStorageSetItemActionProto } from "../core/protos/keystorage";
import { SocketCrypto } from "./crypto";

export class SocketKeyStorage implements IKeyStorage {

    protected readonly service: SocketCrypto;

    constructor(service: SocketCrypto) {
        this.service = service;
    }

    public async keys() {
        const proto = new KeyStorageKeysActionProto();
        proto.providerID = this.service.id;
        const result = await this.service.client.send(proto);
        if (result) {
            const keys = Convert.ToUtf8String(result).split(";");
            return keys;
        }
        return [];
    }

    public getItem(key: string): Promise<CryptoKey>;
    public getItem(key: string, algorithm: Algorithm, usages: string[]): Promise<CryptoKey>;
    public async getItem(key: string, algorithm?: Algorithm, usages?: string[]) {
        // prepare request
        const proto = new KeyStorageGetItemActionProto();
        proto.providerID = this.service.id;
        proto.key = key;

        if (algorithm) {
            const preparedAlgorithm = PrepareAlgorithm(algorithm);
            proto.algorithm.fromAlgorithm(preparedAlgorithm);
            proto.keyUsages = usages;
        }

        // send and receive result
        const result = await this.service.client.send(proto);

        // prepare result
        let socketKey: CryptoKeyProto | null = null;
        if (result && result.byteLength) {
            const keyProto = await CryptoKeyProto.importProto(result);
            socketKey = keyProto;
        }
        return socketKey;
    }

    public async setItem(value: CryptoKeyProto) {
        // prepare request
        const proto = new KeyStorageSetItemActionProto();
        proto.providerID = this.service.id;
        proto.item = value;

        // send and receive result
        const data = await this.service.client.send(proto);
        return Convert.ToUtf8String(data);
    }

    public async removeItem(key: string) {
        // prepare request
        const proto = new KeyStorageRemoveItemActionProto();
        proto.providerID = this.service.id;
        proto.key = key;

        // send and receive result
        await this.service.client.send(proto);
    }

    public async clear() {
        // prepare request
        const proto = new KeyStorageClearActionProto();
        proto.providerID = this.service.id;

        // send and receive result
        await this.service.client.send(proto);
    }

}
