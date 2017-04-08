import { EventEmitter } from "events";
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
