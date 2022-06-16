import * as core from "@webcrypto-local/core";
import * as os from "os";
import { prepareError } from "../helper";
import { OpenSC } from "../opensc";
import { Card, CardConfig, CardLibrary, CardOptions } from "./card_config";
import { PCSCWatcher, PCSCWatcherEvent } from "./pcsc_watcher";

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

export class CardWatcher extends core.EventLogEmitter {

  public source = "card-watcher";

  /**
   * List of allowed cards
   */
  public cards: Card[] = [];
  public options: CardOptions;

  protected watcher: PCSCWatcher;
  protected config: CardConfig;

  constructor(options: Partial<CardOptions> = {}) {
    super();

    this.options = {
      pvpkcs11: options.pvpkcs11 || [],
      cards: options.cards || [],
    };
    if (options.opensc) {
      this.options.opensc = options.opensc;
    }
    this.config = new CardConfig(options);
    this.watcher = new PCSCWatcher();
    this.watcher
      .on("info", (level, source, message, data) => {
        this.emit("info", level, source, message, data);
      })
      .on("error", (err) => {
        this.emit("error", err);
      })
      .on("insert", (e) => {
        try {
          if (!e.atr) {
            this.log("warn", "Cannot check token because it uses an empty ATR", {
              reader: e.reader.name,
            });
            return;
          }

          const card = this.getCardObject(e);
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
          this.emit("error", prepareError(e));
        }
      })
      .on("remove", (e) => {
        try {
          const removed = this.cards.filter((o) => o.reader === e.reader.name && o.atr && e.atr && o.atr.equals(e.atr));
          if (removed.length) {
            this.cards = this.cards.filter((o) => !removed.includes(o));
            for (const card of removed) {
              this.emit("remove", card);
            }
          }
        } catch (e) {
          this.emit("error", prepareError(e));
        }
      });
  }

  public on(event: "info", cb: core.LogHandler): this;
  public on(event: "error", cb: (err: Error) => void): this;
  public on(event: "insert", cb: (card: Card) => void): this;
  public on(event: "new", cb: (card: PCSCCard) => void): this;
  public on(event: "remove", cb: (card: Card) => void): this;
  public on(event: string, cb: (...args: any[]) => void) {
    return super.on(event, cb);
  }

  public emit(event: "info", level: core.LogLevel, source: string, message: string, data?: core.LogData): boolean;
  public emit(event: "error", err: Error): boolean;
  public emit(event: "insert", card: Card): boolean;
  public emit(event: "new", card: PCSCCard): boolean;
  public emit(event: "remove", card: Card): boolean;
  public emit(event: string, ...args: any[]) {
    return super.emit(event, ...args);
  }

  /**
   * Starts to listen PCSC events
   *
   * @param path Path to JSON config file
   */
  public start(path: string) {
    try {
      this.config = CardConfig.readFile(path, this.options);
    } catch (e) {
      this.emit("error", prepareError(e));
    }
    this.watcher.start();
  }

  public stop() {
    this.watcher.stop();
  }

  protected add(card: Card) {
    if (!this.cards.some((item) => item.atr === card.atr)) {
      this.cards.push(card);
    }
  }

  protected remove(card: Card) {
    this.cards = this.cards.filter((item) => item.atr !== card.atr);
  }

  private getCardObject(e: PCSCWatcherEvent) {
    let card = e.atr ? this.getCard(e.atr) : null;

    if (this.options.opensc) {
      try {
        const opensc = new OpenSC(this.options.opensc);
        opensc.open();
        const slotIndex = opensc.indexOf(e.reader.name);
        if (slotIndex !== -1) {
          if (card) {
            card.libraries.push({ type: "extra", path: opensc.library });
          } else {
            this.log("info", "Card is not in card.json, but supported by opensc", {
              atr: e.atr?.toString("hex") || "empty",
              reader: e.reader.name,
            });
            const slot = opensc.module.getSlots(slotIndex);
            card = {
              atr: e.atr || Buffer.alloc(0),
              reader: e.reader.name,
              libraries: [{ type: "extra", path: opensc.library }],
              name: slot.getToken().label,
              readOnly: false,
            };
          }
        }
      } catch (e) {
        this.emit("error", prepareError(e));
      }
    }

    if (os.platform() === "win32" && this.options.pvpkcs11) {
      if (card) {
        for (const lib of this.options.pvpkcs11) {
          card.libraries.push({ type: "extra", path: lib });
        }
      } else {
        this.log("info", `Cannot get Card config. Use pvpkcs11 SmartCard slot`, {
          reader: e.reader,
          atr: e.atr?.toString("hex") || "empty",
        });
        card = {
          atr: e.atr || Buffer.alloc(0),
          reader: e.reader.name,
          libraries: this.options.pvpkcs11.map(o => {
            return { type: "extra", path: o };
          }),
          name: "SCard Windows API",
          readOnly: true,
        };
      }
    }

    return card;
  }

  private getCard(atr: Buffer) {
    const configCard = this.config.getItem(atr);
    let res = configCard ? Object.assign({}, configCard) : null;

    // get custom card
    let customCard: Card | undefined;
    for (const card of this.options.cards) {
      if (card.atr && card.atr.equals(atr)) {
        customCard = card;
        break;
      }
    }

    if (customCard) {
      // merge custom card with system card
      // NOTE: custom libraries MUST be first in list
      const libraries: CardLibrary[] = [];
      for (const item of customCard.libraries) {
        if (typeof item === "string") {
          libraries.push({ type: "config", path: item });
        } else {
          libraries.push(item);
        }
      }
      if (res) {
        for (const item of res.libraries) {
          if (typeof item === "string") {
            libraries.push({ type: "config", path: item });
          } else {
            libraries.push(item);
          }
        }
      } else {
        res = {
          atr,
          libraries,
          name: customCard.name,
          readOnly: customCard.readOnly,
        };
      }
      res.libraries = libraries;
    }

    return res;
  }
}
