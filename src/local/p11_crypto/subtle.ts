/**
 * NOTE: We are using PKCS#11 Subtle directly from built folder,
 * because it's not exported from node-webcrypto-p11 module
 */
import { SubtleCrypto } from "node-webcrypto-p11/built/subtle";
import { Pkcs11Crypto } from "./crypto";
import { fixObject, isOsslObject, OsslCryptoKey } from "./helper";

export class Pkcs11SubtleCrypto extends SubtleCrypto<Pkcs11Crypto> {

    public async importKey(format: string, keyData: JsonWebKey | BufferSource, algorithm: string | RsaHashedImportParams | EcKeyImportParams | HmacImportParams | DhImportKeyParams, extractable: boolean, keyUsages: string[]) {
        let key: CryptoKey;
        try {
            console.log("PKCS11:importKey");
            key = await super.importKey(format, keyData, algorithm, extractable, keyUsages);
        } catch (err) {
            console.log("OSSL:importKey");
            key = await this.crypto.ossl.subtle.importKey(format, keyData, algorithm, extractable, keyUsages) as OsslCryptoKey;
            fixObject(this.crypto, key);
        }
        return key;
    }

    public async verify(algorithm: string | RsaPssParams | EcdsaParams | AesCmacParams, key: CryptoKey, signature: BufferSource, data: BufferSource) {
        if (!isOsslObject(key)) {
            console.log("PKCS11:verify");
            return super.verify(algorithm, key, signature, data);
        } else {
            console.log("OSSL:verify");
            return this.crypto.ossl.subtle.verify(algorithm, key, signature, data);
        }
    }

}