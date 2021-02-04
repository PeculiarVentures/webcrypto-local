import { ProviderCrypto, TokenInfo, TokenInfoEvent, Version } from "@webcrypto-local/core";
import { assign } from "pvtsutils";
import { ProtobufElement, ProtobufProperty } from "tsprotobuf";
import { BigNumberConverter } from "./converters";
import { ActionProto, BaseProto, ErrorProto } from "./proto";

// Objects

@ProtobufElement({})
export class VersionProto extends BaseProto implements Version {

  public static INDEX = BaseProto.INDEX;

  @ProtobufProperty({ id: VersionProto.INDEX++, required: true, type: "uint32" })
  public major: number = 0;

  @ProtobufProperty({ id: VersionProto.INDEX++, required: true, type: "uint32" })
  public minor: number = 0;

  constructor(data?: Version) {
    super();

    if (data) {
      assign(this, data);
    }
  }
}
@ProtobufElement({})
export class TokenInfoProto extends BaseProto implements TokenInfo {

  public static INDEX = BaseProto.INDEX;

  /**
   * application-defined label, assigned during token initialization.
   */
  @ProtobufProperty({ id: TokenInfoProto.INDEX++, required: true, type: "string" })
  public label: string = "";

  /**
   * ID of the device manufacturer.
   */
  @ProtobufProperty({ id: TokenInfoProto.INDEX++, required: true, type: "string" })
  public manufacturerID: string = "";

  /**
   * model of the device.
   */
  @ProtobufProperty({ id: TokenInfoProto.INDEX++, required: true, type: "string" })
  public model: string = "";

  /**
   * character-string serial number of the device
   */
  @ProtobufProperty({ id: TokenInfoProto.INDEX++, required: true, type: "string" })
  public serialNumber: string = "";

  /**
   * bit flags indicating capabilities and status of the device
   */
  @ProtobufProperty({ id: TokenInfoProto.INDEX++, required: true, type: "uint32" })
  public flags: number = 0;

  @ProtobufProperty({ id: TokenInfoProto.INDEX++, required: true, parser: VersionProto })
  public hardwareVersion = new VersionProto();

  @ProtobufProperty({ id: TokenInfoProto.INDEX++, required: true, parser: VersionProto })
  public firmwareVersion = new VersionProto();

  constructor(data?: TokenInfo) {
    super();

    if (data) {
      assign(this, data);
      this.firmwareVersion = new VersionProto(data.firmwareVersion);
      this.hardwareVersion = new VersionProto(data.hardwareVersion);
    }
  }

  @ProtobufProperty({ id: TokenInfoProto.INDEX++, required: true, type: "uint32" })
  public maxSessionCount: number = 0;

  @ProtobufProperty({ id: TokenInfoProto.INDEX++, required: true, type: "uint32" })
  public sessionCount: number = 0;

  @ProtobufProperty({ id: TokenInfoProto.INDEX++, required: true, type: "uint32" })
  public maxRwSessionCount: number = 0;

  @ProtobufProperty({ id: TokenInfoProto.INDEX++, required: true, type: "uint32" })
  public rwSessionCount: number = 0;

  @ProtobufProperty({ id: TokenInfoProto.INDEX++, required: true, type: "uint32" })
  public maxPinLen: number = 0;

  @ProtobufProperty({ id: TokenInfoProto.INDEX++, required: true, type: "uint32" })
  public minPinLen: number = 0;

  @ProtobufProperty({ id: TokenInfoProto.INDEX++, required: true, converter: BigNumberConverter })
  public totalPublicMemory: number = 0;

  @ProtobufProperty({ id: TokenInfoProto.INDEX++, required: true, converter: BigNumberConverter })
  public freePublicMemory: number = 0;

  @ProtobufProperty({ id: TokenInfoProto.INDEX++, required: true, converter: BigNumberConverter })
  public totalPrivateMemory: number = 0;

  @ProtobufProperty({ id: TokenInfoProto.INDEX++, required: true, converter: BigNumberConverter })
  public freePrivateMemory: number = 0;

}


@ProtobufElement({})
export class ProviderCryptoProto extends BaseProto implements ProviderCrypto {

  public static INDEX = BaseProto.INDEX;

  @ProtobufProperty({ id: ProviderCryptoProto.INDEX++, required: true, type: "string" })
  public id: string = "";

  @ProtobufProperty({ id: ProviderCryptoProto.INDEX++, required: true, type: "string" })
  public name: string = "";

  @ProtobufProperty({ id: ProviderCryptoProto.INDEX++, type: "bool", defaultValue: false })
  public readOnly: boolean = false;

  public library?: string;

  @ProtobufProperty({ id: ProviderCryptoProto.INDEX++, repeated: true, type: "string" })
  public algorithms: string[] = [];

  @ProtobufProperty({ id: ProviderCryptoProto.INDEX++, type: "bool", defaultValue: false })
  public isRemovable: boolean = false;

  @ProtobufProperty({ id: ProviderCryptoProto.INDEX++, type: "string" })
  public atr: string = "";

  @ProtobufProperty({ id: ProviderCryptoProto.INDEX++, type: "bool", defaultValue: false })
  public isHardware: boolean = false;

  @ProtobufProperty({ id: ProviderCryptoProto.INDEX++, type: "string" })
  public card: string = "";

  @ProtobufProperty({ id: ProviderCryptoProto.INDEX++, parser: TokenInfoProto })
  public token?: TokenInfoProto;

  constructor(data?: ProviderCrypto) {
    super();

    if (data) {
      assign(this, data);
      if (data.token) {
        this.token = new TokenInfoProto(data.token);
      }
    }
  }

}

@ProtobufElement({})
export class ProviderInfoProto extends BaseProto {

  public static INDEX = BaseProto.INDEX;

  @ProtobufProperty({ id: ProviderInfoProto.INDEX++, type: "string", required: true })
  public name: string = "";

  @ProtobufProperty({ id: ProviderInfoProto.INDEX++, repeated: true, parser: ProviderCryptoProto })
  public providers: ProviderCryptoProto[] = [];

}

// Actions

@ProtobufElement({})
export class ProviderInfoActionProto extends ActionProto {

  public static INDEX = ActionProto.INDEX;
  public static ACTION = "provider/action/info";

}

@ProtobufElement({})
export class ProviderGetCryptoActionProto extends ActionProto {

  public static INDEX = ActionProto.INDEX;
  public static ACTION = "provider/action/getCrypto";

  @ProtobufProperty({ id: ProviderGetCryptoActionProto.INDEX++, required: true, type: "string" })
  public cryptoID: string = "";

}

// Events

@ProtobufElement({})
export class ProviderAuthorizedEventProto extends ActionProto {

  public static INDEX = ActionProto.INDEX;
  public static ACTION = "provider/event/authorized";

}

@ProtobufElement({ name: "ProviderTokenEvent" })
export class ProviderTokenEventProto extends ActionProto implements TokenInfoEvent {

  public static INDEX = ActionProto.INDEX;
  public static ACTION = "provider/event/token";

  @ProtobufProperty({ id: ProviderTokenEventProto.INDEX++, repeated: true, parser: ProviderCryptoProto })
  public added: ProviderCryptoProto[] = [];

  @ProtobufProperty({ id: ProviderTokenEventProto.INDEX++, repeated: true, parser: ProviderCryptoProto })
  public removed: ProviderCryptoProto[] = [];

  @ProtobufProperty({ id: ProviderTokenEventProto.INDEX++, type: "bytes", parser: ErrorProto })
  public error?: ErrorProto;

  constructor(data?: { added: ProviderCrypto[], removed: ProviderCrypto[]; }) {
    super();

    if (data) {
      assign(this, data);
    }
  }

}
