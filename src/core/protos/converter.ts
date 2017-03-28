import { Convert } from "pvtsutils";

export class DateConverter {
    public static async set(value: Date): Promise<Uint8Array> {
        return new Uint8Array(Convert.FromUtf8String(value.toISOString()));
    }
    public static async get(value: Uint8Array): Promise<Date> {
        return new Date(Convert.ToUtf8String(value));
    }
}

export class ArrayStringConverter {
    public static async set(value: string[]) {
        return new Uint8Array(Convert.FromUtf8String((value).join(",")));
    };
    public static async get(value: Uint8Array) {
        return Convert.ToUtf8String(value).split(",");
    }
}

export class HexStringConverter {
    public static async set(value: string) {
        return new Uint8Array(Convert.FromHex(value));
    };
    public static async get(value: Uint8Array) {
        return Convert.ToHex(value);
    }
}