import { EventEmitter } from "events";
import { Client } from "../connection/client";
import { ProviderInfoActionProto, ProviderInfoProto } from "../core/protos/provider";
// import { Event } from "../core";
// import { CertificateStorage } from "./cert_storage";
// import { KeyStorage } from "./key_storage";
// import { SocketSubtleCrypto } from "./subtle";

/**
 * Implementation of WebCrypto interface
 * - `getRandomValues` native implementation
 * - Symmetric cryptography uses native implementation
 * - Asymmetric cryptography uses calls to Server
 */
export class SocketCrypto extends EventEmitter {

    public client = new Client();

    public get state() {
        return this.client.state;
    }

    constructor() {
        super();
    }

    /**
     * Connects to Service
     * Steps:
     * 1. Requests info data from Server
     * - if server not found emits `error`
     * 2. Create 2key-ratchet session from PreKeyBundle
     */
    public connect(address: string): this {
        this.client.connect(address)
            .on("error", (e) => {
                console.log("Client:Error");
                console.error(e.error);
                this.emit("error", e.error);
            })
            .on("event", (proto) => {
                console.log("Client:Event", proto.action);
            })
            .on("listening", (e) => {
                console.info("Client:Listening", e.address);
                this.emit("listening", address);
            })
            .on("closed", (e) => {
                console.info("Client:Closed");
                this.emit("closed", e.remoteAddress);
            });

        return this;
    }

    /**
     * Close connection
     */
    public close() {
        this.client.close();
    }

    public on(event: string | symbol, listener: Function) {
        return super.on(event, listener);
    }

    public once(event: string | symbol, listener: Function) {
        return super.once(event, listener);
    }

    public async info() {
        const proto = new ProviderInfoActionProto();
        const result = await this.client.send(ProviderInfoActionProto.ACTION, proto);

        const infoProto = await ProviderInfoProto.importProto(result);
        console.log(infoProto);
    }

}
