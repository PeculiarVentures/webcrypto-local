import * as core from "@webcrypto-local/core";
import { assign } from "pvtsutils";
import { ProtobufElement, ProtobufProperty } from "tsprotobuf";
import { ActionProto, BaseProto, ErrorProto } from "./proto";

// Objects

@ProtobufElement({})
export class ProviderCryptoProto extends BaseProto implements core.ProviderCrypto {

  public static INDEX = BaseProto.INDEX;

  @ProtobufProperty({ id: ProviderCryptoProto.INDEX++, required: true, type: "string" })
  public id: string;

  @ProtobufProperty({ id: ProviderCryptoProto.INDEX++, required: true, type: "string" })
  public name: string;

  @ProtobufProperty({ id: ProviderCryptoProto.INDEX++, type: "bool", defaultValue: false })
  public readOnly: boolean;

  public library?: string;

  @ProtobufProperty({ id: ProviderCryptoProto.INDEX++, repeated: true, type: "string" })
  public algorithms: string[];

  @ProtobufProperty({ id: ProviderCryptoProto.INDEX++, type: "bool", defaultValue: false })
  public isRemovable: boolean;

  @ProtobufProperty({ id: ProviderCryptoProto.INDEX++, type: "string" })
  public atr: string;

  @ProtobufProperty({ id: ProviderCryptoProto.INDEX++, type: "bool", defaultValue: false })
  public isHardware: boolean;

  constructor(data?: core.ProviderCrypto) {
    super();

    if (data) {
      assign(this, data);
    }
  }

}

@ProtobufElement({})
export class ProviderInfoProto extends BaseProto {

  public static INDEX = BaseProto.INDEX;

  @ProtobufProperty({ id: ProviderInfoProto.INDEX++, type: "string", required: true })
  public name: string;

  @ProtobufProperty({ id: ProviderInfoProto.INDEX++, repeated: true, parser: ProviderCryptoProto })
  public providers: ProviderCryptoProto[];

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
  public cryptoID: string;

}

// Events

@ProtobufElement({})
export class ProviderAuthorizedEventProto extends ActionProto {

  public static INDEX = ActionProto.INDEX;
  public static ACTION = "provider/event/authorized";

}

@ProtobufElement({ name: "ProviderTokenEvent" })
export class ProviderTokenEventProto extends ActionProto implements core.TokenInfo {

  public static INDEX = ActionProto.INDEX;
  public static ACTION = "provider/event/token";

  @ProtobufProperty({ id: ProviderTokenEventProto.INDEX++, repeated: true, parser: ProviderCryptoProto })
  public added: ProviderCryptoProto[];

  @ProtobufProperty({ id: ProviderTokenEventProto.INDEX++, repeated: true, parser: ProviderCryptoProto })
  public removed: ProviderCryptoProto[];

  @ProtobufProperty({ id: ProviderTokenEventProto.INDEX++, type: "bytes", parser: ErrorProto })
  public error: ErrorProto;

  constructor(data?: { added: core.ProviderCrypto[], removed: core.ProviderCrypto[] }) {
    super();

    if (data) {
      assign(this, data);
    }
  }

}
