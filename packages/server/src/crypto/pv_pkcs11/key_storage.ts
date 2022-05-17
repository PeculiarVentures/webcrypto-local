import { ITemplate, registerAttribute } from "graphene-pk11";
import { CryptoKey, KeyStorage } from "node-webcrypto-p11";
import * as os from "os";
import { PvCrypto } from "./crypto";

registerAttribute("pinFriendlyName", 0x80000000 | 0x00000102, "string");
registerAttribute("pinDescription", 0x80000000 | 0x00000103, "string");

export interface ISetItemOptions {
  pinFriendlyName?: string;
  pinDescription?: string;
}

export class PvKeyStorage extends KeyStorage {

  protected crypto!: PvCrypto;

  constructor(crypto: PvCrypto) {
    super(crypto);
  }

  public async setItem(key: CryptoKey, options?: ISetItemOptions): Promise<string> {
    if (!(key instanceof CryptoKey)) {
      throw new TypeError("Parameter 1 is not PKCS#11 CryptoKey");
    }
    // tslint:disable-next-line:variable-name
    const _key: any = key;

    // don't copy object from token
    if (!(await this.hasItem(_key) && _key.key.token)) {
      const template: ITemplate = {
        token: true,
      };
      const platform = os.platform();
      if (_key.type === "private" && options &&
        (platform === "win32" || platform === "darwin")) {
        if (options.pinFriendlyName) {
          template.pinFriendlyName = options.pinFriendlyName;
        }
        if (options.pinDescription) {
          template.pinDescription = options.pinDescription;
        }
      }

      const obj = (this.crypto as any).session.copy(_key.key, template);
      return (CryptoKey as any).getID(obj.toType());
    } else {
      return _key.id;
    }
  }

}
