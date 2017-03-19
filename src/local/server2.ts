import { EventEmitter } from "events";
import { Server, Session } from "../connection/server";
import { ActionProto, ResultProto } from "../core/proto";
import { ProviderInfoActionProto, ProviderInfoProto, ProviderAuthorizedEventProto } from "../core/protos/provider";

export class LocalServer extends EventEmitter {

    public server: Server;

    constructor() {
        super();

        this.server = new Server();
    }

    public listen(address: string) {
        this.server.listen(address);
        this.server
            .on("listening", () => {
                console.log("Server:listen");
            })
            .on("close", () => {
                // TODO: rename event to 'disconnect' and add event 'connect' for session
                console.log("Session:disconnect");

            })
            .on("error", (e) => {
                console.log("Server:error");

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

                const info = new ProviderInfoProto();
                info.name = "WebCryptoLocal";

                await this.server.send(session, new ProviderAuthorizedEventProto())
                    .catch((e) => {
                        console.error(e);
                    });
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
