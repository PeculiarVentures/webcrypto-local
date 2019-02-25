var WebcryptoSocket = (function (exports, protobufjs) {
	'use strict';

	var _objectKeys = /*#__PURE__*/Object.freeze({

	});
	var _iterDefine = /*#__PURE__*/Object.freeze({

	});
	var _typedArray = /*#__PURE__*/Object.freeze({

	});

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var _global = createCommonjsModule(function (module) {
	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self // eslint-disable-next-line no-new-func
	: Function('return this')();
	if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
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

	module.exports = function (it) {
	  return _typeof(it) === 'object' ? it !== null : typeof it === 'function';
	};

	var _isObject = /*#__PURE__*/Object.freeze({

	});

	var _anObject = function (it) {
	  if (!_isObject(it)) throw TypeError(it + ' is not an object!');
	  return it;
	};

	var _aFunction = function (it) {
	  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
	  return it;
	};

	// optional / simple context binding


	var _ctx = function (fn, that, length) {
	  _aFunction(fn);
	  if (that === undefined) return fn;

	  switch (length) {
	    case 1:
	      return function (a) {
	        return fn.call(that, a);
	      };

	    case 2:
	      return function (a, b) {
	        return fn.call(that, a, b);
	      };

	    case 3:
	      return function (a, b, c) {
	        return fn.call(that, a, b, c);
	      };
	  }

	  return function ()
	  /* ...args */
	  {
	    return fn.apply(that, arguments);
	  };
	};

	var f = {}.propertyIsEnumerable;

	var _objectPie = {
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

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = require('./_cof'); // eslint-disable-next-line no-prototype-builtins


	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

	var _iobject = /*#__PURE__*/Object.freeze({

	});

	// 7.2.1 RequireObjectCoercible(argument)
	var _defined = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on  " + it);
	  return it;
	};

	// to indexed object, toObject with fallback for non-array-like ES3 strings




	var _toIobject = function (it) {
	  return _iobject(_defined(it));
	};

	var anObject = require('./_an-object');

	var toLength = require('./_to-length');

	var advanceStringIndex = require('./_advance-string-index');

	var regExpExec = require('./_regexp-exec-abstract'); // @@match logic


	require('./_fix-re-wks')('match', 1, function (defined, MATCH, $match, maybeCallNative) {
	  return [// `String.prototype.match` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.match
	  function match(regexp) {
	    var O = defined(this);
	    var fn = regexp == undefined ? undefined : regexp[MATCH];
	    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
	  }, // `RegExp.prototype[@@match]` method
	  // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
	  function (regexp) {
	    var res = maybeCallNative($match, regexp, this);
	    if (res.done) return res.value;
	    var rx = anObject(regexp);
	    var S = String(this);
	    if (!rx.global) return regExpExec(rx, S);
	    var fullUnicode = rx.unicode;
	    rx.lastIndex = 0;
	    var A = [];
	    var n = 0;
	    var result;

	    while ((result = regExpExec(rx, S)) !== null) {
	      var matchStr = String(result[0]);
	      A[n] = matchStr;
	      if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
	      n++;
	    }

	    return n === 0 ? null : A;
	  }];
	});

	var dP = require('./_object-dp').f;

	var FProto = Function.prototype;
	var nameRE = /^\s*function ([^ (]*)/;
	var NAME = 'name'; // 19.2.4.2 name

	NAME in FProto || require('./_descriptors') && dP(FProto, NAME, {
	  configurable: true,
	  get: function get() {
	    try {
	      return ('' + this).match(nameRE)[1];
	    } catch (e) {
	      return '';
	    }
	  }
	});

	// 21.2.5.3 get RegExp.prototype.flags()
	if (require('./_descriptors') && /./g.flags != 'g') require('./_object-dp').f(RegExp.prototype, 'flags', {
	  configurable: true,
	  get: require('./_flags')
	});

	require('./es6.regexp.flags');

	var anObject$1 = require('./_an-object');

	var $flags = require('./_flags');

	var DESCRIPTORS = require('./_descriptors');

	var TO_STRING = 'toString';
	var $toString = /./[TO_STRING];

	var define = function define(fn) {
	  require('./_redefine')(RegExp.prototype, TO_STRING, fn, true);
	}; // 21.2.5.14 RegExp.prototype.toString()


	if (require('./_fails')(function () {
	  return $toString.call({
	    source: 'a',
	    flags: 'b'
	  }) != '/a/b';
	})) {
	  define(function toString() {
	    var R = anObject$1(this);
	    return '/'.concat(R.source, '/', 'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
	  }); // FF44- RegExp#toString has a wrong name
	} else if ($toString.name != TO_STRING) {
	  define(function toString() {
	    return $toString.call(this);
	  });
	}

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = require('./_is-object'); // instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string


	module.exports = function (it, S) {
	  if (!isObject(it)) return it;
	  var fn, val;
	  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
	  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
	  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var _toPrimitive = /*#__PURE__*/Object.freeze({

	});

	var hasOwnProperty = {}.hasOwnProperty;

	var _has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var _fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (e) {
	    return true;
	  }
	};

	// Thank's IE8 for his funny defineProperty
	var _descriptors = !_fails(function () {
	  return Object.defineProperty({}, 'a', {
	    get: function get() {
	      return 7;
	    }
	  }).a != 7;
	});

	var document$1 = _global.document; // typeof document.createElement is 'object' in old IE


	var is = _isObject(document$1) && _isObject(document$1.createElement);

	var _domCreate = function (it) {
	  return is ? document$1.createElement(it) : {};
	};

	var _ie8DomDefine = !_descriptors && !_fails(function () {
	  return Object.defineProperty(_domCreate('div'), 'a', {
	    get: function get() {
	      return 7;
	    }
	  }).a != 7;
	});

	var gOPD = Object.getOwnPropertyDescriptor;
	var f$1 = _descriptors ? gOPD : function getOwnPropertyDescriptor(O, P) {
	  O = _toIobject(O);
	  P = _toPrimitive(P, true);
	  if (_ie8DomDefine) try {
	    return gOPD(O, P);
	  } catch (e) {
	    /* empty */
	  }
	  if (_has(O, P)) return _propertyDesc(!_objectPie.f.call(O, P), O[P]);
	};

	var _objectGopd = {
		f: f$1
	};

	// Works with __proto__ only. Old v8 can't work with null proto objects.

	/* eslint-disable no-proto */




	var check = function check(O, proto) {
	  _anObject(O);
	  if (!_isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
	};

	var _setProto = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	  function (test, buggy, set) {
	    try {
	      set = _ctx(Function.call, _objectGopd.f(Object.prototype, '__proto__').set, 2);
	      set(test, []);
	      buggy = !(test instanceof Array);
	    } catch (e) {
	      buggy = true;
	    }

	    return function setPrototypeOf(O, proto) {
	      check(O, proto);
	      if (buggy) O.__proto__ = proto;else set(O, proto);
	      return O;
	    };
	  }({}, false) : undefined),
	  check: check
	};

	var setPrototypeOf = _setProto.set;

	var _inheritIfRequired = function (that, target, C) {
	  var S = target.constructor;
	  var P;

	  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && _isObject(P) && setPrototypeOf) {
	    setPrototypeOf(that, P);
	  }

	  return that;
	};

	var dP$1 = Object.defineProperty;
	var f$2 = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
	  _anObject(O);
	  P = _toPrimitive(P, true);
	  _anObject(Attributes);
	  if (_ie8DomDefine) try {
	    return dP$1(O, P, Attributes);
	  } catch (e) {
	    /* empty */
	  }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var _objectDp = {
		f: f$2
	};

	// 7.1.4 ToInteger
	var ceil = Math.ceil;
	var floor = Math.floor;

	var _toInteger = function (it) {
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

	// 7.1.15 ToLength


	var min = Math.min;

	var _toLength = function (it) {
	  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

	var max = Math.max;
	var min$1 = Math.min;

	var _toAbsoluteIndex = function (index, length) {
	  index = _toInteger(index);
	  return index < 0 ? max(index + length, 0) : min$1(index, length);
	};

	// false -> Array#indexOf
	// true  -> Array#includes






	var _arrayIncludes = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = _toIobject($this);
	    var length = _toLength(O.length);
	    var index = _toAbsoluteIndex(fromIndex, length);
	    var value; // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare

	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++]; // eslint-disable-next-line no-self-compare

	      if (value != value) return true; // Array#indexOf ignores holes, Array#includes - not
	    } else for (; length > index; index++) {
	      if (IS_INCLUDES || index in O) {
	        if (O[index] === el) return IS_INCLUDES || index || 0;
	      }
	    }
	    return !IS_INCLUDES && -1;
	  };
	};

	var _core = createCommonjsModule(function (module) {
	var core = module.exports = {
	  version: '2.6.5'
	};
	if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
	});
	var _core_1 = _core.version;

	var _library = false;

	var _shared = createCommonjsModule(function (module) {
	var SHARED = '__core-js_shared__';
	var store = _global[SHARED] || (_global[SHARED] = {});
	(module.exports = function (key, value) {
	  return store[key] || (store[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: _core.version,
	  mode: 'global',
	  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
	});
	});

	var id = 0;
	var px = Math.random();

	module.exports = function (key) {
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

	var _uid = /*#__PURE__*/Object.freeze({

	});

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

	  for (key in O) {
	    if (key != IE_PROTO) _has(O, key) && result.push(key);
	  } // Don't enum bug & hidden keys


	  while (names.length > i) {
	    if (_has(O, key = names[i++])) {
	      ~arrayIndexOf(result, key) || result.push(key);
	    }
	  }

	  return result;
	};

	// IE 8- don't enum bug keys
	module.exports = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');

	var _enumBugKeys = /*#__PURE__*/Object.freeze({

	});

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)


	var hiddenKeys = _enumBugKeys.concat('length', 'prototype');

	var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return _objectKeysInternal(O, hiddenKeys);
	};

	var _objectGopn = {
		f: f$3
	};

	var toString = {}.toString;

	module.exports = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	var _cof = /*#__PURE__*/Object.freeze({

	});

	var store = require('./_shared')('wks');

	var uid = require('./_uid');

	var _Symbol = require('./_global').Symbol;

	var USE_SYMBOL = typeof _Symbol == 'function';

	var $exports = module.exports = function (name) {
	  return store[name] || (store[name] = USE_SYMBOL && _Symbol[name] || (USE_SYMBOL ? _Symbol : uid)('Symbol.' + name));
	};

	$exports.store = store;

	var _wks = /*#__PURE__*/Object.freeze({

	});

	// 7.2.8 IsRegExp(argument)




	var MATCH = _wks('match');

	var _isRegexp = function (it) {
	  var isRegExp;
	  return _isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : _cof(it) == 'RegExp');
	};

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

	var global = require('./_global');

	var hide = require('./_hide');

	var has = require('./_has');

	var SRC = require('./_uid')('src');

	var $toString$1 = require('./_function-to-string');

	var TO_STRING$1 = 'toString';
	var TPL = ('' + $toString$1).split(TO_STRING$1);

	require('./_core').inspectSource = function (it) {
	  return $toString$1.call(it);
	};

	(module.exports = function (O, key, val, safe) {
	  var isFunction = typeof val == 'function';
	  if (isFunction) has(val, 'name') || hide(val, 'name', key);
	  if (O[key] === val) return;
	  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));

	  if (O === global) {
	    O[key] = val;
	  } else if (!safe) {
	    delete O[key];
	    hide(O, key, val);
	  } else if (O[key]) {
	    O[key] = val;
	  } else {
	    hide(O, key, val);
	  } // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative

	})(Function.prototype, TO_STRING$1, function toString() {
	  return typeof this == 'function' && this[SRC] || $toString$1.call(this);
	});

	var _redefine = /*#__PURE__*/Object.freeze({

	});

	var SPECIES = _wks('species');

	var _setSpecies = function (KEY) {
	  var C = _global[KEY];
	  if (_descriptors && C && !C[SPECIES]) _objectDp.f(C, SPECIES, {
	    configurable: true,
	    get: function get() {
	      return this;
	    }
	  });
	};

	var dP$2 = _objectDp.f;

	var gOPN = _objectGopn.f;





	var $RegExp = _global.RegExp;
	var Base = $RegExp;
	var proto = $RegExp.prototype;
	var re1 = /a/g;
	var re2 = /a/g; // "new" creates a new object, old webkit buggy here

	var CORRECT_NEW = new $RegExp(re1) !== re1;

	if (_descriptors && (!CORRECT_NEW || _fails(function () {
	  re2[_wks('match')] = false; // RegExp constructor can alter flags and IsRegExp works correct with @@match

	  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
	}))) {
	  $RegExp = function RegExp(p, f) {
	    var tiRE = this instanceof $RegExp;
	    var piRE = _isRegexp(p);
	    var fiU = f === undefined;
	    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p : _inheritIfRequired(CORRECT_NEW ? new Base(piRE && !fiU ? p.source : p, f) : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? _flags.call(p) : f), tiRE ? this : proto, $RegExp);
	  };

	  var proxy = function proxy(key) {
	    key in $RegExp || dP$2($RegExp, key, {
	      configurable: true,
	      get: function get() {
	        return Base[key];
	      },
	      set: function set(it) {
	        Base[key] = it;
	      }
	    });
	  };

	  for (var keys = gOPN(Base), i = 0; keys.length > i;) {
	    proxy(keys[i++]);
	  }

	  proto.constructor = $RegExp;
	  $RegExp.prototype = proto;

	  _redefine(_global, 'RegExp', $RegExp);
	}

	_setSpecies('RegExp');

	var isRegExp = require('./_is-regexp');

	var anObject$2 = require('./_an-object');

	var speciesConstructor = require('./_species-constructor');

	var advanceStringIndex$1 = require('./_advance-string-index');

	var toLength$1 = require('./_to-length');

	var callRegExpExec = require('./_regexp-exec-abstract');

	var regexpExec = require('./_regexp-exec');

	var fails = require('./_fails');

	var $min = Math.min;
	var $push = [].push;
	var $SPLIT = 'split';
	var LENGTH = 'length';
	var LAST_INDEX = 'lastIndex';
	var MAX_UINT32 = 0xffffffff; // babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError

	var SUPPORTS_Y = !fails(function () {
	}); // @@split logic

	require('./_fix-re-wks')('split', 2, function (defined, SPLIT, $split, maybeCallNative) {
	  var internalSplit;

	  if ('abbc'[$SPLIT](/(b)*/)[1] == 'c' || 'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 || 'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 || '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 || '.'[$SPLIT](/()()/)[LENGTH] > 1 || ''[$SPLIT](/.?/)[LENGTH]) {
	    // based on es5-shim implementation, need to rework it
	    internalSplit = function internalSplit(separator, limit) {
	      var string = String(this);
	      if (separator === undefined && limit === 0) return []; // If `separator` is not a regex, use native split

	      if (!isRegExp(separator)) return $split.call(string, separator, limit);
	      var output = [];
	      var flags = (separator.ignoreCase ? 'i' : '') + (separator.multiline ? 'm' : '') + (separator.unicode ? 'u' : '') + (separator.sticky ? 'y' : '');
	      var lastLastIndex = 0;
	      var splitLimit = limit === undefined ? MAX_UINT32 : limit >>> 0; // Make `global` and avoid `lastIndex` issues by working with a copy

	      var separatorCopy = new RegExp(separator.source, flags + 'g');
	      var match, lastIndex, lastLength;

	      while (match = regexpExec.call(separatorCopy, string)) {
	        lastIndex = separatorCopy[LAST_INDEX];

	        if (lastIndex > lastLastIndex) {
	          output.push(string.slice(lastLastIndex, match.index));
	          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
	          lastLength = match[0][LENGTH];
	          lastLastIndex = lastIndex;
	          if (output[LENGTH] >= splitLimit) break;
	        }

	        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
	      }

	      if (lastLastIndex === string[LENGTH]) {
	        if (lastLength || !separatorCopy.test('')) output.push('');
	      } else output.push(string.slice(lastLastIndex));

	      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
	    }; // Chakra, V8

	  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
	    internalSplit = function internalSplit(separator, limit) {
	      return separator === undefined && limit === 0 ? [] : $split.call(this, separator, limit);
	    };
	  } else {
	    internalSplit = $split;
	  }

	  return [// `String.prototype.split` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.split
	  function split(separator, limit) {
	    var O = defined(this);
	    var splitter = separator == undefined ? undefined : separator[SPLIT];
	    return splitter !== undefined ? splitter.call(separator, O, limit) : internalSplit.call(String(O), separator, limit);
	  }, // `RegExp.prototype[@@split]` method
	  // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
	  //
	  // NOTE: This cannot be properly polyfilled in engines that don't support
	  // the 'y' flag.
	  function (regexp, limit) {
	    var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== $split);
	    if (res.done) return res.value;
	    var rx = anObject$2(regexp);
	    var S = String(this);
	    var C = speciesConstructor(rx, RegExp);
	    var unicodeMatching = rx.unicode;
	    var flags = (rx.ignoreCase ? 'i' : '') + (rx.multiline ? 'm' : '') + (rx.unicode ? 'u' : '') + (SUPPORTS_Y ? 'y' : 'g'); // ^(? + rx + ) is needed, in combination with some S slicing, to
	    // simulate the 'y' flag.

	    var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
	    var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	    if (lim === 0) return [];
	    if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
	    var p = 0;
	    var q = 0;
	    var A = [];

	    while (q < S.length) {
	      splitter.lastIndex = SUPPORTS_Y ? q : 0;
	      var z = callRegExpExec(splitter, SUPPORTS_Y ? S : S.slice(q));
	      var e;

	      if (z === null || (e = $min(toLength$1(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p) {
	        q = advanceStringIndex$1(S, q, unicodeMatching);
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
	  }];
	});

	// getting tag from 19.1.3.6 Object.prototype.toString()


	var TAG = _wks('toStringTag'); // ES3 wrong here


	var ARG = _cof(function () {
	  return arguments;
	}()) == 'Arguments'; // fallback for IE11 Script Access Denied error

	var tryGet = function tryGet(it, key) {
	  try {
	    return it[key];
	  } catch (e) {
	    /* empty */
	  }
	};

	var _classof = function (it) {
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null' // @@toStringTag case
	  : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T // builtinTag case
	  : ARG ? _cof(O) // ES3 arguments fallback
	  : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

	var global$1 = require('./_global');

	var core = require('./_core');

	var hide$1 = require('./_hide');

	var redefine = require('./_redefine');

	var ctx = require('./_ctx');

	var PROTOTYPE = 'prototype';

	var $export = function $export(type, name, source) {
	  var IS_FORCED = type & $export.F;
	  var IS_GLOBAL = type & $export.G;
	  var IS_STATIC = type & $export.S;
	  var IS_PROTO = type & $export.P;
	  var IS_BIND = type & $export.B;
	  var target = IS_GLOBAL ? global$1 : IS_STATIC ? global$1[name] || (global$1[name] = {}) : (global$1[name] || {})[PROTOTYPE];
	  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
	  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
	  var key, own, out, exp;
	  if (IS_GLOBAL) source = name;

	  for (key in source) {
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined; // export native or passed

	    out = (own ? target : source)[key]; // bind timers to global for call from export context

	    exp = IS_BIND && own ? ctx(out, global$1) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out; // extend global

	    if (target) redefine(target, key, out, type & $export.U); // export

	    if (exports[key] != out) hide$1(exports, key, exp);
	    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
	  }
	};

	global$1.core = core; // type bitmap

	$export.F = 1; // forced

	$export.G = 2; // global

	$export.S = 4; // static

	$export.P = 8; // proto

	$export.B = 16; // bind

	$export.W = 32; // wrap

	$export.U = 64; // safe

	$export.R = 128; // real proto method for `library`

	module.exports = $export;

	var _export = /*#__PURE__*/Object.freeze({

	});

	var _anInstance = function (it, Constructor, name, forbiddenField) {
	  if (!(it instanceof Constructor) || forbiddenField !== undefined && forbiddenField in it) {
	    throw TypeError(name + ': incorrect invocation!');
	  }

	  return it;
	};

	// call something on iterator step with safe closing on error


	var _iterCall = function (iterator, fn, value, entries) {
	  try {
	    return entries ? fn(_anObject(value)[0], value[1]) : fn(value); // 7.4.6 IteratorClose(iterator, completion)
	  } catch (e) {
	    var ret = iterator['return'];
	    if (ret !== undefined) _anObject(ret.call(iterator));
	    throw e;
	  }
	};

	var _iterators = {};

	// check on default Array iterator


	var ITERATOR = _wks('iterator');

	var ArrayProto = Array.prototype;

	var _isArrayIter = function (it) {
	  return it !== undefined && (_iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

	var ITERATOR$1 = _wks('iterator');



	var core_getIteratorMethod = _core.getIteratorMethod = function (it) {
	  if (it != undefined) return it[ITERATOR$1] || it['@@iterator'] || _iterators[_classof(it)];
	};

	var _forOf = createCommonjsModule(function (module) {
	var BREAK = {};
	var RETURN = {};

	var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
	  var iterFn = ITERATOR ? function () {
	    return iterable;
	  } : core_getIteratorMethod(iterable);
	  var f = _ctx(fn, that, entries ? 2 : 1);
	  var index = 0;
	  var length, step, iterator, result;
	  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!'); // fast case for arrays with default iterator

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

	// 7.3.20 SpeciesConstructor(O, defaultConstructor)




	var SPECIES$1 = _wks('species');

	var _speciesConstructor = function (O, D) {
	  var C = _anObject(O).constructor;
	  var S;
	  return C === undefined || (S = _anObject(C)[SPECIES$1]) == undefined ? D : _aFunction(S);
	};

	// fast apply, http://jsperf.lnkit.com/fast-apply/5
	var _invoke = function (fn, args, that) {
	  var un = that === undefined;

	  switch (args.length) {
	    case 0:
	      return un ? fn() : fn.call(that);

	    case 1:
	      return un ? fn(args[0]) : fn.call(that, args[0]);

	    case 2:
	      return un ? fn(args[0], args[1]) : fn.call(that, args[0], args[1]);

	    case 3:
	      return un ? fn(args[0], args[1], args[2]) : fn.call(that, args[0], args[1], args[2]);

	    case 4:
	      return un ? fn(args[0], args[1], args[2], args[3]) : fn.call(that, args[0], args[1], args[2], args[3]);
	  }

	  return fn.apply(that, args);
	};

	var document$2 = _global.document;

	var _html = document$2 && document$2.documentElement;

	var process = _global.process;
	var setTask = _global.setImmediate;
	var clearTask = _global.clearImmediate;
	var MessageChannel = _global.MessageChannel;
	var Dispatch = _global.Dispatch;
	var counter = 0;
	var queue = {};
	var ONREADYSTATECHANGE = 'onreadystatechange';
	var defer, channel, port;

	var run = function run() {
	  var id = +this; // eslint-disable-next-line no-prototype-builtins

	  if (queue.hasOwnProperty(id)) {
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};

	var listener = function listener(event) {
	  run.call(event.data);
	}; // Node.js 0.9+ & IE10+ has setImmediate, otherwise:


	if (!setTask || !clearTask) {
	  setTask = function setImmediate(fn) {
	    var args = [];
	    var i = 1;

	    while (arguments.length > i) {
	      args.push(arguments[i++]);
	    }

	    queue[++counter] = function () {
	      // eslint-disable-next-line no-new-func
	      _invoke(typeof fn == 'function' ? fn : Function(fn), args);
	    };

	    defer(counter);
	    return counter;
	  };

	  clearTask = function clearImmediate(id) {
	    delete queue[id];
	  }; // Node.js 0.8-


	  if (_cof(process) == 'process') {
	    defer = function defer(id) {
	      process.nextTick(_ctx(run, id, 1));
	    }; // Sphere (JS game engine) Dispatch API

	  } else if (Dispatch && Dispatch.now) {
	    defer = function defer(id) {
	      Dispatch.now(_ctx(run, id, 1));
	    }; // Browsers with MessageChannel, includes WebWorkers

	  } else if (MessageChannel) {
	    channel = new MessageChannel();
	    port = channel.port2;
	    channel.port1.onmessage = listener;
	    defer = _ctx(port.postMessage, port, 1); // Browsers with postMessage, skip WebWorkers
	    // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if (_global.addEventListener && typeof postMessage == 'function' && !_global.importScripts) {
	    defer = function defer(id) {
	      _global.postMessage(id + '', '*');
	    };

	    _global.addEventListener('message', listener, false); // IE8-
	  } else if (ONREADYSTATECHANGE in _domCreate('script')) {
	    defer = function defer(id) {
	      _html.appendChild(_domCreate('script'))[ONREADYSTATECHANGE] = function () {
	        _html.removeChild(this);
	        run.call(id);
	      };
	    }; // Rest old browsers

	  } else {
	    defer = function defer(id) {
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

	  var flush = function flush() {
	    var parent, fn;
	    if (isNode && (parent = process$1.domain)) parent.exit();

	    while (head) {
	      fn = head.fn;
	      head = head.next;

	      try {
	        fn();
	      } catch (e) {
	        if (head) notify();else last = undefined;
	        throw e;
	      }
	    }

	    last = undefined;
	    if (parent) parent.enter();
	  }; // Node.js


	  if (isNode) {
	    notify = function notify() {
	      process$1.nextTick(flush);
	    }; // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339

	  } else if (Observer && !(_global.navigator && _global.navigator.standalone)) {
	    var toggle = true;
	    var node = document.createTextNode('');
	    new Observer(flush).observe(node, {
	      characterData: true
	    }); // eslint-disable-line no-new

	    notify = function notify() {
	      node.data = toggle = !toggle;
	    }; // environments with maybe non-completely correct, but existent Promise

	  } else if (Promise$1 && Promise$1.resolve) {
	    // Promise.resolve without an argument throws an error in LG WebOS 2
	    var promise = Promise$1.resolve(undefined);

	    notify = function notify() {
	      promise.then(flush);
	    }; // for other environments - macrotask based on:
	    // - setImmediate
	    // - MessageChannel
	    // - window.postMessag
	    // - onreadystatechange
	    // - setTimeout

	  } else {
	    notify = function notify() {
	      // strange IE + webpack dev server bug - use .call(global)
	      macrotask.call(_global, flush);
	    };
	  }

	  return function (fn) {
	    var task = {
	      fn: fn,
	      next: undefined
	    };
	    if (last) last.next = task;

	    if (!head) {
	      head = task;
	      notify();
	    }

	    last = task;
	  };
	};

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

	var f$4 = function (C) {
	  return new PromiseCapability(C);
	};

	var _newPromiseCapability = {
		f: f$4
	};

	var _perform = function (exec) {
	  try {
	    return {
	      e: false,
	      v: exec()
	    };
	  } catch (e) {
	    return {
	      e: true,
	      v: e
	    };
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
	  for (var key in src) {
	    _redefine(target, key, src[key], safe);
	  }

	  return target;
	};

	var def = _objectDp.f;



	var TAG$1 = _wks('toStringTag');

	var _setToStringTag = function (it, tag, stat) {
	  if (it && !_has(it = stat ? it : it.prototype, TAG$1)) def(it, TAG$1, {
	    configurable: true,
	    value: tag
	  });
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
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

	var _hide = _descriptors ? function (object, key, value) {
	  return _objectDp.f(object, key, _propertyDesc(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	// 22.1.3.31 Array.prototype[@@unscopables]
	var UNSCOPABLES = _wks('unscopables');

	var ArrayProto$1 = Array.prototype;
	if (ArrayProto$1[UNSCOPABLES] == undefined) _hide(ArrayProto$1, UNSCOPABLES, {});

	var _addToUnscopables = function (key) {
	  ArrayProto$1[UNSCOPABLES][key] = true;
	};

	var _iterStep = function (done, value) {
	  return {
	    value: value,
	    done: !!done
	  };
	};

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()


	var es6_array_iterator = _iterDefine(Array, 'Array', function (iterated, kind) {
	  this._t = _toIobject(iterated); // target

	  this._i = 0; // next index

	  this._k = kind; // kind
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
	}, 'values'); // argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)

	_iterators.Arguments = _iterators.Array;
	_addToUnscopables('keys');
	_addToUnscopables('values');
	_addToUnscopables('entries');

	// 7.1.13 ToObject(argument)


	var _toObject = function (it) {
	  return Object(_defined(it));
	};

	// most Object methods by ES6 should accept primitives






	var _objectSap = function (KEY, exec) {
	  var fn = (_core.Object || {})[KEY] || Object[KEY];
	  var exp = {};
	  exp[KEY] = exec(fn);
	  _export(_export.S + _export.F * _fails(function () {
	    fn(1);
	  }), 'Object', exp);
	};

	// 19.1.2.14 Object.keys(O)




	_objectSap('keys', function () {
	  return function keys(it) {
	    return _objectKeys(_toObject(it));
	  };
	});

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys = require('./_object-keys-internal');

	var enumBugKeys = require('./_enum-bug-keys');

	module.exports = Object.keys || function keys(O) {
	  return $keys(O, enumBugKeys);
	};

	var ITERATOR$2 = _wks('iterator');
	var TO_STRING_TAG = _wks('toStringTag');
	var ArrayValues = _iterators.Array;
	var DOMIterables = {
	  CSSRuleList: true,
	  // TODO: Not spec compliant, should be false.
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
	  MediaList: true,
	  // TODO: Not spec compliant, should be false.
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
	  StyleSheetList: true,
	  // TODO: Not spec compliant, should be false.
	  TextTrackCueList: false,
	  TextTrackList: false,
	  TouchList: false
	};

	for (var collections = _objectKeys(DOMIterables), i$1 = 0; i$1 < collections.length; i$1++) {
	  var NAME$1 = collections[i$1];
	  var explicit = DOMIterables[NAME$1];
	  var Collection = _global[NAME$1];
	  var proto$1 = Collection && Collection.prototype;
	  var key;

	  if (proto$1) {
	    if (!proto$1[ITERATOR$2]) _hide(proto$1, ITERATOR$2, ArrayValues);
	    if (!proto$1[TO_STRING_TAG]) _hide(proto$1, TO_STRING_TAG, NAME$1);
	    _iterators[NAME$1] = ArrayValues;
	    if (explicit) for (key in es6_array_iterator) {
	      if (!proto$1[key]) _redefine(proto$1, key, es6_array_iterator[key], true);
	    }
	  }
	}

	var LIBRARY = require('./_library');

	var $export$1 = require('./_export');

	var redefine$1 = require('./_redefine');

	var hide$2 = require('./_hide');

	var Iterators = require('./_iterators');

	var $iterCreate = require('./_iter-create');

	var setToStringTag = require('./_set-to-string-tag');

	var getPrototypeOf = require('./_object-gpo');

	var ITERATOR$3 = require('./_wks')('iterator');

	var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`

	var FF_ITERATOR = '@@iterator';
	var KEYS = 'keys';
	var VALUES = 'values';

	var returnThis = function returnThis() {
	  return this;
	};

	module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
	  $iterCreate(Constructor, NAME, next);

	  var getMethod = function getMethod(kind) {
	    if (!BUGGY && kind in proto) return proto[kind];

	    switch (kind) {
	      case KEYS:
	        return function keys() {
	          return new Constructor(this, kind);
	        };

	      case VALUES:
	        return function values() {
	          return new Constructor(this, kind);
	        };
	    }

	    return function entries() {
	      return new Constructor(this, kind);
	    };
	  };

	  var TAG = NAME + ' Iterator';
	  var DEF_VALUES = DEFAULT == VALUES;
	  var VALUES_BUG = false;
	  var proto = Base.prototype;
	  var $native = proto[ITERATOR$3] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
	  var $default = $native || getMethod(DEFAULT);
	  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
	  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
	  var methods, key, IteratorPrototype; // Fix native

	  if ($anyNative) {
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));

	    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true); // fix for some old engines

	      if (!LIBRARY && typeof IteratorPrototype[ITERATOR$3] != 'function') hide$2(IteratorPrototype, ITERATOR$3, returnThis);
	    }
	  } // fix Array#{values, @@iterator}.name in V8 / FF


	  if (DEF_VALUES && $native && $native.name !== VALUES) {
	    VALUES_BUG = true;

	    $default = function values() {
	      return $native.call(this);
	    };
	  } // Define iterator


	  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR$3])) {
	    hide$2(proto, ITERATOR$3, $default);
	  } // Plug for library


	  Iterators[NAME] = $default;
	  Iterators[TAG] = returnThis;

	  if (DEFAULT) {
	    methods = {
	      values: DEF_VALUES ? $default : getMethod(VALUES),
	      keys: IS_SET ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if (FORCED) for (key in methods) {
	      if (!(key in proto)) redefine$1(proto, key, methods[key]);
	    } else $export$1($export$1.P + $export$1.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }

	  return methods;
	};

	var $at = _stringAt(true); // 21.1.3.27 String.prototype[@@iterator]()


	_iterDefine(String, 'String', function (iterated) {
	  this._t = String(iterated); // target

	  this._i = 0; // next index
	  // 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function () {
	  var O = this._t;
	  var index = this._i;
	  var point;
	  if (index >= O.length) return {
	    value: undefined,
	    done: true
	  };
	  point = $at(O, index);
	  this._i += point.length;
	  return {
	    value: point,
	    done: false
	  };
	});

	var ctx$1 = require('./_ctx');

	var $export$2 = require('./_export');

	var toObject = require('./_to-object');

	var call = require('./_iter-call');

	var isArrayIter = require('./_is-array-iter');

	var toLength$2 = require('./_to-length');

	var createProperty = require('./_create-property');

	var getIterFn = require('./core.get-iterator-method');

	$export$2($export$2.S + $export$2.F * !require('./_iter-detect')(function (iter) {
	}), 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function from(arrayLike
	  /* , mapfn = undefined, thisArg = undefined */
	  ) {
	    var O = toObject(arrayLike);
	    var C = typeof this == 'function' ? this : Array;
	    var aLen = arguments.length;
	    var mapfn = aLen > 1 ? arguments[1] : undefined;
	    var mapping = mapfn !== undefined;
	    var index = 0;
	    var iterFn = getIterFn(O);
	    var length, result, step, iterator;
	    if (mapping) mapfn = ctx$1(mapfn, aLen > 2 ? arguments[2] : undefined, 2); // if object isn't iterable or it's array with default iterator - use simple case

	    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
	      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
	        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
	      }
	    } else {
	      length = toLength$2(O.length);

	      for (result = new C(length); length > index; index++) {
	        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
	      }
	    }

	    result.length = index;
	    return result;
	  }
	});

	var ITERATOR$4 = require('./_wks')('iterator');

	var SAFE_CLOSING = false;

	try {
	  var riter = [7][ITERATOR$4]();

	  riter['return'] = function () {
	    SAFE_CLOSING = true;
	  }; // eslint-disable-next-line no-throw-literal
	} catch (e) {
	  /* empty */
	}

	module.exports = function (exec, skipClosing) {
	  if (!skipClosing && !SAFE_CLOSING) return false;
	  var safe = false;

	  try {
	    var arr = [7];
	    var iter = arr[ITERATOR$4]();

	    iter.next = function () {
	      return {
	        done: safe = true
	      };
	    };

	    arr[ITERATOR$4] = function () {
	      return iter;
	    };

	    exec(arr);
	  } catch (e) {
	    /* empty */
	  }

	  return safe;
	};

	var _iterDetect = /*#__PURE__*/Object.freeze({

	});

	var task = _task.set;

	var microtask = _microtask();









	var PROMISE = 'Promise';
	var TypeError$1 = _global.TypeError;
	var process$2 = _global.process;
	var versions = process$2 && process$2.versions;
	var v8 = versions && versions.v8 || '';
	var $Promise = _global[PROMISE];
	var isNode$1 = _classof(process$2) == 'process';

	var empty = function empty() {
	  /* empty */
	};

	var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
	var newPromiseCapability = newGenericPromiseCapability = _newPromiseCapability.f;
	var USE_NATIVE = !!function () {
	  try {
	    // correct subclassing with @@species support
	    var promise = $Promise.resolve(1);

	    var FakePromise = (promise.constructor = {})[_wks('species')] = function (exec) {
	      exec(empty, empty);
	    }; // unhandled rejections tracking support, NodeJS Promise without it fails @@species test


	    return (isNode$1 || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
	    // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
	    // we can't detect it synchronously, so just check versions
	    && v8.indexOf('6.6') !== 0 && _userAgent.indexOf('Chrome/66') === -1;
	  } catch (e) {
	    /* empty */
	  }
	}(); // helpers

	var isThenable = function isThenable(it) {
	  var then;
	  return _isObject(it) && typeof (then = it.then) == 'function' ? then : false;
	};

	var notify = function notify(promise, isReject) {
	  if (promise._n) return;
	  promise._n = true;
	  var chain = promise._c;
	  microtask(function () {
	    var value = promise._v;
	    var ok = promise._s == 1;
	    var i = 0;

	    var run = function run(reaction) {
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

	          if (handler === true) result = value;else {
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

	    while (chain.length > i) {
	      run(chain[i++]);
	    } // variable length - can't use forEach


	    promise._c = [];
	    promise._n = false;
	    if (isReject && !promise._h) onUnhandled(promise);
	  });
	};

	var onUnhandled = function onUnhandled(promise) {
	  task.call(_global, function () {
	    var value = promise._v;
	    var unhandled = isUnhandled(promise);
	    var result, handler, console;

	    if (unhandled) {
	      result = _perform(function () {
	        if (isNode$1) {
	          process$2.emit('unhandledRejection', value, promise);
	        } else if (handler = _global.onunhandledrejection) {
	          handler({
	            promise: promise,
	            reason: value
	          });
	        } else if ((console = _global.console) && console.error) {
	          console.error('Unhandled promise rejection', value);
	        }
	      }); // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should

	      promise._h = isNode$1 || isUnhandled(promise) ? 2 : 1;
	    }

	    promise._a = undefined;
	    if (unhandled && result.e) throw result.v;
	  });
	};

	var isUnhandled = function isUnhandled(promise) {
	  return promise._h !== 1 && (promise._a || promise._c).length === 0;
	};

	var onHandleUnhandled = function onHandleUnhandled(promise) {
	  task.call(_global, function () {
	    var handler;

	    if (isNode$1) {
	      process$2.emit('rejectionHandled', promise);
	    } else if (handler = _global.onrejectionhandled) {
	      handler({
	        promise: promise,
	        reason: promise._v
	      });
	    }
	  });
	};

	var $reject = function $reject(value) {
	  var promise = this;
	  if (promise._d) return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap

	  promise._v = value;
	  promise._s = 2;
	  if (!promise._a) promise._a = promise._c.slice();
	  notify(promise, true);
	};

	var $resolve = function $resolve(value) {
	  var promise = this;
	  var then;
	  if (promise._d) return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap

	  try {
	    if (promise === value) throw TypeError$1("Promise can't be resolved itself");

	    if (then = isThenable(value)) {
	      microtask(function () {
	        var wrapper = {
	          _w: promise,
	          _d: false
	        }; // wrap

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
	    $reject.call({
	      _w: promise,
	      _d: false
	    }, e); // wrap
	  }
	}; // constructor polyfill


	if (!USE_NATIVE) {
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
	  }; // eslint-disable-next-line no-unused-vars


	  Internal = function Promise(executor) {
	    this._c = []; // <- awaiting reactions

	    this._a = undefined; // <- checked in isUnhandled reactions

	    this._s = 0; // <- state

	    this._d = false; // <- done

	    this._v = undefined; // <- value

	    this._h = 0; // <- rejection state, 0 - default, 1 - handled, 2 - unhandled

	    this._n = false; // <- notify
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
	    'catch': function _catch(onRejected) {
	      return this.then(undefined, onRejected);
	    }
	  });

	  OwnPromiseCapability = function OwnPromiseCapability() {
	    var promise = new Internal();
	    this.promise = promise;
	    this.resolve = _ctx($resolve, promise, 1);
	    this.reject = _ctx($reject, promise, 1);
	  };

	  _newPromiseCapability.f = newPromiseCapability = function newPromiseCapability(C) {
	    return C === $Promise || C === Wrapper ? new OwnPromiseCapability(C) : newGenericPromiseCapability(C);
	  };
	}

	_export(_export.G + _export.W + _export.F * !USE_NATIVE, {
	  Promise: $Promise
	});

	_setToStringTag($Promise, PROMISE);

	_setSpecies(PROMISE);

	Wrapper = _core[PROMISE]; // statics

	_export(_export.S + _export.F * !USE_NATIVE, PROMISE, {
	  // 25.4.4.5 Promise.reject(r)
	  reject: function reject(r) {
	    var capability = newPromiseCapability(this);
	    var $$reject = capability.reject;
	    $$reject(r);
	    return capability.promise;
	  }
	});
	_export(_export.S + _export.F * (_library || !USE_NATIVE), PROMISE, {
	  // 25.4.4.6 Promise.resolve(x)
	  resolve: function resolve(x) {
	    return _promiseResolve(_library && this === Wrapper ? $Promise : this, x);
	  }
	});
	_export(_export.S + _export.F * !(USE_NATIVE && _iterDetect(function (iter) {
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

	_typedArray('Uint16', 2, function (init) {
	  return function Uint16Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	if (require('./_descriptors')) {
	  var LIBRARY$1 = require('./_library');

	  var global$2 = require('./_global');

	  var fails$1 = require('./_fails');

	  var $export$3 = require('./_export');

	  var $typed = require('./_typed');

	  var $buffer = require('./_typed-buffer');

	  var ctx$2 = require('./_ctx');

	  var anInstance = require('./_an-instance');

	  var propertyDesc = require('./_property-desc');

	  var hide$3 = require('./_hide');

	  var redefineAll = require('./_redefine-all');

	  var toInteger = require('./_to-integer');

	  var toLength$3 = require('./_to-length');

	  var toIndex = require('./_to-index');

	  var toAbsoluteIndex = require('./_to-absolute-index');

	  var toPrimitive = require('./_to-primitive');

	  var has$1 = require('./_has');

	  var classof = require('./_classof');

	  var isObject$1 = require('./_is-object');

	  var toObject$1 = require('./_to-object');

	  var isArrayIter$1 = require('./_is-array-iter');

	  var create = require('./_object-create');

	  var getPrototypeOf$1 = require('./_object-gpo');

	  var gOPN$1 = require('./_object-gopn').f;

	  var getIterFn$1 = require('./core.get-iterator-method');

	  var uid$1 = require('./_uid');

	  var wks = require('./_wks');

	  var createArrayMethod = require('./_array-methods');

	  var createArrayIncludes = require('./_array-includes');

	  var speciesConstructor$1 = require('./_species-constructor');

	  var ArrayIterators = require('./es6.array.iterator');

	  var Iterators$1 = require('./_iterators');

	  var $iterDetect = require('./_iter-detect');

	  var setSpecies = require('./_set-species');

	  var arrayFill = require('./_array-fill');

	  var arrayCopyWithin = require('./_array-copy-within');

	  var $DP = require('./_object-dp');

	  var $GOPD = require('./_object-gopd');

	  var dP$3 = $DP.f;
	  var gOPD$1 = $GOPD.f;
	  var RangeError$1 = global$2.RangeError;
	  var TypeError$2 = global$2.TypeError;
	  var Uint8Array$1 = global$2.Uint8Array;
	  var ARRAY_BUFFER = 'ArrayBuffer';
	  var SHARED_BUFFER = 'Shared' + ARRAY_BUFFER;
	  var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
	  var PROTOTYPE$1 = 'prototype';
	  var ArrayProto$2 = Array[PROTOTYPE$1];
	  var $ArrayBuffer = $buffer.ArrayBuffer;
	  var $DataView = $buffer.DataView;
	  var arrayForEach = createArrayMethod(0);
	  var arrayFilter = createArrayMethod(2);
	  var arraySome = createArrayMethod(3);
	  var arrayEvery = createArrayMethod(4);
	  var arrayFind = createArrayMethod(5);
	  var arrayFindIndex = createArrayMethod(6);
	  var arrayIncludes = createArrayIncludes(true);
	  var arrayIndexOf$1 = createArrayIncludes(false);
	  var arrayValues = ArrayIterators.values;
	  var arrayKeys = ArrayIterators.keys;
	  var arrayEntries = ArrayIterators.entries;
	  var arrayLastIndexOf = ArrayProto$2.lastIndexOf;
	  var arrayReduce = ArrayProto$2.reduce;
	  var arrayReduceRight = ArrayProto$2.reduceRight;
	  var arrayJoin = ArrayProto$2.join;
	  var arraySort = ArrayProto$2.sort;
	  var arraySlice = ArrayProto$2.slice;
	  var arrayToString = ArrayProto$2.toString;
	  var arrayToLocaleString = ArrayProto$2.toLocaleString;
	  var ITERATOR$5 = wks('iterator');
	  var TAG$2 = wks('toStringTag');
	  var TYPED_CONSTRUCTOR = uid$1('typed_constructor');
	  var DEF_CONSTRUCTOR = uid$1('def_constructor');
	  var ALL_CONSTRUCTORS = $typed.CONSTR;
	  var TYPED_ARRAY = $typed.TYPED;
	  var VIEW = $typed.VIEW;
	  var WRONG_LENGTH = 'Wrong length!';
	  var $map = createArrayMethod(1, function (O, length) {
	    return allocate(speciesConstructor$1(O, O[DEF_CONSTRUCTOR]), length);
	  });
	  var LITTLE_ENDIAN = fails$1(function () {
	    // eslint-disable-next-line no-undef
	    return new Uint8Array$1(new Uint16Array([1]).buffer)[0] === 1;
	  });
	  var FORCED_SET = !!Uint8Array$1 && !!Uint8Array$1[PROTOTYPE$1].set && fails$1(function () {
	    new Uint8Array$1(1).set({});
	  });

	  var toOffset = function toOffset(it, BYTES) {
	    var offset = toInteger(it);
	    if (offset < 0 || offset % BYTES) throw RangeError$1('Wrong offset!');
	    return offset;
	  };

	  var validate = function validate(it) {
	    if (isObject$1(it) && TYPED_ARRAY in it) return it;
	    throw TypeError$2(it + ' is not a typed array!');
	  };

	  var allocate = function allocate(C, length) {
	    if (!(isObject$1(C) && TYPED_CONSTRUCTOR in C)) {
	      throw TypeError$2('It is not a typed array constructor!');
	    }

	    return new C(length);
	  };

	  var speciesFromList = function speciesFromList(O, list) {
	    return fromList(speciesConstructor$1(O, O[DEF_CONSTRUCTOR]), list);
	  };

	  var fromList = function fromList(C, list) {
	    var index = 0;
	    var length = list.length;
	    var result = allocate(C, length);

	    while (length > index) {
	      result[index] = list[index++];
	    }

	    return result;
	  };

	  var addGetter = function addGetter(it, key, internal) {
	    dP$3(it, key, {
	      get: function get() {
	        return this._d[internal];
	      }
	    });
	  };

	  var $from = function from(source
	  /* , mapfn, thisArg */
	  ) {
	    var O = toObject$1(source);
	    var aLen = arguments.length;
	    var mapfn = aLen > 1 ? arguments[1] : undefined;
	    var mapping = mapfn !== undefined;
	    var iterFn = getIterFn$1(O);
	    var i, length, values, result, step, iterator;

	    if (iterFn != undefined && !isArrayIter$1(iterFn)) {
	      for (iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++) {
	        values.push(step.value);
	      }

	      O = values;
	    }

	    if (mapping && aLen > 2) mapfn = ctx$2(mapfn, arguments[2], 2);

	    for (i = 0, length = toLength$3(O.length), result = allocate(this, length); length > i; i++) {
	      result[i] = mapping ? mapfn(O[i], i) : O[i];
	    }

	    return result;
	  };

	  var $of = function of()
	  /* ...items */
	  {
	    var index = 0;
	    var length = arguments.length;
	    var result = allocate(this, length);

	    while (length > index) {
	      result[index] = arguments[index++];
	    }

	    return result;
	  }; // iOS Safari 6.x fails here


	  var TO_LOCALE_BUG = !!Uint8Array$1 && fails$1(function () {
	    arrayToLocaleString.call(new Uint8Array$1(1));
	  });

	  var $toLocaleString = function toLocaleString() {
	    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
	  };

	  var proto$2 = {
	    copyWithin: function copyWithin(target, start
	    /* , end */
	    ) {
	      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    every: function every(callbackfn
	    /* , thisArg */
	    ) {
	      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    fill: function fill(value
	    /* , start, end */
	    ) {
	      // eslint-disable-line no-unused-vars
	      return arrayFill.apply(validate(this), arguments);
	    },
	    filter: function filter(callbackfn
	    /* , thisArg */
	    ) {
	      return speciesFromList(this, arrayFilter(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined));
	    },
	    find: function find(predicate
	    /* , thisArg */
	    ) {
	      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    findIndex: function findIndex(predicate
	    /* , thisArg */
	    ) {
	      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    forEach: function forEach(callbackfn
	    /* , thisArg */
	    ) {
	      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    indexOf: function indexOf(searchElement
	    /* , fromIndex */
	    ) {
	      return arrayIndexOf$1(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    includes: function includes(searchElement
	    /* , fromIndex */
	    ) {
	      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    join: function join(separator) {
	      // eslint-disable-line no-unused-vars
	      return arrayJoin.apply(validate(this), arguments);
	    },
	    lastIndexOf: function lastIndexOf(searchElement
	    /* , fromIndex */
	    ) {
	      // eslint-disable-line no-unused-vars
	      return arrayLastIndexOf.apply(validate(this), arguments);
	    },
	    map: function map(mapfn
	    /* , thisArg */
	    ) {
	      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    reduce: function reduce(callbackfn
	    /* , initialValue */
	    ) {
	      // eslint-disable-line no-unused-vars
	      return arrayReduce.apply(validate(this), arguments);
	    },
	    reduceRight: function reduceRight(callbackfn
	    /* , initialValue */
	    ) {
	      // eslint-disable-line no-unused-vars
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
	      }

	      return that;
	    },
	    some: function some(callbackfn
	    /* , thisArg */
	    ) {
	      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    sort: function sort(comparefn) {
	      return arraySort.call(validate(this), comparefn);
	    },
	    subarray: function subarray(begin, end) {
	      var O = validate(this);
	      var length = O.length;
	      var $begin = toAbsoluteIndex(begin, length);
	      return new (speciesConstructor$1(O, O[DEF_CONSTRUCTOR]))(O.buffer, O.byteOffset + $begin * O.BYTES_PER_ELEMENT, toLength$3((end === undefined ? length : toAbsoluteIndex(end, length)) - $begin));
	    }
	  };

	  var $slice = function slice(start, end) {
	    return speciesFromList(this, arraySlice.call(validate(this), start, end));
	  };

	  var $set = function set(arrayLike
	  /* , offset */
	  ) {
	    validate(this);
	    var offset = toOffset(arguments[1], 1);
	    var length = this.length;
	    var src = toObject$1(arrayLike);
	    var len = toLength$3(src.length);
	    var index = 0;
	    if (len + offset > length) throw RangeError$1(WRONG_LENGTH);

	    while (index < len) {
	      this[offset + index] = src[index++];
	    }
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

	  var isTAIndex = function isTAIndex(target, key) {
	    return isObject$1(target) && target[TYPED_ARRAY] && _typeof(key) != 'symbol' && key in target && String(+key) == String(key);
	  };

	  var $getDesc = function getOwnPropertyDescriptor(target, key) {
	    return isTAIndex(target, key = toPrimitive(key, true)) ? propertyDesc(2, target[key]) : gOPD$1(target, key);
	  };

	  var $setDesc = function defineProperty(target, key, desc) {
	    if (isTAIndex(target, key = toPrimitive(key, true)) && isObject$1(desc) && has$1(desc, 'value') && !has$1(desc, 'get') && !has$1(desc, 'set') // TODO: add validation descriptor w/o calling accessors
	    && !desc.configurable && (!has$1(desc, 'writable') || desc.writable) && (!has$1(desc, 'enumerable') || desc.enumerable)) {
	      target[key] = desc.value;
	      return target;
	    }

	    return dP$3(target, key, desc);
	  };

	  if (!ALL_CONSTRUCTORS) {
	    $GOPD.f = $getDesc;
	    $DP.f = $setDesc;
	  }

	  $export$3($export$3.S + $export$3.F * !ALL_CONSTRUCTORS, 'Object', {
	    getOwnPropertyDescriptor: $getDesc,
	    defineProperty: $setDesc
	  });

	  if (fails$1(function () {
	    arrayToString.call({});
	  })) {
	    arrayToString = arrayToLocaleString = function toString() {
	      return arrayJoin.call(this);
	    };
	  }

	  var $TypedArrayPrototype$ = redefineAll({}, proto$2);
	  redefineAll($TypedArrayPrototype$, $iterators);
	  hide$3($TypedArrayPrototype$, ITERATOR$5, $iterators.values);
	  redefineAll($TypedArrayPrototype$, {
	    slice: $slice,
	    set: $set,
	    constructor: function constructor() {
	      /* noop */
	    },
	    toString: arrayToString,
	    toLocaleString: $toLocaleString
	  });
	  addGetter($TypedArrayPrototype$, 'buffer', 'b');
	  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
	  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
	  addGetter($TypedArrayPrototype$, 'length', 'e');
	  dP$3($TypedArrayPrototype$, TAG$2, {
	    get: function get() {
	      return this[TYPED_ARRAY];
	    }
	  }); // eslint-disable-next-line max-statements

	  module.exports = function (KEY, BYTES, wrapper, CLAMPED) {
	    CLAMPED = !!CLAMPED;
	    var NAME = KEY + (CLAMPED ? 'Clamped' : '') + 'Array';
	    var GETTER = 'get' + KEY;
	    var SETTER = 'set' + KEY;
	    var TypedArray = global$2[NAME];
	    var Base = TypedArray || {};
	    var TAC = TypedArray && getPrototypeOf$1(TypedArray);
	    var FORCED = !TypedArray || !$typed.ABV;
	    var O = {};
	    var TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE$1];

	    var getter = function getter(that, index) {
	      var data = that._d;
	      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
	    };

	    var setter = function setter(that, index, value) {
	      var data = that._d;
	      if (CLAMPED) value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
	      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
	    };

	    var addElement = function addElement(that, index) {
	      dP$3(that, index, {
	        get: function get() {
	          return getter(this, index);
	        },
	        set: function set(value) {
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

	        if (!isObject$1(data)) {
	          length = toIndex(data);
	          byteLength = length * BYTES;
	          buffer = new $ArrayBuffer(byteLength);
	        } else if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
	          buffer = data;
	          offset = toOffset($offset, BYTES);
	          var $len = data.byteLength;

	          if ($length === undefined) {
	            if ($len % BYTES) throw RangeError$1(WRONG_LENGTH);
	            byteLength = $len - offset;
	            if (byteLength < 0) throw RangeError$1(WRONG_LENGTH);
	          } else {
	            byteLength = toLength$3($length) * BYTES;
	            if (byteLength + offset > $len) throw RangeError$1(WRONG_LENGTH);
	          }

	          length = byteLength / BYTES;
	        } else if (TYPED_ARRAY in data) {
	          return fromList(TypedArray, data);
	        } else {
	          return $from.call(TypedArray, data);
	        }

	        hide$3(that, '_d', {
	          b: buffer,
	          o: offset,
	          l: byteLength,
	          e: length,
	          v: new $DataView(buffer)
	        });

	        while (index < length) {
	          addElement(that, index++);
	        }
	      });
	      TypedArrayPrototype = TypedArray[PROTOTYPE$1] = create($TypedArrayPrototype$);
	      hide$3(TypedArrayPrototype, 'constructor', TypedArray);
	    } else if (!fails$1(function () {
	      TypedArray(1);
	    }) || !fails$1(function () {
	      new TypedArray(-1); // eslint-disable-line no-new
	    }) || !$iterDetect(function (iter) {
	      new TypedArray(); // eslint-disable-line no-new

	      new TypedArray(null); // eslint-disable-line no-new

	      new TypedArray(1.5); // eslint-disable-line no-new

	      new TypedArray(iter); // eslint-disable-line no-new
	    }, true)) {
	      TypedArray = wrapper(function (that, data, $offset, $length) {
	        anInstance(that, TypedArray, NAME);
	        var klass; // `ws` module bug, temporarily remove validation length for Uint8Array
	        // https://github.com/websockets/ws/pull/645

	        if (!isObject$1(data)) return new Base(toIndex(data));

	        if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
	          return $length !== undefined ? new Base(data, toOffset($offset, BYTES), $length) : $offset !== undefined ? new Base(data, toOffset($offset, BYTES)) : new Base(data);
	        }

	        if (TYPED_ARRAY in data) return fromList(TypedArray, data);
	        return $from.call(TypedArray, data);
	      });
	      arrayForEach(TAC !== Function.prototype ? gOPN$1(Base).concat(gOPN$1(TAC)) : gOPN$1(Base), function (key) {
	        if (!(key in TypedArray)) hide$3(TypedArray, key, Base[key]);
	      });
	      TypedArray[PROTOTYPE$1] = TypedArrayPrototype;
	      if (!LIBRARY$1) TypedArrayPrototype.constructor = TypedArray;
	    }

	    var $nativeIterator = TypedArrayPrototype[ITERATOR$5];
	    var CORRECT_ITER_NAME = !!$nativeIterator && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined);
	    var $iterator = $iterators.values;
	    hide$3(TypedArray, TYPED_CONSTRUCTOR, true);
	    hide$3(TypedArrayPrototype, TYPED_ARRAY, NAME);
	    hide$3(TypedArrayPrototype, VIEW, true);
	    hide$3(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

	    if (CLAMPED ? new TypedArray(1)[TAG$2] != NAME : !(TAG$2 in TypedArrayPrototype)) {
	      dP$3(TypedArrayPrototype, TAG$2, {
	        get: function get() {
	          return NAME;
	        }
	      });
	    }

	    O[NAME] = TypedArray;
	    $export$3($export$3.G + $export$3.W + $export$3.F * (TypedArray != Base), O);
	    $export$3($export$3.S, NAME, {
	      BYTES_PER_ELEMENT: BYTES
	    });
	    $export$3($export$3.S + $export$3.F * fails$1(function () {
	      Base.of.call(TypedArray, 1);
	    }), NAME, {
	      from: $from,
	      of: $of
	    });
	    if (!(BYTES_PER_ELEMENT in TypedArrayPrototype)) hide$3(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);
	    $export$3($export$3.P, NAME, proto$2);
	    setSpecies(NAME);
	    $export$3($export$3.P + $export$3.F * FORCED_SET, NAME, {
	      set: $set
	    });
	    $export$3($export$3.P + $export$3.F * !CORRECT_ITER_NAME, NAME, $iterators);
	    if (!LIBRARY$1 && TypedArrayPrototype.toString != arrayToString) TypedArrayPrototype.toString = arrayToString;
	    $export$3($export$3.P + $export$3.F * fails$1(function () {
	      new TypedArray(1).slice();
	    }), NAME, {
	      slice: $slice
	    });
	    $export$3($export$3.P + $export$3.F * (fails$1(function () {
	      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString();
	    }) || !fails$1(function () {
	      TypedArrayPrototype.toLocaleString.call([1, 2]);
	    })), NAME, {
	      toLocaleString: $toLocaleString
	    });
	    Iterators$1[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
	    if (!LIBRARY$1 && !CORRECT_ITER_NAME) hide$3(TypedArrayPrototype, ITERATOR$5, $iterator);
	  };
	} else module.exports = function () {
	  /* empty */
	};

	_typedArray('Uint8', 1, function (init) {
	  return function Uint8Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	var f$5 = _wks;

	var _wksExt = {
		f: f$5
	};

	var defineProperty = _objectDp.f;

	var _wksDefine = function (name) {
	  var $Symbol = _core.Symbol || (_core.Symbol = _global.Symbol || {});
	  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, {
	    value: _wksExt.f(name)
	  });
	};

	_wksDefine('asyncIterator');

	var global$3 = require('./_global');

	var has$2 = require('./_has');

	var DESCRIPTORS$1 = require('./_descriptors');

	var $export$4 = require('./_export');

	var redefine$2 = require('./_redefine');

	var META = require('./_meta').KEY;

	var $fails = require('./_fails');

	var shared$1 = require('./_shared');

	var setToStringTag$1 = require('./_set-to-string-tag');

	var uid$2 = require('./_uid');

	var wks$1 = require('./_wks');

	var wksExt = require('./_wks-ext');

	var wksDefine = require('./_wks-define');

	var enumKeys = require('./_enum-keys');

	var isArray = require('./_is-array');

	var anObject$3 = require('./_an-object');

	var isObject$2 = require('./_is-object');

	var toIObject = require('./_to-iobject');

	var toPrimitive$1 = require('./_to-primitive');

	var createDesc = require('./_property-desc');

	var _create = require('./_object-create');

	var gOPNExt = require('./_object-gopn-ext');

	var $GOPD$1 = require('./_object-gopd');

	var $DP$1 = require('./_object-dp');

	var $keys$1 = require('./_object-keys');

	var gOPD$2 = $GOPD$1.f;
	var dP$4 = $DP$1.f;
	var gOPN$2 = gOPNExt.f;
	var $Symbol = global$3.Symbol;
	var $JSON = global$3.JSON;

	var _stringify = $JSON && $JSON.stringify;

	var PROTOTYPE$2 = 'prototype';
	var HIDDEN = wks$1('_hidden');
	var TO_PRIMITIVE = wks$1('toPrimitive');
	var isEnum = {}.propertyIsEnumerable;
	var SymbolRegistry = shared$1('symbol-registry');
	var AllSymbols = shared$1('symbols');
	var OPSymbols = shared$1('op-symbols');
	var ObjectProto = Object[PROTOTYPE$2];
	var USE_NATIVE$1 = typeof $Symbol == 'function';
	var QObject = global$3.QObject; // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173

	var setter = !QObject || !QObject[PROTOTYPE$2] || !QObject[PROTOTYPE$2].findChild; // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687

	var setSymbolDesc = DESCRIPTORS$1 && $fails(function () {
	  return _create(dP$4({}, 'a', {
	    get: function get() {
	      return dP$4(this, 'a', {
	        value: 7
	      }).a;
	    }
	  })).a != 7;
	}) ? function (it, key, D) {
	  var protoDesc = gOPD$2(ObjectProto, key);
	  if (protoDesc) delete ObjectProto[key];
	  dP$4(it, key, D);
	  if (protoDesc && it !== ObjectProto) dP$4(ObjectProto, key, protoDesc);
	} : dP$4;

	var wrap = function wrap(tag) {
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE$2]);

	  sym._k = tag;
	  return sym;
	};

	var isSymbol = USE_NATIVE$1 && _typeof($Symbol.iterator) == 'symbol' ? function (it) {
	  return _typeof(it) == 'symbol';
	} : function (it) {
	  return it instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(it, key, D) {
	  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
	  anObject$3(it);
	  key = toPrimitive$1(key, true);
	  anObject$3(D);

	  if (has$2(AllSymbols, key)) {
	    if (!D.enumerable) {
	      if (!has$2(it, HIDDEN)) dP$4(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if (has$2(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
	      D = _create(D, {
	        enumerable: createDesc(0, false)
	      });
	    }

	    return setSymbolDesc(it, key, D);
	  }

	  return dP$4(it, key, D);
	};

	var $defineProperties = function defineProperties(it, P) {
	  anObject$3(it);
	  var keys = enumKeys(P = toIObject(P));
	  var i = 0;
	  var l = keys.length;
	  var key;

	  while (l > i) {
	    $defineProperty(it, key = keys[i++], P[key]);
	  }

	  return it;
	};

	var $create = function create(it, P) {
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};

	var $propertyIsEnumerable = function propertyIsEnumerable(key) {
	  var E = isEnum.call(this, key = toPrimitive$1(key, true));
	  if (this === ObjectProto && has$2(AllSymbols, key) && !has$2(OPSymbols, key)) return false;
	  return E || !has$2(this, key) || !has$2(AllSymbols, key) || has$2(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};

	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
	  it = toIObject(it);
	  key = toPrimitive$1(key, true);
	  if (it === ObjectProto && has$2(AllSymbols, key) && !has$2(OPSymbols, key)) return;
	  var D = gOPD$2(it, key);
	  if (D && has$2(AllSymbols, key) && !(has$2(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
	  return D;
	};

	var $getOwnPropertyNames = function getOwnPropertyNames(it) {
	  var names = gOPN$2(toIObject(it));
	  var result = [];
	  var i = 0;
	  var key;

	  while (names.length > i) {
	    if (!has$2(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
	  }

	  return result;
	};

	var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
	  var IS_OP = it === ObjectProto;
	  var names = gOPN$2(IS_OP ? OPSymbols : toIObject(it));
	  var result = [];
	  var i = 0;
	  var key;

	  while (names.length > i) {
	    if (has$2(AllSymbols, key = names[i++]) && (IS_OP ? has$2(ObjectProto, key) : true)) result.push(AllSymbols[key]);
	  }

	  return result;
	}; // 19.4.1.1 Symbol([description])


	if (!USE_NATIVE$1) {
	  $Symbol = function _Symbol() {
	    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
	    var tag = uid$2(arguments.length > 0 ? arguments[0] : undefined);

	    var $set = function $set(value) {
	      if (this === ObjectProto) $set.call(OPSymbols, value);
	      if (has$2(this, HIDDEN) && has$2(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };

	    if (DESCRIPTORS$1 && setter) setSymbolDesc(ObjectProto, tag, {
	      configurable: true,
	      set: $set
	    });
	    return wrap(tag);
	  };

	  redefine$2($Symbol[PROTOTYPE$2], 'toString', function toString() {
	    return this._k;
	  });
	  $GOPD$1.f = $getOwnPropertyDescriptor;
	  $DP$1.f = $defineProperty;
	  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
	  require('./_object-pie').f = $propertyIsEnumerable;
	  require('./_object-gops').f = $getOwnPropertySymbols;

	  if (DESCRIPTORS$1 && !require('./_library')) {
	    redefine$2(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }

	  wksExt.f = function (name) {
	    return wrap(wks$1(name));
	  };
	}

	$export$4($export$4.G + $export$4.W + $export$4.F * !USE_NATIVE$1, {
	  Symbol: $Symbol
	});

	for (var es6Symbols = // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'.split(','), j = 0; es6Symbols.length > j;) {
	  wks$1(es6Symbols[j++]);
	}

	for (var wellKnownSymbols = $keys$1(wks$1.store), k = 0; wellKnownSymbols.length > k;) {
	  wksDefine(wellKnownSymbols[k++]);
	}

	$export$4($export$4.S + $export$4.F * !USE_NATIVE$1, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function _for(key) {
	    return has$2(SymbolRegistry, key += '') ? SymbolRegistry[key] : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(sym) {
	    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');

	    for (var key in SymbolRegistry) {
	      if (SymbolRegistry[key] === sym) return key;
	    }
	  },
	  useSetter: function useSetter() {
	    setter = true;
	  },
	  useSimple: function useSimple() {
	    setter = false;
	  }
	});
	$export$4($export$4.S + $export$4.F * !USE_NATIVE$1, 'Object', {
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
	}); // 24.3.2 JSON.stringify(value [, replacer [, space]])

	$JSON && $export$4($export$4.S + $export$4.F * (!USE_NATIVE$1 || $fails(function () {
	  var S = $Symbol(); // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols

	  return _stringify([S]) != '[null]' || _stringify({
	    a: S
	  }) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it) {
	    var args = [it];
	    var i = 1;
	    var replacer, $replacer;

	    while (arguments.length > i) {
	      args.push(arguments[i++]);
	    }

	    $replacer = replacer = args[1];
	    if (!isObject$2(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined

	    if (!isArray(replacer)) replacer = function replacer(key, value) {
	      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
	      if (!isSymbol(value)) return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	}); // 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)

	$Symbol[PROTOTYPE$2][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE$2], TO_PRIMITIVE, $Symbol[PROTOTYPE$2].valueOf); // 19.4.3.5 Symbol.prototype[@@toStringTag]

	setToStringTag$1($Symbol, 'Symbol'); // 20.2.1.9 Math[@@toStringTag]

	setToStringTag$1(Math, 'Math', true); // 24.3.3 JSON[@@toStringTag]

	setToStringTag$1(global$3.JSON, 'JSON', true);

	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	!function (global) {

	  var Op = Object.prototype;
	  var hasOwn = Op.hasOwnProperty;
	  var undefined$1; // More compressible than void 0.

	  var $Symbol = typeof Symbol === "function" ? Symbol : {};
	  var iteratorSymbol = $Symbol.iterator || "@@iterator";
	  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
	  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
	  var inModule = (typeof module === "undefined" ? "undefined" : _typeof(module)) === "object";
	  var runtime = global.regeneratorRuntime;

	  if (runtime) {
	    if (inModule) {
	      // If regeneratorRuntime is defined globally and we're in a module,
	      // make the exports object identical to regeneratorRuntime.
	      module.exports = runtime;
	    } // Don't bother evaluating the rest of this file if the runtime was
	    // already defined globally.


	    return;
	  } // Define the runtime globally (as expected by generated code) as either
	  // module.exports (if we're in a module) or a new, empty object.


	  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

	  function wrap(innerFn, outerFn, self, tryLocsList) {
	    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
	    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
	    var generator = Object.create(protoGenerator.prototype);
	    var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
	    // .throw, and .return methods.

	    generator._invoke = makeInvokeMethod(innerFn, self, context);
	    return generator;
	  }

	  runtime.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
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
	      return {
	        type: "normal",
	        arg: fn.call(obj, arg)
	      };
	    } catch (err) {
	      return {
	        type: "throw",
	        arg: err
	      };
	    }
	  }

	  var GenStateSuspendedStart = "suspendedStart";
	  var GenStateSuspendedYield = "suspendedYield";
	  var GenStateExecuting = "executing";
	  var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
	  // breaking out of the dispatch switch statement.

	  var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
	  // .constructor.prototype properties for functions that return Generator
	  // objects. For full spec compliance, you may wish to configure your
	  // minifier not to mangle the names of these two functions.

	  function Generator() {}

	  function GeneratorFunction() {}

	  function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
	  // don't natively support it.


	  var IteratorPrototype = {};

	  IteratorPrototype[iteratorSymbol] = function () {
	    return this;
	  };

	  var getProto = Object.getPrototypeOf;
	  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

	  if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
	    // This environment has a native %IteratorPrototype%; use it instead
	    // of the polyfill.
	    IteratorPrototype = NativeIteratorPrototype;
	  }

	  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
	  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
	  GeneratorFunctionPrototype.constructor = GeneratorFunction;
	  GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction"; // Helper for defining the .next, .throw, and .return methods of the
	  // Iterator interface in terms of a single ._invoke method.

	  function defineIteratorMethods(prototype) {
	    ["next", "throw", "return"].forEach(function (method) {
	      prototype[method] = function (arg) {
	        return this._invoke(method, arg);
	      };
	    });
	  }

	  runtime.isGeneratorFunction = function (genFun) {
	    var ctor = typeof genFun === "function" && genFun.constructor;
	    return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
	    // do is to check its .name property.
	    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
	  };

	  runtime.mark = function (genFun) {
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
	  }; // Within the body of any async function, `await x` is transformed to
	  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
	  // `hasOwn.call(value, "__await")` to determine if the yielded value is
	  // meant to be awaited.


	  runtime.awrap = function (arg) {
	    return {
	      __await: arg
	    };
	  };

	  function AsyncIterator(generator) {
	    function invoke(method, arg, resolve, reject) {
	      var record = tryCatch(generator[method], generator, arg);

	      if (record.type === "throw") {
	        reject(record.arg);
	      } else {
	        var result = record.arg;
	        var value = result.value;

	        if (value && _typeof(value) === "object" && hasOwn.call(value, "__await")) {
	          return Promise.resolve(value.__await).then(function (value) {
	            invoke("next", value, resolve, reject);
	          }, function (err) {
	            invoke("throw", err, resolve, reject);
	          });
	        }

	        return Promise.resolve(value).then(function (unwrapped) {
	          // When a yielded Promise is resolved, its final value becomes
	          // the .value of the Promise<{value,done}> result for the
	          // current iteration.
	          result.value = unwrapped;
	          resolve(result);
	        }, function (error) {
	          // If a rejected Promise was yielded, throw the rejection back
	          // into the async generator function so it can be handled there.
	          return invoke("throw", error, resolve, reject);
	        });
	      }
	    }

	    var previousPromise;

	    function enqueue(method, arg) {
	      function callInvokeWithMethodAndArg() {
	        return new Promise(function (resolve, reject) {
	          invoke(method, arg, resolve, reject);
	        });
	      }

	      return previousPromise = // If enqueue has been called before, then we want to wait until
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
	      previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
	      // invocations of the iterator.
	      callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
	    } // Define the unified helper method that is used to implement .next,
	    // .throw, and .return (see defineIteratorMethods).


	    this._invoke = enqueue;
	  }

	  defineIteratorMethods(AsyncIterator.prototype);

	  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
	    return this;
	  };

	  runtime.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
	  // AsyncIterator objects; they just return a Promise for the value of
	  // the final result produced by the iterator.

	  runtime.async = function (innerFn, outerFn, self, tryLocsList) {
	    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));
	    return runtime.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
	    : iter.next().then(function (result) {
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
	        } // Be forgiving, per 25.3.3.3.3 of the spec:
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
	          state = context.done ? GenStateCompleted : GenStateSuspendedYield;

	          if (record.arg === ContinueSentinel) {
	            continue;
	          }

	          return {
	            value: record.arg,
	            done: context.done
	          };
	        } else if (record.type === "throw") {
	          state = GenStateCompleted; // Dispatch the exception by looping back around to the
	          // context.dispatchException(context.arg) call above.

	          context.method = "throw";
	          context.arg = record.arg;
	        }
	      }
	    };
	  } // Call delegate.iterator[context.method](context.arg) and handle the
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
	        context.arg = new TypeError("The iterator does not provide a 'throw' method");
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

	    if (!info) {
	      context.method = "throw";
	      context.arg = new TypeError("iterator result is not an object");
	      context.delegate = null;
	      return ContinueSentinel;
	    }

	    if (info.done) {
	      // Assign the result of the finished delegate to the temporary
	      // variable specified by delegate.resultName (see delegateYield).
	      context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

	      context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
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
	    } // The delegate iterator is finished, so forget it and continue with
	    // the outer generator.


	    context.delegate = null;
	    return ContinueSentinel;
	  } // Define Generator.prototype.{next,throw,return} in terms of the
	  // unified ._invoke helper method.


	  defineIteratorMethods(Gp);
	  Gp[toStringTagSymbol] = "Generator"; // A Generator should always return itself as the iterator object when the
	  // @@iterator function is called on it. Some browsers' implementations of the
	  // iterator prototype chain incorrectly implement this, causing the Generator
	  // object to not be returned from this call. This ensures that doesn't happen.
	  // See https://github.com/facebook/regenerator/issues/274 for more details.

	  Gp[iteratorSymbol] = function () {
	    return this;
	  };

	  Gp.toString = function () {
	    return "[object Generator]";
	  };

	  function pushTryEntry(locs) {
	    var entry = {
	      tryLoc: locs[0]
	    };

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
	    this.tryEntries = [{
	      tryLoc: "root"
	    }];
	    tryLocsList.forEach(pushTryEntry, this);
	    this.reset(true);
	  }

	  runtime.keys = function (object) {
	    var keys = [];

	    for (var key in object) {
	      keys.push(key);
	    }

	    keys.reverse(); // Rather than returning an object with a next method, we keep
	    // things simple and return the next function itself.

	    return function next() {
	      while (keys.length) {
	        var key = keys.pop();

	        if (key in object) {
	          next.value = key;
	          next.done = false;
	          return next;
	        }
	      } // To avoid creating an additional object, we just hang the .value
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
	        var i = -1,
	            next = function next() {
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
	    } // Return an iterator with no values.


	    return {
	      next: doneResult
	    };
	  }

	  runtime.values = values;

	  function doneResult() {
	    return {
	      value: undefined$1,
	      done: true
	    };
	  }

	  Context.prototype = {
	    constructor: Context,
	    reset: function reset(skipTempReset) {
	      this.prev = 0;
	      this.next = 0; // Resetting context._sent for legacy support of Babel's
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
	          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
	            this[name] = undefined$1;
	          }
	        }
	      }
	    },
	    stop: function stop() {
	      this.done = true;
	      var rootEntry = this.tryEntries[0];
	      var rootRecord = rootEntry.completion;

	      if (rootRecord.type === "throw") {
	        throw rootRecord.arg;
	      }

	      return this.rval;
	    },
	    dispatchException: function dispatchException(exception) {
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

	        return !!caught;
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
	    abrupt: function abrupt(type, arg) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];

	        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
	          var finallyEntry = entry;
	          break;
	        }
	      }

	      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
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
	    complete: function complete(record, afterLoc) {
	      if (record.type === "throw") {
	        throw record.arg;
	      }

	      if (record.type === "break" || record.type === "continue") {
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
	    finish: function finish(finallyLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];

	        if (entry.finallyLoc === finallyLoc) {
	          this.complete(entry.completion, entry.afterLoc);
	          resetTryEntry(entry);
	          return ContinueSentinel;
	        }
	      }
	    },
	    "catch": function _catch(tryLoc) {
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
	      } // The context.catch method must only be called with a location
	      // argument that corresponds to a known catch block.


	      throw new Error("illegal catch attempt");
	    },
	    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
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
	}( // In sloppy mode, unbound `this` refers to the global object, fallback to
	// Function constructor if we're in global strict mode. That is sadly a form
	// of indirect eval which violates Content Security Policy.
	function () {
	  return this || (typeof self === "undefined" ? "undefined" : _typeof(self)) === "object" && self;
	}() || Function("return this")());

	var _arrayFill = function fill(value
	/* , start = 0, end = @length */
	) {
	  var O = _toObject(this);
	  var length = _toLength(O.length);
	  var aLen = arguments.length;
	  var index = _toAbsoluteIndex(aLen > 1 ? arguments[1] : undefined, length);
	  var end = aLen > 2 ? arguments[2] : undefined;
	  var endPos = end === undefined ? length : _toAbsoluteIndex(end, length);

	  while (endPos > index) {
	    O[index++] = value;
	  }

	  return O;
	};

	// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)


	_export(_export.P, 'Array', {
	  fill: _arrayFill
	});

	_addToUnscopables('fill');

	var at = _stringAt(true); // `AdvanceStringIndex` abstract operation
	// https://tc39.github.io/ecma262/#sec-advancestringindex


	var _advanceStringIndex = function (S, index, unicode) {
	  return index + (unicode ? at(S, index).length : 1);
	};

	var classof$1 = require('./_classof');

	var builtinExec = RegExp.prototype.exec; // `RegExpExec` abstract operation
	// https://tc39.github.io/ecma262/#sec-regexpexec

	module.exports = function (R, S) {
	  var exec = R.exec;

	  if (typeof exec === 'function') {
	    var result = exec.call(R, S);

	    if (_typeof(result) !== 'object') {
	      throw new TypeError('RegExp exec method returned something other than an Object or null');
	    }

	    return result;
	  }

	  if (classof$1(R) !== 'RegExp') {
	    throw new TypeError('RegExp#exec called on incompatible receiver');
	  }

	  return builtinExec.call(R, S);
	};

	var _regexpExecAbstract = /*#__PURE__*/Object.freeze({

	});

	require('./es6.regexp.exec');

	var redefine$3 = require('./_redefine');

	var hide$4 = require('./_hide');

	var fails$2 = require('./_fails');

	var defined = require('./_defined');

	var wks$2 = require('./_wks');

	var regexpExec$1 = require('./_regexp-exec');

	var SPECIES$2 = wks$2('species');
	var REPLACE_SUPPORTS_NAMED_GROUPS = !fails$2(function () {
	  // #replace needs built-in support for named groups.
	  // #match works fine because it just return the exec results, even if it has
	  // a "grops" property.
	  var re = /./;

	  re.exec = function () {
	    var result = [];
	    result.groups = {
	      a: '7'
	    };
	    return result;
	  };

	  return ''.replace(re, '$<a>') !== '7';
	});

	var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = function () {
	  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
	  var re = /(?:)/;
	  var originalExec = re.exec;

	  re.exec = function () {
	    return originalExec.apply(this, arguments);
	  };

	  var result = 'ab'.split(re);
	  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
	}();

	module.exports = function (KEY, length, exec) {
	  var SYMBOL = wks$2(KEY);
	  var DELEGATES_TO_SYMBOL = !fails$2(function () {
	    // String methods call symbol-named RegEp methods
	    var O = {};

	    O[SYMBOL] = function () {
	      return 7;
	    };

	    return ''[KEY](O) != 7;
	  });
	  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !fails$2(function () {
	    // Symbol-named RegExp methods call .exec
	    var execCalled = false;
	    var re = /a/;

	    re.exec = function () {
	      execCalled = true;
	      return null;
	    };

	    if (KEY === 'split') {
	      // RegExp[@@split] doesn't call the regex's exec method, but first creates
	      // a new one. We need to return the patched regex when creating the new one.
	      re.constructor = {};

	      re.constructor[SPECIES$2] = function () {
	        return re;
	      };
	    }

	    re[SYMBOL]('');
	    return !execCalled;
	  }) : undefined;

	  if (!DELEGATES_TO_SYMBOL || !DELEGATES_TO_EXEC || KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS || KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC) {
	    var nativeRegExpMethod = /./[SYMBOL];
	    var fns = exec(defined, SYMBOL, ''[KEY], function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
	      if (regexp.exec === regexpExec$1) {
	        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
	          // The native String method already delegates to @@method (this
	          // polyfilled function), leasing to infinite recursion.
	          // We avoid it by directly calling the native @@method method.
	          return {
	            done: true,
	            value: nativeRegExpMethod.call(regexp, str, arg2)
	          };
	        }

	        return {
	          done: true,
	          value: nativeMethod.call(str, regexp, arg2)
	        };
	      }

	      return {
	        done: false
	      };
	    });
	    var strfn = fns[0];
	    var rxfn = fns[1];
	    redefine$3(String.prototype, KEY, strfn);
	    hide$4(RegExp.prototype, SYMBOL, length == 2 // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
	    // 21.2.5.11 RegExp.prototype[@@split](string, limit)
	    ? function (string, arg) {
	      return rxfn.call(string, this, arg);
	    } // 21.2.5.6 RegExp.prototype[@@match](string)
	    // 21.2.5.9 RegExp.prototype[@@search](string)
	    : function (string) {
	      return rxfn.call(string, this);
	    });
	  }
	};

	var _fixReWks = /*#__PURE__*/Object.freeze({

	});

	var max$1 = Math.max;
	var min$2 = Math.min;
	var floor$1 = Math.floor;
	var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
	var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;

	var maybeToString = function maybeToString(it) {
	  return it === undefined ? it : String(it);
	}; // @@replace logic


	_fixReWks('replace', 2, function (defined, REPLACE, $replace, maybeCallNative) {
	  return [// `String.prototype.replace` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.replace
	  function replace(searchValue, replaceValue) {
	    var O = defined(this);
	    var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
	    return fn !== undefined ? fn.call(searchValue, O, replaceValue) : $replace.call(String(O), searchValue, replaceValue);
	  }, // `RegExp.prototype[@@replace]` method
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
	      var captures = []; // NOTE: This is equivalent to
	      //   captures = result.slice(1).map(maybeToString)
	      // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
	      // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
	      // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.

	      for (var j = 1; j < result.length; j++) {
	        captures.push(maybeToString(result[j]));
	      }

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
	  }]; // https://tc39.github.io/ecma262/#sec-getsubstitution

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
	        case '$':
	          return '$';

	        case '&':
	          return matched;

	        case '`':
	          return str.slice(0, position);

	        case "'":
	          return str.slice(tailPos);

	        case '<':
	          capture = namedCaptures[ch.slice(1, -1)];
	          break;

	        default:
	          // \d\d?
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

	var getKeys = require('./_object-keys');

	var gOPS = require('./_object-gops');

	var pIE = require('./_object-pie');

	var toObject$2 = require('./_to-object');

	var IObject = require('./_iobject');

	var $assign = Object.assign; // should work with symbols and should have deterministic property order (V8 bug)

	module.exports = !$assign || require('./_fails')(function () {
	  var A = {};
	  var B = {}; // eslint-disable-next-line no-undef

	  var S = Symbol();
	  var K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function (k) {
	    B[k] = k;
	  });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source) {
	  // eslint-disable-line no-unused-vars
	  var T = toObject$2(target);
	  var aLen = arguments.length;
	  var index = 1;
	  var getSymbols = gOPS.f;
	  var isEnum = pIE.f;

	  while (aLen > index) {
	    var S = IObject(arguments[index++]);
	    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
	    var length = keys.length;
	    var j = 0;
	    var key;

	    while (length > j) {
	      if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
	    }
	  }

	  return T;
	} : $assign;

	var _objectAssign = /*#__PURE__*/Object.freeze({

	});

	// 19.1.3.1 Object.assign(target, source)


	_export(_export.S + _export.F, 'Object', {
	  assign: _objectAssign
	});

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

	var ObjectProto$1 = function () {
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

	// all object keys, includes non-enumerable and symbols
	var gOPN$3 = require('./_object-gopn');

	var gOPS$1 = require('./_object-gops');

	var anObject$4 = require('./_an-object');

	var Reflect$1 = require('./_global').Reflect;

	module.exports = Reflect$1 && Reflect$1.ownKeys || function ownKeys(it) {
	  var keys = gOPN$3.f(anObject$4(it));
	  var getSymbols = gOPS$1.f;
	  return getSymbols ? keys.concat(getSymbols(it)) : keys;
	};

	var _ownKeys = /*#__PURE__*/Object.freeze({

	});

	// 26.1.11 Reflect.ownKeys(target)


	_export(_export.S, 'Reflect', {
	  ownKeys: _ownKeys
	});

	var domain; // This constructor is used to store event handlers. Instantiating this is
	// faster than explicitly calling `Object.create(null)` to get a "clean" empty
	// object (tested with v8 v4.9).

	function EventHandlers() {}

	EventHandlers.prototype = Object.create(null);

	function EventEmitter() {
	  EventEmitter.init.call(this);
	}
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
	                return _context8.abrupt("return", isEqual(this.serialized, other.serialized));

	              case 3:
	              case "end":
	                return _context8.stop();
	            }
	          }
	        }, _callee8, this);
	      }));

	      function isEqual$1(_x9) {
	        return _isEqual2.apply(this, arguments);
	      }

	      return isEqual$1;
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
	            _i,
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
	                _i = 0;

	              case 21:
	                if (!(_i < signedPreKeyAmount)) {
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
	                _i++;
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
	        var preKeys, signedPreKeys, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, key, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _key;

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

	                _key = _step2.value;
	                _context13.t3 = signedPreKeys;
	                _context13.next = 41;
	                return Curve.ecKeyPairToJson(_key);

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
	        var _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, key, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _key2;

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

	                _key2 = _step4.value;
	                _context14.t3 = this.signedPreKeys;
	                _context14.next = 48;
	                return Curve.ecKeyPairFromJson(_key2);

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
	}(ObjectProto$1);

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
	                return _context29.abrupt("return", isEqual(signature, this.signature));

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
	  regeneratorRuntime.mark(function _callee58(IKa, EKa, IKb, SPKb, OPKb) {
	    var DH1, DH2, DH3, DH4, _F, i, F, KM, keys;

	    return regeneratorRuntime.wrap(function _callee58$(_context58) {
	      while (1) {
	        switch (_context58.prev = _context58.next) {
	          case 0:
	            _context58.next = 2;
	            return Curve.deriveBytes(IKa.exchangeKey.privateKey, SPKb);

	          case 2:
	            DH1 = _context58.sent;
	            _context58.next = 5;
	            return Curve.deriveBytes(EKa.privateKey, IKb);

	          case 5:
	            DH2 = _context58.sent;
	            _context58.next = 8;
	            return Curve.deriveBytes(EKa.privateKey, SPKb);

	          case 8:
	            DH3 = _context58.sent;
	            DH4 = new ArrayBuffer(0);

	            if (!OPKb) {
	              _context58.next = 14;
	              break;
	            }

	            _context58.next = 13;
	            return Curve.deriveBytes(EKa.privateKey, OPKb);

	          case 13:
	            DH4 = _context58.sent;

	          case 14:
	            _F = new Uint8Array(32);

	            for (i = 0; i < _F.length; i++) {
	              _F[i] = 0xff;
	            }

	            F = _F.buffer;
	            KM = combine(F, DH1, DH2, DH3, DH4);
	            _context58.next = 20;
	            return Secret.HKDF(KM, 1, void 0, INFO_TEXT);

	          case 20:
	            keys = _context58.sent;
	            _context58.next = 23;
	            return Secret.importHMAC(keys[0]);

	          case 23:
	            return _context58.abrupt("return", _context58.sent);

	          case 24:
	          case "end":
	            return _context58.stop();
	        }
	      }
	    }, _callee58, this);
	  }));
	  return _authenticateA.apply(this, arguments);
	}

	function authenticateB(_x45, _x46, _x47, _x48, _x49) {
	  return _authenticateB.apply(this, arguments);
	}

	function _authenticateB() {
	  _authenticateB = _asyncToGenerator(
	  /*#__PURE__*/
	  regeneratorRuntime.mark(function _callee59(IKb, SPKb, IKa, EKa, OPKb) {
	    var DH1, DH2, DH3, DH4, _F, i, F, KM, keys;

	    return regeneratorRuntime.wrap(function _callee59$(_context59) {
	      while (1) {
	        switch (_context59.prev = _context59.next) {
	          case 0:
	            _context59.next = 2;
	            return Curve.deriveBytes(SPKb.privateKey, IKa);

	          case 2:
	            DH1 = _context59.sent;
	            _context59.next = 5;
	            return Curve.deriveBytes(IKb.exchangeKey.privateKey, EKa);

	          case 5:
	            DH2 = _context59.sent;
	            _context59.next = 8;
	            return Curve.deriveBytes(SPKb.privateKey, EKa);

	          case 8:
	            DH3 = _context59.sent;
	            DH4 = new ArrayBuffer(0);

	            if (!OPKb) {
	              _context59.next = 14;
	              break;
	            }

	            _context59.next = 13;
	            return Curve.deriveBytes(OPKb, EKa);

	          case 13:
	            DH4 = _context59.sent;

	          case 14:
	            _F = new Uint8Array(32);

	            for (i = 0; i < _F.length; i++) {
	              _F[i] = 0xff;
	            }

	            F = _F.buffer;
	            KM = combine(F, DH1, DH2, DH3, DH4);
	            _context59.next = 20;
	            return Secret.HKDF(KM, 1, void 0, INFO_TEXT);

	          case 20:
	            keys = _context59.sent;
	            _context59.next = 23;
	            return Secret.importHMAC(keys[0]);

	          case 23:
	            return _context59.abrupt("return", _context59.sent);

	          case 24:
	          case "end":
	            return _context59.stop();
	        }
	      }
	    }, _callee59, this);
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

	var CryptoError =
	/*#__PURE__*/
	function (_Error) {
	  _inherits(CryptoError, _Error);

	  function CryptoError() {
	    _classCallCheck(this, CryptoError);

	    return _possibleConstructorReturn(this, _getPrototypeOf(CryptoError).apply(this, arguments));
	  }

	  return CryptoError;
	}(_wrapNativeSuper(Error));

	var AlgorithmError =
	/*#__PURE__*/
	function (_CryptoError) {
	  _inherits(AlgorithmError, _CryptoError);

	  function AlgorithmError() {
	    _classCallCheck(this, AlgorithmError);

	    return _possibleConstructorReturn(this, _getPrototypeOf(AlgorithmError).apply(this, arguments));
	  }

	  return AlgorithmError;
	}(CryptoError);

	var UnsupportedOperationError =
	/*#__PURE__*/
	function (_CryptoError2) {
	  _inherits(UnsupportedOperationError, _CryptoError2);

	  function UnsupportedOperationError(methodName) {
	    _classCallCheck(this, UnsupportedOperationError);

	    return _possibleConstructorReturn(this, _getPrototypeOf(UnsupportedOperationError).call(this, "Unsupported operation: ".concat(methodName ? "".concat(methodName) : "")));
	  }

	  return UnsupportedOperationError;
	}(CryptoError);

	var OperationError =
	/*#__PURE__*/
	function (_CryptoError3) {
	  _inherits(OperationError, _CryptoError3);

	  function OperationError() {
	    _classCallCheck(this, OperationError);

	    return _possibleConstructorReturn(this, _getPrototypeOf(OperationError).apply(this, arguments));
	  }

	  return OperationError;
	}(CryptoError);

	var RequiredPropertyError =
	/*#__PURE__*/
	function (_CryptoError4) {
	  _inherits(RequiredPropertyError, _CryptoError4);

	  function RequiredPropertyError(propName) {
	    _classCallCheck(this, RequiredPropertyError);

	    return _possibleConstructorReturn(this, _getPrototypeOf(RequiredPropertyError).call(this, "".concat(propName, ": Missing required property")));
	  }

	  return RequiredPropertyError;
	}(CryptoError);

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

	var ProviderCrypto =
	/*#__PURE__*/
	function () {
	  function ProviderCrypto() {
	    _classCallCheck(this, ProviderCrypto);
	  }

	  _createClass(ProviderCrypto, [{
	    key: "digest",
	    value: function () {
	      var _digest = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee(algorithm, data) {
	        var _args = arguments;
	        return regeneratorRuntime.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                this.checkDigest.apply(this, _args);
	                return _context.abrupt("return", this.onDigest.apply(this, _args));

	              case 2:
	              case "end":
	                return _context.stop();
	            }
	          }
	        }, _callee, this);
	      }));

	      function digest(_x, _x2) {
	        return _digest.apply(this, arguments);
	      }

	      return digest;
	    }()
	  }, {
	    key: "checkDigest",
	    value: function checkDigest(algorithm, data) {
	      this.checkAlgorithmName(algorithm);
	    }
	  }, {
	    key: "onDigest",
	    value: function () {
	      var _onDigest = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee2(algorithm, data) {
	        return regeneratorRuntime.wrap(function _callee2$(_context2) {
	          while (1) {
	            switch (_context2.prev = _context2.next) {
	              case 0:
	                throw new UnsupportedOperationError("digest");

	              case 1:
	              case "end":
	                return _context2.stop();
	            }
	          }
	        }, _callee2, this);
	      }));

	      function onDigest(_x3, _x4) {
	        return _onDigest.apply(this, arguments);
	      }

	      return onDigest;
	    }()
	  }, {
	    key: "generateKey",
	    value: function () {
	      var _generateKey = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee3(algorithm, extractable, keyUsages) {
	        var _args3 = arguments;
	        return regeneratorRuntime.wrap(function _callee3$(_context3) {
	          while (1) {
	            switch (_context3.prev = _context3.next) {
	              case 0:
	                this.checkGenerateKey.apply(this, _args3);
	                return _context3.abrupt("return", this.onGenerateKey.apply(this, _args3));

	              case 2:
	              case "end":
	                return _context3.stop();
	            }
	          }
	        }, _callee3, this);
	      }));

	      function generateKey(_x5, _x6, _x7) {
	        return _generateKey.apply(this, arguments);
	      }

	      return generateKey;
	    }()
	  }, {
	    key: "checkGenerateKey",
	    value: function checkGenerateKey(algorithm, extractable, keyUsages) {
	      this.checkAlgorithmName(algorithm);
	      this.checkGenerateKeyParams(algorithm);

	      if (!(keyUsages && keyUsages.length)) {
	        throw new TypeError("Usages cannot be empty when creating a key.");
	      }

	      var allowedUsages;

	      if (Array.isArray(this.usages)) {
	        allowedUsages = this.usages;
	      } else {
	        allowedUsages = this.usages.privateKey.concat(this.usages.publicKey);
	      }

	      this.checkKeyUsages(keyUsages, allowedUsages);
	    }
	  }, {
	    key: "checkGenerateKeyParams",
	    value: function checkGenerateKeyParams(algorithm) {}
	  }, {
	    key: "onGenerateKey",
	    value: function () {
	      var _onGenerateKey = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee4(algorithm, extractable, keyUsages) {
	        return regeneratorRuntime.wrap(function _callee4$(_context4) {
	          while (1) {
	            switch (_context4.prev = _context4.next) {
	              case 0:
	                throw new UnsupportedOperationError("generateKey");

	              case 1:
	              case "end":
	                return _context4.stop();
	            }
	          }
	        }, _callee4, this);
	      }));

	      function onGenerateKey(_x8, _x9, _x10) {
	        return _onGenerateKey.apply(this, arguments);
	      }

	      return onGenerateKey;
	    }()
	  }, {
	    key: "sign",
	    value: function () {
	      var _sign = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee5(algorithm, key, data) {
	        var _args5 = arguments;
	        return regeneratorRuntime.wrap(function _callee5$(_context5) {
	          while (1) {
	            switch (_context5.prev = _context5.next) {
	              case 0:
	                this.checkSign.apply(this, _args5);
	                return _context5.abrupt("return", this.onSign.apply(this, _args5));

	              case 2:
	              case "end":
	                return _context5.stop();
	            }
	          }
	        }, _callee5, this);
	      }));

	      function sign(_x11, _x12, _x13) {
	        return _sign.apply(this, arguments);
	      }

	      return sign;
	    }()
	  }, {
	    key: "checkSign",
	    value: function checkSign(algorithm, key, data) {
	      this.checkAlgorithmName(algorithm);
	      this.checkAlgorithmParams(algorithm);
	      this.checkCryptoKey(key, "sign");
	    }
	  }, {
	    key: "onSign",
	    value: function () {
	      var _onSign = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee6(algorithm, key, data) {
	        return regeneratorRuntime.wrap(function _callee6$(_context6) {
	          while (1) {
	            switch (_context6.prev = _context6.next) {
	              case 0:
	                throw new UnsupportedOperationError("sign");

	              case 1:
	              case "end":
	                return _context6.stop();
	            }
	          }
	        }, _callee6, this);
	      }));

	      function onSign(_x14, _x15, _x16) {
	        return _onSign.apply(this, arguments);
	      }

	      return onSign;
	    }()
	  }, {
	    key: "verify",
	    value: function () {
	      var _verify = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee7(algorithm, key, signature, data) {
	        var _args7 = arguments;
	        return regeneratorRuntime.wrap(function _callee7$(_context7) {
	          while (1) {
	            switch (_context7.prev = _context7.next) {
	              case 0:
	                this.checkVerify.apply(this, _args7);
	                return _context7.abrupt("return", this.onVerify.apply(this, _args7));

	              case 2:
	              case "end":
	                return _context7.stop();
	            }
	          }
	        }, _callee7, this);
	      }));

	      function verify(_x17, _x18, _x19, _x20) {
	        return _verify.apply(this, arguments);
	      }

	      return verify;
	    }()
	  }, {
	    key: "checkVerify",
	    value: function checkVerify(algorithm, key, signature, data) {
	      this.checkAlgorithmName(algorithm);
	      this.checkAlgorithmParams(algorithm);
	      this.checkCryptoKey(key, "verify");
	    }
	  }, {
	    key: "onVerify",
	    value: function () {
	      var _onVerify = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee8(algorithm, key, signature, data) {
	        return regeneratorRuntime.wrap(function _callee8$(_context8) {
	          while (1) {
	            switch (_context8.prev = _context8.next) {
	              case 0:
	                throw new UnsupportedOperationError("verify");

	              case 1:
	              case "end":
	                return _context8.stop();
	            }
	          }
	        }, _callee8, this);
	      }));

	      function onVerify(_x21, _x22, _x23, _x24) {
	        return _onVerify.apply(this, arguments);
	      }

	      return onVerify;
	    }()
	  }, {
	    key: "encrypt",
	    value: function () {
	      var _encrypt = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee9(algorithm, key, data, options) {
	        var _args9 = arguments;
	        return regeneratorRuntime.wrap(function _callee9$(_context9) {
	          while (1) {
	            switch (_context9.prev = _context9.next) {
	              case 0:
	                this.checkEncrypt.apply(this, _args9);
	                return _context9.abrupt("return", this.onEncrypt.apply(this, _args9));

	              case 2:
	              case "end":
	                return _context9.stop();
	            }
	          }
	        }, _callee9, this);
	      }));

	      function encrypt(_x25, _x26, _x27, _x28) {
	        return _encrypt.apply(this, arguments);
	      }

	      return encrypt;
	    }()
	  }, {
	    key: "checkEncrypt",
	    value: function checkEncrypt(algorithm, key, data) {
	      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
	      this.checkAlgorithmName(algorithm);
	      this.checkAlgorithmParams(algorithm);
	      this.checkCryptoKey(key, options.keyUsage ? "encrypt" : void 0);
	    }
	  }, {
	    key: "onEncrypt",
	    value: function () {
	      var _onEncrypt = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee10(algorithm, key, data) {
	        return regeneratorRuntime.wrap(function _callee10$(_context10) {
	          while (1) {
	            switch (_context10.prev = _context10.next) {
	              case 0:
	                throw new UnsupportedOperationError("encrypt");

	              case 1:
	              case "end":
	                return _context10.stop();
	            }
	          }
	        }, _callee10, this);
	      }));

	      function onEncrypt(_x29, _x30, _x31) {
	        return _onEncrypt.apply(this, arguments);
	      }

	      return onEncrypt;
	    }()
	  }, {
	    key: "decrypt",
	    value: function () {
	      var _decrypt = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee11(algorithm, key, data, options) {
	        var _args11 = arguments;
	        return regeneratorRuntime.wrap(function _callee11$(_context11) {
	          while (1) {
	            switch (_context11.prev = _context11.next) {
	              case 0:
	                this.checkDecrypt.apply(this, _args11);
	                return _context11.abrupt("return", this.onDecrypt.apply(this, _args11));

	              case 2:
	              case "end":
	                return _context11.stop();
	            }
	          }
	        }, _callee11, this);
	      }));

	      function decrypt(_x32, _x33, _x34, _x35) {
	        return _decrypt.apply(this, arguments);
	      }

	      return decrypt;
	    }()
	  }, {
	    key: "checkDecrypt",
	    value: function checkDecrypt(algorithm, key, data) {
	      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
	      this.checkAlgorithmName(algorithm);
	      this.checkAlgorithmParams(algorithm);
	      this.checkCryptoKey(key, options.keyUsage ? "decrypt" : void 0);
	    }
	  }, {
	    key: "onDecrypt",
	    value: function () {
	      var _onDecrypt = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee12(algorithm, key, data) {
	        return regeneratorRuntime.wrap(function _callee12$(_context12) {
	          while (1) {
	            switch (_context12.prev = _context12.next) {
	              case 0:
	                throw new UnsupportedOperationError("decrypt");

	              case 1:
	              case "end":
	                return _context12.stop();
	            }
	          }
	        }, _callee12, this);
	      }));

	      function onDecrypt(_x36, _x37, _x38) {
	        return _onDecrypt.apply(this, arguments);
	      }

	      return onDecrypt;
	    }()
	  }, {
	    key: "deriveBits",
	    value: function () {
	      var _deriveBits = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee13(algorithm, baseKey, length, options) {
	        var _args13 = arguments;
	        return regeneratorRuntime.wrap(function _callee13$(_context13) {
	          while (1) {
	            switch (_context13.prev = _context13.next) {
	              case 0:
	                this.checkDeriveBits.apply(this, _args13);
	                return _context13.abrupt("return", this.onDeriveBits.apply(this, _args13));

	              case 2:
	              case "end":
	                return _context13.stop();
	            }
	          }
	        }, _callee13, this);
	      }));

	      function deriveBits(_x39, _x40, _x41, _x42) {
	        return _deriveBits.apply(this, arguments);
	      }

	      return deriveBits;
	    }()
	  }, {
	    key: "checkDeriveBits",
	    value: function checkDeriveBits(algorithm, baseKey, length) {
	      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
	      this.checkAlgorithmName(algorithm);
	      this.checkAlgorithmParams(algorithm);
	      this.checkCryptoKey(baseKey, options.keyUsage ? "deriveBits" : void 0);

	      if (length % 8 !== 0) {
	        throw new OperationError("length: Is not multiple of 8");
	      }
	    }
	  }, {
	    key: "onDeriveBits",
	    value: function () {
	      var _onDeriveBits = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee14(algorithm, baseKey, length) {
	        return regeneratorRuntime.wrap(function _callee14$(_context14) {
	          while (1) {
	            switch (_context14.prev = _context14.next) {
	              case 0:
	                throw new UnsupportedOperationError("deriveBits");

	              case 1:
	              case "end":
	                return _context14.stop();
	            }
	          }
	        }, _callee14, this);
	      }));

	      function onDeriveBits(_x43, _x44, _x45) {
	        return _onDeriveBits.apply(this, arguments);
	      }

	      return onDeriveBits;
	    }()
	  }, {
	    key: "exportKey",
	    value: function () {
	      var _exportKey = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee15(format, key) {
	        var _args15 = arguments;
	        return regeneratorRuntime.wrap(function _callee15$(_context15) {
	          while (1) {
	            switch (_context15.prev = _context15.next) {
	              case 0:
	                this.checkExportKey.apply(this, _args15);
	                return _context15.abrupt("return", this.onExportKey.apply(this, _args15));

	              case 2:
	              case "end":
	                return _context15.stop();
	            }
	          }
	        }, _callee15, this);
	      }));

	      function exportKey(_x46, _x47) {
	        return _exportKey.apply(this, arguments);
	      }

	      return exportKey;
	    }()
	  }, {
	    key: "checkExportKey",
	    value: function checkExportKey(format, key) {
	      this.checkKeyFormat(format);
	      this.checkCryptoKey(key);

	      if (!key.extractable) {
	        throw new CryptoError("key: Is not extractable");
	      }
	    }
	  }, {
	    key: "onExportKey",
	    value: function () {
	      var _onExportKey = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee16(format, key) {
	        return regeneratorRuntime.wrap(function _callee16$(_context16) {
	          while (1) {
	            switch (_context16.prev = _context16.next) {
	              case 0:
	                throw new UnsupportedOperationError("exportKey");

	              case 1:
	              case "end":
	                return _context16.stop();
	            }
	          }
	        }, _callee16, this);
	      }));

	      function onExportKey(_x48, _x49) {
	        return _onExportKey.apply(this, arguments);
	      }

	      return onExportKey;
	    }()
	  }, {
	    key: "importKey",
	    value: function () {
	      var _importKey = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee17(format, keyData, algorithm, extractable, keyUsages) {
	        var _args17 = arguments;
	        return regeneratorRuntime.wrap(function _callee17$(_context17) {
	          while (1) {
	            switch (_context17.prev = _context17.next) {
	              case 0:
	                this.checkImportKey.apply(this, _args17);
	                return _context17.abrupt("return", this.onImportKey.apply(this, _args17));

	              case 2:
	              case "end":
	                return _context17.stop();
	            }
	          }
	        }, _callee17, this);
	      }));

	      function importKey(_x50, _x51, _x52, _x53, _x54) {
	        return _importKey.apply(this, arguments);
	      }

	      return importKey;
	    }()
	  }, {
	    key: "checkImportKey",
	    value: function checkImportKey(format, keyData, algorithm, extractable, keyUsages) {
	      this.checkKeyFormat(format);
	      this.checkAlgorithmName(algorithm);
	      this.checkImportParams(algorithm);

	      if (Array.isArray(this.usages)) {
	        this.checkKeyUsages(keyUsages, this.usages);
	      }
	    }
	  }, {
	    key: "onImportKey",
	    value: function () {
	      var _onImportKey = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee18(format, keyData, algorithm, extractable, keyUsages) {
	        return regeneratorRuntime.wrap(function _callee18$(_context18) {
	          while (1) {
	            switch (_context18.prev = _context18.next) {
	              case 0:
	                throw new UnsupportedOperationError("importKey");

	              case 1:
	              case "end":
	                return _context18.stop();
	            }
	          }
	        }, _callee18, this);
	      }));

	      function onImportKey(_x55, _x56, _x57, _x58, _x59) {
	        return _onImportKey.apply(this, arguments);
	      }

	      return onImportKey;
	    }()
	  }, {
	    key: "checkAlgorithmName",
	    value: function checkAlgorithmName(algorithm) {
	      if (algorithm.name.toLowerCase() !== this.name.toLowerCase()) {
	        throw new AlgorithmError("Unrecognized name");
	      }
	    }
	  }, {
	    key: "checkAlgorithmParams",
	    value: function checkAlgorithmParams(algorithm) {}
	  }, {
	    key: "checkDerivedKeyParams",
	    value: function checkDerivedKeyParams(algorithm) {}
	  }, {
	    key: "checkKeyUsages",
	    value: function checkKeyUsages(usages, allowed) {
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = usages[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var usage = _step.value;

	          if (allowed.indexOf(usage) === -1) {
	            throw new TypeError("Cannot create a key using the specified key usages");
	          }
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return != null) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	    }
	  }, {
	    key: "checkCryptoKey",
	    value: function checkCryptoKey(key, keyUsage) {
	      this.checkAlgorithmName(key.algorithm);

	      if (keyUsage && key.usages.indexOf(keyUsage) === -1) {
	        throw new CryptoError("key does not match that of operation");
	      }
	    }
	  }, {
	    key: "checkRequiredProperty",
	    value: function checkRequiredProperty(data, propName) {
	      if (!(propName in data)) {
	        throw new RequiredPropertyError(propName);
	      }
	    }
	  }, {
	    key: "checkHashAlgorithm",
	    value: function checkHashAlgorithm(algorithm, hashAlgorithms) {
	      var _iteratorNormalCompletion2 = true;
	      var _didIteratorError2 = false;
	      var _iteratorError2 = undefined;

	      try {
	        for (var _iterator2 = hashAlgorithms[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	          var item = _step2.value;

	          if (item.toLowerCase() === algorithm.name.toLowerCase()) {
	            return;
	          }
	        }
	      } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
	            _iterator2.return();
	          }
	        } finally {
	          if (_didIteratorError2) {
	            throw _iteratorError2;
	          }
	        }
	      }

	      throw new OperationError("hash: Must be one of ".concat(hashAlgorithms.join(", ")));
	    }
	  }, {
	    key: "checkImportParams",
	    value: function checkImportParams(algorithm) {}
	  }, {
	    key: "checkKeyFormat",
	    value: function checkKeyFormat(format) {
	      switch (format) {
	        case "raw":
	        case "pkcs8":
	        case "spki":
	        case "jwk":
	          break;

	        default:
	          throw new TypeError("format: Is invalid value. Must be 'jwk', 'raw', 'spki', or 'pkcs8'");
	      }
	    }
	  }, {
	    key: "prepareData",
	    value: function prepareData(data) {
	      return BufferSourceConverter.toArrayBuffer(data);
	    }
	  }]);

	  return ProviderCrypto;
	}();

	var AesProvider =
	/*#__PURE__*/
	function (_ProviderCrypto) {
	  _inherits(AesProvider, _ProviderCrypto);

	  function AesProvider() {
	    _classCallCheck(this, AesProvider);

	    return _possibleConstructorReturn(this, _getPrototypeOf(AesProvider).apply(this, arguments));
	  }

	  _createClass(AesProvider, [{
	    key: "checkGenerateKeyParams",
	    value: function checkGenerateKeyParams(algorithm) {
	      this.checkRequiredProperty(algorithm, "length");

	      if (typeof algorithm.length !== "number") {
	        throw new TypeError("length: Is not of type Number");
	      }

	      switch (algorithm.length) {
	        case 128:
	        case 192:
	        case 256:
	          break;

	        default:
	          throw new TypeError("length: Must be 128, 192, or 256");
	      }
	    }
	  }, {
	    key: "checkDerivedKeyParams",
	    value: function checkDerivedKeyParams(algorithm) {
	      this.checkGenerateKeyParams(algorithm);
	    }
	  }]);

	  return AesProvider;
	}(ProviderCrypto);

	var AesCbcProvider =
	/*#__PURE__*/
	function (_AesProvider) {
	  _inherits(AesCbcProvider, _AesProvider);

	  function AesCbcProvider() {
	    var _this;

	    _classCallCheck(this, AesCbcProvider);

	    _this = _possibleConstructorReturn(this, _getPrototypeOf(AesCbcProvider).apply(this, arguments));
	    _this.name = "AES-CBC";
	    _this.usages = ["encrypt", "decrypt", "wrapKey", "unwrapKey"];
	    return _this;
	  }

	  _createClass(AesCbcProvider, [{
	    key: "checkAlgorithmParams",
	    value: function checkAlgorithmParams(algorithm) {
	      this.checkRequiredProperty(algorithm, "iv");

	      if (!(algorithm.iv instanceof ArrayBuffer || ArrayBuffer.isView(algorithm.iv))) {
	        throw new TypeError("iv: Is not of type '(ArrayBuffer or ArrayBufferView)'");
	      }

	      if (algorithm.iv.byteLength !== 16) {
	        throw new TypeError("iv: Must have length 16 bytes");
	      }
	    }
	  }]);

	  return AesCbcProvider;
	}(AesProvider);

	var AesCmacProvider =
	/*#__PURE__*/
	function (_AesProvider2) {
	  _inherits(AesCmacProvider, _AesProvider2);

	  function AesCmacProvider() {
	    var _this2;

	    _classCallCheck(this, AesCmacProvider);

	    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(AesCmacProvider).apply(this, arguments));
	    _this2.name = "AES-CMAC";
	    _this2.usages = ["sign", "verify"];
	    return _this2;
	  }

	  _createClass(AesCmacProvider, [{
	    key: "checkAlgorithmParams",
	    value: function checkAlgorithmParams(algorithm) {
	      this.checkRequiredProperty(algorithm, "length");

	      if (typeof algorithm.length !== "number") {
	        throw new TypeError("length: Is not a Number");
	      }

	      if (algorithm.length < 1) {
	        throw new OperationError("length: Must be more than 0");
	      }
	    }
	  }]);

	  return AesCmacProvider;
	}(AesProvider);

	var AesCtrProvider =
	/*#__PURE__*/
	function (_AesProvider3) {
	  _inherits(AesCtrProvider, _AesProvider3);

	  function AesCtrProvider() {
	    var _this3;

	    _classCallCheck(this, AesCtrProvider);

	    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(AesCtrProvider).apply(this, arguments));
	    _this3.name = "AES-CTR";
	    _this3.usages = ["encrypt", "decrypt", "wrapKey", "unwrapKey"];
	    return _this3;
	  }

	  _createClass(AesCtrProvider, [{
	    key: "checkAlgorithmParams",
	    value: function checkAlgorithmParams(algorithm) {
	      this.checkRequiredProperty(algorithm, "counter");

	      if (!(algorithm.counter instanceof ArrayBuffer || ArrayBuffer.isView(algorithm.counter))) {
	        throw new TypeError("counter: Is not of type '(ArrayBuffer or ArrayBufferView)'");
	      }

	      if (algorithm.counter.byteLength !== 16) {
	        throw new TypeError("iv: Must have length 16 bytes");
	      }

	      this.checkRequiredProperty(algorithm, "length");

	      if (typeof algorithm.length !== "number") {
	        throw new TypeError("length: Is not a Number");
	      }

	      if (algorithm.length < 1) {
	        throw new OperationError("length: Must be more than 0");
	      }
	    }
	  }]);

	  return AesCtrProvider;
	}(AesProvider);

	var AesEcbProvider =
	/*#__PURE__*/
	function (_AesProvider4) {
	  _inherits(AesEcbProvider, _AesProvider4);

	  function AesEcbProvider() {
	    var _this4;

	    _classCallCheck(this, AesEcbProvider);

	    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(AesEcbProvider).apply(this, arguments));
	    _this4.name = "AES-ECB";
	    _this4.usages = ["encrypt", "decrypt", "wrapKey", "unwrapKey"];
	    return _this4;
	  }

	  return AesEcbProvider;
	}(AesProvider);

	var AesGcmProvider =
	/*#__PURE__*/
	function (_AesProvider5) {
	  _inherits(AesGcmProvider, _AesProvider5);

	  function AesGcmProvider() {
	    var _this5;

	    _classCallCheck(this, AesGcmProvider);

	    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(AesGcmProvider).apply(this, arguments));
	    _this5.name = "AES-GCM";
	    _this5.usages = ["encrypt", "decrypt", "wrapKey", "unwrapKey"];
	    return _this5;
	  }

	  _createClass(AesGcmProvider, [{
	    key: "checkAlgorithmParams",
	    value: function checkAlgorithmParams(algorithm) {
	      this.checkRequiredProperty(algorithm, "iv");

	      if (!(algorithm.iv instanceof ArrayBuffer || ArrayBuffer.isView(algorithm.iv))) {
	        throw new TypeError("iv: Is not of type '(ArrayBuffer or ArrayBufferView)'");
	      }

	      if (algorithm.iv.byteLength < 1) {
	        throw new OperationError("iv: Must have length more than 0 and less than 2^64 - 1");
	      }

	      if (!("tagLength" in algorithm)) {
	        algorithm.tagLength = 128;
	      }

	      switch (algorithm.tagLength) {
	        case 32:
	        case 64:
	        case 96:
	        case 104:
	        case 112:
	        case 120:
	        case 128:
	          break;

	        default:
	          throw new OperationError("tagLength: Must be one of 32, 64, 96, 104, 112, 120 or 128");
	      }
	    }
	  }]);

	  return AesGcmProvider;
	}(AesProvider);

	var AesKwProvider =
	/*#__PURE__*/
	function (_AesProvider6) {
	  _inherits(AesKwProvider, _AesProvider6);

	  function AesKwProvider() {
	    var _this6;

	    _classCallCheck(this, AesKwProvider);

	    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(AesKwProvider).apply(this, arguments));
	    _this6.name = "AES-KW";
	    _this6.usages = ["wrapKey", "unwrapKey"];
	    return _this6;
	  }

	  return AesKwProvider;
	}(AesProvider);

	var DesProvider =
	/*#__PURE__*/
	function (_ProviderCrypto2) {
	  _inherits(DesProvider, _ProviderCrypto2);

	  function DesProvider() {
	    var _this7;

	    _classCallCheck(this, DesProvider);

	    _this7 = _possibleConstructorReturn(this, _getPrototypeOf(DesProvider).apply(this, arguments));
	    _this7.usages = ["encrypt", "decrypt", "wrapKey", "unwrapKey"];
	    return _this7;
	  }

	  _createClass(DesProvider, [{
	    key: "checkAlgorithmParams",
	    value: function checkAlgorithmParams(algorithm) {
	      if (this.ivSize) {
	        this.checkRequiredProperty(algorithm, "iv");

	        if (!(algorithm.iv instanceof ArrayBuffer || ArrayBuffer.isView(algorithm.iv))) {
	          throw new TypeError("iv: Is not of type '(ArrayBuffer or ArrayBufferView)'");
	        }

	        if (algorithm.iv.byteLength !== this.ivSize) {
	          throw new TypeError("iv: Must have length ".concat(this.ivSize, " bytes"));
	        }
	      }
	    }
	  }, {
	    key: "checkGenerateKeyParams",
	    value: function checkGenerateKeyParams(algorithm) {
	      this.checkRequiredProperty(algorithm, "length");

	      if (typeof algorithm.length !== "number") {
	        throw new TypeError("length: Is not of type Number");
	      }

	      if (algorithm.length !== this.keySizeBits) {
	        throw new OperationError("algorith.length: Must be ".concat(this.keySizeBits));
	      }
	    }
	  }, {
	    key: "checkDerivedKeyParams",
	    value: function checkDerivedKeyParams(algorithm) {
	      this.checkGenerateKeyParams(algorithm);
	    }
	  }]);

	  return DesProvider;
	}(ProviderCrypto);

	var RsaProvider =
	/*#__PURE__*/
	function (_ProviderCrypto3) {
	  _inherits(RsaProvider, _ProviderCrypto3);

	  function RsaProvider() {
	    var _this8;

	    _classCallCheck(this, RsaProvider);

	    _this8 = _possibleConstructorReturn(this, _getPrototypeOf(RsaProvider).apply(this, arguments));
	    _this8.hashAlgorithms = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
	    return _this8;
	  }

	  _createClass(RsaProvider, [{
	    key: "checkGenerateKeyParams",
	    value: function checkGenerateKeyParams(algorithm) {
	      this.checkRequiredProperty(algorithm, "hash");
	      this.checkHashAlgorithm(algorithm.hash, this.hashAlgorithms);
	      this.checkRequiredProperty(algorithm, "publicExponent");

	      if (!(algorithm.publicExponent && algorithm.publicExponent instanceof Uint8Array)) {
	        throw new TypeError("publicExponent: Missing or not a Uint8Array");
	      }

	      var publicExponent = Convert.ToBase64(algorithm.publicExponent);

	      if (!(publicExponent === "Aw==" || publicExponent === "AQAB")) {
	        throw new TypeError("publicExponent: Must be [3] or [1,0,1]");
	      }

	      this.checkRequiredProperty(algorithm, "modulusLength");

	      switch (algorithm.modulusLength) {
	        case 1024:
	        case 2048:
	        case 4096:
	          break;

	        default:
	          throw new TypeError("modulusLength: Must be 1024, 2048, or 4096");
	      }
	    }
	  }, {
	    key: "checkImportParams",
	    value: function checkImportParams(algorithm) {
	      this.checkRequiredProperty(algorithm, "hash");
	      this.checkHashAlgorithm(algorithm.hash, this.hashAlgorithms);
	    }
	  }]);

	  return RsaProvider;
	}(ProviderCrypto);

	var RsaSsaProvider =
	/*#__PURE__*/
	function (_RsaProvider) {
	  _inherits(RsaSsaProvider, _RsaProvider);

	  function RsaSsaProvider() {
	    var _this9;

	    _classCallCheck(this, RsaSsaProvider);

	    _this9 = _possibleConstructorReturn(this, _getPrototypeOf(RsaSsaProvider).apply(this, arguments));
	    _this9.name = "RSASSA-PKCS1-v1_5";
	    _this9.usages = {
	      privateKey: ["sign"],
	      publicKey: ["verify"]
	    };
	    return _this9;
	  }

	  return RsaSsaProvider;
	}(RsaProvider);

	var RsaPssProvider =
	/*#__PURE__*/
	function (_RsaProvider2) {
	  _inherits(RsaPssProvider, _RsaProvider2);

	  function RsaPssProvider() {
	    var _this10;

	    _classCallCheck(this, RsaPssProvider);

	    _this10 = _possibleConstructorReturn(this, _getPrototypeOf(RsaPssProvider).apply(this, arguments));
	    _this10.name = "RSA-PSS";
	    _this10.usages = {
	      privateKey: ["sign"],
	      publicKey: ["verify"]
	    };
	    return _this10;
	  }

	  _createClass(RsaPssProvider, [{
	    key: "checkAlgorithmParams",
	    value: function checkAlgorithmParams(algorithm) {
	      this.checkRequiredProperty(algorithm, "saltLength");

	      if (typeof algorithm.saltLength !== "number") {
	        throw new TypeError("saltLength: Is not a Number");
	      }

	      if (algorithm.saltLength < 1) {
	        throw new RangeError("saltLength: Must be more than 0");
	      }
	    }
	  }]);

	  return RsaPssProvider;
	}(RsaProvider);

	var RsaOaepProvider =
	/*#__PURE__*/
	function (_RsaProvider3) {
	  _inherits(RsaOaepProvider, _RsaProvider3);

	  function RsaOaepProvider() {
	    var _this11;

	    _classCallCheck(this, RsaOaepProvider);

	    _this11 = _possibleConstructorReturn(this, _getPrototypeOf(RsaOaepProvider).apply(this, arguments));
	    _this11.name = "RSA-OAEP";
	    _this11.usages = {
	      privateKey: ["decrypt", "unwrapKey"],
	      publicKey: ["encrypt", "wrapKey"]
	    };
	    return _this11;
	  }

	  _createClass(RsaOaepProvider, [{
	    key: "checkAlgorithmParams",
	    value: function checkAlgorithmParams(algorithm) {
	      if (algorithm.label && !(algorithm.label instanceof ArrayBuffer || ArrayBuffer.isView(algorithm.label))) {
	        throw new TypeError("label: Is not of type '(ArrayBuffer or ArrayBufferView)'");
	      }
	    }
	  }]);

	  return RsaOaepProvider;
	}(RsaProvider);

	var EllipticProvider =
	/*#__PURE__*/
	function (_ProviderCrypto4) {
	  _inherits(EllipticProvider, _ProviderCrypto4);

	  function EllipticProvider() {
	    _classCallCheck(this, EllipticProvider);

	    return _possibleConstructorReturn(this, _getPrototypeOf(EllipticProvider).apply(this, arguments));
	  }

	  _createClass(EllipticProvider, [{
	    key: "checkGenerateKeyParams",
	    value: function checkGenerateKeyParams(algorithm) {
	      this.checkRequiredProperty(algorithm, "namedCurve");
	      this.checkNamedCurve(algorithm.namedCurve);
	    }
	  }, {
	    key: "checkNamedCurve",
	    value: function checkNamedCurve(namedCurve) {
	      var _iteratorNormalCompletion3 = true;
	      var _didIteratorError3 = false;
	      var _iteratorError3 = undefined;

	      try {
	        for (var _iterator3 = this.namedCurves[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	          var item = _step3.value;

	          if (item.toLowerCase() === namedCurve.toLowerCase()) {
	            return;
	          }
	        }
	      } catch (err) {
	        _didIteratorError3 = true;
	        _iteratorError3 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
	            _iterator3.return();
	          }
	        } finally {
	          if (_didIteratorError3) {
	            throw _iteratorError3;
	          }
	        }
	      }

	      throw new OperationError("namedCurve: Must be one of ".concat(this.namedCurves.join(", ")));
	    }
	  }]);

	  return EllipticProvider;
	}(ProviderCrypto);

	var EcdsaProvider =
	/*#__PURE__*/
	function (_EllipticProvider) {
	  _inherits(EcdsaProvider, _EllipticProvider);

	  function EcdsaProvider() {
	    var _this12;

	    _classCallCheck(this, EcdsaProvider);

	    _this12 = _possibleConstructorReturn(this, _getPrototypeOf(EcdsaProvider).apply(this, arguments));
	    _this12.name = "ECDSA";
	    _this12.hashAlgorithms = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
	    _this12.usages = {
	      privateKey: ["sign"],
	      publicKey: ["verify"]
	    };
	    _this12.namedCurves = ["P-256", "P-384", "P-521", "K-256"];
	    return _this12;
	  }

	  _createClass(EcdsaProvider, [{
	    key: "checkAlgorithmParams",
	    value: function checkAlgorithmParams(algorithm) {
	      this.checkRequiredProperty(algorithm, "hash");
	      this.checkHashAlgorithm(algorithm.hash, this.hashAlgorithms);
	    }
	  }]);

	  return EcdsaProvider;
	}(EllipticProvider);

	var KEY_TYPES = ["secret", "private", "public"];

	var CryptoKey =
	/*#__PURE__*/
	function () {
	  function CryptoKey() {
	    _classCallCheck(this, CryptoKey);
	  }

	  _createClass(CryptoKey, null, [{
	    key: "create",
	    value: function create(algorithm, type, extractable, usages) {
	      var key = new this();
	      key.algorithm = algorithm;
	      key.type = type;
	      key.extractable = extractable;
	      key.usages = usages;
	      return key;
	    }
	  }, {
	    key: "isKeyType",
	    value: function isKeyType(data) {
	      return KEY_TYPES.indexOf(data) !== -1;
	    }
	  }]);

	  return CryptoKey;
	}();

	var EcdhProvider =
	/*#__PURE__*/
	function (_EllipticProvider2) {
	  _inherits(EcdhProvider, _EllipticProvider2);

	  function EcdhProvider() {
	    var _this13;

	    _classCallCheck(this, EcdhProvider);

	    _this13 = _possibleConstructorReturn(this, _getPrototypeOf(EcdhProvider).apply(this, arguments));
	    _this13.name = "ECDH";
	    _this13.usages = {
	      privateKey: ["deriveBits", "deriveKey"],
	      publicKey: []
	    };
	    _this13.namedCurves = ["P-256", "P-384", "P-521"];
	    return _this13;
	  }

	  _createClass(EcdhProvider, [{
	    key: "checkAlgorithmParams",
	    value: function checkAlgorithmParams(algorithm) {
	      this.checkRequiredProperty(algorithm, "public");

	      if (!(algorithm.public instanceof CryptoKey)) {
	        throw new TypeError("public: Is not a CryptoKey");
	      }

	      if (algorithm.public.type !== "public") {
	        throw new OperationError("public: Is not a public key");
	      }

	      if (algorithm.public.algorithm.name !== this.name) {
	        throw new OperationError("public: Is not ".concat(this.name, " key"));
	      }
	    }
	  }]);

	  return EcdhProvider;
	}(EllipticProvider);

	var HmacProvider =
	/*#__PURE__*/
	function (_ProviderCrypto5) {
	  _inherits(HmacProvider, _ProviderCrypto5);

	  function HmacProvider() {
	    var _this14;

	    _classCallCheck(this, HmacProvider);

	    _this14 = _possibleConstructorReturn(this, _getPrototypeOf(HmacProvider).apply(this, arguments));
	    _this14.name = "HMAC";
	    _this14.hashAlgorithms = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
	    _this14.usages = ["sign", "verify"];
	    return _this14;
	  }

	  _createClass(HmacProvider, [{
	    key: "getDefaultLength",
	    value: function getDefaultLength(algName) {
	      switch (algName.toUpperCase()) {
	        case "SHA-1":
	          return 160;

	        case "SHA-256":
	          return 256;

	        case "SHA-384":
	          return 384;

	        case "SHA-512":
	          return 512;

	        default:
	          throw new Error("Unknown algorithm name '".concat(algName, "'"));
	      }
	    }
	  }, {
	    key: "checkGenerateKeyParams",
	    value: function checkGenerateKeyParams(algorithm) {
	      this.checkRequiredProperty(algorithm, "hash");
	      this.checkHashAlgorithm(algorithm.hash, this.hashAlgorithms);

	      if ("length" in algorithm) {
	        if (typeof algorithm.length !== "number") {
	          throw new TypeError("length: Is not a Number");
	        }

	        if (algorithm.length < 1) {
	          throw new RangeError("length: Number is out of range");
	        }
	      }
	    }
	  }, {
	    key: "checkImportParams",
	    value: function checkImportParams(algorithm) {
	      this.checkRequiredProperty(algorithm, "hash");
	      this.checkHashAlgorithm(algorithm.hash, this.hashAlgorithms);
	    }
	  }]);

	  return HmacProvider;
	}(ProviderCrypto);

	var Pbkdf2Provider =
	/*#__PURE__*/
	function (_ProviderCrypto6) {
	  _inherits(Pbkdf2Provider, _ProviderCrypto6);

	  function Pbkdf2Provider() {
	    var _this15;

	    _classCallCheck(this, Pbkdf2Provider);

	    _this15 = _possibleConstructorReturn(this, _getPrototypeOf(Pbkdf2Provider).apply(this, arguments));
	    _this15.name = "PBKDF2";
	    _this15.hashAlgorithms = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
	    _this15.usages = ["deriveBits", "deriveKey"];
	    return _this15;
	  }

	  _createClass(Pbkdf2Provider, [{
	    key: "checkAlgorithmParams",
	    value: function checkAlgorithmParams(algorithm) {
	      this.checkRequiredProperty(algorithm, "hash");
	      this.checkHashAlgorithm(algorithm.hash, this.hashAlgorithms);
	      this.checkRequiredProperty(algorithm, "salt");

	      if (!(algorithm.salt instanceof ArrayBuffer || ArrayBuffer.isView(algorithm.salt))) {
	        throw new TypeError("salt: Is not of type '(ArrayBuffer or ArrayBufferView)'");
	      }

	      this.checkRequiredProperty(algorithm, "iterations");

	      if (typeof algorithm.iterations !== "number") {
	        throw new TypeError("iterations: Is not a Number");
	      }

	      if (algorithm.iterations < 1) {
	        throw new TypeError("iterations: Is less than 1");
	      }
	    }
	  }, {
	    key: "checkImportKey",
	    value: function checkImportKey(format, keyData, algorithm, extractable, keyUsages) {
	      _get(_getPrototypeOf(Pbkdf2Provider.prototype), "checkImportKey", this).call(this, format, keyData, algorithm, extractable, keyUsages);

	      if (extractable) {
	        throw new SyntaxError("extractable: Must be False");
	      }
	    }
	  }]);

	  return Pbkdf2Provider;
	}(ProviderCrypto);

	var ProviderStorage =
	/*#__PURE__*/
	function () {
	  function ProviderStorage() {
	    _classCallCheck(this, ProviderStorage);

	    this.items = {};
	  }

	  _createClass(ProviderStorage, [{
	    key: "get",
	    value: function get(algorithmName) {
	      return this.items[algorithmName.toLowerCase()] || null;
	    }
	  }, {
	    key: "set",
	    value: function set(provider) {
	      this.items[provider.name.toLowerCase()] = provider;
	    }
	  }, {
	    key: "removeAt",
	    value: function removeAt(algorithmName) {
	      var provider = this.get(algorithmName.toLowerCase());

	      if (provider) {
	        delete this.items[algorithmName];
	      }

	      return provider;
	    }
	  }, {
	    key: "has",
	    value: function has(name) {
	      return !!this.get(name);
	    }
	  }, {
	    key: "length",
	    get: function get() {
	      return Object.keys(this.items).length;
	    }
	  }, {
	    key: "algorithms",
	    get: function get() {
	      var algorithms = [];

	      for (var key in this.items) {
	        var provider = this.items[key];
	        algorithms.push(provider.name);
	      }

	      return algorithms.sort();
	    }
	  }]);

	  return ProviderStorage;
	}();

	var SubtleCrypto =
	/*#__PURE__*/
	function () {
	  function SubtleCrypto() {
	    _classCallCheck(this, SubtleCrypto);

	    this.providers = new ProviderStorage();
	  }

	  _createClass(SubtleCrypto, [{
	    key: "digest",
	    value: function () {
	      var _digest2 = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee19(algorithm, data) {
	        var preparedAlgorithm,
	            preparedData,
	            provider,
	            result,
	            _args19 = arguments;
	        return regeneratorRuntime.wrap(function _callee19$(_context19) {
	          while (1) {
	            switch (_context19.prev = _context19.next) {
	              case 0:
	                this.checkRequiredArguments(_args19, 2, "digest");
	                preparedAlgorithm = this.prepareAlgorithm(algorithm);
	                preparedData = BufferSourceConverter.toArrayBuffer(data);
	                provider = this.getProvider(preparedAlgorithm.name);
	                _context19.next = 6;
	                return provider.digest(preparedAlgorithm, preparedData);

	              case 6:
	                result = _context19.sent;
	                return _context19.abrupt("return", result);

	              case 8:
	              case "end":
	                return _context19.stop();
	            }
	          }
	        }, _callee19, this);
	      }));

	      function digest(_x60, _x61) {
	        return _digest2.apply(this, arguments);
	      }

	      return digest;
	    }()
	  }, {
	    key: "generateKey",
	    value: function () {
	      var _generateKey2 = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee20(algorithm, extractable, keyUsages) {
	        var preparedAlgorithm,
	            provider,
	            result,
	            _args20 = arguments;
	        return regeneratorRuntime.wrap(function _callee20$(_context20) {
	          while (1) {
	            switch (_context20.prev = _context20.next) {
	              case 0:
	                this.checkRequiredArguments(_args20, 3, "generateKey");
	                preparedAlgorithm = this.prepareAlgorithm(algorithm);
	                provider = this.getProvider(preparedAlgorithm.name);
	                _context20.next = 5;
	                return provider.generateKey(preparedAlgorithm, extractable, keyUsages);

	              case 5:
	                result = _context20.sent;
	                return _context20.abrupt("return", result);

	              case 7:
	              case "end":
	                return _context20.stop();
	            }
	          }
	        }, _callee20, this);
	      }));

	      function generateKey(_x62, _x63, _x64) {
	        return _generateKey2.apply(this, arguments);
	      }

	      return generateKey;
	    }()
	  }, {
	    key: "sign",
	    value: function () {
	      var _sign2 = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee21(algorithm, key, data) {
	        var preparedAlgorithm,
	            preparedData,
	            provider,
	            result,
	            _args21 = arguments;
	        return regeneratorRuntime.wrap(function _callee21$(_context21) {
	          while (1) {
	            switch (_context21.prev = _context21.next) {
	              case 0:
	                this.checkRequiredArguments(_args21, 3, "sign");
	                this.checkCryptoKey(key);
	                preparedAlgorithm = this.prepareAlgorithm(algorithm);
	                preparedData = BufferSourceConverter.toArrayBuffer(data);
	                provider = this.getProvider(preparedAlgorithm.name);
	                _context21.next = 7;
	                return provider.sign(preparedAlgorithm, key, preparedData);

	              case 7:
	                result = _context21.sent;
	                return _context21.abrupt("return", result);

	              case 9:
	              case "end":
	                return _context21.stop();
	            }
	          }
	        }, _callee21, this);
	      }));

	      function sign(_x65, _x66, _x67) {
	        return _sign2.apply(this, arguments);
	      }

	      return sign;
	    }()
	  }, {
	    key: "verify",
	    value: function () {
	      var _verify2 = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee22(algorithm, key, signature, data) {
	        var preparedAlgorithm,
	            preparedData,
	            preparedSignature,
	            provider,
	            result,
	            _args22 = arguments;
	        return regeneratorRuntime.wrap(function _callee22$(_context22) {
	          while (1) {
	            switch (_context22.prev = _context22.next) {
	              case 0:
	                this.checkRequiredArguments(_args22, 4, "verify");
	                this.checkCryptoKey(key);
	                preparedAlgorithm = this.prepareAlgorithm(algorithm);
	                preparedData = BufferSourceConverter.toArrayBuffer(data);
	                preparedSignature = BufferSourceConverter.toArrayBuffer(signature);
	                provider = this.getProvider(preparedAlgorithm.name);
	                _context22.next = 8;
	                return provider.verify(preparedAlgorithm, key, preparedSignature, preparedData);

	              case 8:
	                result = _context22.sent;
	                return _context22.abrupt("return", result);

	              case 10:
	              case "end":
	                return _context22.stop();
	            }
	          }
	        }, _callee22, this);
	      }));

	      function verify(_x68, _x69, _x70, _x71) {
	        return _verify2.apply(this, arguments);
	      }

	      return verify;
	    }()
	  }, {
	    key: "encrypt",
	    value: function () {
	      var _encrypt2 = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee23(algorithm, key, data) {
	        var preparedAlgorithm,
	            preparedData,
	            provider,
	            result,
	            _args23 = arguments;
	        return regeneratorRuntime.wrap(function _callee23$(_context23) {
	          while (1) {
	            switch (_context23.prev = _context23.next) {
	              case 0:
	                this.checkRequiredArguments(_args23, 3, "encrypt");
	                this.checkCryptoKey(key);
	                preparedAlgorithm = this.prepareAlgorithm(algorithm);
	                preparedData = BufferSourceConverter.toArrayBuffer(data);
	                provider = this.getProvider(preparedAlgorithm.name);
	                _context23.next = 7;
	                return provider.encrypt(preparedAlgorithm, key, preparedData, {
	                  keyUsage: true
	                });

	              case 7:
	                result = _context23.sent;
	                return _context23.abrupt("return", result);

	              case 9:
	              case "end":
	                return _context23.stop();
	            }
	          }
	        }, _callee23, this);
	      }));

	      function encrypt(_x72, _x73, _x74) {
	        return _encrypt2.apply(this, arguments);
	      }

	      return encrypt;
	    }()
	  }, {
	    key: "decrypt",
	    value: function () {
	      var _decrypt2 = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee24(algorithm, key, data) {
	        var preparedAlgorithm,
	            preparedData,
	            provider,
	            result,
	            _args24 = arguments;
	        return regeneratorRuntime.wrap(function _callee24$(_context24) {
	          while (1) {
	            switch (_context24.prev = _context24.next) {
	              case 0:
	                this.checkRequiredArguments(_args24, 3, "decrypt");
	                this.checkCryptoKey(key);
	                preparedAlgorithm = this.prepareAlgorithm(algorithm);
	                preparedData = BufferSourceConverter.toArrayBuffer(data);
	                provider = this.getProvider(preparedAlgorithm.name);
	                _context24.next = 7;
	                return provider.decrypt(preparedAlgorithm, key, preparedData, {
	                  keyUsage: true
	                });

	              case 7:
	                result = _context24.sent;
	                return _context24.abrupt("return", result);

	              case 9:
	              case "end":
	                return _context24.stop();
	            }
	          }
	        }, _callee24, this);
	      }));

	      function decrypt(_x75, _x76, _x77) {
	        return _decrypt2.apply(this, arguments);
	      }

	      return decrypt;
	    }()
	  }, {
	    key: "deriveBits",
	    value: function () {
	      var _deriveBits2 = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee25(algorithm, baseKey, length) {
	        var preparedAlgorithm,
	            provider,
	            result,
	            _args25 = arguments;
	        return regeneratorRuntime.wrap(function _callee25$(_context25) {
	          while (1) {
	            switch (_context25.prev = _context25.next) {
	              case 0:
	                this.checkRequiredArguments(_args25, 3, "deriveBits");
	                this.checkCryptoKey(baseKey);
	                preparedAlgorithm = this.prepareAlgorithm(algorithm);
	                provider = this.getProvider(preparedAlgorithm.name);
	                _context25.next = 6;
	                return provider.deriveBits(preparedAlgorithm, baseKey, length, {
	                  keyUsage: true
	                });

	              case 6:
	                result = _context25.sent;
	                return _context25.abrupt("return", result);

	              case 8:
	              case "end":
	                return _context25.stop();
	            }
	          }
	        }, _callee25, this);
	      }));

	      function deriveBits(_x78, _x79, _x80) {
	        return _deriveBits2.apply(this, arguments);
	      }

	      return deriveBits;
	    }()
	  }, {
	    key: "deriveKey",
	    value: function () {
	      var _deriveKey = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee26(algorithm, baseKey, derivedKeyType, extractable, keyUsages) {
	        var preparedDerivedKeyType,
	            importProvider,
	            preparedAlgorithm,
	            provider,
	            derivedBits,
	            _args26 = arguments;
	        return regeneratorRuntime.wrap(function _callee26$(_context26) {
	          while (1) {
	            switch (_context26.prev = _context26.next) {
	              case 0:
	                this.checkRequiredArguments(_args26, 5, "deriveKey");
	                preparedDerivedKeyType = this.prepareAlgorithm(derivedKeyType);
	                importProvider = this.getProvider(preparedDerivedKeyType.name);
	                importProvider.checkDerivedKeyParams(preparedDerivedKeyType);
	                preparedAlgorithm = this.prepareAlgorithm(algorithm);
	                provider = this.getProvider(preparedAlgorithm.name);
	                provider.checkCryptoKey(baseKey, "deriveKey");
	                _context26.next = 9;
	                return provider.deriveBits(preparedAlgorithm, baseKey, derivedKeyType.length, {
	                  keyUsage: false
	                });

	              case 9:
	                derivedBits = _context26.sent;
	                return _context26.abrupt("return", this.importKey("raw", derivedBits, derivedKeyType, extractable, keyUsages));

	              case 11:
	              case "end":
	                return _context26.stop();
	            }
	          }
	        }, _callee26, this);
	      }));

	      function deriveKey(_x81, _x82, _x83, _x84, _x85) {
	        return _deriveKey.apply(this, arguments);
	      }

	      return deriveKey;
	    }()
	  }, {
	    key: "exportKey",
	    value: function () {
	      var _exportKey2 = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee27(format, key) {
	        var provider,
	            result,
	            _args27 = arguments;
	        return regeneratorRuntime.wrap(function _callee27$(_context27) {
	          while (1) {
	            switch (_context27.prev = _context27.next) {
	              case 0:
	                this.checkRequiredArguments(_args27, 2, "exportKey");
	                this.checkCryptoKey(key);
	                provider = this.getProvider(key.algorithm.name);
	                _context27.next = 5;
	                return provider.exportKey(format, key);

	              case 5:
	                result = _context27.sent;
	                return _context27.abrupt("return", result);

	              case 7:
	              case "end":
	                return _context27.stop();
	            }
	          }
	        }, _callee27, this);
	      }));

	      function exportKey(_x86, _x87) {
	        return _exportKey2.apply(this, arguments);
	      }

	      return exportKey;
	    }()
	  }, {
	    key: "importKey",
	    value: function () {
	      var _importKey2 = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee28(format, keyData, algorithm, extractable, keyUsages) {
	        var preparedAlgorithm,
	            provider,
	            preparedData,
	            _args28 = arguments;
	        return regeneratorRuntime.wrap(function _callee28$(_context28) {
	          while (1) {
	            switch (_context28.prev = _context28.next) {
	              case 0:
	                this.checkRequiredArguments(_args28, 5, "importKey");
	                preparedAlgorithm = this.prepareAlgorithm(algorithm);
	                provider = this.getProvider(preparedAlgorithm.name);

	                if (!(["pkcs8", "spki", "raw"].indexOf(format) !== -1)) {
	                  _context28.next = 8;
	                  break;
	                }

	                preparedData = BufferSourceConverter.toArrayBuffer(keyData);
	                return _context28.abrupt("return", provider.importKey(format, preparedData, preparedAlgorithm, extractable, keyUsages));

	              case 8:
	                if (keyData.kty) {
	                  _context28.next = 10;
	                  break;
	                }

	                throw new TypeError("keyData: Is not JSON");

	              case 10:
	                return _context28.abrupt("return", provider.importKey(format, keyData, preparedAlgorithm, extractable, keyUsages));

	              case 11:
	              case "end":
	                return _context28.stop();
	            }
	          }
	        }, _callee28, this);
	      }));

	      function importKey(_x88, _x89, _x90, _x91, _x92) {
	        return _importKey2.apply(this, arguments);
	      }

	      return importKey;
	    }()
	  }, {
	    key: "wrapKey",
	    value: function () {
	      var _wrapKey = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee29(format, key, wrappingKey, wrapAlgorithm) {
	        var keyData, json, preparedAlgorithm, preparedData, provider;
	        return regeneratorRuntime.wrap(function _callee29$(_context29) {
	          while (1) {
	            switch (_context29.prev = _context29.next) {
	              case 0:
	                _context29.next = 2;
	                return this.exportKey(format, key);

	              case 2:
	                keyData = _context29.sent;

	                if (format === "jwk") {
	                  json = JSON.stringify(keyData);
	                  keyData = Convert.FromUtf8String(json);
	                }

	                preparedAlgorithm = this.prepareAlgorithm(wrapAlgorithm);
	                preparedData = BufferSourceConverter.toArrayBuffer(keyData);
	                provider = this.getProvider(preparedAlgorithm.name);
	                return _context29.abrupt("return", provider.encrypt(preparedAlgorithm, wrappingKey, preparedData, {
	                  keyUsage: false
	                }));

	              case 8:
	              case "end":
	                return _context29.stop();
	            }
	          }
	        }, _callee29, this);
	      }));

	      function wrapKey(_x93, _x94, _x95, _x96) {
	        return _wrapKey.apply(this, arguments);
	      }

	      return wrapKey;
	    }()
	  }, {
	    key: "unwrapKey",
	    value: function () {
	      var _unwrapKey = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee30(format, wrappedKey, unwrappingKey, unwrapAlgorithm, unwrappedKeyAlgorithm, extractable, keyUsages) {
	        var preparedAlgorithm, preparedData, provider, keyData, error;
	        return regeneratorRuntime.wrap(function _callee30$(_context30) {
	          while (1) {
	            switch (_context30.prev = _context30.next) {
	              case 0:
	                preparedAlgorithm = this.prepareAlgorithm(unwrapAlgorithm);
	                preparedData = BufferSourceConverter.toArrayBuffer(wrappedKey);
	                provider = this.getProvider(preparedAlgorithm.name);
	                _context30.next = 5;
	                return provider.decrypt(preparedAlgorithm, unwrappingKey, preparedData, {
	                  keyUsage: false
	                });

	              case 5:
	                keyData = _context30.sent;

	                if (!(format === "jwk")) {
	                  _context30.next = 16;
	                  break;
	                }

	                _context30.prev = 7;
	                keyData = JSON.parse(Convert.ToUtf8String(keyData));
	                _context30.next = 16;
	                break;

	              case 11:
	                _context30.prev = 11;
	                _context30.t0 = _context30["catch"](7);
	                error = new TypeError("wrappedKey: Is not a JSON");
	                error.internal = _context30.t0;
	                throw error;

	              case 16:
	                return _context30.abrupt("return", this.importKey(format, keyData, unwrappedKeyAlgorithm, extractable, keyUsages));

	              case 17:
	              case "end":
	                return _context30.stop();
	            }
	          }
	        }, _callee30, this, [[7, 11]]);
	      }));

	      function unwrapKey(_x97, _x98, _x99, _x100, _x101, _x102, _x103) {
	        return _unwrapKey.apply(this, arguments);
	      }

	      return unwrapKey;
	    }()
	  }, {
	    key: "checkRequiredArguments",
	    value: function checkRequiredArguments(args, size, methodName) {
	      if (args.length !== size) {
	        throw new TypeError("Failed to execute '".concat(methodName, "' on 'SubtleCrypto': ").concat(size, " arguments required, but only ").concat(args.length, " present"));
	      }
	    }
	  }, {
	    key: "prepareAlgorithm",
	    value: function prepareAlgorithm(algorithm) {
	      if (typeof algorithm === "string") {
	        return {
	          name: algorithm
	        };
	      }

	      if (SubtleCrypto.isHashedAlgorithm(algorithm)) {
	        var preparedAlgorithm = _objectSpread({}, algorithm);

	        preparedAlgorithm.hash = this.prepareAlgorithm(algorithm.hash);
	        return preparedAlgorithm;
	      }

	      return _objectSpread({}, algorithm);
	    }
	  }, {
	    key: "getProvider",
	    value: function getProvider(name) {
	      var provider = this.providers.get(name);

	      if (!provider) {
	        throw new AlgorithmError("Unrecognized name");
	      }

	      return provider;
	    }
	  }, {
	    key: "checkCryptoKey",
	    value: function checkCryptoKey(key) {
	      if (!(key instanceof CryptoKey)) {
	        throw new TypeError("Key is not of type 'CryptoKey'");
	      }
	    }
	  }], [{
	    key: "isHashedAlgorithm",
	    value: function isHashedAlgorithm(data) {
	      return data instanceof Object && "name" in data && "hash" in data;
	    }
	  }]);

	  return SubtleCrypto;
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
	    var _this;

	    var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

	    _classCallCheck(this, WebCryptoLocalError);

	    _this = _possibleConstructorReturn(this, _getPrototypeOf(WebCryptoLocalError).call(this));
	    _this.code = 0;
	    _this.type = "wcl";
	    var CODE = WebCryptoLocalError.CODE;

	    if (typeof param === "number") {
	      _this.message = message || CODE[param] || CODE[0];
	      _this.code = param;
	    } else {
	      _this.code = 0;
	      _this.message = message;
	    }

	    var error = new Error(_this.message);
	    error.name = _this.constructor.name;
	    _this.stack = error.stack;
	    return _this;
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
	  function DateConverter() {
	    _classCallCheck(this, DateConverter);
	  }

	  _createClass(DateConverter, null, [{
	    key: "set",
	    value: function () {
	      var _set = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee(value) {
	        return regeneratorRuntime.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                return _context.abrupt("return", new Uint8Array(Convert.FromUtf8String(value.toISOString())));

	              case 1:
	              case "end":
	                return _context.stop();
	            }
	          }
	        }, _callee, this);
	      }));

	      function set(_x) {
	        return _set.apply(this, arguments);
	      }

	      return set;
	    }()
	  }, {
	    key: "get",
	    value: function () {
	      var _get = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee2(value) {
	        return regeneratorRuntime.wrap(function _callee2$(_context2) {
	          while (1) {
	            switch (_context2.prev = _context2.next) {
	              case 0:
	                return _context2.abrupt("return", new Date(Convert.ToUtf8String(value)));

	              case 1:
	              case "end":
	                return _context2.stop();
	            }
	          }
	        }, _callee2, this);
	      }));

	      function get(_x2) {
	        return _get.apply(this, arguments);
	      }

	      return get;
	    }()
	  }]);

	  return DateConverter;
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
	      var _set2 = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee3(value) {
	        return regeneratorRuntime.wrap(function _callee3$(_context3) {
	          while (1) {
	            switch (_context3.prev = _context3.next) {
	              case 0:
	                return _context3.abrupt("return", new Uint8Array(Convert.FromHex(value)));

	              case 1:
	              case "end":
	                return _context3.stop();
	            }
	          }
	        }, _callee3, this);
	      }));

	      function set(_x3) {
	        return _set2.apply(this, arguments);
	      }

	      return set;
	    }()
	  }, {
	    key: "get",
	    value: function () {
	      var _get2 = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee4(value) {
	        return regeneratorRuntime.wrap(function _callee4$(_context4) {
	          while (1) {
	            switch (_context4.prev = _context4.next) {
	              case 0:
	                return _context4.abrupt("return", Convert.ToHex(value));

	              case 1:
	              case "end":
	                return _context4.stop();
	            }
	          }
	        }, _callee4, this);
	      }));

	      function get(_x4) {
	        return _get2.apply(this, arguments);
	      }

	      return get;
	    }()
	  }]);

	  return HexStringConverter;
	}();

	var BaseProto_1, ActionProto_1, BaseAlgorithmProto_1, AlgorithmProto_1, CryptoItemProto_1, CryptoKeyProto_1, CryptoKeyPairProto_1, ErrorProto_1, ResultProto_1;

	var BaseProto = BaseProto_1 =
	/*#__PURE__*/
	function (_ObjectProto) {
	  _inherits(BaseProto, _ObjectProto);

	  function BaseProto() {
	    _classCallCheck(this, BaseProto);

	    return _possibleConstructorReturn(this, _getPrototypeOf(BaseProto).apply(this, arguments));
	  }

	  return BaseProto;
	}(ObjectProto$1);

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
	    var _this2;

	    _classCallCheck(this, ActionProto);

	    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(ActionProto).call(this));
	    _this2.action = _this2.constructor.ACTION;
	    return _this2;
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
	    var _this3;

	    var code = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	    var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "error";

	    _classCallCheck(this, ErrorProto);

	    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(ErrorProto).call(this));

	    if (message) {
	      _this3.message = message;
	      _this3.code = code;
	      _this3.type = type;
	    }

	    return _this3;
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
	    var _this4;

	    _classCallCheck(this, ResultProto);

	    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(ResultProto).call(this));

	    if (proto) {
	      _this4.actionId = proto.actionId;
	      _this4.action = proto.action;
	    }

	    return _this4;
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

	function _challenge2(_x5, _x6) {
	  return _challenge.apply(this, arguments);
	}

	function _challenge() {
	  _challenge = _asyncToGenerator(
	  /*#__PURE__*/
	  regeneratorRuntime.mark(function _callee64(serverIdentity, clientIdentity) {
	    var serverIdentityDigest, clientIdentityDigest, combinedIdentity, digest;
	    return regeneratorRuntime.wrap(function _callee64$(_context64) {
	      while (1) {
	        switch (_context64.prev = _context64.next) {
	          case 0:
	            _context64.next = 2;
	            return serverIdentity.thumbprint();

	          case 2:
	            serverIdentityDigest = _context64.sent;
	            _context64.next = 5;
	            return clientIdentity.thumbprint();

	          case 5:
	            clientIdentityDigest = _context64.sent;
	            combinedIdentity = Convert.FromHex(serverIdentityDigest + clientIdentityDigest);
	            _context64.next = 9;
	            return getEngine().crypto.subtle.digest("SHA-256", combinedIdentity);

	          case 9:
	            digest = _context64.sent;
	            return _context64.abrupt("return", parseInt(Convert.ToHex(digest), 16).toString().substr(2, 6));

	          case 11:
	          case "end":
	            return _context64.stop();
	        }
	      }
	    }, _callee64, this);
	  }));
	  return _challenge.apply(this, arguments);
	}

	var SERVER_WELL_KNOWN = "/.well-known/webcrypto-socket";

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

	function createEcPublicKey(_x7) {
	  return _createEcPublicKey.apply(this, arguments);
	}

	function _createEcPublicKey() {
	  _createEcPublicKey = _asyncToGenerator(
	  /*#__PURE__*/
	  regeneratorRuntime.mark(function _callee65(publicKey) {
	    var algName, jwk, x, y, xy, key, serialized, id;
	    return regeneratorRuntime.wrap(function _callee65$(_context65) {
	      while (1) {
	        switch (_context65.prev = _context65.next) {
	          case 0:
	            algName = publicKey.algorithm.name.toUpperCase();

	            if (algName === "ECDH" || algName === "ECDSA") {
	              _context65.next = 3;
	              break;
	            }

	            throw new Error("Error: Unsupported asymmetric key algorithm.");

	          case 3:
	            if (!(publicKey.type !== "public")) {
	              _context65.next = 5;
	              break;
	            }

	            throw new Error("Error: Expected key type to be public but it was not.");

	          case 5:
	            _context65.next = 7;
	            return getEngine().crypto.subtle.exportKey("jwk", publicKey);

	          case 7:
	            jwk = _context65.sent;

	            if (jwk.x && jwk.y) {
	              _context65.next = 10;
	              break;
	            }

	            throw new Error("Wrong JWK data for EC public key. Parameters x and y are required.");

	          case 10:
	            x = Convert.FromBase64Url(jwk.x);
	            y = Convert.FromBase64Url(jwk.y);
	            xy = Convert.ToBinary(x) + Convert.ToBinary(y);
	            key = publicKey;
	            serialized = Convert.FromBinary(xy);
	            _context65.t0 = Convert;
	            _context65.next = 18;
	            return getEngine().crypto.subtle.digest("SHA-256", serialized);

	          case 18:
	            _context65.t1 = _context65.sent;
	            id = _context65.t0.ToHex.call(_context65.t0, _context65.t1);
	            return _context65.abrupt("return", {
	              id: id,
	              key: key,
	              serialized: serialized
	            });

	          case 21:
	          case "end":
	            return _context65.stop();
	        }
	      }
	    }, _callee65, this);
	  }));
	  return _createEcPublicKey.apply(this, arguments);
	}

	function updateEcPublicKey(_x8, _x9) {
	  return _updateEcPublicKey.apply(this, arguments);
	}

	function _updateEcPublicKey() {
	  _updateEcPublicKey = _asyncToGenerator(
	  /*#__PURE__*/
	  regeneratorRuntime.mark(function _callee66(ecPublicKey, publicKey) {
	    var data;
	    return regeneratorRuntime.wrap(function _callee66$(_context66) {
	      while (1) {
	        switch (_context66.prev = _context66.next) {
	          case 0:
	            _context66.next = 2;
	            return createEcPublicKey(publicKey);

	          case 2:
	            data = _context66.sent;
	            ecPublicKey.id = data.id;
	            ecPublicKey.key = data.key;
	            ecPublicKey.serialized = data.serialized;

	          case 6:
	          case "end":
	            return _context66.stop();
	        }
	      }
	    }, _callee66, this);
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
	      regeneratorRuntime.mark(function _callee5() {
	        var wKey;
	        return regeneratorRuntime.wrap(function _callee5$(_context5) {
	          while (1) {
	            switch (_context5.prev = _context5.next) {
	              case 0:
	                _context5.next = 2;
	                return this.db.transaction(BrowserStorage.IDENTITY_STORAGE).objectStore(BrowserStorage.IDENTITY_STORAGE).get("wkey");

	              case 2:
	                wKey = _context5.sent;

	                if (!wKey) {
	                  _context5.next = 11;
	                  break;
	                }

	                if (!isEdge()) {
	                  _context5.next = 10;
	                  break;
	                }

	                if (wKey.key instanceof ArrayBuffer) {
	                  _context5.next = 7;
	                  break;
	                }

	                return _context5.abrupt("return", null);

	              case 7:
	                _context5.next = 9;
	                return getEngine().crypto.subtle.importKey("raw", wKey.key, {
	                  name: AES_CBC.name,
	                  length: 256
	                }, false, ["encrypt", "decrypt", "wrapKey", "unwrapKey"]);

	              case 9:
	                wKey.key = _context5.sent;

	              case 10:
	                AES_CBC.iv = wKey.iv;

	              case 11:
	                return _context5.abrupt("return", wKey || null);

	              case 12:
	              case "end":
	                return _context5.stop();
	            }
	          }
	        }, _callee5, this);
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
	      regeneratorRuntime.mark(function _callee6(key) {
	        var tx;
	        return regeneratorRuntime.wrap(function _callee6$(_context6) {
	          while (1) {
	            switch (_context6.prev = _context6.next) {
	              case 0:
	                if (!isEdge()) {
	                  _context6.next = 6;
	                  break;
	                }

	                _context6.next = 3;
	                return getEngine().crypto.subtle.exportKey("raw", key.key);

	              case 3:
	                _context6.t0 = _context6.sent;
	                _context6.t1 = key.iv;
	                key = {
	                  key: _context6.t0,
	                  iv: _context6.t1
	                };

	              case 6:
	                tx = this.db.transaction(BrowserStorage.IDENTITY_STORAGE, "readwrite");
	                tx.objectStore(BrowserStorage.IDENTITY_STORAGE).put(key, "wkey");
	                return _context6.abrupt("return", tx.complete);

	              case 9:
	              case "end":
	                return _context6.stop();
	            }
	          }
	        }, _callee6, this);
	      }));

	      function saveWrapKey(_x10) {
	        return _saveWrapKey.apply(this, arguments);
	      }

	      return saveWrapKey;
	    }()
	  }, {
	    key: "loadIdentity",
	    value: function () {
	      var _loadIdentity = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee7() {
	        var json, res, wkey;
	        return regeneratorRuntime.wrap(function _callee7$(_context7) {
	          while (1) {
	            switch (_context7.prev = _context7.next) {
	              case 0:
	                _context7.next = 2;
	                return this.db.transaction(BrowserStorage.IDENTITY_STORAGE).objectStore(BrowserStorage.IDENTITY_STORAGE).get("identity");

	              case 2:
	                json = _context7.sent;
	                res = null;

	                if (!json) {
	                  _context7.next = 27;
	                  break;
	                }

	                if (!(isFirefox() || isEdge())) {
	                  _context7.next = 24;
	                  break;
	                }

	                _context7.next = 8;
	                return this.loadWrapKey();

	              case 8:
	                wkey = _context7.sent;

	                if (wkey && wkey.key.usages.some(function (usage) {
	                  return usage === "encrypt";
	                }) && json.exchangeKey.privateKey instanceof ArrayBuffer) {
	                  _context7.next = 11;
	                  break;
	                }

	                return _context7.abrupt("return", null);

	              case 11:
	                _context7.next = 13;
	                return getEngine().crypto.subtle.decrypt(AES_CBC, wkey.key, json.exchangeKey.privateKey).then(function (buf) {
	                  return getEngine().crypto.subtle.importKey("jwk", JSON.parse(Convert.ToUtf8String(buf)), ECDH, false, ["deriveKey", "deriveBits"]);
	                });

	              case 13:
	                json.exchangeKey.privateKey = _context7.sent;
	                _context7.next = 16;
	                return getEngine().crypto.subtle.decrypt(AES_CBC, wkey.key, json.signingKey.privateKey).then(function (buf) {
	                  return getEngine().crypto.subtle.importKey("jwk", JSON.parse(Convert.ToUtf8String(buf)), ECDSA, false, ["sign"]);
	                });

	              case 16:
	                json.signingKey.privateKey = _context7.sent;

	                if (!isEdge()) {
	                  _context7.next = 24;
	                  break;
	                }

	                _context7.next = 20;
	                return getEngine().crypto.subtle.unwrapKey("jwk", json.exchangeKey.publicKey, wkey.key, AES_CBC, ECDH, true, []);

	              case 20:
	                json.exchangeKey.publicKey = _context7.sent;
	                _context7.next = 23;
	                return getEngine().crypto.subtle.unwrapKey("jwk", json.signingKey.publicKey, wkey.key, AES_CBC, ECDSA, true, ["verify"]);

	              case 23:
	                json.signingKey.publicKey = _context7.sent;

	              case 24:
	                _context7.next = 26;
	                return Identity.fromJSON(json);

	              case 26:
	                res = _context7.sent;

	              case 27:
	                return _context7.abrupt("return", res);

	              case 28:
	              case "end":
	                return _context7.stop();
	            }
	          }
	        }, _callee7, this);
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
	      regeneratorRuntime.mark(function _callee8(value) {
	        var wkey, exchangeKeyPair, signingKeyPair, json, tx;
	        return regeneratorRuntime.wrap(function _callee8$(_context8) {
	          while (1) {
	            switch (_context8.prev = _context8.next) {
	              case 0:
	                if (!(isFirefox() || isEdge())) {
	                  _context8.next = 20;
	                  break;
	                }

	                _context8.next = 3;
	                return getEngine().crypto.subtle.generateKey({
	                  name: AES_CBC.name,
	                  length: 256
	                }, isEdge(), ["wrapKey", "unwrapKey", "encrypt", "decrypt"]);

	              case 3:
	                _context8.t0 = _context8.sent;
	                _context8.t1 = getEngine().crypto.getRandomValues(new Uint8Array(AES_CBC.iv)).buffer;
	                wkey = {
	                  key: _context8.t0,
	                  iv: _context8.t1
	                };
	                _context8.next = 8;
	                return this.saveWrapKey(wkey);

	              case 8:
	                _context8.next = 10;
	                return getEngine().crypto.subtle.generateKey(value.exchangeKey.privateKey.algorithm, true, ["deriveKey", "deriveBits"]);

	              case 10:
	                exchangeKeyPair = _context8.sent;
	                value.exchangeKey.privateKey = exchangeKeyPair.privateKey;
	                _context8.next = 14;
	                return updateEcPublicKey(value.exchangeKey.publicKey, exchangeKeyPair.publicKey);

	              case 14:
	                _context8.next = 16;
	                return getEngine().crypto.subtle.generateKey(value.signingKey.privateKey.algorithm, true, ["sign", "verify"]);

	              case 16:
	                signingKeyPair = _context8.sent;
	                value.signingKey.privateKey = signingKeyPair.privateKey;
	                _context8.next = 20;
	                return updateEcPublicKey(value.signingKey.publicKey, signingKeyPair.publicKey);

	              case 20:
	                _context8.next = 22;
	                return value.toJSON();

	              case 22:
	                json = _context8.sent;

	                if (!(isFirefox() || isEdge())) {
	                  _context8.next = 37;
	                  break;
	                }

	                _context8.next = 26;
	                return getEngine().crypto.subtle.wrapKey("jwk", value.exchangeKey.privateKey, wkey.key, AES_CBC);

	              case 26:
	                json.exchangeKey.privateKey = _context8.sent;
	                _context8.next = 29;
	                return getEngine().crypto.subtle.wrapKey("jwk", value.signingKey.privateKey, wkey.key, AES_CBC);

	              case 29:
	                json.signingKey.privateKey = _context8.sent;

	                if (!isEdge()) {
	                  _context8.next = 37;
	                  break;
	                }

	                _context8.next = 33;
	                return getEngine().crypto.subtle.wrapKey("jwk", value.exchangeKey.publicKey.key, wkey.key, AES_CBC);

	              case 33:
	                json.exchangeKey.publicKey = _context8.sent;
	                _context8.next = 36;
	                return getEngine().crypto.subtle.wrapKey("jwk", value.signingKey.publicKey.key, wkey.key, AES_CBC);

	              case 36:
	                json.signingKey.publicKey = _context8.sent;

	              case 37:
	                tx = this.db.transaction(BrowserStorage.IDENTITY_STORAGE, "readwrite");
	                tx.objectStore(BrowserStorage.IDENTITY_STORAGE).put(json, "identity");
	                return _context8.abrupt("return", tx.complete);

	              case 40:
	              case "end":
	                return _context8.stop();
	            }
	          }
	        }, _callee8, this);
	      }));

	      function saveIdentity(_x11) {
	        return _saveIdentity.apply(this, arguments);
	      }

	      return saveIdentity;
	    }()
	  }, {
	    key: "loadRemoteIdentity",
	    value: function () {
	      var _loadRemoteIdentity = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee9(key) {
	        var json, res;
	        return regeneratorRuntime.wrap(function _callee9$(_context9) {
	          while (1) {
	            switch (_context9.prev = _context9.next) {
	              case 0:
	                _context9.next = 2;
	                return this.db.transaction(BrowserStorage.REMOTE_STORAGE).objectStore(BrowserStorage.REMOTE_STORAGE).get(key);

	              case 2:
	                json = _context9.sent;
	                res = null;

	                if (!json) {
	                  _context9.next = 8;
	                  break;
	                }

	                _context9.next = 7;
	                return RemoteIdentity.fromJSON(json);

	              case 7:
	                res = _context9.sent;

	              case 8:
	                return _context9.abrupt("return", res);

	              case 9:
	              case "end":
	                return _context9.stop();
	            }
	          }
	        }, _callee9, this);
	      }));

	      function loadRemoteIdentity(_x12) {
	        return _loadRemoteIdentity.apply(this, arguments);
	      }

	      return loadRemoteIdentity;
	    }()
	  }, {
	    key: "saveRemoteIdentity",
	    value: function () {
	      var _saveRemoteIdentity = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee10(key, value) {
	        var json, tx;
	        return regeneratorRuntime.wrap(function _callee10$(_context10) {
	          while (1) {
	            switch (_context10.prev = _context10.next) {
	              case 0:
	                _context10.next = 2;
	                return value.toJSON();

	              case 2:
	                json = _context10.sent;
	                tx = this.db.transaction(BrowserStorage.REMOTE_STORAGE, "readwrite");
	                tx.objectStore(BrowserStorage.REMOTE_STORAGE).put(json, key);
	                return _context10.abrupt("return", tx.complete);

	              case 6:
	              case "end":
	                return _context10.stop();
	            }
	          }
	        }, _callee10, this);
	      }));

	      function saveRemoteIdentity(_x13, _x14) {
	        return _saveRemoteIdentity.apply(this, arguments);
	      }

	      return saveRemoteIdentity;
	    }()
	  }, {
	    key: "loadSession",
	    value: function () {
	      var _loadSession = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee11(key) {
	        var json, res, identity, remoteIdentity;
	        return regeneratorRuntime.wrap(function _callee11$(_context11) {
	          while (1) {
	            switch (_context11.prev = _context11.next) {
	              case 0:
	                _context11.next = 2;
	                return this.db.transaction(BrowserStorage.SESSION_STORAGE).objectStore(BrowserStorage.SESSION_STORAGE).get(key);

	              case 2:
	                json = _context11.sent;
	                res = null;

	                if (!json) {
	                  _context11.next = 18;
	                  break;
	                }

	                _context11.next = 7;
	                return this.loadIdentity();

	              case 7:
	                identity = _context11.sent;

	                if (identity) {
	                  _context11.next = 10;
	                  break;
	                }

	                throw new Error("Identity is empty");

	              case 10:
	                _context11.next = 12;
	                return this.loadRemoteIdentity(key);

	              case 12:
	                remoteIdentity = _context11.sent;

	                if (remoteIdentity) {
	                  _context11.next = 15;
	                  break;
	                }

	                throw new Error("Remote identity is not found");

	              case 15:
	                _context11.next = 17;
	                return AsymmetricRatchet.fromJSON(identity, remoteIdentity, json);

	              case 17:
	                res = _context11.sent;

	              case 18:
	                return _context11.abrupt("return", res);

	              case 19:
	              case "end":
	                return _context11.stop();
	            }
	          }
	        }, _callee11, this);
	      }));

	      function loadSession(_x15) {
	        return _loadSession.apply(this, arguments);
	      }

	      return loadSession;
	    }()
	  }, {
	    key: "saveSession",
	    value: function () {
	      var _saveSession = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee12(key, value) {
	        var json, tx;
	        return regeneratorRuntime.wrap(function _callee12$(_context12) {
	          while (1) {
	            switch (_context12.prev = _context12.next) {
	              case 0:
	                _context12.next = 2;
	                return value.toJSON();

	              case 2:
	                json = _context12.sent;
	                tx = this.db.transaction(BrowserStorage.SESSION_STORAGE, "readwrite");
	                tx.objectStore(BrowserStorage.SESSION_STORAGE).put(json, key);
	                return _context12.abrupt("return", tx.complete);

	              case 6:
	              case "end":
	                return _context12.stop();
	            }
	          }
	        }, _callee12, this);
	      }));

	      function saveSession(_x16, _x17) {
	        return _saveSession.apply(this, arguments);
	      }

	      return saveSession;
	    }()
	  }], [{
	    key: "create",
	    value: function () {
	      var _create = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee13() {
	        var _this5 = this;

	        var db;
	        return regeneratorRuntime.wrap(function _callee13$(_context13) {
	          while (1) {
	            switch (_context13.prev = _context13.next) {
	              case 0:
	                _context13.next = 2;
	                return openDb(this.STORAGE_NAME, 1, function (updater) {
	                  updater.createObjectStore(_this5.SESSION_STORAGE);
	                  updater.createObjectStore(_this5.IDENTITY_STORAGE);
	                  updater.createObjectStore(_this5.REMOTE_STORAGE);
	                });

	              case 2:
	                db = _context13.sent;
	                return _context13.abrupt("return", new BrowserStorage(db));

	              case 4:
	              case "end":
	                return _context13.stop();
	            }
	          }
	        }, _callee13, this);
	      }));

	      function create() {
	        return _create.apply(this, arguments);
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
	    var _this6;

	    _classCallCheck(this, ClientListeningEvent);

	    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(ClientListeningEvent).call(this, target, "listening"));
	    _this6.address = address;
	    return _this6;
	  }

	  return ClientListeningEvent;
	}(ClientEvent);

	var ClientCloseEvent =
	/*#__PURE__*/
	function (_ClientEvent2) {
	  _inherits(ClientCloseEvent, _ClientEvent2);

	  function ClientCloseEvent(target, remoteAddress, reasonCode, description) {
	    var _this7;

	    _classCallCheck(this, ClientCloseEvent);

	    _this7 = _possibleConstructorReturn(this, _getPrototypeOf(ClientCloseEvent).call(this, target, "close"));
	    _this7.remoteAddress = remoteAddress;
	    _this7.reasonCode = reasonCode;
	    _this7.description = description;
	    return _this7;
	  }

	  return ClientCloseEvent;
	}(ClientEvent);

	var ClientErrorEvent =
	/*#__PURE__*/
	function (_ClientEvent3) {
	  _inherits(ClientErrorEvent, _ClientEvent3);

	  function ClientErrorEvent(target, error) {
	    var _this8;

	    _classCallCheck(this, ClientErrorEvent);

	    _this8 = _possibleConstructorReturn(this, _getPrototypeOf(ClientErrorEvent).call(this, target, "error"));
	    _this8.error = error;
	    return _this8;
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
	function (_EventEmitter) {
	  _inherits(Client, _EventEmitter);

	  function Client() {
	    var _this9;

	    _classCallCheck(this, Client);

	    _this9 = _possibleConstructorReturn(this, _getPrototypeOf(Client).call(this));
	    _this9.stack = {};
	    _this9.messageCounter = 0;
	    return _this9;
	  }

	  _createClass(Client, [{
	    key: "connect",
	    value: function connect(address) {
	      var _this10 = this;

	      this.getServerInfo(address).then(function (info) {
	        _this10.serviceInfo = info;
	        _this10.socket = new WebSocket("wss://".concat(address));
	        _this10.socket.binaryType = "arraybuffer";

	        _this10.socket.onerror = function (e) {
	          _this10.emit("error", new ClientErrorEvent(_this10, e.error));
	        };

	        _this10.socket.onopen = function (e) {
	          _asyncToGenerator(
	          /*#__PURE__*/
	          regeneratorRuntime.mark(function _callee14() {
	            var storage, identity, remoteIdentityId, bundle;
	            return regeneratorRuntime.wrap(function _callee14$(_context14) {
	              while (1) {
	                switch (_context14.prev = _context14.next) {
	                  case 0:
	                    _context14.next = 2;
	                    return BrowserStorage.create();

	                  case 2:
	                    storage = _context14.sent;
	                    _context14.next = 5;
	                    return storage.loadIdentity();

	                  case 5:
	                    identity = _context14.sent;

	                    if (identity) {
	                      _context14.next = 13;
	                      break;
	                    }

	                    if (self.PV_WEBCRYPTO_SOCKET_LOG) {
	                      console.info("Generates new identity");
	                    }

	                    _context14.next = 10;
	                    return Identity.create(1);

	                  case 10:
	                    identity = _context14.sent;
	                    _context14.next = 13;
	                    return storage.saveIdentity(identity);

	                  case 13:
	                    remoteIdentityId = "0";
	                    _context14.next = 16;
	                    return PreKeyBundleProtocol.importProto(Convert.FromBase64(info.preKey));

	                  case 16:
	                    bundle = _context14.sent;
	                    _context14.next = 19;
	                    return AsymmetricRatchet.create(identity, bundle);

	                  case 19:
	                    _this10.cipher = _context14.sent;
	                    _context14.next = 22;
	                    return storage.saveRemoteIdentity(remoteIdentityId, _this10.cipher.remoteIdentity);

	                  case 22:
	                    _this10.emit("listening", new ClientListeningEvent(_this10, address));

	                  case 23:
	                  case "end":
	                    return _context14.stop();
	                }
	              }
	            }, _callee14, this);
	          }))().catch(function (error) {
	            return _this10.emit("error", new ClientErrorEvent(_this10, error));
	          });
	        };

	        _this10.socket.onclose = function (e) {
	          for (var actionId in _this10.stack) {
	            var message = _this10.stack[actionId];
	            message.reject(new Error("Cannot finish operation. Session was closed"));
	          }

	          _this10.emit("close", new ClientCloseEvent(_this10, address, e.code, e.reason));
	        };

	        _this10.socket.onmessage = function (e) {
	          if (e.data instanceof ArrayBuffer) {
	            MessageSignedProtocol.importProto(e.data).then(function (proto) {
	              return _this10.cipher.decrypt(proto);
	            }).then(function (msg) {
	              _this10.onMessage(msg);
	            }).catch(function (err) {
	              _this10.emit("error", new ClientErrorEvent(_this10, err));
	            });
	          }
	        };
	      }).catch(function (err) {
	        _this10.emit("error", new ClientErrorEvent(_this10, err));
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
	      regeneratorRuntime.mark(function _callee15() {
	        return regeneratorRuntime.wrap(function _callee15$(_context15) {
	          while (1) {
	            switch (_context15.prev = _context15.next) {
	              case 0:
	                return _context15.abrupt("return", _challenge2(this.cipher.remoteIdentity.signingKey, this.cipher.identity.signingKey.publicKey));

	              case 1:
	              case "end":
	                return _context15.stop();
	            }
	          }
	        }, _callee15, this);
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
	      regeneratorRuntime.mark(function _callee16() {
	        var action, data;
	        return regeneratorRuntime.wrap(function _callee16$(_context16) {
	          while (1) {
	            switch (_context16.prev = _context16.next) {
	              case 0:
	                action = new ServerIsLoggedInActionProto();
	                _context16.next = 3;
	                return this.send(action);

	              case 3:
	                data = _context16.sent;
	                return _context16.abrupt("return", data ? !!new Uint8Array(data)[0] : false);

	              case 5:
	              case "end":
	                return _context16.stop();
	            }
	          }
	        }, _callee16, this);
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
	      regeneratorRuntime.mark(function _callee17() {
	        var action;
	        return regeneratorRuntime.wrap(function _callee17$(_context17) {
	          while (1) {
	            switch (_context17.prev = _context17.next) {
	              case 0:
	                action = new ServerLoginActionProto();
	                _context17.next = 3;
	                return this.send(action);

	              case 3:
	              case "end":
	                return _context17.stop();
	            }
	          }
	        }, _callee17, this);
	      }));

	      function login() {
	        return _login.apply(this, arguments);
	      }

	      return login;
	    }()
	  }, {
	    key: "send",
	    value: function send(data) {
	      var _this11 = this;

	      return new Promise(function (resolve, reject) {
	        _this11.checkSocketState();

	        if (!data) {
	          data = new ActionProto();
	        }

	        data.action = data.action;
	        data.actionId = (_this11.messageCounter++).toString();
	        data.exportProto().then(function (raw) {
	          return _this11.cipher.encrypt(raw).then(function (msg) {
	            return msg.exportProto();
	          });
	        }).then(function (raw) {
	          _this11.stack[data.actionId] = {
	            resolve: resolve,
	            reject: reject
	          };

	          _this11.socket.send(raw);
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
	      regeneratorRuntime.mark(function _callee18(message) {
	        var proto, promise, messageProto, errorProto, error;
	        return regeneratorRuntime.wrap(function _callee18$(_context18) {
	          while (1) {
	            switch (_context18.prev = _context18.next) {
	              case 0:
	                _context18.next = 2;
	                return ActionProto.importProto(message);

	              case 2:
	                proto = _context18.sent;

	                if (self.PV_WEBCRYPTO_SOCKET_LOG) {
	                  console.info("Action:", proto.action);
	                }

	                promise = this.stack[proto.actionId];

	                if (!promise) {
	                  _context18.next = 17;
	                  break;
	                }

	                delete this.stack[proto.actionId];
	                _context18.t0 = ResultProto;
	                _context18.next = 10;
	                return proto.exportProto();

	              case 10:
	                _context18.t1 = _context18.sent;
	                _context18.next = 13;
	                return _context18.t0.importProto.call(_context18.t0, _context18.t1);

	              case 13:
	                messageProto = _context18.sent;

	                if (messageProto.error && messageProto.error.message) {
	                  errorProto = messageProto.error;
	                  error = new Error(messageProto.error.message);
	                  error.code = errorProto.code;
	                  error.type = errorProto.type;
	                  promise.reject(error);
	                } else {
	                  promise.resolve(messageProto.data);
	                }

	                _context18.next = 18;
	                break;

	              case 17:
	                this.emit("event", proto);

	              case 18:
	              case "end":
	                return _context18.stop();
	            }
	          }
	        }, _callee18, this);
	      }));

	      function onMessage(_x18) {
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
	    var _this12;

	    _classCallCheck(this, ProviderCryptoProto);

	    _this12 = _possibleConstructorReturn(this, _getPrototypeOf(ProviderCryptoProto).call(this));

	    if (data) {
	      assign(_assertThisInitialized(_this12), data);
	    }

	    return _this12;
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
	    var _this13;

	    _classCallCheck(this, ProviderTokenEventProto);

	    _this13 = _possibleConstructorReturn(this, _getPrototypeOf(ProviderTokenEventProto).call(this));

	    if (data) {
	      assign(_assertThisInitialized(_this13), data);
	    }

	    return _this13;
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
	function (_EventEmitter2) {
	  _inherits(CardReader, _EventEmitter2);

	  function CardReader(client) {
	    var _this14;

	    _classCallCheck(this, CardReader);

	    _this14 = _possibleConstructorReturn(this, _getPrototypeOf(CardReader).call(this));
	    _this14.client = client;
	    _this14.onEvent = _this14.onEvent.bind(_assertThisInitialized(_this14));

	    _this14.client.on("listening", function () {
	      _this14.client.on("event", _this14.onEvent);
	    }).on("close", function () {
	      _this14.client.removeListener("event", _this14.onEvent);
	    });

	    return _this14;
	  }

	  _createClass(CardReader, [{
	    key: "readers",
	    value: function () {
	      var _readers = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee19() {
	        var data;
	        return regeneratorRuntime.wrap(function _callee19$(_context19) {
	          while (1) {
	            switch (_context19.prev = _context19.next) {
	              case 0:
	                _context19.next = 2;
	                return this.client.send(new CardReaderGetReadersActionProto());

	              case 2:
	                data = _context19.sent;
	                return _context19.abrupt("return", JSON.parse(Convert.ToString(data)));

	              case 4:
	              case "end":
	                return _context19.stop();
	            }
	          }
	        }, _callee19, this);
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
	      var _get4;

	      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }

	      return (_get4 = _get(_getPrototypeOf(CardReader.prototype), "emit", this)).call.apply(_get4, [this, event].concat(args));
	    }
	  }, {
	    key: "onEvent",
	    value: function onEvent(actionProto) {
	      var _this15 = this;

	      _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee20() {
	        return regeneratorRuntime.wrap(function _callee20$(_context20) {
	          while (1) {
	            switch (_context20.prev = _context20.next) {
	              case 0:
	                _context20.t0 = actionProto.action;
	                _context20.next = _context20.t0 === CardReaderInsertEventProto.ACTION ? 3 : _context20.t0 === CardReaderRemoveEventProto.ACTION ? 9 : 15;
	                break;

	              case 3:
	                _context20.t1 = _this15;
	                _context20.next = 6;
	                return CardReaderInsertEventProto.importProto(actionProto);

	              case 6:
	                _context20.t2 = _context20.sent;

	                _context20.t1.onInsert.call(_context20.t1, _context20.t2);

	                return _context20.abrupt("break", 15);

	              case 9:
	                _context20.t3 = _this15;
	                _context20.next = 12;
	                return CardReaderRemoveEventProto.importProto(actionProto);

	              case 12:
	                _context20.t4 = _context20.sent;

	                _context20.t3.onRemove.call(_context20.t3, _context20.t4);

	                return _context20.abrupt("break", 15);

	              case 15:
	              case "end":
	                return _context20.stop();
	            }
	          }
	        }, _callee20, this);
	      }))().catch(function (err) {
	        return _this15.emit("error", err);
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
	    var _this16;

	    _classCallCheck(this, CryptoX509CertificateProto);

	    _this16 = _possibleConstructorReturn(this, _getPrototypeOf(CryptoX509CertificateProto).apply(this, arguments));
	    _this16.type = "x509";
	    return _this16;
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
	    var _this17;

	    _classCallCheck(this, CryptoX509CertificateRequestProto);

	    _this17 = _possibleConstructorReturn(this, _getPrototypeOf(CryptoX509CertificateRequestProto).apply(this, arguments));
	    _this17.type = "request";
	    return _this17;
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
	    var _this18;

	    _classCallCheck(this, CertificateStorageGetChainResultProto);

	    _this18 = _possibleConstructorReturn(this, _getPrototypeOf(CertificateStorageGetChainResultProto).apply(this, arguments));
	    _this18.items = [];
	    return _this18;
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

	  if (_typeof(algorithm) === "object" && !("name" in algorithm)) {
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
	      regeneratorRuntime.mark(function _callee21(item) {
	        var proto, result;
	        return regeneratorRuntime.wrap(function _callee21$(_context21) {
	          while (1) {
	            switch (_context21.prev = _context21.next) {
	              case 0:
	                checkCryptoCertificate(item, "item");
	                proto = new CertificateStorageIndexOfActionProto();
	                proto.providerID = this.provider.id;
	                proto.item = item;
	                _context21.next = 6;
	                return this.provider.client.send(proto);

	              case 6:
	                result = _context21.sent;
	                return _context21.abrupt("return", result ? Convert.ToUtf8String(result) : null);

	              case 8:
	              case "end":
	                return _context21.stop();
	            }
	          }
	        }, _callee21, this);
	      }));

	      function indexOf(_x19) {
	        return _indexOf.apply(this, arguments);
	      }

	      return indexOf;
	    }()
	  }, {
	    key: "hasItem",
	    value: function () {
	      var _hasItem = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee22(item) {
	        var index;
	        return regeneratorRuntime.wrap(function _callee22$(_context22) {
	          while (1) {
	            switch (_context22.prev = _context22.next) {
	              case 0:
	                _context22.next = 2;
	                return this.indexOf(item);

	              case 2:
	                index = _context22.sent;
	                return _context22.abrupt("return", !!index);

	              case 4:
	              case "end":
	                return _context22.stop();
	            }
	          }
	        }, _callee22, this);
	      }));

	      function hasItem(_x20) {
	        return _hasItem.apply(this, arguments);
	      }

	      return hasItem;
	    }()
	  }, {
	    key: "exportCert",
	    value: function () {
	      var _exportCert = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee23(format, item) {
	        var proto, result, header, res, b64, counter, raw;
	        return regeneratorRuntime.wrap(function _callee23$(_context23) {
	          while (1) {
	            switch (_context23.prev = _context23.next) {
	              case 0:
	                checkPrimitive(format, "string", "format");
	                checkCryptoCertificate(item, "item");
	                proto = new CertificateStorageExportActionProto();
	                proto.providerID = this.provider.id;
	                proto.format = "raw";
	                proto.item = item;
	                _context23.next = 8;
	                return this.provider.client.send(proto);

	              case 8:
	                result = _context23.sent;

	                if (!(format === "raw")) {
	                  _context23.next = 13;
	                  break;
	                }

	                return _context23.abrupt("return", result);

	              case 13:
	                header = "";
	                _context23.t0 = item.type;
	                _context23.next = _context23.t0 === "x509" ? 17 : _context23.t0 === "request" ? 19 : 21;
	                break;

	              case 17:
	                header = "CERTIFICATE";
	                return _context23.abrupt("break", 22);

	              case 19:
	                header = "CERTIFICATE REQUEST";
	                return _context23.abrupt("break", 22);

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
	                return _context23.abrupt("return", res.join("\r\n"));

	              case 31:
	              case "end":
	                return _context23.stop();
	            }
	          }
	        }, _callee23, this);
	      }));

	      function exportCert(_x21, _x22) {
	        return _exportCert.apply(this, arguments);
	      }

	      return exportCert;
	    }()
	  }, {
	    key: "importCert",
	    value: function () {
	      var _importCert = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee24(format, data, algorithm, keyUsages) {
	        var algProto, rawData, proto, result, certItem;
	        return regeneratorRuntime.wrap(function _callee24$(_context24) {
	          while (1) {
	            switch (_context24.prev = _context24.next) {
	              case 0:
	                checkPrimitive(format, "string", "format");

	                if (~IMPORT_CERT_FORMATS.indexOf(format)) {
	                  _context24.next = 3;
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
	                  _context24.next = 11;
	                  break;
	                }

	                rawData = BufferSourceConverter.toArrayBuffer(data);
	                _context24.next = 16;
	                break;

	              case 11:
	                if (!(typeof data === "string")) {
	                  _context24.next = 15;
	                  break;
	                }

	                rawData = PemConverter.toArrayBuffer(data);
	                _context24.next = 16;
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
	                _context24.next = 24;
	                return this.provider.client.send(proto);

	              case 24:
	                result = _context24.sent;
	                _context24.next = 27;
	                return CryptoCertificateProto.importProto(result);

	              case 27:
	                certItem = _context24.sent;
	                return _context24.abrupt("return", this.prepareCertItem(certItem));

	              case 29:
	              case "end":
	                return _context24.stop();
	            }
	          }
	        }, _callee24, this);
	      }));

	      function importCert(_x23, _x24, _x25, _x26) {
	        return _importCert.apply(this, arguments);
	      }

	      return importCert;
	    }()
	  }, {
	    key: "keys",
	    value: function () {
	      var _keys = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee25() {
	        var proto, result, _keys2;

	        return regeneratorRuntime.wrap(function _callee25$(_context25) {
	          while (1) {
	            switch (_context25.prev = _context25.next) {
	              case 0:
	                proto = new CertificateStorageKeysActionProto();
	                proto.providerID = this.provider.id;
	                _context25.next = 4;
	                return this.provider.client.send(proto);

	              case 4:
	                result = _context25.sent;

	                if (!result) {
	                  _context25.next = 8;
	                  break;
	                }

	                _keys2 = Convert.ToUtf8String(result).split(",");
	                return _context25.abrupt("return", _keys2);

	              case 8:
	                return _context25.abrupt("return", []);

	              case 9:
	              case "end":
	                return _context25.stop();
	            }
	          }
	        }, _callee25, this);
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
	      regeneratorRuntime.mark(function _callee26(key, algorithm, keyUsages) {
	        var proto, result, certItem;
	        return regeneratorRuntime.wrap(function _callee26$(_context26) {
	          while (1) {
	            switch (_context26.prev = _context26.next) {
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

	                _context26.next = 8;
	                return this.provider.client.send(proto);

	              case 8:
	                result = _context26.sent;

	                if (!(result && result.byteLength)) {
	                  _context26.next = 14;
	                  break;
	                }

	                _context26.next = 12;
	                return CryptoCertificateProto.importProto(result);

	              case 12:
	                certItem = _context26.sent;
	                return _context26.abrupt("return", this.prepareCertItem(certItem));

	              case 14:
	                return _context26.abrupt("return", null);

	              case 15:
	              case "end":
	                return _context26.stop();
	            }
	          }
	        }, _callee26, this);
	      }));

	      function getItem(_x27, _x28, _x29) {
	        return _getItem.apply(this, arguments);
	      }

	      return getItem;
	    }()
	  }, {
	    key: "setItem",
	    value: function () {
	      var _setItem = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee27(value) {
	        var proto, data;
	        return regeneratorRuntime.wrap(function _callee27$(_context27) {
	          while (1) {
	            switch (_context27.prev = _context27.next) {
	              case 0:
	                checkCryptoCertificate(value, "value");
	                proto = new CertificateStorageSetItemActionProto();
	                proto.providerID = this.provider.id;
	                proto.item = value;
	                _context27.next = 6;
	                return this.provider.client.send(proto);

	              case 6:
	                data = _context27.sent;
	                return _context27.abrupt("return", Convert.ToUtf8String(data));

	              case 8:
	              case "end":
	                return _context27.stop();
	            }
	          }
	        }, _callee27, this);
	      }));

	      function setItem(_x30) {
	        return _setItem.apply(this, arguments);
	      }

	      return setItem;
	    }()
	  }, {
	    key: "removeItem",
	    value: function () {
	      var _removeItem = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee28(key) {
	        var proto;
	        return regeneratorRuntime.wrap(function _callee28$(_context28) {
	          while (1) {
	            switch (_context28.prev = _context28.next) {
	              case 0:
	                checkPrimitive(key, "string", "key");
	                proto = new CertificateStorageRemoveItemActionProto();
	                proto.providerID = this.provider.id;
	                proto.key = key;
	                _context28.next = 6;
	                return this.provider.client.send(proto);

	              case 6:
	              case "end":
	                return _context28.stop();
	            }
	          }
	        }, _callee28, this);
	      }));

	      function removeItem(_x31) {
	        return _removeItem.apply(this, arguments);
	      }

	      return removeItem;
	    }()
	  }, {
	    key: "clear",
	    value: function () {
	      var _clear = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee29() {
	        var proto;
	        return regeneratorRuntime.wrap(function _callee29$(_context29) {
	          while (1) {
	            switch (_context29.prev = _context29.next) {
	              case 0:
	                proto = new CertificateStorageClearActionProto();
	                proto.providerID = this.provider.id;
	                _context29.next = 4;
	                return this.provider.client.send(proto);

	              case 4:
	              case "end":
	                return _context29.stop();
	            }
	          }
	        }, _callee29, this);
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
	      regeneratorRuntime.mark(function _callee30(value) {
	        var proto, data, resultProto;
	        return regeneratorRuntime.wrap(function _callee30$(_context30) {
	          while (1) {
	            switch (_context30.prev = _context30.next) {
	              case 0:
	                checkCryptoCertificate(value, "value");
	                proto = new CertificateStorageGetChainActionProto();
	                proto.providerID = this.provider.id;
	                proto.item = value;
	                _context30.next = 6;
	                return this.provider.client.send(proto);

	              case 6:
	                data = _context30.sent;
	                _context30.next = 9;
	                return CertificateStorageGetChainResultProto.importProto(data);

	              case 9:
	                resultProto = _context30.sent;
	                return _context30.abrupt("return", resultProto.items);

	              case 11:
	              case "end":
	                return _context30.stop();
	            }
	          }
	        }, _callee30, this);
	      }));

	      function getChain(_x32) {
	        return _getChain.apply(this, arguments);
	      }

	      return getChain;
	    }()
	  }, {
	    key: "getCRL",
	    value: function () {
	      var _getCRL = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee31(url) {
	        var proto, data;
	        return regeneratorRuntime.wrap(function _callee31$(_context31) {
	          while (1) {
	            switch (_context31.prev = _context31.next) {
	              case 0:
	                checkPrimitive(url, "string", "url");
	                proto = new CertificateStorageGetCRLActionProto();
	                proto.providerID = this.provider.id;
	                proto.url = url;
	                _context31.next = 6;
	                return this.provider.client.send(proto);

	              case 6:
	                data = _context31.sent;
	                return _context31.abrupt("return", data);

	              case 8:
	              case "end":
	                return _context31.stop();
	            }
	          }
	        }, _callee31, this);
	      }));

	      function getCRL(_x33) {
	        return _getCRL.apply(this, arguments);
	      }

	      return getCRL;
	    }()
	  }, {
	    key: "getOCSP",
	    value: function () {
	      var _getOCSP = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee32(url, request, options) {
	        var proto, key, data;
	        return regeneratorRuntime.wrap(function _callee32$(_context32) {
	          while (1) {
	            switch (_context32.prev = _context32.next) {
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

	                _context32.next = 9;
	                return this.provider.client.send(proto);

	              case 9:
	                data = _context32.sent;
	                return _context32.abrupt("return", data);

	              case 11:
	              case "end":
	                return _context32.stop();
	            }
	          }
	        }, _callee32, this);
	      }));

	      function getOCSP(_x34, _x35, _x36) {
	        return _getOCSP.apply(this, arguments);
	      }

	      return getOCSP;
	    }()
	  }, {
	    key: "prepareCertItem",
	    value: function () {
	      var _prepareCertItem = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee33(item) {
	        var raw, result;
	        return regeneratorRuntime.wrap(function _callee33$(_context33) {
	          while (1) {
	            switch (_context33.prev = _context33.next) {
	              case 0:
	                _context33.next = 2;
	                return item.exportProto();

	              case 2:
	                raw = _context33.sent;
	                _context33.t0 = item.type;
	                _context33.next = _context33.t0 === "x509" ? 6 : _context33.t0 === "request" ? 10 : 14;
	                break;

	              case 6:
	                _context33.next = 8;
	                return CryptoX509CertificateProto.importProto(raw);

	              case 8:
	                result = _context33.sent;
	                return _context33.abrupt("break", 15);

	              case 10:
	                _context33.next = 12;
	                return CryptoX509CertificateRequestProto.importProto(raw);

	              case 12:
	                result = _context33.sent;
	                return _context33.abrupt("break", 15);

	              case 14:
	                throw new Error("Unsupported CertificateItem type '".concat(item.type, "'"));

	              case 15:
	                result.provider = this.provider;
	                return _context33.abrupt("return", result);

	              case 17:
	              case "end":
	                return _context33.stop();
	            }
	          }
	        }, _callee33, this);
	      }));

	      function prepareCertItem(_x37) {
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
	      regeneratorRuntime.mark(function _callee34() {
	        var proto, result, _keys4;

	        return regeneratorRuntime.wrap(function _callee34$(_context34) {
	          while (1) {
	            switch (_context34.prev = _context34.next) {
	              case 0:
	                proto = new KeyStorageKeysActionProto();
	                proto.providerID = this.service.id;
	                _context34.next = 4;
	                return this.service.client.send(proto);

	              case 4:
	                result = _context34.sent;

	                if (!result) {
	                  _context34.next = 8;
	                  break;
	                }

	                _keys4 = Convert.ToUtf8String(result).split(",");
	                return _context34.abrupt("return", _keys4);

	              case 8:
	                return _context34.abrupt("return", []);

	              case 9:
	              case "end":
	                return _context34.stop();
	            }
	          }
	        }, _callee34, this);
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
	      regeneratorRuntime.mark(function _callee35(item) {
	        var proto, result;
	        return regeneratorRuntime.wrap(function _callee35$(_context35) {
	          while (1) {
	            switch (_context35.prev = _context35.next) {
	              case 0:
	                checkCryptoKey(item, "item");
	                proto = new KeyStorageIndexOfActionProto();
	                proto.providerID = this.service.id;
	                proto.item = item;
	                _context35.next = 6;
	                return this.service.client.send(proto);

	              case 6:
	                result = _context35.sent;
	                return _context35.abrupt("return", result ? Convert.ToUtf8String(result) : null);

	              case 8:
	              case "end":
	                return _context35.stop();
	            }
	          }
	        }, _callee35, this);
	      }));

	      function indexOf(_x38) {
	        return _indexOf2.apply(this, arguments);
	      }

	      return indexOf;
	    }()
	  }, {
	    key: "hasItem",
	    value: function () {
	      var _hasItem2 = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee36(item) {
	        var index;
	        return regeneratorRuntime.wrap(function _callee36$(_context36) {
	          while (1) {
	            switch (_context36.prev = _context36.next) {
	              case 0:
	                _context36.next = 2;
	                return this.indexOf(item);

	              case 2:
	                index = _context36.sent;
	                return _context36.abrupt("return", !!index);

	              case 4:
	              case "end":
	                return _context36.stop();
	            }
	          }
	        }, _callee36, this);
	      }));

	      function hasItem(_x39) {
	        return _hasItem2.apply(this, arguments);
	      }

	      return hasItem;
	    }()
	  }, {
	    key: "getItem",
	    value: function () {
	      var _getItem2 = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee37(key, algorithm, extractable, usages) {
	        var proto, result, socketKey, keyProto;
	        return regeneratorRuntime.wrap(function _callee37$(_context37) {
	          while (1) {
	            switch (_context37.prev = _context37.next) {
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

	                _context37.next = 8;
	                return this.service.client.send(proto);

	              case 8:
	                result = _context37.sent;
	                socketKey = null;

	                if (!(result && result.byteLength)) {
	                  _context37.next = 15;
	                  break;
	                }

	                _context37.next = 13;
	                return CryptoKeyProto.importProto(result);

	              case 13:
	                keyProto = _context37.sent;
	                socketKey = keyProto;

	              case 15:
	                return _context37.abrupt("return", socketKey);

	              case 16:
	              case "end":
	                return _context37.stop();
	            }
	          }
	        }, _callee37, this);
	      }));

	      function getItem(_x40, _x41, _x42, _x43) {
	        return _getItem2.apply(this, arguments);
	      }

	      return getItem;
	    }()
	  }, {
	    key: "setItem",
	    value: function () {
	      var _setItem2 = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee38(value) {
	        var proto, data;
	        return regeneratorRuntime.wrap(function _callee38$(_context38) {
	          while (1) {
	            switch (_context38.prev = _context38.next) {
	              case 0:
	                checkCryptoKey(value, "value");
	                proto = new KeyStorageSetItemActionProto();
	                proto.providerID = this.service.id;
	                proto.item = value;
	                _context38.next = 6;
	                return this.service.client.send(proto);

	              case 6:
	                data = _context38.sent;
	                return _context38.abrupt("return", Convert.ToUtf8String(data));

	              case 8:
	              case "end":
	                return _context38.stop();
	            }
	          }
	        }, _callee38, this);
	      }));

	      function setItem(_x44) {
	        return _setItem2.apply(this, arguments);
	      }

	      return setItem;
	    }()
	  }, {
	    key: "removeItem",
	    value: function () {
	      var _removeItem2 = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee39(key) {
	        var proto;
	        return regeneratorRuntime.wrap(function _callee39$(_context39) {
	          while (1) {
	            switch (_context39.prev = _context39.next) {
	              case 0:
	                checkPrimitive(key, "string", "key");
	                proto = new KeyStorageRemoveItemActionProto();
	                proto.providerID = this.service.id;
	                proto.key = key;
	                _context39.next = 6;
	                return this.service.client.send(proto);

	              case 6:
	              case "end":
	                return _context39.stop();
	            }
	          }
	        }, _callee39, this);
	      }));

	      function removeItem(_x45) {
	        return _removeItem2.apply(this, arguments);
	      }

	      return removeItem;
	    }()
	  }, {
	    key: "clear",
	    value: function () {
	      var _clear2 = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee40() {
	        var proto;
	        return regeneratorRuntime.wrap(function _callee40$(_context40) {
	          while (1) {
	            switch (_context40.prev = _context40.next) {
	              case 0:
	                proto = new KeyStorageClearActionProto();
	                proto.providerID = this.service.id;
	                _context40.next = 4;
	                return this.service.client.send(proto);

	              case 4:
	              case "end":
	                return _context40.stop();
	            }
	          }
	        }, _callee40, this);
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

	var SubtleCrypto$1 =
	/*#__PURE__*/
	function () {
	  function SubtleCrypto(crypto) {
	    _classCallCheck(this, SubtleCrypto);

	    this.service = crypto;
	  }

	  _createClass(SubtleCrypto, [{
	    key: "encrypt",
	    value: function () {
	      var _encrypt = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee41(algorithm, key, data) {
	        return regeneratorRuntime.wrap(function _callee41$(_context41) {
	          while (1) {
	            switch (_context41.prev = _context41.next) {
	              case 0:
	                return _context41.abrupt("return", this.encryptData(algorithm, key, data, "encrypt"));

	              case 1:
	              case "end":
	                return _context41.stop();
	            }
	          }
	        }, _callee41, this);
	      }));

	      function encrypt(_x46, _x47, _x48) {
	        return _encrypt.apply(this, arguments);
	      }

	      return encrypt;
	    }()
	  }, {
	    key: "decrypt",
	    value: function () {
	      var _decrypt = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee42(algorithm, key, data) {
	        return regeneratorRuntime.wrap(function _callee42$(_context42) {
	          while (1) {
	            switch (_context42.prev = _context42.next) {
	              case 0:
	                return _context42.abrupt("return", this.encryptData(algorithm, key, data, "decrypt"));

	              case 1:
	              case "end":
	                return _context42.stop();
	            }
	          }
	        }, _callee42, this);
	      }));

	      function decrypt(_x49, _x50, _x51) {
	        return _decrypt.apply(this, arguments);
	      }

	      return decrypt;
	    }()
	  }, {
	    key: "deriveBits",
	    value: function () {
	      var _deriveBits = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee43(algorithm, baseKey, length) {
	        var algProto, action, result;
	        return regeneratorRuntime.wrap(function _callee43$(_context43) {
	          while (1) {
	            switch (_context43.prev = _context43.next) {
	              case 0:
	                checkAlgorithm(algorithm, "algorithm");
	                checkCryptoKey(baseKey, "baseKey");
	                checkPrimitive(length, "number", "length");
	                algProto = prepareAlgorithm(algorithm);
	                checkCryptoKey(algProto, "algorithm.public");
	                _context43.next = 7;
	                return Cast(algProto.public).exportProto();

	              case 7:
	                algProto.public = _context43.sent;
	                action = new DeriveBitsActionProto();
	                action.providerID = this.service.id;
	                action.algorithm = algProto;
	                action.key = baseKey;
	                action.length = length;
	                _context43.next = 15;
	                return this.service.client.send(action);

	              case 15:
	                result = _context43.sent;
	                return _context43.abrupt("return", result);

	              case 17:
	              case "end":
	                return _context43.stop();
	            }
	          }
	        }, _callee43, this);
	      }));

	      function deriveBits(_x52, _x53, _x54) {
	        return _deriveBits.apply(this, arguments);
	      }

	      return deriveBits;
	    }()
	  }, {
	    key: "deriveKey",
	    value: function () {
	      var _deriveKey = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee44(algorithm, baseKey, derivedKeyType, extractable, keyUsages) {
	        var algProto, algKeyType, action, result;
	        return regeneratorRuntime.wrap(function _callee44$(_context44) {
	          while (1) {
	            switch (_context44.prev = _context44.next) {
	              case 0:
	                checkAlgorithm(algorithm, "algorithm");
	                checkCryptoKey(baseKey, "baseKey");
	                checkAlgorithm(derivedKeyType, "algorithm");
	                checkPrimitive(extractable, "boolean", "extractable");
	                checkArray(keyUsages, "keyUsages");
	                algProto = prepareAlgorithm(algorithm);
	                checkCryptoKey(algProto, "algorithm.public");
	                _context44.next = 9;
	                return Cast(algProto.public).exportProto();

	              case 9:
	                algProto.public = _context44.sent;
	                algKeyType = prepareAlgorithm(derivedKeyType);
	                action = new DeriveKeyActionProto();
	                action.providerID = this.service.id;
	                action.algorithm = algProto;
	                action.derivedKeyType.fromAlgorithm(algKeyType);
	                action.key = baseKey;
	                action.extractable = extractable;
	                action.usage = keyUsages;
	                _context44.next = 20;
	                return this.service.client.send(action);

	              case 20:
	                result = _context44.sent;
	                _context44.next = 23;
	                return CryptoKeyProto.importProto(result);

	              case 23:
	                return _context44.abrupt("return", _context44.sent);

	              case 24:
	              case "end":
	                return _context44.stop();
	            }
	          }
	        }, _callee44, this);
	      }));

	      function deriveKey(_x55, _x56, _x57, _x58, _x59) {
	        return _deriveKey.apply(this, arguments);
	      }

	      return deriveKey;
	    }()
	  }, {
	    key: "digest",
	    value: function () {
	      var _digest = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee45(algorithm, data) {
	        var algProto, rawData, action, result;
	        return regeneratorRuntime.wrap(function _callee45$(_context45) {
	          while (1) {
	            switch (_context45.prev = _context45.next) {
	              case 0:
	                checkAlgorithm(algorithm, "algorithm");
	                checkBufferSource(data, "data");
	                algProto = prepareAlgorithm(algorithm);
	                rawData = BufferSourceConverter.toArrayBuffer(data);

	                if (!self.crypto) {
	                  _context45.next = 14;
	                  break;
	                }

	                _context45.prev = 5;
	                _context45.next = 8;
	                return self.crypto.subtle.digest(algorithm, rawData);

	              case 8:
	                return _context45.abrupt("return", _context45.sent);

	              case 11:
	                _context45.prev = 11;
	                _context45.t0 = _context45["catch"](5);
	                console.warn("Cannot do native digest for algorithm '".concat(algProto.name, "'"));

	              case 14:
	                action = new DigestActionProto();
	                action.algorithm = algProto;
	                action.data = rawData;
	                action.providerID = this.service.id;
	                _context45.next = 20;
	                return this.service.client.send(action);

	              case 20:
	                result = _context45.sent;
	                return _context45.abrupt("return", result);

	              case 22:
	              case "end":
	                return _context45.stop();
	            }
	          }
	        }, _callee45, this, [[5, 11]]);
	      }));

	      function digest(_x60, _x61) {
	        return _digest.apply(this, arguments);
	      }

	      return digest;
	    }()
	  }, {
	    key: "generateKey",
	    value: function () {
	      var _generateKey = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee46(algorithm, extractable, keyUsages) {
	        var algProto, action, result, keyPair, key;
	        return regeneratorRuntime.wrap(function _callee46$(_context46) {
	          while (1) {
	            switch (_context46.prev = _context46.next) {
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
	                _context46.next = 11;
	                return this.service.client.send(action);

	              case 11:
	                result = _context46.sent;
	                _context46.prev = 12;
	                _context46.next = 15;
	                return CryptoKeyPairProto.importProto(result);

	              case 15:
	                keyPair = _context46.sent;
	                return _context46.abrupt("return", keyPair);

	              case 19:
	                _context46.prev = 19;
	                _context46.t0 = _context46["catch"](12);
	                _context46.next = 23;
	                return CryptoKeyProto.importProto(result);

	              case 23:
	                key = _context46.sent;
	                return _context46.abrupt("return", key);

	              case 25:
	              case "end":
	                return _context46.stop();
	            }
	          }
	        }, _callee46, this, [[12, 19]]);
	      }));

	      function generateKey(_x62, _x63, _x64) {
	        return _generateKey.apply(this, arguments);
	      }

	      return generateKey;
	    }()
	  }, {
	    key: "exportKey",
	    value: function () {
	      var _exportKey = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee47(format, key) {
	        var action, result;
	        return regeneratorRuntime.wrap(function _callee47$(_context47) {
	          while (1) {
	            switch (_context47.prev = _context47.next) {
	              case 0:
	                checkPrimitive(format, "string", "format");
	                checkCryptoKey(key, "key");
	                action = new ExportKeyActionProto();
	                action.providerID = this.service.id;
	                action.format = format;
	                action.key = key;
	                _context47.next = 8;
	                return this.service.client.send(action);

	              case 8:
	                result = _context47.sent;

	                if (!(format === "jwk")) {
	                  _context47.next = 13;
	                  break;
	                }

	                return _context47.abrupt("return", JSON.parse(Convert.ToBinary(result)));

	              case 13:
	                return _context47.abrupt("return", result);

	              case 14:
	              case "end":
	                return _context47.stop();
	            }
	          }
	        }, _callee47, this);
	      }));

	      function exportKey(_x65, _x66) {
	        return _exportKey.apply(this, arguments);
	      }

	      return exportKey;
	    }()
	  }, {
	    key: "importKey",
	    value: function () {
	      var _importKey = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee48(format, keyData, algorithm, extractable, keyUsages) {
	        var algProto, preparedKeyData, action, result;
	        return regeneratorRuntime.wrap(function _callee48$(_context48) {
	          while (1) {
	            switch (_context48.prev = _context48.next) {
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
	                _context48.next = 15;
	                return this.service.client.send(action);

	              case 15:
	                result = _context48.sent;
	                _context48.next = 18;
	                return CryptoKeyProto.importProto(result);

	              case 18:
	                return _context48.abrupt("return", _context48.sent);

	              case 19:
	              case "end":
	                return _context48.stop();
	            }
	          }
	        }, _callee48, this);
	      }));

	      function importKey(_x67, _x68, _x69, _x70, _x71) {
	        return _importKey.apply(this, arguments);
	      }

	      return importKey;
	    }()
	  }, {
	    key: "sign",
	    value: function () {
	      var _sign = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee49(algorithm, key, data) {
	        var algProto, rawData, action, result;
	        return regeneratorRuntime.wrap(function _callee49$(_context49) {
	          while (1) {
	            switch (_context49.prev = _context49.next) {
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
	                _context49.next = 12;
	                return this.service.client.send(action);

	              case 12:
	                result = _context49.sent;
	                return _context49.abrupt("return", result);

	              case 14:
	              case "end":
	                return _context49.stop();
	            }
	          }
	        }, _callee49, this);
	      }));

	      function sign(_x72, _x73, _x74) {
	        return _sign.apply(this, arguments);
	      }

	      return sign;
	    }()
	  }, {
	    key: "verify",
	    value: function () {
	      var _verify = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee50(algorithm, key, signature, data) {
	        var algProto, rawSignature, rawData, action, result;
	        return regeneratorRuntime.wrap(function _callee50$(_context50) {
	          while (1) {
	            switch (_context50.prev = _context50.next) {
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
	                _context50.next = 15;
	                return this.service.client.send(action);

	              case 15:
	                result = _context50.sent;
	                return _context50.abrupt("return", !!new Uint8Array(result)[0]);

	              case 17:
	              case "end":
	                return _context50.stop();
	            }
	          }
	        }, _callee50, this);
	      }));

	      function verify(_x75, _x76, _x77, _x78) {
	        return _verify.apply(this, arguments);
	      }

	      return verify;
	    }()
	  }, {
	    key: "wrapKey",
	    value: function () {
	      var _wrapKey = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee51(format, key, wrappingKey, wrapAlgorithm) {
	        var wrapAlgProto, action, result;
	        return regeneratorRuntime.wrap(function _callee51$(_context51) {
	          while (1) {
	            switch (_context51.prev = _context51.next) {
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
	                _context51.next = 13;
	                return this.service.client.send(action);

	              case 13:
	                result = _context51.sent;
	                return _context51.abrupt("return", result);

	              case 15:
	              case "end":
	                return _context51.stop();
	            }
	          }
	        }, _callee51, this);
	      }));

	      function wrapKey(_x79, _x80, _x81, _x82) {
	        return _wrapKey.apply(this, arguments);
	      }

	      return wrapKey;
	    }()
	  }, {
	    key: "unwrapKey",
	    value: function () {
	      var _unwrapKey = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee52(format, wrappedKey, unwrappingKey, unwrapAlgorithm, unwrappedKeyAlgorithm, extractable, keyUsages) {
	        var unwrapAlgProto, unwrappedKeyAlgProto, rawWrappedKey, action, result;
	        return regeneratorRuntime.wrap(function _callee52$(_context52) {
	          while (1) {
	            switch (_context52.prev = _context52.next) {
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
	                _context52.next = 21;
	                return this.service.client.send(action);

	              case 21:
	                result = _context52.sent;
	                _context52.next = 24;
	                return CryptoKeyProto.importProto(result);

	              case 24:
	                return _context52.abrupt("return", _context52.sent);

	              case 25:
	              case "end":
	                return _context52.stop();
	            }
	          }
	        }, _callee52, this);
	      }));

	      function unwrapKey(_x83, _x84, _x85, _x86, _x87, _x88, _x89) {
	        return _unwrapKey.apply(this, arguments);
	      }

	      return unwrapKey;
	    }()
	  }, {
	    key: "encryptData",
	    value: function () {
	      var _encryptData = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee53(algorithm, key, data, type) {
	        var algProto, rawData, ActionClass, action, result;
	        return regeneratorRuntime.wrap(function _callee53$(_context53) {
	          while (1) {
	            switch (_context53.prev = _context53.next) {
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
	                _context53.next = 13;
	                return this.service.client.send(action);

	              case 13:
	                result = _context53.sent;
	                return _context53.abrupt("return", result);

	              case 15:
	              case "end":
	                return _context53.stop();
	            }
	          }
	        }, _callee53, this);
	      }));

	      function encryptData(_x90, _x91, _x92, _x93) {
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
	    this.subtle = new SubtleCrypto$1(this);
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
	      regeneratorRuntime.mark(function _callee54() {
	        var action;
	        return regeneratorRuntime.wrap(function _callee54$(_context54) {
	          while (1) {
	            switch (_context54.prev = _context54.next) {
	              case 0:
	                action = new LoginActionProto();
	                action.providerID = this.id;
	                return _context54.abrupt("return", this.client.send(action));

	              case 3:
	              case "end":
	                return _context54.stop();
	            }
	          }
	        }, _callee54, this);
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
	      regeneratorRuntime.mark(function _callee55() {
	        var action;
	        return regeneratorRuntime.wrap(function _callee55$(_context55) {
	          while (1) {
	            switch (_context55.prev = _context55.next) {
	              case 0:
	                action = new LogoutActionProto();
	                action.providerID = this.id;
	                return _context55.abrupt("return", this.client.send(action));

	              case 3:
	              case "end":
	                return _context55.stop();
	            }
	          }
	        }, _callee55, this);
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
	      regeneratorRuntime.mark(function _callee56() {
	        var action;
	        return regeneratorRuntime.wrap(function _callee56$(_context56) {
	          while (1) {
	            switch (_context56.prev = _context56.next) {
	              case 0:
	                action = new ResetActionProto();
	                action.providerID = this.id;
	                return _context56.abrupt("return", this.client.send(action));

	              case 3:
	              case "end":
	                return _context56.stop();
	            }
	          }
	        }, _callee56, this);
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
	      regeneratorRuntime.mark(function _callee57() {
	        var action, res;
	        return regeneratorRuntime.wrap(function _callee57$(_context57) {
	          while (1) {
	            switch (_context57.prev = _context57.next) {
	              case 0:
	                action = new IsLoggedInActionProto();
	                action.providerID = this.id;
	                _context57.next = 4;
	                return this.client.send(action);

	              case 4:
	                res = _context57.sent;
	                return _context57.abrupt("return", !!new Uint8Array(res)[0]);

	              case 6:
	              case "end":
	                return _context57.stop();
	            }
	          }
	        }, _callee57, this);
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
	function (_EventEmitter3) {
	  _inherits(SocketProvider, _EventEmitter3);

	  function SocketProvider() {
	    var _this19;

	    _classCallCheck(this, SocketProvider);

	    _this19 = _possibleConstructorReturn(this, _getPrototypeOf(SocketProvider).call(this));
	    _this19.client = new Client();
	    _this19.cardReader = new CardReader(_this19.client);
	    return _this19;
	  }

	  _createClass(SocketProvider, [{
	    key: "connect",
	    value: function connect(address) {
	      var _this20 = this;

	      this.client = new Client();
	      this.client.connect(address).on("error", function (e) {
	        _this20.emit("error", e.error);
	      }).on("event", function (proto) {
	        _asyncToGenerator(
	        /*#__PURE__*/
	        regeneratorRuntime.mark(function _callee58() {
	          var tokenProto, authProto;
	          return regeneratorRuntime.wrap(function _callee58$(_context58) {
	            while (1) {
	              switch (_context58.prev = _context58.next) {
	                case 0:
	                  _context58.t0 = proto.action;
	                  _context58.next = _context58.t0 === ProviderTokenEventProto.ACTION ? 3 : _context58.t0 === ProviderAuthorizedEventProto.ACTION ? 11 : 19;
	                  break;

	                case 3:
	                  _context58.t1 = ProviderTokenEventProto;
	                  _context58.next = 6;
	                  return proto.exportProto();

	                case 6:
	                  _context58.t2 = _context58.sent;
	                  _context58.next = 9;
	                  return _context58.t1.importProto.call(_context58.t1, _context58.t2);

	                case 9:
	                  tokenProto = _context58.sent;

	                  _this20.emit("token", tokenProto);

	                case 11:
	                  _context58.t3 = ProviderAuthorizedEventProto;
	                  _context58.next = 14;
	                  return proto.exportProto();

	                case 14:
	                  _context58.t4 = _context58.sent;
	                  _context58.next = 17;
	                  return _context58.t3.importProto.call(_context58.t3, _context58.t4);

	                case 17:
	                  authProto = _context58.sent;

	                  _this20.emit("auth", authProto);

	                case 19:
	                case "end":
	                  return _context58.stop();
	              }
	            }
	          }, _callee58, this);
	        }))();
	      }).on("listening", function (e) {
	        if (self.PV_WEBCRYPTO_SOCKET_LOG) {
	          console.info("Client:Listening", e.address);
	        }

	        _this20.emit("listening", address);
	      }).on("close", function (e) {
	        if (self.PV_WEBCRYPTO_SOCKET_LOG) {
	          console.info("Client:Closed: ".concat(e.description, " (code: ").concat(e.reasonCode, ")"));
	        }

	        _this20.emit("close", e.remoteAddress);
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
	      regeneratorRuntime.mark(function _callee59() {
	        var proto, result, infoProto;
	        return regeneratorRuntime.wrap(function _callee59$(_context59) {
	          while (1) {
	            switch (_context59.prev = _context59.next) {
	              case 0:
	                proto = new ProviderInfoActionProto();
	                _context59.next = 3;
	                return this.client.send(proto);

	              case 3:
	                result = _context59.sent;
	                _context59.next = 6;
	                return ProviderInfoProto.importProto(result);

	              case 6:
	                infoProto = _context59.sent;
	                return _context59.abrupt("return", infoProto);

	              case 8:
	              case "end":
	                return _context59.stop();
	            }
	          }
	        }, _callee59, this);
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
	      regeneratorRuntime.mark(function _callee60() {
	        return regeneratorRuntime.wrap(function _callee60$(_context60) {
	          while (1) {
	            switch (_context60.prev = _context60.next) {
	              case 0:
	                return _context60.abrupt("return", this.client.challenge());

	              case 1:
	              case "end":
	                return _context60.stop();
	            }
	          }
	        }, _callee60, this);
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
	      regeneratorRuntime.mark(function _callee61() {
	        return regeneratorRuntime.wrap(function _callee61$(_context61) {
	          while (1) {
	            switch (_context61.prev = _context61.next) {
	              case 0:
	                return _context61.abrupt("return", this.client.isLoggedIn());

	              case 1:
	              case "end":
	                return _context61.stop();
	            }
	          }
	        }, _callee61, this);
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
	      regeneratorRuntime.mark(function _callee62() {
	        return regeneratorRuntime.wrap(function _callee62$(_context62) {
	          while (1) {
	            switch (_context62.prev = _context62.next) {
	              case 0:
	                return _context62.abrupt("return", this.client.login());

	              case 1:
	              case "end":
	                return _context62.stop();
	            }
	          }
	        }, _callee62, this);
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
	      regeneratorRuntime.mark(function _callee63(cryptoID) {
	        var actionProto;
	        return regeneratorRuntime.wrap(function _callee63$(_context63) {
	          while (1) {
	            switch (_context63.prev = _context63.next) {
	              case 0:
	                actionProto = new ProviderGetCryptoActionProto();
	                actionProto.cryptoID = cryptoID;
	                _context63.next = 4;
	                return this.client.send(actionProto);

	              case 4:
	                return _context63.abrupt("return", new SocketCrypto(this.client, cryptoID));

	              case 5:
	              case "end":
	                return _context63.stop();
	            }
	          }
	        }, _callee63, this);
	      }));

	      function getCrypto(_x94) {
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

	exports.SocketProvider = SocketProvider;
	exports.setEngine = setEngine;
	exports.getEngine = getEngine;

	return exports;

}({}, protobuf));
