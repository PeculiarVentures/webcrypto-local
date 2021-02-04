import * as core from "@webcrypto-local/core";
import * as proto from "@webcrypto-local/proto";
import { Crypto, CryptoKey, Pkcs11KeyAlgorithm } from "node-webcrypto-p11";

import { Server, Session } from "../connection";

/**
 * Base class for services
 * NOTE: Each object must have info, error events
 */
export abstract class Service<T extends core.EventLogEmitter> extends core.EventLogEmitter {

  public object: T;
  public server: Server;
  public services: Service<any>[] = [];
  public source = "server-api";

  /**
   * Service constructor
   * @param server WebSocket server
   * @param object Wrapped object
   * @param filter List of actions which must be implemented
   */
  constructor(server: Server, object: T, filter: typeof proto.ActionProto[] = []) {
    super();

    this.server = server;
    this.object = object;

    //#region Connect to events

    //#region Server
    this.server
      .on("message", (e) => {
        if (filter.some((item) => item.ACTION === e.message.action)) {
          this.onMessage(e.session, e.message)
            .then(e.resolve, e.reject);
        }
      });
    //#endregion

    //#region Object
    if (!(this.object instanceof Service)) {
      this.object
        .on("info", (level, source, message, data) => {
          this.emit("info", level, source, message, data);
        })
        .on("error", (error: Error) => {
          this.emit("error", error);
        });
    }
    //#endregion

    //#endregion

  }

  public addService(service: Service<any>) {
    this.services.push(service);

    service
      .on("info", (level, source, message, data) => {
        this.emit("info", level, source, message, data);
      })
      .on("error", (error: Error) => {
        this.emit("error", error);
      });
  }

  public emit(event: "error", error: Error): boolean;
  public emit(event: "info", level: core.LogLevel, source: string, message: string, data?: core.LogData): boolean;
  public emit(event: string, ...args: any[]): boolean;
  public emit(event: string, ...args: any[]): boolean {
    return super.emit(event, ...args);
  }

  public on(event: "error", cb: (error: Error) => void): this;
  public on(event: "info", cb: core.LogHandler): this;
  public on(event: string, cb: (...args: any[]) => void): this;
  public on(event: string, cb: (...args: any[]) => void): this {
    return super.on(event, cb);
  }

  public once(event: "error", cb: (error: Error) => void): this;
  public once(event: "info", cb: core.LogHandler): this;
  public once(event: string, cb: (...args: any[]) => void): this;
  public once(event: string, cb: (...args: any[]) => void): this {
    return super.once(event, cb);
  }

  protected abstract onMessage(session: Session, action: proto.ActionProto): Promise<proto.ResultProto>;

  protected logKeyAlgorithm(algorithm: Algorithm | RsaHashedKeyGenParams | EcKeyGenParams | Pkcs11KeyAlgorithm) {
    const alg: any = {};
    alg.name = algorithm.name;
    if ("hash" in algorithm && algorithm.hash && typeof algorithm.hash !== "string" && algorithm.hash.name) {
      alg.hash = algorithm.hash.name;
    }
    if ("namedCurve" in algorithm && algorithm.namedCurve) {
      alg.namedCurve = algorithm.namedCurve;
    }
    if ("token" in algorithm && algorithm.token !== undefined) {
      alg.token = algorithm.token;
    }
    if ("sensitive" in algorithm && algorithm.sensitive !== undefined) {
      alg.sensitive = algorithm.sensitive;
    }
    if ("label" in algorithm && algorithm.label) {
      alg.label = algorithm.label;
    }

    return alg;
  }

  protected logAlgorithm(algorithm: Algorithm & { hash?: Algorithm; }) {
    const alg: any = {};
    alg.name = algorithm.name;
    if ("hash" in algorithm && algorithm.hash && typeof algorithm.hash !== "string" && algorithm.hash.name) {
      alg.hash = algorithm.hash.name;
    }

    return alg;
  }

  protected logCryptoKey(key: CryptoKey) {
    const res: any = {
      algorithm: this.logKeyAlgorithm(key.algorithm),
      type: key.type,
      extractable: key.extractable,
      usages: key.usages,
    };

    if ("key" in key) {
      try {
        res.id = (key as any).key.id.toString("hex");
      } catch {
        // nothing
      }
    }

    return res;
  }

  protected logCrypto(crypto: Crypto) {
    const res = crypto.info.name;

    return res;
  }

}
