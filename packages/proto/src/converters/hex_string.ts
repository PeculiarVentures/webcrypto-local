import { Convert } from "pvtsutils";

export class HexStringConverter {

  public static async set(value: string) {
    return new Uint8Array(Convert.FromHex(value));
  }

  public static async get(value: Uint8Array) {
    return Convert.ToHex(value);
  }

}
