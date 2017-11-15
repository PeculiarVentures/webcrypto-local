import { EventEmitter } from "events";

import { Server, Session } from "../../connection/server";
import { ActionProto, ResultProto } from "../../core/proto";

/**
 * Base class for services
 * NOTE: Each object must have info, error events
 */
export abstract class Service<T extends EventEmitter> extends EventEmitter {

    protected server: Server;
    protected object: T;

    /**
     * 
     * @param server WebSocket server
     * @param object Wrapped object
     * @param filter List of actions which must be implemented
     */
    constructor(server: Server, object: T, filter: Array<typeof ActionProto> = []) {
        super();

        this.server = server;
        this.object = object;

        //#region Connect to events

        //#region Server
        this.server
            .on("info", (message) => {
                this.emit("info", message);
            })
            .on("error", (error) => {
                this.emit("error", error.error);
            })
            .on("message", (e) => {
                if (filter.some((item) => item.ACTION === e.message.action)) {
                    this.onMessage(e.session, e.message)
                        .then(e.resolve, e.reject);
                }
            });
        //#endregion

        //#region Object
        this.object
            .on("info", (message: string) => {
                this.emit("info", message);
            })
            .on("error", (error: Error) => {
                this.emit("error", error);
            });
        //#endregion

        //#endregion

    }

    public emit(event: "error", error: Error): boolean;
    public emit(event: "info", message: string): boolean;
    public emit(event: string, ...args: any[]): boolean {
        return super.emit(event, ...args);
    }

    public on(event: "error", cb: (error: Error) => void): this;
    public on(event: "info", cb: (message: string) => void): this;
    public on(event: string, cb: (...args: any[]) => void): this;
    public on(event: string, cb: (...args: any[]) => void): this {
        return super.on(event, cb);
    }

    public once(event: "error", cb: (error: Error) => void): this;
    public once(event: "info", cb: (message: string) => void): this;
    public once(event: string, cb: (...args: any[]) => void): this;
    public once(event: string, cb: (...args: any[]) => void): this {
        return super.once(event, cb);
    }

    protected abstract async onMessage(session: Session, action: ActionProto): Promise<ResultProto>;

}
