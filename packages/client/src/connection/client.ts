import * as ratchet from "2key-ratchet";
import * as core from "@webcrypto-local/core";
import * as proto from "@webcrypto-local/proto";
import { EventEmitter } from "events";
import fetch from "node-fetch";
import { Convert } from "pvtsutils";
import WebSocket from "ws";
import { CryptoServerError } from "../errors";
import * as events from "./events";
import { RatchetStorage } from "./storages";

export interface PromiseStackItem {
  resolve: (...args: any[]) => void;
  reject: (...args: any[]) => void;
}

export enum SocketCryptoState {
  connecting = 0,
  open = 1,
  closing = 2,
  closed = 3,
}

/**
 * Implementation of WebCrypto interface
 * - `getRandomValues` native implementation
 * - Symmetric cryptography uses native implementation
 * - Asymmetric cryptography uses calls to Server
 */
export class Client extends EventEmitter {

  public serviceInfo?: core.ServerInfo;
  public stack: { [key: string]: PromiseStackItem } = {};

  public get state(): SocketCryptoState {
    if (this.socket) {
      return this.socket.readyState;
    } else {
      return SocketCryptoState.closed;
    }
  }

  /**
   * double ratchet session
   */
  protected cipher?: ratchet.AsymmetricRatchet;
  protected socket?: WebSocket;
  protected messageCounter = 0;
  protected storage: RatchetStorage;

  constructor(storage: RatchetStorage) {
    super();

    this.storage = storage;
  }

  /**
   * Connects to Service
   * Steps:
   * 1. Requests info data from Server
   * - if server not found emits `error`
   * 2. Create 2key-ratchet session from PreKeyBundle
   */
  public connect(address: string, options?: WebSocket.ClientOptions): this {
    this.getServerInfo(address)
      .then((info) => {
        this.serviceInfo = info;
        const url = `wss://${address}`;
        this.socket = options
          ? new WebSocket(url, undefined, options)
          : new WebSocket(url);
        this.socket.binaryType = "arraybuffer";
        this.socket.onerror = (e: any) => {
          this.emit("error", new events.ClientErrorEvent(this, e.error));
        };
        this.socket.onopen = () => {
          (async () => {
            let identity = await this.storage.loadIdentity();
            if (!identity) {
              // if ((self as any).PV_WEBCRYPTO_SOCKET_LOG) {
              //   console.info("Generates new identity");
              // }
              identity = await ratchet.Identity.create(1);
              await this.storage.saveIdentity(identity);
            }
            const remoteIdentityId = "0";
            const bundle = await ratchet.PreKeyBundleProtocol.importProto(Convert.FromBase64(info.preKey));
            this.cipher = await ratchet.AsymmetricRatchet.create(identity, bundle);
            // save new remote identity
            await this.storage.saveRemoteIdentity(remoteIdentityId, this.cipher.remoteIdentity);

            this.emit("listening", new events.ClientListeningEvent(this, address));
          })().catch((error) => this.emit("error", new events.ClientErrorEvent(this, error)));
        };
        this.socket.onclose = (e) => {
          for (const actionId in this.stack) {
            const message = this.stack[actionId];
            message.reject(new Error("Cannot finish operation. Session was closed"));
          }
          this.emit("close", new events.ClientCloseEvent(this, address, e.code, e.reason));
        };
        this.socket.onmessage = (e) => {
          if (e.data instanceof ArrayBuffer) {
            // decrypt
            ratchet.MessageSignedProtocol.importProto(e.data)
              .then((proto2) => {
                if (!this.cipher) {
                  throw new Error("Client cipher is not initialized");
                }
                return this.cipher.decrypt(proto2);
              })
              .then((msg) => {
                this.onMessage(msg);
              })
              .catch((err) => {
                this.emit("error", new events.ClientErrorEvent(this, err));
              });
          }
        };
      })
      .catch((err) => {
        this.emit("error", new events.ClientErrorEvent(this, err));
      });

    return this;
  }
  /**
   * Close connection
   */
  public close() {
    if (this.socket) {
      this.socket.close();
    }
  }

  public on(event: "event", listener: (e: proto.ActionProto) => void): this;
  public on(event: "listening", listener: (e: events.ClientListeningEvent) => void): this;
  public on(event: "close", listener: (e: events.ClientCloseEvent) => void): this;
  public on(event: "error", listener: (e: events.ClientErrorEvent) => void): this;
  public on(event: string | symbol, listener: (...args: any[]) => void) {
    return super.on(event, listener);
  }

  public once(event: "listening", listener: (e: events.ClientListeningEvent) => void): this;
  public once(event: "close", listener: (e: events.ClientCloseEvent) => void): this;
  public once(event: "error", listener: (e: events.ClientErrorEvent) => void): this;
  public once(event: string | symbol, listener: (...args: any[]) => void): this;
  public once(event: string | symbol, listener: (...args: any[]) => void) {
    return super.once(event, listener);
  }

  /**
   * Return PIN for current session
   *
   * @returns
   *
   * @memberOf Client
   */
  public async challenge() {
    if (!this.cipher) {
      throw new Error("Client cipher is not initialized");
    }
    return core.challenge(this.cipher.remoteIdentity.signingKey, this.cipher.identity.signingKey.publicKey);
  }

  /**
   * Returns true if session is authorized
   *
   *
   * @memberOf Client
   */
  public async isLoggedIn() {
    const action = new proto.ServerIsLoggedInActionProto();

    const data = await this.send(action);
    return data ? !!(new Uint8Array(data)[0]) : false;
  }

  /**
   * Request session authentication
   *
   *
   * @memberOf Client
   */
  public async login() {
    const action = new proto.ServerLoginActionProto();

    await this.send(action);
  }

  /**
   * Sends and receives
   */
  public send(data?: proto.ActionProto): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      this.checkSocketState();
      if (!data) {
        data = new proto.ActionProto();
      }
      data.action = data.action;
      data.actionId = (this.messageCounter++).toString();
      data.exportProto()
        .then((raw) => {
          // encrypt data
          if (!this.cipher) {
            throw new Error("Client cipher is not initialized");
          }
          return this.cipher.encrypt(raw)
            .then((msg) => msg.exportProto());
        })
        .then((raw) => {
          // console.log(Convert.ToBinary(raw));
          if (!this.socket) {
            throw new Error("Client socket is not initialized");
          }
          this.stack[data!.actionId] = { resolve, reject };
          this.socket.send(raw);
        })
        .catch(reject);
    });
  }

  /**
   * Sends Request to server and gets info about server and PreKeyBundle data for DKeyRatchet connection
   */
  protected async getServerInfo(address: string): Promise<core.ServerInfo> {
    const url = `https://${address}${core.SERVER_WELL_KNOWN}`;
    const response = await fetch(url);
    if (response.status !== 200) {
      throw new Error("Cannot get wellknown link");
    } else {
      const json = await response.json();
      return json;
    }
  }

  protected checkSocketState() {
    if (this.state !== SocketCryptoState.open) {
      throw new Error("Socket connection is not open");
    }
  }

  protected async onMessage(message: ArrayBuffer) {
    const p = await proto.ActionProto.importProto(message);
    // if ((self as any).PV_WEBCRYPTO_SOCKET_LOG) {
    //   console.info("Action:", p.action);
    // }
    // find Promise
    const promise = this.stack[p.actionId];
    if (promise) {
      delete this.stack[p.actionId];
      const messageProto = await proto.ResultProto.importProto(await p.exportProto());
      if (messageProto.error && messageProto.error.message) {
        const errorProto = messageProto.error;
        const error = new CryptoServerError(errorProto);
        promise.reject(error);
      } else {
        promise.resolve(messageProto.data);
      }
    } else {
      this.emit("event", p);
    }
  }

}
