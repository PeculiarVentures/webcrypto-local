import { JsonProp, JsonPropTypes } from "@peculiar/json-schema";
import { JsonFileConverter } from "./converters/file";
import { File } from "./file";

export class Driver {

  @JsonProp({
    type: JsonPropTypes.String,
  })
  public id: string = "";

  @JsonProp({
    type: JsonPropTypes.String,
    optional: true,
  })
  public name?: string;

  @JsonProp({
    converter: JsonFileConverter,
    name: "file",
  })
  public files: File[] = [];

}
