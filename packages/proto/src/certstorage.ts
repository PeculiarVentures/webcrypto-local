import { ArrayBufferConverter, ProtobufElement, ProtobufProperty } from "tsprotobuf";
import {
  CryptoCertificate, CryptoCertificateFormat, CryptoCertificateType,
  CryptoX509Certificate, CryptoX509CertificateRequest,
} from "webcrypto-core";
import { DateConverter, HexStringConverter } from "./converters";
import { CryptoActionProto } from "./crypto";
import { AlgorithmProto, BaseProto, CryptoItemProto, CryptoKeyProto } from "./proto";

@ProtobufElement({})
export class CryptoCertificateProto extends CryptoItemProto implements CryptoCertificate {

  public static INDEX = CryptoItemProto.INDEX;

  @ProtobufProperty({ id: CryptoCertificateProto.INDEX++, required: true, converter: HexStringConverter })
  public id: string = "";

  @ProtobufProperty({ id: CryptoCertificateProto.INDEX++, required: true, parser: CryptoKeyProto })
  public publicKey: CryptoKeyProto = new CryptoKeyProto();

  @ProtobufProperty({ id: CryptoCertificateProto.INDEX++, required: true, type: "string" })
  public type: CryptoCertificateType = "x509";

  @ProtobufProperty({ id: CryptoCertificateProto.INDEX++, type: "string", defaultValue: "" })
  public label: string = "";

  @ProtobufProperty({ id: CryptoCertificateProto.INDEX++, type: "bool", defaultValue: false })
  public token: boolean = false;

  @ProtobufProperty({ id: CryptoCertificateProto.INDEX++, type: "bool", defaultValue: false })
  public sensitive: boolean = false;

}

@ProtobufElement({})
export class CryptoX509CertificateProto extends CryptoCertificateProto implements CryptoX509Certificate {

  public static INDEX = CryptoCertificateProto.INDEX;

  public type: "x509" = "x509";

  @ProtobufProperty({ id: CryptoX509CertificateProto.INDEX++, required: true, converter: HexStringConverter })
  public serialNumber: string = "";

  @ProtobufProperty({ id: CryptoX509CertificateProto.INDEX++, required: true, type: "string" })
  public issuerName: string = "";

  @ProtobufProperty({ id: CryptoX509CertificateProto.INDEX++, required: true, type: "string" })
  public subjectName: string = "";

  @ProtobufProperty({ id: CryptoX509CertificateProto.INDEX++, required: true, converter: DateConverter })
  public notBefore: Date = new Date();

  @ProtobufProperty({ id: CryptoX509CertificateProto.INDEX++, required: true, converter: DateConverter })
  public notAfter: Date = new Date();

}

@ProtobufElement({})
export class CryptoX509CertificateRequestProto extends CryptoCertificateProto implements CryptoX509CertificateRequest {

  public static INDEX = CryptoCertificateProto.INDEX;

  public type: "request" = "request";

  @ProtobufProperty({ id: CryptoX509CertificateRequestProto.INDEX++, required: true, type: "string" })
  public subjectName: string = "";

}

@ProtobufElement({})
export class ChainItemProto extends BaseProto {

  public static INDEX = BaseProto.INDEX;

  @ProtobufProperty({
    id: ChainItemProto.INDEX++,
    required: true,
    type: "string",
  })
  public type: string = "";

  @ProtobufProperty({
    id: ChainItemProto.INDEX++,
    required: true,
    converter: ArrayBufferConverter,
  })
  public value: ArrayBuffer = new ArrayBuffer(0);
}

@ProtobufElement({})
export class CertificateStorageGetChainResultProto extends BaseProto {

  public static INDEX = BaseProto.INDEX;

  @ProtobufProperty({
    id: CertificateStorageGetChainResultProto.INDEX++,
    required: true,
    repeated: true,
    parser: ChainItemProto,
  })
  public items: ChainItemProto[] = [];

}

// Actions

@ProtobufElement({})
export class CertificateStorageSetItemActionProto extends CryptoActionProto {

  public static INDEX = CryptoActionProto.INDEX;
  public static ACTION = "crypto/certificateStorage/setItem";

  @ProtobufProperty({ id: CertificateStorageSetItemActionProto.INDEX++, required: true, parser: CryptoCertificateProto })
  public item: CryptoCertificateProto = new CryptoCertificateProto();

}

@ProtobufElement({})
export class CertificateStorageGetItemActionProto extends CryptoActionProto {

  public static INDEX = CryptoActionProto.INDEX;
  public static ACTION = "crypto/certificateStorage/getItem";

  @ProtobufProperty({ id: CertificateStorageGetItemActionProto.INDEX++, required: true, type: "string" })
  public key: string = "";

  @ProtobufProperty({ id: CertificateStorageGetItemActionProto.INDEX++, parser: AlgorithmProto })
  public algorithm: AlgorithmProto = new AlgorithmProto();

  @ProtobufProperty({ id: CertificateStorageGetItemActionProto.INDEX++, repeated: true, type: "string" })
  public keyUsages: KeyUsage[] = [];

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
  public key: string = "";

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
  public format: CryptoCertificateFormat = "raw";

  @ProtobufProperty({ id: CertificateStorageImportActionProto.INDEX++, required: true, converter: ArrayBufferConverter })
  public data: ArrayBuffer = new ArrayBuffer(0);

  @ProtobufProperty({ id: CertificateStorageImportActionProto.INDEX++, required: true, parser: AlgorithmProto })
  public algorithm: AlgorithmProto = new AlgorithmProto();

  @ProtobufProperty({ id: CertificateStorageImportActionProto.INDEX++, repeated: true, type: "string" })
  public keyUsages: KeyUsage[] = [];

}

@ProtobufElement({})
export class CertificateStorageExportActionProto extends CryptoActionProto {

  public static INDEX = CryptoActionProto.INDEX;
  public static ACTION = "crypto/certificateStorage/export";

  @ProtobufProperty({ id: CertificateStorageExportActionProto.INDEX++, required: true, type: "string" })
  public format: CryptoCertificateFormat = "raw";

  @ProtobufProperty({ id: CertificateStorageExportActionProto.INDEX++, required: true, parser: CryptoCertificateProto })
  public item: CryptoCertificateProto = new CryptoCertificateProto();

}

@ProtobufElement({})
export class CertificateStorageIndexOfActionProto extends CryptoActionProto {

  public static INDEX = CryptoActionProto.INDEX;
  public static ACTION = "crypto/certificateStorage/indexOf";

  @ProtobufProperty({ id: CertificateStorageIndexOfActionProto.INDEX++, required: true, parser: CryptoCertificateProto })
  public item: CryptoCertificateProto = new CryptoCertificateProto();

}

@ProtobufElement({})
export class CertificateStorageGetChainActionProto extends CryptoActionProto {

  public static INDEX = CryptoActionProto.INDEX;
  public static ACTION = "crypto/certificateStorage/getChain";

  @ProtobufProperty({ id: CertificateStorageSetItemActionProto.INDEX++, required: true, parser: CryptoCertificateProto })
  public item: CryptoCertificateProto = new CryptoCertificateProto();

}

@ProtobufElement({})
export class CertificateStorageGetCRLActionProto extends CryptoActionProto {

  public static INDEX = CryptoActionProto.INDEX;
  public static ACTION = "crypto/certificateStorage/getCRL";

  @ProtobufProperty({ id: CertificateStorageGetCRLActionProto.INDEX++, required: true, type: "string" })
  public url: string = "";

}

export interface OCSPRequestOptions {
  method: "post" | "get";
}

@ProtobufElement({})
export class OCSPRequestOptionsProto extends BaseProto implements OCSPRequestOptions {

  public static INDEX = BaseProto.INDEX;

  @ProtobufProperty({ id: OCSPRequestOptionsProto.INDEX++, required: false, type: "string", defaultValue: "get" })
  public method: "post" | "get" = "get";

}

@ProtobufElement({})
export class CertificateStorageGetOCSPActionProto extends CryptoActionProto {

  public static INDEX = CryptoActionProto.INDEX;
  public static ACTION = "crypto/certificateStorage/getOCSP";

  @ProtobufProperty({ id: CertificateStorageGetOCSPActionProto.INDEX++, required: true, type: "string" })
  public url: string = "";

  @ProtobufProperty({ id: CertificateStorageGetOCSPActionProto.INDEX++, required: true, converter: ArrayBufferConverter })
  public request: ArrayBuffer = new ArrayBuffer(0);

  @ProtobufProperty({ id: CertificateStorageGetOCSPActionProto.INDEX++, required: false, parser: OCSPRequestOptionsProto })
  public options: OCSPRequestOptionsProto = new OCSPRequestOptionsProto();

}
