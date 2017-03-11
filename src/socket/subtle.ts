import { Convert } from "pvtsutils";
import { PrepareAlgorithm, PrepareData, SubtleCrypto } from "webcrypto-core";
import { AlgorithmProto, CryptoKeyPairProto, CryptoKeyProto, GenerateKeyProto, SignProto, VerifyProto } from "../core";
import { ExportProto, ImportProto } from "../core";
import { DeriveBitsProto, DeriveKeyProto } from "../core";
import { UnwrapKeyProto, WrapKeyProto } from "../core";
import { EncryptProto } from "../core";
import { SocketCrypto } from "./client";
// import { RsaCrypto } from "./crypto";

export class SocketSubtleCrypto extends SubtleCrypto {

    protected readonly service: SocketCrypto;

    constructor(service: SocketCrypto) {
        super();
        this.service = service;
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

        const proto = new DeriveBitsProto();
        proto.algorithm = algProto;
        proto.algorithm.public = await (alg as any).public.toProto().exportProto();
        proto.key = baseKey;
        proto.length = length;

        const result = await this.service.client.send("deriveBits", proto);
        return result;
    }

    public async deriveKey(algorithm: string | EcdhKeyDeriveParams | DhKeyDeriveParams | ConcatParams | HkdfCtrParams | Pbkdf2Params, baseKey: CryptoKeyProto, derivedKeyType: string | AesDerivedKeyParams | HmacImportParams | ConcatParams | HkdfCtrParams | Pbkdf2Params, extractable: boolean, keyUsages: string[]) {
        // check incoming data
        await super.deriveKey(algorithm, baseKey, derivedKeyType, extractable, keyUsages);

        // prepare incoming data
        const alg = PrepareAlgorithm(algorithm as AlgorithmIdentifier);
        const algKeyType = PrepareAlgorithm(derivedKeyType as AlgorithmIdentifier);

        const proto = new DeriveKeyProto();
        proto.algorithm.fromAlgorithm(alg);
        proto.algorithm.public = await (alg as any).public.toProto().exportProto();
        proto.derivedKeyType.fromAlgorithm(algKeyType);
        proto.key = baseKey;
        proto.extractable = extractable;
        proto.usage = keyUsages;

        const result = await this.service.client.send("deriveKey", proto);

        // CryptoKey
        return await CryptoKeyProto.importProto(result);
    }

    public async digest(algorithm: AlgorithmIdentifier, data: BufferSource) {
        return new ArrayBuffer(0);
    }

    public generateKey(algorithm: string, extractable: boolean, keyUsages: string[]): PromiseLike<CryptoKeyPair | CryptoKey>;
    public generateKey(algorithm: RsaHashedKeyGenParams | EcKeyGenParams | DhKeyGenParams, extractable: boolean, keyUsages: string[]): PromiseLike<CryptoKeyPair>;
    public generateKey(algorithm: AesKeyGenParams | HmacKeyGenParams | Pbkdf2Params, extractable: boolean, keyUsages: string[]): PromiseLike<CryptoKey>;
    public async generateKey(algorithm: AlgorithmIdentifier, extractable: boolean, keyUsages: string[]): Promise<CryptoKey | CryptoKeyPair> {
        const alg = PrepareAlgorithm(algorithm);
        await super.generateKey(alg as any, extractable, keyUsages);
        const algProto = new AlgorithmProto();
        algProto.fromAlgorithm(alg);

        const proto = new GenerateKeyProto();
        proto.algorithm = algProto;
        proto.extractable = extractable;
        proto.usage = keyUsages;

        const result = await this.service.client.send("generateKey", proto);

        try {
            // CryptoKeyPair
            return await CryptoKeyPairProto.importProto(result);
        } catch (e) {
            // CryptoKey
            return await CryptoKeyProto.importProto(result);
        }
    }

    public async exportKey(format: string, key: CryptoKeyProto) {
        const proto = new ExportProto();
        proto.format = format;
        proto.key = key;

        const result = await this.service.client.send("exportKey", proto);
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

        const proto = new ImportProto();
        proto.algorithm.fromAlgorithm(alg);
        proto.keyData = preparedKeyData;
        proto.format = format;
        proto.extractable = extractable;
        proto.keyUsages = keyUsages;

        const result = await this.service.client.send("importKey", proto);

        // CryptoKey
        return await CryptoKeyProto.importProto(result);
    }

    public async sign(algorithm: string | RsaPssParams | EcdsaParams | AesCmacParams, key: CryptoKeyProto, data: BufferSource) {
        const alg = PrepareAlgorithm(algorithm as AlgorithmIdentifier);
        const algProto = new AlgorithmProto();
        algProto.fromAlgorithm(alg);
        const buffer = PrepareData(data, "data");
        await super.sign(algorithm, key, buffer);

        const proto = new SignProto();
        proto.algorithm = algProto;
        proto.key = key;
        proto.data = buffer.buffer;

        const result = await this.service.client.send("sign", proto);
        return result;
    }

    public async verify(algorithm: string | RsaPssParams | EcdsaParams | AesCmacParams, key: CryptoKeyProto, signature: BufferSource, data: BufferSource) {
        await super.verify(algorithm, key, signature, signature);

        const alg = PrepareAlgorithm(algorithm as AlgorithmIdentifier);
        const algProto = new AlgorithmProto();
        algProto.fromAlgorithm(alg);
        const buffer = PrepareData(data, "data");
        const signatureBytes = PrepareData(signature, "signature");

        const proto = new VerifyProto();
        proto.algorithm = algProto;
        proto.key = key;
        proto.data = buffer.buffer;
        proto.signature = signatureBytes.buffer;

        const result = await this.service.client.send("verify", proto);
        return !!(new Uint8Array(result)[0]);
    }

    public async wrapKey(format: string, key: CryptoKeyProto, wrappingKey: CryptoKeyProto, wrapAlgorithm: AlgorithmIdentifier) {
        await super.wrapKey(format, key, wrappingKey, wrapAlgorithm);

        const algWrap = PrepareAlgorithm(wrapAlgorithm as AlgorithmIdentifier);

        const proto = new WrapKeyProto();
        proto.wrapAlgorithm.fromAlgorithm(algWrap);
        proto.key = key;
        proto.wrappingKey = wrappingKey;
        proto.format = format;

        const result = await this.service.client.send("wrapKey", proto);
        return result;
    }

    public async unwrapKey(format: string, wrappedKey: BufferSource, unwrappingKey: CryptoKeyProto, unwrapAlgorithm: AlgorithmIdentifier, unwrappedKeyAlgorithm: AlgorithmIdentifier, extractable: boolean, keyUsages: string[]) {
        await super.unwrapKey(format, wrappedKey, unwrappingKey, unwrapAlgorithm, unwrappedKeyAlgorithm, extractable, keyUsages);

        const algUnwrap = PrepareAlgorithm(unwrapAlgorithm as AlgorithmIdentifier);
        const algUnwrappedKey = PrepareAlgorithm(unwrappedKeyAlgorithm as AlgorithmIdentifier);
        const wrappedKeyBytes = PrepareData(wrappedKey, "wrappedKey");

        const proto = new UnwrapKeyProto();
        proto.unwrapAlgorithm.fromAlgorithm(algUnwrap);
        proto.unwrappedKeyAlgorithm.fromAlgorithm(algUnwrappedKey);
        proto.unwrappingKey = unwrappingKey;
        proto.unwrappingKey = unwrappingKey;
        proto.wrappedKey = wrappedKeyBytes.buffer;
        proto.format = format;
        proto.extractable = extractable;
        proto.keyUsage = keyUsages;

        const result = await this.service.client.send("unwrapKey", proto);

        // CryptoKey
        return await CryptoKeyProto.importProto(result);
    }

    protected async encryptData(algorithm: Algorithm, key: CryptoKeyProto, data: BufferSource, type: string) {
        const alg = PrepareAlgorithm(algorithm as AlgorithmIdentifier);
        const algProto = new AlgorithmProto();
        algProto.fromAlgorithm(alg);
        const buffer = PrepareData(data, "data");
        let encrypt;
        if (type === "encrypt") {
            encrypt = super.encrypt;
        } else {
            encrypt = super.decrypt;
        }
        await encrypt(algorithm as any, key, buffer);

        const proto = new EncryptProto();
        proto.algorithm = algProto;
        proto.key = key;
        proto.data = buffer.buffer;

        const result = await this.service.client.send(type, proto);
        return result;
    }

}
