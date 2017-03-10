import * as Asn1Js from "asn1js";
import { Convert } from "pvtsutils";

const { Certificate, setEngine } = require("pkijs");

export declare type DigestAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

/**
 * List of OIDs
 * Source: https://msdn.microsoft.com/ru-ru/library/windows/desktop/aa386991(v=vs.85).aspx
 */
const OID: { [key: string]: { short?: string, long?: string } } = {
    "2.5.4.3": {
        short: "CN",
        long: "CommonName",
    },
    "2.5.4.6": {
        short: "C",
        long: "Country",
    },
    "2.5.4.5": {
        long: "DeviceSerialNumber",
    },
    "0.9.2342.19200300.100.1.25": {
        short: "DC",
        long: "DomainComponent",
    },
    "1.2.840.113549.1.9.1": {
        short: "E",
        long: "EMail",
    },
    "2.5.4.42": {
        short: "G",
        long: "GivenName",
    },
    "2.5.4.43": {
        short: "I",
        long: "Initials",
    },
    "2.5.4.7": {
        short: "L",
        long: "Locality",
    },
    "2.5.4.10": {
        short: "O",
        long: "Organization",
    },
    "2.5.4.11": {
        short: "OU",
        long: "OrganizationUnit",
    },
    "2.5.4.8": {
        short: "ST",
        long: "State",
    },
    "2.5.4.9": {
        short: "Street",
        long: "StreetAddress",
    },
    "2.5.4.4": {
        short: "SN",
        long: "SurName",
    },
    "2.5.4.12": {
        short: "T",
        long: "Title",
    },
    "1.2.840.113549.1.9.8": {
        long: "UnstructuredAddress",
    },
    "1.2.840.113549.1.9.2": {
        long: "UnstructuredName",
    },
};

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
        return this.nameToString(this.asn1.issuer);
    }

    /**
     * Gets a subject name of the certificate
     */
    public get subjectName(): string {
        return this.nameToString(this.asn1.subject);
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
                console.log(alg);
                console.log("Name:", alg.algorithm.name);
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

    /**
     * Converts X500Name to string
     * @param  {RDN} name X500Name
     * @param  {string} splitter Splitter char. Default ','
     * @returns string Formated string
     * Example:
     * > C=Some name, O=Some organization name, C=RU
     */
    protected nameToString(name: any, splitter: string = ","): string {
        const res: string[] = [];
        name.typesAndValues.forEach((typeValue: any) => {
            const type = typeValue.type;
            const value = OID[type.toString()].short;
            res.push(`${value ? value : type}=${typeValue.value.valueBlock.value}`);
        });
        return res.join(splitter + " ");
    }
}
