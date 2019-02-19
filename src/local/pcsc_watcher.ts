import { EventEmitter } from "events";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as core from "webcrypto-core";
import { CardReader } from "../types/pcsclite";
import { PV_PKCS11_LIB } from "./const";
import { WebCryptoLocalError } from "./error";
const pcsc: () => PCSCLite.PCSCLite = require("pcsclite");

export interface PCSCWatcherEvent {
    reader: PCSCLite.CardReader;
    atr?: Buffer;
}

export class PCSCWatcher extends EventEmitter {

    public readers: CardReader[] = [];
    protected pcsc: PCSCLite.PCSCLite | null = null;

    constructor() {
        super();
    }

    public start(): this {
        try {
            this.pcsc = pcsc();
            this.pcsc.on("error", (err) => {
                this.emit("error", err);
            });
            this.pcsc.on("reader", (reader) => {
                this.emit("info", `PCSCWatcher: New reader detected ${reader.name}`);
                this.readers.push(reader);
                let atr: Buffer | null;
                reader.state = 0;
                reader.on("error", (err) => {
                    this.emit("error", err);
                });
                reader.on("status", (status) => {
                    // console.log("----name:'%s' atr:%s reader_state:%s state:%s", reader.name, status.atr.toString("hex"), reader.state, status.state);
                    // check what has changed
                    const changes = reader.state ^ status.state;
                    if (changes) {
                        if ((changes & reader.SCARD_STATE_EMPTY) && (status.state & reader.SCARD_STATE_EMPTY)) {
                            // card removed
                            if (atr) {
                                // don't fire event if 'atr' wasn't set
                                const event: PCSCWatcherEvent = {
                                    reader,
                                    atr,
                                };
                                this.emit("remove", event);
                                atr = null;
                            }
                        } else if ((changes & reader.SCARD_STATE_PRESENT) && (status.state & reader.SCARD_STATE_PRESENT)) {
                            // card insert
                            const event: PCSCWatcherEvent = {
                                reader,
                            };
                            if (status.atr && status.atr.byteLength) {
                                atr = status.atr;
                                event.atr = atr;
                            }
                            this.emit("info", `PCSCWatcher:Insert reader:'${reader.name}' ATR:${atr && atr.toString("hex")}`);
                            // Delay for lib loading
                            setTimeout(() => {
                                this.emit("insert", event);
                            }, 1e3);
                        }
                    }
                });

                reader.on("end", () => {
                    // console.log("Reader", this.name, "removed");
                    if (atr) {
                        // don't fire event if 'atr' wasn't set
                        const event: PCSCWatcherEvent = {
                            reader,
                            atr,
                        };
                        this.emit("remove", event);
                        atr = null;
                    }
                });
            });
        } catch (err) {
            this.emit("error", new WebCryptoLocalError(WebCryptoLocalError.CODE.PCSC_CANNOT_START));
        }
        return this;
    }
    public stop() {
        if (this.pcsc) {
            this.pcsc.close();
            this.pcsc = null;
        }
    }

    public on(event: "info", cb: (message: string) => void): this;
    public on(event: "insert", cb: (e: PCSCWatcherEvent) => void): this;
    public on(event: "remove", cb: (e: PCSCWatcherEvent) => void): this;
    public on(event: "error", cb: (err: Error) => void): this;
    public on(event: string, cb: (...args: any[]) => void): this {
        return super.on(event, cb);
    }

}

interface JsonCard {
    atr: core.HexString;
    name: string;
    mask?: core.HexString;
    readOnly?: boolean;
    driver: core.HexString;
}

interface JsonOsArch {
    x64: string | string[];
    x86: string | string[];
}

type JsonOsType = string | string[] | JsonOsArch;

interface JsonDriver {
    id?: core.HexString;
    name?: string;
    file: {
        [os: string]: JsonOsType;
        windows: JsonOsType;
        linux: JsonOsType;
        osx: JsonOsType;
    };
}

interface JsonCardConfig {
    vars?: { [key: string]: string; };
    cards: JsonCard[];
    drivers: JsonDriver[];
}

export interface PCSCCard {
    /**
     * Name of PCSC reader
     */
    reader: string;
    /**
     * ATR of device
     */
    atr: Buffer;
}

export interface Card {
    reader?: string;
    name: string;
    atr: Buffer;
    mask?: Buffer;
    readOnly: boolean;
    libraries: string[];
}

interface Driver {
    id?: core.HexString;
    name?: string;
    libraries: string[];
}

export class CardConfig {

    public static readFile(fPath: string) {
        const res = new this();
        res.readFile(fPath);
        return res;
    }

    public cards: { [atr: string]: Card } = {};

    public readFile(fPath: string) {
        if (!fs.existsSync(fPath)) {
            throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CARD_CONFIG_COMMON, `Cannot find file '${fPath}'`);
        }
        const data = fs.readFileSync(fPath);
        let json: JsonCardConfig;
        try {
            json = JSON.parse(data.toString());
        } catch (err) {
            throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CARD_CONFIG_COMMON, "Cannot parse JSON file");
        }
        // TODO: match JSON scheme or verify data
        this.fromJSON(json);
    }

    public getItem(atr: Buffer) {
        return this.cards[atr.toString("hex")] || null;
    }

    protected fromJSON(json: JsonCardConfig) {
        const cards: { [atr: string]: Card } = {};
        // create map of drives
        const drivers: { [guid: string]: Driver } = {};
        json.drivers.forEach((jsonDriver) => {
            const driver: Driver = {
                id: jsonDriver.id,
                name: jsonDriver.name,
                libraries: [],
            };
            drivers[jsonDriver.id] = driver;

            let system: string;
            //#region GEt system
            switch (os.type()) {
                case "Linux":
                    system = "linux";
                    break;
                case "Windows_NT":
                    system = "windows";
                    break;
                case "Darwin":
                    system = "osx";
                    break;
                default:
                    throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CARD_CONFIG_COMMON, "Unsupported OS");
            }
            //#endregion

            let library: string[] = [];
            const driverLib = jsonDriver.file[system];
            if (driverLib) {
                if (typeof driverLib === "string") {
                    library = [driverLib];
                } else if (Array.isArray(driverLib)) {
                    library = driverLib;
                } else {
                    if (process.arch === "x64") {
                        if (driverLib.x64) {
                            if (Array.isArray(driverLib.x64)) {
                                library.concat(driverLib.x64);
                            } else {
                                library.push(driverLib.x64);
                            }
                        }
                        if (driverLib.x86) {
                            if (Array.isArray(driverLib.x86)) {
                                library.concat(driverLib.x86);
                            } else {
                                library.push(driverLib.x86);
                            }
                        }
                    } else {
                        if (driverLib.x86) {
                            if (Array.isArray(driverLib.x86)) {
                                library.concat(driverLib.x86);
                            } else {
                                library.push(driverLib.x86);
                            }
                        }
                    }
                }
            }
            if (os.platform() === "win32") {
                library.push(PV_PKCS11_LIB);
            }
            driver.libraries = library.map((lib) => {
                let res = replaceTemplates(lib, process.env, "%");
                if (json.vars) {
                    res = replaceTemplates(lib, json.vars, "<");
                }
                return path.normalize(res);
            });
        });

        // link card with driver and fill object's cards
        json.cards.forEach((item) => {
            const card: Card = {} as any;
            card.atr = new Buffer(item.atr, "hex");
            if (item.mask) {
                card.mask = new Buffer(item.mask);
            }
            card.name = item.name;
            card.readOnly = !!item.readOnly;

            const driver = drivers[item.driver];
            if (!driver) {
                throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CARD_CONFIG_COMMON, `Cannot find driver for card ${item.name} (${item.atr})`);
            }

            // Don't add cards without libraries
            if (driver.libraries.length) {
                card.libraries = driver.libraries;
                cards[card.atr.toString("hex")] = card;
            }
        });

        this.cards = cards;
    }

}

export class CardWatcher extends EventEmitter {

    /**
     * List of allowed cards
     */
    public cards: Card[] = [];

    protected watcher: PCSCWatcher;
    protected config = new CardConfig();

    constructor() {
        super();

        this.watcher = new PCSCWatcher();
        this.watcher
            .on("info", (message) => {
                this.emit("info", message);
            })
            .on("error", (err) => {
                this.emit("error", err);
            })
            .on("insert", (e) => {
                try {
                    let card = this.config.getItem(e.atr);
                    if (!card && os.platform() === "win32") {
                        card = {
                            atr: e.atr,
                            reader: e.reader.name,
                            libraries: [PV_PKCS11_LIB],
                            name: "SCard Windows API",
                            readOnly: false,
                        };
                    }
                    if (card) {
                        card.reader = e.reader.name;
                        this.add(card);
                        this.emit("insert", card);
                    } else {
                        this.emit("new", {
                            reader: e.reader.name,
                            atr: e.atr,
                        });
                    }
                } catch (e) {
                    this.emit("error", e);
                }
            })
            .on("remove", (e) => {
                try {
                    let card = this.config.getItem(e.atr);
                    if (!card && os.platform() === "win32") {
                        card = {
                            atr: e.atr,
                            reader: e.reader.name,
                            libraries: [PV_PKCS11_LIB],
                            name: "SCard Windows API",
                            readOnly: false,
                        };
                    }
                    if (card) {
                        card.reader = e.reader.name;
                        this.remove(card);
                        this.emit("remove", card);
                    }
                } catch (e) {
                    this.emit("error", e);
                }
            });
    }

    public on(event: "info", cb: (message: string) => void): this;
    public on(event: "error", cb: (err: Error) => void): this;
    public on(event: "insert", cb: (card: Card) => void): this;
    public on(event: "new", cb: (card: PCSCCard) => void): this;
    public on(event: "remove", cb: (card: Card) => void): this;
    public on(event: string, cb: (...args: any[]) => void) {
        return super.on(event, cb);
    }

    /**
     *
     *
     * @param {string} config Path to JSON config file
     *
     * @memberOf CardWatcher
     */
    public start(config: string) {
        try {
            this.config = CardConfig.readFile(config);
        } catch (e) {
            this.emit("error", e.message);
        }
        this.watcher.start();
    }

    public stop() {
        this.watcher.stop();
    }

    protected add(card: Card) {
        if (!this.cards.some((item) => item === card)) {
            this.cards.push(card);
        }
    }

    protected remove(card: Card) {
        this.cards = this.cards.filter((item) => item !== card);
    }

}

/**
 * Replace <prefix><vane> (e.g. %WINDIR, <myvar) by values from given arguments
 * @param text String text which must be updated
 * @param args list of arguments with values
 * @param prefix prefix of template
 */
function replaceTemplates(text: string, args: { [key: string]: string }, prefix: string) {
    // search <prefix><name> and replace by ARGS
    // if ENV not exists don't change name
    const envReg = new RegExp(`\\${prefix}([\\w\\d\\(\\)\\-\\_]+)`, "gi");
    let res: RegExpExecArray;
    let resText = text;
    // tslint:disable-next-line:no-conditional-assignment
    while (res = envReg.exec(text)) {
        const argsName = res[1];
        let argsValue: string | null = null;
        for (const key in args) {
            if (key.toLowerCase() === argsName.toLowerCase()) {
                argsValue = args[key];
                break;
            }
        }
        if (argsValue) {
            resText = resText.replace(new RegExp(`\\${prefix}${argsName.replace(/([\(\)])/g, "\\$1")}`, "i"), argsValue);
        }
    }
    return resText;
}
