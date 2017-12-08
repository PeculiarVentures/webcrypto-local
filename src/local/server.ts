import { EventEmitter } from "events";
import * as https from "https";
import { challenge } from "../connection/challenge";
import { Server, Session } from "../connection/server";
import { RemoteIdentityEx } from "../connection/storages/ossl";
import { ActionProto, ResultProto, ServerIsLoggedInActionProto, ServerLoginActionProto } from "../core/proto";
import { ProviderAuthorizedEventProto } from "../core/protos/provider";
import { WebCryptoLocalError } from "./error";
import { PCSCCard } from "./pcsc_watcher";
import { IProviderConfig } from "./provider";
import { CardReaderService } from "./services/card_reader";
import { ProviderService } from "./services/provider";

export interface IServerOptions extends https.ServerOptions {
    config: IProviderConfig;
}

/**
 * Local server
 *
 * @export
 * @class LocalServer
 * @extends {EventEmitter}
 */
export class LocalServer extends EventEmitter {

    /**
     * Server
     *
     * @type {Server}
     * @memberof LocalServer
     */
    public server: Server;
    public sessions: Session[] = [];

    public provider: ProviderService;
    public cardReader: CardReaderService;

    constructor(options: IServerOptions) {
        super();

        this.server = new Server(options);

        this.cardReader = new CardReaderService(this.server)
            .on("info", (e) => {
                this.emit("info", e);
            })
            .on("error", (e) => {
                this.emit("error", e);
            });
        this.provider = new ProviderService(this.server, options.config)
            .on("info", (e) => {
                this.emit("info", e);
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
        this.server.close(() => {
            this.provider.close();
            if (callback) {
                callback();
            }
        });
    }

    public listen(address: string) {
        this.server.listen(address);
        this.server
            .on("listening", (e) => {
                this.emit("listening", e.address);
                this.provider.open();
            })
            .on("connect", (session) => {
                this.emit("info", `Server: New session connect ${session.connection.remoteAddress}`);
                // check connection in stack
                if (!(this.sessions.length && this.sessions.some((item) => item === session))) {
                    this.emit("info", `Server: Push session to stack`);
                    this.sessions.push(session);
                }
            })
            .on("disconnect", (e) => {
                // TODO: Remove closed session from `this.sessions`
                this.emit("info", `Server: Close session ${e.description} (code: ${e.reasonCode})`);
            })
            .on("info", (message) => {
                this.emit("info", message);
            })
            .on("error", (e) => {
                this.emit("error", e.error);
            })
            .on("message", (e) => {
                (async () => {
                    if (e.message.action === ServerIsLoggedInActionProto.ACTION ||
                        e.message.action === ServerLoginActionProto.ACTION) {
                        this.onMessage(e.session, e.message)
                            .then(e.resolve, e.reject);
                    }
                })()
                    .catch((error) => {
                        this.emit("error", error);
                    });
            })
            .on("auth", (session) => {
                this.emit("info", "Server: session auth");
                this.server.send(session, new ProviderAuthorizedEventProto())
                    .catch((e) => {
                        this.emit("error", e);
                    });
            });
        return this;
    }

    public on(event: "info", cb: (message: string) => void): this;
    public on(event: "token_new", cb: (info: PCSCCard) => void): this;
    public on(event: "listening", cb: (address: string) => void): this;
    public on(event: "error", cb: (err: Error) => void): this;
    public on(event: "close", cb: (e: any) => void): this;
    public on(event: "notify", cb: (e: any) => void): this;
    public on(event: string, cb: (...args: any[]) => void) {
        return super.on(event, cb);
    }

    protected async onMessage(session: Session, action: ActionProto) {
        const resultProto = new ResultProto(action);

        let data: ArrayBuffer | undefined;
        switch (action.action) {
            // isLoggedIn
            case ServerIsLoggedInActionProto.ACTION: {
                data = new Uint8Array([session.authorized ? 1 : 0]).buffer;
                break;
            }
            // login
            case ServerLoginActionProto.ACTION: {
                if (!session.authorized) {
                    // Session is not authorized
                    // generate OTP
                    const pin = await challenge(this.server.identity.signingKey.publicKey, session.cipher.remoteIdentity.signingKey);
                    // Show notice
                    const promise = new Promise<boolean>((resolve, reject) => {
                        this.emit("notify", {
                            type: "2key",
                            origin: session.headers.origin,
                            pin,
                            resolve,
                            reject,
                        });
                    });
                    const ok = await promise;
                    if (ok) {
                        const remoteIdentityEx: RemoteIdentityEx = session.cipher.remoteIdentity;
                        remoteIdentityEx.origin = session.headers.origin;
                        remoteIdentityEx.userAgent = session.headers["user-agent"];
                        this.server.storage.saveRemoteIdentity(session.cipher.remoteIdentity.signingKey.id, remoteIdentityEx);
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
