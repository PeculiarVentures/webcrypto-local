import { registerAttribute, ITemplate } from "graphene-pk11";
import { KeyStorage, CryptoKey } from "node-webcrypto-p11";
import * as os from "os";
import { WebCryptoError } from "webcrypto-core";
import { PvCrypto } from './crypto';

registerAttribute("pinFriendlyName", 0x80000000 | 0x00000102, "string");
registerAttribute("pinDescription", 0x80000000 | 0x00000103, "string");

export interface ISetItemOptions {
    pinFriendlyName?: string;
    pinDescription?: string;
}

export class PvKeyStorage extends KeyStorage {

    protected crypto: PvCrypto;

    constructor(crypto: PvCrypto) {
        super(crypto);
    }

    public async setItem(key: NativeCryptoKey, options?: ISetItemOptions): Promise<string> {
        if (!(key instanceof CryptoKey)) {
            throw new WebCryptoError("Parameter 1 is not PKCS#11 CryptoKey");
        }

        // don't copy object from token
        if (!(this.hasItem(key) && key.key.token)) {
            const template: ITemplate = {
                token: true,
            };
            if (key.type === "private" && options && os.platform() === "win32") {
                if (options.pinFriendlyName) {
                    template.pinFriendlyName = options.pinFriendlyName;
                }
                if (options.pinDescription) {
                    template.pinDescription = options.pinDescription;
                }
            }

            const obj = this.crypto.session.copy(key.key, template);
            return CryptoKey.getID(obj.toType<any>());
        } else {
            return key.id;
        }
    }

}