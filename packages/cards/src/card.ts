import { JsonProp, JsonPropTypes } from "@peculiar/json-schema";

export class Card {

  @JsonProp({
    type: JsonPropTypes.String,
  })
  public atr: string = "";

  @JsonProp({
    type: JsonPropTypes.String,
  })
  public name: string = "";

  @JsonProp({
    type: JsonPropTypes.String,
  })
  public driver: string = "";

  @JsonProp({
    type: JsonPropTypes.Boolean,
    defaultValue: false,
  })
  public readOnly: boolean = false;

}
