import { Server } from "../server";
import { ServerEvent } from "./base";

export class ServerDisconnectEvent extends ServerEvent {

  public remoteAddress: string;
  public reasonCode: number;
  public description: string;

  constructor(target: Server, remoteAddress: string, reasonCode: number, description: string) {
    super(target, "close");
    this.remoteAddress = remoteAddress;
    this.reasonCode = reasonCode;
    this.description = description;
  }
}
