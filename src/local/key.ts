import { CryptoKeyProto } from "../core";

export class ServiceCryptoKey {

    public id: string;

    public key: CryptoKey;

    constructor(id: string, key: CryptoKey) {
        this.id = id;
        this.key = key;
    }

    public toProto() {
        const proto = new CryptoKeyProto();
        proto.id = this.id;
        proto.algorithm.fromAlgorithm(this.key.algorithm);
        proto.extractable = this.key.extractable;
        proto.type = this.key.type;
        proto.usage = this.key.usages;
        return proto;
    }

}
