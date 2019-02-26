import * as Asn1Js from "asn1js";
import * as core from "webcrypto-core";
import { Certificate } from "./cert";
import { nameToString } from "./x500_name";

const { CertificationRequest, setEngine, CryptoEngine } = require("pkijs");

export class X509CertificateRequest extends Certificate implements core.CryptoX509CertificateRequest {

  public type: "request" = "request";

  protected asn1: any;

  /**
   * Gets a subject name of the certificate
   */
  public get subjectName(): string {
    return nameToString(this.asn1.subject);
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
    this.asn1 = new CertificationRequest({ schema: asn1.result });
  }

  /**
   * Returns public key from X509Certificate
   * @param  {Algorithm} algorithm
   * @returns Promise
   */
  public exportKey(provider: Crypto): Promise<CryptoKey>;
  public exportKey(provider: Crypto, algorithm: Algorithm, usages: string[]): Promise<CryptoKey>;
  public async exportKey(provider: Crypto, algorithm?: Algorithm, usages?: string[]): Promise<CryptoKey> {
    setEngine("unknown", provider, new CryptoEngine({ name: "unknown", crypto: provider, subtle: provider.subtle }));
    return this.asn1.getPublicKey(algorithm ? { algorithm: { algorithm, usages } } : null)
      .then((key: CryptoKey) => {
        return key;
      });
  }

}
