import * as wcp11 from "node-webcrypto-p11";
import { OpenSSLCrypto } from "./crypto";

export class OpenSSLSubtleCrypto implements wcp11.SubtleCrypto {

  private crypto: OpenSSLCrypto;

  constructor(crypto: OpenSSLCrypto) {
    this.crypto = crypto;
  }

  public async decrypt(algorithm: string | RsaOaepParams | AesCtrParams | AesCbcParams | AesCmacParams | AesGcmParams | AesCfbParams, key: wcp11.CryptoKey, data: Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array | DataView | ArrayBuffer): Promise<ArrayBuffer> {
    return this.crypto.crypto.subtle.decrypt(algorithm, key, data);
  }

  public async deriveBits(algorithm: string | EcdhKeyDeriveParams | DhKeyDeriveParams | ConcatParams | HkdfCtrParams | Pbkdf2Params, baseKey: wcp11.CryptoKey, length: number): Promise<ArrayBuffer> {
    return this.crypto.crypto.subtle.deriveBits(algorithm, baseKey, length);
  }

  public async deriveKey(algorithm: string | EcdhKeyDeriveParams | DhKeyDeriveParams | ConcatParams | HkdfCtrParams | Pbkdf2Params, baseKey: wcp11.CryptoKey, derivedKeyType: string | ConcatParams | HkdfCtrParams | Pbkdf2Params | AesDerivedKeyParams | HmacImportParams, extractable: boolean, keyUsages: string[]): Promise<wcp11.CryptoKey> {
    const key = await this.crypto.crypto.subtle.deriveKey(algorithm, baseKey, derivedKeyType, extractable, keyUsages);
    return this.processKey(key, derivedKeyType);
  }

  public async digest(algorithm: string | Algorithm, data: Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array | DataView | ArrayBuffer): Promise<ArrayBuffer> {
    return this.crypto.crypto.subtle.digest(algorithm, data);
  }

  public async encrypt(algorithm: string | RsaOaepParams | AesCtrParams | AesCbcParams | AesCmacParams | AesGcmParams | AesCfbParams, key: wcp11.CryptoKey, data: Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array | DataView | ArrayBuffer): Promise<ArrayBuffer> {
    return this.encrypt(algorithm, key, data);
  }

  public exportKey(format: "jwk", key: wcp11.CryptoKey): Promise<JsonWebKey>;
  public exportKey(format: "raw" | "pkcs8" | "spki", key: wcp11.CryptoKey): Promise<ArrayBuffer>;
  public exportKey(format: string, key: wcp11.CryptoKey): Promise<ArrayBuffer | JsonWebKey>;
  public async exportKey(format: any, key: any): Promise<ArrayBuffer | JsonWebKey> {
    return this.crypto.crypto.subtle.exportKey(format, key);
  }

  public generateKey(algorithm: string, extractable: boolean, keyUsages: string[]): Promise<wcp11.CryptoKey | wcp11.CryptoKeyPair>;
  public generateKey(algorithm: (RsaHashedKeyGenParams & wcp11.Pkcs11KeyGenParams) | (EcKeyGenParams & wcp11.Pkcs11KeyGenParams) | (DhKeyGenParams & wcp11.Pkcs11KeyGenParams), extractable: boolean, keyUsages: string[]): Promise<wcp11.CryptoKeyPair>;
  public generateKey(algorithm: (Pbkdf2Params & wcp11.Pkcs11KeyGenParams) | (AesKeyGenParams & wcp11.Pkcs11KeyGenParams) | (HmacKeyGenParams & wcp11.Pkcs11KeyGenParams), extractable: boolean, keyUsages: string[]): Promise<wcp11.CryptoKey>;
  public async generateKey(algorithm: any, extractable: any, keyUsages: any): Promise<wcp11.CryptoKey | wcp11.CryptoKeyPair> {
    const keys = await this.crypto.crypto.subtle.generateKey(algorithm, extractable, keyUsages);
    if ("publicKey" in keys) {
      return {
        privateKey: await this.processKey(keys.privateKey, algorithm),
        publicKey: await this.processKey(keys.publicKey, algorithm),
      };
    } else {
      return this.processKey(keys, algorithm);
    }
  }

  public importKey(format: "jwk", keyData: JsonWebKey, algorithm: string | (Algorithm & wcp11.Pkcs11Params) | (RsaHashedImportParams & wcp11.Pkcs11Params) | (EcKeyImportParams & wcp11.Pkcs11Params), extractable: boolean, keyUsages: string[]): Promise<wcp11.CryptoKey>;
  public importKey(format: "raw" | "pkcs8" | "spki", keyData: Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array | DataView | ArrayBuffer, algorithm: string | (Algorithm & wcp11.Pkcs11Params) | (RsaHashedImportParams & wcp11.Pkcs11Params) | (EcKeyImportParams & wcp11.Pkcs11Params), extractable: boolean, keyUsages: string[]): Promise<wcp11.CryptoKey>;
  public importKey(format: string, keyData: Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array | DataView | ArrayBuffer | JsonWebKey, algorithm: string | (Algorithm & wcp11.Pkcs11Params) | (RsaHashedImportParams & wcp11.Pkcs11Params) | (EcKeyImportParams & wcp11.Pkcs11Params), extractable: boolean, keyUsages: string[]): Promise<wcp11.CryptoKey>;
  public async importKey(format: any, keyData: any, algorithm: any, extractable: any, keyUsages: any): Promise<wcp11.CryptoKey> {
    const key = await this.crypto.crypto.subtle.importKey(format, keyData, algorithm, extractable, keyUsages);
    return this.processKey(key, algorithm);
  }

  public async sign(algorithm: string | AesCmacParams | RsaPssParams | EcdsaParams, key: wcp11.CryptoKey, data: Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array | DataView | ArrayBuffer): Promise<ArrayBuffer> {
    return this.crypto.crypto.subtle.sign(algorithm, key, data);
  }

  public async unwrapKey(format: string, wrappedKey: Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array | DataView | ArrayBuffer, unwrappingKey: wcp11.CryptoKey, unwrapAlgorithm: string | Algorithm, unwrappedKeyAlgorithm: string | Algorithm, extractable: boolean, keyUsages: string[]): Promise<wcp11.CryptoKey> {
    const key = await this.crypto.crypto.subtle.unwrapKey(format, wrappedKey, unwrappingKey, unwrapAlgorithm, unwrappedKeyAlgorithm, extractable, keyUsages);
    return this.processKey(key, unwrappedKeyAlgorithm);
  }

  public async verify(algorithm: string | AesCmacParams | RsaPssParams | EcdsaParams, key: wcp11.CryptoKey, signature: Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array | DataView | ArrayBuffer, data: Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array | DataView | ArrayBuffer): Promise<boolean> {
    return this.crypto.crypto.subtle.verify(algorithm, key, signature, data);
  }

  public async wrapKey(format: string, key: wcp11.CryptoKey, wrappingKey: wcp11.CryptoKey, wrapAlgorithm: string | Algorithm): Promise<ArrayBuffer> {
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
