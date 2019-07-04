import { JsonProp } from "@peculiar/json-schema";
import { Card } from "./card";
import { Driver } from "./driver";
import { Variables } from "./variables";

export class Cards {

  @JsonProp()
  public version: string;

  @JsonProp({
    type: Card,
    repeated: true,
  })
  public cards: Card[] = [];

  @JsonProp({
    type: Driver,
    repeated: true,
  })
  public drivers: Driver[] = [];

  @JsonProp({
    type: Variables,
    name: "vars",
    optional: true,
  })
  public variables?: Variables;

}
