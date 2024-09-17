import * as core from "@webcrypto-local/core";
import pcsc from "pcsclite";
import type { CardReader, PCSCLite } from "../types/pcsclite";
import { WebCryptoLocalError } from "../error";

export interface PCSCWatcherEvent {
  reader: CardReader;
  atr?: Buffer;
}

export class PCSCWatcher extends core.EventLogEmitter {

  public static singleton = new PCSCWatcher();

  public source = "pcsc";

  public readers: CardReader[] = [];
  protected pcsc: PCSCLite | null = null;

  /**
   * Track the number of start method calls
   */
  private startCalls = 0;
  /**
   * Track the number of restart attempts after warning
   */
  private restartAttempts = 0;

  /**
   * Maximum number of initial start attempts
   */
  private static readonly MAX_START_CALLS = 3;
  /**
   * Maximum number of restart attempts after warning
   */
  private static readonly MAX_RESTART_ATTEMPTS = 12;

  private static readonly START_DELAY = 1e3; // 1 second
  private static readonly RESTART_DELAY = 300000; // 5 minutes

  private constructor() {
    super();
  }

  public start(): this {
    this.log("info", "Start PCSC listening");
    this._start();
    return this;
  }

  private _start(): void {
    if (this.startCalls >= PCSCWatcher.MAX_START_CALLS) {
      // Exceeded maximum start calls
      this.emit("error", new WebCryptoLocalError(WebCryptoLocalError.CODE.PCSC_CANNOT_START));
      this.log("warn", "PCSC start calls limit reached. Restarting PCSC");

      this.startCalls = 0;
      this.restartAttempts += 1;

      if (this.restartAttempts >= PCSCWatcher.MAX_RESTART_ATTEMPTS) {
        // Exceeded maximum restart attempts, stop trying
        this.log("warn", "Maximum restart attempts reached. Stopping PCSC reconnection attempts.");
        return;
      }

      // Wait and restart pcsc again
      setTimeout(() => {
        this.log("info", "Retrying PCSC start");
        this._start();
      }, PCSCWatcher.RESTART_DELAY);
      return;
    }

    this.startCalls += 1; // Increment the start call counter

    try {
      this.pcsc = pcsc();
      this.pcsc.on("error", (err) => {
        this.emit("error", err);

        // Restart only if the start call counter is within the limit
        if (this.startCalls <= PCSCWatcher.MAX_START_CALLS) {
          this.pcsc?.removeAllListeners();
          // PCSCLite closes session on PCSC error. Restart with a small delay.
          setTimeout(() => {
            this.start();
          }, PCSCWatcher.START_DELAY);
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
          // Check what has changed
          const changes = (reader.state || 0) ^ status.state;
          if (changes) {
            if ((changes & reader.SCARD_STATE_EMPTY) && (status.state & reader.SCARD_STATE_EMPTY)) {
              // Card removed
              if (atr) {
                // Don't fire event if 'atr' wasn't set
                const event: PCSCWatcherEvent = {
                  reader,
                  atr,
                };
                this.emit("remove", event);
                atr = null;
              }
            } else if ((changes & reader.SCARD_STATE_PRESENT) && (status.state & reader.SCARD_STATE_PRESENT)) {
              // Card inserted
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
              // Delay for library loading
              setTimeout(() => {
                this.emit("insert", event);
              }, 1e3);
            }
          }
        });

        reader.on("end", () => {
          if (atr) {
            // Don't fire event if 'atr' wasn't set
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

      // Reset startCalls counter and restartAttempts on successful connection
      this.log("info", "PCSC connected successfully");
      this.startCalls = 0;
      this.restartAttempts = 0;
    } catch (err) {
      setTimeout(() => {
        this._start();
      }, 1e3);
    }
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
