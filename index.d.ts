import { AsymmetricRatchet, Identity, RemoteIdentity } from "2key-ratchet";
import { EventEmitter } from "events";
import * as https from "https";
import { ObjectProto } from "tsprotobuf";
import * as WebSocket from "websocket";

declare enum WebCryptoLocalErrorEnum {
    UNKNOWN = 0,
    METHOD_NOT_IMPLEMENTED = 1,
    CASE_ERROR = 2,
    RATCHET_COMMON = 100,
    RATCHET_KEY_NOT_APPROVED = 101,
    ACTION_COMMON = 200,
    ACTION_NOT_IMPLEMENTED = 201,
    ACTION_NOT_SUPPORTED = 202,
    CARD_CONFIG_COMMON = 300,
    MEMORY_STORAGE_COMMON = 350,
    MEMORY_STORAGE_OUT_OF_INDEX = 351,
    PROVIDER_COMMON = 400,
    PROVIDER_INIT = 401,
    PROVIDER_CRYPTO_NOT_FOUND = 402,
    PROVIDER_CRYPTO_WRONG = 403,
    PROVIDER_NOT_FOUND = 404,
    PROVIDER_WRONG_LIBRARY = 405,
    TOKEN_COMMON = 500,
    TOKEN_REMOVE_TOKEN_READING = 501,
    TOKEN_REMOVE_NO_SLOTS_FOUND = 502,
    SERVER_COMMON = 600,
    SERVER_WRONG_MESSAGE = 601,
    SERVER_NOT_LOGGED_IN = 602,
}

export class WebCryptoLocalError extends Error {

    public static CODE: typeof WebCryptoLocalErrorEnum;

    public code: number;
    public type: string;
    public stack: string;

    constructor(code: number, message?: string);
    constructor(message: string);

}


export class BaseProto extends ObjectProto {
    public static INDEX: number;
    public version: number;
}

export class ActionProto extends BaseProto {
    public static INDEX: number;
    public static ACTION: string;
    /**
     * name of the action
     */
    public action: string;
    /**
     * Identity of action (needs to link request to response)
     */
    public actionId: string;
}

export class ResultProto extends ActionProto {
    public static INDEX: number;
    public status: boolean;
    public error: string;
    public data?: ArrayBuffer;
    constructor(proto?: ActionProto);
}

export interface RemoteIdentityEx extends RemoteIdentity {
    userAgent?: string;
    origin?: string;
}

/**
 * Identity key storage base on node-webcrypto-ossl
 *
 * @export
 * @class OpenSSLStorage
 */
export class OpenSSLStorage {

    public static STORAGE_NAME: string;
    public static IDENTITY_STORAGE: string;
    public static SESSION_STORAGE: string;
    public static REMOTE_STORAGE: string;

    /**
     * Creates new instance of storage
     *
     * @static
     * @returns
     * @memberof OpenSSLStorage
     */
    public static create(): Promise<OpenSSLStorage>;

    /**
     * 2key-ratchet identity
     *
     * @type {Identity}
     * @memberof OpenSSLStorage
     */
    public identity: Identity;

    /**
     * Associative array of remote identities
     *
     * @type {{ [key: string]: RemoteIdentityEx }}
     * @memberof OpenSSLStorage
     */
    public remoteIdentities: { [key: string]: RemoteIdentityEx };
    public sessions: { [key: string]: AsymmetricRatchet };

    private constructor()

    public loadIdentity(): Promise<Identity>;
    public saveIdentity(value: Identity): Promise<void>;
    /**
     * Returns remote identity by key
     *
     * @param {string}  key     identifier of identity
     * @returns {Promise<RemoteIdentityEx>}
     * @memberof OpenSSLStorage
     */
    public loadRemoteIdentity(key: string): Promise<RemoteIdentityEx>;
    /**
     * Adds remote identity to storage
     *
     * @param {string}          key     identifier of identity
     * @param {RemoteIdentity}  value   remote identity
     * @returns {Promise<void>}
     * @memberof OpenSSLStorage
     */
    public saveRemoteIdentity(key: string, value: RemoteIdentity): Promise<void>;
    /**
     * Remove remote identity from storage by key
     *
     * @param {string}          key     identifier of identity
     * @memberof OpenSSLStorage
     * @returns {Promise<void>}
     */
    public removeRemoteIdentity(key: string): Promise<void>;
    public isTrusted(remoteIdentity: RemoteIdentity): Promise<boolean>;

    public loadSession(key: string): Promise<AsymmetricRatchet>;
    public saveSession(key: string, value: AsymmetricRatchet): Promise<void>;
    public findSession(key: CryptoKey): Promise<false | AsymmetricRatchet>;
}

export interface Session {
    headers: any;
    connection: WebSocket.connection;
    cipher: AsymmetricRatchet;
    authorized: boolean;
}

export class Event<T> {

    public readonly target: T;
    public readonly event: string;

    constructor(target: T, event: string);
}

export class ServerEvent extends Event<Server> { }

export class ServerListeningEvent extends ServerEvent {
    public address: string;
}

export class ServerErrorEvent extends ServerEvent {
    public error: Error;
    constructor(target: Server, error: Error);
}

export class ServerDisconnectEvent extends ServerEvent {
    public remoteAddress: string;
    public reasonCode: number;
    public description: string;
    constructor(target: Server, remoteAddress: string, reasonCode: number, description: string);
}

export class ServerMessageEvent extends ServerEvent {
    public message: ActionProto;
    public session: Session;
    public resolve: (result: ResultProto) => void;
    public reject: (error: Error) => void;
    constructor(target: Server, session: Session, message: ActionProto, resolve?: () => void, reject?: (error: Error) => void)
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

    public identity: Identity;
    /**
     * Storage for 2key-ratchet identifiers
     *
     * @type {OpenSSLStorage}
     * @memberof Server
     */
    public storage: OpenSSLStorage;

    constructor(options: https.ServerOptions);

    public on(event: "auth", listener: (session: Session) => void): this;
    public on(event: "listening", listener: (e: ServerListeningEvent) => void): this;
    public on(event: "connect", listener: (e: Session) => void): this;
    public on(event: "disconnect", listener: (e: ServerDisconnectEvent) => void): this;
    public on(event: "error", listener: (e: ServerErrorEvent) => void): this;
    public on(event: "message", listener: (e: ServerMessageEvent) => void): this;
    public on(event: "info", listener: (message: string) => void): this;

    public once(event: "auth", listener: (session: Session) => void): this;
    public once(event: "listening", listener: (e: ServerListeningEvent) => void): this;
    public once(event: "connect", listener: (e: Session) => void): this;
    public once(event: "disconnect", listener: (e: ServerDisconnectEvent) => void): this;
    public once(event: "error", listener: (e: ServerErrorEvent) => void): this;
    public once(event: "message", listener: (e: ServerMessageEvent) => void): this;
    public once(event: "info", listener: (message: string) => void): this;

    public listen(address: string): this;
    public send(session: Session, data: ObjectProto | ArrayBuffer): Promise<void>;

}

export interface PCSCCard {
    /**
     * Name of PCSC reader
     */
    reader: string;
    /**
     * ATR of device
     */
    atr: Buffer;
}

export interface IServerProvider {
    /**
     * Path to PKCS#11 lib
     */
    lib: string;
    /**
     * indexes of using slots. Default [0]
     */
    slots?: number[];
}

export interface IProviderConfig {
    /**
     * List of addition providers
     */
    providers?: IServerProvider[];
    /**
     * Path to card.json
     */
    cards: string;
}

export interface IServerOptions extends https.ServerOptions {
    config: IProviderConfig;
}

/**
 * Local server
 *
 * @export
 * @class LocalServer
 * @extends {EventEmitter}
 */
export class LocalServer extends EventEmitter {

    /**
     * Server
     *
     * @type {Server}
     * @memberof LocalServer
     */
    public server: Server;
    // public provider: LocalProvider;
    public cryptos: { [id: string]: Crypto };
    public sessions: Session[];

    constructor(options: IServerOptions);

    public listen(address: string): this;

    public on(event: "info", cb: (message: string) => void): this;
    public on(event: "listening", cb: Function): this;
    public on(event: "token_new", cb: (card: PCSCCard) => void): this;
    public on(event: "error", cb: Function): this;
    public on(event: "close", cb: Function): this;
    public on(event: "notify", cb: Function): this;
}