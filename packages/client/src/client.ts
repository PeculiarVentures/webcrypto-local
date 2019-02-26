import * as Proto from "@webcrypto-local/proto";
import { EventEmitter } from "events";
import { CardReader } from "./card_reader";
import { Client } from "./connection";
import { RatchetStorage } from "./connection/storages";
import { SocketCrypto } from "./crypto";

export interface SocketProviderOptions {
  /**
   * Ratchet identity storage
   */
  storage: RatchetStorage;
}

/**
 * Implementation of WebCrypto interface
 * - `getRandomValues` native implementation
 * - Symmetric cryptography uses native implementation
 * - Asymmetric cryptography uses calls to Server
 */
export class SocketProvider extends EventEmitter {

  public client: Client;

  public get state() {
    return this.client.state;
  }

  public cardReader: CardReader;

  constructor(options: SocketProviderOptions) {
    super();

    this.client = new Client(options.storage);
    this.cardReader = new CardReader(this.client);
  }

  /**
   * Connects to Service
   * Steps:
   * 1. Requests info data from Server
   * - if server not found emits `error`
   * 2. Create 2key-ratchet session from PreKeyBundle
   */
  public connect(address: string): this {
    this.removeAllListeners();
    this.client.connect(address)
      .on("error", (e) => {
        this.emit("error", e.error);
      })
      .on("event", (proto) => {
        (async () => {
          switch (proto.action) {
            case Proto.ProviderTokenEventProto.ACTION: {
              const tokenProto = await Proto.ProviderTokenEventProto.importProto(await proto.exportProto());
              this.emit("token", tokenProto);
            }
            case Proto.ProviderAuthorizedEventProto.ACTION: {
              const authProto = await Proto.ProviderAuthorizedEventProto.importProto(await proto.exportProto());
              this.emit("auth", authProto);
            }
            default:
          }
        })();
      })
      .on("listening", (e) => {
        // if ((self as any).PV_WEBCRYPTO_SOCKET_LOG) {
        //   console.info("Client:Listening", e.address);
        // }
        this.emit("listening", address);
      })
      .on("close", (e) => {
        // if ((self as any).PV_WEBCRYPTO_SOCKET_LOG) {
        //   console.info(`Client:Closed: ${e.description} (code: ${e.reasonCode})`);
        // }
        this.emit("close", e.remoteAddress);
      });

    return this;
  }

  /**
   * Close connection
   */
  public close() {
    this.client.close();
  }

  public on(event: string | symbol, listener: (...args: any[]) => void) {
    return super.on(event, listener);
  }

  public once(event: string | symbol, listener: (...args: any[]) => void) {
    return super.once(event, listener);
  }

  public async info() {
    const proto = new Proto.ProviderInfoActionProto();
    const result = await this.client.send(proto);

    const infoProto = await Proto.ProviderInfoProto.importProto(result);
    return infoProto;
  }

  public async challenge() {
    return this.client.challenge();
  }

  public async isLoggedIn() {
    return this.client.isLoggedIn();
  }

  public async login() {
    return this.client.login();
  }

  public async getCrypto(cryptoID: string) {
    const actionProto = new Proto.ProviderGetCryptoActionProto();
    actionProto.cryptoID = cryptoID;

    await this.client.send(actionProto);

    return new SocketCrypto(this.client, cryptoID);
  }

}
