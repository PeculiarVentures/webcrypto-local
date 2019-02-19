import { Type, Field } from 'protobufjs';

function PrepareBuffer(buffer) {
    if (typeof Buffer !== "undefined") {
        return new Uint8Array(buffer);
    }
    else {
        return new Uint8Array(buffer instanceof ArrayBuffer ? buffer : buffer.buffer);
    }
}
class Convert {
    static ToString(buffer, enc = "utf8") {
        const buf = PrepareBuffer(buffer);
        switch (enc.toLowerCase()) {
            case "utf8":
                return this.ToUtf8String(buf);
            case "binary":
                return this.ToBinary(buf);
            case "hex":
                return this.ToHex(buf);
            case "base64":
                return this.ToBase64(buf);
            case "base64url":
                return this.ToBase64Url(buf);
            default:
                throw new Error(`Unknown type of encoding '${enc}'`);
        }
    }
    static FromString(str, enc = "utf8") {
        switch (enc.toLowerCase()) {
            case "utf8":
                return this.FromUtf8String(str);
            case "binary":
                return this.FromBinary(str);
            case "hex":
                return this.FromHex(str);
            case "base64":
                return this.FromBase64(str);
            case "base64url":
                return this.FromBase64Url(str);
            default:
                throw new Error(`Unknown type of encoding '${enc}'`);
        }
    }
    static ToBase64(buffer) {
        const buf = PrepareBuffer(buffer);
        if (typeof btoa !== "undefined") {
            const binary = this.ToString(buf, "binary");
            return btoa(binary);
        }
        else {
            return Buffer.from(buf).toString("base64");
        }
    }
    static FromBase64(base64Text) {
        base64Text = base64Text.replace(/\n/g, "").replace(/\r/g, "").replace(/\t/g, "").replace(/\s/g, "");
        if (typeof atob !== "undefined") {
            return this.FromBinary(atob(base64Text));
        }
        else {
            return new Uint8Array(Buffer.from(base64Text, "base64")).buffer;
        }
    }
    static FromBase64Url(base64url) {
        return this.FromBase64(this.Base64Padding(base64url.replace(/\-/g, "+").replace(/\_/g, "/")));
    }
    static ToBase64Url(data) {
        return this.ToBase64(data).replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, "");
    }
    static FromUtf8String(text) {
        const s = unescape(encodeURIComponent(text));
        const uintArray = new Uint8Array(s.length);
        for (let i = 0; i < s.length; i++) {
            uintArray[i] = s.charCodeAt(i);
        }
        return uintArray.buffer;
    }
    static ToUtf8String(buffer) {
        const buf = PrepareBuffer(buffer);
        const encodedString = String.fromCharCode.apply(null, buf);
        const decodedString = decodeURIComponent(escape(encodedString));
        return decodedString;
    }
    static FromBinary(text) {
        const stringLength = text.length;
        const resultView = new Uint8Array(stringLength);
        for (let i = 0; i < stringLength; i++) {
            resultView[i] = text.charCodeAt(i);
        }
        return resultView.buffer;
    }
    static ToBinary(buffer) {
        const buf = PrepareBuffer(buffer);
        let resultString = "";
        const len = buf.length;
        for (let i = 0; i < len; i++) {
            resultString = resultString + String.fromCharCode(buf[i]);
        }
        return resultString;
    }
    static ToHex(buffer) {
        const buf = PrepareBuffer(buffer);
        const splitter = "";
        const res = [];
        const len = buf.length;
        for (let i = 0; i < len; i++) {
            const char = buf[i].toString(16);
            res.push(char.length === 1 ? "0" + char : char);
        }
        return res.join(splitter);
    }
    static FromHex(hexString) {
        const res = new Uint8Array(hexString.length / 2);
        for (let i = 0; i < hexString.length; i = i + 2) {
            const c = hexString.slice(i, i + 2);
            res[i / 2] = parseInt(c, 16);
        }
        return res.buffer;
    }
    static Base64Padding(base64) {
        const padCount = 4 - (base64.length % 4);
        if (padCount < 4) {
            for (let i = 0; i < padCount; i++) {
                base64 += "=";
            }
        }
        return base64;
    }
}

function assign(target, ...sources) {
    const res = arguments[0];
    for (let i = 1; i < arguments.length; i++) {
        const obj = arguments[i];
        for (const prop in obj) {
            res[prop] = obj[prop];
        }
    }
    return res;
}
function combine(...buf) {
    const totalByteLength = buf.map((item) => item.byteLength).reduce((prev, cur) => prev + cur);
    const res = new Uint8Array(totalByteLength);
    let currentPos = 0;
    buf.map((item) => new Uint8Array(item)).forEach((arr) => {
        for (let i = 0; i < arr.length; i++) {
            res[currentPos++] = arr[i];
        }
    });
    return res.buffer;
}
function isEqual(bytes1, bytes2) {
    if (!(bytes1 && bytes2)) {
        return false;
    }
    if (bytes1.byteLength !== bytes2.byteLength) {
        return false;
    }
    const b1 = new Uint8Array(bytes1);
    const b2 = new Uint8Array(bytes2);
    for (let i = 0; i < bytes1.byteLength; i++) {
        if (b1[i] !== b2[i]) {
            return false;
        }
    }
    return true;
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var ArrayBufferConverter = (function () {
    function ArrayBufferConverter() {
    }
    ArrayBufferConverter.set = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Uint8Array(value)];
            });
        });
    };
    ArrayBufferConverter.get = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Uint8Array(value).buffer];
            });
        });
    };
    return ArrayBufferConverter;
}());

function ProtobufElement(params) {
    return function (target) {
        var t = target;
        t.localName = params.name || t.name || t.toString().match(/^function\s*([^\s(]+)/)[1];
        t.items = t.items || {};
        t.target = target;
        t.items = assign({}, t.items);
        var scheme = new Type(t.localName);
        for (var key in t.items) {
            var item = t.items[key];
            var rule = void 0;
            if (item.repeated) {
                rule = "repeated";
            }
            else if (item.required) {
                rule = "required";
            }
            scheme.add(new Field(item.name, item.id, item.type, rule));
        }
        t.protobuf = scheme;
    };
}
function defineProperty(target, key, params) {
    var propertyKey = "_" + key;
    var opt = {
        set: function (v) {
            if (this[propertyKey] !== v) {
                this.raw = null;
                this[propertyKey] = v;
            }
        },
        get: function () {
            if (this[propertyKey] === void 0) {
                var defaultValue = params.defaultValue;
                if (params.parser && !params.repeated) {
                    defaultValue = new params.parser();
                }
                this[propertyKey] = defaultValue;
            }
            return this[propertyKey];
        },
        enumerable: true,
    };
    Object.defineProperty(target, propertyKey, { writable: true, enumerable: false });
    Object.defineProperty(target, key, opt);
}
function ProtobufProperty(params) {
    return function (target, propertyKey) {
        var t = target.constructor;
        var key = propertyKey;
        t.items = t.items || {};
        if (t.target !== t) {
            t.items = assign({}, t.items);
            t.target = t;
        }
        t.items[key] = {
            id: params.id,
            type: params.type || "bytes",
            defaultValue: params.defaultValue,
            converter: params.converter || null,
            parser: params.parser || null,
        };
        params.name = params.name || key;
        t.items[key].name = params.name;
        t.items[key].required = params.required || false;
        t.items[key].repeated = params.repeated || false;
        defineProperty(target, key, t.items[key]);
    };
}

var ObjectProto = (function () {
    function ObjectProto() {
    }
    ObjectProto.importProto = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        res = new this();
                        return [4 /*yield*/, res.importProto(data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, res];
                }
            });
        });
    };
    ObjectProto.prototype.isEmpty = function () {
        return this.raw === undefined;
    };
    ObjectProto.prototype.hasChanged = function () {
        if (this.raw === null) {
            return true;
        }
        var thisStatic = this.constructor;
        var that = this;
        for (var key in thisStatic.items) {
            var item = thisStatic.items[key];
            if (item.repeated) {
                if (item.parser) {
                    return that[key].some(function (arrayItem) { return arrayItem.hasChanged(); });
                }
            }
            else {
                if (item.parser && that[key] && that[key].hasChanged()) {
                    return true;
                }
            }
        }
        return false;
    };
    ObjectProto.prototype.importProto = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var thisStatic, that, scheme, raw, _a, _b, _i, key, item, schemeValues, _c, schemeValues_1, schemeValue, _d, _e, _g, _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        thisStatic = this.constructor;
                        that = this;
                        if (!(data instanceof ObjectProto)) return [3 /*break*/, 2];
                        return [4 /*yield*/, data.exportProto()];
                    case 1:
                        raw = _j.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        raw = data;
                        _j.label = 3;
                    case 3:
                        try {
                            scheme = thisStatic.protobuf.decode(new Uint8Array(raw));
                        }
                        catch (e) {
                            throw new Error("Error: Cannot decode message for " + thisStatic.localName + ".\n$ProtobufError: " + e.message);
                        }
                        _a = [];
                        for (_b in thisStatic.items)
                            _a.push(_b);
                        _i = 0;
                        _j.label = 4;
                    case 4:
                        if (!(_i < _a.length)) return [3 /*break*/, 11];
                        key = _a[_i];
                        item = thisStatic.items[key];
                        schemeValues = scheme[item.name];
                        if (ArrayBuffer.isView(schemeValues)) {
                            schemeValues = new Uint8Array(schemeValues);
                        }
                        if (!Array.isArray(schemeValues)) {
                            if (item.repeated) {
                                that[key] = schemeValues = [];
                            }
                            else {
                                schemeValues = [schemeValues];
                            }
                        }
                        if (item.repeated && !that[key]) {
                            that[key] = [];
                        }
                        _c = 0, schemeValues_1 = schemeValues;
                        _j.label = 5;
                    case 5:
                        if (!(_c < schemeValues_1.length)) return [3 /*break*/, 10];
                        schemeValue = schemeValues_1[_c];
                        if (!item.repeated) return [3 /*break*/, 7];
                        _e = (_d = that[key]).push;
                        return [4 /*yield*/, this.importItem(item, schemeValue)];
                    case 6:
                        _e.apply(_d, [_j.sent()]);
                        return [3 /*break*/, 9];
                    case 7:
                        _g = that;
                        _h = key;
                        return [4 /*yield*/, this.importItem(item, schemeValue)];
                    case 8:
                        _g[_h] = _j.sent();
                        _j.label = 9;
                    case 9:
                        _c++;
                        return [3 /*break*/, 5];
                    case 10:
                        _i++;
                        return [3 /*break*/, 4];
                    case 11:
                        this.raw = raw;
                        return [2 /*return*/];
                }
            });
        });
    };
    ObjectProto.prototype.exportProto = function () {
        return __awaiter(this, void 0, void 0, function () {
            var thisStatic, that, protobuf, _a, _b, _i, key, item, values, _c, values_1, value, protobufValue;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!this.hasChanged()) {
                            return [2 /*return*/, this.raw];
                        }
                        thisStatic = this.constructor;
                        that = this;
                        protobuf = {};
                        _a = [];
                        for (_b in thisStatic.items)
                            _a.push(_b);
                        _i = 0;
                        _d.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        key = _a[_i];
                        item = thisStatic.items[key];
                        values = that[key];
                        if (!Array.isArray(values)) {
                            values = values === void 0 ? [] : [values];
                        }
                        _c = 0, values_1 = values;
                        _d.label = 2;
                    case 2:
                        if (!(_c < values_1.length)) return [3 /*break*/, 5];
                        value = values_1[_c];
                        return [4 /*yield*/, this.exportItem(item, value)];
                    case 3:
                        protobufValue = _d.sent();
                        if (item.repeated) {
                            if (!protobuf[item.name]) {
                                protobuf[item.name] = [];
                            }
                            protobuf[item.name].push(protobufValue);
                        }
                        else {
                            protobuf[item.name] = protobufValue;
                        }
                        _d.label = 4;
                    case 4:
                        _c++;
                        return [3 /*break*/, 2];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6:
                        this.raw = new Uint8Array(thisStatic.protobuf.encode(protobuf).finish()).buffer;
                        return [2 /*return*/, this.raw];
                }
            });
        });
    };
    ObjectProto.prototype.exportItem = function (template, value) {
        return __awaiter(this, void 0, void 0, function () {
            var thisStatic, result, obj, raw;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        thisStatic = this.constructor;
                        if (!template.parser) return [3 /*break*/, 2];
                        obj = value;
                        return [4 /*yield*/, obj.exportProto()];
                    case 1:
                        raw = _a.sent();
                        if (template.required && !raw) {
                            throw new Error("Error: Paramter '" + template.name + "' is required in '" + thisStatic.localName + "' protobuf message.");
                        }
                        if (raw) {
                            result = new Uint8Array(raw);
                        }
                        return [3 /*break*/, 6];
                    case 2:
                        if (template.required && value === void 0) {
                            throw new Error("Error: Paramter '" + template.name + "' is required in '" + thisStatic.localName + "' protobuf message.");
                        }
                        if (!template.converter) return [3 /*break*/, 5];
                        if (!value) return [3 /*break*/, 4];
                        return [4 /*yield*/, template.converter.set(value)];
                    case 3:
                        result = _a.sent();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        if (value instanceof ArrayBuffer) {
                            value = new Uint8Array(value);
                        }
                        result = value;
                        _a.label = 6;
                    case 6: return [2 /*return*/, result];
                }
            });
        });
    };
    ObjectProto.prototype.importItem = function (template, value) {
        return __awaiter(this, void 0, void 0, function () {
            var thisStatic, result, parser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        thisStatic = this.constructor;
                        if (!template.parser) return [3 /*break*/, 4];
                        parser = template.parser;
                        if (!(value && value.byteLength)) return [3 /*break*/, 2];
                        return [4 /*yield*/, parser.importProto(new Uint8Array(value).buffer)];
                    case 1:
                        result = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        if (template.required) {
                            throw new Error("Error: Parameter '" + template.name + "' is required in '" + thisStatic.localName + "' protobuf message.");
                        }
                        _a.label = 3;
                    case 3: return [3 /*break*/, 9];
                    case 4:
                        if (!template.converter) return [3 /*break*/, 8];
                        if (!(value && value.byteLength)) return [3 /*break*/, 6];
                        return [4 /*yield*/, template.converter.get(value)];
                    case 5:
                        result = _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        if (template.required) {
                            throw new Error("Error: Parameter '" + template.name + "' is required in '" + thisStatic.localName + "' protobuf message.");
                        }
                        _a.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        result = value;
                        _a.label = 9;
                    case 9: return [2 /*return*/, result];
                }
            });
        });
    };
    return ObjectProto;
}());

var domain;

// This constructor is used to store event handlers. Instantiating this is
// faster than explicitly calling `Object.create(null)` to get a "clean" empty
// object (tested with v8 v4.9).
function EventHandlers() {}
EventHandlers.prototype = Object.create(null);

function EventEmitter() {
  EventEmitter.init.call(this);
}

// nodejs oddity
// require('events') === require('events').EventEmitter
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.usingDomains = false;

EventEmitter.prototype.domain = undefined;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

EventEmitter.init = function() {
  this.domain = null;
  if (EventEmitter.usingDomains) {
    // if there is an active domain, then attach to it.
    if (domain.active && !(this instanceof domain.Domain)) ;
  }

  if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
    this._events = new EventHandlers();
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events, domain;
  var doError = (type === 'error');

  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;

  domain = this.domain;

  // If there is no 'error' event listener then throw.
  if (doError) {
    er = arguments[1];
    if (domain) {
      if (!er)
        er = new Error('Uncaught, unspecified "error" event');
      er.domainEmitter = this;
      er.domain = domain;
      er.domainThrown = false;
      domain.emit('error', er);
    } else if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
  }

  handler = events[type];

  if (!handler)
    return false;

  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
    // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
    // slower
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');

  events = target._events;
  if (!events) {
    events = target._events = new EventHandlers();
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] :
                                          [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
                            existing.length + ' ' + type + ' listeners added. ' +
                            'Use emitter.setMaxListeners() to increase limit');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        emitWarning(w);
      }
    }
  }

  return target;
}
function emitWarning(e) {
  typeof console.warn === 'function' ? console.warn(e) : console.log(e);
}
EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function _onceWrap(target, type, listener) {
  var fired = false;
  function g() {
    target.removeListener(type, g);
    if (!fired) {
      fired = true;
      listener.apply(target, arguments);
    }
  }
  g.listener = listener;
  return g;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = this._events;
      if (!events)
        return this;

      list = events[type];
      if (!list)
        return this;

      if (list === listener || (list.listener && list.listener === listener)) {
        if (--this._eventsCount === 0)
          this._events = new EventHandlers();
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length; i-- > 0;) {
          if (list[i] === listener ||
              (list[i].listener && list[i].listener === listener)) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (list.length === 1) {
          list[0] = undefined;
          if (--this._eventsCount === 0) {
            this._events = new EventHandlers();
            return this;
          } else {
            delete events[type];
          }
        } else {
          spliceOne(list, position);
        }

        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events;

      events = this._events;
      if (!events)
        return this;

      // not listening for removeListener, no need to emit
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = new EventHandlers();
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = new EventHandlers();
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        for (var i = 0, key; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = new EventHandlers();
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        // LIFO order
        do {
          this.removeListener(type, listeners[listeners.length - 1]);
        } while (listeners[0]);
      }

      return this;
    };

EventEmitter.prototype.listeners = function listeners(type) {
  var evlistener;
  var ret;
  var events = this._events;

  if (!events)
    ret = [];
  else {
    evlistener = events[type];
    if (!evlistener)
      ret = [];
    else if (typeof evlistener === 'function')
      ret = [evlistener.listener || evlistener];
    else
      ret = unwrapListeners(evlistener);
  }

  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function arrayClone(arr, i) {
  var copy = new Array(i);
  while (i--)
    copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

/**
 *
 * 2key-ratchet
 * Copyright (c) 2019 Peculiar Ventures, Inc
 * Based on https://whispersystems.org/docs/specifications/doubleratchet/ and
 * https://whispersystems.org/docs/specifications/x3dh/ by Open Whisper Systems
 *
 */

const SIGN_ALGORITHM_NAME = "ECDSA";
const DH_ALGORITHM_NAME = "ECDH";
const SECRET_KEY_NAME = "AES-CBC";
const HASH_NAME = "SHA-256";
const HMAC_NAME = "HMAC";
const MAX_RATCHET_STACK_SIZE = 20;
const INFO_TEXT = Convert.FromBinary("InfoText");
const INFO_RATCHET = Convert.FromBinary("InfoRatchet");
const INFO_MESSAGE_KEYS = Convert.FromBinary("InfoMessageKeys");

let engine = null;
if (typeof self !== "undefined") {
    engine = {
        crypto: self.crypto,
        name: "WebCrypto",
    };
}
function setEngine(name, crypto) {
    engine = {
        crypto,
        name,
    };
}
function getEngine() {
    if (!engine) {
        throw new Error("WebCrypto engine is empty. Use setEngine to resolve it.");
    }
    return engine;
}

class Curve {
    static async generateKeyPair(type) {
        const name = type;
        const usage = type === "ECDSA" ? ["sign", "verify"] : ["deriveKey", "deriveBits"];
        const keys = await getEngine().crypto.subtle.generateKey({ name, namedCurve: this.NAMED_CURVE }, false, usage);
        const publicKey = await ECPublicKey.create(keys.publicKey);
        const res = {
            privateKey: keys.privateKey,
            publicKey,
        };
        return res;
    }
    static deriveBytes(privateKey, publicKey) {
        return getEngine().crypto.subtle.deriveBits({ name: "ECDH", public: publicKey.key }, privateKey, 256);
    }
    static verify(signingKey, message, signature) {
        return getEngine().crypto.subtle
            .verify({ name: "ECDSA", hash: this.DIGEST_ALGORITHM }, signingKey.key, signature, message);
    }
    static async sign(signingKey, message) {
        return getEngine().crypto.subtle.sign({ name: "ECDSA", hash: this.DIGEST_ALGORITHM }, signingKey, message);
    }
    static async ecKeyPairToJson(key) {
        return {
            privateKey: key.privateKey,
            publicKey: key.publicKey.key,
            thumbprint: await key.publicKey.thumbprint(),
        };
    }
    static async ecKeyPairFromJson(keys) {
        return {
            privateKey: keys.privateKey,
            publicKey: await ECPublicKey.create(keys.publicKey),
        };
    }
}
Curve.NAMED_CURVE = "P-256";
Curve.DIGEST_ALGORITHM = "SHA-512";

const AES_ALGORITHM = { name: "AES-CBC", length: 256 };
class Secret {
    static randomBytes(size) {
        const array = new Uint8Array(size);
        getEngine().crypto.getRandomValues(array);
        return array.buffer;
    }
    static digest(alg, message) {
        return getEngine().crypto.subtle.digest(alg, message);
    }
    static encrypt(key, data, iv) {
        return getEngine().crypto.subtle.encrypt({ name: SECRET_KEY_NAME, iv: new Uint8Array(iv) }, key, data);
    }
    static decrypt(key, data, iv) {
        return getEngine().crypto.subtle.decrypt({ name: SECRET_KEY_NAME, iv: new Uint8Array(iv) }, key, data);
    }
    static importHMAC(raw) {
        return getEngine().crypto.subtle
            .importKey("raw", raw, { name: HMAC_NAME, hash: { name: HASH_NAME } }, false, ["sign", "verify"]);
    }
    static importAES(raw) {
        return getEngine().crypto.subtle.importKey("raw", raw, AES_ALGORITHM, false, ["encrypt", "decrypt"]);
    }
    static async sign(key, data) {
        return await getEngine().crypto.subtle.sign({ name: HMAC_NAME, hash: HASH_NAME }, key, data);
    }
    static async HKDF(IKM, keysCount = 1, salt, info = new ArrayBuffer(0)) {
        if (!salt) {
            salt = await this.importHMAC(new Uint8Array(32).buffer);
        }
        const PRKBytes = await this.sign(salt, IKM);
        const infoBuffer = new ArrayBuffer(32 + info.byteLength + 1);
        const PRK = await this.importHMAC(PRKBytes);
        const T = [new ArrayBuffer(0)];
        for (let i = 0; i < keysCount; i++) {
            T[i + 1] = await this.sign(PRK, combine(T[i], info, new Uint8Array([i + 1]).buffer));
        }
        return T.slice(1);
    }
}

class ECPublicKey {
    static async create(publicKey) {
        const res = new this();
        const algName = publicKey.algorithm.name.toUpperCase();
        if (!(algName === "ECDH" || algName === "ECDSA")) {
            throw new Error("Error: Unsupported asymmetric key algorithm.");
        }
        if (publicKey.type !== "public") {
            throw new Error("Error: Expected key type to be public but it was not.");
        }
        res.key = publicKey;
        const jwk = await getEngine().crypto.subtle.exportKey("jwk", publicKey);
        if (!(jwk.x && jwk.y)) {
            throw new Error("Wrong JWK data for EC public key. Parameters x and y are required.");
        }
        const x = Convert.FromBase64Url(jwk.x);
        const y = Convert.FromBase64Url(jwk.y);
        const xy = Convert.ToBinary(x) + Convert.ToBinary(y);
        res.serialized = Convert.FromBinary(xy);
        res.id = await res.thumbprint();
        return res;
    }
    static async importKey(bytes, type) {
        const x = Convert.ToBase64Url(bytes.slice(0, 32));
        const y = Convert.ToBase64Url(bytes.slice(32));
        const jwk = {
            crv: Curve.NAMED_CURVE,
            kty: "EC",
            x,
            y,
        };
        const usage = (type === "ECDSA" ? ["verify"] : []);
        const key = await getEngine().crypto.subtle
            .importKey("jwk", jwk, { name: type, namedCurve: Curve.NAMED_CURVE }, true, usage);
        const res = await ECPublicKey.create(key);
        return res;
    }
    serialize() {
        return this.serialized;
    }
    async thumbprint() {
        const bytes = await this.serialize();
        const thumbprint = await Secret.digest("SHA-256", bytes);
        return Convert.ToHex(thumbprint);
    }
    async isEqual(other) {
        if (!(other && other instanceof ECPublicKey)) {
            return false;
        }
        return isEqual(this.serialized, other.serialized);
    }
}

class Identity {
    static async fromJSON(obj) {
        const signingKey = await Curve.ecKeyPairFromJson(obj.signingKey);
        const exchangeKey = await Curve.ecKeyPairFromJson(obj.exchangeKey);
        const res = new this(obj.id, signingKey, exchangeKey);
        res.createdAt = new Date(obj.createdAt);
        await res.fromJSON(obj);
        return res;
    }
    static async create(id, signedPreKeyAmount = 0, preKeyAmount = 0) {
        const signingKey = await Curve.generateKeyPair(SIGN_ALGORITHM_NAME);
        const exchangeKey = await Curve.generateKeyPair(DH_ALGORITHM_NAME);
        const res = new Identity(id, signingKey, exchangeKey);
        res.createdAt = new Date();
        for (let i = 0; i < preKeyAmount; i++) {
            res.preKeys.push(await Curve.generateKeyPair("ECDH"));
        }
        for (let i = 0; i < signedPreKeyAmount; i++) {
            res.signedPreKeys.push(await Curve.generateKeyPair("ECDH"));
        }
        return res;
    }
    constructor(id, signingKey, exchangeKey) {
        this.id = id;
        this.signingKey = signingKey;
        this.exchangeKey = exchangeKey;
        this.preKeys = [];
        this.signedPreKeys = [];
    }
    async toJSON() {
        const preKeys = [];
        const signedPreKeys = [];
        for (const key of this.preKeys) {
            preKeys.push(await Curve.ecKeyPairToJson(key));
        }
        for (const key of this.signedPreKeys) {
            signedPreKeys.push(await Curve.ecKeyPairToJson(key));
        }
        return {
            createdAt: this.createdAt.toISOString(),
            exchangeKey: await Curve.ecKeyPairToJson(this.exchangeKey),
            id: this.id,
            preKeys,
            signedPreKeys,
            signingKey: await Curve.ecKeyPairToJson(this.signingKey),
        };
    }
    async fromJSON(obj) {
        this.id = obj.id;
        this.signingKey = await Curve.ecKeyPairFromJson(obj.signingKey);
        this.exchangeKey = await Curve.ecKeyPairFromJson(obj.exchangeKey);
        this.preKeys = [];
        for (const key of obj.preKeys) {
            this.preKeys.push(await Curve.ecKeyPairFromJson(key));
        }
        this.signedPreKeys = [];
        for (const key of obj.signedPreKeys) {
            this.signedPreKeys.push(await Curve.ecKeyPairFromJson(key));
        }
    }
}

class RemoteIdentity {
    static fill(protocol) {
        const res = new RemoteIdentity();
        res.fill(protocol);
        return res;
    }
    static async fromJSON(obj) {
        const res = new this();
        await res.fromJSON(obj);
        return res;
    }
    fill(protocol) {
        this.signingKey = protocol.signingKey;
        this.exchangeKey = protocol.exchangeKey;
        this.signature = protocol.signature;
        this.createdAt = protocol.createdAt;
    }
    verify() {
        return Curve.verify(this.signingKey, this.exchangeKey.serialize(), this.signature);
    }
    async toJSON() {
        return {
            createdAt: this.createdAt.toISOString(),
            exchangeKey: await this.exchangeKey.key,
            id: this.id,
            signature: this.signature,
            signingKey: await this.signingKey.key,
            thumbprint: await this.signingKey.thumbprint(),
        };
    }
    async fromJSON(obj) {
        this.id = obj.id;
        this.signature = obj.signature;
        this.signingKey = await ECPublicKey.create(obj.signingKey);
        this.exchangeKey = await ECPublicKey.create(obj.exchangeKey);
        this.createdAt = new Date(obj.createdAt);
        const ok = await this.verify();
        if (!ok) {
            throw new Error("Error: Wrong signature for RemoteIdentity");
        }
    }
}

let BaseProtocol = class BaseProtocol extends ObjectProto {
};
__decorate([
    ProtobufProperty({ id: 0, type: "uint32", defaultValue: 1 })
], BaseProtocol.prototype, "version", void 0);
BaseProtocol = __decorate([
    ProtobufElement({ name: "Base" })
], BaseProtocol);

class ECDSAPublicKeyConverter {
    static async set(value) {
        return new Uint8Array(value.serialize());
    }
    static async get(value) {
        return ECPublicKey.importKey(value.buffer, "ECDSA");
    }
}
class ECDHPublicKeyConverter {
    static async set(value) {
        return new Uint8Array(value.serialize());
    }
    static async get(value) {
        return ECPublicKey.importKey(value.buffer, "ECDH");
    }
}
class DateConverter {
    static async set(value) {
        return new Uint8Array(Convert.FromString(value.toISOString()));
    }
    static async get(value) {
        return new Date(Convert.ToString(value));
    }
}

var IdentityProtocol_1;
let IdentityProtocol = IdentityProtocol_1 = class IdentityProtocol extends BaseProtocol {
    static async fill(identity) {
        const res = new IdentityProtocol_1();
        await res.fill(identity);
        return res;
    }
    async sign(key) {
        this.signature = await Curve.sign(key, this.exchangeKey.serialize());
    }
    async verify() {
        return await Curve.verify(this.signingKey, this.exchangeKey.serialize(), this.signature);
    }
    async fill(identity) {
        this.signingKey = identity.signingKey.publicKey;
        this.exchangeKey = identity.exchangeKey.publicKey;
        this.createdAt = identity.createdAt;
        await this.sign(identity.signingKey.privateKey);
    }
};
__decorate([
    ProtobufProperty({ id: 1, converter: ECDSAPublicKeyConverter })
], IdentityProtocol.prototype, "signingKey", void 0);
__decorate([
    ProtobufProperty({ id: 2, converter: ECDHPublicKeyConverter })
], IdentityProtocol.prototype, "exchangeKey", void 0);
__decorate([
    ProtobufProperty({ id: 3 })
], IdentityProtocol.prototype, "signature", void 0);
__decorate([
    ProtobufProperty({ id: 4, converter: DateConverter })
], IdentityProtocol.prototype, "createdAt", void 0);
IdentityProtocol = IdentityProtocol_1 = __decorate([
    ProtobufElement({ name: "Identity" })
], IdentityProtocol);

let MessageProtocol = class MessageProtocol extends BaseProtocol {
};
__decorate([
    ProtobufProperty({ id: 1, converter: ECDHPublicKeyConverter, required: true })
], MessageProtocol.prototype, "senderRatchetKey", void 0);
__decorate([
    ProtobufProperty({ id: 2, type: "uint32", required: true })
], MessageProtocol.prototype, "counter", void 0);
__decorate([
    ProtobufProperty({ id: 3, type: "uint32", required: true })
], MessageProtocol.prototype, "previousCounter", void 0);
__decorate([
    ProtobufProperty({ id: 4, converter: ArrayBufferConverter, required: true })
], MessageProtocol.prototype, "cipherText", void 0);
MessageProtocol = __decorate([
    ProtobufElement({ name: "Message" })
], MessageProtocol);

let MessageSignedProtocol = class MessageSignedProtocol extends BaseProtocol {
    async sign(hmacKey) {
        this.signature = await this.signHMAC(hmacKey);
    }
    async verify(hmacKey) {
        const signature = await this.signHMAC(hmacKey);
        return isEqual(signature, this.signature);
    }
    async getSignedRaw() {
        const receiverKey = this.receiverKey.serialize();
        const senderKey = this.senderKey.serialize();
        const message = await this.message.exportProto();
        const data = combine(receiverKey, senderKey, message);
        return data;
    }
    async signHMAC(macKey) {
        const data = await this.getSignedRaw();
        const signature = await Secret.sign(macKey, data);
        return signature;
    }
};
__decorate([
    ProtobufProperty({ id: 1, converter: ECDSAPublicKeyConverter, required: true })
], MessageSignedProtocol.prototype, "senderKey", void 0);
__decorate([
    ProtobufProperty({ id: 2, parser: MessageProtocol, required: true })
], MessageSignedProtocol.prototype, "message", void 0);
__decorate([
    ProtobufProperty({ id: 3, required: true })
], MessageSignedProtocol.prototype, "signature", void 0);
MessageSignedProtocol = __decorate([
    ProtobufElement({ name: "MessageSigned" })
], MessageSignedProtocol);

let PreKeyMessageProtocol = class PreKeyMessageProtocol extends BaseProtocol {
};
__decorate([
    ProtobufProperty({ id: 1, type: "uint32", required: true })
], PreKeyMessageProtocol.prototype, "registrationId", void 0);
__decorate([
    ProtobufProperty({ id: 2, type: "uint32" })
], PreKeyMessageProtocol.prototype, "preKeyId", void 0);
__decorate([
    ProtobufProperty({ id: 3, type: "uint32", required: true })
], PreKeyMessageProtocol.prototype, "preKeySignedId", void 0);
__decorate([
    ProtobufProperty({ id: 4, converter: ECDHPublicKeyConverter, required: true })
], PreKeyMessageProtocol.prototype, "baseKey", void 0);
__decorate([
    ProtobufProperty({ id: 5, parser: IdentityProtocol, required: true })
], PreKeyMessageProtocol.prototype, "identity", void 0);
__decorate([
    ProtobufProperty({ id: 6, parser: MessageSignedProtocol, required: true })
], PreKeyMessageProtocol.prototype, "signedMessage", void 0);
PreKeyMessageProtocol = __decorate([
    ProtobufElement({ name: "PreKeyMessage" })
], PreKeyMessageProtocol);

let PreKeyProtocol = class PreKeyProtocol extends BaseProtocol {
};
__decorate([
    ProtobufProperty({ id: 1, type: "uint32", required: true })
], PreKeyProtocol.prototype, "id", void 0);
__decorate([
    ProtobufProperty({ id: 2, converter: ECDHPublicKeyConverter, required: true })
], PreKeyProtocol.prototype, "key", void 0);
PreKeyProtocol = __decorate([
    ProtobufElement({ name: "PreKey" })
], PreKeyProtocol);

let PreKeySignedProtocol = class PreKeySignedProtocol extends PreKeyProtocol {
    async sign(key) {
        this.signature = await Curve.sign(key, this.key.serialize());
    }
    verify(key) {
        return Curve.verify(key, this.key.serialize(), this.signature);
    }
};
__decorate([
    ProtobufProperty({ id: 3, converter: ArrayBufferConverter, required: true })
], PreKeySignedProtocol.prototype, "signature", void 0);
PreKeySignedProtocol = __decorate([
    ProtobufElement({ name: "PreKeySigned" })
], PreKeySignedProtocol);

let PreKeyBundleProtocol = class PreKeyBundleProtocol extends BaseProtocol {
};
__decorate([
    ProtobufProperty({ id: 1, type: "uint32", required: true })
], PreKeyBundleProtocol.prototype, "registrationId", void 0);
__decorate([
    ProtobufProperty({ id: 2, parser: IdentityProtocol, required: true })
], PreKeyBundleProtocol.prototype, "identity", void 0);
__decorate([
    ProtobufProperty({ id: 3, parser: PreKeyProtocol })
], PreKeyBundleProtocol.prototype, "preKey", void 0);
__decorate([
    ProtobufProperty({ id: 4, parser: PreKeySignedProtocol, required: true })
], PreKeyBundleProtocol.prototype, "preKeySigned", void 0);
PreKeyBundleProtocol = __decorate([
    ProtobufElement({ name: "PreKeyBundle" })
], PreKeyBundleProtocol);

class Stack {
    constructor(maxSize = 20) {
        this.items = [];
        this.maxSize = maxSize;
    }
    get length() {
        return this.items.length;
    }
    get latest() {
        return this.items[this.length - 1];
    }
    push(item) {
        if (this.length === this.maxSize) {
            this.items = this.items.slice(1);
        }
        this.items.push(item);
    }
    async toJSON() {
        const res = [];
        for (const item of this.items) {
            res.push(await item.toJSON());
        }
        return res;
    }
    async fromJSON(obj) {
        this.items = obj;
    }
}

const CIPHER_KEY_KDF_INPUT = new Uint8Array([1]).buffer;
const ROOT_KEY_KDF_INPUT = new Uint8Array([2]).buffer;
class SymmetricRatchet {
    constructor(rootKey) {
        this.counter = 0;
        this.rootKey = rootKey;
    }
    static async fromJSON(obj) {
        const res = new this(obj.rootKey);
        res.fromJSON(obj);
        return res;
    }
    async toJSON() {
        return {
            counter: this.counter,
            rootKey: this.rootKey,
        };
    }
    async fromJSON(obj) {
        this.counter = obj.counter;
        this.rootKey = obj.rootKey;
    }
    async calculateKey(rootKey) {
        const cipherKeyBytes = await Secret.sign(rootKey, CIPHER_KEY_KDF_INPUT);
        const nextRootKeyBytes = await Secret.sign(rootKey, ROOT_KEY_KDF_INPUT);
        const res = {
            cipher: cipherKeyBytes,
            rootKey: await Secret.importHMAC(nextRootKeyBytes),
        };
        return res;
    }
    async click() {
        const rootKey = this.rootKey;
        const res = await this.calculateKey(rootKey);
        this.rootKey = res.rootKey;
        this.counter++;
        return res.cipher;
    }
}
class SendingRatchet extends SymmetricRatchet {
    async encrypt(message) {
        const cipherKey = await this.click();
        const keys = await Secret.HKDF(cipherKey, 3, void 0, INFO_MESSAGE_KEYS);
        const aesKey = await Secret.importAES(keys[0]);
        const hmacKey = await Secret.importHMAC(keys[1]);
        const iv = keys[2].slice(0, 16);
        const cipherText = await Secret.encrypt(aesKey, message, iv);
        return {
            cipherText,
            hmacKey,
        };
    }
}
class ReceivingRatchet extends SymmetricRatchet {
    constructor() {
        super(...arguments);
        this.keys = [];
    }
    async toJSON() {
        const res = (await super.toJSON());
        res.keys = this.keys;
        return res;
    }
    async fromJSON(obj) {
        await super.fromJSON(obj);
        this.keys = obj.keys;
    }
    async decrypt(message, counter) {
        const cipherKey = await this.getKey(counter);
        const keys = await Secret.HKDF(cipherKey, 3, void 0, INFO_MESSAGE_KEYS);
        const aesKey = await Secret.importAES(keys[0]);
        const hmacKey = await Secret.importHMAC(keys[1]);
        const iv = keys[2].slice(0, 16);
        const cipherText = await Secret.decrypt(aesKey, message, iv);
        return {
            cipherText,
            hmacKey,
        };
    }
    async getKey(counter) {
        while (this.counter <= counter) {
            const cipherKey = await this.click();
            this.keys.push(cipherKey);
        }
        const key = this.keys[counter];
        return key;
    }
}

async function authenticateA(IKa, EKa, IKb, SPKb, OPKb) {
    const DH1 = await Curve.deriveBytes(IKa.exchangeKey.privateKey, SPKb);
    const DH2 = await Curve.deriveBytes(EKa.privateKey, IKb);
    const DH3 = await Curve.deriveBytes(EKa.privateKey, SPKb);
    let DH4 = new ArrayBuffer(0);
    if (OPKb) {
        DH4 = await Curve.deriveBytes(EKa.privateKey, OPKb);
    }
    const _F = new Uint8Array(32);
    for (let i = 0; i < _F.length; i++) {
        _F[i] = 0xff;
    }
    const F = _F.buffer;
    const KM = combine(F, DH1, DH2, DH3, DH4);
    const keys = await Secret.HKDF(KM, 1, void 0, INFO_TEXT);
    return await Secret.importHMAC(keys[0]);
}
async function authenticateB(IKb, SPKb, IKa, EKa, OPKb) {
    const DH1 = await Curve.deriveBytes(SPKb.privateKey, IKa);
    const DH2 = await Curve.deriveBytes(IKb.exchangeKey.privateKey, EKa);
    const DH3 = await Curve.deriveBytes(SPKb.privateKey, EKa);
    let DH4 = new ArrayBuffer(0);
    if (OPKb) {
        DH4 = await Curve.deriveBytes(OPKb, EKa);
    }
    const _F = new Uint8Array(32);
    for (let i = 0; i < _F.length; i++) {
        _F[i] = 0xff;
    }
    const F = _F.buffer;
    const KM = combine(F, DH1, DH2, DH3, DH4);
    const keys = await Secret.HKDF(KM, 1, void 0, INFO_TEXT);
    return await Secret.importHMAC(keys[0]);
}
class AsymmetricRatchet extends EventEmitter {
    constructor() {
        super();
        this.counter = 0;
        this.currentStep = new DHRatchetStep();
        this.steps = new DHRatchetStepStack(MAX_RATCHET_STACK_SIZE);
        this.promises = {};
    }
    static async create(identity, protocol) {
        let rootKey;
        const ratchet = new AsymmetricRatchet();
        if (protocol instanceof PreKeyBundleProtocol) {
            if (!await protocol.identity.verify()) {
                throw new Error("Error: Remote client's identity key is invalid.");
            }
            if (!await protocol.preKeySigned.verify(protocol.identity.signingKey)) {
                throw new Error("Error: Remote client's signed prekey is invalid.");
            }
            ratchet.currentRatchetKey = await ratchet.generateRatchetKey();
            ratchet.currentStep.remoteRatchetKey = protocol.preKeySigned.key;
            ratchet.remoteIdentity = RemoteIdentity.fill(protocol.identity);
            ratchet.remoteIdentity.id = protocol.registrationId;
            ratchet.remotePreKeyId = protocol.preKey.id;
            ratchet.remotePreKeySignedId = protocol.preKeySigned.id;
            rootKey = await authenticateA(identity, ratchet.currentRatchetKey, protocol.identity.exchangeKey, protocol.preKeySigned.key, protocol.preKey.key);
        }
        else {
            if (!await protocol.identity.verify()) {
                throw new Error("Error: Remote client's identity key is invalid.");
            }
            const signedPreKey = identity.signedPreKeys[protocol.preKeySignedId];
            if (!signedPreKey) {
                throw new Error(`Error: PreKey with id ${protocol.preKeySignedId} not found`);
            }
            let preKey;
            if (protocol.preKeyId !== void 0) {
                preKey = identity.preKeys[protocol.preKeyId];
            }
            ratchet.remoteIdentity = RemoteIdentity.fill(protocol.identity);
            ratchet.currentRatchetKey = signedPreKey;
            rootKey = await authenticateB(identity, ratchet.currentRatchetKey, protocol.identity.exchangeKey, protocol.signedMessage.message.senderRatchetKey, preKey && preKey.privateKey);
        }
        ratchet.identity = identity;
        ratchet.id = identity.id;
        ratchet.rootKey = rootKey;
        return ratchet;
    }
    static async fromJSON(identity, remote, obj) {
        const res = new AsymmetricRatchet();
        res.identity = identity;
        res.remoteIdentity = remote;
        await res.fromJSON(obj);
        return res;
    }
    on(event, listener) {
        return super.on(event, listener);
    }
    once(event, listener) {
        return super.once(event, listener);
    }
    async decrypt(protocol) {
        return this.queuePromise("encrypt", async () => {
            const remoteRatchetKey = protocol.message.senderRatchetKey;
            const message = protocol.message;
            if (protocol.message.previousCounter < this.counter - MAX_RATCHET_STACK_SIZE) {
                throw new Error("Error: Too old message");
            }
            let step = this.steps.getStep(remoteRatchetKey);
            if (!step) {
                const ratchetStep = new DHRatchetStep();
                ratchetStep.remoteRatchetKey = remoteRatchetKey;
                this.steps.push(ratchetStep);
                this.currentStep = ratchetStep;
                step = ratchetStep;
            }
            if (!step.receivingChain) {
                step.receivingChain = await this.createChain(this.currentRatchetKey.privateKey, remoteRatchetKey, ReceivingRatchet);
            }
            const decryptedMessage = await step.receivingChain.decrypt(message.cipherText, message.counter);
            this.update();
            protocol.senderKey = this.remoteIdentity.signingKey;
            protocol.receiverKey = this.identity.signingKey.publicKey;
            if (!await protocol.verify(decryptedMessage.hmacKey)) {
                throw new Error("Error: The Message did not successfully verify!");
            }
            return decryptedMessage.cipherText;
        });
    }
    async encrypt(message) {
        return this.queuePromise("encrypt", async () => {
            if (this.currentStep.receivingChain && !this.currentStep.sendingChain) {
                this.counter++;
                this.currentRatchetKey = await this.generateRatchetKey();
            }
            if (!this.currentStep.sendingChain) {
                if (!this.currentStep.remoteRatchetKey) {
                    throw new Error("currentStep has empty remoteRatchetKey");
                }
                this.currentStep.sendingChain = await this.createChain(this.currentRatchetKey.privateKey, this.currentStep.remoteRatchetKey, SendingRatchet);
            }
            const encryptedMessage = await this.currentStep.sendingChain.encrypt(message);
            this.update();
            let preKeyMessage;
            if (this.steps.length === 0 &&
                !this.currentStep.receivingChain &&
                this.currentStep.sendingChain.counter === 1) {
                preKeyMessage = new PreKeyMessageProtocol();
                preKeyMessage.registrationId = this.identity.id;
                preKeyMessage.preKeyId = this.remotePreKeyId;
                preKeyMessage.preKeySignedId = this.remotePreKeySignedId;
                preKeyMessage.baseKey = this.currentRatchetKey.publicKey;
                await preKeyMessage.identity.fill(this.identity);
            }
            const signedMessage = new MessageSignedProtocol();
            signedMessage.receiverKey = this.remoteIdentity.signingKey;
            signedMessage.senderKey = this.identity.signingKey.publicKey;
            signedMessage.message.cipherText = encryptedMessage.cipherText;
            signedMessage.message.counter = this.currentStep.sendingChain.counter - 1;
            signedMessage.message.previousCounter = this.counter;
            signedMessage.message.senderRatchetKey = this.currentRatchetKey.publicKey;
            await signedMessage.sign(encryptedMessage.hmacKey);
            if (preKeyMessage) {
                preKeyMessage.signedMessage = signedMessage;
                return preKeyMessage;
            }
            else {
                return signedMessage;
            }
        });
    }
    async hasRatchetKey(key) {
        let ecKey;
        if (!(key instanceof ECPublicKey)) {
            ecKey = await ECPublicKey.create(key);
        }
        else {
            ecKey = key;
        }
        for (const item of this.steps.items) {
            if (await item.remoteRatchetKey.isEqual(ecKey)) {
                return true;
            }
        }
        return false;
    }
    async toJSON() {
        return {
            counter: this.counter,
            ratchetKey: await Curve.ecKeyPairToJson(this.currentRatchetKey),
            remoteIdentity: await this.remoteIdentity.signingKey.thumbprint(),
            rootKey: this.rootKey,
            steps: await this.steps.toJSON(),
        };
    }
    async fromJSON(obj) {
        this.currentRatchetKey = await Curve.ecKeyPairFromJson(obj.ratchetKey);
        this.counter = obj.counter;
        this.rootKey = obj.rootKey;
        for (const step of obj.steps) {
            this.currentStep = await DHRatchetStep.fromJSON(step);
            this.steps.push(this.currentStep);
        }
    }
    update() {
        this.emit("update");
    }
    generateRatchetKey() {
        return Curve.generateKeyPair("ECDH");
    }
    async createChain(ourRatchetKey, theirRatchetKey, ratchetClass) {
        const derivedBytes = await Curve.deriveBytes(ourRatchetKey, theirRatchetKey);
        const keys = await Secret.HKDF(derivedBytes, 2, this.rootKey, INFO_RATCHET);
        const rootKey = await Secret.importHMAC(keys[0]);
        const chainKey = await Secret.importHMAC(keys[1]);
        const chain = new ratchetClass(chainKey);
        this.rootKey = rootKey;
        return chain;
    }
    queuePromise(key, fn) {
        const prev = this.promises[key] || Promise.resolve();
        const cur = this.promises[key] = prev.then(fn, fn);
        cur.then(() => {
            if (this.promises[key] === cur) {
                delete this.promises[key];
            }
        });
        return cur;
    }
}
class DHRatchetStep {
    static async fromJSON(obj) {
        const res = new this();
        await res.fromJSON(obj);
        return res;
    }
    async toJSON() {
        const res = {};
        if (this.remoteRatchetKey) {
            res.remoteRatchetKey = this.remoteRatchetKey.key;
        }
        if (this.sendingChain) {
            res.sendingChain = await this.sendingChain.toJSON();
        }
        if (this.receivingChain) {
            res.receivingChain = await this.receivingChain.toJSON();
        }
        return res;
    }
    async fromJSON(obj) {
        if (obj.remoteRatchetKey) {
            this.remoteRatchetKey = await ECPublicKey.create(obj.remoteRatchetKey);
        }
        if (obj.sendingChain) {
            this.sendingChain = await SendingRatchet.fromJSON(obj.sendingChain);
        }
        if (obj.receivingChain) {
            this.receivingChain = await ReceivingRatchet.fromJSON(obj.receivingChain);
        }
    }
}
class DHRatchetStepStack extends Stack {
    getStep(remoteRatchetKey) {
        let found;
        this.items.some((step) => {
            if (step.remoteRatchetKey.id === remoteRatchetKey.id) {
                found = step;
            }
            return !!found;
        });
        return found;
    }
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

class DateConverter$1 {
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

function toArray(arr) {
  return Array.prototype.slice.call(arr);
}

function promisifyRequest(request) {
  return new Promise(function(resolve, reject) {
    request.onsuccess = function() {
      resolve(request.result);
    };

    request.onerror = function() {
      reject(request.error);
    };
  });
}

function promisifyRequestCall(obj, method, args) {
  var request;
  var p = new Promise(function(resolve, reject) {
    request = obj[method].apply(obj, args);
    promisifyRequest(request).then(resolve, reject);
  });

  p.request = request;
  return p;
}

function promisifyCursorRequestCall(obj, method, args) {
  var p = promisifyRequestCall(obj, method, args);
  return p.then(function(value) {
    if (!value) return;
    return new Cursor(value, p.request);
  });
}

function proxyProperties(ProxyClass, targetProp, properties) {
  properties.forEach(function(prop) {
    Object.defineProperty(ProxyClass.prototype, prop, {
      get: function() {
        return this[targetProp][prop];
      },
      set: function(val) {
        this[targetProp][prop] = val;
      }
    });
  });
}

function proxyRequestMethods(ProxyClass, targetProp, Constructor, properties) {
  properties.forEach(function(prop) {
    if (!(prop in Constructor.prototype)) return;
    ProxyClass.prototype[prop] = function() {
      return promisifyRequestCall(this[targetProp], prop, arguments);
    };
  });
}

function proxyMethods(ProxyClass, targetProp, Constructor, properties) {
  properties.forEach(function(prop) {
    if (!(prop in Constructor.prototype)) return;
    ProxyClass.prototype[prop] = function() {
      return this[targetProp][prop].apply(this[targetProp], arguments);
    };
  });
}

function proxyCursorRequestMethods(ProxyClass, targetProp, Constructor, properties) {
  properties.forEach(function(prop) {
    if (!(prop in Constructor.prototype)) return;
    ProxyClass.prototype[prop] = function() {
      return promisifyCursorRequestCall(this[targetProp], prop, arguments);
    };
  });
}

function Index(index) {
  this._index = index;
}

proxyProperties(Index, '_index', [
  'name',
  'keyPath',
  'multiEntry',
  'unique'
]);

proxyRequestMethods(Index, '_index', IDBIndex, [
  'get',
  'getKey',
  'getAll',
  'getAllKeys',
  'count'
]);

proxyCursorRequestMethods(Index, '_index', IDBIndex, [
  'openCursor',
  'openKeyCursor'
]);

function Cursor(cursor, request) {
  this._cursor = cursor;
  this._request = request;
}

proxyProperties(Cursor, '_cursor', [
  'direction',
  'key',
  'primaryKey',
  'value'
]);

proxyRequestMethods(Cursor, '_cursor', IDBCursor, [
  'update',
  'delete'
]);

// proxy 'next' methods
['advance', 'continue', 'continuePrimaryKey'].forEach(function(methodName) {
  if (!(methodName in IDBCursor.prototype)) return;
  Cursor.prototype[methodName] = function() {
    var cursor = this;
    var args = arguments;
    return Promise.resolve().then(function() {
      cursor._cursor[methodName].apply(cursor._cursor, args);
      return promisifyRequest(cursor._request).then(function(value) {
        if (!value) return;
        return new Cursor(value, cursor._request);
      });
    });
  };
});

function ObjectStore(store) {
  this._store = store;
}

ObjectStore.prototype.createIndex = function() {
  return new Index(this._store.createIndex.apply(this._store, arguments));
};

ObjectStore.prototype.index = function() {
  return new Index(this._store.index.apply(this._store, arguments));
};

proxyProperties(ObjectStore, '_store', [
  'name',
  'keyPath',
  'indexNames',
  'autoIncrement'
]);

proxyRequestMethods(ObjectStore, '_store', IDBObjectStore, [
  'put',
  'add',
  'delete',
  'clear',
  'get',
  'getAll',
  'getKey',
  'getAllKeys',
  'count'
]);

proxyCursorRequestMethods(ObjectStore, '_store', IDBObjectStore, [
  'openCursor',
  'openKeyCursor'
]);

proxyMethods(ObjectStore, '_store', IDBObjectStore, [
  'deleteIndex'
]);

function Transaction(idbTransaction) {
  this._tx = idbTransaction;
  this.complete = new Promise(function(resolve, reject) {
    idbTransaction.oncomplete = function() {
      resolve();
    };
    idbTransaction.onerror = function() {
      reject(idbTransaction.error);
    };
    idbTransaction.onabort = function() {
      reject(idbTransaction.error);
    };
  });
}

Transaction.prototype.objectStore = function() {
  return new ObjectStore(this._tx.objectStore.apply(this._tx, arguments));
};

proxyProperties(Transaction, '_tx', [
  'objectStoreNames',
  'mode'
]);

proxyMethods(Transaction, '_tx', IDBTransaction, [
  'abort'
]);

function UpgradeDB(db, oldVersion, transaction) {
  this._db = db;
  this.oldVersion = oldVersion;
  this.transaction = new Transaction(transaction);
}

UpgradeDB.prototype.createObjectStore = function() {
  return new ObjectStore(this._db.createObjectStore.apply(this._db, arguments));
};

proxyProperties(UpgradeDB, '_db', [
  'name',
  'version',
  'objectStoreNames'
]);

proxyMethods(UpgradeDB, '_db', IDBDatabase, [
  'deleteObjectStore',
  'close'
]);

function DB(db) {
  this._db = db;
}

DB.prototype.transaction = function() {
  return new Transaction(this._db.transaction.apply(this._db, arguments));
};

proxyProperties(DB, '_db', [
  'name',
  'version',
  'objectStoreNames'
]);

proxyMethods(DB, '_db', IDBDatabase, [
  'close'
]);

// Add cursor iterators
// TODO: remove this once browsers do the right thing with promises
['openCursor', 'openKeyCursor'].forEach(function(funcName) {
  [ObjectStore, Index].forEach(function(Constructor) {
    // Don't create iterateKeyCursor if openKeyCursor doesn't exist.
    if (!(funcName in Constructor.prototype)) return;

    Constructor.prototype[funcName.replace('open', 'iterate')] = function() {
      var args = toArray(arguments);
      var callback = args[args.length - 1];
      var nativeObject = this._store || this._index;
      var request = nativeObject[funcName].apply(nativeObject, args.slice(0, -1));
      request.onsuccess = function() {
        callback(request.result);
      };
    };
  });
});

// polyfill getAll
[Index, ObjectStore].forEach(function(Constructor) {
  if (Constructor.prototype.getAll) return;
  Constructor.prototype.getAll = function(query, count) {
    var instance = this;
    var items = [];

    return new Promise(function(resolve) {
      instance.iterateCursor(query, function(cursor) {
        if (!cursor) {
          resolve(items);
          return;
        }
        items.push(cursor.value);

        if (count !== undefined && items.length == count) {
          resolve(items);
          return;
        }
        cursor.continue();
      });
    });
  };
});

function openDb(name, version, upgradeCallback) {
  var p = promisifyRequestCall(indexedDB, 'open', [name, version]);
  var request = p.request;

  if (request) {
    request.onupgradeneeded = function(event) {
      if (upgradeCallback) {
        upgradeCallback(new UpgradeDB(request.result, event.oldVersion, request.transaction));
      }
    };
  }

  return p.then(function(db) {
    return new DB(db);
  });
}

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

/**
 * Copyright (c) 2019, Peculiar Ventures, All rights reserved.
 */

class BufferSourceConverter {
    static toArrayBuffer(data) {
        if (data instanceof ArrayBuffer) {
            return data;
        }
        if (typeof Buffer !== "undefined" && Buffer.isBuffer(data)) {
            return new Uint8Array(data);
        }
        if (ArrayBuffer.isView(data)) {
            return data.buffer;
        }
        throw new TypeError("The provided value is not of type '(ArrayBuffer or ArrayBufferView)'");
    }
    static toUint8Array(data) {
        return new Uint8Array(this.toArrayBuffer(data));
    }
    static isBufferSource(data) {
        return ArrayBuffer.isView(data) || data instanceof ArrayBuffer;
    }
}

class PemConverter {
    static toArrayBuffer(pem) {
        const base64 = pem
            .replace(/-{5}(BEGIN|END) .*-{5}/g, "")
            .replace("\r", "")
            .replace("\n", "");
        return Convert.FromBase64(base64);
    }
    static toUint8Array(pem) {
        const bytes = this.toArrayBuffer(pem);
        return new Uint8Array(bytes);
    }
    static fromBufferSource(buffer, tag) {
        const base64 = Convert.ToBase64(buffer);
        let sliced;
        let offset = 0;
        const rows = [];
        while (true) {
            sliced = base64.slice(offset, offset = offset + 64);
            if (sliced.length) {
                rows.push(sliced);
                if (sliced.length < 64) {
                    break;
                }
            }
            else {
                break;
            }
        }
        const upperCaseTag = tag.toUpperCase();
        return `-----BEGIN ${upperCaseTag}-----\n${rows.join("\n")}\n-----END ${upperCaseTag}-----`;
    }
    static isPEM(data) {
        return /-----BEGIN .+-----[A-Za-z0-9+\/\+\=\s\n]+-----END .+-----/i.test(data);
    }
    static getTagName(pem) {
        if (!this.isPEM(pem)) {
            throw new Error("Bad parameter. Incoming data is not right PEM");
        }
        const res = /-----BEGIN (.+)-----/.exec(pem);
        if (!res) {
            throw new Error("Cannot get tag from PEM");
        }
        return res[1];
    }
    static hasTagName(pem, tagName) {
        const tag = this.getTagName(pem);
        return tagName.toLowerCase() === tag.toLowerCase();
    }
    static isCertificate(pem) {
        return this.hasTagName(pem, "certificate");
    }
    static isCertificateRequest(pem) {
        return this.hasTagName(pem, "certificate request");
    }
    static isCRL(pem) {
        return this.hasTagName(pem, "x509 crl");
    }
    static isPublicKey(pem) {
        return this.hasTagName(pem, "public key");
    }
}

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
    ProtobufProperty({ id: CryptoX509CertificateProto_1.INDEX++, required: true, converter: DateConverter$1 })
], CryptoX509CertificateProto.prototype, "notBefore", void 0);
__decorate([
    ProtobufProperty({ id: CryptoX509CertificateProto_1.INDEX++, required: true, converter: DateConverter$1 })
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
    if (!(typeof algorithm === "object" && "name" in algorithm)) {
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

export { setEngine, getEngine, SocketProvider };
