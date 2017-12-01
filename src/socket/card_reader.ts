import { EventEmitter } from "events";
import { Convert } from "pvtsutils";

import { Client } from "../connection/client";
import { ActionProto } from "../core/proto";
import { CardReaderGetReadersActionProto, CardReaderInsertEventProto, CardReaderRemoveEventProto } from "../core/protos/card_reader";

export class CardReader extends EventEmitter {

    protected client: Client;

    constructor(client: Client) {
        super();

        this.client = client;
        this.onEvent = this.onEvent.bind(this);

        this.client
            .on("listening", () => {
                this.client.on("event", this.onEvent);
            })
            .on("close", () => {
                this.client.removeListener("event", this.onEvent);
            });
    }

    /**
     * Returns list of names of active PCSC readers
     */
    public async readers() {
        const data = await this.client.send(new CardReaderGetReadersActionProto());
        return JSON.parse(Convert.ToString(data));
    }

    public on(event: "remove", cb: (...args: any[]) => void): this;
    public on(event: "insert", cb: (...args: any[]) => void): this;
    public on(event: string, cb: (...args: any[]) => void): this {
        return super.on(event, cb);
    }

    public emit(event: "remove", ...args: any[]): boolean;
    public emit(event: "insert", ...args: any[]): boolean;
    public emit(event: string, ...args: any[]): boolean;
    public emit(event: string, ...args: any[]): boolean {
        return super.emit(event, ...args);
    }

    protected onEvent(actionProto: ActionProto) {
        (async () => {
            switch (actionProto.action) {
                case CardReaderInsertEventProto.ACTION:
                    this.onInsert(await CardReaderInsertEventProto.importProto(actionProto));
                    break;
                case CardReaderRemoveEventProto.ACTION:
                    this.onRemove(await CardReaderRemoveEventProto.importProto(actionProto));
                    break;
            }
        })()
            .catch((err) => this.emit("error", err));
    }

    protected onInsert(actionProto: CardReaderInsertEventProto) {
        this.emit("insert", actionProto);
    }

    protected onRemove(actionProto: CardReaderRemoveEventProto) {
        this.emit("remove", actionProto);
    }

}
