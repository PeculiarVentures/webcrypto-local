import { Client } from "../client";
import { ClientEvent } from "./base";

export class ClientErrorEvent extends ClientEvent {
  public error: Error;
  constructor(target: Client, error: Error) {
    super(target, "error");
    this.error = error;
  }
}
