import * as proto from "@webcrypto-local/proto";
import { Convert } from "pvtsutils";

import { Server, Session } from "../connection";
import { WebCryptoLocalError } from "../error";
import { PCSCWatcher, PCSCWatcherEvent } from "../pcsc_watcher";
import { Service } from "./service";

export class CardReaderService extends Service<PCSCWatcher> {

  constructor(server: Server) {
    super(server, new PCSCWatcher(), [
      proto.CardReaderGetReadersActionProto,
    ]);

    //#region Connect to PCSC events
    this.object.on("insert", this.onInsert.bind(this));
    this.object.on("remove", this.onRemove.bind(this));
    //#endregion
  }

  public start() {
    this.object.start();
  }

  public stop() {
    this.object.stop();
  }

  public on(event: "error", cb: (error: Error) => void): this;
  public on(event: "info", cb: (message: string) => void): this;
  public on(event: string, cb: (...args: any[]) => void): this {
    return super.on(event, cb);
  }

  public once(event: "error", cb: (error: Error) => void): this;
  public once(event: "info", cb: (message: string) => void): this;
  public once(event: string, cb: (...args: any[]) => void): this {
    return super.once(event, cb);
  }

  protected onInsert(e: PCSCWatcherEvent) {
    this.server.sessions.forEach((session) => {
      if (session.authorized) {
        const eventProto = this.createProto(proto.CardReaderInsertEventProto, e);

        this.server.send(session, eventProto);
      }
    });
  }

  protected onRemove(e: PCSCWatcherEvent) {
    this.server.sessions.forEach((session) => {
      if (session.authorized) {
        const eventProto = this.createProto(proto.CardReaderRemoveEventProto, e);

        this.server.send(session, eventProto);
      }
    });
  }

  protected async onMessage(session: Session, action: proto.ActionProto) {
    const result = new proto.ResultProto(action);
    switch (action.action) {
      case proto.CardReaderGetReadersActionProto.ACTION: {
        result.data = Convert.FromString(JSON.stringify(this.object.readers));
        break;
      }
      default:
        throw new WebCryptoLocalError(WebCryptoLocalError.CODE.ACTION_NOT_IMPLEMENTED, `Action '${action.action}' is not implemented`);
    }
    return result;
  }

  protected createProto(cls: typeof proto.CardReaderInsertEventProto | typeof proto.CardReaderRemoveEventProto, e: PCSCWatcherEvent) {
    return new cls(e.reader.name, !e.atr ? "unknown" : e.atr.toString("hex"));
  }

}
