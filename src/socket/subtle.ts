import { Convert } from "pvtsutils";
import { PrepareAlgorithm, PrepareData, SubtleCrypto } from "webcrypto-core";
import { AlgorithmProto, CryptoKeyPairProto, CryptoKeyProto } from "../core";
import { SignActionProto, VerifyActionProto } from "../core/protos/subtle";
import { ExportKeyActionProto, ImportKeyActionProto } from "../core/protos/subtle";
import { DecryptActionProto, EncryptActionProto } from "../core/protos/subtle";
import { DeriveBitsActionProto, DeriveKeyActionProto } from "../core/protos/subtle";
import { UnwrapKeyActionProto, WrapKeyActionProto } from "../core/protos/subtle";
import { DigestActionProto, GenerateKeyActionProto } from "../core/protos/subtle";
import { SocketCrypto } from "./crypto";

export class SocketSubtleCrypto extends SubtleCrypto {

    protected readonly service: SocketCrypto;

    constructor(crypto: SocketCrypto) {
        super();
        this.service = crypto;
    }

    public async encrypt(algorithm: Algorithm, key: CryptoKeyProto, data: BufferSource) {
        return this.encryptData(algorithm, key, data, "encrypt");
    }

    public async decrypt(algorithm: Algorithm, key: CryptoKeyProto, data: BufferSource) {
        return this.encryptData(algorithm, key, data, "decrypt");
    }

    public async deriveBits(algorithm: string | EcdhKeyDeriveParams | DhKeyDeriveParams | ConcatParams | HkdfCtrParams | Pbkdf2Params, baseKey: CryptoKeyProto, length: number) {
        const alg = PrepareAlgorithm(algorithm as AlgorithmIdentifier);
        const algProto = new AlgorithmProto();
        algProto.fromAlgorithm(alg);
        await super.deriveBits(algorithm, baseKey, length);

        const action = new DeriveBitsActionProto();
        action.providerID = this.service.id;
        action.algorithm = algProto;
        action.algorithm.public = await (alg as any).public.exportProto();
        action.key = baseKey;
        action.length = length;

        const result = await this.service.client.send(action);
        return result;
    }

    public async deriveKey(algorithm: string | EcdhKeyDeriveParams | DhKeyDeriveParams | ConcatParams | HkdfCtrParams | Pbkdf2Params, baseKey: CryptoKeyProto, derivedKeyType: string | AesDerivedKeyParams | HmacImportParams | ConcatParams | HkdfCtrParams | Pbkdf2Params, extractable: boolean, keyUsages: string[]) {
        // check incoming data
        await super.deriveKey(algorithm, baseKey, derivedKeyType, extractable, keyUsages);

        // prepare incoming data
        const alg = PrepareAlgorithm(algorithm as AlgorithmIdentifier);
        const algKeyType = PrepareAlgorithm(derivedKeyType as AlgorithmIdentifier);

        const action = new DeriveKeyActionProto();
        action.providerID = this.service.id;
        action.algorithm.fromAlgorithm(alg);
        action.algorithm.public = await (alg as any).public.exportProto();
        action.derivedKeyType.fromAlgorithm(algKeyType);
        action.key = baseKey;
        action.extractable = extractable;
        action.usage = keyUsages;

        const result = await this.service.client.send(action);

        // CryptoKey
        return await CryptoKeyProto.importProto(result);
    }

    public async digest(algorithm: AlgorithmIdentifier, data: BufferSource) {
        let res: ArrayBuffer;
        const alg = PrepareAlgorithm(algorithm);
        if (self.crypto) {
            try {
                res = await self.crypto.subtle.digest(alg, data as ArrayBuffer);
            } catch (err) {
                console.warn(`Cannot do native digest for algorithm '${alg.name}'`);
            }
        }
        if (res) {
            return res;
        }
        const buffer = PrepareData(data, "data");
        await super.digest(alg as any, buffer);

        const algProto = new AlgorithmProto();
        algProto.fromAlgorithm(alg);

        const action = new DigestActionProto();
        action.algorithm = algProto;
        action.data = buffer.buffer;
        action.providerID = this.service.id;

        const result = await this.service.client.send(action);

        return result;
    }

    public generateKey(algorithm: string, extractable: boolean, keyUsages: string[]): Promise<CryptoKeyPair | CryptoKey>;
    public generateKey(algorithm: RsaHashedKeyGenParams | EcKeyGenParams | DhKeyGenParams, extractable: boolean, keyUsages: string[]): Promise<CryptoKeyPair>;
    public generateKey(algorithm: AesKeyGenParams | HmacKeyGenParams | Pbkdf2Params, extractable: boolean, keyUsages: string[]): Promise<CryptoKey>;
    public async generateKey(algorithm: AlgorithmIdentifier, extractable: boolean, keyUsages: string[]): Promise<CryptoKey | CryptoKeyPair> {
        const alg = PrepareAlgorithm(algorithm);
        await super.generateKey(alg as any, extractable, keyUsages);
        const algProto = new AlgorithmProto();
        algProto.fromAlgorithm(alg);

        const action = new GenerateKeyActionProto();
        action.providerID = this.service.id;
        action.algorithm = algProto;
        action.extractable = extractable;
        action.usage = keyUsages;

        const result = await this.service.client.send(action);

        try {
            // CryptoKeyPair
            return await CryptoKeyPairProto.importProto(result);
        } catch (e) {
            // CryptoKey
            return await CryptoKeyProto.importProto(result);
        }
    }

    public async exportKey(format: string, key: CryptoKeyProto) {
        await super.exportKey(format, key);

        const action = new ExportKeyActionProto();
        action.providerID = this.service.id;
        action.format = format;
        action.key = key;

        const result = await this.service.client.send(action);
        if (format === "jwk") {
            return JSON.parse(Convert.ToBinary(result));
        } else {
            return result;
        }
    }

    public async importKey(format: string, keyData: JsonWebKey | BufferSource, algorithm: string | RsaHashedImportParams | EcKeyImportParams | HmacImportParams | DhImportKeyParams, extractable: boolean, keyUsages: string[]) {
        await super.importKey(format, keyData, algorithm, extractable, keyUsages);

        const alg = PrepareAlgorithm(algorithm as AlgorithmIdentifier);
        let preparedKeyData;
        if (format === "jwk") {
            preparedKeyData = Convert.FromUtf8String(JSON.stringify(keyData));
        } else {
            preparedKeyData = PrepareData(keyData as BufferSource, "keyData").buffer;
        }

        const action = new ImportKeyActionProto();
        action.providerID = this.service.id;
        action.algorithm.fromAlgorithm(alg);
        action.keyData = preparedKeyData;
        action.format = format;
        action.extractable = extractable;
        action.keyUsages = keyUsages;

        const result = await this.service.client.send(action);

        // CryptoKey
        return await CryptoKeyProto.importProto(result);
    }

    public async sign(algorithm: string | RsaPssParams | EcdsaParams | AesCmacParams, key: CryptoKeyProto, data: BufferSource) {
        const alg = PrepareAlgorithm(algorithm as AlgorithmIdentifier);
        const algProto = new AlgorithmProto();
        algProto.fromAlgorithm(alg);
        const buffer = PrepareData(data, "data");

        await super.sign(algorithm, key, buffer);

        const action = new SignActionProto();
        action.providerID = this.service.id;
        action.algorithm = algProto;
        action.key = key;
        action.data = buffer.buffer;

        const result = await this.service.client.send(action);
        return result;
    }

    public async verify(algorithm: string | RsaPssParams | EcdsaParams | AesCmacParams, key: CryptoKeyProto, signature: BufferSource, data: BufferSource) {
        await super.verify(algorithm, key, signature, signature);

        const alg = PrepareAlgorithm(algorithm as AlgorithmIdentifier);
        const algProto = new AlgorithmProto();
        algProto.fromAlgorithm(alg);
        const buffer = PrepareData(data, "data");
        const signatureBytes = PrepareData(signature, "signature");

        const action = new VerifyActionProto();
        action.providerID = this.service.id;
        action.algorithm = algProto;
        action.key = key;
        action.data = buffer.buffer;
        action.signature = signatureBytes.buffer;

        const result = await this.service.client.send(action);
        return !!(new Uint8Array(result)[0]);
    }

    public async wrapKey(format: string, key: CryptoKeyProto, wrappingKey: CryptoKeyProto, wrapAlgorithm: AlgorithmIdentifier) {
        await super.wrapKey(format, key, wrappingKey, wrapAlgorithm);

        const algWrap = PrepareAlgorithm(wrapAlgorithm as AlgorithmIdentifier);

        const action = new WrapKeyActionProto();
        action.providerID = this.service.id;
        action.wrapAlgorithm.fromAlgorithm(algWrap);
        action.key = key;
        action.wrappingKey = wrappingKey;
        action.format = format;

        const result = await this.service.client.send(action);
        return result;
    }

    public async unwrapKey(format: string, wrappedKey: BufferSource, unwrappingKey: CryptoKeyProto, unwrapAlgorithm: AlgorithmIdentifier, unwrappedKeyAlgorithm: AlgorithmIdentifier, extractable: boolean, keyUsages: string[]) {
        await super.unwrapKey(format, wrappedKey, unwrappingKey, unwrapAlgorithm, unwrappedKeyAlgorithm, extractable, keyUsages);

        const algUnwrap = PrepareAlgorithm(unwrapAlgorithm as AlgorithmIdentifier);
        const algUnwrappedKey = PrepareAlgorithm(unwrappedKeyAlgorithm as AlgorithmIdentifier);
        const wrappedKeyBytes = PrepareData(wrappedKey, "wrappedKey");

        const action = new UnwrapKeyActionProto();
        action.providerID = this.service.id;
        action.unwrapAlgorithm.fromAlgorithm(algUnwrap);
        action.unwrappedKeyAlgorithm.fromAlgorithm(algUnwrappedKey);
        action.unwrappingKey = unwrappingKey;
        action.unwrappingKey = unwrappingKey;
        action.wrappedKey = wrappedKeyBytes.buffer;
        action.format = format;
        action.extractable = extractable;
        action.keyUsage = keyUsages;

        const result = await this.service.client.send(action);

        // CryptoKey
        return await CryptoKeyProto.importProto(result);
    }

    protected async encryptData(algorithm: Algorithm, key: CryptoKeyProto, data: BufferSource, type: string) {
        const alg = PrepareAlgorithm(algorithm as AlgorithmIdentifier);
        const algProto = new AlgorithmProto();
        algProto.fromAlgorithm(alg);
        const buffer = PrepareData(data, "data");
        let encrypt;
        let ActionClass: typeof EncryptActionProto;
        if (type === "encrypt") {
            encrypt = super.encrypt;
            ActionClass = EncryptActionProto;
        } else {
            encrypt = super.decrypt;
            ActionClass = DecryptActionProto;
        }
        await encrypt(algorithm as any, key, buffer);

        const action = new ActionClass();
        action.providerID = this.service.id;
        action.algorithm = algProto;
        action.key = key;
        action.data = buffer.buffer;

        const result = await this.service.client.send(action);
        return result;
    }

}
