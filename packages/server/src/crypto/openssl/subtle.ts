import * as wcp11 from "node-webcrypto-p11";
import { SubtleCrypto } from "webcrypto-core";
import { OpenSSLCrypto } from "./crypto";

export class OpenSSLSubtleCrypto extends SubtleCrypto {

  private crypto: OpenSSLCrypto;

  constructor(crypto: OpenSSLCrypto) {
    super();

    this.crypto = crypto;
  }

  public async decrypt(algorithm: AlgorithmIdentifier | RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams, key: wcp11.CryptoKey, data: BufferSource): Promise<ArrayBuffer> {
    return this.crypto.crypto.subtle.decrypt(algorithm, key, data);
  }

  public async deriveBits(algorithm: AlgorithmIdentifier | EcdhKeyDeriveParams | HkdfParams | Pbkdf2Params, baseKey: wcp11.CryptoKey, length: number): Promise<ArrayBuffer> {
    return this.crypto.crypto.subtle.deriveBits(algorithm, baseKey, length);
  }

  public async deriveKey(algorithm: AlgorithmIdentifier | EcdhKeyDeriveParams | HkdfParams | Pbkdf2Params, baseKey: wcp11.CryptoKey, derivedKeyType: AlgorithmIdentifier | AesDerivedKeyParams | HmacImportParams | HkdfParams | Pbkdf2Params, extractable: boolean, keyUsages: KeyUsage[]): Promise<wcp11.CryptoKey> {
    const key = await this.crypto.crypto.subtle.deriveKey(algorithm, baseKey, derivedKeyType, extractable, keyUsages);
    return this.processKey(key, derivedKeyType);
  }

  public async digest(algorithm: string | Algorithm, data: BufferSource): Promise<ArrayBuffer> {
    return this.crypto.crypto.subtle.digest(algorithm, data);
  }

  public async encrypt(algorithm: AlgorithmIdentifier | RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams, key: wcp11.CryptoKey, data: BufferSource): Promise<ArrayBuffer> {
    return this.encrypt(algorithm, key, data);
  }

  public exportKey(format: "jwk", key: wcp11.CryptoKey): Promise<JsonWebKey>;
  public exportKey(format: "raw" | "pkcs8" | "spki", key: wcp11.CryptoKey): Promise<ArrayBuffer>;
  public exportKey(format: string, key: wcp11.CryptoKey): Promise<ArrayBuffer | JsonWebKey>;
  public async exportKey(format: any, key: any): Promise<ArrayBuffer | JsonWebKey> {
    return this.crypto.crypto.subtle.exportKey(format, key);
  }

  public async generateKey(algorithm: "Ed25519", extractable: boolean, keyUsages: ReadonlyArray<"sign" | "verify">): Promise<CryptoKeyPair>;
  public async generateKey(algorithm: RsaHashedKeyGenParams | EcKeyGenParams, extractable: boolean, keyUsages: KeyUsage[], ...args: any[]): Promise<CryptoKeyPair>;
  public async generateKey(algorithm: AesKeyGenParams | HmacKeyGenParams | Pbkdf2Params, extractable: boolean, keyUsages: KeyUsage[], ...args: any[]): Promise<CryptoKey>;
  public async generateKey(algorithm: AlgorithmIdentifier, extractable: boolean, keyUsages: Iterable<KeyUsage>, ...args: any[]): Promise<CryptoKeyPair | CryptoKey>;
  public async generateKey(algorithm: any, extractable: any, keyUsages: any): Promise<CryptoKey | CryptoKeyPair> {
    const keys = await this.crypto.crypto.subtle.generateKey(algorithm, extractable, keyUsages) as CryptoKeyPair | CryptoKey;
    if ("publicKey" in keys) {
      return {
        privateKey: await this.processKey(keys.privateKey, algorithm),
        publicKey: await this.processKey(keys.publicKey, algorithm),
      };
    } else {
      return this.processKey(keys, algorithm);
    }
  }

  public async importKey(format: "jwk", keyData: JsonWebKey, algorithm: AlgorithmIdentifier | RsaHashedImportParams | EcKeyImportParams | HmacImportParams | AesKeyAlgorithm, extractable: boolean, keyUsages: KeyUsage[]): Promise<wcp11.CryptoKey>;
  public async importKey(format: Exclude<KeyFormat, "jwk">, keyData: BufferSource, algorithm: AlgorithmIdentifier | RsaHashedImportParams | EcKeyImportParams | HmacImportParams | AesKeyAlgorithm, extractable: boolean, keyUsages: KeyUsage[]): Promise<wcp11.CryptoKey>;
  public async importKey(format: any, keyData: any, algorithm: any, extractable: any, keyUsages: any): Promise<wcp11.CryptoKey> {
    const key = await this.crypto.crypto.subtle.importKey(format, keyData, algorithm, extractable, keyUsages);
    return this.processKey(key, algorithm);
  }

  public async sign(algorithm: AlgorithmIdentifier | RsaPssParams | EcdsaParams, key: wcp11.CryptoKey, data: BufferSource): Promise<ArrayBuffer> {
    return this.crypto.crypto.subtle.sign(algorithm, key, data);
  }

  public async unwrapKey(format: KeyFormat, wrappedKey: BufferSource, unwrappingKey: wcp11.CryptoKey, unwrapAlgorithm: AlgorithmIdentifier | RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams, unwrappedKeyAlgorithm: AlgorithmIdentifier | RsaHashedImportParams | EcKeyImportParams | HmacImportParams | AesKeyAlgorithm, extractable: boolean, keyUsages: KeyUsage[]): Promise<wcp11.CryptoKey> {
    const key = await this.crypto.crypto.subtle.unwrapKey(format, wrappedKey, unwrappingKey, unwrapAlgorithm, unwrappedKeyAlgorithm, extractable, keyUsages);
    return this.processKey(key, unwrappedKeyAlgorithm);
  }

  public async verify(algorithm: AlgorithmIdentifier | RsaPssParams | EcdsaParams, key: wcp11.CryptoKey, signature: BufferSource, data: BufferSource): Promise<boolean> {
    return this.crypto.crypto.subtle.verify(algorithm, key, signature, data);
  }

  public async wrapKey(format: KeyFormat, key: wcp11.CryptoKey, wrappingKey: wcp11.CryptoKey, wrapAlgorithm: AlgorithmIdentifier | RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams): Promise<ArrayBuffer> {
    return this.crypto.crypto.subtle.wrapKey(format, key, wrappingKey, wrapAlgorithm);
  }

  private processKey(key: CryptoKey, algorithm: any): Promise<wcp11.CryptoKey>;
  private async processKey(key: any, algorithm: any) {
    if (typeof algorithm === "object") {
      key.algorithm.label = algorithm.label || "";
      if (algorithm.token) {
        const index = await this.crypto.keyStorage.setItem(key);
        return this.crypto.keyStorage.getItem(index);
      }
    }
    return key;
  }

}
