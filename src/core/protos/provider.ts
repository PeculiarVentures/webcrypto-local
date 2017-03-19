import { ProtobufElement, ProtobufProperty } from "tsprotobuf";
import { BaseProto, ActionProto } from "../proto";
import { assign } from "pvtsutils";

// Objects

@ProtobufElement({})
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

@ProtobufElement({})
export class ProviderInfoProto extends BaseProto {

    public static INDEX = BaseProto.INDEX;

    @ProtobufProperty({ id: ProviderInfoProto.INDEX++, type: "string", required: true })
    public name: string;

    @ProtobufProperty({ id: ProviderInfoProto.INDEX++, repeated: true, parser: ProviderCryptoProto })
    public cryptos: ProviderCryptoProto[];

}

// Actions

@ProtobufElement({})
export class ProviderInfoActionProto extends ActionProto {

    public static INDEX = ActionProto.INDEX;
    public static ACTION = "provider/action/info";

}

// Events

@ProtobufElement({})
export class ProviderAuthorizedEventProto extends ActionProto {

    public static INDEX = ActionProto.INDEX;
    public static ACTION = "provider/event/authorized";

}
