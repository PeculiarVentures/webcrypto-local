import * as Proto from "@webcrypto-local/proto";
import { Convert } from "pvtsutils";
import * as core from "webcrypto-core";
import { SocketCrypto } from "./crypto";
import * as utils from "./utils";

export class KeyStorage implements core.CryptoKeyStorage {

  protected readonly service: SocketCrypto;

  constructor(service: SocketCrypto) {
    this.service = service;
  }

  public async keys() {
    const proto = new Proto.KeyStorageKeysActionProto();
    proto.providerID = this.service.id;
    const result = await this.service.client.send(proto);
    if (result) {
      const keys = Convert.ToUtf8String(result).split(",");
      return keys;
    }
    return [];
  }

  public indexOf(item: CryptoKey): Promise<string | null>;
  public async indexOf(item: Proto.CryptoKeyProto): Promise<string | null> {
    // check
    utils.checkCryptoKey(item, "item");

    // prepare request
    const proto = new Proto.KeyStorageIndexOfActionProto();
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
    const proto = new Proto.KeyStorageGetItemActionProto();
    proto.providerID = this.service.id;
    proto.key = key;
    if (algorithm) {
      proto.algorithm = utils.prepareAlgorithm(algorithm);
      proto.extractable = extractable!;
      proto.keyUsages = usages!;
    }

    // send and receive result
    const result = await this.service.client.send(proto);

    // prepare result
    let socketKey: Proto.CryptoKeyProto | undefined;
    if (result && result.byteLength) {
      socketKey = await Proto.CryptoKeyProto.importProto(result);
    } else {
      throw new Error("Cannot get CryptoKey from key storage by index");
    }
    return socketKey;
  }

  public async setItem(value: Proto.CryptoKeyProto) {
    // check
    utils.checkCryptoKey(value, "value");

    // prepare request
    const proto = new Proto.KeyStorageSetItemActionProto();
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
    const proto = new Proto.KeyStorageRemoveItemActionProto();
    proto.providerID = this.service.id;
    proto.key = key;

    // send and receive result
    await this.service.client.send(proto);
  }

  public async clear() {
    // prepare request
    const proto = new Proto.KeyStorageClearActionProto();
    proto.providerID = this.service.id;

    // send and receive result
    await this.service.client.send(proto);
  }

}
