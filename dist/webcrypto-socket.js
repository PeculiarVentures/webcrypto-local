var WebcryptoSocket = (function (exports, protobufjs) {
  'use strict';

  var _isObject = function (it) {
    return typeof it === 'object' ? it !== null : typeof it === 'function';
  };

  var toString = {}.toString;

  var _cof = function (it) {
    return toString.call(it).slice(8, -1);
  };

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var _core = createCommonjsModule(function (module) {
  var core = module.exports = { version: '2.6.5' };
  if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
  });
  var _core_1 = _core.version;

  var _global = createCommonjsModule(function (module) {
  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global = module.exports = typeof window != 'undefined' && window.Math == Math
    ? window : typeof self != 'undefined' && self.Math == Math ? self
    // eslint-disable-next-line no-new-func
    : Function('return this')();
  if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
  });

  var _library = false;

  var _shared = createCommonjsModule(function (module) {
  var SHARED = '__core-js_shared__';
  var store = _global[SHARED] || (_global[SHARED] = {});

  (module.exports = function (key, value) {
    return store[key] || (store[key] = value !== undefined ? value : {});
  })('versions', []).push({
    version: _core.version,
    mode: _library ? 'pure' : 'global',
    copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
  });
  });

  var id = 0;
  var px = Math.random();
  var _uid = function (key) {
    return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
  };

  var _wks = createCommonjsModule(function (module) {
  var store = _shared('wks');

  var Symbol = _global.Symbol;
  var USE_SYMBOL = typeof Symbol == 'function';

  var $exports = module.exports = function (name) {
    return store[name] || (store[name] =
      USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
  };

  $exports.store = store;
  });

  // 7.2.8 IsRegExp(argument)


  var MATCH = _wks('match');
  var _isRegexp = function (it) {
    var isRegExp;
    return _isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : _cof(it) == 'RegExp');
  };

  var _anObject = function (it) {
    if (!_isObject(it)) throw TypeError(it + ' is not an object!');
    return it;
  };

  var _aFunction = function (it) {
    if (typeof it != 'function') throw TypeError(it + ' is not a function!');
    return it;
  };

  // 7.3.20 SpeciesConstructor(O, defaultConstructor)


  var SPECIES = _wks('species');
  var _speciesConstructor = function (O, D) {
    var C = _anObject(O).constructor;
    var S;
    return C === undefined || (S = _anObject(C)[SPECIES]) == undefined ? D : _aFunction(S);
  };

  // 7.1.4 ToInteger
  var ceil = Math.ceil;
  var floor = Math.floor;
  var _toInteger = function (it) {
    return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
  };

  // 7.2.1 RequireObjectCoercible(argument)
  var _defined = function (it) {
    if (it == undefined) throw TypeError("Can't call method on  " + it);
    return it;
  };

  // true  -> String#at
  // false -> String#codePointAt
  var _stringAt = function (TO_STRING) {
    return function (that, pos) {
      var s = String(_defined(that));
      var i = _toInteger(pos);
      var l = s.length;
      var a, b;
      if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
      a = s.charCodeAt(i);
      return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
        ? TO_STRING ? s.charAt(i) : a
        : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
    };
  };

  var at = _stringAt(true);

   // `AdvanceStringIndex` abstract operation
  // https://tc39.github.io/ecma262/#sec-advancestringindex
  var _advanceStringIndex = function (S, index, unicode) {
    return index + (unicode ? at(S, index).length : 1);
  };

  // 7.1.15 ToLength

  var min = Math.min;
  var _toLength = function (it) {
    return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
  };

  // getting tag from 19.1.3.6 Object.prototype.toString()

  var TAG = _wks('toStringTag');
  // ES3 wrong here
  var ARG = _cof(function () { return arguments; }()) == 'Arguments';

  // fallback for IE11 Script Access Denied error
  var tryGet = function (it, key) {
    try {
      return it[key];
    } catch (e) { /* empty */ }
  };

  var _classof = function (it) {
    var O, T, B;
    return it === undefined ? 'Undefined' : it === null ? 'Null'
      // @@toStringTag case
      : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
      // builtinTag case
      : ARG ? _cof(O)
      // ES3 arguments fallback
      : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
  };

  var builtinExec = RegExp.prototype.exec;

   // `RegExpExec` abstract operation
  // https://tc39.github.io/ecma262/#sec-regexpexec
  var _regexpExecAbstract = function (R, S) {
    var exec = R.exec;
    if (typeof exec === 'function') {
      var result = exec.call(R, S);
      if (typeof result !== 'object') {
        throw new TypeError('RegExp exec method returned something other than an Object or null');
      }
      return result;
    }
    if (_classof(R) !== 'RegExp') {
      throw new TypeError('RegExp#exec called on incompatible receiver');
    }
    return builtinExec.call(R, S);
  };

  // 21.2.5.3 get RegExp.prototype.flags

  var _flags = function () {
    var that = _anObject(this);
    var result = '';
    if (that.global) result += 'g';
    if (that.ignoreCase) result += 'i';
    if (that.multiline) result += 'm';
    if (that.unicode) result += 'u';
    if (that.sticky) result += 'y';
    return result;
  };

  var nativeExec = RegExp.prototype.exec;
  // This always refers to the native implementation, because the
  // String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
  // which loads this file before patching the method.
  var nativeReplace = String.prototype.replace;

  var patchedExec = nativeExec;

  var LAST_INDEX = 'lastIndex';

  var UPDATES_LAST_INDEX_WRONG = (function () {
    var re1 = /a/,
        re2 = /b*/g;
    nativeExec.call(re1, 'a');
    nativeExec.call(re2, 'a');
    return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
  })();

  // nonparticipating capturing group, copied from es5-shim's String#split patch.
  var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

  var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

  if (PATCH) {
    patchedExec = function exec(str) {
      var re = this;
      var lastIndex, reCopy, match, i;

      if (NPCG_INCLUDED) {
        reCopy = new RegExp('^' + re.source + '$(?!\\s)', _flags.call(re));
      }
      if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

      match = nativeExec.call(re, str);

      if (UPDATES_LAST_INDEX_WRONG && match) {
        re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
      }
      if (NPCG_INCLUDED && match && match.length > 1) {
        // Fix browsers whose `exec` methods don't consistently return `undefined`
        // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
        // eslint-disable-next-line no-loop-func
        nativeReplace.call(match[0], reCopy, function () {
          for (i = 1; i < arguments.length - 2; i++) {
            if (arguments[i] === undefined) match[i] = undefined;
          }
        });
      }

      return match;
    };
  }

  var _regexpExec = patchedExec;

  var _fails = function (exec) {
    try {
      return !!exec();
    } catch (e) {
      return true;
    }
  };

  // Thank's IE8 for his funny defineProperty
  var _descriptors = !_fails(function () {
    return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
  });

  var document$1 = _global.document;
  // typeof document.createElement is 'object' in old IE
  var is = _isObject(document$1) && _isObject(document$1.createElement);
  var _domCreate = function (it) {
    return is ? document$1.createElement(it) : {};
  };

  var _ie8DomDefine = !_descriptors && !_fails(function () {
    return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
  });

  // 7.1.1 ToPrimitive(input [, PreferredType])

  // instead of the ES6 spec version, we didn't implement @@toPrimitive case
  // and the second argument - flag - preferred type is a string
  var _toPrimitive = function (it, S) {
    if (!_isObject(it)) return it;
    var fn, val;
    if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
    if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
    if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
    throw TypeError("Can't convert object to primitive value");
  };

  var dP = Object.defineProperty;

  var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
    _anObject(O);
    P = _toPrimitive(P, true);
    _anObject(Attributes);
    if (_ie8DomDefine) try {
      return dP(O, P, Attributes);
    } catch (e) { /* empty */ }
    if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };

  var _objectDp = {
  	f: f
  };

  var _propertyDesc = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var _hide = _descriptors ? function (object, key, value) {
    return _objectDp.f(object, key, _propertyDesc(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

  var hasOwnProperty = {}.hasOwnProperty;
  var _has = function (it, key) {
    return hasOwnProperty.call(it, key);
  };

  var _functionToString = _shared('native-function-to-string', Function.toString);

  var _redefine = createCommonjsModule(function (module) {
  var SRC = _uid('src');

  var TO_STRING = 'toString';
  var TPL = ('' + _functionToString).split(TO_STRING);

  _core.inspectSource = function (it) {
    return _functionToString.call(it);
  };

  (module.exports = function (O, key, val, safe) {
    var isFunction = typeof val == 'function';
    if (isFunction) _has(val, 'name') || _hide(val, 'name', key);
    if (O[key] === val) return;
    if (isFunction) _has(val, SRC) || _hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
    if (O === _global) {
      O[key] = val;
    } else if (!safe) {
      delete O[key];
      _hide(O, key, val);
    } else if (O[key]) {
      O[key] = val;
    } else {
      _hide(O, key, val);
    }
  // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
  })(Function.prototype, TO_STRING, function toString() {
    return typeof this == 'function' && this[SRC] || _functionToString.call(this);
  });
  });

  // optional / simple context binding

  var _ctx = function (fn, that, length) {
    _aFunction(fn);
    if (that === undefined) return fn;
    switch (length) {
      case 1: return function (a) {
        return fn.call(that, a);
      };
      case 2: return function (a, b) {
        return fn.call(that, a, b);
      };
      case 3: return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
    }
    return function (/* ...args */) {
      return fn.apply(that, arguments);
    };
  };

  var PROTOTYPE = 'prototype';

  var $export = function (type, name, source) {
    var IS_FORCED = type & $export.F;
    var IS_GLOBAL = type & $export.G;
    var IS_STATIC = type & $export.S;
    var IS_PROTO = type & $export.P;
    var IS_BIND = type & $export.B;
    var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] || (_global[name] = {}) : (_global[name] || {})[PROTOTYPE];
    var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
    var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
    var key, own, out, exp;
    if (IS_GLOBAL) source = name;
    for (key in source) {
      // contains in native
      own = !IS_FORCED && target && target[key] !== undefined;
      // export native or passed
      out = (own ? target : source)[key];
      // bind timers to global for call from export context
      exp = IS_BIND && own ? _ctx(out, _global) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
      // extend global
      if (target) _redefine(target, key, out, type & $export.U);
      // export
      if (exports[key] != out) _hide(exports, key, exp);
      if (IS_PROTO && expProto[key] != out) expProto[key] = out;
    }
  };
  _global.core = _core;
  // type bitmap
  $export.F = 1;   // forced
  $export.G = 2;   // global
  $export.S = 4;   // static
  $export.P = 8;   // proto
  $export.B = 16;  // bind
  $export.W = 32;  // wrap
  $export.U = 64;  // safe
  $export.R = 128; // real proto method for `library`
  var _export = $export;

  _export({
    target: 'RegExp',
    proto: true,
    forced: _regexpExec !== /./.exec
  }, {
    exec: _regexpExec
  });

  var SPECIES$1 = _wks('species');

  var REPLACE_SUPPORTS_NAMED_GROUPS = !_fails(function () {
    // #replace needs built-in support for named groups.
    // #match works fine because it just return the exec results, even if it has
    // a "grops" property.
    var re = /./;
    re.exec = function () {
      var result = [];
      result.groups = { a: '7' };
      return result;
    };
    return ''.replace(re, '$<a>') !== '7';
  });

  var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
    // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
    var re = /(?:)/;
    var originalExec = re.exec;
    re.exec = function () { return originalExec.apply(this, arguments); };
    var result = 'ab'.split(re);
    return result.length === 2 && result[0] === 'a' && result[1] === 'b';
  })();

  var _fixReWks = function (KEY, length, exec) {
    var SYMBOL = _wks(KEY);

    var DELEGATES_TO_SYMBOL = !_fails(function () {
      // String methods call symbol-named RegEp methods
      var O = {};
      O[SYMBOL] = function () { return 7; };
      return ''[KEY](O) != 7;
    });

    var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !_fails(function () {
      // Symbol-named RegExp methods call .exec
      var execCalled = false;
      var re = /a/;
      re.exec = function () { execCalled = true; return null; };
      if (KEY === 'split') {
        // RegExp[@@split] doesn't call the regex's exec method, but first creates
        // a new one. We need to return the patched regex when creating the new one.
        re.constructor = {};
        re.constructor[SPECIES$1] = function () { return re; };
      }
      re[SYMBOL]('');
      return !execCalled;
    }) : undefined;

    if (
      !DELEGATES_TO_SYMBOL ||
      !DELEGATES_TO_EXEC ||
      (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
      (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
    ) {
      var nativeRegExpMethod = /./[SYMBOL];
      var fns = exec(
        _defined,
        SYMBOL,
        ''[KEY],
        function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
          if (regexp.exec === _regexpExec) {
            if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
              // The native String method already delegates to @@method (this
              // polyfilled function), leasing to infinite recursion.
              // We avoid it by directly calling the native @@method method.
              return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
            }
            return { done: true, value: nativeMethod.call(str, regexp, arg2) };
          }
          return { done: false };
        }
      );
      var strfn = fns[0];
      var rxfn = fns[1];

      _redefine(String.prototype, KEY, strfn);
      _hide(RegExp.prototype, SYMBOL, length == 2
        // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
        // 21.2.5.11 RegExp.prototype[@@split](string, limit)
        ? function (string, arg) { return rxfn.call(string, this, arg); }
        // 21.2.5.6 RegExp.prototype[@@match](string)
        // 21.2.5.9 RegExp.prototype[@@search](string)
        : function (string) { return rxfn.call(string, this); }
      );
    }
  };

  var $min = Math.min;
  var $push = [].push;
  var $SPLIT = 'split';
  var LENGTH = 'length';
  var LAST_INDEX$1 = 'lastIndex';
  var MAX_UINT32 = 0xffffffff;

  // babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
  var SUPPORTS_Y = !_fails(function () { });

  // @@split logic
  _fixReWks('split', 2, function (defined, SPLIT, $split, maybeCallNative) {
    var internalSplit;
    if (
      'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
      'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
      'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
      '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
      '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
      ''[$SPLIT](/.?/)[LENGTH]
    ) {
      // based on es5-shim implementation, need to rework it
      internalSplit = function (separator, limit) {
        var string = String(this);
        if (separator === undefined && limit === 0) return [];
        // If `separator` is not a regex, use native split
        if (!_isRegexp(separator)) return $split.call(string, separator, limit);
        var output = [];
        var flags = (separator.ignoreCase ? 'i' : '') +
                    (separator.multiline ? 'm' : '') +
                    (separator.unicode ? 'u' : '') +
                    (separator.sticky ? 'y' : '');
        var lastLastIndex = 0;
        var splitLimit = limit === undefined ? MAX_UINT32 : limit >>> 0;
        // Make `global` and avoid `lastIndex` issues by working with a copy
        var separatorCopy = new RegExp(separator.source, flags + 'g');
        var match, lastIndex, lastLength;
        while (match = _regexpExec.call(separatorCopy, string)) {
          lastIndex = separatorCopy[LAST_INDEX$1];
          if (lastIndex > lastLastIndex) {
            output.push(string.slice(lastLastIndex, match.index));
            if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
            lastLength = match[0][LENGTH];
            lastLastIndex = lastIndex;
            if (output[LENGTH] >= splitLimit) break;
          }
          if (separatorCopy[LAST_INDEX$1] === match.index) separatorCopy[LAST_INDEX$1]++; // Avoid an infinite loop
        }
        if (lastLastIndex === string[LENGTH]) {
          if (lastLength || !separatorCopy.test('')) output.push('');
        } else output.push(string.slice(lastLastIndex));
        return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
      };
    // Chakra, V8
    } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
      internalSplit = function (separator, limit) {
        return separator === undefined && limit === 0 ? [] : $split.call(this, separator, limit);
      };
    } else {
      internalSplit = $split;
    }

    return [
      // `String.prototype.split` method
      // https://tc39.github.io/ecma262/#sec-string.prototype.split
      function split(separator, limit) {
        var O = defined(this);
        var splitter = separator == undefined ? undefined : separator[SPLIT];
        return splitter !== undefined
          ? splitter.call(separator, O, limit)
          : internalSplit.call(String(O), separator, limit);
      },
      // `RegExp.prototype[@@split]` method
      // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
      //
      // NOTE: This cannot be properly polyfilled in engines that don't support
      // the 'y' flag.
      function (regexp, limit) {
        var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== $split);
        if (res.done) return res.value;

        var rx = _anObject(regexp);
        var S = String(this);
        var C = _speciesConstructor(rx, RegExp);

        var unicodeMatching = rx.unicode;
        var flags = (rx.ignoreCase ? 'i' : '') +
                    (rx.multiline ? 'm' : '') +
                    (rx.unicode ? 'u' : '') +
                    (SUPPORTS_Y ? 'y' : 'g');

        // ^(? + rx + ) is needed, in combination with some S slicing, to
        // simulate the 'y' flag.
        var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
        var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
        if (lim === 0) return [];
        if (S.length === 0) return _regexpExecAbstract(splitter, S) === null ? [S] : [];
        var p = 0;
        var q = 0;
        var A = [];
        while (q < S.length) {
          splitter.lastIndex = SUPPORTS_Y ? q : 0;
          var z = _regexpExecAbstract(splitter, SUPPORTS_Y ? S : S.slice(q));
          var e;
          if (
            z === null ||
            (e = $min(_toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
          ) {
            q = _advanceStringIndex(S, q, unicodeMatching);
          } else {
            A.push(S.slice(p, q));
            if (A.length === lim) return A;
            for (var i = 1; i <= z.length - 1; i++) {
              A.push(z[i]);
              if (A.length === lim) return A;
            }
            q = p = e;
          }
        }
        A.push(S.slice(p));
        return A;
      }
    ];
  });

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  // 7.1.13 ToObject(argument)

  var _toObject = function (it) {
    return Object(_defined(it));
  };

  var max = Math.max;
  var min$1 = Math.min;
  var _toAbsoluteIndex = function (index, length) {
    index = _toInteger(index);
    return index < 0 ? max(index + length, 0) : min$1(index, length);
  };

  var _arrayFill = function fill(value /* , start = 0, end = @length */) {
    var O = _toObject(this);
    var length = _toLength(O.length);
    var aLen = arguments.length;
    var index = _toAbsoluteIndex(aLen > 1 ? arguments[1] : undefined, length);
    var end = aLen > 2 ? arguments[2] : undefined;
    var endPos = end === undefined ? length : _toAbsoluteIndex(end, length);
    while (endPos > index) O[index++] = value;
    return O;
  };

  // 22.1.3.31 Array.prototype[@@unscopables]
  var UNSCOPABLES = _wks('unscopables');
  var ArrayProto = Array.prototype;
  if (ArrayProto[UNSCOPABLES] == undefined) _hide(ArrayProto, UNSCOPABLES, {});
  var _addToUnscopables = function (key) {
    ArrayProto[UNSCOPABLES][key] = true;
  };

  // 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)


  _export(_export.P, 'Array', { fill: _arrayFill });

  _addToUnscopables('fill');

  var runtime = createCommonjsModule(function (module) {
  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  !(function(global) {

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined$1; // More compressible than void 0.
    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
    var runtime = global.regeneratorRuntime;
    if (runtime) {
      {
        // If regeneratorRuntime is defined globally and we're in a module,
        // make the exports object identical to regeneratorRuntime.
        module.exports = runtime;
      }
      // Don't bother evaluating the rest of this file if the runtime was
      // already defined globally.
      return;
    }

    // Define the runtime globally (as expected by generated code) as either
    // module.exports (if we're in a module) or a new, empty object.
    runtime = global.regeneratorRuntime = module.exports;

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []);

      // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.
      generator._invoke = makeInvokeMethod(innerFn, self, context);

      return generator;
    }
    runtime.wrap = wrap;

    // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.
    function tryCatch(fn, obj, arg) {
      try {
        return { type: "normal", arg: fn.call(obj, arg) };
      } catch (err) {
        return { type: "throw", arg: err };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed";

    // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.
    var ContinueSentinel = {};

    // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}

    // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.
    var IteratorPrototype = {};
    IteratorPrototype[iteratorSymbol] = function () {
      return this;
    };

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    if (NativeIteratorPrototype &&
        NativeIteratorPrototype !== Op &&
        hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype =
      Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunctionPrototype[toStringTagSymbol] =
      GeneratorFunction.displayName = "GeneratorFunction";

    // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function(method) {
        prototype[method] = function(arg) {
          return this._invoke(method, arg);
        };
      });
    }

    runtime.isGeneratorFunction = function(genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor
        ? ctor === GeneratorFunction ||
          // For the native GeneratorFunction constructor, the best we can
          // do is to check its .name property.
          (ctor.displayName || ctor.name) === "GeneratorFunction"
        : false;
    };

    runtime.mark = function(genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        if (!(toStringTagSymbol in genFun)) {
          genFun[toStringTagSymbol] = "GeneratorFunction";
        }
      }
      genFun.prototype = Object.create(Gp);
      return genFun;
    };

    // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.
    runtime.awrap = function(arg) {
      return { __await: arg };
    };

    function AsyncIterator(generator) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;
          if (value &&
              typeof value === "object" &&
              hasOwn.call(value, "__await")) {
            return Promise.resolve(value.__await).then(function(value) {
              invoke("next", value, resolve, reject);
            }, function(err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return Promise.resolve(value).then(function(unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration.
            result.value = unwrapped;
            resolve(result);
          }, function(error) {
            // If a rejected Promise was yielded, throw the rejection back
            // into the async generator function so it can be handled there.
            return invoke("throw", error, resolve, reject);
          });
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new Promise(function(resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise =
          // If enqueue has been called before, then we want to wait until
          // all previous Promises have been resolved before calling invoke,
          // so that results are always delivered in the correct order. If
          // enqueue has not been called before, then it is important to
          // call invoke immediately, without waiting on a callback to fire,
          // so that the async generator function has the opportunity to do
          // any necessary setup in a predictable way. This predictability
          // is why the Promise constructor synchronously invokes its
          // executor callback, and why async functions synchronously
          // execute code before the first await. Since we implement simple
          // async functions in terms of async generators, it is especially
          // important to get this right, even though it requires care.
          previousPromise ? previousPromise.then(
            callInvokeWithMethodAndArg,
            // Avoid propagating failures to Promises returned by later
            // invocations of the iterator.
            callInvokeWithMethodAndArg
          ) : callInvokeWithMethodAndArg();
      }

      // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).
      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);
    AsyncIterator.prototype[asyncIteratorSymbol] = function () {
      return this;
    };
    runtime.AsyncIterator = AsyncIterator;

    // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.
    runtime.async = function(innerFn, outerFn, self, tryLocsList) {
      var iter = new AsyncIterator(
        wrap(innerFn, outerFn, self, tryLocsList)
      );

      return runtime.isGeneratorFunction(outerFn)
        ? iter // If outerFn is a generator, return the full iterator.
        : iter.next().then(function(result) {
            return result.done ? result.value : iter.next();
          });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;

      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          }

          // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg;

          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);

          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;

          var record = tryCatch(innerFn, self, context);
          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done
              ? GenStateCompleted
              : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };

          } else if (record.type === "throw") {
            state = GenStateCompleted;
            // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.
            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    }

    // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.
    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];
      if (method === undefined$1) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null;

        if (context.method === "throw") {
          if (delegate.iterator.return) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = "return";
            context.arg = undefined$1;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError(
            "The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (! info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value;

        // Resume execution at the desired location (see delegateYield).
        context.next = delegate.nextLoc;

        // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.
        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined$1;
        }

      } else {
        // Re-yield the result returned by the delegate method.
        return info;
      }

      // The delegate iterator is finished, so forget it and continue with
      // the outer generator.
      context.delegate = null;
      return ContinueSentinel;
    }

    // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.
    defineIteratorMethods(Gp);

    Gp[toStringTagSymbol] = "Generator";

    // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.
    Gp[iteratorSymbol] = function() {
      return this;
    };

    Gp.toString = function() {
      return "[object Generator]";
    };

    function pushTryEntry(locs) {
      var entry = { tryLoc: locs[0] };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{ tryLoc: "root" }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    runtime.keys = function(object) {
      var keys = [];
      for (var key in object) {
        keys.push(key);
      }
      keys.reverse();

      // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.
      return function next() {
        while (keys.length) {
          var key = keys.pop();
          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        }

        // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.
        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1, next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined$1;
            next.done = true;

            return next;
          };

          return next.next = next;
        }
      }

      // Return an iterator with no values.
      return { next: doneResult };
    }
    runtime.values = values;

    function doneResult() {
      return { value: undefined$1, done: true };
    }

    Context.prototype = {
      constructor: Context,

      reset: function(skipTempReset) {
        this.prev = 0;
        this.next = 0;
        // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.
        this.sent = this._sent = undefined$1;
        this.done = false;
        this.delegate = null;

        this.method = "next";
        this.arg = undefined$1;

        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" &&
                hasOwn.call(this, name) &&
                !isNaN(+name.slice(1))) {
              this[name] = undefined$1;
            }
          }
        }
      },

      stop: function() {
        this.done = true;

        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;
        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },

      dispatchException: function(exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;
        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = "next";
            context.arg = undefined$1;
          }

          return !! caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }

            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },

      abrupt: function(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev &&
              hasOwn.call(entry, "finallyLoc") &&
              this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry &&
            (type === "break" ||
             type === "continue") &&
            finallyEntry.tryLoc <= arg &&
            arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },

      complete: function(record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" ||
            record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },

      finish: function(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },

      "catch": function(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }

        // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.
        throw new Error("illegal catch attempt");
      },

      delegateYield: function(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined$1;
        }

        return ContinueSentinel;
      }
    };
  })(
    // In sloppy mode, unbound `this` refers to the global object, fallback to
    // Function constructor if we're in global strict mode. That is sadly a form
    // of indirect eval which violates Content Security Policy.
    (function() {
      return this || (typeof self === "object" && self);
    })() || Function("return this")()
  );
  });

  // fallback for non-array-like ES3 and non-enumerable old V8 strings

  // eslint-disable-next-line no-prototype-builtins
  var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
    return _cof(it) == 'String' ? it.split('') : Object(it);
  };

  // to indexed object, toObject with fallback for non-array-like ES3 strings


  var _toIobject = function (it) {
    return _iobject(_defined(it));
  };

  // false -> Array#indexOf
  // true  -> Array#includes



  var _arrayIncludes = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = _toIobject($this);
      var length = _toLength(O.length);
      var index = _toAbsoluteIndex(fromIndex, length);
      var value;
      // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare
      if (IS_INCLUDES && el != el) while (length > index) {
        value = O[index++];
        // eslint-disable-next-line no-self-compare
        if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
      } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
        if (O[index] === el) return IS_INCLUDES || index || 0;
      } return !IS_INCLUDES && -1;
    };
  };

  var shared = _shared('keys');

  var _sharedKey = function (key) {
    return shared[key] || (shared[key] = _uid(key));
  };

  var arrayIndexOf = _arrayIncludes(false);
  var IE_PROTO = _sharedKey('IE_PROTO');

  var _objectKeysInternal = function (object, names) {
    var O = _toIobject(object);
    var i = 0;
    var result = [];
    var key;
    for (key in O) if (key != IE_PROTO) _has(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while (names.length > i) if (_has(O, key = names[i++])) {
      ~arrayIndexOf(result, key) || result.push(key);
    }
    return result;
  };

  // IE 8- don't enum bug keys
  var _enumBugKeys = (
    'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
  ).split(',');

  // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)

  var hiddenKeys = _enumBugKeys.concat('length', 'prototype');

  var f$1 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
    return _objectKeysInternal(O, hiddenKeys);
  };

  var _objectGopn = {
  	f: f$1
  };

  var f$2 = Object.getOwnPropertySymbols;

  var _objectGops = {
  	f: f$2
  };

  // all object keys, includes non-enumerable and symbols



  var Reflect$1 = _global.Reflect;
  var _ownKeys = Reflect$1 && Reflect$1.ownKeys || function ownKeys(it) {
    var keys = _objectGopn.f(_anObject(it));
    var getSymbols = _objectGops.f;
    return getSymbols ? keys.concat(getSymbols(it)) : keys;
  };

  // 26.1.11 Reflect.ownKeys(target)


  _export(_export.S, 'Reflect', { ownKeys: _ownKeys });

  var _iterStep = function (done, value) {
    return { value: value, done: !!done };
  };

  var _iterators = {};

  // 19.1.2.14 / 15.2.3.14 Object.keys(O)



  var _objectKeys = Object.keys || function keys(O) {
    return _objectKeysInternal(O, _enumBugKeys);
  };

  var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
    _anObject(O);
    var keys = _objectKeys(Properties);
    var length = keys.length;
    var i = 0;
    var P;
    while (length > i) _objectDp.f(O, P = keys[i++], Properties[P]);
    return O;
  };

  var document$2 = _global.document;
  var _html = document$2 && document$2.documentElement;

  // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])



  var IE_PROTO$1 = _sharedKey('IE_PROTO');
  var Empty = function () { /* empty */ };
  var PROTOTYPE$1 = 'prototype';

  // Create object with fake `null` prototype: use iframe Object with cleared prototype
  var createDict = function () {
    // Thrash, waste and sodomy: IE GC bug
    var iframe = _domCreate('iframe');
    var i = _enumBugKeys.length;
    var lt = '<';
    var gt = '>';
    var iframeDocument;
    iframe.style.display = 'none';
    _html.appendChild(iframe);
    iframe.src = 'javascript:'; // eslint-disable-line no-script-url
    // createDict = iframe.contentWindow.Object;
    // html.removeChild(iframe);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
    iframeDocument.close();
    createDict = iframeDocument.F;
    while (i--) delete createDict[PROTOTYPE$1][_enumBugKeys[i]];
    return createDict();
  };

  var _objectCreate = Object.create || function create(O, Properties) {
    var result;
    if (O !== null) {
      Empty[PROTOTYPE$1] = _anObject(O);
      result = new Empty();
      Empty[PROTOTYPE$1] = null;
      // add "__proto__" for Object.getPrototypeOf polyfill
      result[IE_PROTO$1] = O;
    } else result = createDict();
    return Properties === undefined ? result : _objectDps(result, Properties);
  };

  var def = _objectDp.f;

  var TAG$1 = _wks('toStringTag');

  var _setToStringTag = function (it, tag, stat) {
    if (it && !_has(it = stat ? it : it.prototype, TAG$1)) def(it, TAG$1, { configurable: true, value: tag });
  };

  var IteratorPrototype = {};

  // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
  _hide(IteratorPrototype, _wks('iterator'), function () { return this; });

  var _iterCreate = function (Constructor, NAME, next) {
    Constructor.prototype = _objectCreate(IteratorPrototype, { next: _propertyDesc(1, next) });
    _setToStringTag(Constructor, NAME + ' Iterator');
  };

  // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)


  var IE_PROTO$2 = _sharedKey('IE_PROTO');
  var ObjectProto = Object.prototype;

  var _objectGpo = Object.getPrototypeOf || function (O) {
    O = _toObject(O);
    if (_has(O, IE_PROTO$2)) return O[IE_PROTO$2];
    if (typeof O.constructor == 'function' && O instanceof O.constructor) {
      return O.constructor.prototype;
    } return O instanceof Object ? ObjectProto : null;
  };

  var ITERATOR = _wks('iterator');
  var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
  var FF_ITERATOR = '@@iterator';
  var KEYS = 'keys';
  var VALUES = 'values';

  var returnThis = function () { return this; };

  var _iterDefine = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
    _iterCreate(Constructor, NAME, next);
    var getMethod = function (kind) {
      if (!BUGGY && kind in proto) return proto[kind];
      switch (kind) {
        case KEYS: return function keys() { return new Constructor(this, kind); };
        case VALUES: return function values() { return new Constructor(this, kind); };
      } return function entries() { return new Constructor(this, kind); };
    };
    var TAG = NAME + ' Iterator';
    var DEF_VALUES = DEFAULT == VALUES;
    var VALUES_BUG = false;
    var proto = Base.prototype;
    var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
    var $default = $native || getMethod(DEFAULT);
    var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
    var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
    var methods, key, IteratorPrototype;
    // Fix native
    if ($anyNative) {
      IteratorPrototype = _objectGpo($anyNative.call(new Base()));
      if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
        // Set @@toStringTag to native iterators
        _setToStringTag(IteratorPrototype, TAG, true);
        // fix for some old engines
        if (!_library && typeof IteratorPrototype[ITERATOR] != 'function') _hide(IteratorPrototype, ITERATOR, returnThis);
      }
    }
    // fix Array#{values, @@iterator}.name in V8 / FF
    if (DEF_VALUES && $native && $native.name !== VALUES) {
      VALUES_BUG = true;
      $default = function values() { return $native.call(this); };
    }
    // Define iterator
    if ((!_library || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
      _hide(proto, ITERATOR, $default);
    }
    // Plug for library
    _iterators[NAME] = $default;
    _iterators[TAG] = returnThis;
    if (DEFAULT) {
      methods = {
        values: DEF_VALUES ? $default : getMethod(VALUES),
        keys: IS_SET ? $default : getMethod(KEYS),
        entries: $entries
      };
      if (FORCED) for (key in methods) {
        if (!(key in proto)) _redefine(proto, key, methods[key]);
      } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
    }
    return methods;
  };

  // 22.1.3.4 Array.prototype.entries()
  // 22.1.3.13 Array.prototype.keys()
  // 22.1.3.29 Array.prototype.values()
  // 22.1.3.30 Array.prototype[@@iterator]()
  var es6_array_iterator = _iterDefine(Array, 'Array', function (iterated, kind) {
    this._t = _toIobject(iterated); // target
    this._i = 0;                   // next index
    this._k = kind;                // kind
  // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
  }, function () {
    var O = this._t;
    var kind = this._k;
    var index = this._i++;
    if (!O || index >= O.length) {
      this._t = undefined;
      return _iterStep(1);
    }
    if (kind == 'keys') return _iterStep(0, index);
    if (kind == 'values') return _iterStep(0, O[index]);
    return _iterStep(0, [index, O[index]]);
  }, 'values');

  // argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
  _iterators.Arguments = _iterators.Array;

  _addToUnscopables('keys');
  _addToUnscopables('values');
  _addToUnscopables('entries');

  // most Object methods by ES6 should accept primitives



  var _objectSap = function (KEY, exec) {
    var fn = (_core.Object || {})[KEY] || Object[KEY];
    var exp = {};
    exp[KEY] = exec(fn);
    _export(_export.S + _export.F * _fails(function () { fn(1); }), 'Object', exp);
  };

  // 19.1.2.14 Object.keys(O)



  _objectSap('keys', function () {
    return function keys(it) {
      return _objectKeys(_toObject(it));
    };
  });

  // @@match logic
  _fixReWks('match', 1, function (defined, MATCH, $match, maybeCallNative) {
    return [
      // `String.prototype.match` method
      // https://tc39.github.io/ecma262/#sec-string.prototype.match
      function match(regexp) {
        var O = defined(this);
        var fn = regexp == undefined ? undefined : regexp[MATCH];
        return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
      },
      // `RegExp.prototype[@@match]` method
      // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
      function (regexp) {
        var res = maybeCallNative($match, regexp, this);
        if (res.done) return res.value;
        var rx = _anObject(regexp);
        var S = String(this);
        if (!rx.global) return _regexpExecAbstract(rx, S);
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
        var A = [];
        var n = 0;
        var result;
        while ((result = _regexpExecAbstract(rx, S)) !== null) {
          var matchStr = String(result[0]);
          A[n] = matchStr;
          if (matchStr === '') rx.lastIndex = _advanceStringIndex(S, _toLength(rx.lastIndex), fullUnicode);
          n++;
        }
        return n === 0 ? null : A;
      }
    ];
  });

  var dP$1 = _objectDp.f;
  var FProto = Function.prototype;
  var nameRE = /^\s*function ([^ (]*)/;
  var NAME = 'name';

  // 19.2.4.2 name
  NAME in FProto || _descriptors && dP$1(FProto, NAME, {
    configurable: true,
    get: function () {
      try {
        return ('' + this).match(nameRE)[1];
      } catch (e) {
        return '';
      }
    }
  });

  var f$3 = _wks;

  var _wksExt = {
  	f: f$3
  };

  var defineProperty = _objectDp.f;
  var _wksDefine = function (name) {
    var $Symbol = _core.Symbol || (_core.Symbol = _library ? {} : _global.Symbol || {});
    if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: _wksExt.f(name) });
  };

  _wksDefine('asyncIterator');

  var _meta = createCommonjsModule(function (module) {
  var META = _uid('meta');


  var setDesc = _objectDp.f;
  var id = 0;
  var isExtensible = Object.isExtensible || function () {
    return true;
  };
  var FREEZE = !_fails(function () {
    return isExtensible(Object.preventExtensions({}));
  });
  var setMeta = function (it) {
    setDesc(it, META, { value: {
      i: 'O' + ++id, // object ID
      w: {}          // weak collections IDs
    } });
  };
  var fastKey = function (it, create) {
    // return primitive with prefix
    if (!_isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
    if (!_has(it, META)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return 'F';
      // not necessary to add metadata
      if (!create) return 'E';
      // add missing metadata
      setMeta(it);
    // return object ID
    } return it[META].i;
  };
  var getWeak = function (it, create) {
    if (!_has(it, META)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return true;
      // not necessary to add metadata
      if (!create) return false;
      // add missing metadata
      setMeta(it);
    // return hash weak collections IDs
    } return it[META].w;
  };
  // add metadata on freeze-family methods calling
  var onFreeze = function (it) {
    if (FREEZE && meta.NEED && isExtensible(it) && !_has(it, META)) setMeta(it);
    return it;
  };
  var meta = module.exports = {
    KEY: META,
    NEED: false,
    fastKey: fastKey,
    getWeak: getWeak,
    onFreeze: onFreeze
  };
  });
  var _meta_1 = _meta.KEY;
  var _meta_2 = _meta.NEED;
  var _meta_3 = _meta.fastKey;
  var _meta_4 = _meta.getWeak;
  var _meta_5 = _meta.onFreeze;

  var f$4 = {}.propertyIsEnumerable;

  var _objectPie = {
  	f: f$4
  };

  // all enumerable object keys, includes symbols



  var _enumKeys = function (it) {
    var result = _objectKeys(it);
    var getSymbols = _objectGops.f;
    if (getSymbols) {
      var symbols = getSymbols(it);
      var isEnum = _objectPie.f;
      var i = 0;
      var key;
      while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
    } return result;
  };

  // 7.2.2 IsArray(argument)

  var _isArray = Array.isArray || function isArray(arg) {
    return _cof(arg) == 'Array';
  };

  // fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window

  var gOPN = _objectGopn.f;
  var toString$1 = {}.toString;

  var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
    ? Object.getOwnPropertyNames(window) : [];

  var getWindowNames = function (it) {
    try {
      return gOPN(it);
    } catch (e) {
      return windowNames.slice();
    }
  };

  var f$5 = function getOwnPropertyNames(it) {
    return windowNames && toString$1.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(_toIobject(it));
  };

  var _objectGopnExt = {
  	f: f$5
  };

  var gOPD = Object.getOwnPropertyDescriptor;

  var f$6 = _descriptors ? gOPD : function getOwnPropertyDescriptor(O, P) {
    O = _toIobject(O);
    P = _toPrimitive(P, true);
    if (_ie8DomDefine) try {
      return gOPD(O, P);
    } catch (e) { /* empty */ }
    if (_has(O, P)) return _propertyDesc(!_objectPie.f.call(O, P), O[P]);
  };

  var _objectGopd = {
  	f: f$6
  };

  // ECMAScript 6 symbols shim





  var META = _meta.KEY;



















  var gOPD$1 = _objectGopd.f;
  var dP$2 = _objectDp.f;
  var gOPN$1 = _objectGopnExt.f;
  var $Symbol = _global.Symbol;
  var $JSON = _global.JSON;
  var _stringify = $JSON && $JSON.stringify;
  var PROTOTYPE$2 = 'prototype';
  var HIDDEN = _wks('_hidden');
  var TO_PRIMITIVE = _wks('toPrimitive');
  var isEnum = {}.propertyIsEnumerable;
  var SymbolRegistry = _shared('symbol-registry');
  var AllSymbols = _shared('symbols');
  var OPSymbols = _shared('op-symbols');
  var ObjectProto$1 = Object[PROTOTYPE$2];
  var USE_NATIVE = typeof $Symbol == 'function';
  var QObject = _global.QObject;
  // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
  var setter = !QObject || !QObject[PROTOTYPE$2] || !QObject[PROTOTYPE$2].findChild;

  // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
  var setSymbolDesc = _descriptors && _fails(function () {
    return _objectCreate(dP$2({}, 'a', {
      get: function () { return dP$2(this, 'a', { value: 7 }).a; }
    })).a != 7;
  }) ? function (it, key, D) {
    var protoDesc = gOPD$1(ObjectProto$1, key);
    if (protoDesc) delete ObjectProto$1[key];
    dP$2(it, key, D);
    if (protoDesc && it !== ObjectProto$1) dP$2(ObjectProto$1, key, protoDesc);
  } : dP$2;

  var wrap = function (tag) {
    var sym = AllSymbols[tag] = _objectCreate($Symbol[PROTOTYPE$2]);
    sym._k = tag;
    return sym;
  };

  var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
    return typeof it == 'symbol';
  } : function (it) {
    return it instanceof $Symbol;
  };

  var $defineProperty = function defineProperty(it, key, D) {
    if (it === ObjectProto$1) $defineProperty(OPSymbols, key, D);
    _anObject(it);
    key = _toPrimitive(key, true);
    _anObject(D);
    if (_has(AllSymbols, key)) {
      if (!D.enumerable) {
        if (!_has(it, HIDDEN)) dP$2(it, HIDDEN, _propertyDesc(1, {}));
        it[HIDDEN][key] = true;
      } else {
        if (_has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
        D = _objectCreate(D, { enumerable: _propertyDesc(0, false) });
      } return setSymbolDesc(it, key, D);
    } return dP$2(it, key, D);
  };
  var $defineProperties = function defineProperties(it, P) {
    _anObject(it);
    var keys = _enumKeys(P = _toIobject(P));
    var i = 0;
    var l = keys.length;
    var key;
    while (l > i) $defineProperty(it, key = keys[i++], P[key]);
    return it;
  };
  var $create = function create(it, P) {
    return P === undefined ? _objectCreate(it) : $defineProperties(_objectCreate(it), P);
  };
  var $propertyIsEnumerable = function propertyIsEnumerable(key) {
    var E = isEnum.call(this, key = _toPrimitive(key, true));
    if (this === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return false;
    return E || !_has(this, key) || !_has(AllSymbols, key) || _has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
  };
  var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
    it = _toIobject(it);
    key = _toPrimitive(key, true);
    if (it === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return;
    var D = gOPD$1(it, key);
    if (D && _has(AllSymbols, key) && !(_has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
    return D;
  };
  var $getOwnPropertyNames = function getOwnPropertyNames(it) {
    var names = gOPN$1(_toIobject(it));
    var result = [];
    var i = 0;
    var key;
    while (names.length > i) {
      if (!_has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
    } return result;
  };
  var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
    var IS_OP = it === ObjectProto$1;
    var names = gOPN$1(IS_OP ? OPSymbols : _toIobject(it));
    var result = [];
    var i = 0;
    var key;
    while (names.length > i) {
      if (_has(AllSymbols, key = names[i++]) && (IS_OP ? _has(ObjectProto$1, key) : true)) result.push(AllSymbols[key]);
    } return result;
  };

  // 19.4.1.1 Symbol([description])
  if (!USE_NATIVE) {
    $Symbol = function Symbol() {
      if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
      var tag = _uid(arguments.length > 0 ? arguments[0] : undefined);
      var $set = function (value) {
        if (this === ObjectProto$1) $set.call(OPSymbols, value);
        if (_has(this, HIDDEN) && _has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
        setSymbolDesc(this, tag, _propertyDesc(1, value));
      };
      if (_descriptors && setter) setSymbolDesc(ObjectProto$1, tag, { configurable: true, set: $set });
      return wrap(tag);
    };
    _redefine($Symbol[PROTOTYPE$2], 'toString', function toString() {
      return this._k;
    });

    _objectGopd.f = $getOwnPropertyDescriptor;
    _objectDp.f = $defineProperty;
    _objectGopn.f = _objectGopnExt.f = $getOwnPropertyNames;
    _objectPie.f = $propertyIsEnumerable;
    _objectGops.f = $getOwnPropertySymbols;

    if (_descriptors && !_library) {
      _redefine(ObjectProto$1, 'propertyIsEnumerable', $propertyIsEnumerable, true);
    }

    _wksExt.f = function (name) {
      return wrap(_wks(name));
    };
  }

  _export(_export.G + _export.W + _export.F * !USE_NATIVE, { Symbol: $Symbol });

  for (var es6Symbols = (
    // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
    'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
  ).split(','), j = 0; es6Symbols.length > j;)_wks(es6Symbols[j++]);

  for (var wellKnownSymbols = _objectKeys(_wks.store), k = 0; wellKnownSymbols.length > k;) _wksDefine(wellKnownSymbols[k++]);

  _export(_export.S + _export.F * !USE_NATIVE, 'Symbol', {
    // 19.4.2.1 Symbol.for(key)
    'for': function (key) {
      return _has(SymbolRegistry, key += '')
        ? SymbolRegistry[key]
        : SymbolRegistry[key] = $Symbol(key);
    },
    // 19.4.2.5 Symbol.keyFor(sym)
    keyFor: function keyFor(sym) {
      if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
      for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
    },
    useSetter: function () { setter = true; },
    useSimple: function () { setter = false; }
  });

  _export(_export.S + _export.F * !USE_NATIVE, 'Object', {
    // 19.1.2.2 Object.create(O [, Properties])
    create: $create,
    // 19.1.2.4 Object.defineProperty(O, P, Attributes)
    defineProperty: $defineProperty,
    // 19.1.2.3 Object.defineProperties(O, Properties)
    defineProperties: $defineProperties,
    // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
    getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
    // 19.1.2.7 Object.getOwnPropertyNames(O)
    getOwnPropertyNames: $getOwnPropertyNames,
    // 19.1.2.8 Object.getOwnPropertySymbols(O)
    getOwnPropertySymbols: $getOwnPropertySymbols
  });

  // 24.3.2 JSON.stringify(value [, replacer [, space]])
  $JSON && _export(_export.S + _export.F * (!USE_NATIVE || _fails(function () {
    var S = $Symbol();
    // MS Edge converts symbol values to JSON as {}
    // WebKit converts symbol values to JSON as null
    // V8 throws on boxed symbols
    return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
  })), 'JSON', {
    stringify: function stringify(it) {
      var args = [it];
      var i = 1;
      var replacer, $replacer;
      while (arguments.length > i) args.push(arguments[i++]);
      $replacer = replacer = args[1];
      if (!_isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
      if (!_isArray(replacer)) replacer = function (key, value) {
        if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
        if (!isSymbol(value)) return value;
      };
      args[1] = replacer;
      return _stringify.apply($JSON, args);
    }
  });

  // 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
  $Symbol[PROTOTYPE$2][TO_PRIMITIVE] || _hide($Symbol[PROTOTYPE$2], TO_PRIMITIVE, $Symbol[PROTOTYPE$2].valueOf);
  // 19.4.3.5 Symbol.prototype[@@toStringTag]
  _setToStringTag($Symbol, 'Symbol');
  // 20.2.1.9 Math[@@toStringTag]
  _setToStringTag(Math, 'Math', true);
  // 24.3.3 JSON[@@toStringTag]
  _setToStringTag(_global.JSON, 'JSON', true);

  var _anInstance = function (it, Constructor, name, forbiddenField) {
    if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
      throw TypeError(name + ': incorrect invocation!');
    } return it;
  };

  // call something on iterator step with safe closing on error

  var _iterCall = function (iterator, fn, value, entries) {
    try {
      return entries ? fn(_anObject(value)[0], value[1]) : fn(value);
    // 7.4.6 IteratorClose(iterator, completion)
    } catch (e) {
      var ret = iterator['return'];
      if (ret !== undefined) _anObject(ret.call(iterator));
      throw e;
    }
  };

  // check on default Array iterator

  var ITERATOR$1 = _wks('iterator');
  var ArrayProto$1 = Array.prototype;

  var _isArrayIter = function (it) {
    return it !== undefined && (_iterators.Array === it || ArrayProto$1[ITERATOR$1] === it);
  };

  var ITERATOR$2 = _wks('iterator');

  var core_getIteratorMethod = _core.getIteratorMethod = function (it) {
    if (it != undefined) return it[ITERATOR$2]
      || it['@@iterator']
      || _iterators[_classof(it)];
  };

  var _forOf = createCommonjsModule(function (module) {
  var BREAK = {};
  var RETURN = {};
  var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
    var iterFn = ITERATOR ? function () { return iterable; } : core_getIteratorMethod(iterable);
    var f = _ctx(fn, that, entries ? 2 : 1);
    var index = 0;
    var length, step, iterator, result;
    if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
    // fast case for arrays with default iterator
    if (_isArrayIter(iterFn)) for (length = _toLength(iterable.length); length > index; index++) {
      result = entries ? f(_anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
      if (result === BREAK || result === RETURN) return result;
    } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
      result = _iterCall(iterator, f, step.value, entries);
      if (result === BREAK || result === RETURN) return result;
    }
  };
  exports.BREAK = BREAK;
  exports.RETURN = RETURN;
  });

  // fast apply, http://jsperf.lnkit.com/fast-apply/5
  var _invoke = function (fn, args, that) {
    var un = that === undefined;
    switch (args.length) {
      case 0: return un ? fn()
                        : fn.call(that);
      case 1: return un ? fn(args[0])
                        : fn.call(that, args[0]);
      case 2: return un ? fn(args[0], args[1])
                        : fn.call(that, args[0], args[1]);
      case 3: return un ? fn(args[0], args[1], args[2])
                        : fn.call(that, args[0], args[1], args[2]);
      case 4: return un ? fn(args[0], args[1], args[2], args[3])
                        : fn.call(that, args[0], args[1], args[2], args[3]);
    } return fn.apply(that, args);
  };

  var process = _global.process;
  var setTask = _global.setImmediate;
  var clearTask = _global.clearImmediate;
  var MessageChannel = _global.MessageChannel;
  var Dispatch = _global.Dispatch;
  var counter = 0;
  var queue = {};
  var ONREADYSTATECHANGE = 'onreadystatechange';
  var defer, channel, port;
  var run = function () {
    var id = +this;
    // eslint-disable-next-line no-prototype-builtins
    if (queue.hasOwnProperty(id)) {
      var fn = queue[id];
      delete queue[id];
      fn();
    }
  };
  var listener = function (event) {
    run.call(event.data);
  };
  // Node.js 0.9+ & IE10+ has setImmediate, otherwise:
  if (!setTask || !clearTask) {
    setTask = function setImmediate(fn) {
      var args = [];
      var i = 1;
      while (arguments.length > i) args.push(arguments[i++]);
      queue[++counter] = function () {
        // eslint-disable-next-line no-new-func
        _invoke(typeof fn == 'function' ? fn : Function(fn), args);
      };
      defer(counter);
      return counter;
    };
    clearTask = function clearImmediate(id) {
      delete queue[id];
    };
    // Node.js 0.8-
    if (_cof(process) == 'process') {
      defer = function (id) {
        process.nextTick(_ctx(run, id, 1));
      };
    // Sphere (JS game engine) Dispatch API
    } else if (Dispatch && Dispatch.now) {
      defer = function (id) {
        Dispatch.now(_ctx(run, id, 1));
      };
    // Browsers with MessageChannel, includes WebWorkers
    } else if (MessageChannel) {
      channel = new MessageChannel();
      port = channel.port2;
      channel.port1.onmessage = listener;
      defer = _ctx(port.postMessage, port, 1);
    // Browsers with postMessage, skip WebWorkers
    // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
    } else if (_global.addEventListener && typeof postMessage == 'function' && !_global.importScripts) {
      defer = function (id) {
        _global.postMessage(id + '', '*');
      };
      _global.addEventListener('message', listener, false);
    // IE8-
    } else if (ONREADYSTATECHANGE in _domCreate('script')) {
      defer = function (id) {
        _html.appendChild(_domCreate('script'))[ONREADYSTATECHANGE] = function () {
          _html.removeChild(this);
          run.call(id);
        };
      };
    // Rest old browsers
    } else {
      defer = function (id) {
        setTimeout(_ctx(run, id, 1), 0);
      };
    }
  }
  var _task = {
    set: setTask,
    clear: clearTask
  };

  var macrotask = _task.set;
  var Observer = _global.MutationObserver || _global.WebKitMutationObserver;
  var process$1 = _global.process;
  var Promise$1 = _global.Promise;
  var isNode = _cof(process$1) == 'process';

  var _microtask = function () {
    var head, last, notify;

    var flush = function () {
      var parent, fn;
      if (isNode && (parent = process$1.domain)) parent.exit();
      while (head) {
        fn = head.fn;
        head = head.next;
        try {
          fn();
        } catch (e) {
          if (head) notify();
          else last = undefined;
          throw e;
        }
      } last = undefined;
      if (parent) parent.enter();
    };

    // Node.js
    if (isNode) {
      notify = function () {
        process$1.nextTick(flush);
      };
    // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
    } else if (Observer && !(_global.navigator && _global.navigator.standalone)) {
      var toggle = true;
      var node = document.createTextNode('');
      new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
      notify = function () {
        node.data = toggle = !toggle;
      };
    // environments with maybe non-completely correct, but existent Promise
    } else if (Promise$1 && Promise$1.resolve) {
      // Promise.resolve without an argument throws an error in LG WebOS 2
      var promise = Promise$1.resolve(undefined);
      notify = function () {
        promise.then(flush);
      };
    // for other environments - macrotask based on:
    // - setImmediate
    // - MessageChannel
    // - window.postMessag
    // - onreadystatechange
    // - setTimeout
    } else {
      notify = function () {
        // strange IE + webpack dev server bug - use .call(global)
        macrotask.call(_global, flush);
      };
    }

    return function (fn) {
      var task = { fn: fn, next: undefined };
      if (last) last.next = task;
      if (!head) {
        head = task;
        notify();
      } last = task;
    };
  };

  // 25.4.1.5 NewPromiseCapability(C)


  function PromiseCapability(C) {
    var resolve, reject;
    this.promise = new C(function ($$resolve, $$reject) {
      if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
      resolve = $$resolve;
      reject = $$reject;
    });
    this.resolve = _aFunction(resolve);
    this.reject = _aFunction(reject);
  }

  var f$7 = function (C) {
    return new PromiseCapability(C);
  };

  var _newPromiseCapability = {
  	f: f$7
  };

  var _perform = function (exec) {
    try {
      return { e: false, v: exec() };
    } catch (e) {
      return { e: true, v: e };
    }
  };

  var navigator = _global.navigator;

  var _userAgent = navigator && navigator.userAgent || '';

  var _promiseResolve = function (C, x) {
    _anObject(C);
    if (_isObject(x) && x.constructor === C) return x;
    var promiseCapability = _newPromiseCapability.f(C);
    var resolve = promiseCapability.resolve;
    resolve(x);
    return promiseCapability.promise;
  };

  var _redefineAll = function (target, src, safe) {
    for (var key in src) _redefine(target, key, src[key], safe);
    return target;
  };

  var SPECIES$2 = _wks('species');

  var _setSpecies = function (KEY) {
    var C = _global[KEY];
    if (_descriptors && C && !C[SPECIES$2]) _objectDp.f(C, SPECIES$2, {
      configurable: true,
      get: function () { return this; }
    });
  };

  var ITERATOR$3 = _wks('iterator');
  var SAFE_CLOSING = false;

  try {
    var riter = [7][ITERATOR$3]();
    riter['return'] = function () { SAFE_CLOSING = true; };
  } catch (e) { /* empty */ }

  var _iterDetect = function (exec, skipClosing) {
    if (!skipClosing && !SAFE_CLOSING) return false;
    var safe = false;
    try {
      var arr = [7];
      var iter = arr[ITERATOR$3]();
      iter.next = function () { return { done: safe = true }; };
      arr[ITERATOR$3] = function () { return iter; };
      exec(arr);
    } catch (e) { /* empty */ }
    return safe;
  };

  var task = _task.set;
  var microtask = _microtask();




  var PROMISE = 'Promise';
  var TypeError$1 = _global.TypeError;
  var process$2 = _global.process;
  var versions = process$2 && process$2.versions;
  var v8 = versions && versions.v8 || '';
  var $Promise = _global[PROMISE];
  var isNode$1 = _classof(process$2) == 'process';
  var empty = function () { /* empty */ };
  var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
  var newPromiseCapability = newGenericPromiseCapability = _newPromiseCapability.f;

  var USE_NATIVE$1 = !!function () {
    try {
      // correct subclassing with @@species support
      var promise = $Promise.resolve(1);
      var FakePromise = (promise.constructor = {})[_wks('species')] = function (exec) {
        exec(empty, empty);
      };
      // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
      return (isNode$1 || typeof PromiseRejectionEvent == 'function')
        && promise.then(empty) instanceof FakePromise
        // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
        // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
        // we can't detect it synchronously, so just check versions
        && v8.indexOf('6.6') !== 0
        && _userAgent.indexOf('Chrome/66') === -1;
    } catch (e) { /* empty */ }
  }();

  // helpers
  var isThenable = function (it) {
    var then;
    return _isObject(it) && typeof (then = it.then) == 'function' ? then : false;
  };
  var notify = function (promise, isReject) {
    if (promise._n) return;
    promise._n = true;
    var chain = promise._c;
    microtask(function () {
      var value = promise._v;
      var ok = promise._s == 1;
      var i = 0;
      var run = function (reaction) {
        var handler = ok ? reaction.ok : reaction.fail;
        var resolve = reaction.resolve;
        var reject = reaction.reject;
        var domain = reaction.domain;
        var result, then, exited;
        try {
          if (handler) {
            if (!ok) {
              if (promise._h == 2) onHandleUnhandled(promise);
              promise._h = 1;
            }
            if (handler === true) result = value;
            else {
              if (domain) domain.enter();
              result = handler(value); // may throw
              if (domain) {
                domain.exit();
                exited = true;
              }
            }
            if (result === reaction.promise) {
              reject(TypeError$1('Promise-chain cycle'));
            } else if (then = isThenable(result)) {
              then.call(result, resolve, reject);
            } else resolve(result);
          } else reject(value);
        } catch (e) {
          if (domain && !exited) domain.exit();
          reject(e);
        }
      };
      while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
      promise._c = [];
      promise._n = false;
      if (isReject && !promise._h) onUnhandled(promise);
    });
  };
  var onUnhandled = function (promise) {
    task.call(_global, function () {
      var value = promise._v;
      var unhandled = isUnhandled(promise);
      var result, handler, console;
      if (unhandled) {
        result = _perform(function () {
          if (isNode$1) {
            process$2.emit('unhandledRejection', value, promise);
          } else if (handler = _global.onunhandledrejection) {
            handler({ promise: promise, reason: value });
          } else if ((console = _global.console) && console.error) {
            console.error('Unhandled promise rejection', value);
          }
        });
        // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
        promise._h = isNode$1 || isUnhandled(promise) ? 2 : 1;
      } promise._a = undefined;
      if (unhandled && result.e) throw result.v;
    });
  };
  var isUnhandled = function (promise) {
    return promise._h !== 1 && (promise._a || promise._c).length === 0;
  };
  var onHandleUnhandled = function (promise) {
    task.call(_global, function () {
      var handler;
      if (isNode$1) {
        process$2.emit('rejectionHandled', promise);
      } else if (handler = _global.onrejectionhandled) {
        handler({ promise: promise, reason: promise._v });
      }
    });
  };
  var $reject = function (value) {
    var promise = this;
    if (promise._d) return;
    promise._d = true;
    promise = promise._w || promise; // unwrap
    promise._v = value;
    promise._s = 2;
    if (!promise._a) promise._a = promise._c.slice();
    notify(promise, true);
  };
  var $resolve = function (value) {
    var promise = this;
    var then;
    if (promise._d) return;
    promise._d = true;
    promise = promise._w || promise; // unwrap
    try {
      if (promise === value) throw TypeError$1("Promise can't be resolved itself");
      if (then = isThenable(value)) {
        microtask(function () {
          var wrapper = { _w: promise, _d: false }; // wrap
          try {
            then.call(value, _ctx($resolve, wrapper, 1), _ctx($reject, wrapper, 1));
          } catch (e) {
            $reject.call(wrapper, e);
          }
        });
      } else {
        promise._v = value;
        promise._s = 1;
        notify(promise, false);
      }
    } catch (e) {
      $reject.call({ _w: promise, _d: false }, e); // wrap
    }
  };

  // constructor polyfill
  if (!USE_NATIVE$1) {
    // 25.4.3.1 Promise(executor)
    $Promise = function Promise(executor) {
      _anInstance(this, $Promise, PROMISE, '_h');
      _aFunction(executor);
      Internal.call(this);
      try {
        executor(_ctx($resolve, this, 1), _ctx($reject, this, 1));
      } catch (err) {
        $reject.call(this, err);
      }
    };
    // eslint-disable-next-line no-unused-vars
    Internal = function Promise(executor) {
      this._c = [];             // <- awaiting reactions
      this._a = undefined;      // <- checked in isUnhandled reactions
      this._s = 0;              // <- state
      this._d = false;          // <- done
      this._v = undefined;      // <- value
      this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
      this._n = false;          // <- notify
    };
    Internal.prototype = _redefineAll($Promise.prototype, {
      // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
      then: function then(onFulfilled, onRejected) {
        var reaction = newPromiseCapability(_speciesConstructor(this, $Promise));
        reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
        reaction.fail = typeof onRejected == 'function' && onRejected;
        reaction.domain = isNode$1 ? process$2.domain : undefined;
        this._c.push(reaction);
        if (this._a) this._a.push(reaction);
        if (this._s) notify(this, false);
        return reaction.promise;
      },
      // 25.4.5.1 Promise.prototype.catch(onRejected)
      'catch': function (onRejected) {
        return this.then(undefined, onRejected);
      }
    });
    OwnPromiseCapability = function () {
      var promise = new Internal();
      this.promise = promise;
      this.resolve = _ctx($resolve, promise, 1);
      this.reject = _ctx($reject, promise, 1);
    };
    _newPromiseCapability.f = newPromiseCapability = function (C) {
      return C === $Promise || C === Wrapper
        ? new OwnPromiseCapability(C)
        : newGenericPromiseCapability(C);
    };
  }

  _export(_export.G + _export.W + _export.F * !USE_NATIVE$1, { Promise: $Promise });
  _setToStringTag($Promise, PROMISE);
  _setSpecies(PROMISE);
  Wrapper = _core[PROMISE];

  // statics
  _export(_export.S + _export.F * !USE_NATIVE$1, PROMISE, {
    // 25.4.4.5 Promise.reject(r)
    reject: function reject(r) {
      var capability = newPromiseCapability(this);
      var $$reject = capability.reject;
      $$reject(r);
      return capability.promise;
    }
  });
  _export(_export.S + _export.F * (_library || !USE_NATIVE$1), PROMISE, {
    // 25.4.4.6 Promise.resolve(x)
    resolve: function resolve(x) {
      return _promiseResolve(_library && this === Wrapper ? $Promise : this, x);
    }
  });
  _export(_export.S + _export.F * !(USE_NATIVE$1 && _iterDetect(function (iter) {
    $Promise.all(iter)['catch'](empty);
  })), PROMISE, {
    // 25.4.4.1 Promise.all(iterable)
    all: function all(iterable) {
      var C = this;
      var capability = newPromiseCapability(C);
      var resolve = capability.resolve;
      var reject = capability.reject;
      var result = _perform(function () {
        var values = [];
        var index = 0;
        var remaining = 1;
        _forOf(iterable, false, function (promise) {
          var $index = index++;
          var alreadyCalled = false;
          values.push(undefined);
          remaining++;
          C.resolve(promise).then(function (value) {
            if (alreadyCalled) return;
            alreadyCalled = true;
            values[$index] = value;
            --remaining || resolve(values);
          }, reject);
        });
        --remaining || resolve(values);
      });
      if (result.e) reject(result.v);
      return capability.promise;
    },
    // 25.4.4.4 Promise.race(iterable)
    race: function race(iterable) {
      var C = this;
      var capability = newPromiseCapability(C);
      var reject = capability.reject;
      var result = _perform(function () {
        _forOf(iterable, false, function (promise) {
          C.resolve(promise).then(capability.resolve, reject);
        });
      });
      if (result.e) reject(result.v);
      return capability.promise;
    }
  });

  var ITERATOR$4 = _wks('iterator');
  var TO_STRING_TAG = _wks('toStringTag');
  var ArrayValues = _iterators.Array;

  var DOMIterables = {
    CSSRuleList: true, // TODO: Not spec compliant, should be false.
    CSSStyleDeclaration: false,
    CSSValueList: false,
    ClientRectList: false,
    DOMRectList: false,
    DOMStringList: false,
    DOMTokenList: true,
    DataTransferItemList: false,
    FileList: false,
    HTMLAllCollection: false,
    HTMLCollection: false,
    HTMLFormElement: false,
    HTMLSelectElement: false,
    MediaList: true, // TODO: Not spec compliant, should be false.
    MimeTypeArray: false,
    NamedNodeMap: false,
    NodeList: true,
    PaintRequestList: false,
    Plugin: false,
    PluginArray: false,
    SVGLengthList: false,
    SVGNumberList: false,
    SVGPathSegList: false,
    SVGPointList: false,
    SVGStringList: false,
    SVGTransformList: false,
    SourceBufferList: false,
    StyleSheetList: true, // TODO: Not spec compliant, should be false.
    TextTrackCueList: false,
    TextTrackList: false,
    TouchList: false
  };

  for (var collections = _objectKeys(DOMIterables), i = 0; i < collections.length; i++) {
    var NAME$1 = collections[i];
    var explicit = DOMIterables[NAME$1];
    var Collection = _global[NAME$1];
    var proto = Collection && Collection.prototype;
    var key;
    if (proto) {
      if (!proto[ITERATOR$4]) _hide(proto, ITERATOR$4, ArrayValues);
      if (!proto[TO_STRING_TAG]) _hide(proto, TO_STRING_TAG, NAME$1);
      _iterators[NAME$1] = ArrayValues;
      if (explicit) for (key in es6_array_iterator) if (!proto[key]) _redefine(proto, key, es6_array_iterator[key], true);
    }
  }

  var max$1 = Math.max;
  var min$2 = Math.min;
  var floor$1 = Math.floor;
  var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
  var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;

  var maybeToString = function (it) {
    return it === undefined ? it : String(it);
  };

  // @@replace logic
  _fixReWks('replace', 2, function (defined, REPLACE, $replace, maybeCallNative) {
    return [
      // `String.prototype.replace` method
      // https://tc39.github.io/ecma262/#sec-string.prototype.replace
      function replace(searchValue, replaceValue) {
        var O = defined(this);
        var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
        return fn !== undefined
          ? fn.call(searchValue, O, replaceValue)
          : $replace.call(String(O), searchValue, replaceValue);
      },
      // `RegExp.prototype[@@replace]` method
      // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
      function (regexp, replaceValue) {
        var res = maybeCallNative($replace, regexp, this, replaceValue);
        if (res.done) return res.value;

        var rx = _anObject(regexp);
        var S = String(this);
        var functionalReplace = typeof replaceValue === 'function';
        if (!functionalReplace) replaceValue = String(replaceValue);
        var global = rx.global;
        if (global) {
          var fullUnicode = rx.unicode;
          rx.lastIndex = 0;
        }
        var results = [];
        while (true) {
          var result = _regexpExecAbstract(rx, S);
          if (result === null) break;
          results.push(result);
          if (!global) break;
          var matchStr = String(result[0]);
          if (matchStr === '') rx.lastIndex = _advanceStringIndex(S, _toLength(rx.lastIndex), fullUnicode);
        }
        var accumulatedResult = '';
        var nextSourcePosition = 0;
        for (var i = 0; i < results.length; i++) {
          result = results[i];
          var matched = String(result[0]);
          var position = max$1(min$2(_toInteger(result.index), S.length), 0);
          var captures = [];
          // NOTE: This is equivalent to
          //   captures = result.slice(1).map(maybeToString)
          // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
          // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
          // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
          for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
          var namedCaptures = result.groups;
          if (functionalReplace) {
            var replacerArgs = [matched].concat(captures, position, S);
            if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
            var replacement = String(replaceValue.apply(undefined, replacerArgs));
          } else {
            replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
          }
          if (position >= nextSourcePosition) {
            accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
            nextSourcePosition = position + matched.length;
          }
        }
        return accumulatedResult + S.slice(nextSourcePosition);
      }
    ];

      // https://tc39.github.io/ecma262/#sec-getsubstitution
    function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
      var tailPos = position + matched.length;
      var m = captures.length;
      var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
      if (namedCaptures !== undefined) {
        namedCaptures = _toObject(namedCaptures);
        symbols = SUBSTITUTION_SYMBOLS;
      }
      return $replace.call(replacement, symbols, function (match, ch) {
        var capture;
        switch (ch.charAt(0)) {
          case '$': return '$';
          case '&': return matched;
          case '`': return str.slice(0, position);
          case "'": return str.slice(tailPos);
          case '<':
            capture = namedCaptures[ch.slice(1, -1)];
            break;
          default: // \d\d?
            var n = +ch;
            if (n === 0) return match;
            if (n > m) {
              var f = floor$1(n / 10);
              if (f === 0) return match;
              if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
              return match;
            }
            capture = captures[n - 1];
        }
        return capture === undefined ? '' : capture;
      });
    }
  });

  // 21.2.5.3 get RegExp.prototype.flags()
  if (_descriptors && /./g.flags != 'g') _objectDp.f(RegExp.prototype, 'flags', {
    configurable: true,
    get: _flags
  });

  var TO_STRING = 'toString';
  var $toString = /./[TO_STRING];

  var define = function (fn) {
    _redefine(RegExp.prototype, TO_STRING, fn, true);
  };

  // 21.2.5.14 RegExp.prototype.toString()
  if (_fails(function () { return $toString.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
    define(function toString() {
      var R = _anObject(this);
      return '/'.concat(R.source, '/',
        'flags' in R ? R.flags : !_descriptors && R instanceof RegExp ? _flags.call(R) : undefined);
    });
  // FF44- RegExp#toString has a wrong name
  } else if ($toString.name != TO_STRING) {
    define(function toString() {
      return $toString.call(this);
    });
  }

  var TYPED = _uid('typed_array');
  var VIEW = _uid('view');
  var ABV = !!(_global.ArrayBuffer && _global.DataView);
  var CONSTR = ABV;
  var i$1 = 0;
  var l = 9;
  var Typed;

  var TypedArrayConstructors = (
    'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'
  ).split(',');

  while (i$1 < l) {
    if (Typed = _global[TypedArrayConstructors[i$1++]]) {
      _hide(Typed.prototype, TYPED, true);
      _hide(Typed.prototype, VIEW, true);
    } else CONSTR = false;
  }

  var _typed = {
    ABV: ABV,
    CONSTR: CONSTR,
    TYPED: TYPED,
    VIEW: VIEW
  };

  // https://tc39.github.io/ecma262/#sec-toindex


  var _toIndex = function (it) {
    if (it === undefined) return 0;
    var number = _toInteger(it);
    var length = _toLength(number);
    if (number !== length) throw RangeError('Wrong length!');
    return length;
  };

  var _typedBuffer = createCommonjsModule(function (module, exports) {











  var gOPN = _objectGopn.f;
  var dP = _objectDp.f;


  var ARRAY_BUFFER = 'ArrayBuffer';
  var DATA_VIEW = 'DataView';
  var PROTOTYPE = 'prototype';
  var WRONG_LENGTH = 'Wrong length!';
  var WRONG_INDEX = 'Wrong index!';
  var $ArrayBuffer = _global[ARRAY_BUFFER];
  var $DataView = _global[DATA_VIEW];
  var Math = _global.Math;
  var RangeError = _global.RangeError;
  // eslint-disable-next-line no-shadow-restricted-names
  var Infinity = _global.Infinity;
  var BaseBuffer = $ArrayBuffer;
  var abs = Math.abs;
  var pow = Math.pow;
  var floor = Math.floor;
  var log = Math.log;
  var LN2 = Math.LN2;
  var BUFFER = 'buffer';
  var BYTE_LENGTH = 'byteLength';
  var BYTE_OFFSET = 'byteOffset';
  var $BUFFER = _descriptors ? '_b' : BUFFER;
  var $LENGTH = _descriptors ? '_l' : BYTE_LENGTH;
  var $OFFSET = _descriptors ? '_o' : BYTE_OFFSET;

  // IEEE754 conversions based on https://github.com/feross/ieee754
  function packIEEE754(value, mLen, nBytes) {
    var buffer = new Array(nBytes);
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var rt = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0;
    var i = 0;
    var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
    var e, m, c;
    value = abs(value);
    // eslint-disable-next-line no-self-compare
    if (value != value || value === Infinity) {
      // eslint-disable-next-line no-self-compare
      m = value != value ? 1 : 0;
      e = eMax;
    } else {
      e = floor(log(value) / LN2);
      if (value * (c = pow(2, -e)) < 1) {
        e--;
        c *= 2;
      }
      if (e + eBias >= 1) {
        value += rt / c;
      } else {
        value += rt * pow(2, 1 - eBias);
      }
      if (value * c >= 2) {
        e++;
        c /= 2;
      }
      if (e + eBias >= eMax) {
        m = 0;
        e = eMax;
      } else if (e + eBias >= 1) {
        m = (value * c - 1) * pow(2, mLen);
        e = e + eBias;
      } else {
        m = value * pow(2, eBias - 1) * pow(2, mLen);
        e = 0;
      }
    }
    for (; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8);
    e = e << mLen | m;
    eLen += mLen;
    for (; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8);
    buffer[--i] |= s * 128;
    return buffer;
  }
  function unpackIEEE754(buffer, mLen, nBytes) {
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var nBits = eLen - 7;
    var i = nBytes - 1;
    var s = buffer[i--];
    var e = s & 127;
    var m;
    s >>= 7;
    for (; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8);
    m = e & (1 << -nBits) - 1;
    e >>= -nBits;
    nBits += mLen;
    for (; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8);
    if (e === 0) {
      e = 1 - eBias;
    } else if (e === eMax) {
      return m ? NaN : s ? -Infinity : Infinity;
    } else {
      m = m + pow(2, mLen);
      e = e - eBias;
    } return (s ? -1 : 1) * m * pow(2, e - mLen);
  }

  function unpackI32(bytes) {
    return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
  }
  function packI8(it) {
    return [it & 0xff];
  }
  function packI16(it) {
    return [it & 0xff, it >> 8 & 0xff];
  }
  function packI32(it) {
    return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
  }
  function packF64(it) {
    return packIEEE754(it, 52, 8);
  }
  function packF32(it) {
    return packIEEE754(it, 23, 4);
  }

  function addGetter(C, key, internal) {
    dP(C[PROTOTYPE], key, { get: function () { return this[internal]; } });
  }

  function get(view, bytes, index, isLittleEndian) {
    var numIndex = +index;
    var intIndex = _toIndex(numIndex);
    if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
    var store = view[$BUFFER]._b;
    var start = intIndex + view[$OFFSET];
    var pack = store.slice(start, start + bytes);
    return isLittleEndian ? pack : pack.reverse();
  }
  function set(view, bytes, index, conversion, value, isLittleEndian) {
    var numIndex = +index;
    var intIndex = _toIndex(numIndex);
    if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
    var store = view[$BUFFER]._b;
    var start = intIndex + view[$OFFSET];
    var pack = conversion(+value);
    for (var i = 0; i < bytes; i++) store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
  }

  if (!_typed.ABV) {
    $ArrayBuffer = function ArrayBuffer(length) {
      _anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
      var byteLength = _toIndex(length);
      this._b = _arrayFill.call(new Array(byteLength), 0);
      this[$LENGTH] = byteLength;
    };

    $DataView = function DataView(buffer, byteOffset, byteLength) {
      _anInstance(this, $DataView, DATA_VIEW);
      _anInstance(buffer, $ArrayBuffer, DATA_VIEW);
      var bufferLength = buffer[$LENGTH];
      var offset = _toInteger(byteOffset);
      if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset!');
      byteLength = byteLength === undefined ? bufferLength - offset : _toLength(byteLength);
      if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
      this[$BUFFER] = buffer;
      this[$OFFSET] = offset;
      this[$LENGTH] = byteLength;
    };

    if (_descriptors) {
      addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
      addGetter($DataView, BUFFER, '_b');
      addGetter($DataView, BYTE_LENGTH, '_l');
      addGetter($DataView, BYTE_OFFSET, '_o');
    }

    _redefineAll($DataView[PROTOTYPE], {
      getInt8: function getInt8(byteOffset) {
        return get(this, 1, byteOffset)[0] << 24 >> 24;
      },
      getUint8: function getUint8(byteOffset) {
        return get(this, 1, byteOffset)[0];
      },
      getInt16: function getInt16(byteOffset /* , littleEndian */) {
        var bytes = get(this, 2, byteOffset, arguments[1]);
        return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
      },
      getUint16: function getUint16(byteOffset /* , littleEndian */) {
        var bytes = get(this, 2, byteOffset, arguments[1]);
        return bytes[1] << 8 | bytes[0];
      },
      getInt32: function getInt32(byteOffset /* , littleEndian */) {
        return unpackI32(get(this, 4, byteOffset, arguments[1]));
      },
      getUint32: function getUint32(byteOffset /* , littleEndian */) {
        return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
      },
      getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
        return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
      },
      getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
        return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
      },
      setInt8: function setInt8(byteOffset, value) {
        set(this, 1, byteOffset, packI8, value);
      },
      setUint8: function setUint8(byteOffset, value) {
        set(this, 1, byteOffset, packI8, value);
      },
      setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
        set(this, 2, byteOffset, packI16, value, arguments[2]);
      },
      setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
        set(this, 2, byteOffset, packI16, value, arguments[2]);
      },
      setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
        set(this, 4, byteOffset, packI32, value, arguments[2]);
      },
      setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
        set(this, 4, byteOffset, packI32, value, arguments[2]);
      },
      setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
        set(this, 4, byteOffset, packF32, value, arguments[2]);
      },
      setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
        set(this, 8, byteOffset, packF64, value, arguments[2]);
      }
    });
  } else {
    if (!_fails(function () {
      $ArrayBuffer(1);
    }) || !_fails(function () {
      new $ArrayBuffer(-1); // eslint-disable-line no-new
    }) || _fails(function () {
      new $ArrayBuffer(); // eslint-disable-line no-new
      new $ArrayBuffer(1.5); // eslint-disable-line no-new
      new $ArrayBuffer(NaN); // eslint-disable-line no-new
      return $ArrayBuffer.name != ARRAY_BUFFER;
    })) {
      $ArrayBuffer = function ArrayBuffer(length) {
        _anInstance(this, $ArrayBuffer);
        return new BaseBuffer(_toIndex(length));
      };
      var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
      for (var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j;) {
        if (!((key = keys[j++]) in $ArrayBuffer)) _hide($ArrayBuffer, key, BaseBuffer[key]);
      }
      ArrayBufferProto.constructor = $ArrayBuffer;
    }
    // iOS Safari 7.x bug
    var view = new $DataView(new $ArrayBuffer(2));
    var $setInt8 = $DataView[PROTOTYPE].setInt8;
    view.setInt8(0, 2147483648);
    view.setInt8(1, 2147483649);
    if (view.getInt8(0) || !view.getInt8(1)) _redefineAll($DataView[PROTOTYPE], {
      setInt8: function setInt8(byteOffset, value) {
        $setInt8.call(this, byteOffset, value << 24 >> 24);
      },
      setUint8: function setUint8(byteOffset, value) {
        $setInt8.call(this, byteOffset, value << 24 >> 24);
      }
    }, true);
  }
  _setToStringTag($ArrayBuffer, ARRAY_BUFFER);
  _setToStringTag($DataView, DATA_VIEW);
  _hide($DataView[PROTOTYPE], _typed.VIEW, true);
  exports[ARRAY_BUFFER] = $ArrayBuffer;
  exports[DATA_VIEW] = $DataView;
  });

  var SPECIES$3 = _wks('species');

  var _arraySpeciesConstructor = function (original) {
    var C;
    if (_isArray(original)) {
      C = original.constructor;
      // cross-realm fallback
      if (typeof C == 'function' && (C === Array || _isArray(C.prototype))) C = undefined;
      if (_isObject(C)) {
        C = C[SPECIES$3];
        if (C === null) C = undefined;
      }
    } return C === undefined ? Array : C;
  };

  // 9.4.2.3 ArraySpeciesCreate(originalArray, length)


  var _arraySpeciesCreate = function (original, length) {
    return new (_arraySpeciesConstructor(original))(length);
  };

  // 0 -> Array#forEach
  // 1 -> Array#map
  // 2 -> Array#filter
  // 3 -> Array#some
  // 4 -> Array#every
  // 5 -> Array#find
  // 6 -> Array#findIndex





  var _arrayMethods = function (TYPE, $create) {
    var IS_MAP = TYPE == 1;
    var IS_FILTER = TYPE == 2;
    var IS_SOME = TYPE == 3;
    var IS_EVERY = TYPE == 4;
    var IS_FIND_INDEX = TYPE == 6;
    var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
    var create = $create || _arraySpeciesCreate;
    return function ($this, callbackfn, that) {
      var O = _toObject($this);
      var self = _iobject(O);
      var f = _ctx(callbackfn, that, 3);
      var length = _toLength(self.length);
      var index = 0;
      var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
      var val, res;
      for (;length > index; index++) if (NO_HOLES || index in self) {
        val = self[index];
        res = f(val, index, O);
        if (TYPE) {
          if (IS_MAP) result[index] = res;   // map
          else if (res) switch (TYPE) {
            case 3: return true;             // some
            case 5: return val;              // find
            case 6: return index;            // findIndex
            case 2: result.push(val);        // filter
          } else if (IS_EVERY) return false; // every
        }
      }
      return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
    };
  };

  var _arrayCopyWithin = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
    var O = _toObject(this);
    var len = _toLength(O.length);
    var to = _toAbsoluteIndex(target, len);
    var from = _toAbsoluteIndex(start, len);
    var end = arguments.length > 2 ? arguments[2] : undefined;
    var count = Math.min((end === undefined ? len : _toAbsoluteIndex(end, len)) - from, len - to);
    var inc = 1;
    if (from < to && to < from + count) {
      inc = -1;
      from += count - 1;
      to += count - 1;
    }
    while (count-- > 0) {
      if (from in O) O[to] = O[from];
      else delete O[to];
      to += inc;
      from += inc;
    } return O;
  };

  var _typedArray = createCommonjsModule(function (module) {
  if (_descriptors) {
    var LIBRARY = _library;
    var global = _global;
    var fails = _fails;
    var $export = _export;
    var $typed = _typed;
    var $buffer = _typedBuffer;
    var ctx = _ctx;
    var anInstance = _anInstance;
    var propertyDesc = _propertyDesc;
    var hide = _hide;
    var redefineAll = _redefineAll;
    var toInteger = _toInteger;
    var toLength = _toLength;
    var toIndex = _toIndex;
    var toAbsoluteIndex = _toAbsoluteIndex;
    var toPrimitive = _toPrimitive;
    var has = _has;
    var classof = _classof;
    var isObject = _isObject;
    var toObject = _toObject;
    var isArrayIter = _isArrayIter;
    var create = _objectCreate;
    var getPrototypeOf = _objectGpo;
    var gOPN = _objectGopn.f;
    var getIterFn = core_getIteratorMethod;
    var uid = _uid;
    var wks = _wks;
    var createArrayMethod = _arrayMethods;
    var createArrayIncludes = _arrayIncludes;
    var speciesConstructor = _speciesConstructor;
    var ArrayIterators = es6_array_iterator;
    var Iterators = _iterators;
    var $iterDetect = _iterDetect;
    var setSpecies = _setSpecies;
    var arrayFill = _arrayFill;
    var arrayCopyWithin = _arrayCopyWithin;
    var $DP = _objectDp;
    var $GOPD = _objectGopd;
    var dP = $DP.f;
    var gOPD = $GOPD.f;
    var RangeError = global.RangeError;
    var TypeError = global.TypeError;
    var Uint8Array = global.Uint8Array;
    var ARRAY_BUFFER = 'ArrayBuffer';
    var SHARED_BUFFER = 'Shared' + ARRAY_BUFFER;
    var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
    var PROTOTYPE = 'prototype';
    var ArrayProto = Array[PROTOTYPE];
    var $ArrayBuffer = $buffer.ArrayBuffer;
    var $DataView = $buffer.DataView;
    var arrayForEach = createArrayMethod(0);
    var arrayFilter = createArrayMethod(2);
    var arraySome = createArrayMethod(3);
    var arrayEvery = createArrayMethod(4);
    var arrayFind = createArrayMethod(5);
    var arrayFindIndex = createArrayMethod(6);
    var arrayIncludes = createArrayIncludes(true);
    var arrayIndexOf = createArrayIncludes(false);
    var arrayValues = ArrayIterators.values;
    var arrayKeys = ArrayIterators.keys;
    var arrayEntries = ArrayIterators.entries;
    var arrayLastIndexOf = ArrayProto.lastIndexOf;
    var arrayReduce = ArrayProto.reduce;
    var arrayReduceRight = ArrayProto.reduceRight;
    var arrayJoin = ArrayProto.join;
    var arraySort = ArrayProto.sort;
    var arraySlice = ArrayProto.slice;
    var arrayToString = ArrayProto.toString;
    var arrayToLocaleString = ArrayProto.toLocaleString;
    var ITERATOR = wks('iterator');
    var TAG = wks('toStringTag');
    var TYPED_CONSTRUCTOR = uid('typed_constructor');
    var DEF_CONSTRUCTOR = uid('def_constructor');
    var ALL_CONSTRUCTORS = $typed.CONSTR;
    var TYPED_ARRAY = $typed.TYPED;
    var VIEW = $typed.VIEW;
    var WRONG_LENGTH = 'Wrong length!';

    var $map = createArrayMethod(1, function (O, length) {
      return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
    });

    var LITTLE_ENDIAN = fails(function () {
      // eslint-disable-next-line no-undef
      return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
    });

    var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function () {
      new Uint8Array(1).set({});
    });

    var toOffset = function (it, BYTES) {
      var offset = toInteger(it);
      if (offset < 0 || offset % BYTES) throw RangeError('Wrong offset!');
      return offset;
    };

    var validate = function (it) {
      if (isObject(it) && TYPED_ARRAY in it) return it;
      throw TypeError(it + ' is not a typed array!');
    };

    var allocate = function (C, length) {
      if (!(isObject(C) && TYPED_CONSTRUCTOR in C)) {
        throw TypeError('It is not a typed array constructor!');
      } return new C(length);
    };

    var speciesFromList = function (O, list) {
      return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
    };

    var fromList = function (C, list) {
      var index = 0;
      var length = list.length;
      var result = allocate(C, length);
      while (length > index) result[index] = list[index++];
      return result;
    };

    var addGetter = function (it, key, internal) {
      dP(it, key, { get: function () { return this._d[internal]; } });
    };

    var $from = function from(source /* , mapfn, thisArg */) {
      var O = toObject(source);
      var aLen = arguments.length;
      var mapfn = aLen > 1 ? arguments[1] : undefined;
      var mapping = mapfn !== undefined;
      var iterFn = getIterFn(O);
      var i, length, values, result, step, iterator;
      if (iterFn != undefined && !isArrayIter(iterFn)) {
        for (iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++) {
          values.push(step.value);
        } O = values;
      }
      if (mapping && aLen > 2) mapfn = ctx(mapfn, arguments[2], 2);
      for (i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++) {
        result[i] = mapping ? mapfn(O[i], i) : O[i];
      }
      return result;
    };

    var $of = function of(/* ...items */) {
      var index = 0;
      var length = arguments.length;
      var result = allocate(this, length);
      while (length > index) result[index] = arguments[index++];
      return result;
    };

    // iOS Safari 6.x fails here
    var TO_LOCALE_BUG = !!Uint8Array && fails(function () { arrayToLocaleString.call(new Uint8Array(1)); });

    var $toLocaleString = function toLocaleString() {
      return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
    };

    var proto = {
      copyWithin: function copyWithin(target, start /* , end */) {
        return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
      },
      every: function every(callbackfn /* , thisArg */) {
        return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
      },
      fill: function fill(value /* , start, end */) { // eslint-disable-line no-unused-vars
        return arrayFill.apply(validate(this), arguments);
      },
      filter: function filter(callbackfn /* , thisArg */) {
        return speciesFromList(this, arrayFilter(validate(this), callbackfn,
          arguments.length > 1 ? arguments[1] : undefined));
      },
      find: function find(predicate /* , thisArg */) {
        return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
      },
      findIndex: function findIndex(predicate /* , thisArg */) {
        return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
      },
      forEach: function forEach(callbackfn /* , thisArg */) {
        arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
      },
      indexOf: function indexOf(searchElement /* , fromIndex */) {
        return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
      },
      includes: function includes(searchElement /* , fromIndex */) {
        return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
      },
      join: function join(separator) { // eslint-disable-line no-unused-vars
        return arrayJoin.apply(validate(this), arguments);
      },
      lastIndexOf: function lastIndexOf(searchElement /* , fromIndex */) { // eslint-disable-line no-unused-vars
        return arrayLastIndexOf.apply(validate(this), arguments);
      },
      map: function map(mapfn /* , thisArg */) {
        return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
      },
      reduce: function reduce(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
        return arrayReduce.apply(validate(this), arguments);
      },
      reduceRight: function reduceRight(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
        return arrayReduceRight.apply(validate(this), arguments);
      },
      reverse: function reverse() {
        var that = this;
        var length = validate(that).length;
        var middle = Math.floor(length / 2);
        var index = 0;
        var value;
        while (index < middle) {
          value = that[index];
          that[index++] = that[--length];
          that[length] = value;
        } return that;
      },
      some: function some(callbackfn /* , thisArg */) {
        return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
      },
      sort: function sort(comparefn) {
        return arraySort.call(validate(this), comparefn);
      },
      subarray: function subarray(begin, end) {
        var O = validate(this);
        var length = O.length;
        var $begin = toAbsoluteIndex(begin, length);
        return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(
          O.buffer,
          O.byteOffset + $begin * O.BYTES_PER_ELEMENT,
          toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - $begin)
        );
      }
    };

    var $slice = function slice(start, end) {
      return speciesFromList(this, arraySlice.call(validate(this), start, end));
    };

    var $set = function set(arrayLike /* , offset */) {
      validate(this);
      var offset = toOffset(arguments[1], 1);
      var length = this.length;
      var src = toObject(arrayLike);
      var len = toLength(src.length);
      var index = 0;
      if (len + offset > length) throw RangeError(WRONG_LENGTH);
      while (index < len) this[offset + index] = src[index++];
    };

    var $iterators = {
      entries: function entries() {
        return arrayEntries.call(validate(this));
      },
      keys: function keys() {
        return arrayKeys.call(validate(this));
      },
      values: function values() {
        return arrayValues.call(validate(this));
      }
    };

    var isTAIndex = function (target, key) {
      return isObject(target)
        && target[TYPED_ARRAY]
        && typeof key != 'symbol'
        && key in target
        && String(+key) == String(key);
    };
    var $getDesc = function getOwnPropertyDescriptor(target, key) {
      return isTAIndex(target, key = toPrimitive(key, true))
        ? propertyDesc(2, target[key])
        : gOPD(target, key);
    };
    var $setDesc = function defineProperty(target, key, desc) {
      if (isTAIndex(target, key = toPrimitive(key, true))
        && isObject(desc)
        && has(desc, 'value')
        && !has(desc, 'get')
        && !has(desc, 'set')
        // TODO: add validation descriptor w/o calling accessors
        && !desc.configurable
        && (!has(desc, 'writable') || desc.writable)
        && (!has(desc, 'enumerable') || desc.enumerable)
      ) {
        target[key] = desc.value;
        return target;
      } return dP(target, key, desc);
    };

    if (!ALL_CONSTRUCTORS) {
      $GOPD.f = $getDesc;
      $DP.f = $setDesc;
    }

    $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
      getOwnPropertyDescriptor: $getDesc,
      defineProperty: $setDesc
    });

    if (fails(function () { arrayToString.call({}); })) {
      arrayToString = arrayToLocaleString = function toString() {
        return arrayJoin.call(this);
      };
    }

    var $TypedArrayPrototype$ = redefineAll({}, proto);
    redefineAll($TypedArrayPrototype$, $iterators);
    hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
    redefineAll($TypedArrayPrototype$, {
      slice: $slice,
      set: $set,
      constructor: function () { /* noop */ },
      toString: arrayToString,
      toLocaleString: $toLocaleString
    });
    addGetter($TypedArrayPrototype$, 'buffer', 'b');
    addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
    addGetter($TypedArrayPrototype$, 'byteLength', 'l');
    addGetter($TypedArrayPrototype$, 'length', 'e');
    dP($TypedArrayPrototype$, TAG, {
      get: function () { return this[TYPED_ARRAY]; }
    });

    // eslint-disable-next-line max-statements
    module.exports = function (KEY, BYTES, wrapper, CLAMPED) {
      CLAMPED = !!CLAMPED;
      var NAME = KEY + (CLAMPED ? 'Clamped' : '') + 'Array';
      var GETTER = 'get' + KEY;
      var SETTER = 'set' + KEY;
      var TypedArray = global[NAME];
      var Base = TypedArray || {};
      var TAC = TypedArray && getPrototypeOf(TypedArray);
      var FORCED = !TypedArray || !$typed.ABV;
      var O = {};
      var TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
      var getter = function (that, index) {
        var data = that._d;
        return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
      };
      var setter = function (that, index, value) {
        var data = that._d;
        if (CLAMPED) value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
        data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
      };
      var addElement = function (that, index) {
        dP(that, index, {
          get: function () {
            return getter(this, index);
          },
          set: function (value) {
            return setter(this, index, value);
          },
          enumerable: true
        });
      };
      if (FORCED) {
        TypedArray = wrapper(function (that, data, $offset, $length) {
          anInstance(that, TypedArray, NAME, '_d');
          var index = 0;
          var offset = 0;
          var buffer, byteLength, length, klass;
          if (!isObject(data)) {
            length = toIndex(data);
            byteLength = length * BYTES;
            buffer = new $ArrayBuffer(byteLength);
          } else if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
            buffer = data;
            offset = toOffset($offset, BYTES);
            var $len = data.byteLength;
            if ($length === undefined) {
              if ($len % BYTES) throw RangeError(WRONG_LENGTH);
              byteLength = $len - offset;
              if (byteLength < 0) throw RangeError(WRONG_LENGTH);
            } else {
              byteLength = toLength($length) * BYTES;
              if (byteLength + offset > $len) throw RangeError(WRONG_LENGTH);
            }
            length = byteLength / BYTES;
          } else if (TYPED_ARRAY in data) {
            return fromList(TypedArray, data);
          } else {
            return $from.call(TypedArray, data);
          }
          hide(that, '_d', {
            b: buffer,
            o: offset,
            l: byteLength,
            e: length,
            v: new $DataView(buffer)
          });
          while (index < length) addElement(that, index++);
        });
        TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
        hide(TypedArrayPrototype, 'constructor', TypedArray);
      } else if (!fails(function () {
        TypedArray(1);
      }) || !fails(function () {
        new TypedArray(-1); // eslint-disable-line no-new
      }) || !$iterDetect(function (iter) {
        new TypedArray(); // eslint-disable-line no-new
        new TypedArray(null); // eslint-disable-line no-new
        new TypedArray(1.5); // eslint-disable-line no-new
        new TypedArray(iter); // eslint-disable-line no-new
      }, true)) {
        TypedArray = wrapper(function (that, data, $offset, $length) {
          anInstance(that, TypedArray, NAME);
          var klass;
          // `ws` module bug, temporarily remove validation length for Uint8Array
          // https://github.com/websockets/ws/pull/645
          if (!isObject(data)) return new Base(toIndex(data));
          if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
            return $length !== undefined
              ? new Base(data, toOffset($offset, BYTES), $length)
              : $offset !== undefined
                ? new Base(data, toOffset($offset, BYTES))
                : new Base(data);
          }
          if (TYPED_ARRAY in data) return fromList(TypedArray, data);
          return $from.call(TypedArray, data);
        });
        arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function (key) {
          if (!(key in TypedArray)) hide(TypedArray, key, Base[key]);
        });
        TypedArray[PROTOTYPE] = TypedArrayPrototype;
        if (!LIBRARY) TypedArrayPrototype.constructor = TypedArray;
      }
      var $nativeIterator = TypedArrayPrototype[ITERATOR];
      var CORRECT_ITER_NAME = !!$nativeIterator
        && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined);
      var $iterator = $iterators.values;
      hide(TypedArray, TYPED_CONSTRUCTOR, true);
      hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
      hide(TypedArrayPrototype, VIEW, true);
      hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

      if (CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)) {
        dP(TypedArrayPrototype, TAG, {
          get: function () { return NAME; }
        });
      }

      O[NAME] = TypedArray;

      $export($export.G + $export.W + $export.F * (TypedArray != Base), O);

      $export($export.S, NAME, {
        BYTES_PER_ELEMENT: BYTES
      });

      $export($export.S + $export.F * fails(function () { Base.of.call(TypedArray, 1); }), NAME, {
        from: $from,
        of: $of
      });

      if (!(BYTES_PER_ELEMENT in TypedArrayPrototype)) hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);

      $export($export.P, NAME, proto);

      setSpecies(NAME);

      $export($export.P + $export.F * FORCED_SET, NAME, { set: $set });

      $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);

      if (!LIBRARY && TypedArrayPrototype.toString != arrayToString) TypedArrayPrototype.toString = arrayToString;

      $export($export.P + $export.F * fails(function () {
        new TypedArray(1).slice();
      }), NAME, { slice: $slice });

      $export($export.P + $export.F * (fails(function () {
        return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString();
      }) || !fails(function () {
        TypedArrayPrototype.toLocaleString.call([1, 2]);
      })), NAME, { toLocaleString: $toLocaleString });

      Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
      if (!LIBRARY && !CORRECT_ITER_NAME) hide(TypedArrayPrototype, ITERATOR, $iterator);
    };
  } else module.exports = function () { /* empty */ };
  });

  _typedArray('Uint8', 1, function (init) {
    return function Uint8Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  function PrepareBuffer(buffer) {
    if (typeof Buffer !== "undefined") {
      return new Uint8Array(buffer);
    } else {
      return new Uint8Array(buffer instanceof ArrayBuffer ? buffer : buffer.buffer);
    }
  }

  var Convert =
  /*#__PURE__*/
  function () {
    function Convert() {
      _classCallCheck(this, Convert);
    }

    _createClass(Convert, null, [{
      key: "ToString",
      value: function ToString(buffer) {
        var enc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "utf8";
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
            throw new Error("Unknown type of encoding '".concat(enc, "'"));
        }
      }
    }, {
      key: "FromString",
      value: function FromString(str) {
        var enc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "utf8";

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
            throw new Error("Unknown type of encoding '".concat(enc, "'"));
        }
      }
    }, {
      key: "ToBase64",
      value: function ToBase64(buffer) {
        var buf = PrepareBuffer(buffer);

        if (typeof btoa !== "undefined") {
          var binary = this.ToString(buf, "binary");
          return btoa(binary);
        } else {
          return Buffer.from(buf).toString("base64");
        }
      }
    }, {
      key: "FromBase64",
      value: function FromBase64(base64Text) {
        base64Text = base64Text.replace(/\n/g, "").replace(/\r/g, "").replace(/\t/g, "").replace(/\s/g, "");

        if (typeof atob !== "undefined") {
          return this.FromBinary(atob(base64Text));
        } else {
          return new Uint8Array(Buffer.from(base64Text, "base64")).buffer;
        }
      }
    }, {
      key: "FromBase64Url",
      value: function FromBase64Url(base64url) {
        return this.FromBase64(this.Base64Padding(base64url.replace(/\-/g, "+").replace(/\_/g, "/")));
      }
    }, {
      key: "ToBase64Url",
      value: function ToBase64Url(data) {
        return this.ToBase64(data).replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, "");
      }
    }, {
      key: "FromUtf8String",
      value: function FromUtf8String(text) {
        var s = unescape(encodeURIComponent(text));
        var uintArray = new Uint8Array(s.length);

        for (var i = 0; i < s.length; i++) {
          uintArray[i] = s.charCodeAt(i);
        }

        return uintArray.buffer;
      }
    }, {
      key: "ToUtf8String",
      value: function ToUtf8String(buffer) {
        var buf = PrepareBuffer(buffer);
        var encodedString = String.fromCharCode.apply(null, buf);
        var decodedString = decodeURIComponent(escape(encodedString));
        return decodedString;
      }
    }, {
      key: "FromBinary",
      value: function FromBinary(text) {
        var stringLength = text.length;
        var resultView = new Uint8Array(stringLength);

        for (var i = 0; i < stringLength; i++) {
          resultView[i] = text.charCodeAt(i);
        }

        return resultView.buffer;
      }
    }, {
      key: "ToBinary",
      value: function ToBinary(buffer) {
        var buf = PrepareBuffer(buffer);
        var resultString = "";
        var len = buf.length;

        for (var i = 0; i < len; i++) {
          resultString = resultString + String.fromCharCode(buf[i]);
        }

        return resultString;
      }
    }, {
      key: "ToHex",
      value: function ToHex(buffer) {
        var buf = PrepareBuffer(buffer);
        var splitter = "";
        var res = [];
        var len = buf.length;

        for (var i = 0; i < len; i++) {
          var char = buf[i].toString(16);
          res.push(char.length === 1 ? "0" + char : char);
        }

        return res.join(splitter);
      }
    }, {
      key: "FromHex",
      value: function FromHex(hexString) {
        var res = new Uint8Array(hexString.length / 2);

        for (var i = 0; i < hexString.length; i = i + 2) {
          var c = hexString.slice(i, i + 2);
          res[i / 2] = parseInt(c, 16);
        }

        return res.buffer;
      }
    }, {
      key: "Base64Padding",
      value: function Base64Padding(base64) {
        var padCount = 4 - base64.length % 4;

        if (padCount < 4) {
          for (var i = 0; i < padCount; i++) {
            base64 += "=";
          }
        }

        return base64;
      }
    }]);

    return Convert;
  }();

  function assign(target) {
    for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      sources[_key - 1] = arguments[_key];
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
    for (var _len2 = arguments.length, buf = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      buf[_key2] = arguments[_key2];
    }

    var totalByteLength = buf.map(function (item) {
      return item.byteLength;
    }).reduce(function (prev, cur) {
      return prev + cur;
    });
    var res = new Uint8Array(totalByteLength);
    var currentPos = 0;
    buf.map(function (item) {
      return new Uint8Array(item);
    }).forEach(function (arr) {
      for (var i = 0; i < arr.length; i++) {
        res[currentPos++] = arr[i];
      }
    });
    return res.buffer;
  }

  function _isEqual(bytes1, bytes2) {
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
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
      if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  }

  function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }

      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }

      function step(result) {
        result.done ? resolve(result.value) : new P(function (resolve) {
          resolve(result.value);
        }).then(fulfilled, rejected);
      }

      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }

  function __generator(thisArg, body) {
    var _ = {
      label: 0,
      sent: function sent() {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    },
        f,
        y,
        t,
        g;
    return g = {
      next: verb(0),
      "throw": verb(1),
      "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
      return this;
    }), g;

    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }

    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");

      while (_) {
        try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];

          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;

            case 4:
              _.label++;
              return {
                value: op[1],
                done: false
              };

            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;

            case 7:
              op = _.ops.pop();

              _.trys.pop();

              continue;

            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }

              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }

              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }

              if (t && _.label < t[2]) {
                _.label = t[2];

                _.ops.push(op);

                break;
              }

              if (t[2]) _.ops.pop();

              _.trys.pop();

              continue;
          }

          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      }

      if (op[0] & 5) throw op[1];
      return {
        value: op[0] ? op[1] : void 0,
        done: true
      };
    }
  }

  var ArrayBufferConverter = function () {
    function ArrayBufferConverter() {}

    ArrayBufferConverter.set = function (value) {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [2
          /*return*/
          , new Uint8Array(value)];
        });
      });
    };

    ArrayBufferConverter.get = function (value) {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [2
          /*return*/
          , new Uint8Array(value).buffer];
        });
      });
    };

    return ArrayBufferConverter;
  }();

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
        } else if (item.required) {
          rule = "required";
        }

        scheme.add(new protobufjs.Field(item.name, item.id, item.type, rule));
      }

      t.protobuf = scheme;
    };
  }

  function defineProperty$1(target, key, params) {
    var propertyKey = "_" + key;
    var opt = {
      set: function set(v) {
        if (this[propertyKey] !== v) {
          this.raw = null;
          this[propertyKey] = v;
        }
      },
      get: function get() {
        if (this[propertyKey] === void 0) {
          var defaultValue = params.defaultValue;

          if (params.parser && !params.repeated) {
            defaultValue = new params.parser();
          }

          this[propertyKey] = defaultValue;
        }

        return this[propertyKey];
      },
      enumerable: true
    };
    Object.defineProperty(target, propertyKey, {
      writable: true,
      enumerable: false
    });
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
        parser: params.parser || null
      };
      params.name = params.name || key;
      t.items[key].name = params.name;
      t.items[key].required = params.required || false;
      t.items[key].repeated = params.repeated || false;
      defineProperty$1(target, key, t.items[key]);
    };
  }

  var ObjectProto$2 = function () {
    function ObjectProto() {}

    ObjectProto.importProto = function (data) {
      return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              res = new this();
              return [4
              /*yield*/
              , res.importProto(data)];

            case 1:
              _a.sent();

              return [2
              /*return*/
              , res];
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
            return that[key].some(function (arrayItem) {
              return arrayItem.hasChanged();
            });
          }
        } else {
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
              if (!(data instanceof ObjectProto)) return [3
              /*break*/
              , 2];
              return [4
              /*yield*/
              , data.exportProto()];

            case 1:
              raw = _j.sent();
              return [3
              /*break*/
              , 3];

            case 2:
              raw = data;
              _j.label = 3;

            case 3:
              try {
                scheme = thisStatic.protobuf.decode(new Uint8Array(raw));
              } catch (e) {
                throw new Error("Error: Cannot decode message for " + thisStatic.localName + ".\n$ProtobufError: " + e.message);
              }

              _a = [];

              for (_b in thisStatic.items) {
                _a.push(_b);
              }

              _i = 0;
              _j.label = 4;

            case 4:
              if (!(_i < _a.length)) return [3
              /*break*/
              , 11];
              key = _a[_i];
              item = thisStatic.items[key];
              schemeValues = scheme[item.name];

              if (ArrayBuffer.isView(schemeValues)) {
                schemeValues = new Uint8Array(schemeValues);
              }

              if (!Array.isArray(schemeValues)) {
                if (item.repeated) {
                  that[key] = schemeValues = [];
                } else {
                  schemeValues = [schemeValues];
                }
              }

              if (item.repeated && !that[key]) {
                that[key] = [];
              }

              _c = 0, schemeValues_1 = schemeValues;
              _j.label = 5;

            case 5:
              if (!(_c < schemeValues_1.length)) return [3
              /*break*/
              , 10];
              schemeValue = schemeValues_1[_c];
              if (!item.repeated) return [3
              /*break*/
              , 7];
              _e = (_d = that[key]).push;
              return [4
              /*yield*/
              , this.importItem(item, schemeValue)];

            case 6:
              _e.apply(_d, [_j.sent()]);

              return [3
              /*break*/
              , 9];

            case 7:
              _g = that;
              _h = key;
              return [4
              /*yield*/
              , this.importItem(item, schemeValue)];

            case 8:
              _g[_h] = _j.sent();
              _j.label = 9;

            case 9:
              _c++;
              return [3
              /*break*/
              , 5];

            case 10:
              _i++;
              return [3
              /*break*/
              , 4];

            case 11:
              this.raw = raw;
              return [2
              /*return*/
              ];
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
                return [2
                /*return*/
                , this.raw];
              }

              thisStatic = this.constructor;
              that = this;
              protobuf = {};
              _a = [];

              for (_b in thisStatic.items) {
                _a.push(_b);
              }

              _i = 0;
              _d.label = 1;

            case 1:
              if (!(_i < _a.length)) return [3
              /*break*/
              , 6];
              key = _a[_i];
              item = thisStatic.items[key];
              values = that[key];

              if (!Array.isArray(values)) {
                values = values === void 0 ? [] : [values];
              }

              _c = 0, values_1 = values;
              _d.label = 2;

            case 2:
              if (!(_c < values_1.length)) return [3
              /*break*/
              , 5];
              value = values_1[_c];
              return [4
              /*yield*/
              , this.exportItem(item, value)];

            case 3:
              protobufValue = _d.sent();

              if (item.repeated) {
                if (!protobuf[item.name]) {
                  protobuf[item.name] = [];
                }

                protobuf[item.name].push(protobufValue);
              } else {
                protobuf[item.name] = protobufValue;
              }

              _d.label = 4;

            case 4:
              _c++;
              return [3
              /*break*/
              , 2];

            case 5:
              _i++;
              return [3
              /*break*/
              , 1];

            case 6:
              this.raw = new Uint8Array(thisStatic.protobuf.encode(protobuf).finish()).buffer;
              return [2
              /*return*/
              , this.raw];
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
              if (!template.parser) return [3
              /*break*/
              , 2];
              obj = value;
              return [4
              /*yield*/
              , obj.exportProto()];

            case 1:
              raw = _a.sent();

              if (template.required && !raw) {
                throw new Error("Error: Paramter '" + template.name + "' is required in '" + thisStatic.localName + "' protobuf message.");
              }

              if (raw) {
                result = new Uint8Array(raw);
              }

              return [3
              /*break*/
              , 6];

            case 2:
              if (template.required && value === void 0) {
                throw new Error("Error: Paramter '" + template.name + "' is required in '" + thisStatic.localName + "' protobuf message.");
              }

              if (!template.converter) return [3
              /*break*/
              , 5];
              if (!value) return [3
              /*break*/
              , 4];
              return [4
              /*yield*/
              , template.converter.set(value)];

            case 3:
              result = _a.sent();
              _a.label = 4;

            case 4:
              return [3
              /*break*/
              , 6];

            case 5:
              if (value instanceof ArrayBuffer) {
                value = new Uint8Array(value);
              }

              result = value;
              _a.label = 6;

            case 6:
              return [2
              /*return*/
              , result];
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
              if (!template.parser) return [3
              /*break*/
              , 4];
              parser = template.parser;
              if (!(value && value.byteLength)) return [3
              /*break*/
              , 2];
              return [4
              /*yield*/
              , parser.importProto(new Uint8Array(value).buffer)];

            case 1:
              result = _a.sent();
              return [3
              /*break*/
              , 3];

            case 2:
              if (template.required) {
                throw new Error("Error: Parameter '" + template.name + "' is required in '" + thisStatic.localName + "' protobuf message.");
              }

              _a.label = 3;

            case 3:
              return [3
              /*break*/
              , 9];

            case 4:
              if (!template.converter) return [3
              /*break*/
              , 8];
              if (!(value && value.byteLength)) return [3
              /*break*/
              , 6];
              return [4
              /*yield*/
              , template.converter.get(value)];

            case 5:
              result = _a.sent();
              return [3
              /*break*/
              , 7];

            case 6:
              if (template.required) {
                throw new Error("Error: Parameter '" + template.name + "' is required in '" + thisStatic.localName + "' protobuf message.");
              }

              _a.label = 7;

            case 7:
              return [3
              /*break*/
              , 9];

            case 8:
              result = value;
              _a.label = 9;

            case 9:
              return [2
              /*return*/
              , result];
          }
        });
      });
    };

    return ObjectProto;
  }();

  var domain; // This constructor is used to store event handlers. Instantiating this is
  // faster than explicitly calling `Object.create(null)` to get a "clean" empty
  // object (tested with v8 v4.9).

  function EventHandlers() {}

  EventHandlers.prototype = Object.create(null);

  function EventEmitter() {
    EventEmitter.init.call(this);
  } // nodejs oddity
  // require('events') === require('events').EventEmitter


  EventEmitter.EventEmitter = EventEmitter;
  EventEmitter.usingDomains = false;
  EventEmitter.prototype.domain = undefined;
  EventEmitter.prototype._events = undefined;
  EventEmitter.prototype._maxListeners = undefined; // By default EventEmitters will print a warning if more than 10 listeners are
  // added to it. This is a useful default which helps finding memory leaks.

  EventEmitter.defaultMaxListeners = 10;

  EventEmitter.init = function () {
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
  }; // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.


  EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
    if (typeof n !== 'number' || n < 0 || isNaN(n)) throw new TypeError('"n" argument must be a positive number');
    this._maxListeners = n;
    return this;
  };

  function $getMaxListeners(that) {
    if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
    return that._maxListeners;
  }

  EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
    return $getMaxListeners(this);
  }; // These standalone emit* functions are used to optimize calling of event
  // handlers for fast cases because emit() itself often has a variable number of
  // arguments and can be deoptimized because of that. These functions always have
  // the same number of arguments and thus do not get deoptimized, so the code
  // inside them can execute faster.


  function emitNone(handler, isFn, self) {
    if (isFn) handler.call(self);else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);

      for (var i = 0; i < len; ++i) {
        listeners[i].call(self);
      }
    }
  }

  function emitOne(handler, isFn, self, arg1) {
    if (isFn) handler.call(self, arg1);else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);

      for (var i = 0; i < len; ++i) {
        listeners[i].call(self, arg1);
      }
    }
  }

  function emitTwo(handler, isFn, self, arg1, arg2) {
    if (isFn) handler.call(self, arg1, arg2);else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);

      for (var i = 0; i < len; ++i) {
        listeners[i].call(self, arg1, arg2);
      }
    }
  }

  function emitThree(handler, isFn, self, arg1, arg2, arg3) {
    if (isFn) handler.call(self, arg1, arg2, arg3);else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);

      for (var i = 0; i < len; ++i) {
        listeners[i].call(self, arg1, arg2, arg3);
      }
    }
  }

  function emitMany(handler, isFn, self, args) {
    if (isFn) handler.apply(self, args);else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);

      for (var i = 0; i < len; ++i) {
        listeners[i].apply(self, args);
      }
    }
  }

  EventEmitter.prototype.emit = function emit(type) {
    var er, handler, len, args, i, events, domain;
    var doError = type === 'error';
    events = this._events;
    if (events) doError = doError && events.error == null;else if (!doError) return false;
    domain = this.domain; // If there is no 'error' event listener then throw.

    if (doError) {
      er = arguments[1];

      if (domain) {
        if (!er) er = new Error('Uncaught, unspecified "error" event');
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
    if (!handler) return false;
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

        for (i = 1; i < len; i++) {
          args[i - 1] = arguments[i];
        }

        emitMany(handler, isFn, this, args);
    }

    return true;
  };

  function _addListener(target, type, listener, prepend) {
    var m;
    var events;
    var existing;
    if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');
    events = target._events;

    if (!events) {
      events = target._events = new EventHandlers();
      target._eventsCount = 0;
    } else {
      // To avoid recursion in the case that type === "newListener"! Before
      // adding it to the listeners, first emit "newListener".
      if (events.newListener) {
        target.emit('newListener', type, listener.listener ? listener.listener : listener); // Re-assign `events` because a newListener handler could have caused the
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
        existing = events[type] = prepend ? [listener, existing] : [existing, listener];
      } else {
        // If we've already got an array, just append.
        if (prepend) {
          existing.unshift(listener);
        } else {
          existing.push(listener);
        }
      } // Check for listener leak


      if (!existing.warned) {
        m = $getMaxListeners(target);

        if (m && m > 0 && existing.length > m) {
          existing.warned = true;
          var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + type + ' listeners added. ' + 'Use emitter.setMaxListeners() to increase limit');
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

  EventEmitter.prototype.prependListener = function prependListener(type, listener) {
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
    if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');
    this.on(type, _onceWrap(this, type, listener));
    return this;
  };

  EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
    if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');
    this.prependListener(type, _onceWrap(this, type, listener));
    return this;
  }; // emits a 'removeListener' event iff the listener was removed


  EventEmitter.prototype.removeListener = function removeListener(type, listener) {
    var list, events, position, i, originalListener;
    if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');
    events = this._events;
    if (!events) return this;
    list = events[type];
    if (!list) return this;

    if (list === listener || list.listener && list.listener === listener) {
      if (--this._eventsCount === 0) this._events = new EventHandlers();else {
        delete events[type];
        if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
      }
    } else if (typeof list !== 'function') {
      position = -1;

      for (i = list.length; i-- > 0;) {
        if (list[i] === listener || list[i].listener && list[i].listener === listener) {
          originalListener = list[i].listener;
          position = i;
          break;
        }
      }

      if (position < 0) return this;

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

      if (events.removeListener) this.emit('removeListener', type, originalListener || listener);
    }

    return this;
  };

  EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
    var listeners, events;
    events = this._events;
    if (!events) return this; // not listening for removeListener, no need to emit

    if (!events.removeListener) {
      if (arguments.length === 0) {
        this._events = new EventHandlers();
        this._eventsCount = 0;
      } else if (events[type]) {
        if (--this._eventsCount === 0) this._events = new EventHandlers();else delete events[type];
      }

      return this;
    } // emit removeListener for all listeners on all events


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
    if (!events) ret = [];else {
      evlistener = events[type];
      if (!evlistener) ret = [];else if (typeof evlistener === 'function') ret = [evlistener.listener || evlistener];else ret = unwrapListeners(evlistener);
    }
    return ret;
  };

  EventEmitter.listenerCount = function (emitter, type) {
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
  }; // About 1.5x faster than the two-arg version of Array#splice().


  function spliceOne(list, index) {
    for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) {
      list[i] = list[k];
    }

    list.pop();
  }

  function arrayClone(arr, i) {
    var copy = new Array(i);

    while (i--) {
      copy[i] = arr[i];
    }

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


  var SIGN_ALGORITHM_NAME = "ECDSA";
  var DH_ALGORITHM_NAME = "ECDH";
  var SECRET_KEY_NAME = "AES-CBC";
  var HASH_NAME = "SHA-256";
  var HMAC_NAME = "HMAC";
  var MAX_RATCHET_STACK_SIZE = 20;
  var INFO_TEXT = Convert.FromBinary("InfoText");
  var INFO_RATCHET = Convert.FromBinary("InfoRatchet");
  var INFO_MESSAGE_KEYS = Convert.FromBinary("InfoMessageKeys");
  var engine = null;

  if (typeof self !== "undefined") {
    engine = {
      crypto: self.crypto,
      name: "WebCrypto"
    };
  }

  function setEngine(name, crypto) {
    engine = {
      crypto: crypto,
      name: name
    };
  }

  function getEngine() {
    if (!engine) {
      throw new Error("WebCrypto engine is empty. Use setEngine to resolve it.");
    }

    return engine;
  }

  var Curve =
  /*#__PURE__*/
  function () {
    function Curve() {
      _classCallCheck(this, Curve);
    }

    _createClass(Curve, null, [{
      key: "generateKeyPair",
      value: function () {
        var _generateKeyPair = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee(type) {
          var name, usage, keys, publicKey, res;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  name = type;
                  usage = type === "ECDSA" ? ["sign", "verify"] : ["deriveKey", "deriveBits"];
                  _context.next = 4;
                  return getEngine().crypto.subtle.generateKey({
                    name: name,
                    namedCurve: this.NAMED_CURVE
                  }, false, usage);

                case 4:
                  keys = _context.sent;
                  _context.next = 7;
                  return ECPublicKey.create(keys.publicKey);

                case 7:
                  publicKey = _context.sent;
                  res = {
                    privateKey: keys.privateKey,
                    publicKey: publicKey
                  };
                  return _context.abrupt("return", res);

                case 10:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function generateKeyPair(_x) {
          return _generateKeyPair.apply(this, arguments);
        }

        return generateKeyPair;
      }()
    }, {
      key: "deriveBytes",
      value: function deriveBytes(privateKey, publicKey) {
        return getEngine().crypto.subtle.deriveBits({
          name: "ECDH",
          public: publicKey.key
        }, privateKey, 256);
      }
    }, {
      key: "verify",
      value: function verify(signingKey, message, signature) {
        return getEngine().crypto.subtle.verify({
          name: "ECDSA",
          hash: this.DIGEST_ALGORITHM
        }, signingKey.key, signature, message);
      }
    }, {
      key: "sign",
      value: function () {
        var _sign = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee2(signingKey, message) {
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  return _context2.abrupt("return", getEngine().crypto.subtle.sign({
                    name: "ECDSA",
                    hash: this.DIGEST_ALGORITHM
                  }, signingKey, message));

                case 1:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function sign(_x2, _x3) {
          return _sign.apply(this, arguments);
        }

        return sign;
      }()
    }, {
      key: "ecKeyPairToJson",
      value: function () {
        var _ecKeyPairToJson = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee3(key) {
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.t0 = key.privateKey;
                  _context3.t1 = key.publicKey.key;
                  _context3.next = 4;
                  return key.publicKey.thumbprint();

                case 4:
                  _context3.t2 = _context3.sent;
                  return _context3.abrupt("return", {
                    privateKey: _context3.t0,
                    publicKey: _context3.t1,
                    thumbprint: _context3.t2
                  });

                case 6:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function ecKeyPairToJson(_x4) {
          return _ecKeyPairToJson.apply(this, arguments);
        }

        return ecKeyPairToJson;
      }()
    }, {
      key: "ecKeyPairFromJson",
      value: function () {
        var _ecKeyPairFromJson = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee4(keys) {
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.t0 = keys.privateKey;
                  _context4.next = 3;
                  return ECPublicKey.create(keys.publicKey);

                case 3:
                  _context4.t1 = _context4.sent;
                  return _context4.abrupt("return", {
                    privateKey: _context4.t0,
                    publicKey: _context4.t1
                  });

                case 5:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        }));

        function ecKeyPairFromJson(_x5) {
          return _ecKeyPairFromJson.apply(this, arguments);
        }

        return ecKeyPairFromJson;
      }()
    }]);

    return Curve;
  }();

  Curve.NAMED_CURVE = "P-256";
  Curve.DIGEST_ALGORITHM = "SHA-512";
  var AES_ALGORITHM = {
    name: "AES-CBC",
    length: 256
  };

  var Secret =
  /*#__PURE__*/
  function () {
    function Secret() {
      _classCallCheck(this, Secret);
    }

    _createClass(Secret, null, [{
      key: "randomBytes",
      value: function randomBytes(size) {
        var array = new Uint8Array(size);
        getEngine().crypto.getRandomValues(array);
        return array.buffer;
      }
    }, {
      key: "digest",
      value: function digest(alg, message) {
        return getEngine().crypto.subtle.digest(alg, message);
      }
    }, {
      key: "encrypt",
      value: function encrypt(key, data, iv) {
        return getEngine().crypto.subtle.encrypt({
          name: SECRET_KEY_NAME,
          iv: new Uint8Array(iv)
        }, key, data);
      }
    }, {
      key: "decrypt",
      value: function decrypt(key, data, iv) {
        return getEngine().crypto.subtle.decrypt({
          name: SECRET_KEY_NAME,
          iv: new Uint8Array(iv)
        }, key, data);
      }
    }, {
      key: "importHMAC",
      value: function importHMAC(raw) {
        return getEngine().crypto.subtle.importKey("raw", raw, {
          name: HMAC_NAME,
          hash: {
            name: HASH_NAME
          }
        }, false, ["sign", "verify"]);
      }
    }, {
      key: "importAES",
      value: function importAES(raw) {
        return getEngine().crypto.subtle.importKey("raw", raw, AES_ALGORITHM, false, ["encrypt", "decrypt"]);
      }
    }, {
      key: "sign",
      value: function () {
        var _sign2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee5(key, data) {
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.next = 2;
                  return getEngine().crypto.subtle.sign({
                    name: HMAC_NAME,
                    hash: HASH_NAME
                  }, key, data);

                case 2:
                  return _context5.abrupt("return", _context5.sent);

                case 3:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5, this);
        }));

        function sign(_x6, _x7) {
          return _sign2.apply(this, arguments);
        }

        return sign;
      }()
    }, {
      key: "HKDF",
      value: function () {
        var _HKDF = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee6(IKM) {
          var keysCount,
              salt,
              info,
              PRKBytes,
              infoBuffer,
              PRK,
              T,
              i,
              _args6 = arguments;
          return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  keysCount = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : 1;
                  salt = _args6.length > 2 ? _args6[2] : undefined;
                  info = _args6.length > 3 && _args6[3] !== undefined ? _args6[3] : new ArrayBuffer(0);

                  if (salt) {
                    _context6.next = 7;
                    break;
                  }

                  _context6.next = 6;
                  return this.importHMAC(new Uint8Array(32).buffer);

                case 6:
                  salt = _context6.sent;

                case 7:
                  _context6.next = 9;
                  return this.sign(salt, IKM);

                case 9:
                  PRKBytes = _context6.sent;
                  infoBuffer = new ArrayBuffer(32 + info.byteLength + 1);
                  _context6.next = 13;
                  return this.importHMAC(PRKBytes);

                case 13:
                  PRK = _context6.sent;
                  T = [new ArrayBuffer(0)];
                  i = 0;

                case 16:
                  if (!(i < keysCount)) {
                    _context6.next = 23;
                    break;
                  }

                  _context6.next = 19;
                  return this.sign(PRK, combine(T[i], info, new Uint8Array([i + 1]).buffer));

                case 19:
                  T[i + 1] = _context6.sent;

                case 20:
                  i++;
                  _context6.next = 16;
                  break;

                case 23:
                  return _context6.abrupt("return", T.slice(1));

                case 24:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6, this);
        }));

        function HKDF(_x8) {
          return _HKDF.apply(this, arguments);
        }

        return HKDF;
      }()
    }]);

    return Secret;
  }();

  var ECPublicKey =
  /*#__PURE__*/
  function () {
    function ECPublicKey() {
      _classCallCheck(this, ECPublicKey);
    }

    _createClass(ECPublicKey, [{
      key: "serialize",
      value: function serialize() {
        return this.serialized;
      }
    }, {
      key: "thumbprint",
      value: function () {
        var _thumbprint = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee7() {
          var bytes, thumbprint;
          return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  _context7.next = 2;
                  return this.serialize();

                case 2:
                  bytes = _context7.sent;
                  _context7.next = 5;
                  return Secret.digest("SHA-256", bytes);

                case 5:
                  thumbprint = _context7.sent;
                  return _context7.abrupt("return", Convert.ToHex(thumbprint));

                case 7:
                case "end":
                  return _context7.stop();
              }
            }
          }, _callee7, this);
        }));

        function thumbprint() {
          return _thumbprint.apply(this, arguments);
        }

        return thumbprint;
      }()
    }, {
      key: "isEqual",
      value: function () {
        var _isEqual2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee8(other) {
          return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
              switch (_context8.prev = _context8.next) {
                case 0:
                  if (other && other instanceof ECPublicKey) {
                    _context8.next = 2;
                    break;
                  }

                  return _context8.abrupt("return", false);

                case 2:
                  return _context8.abrupt("return", _isEqual(this.serialized, other.serialized));

                case 3:
                case "end":
                  return _context8.stop();
              }
            }
          }, _callee8, this);
        }));

        function isEqual(_x9) {
          return _isEqual2.apply(this, arguments);
        }

        return isEqual;
      }()
    }], [{
      key: "create",
      value: function () {
        var _create = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee9(publicKey) {
          var res, algName, jwk, x, y, xy;
          return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
              switch (_context9.prev = _context9.next) {
                case 0:
                  res = new this();
                  algName = publicKey.algorithm.name.toUpperCase();

                  if (algName === "ECDH" || algName === "ECDSA") {
                    _context9.next = 4;
                    break;
                  }

                  throw new Error("Error: Unsupported asymmetric key algorithm.");

                case 4:
                  if (!(publicKey.type !== "public")) {
                    _context9.next = 6;
                    break;
                  }

                  throw new Error("Error: Expected key type to be public but it was not.");

                case 6:
                  res.key = publicKey;
                  _context9.next = 9;
                  return getEngine().crypto.subtle.exportKey("jwk", publicKey);

                case 9:
                  jwk = _context9.sent;

                  if (jwk.x && jwk.y) {
                    _context9.next = 12;
                    break;
                  }

                  throw new Error("Wrong JWK data for EC public key. Parameters x and y are required.");

                case 12:
                  x = Convert.FromBase64Url(jwk.x);
                  y = Convert.FromBase64Url(jwk.y);
                  xy = Convert.ToBinary(x) + Convert.ToBinary(y);
                  res.serialized = Convert.FromBinary(xy);
                  _context9.next = 18;
                  return res.thumbprint();

                case 18:
                  res.id = _context9.sent;
                  return _context9.abrupt("return", res);

                case 20:
                case "end":
                  return _context9.stop();
              }
            }
          }, _callee9, this);
        }));

        function create(_x10) {
          return _create.apply(this, arguments);
        }

        return create;
      }()
    }, {
      key: "importKey",
      value: function () {
        var _importKey = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee10(bytes, type) {
          var x, y, jwk, usage, key, res;
          return regeneratorRuntime.wrap(function _callee10$(_context10) {
            while (1) {
              switch (_context10.prev = _context10.next) {
                case 0:
                  x = Convert.ToBase64Url(bytes.slice(0, 32));
                  y = Convert.ToBase64Url(bytes.slice(32));
                  jwk = {
                    crv: Curve.NAMED_CURVE,
                    kty: "EC",
                    x: x,
                    y: y
                  };
                  usage = type === "ECDSA" ? ["verify"] : [];
                  _context10.next = 6;
                  return getEngine().crypto.subtle.importKey("jwk", jwk, {
                    name: type,
                    namedCurve: Curve.NAMED_CURVE
                  }, true, usage);

                case 6:
                  key = _context10.sent;
                  _context10.next = 9;
                  return ECPublicKey.create(key);

                case 9:
                  res = _context10.sent;
                  return _context10.abrupt("return", res);

                case 11:
                case "end":
                  return _context10.stop();
              }
            }
          }, _callee10, this);
        }));

        function importKey(_x11, _x12) {
          return _importKey.apply(this, arguments);
        }

        return importKey;
      }()
    }]);

    return ECPublicKey;
  }();

  var Identity =
  /*#__PURE__*/
  function () {
    _createClass(Identity, null, [{
      key: "fromJSON",
      value: function () {
        var _fromJSON = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee11(obj) {
          var signingKey, exchangeKey, res;
          return regeneratorRuntime.wrap(function _callee11$(_context11) {
            while (1) {
              switch (_context11.prev = _context11.next) {
                case 0:
                  _context11.next = 2;
                  return Curve.ecKeyPairFromJson(obj.signingKey);

                case 2:
                  signingKey = _context11.sent;
                  _context11.next = 5;
                  return Curve.ecKeyPairFromJson(obj.exchangeKey);

                case 5:
                  exchangeKey = _context11.sent;
                  res = new this(obj.id, signingKey, exchangeKey);
                  res.createdAt = new Date(obj.createdAt);
                  _context11.next = 10;
                  return res.fromJSON(obj);

                case 10:
                  return _context11.abrupt("return", res);

                case 11:
                case "end":
                  return _context11.stop();
              }
            }
          }, _callee11, this);
        }));

        function fromJSON(_x13) {
          return _fromJSON.apply(this, arguments);
        }

        return fromJSON;
      }()
    }, {
      key: "create",
      value: function () {
        var _create2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee12(id) {
          var signedPreKeyAmount,
              preKeyAmount,
              signingKey,
              exchangeKey,
              res,
              i,
              _i2,
              _args12 = arguments;

          return regeneratorRuntime.wrap(function _callee12$(_context12) {
            while (1) {
              switch (_context12.prev = _context12.next) {
                case 0:
                  signedPreKeyAmount = _args12.length > 1 && _args12[1] !== undefined ? _args12[1] : 0;
                  preKeyAmount = _args12.length > 2 && _args12[2] !== undefined ? _args12[2] : 0;
                  _context12.next = 4;
                  return Curve.generateKeyPair(SIGN_ALGORITHM_NAME);

                case 4:
                  signingKey = _context12.sent;
                  _context12.next = 7;
                  return Curve.generateKeyPair(DH_ALGORITHM_NAME);

                case 7:
                  exchangeKey = _context12.sent;
                  res = new Identity(id, signingKey, exchangeKey);
                  res.createdAt = new Date();
                  i = 0;

                case 11:
                  if (!(i < preKeyAmount)) {
                    _context12.next = 20;
                    break;
                  }

                  _context12.t0 = res.preKeys;
                  _context12.next = 15;
                  return Curve.generateKeyPair("ECDH");

                case 15:
                  _context12.t1 = _context12.sent;

                  _context12.t0.push.call(_context12.t0, _context12.t1);

                case 17:
                  i++;
                  _context12.next = 11;
                  break;

                case 20:
                  _i2 = 0;

                case 21:
                  if (!(_i2 < signedPreKeyAmount)) {
                    _context12.next = 30;
                    break;
                  }

                  _context12.t2 = res.signedPreKeys;
                  _context12.next = 25;
                  return Curve.generateKeyPair("ECDH");

                case 25:
                  _context12.t3 = _context12.sent;

                  _context12.t2.push.call(_context12.t2, _context12.t3);

                case 27:
                  _i2++;
                  _context12.next = 21;
                  break;

                case 30:
                  return _context12.abrupt("return", res);

                case 31:
                case "end":
                  return _context12.stop();
              }
            }
          }, _callee12, this);
        }));

        function create(_x14) {
          return _create2.apply(this, arguments);
        }

        return create;
      }()
    }]);

    function Identity(id, signingKey, exchangeKey) {
      _classCallCheck(this, Identity);

      this.id = id;
      this.signingKey = signingKey;
      this.exchangeKey = exchangeKey;
      this.preKeys = [];
      this.signedPreKeys = [];
    }

    _createClass(Identity, [{
      key: "toJSON",
      value: function () {
        var _toJSON = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee13() {
          var preKeys, signedPreKeys, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, key, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _key3;

          return regeneratorRuntime.wrap(function _callee13$(_context13) {
            while (1) {
              switch (_context13.prev = _context13.next) {
                case 0:
                  preKeys = [];
                  signedPreKeys = [];
                  _iteratorNormalCompletion = true;
                  _didIteratorError = false;
                  _iteratorError = undefined;
                  _context13.prev = 5;
                  _iterator = this.preKeys[Symbol.iterator]();

                case 7:
                  if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                    _context13.next = 17;
                    break;
                  }

                  key = _step.value;
                  _context13.t0 = preKeys;
                  _context13.next = 12;
                  return Curve.ecKeyPairToJson(key);

                case 12:
                  _context13.t1 = _context13.sent;

                  _context13.t0.push.call(_context13.t0, _context13.t1);

                case 14:
                  _iteratorNormalCompletion = true;
                  _context13.next = 7;
                  break;

                case 17:
                  _context13.next = 23;
                  break;

                case 19:
                  _context13.prev = 19;
                  _context13.t2 = _context13["catch"](5);
                  _didIteratorError = true;
                  _iteratorError = _context13.t2;

                case 23:
                  _context13.prev = 23;
                  _context13.prev = 24;

                  if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                  }

                case 26:
                  _context13.prev = 26;

                  if (!_didIteratorError) {
                    _context13.next = 29;
                    break;
                  }

                  throw _iteratorError;

                case 29:
                  return _context13.finish(26);

                case 30:
                  return _context13.finish(23);

                case 31:
                  _iteratorNormalCompletion2 = true;
                  _didIteratorError2 = false;
                  _iteratorError2 = undefined;
                  _context13.prev = 34;
                  _iterator2 = this.signedPreKeys[Symbol.iterator]();

                case 36:
                  if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                    _context13.next = 46;
                    break;
                  }

                  _key3 = _step2.value;
                  _context13.t3 = signedPreKeys;
                  _context13.next = 41;
                  return Curve.ecKeyPairToJson(_key3);

                case 41:
                  _context13.t4 = _context13.sent;

                  _context13.t3.push.call(_context13.t3, _context13.t4);

                case 43:
                  _iteratorNormalCompletion2 = true;
                  _context13.next = 36;
                  break;

                case 46:
                  _context13.next = 52;
                  break;

                case 48:
                  _context13.prev = 48;
                  _context13.t5 = _context13["catch"](34);
                  _didIteratorError2 = true;
                  _iteratorError2 = _context13.t5;

                case 52:
                  _context13.prev = 52;
                  _context13.prev = 53;

                  if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                    _iterator2.return();
                  }

                case 55:
                  _context13.prev = 55;

                  if (!_didIteratorError2) {
                    _context13.next = 58;
                    break;
                  }

                  throw _iteratorError2;

                case 58:
                  return _context13.finish(55);

                case 59:
                  return _context13.finish(52);

                case 60:
                  _context13.t6 = this.createdAt.toISOString();
                  _context13.next = 63;
                  return Curve.ecKeyPairToJson(this.exchangeKey);

                case 63:
                  _context13.t7 = _context13.sent;
                  _context13.t8 = this.id;
                  _context13.t9 = preKeys;
                  _context13.t10 = signedPreKeys;
                  _context13.next = 69;
                  return Curve.ecKeyPairToJson(this.signingKey);

                case 69:
                  _context13.t11 = _context13.sent;
                  return _context13.abrupt("return", {
                    createdAt: _context13.t6,
                    exchangeKey: _context13.t7,
                    id: _context13.t8,
                    preKeys: _context13.t9,
                    signedPreKeys: _context13.t10,
                    signingKey: _context13.t11
                  });

                case 71:
                case "end":
                  return _context13.stop();
              }
            }
          }, _callee13, this, [[5, 19, 23, 31], [24,, 26, 30], [34, 48, 52, 60], [53,, 55, 59]]);
        }));

        function toJSON() {
          return _toJSON.apply(this, arguments);
        }

        return toJSON;
      }()
    }, {
      key: "fromJSON",
      value: function () {
        var _fromJSON2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee14(obj) {
          var _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, key, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _key4;

          return regeneratorRuntime.wrap(function _callee14$(_context14) {
            while (1) {
              switch (_context14.prev = _context14.next) {
                case 0:
                  this.id = obj.id;
                  _context14.next = 3;
                  return Curve.ecKeyPairFromJson(obj.signingKey);

                case 3:
                  this.signingKey = _context14.sent;
                  _context14.next = 6;
                  return Curve.ecKeyPairFromJson(obj.exchangeKey);

                case 6:
                  this.exchangeKey = _context14.sent;
                  this.preKeys = [];
                  _iteratorNormalCompletion3 = true;
                  _didIteratorError3 = false;
                  _iteratorError3 = undefined;
                  _context14.prev = 11;
                  _iterator3 = obj.preKeys[Symbol.iterator]();

                case 13:
                  if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                    _context14.next = 23;
                    break;
                  }

                  key = _step3.value;
                  _context14.t0 = this.preKeys;
                  _context14.next = 18;
                  return Curve.ecKeyPairFromJson(key);

                case 18:
                  _context14.t1 = _context14.sent;

                  _context14.t0.push.call(_context14.t0, _context14.t1);

                case 20:
                  _iteratorNormalCompletion3 = true;
                  _context14.next = 13;
                  break;

                case 23:
                  _context14.next = 29;
                  break;

                case 25:
                  _context14.prev = 25;
                  _context14.t2 = _context14["catch"](11);
                  _didIteratorError3 = true;
                  _iteratorError3 = _context14.t2;

                case 29:
                  _context14.prev = 29;
                  _context14.prev = 30;

                  if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                    _iterator3.return();
                  }

                case 32:
                  _context14.prev = 32;

                  if (!_didIteratorError3) {
                    _context14.next = 35;
                    break;
                  }

                  throw _iteratorError3;

                case 35:
                  return _context14.finish(32);

                case 36:
                  return _context14.finish(29);

                case 37:
                  this.signedPreKeys = [];
                  _iteratorNormalCompletion4 = true;
                  _didIteratorError4 = false;
                  _iteratorError4 = undefined;
                  _context14.prev = 41;
                  _iterator4 = obj.signedPreKeys[Symbol.iterator]();

                case 43:
                  if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                    _context14.next = 53;
                    break;
                  }

                  _key4 = _step4.value;
                  _context14.t3 = this.signedPreKeys;
                  _context14.next = 48;
                  return Curve.ecKeyPairFromJson(_key4);

                case 48:
                  _context14.t4 = _context14.sent;

                  _context14.t3.push.call(_context14.t3, _context14.t4);

                case 50:
                  _iteratorNormalCompletion4 = true;
                  _context14.next = 43;
                  break;

                case 53:
                  _context14.next = 59;
                  break;

                case 55:
                  _context14.prev = 55;
                  _context14.t5 = _context14["catch"](41);
                  _didIteratorError4 = true;
                  _iteratorError4 = _context14.t5;

                case 59:
                  _context14.prev = 59;
                  _context14.prev = 60;

                  if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
                    _iterator4.return();
                  }

                case 62:
                  _context14.prev = 62;

                  if (!_didIteratorError4) {
                    _context14.next = 65;
                    break;
                  }

                  throw _iteratorError4;

                case 65:
                  return _context14.finish(62);

                case 66:
                  return _context14.finish(59);

                case 67:
                case "end":
                  return _context14.stop();
              }
            }
          }, _callee14, this, [[11, 25, 29, 37], [30,, 32, 36], [41, 55, 59, 67], [60,, 62, 66]]);
        }));

        function fromJSON(_x15) {
          return _fromJSON2.apply(this, arguments);
        }

        return fromJSON;
      }()
    }]);

    return Identity;
  }();

  var RemoteIdentity =
  /*#__PURE__*/
  function () {
    function RemoteIdentity() {
      _classCallCheck(this, RemoteIdentity);
    }

    _createClass(RemoteIdentity, [{
      key: "fill",
      value: function fill(protocol) {
        this.signingKey = protocol.signingKey;
        this.exchangeKey = protocol.exchangeKey;
        this.signature = protocol.signature;
        this.createdAt = protocol.createdAt;
      }
    }, {
      key: "verify",
      value: function verify() {
        return Curve.verify(this.signingKey, this.exchangeKey.serialize(), this.signature);
      }
    }, {
      key: "toJSON",
      value: function () {
        var _toJSON2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee15() {
          return regeneratorRuntime.wrap(function _callee15$(_context15) {
            while (1) {
              switch (_context15.prev = _context15.next) {
                case 0:
                  _context15.t0 = this.createdAt.toISOString();
                  _context15.next = 3;
                  return this.exchangeKey.key;

                case 3:
                  _context15.t1 = _context15.sent;
                  _context15.t2 = this.id;
                  _context15.t3 = this.signature;
                  _context15.next = 8;
                  return this.signingKey.key;

                case 8:
                  _context15.t4 = _context15.sent;
                  _context15.next = 11;
                  return this.signingKey.thumbprint();

                case 11:
                  _context15.t5 = _context15.sent;
                  return _context15.abrupt("return", {
                    createdAt: _context15.t0,
                    exchangeKey: _context15.t1,
                    id: _context15.t2,
                    signature: _context15.t3,
                    signingKey: _context15.t4,
                    thumbprint: _context15.t5
                  });

                case 13:
                case "end":
                  return _context15.stop();
              }
            }
          }, _callee15, this);
        }));

        function toJSON() {
          return _toJSON2.apply(this, arguments);
        }

        return toJSON;
      }()
    }, {
      key: "fromJSON",
      value: function () {
        var _fromJSON3 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee16(obj) {
          var ok;
          return regeneratorRuntime.wrap(function _callee16$(_context16) {
            while (1) {
              switch (_context16.prev = _context16.next) {
                case 0:
                  this.id = obj.id;
                  this.signature = obj.signature;
                  _context16.next = 4;
                  return ECPublicKey.create(obj.signingKey);

                case 4:
                  this.signingKey = _context16.sent;
                  _context16.next = 7;
                  return ECPublicKey.create(obj.exchangeKey);

                case 7:
                  this.exchangeKey = _context16.sent;
                  this.createdAt = new Date(obj.createdAt);
                  _context16.next = 11;
                  return this.verify();

                case 11:
                  ok = _context16.sent;

                  if (ok) {
                    _context16.next = 14;
                    break;
                  }

                  throw new Error("Error: Wrong signature for RemoteIdentity");

                case 14:
                case "end":
                  return _context16.stop();
              }
            }
          }, _callee16, this);
        }));

        function fromJSON(_x16) {
          return _fromJSON3.apply(this, arguments);
        }

        return fromJSON;
      }()
    }], [{
      key: "fill",
      value: function fill(protocol) {
        var res = new RemoteIdentity();
        res.fill(protocol);
        return res;
      }
    }, {
      key: "fromJSON",
      value: function () {
        var _fromJSON4 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee17(obj) {
          var res;
          return regeneratorRuntime.wrap(function _callee17$(_context17) {
            while (1) {
              switch (_context17.prev = _context17.next) {
                case 0:
                  res = new this();
                  _context17.next = 3;
                  return res.fromJSON(obj);

                case 3:
                  return _context17.abrupt("return", res);

                case 4:
                case "end":
                  return _context17.stop();
              }
            }
          }, _callee17, this);
        }));

        function fromJSON(_x17) {
          return _fromJSON4.apply(this, arguments);
        }

        return fromJSON;
      }()
    }]);

    return RemoteIdentity;
  }();

  var BaseProtocol =
  /*#__PURE__*/
  function (_ObjectProto) {
    _inherits(BaseProtocol, _ObjectProto);

    function BaseProtocol() {
      _classCallCheck(this, BaseProtocol);

      return _possibleConstructorReturn(this, _getPrototypeOf(BaseProtocol).apply(this, arguments));
    }

    return BaseProtocol;
  }(ObjectProto$2);

  __decorate([ProtobufProperty({
    id: 0,
    type: "uint32",
    defaultValue: 1
  })], BaseProtocol.prototype, "version", void 0);

  BaseProtocol = __decorate([ProtobufElement({
    name: "Base"
  })], BaseProtocol);

  var ECDSAPublicKeyConverter =
  /*#__PURE__*/
  function () {
    function ECDSAPublicKeyConverter() {
      _classCallCheck(this, ECDSAPublicKeyConverter);
    }

    _createClass(ECDSAPublicKeyConverter, null, [{
      key: "set",
      value: function () {
        var _set = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee18(value) {
          return regeneratorRuntime.wrap(function _callee18$(_context18) {
            while (1) {
              switch (_context18.prev = _context18.next) {
                case 0:
                  return _context18.abrupt("return", new Uint8Array(value.serialize()));

                case 1:
                case "end":
                  return _context18.stop();
              }
            }
          }, _callee18, this);
        }));

        function set(_x18) {
          return _set.apply(this, arguments);
        }

        return set;
      }()
    }, {
      key: "get",
      value: function () {
        var _get = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee19(value) {
          return regeneratorRuntime.wrap(function _callee19$(_context19) {
            while (1) {
              switch (_context19.prev = _context19.next) {
                case 0:
                  return _context19.abrupt("return", ECPublicKey.importKey(value.buffer, "ECDSA"));

                case 1:
                case "end":
                  return _context19.stop();
              }
            }
          }, _callee19, this);
        }));

        function get(_x19) {
          return _get.apply(this, arguments);
        }

        return get;
      }()
    }]);

    return ECDSAPublicKeyConverter;
  }();

  var ECDHPublicKeyConverter =
  /*#__PURE__*/
  function () {
    function ECDHPublicKeyConverter() {
      _classCallCheck(this, ECDHPublicKeyConverter);
    }

    _createClass(ECDHPublicKeyConverter, null, [{
      key: "set",
      value: function () {
        var _set2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee20(value) {
          return regeneratorRuntime.wrap(function _callee20$(_context20) {
            while (1) {
              switch (_context20.prev = _context20.next) {
                case 0:
                  return _context20.abrupt("return", new Uint8Array(value.serialize()));

                case 1:
                case "end":
                  return _context20.stop();
              }
            }
          }, _callee20, this);
        }));

        function set(_x20) {
          return _set2.apply(this, arguments);
        }

        return set;
      }()
    }, {
      key: "get",
      value: function () {
        var _get2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee21(value) {
          return regeneratorRuntime.wrap(function _callee21$(_context21) {
            while (1) {
              switch (_context21.prev = _context21.next) {
                case 0:
                  return _context21.abrupt("return", ECPublicKey.importKey(value.buffer, "ECDH"));

                case 1:
                case "end":
                  return _context21.stop();
              }
            }
          }, _callee21, this);
        }));

        function get(_x21) {
          return _get2.apply(this, arguments);
        }

        return get;
      }()
    }]);

    return ECDHPublicKeyConverter;
  }();

  var DateConverter =
  /*#__PURE__*/
  function () {
    function DateConverter() {
      _classCallCheck(this, DateConverter);
    }

    _createClass(DateConverter, null, [{
      key: "set",
      value: function () {
        var _set3 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee22(value) {
          return regeneratorRuntime.wrap(function _callee22$(_context22) {
            while (1) {
              switch (_context22.prev = _context22.next) {
                case 0:
                  return _context22.abrupt("return", new Uint8Array(Convert.FromString(value.toISOString())));

                case 1:
                case "end":
                  return _context22.stop();
              }
            }
          }, _callee22, this);
        }));

        function set(_x22) {
          return _set3.apply(this, arguments);
        }

        return set;
      }()
    }, {
      key: "get",
      value: function () {
        var _get3 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee23(value) {
          return regeneratorRuntime.wrap(function _callee23$(_context23) {
            while (1) {
              switch (_context23.prev = _context23.next) {
                case 0:
                  return _context23.abrupt("return", new Date(Convert.ToString(value)));

                case 1:
                case "end":
                  return _context23.stop();
              }
            }
          }, _callee23, this);
        }));

        function get(_x23) {
          return _get3.apply(this, arguments);
        }

        return get;
      }()
    }]);

    return DateConverter;
  }();

  var IdentityProtocol_1;

  var IdentityProtocol = IdentityProtocol_1 =
  /*#__PURE__*/
  function (_BaseProtocol) {
    _inherits(IdentityProtocol, _BaseProtocol);

    function IdentityProtocol() {
      _classCallCheck(this, IdentityProtocol);

      return _possibleConstructorReturn(this, _getPrototypeOf(IdentityProtocol).apply(this, arguments));
    }

    _createClass(IdentityProtocol, [{
      key: "sign",
      value: function () {
        var _sign3 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee24(key) {
          return regeneratorRuntime.wrap(function _callee24$(_context24) {
            while (1) {
              switch (_context24.prev = _context24.next) {
                case 0:
                  _context24.next = 2;
                  return Curve.sign(key, this.exchangeKey.serialize());

                case 2:
                  this.signature = _context24.sent;

                case 3:
                case "end":
                  return _context24.stop();
              }
            }
          }, _callee24, this);
        }));

        function sign(_x24) {
          return _sign3.apply(this, arguments);
        }

        return sign;
      }()
    }, {
      key: "verify",
      value: function () {
        var _verify = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee25() {
          return regeneratorRuntime.wrap(function _callee25$(_context25) {
            while (1) {
              switch (_context25.prev = _context25.next) {
                case 0:
                  _context25.next = 2;
                  return Curve.verify(this.signingKey, this.exchangeKey.serialize(), this.signature);

                case 2:
                  return _context25.abrupt("return", _context25.sent);

                case 3:
                case "end":
                  return _context25.stop();
              }
            }
          }, _callee25, this);
        }));

        function verify() {
          return _verify.apply(this, arguments);
        }

        return verify;
      }()
    }, {
      key: "fill",
      value: function () {
        var _fill = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee26(identity) {
          return regeneratorRuntime.wrap(function _callee26$(_context26) {
            while (1) {
              switch (_context26.prev = _context26.next) {
                case 0:
                  this.signingKey = identity.signingKey.publicKey;
                  this.exchangeKey = identity.exchangeKey.publicKey;
                  this.createdAt = identity.createdAt;
                  _context26.next = 5;
                  return this.sign(identity.signingKey.privateKey);

                case 5:
                case "end":
                  return _context26.stop();
              }
            }
          }, _callee26, this);
        }));

        function fill(_x25) {
          return _fill.apply(this, arguments);
        }

        return fill;
      }()
    }], [{
      key: "fill",
      value: function () {
        var _fill2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee27(identity) {
          var res;
          return regeneratorRuntime.wrap(function _callee27$(_context27) {
            while (1) {
              switch (_context27.prev = _context27.next) {
                case 0:
                  res = new IdentityProtocol_1();
                  _context27.next = 3;
                  return res.fill(identity);

                case 3:
                  return _context27.abrupt("return", res);

                case 4:
                case "end":
                  return _context27.stop();
              }
            }
          }, _callee27, this);
        }));

        function fill(_x26) {
          return _fill2.apply(this, arguments);
        }

        return fill;
      }()
    }]);

    return IdentityProtocol;
  }(BaseProtocol);

  __decorate([ProtobufProperty({
    id: 1,
    converter: ECDSAPublicKeyConverter
  })], IdentityProtocol.prototype, "signingKey", void 0);

  __decorate([ProtobufProperty({
    id: 2,
    converter: ECDHPublicKeyConverter
  })], IdentityProtocol.prototype, "exchangeKey", void 0);

  __decorate([ProtobufProperty({
    id: 3
  })], IdentityProtocol.prototype, "signature", void 0);

  __decorate([ProtobufProperty({
    id: 4,
    converter: DateConverter
  })], IdentityProtocol.prototype, "createdAt", void 0);

  IdentityProtocol = IdentityProtocol_1 = __decorate([ProtobufElement({
    name: "Identity"
  })], IdentityProtocol);

  var MessageProtocol =
  /*#__PURE__*/
  function (_BaseProtocol2) {
    _inherits(MessageProtocol, _BaseProtocol2);

    function MessageProtocol() {
      _classCallCheck(this, MessageProtocol);

      return _possibleConstructorReturn(this, _getPrototypeOf(MessageProtocol).apply(this, arguments));
    }

    return MessageProtocol;
  }(BaseProtocol);

  __decorate([ProtobufProperty({
    id: 1,
    converter: ECDHPublicKeyConverter,
    required: true
  })], MessageProtocol.prototype, "senderRatchetKey", void 0);

  __decorate([ProtobufProperty({
    id: 2,
    type: "uint32",
    required: true
  })], MessageProtocol.prototype, "counter", void 0);

  __decorate([ProtobufProperty({
    id: 3,
    type: "uint32",
    required: true
  })], MessageProtocol.prototype, "previousCounter", void 0);

  __decorate([ProtobufProperty({
    id: 4,
    converter: ArrayBufferConverter,
    required: true
  })], MessageProtocol.prototype, "cipherText", void 0);

  MessageProtocol = __decorate([ProtobufElement({
    name: "Message"
  })], MessageProtocol);

  var MessageSignedProtocol =
  /*#__PURE__*/
  function (_BaseProtocol3) {
    _inherits(MessageSignedProtocol, _BaseProtocol3);

    function MessageSignedProtocol() {
      _classCallCheck(this, MessageSignedProtocol);

      return _possibleConstructorReturn(this, _getPrototypeOf(MessageSignedProtocol).apply(this, arguments));
    }

    _createClass(MessageSignedProtocol, [{
      key: "sign",
      value: function () {
        var _sign4 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee28(hmacKey) {
          return regeneratorRuntime.wrap(function _callee28$(_context28) {
            while (1) {
              switch (_context28.prev = _context28.next) {
                case 0:
                  _context28.next = 2;
                  return this.signHMAC(hmacKey);

                case 2:
                  this.signature = _context28.sent;

                case 3:
                case "end":
                  return _context28.stop();
              }
            }
          }, _callee28, this);
        }));

        function sign(_x27) {
          return _sign4.apply(this, arguments);
        }

        return sign;
      }()
    }, {
      key: "verify",
      value: function () {
        var _verify2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee29(hmacKey) {
          var signature;
          return regeneratorRuntime.wrap(function _callee29$(_context29) {
            while (1) {
              switch (_context29.prev = _context29.next) {
                case 0:
                  _context29.next = 2;
                  return this.signHMAC(hmacKey);

                case 2:
                  signature = _context29.sent;
                  return _context29.abrupt("return", _isEqual(signature, this.signature));

                case 4:
                case "end":
                  return _context29.stop();
              }
            }
          }, _callee29, this);
        }));

        function verify(_x28) {
          return _verify2.apply(this, arguments);
        }

        return verify;
      }()
    }, {
      key: "getSignedRaw",
      value: function () {
        var _getSignedRaw = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee30() {
          var receiverKey, senderKey, message, data;
          return regeneratorRuntime.wrap(function _callee30$(_context30) {
            while (1) {
              switch (_context30.prev = _context30.next) {
                case 0:
                  receiverKey = this.receiverKey.serialize();
                  senderKey = this.senderKey.serialize();
                  _context30.next = 4;
                  return this.message.exportProto();

                case 4:
                  message = _context30.sent;
                  data = combine(receiverKey, senderKey, message);
                  return _context30.abrupt("return", data);

                case 7:
                case "end":
                  return _context30.stop();
              }
            }
          }, _callee30, this);
        }));

        function getSignedRaw() {
          return _getSignedRaw.apply(this, arguments);
        }

        return getSignedRaw;
      }()
    }, {
      key: "signHMAC",
      value: function () {
        var _signHMAC = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee31(macKey) {
          var data, signature;
          return regeneratorRuntime.wrap(function _callee31$(_context31) {
            while (1) {
              switch (_context31.prev = _context31.next) {
                case 0:
                  _context31.next = 2;
                  return this.getSignedRaw();

                case 2:
                  data = _context31.sent;
                  _context31.next = 5;
                  return Secret.sign(macKey, data);

                case 5:
                  signature = _context31.sent;
                  return _context31.abrupt("return", signature);

                case 7:
                case "end":
                  return _context31.stop();
              }
            }
          }, _callee31, this);
        }));

        function signHMAC(_x29) {
          return _signHMAC.apply(this, arguments);
        }

        return signHMAC;
      }()
    }]);

    return MessageSignedProtocol;
  }(BaseProtocol);

  __decorate([ProtobufProperty({
    id: 1,
    converter: ECDSAPublicKeyConverter,
    required: true
  })], MessageSignedProtocol.prototype, "senderKey", void 0);

  __decorate([ProtobufProperty({
    id: 2,
    parser: MessageProtocol,
    required: true
  })], MessageSignedProtocol.prototype, "message", void 0);

  __decorate([ProtobufProperty({
    id: 3,
    required: true
  })], MessageSignedProtocol.prototype, "signature", void 0);

  MessageSignedProtocol = __decorate([ProtobufElement({
    name: "MessageSigned"
  })], MessageSignedProtocol);

  var PreKeyMessageProtocol =
  /*#__PURE__*/
  function (_BaseProtocol4) {
    _inherits(PreKeyMessageProtocol, _BaseProtocol4);

    function PreKeyMessageProtocol() {
      _classCallCheck(this, PreKeyMessageProtocol);

      return _possibleConstructorReturn(this, _getPrototypeOf(PreKeyMessageProtocol).apply(this, arguments));
    }

    return PreKeyMessageProtocol;
  }(BaseProtocol);

  __decorate([ProtobufProperty({
    id: 1,
    type: "uint32",
    required: true
  })], PreKeyMessageProtocol.prototype, "registrationId", void 0);

  __decorate([ProtobufProperty({
    id: 2,
    type: "uint32"
  })], PreKeyMessageProtocol.prototype, "preKeyId", void 0);

  __decorate([ProtobufProperty({
    id: 3,
    type: "uint32",
    required: true
  })], PreKeyMessageProtocol.prototype, "preKeySignedId", void 0);

  __decorate([ProtobufProperty({
    id: 4,
    converter: ECDHPublicKeyConverter,
    required: true
  })], PreKeyMessageProtocol.prototype, "baseKey", void 0);

  __decorate([ProtobufProperty({
    id: 5,
    parser: IdentityProtocol,
    required: true
  })], PreKeyMessageProtocol.prototype, "identity", void 0);

  __decorate([ProtobufProperty({
    id: 6,
    parser: MessageSignedProtocol,
    required: true
  })], PreKeyMessageProtocol.prototype, "signedMessage", void 0);

  PreKeyMessageProtocol = __decorate([ProtobufElement({
    name: "PreKeyMessage"
  })], PreKeyMessageProtocol);

  var PreKeyProtocol =
  /*#__PURE__*/
  function (_BaseProtocol5) {
    _inherits(PreKeyProtocol, _BaseProtocol5);

    function PreKeyProtocol() {
      _classCallCheck(this, PreKeyProtocol);

      return _possibleConstructorReturn(this, _getPrototypeOf(PreKeyProtocol).apply(this, arguments));
    }

    return PreKeyProtocol;
  }(BaseProtocol);

  __decorate([ProtobufProperty({
    id: 1,
    type: "uint32",
    required: true
  })], PreKeyProtocol.prototype, "id", void 0);

  __decorate([ProtobufProperty({
    id: 2,
    converter: ECDHPublicKeyConverter,
    required: true
  })], PreKeyProtocol.prototype, "key", void 0);

  PreKeyProtocol = __decorate([ProtobufElement({
    name: "PreKey"
  })], PreKeyProtocol);

  var PreKeySignedProtocol =
  /*#__PURE__*/
  function (_PreKeyProtocol) {
    _inherits(PreKeySignedProtocol, _PreKeyProtocol);

    function PreKeySignedProtocol() {
      _classCallCheck(this, PreKeySignedProtocol);

      return _possibleConstructorReturn(this, _getPrototypeOf(PreKeySignedProtocol).apply(this, arguments));
    }

    _createClass(PreKeySignedProtocol, [{
      key: "sign",
      value: function () {
        var _sign5 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee32(key) {
          return regeneratorRuntime.wrap(function _callee32$(_context32) {
            while (1) {
              switch (_context32.prev = _context32.next) {
                case 0:
                  _context32.next = 2;
                  return Curve.sign(key, this.key.serialize());

                case 2:
                  this.signature = _context32.sent;

                case 3:
                case "end":
                  return _context32.stop();
              }
            }
          }, _callee32, this);
        }));

        function sign(_x30) {
          return _sign5.apply(this, arguments);
        }

        return sign;
      }()
    }, {
      key: "verify",
      value: function verify(key) {
        return Curve.verify(key, this.key.serialize(), this.signature);
      }
    }]);

    return PreKeySignedProtocol;
  }(PreKeyProtocol);

  __decorate([ProtobufProperty({
    id: 3,
    converter: ArrayBufferConverter,
    required: true
  })], PreKeySignedProtocol.prototype, "signature", void 0);

  PreKeySignedProtocol = __decorate([ProtobufElement({
    name: "PreKeySigned"
  })], PreKeySignedProtocol);

  var PreKeyBundleProtocol =
  /*#__PURE__*/
  function (_BaseProtocol6) {
    _inherits(PreKeyBundleProtocol, _BaseProtocol6);

    function PreKeyBundleProtocol() {
      _classCallCheck(this, PreKeyBundleProtocol);

      return _possibleConstructorReturn(this, _getPrototypeOf(PreKeyBundleProtocol).apply(this, arguments));
    }

    return PreKeyBundleProtocol;
  }(BaseProtocol);

  __decorate([ProtobufProperty({
    id: 1,
    type: "uint32",
    required: true
  })], PreKeyBundleProtocol.prototype, "registrationId", void 0);

  __decorate([ProtobufProperty({
    id: 2,
    parser: IdentityProtocol,
    required: true
  })], PreKeyBundleProtocol.prototype, "identity", void 0);

  __decorate([ProtobufProperty({
    id: 3,
    parser: PreKeyProtocol
  })], PreKeyBundleProtocol.prototype, "preKey", void 0);

  __decorate([ProtobufProperty({
    id: 4,
    parser: PreKeySignedProtocol,
    required: true
  })], PreKeyBundleProtocol.prototype, "preKeySigned", void 0);

  PreKeyBundleProtocol = __decorate([ProtobufElement({
    name: "PreKeyBundle"
  })], PreKeyBundleProtocol);

  var Stack =
  /*#__PURE__*/
  function () {
    function Stack() {
      var maxSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 20;

      _classCallCheck(this, Stack);

      this.items = [];
      this.maxSize = maxSize;
    }

    _createClass(Stack, [{
      key: "push",
      value: function push(item) {
        if (this.length === this.maxSize) {
          this.items = this.items.slice(1);
        }

        this.items.push(item);
      }
    }, {
      key: "toJSON",
      value: function () {
        var _toJSON3 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee33() {
          var res, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, item;

          return regeneratorRuntime.wrap(function _callee33$(_context33) {
            while (1) {
              switch (_context33.prev = _context33.next) {
                case 0:
                  res = [];
                  _iteratorNormalCompletion5 = true;
                  _didIteratorError5 = false;
                  _iteratorError5 = undefined;
                  _context33.prev = 4;
                  _iterator5 = this.items[Symbol.iterator]();

                case 6:
                  if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
                    _context33.next = 16;
                    break;
                  }

                  item = _step5.value;
                  _context33.t0 = res;
                  _context33.next = 11;
                  return item.toJSON();

                case 11:
                  _context33.t1 = _context33.sent;

                  _context33.t0.push.call(_context33.t0, _context33.t1);

                case 13:
                  _iteratorNormalCompletion5 = true;
                  _context33.next = 6;
                  break;

                case 16:
                  _context33.next = 22;
                  break;

                case 18:
                  _context33.prev = 18;
                  _context33.t2 = _context33["catch"](4);
                  _didIteratorError5 = true;
                  _iteratorError5 = _context33.t2;

                case 22:
                  _context33.prev = 22;
                  _context33.prev = 23;

                  if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
                    _iterator5.return();
                  }

                case 25:
                  _context33.prev = 25;

                  if (!_didIteratorError5) {
                    _context33.next = 28;
                    break;
                  }

                  throw _iteratorError5;

                case 28:
                  return _context33.finish(25);

                case 29:
                  return _context33.finish(22);

                case 30:
                  return _context33.abrupt("return", res);

                case 31:
                case "end":
                  return _context33.stop();
              }
            }
          }, _callee33, this, [[4, 18, 22, 30], [23,, 25, 29]]);
        }));

        function toJSON() {
          return _toJSON3.apply(this, arguments);
        }

        return toJSON;
      }()
    }, {
      key: "fromJSON",
      value: function () {
        var _fromJSON5 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee34(obj) {
          return regeneratorRuntime.wrap(function _callee34$(_context34) {
            while (1) {
              switch (_context34.prev = _context34.next) {
                case 0:
                  this.items = obj;

                case 1:
                case "end":
                  return _context34.stop();
              }
            }
          }, _callee34, this);
        }));

        function fromJSON(_x31) {
          return _fromJSON5.apply(this, arguments);
        }

        return fromJSON;
      }()
    }, {
      key: "length",
      get: function get() {
        return this.items.length;
      }
    }, {
      key: "latest",
      get: function get() {
        return this.items[this.length - 1];
      }
    }]);

    return Stack;
  }();

  var CIPHER_KEY_KDF_INPUT = new Uint8Array([1]).buffer;
  var ROOT_KEY_KDF_INPUT = new Uint8Array([2]).buffer;

  var SymmetricRatchet =
  /*#__PURE__*/
  function () {
    function SymmetricRatchet(rootKey) {
      _classCallCheck(this, SymmetricRatchet);

      this.counter = 0;
      this.rootKey = rootKey;
    }

    _createClass(SymmetricRatchet, [{
      key: "toJSON",
      value: function () {
        var _toJSON4 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee35() {
          return regeneratorRuntime.wrap(function _callee35$(_context35) {
            while (1) {
              switch (_context35.prev = _context35.next) {
                case 0:
                  return _context35.abrupt("return", {
                    counter: this.counter,
                    rootKey: this.rootKey
                  });

                case 1:
                case "end":
                  return _context35.stop();
              }
            }
          }, _callee35, this);
        }));

        function toJSON() {
          return _toJSON4.apply(this, arguments);
        }

        return toJSON;
      }()
    }, {
      key: "fromJSON",
      value: function () {
        var _fromJSON6 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee36(obj) {
          return regeneratorRuntime.wrap(function _callee36$(_context36) {
            while (1) {
              switch (_context36.prev = _context36.next) {
                case 0:
                  this.counter = obj.counter;
                  this.rootKey = obj.rootKey;

                case 2:
                case "end":
                  return _context36.stop();
              }
            }
          }, _callee36, this);
        }));

        function fromJSON(_x32) {
          return _fromJSON6.apply(this, arguments);
        }

        return fromJSON;
      }()
    }, {
      key: "calculateKey",
      value: function () {
        var _calculateKey = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee37(rootKey) {
          var cipherKeyBytes, nextRootKeyBytes, res;
          return regeneratorRuntime.wrap(function _callee37$(_context37) {
            while (1) {
              switch (_context37.prev = _context37.next) {
                case 0:
                  _context37.next = 2;
                  return Secret.sign(rootKey, CIPHER_KEY_KDF_INPUT);

                case 2:
                  cipherKeyBytes = _context37.sent;
                  _context37.next = 5;
                  return Secret.sign(rootKey, ROOT_KEY_KDF_INPUT);

                case 5:
                  nextRootKeyBytes = _context37.sent;
                  _context37.t0 = cipherKeyBytes;
                  _context37.next = 9;
                  return Secret.importHMAC(nextRootKeyBytes);

                case 9:
                  _context37.t1 = _context37.sent;
                  res = {
                    cipher: _context37.t0,
                    rootKey: _context37.t1
                  };
                  return _context37.abrupt("return", res);

                case 12:
                case "end":
                  return _context37.stop();
              }
            }
          }, _callee37, this);
        }));

        function calculateKey(_x33) {
          return _calculateKey.apply(this, arguments);
        }

        return calculateKey;
      }()
    }, {
      key: "click",
      value: function () {
        var _click = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee38() {
          var rootKey, res;
          return regeneratorRuntime.wrap(function _callee38$(_context38) {
            while (1) {
              switch (_context38.prev = _context38.next) {
                case 0:
                  rootKey = this.rootKey;
                  _context38.next = 3;
                  return this.calculateKey(rootKey);

                case 3:
                  res = _context38.sent;
                  this.rootKey = res.rootKey;
                  this.counter++;
                  return _context38.abrupt("return", res.cipher);

                case 7:
                case "end":
                  return _context38.stop();
              }
            }
          }, _callee38, this);
        }));

        function click() {
          return _click.apply(this, arguments);
        }

        return click;
      }()
    }], [{
      key: "fromJSON",
      value: function () {
        var _fromJSON7 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee39(obj) {
          var res;
          return regeneratorRuntime.wrap(function _callee39$(_context39) {
            while (1) {
              switch (_context39.prev = _context39.next) {
                case 0:
                  res = new this(obj.rootKey);
                  res.fromJSON(obj);
                  return _context39.abrupt("return", res);

                case 3:
                case "end":
                  return _context39.stop();
              }
            }
          }, _callee39, this);
        }));

        function fromJSON(_x34) {
          return _fromJSON7.apply(this, arguments);
        }

        return fromJSON;
      }()
    }]);

    return SymmetricRatchet;
  }();

  var SendingRatchet =
  /*#__PURE__*/
  function (_SymmetricRatchet) {
    _inherits(SendingRatchet, _SymmetricRatchet);

    function SendingRatchet() {
      _classCallCheck(this, SendingRatchet);

      return _possibleConstructorReturn(this, _getPrototypeOf(SendingRatchet).apply(this, arguments));
    }

    _createClass(SendingRatchet, [{
      key: "encrypt",
      value: function () {
        var _encrypt = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee40(message) {
          var cipherKey, keys, aesKey, hmacKey, iv, cipherText;
          return regeneratorRuntime.wrap(function _callee40$(_context40) {
            while (1) {
              switch (_context40.prev = _context40.next) {
                case 0:
                  _context40.next = 2;
                  return this.click();

                case 2:
                  cipherKey = _context40.sent;
                  _context40.next = 5;
                  return Secret.HKDF(cipherKey, 3, void 0, INFO_MESSAGE_KEYS);

                case 5:
                  keys = _context40.sent;
                  _context40.next = 8;
                  return Secret.importAES(keys[0]);

                case 8:
                  aesKey = _context40.sent;
                  _context40.next = 11;
                  return Secret.importHMAC(keys[1]);

                case 11:
                  hmacKey = _context40.sent;
                  iv = keys[2].slice(0, 16);
                  _context40.next = 15;
                  return Secret.encrypt(aesKey, message, iv);

                case 15:
                  cipherText = _context40.sent;
                  return _context40.abrupt("return", {
                    cipherText: cipherText,
                    hmacKey: hmacKey
                  });

                case 17:
                case "end":
                  return _context40.stop();
              }
            }
          }, _callee40, this);
        }));

        function encrypt(_x35) {
          return _encrypt.apply(this, arguments);
        }

        return encrypt;
      }()
    }]);

    return SendingRatchet;
  }(SymmetricRatchet);

  var ReceivingRatchet =
  /*#__PURE__*/
  function (_SymmetricRatchet2) {
    _inherits(ReceivingRatchet, _SymmetricRatchet2);

    function ReceivingRatchet() {
      var _this;

      _classCallCheck(this, ReceivingRatchet);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ReceivingRatchet).apply(this, arguments));
      _this.keys = [];
      return _this;
    }

    _createClass(ReceivingRatchet, [{
      key: "toJSON",
      value: function () {
        var _toJSON5 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee41() {
          var res;
          return regeneratorRuntime.wrap(function _callee41$(_context41) {
            while (1) {
              switch (_context41.prev = _context41.next) {
                case 0:
                  _context41.next = 2;
                  return _get(_getPrototypeOf(ReceivingRatchet.prototype), "toJSON", this).call(this);

                case 2:
                  res = _context41.sent;
                  res.keys = this.keys;
                  return _context41.abrupt("return", res);

                case 5:
                case "end":
                  return _context41.stop();
              }
            }
          }, _callee41, this);
        }));

        function toJSON() {
          return _toJSON5.apply(this, arguments);
        }

        return toJSON;
      }()
    }, {
      key: "fromJSON",
      value: function () {
        var _fromJSON8 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee42(obj) {
          return regeneratorRuntime.wrap(function _callee42$(_context42) {
            while (1) {
              switch (_context42.prev = _context42.next) {
                case 0:
                  _context42.next = 2;
                  return _get(_getPrototypeOf(ReceivingRatchet.prototype), "fromJSON", this).call(this, obj);

                case 2:
                  this.keys = obj.keys;

                case 3:
                case "end":
                  return _context42.stop();
              }
            }
          }, _callee42, this);
        }));

        function fromJSON(_x36) {
          return _fromJSON8.apply(this, arguments);
        }

        return fromJSON;
      }()
    }, {
      key: "decrypt",
      value: function () {
        var _decrypt = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee43(message, counter) {
          var cipherKey, keys, aesKey, hmacKey, iv, cipherText;
          return regeneratorRuntime.wrap(function _callee43$(_context43) {
            while (1) {
              switch (_context43.prev = _context43.next) {
                case 0:
                  _context43.next = 2;
                  return this.getKey(counter);

                case 2:
                  cipherKey = _context43.sent;
                  _context43.next = 5;
                  return Secret.HKDF(cipherKey, 3, void 0, INFO_MESSAGE_KEYS);

                case 5:
                  keys = _context43.sent;
                  _context43.next = 8;
                  return Secret.importAES(keys[0]);

                case 8:
                  aesKey = _context43.sent;
                  _context43.next = 11;
                  return Secret.importHMAC(keys[1]);

                case 11:
                  hmacKey = _context43.sent;
                  iv = keys[2].slice(0, 16);
                  _context43.next = 15;
                  return Secret.decrypt(aesKey, message, iv);

                case 15:
                  cipherText = _context43.sent;
                  return _context43.abrupt("return", {
                    cipherText: cipherText,
                    hmacKey: hmacKey
                  });

                case 17:
                case "end":
                  return _context43.stop();
              }
            }
          }, _callee43, this);
        }));

        function decrypt(_x37, _x38) {
          return _decrypt.apply(this, arguments);
        }

        return decrypt;
      }()
    }, {
      key: "getKey",
      value: function () {
        var _getKey = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee44(counter) {
          var cipherKey, key;
          return regeneratorRuntime.wrap(function _callee44$(_context44) {
            while (1) {
              switch (_context44.prev = _context44.next) {
                case 0:
                  if (!(this.counter <= counter)) {
                    _context44.next = 7;
                    break;
                  }

                  _context44.next = 3;
                  return this.click();

                case 3:
                  cipherKey = _context44.sent;
                  this.keys.push(cipherKey);
                  _context44.next = 0;
                  break;

                case 7:
                  key = this.keys[counter];
                  return _context44.abrupt("return", key);

                case 9:
                case "end":
                  return _context44.stop();
              }
            }
          }, _callee44, this);
        }));

        function getKey(_x39) {
          return _getKey.apply(this, arguments);
        }

        return getKey;
      }()
    }]);

    return ReceivingRatchet;
  }(SymmetricRatchet);

  function authenticateA(_x40, _x41, _x42, _x43, _x44) {
    return _authenticateA.apply(this, arguments);
  }

  function _authenticateA() {
    _authenticateA = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee121(IKa, EKa, IKb, SPKb, OPKb) {
      var DH1, DH2, DH3, DH4, _F, i, F, KM, keys;

      return regeneratorRuntime.wrap(function _callee121$(_context121) {
        while (1) {
          switch (_context121.prev = _context121.next) {
            case 0:
              _context121.next = 2;
              return Curve.deriveBytes(IKa.exchangeKey.privateKey, SPKb);

            case 2:
              DH1 = _context121.sent;
              _context121.next = 5;
              return Curve.deriveBytes(EKa.privateKey, IKb);

            case 5:
              DH2 = _context121.sent;
              _context121.next = 8;
              return Curve.deriveBytes(EKa.privateKey, SPKb);

            case 8:
              DH3 = _context121.sent;
              DH4 = new ArrayBuffer(0);

              if (!OPKb) {
                _context121.next = 14;
                break;
              }

              _context121.next = 13;
              return Curve.deriveBytes(EKa.privateKey, OPKb);

            case 13:
              DH4 = _context121.sent;

            case 14:
              _F = new Uint8Array(32);

              for (i = 0; i < _F.length; i++) {
                _F[i] = 0xff;
              }

              F = _F.buffer;
              KM = combine(F, DH1, DH2, DH3, DH4);
              _context121.next = 20;
              return Secret.HKDF(KM, 1, void 0, INFO_TEXT);

            case 20:
              keys = _context121.sent;
              _context121.next = 23;
              return Secret.importHMAC(keys[0]);

            case 23:
              return _context121.abrupt("return", _context121.sent);

            case 24:
            case "end":
              return _context121.stop();
          }
        }
      }, _callee121, this);
    }));
    return _authenticateA.apply(this, arguments);
  }

  function authenticateB(_x45, _x46, _x47, _x48, _x49) {
    return _authenticateB.apply(this, arguments);
  }

  function _authenticateB() {
    _authenticateB = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee122(IKb, SPKb, IKa, EKa, OPKb) {
      var DH1, DH2, DH3, DH4, _F, i, F, KM, keys;

      return regeneratorRuntime.wrap(function _callee122$(_context122) {
        while (1) {
          switch (_context122.prev = _context122.next) {
            case 0:
              _context122.next = 2;
              return Curve.deriveBytes(SPKb.privateKey, IKa);

            case 2:
              DH1 = _context122.sent;
              _context122.next = 5;
              return Curve.deriveBytes(IKb.exchangeKey.privateKey, EKa);

            case 5:
              DH2 = _context122.sent;
              _context122.next = 8;
              return Curve.deriveBytes(SPKb.privateKey, EKa);

            case 8:
              DH3 = _context122.sent;
              DH4 = new ArrayBuffer(0);

              if (!OPKb) {
                _context122.next = 14;
                break;
              }

              _context122.next = 13;
              return Curve.deriveBytes(OPKb, EKa);

            case 13:
              DH4 = _context122.sent;

            case 14:
              _F = new Uint8Array(32);

              for (i = 0; i < _F.length; i++) {
                _F[i] = 0xff;
              }

              F = _F.buffer;
              KM = combine(F, DH1, DH2, DH3, DH4);
              _context122.next = 20;
              return Secret.HKDF(KM, 1, void 0, INFO_TEXT);

            case 20:
              keys = _context122.sent;
              _context122.next = 23;
              return Secret.importHMAC(keys[0]);

            case 23:
              return _context122.abrupt("return", _context122.sent);

            case 24:
            case "end":
              return _context122.stop();
          }
        }
      }, _callee122, this);
    }));
    return _authenticateB.apply(this, arguments);
  }

  var AsymmetricRatchet =
  /*#__PURE__*/
  function (_EventEmitter) {
    _inherits(AsymmetricRatchet, _EventEmitter);

    function AsymmetricRatchet() {
      var _this2;

      _classCallCheck(this, AsymmetricRatchet);

      _this2 = _possibleConstructorReturn(this, _getPrototypeOf(AsymmetricRatchet).call(this));
      _this2.counter = 0;
      _this2.currentStep = new DHRatchetStep();
      _this2.steps = new DHRatchetStepStack(MAX_RATCHET_STACK_SIZE);
      _this2.promises = {};
      return _this2;
    }

    _createClass(AsymmetricRatchet, [{
      key: "on",
      value: function on(event, listener) {
        return _get(_getPrototypeOf(AsymmetricRatchet.prototype), "on", this).call(this, event, listener);
      }
    }, {
      key: "once",
      value: function once(event, listener) {
        return _get(_getPrototypeOf(AsymmetricRatchet.prototype), "once", this).call(this, event, listener);
      }
    }, {
      key: "decrypt",
      value: function () {
        var _decrypt2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee46(protocol) {
          var _this3 = this;

          return regeneratorRuntime.wrap(function _callee46$(_context46) {
            while (1) {
              switch (_context46.prev = _context46.next) {
                case 0:
                  return _context46.abrupt("return", this.queuePromise("encrypt",
                  /*#__PURE__*/
                  _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee45() {
                    var remoteRatchetKey, message, step, ratchetStep, decryptedMessage;
                    return regeneratorRuntime.wrap(function _callee45$(_context45) {
                      while (1) {
                        switch (_context45.prev = _context45.next) {
                          case 0:
                            remoteRatchetKey = protocol.message.senderRatchetKey;
                            message = protocol.message;

                            if (!(protocol.message.previousCounter < _this3.counter - MAX_RATCHET_STACK_SIZE)) {
                              _context45.next = 4;
                              break;
                            }

                            throw new Error("Error: Too old message");

                          case 4:
                            step = _this3.steps.getStep(remoteRatchetKey);

                            if (!step) {
                              ratchetStep = new DHRatchetStep();
                              ratchetStep.remoteRatchetKey = remoteRatchetKey;

                              _this3.steps.push(ratchetStep);

                              _this3.currentStep = ratchetStep;
                              step = ratchetStep;
                            }

                            if (step.receivingChain) {
                              _context45.next = 10;
                              break;
                            }

                            _context45.next = 9;
                            return _this3.createChain(_this3.currentRatchetKey.privateKey, remoteRatchetKey, ReceivingRatchet);

                          case 9:
                            step.receivingChain = _context45.sent;

                          case 10:
                            _context45.next = 12;
                            return step.receivingChain.decrypt(message.cipherText, message.counter);

                          case 12:
                            decryptedMessage = _context45.sent;

                            _this3.update();

                            protocol.senderKey = _this3.remoteIdentity.signingKey;
                            protocol.receiverKey = _this3.identity.signingKey.publicKey;
                            _context45.next = 18;
                            return protocol.verify(decryptedMessage.hmacKey);

                          case 18:
                            if (_context45.sent) {
                              _context45.next = 20;
                              break;
                            }

                            throw new Error("Error: The Message did not successfully verify!");

                          case 20:
                            return _context45.abrupt("return", decryptedMessage.cipherText);

                          case 21:
                          case "end":
                            return _context45.stop();
                        }
                      }
                    }, _callee45, this);
                  }))));

                case 1:
                case "end":
                  return _context46.stop();
              }
            }
          }, _callee46, this);
        }));

        function decrypt(_x50) {
          return _decrypt2.apply(this, arguments);
        }

        return decrypt;
      }()
    }, {
      key: "encrypt",
      value: function () {
        var _encrypt2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee48(message) {
          var _this4 = this;

          return regeneratorRuntime.wrap(function _callee48$(_context48) {
            while (1) {
              switch (_context48.prev = _context48.next) {
                case 0:
                  return _context48.abrupt("return", this.queuePromise("encrypt",
                  /*#__PURE__*/
                  _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee47() {
                    var encryptedMessage, preKeyMessage, signedMessage;
                    return regeneratorRuntime.wrap(function _callee47$(_context47) {
                      while (1) {
                        switch (_context47.prev = _context47.next) {
                          case 0:
                            if (!(_this4.currentStep.receivingChain && !_this4.currentStep.sendingChain)) {
                              _context47.next = 5;
                              break;
                            }

                            _this4.counter++;
                            _context47.next = 4;
                            return _this4.generateRatchetKey();

                          case 4:
                            _this4.currentRatchetKey = _context47.sent;

                          case 5:
                            if (_this4.currentStep.sendingChain) {
                              _context47.next = 11;
                              break;
                            }

                            if (_this4.currentStep.remoteRatchetKey) {
                              _context47.next = 8;
                              break;
                            }

                            throw new Error("currentStep has empty remoteRatchetKey");

                          case 8:
                            _context47.next = 10;
                            return _this4.createChain(_this4.currentRatchetKey.privateKey, _this4.currentStep.remoteRatchetKey, SendingRatchet);

                          case 10:
                            _this4.currentStep.sendingChain = _context47.sent;

                          case 11:
                            _context47.next = 13;
                            return _this4.currentStep.sendingChain.encrypt(message);

                          case 13:
                            encryptedMessage = _context47.sent;

                            _this4.update();

                            if (!(_this4.steps.length === 0 && !_this4.currentStep.receivingChain && _this4.currentStep.sendingChain.counter === 1)) {
                              _context47.next = 23;
                              break;
                            }

                            preKeyMessage = new PreKeyMessageProtocol();
                            preKeyMessage.registrationId = _this4.identity.id;
                            preKeyMessage.preKeyId = _this4.remotePreKeyId;
                            preKeyMessage.preKeySignedId = _this4.remotePreKeySignedId;
                            preKeyMessage.baseKey = _this4.currentRatchetKey.publicKey;
                            _context47.next = 23;
                            return preKeyMessage.identity.fill(_this4.identity);

                          case 23:
                            signedMessage = new MessageSignedProtocol();
                            signedMessage.receiverKey = _this4.remoteIdentity.signingKey;
                            signedMessage.senderKey = _this4.identity.signingKey.publicKey;
                            signedMessage.message.cipherText = encryptedMessage.cipherText;
                            signedMessage.message.counter = _this4.currentStep.sendingChain.counter - 1;
                            signedMessage.message.previousCounter = _this4.counter;
                            signedMessage.message.senderRatchetKey = _this4.currentRatchetKey.publicKey;
                            _context47.next = 32;
                            return signedMessage.sign(encryptedMessage.hmacKey);

                          case 32:
                            if (!preKeyMessage) {
                              _context47.next = 37;
                              break;
                            }

                            preKeyMessage.signedMessage = signedMessage;
                            return _context47.abrupt("return", preKeyMessage);

                          case 37:
                            return _context47.abrupt("return", signedMessage);

                          case 38:
                          case "end":
                            return _context47.stop();
                        }
                      }
                    }, _callee47, this);
                  }))));

                case 1:
                case "end":
                  return _context48.stop();
              }
            }
          }, _callee48, this);
        }));

        function encrypt(_x51) {
          return _encrypt2.apply(this, arguments);
        }

        return encrypt;
      }()
    }, {
      key: "hasRatchetKey",
      value: function () {
        var _hasRatchetKey = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee49(key) {
          var ecKey, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, item;

          return regeneratorRuntime.wrap(function _callee49$(_context49) {
            while (1) {
              switch (_context49.prev = _context49.next) {
                case 0:
                  if (key instanceof ECPublicKey) {
                    _context49.next = 6;
                    break;
                  }

                  _context49.next = 3;
                  return ECPublicKey.create(key);

                case 3:
                  ecKey = _context49.sent;
                  _context49.next = 7;
                  break;

                case 6:
                  ecKey = key;

                case 7:
                  _iteratorNormalCompletion6 = true;
                  _didIteratorError6 = false;
                  _iteratorError6 = undefined;
                  _context49.prev = 10;
                  _iterator6 = this.steps.items[Symbol.iterator]();

                case 12:
                  if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
                    _context49.next = 21;
                    break;
                  }

                  item = _step6.value;
                  _context49.next = 16;
                  return item.remoteRatchetKey.isEqual(ecKey);

                case 16:
                  if (!_context49.sent) {
                    _context49.next = 18;
                    break;
                  }

                  return _context49.abrupt("return", true);

                case 18:
                  _iteratorNormalCompletion6 = true;
                  _context49.next = 12;
                  break;

                case 21:
                  _context49.next = 27;
                  break;

                case 23:
                  _context49.prev = 23;
                  _context49.t0 = _context49["catch"](10);
                  _didIteratorError6 = true;
                  _iteratorError6 = _context49.t0;

                case 27:
                  _context49.prev = 27;
                  _context49.prev = 28;

                  if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
                    _iterator6.return();
                  }

                case 30:
                  _context49.prev = 30;

                  if (!_didIteratorError6) {
                    _context49.next = 33;
                    break;
                  }

                  throw _iteratorError6;

                case 33:
                  return _context49.finish(30);

                case 34:
                  return _context49.finish(27);

                case 35:
                  return _context49.abrupt("return", false);

                case 36:
                case "end":
                  return _context49.stop();
              }
            }
          }, _callee49, this, [[10, 23, 27, 35], [28,, 30, 34]]);
        }));

        function hasRatchetKey(_x52) {
          return _hasRatchetKey.apply(this, arguments);
        }

        return hasRatchetKey;
      }()
    }, {
      key: "toJSON",
      value: function () {
        var _toJSON6 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee50() {
          return regeneratorRuntime.wrap(function _callee50$(_context50) {
            while (1) {
              switch (_context50.prev = _context50.next) {
                case 0:
                  _context50.t0 = this.counter;
                  _context50.next = 3;
                  return Curve.ecKeyPairToJson(this.currentRatchetKey);

                case 3:
                  _context50.t1 = _context50.sent;
                  _context50.next = 6;
                  return this.remoteIdentity.signingKey.thumbprint();

                case 6:
                  _context50.t2 = _context50.sent;
                  _context50.t3 = this.rootKey;
                  _context50.next = 10;
                  return this.steps.toJSON();

                case 10:
                  _context50.t4 = _context50.sent;
                  return _context50.abrupt("return", {
                    counter: _context50.t0,
                    ratchetKey: _context50.t1,
                    remoteIdentity: _context50.t2,
                    rootKey: _context50.t3,
                    steps: _context50.t4
                  });

                case 12:
                case "end":
                  return _context50.stop();
              }
            }
          }, _callee50, this);
        }));

        function toJSON() {
          return _toJSON6.apply(this, arguments);
        }

        return toJSON;
      }()
    }, {
      key: "fromJSON",
      value: function () {
        var _fromJSON9 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee51(obj) {
          var _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, step;

          return regeneratorRuntime.wrap(function _callee51$(_context51) {
            while (1) {
              switch (_context51.prev = _context51.next) {
                case 0:
                  _context51.next = 2;
                  return Curve.ecKeyPairFromJson(obj.ratchetKey);

                case 2:
                  this.currentRatchetKey = _context51.sent;
                  this.counter = obj.counter;
                  this.rootKey = obj.rootKey;
                  _iteratorNormalCompletion7 = true;
                  _didIteratorError7 = false;
                  _iteratorError7 = undefined;
                  _context51.prev = 8;
                  _iterator7 = obj.steps[Symbol.iterator]();

                case 10:
                  if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
                    _context51.next = 19;
                    break;
                  }

                  step = _step7.value;
                  _context51.next = 14;
                  return DHRatchetStep.fromJSON(step);

                case 14:
                  this.currentStep = _context51.sent;
                  this.steps.push(this.currentStep);

                case 16:
                  _iteratorNormalCompletion7 = true;
                  _context51.next = 10;
                  break;

                case 19:
                  _context51.next = 25;
                  break;

                case 21:
                  _context51.prev = 21;
                  _context51.t0 = _context51["catch"](8);
                  _didIteratorError7 = true;
                  _iteratorError7 = _context51.t0;

                case 25:
                  _context51.prev = 25;
                  _context51.prev = 26;

                  if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
                    _iterator7.return();
                  }

                case 28:
                  _context51.prev = 28;

                  if (!_didIteratorError7) {
                    _context51.next = 31;
                    break;
                  }

                  throw _iteratorError7;

                case 31:
                  return _context51.finish(28);

                case 32:
                  return _context51.finish(25);

                case 33:
                case "end":
                  return _context51.stop();
              }
            }
          }, _callee51, this, [[8, 21, 25, 33], [26,, 28, 32]]);
        }));

        function fromJSON(_x53) {
          return _fromJSON9.apply(this, arguments);
        }

        return fromJSON;
      }()
    }, {
      key: "update",
      value: function update() {
        this.emit("update");
      }
    }, {
      key: "generateRatchetKey",
      value: function generateRatchetKey() {
        return Curve.generateKeyPair("ECDH");
      }
    }, {
      key: "createChain",
      value: function () {
        var _createChain = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee52(ourRatchetKey, theirRatchetKey, ratchetClass) {
          var derivedBytes, keys, rootKey, chainKey, chain;
          return regeneratorRuntime.wrap(function _callee52$(_context52) {
            while (1) {
              switch (_context52.prev = _context52.next) {
                case 0:
                  _context52.next = 2;
                  return Curve.deriveBytes(ourRatchetKey, theirRatchetKey);

                case 2:
                  derivedBytes = _context52.sent;
                  _context52.next = 5;
                  return Secret.HKDF(derivedBytes, 2, this.rootKey, INFO_RATCHET);

                case 5:
                  keys = _context52.sent;
                  _context52.next = 8;
                  return Secret.importHMAC(keys[0]);

                case 8:
                  rootKey = _context52.sent;
                  _context52.next = 11;
                  return Secret.importHMAC(keys[1]);

                case 11:
                  chainKey = _context52.sent;
                  chain = new ratchetClass(chainKey);
                  this.rootKey = rootKey;
                  return _context52.abrupt("return", chain);

                case 15:
                case "end":
                  return _context52.stop();
              }
            }
          }, _callee52, this);
        }));

        function createChain(_x54, _x55, _x56) {
          return _createChain.apply(this, arguments);
        }

        return createChain;
      }()
    }, {
      key: "queuePromise",
      value: function queuePromise(key, fn) {
        var _this5 = this;

        var prev = this.promises[key] || Promise.resolve();
        var cur = this.promises[key] = prev.then(fn, fn);
        cur.then(function () {
          if (_this5.promises[key] === cur) {
            delete _this5.promises[key];
          }
        });
        return cur;
      }
    }], [{
      key: "create",
      value: function () {
        var _create3 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee53(identity, protocol) {
          var rootKey, ratchet, signedPreKey, preKey;
          return regeneratorRuntime.wrap(function _callee53$(_context53) {
            while (1) {
              switch (_context53.prev = _context53.next) {
                case 0:
                  ratchet = new AsymmetricRatchet();

                  if (!(protocol instanceof PreKeyBundleProtocol)) {
                    _context53.next = 23;
                    break;
                  }

                  _context53.next = 4;
                  return protocol.identity.verify();

                case 4:
                  if (_context53.sent) {
                    _context53.next = 6;
                    break;
                  }

                  throw new Error("Error: Remote client's identity key is invalid.");

                case 6:
                  _context53.next = 8;
                  return protocol.preKeySigned.verify(protocol.identity.signingKey);

                case 8:
                  if (_context53.sent) {
                    _context53.next = 10;
                    break;
                  }

                  throw new Error("Error: Remote client's signed prekey is invalid.");

                case 10:
                  _context53.next = 12;
                  return ratchet.generateRatchetKey();

                case 12:
                  ratchet.currentRatchetKey = _context53.sent;
                  ratchet.currentStep.remoteRatchetKey = protocol.preKeySigned.key;
                  ratchet.remoteIdentity = RemoteIdentity.fill(protocol.identity);
                  ratchet.remoteIdentity.id = protocol.registrationId;
                  ratchet.remotePreKeyId = protocol.preKey.id;
                  ratchet.remotePreKeySignedId = protocol.preKeySigned.id;
                  _context53.next = 20;
                  return authenticateA(identity, ratchet.currentRatchetKey, protocol.identity.exchangeKey, protocol.preKeySigned.key, protocol.preKey.key);

                case 20:
                  rootKey = _context53.sent;
                  _context53.next = 36;
                  break;

                case 23:
                  _context53.next = 25;
                  return protocol.identity.verify();

                case 25:
                  if (_context53.sent) {
                    _context53.next = 27;
                    break;
                  }

                  throw new Error("Error: Remote client's identity key is invalid.");

                case 27:
                  signedPreKey = identity.signedPreKeys[protocol.preKeySignedId];

                  if (signedPreKey) {
                    _context53.next = 30;
                    break;
                  }

                  throw new Error("Error: PreKey with id ".concat(protocol.preKeySignedId, " not found"));

                case 30:
                  if (protocol.preKeyId !== void 0) {
                    preKey = identity.preKeys[protocol.preKeyId];
                  }

                  ratchet.remoteIdentity = RemoteIdentity.fill(protocol.identity);
                  ratchet.currentRatchetKey = signedPreKey;
                  _context53.next = 35;
                  return authenticateB(identity, ratchet.currentRatchetKey, protocol.identity.exchangeKey, protocol.signedMessage.message.senderRatchetKey, preKey && preKey.privateKey);

                case 35:
                  rootKey = _context53.sent;

                case 36:
                  ratchet.identity = identity;
                  ratchet.id = identity.id;
                  ratchet.rootKey = rootKey;
                  return _context53.abrupt("return", ratchet);

                case 40:
                case "end":
                  return _context53.stop();
              }
            }
          }, _callee53, this);
        }));

        function create(_x57, _x58) {
          return _create3.apply(this, arguments);
        }

        return create;
      }()
    }, {
      key: "fromJSON",
      value: function () {
        var _fromJSON10 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee54(identity, remote, obj) {
          var res;
          return regeneratorRuntime.wrap(function _callee54$(_context54) {
            while (1) {
              switch (_context54.prev = _context54.next) {
                case 0:
                  res = new AsymmetricRatchet();
                  res.identity = identity;
                  res.remoteIdentity = remote;
                  _context54.next = 5;
                  return res.fromJSON(obj);

                case 5:
                  return _context54.abrupt("return", res);

                case 6:
                case "end":
                  return _context54.stop();
              }
            }
          }, _callee54, this);
        }));

        function fromJSON(_x59, _x60, _x61) {
          return _fromJSON10.apply(this, arguments);
        }

        return fromJSON;
      }()
    }]);

    return AsymmetricRatchet;
  }(EventEmitter);

  var DHRatchetStep =
  /*#__PURE__*/
  function () {
    function DHRatchetStep() {
      _classCallCheck(this, DHRatchetStep);
    }

    _createClass(DHRatchetStep, [{
      key: "toJSON",
      value: function () {
        var _toJSON7 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee55() {
          var res;
          return regeneratorRuntime.wrap(function _callee55$(_context55) {
            while (1) {
              switch (_context55.prev = _context55.next) {
                case 0:
                  res = {};

                  if (this.remoteRatchetKey) {
                    res.remoteRatchetKey = this.remoteRatchetKey.key;
                  }

                  if (!this.sendingChain) {
                    _context55.next = 6;
                    break;
                  }

                  _context55.next = 5;
                  return this.sendingChain.toJSON();

                case 5:
                  res.sendingChain = _context55.sent;

                case 6:
                  if (!this.receivingChain) {
                    _context55.next = 10;
                    break;
                  }

                  _context55.next = 9;
                  return this.receivingChain.toJSON();

                case 9:
                  res.receivingChain = _context55.sent;

                case 10:
                  return _context55.abrupt("return", res);

                case 11:
                case "end":
                  return _context55.stop();
              }
            }
          }, _callee55, this);
        }));

        function toJSON() {
          return _toJSON7.apply(this, arguments);
        }

        return toJSON;
      }()
    }, {
      key: "fromJSON",
      value: function () {
        var _fromJSON11 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee56(obj) {
          return regeneratorRuntime.wrap(function _callee56$(_context56) {
            while (1) {
              switch (_context56.prev = _context56.next) {
                case 0:
                  if (!obj.remoteRatchetKey) {
                    _context56.next = 4;
                    break;
                  }

                  _context56.next = 3;
                  return ECPublicKey.create(obj.remoteRatchetKey);

                case 3:
                  this.remoteRatchetKey = _context56.sent;

                case 4:
                  if (!obj.sendingChain) {
                    _context56.next = 8;
                    break;
                  }

                  _context56.next = 7;
                  return SendingRatchet.fromJSON(obj.sendingChain);

                case 7:
                  this.sendingChain = _context56.sent;

                case 8:
                  if (!obj.receivingChain) {
                    _context56.next = 12;
                    break;
                  }

                  _context56.next = 11;
                  return ReceivingRatchet.fromJSON(obj.receivingChain);

                case 11:
                  this.receivingChain = _context56.sent;

                case 12:
                case "end":
                  return _context56.stop();
              }
            }
          }, _callee56, this);
        }));

        function fromJSON(_x62) {
          return _fromJSON11.apply(this, arguments);
        }

        return fromJSON;
      }()
    }], [{
      key: "fromJSON",
      value: function () {
        var _fromJSON12 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee57(obj) {
          var res;
          return regeneratorRuntime.wrap(function _callee57$(_context57) {
            while (1) {
              switch (_context57.prev = _context57.next) {
                case 0:
                  res = new this();
                  _context57.next = 3;
                  return res.fromJSON(obj);

                case 3:
                  return _context57.abrupt("return", res);

                case 4:
                case "end":
                  return _context57.stop();
              }
            }
          }, _callee57, this);
        }));

        function fromJSON(_x63) {
          return _fromJSON12.apply(this, arguments);
        }

        return fromJSON;
      }()
    }]);

    return DHRatchetStep;
  }();

  var DHRatchetStepStack =
  /*#__PURE__*/
  function (_Stack) {
    _inherits(DHRatchetStepStack, _Stack);

    function DHRatchetStepStack() {
      _classCallCheck(this, DHRatchetStepStack);

      return _possibleConstructorReturn(this, _getPrototypeOf(DHRatchetStepStack).apply(this, arguments));
    }

    _createClass(DHRatchetStepStack, [{
      key: "getStep",
      value: function getStep(remoteRatchetKey) {
        var found;
        this.items.some(function (step) {
          if (step.remoteRatchetKey.id === remoteRatchetKey.id) {
            found = step;
          }

          return !!found;
        });
        return found;
      }
    }]);

    return DHRatchetStepStack;
  }(Stack);

  var Event = function Event(target, event) {
    _classCallCheck(this, Event);

    this.target = target;
    this.event = event;
  };

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

  var WebCryptoLocalError =
  /*#__PURE__*/
  function (_Error) {
    _inherits(WebCryptoLocalError, _Error);

    function WebCryptoLocalError(param) {
      var _this6;

      var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

      _classCallCheck(this, WebCryptoLocalError);

      _this6 = _possibleConstructorReturn(this, _getPrototypeOf(WebCryptoLocalError).call(this));
      _this6.code = 0;
      _this6.type = "wcl";
      var CODE = WebCryptoLocalError.CODE;

      if (typeof param === "number") {
        _this6.message = message || CODE[param] || CODE[0];
        _this6.code = param;
      } else {
        _this6.code = 0;
        _this6.message = message;
      }

      var error = new Error(_this6.message);
      error.name = _this6.constructor.name;
      _this6.stack = error.stack;
      return _this6;
    }

    _createClass(WebCryptoLocalError, null, [{
      key: "isError",
      value: function isError(obj) {
        if (obj instanceof Error && obj.hasOwnProperty("code") && obj.hasOwnProperty("type")) {
          return true;
        }

        return false;
      }
    }]);

    return WebCryptoLocalError;
  }(_wrapNativeSuper(Error));

  WebCryptoLocalError.CODE = WebCryptoLocalErrorEnum;

  var DateConverter$1 =
  /*#__PURE__*/
  function () {
    function DateConverter$1() {
      _classCallCheck(this, DateConverter$1);
    }

    _createClass(DateConverter$1, null, [{
      key: "set",
      value: function () {
        var _set4 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee58(value) {
          return regeneratorRuntime.wrap(function _callee58$(_context58) {
            while (1) {
              switch (_context58.prev = _context58.next) {
                case 0:
                  return _context58.abrupt("return", new Uint8Array(Convert.FromUtf8String(value.toISOString())));

                case 1:
                case "end":
                  return _context58.stop();
              }
            }
          }, _callee58, this);
        }));

        function set(_x64) {
          return _set4.apply(this, arguments);
        }

        return set;
      }()
    }, {
      key: "get",
      value: function () {
        var _get5 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee59(value) {
          return regeneratorRuntime.wrap(function _callee59$(_context59) {
            while (1) {
              switch (_context59.prev = _context59.next) {
                case 0:
                  return _context59.abrupt("return", new Date(Convert.ToUtf8String(value)));

                case 1:
                case "end":
                  return _context59.stop();
              }
            }
          }, _callee59, this);
        }));

        function get(_x65) {
          return _get5.apply(this, arguments);
        }

        return get;
      }()
    }]);

    return DateConverter$1;
  }();

  var HexStringConverter =
  /*#__PURE__*/
  function () {
    function HexStringConverter() {
      _classCallCheck(this, HexStringConverter);
    }

    _createClass(HexStringConverter, null, [{
      key: "set",
      value: function () {
        var _set5 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee60(value) {
          return regeneratorRuntime.wrap(function _callee60$(_context60) {
            while (1) {
              switch (_context60.prev = _context60.next) {
                case 0:
                  return _context60.abrupt("return", new Uint8Array(Convert.FromHex(value)));

                case 1:
                case "end":
                  return _context60.stop();
              }
            }
          }, _callee60, this);
        }));

        function set(_x66) {
          return _set5.apply(this, arguments);
        }

        return set;
      }()
    }, {
      key: "get",
      value: function () {
        var _get6 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee61(value) {
          return regeneratorRuntime.wrap(function _callee61$(_context61) {
            while (1) {
              switch (_context61.prev = _context61.next) {
                case 0:
                  return _context61.abrupt("return", Convert.ToHex(value));

                case 1:
                case "end":
                  return _context61.stop();
              }
            }
          }, _callee61, this);
        }));

        function get(_x67) {
          return _get6.apply(this, arguments);
        }

        return get;
      }()
    }]);

    return HexStringConverter;
  }();

  var BaseProto_1, ActionProto_1, BaseAlgorithmProto_1, AlgorithmProto_1, CryptoItemProto_1, CryptoKeyProto_1, CryptoKeyPairProto_1, ErrorProto_1, ResultProto_1;

  var BaseProto = BaseProto_1 =
  /*#__PURE__*/
  function (_ObjectProto2) {
    _inherits(BaseProto, _ObjectProto2);

    function BaseProto() {
      _classCallCheck(this, BaseProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(BaseProto).apply(this, arguments));
    }

    return BaseProto;
  }(ObjectProto$2);

  BaseProto.INDEX = 1;

  __decorate([ProtobufProperty({
    id: BaseProto_1.INDEX++,
    type: "uint32",
    required: true,
    defaultValue: 1
  })], BaseProto.prototype, "version", void 0);

  BaseProto = BaseProto_1 = __decorate([ProtobufElement({
    name: "BaseMessage"
  })], BaseProto);

  var ActionProto = ActionProto_1 =
  /*#__PURE__*/
  function (_BaseProto) {
    _inherits(ActionProto, _BaseProto);

    function ActionProto() {
      var _this7;

      _classCallCheck(this, ActionProto);

      _this7 = _possibleConstructorReturn(this, _getPrototypeOf(ActionProto).call(this));
      _this7.action = _this7.constructor.ACTION;
      return _this7;
    }

    return ActionProto;
  }(BaseProto);

  ActionProto.INDEX = BaseProto.INDEX;
  ActionProto.ACTION = "action";

  __decorate([ProtobufProperty({
    id: ActionProto_1.INDEX++,
    type: "string",
    required: true
  })], ActionProto.prototype, "action", void 0);

  __decorate([ProtobufProperty({
    id: ActionProto_1.INDEX++,
    type: "string",
    required: false
  })], ActionProto.prototype, "actionId", void 0);

  ActionProto = ActionProto_1 = __decorate([ProtobufElement({
    name: "Action"
  })], ActionProto);

  var BaseAlgorithmProto = BaseAlgorithmProto_1 =
  /*#__PURE__*/
  function (_BaseProto2) {
    _inherits(BaseAlgorithmProto, _BaseProto2);

    function BaseAlgorithmProto() {
      _classCallCheck(this, BaseAlgorithmProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(BaseAlgorithmProto).apply(this, arguments));
    }

    _createClass(BaseAlgorithmProto, [{
      key: "toAlgorithm",
      value: function toAlgorithm() {
        return {
          name: this.name
        };
      }
    }, {
      key: "fromAlgorithm",
      value: function fromAlgorithm(alg) {
        this.name = alg.name;
      }
    }]);

    return BaseAlgorithmProto;
  }(BaseProto);

  BaseAlgorithmProto.INDEX = BaseProto.INDEX;

  __decorate([ProtobufProperty({
    id: BaseAlgorithmProto_1.INDEX++,
    type: "string",
    required: true
  })], BaseAlgorithmProto.prototype, "name", void 0);

  BaseAlgorithmProto = BaseAlgorithmProto_1 = __decorate([ProtobufElement({
    name: "BaseAlgorithm"
  })], BaseAlgorithmProto);

  var AlgorithmProto = AlgorithmProto_1 =
  /*#__PURE__*/
  function (_BaseAlgorithmProto) {
    _inherits(AlgorithmProto, _BaseAlgorithmProto);

    function AlgorithmProto() {
      _classCallCheck(this, AlgorithmProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(AlgorithmProto).apply(this, arguments));
    }

    _createClass(AlgorithmProto, [{
      key: "toAlgorithm",
      value: function toAlgorithm() {
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
            } else {
              res[key] = value;
            }
          }
        }

        return res;
      }
    }, {
      key: "fromAlgorithm",
      value: function fromAlgorithm(alg) {
        if (alg instanceof AlgorithmProto_1) {
          alg = alg.toAlgorithm();
        }

        var thisStatic = this.constructor;

        for (var key in alg) {
          if (key in thisStatic.items) {
            if (thisStatic.items[key].parser) {
              switch (thisStatic.items[key].parser) {
                case BaseAlgorithmProto:
                  {
                    this[key].fromAlgorithm(alg[key]);
                    break;
                  }

                default:
                  throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CASE_ERROR, "Unsupported parser '".concat(thisStatic.items[key].parser.name, "'"));
              }
            } else {
              this[key] = alg[key];
            }
          }
        }
      }
    }]);

    return AlgorithmProto;
  }(BaseAlgorithmProto);

  AlgorithmProto.INDEX = BaseAlgorithmProto.INDEX;

  __decorate([ProtobufProperty({
    id: AlgorithmProto_1.INDEX++,
    type: "bytes",
    parser: BaseAlgorithmProto
  })], AlgorithmProto.prototype, "hash", void 0);

  __decorate([ProtobufProperty({
    id: AlgorithmProto_1.INDEX++,
    type: "bytes"
  })], AlgorithmProto.prototype, "publicExponent", void 0);

  __decorate([ProtobufProperty({
    id: AlgorithmProto_1.INDEX++,
    type: "uint32"
  })], AlgorithmProto.prototype, "modulusLength", void 0);

  __decorate([ProtobufProperty({
    id: AlgorithmProto_1.INDEX++,
    type: "uint32"
  })], AlgorithmProto.prototype, "saltLength", void 0);

  __decorate([ProtobufProperty({
    id: AlgorithmProto_1.INDEX++,
    type: "bytes"
  })], AlgorithmProto.prototype, "label", void 0);

  __decorate([ProtobufProperty({
    id: AlgorithmProto_1.INDEX++,
    type: "string"
  })], AlgorithmProto.prototype, "namedCurve", void 0);

  __decorate([ProtobufProperty({
    id: AlgorithmProto_1.INDEX++,
    converter: ArrayBufferConverter
  })], AlgorithmProto.prototype, "public", void 0);

  __decorate([ProtobufProperty({
    id: AlgorithmProto_1.INDEX++,
    type: "uint32"
  })], AlgorithmProto.prototype, "length", void 0);

  __decorate([ProtobufProperty({
    id: AlgorithmProto_1.INDEX++
  })], AlgorithmProto.prototype, "iv", void 0);

  AlgorithmProto = AlgorithmProto_1 = __decorate([ProtobufElement({
    name: "Algorithm"
  })], AlgorithmProto);

  var CryptoItemProto = CryptoItemProto_1 =
  /*#__PURE__*/
  function (_BaseProto3) {
    _inherits(CryptoItemProto, _BaseProto3);

    function CryptoItemProto() {
      _classCallCheck(this, CryptoItemProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(CryptoItemProto).apply(this, arguments));
    }

    return CryptoItemProto;
  }(BaseProto);

  CryptoItemProto.INDEX = BaseProto.INDEX;

  __decorate([ProtobufProperty({
    id: CryptoItemProto_1.INDEX++,
    type: "string",
    required: true
  })], CryptoItemProto.prototype, "providerID", void 0);

  __decorate([ProtobufProperty({
    id: CryptoItemProto_1.INDEX++,
    type: "bytes",
    required: true,
    converter: HexStringConverter
  })], CryptoItemProto.prototype, "id", void 0);

  __decorate([ProtobufProperty({
    id: CryptoItemProto_1.INDEX++,
    type: "string",
    required: true
  })], CryptoItemProto.prototype, "type", void 0);

  CryptoItemProto = CryptoItemProto_1 = __decorate([ProtobufElement({
    name: "CryptoItem"
  })], CryptoItemProto);

  var CryptoKeyProto = CryptoKeyProto_1 =
  /*#__PURE__*/
  function (_CryptoItemProto) {
    _inherits(CryptoKeyProto, _CryptoItemProto);

    function CryptoKeyProto() {
      _classCallCheck(this, CryptoKeyProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(CryptoKeyProto).apply(this, arguments));
    }

    return CryptoKeyProto;
  }(CryptoItemProto);

  CryptoKeyProto.INDEX = CryptoItemProto.INDEX;

  __decorate([ProtobufProperty({
    id: CryptoKeyProto_1.INDEX++,
    type: "bytes",
    required: true,
    parser: AlgorithmProto
  })], CryptoKeyProto.prototype, "algorithm", void 0);

  __decorate([ProtobufProperty({
    id: CryptoKeyProto_1.INDEX++,
    type: "bool"
  })], CryptoKeyProto.prototype, "extractable", void 0);

  __decorate([ProtobufProperty({
    id: CryptoKeyProto_1.INDEX++,
    type: "string",
    repeated: true
  })], CryptoKeyProto.prototype, "usages", void 0);

  CryptoKeyProto = CryptoKeyProto_1 = __decorate([ProtobufElement({
    name: "CryptoKey"
  })], CryptoKeyProto);

  var CryptoKeyPairProto = CryptoKeyPairProto_1 =
  /*#__PURE__*/
  function (_BaseProto4) {
    _inherits(CryptoKeyPairProto, _BaseProto4);

    function CryptoKeyPairProto() {
      _classCallCheck(this, CryptoKeyPairProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(CryptoKeyPairProto).apply(this, arguments));
    }

    return CryptoKeyPairProto;
  }(BaseProto);

  CryptoKeyPairProto.INDEX = BaseProto.INDEX;

  __decorate([ProtobufProperty({
    id: CryptoKeyPairProto_1.INDEX++,
    name: "privateKey",
    type: "bytes",
    parser: CryptoKeyProto
  })], CryptoKeyPairProto.prototype, "privateKey", void 0);

  __decorate([ProtobufProperty({
    id: CryptoKeyPairProto_1.INDEX++,
    name: "publicKey",
    type: "bytes",
    parser: CryptoKeyProto
  })], CryptoKeyPairProto.prototype, "publicKey", void 0);

  CryptoKeyPairProto = CryptoKeyPairProto_1 = __decorate([ProtobufElement({
    name: "CryptoKeyPair"
  })], CryptoKeyPairProto);

  var ErrorProto = ErrorProto_1 =
  /*#__PURE__*/
  function (_BaseProto5) {
    _inherits(ErrorProto, _BaseProto5);

    function ErrorProto(message) {
      var _this8;

      var code = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "error";

      _classCallCheck(this, ErrorProto);

      _this8 = _possibleConstructorReturn(this, _getPrototypeOf(ErrorProto).call(this));

      if (message) {
        _this8.message = message;
        _this8.code = code;
        _this8.type = type;
      }

      return _this8;
    }

    return ErrorProto;
  }(BaseProto);

  ErrorProto.INDEX = BaseProto.INDEX;

  __decorate([ProtobufProperty({
    id: ErrorProto_1.INDEX++,
    type: "uint32",
    defaultValue: 0
  })], ErrorProto.prototype, "code", void 0);

  __decorate([ProtobufProperty({
    id: ErrorProto_1.INDEX++,
    type: "string",
    defaultValue: "error"
  })], ErrorProto.prototype, "type", void 0);

  __decorate([ProtobufProperty({
    id: ErrorProto_1.INDEX++,
    type: "string",
    defaultValue: ""
  })], ErrorProto.prototype, "message", void 0);

  ErrorProto = ErrorProto_1 = __decorate([ProtobufElement({
    name: "Error"
  })], ErrorProto);

  var ResultProto = ResultProto_1 =
  /*#__PURE__*/
  function (_ActionProto) {
    _inherits(ResultProto, _ActionProto);

    function ResultProto(proto) {
      var _this9;

      _classCallCheck(this, ResultProto);

      _this9 = _possibleConstructorReturn(this, _getPrototypeOf(ResultProto).call(this));

      if (proto) {
        _this9.actionId = proto.actionId;
        _this9.action = proto.action;
      }

      return _this9;
    }

    return ResultProto;
  }(ActionProto);

  ResultProto.INDEX = ActionProto.INDEX;

  __decorate([ProtobufProperty({
    id: ResultProto_1.INDEX++,
    type: "bool",
    defaultValue: false
  })], ResultProto.prototype, "status", void 0);

  __decorate([ProtobufProperty({
    id: ResultProto_1.INDEX++,
    type: "bytes",
    parser: ErrorProto
  })], ResultProto.prototype, "error", void 0);

  __decorate([ProtobufProperty({
    id: ResultProto_1.INDEX++,
    type: "bytes",
    converter: ArrayBufferConverter
  })], ResultProto.prototype, "data", void 0);

  ResultProto = ResultProto_1 = __decorate([ProtobufElement({
    name: "Result"
  })], ResultProto);

  var AuthRequestProto =
  /*#__PURE__*/
  function (_ActionProto2) {
    _inherits(AuthRequestProto, _ActionProto2);

    function AuthRequestProto() {
      _classCallCheck(this, AuthRequestProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(AuthRequestProto).apply(this, arguments));
    }

    return AuthRequestProto;
  }(ActionProto);

  AuthRequestProto.INDEX = ActionProto.INDEX;
  AuthRequestProto.ACTION = "auth";
  AuthRequestProto = __decorate([ProtobufElement({
    name: "AuthRequest"
  })], AuthRequestProto);

  var ServerLoginActionProto =
  /*#__PURE__*/
  function (_ActionProto3) {
    _inherits(ServerLoginActionProto, _ActionProto3);

    function ServerLoginActionProto() {
      _classCallCheck(this, ServerLoginActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(ServerLoginActionProto).apply(this, arguments));
    }

    return ServerLoginActionProto;
  }(ActionProto);

  ServerLoginActionProto.INDEX = ActionProto.INDEX;
  ServerLoginActionProto.ACTION = "server/login";
  ServerLoginActionProto = __decorate([ProtobufElement({})], ServerLoginActionProto);

  var ServerIsLoggedInActionProto =
  /*#__PURE__*/
  function (_ActionProto4) {
    _inherits(ServerIsLoggedInActionProto, _ActionProto4);

    function ServerIsLoggedInActionProto() {
      _classCallCheck(this, ServerIsLoggedInActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(ServerIsLoggedInActionProto).apply(this, arguments));
    }

    return ServerIsLoggedInActionProto;
  }(ActionProto);

  ServerIsLoggedInActionProto.INDEX = ActionProto.INDEX;
  ServerIsLoggedInActionProto.ACTION = "server/isLoggedIn";
  ServerIsLoggedInActionProto = __decorate([ProtobufElement({})], ServerIsLoggedInActionProto);

  function _challenge2(_x68, _x69) {
    return _challenge.apply(this, arguments);
  }

  function _challenge() {
    _challenge = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee123(serverIdentity, clientIdentity) {
      var serverIdentityDigest, clientIdentityDigest, combinedIdentity, digest;
      return regeneratorRuntime.wrap(function _callee123$(_context123) {
        while (1) {
          switch (_context123.prev = _context123.next) {
            case 0:
              _context123.next = 2;
              return serverIdentity.thumbprint();

            case 2:
              serverIdentityDigest = _context123.sent;
              _context123.next = 5;
              return clientIdentity.thumbprint();

            case 5:
              clientIdentityDigest = _context123.sent;
              combinedIdentity = Convert.FromHex(serverIdentityDigest + clientIdentityDigest);
              _context123.next = 9;
              return getEngine().crypto.subtle.digest("SHA-256", combinedIdentity);

            case 9:
              digest = _context123.sent;
              return _context123.abrupt("return", parseInt(Convert.ToHex(digest), 16).toString().substr(2, 6));

            case 11:
            case "end":
              return _context123.stop();
          }
        }
      }, _callee123, this);
    }));
    return _challenge.apply(this, arguments);
  }

  var SERVER_WELL_KNOWN = "/.well-known/webcrypto-socket";

  function toArray(arr) {
    return Array.prototype.slice.call(arr);
  }

  function promisifyRequest(request) {
    return new Promise(function (resolve, reject) {
      request.onsuccess = function () {
        resolve(request.result);
      };

      request.onerror = function () {
        reject(request.error);
      };
    });
  }

  function promisifyRequestCall(obj, method, args) {
    var request;
    var p = new Promise(function (resolve, reject) {
      request = obj[method].apply(obj, args);
      promisifyRequest(request).then(resolve, reject);
    });
    p.request = request;
    return p;
  }

  function promisifyCursorRequestCall(obj, method, args) {
    var p = promisifyRequestCall(obj, method, args);
    return p.then(function (value) {
      if (!value) return;
      return new Cursor(value, p.request);
    });
  }

  function proxyProperties(ProxyClass, targetProp, properties) {
    properties.forEach(function (prop) {
      Object.defineProperty(ProxyClass.prototype, prop, {
        get: function get() {
          return this[targetProp][prop];
        },
        set: function set(val) {
          this[targetProp][prop] = val;
        }
      });
    });
  }

  function proxyRequestMethods(ProxyClass, targetProp, Constructor, properties) {
    properties.forEach(function (prop) {
      if (!(prop in Constructor.prototype)) return;

      ProxyClass.prototype[prop] = function () {
        return promisifyRequestCall(this[targetProp], prop, arguments);
      };
    });
  }

  function proxyMethods(ProxyClass, targetProp, Constructor, properties) {
    properties.forEach(function (prop) {
      if (!(prop in Constructor.prototype)) return;

      ProxyClass.prototype[prop] = function () {
        return this[targetProp][prop].apply(this[targetProp], arguments);
      };
    });
  }

  function proxyCursorRequestMethods(ProxyClass, targetProp, Constructor, properties) {
    properties.forEach(function (prop) {
      if (!(prop in Constructor.prototype)) return;

      ProxyClass.prototype[prop] = function () {
        return promisifyCursorRequestCall(this[targetProp], prop, arguments);
      };
    });
  }

  function Index(index) {
    this._index = index;
  }

  proxyProperties(Index, '_index', ['name', 'keyPath', 'multiEntry', 'unique']);
  proxyRequestMethods(Index, '_index', IDBIndex, ['get', 'getKey', 'getAll', 'getAllKeys', 'count']);
  proxyCursorRequestMethods(Index, '_index', IDBIndex, ['openCursor', 'openKeyCursor']);

  function Cursor(cursor, request) {
    this._cursor = cursor;
    this._request = request;
  }

  proxyProperties(Cursor, '_cursor', ['direction', 'key', 'primaryKey', 'value']);
  proxyRequestMethods(Cursor, '_cursor', IDBCursor, ['update', 'delete']); // proxy 'next' methods

  ['advance', 'continue', 'continuePrimaryKey'].forEach(function (methodName) {
    if (!(methodName in IDBCursor.prototype)) return;

    Cursor.prototype[methodName] = function () {
      var cursor = this;
      var args = arguments;
      return Promise.resolve().then(function () {
        cursor._cursor[methodName].apply(cursor._cursor, args);

        return promisifyRequest(cursor._request).then(function (value) {
          if (!value) return;
          return new Cursor(value, cursor._request);
        });
      });
    };
  });

  function ObjectStore(store) {
    this._store = store;
  }

  ObjectStore.prototype.createIndex = function () {
    return new Index(this._store.createIndex.apply(this._store, arguments));
  };

  ObjectStore.prototype.index = function () {
    return new Index(this._store.index.apply(this._store, arguments));
  };

  proxyProperties(ObjectStore, '_store', ['name', 'keyPath', 'indexNames', 'autoIncrement']);
  proxyRequestMethods(ObjectStore, '_store', IDBObjectStore, ['put', 'add', 'delete', 'clear', 'get', 'getAll', 'getKey', 'getAllKeys', 'count']);
  proxyCursorRequestMethods(ObjectStore, '_store', IDBObjectStore, ['openCursor', 'openKeyCursor']);
  proxyMethods(ObjectStore, '_store', IDBObjectStore, ['deleteIndex']);

  function Transaction(idbTransaction) {
    this._tx = idbTransaction;
    this.complete = new Promise(function (resolve, reject) {
      idbTransaction.oncomplete = function () {
        resolve();
      };

      idbTransaction.onerror = function () {
        reject(idbTransaction.error);
      };

      idbTransaction.onabort = function () {
        reject(idbTransaction.error);
      };
    });
  }

  Transaction.prototype.objectStore = function () {
    return new ObjectStore(this._tx.objectStore.apply(this._tx, arguments));
  };

  proxyProperties(Transaction, '_tx', ['objectStoreNames', 'mode']);
  proxyMethods(Transaction, '_tx', IDBTransaction, ['abort']);

  function UpgradeDB(db, oldVersion, transaction) {
    this._db = db;
    this.oldVersion = oldVersion;
    this.transaction = new Transaction(transaction);
  }

  UpgradeDB.prototype.createObjectStore = function () {
    return new ObjectStore(this._db.createObjectStore.apply(this._db, arguments));
  };

  proxyProperties(UpgradeDB, '_db', ['name', 'version', 'objectStoreNames']);
  proxyMethods(UpgradeDB, '_db', IDBDatabase, ['deleteObjectStore', 'close']);

  function DB(db) {
    this._db = db;
  }

  DB.prototype.transaction = function () {
    return new Transaction(this._db.transaction.apply(this._db, arguments));
  };

  proxyProperties(DB, '_db', ['name', 'version', 'objectStoreNames']);
  proxyMethods(DB, '_db', IDBDatabase, ['close']); // Add cursor iterators
  // TODO: remove this once browsers do the right thing with promises

  ['openCursor', 'openKeyCursor'].forEach(function (funcName) {
    [ObjectStore, Index].forEach(function (Constructor) {
      // Don't create iterateKeyCursor if openKeyCursor doesn't exist.
      if (!(funcName in Constructor.prototype)) return;

      Constructor.prototype[funcName.replace('open', 'iterate')] = function () {
        var args = toArray(arguments);
        var callback = args[args.length - 1];
        var nativeObject = this._store || this._index;
        var request = nativeObject[funcName].apply(nativeObject, args.slice(0, -1));

        request.onsuccess = function () {
          callback(request.result);
        };
      };
    });
  }); // polyfill getAll

  [Index, ObjectStore].forEach(function (Constructor) {
    if (Constructor.prototype.getAll) return;

    Constructor.prototype.getAll = function (query, count) {
      var instance = this;
      var items = [];
      return new Promise(function (resolve) {
        instance.iterateCursor(query, function (cursor) {
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
      request.onupgradeneeded = function (event) {
        if (upgradeCallback) {
          upgradeCallback(new UpgradeDB(request.result, event.oldVersion, request.transaction));
        }
      };
    }

    return p.then(function (db) {
      return new DB(db);
    });
  }

  function isFirefox() {
    return /firefox/i.test(self.navigator.userAgent);
  }

  function isEdge() {
    return /edge\/([\d\.]+)/i.test(self.navigator.userAgent);
  }

  var ECDH = {
    name: "ECDH",
    namedCurve: "P-256"
  };
  var ECDSA = {
    name: "ECDSA",
    namedCurve: "P-256"
  };
  var AES_CBC = {
    name: "AES-CBC",
    iv: new ArrayBuffer(16)
  };

  function createEcPublicKey(_x70) {
    return _createEcPublicKey.apply(this, arguments);
  }

  function _createEcPublicKey() {
    _createEcPublicKey = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee124(publicKey) {
      var algName, jwk, x, y, xy, key, serialized, id;
      return regeneratorRuntime.wrap(function _callee124$(_context124) {
        while (1) {
          switch (_context124.prev = _context124.next) {
            case 0:
              algName = publicKey.algorithm.name.toUpperCase();

              if (algName === "ECDH" || algName === "ECDSA") {
                _context124.next = 3;
                break;
              }

              throw new Error("Error: Unsupported asymmetric key algorithm.");

            case 3:
              if (!(publicKey.type !== "public")) {
                _context124.next = 5;
                break;
              }

              throw new Error("Error: Expected key type to be public but it was not.");

            case 5:
              _context124.next = 7;
              return getEngine().crypto.subtle.exportKey("jwk", publicKey);

            case 7:
              jwk = _context124.sent;

              if (jwk.x && jwk.y) {
                _context124.next = 10;
                break;
              }

              throw new Error("Wrong JWK data for EC public key. Parameters x and y are required.");

            case 10:
              x = Convert.FromBase64Url(jwk.x);
              y = Convert.FromBase64Url(jwk.y);
              xy = Convert.ToBinary(x) + Convert.ToBinary(y);
              key = publicKey;
              serialized = Convert.FromBinary(xy);
              _context124.t0 = Convert;
              _context124.next = 18;
              return getEngine().crypto.subtle.digest("SHA-256", serialized);

            case 18:
              _context124.t1 = _context124.sent;
              id = _context124.t0.ToHex.call(_context124.t0, _context124.t1);
              return _context124.abrupt("return", {
                id: id,
                key: key,
                serialized: serialized
              });

            case 21:
            case "end":
              return _context124.stop();
          }
        }
      }, _callee124, this);
    }));
    return _createEcPublicKey.apply(this, arguments);
  }

  function updateEcPublicKey(_x71, _x72) {
    return _updateEcPublicKey.apply(this, arguments);
  }

  function _updateEcPublicKey() {
    _updateEcPublicKey = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee125(ecPublicKey, publicKey) {
      var data;
      return regeneratorRuntime.wrap(function _callee125$(_context125) {
        while (1) {
          switch (_context125.prev = _context125.next) {
            case 0:
              _context125.next = 2;
              return createEcPublicKey(publicKey);

            case 2:
              data = _context125.sent;
              ecPublicKey.id = data.id;
              ecPublicKey.key = data.key;
              ecPublicKey.serialized = data.serialized;

            case 6:
            case "end":
              return _context125.stop();
          }
        }
      }, _callee125, this);
    }));
    return _updateEcPublicKey.apply(this, arguments);
  }

  var BrowserStorage =
  /*#__PURE__*/
  function () {
    function BrowserStorage(db) {
      _classCallCheck(this, BrowserStorage);

      this.db = db;
    }

    _createClass(BrowserStorage, [{
      key: "loadWrapKey",
      value: function () {
        var _loadWrapKey = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee62() {
          var wKey;
          return regeneratorRuntime.wrap(function _callee62$(_context62) {
            while (1) {
              switch (_context62.prev = _context62.next) {
                case 0:
                  _context62.next = 2;
                  return this.db.transaction(BrowserStorage.IDENTITY_STORAGE).objectStore(BrowserStorage.IDENTITY_STORAGE).get("wkey");

                case 2:
                  wKey = _context62.sent;

                  if (!wKey) {
                    _context62.next = 11;
                    break;
                  }

                  if (!isEdge()) {
                    _context62.next = 10;
                    break;
                  }

                  if (wKey.key instanceof ArrayBuffer) {
                    _context62.next = 7;
                    break;
                  }

                  return _context62.abrupt("return", null);

                case 7:
                  _context62.next = 9;
                  return getEngine().crypto.subtle.importKey("raw", wKey.key, {
                    name: AES_CBC.name,
                    length: 256
                  }, false, ["encrypt", "decrypt", "wrapKey", "unwrapKey"]);

                case 9:
                  wKey.key = _context62.sent;

                case 10:
                  AES_CBC.iv = wKey.iv;

                case 11:
                  return _context62.abrupt("return", wKey || null);

                case 12:
                case "end":
                  return _context62.stop();
              }
            }
          }, _callee62, this);
        }));

        function loadWrapKey() {
          return _loadWrapKey.apply(this, arguments);
        }

        return loadWrapKey;
      }()
    }, {
      key: "saveWrapKey",
      value: function () {
        var _saveWrapKey = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee63(key) {
          var tx;
          return regeneratorRuntime.wrap(function _callee63$(_context63) {
            while (1) {
              switch (_context63.prev = _context63.next) {
                case 0:
                  if (!isEdge()) {
                    _context63.next = 6;
                    break;
                  }

                  _context63.next = 3;
                  return getEngine().crypto.subtle.exportKey("raw", key.key);

                case 3:
                  _context63.t0 = _context63.sent;
                  _context63.t1 = key.iv;
                  key = {
                    key: _context63.t0,
                    iv: _context63.t1
                  };

                case 6:
                  tx = this.db.transaction(BrowserStorage.IDENTITY_STORAGE, "readwrite");
                  tx.objectStore(BrowserStorage.IDENTITY_STORAGE).put(key, "wkey");
                  return _context63.abrupt("return", tx.complete);

                case 9:
                case "end":
                  return _context63.stop();
              }
            }
          }, _callee63, this);
        }));

        function saveWrapKey(_x73) {
          return _saveWrapKey.apply(this, arguments);
        }

        return saveWrapKey;
      }()
    }, {
      key: "loadIdentity",
      value: function () {
        var _loadIdentity = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee64() {
          var json, res, wkey;
          return regeneratorRuntime.wrap(function _callee64$(_context64) {
            while (1) {
              switch (_context64.prev = _context64.next) {
                case 0:
                  _context64.next = 2;
                  return this.db.transaction(BrowserStorage.IDENTITY_STORAGE).objectStore(BrowserStorage.IDENTITY_STORAGE).get("identity");

                case 2:
                  json = _context64.sent;
                  res = null;

                  if (!json) {
                    _context64.next = 27;
                    break;
                  }

                  if (!(isFirefox() || isEdge())) {
                    _context64.next = 24;
                    break;
                  }

                  _context64.next = 8;
                  return this.loadWrapKey();

                case 8:
                  wkey = _context64.sent;

                  if (wkey && wkey.key.usages.some(function (usage) {
                    return usage === "encrypt";
                  }) && json.exchangeKey.privateKey instanceof ArrayBuffer) {
                    _context64.next = 11;
                    break;
                  }

                  return _context64.abrupt("return", null);

                case 11:
                  _context64.next = 13;
                  return getEngine().crypto.subtle.decrypt(AES_CBC, wkey.key, json.exchangeKey.privateKey).then(function (buf) {
                    return getEngine().crypto.subtle.importKey("jwk", JSON.parse(Convert.ToUtf8String(buf)), ECDH, false, ["deriveKey", "deriveBits"]);
                  });

                case 13:
                  json.exchangeKey.privateKey = _context64.sent;
                  _context64.next = 16;
                  return getEngine().crypto.subtle.decrypt(AES_CBC, wkey.key, json.signingKey.privateKey).then(function (buf) {
                    return getEngine().crypto.subtle.importKey("jwk", JSON.parse(Convert.ToUtf8String(buf)), ECDSA, false, ["sign"]);
                  });

                case 16:
                  json.signingKey.privateKey = _context64.sent;

                  if (!isEdge()) {
                    _context64.next = 24;
                    break;
                  }

                  _context64.next = 20;
                  return getEngine().crypto.subtle.unwrapKey("jwk", json.exchangeKey.publicKey, wkey.key, AES_CBC, ECDH, true, []);

                case 20:
                  json.exchangeKey.publicKey = _context64.sent;
                  _context64.next = 23;
                  return getEngine().crypto.subtle.unwrapKey("jwk", json.signingKey.publicKey, wkey.key, AES_CBC, ECDSA, true, ["verify"]);

                case 23:
                  json.signingKey.publicKey = _context64.sent;

                case 24:
                  _context64.next = 26;
                  return Identity.fromJSON(json);

                case 26:
                  res = _context64.sent;

                case 27:
                  return _context64.abrupt("return", res);

                case 28:
                case "end":
                  return _context64.stop();
              }
            }
          }, _callee64, this);
        }));

        function loadIdentity() {
          return _loadIdentity.apply(this, arguments);
        }

        return loadIdentity;
      }()
    }, {
      key: "saveIdentity",
      value: function () {
        var _saveIdentity = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee65(value) {
          var wkey, exchangeKeyPair, signingKeyPair, json, tx;
          return regeneratorRuntime.wrap(function _callee65$(_context65) {
            while (1) {
              switch (_context65.prev = _context65.next) {
                case 0:
                  if (!(isFirefox() || isEdge())) {
                    _context65.next = 20;
                    break;
                  }

                  _context65.next = 3;
                  return getEngine().crypto.subtle.generateKey({
                    name: AES_CBC.name,
                    length: 256
                  }, isEdge(), ["wrapKey", "unwrapKey", "encrypt", "decrypt"]);

                case 3:
                  _context65.t0 = _context65.sent;
                  _context65.t1 = getEngine().crypto.getRandomValues(new Uint8Array(AES_CBC.iv)).buffer;
                  wkey = {
                    key: _context65.t0,
                    iv: _context65.t1
                  };
                  _context65.next = 8;
                  return this.saveWrapKey(wkey);

                case 8:
                  _context65.next = 10;
                  return getEngine().crypto.subtle.generateKey(value.exchangeKey.privateKey.algorithm, true, ["deriveKey", "deriveBits"]);

                case 10:
                  exchangeKeyPair = _context65.sent;
                  value.exchangeKey.privateKey = exchangeKeyPair.privateKey;
                  _context65.next = 14;
                  return updateEcPublicKey(value.exchangeKey.publicKey, exchangeKeyPair.publicKey);

                case 14:
                  _context65.next = 16;
                  return getEngine().crypto.subtle.generateKey(value.signingKey.privateKey.algorithm, true, ["sign", "verify"]);

                case 16:
                  signingKeyPair = _context65.sent;
                  value.signingKey.privateKey = signingKeyPair.privateKey;
                  _context65.next = 20;
                  return updateEcPublicKey(value.signingKey.publicKey, signingKeyPair.publicKey);

                case 20:
                  _context65.next = 22;
                  return value.toJSON();

                case 22:
                  json = _context65.sent;

                  if (!(isFirefox() || isEdge())) {
                    _context65.next = 37;
                    break;
                  }

                  _context65.next = 26;
                  return getEngine().crypto.subtle.wrapKey("jwk", value.exchangeKey.privateKey, wkey.key, AES_CBC);

                case 26:
                  json.exchangeKey.privateKey = _context65.sent;
                  _context65.next = 29;
                  return getEngine().crypto.subtle.wrapKey("jwk", value.signingKey.privateKey, wkey.key, AES_CBC);

                case 29:
                  json.signingKey.privateKey = _context65.sent;

                  if (!isEdge()) {
                    _context65.next = 37;
                    break;
                  }

                  _context65.next = 33;
                  return getEngine().crypto.subtle.wrapKey("jwk", value.exchangeKey.publicKey.key, wkey.key, AES_CBC);

                case 33:
                  json.exchangeKey.publicKey = _context65.sent;
                  _context65.next = 36;
                  return getEngine().crypto.subtle.wrapKey("jwk", value.signingKey.publicKey.key, wkey.key, AES_CBC);

                case 36:
                  json.signingKey.publicKey = _context65.sent;

                case 37:
                  tx = this.db.transaction(BrowserStorage.IDENTITY_STORAGE, "readwrite");
                  tx.objectStore(BrowserStorage.IDENTITY_STORAGE).put(json, "identity");
                  return _context65.abrupt("return", tx.complete);

                case 40:
                case "end":
                  return _context65.stop();
              }
            }
          }, _callee65, this);
        }));

        function saveIdentity(_x74) {
          return _saveIdentity.apply(this, arguments);
        }

        return saveIdentity;
      }()
    }, {
      key: "loadRemoteIdentity",
      value: function () {
        var _loadRemoteIdentity = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee66(key) {
          var json, res;
          return regeneratorRuntime.wrap(function _callee66$(_context66) {
            while (1) {
              switch (_context66.prev = _context66.next) {
                case 0:
                  _context66.next = 2;
                  return this.db.transaction(BrowserStorage.REMOTE_STORAGE).objectStore(BrowserStorage.REMOTE_STORAGE).get(key);

                case 2:
                  json = _context66.sent;
                  res = null;

                  if (!json) {
                    _context66.next = 8;
                    break;
                  }

                  _context66.next = 7;
                  return RemoteIdentity.fromJSON(json);

                case 7:
                  res = _context66.sent;

                case 8:
                  return _context66.abrupt("return", res);

                case 9:
                case "end":
                  return _context66.stop();
              }
            }
          }, _callee66, this);
        }));

        function loadRemoteIdentity(_x75) {
          return _loadRemoteIdentity.apply(this, arguments);
        }

        return loadRemoteIdentity;
      }()
    }, {
      key: "saveRemoteIdentity",
      value: function () {
        var _saveRemoteIdentity = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee67(key, value) {
          var json, tx;
          return regeneratorRuntime.wrap(function _callee67$(_context67) {
            while (1) {
              switch (_context67.prev = _context67.next) {
                case 0:
                  _context67.next = 2;
                  return value.toJSON();

                case 2:
                  json = _context67.sent;
                  tx = this.db.transaction(BrowserStorage.REMOTE_STORAGE, "readwrite");
                  tx.objectStore(BrowserStorage.REMOTE_STORAGE).put(json, key);
                  return _context67.abrupt("return", tx.complete);

                case 6:
                case "end":
                  return _context67.stop();
              }
            }
          }, _callee67, this);
        }));

        function saveRemoteIdentity(_x76, _x77) {
          return _saveRemoteIdentity.apply(this, arguments);
        }

        return saveRemoteIdentity;
      }()
    }, {
      key: "loadSession",
      value: function () {
        var _loadSession = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee68(key) {
          var json, res, identity, remoteIdentity;
          return regeneratorRuntime.wrap(function _callee68$(_context68) {
            while (1) {
              switch (_context68.prev = _context68.next) {
                case 0:
                  _context68.next = 2;
                  return this.db.transaction(BrowserStorage.SESSION_STORAGE).objectStore(BrowserStorage.SESSION_STORAGE).get(key);

                case 2:
                  json = _context68.sent;
                  res = null;

                  if (!json) {
                    _context68.next = 18;
                    break;
                  }

                  _context68.next = 7;
                  return this.loadIdentity();

                case 7:
                  identity = _context68.sent;

                  if (identity) {
                    _context68.next = 10;
                    break;
                  }

                  throw new Error("Identity is empty");

                case 10:
                  _context68.next = 12;
                  return this.loadRemoteIdentity(key);

                case 12:
                  remoteIdentity = _context68.sent;

                  if (remoteIdentity) {
                    _context68.next = 15;
                    break;
                  }

                  throw new Error("Remote identity is not found");

                case 15:
                  _context68.next = 17;
                  return AsymmetricRatchet.fromJSON(identity, remoteIdentity, json);

                case 17:
                  res = _context68.sent;

                case 18:
                  return _context68.abrupt("return", res);

                case 19:
                case "end":
                  return _context68.stop();
              }
            }
          }, _callee68, this);
        }));

        function loadSession(_x78) {
          return _loadSession.apply(this, arguments);
        }

        return loadSession;
      }()
    }, {
      key: "saveSession",
      value: function () {
        var _saveSession = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee69(key, value) {
          var json, tx;
          return regeneratorRuntime.wrap(function _callee69$(_context69) {
            while (1) {
              switch (_context69.prev = _context69.next) {
                case 0:
                  _context69.next = 2;
                  return value.toJSON();

                case 2:
                  json = _context69.sent;
                  tx = this.db.transaction(BrowserStorage.SESSION_STORAGE, "readwrite");
                  tx.objectStore(BrowserStorage.SESSION_STORAGE).put(json, key);
                  return _context69.abrupt("return", tx.complete);

                case 6:
                case "end":
                  return _context69.stop();
              }
            }
          }, _callee69, this);
        }));

        function saveSession(_x79, _x80) {
          return _saveSession.apply(this, arguments);
        }

        return saveSession;
      }()
    }], [{
      key: "create",
      value: function () {
        var _create4 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee70() {
          var _this10 = this;

          var db;
          return regeneratorRuntime.wrap(function _callee70$(_context70) {
            while (1) {
              switch (_context70.prev = _context70.next) {
                case 0:
                  _context70.next = 2;
                  return openDb(this.STORAGE_NAME, 1, function (updater) {
                    updater.createObjectStore(_this10.SESSION_STORAGE);
                    updater.createObjectStore(_this10.IDENTITY_STORAGE);
                    updater.createObjectStore(_this10.REMOTE_STORAGE);
                  });

                case 2:
                  db = _context70.sent;
                  return _context70.abrupt("return", new BrowserStorage(db));

                case 4:
                case "end":
                  return _context70.stop();
              }
            }
          }, _callee70, this);
        }));

        function create() {
          return _create4.apply(this, arguments);
        }

        return create;
      }()
    }]);

    return BrowserStorage;
  }();

  BrowserStorage.STORAGE_NAME = "webcrypto-remote";
  BrowserStorage.IDENTITY_STORAGE = "identity";
  BrowserStorage.SESSION_STORAGE = "sessions";
  BrowserStorage.REMOTE_STORAGE = "remoteIdentity";

  var ClientEvent =
  /*#__PURE__*/
  function (_Event) {
    _inherits(ClientEvent, _Event);

    function ClientEvent() {
      _classCallCheck(this, ClientEvent);

      return _possibleConstructorReturn(this, _getPrototypeOf(ClientEvent).apply(this, arguments));
    }

    return ClientEvent;
  }(Event);

  var ClientListeningEvent =
  /*#__PURE__*/
  function (_ClientEvent) {
    _inherits(ClientListeningEvent, _ClientEvent);

    function ClientListeningEvent(target, address) {
      var _this11;

      _classCallCheck(this, ClientListeningEvent);

      _this11 = _possibleConstructorReturn(this, _getPrototypeOf(ClientListeningEvent).call(this, target, "listening"));
      _this11.address = address;
      return _this11;
    }

    return ClientListeningEvent;
  }(ClientEvent);

  var ClientCloseEvent =
  /*#__PURE__*/
  function (_ClientEvent2) {
    _inherits(ClientCloseEvent, _ClientEvent2);

    function ClientCloseEvent(target, remoteAddress, reasonCode, description) {
      var _this12;

      _classCallCheck(this, ClientCloseEvent);

      _this12 = _possibleConstructorReturn(this, _getPrototypeOf(ClientCloseEvent).call(this, target, "close"));
      _this12.remoteAddress = remoteAddress;
      _this12.reasonCode = reasonCode;
      _this12.description = description;
      return _this12;
    }

    return ClientCloseEvent;
  }(ClientEvent);

  var ClientErrorEvent =
  /*#__PURE__*/
  function (_ClientEvent3) {
    _inherits(ClientErrorEvent, _ClientEvent3);

    function ClientErrorEvent(target, error) {
      var _this13;

      _classCallCheck(this, ClientErrorEvent);

      _this13 = _possibleConstructorReturn(this, _getPrototypeOf(ClientErrorEvent).call(this, target, "error"));
      _this13.error = error;
      return _this13;
    }

    return ClientErrorEvent;
  }(ClientEvent);

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
    } catch (e) {
      try {
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {}
    }

    if (!xmlHttp && typeof XMLHttpRequest !== "undefined") {
      xmlHttp = new XMLHttpRequest();
    }

    return xmlHttp;
  }

  var Client =
  /*#__PURE__*/
  function (_EventEmitter2) {
    _inherits(Client, _EventEmitter2);

    function Client() {
      var _this14;

      _classCallCheck(this, Client);

      _this14 = _possibleConstructorReturn(this, _getPrototypeOf(Client).call(this));
      _this14.stack = {};
      _this14.messageCounter = 0;
      return _this14;
    }

    _createClass(Client, [{
      key: "connect",
      value: function connect(address) {
        var _this15 = this;

        this.getServerInfo(address).then(function (info) {
          _this15.serviceInfo = info;
          _this15.socket = new WebSocket("wss://".concat(address));
          _this15.socket.binaryType = "arraybuffer";

          _this15.socket.onerror = function (e) {
            _this15.emit("error", new ClientErrorEvent(_this15, e.error));
          };

          _this15.socket.onopen = function (e) {
            _asyncToGenerator(
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee71() {
              var storage, identity, remoteIdentityId, bundle;
              return regeneratorRuntime.wrap(function _callee71$(_context71) {
                while (1) {
                  switch (_context71.prev = _context71.next) {
                    case 0:
                      _context71.next = 2;
                      return BrowserStorage.create();

                    case 2:
                      storage = _context71.sent;
                      _context71.next = 5;
                      return storage.loadIdentity();

                    case 5:
                      identity = _context71.sent;

                      if (identity) {
                        _context71.next = 13;
                        break;
                      }

                      if (self.PV_WEBCRYPTO_SOCKET_LOG) {
                        console.info("Generates new identity");
                      }

                      _context71.next = 10;
                      return Identity.create(1);

                    case 10:
                      identity = _context71.sent;
                      _context71.next = 13;
                      return storage.saveIdentity(identity);

                    case 13:
                      remoteIdentityId = "0";
                      _context71.next = 16;
                      return PreKeyBundleProtocol.importProto(Convert.FromBase64(info.preKey));

                    case 16:
                      bundle = _context71.sent;
                      _context71.next = 19;
                      return AsymmetricRatchet.create(identity, bundle);

                    case 19:
                      _this15.cipher = _context71.sent;
                      _context71.next = 22;
                      return storage.saveRemoteIdentity(remoteIdentityId, _this15.cipher.remoteIdentity);

                    case 22:
                      _this15.emit("listening", new ClientListeningEvent(_this15, address));

                    case 23:
                    case "end":
                      return _context71.stop();
                  }
                }
              }, _callee71, this);
            }))().catch(function (error) {
              return _this15.emit("error", new ClientErrorEvent(_this15, error));
            });
          };

          _this15.socket.onclose = function (e) {
            for (var actionId in _this15.stack) {
              var message = _this15.stack[actionId];
              message.reject(new Error("Cannot finish operation. Session was closed"));
            }

            _this15.emit("close", new ClientCloseEvent(_this15, address, e.code, e.reason));
          };

          _this15.socket.onmessage = function (e) {
            if (e.data instanceof ArrayBuffer) {
              MessageSignedProtocol.importProto(e.data).then(function (proto) {
                return _this15.cipher.decrypt(proto);
              }).then(function (msg) {
                _this15.onMessage(msg);
              }).catch(function (err) {
                _this15.emit("error", new ClientErrorEvent(_this15, err));
              });
            }
          };
        }).catch(function (err) {
          _this15.emit("error", new ClientErrorEvent(_this15, err));
        });
        return this;
      }
    }, {
      key: "close",
      value: function close() {
        this.socket.close();
      }
    }, {
      key: "on",
      value: function on(event, listener) {
        return _get(_getPrototypeOf(Client.prototype), "on", this).call(this, event, listener);
      }
    }, {
      key: "once",
      value: function once(event, listener) {
        return _get(_getPrototypeOf(Client.prototype), "once", this).call(this, event, listener);
      }
    }, {
      key: "challenge",
      value: function () {
        var _challenge3 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee72() {
          return regeneratorRuntime.wrap(function _callee72$(_context72) {
            while (1) {
              switch (_context72.prev = _context72.next) {
                case 0:
                  return _context72.abrupt("return", _challenge2(this.cipher.remoteIdentity.signingKey, this.cipher.identity.signingKey.publicKey));

                case 1:
                case "end":
                  return _context72.stop();
              }
            }
          }, _callee72, this);
        }));

        function challenge() {
          return _challenge3.apply(this, arguments);
        }

        return challenge;
      }()
    }, {
      key: "isLoggedIn",
      value: function () {
        var _isLoggedIn = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee73() {
          var action, data;
          return regeneratorRuntime.wrap(function _callee73$(_context73) {
            while (1) {
              switch (_context73.prev = _context73.next) {
                case 0:
                  action = new ServerIsLoggedInActionProto();
                  _context73.next = 3;
                  return this.send(action);

                case 3:
                  data = _context73.sent;
                  return _context73.abrupt("return", data ? !!new Uint8Array(data)[0] : false);

                case 5:
                case "end":
                  return _context73.stop();
              }
            }
          }, _callee73, this);
        }));

        function isLoggedIn() {
          return _isLoggedIn.apply(this, arguments);
        }

        return isLoggedIn;
      }()
    }, {
      key: "login",
      value: function () {
        var _login = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee74() {
          var action;
          return regeneratorRuntime.wrap(function _callee74$(_context74) {
            while (1) {
              switch (_context74.prev = _context74.next) {
                case 0:
                  action = new ServerLoginActionProto();
                  _context74.next = 3;
                  return this.send(action);

                case 3:
                case "end":
                  return _context74.stop();
              }
            }
          }, _callee74, this);
        }));

        function login() {
          return _login.apply(this, arguments);
        }

        return login;
      }()
    }, {
      key: "send",
      value: function send(data) {
        var _this16 = this;

        return new Promise(function (resolve, reject) {
          _this16.checkSocketState();

          if (!data) {
            data = new ActionProto();
          }

          data.action = data.action;
          data.actionId = (_this16.messageCounter++).toString();
          data.exportProto().then(function (raw) {
            return _this16.cipher.encrypt(raw).then(function (msg) {
              return msg.exportProto();
            });
          }).then(function (raw) {
            _this16.stack[data.actionId] = {
              resolve: resolve,
              reject: reject
            };

            _this16.socket.send(raw);
          }).catch(reject);
        });
      }
    }, {
      key: "getServerInfo",
      value: function getServerInfo(address) {
        return new Promise(function (resolve, reject) {
          var url = "https://".concat(address).concat(SERVER_WELL_KNOWN);

          if (self.fetch) {
            fetch(url).then(function (response) {
              if (response.status !== 200) {
                throw new Error("Cannot get wellknown link");
              } else {
                return response.json();
              }
            }).then(resolve).catch(reject);
          } else {
            var xmlHttp = getXmlHttp();
            xmlHttp.open("GET", "http://".concat(address).concat(SERVER_WELL_KNOWN), true);
            xmlHttp.responseType = "text";

            xmlHttp.onreadystatechange = function () {
              if (xmlHttp.readyState === 4) {
                if (xmlHttp.status === 200) {
                  var json = JSON.parse(xmlHttp.responseText);
                  resolve(json);
                } else {
                  reject(new Error("Cannot GET response"));
                }
              }
            };

            xmlHttp.send(null);
          }
        });
      }
    }, {
      key: "checkSocketState",
      value: function checkSocketState() {
        if (this.state !== SocketCryptoState.open) {
          throw new Error("Socket connection is not open");
        }
      }
    }, {
      key: "onMessage",
      value: function () {
        var _onMessage = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee75(message) {
          var proto, promise, messageProto, errorProto, error;
          return regeneratorRuntime.wrap(function _callee75$(_context75) {
            while (1) {
              switch (_context75.prev = _context75.next) {
                case 0:
                  _context75.next = 2;
                  return ActionProto.importProto(message);

                case 2:
                  proto = _context75.sent;

                  if (self.PV_WEBCRYPTO_SOCKET_LOG) {
                    console.info("Action:", proto.action);
                  }

                  promise = this.stack[proto.actionId];

                  if (!promise) {
                    _context75.next = 17;
                    break;
                  }

                  delete this.stack[proto.actionId];
                  _context75.t0 = ResultProto;
                  _context75.next = 10;
                  return proto.exportProto();

                case 10:
                  _context75.t1 = _context75.sent;
                  _context75.next = 13;
                  return _context75.t0.importProto.call(_context75.t0, _context75.t1);

                case 13:
                  messageProto = _context75.sent;

                  if (messageProto.error && messageProto.error.message) {
                    errorProto = messageProto.error;
                    error = new Error(messageProto.error.message);
                    error.code = errorProto.code;
                    error.type = errorProto.type;
                    promise.reject(error);
                  } else {
                    promise.resolve(messageProto.data);
                  }

                  _context75.next = 18;
                  break;

                case 17:
                  this.emit("event", proto);

                case 18:
                case "end":
                  return _context75.stop();
              }
            }
          }, _callee75, this);
        }));

        function onMessage(_x81) {
          return _onMessage.apply(this, arguments);
        }

        return onMessage;
      }()
    }, {
      key: "state",
      get: function get() {
        if (this.socket) {
          return this.socket.readyState;
        } else {
          return SocketCryptoState.closed;
        }
      }
    }]);

    return Client;
  }(EventEmitter);

  var ProviderCryptoProto_1, ProviderInfoProto_1, ProviderGetCryptoActionProto_1, ProviderTokenEventProto_1;

  var ProviderCryptoProto = ProviderCryptoProto_1 =
  /*#__PURE__*/
  function (_BaseProto6) {
    _inherits(ProviderCryptoProto, _BaseProto6);

    function ProviderCryptoProto(data) {
      var _this17;

      _classCallCheck(this, ProviderCryptoProto);

      _this17 = _possibleConstructorReturn(this, _getPrototypeOf(ProviderCryptoProto).call(this));

      if (data) {
        assign(_assertThisInitialized(_this17), data);
      }

      return _this17;
    }

    return ProviderCryptoProto;
  }(BaseProto);

  ProviderCryptoProto.INDEX = BaseProto.INDEX;

  __decorate([ProtobufProperty({
    id: ProviderCryptoProto_1.INDEX++,
    required: true,
    type: "string"
  })], ProviderCryptoProto.prototype, "id", void 0);

  __decorate([ProtobufProperty({
    id: ProviderCryptoProto_1.INDEX++,
    required: true,
    type: "string"
  })], ProviderCryptoProto.prototype, "name", void 0);

  __decorate([ProtobufProperty({
    id: ProviderCryptoProto_1.INDEX++,
    type: "bool",
    defaultValue: false
  })], ProviderCryptoProto.prototype, "readOnly", void 0);

  __decorate([ProtobufProperty({
    id: ProviderCryptoProto_1.INDEX++,
    repeated: true,
    type: "string"
  })], ProviderCryptoProto.prototype, "algorithms", void 0);

  __decorate([ProtobufProperty({
    id: ProviderCryptoProto_1.INDEX++,
    type: "bool",
    defaultValue: false
  })], ProviderCryptoProto.prototype, "isRemovable", void 0);

  __decorate([ProtobufProperty({
    id: ProviderCryptoProto_1.INDEX++,
    type: "string"
  })], ProviderCryptoProto.prototype, "atr", void 0);

  __decorate([ProtobufProperty({
    id: ProviderCryptoProto_1.INDEX++,
    type: "bool",
    defaultValue: false
  })], ProviderCryptoProto.prototype, "isHardware", void 0);

  ProviderCryptoProto = ProviderCryptoProto_1 = __decorate([ProtobufElement({})], ProviderCryptoProto);

  var ProviderInfoProto = ProviderInfoProto_1 =
  /*#__PURE__*/
  function (_BaseProto7) {
    _inherits(ProviderInfoProto, _BaseProto7);

    function ProviderInfoProto() {
      _classCallCheck(this, ProviderInfoProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(ProviderInfoProto).apply(this, arguments));
    }

    return ProviderInfoProto;
  }(BaseProto);

  ProviderInfoProto.INDEX = BaseProto.INDEX;

  __decorate([ProtobufProperty({
    id: ProviderInfoProto_1.INDEX++,
    type: "string",
    required: true
  })], ProviderInfoProto.prototype, "name", void 0);

  __decorate([ProtobufProperty({
    id: ProviderInfoProto_1.INDEX++,
    repeated: true,
    parser: ProviderCryptoProto
  })], ProviderInfoProto.prototype, "providers", void 0);

  ProviderInfoProto = ProviderInfoProto_1 = __decorate([ProtobufElement({})], ProviderInfoProto);

  var ProviderInfoActionProto =
  /*#__PURE__*/
  function (_ActionProto5) {
    _inherits(ProviderInfoActionProto, _ActionProto5);

    function ProviderInfoActionProto() {
      _classCallCheck(this, ProviderInfoActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(ProviderInfoActionProto).apply(this, arguments));
    }

    return ProviderInfoActionProto;
  }(ActionProto);

  ProviderInfoActionProto.INDEX = ActionProto.INDEX;
  ProviderInfoActionProto.ACTION = "provider/action/info";
  ProviderInfoActionProto = __decorate([ProtobufElement({})], ProviderInfoActionProto);

  var ProviderGetCryptoActionProto = ProviderGetCryptoActionProto_1 =
  /*#__PURE__*/
  function (_ActionProto6) {
    _inherits(ProviderGetCryptoActionProto, _ActionProto6);

    function ProviderGetCryptoActionProto() {
      _classCallCheck(this, ProviderGetCryptoActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(ProviderGetCryptoActionProto).apply(this, arguments));
    }

    return ProviderGetCryptoActionProto;
  }(ActionProto);

  ProviderGetCryptoActionProto.INDEX = ActionProto.INDEX;
  ProviderGetCryptoActionProto.ACTION = "provider/action/getCrypto";

  __decorate([ProtobufProperty({
    id: ProviderGetCryptoActionProto_1.INDEX++,
    required: true,
    type: "string"
  })], ProviderGetCryptoActionProto.prototype, "cryptoID", void 0);

  ProviderGetCryptoActionProto = ProviderGetCryptoActionProto_1 = __decorate([ProtobufElement({})], ProviderGetCryptoActionProto);

  var ProviderAuthorizedEventProto =
  /*#__PURE__*/
  function (_ActionProto7) {
    _inherits(ProviderAuthorizedEventProto, _ActionProto7);

    function ProviderAuthorizedEventProto() {
      _classCallCheck(this, ProviderAuthorizedEventProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(ProviderAuthorizedEventProto).apply(this, arguments));
    }

    return ProviderAuthorizedEventProto;
  }(ActionProto);

  ProviderAuthorizedEventProto.INDEX = ActionProto.INDEX;
  ProviderAuthorizedEventProto.ACTION = "provider/event/authorized";
  ProviderAuthorizedEventProto = __decorate([ProtobufElement({})], ProviderAuthorizedEventProto);

  var ProviderTokenEventProto = ProviderTokenEventProto_1 =
  /*#__PURE__*/
  function (_ActionProto8) {
    _inherits(ProviderTokenEventProto, _ActionProto8);

    function ProviderTokenEventProto(data) {
      var _this18;

      _classCallCheck(this, ProviderTokenEventProto);

      _this18 = _possibleConstructorReturn(this, _getPrototypeOf(ProviderTokenEventProto).call(this));

      if (data) {
        assign(_assertThisInitialized(_this18), data);
      }

      return _this18;
    }

    return ProviderTokenEventProto;
  }(ActionProto);

  ProviderTokenEventProto.INDEX = ActionProto.INDEX;
  ProviderTokenEventProto.ACTION = "provider/event/token";

  __decorate([ProtobufProperty({
    id: ProviderTokenEventProto_1.INDEX++,
    repeated: true,
    parser: ProviderCryptoProto
  })], ProviderTokenEventProto.prototype, "added", void 0);

  __decorate([ProtobufProperty({
    id: ProviderTokenEventProto_1.INDEX++,
    repeated: true,
    parser: ProviderCryptoProto
  })], ProviderTokenEventProto.prototype, "removed", void 0);

  __decorate([ProtobufProperty({
    id: ProviderTokenEventProto_1.INDEX++,
    type: "bytes",
    parser: ErrorProto
  })], ProviderTokenEventProto.prototype, "error", void 0);

  ProviderTokenEventProto = ProviderTokenEventProto_1 = __decorate([ProtobufElement({
    name: "ProviderTokenEvent"
  })], ProviderTokenEventProto);
  var CardReaderEventProto_1;

  var CardReaderActionProto =
  /*#__PURE__*/
  function (_ActionProto9) {
    _inherits(CardReaderActionProto, _ActionProto9);

    function CardReaderActionProto() {
      _classCallCheck(this, CardReaderActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(CardReaderActionProto).apply(this, arguments));
    }

    return CardReaderActionProto;
  }(ActionProto);

  CardReaderActionProto.INDEX = ActionProto.INDEX;
  CardReaderActionProto.ACTION = "cardReader";
  CardReaderActionProto = __decorate([ProtobufElement({})], CardReaderActionProto);

  var CardReaderGetReadersActionProto =
  /*#__PURE__*/
  function (_ActionProto10) {
    _inherits(CardReaderGetReadersActionProto, _ActionProto10);

    function CardReaderGetReadersActionProto() {
      _classCallCheck(this, CardReaderGetReadersActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(CardReaderGetReadersActionProto).apply(this, arguments));
    }

    return CardReaderGetReadersActionProto;
  }(ActionProto);

  CardReaderGetReadersActionProto.INDEX = ActionProto.INDEX;
  CardReaderGetReadersActionProto.ACTION = "cardReader/readers";
  CardReaderGetReadersActionProto = __decorate([ProtobufElement({})], CardReaderGetReadersActionProto);

  var CardReaderEventProto = CardReaderEventProto_1 =
  /*#__PURE__*/
  function (_CardReaderActionProt) {
    _inherits(CardReaderEventProto, _CardReaderActionProt);

    function CardReaderEventProto() {
      _classCallCheck(this, CardReaderEventProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(CardReaderEventProto).apply(this, arguments));
    }

    _createClass(CardReaderEventProto, [{
      key: "fromObject",
      value: function fromObject(e) {
        this.reader = e.reader.name;
        this.atr = e.atr.toString("hex");
      }
    }], [{
      key: "fromObject",
      value: function fromObject(e) {
        var res = new this();
        res.fromObject(e);
        return res;
      }
    }]);

    return CardReaderEventProto;
  }(CardReaderActionProto);

  CardReaderEventProto.INDEX = CardReaderActionProto.INDEX;

  __decorate([ProtobufProperty({
    id: CardReaderEventProto_1.INDEX++,
    required: true,
    type: "string",
    defaultValue: ""
  })], CardReaderEventProto.prototype, "reader", void 0);

  __decorate([ProtobufProperty({
    id: CardReaderEventProto_1.INDEX++,
    required: true,
    converter: HexStringConverter
  })], CardReaderEventProto.prototype, "atr", void 0);

  CardReaderEventProto = CardReaderEventProto_1 = __decorate([ProtobufElement({})], CardReaderEventProto);

  var CardReaderInsertEventProto =
  /*#__PURE__*/
  function (_CardReaderEventProto) {
    _inherits(CardReaderInsertEventProto, _CardReaderEventProto);

    function CardReaderInsertEventProto() {
      _classCallCheck(this, CardReaderInsertEventProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(CardReaderInsertEventProto).apply(this, arguments));
    }

    return CardReaderInsertEventProto;
  }(CardReaderEventProto);

  CardReaderInsertEventProto.INDEX = CardReaderEventProto.INDEX;
  CardReaderInsertEventProto.ACTION = CardReaderEventProto.ACTION + "/insert";
  CardReaderInsertEventProto = __decorate([ProtobufElement({})], CardReaderInsertEventProto);

  var CardReaderRemoveEventProto =
  /*#__PURE__*/
  function (_CardReaderEventProto2) {
    _inherits(CardReaderRemoveEventProto, _CardReaderEventProto2);

    function CardReaderRemoveEventProto() {
      _classCallCheck(this, CardReaderRemoveEventProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(CardReaderRemoveEventProto).apply(this, arguments));
    }

    return CardReaderRemoveEventProto;
  }(CardReaderEventProto);

  CardReaderRemoveEventProto.INDEX = CardReaderEventProto.INDEX;
  CardReaderRemoveEventProto.ACTION = CardReaderEventProto.ACTION + "/remove";
  CardReaderRemoveEventProto = __decorate([ProtobufElement({})], CardReaderRemoveEventProto);

  var CardReader =
  /*#__PURE__*/
  function (_EventEmitter3) {
    _inherits(CardReader, _EventEmitter3);

    function CardReader(client) {
      var _this19;

      _classCallCheck(this, CardReader);

      _this19 = _possibleConstructorReturn(this, _getPrototypeOf(CardReader).call(this));
      _this19.client = client;
      _this19.onEvent = _this19.onEvent.bind(_assertThisInitialized(_this19));

      _this19.client.on("listening", function () {
        _this19.client.on("event", _this19.onEvent);
      }).on("close", function () {
        _this19.client.removeListener("event", _this19.onEvent);
      });

      return _this19;
    }

    _createClass(CardReader, [{
      key: "readers",
      value: function () {
        var _readers = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee76() {
          var data;
          return regeneratorRuntime.wrap(function _callee76$(_context76) {
            while (1) {
              switch (_context76.prev = _context76.next) {
                case 0:
                  _context76.next = 2;
                  return this.client.send(new CardReaderGetReadersActionProto());

                case 2:
                  data = _context76.sent;
                  return _context76.abrupt("return", JSON.parse(Convert.ToString(data)));

                case 4:
                case "end":
                  return _context76.stop();
              }
            }
          }, _callee76, this);
        }));

        function readers() {
          return _readers.apply(this, arguments);
        }

        return readers;
      }()
    }, {
      key: "on",
      value: function on(event, cb) {
        return _get(_getPrototypeOf(CardReader.prototype), "on", this).call(this, event, cb);
      }
    }, {
      key: "emit",
      value: function emit(event) {
        var _get7;

        for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key5 = 1; _key5 < _len3; _key5++) {
          args[_key5 - 1] = arguments[_key5];
        }

        return (_get7 = _get(_getPrototypeOf(CardReader.prototype), "emit", this)).call.apply(_get7, [this, event].concat(args));
      }
    }, {
      key: "onEvent",
      value: function onEvent(actionProto) {
        var _this20 = this;

        _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee77() {
          return regeneratorRuntime.wrap(function _callee77$(_context77) {
            while (1) {
              switch (_context77.prev = _context77.next) {
                case 0:
                  _context77.t0 = actionProto.action;
                  _context77.next = _context77.t0 === CardReaderInsertEventProto.ACTION ? 3 : _context77.t0 === CardReaderRemoveEventProto.ACTION ? 9 : 15;
                  break;

                case 3:
                  _context77.t1 = _this20;
                  _context77.next = 6;
                  return CardReaderInsertEventProto.importProto(actionProto);

                case 6:
                  _context77.t2 = _context77.sent;

                  _context77.t1.onInsert.call(_context77.t1, _context77.t2);

                  return _context77.abrupt("break", 15);

                case 9:
                  _context77.t3 = _this20;
                  _context77.next = 12;
                  return CardReaderRemoveEventProto.importProto(actionProto);

                case 12:
                  _context77.t4 = _context77.sent;

                  _context77.t3.onRemove.call(_context77.t3, _context77.t4);

                  return _context77.abrupt("break", 15);

                case 15:
                case "end":
                  return _context77.stop();
              }
            }
          }, _callee77, this);
        }))().catch(function (err) {
          return _this20.emit("error", err);
        });
      }
    }, {
      key: "onInsert",
      value: function onInsert(actionProto) {
        this.emit("insert", actionProto);
      }
    }, {
      key: "onRemove",
      value: function onRemove(actionProto) {
        this.emit("remove", actionProto);
      }
    }]);

    return CardReader;
  }(EventEmitter);

  var CryptoActionProto_1;

  var CryptoActionProto = CryptoActionProto_1 =
  /*#__PURE__*/
  function (_ActionProto11) {
    _inherits(CryptoActionProto, _ActionProto11);

    function CryptoActionProto() {
      _classCallCheck(this, CryptoActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(CryptoActionProto).apply(this, arguments));
    }

    return CryptoActionProto;
  }(ActionProto);

  CryptoActionProto.INDEX = ActionProto.INDEX;
  CryptoActionProto.ACTION = "crypto";

  __decorate([ProtobufProperty({
    id: CryptoActionProto_1.INDEX++,
    required: true,
    type: "string"
  })], CryptoActionProto.prototype, "providerID", void 0);

  CryptoActionProto = CryptoActionProto_1 = __decorate([ProtobufElement({})], CryptoActionProto);

  var LoginActionProto =
  /*#__PURE__*/
  function (_CryptoActionProto) {
    _inherits(LoginActionProto, _CryptoActionProto);

    function LoginActionProto() {
      _classCallCheck(this, LoginActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(LoginActionProto).apply(this, arguments));
    }

    return LoginActionProto;
  }(CryptoActionProto);

  LoginActionProto.INDEX = CryptoActionProto.INDEX;
  LoginActionProto.ACTION = "crypto/login";
  LoginActionProto = __decorate([ProtobufElement({})], LoginActionProto);

  var LogoutActionProto =
  /*#__PURE__*/
  function (_CryptoActionProto2) {
    _inherits(LogoutActionProto, _CryptoActionProto2);

    function LogoutActionProto() {
      _classCallCheck(this, LogoutActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(LogoutActionProto).apply(this, arguments));
    }

    return LogoutActionProto;
  }(CryptoActionProto);

  LogoutActionProto.INDEX = CryptoActionProto.INDEX;
  LogoutActionProto.ACTION = "crypto/logout";
  LogoutActionProto = __decorate([ProtobufElement({})], LogoutActionProto);

  var IsLoggedInActionProto =
  /*#__PURE__*/
  function (_CryptoActionProto3) {
    _inherits(IsLoggedInActionProto, _CryptoActionProto3);

    function IsLoggedInActionProto() {
      _classCallCheck(this, IsLoggedInActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(IsLoggedInActionProto).apply(this, arguments));
    }

    return IsLoggedInActionProto;
  }(CryptoActionProto);

  IsLoggedInActionProto.INDEX = CryptoActionProto.INDEX;
  IsLoggedInActionProto.ACTION = "crypto/isLoggedIn";
  IsLoggedInActionProto = __decorate([ProtobufElement({})], IsLoggedInActionProto);

  var ResetActionProto =
  /*#__PURE__*/
  function (_CryptoActionProto4) {
    _inherits(ResetActionProto, _CryptoActionProto4);

    function ResetActionProto() {
      _classCallCheck(this, ResetActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(ResetActionProto).apply(this, arguments));
    }

    return ResetActionProto;
  }(CryptoActionProto);

  ResetActionProto.INDEX = CryptoActionProto.INDEX;
  ResetActionProto.ACTION = "crypto/reset";
  ResetActionProto = __decorate([ProtobufElement({})], ResetActionProto);
  /**
   * Copyright (c) 2019, Peculiar Ventures, All rights reserved.
   */

  var BufferSourceConverter =
  /*#__PURE__*/
  function () {
    function BufferSourceConverter() {
      _classCallCheck(this, BufferSourceConverter);
    }

    _createClass(BufferSourceConverter, null, [{
      key: "toArrayBuffer",
      value: function toArrayBuffer(data) {
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
    }, {
      key: "toUint8Array",
      value: function toUint8Array(data) {
        return new Uint8Array(this.toArrayBuffer(data));
      }
    }, {
      key: "isBufferSource",
      value: function isBufferSource(data) {
        return ArrayBuffer.isView(data) || data instanceof ArrayBuffer;
      }
    }]);

    return BufferSourceConverter;
  }();

  var PemConverter =
  /*#__PURE__*/
  function () {
    function PemConverter() {
      _classCallCheck(this, PemConverter);
    }

    _createClass(PemConverter, null, [{
      key: "toArrayBuffer",
      value: function toArrayBuffer(pem) {
        var base64 = pem.replace(/-{5}(BEGIN|END) .*-{5}/g, "").replace("\r", "").replace("\n", "");
        return Convert.FromBase64(base64);
      }
    }, {
      key: "toUint8Array",
      value: function toUint8Array(pem) {
        var bytes = this.toArrayBuffer(pem);
        return new Uint8Array(bytes);
      }
    }, {
      key: "fromBufferSource",
      value: function fromBufferSource(buffer, tag) {
        var base64 = Convert.ToBase64(buffer);
        var sliced;
        var offset = 0;
        var rows = [];

        while (true) {
          sliced = base64.slice(offset, offset = offset + 64);

          if (sliced.length) {
            rows.push(sliced);

            if (sliced.length < 64) {
              break;
            }
          } else {
            break;
          }
        }

        var upperCaseTag = tag.toUpperCase();
        return "-----BEGIN ".concat(upperCaseTag, "-----\n").concat(rows.join("\n"), "\n-----END ").concat(upperCaseTag, "-----");
      }
    }, {
      key: "isPEM",
      value: function isPEM(data) {
        return /-----BEGIN .+-----[A-Za-z0-9+\/\+\=\s\n]+-----END .+-----/i.test(data);
      }
    }, {
      key: "getTagName",
      value: function getTagName(pem) {
        if (!this.isPEM(pem)) {
          throw new Error("Bad parameter. Incoming data is not right PEM");
        }

        var res = /-----BEGIN (.+)-----/.exec(pem);

        if (!res) {
          throw new Error("Cannot get tag from PEM");
        }

        return res[1];
      }
    }, {
      key: "hasTagName",
      value: function hasTagName(pem, tagName) {
        var tag = this.getTagName(pem);
        return tagName.toLowerCase() === tag.toLowerCase();
      }
    }, {
      key: "isCertificate",
      value: function isCertificate(pem) {
        return this.hasTagName(pem, "certificate");
      }
    }, {
      key: "isCertificateRequest",
      value: function isCertificateRequest(pem) {
        return this.hasTagName(pem, "certificate request");
      }
    }, {
      key: "isCRL",
      value: function isCRL(pem) {
        return this.hasTagName(pem, "x509 crl");
      }
    }, {
      key: "isPublicKey",
      value: function isPublicKey(pem) {
        return this.hasTagName(pem, "public key");
      }
    }]);

    return PemConverter;
  }();

  var CryptoCertificateProto_1, CryptoX509CertificateProto_1, CryptoX509CertificateRequestProto_1, ChainItemProto_1, CertificateStorageGetChainResultProto_1, CertificateStorageSetItemActionProto_1, CertificateStorageGetItemActionProto_1, CertificateStorageRemoveItemActionProto_1, CertificateStorageImportActionProto_1, CertificateStorageExportActionProto_1, CertificateStorageIndexOfActionProto_1, CertificateStorageGetCRLActionProto_1, OCSPRequestOptionsProto_1, CertificateStorageGetOCSPActionProto_1;

  var CryptoCertificateProto = CryptoCertificateProto_1 =
  /*#__PURE__*/
  function (_CryptoItemProto2) {
    _inherits(CryptoCertificateProto, _CryptoItemProto2);

    function CryptoCertificateProto() {
      _classCallCheck(this, CryptoCertificateProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(CryptoCertificateProto).apply(this, arguments));
    }

    return CryptoCertificateProto;
  }(CryptoItemProto);

  CryptoCertificateProto.INDEX = CryptoItemProto.INDEX;

  __decorate([ProtobufProperty({
    id: CryptoCertificateProto_1.INDEX++,
    required: true,
    converter: HexStringConverter
  })], CryptoCertificateProto.prototype, "id", void 0);

  __decorate([ProtobufProperty({
    id: CryptoCertificateProto_1.INDEX++,
    required: true,
    parser: CryptoKeyProto
  })], CryptoCertificateProto.prototype, "publicKey", void 0);

  __decorate([ProtobufProperty({
    id: CryptoCertificateProto_1.INDEX++,
    required: true,
    type: "string"
  })], CryptoCertificateProto.prototype, "type", void 0);

  CryptoCertificateProto = CryptoCertificateProto_1 = __decorate([ProtobufElement({})], CryptoCertificateProto);

  var CryptoX509CertificateProto = CryptoX509CertificateProto_1 =
  /*#__PURE__*/
  function (_CryptoCertificatePro) {
    _inherits(CryptoX509CertificateProto, _CryptoCertificatePro);

    function CryptoX509CertificateProto() {
      var _this21;

      _classCallCheck(this, CryptoX509CertificateProto);

      _this21 = _possibleConstructorReturn(this, _getPrototypeOf(CryptoX509CertificateProto).apply(this, arguments));
      _this21.type = "x509";
      return _this21;
    }

    return CryptoX509CertificateProto;
  }(CryptoCertificateProto);

  CryptoX509CertificateProto.INDEX = CryptoCertificateProto.INDEX;

  __decorate([ProtobufProperty({
    id: CryptoX509CertificateProto_1.INDEX++,
    required: true,
    converter: HexStringConverter
  })], CryptoX509CertificateProto.prototype, "serialNumber", void 0);

  __decorate([ProtobufProperty({
    id: CryptoX509CertificateProto_1.INDEX++,
    required: true,
    type: "string"
  })], CryptoX509CertificateProto.prototype, "issuerName", void 0);

  __decorate([ProtobufProperty({
    id: CryptoX509CertificateProto_1.INDEX++,
    required: true,
    type: "string"
  })], CryptoX509CertificateProto.prototype, "subjectName", void 0);

  __decorate([ProtobufProperty({
    id: CryptoX509CertificateProto_1.INDEX++,
    required: true,
    converter: DateConverter$1
  })], CryptoX509CertificateProto.prototype, "notBefore", void 0);

  __decorate([ProtobufProperty({
    id: CryptoX509CertificateProto_1.INDEX++,
    required: true,
    converter: DateConverter$1
  })], CryptoX509CertificateProto.prototype, "notAfter", void 0);

  CryptoX509CertificateProto = CryptoX509CertificateProto_1 = __decorate([ProtobufElement({})], CryptoX509CertificateProto);

  var CryptoX509CertificateRequestProto = CryptoX509CertificateRequestProto_1 =
  /*#__PURE__*/
  function (_CryptoCertificatePro2) {
    _inherits(CryptoX509CertificateRequestProto, _CryptoCertificatePro2);

    function CryptoX509CertificateRequestProto() {
      var _this22;

      _classCallCheck(this, CryptoX509CertificateRequestProto);

      _this22 = _possibleConstructorReturn(this, _getPrototypeOf(CryptoX509CertificateRequestProto).apply(this, arguments));
      _this22.type = "request";
      return _this22;
    }

    return CryptoX509CertificateRequestProto;
  }(CryptoCertificateProto);

  CryptoX509CertificateRequestProto.INDEX = CryptoCertificateProto.INDEX;

  __decorate([ProtobufProperty({
    id: CryptoX509CertificateRequestProto_1.INDEX++,
    required: true,
    type: "string"
  })], CryptoX509CertificateRequestProto.prototype, "subjectName", void 0);

  CryptoX509CertificateRequestProto = CryptoX509CertificateRequestProto_1 = __decorate([ProtobufElement({})], CryptoX509CertificateRequestProto);

  var ChainItemProto = ChainItemProto_1 =
  /*#__PURE__*/
  function (_BaseProto8) {
    _inherits(ChainItemProto, _BaseProto8);

    function ChainItemProto() {
      _classCallCheck(this, ChainItemProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(ChainItemProto).apply(this, arguments));
    }

    return ChainItemProto;
  }(BaseProto);

  ChainItemProto.INDEX = BaseProto.INDEX;

  __decorate([ProtobufProperty({
    id: ChainItemProto_1.INDEX++,
    required: true,
    type: "string"
  })], ChainItemProto.prototype, "type", void 0);

  __decorate([ProtobufProperty({
    id: ChainItemProto_1.INDEX++,
    required: true,
    converter: ArrayBufferConverter
  })], ChainItemProto.prototype, "value", void 0);

  ChainItemProto = ChainItemProto_1 = __decorate([ProtobufElement({})], ChainItemProto);

  var CertificateStorageGetChainResultProto = CertificateStorageGetChainResultProto_1 =
  /*#__PURE__*/
  function (_BaseProto9) {
    _inherits(CertificateStorageGetChainResultProto, _BaseProto9);

    function CertificateStorageGetChainResultProto() {
      var _this23;

      _classCallCheck(this, CertificateStorageGetChainResultProto);

      _this23 = _possibleConstructorReturn(this, _getPrototypeOf(CertificateStorageGetChainResultProto).apply(this, arguments));
      _this23.items = [];
      return _this23;
    }

    return CertificateStorageGetChainResultProto;
  }(BaseProto);

  CertificateStorageGetChainResultProto.INDEX = BaseProto.INDEX;

  __decorate([ProtobufProperty({
    id: CertificateStorageGetChainResultProto_1.INDEX++,
    required: true,
    repeated: true,
    parser: ChainItemProto
  })], CertificateStorageGetChainResultProto.prototype, "items", void 0);

  CertificateStorageGetChainResultProto = CertificateStorageGetChainResultProto_1 = __decorate([ProtobufElement({})], CertificateStorageGetChainResultProto);

  var CertificateStorageSetItemActionProto = CertificateStorageSetItemActionProto_1 =
  /*#__PURE__*/
  function (_CryptoActionProto5) {
    _inherits(CertificateStorageSetItemActionProto, _CryptoActionProto5);

    function CertificateStorageSetItemActionProto() {
      _classCallCheck(this, CertificateStorageSetItemActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(CertificateStorageSetItemActionProto).apply(this, arguments));
    }

    return CertificateStorageSetItemActionProto;
  }(CryptoActionProto);

  CertificateStorageSetItemActionProto.INDEX = CryptoActionProto.INDEX;
  CertificateStorageSetItemActionProto.ACTION = "crypto/certificateStorage/setItem";

  __decorate([ProtobufProperty({
    id: CertificateStorageSetItemActionProto_1.INDEX++,
    required: true,
    parser: CryptoCertificateProto
  })], CertificateStorageSetItemActionProto.prototype, "item", void 0);

  CertificateStorageSetItemActionProto = CertificateStorageSetItemActionProto_1 = __decorate([ProtobufElement({})], CertificateStorageSetItemActionProto);

  var CertificateStorageGetItemActionProto = CertificateStorageGetItemActionProto_1 =
  /*#__PURE__*/
  function (_CryptoActionProto6) {
    _inherits(CertificateStorageGetItemActionProto, _CryptoActionProto6);

    function CertificateStorageGetItemActionProto() {
      _classCallCheck(this, CertificateStorageGetItemActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(CertificateStorageGetItemActionProto).apply(this, arguments));
    }

    return CertificateStorageGetItemActionProto;
  }(CryptoActionProto);

  CertificateStorageGetItemActionProto.INDEX = CryptoActionProto.INDEX;
  CertificateStorageGetItemActionProto.ACTION = "crypto/certificateStorage/getItem";

  __decorate([ProtobufProperty({
    id: CertificateStorageGetItemActionProto_1.INDEX++,
    required: true,
    type: "string"
  })], CertificateStorageGetItemActionProto.prototype, "key", void 0);

  __decorate([ProtobufProperty({
    id: CertificateStorageGetItemActionProto_1.INDEX++,
    parser: AlgorithmProto
  })], CertificateStorageGetItemActionProto.prototype, "algorithm", void 0);

  __decorate([ProtobufProperty({
    id: CertificateStorageGetItemActionProto_1.INDEX++,
    repeated: true,
    type: "string"
  })], CertificateStorageGetItemActionProto.prototype, "keyUsages", void 0);

  CertificateStorageGetItemActionProto = CertificateStorageGetItemActionProto_1 = __decorate([ProtobufElement({})], CertificateStorageGetItemActionProto);

  var CertificateStorageKeysActionProto =
  /*#__PURE__*/
  function (_CryptoActionProto7) {
    _inherits(CertificateStorageKeysActionProto, _CryptoActionProto7);

    function CertificateStorageKeysActionProto() {
      _classCallCheck(this, CertificateStorageKeysActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(CertificateStorageKeysActionProto).apply(this, arguments));
    }

    return CertificateStorageKeysActionProto;
  }(CryptoActionProto);

  CertificateStorageKeysActionProto.INDEX = CryptoActionProto.INDEX;
  CertificateStorageKeysActionProto.ACTION = "crypto/certificateStorage/keys";
  CertificateStorageKeysActionProto = __decorate([ProtobufElement({})], CertificateStorageKeysActionProto);

  var CertificateStorageRemoveItemActionProto = CertificateStorageRemoveItemActionProto_1 =
  /*#__PURE__*/
  function (_CryptoActionProto8) {
    _inherits(CertificateStorageRemoveItemActionProto, _CryptoActionProto8);

    function CertificateStorageRemoveItemActionProto() {
      _classCallCheck(this, CertificateStorageRemoveItemActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(CertificateStorageRemoveItemActionProto).apply(this, arguments));
    }

    return CertificateStorageRemoveItemActionProto;
  }(CryptoActionProto);

  CertificateStorageRemoveItemActionProto.INDEX = CryptoActionProto.INDEX;
  CertificateStorageRemoveItemActionProto.ACTION = "crypto/certificateStorage/removeItem";

  __decorate([ProtobufProperty({
    id: CertificateStorageRemoveItemActionProto_1.INDEX++,
    required: true,
    type: "string"
  })], CertificateStorageRemoveItemActionProto.prototype, "key", void 0);

  CertificateStorageRemoveItemActionProto = CertificateStorageRemoveItemActionProto_1 = __decorate([ProtobufElement({})], CertificateStorageRemoveItemActionProto);

  var CertificateStorageClearActionProto =
  /*#__PURE__*/
  function (_CryptoActionProto9) {
    _inherits(CertificateStorageClearActionProto, _CryptoActionProto9);

    function CertificateStorageClearActionProto() {
      _classCallCheck(this, CertificateStorageClearActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(CertificateStorageClearActionProto).apply(this, arguments));
    }

    return CertificateStorageClearActionProto;
  }(CryptoActionProto);

  CertificateStorageClearActionProto.INDEX = CryptoActionProto.INDEX;
  CertificateStorageClearActionProto.ACTION = "crypto/certificateStorage/clear";
  CertificateStorageClearActionProto = __decorate([ProtobufElement({})], CertificateStorageClearActionProto);

  var CertificateStorageImportActionProto = CertificateStorageImportActionProto_1 =
  /*#__PURE__*/
  function (_CryptoActionProto10) {
    _inherits(CertificateStorageImportActionProto, _CryptoActionProto10);

    function CertificateStorageImportActionProto() {
      _classCallCheck(this, CertificateStorageImportActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(CertificateStorageImportActionProto).apply(this, arguments));
    }

    return CertificateStorageImportActionProto;
  }(CryptoActionProto);

  CertificateStorageImportActionProto.INDEX = CryptoActionProto.INDEX;
  CertificateStorageImportActionProto.ACTION = "crypto/certificateStorage/import";

  __decorate([ProtobufProperty({
    id: CertificateStorageImportActionProto_1.INDEX++,
    required: true,
    type: "string"
  })], CertificateStorageImportActionProto.prototype, "format", void 0);

  __decorate([ProtobufProperty({
    id: CertificateStorageImportActionProto_1.INDEX++,
    required: true,
    converter: ArrayBufferConverter
  })], CertificateStorageImportActionProto.prototype, "data", void 0);

  __decorate([ProtobufProperty({
    id: CertificateStorageImportActionProto_1.INDEX++,
    required: true,
    parser: AlgorithmProto
  })], CertificateStorageImportActionProto.prototype, "algorithm", void 0);

  __decorate([ProtobufProperty({
    id: CertificateStorageImportActionProto_1.INDEX++,
    repeated: true,
    type: "string"
  })], CertificateStorageImportActionProto.prototype, "keyUsages", void 0);

  CertificateStorageImportActionProto = CertificateStorageImportActionProto_1 = __decorate([ProtobufElement({})], CertificateStorageImportActionProto);

  var CertificateStorageExportActionProto = CertificateStorageExportActionProto_1 =
  /*#__PURE__*/
  function (_CryptoActionProto11) {
    _inherits(CertificateStorageExportActionProto, _CryptoActionProto11);

    function CertificateStorageExportActionProto() {
      _classCallCheck(this, CertificateStorageExportActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(CertificateStorageExportActionProto).apply(this, arguments));
    }

    return CertificateStorageExportActionProto;
  }(CryptoActionProto);

  CertificateStorageExportActionProto.INDEX = CryptoActionProto.INDEX;
  CertificateStorageExportActionProto.ACTION = "crypto/certificateStorage/export";

  __decorate([ProtobufProperty({
    id: CertificateStorageExportActionProto_1.INDEX++,
    required: true,
    type: "string"
  })], CertificateStorageExportActionProto.prototype, "format", void 0);

  __decorate([ProtobufProperty({
    id: CertificateStorageExportActionProto_1.INDEX++,
    required: true,
    parser: CryptoCertificateProto
  })], CertificateStorageExportActionProto.prototype, "item", void 0);

  CertificateStorageExportActionProto = CertificateStorageExportActionProto_1 = __decorate([ProtobufElement({})], CertificateStorageExportActionProto);

  var CertificateStorageIndexOfActionProto = CertificateStorageIndexOfActionProto_1 =
  /*#__PURE__*/
  function (_CryptoActionProto12) {
    _inherits(CertificateStorageIndexOfActionProto, _CryptoActionProto12);

    function CertificateStorageIndexOfActionProto() {
      _classCallCheck(this, CertificateStorageIndexOfActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(CertificateStorageIndexOfActionProto).apply(this, arguments));
    }

    return CertificateStorageIndexOfActionProto;
  }(CryptoActionProto);

  CertificateStorageIndexOfActionProto.INDEX = CryptoActionProto.INDEX;
  CertificateStorageIndexOfActionProto.ACTION = "crypto/certificateStorage/indexOf";

  __decorate([ProtobufProperty({
    id: CertificateStorageIndexOfActionProto_1.INDEX++,
    required: true,
    parser: CryptoCertificateProto
  })], CertificateStorageIndexOfActionProto.prototype, "item", void 0);

  CertificateStorageIndexOfActionProto = CertificateStorageIndexOfActionProto_1 = __decorate([ProtobufElement({})], CertificateStorageIndexOfActionProto);

  var CertificateStorageGetChainActionProto =
  /*#__PURE__*/
  function (_CryptoActionProto13) {
    _inherits(CertificateStorageGetChainActionProto, _CryptoActionProto13);

    function CertificateStorageGetChainActionProto() {
      _classCallCheck(this, CertificateStorageGetChainActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(CertificateStorageGetChainActionProto).apply(this, arguments));
    }

    return CertificateStorageGetChainActionProto;
  }(CryptoActionProto);

  CertificateStorageGetChainActionProto.INDEX = CryptoActionProto.INDEX;
  CertificateStorageGetChainActionProto.ACTION = "crypto/certificateStorage/getChain";

  __decorate([ProtobufProperty({
    id: CertificateStorageSetItemActionProto.INDEX++,
    required: true,
    parser: CryptoCertificateProto
  })], CertificateStorageGetChainActionProto.prototype, "item", void 0);

  CertificateStorageGetChainActionProto = __decorate([ProtobufElement({})], CertificateStorageGetChainActionProto);

  var CertificateStorageGetCRLActionProto = CertificateStorageGetCRLActionProto_1 =
  /*#__PURE__*/
  function (_CryptoActionProto14) {
    _inherits(CertificateStorageGetCRLActionProto, _CryptoActionProto14);

    function CertificateStorageGetCRLActionProto() {
      _classCallCheck(this, CertificateStorageGetCRLActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(CertificateStorageGetCRLActionProto).apply(this, arguments));
    }

    return CertificateStorageGetCRLActionProto;
  }(CryptoActionProto);

  CertificateStorageGetCRLActionProto.INDEX = CryptoActionProto.INDEX;
  CertificateStorageGetCRLActionProto.ACTION = "crypto/certificateStorage/getCRL";

  __decorate([ProtobufProperty({
    id: CertificateStorageGetCRLActionProto_1.INDEX++,
    required: true,
    type: "string"
  })], CertificateStorageGetCRLActionProto.prototype, "url", void 0);

  CertificateStorageGetCRLActionProto = CertificateStorageGetCRLActionProto_1 = __decorate([ProtobufElement({})], CertificateStorageGetCRLActionProto);

  var OCSPRequestOptionsProto = OCSPRequestOptionsProto_1 =
  /*#__PURE__*/
  function (_BaseProto10) {
    _inherits(OCSPRequestOptionsProto, _BaseProto10);

    function OCSPRequestOptionsProto() {
      _classCallCheck(this, OCSPRequestOptionsProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(OCSPRequestOptionsProto).apply(this, arguments));
    }

    return OCSPRequestOptionsProto;
  }(BaseProto);

  OCSPRequestOptionsProto.INDEX = BaseProto.INDEX;

  __decorate([ProtobufProperty({
    id: OCSPRequestOptionsProto_1.INDEX++,
    required: false,
    type: "string",
    defaultValue: "get"
  })], OCSPRequestOptionsProto.prototype, "method", void 0);

  OCSPRequestOptionsProto = OCSPRequestOptionsProto_1 = __decorate([ProtobufElement({})], OCSPRequestOptionsProto);

  var CertificateStorageGetOCSPActionProto = CertificateStorageGetOCSPActionProto_1 =
  /*#__PURE__*/
  function (_CryptoActionProto15) {
    _inherits(CertificateStorageGetOCSPActionProto, _CryptoActionProto15);

    function CertificateStorageGetOCSPActionProto() {
      _classCallCheck(this, CertificateStorageGetOCSPActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(CertificateStorageGetOCSPActionProto).apply(this, arguments));
    }

    return CertificateStorageGetOCSPActionProto;
  }(CryptoActionProto);

  CertificateStorageGetOCSPActionProto.INDEX = CryptoActionProto.INDEX;
  CertificateStorageGetOCSPActionProto.ACTION = "crypto/certificateStorage/getOCSP";

  __decorate([ProtobufProperty({
    id: CertificateStorageGetOCSPActionProto_1.INDEX++,
    required: true,
    type: "string"
  })], CertificateStorageGetOCSPActionProto.prototype, "url", void 0);

  __decorate([ProtobufProperty({
    id: CertificateStorageGetOCSPActionProto_1.INDEX++,
    required: true,
    converter: ArrayBufferConverter
  })], CertificateStorageGetOCSPActionProto.prototype, "request", void 0);

  __decorate([ProtobufProperty({
    id: CertificateStorageGetOCSPActionProto_1.INDEX++,
    required: false,
    parser: OCSPRequestOptionsProto
  })], CertificateStorageGetOCSPActionProto.prototype, "options", void 0);

  CertificateStorageGetOCSPActionProto = CertificateStorageGetOCSPActionProto_1 = __decorate([ProtobufElement({})], CertificateStorageGetOCSPActionProto);

  function Cast(data) {
    return data;
  }

  function isHashedAlgorithm(data) {
    return data instanceof Object && "name" in data && "hash" in data;
  }

  function prepareAlgorithm(algorithm) {
    var algProto = new AlgorithmProto();

    if (typeof algorithm === "string") {
      algProto.fromAlgorithm({
        name: algorithm
      });
    } else if (isHashedAlgorithm(algorithm)) {
      var preparedAlgorithm = _objectSpread({}, algorithm);

      preparedAlgorithm.hash = prepareAlgorithm(algorithm.hash);
      algProto.fromAlgorithm(preparedAlgorithm);
    } else {
      algProto.fromAlgorithm(_objectSpread({}, algorithm));
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
    if (!(algorithm && (_typeof(algorithm) === "object" || typeof algorithm === "string"))) {
      throw new TypeError("".concat(param, ": Is wrong type. Must be Object or String"));
    }

    if (!(_typeof(algorithm) === "object" && "name" in algorithm)) {
      throw new TypeError("".concat(param, ": Required property 'name' is missed"));
    }
  }

  function checkCryptoKey(data, param) {
    if (!isCryptoKey(data)) {
      throw new TypeError("".concat(param, ": Is not type CryptoKey"));
    }
  }

  function checkCryptoCertificate(data, param) {
    if (!isCryptoCertificate(data)) {
      throw new TypeError("".concat(param, ": Is not type CryptoCertificate"));
    }
  }

  function checkBufferSource(data, param) {
    if (!BufferSourceConverter.isBufferSource(data)) {
      throw new TypeError("".concat(param, ": Is wrong type. Must be ArrayBuffer or ArrayBuffer view"));
    }
  }

  function checkArray(data, param) {
    if (!Array.isArray(data)) {
      throw new TypeError("".concat(param, ": Is not type Array"));
    }
  }

  function checkPrimitive(data, type, param) {
    if (_typeof(data) !== type) {
      throw new TypeError("".concat(param, ": Is not type '").concat(type, "'"));
    }
  }

  var IMPORT_CERT_FORMATS = ["raw", "pem", "x509", "request"];

  var CertificateStorage =
  /*#__PURE__*/
  function () {
    function CertificateStorage(provider) {
      _classCallCheck(this, CertificateStorage);

      this.provider = provider;
    }

    _createClass(CertificateStorage, [{
      key: "indexOf",
      value: function () {
        var _indexOf = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee78(item) {
          var proto, result;
          return regeneratorRuntime.wrap(function _callee78$(_context78) {
            while (1) {
              switch (_context78.prev = _context78.next) {
                case 0:
                  checkCryptoCertificate(item, "item");
                  proto = new CertificateStorageIndexOfActionProto();
                  proto.providerID = this.provider.id;
                  proto.item = item;
                  _context78.next = 6;
                  return this.provider.client.send(proto);

                case 6:
                  result = _context78.sent;
                  return _context78.abrupt("return", result ? Convert.ToUtf8String(result) : null);

                case 8:
                case "end":
                  return _context78.stop();
              }
            }
          }, _callee78, this);
        }));

        function indexOf(_x82) {
          return _indexOf.apply(this, arguments);
        }

        return indexOf;
      }()
    }, {
      key: "hasItem",
      value: function () {
        var _hasItem = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee79(item) {
          var index;
          return regeneratorRuntime.wrap(function _callee79$(_context79) {
            while (1) {
              switch (_context79.prev = _context79.next) {
                case 0:
                  _context79.next = 2;
                  return this.indexOf(item);

                case 2:
                  index = _context79.sent;
                  return _context79.abrupt("return", !!index);

                case 4:
                case "end":
                  return _context79.stop();
              }
            }
          }, _callee79, this);
        }));

        function hasItem(_x83) {
          return _hasItem.apply(this, arguments);
        }

        return hasItem;
      }()
    }, {
      key: "exportCert",
      value: function () {
        var _exportCert = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee80(format, item) {
          var proto, result, header, res, b64, counter, raw;
          return regeneratorRuntime.wrap(function _callee80$(_context80) {
            while (1) {
              switch (_context80.prev = _context80.next) {
                case 0:
                  checkPrimitive(format, "string", "format");
                  checkCryptoCertificate(item, "item");
                  proto = new CertificateStorageExportActionProto();
                  proto.providerID = this.provider.id;
                  proto.format = "raw";
                  proto.item = item;
                  _context80.next = 8;
                  return this.provider.client.send(proto);

                case 8:
                  result = _context80.sent;

                  if (!(format === "raw")) {
                    _context80.next = 13;
                    break;
                  }

                  return _context80.abrupt("return", result);

                case 13:
                  header = "";
                  _context80.t0 = item.type;
                  _context80.next = _context80.t0 === "x509" ? 17 : _context80.t0 === "request" ? 19 : 21;
                  break;

                case 17:
                  header = "CERTIFICATE";
                  return _context80.abrupt("break", 22);

                case 19:
                  header = "CERTIFICATE REQUEST";
                  return _context80.abrupt("break", 22);

                case 21:
                  throw new Error("Cannot create PEM for unknown type of certificate item");

                case 22:
                  res = [];
                  b64 = Convert.ToBase64(result);
                  res.push("-----BEGIN ".concat(header, "-----"));
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

                  res.push("-----END ".concat(header, "-----"));
                  return _context80.abrupt("return", res.join("\r\n"));

                case 31:
                case "end":
                  return _context80.stop();
              }
            }
          }, _callee80, this);
        }));

        function exportCert(_x84, _x85) {
          return _exportCert.apply(this, arguments);
        }

        return exportCert;
      }()
    }, {
      key: "importCert",
      value: function () {
        var _importCert = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee81(format, data, algorithm, keyUsages) {
          var algProto, rawData, proto, result, certItem;
          return regeneratorRuntime.wrap(function _callee81$(_context81) {
            while (1) {
              switch (_context81.prev = _context81.next) {
                case 0:
                  checkPrimitive(format, "string", "format");

                  if (~IMPORT_CERT_FORMATS.indexOf(format)) {
                    _context81.next = 3;
                    break;
                  }

                  throw new TypeError("format: Is invalid value. Must be ".concat(IMPORT_CERT_FORMATS.join(", ")));

                case 3:
                  if (format === "pem") {
                    checkPrimitive(data, "string", "data");
                  } else {
                    checkBufferSource(data, "data");
                  }

                  checkAlgorithm(algorithm, "algorithm");
                  checkArray(keyUsages, "keyUsages");
                  algProto = prepareAlgorithm(algorithm);

                  if (!BufferSourceConverter.isBufferSource(data)) {
                    _context81.next = 11;
                    break;
                  }

                  rawData = BufferSourceConverter.toArrayBuffer(data);
                  _context81.next = 16;
                  break;

                case 11:
                  if (!(typeof data === "string")) {
                    _context81.next = 15;
                    break;
                  }

                  rawData = PemConverter.toArrayBuffer(data);
                  _context81.next = 16;
                  break;

                case 15:
                  throw new TypeError("data: Is not type String, ArrayBuffer or ArrayBufferView");

                case 16:
                  proto = new CertificateStorageImportActionProto();
                  proto.providerID = this.provider.id;
                  proto.format = format === "x509" || format === "request" ? "raw" : format;
                  proto.data = rawData;
                  proto.algorithm = algProto;
                  proto.keyUsages = keyUsages;
                  _context81.next = 24;
                  return this.provider.client.send(proto);

                case 24:
                  result = _context81.sent;
                  _context81.next = 27;
                  return CryptoCertificateProto.importProto(result);

                case 27:
                  certItem = _context81.sent;
                  return _context81.abrupt("return", this.prepareCertItem(certItem));

                case 29:
                case "end":
                  return _context81.stop();
              }
            }
          }, _callee81, this);
        }));

        function importCert(_x86, _x87, _x88, _x89) {
          return _importCert.apply(this, arguments);
        }

        return importCert;
      }()
    }, {
      key: "keys",
      value: function () {
        var _keys = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee82() {
          var proto, result, _keys2;

          return regeneratorRuntime.wrap(function _callee82$(_context82) {
            while (1) {
              switch (_context82.prev = _context82.next) {
                case 0:
                  proto = new CertificateStorageKeysActionProto();
                  proto.providerID = this.provider.id;
                  _context82.next = 4;
                  return this.provider.client.send(proto);

                case 4:
                  result = _context82.sent;

                  if (!result) {
                    _context82.next = 8;
                    break;
                  }

                  _keys2 = Convert.ToUtf8String(result).split(",");
                  return _context82.abrupt("return", _keys2);

                case 8:
                  return _context82.abrupt("return", []);

                case 9:
                case "end":
                  return _context82.stop();
              }
            }
          }, _callee82, this);
        }));

        function keys() {
          return _keys.apply(this, arguments);
        }

        return keys;
      }()
    }, {
      key: "getItem",
      value: function () {
        var _getItem = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee83(key, algorithm, keyUsages) {
          var proto, result, certItem;
          return regeneratorRuntime.wrap(function _callee83$(_context83) {
            while (1) {
              switch (_context83.prev = _context83.next) {
                case 0:
                  checkPrimitive(key, "string", "key");

                  if (algorithm) {
                    checkAlgorithm(algorithm, "algorithm");
                    checkArray(keyUsages, "keyUsages");
                  }

                  proto = new CertificateStorageGetItemActionProto();
                  proto.providerID = this.provider.id;
                  proto.key = key;

                  if (algorithm) {
                    proto.algorithm = prepareAlgorithm(algorithm);
                    proto.keyUsages = keyUsages;
                  }

                  _context83.next = 8;
                  return this.provider.client.send(proto);

                case 8:
                  result = _context83.sent;

                  if (!(result && result.byteLength)) {
                    _context83.next = 14;
                    break;
                  }

                  _context83.next = 12;
                  return CryptoCertificateProto.importProto(result);

                case 12:
                  certItem = _context83.sent;
                  return _context83.abrupt("return", this.prepareCertItem(certItem));

                case 14:
                  return _context83.abrupt("return", null);

                case 15:
                case "end":
                  return _context83.stop();
              }
            }
          }, _callee83, this);
        }));

        function getItem(_x90, _x91, _x92) {
          return _getItem.apply(this, arguments);
        }

        return getItem;
      }()
    }, {
      key: "setItem",
      value: function () {
        var _setItem = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee84(value) {
          var proto, data;
          return regeneratorRuntime.wrap(function _callee84$(_context84) {
            while (1) {
              switch (_context84.prev = _context84.next) {
                case 0:
                  checkCryptoCertificate(value, "value");
                  proto = new CertificateStorageSetItemActionProto();
                  proto.providerID = this.provider.id;
                  proto.item = value;
                  _context84.next = 6;
                  return this.provider.client.send(proto);

                case 6:
                  data = _context84.sent;
                  return _context84.abrupt("return", Convert.ToUtf8String(data));

                case 8:
                case "end":
                  return _context84.stop();
              }
            }
          }, _callee84, this);
        }));

        function setItem(_x93) {
          return _setItem.apply(this, arguments);
        }

        return setItem;
      }()
    }, {
      key: "removeItem",
      value: function () {
        var _removeItem = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee85(key) {
          var proto;
          return regeneratorRuntime.wrap(function _callee85$(_context85) {
            while (1) {
              switch (_context85.prev = _context85.next) {
                case 0:
                  checkPrimitive(key, "string", "key");
                  proto = new CertificateStorageRemoveItemActionProto();
                  proto.providerID = this.provider.id;
                  proto.key = key;
                  _context85.next = 6;
                  return this.provider.client.send(proto);

                case 6:
                case "end":
                  return _context85.stop();
              }
            }
          }, _callee85, this);
        }));

        function removeItem(_x94) {
          return _removeItem.apply(this, arguments);
        }

        return removeItem;
      }()
    }, {
      key: "clear",
      value: function () {
        var _clear = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee86() {
          var proto;
          return regeneratorRuntime.wrap(function _callee86$(_context86) {
            while (1) {
              switch (_context86.prev = _context86.next) {
                case 0:
                  proto = new CertificateStorageClearActionProto();
                  proto.providerID = this.provider.id;
                  _context86.next = 4;
                  return this.provider.client.send(proto);

                case 4:
                case "end":
                  return _context86.stop();
              }
            }
          }, _callee86, this);
        }));

        function clear() {
          return _clear.apply(this, arguments);
        }

        return clear;
      }()
    }, {
      key: "getChain",
      value: function () {
        var _getChain = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee87(value) {
          var proto, data, resultProto;
          return regeneratorRuntime.wrap(function _callee87$(_context87) {
            while (1) {
              switch (_context87.prev = _context87.next) {
                case 0:
                  checkCryptoCertificate(value, "value");
                  proto = new CertificateStorageGetChainActionProto();
                  proto.providerID = this.provider.id;
                  proto.item = value;
                  _context87.next = 6;
                  return this.provider.client.send(proto);

                case 6:
                  data = _context87.sent;
                  _context87.next = 9;
                  return CertificateStorageGetChainResultProto.importProto(data);

                case 9:
                  resultProto = _context87.sent;
                  return _context87.abrupt("return", resultProto.items);

                case 11:
                case "end":
                  return _context87.stop();
              }
            }
          }, _callee87, this);
        }));

        function getChain(_x95) {
          return _getChain.apply(this, arguments);
        }

        return getChain;
      }()
    }, {
      key: "getCRL",
      value: function () {
        var _getCRL = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee88(url) {
          var proto, data;
          return regeneratorRuntime.wrap(function _callee88$(_context88) {
            while (1) {
              switch (_context88.prev = _context88.next) {
                case 0:
                  checkPrimitive(url, "string", "url");
                  proto = new CertificateStorageGetCRLActionProto();
                  proto.providerID = this.provider.id;
                  proto.url = url;
                  _context88.next = 6;
                  return this.provider.client.send(proto);

                case 6:
                  data = _context88.sent;
                  return _context88.abrupt("return", data);

                case 8:
                case "end":
                  return _context88.stop();
              }
            }
          }, _callee88, this);
        }));

        function getCRL(_x96) {
          return _getCRL.apply(this, arguments);
        }

        return getCRL;
      }()
    }, {
      key: "getOCSP",
      value: function () {
        var _getOCSP = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee89(url, request, options) {
          var proto, key, data;
          return regeneratorRuntime.wrap(function _callee89$(_context89) {
            while (1) {
              switch (_context89.prev = _context89.next) {
                case 0:
                  checkPrimitive(url, "string", "url");
                  checkBufferSource(request, "request");
                  proto = new CertificateStorageGetOCSPActionProto();
                  proto.providerID = this.provider.id;
                  proto.url = url;
                  proto.request = BufferSourceConverter.toArrayBuffer(request);

                  if (options) {
                    for (key in options) {
                      proto.options[key] = options[key];
                    }
                  }

                  _context89.next = 9;
                  return this.provider.client.send(proto);

                case 9:
                  data = _context89.sent;
                  return _context89.abrupt("return", data);

                case 11:
                case "end":
                  return _context89.stop();
              }
            }
          }, _callee89, this);
        }));

        function getOCSP(_x97, _x98, _x99) {
          return _getOCSP.apply(this, arguments);
        }

        return getOCSP;
      }()
    }, {
      key: "prepareCertItem",
      value: function () {
        var _prepareCertItem = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee90(item) {
          var raw, result;
          return regeneratorRuntime.wrap(function _callee90$(_context90) {
            while (1) {
              switch (_context90.prev = _context90.next) {
                case 0:
                  _context90.next = 2;
                  return item.exportProto();

                case 2:
                  raw = _context90.sent;
                  _context90.t0 = item.type;
                  _context90.next = _context90.t0 === "x509" ? 6 : _context90.t0 === "request" ? 10 : 14;
                  break;

                case 6:
                  _context90.next = 8;
                  return CryptoX509CertificateProto.importProto(raw);

                case 8:
                  result = _context90.sent;
                  return _context90.abrupt("break", 15);

                case 10:
                  _context90.next = 12;
                  return CryptoX509CertificateRequestProto.importProto(raw);

                case 12:
                  result = _context90.sent;
                  return _context90.abrupt("break", 15);

                case 14:
                  throw new Error("Unsupported CertificateItem type '".concat(item.type, "'"));

                case 15:
                  result.provider = this.provider;
                  return _context90.abrupt("return", result);

                case 17:
                case "end":
                  return _context90.stop();
              }
            }
          }, _callee90, this);
        }));

        function prepareCertItem(_x100) {
          return _prepareCertItem.apply(this, arguments);
        }

        return prepareCertItem;
      }()
    }]);

    return CertificateStorage;
  }();

  var KeyStorageSetItemActionProto_1, KeyStorageGetItemActionProto_1, KeyStorageRemoveItemActionProto_1, KeyStorageIndexOfActionProto_1;

  var KeyStorageSetItemActionProto = KeyStorageSetItemActionProto_1 =
  /*#__PURE__*/
  function (_CryptoActionProto16) {
    _inherits(KeyStorageSetItemActionProto, _CryptoActionProto16);

    function KeyStorageSetItemActionProto() {
      _classCallCheck(this, KeyStorageSetItemActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(KeyStorageSetItemActionProto).apply(this, arguments));
    }

    return KeyStorageSetItemActionProto;
  }(CryptoActionProto);

  KeyStorageSetItemActionProto.INDEX = CryptoActionProto.INDEX;
  KeyStorageSetItemActionProto.ACTION = "crypto/keyStorage/setItem";

  __decorate([ProtobufProperty({
    id: KeyStorageSetItemActionProto_1.INDEX++,
    required: true,
    parser: CryptoKeyProto
  })], KeyStorageSetItemActionProto.prototype, "item", void 0);

  KeyStorageSetItemActionProto = KeyStorageSetItemActionProto_1 = __decorate([ProtobufElement({})], KeyStorageSetItemActionProto);

  var KeyStorageGetItemActionProto = KeyStorageGetItemActionProto_1 =
  /*#__PURE__*/
  function (_CryptoActionProto17) {
    _inherits(KeyStorageGetItemActionProto, _CryptoActionProto17);

    function KeyStorageGetItemActionProto() {
      _classCallCheck(this, KeyStorageGetItemActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(KeyStorageGetItemActionProto).apply(this, arguments));
    }

    return KeyStorageGetItemActionProto;
  }(CryptoActionProto);

  KeyStorageGetItemActionProto.INDEX = CryptoActionProto.INDEX;
  KeyStorageGetItemActionProto.ACTION = "crypto/keyStorage/getItem";

  __decorate([ProtobufProperty({
    id: KeyStorageGetItemActionProto_1.INDEX++,
    required: true,
    type: "string"
  })], KeyStorageGetItemActionProto.prototype, "key", void 0);

  __decorate([ProtobufProperty({
    id: KeyStorageGetItemActionProto_1.INDEX++,
    parser: AlgorithmProto
  })], KeyStorageGetItemActionProto.prototype, "algorithm", void 0);

  __decorate([ProtobufProperty({
    id: KeyStorageGetItemActionProto_1.INDEX++,
    type: "bool"
  })], KeyStorageGetItemActionProto.prototype, "extractable", void 0);

  __decorate([ProtobufProperty({
    id: KeyStorageGetItemActionProto_1.INDEX++,
    repeated: true,
    type: "string"
  })], KeyStorageGetItemActionProto.prototype, "keyUsages", void 0);

  KeyStorageGetItemActionProto = KeyStorageGetItemActionProto_1 = __decorate([ProtobufElement({})], KeyStorageGetItemActionProto);

  var KeyStorageKeysActionProto =
  /*#__PURE__*/
  function (_CryptoActionProto18) {
    _inherits(KeyStorageKeysActionProto, _CryptoActionProto18);

    function KeyStorageKeysActionProto() {
      _classCallCheck(this, KeyStorageKeysActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(KeyStorageKeysActionProto).apply(this, arguments));
    }

    return KeyStorageKeysActionProto;
  }(CryptoActionProto);

  KeyStorageKeysActionProto.INDEX = CryptoActionProto.INDEX;
  KeyStorageKeysActionProto.ACTION = "crypto/keyStorage/keys";
  KeyStorageKeysActionProto = __decorate([ProtobufElement({})], KeyStorageKeysActionProto);

  var KeyStorageRemoveItemActionProto = KeyStorageRemoveItemActionProto_1 =
  /*#__PURE__*/
  function (_CryptoActionProto19) {
    _inherits(KeyStorageRemoveItemActionProto, _CryptoActionProto19);

    function KeyStorageRemoveItemActionProto() {
      _classCallCheck(this, KeyStorageRemoveItemActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(KeyStorageRemoveItemActionProto).apply(this, arguments));
    }

    return KeyStorageRemoveItemActionProto;
  }(CryptoActionProto);

  KeyStorageRemoveItemActionProto.INDEX = CryptoActionProto.INDEX;
  KeyStorageRemoveItemActionProto.ACTION = "crypto/keyStorage/removeItem";

  __decorate([ProtobufProperty({
    id: KeyStorageRemoveItemActionProto_1.INDEX++,
    required: true,
    type: "string"
  })], KeyStorageRemoveItemActionProto.prototype, "key", void 0);

  KeyStorageRemoveItemActionProto = KeyStorageRemoveItemActionProto_1 = __decorate([ProtobufElement({})], KeyStorageRemoveItemActionProto);

  var KeyStorageClearActionProto =
  /*#__PURE__*/
  function (_CryptoActionProto20) {
    _inherits(KeyStorageClearActionProto, _CryptoActionProto20);

    function KeyStorageClearActionProto() {
      _classCallCheck(this, KeyStorageClearActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(KeyStorageClearActionProto).apply(this, arguments));
    }

    return KeyStorageClearActionProto;
  }(CryptoActionProto);

  KeyStorageClearActionProto.INDEX = CryptoActionProto.INDEX;
  KeyStorageClearActionProto.ACTION = "crypto/keyStorage/clear";
  KeyStorageClearActionProto = __decorate([ProtobufElement({})], KeyStorageClearActionProto);

  var KeyStorageIndexOfActionProto = KeyStorageIndexOfActionProto_1 =
  /*#__PURE__*/
  function (_CryptoActionProto21) {
    _inherits(KeyStorageIndexOfActionProto, _CryptoActionProto21);

    function KeyStorageIndexOfActionProto() {
      _classCallCheck(this, KeyStorageIndexOfActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(KeyStorageIndexOfActionProto).apply(this, arguments));
    }

    return KeyStorageIndexOfActionProto;
  }(CryptoActionProto);

  KeyStorageIndexOfActionProto.INDEX = CryptoActionProto.INDEX;
  KeyStorageIndexOfActionProto.ACTION = "crypto/keyStorage/indexOf";

  __decorate([ProtobufProperty({
    id: KeyStorageIndexOfActionProto_1.INDEX++,
    required: true,
    parser: CryptoKeyProto
  })], KeyStorageIndexOfActionProto.prototype, "item", void 0);

  KeyStorageIndexOfActionProto = KeyStorageIndexOfActionProto_1 = __decorate([ProtobufElement({})], KeyStorageIndexOfActionProto);

  var KeyStorage =
  /*#__PURE__*/
  function () {
    function KeyStorage(service) {
      _classCallCheck(this, KeyStorage);

      this.service = service;
    }

    _createClass(KeyStorage, [{
      key: "keys",
      value: function () {
        var _keys3 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee91() {
          var proto, result, _keys4;

          return regeneratorRuntime.wrap(function _callee91$(_context91) {
            while (1) {
              switch (_context91.prev = _context91.next) {
                case 0:
                  proto = new KeyStorageKeysActionProto();
                  proto.providerID = this.service.id;
                  _context91.next = 4;
                  return this.service.client.send(proto);

                case 4:
                  result = _context91.sent;

                  if (!result) {
                    _context91.next = 8;
                    break;
                  }

                  _keys4 = Convert.ToUtf8String(result).split(",");
                  return _context91.abrupt("return", _keys4);

                case 8:
                  return _context91.abrupt("return", []);

                case 9:
                case "end":
                  return _context91.stop();
              }
            }
          }, _callee91, this);
        }));

        function keys() {
          return _keys3.apply(this, arguments);
        }

        return keys;
      }()
    }, {
      key: "indexOf",
      value: function () {
        var _indexOf2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee92(item) {
          var proto, result;
          return regeneratorRuntime.wrap(function _callee92$(_context92) {
            while (1) {
              switch (_context92.prev = _context92.next) {
                case 0:
                  checkCryptoKey(item, "item");
                  proto = new KeyStorageIndexOfActionProto();
                  proto.providerID = this.service.id;
                  proto.item = item;
                  _context92.next = 6;
                  return this.service.client.send(proto);

                case 6:
                  result = _context92.sent;
                  return _context92.abrupt("return", result ? Convert.ToUtf8String(result) : null);

                case 8:
                case "end":
                  return _context92.stop();
              }
            }
          }, _callee92, this);
        }));

        function indexOf(_x101) {
          return _indexOf2.apply(this, arguments);
        }

        return indexOf;
      }()
    }, {
      key: "hasItem",
      value: function () {
        var _hasItem2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee93(item) {
          var index;
          return regeneratorRuntime.wrap(function _callee93$(_context93) {
            while (1) {
              switch (_context93.prev = _context93.next) {
                case 0:
                  _context93.next = 2;
                  return this.indexOf(item);

                case 2:
                  index = _context93.sent;
                  return _context93.abrupt("return", !!index);

                case 4:
                case "end":
                  return _context93.stop();
              }
            }
          }, _callee93, this);
        }));

        function hasItem(_x102) {
          return _hasItem2.apply(this, arguments);
        }

        return hasItem;
      }()
    }, {
      key: "getItem",
      value: function () {
        var _getItem2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee94(key, algorithm, extractable, usages) {
          var proto, result, socketKey, keyProto;
          return regeneratorRuntime.wrap(function _callee94$(_context94) {
            while (1) {
              switch (_context94.prev = _context94.next) {
                case 0:
                  checkPrimitive(key, "string", "key");

                  if (algorithm) {
                    checkAlgorithm(algorithm, "algorithm");
                    checkPrimitive(extractable, "boolean", "extractable");
                    checkArray(usages, "usages");
                  }

                  proto = new KeyStorageGetItemActionProto();
                  proto.providerID = this.service.id;
                  proto.key = key;

                  if (algorithm) {
                    proto.algorithm = prepareAlgorithm(algorithm);
                    proto.extractable = extractable;
                    proto.keyUsages = usages;
                  }

                  _context94.next = 8;
                  return this.service.client.send(proto);

                case 8:
                  result = _context94.sent;
                  socketKey = null;

                  if (!(result && result.byteLength)) {
                    _context94.next = 15;
                    break;
                  }

                  _context94.next = 13;
                  return CryptoKeyProto.importProto(result);

                case 13:
                  keyProto = _context94.sent;
                  socketKey = keyProto;

                case 15:
                  return _context94.abrupt("return", socketKey);

                case 16:
                case "end":
                  return _context94.stop();
              }
            }
          }, _callee94, this);
        }));

        function getItem(_x103, _x104, _x105, _x106) {
          return _getItem2.apply(this, arguments);
        }

        return getItem;
      }()
    }, {
      key: "setItem",
      value: function () {
        var _setItem2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee95(value) {
          var proto, data;
          return regeneratorRuntime.wrap(function _callee95$(_context95) {
            while (1) {
              switch (_context95.prev = _context95.next) {
                case 0:
                  checkCryptoKey(value, "value");
                  proto = new KeyStorageSetItemActionProto();
                  proto.providerID = this.service.id;
                  proto.item = value;
                  _context95.next = 6;
                  return this.service.client.send(proto);

                case 6:
                  data = _context95.sent;
                  return _context95.abrupt("return", Convert.ToUtf8String(data));

                case 8:
                case "end":
                  return _context95.stop();
              }
            }
          }, _callee95, this);
        }));

        function setItem(_x107) {
          return _setItem2.apply(this, arguments);
        }

        return setItem;
      }()
    }, {
      key: "removeItem",
      value: function () {
        var _removeItem2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee96(key) {
          var proto;
          return regeneratorRuntime.wrap(function _callee96$(_context96) {
            while (1) {
              switch (_context96.prev = _context96.next) {
                case 0:
                  checkPrimitive(key, "string", "key");
                  proto = new KeyStorageRemoveItemActionProto();
                  proto.providerID = this.service.id;
                  proto.key = key;
                  _context96.next = 6;
                  return this.service.client.send(proto);

                case 6:
                case "end":
                  return _context96.stop();
              }
            }
          }, _callee96, this);
        }));

        function removeItem(_x108) {
          return _removeItem2.apply(this, arguments);
        }

        return removeItem;
      }()
    }, {
      key: "clear",
      value: function () {
        var _clear2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee97() {
          var proto;
          return regeneratorRuntime.wrap(function _callee97$(_context97) {
            while (1) {
              switch (_context97.prev = _context97.next) {
                case 0:
                  proto = new KeyStorageClearActionProto();
                  proto.providerID = this.service.id;
                  _context97.next = 4;
                  return this.service.client.send(proto);

                case 4:
                case "end":
                  return _context97.stop();
              }
            }
          }, _callee97, this);
        }));

        function clear() {
          return _clear2.apply(this, arguments);
        }

        return clear;
      }()
    }]);

    return KeyStorage;
  }();

  var DigestActionProto_1, GenerateKeyActionProto_1, SignActionProto_1, VerifyActionProto_1, DeriveBitsActionProto_1, DeriveKeyActionProto_1, UnwrapKeyActionProto_1, WrapKeyActionProto_1, ExportKeyActionProto_1, ImportKeyActionProto_1;

  var DigestActionProto = DigestActionProto_1 =
  /*#__PURE__*/
  function (_CryptoActionProto22) {
    _inherits(DigestActionProto, _CryptoActionProto22);

    function DigestActionProto() {
      _classCallCheck(this, DigestActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(DigestActionProto).apply(this, arguments));
    }

    return DigestActionProto;
  }(CryptoActionProto);

  DigestActionProto.INDEX = CryptoActionProto.INDEX;
  DigestActionProto.ACTION = "crypto/subtle/digest";

  __decorate([ProtobufProperty({
    id: DigestActionProto_1.INDEX++,
    required: true,
    parser: AlgorithmProto
  })], DigestActionProto.prototype, "algorithm", void 0);

  __decorate([ProtobufProperty({
    id: DigestActionProto_1.INDEX++,
    required: true,
    converter: ArrayBufferConverter
  })], DigestActionProto.prototype, "data", void 0);

  DigestActionProto = DigestActionProto_1 = __decorate([ProtobufElement({})], DigestActionProto);

  var GenerateKeyActionProto = GenerateKeyActionProto_1 =
  /*#__PURE__*/
  function (_CryptoActionProto23) {
    _inherits(GenerateKeyActionProto, _CryptoActionProto23);

    function GenerateKeyActionProto() {
      _classCallCheck(this, GenerateKeyActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(GenerateKeyActionProto).apply(this, arguments));
    }

    return GenerateKeyActionProto;
  }(CryptoActionProto);

  GenerateKeyActionProto.INDEX = CryptoActionProto.INDEX;
  GenerateKeyActionProto.ACTION = "crypto/subtle/generateKey";

  __decorate([ProtobufProperty({
    id: GenerateKeyActionProto_1.INDEX++,
    type: "bytes",
    required: true,
    parser: AlgorithmProto
  })], GenerateKeyActionProto.prototype, "algorithm", void 0);

  __decorate([ProtobufProperty({
    id: GenerateKeyActionProto_1.INDEX++,
    type: "bool",
    required: true
  })], GenerateKeyActionProto.prototype, "extractable", void 0);

  __decorate([ProtobufProperty({
    id: GenerateKeyActionProto_1.INDEX++,
    type: "string",
    repeated: true
  })], GenerateKeyActionProto.prototype, "usage", void 0);

  GenerateKeyActionProto = GenerateKeyActionProto_1 = __decorate([ProtobufElement({})], GenerateKeyActionProto);

  var SignActionProto = SignActionProto_1 =
  /*#__PURE__*/
  function (_CryptoActionProto24) {
    _inherits(SignActionProto, _CryptoActionProto24);

    function SignActionProto() {
      _classCallCheck(this, SignActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(SignActionProto).apply(this, arguments));
    }

    return SignActionProto;
  }(CryptoActionProto);

  SignActionProto.INDEX = CryptoActionProto.INDEX;
  SignActionProto.ACTION = "crypto/subtle/sign";

  __decorate([ProtobufProperty({
    id: SignActionProto_1.INDEX++,
    required: true,
    parser: AlgorithmProto
  })], SignActionProto.prototype, "algorithm", void 0);

  __decorate([ProtobufProperty({
    id: SignActionProto_1.INDEX++,
    required: true,
    parser: CryptoKeyProto
  })], SignActionProto.prototype, "key", void 0);

  __decorate([ProtobufProperty({
    id: SignActionProto_1.INDEX++,
    required: true,
    converter: ArrayBufferConverter
  })], SignActionProto.prototype, "data", void 0);

  SignActionProto = SignActionProto_1 = __decorate([ProtobufElement({})], SignActionProto);

  var VerifyActionProto = VerifyActionProto_1 =
  /*#__PURE__*/
  function (_SignActionProto) {
    _inherits(VerifyActionProto, _SignActionProto);

    function VerifyActionProto() {
      _classCallCheck(this, VerifyActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(VerifyActionProto).apply(this, arguments));
    }

    return VerifyActionProto;
  }(SignActionProto);

  VerifyActionProto.INDEX = SignActionProto.INDEX;
  VerifyActionProto.ACTION = "crypto/subtle/verify";

  __decorate([ProtobufProperty({
    id: VerifyActionProto_1.INDEX++,
    required: true,
    converter: ArrayBufferConverter
  })], VerifyActionProto.prototype, "signature", void 0);

  VerifyActionProto = VerifyActionProto_1 = __decorate([ProtobufElement({})], VerifyActionProto);

  var EncryptActionProto =
  /*#__PURE__*/
  function (_SignActionProto2) {
    _inherits(EncryptActionProto, _SignActionProto2);

    function EncryptActionProto() {
      _classCallCheck(this, EncryptActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(EncryptActionProto).apply(this, arguments));
    }

    return EncryptActionProto;
  }(SignActionProto);

  EncryptActionProto.INDEX = SignActionProto.INDEX;
  EncryptActionProto.ACTION = "crypto/subtle/encrypt";
  EncryptActionProto = __decorate([ProtobufElement({})], EncryptActionProto);

  var DecryptActionProto =
  /*#__PURE__*/
  function (_SignActionProto3) {
    _inherits(DecryptActionProto, _SignActionProto3);

    function DecryptActionProto() {
      _classCallCheck(this, DecryptActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(DecryptActionProto).apply(this, arguments));
    }

    return DecryptActionProto;
  }(SignActionProto);

  DecryptActionProto.INDEX = SignActionProto.INDEX;
  DecryptActionProto.ACTION = "crypto/subtle/decrypt";
  DecryptActionProto = __decorate([ProtobufElement({})], DecryptActionProto);

  var DeriveBitsActionProto = DeriveBitsActionProto_1 =
  /*#__PURE__*/
  function (_CryptoActionProto25) {
    _inherits(DeriveBitsActionProto, _CryptoActionProto25);

    function DeriveBitsActionProto() {
      _classCallCheck(this, DeriveBitsActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(DeriveBitsActionProto).apply(this, arguments));
    }

    return DeriveBitsActionProto;
  }(CryptoActionProto);

  DeriveBitsActionProto.INDEX = CryptoActionProto.INDEX;
  DeriveBitsActionProto.ACTION = "crypto/subtle/deriveBits";

  __decorate([ProtobufProperty({
    id: DeriveBitsActionProto_1.INDEX++,
    required: true,
    parser: AlgorithmProto
  })], DeriveBitsActionProto.prototype, "algorithm", void 0);

  __decorate([ProtobufProperty({
    id: DeriveBitsActionProto_1.INDEX++,
    required: true,
    parser: CryptoKeyProto
  })], DeriveBitsActionProto.prototype, "key", void 0);

  __decorate([ProtobufProperty({
    id: DeriveBitsActionProto_1.INDEX++,
    required: true,
    type: "uint32"
  })], DeriveBitsActionProto.prototype, "length", void 0);

  DeriveBitsActionProto = DeriveBitsActionProto_1 = __decorate([ProtobufElement({})], DeriveBitsActionProto);

  var DeriveKeyActionProto = DeriveKeyActionProto_1 =
  /*#__PURE__*/
  function (_CryptoActionProto26) {
    _inherits(DeriveKeyActionProto, _CryptoActionProto26);

    function DeriveKeyActionProto() {
      _classCallCheck(this, DeriveKeyActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(DeriveKeyActionProto).apply(this, arguments));
    }

    return DeriveKeyActionProto;
  }(CryptoActionProto);

  DeriveKeyActionProto.INDEX = CryptoActionProto.INDEX;
  DeriveKeyActionProto.ACTION = "crypto/subtle/deriveKey";

  __decorate([ProtobufProperty({
    id: DeriveKeyActionProto_1.INDEX++,
    required: true,
    parser: AlgorithmProto
  })], DeriveKeyActionProto.prototype, "algorithm", void 0);

  __decorate([ProtobufProperty({
    id: DeriveKeyActionProto_1.INDEX++,
    required: true,
    parser: CryptoKeyProto
  })], DeriveKeyActionProto.prototype, "key", void 0);

  __decorate([ProtobufProperty({
    id: DeriveKeyActionProto_1.INDEX++,
    required: true,
    parser: AlgorithmProto
  })], DeriveKeyActionProto.prototype, "derivedKeyType", void 0);

  __decorate([ProtobufProperty({
    id: DeriveKeyActionProto_1.INDEX++,
    type: "bool"
  })], DeriveKeyActionProto.prototype, "extractable", void 0);

  __decorate([ProtobufProperty({
    id: DeriveKeyActionProto_1.INDEX++,
    type: "string",
    repeated: true
  })], DeriveKeyActionProto.prototype, "usage", void 0);

  DeriveKeyActionProto = DeriveKeyActionProto_1 = __decorate([ProtobufElement({})], DeriveKeyActionProto);

  var UnwrapKeyActionProto = UnwrapKeyActionProto_1 =
  /*#__PURE__*/
  function (_CryptoActionProto27) {
    _inherits(UnwrapKeyActionProto, _CryptoActionProto27);

    function UnwrapKeyActionProto() {
      _classCallCheck(this, UnwrapKeyActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(UnwrapKeyActionProto).apply(this, arguments));
    }

    return UnwrapKeyActionProto;
  }(CryptoActionProto);

  UnwrapKeyActionProto.INDEX = CryptoActionProto.INDEX;
  UnwrapKeyActionProto.ACTION = "crypto/subtle/unwrapKey";

  __decorate([ProtobufProperty({
    id: UnwrapKeyActionProto_1.INDEX++,
    required: true,
    type: "string"
  })], UnwrapKeyActionProto.prototype, "format", void 0);

  __decorate([ProtobufProperty({
    id: UnwrapKeyActionProto_1.INDEX++,
    required: true,
    converter: ArrayBufferConverter
  })], UnwrapKeyActionProto.prototype, "wrappedKey", void 0);

  __decorate([ProtobufProperty({
    id: UnwrapKeyActionProto_1.INDEX++,
    required: true,
    parser: CryptoKeyProto
  })], UnwrapKeyActionProto.prototype, "unwrappingKey", void 0);

  __decorate([ProtobufProperty({
    id: UnwrapKeyActionProto_1.INDEX++,
    required: true,
    parser: AlgorithmProto
  })], UnwrapKeyActionProto.prototype, "unwrapAlgorithm", void 0);

  __decorate([ProtobufProperty({
    id: UnwrapKeyActionProto_1.INDEX++,
    required: true,
    parser: AlgorithmProto
  })], UnwrapKeyActionProto.prototype, "unwrappedKeyAlgorithm", void 0);

  __decorate([ProtobufProperty({
    id: UnwrapKeyActionProto_1.INDEX++,
    type: "bool"
  })], UnwrapKeyActionProto.prototype, "extractable", void 0);

  __decorate([ProtobufProperty({
    id: UnwrapKeyActionProto_1.INDEX++,
    type: "string",
    repeated: true
  })], UnwrapKeyActionProto.prototype, "keyUsage", void 0);

  UnwrapKeyActionProto = UnwrapKeyActionProto_1 = __decorate([ProtobufElement({})], UnwrapKeyActionProto);

  var WrapKeyActionProto = WrapKeyActionProto_1 =
  /*#__PURE__*/
  function (_CryptoActionProto28) {
    _inherits(WrapKeyActionProto, _CryptoActionProto28);

    function WrapKeyActionProto() {
      _classCallCheck(this, WrapKeyActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(WrapKeyActionProto).apply(this, arguments));
    }

    return WrapKeyActionProto;
  }(CryptoActionProto);

  WrapKeyActionProto.INDEX = CryptoActionProto.INDEX;
  WrapKeyActionProto.ACTION = "crypto/subtle/wrapKey";

  __decorate([ProtobufProperty({
    id: WrapKeyActionProto_1.INDEX++,
    required: true,
    type: "string"
  })], WrapKeyActionProto.prototype, "format", void 0);

  __decorate([ProtobufProperty({
    id: WrapKeyActionProto_1.INDEX++,
    required: true,
    parser: CryptoKeyProto
  })], WrapKeyActionProto.prototype, "key", void 0);

  __decorate([ProtobufProperty({
    id: WrapKeyActionProto_1.INDEX++,
    required: true,
    parser: CryptoKeyProto
  })], WrapKeyActionProto.prototype, "wrappingKey", void 0);

  __decorate([ProtobufProperty({
    id: WrapKeyActionProto_1.INDEX++,
    required: true,
    parser: AlgorithmProto
  })], WrapKeyActionProto.prototype, "wrapAlgorithm", void 0);

  WrapKeyActionProto = WrapKeyActionProto_1 = __decorate([ProtobufElement({})], WrapKeyActionProto);

  var ExportKeyActionProto = ExportKeyActionProto_1 =
  /*#__PURE__*/
  function (_CryptoActionProto29) {
    _inherits(ExportKeyActionProto, _CryptoActionProto29);

    function ExportKeyActionProto() {
      _classCallCheck(this, ExportKeyActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(ExportKeyActionProto).apply(this, arguments));
    }

    return ExportKeyActionProto;
  }(CryptoActionProto);

  ExportKeyActionProto.INDEX = CryptoActionProto.INDEX;
  ExportKeyActionProto.ACTION = "crypto/subtle/exportKey";

  __decorate([ProtobufProperty({
    id: ExportKeyActionProto_1.INDEX++,
    type: "string",
    required: true
  })], ExportKeyActionProto.prototype, "format", void 0);

  __decorate([ProtobufProperty({
    id: ExportKeyActionProto_1.INDEX++,
    required: true,
    parser: CryptoKeyProto
  })], ExportKeyActionProto.prototype, "key", void 0);

  ExportKeyActionProto = ExportKeyActionProto_1 = __decorate([ProtobufElement({})], ExportKeyActionProto);

  var ImportKeyActionProto = ImportKeyActionProto_1 =
  /*#__PURE__*/
  function (_CryptoActionProto30) {
    _inherits(ImportKeyActionProto, _CryptoActionProto30);

    function ImportKeyActionProto() {
      _classCallCheck(this, ImportKeyActionProto);

      return _possibleConstructorReturn(this, _getPrototypeOf(ImportKeyActionProto).apply(this, arguments));
    }

    return ImportKeyActionProto;
  }(CryptoActionProto);

  ImportKeyActionProto.INDEX = CryptoActionProto.INDEX;
  ImportKeyActionProto.ACTION = "crypto/subtle/importKey";

  __decorate([ProtobufProperty({
    id: ImportKeyActionProto_1.INDEX++,
    type: "string",
    required: true
  })], ImportKeyActionProto.prototype, "format", void 0);

  __decorate([ProtobufProperty({
    id: ImportKeyActionProto_1.INDEX++,
    required: true,
    converter: ArrayBufferConverter
  })], ImportKeyActionProto.prototype, "keyData", void 0);

  __decorate([ProtobufProperty({
    id: ImportKeyActionProto_1.INDEX++,
    required: true,
    parser: AlgorithmProto
  })], ImportKeyActionProto.prototype, "algorithm", void 0);

  __decorate([ProtobufProperty({
    id: ImportKeyActionProto_1.INDEX++,
    required: true,
    type: "bool"
  })], ImportKeyActionProto.prototype, "extractable", void 0);

  __decorate([ProtobufProperty({
    id: ImportKeyActionProto_1.INDEX++,
    type: "string",
    repeated: true
  })], ImportKeyActionProto.prototype, "keyUsages", void 0);

  ImportKeyActionProto = ImportKeyActionProto_1 = __decorate([ProtobufElement({})], ImportKeyActionProto);

  var SubtleCrypto =
  /*#__PURE__*/
  function () {
    function SubtleCrypto(crypto) {
      _classCallCheck(this, SubtleCrypto);

      this.service = crypto;
    }

    _createClass(SubtleCrypto, [{
      key: "encrypt",
      value: function () {
        var _encrypt3 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee98(algorithm, key, data) {
          return regeneratorRuntime.wrap(function _callee98$(_context98) {
            while (1) {
              switch (_context98.prev = _context98.next) {
                case 0:
                  return _context98.abrupt("return", this.encryptData(algorithm, key, data, "encrypt"));

                case 1:
                case "end":
                  return _context98.stop();
              }
            }
          }, _callee98, this);
        }));

        function encrypt(_x109, _x110, _x111) {
          return _encrypt3.apply(this, arguments);
        }

        return encrypt;
      }()
    }, {
      key: "decrypt",
      value: function () {
        var _decrypt3 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee99(algorithm, key, data) {
          return regeneratorRuntime.wrap(function _callee99$(_context99) {
            while (1) {
              switch (_context99.prev = _context99.next) {
                case 0:
                  return _context99.abrupt("return", this.encryptData(algorithm, key, data, "decrypt"));

                case 1:
                case "end":
                  return _context99.stop();
              }
            }
          }, _callee99, this);
        }));

        function decrypt(_x112, _x113, _x114) {
          return _decrypt3.apply(this, arguments);
        }

        return decrypt;
      }()
    }, {
      key: "deriveBits",
      value: function () {
        var _deriveBits = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee100(algorithm, baseKey, length) {
          var algProto, action, result;
          return regeneratorRuntime.wrap(function _callee100$(_context100) {
            while (1) {
              switch (_context100.prev = _context100.next) {
                case 0:
                  checkAlgorithm(algorithm, "algorithm");
                  checkCryptoKey(baseKey, "baseKey");
                  checkPrimitive(length, "number", "length");
                  algProto = prepareAlgorithm(algorithm);
                  checkCryptoKey(algProto, "algorithm.public");
                  _context100.next = 7;
                  return Cast(algProto.public).exportProto();

                case 7:
                  algProto.public = _context100.sent;
                  action = new DeriveBitsActionProto();
                  action.providerID = this.service.id;
                  action.algorithm = algProto;
                  action.key = baseKey;
                  action.length = length;
                  _context100.next = 15;
                  return this.service.client.send(action);

                case 15:
                  result = _context100.sent;
                  return _context100.abrupt("return", result);

                case 17:
                case "end":
                  return _context100.stop();
              }
            }
          }, _callee100, this);
        }));

        function deriveBits(_x115, _x116, _x117) {
          return _deriveBits.apply(this, arguments);
        }

        return deriveBits;
      }()
    }, {
      key: "deriveKey",
      value: function () {
        var _deriveKey = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee101(algorithm, baseKey, derivedKeyType, extractable, keyUsages) {
          var algProto, algKeyType, action, result;
          return regeneratorRuntime.wrap(function _callee101$(_context101) {
            while (1) {
              switch (_context101.prev = _context101.next) {
                case 0:
                  checkAlgorithm(algorithm, "algorithm");
                  checkCryptoKey(baseKey, "baseKey");
                  checkAlgorithm(derivedKeyType, "algorithm");
                  checkPrimitive(extractable, "boolean", "extractable");
                  checkArray(keyUsages, "keyUsages");
                  algProto = prepareAlgorithm(algorithm);
                  checkCryptoKey(algProto, "algorithm.public");
                  _context101.next = 9;
                  return Cast(algProto.public).exportProto();

                case 9:
                  algProto.public = _context101.sent;
                  algKeyType = prepareAlgorithm(derivedKeyType);
                  action = new DeriveKeyActionProto();
                  action.providerID = this.service.id;
                  action.algorithm = algProto;
                  action.derivedKeyType.fromAlgorithm(algKeyType);
                  action.key = baseKey;
                  action.extractable = extractable;
                  action.usage = keyUsages;
                  _context101.next = 20;
                  return this.service.client.send(action);

                case 20:
                  result = _context101.sent;
                  _context101.next = 23;
                  return CryptoKeyProto.importProto(result);

                case 23:
                  return _context101.abrupt("return", _context101.sent);

                case 24:
                case "end":
                  return _context101.stop();
              }
            }
          }, _callee101, this);
        }));

        function deriveKey(_x118, _x119, _x120, _x121, _x122) {
          return _deriveKey.apply(this, arguments);
        }

        return deriveKey;
      }()
    }, {
      key: "digest",
      value: function () {
        var _digest = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee102(algorithm, data) {
          var algProto, rawData, action, result;
          return regeneratorRuntime.wrap(function _callee102$(_context102) {
            while (1) {
              switch (_context102.prev = _context102.next) {
                case 0:
                  checkAlgorithm(algorithm, "algorithm");
                  checkBufferSource(data, "data");
                  algProto = prepareAlgorithm(algorithm);
                  rawData = BufferSourceConverter.toArrayBuffer(data);

                  if (!self.crypto) {
                    _context102.next = 14;
                    break;
                  }

                  _context102.prev = 5;
                  _context102.next = 8;
                  return self.crypto.subtle.digest(algorithm, rawData);

                case 8:
                  return _context102.abrupt("return", _context102.sent);

                case 11:
                  _context102.prev = 11;
                  _context102.t0 = _context102["catch"](5);
                  console.warn("Cannot do native digest for algorithm '".concat(algProto.name, "'"));

                case 14:
                  action = new DigestActionProto();
                  action.algorithm = algProto;
                  action.data = rawData;
                  action.providerID = this.service.id;
                  _context102.next = 20;
                  return this.service.client.send(action);

                case 20:
                  result = _context102.sent;
                  return _context102.abrupt("return", result);

                case 22:
                case "end":
                  return _context102.stop();
              }
            }
          }, _callee102, this, [[5, 11]]);
        }));

        function digest(_x123, _x124) {
          return _digest.apply(this, arguments);
        }

        return digest;
      }()
    }, {
      key: "generateKey",
      value: function () {
        var _generateKey = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee103(algorithm, extractable, keyUsages) {
          var algProto, action, result, keyPair, key;
          return regeneratorRuntime.wrap(function _callee103$(_context103) {
            while (1) {
              switch (_context103.prev = _context103.next) {
                case 0:
                  checkAlgorithm(algorithm, "algorithm");
                  checkPrimitive(extractable, "boolean", "extractable");
                  checkArray(keyUsages, "keyUsages");
                  algProto = prepareAlgorithm(algorithm);
                  action = new GenerateKeyActionProto();
                  action.providerID = this.service.id;
                  action.algorithm = algProto;
                  action.extractable = extractable;
                  action.usage = keyUsages;
                  _context103.next = 11;
                  return this.service.client.send(action);

                case 11:
                  result = _context103.sent;
                  _context103.prev = 12;
                  _context103.next = 15;
                  return CryptoKeyPairProto.importProto(result);

                case 15:
                  keyPair = _context103.sent;
                  return _context103.abrupt("return", keyPair);

                case 19:
                  _context103.prev = 19;
                  _context103.t0 = _context103["catch"](12);
                  _context103.next = 23;
                  return CryptoKeyProto.importProto(result);

                case 23:
                  key = _context103.sent;
                  return _context103.abrupt("return", key);

                case 25:
                case "end":
                  return _context103.stop();
              }
            }
          }, _callee103, this, [[12, 19]]);
        }));

        function generateKey(_x125, _x126, _x127) {
          return _generateKey.apply(this, arguments);
        }

        return generateKey;
      }()
    }, {
      key: "exportKey",
      value: function () {
        var _exportKey = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee104(format, key) {
          var action, result;
          return regeneratorRuntime.wrap(function _callee104$(_context104) {
            while (1) {
              switch (_context104.prev = _context104.next) {
                case 0:
                  checkPrimitive(format, "string", "format");
                  checkCryptoKey(key, "key");
                  action = new ExportKeyActionProto();
                  action.providerID = this.service.id;
                  action.format = format;
                  action.key = key;
                  _context104.next = 8;
                  return this.service.client.send(action);

                case 8:
                  result = _context104.sent;

                  if (!(format === "jwk")) {
                    _context104.next = 13;
                    break;
                  }

                  return _context104.abrupt("return", JSON.parse(Convert.ToBinary(result)));

                case 13:
                  return _context104.abrupt("return", result);

                case 14:
                case "end":
                  return _context104.stop();
              }
            }
          }, _callee104, this);
        }));

        function exportKey(_x128, _x129) {
          return _exportKey.apply(this, arguments);
        }

        return exportKey;
      }()
    }, {
      key: "importKey",
      value: function () {
        var _importKey2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee105(format, keyData, algorithm, extractable, keyUsages) {
          var algProto, preparedKeyData, action, result;
          return regeneratorRuntime.wrap(function _callee105$(_context105) {
            while (1) {
              switch (_context105.prev = _context105.next) {
                case 0:
                  checkPrimitive(format, "string", "format");
                  checkAlgorithm(algorithm, "algorithm");
                  checkPrimitive(extractable, "boolean", "extractable");
                  checkArray(keyUsages, "keyUsages");
                  algProto = prepareAlgorithm(algorithm);

                  if (format === "jwk") {
                    preparedKeyData = Convert.FromUtf8String(JSON.stringify(keyData));
                  } else {
                    checkBufferSource(keyData, "keyData");
                    preparedKeyData = BufferSourceConverter.toArrayBuffer(keyData);
                  }

                  action = new ImportKeyActionProto();
                  action.providerID = this.service.id;
                  action.algorithm = algProto;
                  action.keyData = preparedKeyData;
                  action.format = format;
                  action.extractable = extractable;
                  action.keyUsages = keyUsages;
                  _context105.next = 15;
                  return this.service.client.send(action);

                case 15:
                  result = _context105.sent;
                  _context105.next = 18;
                  return CryptoKeyProto.importProto(result);

                case 18:
                  return _context105.abrupt("return", _context105.sent);

                case 19:
                case "end":
                  return _context105.stop();
              }
            }
          }, _callee105, this);
        }));

        function importKey(_x130, _x131, _x132, _x133, _x134) {
          return _importKey2.apply(this, arguments);
        }

        return importKey;
      }()
    }, {
      key: "sign",
      value: function () {
        var _sign6 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee106(algorithm, key, data) {
          var algProto, rawData, action, result;
          return regeneratorRuntime.wrap(function _callee106$(_context106) {
            while (1) {
              switch (_context106.prev = _context106.next) {
                case 0:
                  checkAlgorithm(algorithm, "algorithm");
                  checkCryptoKey(key, "key");
                  checkBufferSource(data, "data");
                  algProto = prepareAlgorithm(algorithm);
                  rawData = BufferSourceConverter.toArrayBuffer(data);
                  action = new SignActionProto();
                  action.providerID = this.service.id;
                  action.algorithm = algProto;
                  action.key = key;
                  action.data = rawData;
                  _context106.next = 12;
                  return this.service.client.send(action);

                case 12:
                  result = _context106.sent;
                  return _context106.abrupt("return", result);

                case 14:
                case "end":
                  return _context106.stop();
              }
            }
          }, _callee106, this);
        }));

        function sign(_x135, _x136, _x137) {
          return _sign6.apply(this, arguments);
        }

        return sign;
      }()
    }, {
      key: "verify",
      value: function () {
        var _verify3 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee107(algorithm, key, signature, data) {
          var algProto, rawSignature, rawData, action, result;
          return regeneratorRuntime.wrap(function _callee107$(_context107) {
            while (1) {
              switch (_context107.prev = _context107.next) {
                case 0:
                  checkAlgorithm(algorithm, "algorithm");
                  checkCryptoKey(key, "key");
                  checkBufferSource(signature, "signature");
                  checkBufferSource(data, "data");
                  algProto = prepareAlgorithm(algorithm);
                  rawSignature = BufferSourceConverter.toArrayBuffer(signature);
                  rawData = BufferSourceConverter.toArrayBuffer(data);
                  action = new VerifyActionProto();
                  action.providerID = this.service.id;
                  action.algorithm = algProto;
                  action.key = key;
                  action.data = rawData;
                  action.signature = rawSignature;
                  _context107.next = 15;
                  return this.service.client.send(action);

                case 15:
                  result = _context107.sent;
                  return _context107.abrupt("return", !!new Uint8Array(result)[0]);

                case 17:
                case "end":
                  return _context107.stop();
              }
            }
          }, _callee107, this);
        }));

        function verify(_x138, _x139, _x140, _x141) {
          return _verify3.apply(this, arguments);
        }

        return verify;
      }()
    }, {
      key: "wrapKey",
      value: function () {
        var _wrapKey = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee108(format, key, wrappingKey, wrapAlgorithm) {
          var wrapAlgProto, action, result;
          return regeneratorRuntime.wrap(function _callee108$(_context108) {
            while (1) {
              switch (_context108.prev = _context108.next) {
                case 0:
                  checkPrimitive(format, "string", "format");
                  checkCryptoKey(key, "key");
                  checkCryptoKey(wrappingKey, "wrappingKey");
                  checkAlgorithm(wrapAlgorithm, "wrapAlgorithm");
                  wrapAlgProto = prepareAlgorithm(wrapAlgorithm);
                  action = new WrapKeyActionProto();
                  action.providerID = this.service.id;
                  action.wrapAlgorithm = wrapAlgProto;
                  action.key = key;
                  action.wrappingKey = wrappingKey;
                  action.format = format;
                  _context108.next = 13;
                  return this.service.client.send(action);

                case 13:
                  result = _context108.sent;
                  return _context108.abrupt("return", result);

                case 15:
                case "end":
                  return _context108.stop();
              }
            }
          }, _callee108, this);
        }));

        function wrapKey(_x142, _x143, _x144, _x145) {
          return _wrapKey.apply(this, arguments);
        }

        return wrapKey;
      }()
    }, {
      key: "unwrapKey",
      value: function () {
        var _unwrapKey = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee109(format, wrappedKey, unwrappingKey, unwrapAlgorithm, unwrappedKeyAlgorithm, extractable, keyUsages) {
          var unwrapAlgProto, unwrappedKeyAlgProto, rawWrappedKey, action, result;
          return regeneratorRuntime.wrap(function _callee109$(_context109) {
            while (1) {
              switch (_context109.prev = _context109.next) {
                case 0:
                  checkPrimitive(format, "string", "format");
                  checkBufferSource(wrappedKey, "wrappedKey");
                  checkCryptoKey(unwrappingKey, "unwrappingKey");
                  checkAlgorithm(unwrapAlgorithm, "unwrapAlgorithm");
                  checkAlgorithm(unwrappedKeyAlgorithm, "unwrappedKeyAlgorithm");
                  checkPrimitive(extractable, "boolean", "extractable");
                  checkArray(keyUsages, "keyUsages");
                  unwrapAlgProto = prepareAlgorithm(unwrapAlgorithm);
                  unwrappedKeyAlgProto = prepareAlgorithm(unwrappedKeyAlgorithm);
                  rawWrappedKey = BufferSourceConverter.toArrayBuffer(wrappedKey);
                  action = new UnwrapKeyActionProto();
                  action.providerID = this.service.id;
                  action.format = format;
                  action.unwrapAlgorithm = unwrapAlgProto;
                  action.unwrappedKeyAlgorithm = unwrappedKeyAlgProto;
                  action.unwrappingKey = unwrappingKey;
                  action.wrappedKey = rawWrappedKey;
                  action.extractable = extractable;
                  action.keyUsage = keyUsages;
                  _context109.next = 21;
                  return this.service.client.send(action);

                case 21:
                  result = _context109.sent;
                  _context109.next = 24;
                  return CryptoKeyProto.importProto(result);

                case 24:
                  return _context109.abrupt("return", _context109.sent);

                case 25:
                case "end":
                  return _context109.stop();
              }
            }
          }, _callee109, this);
        }));

        function unwrapKey(_x146, _x147, _x148, _x149, _x150, _x151, _x152) {
          return _unwrapKey.apply(this, arguments);
        }

        return unwrapKey;
      }()
    }, {
      key: "encryptData",
      value: function () {
        var _encryptData = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee110(algorithm, key, data, type) {
          var algProto, rawData, ActionClass, action, result;
          return regeneratorRuntime.wrap(function _callee110$(_context110) {
            while (1) {
              switch (_context110.prev = _context110.next) {
                case 0:
                  checkAlgorithm(algorithm, "algorithm");
                  checkCryptoKey(key, "key");
                  checkBufferSource(data, "data");
                  algProto = prepareAlgorithm(algorithm);
                  rawData = BufferSourceConverter.toArrayBuffer(data);

                  if (type === "encrypt") {
                    ActionClass = EncryptActionProto;
                  } else {
                    ActionClass = DecryptActionProto;
                  }

                  action = new ActionClass();
                  action.providerID = this.service.id;
                  action.algorithm = algProto;
                  action.key = key;
                  action.data = rawData;
                  _context110.next = 13;
                  return this.service.client.send(action);

                case 13:
                  result = _context110.sent;
                  return _context110.abrupt("return", result);

                case 15:
                case "end":
                  return _context110.stop();
              }
            }
          }, _callee110, this);
        }));

        function encryptData(_x153, _x154, _x155, _x156) {
          return _encryptData.apply(this, arguments);
        }

        return encryptData;
      }()
    }]);

    return SubtleCrypto;
  }();

  var SocketCrypto =
  /*#__PURE__*/
  function () {
    function SocketCrypto(client, id) {
      _classCallCheck(this, SocketCrypto);

      this.client = client;
      this.id = id;
      this.subtle = new SubtleCrypto(this);
      this.keyStorage = new KeyStorage(this);
      this.certStorage = new CertificateStorage(this);
    }

    _createClass(SocketCrypto, [{
      key: "getRandomValues",
      value: function getRandomValues(array) {
        if (!self.crypto) {
          throw new Error("Cannot get native crypto object. Function getRandomValues is not implemented.");
        }

        return self.crypto.getRandomValues(array);
      }
    }, {
      key: "login",
      value: function () {
        var _login2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee111() {
          var action;
          return regeneratorRuntime.wrap(function _callee111$(_context111) {
            while (1) {
              switch (_context111.prev = _context111.next) {
                case 0:
                  action = new LoginActionProto();
                  action.providerID = this.id;
                  return _context111.abrupt("return", this.client.send(action));

                case 3:
                case "end":
                  return _context111.stop();
              }
            }
          }, _callee111, this);
        }));

        function login() {
          return _login2.apply(this, arguments);
        }

        return login;
      }()
    }, {
      key: "logout",
      value: function () {
        var _logout = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee112() {
          var action;
          return regeneratorRuntime.wrap(function _callee112$(_context112) {
            while (1) {
              switch (_context112.prev = _context112.next) {
                case 0:
                  action = new LogoutActionProto();
                  action.providerID = this.id;
                  return _context112.abrupt("return", this.client.send(action));

                case 3:
                case "end":
                  return _context112.stop();
              }
            }
          }, _callee112, this);
        }));

        function logout() {
          return _logout.apply(this, arguments);
        }

        return logout;
      }()
    }, {
      key: "reset",
      value: function () {
        var _reset = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee113() {
          var action;
          return regeneratorRuntime.wrap(function _callee113$(_context113) {
            while (1) {
              switch (_context113.prev = _context113.next) {
                case 0:
                  action = new ResetActionProto();
                  action.providerID = this.id;
                  return _context113.abrupt("return", this.client.send(action));

                case 3:
                case "end":
                  return _context113.stop();
              }
            }
          }, _callee113, this);
        }));

        function reset() {
          return _reset.apply(this, arguments);
        }

        return reset;
      }()
    }, {
      key: "isLoggedIn",
      value: function () {
        var _isLoggedIn2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee114() {
          var action, res;
          return regeneratorRuntime.wrap(function _callee114$(_context114) {
            while (1) {
              switch (_context114.prev = _context114.next) {
                case 0:
                  action = new IsLoggedInActionProto();
                  action.providerID = this.id;
                  _context114.next = 4;
                  return this.client.send(action);

                case 4:
                  res = _context114.sent;
                  return _context114.abrupt("return", !!new Uint8Array(res)[0]);

                case 6:
                case "end":
                  return _context114.stop();
              }
            }
          }, _callee114, this);
        }));

        function isLoggedIn() {
          return _isLoggedIn2.apply(this, arguments);
        }

        return isLoggedIn;
      }()
    }]);

    return SocketCrypto;
  }();

  var SocketProvider =
  /*#__PURE__*/
  function (_EventEmitter4) {
    _inherits(SocketProvider, _EventEmitter4);

    function SocketProvider() {
      var _this24;

      _classCallCheck(this, SocketProvider);

      _this24 = _possibleConstructorReturn(this, _getPrototypeOf(SocketProvider).call(this));
      _this24.client = new Client();
      _this24.cardReader = new CardReader(_this24.client);
      return _this24;
    }

    _createClass(SocketProvider, [{
      key: "connect",
      value: function connect(address) {
        var _this25 = this;

        this.client = new Client();
        this.client.connect(address).on("error", function (e) {
          _this25.emit("error", e.error);
        }).on("event", function (proto) {
          _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee115() {
            var tokenProto, authProto;
            return regeneratorRuntime.wrap(function _callee115$(_context115) {
              while (1) {
                switch (_context115.prev = _context115.next) {
                  case 0:
                    _context115.t0 = proto.action;
                    _context115.next = _context115.t0 === ProviderTokenEventProto.ACTION ? 3 : _context115.t0 === ProviderAuthorizedEventProto.ACTION ? 11 : 19;
                    break;

                  case 3:
                    _context115.t1 = ProviderTokenEventProto;
                    _context115.next = 6;
                    return proto.exportProto();

                  case 6:
                    _context115.t2 = _context115.sent;
                    _context115.next = 9;
                    return _context115.t1.importProto.call(_context115.t1, _context115.t2);

                  case 9:
                    tokenProto = _context115.sent;

                    _this25.emit("token", tokenProto);

                  case 11:
                    _context115.t3 = ProviderAuthorizedEventProto;
                    _context115.next = 14;
                    return proto.exportProto();

                  case 14:
                    _context115.t4 = _context115.sent;
                    _context115.next = 17;
                    return _context115.t3.importProto.call(_context115.t3, _context115.t4);

                  case 17:
                    authProto = _context115.sent;

                    _this25.emit("auth", authProto);

                  case 19:
                  case "end":
                    return _context115.stop();
                }
              }
            }, _callee115, this);
          }))();
        }).on("listening", function (e) {
          if (self.PV_WEBCRYPTO_SOCKET_LOG) {
            console.info("Client:Listening", e.address);
          }

          _this25.emit("listening", address);
        }).on("close", function (e) {
          if (self.PV_WEBCRYPTO_SOCKET_LOG) {
            console.info("Client:Closed: ".concat(e.description, " (code: ").concat(e.reasonCode, ")"));
          }

          _this25.emit("close", e.remoteAddress);
        });
        return this;
      }
    }, {
      key: "close",
      value: function close() {
        this.client.close();
      }
    }, {
      key: "on",
      value: function on(event, listener) {
        return _get(_getPrototypeOf(SocketProvider.prototype), "on", this).call(this, event, listener);
      }
    }, {
      key: "once",
      value: function once(event, listener) {
        return _get(_getPrototypeOf(SocketProvider.prototype), "once", this).call(this, event, listener);
      }
    }, {
      key: "info",
      value: function () {
        var _info = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee116() {
          var proto, result, infoProto;
          return regeneratorRuntime.wrap(function _callee116$(_context116) {
            while (1) {
              switch (_context116.prev = _context116.next) {
                case 0:
                  proto = new ProviderInfoActionProto();
                  _context116.next = 3;
                  return this.client.send(proto);

                case 3:
                  result = _context116.sent;
                  _context116.next = 6;
                  return ProviderInfoProto.importProto(result);

                case 6:
                  infoProto = _context116.sent;
                  return _context116.abrupt("return", infoProto);

                case 8:
                case "end":
                  return _context116.stop();
              }
            }
          }, _callee116, this);
        }));

        function info() {
          return _info.apply(this, arguments);
        }

        return info;
      }()
    }, {
      key: "challenge",
      value: function () {
        var _challenge4 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee117() {
          return regeneratorRuntime.wrap(function _callee117$(_context117) {
            while (1) {
              switch (_context117.prev = _context117.next) {
                case 0:
                  return _context117.abrupt("return", this.client.challenge());

                case 1:
                case "end":
                  return _context117.stop();
              }
            }
          }, _callee117, this);
        }));

        function challenge() {
          return _challenge4.apply(this, arguments);
        }

        return challenge;
      }()
    }, {
      key: "isLoggedIn",
      value: function () {
        var _isLoggedIn3 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee118() {
          return regeneratorRuntime.wrap(function _callee118$(_context118) {
            while (1) {
              switch (_context118.prev = _context118.next) {
                case 0:
                  return _context118.abrupt("return", this.client.isLoggedIn());

                case 1:
                case "end":
                  return _context118.stop();
              }
            }
          }, _callee118, this);
        }));

        function isLoggedIn() {
          return _isLoggedIn3.apply(this, arguments);
        }

        return isLoggedIn;
      }()
    }, {
      key: "login",
      value: function () {
        var _login3 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee119() {
          return regeneratorRuntime.wrap(function _callee119$(_context119) {
            while (1) {
              switch (_context119.prev = _context119.next) {
                case 0:
                  return _context119.abrupt("return", this.client.login());

                case 1:
                case "end":
                  return _context119.stop();
              }
            }
          }, _callee119, this);
        }));

        function login() {
          return _login3.apply(this, arguments);
        }

        return login;
      }()
    }, {
      key: "getCrypto",
      value: function () {
        var _getCrypto = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee120(cryptoID) {
          var actionProto;
          return regeneratorRuntime.wrap(function _callee120$(_context120) {
            while (1) {
              switch (_context120.prev = _context120.next) {
                case 0:
                  actionProto = new ProviderGetCryptoActionProto();
                  actionProto.cryptoID = cryptoID;
                  _context120.next = 4;
                  return this.client.send(actionProto);

                case 4:
                  return _context120.abrupt("return", new SocketCrypto(this.client, cryptoID));

                case 5:
                case "end":
                  return _context120.stop();
              }
            }
          }, _callee120, this);
        }));

        function getCrypto(_x157) {
          return _getCrypto.apply(this, arguments);
        }

        return getCrypto;
      }()
    }, {
      key: "state",
      get: function get() {
        return this.client.state;
      }
    }]);

    return SocketProvider;
  }(EventEmitter);

  exports.setEngine = setEngine;
  exports.getEngine = getEngine;
  exports.SocketProvider = SocketProvider;

  return exports;

}({}, protobuf));
