import { JsonProp, JsonPropTypes } from "@peculiar/json-schema";
import { Config } from "./config";

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

  @JsonProp({
    type: Config,
    optional: true,
  })
  public config?: Config;

}
