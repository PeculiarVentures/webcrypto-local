import * as x509 from "@peculiar/x509";
import { Crypto, CryptoKey } from "node-webcrypto-p11";
import * as core from "webcrypto-core";
import { Certificate } from "./cert";


export class X509CertificateRequest extends Certificate implements core.CryptoX509CertificateRequest {

  public type: "request" = "request";

  protected asn1!: x509.Pkcs10CertificateRequest;

  /**
   * Gets a subject name of the certificate
   */
  public get subjectName(): string {
    return this.asn1.subject;
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
    this.asn1 = new x509.Pkcs10CertificateRequest(rawData);
  }

  /**
   * Returns public key from X509Certificate
   * @param  {Algorithm} algorithm
   * @returns Promise
   */
  public exportKey(provider: Crypto): Promise<CryptoKey>;
  public exportKey(provider: Crypto, algorithm: Algorithm, usages: string[]): Promise<CryptoKey>;
  public async exportKey(provider: Crypto, algorithm?: Algorithm, usages?: string[]): Promise<CryptoKey> {
    let key = (algorithm && usages)
      ? await this.asn1.publicKey.export(algorithm, usages as KeyUsage[], provider)
      : this.asn1.publicKey.export(provider);

    return key as CryptoKey;
  }

}
