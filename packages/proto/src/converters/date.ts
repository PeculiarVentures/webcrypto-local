import { Convert } from "pvtsutils";

export class DateConverter {

  public static async set(value: Date): Promise<Uint8Array> {
    return new Uint8Array(Convert.FromUtf8String(value.toISOString()));
  }

  public static async get(value: Uint8Array): Promise<Date> {
    return new Date(Convert.ToUtf8String(value));
  }

}
