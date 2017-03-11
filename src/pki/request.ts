import * as Asn1Js from "asn1js";
import { nameToString } from "./x500_name";

const { CertificationRequest } = require("pkijs");

export declare type DigestAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";


export class X509Request {

    public static importRaw(rawData: BufferSource) {
        const res = new this();
        res.importRaw(rawData);
        return res;
    }

    protected raw: Uint8Array;
    protected asn1: any;

    constructor(rawData?: BufferSource) {
        if (rawData) {
            const buf = new Uint8Array(rawData as ArrayBuffer);
            this.importRaw(buf);
            this.raw = buf;
        }
    }

    /**
     * Gets a subject name of the certificate
     */
    public get subjectName(): string {
        return nameToString(this.asn1.subject);
    }

    /**
     * Returns a thumbprint of the certificate
     * @param  {DigestAlgorithm="SHA-1"} algName Digest algorithm name
     * @returns PromiseLike
     */
    public thumbprint(provider: Crypto, algName: DigestAlgorithm = "SHA-1"): PromiseLike<ArrayBuffer> {
        return provider.subtle.digest(algName, this.raw);
    }

    /**
     * Returns DER raw of X509Certificate
     */
    public exportRaw(): Uint8Array {
        return this.raw;
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
    public exportKey(provider: Crypto, algorithm: Algorithm, usages: string[]): PromiseLike<CryptoKey> {
        return Promise.resolve()
            .then(() => {
                const publicKeyInfoSchema = this.asn1.subjectPublicKeyInfo.toSchema();
                const publicKeyInfoBuffer = publicKeyInfoSchema.toBER(false);

                return provider.subtle.importKey("spki", publicKeyInfoBuffer, algorithm, true, usages);
            });
    }

}
