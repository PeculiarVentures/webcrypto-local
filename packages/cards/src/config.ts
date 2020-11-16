import { JsonProp } from "@peculiar/json-schema";

export enum ConfigKeyUsagesEnum {
  required,
  optional,
}

export enum ConfigTokenEnum {
  required,
  optional,
  static,
}

export class Config {

  @JsonProp({enumeration: ["required" , "optional"], optional: true})
  public keyUsages?: keyof typeof ConfigKeyUsagesEnum;

  @JsonProp({enumeration: ["required" , "optional", "static"], optional: true})
  public token?: keyof typeof ConfigTokenEnum;

}