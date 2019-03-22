import { Convert } from "pvtsutils";

export class ArrayStringConverter {

  public static async set(value: string[]) {
    return new Uint8Array(Convert.FromUtf8String((value).join(",")));
  }

  public static async get(value: Uint8Array) {
    return Convert.ToUtf8String(value).split(",");
  }

}
