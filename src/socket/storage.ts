export type HexString = string;

export interface X509Certificate {
    id: string;
    serialNumber: HexString;
    issuerName: string;
    subjectName: string;
    type: "x509";
    publicKey: CryptoKey;
    value: ArrayBuffer;
};
export interface X509Request extends StorageItem {
    id: string;
    subjectName: string;
    type: "request";
    publicKey: CryptoKey;
    value: ArrayBuffer;
};

// CryptoKey | X509Certificate | X509Request
interface StorageItem {
    type: string | "private" | "public" | "x509" | "request";
}

/**
 * Loads and saves Crypt data on Socket storage
 */
export declare class SocketStorage {
    readonly length: number;
    clear(): Promise<void>;
    getItem(key: string): Promise<StorageItem | null>;
    removeItem(key: string): Promise<void>;
    setItem(key: string, data: StorageItem): Promise<void>;
}