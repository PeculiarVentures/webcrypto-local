'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var tslib_1 = require('tslib');
var _2keyRatchet = require('2key-ratchet');
var pvtsutils = require('pvtsutils');
var tsprotobuf = require('tsprotobuf');
var fs = require('fs');
var os = require('os');
var path = require('path');
var events = require('events');
var https = require('https');
var url = require('url');
var WebSocket = require('websocket');
var crypto = require('crypto');
var asn1js = require('asn1js');
var webcryptoCore = require('webcrypto-core');
var graphene = require('graphene-pk11');
var nodeWebcryptoP11 = require('node-webcrypto-p11');
var pvutils = require('pvutils');
var request = _interopDefault(require('request'));

function challenge(serverIdentity, clientIdentity) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var serverIdentityDigest, clientIdentityDigest, combinedIdentity, digest;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, serverIdentity.thumbprint()];
                case 1:
                    serverIdentityDigest = _a.sent();
                    return [4, clientIdentity.thumbprint()];
                case 2:
                    clientIdentityDigest = _a.sent();
                    combinedIdentity = pvtsutils.Convert.FromHex(serverIdentityDigest + clientIdentityDigest);
                    return [4, _2keyRatchet.getEngine().crypto.subtle.digest("SHA-256", combinedIdentity)];
                case 3:
                    digest = _a.sent();
                    return [2, parseInt(pvtsutils.Convert.ToHex(digest), 16).toString().substr(2, 6)];
            }
        });
    });
}

var Event = (function () {
    function Event(target, event) {
        this.target = target;
        this.event = event;
    }
    return Event;
}());

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
var WebCryptoLocalError = (function (_super) {
    tslib_1.__extends(WebCryptoLocalError, _super);
    function WebCryptoLocalError(param, message) {
        if (message === void 0) { message = ""; }
        var _this = _super.call(this) || this;
        _this.code = 0;
        _this.type = "wcl";
        var CODE = WebCryptoLocalError.CODE;
        if (typeof param === "number") {
            _this.message = message || CODE[param] || CODE[0];
            _this.code = param;
        }
        else {
            _this.code = 0;
            _this.message = message;
        }
        var error = new Error(_this.message);
        error.name = _this.constructor.name;
        _this.stack = error.stack;
        return _this;
    }
    WebCryptoLocalError.isError = function (obj) {
        if (obj instanceof Error && obj.hasOwnProperty("code") && obj.hasOwnProperty("type")) {
            return true;
        }
        return false;
    };
    WebCryptoLocalError.CODE = WebCryptoLocalErrorEnum;
    return WebCryptoLocalError;
}(Error));

var DateConverter = (function () {
    function DateConverter() {
    }
    DateConverter.set = function (value) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2, new Uint8Array(pvtsutils.Convert.FromUtf8String(value.toISOString()))];
            });
        });
    };
    DateConverter.get = function (value) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2, new Date(pvtsutils.Convert.ToUtf8String(value))];
            });
        });
    };
    return DateConverter;
}());
var ArrayStringConverter = (function () {
    function ArrayStringConverter() {
    }
    ArrayStringConverter.set = function (value) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2, new Uint8Array(pvtsutils.Convert.FromUtf8String((value).join(",")))];
            });
        });
    };
    ArrayStringConverter.get = function (value) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2, pvtsutils.Convert.ToUtf8String(value).split(",")];
            });
        });
    };
    return ArrayStringConverter;
}());
var HexStringConverter = (function () {
    function HexStringConverter() {
    }
    HexStringConverter.set = function (value) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2, new Uint8Array(pvtsutils.Convert.FromHex(value))];
            });
        });
    };
    HexStringConverter.get = function (value) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2, pvtsutils.Convert.ToHex(value)];
            });
        });
    };
    return HexStringConverter;
}());

var BaseProto = (function (_super) {
    tslib_1.__extends(BaseProto, _super);
    function BaseProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseProto_1 = BaseProto;
    BaseProto.INDEX = 1;
    tslib_1.__decorate([
        tsprotobuf.ProtobufProperty({ id: BaseProto_1.INDEX++, type: "uint32", required: true, defaultValue: 1 })
    ], BaseProto.prototype, "version", void 0);
    BaseProto = BaseProto_1 = tslib_1.__decorate([
        tsprotobuf.ProtobufElement({ name: "BaseMessage" })
    ], BaseProto);
    return BaseProto;
    var BaseProto_1;
}(tsprotobuf.ObjectProto));
var ActionProto = (function (_super) {
    tslib_1.__extends(ActionProto, _super);
    function ActionProto() {
        var _this = _super.call(this) || this;
        _this.action = _this.constructor.ACTION;
        return _this;
    }
    ActionProto_1 = ActionProto;
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
    return ActionProto;
    var ActionProto_1;
}(BaseProto));
var BaseAlgorithmProto = (function (_super) {
    tslib_1.__extends(BaseAlgorithmProto, _super);
    function BaseAlgorithmProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseAlgorithmProto_1 = BaseAlgorithmProto;
    BaseAlgorithmProto.prototype.toAlgorithm = function () {
        return { name: this.name };
    };
    BaseAlgorithmProto.prototype.fromAlgorithm = function (alg) {
        this.name = alg.name;
    };
    BaseAlgorithmProto.INDEX = BaseProto.INDEX;
    tslib_1.__decorate([
        tsprotobuf.ProtobufProperty({ id: BaseAlgorithmProto_1.INDEX++, type: "string", required: true })
    ], BaseAlgorithmProto.prototype, "name", void 0);
    BaseAlgorithmProto = BaseAlgorithmProto_1 = tslib_1.__decorate([
        tsprotobuf.ProtobufElement({ name: "BaseAlgorithm" })
    ], BaseAlgorithmProto);
    return BaseAlgorithmProto;
    var BaseAlgorithmProto_1;
}(BaseProto));
var AlgorithmProto = (function (_super) {
    tslib_1.__extends(AlgorithmProto, _super);
    function AlgorithmProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AlgorithmProto_1 = AlgorithmProto;
    AlgorithmProto.prototype.toAlgorithm = function () {
        var res = {};
        var thisStatic = this.constructor;
        for (var key in thisStatic.items) {
            if (key === "version") {
                continue;
            }
            var value = this[key];
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
    };
    AlgorithmProto.prototype.fromAlgorithm = function (alg) {
        if (alg instanceof AlgorithmProto_1) {
            alg = alg.toAlgorithm();
        }
        var thisStatic = this.constructor;
        for (var key in alg) {
            if (key in thisStatic.items) {
                if (thisStatic.items[key].parser) {
                    switch (thisStatic.items[key].parser) {
                        case BaseAlgorithmProto: {
                            this[key].fromAlgorithm(alg[key]);
                            break;
                        }
                        default:
                            throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CASE_ERROR, "Unsupported parser '" + thisStatic.items[key].parser.name + "'");
                    }
                }
                else {
                    this[key] = alg[key];
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
    return AlgorithmProto;
    var AlgorithmProto_1;
}(BaseAlgorithmProto));
var CryptoItemProto = (function (_super) {
    tslib_1.__extends(CryptoItemProto, _super);
    function CryptoItemProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CryptoItemProto_1 = CryptoItemProto;
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
    return CryptoItemProto;
    var CryptoItemProto_1;
}(BaseProto));
var CryptoKeyProto = (function (_super) {
    tslib_1.__extends(CryptoKeyProto, _super);
    function CryptoKeyProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CryptoKeyProto_1 = CryptoKeyProto;
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
    return CryptoKeyProto;
    var CryptoKeyProto_1;
}(CryptoItemProto));
var CryptoKeyPairProto = (function (_super) {
    tslib_1.__extends(CryptoKeyPairProto, _super);
    function CryptoKeyPairProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CryptoKeyPairProto_1 = CryptoKeyPairProto;
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
    return CryptoKeyPairProto;
    var CryptoKeyPairProto_1;
}(BaseProto));
var ErrorProto = (function (_super) {
    tslib_1.__extends(ErrorProto, _super);
    function ErrorProto(message, code, type) {
        if (code === void 0) { code = 0; }
        if (type === void 0) { type = "error"; }
        var _this = _super.call(this) || this;
        if (message) {
            _this.message = message;
            _this.code = code;
            _this.type = type;
        }
        return _this;
    }
    ErrorProto_1 = ErrorProto;
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
    return ErrorProto;
    var ErrorProto_1;
}(BaseProto));
var ResultProto = (function (_super) {
    tslib_1.__extends(ResultProto, _super);
    function ResultProto(proto) {
        var _this = _super.call(this) || this;
        if (proto) {
            _this.actionId = proto.actionId;
            _this.action = proto.action;
        }
        return _this;
    }
    ResultProto_1 = ResultProto;
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
    return ResultProto;
    var ResultProto_1;
}(ActionProto));
var AuthRequestProto = (function (_super) {
    tslib_1.__extends(AuthRequestProto, _super);
    function AuthRequestProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AuthRequestProto.INDEX = ActionProto.INDEX;
    AuthRequestProto.ACTION = "auth";
    AuthRequestProto = tslib_1.__decorate([
        tsprotobuf.ProtobufElement({ name: "AuthRequest" })
    ], AuthRequestProto);
    return AuthRequestProto;
}(ActionProto));
var ServerLoginActionProto = (function (_super) {
    tslib_1.__extends(ServerLoginActionProto, _super);
    function ServerLoginActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ServerLoginActionProto.INDEX = ActionProto.INDEX;
    ServerLoginActionProto.ACTION = "server/login";
    ServerLoginActionProto = tslib_1.__decorate([
        tsprotobuf.ProtobufElement({})
    ], ServerLoginActionProto);
    return ServerLoginActionProto;
}(ActionProto));
var ServerIsLoggedInActionProto = (function (_super) {
    tslib_1.__extends(ServerIsLoggedInActionProto, _super);
    function ServerIsLoggedInActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ServerIsLoggedInActionProto.INDEX = ActionProto.INDEX;
    ServerIsLoggedInActionProto.ACTION = "server/isLoggedIn";
    ServerIsLoggedInActionProto = tslib_1.__decorate([
        tsprotobuf.ProtobufElement({})
    ], ServerIsLoggedInActionProto);
    return ServerIsLoggedInActionProto;
}(ActionProto));

var SERVER_WELL_KNOWN = "/.well-known/webcrypto-socket";

function declareDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
    return dirPath;
}
var USER_DIR = os.homedir();
var APP_DATA_DIR = declareDir(path.join(USER_DIR, ".fortify"));
var DOUBLE_KEY_RATCHET_STORAGE_DIR = declareDir(path.join(APP_DATA_DIR, "2key-ratchet"));
var OPENSSL_CERT_STORAGE_DIR = declareDir(path.join(APP_DATA_DIR, "certstorage"));
var OPENSSL_KEY_STORAGE_DIR = declareDir(path.join(APP_DATA_DIR, "keystorage"));

var WebCrypto = require("node-webcrypto-ossl");
var crypto$1 = new WebCrypto();
var D_KEY_IDENTITY_PRE_KEY_AMOUNT = 10;
var OpenSSLStorage = (function () {
    function OpenSSLStorage() {
        this.identities = {};
        this.remoteIdentities = {};
        this.sessions = {};
    }
    OpenSSLStorage.create = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var res;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        res = new this();
                        return [4, res.loadIdentities()];
                    case 1:
                        _a.sent();
                        return [2, res];
                }
            });
        });
    };
    OpenSSLStorage.prototype.loadIdentities = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var identityPath, data, json, _a, _b, _i, origin, jsonIdentity, _c, _d, _e, _f, _g, _h, preKey, _j, _k, _l, _m, preKey, _o, _p, _q, _r;
            return tslib_1.__generator(this, function (_s) {
                switch (_s.label) {
                    case 0:
                        identityPath = OpenSSLStorage.STORAGE_NAME + "/identity.json";
                        this.identities = {};
                        if (!fs.existsSync(identityPath)) return [3, 18];
                        data = fs.readFileSync(identityPath).toString();
                        json = void 0;
                        try {
                            json = JSON.parse(data);
                        }
                        catch (err) {
                            return [2];
                        }
                        if ((json.version || 0) < 2) {
                            this.remoteIdentities = {};
                            this.saveIdentities();
                            this.saveRemote();
                            return [2];
                        }
                        _a = [];
                        for (_b in json.identities)
                            _a.push(_b);
                        _i = 0;
                        _s.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3, 18];
                        origin = _a[_i];
                        jsonIdentity = json.identities[origin];
                        _c = jsonIdentity.signingKey;
                        return [4, this.ecKeyToCryptoKey(jsonIdentity.signingKey.privateKey, "private", "ECDSA")];
                    case 2:
                        _c.privateKey = _s.sent();
                        _d = jsonIdentity.signingKey;
                        return [4, this.ecKeyToCryptoKey(jsonIdentity.signingKey.publicKey, "public", "ECDSA")];
                    case 3:
                        _d.publicKey = _s.sent();
                        _e = jsonIdentity.exchangeKey;
                        return [4, this.ecKeyToCryptoKey(jsonIdentity.exchangeKey.privateKey, "private", "ECDH")];
                    case 4:
                        _e.privateKey = _s.sent();
                        _f = jsonIdentity.exchangeKey;
                        return [4, this.ecKeyToCryptoKey(jsonIdentity.exchangeKey.publicKey, "public", "ECDH")];
                    case 5:
                        _f.publicKey = _s.sent();
                        _g = 0, _h = jsonIdentity.preKeys;
                        _s.label = 6;
                    case 6:
                        if (!(_g < _h.length)) return [3, 10];
                        preKey = _h[_g];
                        _j = preKey;
                        return [4, this.ecKeyToCryptoKey(preKey.privateKey, "private", "ECDH")];
                    case 7:
                        _j.privateKey = _s.sent();
                        _k = preKey;
                        return [4, this.ecKeyToCryptoKey(preKey.publicKey, "public", "ECDH")];
                    case 8:
                        _k.publicKey = _s.sent();
                        _s.label = 9;
                    case 9:
                        _g++;
                        return [3, 6];
                    case 10:
                        _l = 0, _m = jsonIdentity.signedPreKeys;
                        _s.label = 11;
                    case 11:
                        if (!(_l < _m.length)) return [3, 15];
                        preKey = _m[_l];
                        _o = preKey;
                        return [4, this.ecKeyToCryptoKey(preKey.privateKey, "private", "ECDH")];
                    case 12:
                        _o.privateKey = _s.sent();
                        _p = preKey;
                        return [4, this.ecKeyToCryptoKey(preKey.publicKey, "public", "ECDH")];
                    case 13:
                        _p.publicKey = _s.sent();
                        _s.label = 14;
                    case 14:
                        _l++;
                        return [3, 11];
                    case 15:
                        _q = this.identities;
                        _r = origin;
                        return [4, _2keyRatchet.Identity.fromJSON(jsonIdentity)];
                    case 16:
                        _q[_r] = _s.sent();
                        _s.label = 17;
                    case 17:
                        _i++;
                        return [3, 1];
                    case 18: return [2];
                }
            });
        });
    };
    OpenSSLStorage.prototype.saveIdentities = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var jsonIdentities, _a, _b, _i, origin, identity, json, jsonIdentity, _c, _d, _e, _f, _g, _h, preKey, _j, _k, _l, _m, preKey, _o, _p, jsonIdentityBundle;
            return tslib_1.__generator(this, function (_q) {
                switch (_q.label) {
                    case 0:
                        jsonIdentities = {};
                        _a = [];
                        for (_b in this.identities)
                            _a.push(_b);
                        _i = 0;
                        _q.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3, 18];
                        origin = _a[_i];
                        identity = this.identities[origin];
                        return [4, identity.toJSON()];
                    case 2:
                        json = _q.sent();
                        jsonIdentity = json;
                        _c = jsonIdentity.signingKey;
                        return [4, this.ecKeyToBase64(json.signingKey.privateKey)];
                    case 3:
                        _c.privateKey = _q.sent();
                        _d = jsonIdentity.signingKey;
                        return [4, this.ecKeyToBase64(json.signingKey.publicKey)];
                    case 4:
                        _d.publicKey = _q.sent();
                        _e = jsonIdentity.exchangeKey;
                        return [4, this.ecKeyToBase64(json.exchangeKey.privateKey)];
                    case 5:
                        _e.privateKey = _q.sent();
                        _f = jsonIdentity.exchangeKey;
                        return [4, this.ecKeyToBase64(json.exchangeKey.publicKey)];
                    case 6:
                        _f.publicKey = _q.sent();
                        _g = 0, _h = json.preKeys;
                        _q.label = 7;
                    case 7:
                        if (!(_g < _h.length)) return [3, 11];
                        preKey = _h[_g];
                        _j = preKey;
                        return [4, this.ecKeyToBase64(preKey.privateKey)];
                    case 8:
                        _j.privateKey = _q.sent();
                        _k = preKey;
                        return [4, this.ecKeyToBase64(preKey.publicKey)];
                    case 9:
                        _k.publicKey = _q.sent();
                        _q.label = 10;
                    case 10:
                        _g++;
                        return [3, 7];
                    case 11:
                        _l = 0, _m = json.signedPreKeys;
                        _q.label = 12;
                    case 12:
                        if (!(_l < _m.length)) return [3, 16];
                        preKey = _m[_l];
                        _o = preKey;
                        return [4, this.ecKeyToBase64(preKey.privateKey)];
                    case 13:
                        _o.privateKey = _q.sent();
                        _p = preKey;
                        return [4, this.ecKeyToBase64(preKey.publicKey)];
                    case 14:
                        _p.publicKey = _q.sent();
                        _q.label = 15;
                    case 15:
                        _l++;
                        return [3, 12];
                    case 16:
                        jsonIdentities[origin] = jsonIdentity;
                        _q.label = 17;
                    case 17:
                        _i++;
                        return [3, 1];
                    case 18:
                        jsonIdentityBundle = {
                            version: 2,
                            identities: jsonIdentities,
                        };
                        fs.writeFileSync(OpenSSLStorage.STORAGE_NAME + "/identity.json", JSON.stringify(jsonIdentityBundle, null, "  "), {
                            encoding: "utf8",
                            flag: "w+",
                        });
                        return [2];
                }
            });
        });
    };
    OpenSSLStorage.prototype.getIdentity = function (origin) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var identity;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        identity = this.identities[origin];
                        if (!!identity) return [3, 3];
                        return [4, _2keyRatchet.Identity.create(0, D_KEY_IDENTITY_PRE_KEY_AMOUNT)];
                    case 1:
                        identity = _a.sent();
                        this.identities[origin] = identity;
                        return [4, this.saveIdentities()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2, identity];
                }
            });
        });
    };
    OpenSSLStorage.prototype.loadRemoteIdentity = function (key) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.loadRemote()];
                    case 1:
                        _a.sent();
                        return [2, this.remoteIdentities[key]];
                }
            });
        });
    };
    OpenSSLStorage.prototype.saveRemoteIdentity = function (key, value) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.remoteIdentities[key] = value;
                        return [4, this.saveRemote()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    OpenSSLStorage.prototype.removeRemoteIdentity = function (key) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        delete this.remoteIdentities[key];
                        return [4, this.saveRemote()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    OpenSSLStorage.prototype.isTrusted = function (remoteIdentity) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var ok, trustedIdentity;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, remoteIdentity.verify()];
                    case 1:
                        ok = _a.sent();
                        if (!ok) {
                            return [2, false];
                        }
                        return [4, this.loadRemoteIdentity(remoteIdentity.signingKey.id)];
                    case 2:
                        trustedIdentity = _a.sent();
                        if (!trustedIdentity) {
                            return [2, false];
                        }
                        return [2, true];
                }
            });
        });
    };
    OpenSSLStorage.prototype.loadSession = function (key) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var res;
            return tslib_1.__generator(this, function (_a) {
                res = this.sessions[key];
                return [2, res || null];
            });
        });
    };
    OpenSSLStorage.prototype.saveSession = function (key, value) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.sessions[key] = value;
                return [2];
            });
        });
    };
    OpenSSLStorage.prototype.findSession = function (key) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, _b, _i, i, item;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = [];
                        for (_b in this.sessions)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3, 4];
                        i = _a[_i];
                        item = this.sessions[i];
                        return [4, item.hasRatchetKey(key)];
                    case 2:
                        if (_c.sent()) {
                            return [2, item];
                        }
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3, 1];
                    case 4: return [2, false];
                }
            });
        });
    };
    OpenSSLStorage.prototype.ecKeyToBase64 = function (key) {
        return new Promise(function (resolve, reject) {
            var k = key;
            if (key.type === "public") {
                k.native_.exportSpki(function (err, data) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data.toString("base64"));
                    }
                });
            }
            else {
                k.native_.exportPkcs8(function (err, data) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data.toString("base64"));
                    }
                });
            }
        });
    };
    OpenSSLStorage.prototype.ecKeyToCryptoKey = function (base64, type, alg) {
        if (type === "public") {
            return crypto$1.subtle.importKey("spki", new Buffer(base64, "base64"), {
                name: alg,
                namedCurve: "P-256",
            }, true, alg === "ECDSA" ? ["verify"] : []);
        }
        else {
            return crypto$1.subtle.importKey("pkcs8", new Buffer(base64, "base64"), {
                name: alg,
                namedCurve: "P-256",
            }, false, alg === "ECDSA" ? ["sign"] : ["deriveBits", "deriveKey"]);
        }
    };
    OpenSSLStorage.prototype.saveRemote = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var json, _a, _b, _i, key, remoteIdentity, identity, _c, _d, _e;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        json = {};
                        _a = [];
                        for (_b in this.remoteIdentities)
                            _a.push(_b);
                        _i = 0;
                        _f.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3, 6];
                        key = _a[_i];
                        remoteIdentity = this.remoteIdentities[key];
                        return [4, remoteIdentity.toJSON()];
                    case 2:
                        identity = _f.sent();
                        _c = json;
                        _d = key;
                        _e = {};
                        return [4, this.ecKeyToBase64(identity.signingKey)];
                    case 3:
                        _e.signingKey = _f.sent();
                        return [4, this.ecKeyToBase64(identity.exchangeKey)];
                    case 4:
                        _c[_d] = (_e.exchangeKey = _f.sent(), _e.id = identity.id, _e.thumbprint = identity.thumbprint, _e.signature = new Buffer(identity.signature).toString("base64"), _e.createdAt = identity.createdAt, _e.origin = remoteIdentity.origin, _e.userAgent = remoteIdentity.userAgent, _e);
                        _f.label = 5;
                    case 5:
                        _i++;
                        return [3, 1];
                    case 6:
                        fs.writeFileSync(OpenSSLStorage.STORAGE_NAME + "/remote.json", JSON.stringify(json, null, "  "), {
                            encoding: "utf8",
                            flag: "w+",
                        });
                        return [2];
                }
            });
        });
    };
    OpenSSLStorage.prototype.loadRemote = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var file, data, json, _a, _b, _i, key, identity, _c, _d, _e, _f;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        file = OpenSSLStorage.STORAGE_NAME + "/remote.json";
                        this.remoteIdentities = {};
                        if (!fs.existsSync(file)) return [3, 6];
                        data = fs.readFileSync(file);
                        json = JSON.parse(data.toString());
                        _a = [];
                        for (_b in json)
                            _a.push(_b);
                        _i = 0;
                        _g.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3, 6];
                        key = _a[_i];
                        identity = json[key];
                        _c = identity;
                        return [4, this.ecKeyToCryptoKey(identity.signingKey, "public", "ECDSA")];
                    case 2:
                        _c.signingKey = _g.sent();
                        _d = identity;
                        return [4, this.ecKeyToCryptoKey(identity.exchangeKey, "public", "ECDH")];
                    case 3:
                        _d.exchangeKey = _g.sent();
                        identity.signature = pvtsutils.Convert.FromBase64(identity.signature);
                        identity.createdAt = new Date(identity.createdAt);
                        _e = this.remoteIdentities;
                        _f = key;
                        return [4, _2keyRatchet.RemoteIdentity.fromJSON(identity)];
                    case 4:
                        _e[_f] = _g.sent();
                        this.remoteIdentities[key].origin = identity.origin;
                        this.remoteIdentities[key].userAgent = identity.userAgent;
                        _g.label = 5;
                    case 5:
                        _i++;
                        return [3, 1];
                    case 6: return [2];
                }
            });
        });
    };
    OpenSSLStorage.STORAGE_NAME = DOUBLE_KEY_RATCHET_STORAGE_DIR;
    OpenSSLStorage.IDENTITY_STORAGE = "identity";
    OpenSSLStorage.SESSION_STORAGE = "sessions";
    OpenSSLStorage.REMOTE_STORAGE = "remoteIdentity";
    return OpenSSLStorage;
}());

var ServerEvent = (function (_super) {
    tslib_1.__extends(ServerEvent, _super);
    function ServerEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ServerEvent;
}(Event));
var ServerListeningEvent = (function (_super) {
    tslib_1.__extends(ServerListeningEvent, _super);
    function ServerListeningEvent(target, address) {
        var _this = _super.call(this, target, "listening") || this;
        _this.address = address;
        return _this;
    }
    return ServerListeningEvent;
}(ServerEvent));
var ServerErrorEvent = (function (_super) {
    tslib_1.__extends(ServerErrorEvent, _super);
    function ServerErrorEvent(target, error) {
        var _this = _super.call(this, target, "error") || this;
        _this.error = error;
        return _this;
    }
    return ServerErrorEvent;
}(ServerEvent));
var ServerDisconnectEvent = (function (_super) {
    tslib_1.__extends(ServerDisconnectEvent, _super);
    function ServerDisconnectEvent(target, remoteAddress, reasonCode, description) {
        var _this = _super.call(this, target, "close") || this;
        _this.remoteAddress = remoteAddress;
        _this.reasonCode = reasonCode;
        _this.description = description;
        return _this;
    }
    return ServerDisconnectEvent;
}(ServerEvent));
var ServerMessageEvent = (function (_super) {
    tslib_1.__extends(ServerMessageEvent, _super);
    function ServerMessageEvent(target, session, message, resolve, reject) {
        var _this = _super.call(this, target, "message") || this;
        _this.message = message;
        _this.session = session;
        _this.resolve = resolve;
        _this.reject = reject;
        return _this;
    }
    return ServerMessageEvent;
}(ServerEvent));
var Server = (function (_super) {
    tslib_1.__extends(Server, _super);
    function Server(options) {
        var _this = _super.call(this) || this;
        _this.info = {
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
        _this.sessions = [];
        _this.options = options;
        return _this;
    }
    Server.prototype.emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return _super.prototype.emit.apply(this, [event].concat(args));
    };
    Server.prototype.on = function (event, listener) {
        return _super.prototype.on.call(this, event, listener);
    };
    Server.prototype.once = function (event, listener) {
        return _super.prototype.once.call(this, event, listener);
    };
    Server.prototype.close = function (callback) {
        this.httpServer.close(callback);
    };
    Server.prototype.listen = function (address) {
        var _this = this;
        this.httpServer = https.createServer(this.options, function (request$$1, response) {
            (function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var requestUrl, bundle, preKey, info, json;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(request$$1.method === "GET")) return [3, 2];
                            requestUrl = url.parse(request$$1.url);
                            if (!(requestUrl.pathname === SERVER_WELL_KNOWN)) return [3, 2];
                            return [4, this.getRandomBundle(request$$1.headers.origin)];
                        case 1:
                            bundle = _a.sent();
                            preKey = pvtsutils.Convert.ToBase64(bundle);
                            info = pvtsutils.assign({}, this.info, { preKey: preKey });
                            json = JSON.stringify(info);
                            response.setHeader("content-length", json.length.toString());
                            response.setHeader("Access-Control-Allow-Origin", "*");
                            response.end(json);
                            _a.label = 2;
                        case 2:
                            response.end();
                            return [2];
                    }
                });
            }); })();
        });
        var splitAddress = address.split(":");
        this.httpServer
            .listen(parseInt(splitAddress[1], 10), splitAddress[0], function () {
            (function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this;
                            return [4, OpenSSLStorage.create()];
                        case 1:
                            _a.storage = _b.sent();
                            this.emit("listening", new ServerListeningEvent(this, address));
                            return [2];
                    }
                });
            }); })();
        })
            .on("error", function (err) {
            _this.emit("error", new ServerErrorEvent(_this, err));
        });
        this.socketServer = new WebSocket.server({
            httpServer: this.httpServer,
            autoAcceptConnections: false,
            maxReceivedFrameSize: 128 * 1024 * 1024,
            maxReceivedMessageSize: 128 * 1024 * 1024,
        });
        this.socketServer.on("request", function (request$$1) {
            var connection = request$$1.accept(null, request$$1.origin);
            var session = {
                headers: request$$1.httpRequest.headers,
                connection: connection,
                cipher: null,
                authorized: false,
                identity: null,
            };
            _this.sessions.push(session);
            _this.emit("connect", session);
            connection.on("message", function (message) {
                if (message.type === "utf8") {
                    _this.emit("error", new ServerErrorEvent(_this, new WebCryptoLocalError(WebCryptoLocalError.CODE.SERVER_WRONG_MESSAGE, "Received UTF8 message: " + message.utf8Data)));
                }
                else if (message.type === "binary") {
                    (function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        var buffer, messageProto, err_1, preKeyProto, _a, _b, ok, err_2, decryptedMessage, actionProto;
                        return tslib_1.__generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    buffer = new Uint8Array(message.binaryData).buffer;
                                    _c.label = 1;
                                case 1:
                                    _c.trys.push([1, 3, , 14]);
                                    return [4, _2keyRatchet.MessageSignedProtocol.importProto(buffer)];
                                case 2:
                                    messageProto = _c.sent();
                                    return [3, 14];
                                case 3:
                                    err_1 = _c.sent();
                                    _c.label = 4;
                                case 4:
                                    _c.trys.push([4, 12, , 13]);
                                    this.emit("info", "Cannot parse MessageSignedProtocol");
                                    return [4, _2keyRatchet.PreKeyMessageProtocol.importProto(buffer)];
                                case 5:
                                    preKeyProto = _c.sent();
                                    messageProto = preKeyProto.signedMessage;
                                    _a = session;
                                    return [4, this.storage.getIdentity(request$$1.origin)];
                                case 6:
                                    _a.identity = _c.sent();
                                    _b = session;
                                    return [4, _2keyRatchet.AsymmetricRatchet.create(session.identity, preKeyProto)];
                                case 7:
                                    _b.cipher = _c.sent();
                                    return [4, this.storage.isTrusted(session.cipher.remoteIdentity)];
                                case 8:
                                    ok = _c.sent();
                                    if (!!ok) return [3, 9];
                                    session.authorized = false;
                                    return [3, 11];
                                case 9:
                                    session.authorized = true;
                                    return [4, this.storage.saveSession(session.cipher.remoteIdentity.signingKey.id, session.cipher)];
                                case 10:
                                    _c.sent();
                                    _c.label = 11;
                                case 11: return [3, 13];
                                case 12:
                                    err_2 = _c.sent();
                                    throw err_2;
                                case 13: return [3, 14];
                                case 14:
                                    if (!session.cipher) {
                                        throw new WebCryptoLocalError(WebCryptoLocalError.CODE.SERVER_WRONG_MESSAGE, "Cipher object for 2key session is empty");
                                    }
                                    return [4, session.cipher.decrypt(messageProto)];
                                case 15:
                                    decryptedMessage = _c.sent();
                                    return [4, ActionProto.importProto(decryptedMessage)];
                                case 16:
                                    actionProto = _c.sent();
                                    return [2, new Promise(function (resolve, reject) {
                                            if (session.authorized ||
                                                actionProto.action === ServerIsLoggedInActionProto.ACTION ||
                                                actionProto.action === ServerLoginActionProto.ACTION) {
                                                (function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                                    var sessionIdentitySHA256;
                                                    return tslib_1.__generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0: return [4, session.cipher.remoteIdentity.signingKey.thumbprint()];
                                                            case 1:
                                                                sessionIdentitySHA256 = _a.sent();
                                                                this.emit("info", "Server: session:" + sessionIdentitySHA256 + " " + actionProto.action);
                                                                this.emit("message", new ServerMessageEvent(this, session, actionProto, resolve, reject));
                                                                return [2];
                                                        }
                                                    });
                                                }); })()
                                                    .catch(function (err) {
                                                    _this.emit("error", err);
                                                });
                                            }
                                            else {
                                                throw new WebCryptoLocalError(WebCryptoLocalError.CODE.SERVER_NOT_LOGGED_IN, "404: Not authorized");
                                            }
                                        })
                                            .then(function (answer) {
                                            answer.status = true;
                                            return _this.send(session, answer);
                                        })
                                            .catch(function (e) {
                                            (function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                                var resultProto;
                                                return tslib_1.__generator(this, function (_a) {
                                                    resultProto = new ResultProto(actionProto);
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
                                                    return [2];
                                                });
                                            }); })();
                                        })];
                            }
                        });
                    }); })().catch(function (e) {
                        _this.emit("error", new ServerErrorEvent(_this, e));
                    });
                }
            });
            connection.on("close", function (reasonCode, description) {
                _this.sessions = _this.sessions.filter(function (session2) { return session2.connection !== connection; });
                _this.emit("disconnect", new ServerDisconnectEvent(_this, connection.remoteAddress, reasonCode, description));
            });
        });
        return this;
    };
    Server.prototype.send = function (session, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var buf, encryptedData, e_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        buf = void 0;
                        if (!(data instanceof ArrayBuffer)) return [3, 1];
                        buf = data;
                        return [3, 3];
                    case 1: return [4, data.exportProto()];
                    case 2:
                        buf = _a.sent();
                        _a.label = 3;
                    case 3: return [4, session.cipher.encrypt(buf)];
                    case 4:
                        encryptedData = _a.sent();
                        return [4, encryptedData.exportProto()];
                    case 5:
                        buf = _a.sent();
                        session.connection.sendBytes(new Buffer(buf));
                        return [3, 7];
                    case 6:
                        e_1 = _a.sent();
                        this.emit("error", e_1);
                        return [3, 7];
                    case 7: return [2];
                }
            });
        });
    };
    Server.prototype.getRandomBundle = function (origin) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var preKeyBundle, identity, preKeyId, preKey, raw;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        preKeyBundle = new _2keyRatchet.PreKeyBundleProtocol();
                        return [4, this.storage.getIdentity(origin)];
                    case 1:
                        identity = _a.sent();
                        return [4, preKeyBundle.identity.fill(identity)];
                    case 2:
                        _a.sent();
                        preKeyId = getRandomInt(1, identity.signedPreKeys.length) - 1;
                        preKey = identity.signedPreKeys[preKeyId];
                        preKeyBundle.preKeySigned.id = preKeyId;
                        preKeyBundle.preKeySigned.key = preKey.publicKey;
                        return [4, preKeyBundle.preKeySigned.sign(identity.signingKey.privateKey)];
                    case 3:
                        _a.sent();
                        preKeyBundle.registrationId = 0;
                        return [4, preKeyBundle.exportProto()];
                    case 4:
                        raw = _a.sent();
                        return [2, raw];
                }
            });
        });
    };
    return Server;
}(events.EventEmitter));
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
}
function createError(message) {
    var p11Reg = /(CKR_\w+):(\d+)/;
    var p11 = p11Reg.exec(message);
    if (p11) {
        return new ErrorProto(p11[1], parseInt(p11[2], 10), "pkcs11");
    }
    else {
        return new ErrorProto(message);
    }
}

var ProviderCryptoProto = (function (_super) {
    tslib_1.__extends(ProviderCryptoProto, _super);
    function ProviderCryptoProto(data) {
        var _this = _super.call(this) || this;
        if (data) {
            pvtsutils.assign(_this, data);
        }
        return _this;
    }
    ProviderCryptoProto_1 = ProviderCryptoProto;
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
    return ProviderCryptoProto;
    var ProviderCryptoProto_1;
}(BaseProto));
var ProviderInfoProto = (function (_super) {
    tslib_1.__extends(ProviderInfoProto, _super);
    function ProviderInfoProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProviderInfoProto_1 = ProviderInfoProto;
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
    return ProviderInfoProto;
    var ProviderInfoProto_1;
}(BaseProto));
var ProviderInfoActionProto = (function (_super) {
    tslib_1.__extends(ProviderInfoActionProto, _super);
    function ProviderInfoActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProviderInfoActionProto.INDEX = ActionProto.INDEX;
    ProviderInfoActionProto.ACTION = "provider/action/info";
    ProviderInfoActionProto = tslib_1.__decorate([
        tsprotobuf.ProtobufElement({})
    ], ProviderInfoActionProto);
    return ProviderInfoActionProto;
}(ActionProto));
var ProviderGetCryptoActionProto = (function (_super) {
    tslib_1.__extends(ProviderGetCryptoActionProto, _super);
    function ProviderGetCryptoActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProviderGetCryptoActionProto_1 = ProviderGetCryptoActionProto;
    ProviderGetCryptoActionProto.INDEX = ActionProto.INDEX;
    ProviderGetCryptoActionProto.ACTION = "provider/action/getCrypto";
    tslib_1.__decorate([
        tsprotobuf.ProtobufProperty({ id: ProviderGetCryptoActionProto_1.INDEX++, required: true, type: "string" })
    ], ProviderGetCryptoActionProto.prototype, "cryptoID", void 0);
    ProviderGetCryptoActionProto = ProviderGetCryptoActionProto_1 = tslib_1.__decorate([
        tsprotobuf.ProtobufElement({})
    ], ProviderGetCryptoActionProto);
    return ProviderGetCryptoActionProto;
    var ProviderGetCryptoActionProto_1;
}(ActionProto));
var ProviderAuthorizedEventProto = (function (_super) {
    tslib_1.__extends(ProviderAuthorizedEventProto, _super);
    function ProviderAuthorizedEventProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProviderAuthorizedEventProto.INDEX = ActionProto.INDEX;
    ProviderAuthorizedEventProto.ACTION = "provider/event/authorized";
    ProviderAuthorizedEventProto = tslib_1.__decorate([
        tsprotobuf.ProtobufElement({})
    ], ProviderAuthorizedEventProto);
    return ProviderAuthorizedEventProto;
}(ActionProto));
var ProviderTokenEventProto = (function (_super) {
    tslib_1.__extends(ProviderTokenEventProto, _super);
    function ProviderTokenEventProto(data) {
        var _this = _super.call(this) || this;
        if (data) {
            pvtsutils.assign(_this, data);
        }
        return _this;
    }
    ProviderTokenEventProto_1 = ProviderTokenEventProto;
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
    return ProviderTokenEventProto;
    var ProviderTokenEventProto_1;
}(ActionProto));

var CardReaderActionProto = (function (_super) {
    tslib_1.__extends(CardReaderActionProto, _super);
    function CardReaderActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CardReaderActionProto.INDEX = ActionProto.INDEX;
    CardReaderActionProto.ACTION = "cardReader";
    CardReaderActionProto = tslib_1.__decorate([
        tsprotobuf.ProtobufElement({})
    ], CardReaderActionProto);
    return CardReaderActionProto;
}(ActionProto));
var CardReaderGetReadersActionProto = (function (_super) {
    tslib_1.__extends(CardReaderGetReadersActionProto, _super);
    function CardReaderGetReadersActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CardReaderGetReadersActionProto.INDEX = ActionProto.INDEX;
    CardReaderGetReadersActionProto.ACTION = "cardReader/readers";
    CardReaderGetReadersActionProto = tslib_1.__decorate([
        tsprotobuf.ProtobufElement({})
    ], CardReaderGetReadersActionProto);
    return CardReaderGetReadersActionProto;
}(ActionProto));
var CardReaderEventProto = (function (_super) {
    tslib_1.__extends(CardReaderEventProto, _super);
    function CardReaderEventProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CardReaderEventProto_1 = CardReaderEventProto;
    CardReaderEventProto.fromObject = function (e) {
        var res = new this();
        res.fromObject(e);
        return res;
    };
    CardReaderEventProto.prototype.fromObject = function (e) {
        this.reader = e.reader.name;
        this.atr = e.atr.toString("hex");
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
    return CardReaderEventProto;
    var CardReaderEventProto_1;
}(CardReaderActionProto));
var CardReaderInsertEventProto = (function (_super) {
    tslib_1.__extends(CardReaderInsertEventProto, _super);
    function CardReaderInsertEventProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CardReaderInsertEventProto.INDEX = CardReaderEventProto.INDEX;
    CardReaderInsertEventProto.ACTION = CardReaderEventProto.ACTION + "/insert";
    CardReaderInsertEventProto = tslib_1.__decorate([
        tsprotobuf.ProtobufElement({})
    ], CardReaderInsertEventProto);
    return CardReaderInsertEventProto;
}(CardReaderEventProto));
var CardReaderRemoveEventProto = (function (_super) {
    tslib_1.__extends(CardReaderRemoveEventProto, _super);
    function CardReaderRemoveEventProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CardReaderRemoveEventProto.INDEX = CardReaderEventProto.INDEX;
    CardReaderRemoveEventProto.ACTION = CardReaderEventProto.ACTION + "/remove";
    CardReaderRemoveEventProto = tslib_1.__decorate([
        tsprotobuf.ProtobufElement({})
    ], CardReaderRemoveEventProto);
    return CardReaderRemoveEventProto;
}(CardReaderEventProto));

var DEFAULT_HASH_ALG = "sha256";
var PV_PKCS11_LIB = "";
if (process.versions.electron) {
    var libName = "";
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
            PV_PKCS11_LIB = "/github/PeculiarVentures/pvpkcs11/build/Debug/pvpkcs11.dll";
            break;
        case "darwin":
            PV_PKCS11_LIB = "/Users/microshine/Library/Developer/Xcode/DerivedData/config-hkruqzwffnciyjeujlpxkaxbdiun/Build/Products/Debug/libpvpkcs11.dylib";
            break;
        default:
            PV_PKCS11_LIB = "/usr/local/lib/softhsm/libsofthsm2.so";
    }
}

var pcsc = require("pcsclite");
var PCSCWatcher = (function (_super) {
    tslib_1.__extends(PCSCWatcher, _super);
    function PCSCWatcher() {
        var _this = _super.call(this) || this;
        _this.readers = [];
        _this.pcsc = null;
        return _this;
    }
    PCSCWatcher.prototype.start = function () {
        var _this = this;
        try {
            this.pcsc = pcsc();
            this.pcsc.on("error", function (err) {
                _this.emit("error", err);
            });
            this.pcsc.on("reader", function (reader) {
                _this.emit("info", "PCSCWatcher: New reader detected " + reader.name);
                _this.readers.push(reader);
                var atr;
                reader.state = 0;
                reader.on("error", function (err) {
                    _this.emit("error", err);
                });
                reader.on("status", function (status) {
                    var changes = reader.state ^ status.state;
                    if (changes) {
                        if ((changes & reader.SCARD_STATE_EMPTY) && (status.state & reader.SCARD_STATE_EMPTY)) {
                            if (atr) {
                                var event = {
                                    reader: reader,
                                    atr: atr,
                                };
                                _this.emit("remove", event);
                                atr = null;
                            }
                        }
                        else if ((changes & reader.SCARD_STATE_PRESENT) && (status.state & reader.SCARD_STATE_PRESENT)) {
                            var event_1 = {
                                reader: reader,
                            };
                            if (status.atr && status.atr.byteLength) {
                                atr = status.atr;
                                event_1.atr = atr;
                            }
                            _this.emit("info", "PCSCWatcher:Insert reader:'" + reader.name + "' ATR:" + (atr && atr.toString("hex")));
                            setTimeout(function () {
                                _this.emit("insert", event_1);
                            }, 1e3);
                        }
                    }
                });
                reader.on("end", function () {
                    if (atr) {
                        var event = {
                            reader: reader,
                            atr: atr,
                        };
                        _this.emit("remove", event);
                        atr = null;
                    }
                });
            });
        }
        catch (err) {
            this.emit("error", new WebCryptoLocalError(WebCryptoLocalError.CODE.PCSC_CANNOT_START));
        }
        return this;
    };
    PCSCWatcher.prototype.stop = function () {
        if (this.pcsc) {
            this.pcsc.close();
            this.pcsc = null;
        }
    };
    PCSCWatcher.prototype.on = function (event, cb) {
        return _super.prototype.on.call(this, event, cb);
    };
    return PCSCWatcher;
}(events.EventEmitter));
var CardConfig = (function () {
    function CardConfig() {
        this.cards = {};
    }
    CardConfig.readFile = function (fPath) {
        var res = new this();
        res.readFile(fPath);
        return res;
    };
    CardConfig.prototype.readFile = function (fPath) {
        if (!fs.existsSync(fPath)) {
            throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CARD_CONFIG_COMMON, "Cannot find file '" + fPath + "'");
        }
        var data = fs.readFileSync(fPath);
        var json;
        try {
            json = JSON.parse(data.toString());
        }
        catch (err) {
            throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CARD_CONFIG_COMMON, "Cannot parse JSON file");
        }
        this.fromJSON(json);
    };
    CardConfig.prototype.getItem = function (atr) {
        return this.cards[atr.toString("hex")] || null;
    };
    CardConfig.prototype.fromJSON = function (json) {
        var cards = {};
        var drivers = {};
        json.drivers.forEach(function (jsonDriver) {
            var file = jsonDriver.file, driverProps = tslib_1.__rest(jsonDriver, ["file"]);
            var driver = driverProps;
            drivers[jsonDriver.id] = driver;
            var system;
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
            var library = [];
            var driverLib = jsonDriver.file[system];
            if (driverLib) {
                if (typeof driverLib === "string") {
                    library = [driverLib];
                }
                else {
                    if (process.arch === "x64") {
                        if (driverLib.x64) {
                            library.push(driverLib.x64);
                        }
                        if (driverLib.x86) {
                            library.push(driverLib.x86);
                        }
                    }
                    else {
                        if (driverLib.x86) {
                            library.push(driverLib.x86);
                        }
                    }
                }
            }
            if (os.platform() === "win32") {
                library.push(PV_PKCS11_LIB);
            }
            driver.libraries = library.map(function (lib) {
                var res = replaceTemplates(lib, process.env, "%");
                if (json.vars) {
                    res = replaceTemplates(lib, json.vars, "<");
                }
                return path.normalize(res);
            });
        });
        json.cards.forEach(function (item) {
            var card = {};
            card.atr = new Buffer(item.atr, "hex");
            if (item.mask) {
                card.mask = new Buffer(item.mask);
            }
            card.name = item.name;
            card.readOnly = !!item.readOnly;
            var driver = drivers[item.driver];
            if (!driver) {
                throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CARD_CONFIG_COMMON, "Cannot find driver for card " + item.name + " (" + item.atr + ")");
            }
            if (driver.libraries.length) {
                card.libraries = driver.libraries;
                cards[card.atr.toString("hex")] = card;
            }
        });
        this.cards = cards;
    };
    return CardConfig;
}());
var CardWatcher = (function (_super) {
    tslib_1.__extends(CardWatcher, _super);
    function CardWatcher() {
        var _this = _super.call(this) || this;
        _this.cards = [];
        _this.config = new CardConfig();
        _this.watcher = new PCSCWatcher();
        _this.watcher
            .on("info", function (message) {
            _this.emit("info", message);
        })
            .on("error", function (err) {
            _this.emit("error", err);
        })
            .on("insert", function (e) {
            try {
                var card = _this.config.getItem(e.atr);
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
                    _this.add(card);
                    _this.emit("insert", card);
                }
                else {
                    _this.emit("new", {
                        reader: e.reader.name,
                        atr: e.atr,
                    });
                }
            }
            catch (e) {
                _this.emit("error", e);
            }
        })
            .on("remove", function (e) {
            try {
                var card = _this.config.getItem(e.atr);
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
                    _this.remove(card);
                    _this.emit("remove", card);
                }
            }
            catch (e) {
                _this.emit("error", e);
            }
        });
        return _this;
    }
    CardWatcher.prototype.on = function (event, cb) {
        return _super.prototype.on.call(this, event, cb);
    };
    CardWatcher.prototype.start = function (config) {
        try {
            this.config = CardConfig.readFile(config);
        }
        catch (e) {
            this.emit("error", e.message);
        }
        this.watcher.start();
    };
    CardWatcher.prototype.stop = function () {
        this.watcher.stop();
    };
    CardWatcher.prototype.add = function (card) {
        if (!this.cards.some(function (item) { return item === card; })) {
            this.cards.push(card);
        }
    };
    CardWatcher.prototype.remove = function (card) {
        this.cards = this.cards.filter(function (item) { return item !== card; });
    };
    return CardWatcher;
}(events.EventEmitter));
function replaceTemplates(text, args, prefix) {
    var envReg = new RegExp("\\" + prefix + "([\\w\\d\\(\\)\\-\\_]+)", "gi");
    var res;
    var resText = text;
    while (res = envReg.exec(text)) {
        var argsName = res[1];
        var argsValue = null;
        for (var key in args) {
            if (key.toLowerCase() === argsName.toLowerCase()) {
                argsValue = args[key];
                break;
            }
        }
        if (argsValue) {
            resText = resText.replace(new RegExp("\\" + prefix + argsName.replace(/([\(\)])/g, "\\$1"), "i"), argsValue);
        }
    }
    return resText;
}

var Service = (function (_super) {
    tslib_1.__extends(Service, _super);
    function Service(server, object, filter) {
        if (filter === void 0) { filter = []; }
        var _this = _super.call(this) || this;
        _this.services = [];
        _this.server = server;
        _this.object = object;
        _this.server
            .on("message", function (e) {
            if (filter.some(function (item) { return item.ACTION === e.message.action; })) {
                _this.onMessage(e.session, e.message)
                    .then(e.resolve, e.reject);
            }
        });
        if (!(_this.object instanceof Service)) {
            _this.object
                .on("info", function (message) {
                _this.emit("info", message);
            })
                .on("error", function (error) {
                _this.emit("error", error);
            });
        }
        return _this;
    }
    Service.prototype.addService = function (service) {
        var _this = this;
        this.services.push(service);
        service
            .on("info", function (message) {
            _this.emit("info", message);
        })
            .on("error", function (error) {
            _this.emit("error", error);
        });
    };
    Service.prototype.emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return _super.prototype.emit.apply(this, [event].concat(args));
    };
    Service.prototype.on = function (event, cb) {
        return _super.prototype.on.call(this, event, cb);
    };
    Service.prototype.once = function (event, cb) {
        return _super.prototype.once.call(this, event, cb);
    };
    return Service;
}(events.EventEmitter));

var CardReaderService = (function (_super) {
    tslib_1.__extends(CardReaderService, _super);
    function CardReaderService(server) {
        var _this = _super.call(this, server, new PCSCWatcher(), [
            CardReaderGetReadersActionProto,
        ]) || this;
        _this.object.on("insert", _this.onInsert.bind(_this));
        _this.object.on("remove", _this.onRemove.bind(_this));
        return _this;
    }
    CardReaderService.prototype.start = function () {
        this.object.start();
    };
    CardReaderService.prototype.stop = function () {
        this.object.stop();
    };
    CardReaderService.prototype.on = function (event, cb) {
        return _super.prototype.on.call(this, event, cb);
    };
    CardReaderService.prototype.once = function (event, cb) {
        return _super.prototype.once.call(this, event, cb);
    };
    CardReaderService.prototype.onInsert = function (e) {
        var _this = this;
        this.server.sessions.forEach(function (session) {
            if (session.authorized) {
                var eventProto = CardReaderInsertEventProto.fromObject(e);
                _this.server.send(session, eventProto);
            }
        });
    };
    CardReaderService.prototype.onRemove = function (e) {
        var _this = this;
        this.server.sessions.forEach(function (session) {
            if (session.authorized) {
                var eventProto = CardReaderRemoveEventProto.fromObject(e);
                _this.server.send(session, eventProto);
            }
        });
    };
    CardReaderService.prototype.onMessage = function (session, action) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result;
            return tslib_1.__generator(this, function (_a) {
                result = new ResultProto(action);
                switch (action.action) {
                    case CardReaderGetReadersActionProto.ACTION: {
                        result.data = pvtsutils.Convert.FromString(JSON.stringify(this.object.readers));
                        break;
                    }
                    default:
                        throw new WebCryptoLocalError(WebCryptoLocalError.CODE.ACTION_NOT_IMPLEMENTED, "Action '" + action.action + "' is not implemented");
                }
                return [2, result];
            });
        });
    };
    return CardReaderService;
}(Service));

var CryptoActionProto = (function (_super) {
    tslib_1.__extends(CryptoActionProto, _super);
    function CryptoActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CryptoActionProto_1 = CryptoActionProto;
    CryptoActionProto.INDEX = ActionProto.INDEX;
    CryptoActionProto.ACTION = "crypto";
    tslib_1.__decorate([
        tsprotobuf.ProtobufProperty({ id: CryptoActionProto_1.INDEX++, required: true, type: "string" })
    ], CryptoActionProto.prototype, "providerID", void 0);
    CryptoActionProto = CryptoActionProto_1 = tslib_1.__decorate([
        tsprotobuf.ProtobufElement({})
    ], CryptoActionProto);
    return CryptoActionProto;
    var CryptoActionProto_1;
}(ActionProto));
var LoginActionProto = (function (_super) {
    tslib_1.__extends(LoginActionProto, _super);
    function LoginActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LoginActionProto.INDEX = CryptoActionProto.INDEX;
    LoginActionProto.ACTION = "crypto/login";
    LoginActionProto = tslib_1.__decorate([
        tsprotobuf.ProtobufElement({})
    ], LoginActionProto);
    return LoginActionProto;
}(CryptoActionProto));
var LogoutActionProto = (function (_super) {
    tslib_1.__extends(LogoutActionProto, _super);
    function LogoutActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LogoutActionProto.INDEX = CryptoActionProto.INDEX;
    LogoutActionProto.ACTION = "crypto/logout";
    LogoutActionProto = tslib_1.__decorate([
        tsprotobuf.ProtobufElement({})
    ], LogoutActionProto);
    return LogoutActionProto;
}(CryptoActionProto));
var IsLoggedInActionProto = (function (_super) {
    tslib_1.__extends(IsLoggedInActionProto, _super);
    function IsLoggedInActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IsLoggedInActionProto.INDEX = CryptoActionProto.INDEX;
    IsLoggedInActionProto.ACTION = "crypto/isLoggedIn";
    IsLoggedInActionProto = tslib_1.__decorate([
        tsprotobuf.ProtobufElement({})
    ], IsLoggedInActionProto);
    return IsLoggedInActionProto;
}(CryptoActionProto));
var ResetActionProto = (function (_super) {
    tslib_1.__extends(ResetActionProto, _super);
    function ResetActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ResetActionProto.INDEX = CryptoActionProto.INDEX;
    ResetActionProto.ACTION = "crypto/reset";
    ResetActionProto = tslib_1.__decorate([
        tsprotobuf.ProtobufElement({})
    ], ResetActionProto);
    return ResetActionProto;
}(CryptoActionProto));

var CryptoCertificateProto = (function (_super) {
    tslib_1.__extends(CryptoCertificateProto, _super);
    function CryptoCertificateProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CryptoCertificateProto_1 = CryptoCertificateProto;
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
    return CryptoCertificateProto;
    var CryptoCertificateProto_1;
}(CryptoItemProto));
var CryptoX509CertificateProto = (function (_super) {
    tslib_1.__extends(CryptoX509CertificateProto, _super);
    function CryptoX509CertificateProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CryptoX509CertificateProto_1 = CryptoX509CertificateProto;
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
    return CryptoX509CertificateProto;
    var CryptoX509CertificateProto_1;
}(CryptoCertificateProto));
var CryptoX509CertificateRequestProto = (function (_super) {
    tslib_1.__extends(CryptoX509CertificateRequestProto, _super);
    function CryptoX509CertificateRequestProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CryptoX509CertificateRequestProto_1 = CryptoX509CertificateRequestProto;
    CryptoX509CertificateRequestProto.INDEX = CryptoCertificateProto.INDEX;
    tslib_1.__decorate([
        tsprotobuf.ProtobufProperty({ id: CryptoX509CertificateRequestProto_1.INDEX++, required: true, type: "string" })
    ], CryptoX509CertificateRequestProto.prototype, "subjectName", void 0);
    CryptoX509CertificateRequestProto = CryptoX509CertificateRequestProto_1 = tslib_1.__decorate([
        tsprotobuf.ProtobufElement({})
    ], CryptoX509CertificateRequestProto);
    return CryptoX509CertificateRequestProto;
    var CryptoX509CertificateRequestProto_1;
}(CryptoCertificateProto));
var ChainItemProto = (function (_super) {
    tslib_1.__extends(ChainItemProto, _super);
    function ChainItemProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChainItemProto_1 = ChainItemProto;
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
    return ChainItemProto;
    var ChainItemProto_1;
}(BaseProto));
var CertificateStorageGetChainResultProto = (function (_super) {
    tslib_1.__extends(CertificateStorageGetChainResultProto, _super);
    function CertificateStorageGetChainResultProto() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.items = [];
        return _this;
    }
    CertificateStorageGetChainResultProto_1 = CertificateStorageGetChainResultProto;
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
    return CertificateStorageGetChainResultProto;
    var CertificateStorageGetChainResultProto_1;
}(BaseProto));
var CertificateStorageSetItemActionProto = (function (_super) {
    tslib_1.__extends(CertificateStorageSetItemActionProto, _super);
    function CertificateStorageSetItemActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CertificateStorageSetItemActionProto_1 = CertificateStorageSetItemActionProto;
    CertificateStorageSetItemActionProto.INDEX = CryptoActionProto.INDEX;
    CertificateStorageSetItemActionProto.ACTION = "crypto/certificateStorage/setItem";
    tslib_1.__decorate([
        tsprotobuf.ProtobufProperty({ id: CertificateStorageSetItemActionProto_1.INDEX++, required: true, parser: CryptoCertificateProto })
    ], CertificateStorageSetItemActionProto.prototype, "item", void 0);
    CertificateStorageSetItemActionProto = CertificateStorageSetItemActionProto_1 = tslib_1.__decorate([
        tsprotobuf.ProtobufElement({})
    ], CertificateStorageSetItemActionProto);
    return CertificateStorageSetItemActionProto;
    var CertificateStorageSetItemActionProto_1;
}(CryptoActionProto));
var CertificateStorageGetItemActionProto = (function (_super) {
    tslib_1.__extends(CertificateStorageGetItemActionProto, _super);
    function CertificateStorageGetItemActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CertificateStorageGetItemActionProto_1 = CertificateStorageGetItemActionProto;
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
    return CertificateStorageGetItemActionProto;
    var CertificateStorageGetItemActionProto_1;
}(CryptoActionProto));
var CertificateStorageKeysActionProto = (function (_super) {
    tslib_1.__extends(CertificateStorageKeysActionProto, _super);
    function CertificateStorageKeysActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CertificateStorageKeysActionProto.INDEX = CryptoActionProto.INDEX;
    CertificateStorageKeysActionProto.ACTION = "crypto/certificateStorage/keys";
    CertificateStorageKeysActionProto = tslib_1.__decorate([
        tsprotobuf.ProtobufElement({})
    ], CertificateStorageKeysActionProto);
    return CertificateStorageKeysActionProto;
}(CryptoActionProto));
var CertificateStorageRemoveItemActionProto = (function (_super) {
    tslib_1.__extends(CertificateStorageRemoveItemActionProto, _super);
    function CertificateStorageRemoveItemActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CertificateStorageRemoveItemActionProto_1 = CertificateStorageRemoveItemActionProto;
    CertificateStorageRemoveItemActionProto.INDEX = CryptoActionProto.INDEX;
    CertificateStorageRemoveItemActionProto.ACTION = "crypto/certificateStorage/removeItem";
    tslib_1.__decorate([
        tsprotobuf.ProtobufProperty({ id: CertificateStorageRemoveItemActionProto_1.INDEX++, required: true, type: "string" })
    ], CertificateStorageRemoveItemActionProto.prototype, "key", void 0);
    CertificateStorageRemoveItemActionProto = CertificateStorageRemoveItemActionProto_1 = tslib_1.__decorate([
        tsprotobuf.ProtobufElement({})
    ], CertificateStorageRemoveItemActionProto);
    return CertificateStorageRemoveItemActionProto;
    var CertificateStorageRemoveItemActionProto_1;
}(CryptoActionProto));
var CertificateStorageClearActionProto = (function (_super) {
    tslib_1.__extends(CertificateStorageClearActionProto, _super);
    function CertificateStorageClearActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CertificateStorageClearActionProto.INDEX = CryptoActionProto.INDEX;
    CertificateStorageClearActionProto.ACTION = "crypto/certificateStorage/clear";
    CertificateStorageClearActionProto = tslib_1.__decorate([
        tsprotobuf.ProtobufElement({})
    ], CertificateStorageClearActionProto);
    return CertificateStorageClearActionProto;
}(CryptoActionProto));
var CertificateStorageImportActionProto = (function (_super) {
    tslib_1.__extends(CertificateStorageImportActionProto, _super);
    function CertificateStorageImportActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CertificateStorageImportActionProto_1 = CertificateStorageImportActionProto;
    CertificateStorageImportActionProto.INDEX = CryptoActionProto.INDEX;
    CertificateStorageImportActionProto.ACTION = "crypto/certificateStorage/import";
    tslib_1.__decorate([
        tsprotobuf.ProtobufProperty({ id: CertificateStorageImportActionProto_1.INDEX++, required: true, type: "string" })
    ], CertificateStorageImportActionProto.prototype, "type", void 0);
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
    return CertificateStorageImportActionProto;
    var CertificateStorageImportActionProto_1;
}(CryptoActionProto));
var CertificateStorageExportActionProto = (function (_super) {
    tslib_1.__extends(CertificateStorageExportActionProto, _super);
    function CertificateStorageExportActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CertificateStorageExportActionProto_1 = CertificateStorageExportActionProto;
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
    return CertificateStorageExportActionProto;
    var CertificateStorageExportActionProto_1;
}(CryptoActionProto));
var CertificateStorageIndexOfActionProto = (function (_super) {
    tslib_1.__extends(CertificateStorageIndexOfActionProto, _super);
    function CertificateStorageIndexOfActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CertificateStorageIndexOfActionProto_1 = CertificateStorageIndexOfActionProto;
    CertificateStorageIndexOfActionProto.INDEX = CryptoActionProto.INDEX;
    CertificateStorageIndexOfActionProto.ACTION = "crypto/certificateStorage/indexOf";
    tslib_1.__decorate([
        tsprotobuf.ProtobufProperty({ id: CertificateStorageIndexOfActionProto_1.INDEX++, required: true, parser: CryptoCertificateProto })
    ], CertificateStorageIndexOfActionProto.prototype, "item", void 0);
    CertificateStorageIndexOfActionProto = CertificateStorageIndexOfActionProto_1 = tslib_1.__decorate([
        tsprotobuf.ProtobufElement({})
    ], CertificateStorageIndexOfActionProto);
    return CertificateStorageIndexOfActionProto;
    var CertificateStorageIndexOfActionProto_1;
}(CryptoActionProto));
var CertificateStorageGetChainActionProto = (function (_super) {
    tslib_1.__extends(CertificateStorageGetChainActionProto, _super);
    function CertificateStorageGetChainActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CertificateStorageGetChainActionProto.INDEX = CryptoActionProto.INDEX;
    CertificateStorageGetChainActionProto.ACTION = "crypto/certificateStorage/getChain";
    tslib_1.__decorate([
        tsprotobuf.ProtobufProperty({ id: CertificateStorageSetItemActionProto.INDEX++, required: true, parser: CryptoCertificateProto })
    ], CertificateStorageGetChainActionProto.prototype, "item", void 0);
    CertificateStorageGetChainActionProto = tslib_1.__decorate([
        tsprotobuf.ProtobufElement({})
    ], CertificateStorageGetChainActionProto);
    return CertificateStorageGetChainActionProto;
}(CryptoActionProto));
var CertificateStorageGetCRLActionProto = (function (_super) {
    tslib_1.__extends(CertificateStorageGetCRLActionProto, _super);
    function CertificateStorageGetCRLActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CertificateStorageGetCRLActionProto_1 = CertificateStorageGetCRLActionProto;
    CertificateStorageGetCRLActionProto.INDEX = CryptoActionProto.INDEX;
    CertificateStorageGetCRLActionProto.ACTION = "crypto/certificateStorage/getCRL";
    tslib_1.__decorate([
        tsprotobuf.ProtobufProperty({ id: CertificateStorageGetCRLActionProto_1.INDEX++, required: true, type: "string" })
    ], CertificateStorageGetCRLActionProto.prototype, "url", void 0);
    CertificateStorageGetCRLActionProto = CertificateStorageGetCRLActionProto_1 = tslib_1.__decorate([
        tsprotobuf.ProtobufElement({})
    ], CertificateStorageGetCRLActionProto);
    return CertificateStorageGetCRLActionProto;
    var CertificateStorageGetCRLActionProto_1;
}(CryptoActionProto));
var OCSPRequestOptionsProto = (function (_super) {
    tslib_1.__extends(OCSPRequestOptionsProto, _super);
    function OCSPRequestOptionsProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OCSPRequestOptionsProto_1 = OCSPRequestOptionsProto;
    OCSPRequestOptionsProto.INDEX = BaseProto.INDEX;
    tslib_1.__decorate([
        tsprotobuf.ProtobufProperty({ id: OCSPRequestOptionsProto_1.INDEX++, required: false, type: "string", defaultValue: "get" })
    ], OCSPRequestOptionsProto.prototype, "method", void 0);
    OCSPRequestOptionsProto = OCSPRequestOptionsProto_1 = tslib_1.__decorate([
        tsprotobuf.ProtobufElement({})
    ], OCSPRequestOptionsProto);
    return OCSPRequestOptionsProto;
    var OCSPRequestOptionsProto_1;
}(BaseProto));
var CertificateStorageGetOCSPActionProto = (function (_super) {
    tslib_1.__extends(CertificateStorageGetOCSPActionProto, _super);
    function CertificateStorageGetOCSPActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CertificateStorageGetOCSPActionProto_1 = CertificateStorageGetOCSPActionProto;
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
    return CertificateStorageGetOCSPActionProto;
    var CertificateStorageGetOCSPActionProto_1;
}(CryptoActionProto));

function digest(alg, data) {
    var hash = crypto.createHash(alg);
    hash.update(data);
    return hash.digest();
}

var ServiceCryptoItem = (function () {
    function ServiceCryptoItem(item, providerID) {
        var p11Object = item.p11Object;
        var id = "" + providerID + p11Object.session.handle.toString() + p11Object.handle.toString() + item.type + item.id;
        this.id = digest(DEFAULT_HASH_ALG, id).toString("hex");
        this.item = item;
        this.providerID = providerID;
    }
    ServiceCryptoItem.prototype.toKeyProto = function (item) {
        var itemProto = new CryptoKeyProto();
        itemProto.providerID = this.providerID;
        itemProto.id = this.id;
        itemProto.algorithm.fromAlgorithm(item.algorithm);
        itemProto.extractable = item.extractable;
        itemProto.type = item.type;
        itemProto.usages = item.usages;
        return itemProto;
    };
    ServiceCryptoItem.prototype.toX509Proto = function (item) {
        var itemProto = new CryptoX509CertificateProto();
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
    };
    ServiceCryptoItem.prototype.toX509RequestProto = function (item) {
        var itemProto = new CryptoX509CertificateRequestProto();
        itemProto.providerID = this.providerID;
        itemProto.publicKey = this.toKeyProto(item.publicKey);
        itemProto.id = itemProto.publicKey.id;
        itemProto.subjectName = item.subjectName;
        itemProto.type = item.type;
        return itemProto;
    };
    ServiceCryptoItem.prototype.toProto = function () {
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
                throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CARD_CONFIG_COMMON, "Unsupported CertificateItem type '" + this.item.type + "'");
        }
    };
    return ServiceCryptoItem;
}());

var MemoryStorage = (function () {
    function MemoryStorage() {
        this.items = {};
    }
    Object.defineProperty(MemoryStorage.prototype, "length", {
        get: function () {
            return Object.keys(this.items).length;
        },
        enumerable: true,
        configurable: true
    });
    MemoryStorage.prototype.item = function (id) {
        var result = this.items[id];
        if (!result) {
            throw new WebCryptoLocalError(WebCryptoLocalError.CODE.MEMORY_STORAGE_OUT_OF_INDEX, "Cannot get crypto item by ID '" + id + "'");
        }
        return result;
    };
    MemoryStorage.prototype.hasItem = function (param) {
        if (param instanceof ServiceCryptoItem) {
            return !!this.items[param.id];
        }
        else {
            return !!this.items[param];
        }
    };
    MemoryStorage.prototype.add = function (item) {
        this.items[item.id] = item;
    };
    MemoryStorage.prototype.remove = function (param) {
        if (param instanceof ServiceCryptoItem) {
            delete this.items[param.id];
        }
        else {
            delete this.items[param];
        }
    };
    MemoryStorage.prototype.removeAll = function () {
        this.items = {};
    };
    MemoryStorage.prototype.removeByProvider = function (providerID) {
        var _this = this;
        var IDs = [];
        for (var id in this.items) {
            var item = this.items[id];
            if (item.providerID === providerID) {
                IDs.push(id);
            }
        }
        IDs.forEach(function (id) {
            _this.remove(id);
        });
    };
    return MemoryStorage;
}());

var Map = (function (_super) {
    tslib_1.__extends(Map, _super);
    function Map() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.items = {};
        return _this;
    }
    Object.defineProperty(Map.prototype, "length", {
        get: function () {
            return Object.keys(this.items).length;
        },
        enumerable: true,
        configurable: true
    });
    Map.prototype.indexOf = function (item) {
        var index = null;
        this.some(function (item2, index2) {
            if (item === item2) {
                index = index2;
                return true;
            }
            return false;
        });
        return index;
    };
    Map.prototype.on = function (event, callback) {
        return _super.prototype.on.call(this, event, callback);
    };
    Map.prototype.once = function (event, callback) {
        return _super.prototype.once.call(this, event, callback);
    };
    Map.prototype.emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return _super.prototype.emit.apply(this, [event].concat(args));
    };
    Map.prototype.add = function (key, item) {
        this.items[key] = item;
        this.emit("add", ({
            key: key,
            item: item,
        }));
    };
    Map.prototype.remove = function (key) {
        var item = this.items[key];
        delete this.items[key];
        this.emit("remove", ({
            key: key,
            item: item,
        }));
    };
    Map.prototype.clear = function () {
        var _this = this;
        this.forEach(function (item, index) {
            _this.remove(index);
        });
    };
    Map.prototype.item = function (id) {
        return this.items[id];
    };
    Map.prototype.forEach = function (callback) {
        for (var index in this.items) {
            callback(this.items[index], index, this);
        }
        return this;
    };
    Map.prototype.some = function (callback) {
        for (var index in this.items) {
            if (callback(this.items[index], index, this)) {
                return true;
            }
        }
        return false;
    };
    Map.prototype.map = function (callback) {
        var res = [];
        for (var index in this.items) {
            res.push(callback(this.items[index], index, this));
        }
        return res;
    };
    return Map;
}(events.EventEmitter));

var CryptoMap = (function (_super) {
    tslib_1.__extends(CryptoMap, _super);
    function CryptoMap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CryptoMap;
}(Map));

var crypto$2 = new (require("node-webcrypto-ossl"))();
var Certificate = (function () {
    function Certificate() {
    }
    Certificate.importCert = function (provider, rawData, algorithm, keyUsages) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var res;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        res = new this();
                        return [4, res.importCert(provider, rawData, algorithm, keyUsages)];
                    case 1:
                        _a.sent();
                        return [2, res];
                }
            });
        });
    };
    Certificate.prototype.exportRaw = function () {
        return this.raw.buffer;
    };
    Certificate.prototype.importCert = function (provider, rawData, algorithm, keyUsages) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.importRaw(rawData);
                        _a = this;
                        return [4, this.exportKey(provider, algorithm, keyUsages)];
                    case 1:
                        _a.publicKey = _c.sent();
                        _b = this;
                        return [4, this.getID(provider, "SHA-1")];
                    case 2:
                        _b.id = _c.sent();
                        return [2];
                }
            });
        });
    };
    Certificate.prototype.getID = function (provider, algorithm) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var publicKey, spki, sha1Hash, rnd;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.exportKey(provider)];
                    case 1:
                        publicKey = _a.sent();
                        return [4, provider.subtle.exportKey("spki", publicKey)];
                    case 2:
                        spki = _a.sent();
                        return [4, provider.subtle.digest("SHA-1", spki)];
                    case 3:
                        sha1Hash = _a.sent();
                        rnd = crypto$2.getRandomValues(new Uint8Array(4));
                        return [2, this.type + "-" + pvtsutils.Convert.ToHex(rnd) + "-" + pvtsutils.Convert.ToHex(sha1Hash)];
                }
            });
        });
    };
    return Certificate;
}());

var OID = {
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
function nameToString(name, splitter) {
    if (splitter === void 0) { splitter = ","; }
    var res = [];
    name.typesAndValues.forEach(function (typeValue) {
        var type = typeValue.type;
        var oidValue = OID[type.toString()];
        var oidName = oidValue && oidValue.short ? oidValue.short : type.toString();
        res.push(oidName + "=" + typeValue.value.valueBlock.value);
    });
    return res.join(splitter + " ");
}

var _a = require("pkijs"), CertificationRequest = _a.CertificationRequest, setEngine = _a.setEngine, CryptoEngine = _a.CryptoEngine;
var X509CertificateRequest = (function (_super) {
    tslib_1.__extends(X509CertificateRequest, _super);
    function X509CertificateRequest() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = "request";
        return _this;
    }
    Object.defineProperty(X509CertificateRequest.prototype, "subjectName", {
        get: function () {
            return nameToString(this.asn1.subject);
        },
        enumerable: true,
        configurable: true
    });
    X509CertificateRequest.prototype.importRaw = function (rawData) {
        if (rawData instanceof ArrayBuffer || (typeof Buffer !== "undefined" && Buffer.isBuffer(rawData))) {
            this.raw = new Uint8Array(rawData);
        }
        else {
            this.raw = new Uint8Array(rawData.buffer);
        }
        this.raw = new Uint8Array(rawData);
        var asn1 = asn1js.fromBER(this.raw.buffer);
        this.asn1 = new CertificationRequest({ schema: asn1.result });
    };
    X509CertificateRequest.prototype.exportKey = function (provider, algorithm, usages) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                setEngine("unknown", provider, new CryptoEngine({ name: "unknown", crypto: provider, subtle: provider.subtle }));
                return [2, this.asn1.getPublicKey(algorithm ? { algorithm: { algorithm: algorithm, usages: usages } } : null)
                        .then(function (key) {
                        return key;
                    })];
            });
        });
    };
    return X509CertificateRequest;
}(Certificate));

var pkijs = require("pkijs");
var setEngine$1 = pkijs.setEngine, CryptoEngine$1 = pkijs.CryptoEngine;
var PKICertificate = pkijs.Certificate;
var X509Certificate = (function (_super) {
    tslib_1.__extends(X509Certificate, _super);
    function X509Certificate() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = "x509";
        return _this;
    }
    Object.defineProperty(X509Certificate.prototype, "serialNumber", {
        get: function () {
            return pvtsutils.Convert.ToHex(new Uint8Array(this.asn1.serialNumber.valueBlock.valueHex));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(X509Certificate.prototype, "issuerName", {
        get: function () {
            return nameToString(this.asn1.issuer);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(X509Certificate.prototype, "subjectName", {
        get: function () {
            return nameToString(this.asn1.subject);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(X509Certificate.prototype, "notBefore", {
        get: function () {
            return this.asn1.notBefore.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(X509Certificate.prototype, "notAfter", {
        get: function () {
            return this.asn1.notAfter.value;
        },
        enumerable: true,
        configurable: true
    });
    X509Certificate.prototype.importRaw = function (rawData) {
        if (rawData instanceof ArrayBuffer || (typeof Buffer !== "undefined" && Buffer.isBuffer(rawData))) {
            this.raw = new Uint8Array(rawData);
        }
        else {
            this.raw = new Uint8Array(rawData.buffer);
        }
        this.raw = new Uint8Array(rawData);
        var asn1 = asn1js.fromBER(this.raw.buffer);
        this.asn1 = new PKICertificate({ schema: asn1.result });
    };
    X509Certificate.prototype.exportKey = function (provider, algorithm, usages) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                setEngine$1("unknown", provider, new CryptoEngine$1({ name: "unknown", crypto: provider, subtle: provider.subtle }));
                return [2, this.asn1.getPublicKey(algorithm ? { algorithm: { algorithm: algorithm, usages: usages } } : null)
                        .then(function (key) {
                        return key;
                    })];
            });
        });
    };
    return X509Certificate;
}(Certificate));

var crypto$3 = new (require("node-webcrypto-ossl"))();
var OpenSSLCertificateStorage = (function () {
    function OpenSSLCertificateStorage(file) {
        this.file = file;
    }
    OpenSSLCertificateStorage.prototype.exportCert = function (format, item) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (format) {
                    case "raw": {
                        return [2, item.exportRaw()];
                    }
                    case "pem": {
                        throw new WebCryptoLocalError(WebCryptoLocalError.CODE.UNKNOWN, "PEM format is not implemented");
                    }
                    default:
                        throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CASE_ERROR, "Unsupported format for CryptoCertificate. Must be 'raw' or 'pem'");
                }
                return [2];
            });
        });
    };
    OpenSSLCertificateStorage.prototype.importCert = function (type, data, algorithm, keyUsages) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var res, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = type;
                        switch (_a) {
                            case "x509": return [3, 1];
                            case "request": return [3, 3];
                        }
                        return [3, 5];
                    case 1: return [4, X509Certificate.importCert(crypto$3, data, algorithm, keyUsages)];
                    case 2:
                        res = _b.sent();
                        return [3, 6];
                    case 3: return [4, X509CertificateRequest.importCert(crypto$3, data, algorithm, keyUsages)];
                    case 4:
                        res = _b.sent();
                        return [3, 6];
                    case 5: throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CASE_ERROR, "Unsupported CertificateStorageItem type '" + type + "'");
                    case 6: return [2, res];
                }
            });
        });
    };
    OpenSSLCertificateStorage.prototype.keys = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var items;
            return tslib_1.__generator(this, function (_a) {
                items = this.readFile();
                return [2, Object.keys(items)];
            });
        });
    };
    OpenSSLCertificateStorage.prototype.setItem = function (item) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var certs, value;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        certs = this.readFile();
                        return [4, this.certToJson(item)];
                    case 1:
                        value = _a.sent();
                        certs[item.id] = value;
                        this.writeFile(certs);
                        return [2, item.id];
                }
            });
        });
    };
    OpenSSLCertificateStorage.prototype.indexOf = function (item) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var certs, _a, _b, _i, index, identity;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(item instanceof Certificate)) return [3, 5];
                        certs = this.readFile();
                        _a = [];
                        for (_b in certs)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3, 4];
                        index = _a[_i];
                        return [4, item.getID(crypto$3, "SHA-256")];
                    case 2:
                        identity = _c.sent();
                        if (index === identity) {
                            return [2, index];
                        }
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3, 1];
                    case 4: return [2, null];
                    case 5: throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CASE_ERROR, "Parameter is not OpenSSL CertificateItem");
                }
            });
        });
    };
    OpenSSLCertificateStorage.prototype.getItem = function (key) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var certs, value;
            return tslib_1.__generator(this, function (_a) {
                certs = this.readFile();
                value = certs[key];
                if (!value) {
                    return [2, null];
                }
                value.lastUsed = new Date().toISOString();
                this.writeFile(certs);
                return [2, this.certFromJson(value)];
            });
        });
    };
    OpenSSLCertificateStorage.prototype.removeItem = function (key) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var certs;
            return tslib_1.__generator(this, function (_a) {
                certs = this.readFile();
                delete certs[key];
                this.writeFile(certs);
                return [2];
            });
        });
    };
    OpenSSLCertificateStorage.prototype.clear = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.writeFile({});
                return [2];
            });
        });
    };
    OpenSSLCertificateStorage.prototype.certToJson = function (cert) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var date;
            return tslib_1.__generator(this, function (_a) {
                date = new Date().toISOString();
                return [2, {
                        algorithm: cert.publicKey.algorithm.toAlgorithm ? cert.publicKey.algorithm.toAlgorithm() : cert.publicKey.algorithm,
                        usages: cert.publicKey.usages,
                        type: cert.type,
                        createdAt: date,
                        lastUsed: date,
                        raw: pvtsutils.Convert.ToBase64(cert.exportRaw()),
                    }];
            });
        });
    };
    OpenSSLCertificateStorage.prototype.certFromJson = function (json) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2, this.importCert(json.type, pvtsutils.Convert.FromBase64(json.raw), json.algorithm, json.usages)];
            });
        });
    };
    OpenSSLCertificateStorage.prototype.readFile = function () {
        if (!fs.existsSync(this.file)) {
            return {};
        }
        var buf = fs.readFileSync(this.file);
        return JSON.parse(buf.toString());
    };
    OpenSSLCertificateStorage.prototype.writeFile = function (json) {
        var buf = new Buffer(JSON.stringify(json));
        fs.writeFileSync(this.file, buf, {
            encoding: "utf8",
            flag: "w+",
        });
    };
    return OpenSSLCertificateStorage;
}());

var crypto$4 = new (require("node-webcrypto-ossl"))();
var OpenSSLKeyStorage = (function () {
    function OpenSSLKeyStorage(file) {
        this.file = file;
    }
    OpenSSLKeyStorage.prototype.keys = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var keys;
            return tslib_1.__generator(this, function (_a) {
                keys = this.readFile();
                return [2, Object.keys(keys)];
            });
        });
    };
    OpenSSLKeyStorage.prototype.indexOf = function (item) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var keys, id;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        keys = this.readFile();
                        return [4, this.getID(item)];
                    case 1:
                        id = _a.sent();
                        if (id in keys) {
                            return [2, id];
                        }
                        return [2, null];
                }
            });
        });
    };
    OpenSSLKeyStorage.prototype.setItem = function (value) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var keys, id, _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        keys = this.readFile();
                        return [4, this.getID(value)];
                    case 1:
                        id = _c.sent();
                        _a = keys;
                        _b = id;
                        return [4, this.keyToJson(value)];
                    case 2:
                        _a[_b] = _c.sent();
                        this.writeFile(keys);
                        return [2, id];
                }
            });
        });
    };
    OpenSSLKeyStorage.prototype.getItem = function (key) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var keys, keyJson, res;
            return tslib_1.__generator(this, function (_a) {
                keys = this.readFile();
                keyJson = keys[key];
                if (!keyJson) {
                    return [2, null];
                }
                res = this.keyFromJson(keyJson);
                this.writeFile(keys);
                return [2, res];
            });
        });
    };
    OpenSSLKeyStorage.prototype.removeItem = function (key) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var keys;
            return tslib_1.__generator(this, function (_a) {
                keys = this.readFile();
                delete keys[key];
                this.writeFile(keys);
                return [2];
            });
        });
    };
    OpenSSLKeyStorage.prototype.clear = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.writeFile({});
                return [2];
            });
        });
    };
    OpenSSLKeyStorage.prototype.readFile = function () {
        if (!fs.existsSync(this.file)) {
            return {};
        }
        var buf = fs.readFileSync(this.file);
        return JSON.parse(buf.toString());
    };
    OpenSSLKeyStorage.prototype.writeFile = function (obj) {
        var buf = new Buffer(JSON.stringify(obj));
        fs.writeFileSync(this.file, buf, {
            encoding: "utf8",
            flag: "w+",
        });
    };
    OpenSSLKeyStorage.prototype.getID = function (key) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var nativeKey, id, _a, fn_1, hash, rnd;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        nativeKey = key.native;
                        _a = key.type;
                        switch (_a) {
                            case "secret": return [3, 1];
                            case "private": return [3, 3];
                            case "public": return [3, 3];
                        }
                        return [3, 5];
                    case 1: return [4, crypto$4.getRandomValues(new Uint8Array(20))];
                    case 2:
                        id = (_b.sent());
                        return [3, 6];
                    case 3:
                        fn_1 = nativeKey.exportSpki;
                        return [4, new Promise(function (resolve, reject) {
                                fn_1.call(nativeKey, function (err, data) {
                                    if (err) {
                                        reject(err);
                                    }
                                    else {
                                        resolve(data);
                                    }
                                });
                            })];
                    case 4:
                        id = _b.sent();
                        return [3, 6];
                    case 5: throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CASE_ERROR, "Unsupported type of CryptoKey '" + key.type + "'");
                    case 6: return [4, crypto$4.subtle.digest("SHA-1", id)];
                    case 7:
                        hash = _b.sent();
                        rnd = crypto$4.getRandomValues(new Uint8Array(4));
                        return [2, key.type + "-" + pvtsutils.Convert.ToHex(rnd) + "-" + pvtsutils.Convert.ToHex(hash)];
                }
            });
        });
    };
    OpenSSLKeyStorage.prototype.keyToJson = function (key) {
        return Promise.resolve()
            .then(function () {
            var nativeKey = key.native;
            var fn;
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
                    throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CASE_ERROR, "Unsupported type of CryptoKey '" + key.type + "'");
            }
            return new Promise(function (resolve, reject) {
                fn.call(nativeKey, function (err, data) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data);
                    }
                });
            });
        })
            .then(function (raw) {
            var json = {
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
    };
    OpenSSLKeyStorage.prototype.keyFromJson = function (obj) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var format;
            return tslib_1.__generator(this, function (_a) {
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
                        throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CASE_ERROR, "Unsupported type of CryptoKey '" + obj.type + "'");
                }
                obj.lastUsed = new Date().toISOString();
                return [2, crypto$4.subtle.importKey(format, new Buffer(obj.raw, "base64"), obj.algorithm, obj.extractable, obj.usages)];
            });
        });
    };
    return OpenSSLKeyStorage;
}());

var OSSLCrypto = require("node-webcrypto-ossl");
var OpenSSLCrypto = (function (_super) {
    tslib_1.__extends(OpenSSLCrypto, _super);
    function OpenSSLCrypto() {
        var _this = _super.call(this) || this;
        _this.info = {
            id: "61e5e90712ba8abfb6bde6b4504b54bf88d36d0c",
            slot: 0,
            name: "OpenSSL",
            reader: "OpenSSL",
            serialNumber: "61e5e90712ba8abfb6bde6b4504b54bf88d36d0c",
            isRemovable: false,
            isHardware: false,
            algorithms: [
                webcryptoCore.AlgorithmNames.Sha1,
                webcryptoCore.AlgorithmNames.Sha256,
                webcryptoCore.AlgorithmNames.Sha384,
                webcryptoCore.AlgorithmNames.Sha512,
                webcryptoCore.AlgorithmNames.RsaSSA,
                webcryptoCore.AlgorithmNames.RsaPSS,
                webcryptoCore.AlgorithmNames.RsaOAEP,
                webcryptoCore.AlgorithmNames.Hmac,
                webcryptoCore.AlgorithmNames.AesCBC,
                webcryptoCore.AlgorithmNames.AesGCM,
                webcryptoCore.AlgorithmNames.AesKW,
                webcryptoCore.AlgorithmNames.Pbkdf2,
                webcryptoCore.AlgorithmNames.EcDH,
                webcryptoCore.AlgorithmNames.EcDSA,
            ],
        };
        _this.keyStorage = new OpenSSLKeyStorage(OPENSSL_KEY_STORAGE_DIR + "/store.json");
        _this.certStorage = new OpenSSLCertificateStorage(OPENSSL_CERT_STORAGE_DIR + "/store.json");
        _this.isLoggedIn = true;
        return _this;
    }
    return OpenSSLCrypto;
}(OSSLCrypto));

function isOsslObject(obj) {
    return !!(obj && obj.__ossl);
}
function fixObject(crypto$$1, key, options) {
    var osslKey = key;
    var handle;
    if (options && options.handle) {
        handle = options.handle;
    }
    else {
        handle = new Buffer(4);
        handle.writeInt32LE(crypto$$1.getID(), 0);
    }
    osslKey.__ossl = true;
    osslKey.p11Object = {
        handle: handle,
        session: crypto$$1.session,
    };
    if (options && options.index) {
        osslKey.__index = options.index;
    }
}

var Pkcs11CertificateStorage = (function (_super) {
    tslib_1.__extends(Pkcs11CertificateStorage, _super);
    function Pkcs11CertificateStorage(crypto$$1) {
        return _super.call(this, crypto$$1) || this;
    }
    Pkcs11CertificateStorage.prototype.getItem = function (id, algorithm, usages) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var cert, err_1, object, type, err2_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 7]);
                        return [4, _super.prototype.getItem.call(this, id, algorithm, usages)];
                    case 1:
                        cert = _a.sent();
                        return [3, 7];
                    case 2:
                        err_1 = _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        object = this.getItemById(id).toType();
                        type = object instanceof graphene.X509Certificate ? "x509" : "request";
                        return [4, this.crypto.ossl.certStorage.importCert(type, object.value, algorithm, usages)];
                    case 4:
                        cert = _a.sent();
                        fixObject(this.crypto, cert, {
                            index: id,
                            handle: object.handle,
                        });
                        fixObject(this.crypto, cert.publicKey);
                        return [3, 6];
                    case 5:
                        err2_1 = _a.sent();
                        throw err_1;
                    case 6: return [3, 7];
                    case 7:
                        if (isOsslObject(cert)) {
                            cert.__index = id;
                        }
                        return [2, cert];
                }
            });
        });
    };
    Pkcs11CertificateStorage.prototype.importCert = function (type, data, algorithm, keyUsages) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var cert, err_2, e_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 7]);
                        return [4, _super.prototype.importCert.call(this, type, data, algorithm, keyUsages)];
                    case 1:
                        cert = _a.sent();
                        return [3, 7];
                    case 2:
                        err_2 = _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4, this.crypto.ossl.certStorage.importCert(type, data, algorithm, keyUsages)];
                    case 4:
                        cert = _a.sent();
                        fixObject(this.crypto, cert);
                        fixObject(this.crypto, cert.publicKey);
                        return [3, 6];
                    case 5:
                        e_1 = _a.sent();
                        throw err_2;
                    case 6: return [3, 7];
                    case 7: return [2, cert];
                }
            });
        });
    };
    Pkcs11CertificateStorage.prototype.exportCert = function (format, item) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                if (!isOsslObject(item)) {
                    return [2, _super.prototype.exportCert.call(this, format, item)];
                }
                else {
                    return [2, this.crypto.ossl.certStorage.exportCert(format, item)];
                }
                return [2];
            });
        });
    };
    Pkcs11CertificateStorage.prototype.indexOf = function (item) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                if (isOsslObject(item)) {
                    return [2, item.__index];
                }
                else {
                    return [2, _super.prototype.indexOf.call(this, item)];
                }
                return [2];
            });
        });
    };
    return Pkcs11CertificateStorage;
}(nodeWebcryptoP11.CertificateStorage));

var Pkcs11SubtleCrypto = (function (_super) {
    tslib_1.__extends(Pkcs11SubtleCrypto, _super);
    function Pkcs11SubtleCrypto(crypto$$1) {
        return _super.call(this, crypto$$1) || this;
    }
    Pkcs11SubtleCrypto.prototype.importKey = function (format, keyData, algorithm, extractable, keyUsages) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var key, err_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 4]);
                        return [4, _super.prototype.importKey.call(this, format, keyData, algorithm, extractable, keyUsages)];
                    case 1:
                        key = _a.sent();
                        return [3, 4];
                    case 2:
                        err_1 = _a.sent();
                        return [4, this.crypto.ossl.subtle.importKey(format, keyData, algorithm, extractable, keyUsages)];
                    case 3:
                        key = (_a.sent());
                        fixObject(this.crypto, key);
                        return [3, 4];
                    case 4: return [2, key];
                }
            });
        });
    };
    Pkcs11SubtleCrypto.prototype.verify = function (algorithm, key, signature, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                if (!isOsslObject(key)) {
                    return [2, _super.prototype.verify.call(this, algorithm, key, signature, data)];
                }
                else {
                    return [2, this.crypto.ossl.subtle.verify(algorithm, key, signature, data)];
                }
                return [2];
            });
        });
    };
    return Pkcs11SubtleCrypto;
}(nodeWebcryptoP11.SubtleCrypto));

var Pkcs11Crypto = (function (_super) {
    tslib_1.__extends(Pkcs11Crypto, _super);
    function Pkcs11Crypto(props) {
        var _this = _super.call(this, props) || this;
        _this.osslID = 0;
        _this.ossl = new OpenSSLCrypto();
        _this.subtle = new Pkcs11SubtleCrypto(_this);
        _this.certStorage = new Pkcs11CertificateStorage(_this);
        return _this;
    }
    Pkcs11Crypto.prototype.getID = function () {
        return ++this.osslID;
    };
    return Pkcs11Crypto;
}(nodeWebcryptoP11.WebCrypto));

graphene.registerAttribute("pinFriendlyName", 0x80000000 | 0x00000102, "string");
graphene.registerAttribute("pinDescription", 0x80000000 | 0x00000103, "string");
var PvKeyStorage = (function (_super) {
    tslib_1.__extends(PvKeyStorage, _super);
    function PvKeyStorage(crypto$$1) {
        return _super.call(this, crypto$$1) || this;
    }
    PvKeyStorage.prototype.setItem = function (key, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var template, obj;
            return tslib_1.__generator(this, function (_a) {
                if (!(key instanceof nodeWebcryptoP11.CryptoKey)) {
                    throw new webcryptoCore.WebCryptoError("Parameter 1 is not PKCS#11 CryptoKey");
                }
                if (!(this.hasItem(key) && key.key.token)) {
                    template = {
                        token: true,
                    };
                    if (key.type === "private" && options && os.platform() === "win32") {
                        if (options.pinFriendlyName) {
                            template.pinFriendlyName = options.pinFriendlyName;
                        }
                        if (options.pinDescription) {
                            template.pinDescription = options.pinDescription;
                        }
                    }
                    obj = this.crypto.session.copy(key.key, template);
                    return [2, nodeWebcryptoP11.CryptoKey.getID(obj.toType())];
                }
                else {
                    return [2, key.id];
                }
                return [2];
            });
        });
    };
    return PvKeyStorage;
}(nodeWebcryptoP11.KeyStorage));

var PvCrypto = (function (_super) {
    tslib_1.__extends(PvCrypto, _super);
    function PvCrypto(props) {
        var _this = _super.call(this, props) || this;
        _this.keyStorage = new PvKeyStorage(_this);
        return _this;
    }
    return PvCrypto;
}(nodeWebcryptoP11.WebCrypto));

var LocalProvider = (function (_super) {
    tslib_1.__extends(LocalProvider, _super);
    function LocalProvider(config) {
        var _this = _super.call(this) || this;
        _this.config = config;
        _this.cards = new CardWatcher();
        _this.crypto = new CryptoMap()
            .on("add", _this.onCryptoAdd.bind(_this))
            .on("remove", _this.onCryptoRemove.bind(_this));
        return _this;
    }
    LocalProvider.prototype.on = function (event, listener) {
        return _super.prototype.on.call(this, event, listener);
    };
    LocalProvider.prototype.once = function (event, listener) {
        return _super.prototype.once.call(this, event, listener);
    };
    LocalProvider.prototype.emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return _super.prototype.emit.apply(this, [event].concat(args));
    };
    LocalProvider.prototype.open = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            var EVENT_LOG, crypto$$1, _i, _a, prov, _b, _c, slot, crypto$$1, _d, _e;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        EVENT_LOG = "Provider:Open";
                        this.info = new ProviderInfoProto();
                        this.info.name = "WebcryptoLocal";
                        this.info.providers = [];
                        {
                            if (fs.existsSync(PV_PKCS11_LIB)) {
                                try {
                                    crypto$$1 = new PvCrypto({
                                        library: PV_PKCS11_LIB,
                                        slot: 0,
                                        readWrite: true,
                                    });
                                    crypto$$1.isLoggedIn = true;
                                    this.addProvider(crypto$$1);
                                }
                                catch (e) {
                                    this.emit("error", new WebCryptoLocalError(WebCryptoLocalError.CODE.PROVIDER_INIT, EVENT_LOG + " Cannot load library by path " + PV_PKCS11_LIB + ". " + e.message));
                                }
                            }
                            else {
                                this.emit("error", new WebCryptoLocalError(WebCryptoLocalError.CODE.PROVIDER_INIT, EVENT_LOG + " Cannot find pvpkcs11 by path " + PV_PKCS11_LIB));
                            }
                        }
                        this.config.providers = this.config.providers || [];
                        for (_i = 0, _a = this.config.providers; _i < _a.length; _i++) {
                            prov = _a[_i];
                            prov.slots = prov.slots || [0];
                            for (_b = 0, _c = prov.slots; _b < _c.length; _b++) {
                                slot = _c[_b];
                                if (fs.existsSync(prov.lib)) {
                                    try {
                                        crypto$$1 = new Pkcs11Crypto({
                                            library: prov.lib,
                                            slot: slot,
                                            readWrite: true,
                                        });
                                        this.addProvider(crypto$$1);
                                    }
                                    catch (err) {
                                        this.emit("error", new WebCryptoLocalError(WebCryptoLocalError.CODE.PROVIDER_INIT, EVENT_LOG + " Cannot load PKCS#11 library by path " + prov.lib + ". " + err.message));
                                    }
                                }
                                else {
                                    this.emit("error", new WebCryptoLocalError(WebCryptoLocalError.CODE.PROVIDER_INIT, EVENT_LOG + " Cannot find PKCS#11 library by path " + prov.lib));
                                }
                            }
                        }
                        this.cards
                            .on("error", function (err) {
                            _this.emit("error", err);
                            return _this.emit("token", {
                                added: [],
                                removed: [],
                                error: err,
                            });
                        })
                            .on("info", function (message) {
                            _this.emit("info", message);
                        })
                            .on("new", function (card) {
                            return _this.emit("token_new", card);
                        })
                            .on("insert", this.onTokenInsert.bind(this))
                            .on("remove", this.onTokenRemove.bind(this))
                            .start(this.config.cards);
                        _d = this.emit;
                        _e = ["listening"];
                        return [4, this.getInfo()];
                    case 1:
                        _d.apply(this, _e.concat([_f.sent()]));
                        return [2];
                }
            });
        });
    };
    LocalProvider.prototype.addProvider = function (crypto$$1) {
        var info = getSlotInfo(crypto$$1);
        this.emit("info", "Provider: Add crypto '" + info.name + "' " + info.id);
        this.info.providers.push(new ProviderCryptoProto(info));
        this.crypto.add(info.id, crypto$$1);
    };
    LocalProvider.prototype.hasProvider = function (slot) {
        return this.crypto.some(function (crypto$$1) {
            if (crypto$$1.module.libFile === slot.module.libFile &&
                crypto$$1.slot.handle.equals(slot.handle)) {
                return true;
            }
            return false;
        });
    };
    LocalProvider.prototype.stop = function () {
        throw new WebCryptoLocalError(WebCryptoLocalError.CODE.METHOD_NOT_IMPLEMENTED);
    };
    LocalProvider.prototype.getInfo = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var resProto;
            return tslib_1.__generator(this, function (_a) {
                resProto = new ProviderInfoProto();
                return [2, resProto];
            });
        });
    };
    LocalProvider.prototype.getCrypto = function (cryptoID) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var crypto$$1;
            return tslib_1.__generator(this, function (_a) {
                crypto$$1 = this.crypto.item(cryptoID);
                if (!crypto$$1) {
                    throw new WebCryptoLocalError(WebCryptoLocalError.CODE.PROVIDER_CRYPTO_NOT_FOUND, "Cannot get crypto by given ID '" + cryptoID + "'");
                }
                return [2, crypto$$1];
            });
        });
    };
    LocalProvider.prototype.onTokenInsert = function (card) {
        var _this = this;
        var EVENT_LOG = "Provider:Token:Insert";
        this.emit("info", EVENT_LOG + " reader:'" + card.reader + "' name:'" + card.name + "' atr:" + card.atr.toString("hex"));
        var lastError = null;
        var _loop_1 = function (library) {
            try {
                lastError = null;
                if (!fs.existsSync(library)) {
                    lastError = new WebCryptoLocalError(WebCryptoLocalError.CODE.PROVIDER_CRYPTO_NOT_FOUND, library);
                    return "continue";
                }
                var mod = void 0;
                try {
                    mod = graphene.Module.load(library, card.name);
                }
                catch (err) {
                    this_1.emit("error", err);
                    lastError = new WebCryptoLocalError(WebCryptoLocalError.CODE.PROVIDER_CRYPTO_WRONG, library);
                }
                try {
                    mod.initialize();
                }
                catch (err) {
                    if (!/CRYPTOKI_ALREADY_INITIALIZED/.test(err.message)) {
                        this_1.emit("error", err);
                        lastError = new WebCryptoLocalError(WebCryptoLocalError.CODE.PROVIDER_CRYPTO_WRONG, library);
                        return "continue";
                    }
                }
                var slots = mod.getSlots(true);
                if (!slots.length) {
                    this_1.emit("error", EVENT_LOG + " No slots found. It's possible token " + card.atr.toString("hex") + " uses wrong PKCS#11 lib " + card.libraries);
                    lastError = new WebCryptoLocalError(WebCryptoLocalError.CODE.PROVIDER_CRYPTO_WRONG, library);
                    return "continue";
                }
                var slotIndexes = [];
                this_1.emit("info", EVENT_LOG + " Looking for " + card.reader + " into " + slots.length + " slot(s)");
                for (var i = 0; i < slots.length; i++) {
                    var slot = slots.items(i);
                    if (!slot || this_1.hasProvider(slot)) {
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
                    return "continue";
                }
                var addInfos_1 = [];
                slotIndexes.forEach(function (slotIndex) {
                    try {
                        var crypto$$1 = new Pkcs11Crypto({
                            library: library,
                            name: card.name,
                            slot: slotIndex,
                            readWrite: !card.readOnly,
                        });
                        var info = getSlotInfo(crypto$$1);
                        info.atr = pvtsutils.Convert.ToHex(card.atr);
                        info.library = library;
                        info.id = digest(DEFAULT_HASH_ALG, card.reader + card.atr + crypto$$1.slot.handle.toString()).toString("hex");
                        addInfos_1.push(info);
                        _this.addProvider(crypto$$1);
                    }
                    catch (err) {
                        _this.emit("error", err);
                    }
                });
                this_1.emit("token", {
                    added: addInfos_1,
                    removed: [],
                });
                return "break";
            }
            catch (err) {
                lastError = err;
                return "continue";
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = card.libraries; _i < _a.length; _i++) {
            var library = _a[_i];
            var state_1 = _loop_1(library);
            if (state_1 === "break")
                break;
        }
        if (lastError) {
            this.emit("token", {
                added: [],
                removed: [],
                error: lastError,
            });
        }
    };
    LocalProvider.prototype.onTokenRemove = function (card) {
        var _this = this;
        try {
            var EVENT_LOG_1 = "Provider:Token:Remove";
            this.emit("info", EVENT_LOG_1 + " reader:'" + card.reader + "' name:'" + card.name + "' atr:" + card.atr.toString("hex"));
            var info_1 = {
                added: [],
                removed: [],
            };
            var cryptoIDs_1 = [];
            card.libraries.forEach(function (library) {
                try {
                    var mod_1 = graphene.Module.load(library, card.name);
                    try {
                        mod_1.initialize();
                    }
                    catch (err) {
                        if (!/CRYPTOKI_ALREADY_INITIALIZED/.test(err.message)) {
                            throw err;
                        }
                    }
                    var slots_1 = mod_1.getSlots(true);
                    _this.crypto.forEach(function (crypto$$1, key) {
                        if (crypto$$1.module.libFile === mod_1.libFile) {
                            if (slots_1.indexOf(crypto$$1.slot) === -1) {
                                cryptoIDs_1.push(key);
                            }
                        }
                    });
                }
                catch (err) {
                    _this.emit("error", new WebCryptoLocalError(WebCryptoLocalError.CODE.TOKEN_REMOVE_TOKEN_READING, EVENT_LOG_1 + " PKCS#11 lib " + library + ". " + err.message));
                }
            });
            if (!cryptoIDs_1.length) {
                this.emit("error", new WebCryptoLocalError(WebCryptoLocalError.CODE.TOKEN_REMOVE_NO_SLOTS_FOUND));
            }
            cryptoIDs_1.forEach(function (provId) {
                _this.crypto.remove(provId);
                _this.info.providers = _this.info.providers.filter(function (provider) {
                    if (provider.id === provId) {
                        _this.emit("info", EVENT_LOG_1 + " Crypto removed '" + provider.name + "' " + provider.id);
                        info_1.removed.push(provider);
                        return false;
                    }
                    return true;
                });
            });
            if (info_1.removed.length) {
                this.emit("token", info_1);
            }
        }
        catch (error) {
            this.emit("token", {
                added: [],
                removed: [],
                error: error,
            });
        }
    };
    LocalProvider.prototype.onCryptoAdd = function (e) {
        this.emit("info", "Provider:AddCrypto PKCS#11 '" + e.item.module.libFile + "' '" + e.item.module.libName + "'");
    };
    LocalProvider.prototype.onCryptoRemove = function (e) {
        var LOG = "Provider:RemoveCrypto";
        this.emit("info", LOG + " PKCS#11 '" + e.item.module.libFile + "' '" + e.item.module.libName + "'");
        if (!this.crypto.some(function (crypto$$1) { return crypto$$1.module.libFile === e.item.module.libFile; })) {
            this.emit("info", LOG + " PKCS#11 finalize '" + e.item.module.libFile + "'");
            try {
                e.item.module.finalize();
            }
            catch (err) {
                this.emit("error", err);
            }
        }
    };
    return LocalProvider;
}(events.EventEmitter));
function getSlotInfo(p11Crypto) {
    var session = p11Crypto.session;
    var info = p11Crypto.info;
    info.readOnly = !(session.flags & graphene.SessionFlag.RW_SESSION);
    return info;
}

var pkijs$1 = require("pkijs");
graphene.registerAttribute("x509Chain", 2147483905, "buffer");
var CertificateStorageService = (function (_super) {
    tslib_1.__extends(CertificateStorageService, _super);
    function CertificateStorageService(server, crypto$$1) {
        return _super.call(this, server, crypto$$1, [
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
        ]) || this;
    }
    CertificateStorageService.prototype.getCrypto = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.object.getCrypto(id)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    CertificateStorageService.prototype.getMemoryStorage = function () {
        return this.object.object.memoryStorage;
    };
    CertificateStorageService.prototype.onMessage = function (session, action) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, _a, params, crypto$$1, item, cryptoKey, cryptoCert, certProto, _b, params, crypto$$1, cert, index, params, crypto$$1, params, crypto$$1, item, cryptoKey, cryptoCert, certProto, _c, params, crypto$$1, cert, exportedData, params, crypto$$1, keys, _d, params, crypto$$1, params, crypto$$1, cert, index, params, crypto$$1, cert, resultProto, pkiEntryCert, itemProto, buffer, isX509ChainSupported, ulongSize, i, itemType, itemProto, itemSizeBuffer, itemSize, itemValue, indexes, trustedCerts, certs, _i, indexes_1, index, parts, cryptoCert, pkiCert, chainBuilder, chain, resultChain, _e, resultChain_1, item, itemProto, items, _f, params_1, crlArray, params_2, ocspArray;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        result = new ResultProto(action);
                        _a = action.action;
                        switch (_a) {
                            case CertificateStorageGetItemActionProto.ACTION: return [3, 1];
                            case CertificateStorageSetItemActionProto.ACTION: return [3, 8];
                            case CertificateStorageRemoveItemActionProto.ACTION: return [3, 12];
                            case CertificateStorageImportActionProto.ACTION: return [3, 16];
                            case CertificateStorageExportActionProto.ACTION: return [3, 22];
                            case CertificateStorageKeysActionProto.ACTION: return [3, 26];
                            case CertificateStorageClearActionProto.ACTION: return [3, 31];
                            case CertificateStorageIndexOfActionProto.ACTION: return [3, 35];
                            case CertificateStorageGetChainActionProto.ACTION: return [3, 39];
                            case CertificateStorageGetCRLActionProto.ACTION: return [3, 56];
                            case pkijs$1.CertificateStorageGetOCSPActionProto.ACTION: return [3, 59];
                        }
                        return [3, 62];
                    case 1: return [4, CertificateStorageGetItemActionProto.importProto(action)];
                    case 2:
                        params = _g.sent();
                        return [4, this.getCrypto(params.providerID)];
                    case 3:
                        crypto$$1 = _g.sent();
                        return [4, crypto$$1.certStorage.getItem(params.key, params.algorithm.isEmpty() ? null : params.algorithm.toAlgorithm(), !params.keyUsages ? null : params.keyUsages)];
                    case 4:
                        item = _g.sent();
                        if (!item) return [3, 7];
                        cryptoKey = new ServiceCryptoItem(item.publicKey, params.providerID);
                        this.getMemoryStorage().add(cryptoKey);
                        cryptoCert = new ServiceCryptoItem(item, params.providerID);
                        this.getMemoryStorage().add(cryptoCert);
                        return [4, cryptoCert.toProto()];
                    case 5:
                        certProto = _g.sent();
                        certProto.publicKey = cryptoKey.toProto();
                        _b = result;
                        return [4, certProto.exportProto()];
                    case 6:
                        _b.data = _g.sent();
                        _g.label = 7;
                    case 7: return [3, 63];
                    case 8: return [4, CertificateStorageSetItemActionProto.importProto(action)];
                    case 9:
                        params = _g.sent();
                        return [4, this.getCrypto(params.providerID)];
                    case 10:
                        crypto$$1 = _g.sent();
                        cert = this.getMemoryStorage().item(params.item.id).item;
                        return [4, crypto$$1.certStorage.setItem(cert)];
                    case 11:
                        index = _g.sent();
                        result.data = pvtsutils.Convert.FromUtf8String(index);
                        return [3, 63];
                    case 12: return [4, CertificateStorageRemoveItemActionProto.importProto(action)];
                    case 13:
                        params = _g.sent();
                        return [4, this.getCrypto(params.providerID)];
                    case 14:
                        crypto$$1 = _g.sent();
                        return [4, crypto$$1.certStorage.removeItem(params.key)];
                    case 15:
                        _g.sent();
                        return [3, 63];
                    case 16: return [4, CertificateStorageImportActionProto.importProto(action)];
                    case 17:
                        params = _g.sent();
                        return [4, this.getCrypto(params.providerID)];
                    case 18:
                        crypto$$1 = _g.sent();
                        return [4, crypto$$1.certStorage.importCert(params.type, params.data, params.algorithm.toAlgorithm(), params.keyUsages)];
                    case 19:
                        item = _g.sent();
                        cryptoKey = new ServiceCryptoItem(item.publicKey, params.providerID);
                        this.getMemoryStorage().add(cryptoKey);
                        cryptoCert = new ServiceCryptoItem(item, params.providerID);
                        this.getMemoryStorage().add(cryptoCert);
                        return [4, cryptoCert.toProto()];
                    case 20:
                        certProto = _g.sent();
                        certProto.publicKey = cryptoKey.toProto();
                        _c = result;
                        return [4, certProto.exportProto()];
                    case 21:
                        _c.data = _g.sent();
                        return [3, 63];
                    case 22: return [4, CertificateStorageExportActionProto.importProto(action)];
                    case 23:
                        params = _g.sent();
                        return [4, this.getCrypto(params.providerID)];
                    case 24:
                        crypto$$1 = _g.sent();
                        cert = this.getMemoryStorage().item(params.item.id).item;
                        return [4, crypto$$1.certStorage.exportCert(params.format, cert)];
                    case 25:
                        exportedData = _g.sent();
                        if (exportedData instanceof ArrayBuffer) {
                            result.data = exportedData;
                        }
                        else {
                            result.data = pvtsutils.Convert.FromUtf8String(exportedData);
                        }
                        return [3, 63];
                    case 26: return [4, CertificateStorageKeysActionProto.importProto(action)];
                    case 27:
                        params = _g.sent();
                        return [4, this.getCrypto(params.providerID)];
                    case 28:
                        crypto$$1 = _g.sent();
                        return [4, crypto$$1.certStorage.keys()];
                    case 29:
                        keys = _g.sent();
                        _d = result;
                        return [4, ArrayStringConverter.set(keys)];
                    case 30:
                        _d.data = (_g.sent()).buffer;
                        return [3, 63];
                    case 31: return [4, CertificateStorageKeysActionProto.importProto(action)];
                    case 32:
                        params = _g.sent();
                        return [4, this.getCrypto(params.providerID)];
                    case 33:
                        crypto$$1 = _g.sent();
                        return [4, crypto$$1.certStorage.clear()];
                    case 34:
                        _g.sent();
                        return [3, 63];
                    case 35: return [4, CertificateStorageIndexOfActionProto.importProto(action)];
                    case 36:
                        params = _g.sent();
                        return [4, this.getCrypto(params.providerID)];
                    case 37:
                        crypto$$1 = _g.sent();
                        cert = this.getMemoryStorage().item(params.item.id);
                        return [4, crypto$$1.certStorage.indexOf(cert.item)];
                    case 38:
                        index = _g.sent();
                        if (index) {
                            result.data = pvtsutils.Convert.FromUtf8String(index);
                        }
                        return [3, 63];
                    case 39: return [4, CertificateStorageGetChainActionProto.importProto(action)];
                    case 40:
                        params = _g.sent();
                        return [4, this.getCrypto(params.providerID)];
                    case 41:
                        crypto$$1 = _g.sent();
                        cert = this.getMemoryStorage().item(params.item.id).item;
                        if (cert.type !== "x509") {
                            throw new WebCryptoLocalError(WebCryptoLocalError.CODE.ACTION_COMMON, "Wrong item type, must be 'x509'");
                        }
                        resultProto = new CertificateStorageGetChainResultProto();
                        return [4, certC2P(crypto$$1, cert)];
                    case 42:
                        pkiEntryCert = _g.sent();
                        if (!pkiEntryCert.subject.isEqual(pkiEntryCert.issuer)) return [3, 43];
                        itemProto = new ChainItemProto();
                        itemProto.type = "x509";
                        itemProto.value = pkiEntryCert.toSchema(true).toBER(false);
                        resultProto.items.push(itemProto);
                        return [3, 54];
                    case 43:
                        if (!("session" in crypto$$1)) return [3, 53];
                        buffer = void 0;
                        isX509ChainSupported = true;
                        try {
                            buffer = cert.p11Object.getAttribute("x509Chain");
                        }
                        catch (e) {
                            isX509ChainSupported = false;
                        }
                        if (!isX509ChainSupported) return [3, 44];
                        this.emit("info", "Service:CertificateStorage:GetChain: CKA_X509_CHAIN is supported");
                        ulongSize = cert.p11Object.handle.length;
                        i = 0;
                        while (i < buffer.length) {
                            itemType = buffer.slice(i, i + 1)[0];
                            itemProto = new ChainItemProto();
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
                            itemSizeBuffer = buffer.slice(i, i + ulongSize);
                            itemSize = itemSizeBuffer.readInt32LE(0);
                            itemValue = buffer.slice(i + ulongSize, i + ulongSize + itemSize);
                            itemProto.value = new Uint8Array(itemValue).buffer;
                            resultProto.items.push(itemProto);
                            i += ulongSize + itemSize;
                        }
                        return [3, 52];
                    case 44:
                        this.emit("info", "Service:CertificateStorage:GetChain: CKA_X509_CHAIN is not supported");
                        return [4, crypto$$1.certStorage.keys()];
                    case 45:
                        indexes = _g.sent();
                        trustedCerts = [];
                        certs = [];
                        _i = 0, indexes_1 = indexes;
                        _g.label = 46;
                    case 46:
                        if (!(_i < indexes_1.length)) return [3, 50];
                        index = indexes_1[_i];
                        parts = index.split("-");
                        if (parts[0] !== "x509") {
                            return [3, 49];
                        }
                        return [4, crypto$$1.certStorage.getItem(index)];
                    case 47:
                        cryptoCert = _g.sent();
                        return [4, certC2P(crypto$$1, cryptoCert)];
                    case 48:
                        pkiCert = _g.sent();
                        if (pvutils.isEqualBuffer(pkiEntryCert.tbs, pkiCert.tbs)) {
                            return [3, 49];
                        }
                        if (pkiCert.subject.isEqual(pkiCert.issuer)) {
                            trustedCerts.push(pkiCert);
                        }
                        else {
                            certs.push(pkiCert);
                        }
                        _g.label = 49;
                    case 49:
                        _i++;
                        return [3, 46];
                    case 50:
                        if (pkiEntryCert.subject.isEqual(pkiEntryCert.issuer)) {
                            trustedCerts.push(pkiEntryCert);
                        }
                        certs.push(pkiEntryCert);
                        pkijs$1.setEngine("PKCS#11 provider", crypto$$1, new pkijs$1.CryptoEngine({ name: "", crypto: crypto$$1, subtle: crypto$$1.subtle }));
                        chainBuilder = new pkijs$1.CertificateChainValidationEngine({
                            trustedCerts: trustedCerts,
                            certs: certs,
                        });
                        return [4, chainBuilder.verify()];
                    case 51:
                        chain = _g.sent();
                        resultChain = [];
                        if (chain.result) {
                            resultChain = chainBuilder.certs;
                        }
                        else {
                            resultChain = [pkiEntryCert];
                        }
                        for (_e = 0, resultChain_1 = resultChain; _e < resultChain_1.length; _e++) {
                            item = resultChain_1[_e];
                            itemProto = new ChainItemProto();
                            itemProto.type = "x509";
                            itemProto.value = item.toSchema(true).toBER(false);
                            resultProto.items.push(itemProto);
                        }
                        _g.label = 52;
                    case 52: return [3, 54];
                    case 53: throw new WebCryptoLocalError(WebCryptoLocalError.CODE.ACTION_NOT_SUPPORTED, "Provider doesn't support GetChain method");
                    case 54:
                        if (resultProto.items) {
                            items = resultProto.items
                                .map(function (item) { return item.type; });
                            this.emit("info", "Service:CertificateStorage:GetChain: " + items.join(",") + " items:" + items.length);
                        }
                        _f = result;
                        return [4, resultProto.exportProto()];
                    case 55:
                        _f.data = _g.sent();
                        return [3, 63];
                    case 56: return [4, CertificateStorageGetCRLActionProto.importProto(action)];
                    case 57:
                        params_1 = _g.sent();
                        return [4, new Promise(function (resolve, reject) {
                                request(params_1.url, { encoding: null }, function (err, response, body) {
                                    try {
                                        var message = "Cannot get CRL by URI '" + params_1.url + "'";
                                        if (err) {
                                            throw new Error(message + ". " + err.message);
                                        }
                                        if (response.statusCode !== 200) {
                                            throw new Error(message + ". Bad status " + response.statusCode);
                                        }
                                        if (Buffer.isBuffer(body)) {
                                            body = body.toString("binary");
                                        }
                                        body = prepareData(body);
                                        body = new Uint8Array(body).buffer;
                                        try {
                                            var asn1 = asn1js.fromBER(body);
                                            if (asn1.result.error) {
                                                throw new Error("ASN1: " + asn1.result.error);
                                            }
                                            var crl = new pkijs$1.CertificateRevocationList({
                                                schema: asn1.result,
                                            });
                                            if (!crl) {
                                                throw new Error("variable crl is empty");
                                            }
                                        }
                                        catch (e) {
                                            console.error(e);
                                            throw new Error("Cannot parse received CRL from URI '" + params_1.url + "'");
                                        }
                                        resolve(body);
                                    }
                                    catch (e) {
                                        reject(e);
                                    }
                                });
                            })];
                    case 58:
                        crlArray = _g.sent();
                        result.data = crlArray;
                        return [3, 63];
                    case 59: return [4, pkijs$1.CertificateStorageGetOCSPActionProto.importProto(action)];
                    case 60:
                        params_2 = _g.sent();
                        return [4, new Promise(function (resolve, reject) {
                                var url$$1 = params_2.url;
                                var options = { encoding: null };
                                if (params_2.options.method === "get") {
                                    var b64 = new Buffer(params_2.url).toString("hex");
                                    url$$1 += "/" + b64;
                                    options.method = "get";
                                }
                                else {
                                    options.method = "post";
                                    options.headers = { "Content-Type": "application/ocsp-request" };
                                    options.body = new Buffer(params_2.request);
                                }
                                request(url$$1, options, function (err, response, body) {
                                    try {
                                        var message = "Cannot get OCSP by URI '" + params_2.url + "'";
                                        if (err) {
                                            throw new Error(message + ". " + err.message);
                                        }
                                        if (response.statusCode !== 200) {
                                            throw new Error(message + ". Bad status " + response.statusCode);
                                        }
                                        if (Buffer.isBuffer(body)) {
                                            body = body.toString("binary");
                                        }
                                        body = prepareData(body);
                                        body = new Uint8Array(body).buffer;
                                        try {
                                            var asn1 = asn1js.fromBER(body);
                                            if (asn1.result.error) {
                                                throw new Error("ASN1: " + asn1.result.error);
                                            }
                                            var ocsp = new pkijs$1.OCSPResponse({
                                                schema: asn1.result,
                                            });
                                            if (!ocsp) {
                                                throw new Error("variable ocsp is empty");
                                            }
                                        }
                                        catch (e) {
                                            console.error(e);
                                            throw new Error("Cannot parse received OCSP from URI '" + params_2.url + "'");
                                        }
                                        resolve(body);
                                    }
                                    catch (e) {
                                        reject(e);
                                    }
                                });
                            })];
                    case 61:
                        ocspArray = _g.sent();
                        result.data = ocspArray;
                        return [3, 63];
                    case 62: throw new WebCryptoLocalError(WebCryptoLocalError.CODE.ACTION_NOT_IMPLEMENTED, "Action '" + action.action + "' is not implemented");
                    case 63: return [2, result];
                }
            });
        });
    };
    return CertificateStorageService;
}(Service));
function prepareData(data) {
    if (data.indexOf("-----") === 0) {
        data = data.replace(/-----[\w\s]+-----/gi, "").replace(/[\n\r]/g, "");
        return new Buffer(data, "base64");
    }
    else {
        return new Buffer(data, "binary");
    }
}
function certC2P(provider, cert) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var certDer, asn1, pkiCert;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, provider.certStorage.exportCert("raw", cert)];
                case 1:
                    certDer = _a.sent();
                    asn1 = asn1js.fromBER(certDer);
                    pkiCert = new pkijs$1.Certificate({ schema: asn1.result });
                    return [2, pkiCert];
            }
        });
    });
}

var KeyStorageSetItemActionProto = (function (_super) {
    tslib_1.__extends(KeyStorageSetItemActionProto, _super);
    function KeyStorageSetItemActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KeyStorageSetItemActionProto_1 = KeyStorageSetItemActionProto;
    KeyStorageSetItemActionProto.INDEX = CryptoActionProto.INDEX;
    KeyStorageSetItemActionProto.ACTION = "crypto/keyStorage/setItem";
    tslib_1.__decorate([
        tsprotobuf.ProtobufProperty({ id: KeyStorageSetItemActionProto_1.INDEX++, required: true, parser: CryptoKeyProto })
    ], KeyStorageSetItemActionProto.prototype, "item", void 0);
    KeyStorageSetItemActionProto = KeyStorageSetItemActionProto_1 = tslib_1.__decorate([
        tsprotobuf.ProtobufElement({})
    ], KeyStorageSetItemActionProto);
    return KeyStorageSetItemActionProto;
    var KeyStorageSetItemActionProto_1;
}(CryptoActionProto));
var KeyStorageGetItemActionProto = (function (_super) {
    tslib_1.__extends(KeyStorageGetItemActionProto, _super);
    function KeyStorageGetItemActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KeyStorageGetItemActionProto_1 = KeyStorageGetItemActionProto;
    KeyStorageGetItemActionProto.INDEX = CryptoActionProto.INDEX;
    KeyStorageGetItemActionProto.ACTION = "crypto/keyStorage/getItem";
    tslib_1.__decorate([
        tsprotobuf.ProtobufProperty({ id: KeyStorageGetItemActionProto_1.INDEX++, required: true, type: "string" })
    ], KeyStorageGetItemActionProto.prototype, "key", void 0);
    tslib_1.__decorate([
        tsprotobuf.ProtobufProperty({ id: KeyStorageGetItemActionProto_1.INDEX++, parser: AlgorithmProto })
    ], KeyStorageGetItemActionProto.prototype, "algorithm", void 0);
    tslib_1.__decorate([
        tsprotobuf.ProtobufProperty({ id: KeyStorageGetItemActionProto_1.INDEX++, repeated: true, type: "string" })
    ], KeyStorageGetItemActionProto.prototype, "keyUsages", void 0);
    KeyStorageGetItemActionProto = KeyStorageGetItemActionProto_1 = tslib_1.__decorate([
        tsprotobuf.ProtobufElement({})
    ], KeyStorageGetItemActionProto);
    return KeyStorageGetItemActionProto;
    var KeyStorageGetItemActionProto_1;
}(CryptoActionProto));
var KeyStorageKeysActionProto = (function (_super) {
    tslib_1.__extends(KeyStorageKeysActionProto, _super);
    function KeyStorageKeysActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KeyStorageKeysActionProto.INDEX = CryptoActionProto.INDEX;
    KeyStorageKeysActionProto.ACTION = "crypto/keyStorage/keys";
    KeyStorageKeysActionProto = tslib_1.__decorate([
        tsprotobuf.ProtobufElement({})
    ], KeyStorageKeysActionProto);
    return KeyStorageKeysActionProto;
}(CryptoActionProto));
var KeyStorageRemoveItemActionProto = (function (_super) {
    tslib_1.__extends(KeyStorageRemoveItemActionProto, _super);
    function KeyStorageRemoveItemActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KeyStorageRemoveItemActionProto_1 = KeyStorageRemoveItemActionProto;
    KeyStorageRemoveItemActionProto.INDEX = CryptoActionProto.INDEX;
    KeyStorageRemoveItemActionProto.ACTION = "crypto/keyStorage/removeItem";
    tslib_1.__decorate([
        tsprotobuf.ProtobufProperty({ id: KeyStorageRemoveItemActionProto_1.INDEX++, required: true, type: "string" })
    ], KeyStorageRemoveItemActionProto.prototype, "key", void 0);
    KeyStorageRemoveItemActionProto = KeyStorageRemoveItemActionProto_1 = tslib_1.__decorate([
        tsprotobuf.ProtobufElement({})
    ], KeyStorageRemoveItemActionProto);
    return KeyStorageRemoveItemActionProto;
    var KeyStorageRemoveItemActionProto_1;
}(CryptoActionProto));
var KeyStorageClearActionProto = (function (_super) {
    tslib_1.__extends(KeyStorageClearActionProto, _super);
    function KeyStorageClearActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KeyStorageClearActionProto.INDEX = CryptoActionProto.INDEX;
    KeyStorageClearActionProto.ACTION = "crypto/keyStorage/clear";
    KeyStorageClearActionProto = tslib_1.__decorate([
        tsprotobuf.ProtobufElement({})
    ], KeyStorageClearActionProto);
    return KeyStorageClearActionProto;
}(CryptoActionProto));
var KeyStorageIndexOfActionProto = (function (_super) {
    tslib_1.__extends(KeyStorageIndexOfActionProto, _super);
    function KeyStorageIndexOfActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KeyStorageIndexOfActionProto_1 = KeyStorageIndexOfActionProto;
    KeyStorageIndexOfActionProto.INDEX = CryptoActionProto.INDEX;
    KeyStorageIndexOfActionProto.ACTION = "crypto/keyStorage/indexOf";
    tslib_1.__decorate([
        tsprotobuf.ProtobufProperty({ id: KeyStorageIndexOfActionProto_1.INDEX++, required: true, parser: CryptoKeyProto })
    ], KeyStorageIndexOfActionProto.prototype, "item", void 0);
    KeyStorageIndexOfActionProto = KeyStorageIndexOfActionProto_1 = tslib_1.__decorate([
        tsprotobuf.ProtobufElement({})
    ], KeyStorageIndexOfActionProto);
    return KeyStorageIndexOfActionProto;
    var KeyStorageIndexOfActionProto_1;
}(CryptoActionProto));

var KeyStorageService = (function (_super) {
    tslib_1.__extends(KeyStorageService, _super);
    function KeyStorageService(server, crypto$$1) {
        return _super.call(this, server, crypto$$1, [
            KeyStorageKeysActionProto,
            KeyStorageIndexOfActionProto,
            KeyStorageGetItemActionProto,
            KeyStorageSetItemActionProto,
            KeyStorageRemoveItemActionProto,
            KeyStorageClearActionProto,
        ]) || this;
    }
    KeyStorageService.prototype.getCrypto = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.object.getCrypto(id)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    KeyStorageService.prototype.getMemoryStorage = function () {
        return this.object.object.memoryStorage;
    };
    KeyStorageService.prototype.onMessage = function (session, action) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, _a, params, crypto$$1, key, cryptoKey, _b, params, key, crypto$$1, index, params, crypto$$1, params, crypto$$1, keys, _c, params, crypto$$1, key, index, params, crypto$$1;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        result = new ResultProto(action);
                        _a = action.action;
                        switch (_a) {
                            case KeyStorageGetItemActionProto.ACTION: return [3, 1];
                            case KeyStorageSetItemActionProto.ACTION: return [3, 7];
                            case KeyStorageRemoveItemActionProto.ACTION: return [3, 14];
                            case KeyStorageKeysActionProto.ACTION: return [3, 18];
                            case KeyStorageIndexOfActionProto.ACTION: return [3, 23];
                            case KeyStorageClearActionProto.ACTION: return [3, 27];
                        }
                        return [3, 31];
                    case 1: return [4, KeyStorageGetItemActionProto.importProto(action)];
                    case 2:
                        params = _d.sent();
                        return [4, this.getCrypto(params.providerID)];
                    case 3:
                        crypto$$1 = _d.sent();
                        return [4, crypto$$1.keyStorage.getItem(params.key, params.algorithm.isEmpty() ? null : params.algorithm.toAlgorithm(), !params.keyUsages ? null : params.keyUsages)];
                    case 4:
                        key = _d.sent();
                        if (!key) return [3, 6];
                        cryptoKey = new ServiceCryptoItem(key, params.providerID);
                        this.getMemoryStorage().add(cryptoKey);
                        _b = result;
                        return [4, cryptoKey.toProto().exportProto()];
                    case 5:
                        _b.data = _d.sent();
                        _d.label = 6;
                    case 6: return [3, 32];
                    case 7: return [4, KeyStorageSetItemActionProto.importProto(action)];
                    case 8:
                        params = _d.sent();
                        key = this.getMemoryStorage().item(params.item.id).item;
                        return [4, this.getCrypto(params.providerID)];
                    case 9:
                        crypto$$1 = _d.sent();
                        if (key.algorithm.toAlgorithm) {
                            key.algorithm = key.algorithm.toAlgorithm();
                        }
                        index = void 0;
                        if (!(crypto$$1 instanceof PvCrypto)) return [3, 11];
                        return [4, crypto$$1.keyStorage.setItem(key, {
                                pinFriendlyName: session.headers.origin,
                                pinDescription: key.usages.join(", "),
                            })];
                    case 10:
                        index = _d.sent();
                        return [3, 13];
                    case 11: return [4, crypto$$1.keyStorage.setItem(key)];
                    case 12:
                        index = _d.sent();
                        _d.label = 13;
                    case 13:
                        result.data = pvtsutils.Convert.FromUtf8String(index);
                        return [3, 32];
                    case 14: return [4, KeyStorageRemoveItemActionProto.importProto(action)];
                    case 15:
                        params = _d.sent();
                        return [4, this.getCrypto(params.providerID)];
                    case 16:
                        crypto$$1 = _d.sent();
                        return [4, crypto$$1.keyStorage.removeItem(params.key)];
                    case 17:
                        _d.sent();
                        return [3, 32];
                    case 18: return [4, KeyStorageKeysActionProto.importProto(action)];
                    case 19:
                        params = _d.sent();
                        return [4, this.getCrypto(params.providerID)];
                    case 20:
                        crypto$$1 = _d.sent();
                        return [4, crypto$$1.keyStorage.keys()];
                    case 21:
                        keys = _d.sent();
                        _c = result;
                        return [4, ArrayStringConverter.set(keys)];
                    case 22:
                        _c.data = (_d.sent()).buffer;
                        return [3, 32];
                    case 23: return [4, KeyStorageIndexOfActionProto.importProto(action)];
                    case 24:
                        params = _d.sent();
                        return [4, this.getCrypto(params.providerID)];
                    case 25:
                        crypto$$1 = _d.sent();
                        key = this.getMemoryStorage().item(params.item.id).item;
                        return [4, crypto$$1.keyStorage.indexOf(key)];
                    case 26:
                        index = _d.sent();
                        if (index) {
                            result.data = pvtsutils.Convert.FromUtf8String(index);
                        }
                        return [3, 32];
                    case 27: return [4, KeyStorageClearActionProto.importProto(action)];
                    case 28:
                        params = _d.sent();
                        return [4, this.getCrypto(params.providerID)];
                    case 29:
                        crypto$$1 = _d.sent();
                        return [4, crypto$$1.keyStorage.clear()];
                    case 30:
                        _d.sent();
                        return [3, 32];
                    case 31: throw new WebCryptoLocalError(WebCryptoLocalError.CODE.ACTION_NOT_IMPLEMENTED, "Action '" + action.action + "' is not implemented");
                    case 32: return [2, result];
                }
            });
        });
    };
    return KeyStorageService;
}(Service));

var DigestActionProto = (function (_super) {
    tslib_1.__extends(DigestActionProto, _super);
    function DigestActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DigestActionProto_1 = DigestActionProto;
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
    return DigestActionProto;
    var DigestActionProto_1;
}(CryptoActionProto));
var GenerateKeyActionProto = (function (_super) {
    tslib_1.__extends(GenerateKeyActionProto, _super);
    function GenerateKeyActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GenerateKeyActionProto_1 = GenerateKeyActionProto;
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
    return GenerateKeyActionProto;
    var GenerateKeyActionProto_1;
}(CryptoActionProto));
var SignActionProto = (function (_super) {
    tslib_1.__extends(SignActionProto, _super);
    function SignActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SignActionProto_1 = SignActionProto;
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
    return SignActionProto;
    var SignActionProto_1;
}(CryptoActionProto));
var VerifyActionProto = (function (_super) {
    tslib_1.__extends(VerifyActionProto, _super);
    function VerifyActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VerifyActionProto_1 = VerifyActionProto;
    VerifyActionProto.INDEX = SignActionProto.INDEX;
    VerifyActionProto.ACTION = "crypto/subtle/verify";
    tslib_1.__decorate([
        tsprotobuf.ProtobufProperty({ id: VerifyActionProto_1.INDEX++, required: true, converter: tsprotobuf.ArrayBufferConverter })
    ], VerifyActionProto.prototype, "signature", void 0);
    VerifyActionProto = VerifyActionProto_1 = tslib_1.__decorate([
        tsprotobuf.ProtobufElement({})
    ], VerifyActionProto);
    return VerifyActionProto;
    var VerifyActionProto_1;
}(SignActionProto));
var EncryptActionProto = (function (_super) {
    tslib_1.__extends(EncryptActionProto, _super);
    function EncryptActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EncryptActionProto.INDEX = SignActionProto.INDEX;
    EncryptActionProto.ACTION = "crypto/subtle/encrypt";
    EncryptActionProto = tslib_1.__decorate([
        tsprotobuf.ProtobufElement({})
    ], EncryptActionProto);
    return EncryptActionProto;
}(SignActionProto));
var DecryptActionProto = (function (_super) {
    tslib_1.__extends(DecryptActionProto, _super);
    function DecryptActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DecryptActionProto.INDEX = SignActionProto.INDEX;
    DecryptActionProto.ACTION = "crypto/subtle/decrypt";
    DecryptActionProto = tslib_1.__decorate([
        tsprotobuf.ProtobufElement({})
    ], DecryptActionProto);
    return DecryptActionProto;
}(SignActionProto));
var DeriveBitsActionProto = (function (_super) {
    tslib_1.__extends(DeriveBitsActionProto, _super);
    function DeriveBitsActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeriveBitsActionProto_1 = DeriveBitsActionProto;
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
    return DeriveBitsActionProto;
    var DeriveBitsActionProto_1;
}(CryptoActionProto));
var DeriveKeyActionProto = (function (_super) {
    tslib_1.__extends(DeriveKeyActionProto, _super);
    function DeriveKeyActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeriveKeyActionProto_1 = DeriveKeyActionProto;
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
    return DeriveKeyActionProto;
    var DeriveKeyActionProto_1;
}(CryptoActionProto));
var UnwrapKeyActionProto = (function (_super) {
    tslib_1.__extends(UnwrapKeyActionProto, _super);
    function UnwrapKeyActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UnwrapKeyActionProto_1 = UnwrapKeyActionProto;
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
    return UnwrapKeyActionProto;
    var UnwrapKeyActionProto_1;
}(CryptoActionProto));
var WrapKeyActionProto = (function (_super) {
    tslib_1.__extends(WrapKeyActionProto, _super);
    function WrapKeyActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WrapKeyActionProto_1 = WrapKeyActionProto;
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
    return WrapKeyActionProto;
    var WrapKeyActionProto_1;
}(CryptoActionProto));
var ExportKeyActionProto = (function (_super) {
    tslib_1.__extends(ExportKeyActionProto, _super);
    function ExportKeyActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExportKeyActionProto_1 = ExportKeyActionProto;
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
    return ExportKeyActionProto;
    var ExportKeyActionProto_1;
}(CryptoActionProto));
var ImportKeyActionProto = (function (_super) {
    tslib_1.__extends(ImportKeyActionProto, _super);
    function ImportKeyActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ImportKeyActionProto_1 = ImportKeyActionProto;
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
    return ImportKeyActionProto;
    var ImportKeyActionProto_1;
}(CryptoActionProto));

var SubtleService = (function (_super) {
    tslib_1.__extends(SubtleService, _super);
    function SubtleService(server, crypto$$1) {
        return _super.call(this, server, crypto$$1, [
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
        ]) || this;
    }
    SubtleService.prototype.getCrypto = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.object.getCrypto(id)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    SubtleService.prototype.getMemoryStorage = function () {
        return this.object.object.memoryStorage;
    };
    SubtleService.prototype.onMessage = function (session, action) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, _a, params, crypto$$1, _b, params, crypto$$1, keys, keyProto, keyPair, publicKey, privateKey, keyPairProto, key, secretKey, _c, params, crypto$$1, key, _d, params, crypto$$1, key, ok, params, crypto$$1, key, _e, params, crypto$$1, key, _f, params, crypto$$1, key, alg, publicKey, _g, params, crypto$$1, key, alg, publicKey, derivedKey, resKey, _h, params, crypto$$1, key, wrappingKey, _j, params, crypto$$1, unwrappingKey, key, resKey, _k, params, crypto$$1, key, exportedData, json, params, crypto$$1, keyData, json, key, resKey, _l;
            return tslib_1.__generator(this, function (_m) {
                switch (_m.label) {
                    case 0:
                        result = new ResultProto(action);
                        _a = action.action;
                        switch (_a) {
                            case DigestActionProto.ACTION: return [3, 1];
                            case GenerateKeyActionProto.ACTION: return [3, 5];
                            case SignActionProto.ACTION: return [3, 10];
                            case VerifyActionProto.ACTION: return [3, 14];
                            case EncryptActionProto.ACTION: return [3, 18];
                            case DecryptActionProto.ACTION: return [3, 22];
                            case DeriveBitsActionProto.ACTION: return [3, 26];
                            case DeriveKeyActionProto.ACTION: return [3, 31];
                            case WrapKeyActionProto.ACTION: return [3, 37];
                            case UnwrapKeyActionProto.ACTION: return [3, 42];
                            case ExportKeyActionProto.ACTION: return [3, 48];
                            case ImportKeyActionProto.ACTION: return [3, 53];
                        }
                        return [3, 58];
                    case 1: return [4, DigestActionProto.importProto(action)];
                    case 2:
                        params = _m.sent();
                        return [4, this.getCrypto(params.providerID)];
                    case 3:
                        crypto$$1 = _m.sent();
                        _b = result;
                        return [4, crypto$$1.subtle.digest(params.algorithm.toAlgorithm(), params.data)];
                    case 4:
                        _b.data = _m.sent();
                        return [3, 59];
                    case 5: return [4, GenerateKeyActionProto.importProto(action)];
                    case 6:
                        params = _m.sent();
                        return [4, this.getCrypto(params.providerID)];
                    case 7:
                        crypto$$1 = _m.sent();
                        return [4, crypto$$1.subtle.generateKey(params.algorithm.toAlgorithm(), params.extractable, params.usage)];
                    case 8:
                        keys = _m.sent();
                        keyProto = void 0;
                        if (keys.privateKey) {
                            keyPair = keys;
                            publicKey = new ServiceCryptoItem(keyPair.publicKey, params.providerID);
                            privateKey = new ServiceCryptoItem(keyPair.privateKey, params.providerID);
                            this.getMemoryStorage().add(publicKey);
                            this.getMemoryStorage().add(privateKey);
                            keyPairProto = new CryptoKeyPairProto();
                            keyPairProto.privateKey = privateKey.toProto();
                            keyPairProto.publicKey = publicKey.toProto();
                            keyProto = keyPairProto;
                        }
                        else {
                            key = keys;
                            secretKey = new ServiceCryptoItem(key, params.providerID);
                            this.getMemoryStorage().add(secretKey);
                            keyProto = secretKey.toProto();
                        }
                        _c = result;
                        return [4, keyProto.exportProto()];
                    case 9:
                        _c.data = _m.sent();
                        return [3, 59];
                    case 10: return [4, SignActionProto.importProto(action)];
                    case 11:
                        params = _m.sent();
                        return [4, this.getCrypto(params.providerID)];
                    case 12:
                        crypto$$1 = _m.sent();
                        key = this.getMemoryStorage().item(params.key.id).item;
                        _d = result;
                        return [4, crypto$$1.subtle.sign(params.algorithm.toAlgorithm(), key, params.data)];
                    case 13:
                        _d.data = _m.sent();
                        return [3, 59];
                    case 14: return [4, VerifyActionProto.importProto(action)];
                    case 15:
                        params = _m.sent();
                        return [4, this.getCrypto(params.providerID)];
                    case 16:
                        crypto$$1 = _m.sent();
                        key = this.getMemoryStorage().item(params.key.id).item;
                        return [4, crypto$$1.subtle.verify(params.algorithm.toAlgorithm(), key, params.signature, params.data)];
                    case 17:
                        ok = _m.sent();
                        result.data = new Uint8Array([ok ? 1 : 0]).buffer;
                        return [3, 59];
                    case 18: return [4, EncryptActionProto.importProto(action)];
                    case 19:
                        params = _m.sent();
                        return [4, this.getCrypto(params.providerID)];
                    case 20:
                        crypto$$1 = _m.sent();
                        key = this.getMemoryStorage().item(params.key.id).item;
                        _e = result;
                        return [4, crypto$$1.subtle.encrypt(params.algorithm.toAlgorithm(), key, params.data)];
                    case 21:
                        _e.data = _m.sent();
                        return [3, 59];
                    case 22: return [4, DecryptActionProto.importProto(action)];
                    case 23:
                        params = _m.sent();
                        return [4, this.getCrypto(params.providerID)];
                    case 24:
                        crypto$$1 = _m.sent();
                        key = this.getMemoryStorage().item(params.key.id).item;
                        _f = result;
                        return [4, crypto$$1.subtle.decrypt(params.algorithm.toAlgorithm(), key, params.data)];
                    case 25:
                        _f.data = _m.sent();
                        return [3, 59];
                    case 26: return [4, DeriveBitsActionProto.importProto(action)];
                    case 27:
                        params = _m.sent();
                        return [4, this.getCrypto(params.providerID)];
                    case 28:
                        crypto$$1 = _m.sent();
                        key = this.getMemoryStorage().item(params.key.id).item;
                        alg = params.algorithm.toAlgorithm();
                        return [4, CryptoKeyProto.importProto(alg.public)];
                    case 29:
                        publicKey = _m.sent();
                        alg.public = this.getMemoryStorage().item(publicKey.id).item;
                        _g = result;
                        return [4, crypto$$1.subtle.deriveBits(alg, key, params.length)];
                    case 30:
                        _g.data = _m.sent();
                        return [3, 59];
                    case 31: return [4, DeriveKeyActionProto.importProto(action)];
                    case 32:
                        params = _m.sent();
                        return [4, this.getCrypto(params.providerID)];
                    case 33:
                        crypto$$1 = _m.sent();
                        key = this.getMemoryStorage().item(params.key.id).item;
                        alg = params.algorithm.toAlgorithm();
                        return [4, CryptoKeyProto.importProto(alg.public)];
                    case 34:
                        publicKey = _m.sent();
                        alg.public = this.getMemoryStorage().item(publicKey.id).item;
                        return [4, crypto$$1.subtle.deriveKey(alg, key, params.derivedKeyType, params.extractable, params.usage)];
                    case 35:
                        derivedKey = _m.sent();
                        resKey = new ServiceCryptoItem(derivedKey, params.providerID);
                        this.getMemoryStorage().add(resKey);
                        _h = result;
                        return [4, resKey.toProto().exportProto()];
                    case 36:
                        _h.data = _m.sent();
                        return [3, 59];
                    case 37: return [4, WrapKeyActionProto.importProto(action)];
                    case 38:
                        params = _m.sent();
                        return [4, this.getCrypto(params.providerID)];
                    case 39:
                        crypto$$1 = _m.sent();
                        return [4, this.getMemoryStorage().item(params.key.id).item];
                    case 40:
                        key = _m.sent();
                        wrappingKey = this.getMemoryStorage().item(params.wrappingKey.id).item;
                        _j = result;
                        return [4, crypto$$1.subtle.wrapKey(params.format, key, wrappingKey, params.wrapAlgorithm.toAlgorithm())];
                    case 41:
                        _j.data = _m.sent();
                        return [3, 59];
                    case 42: return [4, UnwrapKeyActionProto.importProto(action)];
                    case 43:
                        params = _m.sent();
                        return [4, this.getCrypto(params.providerID)];
                    case 44:
                        crypto$$1 = _m.sent();
                        return [4, this.getMemoryStorage().item(params.unwrappingKey.id).item];
                    case 45:
                        unwrappingKey = _m.sent();
                        return [4, crypto$$1.subtle.unwrapKey(params.format, params.wrappedKey, unwrappingKey, params.unwrapAlgorithm.toAlgorithm(), params.unwrappedKeyAlgorithm.toAlgorithm(), params.extractable, params.keyUsage)];
                    case 46:
                        key = _m.sent();
                        resKey = new ServiceCryptoItem(key, params.providerID);
                        this.getMemoryStorage().add(resKey);
                        _k = result;
                        return [4, resKey.toProto().exportProto()];
                    case 47:
                        _k.data = _m.sent();
                        return [3, 59];
                    case 48: return [4, ExportKeyActionProto.importProto(action)];
                    case 49:
                        params = _m.sent();
                        return [4, this.getCrypto(params.providerID)];
                    case 50:
                        crypto$$1 = _m.sent();
                        return [4, this.getMemoryStorage().item(params.key.id).item];
                    case 51:
                        key = _m.sent();
                        return [4, crypto$$1.subtle.exportKey(params.format, key)];
                    case 52:
                        exportedData = _m.sent();
                        if (params.format.toLowerCase() === "jwk") {
                            json = JSON.stringify(exportedData);
                            result.data = pvtsutils.Convert.FromUtf8String(json);
                        }
                        else {
                            result.data = exportedData;
                        }
                        return [3, 59];
                    case 53: return [4, ImportKeyActionProto.importProto(action)];
                    case 54:
                        params = _m.sent();
                        return [4, this.getCrypto(params.providerID)];
                    case 55:
                        crypto$$1 = _m.sent();
                        keyData = void 0;
                        if (params.format.toLowerCase() === "jwk") {
                            json = pvtsutils.Convert.ToUtf8String(params.keyData);
                            keyData = JSON.parse(json);
                        }
                        else {
                            keyData = params.keyData;
                        }
                        return [4, crypto$$1.subtle.importKey(params.format, keyData, params.algorithm.toAlgorithm(), params.extractable, params.keyUsages)];
                    case 56:
                        key = _m.sent();
                        resKey = new ServiceCryptoItem(key, params.providerID);
                        this.getMemoryStorage().add(resKey);
                        _l = result;
                        return [4, resKey.toProto().exportProto()];
                    case 57:
                        _l.data = _m.sent();
                        return [3, 59];
                    case 58: throw new WebCryptoLocalError(WebCryptoLocalError.CODE.ACTION_NOT_IMPLEMENTED, "Action '" + action.action + "' is not implemented");
                    case 59: return [2, result];
                }
            });
        });
    };
    return SubtleService;
}(Service));

var CryptoService = (function (_super) {
    tslib_1.__extends(CryptoService, _super);
    function CryptoService(server, provider) {
        var _this = _super.call(this, server, provider, [
            IsLoggedInActionProto,
            LoginActionProto,
            LogoutActionProto,
            ResetActionProto,
        ]) || this;
        _this.addService(new SubtleService(server, _this));
        _this.addService(new CertificateStorageService(server, _this));
        _this.addService(new KeyStorageService(server, _this));
        return _this;
    }
    CryptoService.prototype.emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return _super.prototype.emit.apply(this, [event].concat(args));
    };
    CryptoService.prototype.on = function (event, cb) {
        return _super.prototype.on.call(this, event, cb);
    };
    CryptoService.prototype.once = function (event, cb) {
        return _super.prototype.once.call(this, event, cb);
    };
    CryptoService.prototype.getCrypto = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.object.getProvider().getCrypto(id)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    CryptoService.prototype.onMessage = function (session, action) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            var result, _a, params, crypto$$1, params, crypto_1, token, promise, pin, params, crypto$$1, params, crypto$$1;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        result = new ResultProto(action);
                        _a = action.action;
                        switch (_a) {
                            case IsLoggedInActionProto.ACTION: return [3, 1];
                            case LoginActionProto.ACTION: return [3, 4];
                            case LogoutActionProto.ACTION: return [3, 10];
                            case ResetActionProto.ACTION: return [3, 13];
                        }
                        return [3, 18];
                    case 1: return [4, IsLoggedInActionProto.importProto(action)];
                    case 2:
                        params = _b.sent();
                        return [4, this.getCrypto(params.providerID)];
                    case 3:
                        crypto$$1 = _b.sent();
                        result.data = new Uint8Array([crypto$$1.isLoggedIn ? 1 : 0]).buffer;
                        return [3, 19];
                    case 4: return [4, LoginActionProto.importProto(action)];
                    case 5:
                        params = _b.sent();
                        return [4, this.getCrypto(params.providerID)];
                    case 6:
                        crypto_1 = _b.sent();
                        if (!crypto_1.login) return [3, 9];
                        token = crypto_1.slot.getToken();
                        if (!(token.flags & graphene.TokenFlag.LOGIN_REQUIRED)) return [3, 9];
                        if (!(token.flags & graphene.TokenFlag.PROTECTED_AUTHENTICATION_PATH)) return [3, 7];
                        crypto_1.login("");
                        return [3, 9];
                    case 7:
                        promise = new Promise(function (resolve, reject) {
                            _this.emit("notify", {
                                type: "pin",
                                origin: session.headers.origin,
                                label: crypto_1.slot.getToken().label,
                                resolve: resolve,
                                reject: reject,
                            });
                        });
                        return [4, promise];
                    case 8:
                        pin = _b.sent();
                        crypto_1.login(pin);
                        _b.label = 9;
                    case 9: return [3, 19];
                    case 10: return [4, LogoutActionProto.importProto(action)];
                    case 11:
                        params = _b.sent();
                        return [4, this.getCrypto(params.providerID)];
                    case 12:
                        crypto$$1 = _b.sent();
                        if (crypto$$1.logout) {
                            crypto$$1.logout();
                        }
                        return [3, 19];
                    case 13: return [4, ResetActionProto.importProto(action)];
                    case 14:
                        params = _b.sent();
                        return [4, this.getCrypto(params.providerID)];
                    case 15:
                        crypto$$1 = _b.sent();
                        if (!("reset" in crypto$$1)) return [3, 17];
                        return [4, crypto$$1.reset()];
                    case 16:
                        _b.sent();
                        _b.label = 17;
                    case 17: return [3, 19];
                    case 18: throw new WebCryptoLocalError(WebCryptoLocalError.CODE.ACTION_NOT_IMPLEMENTED, "Action '" + action.action + "' is not implemented");
                    case 19: return [2, result];
                }
            });
        });
    };
    return CryptoService;
}(Service));

var ProviderService = (function (_super) {
    tslib_1.__extends(ProviderService, _super);
    function ProviderService(server, options) {
        var _this = _super.call(this, server, new LocalProvider(options), [
            ProviderInfoActionProto,
            ProviderGetCryptoActionProto,
        ]) || this;
        _this.memoryStorage = new MemoryStorage();
        var crypto$$1 = new CryptoService(server, _this);
        _this.addService(crypto$$1);
        _this.object.on("token_new", _this.onTokenNew.bind(_this));
        _this.object.on("token", _this.onToken.bind(_this));
        crypto$$1.on("notify", _this.onNotify.bind(_this));
        return _this;
    }
    ProviderService.prototype.emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return _super.prototype.emit.apply(this, [event].concat(args));
    };
    ProviderService.prototype.on = function (event, cb) {
        return _super.prototype.on.call(this, event, cb);
    };
    ProviderService.prototype.once = function (event, cb) {
        return _super.prototype.once.call(this, event, cb);
    };
    ProviderService.prototype.open = function () {
        var _this = this;
        this.object.open()
            .catch(function (err) {
            _this.emit("error", err);
        })
            .then(function () {
            _this.emit("info", "Provider:Opened");
        });
    };
    ProviderService.prototype.close = function () {
        this.object.crypto.clear();
    };
    ProviderService.prototype.getProvider = function () {
        return this.object;
    };
    ProviderService.prototype.onTokenNew = function (e) {
        this.emit("token_new", e);
    };
    ProviderService.prototype.onToken = function (info) {
        var _this = this;
        if (info.error) {
            this.emit("error", info.error);
        }
        else {
            this.emit("info", "Provider:Token Amount of tokens was changed (+" + info.added.length + "/-" + info.removed.length + ")");
            this.server.sessions.forEach(function (session) {
                if (session.cipher && session.authorized) {
                    info.removed.forEach(function (item, index) {
                        info.removed[index] = new ProviderCryptoProto(item);
                        _this.memoryStorage.removeByProvider(info.removed[index].id);
                    });
                    info.added.forEach(function (item, index) {
                        info.added[index] = new ProviderCryptoProto(item);
                    });
                    _this.server.send(session, new ProviderTokenEventProto(info));
                }
            });
        }
    };
    ProviderService.prototype.onNotify = function (e) {
        this.emit("notify", e);
    };
    ProviderService.prototype.onMessage = function (session, action) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, _a, info, _b, getCryptoParams;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        result = new ResultProto(action);
                        _a = action.action;
                        switch (_a) {
                            case ProviderInfoActionProto.ACTION: return [3, 1];
                            case ProviderGetCryptoActionProto.ACTION: return [3, 3];
                        }
                        return [3, 6];
                    case 1:
                        info = this.object.info;
                        _b = result;
                        return [4, info.exportProto()];
                    case 2:
                        _b.data = _c.sent();
                        return [3, 7];
                    case 3: return [4, ProviderGetCryptoActionProto.importProto(action)];
                    case 4:
                        getCryptoParams = _c.sent();
                        return [4, this.object.getCrypto(getCryptoParams.cryptoID)];
                    case 5:
                        _c.sent();
                        return [3, 7];
                    case 6: throw new WebCryptoLocalError(WebCryptoLocalError.CODE.ACTION_NOT_IMPLEMENTED, "Action '" + action.action + "' is not implemented");
                    case 7: return [2, result];
                }
            });
        });
    };
    return ProviderService;
}(Service));

var LocalServer = (function (_super) {
    tslib_1.__extends(LocalServer, _super);
    function LocalServer(options) {
        var _this = _super.call(this) || this;
        _this.sessions = [];
        _this.server = new Server(options);
        _this.cardReader = new CardReaderService(_this.server)
            .on("info", function (e) {
            _this.emit("info", e);
        })
            .on("error", function (e) {
            _this.emit("error", e);
        });
        _this.provider = new ProviderService(_this.server, options.config)
            .on("info", function (e) {
            _this.emit("info", e);
        })
            .on("error", function (e) {
            _this.emit("error", e);
        })
            .on("notify", function (e) {
            _this.emit("notify", e);
        })
            .on("token_new", function (e) {
            _this.emit("token_new", e);
        });
        return _this;
    }
    LocalServer.prototype.close = function (callback) {
        var _this = this;
        this.cardReader.stop();
        this.server.close(function () {
            _this.provider.close();
            if (callback) {
                callback();
            }
        });
    };
    LocalServer.prototype.listen = function (address) {
        var _this = this;
        this.server
            .on("listening", function (e) {
            _this.emit("listening", e.address);
            _this.provider.open();
        })
            .on("connect", function (session) {
            _this.emit("info", "Server: New session connect " + session.connection.remoteAddress);
            if (!(_this.sessions.length && _this.sessions.some(function (item) { return item === session; }))) {
                _this.emit("info", "Server: Push session to stack");
                _this.sessions.push(session);
            }
        })
            .on("disconnect", function (e) {
            _this.emit("info", "Server: Close session " + e.description + " (code: " + e.reasonCode + ")");
        })
            .on("info", function (message) {
            _this.emit("info", message);
        })
            .on("error", function (e) {
            _this.emit("error", e.error);
        })
            .on("message", function (e) {
            (function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    if (e.message.action === ServerIsLoggedInActionProto.ACTION ||
                        e.message.action === ServerLoginActionProto.ACTION) {
                        this.onMessage(e.session, e.message)
                            .then(e.resolve, e.reject);
                    }
                    return [2];
                });
            }); })()
                .catch(function (error) {
                _this.emit("error", error);
            });
        })
            .on("auth", function (session) {
            _this.emit("info", "Server: session auth");
            _this.server.send(session, new ProviderAuthorizedEventProto())
                .catch(function (e) {
                _this.emit("error", e);
            });
        });
        this.server.listen(address);
        this.cardReader.start();
        return this;
    };
    LocalServer.prototype.on = function (event, cb) {
        return _super.prototype.on.call(this, event, cb);
    };
    LocalServer.prototype.onMessage = function (session, action) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            var resultProto, data, _a, pin_1, promise, ok, remoteIdentityEx;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        resultProto = new ResultProto(action);
                        _a = action.action;
                        switch (_a) {
                            case ServerIsLoggedInActionProto.ACTION: return [3, 1];
                            case ServerLoginActionProto.ACTION: return [3, 2];
                        }
                        return [3, 6];
                    case 1:
                        {
                            data = new Uint8Array([session.authorized ? 1 : 0]).buffer;
                            return [3, 7];
                        }
                        _b.label = 2;
                    case 2:
                        if (!!session.authorized) return [3, 5];
                        return [4, challenge(session.identity.signingKey.publicKey, session.cipher.remoteIdentity.signingKey)];
                    case 3:
                        pin_1 = _b.sent();
                        promise = new Promise(function (resolve, reject) {
                            _this.emit("notify", {
                                type: "2key",
                                origin: session.headers.origin,
                                pin: pin_1,
                                resolve: resolve,
                                reject: reject,
                            });
                        });
                        return [4, promise];
                    case 4:
                        ok = _b.sent();
                        if (ok) {
                            remoteIdentityEx = session.cipher.remoteIdentity;
                            remoteIdentityEx.origin = session.headers.origin;
                            remoteIdentityEx.userAgent = session.headers["user-agent"];
                            this.server.storage.saveRemoteIdentity(session.cipher.remoteIdentity.signingKey.id, remoteIdentityEx);
                            session.authorized = true;
                        }
                        else {
                            throw new WebCryptoLocalError(WebCryptoLocalError.CODE.RATCHET_KEY_NOT_APPROVED);
                        }
                        _b.label = 5;
                    case 5: return [3, 7];
                    case 6: throw new WebCryptoLocalError("Action '" + action.action + "' is not implemented");
                    case 7:
                        resultProto.data = data;
                        return [2, resultProto];
                }
            });
        });
    };
    return LocalServer;
}(events.EventEmitter));

exports.LocalServer = LocalServer;
exports.WebCryptoLocalError = WebCryptoLocalError;
