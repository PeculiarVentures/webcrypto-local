import { AsymmetricRatchet, Identity, MessageSignedProtocol, PreKeyBundleProtocol } from "2key-ratchet";
import { EventEmitter } from "events";
import { Convert } from "pvtsutils";
import { ActionProto, Event, ServerInfo } from "../core";
import { AuthRequestProto, ResultProto } from "../core";
import { challenge } from "./challenge";
// import { challenge } from "./challenge";
import { SERVER_WELL_KNOWN } from "./const";
import { BrowserStorage } from "./storages/browser";

export class ClientEvent extends Event<Client> {
}

export type PromiseStackItem = {
    resolve: Function;
    reject: Function;
};

export class ClientListeningEvent extends ClientEvent {

    public readonly address: string;

    constructor(target: Client, address: string) {
        super(target, "listening");
        this.address = address;
    }
}

export class ClientCloseEvent extends ClientEvent {
    public remoteAddress: string;
    constructor(target: Client, remoteAddress: string) {
        super(target, "close");
        this.remoteAddress = remoteAddress;
    }
}

export class ClientErrorEvent extends ClientEvent {
    public error: Error;
    constructor(target: Client, error: Error) {
        super(target, "error");
        this.error = error;
    }
}

export enum SocketCryptoState {
    connecting = 0,
    open = 1,
    closing = 2,
    closed = 3,
}

declare class ActiveXObject {
    constructor(name: string);
}

function getXmlHttp() {
    let xmlHttp: XMLHttpRequest;
    try {
        xmlHttp = new ActiveXObject("Msxml2.XMLHTTP") as any;
    } catch (e) {
        try {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP") as any;
        } catch (e) {
            // console.log();
        }
    }
    if (!xmlHttp && typeof XMLHttpRequest !== "undefined") {
        xmlHttp = new XMLHttpRequest();
    }
    return xmlHttp;
}

/**
 * Implementation of WebCrypto interface
 * - `getRandomValues` native implementation
 * - Symmetric cryptography uses native implementation
 * - Asymmetric cryptography uses calls to Server
 */
export class Client extends EventEmitter {

    public serviceInfo: ServerInfo;
    public stack: { [key: string]: PromiseStackItem } = {};

    public get state(): SocketCryptoState {
        if (this.socket) {
            return this.socket.readyState;
        } else {
            return SocketCryptoState.closed;
        }
    }

    /**
     * double ratchet session
     */
    protected cipher: AsymmetricRatchet;
    protected socket: WebSocket;
    protected messageCounter = 0;

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
        this.getServerInfo(address)
            .then((info) => {
                this.serviceInfo = info;
                this.socket = new WebSocket(`ws://${address}`);
                this.socket.binaryType = "arraybuffer";
                this.socket.onerror = (e: any) => {
                    this.emit("error", new ClientErrorEvent(this, e.error));
                };
                this.socket.onopen = (e) => {
                    (async () => {
                        const storage = await BrowserStorage.create();
                        let identity = await storage.loadIdentity();
                        if (!identity) {
                            console.info("Generates new identity");
                            identity = await Identity.create(1);
                            await storage.saveIdentity(identity);
                        }
                        const remoteIdentityId = "0";
                        // const remoteIdentity = await storage.loadRemoteIdentity(remoteIdentityId);
                        const bundle = await PreKeyBundleProtocol.importProto(Convert.FromBase64(info.preKey));
                        // if (remoteIdentity && await remoteIdentity.signingKey.isEqual(bundle.identity.signingKey)) {
                        // this.cipher = await storage.loadSession(remoteIdentityId);
                        // } else {
                        this.cipher = await AsymmetricRatchet.create(identity, bundle);
                        // save new remote identity
                        await storage.saveRemoteIdentity(remoteIdentityId, this.cipher.remoteIdentity);
                        // }
                        this.cipher.on("update", () => {
                            this.cipher.toJSON()
                                .then((json) => {
                                    storage.saveSession(remoteIdentityId, this.cipher);
                                })
                                .catch((error) => {
                                    console.error(error);
                                });
                        });

                        // authenticate
                        Promise.resolve()
                            .then(() => {
                                return challenge(this.cipher.remoteIdentity.signingKey, identity.signingKey.publicKey);
                            })
                            .then((pin) => {
                                this.emit("pin", pin);
                                return this.send(new AuthRequestProto())
                                    .then((data) => {
                                        return (async () => {
                                            if (data && new Uint8Array(data)[0]) {
                                                this.emit("listening", new ClientListeningEvent(this, address));
                                            } else {
                                                this.close();
                                            }
                                        })();
                                    });
                            });
                    })().catch((error) => this.emit("error", new ClientErrorEvent(this, error)));
                };
                this.socket.onclose = (e) => {
                    this.emit("close", new ClientCloseEvent(this, address));
                };
                this.socket.onmessage = (e) => {
                    if (e.data instanceof ArrayBuffer) {
                        console.log("Message:", e.type);
                        // decrypt
                        MessageSignedProtocol.importProto(e.data)
                            .then((proto) => {
                                return this.cipher.decrypt(proto);
                            })
                            .then((msg) => {
                                this.onMessage(msg);
                            })
                            .catch((err) => {
                                this.emit("error", new ClientErrorEvent(this, err));
                            });
                    }
                };
            })
            .catch((err) => {
                this.emit("error", new ClientErrorEvent(this, err));
            });

        return this;
    }
    /**
     * Close connection
     */
    public close() {
        this.socket.close();
    }

    public on(event: "event", listener: (e: ActionProto) => void): this;
    public on(event: "listening", listener: (e: ClientListeningEvent) => void): this;
    public on(event: "pin", listener: (pin: string) => void): this;
    public on(event: "close", listener: (e: ClientCloseEvent) => void): this;
    public on(event: "error", listener: (e: ClientErrorEvent) => void): this;
    public on(event: string | symbol, listener: Function) {
        return super.on(event, listener);
    }

    public once(event: "listening", listener: (e: ClientListeningEvent) => void): this;
    public once(event: "pin", listener: (pin: string) => void): this;
    public once(event: "close", listener: (e: ClientCloseEvent) => void): this;
    public once(event: "error", listener: (e: ClientErrorEvent) => void): this;
    public once(event: string | symbol, listener: Function): this;
    public once(event: string | symbol, listener: Function) {
        return super.once(event, listener);
    }

    /**
     * Sends and receives
     */
    public send(data?: ActionProto): Promise<ArrayBuffer> {
        console.log("Send message:", data.action);
        return new Promise((resolve, reject) => {
            this.checkSocketState();
            if (!data) {
                data = new ActionProto();
            }
            data.action = data.action;
            data.actionId = (this.messageCounter++).toString();
            data.exportProto()
                .then((raw) => {
                    // encrypt data
                    return this.cipher.encrypt(raw)
                        .then((msg) => msg.exportProto());
                })
                .then((raw) => {
                    // console.log(Convert.ToBinary(raw));
                    this.stack[data.actionId] = { resolve, reject };
                    this.socket.send(raw);
                })
                .catch(reject);
        });
    }

    /**
     * Sends Request to server and gets info about server and PreKeyBundle data for DKeyRatchet connection
     */
    protected getServerInfo(address: string): Promise<ServerInfo> {
        return new Promise((resolve, reject) => {
            const xmlHttp = getXmlHttp();
            xmlHttp.open("GET", `http://${address}${SERVER_WELL_KNOWN}`, true);
            xmlHttp.responseType = "text";
            xmlHttp.onreadystatechange = () => {
                if (xmlHttp.readyState === 4) {
                    if (xmlHttp.status === 200) {
                        const json = JSON.parse(xmlHttp.responseText);
                        console.log(json);
                        resolve(json);
                    } else {
                        reject(new Error("Cannot GET response"));
                    }
                }
            };
            xmlHttp.send(null);
        });
    }

    protected checkSocketState() {
        if (this.state !== SocketCryptoState.open) {
            throw new Error("Socket connection is not open");
        }
    }

    protected async onMessage(message: ArrayBuffer) {
        const proto = await ActionProto.importProto(message);
        console.info("Action:", proto.action);
        // find Promise
        const promise = this.stack[proto.actionId];
        if (promise) {
            delete this.stack[proto.actionId];
            const messageProto = await ResultProto.importProto(await proto.exportProto());
            if (messageProto.error) {
                console.error("Error action:", messageProto.action);
                console.error(messageProto.error);
                promise.reject(new Error(messageProto.error));
            } else {
                promise.resolve(messageProto.data);
            }
        } else {
            this.emit("event", proto);
        }
    }

}
