import { EventEmitter } from "events";
import { Server, Session } from "../connection/server";
import { ActionProto, ResultProto } from "../core/proto";
import { ProviderAuthorizedEventProto, ProviderCryptoProto, ProviderInfoActionProto, ProviderTokenEventProto } from "../core/protos/provider";
import { LocalProvider } from "./provider";

export class LocalServer extends EventEmitter {

    public server: Server;
    public provider: LocalProvider;
    public sessions: Session[] = [];

    constructor() {
        super();

        this.server = new Server();
        this.provider = new LocalProvider({
            pkcs11: [
                "/usr/local/lib/softhsm/libsofthsm2.so",
                // "/usr/local/lib/libykcs11.dylib",
            ],
        });

        this.provider
            .on("token", (info) => {
                console.log("Provider:Token raised");
                this.sessions.forEach((session) => {
                    if (session.cipher && session.authorized) {
                        // info.added = info.added.map((item) => new ProviderCryptoProto(item)) || [];
                        // info.removed = info.removed.map((item) => new ProviderCryptoProto(item)) || [];
                        info.removed.forEach((item, index) => {
                            info.removed[index] = new ProviderCryptoProto(item);
                        });
                        info.added.forEach((item, index) => {
                            info.added[index] = new ProviderCryptoProto(item);
                        });

                        this.server.send(session, new ProviderTokenEventProto(info))
                            .catch((e) => {
                                console.error(e);
                            });
                    }
                });
            });
    }

    public listen(address: string) {
        this.server.listen(address);
        this.server
            .on("listening", () => {
                console.log("Server:listen");
                this.provider.open()
                    .catch((err) => {
                        console.log("Provider:OpenError");
                        this.emit("error", err);
                    });
            })
            .on("connect", (session) => {
                console.log("Server:Connect");
                // check connection in stack
                if (!(this.sessions.length && this.sessions.some((item) => item === session))) {
                    console.log("Push session");
                    this.sessions.push(session);
                }
            })
            .on("close", () => {
                // TODO: rename event to 'disconnect' and add event 'connect' for session
                console.log("Session:disconnect");

            })
            .on("error", (e) => {
                console.log("Server:error");
                this.emit("error", e.error);
            })
            .on("message", (e) => {
                console.log("Session:Message");
                this.onMessage(e.session, e.message)
                    .then(e.resolve, e.reject);
            })
            .on("auth", (session) => {
                console.log("Session:auth");
                this.server.send(session, new ProviderAuthorizedEventProto())
                    .catch((e) => {
                        console.error(e);
                    });
            });
        return this;
    }

    protected async  onMessage(session: Session, action: ActionProto) {
        const resultProto = new ResultProto(action);

        let data: ArrayBuffer | undefined;
        switch (action.action) {
            case ProviderInfoActionProto.ACTION: {
                const info = this.provider.info;

                data = await info.exportProto();
                break;
            }
            default:
                throw new Error(`Unknown action '${action.action}'`);
        }
        resultProto.data = data;
        return resultProto;
    }

}
