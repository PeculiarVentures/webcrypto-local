import * as proto from "@webcrypto-local/proto";
import { Server, Session } from "../server";
import { ServerEvent } from "./base";

export class ServerMessageEvent extends ServerEvent {

  public message: proto.ActionProto;
  public session: Session;
  public resolve: (result: proto.ResultProto) => void;
  public reject: (error: Error) => void;

  constructor(target: Server, session: Session, message: proto.ActionProto, resolve: () => void, reject: (error: Error) => void) {
    super(target, "message");
    this.message = message;
    this.session = session;
    this.resolve = resolve;
    this.reject = reject;
  }
}
