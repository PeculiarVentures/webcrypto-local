import { AsymmetricRatchet, Identity, PreKeyBundleProtocol } from "2key-ratchet";
import { MessageSignedProtocol, PreKeyMessageProtocol } from "2key-ratchet";
import { EventEmitter } from "events";
import * as http from "http";
import * as https from "https";
import { assign, Convert } from "pvtsutils";
import { ObjectProto } from "tsprotobuf";
import * as url from "url";
import * as WebSocket from "websocket";
import { ActionProto, ErrorProto, Event, ResultProto, ServerIsLoggedInActionProto, ServerLoginActionProto } from "../core";
import { WebCryptoLocalError } from "../local/error";
import { SERVER_WELL_KNOWN } from "./const";
import { OpenSSLStorage } from "./storages/ossl";

const D_KEY_IDENTITY_PRE_KEY_AMOUNT = 10;

type AlgorithmUsageType = "generateKey" | "importKey" | "exportKey" | "sign" | "verify" | "deriveKey" | "deriveBits" | "encrypt" | "decrypt" | "wrapKey" | "unwrapKey" | "digest";

interface WebCryptoProviderAlgorithm {
    name: string;
    usages: AlgorithmUsageType[];
}

interface WebCryptoProvider {
    name: string;
    algorithms: WebCryptoProviderAlgorithm[];
}

type Base64String = string;
type ProtobufString = Base64String;

export interface ServerInfo {
    version: string;
    name: string;
    preKey: ProtobufString;
    providers?: WebCryptoProvider[];
}

export interface Session {
    headers: any;
    connection: WebSocket.connection;
    cipher: AsymmetricRatchet;
    authorized: boolean;
}

export class ServerEvent extends Event<Server> { }

export class ServerListeningEvent extends ServerEvent {

    public address: string;

    constructor(target: Server, address: string) {
        super(target, "listening");
        this.address = address;
    }
}

export class ServerErrorEvent extends ServerEvent {

    public error: Error;

    constructor(target: Server, error: Error) {
        super(target, "error");
        this.error = error;
    }
}

export class ServerDisconnectEvent extends ServerEvent {

    public remoteAddress: string;
    public reasonCode: number;
    public description: string;

    constructor(target: Server, remoteAddress: string, reasonCode: number, description: string) {
        super(target, "close");
        this.remoteAddress = remoteAddress;
        this.reasonCode = reasonCode;
        this.description = description;
    }
}

export class ServerMessageEvent extends ServerEvent {

    public message: ActionProto;
    public session: Session;
    public resolve: (result: ResultProto) => void;
    public reject: (error: Error) => void;

    constructor(target: Server, session: Session, message: ActionProto, resolve?: () => void, reject?: (error: Error) => void) {
        super(target, "message");
        this.message = message;
        this.session = session;
        this.resolve = resolve;
        this.reject = reject;
    }
}

/**
 * Https/wss server based on 2key-ratchet protocol
 * - generates Identity
 * - store makes PreKey bundle
 * - Stores secure sessions
 *
 * @export
 * @class Server
 * @extends {EventEmitter}
 */
export class Server extends EventEmitter {

    public info: ServerInfo = {
        version: "1.0.0",
        name: "webcrypto-socket",
        preKey: "",
        providers: [
            {
                algorithms: [
                    { name: "RSASSA-PKCS1-v1_5", usages: ["generateKey", "exportKey", "importKey", "sign", "verify"] },
                    { name: "RSA-OAEP", usages: ["generateKey", "exportKey", "importKey", "encrypt", "decrypt", "wrapKey", "unwrapKey"] },
                    { name: "RSA-PSS", usages: ["generateKey", "exportKey", "importKey", "sign", "verify"] },
                    { name: "ECDSA", usages: ["generateKey", "exportKey", "importKey", "sign", "verify"] },
                    { name: "ECDH", usages: ["generateKey", "exportKey", "importKey", "deriveKey", "deriveBits"] },
                    { name: "AES-CBC", usages: ["generateKey", "exportKey", "importKey", "encrypt", "decrypt", "wrapKey", "unwrapKey"] },
                    { name: "AES-GCM", usages: ["generateKey", "exportKey", "importKey", "encrypt", "decrypt", "wrapKey", "unwrapKey"] },
                    { name: "AES-KW", usages: ["generateKey", "exportKey", "importKey", "wrapKey", "unwrapKey"] },
                    { name: "SHA-1", usages: ["digest"] },
                    { name: "SHA-256", usages: ["digest"] },
                    { name: "SHA-384", usages: ["digest"] },
                    { name: "SHA-512", usages: ["digest"] },
                    { name: "PBKDF2", usages: ["generateKey", "importKey", "deriveKey", "deriveBits"] },
                ],
                name: "OpenSSL",
            },
        ],
    };

    public identity: Identity;
    /**
     * Storage for 2key-ratchet identifiers
     *
     * @type {OpenSSLStorage}
     * @memberof Server
     */
    public storage: OpenSSLStorage;
    public sessions: Session[] = [];

    protected httpServer: https.Server;
    protected socketServer: WebSocket.server;
    protected options: https.ServerOptions;

    constructor(options: https.ServerOptions) {
        super();

        this.options = options;
    }

    public emit(event: "auth", session: Session): boolean;
    public emit(event: "listening", e: ServerListeningEvent): boolean;
    public emit(event: "connect", e: Session): boolean;
    public emit(event: "disconnect", e: ServerDisconnectEvent): boolean;
    public emit(event: "error", e: ServerErrorEvent): boolean;
    public emit(event: "message", e: ServerMessageEvent): boolean;
    public emit(event: "info", message: string): boolean;
    public emit(event: string | symbol, ...args: any[]): boolean {
        return super.emit(event, ...args);
    }

    public on(event: "auth", listener: (session: Session) => void): this;
    public on(event: "listening", listener: (e: ServerListeningEvent) => void): this;
    public on(event: "connect", listener: (e: Session) => void): this;
    public on(event: "disconnect", listener: (e: ServerDisconnectEvent) => void): this;
    public on(event: "error", listener: (e: ServerErrorEvent) => void): this;
    public on(event: "message", listener: (e: ServerMessageEvent) => void): this;
    public on(event: "info", listener: (message: string) => void): this;
    public on(event: string | symbol, listener: Function): this {
        return super.on(event, listener);
    }

    public once(event: "auth", listener: (session: Session) => void): this;
    public once(event: "listening", listener: (e: ServerListeningEvent) => void): this;
    public once(event: "connect", listener: (e: Session) => void): this;
    public once(event: "disconnect", listener: (e: ServerDisconnectEvent) => void): this;
    public once(event: "error", listener: (e: ServerErrorEvent) => void): this;
    public once(event: "message", listener: (e: ServerMessageEvent) => void): this;
    public once(event: "info", listener: (message: string) => void): this;
    public once(event: string | symbol, listener: Function): this {
        return super.once(event, listener);
    }

    public close(callback?: () => void) {
        this.httpServer.close(callback);
    }

    public listen(address: string) {
        this.httpServer = https.createServer(this.options, (request: http.IncomingMessage, response: http.ServerResponse) => {
            (async () => {
                if (request.method === "GET") {
                    const requestUrl = url.parse(request.url);
                    if (requestUrl.pathname === SERVER_WELL_KNOWN) {
                        const bundle = await this.getRandomBundle();
                        const preKey = Convert.ToBase64(bundle);
                        // console.log("Server info", preKey);
                        const info = assign({}, this.info, { preKey });
                        const json = JSON.stringify(info);
                        response.setHeader("content-length", json.length.toString());
                        response.setHeader("Access-Control-Allow-Origin", "*");
                        response.end(json);
                    }
                }
                response.end();
            })();
        });

        const splitAddress = address.split(":");
        this.httpServer
            .listen(parseInt(splitAddress[1], 10), splitAddress[0], () => {
                (async () => {
                    this.storage = await OpenSSLStorage.create();
                    this.identity = await this.storage.loadIdentity();
                    if (!this.identity) {
                        this.identity = await this.generateIdentity();
                        await this.storage.saveIdentity(this.identity);
                    }
                    this.emit("listening", new ServerListeningEvent(this, address));
                })();
            })
            .on("error", (err) => {
                this.emit("error", new ServerErrorEvent(this, err));
            });

        this.socketServer = new WebSocket.server({
            httpServer: this.httpServer as any,
            // You should not use autoAcceptConnections for production
            // applications, as it defeats all standard cross-origin protection
            // facilities built into the protocol and the browser.  You should
            // *always* verify the connection"s origin and decide whether or not
            // to accept it.
            autoAcceptConnections: false,
            maxReceivedFrameSize: 128 * 1024 * 1024,    // 128 Mib
            maxReceivedMessageSize: 128 * 1024 * 1024,  // 128 Mib
        });

        this.socketServer.on("request", (request) => {
            // if (!/^https/.test(request.origin)) {
            //     // Make sure we only accept requests from an allowed origin
            //     request.reject();
            //     console.log((new Date()) + " Connection from unsecure origin " + request.origin + " rejected.");
            //     return;
            // }
            const connection = request.accept(null, request.origin);
            const session: Session = {
                headers: (request.httpRequest as any).headers,
                connection,
                cipher: null,
                authorized: false,
            };
            this.sessions.push(session);
            this.emit("connect", session);
            connection.on("message", (message) => {
                if (message.type === "utf8") {
                    this.emit(
                        "error",
                        new ServerErrorEvent(
                            this,
                            new WebCryptoLocalError(WebCryptoLocalError.CODE.SERVER_WRONG_MESSAGE, `Received UTF8 message: ${message.utf8Data}`),
                        ),
                    );
                } else if (message.type === "binary") {
                    // console.log("Received Binary Message of " + message.binaryData.length + " bytes");
                    // connection.sendBytes(message.binaryData);
                    // console.log(message.binaryData.toString("binary"));
                    // this.onMessage(connection, message.binaryData);
                    (async () => {
                        const buffer = new Uint8Array(message.binaryData).buffer;
                        let messageProto: MessageSignedProtocol;
                        try {
                            messageProto = await MessageSignedProtocol.importProto(buffer);
                        } catch (err) {
                            try {
                                this.emit("info", `Cannot parse MessageSignedProtocol`);
                                const preKeyProto = await PreKeyMessageProtocol.importProto(buffer);
                                messageProto = preKeyProto.signedMessage;
                                session.cipher = await AsymmetricRatchet.create(this.identity, preKeyProto);
                                // check remote identity
                                const ok = await this.storage.isTrusted(session.cipher.remoteIdentity);
                                if (!ok) {
                                    session.authorized = false;
                                    // await this.storage.saveRemoteIdentity(session.cipher.remoteIdentity.signingKey.id, session.cipher.remoteIdentity);
                                } else {
                                    session.authorized = true;
                                    await this.storage.saveSession(session.cipher.remoteIdentity.signingKey.id, session.cipher);
                                }
                            } catch (err) {
                                throw err;
                            }
                        }
                        if (!session.cipher) {
                            throw new WebCryptoLocalError(WebCryptoLocalError.CODE.SERVER_WRONG_MESSAGE ,"Cipher object for 2key session is empty");
                            // session.cipher = await this.storage.loadSession(messageProto.senderKey.id);
                        }

                        // decrypt
                        const decryptedMessage = await session.cipher.decrypt(messageProto);
                        const actionProto = await ActionProto.importProto(decryptedMessage);

                        return new Promise((resolve, reject) => {
                            if (
                                session.authorized ||
                                actionProto.action === ServerIsLoggedInActionProto.ACTION ||
                                actionProto.action === ServerLoginActionProto.ACTION
                            ) {
                                (async () => {
                                    const sessionIdentitySHA256 = await session.cipher.remoteIdentity.signingKey.thumbprint();
                                    this.emit("info", `Server: session:${sessionIdentitySHA256} ${actionProto.action}`);
                                    this.emit("message", new ServerMessageEvent(this, session, actionProto, resolve, reject));
                                })()
                                    .catch((err) => {
                                        this.emit("error", err);
                                    });
                            } else {
                                // If session is not authorized throw error
                                throw new WebCryptoLocalError(WebCryptoLocalError.CODE.SERVER_NOT_LOGGED_IN, "404: Not authorized");
                            }
                        })
                            .then((answer: ResultProto) => {
                                answer.status = true;
                                return this.send(session, answer);
                            })
                            .catch((e) => {
                                (async () => {
                                    const resultProto = new ResultProto(actionProto);
                                    this.emit("error", new ServerErrorEvent(this, e));
                                    if (e) {
                                        if (e.hasOwnProperty("code")) {
                                            resultProto.error = new ErrorProto(e.message, e.code, e.type || "error");
                                        } else {
                                            // NOTE: Some errors can have simple text format
                                            resultProto.error = createError(e.message || e.toString());
                                        }
                                    } else {
                                        resultProto.error = createError("Empty exception");
                                    }
                                    resultProto.status = false;

                                    this.send(session, resultProto);
                                })();
                            });
                    })().catch((e) => {
                        this.emit("error", new ServerErrorEvent(this, e));
                    });
                }
            });
            connection.on("close", (reasonCode, description) => {
                // remove session from list with the same connection
                this.sessions = this.sessions.filter((session) => session.connection !== connection);

                this.emit("disconnect", new ServerDisconnectEvent(
                    this,
                    connection.remoteAddress,
                    reasonCode,
                    description,
                ));
            });
        });

        return this;
    }

    public async send(session: Session, data: ObjectProto | ArrayBuffer) {
        try {
            let buf: ArrayBuffer;
            if (data instanceof ArrayBuffer) {
                buf = data;
            } else {
                buf = await data.exportProto();
            }
            // encrypt data
            const encryptedData = await session.cipher.encrypt(buf);
            buf = await encryptedData.exportProto();
            session.connection.sendBytes(new Buffer(buf));

        } catch (e) {
            this.emit("error", e);
        }
    }

    protected async generateIdentity() {
        const identity = await Identity.create(0, D_KEY_IDENTITY_PRE_KEY_AMOUNT); // INFO: using 0 for all local servers
        return identity;
    }

    /**
     * create PreKeyBundle with random SignedPreKey and returns it as ArrayBuffer
     */
    protected async getRandomBundle() {
        const preKeyBundle = new PreKeyBundleProtocol();
        await preKeyBundle.identity.fill(this.identity);
        const preKeyId = getRandomInt(1, this.identity.signedPreKeys.length) - 1;
        const preKey = this.identity.signedPreKeys[preKeyId];
        preKeyBundle.preKeySigned.id = preKeyId;
        preKeyBundle.preKeySigned.key = preKey.publicKey;
        await preKeyBundle.preKeySigned.sign(this.identity.signingKey.privateKey);
        preKeyBundle.registrationId = 0;
        const raw = await preKeyBundle.exportProto();
        return raw;
    }

}

/**
 * Returns random integer number [min, max]
 */
function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
}

function createError(message: string) {
    const p11Reg = /(CKR_\w+):(\d+)/;
    const p11 = p11Reg.exec(message);
    if (p11) {
        return new ErrorProto(p11[1], parseInt(p11[2], 10), "pkcs11");
    } else {
        return new ErrorProto(message);
    }
}
