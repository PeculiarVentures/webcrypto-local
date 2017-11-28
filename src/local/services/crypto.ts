import { Server, Session } from "../../connection/server";

import { ActionProto, ResultProto } from "../../core/proto";
import * as P from "../../core/protos/crypto";

import { CertificateStorageService } from "./cert_storage";
import { KeyStorageService } from "./key_storage";
import { ProviderService } from "./provider";
import { Service } from "./service";
import { SubtleService } from "./subtle";

export interface CryptoNotifyEvent {
    type: "pin";
    origin: string;
    resolve: () => void;
    reject: (error: Error) => void;
}

export type CryptoNotifyEventHandler = (e: CryptoNotifyEvent) => void;

export class CryptoService extends Service<ProviderService> {

    public get ossl() {
        return this.object.ossl;
    }

    constructor(server: Server, provider: ProviderService) {
        super(server, provider, [
            //#region List of actions
            P.IsLoggedInActionProto,
            P.LoginActionProto,
            P.LogoutActionProto,
            P.ResetActionProto,
            //#endregion
        ]);

        this.addService(new SubtleService(server, this));
        this.addService(new CertificateStorageService(server, this));
        this.addService(new KeyStorageService(server, this));
    }

    //#region Events

    public emit(event: "notify", e: CryptoNotifyEvent): boolean;
    public emit(event: "error", error: Error): boolean;
    public emit(event: "info", message: string): boolean;
    public emit(event: string, ...args: any[]): boolean {
        return super.emit(event, ...args);
    }

    public on(event: "notify", e: CryptoNotifyEventHandler): this;
    public on(event: "error", cb: (error: Error) => void): this;
    public on(event: "info", cb: (message: string) => void): this;
    public on(event: string, cb: (...args: any[]) => void): this {
        return super.on(event, cb);
    }

    public once(event: "notify", e: CryptoNotifyEventHandler): this;
    public once(event: "error", cb: (error: Error) => void): this;
    public once(event: "info", cb: (message: string) => void): this;
    public once(event: string, cb: (...args: any[]) => void): this {
        return super.once(event, cb);
    }

    //#endregion

    public async getCrypto(id: string) {
        return await this.object.getProvider().getCrypto(id);
    }

    protected async onMessage(session: Session, action: ActionProto) {
        const result = new ResultProto(action);
        switch (action.action) {
            case P.IsLoggedInActionProto.ACTION: {
                const params = await P.IsLoggedInActionProto.importProto(action);

                const crypto = await this.getCrypto(params.providerID);
                result.data = new Uint8Array([crypto.isLoggedIn ? 1 : 0]).buffer;
                break;
            }
            case P.LoginActionProto.ACTION: {
                const params = await P.LoginActionProto.importProto(action);

                const crypto = await this.getCrypto(params.providerID);

                if (crypto.login) {
                    // show prompt
                    const promise = new Promise<string>((resolve, reject) => {
                        this.emit("notify", {
                            type: "pin",
                            origin: session.headers.origin,
                            resolve,
                            reject,
                        });
                    });
                    const pin = await promise;
                    crypto.login(pin);
                }
                break;
            }
            case P.LogoutActionProto.ACTION: {
                const params = await P.LogoutActionProto.importProto(action);

                const crypto = await this.getCrypto(params.providerID);

                if (crypto.logout) {
                    crypto.logout();
                }
                break;
            }
            case P.ResetActionProto.ACTION: {
                const params = await P.ResetActionProto.importProto(action);
                const crypto = await this.getCrypto(params.providerID);

                if ("reset" in crypto) {
                    // node-webcrypto-p11 has reset method
                    await (crypto as any).reset();
                }
                break;
            }
            default:
                throw new Error(`Action '${action.action}' is not implemented`);
        }
        return result;
    }

}
