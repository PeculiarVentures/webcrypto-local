
import { Convert } from "pvtsutils";

export interface CertificateConstructor<T> {
    new (): T;
}

export abstract class Certificate implements CryptoCertificate {

    public static importCert<T extends Certificate>(this: CertificateConstructor<T>, provider: Crypto, rawData: BufferSource): Promise<T>;
    public static importCert<T extends Certificate>(this: CertificateConstructor<T>, provider: Crypto, rawData: BufferSource, algorithm: Algorithm, keyUsages: string[]): Promise<T>
    public static async importCert<T extends Certificate>(this: CertificateConstructor<T>, provider: Crypto, rawData: BufferSource, algorithm?: Algorithm, keyUsages?: string[]): Promise<T> {
        const res = new this();
        res.importCert(provider, rawData, algorithm, keyUsages);
        return res;
    }

    public type: string;
    public publicKey: CryptoKey;
    public id: string;

    protected raw: Uint8Array;

    public abstract importRaw(rawData: BufferSource): void;

    public exportRaw() {
        return this.raw.buffer;
    }

    public abstract exportKey(provider: Crypto): Promise<CryptoKey>;
    public abstract exportKey(provider: Crypto, algorithm: Algorithm, keyUsages: string[]): Promise<CryptoKey>;

    public importCert(provider: Crypto, rawData: BufferSource): Promise<void>;
    public importCert(provider: Crypto, rawData: BufferSource, algorithm: Algorithm, keyUsages: string[]): Promise<void>;
    public async importCert(provider: Crypto, rawData: BufferSource, algorithm?: Algorithm, keyUsages?: string[]) {
        this.importRaw(rawData);
        this.publicKey = await this.exportKey(provider, algorithm, keyUsages);
        this.id = await this.getID(provider, "SHA-256");
    }

    public async getID(provider: Crypto, algorithm: string) {
        const hash = await provider.subtle.digest(algorithm, this.raw);
        return Convert.ToHex(hash);
    }

}
