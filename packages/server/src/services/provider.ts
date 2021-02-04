import * as core from "@webcrypto-local/core";
import * as proto from "@webcrypto-local/proto";
import { Server, Session } from "../connection";
import { MemoryStorage } from "../memory_storage";
import { PCSCCard } from "../pcsc";
import { IProviderConfig, LocalProvider } from "../provider";
import { CryptoService } from "./crypto";
import { Service } from "./service";

import { WebCryptoLocalError } from "../error";

export interface ProviderNotifyEvent {
  type: string;
  resolve: () => void;
  reject: (error: Error) => void;
}

export type ProviderNotifyEventHandler = (e: ProviderNotifyEvent) => void;

export class ProviderService extends Service<LocalProvider> {

  public source = "provider-service";

  public memoryStorage = new MemoryStorage();

  constructor(server: Server, options: IProviderConfig) {
    super(server, new LocalProvider(options), [
      //#region List of actions
      proto.ProviderInfoActionProto,
      proto.ProviderGetCryptoActionProto,
      //#endregion
    ]);

    const crypto = new CryptoService(server, this);
    this.addService(crypto);

    //#region Connect events
    this.object.on("token_new", this.onTokenNew.bind(this));
    this.object.on("token", this.onToken.bind(this));
    crypto.on("notify", this.onNotify.bind(this));
    //#endregion
  }

  //#region Events

  public emit(event: "notify", e: ProviderNotifyEvent): boolean;
  public emit(event: "token_new", e: PCSCCard): boolean;
  public emit(event: "error", error: Error): boolean;
  public emit(event: "info", level: core.LogLevel, source: string, message: string, data?: core.LogData): boolean;
  public emit(event: string, ...args: any[]): boolean {
    return super.emit(event, ...args);
  }

  public on(event: "notify", cb: ProviderNotifyEventHandler): this;
  public on(event: "token_new", cb: (e: PCSCCard) => void): this;
  public on(event: "error", cb: (error: Error) => void): this;
  public on(event: "info", cb: core.LogHandler): this;
  public on(event: string, cb: (...args: any[]) => void): this {
    return super.on(event, cb);
  }

  public once(event: "notify", cb: ProviderNotifyEventHandler): this;
  public once(event: "token_new", cb: (e: PCSCCard) => void): this;
  public once(event: "error", cb: (error: Error) => void): this;
  public once(event: "info", cb: core.LogHandler): this;
  public once(event: string, cb: (...args: any[]) => void): this {
    return super.once(event, cb);
  }

  //#endregion

  public open() {
    this.object.open()
      .catch((err) => {
        this.emit("error", err);
      });
  }

  public close() {
    this.object.crypto.clear();
  }

  public getProvider() {
    return this.object;
  }

  protected onTokenNew(e: PCSCCard) {
    this.emit("token_new", e);
  }

  protected onToken(info: core.TokenInfoEvent) {
    if (info.error) {
      this.emit("error", info.error);
    } else {
      this.log("info", "Amount of tokens was changed", {
        added: info.added.length,
        removed: info.removed.length,
      });
      this.server.sessions.forEach((session) => {
        if (session.cipher && session.authorized) {
          info.removed.forEach((item, index) => {
            info.removed[index] = new proto.ProviderCryptoProto(item);
            // remove objects from memory storage
            this.memoryStorage.removeByProvider(info.removed[index].id);
          });
          info.added.forEach((item, index) => {
            info.added[index] = new proto.ProviderCryptoProto(item);
          });
          this.server.send(session, new proto.ProviderTokenEventProto(info));
        }
      });
    }
  }

  protected onNotify(e: ProviderNotifyEvent) {
    this.emit("notify", e);
  }

  protected async onMessage(session: Session, action: proto.ActionProto) {
    const result = new proto.ResultProto(action);
    switch (action.action) {
      // info
      case proto.ProviderInfoActionProto.ACTION: {
        const info = this.object.info;
        result.data = await info.exportProto();
        break;
      }
      // getCrypto
      case proto.ProviderGetCryptoActionProto.ACTION: {
        const getCryptoParams = await proto.ProviderGetCryptoActionProto.importProto(action);

        await this.object.getCrypto(getCryptoParams.cryptoID);
        break;
      }
      default:
        throw new WebCryptoLocalError(WebCryptoLocalError.CODE.ACTION_NOT_IMPLEMENTED, `Action '${action.action}' is not implemented`);
    }
    return result;
  }

}
