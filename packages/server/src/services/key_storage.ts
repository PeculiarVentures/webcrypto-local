import * as proto from "@webcrypto-local/proto";
import { CryptoKey } from "node-webcrypto-p11";
import { Convert } from "pvtsutils";

import { Server, Session } from "../connection";
import { ServiceCryptoItem } from "../crypto_item";
import { CryptoService } from "./crypto";
import { Service } from "./service";

import { PvCrypto } from "../crypto";
import { WebCryptoLocalError } from "../error";

export class KeyStorageService extends Service<CryptoService> {

  constructor(server: Server, crypto: CryptoService) {
    super(server, crypto, [
      //#region List of actions
      proto.KeyStorageKeysActionProto,
      proto.KeyStorageIndexOfActionProto,
      proto.KeyStorageGetItemActionProto,
      proto.KeyStorageSetItemActionProto,
      proto.KeyStorageRemoveItemActionProto,
      proto.KeyStorageClearActionProto,
      //#endregion
    ]);
  }

  public async getCrypto(id: string) {
    return await this.object.getCrypto(id);
  }

  public getMemoryStorage() {
    return this.object.object.memoryStorage;
  }

  protected async onMessage(session: Session, action: proto.ActionProto) {
    const result = new proto.ResultProto(action);
    switch (action.action) {
      // getItem
      case proto.KeyStorageGetItemActionProto.ACTION: {
        // prepare incoming data
        const params = await proto.KeyStorageGetItemActionProto.importProto(action);
        const crypto = await this.getCrypto(params.providerID);

        // do operation
        const key = !params.algorithm.isEmpty()
          ? await crypto.keyStorage.getItem(params.key, params.algorithm.toAlgorithm(), params.extractable, params.keyUsages)
          : await crypto.keyStorage.getItem(params.key);

        if (key) {
          // add keys to memory storage
          const cryptoKey = new ServiceCryptoItem(key, params.providerID);
          this.getMemoryStorage().add(cryptoKey);

          result.data = await cryptoKey.toProto().exportProto();
        }
        break;
      }
      case proto.KeyStorageSetItemActionProto.ACTION: {
        // prepare incoming data
        const params = await proto.KeyStorageSetItemActionProto.importProto(action);
        const key = this.getMemoryStorage().item(params.item.id).item as CryptoKey;
        const crypto = await this.getCrypto(params.providerID);
        // do operation
        if ((key.algorithm as any).toAlgorithm) {
          (key as any).algorithm = (key.algorithm as any).toAlgorithm();
        }
        let index: string;
        if (crypto instanceof PvCrypto) {
          index = await crypto.keyStorage.setItem(key, {
            pinFriendlyName: session.origin,
            pinDescription: key.usages.join(", "),
          });
        } else {
          index = await crypto.keyStorage.setItem(key);
        }
        result.data = Convert.FromUtf8String(index);
        // result
        break;
      }
      case proto.KeyStorageRemoveItemActionProto.ACTION: {
        // prepare incoming data
        const params = await proto.KeyStorageRemoveItemActionProto.importProto(action);
        const crypto = await this.getCrypto(params.providerID);
        // do operation
        await crypto.keyStorage.removeItem(params.key);
        // result
        break;
      }
      case proto.KeyStorageKeysActionProto.ACTION: {
        // load key storage
        const params = await proto.KeyStorageKeysActionProto.importProto(action);
        const crypto = await this.getCrypto(params.providerID);
        // do operation
        const keys = await crypto.keyStorage.keys();
        // result
        result.data = (await proto.ArrayStringConverter.set(keys)).buffer;
        break;
      }
      case proto.KeyStorageIndexOfActionProto.ACTION: {
        // load cert storage
        const params = await proto.KeyStorageIndexOfActionProto.importProto(action);
        const crypto = await this.getCrypto(params.providerID);
        const key = this.getMemoryStorage().item(params.item.id).item as CryptoKey;

        // do operation
        const index = await crypto.keyStorage.indexOf(key as any);
        // result
        if (index) {
          result.data = Convert.FromUtf8String(index);
        }
        break;
      }
      case proto.KeyStorageClearActionProto.ACTION: {
        // load cert storage
        const params = await proto.KeyStorageClearActionProto.importProto(action);
        const crypto = await this.getCrypto(params.providerID);

        // do operation
        await crypto.keyStorage.clear();
        // result
        break;
      }
      default:
        throw new WebCryptoLocalError(WebCryptoLocalError.CODE.ACTION_NOT_IMPLEMENTED, `Action '${action.action}' is not implemented`);
    }
    return result;
  }

}
