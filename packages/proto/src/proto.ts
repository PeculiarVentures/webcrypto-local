import { ArrayBufferConverter, ObjectProto, ProtobufElement, ProtobufProperty } from "tsprotobuf";
import { HexStringConverter } from "./converters";

export interface IAlgorithmConvertible {
  toAlgorithm(): Algorithm;
  fromAlgorithm(alg: Algorithm): this;
}

@ProtobufElement({ name: "BaseMessage" })
export class BaseProto extends ObjectProto {

  public static INDEX = 1;

  @ProtobufProperty({ id: BaseProto.INDEX++, type: "uint32", required: true, defaultValue: 1 })
  public version: number = 0;
}

@ProtobufElement({ name: "Action" })
export class ActionProto extends BaseProto {

  public static INDEX = BaseProto.INDEX;
  public static ACTION = "action";
  /**
   * name of the action
   */
  @ProtobufProperty({ id: ActionProto.INDEX++, type: "string", required: true })
  public action: string;
  /**
   * Identity of action (needs to link request to response)
   */
  @ProtobufProperty({ id: ActionProto.INDEX++, type: "string", required: false })
  public actionId: string = "";

  constructor() {
    super();
    this.action = (this.constructor as any).ACTION;
  }

}

@ProtobufElement({ name: "BaseAlgorithm" })
export class BaseAlgorithmProto extends BaseProto {

  public static INDEX = BaseProto.INDEX;

  @ProtobufProperty({ id: BaseAlgorithmProto.INDEX++, type: "string", required: true })
  public name: string = "";

  public isEmpty() {
    return !this.name;
  }

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

  // hashed
  @ProtobufProperty({ id: AlgorithmProto.INDEX++, type: "bytes", parser: BaseAlgorithmProto })
  public hash?: BaseAlgorithmProto;

  // RSA
  @ProtobufProperty({ id: AlgorithmProto.INDEX++, type: "bytes" })
  public publicExponent?: Uint8Array;

  @ProtobufProperty({ id: AlgorithmProto.INDEX++, type: "uint32" })
  public modulusLength?: number;

  // RSA-PSS
  @ProtobufProperty({ id: AlgorithmProto.INDEX++, type: "uint32" })
  public saltLength?: number;

  // RSA-OAEP
  @ProtobufProperty({ id: AlgorithmProto.INDEX++, type: "bytes" })
  public label?: Uint8Array;

  // EC
  @ProtobufProperty({ id: AlgorithmProto.INDEX++, type: "string" })
  public namedCurve?: string;

  @ProtobufProperty({ id: AlgorithmProto.INDEX++, converter: ArrayBufferConverter }) // Cannot to use CryptoKeyProto parser
  public public?: ArrayBuffer;

  // AES

  @ProtobufProperty({ id: AlgorithmProto.INDEX++, type: "uint32" })
  public length?: number;

  @ProtobufProperty({ id: AlgorithmProto.INDEX++ })
  public iv?: Uint8Array;

  // PKCS11
  @ProtobufProperty({ id: AlgorithmProto.INDEX++, type: "bool" })
  public token?: boolean;

  @ProtobufProperty({ id: AlgorithmProto.INDEX++, type: "bool" })
  public sensitive?: boolean;

  @ProtobufProperty({ id: AlgorithmProto.INDEX++, type: "string" })
  public labelStr?: string;

  @ProtobufProperty({ id: AlgorithmProto.INDEX++, type: "bool" })
  public alwaysAuthenticate?: boolean;

  public toAlgorithm() {
    const res: { [key: string]: any; } = {};
    const thisStatic = this.constructor as any;
    for (const key in thisStatic.items) {
      // ignore 'version'
      if (key === "version") {
        continue;
      }
      const value = (this as any)[key];
      if (key === "labelStr") {
        res.label = value;
        continue;
      }
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
    const thisStatic = this.constructor as any;
    for (const key in alg) {
      if (!thisStatic.items) {
        continue;
      }
      if (key in thisStatic.items) {
        const item = thisStatic.items[key];
        if (item.parser) {
          switch (item.parser) {
            case BaseAlgorithmProto: {
              ((this as any)[key] as BaseAlgorithmProto).fromAlgorithm((alg as any)[key]);
              break;
            }
            default:
              throw new Error(`Unsupported parser '${item.parser.name}'`);
          }
        } else {
          if (key === "label" && typeof (alg as any).label === "string") {
            this.labelStr = (alg as any).label;
          } else {
            (this as any)[key] = (alg as any)[key];
          }
        }
      }
    }
  }

}

@ProtobufElement({ name: "CryptoItem" })
export class CryptoItemProto extends BaseProto {

  public static INDEX = BaseProto.INDEX;

  @ProtobufProperty({ id: CryptoItemProto.INDEX++, type: "string", required: true })
  public providerID: string = "";

  @ProtobufProperty({ id: CryptoItemProto.INDEX++, type: "bytes", required: true, converter: HexStringConverter })
  public id: string = "";

  @ProtobufProperty({ id: CryptoItemProto.INDEX++, type: "string", required: true })
  public type: string = "";

}

export class AlgorithmConverter {
  public static async set(value: Algorithm): Promise<Uint8Array> {
    const proto = new AlgorithmProto();
    proto.fromAlgorithm(value);
    const raw = await proto.exportProto();
    return new Uint8Array(raw);
  }
  public static async get(value: Uint8Array): Promise<Algorithm> {
    const proto = new AlgorithmProto();
    await proto.importProto(value);

    const res = proto.toAlgorithm();
    return res;
  }
}

@ProtobufElement({ name: "CryptoKey" })
export class CryptoKeyProto extends CryptoItemProto implements CryptoKey {

  public static INDEX = CryptoItemProto.INDEX;

  public type: KeyType = "secret";

  @ProtobufProperty({ id: CryptoKeyProto.INDEX++, type: "bytes", required: true, converter: AlgorithmConverter })
  public algorithm: Algorithm = { name: "" };

  @ProtobufProperty({ id: CryptoKeyProto.INDEX++, type: "bool" })
  public extractable: boolean = false;

  @ProtobufProperty({ id: CryptoKeyProto.INDEX++, type: "string", repeated: true })
  public usages: KeyUsage[] = [];

  @ProtobufProperty({ id: CryptoKeyProto.INDEX++, type: "bool" })
  public alwaysAuthenticate?: boolean;

}

@ProtobufElement({ name: "CryptoKeyPair" })
export class CryptoKeyPairProto extends BaseProto implements CryptoKeyPair {

  public static INDEX = BaseProto.INDEX;

  @ProtobufProperty({
    id: CryptoKeyPairProto.INDEX++,
    name: "privateKey",
    type: "bytes",
    required: true,
    parser: CryptoKeyProto,
  })
  public privateKey: CryptoKeyProto = new CryptoKeyProto();

  @ProtobufProperty({
    id: CryptoKeyPairProto.INDEX++,
    name: "publicKey",
    type: "bytes",
    parser: CryptoKeyProto,
  })
  public publicKey: CryptoKeyProto = new CryptoKeyProto();

}

@ProtobufElement({ name: "Error" })
export class ErrorProto extends BaseProto implements Error {

  public static INDEX = BaseProto.INDEX;

  @ProtobufProperty({ id: ErrorProto.INDEX++, type: "uint32", defaultValue: 0 })
  public code: number = 0;

  @ProtobufProperty({ id: ErrorProto.INDEX++, type: "string", defaultValue: "error" })
  public type: string = "error";

  @ProtobufProperty({ id: ErrorProto.INDEX++, type: "string", defaultValue: "" })
  public message: string = "";

  @ProtobufProperty({ id: ErrorProto.INDEX++, type: "string", defaultValue: "Error" })
  public name: string = "Error";

  @ProtobufProperty({ id: ErrorProto.INDEX++, type: "string", defaultValue: "" })
  public stack: string = "";

  constructor();
  constructor(message: string, code?: number, type?: string);
  constructor(message?: string, code = 0, type = "error") {
    super();
    if (message) {
      this.message = message;
      this.code = code;
      this.type = type;
    }
  }
}

// Result

@ProtobufElement({ name: "Result" })
export class ResultProto extends ActionProto {

  public static INDEX = ActionProto.INDEX;

  @ProtobufProperty({ id: ResultProto.INDEX++, type: "bool", defaultValue: false })
  public status: boolean = false;

  @ProtobufProperty({ id: ResultProto.INDEX++, type: "bytes", parser: ErrorProto })
  public error?: ErrorProto;

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

// Auth

@ProtobufElement({ name: "AuthRequest" })
export class AuthRequestProto extends ActionProto {

  public static INDEX = ActionProto.INDEX;
  public static ACTION = "auth";

}

@ProtobufElement({})
export class ServerLoginActionProto extends ActionProto {

  public static INDEX = ActionProto.INDEX;
  public static ACTION = "server/login";

}

@ProtobufElement({})
export class ServerIsLoggedInActionProto extends ActionProto {

  public static INDEX = ActionProto.INDEX;
  public static ACTION = "server/isLoggedIn";

}
