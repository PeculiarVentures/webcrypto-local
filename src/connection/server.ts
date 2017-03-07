import { AsymmetricRatchet, Identity, PreKeyBundleProtocol } from "2key-ratchet";
import { MessageSignedProtocol, PreKeyMessageProtocol } from "2key-ratchet";
import { EventEmitter } from "events";
import * as http from "http";
import { NotificationCenter } from "node-notifier";
import { assign, Convert } from "pvtsutils";
import * as url from "url";
import * as WebSocket from "websocket";
import { ActionProto, AuthRequestProto, Event, ResultProto } from "../core";
import { challenge } from "./challenge";
import { SERVER_WELL_KNOWN } from "./const";
import { OpenSSLStorage } from "./storages/ossl";

const D_KEY_IDENTITY_PRE_KEY_AMOUNT = 10;

const notifier = new (NotificationCenter as any)();

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

export class ServerCloseEvent extends ServerEvent {

    public remoteAddress: string;

    constructor(target: Server, remoteAddress: string) {
        super(target, "close");
        this.remoteAddress = remoteAddress;
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
        this.resolve = resolve;
        this.reject = reject;
    }
}

/**
 * - generates Identity
 * - store makes PreKey bundle
 * - Stores secure sessions
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

    protected httpServer: http.Server;
    protected socketServer: WebSocket.server;
    protected identity: Identity;
    protected storage: OpenSSLStorage;

    public on(event: "listening", listener: (e: ServerListeningEvent) => void): this;
    public on(event: "close", listener: (e: ServerCloseEvent) => void): this;
    public on(event: "error", listener: (e: ServerErrorEvent) => void): this;
    public on(event: "message", listener: (e: ServerMessageEvent) => void): this;
    public on(event: string | symbol, listener: Function): this {
        return super.on(event, listener);
    }

    public once(event: "listening", listener: (e: ServerListeningEvent) => void): this;
    public once(event: "closed", listener: (e: ServerCloseEvent) => void): this;
    public once(event: "error", listener: (e: ServerErrorEvent) => void): this;
    public once(event: string | symbol, listener: Function): this {
        return super.once(event, listener);
    }

    public listen(address: string) {
        this.httpServer = http.createServer((request, response) => {
            (async () => {
                if (request.method === "GET") {
                    const requestUrl = url.parse(request.url);
                    if (requestUrl.pathname === SERVER_WELL_KNOWN) {
                        const bundle = await this.getRandomBundle();
                        const preKey = Convert.ToBase64(bundle);
                        console.log("Server info", preKey);
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
            httpServer: this.httpServer,
            // You should not use autoAcceptConnections for production
            // applications, as it defeats all standard cross-origin protection
            // facilities built into the protocol and the browser.  You should
            // *always* verify the connection"s origin and decide whether or not
            // to accept it.
            autoAcceptConnections: false,
        });

        this.socketServer.on("request", (request) => {
            // if (!originIsAllowed(request.origin)) {
            //     // Make sure we only accept requests from an allowed origin
            //     request.reject();
            //     console.log((new Date()) + " Connection from origin " + request.origin + " rejected.");
            //     return;
            // }
            const connection = request.accept(null, request.origin);
            const session: Session = {
                connection,
                cipher: null,
                authorized: false,
            };
            connection.on("message", (message) => {
                if (message.type === "utf8") {
                    console.log("Received Message: " + message.utf8Data);
                    console.log(message.utf8Data);
                } else if (message.type === "binary") {
                    console.log("Received Binary Message of " + message.binaryData.length + " bytes");
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
                                const preKeyProto = await PreKeyMessageProtocol.importProto(buffer);
                                messageProto = preKeyProto.signedMessage;
                                session.cipher = await AsymmetricRatchet.create(this.identity, preKeyProto);
                                // check remote identity
                                const ok = await this.storage.isTrusted(session.cipher.remoteIdentity);
                                if (!ok) {
                                    console.log("Remote identity is not trusted");
                                    session.authorized = false;
                                    // await this.storage.saveRemoteIdentity(session.cipher.remoteIdentity.signingKey.id, session.cipher.remoteIdentity);
                                } else {
                                    session.authorized = true;
                                }
                                console.log("Save session");
                                await this.storage.saveSession(session.cipher.remoteIdentity.signingKey.id, session.cipher);
                            } catch (err) {
                                throw err;
                            }
                        }
                        if (!session.cipher) {
                            console.log("load session");
                            session.cipher = await this.storage.loadSession(messageProto.senderKey.id);
                        }

                        // decrypt
                        const decryptedMessage = await session.cipher.decrypt(messageProto);
                        const actionProto = await ActionProto.importProto(decryptedMessage);

                        return new Promise((resolve, reject) => {
                            if (actionProto.action === AuthRequestProto.ACTION) {
                                (async () => {
                                    const resultProto = new ResultProto(actionProto);
                                    if (!session.authorized) {
                                        // Session is not authorized
                                        // generate OTP
                                        const pin = await challenge(this.identity.signingKey.publicKey, session.cipher.remoteIdentity.signingKey);
                                        // Show notice
                                        notifier.notify({
                                            title: "webcrypto-local",
                                            message: `Is it correct PIN ${pin}?`,
                                            wait: true,
                                            actions: "Yes",
                                            closeLabel: "No",
                                            // timeout: 30,
                                        } as any, (error: Error, response: string) => {
                                            console.log("Notifier response:", response);
                                            if (response === "activate") {
                                                this.storage.saveRemoteIdentity(session.cipher.remoteIdentity.signingKey.id, session.cipher.remoteIdentity);
                                                session.authorized = true;
                                            }
                                        });
                                    }
                                    // result
                                    resultProto.data = new Uint8Array([session.authorized ? 1 : 0]).buffer;
                                    resolve(resultProto);
                                })().catch(reject);
                            } else {
                                // If session is not authorized throw error
                                if (!session.authorized) {
                                    throw new Error("404: Not authorized");
                                }
                                const emit = this.emit("message", new ServerMessageEvent(this, session, actionProto, resolve, reject));
                                console.log("Emit message:", emit);
                            }
                        })
                            .then((answer: ResultProto) => {
                                (async () => {
                                    // Encrypt success result
                                    const raw = await answer.exportProto();
                                    const encryptedData = await session.cipher.encrypt(raw);
                                    const encryptedRaw = await encryptedData.exportProto();
                                    connection.sendBytes(new Buffer(encryptedRaw));
                                })();
                            })
                            .catch((e) => {
                                (async () => {
                                    // Encrypt Error result
                                    const resultProto = new ResultProto(actionProto);
                                    console.log("Error for action:", actionProto.action);
                                    console.error(e);
                                    resultProto.error = e.message;

                                    const raw = await resultProto.exportProto();
                                    const encryptedData = await session.cipher.encrypt(raw);
                                    const encryptedRaw = await encryptedData.exportProto();
                                    connection.sendBytes(new Buffer(encryptedRaw));
                                })();
                            });
                    })().catch((e) => {
                        this.emit("error", new ServerErrorEvent(this, e));
                    });
                }
            });
            connection.on("close", (reasonCode, description) => {
                this.emit("close", new ServerCloseEvent(this, connection.remoteAddress));
            });
        });

        return this;
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