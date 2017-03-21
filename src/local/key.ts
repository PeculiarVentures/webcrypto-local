import { CryptoKeyProto } from "../core";

export class ServiceCryptoKey {

    public id: string;
    public providerID: string;

    public key: CryptoKey;

    constructor(id: string, key: CryptoKey, providerID: string) {
        this.id = id;
        this.key = key;
        this.providerID = providerID;
    }

    public toProto() {
        const proto = new CryptoKeyProto();
        proto.providerID = this.providerID;
        proto.id = this.id;
        proto.algorithm.fromAlgorithm(this.key.algorithm);
        proto.extractable = this.key.extractable;
        proto.type = this.key.type;
        proto.usages = this.key.usages;
        return proto;
    }

}
