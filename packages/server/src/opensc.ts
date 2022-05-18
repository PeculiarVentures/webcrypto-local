import * as graphene from "graphene-pk11";
import { Pkcs11Crypto } from "./crypto";
import { WebCryptoLocalError } from "./error";

export type OpenScStatus = "open" | "close";

export class OpenSC {

  public readonly library: string;
  public readonly module: graphene.Module;
  public status: OpenScStatus = "close";

  constructor(library: string) {
    this.library = library;
    this.module = graphene.Module.load(library);
  }

  public open() {
    if (this.status === "close") {
      try {
        this.module.initialize();
      } catch (err) {
        if (!(err instanceof Error) || !/CRYPTOKI_ALREADY_INITIALIZED/.test(err.message)) {
          throw new WebCryptoLocalError(WebCryptoLocalError.CODE.PROVIDER_CRYPTO_WRONG, this.library);
        }
      }
      this.status = "open";
    }
  }

  /**
   * Returns Crypto for specified reader. If reader does not exist returns null
   * @param reader
   */
  public crypto(reader: string) {
    const index = this.indexOf(reader);
    if (index !== -1) {
      return new Pkcs11Crypto({
        library: this.library,
        slot: index,
      });
    }
    return null;
  }

  /**
   * Returns index of slot. If slot not found returns -1
   * @param reader
   */
  public indexOf(reader: string) {
    const slots = this.module.getSlots();
    for (let i = 0; i < slots.length; i++) {
      const slot = slots.items(i);
      if (slot.slotDescription === reader) {
        return i;
      }
    }
    return -1;
  }

  public close() {
    if (this.status !== "close") {
      this.module.finalize();
      this.status = "close";
    }
  }

}
