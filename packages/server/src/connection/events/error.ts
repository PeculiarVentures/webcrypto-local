import { Server } from "../server";
import { ServerEvent } from "./base";

export class ServerErrorEvent extends ServerEvent {

  public error: Error;

  constructor(target: Server, error: Error) {
    super(target, "error");
    this.error = error;
  }
}
