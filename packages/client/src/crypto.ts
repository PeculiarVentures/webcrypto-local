import { getEngine } from "2key-ratchet";
import * as Proto from "@webcrypto-local/proto";
import { CryptoStorages, Crypto } from "webcrypto-core";
import { CertificateStorage } from "./cert_storage";
import { Client } from "./connection";
import { KeyStorage } from "./key_storage";
import { SubtleCrypto } from "./subtle";

export class SocketCrypto extends Crypto implements CryptoStorages {

  public id: string;
  public subtle: SubtleCrypto;
  public keyStorage: KeyStorage;
  public certStorage: CertificateStorage;

  public client: Client;

  constructor(client: Client, id: string) {
    super();

    this.client = client;
    this.id = id;

    this.subtle = new SubtleCrypto(this);
    this.keyStorage = new KeyStorage(this);
    this.certStorage = new CertificateStorage(this);
  }

  public getRandomValues<T extends ArrayBufferView | null>(array: T): T {
    return getEngine().crypto.getRandomValues(array);
  }

  public async login() {
    const action = new Proto.LoginActionProto();
    action.providerID = this.id;

    return this.client.send(action);
  }

  public async logout() {
    const action = new Proto.LogoutActionProto();
    action.providerID = this.id;

    return this.client.send(action);
  }

  public async reset() {
    const action = new Proto.ResetActionProto();
    action.providerID = this.id;

    return this.client.send(action);
  }

  public async isLoggedIn() {
    const action = new Proto.IsLoggedInActionProto();
    action.providerID = this.id;

    const res = await this.client.send(action);
    return !!(new Uint8Array(res)[0]);
  }

}
