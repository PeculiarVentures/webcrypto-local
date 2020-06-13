import { EventEmitter } from "events";
import * as os from "os";
import { OpenSC } from "../opensc";
import { Card, CardConfig, CardOptions } from "./card_config";
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
    if (options.opensc) {
      this.options.opensc = options.opensc;
    }
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
            this.emit("info", `CardConfig:Insert: Cannot check token because it uses an empty ATR. Reader: '${e.reader.name}'`);
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
          this.emit("error", e);
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

  private getCardObject(e: PCSCWatcherEvent) {
    let card = e.atr ? this.getCard(e.atr) : null;
    if (!card && os.platform() === "win32" && this.options.pvpkcs11) {
      this.emit("info", `CardConfig:Insert: Cannot get Card config for ATR:${e.atr}. Use pvpkcs11 SmartCard slot'`);
      card = {
        atr: e.atr,
        reader: e.reader.name,
        libraries: this.options.pvpkcs11,
        name: "SCard Windows API",
        readOnly: false,
      };
    }

    if (this.options.opensc) {
      const opensc = new OpenSC(this.options.opensc);
      opensc.open();
      const slotIndex = opensc.indexOf(e.reader.name);
      if (slotIndex !== -1) {
        if (card) {
          card.libraries.push(opensc.library);
        } else {
          const slot = opensc.module.getSlots(slotIndex);
          card = {
            atr: e.atr,
            reader: e.reader.name,
            libraries: [opensc.library],
            name: slot.getToken().label,
            readOnly: false,
          };
        }
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
      }
    }

    if (customCard) {
      // merge custom card with system card
      // NOTE: custom libraries MUST be first in list
      const libraries: string[] = [];
      for (const item of customCard.libraries) {
        libraries.push(item);
      }
      if (res) {
        for (const item of res.libraries) {
          libraries.push(item);
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
