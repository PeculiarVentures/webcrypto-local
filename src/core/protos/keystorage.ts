import { ProtobufElement, ProtobufProperty } from "tsprotobuf";
import { AlgorithmProto, CryptoKeyProto } from "../proto";
import { CryptoActionProto } from "./crypto";

@ProtobufElement({})
export class KeyStorageSetItemActionProto extends CryptoActionProto {

    public static INDEX = CryptoActionProto.INDEX;
    public static ACTION = "crypto/keyStorage/setItem";

    @ProtobufProperty({ id: KeyStorageSetItemActionProto.INDEX++, required: true, parser: CryptoKeyProto })
    public item: CryptoKeyProto;

}

@ProtobufElement({})
export class KeyStorageGetItemActionProto extends CryptoActionProto {

    public static INDEX = CryptoActionProto.INDEX;
    public static ACTION = "crypto/keyStorage/getItem";

    @ProtobufProperty({ id: KeyStorageGetItemActionProto.INDEX++, required: true, type: "string" })
    public key: string;

    @ProtobufProperty({ id: KeyStorageGetItemActionProto.INDEX++, parser: AlgorithmProto })
    public algorithm: AlgorithmProto;

    @ProtobufProperty({ id: KeyStorageGetItemActionProto.INDEX++, repeated: true, type: "string" })
    public keyUsages: string[];

}

@ProtobufElement({})
export class KeyStorageKeysActionProto extends CryptoActionProto {

    public static INDEX = CryptoActionProto.INDEX;
    public static ACTION = "crypto/keyStorage/keys";

}

@ProtobufElement({})
export class KeyStorageRemoveItemActionProto extends CryptoActionProto {

    public static INDEX = CryptoActionProto.INDEX;
    public static ACTION = "crypto/keyStorage/removeItem";

    @ProtobufProperty({ id: KeyStorageRemoveItemActionProto.INDEX++, required: true, type: "string" })
    public key: string;

}

@ProtobufElement({})
export class KeyStorageClearActionProto extends CryptoActionProto {

    public static INDEX = CryptoActionProto.INDEX;
    public static ACTION = "crypto/keyStorage/clear";

}

@ProtobufElement({})
export class KeyStorageIndexOfActionProto extends CryptoActionProto {

    public static INDEX = CryptoActionProto.INDEX;
    public static ACTION = "crypto/keyStorage/indexOf";

    @ProtobufProperty({ id: KeyStorageIndexOfActionProto.INDEX++, required: true, parser: CryptoKeyProto })
    public item: CryptoKeyProto;

}
