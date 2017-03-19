import { ProtobufElement, ProtobufProperty } from "tsprotobuf";
import { BaseProto, ActionProto } from "../proto";

// Objects

@ProtobufElement({})
export class ProviderInfoProto extends BaseProto {

    public static INDEX = BaseProto.INDEX;

    @ProtobufProperty({ id: ProviderInfoProto.INDEX++, type: "string", required: true })
    public name: string;

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
