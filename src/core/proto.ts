import { ArrayBufferConverter, IProtobufScheme, ObjectProto, ProtobufElement, ProtobufProperty } from "tsprotobuf";
import { ArrayStringConverter, HexStringConverter } from "./convert";

export interface IAlgorithmConvertible {
    toAlgorithm(): Algorithm;
    fromAlgorithm(alg: Algorithm): this;
}

@ProtobufElement({ name: "BaseMessage" })
export class BaseProto extends ObjectProto {

    public static INDEX = 1;

    @ProtobufProperty({ id: BaseProto.INDEX++, type: "uint32", required: true, defaultValue: 1 })
    public version: number;
}

@ProtobufElement({ name: "Action" })
export class ActionProto extends BaseProto {

    public static INDEX = BaseProto.INDEX;
    /**
     * name of the action
     */
    @ProtobufProperty({ id: ActionProto.INDEX++, type: "string", required: true })
    public action: string;
    /**
     * Identity of action (needs to link request to response)
     */
    @ProtobufProperty({ id: ActionProto.INDEX++, type: "string", required: true })
    public actionId: string;

}

@ProtobufElement({ name: "BaseAlgorithm" })
export class BaseAlgorithmProto extends BaseProto {

    public static INDEX = BaseProto.INDEX;

    @ProtobufProperty({ id: BaseAlgorithmProto.INDEX++, type: "string", required: true })
    public name: string;

    public toAlgorithm() {
        return { name: this.name };
    }

    public fromAlgorithm(alg: Algorithm) {
        this.name = alg.name;
    }
}

@ProtobufElement({ name: "Algorithm" })
export class AlgorithmProto extends BaseAlgorithmProto {

    public static INDEX = BaseAlgorithmProto.INDEX;

    @ProtobufProperty({ id: AlgorithmProto.INDEX++, type: "bytes", parser: BaseAlgorithmProto })
    public hash: BaseAlgorithmProto;

    // RSA
    @ProtobufProperty({ id: AlgorithmProto.INDEX++, type: "bytes" })
    public publicExponent: Uint8Array;

    @ProtobufProperty({ id: AlgorithmProto.INDEX++, type: "uint32" })
    public modulusLength: number;

    // RSA-PSS
    @ProtobufProperty({ id: AlgorithmProto.INDEX++, type: "uint32" })
    public saltLength: number;

    // RSA-OAEP
    @ProtobufProperty({ id: AlgorithmProto.INDEX++, type: "bytes" })
    public label: Uint8Array;

    // EC
    @ProtobufProperty({ id: AlgorithmProto.INDEX++, type: "string" })
    public namedCurve: string;

    @ProtobufProperty({ id: AlgorithmProto.INDEX++, converter: ArrayBufferConverter }) // Cannot to use CryptoKeyProto parser
    public public: ArrayBuffer;

    // AES

    @ProtobufProperty({ id: AlgorithmProto.INDEX++, type: "uint32" })
    public length: number;

    @ProtobufProperty({ id: AlgorithmProto.INDEX++ })
    public iv: Uint8Array;

    public toAlgorithm() {
        const res: { [key: string]: any } = {};
        const thisStatic = this.constructor as IProtobufScheme;
        for (const key in thisStatic.items) {
            // ignore 'version'
            if (key === "version") {
                continue;
            }
            const value = (this as any)[key];
            if (value !== void 0) {
                if (value instanceof BaseAlgorithmProto) {
                    if (!value.isEmpty()) {
                        res[key] = value.toAlgorithm();
                    }
                } else {
                    res[key] = value;
                }
            }
        }
        return res as any;
    }

    public fromAlgorithm(alg: Algorithm | KeyAlgorithm | AlgorithmProto) {
        if (alg instanceof AlgorithmProto) {
            alg = alg.toAlgorithm();
        }
        const thisStatic = this.constructor as IProtobufScheme;
        for (const key in alg) {
            if (key in thisStatic.items) {
                if (thisStatic.items[key].parser) {
                    switch (thisStatic.items[key].parser) {
                        case BaseAlgorithmProto: {
                            ((this as any)[key] as BaseAlgorithmProto).fromAlgorithm((alg as any)[key]);
                            break;
                        }
                        default:
                            throw new Error(`Unsupported parser '${thisStatic.items[key].parser.name}'`);
                    }
                } else {
                    (this as any)[key] = (alg as any)[key];
                }
            }
        }
    }

}

@ProtobufElement({ name: "CryptoKey" })
export class CryptoKeyProto extends BaseProto {

    public static INDEX = BaseProto.INDEX;

    @ProtobufProperty({ id: CryptoKeyProto.INDEX++, type: "bytes", required: true, converter: HexStringConverter })
    public id: string;

    @ProtobufProperty({ id: CryptoKeyProto.INDEX++, type: "bytes", required: true, parser: AlgorithmProto })
    public algorithm: AlgorithmProto;

    @ProtobufProperty({ id: CryptoKeyProto.INDEX++, type: "string", required: true })
    public type: string;

    @ProtobufProperty({ id: CryptoKeyProto.INDEX++, type: "bool" })
    public extractable: boolean;

    @ProtobufProperty({ id: CryptoKeyProto.INDEX++, type: "bytes", converter: ArrayStringConverter })
    public usage: string[];

}

@ProtobufElement({ name: "CryptoKeyPair" })
export class CryptoKeyPairProto extends BaseProto {

    public static INDEX = BaseProto.INDEX;

    @ProtobufProperty({ id: CryptoKeyPairProto.INDEX++, name: "privateKey", type: "bytes", parser: CryptoKeyProto })
    public privateKey: CryptoKeyProto;

    @ProtobufProperty({ id: CryptoKeyPairProto.INDEX++, name: "publicKey", type: "bytes", parser: CryptoKeyProto })
    public publicKey: CryptoKeyProto;

}

@ProtobufElement({ name: "GenerateKey" })
export class GenerateKeyProto extends ActionProto {

    public static INDEX = ActionProto.INDEX;

    @ProtobufProperty({ id: GenerateKeyProto.INDEX++, type: "bytes", required: true, parser: AlgorithmProto })
    public algorithm: AlgorithmProto;

    @ProtobufProperty({ id: GenerateKeyProto.INDEX++, type: "bool" })
    public extractable: boolean;

    @ProtobufProperty({ id: GenerateKeyProto.INDEX++, type: "bytes", required: true, converter: ArrayStringConverter })
    public usage: string[];

}

@ProtobufElement({ name: "Sign" })
export class SignProto extends ActionProto {

    public static INDEX = ActionProto.INDEX;

    @ProtobufProperty({ id: SignProto.INDEX++, required: true, parser: AlgorithmProto })
    public algorithm: AlgorithmProto;

    @ProtobufProperty({ id: SignProto.INDEX++, required: true, parser: CryptoKeyProto })
    public key: CryptoKeyProto;

    @ProtobufProperty({ id: SignProto.INDEX++, required: true, converter: ArrayBufferConverter })
    public data: ArrayBuffer;

}

@ProtobufElement({ name: "Encrypt" })
export class EncryptProto extends SignProto { }

@ProtobufElement({ name: "Verify" })
export class VerifyProto extends SignProto {

    public static INDEX = ActionProto.INDEX;

    @ProtobufProperty({ id: SignProto.INDEX++, required: true, converter: ArrayBufferConverter })
    public signature: ArrayBuffer;

}

@ProtobufElement({ name: "DeriveBits" })
export class DeriveBitsProto extends ActionProto {

    public static INDEX = ActionProto.INDEX;

    @ProtobufProperty({ id: DeriveBitsProto.INDEX++, required: true, parser: AlgorithmProto })
    public algorithm: AlgorithmProto;

    @ProtobufProperty({ id: DeriveBitsProto.INDEX++, required: true, parser: CryptoKeyProto })
    public key: CryptoKeyProto;

    @ProtobufProperty({ id: DeriveBitsProto.INDEX++, required: true, type: "uint32" })
    public length: number;

}

@ProtobufElement({ name: "DeriveKey" })
export class DeriveKeyProto extends ActionProto {

    public static INDEX = ActionProto.INDEX;

    @ProtobufProperty({ id: DeriveKeyProto.INDEX++, required: true, parser: AlgorithmProto })
    public algorithm: AlgorithmProto;

    @ProtobufProperty({ id: DeriveKeyProto.INDEX++, required: true, parser: CryptoKeyProto })
    public key: CryptoKeyProto;

    @ProtobufProperty({ id: DeriveKeyProto.INDEX++, required: true, parser: AlgorithmProto })
    public derivedKeyType: AlgorithmProto;

    @ProtobufProperty({ id: DeriveKeyProto.INDEX++, type: "bool" })
    public extractable: boolean;

    @ProtobufProperty({ id: DeriveKeyProto.INDEX++, type: "bytes", required: true, converter: ArrayStringConverter })
    public usage: string[];

}

@ProtobufElement({ name: "UnwrapKey" })
export class UnwrapKeyProto extends ActionProto {

    public static INDEX = ActionProto.INDEX;

    @ProtobufProperty({ id: UnwrapKeyProto.INDEX++, required: true, type: "string" })
    public format: string;

    @ProtobufProperty({ id: UnwrapKeyProto.INDEX++, required: true, converter: ArrayBufferConverter })
    public wrappedKey: ArrayBuffer;

    @ProtobufProperty({ id: UnwrapKeyProto.INDEX++, required: true, parser: CryptoKeyProto })
    public unwrappingKey: CryptoKeyProto;

    @ProtobufProperty({ id: UnwrapKeyProto.INDEX++, required: true, parser: AlgorithmProto })
    public unwrapAlgorithm: AlgorithmProto;

    @ProtobufProperty({ id: UnwrapKeyProto.INDEX++, required: true, parser: AlgorithmProto })
    public unwrappedKeyAlgorithm: AlgorithmProto;

    @ProtobufProperty({ id: UnwrapKeyProto.INDEX++, type: "bool" })
    public extractable: boolean;

    @ProtobufProperty({ id: UnwrapKeyProto.INDEX++, type: "bytes", required: true, converter: ArrayStringConverter })
    public keyUsage: string[];

}

@ProtobufElement({ name: "WrapKey" })
export class WrapKeyProto extends ActionProto {

    public static INDEX = ActionProto.INDEX;

    @ProtobufProperty({ id: WrapKeyProto.INDEX++, required: true, type: "string" })
    public format: string;

    @ProtobufProperty({ id: WrapKeyProto.INDEX++, required: true, parser: CryptoKeyProto })
    public key: CryptoKeyProto;

    @ProtobufProperty({ id: WrapKeyProto.INDEX++, required: true, parser: CryptoKeyProto })
    public wrappingKey: CryptoKeyProto;

    @ProtobufProperty({ id: WrapKeyProto.INDEX++, required: true, parser: AlgorithmProto })
    public wrapAlgorithm: AlgorithmProto;

}

@ProtobufElement({ name: "Export" })
export class ExportProto extends ActionProto {

    public static INDEX = ActionProto.INDEX;

    @ProtobufProperty({ id: ExportProto.INDEX++, type: "string", required: true })
    public format: string;

    @ProtobufProperty({ id: ExportProto.INDEX++, required: true, parser: CryptoKeyProto })
    public key: CryptoKeyProto;

}

@ProtobufElement({ name: "Import" })
export class ImportProto extends ActionProto {

    public static INDEX = ActionProto.INDEX;

    @ProtobufProperty({ id: ImportProto.INDEX++, type: "string", required: true })
    public format: string;

    @ProtobufProperty({ id: ImportProto.INDEX++, required: true, converter: ArrayBufferConverter })
    public keyData: ArrayBuffer;

    @ProtobufProperty({ id: ImportProto.INDEX++, required: true, parser: AlgorithmProto })
    public algorithm: AlgorithmProto;

    @ProtobufProperty({ id: ImportProto.INDEX++, required: true, type: "bool" })
    public extractable: boolean;

    @ProtobufProperty({ id: ImportProto.INDEX++, converter: ArrayStringConverter })
    public keyUsages: string[];

}

// Result

@ProtobufElement({ name: "Result" })
export class ResultProto extends ActionProto {

    public static INDEX = ActionProto.INDEX;

    @ProtobufProperty({ id: ResultProto.INDEX++, type: "bool", defaultValue: false })
    public status: boolean;

    @ProtobufProperty({ id: ResultProto.INDEX++, type: "string", defaultValue: "" })
    public error: string;

    @ProtobufProperty({ id: ResultProto.INDEX++, type: "bytes", converter: ArrayBufferConverter })
    public data?: ArrayBuffer;

    constructor(proto?: ActionProto) {
        super();
        if (proto) {
            this.actionId = proto.actionId;
            this.action = proto.action;
        }
    }

}
