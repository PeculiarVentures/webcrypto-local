import { Server, Session } from "../../connection/server";
import { MemoryStorage } from "../memory_storage";
import { PCSCCard } from "../pcsc_watcher";
import { IProviderConfig, LocalProvider, TokenInfo } from "../provider";
import { CryptoService } from "./crypto";
import { Service } from "./service";

import { ActionProto, ResultProto } from "../../core/proto";
import * as PP from "../../core/protos/provider";

export interface ProviderNotifyEvent {
    type: string;
    resolve: () => void;
    reject: (error: Error) => void;
}

export type ProviderNotifyEventHandler = (e: ProviderNotifyEvent) => void;

export class ProviderService extends Service<LocalProvider> {

    public memoryStorage = new MemoryStorage();

    constructor(server: Server, options: IProviderConfig) {
        super(server, new LocalProvider(options), [
            //#region List of actions
            PP.ProviderInfoActionProto,
            PP.ProviderGetCryptoActionProto,
            //#endregion
        ]);

        const crypto = new CryptoService(server, this);
        this.addService(crypto);

        //#region Connect events
        this.object.on("token_new", this.onTokenNew.bind(this));
        this.object.on("token", this.onToken.bind(this));
        crypto.on("notify", this.onNotify.bind(this));
        //#endregion
    }

    //#region Events

    public emit(event: "notify", e: ProviderNotifyEvent): boolean;
    public emit(event: "token_new", e: PCSCCard): boolean;
    public emit(event: "token_error", error: string): boolean;
    public emit(event: "error", error: Error): boolean;
    public emit(event: "info", message: string): boolean;
    public emit(event: string, ...args: any[]): boolean {
        return super.emit(event, ...args);
    }

    public on(event: "notify", cb: ProviderNotifyEventHandler): this;
    public on(event: "token_new", cb: (e: PCSCCard) => void): this;
    public on(event: "token_error", cb: (error: string) => void): this;
    public on(event: "error", cb: (error: Error) => void): this;
    public on(event: "info", cb: (message: string) => void): this;
    public on(event: string, cb: (...args: any[]) => void): this {
        return super.on(event, cb);
    }

    public once(event: "notify", cb: ProviderNotifyEventHandler): this;
    public once(event: "token_new", cb: (e: PCSCCard) => void): this;
    public once(event: "token_error", cb: (error: string) => void): this;
    public once(event: "error", cb: (error: Error) => void): this;
    public once(event: "info", cb: (message: string) => void): this;
    public once(event: string, cb: (...args: any[]) => void): this {
        return super.once(event, cb);
    }

    //#endregion

    public open() {
        this.object.open()
            .catch((err) => {
                this.emit("error", new Error(`Provider:Open Error. ${err.message}`));
            })
            .then(() => {
                this.emit("info", "Provider:Opened");
            });
    }

    public getProvider() {
        return this.object;
    }

    protected onTokenNew(e: PCSCCard) {
        this.emit("token_new", e);
    }

    protected onToken(info: TokenInfo) {
        if (info.error) {
            this.emit("token_error", info.error);
        } else {
            this.emit("info", `Provider:Token Amount of tokens was changed (+${info.added.length}/-${info.removed.length})`);
            this.server.sessions.forEach((session) => {
                if (session.cipher && session.authorized) {
                    info.removed.forEach((item, index) => {
                        info.removed[index] = new PP.ProviderCryptoProto(item);
                        // remove objects from memory storage
                        this.memoryStorage.removeByProvider(info.removed[index].id);
                    });
                    info.added.forEach((item, index) => {
                        info.added[index] = new PP.ProviderCryptoProto(item);
                    });
                    this.server.send(session, new PP.ProviderTokenEventProto(info));
                }
            });
        }
    }

    protected onNotify(e: ProviderNotifyEvent) {
        this.emit("notify", e);
    }

    protected async onMessage(session: Session, action: ActionProto) {
        const result = new ResultProto(action);
        switch (action.action) {
            // info
            case PP.ProviderInfoActionProto.ACTION: {
                const info = this.object.info;
                result.data = await info.exportProto();
                break;
            }
            // getCrypto
            case PP.ProviderGetCryptoActionProto.ACTION: {
                const getCryptoParams = await PP.ProviderGetCryptoActionProto.importProto(action);

                await this.object.getCrypto(getCryptoParams.cryptoID);

                break;
            }
            default:
                throw new Error(`Action '${action.action}' is not implemented`);
        }
        return result;
    }

}
