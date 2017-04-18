import { ProtobufElement, ProtobufProperty } from "tsprotobuf";
import { ActionProto } from "../proto";

@ProtobufElement({})
export class CryptoActionProto extends ActionProto {

    public static INDEX = ActionProto.INDEX;
    public static ACTION = "crypto";

    @ProtobufProperty({ id: CryptoActionProto.INDEX++, required: true, type: "string" })
    public providerID: string;

}

@ProtobufElement({})
export class LoginActionProto extends CryptoActionProto {

    public static INDEX = CryptoActionProto.INDEX;
    public static ACTION = "crypto/login";

}

@ProtobufElement({})
export class IsLoggedInActionProto extends CryptoActionProto {

    public static INDEX = CryptoActionProto.INDEX;
    public static ACTION = "crypto/isLoggedIn";

}
