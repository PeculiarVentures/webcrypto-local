import * as Proto from "@webcrypto-local/proto";
import { EventEmitter } from "events";
import { Convert } from "pvtsutils";
import { Client } from "./connection";

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
        const data = await this.client.send(new Proto.CardReaderGetReadersActionProto());
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

    protected onEvent(actionProto: Proto.ActionProto) {
        (async () => {
            switch (actionProto.action) {
                case Proto.CardReaderInsertEventProto.ACTION:
                    this.onInsert(await Proto.CardReaderInsertEventProto.importProto(actionProto));
                    break;
                case Proto.CardReaderRemoveEventProto.ACTION:
                    this.onRemove(await Proto.CardReaderRemoveEventProto.importProto(actionProto));
                    break;
            }
        })()
            .catch((err) => this.emit("error", err));
    }

    protected onInsert(actionProto: Proto.CardReaderInsertEventProto) {
        this.emit("insert", actionProto);
    }

    protected onRemove(actionProto: Proto.CardReaderRemoveEventProto) {
        this.emit("remove", actionProto);
    }

}
