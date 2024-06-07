import * as x509 from "@peculiar/x509";
import { Crypto, CryptoKey } from "node-webcrypto-p11";
import { Convert } from "pvtsutils";
import * as core from "webcrypto-core";
import { Certificate } from "./cert";
import { nameToString } from "./x500_name";

export class X509Certificate extends Certificate implements core.CryptoX509Certificate {

  public readonly type = "x509";

  protected asn1!: x509.X509Certificate;

  /**
   * Gets a serial number of the certificate in HEX format
   */
  public get serialNumber(): string {
    return this.asn1.serialNumber;
  }

  /**
   * Gets a issuer name of the certificate
   */
  public get issuerName(): string {
    return this.asn1.issuer;
  }

  /**
   * Gets a subject name of the certificate
   */
  public get subjectName(): string {
    return nameToString(this.asn1.subject);
  }

  public get notBefore(): Date {
    return this.asn1.notBefore;
  }

  public get notAfter(): Date {
    return this.asn1.notAfter;
  }

  /**
   * Loads X509Certificate from DER data
   * @param  {Uint8Array} rawData
   */
  public importRaw(rawData: BufferSource) {
    if (rawData instanceof ArrayBuffer || (typeof Buffer !== "undefined" && Buffer.isBuffer(rawData))) {
      this.raw = new Uint8Array(rawData as ArrayBuffer);
    } else {
      this.raw = new Uint8Array(rawData.buffer);
    }
    this.raw = new Uint8Array(rawData as ArrayBuffer);
    this.asn1 = new x509.X509Certificate(this.raw);
  }

  /**
   * Returns public key from X509Certificate
   * @param  {Algorithm} algorithm
   * @returns Promise
   */
  public exportKey(provider: Crypto): Promise<CryptoKey>;
  public exportKey(provider: Crypto, algorithm: Algorithm, keyUsages: string[]): Promise<CryptoKey>;
  public async exportKey(provider: Crypto, algorithm?: Algorithm, usages?: string[]): Promise<CryptoKey> {
    const key = (algorithm && usages)
      ? await this.asn1.publicKey.export(algorithm, usages as KeyUsage[], provider)
      : this.asn1.publicKey.export(provider);

    return key as CryptoKey;
  }

}
