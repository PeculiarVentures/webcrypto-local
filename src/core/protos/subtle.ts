import { ArrayBufferConverter, ProtobufElement, ProtobufProperty } from "tsprotobuf";
import { ActionProto, AlgorithmProto, CryptoKeyProto } from "../proto";

@ProtobufElement({})
export class CryptoActionProto extends ActionProto {

    public static INDEX = ActionProto.INDEX;
    public static ACTION = "crypto";

    @ProtobufProperty({ id: CryptoActionProto.INDEX++, required: true, type: "string" })
    public providerID: string;

}

@ProtobufElement({})
export class LoginActionProto extends CryptoActionProto {

    public static INDEX = ActionProto.INDEX;
    public static ACTION = "crypto/login";

}

@ProtobufElement({})
export class IsLoggedInActionProto extends CryptoActionProto {

    public static INDEX = ActionProto.INDEX;
    public static ACTION = "crypto/isLoggedIn";

}

@ProtobufElement({})
export class DigestActionProto extends CryptoActionProto {

    public static INDEX = CryptoActionProto.INDEX;
    public static ACTION = "crypto/subtle/digest";

    @ProtobufProperty({ id: DigestActionProto.INDEX++, required: true, parser: AlgorithmProto })
    public algorithm: AlgorithmProto;

    @ProtobufProperty({ id: DigestActionProto.INDEX++, required: true, converter: ArrayBufferConverter })
    public data: ArrayBuffer;

}

@ProtobufElement({})
export class GenerateKeyActionProto extends CryptoActionProto {

    public static INDEX = CryptoActionProto.INDEX;
    public static ACTION = "crypto/subtle/generateKey";

    @ProtobufProperty({ id: GenerateKeyActionProto.INDEX++, type: "bytes", required: true, parser: AlgorithmProto })
    public algorithm: AlgorithmProto;

    @ProtobufProperty({ id: GenerateKeyActionProto.INDEX++, type: "bool", required: true })
    public extractable: boolean;

    @ProtobufProperty({ id: GenerateKeyActionProto.INDEX++, type: "string", repeated: true })
    public usage: string[];

}

@ProtobufElement({})
export class SignActionProto extends CryptoActionProto {

    public static INDEX = CryptoActionProto.INDEX;
    public static ACTION = "crypto/subtle/sign";

    @ProtobufProperty({ id: SignActionProto.INDEX++, required: true, parser: AlgorithmProto })
    public algorithm: AlgorithmProto;

    @ProtobufProperty({ id: SignActionProto.INDEX++, required: true, parser: CryptoKeyProto })
    public key: CryptoKeyProto;

    @ProtobufProperty({ id: SignActionProto.INDEX++, required: true, converter: ArrayBufferConverter })
    public data: ArrayBuffer;

}

@ProtobufElement({})
export class VerifyActionProto extends SignActionProto {

    public static INDEX = SignActionProto.INDEX;
    public static ACTION = "crypto/subtle/verify";

    @ProtobufProperty({ id: VerifyActionProto.INDEX++, required: true, converter: ArrayBufferConverter })
    public signature: ArrayBuffer;

}

@ProtobufElement({})
export class EncryptActionProto extends SignActionProto {

    public static INDEX = SignActionProto.INDEX;
    public static ACTION = "crypto/subtle/encrypt";

}

@ProtobufElement({})
export class DecryptActionProto extends SignActionProto {

    public static INDEX = SignActionProto.INDEX;
    public static ACTION = "crypto/subtle/decrypt";

}

@ProtobufElement({})
export class DeriveBitsActionProto extends CryptoActionProto {

    public static INDEX = CryptoActionProto.INDEX;
    public static ACTION = "crypto/subtle/deriveBits";

    @ProtobufProperty({ id: DeriveBitsActionProto.INDEX++, required: true, parser: AlgorithmProto })
    public algorithm: AlgorithmProto;

    @ProtobufProperty({ id: DeriveBitsActionProto.INDEX++, required: true, parser: CryptoKeyProto })
    public key: CryptoKeyProto;

    @ProtobufProperty({ id: DeriveBitsActionProto.INDEX++, required: true, type: "uint32" })
    public length: number;

}

@ProtobufElement({})
export class DeriveKeyActionProto extends CryptoActionProto {

    public static INDEX = CryptoActionProto.INDEX;
    public static ACTION = "crypto/subtle/deriveKey";

    @ProtobufProperty({ id: DeriveKeyActionProto.INDEX++, required: true, parser: AlgorithmProto })
    public algorithm: AlgorithmProto;

    @ProtobufProperty({ id: DeriveKeyActionProto.INDEX++, required: true, parser: CryptoKeyProto })
    public key: CryptoKeyProto;

    @ProtobufProperty({ id: DeriveKeyActionProto.INDEX++, required: true, parser: AlgorithmProto })
    public derivedKeyType: AlgorithmProto;

    @ProtobufProperty({ id: DeriveKeyActionProto.INDEX++, type: "bool" })
    public extractable: boolean;

    @ProtobufProperty({ id: DeriveKeyActionProto.INDEX++, type: "string", repeated: true })
    public usage: string[];

}

@ProtobufElement({})
export class UnwrapKeyActionProto extends CryptoActionProto {

    public static INDEX = CryptoActionProto.INDEX;
    public static ACTION = "crypto/subtle/unwrapKey";

    @ProtobufProperty({ id: UnwrapKeyActionProto.INDEX++, required: true, type: "string" })
    public format: string;

    @ProtobufProperty({ id: UnwrapKeyActionProto.INDEX++, required: true, converter: ArrayBufferConverter })
    public wrappedKey: ArrayBuffer;

    @ProtobufProperty({ id: UnwrapKeyActionProto.INDEX++, required: true, parser: CryptoKeyProto })
    public unwrappingKey: CryptoKeyProto;

    @ProtobufProperty({ id: UnwrapKeyActionProto.INDEX++, required: true, parser: AlgorithmProto })
    public unwrapAlgorithm: AlgorithmProto;

    @ProtobufProperty({ id: UnwrapKeyActionProto.INDEX++, required: true, parser: AlgorithmProto })
    public unwrappedKeyAlgorithm: AlgorithmProto;

    @ProtobufProperty({ id: UnwrapKeyActionProto.INDEX++, type: "bool" })
    public extractable: boolean;

    @ProtobufProperty({ id: UnwrapKeyActionProto.INDEX++, type: "string", repeated: true })
    public keyUsage: string[];

}

@ProtobufElement({})
export class WrapKeyActionProto extends CryptoActionProto {

    public static INDEX = CryptoActionProto.INDEX;
    public static ACTION = "crypto/subtle/wrapKey";

    @ProtobufProperty({ id: WrapKeyActionProto.INDEX++, required: true, type: "string" })
    public format: string;

    @ProtobufProperty({ id: WrapKeyActionProto.INDEX++, required: true, parser: CryptoKeyProto })
    public key: CryptoKeyProto;

    @ProtobufProperty({ id: WrapKeyActionProto.INDEX++, required: true, parser: CryptoKeyProto })
    public wrappingKey: CryptoKeyProto;

    @ProtobufProperty({ id: WrapKeyActionProto.INDEX++, required: true, parser: AlgorithmProto })
    public wrapAlgorithm: AlgorithmProto;

}

@ProtobufElement({})
export class ExportKeyActionProto extends CryptoActionProto {

    public static INDEX = CryptoActionProto.INDEX;
    public static ACTION = "crypto/subtle/exportKey";

    @ProtobufProperty({ id: ExportKeyActionProto.INDEX++, type: "string", required: true })
    public format: string;

    @ProtobufProperty({ id: ExportKeyActionProto.INDEX++, required: true, parser: CryptoKeyProto })
    public key: CryptoKeyProto;

}

@ProtobufElement({})
export class ImportKeyActionProto extends CryptoActionProto {

    public static INDEX = CryptoActionProto.INDEX;
    public static ACTION = "crypto/subtle/importKey";

    @ProtobufProperty({ id: ImportKeyActionProto.INDEX++, type: "string", required: true })
    public format: string;

    @ProtobufProperty({ id: ImportKeyActionProto.INDEX++, required: true, converter: ArrayBufferConverter })
    public keyData: ArrayBuffer;

    @ProtobufProperty({ id: ImportKeyActionProto.INDEX++, required: true, parser: AlgorithmProto })
    public algorithm: AlgorithmProto;

    @ProtobufProperty({ id: ImportKeyActionProto.INDEX++, required: true, type: "bool" })
    public extractable: boolean;

    @ProtobufProperty({ id: ImportKeyActionProto.INDEX++, type: "string", repeated: true })
    public keyUsages: string[];

}
