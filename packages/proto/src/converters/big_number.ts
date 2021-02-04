import { Convert } from "pvtsutils";

export class BigNumberConverter {

  public static async set(value: number) {
    return new Uint8Array( Convert.FromUtf8String(value.toString(10)));
  }

  public static async get(value: Uint8Array) {
    return parseInt(Convert.ToUtf8String(value), 10);
  }

}