import { Convert } from "pvtsutils";
import * as core from "webcrypto-core";
import { CryptoKeyProto } from "../core/proto";
import {
  KeyStorageClearActionProto, KeyStorageGetItemActionProto, KeyStorageIndexOfActionProto, KeyStorageKeysActionProto,
  KeyStorageRemoveItemActionProto, KeyStorageSetItemActionProto,
} from "../core/protos/keystorage";
import { SocketCrypto } from "./crypto";
import * as utils from "./utils";

export class KeyStorage implements core.CryptoKeyStorage {

  protected readonly service: SocketCrypto;

  constructor(service: SocketCrypto) {
    this.service = service;
  }

  public async keys() {
    const proto = new KeyStorageKeysActionProto();
    proto.providerID = this.service.id;
    const result = await this.service.client.send(proto);
    if (result) {
      const keys = Convert.ToUtf8String(result).split(",");
      return keys;
    }
    return [];
  }

  public indexOf(item: CryptoKey): Promise<string | null>;
  public async indexOf(item: CryptoKeyProto): Promise<string | null> {
    // check
    utils.checkCryptoKey(item, "item");

    // prepare request
    const proto = new KeyStorageIndexOfActionProto();
    proto.providerID = this.service.id;
    proto.item = item;

    // send and receive result
    const result = await this.service.client.send(proto);
    return result ? Convert.ToUtf8String(result) : null;
  }

  public async hasItem(item: CryptoKey): Promise<boolean> {
    const index = await this.indexOf(item);
    return !!index;
  }

  public getItem(key: string): Promise<CryptoKey>;
  public getItem(key: string, algorithm: Algorithm, extractable: boolean, usages: KeyUsage[]): Promise<CryptoKey>;
  public async getItem(key: string, algorithm?: Algorithm, extractable?: boolean, usages?: KeyUsage[]) {
    // check
    utils.checkPrimitive(key, "string", "key");
    if (algorithm) {
      utils.checkAlgorithm(algorithm, "algorithm");
      utils.checkPrimitive(extractable, "boolean", "extractable");
      utils.checkArray(usages, "usages");
    }

    // prepare request
    const proto = new KeyStorageGetItemActionProto();
    proto.providerID = this.service.id;
    proto.key = key;
    if (algorithm) {
      proto.algorithm = utils.prepareAlgorithm(algorithm);
      proto.extractable = extractable;
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
    // check
    utils.checkCryptoKey(value, "value");

    // prepare request
    const proto = new KeyStorageSetItemActionProto();
    proto.providerID = this.service.id;
    proto.item = value;

    // send and receive result
    const data = await this.service.client.send(proto);
    return Convert.ToUtf8String(data);
  }

  public async removeItem(key: string) {
    // check
    utils.checkPrimitive(key, "string", "key");

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
