import { IJsonConvertible } from "@peculiar/json-schema";

export type AnyFunction = (...args: any[]) => any;

export class Variables implements IJsonConvertible<any> {
  [key: string]: string | AnyFunction;

  public fromJSON(json: any): this {
    if (typeof json === "object") {
      for (const key in json) {
        const val = (json as any)[key];
        if (typeof val === "string") {
          this[key] = val;
        }
      }
    }

    return this;
  }

  public toJSON(): any {
    const res: any = {};

    for (const key in this) {
      res[key] = this[key];
    }

    return res;
  }

}
