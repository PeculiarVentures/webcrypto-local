import { EventEmitter } from "events";
import { Client } from "../connection/client";
import {  Event } from "../core";
import { SocketSubtleCrypto } from "./subtle";

export class SocketCryptoEvent extends Event<SocketCrypto> {
}

export class SocketCryptoListeningEvent extends SocketCryptoEvent {

    public readonly address: string;

    constructor(target: SocketCrypto, address: string) {
        super(target, "listening");
        this.address = address;
    }
}

export class SocketCryptoCloseEvent extends SocketCryptoEvent {
    public remoteAddress: string;
    constructor(target: SocketCrypto, remoteAddress: string) {
        super(target, "close");
        this.remoteAddress = remoteAddress;
    }
}

export class SocketCryptoErrorEvent extends SocketCryptoEvent {
    public error: Error;
    constructor(target: SocketCrypto, error: Error) {
        super(target, "error");
        this.error = error;
    }
}

/**
 * Implementation of WebCrypto interface
 * - `getRandomValues` native implementation
 * - Symmetric cryptography uses native implementation
 * - Asymmetric cryptography uses calls to Server
 */
export class SocketCrypto extends EventEmitter {

    public readonly subtle: SocketSubtleCrypto;

    public client = new Client();

    constructor() {
        super();
        this.subtle = new SocketSubtleCrypto(this);
    }

    public getRandomValues(array: ArrayBufferView) {
        return self.crypto.getRandomValues(array);
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
                console.error(e.error);
                this.emit("error", new SocketCryptoErrorEvent(this, e.error));
            })
            .on("listening", (e) => {
                console.info("Client:Listening", e.address);
                this.emit("listening", new SocketCryptoListeningEvent(this, address));
            })
            .on("closed", (e) => {
                console.info("Client:Closed");
                this.emit("closed", new SocketCryptoCloseEvent(this, e.remoteAddress));
            });

        return this;
    }

    /**
     * Close connection
     */
    public close() {
        this.client.close();
    }

    public on(event: "listening", listener: (e: SocketCryptoListeningEvent) => void): this;
    public on(event: "closed", listener: (e: SocketCryptoCloseEvent) => void): this;
    public on(event: "error", listener: (e: SocketCryptoErrorEvent) => void): this;
    public on(event: string | symbol, listener: Function) {
        return super.on(event, listener);
    }

    public once(event: "listening", listener: (e: SocketCryptoListeningEvent) => void): this;
    public once(event: "closed", listener: (e: SocketCryptoCloseEvent) => void): this;
    public once(event: "error", listener: (e: SocketCryptoErrorEvent) => void): this;
    public once(event: string | symbol, listener: Function): this;
    public once(event: string | symbol, listener: Function) {
        return super.once(event, listener);
    }

    protected checkSocketState() {
        // if (this.state !== SocketCryptoState.open) {
        //     throw new Error("Socket connection is not open");
        // }
    }

}
