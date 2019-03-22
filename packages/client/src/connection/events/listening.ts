import { Client } from "../client";
import { ClientEvent } from "./base";

export class ClientListeningEvent extends ClientEvent {

  public readonly address: string;

  constructor(target: Client, address: string) {
    super(target, "listening");
    this.address = address;
  }
}
