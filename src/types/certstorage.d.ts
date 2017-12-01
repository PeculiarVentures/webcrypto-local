type HexString = string;

type CryptoCertificateFormat = string | "x509" | "request";

interface CryptoCertificate {
    type: CryptoCertificateFormat;
    publicKey: CryptoKey;
}

interface CryptoX509Certificate extends CryptoCertificate {
    notBefore: Date;
    notAfter: Date;
    serialNumber: HexString;
    issuerName: string;
    subjectName: string;
}

interface CryptoX509CertificateRequest extends CryptoCertificate {
    subjectName: string;
}

interface ICertificateStorage {

    keys(): Promise<string[]>;
    indexOf(item: CryptoCertificate): Promise<string | null>;

    /**
     * Import certificate from data
     *
     * @param {CertificateItemType} type Type of certificate
     * @param {(ArrayBuffer)} data Raw of certificate item
     * @returns {Promise<CryptoCertificate>}
     *
     * @memberOf CertificateStorage
     */
    importCert(type: "request", data: BufferSource, algorithm: Algorithm, keyUsages: string[]): Promise<CryptoX509CertificateRequest>;
    importCert(type: "x509", data: BufferSource, algorithm: Algorithm, keyUsages: string[]): Promise<CryptoX509Certificate>;
    importCert(type: CryptoCertificateFormat, data: BufferSource, algorithm: Algorithm, keyUsages: string[]): Promise<CryptoCertificate>;

    exportCert(format: "pem", item: CryptoCertificate): Promise<string>;
    exportCert(format: "raw", item: CryptoCertificate): Promise<ArrayBuffer>;
    exportCert(format: CryptoCertificateFormat, item: CryptoCertificate): Promise<ArrayBuffer | string>;

    setItem(item: CryptoCertificate): Promise<string>;
    getItem(key: string): Promise<CryptoCertificate>;
    getItem(key: string, algorithm: Algorithm, keyUsages: string[]): Promise<CryptoCertificate>;
    removeItem(key: string): Promise<void>;
    clear(): Promise<void>;
}
