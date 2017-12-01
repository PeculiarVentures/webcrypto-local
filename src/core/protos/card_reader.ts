import { ProtobufElement, ProtobufProperty } from "tsprotobuf";

import { PCSCWatcherEvent } from "../../local/pcsc_watcher";
import { ActionProto} from "../proto";
import { HexStringConverter } from "./converter";

// Actions

@ProtobufElement({})
export class CardReaderActionProto extends ActionProto {

    public static INDEX = ActionProto.INDEX;
    public static ACTION = "cardReader";

}

@ProtobufElement({})
export class CardReaderGetReadersActionProto extends ActionProto {

    public static INDEX = ActionProto.INDEX;
    public static ACTION = "cardReader/readers";

}

// Events

@ProtobufElement({})
class CardReaderEventProto extends CardReaderActionProto {

    public static INDEX = CardReaderActionProto.INDEX;

    public static fromObject(e: PCSCWatcherEvent) {
        const res = new this();
        res.fromObject(e);

        return res;
    }

    @ProtobufProperty({ id: CardReaderEventProto.INDEX++, required: true, type: "string", defaultValue: "" })
    public reader: string;
    @ProtobufProperty({ id: CardReaderEventProto.INDEX++, required: true, converter: HexStringConverter })
    public atr: string;

    public fromObject(e: PCSCWatcherEvent) {
        this.reader = e.reader.name;
        this.atr = e.atr.toString("hex");
    }

}

@ProtobufElement({})
export class CardReaderInsertEventProto extends CardReaderEventProto {

    public static INDEX = CardReaderEventProto.INDEX;
    public static ACTION = CardReaderEventProto.ACTION + "/insert";

}

@ProtobufElement({})
export class CardReaderRemoveEventProto extends CardReaderEventProto {

    public static INDEX = CardReaderEventProto.INDEX;
    public static ACTION = CardReaderEventProto.ACTION + "/remove";

}
