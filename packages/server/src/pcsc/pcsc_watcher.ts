import { EventEmitter } from "events";
import { WebCryptoLocalError } from "../error";
import * as PCSCLite from "../types/pcsclite";
const pcsc: () => PCSCLite.PCSCLite = require("pcsclite");

export interface PCSCWatcherEvent {
  reader: PCSCLite.CardReader;
  atr?: Buffer;
}

export class PCSCWatcher extends EventEmitter {

  public readers: PCSCLite.CardReader[] = [];
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
          const changes = (reader.state || 0) ^ status.state;
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
