import { Convert } from "pvtsutils";
import { CryptoKeyProto, KeyStorageGetItemProto, KeyStorageKeysProto, KeyStorageRemoveItemProto, KeyStorageSetItemProto } from "../core/proto";
import { SocketCrypto } from "./client";

export class KeyStorage implements IKeyStorage {

    protected readonly service: SocketCrypto;

    constructor(service: SocketCrypto) {
        this.service = service;
    }

    public async keys() {
        const proto = new KeyStorageKeysProto();
        const result = await this.service.client.send(KeyStorageKeysProto.ACTION, proto);
        const keys = Convert.ToUtf8String(result).split(";");
        return keys;
    }

    public async getItem(key: string) {
        // prepare request
        const proto = new KeyStorageGetItemProto();
        proto.key = key;

        // send and receive result
        const result = await this.service.client.send(KeyStorageGetItemProto.ACTION, proto);

        // prepare result
        let socketKey: CryptoKeyProto | null = null;
        if (result && result.byteLength) {
            const keyProto = await CryptoKeyProto.importProto(result);
            socketKey = keyProto;
        }
        return socketKey;
    }

    public async setItem(key: string, value: CryptoKeyProto) {
        // prepare request
        const proto = new KeyStorageSetItemProto();
        proto.key = key;
        proto.item = value;

        // send and receive result
        await this.service.client.send(KeyStorageSetItemProto.ACTION, proto);
    }

    public async removeItem(key: string) {
        // prepare request
        const proto = new KeyStorageRemoveItemProto();
        proto.key = key;

        // send and receive result
        await this.service.client.send(KeyStorageRemoveItemProto.ACTION, proto);
    }

}
