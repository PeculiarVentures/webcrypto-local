import * as core from "@webcrypto-local/core";
import * as proto from "@webcrypto-local/proto";
import { EventEmitter } from "events";
import * as fs from "fs";
import * as graphene from "graphene-pk11";
import { Crypto } from "node-webcrypto-p11";
import * as os from "os";
import { Convert } from "pvtsutils";

import { DEFAULT_HASH_ALG, PV_PKCS11_LIB } from "./const";
import { Pkcs11Crypto, PvCrypto } from "./crypto";
import { CryptoMap } from "./crypto_map";
import { WebCryptoLocalError } from "./error";
import { digest } from "./helper";
import { MapChangeEvent } from "./map";
import { Card, CardWatcher, PCSCCard } from "./pcsc_watcher";

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
  cards: string;
}

interface IAddProviderParams {
  name?: string;
}

type LocalProviderTokenHandler = (info: core.TokenInfo) => void;
type LocalProviderTokenNewHandler = (info: PCSCCard) => void;
type LocalProviderListeningHandler = (info: core.IModule[]) => void;
type LocalProviderErrorHandler = (e: Error) => void;
type LocalProviderStopHandler = () => void;

export class LocalProvider extends EventEmitter {

  public info!: proto.ProviderInfoProto;
  public crypto: CryptoMap;

  protected cards: CardWatcher;
  protected config: IProviderConfig;

  /**
   *
   * @param config Config params
   */
  constructor(config: IProviderConfig) {
    super();

    this.config = config;
    this.cards = new CardWatcher();
    this.crypto = new CryptoMap()
      .on("add", this.onCryptoAdd.bind(this))
      .on("remove", this.onCryptoRemove.bind(this));
  }

  public on(event: "close", listener: LocalProviderStopHandler): this;
  public on(event: "listening", listener: LocalProviderListeningHandler): this;
  public on(event: "token", listener: LocalProviderTokenHandler): this;
  public on(event: "token_new", listener: LocalProviderTokenNewHandler): this;
  public on(event: "error", listener: LocalProviderErrorHandler): this;
  public on(event: "info", listener: (message: string) => void): this;
  // public on(event: string | symbol, listener: Function): this;
  public on(event: string | symbol, listener: (...args: any[]) => void) {
    return super.on(event, listener);
  }

  public once(event: "close", listener: LocalProviderStopHandler): this;
  public once(event: "listening", listener: LocalProviderListeningHandler): this;
  public once(event: "token", listener: LocalProviderTokenHandler): this;
  public once(event: "token_new", listener: LocalProviderTokenNewHandler): this;
  public once(event: "error", listener: LocalProviderErrorHandler): this;
  public once(event: "info", listener: (message: string) => void): this;
  // public once(event: string | symbol, listener: Function): this;
  public once(event: string | symbol, listener: (...args: any[]) => void) {
    return super.once(event, listener);
  }

  public emit(event: "token", info: core.TokenInfo): boolean;
  public emit(event: "token_new", info: PCSCCard): boolean;
  public emit(event: "info", message: string): boolean;
  public emit(event: "error", error: Error | string): boolean;
  public emit(event: "listening", info: proto.ProviderInfoProto): boolean;
  public emit(event: string | symbol, ...args: any[]) {
    return super.emit(event, ...args);
  }

  public async open() {
    const EVENT_LOG = "Provider:Open";
    this.info = new proto.ProviderInfoProto();
    this.info.name = "WebcryptoLocal";
    this.info.providers = [];

    //#region System via pvpkcs11
    {
      if (fs.existsSync(PV_PKCS11_LIB)) {
        try {
          const crypto = new PvCrypto({
            library: PV_PKCS11_LIB,
            slot: 0,
            readWrite: true,
          });

          crypto.isLoggedIn = true;
          this.addProvider(crypto);
        } catch (e) {
          this.emit("error", new WebCryptoLocalError(WebCryptoLocalError.CODE.PROVIDER_INIT, `${EVENT_LOG} Cannot load library by path ${PV_PKCS11_LIB}. ${e.message}`));
        }
      } else {
        this.emit("error", new WebCryptoLocalError(WebCryptoLocalError.CODE.PROVIDER_INIT, `${EVENT_LOG} Cannot find pvpkcs11 by path ${PV_PKCS11_LIB}`));
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
            this.emit("error", new WebCryptoLocalError(WebCryptoLocalError.CODE.PROVIDER_INIT, `${EVENT_LOG} Cannot load PKCS#11 library by path ${prov.lib}. ${err.message}`));
          }
        } else {
          this.emit("error", new WebCryptoLocalError(WebCryptoLocalError.CODE.PROVIDER_INIT, `${EVENT_LOG} Cannot find PKCS#11 library by path ${prov.lib}`));
        }
      }
    }
    //#endregion

    //#region Add pkcs11
    this.cards
      .on("error", (err) => {
        this.emit("error", err);
        return this.emit("token", {
          added: [],
          removed: [],
          error: err,
        });
      })
      .on("info", (message) => {
        this.emit("info", message);
      })
      .on("new", (card) => {
        return this.emit("token_new", card);
      })
      .on("insert", this.onTokenInsert.bind(this))
      .on("remove", this.onTokenRemove.bind(this))
      .start(this.config.cards);
    //#endregion

    this.emit("listening", await this.getInfo());
  }

  public addProvider(crypto: Crypto, params?: IAddProviderParams) {
    const info = getSlotInfo(crypto);
    this.emit("info", `Provider: Add crypto '${info.name}' ${info.id}`);
    if (params) {
      if (params.name) {
        info.name = params.name;
      }
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

  protected onTokenInsert(card: Card) {
    const EVENT_LOG = "Provider:Token:Insert";
    this.emit("info", `${EVENT_LOG} reader:'${card.reader}' name:'${card.name}' atr:${card.atr ? card.atr.toString("hex") : "unknown"}`);
    let lastError: Error | null = null;
    for (const library of card.libraries) {
      try {
        lastError = null; // remove last error
        if (!fs.existsSync(library)) {
          lastError = new WebCryptoLocalError(WebCryptoLocalError.CODE.PROVIDER_CRYPTO_NOT_FOUND, library);
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
          this.emit("error", `${EVENT_LOG} No slots found. It's possible token ${card.atr ? card.atr.toString("hex") : "unknown"} uses wrong PKCS#11 lib ${card.libraries}`);
          lastError = new WebCryptoLocalError(WebCryptoLocalError.CODE.PROVIDER_CRYPTO_WRONG, library);
          continue;
        }
        const slotIndexes: number[] = [];
        this.emit("info", `${EVENT_LOG} Looking for ${card.reader} into ${slots.length} slot(s)`);
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

  protected onTokenRemove(card: Card) {
    try {
      const EVENT_LOG = "Provider:Token:Remove";
      this.emit("info", `${EVENT_LOG} reader:'${card.reader}' name:'${card.name}' atr:${card.atr ? card.atr.toString("hex") : "unknown"}`);
      const info: any = {
        added: [],
        removed: [],
      };

      //#region Find slots from removed token
      const cryptoIDs: string[] = [];
      card.libraries.forEach((library) => {
        try {

          const mod = graphene.Module.load(library, card.name);
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
            `${EVENT_LOG} PKCS#11 lib ${library}. ${err.message}`,
          ));
        }
      });

      if (!cryptoIDs.length) {
        this.emit("error", new WebCryptoLocalError(WebCryptoLocalError.CODE.TOKEN_REMOVE_NO_SLOTS_FOUND));
      }
      //#endregion

      cryptoIDs.forEach((provId) => {
        this.crypto.remove(provId);

        this.info.providers = this.info.providers.filter((provider) => {
          if (provider.id === provId) {
            this.emit("info", `${EVENT_LOG} Crypto removed '${provider.name}' ${provider.id}`);
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
    this.emit("info", `Provider:AddCrypto PKCS#11 '${e.item.module.libFile}' '${e.item.module.libName}'`);
  }

  protected onCryptoRemove(e: MapChangeEvent<Pkcs11Crypto>) {
    const LOG = "Provider:RemoveCrypto";
    const cryptoModule = e.item.module;
    this.emit("info", `${LOG} PKCS#11 '${cryptoModule.libFile}' '${cryptoModule.libName}'`);

    if (!this.crypto.some((crypto: any) => crypto.slot && crypto.slot.module.libFile === cryptoModule.libFile)) {
      this.emit("info", `${LOG} PKCS#11 finalize '${cryptoModule.libFile}'`);
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
  const info: core.ProviderCrypto = p11Crypto.info as any;
  info.readOnly = !(session.flags & graphene.SessionFlag.RW_SESSION);
  return info;
}
