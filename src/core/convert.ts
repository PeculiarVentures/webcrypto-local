import * as utils from "pvtsutils";

export class ArrayStringConverter {
    public static async set(value: string[]) {
        return new Uint8Array(utils.Convert.FromUtf8String(value.join(",")));
    };
    public static async get(value: Uint8Array) {
        return utils.Convert.ToUtf8String(value).split(",");
    }
}

export class HexStringConverter {
    public static async set(value: string) {
        return new Uint8Array(utils.Convert.FromHex(value));
    };
    public static async get(value: Uint8Array) {
        return utils.Convert.ToHex(value);
    }
}