import { Convert } from "pvtsutils";

import { Server, Session } from "../../connection/server";
import { ActionProto, ResultProto } from "../../core/proto";
import { CardReaderGetReadersActionProto, CardReaderInsertEventProto, CardReaderRemoveEventProto } from "../../core/protos/card_reader";
import { PCSCWatcher, PCSCWatcherEvent } from "../pcsc_watcher";
import { Service } from "./service";

export class CardReaderService extends Service<PCSCWatcher> {

    constructor(server: Server) {
        super(server, new PCSCWatcher(), [
            CardReaderGetReadersActionProto,
        ]);

        //#region Connect to PCSC events
        this.object.on("insert", this.onInsert.bind(this));
        this.object.on("remove", this.onRemove.bind(this));
        //#endregion

        this.object.start();
    }

    public on(event: "error", cb: (error: Error) => void): this;
    public on(event: "info", cb: (message: string) => void): this;
    public on(event: string, cb: (...args: any[]) => void): this {
        return super.on(event, cb);
    }

    public once(event: "error", cb: (error: Error) => void): this;
    public once(event: "info", cb: (message: string) => void): this;
    public once(event: string, cb: (...args: any[]) => void): this {
        return super.once(event, cb);
    }

    protected onInsert(e: PCSCWatcherEvent) {
        this.server.sessions.forEach((session) => {
            if (session.authorized) {
                const eventProto = CardReaderInsertEventProto.fromObject(e);

                this.server.send(session, eventProto);
            }
        });
    }

    protected onRemove(e: PCSCWatcherEvent) {
        this.server.sessions.forEach((session) => {
            if (session.authorized) {
                const eventProto = CardReaderRemoveEventProto.fromObject(e);

                this.server.send(session, eventProto);
            }
        });
    }

    protected async onMessage(session: Session, action: ActionProto) {
        const result = new ResultProto(action);
        switch (action.action) {
            case CardReaderGetReadersActionProto.ACTION: {
                result.data = Convert.FromString(JSON.stringify(this.object.readers));
                break;
            }
            default:
                throw new Error(`Action '${action.action}' is not implemented`);
        }
        return result;
    }

}
