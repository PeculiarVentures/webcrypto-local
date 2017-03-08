import * as fs from "fs";

const crypto: Crypto = new (require("node-webcrypto-ossl"))();

type IJsonOpenSSLKeyStorage = { [key: string]: IJsonOpenSSLKey };

interface IJsonOpenSSLKey extends CryptoKey {
    raw: string;
    createdAt: string;
    lastUsed: string;
}

export class OpenSSLKeyStorage implements IKeyStorage {

    public file: string;

    constructor(file: string) {
        this.file = file;
    }

    public async keys() {
        const keys = this.readFile();
        return Object.keys(keys);
    }

    public async setItem(key: string, value: CryptoKey) {
        const keys = this.readFile();
        keys[key] = await this.keyToJson(value);
        this.writeFile(keys);
    }

    public async getItem(key: string) {
        const keys = this.readFile();
        const keyJson = keys[key];
        return this.keyFromJson(keyJson);
    }

    public async removeItem(key: string) {
        const keys = this.readFile();
        delete keys[key];
        this.writeFile(keys);
    }

    protected readFile(): IJsonOpenSSLKeyStorage {
        if (!fs.existsSync(this.file)) {
            return {};
        }
        const buf = fs.readFileSync(this.file);
        return JSON.parse(buf.toString());
    }

    protected writeFile(obj: IJsonOpenSSLKeyStorage) {
        const buf = new Buffer(JSON.stringify(obj));
        fs.writeFileSync(this.file, buf, {
            encoding: "utf8",
            flag: "w+",
        });
    }

    protected keyToJson(key: CryptoKey): Promise<IJsonOpenSSLKey> {
        return Promise.resolve()
            .then(() => {
                const nativeKey = (key as any).native;
                let fn: (cb: (err: Error, data: Buffer) => void) => void;
                switch (key.type) {
                    case "secret":
                        fn = nativeKey.export;
                        break;
                    case "public":
                        fn = nativeKey.exportSpki;
                        break;
                    case "private":
                        fn = nativeKey.exportPkcs8;
                        break;
                    default:
                        throw new Error(`Unsupported type of CryptoKey '${key.type}'`);
                }
                return new Promise((resolve, reject) => {
                    fn.call(nativeKey, (err: Error, data: Buffer) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(data);
                        }
                    });
                });
            })
            .then((raw: Buffer) => {
                const json: IJsonOpenSSLKey = {
                    algorithm: key.algorithm,
                    extractable: key.extractable,
                    type: key.type,
                    usages: key.usages || [],
                    raw: raw.toString("base64"),
                    createdAt: new Date().toISOString(),
                    lastUsed: new Date().toISOString(),
                };
                return json;
            });
    }

    protected async keyFromJson(obj: IJsonOpenSSLKey) {
        let format: string;
        switch (obj.type) {
            case "secret":
                format = "raw";
                break;
            case "public":
                format = "spki";
                break;
            case "private":
                format = "pkcs8";
                break;
            default:
                throw new Error(`Unsupported type of CryptoKey '${obj.type}'`);
        }
        return crypto.subtle.importKey(format, new Buffer(obj.raw, "base64"), obj.algorithm as any, obj.extractable, obj.usages);
    }

}
