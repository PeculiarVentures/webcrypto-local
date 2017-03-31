import { ArrayBufferConverter, ProtobufElement, ProtobufProperty } from "tsprotobuf";
import { AlgorithmProto, CryptoItemProto, CryptoKeyProto } from "../proto";
import { DateConverter, HexStringConverter } from "./converter";
import { CryptoActionProto } from "./crypto";

@ProtobufElement({})
export class CryptoCertificateProto extends CryptoItemProto implements CryptoCertificate {

    public static INDEX = CryptoItemProto.INDEX;

    @ProtobufProperty({ id: CryptoCertificateProto.INDEX++, required: true, converter: HexStringConverter })
    public id: string;

    @ProtobufProperty({ id: CryptoCertificateProto.INDEX++, required: true, parser: CryptoKeyProto })
    public publicKey: CryptoKeyProto;

    @ProtobufProperty({ id: CryptoCertificateProto.INDEX++, required: true, type: "string" })
    public type: string;

}

@ProtobufElement({})
export class CryptoX509CertificateProto extends CryptoCertificateProto implements CryptoX509Certificate {

    public static INDEX = CryptoCertificateProto.INDEX;

    @ProtobufProperty({ id: CryptoX509CertificateProto.INDEX++, required: true, converter: HexStringConverter })
    public serialNumber: string;

    @ProtobufProperty({ id: CryptoX509CertificateProto.INDEX++, required: true, type: "string" })
    public issuerName: string;

    @ProtobufProperty({ id: CryptoX509CertificateProto.INDEX++, required: true, type: "string" })
    public subjectName: string;

    @ProtobufProperty({ id: CryptoX509CertificateProto.INDEX++, required: true, converter: DateConverter })
    public notBefore: Date;

    @ProtobufProperty({ id: CryptoX509CertificateProto.INDEX++, required: true, converter: DateConverter })
    public notAfter: Date;

}

@ProtobufElement({})
export class CryptoX509CertificateRequestProto extends CryptoCertificateProto implements CryptoX509CertificateRequest {

    public static INDEX = CryptoCertificateProto.INDEX;

    @ProtobufProperty({ id: CryptoX509CertificateRequestProto.INDEX++, required: true, type: "string" })
    public subjectName: string;

}

// Actions

@ProtobufElement({})
export class CertificateStorageSetItemActionProto extends CryptoActionProto {

    public static INDEX = CryptoActionProto.INDEX;
    public static ACTION = "crypto/certificateStorage/setItem";

    @ProtobufProperty({ id: CertificateStorageSetItemActionProto.INDEX++, required: true, parser: CryptoCertificateProto })
    public item: CryptoCertificateProto;

}

@ProtobufElement({})
export class CertificateStorageGetItemActionProto extends CryptoActionProto {

    public static INDEX = CryptoActionProto.INDEX;
    public static ACTION = "crypto/certificateStorage/getItem";

    @ProtobufProperty({ id: CertificateStorageGetItemActionProto.INDEX++, required: true, type: "string" })
    public key: string;

    @ProtobufProperty({ id: CertificateStorageGetItemActionProto.INDEX++, parser: AlgorithmProto })
    public algorithm: AlgorithmProto;

    @ProtobufProperty({ id: CertificateStorageGetItemActionProto.INDEX++, repeated: true, type: "string" })
    public keyUsages: string[];

}

@ProtobufElement({})
export class CertificateStorageKeysActionProto extends CryptoActionProto {

    public static INDEX = CryptoActionProto.INDEX;
    public static ACTION = "crypto/certificateStorage/keys";

}

@ProtobufElement({})
export class CertificateStorageRemoveItemActionProto extends CryptoActionProto {

    public static INDEX = CryptoActionProto.INDEX;
    public static ACTION = "crypto/certificateStorage/removeItem";

    @ProtobufProperty({ id: CertificateStorageRemoveItemActionProto.INDEX++, required: true, type: "string" })
    public key: string;

}

@ProtobufElement({})
export class CertificateStorageClearActionProto extends CryptoActionProto {

    public static INDEX = CryptoActionProto.INDEX;
    public static ACTION = "crypto/certificateStorage/clear";

}

@ProtobufElement({})
export class CertificateStorageImportActionProto extends CryptoActionProto {

    public static INDEX = CryptoActionProto.INDEX;
    public static ACTION = "crypto/certificateStorage/import";

    @ProtobufProperty({ id: CertificateStorageImportActionProto.INDEX++, required: true, type: "string" })
    public type: string;

    @ProtobufProperty({ id: CertificateStorageImportActionProto.INDEX++, required: true, converter: ArrayBufferConverter })
    public data: ArrayBuffer;

    @ProtobufProperty({ id: CertificateStorageImportActionProto.INDEX++, required: true, parser: AlgorithmProto })
    public algorithm: AlgorithmProto;

    @ProtobufProperty({ id: CertificateStorageImportActionProto.INDEX++, repeated: true, type: "string" })
    public keyUsages: string[];

}

@ProtobufElement({})
export class CertificateStorageExportActionProto extends CryptoActionProto {

    public static INDEX = CryptoActionProto.INDEX;
    public static ACTION = "crypto/certificateStorage/export";

    @ProtobufProperty({ id: CertificateStorageExportActionProto.INDEX++, required: true, type: "string" })
    public format: string;

    @ProtobufProperty({ id: CertificateStorageExportActionProto.INDEX++, required: true, parser: CryptoCertificateProto })
    public item: CryptoCertificateProto;

}

@ProtobufElement({})
export class CertificateStorageIndexOfActionProto extends CryptoActionProto {

    public static INDEX = CryptoActionProto.INDEX;
    public static ACTION = "crypto/certificateStorage/indexOf";

    @ProtobufProperty({ id: CertificateStorageIndexOfActionProto.INDEX++, required: true, parser: CryptoCertificateProto })
    public item: CryptoCertificateProto;

}
