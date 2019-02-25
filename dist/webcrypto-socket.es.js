import { getEngine, Identity, RemoteIdentity, AsymmetricRatchet, PreKeyBundleProtocol, MessageSignedProtocol } from '2key-ratchet';
export { setEngine, getEngine } from '2key-ratchet';
import { EventEmitter } from 'events';
import { Convert, assign } from 'pvtsutils';
import { __decorate } from 'tslib';
import { ProtobufProperty, ProtobufElement, ArrayBufferConverter, ObjectProto } from 'tsprotobuf';
import { openDb } from 'idb';
import { BufferSourceConverter, PemConverter } from 'webcrypto-core';

class Event {
    constructor(target, event) {
        this.target = target;
        this.event = event;
    }
}

var WebCryptoLocalErrorEnum;
(function (WebCryptoLocalErrorEnum) {
    WebCryptoLocalErrorEnum[WebCryptoLocalErrorEnum["UNKNOWN"] = 0] = "UNKNOWN";
    WebCryptoLocalErrorEnum[WebCryptoLocalErrorEnum["METHOD_NOT_IMPLEMENTED"] = 1] = "METHOD_NOT_IMPLEMENTED";
    WebCryptoLocalErrorEnum[WebCryptoLocalErrorEnum["CASE_ERROR"] = 2] = "CASE_ERROR";
    WebCryptoLocalErrorEnum[WebCryptoLocalErrorEnum["RATCHET_COMMON"] = 100] = "RATCHET_COMMON";
    WebCryptoLocalErrorEnum[WebCryptoLocalErrorEnum["RATCHET_KEY_NOT_APPROVED"] = 101] = "RATCHET_KEY_NOT_APPROVED";
    WebCryptoLocalErrorEnum[WebCryptoLocalErrorEnum["ACTION_COMMON"] = 200] = "ACTION_COMMON";
    WebCryptoLocalErrorEnum[WebCryptoLocalErrorEnum["ACTION_NOT_IMPLEMENTED"] = 201] = "ACTION_NOT_IMPLEMENTED";
    WebCryptoLocalErrorEnum[WebCryptoLocalErrorEnum["ACTION_NOT_SUPPORTED"] = 202] = "ACTION_NOT_SUPPORTED";
    WebCryptoLocalErrorEnum[WebCryptoLocalErrorEnum["CARD_CONFIG_COMMON"] = 300] = "CARD_CONFIG_COMMON";
    WebCryptoLocalErrorEnum[WebCryptoLocalErrorEnum["MEMORY_STORAGE_COMMON"] = 350] = "MEMORY_STORAGE_COMMON";
    WebCryptoLocalErrorEnum[WebCryptoLocalErrorEnum["MEMORY_STORAGE_OUT_OF_INDEX"] = 351] = "MEMORY_STORAGE_OUT_OF_INDEX";
    WebCryptoLocalErrorEnum[WebCryptoLocalErrorEnum["PROVIDER_COMMON"] = 400] = "PROVIDER_COMMON";
    WebCryptoLocalErrorEnum[WebCryptoLocalErrorEnum["PROVIDER_INIT"] = 401] = "PROVIDER_INIT";
    WebCryptoLocalErrorEnum[WebCryptoLocalErrorEnum["PROVIDER_CRYPTO_NOT_FOUND"] = 402] = "PROVIDER_CRYPTO_NOT_FOUND";
    WebCryptoLocalErrorEnum[WebCryptoLocalErrorEnum["PROVIDER_CRYPTO_WRONG"] = 403] = "PROVIDER_CRYPTO_WRONG";
    WebCryptoLocalErrorEnum[WebCryptoLocalErrorEnum["PROVIDER_NOT_FOUND"] = 404] = "PROVIDER_NOT_FOUND";
    WebCryptoLocalErrorEnum[WebCryptoLocalErrorEnum["PROVIDER_WRONG_LIBRARY"] = 405] = "PROVIDER_WRONG_LIBRARY";
    WebCryptoLocalErrorEnum[WebCryptoLocalErrorEnum["TOKEN_COMMON"] = 500] = "TOKEN_COMMON";
    WebCryptoLocalErrorEnum[WebCryptoLocalErrorEnum["TOKEN_REMOVE_TOKEN_READING"] = 501] = "TOKEN_REMOVE_TOKEN_READING";
    WebCryptoLocalErrorEnum[WebCryptoLocalErrorEnum["TOKEN_REMOVE_NO_SLOTS_FOUND"] = 502] = "TOKEN_REMOVE_NO_SLOTS_FOUND";
    WebCryptoLocalErrorEnum[WebCryptoLocalErrorEnum["SERVER_COMMON"] = 600] = "SERVER_COMMON";
    WebCryptoLocalErrorEnum[WebCryptoLocalErrorEnum["SERVER_WRONG_MESSAGE"] = 601] = "SERVER_WRONG_MESSAGE";
    WebCryptoLocalErrorEnum[WebCryptoLocalErrorEnum["SERVER_NOT_LOGGED_IN"] = 602] = "SERVER_NOT_LOGGED_IN";
    WebCryptoLocalErrorEnum[WebCryptoLocalErrorEnum["PCSC_COMMON"] = 700] = "PCSC_COMMON";
    WebCryptoLocalErrorEnum[WebCryptoLocalErrorEnum["PCSC_CANNOT_START"] = 701] = "PCSC_CANNOT_START";
})(WebCryptoLocalErrorEnum || (WebCryptoLocalErrorEnum = {}));
class WebCryptoLocalError extends Error {
    constructor(param, message = "") {
        super();
        this.code = 0;
        this.type = "wcl";
        const CODE = WebCryptoLocalError.CODE;
        if (typeof param === "number") {
            this.message = message || CODE[param] || CODE[0];
            this.code = param;
        }
        else {
            this.code = 0;
            this.message = message;
        }
        const error = new Error(this.message);
        error.name = this.constructor.name;
        this.stack = error.stack;
    }
    static isError(obj) {
        if (obj instanceof Error && obj.hasOwnProperty("code") && obj.hasOwnProperty("type")) {
            return true;
        }
        return false;
    }
}
WebCryptoLocalError.CODE = WebCryptoLocalErrorEnum;

class DateConverter {
    static async set(value) {
        return new Uint8Array(Convert.FromUtf8String(value.toISOString()));
    }
    static async get(value) {
        return new Date(Convert.ToUtf8String(value));
    }
}
class HexStringConverter {
    static async set(value) {
        return new Uint8Array(Convert.FromHex(value));
    }
    static async get(value) {
        return Convert.ToHex(value);
    }
}

var BaseProto_1, ActionProto_1, BaseAlgorithmProto_1, AlgorithmProto_1, CryptoItemProto_1, CryptoKeyProto_1, CryptoKeyPairProto_1, ErrorProto_1, ResultProto_1;
let BaseProto = BaseProto_1 = class BaseProto extends ObjectProto {
};
BaseProto.INDEX = 1;
__decorate([
    ProtobufProperty({ id: BaseProto_1.INDEX++, type: "uint32", required: true, defaultValue: 1 })
], BaseProto.prototype, "version", void 0);
BaseProto = BaseProto_1 = __decorate([
    ProtobufElement({ name: "BaseMessage" })
], BaseProto);
let ActionProto = ActionProto_1 = class ActionProto extends BaseProto {
    constructor() {
        super();
        this.action = this.constructor.ACTION;
    }
};
ActionProto.INDEX = BaseProto.INDEX;
ActionProto.ACTION = "action";
__decorate([
    ProtobufProperty({ id: ActionProto_1.INDEX++, type: "string", required: true })
], ActionProto.prototype, "action", void 0);
__decorate([
    ProtobufProperty({ id: ActionProto_1.INDEX++, type: "string", required: false })
], ActionProto.prototype, "actionId", void 0);
ActionProto = ActionProto_1 = __decorate([
    ProtobufElement({ name: "Action" })
], ActionProto);
let BaseAlgorithmProto = BaseAlgorithmProto_1 = class BaseAlgorithmProto extends BaseProto {
    toAlgorithm() {
        return { name: this.name };
    }
    fromAlgorithm(alg) {
        this.name = alg.name;
    }
};
BaseAlgorithmProto.INDEX = BaseProto.INDEX;
__decorate([
    ProtobufProperty({ id: BaseAlgorithmProto_1.INDEX++, type: "string", required: true })
], BaseAlgorithmProto.prototype, "name", void 0);
BaseAlgorithmProto = BaseAlgorithmProto_1 = __decorate([
    ProtobufElement({ name: "BaseAlgorithm" })
], BaseAlgorithmProto);
let AlgorithmProto = AlgorithmProto_1 = class AlgorithmProto extends BaseAlgorithmProto {
    toAlgorithm() {
        const res = {};
        const thisStatic = this.constructor;
        for (const key in thisStatic.items) {
            if (key === "version") {
                continue;
            }
            const value = this[key];
            if (value !== void 0) {
                if (value instanceof BaseAlgorithmProto) {
                    if (!value.isEmpty()) {
                        res[key] = value.toAlgorithm();
                    }
                }
                else {
                    res[key] = value;
                }
            }
        }
        return res;
    }
    fromAlgorithm(alg) {
        if (alg instanceof AlgorithmProto_1) {
            alg = alg.toAlgorithm();
        }
        const thisStatic = this.constructor;
        for (const key in alg) {
            if (key in thisStatic.items) {
                if (thisStatic.items[key].parser) {
                    switch (thisStatic.items[key].parser) {
                        case BaseAlgorithmProto: {
                            this[key].fromAlgorithm(alg[key]);
                            break;
                        }
                        default:
                            throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CASE_ERROR, `Unsupported parser '${thisStatic.items[key].parser.name}'`);
                    }
                }
                else {
                    this[key] = alg[key];
                }
            }
        }
    }
};
AlgorithmProto.INDEX = BaseAlgorithmProto.INDEX;
__decorate([
    ProtobufProperty({ id: AlgorithmProto_1.INDEX++, type: "bytes", parser: BaseAlgorithmProto })
], AlgorithmProto.prototype, "hash", void 0);
__decorate([
    ProtobufProperty({ id: AlgorithmProto_1.INDEX++, type: "bytes" })
], AlgorithmProto.prototype, "publicExponent", void 0);
__decorate([
    ProtobufProperty({ id: AlgorithmProto_1.INDEX++, type: "uint32" })
], AlgorithmProto.prototype, "modulusLength", void 0);
__decorate([
    ProtobufProperty({ id: AlgorithmProto_1.INDEX++, type: "uint32" })
], AlgorithmProto.prototype, "saltLength", void 0);
__decorate([
    ProtobufProperty({ id: AlgorithmProto_1.INDEX++, type: "bytes" })
], AlgorithmProto.prototype, "label", void 0);
__decorate([
    ProtobufProperty({ id: AlgorithmProto_1.INDEX++, type: "string" })
], AlgorithmProto.prototype, "namedCurve", void 0);
__decorate([
    ProtobufProperty({ id: AlgorithmProto_1.INDEX++, converter: ArrayBufferConverter })
], AlgorithmProto.prototype, "public", void 0);
__decorate([
    ProtobufProperty({ id: AlgorithmProto_1.INDEX++, type: "uint32" })
], AlgorithmProto.prototype, "length", void 0);
__decorate([
    ProtobufProperty({ id: AlgorithmProto_1.INDEX++ })
], AlgorithmProto.prototype, "iv", void 0);
AlgorithmProto = AlgorithmProto_1 = __decorate([
    ProtobufElement({ name: "Algorithm" })
], AlgorithmProto);
let CryptoItemProto = CryptoItemProto_1 = class CryptoItemProto extends BaseProto {
};
CryptoItemProto.INDEX = BaseProto.INDEX;
__decorate([
    ProtobufProperty({ id: CryptoItemProto_1.INDEX++, type: "string", required: true })
], CryptoItemProto.prototype, "providerID", void 0);
__decorate([
    ProtobufProperty({ id: CryptoItemProto_1.INDEX++, type: "bytes", required: true, converter: HexStringConverter })
], CryptoItemProto.prototype, "id", void 0);
__decorate([
    ProtobufProperty({ id: CryptoItemProto_1.INDEX++, type: "string", required: true })
], CryptoItemProto.prototype, "type", void 0);
CryptoItemProto = CryptoItemProto_1 = __decorate([
    ProtobufElement({ name: "CryptoItem" })
], CryptoItemProto);
let CryptoKeyProto = CryptoKeyProto_1 = class CryptoKeyProto extends CryptoItemProto {
};
CryptoKeyProto.INDEX = CryptoItemProto.INDEX;
__decorate([
    ProtobufProperty({ id: CryptoKeyProto_1.INDEX++, type: "bytes", required: true, parser: AlgorithmProto })
], CryptoKeyProto.prototype, "algorithm", void 0);
__decorate([
    ProtobufProperty({ id: CryptoKeyProto_1.INDEX++, type: "bool" })
], CryptoKeyProto.prototype, "extractable", void 0);
__decorate([
    ProtobufProperty({ id: CryptoKeyProto_1.INDEX++, type: "string", repeated: true })
], CryptoKeyProto.prototype, "usages", void 0);
CryptoKeyProto = CryptoKeyProto_1 = __decorate([
    ProtobufElement({ name: "CryptoKey" })
], CryptoKeyProto);
let CryptoKeyPairProto = CryptoKeyPairProto_1 = class CryptoKeyPairProto extends BaseProto {
};
CryptoKeyPairProto.INDEX = BaseProto.INDEX;
__decorate([
    ProtobufProperty({ id: CryptoKeyPairProto_1.INDEX++, name: "privateKey", type: "bytes", parser: CryptoKeyProto })
], CryptoKeyPairProto.prototype, "privateKey", void 0);
__decorate([
    ProtobufProperty({ id: CryptoKeyPairProto_1.INDEX++, name: "publicKey", type: "bytes", parser: CryptoKeyProto })
], CryptoKeyPairProto.prototype, "publicKey", void 0);
CryptoKeyPairProto = CryptoKeyPairProto_1 = __decorate([
    ProtobufElement({ name: "CryptoKeyPair" })
], CryptoKeyPairProto);
let ErrorProto = ErrorProto_1 = class ErrorProto extends BaseProto {
    constructor(message, code = 0, type = "error") {
        super();
        if (message) {
            this.message = message;
            this.code = code;
            this.type = type;
        }
    }
};
ErrorProto.INDEX = BaseProto.INDEX;
__decorate([
    ProtobufProperty({ id: ErrorProto_1.INDEX++, type: "uint32", defaultValue: 0 })
], ErrorProto.prototype, "code", void 0);
__decorate([
    ProtobufProperty({ id: ErrorProto_1.INDEX++, type: "string", defaultValue: "error" })
], ErrorProto.prototype, "type", void 0);
__decorate([
    ProtobufProperty({ id: ErrorProto_1.INDEX++, type: "string", defaultValue: "" })
], ErrorProto.prototype, "message", void 0);
ErrorProto = ErrorProto_1 = __decorate([
    ProtobufElement({ name: "Error" })
], ErrorProto);
let ResultProto = ResultProto_1 = class ResultProto extends ActionProto {
    constructor(proto) {
        super();
        if (proto) {
            this.actionId = proto.actionId;
            this.action = proto.action;
        }
    }
};
ResultProto.INDEX = ActionProto.INDEX;
__decorate([
    ProtobufProperty({ id: ResultProto_1.INDEX++, type: "bool", defaultValue: false })
], ResultProto.prototype, "status", void 0);
__decorate([
    ProtobufProperty({ id: ResultProto_1.INDEX++, type: "bytes", parser: ErrorProto })
], ResultProto.prototype, "error", void 0);
__decorate([
    ProtobufProperty({ id: ResultProto_1.INDEX++, type: "bytes", converter: ArrayBufferConverter })
], ResultProto.prototype, "data", void 0);
ResultProto = ResultProto_1 = __decorate([
    ProtobufElement({ name: "Result" })
], ResultProto);
let AuthRequestProto = class AuthRequestProto extends ActionProto {
};
AuthRequestProto.INDEX = ActionProto.INDEX;
AuthRequestProto.ACTION = "auth";
AuthRequestProto = __decorate([
    ProtobufElement({ name: "AuthRequest" })
], AuthRequestProto);
let ServerLoginActionProto = class ServerLoginActionProto extends ActionProto {
};
ServerLoginActionProto.INDEX = ActionProto.INDEX;
ServerLoginActionProto.ACTION = "server/login";
ServerLoginActionProto = __decorate([
    ProtobufElement({})
], ServerLoginActionProto);
let ServerIsLoggedInActionProto = class ServerIsLoggedInActionProto extends ActionProto {
};
ServerIsLoggedInActionProto.INDEX = ActionProto.INDEX;
ServerIsLoggedInActionProto.ACTION = "server/isLoggedIn";
ServerIsLoggedInActionProto = __decorate([
    ProtobufElement({})
], ServerIsLoggedInActionProto);

async function challenge(serverIdentity, clientIdentity) {
    const serverIdentityDigest = await serverIdentity.thumbprint();
    const clientIdentityDigest = await clientIdentity.thumbprint();
    const combinedIdentity = Convert.FromHex(serverIdentityDigest + clientIdentityDigest);
    const digest = await getEngine().crypto.subtle.digest("SHA-256", combinedIdentity);
    return parseInt(Convert.ToHex(digest), 16).toString().substr(2, 6);
}

const SERVER_WELL_KNOWN = "/.well-known/webcrypto-socket";

function isFirefox() {
    return /firefox/i.test(self.navigator.userAgent);
}
function isEdge() {
    return /edge\/([\d\.]+)/i.test(self.navigator.userAgent);
}
const ECDH = { name: "ECDH", namedCurve: "P-256" };
const ECDSA = { name: "ECDSA", namedCurve: "P-256" };
const AES_CBC = { name: "AES-CBC", iv: new ArrayBuffer(16) };
async function createEcPublicKey(publicKey) {
    const algName = publicKey.algorithm.name.toUpperCase();
    if (!(algName === "ECDH" || algName === "ECDSA")) {
        throw new Error("Error: Unsupported asymmetric key algorithm.");
    }
    if (publicKey.type !== "public") {
        throw new Error("Error: Expected key type to be public but it was not.");
    }
    const jwk = await getEngine().crypto.subtle.exportKey("jwk", publicKey);
    if (!(jwk.x && jwk.y)) {
        throw new Error("Wrong JWK data for EC public key. Parameters x and y are required.");
    }
    const x = Convert.FromBase64Url(jwk.x);
    const y = Convert.FromBase64Url(jwk.y);
    const xy = Convert.ToBinary(x) + Convert.ToBinary(y);
    const key = publicKey;
    const serialized = Convert.FromBinary(xy);
    const id = Convert.ToHex(await getEngine().crypto.subtle.digest("SHA-256", serialized));
    return {
        id,
        key,
        serialized,
    };
}
async function updateEcPublicKey(ecPublicKey, publicKey) {
    const data = await createEcPublicKey(publicKey);
    ecPublicKey.id = data.id;
    ecPublicKey.key = data.key;
    ecPublicKey.serialized = data.serialized;
}

class BrowserStorage {
    constructor(db) {
        this.db = db;
    }
    static async create() {
        const db = await openDb(this.STORAGE_NAME, 1, (updater) => {
            updater.createObjectStore(this.SESSION_STORAGE);
            updater.createObjectStore(this.IDENTITY_STORAGE);
            updater.createObjectStore(this.REMOTE_STORAGE);
        });
        return new BrowserStorage(db);
    }
    async loadWrapKey() {
        const wKey = await this.db.transaction(BrowserStorage.IDENTITY_STORAGE)
            .objectStore(BrowserStorage.IDENTITY_STORAGE).get("wkey");
        if (wKey) {
            if (isEdge()) {
                if (!(wKey.key instanceof ArrayBuffer)) {
                    return null;
                }
                wKey.key = await getEngine().crypto.subtle.importKey("raw", wKey.key, { name: AES_CBC.name, length: 256 }, false, ["encrypt", "decrypt", "wrapKey", "unwrapKey"]);
            }
            AES_CBC.iv = wKey.iv;
        }
        return wKey || null;
    }
    async saveWrapKey(key) {
        if (isEdge()) {
            key = {
                key: await getEngine().crypto.subtle.exportKey("raw", key.key),
                iv: key.iv,
            };
        }
        const tx = this.db.transaction(BrowserStorage.IDENTITY_STORAGE, "readwrite");
        tx.objectStore(BrowserStorage.IDENTITY_STORAGE).put(key, "wkey");
        return tx.complete;
    }
    async loadIdentity() {
        const json = await this.db.transaction(BrowserStorage.IDENTITY_STORAGE)
            .objectStore(BrowserStorage.IDENTITY_STORAGE).get("identity");
        let res = null;
        if (json) {
            if (isFirefox() || isEdge()) {
                const wkey = await this.loadWrapKey();
                if (!(wkey && wkey.key.usages.some((usage) => usage === "encrypt")
                    && json.exchangeKey.privateKey instanceof ArrayBuffer)) {
                    return null;
                }
                json.exchangeKey.privateKey = await getEngine().crypto.subtle.decrypt(AES_CBC, wkey.key, json.exchangeKey.privateKey)
                    .then((buf) => getEngine().crypto.subtle.importKey("jwk", JSON.parse(Convert.ToUtf8String(buf)), ECDH, false, ["deriveKey", "deriveBits"]));
                json.signingKey.privateKey = await getEngine().crypto.subtle.decrypt(AES_CBC, wkey.key, json.signingKey.privateKey)
                    .then((buf) => getEngine().crypto.subtle.importKey("jwk", JSON.parse(Convert.ToUtf8String(buf)), ECDSA, false, ["sign"]));
                if (isEdge()) {
                    json.exchangeKey.publicKey = await getEngine().crypto.subtle.unwrapKey("jwk", json.exchangeKey.publicKey, wkey.key, AES_CBC, ECDH, true, []);
                    json.signingKey.publicKey = await getEngine().crypto.subtle.unwrapKey("jwk", json.signingKey.publicKey, wkey.key, AES_CBC, ECDSA, true, ["verify"]);
                }
            }
            res = await Identity.fromJSON(json);
        }
        return res;
    }
    async saveIdentity(value) {
        let wkey;
        if (isFirefox() || isEdge()) {
            wkey = {
                key: await getEngine().crypto.subtle.generateKey({ name: AES_CBC.name, length: 256 }, isEdge(), ["wrapKey", "unwrapKey", "encrypt", "decrypt"]),
                iv: getEngine().crypto.getRandomValues(new Uint8Array(AES_CBC.iv)).buffer,
            };
            await this.saveWrapKey(wkey);
            const exchangeKeyPair = await getEngine().crypto.subtle
                .generateKey(value.exchangeKey.privateKey.algorithm, true, ["deriveKey", "deriveBits"]);
            value.exchangeKey.privateKey = exchangeKeyPair.privateKey;
            await updateEcPublicKey(value.exchangeKey.publicKey, exchangeKeyPair.publicKey);
            const signingKeyPair = await getEngine().crypto.subtle
                .generateKey(value.signingKey.privateKey.algorithm, true, ["sign", "verify"]);
            value.signingKey.privateKey = signingKeyPair.privateKey;
            await updateEcPublicKey(value.signingKey.publicKey, signingKeyPair.publicKey);
        }
        const json = await value.toJSON();
        if (isFirefox() || isEdge()) {
            json.exchangeKey.privateKey = await getEngine().crypto.subtle.wrapKey("jwk", value.exchangeKey.privateKey, wkey.key, AES_CBC);
            json.signingKey.privateKey = await getEngine().crypto.subtle.wrapKey("jwk", value.signingKey.privateKey, wkey.key, AES_CBC);
            if (isEdge()) {
                json.exchangeKey.publicKey = await getEngine().crypto.subtle.wrapKey("jwk", value.exchangeKey.publicKey.key, wkey.key, AES_CBC);
                json.signingKey.publicKey = await getEngine().crypto.subtle.wrapKey("jwk", value.signingKey.publicKey.key, wkey.key, AES_CBC);
            }
        }
        const tx = this.db.transaction(BrowserStorage.IDENTITY_STORAGE, "readwrite");
        tx.objectStore(BrowserStorage.IDENTITY_STORAGE).put(json, "identity");
        return tx.complete;
    }
    async loadRemoteIdentity(key) {
        const json = await this.db.transaction(BrowserStorage.REMOTE_STORAGE)
            .objectStore(BrowserStorage.REMOTE_STORAGE).get(key);
        let res = null;
        if (json) {
            res = await RemoteIdentity.fromJSON(json);
        }
        return res;
    }
    async saveRemoteIdentity(key, value) {
        const json = await value.toJSON();
        const tx = this.db.transaction(BrowserStorage.REMOTE_STORAGE, "readwrite");
        tx.objectStore(BrowserStorage.REMOTE_STORAGE).put(json, key);
        return tx.complete;
    }
    async loadSession(key) {
        const json = await this.db.transaction(BrowserStorage.SESSION_STORAGE)
            .objectStore(BrowserStorage.SESSION_STORAGE).get(key);
        let res = null;
        if (json) {
            const identity = await this.loadIdentity();
            if (!identity) {
                throw new Error("Identity is empty");
            }
            const remoteIdentity = await this.loadRemoteIdentity(key);
            if (!remoteIdentity) {
                throw new Error("Remote identity is not found");
            }
            res = await AsymmetricRatchet.fromJSON(identity, remoteIdentity, json);
        }
        return res;
    }
    async saveSession(key, value) {
        const json = await value.toJSON();
        const tx = this.db.transaction(BrowserStorage.SESSION_STORAGE, "readwrite");
        tx.objectStore(BrowserStorage.SESSION_STORAGE).put(json, key);
        return tx.complete;
    }
}
BrowserStorage.STORAGE_NAME = "webcrypto-remote";
BrowserStorage.IDENTITY_STORAGE = "identity";
BrowserStorage.SESSION_STORAGE = "sessions";
BrowserStorage.REMOTE_STORAGE = "remoteIdentity";

class ClientEvent extends Event {
}
class ClientListeningEvent extends ClientEvent {
    constructor(target, address) {
        super(target, "listening");
        this.address = address;
    }
}
class ClientCloseEvent extends ClientEvent {
    constructor(target, remoteAddress, reasonCode, description) {
        super(target, "close");
        this.remoteAddress = remoteAddress;
        this.reasonCode = reasonCode;
        this.description = description;
    }
}
class ClientErrorEvent extends ClientEvent {
    constructor(target, error) {
        super(target, "error");
        this.error = error;
    }
}
var SocketCryptoState;
(function (SocketCryptoState) {
    SocketCryptoState[SocketCryptoState["connecting"] = 0] = "connecting";
    SocketCryptoState[SocketCryptoState["open"] = 1] = "open";
    SocketCryptoState[SocketCryptoState["closing"] = 2] = "closing";
    SocketCryptoState[SocketCryptoState["closed"] = 3] = "closed";
})(SocketCryptoState || (SocketCryptoState = {}));
function getXmlHttp() {
    let xmlHttp;
    try {
        xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
    }
    catch (e) {
        try {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        catch (e) {
        }
    }
    if (!xmlHttp && typeof XMLHttpRequest !== "undefined") {
        xmlHttp = new XMLHttpRequest();
    }
    return xmlHttp;
}
class Client extends EventEmitter {
    constructor() {
        super();
        this.stack = {};
        this.messageCounter = 0;
    }
    get state() {
        if (this.socket) {
            return this.socket.readyState;
        }
        else {
            return SocketCryptoState.closed;
        }
    }
    connect(address) {
        this.getServerInfo(address)
            .then((info) => {
            this.serviceInfo = info;
            this.socket = new WebSocket(`wss://${address}`);
            this.socket.binaryType = "arraybuffer";
            this.socket.onerror = (e) => {
                this.emit("error", new ClientErrorEvent(this, e.error));
            };
            this.socket.onopen = (e) => {
                (async () => {
                    const storage = await BrowserStorage.create();
                    let identity = await storage.loadIdentity();
                    if (!identity) {
                        if (self.PV_WEBCRYPTO_SOCKET_LOG) {
                            console.info("Generates new identity");
                        }
                        identity = await Identity.create(1);
                        await storage.saveIdentity(identity);
                    }
                    const remoteIdentityId = "0";
                    const bundle = await PreKeyBundleProtocol.importProto(Convert.FromBase64(info.preKey));
                    this.cipher = await AsymmetricRatchet.create(identity, bundle);
                    await storage.saveRemoteIdentity(remoteIdentityId, this.cipher.remoteIdentity);
                    this.emit("listening", new ClientListeningEvent(this, address));
                })().catch((error) => this.emit("error", new ClientErrorEvent(this, error)));
            };
            this.socket.onclose = (e) => {
                for (const actionId in this.stack) {
                    const message = this.stack[actionId];
                    message.reject(new Error("Cannot finish operation. Session was closed"));
                }
                this.emit("close", new ClientCloseEvent(this, address, e.code, e.reason));
            };
            this.socket.onmessage = (e) => {
                if (e.data instanceof ArrayBuffer) {
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
    close() {
        this.socket.close();
    }
    on(event, listener) {
        return super.on(event, listener);
    }
    once(event, listener) {
        return super.once(event, listener);
    }
    async challenge() {
        return challenge(this.cipher.remoteIdentity.signingKey, this.cipher.identity.signingKey.publicKey);
    }
    async isLoggedIn() {
        const action = new ServerIsLoggedInActionProto();
        const data = await this.send(action);
        return data ? !!(new Uint8Array(data)[0]) : false;
    }
    async login() {
        const action = new ServerLoginActionProto();
        await this.send(action);
    }
    send(data) {
        return new Promise((resolve, reject) => {
            this.checkSocketState();
            if (!data) {
                data = new ActionProto();
            }
            data.action = data.action;
            data.actionId = (this.messageCounter++).toString();
            data.exportProto()
                .then((raw) => {
                return this.cipher.encrypt(raw)
                    .then((msg) => msg.exportProto());
            })
                .then((raw) => {
                this.stack[data.actionId] = { resolve, reject };
                this.socket.send(raw);
            })
                .catch(reject);
        });
    }
    getServerInfo(address) {
        return new Promise((resolve, reject) => {
            const url = `https://${address}${SERVER_WELL_KNOWN}`;
            if (self.fetch) {
                fetch(url)
                    .then((response) => {
                    if (response.status !== 200) {
                        throw new Error("Cannot get wellknown link");
                    }
                    else {
                        return response.json();
                    }
                })
                    .then(resolve)
                    .catch(reject);
            }
            else {
                const xmlHttp = getXmlHttp();
                xmlHttp.open("GET", `http://${address}${SERVER_WELL_KNOWN}`, true);
                xmlHttp.responseType = "text";
                xmlHttp.onreadystatechange = () => {
                    if (xmlHttp.readyState === 4) {
                        if (xmlHttp.status === 200) {
                            const json = JSON.parse(xmlHttp.responseText);
                            resolve(json);
                        }
                        else {
                            reject(new Error("Cannot GET response"));
                        }
                    }
                };
                xmlHttp.send(null);
            }
        });
    }
    checkSocketState() {
        if (this.state !== SocketCryptoState.open) {
            throw new Error("Socket connection is not open");
        }
    }
    async onMessage(message) {
        const proto = await ActionProto.importProto(message);
        if (self.PV_WEBCRYPTO_SOCKET_LOG) {
            console.info("Action:", proto.action);
        }
        const promise = this.stack[proto.actionId];
        if (promise) {
            delete this.stack[proto.actionId];
            const messageProto = await ResultProto.importProto(await proto.exportProto());
            if (messageProto.error && messageProto.error.message) {
                const errorProto = messageProto.error;
                const error = new Error(messageProto.error.message);
                error.code = errorProto.code;
                error.type = errorProto.type;
                promise.reject(error);
            }
            else {
                promise.resolve(messageProto.data);
            }
        }
        else {
            this.emit("event", proto);
        }
    }
}

var ProviderCryptoProto_1, ProviderInfoProto_1, ProviderGetCryptoActionProto_1, ProviderTokenEventProto_1;
let ProviderCryptoProto = ProviderCryptoProto_1 = class ProviderCryptoProto extends BaseProto {
    constructor(data) {
        super();
        if (data) {
            assign(this, data);
        }
    }
};
ProviderCryptoProto.INDEX = BaseProto.INDEX;
__decorate([
    ProtobufProperty({ id: ProviderCryptoProto_1.INDEX++, required: true, type: "string" })
], ProviderCryptoProto.prototype, "id", void 0);
__decorate([
    ProtobufProperty({ id: ProviderCryptoProto_1.INDEX++, required: true, type: "string" })
], ProviderCryptoProto.prototype, "name", void 0);
__decorate([
    ProtobufProperty({ id: ProviderCryptoProto_1.INDEX++, type: "bool", defaultValue: false })
], ProviderCryptoProto.prototype, "readOnly", void 0);
__decorate([
    ProtobufProperty({ id: ProviderCryptoProto_1.INDEX++, repeated: true, type: "string" })
], ProviderCryptoProto.prototype, "algorithms", void 0);
__decorate([
    ProtobufProperty({ id: ProviderCryptoProto_1.INDEX++, type: "bool", defaultValue: false })
], ProviderCryptoProto.prototype, "isRemovable", void 0);
__decorate([
    ProtobufProperty({ id: ProviderCryptoProto_1.INDEX++, type: "string" })
], ProviderCryptoProto.prototype, "atr", void 0);
__decorate([
    ProtobufProperty({ id: ProviderCryptoProto_1.INDEX++, type: "bool", defaultValue: false })
], ProviderCryptoProto.prototype, "isHardware", void 0);
ProviderCryptoProto = ProviderCryptoProto_1 = __decorate([
    ProtobufElement({})
], ProviderCryptoProto);
let ProviderInfoProto = ProviderInfoProto_1 = class ProviderInfoProto extends BaseProto {
};
ProviderInfoProto.INDEX = BaseProto.INDEX;
__decorate([
    ProtobufProperty({ id: ProviderInfoProto_1.INDEX++, type: "string", required: true })
], ProviderInfoProto.prototype, "name", void 0);
__decorate([
    ProtobufProperty({ id: ProviderInfoProto_1.INDEX++, repeated: true, parser: ProviderCryptoProto })
], ProviderInfoProto.prototype, "providers", void 0);
ProviderInfoProto = ProviderInfoProto_1 = __decorate([
    ProtobufElement({})
], ProviderInfoProto);
let ProviderInfoActionProto = class ProviderInfoActionProto extends ActionProto {
};
ProviderInfoActionProto.INDEX = ActionProto.INDEX;
ProviderInfoActionProto.ACTION = "provider/action/info";
ProviderInfoActionProto = __decorate([
    ProtobufElement({})
], ProviderInfoActionProto);
let ProviderGetCryptoActionProto = ProviderGetCryptoActionProto_1 = class ProviderGetCryptoActionProto extends ActionProto {
};
ProviderGetCryptoActionProto.INDEX = ActionProto.INDEX;
ProviderGetCryptoActionProto.ACTION = "provider/action/getCrypto";
__decorate([
    ProtobufProperty({ id: ProviderGetCryptoActionProto_1.INDEX++, required: true, type: "string" })
], ProviderGetCryptoActionProto.prototype, "cryptoID", void 0);
ProviderGetCryptoActionProto = ProviderGetCryptoActionProto_1 = __decorate([
    ProtobufElement({})
], ProviderGetCryptoActionProto);
let ProviderAuthorizedEventProto = class ProviderAuthorizedEventProto extends ActionProto {
};
ProviderAuthorizedEventProto.INDEX = ActionProto.INDEX;
ProviderAuthorizedEventProto.ACTION = "provider/event/authorized";
ProviderAuthorizedEventProto = __decorate([
    ProtobufElement({})
], ProviderAuthorizedEventProto);
let ProviderTokenEventProto = ProviderTokenEventProto_1 = class ProviderTokenEventProto extends ActionProto {
    constructor(data) {
        super();
        if (data) {
            assign(this, data);
        }
    }
};
ProviderTokenEventProto.INDEX = ActionProto.INDEX;
ProviderTokenEventProto.ACTION = "provider/event/token";
__decorate([
    ProtobufProperty({ id: ProviderTokenEventProto_1.INDEX++, repeated: true, parser: ProviderCryptoProto })
], ProviderTokenEventProto.prototype, "added", void 0);
__decorate([
    ProtobufProperty({ id: ProviderTokenEventProto_1.INDEX++, repeated: true, parser: ProviderCryptoProto })
], ProviderTokenEventProto.prototype, "removed", void 0);
__decorate([
    ProtobufProperty({ id: ProviderTokenEventProto_1.INDEX++, type: "bytes", parser: ErrorProto })
], ProviderTokenEventProto.prototype, "error", void 0);
ProviderTokenEventProto = ProviderTokenEventProto_1 = __decorate([
    ProtobufElement({ name: "ProviderTokenEvent" })
], ProviderTokenEventProto);

var CardReaderEventProto_1;
let CardReaderActionProto = class CardReaderActionProto extends ActionProto {
};
CardReaderActionProto.INDEX = ActionProto.INDEX;
CardReaderActionProto.ACTION = "cardReader";
CardReaderActionProto = __decorate([
    ProtobufElement({})
], CardReaderActionProto);
let CardReaderGetReadersActionProto = class CardReaderGetReadersActionProto extends ActionProto {
};
CardReaderGetReadersActionProto.INDEX = ActionProto.INDEX;
CardReaderGetReadersActionProto.ACTION = "cardReader/readers";
CardReaderGetReadersActionProto = __decorate([
    ProtobufElement({})
], CardReaderGetReadersActionProto);
let CardReaderEventProto = CardReaderEventProto_1 = class CardReaderEventProto extends CardReaderActionProto {
    static fromObject(e) {
        const res = new this();
        res.fromObject(e);
        return res;
    }
    fromObject(e) {
        this.reader = e.reader.name;
        this.atr = e.atr.toString("hex");
    }
};
CardReaderEventProto.INDEX = CardReaderActionProto.INDEX;
__decorate([
    ProtobufProperty({ id: CardReaderEventProto_1.INDEX++, required: true, type: "string", defaultValue: "" })
], CardReaderEventProto.prototype, "reader", void 0);
__decorate([
    ProtobufProperty({ id: CardReaderEventProto_1.INDEX++, required: true, converter: HexStringConverter })
], CardReaderEventProto.prototype, "atr", void 0);
CardReaderEventProto = CardReaderEventProto_1 = __decorate([
    ProtobufElement({})
], CardReaderEventProto);
let CardReaderInsertEventProto = class CardReaderInsertEventProto extends CardReaderEventProto {
};
CardReaderInsertEventProto.INDEX = CardReaderEventProto.INDEX;
CardReaderInsertEventProto.ACTION = CardReaderEventProto.ACTION + "/insert";
CardReaderInsertEventProto = __decorate([
    ProtobufElement({})
], CardReaderInsertEventProto);
let CardReaderRemoveEventProto = class CardReaderRemoveEventProto extends CardReaderEventProto {
};
CardReaderRemoveEventProto.INDEX = CardReaderEventProto.INDEX;
CardReaderRemoveEventProto.ACTION = CardReaderEventProto.ACTION + "/remove";
CardReaderRemoveEventProto = __decorate([
    ProtobufElement({})
], CardReaderRemoveEventProto);

class CardReader extends EventEmitter {
    constructor(client) {
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
    async readers() {
        const data = await this.client.send(new CardReaderGetReadersActionProto());
        return JSON.parse(Convert.ToString(data));
    }
    on(event, cb) {
        return super.on(event, cb);
    }
    emit(event, ...args) {
        return super.emit(event, ...args);
    }
    onEvent(actionProto) {
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
    onInsert(actionProto) {
        this.emit("insert", actionProto);
    }
    onRemove(actionProto) {
        this.emit("remove", actionProto);
    }
}

var CryptoActionProto_1;
let CryptoActionProto = CryptoActionProto_1 = class CryptoActionProto extends ActionProto {
};
CryptoActionProto.INDEX = ActionProto.INDEX;
CryptoActionProto.ACTION = "crypto";
__decorate([
    ProtobufProperty({ id: CryptoActionProto_1.INDEX++, required: true, type: "string" })
], CryptoActionProto.prototype, "providerID", void 0);
CryptoActionProto = CryptoActionProto_1 = __decorate([
    ProtobufElement({})
], CryptoActionProto);
let LoginActionProto = class LoginActionProto extends CryptoActionProto {
};
LoginActionProto.INDEX = CryptoActionProto.INDEX;
LoginActionProto.ACTION = "crypto/login";
LoginActionProto = __decorate([
    ProtobufElement({})
], LoginActionProto);
let LogoutActionProto = class LogoutActionProto extends CryptoActionProto {
};
LogoutActionProto.INDEX = CryptoActionProto.INDEX;
LogoutActionProto.ACTION = "crypto/logout";
LogoutActionProto = __decorate([
    ProtobufElement({})
], LogoutActionProto);
let IsLoggedInActionProto = class IsLoggedInActionProto extends CryptoActionProto {
};
IsLoggedInActionProto.INDEX = CryptoActionProto.INDEX;
IsLoggedInActionProto.ACTION = "crypto/isLoggedIn";
IsLoggedInActionProto = __decorate([
    ProtobufElement({})
], IsLoggedInActionProto);
let ResetActionProto = class ResetActionProto extends CryptoActionProto {
};
ResetActionProto.INDEX = CryptoActionProto.INDEX;
ResetActionProto.ACTION = "crypto/reset";
ResetActionProto = __decorate([
    ProtobufElement({})
], ResetActionProto);

var CryptoCertificateProto_1, CryptoX509CertificateProto_1, CryptoX509CertificateRequestProto_1, ChainItemProto_1, CertificateStorageGetChainResultProto_1, CertificateStorageSetItemActionProto_1, CertificateStorageGetItemActionProto_1, CertificateStorageRemoveItemActionProto_1, CertificateStorageImportActionProto_1, CertificateStorageExportActionProto_1, CertificateStorageIndexOfActionProto_1, CertificateStorageGetCRLActionProto_1, OCSPRequestOptionsProto_1, CertificateStorageGetOCSPActionProto_1;
let CryptoCertificateProto = CryptoCertificateProto_1 = class CryptoCertificateProto extends CryptoItemProto {
};
CryptoCertificateProto.INDEX = CryptoItemProto.INDEX;
__decorate([
    ProtobufProperty({ id: CryptoCertificateProto_1.INDEX++, required: true, converter: HexStringConverter })
], CryptoCertificateProto.prototype, "id", void 0);
__decorate([
    ProtobufProperty({ id: CryptoCertificateProto_1.INDEX++, required: true, parser: CryptoKeyProto })
], CryptoCertificateProto.prototype, "publicKey", void 0);
__decorate([
    ProtobufProperty({ id: CryptoCertificateProto_1.INDEX++, required: true, type: "string" })
], CryptoCertificateProto.prototype, "type", void 0);
CryptoCertificateProto = CryptoCertificateProto_1 = __decorate([
    ProtobufElement({})
], CryptoCertificateProto);
let CryptoX509CertificateProto = CryptoX509CertificateProto_1 = class CryptoX509CertificateProto extends CryptoCertificateProto {
    constructor() {
        super(...arguments);
        this.type = "x509";
    }
};
CryptoX509CertificateProto.INDEX = CryptoCertificateProto.INDEX;
__decorate([
    ProtobufProperty({ id: CryptoX509CertificateProto_1.INDEX++, required: true, converter: HexStringConverter })
], CryptoX509CertificateProto.prototype, "serialNumber", void 0);
__decorate([
    ProtobufProperty({ id: CryptoX509CertificateProto_1.INDEX++, required: true, type: "string" })
], CryptoX509CertificateProto.prototype, "issuerName", void 0);
__decorate([
    ProtobufProperty({ id: CryptoX509CertificateProto_1.INDEX++, required: true, type: "string" })
], CryptoX509CertificateProto.prototype, "subjectName", void 0);
__decorate([
    ProtobufProperty({ id: CryptoX509CertificateProto_1.INDEX++, required: true, converter: DateConverter })
], CryptoX509CertificateProto.prototype, "notBefore", void 0);
__decorate([
    ProtobufProperty({ id: CryptoX509CertificateProto_1.INDEX++, required: true, converter: DateConverter })
], CryptoX509CertificateProto.prototype, "notAfter", void 0);
CryptoX509CertificateProto = CryptoX509CertificateProto_1 = __decorate([
    ProtobufElement({})
], CryptoX509CertificateProto);
let CryptoX509CertificateRequestProto = CryptoX509CertificateRequestProto_1 = class CryptoX509CertificateRequestProto extends CryptoCertificateProto {
    constructor() {
        super(...arguments);
        this.type = "request";
    }
};
CryptoX509CertificateRequestProto.INDEX = CryptoCertificateProto.INDEX;
__decorate([
    ProtobufProperty({ id: CryptoX509CertificateRequestProto_1.INDEX++, required: true, type: "string" })
], CryptoX509CertificateRequestProto.prototype, "subjectName", void 0);
CryptoX509CertificateRequestProto = CryptoX509CertificateRequestProto_1 = __decorate([
    ProtobufElement({})
], CryptoX509CertificateRequestProto);
let ChainItemProto = ChainItemProto_1 = class ChainItemProto extends BaseProto {
};
ChainItemProto.INDEX = BaseProto.INDEX;
__decorate([
    ProtobufProperty({
        id: ChainItemProto_1.INDEX++,
        required: true,
        type: "string",
    })
], ChainItemProto.prototype, "type", void 0);
__decorate([
    ProtobufProperty({
        id: ChainItemProto_1.INDEX++,
        required: true,
        converter: ArrayBufferConverter,
    })
], ChainItemProto.prototype, "value", void 0);
ChainItemProto = ChainItemProto_1 = __decorate([
    ProtobufElement({})
], ChainItemProto);
let CertificateStorageGetChainResultProto = CertificateStorageGetChainResultProto_1 = class CertificateStorageGetChainResultProto extends BaseProto {
    constructor() {
        super(...arguments);
        this.items = [];
    }
};
CertificateStorageGetChainResultProto.INDEX = BaseProto.INDEX;
__decorate([
    ProtobufProperty({
        id: CertificateStorageGetChainResultProto_1.INDEX++,
        required: true,
        repeated: true,
        parser: ChainItemProto,
    })
], CertificateStorageGetChainResultProto.prototype, "items", void 0);
CertificateStorageGetChainResultProto = CertificateStorageGetChainResultProto_1 = __decorate([
    ProtobufElement({})
], CertificateStorageGetChainResultProto);
let CertificateStorageSetItemActionProto = CertificateStorageSetItemActionProto_1 = class CertificateStorageSetItemActionProto extends CryptoActionProto {
};
CertificateStorageSetItemActionProto.INDEX = CryptoActionProto.INDEX;
CertificateStorageSetItemActionProto.ACTION = "crypto/certificateStorage/setItem";
__decorate([
    ProtobufProperty({ id: CertificateStorageSetItemActionProto_1.INDEX++, required: true, parser: CryptoCertificateProto })
], CertificateStorageSetItemActionProto.prototype, "item", void 0);
CertificateStorageSetItemActionProto = CertificateStorageSetItemActionProto_1 = __decorate([
    ProtobufElement({})
], CertificateStorageSetItemActionProto);
let CertificateStorageGetItemActionProto = CertificateStorageGetItemActionProto_1 = class CertificateStorageGetItemActionProto extends CryptoActionProto {
};
CertificateStorageGetItemActionProto.INDEX = CryptoActionProto.INDEX;
CertificateStorageGetItemActionProto.ACTION = "crypto/certificateStorage/getItem";
__decorate([
    ProtobufProperty({ id: CertificateStorageGetItemActionProto_1.INDEX++, required: true, type: "string" })
], CertificateStorageGetItemActionProto.prototype, "key", void 0);
__decorate([
    ProtobufProperty({ id: CertificateStorageGetItemActionProto_1.INDEX++, parser: AlgorithmProto })
], CertificateStorageGetItemActionProto.prototype, "algorithm", void 0);
__decorate([
    ProtobufProperty({ id: CertificateStorageGetItemActionProto_1.INDEX++, repeated: true, type: "string" })
], CertificateStorageGetItemActionProto.prototype, "keyUsages", void 0);
CertificateStorageGetItemActionProto = CertificateStorageGetItemActionProto_1 = __decorate([
    ProtobufElement({})
], CertificateStorageGetItemActionProto);
let CertificateStorageKeysActionProto = class CertificateStorageKeysActionProto extends CryptoActionProto {
};
CertificateStorageKeysActionProto.INDEX = CryptoActionProto.INDEX;
CertificateStorageKeysActionProto.ACTION = "crypto/certificateStorage/keys";
CertificateStorageKeysActionProto = __decorate([
    ProtobufElement({})
], CertificateStorageKeysActionProto);
let CertificateStorageRemoveItemActionProto = CertificateStorageRemoveItemActionProto_1 = class CertificateStorageRemoveItemActionProto extends CryptoActionProto {
};
CertificateStorageRemoveItemActionProto.INDEX = CryptoActionProto.INDEX;
CertificateStorageRemoveItemActionProto.ACTION = "crypto/certificateStorage/removeItem";
__decorate([
    ProtobufProperty({ id: CertificateStorageRemoveItemActionProto_1.INDEX++, required: true, type: "string" })
], CertificateStorageRemoveItemActionProto.prototype, "key", void 0);
CertificateStorageRemoveItemActionProto = CertificateStorageRemoveItemActionProto_1 = __decorate([
    ProtobufElement({})
], CertificateStorageRemoveItemActionProto);
let CertificateStorageClearActionProto = class CertificateStorageClearActionProto extends CryptoActionProto {
};
CertificateStorageClearActionProto.INDEX = CryptoActionProto.INDEX;
CertificateStorageClearActionProto.ACTION = "crypto/certificateStorage/clear";
CertificateStorageClearActionProto = __decorate([
    ProtobufElement({})
], CertificateStorageClearActionProto);
let CertificateStorageImportActionProto = CertificateStorageImportActionProto_1 = class CertificateStorageImportActionProto extends CryptoActionProto {
};
CertificateStorageImportActionProto.INDEX = CryptoActionProto.INDEX;
CertificateStorageImportActionProto.ACTION = "crypto/certificateStorage/import";
__decorate([
    ProtobufProperty({ id: CertificateStorageImportActionProto_1.INDEX++, required: true, type: "string" })
], CertificateStorageImportActionProto.prototype, "format", void 0);
__decorate([
    ProtobufProperty({ id: CertificateStorageImportActionProto_1.INDEX++, required: true, converter: ArrayBufferConverter })
], CertificateStorageImportActionProto.prototype, "data", void 0);
__decorate([
    ProtobufProperty({ id: CertificateStorageImportActionProto_1.INDEX++, required: true, parser: AlgorithmProto })
], CertificateStorageImportActionProto.prototype, "algorithm", void 0);
__decorate([
    ProtobufProperty({ id: CertificateStorageImportActionProto_1.INDEX++, repeated: true, type: "string" })
], CertificateStorageImportActionProto.prototype, "keyUsages", void 0);
CertificateStorageImportActionProto = CertificateStorageImportActionProto_1 = __decorate([
    ProtobufElement({})
], CertificateStorageImportActionProto);
let CertificateStorageExportActionProto = CertificateStorageExportActionProto_1 = class CertificateStorageExportActionProto extends CryptoActionProto {
};
CertificateStorageExportActionProto.INDEX = CryptoActionProto.INDEX;
CertificateStorageExportActionProto.ACTION = "crypto/certificateStorage/export";
__decorate([
    ProtobufProperty({ id: CertificateStorageExportActionProto_1.INDEX++, required: true, type: "string" })
], CertificateStorageExportActionProto.prototype, "format", void 0);
__decorate([
    ProtobufProperty({ id: CertificateStorageExportActionProto_1.INDEX++, required: true, parser: CryptoCertificateProto })
], CertificateStorageExportActionProto.prototype, "item", void 0);
CertificateStorageExportActionProto = CertificateStorageExportActionProto_1 = __decorate([
    ProtobufElement({})
], CertificateStorageExportActionProto);
let CertificateStorageIndexOfActionProto = CertificateStorageIndexOfActionProto_1 = class CertificateStorageIndexOfActionProto extends CryptoActionProto {
};
CertificateStorageIndexOfActionProto.INDEX = CryptoActionProto.INDEX;
CertificateStorageIndexOfActionProto.ACTION = "crypto/certificateStorage/indexOf";
__decorate([
    ProtobufProperty({ id: CertificateStorageIndexOfActionProto_1.INDEX++, required: true, parser: CryptoCertificateProto })
], CertificateStorageIndexOfActionProto.prototype, "item", void 0);
CertificateStorageIndexOfActionProto = CertificateStorageIndexOfActionProto_1 = __decorate([
    ProtobufElement({})
], CertificateStorageIndexOfActionProto);
let CertificateStorageGetChainActionProto = class CertificateStorageGetChainActionProto extends CryptoActionProto {
};
CertificateStorageGetChainActionProto.INDEX = CryptoActionProto.INDEX;
CertificateStorageGetChainActionProto.ACTION = "crypto/certificateStorage/getChain";
__decorate([
    ProtobufProperty({ id: CertificateStorageSetItemActionProto.INDEX++, required: true, parser: CryptoCertificateProto })
], CertificateStorageGetChainActionProto.prototype, "item", void 0);
CertificateStorageGetChainActionProto = __decorate([
    ProtobufElement({})
], CertificateStorageGetChainActionProto);
let CertificateStorageGetCRLActionProto = CertificateStorageGetCRLActionProto_1 = class CertificateStorageGetCRLActionProto extends CryptoActionProto {
};
CertificateStorageGetCRLActionProto.INDEX = CryptoActionProto.INDEX;
CertificateStorageGetCRLActionProto.ACTION = "crypto/certificateStorage/getCRL";
__decorate([
    ProtobufProperty({ id: CertificateStorageGetCRLActionProto_1.INDEX++, required: true, type: "string" })
], CertificateStorageGetCRLActionProto.prototype, "url", void 0);
CertificateStorageGetCRLActionProto = CertificateStorageGetCRLActionProto_1 = __decorate([
    ProtobufElement({})
], CertificateStorageGetCRLActionProto);
let OCSPRequestOptionsProto = OCSPRequestOptionsProto_1 = class OCSPRequestOptionsProto extends BaseProto {
};
OCSPRequestOptionsProto.INDEX = BaseProto.INDEX;
__decorate([
    ProtobufProperty({ id: OCSPRequestOptionsProto_1.INDEX++, required: false, type: "string", defaultValue: "get" })
], OCSPRequestOptionsProto.prototype, "method", void 0);
OCSPRequestOptionsProto = OCSPRequestOptionsProto_1 = __decorate([
    ProtobufElement({})
], OCSPRequestOptionsProto);
let CertificateStorageGetOCSPActionProto = CertificateStorageGetOCSPActionProto_1 = class CertificateStorageGetOCSPActionProto extends CryptoActionProto {
};
CertificateStorageGetOCSPActionProto.INDEX = CryptoActionProto.INDEX;
CertificateStorageGetOCSPActionProto.ACTION = "crypto/certificateStorage/getOCSP";
__decorate([
    ProtobufProperty({ id: CertificateStorageGetOCSPActionProto_1.INDEX++, required: true, type: "string" })
], CertificateStorageGetOCSPActionProto.prototype, "url", void 0);
__decorate([
    ProtobufProperty({ id: CertificateStorageGetOCSPActionProto_1.INDEX++, required: true, converter: ArrayBufferConverter })
], CertificateStorageGetOCSPActionProto.prototype, "request", void 0);
__decorate([
    ProtobufProperty({ id: CertificateStorageGetOCSPActionProto_1.INDEX++, required: false, parser: OCSPRequestOptionsProto })
], CertificateStorageGetOCSPActionProto.prototype, "options", void 0);
CertificateStorageGetOCSPActionProto = CertificateStorageGetOCSPActionProto_1 = __decorate([
    ProtobufElement({})
], CertificateStorageGetOCSPActionProto);

function Cast(data) {
    return data;
}
function isHashedAlgorithm(data) {
    return data instanceof Object
        && "name" in data
        && "hash" in data;
}
function prepareAlgorithm(algorithm) {
    const algProto = new AlgorithmProto();
    if (typeof algorithm === "string") {
        algProto.fromAlgorithm({ name: algorithm });
    }
    else if (isHashedAlgorithm(algorithm)) {
        const preparedAlgorithm = { ...algorithm };
        preparedAlgorithm.hash = prepareAlgorithm(algorithm.hash);
        algProto.fromAlgorithm(preparedAlgorithm);
    }
    else {
        algProto.fromAlgorithm({ ...algorithm });
    }
    return algProto;
}
function isCryptoKey(data) {
    return data instanceof CryptoKeyProto;
}
function isCryptoCertificate(data) {
    return data instanceof CryptoCertificateProto;
}
function checkAlgorithm(algorithm, param) {
    if (!(algorithm && (typeof algorithm === "object" || typeof algorithm === "string"))) {
        throw new TypeError(`${param}: Is wrong type. Must be Object or String`);
    }
    if (typeof algorithm === "object" && !("name" in algorithm)) {
        throw new TypeError(`${param}: Required property 'name' is missed`);
    }
}
function checkCryptoKey(data, param) {
    if (!isCryptoKey(data)) {
        throw new TypeError(`${param}: Is not type CryptoKey`);
    }
}
function checkCryptoCertificate(data, param) {
    if (!isCryptoCertificate(data)) {
        throw new TypeError(`${param}: Is not type CryptoCertificate`);
    }
}
function checkBufferSource(data, param) {
    if (!BufferSourceConverter.isBufferSource(data)) {
        throw new TypeError(`${param}: Is wrong type. Must be ArrayBuffer or ArrayBuffer view`);
    }
}
function checkArray(data, param) {
    if (!Array.isArray(data)) {
        throw new TypeError(`${param}: Is not type Array`);
    }
}
function checkPrimitive(data, type, param) {
    if (typeof data !== type) {
        throw new TypeError(`${param}: Is not type '${type}'`);
    }
}

const IMPORT_CERT_FORMATS = ["raw", "pem", "x509", "request"];
class CertificateStorage {
    constructor(provider) {
        this.provider = provider;
    }
    async indexOf(item) {
        checkCryptoCertificate(item, "item");
        const proto = new CertificateStorageIndexOfActionProto();
        proto.providerID = this.provider.id;
        proto.item = item;
        const result = await this.provider.client.send(proto);
        return result ? Convert.ToUtf8String(result) : null;
    }
    async hasItem(item) {
        const index = await this.indexOf(item);
        return !!index;
    }
    async exportCert(format, item) {
        checkPrimitive(format, "string", "format");
        checkCryptoCertificate(item, "item");
        const proto = new CertificateStorageExportActionProto();
        proto.providerID = this.provider.id;
        proto.format = "raw";
        proto.item = item;
        const result = await this.provider.client.send(proto);
        if (format === "raw") {
            return result;
        }
        else {
            let header = "";
            switch (item.type) {
                case "x509": {
                    header = "CERTIFICATE";
                    break;
                }
                case "request": {
                    header = "CERTIFICATE REQUEST";
                    break;
                }
                default:
                    throw new Error(`Cannot create PEM for unknown type of certificate item`);
            }
            const res = [];
            const b64 = Convert.ToBase64(result);
            res.push(`-----BEGIN ${header}-----`);
            let counter = 0;
            let raw = "";
            while (counter < b64.length) {
                if (counter && !(counter % 64)) {
                    res.push(raw);
                    raw = "";
                }
                raw += b64[counter++];
            }
            if (raw) {
                res.push(raw);
            }
            res.push(`-----END ${header}-----`);
            return res.join("\r\n");
        }
    }
    async importCert(format, data, algorithm, keyUsages) {
        checkPrimitive(format, "string", "format");
        if (!~IMPORT_CERT_FORMATS.indexOf(format)) {
            throw new TypeError(`format: Is invalid value. Must be ${IMPORT_CERT_FORMATS.join(", ")}`);
        }
        if (format === "pem") {
            checkPrimitive(data, "string", "data");
        }
        else {
            checkBufferSource(data, "data");
        }
        checkAlgorithm(algorithm, "algorithm");
        checkArray(keyUsages, "keyUsages");
        const algProto = prepareAlgorithm(algorithm);
        let rawData;
        if (BufferSourceConverter.isBufferSource(data)) {
            rawData = BufferSourceConverter.toArrayBuffer(data);
        }
        else if (typeof data === "string") {
            rawData = PemConverter.toArrayBuffer(data);
        }
        else {
            throw new TypeError("data: Is not type String, ArrayBuffer or ArrayBufferView");
        }
        const proto = new CertificateStorageImportActionProto();
        proto.providerID = this.provider.id;
        proto.format = format === "x509" || format === "request" ? "raw" : format;
        proto.data = rawData;
        proto.algorithm = algProto;
        proto.keyUsages = keyUsages;
        const result = await this.provider.client.send(proto);
        const certItem = await CryptoCertificateProto.importProto(result);
        return this.prepareCertItem(certItem);
    }
    async keys() {
        const proto = new CertificateStorageKeysActionProto();
        proto.providerID = this.provider.id;
        const result = await this.provider.client.send(proto);
        if (result) {
            const keys = Convert.ToUtf8String(result).split(",");
            return keys;
        }
        return [];
    }
    async getItem(key, algorithm, keyUsages) {
        checkPrimitive(key, "string", "key");
        if (algorithm) {
            checkAlgorithm(algorithm, "algorithm");
            checkArray(keyUsages, "keyUsages");
        }
        const proto = new CertificateStorageGetItemActionProto();
        proto.providerID = this.provider.id;
        proto.key = key;
        if (algorithm) {
            proto.algorithm = prepareAlgorithm(algorithm);
            proto.keyUsages = keyUsages;
        }
        const result = await this.provider.client.send(proto);
        if (result && result.byteLength) {
            const certItem = await CryptoCertificateProto.importProto(result);
            return this.prepareCertItem(certItem);
        }
        return null;
    }
    async setItem(value) {
        checkCryptoCertificate(value, "value");
        const proto = new CertificateStorageSetItemActionProto();
        proto.providerID = this.provider.id;
        proto.item = value;
        const data = await this.provider.client.send(proto);
        return Convert.ToUtf8String(data);
    }
    async removeItem(key) {
        checkPrimitive(key, "string", "key");
        const proto = new CertificateStorageRemoveItemActionProto();
        proto.providerID = this.provider.id;
        proto.key = key;
        await this.provider.client.send(proto);
    }
    async clear() {
        const proto = new CertificateStorageClearActionProto();
        proto.providerID = this.provider.id;
        await this.provider.client.send(proto);
    }
    async getChain(value) {
        checkCryptoCertificate(value, "value");
        const proto = new CertificateStorageGetChainActionProto();
        proto.providerID = this.provider.id;
        proto.item = value;
        const data = await this.provider.client.send(proto);
        const resultProto = await CertificateStorageGetChainResultProto.importProto(data);
        return resultProto.items;
    }
    async getCRL(url) {
        checkPrimitive(url, "string", "url");
        const proto = new CertificateStorageGetCRLActionProto();
        proto.providerID = this.provider.id;
        proto.url = url;
        const data = await this.provider.client.send(proto);
        return data;
    }
    async getOCSP(url, request, options) {
        checkPrimitive(url, "string", "url");
        checkBufferSource(request, "request");
        const proto = new CertificateStorageGetOCSPActionProto();
        proto.providerID = this.provider.id;
        proto.url = url;
        proto.request = BufferSourceConverter.toArrayBuffer(request);
        if (options) {
            for (const key in options) {
                proto.options[key] = options[key];
            }
        }
        const data = await this.provider.client.send(proto);
        return data;
    }
    async prepareCertItem(item) {
        const raw = await item.exportProto();
        let result;
        switch (item.type) {
            case "x509": {
                result = await CryptoX509CertificateProto.importProto(raw);
                break;
            }
            case "request": {
                result = await CryptoX509CertificateRequestProto.importProto(raw);
                break;
            }
            default:
                throw new Error(`Unsupported CertificateItem type '${item.type}'`);
        }
        result.provider = this.provider;
        return result;
    }
}

var KeyStorageSetItemActionProto_1, KeyStorageGetItemActionProto_1, KeyStorageRemoveItemActionProto_1, KeyStorageIndexOfActionProto_1;
let KeyStorageSetItemActionProto = KeyStorageSetItemActionProto_1 = class KeyStorageSetItemActionProto extends CryptoActionProto {
};
KeyStorageSetItemActionProto.INDEX = CryptoActionProto.INDEX;
KeyStorageSetItemActionProto.ACTION = "crypto/keyStorage/setItem";
__decorate([
    ProtobufProperty({ id: KeyStorageSetItemActionProto_1.INDEX++, required: true, parser: CryptoKeyProto })
], KeyStorageSetItemActionProto.prototype, "item", void 0);
KeyStorageSetItemActionProto = KeyStorageSetItemActionProto_1 = __decorate([
    ProtobufElement({})
], KeyStorageSetItemActionProto);
let KeyStorageGetItemActionProto = KeyStorageGetItemActionProto_1 = class KeyStorageGetItemActionProto extends CryptoActionProto {
};
KeyStorageGetItemActionProto.INDEX = CryptoActionProto.INDEX;
KeyStorageGetItemActionProto.ACTION = "crypto/keyStorage/getItem";
__decorate([
    ProtobufProperty({ id: KeyStorageGetItemActionProto_1.INDEX++, required: true, type: "string" })
], KeyStorageGetItemActionProto.prototype, "key", void 0);
__decorate([
    ProtobufProperty({ id: KeyStorageGetItemActionProto_1.INDEX++, parser: AlgorithmProto })
], KeyStorageGetItemActionProto.prototype, "algorithm", void 0);
__decorate([
    ProtobufProperty({ id: KeyStorageGetItemActionProto_1.INDEX++, type: "bool" })
], KeyStorageGetItemActionProto.prototype, "extractable", void 0);
__decorate([
    ProtobufProperty({ id: KeyStorageGetItemActionProto_1.INDEX++, repeated: true, type: "string" })
], KeyStorageGetItemActionProto.prototype, "keyUsages", void 0);
KeyStorageGetItemActionProto = KeyStorageGetItemActionProto_1 = __decorate([
    ProtobufElement({})
], KeyStorageGetItemActionProto);
let KeyStorageKeysActionProto = class KeyStorageKeysActionProto extends CryptoActionProto {
};
KeyStorageKeysActionProto.INDEX = CryptoActionProto.INDEX;
KeyStorageKeysActionProto.ACTION = "crypto/keyStorage/keys";
KeyStorageKeysActionProto = __decorate([
    ProtobufElement({})
], KeyStorageKeysActionProto);
let KeyStorageRemoveItemActionProto = KeyStorageRemoveItemActionProto_1 = class KeyStorageRemoveItemActionProto extends CryptoActionProto {
};
KeyStorageRemoveItemActionProto.INDEX = CryptoActionProto.INDEX;
KeyStorageRemoveItemActionProto.ACTION = "crypto/keyStorage/removeItem";
__decorate([
    ProtobufProperty({ id: KeyStorageRemoveItemActionProto_1.INDEX++, required: true, type: "string" })
], KeyStorageRemoveItemActionProto.prototype, "key", void 0);
KeyStorageRemoveItemActionProto = KeyStorageRemoveItemActionProto_1 = __decorate([
    ProtobufElement({})
], KeyStorageRemoveItemActionProto);
let KeyStorageClearActionProto = class KeyStorageClearActionProto extends CryptoActionProto {
};
KeyStorageClearActionProto.INDEX = CryptoActionProto.INDEX;
KeyStorageClearActionProto.ACTION = "crypto/keyStorage/clear";
KeyStorageClearActionProto = __decorate([
    ProtobufElement({})
], KeyStorageClearActionProto);
let KeyStorageIndexOfActionProto = KeyStorageIndexOfActionProto_1 = class KeyStorageIndexOfActionProto extends CryptoActionProto {
};
KeyStorageIndexOfActionProto.INDEX = CryptoActionProto.INDEX;
KeyStorageIndexOfActionProto.ACTION = "crypto/keyStorage/indexOf";
__decorate([
    ProtobufProperty({ id: KeyStorageIndexOfActionProto_1.INDEX++, required: true, parser: CryptoKeyProto })
], KeyStorageIndexOfActionProto.prototype, "item", void 0);
KeyStorageIndexOfActionProto = KeyStorageIndexOfActionProto_1 = __decorate([
    ProtobufElement({})
], KeyStorageIndexOfActionProto);

class KeyStorage {
    constructor(service) {
        this.service = service;
    }
    async keys() {
        const proto = new KeyStorageKeysActionProto();
        proto.providerID = this.service.id;
        const result = await this.service.client.send(proto);
        if (result) {
            const keys = Convert.ToUtf8String(result).split(",");
            return keys;
        }
        return [];
    }
    async indexOf(item) {
        checkCryptoKey(item, "item");
        const proto = new KeyStorageIndexOfActionProto();
        proto.providerID = this.service.id;
        proto.item = item;
        const result = await this.service.client.send(proto);
        return result ? Convert.ToUtf8String(result) : null;
    }
    async hasItem(item) {
        const index = await this.indexOf(item);
        return !!index;
    }
    async getItem(key, algorithm, extractable, usages) {
        checkPrimitive(key, "string", "key");
        if (algorithm) {
            checkAlgorithm(algorithm, "algorithm");
            checkPrimitive(extractable, "boolean", "extractable");
            checkArray(usages, "usages");
        }
        const proto = new KeyStorageGetItemActionProto();
        proto.providerID = this.service.id;
        proto.key = key;
        if (algorithm) {
            proto.algorithm = prepareAlgorithm(algorithm);
            proto.extractable = extractable;
            proto.keyUsages = usages;
        }
        const result = await this.service.client.send(proto);
        let socketKey = null;
        if (result && result.byteLength) {
            const keyProto = await CryptoKeyProto.importProto(result);
            socketKey = keyProto;
        }
        return socketKey;
    }
    async setItem(value) {
        checkCryptoKey(value, "value");
        const proto = new KeyStorageSetItemActionProto();
        proto.providerID = this.service.id;
        proto.item = value;
        const data = await this.service.client.send(proto);
        return Convert.ToUtf8String(data);
    }
    async removeItem(key) {
        checkPrimitive(key, "string", "key");
        const proto = new KeyStorageRemoveItemActionProto();
        proto.providerID = this.service.id;
        proto.key = key;
        await this.service.client.send(proto);
    }
    async clear() {
        const proto = new KeyStorageClearActionProto();
        proto.providerID = this.service.id;
        await this.service.client.send(proto);
    }
}

var DigestActionProto_1, GenerateKeyActionProto_1, SignActionProto_1, VerifyActionProto_1, DeriveBitsActionProto_1, DeriveKeyActionProto_1, UnwrapKeyActionProto_1, WrapKeyActionProto_1, ExportKeyActionProto_1, ImportKeyActionProto_1;
let DigestActionProto = DigestActionProto_1 = class DigestActionProto extends CryptoActionProto {
};
DigestActionProto.INDEX = CryptoActionProto.INDEX;
DigestActionProto.ACTION = "crypto/subtle/digest";
__decorate([
    ProtobufProperty({ id: DigestActionProto_1.INDEX++, required: true, parser: AlgorithmProto })
], DigestActionProto.prototype, "algorithm", void 0);
__decorate([
    ProtobufProperty({ id: DigestActionProto_1.INDEX++, required: true, converter: ArrayBufferConverter })
], DigestActionProto.prototype, "data", void 0);
DigestActionProto = DigestActionProto_1 = __decorate([
    ProtobufElement({})
], DigestActionProto);
let GenerateKeyActionProto = GenerateKeyActionProto_1 = class GenerateKeyActionProto extends CryptoActionProto {
};
GenerateKeyActionProto.INDEX = CryptoActionProto.INDEX;
GenerateKeyActionProto.ACTION = "crypto/subtle/generateKey";
__decorate([
    ProtobufProperty({ id: GenerateKeyActionProto_1.INDEX++, type: "bytes", required: true, parser: AlgorithmProto })
], GenerateKeyActionProto.prototype, "algorithm", void 0);
__decorate([
    ProtobufProperty({ id: GenerateKeyActionProto_1.INDEX++, type: "bool", required: true })
], GenerateKeyActionProto.prototype, "extractable", void 0);
__decorate([
    ProtobufProperty({ id: GenerateKeyActionProto_1.INDEX++, type: "string", repeated: true })
], GenerateKeyActionProto.prototype, "usage", void 0);
GenerateKeyActionProto = GenerateKeyActionProto_1 = __decorate([
    ProtobufElement({})
], GenerateKeyActionProto);
let SignActionProto = SignActionProto_1 = class SignActionProto extends CryptoActionProto {
};
SignActionProto.INDEX = CryptoActionProto.INDEX;
SignActionProto.ACTION = "crypto/subtle/sign";
__decorate([
    ProtobufProperty({ id: SignActionProto_1.INDEX++, required: true, parser: AlgorithmProto })
], SignActionProto.prototype, "algorithm", void 0);
__decorate([
    ProtobufProperty({ id: SignActionProto_1.INDEX++, required: true, parser: CryptoKeyProto })
], SignActionProto.prototype, "key", void 0);
__decorate([
    ProtobufProperty({ id: SignActionProto_1.INDEX++, required: true, converter: ArrayBufferConverter })
], SignActionProto.prototype, "data", void 0);
SignActionProto = SignActionProto_1 = __decorate([
    ProtobufElement({})
], SignActionProto);
let VerifyActionProto = VerifyActionProto_1 = class VerifyActionProto extends SignActionProto {
};
VerifyActionProto.INDEX = SignActionProto.INDEX;
VerifyActionProto.ACTION = "crypto/subtle/verify";
__decorate([
    ProtobufProperty({ id: VerifyActionProto_1.INDEX++, required: true, converter: ArrayBufferConverter })
], VerifyActionProto.prototype, "signature", void 0);
VerifyActionProto = VerifyActionProto_1 = __decorate([
    ProtobufElement({})
], VerifyActionProto);
let EncryptActionProto = class EncryptActionProto extends SignActionProto {
};
EncryptActionProto.INDEX = SignActionProto.INDEX;
EncryptActionProto.ACTION = "crypto/subtle/encrypt";
EncryptActionProto = __decorate([
    ProtobufElement({})
], EncryptActionProto);
let DecryptActionProto = class DecryptActionProto extends SignActionProto {
};
DecryptActionProto.INDEX = SignActionProto.INDEX;
DecryptActionProto.ACTION = "crypto/subtle/decrypt";
DecryptActionProto = __decorate([
    ProtobufElement({})
], DecryptActionProto);
let DeriveBitsActionProto = DeriveBitsActionProto_1 = class DeriveBitsActionProto extends CryptoActionProto {
};
DeriveBitsActionProto.INDEX = CryptoActionProto.INDEX;
DeriveBitsActionProto.ACTION = "crypto/subtle/deriveBits";
__decorate([
    ProtobufProperty({ id: DeriveBitsActionProto_1.INDEX++, required: true, parser: AlgorithmProto })
], DeriveBitsActionProto.prototype, "algorithm", void 0);
__decorate([
    ProtobufProperty({ id: DeriveBitsActionProto_1.INDEX++, required: true, parser: CryptoKeyProto })
], DeriveBitsActionProto.prototype, "key", void 0);
__decorate([
    ProtobufProperty({ id: DeriveBitsActionProto_1.INDEX++, required: true, type: "uint32" })
], DeriveBitsActionProto.prototype, "length", void 0);
DeriveBitsActionProto = DeriveBitsActionProto_1 = __decorate([
    ProtobufElement({})
], DeriveBitsActionProto);
let DeriveKeyActionProto = DeriveKeyActionProto_1 = class DeriveKeyActionProto extends CryptoActionProto {
};
DeriveKeyActionProto.INDEX = CryptoActionProto.INDEX;
DeriveKeyActionProto.ACTION = "crypto/subtle/deriveKey";
__decorate([
    ProtobufProperty({ id: DeriveKeyActionProto_1.INDEX++, required: true, parser: AlgorithmProto })
], DeriveKeyActionProto.prototype, "algorithm", void 0);
__decorate([
    ProtobufProperty({ id: DeriveKeyActionProto_1.INDEX++, required: true, parser: CryptoKeyProto })
], DeriveKeyActionProto.prototype, "key", void 0);
__decorate([
    ProtobufProperty({ id: DeriveKeyActionProto_1.INDEX++, required: true, parser: AlgorithmProto })
], DeriveKeyActionProto.prototype, "derivedKeyType", void 0);
__decorate([
    ProtobufProperty({ id: DeriveKeyActionProto_1.INDEX++, type: "bool" })
], DeriveKeyActionProto.prototype, "extractable", void 0);
__decorate([
    ProtobufProperty({ id: DeriveKeyActionProto_1.INDEX++, type: "string", repeated: true })
], DeriveKeyActionProto.prototype, "usage", void 0);
DeriveKeyActionProto = DeriveKeyActionProto_1 = __decorate([
    ProtobufElement({})
], DeriveKeyActionProto);
let UnwrapKeyActionProto = UnwrapKeyActionProto_1 = class UnwrapKeyActionProto extends CryptoActionProto {
};
UnwrapKeyActionProto.INDEX = CryptoActionProto.INDEX;
UnwrapKeyActionProto.ACTION = "crypto/subtle/unwrapKey";
__decorate([
    ProtobufProperty({ id: UnwrapKeyActionProto_1.INDEX++, required: true, type: "string" })
], UnwrapKeyActionProto.prototype, "format", void 0);
__decorate([
    ProtobufProperty({ id: UnwrapKeyActionProto_1.INDEX++, required: true, converter: ArrayBufferConverter })
], UnwrapKeyActionProto.prototype, "wrappedKey", void 0);
__decorate([
    ProtobufProperty({ id: UnwrapKeyActionProto_1.INDEX++, required: true, parser: CryptoKeyProto })
], UnwrapKeyActionProto.prototype, "unwrappingKey", void 0);
__decorate([
    ProtobufProperty({ id: UnwrapKeyActionProto_1.INDEX++, required: true, parser: AlgorithmProto })
], UnwrapKeyActionProto.prototype, "unwrapAlgorithm", void 0);
__decorate([
    ProtobufProperty({ id: UnwrapKeyActionProto_1.INDEX++, required: true, parser: AlgorithmProto })
], UnwrapKeyActionProto.prototype, "unwrappedKeyAlgorithm", void 0);
__decorate([
    ProtobufProperty({ id: UnwrapKeyActionProto_1.INDEX++, type: "bool" })
], UnwrapKeyActionProto.prototype, "extractable", void 0);
__decorate([
    ProtobufProperty({ id: UnwrapKeyActionProto_1.INDEX++, type: "string", repeated: true })
], UnwrapKeyActionProto.prototype, "keyUsage", void 0);
UnwrapKeyActionProto = UnwrapKeyActionProto_1 = __decorate([
    ProtobufElement({})
], UnwrapKeyActionProto);
let WrapKeyActionProto = WrapKeyActionProto_1 = class WrapKeyActionProto extends CryptoActionProto {
};
WrapKeyActionProto.INDEX = CryptoActionProto.INDEX;
WrapKeyActionProto.ACTION = "crypto/subtle/wrapKey";
__decorate([
    ProtobufProperty({ id: WrapKeyActionProto_1.INDEX++, required: true, type: "string" })
], WrapKeyActionProto.prototype, "format", void 0);
__decorate([
    ProtobufProperty({ id: WrapKeyActionProto_1.INDEX++, required: true, parser: CryptoKeyProto })
], WrapKeyActionProto.prototype, "key", void 0);
__decorate([
    ProtobufProperty({ id: WrapKeyActionProto_1.INDEX++, required: true, parser: CryptoKeyProto })
], WrapKeyActionProto.prototype, "wrappingKey", void 0);
__decorate([
    ProtobufProperty({ id: WrapKeyActionProto_1.INDEX++, required: true, parser: AlgorithmProto })
], WrapKeyActionProto.prototype, "wrapAlgorithm", void 0);
WrapKeyActionProto = WrapKeyActionProto_1 = __decorate([
    ProtobufElement({})
], WrapKeyActionProto);
let ExportKeyActionProto = ExportKeyActionProto_1 = class ExportKeyActionProto extends CryptoActionProto {
};
ExportKeyActionProto.INDEX = CryptoActionProto.INDEX;
ExportKeyActionProto.ACTION = "crypto/subtle/exportKey";
__decorate([
    ProtobufProperty({ id: ExportKeyActionProto_1.INDEX++, type: "string", required: true })
], ExportKeyActionProto.prototype, "format", void 0);
__decorate([
    ProtobufProperty({ id: ExportKeyActionProto_1.INDEX++, required: true, parser: CryptoKeyProto })
], ExportKeyActionProto.prototype, "key", void 0);
ExportKeyActionProto = ExportKeyActionProto_1 = __decorate([
    ProtobufElement({})
], ExportKeyActionProto);
let ImportKeyActionProto = ImportKeyActionProto_1 = class ImportKeyActionProto extends CryptoActionProto {
};
ImportKeyActionProto.INDEX = CryptoActionProto.INDEX;
ImportKeyActionProto.ACTION = "crypto/subtle/importKey";
__decorate([
    ProtobufProperty({ id: ImportKeyActionProto_1.INDEX++, type: "string", required: true })
], ImportKeyActionProto.prototype, "format", void 0);
__decorate([
    ProtobufProperty({ id: ImportKeyActionProto_1.INDEX++, required: true, converter: ArrayBufferConverter })
], ImportKeyActionProto.prototype, "keyData", void 0);
__decorate([
    ProtobufProperty({ id: ImportKeyActionProto_1.INDEX++, required: true, parser: AlgorithmProto })
], ImportKeyActionProto.prototype, "algorithm", void 0);
__decorate([
    ProtobufProperty({ id: ImportKeyActionProto_1.INDEX++, required: true, type: "bool" })
], ImportKeyActionProto.prototype, "extractable", void 0);
__decorate([
    ProtobufProperty({ id: ImportKeyActionProto_1.INDEX++, type: "string", repeated: true })
], ImportKeyActionProto.prototype, "keyUsages", void 0);
ImportKeyActionProto = ImportKeyActionProto_1 = __decorate([
    ProtobufElement({})
], ImportKeyActionProto);

class SubtleCrypto {
    constructor(crypto) {
        this.service = crypto;
    }
    async encrypt(algorithm, key, data) {
        return this.encryptData(algorithm, key, data, "encrypt");
    }
    async decrypt(algorithm, key, data) {
        return this.encryptData(algorithm, key, data, "decrypt");
    }
    async deriveBits(algorithm, baseKey, length) {
        checkAlgorithm(algorithm, "algorithm");
        checkCryptoKey(baseKey, "baseKey");
        checkPrimitive(length, "number", "length");
        const algProto = prepareAlgorithm(algorithm);
        checkCryptoKey(algProto, "algorithm.public");
        algProto.public = await Cast(algProto.public).exportProto();
        const action = new DeriveBitsActionProto();
        action.providerID = this.service.id;
        action.algorithm = algProto;
        action.key = baseKey;
        action.length = length;
        const result = await this.service.client.send(action);
        return result;
    }
    async deriveKey(algorithm, baseKey, derivedKeyType, extractable, keyUsages) {
        checkAlgorithm(algorithm, "algorithm");
        checkCryptoKey(baseKey, "baseKey");
        checkAlgorithm(derivedKeyType, "algorithm");
        checkPrimitive(extractable, "boolean", "extractable");
        checkArray(keyUsages, "keyUsages");
        const algProto = prepareAlgorithm(algorithm);
        checkCryptoKey(algProto, "algorithm.public");
        algProto.public = await Cast(algProto.public).exportProto();
        const algKeyType = prepareAlgorithm(derivedKeyType);
        const action = new DeriveKeyActionProto();
        action.providerID = this.service.id;
        action.algorithm = algProto;
        action.derivedKeyType.fromAlgorithm(algKeyType);
        action.key = baseKey;
        action.extractable = extractable;
        action.usage = keyUsages;
        const result = await this.service.client.send(action);
        return await CryptoKeyProto.importProto(result);
    }
    async digest(algorithm, data) {
        checkAlgorithm(algorithm, "algorithm");
        checkBufferSource(data, "data");
        const algProto = prepareAlgorithm(algorithm);
        const rawData = BufferSourceConverter.toArrayBuffer(data);
        if (self.crypto) {
            try {
                return await self.crypto.subtle.digest(algorithm, rawData);
            }
            catch (err) {
                console.warn(`Cannot do native digest for algorithm '${algProto.name}'`);
            }
        }
        const action = new DigestActionProto();
        action.algorithm = algProto;
        action.data = rawData;
        action.providerID = this.service.id;
        const result = await this.service.client.send(action);
        return result;
    }
    async generateKey(algorithm, extractable, keyUsages) {
        checkAlgorithm(algorithm, "algorithm");
        checkPrimitive(extractable, "boolean", "extractable");
        checkArray(keyUsages, "keyUsages");
        const algProto = prepareAlgorithm(algorithm);
        const action = new GenerateKeyActionProto();
        action.providerID = this.service.id;
        action.algorithm = algProto;
        action.extractable = extractable;
        action.usage = keyUsages;
        const result = await this.service.client.send(action);
        try {
            const keyPair = await CryptoKeyPairProto.importProto(result);
            return keyPair;
        }
        catch (e) {
            const key = await CryptoKeyProto.importProto(result);
            return key;
        }
    }
    async exportKey(format, key) {
        checkPrimitive(format, "string", "format");
        checkCryptoKey(key, "key");
        const action = new ExportKeyActionProto();
        action.providerID = this.service.id;
        action.format = format;
        action.key = key;
        const result = await this.service.client.send(action);
        if (format === "jwk") {
            return JSON.parse(Convert.ToBinary(result));
        }
        else {
            return result;
        }
    }
    async importKey(format, keyData, algorithm, extractable, keyUsages) {
        checkPrimitive(format, "string", "format");
        checkAlgorithm(algorithm, "algorithm");
        checkPrimitive(extractable, "boolean", "extractable");
        checkArray(keyUsages, "keyUsages");
        const algProto = prepareAlgorithm(algorithm);
        let preparedKeyData;
        if (format === "jwk") {
            preparedKeyData = Convert.FromUtf8String(JSON.stringify(keyData));
        }
        else {
            checkBufferSource(keyData, "keyData");
            preparedKeyData = BufferSourceConverter.toArrayBuffer(keyData);
        }
        const action = new ImportKeyActionProto();
        action.providerID = this.service.id;
        action.algorithm = algProto;
        action.keyData = preparedKeyData;
        action.format = format;
        action.extractable = extractable;
        action.keyUsages = keyUsages;
        const result = await this.service.client.send(action);
        return await CryptoKeyProto.importProto(result);
    }
    async sign(algorithm, key, data) {
        checkAlgorithm(algorithm, "algorithm");
        checkCryptoKey(key, "key");
        checkBufferSource(data, "data");
        const algProto = prepareAlgorithm(algorithm);
        const rawData = BufferSourceConverter.toArrayBuffer(data);
        const action = new SignActionProto();
        action.providerID = this.service.id;
        action.algorithm = algProto;
        action.key = key;
        action.data = rawData;
        const result = await this.service.client.send(action);
        return result;
    }
    async verify(algorithm, key, signature, data) {
        checkAlgorithm(algorithm, "algorithm");
        checkCryptoKey(key, "key");
        checkBufferSource(signature, "signature");
        checkBufferSource(data, "data");
        const algProto = prepareAlgorithm(algorithm);
        const rawSignature = BufferSourceConverter.toArrayBuffer(signature);
        const rawData = BufferSourceConverter.toArrayBuffer(data);
        const action = new VerifyActionProto();
        action.providerID = this.service.id;
        action.algorithm = algProto;
        action.key = key;
        action.data = rawData;
        action.signature = rawSignature;
        const result = await this.service.client.send(action);
        return !!(new Uint8Array(result)[0]);
    }
    async wrapKey(format, key, wrappingKey, wrapAlgorithm) {
        checkPrimitive(format, "string", "format");
        checkCryptoKey(key, "key");
        checkCryptoKey(wrappingKey, "wrappingKey");
        checkAlgorithm(wrapAlgorithm, "wrapAlgorithm");
        const wrapAlgProto = prepareAlgorithm(wrapAlgorithm);
        const action = new WrapKeyActionProto();
        action.providerID = this.service.id;
        action.wrapAlgorithm = wrapAlgProto;
        action.key = key;
        action.wrappingKey = wrappingKey;
        action.format = format;
        const result = await this.service.client.send(action);
        return result;
    }
    async unwrapKey(format, wrappedKey, unwrappingKey, unwrapAlgorithm, unwrappedKeyAlgorithm, extractable, keyUsages) {
        checkPrimitive(format, "string", "format");
        checkBufferSource(wrappedKey, "wrappedKey");
        checkCryptoKey(unwrappingKey, "unwrappingKey");
        checkAlgorithm(unwrapAlgorithm, "unwrapAlgorithm");
        checkAlgorithm(unwrappedKeyAlgorithm, "unwrappedKeyAlgorithm");
        checkPrimitive(extractable, "boolean", "extractable");
        checkArray(keyUsages, "keyUsages");
        const unwrapAlgProto = prepareAlgorithm(unwrapAlgorithm);
        const unwrappedKeyAlgProto = prepareAlgorithm(unwrappedKeyAlgorithm);
        const rawWrappedKey = BufferSourceConverter.toArrayBuffer(wrappedKey);
        const action = new UnwrapKeyActionProto();
        action.providerID = this.service.id;
        action.format = format;
        action.unwrapAlgorithm = unwrapAlgProto;
        action.unwrappedKeyAlgorithm = unwrappedKeyAlgProto;
        action.unwrappingKey = unwrappingKey;
        action.wrappedKey = rawWrappedKey;
        action.extractable = extractable;
        action.keyUsage = keyUsages;
        const result = await this.service.client.send(action);
        return await CryptoKeyProto.importProto(result);
    }
    async encryptData(algorithm, key, data, type) {
        checkAlgorithm(algorithm, "algorithm");
        checkCryptoKey(key, "key");
        checkBufferSource(data, "data");
        const algProto = prepareAlgorithm(algorithm);
        const rawData = BufferSourceConverter.toArrayBuffer(data);
        let ActionClass;
        if (type === "encrypt") {
            ActionClass = EncryptActionProto;
        }
        else {
            ActionClass = DecryptActionProto;
        }
        const action = new ActionClass();
        action.providerID = this.service.id;
        action.algorithm = algProto;
        action.key = key;
        action.data = rawData;
        const result = await this.service.client.send(action);
        return result;
    }
}

class SocketCrypto {
    constructor(client, id) {
        this.client = client;
        this.id = id;
        this.subtle = new SubtleCrypto(this);
        this.keyStorage = new KeyStorage(this);
        this.certStorage = new CertificateStorage(this);
    }
    getRandomValues(array) {
        if (!self.crypto) {
            throw new Error("Cannot get native crypto object. Function getRandomValues is not implemented.");
        }
        return self.crypto.getRandomValues(array);
    }
    async login() {
        const action = new LoginActionProto();
        action.providerID = this.id;
        return this.client.send(action);
    }
    async logout() {
        const action = new LogoutActionProto();
        action.providerID = this.id;
        return this.client.send(action);
    }
    async reset() {
        const action = new ResetActionProto();
        action.providerID = this.id;
        return this.client.send(action);
    }
    async isLoggedIn() {
        const action = new IsLoggedInActionProto();
        action.providerID = this.id;
        const res = await this.client.send(action);
        return !!(new Uint8Array(res)[0]);
    }
}

class SocketProvider extends EventEmitter {
    constructor() {
        super();
        this.client = new Client();
        this.cardReader = new CardReader(this.client);
    }
    get state() {
        return this.client.state;
    }
    connect(address) {
        this.client = new Client();
        this.client.connect(address)
            .on("error", (e) => {
            this.emit("error", e.error);
        })
            .on("event", (proto) => {
            (async () => {
                switch (proto.action) {
                    case ProviderTokenEventProto.ACTION: {
                        const tokenProto = await ProviderTokenEventProto.importProto(await proto.exportProto());
                        this.emit("token", tokenProto);
                    }
                    case ProviderAuthorizedEventProto.ACTION: {
                        const authProto = await ProviderAuthorizedEventProto.importProto(await proto.exportProto());
                        this.emit("auth", authProto);
                    }
                    default:
                }
            })();
        })
            .on("listening", (e) => {
            if (self.PV_WEBCRYPTO_SOCKET_LOG) {
                console.info("Client:Listening", e.address);
            }
            this.emit("listening", address);
        })
            .on("close", (e) => {
            if (self.PV_WEBCRYPTO_SOCKET_LOG) {
                console.info(`Client:Closed: ${e.description} (code: ${e.reasonCode})`);
            }
            this.emit("close", e.remoteAddress);
        });
        return this;
    }
    close() {
        this.client.close();
    }
    on(event, listener) {
        return super.on(event, listener);
    }
    once(event, listener) {
        return super.once(event, listener);
    }
    async info() {
        const proto = new ProviderInfoActionProto();
        const result = await this.client.send(proto);
        const infoProto = await ProviderInfoProto.importProto(result);
        return infoProto;
    }
    async challenge() {
        return this.client.challenge();
    }
    async isLoggedIn() {
        return this.client.isLoggedIn();
    }
    async login() {
        return this.client.login();
    }
    async getCrypto(cryptoID) {
        const actionProto = new ProviderGetCryptoActionProto();
        actionProto.cryptoID = cryptoID;
        await this.client.send(actionProto);
        return new SocketCrypto(this.client, cryptoID);
    }
}

export { SocketProvider };
