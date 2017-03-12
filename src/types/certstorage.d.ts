type HexString = string;

type CertificateItemType = string | "x509" | "request";

interface ICertificateStorageItem {
    id: string;
    type: CertificateItemType;
    publicKey: CryptoKey;
    value: ArrayBuffer;
}

interface IX509Certificate extends ICertificateStorageItem {
    serialNumber: HexString;
    issuerName: string;
    subjectName: string;
}

interface IX509Request extends ICertificateStorageItem {
    subjectName: string;
}

interface ICertificateStorage {

    keys(): Promise<string[]>;

    /**
     * Import certificate from data
     * 
     * @param {CertificateItemType} type Type of certificate
     * @param {(ArrayBuffer)} data Raw of certificate item
     * @returns {Promise<ICertificateStorageItem>} 
     * 
     * @memberOf CertificateStorage
     */
    importCert(type: CertificateItemType, data: ArrayBuffer, algorithm: Algorithm, keyUsages: string[]): Promise<ICertificateStorageItem>;

    setItem(key: string, item: ICertificateStorageItem): Promise<void>;
    getItem(key: string): Promise<ICertificateStorageItem>;
    removeItem(key: string): Promise<void>;

}