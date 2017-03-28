import { assign } from "pvtsutils";
import { ProtobufElement, ProtobufProperty } from "tsprotobuf";
import { ActionProto, BaseProto } from "../proto";

// Objects

@ProtobufElement({ name: "ProviderCrypto" })
export class ProviderCryptoProto extends BaseProto implements IProvider {

    public static INDEX = BaseProto.INDEX;

    @ProtobufProperty({ id: ProviderCryptoProto.INDEX++, required: true, type: "string" })
    public id: string;

    @ProtobufProperty({ id: ProviderCryptoProto.INDEX++, required: true, type: "string" })
    public name: string;

    @ProtobufProperty({ id: ProviderCryptoProto.INDEX++, repeated: true, type: "string" })
    public algorithms: string[];

    constructor(data?: IProvider) {
        super();

        if (data) {
            assign(this, data);
        }
    }

}

@ProtobufElement({ name: "ProviderInfo" })
export class ProviderInfoProto extends BaseProto implements IModule {

    public static INDEX = BaseProto.INDEX;

    @ProtobufProperty({ id: ProviderInfoProto.INDEX++, required: true, type: "string" })
    public name: string;

    @ProtobufProperty({ id: ProviderInfoProto.INDEX++, repeated: true, parser: ProviderCryptoProto })
    public providers: ProviderCryptoProto[];

}

// Actions

@ProtobufElement({ name: "ProviderOpen" })
export class ProviderOpenProto extends ActionProto {

    public static INDEX = ActionProto.INDEX;
    public static ACTION = "provider/open";

}

@ProtobufElement({ name: "ProviderPIN" })
export class ProviderPINProto extends ActionProto {

    public static INDEX = ActionProto.INDEX;
    public static ACTION = "provider/pin";


}

@ProtobufElement({ name: "ProviderInfo" })
export class ProviderInfoActionProto extends ActionProto {

    public static INDEX = ActionProto.INDEX;
    public static ACTION = "provider/info";

}

@ProtobufElement({ name: "ProviderGetCrypto" })
export class ProviderGetCryptoProto extends ActionProto {

    public static INDEX = ActionProto.INDEX;
    public static ACTION = "provider/getCrypto";

}

// Events

@ProtobufElement({ name: "ProviderListeningEvent" })
export class ProviderListeningEventProto extends ActionProto {

    public static INDEX = ActionProto.INDEX;
    public static ACTION = "provider/event/listening";

    @ProtobufProperty({ id: ProviderListeningEventProto.INDEX++, repeated: true, parser: ProviderInfoProto })
    public info: ProviderInfoProto;

}

@ProtobufElement({ name: "ProviderTokenEvent" })
export class ProviderTokenEventProto extends ActionProto {

    public static INDEX = ActionProto.INDEX;
    public static ACTION = "provider/event/token";

    @ProtobufProperty({ id: ProviderTokenEventProto.INDEX++, repeated: true, parser: ProviderCryptoProto })
    public added: ProviderCryptoProto[];

    @ProtobufProperty({ id: ProviderTokenEventProto.INDEX++, repeated: true, parser: ProviderCryptoProto })
    public removed: ProviderCryptoProto[];

}