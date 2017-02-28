import { AlgorithmProto, CryptoKeyProto } from "../core";

export class SocketCryptoKey implements CryptoKey {
    /**
     * identity of key on Server
     * - identity is SHA-256 hash of public key
     */
    public id: string;
    /**
     * Determines if crypto key stored in SocketStorage
     */
    public token: boolean;

    /**
     * Name of crypto service
     */
    public cryptoName: string;

    public algorithm: AlgorithmProto;
    public extractable: boolean;
    public type: string;
    public usages: string[];

    constructor(key: CryptoKeyProto) {
        this.id = key.id;
        this.algorithm = key.algorithm;
        this.extractable = key.extractable;
        this.usages = key.usage;
        this.type = key.type;
    }

    public toProto() {
        const proto = new CryptoKeyProto();
        proto.id = this.id;
        proto.extractable = this.extractable;
        proto.algorithm.fromAlgorithm(this.algorithm);
        proto.usage = this.usages;
        proto.type = this.type;
        return proto;
    }
}
