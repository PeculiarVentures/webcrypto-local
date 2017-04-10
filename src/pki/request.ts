import * as Asn1Js from "asn1js";
import { Certificate } from "./cert";
import { nameToString } from "./x500_name";

const { CertificationRequest } = require("pkijs");

export declare type DigestAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

export class X509CertificateRequest extends Certificate implements CryptoX509CertificateRequest {

    public type = "request";
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
        const publicKeyInfoSchema = this.asn1.subjectPublicKeyInfo.toSchema();
        const publicKeyInfoBuffer = publicKeyInfoSchema.toBER(false);

        return provider.subtle.importKey("spki", publicKeyInfoBuffer, algorithm, true, usages);
    }

}
