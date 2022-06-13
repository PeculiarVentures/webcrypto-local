import { JsonParser } from "@peculiar/json-schema";
import { Cards, Config, Variables } from "@webcrypto-local/cards";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as core from "webcrypto-core";
import { WebCryptoLocalError } from "../error";
import { stringifyError } from "../helper";

export type CardLibraryType = "config" | "extra";

export interface CardLibrary {
  path: string;
  type: CardLibraryType;
}

export interface Card {
  config?: Config;
  reader?: string;
  name: string;
  atr: Buffer;
  mask?: Buffer;
  readOnly: boolean;
  libraries: (string | CardLibrary)[];
}

interface Driver {
  config: Config;
  id?: core.HexString;
  name?: string;
  libraries: string[];
}

export interface CardOptions {
  pvpkcs11: string[];
  opensc?: string;
  cards: Card[];
}

export class CardConfig {

  public static readFile(fPath: string, params?: Partial<CardOptions>) {
    const res = new this(params);
    res.readFile(fPath);
    return res;
  }

  public cards: { [atr: string]: Card; } = {};
  public options: CardOptions;

  constructor(options: Partial<CardOptions> = {}) {
    this.options = {
      cards: options.cards || [],
      pvpkcs11: options.pvpkcs11 || [],
    };
  }

  public readFile(fPath: string) {
    if (!fs.existsSync(fPath)) {
      throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CARD_CONFIG_COMMON, `Cannot find file '${fPath}'`);
    }
    const data = fs.readFileSync(fPath);
    let json: Cards;
    try {
      json = JsonParser.parse(data.toString(), { targetSchema: Cards });
    } catch (err) {
      throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CARD_CONFIG_COMMON, `Cannot parse JSON file. ${stringifyError(err)}`);
    }
    this.fromJSON(json);
  }

  public getItem(atr: Buffer): Card | null {
    return this.cards[atr.toString("hex")] || null;
  }

  protected fromJSON(json: Cards) {
    const cards: { [atr: string]: Card; } = {};

    // copy cards from options
    for (const card of this.options.cards) {
      cards[card.atr.toString("hex")] = card;
    }

    // create map of drives
    const drivers: { [guid: string]: Driver; } = {};
    json.drivers.forEach((jsonDriver) => {
      const driver: Driver = {
        id: jsonDriver.id,
        name: jsonDriver.name,
        libraries: [],
        config: jsonDriver.config || new Config(),
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

      const library: string[] = [];
      for (const file of jsonDriver.files) {
        if (file.os === system) {
          if (process.arch !== "x64") {
            // x86
            if (file.arch === "any" || file.arch === "x86") {
              library.push(file.path);
            }
          } else {
            // x64
            library.push(file.path);
          }
        }
      }
      if (os.platform() === "win32") {
        // use pvpkcs11 library for Windows
        library.concat(this.options.pvpkcs11);
      }
      driver.libraries = library.map((lib) => {
        let res = replaceTemplates(lib, process.env as any, "%");
        if (json.variables) {
          res = replaceTemplates(lib, json.variables, "<");
        }
        return path.normalize(res);
      });
    });

    // link card with driver and fill object's cards
    for (const item of json.cards) {
      if (cards[item.atr.toLowerCase()]) {
        // If card already in list of cards, skip it
        continue;
      }

      const card = {} as Card;
      card.atr = Buffer.from(item.atr, "hex");
      card.name = item.name;
      card.readOnly = !!item.readOnly;

      const driver = drivers[item.driver];
      if (!driver) {
        throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CARD_CONFIG_COMMON, `Cannot find driver for card ${item.name} (${item.atr})`);
      }
      // Assign config (default, driver, cards)
      card.config = Object.assign(new Config(), driver.config, item.config || {});

      // Don't add cards without libraries
      if (driver.libraries.length) {
        card.libraries = driver.libraries.map(o => {
          return {
            type: "config",
            path: o,
          };
        });
        cards[card.atr.toString("hex")] = card;
      }
    };

    this.cards = cards;
  }

}

/**
 * Replace <prefix><vane> (e.g. %WINDIR, <myvar) by values from given arguments
 * @param text String text which must be updated
 * @param args list of arguments with values
 * @param prefix prefix of template
 */
function replaceTemplates(text: string, args: Variables, prefix: string) {
  // search <prefix><name> and replace by ARGS
  // if ENV not exists don't change name
  const envReg = new RegExp(`\\${prefix}([\\w\\d\\(\\)\\-\\_]+)`, "gi");
  let res: RegExpExecArray | null;
  let resText = text;
  // tslint:disable-next-line:no-conditional-assignment
  while (res = envReg.exec(text)) {
    const argsName = res[1];
    let argsValue: string | null = null;
    for (const key in args) {
      const arg = args[key];
      if (typeof arg === "string" && key.toLowerCase() === argsName.toLowerCase()) {
        argsValue = arg;
        break;
      }
    }
    if (argsValue) {
      resText = resText.replace(new RegExp(`\\${prefix}${argsName.replace(/([\(\)])/g, "\\$1")}`, "i"), argsValue);
    }
  }
  return resText;
}
