import { Convert } from "pvtsutils";
import { ObjectProto } from "tsprotobuf";

import { Server, Session } from "../../connection/server";
import { ServiceCryptoItem } from "../crypto_item";
import { CryptoService } from "./crypto";
import { Service } from "./service";

import { ActionProto, CryptoKeyPairProto, CryptoKeyProto, ResultProto } from "../../core/proto";
import * as SP from "../../core/protos/subtle";

export class SubtleService extends Service<CryptoService> {

    constructor(server: Server, crypto: CryptoService) {
        super(server, crypto, [
            //#region List of actions
            SP.GenerateKeyActionProto,
            SP.ImportKeyActionProto,
            SP.ExportKeyActionProto,
            SP.DigestActionProto,
            SP.SignActionProto,
            SP.VerifyActionProto,
            SP.EncryptActionProto,
            SP.DecryptActionProto,
            SP.WrapKeyActionProto,
            SP.UnwrapKeyActionProto,
            SP.DeriveBitsActionProto,
            SP.DeriveKeyActionProto,
            //#endregion
        ]);
    }

    public async getCrypto(id: string) {
        return await this.object.getCrypto(id);
    }

    public getMemoryStorage() {
        return this.object.object.memoryStorage;
    }

    protected async onMessage(session: Session, action: ActionProto) {
        const result = new ResultProto(action);
        switch (action.action) {
            // digest
            case SP.DigestActionProto.ACTION: {
                const params = await SP.DigestActionProto.importProto(action);

                const crypto = await this.getCrypto(params.providerID);

                result.data = await crypto.subtle.digest(params.algorithm, params.data);
                break;
            }
            // generate key
            case SP.GenerateKeyActionProto.ACTION: {
                const params = await SP.GenerateKeyActionProto.importProto(action);

                const crypto = await this.getCrypto(params.providerID);
                const keys = await crypto.subtle.generateKey(params.algorithm, params.extractable, params.usage);

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
                    const keyPairProto = new CryptoKeyPairProto();
                    keyPairProto.privateKey = privateKey.toProto() as CryptoKeyProto;
                    keyPairProto.publicKey = publicKey.toProto() as CryptoKeyProto;
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
            case SP.SignActionProto.ACTION: {
                const params = await SP.SignActionProto.importProto(action);

                const crypto = await this.getCrypto(params.providerID);

                const key = this.getMemoryStorage().item(params.key.id).item as CryptoKey;
                result.data = await crypto.subtle.sign(params.algorithm.toAlgorithm(), key, params.data);
                break;
            }
            // verify
            case SP.VerifyActionProto.ACTION: {
                const params = await SP.VerifyActionProto.importProto(action);

                const crypto = await this.getCrypto(params.providerID);

                const key = this.getMemoryStorage().item(params.key.id).item as CryptoKey;
                const ok = await crypto.subtle.verify(params.algorithm.toAlgorithm(), key, params.signature, params.data);

                result.data = new Uint8Array([ok ? 1 : 0]).buffer;
                break;
            }
            // encrypt
            case SP.EncryptActionProto.ACTION: {
                const params = await SP.EncryptActionProto.importProto(action);

                const crypto = await this.getCrypto(params.providerID);
                const key = this.getMemoryStorage().item(params.key.id).item as CryptoKey;

                result.data = await crypto.subtle.encrypt(params.algorithm.toAlgorithm(), key, params.data);
                break;
            }
            // decrypt
            case SP.DecryptActionProto.ACTION: {
                const params = await SP.DecryptActionProto.importProto(action);

                const crypto = await this.getCrypto(params.providerID);
                const key = this.getMemoryStorage().item(params.key.id).item as CryptoKey;

                result.data = await crypto.subtle.decrypt(params.algorithm.toAlgorithm(), key, params.data);
                break;
            }
            // deriveBits
            case SP.DeriveBitsActionProto.ACTION: {
                const params = await SP.DeriveBitsActionProto.importProto(action);

                const crypto = await this.getCrypto(params.providerID);
                const key = this.getMemoryStorage().item(params.key.id).item as CryptoKey;
                const alg = params.algorithm.toAlgorithm();
                const publicKey = await CryptoKeyProto.importProto(alg.public);
                alg.public = this.getMemoryStorage().item(publicKey.id).item as CryptoKey;

                result.data = await crypto.subtle.deriveBits(alg, key, params.length);
                break;
            }
            // deriveKey
            case SP.DeriveKeyActionProto.ACTION: {
                const params = await SP.DeriveKeyActionProto.importProto(action);

                const crypto = await this.getCrypto(params.providerID);
                const key = this.getMemoryStorage().item(params.key.id).item as CryptoKey;
                const alg = params.algorithm.toAlgorithm();
                const publicKey = await CryptoKeyProto.importProto(alg.public);
                alg.public = this.getMemoryStorage().item(publicKey.id).item as CryptoKey;

                const derivedKey = await crypto.subtle.deriveKey(alg, key, params.derivedKeyType, params.extractable, params.usage);

                // put key to memory storage
                const resKey = new ServiceCryptoItem(derivedKey, params.providerID);
                this.getMemoryStorage().add(resKey);

                result.data = await resKey.toProto().exportProto();
                break;
            }
            // wrapKey
            case SP.WrapKeyActionProto.ACTION: {
                const params = await SP.WrapKeyActionProto.importProto(action);

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
            case SP.UnwrapKeyActionProto.ACTION: {
                const params = await SP.UnwrapKeyActionProto.importProto(action);

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
            case SP.ExportKeyActionProto.ACTION: {
                const params = await SP.ExportKeyActionProto.importProto(action);

                const crypto = await this.getCrypto(params.providerID);
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
            case SP.ImportKeyActionProto.ACTION: {
                const params = await SP.ImportKeyActionProto.importProto(action);

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
                throw new Error(`Action '${action.action}' is not implemented`);
        }
        return result;
    }

}
