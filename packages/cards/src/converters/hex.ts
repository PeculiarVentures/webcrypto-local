import {IJsonConverter} from "@peculiar/json-schema";

export const JsonHexConverter: IJsonConverter<Buffer, string> = {
  fromJSON: (value: string, target: any) => Buffer.from(value, "hex"),
  toJSON: (value: Buffer, target: any) => value.toString("hex"),
};
