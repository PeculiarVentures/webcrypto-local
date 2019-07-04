import { EventEmitter } from "events";
import * as os from "os";
import { Card, CardConfig, CardOptions } from "./card_config";
import { PCSCWatcher } from "./pcsc_watcher";

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

export class CardWatcher extends EventEmitter {

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
    this.config = new CardConfig(options);
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
          if (!e.atr) {
            this.emit("info", `CardConfig:Insert: Cannot check token because it use empty ATR. Reader: '${e.reader.name}'`);
            return;
          }

          let card = e.atr ? this.getCard(e.atr) : null;
          if (!card && os.platform() === "win32" && options.pvpkcs11) {
            this.emit("info", `CardConfig:Insert: Cannot get Card config for ATR:${e.atr}. Use pvpkcs11 SmartCard slot'`);
            card = {
              atr: e.atr,
              reader: e.reader.name,
              libraries: this.options.pvpkcs11,
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
          let card = e.atr ? this.getCard(e.atr) : null;
          if (!card && os.platform() === "win32") {
            card = {
              atr: e.atr,
              reader: e.reader.name,
              libraries: this.options.pvpkcs11,
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
   * Starts to listen PCSC events
   *
   * @param path Path to JSON config file
   */
  public start(path: string) {
    try {
      this.config = CardConfig.readFile(path);
    } catch (e) {
      this.emit("error", e.message);
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

  private getCard(atr: Buffer) {
    debugger;
    const configCard = Object.assign({}, this.config.getItem(atr));

    // get custom card
    let customCard: Card | undefined;
    for (const card of this.options.cards) {
      if (card.atr && card.atr.equals(atr)) {
        customCard = card;
      }
    }

    if (customCard) {
      // merge custom card with system card
      // NOTE: custom libraries MUST be first in list
      const libraries: string[] = [];
      for (const item of customCard.libraries) {
        libraries.push(item);
      }
      for (const item of configCard.libraries) {
        libraries.push(item);
      }
      configCard.libraries = libraries;
    }

    return configCard;
  }
}
