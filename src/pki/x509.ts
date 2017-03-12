import * as Asn1Js from "asn1js";
import { Convert } from "pvtsutils";
import { nameToString } from "./x500_name";

const { Certificate, setEngine } = require("pkijs");

export declare type DigestAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

export class X509Certificate {

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
        this.asn1 = new Certificate({ schema: asn1.result });
    }

    /**
     * Returns public key from X509Certificate
     * @param  {Algorithm} algorithm
     * @returns Promise
     */
    public exportKey(provider: Crypto, algorithm: Algorithm, usages: string[]): PromiseLike<CryptoKey> {
        return Promise.resolve()
            .then(() => {
                setEngine("unknown", provider, provider.subtle);
                const alg = {
                    algorithm,
                    usages,
                };
                if (alg.algorithm.name.toUpperCase() === "ECDSA") {
                    // Set named curve
                    (alg.algorithm as any).namedCurve = this.asn1.subjectPublicKeyInfo.toJSON().crv;
                }
                return this.asn1.getPublicKey({ algorithm: alg })
                    .then((key: CryptoKey) => {
                        return key;
                    });
            });
    }

}
