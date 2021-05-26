import { Config } from "@webcrypto-local/cards";
import * as core from "@webcrypto-local/core";
import * as proto from "@webcrypto-local/proto";
import * as fs from "fs";
import * as graphene from "graphene-pk11";
import { Crypto } from "node-webcrypto-p11";
import * as os from "os";
import { Convert } from "pvtsutils";

import { DEFAULT_HASH_ALG } from "./const";
import { Pkcs11Crypto, PvCrypto } from "./crypto";
import { CryptoMap } from "./crypto_map";
import { WebCryptoLocalError } from "./error";
import { digest } from "./helper";
import { MapChangeEvent } from "./map";
import { Card, CardLibraryType, CardWatcher, PCSCCard } from "./pcsc";
import { ConfigTemplateBuilder } from "./template_builder";

export interface IServerProvider {
  /**
   * Path to PKCS#11 lib
   */
  lib: string;
  /**
   * indexes of using slots. Default [0]
   */
  slots?: number[];
  libraryParameters?: string;
  /**
   * Custom name of provider
   */
  name?: string;
}

export interface IProviderConfig {
  /**
   * List of addition providers
   */
  providers?: IServerProvider[];
  /**
   * Path to card.json
   */
  cardConfigPath: string;
  pvpkcs11?: string[];
  opensc?: string;
  /**
   * Disable using of PCSC
   */
  disablePCSC?: boolean;
  /**
   * Additional cards
   */
  cards: Card[];
}

interface IAddProviderParams {
  name?: string;
}

type LocalProviderTokenHandler = (info: core.TokenInfoEvent) => void;
type LocalProviderTokenNewHandler = (info: PCSCCard) => void;
type LocalProviderListeningHandler = (info: core.IModule[]) => void;
type LocalProviderErrorHandler = (e: Error) => void;
type LocalProviderStopHandler = () => void;

function pauseAsync(ms: number = 1000) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export class LocalProvider extends core.EventLogEmitter {

  public source = "provider";

  public info!: proto.ProviderInfoProto;
  public crypto: CryptoMap;

  public cards?: CardWatcher;
  public config: IProviderConfig;

  /**
   *
   * @param config Config params
   */
  constructor(config: IProviderConfig) {
    super();

    this.config = config;
    if (!config.disablePCSC) {
      this.cards = new CardWatcher({
        cards: config.cards,
        pvpkcs11: config.pvpkcs11,
        opensc: config.opensc,
      });
    }
    this.crypto = new CryptoMap()
      .on("add", this.onCryptoAdd.bind(this))
      .on("remove", this.onCryptoRemove.bind(this));
  }

  public on(event: "close", listener: LocalProviderStopHandler): this;
  public on(event: "listening", listener: LocalProviderListeningHandler): this;
  public on(event: "token", listener: LocalProviderTokenHandler): this;
  public on(event: "token_new", listener: LocalProviderTokenNewHandler): this;
  public on(event: "error", listener: LocalProviderErrorHandler): this;
  public on(event: "info", listener: core.LogHandler): this;
  // public on(event: string | symbol, listener: Function): this;
  public on(event: string | symbol, listener: (...args: any[]) => void) {
    return super.on(event, listener);
  }

  public once(event: "close", listener: LocalProviderStopHandler): this;
  public once(event: "listening", listener: LocalProviderListeningHandler): this;
  public once(event: "token", listener: LocalProviderTokenHandler): this;
  public once(event: "token_new", listener: LocalProviderTokenNewHandler): this;
  public once(event: "error", listener: LocalProviderErrorHandler): this;
  public once(event: "info", listener: core.LogHandler): this;
  // public once(event: string | symbol, listener: Function): this;
  public once(event: string | symbol, listener: (...args: any[]) => void) {
    return super.once(event, listener);
  }

  public emit(event: "token", info: core.TokenInfoEvent): boolean;
  public emit(event: "token_new", info: PCSCCard): boolean;
  public emit(event: "error", error: Error | string): boolean;
  public emit(event: "listening", info: proto.ProviderInfoProto): boolean;
  public emit(event: "info", level: core.LogLevel, source: string, message: string, data?: core.LogData): boolean;
  public emit(event: string | symbol, ...args: any[]) {
    return super.emit(event, ...args);
  }

  public async open() {
    this.info = new proto.ProviderInfoProto();
    this.info.name = "WebcryptoLocal";
    this.info.providers = [];

    //#region System via pvpkcs11
    if (this.config.pvpkcs11) {
      for (const pvpkcs11 of this.config.pvpkcs11) {
        if (fs.existsSync(pvpkcs11)) {
          try {
            const crypto = new PvCrypto({
              library: pvpkcs11,
              slot: 0,
              readWrite: true,
            });

            crypto.isLoggedIn = true;
            this.addProvider(crypto);
          } catch (e) {
            this.emit("error", new WebCryptoLocalError(WebCryptoLocalError.CODE.PROVIDER_INIT, `Provider:open Cannot load library by path ${pvpkcs11}. ${e.message}`));
          }
        } else {
          this.emit("error", new WebCryptoLocalError(WebCryptoLocalError.CODE.PROVIDER_INIT, `Provider:open Cannot find pvpkcs11 by path ${pvpkcs11}`));
        }
      }
    }
    //#endregion

    //#region Add providers from config list
    this.config.providers = this.config.providers || [];
    for (const prov of this.config.providers) {
      prov.slots = prov.slots || [0];
      for (const slot of prov.slots) {
        if (fs.existsSync(prov.lib)) {
          try {
            const crypto = new Pkcs11Crypto({
              library: prov.lib,
              libraryParameters: prov.libraryParameters,
              slot,
              readWrite: true,
            });
            this.addProvider(crypto, {
              name: prov.name,
            });
          } catch (err) {
            this.emit("error", new WebCryptoLocalError(WebCryptoLocalError.CODE.PROVIDER_INIT, `Provider:open Cannot load PKCS#11 library by path ${prov.lib}. ${err.message}`));
          }
        } else {
          this.log("info", `File ${prov.lib} does not exist`, { action: "open" });
        }
      }
    }
    //#endregion

    //#region Add pkcs11
    if (this.cards) {
      this.cards
        .on("error", (err) => {
          this.emit("error", err);
          return this.emit("token", {
            added: [],
            removed: [],
            error: err,
          });
        })
        .on("info", (level, source, message, data) => {
          this.emit("info", level, source, message, data);
        })
        .on("new", (card) => {
          return this.emit("token_new", card);
        })
        .on("insert", this.onTokenInsert.bind(this))
        .on("remove", this.onTokenRemove.bind(this))
        .start(this.config.cardConfigPath);
    }
    //#endregion

    this.emit("listening", await this.getInfo());
  }

  public addProvider(crypto: Crypto, params?: IAddProviderParams) {
    const info = getSlotInfo(crypto);

    this.log("info", "PKCS#11 library information", {
      library: crypto.session.slot.module.libFile,
      manufacturerId: crypto.session.slot.module.manufacturerID,
      cryptokiVersion: crypto.session.slot.module.cryptokiVersion,
      libraryVersion: crypto.session.slot.module.libraryVersion,
      firmwareVersion: crypto.session.slot.firmwareVersion,
    });

    if (params?.name) {
      info.name = info.name;
      info.card = params.name;
    }
    this.info.providers.push(new proto.ProviderCryptoProto(info));
    this.crypto.add(info.id, crypto);
  }

  public hasProvider(slot: graphene.Slot) {
    return this.crypto.some((crypto) => {
      const cryptoModule: graphene.Module = (crypto as any).module;
      const cryptoSlot: graphene.Slot = (crypto as any).slot;
      if (cryptoModule.libFile === slot.module.libFile &&
        cryptoSlot.handle.equals(slot.handle)) {
        return true;
      }
      return false;
    });
  }

  public stop() {
    throw new WebCryptoLocalError(WebCryptoLocalError.CODE.METHOD_NOT_IMPLEMENTED);
  }

  public async getInfo(): Promise<proto.ProviderInfoProto> {
    const resProto = new proto.ProviderInfoProto();
    return resProto;
  }

  public async getCrypto(cryptoID: string) {
    const crypto = this.crypto.item(cryptoID);
    if (!crypto) {
      throw new WebCryptoLocalError(WebCryptoLocalError.CODE.PROVIDER_CRYPTO_NOT_FOUND, `Cannot get crypto by given ID '${cryptoID}'`);
    }
    return crypto;
  }

  protected async onTokenInsert(card: Card) {
    this.log("info", "Token was added to the reader", {
      reader: card.reader,
      name: card.name,
      atr: card.atr?.toString("hex") || "unknown",
    });

    let lastError: Error | null = null;
    for (const lib of card.libraries) {
      const library = typeof lib === "string"
        ? lib
        : lib.path;
      const type: CardLibraryType =  typeof lib === "string" ? "config" : lib.type;
      try {
        this.log("info", "Loading PKCS#11 library", {
          library,
        });
        lastError = null; // remove last error
        if (!fs.existsSync(library)) {
          lastError = new WebCryptoLocalError(WebCryptoLocalError.CODE.PROVIDER_CRYPTO_NOT_FOUND, library);
          this.emit("error", `Cannot load PKCS#11 library. File '${library}' does not exist`);
          continue;
        }

        let mod: graphene.Module | undefined;
        try {
          mod = graphene.Module.load(library, card.name);
        } catch (err) {
          this.emit("error", err);
          lastError = new WebCryptoLocalError(WebCryptoLocalError.CODE.PROVIDER_CRYPTO_WRONG, library);
          continue;
        }

        try {
          await pauseAsync();
          mod.initialize();
        } catch (err) {
          if (!/CRYPTOKI_ALREADY_INITIALIZED/.test(err.message)) {
            this.emit("error", err);
            lastError = new WebCryptoLocalError(WebCryptoLocalError.CODE.PROVIDER_CRYPTO_WRONG, library);
            continue;
          }
        }

        const slots = mod.getSlots(true);
        if (!slots.length) {
          this.emit("error", `No slots found. It's possible token ${card.atr ? card.atr.toString("hex") : "unknown"} uses wrong PKCS#11 lib ${card.libraries}`);
          lastError = new WebCryptoLocalError(WebCryptoLocalError.CODE.PROVIDER_CRYPTO_WRONG, library);
          continue;
        }
        const slotIndexes: number[] = [];
        this.log("info", "Looking for slot", {
          slots: slots.length,
        });
        for (let i = 0; i < slots.length; i++) {
          const slot = slots.items(i);
          if (!slot || this.hasProvider(slot)) {
            continue;
          }
          if (os.platform() === "win32" &&
            /pvpkcs11\.dll$/.test(slot.lib.libPath) &&
            slot.slotDescription !== card.reader) {
            // NOTE:  pvpkcs11 implementation has only one slot for MiniDriver
            // Use only slot where slotDescription equals to reader name
            continue;
          }
          slotIndexes.push(i);
        }
        if (!slotIndexes.length) {
          // lastError = `Cannot find matching slot for '${card.reader}' reader`;
          continue;
        }

        const addInfos: core.ProviderCrypto[] = [];
        slotIndexes.forEach((slotIndex) => {
          try {
            const crypto = new Pkcs11Crypto({
              library,
              name: card.name,
              slot: slotIndex,
              readWrite: !card.readOnly,
            });
            if (type === "config") {
              this.log("info", "Use ConfigTemplateBuilder", card.config);
              crypto.templateBuilder = new ConfigTemplateBuilder(card.config || new Config());
            } else {
              this.log("info", "Use default TemplateBuilder");
            }
            const info = getSlotInfo(crypto);
            info.atr = Convert.ToHex(card.atr || Buffer.alloc(0));
            info.library = library;
            info.id = digest(DEFAULT_HASH_ALG, `${card.reader}${card.atr}${crypto.slot.handle.toString()}`).toString("hex");

            addInfos.push(info);
            this.addProvider(crypto);
          } catch (err) {
            this.emit("error", err);
          }
        });

        // fire token event
        this.emit("token", {
          added: addInfos,
          removed: [],
        });
        break;
      } catch (err) {
        lastError = err;
        continue;
      }
    }
    if (lastError) {
      this.emit("token", {
        added: [],
        removed: [],
        error: lastError,
      });
    }
  }

  protected async onTokenRemove(card: Card) {
    try {
      this.log("info", "Token was removed from the reader", {
        reader: card.reader,
        name: card.name,
        atr: card.atr?.toString("hex") || "unknown",
      });

      const info: any = {
        added: [],
        removed: [],
      };

      //#region Find slots from removed token
      const cryptoIDs: string[] = [];
      for (const lib of card.libraries) {
        const library = typeof lib === "string"
          ? lib
          : lib.path;
        try {

          const mod = graphene.Module.load(library, card.name);
          await pauseAsync();
          try {
            mod.initialize();
          } catch (err) {
            if (!/CRYPTOKI_ALREADY_INITIALIZED/.test(err.message)) {
              throw err;
            }
          }

          //#region Look for removed slots
          const slots = mod.getSlots(true);
          this.crypto.forEach((crypto, key) => {
            const cryptoModule: graphene.Module = (crypto as any).module;
            const cryptoSlot: graphene.Slot = (crypto as any).slot;
            if (cryptoModule.libFile === mod.libFile) {
              if (slots.indexOf(cryptoSlot) === -1) {
                cryptoIDs.push(key);
              }
            }
          });
          //#endregion

        } catch (err) {
          this.emit("error", new WebCryptoLocalError(
            WebCryptoLocalError.CODE.TOKEN_REMOVE_TOKEN_READING,
            `Cannot find removed slot in PKCS#11 library ${library}. ${err.message}`,
          ));
        }
      }

      if (!cryptoIDs.length) {
        this.emit("error", new WebCryptoLocalError(WebCryptoLocalError.CODE.TOKEN_REMOVE_NO_SLOTS_FOUND));
      }
      //#endregion

      cryptoIDs.forEach((provId) => {
        this.crypto.remove(provId);

        this.info.providers = this.info.providers.filter((provider) => {
          if (provider.id === provId) {
            // remove crypto
            info.removed.push(provider);
            return false;
          }
          return true;
        });
      });
      // fire token event
      if (info.removed.length) {
        this.emit("token", info);
      }
    } catch (error) {
      this.emit("token", {
        added: [],
        removed: [],
        error,
      });
    }
  }

  protected onCryptoAdd(e: MapChangeEvent<Pkcs11Crypto>) {
    this.log("info", "Crypto provider was added to the list", {
      id: e.key,
      library: e.item.module.libFile,
      name: e.item.info.name,
      reader: e.item.info.reader,
    });
  }

  protected onCryptoRemove(e: MapChangeEvent<Pkcs11Crypto>) {
    const cryptoModule = e.item.module;
    this.log("info", "Crypto provider was removed from the list", {
      id: e.key
    });

    if (!this.crypto.some((crypto: any) => crypto.slot && crypto.slot.module.libFile === cryptoModule.libFile)) {
      this.log("info", "Finalize crypto provider", {
        id: e.key
      });
      try {
        cryptoModule.finalize();
      } catch (err) {
        this.emit("error", err);
      }
    }
  }

}

function getSlotInfo(p11Crypto: Crypto) {
  const session: graphene.Session = (p11Crypto as any).session;
  const slot = session.slot;
  const info: core.ProviderCrypto = p11Crypto.info as any;
  info.token = slot.getToken();
  info.readOnly = !(session.flags & graphene.SessionFlag.RW_SESSION);
  return info;
}
