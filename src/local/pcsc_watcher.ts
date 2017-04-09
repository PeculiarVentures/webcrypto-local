import { EventEmitter } from "events";
import * as fs from "fs";
import * as os from "os";
const pcsc: () => PCSCLite.PCSCLite = require("pcsclite");

interface PCSCWatcherEvent {
    reader: PCSCLite.CardReader;
    atr?: Buffer;
}

export class PCSCWatcher extends EventEmitter {

    protected pcsc: PCSCLite.PCSCLite | null = null;

    constructor() {
        super();
    }

    public start(): this {
        this.pcsc = pcsc();
        this.pcsc.on("error", (err) => {
            this.emit("error", err);
        });
        this.pcsc.on("reader", (reader) => {
            // console.log("New reader detected", reader.name);
            let atr: Buffer | null;
            reader.on("error", (err) => {
                this.emit("error", err);
            });
            reader.on("status", (status) => {
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
                        atr = status.atr;
                        const event: PCSCWatcherEvent = {
                            reader,
                        };
                        if (atr) {
                            event.atr = atr;
                        }
                        this.emit("insert", event);
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
                }
            });
        });
        return this;
    }
    public stop() {
        if (this.pcsc) {
            this.pcsc.close();
            this.pcsc = null;
        }
    }

    public on(event: "insert", cb: (e: PCSCWatcherEvent) => void): this;
    public on(event: "remove", cb: (e: PCSCWatcherEvent) => void): this;
    public on(event: "error", cb: (err: Error) => void): this;
    public on(event: string, cb: Function): this {
        return super.on(event, cb);
    }

}


interface JsonCard {
    atr: HexString;
    name: string;
    mask?: HexString;
    readOnly?: boolean;
    driver: HexString;
}

interface JsonDriver {
    id?: HexString;
    name?: string;
    file: {
        [os: string]: string;
        windows: string;
        linux: string;
        osx: string;
    }
}

interface JsonCardConfig {
    cards: JsonCard[];
    drivers: JsonDriver[];
}

interface Card {
    name: string;
    atr: Buffer;
    mask?: Buffer;
    readOnly: boolean;
    library: string;
}

export class CardConfig {

    public static readFile(path: string) {
        const res = new this();
        res.readFile(path);
        return res;
    }

    public cards: { [atr: string]: Card } = {};

    public readFile(path: string) {
        if (!fs.existsSync(path)) {
            throw new Error(`Cannot find file '${path}'`);
        }
        const data = fs.readFileSync(path);
        let json: JsonCardConfig;
        try {
            json = JSON.parse(data.toString());
        } catch (err) {
            throw new Error("Cannot parse JSON file");
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
        const drivers: { [guid: string]: JsonDriver } = {};
        json.drivers.forEach((driver) => {
            drivers[driver.id] = driver;
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
            let system: string;
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
                    throw new Error("Unsupported OS");
            }
            const driver = drivers[item.driver];
            if (!driver) {
                throw new Error(`Cannot find driver for card ${item.name} (${item.atr})`);
            }
            const library = driver.file[system];
            // Don't add card without library
            if (library) {
                card.library = library;
                cards[card.atr.toString("hex")] = card;
            }
        });

        this.cards = cards;
    }

}

export class CardWatcher extends EventEmitter {

    /**
     * List of allowed cards
     * 
     * @type {Card[]}
     * @memberOf CardWatcher
     */
    public cards: Card[] = [];

    protected watcher: PCSCWatcher;
    protected config: CardConfig;

    constructor() {
        super();

        this.watcher = new PCSCWatcher();
        this.watcher
            .on("error", (err) => {
                this.emit("error", err);
            })
            .on("insert", (e) => {
                const card = this.config.getItem(e.atr);
                if (card) {
                    this.add(card);
                    this.emit("insert", card);
                } else {
                    this.emit("error", new Error(`Unsupported card in use. ${e.reader.name} ${e.atr.toString("hex")}`));
                }
            })
            .on("remove", (e) => {
                const card = this.config.getItem(e.atr);
                if (card) {
                    this.remove(card);
                    this.emit("remove", card);
                }
            });
    }

    /**
     * 
     * 
     * @param {string} config Path to JSON config file
     * 
     * @memberOf CardWatcher
     */
    public start(config: string) {
        this.config = CardConfig.readFile(config);
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
        this.cards.filter((item) => item !== card);
    }

}
