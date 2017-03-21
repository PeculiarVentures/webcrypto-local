import { Client } from "../connection/client";
import { LoginActionProto, IsLoggedInActionProto } from "../core/protos/subtle";
import { SocketSubtleCrypto } from "./subtle";

export class SocketCrypto implements Crypto {

    public id: string;
    public subtle: SocketSubtleCrypto;

    public client: Client;

    constructor(client: Client, id: string) {
        this.client = client;
        this.id = id;

        this.subtle = new SocketSubtleCrypto(this);
    }

    public getRandomValues(data: ArrayBufferView): ArrayBufferView {
        throw new Error("Method not implemented");
    }

    public async login() {
        const action = new LoginActionProto();
        action.providerID = this.id;

        return this.client.send(LoginActionProto.ACTION, action);
    }

    public async isLoggedIn() {
        const action = new IsLoggedInActionProto();
        action.providerID = this.id;

        const res = await this.client.send(IsLoggedInActionProto.ACTION, action);
        return !!(new Uint8Array(res)[0]);
    }

}
