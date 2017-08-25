(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('protobufjs')) :
	typeof define === 'function' && define.amd ? define(['exports', 'protobufjs'], factory) :
	(factory((global.WebcryptoSocket = global.WebcryptoSocket || {}),global.protobuf));
}(this, (function (exports,protobufjs) { 'use strict';

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
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}





function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}





function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
    if (domain.active && !(this instanceof domain.Domain)) {
      this.domain = domain.active;
    }
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
  var needDomainExit = false;
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

  if (needDomainExit)
    domain.exit();

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

function PrepareBuffer(buffer) {
    if (typeof Buffer !== "undefined") {
        return new Uint8Array(buffer);
    }
    else {
        return new Uint8Array(buffer instanceof ArrayBuffer ? buffer : buffer.buffer);
    }
}
var Convert = (function () {
    function Convert() {
    }
    Convert.ToString = function (buffer, enc) {
        if (enc === void 0) { enc = "utf8"; }
        var buf = PrepareBuffer(buffer);
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
                throw new Error("Unknown type of encoding '" + enc + "'");
        }
    };
    Convert.FromString = function (str, enc) {
        if (enc === void 0) { enc = "utf8"; }
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
                throw new Error("Unknown type of encoding '" + enc + "'");
        }
    };
    Convert.ToBase64 = function (buffer) {
        var buf = PrepareBuffer(buffer);
        if (typeof btoa !== "undefined") {
            var binary = this.ToString(buf, "binary");
            return btoa(binary);
        }
        else {
            return new Buffer(buf).toString("base64");
        }
    };
    Convert.FromBase64 = function (base64Text) {
        base64Text = base64Text.replace(/\n/g, "").replace(/\r/g, "").replace(/\t/g, "").replace(/\s/g, "");
        if (typeof atob !== "undefined") {
            return this.FromBinary(atob(base64Text));
        }
        else {
            return new Uint8Array(new Buffer(base64Text, "base64")).buffer;
        }
    };
    Convert.FromBase64Url = function (base64url) {
        return this.FromBase64(this.Base64Padding(base64url.replace(/\-/g, "+").replace(/\_/g, "/")));
    };
    Convert.ToBase64Url = function (data) {
        return this.ToBase64(data).replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, "");
    };
    Convert.FromUtf8String = function (text) {
        var s = unescape(encodeURIComponent(text));
        var uintArray = new Uint8Array(s.length);
        for (var i = 0; i < s.length; i++) {
            uintArray[i] = s.charCodeAt(i);
        }
        return uintArray.buffer;
    };
    Convert.ToUtf8String = function (buffer) {
        var buf = PrepareBuffer(buffer);
        var encodedString = String.fromCharCode.apply(null, buf);
        var decodedString = decodeURIComponent(escape(encodedString));
        return decodedString;
    };
    Convert.FromBinary = function (text) {
        var stringLength = text.length;
        var resultView = new Uint8Array(stringLength);
        for (var i = 0; i < stringLength; i++) {
            resultView[i] = text.charCodeAt(i);
        }
        return resultView.buffer;
    };
    Convert.ToBinary = function (buffer) {
        var buf = PrepareBuffer(buffer);
        var resultString = "";
        var len = buf.length;
        for (var i = 0; i < len; i++) {
            resultString = resultString + String.fromCharCode(buf[i]);
        }
        return resultString;
    };
    Convert.ToHex = function (buffer) {
        var buf = PrepareBuffer(buffer);
        var splitter = "";
        var res = [];
        var len = buf.length;
        for (var i = 0; i < len; i++) {
            var char = buf[i].toString(16);
            res.push(char.length === 1 ? "0" + char : char);
        }
        return res.join(splitter);
    };
    Convert.FromHex = function (hexString) {
        var res = new Uint8Array(hexString.length / 2);
        for (var i = 0; i < hexString.length; i = i + 2) {
            var c = hexString.slice(i, i + 2);
            res[i / 2] = parseInt(c, 16);
        }
        return res.buffer;
    };
    Convert.Base64Padding = function (base64) {
        var padCount = 4 - (base64.length % 4);
        if (padCount < 4) {
            for (var i = 0; i < padCount; i++) {
                base64 += "=";
            }
        }
        return base64;
    };
    return Convert;
}());

function assign(target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    var res = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var obj = arguments[i];
        for (var prop in obj) {
            res[prop] = obj[prop];
        }
    }
    return res;
}
function combine() {
    var buf = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        buf[_i] = arguments[_i];
    }
    var totalByteLength = buf.map(function (item) { return item.byteLength; }).reduce(function (prev, cur) { return prev + cur; });
    var res = new Uint8Array(totalByteLength);
    var currentPos = 0;
    buf.map(function (item) { return new Uint8Array(item); }).forEach(function (arr) {
        for (var i = 0; i < arr.length; i++) {
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
    var b1 = new Uint8Array(bytes1);
    var b2 = new Uint8Array(bytes2);
    for (var i = 0; i < bytes1.byteLength; i++) {
        if (b1[i] !== b2[i]) {
            return false;
        }
    }
    return true;
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
        var scheme = new protobufjs.Type(t.localName);
        for (var key in t.items) {
            var item = t.items[key];
            var rule = void 0;
            if (item.repeated) {
                rule = "repeated";
            }
            else if (item.required) {
                rule = "required";
            }
            scheme.add(new protobufjs.Field(item.name, item.id, item.type, rule));
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
            var thisStatic, that, scheme, raw, _a, _b, _i, key, item, schemeValues, _c, schemeValues_1, schemeValue, _d, _e, _f, _g, _h;
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

/**
 *
 * 2key-ratchet
 * Copyright (c) 2016 Peculiar Ventures, Inc
 * Based on https://whispersystems.org/docs/specifications/doubleratchet/ and
 * https://whispersystems.org/docs/specifications/x3dh/ by Open Whisper Systems
 *
 */
var SIGN_ALGORITHM_NAME = "ECDSA";
var DH_ALGORITHM_NAME = "ECDH";
var SECRET_KEY_NAME = "AES-CBC";
var HASH_NAME = "SHA-256";
var HMAC_NAME = "HMAC";
var MAX_RATCHET_STACK_SIZE = 20;
var INFO_TEXT = Convert.FromBinary("InfoText");
var INFO_RATCHET = Convert.FromBinary("InfoRatchet");
var INFO_MESSAGE_KEYS = Convert.FromBinary("InfoMessageKeys");

var cryptoPolyfill;
if (typeof self === "undefined") {
    var WebCrypto = require("node-webcrypto-ossl");
    cryptoPolyfill = new WebCrypto();
}
else {
    cryptoPolyfill = self.crypto;
}
var crypto$1 = cryptoPolyfill;

var Curve = (function () {
    function Curve() {
    }
    Curve.generateKeyPair = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            var name, usage, keys, publicKey, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        name = type;
                        usage = type === "ECDSA" ? ["sign", "verify"] : ["deriveKey", "deriveBits"];
                        return [4, crypto$1.subtle.generateKey({ name: name, namedCurve: this.NAMED_CURVE }, false, usage)];
                    case 1:
                        keys = _a.sent();
                        return [4, ECPublicKey.create(keys.publicKey)];
                    case 2:
                        publicKey = _a.sent();
                        res = {
                            publicKey: publicKey,
                            privateKey: keys.privateKey,
                        };
                        return [2, res];
                }
            });
        });
    };
    Curve.deriveBytes = function (privateKey, publicKey) {
        return crypto$1.subtle.deriveBits({ name: "ECDH", public: publicKey.key }, privateKey, 256);
    };
    Curve.verify = function (signingKey, message, signature) {
        return crypto$1.subtle.verify({ name: "ECDSA", hash: this.DIGEST_ALGORITHM }, signingKey.key, signature, message);
    };
    Curve.sign = function (signingKey, message) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, crypto$1.subtle.sign({ name: "ECDSA", hash: this.DIGEST_ALGORITHM }, signingKey, message)];
            });
        });
    };
    Curve.ecKeyPairToJson = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = {
                            privateKey: key.privateKey,
                            publicKey: key.publicKey.key
                        };
                        return [4, key.publicKey.thumbprint()];
                    case 1: return [2, (_a.thumbprint = _b.sent(),
                            _a)];
                }
            });
        });
    };
    Curve.ecKeyPairFromJson = function (keys) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = {
                            privateKey: keys.privateKey
                        };
                        return [4, ECPublicKey.create(keys.publicKey)];
                    case 1: return [2, (_a.publicKey = _b.sent(),
                            _a)];
                }
            });
        });
    };
    Curve.NAMED_CURVE = "P-256";
    Curve.DIGEST_ALGORITHM = "SHA-512";
    return Curve;
}());

var AES_ALGORITHM = { name: "AES-CBC", length: 256 };
var Secret = (function () {
    function Secret() {
    }
    Secret.randomBytes = function (size) {
        var array = new Uint8Array(size);
        crypto$1.getRandomValues(array);
        return array.buffer;
    };
    Secret.digest = function (alg, message) {
        return crypto$1.subtle.digest(alg, message);
    };
    Secret.encrypt = function (key, data, iv) {
        return crypto$1.subtle.encrypt({ name: SECRET_KEY_NAME, iv: new Uint8Array(iv) }, key, data);
    };
    Secret.decrypt = function (key, data, iv) {
        return crypto$1.subtle.decrypt({ name: SECRET_KEY_NAME, iv: new Uint8Array(iv) }, key, data);
    };
    Secret.importHMAC = function (raw) {
        return crypto$1.subtle
            .importKey("raw", raw, { name: HMAC_NAME, hash: { name: HASH_NAME } }, false, ["sign", "verify"]);
    };
    Secret.importAES = function (raw) {
        return crypto$1.subtle.importKey("raw", raw, AES_ALGORITHM, false, ["encrypt", "decrypt"]);
    };
    Secret.sign = function (key, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, crypto$1.subtle.sign({ name: HMAC_NAME, hash: HASH_NAME }, key, data)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Secret.HKDF = function (IKM, keysCount, salt, info) {
        if (keysCount === void 0) { keysCount = 1; }
        if (info === void 0) { info = new ArrayBuffer(0); }
        return __awaiter(this, void 0, void 0, function () {
            var PRKBytes, infoBuffer, infoArray, PRK, T, i, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!!salt) return [3, 2];
                        return [4, this.importHMAC(new Uint8Array(32).buffer)];
                    case 1:
                        salt = _c.sent();
                        _c.label = 2;
                    case 2: return [4, this.sign(salt, IKM)];
                    case 3:
                        PRKBytes = _c.sent();
                        infoBuffer = new ArrayBuffer(32 + info.byteLength + 1);
                        infoArray = new Uint8Array(infoBuffer);
                        return [4, this.importHMAC(PRKBytes)];
                    case 4:
                        PRK = _c.sent();
                        T = [new ArrayBuffer(0)];
                        i = 0;
                        _c.label = 5;
                    case 5:
                        if (!(i < keysCount)) return [3, 8];
                        _a = T;
                        _b = i + 1;
                        return [4, this.sign(PRK, combine(T[i], info, new Uint8Array([i + 1]).buffer))];
                    case 6:
                        _a[_b] = _c.sent();
                        _c.label = 7;
                    case 7:
                        i++;
                        return [3, 5];
                    case 8: return [2, T.slice(1)];
                }
            });
        });
    };
    Secret.subtle = crypto$1.subtle;
    return Secret;
}());

var ECPublicKey = (function () {
    function ECPublicKey() {
    }
    ECPublicKey.create = function (publicKey) {
        return __awaiter(this, void 0, void 0, function () {
            var res, algName, jwk, x, y, xy, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        res = new this();
                        algName = publicKey.algorithm.name.toUpperCase();
                        if (!(algName === "ECDH" || algName === "ECDSA")) {
                            throw new Error("Error: Unsupported asymmetric key algorithm.");
                        }
                        if (publicKey.type !== "public") {
                            throw new Error("Error: Expected key type to be public but it was not.");
                        }
                        res.key = publicKey;
                        return [4, crypto$1.subtle.exportKey("jwk", publicKey)];
                    case 1:
                        jwk = _b.sent();
                        x = Convert.FromBase64Url(jwk.x);
                        y = Convert.FromBase64Url(jwk.y);
                        xy = Convert.ToBinary(x) + Convert.ToBinary(y);
                        res.serialized = Convert.FromBinary(xy);
                        _a = res;
                        return [4, res.thumbprint()];
                    case 2:
                        _a.id = _b.sent();
                        return [2, res];
                }
            });
        });
    };
    ECPublicKey.importKey = function (bytes, type) {
        return __awaiter(this, void 0, void 0, function () {
            var x, y, jwk, usage, key, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        x = Convert.ToBase64Url(bytes.slice(0, 32));
                        y = Convert.ToBase64Url(bytes.slice(32));
                        jwk = {
                            kty: "EC",
                            crv: Curve.NAMED_CURVE,
                            x: x,
                            y: y,
                        };
                        usage = (type === "ECDSA" ? ["verify"] : []);
                        return [4, crypto$1.subtle
                                .importKey("jwk", jwk, { name: type, namedCurve: Curve.NAMED_CURVE }, true, usage)];
                    case 1:
                        key = _a.sent();
                        return [4, ECPublicKey.create(key)];
                    case 2:
                        res = _a.sent();
                        return [2, res];
                }
            });
        });
    };
    ECPublicKey.prototype.serialize = function () {
        return this.serialized;
    };
    ECPublicKey.prototype.thumbprint = function () {
        return __awaiter(this, void 0, void 0, function () {
            var bytes, thumbprint;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.serialize()];
                    case 1:
                        bytes = _a.sent();
                        return [4, Secret.digest("SHA-256", bytes)];
                    case 2:
                        thumbprint = _a.sent();
                        return [2, Convert.ToHex(thumbprint)];
                }
            });
        });
    };
    ECPublicKey.prototype.isEqual = function (other) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!(other && other instanceof ECPublicKey)) {
                    return [2, false];
                }
                return [2, isEqual(this.serialized, other.serialized)];
            });
        });
    };
    return ECPublicKey;
}());

var Identity = (function () {
    function Identity(id, signingKey, exchangeKey) {
        this.id = id;
        this.signingKey = signingKey;
        this.exchangeKey = exchangeKey;
        this.preKeys = [];
        this.signedPreKeys = [];
    }
    Identity.fromJSON = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            var signingKey, exchangeKey, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, Curve.ecKeyPairFromJson(obj.signingKey)];
                    case 1:
                        signingKey = _a.sent();
                        return [4, Curve.ecKeyPairFromJson(obj.exchangeKey)];
                    case 2:
                        exchangeKey = _a.sent();
                        res = new this(obj.id, signingKey, exchangeKey);
                        res.createdAt = new Date(obj.createdAt);
                        return [4, res.fromJSON(obj)];
                    case 3:
                        _a.sent();
                        return [2, res];
                }
            });
        });
    };
    Identity.create = function (id, signedPreKeyAmount, preKeyAmount) {
        if (signedPreKeyAmount === void 0) { signedPreKeyAmount = 0; }
        if (preKeyAmount === void 0) { preKeyAmount = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var signingKey, exchangeKey, res, i, _a, _b, i, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4, Curve.generateKeyPair(SIGN_ALGORITHM_NAME)];
                    case 1:
                        signingKey = _e.sent();
                        return [4, Curve.generateKeyPair(DH_ALGORITHM_NAME)];
                    case 2:
                        exchangeKey = _e.sent();
                        res = new Identity(id, signingKey, exchangeKey);
                        res.createdAt = new Date();
                        i = 0;
                        _e.label = 3;
                    case 3:
                        if (!(i < preKeyAmount)) return [3, 6];
                        _b = (_a = res.preKeys).push;
                        return [4, Curve.generateKeyPair("ECDH")];
                    case 4:
                        _b.apply(_a, [_e.sent()]);
                        _e.label = 5;
                    case 5:
                        i++;
                        return [3, 3];
                    case 6:
                        i = 0;
                        _e.label = 7;
                    case 7:
                        if (!(i < signedPreKeyAmount)) return [3, 10];
                        _d = (_c = res.signedPreKeys).push;
                        return [4, Curve.generateKeyPair("ECDH")];
                    case 8:
                        _d.apply(_c, [_e.sent()]);
                        _e.label = 9;
                    case 9:
                        i++;
                        return [3, 7];
                    case 10: return [2, res];
                }
            });
        });
    };
    Identity.prototype.toJSON = function () {
        return __awaiter(this, void 0, void 0, function () {
            var preKeys, signedPreKeys, _i, _a, key, _b, _c, _d, _e, key, _f, _g, _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        preKeys = [];
                        signedPreKeys = [];
                        _i = 0, _a = this.preKeys;
                        _j.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3, 4];
                        key = _a[_i];
                        _c = (_b = preKeys).push;
                        return [4, Curve.ecKeyPairToJson(key)];
                    case 2:
                        _c.apply(_b, [_j.sent()]);
                        _j.label = 3;
                    case 3:
                        _i++;
                        return [3, 1];
                    case 4:
                        _d = 0, _e = this.signedPreKeys;
                        _j.label = 5;
                    case 5:
                        if (!(_d < _e.length)) return [3, 8];
                        key = _e[_d];
                        _g = (_f = signedPreKeys).push;
                        return [4, Curve.ecKeyPairToJson(key)];
                    case 6:
                        _g.apply(_f, [_j.sent()]);
                        _j.label = 7;
                    case 7:
                        _d++;
                        return [3, 5];
                    case 8:
                        _h = {
                            id: this.id
                        };
                        return [4, Curve.ecKeyPairToJson(this.signingKey)];
                    case 9:
                        _h.signingKey = _j.sent();
                        return [4, Curve.ecKeyPairToJson(this.exchangeKey)];
                    case 10: return [2, (_h.exchangeKey = _j.sent(),
                            _h.preKeys = preKeys,
                            _h.signedPreKeys = signedPreKeys,
                            _h.createdAt = this.createdAt.toISOString(),
                            _h)];
                }
            });
        });
    };
    Identity.prototype.fromJSON = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _i, _c, key, _d, _e, _f, _g, key, _h, _j;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        this.id = obj.id;
                        _a = this;
                        return [4, Curve.ecKeyPairFromJson(obj.signingKey)];
                    case 1:
                        _a.signingKey = _k.sent();
                        _b = this;
                        return [4, Curve.ecKeyPairFromJson(obj.exchangeKey)];
                    case 2:
                        _b.exchangeKey = _k.sent();
                        this.preKeys = [];
                        _i = 0, _c = obj.preKeys;
                        _k.label = 3;
                    case 3:
                        if (!(_i < _c.length)) return [3, 6];
                        key = _c[_i];
                        _e = (_d = this.preKeys).push;
                        return [4, Curve.ecKeyPairFromJson(key)];
                    case 4:
                        _e.apply(_d, [_k.sent()]);
                        _k.label = 5;
                    case 5:
                        _i++;
                        return [3, 3];
                    case 6:
                        this.signedPreKeys = [];
                        _f = 0, _g = obj.signedPreKeys;
                        _k.label = 7;
                    case 7:
                        if (!(_f < _g.length)) return [3, 10];
                        key = _g[_f];
                        _j = (_h = this.signedPreKeys).push;
                        return [4, Curve.ecKeyPairFromJson(key)];
                    case 8:
                        _j.apply(_h, [_k.sent()]);
                        _k.label = 9;
                    case 9:
                        _f++;
                        return [3, 7];
                    case 10: return [2];
                }
            });
        });
    };
    return Identity;
}());

var RemoteIdentity = (function () {
    function RemoteIdentity() {
    }
    RemoteIdentity.fill = function (protocol) {
        var res = new RemoteIdentity();
        res.fill(protocol);
        return res;
    };
    RemoteIdentity.fromJSON = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        res = new this();
                        return [4, res.fromJSON(obj)];
                    case 1:
                        _a.sent();
                        return [2, res];
                }
            });
        });
    };
    RemoteIdentity.prototype.fill = function (protocol) {
        this.signingKey = protocol.signingKey;
        this.exchangeKey = protocol.exchangeKey;
        this.signature = protocol.signature;
        this.createdAt = protocol.createdAt;
    };
    RemoteIdentity.prototype.verify = function () {
        return Curve.verify(this.signingKey, this.exchangeKey.serialize(), this.signature);
    };
    RemoteIdentity.prototype.toJSON = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = {
                            id: this.id
                        };
                        return [4, this.signingKey.thumbprint()];
                    case 1:
                        _a.thumbprint = _b.sent();
                        return [4, this.signingKey.key];
                    case 2:
                        _a.signingKey = _b.sent();
                        return [4, this.exchangeKey.key];
                    case 3: return [2, (_a.exchangeKey = _b.sent(),
                            _a.signature = this.signature,
                            _a.createdAt = this.createdAt.toISOString(),
                            _a)];
                }
            });
        });
    };
    RemoteIdentity.prototype.fromJSON = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, ok;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.id = obj.id;
                        this.signature = obj.signature;
                        _a = this;
                        return [4, ECPublicKey.create(obj.signingKey)];
                    case 1:
                        _a.signingKey = _c.sent();
                        _b = this;
                        return [4, ECPublicKey.create(obj.exchangeKey)];
                    case 2:
                        _b.exchangeKey = _c.sent();
                        this.createdAt = new Date(obj.createdAt);
                        return [4, this.verify()];
                    case 3:
                        ok = _c.sent();
                        if (!ok) {
                            throw new Error("Error: Wrong signature for RemoteIdentity");
                        }
                        return [2];
                }
            });
        });
    };
    return RemoteIdentity;
}());

var BaseProtocol = (function (_super) {
    __extends(BaseProtocol, _super);
    function BaseProtocol() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        ProtobufProperty({ id: 0, type: "uint32", defaultValue: 1 })
    ], BaseProtocol.prototype, "version", void 0);
    BaseProtocol = __decorate([
        ProtobufElement({ name: "Base" })
    ], BaseProtocol);
    return BaseProtocol;
}(ObjectProto));

var ECDSAPublicKeyConverter = (function () {
    function ECDSAPublicKeyConverter() {
    }
    ECDSAPublicKeyConverter.set = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Uint8Array(value.serialize())];
            });
        });
    };
    ECDSAPublicKeyConverter.get = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, ECPublicKey.importKey(value.buffer, "ECDSA")];
            });
        });
    };
    return ECDSAPublicKeyConverter;
}());
var ECDHPublicKeyConverter = (function () {
    function ECDHPublicKeyConverter() {
    }
    ECDHPublicKeyConverter.set = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Uint8Array(value.serialize())];
            });
        });
    };
    ECDHPublicKeyConverter.get = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, ECPublicKey.importKey(value.buffer, "ECDH")];
            });
        });
    };
    return ECDHPublicKeyConverter;
}());
var DateConverter = (function () {
    function DateConverter() {
    }
    DateConverter.set = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Uint8Array(Convert.FromString(value.toISOString()))];
            });
        });
    };
    DateConverter.get = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Date(Convert.ToString(value))];
            });
        });
    };
    return DateConverter;
}());

var IdentityProtocol = (function (_super) {
    __extends(IdentityProtocol, _super);
    function IdentityProtocol() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IdentityProtocol_1 = IdentityProtocol;
    IdentityProtocol.fill = function (identity) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        res = new IdentityProtocol_1();
                        return [4, res.fill(identity)];
                    case 1:
                        _a.sent();
                        return [2, res];
                }
            });
        });
    };
    IdentityProtocol.prototype.sign = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4, Curve.sign(key, this.exchangeKey.serialize())];
                    case 1:
                        _a.signature = _b.sent();
                        return [2];
                }
            });
        });
    };
    IdentityProtocol.prototype.verify = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, Curve.verify(this.signingKey, this.exchangeKey.serialize(), this.signature)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    IdentityProtocol.prototype.fill = function (identity) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.signingKey = identity.signingKey.publicKey;
                        this.exchangeKey = identity.exchangeKey.publicKey;
                        this.createdAt = identity.createdAt;
                        return [4, this.sign(identity.signingKey.privateKey)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
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
    return IdentityProtocol;
    var IdentityProtocol_1;
}(BaseProtocol));

var MessageProtocol = (function (_super) {
    __extends(MessageProtocol, _super);
    function MessageProtocol() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
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
    return MessageProtocol;
}(BaseProtocol));

var MessageSignedProtocol = (function (_super) {
    __extends(MessageSignedProtocol, _super);
    function MessageSignedProtocol() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MessageSignedProtocol.prototype.sign = function (hmacKey) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4, this.signHMAC(hmacKey)];
                    case 1:
                        _a.signature = _b.sent();
                        return [2];
                }
            });
        });
    };
    MessageSignedProtocol.prototype.verify = function (hmacKey) {
        return __awaiter(this, void 0, void 0, function () {
            var signature;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.signHMAC(hmacKey)];
                    case 1:
                        signature = _a.sent();
                        return [2, isEqual(signature, this.signature)];
                }
            });
        });
    };
    MessageSignedProtocol.prototype.getSignedRaw = function () {
        return __awaiter(this, void 0, void 0, function () {
            var receiverKey, senderKey, message, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        receiverKey = this.receiverKey.serialize();
                        senderKey = this.senderKey.serialize();
                        return [4, this.message.exportProto()];
                    case 1:
                        message = _a.sent();
                        data = combine(receiverKey, senderKey, message);
                        return [2, data];
                }
            });
        });
    };
    MessageSignedProtocol.prototype.signHMAC = function (macKey) {
        return __awaiter(this, void 0, void 0, function () {
            var data, signature;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getSignedRaw()];
                    case 1:
                        data = _a.sent();
                        return [4, Secret.sign(macKey, data)];
                    case 2:
                        signature = _a.sent();
                        return [2, signature];
                }
            });
        });
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
    return MessageSignedProtocol;
}(BaseProtocol));

var PreKeyMessageProtocol = (function (_super) {
    __extends(PreKeyMessageProtocol, _super);
    function PreKeyMessageProtocol() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
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
    return PreKeyMessageProtocol;
}(BaseProtocol));

var PreKeyProtocol = (function (_super) {
    __extends(PreKeyProtocol, _super);
    function PreKeyProtocol() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        ProtobufProperty({ id: 1, type: "uint32", required: true })
    ], PreKeyProtocol.prototype, "id", void 0);
    __decorate([
        ProtobufProperty({ id: 2, converter: ECDHPublicKeyConverter, required: true })
    ], PreKeyProtocol.prototype, "key", void 0);
    PreKeyProtocol = __decorate([
        ProtobufElement({ name: "PreKey" })
    ], PreKeyProtocol);
    return PreKeyProtocol;
}(BaseProtocol));

var PreKeySignedProtocol = (function (_super) {
    __extends(PreKeySignedProtocol, _super);
    function PreKeySignedProtocol() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PreKeySignedProtocol.prototype.sign = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4, Curve.sign(key, this.key.serialize())];
                    case 1:
                        _a.signature = _b.sent();
                        return [2];
                }
            });
        });
    };
    PreKeySignedProtocol.prototype.verify = function (key) {
        return Curve.verify(key, this.key.serialize(), this.signature);
    };
    __decorate([
        ProtobufProperty({ id: 3, converter: ArrayBufferConverter, required: true })
    ], PreKeySignedProtocol.prototype, "signature", void 0);
    PreKeySignedProtocol = __decorate([
        ProtobufElement({ name: "PreKeySigned" })
    ], PreKeySignedProtocol);
    return PreKeySignedProtocol;
}(PreKeyProtocol));

var PreKeyBundleProtocol = (function (_super) {
    __extends(PreKeyBundleProtocol, _super);
    function PreKeyBundleProtocol() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
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
    return PreKeyBundleProtocol;
}(BaseProtocol));

var Stack = (function () {
    function Stack(maxSize) {
        if (maxSize === void 0) { maxSize = 20; }
        this.items = [];
        this.maxSize = maxSize;
    }
    Object.defineProperty(Stack.prototype, "length", {
        get: function () {
            return this.items.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stack.prototype, "latest", {
        get: function () {
            return this.items[this.length - 1];
        },
        enumerable: true,
        configurable: true
    });
    Stack.prototype.push = function (item) {
        if (this.length === this.maxSize) {
            this.items = this.items.slice(1);
        }
        this.items.push(item);
    };
    Stack.prototype.toJSON = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, _i, _a, item, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        res = [];
                        _i = 0, _a = this.items;
                        _d.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3, 4];
                        item = _a[_i];
                        _c = (_b = res).push;
                        return [4, item.toJSON()];
                    case 2:
                        _c.apply(_b, [_d.sent()]);
                        _d.label = 3;
                    case 3:
                        _i++;
                        return [3, 1];
                    case 4: return [2, res];
                }
            });
        });
    };
    Stack.prototype.fromJSON = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.items = obj;
                return [2];
            });
        });
    };
    return Stack;
}());

var CIPHER_KEY_KDF_INPUT = new Uint8Array([1]).buffer;
var ROOT_KEY_KDF_INPUT = new Uint8Array([2]).buffer;
var SymmetricRatchet = (function () {
    function SymmetricRatchet(rootKey) {
        this.counter = 0;
        this.rootKey = rootKey;
    }
    SymmetricRatchet.fromJSON = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                res = new this(obj.rootKey);
                res.fromJSON(obj);
                return [2, res];
            });
        });
    };
    SymmetricRatchet.prototype.toJSON = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, {
                        counter: this.counter,
                        rootKey: this.rootKey,
                    }];
            });
        });
    };
    SymmetricRatchet.prototype.fromJSON = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.counter = obj.counter;
                this.rootKey = obj.rootKey;
                return [2];
            });
        });
    };
    SymmetricRatchet.prototype.calculateKey = function (rootKey) {
        return __awaiter(this, void 0, void 0, function () {
            var cipherKeyBytes, nextRootKeyBytes, res, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, Secret.sign(rootKey, CIPHER_KEY_KDF_INPUT)];
                    case 1:
                        cipherKeyBytes = _b.sent();
                        return [4, Secret.sign(rootKey, ROOT_KEY_KDF_INPUT)];
                    case 2:
                        nextRootKeyBytes = _b.sent();
                        _a = {};
                        return [4, Secret.importHMAC(nextRootKeyBytes)];
                    case 3:
                        res = (_a.rootKey = _b.sent(),
                            _a.cipher = cipherKeyBytes,
                            _a);
                        return [2, res];
                }
            });
        });
    };
    SymmetricRatchet.prototype.click = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rootKey, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rootKey = this.rootKey;
                        return [4, this.calculateKey(rootKey)];
                    case 1:
                        res = _a.sent();
                        this.rootKey = res.rootKey;
                        this.counter++;
                        return [2, res.cipher];
                }
            });
        });
    };
    return SymmetricRatchet;
}());
var SendingRatchet = (function (_super) {
    __extends(SendingRatchet, _super);
    function SendingRatchet() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SendingRatchet.prototype.encrypt = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var cipherKey, keys, aesKey, hmacKey, iv, cipherText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.click()];
                    case 1:
                        cipherKey = _a.sent();
                        return [4, Secret.HKDF(cipherKey, 3, void 0, INFO_MESSAGE_KEYS)];
                    case 2:
                        keys = _a.sent();
                        return [4, Secret.importAES(keys[0])];
                    case 3:
                        aesKey = _a.sent();
                        return [4, Secret.importHMAC(keys[1])];
                    case 4:
                        hmacKey = _a.sent();
                        iv = keys[2].slice(0, 16);
                        return [4, Secret.encrypt(aesKey, message, iv)];
                    case 5:
                        cipherText = _a.sent();
                        return [2, {
                                hmacKey: hmacKey,
                                cipherText: cipherText,
                            }];
                }
            });
        });
    };
    return SendingRatchet;
}(SymmetricRatchet));
var ReceivingRatchet = (function (_super) {
    __extends(ReceivingRatchet, _super);
    function ReceivingRatchet() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.keys = [];
        return _this;
    }
    ReceivingRatchet.prototype.toJSON = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, _super.prototype.toJSON.call(this)];
                    case 1:
                        res = (_a.sent());
                        res.keys = this.keys;
                        return [2, res];
                }
            });
        });
    };
    ReceivingRatchet.prototype.fromJSON = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, _super.prototype.fromJSON.call(this, obj)];
                    case 1:
                        _a.sent();
                        this.keys = obj.keys;
                        return [2];
                }
            });
        });
    };
    ReceivingRatchet.prototype.decrypt = function (message, counter) {
        return __awaiter(this, void 0, void 0, function () {
            var cipherKey, keys, aesKey, hmacKey, iv, cipherText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getKey(counter)];
                    case 1:
                        cipherKey = _a.sent();
                        return [4, Secret.HKDF(cipherKey, 3, void 0, INFO_MESSAGE_KEYS)];
                    case 2:
                        keys = _a.sent();
                        return [4, Secret.importAES(keys[0])];
                    case 3:
                        aesKey = _a.sent();
                        return [4, Secret.importHMAC(keys[1])];
                    case 4:
                        hmacKey = _a.sent();
                        iv = keys[2].slice(0, 16);
                        return [4, Secret.decrypt(aesKey, message, iv)];
                    case 5:
                        cipherText = _a.sent();
                        return [2, {
                                hmacKey: hmacKey,
                                cipherText: cipherText,
                            }];
                }
            });
        });
    };
    ReceivingRatchet.prototype.getKey = function (counter) {
        return __awaiter(this, void 0, void 0, function () {
            var cipherKey, key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.counter <= counter)) return [3, 2];
                        return [4, this.click()];
                    case 1:
                        cipherKey = _a.sent();
                        this.keys.push(cipherKey);
                        return [3, 0];
                    case 2:
                        key = this.keys[counter];
                        return [2, key];
                }
            });
        });
    };
    return ReceivingRatchet;
}(SymmetricRatchet));

function authenticateA(IKa, EKa, IKb, SPKb, OPKb) {
    return __awaiter(this, void 0, void 0, function () {
        var DH1, DH2, DH3, DH4, _F, i, F, KM, keys;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, Curve.deriveBytes(IKa.exchangeKey.privateKey, SPKb)];
                case 1:
                    DH1 = _a.sent();
                    return [4, Curve.deriveBytes(EKa.privateKey, IKb)];
                case 2:
                    DH2 = _a.sent();
                    return [4, Curve.deriveBytes(EKa.privateKey, SPKb)];
                case 3:
                    DH3 = _a.sent();
                    DH4 = new ArrayBuffer(0);
                    if (!OPKb) return [3, 5];
                    return [4, Curve.deriveBytes(EKa.privateKey, OPKb)];
                case 4:
                    DH4 = _a.sent();
                    _a.label = 5;
                case 5:
                    _F = new Uint8Array(32);
                    for (i = 0; i < _F.length; i++) {
                        _F[i] = 0xff;
                    }
                    F = _F.buffer;
                    KM = combine(F, DH1, DH2, DH3, DH4);
                    return [4, Secret.HKDF(KM, 1, void 0, INFO_TEXT)];
                case 6:
                    keys = _a.sent();
                    return [4, Secret.importHMAC(keys[0])];
                case 7: return [2, _a.sent()];
            }
        });
    });
}
function authenticateB(IKb, SPKb, IKa, EKa, OPKb) {
    return __awaiter(this, void 0, void 0, function () {
        var DH1, DH2, DH3, DH4, _F, i, F, KM, keys;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, Curve.deriveBytes(SPKb.privateKey, IKa)];
                case 1:
                    DH1 = _a.sent();
                    return [4, Curve.deriveBytes(IKb.exchangeKey.privateKey, EKa)];
                case 2:
                    DH2 = _a.sent();
                    return [4, Curve.deriveBytes(SPKb.privateKey, EKa)];
                case 3:
                    DH3 = _a.sent();
                    DH4 = new ArrayBuffer(0);
                    if (!OPKb) return [3, 5];
                    return [4, Curve.deriveBytes(OPKb, EKa)];
                case 4:
                    DH4 = _a.sent();
                    _a.label = 5;
                case 5:
                    _F = new Uint8Array(32);
                    for (i = 0; i < _F.length; i++) {
                        _F[i] = 0xff;
                    }
                    F = _F.buffer;
                    KM = combine(F, DH1, DH2, DH3, DH4);
                    return [4, Secret.HKDF(KM, 1, void 0, INFO_TEXT)];
                case 6:
                    keys = _a.sent();
                    return [4, Secret.importHMAC(keys[0])];
                case 7: return [2, _a.sent()];
            }
        });
    });
}
var AsymmetricRatchet = (function (_super) {
    __extends(AsymmetricRatchet, _super);
    function AsymmetricRatchet() {
        var _this = _super.call(this) || this;
        _this.counter = 0;
        _this.currentStep = new DHRatchetStep();
        _this.steps = new DHRatchetStepStack(MAX_RATCHET_STACK_SIZE);
        _this.promises = {};
        return _this;
    }
    AsymmetricRatchet.create = function (identity, protocol) {
        return __awaiter(this, void 0, void 0, function () {
            var rootKey, ratchet, _a, signedPreKey, preKey;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        ratchet = new AsymmetricRatchet();
                        if (!(protocol instanceof PreKeyBundleProtocol)) return [3, 5];
                        return [4, protocol.identity.verify()];
                    case 1:
                        if (!(_b.sent())) {
                            throw new Error("Error: Remote client's identity key is invalid.");
                        }
                        return [4, protocol.preKeySigned.verify(protocol.identity.signingKey)];
                    case 2:
                        if (!(_b.sent())) {
                            throw new Error("Error: Remote client's signed prekey is invalid.");
                        }
                        _a = ratchet;
                        return [4, ratchet.generateRatchetKey()];
                    case 3:
                        _a.currentRatchetKey = _b.sent();
                        ratchet.currentStep.remoteRatchetKey = protocol.preKeySigned.key;
                        ratchet.remoteIdentity = RemoteIdentity.fill(protocol.identity);
                        ratchet.remoteIdentity.id = protocol.registrationId;
                        ratchet.remotePreKeyId = protocol.preKey.id;
                        ratchet.remotePreKeySignedId = protocol.preKeySigned.id;
                        return [4, authenticateA(identity, ratchet.currentRatchetKey, protocol.identity.exchangeKey, protocol.preKeySigned.key, protocol.preKey.key)];
                    case 4:
                        rootKey = _b.sent();
                        return [3, 8];
                    case 5: return [4, protocol.identity.verify()];
                    case 6:
                        if (!(_b.sent())) {
                            throw new Error("Error: Remote client's identity key is invalid.");
                        }
                        signedPreKey = identity.signedPreKeys[protocol.preKeySignedId];
                        if (!signedPreKey) {
                            throw new Error("Error: PreKey with id " + protocol.preKeySignedId + " not found");
                        }
                        preKey = void 0;
                        preKey = identity.preKeys[protocol.preKeyId];
                        ratchet.remoteIdentity = RemoteIdentity.fill(protocol.identity);
                        ratchet.currentRatchetKey = signedPreKey;
                        return [4, authenticateB(identity, ratchet.currentRatchetKey, protocol.identity.exchangeKey, protocol.signedMessage.message.senderRatchetKey, preKey && preKey.privateKey)];
                    case 7:
                        rootKey = _b.sent();
                        _b.label = 8;
                    case 8:
                        ratchet.identity = identity;
                        ratchet.id = identity.id;
                        ratchet.rootKey = rootKey;
                        return [2, ratchet];
                }
            });
        });
    };
    AsymmetricRatchet.fromJSON = function (identity, remote, obj) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        res = new AsymmetricRatchet();
                        res.identity = identity;
                        res.remoteIdentity = remote;
                        return [4, res.fromJSON(obj)];
                    case 1:
                        _a.sent();
                        return [2, res];
                }
            });
        });
    };
    AsymmetricRatchet.prototype.on = function (event, listener) {
        return _super.prototype.on.call(this, event, listener);
    };
    AsymmetricRatchet.prototype.once = function (event, listener) {
        return _super.prototype.once.call(this, event, listener);
    };
    AsymmetricRatchet.prototype.decrypt = function (protocol) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, this.queuePromise("encrypt", function () { return __awaiter(_this, void 0, void 0, function () {
                        var remoteRatchetKey, message, step, ratchetStep, _a, decryptedMessage;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    remoteRatchetKey = protocol.message.senderRatchetKey;
                                    message = protocol.message;
                                    if (protocol.message.previousCounter < this.counter - MAX_RATCHET_STACK_SIZE) {
                                        throw new Error("Error: Too old message");
                                    }
                                    step = this.steps.getStep(remoteRatchetKey);
                                    if (!step) {
                                        ratchetStep = new DHRatchetStep();
                                        ratchetStep.remoteRatchetKey = remoteRatchetKey;
                                        this.steps.push(ratchetStep);
                                        this.currentStep = ratchetStep;
                                        step = ratchetStep;
                                    }
                                    if (!!step.receivingChain) return [3, 2];
                                    _a = step;
                                    return [4, this.createChain(this.currentRatchetKey.privateKey, remoteRatchetKey, ReceivingRatchet)];
                                case 1:
                                    _a.receivingChain = _b.sent();
                                    _b.label = 2;
                                case 2: return [4, step.receivingChain.decrypt(message.cipherText, message.counter)];
                                case 3:
                                    decryptedMessage = _b.sent();
                                    this.update();
                                    protocol.senderKey = this.remoteIdentity.signingKey;
                                    protocol.receiverKey = this.identity.signingKey.publicKey;
                                    return [4, protocol.verify(decryptedMessage.hmacKey)];
                                case 4:
                                    if (!(_b.sent())) {
                                        throw new Error("Error: The Message did not successfully verify!");
                                    }
                                    return [2, decryptedMessage.cipherText];
                            }
                        });
                    }); })];
            });
        });
    };
    AsymmetricRatchet.prototype.encrypt = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, this.queuePromise("encrypt", function () { return __awaiter(_this, void 0, void 0, function () {
                        var _a, _b, encryptedMessage, preKeyMessage, signedMessage;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (!(this.currentStep.receivingChain && !this.currentStep.sendingChain)) return [3, 2];
                                    this.counter++;
                                    _a = this;
                                    return [4, this.generateRatchetKey()];
                                case 1:
                                    _a.currentRatchetKey = _c.sent();
                                    _c.label = 2;
                                case 2:
                                    if (!!this.currentStep.sendingChain) return [3, 4];
                                    _b = this.currentStep;
                                    return [4, this.createChain(this.currentRatchetKey.privateKey, this.currentStep.remoteRatchetKey, SendingRatchet)];
                                case 3:
                                    _b.sendingChain = _c.sent();
                                    _c.label = 4;
                                case 4: return [4, this.currentStep.sendingChain.encrypt(message)];
                                case 5:
                                    encryptedMessage = _c.sent();
                                    this.update();
                                    if (!(this.steps.length === 0 &&
                                        !this.currentStep.receivingChain &&
                                        this.currentStep.sendingChain.counter === 1)) return [3, 7];
                                    preKeyMessage = new PreKeyMessageProtocol();
                                    preKeyMessage.registrationId = this.identity.id;
                                    preKeyMessage.preKeyId = this.remotePreKeyId;
                                    preKeyMessage.preKeySignedId = this.remotePreKeySignedId;
                                    preKeyMessage.baseKey = this.currentRatchetKey.publicKey;
                                    return [4, preKeyMessage.identity.fill(this.identity)];
                                case 6:
                                    _c.sent();
                                    _c.label = 7;
                                case 7:
                                    signedMessage = new MessageSignedProtocol();
                                    signedMessage.receiverKey = this.remoteIdentity.signingKey;
                                    signedMessage.senderKey = this.identity.signingKey.publicKey;
                                    signedMessage.message.cipherText = encryptedMessage.cipherText;
                                    signedMessage.message.counter = this.currentStep.sendingChain.counter - 1;
                                    signedMessage.message.previousCounter = this.counter;
                                    signedMessage.message.senderRatchetKey = this.currentRatchetKey.publicKey;
                                    return [4, signedMessage.sign(encryptedMessage.hmacKey)];
                                case 8:
                                    _c.sent();
                                    if (preKeyMessage) {
                                        preKeyMessage.signedMessage = signedMessage;
                                        return [2, preKeyMessage];
                                    }
                                    else {
                                        return [2, signedMessage];
                                    }
                                    return [2];
                            }
                        });
                    }); })];
            });
        });
    };
    AsymmetricRatchet.prototype.hasRatchetKey = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var ecKey, _i, _a, item;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!(key instanceof ECPublicKey)) return [3, 2];
                        return [4, ECPublicKey.create(key)];
                    case 1:
                        ecKey = _b.sent();
                        return [3, 3];
                    case 2:
                        ecKey = key;
                        _b.label = 3;
                    case 3:
                        _i = 0, _a = this.steps.items;
                        _b.label = 4;
                    case 4:
                        if (!(_i < _a.length)) return [3, 7];
                        item = _a[_i];
                        return [4, item.remoteRatchetKey.isEqual(ecKey)];
                    case 5:
                        if (_b.sent()) {
                            return [2, true];
                        }
                        _b.label = 6;
                    case 6:
                        _i++;
                        return [3, 4];
                    case 7: return [2, false];
                }
            });
        });
    };
    AsymmetricRatchet.prototype.toJSON = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = {};
                        return [4, this.remoteIdentity.signingKey.thumbprint()];
                    case 1:
                        _a.remoteIdentity = _b.sent();
                        return [4, Curve.ecKeyPairToJson(this.currentRatchetKey)];
                    case 2:
                        _a.ratchetKey = _b.sent(),
                            _a.counter = this.counter,
                            _a.rootKey = this.rootKey;
                        return [4, this.steps.toJSON()];
                    case 3: return [2, (_a.steps = _b.sent(),
                            _a)];
                }
            });
        });
    };
    AsymmetricRatchet.prototype.fromJSON = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _i, _b, step, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = this;
                        return [4, Curve.ecKeyPairFromJson(obj.ratchetKey)];
                    case 1:
                        _a.currentRatchetKey = _d.sent();
                        this.counter = obj.counter;
                        this.rootKey = obj.rootKey;
                        _i = 0, _b = obj.steps;
                        _d.label = 2;
                    case 2:
                        if (!(_i < _b.length)) return [3, 5];
                        step = _b[_i];
                        _c = this;
                        return [4, DHRatchetStep.fromJSON(step)];
                    case 3:
                        _c.currentStep = _d.sent();
                        this.steps.push(this.currentStep);
                        _d.label = 4;
                    case 4:
                        _i++;
                        return [3, 2];
                    case 5: return [2];
                }
            });
        });
    };
    AsymmetricRatchet.prototype.update = function () {
        this.emit("update");
    };
    AsymmetricRatchet.prototype.generateRatchetKey = function () {
        return Curve.generateKeyPair("ECDH");
    };
    AsymmetricRatchet.prototype.createChain = function (ourRatchetKey, theirRatchetKey, ratchetClass) {
        return __awaiter(this, void 0, void 0, function () {
            var derivedBytes, keys, rootKey, chainKey, chain;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, Curve.deriveBytes(ourRatchetKey, theirRatchetKey)];
                    case 1:
                        derivedBytes = _a.sent();
                        return [4, Secret.HKDF(derivedBytes, 2, this.rootKey, INFO_RATCHET)];
                    case 2:
                        keys = _a.sent();
                        return [4, Secret.importHMAC(keys[0])];
                    case 3:
                        rootKey = _a.sent();
                        return [4, Secret.importHMAC(keys[1])];
                    case 4:
                        chainKey = _a.sent();
                        chain = new ratchetClass(chainKey);
                        this.rootKey = rootKey;
                        return [2, chain];
                }
            });
        });
    };
    AsymmetricRatchet.prototype.queuePromise = function (key, fn) {
        var _this = this;
        var prev = this.promises[key] || Promise.resolve();
        var cur = this.promises[key] = prev.then(fn, fn);
        cur.then(function () {
            if (_this.promises[key] === cur) {
                delete _this.promises[key];
            }
        });
        return cur;
    };
    return AsymmetricRatchet;
}(EventEmitter));
var DHRatchetStep = (function () {
    function DHRatchetStep() {
    }
    DHRatchetStep.fromJSON = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        res = new this();
                        return [4, res.fromJSON(obj)];
                    case 1:
                        _a.sent();
                        return [2, res];
                }
            });
        });
    };
    DHRatchetStep.prototype.toJSON = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        res = {};
                        if (this.remoteRatchetKey) {
                            res.remoteRatchetKey = this.remoteRatchetKey.key;
                        }
                        if (!this.sendingChain) return [3, 2];
                        _a = res;
                        return [4, this.sendingChain.toJSON()];
                    case 1:
                        _a.sendingChain = _c.sent();
                        _c.label = 2;
                    case 2:
                        if (!this.receivingChain) return [3, 4];
                        _b = res;
                        return [4, this.receivingChain.toJSON()];
                    case 3:
                        _b.receivingChain = _c.sent();
                        _c.label = 4;
                    case 4: return [2, res];
                }
            });
        });
    };
    DHRatchetStep.prototype.fromJSON = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!obj.remoteRatchetKey) return [3, 2];
                        _a = this;
                        return [4, ECPublicKey.create(obj.remoteRatchetKey)];
                    case 1:
                        _a.remoteRatchetKey = _d.sent();
                        _d.label = 2;
                    case 2:
                        if (!obj.sendingChain) return [3, 4];
                        _b = this;
                        return [4, SendingRatchet.fromJSON(obj.sendingChain)];
                    case 3:
                        _b.sendingChain = _d.sent();
                        _d.label = 4;
                    case 4:
                        if (!obj.receivingChain) return [3, 6];
                        _c = this;
                        return [4, ReceivingRatchet.fromJSON(obj.receivingChain)];
                    case 5:
                        _c.receivingChain = _d.sent();
                        _d.label = 6;
                    case 6: return [2];
                }
            });
        });
    };
    return DHRatchetStep;
}());
var DHRatchetStepStack = (function (_super) {
    __extends(DHRatchetStepStack, _super);
    function DHRatchetStepStack() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DHRatchetStepStack.prototype.getStep = function (remoteRatchetKey) {
        var found = void 0;
        this.items.some(function (step) {
            if (step.remoteRatchetKey.id === remoteRatchetKey.id) {
                found = step;
            }
            return !!found;
        });
        return found;
    };
    return DHRatchetStepStack;
}(Stack));

var Event = (function () {
    function Event(target, event) {
        this.target = target;
        this.event = event;
    }
    return Event;
}());

var DateConverter$1 = (function () {
    function DateConverter() {
    }
    DateConverter.set = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Uint8Array(Convert.FromUtf8String(value.toISOString()))];
            });
        });
    };
    DateConverter.get = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Date(Convert.ToUtf8String(value))];
            });
        });
    };
    return DateConverter;
}());
var HexStringConverter = (function () {
    function HexStringConverter() {
    }
    HexStringConverter.set = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Uint8Array(Convert.FromHex(value))];
            });
        });
    };
    
    HexStringConverter.get = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, Convert.ToHex(value)];
            });
        });
    };
    return HexStringConverter;
}());

var BaseProto = (function (_super) {
    __extends(BaseProto, _super);
    function BaseProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseProto_1 = BaseProto;
    BaseProto.INDEX = 1;
    __decorate([
        ProtobufProperty({ id: BaseProto_1.INDEX++, type: "uint32", required: true, defaultValue: 1 })
    ], BaseProto.prototype, "version", void 0);
    BaseProto = BaseProto_1 = __decorate([
        ProtobufElement({ name: "BaseMessage" })
    ], BaseProto);
    return BaseProto;
    var BaseProto_1;
}(ObjectProto));
var ActionProto = (function (_super) {
    __extends(ActionProto, _super);
    function ActionProto() {
        var _this = _super.call(this) || this;
        _this.action = _this.constructor.ACTION;
        return _this;
    }
    ActionProto_1 = ActionProto;
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
    return ActionProto;
    var ActionProto_1;
}(BaseProto));
var BaseAlgorithmProto = (function (_super) {
    __extends(BaseAlgorithmProto, _super);
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
    __decorate([
        ProtobufProperty({ id: BaseAlgorithmProto_1.INDEX++, type: "string", required: true })
    ], BaseAlgorithmProto.prototype, "name", void 0);
    BaseAlgorithmProto = BaseAlgorithmProto_1 = __decorate([
        ProtobufElement({ name: "BaseAlgorithm" })
    ], BaseAlgorithmProto);
    return BaseAlgorithmProto;
    var BaseAlgorithmProto_1;
}(BaseProto));
var AlgorithmProto = (function (_super) {
    __extends(AlgorithmProto, _super);
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
                            throw new Error("Unsupported parser '" + thisStatic.items[key].parser.name + "'");
                    }
                }
                else {
                    this[key] = alg[key];
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
    return AlgorithmProto;
    var AlgorithmProto_1;
}(BaseAlgorithmProto));
var CryptoItemProto = (function (_super) {
    __extends(CryptoItemProto, _super);
    function CryptoItemProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CryptoItemProto_1 = CryptoItemProto;
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
    return CryptoItemProto;
    var CryptoItemProto_1;
}(BaseProto));
var CryptoKeyProto = (function (_super) {
    __extends(CryptoKeyProto, _super);
    function CryptoKeyProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CryptoKeyProto_1 = CryptoKeyProto;
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
    return CryptoKeyProto;
    var CryptoKeyProto_1;
}(CryptoItemProto));
var CryptoKeyPairProto = (function (_super) {
    __extends(CryptoKeyPairProto, _super);
    function CryptoKeyPairProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CryptoKeyPairProto_1 = CryptoKeyPairProto;
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
    return CryptoKeyPairProto;
    var CryptoKeyPairProto_1;
}(BaseProto));
var ResultProto = (function (_super) {
    __extends(ResultProto, _super);
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
    __decorate([
        ProtobufProperty({ id: ResultProto_1.INDEX++, type: "bool", defaultValue: false })
    ], ResultProto.prototype, "status", void 0);
    __decorate([
        ProtobufProperty({ id: ResultProto_1.INDEX++, type: "string", defaultValue: "" })
    ], ResultProto.prototype, "error", void 0);
    __decorate([
        ProtobufProperty({ id: ResultProto_1.INDEX++, type: "bytes", converter: ArrayBufferConverter })
    ], ResultProto.prototype, "data", void 0);
    ResultProto = ResultProto_1 = __decorate([
        ProtobufElement({ name: "Result" })
    ], ResultProto);
    return ResultProto;
    var ResultProto_1;
}(ActionProto));
var AuthRequestProto = (function (_super) {
    __extends(AuthRequestProto, _super);
    function AuthRequestProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AuthRequestProto.INDEX = ActionProto.INDEX;
    AuthRequestProto.ACTION = "auth";
    AuthRequestProto = __decorate([
        ProtobufElement({ name: "AuthRequest" })
    ], AuthRequestProto);
    return AuthRequestProto;
}(ActionProto));
var ServerLoginActionProto = (function (_super) {
    __extends(ServerLoginActionProto, _super);
    function ServerLoginActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ServerLoginActionProto.INDEX = ActionProto.INDEX;
    ServerLoginActionProto.ACTION = "server/login";
    ServerLoginActionProto = __decorate([
        ProtobufElement({})
    ], ServerLoginActionProto);
    return ServerLoginActionProto;
}(ActionProto));
var ServerIsLoggedInActionProto = (function (_super) {
    __extends(ServerIsLoggedInActionProto, _super);
    function ServerIsLoggedInActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ServerIsLoggedInActionProto.INDEX = ActionProto.INDEX;
    ServerIsLoggedInActionProto.ACTION = "server/isLoggedIn";
    ServerIsLoggedInActionProto = __decorate([
        ProtobufElement({})
    ], ServerIsLoggedInActionProto);
    return ServerIsLoggedInActionProto;
}(ActionProto));

var subtle;
if (typeof self === "undefined") {
    subtle = new (require("node-webcrypto-ossl"))().subtle;
}
else {
    subtle = crypto.subtle;
}
function challenge(serverIdentity, clientIdentity) {
    return __awaiter(this, void 0, void 0, function () {
        var serverIdentityDigest, clientIdentityDigest, combinedIdentity, digest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, serverIdentity.thumbprint()];
                case 1:
                    serverIdentityDigest = _a.sent();
                    return [4, clientIdentity.thumbprint()];
                case 2:
                    clientIdentityDigest = _a.sent();
                    combinedIdentity = Convert.FromHex(serverIdentityDigest + clientIdentityDigest);
                    return [4, subtle.digest("SHA-256", combinedIdentity)];
                case 3:
                    digest = _a.sent();
                    return [2, parseInt(Convert.ToHex(digest), 16).toString().substr(2, 6)];
            }
        });
    });
}

var SERVER_WELL_KNOWN = "/.well-known/webcrypto-socket";

var BrowserStorage = (function () {
    function BrowserStorage(db) {
        this.db = db;
    }
    BrowserStorage.create = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var db;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, idb.open(this.STORAGE_NAME, 1, function (updater) {
                            updater.createObjectStore(_this.SESSION_STORAGE);
                            updater.createObjectStore(_this.IDENTITY_STORAGE);
                            updater.createObjectStore(_this.REMOTE_STORAGE);
                        })];
                    case 1:
                        db = _a.sent();
                        return [2, new BrowserStorage(db)];
                }
            });
        });
    };
    BrowserStorage.prototype.loadIdentity = function () {
        return __awaiter(this, void 0, void 0, function () {
            var json, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.db.transaction(BrowserStorage.IDENTITY_STORAGE)
                            .objectStore(BrowserStorage.IDENTITY_STORAGE).get("identity")];
                    case 1:
                        json = _a.sent();
                        res = null;
                        if (!json) return [3, 3];
                        return [4, Identity.fromJSON(json)];
                    case 2:
                        res = _a.sent();
                        _a.label = 3;
                    case 3: return [2, res];
                }
            });
        });
    };
    BrowserStorage.prototype.saveIdentity = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            var json, tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, value.toJSON()];
                    case 1:
                        json = _a.sent();
                        tx = this.db.transaction(BrowserStorage.IDENTITY_STORAGE, "readwrite");
                        tx.objectStore(BrowserStorage.IDENTITY_STORAGE).put(json, "identity");
                        return [2, tx.complete];
                }
            });
        });
    };
    BrowserStorage.prototype.loadRemoteIdentity = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var json, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.db.transaction(BrowserStorage.REMOTE_STORAGE)
                            .objectStore(BrowserStorage.REMOTE_STORAGE).get(key)];
                    case 1:
                        json = _a.sent();
                        res = null;
                        if (!json) return [3, 3];
                        return [4, RemoteIdentity.fromJSON(json)];
                    case 2:
                        res = _a.sent();
                        _a.label = 3;
                    case 3: return [2, res];
                }
            });
        });
    };
    BrowserStorage.prototype.saveRemoteIdentity = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            var json, tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, value.toJSON()];
                    case 1:
                        json = _a.sent();
                        tx = this.db.transaction(BrowserStorage.REMOTE_STORAGE, "readwrite");
                        tx.objectStore(BrowserStorage.REMOTE_STORAGE).put(json, key);
                        return [2, tx.complete];
                }
            });
        });
    };
    BrowserStorage.prototype.loadSession = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var json, res, identity, remoteIdentity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.db.transaction(BrowserStorage.SESSION_STORAGE)
                            .objectStore(BrowserStorage.SESSION_STORAGE).get(key)];
                    case 1:
                        json = _a.sent();
                        res = null;
                        if (!json) return [3, 5];
                        return [4, this.loadIdentity()];
                    case 2:
                        identity = _a.sent();
                        if (!identity) {
                            throw new Error("Identity is empty");
                        }
                        return [4, this.loadRemoteIdentity(key)];
                    case 3:
                        remoteIdentity = _a.sent();
                        if (!remoteIdentity) {
                            throw new Error("Remote identity is not found");
                        }
                        return [4, AsymmetricRatchet.fromJSON(identity, remoteIdentity, json)];
                    case 4:
                        res = _a.sent();
                        _a.label = 5;
                    case 5: return [2, res];
                }
            });
        });
    };
    BrowserStorage.prototype.saveSession = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            var json, tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, value.toJSON()];
                    case 1:
                        json = _a.sent();
                        tx = this.db.transaction(BrowserStorage.SESSION_STORAGE, "readwrite");
                        tx.objectStore(BrowserStorage.SESSION_STORAGE).put(json, key);
                        return [2, tx.complete];
                }
            });
        });
    };
    BrowserStorage.STORAGE_NAME = "webcrypto-remote";
    BrowserStorage.IDENTITY_STORAGE = "identity";
    BrowserStorage.SESSION_STORAGE = "sessions";
    BrowserStorage.REMOTE_STORAGE = "remoteIdentity";
    return BrowserStorage;
}());

var ClientEvent = (function (_super) {
    __extends(ClientEvent, _super);
    function ClientEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ClientEvent;
}(Event));
var ClientListeningEvent = (function (_super) {
    __extends(ClientListeningEvent, _super);
    function ClientListeningEvent(target, address) {
        var _this = _super.call(this, target, "listening") || this;
        _this.address = address;
        return _this;
    }
    return ClientListeningEvent;
}(ClientEvent));
var ClientCloseEvent = (function (_super) {
    __extends(ClientCloseEvent, _super);
    function ClientCloseEvent(target, remoteAddress, reasonCode, description) {
        var _this = _super.call(this, target, "close") || this;
        _this.remoteAddress = remoteAddress;
        _this.reasonCode = reasonCode;
        _this.description = description;
        return _this;
    }
    return ClientCloseEvent;
}(ClientEvent));
var ClientErrorEvent = (function (_super) {
    __extends(ClientErrorEvent, _super);
    function ClientErrorEvent(target, error) {
        var _this = _super.call(this, target, "error") || this;
        _this.error = error;
        return _this;
    }
    return ClientErrorEvent;
}(ClientEvent));
var SocketCryptoState;
(function (SocketCryptoState) {
    SocketCryptoState[SocketCryptoState["connecting"] = 0] = "connecting";
    SocketCryptoState[SocketCryptoState["open"] = 1] = "open";
    SocketCryptoState[SocketCryptoState["closing"] = 2] = "closing";
    SocketCryptoState[SocketCryptoState["closed"] = 3] = "closed";
})(SocketCryptoState || (SocketCryptoState = {}));
function getXmlHttp() {
    var xmlHttp;
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
var Client = (function (_super) {
    __extends(Client, _super);
    function Client() {
        var _this = _super.call(this) || this;
        _this.stack = {};
        _this.messageCounter = 0;
        return _this;
    }
    Object.defineProperty(Client.prototype, "state", {
        get: function () {
            if (this.socket) {
                return this.socket.readyState;
            }
            else {
                return SocketCryptoState.closed;
            }
        },
        enumerable: true,
        configurable: true
    });
    Client.prototype.connect = function (address) {
        var _this = this;
        this.getServerInfo(address)
            .then(function (info) {
            _this.serviceInfo = info;
            _this.socket = new WebSocket("wss://" + address);
            _this.socket.binaryType = "arraybuffer";
            _this.socket.onerror = function (e) {
                _this.emit("error", new ClientErrorEvent(_this, e.error));
            };
            _this.socket.onopen = function (e) {
                (function () { return __awaiter(_this, void 0, void 0, function () {
                    var storage, identity, remoteIdentityId, bundle, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4, BrowserStorage.create()];
                            case 1:
                                storage = _b.sent();
                                return [4, storage.loadIdentity()];
                            case 2:
                                identity = _b.sent();
                                if (!!identity) return [3, 5];
                                console.info("Generates new identity");
                                return [4, Identity.create(1)];
                            case 3:
                                identity = _b.sent();
                                return [4, storage.saveIdentity(identity)];
                            case 4:
                                _b.sent();
                                _b.label = 5;
                            case 5:
                                remoteIdentityId = "0";
                                return [4, PreKeyBundleProtocol.importProto(Convert.FromBase64(info.preKey))];
                            case 6:
                                bundle = _b.sent();
                                _a = this;
                                return [4, AsymmetricRatchet.create(identity, bundle)];
                            case 7:
                                _a.cipher = _b.sent();
                                return [4, storage.saveRemoteIdentity(remoteIdentityId, this.cipher.remoteIdentity)];
                            case 8:
                                _b.sent();
                                this.emit("listening", new ClientListeningEvent(this, address));
                                return [2];
                        }
                    });
                }); })().catch(function (error) { return _this.emit("error", new ClientErrorEvent(_this, error)); });
            };
            _this.socket.onclose = function (e) {
                for (var actionId in _this.stack) {
                    var message = _this.stack[actionId];
                    message.reject(new Error("Cannot finish operation. Session was closed"));
                }
                _this.emit("close", new ClientCloseEvent(_this, address, e.code, e.reason));
            };
            _this.socket.onmessage = function (e) {
                if (e.data instanceof ArrayBuffer) {
                    MessageSignedProtocol.importProto(e.data)
                        .then(function (proto) {
                        return _this.cipher.decrypt(proto);
                    })
                        .then(function (msg) {
                        _this.onMessage(msg);
                    })
                        .catch(function (err) {
                        _this.emit("error", new ClientErrorEvent(_this, err));
                    });
                }
            };
        })
            .catch(function (err) {
            _this.emit("error", new ClientErrorEvent(_this, err));
        });
        return this;
    };
    Client.prototype.close = function () {
        this.socket.close();
    };
    Client.prototype.on = function (event, listener) {
        return _super.prototype.on.call(this, event, listener);
    };
    Client.prototype.once = function (event, listener) {
        return _super.prototype.once.call(this, event, listener);
    };
    Client.prototype.challenge = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, challenge(this.cipher.remoteIdentity.signingKey, this.cipher.identity.signingKey.publicKey)];
            });
        });
    };
    Client.prototype.isLoggedIn = function () {
        return __awaiter(this, void 0, void 0, function () {
            var action, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        action = new ServerIsLoggedInActionProto();
                        return [4, this.send(action)];
                    case 1:
                        data = _a.sent();
                        return [2, data ? !!(new Uint8Array(data)[0]) : false];
                }
            });
        });
    };
    Client.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            var action;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        action = new ServerLoginActionProto();
                        return [4, this.send(action)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    Client.prototype.send = function (data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.checkSocketState();
            if (!data) {
                data = new ActionProto();
            }
            data.action = data.action;
            data.actionId = (_this.messageCounter++).toString();
            data.exportProto()
                .then(function (raw) {
                return _this.cipher.encrypt(raw)
                    .then(function (msg) { return msg.exportProto(); });
            })
                .then(function (raw) {
                _this.stack[data.actionId] = { resolve: resolve, reject: reject };
                _this.socket.send(raw);
            })
                .catch(reject);
        });
    };
    Client.prototype.getServerInfo = function (address) {
        return new Promise(function (resolve, reject) {
            var url = "https://" + address + SERVER_WELL_KNOWN;
            if (self.fetch) {
                fetch(url)
                    .then(function (response) {
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
                var xmlHttp_1 = getXmlHttp();
                xmlHttp_1.open("GET", "http://" + address + SERVER_WELL_KNOWN, true);
                xmlHttp_1.responseType = "text";
                xmlHttp_1.onreadystatechange = function () {
                    if (xmlHttp_1.readyState === 4) {
                        if (xmlHttp_1.status === 200) {
                            var json = JSON.parse(xmlHttp_1.responseText);
                            resolve(json);
                        }
                        else {
                            reject(new Error("Cannot GET response"));
                        }
                    }
                };
                xmlHttp_1.send(null);
            }
        });
    };
    Client.prototype.checkSocketState = function () {
        if (this.state !== SocketCryptoState.open) {
            throw new Error("Socket connection is not open");
        }
    };
    Client.prototype.onMessage = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var proto, promise, messageProto, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, ActionProto.importProto(message)];
                    case 1:
                        proto = _c.sent();
                        console.info("Action:", proto.action);
                        promise = this.stack[proto.actionId];
                        if (!promise) return [3, 4];
                        delete this.stack[proto.actionId];
                        _b = (_a = ResultProto).importProto;
                        return [4, proto.exportProto()];
                    case 2: return [4, _b.apply(_a, [_c.sent()])];
                    case 3:
                        messageProto = _c.sent();
                        if (messageProto.error) {
                            console.error("Error action:", messageProto.action);
                            console.error(messageProto.error);
                            promise.reject(new Error(messageProto.error));
                        }
                        else {
                            promise.resolve(messageProto.data);
                        }
                        return [3, 5];
                    case 4:
                        this.emit("event", proto);
                        _c.label = 5;
                    case 5: return [2];
                }
            });
        });
    };
    return Client;
}(EventEmitter));

var ProviderCryptoProto = (function (_super) {
    __extends(ProviderCryptoProto, _super);
    function ProviderCryptoProto(data) {
        var _this = _super.call(this) || this;
        if (data) {
            assign(_this, data);
        }
        return _this;
    }
    ProviderCryptoProto_1 = ProviderCryptoProto;
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
    ProviderCryptoProto = ProviderCryptoProto_1 = __decorate([
        ProtobufElement({})
    ], ProviderCryptoProto);
    return ProviderCryptoProto;
    var ProviderCryptoProto_1;
}(BaseProto));
var ProviderInfoProto = (function (_super) {
    __extends(ProviderInfoProto, _super);
    function ProviderInfoProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProviderInfoProto_1 = ProviderInfoProto;
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
    return ProviderInfoProto;
    var ProviderInfoProto_1;
}(BaseProto));
var ProviderInfoActionProto = (function (_super) {
    __extends(ProviderInfoActionProto, _super);
    function ProviderInfoActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProviderInfoActionProto.INDEX = ActionProto.INDEX;
    ProviderInfoActionProto.ACTION = "provider/action/info";
    ProviderInfoActionProto = __decorate([
        ProtobufElement({})
    ], ProviderInfoActionProto);
    return ProviderInfoActionProto;
}(ActionProto));
var ProviderGetCryptoActionProto = (function (_super) {
    __extends(ProviderGetCryptoActionProto, _super);
    function ProviderGetCryptoActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProviderGetCryptoActionProto_1 = ProviderGetCryptoActionProto;
    ProviderGetCryptoActionProto.INDEX = ActionProto.INDEX;
    ProviderGetCryptoActionProto.ACTION = "provider/action/getCrypto";
    __decorate([
        ProtobufProperty({ id: ProviderGetCryptoActionProto_1.INDEX++, required: true, type: "string" })
    ], ProviderGetCryptoActionProto.prototype, "cryptoID", void 0);
    ProviderGetCryptoActionProto = ProviderGetCryptoActionProto_1 = __decorate([
        ProtobufElement({})
    ], ProviderGetCryptoActionProto);
    return ProviderGetCryptoActionProto;
    var ProviderGetCryptoActionProto_1;
}(ActionProto));
var ProviderAuthorizedEventProto = (function (_super) {
    __extends(ProviderAuthorizedEventProto, _super);
    function ProviderAuthorizedEventProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProviderAuthorizedEventProto.INDEX = ActionProto.INDEX;
    ProviderAuthorizedEventProto.ACTION = "provider/event/authorized";
    ProviderAuthorizedEventProto = __decorate([
        ProtobufElement({})
    ], ProviderAuthorizedEventProto);
    return ProviderAuthorizedEventProto;
}(ActionProto));
var ProviderTokenEventProto = (function (_super) {
    __extends(ProviderTokenEventProto, _super);
    function ProviderTokenEventProto(data) {
        var _this = _super.call(this) || this;
        if (data) {
            assign(_this, data);
        }
        return _this;
    }
    ProviderTokenEventProto_1 = ProviderTokenEventProto;
    ProviderTokenEventProto.INDEX = ActionProto.INDEX;
    ProviderTokenEventProto.ACTION = "provider/event/token";
    __decorate([
        ProtobufProperty({ id: ProviderTokenEventProto_1.INDEX++, repeated: true, parser: ProviderCryptoProto })
    ], ProviderTokenEventProto.prototype, "added", void 0);
    __decorate([
        ProtobufProperty({ id: ProviderTokenEventProto_1.INDEX++, repeated: true, parser: ProviderCryptoProto })
    ], ProviderTokenEventProto.prototype, "removed", void 0);
    __decorate([
        ProtobufProperty({ id: ProviderTokenEventProto_1.INDEX++, type: "string" })
    ], ProviderTokenEventProto.prototype, "error", void 0);
    ProviderTokenEventProto = ProviderTokenEventProto_1 = __decorate([
        ProtobufElement({ name: "ProviderTokenEvent" })
    ], ProviderTokenEventProto);
    return ProviderTokenEventProto;
    var ProviderTokenEventProto_1;
}(ActionProto));

var CryptoActionProto = (function (_super) {
    __extends(CryptoActionProto, _super);
    function CryptoActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CryptoActionProto_1 = CryptoActionProto;
    CryptoActionProto.INDEX = ActionProto.INDEX;
    CryptoActionProto.ACTION = "crypto";
    __decorate([
        ProtobufProperty({ id: CryptoActionProto_1.INDEX++, required: true, type: "string" })
    ], CryptoActionProto.prototype, "providerID", void 0);
    CryptoActionProto = CryptoActionProto_1 = __decorate([
        ProtobufElement({})
    ], CryptoActionProto);
    return CryptoActionProto;
    var CryptoActionProto_1;
}(ActionProto));
var LoginActionProto = (function (_super) {
    __extends(LoginActionProto, _super);
    function LoginActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LoginActionProto.INDEX = CryptoActionProto.INDEX;
    LoginActionProto.ACTION = "crypto/login";
    LoginActionProto = __decorate([
        ProtobufElement({})
    ], LoginActionProto);
    return LoginActionProto;
}(CryptoActionProto));
var IsLoggedInActionProto = (function (_super) {
    __extends(IsLoggedInActionProto, _super);
    function IsLoggedInActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IsLoggedInActionProto.INDEX = CryptoActionProto.INDEX;
    IsLoggedInActionProto.ACTION = "crypto/isLoggedIn";
    IsLoggedInActionProto = __decorate([
        ProtobufElement({})
    ], IsLoggedInActionProto);
    return IsLoggedInActionProto;
}(CryptoActionProto));
var ResetActionProto = (function (_super) {
    __extends(ResetActionProto, _super);
    function ResetActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ResetActionProto.INDEX = CryptoActionProto.INDEX;
    ResetActionProto.ACTION = "crypto/reset";
    ResetActionProto = __decorate([
        ProtobufElement({})
    ], ResetActionProto);
    return ResetActionProto;
}(CryptoActionProto));

function printf(text) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var msg = text;
    var regFind = /[^%](%\d+)/g;
    var match;
    var matches = [];
    while (match = regFind.exec(msg)) {
        matches.push({ arg: match[1], index: match.index });
    }
    for (var i = matches.length - 1; i >= 0; i--) {
        var item = matches[i];
        var arg = item.arg.substring(1);
        var index = item.index + 1;
        msg = msg.substring(0, index) + arguments[+arg] + msg.substring(index + 1 + arg.length);
    }
    msg = msg.replace("%%", "%");
    return msg;
}
var WebCryptoError = (function (_super) {
    __extends(WebCryptoError, _super);
    function WebCryptoError(template) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var _this = _super.call(this) || this;
        _this.code = 0;
        _this.message = printf.apply(void 0, [template].concat(args));
        var error = new Error(_this.message);
        error.name = _this["constructor"].name;
        _this.stack = error.stack;
        return _this;
    }
    return WebCryptoError;
}(Error));
WebCryptoError.NOT_SUPPORTED = "Method is not supported";
var AlgorithmError = (function (_super) {
    __extends(AlgorithmError, _super);
    function AlgorithmError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.code = 1;
        return _this;
    }
    return AlgorithmError;
}(WebCryptoError));
AlgorithmError.PARAM_REQUIRED = "Algorithm hasn't got required paramter '%1'";
AlgorithmError.PARAM_WRONG_TYPE = "Algorithm has got wrong type for paramter '%1'. Must be %2";
AlgorithmError.PARAM_WRONG_VALUE = "Algorithm has got wrong value for paramter '%1'. Must be %2";
AlgorithmError.WRONG_ALG_NAME = "Algorithm has got wrong name '%1'. Must be '%2'";
AlgorithmError.UNSUPPORTED_ALGORITHM = "Algorithm '%1' is not supported";
AlgorithmError.WRONG_USAGE = "Algorithm doesn't support key usage '%1'";
var CryptoKeyError = (function (_super) {
    __extends(CryptoKeyError, _super);
    function CryptoKeyError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.code = 3;
        return _this;
    }
    return CryptoKeyError;
}(WebCryptoError));
CryptoKeyError.EMPTY_KEY = "CryptoKey is empty";
CryptoKeyError.WRONG_KEY_ALG = "CryptoKey has wrong algorithm '%1'. Must be '%2'";
CryptoKeyError.WRONG_KEY_TYPE = "CryptoKey has wrong type '%1'. Must be '%2'";
CryptoKeyError.WRONG_KEY_USAGE = "CryptoKey has wrong key usage. Must be '%1'";
CryptoKeyError.NOT_EXTRACTABLE = "CryptoKey is not extractable";
CryptoKeyError.WRONG_FORMAT = "CryptoKey has '%1' type. It can be used with '%2' format";
CryptoKeyError.UNKNOWN_FORMAT = "Unknown format in use '%1'. Must be one of 'raw', 'pkcs8', 'spki'  or 'jwk'";
CryptoKeyError.ALLOWED_FORMAT = "Wrong format value '%1'. Must be %2";

function PrepareAlgorithm(alg) {
    var res;
    if (typeof alg === "string") {
        res = { name: alg };
    }
    else {
        res = alg;
    }
    BaseCrypto.checkAlgorithm(res);
    var hashedAlg = alg;
    if (hashedAlg.hash) {
        hashedAlg.hash = PrepareAlgorithm(hashedAlg.hash);
    }
    return res;
}
function PrepareData(data, paramName) {
    if (!data) {
        throw new WebCryptoError("Parameter '" + paramName + "' is required and cant be empty");
    }
    if (typeof Buffer !== "undefined" && Buffer.isBuffer(data)) {
        return new Uint8Array(data);
    }
    if (ArrayBuffer.isView(data)) {
        return new Uint8Array(data.buffer);
    }
    if (data instanceof ArrayBuffer) {
        return new Uint8Array(data);
    }
    throw new WebCryptoError("Incoming parameter '" + paramName + "' has wrong data type. Must be ArrayBufferView or ArrayBuffer");
}
var BaseCrypto = (function () {
    function BaseCrypto() {
    }
    BaseCrypto.checkAlgorithm = function (alg) {
        if (typeof alg !== "object") {
            throw new TypeError("Wrong algorithm data type. Must be Object");
        }
        if (!("name" in alg)) {
            throw new AlgorithmError(AlgorithmError.PARAM_REQUIRED, "name");
        }
    };
    BaseCrypto.checkAlgorithmParams = function (alg) {
        this.checkAlgorithm(alg);
    };
    BaseCrypto.checkKey = function (key, alg, type, usage) {
        if (type === void 0) { type = null; }
        if (usage === void 0) { usage = null; }
        if (!key) {
            throw new CryptoKeyError(CryptoKeyError.EMPTY_KEY);
        }
        var keyAlg = key.algorithm;
        this.checkAlgorithm(keyAlg);
        if (alg && (keyAlg.name.toUpperCase() !== alg.toUpperCase())) {
            throw new CryptoKeyError(CryptoKeyError.WRONG_KEY_ALG, keyAlg.name, alg);
        }
        if (type && (!key.type || key.type.toUpperCase() !== type.toUpperCase())) {
            throw new CryptoKeyError(CryptoKeyError.WRONG_KEY_TYPE, key.type, type);
        }
        if (usage) {
            if (!key.usages.some(function (keyUsage) { return usage.toUpperCase() === keyUsage.toUpperCase(); })) {
                throw new CryptoKeyError(CryptoKeyError.WRONG_KEY_USAGE, usage);
            }
        }
    };
    BaseCrypto.checkWrappedKey = function (key) {
        if (!key.extractable) {
            throw new CryptoKeyError(CryptoKeyError.NOT_EXTRACTABLE);
        }
    };
    BaseCrypto.checkKeyUsages = function (keyUsages) {
        if (!keyUsages || !keyUsages.length) {
            throw new WebCryptoError("Parameter 'keyUsages' cannot be empty.");
        }
    };
    BaseCrypto.checkFormat = function (format, type) {
        switch (format.toLowerCase()) {
            case "raw":
                if (type && type.toLowerCase() !== "secret" && type && type.toLowerCase() !== "public") {
                    throw new CryptoKeyError(CryptoKeyError.WRONG_FORMAT, type, "raw");
                }
                break;
            case "pkcs8":
                if (type && type.toLowerCase() !== "private") {
                    throw new CryptoKeyError(CryptoKeyError.WRONG_FORMAT, type, "pkcs8");
                }
                break;
            case "spki":
                if (type && type.toLowerCase() !== "public") {
                    throw new CryptoKeyError(CryptoKeyError.WRONG_FORMAT, type, "spki");
                }
                break;
            case "jwk":
                break;
            default:
                throw new CryptoKeyError(CryptoKeyError.UNKNOWN_FORMAT, format);
        }
    };
    BaseCrypto.generateKey = function (algorithm, extractable, keyUsages) {
        return new Promise(function (resolve, reject) {
            throw new WebCryptoError(WebCryptoError.NOT_SUPPORTED);
        });
    };
    BaseCrypto.digest = function (algorithm, data) {
        return new Promise(function (resolve, reject) {
            throw new WebCryptoError(WebCryptoError.NOT_SUPPORTED);
        });
    };
    BaseCrypto.sign = function (algorithm, key, data) {
        return new Promise(function (resolve, reject) {
            throw new WebCryptoError(WebCryptoError.NOT_SUPPORTED);
        });
    };
    BaseCrypto.verify = function (algorithm, key, signature, data) {
        return new Promise(function (resolve, reject) {
            throw new WebCryptoError(WebCryptoError.NOT_SUPPORTED);
        });
    };
    BaseCrypto.encrypt = function (algorithm, key, data) {
        return new Promise(function (resolve, reject) {
            throw new WebCryptoError(WebCryptoError.NOT_SUPPORTED);
        });
    };
    BaseCrypto.decrypt = function (algorithm, key, data) {
        return new Promise(function (resolve, reject) {
            throw new WebCryptoError(WebCryptoError.NOT_SUPPORTED);
        });
    };
    BaseCrypto.deriveBits = function (algorithm, baseKey, length) {
        return new Promise(function (resolve, reject) {
            throw new WebCryptoError(WebCryptoError.NOT_SUPPORTED);
        });
    };
    BaseCrypto.deriveKey = function (algorithm, baseKey, derivedKeyType, extractable, keyUsages) {
        return new Promise(function (resolve, reject) {
            throw new WebCryptoError(WebCryptoError.NOT_SUPPORTED);
        });
    };
    BaseCrypto.exportKey = function (format, key) {
        return new Promise(function (resolve, reject) {
            throw new WebCryptoError(WebCryptoError.NOT_SUPPORTED);
        });
    };
    BaseCrypto.importKey = function (format, keyData, algorithm, extractable, keyUsages) {
        return new Promise(function (resolve, reject) {
            throw new WebCryptoError(WebCryptoError.NOT_SUPPORTED);
        });
    };
    BaseCrypto.wrapKey = function (format, key, wrappingKey, wrapAlgorithm) {
        return new Promise(function (resolve, reject) {
            throw new WebCryptoError(WebCryptoError.NOT_SUPPORTED);
        });
    };
    BaseCrypto.unwrapKey = function (format, wrappedKey, unwrappingKey, unwrapAlgorithm, unwrappedKeyAlgorithm, extractable, keyUsages) {
        return new Promise(function (resolve, reject) {
            throw new WebCryptoError(WebCryptoError.NOT_SUPPORTED);
        });
    };
    return BaseCrypto;
}());

var AlgorithmNames = {
    RsaSSA: "RSASSA-PKCS1-v1_5",
    RsaPSS: "RSA-PSS",
    RsaOAEP: "RSA-OAEP",
    AesECB: "AES-ECB",
    AesCTR: "AES-CTR",
    AesCMAC: "AES-CMAC",
    AesGCM: "AES-GCM",
    AesCBC: "AES-CBC",
    AesKW: "AES-KW",
    Sha1: "SHA-1",
    Sha256: "SHA-256",
    Sha384: "SHA-384",
    Sha512: "SHA-512",
    EcDSA: "ECDSA",
    EcDH: "ECDH",
    Hmac: "HMAC",
    Pbkdf2: "PBKDF2",
};

if (typeof self === "undefined") {
    var g = global;
    g.btoa = function (data) { return new Buffer(data, "binary").toString("base64"); };
    g.atob = function (data) { return new Buffer(data, "base64").toString("binary"); };
}
var AesKeyGenParamsError = (function (_super) {
    __extends(AesKeyGenParamsError, _super);
    function AesKeyGenParamsError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.code = 7;
        return _this;
    }
    return AesKeyGenParamsError;
}(AlgorithmError));
var Aes = (function (_super) {
    __extends(Aes, _super);
    function Aes() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Aes.checkKeyUsages = function (keyUsages) {
        var _this = this;
        _super.checkKeyUsages.call(this, keyUsages);
        var wrongUsage = keyUsages.filter(function (usage) { return _this.KEY_USAGES.indexOf(usage) === -1; });
        if (wrongUsage.length) {
            throw new AlgorithmError(AlgorithmError.WRONG_USAGE, wrongUsage.join(", "));
        }
    };
    Aes.checkAlgorithm = function (alg) {
        if (alg.name.toUpperCase() !== this.ALG_NAME.toUpperCase()) {
            throw new AlgorithmError(AlgorithmError.WRONG_ALG_NAME, alg.name, this.ALG_NAME);
        }
    };
    Aes.checkKeyGenParams = function (alg) {
        switch (alg.length) {
            case 128:
            case 192:
            case 256:
                break;
            default:
                throw new AesKeyGenParamsError(AesKeyGenParamsError.PARAM_WRONG_VALUE, "length", "128, 192 or 256");
        }
    };
    Aes.generateKey = function (algorithm, extractable, keyUsages) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.checkAlgorithm(algorithm);
            _this.checkKeyGenParams(algorithm);
            _this.checkKeyUsages(keyUsages);
            resolve(undefined);
        });
    };
    Aes.exportKey = function (format, key) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.checkKey(key, _this.ALG_NAME);
            _this.checkFormat(format, key.type);
            resolve(undefined);
        });
    };
    Aes.importKey = function (format, keyData, algorithm, extractable, keyUsages) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.checkAlgorithm(algorithm);
            _this.checkFormat(format);
            if (!(format.toLowerCase() === "raw" || format.toLowerCase() === "jwk")) {
                throw new CryptoKeyError(CryptoKeyError.ALLOWED_FORMAT, format, "'jwk' or 'raw'");
            }
            _this.checkKeyUsages(keyUsages);
            resolve(undefined);
        });
    };
    return Aes;
}(BaseCrypto));
Aes.ALG_NAME = "";
Aes.KEY_USAGES = [];
var AesAlgorithmError = (function (_super) {
    __extends(AesAlgorithmError, _super);
    function AesAlgorithmError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.code = 8;
        return _this;
    }
    return AesAlgorithmError;
}(AlgorithmError));
var AesWrapKey = (function (_super) {
    __extends(AesWrapKey, _super);
    function AesWrapKey() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AesWrapKey.wrapKey = function (format, key, wrappingKey, wrapAlgorithm) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.checkAlgorithmParams(wrapAlgorithm);
            _this.checkKey(wrappingKey, _this.ALG_NAME, "secret", "wrapKey");
            _this.checkWrappedKey(key);
            _this.checkFormat(format, key.type);
            resolve(undefined);
        });
    };
    AesWrapKey.unwrapKey = function (format, wrappedKey, unwrappingKey, unwrapAlgorithm, unwrappedKeyAlgorithm, extractable, keyUsages) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.checkAlgorithmParams(unwrapAlgorithm);
            _this.checkKey(unwrappingKey, _this.ALG_NAME, "secret", "unwrapKey");
            _this.checkFormat(format);
            resolve(undefined);
        });
    };
    return AesWrapKey;
}(Aes));
var AesEncrypt = (function (_super) {
    __extends(AesEncrypt, _super);
    function AesEncrypt() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AesEncrypt.encrypt = function (algorithm, key, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.checkAlgorithmParams(algorithm);
            _this.checkKey(key, _this.ALG_NAME, "secret", "encrypt");
            resolve(undefined);
        });
    };
    AesEncrypt.decrypt = function (algorithm, key, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.checkAlgorithmParams(algorithm);
            _this.checkKey(key, _this.ALG_NAME, "secret", "decrypt");
            resolve(undefined);
        });
    };
    return AesEncrypt;
}(AesWrapKey));
AesEncrypt.KEY_USAGES = ["encrypt", "decrypt", "wrapKey", "unwrapKey"];
var AesECB = (function (_super) {
    __extends(AesECB, _super);
    function AesECB() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AesECB;
}(AesEncrypt));
AesECB.ALG_NAME = AlgorithmNames.AesECB;
var AesCBC = (function (_super) {
    __extends(AesCBC, _super);
    function AesCBC() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AesCBC.checkAlgorithmParams = function (alg) {
        this.checkAlgorithm(alg);
        if (!alg.iv) {
            throw new AesAlgorithmError(AesAlgorithmError.PARAM_REQUIRED, "iv");
        }
        if (!(ArrayBuffer.isView(alg.iv) || alg.iv instanceof ArrayBuffer)) {
            throw new AesAlgorithmError(AesAlgorithmError.PARAM_WRONG_TYPE, "iv", "ArrayBufferView or ArrayBuffer");
        }
        if (alg.iv.byteLength !== 16) {
            throw new AesAlgorithmError(AesAlgorithmError.PARAM_WRONG_VALUE, "iv", "ArrayBufferView or ArrayBuffer with size 16");
        }
    };
    return AesCBC;
}(AesEncrypt));
AesCBC.ALG_NAME = AlgorithmNames.AesCBC;
var AesCTR = (function (_super) {
    __extends(AesCTR, _super);
    function AesCTR() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AesCTR.checkAlgorithmParams = function (alg) {
        this.checkAlgorithm(alg);
        if (!(alg.counter && (ArrayBuffer.isView(alg.counter) || alg.counter instanceof ArrayBuffer))) {
            throw new AesAlgorithmError(AesAlgorithmError.PARAM_WRONG_TYPE, "counter", "ArrayBufferView or ArrayBuffer");
        }
        if (alg.counter.byteLength !== 16) {
            throw new AesAlgorithmError(AesAlgorithmError.PARAM_WRONG_VALUE, "counter", "ArrayBufferView or ArrayBuffer with size 16");
        }
        if (!(alg.length > 0 && alg.length <= 128)) {
            throw new AesAlgorithmError(AesAlgorithmError.PARAM_WRONG_VALUE, "length", "number [1-128]");
        }
    };
    return AesCTR;
}(AesEncrypt));
AesCTR.ALG_NAME = AlgorithmNames.AesCTR;
var AesGCM = (function (_super) {
    __extends(AesGCM, _super);
    function AesGCM() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AesGCM.checkAlgorithmParams = function (alg) {
        this.checkAlgorithm(alg);
        if (alg.additionalData) {
            if (!(ArrayBuffer.isView(alg.additionalData) || alg.additionalData instanceof ArrayBuffer)) {
                throw new AesAlgorithmError(AesAlgorithmError.PARAM_WRONG_TYPE, "additionalData", "ArrayBufferView or ArrayBuffer");
            }
        }
        if (!alg.iv) {
            throw new AesAlgorithmError(AesAlgorithmError.PARAM_REQUIRED, "iv");
        }
        if (!(ArrayBuffer.isView(alg.iv) || alg.iv instanceof ArrayBuffer)) {
            throw new AesAlgorithmError(AesAlgorithmError.PARAM_WRONG_TYPE, "iv", "ArrayBufferView or ArrayBuffer");
        }
        if (alg.tagLength) {
            var ok = [32, 64, 96, 104, 112, 120, 128].some(function (tagLength) {
                return tagLength === alg.tagLength;
            });
            if (!ok) {
                throw new AesAlgorithmError(AesAlgorithmError.PARAM_WRONG_VALUE, "tagLength", "32, 64, 96, 104, 112, 120 or 128");
            }
        }
    };
    return AesGCM;
}(AesEncrypt));
AesGCM.ALG_NAME = AlgorithmNames.AesGCM;
var AesKW = (function (_super) {
    __extends(AesKW, _super);
    function AesKW() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AesKW.checkAlgorithmParams = function (alg) {
        this.checkAlgorithm(alg);
    };
    return AesKW;
}(AesWrapKey));
AesKW.ALG_NAME = AlgorithmNames.AesKW;
AesKW.KEY_USAGES = ["wrapKey", "unwrapKey"];

var ShaAlgorithms = [AlgorithmNames.Sha1, AlgorithmNames.Sha256, AlgorithmNames.Sha384, AlgorithmNames.Sha512].join(" | ");
var Sha = (function (_super) {
    __extends(Sha, _super);
    function Sha() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Sha.checkAlgorithm = function (alg) {
        var _alg;
        if (typeof alg === "string")
            _alg = { name: alg };
        else
            _alg = alg;
        _super.checkAlgorithm.call(this, _alg);
        switch (_alg.name.toUpperCase()) {
            case AlgorithmNames.Sha1:
            case AlgorithmNames.Sha256:
            case AlgorithmNames.Sha384:
            case AlgorithmNames.Sha512:
                break;
            default:
                throw new AlgorithmError(AlgorithmError.WRONG_ALG_NAME, _alg.name, ShaAlgorithms);
        }
    };
    Sha.digest = function (algorithm, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.checkAlgorithm(algorithm);
            resolve(undefined);
        });
    };
    return Sha;
}(BaseCrypto));

var EcKeyGenParamsError = (function (_super) {
    __extends(EcKeyGenParamsError, _super);
    function EcKeyGenParamsError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.code = 9;
        return _this;
    }
    return EcKeyGenParamsError;
}(AlgorithmError));
var Ec = (function (_super) {
    __extends(Ec, _super);
    function Ec() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Ec.checkAlgorithm = function (alg) {
        if (alg.name.toUpperCase() !== this.ALG_NAME.toUpperCase()) {
            throw new AlgorithmError(AlgorithmError.WRONG_ALG_NAME, alg.name, this.ALG_NAME);
        }
    };
    Ec.checkKeyGenParams = function (alg) {
        var paramNamedCurve = "namedCurve";
        if (!alg.namedCurve) {
            throw new EcKeyGenParamsError(EcKeyGenParamsError.PARAM_REQUIRED, paramNamedCurve);
        }
        if (!(typeof alg.namedCurve === "string")) {
            throw new EcKeyGenParamsError(EcKeyGenParamsError.PARAM_WRONG_TYPE, paramNamedCurve, "string");
        }
        switch (alg.namedCurve.toUpperCase()) {
            case "P-256":
            case "P-384":
            case "P-521":
                break;
            default:
                throw new EcKeyGenParamsError(EcKeyGenParamsError.PARAM_WRONG_VALUE, paramNamedCurve, "P-256, P-384 or P-521");
        }
    };
    Ec.checkKeyGenUsages = function (keyUsages) {
        var _this = this;
        keyUsages.forEach(function (usage) {
            var i = 0;
            for (i; i < _this.KEY_USAGES.length; i++) {
                if (_this.KEY_USAGES[i].toLowerCase() === usage.toLowerCase()) {
                    break;
                }
            }
            if (i === _this.KEY_USAGES.length) {
                throw new WebCryptoError("Unsupported key usage '" + usage + "'. Should be one of [" + _this.KEY_USAGES.join(", ") + "]");
            }
        });
    };
    Ec.generateKey = function (algorithm, extractable, keyUsages) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.checkAlgorithm(algorithm);
            _this.checkKeyGenParams(algorithm);
            _this.checkKeyGenUsages(keyUsages);
            resolve(undefined);
        });
    };
    Ec.exportKey = function (format, key) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.checkKey(key, _this.ALG_NAME);
            if (!(format && format.toLowerCase() === "raw" && key.type === "public")) {
                _this.checkFormat(format, key.type);
            }
            resolve(undefined);
        });
    };
    Ec.importKey = function (format, keyData, algorithm, extractable, keyUsages) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.checkKeyGenParams(algorithm);
            _this.checkFormat(format);
            _this.checkKeyGenUsages(keyUsages);
            resolve(undefined);
        });
    };
    return Ec;
}(BaseCrypto));
Ec.ALG_NAME = "";
Ec.KEY_USAGES = [];
var EcAlgorithmError = (function (_super) {
    __extends(EcAlgorithmError, _super);
    function EcAlgorithmError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.code = 10;
        return _this;
    }
    return EcAlgorithmError;
}(AlgorithmError));
var EcDSA = (function (_super) {
    __extends(EcDSA, _super);
    function EcDSA() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EcDSA.checkAlgorithmParams = function (alg) {
        this.checkAlgorithm(alg);
        Sha.checkAlgorithm(alg.hash);
    };
    EcDSA.sign = function (algorithm, key, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.checkAlgorithmParams(algorithm);
            _this.checkKey(key, _this.ALG_NAME, "private", "sign");
            resolve(undefined);
        });
    };
    EcDSA.verify = function (algorithm, key, signature, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.checkAlgorithmParams(algorithm);
            _this.checkKey(key, _this.ALG_NAME, "public", "verify");
            resolve(undefined);
        });
    };
    return EcDSA;
}(Ec));
EcDSA.ALG_NAME = AlgorithmNames.EcDSA;
EcDSA.KEY_USAGES = ["sign", "verify", "deriveKey", "deriveBits"];
var EcDH = (function (_super) {
    __extends(EcDH, _super);
    function EcDH() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EcDH.checkDeriveParams = function (algorithm) {
        var paramPublic = "public";
        this.checkAlgorithm(algorithm);
        if (!algorithm.public) {
            throw new EcAlgorithmError(EcAlgorithmError.PARAM_REQUIRED, paramPublic);
        }
        this.checkKey(algorithm.public, this.ALG_NAME, "public");
    };
    EcDH.deriveBits = function (algorithm, baseKey, length) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.checkDeriveParams(algorithm);
            _this.checkKey(baseKey, _this.ALG_NAME, "private", "deriveBits");
            resolve(undefined);
        });
    };
    EcDH.deriveKey = function (algorithm, baseKey, derivedKeyType, extractable, keyUsages) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.checkDeriveParams(algorithm);
            _this.checkKey(baseKey, _this.ALG_NAME, "private", "deriveKey");
            BaseCrypto.checkAlgorithm(derivedKeyType);
            switch (derivedKeyType.name.toUpperCase()) {
                case AlgorithmNames.AesCBC:
                    AesCBC.checkKeyGenParams(derivedKeyType);
                    break;
                case AlgorithmNames.AesCTR:
                    AesCTR.checkKeyGenParams(derivedKeyType);
                    break;
                case AlgorithmNames.AesGCM:
                    AesGCM.checkKeyGenParams(derivedKeyType);
                    break;
                case AlgorithmNames.AesKW:
                    AesKW.checkKeyGenParams(derivedKeyType);
                    break;
                default:
                    throw new EcAlgorithmError("Unsupported name '" + derivedKeyType.name + "' for algorithm in param 'derivedKeyType'");
            }
            resolve(undefined);
        });
    };
    return EcDH;
}(Ec));
EcDH.ALG_NAME = AlgorithmNames.EcDH;
EcDH.KEY_USAGES = ["deriveKey", "deriveBits"];

var Hmac = (function (_super) {
    __extends(Hmac, _super);
    function Hmac() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Hmac.checkAlgorithm = function (alg) {
        if (alg.name.toUpperCase() !== this.ALG_NAME.toUpperCase()) {
            throw new AlgorithmError(AlgorithmError.WRONG_ALG_NAME, alg.name, this.ALG_NAME);
        }
    };
    Hmac.checkKeyGenParams = function (alg) {
        if ("length" in alg && !(alg.length > 0 && alg.length <= 512)) {
            throw new AlgorithmError(AlgorithmError.PARAM_WRONG_VALUE, "length", "more 0 and less than 512");
        }
    };
    Hmac.checkKeyGenUsages = function (keyUsages) {
        var _this = this;
        this.checkKeyUsages(keyUsages);
        keyUsages.forEach(function (usage) {
            var i = 0;
            for (i; i < _this.KEY_USAGES.length; i++) {
                if (_this.KEY_USAGES[i].toLowerCase() === usage.toLowerCase()) {
                    break;
                }
            }
            if (i === _this.KEY_USAGES.length) {
                throw new WebCryptoError("Unsupported key usage '" + usage + "'. Should be one of [" + _this.KEY_USAGES.join(", ") + "]");
            }
        });
    };
    Hmac.generateKey = function (algorithm, extractable, keyUsages) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.checkAlgorithm(algorithm);
            _this.checkKeyGenParams(algorithm);
            _this.checkKeyGenUsages(keyUsages);
            resolve(undefined);
        });
    };
    Hmac.exportKey = function (format, key) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.checkKey(key, _this.ALG_NAME);
            _this.checkFormat(format, key.type);
            resolve(undefined);
        });
    };
    Hmac.importKey = function (format, keyData, algorithm, extractable, keyUsages) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.checkAlgorithm(algorithm);
            _this.checkFormat(format);
            if (!(format.toLowerCase() === "raw" || format.toLowerCase() === "jwk")) {
                throw new CryptoKeyError(CryptoKeyError.ALLOWED_FORMAT, format, "'jwk' or 'raw'");
            }
            _this.checkKeyGenUsages(keyUsages);
            resolve(undefined);
        });
    };
    Hmac.sign = function (algorithm, key, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.checkAlgorithmParams(algorithm);
            _this.checkKey(key, _this.ALG_NAME, "secret", "sign");
            resolve(undefined);
        });
    };
    Hmac.verify = function (algorithm, key, signature, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.checkAlgorithmParams(algorithm);
            _this.checkKey(key, _this.ALG_NAME, "secret", "verify");
            resolve(undefined);
        });
    };
    return Hmac;
}(BaseCrypto));
Hmac.ALG_NAME = AlgorithmNames.Hmac;
Hmac.KEY_USAGES = ["sign", "verify"];

var Pbkdf2 = (function (_super) {
    __extends(Pbkdf2, _super);
    function Pbkdf2() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Pbkdf2.checkAlgorithm = function (alg) {
        if (alg.name.toUpperCase() !== this.ALG_NAME.toUpperCase()) {
            throw new AlgorithmError(AlgorithmError.WRONG_ALG_NAME, alg.name, this.ALG_NAME);
        }
    };
    Pbkdf2.checkDeriveParams = function (alg) {
        this.checkAlgorithm(alg);
        if (alg.salt) {
            if (!(ArrayBuffer.isView(alg.salt) || alg.salt instanceof ArrayBuffer)) {
                throw new AlgorithmError(AlgorithmError.PARAM_WRONG_TYPE, "salt", "ArrayBuffer or ArrayBufferView");
            }
        }
        else {
            throw new AlgorithmError(AlgorithmError.PARAM_REQUIRED, "salt");
        }
        if (!alg.iterations) {
            throw new AlgorithmError(AlgorithmError.PARAM_REQUIRED, "iterations");
        }
        if (!alg.hash) {
            throw new AlgorithmError(AlgorithmError.PARAM_REQUIRED, "hash");
        }
        var hash = PrepareAlgorithm(alg.hash);
        Sha.checkAlgorithm(hash);
    };
    Pbkdf2.importKey = function (format, keyData, algorithm, extractable, keyUsages) {
        var _this = this;
        return Promise.resolve()
            .then(function () {
            if (extractable) {
                throw new WebCryptoError("KDF keys must set extractable=false");
            }
            _this.checkAlgorithm(algorithm);
            _this.checkFormat(format);
            if (format.toLowerCase() !== "raw") {
                throw new CryptoKeyError(CryptoKeyError.ALLOWED_FORMAT, format, "'raw'");
            }
            _this.checkKeyUsages(keyUsages);
        });
    };
    Pbkdf2.deriveKey = function (algorithm, baseKey, derivedKeyType, extractable, keyUsages) {
        var _this = this;
        return Promise.resolve()
            .then(function () {
            _this.checkDeriveParams(algorithm);
            _this.checkKey(baseKey, _this.ALG_NAME, "secret", "deriveKey");
            BaseCrypto.checkAlgorithm(derivedKeyType);
            switch (derivedKeyType.name.toUpperCase()) {
                case AlgorithmNames.AesCBC:
                    AesCBC.checkKeyGenParams(derivedKeyType);
                    AesCBC.checkKeyUsages(keyUsages);
                    break;
                case AlgorithmNames.AesCTR:
                    AesCTR.checkKeyGenParams(derivedKeyType);
                    AesCTR.checkKeyUsages(keyUsages);
                    break;
                case AlgorithmNames.AesGCM:
                    AesGCM.checkKeyGenParams(derivedKeyType);
                    AesGCM.checkKeyUsages(keyUsages);
                    break;
                case AlgorithmNames.AesKW:
                    AesKW.checkKeyGenParams(derivedKeyType);
                    AesKW.checkKeyUsages(keyUsages);
                    break;
                case AlgorithmNames.Hmac:
                    Hmac.checkKeyGenParams(derivedKeyType);
                    Hmac.checkKeyUsages(keyUsages);
                    break;
                default:
                    throw new AlgorithmError(AlgorithmError.UNSUPPORTED_ALGORITHM, derivedKeyType);
            }
        });
    };
    Pbkdf2.deriveBits = function (algorithm, baseKey, length) {
        var _this = this;
        return Promise.resolve()
            .then(function () {
            _this.checkDeriveParams(algorithm);
            _this.checkKey(baseKey, _this.ALG_NAME, "secret", "deriveBits");
            if (!(length && typeof length === "number")) {
                throw new WebCryptoError("Parameter 'length' must be Number and more than 0");
            }
        });
    };
    return Pbkdf2;
}(BaseCrypto));
Pbkdf2.ALG_NAME = AlgorithmNames.Pbkdf2;
Pbkdf2.KEY_USAGES = ["deriveKey", "deriveBits"];

var RsaKeyGenParamsError = (function (_super) {
    __extends(RsaKeyGenParamsError, _super);
    function RsaKeyGenParamsError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.code = 2;
        return _this;
    }
    return RsaKeyGenParamsError;
}(AlgorithmError));
var RsaHashedImportParamsError = (function (_super) {
    __extends(RsaHashedImportParamsError, _super);
    function RsaHashedImportParamsError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.code = 6;
        return _this;
    }
    return RsaHashedImportParamsError;
}(AlgorithmError));
var Rsa = (function (_super) {
    __extends(Rsa, _super);
    function Rsa() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rsa.checkAlgorithm = function (alg) {
        if (alg.name.toUpperCase() !== this.ALG_NAME.toUpperCase()) {
            throw new AlgorithmError(AlgorithmError.WRONG_ALG_NAME, alg.name, this.ALG_NAME);
        }
    };
    Rsa.checkImportAlgorithm = function (alg) {
        this.checkAlgorithm(alg);
        if (!alg.hash) {
            throw new RsaHashedImportParamsError(RsaHashedImportParamsError.PARAM_REQUIRED, "hash");
        }
        Sha.checkAlgorithm(alg.hash);
    };
    Rsa.checkKeyGenParams = function (alg) {
        var modulusBits = alg.modulusLength;
        if (!(modulusBits >= 256 && modulusBits <= 16384 && !(modulusBits % 8))) {
            throw new RsaKeyGenParamsError(RsaKeyGenParamsError.PARAM_WRONG_VALUE, "modulusLength", " a multiple of 8 bits and >= 256 and <= 16384");
        }
        var pubExp = alg.publicExponent;
        if (!pubExp) {
            throw new RsaKeyGenParamsError(RsaKeyGenParamsError.PARAM_REQUIRED, "publicExponent");
        }
        if (!ArrayBuffer.isView(pubExp)) {
            throw new RsaKeyGenParamsError(RsaKeyGenParamsError.PARAM_WRONG_TYPE, "publicExponent", "ArrayBufferView");
        }
        if (!(pubExp[0] === 3 || (pubExp[0] === 1 && pubExp[1] === 0 && pubExp[2] === 1))) {
            throw new RsaKeyGenParamsError(RsaKeyGenParamsError.PARAM_WRONG_VALUE, "publicExponent", "Uint8Array([3]) | Uint8Array([1, 0, 1])");
        }
        if (!alg.hash) {
            throw new RsaKeyGenParamsError(RsaKeyGenParamsError.PARAM_REQUIRED, "hash", ShaAlgorithms);
        }
        Sha.checkAlgorithm(alg.hash);
    };
    Rsa.checkKeyGenUsages = function (keyUsages) {
        var _this = this;
        this.checkKeyUsages(keyUsages);
        keyUsages.forEach(function (usage) {
            var i = 0;
            for (i; i < _this.KEY_USAGES.length; i++) {
                if (_this.KEY_USAGES[i].toLowerCase() === usage.toLowerCase()) {
                    break;
                }
            }
            if (i === _this.KEY_USAGES.length) {
                throw new WebCryptoError("Unsupported key usage '" + usage + "'. Should be one of [" + _this.KEY_USAGES.join(", ") + "]");
            }
        });
    };
    Rsa.generateKey = function (algorithm, extractable, keyUsages) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.checkAlgorithm(algorithm);
            _this.checkKeyGenParams(algorithm);
            _this.checkKeyGenUsages(keyUsages);
            resolve(undefined);
        });
    };
    Rsa.exportKey = function (format, key) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.checkKey(key, _this.ALG_NAME);
            _this.checkFormat(format, key.type);
            resolve(undefined);
        });
    };
    Rsa.importKey = function (format, keyData, algorithm, extractable, keyUsages) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.checkImportAlgorithm(algorithm);
            _this.checkFormat(format);
            if (format.toLowerCase() === "raw") {
                throw new CryptoKeyError(CryptoKeyError.ALLOWED_FORMAT, format, "'JsonWebKey', 'pkcs8' or 'spki'");
            }
            _this.checkKeyGenUsages(keyUsages);
            resolve(undefined);
        });
    };
    return Rsa;
}(BaseCrypto));
Rsa.ALG_NAME = "";
Rsa.KEY_USAGES = [];
var RsaSSA = (function (_super) {
    __extends(RsaSSA, _super);
    function RsaSSA() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RsaSSA.sign = function (algorithm, key, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.checkAlgorithmParams(algorithm);
            _this.checkKey(key, _this.ALG_NAME, "private", "sign");
            resolve(undefined);
        });
    };
    RsaSSA.verify = function (algorithm, key, signature, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.checkAlgorithmParams(algorithm);
            _this.checkKey(key, _this.ALG_NAME, "public", "verify");
            resolve(undefined);
        });
    };
    return RsaSSA;
}(Rsa));
RsaSSA.ALG_NAME = AlgorithmNames.RsaSSA;
RsaSSA.KEY_USAGES = ["sign", "verify"];
var RsaPSSParamsError = (function (_super) {
    __extends(RsaPSSParamsError, _super);
    function RsaPSSParamsError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.code = 4;
        return _this;
    }
    return RsaPSSParamsError;
}(AlgorithmError));
var RsaPSS = (function (_super) {
    __extends(RsaPSS, _super);
    function RsaPSS() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RsaPSS.checkAlgorithmParams = function (algorithm) {
        var alg = algorithm;
        _super.checkAlgorithmParams.call(this, alg);
        if (!alg.saltLength) {
            throw new RsaPSSParamsError(RsaPSSParamsError.PARAM_REQUIRED, "saltLength");
        }
        if (alg.saltLength < 0) {
            throw new RsaPSSParamsError("Parameter 'saltLength' is outside of numeric range");
        }
    };
    return RsaPSS;
}(RsaSSA));
RsaPSS.ALG_NAME = AlgorithmNames.RsaPSS;
var RsaOAEPParamsError = (function (_super) {
    __extends(RsaOAEPParamsError, _super);
    function RsaOAEPParamsError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.code = 5;
        return _this;
    }
    return RsaOAEPParamsError;
}(AlgorithmError));
var RsaOAEP = (function (_super) {
    __extends(RsaOAEP, _super);
    function RsaOAEP() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RsaOAEP.checkAlgorithmParams = function (alg) {
        if (alg.label) {
            if (!(ArrayBuffer.isView(alg.label) || alg.label instanceof ArrayBuffer)) {
                throw new RsaOAEPParamsError(RsaOAEPParamsError.PARAM_WRONG_TYPE, "label", "ArrayBufferView or ArrayBuffer");
            }
        }
    };
    RsaOAEP.encrypt = function (algorithm, key, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.checkAlgorithmParams(algorithm);
            _this.checkKey(key, _this.ALG_NAME, "public", "encrypt");
            resolve(undefined);
        });
    };
    RsaOAEP.decrypt = function (algorithm, key, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.checkAlgorithmParams(algorithm);
            _this.checkKey(key, _this.ALG_NAME, "private", "decrypt");
            resolve(undefined);
        });
    };
    RsaOAEP.wrapKey = function (format, key, wrappingKey, wrapAlgorithm) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.checkAlgorithmParams(wrapAlgorithm);
            _this.checkKey(wrappingKey, _this.ALG_NAME, "public", "wrapKey");
            _this.checkWrappedKey(key);
            _this.checkFormat(format, key.type);
            resolve(undefined);
        });
    };
    RsaOAEP.unwrapKey = function (format, wrappedKey, unwrappingKey, unwrapAlgorithm, unwrappedKeyAlgorithm, extractable, keyUsages) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.checkAlgorithmParams(unwrapAlgorithm);
            _this.checkKey(unwrappingKey, _this.ALG_NAME, "private", "unwrapKey");
            _this.checkFormat(format);
            resolve(undefined);
        });
    };
    return RsaOAEP;
}(Rsa));
RsaOAEP.ALG_NAME = AlgorithmNames.RsaOAEP;
RsaOAEP.KEY_USAGES = ["encrypt", "decrypt", "wrapKey", "unwrapKey"];

var SubtleCrypto = (function () {
    function SubtleCrypto() {
    }
    SubtleCrypto.prototype.generateKey = function (algorithm, extractable, keyUsages) {
        return new Promise(function (resolve, reject) {
            var alg = PrepareAlgorithm(algorithm);
            var Class = BaseCrypto;
            switch (alg.name.toUpperCase()) {
                case AlgorithmNames.RsaSSA.toUpperCase():
                    Class = RsaSSA;
                    break;
                case AlgorithmNames.RsaOAEP.toUpperCase():
                    Class = RsaOAEP;
                    break;
                case AlgorithmNames.RsaPSS.toUpperCase():
                    Class = RsaPSS;
                    break;
                case AlgorithmNames.AesECB.toUpperCase():
                    Class = AesECB;
                    break;
                case AlgorithmNames.AesCBC.toUpperCase():
                    Class = AesCBC;
                    break;
                case AlgorithmNames.AesCTR.toUpperCase():
                    Class = AesCTR;
                    break;
                case AlgorithmNames.AesGCM.toUpperCase():
                    Class = AesGCM;
                    break;
                case AlgorithmNames.AesKW.toUpperCase():
                    Class = AesKW;
                    break;
                case AlgorithmNames.EcDSA.toUpperCase():
                    Class = EcDSA;
                    break;
                case AlgorithmNames.EcDH.toUpperCase():
                    Class = EcDH;
                    break;
                case AlgorithmNames.Hmac.toUpperCase():
                    Class = Hmac;
                    break;
                default:
                    throw new AlgorithmError(AlgorithmError.UNSUPPORTED_ALGORITHM, alg.name);
            }
            Class.generateKey(alg, extractable, keyUsages).then(resolve, reject);
        });
    };
    SubtleCrypto.prototype.digest = function (algorithm, data) {
        return new Promise(function (resolve, reject) {
            var alg = PrepareAlgorithm(algorithm);
            var buf = PrepareData(data, "data");
            var Class = BaseCrypto;
            switch (alg.name.toUpperCase()) {
                case AlgorithmNames.Sha1.toUpperCase():
                case AlgorithmNames.Sha256.toUpperCase():
                case AlgorithmNames.Sha384.toUpperCase():
                case AlgorithmNames.Sha512.toUpperCase():
                    Class = Sha;
                    break;
                default:
                    throw new AlgorithmError(AlgorithmError.UNSUPPORTED_ALGORITHM, alg.name);
            }
            Class.digest(alg, buf).then(resolve, reject);
        });
    };
    SubtleCrypto.prototype.sign = function (algorithm, key, data) {
        return new Promise(function (resolve, reject) {
            var alg = PrepareAlgorithm(algorithm);
            var buf = PrepareData(data, "data");
            var Class = BaseCrypto;
            switch (alg.name.toUpperCase()) {
                case AlgorithmNames.RsaSSA.toUpperCase():
                    Class = RsaSSA;
                    break;
                case AlgorithmNames.RsaPSS.toUpperCase():
                    Class = RsaPSS;
                    break;
                case AlgorithmNames.EcDSA.toUpperCase():
                    Class = EcDSA;
                    break;
                case AlgorithmNames.Hmac.toUpperCase():
                    Class = Hmac;
                    break;
                default:
                    throw new AlgorithmError(AlgorithmError.UNSUPPORTED_ALGORITHM, alg.name);
            }
            Class.sign(alg, key, buf).then(resolve, reject);
        });
    };
    SubtleCrypto.prototype.verify = function (algorithm, key, signature, data) {
        return new Promise(function (resolve, reject) {
            var alg = PrepareAlgorithm(algorithm);
            var sigBuf = PrepareData(data, "signature");
            var buf = PrepareData(data, "data");
            var Class = BaseCrypto;
            switch (alg.name.toUpperCase()) {
                case AlgorithmNames.RsaSSA.toUpperCase():
                    Class = RsaSSA;
                    break;
                case AlgorithmNames.RsaPSS.toUpperCase():
                    Class = RsaPSS;
                    break;
                case AlgorithmNames.EcDSA.toUpperCase():
                    Class = EcDSA;
                    break;
                case AlgorithmNames.Hmac.toUpperCase():
                    Class = Hmac;
                    break;
                default:
                    throw new AlgorithmError(AlgorithmError.UNSUPPORTED_ALGORITHM, alg.name);
            }
            Class.verify(alg, key, sigBuf, buf).then(resolve, reject);
        });
    };
    SubtleCrypto.prototype.encrypt = function (algorithm, key, data) {
        return new Promise(function (resolve, reject) {
            var alg = PrepareAlgorithm(algorithm);
            var buf = PrepareData(data, "data");
            var Class = BaseCrypto;
            switch (alg.name.toUpperCase()) {
                case AlgorithmNames.RsaOAEP.toUpperCase():
                    Class = RsaOAEP;
                    break;
                case AlgorithmNames.AesECB.toUpperCase():
                    Class = AesECB;
                    break;
                case AlgorithmNames.AesCBC.toUpperCase():
                    Class = AesCBC;
                    break;
                case AlgorithmNames.AesCTR.toUpperCase():
                    Class = AesCTR;
                    break;
                case AlgorithmNames.AesGCM.toUpperCase():
                    Class = AesGCM;
                    break;
                default:
                    throw new AlgorithmError(AlgorithmError.UNSUPPORTED_ALGORITHM, alg.name);
            }
            Class.encrypt(alg, key, buf).then(resolve, reject);
        });
    };
    SubtleCrypto.prototype.decrypt = function (algorithm, key, data) {
        return new Promise(function (resolve, reject) {
            var alg = PrepareAlgorithm(algorithm);
            var buf = PrepareData(data, "data");
            var Class = BaseCrypto;
            switch (alg.name.toUpperCase()) {
                case AlgorithmNames.RsaOAEP.toUpperCase():
                    Class = RsaOAEP;
                    break;
                case AlgorithmNames.AesECB.toUpperCase():
                    Class = AesECB;
                    break;
                case AlgorithmNames.AesCBC.toUpperCase():
                    Class = AesCBC;
                    break;
                case AlgorithmNames.AesCTR.toUpperCase():
                    Class = AesCTR;
                    break;
                case AlgorithmNames.AesGCM.toUpperCase():
                    Class = AesGCM;
                    break;
                default:
                    throw new AlgorithmError(AlgorithmError.UNSUPPORTED_ALGORITHM, alg.name);
            }
            Class.decrypt(alg, key, buf).then(resolve, reject);
        });
    };
    SubtleCrypto.prototype.deriveBits = function (algorithm, baseKey, length) {
        return new Promise(function (resolve, reject) {
            var alg = PrepareAlgorithm(algorithm);
            var Class = BaseCrypto;
            switch (alg.name.toUpperCase()) {
                case AlgorithmNames.EcDH.toUpperCase():
                    Class = EcDH;
                    break;
                case AlgorithmNames.Pbkdf2.toUpperCase():
                    Class = Pbkdf2;
                    break;
                default:
                    throw new AlgorithmError(AlgorithmError.UNSUPPORTED_ALGORITHM, alg.name);
            }
            Class.deriveBits(alg, baseKey, length).then(resolve, reject);
        });
    };
    SubtleCrypto.prototype.deriveKey = function (algorithm, baseKey, derivedKeyType, extractable, keyUsages) {
        return new Promise(function (resolve, reject) {
            var alg = PrepareAlgorithm(algorithm);
            var derivedAlg = PrepareAlgorithm(derivedKeyType);
            var Class = BaseCrypto;
            switch (alg.name.toUpperCase()) {
                case AlgorithmNames.EcDH.toUpperCase():
                    Class = EcDH;
                    break;
                case AlgorithmNames.Pbkdf2.toUpperCase():
                    Class = Pbkdf2;
                    break;
                default:
                    throw new AlgorithmError(AlgorithmError.UNSUPPORTED_ALGORITHM, alg.name);
            }
            Class.deriveKey(alg, baseKey, derivedAlg, extractable, keyUsages).then(resolve, reject);
        });
    };
    SubtleCrypto.prototype.exportKey = function (format, key) {
        return new Promise(function (resolve, reject) {
            BaseCrypto.checkKey(key);
            if (!key.extractable) {
                throw new CryptoKeyError(CryptoKeyError.NOT_EXTRACTABLE);
            }
            var Class = BaseCrypto;
            switch (key.algorithm.name.toUpperCase()) {
                case AlgorithmNames.RsaSSA.toUpperCase():
                    Class = RsaSSA;
                    break;
                case AlgorithmNames.RsaPSS.toUpperCase():
                    Class = RsaPSS;
                    break;
                case AlgorithmNames.AesECB.toUpperCase():
                    Class = AesECB;
                    break;
                case AlgorithmNames.RsaOAEP.toUpperCase():
                    Class = RsaOAEP;
                    break;
                case AlgorithmNames.AesCBC.toUpperCase():
                    Class = AesCBC;
                    break;
                case AlgorithmNames.AesCTR.toUpperCase():
                    Class = AesCTR;
                    break;
                case AlgorithmNames.AesGCM.toUpperCase():
                    Class = AesGCM;
                    break;
                case AlgorithmNames.AesKW.toUpperCase():
                    Class = AesKW;
                    break;
                case AlgorithmNames.EcDSA.toUpperCase():
                    Class = EcDSA;
                    break;
                case AlgorithmNames.EcDH.toUpperCase():
                    Class = EcDH;
                    break;
                case AlgorithmNames.Hmac.toUpperCase():
                    Class = Hmac;
                    break;
                default:
                    throw new AlgorithmError(AlgorithmError.UNSUPPORTED_ALGORITHM, key.algorithm.name);
            }
            Class.exportKey(format, key).then(resolve, reject);
        });
    };
    SubtleCrypto.prototype.importKey = function (format, keyData, algorithm, extractable, keyUsages) {
        return new Promise(function (resolve, reject) {
            var alg = PrepareAlgorithm(algorithm);
            var Class = BaseCrypto;
            switch (alg.name.toUpperCase()) {
                case AlgorithmNames.RsaSSA.toUpperCase():
                    Class = RsaSSA;
                    break;
                case AlgorithmNames.RsaPSS.toUpperCase():
                    Class = RsaPSS;
                    break;
                case AlgorithmNames.RsaOAEP.toUpperCase():
                    Class = RsaOAEP;
                    break;
                case AlgorithmNames.AesECB.toUpperCase():
                    Class = AesECB;
                    break;
                case AlgorithmNames.AesCBC.toUpperCase():
                    Class = AesCBC;
                    break;
                case AlgorithmNames.AesCTR.toUpperCase():
                    Class = AesCTR;
                    break;
                case AlgorithmNames.AesGCM.toUpperCase():
                    Class = AesGCM;
                    break;
                case AlgorithmNames.AesKW.toUpperCase():
                    Class = AesKW;
                    break;
                case AlgorithmNames.EcDSA.toUpperCase():
                    Class = EcDSA;
                    break;
                case AlgorithmNames.EcDH.toUpperCase():
                    Class = EcDH;
                    break;
                case AlgorithmNames.Hmac.toUpperCase():
                    Class = Hmac;
                    break;
                case AlgorithmNames.Pbkdf2.toUpperCase():
                    Class = Pbkdf2;
                    break;
                default:
                    throw new AlgorithmError(AlgorithmError.UNSUPPORTED_ALGORITHM, alg.name);
            }
            Class.importKey(format, keyData, alg, extractable, keyUsages).then(resolve, reject);
        });
    };
    SubtleCrypto.prototype.wrapKey = function (format, key, wrappingKey, wrapAlgorithm) {
        return new Promise(function (resolve, reject) {
            var alg = PrepareAlgorithm(wrapAlgorithm);
            var Class = BaseCrypto;
            switch (alg.name.toUpperCase()) {
                case AlgorithmNames.RsaOAEP.toUpperCase():
                    Class = RsaOAEP;
                    break;
                case AlgorithmNames.AesECB.toUpperCase():
                    Class = AesECB;
                    break;
                case AlgorithmNames.AesCBC.toUpperCase():
                    Class = AesCBC;
                    break;
                case AlgorithmNames.AesCTR.toUpperCase():
                    Class = AesCTR;
                    break;
                case AlgorithmNames.AesGCM.toUpperCase():
                    Class = AesGCM;
                    break;
                case AlgorithmNames.AesKW.toUpperCase():
                    Class = AesKW;
                    break;
                default:
                    throw new AlgorithmError(AlgorithmError.UNSUPPORTED_ALGORITHM, alg.name);
            }
            Class.wrapKey(format, key, wrappingKey, alg).then(resolve, reject);
        });
    };
    SubtleCrypto.prototype.unwrapKey = function (format, wrappedKey, unwrappingKey, unwrapAlgorithm, unwrappedKeyAlgorithm, extractable, keyUsages) {
        return new Promise(function (resolve, reject) {
            var unwrapAlg = PrepareAlgorithm(unwrapAlgorithm);
            var unwrappedAlg = PrepareAlgorithm(unwrappedKeyAlgorithm);
            var buf = PrepareData(wrappedKey, "wrappedKey");
            var Class = BaseCrypto;
            switch (unwrapAlg.name.toUpperCase()) {
                case AlgorithmNames.RsaOAEP.toUpperCase():
                    Class = RsaOAEP;
                    break;
                case AlgorithmNames.AesECB.toUpperCase():
                    Class = AesECB;
                    break;
                case AlgorithmNames.AesCBC.toUpperCase():
                    Class = AesCBC;
                    break;
                case AlgorithmNames.AesCTR.toUpperCase():
                    Class = AesCTR;
                    break;
                case AlgorithmNames.AesGCM.toUpperCase():
                    Class = AesGCM;
                    break;
                case AlgorithmNames.AesKW.toUpperCase():
                    Class = AesKW;
                    break;
                default:
                    throw new AlgorithmError(AlgorithmError.UNSUPPORTED_ALGORITHM, unwrapAlg.name);
            }
            Class.unwrapKey(format, buf, unwrappingKey, unwrapAlg, unwrappedAlg, extractable, keyUsages).then(resolve, reject);
        });
    };
    return SubtleCrypto;
}());

var CryptoCertificateProto = (function (_super) {
    __extends(CryptoCertificateProto, _super);
    function CryptoCertificateProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CryptoCertificateProto_1 = CryptoCertificateProto;
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
    return CryptoCertificateProto;
    var CryptoCertificateProto_1;
}(CryptoItemProto));
var CryptoX509CertificateProto = (function (_super) {
    __extends(CryptoX509CertificateProto, _super);
    function CryptoX509CertificateProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CryptoX509CertificateProto_1 = CryptoX509CertificateProto;
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
    return CryptoX509CertificateProto;
    var CryptoX509CertificateProto_1;
}(CryptoCertificateProto));
var CryptoX509CertificateRequestProto = (function (_super) {
    __extends(CryptoX509CertificateRequestProto, _super);
    function CryptoX509CertificateRequestProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CryptoX509CertificateRequestProto_1 = CryptoX509CertificateRequestProto;
    CryptoX509CertificateRequestProto.INDEX = CryptoCertificateProto.INDEX;
    __decorate([
        ProtobufProperty({ id: CryptoX509CertificateRequestProto_1.INDEX++, required: true, type: "string" })
    ], CryptoX509CertificateRequestProto.prototype, "subjectName", void 0);
    CryptoX509CertificateRequestProto = CryptoX509CertificateRequestProto_1 = __decorate([
        ProtobufElement({})
    ], CryptoX509CertificateRequestProto);
    return CryptoX509CertificateRequestProto;
    var CryptoX509CertificateRequestProto_1;
}(CryptoCertificateProto));
var ChainItemProto = (function (_super) {
    __extends(ChainItemProto, _super);
    function ChainItemProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChainItemProto_1 = ChainItemProto;
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
    return ChainItemProto;
    var ChainItemProto_1;
}(BaseProto));
var CertificateStorageGetChainResultProto = (function (_super) {
    __extends(CertificateStorageGetChainResultProto, _super);
    function CertificateStorageGetChainResultProto() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.items = [];
        return _this;
    }
    CertificateStorageGetChainResultProto_1 = CertificateStorageGetChainResultProto;
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
    return CertificateStorageGetChainResultProto;
    var CertificateStorageGetChainResultProto_1;
}(BaseProto));
var CertificateStorageSetItemActionProto = (function (_super) {
    __extends(CertificateStorageSetItemActionProto, _super);
    function CertificateStorageSetItemActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CertificateStorageSetItemActionProto_1 = CertificateStorageSetItemActionProto;
    CertificateStorageSetItemActionProto.INDEX = CryptoActionProto.INDEX;
    CertificateStorageSetItemActionProto.ACTION = "crypto/certificateStorage/setItem";
    __decorate([
        ProtobufProperty({ id: CertificateStorageSetItemActionProto_1.INDEX++, required: true, parser: CryptoCertificateProto })
    ], CertificateStorageSetItemActionProto.prototype, "item", void 0);
    CertificateStorageSetItemActionProto = CertificateStorageSetItemActionProto_1 = __decorate([
        ProtobufElement({})
    ], CertificateStorageSetItemActionProto);
    return CertificateStorageSetItemActionProto;
    var CertificateStorageSetItemActionProto_1;
}(CryptoActionProto));
var CertificateStorageGetItemActionProto = (function (_super) {
    __extends(CertificateStorageGetItemActionProto, _super);
    function CertificateStorageGetItemActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CertificateStorageGetItemActionProto_1 = CertificateStorageGetItemActionProto;
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
    return CertificateStorageGetItemActionProto;
    var CertificateStorageGetItemActionProto_1;
}(CryptoActionProto));
var CertificateStorageKeysActionProto = (function (_super) {
    __extends(CertificateStorageKeysActionProto, _super);
    function CertificateStorageKeysActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CertificateStorageKeysActionProto.INDEX = CryptoActionProto.INDEX;
    CertificateStorageKeysActionProto.ACTION = "crypto/certificateStorage/keys";
    CertificateStorageKeysActionProto = __decorate([
        ProtobufElement({})
    ], CertificateStorageKeysActionProto);
    return CertificateStorageKeysActionProto;
}(CryptoActionProto));
var CertificateStorageRemoveItemActionProto = (function (_super) {
    __extends(CertificateStorageRemoveItemActionProto, _super);
    function CertificateStorageRemoveItemActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CertificateStorageRemoveItemActionProto_1 = CertificateStorageRemoveItemActionProto;
    CertificateStorageRemoveItemActionProto.INDEX = CryptoActionProto.INDEX;
    CertificateStorageRemoveItemActionProto.ACTION = "crypto/certificateStorage/removeItem";
    __decorate([
        ProtobufProperty({ id: CertificateStorageRemoveItemActionProto_1.INDEX++, required: true, type: "string" })
    ], CertificateStorageRemoveItemActionProto.prototype, "key", void 0);
    CertificateStorageRemoveItemActionProto = CertificateStorageRemoveItemActionProto_1 = __decorate([
        ProtobufElement({})
    ], CertificateStorageRemoveItemActionProto);
    return CertificateStorageRemoveItemActionProto;
    var CertificateStorageRemoveItemActionProto_1;
}(CryptoActionProto));
var CertificateStorageClearActionProto = (function (_super) {
    __extends(CertificateStorageClearActionProto, _super);
    function CertificateStorageClearActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CertificateStorageClearActionProto.INDEX = CryptoActionProto.INDEX;
    CertificateStorageClearActionProto.ACTION = "crypto/certificateStorage/clear";
    CertificateStorageClearActionProto = __decorate([
        ProtobufElement({})
    ], CertificateStorageClearActionProto);
    return CertificateStorageClearActionProto;
}(CryptoActionProto));
var CertificateStorageImportActionProto = (function (_super) {
    __extends(CertificateStorageImportActionProto, _super);
    function CertificateStorageImportActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CertificateStorageImportActionProto_1 = CertificateStorageImportActionProto;
    CertificateStorageImportActionProto.INDEX = CryptoActionProto.INDEX;
    CertificateStorageImportActionProto.ACTION = "crypto/certificateStorage/import";
    __decorate([
        ProtobufProperty({ id: CertificateStorageImportActionProto_1.INDEX++, required: true, type: "string" })
    ], CertificateStorageImportActionProto.prototype, "type", void 0);
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
    return CertificateStorageImportActionProto;
    var CertificateStorageImportActionProto_1;
}(CryptoActionProto));
var CertificateStorageExportActionProto = (function (_super) {
    __extends(CertificateStorageExportActionProto, _super);
    function CertificateStorageExportActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CertificateStorageExportActionProto_1 = CertificateStorageExportActionProto;
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
    return CertificateStorageExportActionProto;
    var CertificateStorageExportActionProto_1;
}(CryptoActionProto));
var CertificateStorageIndexOfActionProto = (function (_super) {
    __extends(CertificateStorageIndexOfActionProto, _super);
    function CertificateStorageIndexOfActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CertificateStorageIndexOfActionProto_1 = CertificateStorageIndexOfActionProto;
    CertificateStorageIndexOfActionProto.INDEX = CryptoActionProto.INDEX;
    CertificateStorageIndexOfActionProto.ACTION = "crypto/certificateStorage/indexOf";
    __decorate([
        ProtobufProperty({ id: CertificateStorageIndexOfActionProto_1.INDEX++, required: true, parser: CryptoCertificateProto })
    ], CertificateStorageIndexOfActionProto.prototype, "item", void 0);
    CertificateStorageIndexOfActionProto = CertificateStorageIndexOfActionProto_1 = __decorate([
        ProtobufElement({})
    ], CertificateStorageIndexOfActionProto);
    return CertificateStorageIndexOfActionProto;
    var CertificateStorageIndexOfActionProto_1;
}(CryptoActionProto));
var CertificateStorageGetChainActionProto = (function (_super) {
    __extends(CertificateStorageGetChainActionProto, _super);
    function CertificateStorageGetChainActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CertificateStorageGetChainActionProto.INDEX = CryptoActionProto.INDEX;
    CertificateStorageGetChainActionProto.ACTION = "crypto/certificateStorage/getChain";
    __decorate([
        ProtobufProperty({ id: CertificateStorageSetItemActionProto.INDEX++, required: true, parser: CryptoCertificateProto })
    ], CertificateStorageGetChainActionProto.prototype, "item", void 0);
    CertificateStorageGetChainActionProto = __decorate([
        ProtobufElement({})
    ], CertificateStorageGetChainActionProto);
    return CertificateStorageGetChainActionProto;
}(CryptoActionProto));
var CertificateStorageGetCRLActionProto = (function (_super) {
    __extends(CertificateStorageGetCRLActionProto, _super);
    function CertificateStorageGetCRLActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CertificateStorageGetCRLActionProto_1 = CertificateStorageGetCRLActionProto;
    CertificateStorageGetCRLActionProto.INDEX = CryptoActionProto.INDEX;
    CertificateStorageGetCRLActionProto.ACTION = "crypto/certificateStorage/getCRL";
    __decorate([
        ProtobufProperty({ id: CertificateStorageGetCRLActionProto_1.INDEX++, required: true, type: "string" })
    ], CertificateStorageGetCRLActionProto.prototype, "url", void 0);
    CertificateStorageGetCRLActionProto = CertificateStorageGetCRLActionProto_1 = __decorate([
        ProtobufElement({})
    ], CertificateStorageGetCRLActionProto);
    return CertificateStorageGetCRLActionProto;
    var CertificateStorageGetCRLActionProto_1;
}(CryptoActionProto));
var OCSPRequestOptionsProto = (function (_super) {
    __extends(OCSPRequestOptionsProto, _super);
    function OCSPRequestOptionsProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OCSPRequestOptionsProto_1 = OCSPRequestOptionsProto;
    OCSPRequestOptionsProto.INDEX = BaseProto.INDEX;
    __decorate([
        ProtobufProperty({ id: OCSPRequestOptionsProto_1.INDEX++, required: false, type: "string", defaultValue: "get" })
    ], OCSPRequestOptionsProto.prototype, "method", void 0);
    OCSPRequestOptionsProto = OCSPRequestOptionsProto_1 = __decorate([
        ProtobufElement({})
    ], OCSPRequestOptionsProto);
    return OCSPRequestOptionsProto;
    var OCSPRequestOptionsProto_1;
}(BaseProto));
var CertificateStorageGetOCSPActionProto = (function (_super) {
    __extends(CertificateStorageGetOCSPActionProto, _super);
    function CertificateStorageGetOCSPActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CertificateStorageGetOCSPActionProto_1 = CertificateStorageGetOCSPActionProto;
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
    return CertificateStorageGetOCSPActionProto;
    var CertificateStorageGetOCSPActionProto_1;
}(CryptoActionProto));

var SocketCertificateStorage = (function () {
    function SocketCertificateStorage(provider) {
        this.provider = provider;
    }
    SocketCertificateStorage.prototype.indexOf = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            var proto, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        proto = new CertificateStorageIndexOfActionProto();
                        proto.providerID = this.provider.id;
                        proto.item = item;
                        return [4, this.provider.client.send(proto)];
                    case 1:
                        result = _a.sent();
                        return [2, result ? Convert.ToUtf8String(result) : null];
                }
            });
        });
    };
    SocketCertificateStorage.prototype.exportCert = function (format, item) {
        return __awaiter(this, void 0, void 0, function () {
            var proto, result, header, res, b64, counter, raw;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        proto = new CertificateStorageExportActionProto();
                        proto.providerID = this.provider.id;
                        proto.format = "raw";
                        proto.item = item;
                        return [4, this.provider.client.send(proto)];
                    case 1:
                        result = _a.sent();
                        if (format === "raw") {
                            return [2, result];
                        }
                        else {
                            header = "";
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
                                    throw new Error("Cannot create PEM for unknown type of certificate item");
                            }
                            res = [];
                            b64 = Convert.ToBase64(result);
                            res.push("-----BEGIN " + header + "-----");
                            counter = 0;
                            raw = "";
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
                            res.push("-----END " + header + "-----");
                            return [2, res.join("\r\n")];
                        }
                        return [2];
                }
            });
        });
    };
    SocketCertificateStorage.prototype.importCert = function (type, data, algorithm, keyUsages) {
        return __awaiter(this, void 0, void 0, function () {
            var alg, proto, result, certItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        alg = PrepareAlgorithm(algorithm);
                        proto = new CertificateStorageImportActionProto();
                        proto.providerID = this.provider.id;
                        proto.type = type;
                        proto.data = data;
                        proto.algorithm.fromAlgorithm(alg);
                        proto.keyUsages = keyUsages;
                        return [4, this.provider.client.send(proto)];
                    case 1:
                        result = _a.sent();
                        return [4, CryptoCertificateProto.importProto(result)];
                    case 2:
                        certItem = _a.sent();
                        return [2, this.prepareCertItem(certItem)];
                }
            });
        });
    };
    SocketCertificateStorage.prototype.keys = function () {
        return __awaiter(this, void 0, void 0, function () {
            var proto, result, keys;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        proto = new CertificateStorageKeysActionProto();
                        proto.providerID = this.provider.id;
                        return [4, this.provider.client.send(proto)];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            keys = Convert.ToUtf8String(result).split(",");
                            return [2, keys];
                        }
                        return [2, []];
                }
            });
        });
    };
    SocketCertificateStorage.prototype.getItem = function (key, algorithm, keyUsages) {
        return __awaiter(this, void 0, void 0, function () {
            var proto, alg, result, certItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        proto = new CertificateStorageGetItemActionProto();
                        proto.providerID = this.provider.id;
                        proto.key = key;
                        if (algorithm) {
                            alg = PrepareAlgorithm(algorithm);
                            proto.algorithm.fromAlgorithm(alg);
                            proto.keyUsages = keyUsages;
                        }
                        return [4, this.provider.client.send(proto)];
                    case 1:
                        result = _a.sent();
                        if (!(result && result.byteLength)) return [3, 3];
                        return [4, CryptoCertificateProto.importProto(result)];
                    case 2:
                        certItem = _a.sent();
                        return [2, this.prepareCertItem(certItem)];
                    case 3: return [2, null];
                }
            });
        });
    };
    SocketCertificateStorage.prototype.setItem = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            var proto, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        proto = new CertificateStorageSetItemActionProto();
                        proto.providerID = this.provider.id;
                        proto.item = value;
                        return [4, this.provider.client.send(proto)];
                    case 1:
                        data = _a.sent();
                        return [2, Convert.ToUtf8String(data)];
                }
            });
        });
    };
    SocketCertificateStorage.prototype.removeItem = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var proto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        proto = new CertificateStorageRemoveItemActionProto();
                        proto.providerID = this.provider.id;
                        proto.key = key;
                        return [4, this.provider.client.send(proto)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    SocketCertificateStorage.prototype.clear = function () {
        return __awaiter(this, void 0, void 0, function () {
            var proto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        proto = new CertificateStorageClearActionProto();
                        proto.providerID = this.provider.id;
                        return [4, this.provider.client.send(proto)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    SocketCertificateStorage.prototype.getChain = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            var proto, data, resultProto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        proto = new CertificateStorageGetChainActionProto();
                        proto.providerID = this.provider.id;
                        proto.item = value;
                        return [4, this.provider.client.send(proto)];
                    case 1:
                        data = _a.sent();
                        return [4, CertificateStorageGetChainResultProto.importProto(data)];
                    case 2:
                        resultProto = _a.sent();
                        return [2, resultProto.items];
                }
            });
        });
    };
    SocketCertificateStorage.prototype.getCRL = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var proto, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        proto = new CertificateStorageGetCRLActionProto();
                        proto.providerID = this.provider.id;
                        proto.url = url;
                        return [4, this.provider.client.send(proto)];
                    case 1:
                        data = _a.sent();
                        return [2, data];
                }
            });
        });
    };
    SocketCertificateStorage.prototype.getOCSP = function (url, request, options) {
        return __awaiter(this, void 0, void 0, function () {
            var proto, key, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        proto = new CertificateStorageGetOCSPActionProto();
                        proto.providerID = this.provider.id;
                        proto.url = url;
                        proto.request = request;
                        if (options) {
                            for (key in options) {
                                proto.options[key] = options[key];
                            }
                        }
                        return [4, this.provider.client.send(proto)];
                    case 1:
                        data = _a.sent();
                        return [2, data];
                }
            });
        });
    };
    SocketCertificateStorage.prototype.prepareCertItem = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            var raw, result, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, item.exportProto()];
                    case 1:
                        raw = _b.sent();
                        _a = item.type;
                        switch (_a) {
                            case "x509": return [3, 2];
                            case "request": return [3, 4];
                        }
                        return [3, 6];
                    case 2: return [4, CryptoX509CertificateProto.importProto(raw)];
                    case 3:
                        result = _b.sent();
                        return [3, 7];
                    case 4: return [4, CryptoX509CertificateRequestProto.importProto(raw)];
                    case 5:
                        result = _b.sent();
                        return [3, 7];
                    case 6: throw new Error("Unsupported CertificateItem type '" + item.type + "'");
                    case 7:
                        result.provider = this.provider;
                        return [2, result];
                }
            });
        });
    };
    return SocketCertificateStorage;
}());

var KeyStorageSetItemActionProto = (function (_super) {
    __extends(KeyStorageSetItemActionProto, _super);
    function KeyStorageSetItemActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KeyStorageSetItemActionProto_1 = KeyStorageSetItemActionProto;
    KeyStorageSetItemActionProto.INDEX = CryptoActionProto.INDEX;
    KeyStorageSetItemActionProto.ACTION = "crypto/keyStorage/setItem";
    __decorate([
        ProtobufProperty({ id: KeyStorageSetItemActionProto_1.INDEX++, required: true, parser: CryptoKeyProto })
    ], KeyStorageSetItemActionProto.prototype, "item", void 0);
    KeyStorageSetItemActionProto = KeyStorageSetItemActionProto_1 = __decorate([
        ProtobufElement({})
    ], KeyStorageSetItemActionProto);
    return KeyStorageSetItemActionProto;
    var KeyStorageSetItemActionProto_1;
}(CryptoActionProto));
var KeyStorageGetItemActionProto = (function (_super) {
    __extends(KeyStorageGetItemActionProto, _super);
    function KeyStorageGetItemActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KeyStorageGetItemActionProto_1 = KeyStorageGetItemActionProto;
    KeyStorageGetItemActionProto.INDEX = CryptoActionProto.INDEX;
    KeyStorageGetItemActionProto.ACTION = "crypto/keyStorage/getItem";
    __decorate([
        ProtobufProperty({ id: KeyStorageGetItemActionProto_1.INDEX++, required: true, type: "string" })
    ], KeyStorageGetItemActionProto.prototype, "key", void 0);
    __decorate([
        ProtobufProperty({ id: KeyStorageGetItemActionProto_1.INDEX++, parser: AlgorithmProto })
    ], KeyStorageGetItemActionProto.prototype, "algorithm", void 0);
    __decorate([
        ProtobufProperty({ id: KeyStorageGetItemActionProto_1.INDEX++, repeated: true, type: "string" })
    ], KeyStorageGetItemActionProto.prototype, "keyUsages", void 0);
    KeyStorageGetItemActionProto = KeyStorageGetItemActionProto_1 = __decorate([
        ProtobufElement({})
    ], KeyStorageGetItemActionProto);
    return KeyStorageGetItemActionProto;
    var KeyStorageGetItemActionProto_1;
}(CryptoActionProto));
var KeyStorageKeysActionProto = (function (_super) {
    __extends(KeyStorageKeysActionProto, _super);
    function KeyStorageKeysActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KeyStorageKeysActionProto.INDEX = CryptoActionProto.INDEX;
    KeyStorageKeysActionProto.ACTION = "crypto/keyStorage/keys";
    KeyStorageKeysActionProto = __decorate([
        ProtobufElement({})
    ], KeyStorageKeysActionProto);
    return KeyStorageKeysActionProto;
}(CryptoActionProto));
var KeyStorageRemoveItemActionProto = (function (_super) {
    __extends(KeyStorageRemoveItemActionProto, _super);
    function KeyStorageRemoveItemActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KeyStorageRemoveItemActionProto_1 = KeyStorageRemoveItemActionProto;
    KeyStorageRemoveItemActionProto.INDEX = CryptoActionProto.INDEX;
    KeyStorageRemoveItemActionProto.ACTION = "crypto/keyStorage/removeItem";
    __decorate([
        ProtobufProperty({ id: KeyStorageRemoveItemActionProto_1.INDEX++, required: true, type: "string" })
    ], KeyStorageRemoveItemActionProto.prototype, "key", void 0);
    KeyStorageRemoveItemActionProto = KeyStorageRemoveItemActionProto_1 = __decorate([
        ProtobufElement({})
    ], KeyStorageRemoveItemActionProto);
    return KeyStorageRemoveItemActionProto;
    var KeyStorageRemoveItemActionProto_1;
}(CryptoActionProto));
var KeyStorageClearActionProto = (function (_super) {
    __extends(KeyStorageClearActionProto, _super);
    function KeyStorageClearActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KeyStorageClearActionProto.INDEX = CryptoActionProto.INDEX;
    KeyStorageClearActionProto.ACTION = "crypto/keyStorage/clear";
    KeyStorageClearActionProto = __decorate([
        ProtobufElement({})
    ], KeyStorageClearActionProto);
    return KeyStorageClearActionProto;
}(CryptoActionProto));
var KeyStorageIndexOfActionProto = (function (_super) {
    __extends(KeyStorageIndexOfActionProto, _super);
    function KeyStorageIndexOfActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KeyStorageIndexOfActionProto_1 = KeyStorageIndexOfActionProto;
    KeyStorageIndexOfActionProto.INDEX = CryptoActionProto.INDEX;
    KeyStorageIndexOfActionProto.ACTION = "crypto/keyStorage/indexOf";
    __decorate([
        ProtobufProperty({ id: KeyStorageIndexOfActionProto_1.INDEX++, required: true, parser: CryptoKeyProto })
    ], KeyStorageIndexOfActionProto.prototype, "item", void 0);
    KeyStorageIndexOfActionProto = KeyStorageIndexOfActionProto_1 = __decorate([
        ProtobufElement({})
    ], KeyStorageIndexOfActionProto);
    return KeyStorageIndexOfActionProto;
    var KeyStorageIndexOfActionProto_1;
}(CryptoActionProto));

var SocketKeyStorage = (function () {
    function SocketKeyStorage(service) {
        this.service = service;
    }
    SocketKeyStorage.prototype.keys = function () {
        return __awaiter(this, void 0, void 0, function () {
            var proto, result, keys;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        proto = new KeyStorageKeysActionProto();
                        proto.providerID = this.service.id;
                        return [4, this.service.client.send(proto)];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            keys = Convert.ToUtf8String(result).split(",");
                            return [2, keys];
                        }
                        return [2, []];
                }
            });
        });
    };
    SocketKeyStorage.prototype.indexOf = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            var proto, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        proto = new KeyStorageIndexOfActionProto();
                        proto.providerID = this.service.id;
                        proto.item = item;
                        return [4, this.service.client.send(proto)];
                    case 1:
                        result = _a.sent();
                        return [2, result ? Convert.ToUtf8String(result) : null];
                }
            });
        });
    };
    SocketKeyStorage.prototype.getItem = function (key, algorithm, usages) {
        return __awaiter(this, void 0, void 0, function () {
            var proto, preparedAlgorithm, result, socketKey, keyProto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        proto = new KeyStorageGetItemActionProto();
                        proto.providerID = this.service.id;
                        proto.key = key;
                        if (algorithm) {
                            preparedAlgorithm = PrepareAlgorithm(algorithm);
                            proto.algorithm.fromAlgorithm(preparedAlgorithm);
                            proto.keyUsages = usages;
                        }
                        return [4, this.service.client.send(proto)];
                    case 1:
                        result = _a.sent();
                        socketKey = null;
                        if (!(result && result.byteLength)) return [3, 3];
                        return [4, CryptoKeyProto.importProto(result)];
                    case 2:
                        keyProto = _a.sent();
                        socketKey = keyProto;
                        _a.label = 3;
                    case 3: return [2, socketKey];
                }
            });
        });
    };
    SocketKeyStorage.prototype.setItem = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            var proto, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        proto = new KeyStorageSetItemActionProto();
                        proto.providerID = this.service.id;
                        proto.item = value;
                        return [4, this.service.client.send(proto)];
                    case 1:
                        data = _a.sent();
                        return [2, Convert.ToUtf8String(data)];
                }
            });
        });
    };
    SocketKeyStorage.prototype.removeItem = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var proto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        proto = new KeyStorageRemoveItemActionProto();
                        proto.providerID = this.service.id;
                        proto.key = key;
                        return [4, this.service.client.send(proto)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    SocketKeyStorage.prototype.clear = function () {
        return __awaiter(this, void 0, void 0, function () {
            var proto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        proto = new KeyStorageClearActionProto();
                        proto.providerID = this.service.id;
                        return [4, this.service.client.send(proto)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    return SocketKeyStorage;
}());

var DigestActionProto = (function (_super) {
    __extends(DigestActionProto, _super);
    function DigestActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DigestActionProto_1 = DigestActionProto;
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
    return DigestActionProto;
    var DigestActionProto_1;
}(CryptoActionProto));
var GenerateKeyActionProto = (function (_super) {
    __extends(GenerateKeyActionProto, _super);
    function GenerateKeyActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GenerateKeyActionProto_1 = GenerateKeyActionProto;
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
    return GenerateKeyActionProto;
    var GenerateKeyActionProto_1;
}(CryptoActionProto));
var SignActionProto = (function (_super) {
    __extends(SignActionProto, _super);
    function SignActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SignActionProto_1 = SignActionProto;
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
    return SignActionProto;
    var SignActionProto_1;
}(CryptoActionProto));
var VerifyActionProto = (function (_super) {
    __extends(VerifyActionProto, _super);
    function VerifyActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VerifyActionProto_1 = VerifyActionProto;
    VerifyActionProto.INDEX = SignActionProto.INDEX;
    VerifyActionProto.ACTION = "crypto/subtle/verify";
    __decorate([
        ProtobufProperty({ id: VerifyActionProto_1.INDEX++, required: true, converter: ArrayBufferConverter })
    ], VerifyActionProto.prototype, "signature", void 0);
    VerifyActionProto = VerifyActionProto_1 = __decorate([
        ProtobufElement({})
    ], VerifyActionProto);
    return VerifyActionProto;
    var VerifyActionProto_1;
}(SignActionProto));
var EncryptActionProto = (function (_super) {
    __extends(EncryptActionProto, _super);
    function EncryptActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EncryptActionProto.INDEX = SignActionProto.INDEX;
    EncryptActionProto.ACTION = "crypto/subtle/encrypt";
    EncryptActionProto = __decorate([
        ProtobufElement({})
    ], EncryptActionProto);
    return EncryptActionProto;
}(SignActionProto));
var DecryptActionProto = (function (_super) {
    __extends(DecryptActionProto, _super);
    function DecryptActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DecryptActionProto.INDEX = SignActionProto.INDEX;
    DecryptActionProto.ACTION = "crypto/subtle/decrypt";
    DecryptActionProto = __decorate([
        ProtobufElement({})
    ], DecryptActionProto);
    return DecryptActionProto;
}(SignActionProto));
var DeriveBitsActionProto = (function (_super) {
    __extends(DeriveBitsActionProto, _super);
    function DeriveBitsActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeriveBitsActionProto_1 = DeriveBitsActionProto;
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
    return DeriveBitsActionProto;
    var DeriveBitsActionProto_1;
}(CryptoActionProto));
var DeriveKeyActionProto = (function (_super) {
    __extends(DeriveKeyActionProto, _super);
    function DeriveKeyActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeriveKeyActionProto_1 = DeriveKeyActionProto;
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
    return DeriveKeyActionProto;
    var DeriveKeyActionProto_1;
}(CryptoActionProto));
var UnwrapKeyActionProto = (function (_super) {
    __extends(UnwrapKeyActionProto, _super);
    function UnwrapKeyActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UnwrapKeyActionProto_1 = UnwrapKeyActionProto;
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
    return UnwrapKeyActionProto;
    var UnwrapKeyActionProto_1;
}(CryptoActionProto));
var WrapKeyActionProto = (function (_super) {
    __extends(WrapKeyActionProto, _super);
    function WrapKeyActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WrapKeyActionProto_1 = WrapKeyActionProto;
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
    return WrapKeyActionProto;
    var WrapKeyActionProto_1;
}(CryptoActionProto));
var ExportKeyActionProto = (function (_super) {
    __extends(ExportKeyActionProto, _super);
    function ExportKeyActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExportKeyActionProto_1 = ExportKeyActionProto;
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
    return ExportKeyActionProto;
    var ExportKeyActionProto_1;
}(CryptoActionProto));
var ImportKeyActionProto = (function (_super) {
    __extends(ImportKeyActionProto, _super);
    function ImportKeyActionProto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ImportKeyActionProto_1 = ImportKeyActionProto;
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
    return ImportKeyActionProto;
    var ImportKeyActionProto_1;
}(CryptoActionProto));

var SocketSubtleCrypto = (function (_super) {
    __extends(SocketSubtleCrypto, _super);
    function SocketSubtleCrypto(crypto) {
        var _this = _super.call(this) || this;
        _this.service = crypto;
        return _this;
    }
    SocketSubtleCrypto.prototype.encrypt = function (algorithm, key, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.encryptData(algorithm, key, data, "encrypt")];
            });
        });
    };
    SocketSubtleCrypto.prototype.decrypt = function (algorithm, key, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.encryptData(algorithm, key, data, "decrypt")];
            });
        });
    };
    SocketSubtleCrypto.prototype.deriveBits = function (algorithm, baseKey, length) {
        return __awaiter(this, void 0, void 0, function () {
            var alg, algProto, action, _a, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        alg = PrepareAlgorithm(algorithm);
                        algProto = new AlgorithmProto();
                        algProto.fromAlgorithm(alg);
                        return [4, _super.prototype.deriveBits.call(this, algorithm, baseKey, length)];
                    case 1:
                        _b.sent();
                        action = new DeriveBitsActionProto();
                        action.providerID = this.service.id;
                        action.algorithm = algProto;
                        _a = action.algorithm;
                        return [4, alg.public.exportProto()];
                    case 2:
                        _a.public = _b.sent();
                        action.key = baseKey;
                        action.length = length;
                        return [4, this.service.client.send(action)];
                    case 3:
                        result = _b.sent();
                        return [2, result];
                }
            });
        });
    };
    SocketSubtleCrypto.prototype.deriveKey = function (algorithm, baseKey, derivedKeyType, extractable, keyUsages) {
        return __awaiter(this, void 0, void 0, function () {
            var alg, algKeyType, action, _a, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, _super.prototype.deriveKey.call(this, algorithm, baseKey, derivedKeyType, extractable, keyUsages)];
                    case 1:
                        _b.sent();
                        alg = PrepareAlgorithm(algorithm);
                        algKeyType = PrepareAlgorithm(derivedKeyType);
                        action = new DeriveKeyActionProto();
                        action.providerID = this.service.id;
                        action.algorithm.fromAlgorithm(alg);
                        _a = action.algorithm;
                        return [4, alg.public.exportProto()];
                    case 2:
                        _a.public = _b.sent();
                        action.derivedKeyType.fromAlgorithm(algKeyType);
                        action.key = baseKey;
                        action.extractable = extractable;
                        action.usage = keyUsages;
                        return [4, this.service.client.send(action)];
                    case 3:
                        result = _b.sent();
                        return [4, CryptoKeyProto.importProto(result)];
                    case 4: return [2, _b.sent()];
                }
            });
        });
    };
    SocketSubtleCrypto.prototype.digest = function (algorithm, data) {
        return __awaiter(this, void 0, void 0, function () {
            var res, alg, err_1, buffer, algProto, action, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        alg = PrepareAlgorithm(algorithm);
                        if (!self.crypto) return [3, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, self.crypto.subtle.digest(alg, data)];
                    case 2:
                        res = _a.sent();
                        return [3, 4];
                    case 3:
                        err_1 = _a.sent();
                        console.warn("Cannot do native digest for algorithm '" + alg.name + "'");
                        return [3, 4];
                    case 4:
                        if (res) {
                            return [2, res];
                        }
                        buffer = PrepareData(data, "data");
                        return [4, _super.prototype.digest.call(this, alg, buffer)];
                    case 5:
                        _a.sent();
                        algProto = new AlgorithmProto();
                        algProto.fromAlgorithm(alg);
                        action = new DigestActionProto();
                        action.algorithm = algProto;
                        action.data = buffer.buffer;
                        action.providerID = this.service.id;
                        return [4, this.service.client.send(action)];
                    case 6:
                        result = _a.sent();
                        return [2, result];
                }
            });
        });
    };
    SocketSubtleCrypto.prototype.generateKey = function (algorithm, extractable, keyUsages) {
        return __awaiter(this, void 0, void 0, function () {
            var alg, algProto, action, result, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        alg = PrepareAlgorithm(algorithm);
                        return [4, _super.prototype.generateKey.call(this, alg, extractable, keyUsages)];
                    case 1:
                        _a.sent();
                        algProto = new AlgorithmProto();
                        algProto.fromAlgorithm(alg);
                        action = new GenerateKeyActionProto();
                        action.providerID = this.service.id;
                        action.algorithm = algProto;
                        action.extractable = extractable;
                        action.usage = keyUsages;
                        console.log(action);
                        return [4, this.service.client.send(action)];
                    case 2:
                        result = _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 7]);
                        return [4, CryptoKeyPairProto.importProto(result)];
                    case 4: return [2, _a.sent()];
                    case 5:
                        e_1 = _a.sent();
                        return [4, CryptoKeyProto.importProto(result)];
                    case 6: return [2, _a.sent()];
                    case 7: return [2];
                }
            });
        });
    };
    SocketSubtleCrypto.prototype.exportKey = function (format, key) {
        return __awaiter(this, void 0, void 0, function () {
            var action, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, _super.prototype.exportKey.call(this, format, key)];
                    case 1:
                        _a.sent();
                        action = new ExportKeyActionProto();
                        action.providerID = this.service.id;
                        action.format = format;
                        action.key = key;
                        return [4, this.service.client.send(action)];
                    case 2:
                        result = _a.sent();
                        if (format === "jwk") {
                            return [2, JSON.parse(Convert.ToBinary(result))];
                        }
                        else {
                            return [2, result];
                        }
                        return [2];
                }
            });
        });
    };
    SocketSubtleCrypto.prototype.importKey = function (format, keyData, algorithm, extractable, keyUsages) {
        return __awaiter(this, void 0, void 0, function () {
            var alg, preparedKeyData, action, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, _super.prototype.importKey.call(this, format, keyData, algorithm, extractable, keyUsages)];
                    case 1:
                        _a.sent();
                        alg = PrepareAlgorithm(algorithm);
                        if (format === "jwk") {
                            preparedKeyData = Convert.FromUtf8String(JSON.stringify(keyData));
                        }
                        else {
                            preparedKeyData = PrepareData(keyData, "keyData").buffer;
                        }
                        action = new ImportKeyActionProto();
                        action.providerID = this.service.id;
                        action.algorithm.fromAlgorithm(alg);
                        action.keyData = preparedKeyData;
                        action.format = format;
                        action.extractable = extractable;
                        action.keyUsages = keyUsages;
                        return [4, this.service.client.send(action)];
                    case 2:
                        result = _a.sent();
                        return [4, CryptoKeyProto.importProto(result)];
                    case 3: return [2, _a.sent()];
                }
            });
        });
    };
    SocketSubtleCrypto.prototype.sign = function (algorithm, key, data) {
        return __awaiter(this, void 0, void 0, function () {
            var alg, algProto, buffer, action, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        alg = PrepareAlgorithm(algorithm);
                        algProto = new AlgorithmProto();
                        algProto.fromAlgorithm(alg);
                        buffer = PrepareData(data, "data");
                        return [4, _super.prototype.sign.call(this, algorithm, key, buffer)];
                    case 1:
                        _a.sent();
                        action = new SignActionProto();
                        action.providerID = this.service.id;
                        action.algorithm = algProto;
                        action.key = key;
                        action.data = buffer.buffer;
                        return [4, this.service.client.send(action)];
                    case 2:
                        result = _a.sent();
                        return [2, result];
                }
            });
        });
    };
    SocketSubtleCrypto.prototype.verify = function (algorithm, key, signature, data) {
        return __awaiter(this, void 0, void 0, function () {
            var alg, algProto, buffer, signatureBytes, action, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, _super.prototype.verify.call(this, algorithm, key, signature, signature)];
                    case 1:
                        _a.sent();
                        alg = PrepareAlgorithm(algorithm);
                        algProto = new AlgorithmProto();
                        algProto.fromAlgorithm(alg);
                        buffer = PrepareData(data, "data");
                        signatureBytes = PrepareData(signature, "signature");
                        action = new VerifyActionProto();
                        action.providerID = this.service.id;
                        action.algorithm = algProto;
                        action.key = key;
                        action.data = buffer.buffer;
                        action.signature = signatureBytes.buffer;
                        return [4, this.service.client.send(action)];
                    case 2:
                        result = _a.sent();
                        return [2, !!(new Uint8Array(result)[0])];
                }
            });
        });
    };
    SocketSubtleCrypto.prototype.wrapKey = function (format, key, wrappingKey, wrapAlgorithm) {
        return __awaiter(this, void 0, void 0, function () {
            var algWrap, action, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, _super.prototype.wrapKey.call(this, format, key, wrappingKey, wrapAlgorithm)];
                    case 1:
                        _a.sent();
                        algWrap = PrepareAlgorithm(wrapAlgorithm);
                        action = new WrapKeyActionProto();
                        action.providerID = this.service.id;
                        action.wrapAlgorithm.fromAlgorithm(algWrap);
                        action.key = key;
                        action.wrappingKey = wrappingKey;
                        action.format = format;
                        return [4, this.service.client.send(action)];
                    case 2:
                        result = _a.sent();
                        return [2, result];
                }
            });
        });
    };
    SocketSubtleCrypto.prototype.unwrapKey = function (format, wrappedKey, unwrappingKey, unwrapAlgorithm, unwrappedKeyAlgorithm, extractable, keyUsages) {
        return __awaiter(this, void 0, void 0, function () {
            var algUnwrap, algUnwrappedKey, wrappedKeyBytes, action, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, _super.prototype.unwrapKey.call(this, format, wrappedKey, unwrappingKey, unwrapAlgorithm, unwrappedKeyAlgorithm, extractable, keyUsages)];
                    case 1:
                        _a.sent();
                        algUnwrap = PrepareAlgorithm(unwrapAlgorithm);
                        algUnwrappedKey = PrepareAlgorithm(unwrappedKeyAlgorithm);
                        wrappedKeyBytes = PrepareData(wrappedKey, "wrappedKey");
                        action = new UnwrapKeyActionProto();
                        action.providerID = this.service.id;
                        action.unwrapAlgorithm.fromAlgorithm(algUnwrap);
                        action.unwrappedKeyAlgorithm.fromAlgorithm(algUnwrappedKey);
                        action.unwrappingKey = unwrappingKey;
                        action.unwrappingKey = unwrappingKey;
                        action.wrappedKey = wrappedKeyBytes.buffer;
                        action.format = format;
                        action.extractable = extractable;
                        action.keyUsage = keyUsages;
                        return [4, this.service.client.send(action)];
                    case 2:
                        result = _a.sent();
                        return [4, CryptoKeyProto.importProto(result)];
                    case 3: return [2, _a.sent()];
                }
            });
        });
    };
    SocketSubtleCrypto.prototype.encryptData = function (algorithm, key, data, type) {
        return __awaiter(this, void 0, void 0, function () {
            var alg, algProto, buffer, encrypt, ActionClass, action, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        alg = PrepareAlgorithm(algorithm);
                        algProto = new AlgorithmProto();
                        algProto.fromAlgorithm(alg);
                        buffer = PrepareData(data, "data");
                        if (type === "encrypt") {
                            encrypt = _super.prototype.encrypt;
                            ActionClass = EncryptActionProto;
                        }
                        else {
                            encrypt = _super.prototype.decrypt;
                            ActionClass = DecryptActionProto;
                        }
                        return [4, encrypt(algorithm, key, buffer)];
                    case 1:
                        _a.sent();
                        action = new ActionClass();
                        action.providerID = this.service.id;
                        action.algorithm = algProto;
                        action.key = key;
                        action.data = buffer.buffer;
                        return [4, this.service.client.send(action)];
                    case 2:
                        result = _a.sent();
                        return [2, result];
                }
            });
        });
    };
    return SocketSubtleCrypto;
}(SubtleCrypto));

var SocketCrypto = (function () {
    function SocketCrypto(client, id) {
        this.client = client;
        this.id = id;
        this.subtle = new SocketSubtleCrypto(this);
        this.keyStorage = new SocketKeyStorage(this);
        this.certStorage = new SocketCertificateStorage(this);
    }
    SocketCrypto.prototype.getRandomValues = function (data) {
        if (!self.crypto) {
            throw new Error("Cannot get native crypto object. Function getRandomValues is not implemented.");
        }
        return self.crypto.getRandomValues(data);
    };
    SocketCrypto.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            var action;
            return __generator(this, function (_a) {
                action = new LoginActionProto();
                action.providerID = this.id;
                return [2, this.client.send(action)];
            });
        });
    };
    SocketCrypto.prototype.reset = function () {
        return __awaiter(this, void 0, void 0, function () {
            var action;
            return __generator(this, function (_a) {
                action = new ResetActionProto();
                action.providerID = this.id;
                return [2, this.client.send(action)];
            });
        });
    };
    SocketCrypto.prototype.isLoggedIn = function () {
        return __awaiter(this, void 0, void 0, function () {
            var action, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        action = new IsLoggedInActionProto();
                        action.providerID = this.id;
                        return [4, this.client.send(action)];
                    case 1:
                        res = _a.sent();
                        return [2, !!(new Uint8Array(res)[0])];
                }
            });
        });
    };
    return SocketCrypto;
}());

var SocketProvider = (function (_super) {
    __extends(SocketProvider, _super);
    function SocketProvider() {
        var _this = _super.call(this) || this;
        _this.client = new Client();
        return _this;
    }
    Object.defineProperty(SocketProvider.prototype, "state", {
        get: function () {
            return this.client.state;
        },
        enumerable: true,
        configurable: true
    });
    SocketProvider.prototype.connect = function (address) {
        var _this = this;
        this.client.removeAllListeners();
        this.client.connect(address)
            .on("error", function (e) {
            _this.emit("error", e.error);
        })
            .on("event", function (proto) {
            console.log("Client:Event", proto.action);
            (function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, tokenProto, _b, _c, authProto, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            _a = proto.action;
                            switch (_a) {
                                case ProviderTokenEventProto.ACTION: return [3, 1];
                                case ProviderAuthorizedEventProto.ACTION: return [3, 4];
                            }
                            return [3, 7];
                        case 1:
                            _c = (_b = ProviderTokenEventProto).importProto;
                            return [4, proto.exportProto()];
                        case 2: return [4, _c.apply(_b, [_f.sent()])];
                        case 3:
                            tokenProto = _f.sent();
                            this.emit("token", tokenProto);
                            _f.label = 4;
                        case 4:
                            _e = (_d = ProviderAuthorizedEventProto).importProto;
                            return [4, proto.exportProto()];
                        case 5: return [4, _e.apply(_d, [_f.sent()])];
                        case 6:
                            authProto = _f.sent();
                            this.emit("auth", authProto);
                            _f.label = 7;
                        case 7: return [2];
                    }
                });
            }); })();
        })
            .on("listening", function (e) {
            console.info("Client:Listening", e.address);
            _this.emit("listening", address);
        })
            .on("close", function (e) {
            console.info("Client:Closed: " + e.description + " (code: " + e.reasonCode + ")");
            _this.emit("close", e.remoteAddress);
        });
        return this;
    };
    SocketProvider.prototype.close = function () {
        this.client.close();
    };
    SocketProvider.prototype.on = function (event, listener) {
        return _super.prototype.on.call(this, event, listener);
    };
    SocketProvider.prototype.once = function (event, listener) {
        return _super.prototype.once.call(this, event, listener);
    };
    SocketProvider.prototype.info = function () {
        return __awaiter(this, void 0, void 0, function () {
            var proto, result, infoProto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        proto = new ProviderInfoActionProto();
                        return [4, this.client.send(proto)];
                    case 1:
                        result = _a.sent();
                        return [4, ProviderInfoProto.importProto(result)];
                    case 2:
                        infoProto = _a.sent();
                        return [2, infoProto];
                }
            });
        });
    };
    SocketProvider.prototype.challenge = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.challenge()];
            });
        });
    };
    SocketProvider.prototype.isLoggedIn = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.isLoggedIn()];
            });
        });
    };
    SocketProvider.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.login()];
            });
        });
    };
    SocketProvider.prototype.getCrypto = function (cryptoID) {
        return __awaiter(this, void 0, void 0, function () {
            var actionProto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        actionProto = new ProviderGetCryptoActionProto();
                        actionProto.cryptoID = cryptoID;
                        return [4, this.client.send(actionProto)];
                    case 1:
                        _a.sent();
                        return [2, new SocketCrypto(this.client, cryptoID)];
                }
            });
        });
    };
    return SocketProvider;
}(EventEmitter));

exports.SocketProvider = SocketProvider;

Object.defineProperty(exports, '__esModule', { value: true });

})));
