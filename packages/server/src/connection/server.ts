import * as ratchet from "2key-ratchet";
import * as core from "@webcrypto-local/core";
import * as proto from "@webcrypto-local/proto";
import * as http from "http";
import * as https from "https";
import { ServerOptions as HttpsServerOptions } from "https";
import { assign, Convert } from "pvtsutils";
import { ObjectProto } from "tsprotobuf";
import * as url from "url";
import * as WebSocket from "ws";
import { WebCryptoLocalError } from "../error";
import * as events from "./events";
import { RatchetStorage } from "./storages";

export interface ServerOptions extends HttpsServerOptions {
  storage: RatchetStorage;
}

type AlgorithmUsageType = "generateKey" | "importKey" | "exportKey" | "sign" | "verify" | "deriveKey" | "deriveBits" | "encrypt" | "decrypt" | "wrapKey" | "unwrapKey" | "digest";

interface WebCryptoProviderAlgorithm {
  name: string;
  usages: AlgorithmUsageType[];
}

interface WebCryptoProvider {
  name: string;
  algorithms: WebCryptoProviderAlgorithm[];
}

type Base64String = string;
type ProtobufString = Base64String;

export interface ServerInfo {
  version: string;
  name: string;
  preKey: ProtobufString;
  providers?: WebCryptoProvider[];
}

export interface Session {
  origin: string;
  port: number;
  headers: any;
  connection: WebSocket;
  identity?: ratchet.Identity;
  cipher?: ratchet.AsymmetricRatchet;
  authorized: boolean;
}

/**
 * Https/wss server based on 2key-ratchet protocol
 * - generates Identity
 * - store makes PreKey bundle
 * - Stores secure sessions
 *
 * @export
 * @class Server
 * @extends {EventEmitter}
 */
export class Server extends core.EventLogEmitter {

  public source = "server";

  public info: ServerInfo = {
    version: require(`@webcrypto-local/server/package.json`).version,
    name: "webcrypto-socket",
    preKey: "",
    providers: [
      {
        algorithms: [
          { name: "RSASSA-PKCS1-v1_5", usages: ["generateKey", "exportKey", "importKey", "sign", "verify"] },
          { name: "RSA-OAEP", usages: ["generateKey", "exportKey", "importKey", "encrypt", "decrypt", "wrapKey", "unwrapKey"] },
          { name: "RSA-PSS", usages: ["generateKey", "exportKey", "importKey", "sign", "verify"] },
          { name: "ECDSA", usages: ["generateKey", "exportKey", "importKey", "sign", "verify"] },
          { name: "ECDH", usages: ["generateKey", "exportKey", "importKey", "deriveKey", "deriveBits"] },
          { name: "AES-CBC", usages: ["generateKey", "exportKey", "importKey", "encrypt", "decrypt", "wrapKey", "unwrapKey"] },
          { name: "AES-GCM", usages: ["generateKey", "exportKey", "importKey", "encrypt", "decrypt", "wrapKey", "unwrapKey"] },
          { name: "AES-KW", usages: ["generateKey", "exportKey", "importKey", "wrapKey", "unwrapKey"] },
          { name: "SHA-1", usages: ["digest"] },
          { name: "SHA-256", usages: ["digest"] },
          { name: "SHA-384", usages: ["digest"] },
          { name: "SHA-512", usages: ["digest"] },
          { name: "PBKDF2", usages: ["generateKey", "importKey", "deriveKey", "deriveBits"] },
        ],
        name: "OpenSSL",
      },
    ],
  };

  /**
   * Storage for 2key-ratchet identifiers
   */
  public storage: RatchetStorage;
  public sessions: Session[] = [];

  protected httpServer!: https.Server;
  protected socketServer!: WebSocket.Server;
  protected options: HttpsServerOptions;

  constructor(options: ServerOptions) {
    super();

    this.options = options;

    this.storage = options.storage;
  }

  public emit(event: "auth", session: Session): boolean;
  public emit(event: "listening", e: events.ServerListeningEvent): boolean;
  public emit(event: "connect", e: Session): boolean;
  public emit(event: "disconnect", e: events.ServerDisconnectEvent): boolean;
  public emit(event: "error", e: events.ServerErrorEvent): boolean;
  public emit(event: "message", e: events.ServerMessageEvent): boolean;
  public emit(event: "info", level: core.LogLevel, source: string, message: string, data?: core.LogData): boolean;
  public emit(event: string | symbol, ...args: any[]): boolean {
    return super.emit(event, ...args);
  }

  public on(event: "auth", listener: (session: Session) => void): this;
  public on(event: "listening", listener: (e: events.ServerListeningEvent) => void): this;
  public on(event: "connect", listener: (e: Session) => void): this;
  public on(event: "disconnect", listener: (e: events.ServerDisconnectEvent) => void): this;
  public on(event: "error", listener: (e: events.ServerErrorEvent) => void): this;
  public on(event: "message", listener: (e: events.ServerMessageEvent) => void): this;
  public on(event: "info", listener: core.LogHandler): this;
  public on(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(event, listener);
  }

  public once(event: "auth", listener: (session: Session) => void): this;
  public once(event: "listening", listener: (e: events.ServerListeningEvent) => void): this;
  public once(event: "connect", listener: (e: Session) => void): this;
  public once(event: "disconnect", listener: (e: events.ServerDisconnectEvent) => void): this;
  public once(event: "error", listener: (e: events.ServerErrorEvent) => void): this;
  public once(event: "message", listener: (e: events.ServerMessageEvent) => void): this;
  public once(event: "info", listener: core.LogHandler): this;
  public once(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.once(event, listener);
  }

  public close(callback?: () => void) {
    this.socketServer.close(() => {
      this.httpServer.close(callback);
    });
    return this;
  }

  public listen(address: string) {
    this.httpServer = https.createServer(this.options, (request: http.IncomingMessage, response: http.ServerResponse) => {
      (async () => {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Request-Method", "*");
        response.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
        response.setHeader("Access-Control-Allow-Headers", "*");
        if (request.method === "OPTIONS") {
          response.writeHead(200);
          response.end();
          return;
        }
        if (request.method === "GET") {
          if (!request.url) {
            throw new Error("Cannot parse URL from Response");
          }
          const requestUrl = url.parse(request.url);
          if (requestUrl.pathname === core.SERVER_WELL_KNOWN) {
            const bundle = await this.getRandomBundle(getOrigin(request));
            const preKey = Convert.ToBase64(bundle);
            // console.log("Server info", preKey);
            const info = assign({}, this.info, { preKey });
            const json = JSON.stringify(info);
            response.setHeader("content-length", json.length.toString());
            response.end(json);
          }
        }
        response.end();
      })()
        .catch((err) => {
          this.emit("error", new events.ServerErrorEvent(this, err));
        });
    });

    const splitAddress = address.split(":");
    this.httpServer
      .listen(parseInt(splitAddress[1], 10), splitAddress[0], () => {
        (async () => {
          this.emit("listening", new events.ServerListeningEvent(this, address));
        })();
      })
      .on("error", (err) => {
        this.emit("error", new events.ServerErrorEvent(this, err));
      });

    this.socketServer = new WebSocket.Server({
      server: this.httpServer,
      maxPayload: 128 * 1024 * 1024,    // 128 Mib
    });

    this.socketServer.on("connection", (ws: WebSocket, request) => {
      const session: Session = {
        // TODO agent: request.headers
        origin: getOrigin(request),
        port: request.socket.remotePort || 443,
        headers: request.headers,
        connection: ws,
        authorized: false,
      };
      this.sessions.push(session);
      this.emit("connect", session);
      ws.on("message", (message) => {
        if (Buffer.isBuffer(message) || message instanceof ArrayBuffer) {
          (async () => {
            const buffer = new Uint8Array(message).buffer;
            let messageProto: ratchet.MessageSignedProtocol;
            try {
              messageProto = await ratchet.MessageSignedProtocol.importProto( buffer);
            } catch (err) {
              try {
                this.log("warn", "Cannot parse MessageSignedProtocol");
                const preKeyProto = await ratchet.PreKeyMessageProtocol.importProto(buffer);
                messageProto = preKeyProto.signedMessage;
                session.identity = await this.storage.getIdentity(session.origin);
                session.cipher = await ratchet.AsymmetricRatchet.create(session.identity, preKeyProto);

                // check remote identity
                const ok = await this.storage.isTrusted(session.cipher.remoteIdentity);
                if (!ok) {
                  session.authorized = false;
                  // await this.storage.saveRemoteIdentity(session.cipher.remoteIdentity.signingKey.id, session.cipher.remoteIdentity);
                } else {
                  session.authorized = true;
                  await this.storage.saveSession(session.cipher.remoteIdentity.signingKey.id, session.cipher);
                }

                const sessionIdentitySHA256 = await session.cipher.remoteIdentity.signingKey.thumbprint();
                this.log("info", "Initialize secure session", {
                  origin: session.origin,
                  session: sessionIdentitySHA256,
                  authorized: session.authorized,
                });
              } catch (err) {
                throw err;
              }
            }
            if (!session.cipher) {
              throw new WebCryptoLocalError(WebCryptoLocalError.CODE.SERVER_WRONG_MESSAGE, "Cipher object for 2key session is empty");
              // session.cipher = await this.storage.loadSession(messageProto.senderKey.id);
            }

            // decrypt
            const decryptedMessage = await session.cipher.decrypt(messageProto);
            const actionProto = await proto.ActionProto.importProto(decryptedMessage);

            return new Promise<proto.ResultProto>((resolve, reject) => {
              if (
                session.authorized ||
                actionProto.action === proto.ServerIsLoggedInActionProto.ACTION ||
                actionProto.action === proto.ServerLoginActionProto.ACTION
              ) {
                (async () => {
                  if (!session.cipher) {
                    throw new Error("Session cipher was not initialized yet");
                  }
                  const sessionIdentitySHA256 = await session.cipher.remoteIdentity.signingKey.thumbprint();
                  if (new RegExp("^crypto\/").test(actionProto.action)) {
                    const cryptoActionProto = await proto.CryptoActionProto.importProto(actionProto);
                    this.log("info", "Run action", {
                      session: sessionIdentitySHA256,
                      action: actionProto.action,
                      provider: cryptoActionProto.providerID,
                    });
                  } else {
                    this.log("info", "Run action", {
                      session: sessionIdentitySHA256,
                      action: actionProto.action,
                    });
                  }
                  this.emit("message", new events.ServerMessageEvent(this, session, actionProto, resolve as any, reject));
                })()
                  .catch((err) => {
                    this.emit("error", err);
                  });
              } else {
                // If session is not authorized throw error
                throw new WebCryptoLocalError(WebCryptoLocalError.CODE.SERVER_NOT_LOGGED_IN, "404: Not authorized");
              }
            })
              .then((answer) => {
                answer.status = true;
                return this.send(session, answer);
              })
              .catch((e) => {
                (async () => {
                  const resultProto = new proto.ResultProto(actionProto);
                  this.emit("error", new events.ServerErrorEvent(this, e));
                  if (e) {
                    if (e.hasOwnProperty("code")) {
                      resultProto.error = new proto.ErrorProto(e.message, e.code, e.type || "error");
                    } else {
                      // NOTE: Some errors can have simple text format
                      resultProto.error = createError(e.message || e.toString());
                    }
                  } else {
                    resultProto.error = createError("Empty exception");
                  }
                  resultProto.status = false;

                  this.send(session, resultProto);
                })();
              });
          })().catch((e) => {
            this.emit("error", new events.ServerErrorEvent(this, e));
          });
        } else {
          this.emit(
            "error",
            new events.ServerErrorEvent(
              this,
              new WebCryptoLocalError(WebCryptoLocalError.CODE.SERVER_WRONG_MESSAGE, `Received message is not Buffer or ArrayBuffer`),
            ),
          );
        }
      });
      ws.on("close", (reasonCode, description) => {
        // remove session from list with the same connection
        this.sessions = this.sessions.filter((session2) => session2.connection !== ws);

        this.emit("disconnect", new events.ServerDisconnectEvent(
          this,
          session.origin + ":" + session.port,
          reasonCode,
          description,
        ));
      });
    });

    return this;
  }

  public async send(session: Session, data: ObjectProto | ArrayBuffer) {
    try {
      let buf: ArrayBuffer;
      if (data instanceof ArrayBuffer) {
        buf = data;
      } else {
        buf = await data.exportProto();
      }
      // encrypt data
      if (!session.cipher) {
        throw new Error("Session cipher was not initialized yet");
      }
      const encryptedData = await session.cipher.encrypt(buf);
      buf = await encryptedData.exportProto();
      session.connection.send(Buffer.from(buf));
    } catch (e) {
      this.emit("error", e);
    }
  }

  /**
   * create PreKeyBundle with random SignedPreKey and returns it as ArrayBuffer
   */
  protected async getRandomBundle(origin: string) {
    const preKeyBundle = new ratchet.PreKeyBundleProtocol();
    const identity = await this.storage.getIdentity(origin);
    await preKeyBundle.identity.fill(identity);
    const preKeyId = getRandomInt(1, identity.signedPreKeys.length) - 1;
    const preKey = identity.signedPreKeys[preKeyId];
    preKeyBundle.preKeySigned.id = preKeyId;
    preKeyBundle.preKeySigned.key = preKey.publicKey;
    await preKeyBundle.preKeySigned.sign(identity.signingKey.privateKey);
    preKeyBundle.registrationId = 0;
    const raw = await preKeyBundle.exportProto();
    return raw;
  }

}

/**
 * Returns random integer number [min, max]
 */
function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
}

function createError(message: string) {
  const p11Reg = /(CKR_\w+):(\d+)/;
  const p11 = p11Reg.exec(message);
  if (p11) {
    return new proto.ErrorProto(p11[1], parseInt(p11[2], 10), "pkcs11");
  } else {
    return new proto.ErrorProto(message);
  }
}

function getOrigin(request: http.IncomingMessage) {
  let origin = request.headers.origin as string;
  if (!origin || !/^https:\/\//.test(origin)) {
    origin = request.connection.remoteAddress || "UNKNOWN";
  }
  return origin;
}
