import { render, html } from 'lit-html';
import { equals, curry } from 'ramda';
import { BehaviorSubject } from 'https://unpkg.com/rxjs@7.5.5/dist/esm/internal/BehaviorSubject.js';

function createMetadataMethodsForProperty(metadataMap, kind, property, decoratorFinishedRef) {
  return {
    getMetadata: function (key) {
      assertNotFinished(decoratorFinishedRef, "getMetadata"), assertMetadataKey(key);
      var metadataForKey = metadataMap[key];
      if (void 0 !== metadataForKey) if (1 === kind) {
        var pub = metadataForKey.public;
        if (void 0 !== pub) return pub[property];
      } else if (2 === kind) {
        var priv = metadataForKey.private;
        if (void 0 !== priv) return priv.get(property);
      } else if (Object.hasOwnProperty.call(metadataForKey, "constructor")) return metadataForKey.constructor;
    },
    setMetadata: function (key, value) {
      assertNotFinished(decoratorFinishedRef, "setMetadata"), assertMetadataKey(key);
      var metadataForKey = metadataMap[key];

      if (void 0 === metadataForKey && (metadataForKey = metadataMap[key] = {}), 1 === kind) {
        var pub = metadataForKey.public;
        void 0 === pub && (pub = metadataForKey.public = {}), pub[property] = value;
      } else if (2 === kind) {
        var priv = metadataForKey.priv;
        void 0 === priv && (priv = metadataForKey.private = new Map()), priv.set(property, value);
      } else metadataForKey.constructor = value;
    }
  };
}

function convertMetadataMapToFinal(obj, metadataMap) {
  var parentMetadataMap = obj[Symbol.metadata || Symbol.for("Symbol.metadata")],
      metadataKeys = Object.getOwnPropertySymbols(metadataMap);

  if (0 !== metadataKeys.length) {
    for (var i = 0; i < metadataKeys.length; i++) {
      var key = metadataKeys[i],
          metaForKey = metadataMap[key],
          parentMetaForKey = parentMetadataMap ? parentMetadataMap[key] : null,
          pub = metaForKey.public,
          parentPub = parentMetaForKey ? parentMetaForKey.public : null;
      pub && parentPub && Object.setPrototypeOf(pub, parentPub);
      var priv = metaForKey.private;

      if (priv) {
        var privArr = Array.from(priv.values()),
            parentPriv = parentMetaForKey ? parentMetaForKey.private : null;
        parentPriv && (privArr = privArr.concat(parentPriv)), metaForKey.private = privArr;
      }

      parentMetaForKey && Object.setPrototypeOf(metaForKey, parentMetaForKey);
    }

    parentMetadataMap && Object.setPrototypeOf(metadataMap, parentMetadataMap), obj[Symbol.metadata || Symbol.for("Symbol.metadata")] = metadataMap;
  }
}

function createAddInitializerMethod(initializers, decoratorFinishedRef) {
  return function (initializer) {
    assertNotFinished(decoratorFinishedRef, "addInitializer"), assertCallable(initializer, "An initializer"), initializers.push(initializer);
  };
}

function memberDec(dec, name, desc, metadataMap, initializers, kind, isStatic, isPrivate, value) {
  var kindStr;

  switch (kind) {
    case 1:
      kindStr = "accessor";
      break;

    case 2:
      kindStr = "method";
      break;

    case 3:
      kindStr = "getter";
      break;

    case 4:
      kindStr = "setter";
      break;

    default:
      kindStr = "field";
  }

  var metadataKind,
      metadataName,
      ctx = {
    kind: kindStr,
    name: isPrivate ? "#" + name : name,
    isStatic: isStatic,
    isPrivate: isPrivate
  },
      decoratorFinishedRef = {
    v: !1
  };

  if (0 !== kind && (ctx.addInitializer = createAddInitializerMethod(initializers, decoratorFinishedRef)), isPrivate) {
    metadataKind = 2, metadataName = Symbol(name);
    var access = {};
    0 === kind ? (access.get = desc.get, access.set = desc.set) : 2 === kind ? access.get = function () {
      return desc.value;
    } : (1 !== kind && 3 !== kind || (access.get = function () {
      return desc.get.call(this);
    }), 1 !== kind && 4 !== kind || (access.set = function (v) {
      desc.set.call(this, v);
    })), ctx.access = access;
  } else metadataKind = 1, metadataName = name;

  try {
    return dec(value, Object.assign(ctx, createMetadataMethodsForProperty(metadataMap, metadataKind, metadataName, decoratorFinishedRef)));
  } finally {
    decoratorFinishedRef.v = !0;
  }
}

function assertNotFinished(decoratorFinishedRef, fnName) {
  if (decoratorFinishedRef.v) throw new Error("attempted to call " + fnName + " after decoration was finished");
}

function assertMetadataKey(key) {
  if ("symbol" != typeof key) throw new TypeError("Metadata keys must be symbols, received: " + key);
}

function assertCallable(fn, hint) {
  if ("function" != typeof fn) throw new TypeError(hint + " must be a function");
}

function assertValidReturnValue(kind, value) {
  var type = typeof value;

  if (1 === kind) {
    if ("object" !== type || null === value) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
    void 0 !== value.get && assertCallable(value.get, "accessor.get"), void 0 !== value.set && assertCallable(value.set, "accessor.set"), void 0 !== value.init && assertCallable(value.init, "accessor.init"), void 0 !== value.initializer && assertCallable(value.initializer, "accessor.initializer");
  } else if ("function" !== type) {
    var hint;
    throw hint = 0 === kind ? "field" : 10 === kind ? "class" : "method", new TypeError(hint + " decorators must return a function or void 0");
  }
}

function getInit(desc) {
  var initializer;
  return null == (initializer = desc.init) && (initializer = desc.initializer) && "undefined" != typeof console && console.warn(".initializer has been renamed to .init as of March 2022"), initializer;
}

function applyMemberDec(ret, base, decInfo, name, kind, isStatic, isPrivate, metadataMap, initializers) {
  var desc,
      initializer,
      value,
      newValue,
      get,
      set,
      decs = decInfo[0];
  if (isPrivate ? desc = 0 === kind || 1 === kind ? {
    get: decInfo[3],
    set: decInfo[4]
  } : 3 === kind ? {
    get: decInfo[3]
  } : 4 === kind ? {
    set: decInfo[3]
  } : {
    value: decInfo[3]
  } : 0 !== kind && (desc = Object.getOwnPropertyDescriptor(base, name)), 1 === kind ? value = {
    get: desc.get,
    set: desc.set
  } : 2 === kind ? value = desc.value : 3 === kind ? value = desc.get : 4 === kind && (value = desc.set), "function" == typeof decs) void 0 !== (newValue = memberDec(decs, name, desc, metadataMap, initializers, kind, isStatic, isPrivate, value)) && (assertValidReturnValue(kind, newValue), 0 === kind ? initializer = newValue : 1 === kind ? (initializer = getInit(newValue), get = newValue.get || value.get, set = newValue.set || value.set, value = {
    get: get,
    set: set
  }) : value = newValue);else for (var i = decs.length - 1; i >= 0; i--) {
    var newInit;
    if (void 0 !== (newValue = memberDec(decs[i], name, desc, metadataMap, initializers, kind, isStatic, isPrivate, value))) assertValidReturnValue(kind, newValue), 0 === kind ? newInit = newValue : 1 === kind ? (newInit = getInit(newValue), get = newValue.get || value.get, set = newValue.set || value.set, value = {
      get: get,
      set: set
    }) : value = newValue, void 0 !== newInit && (void 0 === initializer ? initializer = newInit : "function" == typeof initializer ? initializer = [initializer, newInit] : initializer.push(newInit));
  }

  if (0 === kind || 1 === kind) {
    if (void 0 === initializer) initializer = function (instance, init) {
      return init;
    };else if ("function" != typeof initializer) {
      var ownInitializers = initializer;

      initializer = function (instance, init) {
        for (var value = init, i = 0; i < ownInitializers.length; i++) value = ownInitializers[i].call(instance, value);

        return value;
      };
    } else {
      var originalInitializer = initializer;

      initializer = function (instance, init) {
        return originalInitializer.call(instance, init);
      };
    }
    ret.push(initializer);
  }

  0 !== kind && (1 === kind ? (desc.get = value.get, desc.set = value.set) : 2 === kind ? desc.value = value : 3 === kind ? desc.get = value : 4 === kind && (desc.set = value), isPrivate ? 1 === kind ? (ret.push(function (instance, args) {
    return value.get.call(instance, args);
  }), ret.push(function (instance, args) {
    return value.set.call(instance, args);
  })) : 2 === kind ? ret.push(value) : ret.push(function (instance, args) {
    return value.call(instance, args);
  }) : Object.defineProperty(base, name, desc));
}

function applyMemberDecs(ret, Class, protoMetadataMap, staticMetadataMap, decInfos) {
  for (var protoInitializers, staticInitializers, existingProtoNonFields = new Map(), existingStaticNonFields = new Map(), i = 0; i < decInfos.length; i++) {
    var decInfo = decInfos[i];

    if (Array.isArray(decInfo)) {
      var base,
          metadataMap,
          initializers,
          kind = decInfo[1],
          name = decInfo[2],
          isPrivate = decInfo.length > 3,
          isStatic = kind >= 5;

      if (isStatic ? (base = Class, metadataMap = staticMetadataMap, 0 !== (kind -= 5) && (initializers = staticInitializers = staticInitializers || [])) : (base = Class.prototype, metadataMap = protoMetadataMap, 0 !== kind && (initializers = protoInitializers = protoInitializers || [])), 0 !== kind && !isPrivate) {
        var existingNonFields = isStatic ? existingStaticNonFields : existingProtoNonFields,
            existingKind = existingNonFields.get(name) || 0;
        if (!0 === existingKind || 3 === existingKind && 4 !== kind || 4 === existingKind && 3 !== kind) throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + name);
        !existingKind && kind > 2 ? existingNonFields.set(name, kind) : existingNonFields.set(name, !0);
      }

      applyMemberDec(ret, base, decInfo, name, kind, isStatic, isPrivate, metadataMap, initializers);
    }
  }

  pushInitializers(ret, protoInitializers), pushInitializers(ret, staticInitializers);
}

function pushInitializers(ret, initializers) {
  initializers && ret.push(function (instance) {
    for (var i = 0; i < initializers.length; i++) initializers[i].call(instance);

    return instance;
  });
}

function applyClassDecs(ret, targetClass, metadataMap, classDecs) {
  if (classDecs.length > 0) {
    for (var initializers = [], newClass = targetClass, name = targetClass.name, i = classDecs.length - 1; i >= 0; i--) {
      var decoratorFinishedRef = {
        v: !1
      };

      try {
        var ctx = Object.assign({
          kind: "class",
          name: name,
          addInitializer: createAddInitializerMethod(initializers, decoratorFinishedRef)
        }, createMetadataMethodsForProperty(metadataMap, 0, name, decoratorFinishedRef)),
            nextNewClass = classDecs[i](newClass, ctx);
      } finally {
        decoratorFinishedRef.v = !0;
      }

      void 0 !== nextNewClass && (assertValidReturnValue(10, nextNewClass), newClass = nextNewClass);
    }

    ret.push(newClass, function () {
      for (var i = 0; i < initializers.length; i++) initializers[i].call(newClass);
    });
  }
}

function _applyDecs(targetClass, memberDecs, classDecs) {
  var ret = [],
      staticMetadataMap = {},
      protoMetadataMap = {};
  return applyMemberDecs(ret, targetClass, protoMetadataMap, staticMetadataMap, memberDecs), convertMetadataMapToFinal(targetClass.prototype, protoMetadataMap), applyClassDecs(ret, targetClass, staticMetadataMap, classDecs), convertMetadataMapToFinal(targetClass, staticMetadataMap), ret;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }

  return target;
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
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
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
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct.bind();
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
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get.bind();
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }

      return desc.value;
    };
  }

  return _get.apply(this, arguments);
}

function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = it.call(o);
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

function _classPrivateFieldGet(receiver, privateMap) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");

  return _classApplyDescriptorGet(receiver, descriptor);
}

function _classPrivateFieldSet(receiver, privateMap, value) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");

  _classApplyDescriptorSet(receiver, descriptor, value);

  return value;
}

function _classExtractFieldDescriptor(receiver, privateMap, action) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to " + action + " private field on non-instance");
  }

  return privateMap.get(receiver);
}

function _classApplyDescriptorGet(receiver, descriptor) {
  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }

  return descriptor.value;
}

function _classApplyDescriptorSet(receiver, descriptor, value) {
  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }

    descriptor.value = value;
  }
}

function _checkPrivateRedeclaration(obj, privateCollection) {
  if (privateCollection.has(obj)) {
    throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
}

function _classPrivateFieldInitSpec(obj, privateMap, value) {
  _checkPrivateRedeclaration(obj, privateMap);

  privateMap.set(obj, value);
}

var reactiveProperty = function reactiveProperty(object, key, initialValue) {
  var notify = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};
  object["_".concat(key)] = initialValue;
  Object.defineProperty(object, key, {
    get: function get() {
      return object["_".concat(key)];
    },
    set: function set(newValue) {
      if (object["_".concat(key)] !== newValue) {
        object["_".concat(key)] = newValue;
        notify();
      }
    }
  });
};
var reflectiveProperty = function reflectiveProperty(object, key) {
  Object.defineProperty(object, key, {
    get: function get() {
      return object.getAttribute(key);
    },
    enumerable: true
  });
};

var Hooks = new ( /*#__PURE__*/function () {
  function _class2() {
    _classCallCheck(this, _class2);

    _defineProperty(this, "elements", new Map());

    _defineProperty(this, "currentElement", void 0);

    _defineProperty(this, "hookKey", undefined);
  }

  _createClass(_class2, [{
    key: "findOrCreateHook",
    value: function findOrCreateHook() {
      var initialHook = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.hookKey++;
      var hooks = this.elements.get(this.currentElement);
      var hook = Array.from(hooks).hasOwnProperty(this.hookKey) ? Array.from(hooks)[this.hookKey] : _objectSpread2(_objectSpread2({}, initialHook), {}, {
        uid: "".concat(this.currentElement.tagName.toLowerCase(), ":hook:").concat(this.hookKey)
      });
      hooks.add(hook);
      return hook;
    }
  }, {
    key: "setElement",
    value: function setElement(element) {
      var hooks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Set();
      this.elements.set(element, hooks);
    }
  }, {
    key: "removeElement",
    value: function removeElement(element) {
      var hooks = this.elements.get(element);

      var _iterator = _createForOfIteratorHelper(hooks),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value$cleanup = _step.value.cleanup,
              cleanup = _step$value$cleanup === void 0 ? function () {} : _step$value$cleanup;
          cleanup();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      this.elements["delete"](element);
    }
  }, {
    key: "focusElement",
    value: function focusElement(element) {
      this.currentElement = element;
      this.hookKey = -1;
    }
  }, {
    key: "unfocusElement",
    value: function unfocusElement() {
      this.currentElement = undefined;
      this.hookKey = undefined;
    }
  }]);

  return _class2;
}())();
var useEffect = function useEffect(fn, deps) {
  var hook = Hooks.findOrCreateHook({
    deps: deps
  });

  var dependenciesMatch = function dependenciesMatch(prev, curr) {
    return Array.isArray(curr) && equals(prev, curr);
  };

  var hasCleanup = function hasCleanup(hook) {
    return typeof hook.cleanup === 'function';
  };

  if (!dependenciesMatch(hook.deps, deps) && hasCleanup(hook)) {
    hook.cleanup();
  } // If this is the first time running the hook or dependencies have changed


  if (!dependenciesMatch(hook.deps, deps) || !hasCleanup(hook)) {
    // defer until after render()
    setTimeout(function () {
      var cleanup = fn();
      hook.cleanup = typeof cleanup === 'function' ? cleanup : function () {};
      hook.deps = deps;
    }, 0);
  }
};

var ReactiveElement = /*#__PURE__*/function (_HTMLElement) {
  _inherits(ReactiveElement, _HTMLElement);

  var _super = _createSuper(ReactiveElement);

  function ReactiveElement() {
    var _this;

    _classCallCheck(this, ReactiveElement);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "state", {});

    _this.attachShadow({
      mode: 'open'
    });

    _this.constructor.observedAttributes.forEach(function (key) {
      return reflectiveProperty(_assertThisInitialized(_this), key);
    });

    return _this;
  }

  _createClass(ReactiveElement, [{
    key: "update",
    value: function update() {
      if (this.isConnected) {
        render(this.render(), this.shadowRoot);
      }
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      var _this2 = this;

      Object.entries(this.state).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        return reactiveProperty(_this2.state, key, value, _this2.update.bind(_this2));
      });
      this.update();
    }
  }, {
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(key, prev, curr) {
      if (prev !== curr) {
        this.update();
      }
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {}
  }], [{
    key: "observedAttributes",
    get: function get() {
      var _this$properties;

      return (_this$properties = this.properties) !== null && _this$properties !== void 0 ? _this$properties : [];
    }
  }]);

  return ReactiveElement;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement));
var reactiveElement = function reactiveElement(props, _render) {
  var _class;

  return _class = /*#__PURE__*/function (_ReactiveElement) {
    _inherits(_class, _ReactiveElement);

    var _super2 = _createSuper(_class);

    function _class() {
      _classCallCheck(this, _class);

      return _super2.apply(this, arguments);
    }

    _createClass(_class, [{
      key: "render",
      value: function render() {
        return _render(_objectSpread2(_objectSpread2({}, this), {}, {
          host: this
        }));
      }
    }, {
      key: "update",
      value: function update() {
        Hooks.focusElement(this);

        _get(_getPrototypeOf(_class.prototype), "update", this).call(this);

        Hooks.unfocusElement(this);
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        Hooks.setElement(this);

        _get(_getPrototypeOf(_class.prototype), "connectedCallback", this).call(this);
      }
    }, {
      key: "disconnectedCallback",
      value: function disconnectedCallback() {
        _get(_getPrototypeOf(_class.prototype), "disconnectedCallback", this).call(this);

        Hooks.removeElement(this);
      }
    }]);

    return _class;
  }(ReactiveElement), _defineProperty(_class, "properties", props), _class;
};

var _init_count, _initProto, _templateObject$4;

var reactive = function reactive(_ref) {
  var _get = _ref.get,
      _set = _ref.set;
  return {
    get: function get() {
      return _get.call(this);
    },
    set: function set(value) {
      setTimeout(this.update.bind(this), 0);
      return _set.call(this, value);
    },
    init: function init(value) {
      return value;
    }
  };
};

var _A = /*#__PURE__*/new WeakMap();

var Counter = /*#__PURE__*/function (_ReactiveElement) {
  _inherits(Counter, _ReactiveElement);

  var _super = _createSuper(Counter);

  function Counter() {
    var _this;

    _classCallCheck(this, Counter);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _A, {
      writable: true,
      value: (_initProto(_assertThisInitialized(_this)), _init_count(_assertThisInitialized(_this), 0))
    });

    return _this;
  }

  _createClass(Counter, [{
    key: "count",
    get: function get() {
      return _classPrivateFieldGet(this, _A);
    },
    set: function set(v) {
      _classPrivateFieldSet(this, _A, v);
    }
  }, {
    key: "increment",
    value: function increment() {
      this.count++;
    }
  }, {
    key: "decrement",
    value: function decrement() {
      this.count = this.count === 0 ? this.count : this.count - 1;
    }
  }, {
    key: "reset",
    value: function reset() {
      this.count = 0;
    }
  }, {
    key: "render",
    value: function render() {
      return html(_templateObject$4 || (_templateObject$4 = _taggedTemplateLiteral(["\n      <h1>Count: ", "</h1>\n      <button @click=\"", "\">Increment</button>\n      <button @click=\"", "\">Decrement</button>\n      <button @click=\"", "\">Reset</button>\n    "])), this.count, this.increment.bind(this), this.decrement.bind(this), this.reset.bind(this));
    }
  }]);

  return Counter;
}(ReactiveElement);

var _applyDecs2 = _applyDecs(Counter, [[reactive, 1, "count"]], []);

var _applyDecs3 = _slicedToArray(_applyDecs2, 2);

_init_count = _applyDecs3[0];
_initProto = _applyDecs3[1];
customElements.define('app-counter', Counter);

var persist = curry(function (storage, key, observable) {
  if (storage.getItem(key) !== null) {
    observable.next(JSON.parse(storage.getItem(key)));
  }

  observable.subscribe(function (value) {
    return storage.setItem(key, JSON.stringify(value));
  });
  return observable;
});

var form$ = new BehaviorSubject({
  origin: 'Worka, Ethiopia',
  roaster: 'Madcap Coffee Company'
});
var formStore = persist(sessionStorage, 'form', form$);
var settings$ = new BehaviorSubject({
  inputColor: 'green',
  labelColor: 'blue'
});
var settingsStore = persist(localStorage, 'settings', settings$);

var connect = curry(function (observable, mapStateToProps, clazz) {
  return /*#__PURE__*/function (_clazz) {
    _inherits(_class, _clazz);

    var _super = _createSuper(_class);

    function _class() {
      _classCallCheck(this, _class);

      return _super.apply(this, arguments);
    }

    _createClass(_class, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        var _this = this;

        Object.keys(mapStateToProps(observable.value)).forEach(function (key) {
          return Object.defineProperty(_this, key, {
            get: function get() {
              return mapStateToProps(observable.value)[key];
            },
            enumerable: true
          });
        });

        _get(_getPrototypeOf(_class.prototype), "connectedCallback", this).call(this);

        this["store:".concat(observable.toString(), ":subscription")] = observable.subscribe(this.update.bind(this));
      }
    }, {
      key: "disconnectedCallback",
      value: function disconnectedCallback() {
        _get(_getPrototypeOf(_class.prototype), "disconnectedCallback", this).call(this);

        this["store:".concat(observable.toString(), ":subscription")].unsubscribe();
      }
    }]);

    return _class;
  }(clazz);
});

var _templateObject$3;

var handleInput = function handleInput(event, host) {
  event.stopPropagation();
  host.dispatchEvent(new CustomEvent('input', {
    detail: event.target.value
  }));
};

var FormInput = reactiveElement(['label', 'value'], function (_ref) {
  var label = _ref.label,
      value = _ref.value,
      inputColor = _ref.inputColor,
      labelColor = _ref.labelColor,
      host = _ref.host;
  useEffect(function () {
    console.log('<form-input> mounting effect');
    return function () {
      return console.log('<form-input> unmounting effect');
    };
  });
  var id = label.toLowerCase();
  return html(_templateObject$3 || (_templateObject$3 = _taggedTemplateLiteral(["\n      <style>\n        label {\n          color: ", ";\n        }\n\n        input {\n          color: ", ";\n        }\n      </style>\n      <label for=\"", "\">", "</label>\n      <input\n        value=\"", "\"\n        id=\"", "\"\n        @input=\"", "\"\n      />\n    "])), labelColor, inputColor, id, label, value, id, function (event) {
    return handleInput(event, host);
  });
});
customElements.define('form-input', connect(settingsStore, function (_ref2) {
  var inputColor = _ref2.inputColor,
      labelColor = _ref2.labelColor;
  return {
    inputColor: inputColor,
    labelColor: labelColor
  };
}, FormInput));

var _templateObject$2;
var Form = /*#__PURE__*/function (_ReactiveElement) {
  _inherits(Form, _ReactiveElement);

  var _super = _createSuper(Form);

  function Form() {
    _classCallCheck(this, Form);

    return _super.apply(this, arguments);
  }

  _createClass(Form, [{
    key: "setOrigin",
    value: function setOrigin(origin) {
      this.dispatchEvent(new CustomEvent('store:form', {
        bubbles: true,
        detail: {
          origin: origin,
          roaster: this.roaster
        }
      }));
    }
  }, {
    key: "setRoaster",
    value: function setRoaster(roaster) {
      this.dispatchEvent(new CustomEvent('store:form', {
        bubbles: true,
        detail: {
          origin: this.origin,
          roaster: roaster
        }
      }));
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      return html(_templateObject$2 || (_templateObject$2 = _taggedTemplateLiteral(["\n      <form>\n        <form-input\n          label=\"Origin\"\n          value=\"", "\"\n          @input=\"", "\"\n        ></form-input>\n        <form-input\n          label=\"Roaster\"\n          value=\"", "\"\n          @input=\"", "\"\n        ></form-input>\n      </form>\n    "])), this.origin, function (event) {
        return _this.setOrigin(event.detail);
      }, this.roaster, function (event) {
        return _this.setRoaster(event.detail);
      });
    }
  }]);

  return Form;
}(ReactiveElement);
customElements.define('app-form', connect(formStore, function (_ref) {
  var origin = _ref.origin,
      roaster = _ref.roaster;
  return {
    origin: origin,
    roaster: roaster
  };
}, Form));

var _templateObject$1;
var Settings = /*#__PURE__*/function (_ReactiveElement) {
  _inherits(Settings, _ReactiveElement);

  var _super = _createSuper(Settings);

  function Settings() {
    _classCallCheck(this, Settings);

    return _super.apply(this, arguments);
  }

  _createClass(Settings, [{
    key: "setInputColor",
    value: function setInputColor(color) {
      this.dispatchEvent(new CustomEvent('store:settings', {
        bubbles: true,
        detail: {
          inputColor: color,
          labelColor: this.labelColor
        }
      }));
    }
  }, {
    key: "setLabelColor",
    value: function setLabelColor(color) {
      this.dispatchEvent(new CustomEvent('store:settings', {
        bubbles: true,
        detail: {
          inputColor: this.inputColor,
          labelColor: color
        }
      }));
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      return html(_templateObject$1 || (_templateObject$1 = _taggedTemplateLiteral(["\n      <form-input\n        label=\"Label color\"\n        value=\"", "\"\n        @input=\"", "\"\n      ></form-input>\n      <form-input\n        label=\"Input color\"\n        value=\"", "\"\n        @input=\"", "\"\n      ></form-input>\n    "])), this.labelColor, function (event) {
        return _this.setLabelColor(event.detail);
      }, this.inputColor, function (event) {
        return _this.setInputColor(event.detail);
      });
    }
  }]);

  return Settings;
}(ReactiveElement);
customElements.define('app-settings', connect(settingsStore, function (_ref) {
  var inputColor = _ref.inputColor,
      labelColor = _ref.labelColor;
  return {
    inputColor: inputColor,
    labelColor: labelColor
  };
}, Settings));

var _templateObject;
var Store = /*#__PURE__*/function (_ReactiveElement) {
  _inherits(Store, _ReactiveElement);

  var _super = _createSuper(Store);

  function Store() {
    _classCallCheck(this, Store);

    return _super.apply(this, arguments);
  }

  _createClass(Store, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      _get(_getPrototypeOf(Store.prototype), "connectedCallback", this).call(this);

      this.shadowRoot.addEventListener('store:form', function (_ref) {
        var detail = _ref.detail;
        return formStore.next(detail);
      });
      this.shadowRoot.addEventListener('store:settings', function (_ref2) {
        var detail = _ref2.detail;
        return settingsStore.next(detail);
      });
    }
  }, {
    key: "render",
    value: function render() {
      return html(_templateObject || (_templateObject = _taggedTemplateLiteral(["<slot></slot>"])));
    }
  }]);

  return Store;
}(ReactiveElement);
customElements.define('app-store', Store);
