import * as Asn1Js from "asn1js";
import { Crypto, CryptoKey, CryptoX509Certificate } from "node-webcrypto-p11";
import { Convert } from "pvtsutils";
import { Certificate } from "./cert";
import { nameToString } from "./x500_name";

const pkijs = require("pkijs");
const { setEngine, CryptoEngine } = pkijs;
const PKICertificate = pkijs.Certificate;

export class X509Certificate extends Certificate implements CryptoX509Certificate {

  public readonly type = "x509";

  protected asn1: any;

  /**
   * Gets a serial number of the certificate in HEX format
   */
  public get serialNumber(): string {
    return Convert.ToHex(new Uint8Array(this.asn1.serialNumber.valueBlock.valueHex));
  }

  /**
   * Gets a issuer name of the certificate
   */
  public get issuerName(): string {
    return nameToString(this.asn1.issuer);
  }

  /**
   * Gets a subject name of the certificate
   */
  public get subjectName(): string {
    return nameToString(this.asn1.subject);
  }

  public get notBefore(): Date {
    return this.asn1.notBefore.value;
  }

  public get notAfter(): Date {
    return this.asn1.notAfter.value;
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
    const asn1 = Asn1Js.fromBER(this.raw.buffer);
    this.asn1 = new PKICertificate({ schema: asn1.result });
  }

  /**
   * Returns public key from X509Certificate
   * @param  {Algorithm} algorithm
   * @returns Promise
   */
  public exportKey(provider: Crypto): Promise<CryptoKey>;
  public exportKey(provider: Crypto, algorithm: Algorithm, keyUsages: string[]): Promise<CryptoKey>;
  public async exportKey(provider: Crypto, algorithm?: Algorithm, usages?: string[]): Promise<CryptoKey> {
    setEngine("unknown", provider, new CryptoEngine({ name: "unknown", crypto: provider, subtle: provider.subtle }));
    const key = await this.asn1.getPublicKey(algorithm ? { algorithm: { algorithm, usages } } : null);
    return key;
  }

}
