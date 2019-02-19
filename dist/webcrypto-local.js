'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var events = require('events');
var _2keyRatchet = require('2key-ratchet');
var pvtsutils = require('pvtsutils');
var https = require('https');
var url = require('url');
var WebSocket = require('websocket');
var tslib_1 = require('tslib');
var tsprotobuf = require('tsprotobuf');
var fs = require('fs');
var os = require('os');
var path = require('path');
var crypto$1 = require('crypto');
var graphene = require('graphene-pk11');
var nodeWebcryptoP11 = require('node-webcrypto-p11');
var core = require('webcrypto-core');
var asn1js = require('asn1js');
var pvutils = require('pvutils');
var request = _interopDefault(require('request'));

async function challenge(serverIdentity, clientIdentity) {
    const serverIdentityDigest = await serverIdentity.thumbprint();
    const clientIdentityDigest = await clientIdentity.thumbprint();
    const combinedIdentity = pvtsutils.Convert.FromHex(serverIdentityDigest + clientIdentityDigest);
    const digest = await _2keyRatchet.getEngine().crypto.subtle.digest("SHA-256", combinedIdentity);
    return parseInt(pvtsutils.Convert.ToHex(digest), 16).toString().substr(2, 6);
}

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
        return new Uint8Array(pvtsutils.Convert.FromUtf8String(value.toISOString()));
    }
    static async get(value) {
        return new Date(pvtsutils.Convert.ToUtf8String(value));
    }
}
class ArrayStringConverter {
    static async set(value) {
        return new Uint8Array(pvtsutils.Convert.FromUtf8String((value).join(",")));
    }
    static async get(value) {
        return pvtsutils.Convert.ToUtf8String(value).split(",");
    }
}
class HexStringConverter {
    static async set(value) {
        return new Uint8Array(pvtsutils.Convert.FromHex(value));
    }
    static async get(value) {
        return pvtsutils.Convert.ToHex(value);
    }
}

var BaseProto_1, ActionProto_1, BaseAlgorithmProto_1, AlgorithmProto_1, CryptoItemProto_1, CryptoKeyProto_1, CryptoKeyPairProto_1, ErrorProto_1, ResultProto_1;
let BaseProto = BaseProto_1 = class BaseProto extends tsprotobuf.ObjectProto {
};
BaseProto.INDEX = 1;
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: BaseProto_1.INDEX++, type: "uint32", required: true, defaultValue: 1 })
], BaseProto.prototype, "version", void 0);
BaseProto = BaseProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({ name: "BaseMessage" })
], BaseProto);
let ActionProto = ActionProto_1 = class ActionProto extends BaseProto {
    constructor() {
        super();
        this.action = this.constructor.ACTION;
    }
};
ActionProto.INDEX = BaseProto.INDEX;
ActionProto.ACTION = "action";
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: ActionProto_1.INDEX++, type: "string", required: true })
], ActionProto.prototype, "action", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: ActionProto_1.INDEX++, type: "string", required: false })
], ActionProto.prototype, "actionId", void 0);
ActionProto = ActionProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({ name: "Action" })
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
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: BaseAlgorithmProto_1.INDEX++, type: "string", required: true })
], BaseAlgorithmProto.prototype, "name", void 0);
BaseAlgorithmProto = BaseAlgorithmProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({ name: "BaseAlgorithm" })
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
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: AlgorithmProto_1.INDEX++, type: "bytes", parser: BaseAlgorithmProto })
], AlgorithmProto.prototype, "hash", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: AlgorithmProto_1.INDEX++, type: "bytes" })
], AlgorithmProto.prototype, "publicExponent", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: AlgorithmProto_1.INDEX++, type: "uint32" })
], AlgorithmProto.prototype, "modulusLength", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: AlgorithmProto_1.INDEX++, type: "uint32" })
], AlgorithmProto.prototype, "saltLength", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: AlgorithmProto_1.INDEX++, type: "bytes" })
], AlgorithmProto.prototype, "label", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: AlgorithmProto_1.INDEX++, type: "string" })
], AlgorithmProto.prototype, "namedCurve", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: AlgorithmProto_1.INDEX++, converter: tsprotobuf.ArrayBufferConverter })
], AlgorithmProto.prototype, "public", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: AlgorithmProto_1.INDEX++, type: "uint32" })
], AlgorithmProto.prototype, "length", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: AlgorithmProto_1.INDEX++ })
], AlgorithmProto.prototype, "iv", void 0);
AlgorithmProto = AlgorithmProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({ name: "Algorithm" })
], AlgorithmProto);
let CryptoItemProto = CryptoItemProto_1 = class CryptoItemProto extends BaseProto {
};
CryptoItemProto.INDEX = BaseProto.INDEX;
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CryptoItemProto_1.INDEX++, type: "string", required: true })
], CryptoItemProto.prototype, "providerID", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CryptoItemProto_1.INDEX++, type: "bytes", required: true, converter: HexStringConverter })
], CryptoItemProto.prototype, "id", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CryptoItemProto_1.INDEX++, type: "string", required: true })
], CryptoItemProto.prototype, "type", void 0);
CryptoItemProto = CryptoItemProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({ name: "CryptoItem" })
], CryptoItemProto);
let CryptoKeyProto = CryptoKeyProto_1 = class CryptoKeyProto extends CryptoItemProto {
};
CryptoKeyProto.INDEX = CryptoItemProto.INDEX;
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CryptoKeyProto_1.INDEX++, type: "bytes", required: true, parser: AlgorithmProto })
], CryptoKeyProto.prototype, "algorithm", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CryptoKeyProto_1.INDEX++, type: "bool" })
], CryptoKeyProto.prototype, "extractable", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CryptoKeyProto_1.INDEX++, type: "string", repeated: true })
], CryptoKeyProto.prototype, "usages", void 0);
CryptoKeyProto = CryptoKeyProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({ name: "CryptoKey" })
], CryptoKeyProto);
let CryptoKeyPairProto = CryptoKeyPairProto_1 = class CryptoKeyPairProto extends BaseProto {
};
CryptoKeyPairProto.INDEX = BaseProto.INDEX;
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CryptoKeyPairProto_1.INDEX++, name: "privateKey", type: "bytes", parser: CryptoKeyProto })
], CryptoKeyPairProto.prototype, "privateKey", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CryptoKeyPairProto_1.INDEX++, name: "publicKey", type: "bytes", parser: CryptoKeyProto })
], CryptoKeyPairProto.prototype, "publicKey", void 0);
CryptoKeyPairProto = CryptoKeyPairProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({ name: "CryptoKeyPair" })
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
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: ErrorProto_1.INDEX++, type: "uint32", defaultValue: 0 })
], ErrorProto.prototype, "code", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: ErrorProto_1.INDEX++, type: "string", defaultValue: "error" })
], ErrorProto.prototype, "type", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: ErrorProto_1.INDEX++, type: "string", defaultValue: "" })
], ErrorProto.prototype, "message", void 0);
ErrorProto = ErrorProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({ name: "Error" })
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
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: ResultProto_1.INDEX++, type: "bool", defaultValue: false })
], ResultProto.prototype, "status", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: ResultProto_1.INDEX++, type: "bytes", parser: ErrorProto })
], ResultProto.prototype, "error", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: ResultProto_1.INDEX++, type: "bytes", converter: tsprotobuf.ArrayBufferConverter })
], ResultProto.prototype, "data", void 0);
ResultProto = ResultProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({ name: "Result" })
], ResultProto);
let AuthRequestProto = class AuthRequestProto extends ActionProto {
};
AuthRequestProto.INDEX = ActionProto.INDEX;
AuthRequestProto.ACTION = "auth";
AuthRequestProto = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({ name: "AuthRequest" })
], AuthRequestProto);
let ServerLoginActionProto = class ServerLoginActionProto extends ActionProto {
};
ServerLoginActionProto.INDEX = ActionProto.INDEX;
ServerLoginActionProto.ACTION = "server/login";
ServerLoginActionProto = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], ServerLoginActionProto);
let ServerIsLoggedInActionProto = class ServerIsLoggedInActionProto extends ActionProto {
};
ServerIsLoggedInActionProto.INDEX = ActionProto.INDEX;
ServerIsLoggedInActionProto.ACTION = "server/isLoggedIn";
ServerIsLoggedInActionProto = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], ServerIsLoggedInActionProto);

const SERVER_WELL_KNOWN = "/.well-known/webcrypto-socket";

function declareDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
    return dirPath;
}
const USER_DIR = os.homedir();
const APP_DATA_DIR = declareDir(path.join(USER_DIR, ".fortify"));
const DOUBLE_KEY_RATCHET_STORAGE_DIR = declareDir(path.join(APP_DATA_DIR, "2key-ratchet"));
const OPENSSL_CERT_STORAGE_DIR = declareDir(path.join(APP_DATA_DIR, "certstorage"));
const OPENSSL_KEY_STORAGE_DIR = declareDir(path.join(APP_DATA_DIR, "keystorage"));

const D_KEY_IDENTITY_PRE_KEY_AMOUNT = 10;
class OpenSSLStorage {
    constructor() {
        this.identities = {};
        this.remoteIdentities = {};
        this.sessions = {};
    }
    static async create() {
        const res = new this();
        await res.loadIdentities();
        return res;
    }
    async loadIdentities() {
        const identityPath = OpenSSLStorage.STORAGE_NAME + "/identity.json";
        this.identities = {};
        if (fs.existsSync(identityPath)) {
            const data = fs.readFileSync(identityPath).toString();
            let json;
            try {
                json = JSON.parse(data);
            }
            catch (err) {
                return;
            }
            if ((json.version || 0) < 2) {
                this.remoteIdentities = {};
                this.saveIdentities();
                this.saveRemote();
                return;
            }
            for (const origin in json.identities) {
                const jsonIdentity = json.identities[origin];
                jsonIdentity.signingKey.privateKey = await this.ecKeyToCryptoKey(jsonIdentity.signingKey.privateKey, "private", "ECDSA");
                jsonIdentity.signingKey.publicKey = await this.ecKeyToCryptoKey(jsonIdentity.signingKey.publicKey, "public", "ECDSA");
                jsonIdentity.exchangeKey.privateKey = await this.ecKeyToCryptoKey(jsonIdentity.exchangeKey.privateKey, "private", "ECDH");
                jsonIdentity.exchangeKey.publicKey = await this.ecKeyToCryptoKey(jsonIdentity.exchangeKey.publicKey, "public", "ECDH");
                for (const preKey of jsonIdentity.preKeys) {
                    preKey.privateKey = await this.ecKeyToCryptoKey(preKey.privateKey, "private", "ECDH");
                    preKey.publicKey = await this.ecKeyToCryptoKey(preKey.publicKey, "public", "ECDH");
                }
                for (const preKey of jsonIdentity.signedPreKeys) {
                    preKey.privateKey = await this.ecKeyToCryptoKey(preKey.privateKey, "private", "ECDH");
                    preKey.publicKey = await this.ecKeyToCryptoKey(preKey.publicKey, "public", "ECDH");
                }
                this.identities[origin] = await _2keyRatchet.Identity.fromJSON(jsonIdentity);
            }
        }
    }
    async saveIdentities() {
        const jsonIdentities = {};
        for (const origin in this.identities) {
            const identity = this.identities[origin];
            const json = await identity.toJSON();
            const jsonIdentity = json;
            jsonIdentity.signingKey.privateKey = await this.ecKeyToBase64(json.signingKey.privateKey);
            jsonIdentity.signingKey.publicKey = await this.ecKeyToBase64(json.signingKey.publicKey);
            jsonIdentity.exchangeKey.privateKey = await this.ecKeyToBase64(json.exchangeKey.privateKey);
            jsonIdentity.exchangeKey.publicKey = await this.ecKeyToBase64(json.exchangeKey.publicKey);
            for (const preKey of json.preKeys) {
                preKey.privateKey = await this.ecKeyToBase64(preKey.privateKey);
                preKey.publicKey = await this.ecKeyToBase64(preKey.publicKey);
            }
            for (const preKey of json.signedPreKeys) {
                preKey.privateKey = await this.ecKeyToBase64(preKey.privateKey);
                preKey.publicKey = await this.ecKeyToBase64(preKey.publicKey);
            }
            jsonIdentities[origin] = jsonIdentity;
        }
        const jsonIdentityBundle = {
            version: 2,
            identities: jsonIdentities,
        };
        fs.writeFileSync(OpenSSLStorage.STORAGE_NAME + "/identity.json", JSON.stringify(jsonIdentityBundle, null, "  "), {
            encoding: "utf8",
            flag: "w+",
        });
    }
    async getIdentity(origin) {
        let identity = this.identities[origin];
        if (!identity) {
            identity = await _2keyRatchet.Identity.create(0, D_KEY_IDENTITY_PRE_KEY_AMOUNT);
            this.identities[origin] = identity;
            await this.saveIdentities();
        }
        return identity;
    }
    async loadRemoteIdentity(key) {
        await this.loadRemote();
        return this.remoteIdentities[key];
    }
    async saveRemoteIdentity(key, value) {
        this.remoteIdentities[key] = value;
        await this.saveRemote();
    }
    async removeRemoteIdentity(key) {
        delete this.remoteIdentities[key];
        await this.saveRemote();
    }
    async isTrusted(remoteIdentity) {
        const ok = await remoteIdentity.verify();
        if (!ok) {
            return false;
        }
        const trustedIdentity = await this.loadRemoteIdentity(remoteIdentity.signingKey.id);
        if (!trustedIdentity) {
            return false;
        }
        return true;
    }
    async loadSession(key) {
        const res = this.sessions[key];
        return res || null;
    }
    async saveSession(key, value) {
        this.sessions[key] = value;
    }
    async findSession(key) {
        for (const i in this.sessions) {
            const item = this.sessions[i];
            if (await item.hasRatchetKey(key)) {
                return item;
            }
        }
        return false;
    }
    ecKeyToBase64(key) {
        return new Promise((resolve, reject) => {
            const k = key;
            if (key.type === "public") {
                k.native_.exportSpki((err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data.toString("base64"));
                    }
                });
            }
            else {
                k.native_.exportPkcs8((err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data.toString("base64"));
                    }
                });
            }
        });
    }
    ecKeyToCryptoKey(base64, type, alg) {
        if (type === "public") {
            return _2keyRatchet.getEngine().crypto.subtle.importKey("spki", Buffer.from(base64, "base64"), {
                name: alg,
                namedCurve: "P-256",
            }, true, alg === "ECDSA" ? ["verify"] : []);
        }
        else {
            return _2keyRatchet.getEngine().crypto.subtle.importKey("pkcs8", Buffer.from(base64, "base64"), {
                name: alg,
                namedCurve: "P-256",
            }, true, alg === "ECDSA" ? ["sign"] : ["deriveBits", "deriveKey"]);
        }
    }
    async saveRemote() {
        const json = {};
        for (const key in this.remoteIdentities) {
            const remoteIdentity = this.remoteIdentities[key];
            const identity = await remoteIdentity.toJSON();
            json[key] = {
                signingKey: await this.ecKeyToBase64(identity.signingKey),
                exchangeKey: await this.ecKeyToBase64(identity.exchangeKey),
                id: identity.id,
                thumbprint: identity.thumbprint,
                signature: Buffer.from(identity.signature).toString("base64"),
                createdAt: identity.createdAt,
                origin: remoteIdentity.origin,
                userAgent: remoteIdentity.userAgent,
            };
        }
        fs.writeFileSync(OpenSSLStorage.STORAGE_NAME + "/remote.json", JSON.stringify(json, null, "  "), {
            encoding: "utf8",
            flag: "w+",
        });
    }
    async loadRemote() {
        const file = OpenSSLStorage.STORAGE_NAME + "/remote.json";
        this.remoteIdentities = {};
        if (fs.existsSync(file)) {
            const data = fs.readFileSync(file);
            const json = JSON.parse(data.toString());
            for (const key in json) {
                const identity = json[key];
                identity.signingKey = await this.ecKeyToCryptoKey(identity.signingKey, "public", "ECDSA");
                identity.exchangeKey = await this.ecKeyToCryptoKey(identity.exchangeKey, "public", "ECDH");
                identity.signature = pvtsutils.Convert.FromBase64(identity.signature);
                identity.createdAt = new Date(identity.createdAt);
                this.remoteIdentities[key] = await _2keyRatchet.RemoteIdentity.fromJSON(identity);
                this.remoteIdentities[key].origin = identity.origin;
                this.remoteIdentities[key].userAgent = identity.userAgent;
            }
        }
    }
}
OpenSSLStorage.STORAGE_NAME = DOUBLE_KEY_RATCHET_STORAGE_DIR;
OpenSSLStorage.IDENTITY_STORAGE = "identity";
OpenSSLStorage.SESSION_STORAGE = "sessions";
OpenSSLStorage.REMOTE_STORAGE = "remoteIdentity";

class ServerEvent extends Event {
}
class ServerListeningEvent extends ServerEvent {
    constructor(target, address) {
        super(target, "listening");
        this.address = address;
    }
}
class ServerErrorEvent extends ServerEvent {
    constructor(target, error) {
        super(target, "error");
        this.error = error;
    }
}
class ServerDisconnectEvent extends ServerEvent {
    constructor(target, remoteAddress, reasonCode, description) {
        super(target, "close");
        this.remoteAddress = remoteAddress;
        this.reasonCode = reasonCode;
        this.description = description;
    }
}
class ServerMessageEvent extends ServerEvent {
    constructor(target, session, message, resolve, reject) {
        super(target, "message");
        this.message = message;
        this.session = session;
        this.resolve = resolve;
        this.reject = reject;
    }
}
class Server extends events.EventEmitter {
    constructor(options) {
        super();
        this.info = {
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
        this.sessions = [];
        this.options = options;
    }
    emit(event, ...args) {
        return super.emit(event, ...args);
    }
    on(event, listener) {
        return super.on(event, listener);
    }
    once(event, listener) {
        return super.once(event, listener);
    }
    close(callback) {
        this.httpServer.close(callback);
    }
    listen(address) {
        this.httpServer = https.createServer(this.options, (request, response) => {
            (async () => {
                if (request.method === "GET") {
                    const requestUrl = url.parse(request.url);
                    if (requestUrl.pathname === SERVER_WELL_KNOWN) {
                        const bundle = await this.getRandomBundle(request.headers.origin);
                        const preKey = pvtsutils.Convert.ToBase64(bundle);
                        const info = pvtsutils.assign({}, this.info, { preKey });
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
                this.emit("listening", new ServerListeningEvent(this, address));
            })();
        })
            .on("error", (err) => {
            this.emit("error", new ServerErrorEvent(this, err));
        });
        this.socketServer = new WebSocket.server({
            httpServer: this.httpServer,
            autoAcceptConnections: false,
            maxReceivedFrameSize: 128 * 1024 * 1024,
            maxReceivedMessageSize: 128 * 1024 * 1024,
        });
        this.socketServer.on("request", (request) => {
            const connection = request.accept(null, request.origin);
            const session = {
                headers: request.httpRequest.headers,
                connection,
                cipher: null,
                authorized: false,
                identity: null,
            };
            this.sessions.push(session);
            this.emit("connect", session);
            connection.on("message", (message) => {
                if (message.type === "utf8") {
                    this.emit("error", new ServerErrorEvent(this, new WebCryptoLocalError(WebCryptoLocalError.CODE.SERVER_WRONG_MESSAGE, `Received UTF8 message: ${message.utf8Data}`)));
                }
                else if (message.type === "binary") {
                    (async () => {
                        const buffer = new Uint8Array(message.binaryData).buffer;
                        let messageProto;
                        try {
                            messageProto = await _2keyRatchet.MessageSignedProtocol.importProto(buffer);
                        }
                        catch (err) {
                            try {
                                this.emit("info", `Cannot parse MessageSignedProtocol`);
                                const preKeyProto = await _2keyRatchet.PreKeyMessageProtocol.importProto(buffer);
                                messageProto = preKeyProto.signedMessage;
                                session.identity = await this.storage.getIdentity(request.origin);
                                session.cipher = await _2keyRatchet.AsymmetricRatchet.create(session.identity, preKeyProto);
                                const ok = await this.storage.isTrusted(session.cipher.remoteIdentity);
                                if (!ok) {
                                    session.authorized = false;
                                }
                                else {
                                    session.authorized = true;
                                    await this.storage.saveSession(session.cipher.remoteIdentity.signingKey.id, session.cipher);
                                }
                            }
                            catch (err) {
                                throw err;
                            }
                        }
                        if (!session.cipher) {
                            throw new WebCryptoLocalError(WebCryptoLocalError.CODE.SERVER_WRONG_MESSAGE, "Cipher object for 2key session is empty");
                        }
                        const decryptedMessage = await session.cipher.decrypt(messageProto);
                        const actionProto = await ActionProto.importProto(decryptedMessage);
                        return new Promise((resolve, reject) => {
                            if (session.authorized ||
                                actionProto.action === ServerIsLoggedInActionProto.ACTION ||
                                actionProto.action === ServerLoginActionProto.ACTION) {
                                (async () => {
                                    const sessionIdentitySHA256 = await session.cipher.remoteIdentity.signingKey.thumbprint();
                                    this.emit("info", `Server: session:${sessionIdentitySHA256} ${actionProto.action}`);
                                    this.emit("message", new ServerMessageEvent(this, session, actionProto, resolve, reject));
                                })()
                                    .catch((err) => {
                                    this.emit("error", err);
                                });
                            }
                            else {
                                throw new WebCryptoLocalError(WebCryptoLocalError.CODE.SERVER_NOT_LOGGED_IN, "404: Not authorized");
                            }
                        })
                            .then((answer) => {
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
                                    }
                                    else {
                                        resultProto.error = createError(e.message || e.toString());
                                    }
                                }
                                else {
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
                this.sessions = this.sessions.filter((session2) => session2.connection !== connection);
                this.emit("disconnect", new ServerDisconnectEvent(this, connection.remoteAddress, reasonCode, description));
            });
        });
        return this;
    }
    async send(session, data) {
        try {
            let buf;
            if (data instanceof ArrayBuffer) {
                buf = data;
            }
            else {
                buf = await data.exportProto();
            }
            const encryptedData = await session.cipher.encrypt(buf);
            buf = await encryptedData.exportProto();
            session.connection.sendBytes(new Buffer(buf));
        }
        catch (e) {
            this.emit("error", e);
        }
    }
    async getRandomBundle(origin) {
        const preKeyBundle = new _2keyRatchet.PreKeyBundleProtocol();
        const identity = await this.storage.getIdentity(origin);
        await preKeyBundle.identity.fill(identity);
        const preKeyId = getRandomInt(1, identity.signedPreKeys.length) - 1;
        const preKey = identity.signedPreKeys[preKeyId];
        preKeyBundle.preKeySigned.id = preKeyId;
        preKeyBundle.preKeySigned.key = preKey.publicKey;
        await preKeyBundle.preKeySigned.sign(identity.signingKey.privateKey);
        preKeyBundle.registrationId = 0;
        const raw = await preKeyBundle.exportProto();
        return raw;
    }
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
}
function createError(message) {
    const p11Reg = /(CKR_\w+):(\d+)/;
    const p11 = p11Reg.exec(message);
    if (p11) {
        return new ErrorProto(p11[1], parseInt(p11[2], 10), "pkcs11");
    }
    else {
        return new ErrorProto(message);
    }
}

var ProviderCryptoProto_1, ProviderInfoProto_1, ProviderGetCryptoActionProto_1, ProviderTokenEventProto_1;
let ProviderCryptoProto = ProviderCryptoProto_1 = class ProviderCryptoProto extends BaseProto {
    constructor(data) {
        super();
        if (data) {
            pvtsutils.assign(this, data);
        }
    }
};
ProviderCryptoProto.INDEX = BaseProto.INDEX;
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: ProviderCryptoProto_1.INDEX++, required: true, type: "string" })
], ProviderCryptoProto.prototype, "id", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: ProviderCryptoProto_1.INDEX++, required: true, type: "string" })
], ProviderCryptoProto.prototype, "name", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: ProviderCryptoProto_1.INDEX++, type: "bool", defaultValue: false })
], ProviderCryptoProto.prototype, "readOnly", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: ProviderCryptoProto_1.INDEX++, repeated: true, type: "string" })
], ProviderCryptoProto.prototype, "algorithms", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: ProviderCryptoProto_1.INDEX++, type: "bool", defaultValue: false })
], ProviderCryptoProto.prototype, "isRemovable", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: ProviderCryptoProto_1.INDEX++, type: "string" })
], ProviderCryptoProto.prototype, "atr", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: ProviderCryptoProto_1.INDEX++, type: "bool", defaultValue: false })
], ProviderCryptoProto.prototype, "isHardware", void 0);
ProviderCryptoProto = ProviderCryptoProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], ProviderCryptoProto);
let ProviderInfoProto = ProviderInfoProto_1 = class ProviderInfoProto extends BaseProto {
};
ProviderInfoProto.INDEX = BaseProto.INDEX;
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: ProviderInfoProto_1.INDEX++, type: "string", required: true })
], ProviderInfoProto.prototype, "name", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: ProviderInfoProto_1.INDEX++, repeated: true, parser: ProviderCryptoProto })
], ProviderInfoProto.prototype, "providers", void 0);
ProviderInfoProto = ProviderInfoProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], ProviderInfoProto);
let ProviderInfoActionProto = class ProviderInfoActionProto extends ActionProto {
};
ProviderInfoActionProto.INDEX = ActionProto.INDEX;
ProviderInfoActionProto.ACTION = "provider/action/info";
ProviderInfoActionProto = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], ProviderInfoActionProto);
let ProviderGetCryptoActionProto = ProviderGetCryptoActionProto_1 = class ProviderGetCryptoActionProto extends ActionProto {
};
ProviderGetCryptoActionProto.INDEX = ActionProto.INDEX;
ProviderGetCryptoActionProto.ACTION = "provider/action/getCrypto";
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: ProviderGetCryptoActionProto_1.INDEX++, required: true, type: "string" })
], ProviderGetCryptoActionProto.prototype, "cryptoID", void 0);
ProviderGetCryptoActionProto = ProviderGetCryptoActionProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], ProviderGetCryptoActionProto);
let ProviderAuthorizedEventProto = class ProviderAuthorizedEventProto extends ActionProto {
};
ProviderAuthorizedEventProto.INDEX = ActionProto.INDEX;
ProviderAuthorizedEventProto.ACTION = "provider/event/authorized";
ProviderAuthorizedEventProto = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], ProviderAuthorizedEventProto);
let ProviderTokenEventProto = ProviderTokenEventProto_1 = class ProviderTokenEventProto extends ActionProto {
    constructor(data) {
        super();
        if (data) {
            pvtsutils.assign(this, data);
        }
    }
};
ProviderTokenEventProto.INDEX = ActionProto.INDEX;
ProviderTokenEventProto.ACTION = "provider/event/token";
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: ProviderTokenEventProto_1.INDEX++, repeated: true, parser: ProviderCryptoProto })
], ProviderTokenEventProto.prototype, "added", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: ProviderTokenEventProto_1.INDEX++, repeated: true, parser: ProviderCryptoProto })
], ProviderTokenEventProto.prototype, "removed", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: ProviderTokenEventProto_1.INDEX++, type: "bytes", parser: ErrorProto })
], ProviderTokenEventProto.prototype, "error", void 0);
ProviderTokenEventProto = ProviderTokenEventProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({ name: "ProviderTokenEvent" })
], ProviderTokenEventProto);

var CardReaderEventProto_1;
let CardReaderActionProto = class CardReaderActionProto extends ActionProto {
};
CardReaderActionProto.INDEX = ActionProto.INDEX;
CardReaderActionProto.ACTION = "cardReader";
CardReaderActionProto = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], CardReaderActionProto);
let CardReaderGetReadersActionProto = class CardReaderGetReadersActionProto extends ActionProto {
};
CardReaderGetReadersActionProto.INDEX = ActionProto.INDEX;
CardReaderGetReadersActionProto.ACTION = "cardReader/readers";
CardReaderGetReadersActionProto = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
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
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CardReaderEventProto_1.INDEX++, required: true, type: "string", defaultValue: "" })
], CardReaderEventProto.prototype, "reader", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CardReaderEventProto_1.INDEX++, required: true, converter: HexStringConverter })
], CardReaderEventProto.prototype, "atr", void 0);
CardReaderEventProto = CardReaderEventProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], CardReaderEventProto);
let CardReaderInsertEventProto = class CardReaderInsertEventProto extends CardReaderEventProto {
};
CardReaderInsertEventProto.INDEX = CardReaderEventProto.INDEX;
CardReaderInsertEventProto.ACTION = CardReaderEventProto.ACTION + "/insert";
CardReaderInsertEventProto = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], CardReaderInsertEventProto);
let CardReaderRemoveEventProto = class CardReaderRemoveEventProto extends CardReaderEventProto {
};
CardReaderRemoveEventProto.INDEX = CardReaderEventProto.INDEX;
CardReaderRemoveEventProto.ACTION = CardReaderEventProto.ACTION + "/remove";
CardReaderRemoveEventProto = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], CardReaderRemoveEventProto);

const DEFAULT_HASH_ALG = "sha256";
let PV_PKCS11_LIB = "";
if (process.versions.electron) {
    let libName = "";
    switch (os.platform()) {
        case "win32":
            libName = "pvpkcs11.dll";
            PV_PKCS11_LIB = path.join(__dirname, "..", "..", "..", "..", "..", libName);
            break;
        case "darwin":
            libName = "libpvpkcs11.dylib";
            PV_PKCS11_LIB = path.join(__dirname, "..", "..", "..", libName);
            break;
        default:
            libName = "pvpkcs11.so";
            PV_PKCS11_LIB = path.join(__dirname, "..", "..", "..", libName);
    }
}
else {
    switch (os.platform()) {
        case "win32":
            PV_PKCS11_LIB = "/github/pv/pvpkcs11/build/Debug/pvpkcs11.dll";
            break;
        case "darwin":
            PV_PKCS11_LIB = "/Users/microshine/Library/Developer/Xcode/DerivedData/config-hkruqzwffnciyjeujlpxkaxbdiun/Build/Products/Debug/libpvpkcs11.dylib";
            break;
        default:
            PV_PKCS11_LIB = "/usr/local/lib/softhsm/libsofthsm2.so";
    }
}

const pcsc = require("pcsclite");
class PCSCWatcher extends events.EventEmitter {
    constructor() {
        super();
        this.readers = [];
        this.pcsc = null;
    }
    start() {
        try {
            this.pcsc = pcsc();
            this.pcsc.on("error", (err) => {
                this.emit("error", err);
            });
            this.pcsc.on("reader", (reader) => {
                this.emit("info", `PCSCWatcher: New reader detected ${reader.name}`);
                this.readers.push(reader);
                let atr;
                reader.state = 0;
                reader.on("error", (err) => {
                    this.emit("error", err);
                });
                reader.on("status", (status) => {
                    const changes = reader.state ^ status.state;
                    if (changes) {
                        if ((changes & reader.SCARD_STATE_EMPTY) && (status.state & reader.SCARD_STATE_EMPTY)) {
                            if (atr) {
                                const event = {
                                    reader,
                                    atr,
                                };
                                this.emit("remove", event);
                                atr = null;
                            }
                        }
                        else if ((changes & reader.SCARD_STATE_PRESENT) && (status.state & reader.SCARD_STATE_PRESENT)) {
                            const event = {
                                reader,
                            };
                            if (status.atr && status.atr.byteLength) {
                                atr = status.atr;
                                event.atr = atr;
                            }
                            this.emit("info", `PCSCWatcher:Insert reader:'${reader.name}' ATR:${atr && atr.toString("hex")}`);
                            setTimeout(() => {
                                this.emit("insert", event);
                            }, 1e3);
                        }
                    }
                });
                reader.on("end", () => {
                    if (atr) {
                        const event = {
                            reader,
                            atr,
                        };
                        this.emit("remove", event);
                        atr = null;
                    }
                });
            });
        }
        catch (err) {
            this.emit("error", new WebCryptoLocalError(WebCryptoLocalError.CODE.PCSC_CANNOT_START));
        }
        return this;
    }
    stop() {
        if (this.pcsc) {
            this.pcsc.close();
            this.pcsc = null;
        }
    }
    on(event, cb) {
        return super.on(event, cb);
    }
}
class CardConfig {
    constructor() {
        this.cards = {};
    }
    static readFile(fPath) {
        const res = new this();
        res.readFile(fPath);
        return res;
    }
    readFile(fPath) {
        if (!fs.existsSync(fPath)) {
            throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CARD_CONFIG_COMMON, `Cannot find file '${fPath}'`);
        }
        const data = fs.readFileSync(fPath);
        let json;
        try {
            json = JSON.parse(data.toString());
        }
        catch (err) {
            throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CARD_CONFIG_COMMON, "Cannot parse JSON file");
        }
        this.fromJSON(json);
    }
    getItem(atr) {
        return this.cards[atr.toString("hex")] || null;
    }
    fromJSON(json) {
        const cards = {};
        const drivers = {};
        json.drivers.forEach((jsonDriver) => {
            const driver = {
                id: jsonDriver.id,
                name: jsonDriver.name,
                libraries: [],
            };
            drivers[jsonDriver.id] = driver;
            let system;
            switch (os.type()) {
                case "Linux":
                    system = "linux";
                    break;
                case "Windows_NT":
                    system = "windows";
                    break;
                case "Darwin":
                    system = "osx";
                    break;
                default:
                    throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CARD_CONFIG_COMMON, "Unsupported OS");
            }
            let library = [];
            const driverLib = jsonDriver.file[system];
            if (driverLib) {
                if (typeof driverLib === "string") {
                    library = [driverLib];
                }
                else if (Array.isArray(driverLib)) {
                    library = driverLib;
                }
                else {
                    if (process.arch === "x64") {
                        if (driverLib.x64) {
                            if (Array.isArray(driverLib.x64)) {
                                library.concat(driverLib.x64);
                            }
                            else {
                                library.push(driverLib.x64);
                            }
                        }
                        if (driverLib.x86) {
                            if (Array.isArray(driverLib.x86)) {
                                library.concat(driverLib.x86);
                            }
                            else {
                                library.push(driverLib.x86);
                            }
                        }
                    }
                    else {
                        if (driverLib.x86) {
                            if (Array.isArray(driverLib.x86)) {
                                library.concat(driverLib.x86);
                            }
                            else {
                                library.push(driverLib.x86);
                            }
                        }
                    }
                }
            }
            if (os.platform() === "win32") {
                library.push(PV_PKCS11_LIB);
            }
            driver.libraries = library.map((lib) => {
                let res = replaceTemplates(lib, process.env, "%");
                if (json.vars) {
                    res = replaceTemplates(lib, json.vars, "<");
                }
                return path.normalize(res);
            });
        });
        json.cards.forEach((item) => {
            const card = {};
            card.atr = new Buffer(item.atr, "hex");
            if (item.mask) {
                card.mask = new Buffer(item.mask);
            }
            card.name = item.name;
            card.readOnly = !!item.readOnly;
            const driver = drivers[item.driver];
            if (!driver) {
                throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CARD_CONFIG_COMMON, `Cannot find driver for card ${item.name} (${item.atr})`);
            }
            if (driver.libraries.length) {
                card.libraries = driver.libraries;
                cards[card.atr.toString("hex")] = card;
            }
        });
        this.cards = cards;
    }
}
class CardWatcher extends events.EventEmitter {
    constructor() {
        super();
        this.cards = [];
        this.config = new CardConfig();
        this.watcher = new PCSCWatcher();
        this.watcher
            .on("info", (message) => {
            this.emit("info", message);
        })
            .on("error", (err) => {
            this.emit("error", err);
        })
            .on("insert", (e) => {
            try {
                let card = this.config.getItem(e.atr);
                if (!card && os.platform() === "win32") {
                    card = {
                        atr: e.atr,
                        reader: e.reader.name,
                        libraries: [PV_PKCS11_LIB],
                        name: "SCard Windows API",
                        readOnly: false,
                    };
                }
                if (card) {
                    card.reader = e.reader.name;
                    this.add(card);
                    this.emit("insert", card);
                }
                else {
                    this.emit("new", {
                        reader: e.reader.name,
                        atr: e.atr,
                    });
                }
            }
            catch (e) {
                this.emit("error", e);
            }
        })
            .on("remove", (e) => {
            try {
                let card = this.config.getItem(e.atr);
                if (!card && os.platform() === "win32") {
                    card = {
                        atr: e.atr,
                        reader: e.reader.name,
                        libraries: [PV_PKCS11_LIB],
                        name: "SCard Windows API",
                        readOnly: false,
                    };
                }
                if (card) {
                    card.reader = e.reader.name;
                    this.remove(card);
                    this.emit("remove", card);
                }
            }
            catch (e) {
                this.emit("error", e);
            }
        });
    }
    on(event, cb) {
        return super.on(event, cb);
    }
    start(config) {
        try {
            this.config = CardConfig.readFile(config);
        }
        catch (e) {
            this.emit("error", e.message);
        }
        this.watcher.start();
    }
    stop() {
        this.watcher.stop();
    }
    add(card) {
        if (!this.cards.some((item) => item === card)) {
            this.cards.push(card);
        }
    }
    remove(card) {
        this.cards = this.cards.filter((item) => item !== card);
    }
}
function replaceTemplates(text, args, prefix) {
    const envReg = new RegExp(`\\${prefix}([\\w\\d\\(\\)\\-\\_]+)`, "gi");
    let res;
    let resText = text;
    while (res = envReg.exec(text)) {
        const argsName = res[1];
        let argsValue = null;
        for (const key in args) {
            if (key.toLowerCase() === argsName.toLowerCase()) {
                argsValue = args[key];
                break;
            }
        }
        if (argsValue) {
            resText = resText.replace(new RegExp(`\\${prefix}${argsName.replace(/([\(\)])/g, "\\$1")}`, "i"), argsValue);
        }
    }
    return resText;
}

class Service extends events.EventEmitter {
    constructor(server, object, filter = []) {
        super();
        this.services = [];
        this.server = server;
        this.object = object;
        this.server
            .on("message", (e) => {
            if (filter.some((item) => item.ACTION === e.message.action)) {
                this.onMessage(e.session, e.message)
                    .then(e.resolve, e.reject);
            }
        });
        if (!(this.object instanceof Service)) {
            this.object
                .on("info", (message) => {
                this.emit("info", message);
            })
                .on("error", (error) => {
                this.emit("error", error);
            });
        }
    }
    addService(service) {
        this.services.push(service);
        service
            .on("info", (message) => {
            this.emit("info", message);
        })
            .on("error", (error) => {
            this.emit("error", error);
        });
    }
    emit(event, ...args) {
        return super.emit(event, ...args);
    }
    on(event, cb) {
        return super.on(event, cb);
    }
    once(event, cb) {
        return super.once(event, cb);
    }
}

class CardReaderService extends Service {
    constructor(server) {
        super(server, new PCSCWatcher(), [
            CardReaderGetReadersActionProto,
        ]);
        this.object.on("insert", this.onInsert.bind(this));
        this.object.on("remove", this.onRemove.bind(this));
    }
    start() {
        this.object.start();
    }
    stop() {
        this.object.stop();
    }
    on(event, cb) {
        return super.on(event, cb);
    }
    once(event, cb) {
        return super.once(event, cb);
    }
    onInsert(e) {
        this.server.sessions.forEach((session) => {
            if (session.authorized) {
                const eventProto = CardReaderInsertEventProto.fromObject(e);
                this.server.send(session, eventProto);
            }
        });
    }
    onRemove(e) {
        this.server.sessions.forEach((session) => {
            if (session.authorized) {
                const eventProto = CardReaderRemoveEventProto.fromObject(e);
                this.server.send(session, eventProto);
            }
        });
    }
    async onMessage(session, action) {
        const result = new ResultProto(action);
        switch (action.action) {
            case CardReaderGetReadersActionProto.ACTION: {
                result.data = pvtsutils.Convert.FromString(JSON.stringify(this.object.readers));
                break;
            }
            default:
                throw new WebCryptoLocalError(WebCryptoLocalError.CODE.ACTION_NOT_IMPLEMENTED, `Action '${action.action}' is not implemented`);
        }
        return result;
    }
}

var CryptoActionProto_1;
let CryptoActionProto = CryptoActionProto_1 = class CryptoActionProto extends ActionProto {
};
CryptoActionProto.INDEX = ActionProto.INDEX;
CryptoActionProto.ACTION = "crypto";
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CryptoActionProto_1.INDEX++, required: true, type: "string" })
], CryptoActionProto.prototype, "providerID", void 0);
CryptoActionProto = CryptoActionProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], CryptoActionProto);
let LoginActionProto = class LoginActionProto extends CryptoActionProto {
};
LoginActionProto.INDEX = CryptoActionProto.INDEX;
LoginActionProto.ACTION = "crypto/login";
LoginActionProto = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], LoginActionProto);
let LogoutActionProto = class LogoutActionProto extends CryptoActionProto {
};
LogoutActionProto.INDEX = CryptoActionProto.INDEX;
LogoutActionProto.ACTION = "crypto/logout";
LogoutActionProto = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], LogoutActionProto);
let IsLoggedInActionProto = class IsLoggedInActionProto extends CryptoActionProto {
};
IsLoggedInActionProto.INDEX = CryptoActionProto.INDEX;
IsLoggedInActionProto.ACTION = "crypto/isLoggedIn";
IsLoggedInActionProto = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], IsLoggedInActionProto);
let ResetActionProto = class ResetActionProto extends CryptoActionProto {
};
ResetActionProto.INDEX = CryptoActionProto.INDEX;
ResetActionProto.ACTION = "crypto/reset";
ResetActionProto = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], ResetActionProto);

var CryptoCertificateProto_1, CryptoX509CertificateProto_1, CryptoX509CertificateRequestProto_1, ChainItemProto_1, CertificateStorageGetChainResultProto_1, CertificateStorageSetItemActionProto_1, CertificateStorageGetItemActionProto_1, CertificateStorageRemoveItemActionProto_1, CertificateStorageImportActionProto_1, CertificateStorageExportActionProto_1, CertificateStorageIndexOfActionProto_1, CertificateStorageGetCRLActionProto_1, OCSPRequestOptionsProto_1, CertificateStorageGetOCSPActionProto_1;
let CryptoCertificateProto = CryptoCertificateProto_1 = class CryptoCertificateProto extends CryptoItemProto {
};
CryptoCertificateProto.INDEX = CryptoItemProto.INDEX;
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CryptoCertificateProto_1.INDEX++, required: true, converter: HexStringConverter })
], CryptoCertificateProto.prototype, "id", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CryptoCertificateProto_1.INDEX++, required: true, parser: CryptoKeyProto })
], CryptoCertificateProto.prototype, "publicKey", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CryptoCertificateProto_1.INDEX++, required: true, type: "string" })
], CryptoCertificateProto.prototype, "type", void 0);
CryptoCertificateProto = CryptoCertificateProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], CryptoCertificateProto);
let CryptoX509CertificateProto = CryptoX509CertificateProto_1 = class CryptoX509CertificateProto extends CryptoCertificateProto {
    constructor() {
        super(...arguments);
        this.type = "x509";
    }
};
CryptoX509CertificateProto.INDEX = CryptoCertificateProto.INDEX;
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CryptoX509CertificateProto_1.INDEX++, required: true, converter: HexStringConverter })
], CryptoX509CertificateProto.prototype, "serialNumber", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CryptoX509CertificateProto_1.INDEX++, required: true, type: "string" })
], CryptoX509CertificateProto.prototype, "issuerName", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CryptoX509CertificateProto_1.INDEX++, required: true, type: "string" })
], CryptoX509CertificateProto.prototype, "subjectName", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CryptoX509CertificateProto_1.INDEX++, required: true, converter: DateConverter })
], CryptoX509CertificateProto.prototype, "notBefore", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CryptoX509CertificateProto_1.INDEX++, required: true, converter: DateConverter })
], CryptoX509CertificateProto.prototype, "notAfter", void 0);
CryptoX509CertificateProto = CryptoX509CertificateProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], CryptoX509CertificateProto);
let CryptoX509CertificateRequestProto = CryptoX509CertificateRequestProto_1 = class CryptoX509CertificateRequestProto extends CryptoCertificateProto {
    constructor() {
        super(...arguments);
        this.type = "request";
    }
};
CryptoX509CertificateRequestProto.INDEX = CryptoCertificateProto.INDEX;
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CryptoX509CertificateRequestProto_1.INDEX++, required: true, type: "string" })
], CryptoX509CertificateRequestProto.prototype, "subjectName", void 0);
CryptoX509CertificateRequestProto = CryptoX509CertificateRequestProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], CryptoX509CertificateRequestProto);
let ChainItemProto = ChainItemProto_1 = class ChainItemProto extends BaseProto {
};
ChainItemProto.INDEX = BaseProto.INDEX;
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({
        id: ChainItemProto_1.INDEX++,
        required: true,
        type: "string",
    })
], ChainItemProto.prototype, "type", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({
        id: ChainItemProto_1.INDEX++,
        required: true,
        converter: tsprotobuf.ArrayBufferConverter,
    })
], ChainItemProto.prototype, "value", void 0);
ChainItemProto = ChainItemProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], ChainItemProto);
let CertificateStorageGetChainResultProto = CertificateStorageGetChainResultProto_1 = class CertificateStorageGetChainResultProto extends BaseProto {
    constructor() {
        super(...arguments);
        this.items = [];
    }
};
CertificateStorageGetChainResultProto.INDEX = BaseProto.INDEX;
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({
        id: CertificateStorageGetChainResultProto_1.INDEX++,
        required: true,
        repeated: true,
        parser: ChainItemProto,
    })
], CertificateStorageGetChainResultProto.prototype, "items", void 0);
CertificateStorageGetChainResultProto = CertificateStorageGetChainResultProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], CertificateStorageGetChainResultProto);
let CertificateStorageSetItemActionProto = CertificateStorageSetItemActionProto_1 = class CertificateStorageSetItemActionProto extends CryptoActionProto {
};
CertificateStorageSetItemActionProto.INDEX = CryptoActionProto.INDEX;
CertificateStorageSetItemActionProto.ACTION = "crypto/certificateStorage/setItem";
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CertificateStorageSetItemActionProto_1.INDEX++, required: true, parser: CryptoCertificateProto })
], CertificateStorageSetItemActionProto.prototype, "item", void 0);
CertificateStorageSetItemActionProto = CertificateStorageSetItemActionProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], CertificateStorageSetItemActionProto);
let CertificateStorageGetItemActionProto = CertificateStorageGetItemActionProto_1 = class CertificateStorageGetItemActionProto extends CryptoActionProto {
};
CertificateStorageGetItemActionProto.INDEX = CryptoActionProto.INDEX;
CertificateStorageGetItemActionProto.ACTION = "crypto/certificateStorage/getItem";
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CertificateStorageGetItemActionProto_1.INDEX++, required: true, type: "string" })
], CertificateStorageGetItemActionProto.prototype, "key", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CertificateStorageGetItemActionProto_1.INDEX++, parser: AlgorithmProto })
], CertificateStorageGetItemActionProto.prototype, "algorithm", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CertificateStorageGetItemActionProto_1.INDEX++, repeated: true, type: "string" })
], CertificateStorageGetItemActionProto.prototype, "keyUsages", void 0);
CertificateStorageGetItemActionProto = CertificateStorageGetItemActionProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], CertificateStorageGetItemActionProto);
let CertificateStorageKeysActionProto = class CertificateStorageKeysActionProto extends CryptoActionProto {
};
CertificateStorageKeysActionProto.INDEX = CryptoActionProto.INDEX;
CertificateStorageKeysActionProto.ACTION = "crypto/certificateStorage/keys";
CertificateStorageKeysActionProto = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], CertificateStorageKeysActionProto);
let CertificateStorageRemoveItemActionProto = CertificateStorageRemoveItemActionProto_1 = class CertificateStorageRemoveItemActionProto extends CryptoActionProto {
};
CertificateStorageRemoveItemActionProto.INDEX = CryptoActionProto.INDEX;
CertificateStorageRemoveItemActionProto.ACTION = "crypto/certificateStorage/removeItem";
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CertificateStorageRemoveItemActionProto_1.INDEX++, required: true, type: "string" })
], CertificateStorageRemoveItemActionProto.prototype, "key", void 0);
CertificateStorageRemoveItemActionProto = CertificateStorageRemoveItemActionProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], CertificateStorageRemoveItemActionProto);
let CertificateStorageClearActionProto = class CertificateStorageClearActionProto extends CryptoActionProto {
};
CertificateStorageClearActionProto.INDEX = CryptoActionProto.INDEX;
CertificateStorageClearActionProto.ACTION = "crypto/certificateStorage/clear";
CertificateStorageClearActionProto = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], CertificateStorageClearActionProto);
let CertificateStorageImportActionProto = CertificateStorageImportActionProto_1 = class CertificateStorageImportActionProto extends CryptoActionProto {
};
CertificateStorageImportActionProto.INDEX = CryptoActionProto.INDEX;
CertificateStorageImportActionProto.ACTION = "crypto/certificateStorage/import";
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CertificateStorageImportActionProto_1.INDEX++, required: true, type: "string" })
], CertificateStorageImportActionProto.prototype, "format", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CertificateStorageImportActionProto_1.INDEX++, required: true, converter: tsprotobuf.ArrayBufferConverter })
], CertificateStorageImportActionProto.prototype, "data", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CertificateStorageImportActionProto_1.INDEX++, required: true, parser: AlgorithmProto })
], CertificateStorageImportActionProto.prototype, "algorithm", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CertificateStorageImportActionProto_1.INDEX++, repeated: true, type: "string" })
], CertificateStorageImportActionProto.prototype, "keyUsages", void 0);
CertificateStorageImportActionProto = CertificateStorageImportActionProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], CertificateStorageImportActionProto);
let CertificateStorageExportActionProto = CertificateStorageExportActionProto_1 = class CertificateStorageExportActionProto extends CryptoActionProto {
};
CertificateStorageExportActionProto.INDEX = CryptoActionProto.INDEX;
CertificateStorageExportActionProto.ACTION = "crypto/certificateStorage/export";
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CertificateStorageExportActionProto_1.INDEX++, required: true, type: "string" })
], CertificateStorageExportActionProto.prototype, "format", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CertificateStorageExportActionProto_1.INDEX++, required: true, parser: CryptoCertificateProto })
], CertificateStorageExportActionProto.prototype, "item", void 0);
CertificateStorageExportActionProto = CertificateStorageExportActionProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], CertificateStorageExportActionProto);
let CertificateStorageIndexOfActionProto = CertificateStorageIndexOfActionProto_1 = class CertificateStorageIndexOfActionProto extends CryptoActionProto {
};
CertificateStorageIndexOfActionProto.INDEX = CryptoActionProto.INDEX;
CertificateStorageIndexOfActionProto.ACTION = "crypto/certificateStorage/indexOf";
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CertificateStorageIndexOfActionProto_1.INDEX++, required: true, parser: CryptoCertificateProto })
], CertificateStorageIndexOfActionProto.prototype, "item", void 0);
CertificateStorageIndexOfActionProto = CertificateStorageIndexOfActionProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], CertificateStorageIndexOfActionProto);
let CertificateStorageGetChainActionProto = class CertificateStorageGetChainActionProto extends CryptoActionProto {
};
CertificateStorageGetChainActionProto.INDEX = CryptoActionProto.INDEX;
CertificateStorageGetChainActionProto.ACTION = "crypto/certificateStorage/getChain";
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CertificateStorageSetItemActionProto.INDEX++, required: true, parser: CryptoCertificateProto })
], CertificateStorageGetChainActionProto.prototype, "item", void 0);
CertificateStorageGetChainActionProto = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], CertificateStorageGetChainActionProto);
let CertificateStorageGetCRLActionProto = CertificateStorageGetCRLActionProto_1 = class CertificateStorageGetCRLActionProto extends CryptoActionProto {
};
CertificateStorageGetCRLActionProto.INDEX = CryptoActionProto.INDEX;
CertificateStorageGetCRLActionProto.ACTION = "crypto/certificateStorage/getCRL";
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CertificateStorageGetCRLActionProto_1.INDEX++, required: true, type: "string" })
], CertificateStorageGetCRLActionProto.prototype, "url", void 0);
CertificateStorageGetCRLActionProto = CertificateStorageGetCRLActionProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], CertificateStorageGetCRLActionProto);
let OCSPRequestOptionsProto = OCSPRequestOptionsProto_1 = class OCSPRequestOptionsProto extends BaseProto {
};
OCSPRequestOptionsProto.INDEX = BaseProto.INDEX;
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: OCSPRequestOptionsProto_1.INDEX++, required: false, type: "string", defaultValue: "get" })
], OCSPRequestOptionsProto.prototype, "method", void 0);
OCSPRequestOptionsProto = OCSPRequestOptionsProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], OCSPRequestOptionsProto);
let CertificateStorageGetOCSPActionProto = CertificateStorageGetOCSPActionProto_1 = class CertificateStorageGetOCSPActionProto extends CryptoActionProto {
};
CertificateStorageGetOCSPActionProto.INDEX = CryptoActionProto.INDEX;
CertificateStorageGetOCSPActionProto.ACTION = "crypto/certificateStorage/getOCSP";
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CertificateStorageGetOCSPActionProto_1.INDEX++, required: true, type: "string" })
], CertificateStorageGetOCSPActionProto.prototype, "url", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CertificateStorageGetOCSPActionProto_1.INDEX++, required: true, converter: tsprotobuf.ArrayBufferConverter })
], CertificateStorageGetOCSPActionProto.prototype, "request", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: CertificateStorageGetOCSPActionProto_1.INDEX++, required: false, parser: OCSPRequestOptionsProto })
], CertificateStorageGetOCSPActionProto.prototype, "options", void 0);
CertificateStorageGetOCSPActionProto = CertificateStorageGetOCSPActionProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], CertificateStorageGetOCSPActionProto);

function digest(alg, data) {
    const hash = crypto$1.createHash(alg);
    hash.update(data);
    return hash.digest();
}

class ServiceCryptoItem {
    constructor(item, providerID) {
        const p11Object = item.p11Object;
        const id = `${providerID}${p11Object.session.handle.toString()}${p11Object.handle.toString()}${item.type}${item.id}`;
        this.id = digest(DEFAULT_HASH_ALG, id).toString("hex");
        this.item = item;
        this.providerID = providerID;
    }
    toKeyProto(item) {
        const itemProto = new CryptoKeyProto();
        itemProto.providerID = this.providerID;
        itemProto.id = this.id;
        itemProto.algorithm.fromAlgorithm(item.algorithm);
        itemProto.extractable = item.extractable;
        itemProto.type = item.type;
        itemProto.usages = item.usages;
        return itemProto;
    }
    toX509Proto(item) {
        const itemProto = new CryptoX509CertificateProto();
        itemProto.providerID = this.providerID;
        itemProto.publicKey = this.toKeyProto(item.publicKey);
        itemProto.id = itemProto.publicKey.id;
        itemProto.serialNumber = item.serialNumber;
        itemProto.issuerName = item.issuerName;
        itemProto.subjectName = item.subjectName;
        itemProto.notBefore = item.notBefore;
        itemProto.notAfter = item.notAfter;
        itemProto.type = item.type;
        return itemProto;
    }
    toX509RequestProto(item) {
        const itemProto = new CryptoX509CertificateRequestProto();
        itemProto.providerID = this.providerID;
        itemProto.publicKey = this.toKeyProto(item.publicKey);
        itemProto.id = itemProto.publicKey.id;
        itemProto.subjectName = item.subjectName;
        itemProto.type = item.type;
        return itemProto;
    }
    toProto() {
        switch (this.item.type) {
            case "secret":
            case "public":
            case "private": {
                return this.toKeyProto(this.item);
            }
            case "x509": {
                return this.toX509Proto(this.item);
            }
            case "request": {
                return this.toX509RequestProto(this.item);
            }
            default:
                throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CARD_CONFIG_COMMON, `Unsupported CertificateItem type '${this.item.type}'`);
        }
    }
}

class MemoryStorage {
    constructor() {
        this.items = {};
    }
    get length() {
        return Object.keys(this.items).length;
    }
    item(id) {
        const result = this.items[id];
        if (!result) {
            throw new WebCryptoLocalError(WebCryptoLocalError.CODE.MEMORY_STORAGE_OUT_OF_INDEX, `Cannot get crypto item by ID '${id}'`);
        }
        return result;
    }
    hasItem(param) {
        if (param instanceof ServiceCryptoItem) {
            return !!this.items[param.id];
        }
        else {
            return !!this.items[param];
        }
    }
    add(item) {
        this.items[item.id] = item;
    }
    remove(param) {
        if (param instanceof ServiceCryptoItem) {
            delete this.items[param.id];
        }
        else {
            delete this.items[param];
        }
    }
    removeAll() {
        this.items = {};
    }
    removeByProvider(providerID) {
        const IDs = [];
        for (const id in this.items) {
            const item = this.items[id];
            if (item.providerID === providerID) {
                IDs.push(id);
            }
        }
        IDs.forEach((id) => {
            this.remove(id);
        });
    }
}

class Map extends events.EventEmitter {
    constructor() {
        super(...arguments);
        this.items = {};
    }
    get length() {
        return Object.keys(this.items).length;
    }
    indexOf(item) {
        let index = null;
        this.some((item2, index2) => {
            if (item === item2) {
                index = index2;
                return true;
            }
            return false;
        });
        return index;
    }
    on(event, callback) {
        return super.on(event, callback);
    }
    once(event, callback) {
        return super.once(event, callback);
    }
    emit(event, ...args) {
        return super.emit(event, ...args);
    }
    add(key, item) {
        this.items[key] = item;
        this.emit("add", ({
            key,
            item,
        }));
    }
    remove(key) {
        const item = this.items[key];
        delete this.items[key];
        this.emit("remove", ({
            key,
            item,
        }));
    }
    clear() {
        this.forEach((item, index) => {
            this.remove(index);
        });
    }
    item(id) {
        return this.items[id];
    }
    forEach(callback) {
        for (const index in this.items) {
            callback(this.items[index], index, this);
        }
        return this;
    }
    some(callback) {
        for (const index in this.items) {
            if (callback(this.items[index], index, this)) {
                return true;
            }
        }
        return false;
    }
    map(callback) {
        const res = [];
        for (const index in this.items) {
            res.push(callback(this.items[index], index, this));
        }
        return res;
    }
}

class CryptoMap extends Map {
}

class Certificate {
    constructor() {
        this.crypto = _2keyRatchet.getEngine().crypto;
    }
    static async importCert(provider, rawData, algorithm, keyUsages) {
        const res = new this();
        await res.importCert(provider, rawData, algorithm, keyUsages);
        return res;
    }
    exportRaw() {
        return this.raw.buffer;
    }
    async importCert(provider, rawData, algorithm, keyUsages) {
        this.importRaw(rawData);
        this.publicKey = await this.exportKey(provider, algorithm, keyUsages);
        this.id = await this.getID(provider, "SHA-1");
    }
    async getID(provider, algorithm) {
        const publicKey = await this.exportKey(provider);
        const spki = await provider.subtle.exportKey("spki", publicKey);
        const sha1Hash = await provider.subtle.digest("SHA-1", spki);
        const rnd = this.crypto.getRandomValues(new Uint8Array(4));
        return `${this.type}-${pvtsutils.Convert.ToHex(rnd)}-${pvtsutils.Convert.ToHex(sha1Hash)}`;
    }
}

const OID = {
    "2.5.4.3": {
        short: "CN",
        long: "CommonName",
    },
    "2.5.4.6": {
        short: "C",
        long: "Country",
    },
    "2.5.4.5": {
        long: "DeviceSerialNumber",
    },
    "0.9.2342.19200300.100.1.25": {
        short: "DC",
        long: "DomainComponent",
    },
    "1.2.840.113549.1.9.1": {
        short: "E",
        long: "EMail",
    },
    "2.5.4.42": {
        short: "G",
        long: "GivenName",
    },
    "2.5.4.43": {
        short: "I",
        long: "Initials",
    },
    "2.5.4.7": {
        short: "L",
        long: "Locality",
    },
    "2.5.4.10": {
        short: "O",
        long: "Organization",
    },
    "2.5.4.11": {
        short: "OU",
        long: "OrganizationUnit",
    },
    "2.5.4.8": {
        short: "ST",
        long: "State",
    },
    "2.5.4.9": {
        short: "Street",
        long: "StreetAddress",
    },
    "2.5.4.4": {
        short: "SN",
        long: "SurName",
    },
    "2.5.4.12": {
        short: "T",
        long: "Title",
    },
    "1.2.840.113549.1.9.8": {
        long: "UnstructuredAddress",
    },
    "1.2.840.113549.1.9.2": {
        long: "UnstructuredName",
    },
};
function nameToString(name, splitter = ",") {
    const res = [];
    name.typesAndValues.forEach((typeValue) => {
        const type = typeValue.type;
        const oidValue = OID[type.toString()];
        const oidName = oidValue && oidValue.short ? oidValue.short : type.toString();
        res.push(`${oidName}=${typeValue.value.valueBlock.value}`);
    });
    return res.join(splitter + " ");
}

const { CertificationRequest, setEngine, CryptoEngine } = require("pkijs");
class X509CertificateRequest extends Certificate {
    constructor() {
        super(...arguments);
        this.type = "request";
    }
    get subjectName() {
        return nameToString(this.asn1.subject);
    }
    importRaw(rawData) {
        if (rawData instanceof ArrayBuffer || (typeof Buffer !== "undefined" && Buffer.isBuffer(rawData))) {
            this.raw = new Uint8Array(rawData);
        }
        else {
            this.raw = new Uint8Array(rawData.buffer);
        }
        this.raw = new Uint8Array(rawData);
        const asn1 = asn1js.fromBER(this.raw.buffer);
        this.asn1 = new CertificationRequest({ schema: asn1.result });
    }
    async exportKey(provider, algorithm, usages) {
        setEngine("unknown", provider, new CryptoEngine({ name: "unknown", crypto: provider, subtle: provider.subtle }));
        return this.asn1.getPublicKey(algorithm ? { algorithm: { algorithm, usages } } : null)
            .then((key) => {
            return key;
        });
    }
}

const pkijs = require("pkijs");
const { setEngine: setEngine$1, CryptoEngine: CryptoEngine$1 } = pkijs;
const PKICertificate = pkijs.Certificate;
class X509Certificate extends Certificate {
    constructor() {
        super(...arguments);
        this.type = "x509";
    }
    get serialNumber() {
        return pvtsutils.Convert.ToHex(new Uint8Array(this.asn1.serialNumber.valueBlock.valueHex));
    }
    get issuerName() {
        return nameToString(this.asn1.issuer);
    }
    get subjectName() {
        return nameToString(this.asn1.subject);
    }
    get notBefore() {
        return this.asn1.notBefore.value;
    }
    get notAfter() {
        return this.asn1.notAfter.value;
    }
    importRaw(rawData) {
        if (rawData instanceof ArrayBuffer || (typeof Buffer !== "undefined" && Buffer.isBuffer(rawData))) {
            this.raw = new Uint8Array(rawData);
        }
        else {
            this.raw = new Uint8Array(rawData.buffer);
        }
        this.raw = new Uint8Array(rawData);
        const asn1 = asn1js.fromBER(this.raw.buffer);
        this.asn1 = new PKICertificate({ schema: asn1.result });
    }
    async exportKey(provider, algorithm, usages) {
        setEngine$1("unknown", provider, new CryptoEngine$1({ name: "unknown", crypto: provider, subtle: provider.subtle }));
        return this.asn1.getPublicKey(algorithm ? { algorithm: { algorithm, usages } } : null)
            .then((key) => {
            return key;
        });
    }
}

class OpenSSLCertificateStorage {
    constructor(file) {
        this.file = file;
        this.crypto = _2keyRatchet.getEngine().crypto;
    }
    async exportCert(format, item) {
        switch (format) {
            case "raw": {
                return item.exportRaw();
            }
            case "pem": {
                throw new WebCryptoLocalError(WebCryptoLocalError.CODE.UNKNOWN, "PEM format is not implemented");
            }
            default:
                throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CASE_ERROR, "Unsupported format for CryptoCertificate. Must be 'raw' or 'pem'");
        }
    }
    async importCert(format, data, algorithm, keyUsages) {
        let rawData;
        let rawType = null;
        switch (format) {
            case "pem":
                if (typeof data !== "string") {
                    throw new TypeError("data: Is not type string");
                }
                if (core.PemConverter.isCertificate(data)) {
                    rawType = "x509";
                }
                else if (core.PemConverter.isCertificateRequest(data)) {
                    rawType = "request";
                }
                else {
                    throw new core.OperationError("data: Is not correct PEM data. Must be Certificate or Certificate Request");
                }
                rawData = core.PemConverter.toArrayBuffer(data);
                break;
            case "raw":
                if (!core.BufferSourceConverter.isBufferSource(data)) {
                    throw new TypeError("data: Is not type ArrayBuffer or ArrayBufferView");
                }
                rawData = core.BufferSourceConverter.toArrayBuffer(data);
                break;
            default:
                throw new TypeError("format: Is invalid value. Must be 'raw', 'pem'");
        }
        switch (rawType) {
            case "x509": {
                const x509 = await X509Certificate.importCert(crypto, rawData, algorithm, keyUsages);
                return x509;
            }
            case "request": {
                const request = await X509CertificateRequest.importCert(crypto, rawData, algorithm, keyUsages);
                return request;
            }
            default: {
                try {
                    const x509 = await X509Certificate.importCert(crypto, rawData, algorithm, keyUsages);
                    return x509;
                }
                catch (e) {
                }
                try {
                    const request = await X509CertificateRequest.importCert(crypto, rawData, algorithm, keyUsages);
                    return request;
                }
                catch (e) {
                }
                throw new core.OperationError("Cannot parse Certificate or Certificate Request from incoming ASN1");
            }
        }
    }
    async keys() {
        const items = this.readFile();
        return Object.keys(items);
    }
    async hasItem(item) {
        return !!this.indexOf(item);
    }
    async setItem(item) {
        const certs = this.readFile();
        const value = await this.certToJson(item);
        certs[item.id] = value;
        this.writeFile(certs);
        return item.id;
    }
    async indexOf(item) {
        if (item instanceof Certificate) {
            const certs = this.readFile();
            for (const index in certs) {
                const identity = await item.getID(crypto, "SHA-256");
                if (index === identity) {
                    return index;
                }
            }
            return null;
        }
        else {
            throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CASE_ERROR, `Parameter is not OpenSSL CertificateItem`);
        }
    }
    async getItem(key) {
        const certs = this.readFile();
        const value = certs[key];
        if (!value) {
            return null;
        }
        value.lastUsed = new Date().toISOString();
        this.writeFile(certs);
        return this.certFromJson(value);
    }
    async removeItem(key) {
        const certs = this.readFile();
        delete certs[key];
        this.writeFile(certs);
    }
    async clear() {
        this.writeFile({});
    }
    async certToJson(cert) {
        const date = new Date().toISOString();
        return {
            algorithm: cert.publicKey.algorithm.toAlgorithm ? cert.publicKey.algorithm.toAlgorithm() : cert.publicKey.algorithm,
            usages: cert.publicKey.usages,
            type: cert.type,
            createdAt: date,
            lastUsed: date,
            raw: pvtsutils.Convert.ToBase64(cert.exportRaw()),
        };
    }
    async certFromJson(json) {
        return this.importCert("raw", pvtsutils.Convert.FromBase64(json.raw), json.algorithm, json.usages);
    }
    readFile() {
        if (!fs.existsSync(this.file)) {
            return {};
        }
        const buf = fs.readFileSync(this.file);
        return JSON.parse(buf.toString());
    }
    writeFile(json) {
        const buf = new Buffer(JSON.stringify(json));
        fs.writeFileSync(this.file, buf, {
            encoding: "utf8",
            flag: "w+",
        });
    }
}

class OpenSSLKeyStorage {
    constructor(file) {
        this.file = file;
        this.crypto = _2keyRatchet.getEngine().crypto;
    }
    async keys() {
        const keys = this.readFile();
        return Object.keys(keys);
    }
    async indexOf(item) {
        const keys = this.readFile();
        const id = await this.getID(item);
        if (id in keys) {
            return id;
        }
        return null;
    }
    async hasItem(item) {
        const index = this.indexOf(item);
        return !!index;
    }
    async setItem(value) {
        const keys = this.readFile();
        const id = await this.getID(value);
        keys[id] = await this.keyToJson(value);
        this.writeFile(keys);
        return id;
    }
    async getItem(key) {
        const keys = this.readFile();
        const keyJson = keys[key];
        if (!keyJson) {
            return null;
        }
        const res = this.keyFromJson(keyJson);
        this.writeFile(keys);
        return res;
    }
    async removeItem(key) {
        const keys = this.readFile();
        delete keys[key];
        this.writeFile(keys);
    }
    async clear() {
        this.writeFile({});
    }
    readFile() {
        if (!fs.existsSync(this.file)) {
            return {};
        }
        const buf = fs.readFileSync(this.file);
        return JSON.parse(buf.toString());
    }
    writeFile(obj) {
        const buf = new Buffer(JSON.stringify(obj));
        fs.writeFileSync(this.file, buf, {
            encoding: "utf8",
            flag: "w+",
        });
    }
    async getID(key) {
        const nativeKey = key.native;
        let id;
        switch (key.type) {
            case "secret": {
                id = await this.crypto.getRandomValues(new Uint8Array(20));
                break;
            }
            case "private":
            case "public":
                const fn = nativeKey.exportSpki;
                id = await new Promise((resolve, reject) => {
                    fn.call(nativeKey, (err, data) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(data);
                        }
                    });
                });
                break;
            default:
                throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CASE_ERROR, `Unsupported type of CryptoKey '${key.type}'`);
        }
        const hash = await this.crypto.subtle.digest("SHA-1", id);
        const rnd = this.crypto.getRandomValues(new Uint8Array(4));
        return `${key.type}-${pvtsutils.Convert.ToHex(rnd)}-${pvtsutils.Convert.ToHex(hash)}`;
    }
    keyToJson(key) {
        return Promise.resolve()
            .then(() => {
            const nativeKey = key.native;
            let fn;
            switch (key.type) {
                case "secret":
                    fn = nativeKey.export;
                    break;
                case "public":
                    fn = nativeKey.exportSpki;
                    break;
                case "private":
                    fn = nativeKey.exportPkcs8;
                    break;
                default:
                    throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CASE_ERROR, `Unsupported type of CryptoKey '${key.type}'`);
            }
            return new Promise((resolve, reject) => {
                fn.call(nativeKey, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data);
                    }
                });
            });
        })
            .then((raw) => {
            const json = {
                algorithm: key.algorithm,
                extractable: key.extractable,
                type: key.type,
                usages: key.usages || [],
                raw: raw.toString("base64"),
                createdAt: new Date().toISOString(),
                lastUsed: new Date().toISOString(),
            };
            return json;
        });
    }
    async keyFromJson(obj) {
        let format;
        switch (obj.type) {
            case "secret":
                format = "raw";
                break;
            case "public":
                format = "spki";
                break;
            case "private":
                format = "pkcs8";
                break;
            default:
                throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CASE_ERROR, `Unsupported type of CryptoKey '${obj.type}'`);
        }
        obj.lastUsed = new Date().toISOString();
        return this.crypto.subtle.importKey(format, new Buffer(obj.raw, "base64"), obj.algorithm, obj.extractable, obj.usages);
    }
}

class OpenSSLCrypto {
    constructor() {
        this.info = {
            id: "61e5e90712ba8abfb6bde6b4504b54bf88d36d0c",
            slot: 0,
            name: "OpenSSL",
            reader: "OpenSSL",
            serialNumber: "61e5e90712ba8abfb6bde6b4504b54bf88d36d0c",
            isRemovable: false,
            isHardware: false,
            algorithms: [
                "SHA-1",
                "SHA-256",
                "SHA-384",
                "SHA-512",
                "RSASSA-PKCS1-v1_5",
                "RSA-PSS",
                "HMAC",
                "AES-CBC",
                "AES-GCM",
                "PBKDF2",
                "ECDH",
                "ECDSA",
            ],
        };
        this.crypto = _2keyRatchet.getEngine().crypto;
        this.subtle = _2keyRatchet.getEngine().crypto.subtle;
        this.keyStorage = new OpenSSLKeyStorage(`${OPENSSL_KEY_STORAGE_DIR}/store.json`);
        this.certStorage = new OpenSSLCertificateStorage(`${OPENSSL_CERT_STORAGE_DIR}/store.json`);
        this.isLoggedIn = true;
    }
    getRandomValues(array) {
        return this.crypto.getRandomValues(array);
    }
}

function isOsslObject(obj) {
    return !!(obj && obj.__ossl);
}
function fixObject(crypto, key, options) {
    const osslKey = key;
    let handle;
    if (options && options.handle) {
        handle = options.handle;
    }
    else {
        handle = new Buffer(4);
        handle.writeInt32LE(crypto.getID(), 0);
    }
    osslKey.__ossl = true;
    osslKey.p11Object = {
        handle,
        session: crypto.session,
    };
    if (options && options.index) {
        osslKey.__index = options.index;
    }
}

class Pkcs11CertificateStorage extends nodeWebcryptoP11.CertificateStorage {
    constructor(crypto) {
        super(crypto);
    }
    async getItem(index, algorithm, keyUsages) {
        let cert;
        try {
            cert = await super.getItem(index, algorithm, keyUsages);
        }
        catch (err) {
            try {
                const object = this.getItemById(index).toType();
                cert = await this.crypto.ossl.certStorage.importCert("raw", object.value, algorithm, keyUsages);
                fixObject(this.crypto, cert, {
                    index,
                    handle: object.handle,
                });
                fixObject(this.crypto, cert.publicKey);
            }
            catch (err2) {
                throw err;
            }
        }
        if (isOsslObject(cert)) {
            cert.__index = index;
        }
        return cert;
    }
    async importCert(format, data, algorithm, keyUsages) {
        let cert;
        try {
            cert = await super.importCert(format, data, algorithm, keyUsages);
        }
        catch (err) {
            try {
                cert = await this.crypto.ossl.certStorage.importCert(format, data, algorithm, keyUsages);
                fixObject(this.crypto, cert);
                fixObject(this.crypto, cert.publicKey);
            }
            catch (e) {
                throw err;
            }
        }
        return cert;
    }
    async exportCert(format, item) {
        if (!isOsslObject(item)) {
            return super.exportCert(format, item);
        }
        else {
            return this.crypto.ossl.certStorage.exportCert(format, item);
        }
    }
    async indexOf(item) {
        if (isOsslObject(item)) {
            return item.__index;
        }
        else {
            return super.indexOf(item);
        }
    }
}

class Pkcs11SubtleCrypto extends nodeWebcryptoP11.SubtleCrypto {
    constructor(crypto) {
        super(crypto);
    }
    async importKey(format, keyData, algorithm, extractable, keyUsages) {
        let key;
        try {
            key = await super.importKey(format, keyData, algorithm, extractable, keyUsages);
        }
        catch (err) {
            key = await this.crypto.ossl.subtle.importKey(format, keyData, algorithm, extractable, keyUsages);
            fixObject(this.crypto, key);
        }
        return key;
    }
    async verify(algorithm, key, signature, data) {
        if (!isOsslObject(key)) {
            return super.verify(algorithm, key, signature, data);
        }
        else {
            return this.crypto.ossl.subtle.verify(algorithm, key, signature, data);
        }
    }
}

class Pkcs11Crypto extends nodeWebcryptoP11.Crypto {
    constructor(props) {
        super(props);
        this.osslID = 0;
        this.module = this.slot.module;
        this.ossl = new OpenSSLCrypto();
        this.subtle = new Pkcs11SubtleCrypto(this);
        this.certStorage = new Pkcs11CertificateStorage(this);
    }
    getID() {
        return ++this.osslID;
    }
    getRandomValues(array) {
        return super.getRandomValues(array);
    }
}

graphene.registerAttribute("pinFriendlyName", 0x80000000 | 0x00000102, "string");
graphene.registerAttribute("pinDescription", 0x80000000 | 0x00000103, "string");
class PvKeyStorage extends nodeWebcryptoP11.KeyStorage {
    constructor(crypto) {
        super(crypto);
    }
    async setItem(key, options) {
        if (!(key instanceof nodeWebcryptoP11.CryptoKey)) {
            throw new TypeError("Parameter 1 is not PKCS#11 CryptoKey");
        }
        const _key = key;
        if (!(this.hasItem(_key) && _key.key.token)) {
            const template = {
                token: true,
            };
            const platform = os.platform();
            if (_key.type === "private" && options &&
                (platform === "win32" || platform === "darwin")) {
                if (options.pinFriendlyName) {
                    template.pinFriendlyName = options.pinFriendlyName;
                }
                if (options.pinDescription) {
                    template.pinDescription = options.pinDescription;
                }
            }
            const obj = this.crypto.session.copy(_key.key, template);
            return nodeWebcryptoP11.CryptoKey.getID(obj.toType());
        }
        else {
            return _key.id;
        }
    }
}

class PvCrypto extends nodeWebcryptoP11.Crypto {
    constructor(props) {
        super(props);
        this.module = this.slot.module;
        this.keyStorage = new PvKeyStorage(this);
    }
}

class LocalProvider extends events.EventEmitter {
    constructor(config) {
        super();
        this.config = config;
        this.cards = new CardWatcher();
        this.crypto = new CryptoMap()
            .on("add", this.onCryptoAdd.bind(this))
            .on("remove", this.onCryptoRemove.bind(this));
    }
    on(event, listener) {
        return super.on(event, listener);
    }
    once(event, listener) {
        return super.once(event, listener);
    }
    emit(event, ...args) {
        return super.emit(event, ...args);
    }
    async open() {
        const EVENT_LOG = "Provider:Open";
        this.info = new ProviderInfoProto();
        this.info.name = "WebcryptoLocal";
        this.info.providers = [];
        {
            if (fs.existsSync(PV_PKCS11_LIB)) {
                try {
                    const crypto = new PvCrypto({
                        library: PV_PKCS11_LIB,
                        slot: 0,
                        readWrite: true,
                    });
                    crypto.isLoggedIn = true;
                    this.addProvider(crypto);
                }
                catch (e) {
                    this.emit("error", new WebCryptoLocalError(WebCryptoLocalError.CODE.PROVIDER_INIT, `${EVENT_LOG} Cannot load library by path ${PV_PKCS11_LIB}. ${e.message}`));
                }
            }
            else {
                this.emit("error", new WebCryptoLocalError(WebCryptoLocalError.CODE.PROVIDER_INIT, `${EVENT_LOG} Cannot find pvpkcs11 by path ${PV_PKCS11_LIB}`));
            }
        }
        this.config.providers = this.config.providers || [];
        for (const prov of this.config.providers) {
            prov.slots = prov.slots || [0];
            for (const slot of prov.slots) {
                if (fs.existsSync(prov.lib)) {
                    try {
                        const crypto = new Pkcs11Crypto({
                            library: prov.lib,
                            libraryParameters: prov.libraryParameters,
                            slot,
                            readWrite: true,
                        });
                        this.addProvider(crypto, {
                            name: prov.name,
                        });
                    }
                    catch (err) {
                        this.emit("error", new WebCryptoLocalError(WebCryptoLocalError.CODE.PROVIDER_INIT, `${EVENT_LOG} Cannot load PKCS#11 library by path ${prov.lib}. ${err.message}`));
                    }
                }
                else {
                    this.emit("error", new WebCryptoLocalError(WebCryptoLocalError.CODE.PROVIDER_INIT, `${EVENT_LOG} Cannot find PKCS#11 library by path ${prov.lib}`));
                }
            }
        }
        this.cards
            .on("error", (err) => {
            this.emit("error", err);
            return this.emit("token", {
                added: [],
                removed: [],
                error: err,
            });
        })
            .on("info", (message) => {
            this.emit("info", message);
        })
            .on("new", (card) => {
            return this.emit("token_new", card);
        })
            .on("insert", this.onTokenInsert.bind(this))
            .on("remove", this.onTokenRemove.bind(this))
            .start(this.config.cards);
        this.emit("listening", await this.getInfo());
    }
    addProvider(crypto, params) {
        const info = getSlotInfo(crypto);
        this.emit("info", `Provider: Add crypto '${info.name}' ${info.id}`);
        if (params) {
            if (params.name) {
                info.name = params.name;
            }
        }
        this.info.providers.push(new ProviderCryptoProto(info));
        this.crypto.add(info.id, crypto);
    }
    hasProvider(slot) {
        return this.crypto.some((crypto) => {
            const cryptoModule = crypto.module;
            const cryptoSlot = crypto.slot;
            if (cryptoModule.libFile === slot.module.libFile &&
                cryptoSlot.handle.equals(slot.handle)) {
                return true;
            }
            return false;
        });
    }
    stop() {
        throw new WebCryptoLocalError(WebCryptoLocalError.CODE.METHOD_NOT_IMPLEMENTED);
    }
    async getInfo() {
        const resProto = new ProviderInfoProto();
        return resProto;
    }
    async getCrypto(cryptoID) {
        const crypto = this.crypto.item(cryptoID);
        if (!crypto) {
            throw new WebCryptoLocalError(WebCryptoLocalError.CODE.PROVIDER_CRYPTO_NOT_FOUND, `Cannot get crypto by given ID '${cryptoID}'`);
        }
        return crypto;
    }
    onTokenInsert(card) {
        const EVENT_LOG = "Provider:Token:Insert";
        this.emit("info", `${EVENT_LOG} reader:'${card.reader}' name:'${card.name}' atr:${card.atr.toString("hex")}`);
        let lastError = null;
        for (const library of card.libraries) {
            try {
                lastError = null;
                if (!fs.existsSync(library)) {
                    lastError = new WebCryptoLocalError(WebCryptoLocalError.CODE.PROVIDER_CRYPTO_NOT_FOUND, library);
                    continue;
                }
                let mod;
                try {
                    mod = graphene.Module.load(library, card.name);
                }
                catch (err) {
                    this.emit("error", err);
                    lastError = new WebCryptoLocalError(WebCryptoLocalError.CODE.PROVIDER_CRYPTO_WRONG, library);
                }
                try {
                    mod.initialize();
                }
                catch (err) {
                    if (!/CRYPTOKI_ALREADY_INITIALIZED/.test(err.message)) {
                        this.emit("error", err);
                        lastError = new WebCryptoLocalError(WebCryptoLocalError.CODE.PROVIDER_CRYPTO_WRONG, library);
                        continue;
                    }
                }
                const slots = mod.getSlots(true);
                if (!slots.length) {
                    this.emit("error", `${EVENT_LOG} No slots found. It's possible token ${card.atr.toString("hex")} uses wrong PKCS#11 lib ${card.libraries}`);
                    lastError = new WebCryptoLocalError(WebCryptoLocalError.CODE.PROVIDER_CRYPTO_WRONG, library);
                    continue;
                }
                const slotIndexes = [];
                this.emit("info", `${EVENT_LOG} Looking for ${card.reader} into ${slots.length} slot(s)`);
                for (let i = 0; i < slots.length; i++) {
                    const slot = slots.items(i);
                    if (!slot || this.hasProvider(slot)) {
                        continue;
                    }
                    if (os.platform() === "win32" &&
                        /pvpkcs11\.dll$/.test(slot.lib.libPath) &&
                        slot.slotDescription !== card.reader) {
                        continue;
                    }
                    slotIndexes.push(i);
                }
                if (!slotIndexes.length) {
                    continue;
                }
                const addInfos = [];
                slotIndexes.forEach((slotIndex) => {
                    try {
                        const crypto = new Pkcs11Crypto({
                            library,
                            name: card.name,
                            slot: slotIndex,
                            readWrite: !card.readOnly,
                        });
                        const info = getSlotInfo(crypto);
                        info.atr = pvtsutils.Convert.ToHex(card.atr);
                        info.library = library;
                        info.id = digest(DEFAULT_HASH_ALG, card.reader + card.atr + crypto.slot.handle.toString()).toString("hex");
                        addInfos.push(info);
                        this.addProvider(crypto);
                    }
                    catch (err) {
                        this.emit("error", err);
                    }
                });
                this.emit("token", {
                    added: addInfos,
                    removed: [],
                });
                break;
            }
            catch (err) {
                lastError = err;
                continue;
            }
        }
        if (lastError) {
            this.emit("token", {
                added: [],
                removed: [],
                error: lastError,
            });
        }
    }
    onTokenRemove(card) {
        try {
            const EVENT_LOG = "Provider:Token:Remove";
            this.emit("info", `${EVENT_LOG} reader:'${card.reader}' name:'${card.name}' atr:${card.atr.toString("hex")}`);
            const info = {
                added: [],
                removed: [],
            };
            const cryptoIDs = [];
            card.libraries.forEach((library) => {
                try {
                    const mod = graphene.Module.load(library, card.name);
                    try {
                        mod.initialize();
                    }
                    catch (err) {
                        if (!/CRYPTOKI_ALREADY_INITIALIZED/.test(err.message)) {
                            throw err;
                        }
                    }
                    const slots = mod.getSlots(true);
                    this.crypto.forEach((crypto, key) => {
                        const cryptoModule = crypto.module;
                        const cryptoSlot = crypto.slot;
                        if (cryptoModule.libFile === mod.libFile) {
                            if (slots.indexOf(cryptoSlot) === -1) {
                                cryptoIDs.push(key);
                            }
                        }
                    });
                }
                catch (err) {
                    this.emit("error", new WebCryptoLocalError(WebCryptoLocalError.CODE.TOKEN_REMOVE_TOKEN_READING, `${EVENT_LOG} PKCS#11 lib ${library}. ${err.message}`));
                }
            });
            if (!cryptoIDs.length) {
                this.emit("error", new WebCryptoLocalError(WebCryptoLocalError.CODE.TOKEN_REMOVE_NO_SLOTS_FOUND));
            }
            cryptoIDs.forEach((provId) => {
                this.crypto.remove(provId);
                this.info.providers = this.info.providers.filter((provider) => {
                    if (provider.id === provId) {
                        this.emit("info", `${EVENT_LOG} Crypto removed '${provider.name}' ${provider.id}`);
                        info.removed.push(provider);
                        return false;
                    }
                    return true;
                });
            });
            if (info.removed.length) {
                this.emit("token", info);
            }
        }
        catch (error) {
            this.emit("token", {
                added: [],
                removed: [],
                error,
            });
        }
    }
    onCryptoAdd(e) {
        this.emit("info", `Provider:AddCrypto PKCS#11 '${e.item.module.libFile}' '${e.item.module.libName}'`);
    }
    onCryptoRemove(e) {
        const LOG = "Provider:RemoveCrypto";
        const cryptoModule = e.item.module;
        this.emit("info", `${LOG} PKCS#11 '${cryptoModule.libFile}' '${cryptoModule.libName}'`);
        if (!this.crypto.some((crypto) => crypto.module && crypto.module.libFile === cryptoModule.libFile)) {
            this.emit("info", `${LOG} PKCS#11 finalize '${cryptoModule.libFile}'`);
            try {
                cryptoModule.finalize();
            }
            catch (err) {
                this.emit("error", err);
            }
        }
    }
}
function getSlotInfo(p11Crypto) {
    const session = p11Crypto.session;
    const info = p11Crypto.info;
    info.readOnly = !(session.flags & graphene.SessionFlag.RW_SESSION);
    return info;
}

const pkijs$1 = require("pkijs");
graphene.registerAttribute("x509Chain", 2147483905, "buffer");
class CertificateStorageService extends Service {
    constructor(server, crypto) {
        super(server, crypto, [
            CertificateStorageKeysActionProto,
            CertificateStorageIndexOfActionProto,
            CertificateStorageGetItemActionProto,
            CertificateStorageSetItemActionProto,
            CertificateStorageRemoveItemActionProto,
            CertificateStorageClearActionProto,
            CertificateStorageImportActionProto,
            CertificateStorageExportActionProto,
            CertificateStorageGetChainActionProto,
            CertificateStorageGetCRLActionProto, ,
            CertificateStorageGetOCSPActionProto,
        ]);
    }
    async getCrypto(id) {
        return await this.object.getCrypto(id);
    }
    getMemoryStorage() {
        return this.object.object.memoryStorage;
    }
    async onMessage(session, action) {
        const result = new ResultProto(action);
        switch (action.action) {
            case CertificateStorageGetItemActionProto.ACTION: {
                const params = await CertificateStorageGetItemActionProto.importProto(action);
                const crypto = await this.getCrypto(params.providerID);
                const item = await crypto.certStorage.getItem(params.key, params.algorithm.isEmpty() ? null : params.algorithm.toAlgorithm(), !params.keyUsages ? null : params.keyUsages);
                if (item) {
                    const cryptoKey = new ServiceCryptoItem(item.publicKey, params.providerID);
                    this.getMemoryStorage().add(cryptoKey);
                    const cryptoCert = new ServiceCryptoItem(item, params.providerID);
                    this.getMemoryStorage().add(cryptoCert);
                    const certProto = await cryptoCert.toProto();
                    certProto.publicKey = cryptoKey.toProto();
                    result.data = await certProto.exportProto();
                }
                break;
            }
            case CertificateStorageSetItemActionProto.ACTION: {
                const params = await CertificateStorageSetItemActionProto.importProto(action);
                const crypto = await this.getCrypto(params.providerID);
                const cert = this.getMemoryStorage().item(params.item.id).item;
                const index = await crypto.certStorage.setItem(cert);
                result.data = pvtsutils.Convert.FromUtf8String(index);
                break;
            }
            case CertificateStorageRemoveItemActionProto.ACTION: {
                const params = await CertificateStorageRemoveItemActionProto.importProto(action);
                const crypto = await this.getCrypto(params.providerID);
                await crypto.certStorage.removeItem(params.key);
                break;
            }
            case CertificateStorageImportActionProto.ACTION: {
                const params = await CertificateStorageImportActionProto.importProto(action);
                const crypto = await this.getCrypto(params.providerID);
                const item = await crypto.certStorage.importCert(params.format, params.data, params.algorithm.toAlgorithm(), params.keyUsages);
                const cryptoKey = new ServiceCryptoItem(item.publicKey, params.providerID);
                this.getMemoryStorage().add(cryptoKey);
                const cryptoCert = new ServiceCryptoItem(item, params.providerID);
                this.getMemoryStorage().add(cryptoCert);
                const certProto = await cryptoCert.toProto();
                certProto.publicKey = cryptoKey.toProto();
                result.data = await certProto.exportProto();
                break;
            }
            case CertificateStorageExportActionProto.ACTION: {
                const params = await CertificateStorageExportActionProto.importProto(action);
                const crypto = await this.getCrypto(params.providerID);
                const cert = this.getMemoryStorage().item(params.item.id).item;
                const exportedData = await crypto.certStorage.exportCert(params.format, cert);
                if (exportedData instanceof ArrayBuffer) {
                    result.data = exportedData;
                }
                else {
                    result.data = pvtsutils.Convert.FromUtf8String(exportedData);
                }
                break;
            }
            case CertificateStorageKeysActionProto.ACTION: {
                const params = await CertificateStorageKeysActionProto.importProto(action);
                const crypto = await this.getCrypto(params.providerID);
                const keys = await crypto.certStorage.keys();
                result.data = (await ArrayStringConverter.set(keys)).buffer;
                break;
            }
            case CertificateStorageClearActionProto.ACTION: {
                const params = await CertificateStorageKeysActionProto.importProto(action);
                const crypto = await this.getCrypto(params.providerID);
                await crypto.certStorage.clear();
                break;
            }
            case CertificateStorageIndexOfActionProto.ACTION: {
                const params = await CertificateStorageIndexOfActionProto.importProto(action);
                const crypto = await this.getCrypto(params.providerID);
                const cert = this.getMemoryStorage().item(params.item.id);
                const index = await crypto.certStorage.indexOf(cert.item);
                if (index) {
                    result.data = pvtsutils.Convert.FromUtf8String(index);
                }
                break;
            }
            case CertificateStorageGetChainActionProto.ACTION: {
                const params = await CertificateStorageGetChainActionProto.importProto(action);
                const crypto = await this.getCrypto(params.providerID);
                const cert = this.getMemoryStorage().item(params.item.id).item;
                if (cert.type !== "x509") {
                    throw new WebCryptoLocalError(WebCryptoLocalError.CODE.ACTION_COMMON, "Wrong item type, must be 'x509'");
                }
                const resultProto = new CertificateStorageGetChainResultProto();
                const pkiEntryCert = await certC2P(crypto, cert);
                if (pkiEntryCert.subject.isEqual(pkiEntryCert.issuer)) {
                    const itemProto = new ChainItemProto();
                    itemProto.type = "x509";
                    itemProto.value = pkiEntryCert.toSchema(true).toBER(false);
                    resultProto.items.push(itemProto);
                }
                else if ("session" in crypto) {
                    let buffer;
                    let isX509ChainSupported = true;
                    try {
                        buffer = cert.p11Object.getAttribute("x509Chain");
                    }
                    catch (e) {
                        isX509ChainSupported = false;
                    }
                    if (isX509ChainSupported) {
                        this.emit("info", "Service:CertificateStorage:GetChain: CKA_X509_CHAIN is supported");
                        const ulongSize = cert.p11Object.handle.length;
                        let i = 0;
                        while (i < buffer.length) {
                            const itemType = buffer.slice(i, i + 1)[0];
                            const itemProto = new ChainItemProto();
                            switch (itemType) {
                                case 1:
                                    itemProto.type = "x509";
                                    break;
                                case 2:
                                    itemProto.type = "crl";
                                    break;
                                default:
                                    throw new WebCryptoLocalError(WebCryptoLocalError.CODE.ACTION_COMMON, "Unknown type of item of chain");
                            }
                            i++;
                            const itemSizeBuffer = buffer.slice(i, i + ulongSize);
                            const itemSize = itemSizeBuffer.readInt32LE(0);
                            const itemValue = buffer.slice(i + ulongSize, i + ulongSize + itemSize);
                            itemProto.value = new Uint8Array(itemValue).buffer;
                            resultProto.items.push(itemProto);
                            i += ulongSize + itemSize;
                        }
                    }
                    else {
                        this.emit("info", "Service:CertificateStorage:GetChain: CKA_X509_CHAIN is not supported");
                        const indexes = await crypto.certStorage.keys();
                        const trustedCerts = [];
                        const certs = [];
                        for (const index of indexes) {
                            const parts = index.split("-");
                            if (parts[0] !== "x509") {
                                continue;
                            }
                            const cryptoCert = await crypto.certStorage.getItem(index);
                            const pkiCert = await certC2P(crypto, cryptoCert);
                            if (pvutils.isEqualBuffer(pkiEntryCert.tbs, pkiCert.tbs)) {
                                continue;
                            }
                            if (pkiCert.subject.isEqual(pkiCert.issuer)) {
                                trustedCerts.push(pkiCert);
                            }
                            else {
                                certs.push(pkiCert);
                            }
                        }
                        if (pkiEntryCert.subject.isEqual(pkiEntryCert.issuer)) {
                            trustedCerts.push(pkiEntryCert);
                        }
                        certs.push(pkiEntryCert);
                        pkijs$1.setEngine("PKCS#11 provider", crypto, new pkijs$1.CryptoEngine({ name: "", crypto, subtle: crypto.subtle }));
                        const chainBuilder = new pkijs$1.CertificateChainValidationEngine({
                            trustedCerts,
                            certs,
                        });
                        const chain = await chainBuilder.verify();
                        let resultChain = [];
                        if (chain.result) {
                            resultChain = chainBuilder.certs;
                        }
                        else {
                            resultChain = [pkiEntryCert];
                        }
                        for (const item of resultChain) {
                            const itemProto = new ChainItemProto();
                            itemProto.type = "x509";
                            itemProto.value = item.toSchema(true).toBER(false);
                            resultProto.items.push(itemProto);
                        }
                    }
                }
                else {
                    throw new WebCryptoLocalError(WebCryptoLocalError.CODE.ACTION_NOT_SUPPORTED, "Provider doesn't support GetChain method");
                }
                if (resultProto.items) {
                    const items = resultProto.items
                        .map((item) => item.type);
                    this.emit("info", `Service:CertificateStorage:GetChain: ${items.join(",")} items:${items.length}`);
                }
                result.data = await resultProto.exportProto();
                break;
            }
            case CertificateStorageGetCRLActionProto.ACTION: {
                const params = await CertificateStorageGetCRLActionProto.importProto(action);
                const crlArray = await new Promise((resolve, reject) => {
                    request(params.url, { encoding: null }, (err, response, body) => {
                        try {
                            const message = `Cannot get CRL by URI '${params.url}'`;
                            if (err) {
                                throw new Error(`${message}. ${err.message}`);
                            }
                            if (response.statusCode !== 200) {
                                throw new Error(`${message}. Bad status ${response.statusCode}`);
                            }
                            if (Buffer.isBuffer(body)) {
                                body = body.toString("binary");
                            }
                            body = prepareData(body);
                            body = new Uint8Array(body).buffer;
                            try {
                                const asn1 = asn1js.fromBER(body);
                                if (asn1.result.error) {
                                    throw new Error(`ASN1: ${asn1.result.error}`);
                                }
                                const crl = new pkijs$1.CertificateRevocationList({
                                    schema: asn1.result,
                                });
                                if (!crl) {
                                    throw new Error(`variable crl is empty`);
                                }
                            }
                            catch (e) {
                                console.error(e);
                                throw new Error(`Cannot parse received CRL from URI '${params.url}'`);
                            }
                            resolve(body);
                        }
                        catch (e) {
                            reject(e);
                        }
                    });
                });
                result.data = crlArray;
                break;
            }
            case pkijs$1.CertificateStorageGetOCSPActionProto.ACTION: {
                const params = await pkijs$1.CertificateStorageGetOCSPActionProto.importProto(action);
                const ocspArray = await new Promise((resolve, reject) => {
                    let url = params.url;
                    const options = { encoding: null };
                    if (params.options.method === "get") {
                        const b64 = new Buffer(params.url).toString("hex");
                        url += "/" + b64;
                        options.method = "get";
                    }
                    else {
                        options.method = "post";
                        options.headers = { "Content-Type": "application/ocsp-request" };
                        options.body = new Buffer(params.request);
                    }
                    request(url, options, (err, response, body) => {
                        try {
                            const message = `Cannot get OCSP by URI '${params.url}'`;
                            if (err) {
                                throw new Error(`${message}. ${err.message}`);
                            }
                            if (response.statusCode !== 200) {
                                throw new Error(`${message}. Bad status ${response.statusCode}`);
                            }
                            if (Buffer.isBuffer(body)) {
                                body = body.toString("binary");
                            }
                            body = prepareData(body);
                            body = new Uint8Array(body).buffer;
                            try {
                                const asn1 = asn1js.fromBER(body);
                                if (asn1.result.error) {
                                    throw new Error(`ASN1: ${asn1.result.error}`);
                                }
                                const ocsp = new pkijs$1.OCSPResponse({
                                    schema: asn1.result,
                                });
                                if (!ocsp) {
                                    throw new Error(`variable ocsp is empty`);
                                }
                            }
                            catch (e) {
                                console.error(e);
                                throw new Error(`Cannot parse received OCSP from URI '${params.url}'`);
                            }
                            resolve(body);
                        }
                        catch (e) {
                            reject(e);
                        }
                    });
                });
                result.data = ocspArray;
                break;
            }
            default:
                throw new WebCryptoLocalError(WebCryptoLocalError.CODE.ACTION_NOT_IMPLEMENTED, `Action '${action.action}' is not implemented`);
        }
        return result;
    }
}
function prepareData(data) {
    if (data.indexOf("-----") === 0) {
        data = data.replace(/-----[\w\s]+-----/gi, "").replace(/[\n\r]/g, "");
        return new Buffer(data, "base64");
    }
    else {
        return new Buffer(data, "binary");
    }
}
async function certC2P(provider, cert) {
    const certDer = await provider.certStorage.exportCert("raw", cert);
    const asn1 = asn1js.fromBER(certDer);
    const pkiCert = new pkijs$1.Certificate({ schema: asn1.result });
    return pkiCert;
}

var KeyStorageSetItemActionProto_1, KeyStorageGetItemActionProto_1, KeyStorageRemoveItemActionProto_1, KeyStorageIndexOfActionProto_1;
let KeyStorageSetItemActionProto = KeyStorageSetItemActionProto_1 = class KeyStorageSetItemActionProto extends CryptoActionProto {
};
KeyStorageSetItemActionProto.INDEX = CryptoActionProto.INDEX;
KeyStorageSetItemActionProto.ACTION = "crypto/keyStorage/setItem";
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: KeyStorageSetItemActionProto_1.INDEX++, required: true, parser: CryptoKeyProto })
], KeyStorageSetItemActionProto.prototype, "item", void 0);
KeyStorageSetItemActionProto = KeyStorageSetItemActionProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], KeyStorageSetItemActionProto);
let KeyStorageGetItemActionProto = KeyStorageGetItemActionProto_1 = class KeyStorageGetItemActionProto extends CryptoActionProto {
};
KeyStorageGetItemActionProto.INDEX = CryptoActionProto.INDEX;
KeyStorageGetItemActionProto.ACTION = "crypto/keyStorage/getItem";
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: KeyStorageGetItemActionProto_1.INDEX++, required: true, type: "string" })
], KeyStorageGetItemActionProto.prototype, "key", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: KeyStorageGetItemActionProto_1.INDEX++, parser: AlgorithmProto })
], KeyStorageGetItemActionProto.prototype, "algorithm", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: KeyStorageGetItemActionProto_1.INDEX++, type: "bool" })
], KeyStorageGetItemActionProto.prototype, "extractable", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: KeyStorageGetItemActionProto_1.INDEX++, repeated: true, type: "string" })
], KeyStorageGetItemActionProto.prototype, "keyUsages", void 0);
KeyStorageGetItemActionProto = KeyStorageGetItemActionProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], KeyStorageGetItemActionProto);
let KeyStorageKeysActionProto = class KeyStorageKeysActionProto extends CryptoActionProto {
};
KeyStorageKeysActionProto.INDEX = CryptoActionProto.INDEX;
KeyStorageKeysActionProto.ACTION = "crypto/keyStorage/keys";
KeyStorageKeysActionProto = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], KeyStorageKeysActionProto);
let KeyStorageRemoveItemActionProto = KeyStorageRemoveItemActionProto_1 = class KeyStorageRemoveItemActionProto extends CryptoActionProto {
};
KeyStorageRemoveItemActionProto.INDEX = CryptoActionProto.INDEX;
KeyStorageRemoveItemActionProto.ACTION = "crypto/keyStorage/removeItem";
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: KeyStorageRemoveItemActionProto_1.INDEX++, required: true, type: "string" })
], KeyStorageRemoveItemActionProto.prototype, "key", void 0);
KeyStorageRemoveItemActionProto = KeyStorageRemoveItemActionProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], KeyStorageRemoveItemActionProto);
let KeyStorageClearActionProto = class KeyStorageClearActionProto extends CryptoActionProto {
};
KeyStorageClearActionProto.INDEX = CryptoActionProto.INDEX;
KeyStorageClearActionProto.ACTION = "crypto/keyStorage/clear";
KeyStorageClearActionProto = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], KeyStorageClearActionProto);
let KeyStorageIndexOfActionProto = KeyStorageIndexOfActionProto_1 = class KeyStorageIndexOfActionProto extends CryptoActionProto {
};
KeyStorageIndexOfActionProto.INDEX = CryptoActionProto.INDEX;
KeyStorageIndexOfActionProto.ACTION = "crypto/keyStorage/indexOf";
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: KeyStorageIndexOfActionProto_1.INDEX++, required: true, parser: CryptoKeyProto })
], KeyStorageIndexOfActionProto.prototype, "item", void 0);
KeyStorageIndexOfActionProto = KeyStorageIndexOfActionProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], KeyStorageIndexOfActionProto);

class KeyStorageService extends Service {
    constructor(server, crypto) {
        super(server, crypto, [
            KeyStorageKeysActionProto,
            KeyStorageIndexOfActionProto,
            KeyStorageGetItemActionProto,
            KeyStorageSetItemActionProto,
            KeyStorageRemoveItemActionProto,
            KeyStorageClearActionProto,
        ]);
    }
    async getCrypto(id) {
        return await this.object.getCrypto(id);
    }
    getMemoryStorage() {
        return this.object.object.memoryStorage;
    }
    async onMessage(session, action) {
        const result = new ResultProto(action);
        switch (action.action) {
            case KeyStorageGetItemActionProto.ACTION: {
                const params = await KeyStorageGetItemActionProto.importProto(action);
                const crypto = await this.getCrypto(params.providerID);
                const key = await crypto.keyStorage.getItem(params.key, params.algorithm.isEmpty() ? undefined : params.algorithm.toAlgorithm(), params.extractable || undefined, !params.keyUsages ? undefined : params.keyUsages);
                if (key) {
                    const cryptoKey = new ServiceCryptoItem(key, params.providerID);
                    this.getMemoryStorage().add(cryptoKey);
                    result.data = await cryptoKey.toProto().exportProto();
                }
                break;
            }
            case KeyStorageSetItemActionProto.ACTION: {
                const params = await KeyStorageSetItemActionProto.importProto(action);
                const key = this.getMemoryStorage().item(params.item.id).item;
                const crypto = await this.getCrypto(params.providerID);
                if (key.algorithm.toAlgorithm) {
                    key.algorithm = key.algorithm.toAlgorithm();
                }
                let index;
                if (crypto instanceof PvCrypto) {
                    index = await crypto.keyStorage.setItem(key, {
                        pinFriendlyName: session.headers.origin,
                        pinDescription: key.usages.join(", "),
                    });
                }
                else {
                    index = await crypto.keyStorage.setItem(key);
                }
                result.data = pvtsutils.Convert.FromUtf8String(index);
                break;
            }
            case KeyStorageRemoveItemActionProto.ACTION: {
                const params = await KeyStorageRemoveItemActionProto.importProto(action);
                const crypto = await this.getCrypto(params.providerID);
                await crypto.keyStorage.removeItem(params.key);
                break;
            }
            case KeyStorageKeysActionProto.ACTION: {
                const params = await KeyStorageKeysActionProto.importProto(action);
                const crypto = await this.getCrypto(params.providerID);
                const keys = await crypto.keyStorage.keys();
                result.data = (await ArrayStringConverter.set(keys)).buffer;
                break;
            }
            case KeyStorageIndexOfActionProto.ACTION: {
                const params = await KeyStorageIndexOfActionProto.importProto(action);
                const crypto = await this.getCrypto(params.providerID);
                const key = this.getMemoryStorage().item(params.item.id).item;
                const index = await crypto.keyStorage.indexOf(key);
                if (index) {
                    result.data = pvtsutils.Convert.FromUtf8String(index);
                }
                break;
            }
            case KeyStorageClearActionProto.ACTION: {
                const params = await KeyStorageClearActionProto.importProto(action);
                const crypto = await this.getCrypto(params.providerID);
                await crypto.keyStorage.clear();
                break;
            }
            default:
                throw new WebCryptoLocalError(WebCryptoLocalError.CODE.ACTION_NOT_IMPLEMENTED, `Action '${action.action}' is not implemented`);
        }
        return result;
    }
}

var DigestActionProto_1, GenerateKeyActionProto_1, SignActionProto_1, VerifyActionProto_1, DeriveBitsActionProto_1, DeriveKeyActionProto_1, UnwrapKeyActionProto_1, WrapKeyActionProto_1, ExportKeyActionProto_1, ImportKeyActionProto_1;
let DigestActionProto = DigestActionProto_1 = class DigestActionProto extends CryptoActionProto {
};
DigestActionProto.INDEX = CryptoActionProto.INDEX;
DigestActionProto.ACTION = "crypto/subtle/digest";
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: DigestActionProto_1.INDEX++, required: true, parser: AlgorithmProto })
], DigestActionProto.prototype, "algorithm", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: DigestActionProto_1.INDEX++, required: true, converter: tsprotobuf.ArrayBufferConverter })
], DigestActionProto.prototype, "data", void 0);
DigestActionProto = DigestActionProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], DigestActionProto);
let GenerateKeyActionProto = GenerateKeyActionProto_1 = class GenerateKeyActionProto extends CryptoActionProto {
};
GenerateKeyActionProto.INDEX = CryptoActionProto.INDEX;
GenerateKeyActionProto.ACTION = "crypto/subtle/generateKey";
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: GenerateKeyActionProto_1.INDEX++, type: "bytes", required: true, parser: AlgorithmProto })
], GenerateKeyActionProto.prototype, "algorithm", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: GenerateKeyActionProto_1.INDEX++, type: "bool", required: true })
], GenerateKeyActionProto.prototype, "extractable", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: GenerateKeyActionProto_1.INDEX++, type: "string", repeated: true })
], GenerateKeyActionProto.prototype, "usage", void 0);
GenerateKeyActionProto = GenerateKeyActionProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], GenerateKeyActionProto);
let SignActionProto = SignActionProto_1 = class SignActionProto extends CryptoActionProto {
};
SignActionProto.INDEX = CryptoActionProto.INDEX;
SignActionProto.ACTION = "crypto/subtle/sign";
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: SignActionProto_1.INDEX++, required: true, parser: AlgorithmProto })
], SignActionProto.prototype, "algorithm", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: SignActionProto_1.INDEX++, required: true, parser: CryptoKeyProto })
], SignActionProto.prototype, "key", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: SignActionProto_1.INDEX++, required: true, converter: tsprotobuf.ArrayBufferConverter })
], SignActionProto.prototype, "data", void 0);
SignActionProto = SignActionProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], SignActionProto);
let VerifyActionProto = VerifyActionProto_1 = class VerifyActionProto extends SignActionProto {
};
VerifyActionProto.INDEX = SignActionProto.INDEX;
VerifyActionProto.ACTION = "crypto/subtle/verify";
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: VerifyActionProto_1.INDEX++, required: true, converter: tsprotobuf.ArrayBufferConverter })
], VerifyActionProto.prototype, "signature", void 0);
VerifyActionProto = VerifyActionProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], VerifyActionProto);
let EncryptActionProto = class EncryptActionProto extends SignActionProto {
};
EncryptActionProto.INDEX = SignActionProto.INDEX;
EncryptActionProto.ACTION = "crypto/subtle/encrypt";
EncryptActionProto = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], EncryptActionProto);
let DecryptActionProto = class DecryptActionProto extends SignActionProto {
};
DecryptActionProto.INDEX = SignActionProto.INDEX;
DecryptActionProto.ACTION = "crypto/subtle/decrypt";
DecryptActionProto = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], DecryptActionProto);
let DeriveBitsActionProto = DeriveBitsActionProto_1 = class DeriveBitsActionProto extends CryptoActionProto {
};
DeriveBitsActionProto.INDEX = CryptoActionProto.INDEX;
DeriveBitsActionProto.ACTION = "crypto/subtle/deriveBits";
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: DeriveBitsActionProto_1.INDEX++, required: true, parser: AlgorithmProto })
], DeriveBitsActionProto.prototype, "algorithm", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: DeriveBitsActionProto_1.INDEX++, required: true, parser: CryptoKeyProto })
], DeriveBitsActionProto.prototype, "key", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: DeriveBitsActionProto_1.INDEX++, required: true, type: "uint32" })
], DeriveBitsActionProto.prototype, "length", void 0);
DeriveBitsActionProto = DeriveBitsActionProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], DeriveBitsActionProto);
let DeriveKeyActionProto = DeriveKeyActionProto_1 = class DeriveKeyActionProto extends CryptoActionProto {
};
DeriveKeyActionProto.INDEX = CryptoActionProto.INDEX;
DeriveKeyActionProto.ACTION = "crypto/subtle/deriveKey";
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: DeriveKeyActionProto_1.INDEX++, required: true, parser: AlgorithmProto })
], DeriveKeyActionProto.prototype, "algorithm", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: DeriveKeyActionProto_1.INDEX++, required: true, parser: CryptoKeyProto })
], DeriveKeyActionProto.prototype, "key", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: DeriveKeyActionProto_1.INDEX++, required: true, parser: AlgorithmProto })
], DeriveKeyActionProto.prototype, "derivedKeyType", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: DeriveKeyActionProto_1.INDEX++, type: "bool" })
], DeriveKeyActionProto.prototype, "extractable", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: DeriveKeyActionProto_1.INDEX++, type: "string", repeated: true })
], DeriveKeyActionProto.prototype, "usage", void 0);
DeriveKeyActionProto = DeriveKeyActionProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], DeriveKeyActionProto);
let UnwrapKeyActionProto = UnwrapKeyActionProto_1 = class UnwrapKeyActionProto extends CryptoActionProto {
};
UnwrapKeyActionProto.INDEX = CryptoActionProto.INDEX;
UnwrapKeyActionProto.ACTION = "crypto/subtle/unwrapKey";
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: UnwrapKeyActionProto_1.INDEX++, required: true, type: "string" })
], UnwrapKeyActionProto.prototype, "format", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: UnwrapKeyActionProto_1.INDEX++, required: true, converter: tsprotobuf.ArrayBufferConverter })
], UnwrapKeyActionProto.prototype, "wrappedKey", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: UnwrapKeyActionProto_1.INDEX++, required: true, parser: CryptoKeyProto })
], UnwrapKeyActionProto.prototype, "unwrappingKey", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: UnwrapKeyActionProto_1.INDEX++, required: true, parser: AlgorithmProto })
], UnwrapKeyActionProto.prototype, "unwrapAlgorithm", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: UnwrapKeyActionProto_1.INDEX++, required: true, parser: AlgorithmProto })
], UnwrapKeyActionProto.prototype, "unwrappedKeyAlgorithm", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: UnwrapKeyActionProto_1.INDEX++, type: "bool" })
], UnwrapKeyActionProto.prototype, "extractable", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: UnwrapKeyActionProto_1.INDEX++, type: "string", repeated: true })
], UnwrapKeyActionProto.prototype, "keyUsage", void 0);
UnwrapKeyActionProto = UnwrapKeyActionProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], UnwrapKeyActionProto);
let WrapKeyActionProto = WrapKeyActionProto_1 = class WrapKeyActionProto extends CryptoActionProto {
};
WrapKeyActionProto.INDEX = CryptoActionProto.INDEX;
WrapKeyActionProto.ACTION = "crypto/subtle/wrapKey";
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: WrapKeyActionProto_1.INDEX++, required: true, type: "string" })
], WrapKeyActionProto.prototype, "format", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: WrapKeyActionProto_1.INDEX++, required: true, parser: CryptoKeyProto })
], WrapKeyActionProto.prototype, "key", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: WrapKeyActionProto_1.INDEX++, required: true, parser: CryptoKeyProto })
], WrapKeyActionProto.prototype, "wrappingKey", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: WrapKeyActionProto_1.INDEX++, required: true, parser: AlgorithmProto })
], WrapKeyActionProto.prototype, "wrapAlgorithm", void 0);
WrapKeyActionProto = WrapKeyActionProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], WrapKeyActionProto);
let ExportKeyActionProto = ExportKeyActionProto_1 = class ExportKeyActionProto extends CryptoActionProto {
};
ExportKeyActionProto.INDEX = CryptoActionProto.INDEX;
ExportKeyActionProto.ACTION = "crypto/subtle/exportKey";
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: ExportKeyActionProto_1.INDEX++, type: "string", required: true })
], ExportKeyActionProto.prototype, "format", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: ExportKeyActionProto_1.INDEX++, required: true, parser: CryptoKeyProto })
], ExportKeyActionProto.prototype, "key", void 0);
ExportKeyActionProto = ExportKeyActionProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], ExportKeyActionProto);
let ImportKeyActionProto = ImportKeyActionProto_1 = class ImportKeyActionProto extends CryptoActionProto {
};
ImportKeyActionProto.INDEX = CryptoActionProto.INDEX;
ImportKeyActionProto.ACTION = "crypto/subtle/importKey";
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: ImportKeyActionProto_1.INDEX++, type: "string", required: true })
], ImportKeyActionProto.prototype, "format", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: ImportKeyActionProto_1.INDEX++, required: true, converter: tsprotobuf.ArrayBufferConverter })
], ImportKeyActionProto.prototype, "keyData", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: ImportKeyActionProto_1.INDEX++, required: true, parser: AlgorithmProto })
], ImportKeyActionProto.prototype, "algorithm", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: ImportKeyActionProto_1.INDEX++, required: true, type: "bool" })
], ImportKeyActionProto.prototype, "extractable", void 0);
tslib_1.__decorate([
    tsprotobuf.ProtobufProperty({ id: ImportKeyActionProto_1.INDEX++, type: "string", repeated: true })
], ImportKeyActionProto.prototype, "keyUsages", void 0);
ImportKeyActionProto = ImportKeyActionProto_1 = tslib_1.__decorate([
    tsprotobuf.ProtobufElement({})
], ImportKeyActionProto);

class SubtleService extends Service {
    constructor(server, crypto) {
        super(server, crypto, [
            GenerateKeyActionProto,
            ImportKeyActionProto,
            ExportKeyActionProto,
            DigestActionProto,
            SignActionProto,
            VerifyActionProto,
            EncryptActionProto,
            DecryptActionProto,
            WrapKeyActionProto,
            UnwrapKeyActionProto,
            DeriveBitsActionProto,
            DeriveKeyActionProto,
        ]);
    }
    async getCrypto(id) {
        return await this.object.getCrypto(id);
    }
    getMemoryStorage() {
        return this.object.object.memoryStorage;
    }
    async onMessage(session, action) {
        const result = new ResultProto(action);
        switch (action.action) {
            case DigestActionProto.ACTION: {
                const params = await DigestActionProto.importProto(action);
                const crypto = await this.getCrypto(params.providerID);
                result.data = await crypto.subtle.digest(params.algorithm.toAlgorithm(), params.data);
                break;
            }
            case GenerateKeyActionProto.ACTION: {
                const params = await GenerateKeyActionProto.importProto(action);
                const crypto = await this.getCrypto(params.providerID);
                const keys = await crypto.subtle.generateKey(params.algorithm.toAlgorithm(), params.extractable, params.usage);
                let keyProto;
                if (keys.privateKey) {
                    const keyPair = keys;
                    const publicKey = new ServiceCryptoItem(keyPair.publicKey, params.providerID);
                    const privateKey = new ServiceCryptoItem(keyPair.privateKey, params.providerID);
                    this.getMemoryStorage().add(publicKey);
                    this.getMemoryStorage().add(privateKey);
                    const keyPairProto = new CryptoKeyPairProto();
                    keyPairProto.privateKey = privateKey.toProto();
                    keyPairProto.publicKey = publicKey.toProto();
                    keyProto = keyPairProto;
                }
                else {
                    const key = keys;
                    const secretKey = new ServiceCryptoItem(key, params.providerID);
                    this.getMemoryStorage().add(secretKey);
                    keyProto = secretKey.toProto();
                }
                result.data = await keyProto.exportProto();
                break;
            }
            case SignActionProto.ACTION: {
                const params = await SignActionProto.importProto(action);
                const crypto = await this.getCrypto(params.providerID);
                const key = this.getMemoryStorage().item(params.key.id).item;
                result.data = await crypto.subtle.sign(params.algorithm.toAlgorithm(), key, params.data);
                break;
            }
            case VerifyActionProto.ACTION: {
                const params = await VerifyActionProto.importProto(action);
                const crypto = await this.getCrypto(params.providerID);
                const key = this.getMemoryStorage().item(params.key.id).item;
                const ok = await crypto.subtle.verify(params.algorithm.toAlgorithm(), key, params.signature, params.data);
                result.data = new Uint8Array([ok ? 1 : 0]).buffer;
                break;
            }
            case EncryptActionProto.ACTION: {
                const params = await EncryptActionProto.importProto(action);
                const crypto = await this.getCrypto(params.providerID);
                const key = this.getMemoryStorage().item(params.key.id).item;
                result.data = await crypto.subtle.encrypt(params.algorithm.toAlgorithm(), key, params.data);
                break;
            }
            case DecryptActionProto.ACTION: {
                const params = await DecryptActionProto.importProto(action);
                const crypto = await this.getCrypto(params.providerID);
                const key = this.getMemoryStorage().item(params.key.id).item;
                result.data = await crypto.subtle.decrypt(params.algorithm.toAlgorithm(), key, params.data);
                break;
            }
            case DeriveBitsActionProto.ACTION: {
                const params = await DeriveBitsActionProto.importProto(action);
                const crypto = await this.getCrypto(params.providerID);
                const key = this.getMemoryStorage().item(params.key.id).item;
                const alg = params.algorithm.toAlgorithm();
                const publicKey = await CryptoKeyProto.importProto(alg.public);
                alg.public = this.getMemoryStorage().item(publicKey.id).item;
                result.data = await crypto.subtle.deriveBits(alg, key, params.length);
                break;
            }
            case DeriveKeyActionProto.ACTION: {
                const params = await DeriveKeyActionProto.importProto(action);
                const crypto = await this.getCrypto(params.providerID);
                const key = this.getMemoryStorage().item(params.key.id).item;
                const alg = params.algorithm.toAlgorithm();
                const publicKey = await CryptoKeyProto.importProto(alg.public);
                alg.public = this.getMemoryStorage().item(publicKey.id).item;
                const derivedKey = await crypto.subtle.deriveKey(alg, key, params.derivedKeyType, params.extractable, params.usage);
                const resKey = new ServiceCryptoItem(derivedKey, params.providerID);
                this.getMemoryStorage().add(resKey);
                result.data = await resKey.toProto().exportProto();
                break;
            }
            case WrapKeyActionProto.ACTION: {
                const params = await WrapKeyActionProto.importProto(action);
                const crypto = await this.getCrypto(params.providerID);
                const key = await this.getMemoryStorage().item(params.key.id).item;
                const wrappingKey = this.getMemoryStorage().item(params.wrappingKey.id).item;
                result.data = await crypto.subtle.wrapKey(params.format, key, wrappingKey, params.wrapAlgorithm.toAlgorithm());
                break;
            }
            case UnwrapKeyActionProto.ACTION: {
                const params = await UnwrapKeyActionProto.importProto(action);
                const crypto = await this.getCrypto(params.providerID);
                const unwrappingKey = await this.getMemoryStorage().item(params.unwrappingKey.id).item;
                const key = await crypto.subtle.unwrapKey(params.format, params.wrappedKey, unwrappingKey, params.unwrapAlgorithm.toAlgorithm(), params.unwrappedKeyAlgorithm.toAlgorithm(), params.extractable, params.keyUsage);
                const resKey = new ServiceCryptoItem(key, params.providerID);
                this.getMemoryStorage().add(resKey);
                result.data = await resKey.toProto().exportProto();
                break;
            }
            case ExportKeyActionProto.ACTION: {
                const params = await ExportKeyActionProto.importProto(action);
                const crypto = await this.getCrypto(params.providerID);
                const key = await this.getMemoryStorage().item(params.key.id).item;
                const exportedData = await crypto.subtle.exportKey(params.format, key);
                if (params.format.toLowerCase() === "jwk") {
                    const json = JSON.stringify(exportedData);
                    result.data = pvtsutils.Convert.FromUtf8String(json);
                }
                else {
                    result.data = exportedData;
                }
                break;
            }
            case ImportKeyActionProto.ACTION: {
                const params = await ImportKeyActionProto.importProto(action);
                const crypto = await this.getCrypto(params.providerID);
                let keyData;
                if (params.format.toLowerCase() === "jwk") {
                    const json = pvtsutils.Convert.ToUtf8String(params.keyData);
                    keyData = JSON.parse(json);
                }
                else {
                    keyData = params.keyData;
                }
                const key = await crypto.subtle.importKey(params.format, keyData, params.algorithm.toAlgorithm(), params.extractable, params.keyUsages);
                const resKey = new ServiceCryptoItem(key, params.providerID);
                this.getMemoryStorage().add(resKey);
                result.data = await resKey.toProto().exportProto();
                break;
            }
            default:
                throw new WebCryptoLocalError(WebCryptoLocalError.CODE.ACTION_NOT_IMPLEMENTED, `Action '${action.action}' is not implemented`);
        }
        return result;
    }
}

class CryptoService extends Service {
    constructor(server, provider) {
        super(server, provider, [
            IsLoggedInActionProto,
            LoginActionProto,
            LogoutActionProto,
            ResetActionProto,
        ]);
        this.addService(new SubtleService(server, this));
        this.addService(new CertificateStorageService(server, this));
        this.addService(new KeyStorageService(server, this));
    }
    emit(event, ...args) {
        return super.emit(event, ...args);
    }
    on(event, cb) {
        return super.on(event, cb);
    }
    once(event, cb) {
        return super.once(event, cb);
    }
    async getCrypto(id) {
        return await this.object.getProvider().getCrypto(id);
    }
    async onMessage(session, action) {
        const result = new ResultProto(action);
        switch (action.action) {
            case IsLoggedInActionProto.ACTION: {
                const params = await IsLoggedInActionProto.importProto(action);
                const crypto = await this.getCrypto(params.providerID);
                result.data = new Uint8Array([crypto.isLoggedIn ? 1 : 0]).buffer;
                break;
            }
            case LoginActionProto.ACTION: {
                const params = await LoginActionProto.importProto(action);
                const crypto = await this.getCrypto(params.providerID);
                const slot = crypto.slot;
                if (crypto.login) {
                    const token = slot.getToken();
                    if (token.flags & graphene.TokenFlag.LOGIN_REQUIRED) {
                        if (token.flags & graphene.TokenFlag.PROTECTED_AUTHENTICATION_PATH) {
                            crypto.login("");
                        }
                        else {
                            const promise = new Promise((resolve, reject) => {
                                this.emit("notify", {
                                    type: "pin",
                                    origin: session.headers.origin,
                                    label: slot.getToken().label,
                                    resolve,
                                    reject,
                                });
                            });
                            const pin = await promise;
                            crypto.login(pin);
                        }
                    }
                }
                break;
            }
            case LogoutActionProto.ACTION: {
                const params = await LogoutActionProto.importProto(action);
                const crypto = await this.getCrypto(params.providerID);
                if (crypto.logout) {
                    crypto.logout();
                }
                break;
            }
            case ResetActionProto.ACTION: {
                const params = await ResetActionProto.importProto(action);
                const crypto = await this.getCrypto(params.providerID);
                if ("reset" in crypto) {
                    await crypto.reset();
                }
                break;
            }
            default:
                throw new WebCryptoLocalError(WebCryptoLocalError.CODE.ACTION_NOT_IMPLEMENTED, `Action '${action.action}' is not implemented`);
        }
        return result;
    }
}

class ProviderService extends Service {
    constructor(server, options) {
        super(server, new LocalProvider(options), [
            ProviderInfoActionProto,
            ProviderGetCryptoActionProto,
        ]);
        this.memoryStorage = new MemoryStorage();
        const crypto = new CryptoService(server, this);
        this.addService(crypto);
        this.object.on("token_new", this.onTokenNew.bind(this));
        this.object.on("token", this.onToken.bind(this));
        crypto.on("notify", this.onNotify.bind(this));
    }
    emit(event, ...args) {
        return super.emit(event, ...args);
    }
    on(event, cb) {
        return super.on(event, cb);
    }
    once(event, cb) {
        return super.once(event, cb);
    }
    open() {
        this.object.open()
            .catch((err) => {
            this.emit("error", err);
        })
            .then(() => {
            this.emit("info", "Provider:Opened");
        });
    }
    close() {
        this.object.crypto.clear();
    }
    getProvider() {
        return this.object;
    }
    onTokenNew(e) {
        this.emit("token_new", e);
    }
    onToken(info) {
        if (info.error) {
            this.emit("error", info.error);
        }
        else {
            this.emit("info", `Provider:Token Amount of tokens was changed (+${info.added.length}/-${info.removed.length})`);
            this.server.sessions.forEach((session) => {
                if (session.cipher && session.authorized) {
                    info.removed.forEach((item, index) => {
                        info.removed[index] = new ProviderCryptoProto(item);
                        this.memoryStorage.removeByProvider(info.removed[index].id);
                    });
                    info.added.forEach((item, index) => {
                        info.added[index] = new ProviderCryptoProto(item);
                    });
                    this.server.send(session, new ProviderTokenEventProto(info));
                }
            });
        }
    }
    onNotify(e) {
        this.emit("notify", e);
    }
    async onMessage(session, action) {
        const result = new ResultProto(action);
        switch (action.action) {
            case ProviderInfoActionProto.ACTION: {
                const info = this.object.info;
                result.data = await info.exportProto();
                break;
            }
            case ProviderGetCryptoActionProto.ACTION: {
                const getCryptoParams = await ProviderGetCryptoActionProto.importProto(action);
                await this.object.getCrypto(getCryptoParams.cryptoID);
                break;
            }
            default:
                throw new WebCryptoLocalError(WebCryptoLocalError.CODE.ACTION_NOT_IMPLEMENTED, `Action '${action.action}' is not implemented`);
        }
        return result;
    }
}

class LocalServer extends events.EventEmitter {
    constructor(options) {
        super();
        this.sessions = [];
        this.server = new Server(options);
        this.cardReader = new CardReaderService(this.server)
            .on("info", (e) => {
            this.emit("info", e);
        })
            .on("error", (e) => {
            this.emit("error", e);
        });
        this.provider = new ProviderService(this.server, options.config)
            .on("info", (e) => {
            this.emit("info", e);
        })
            .on("error", (e) => {
            this.emit("error", e);
        })
            .on("notify", (e) => {
            this.emit("notify", e);
        })
            .on("token_new", (e) => {
            this.emit("token_new", e);
        });
    }
    close(callback) {
        this.cardReader.stop();
        this.server.close(() => {
            this.provider.close();
            if (callback) {
                callback();
            }
        });
    }
    listen(address) {
        this.server
            .on("listening", (e) => {
            this.emit("listening", e.address);
            this.provider.open();
        })
            .on("connect", (session) => {
            this.emit("info", `Server: New session connect ${session.connection.remoteAddress}`);
            if (!(this.sessions.length && this.sessions.some((item) => item === session))) {
                this.emit("info", `Server: Push session to stack`);
                this.sessions.push(session);
            }
        })
            .on("disconnect", (e) => {
            this.emit("info", `Server: Close session ${e.description} (code: ${e.reasonCode})`);
        })
            .on("info", (message) => {
            this.emit("info", message);
        })
            .on("error", (e) => {
            this.emit("error", e.error);
        })
            .on("message", (e) => {
            (async () => {
                if (e.message.action === ServerIsLoggedInActionProto.ACTION ||
                    e.message.action === ServerLoginActionProto.ACTION) {
                    this.onMessage(e.session, e.message)
                        .then(e.resolve, e.reject);
                }
            })()
                .catch((error) => {
                this.emit("error", error);
            });
        })
            .on("auth", (session) => {
            this.emit("info", "Server: session auth");
            this.server.send(session, new ProviderAuthorizedEventProto())
                .catch((e) => {
                this.emit("error", e);
            });
        });
        this.server.listen(address);
        this.cardReader.start();
        return this;
    }
    on(event, cb) {
        return super.on(event, cb);
    }
    async onMessage(session, action) {
        const resultProto = new ResultProto(action);
        let data;
        switch (action.action) {
            case ServerIsLoggedInActionProto.ACTION: {
                data = new Uint8Array([session.authorized ? 1 : 0]).buffer;
                break;
            }
            case ServerLoginActionProto.ACTION: {
                if (!session.authorized) {
                    const pin = await challenge(session.identity.signingKey.publicKey, session.cipher.remoteIdentity.signingKey);
                    const promise = new Promise((resolve, reject) => {
                        this.emit("notify", {
                            type: "2key",
                            origin: session.headers.origin,
                            pin,
                            resolve,
                            reject,
                        });
                    });
                    const ok = await promise;
                    if (ok) {
                        const remoteIdentityEx = session.cipher.remoteIdentity;
                        remoteIdentityEx.origin = session.headers.origin;
                        remoteIdentityEx.userAgent = session.headers["user-agent"];
                        this.server.storage.saveRemoteIdentity(session.cipher.remoteIdentity.signingKey.id, remoteIdentityEx);
                        session.authorized = true;
                    }
                    else {
                        throw new WebCryptoLocalError(WebCryptoLocalError.CODE.RATCHET_KEY_NOT_APPROVED);
                    }
                }
                break;
            }
            default:
                throw new WebCryptoLocalError(`Action '${action.action}' is not implemented`);
        }
        resultProto.data = data;
        return resultProto;
    }
}

exports.setEngine = _2keyRatchet.setEngine;
exports.getEngine = _2keyRatchet.getEngine;
exports.LocalServer = LocalServer;
exports.WebCryptoLocalError = WebCryptoLocalError;
