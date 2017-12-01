/// <reference types="webcrypto-core" />

declare module "node-webcrypto-p11/built/subtle" {

    class SubtleCrypto<T extends Crypto> implements NativeSubtleCrypto {
        protected crypto: T;
        constructor(crypto: T);
        public decrypt(algorithm: string | RsaOaepParams | AesCtrParams | AesCbcParams | AesCmacParams | AesGcmParams | AesCfbParams, key: CryptoKey, data: BufferSource): PromiseLike<ArrayBuffer>;
        public deriveBits(algorithm: string | EcdhKeyDeriveParams | DhKeyDeriveParams | ConcatParams | HkdfCtrParams | Pbkdf2Params, baseKey: CryptoKey, length: number): PromiseLike<ArrayBuffer>;
        public deriveKey(algorithm: string | EcdhKeyDeriveParams | DhKeyDeriveParams | ConcatParams | HkdfCtrParams | Pbkdf2Params, baseKey: CryptoKey, derivedKeyType: string | AesDerivedKeyParams | HmacImportParams | ConcatParams | HkdfCtrParams | Pbkdf2Params, extractable: boolean, keyUsages: string[]): PromiseLike<CryptoKey>;
        public digest(algorithm: AlgorithmIdentifier, data: BufferSource): PromiseLike<ArrayBuffer>;
        public encrypt(algorithm: string | RsaOaepParams | AesCtrParams | AesCbcParams | AesCmacParams | AesGcmParams | AesCfbParams, key: CryptoKey, data: BufferSource): PromiseLike<ArrayBuffer>;
        public exportKey(format: "jwk", key: CryptoKey): PromiseLike<JsonWebKey>;
        public exportKey(format: "raw" | "pkcs8" | "spki", key: CryptoKey): PromiseLike<ArrayBuffer>;
        public exportKey(format: string, key: CryptoKey): PromiseLike<JsonWebKey | ArrayBuffer>;
        public generateKey(algorithm: string, extractable: boolean, keyUsages: string[]): PromiseLike<CryptoKeyPair | CryptoKey>;
        public generateKey(algorithm: RsaHashedKeyGenParams | EcKeyGenParams | DhKeyGenParams, extractable: boolean, keyUsages: string[]): PromiseLike<CryptoKeyPair>;
        public generateKey(algorithm: AesKeyGenParams | HmacKeyGenParams | Pbkdf2Params, extractable: boolean, keyUsages: string[]): PromiseLike<CryptoKey>;
        public importKey(format: "jwk", keyData: JsonWebKey, algorithm: string | RsaHashedImportParams | EcKeyImportParams | HmacImportParams | DhImportKeyParams, extractable: boolean, keyUsages: string[]): PromiseLike<CryptoKey>;
        public importKey(format: "raw" | "pkcs8" | "spki", keyData: BufferSource, algorithm: string | RsaHashedImportParams | EcKeyImportParams | HmacImportParams | DhImportKeyParams, extractable: boolean, keyUsages: string[]): PromiseLike<CryptoKey>;
        public importKey(format: string, keyData: JsonWebKey | BufferSource, algorithm: string | RsaHashedImportParams | EcKeyImportParams | HmacImportParams | DhImportKeyParams, extractable: boolean, keyUsages: string[]): PromiseLike<CryptoKey>;
        public sign(algorithm: string | RsaPssParams | EcdsaParams | AesCmacParams, key: CryptoKey, data: BufferSource): PromiseLike<ArrayBuffer>;
        public unwrapKey(format: string, wrappedKey: BufferSource, unwrappingKey: CryptoKey, unwrapAlgorithm: AlgorithmIdentifier, unwrappedKeyAlgorithm: AlgorithmIdentifier, extractable: boolean, keyUsages: string[]): PromiseLike<CryptoKey>;
        public verify(algorithm: string | RsaPssParams | EcdsaParams | AesCmacParams, key: CryptoKey, signature: BufferSource, data: BufferSource): PromiseLike<boolean>;
        public wrapKey(format: string, key: CryptoKey, wrappingKey: CryptoKey, wrapAlgorithm: AlgorithmIdentifier): PromiseLike<ArrayBuffer>;
    }

}

declare module "node-webcrypto-p11/built/key_storage" {

    export class KeyStorage<T extends Crypto> implements IKeyStorage {
        protected crypto: T;

        constructor(crypto: T);

        /**
         * Return list of names of stored keys
         */
        public keys(): Promise<string[]>;

        /**
         * Returns identity of item from key storage.
         * If item is not found, then returns `null`
         *
         * @param item
         */
        public indexOf(item: CryptoKey): Promise<string | null>;
        /**
         * Returns key from storage
         *
         * @param key
         */
        public getItem(key: string): Promise<CryptoKey>;
        /**
         * Returns key from storage
         *
         * @param key
         * @param algorithm
         * @param usages
         */
        public getItem(key: string, algorithm: Algorithm, usages: string[]): Promise<CryptoKey>;
        /**
         * Add key to storage
         *
         * @param key
         * @param value
         */
        public setItem(value: CryptoKey): Promise<string>;

        /**
         * Removes item from storage by given key
         *
         * @param key
         */
        public removeItem(key: string): Promise<void>;
        public clear(): Promise<void>;
    }
}

declare module "node-webcrypto-p11/built/cert_storage" {

    export class Pkcs11CertificateStorage<T extends Crypto> implements ICertificateStorage {
        protected crypto: T;

        constructor(crypto: T);

        public keys(): Promise<string[]>;
        public indexOf(item: CryptoCertificate): Promise<string | null>;

        public importCert(type: "request", data: BufferSource, algorithm: Algorithm, keyUsages: string[]): Promise<CryptoX509CertificateRequest>;
        public importCert(type: "x509", data: BufferSource, algorithm: Algorithm, keyUsages: string[]): Promise<CryptoX509Certificate>;
        public importCert(type: CryptoCertificateFormat, data: BufferSource, algorithm: Algorithm, keyUsages: string[]): Promise<CryptoCertificate>;

        public exportCert(format: "pem", item: CryptoCertificate): Promise<string>;
        public exportCert(format: "raw", item: CryptoCertificate): Promise<ArrayBuffer>;
        public exportCert(format: CryptoCertificateFormat, item: CryptoCertificate): Promise<ArrayBuffer | string>;

        public setItem(item: CryptoCertificate): Promise<string>;
        public getItem(key: string): Promise<CryptoCertificate>;
        public getItem(key: string, algorithm: Algorithm, keyUsages: string[]): Promise<CryptoCertificate>;
        public removeItem(key: string): Promise<void>;
        public clear(): Promise<void>;

        protected getItemById(id: string): GraphenePkcs11.Data | GraphenePkcs11.X509Certificate;

    }

}
