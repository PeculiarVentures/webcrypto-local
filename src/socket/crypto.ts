import * as core from "webcrypto-core";
import { Client } from "../connection/client";
import { IsLoggedInActionProto, LoginActionProto, LogoutActionProto, ResetActionProto } from "../core/protos/crypto";
import { CertificateStorage } from "./cert_storage";
import { KeyStorage } from "./key_storage";
import { SubtleCrypto } from "./subtle";

export class SocketCrypto implements Crypto, core.CryptoStorages {

    public id: string;
    public subtle: SubtleCrypto;
    public keyStorage: KeyStorage;
    public certStorage: CertificateStorage;

    public client: Client;

    constructor(client: Client, id: string) {
        this.client = client;
        this.id = id;

        this.subtle = new SubtleCrypto(this);
        this.keyStorage = new KeyStorage(this);
        this.certStorage = new CertificateStorage(this);
    }

    public getRandomValues<T extends Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array | DataView | null>(array: T): T {
        if (!self.crypto) {
            throw new Error("Cannot get native crypto object. Function getRandomValues is not implemented.");
        }
        return self.crypto.getRandomValues(array);
    }

    public async login() {
        const action = new LoginActionProto();
        action.providerID = this.id;

        return this.client.send(action);
    }

    public async logout() {
        const action = new LogoutActionProto();
        action.providerID = this.id;

        return this.client.send(action);
    }

    public async reset() {
        const action = new ResetActionProto();
        action.providerID = this.id;

        return this.client.send(action);
    }

    public async isLoggedIn() {
        const action = new IsLoggedInActionProto();
        action.providerID = this.id;

        const res = await this.client.send(action);
        return !!(new Uint8Array(res)[0]);
    }

}
