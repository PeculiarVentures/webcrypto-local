import { ProtobufElement, ProtobufProperty } from "tsprotobuf";
import { HexStringConverter } from "./converters";
import { ActionProto } from "./proto";

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

  @ProtobufProperty({ id: CardReaderEventProto.INDEX++, required: true, type: "string", defaultValue: "" })
  public reader: string = "";

  @ProtobufProperty({ id: CardReaderEventProto.INDEX++, required: true, converter: HexStringConverter })
  public atr: string = "";

  constructor();
  constructor(reader: string, atr: string);
  constructor(reader?: string, atr?: string) {
    super();

    if (reader && atr) {
      this.reader = reader;
      this.atr = atr;
    }
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
