import { getEngine } from "2key-ratchet";
import { Convert } from "pvtsutils";
import * as core from "webcrypto-core";

export interface CertificateConstructor<T> {
  // tslint:disable-next-line:callable-types
  new(): T;
}

export abstract class Certificate implements core.CryptoCertificate {

  public static importCert<T extends Certificate>(this: CertificateConstructor<T>, provider: Crypto, rawData: BufferSource): Promise<T>;
  public static importCert<T extends Certificate>(this: CertificateConstructor<T>, provider: Crypto, rawData: BufferSource, algorithm: Algorithm, keyUsages: KeyUsage[]): Promise<T>;
  public static async importCert<T extends Certificate>(this: CertificateConstructor<T>, provider: Crypto, rawData: BufferSource, algorithm?: Algorithm, keyUsages?: KeyUsage[]): Promise<T> {
    const res = new this();
    await res.importCert(provider, rawData, algorithm, keyUsages);
    return res;
  }

  public type: core.CryptoCertificateType;
  public publicKey: CryptoKey;
  public id: string;
  public crypto = getEngine().crypto;

  protected raw: Uint8Array;

  public abstract importRaw(rawData: BufferSource): void;

  public exportRaw() {
    return this.raw.buffer;
  }

  public abstract exportKey(provider: Crypto): Promise<CryptoKey>;
  public abstract exportKey(provider: Crypto, algorithm: Algorithm, keyUsages: string[]): Promise<CryptoKey>;

  public importCert(provider: Crypto, rawData: BufferSource): Promise<void>;
  public importCert(provider: Crypto, rawData: BufferSource, algorithm: Algorithm, keyUsages: string[]): Promise<void>;
  public async importCert(provider: Crypto, rawData: BufferSource, algorithm?: Algorithm, keyUsages?: string[]) {
    this.importRaw(rawData);
    this.publicKey = await this.exportKey(provider, algorithm, keyUsages);
    this.id = await this.getID(provider, "SHA-1");
  }

  public async getID(provider: Crypto, algorithm: string) {
    const publicKey = await this.exportKey(provider);
    const spki = await provider.subtle.exportKey("spki", publicKey);
    const sha1Hash = await provider.subtle.digest("SHA-1", spki);
    const rnd = this.crypto.getRandomValues(new Uint8Array(4));
    return `${this.type}-${Convert.ToHex(rnd)}-${Convert.ToHex(sha1Hash)}`;
  }

}
