import { Client } from "../client";
import { ClientEvent } from "./base";

export class ClientCloseEvent extends ClientEvent {
  public remoteAddress: string;
  public reasonCode: number;
  public description: string;
  constructor(target: Client, remoteAddress: string, reasonCode: number, description: string) {
    super(target, "close");
    this.remoteAddress = remoteAddress;
    this.reasonCode = reasonCode;
    this.description = description;
  }
}
