import { Client } from "../connection/client";
import { IsLoggedInActionProto, LoginActionProto, ResetActionProto } from "../core/protos/crypto";
import { SocketCertificateStorage } from "./cert_storage";
import { SocketKeyStorage } from "./key_storage";
import { SocketSubtleCrypto } from "./subtle";

export class SocketCrypto implements Crypto {

    public id: string;
    public subtle: SocketSubtleCrypto;
    public keyStorage: IKeyStorage;
    public certStorage: SocketCertificateStorage;

    public client: Client;

    constructor(client: Client, id: string) {
        this.client = client;
        this.id = id;

        this.subtle = new SocketSubtleCrypto(this);
        this.keyStorage = new SocketKeyStorage(this);
        this.certStorage = new SocketCertificateStorage(this);
    }

    public getRandomValues(data: ArrayBufferView): ArrayBufferView {
        if (!self.crypto) {
            throw new Error("Cannot get native crypto object. Function getRandomValues is not implemented.");
        }
        return self.crypto.getRandomValues(data);
    }

    public async login() {
        const action = new LoginActionProto();
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
