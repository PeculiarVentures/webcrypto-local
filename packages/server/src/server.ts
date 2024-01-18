import * as core from "@webcrypto-local/core";
import * as proto from "@webcrypto-local/proto";
import { RemoteIdentity, Server, ServerOptions, Session } from "./connection";
import { WebCryptoLocalError } from "./error";
import { PCSCCard } from "./pcsc";
import { IProviderConfig } from "./provider";
import { CardReaderService } from "./services/card_reader";
import { ProviderService } from "./services/provider";

export interface IServerOptions extends ServerOptions {
  config: IProviderConfig;
  /**
   * Disables using of PCSC. No emit CardReader and Provider token events
   */
  disablePCSC?: boolean;
  /**
   * Prepares server for message handling (auth, validation, setup, etc.).
   */
  onMessagePrepare?: (session: Session, action: proto.ActionProto) => Promise<unknown>;
  /**
   * Performs post-processing tasks after server message handling.
   */
  onMessageResult?: (resolved: boolean, error?: Error) => unknown
}

/**
 * Local server
 *
 * @export
 * @class LocalServer
 * @extends {EventEmitter}
 */
export class LocalServer extends core.EventLogEmitter {

  public source = "server";

  /**
   * Server
   *
   * @type {Server}
   * @memberof LocalServer
   */
  public server: Server;
  public sessions: Session[] = [];

  public provider: ProviderService;
  public cardReader?: CardReaderService;

  private onMessagePrepareHandler: NonNullable<IServerOptions['onMessagePrepare']>;
  private onMessageResultHandler: NonNullable<IServerOptions['onMessageResult']>;

  constructor(options: IServerOptions) {
    super();

    this.server = new Server(options);
    this.onMessagePrepareHandler = options.onMessagePrepare || Promise.resolve;
    this.onMessageResultHandler = options.onMessageResult || function () { };

    if (!options.disablePCSC) {
      this.cardReader = new CardReaderService(this.server)
        .on("info", (level, source, message, data) => {
          this.emit("info", level, source, message, data);
        })
        .on("error", (e) => {
          this.emit("error", e);
        });
    } else {
      // Disable PCSC for provider too
      options.config.disablePCSC = true;
    }
    this.provider = new ProviderService(this.server, options.config)
      .on("info", (level, source, message, data) => {
        this.emit("info", level, source, message, data);
      })
      .on("error", (e) => {
        this.emit("error", e);
      })
      .on("notify", (e) => {
        this.emit("notify", e);
      })
      .on("token_new", (e) => {
        this.emit("token_new", e);
      });
  }

  public close(callback?: () => void) {
    if (this.cardReader) {
      this.cardReader.stop();
    }

    this.server.close(() => {
      this.provider.close();
      if (callback) {
        callback();
      }
    });

    return this;
  }

  public listen(address: string) {
    this.server
      .on("listening", (e) => {
        this.emit("listening", e.address);
        this.provider.open();
      })
      .on("connect", (session) => {
        this.log("info", "Create a new connection", {
          origin: session.origin,
        });
        // check connection in stack
        if (!(this.sessions.length && this.sessions.some((item) => item === session))) {
          this.log("info", "Push session to stack", {
            origin: session.origin,
          });
          this.sessions.push(session);
        }
      })
      .on("disconnect", (e) => {
        this.emit("error", {
          code: WebCryptoLocalError.CODE.WEBSOCKET_VANISHED,
          origin: e.remoteAddress,
          type: "ok"
        });
        // TODO: Remove closed session from `this.sessions`
        this.log("info", "Close session", {
          event: e.event,
          description: e.description,
          reasonCode: e.reasonCode,
          remoteAddress: e.remoteAddress,
        });
      })
      .on("info", (level, source, message, data) => {
        this.emit("info", level, source, message, data);
      })
      .on("error", (e) => {
        this.emit("error", e.error);
      })
      .on("message", (e) => {
        (async () => {
          await this.onMessagePrepareHandler(e.session, e.message);

          if (e.message.action === proto.ServerIsLoggedInActionProto.ACTION ||
            e.message.action === proto.ServerLoginActionProto.ACTION) {
            const onReject = (reason: Error) => {
              this.onMessageResultHandler(false, reason);
              e.reject(reason);
            };
            const onResolve = (reason: proto.ResultProto) => {
              this.onMessageResultHandler(true);
              e.resolve(reason);
            };

            this.onMessage(e.session, e.message)
              .then(onResolve, onReject)
          }
        })()
          .catch((error) => {
            e.reject(error);
            this.onMessageResultHandler(false, error);
            this.emit("error", error);
          });
      })
      .on("auth", (session) => {
        this.emit("info", "Server: session auth");
        this.server.send(session, new proto.ProviderAuthorizedEventProto())
          .catch((e) => {
            this.emit("error", e);
          });
      });

    this.server.listen(address);

    if (this.cardReader) {
      this.cardReader.start();
    }

    return this;
  }

  public on(event: "info", cb: core.LogHandler): this;
  public on(event: "token_new", cb: (info: PCSCCard) => void): this;
  public on(event: "listening", cb: (address: string) => void): this;
  public on(event: "error", cb: (err: Error) => void): this;
  public on(event: "close", cb: (e: any) => void): this;
  public on(event: "notify", cb: (e: any) => void): this;
  public on(event: "identity_changed", cb: () => void): this;
  public on(event: string, cb: (...args: any[]) => void) {
    return super.on(event, cb);
  }

  protected async onMessage(session: Session, action: proto.ActionProto) {
    const resultProto = new proto.ResultProto(action);

    let data: ArrayBuffer | undefined;
    switch (action.action) {
      // isLoggedIn
      case proto.ServerIsLoggedInActionProto.ACTION: {
        data = new Uint8Array([session.authorized ? 1 : 0]).buffer;
        break;
      }
      // login
      case proto.ServerLoginActionProto.ACTION: {
        if (!session.authorized) {
          // Session is not authorized
          // generate OTP
          if (!(session.identity && session.cipher)) {
            throw new Error("Session identity and cipher are not initialized");
          }
          const pin = await core.challenge(session.identity.signingKey.publicKey, session.cipher.remoteIdentity.signingKey);
          // Show notice
          const promise = new Promise<boolean>((resolve, reject) => {
            this.emit("notify", {
              type: "2key",
              origin: session.origin + ":" + session.port,
              pin,
              resolve,
              reject,
            });
          });
          const ok = await promise;
          if (ok) {
            const remoteIdentity: RemoteIdentity = session.cipher.remoteIdentity;
            remoteIdentity.origin = session.origin;
            remoteIdentity.userAgent = session.headers["user-agent"];
            this.server.storage.saveRemoteIdentity(session.cipher.remoteIdentity.signingKey.id, remoteIdentity);
            this.emit("identity_changed");
            session.authorized = true;
          } else {
            throw new WebCryptoLocalError(WebCryptoLocalError.CODE.RATCHET_KEY_NOT_APPROVED);
          }
        }
        break;
      }
      default:
        throw new WebCryptoLocalError(`Action '${action.action}' is not implemented`);
    }
    resultProto.data = data;
    return resultProto;
  }

}
