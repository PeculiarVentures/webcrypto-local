import * as core from "@webcrypto-local/core";
import pcsc from "pcsclite";
import type { CardReader, PCSCLite } from "../types/pcsclite";
import { WebCryptoLocalError } from "../error";

export interface PCSCWatcherEvent {
  reader: CardReader;
  atr?: Buffer;
}

export class PCSCWatcher extends core.EventLogEmitter {

  public source = "pcsc";

  public readers: CardReader[] = [];
  protected pcsc: PCSCLite | null = null;

  private startCalls = 0; // Track the number of start method calls

  constructor() {
    super();
  }

  public start(): this {
    if (this.startCalls > 3) { // Adjust the maximum recursion limit as needed
      this.log("info", "PCSC restart limit reached");
      this.startCalls = 0;
      // Wait and restart pcsc again
      setTimeout(() => {
        this.pcsc?.removeAllListeners();
        this.start();
      }, 1e5);
      return this;
    }

    this.log("info", "Start PCSC listening");
    this.startCalls += 1; // Increment the start call counter

    try {
      this.pcsc = pcsc();
      this.pcsc.on("error", (err) => {
        this.emit("error", err);

        // Restart only if the start call counter is within the limit
        // See https://github.com/PeculiarVentures/webcrypto-local/issues/284
        if (this.startCalls <= 3) {
          this.pcsc?.removeAllListeners();
          // PCSCLite closes session on PCSC error. For that case we need to restart it with small delay.
          // See https://github.com/PeculiarVentures/fortify/issues/421
          setTimeout(this.start, 1e3);
        }
      });
      this.pcsc.on("reader", (reader) => {
        this.log("info", "Initialize new reader", {
          reader: reader.name,
        });
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
              this.log("info", "New token was added to the reader", {
                reader: reader.name,
                atr: atr?.toString("hex") || "unknown",
              });
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

            this.log("info", "Token was removed from the reader", {
              reader: reader.name,
              atr: atr?.toString("hex") || "unknown",
            });

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
      this.log("info", "Stop PCSC listening");

      this.pcsc.close();
      this.pcsc = null;
    }
  }

  public on(event: "info", cb: core.LogHandler): this;
  public on(event: "insert", cb: (e: PCSCWatcherEvent) => void): this;
  public on(event: "remove", cb: (e: PCSCWatcherEvent) => void): this;
  public on(event: "error", cb: (err: Error) => void): this;
  public on(event: string, cb: (...args: any[]) => void): this {
    return super.on(event, cb);
  }

  public emit(event: "info", level: core.LogLevel, source: string, message: string, data?: core.LogData): boolean;
  public emit(event: "insert", e: PCSCWatcherEvent): boolean;
  public emit(event: "remove", e: PCSCWatcherEvent): boolean;
  public emit(event: "error", err: Error): boolean;
  public emit(event: string, ...args: any[]) {
    return super.emit(event, ...args);
  }

}
