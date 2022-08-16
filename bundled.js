var DoubleIndexedKV = /** @class */ (function () {
    function DoubleIndexedKV() {
        this.keyToValue = new Map();
        this.valueToKey = new Map();
    }
    DoubleIndexedKV.prototype.set = function (key, value) {
        this.keyToValue.set(key, value);
        this.valueToKey.set(value, key);
    };
    DoubleIndexedKV.prototype.getByKey = function (key) {
        return this.keyToValue.get(key);
    };
    DoubleIndexedKV.prototype.getByValue = function (value) {
        return this.valueToKey.get(value);
    };
    DoubleIndexedKV.prototype.clear = function () {
        this.keyToValue.clear();
        this.valueToKey.clear();
    };
    return DoubleIndexedKV;
}());

var Registry = /** @class */ (function () {
    function Registry(generateIdentifier) {
        this.generateIdentifier = generateIdentifier;
        this.kv = new DoubleIndexedKV();
    }
    Registry.prototype.register = function (value, identifier) {
        if (this.kv.getByValue(value)) {
            return;
        }
        if (!identifier) {
            identifier = this.generateIdentifier(value);
        }
        if (process.env.NODE_ENV !== 'production') {
            var alreadyRegistered = this.kv.getByKey(identifier);
            if (alreadyRegistered && alreadyRegistered !== value) {
                console.debug("Ambiguous class \"" + identifier + "\", provide a unique identifier.");
            }
        }
        this.kv.set(identifier, value);
    };
    Registry.prototype.clear = function () {
        this.kv.clear();
    };
    Registry.prototype.getIdentifier = function (value) {
        return this.kv.getByValue(value);
    };
    Registry.prototype.getValue = function (identifier) {
        return this.kv.getByKey(identifier);
    };
    return Registry;
}());

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _ClassRegistry = /** @class */ (function (_super) {
    __extends(_ClassRegistry, _super);
    function _ClassRegistry() {
        var _this = _super.call(this, function (c) { return c.name; }) || this;
        _this.classToAllowedProps = new Map();
        return _this;
    }
    _ClassRegistry.prototype.register = function (value, options) {
        if (typeof options === 'object') {
            if (options.allowProps) {
                this.classToAllowedProps.set(value, options.allowProps);
            }
            _super.prototype.register.call(this, value, options.identifier);
        }
        else {
            _super.prototype.register.call(this, value, options);
        }
    };
    _ClassRegistry.prototype.getAllowedProps = function (value) {
        return this.classToAllowedProps.get(value);
    };
    return _ClassRegistry;
}(Registry));
var ClassRegistry = new _ClassRegistry();

var SymbolRegistry = new Registry(function (s) { var _a; return (_a = s.description) !== null && _a !== void 0 ? _a : ''; });

var __read$2 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
function valuesOfObj(record) {
    if ('values' in Object) {
        // eslint-disable-next-line es5/no-es6-methods
        return Object.values(record);
    }
    var values = [];
    // eslint-disable-next-line no-restricted-syntax
    for (var key in record) {
        if (record.hasOwnProperty(key)) {
            values.push(record[key]);
        }
    }
    return values;
}
function find(record, predicate) {
    var values = valuesOfObj(record);
    if ('find' in values) {
        // eslint-disable-next-line es5/no-es6-methods
        return values.find(predicate);
    }
    var valuesNotNever = values;
    for (var i = 0; i < valuesNotNever.length; i++) {
        var value = valuesNotNever[i];
        if (predicate(value)) {
            return value;
        }
    }
    return undefined;
}
function forEach(record, run) {
    Object.entries(record).forEach(function (_a) {
        var _b = __read$2(_a, 2), key = _b[0], value = _b[1];
        return run(value, key);
    });
}
function includes(arr, value) {
    return arr.indexOf(value) !== -1;
}

var transfomers = {};
var CustomTransformerRegistry = {
    register: function (transformer) {
        transfomers[transformer.name] = transformer;
    },
    findApplicable: function (v) {
        return find(transfomers, function (transformer) { return transformer.isApplicable(v); });
    },
    findByName: function (name) {
        return transfomers[name];
    }
};

(undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
(undefined && undefined.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var allowedErrorProps = [];

var getType$1 = function (payload) {
    return Object.prototype.toString.call(payload).slice(8, -1);
};
var isUndefined = function (payload) {
    return typeof payload === 'undefined';
};
var isPlainObject$1 = function (payload) {
    if (getType$1(payload) !== 'Object')
        return false;
    if (Object.getPrototypeOf(payload) === null)
        return true;
    if (payload === Object.prototype)
        return false;
    return (payload.constructor === Object &&
        Object.getPrototypeOf(payload) === Object.prototype);
};
var isArray$1 = function (payload) {
    return Array.isArray(payload);
};
var isRegExp = function (payload) {
    return payload instanceof RegExp;
};
var isMap = function (payload) {
    return payload instanceof Map;
};
var isSet = function (payload) {
    return payload instanceof Set;
};
var isSymbol = function (payload) {
    return getType$1(payload) === 'Symbol';
};
var isDate = function (payload) {
    return payload instanceof Date && !isNaN(payload.valueOf());
};
var isError = function (payload) {
    return payload instanceof Error;
};
var isNaNValue = function (payload) {
    return typeof payload === 'number' && isNaN(payload);
};
var isBigint = function (payload) {
    return typeof payload === 'bigint';
};
var isInfinite = function (payload) {
    return payload === Infinity || payload === -Infinity;
};
var isTypedArray = function (payload) {
    return ArrayBuffer.isView(payload) && !(payload instanceof DataView);
};

var parsePath = function (string) {
    var result = [];
    var segment = '';
    for (var i = 0; i < string.length; i++) {
        var char = string.charAt(i);
        var isEscapedDot = char === '\\' && string.charAt(i + 1) === '.';
        if (isEscapedDot) {
            segment += '.';
            i++;
            continue;
        }
        var isEndOfSegment = char === '.';
        if (isEndOfSegment) {
            result.push(segment);
            segment = '';
            continue;
        }
        segment += char;
    }
    var lastSegment = segment;
    result.push(lastSegment);
    return result;
};

var __assign$1 = (undefined && undefined.__assign) || function () {
    __assign$1 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$1.apply(this, arguments);
};
var __read$1 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray$1 = (undefined && undefined.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
function simpleTransformation(isApplicable, annotation, transform, untransform) {
    return {
        isApplicable: isApplicable,
        annotation: annotation,
        transform: transform,
        untransform: untransform
    };
}
var simpleRules = [
    simpleTransformation(isUndefined, 'undefined', function () { return null; }, function () { return undefined; }),
    simpleTransformation(isBigint, 'bigint', function (v) { return v.toString(); }, function (v) {
        if (typeof BigInt !== 'undefined') {
            return BigInt(v);
        }
        console.error('Please add a BigInt polyfill.');
        return v;
    }),
    simpleTransformation(isDate, 'Date', function (v) { return v.toISOString(); }, function (v) { return new Date(v); }),
    simpleTransformation(isError, 'Error', function (v) {
        var baseError = {
            name: v.name,
            message: v.message
        };
        allowedErrorProps.forEach(function (prop) {
            baseError[prop] = v[prop];
        });
        return baseError;
    }, function (v) {
        var e = new Error(v.message);
        e.name = v.name;
        e.stack = v.stack;
        allowedErrorProps.forEach(function (prop) {
            e[prop] = v[prop];
        });
        return e;
    }),
    simpleTransformation(isRegExp, 'regexp', function (v) { return '' + v; }, function (regex) {
        var body = regex.slice(1, regex.lastIndexOf('/'));
        var flags = regex.slice(regex.lastIndexOf('/') + 1);
        return new RegExp(body, flags);
    }),
    simpleTransformation(isSet, 'set', 
    // (sets only exist in es6+)
    // eslint-disable-next-line es5/no-es6-methods
    function (v) { return __spreadArray$1([], __read$1(v.values())); }, function (v) { return new Set(v); }),
    simpleTransformation(isMap, 'map', function (v) { return __spreadArray$1([], __read$1(v.entries())); }, function (v) { return new Map(v); }),
    simpleTransformation(function (v) { return isNaNValue(v) || isInfinite(v); }, 'number', function (v) {
        if (isNaNValue(v)) {
            return 'NaN';
        }
        if (v > 0) {
            return 'Infinity';
        }
        else {
            return '-Infinity';
        }
    }, Number),
    simpleTransformation(function (v) { return v === 0 && 1 / v === -Infinity; }, 'number', function () {
        return '-0';
    }, Number),
];
function compositeTransformation(isApplicable, annotation, transform, untransform) {
    return {
        isApplicable: isApplicable,
        annotation: annotation,
        transform: transform,
        untransform: untransform
    };
}
var symbolRule = compositeTransformation(function (s) {
    if (isSymbol(s)) {
        var isRegistered = !!SymbolRegistry.getIdentifier(s);
        return isRegistered;
    }
    return false;
}, function (s) {
    var identifier = SymbolRegistry.getIdentifier(s);
    return ['symbol', identifier];
}, function (v) { return v.description; }, function (_, a) {
    var value = SymbolRegistry.getValue(a[1]);
    if (!value) {
        throw new Error('Trying to deserialize unknown symbol');
    }
    return value;
});
var constructorToName = [
    Int8Array,
    Uint8Array,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    Float32Array,
    Float64Array,
    Uint8ClampedArray,
].reduce(function (obj, ctor) {
    obj[ctor.name] = ctor;
    return obj;
}, {});
var typedArrayRule = compositeTransformation(isTypedArray, function (v) { return ['typed-array', v.constructor.name]; }, function (v) { return __spreadArray$1([], __read$1(v)); }, function (v, a) {
    var ctor = constructorToName[a[1]];
    if (!ctor) {
        throw new Error('Trying to deserialize unknown typed array');
    }
    return new ctor(v);
});
function isInstanceOfRegisteredClass(potentialClass) {
    if (potentialClass === null || potentialClass === void 0 ? void 0 : potentialClass.constructor) {
        var isRegistered = !!ClassRegistry.getIdentifier(potentialClass.constructor);
        return isRegistered;
    }
    return false;
}
var classRule = compositeTransformation(isInstanceOfRegisteredClass, function (clazz) {
    var identifier = ClassRegistry.getIdentifier(clazz.constructor);
    return ['class', identifier];
}, function (clazz) {
    var allowedProps = ClassRegistry.getAllowedProps(clazz.constructor);
    if (!allowedProps) {
        return __assign$1({}, clazz);
    }
    var result = {};
    allowedProps.forEach(function (prop) {
        result[prop] = clazz[prop];
    });
    return result;
}, function (v, a) {
    var clazz = ClassRegistry.getValue(a[1]);
    if (!clazz) {
        throw new Error('Trying to deserialize unknown class - check https://github.com/blitz-js/superjson/issues/116#issuecomment-773996564');
    }
    return Object.assign(Object.create(clazz.prototype), v);
});
var customRule = compositeTransformation(function (value) {
    return !!CustomTransformerRegistry.findApplicable(value);
}, function (value) {
    var transformer = CustomTransformerRegistry.findApplicable(value);
    return ['custom', transformer.name];
}, function (value) {
    var transformer = CustomTransformerRegistry.findApplicable(value);
    return transformer.serialize(value);
}, function (v, a) {
    var transformer = CustomTransformerRegistry.findByName(a[1]);
    if (!transformer) {
        throw new Error('Trying to deserialize unknown custom value');
    }
    return transformer.deserialize(v);
});
var simpleRulesByAnnotation = {};
simpleRules.forEach(function (rule) {
    simpleRulesByAnnotation[rule.annotation] = rule;
});
var untransformValue = function (json, type) {
    if (isArray$1(type)) {
        switch (type[0]) {
            case 'symbol':
                return symbolRule.untransform(json, type);
            case 'class':
                return classRule.untransform(json, type);
            case 'custom':
                return customRule.untransform(json, type);
            case 'typed-array':
                return typedArrayRule.untransform(json, type);
            default:
                throw new Error('Unknown transformation: ' + type);
        }
    }
    else {
        var transformation = simpleRulesByAnnotation[type];
        if (!transformation) {
            throw new Error('Unknown transformation: ' + type);
        }
        return transformation.untransform(json);
    }
};

var getNthKey = function (value, n) {
    var keys = value.keys();
    while (n > 0) {
        keys.next();
        n--;
    }
    return keys.next().value;
};
function validatePath(path) {
    if (includes(path, '__proto__')) {
        throw new Error('__proto__ is not allowed as a property');
    }
    if (includes(path, 'prototype')) {
        throw new Error('prototype is not allowed as a property');
    }
    if (includes(path, 'constructor')) {
        throw new Error('constructor is not allowed as a property');
    }
}
var getDeep = function (object, path) {
    validatePath(path);
    path.forEach(function (key) {
        object = object[key];
    });
    return object;
};
var setDeep = function (object, path, mapper) {
    validatePath(path);
    if (path.length === 0) {
        return mapper(object);
    }
    var parent = object;
    for (var i = 0; i < path.length - 1; i++) {
        var key = path[i];
        if (isArray$1(parent)) {
            var index = +key;
            parent = parent[index];
        }
        else if (isPlainObject$1(parent)) {
            parent = parent[key];
        }
        else if (isSet(parent)) {
            var row = +key;
            parent = getNthKey(parent, row);
        }
        else if (isMap(parent)) {
            var isEnd = i === path.length - 2;
            if (isEnd) {
                break;
            }
            var row = +key;
            var type = +path[++i] === 0 ? 'key' : 'value';
            var keyOfRow = getNthKey(parent, row);
            switch (type) {
                case 'key':
                    parent = keyOfRow;
                    break;
                case 'value':
                    parent = parent.get(keyOfRow);
                    break;
            }
        }
    }
    var lastKey = path[path.length - 1];
    if (isArray$1(parent) || isPlainObject$1(parent)) {
        parent[lastKey] = mapper(parent[lastKey]);
    }
    if (isSet(parent)) {
        var oldValue = getNthKey(parent, +lastKey);
        var newValue = mapper(oldValue);
        if (oldValue !== newValue) {
            parent["delete"](oldValue);
            parent.add(newValue);
        }
    }
    if (isMap(parent)) {
        var row = +path[path.length - 2];
        var keyToRow = getNthKey(parent, row);
        var type = +lastKey === 0 ? 'key' : 'value';
        switch (type) {
            case 'key': {
                var newKey = mapper(keyToRow);
                parent.set(newKey, parent.get(keyToRow));
                if (newKey !== keyToRow) {
                    parent["delete"](keyToRow);
                }
                break;
            }
            case 'value': {
                parent.set(keyToRow, mapper(parent.get(keyToRow)));
                break;
            }
        }
    }
    return object;
};

var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
function traverse(tree, walker, origin) {
    if (origin === void 0) { origin = []; }
    if (!tree) {
        return;
    }
    if (!isArray$1(tree)) {
        forEach(tree, function (subtree, key) {
            return traverse(subtree, walker, __spreadArray(__spreadArray([], __read(origin)), __read(parsePath(key))));
        });
        return;
    }
    var _a = __read(tree, 2), nodeValue = _a[0], children = _a[1];
    if (children) {
        forEach(children, function (child, key) {
            traverse(child, walker, __spreadArray(__spreadArray([], __read(origin)), __read(parsePath(key))));
        });
    }
    walker(nodeValue, origin);
}
function applyValueAnnotations(plain, annotations) {
    traverse(annotations, function (type, path) {
        plain = setDeep(plain, path, function (v) { return untransformValue(v, type); });
    });
    return plain;
}
function applyReferentialEqualityAnnotations(plain, annotations) {
    function apply(identicalPaths, path) {
        var object = getDeep(plain, parsePath(path));
        identicalPaths.map(parsePath).forEach(function (identicalObjectPath) {
            plain = setDeep(plain, identicalObjectPath, function () { return object; });
        });
    }
    if (isArray$1(annotations)) {
        var _a = __read(annotations, 2), root = _a[0], other = _a[1];
        root.forEach(function (identicalPath) {
            plain = setDeep(plain, parsePath(identicalPath), function () { return plain; });
        });
        if (other) {
            forEach(other, apply);
        }
    }
    else {
        forEach(annotations, apply);
    }
    return plain;
}

/**
 * Returns the object type of the given payload
 *
 * @param {*} payload
 * @returns {string}
 */
function getType(payload) {
    return Object.prototype.toString.call(payload).slice(8, -1);
}
/**
 * Returns whether the payload is a plain JavaScript object (excluding special classes or objects with other prototypes)
 *
 * @param {*} payload
 * @returns {payload is PlainObject}
 */
function isPlainObject(payload) {
    if (getType(payload) !== 'Object')
        return false;
    return payload.constructor === Object && Object.getPrototypeOf(payload) === Object.prototype;
}
/**
 * Returns whether the payload is an array
 *
 * @param {any} payload
 * @returns {payload is any[]}
 */
function isArray(payload) {
    return getType(payload) === 'Array';
}

function assignProp(carry, key, newVal, originalObject, includeNonenumerable) {
    const propType = {}.propertyIsEnumerable.call(originalObject, key)
        ? 'enumerable'
        : 'nonenumerable';
    if (propType === 'enumerable')
        carry[key] = newVal;
    if (includeNonenumerable && propType === 'nonenumerable') {
        Object.defineProperty(carry, key, {
            value: newVal,
            enumerable: false,
            writable: true,
            configurable: true,
        });
    }
}
/**
 * Copy (clone) an object and all its props recursively to get rid of any prop referenced of the original object. Arrays are also cloned, however objects inside arrays are still linked.
 *
 * @export
 * @template T
 * @param {T} target Target can be anything
 * @param {Options} [options = {}] Options can be `props` or `nonenumerable`
 * @returns {T} the target with replaced values
 * @export
 */
function copy(target, options = {}) {
    if (isArray(target)) {
        return target.map((item) => copy(item, options));
    }
    if (!isPlainObject(target)) {
        return target;
    }
    const props = Object.getOwnPropertyNames(target);
    const symbols = Object.getOwnPropertySymbols(target);
    return [...props, ...symbols].reduce((carry, key) => {
        if (isArray(options.props) && !options.props.includes(key)) {
            return carry;
        }
        const val = target[key];
        const newVal = copy(val, options);
        assignProp(carry, key, newVal, target, options.nonenumerable);
        return carry;
    }, {});
}

var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var deserialize = function (payload) {
    var json = payload.json, meta = payload.meta;
    var result = copy(json);
    if (meta === null || meta === void 0 ? void 0 : meta.values) {
        result = applyValueAnnotations(result, meta.values);
    }
    if (meta === null || meta === void 0 ? void 0 : meta.referentialEqualities) {
        result = applyReferentialEqualityAnnotations(result, meta.referentialEqualities);
    }
    return result;
};

deserialize('{}');
