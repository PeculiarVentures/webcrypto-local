import { getEngine } from "2key-ratchet";
import * as Proto from "@webcrypto-local/proto";
import { Convert } from "pvtsutils";
import { BufferSourceConverter, NativeSubtleCrypto } from "webcrypto-core";
import { SocketCrypto } from "./crypto";
import * as utils from "./utils";

export class SubtleCrypto implements NativeSubtleCrypto {

  protected readonly service: SocketCrypto;

  constructor(crypto: SocketCrypto) {
    this.service = crypto;
  }

  public async encrypt(algorithm: Algorithm, key: CryptoKey, data: BufferSource): Promise<ArrayBuffer>;
  public async encrypt(algorithm: Algorithm, key: Proto.CryptoKeyProto, data: BufferSource) {
    return this.encryptData(algorithm, key, data, "encrypt");
  }

  public async decrypt(algorithm: Algorithm, key: CryptoKey, data: BufferSource): Promise<ArrayBuffer>;
  public async decrypt(algorithm: Algorithm, key: Proto.CryptoKeyProto, data: BufferSource) {
    return this.encryptData(algorithm, key, data, "decrypt");
  }

  public async deriveBits(algorithm: string | EcdhKeyDeriveParams | DhKeyDeriveParams | ConcatParams | HkdfParams | Pbkdf2Params, baseKey: CryptoKey, length: number): Promise<ArrayBuffer>;
  public async deriveBits(algorithm: string | EcdhKeyDeriveParams | DhKeyDeriveParams | ConcatParams | HkdfParams | Pbkdf2Params, baseKey: Proto.CryptoKeyProto, length: number) {
    // check
    utils.checkAlgorithm(algorithm, "algorithm");
    utils.checkCryptoKey(baseKey, "baseKey");
    utils.checkPrimitive(length, "number", "length");

    // prepare
    const algProto = utils.prepareAlgorithm(algorithm);
    utils.checkCryptoKey(algProto.public, "algorithm.public");
    algProto.public = await utils.Cast<Proto.CryptoKeyProto>(algProto.public).exportProto();

    // fill action
    const action = new Proto.DeriveBitsActionProto();
    action.providerID = this.service.id;
    action.algorithm = algProto;
    action.key = baseKey;
    action.length = length;

    // request
    const result = await this.service.client.send(action);
    return result;
  }

  public async deriveKey(algorithm: string | EcdhKeyDeriveParams | DhKeyDeriveParams | ConcatParams | HkdfParams | Pbkdf2Params, baseKey: Proto.CryptoKeyProto, derivedKeyType: string | AesDerivedKeyParams | HmacImportParams | ConcatParams | HkdfParams | Pbkdf2Params, extractable: boolean, keyUsages: string[]) {
    // check incoming data
    utils.checkAlgorithm(algorithm, "algorithm");
    utils.checkCryptoKey(baseKey, "baseKey");
    utils.checkAlgorithm(derivedKeyType, "algorithm");
    utils.checkPrimitive(extractable, "boolean", "extractable");
    utils.checkArray(keyUsages, "keyUsages");

    // prepare incoming data
    const algProto = utils.prepareAlgorithm(algorithm);
    utils.checkCryptoKey(algProto.public, "algorithm.public");
    algProto.public = await utils.Cast<Proto.CryptoKeyProto>(algProto.public).exportProto();
    const algKeyType = utils.prepareAlgorithm(derivedKeyType);

    // fill action
    const action = new Proto.DeriveKeyActionProto();
    action.providerID = this.service.id;
    action.algorithm = algProto;
    action.derivedKeyType.fromAlgorithm(algKeyType);
    action.key = baseKey;
    action.extractable = extractable;
    action.usage = keyUsages;

    // request
    const result = await this.service.client.send(action);
    return await Proto.CryptoKeyProto.importProto(result);
  }

  public async digest(algorithm: AlgorithmIdentifier, data: BufferSource) {
    // Use native digest if possible
    return getEngine().crypto.subtle.digest(algorithm, data as ArrayBuffer);
  }

  public generateKey(algorithm: string, extractable: boolean, keyUsages: string[]): Promise<CryptoKeyPair | CryptoKey>;
  public generateKey(algorithm: RsaHashedKeyGenParams | EcKeyGenParams | DhKeyGenParams, extractable: boolean, keyUsages: string[]): Promise<CryptoKeyPair>;
  public generateKey(algorithm: AesKeyGenParams | HmacKeyGenParams | Pbkdf2Params, extractable: boolean, keyUsages: string[]): Promise<CryptoKey>;
  public async generateKey(algorithm: AlgorithmIdentifier, extractable: boolean, keyUsages: string[]): Promise<CryptoKey | CryptoKeyPair> {
    // check
    utils.checkAlgorithm(algorithm, "algorithm");
    utils.checkPrimitive(extractable, "boolean", "extractable");
    utils.checkArray(keyUsages, "keyUsages");

    // prepare
    const algProto = utils.prepareAlgorithm(algorithm);

    // Fill action
    const action = new Proto.GenerateKeyActionProto();
    action.providerID = this.service.id;
    action.algorithm = algProto;
    action.extractable = extractable;
    action.usage = keyUsages;

    const result = await this.service.client.send(action);
    try {
      // CryptoKeyPair
      const keyPair = await Proto.CryptoKeyPairProto.importProto(result);
      return keyPair;
    } catch (e) {
      // CryptoKey
      const key = await Proto.CryptoKeyProto.importProto(result);
      return key;
    }
  }

  public async exportKey(format: "jwk", key: CryptoKey): Promise<JsonWebKey>;
  public async exportKey(format: "raw" | "spki" | "pkcs8", key: CryptoKey): Promise<ArrayBuffer>;
  public async exportKey(format: KeyFormat, key: CryptoKey): Promise<JsonWebKey | ArrayBuffer>;
  public async exportKey(format: KeyFormat, key: Proto.CryptoKeyProto) {
    // check
    utils.checkPrimitive(format, "string", "format");
    utils.checkCryptoKey(key, "key");

    // fill action
    const action = new Proto.ExportKeyActionProto();
    action.providerID = this.service.id;
    action.format = format;
    action.key = key;

    // request
    const result = await this.service.client.send(action);
    if (format === "jwk") {
      return JSON.parse(Convert.ToBinary(result));
    } else {
      return result;
    }
  }

  public async importKey(format: KeyFormat, keyData: JsonWebKey | BufferSource, algorithm: string | RsaHashedImportParams | EcKeyImportParams | HmacImportParams | DhImportKeyParams, extractable: boolean, keyUsages: KeyUsage[]): Promise<CryptoKey> {
    // check
    utils.checkPrimitive(format, "string", "format");
    utils.checkAlgorithm(algorithm, "algorithm");
    utils.checkPrimitive(extractable, "boolean", "extractable");
    utils.checkArray(keyUsages, "keyUsages");

    // prepare
    const algProto = utils.prepareAlgorithm(algorithm as AlgorithmIdentifier);
    let preparedKeyData: ArrayBuffer;
    if (format === "jwk") {
      preparedKeyData = Convert.FromUtf8String(JSON.stringify(keyData));
    } else {
      utils.checkBufferSource(keyData, "keyData");
      preparedKeyData = BufferSourceConverter.toArrayBuffer(keyData as BufferSource);
    }

    // fill action
    const action = new Proto.ImportKeyActionProto();
    action.providerID = this.service.id;
    action.algorithm = algProto;
    action.keyData = preparedKeyData;
    action.format = format;
    action.extractable = extractable;
    action.keyUsages = keyUsages;

    // request
    const result = await this.service.client.send(action);
    return await Proto.CryptoKeyProto.importProto(result);
  }

  public async sign(algorithm: string | RsaPssParams | EcdsaParams | AesCmacParams, key: CryptoKey, data: BufferSource): Promise<ArrayBuffer>;
  public async sign(algorithm: string | RsaPssParams | EcdsaParams | AesCmacParams, key: Proto.CryptoKeyProto, data: BufferSource) {
    // check
    utils.checkAlgorithm(algorithm, "algorithm");
    utils.checkCryptoKey(key, "key");
    utils.checkBufferSource(data, "data");

    // prepare
    const algProto = utils.prepareAlgorithm(algorithm as AlgorithmIdentifier);
    const rawData = BufferSourceConverter.toArrayBuffer(data);

    // fill action
    const action = new Proto.SignActionProto();
    action.providerID = this.service.id;
    action.algorithm = algProto;
    action.key = key;
    action.data = rawData;

    // request
    const result = await this.service.client.send(action);
    return result;
  }

  public async verify(algorithm: string | RsaPssParams | EcdsaParams | AesCmacParams, key: CryptoKey, signature: BufferSource, data: BufferSource): Promise<boolean>;
  public async verify(algorithm: string | RsaPssParams | EcdsaParams | AesCmacParams, key: Proto.CryptoKeyProto, signature: BufferSource, data: BufferSource) {
    // check
    utils.checkAlgorithm(algorithm, "algorithm");
    utils.checkCryptoKey(key, "key");
    utils.checkBufferSource(signature, "signature");
    utils.checkBufferSource(data, "data");

    // prepare
    const algProto = utils.prepareAlgorithm(algorithm as AlgorithmIdentifier);
    const rawSignature = BufferSourceConverter.toArrayBuffer(signature);
    const rawData = BufferSourceConverter.toArrayBuffer(data);

    // fill action

    const action = new Proto.VerifyActionProto();
    action.providerID = this.service.id;
    action.algorithm = algProto;
    action.key = key;
    action.data = rawData;
    action.signature = rawSignature;

    // request
    const result = await this.service.client.send(action);
    return !!(new Uint8Array(result)[0]);
  }

  public async wrapKey(format: KeyFormat, key: CryptoKey, wrappingKey: CryptoKey, wrapAlgorithm: AlgorithmIdentifier): Promise<ArrayBuffer>;
  public async wrapKey(format: KeyFormat, key: Proto.CryptoKeyProto, wrappingKey: Proto.CryptoKeyProto, wrapAlgorithm: AlgorithmIdentifier) {
    // check
    utils.checkPrimitive(format, "string", "format");
    utils.checkCryptoKey(key, "key");
    utils.checkCryptoKey(wrappingKey, "wrappingKey");
    utils.checkAlgorithm(wrapAlgorithm, "wrapAlgorithm");

    // prepare
    const wrapAlgProto = utils.prepareAlgorithm(wrapAlgorithm);

    // fil action
    const action = new Proto.WrapKeyActionProto();
    action.providerID = this.service.id;
    action.wrapAlgorithm = wrapAlgProto;
    action.key = key;
    action.wrappingKey = wrappingKey;
    action.format = format;

    // request
    const result = await this.service.client.send(action);
    return result;
  }

  public async unwrapKey(format: KeyFormat, wrappedKey: BufferSource, unwrappingKey: CryptoKey, unwrapAlgorithm: AlgorithmIdentifier, unwrappedKeyAlgorithm: AlgorithmIdentifier, extractable: boolean, keyUsages: KeyUsage[]): Promise<CryptoKey>;
  public async unwrapKey(format: KeyFormat, wrappedKey: BufferSource, unwrappingKey: Proto.CryptoKeyProto, unwrapAlgorithm: AlgorithmIdentifier, unwrappedKeyAlgorithm: AlgorithmIdentifier, extractable: boolean, keyUsages: KeyUsage[]) {
    // check
    utils.checkPrimitive(format, "string", "format");
    utils.checkBufferSource(wrappedKey, "wrappedKey");
    utils.checkCryptoKey(unwrappingKey, "unwrappingKey");
    utils.checkAlgorithm(unwrapAlgorithm, "unwrapAlgorithm");
    utils.checkAlgorithm(unwrappedKeyAlgorithm, "unwrappedKeyAlgorithm");
    utils.checkPrimitive(extractable, "boolean", "extractable");
    utils.checkArray(keyUsages, "keyUsages");

    // prepare
    const unwrapAlgProto = utils.prepareAlgorithm(unwrapAlgorithm);
    const unwrappedKeyAlgProto = utils.prepareAlgorithm(unwrappedKeyAlgorithm);
    const rawWrappedKey = BufferSourceConverter.toArrayBuffer(wrappedKey);

    // fill action
    const action = new Proto.UnwrapKeyActionProto();
    action.providerID = this.service.id;
    action.format = format;
    action.unwrapAlgorithm = unwrapAlgProto;
    action.unwrappedKeyAlgorithm = unwrappedKeyAlgProto;
    action.unwrappingKey = unwrappingKey;
    action.wrappedKey = rawWrappedKey;
    action.extractable = extractable;
    action.keyUsage = keyUsages;

    // request
    const result = await this.service.client.send(action);
    return await Proto.CryptoKeyProto.importProto(result);
  }

  protected async encryptData(algorithm: Algorithm, key: Proto.CryptoKeyProto, data: BufferSource, type: string) {
    // check data
    utils.checkAlgorithm(algorithm, "algorithm");
    utils.checkCryptoKey(key, "key");
    utils.checkBufferSource(data, "data");

    // prepare
    const algProto = utils.prepareAlgorithm(algorithm);
    const rawData = BufferSourceConverter.toArrayBuffer(data);

    // select encrypt/decrypt action
    let ActionClass: typeof Proto.EncryptActionProto;
    if (type === "encrypt") {
      ActionClass = Proto.EncryptActionProto;
    } else {
      ActionClass = Proto.DecryptActionProto;
    }

    // fill action
    const action = new ActionClass();
    action.providerID = this.service.id;
    action.algorithm = algProto;
    action.key = key;
    action.data = rawData;

    // request
    const result = await this.service.client.send(action);
    return result;
  }

}
