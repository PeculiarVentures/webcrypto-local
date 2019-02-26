import * as proto from "@webcrypto-local/proto";
import { Convert } from "pvtsutils";
import { ObjectProto } from "tsprotobuf";

import { Server, Session } from "../connection";
import { ServiceCryptoItem } from "../crypto_item";
import { CryptoService } from "./crypto";
import { Service } from "./service";

import { WebCryptoLocalError } from "../error";

export class SubtleService extends Service<CryptoService> {

  constructor(server: Server, crypto: CryptoService) {
    super(server, crypto, [
      //#region List of actions
      proto.GenerateKeyActionProto,
      proto.ImportKeyActionProto,
      proto.ExportKeyActionProto,
      proto.DigestActionProto,
      proto.SignActionProto,
      proto.VerifyActionProto,
      proto.EncryptActionProto,
      proto.DecryptActionProto,
      proto.WrapKeyActionProto,
      proto.UnwrapKeyActionProto,
      proto.DeriveBitsActionProto,
      proto.DeriveKeyActionProto,
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
      // digest
      case proto.DigestActionProto.ACTION: {
        const params = await proto.DigestActionProto.importProto(action);

        const crypto = await this.getCrypto(params.providerID);

        result.data = await crypto.subtle.digest(params.algorithm.toAlgorithm(), params.data);
        break;
      }
      // generate key
      case proto.GenerateKeyActionProto.ACTION: {
        const params = await proto.GenerateKeyActionProto.importProto(action);

        const crypto = await this.getCrypto(params.providerID);
        const keys = await crypto.subtle.generateKey(params.algorithm.toAlgorithm(), params.extractable, params.usage);

        // add key to memory storage
        let keyProto: ObjectProto;
        if ((keys as CryptoKeyPair).privateKey) {
          const keyPair = keys as CryptoKeyPair;
          // CryptoKeyPair
          const publicKey = new ServiceCryptoItem(keyPair.publicKey, params.providerID);
          const privateKey = new ServiceCryptoItem(keyPair.privateKey, params.providerID);
          this.getMemoryStorage().add(publicKey);
          this.getMemoryStorage().add(privateKey);

          // convert `keys` to CryptoKeyPairProto
          const keyPairProto = new proto.CryptoKeyPairProto();
          keyPairProto.privateKey = privateKey.toProto() as proto.CryptoKeyProto;
          keyPairProto.publicKey = publicKey.toProto() as proto.CryptoKeyProto;
          keyProto = keyPairProto;
        } else {
          // CryptoKey
          const key: CryptoKey = keys as any;
          const secretKey = new ServiceCryptoItem(key, params.providerID);
          this.getMemoryStorage().add(secretKey);

          keyProto = secretKey.toProto();
        }

        result.data = await keyProto.exportProto();
        break;
      }
      // sign
      case proto.SignActionProto.ACTION: {
        const params = await proto.SignActionProto.importProto(action);

        const crypto = await this.getCrypto(params.providerID) as Crypto;

        const key = this.getMemoryStorage().item(params.key.id).item as CryptoKey;
        result.data = await crypto.subtle.sign(params.algorithm.toAlgorithm(), key, params.data);
        break;
      }
      // verify
      case proto.VerifyActionProto.ACTION: {
        const params = await proto.VerifyActionProto.importProto(action);

        const crypto = await this.getCrypto(params.providerID) as Crypto;
        const key = this.getMemoryStorage().item(params.key.id).item as CryptoKey;

        const ok = await crypto.subtle.verify(params.algorithm.toAlgorithm(), key, params.signature, params.data);

        result.data = new Uint8Array([ok ? 1 : 0]).buffer;
        break;
      }
      // encrypt
      case proto.EncryptActionProto.ACTION: {
        const params = await proto.EncryptActionProto.importProto(action);

        const crypto = await this.getCrypto(params.providerID) as Crypto;
        const key = this.getMemoryStorage().item(params.key.id).item as CryptoKey;

        result.data = await crypto.subtle.encrypt(params.algorithm.toAlgorithm(), key, params.data);
        break;
      }
      // decrypt
      case proto.DecryptActionProto.ACTION: {
        const params = await proto.DecryptActionProto.importProto(action);

        const crypto = await this.getCrypto(params.providerID) as Crypto;
        const key = this.getMemoryStorage().item(params.key.id).item as CryptoKey;

        result.data = await crypto.subtle.decrypt(params.algorithm.toAlgorithm(), key, params.data);
        break;
      }
      // deriveBits
      case proto.DeriveBitsActionProto.ACTION: {
        const params = await proto.DeriveBitsActionProto.importProto(action);

        const crypto = await this.getCrypto(params.providerID);
        const key = this.getMemoryStorage().item(params.key.id).item as CryptoKey;
        const alg = params.algorithm.toAlgorithm();
        const publicKey = await proto.CryptoKeyProto.importProto(alg.public);
        alg.public = this.getMemoryStorage().item(publicKey.id).item as CryptoKey;

        result.data = await crypto.subtle.deriveBits(alg, key, params.length);
        break;
      }
      // deriveKey
      case proto.DeriveKeyActionProto.ACTION: {
        const params = await proto.DeriveKeyActionProto.importProto(action);

        const crypto = await this.getCrypto(params.providerID);
        const key = this.getMemoryStorage().item(params.key.id).item as CryptoKey;
        const alg = params.algorithm.toAlgorithm();
        const publicKey = await proto.CryptoKeyProto.importProto(alg.public);
        alg.public = this.getMemoryStorage().item(publicKey.id).item as CryptoKey;

        const derivedKey = await crypto.subtle.deriveKey(alg, key, params.derivedKeyType, params.extractable, params.usage);

        // put key to memory storage
        const resKey = new ServiceCryptoItem(derivedKey, params.providerID);
        this.getMemoryStorage().add(resKey);

        result.data = await resKey.toProto().exportProto();
        break;
      }
      // wrapKey
      case proto.WrapKeyActionProto.ACTION: {
        const params = await proto.WrapKeyActionProto.importProto(action);

        const crypto = await this.getCrypto(params.providerID);
        const key = await this.getMemoryStorage().item(params.key.id).item as CryptoKey;
        const wrappingKey = this.getMemoryStorage().item(params.wrappingKey.id).item as CryptoKey;

        result.data = await crypto.subtle.wrapKey(
          params.format,
          key,
          wrappingKey,
          params.wrapAlgorithm.toAlgorithm(),
        );
        break;
      }
      // unwrapKey
      case proto.UnwrapKeyActionProto.ACTION: {
        const params = await proto.UnwrapKeyActionProto.importProto(action);

        const crypto = await this.getCrypto(params.providerID);
        const unwrappingKey = await this.getMemoryStorage().item(params.unwrappingKey.id).item as CryptoKey;

        const key = await crypto.subtle.unwrapKey(
          params.format,
          params.wrappedKey,
          unwrappingKey,
          params.unwrapAlgorithm.toAlgorithm(),
          params.unwrappedKeyAlgorithm.toAlgorithm(),
          params.extractable,
          params.keyUsage,
        );

        // put key to memory storage
        const resKey = new ServiceCryptoItem(key, params.providerID);
        this.getMemoryStorage().add(resKey);

        result.data = await resKey.toProto().exportProto();
        break;
      }
      // exportKey
      case proto.ExportKeyActionProto.ACTION: {
        const params = await proto.ExportKeyActionProto.importProto(action);

        const crypto = await this.getCrypto(params.providerID) as Crypto;
        const key = await this.getMemoryStorage().item(params.key.id).item as CryptoKey;

        const exportedData = await crypto.subtle.exportKey(
          params.format,
          key,
        );

        if (params.format.toLowerCase() === "jwk") {
          const json = JSON.stringify(exportedData);
          result.data = Convert.FromUtf8String(json);
        } else {
          result.data = exportedData as ArrayBuffer;
        }

        break;
      }
      // importKey
      case proto.ImportKeyActionProto.ACTION: {
        const params = await proto.ImportKeyActionProto.importProto(action);

        const crypto = await this.getCrypto(params.providerID);

        let keyData: JsonWebKey | ArrayBuffer;
        if (params.format.toLowerCase() === "jwk") {
          const json = Convert.ToUtf8String(params.keyData);
          keyData = JSON.parse(json);
        } else {
          keyData = params.keyData;
        }

        const key = await crypto.subtle.importKey(
          params.format,
          keyData,
          params.algorithm.toAlgorithm(),
          params.extractable,
          params.keyUsages,
        );

        // put key to memory storage
        const resKey = new ServiceCryptoItem(key, params.providerID);
        this.getMemoryStorage().add(resKey);

        result.data = await resKey.toProto().exportProto();
        break;
      }
      default:
        throw new WebCryptoLocalError(WebCryptoLocalError.CODE.ACTION_NOT_IMPLEMENTED, `Action '${action.action}' is not implemented`);
    }
    return result;
  }

}
