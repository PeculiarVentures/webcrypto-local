import * as fs from "fs";
import * as wcp11 from "node-webcrypto-p11";
import { CryptoKey } from "node-webcrypto-p11";
import { Convert } from "pvtsutils";
import * as core from "webcrypto-core";
import { WebCryptoLocalError } from "../../error";
import { OpenSSLCrypto } from "./crypto";

interface IJsonOpenSSLKeyStorage {
  [key: string]: IJsonOpenSSLKey;
}

interface IJsonOpenSSLKey extends CryptoKey {
  raw: string;
  createdAt: string;
  lastUsed: string;
}

export class OpenSSLKeyStorage implements wcp11.KeyStorage {

  public file: string;
  public crypto: wcp11.Crypto;

  constructor(file: string, crypto: OpenSSLCrypto) {
    this.file = file;
    this.crypto = crypto;
  }

  public async keys() {
    const keys = this.readFile();
    return Object.keys(keys);
  }

  public async indexOf(item: CryptoKey) {
    const keys = this.readFile();
    const id = await this.getID(item);
    if (id in keys) {
      return id;
    }
    return null;
  }

  public async hasItem(item: CryptoKey) {
    const index = this.indexOf(item);
    return !!index;
  }

  public async setItem(value: CryptoKey) {
    const keys = this.readFile();
    const id = await this.getID(value);
    keys[id] = await this.keyToJson(value);
    this.writeFile(keys);
    return id;
  }

  public getItem(index: string): Promise<CryptoKey>;
  public getItem(index: string, algorithm: core.ImportAlgorithms, extractable: boolean, keyUsages: KeyUsage[]): Promise<CryptoKey>;
  public async getItem(key: string, algorithm?: core.ImportAlgorithms, extractable?: boolean, keyUsages?: KeyUsage[]) {
    const keys = this.readFile();
    const keyJson = keys[key];
    if (!keyJson) {
      throw new Error("Cannot get CryptoKey from storage by index");
    }
    const res = await this.keyFromJson(keyJson, algorithm, extractable, keyUsages);
    this.writeFile(keys);
    res.algorithm.token = true;
    return res;
  }

  public async removeItem(key: string) {
    const keys = this.readFile();
    delete keys[key];
    this.writeFile(keys);
  }

  public async clear() {
    this.writeFile({});
  }

  protected readFile(): IJsonOpenSSLKeyStorage {
    if (!fs.existsSync(this.file)) {
      return {};
    }
    const buf = fs.readFileSync(this.file);
    return JSON.parse(buf.toString());
  }

  protected writeFile(obj: IJsonOpenSSLKeyStorage) {
    const buf = Buffer.from(JSON.stringify(obj));
    fs.writeFileSync(this.file, buf, {
      encoding: "utf8",
      flag: "w+",
    });
  }

  /**
   * <type>-<hex>
   * - public/private key's hex = SHA-256(spki)
   * - secret key's hex = SHA-256(RND(32))
   *
   * @protected
   * @param {CryptoKey} key
   * @returns
   *
   * @memberOf OpenSSLKeyStorage
   */
  protected async getID(key: CryptoKey) {
    const nativeKey = (key as any).native;
    let id: Uint8Array;
    switch (key.type) {
      case "secret": {
        id = await this.crypto.getRandomValues(new Uint8Array(20)) as Uint8Array;
        break;
      }
      case "private":
      case "public":
        const fn = nativeKey.exportSpki as (cb: (err: Error, data: Buffer) => void) => void;
        id = await new Promise<Buffer>((resolve, reject) => {
          fn.call(nativeKey, (err: Error, data: Buffer) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
        break;
      default:
        throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CASE_ERROR, `Unsupported type of CryptoKey '${key.type}'`);
    }
    const hash = await this.crypto.subtle.digest("SHA-1", id);
    const rnd = this.crypto.getRandomValues(new Uint8Array(4));
    return `${key.type}-${Convert.ToHex(rnd)}-${Convert.ToHex(hash)}`;
  }

  protected keyToJson(key: CryptoKey): Promise<IJsonOpenSSLKey> {
    return Promise.resolve()
      .then(() => {
        const nativeKey = (key as any).native;
        let fn: (cb: (err: Error, data: Buffer) => void) => void;
        switch (key.type) {
          case "secret":
            fn = nativeKey.export;
            break;
          case "public":
            fn = nativeKey.exportSpki;
            break;
          case "private":
            fn = nativeKey.exportPkcs8;
            break;
          default:
            throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CASE_ERROR, `Unsupported type of CryptoKey '${key.type}'`);
        }
        return new Promise<Buffer>((resolve, reject) => {
          fn.call(nativeKey, (err: Error, data: Buffer) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
      })
      .then((raw) => {
        const json: IJsonOpenSSLKey = {
          algorithm: key.algorithm,
          extractable: key.extractable,
          type: key.type,
          usages: key.usages || [],
          raw: raw.toString("base64"),
          createdAt: new Date().toISOString(),
          lastUsed: new Date().toISOString(),
        };
        return json;
      });
  }

  protected keyFromJson(obj: IJsonOpenSSLKey): Promise<wcp11.CryptoKey>;
  protected keyFromJson(obj: IJsonOpenSSLKey, algorithm?: core.ImportAlgorithms, extractable?: boolean, keyUsages?: KeyUsage[]): Promise<wcp11.CryptoKey>;
  protected async keyFromJson(obj: IJsonOpenSSLKey, algorithm?: core.ImportAlgorithms, extractable?: boolean, keyUsages?: KeyUsage[]) {
    let format: string;
    switch (obj.type) {
      case "secret":
        format = "raw";
        break;
      case "public":
        format = "spki";
        break;
      case "private":
        format = "pkcs8";
        break;
      default:
        throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CASE_ERROR, `Unsupported type of CryptoKey '${obj.type}'`);
    }
    obj.lastUsed = new Date().toISOString();
    return this.crypto.subtle.importKey(
      format,
      Buffer.from(obj.raw, "base64"),
      (algorithm || obj.algorithm) as any,
      extractable ?? obj.extractable,
      keyUsages || obj.usages);
  }

}
