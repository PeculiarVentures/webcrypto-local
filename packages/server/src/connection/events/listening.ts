import { Server } from "../server";
import { ServerEvent } from "./base";

export class ServerListeningEvent extends ServerEvent {

  public address: string;

  constructor(target: Server, address: string) {
    super(target, "listening");
    this.address = address;
  }
}
