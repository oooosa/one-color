window.__require = function e(t, i, r) {
function n(a, o) {
if (!i[a]) {
if (!t[a]) {
var c = a.split("/");
c = c[c.length - 1];
if (!t[c]) {
var h = "function" == typeof __require && __require;
if (!o && h) return h(c, !0);
if (s) return s(c, !0);
throw new Error("Cannot find module '" + a + "'");
}
}
var f = i[a] = {
exports: {}
};
t[a][0].call(f.exports, function(e) {
return n(t[a][1][e] || e);
}, f, f.exports, e, t, i, r);
}
return i[a].exports;
}
for (var s = "function" == typeof __require && __require, a = 0; a < r.length; a++) n(r[a]);
return n;
}({
"+1": [ function(e, t, i) {
"use strict";
cc._RF.push(t, "1a46eTXJG9A5ZnUOSMAQzDf", "+1");
var r = e("shifty");
cc.Class({
extends: cc.Component,
properties: {
verticalLength: 100,
time: 1
},
onLoad: function() {
this.time *= 2e3;
this.node.opacity = 0;
},
triggerAnimation: function() {
var e = this.node, t = {
from: {
x: this.node.x,
y: this.node.y,
opacity: 255
},
to: {
x: this.node.x,
y: this.node.y + this.verticalLength,
opacity: 0
},
duration: this.time,
easing: "easeOutQuad",
step: function(t) {
e.x = t.x;
e.y = t.y;
e.opacity = t.opacity;
}
};
r.tween(t).then(function() {
e.parent.removeChild(e);
});
}
});
cc._RF.pop();
}, {
shifty: "shifty"
} ],
1: [ function(e, t, i) {
var r = i;
r.bignum = e("bn.js");
r.define = e("./asn1/api").define;
r.base = e("./asn1/base");
r.constants = e("./asn1/constants");
r.decoders = e("./asn1/decoders");
r.encoders = e("./asn1/encoders");
}, {
"./asn1/api": 2,
"./asn1/base": 4,
"./asn1/constants": 8,
"./asn1/decoders": 10,
"./asn1/encoders": 13,
"bn.js": 16
} ],
2: [ function(e, t, i) {
var r = e("../asn1"), n = e("inherits");
i.define = function(e, t) {
return new s(e, t);
};
function s(e, t) {
this.name = e;
this.body = t;
this.decoders = {};
this.encoders = {};
}
s.prototype._createNamed = function(t) {
var i;
try {
i = e("vm").runInThisContext("(function " + this.name + "(entity) {\n  this._initNamed(entity);\n})");
} catch (e) {
i = function(e) {
this._initNamed(e);
};
}
n(i, t);
i.prototype._initNamed = function(e) {
t.call(this, e);
};
return new i(this);
};
s.prototype._getDecoder = function(e) {
e = e || "der";
this.decoders.hasOwnProperty(e) || (this.decoders[e] = this._createNamed(r.decoders[e]));
return this.decoders[e];
};
s.prototype.decode = function(e, t, i) {
return this._getDecoder(t).decode(e, i);
};
s.prototype._getEncoder = function(e) {
e = e || "der";
this.encoders.hasOwnProperty(e) || (this.encoders[e] = this._createNamed(r.encoders[e]));
return this.encoders[e];
};
s.prototype.encode = function(e, t, i) {
return this._getEncoder(t).encode(e, i);
};
}, {
"../asn1": 1,
inherits: 101,
vm: 155
} ],
3: [ function(e, t, i) {
var r = e("inherits"), n = e("../base").Reporter, s = e("buffer").Buffer;
function a(e, t) {
n.call(this, t);
if (s.isBuffer(e)) {
this.base = e;
this.offset = 0;
this.length = e.length;
} else this.error("Input not Buffer");
}
r(a, n);
i.DecoderBuffer = a;
a.prototype.save = function() {
return {
offset: this.offset,
reporter: n.prototype.save.call(this)
};
};
a.prototype.restore = function(e) {
var t = new a(this.base);
t.offset = e.offset;
t.length = this.offset;
this.offset = e.offset;
n.prototype.restore.call(this, e.reporter);
return t;
};
a.prototype.isEmpty = function() {
return this.offset === this.length;
};
a.prototype.readUInt8 = function(e) {
return this.offset + 1 <= this.length ? this.base.readUInt8(this.offset++, !0) : this.error(e || "DecoderBuffer overrun");
};
a.prototype.skip = function(e, t) {
if (!(this.offset + e <= this.length)) return this.error(t || "DecoderBuffer overrun");
var i = new a(this.base);
i._reporterState = this._reporterState;
i.offset = this.offset;
i.length = this.offset + e;
this.offset += e;
return i;
};
a.prototype.raw = function(e) {
return this.base.slice(e ? e.offset : this.offset, this.length);
};
function o(e, t) {
if (Array.isArray(e)) {
this.length = 0;
this.value = e.map(function(e) {
e instanceof o || (e = new o(e, t));
this.length += e.length;
return e;
}, this);
} else if ("number" == typeof e) {
if (!(0 <= e && e <= 255)) return t.error("non-byte EncoderBuffer value");
this.value = e;
this.length = 1;
} else if ("string" == typeof e) {
this.value = e;
this.length = s.byteLength(e);
} else {
if (!s.isBuffer(e)) return t.error("Unsupported type: " + typeof e);
this.value = e;
this.length = e.length;
}
}
i.EncoderBuffer = o;
o.prototype.join = function(e, t) {
e || (e = new s(this.length));
t || (t = 0);
if (0 === this.length) return e;
if (Array.isArray(this.value)) this.value.forEach(function(i) {
i.join(e, t);
t += i.length;
}); else {
"number" == typeof this.value ? e[t] = this.value : "string" == typeof this.value ? e.write(this.value, t) : s.isBuffer(this.value) && this.value.copy(e, t);
t += this.length;
}
return e;
};
}, {
"../base": 4,
buffer: 47,
inherits: 101
} ],
4: [ function(e, t, i) {
var r = i;
r.Reporter = e("./reporter").Reporter;
r.DecoderBuffer = e("./buffer").DecoderBuffer;
r.EncoderBuffer = e("./buffer").EncoderBuffer;
r.Node = e("./node");
}, {
"./buffer": 3,
"./node": 5,
"./reporter": 6
} ],
5: [ function(e, t, i) {
var r = e("../base").Reporter, n = e("../base").EncoderBuffer, s = e("../base").DecoderBuffer, a = e("minimalistic-assert"), o = [ "seq", "seqof", "set", "setof", "objid", "bool", "gentime", "utctime", "null_", "enum", "int", "objDesc", "bitstr", "bmpstr", "charstr", "genstr", "graphstr", "ia5str", "iso646str", "numstr", "octstr", "printstr", "t61str", "unistr", "utf8str", "videostr" ], c = [ "key", "obj", "use", "optional", "explicit", "implicit", "def", "choice", "any", "contains" ].concat(o);
function h(e, t) {
var i = {};
this._baseState = i;
i.enc = e;
i.parent = t || null;
i.children = null;
i.tag = null;
i.args = null;
i.reverseArgs = null;
i.choice = null;
i.optional = !1;
i.any = !1;
i.obj = !1;
i.use = null;
i.useDecoder = null;
i.key = null;
i.default = null;
i.explicit = null;
i.implicit = null;
i.contains = null;
if (!i.parent) {
i.children = [];
this._wrap();
}
}
t.exports = h;
var f = [ "enc", "parent", "children", "tag", "args", "reverseArgs", "choice", "optional", "any", "obj", "use", "alteredUse", "key", "default", "explicit", "implicit", "contains" ];
h.prototype.clone = function() {
var e = this._baseState, t = {};
f.forEach(function(i) {
t[i] = e[i];
});
var i = new this.constructor(t.parent);
i._baseState = t;
return i;
};
h.prototype._wrap = function() {
var e = this._baseState;
c.forEach(function(t) {
this[t] = function() {
var i = new this.constructor(this);
e.children.push(i);
return i[t].apply(i, arguments);
};
}, this);
};
h.prototype._init = function(e) {
var t = this._baseState;
a(null === t.parent);
e.call(this);
t.children = t.children.filter(function(e) {
return e._baseState.parent === this;
}, this);
a.equal(t.children.length, 1, "Root node can have only one child");
};
h.prototype._useArgs = function(e) {
var t = this._baseState, i = e.filter(function(e) {
return e instanceof this.constructor;
}, this);
e = e.filter(function(e) {
return !(e instanceof this.constructor);
}, this);
if (0 !== i.length) {
a(null === t.children);
t.children = i;
i.forEach(function(e) {
e._baseState.parent = this;
}, this);
}
if (0 !== e.length) {
a(null === t.args);
t.args = e;
t.reverseArgs = e.map(function(e) {
if ("object" != typeof e || e.constructor !== Object) return e;
var t = {};
Object.keys(e).forEach(function(i) {
i == (0 | i) && (i |= 0);
var r = e[i];
t[r] = i;
});
return t;
});
}
};
[ "_peekTag", "_decodeTag", "_use", "_decodeStr", "_decodeObjid", "_decodeTime", "_decodeNull", "_decodeInt", "_decodeBool", "_decodeList", "_encodeComposite", "_encodeStr", "_encodeObjid", "_encodeTime", "_encodeNull", "_encodeInt", "_encodeBool" ].forEach(function(e) {
h.prototype[e] = function() {
var t = this._baseState;
throw new Error(e + " not implemented for encoding: " + t.enc);
};
});
o.forEach(function(e) {
h.prototype[e] = function() {
var t = this._baseState, i = Array.prototype.slice.call(arguments);
a(null === t.tag);
t.tag = e;
this._useArgs(i);
return this;
};
});
h.prototype.use = function(e) {
a(e);
var t = this._baseState;
a(null === t.use);
t.use = e;
return this;
};
h.prototype.optional = function() {
this._baseState.optional = !0;
return this;
};
h.prototype.def = function(e) {
var t = this._baseState;
a(null === t.default);
t.default = e;
t.optional = !0;
return this;
};
h.prototype.explicit = function(e) {
var t = this._baseState;
a(null === t.explicit && null === t.implicit);
t.explicit = e;
return this;
};
h.prototype.implicit = function(e) {
var t = this._baseState;
a(null === t.explicit && null === t.implicit);
t.implicit = e;
return this;
};
h.prototype.obj = function() {
var e = this._baseState, t = Array.prototype.slice.call(arguments);
e.obj = !0;
0 !== t.length && this._useArgs(t);
return this;
};
h.prototype.key = function(e) {
var t = this._baseState;
a(null === t.key);
t.key = e;
return this;
};
h.prototype.any = function() {
this._baseState.any = !0;
return this;
};
h.prototype.choice = function(e) {
var t = this._baseState;
a(null === t.choice);
t.choice = e;
this._useArgs(Object.keys(e).map(function(t) {
return e[t];
}));
return this;
};
h.prototype.contains = function(e) {
var t = this._baseState;
a(null === t.use);
t.contains = e;
return this;
};
h.prototype._decode = function(e, t) {
var i = this._baseState;
if (null === i.parent) return e.wrapResult(i.children[0]._decode(e, t));
var r, n = i.default, a = !0, o = null;
null !== i.key && (o = e.enterKey(i.key));
if (i.optional) {
var c = null;
null !== i.explicit ? c = i.explicit : null !== i.implicit ? c = i.implicit : null !== i.tag && (c = i.tag);
if (null !== c || i.any) {
a = this._peekTag(e, c, i.any);
if (e.isError(a)) return a;
} else {
var h = e.save();
try {
null === i.choice ? this._decodeGeneric(i.tag, e, t) : this._decodeChoice(e, t);
a = !0;
} catch (e) {
a = !1;
}
e.restore(h);
}
}
i.obj && a && (r = e.enterObject());
if (a) {
if (null !== i.explicit) {
var f = this._decodeTag(e, i.explicit);
if (e.isError(f)) return f;
e = f;
}
var d = e.offset;
if (null === i.use && null === i.choice) {
if (i.any) h = e.save();
var u = this._decodeTag(e, null !== i.implicit ? i.implicit : i.tag, i.any);
if (e.isError(u)) return u;
i.any ? n = e.raw(h) : e = u;
}
t && t.track && null !== i.tag && t.track(e.path(), d, e.length, "tagged");
t && t.track && null !== i.tag && t.track(e.path(), e.offset, e.length, "content");
n = i.any ? n : null === i.choice ? this._decodeGeneric(i.tag, e, t) : this._decodeChoice(e, t);
if (e.isError(n)) return n;
i.any || null !== i.choice || null === i.children || i.children.forEach(function(i) {
i._decode(e, t);
});
if (i.contains && ("octstr" === i.tag || "bitstr" === i.tag)) {
var l = new s(n);
n = this._getUse(i.contains, e._reporterState.obj)._decode(l, t);
}
}
i.obj && a && (n = e.leaveObject(r));
null === i.key || null === n && !0 !== a ? null !== o && e.exitKey(o) : e.leaveKey(o, i.key, n);
return n;
};
h.prototype._decodeGeneric = function(e, t, i) {
var r = this._baseState;
return "seq" === e || "set" === e ? null : "seqof" === e || "setof" === e ? this._decodeList(t, e, r.args[0], i) : /str$/.test(e) ? this._decodeStr(t, e, i) : "objid" === e && r.args ? this._decodeObjid(t, r.args[0], r.args[1], i) : "objid" === e ? this._decodeObjid(t, null, null, i) : "gentime" === e || "utctime" === e ? this._decodeTime(t, e, i) : "null_" === e ? this._decodeNull(t, i) : "bool" === e ? this._decodeBool(t, i) : "objDesc" === e ? this._decodeStr(t, e, i) : "int" === e || "enum" === e ? this._decodeInt(t, r.args && r.args[0], i) : null !== r.use ? this._getUse(r.use, t._reporterState.obj)._decode(t, i) : t.error("unknown tag: " + e);
};
h.prototype._getUse = function(e, t) {
var i = this._baseState;
i.useDecoder = this._use(e, t);
a(null === i.useDecoder._baseState.parent);
i.useDecoder = i.useDecoder._baseState.children[0];
if (i.implicit !== i.useDecoder._baseState.implicit) {
i.useDecoder = i.useDecoder.clone();
i.useDecoder._baseState.implicit = i.implicit;
}
return i.useDecoder;
};
h.prototype._decodeChoice = function(e, t) {
var i = this._baseState, r = null, n = !1;
Object.keys(i.choice).some(function(s) {
var a = e.save(), o = i.choice[s];
try {
var c = o._decode(e, t);
if (e.isError(c)) return !1;
r = {
type: s,
value: c
};
n = !0;
} catch (t) {
e.restore(a);
return !1;
}
return !0;
}, this);
return n ? r : e.error("Choice not matched");
};
h.prototype._createEncoderBuffer = function(e) {
return new n(e, this.reporter);
};
h.prototype._encode = function(e, t, i) {
var r = this._baseState;
if (null === r.default || r.default !== e) {
var n = this._encodeValue(e, t, i);
if (void 0 !== n && !this._skipDefault(n, t, i)) return n;
}
};
h.prototype._encodeValue = function(e, t, i) {
var n = this._baseState;
if (null === n.parent) return n.children[0]._encode(e, t || new r());
var s = null;
this.reporter = t;
if (n.optional && void 0 === e) {
if (null === n.default) return;
e = n.default;
}
var a = null, o = !1;
if (n.any) s = this._createEncoderBuffer(e); else if (n.choice) s = this._encodeChoice(e, t); else if (n.contains) {
a = this._getUse(n.contains, i)._encode(e, t);
o = !0;
} else if (n.children) {
a = n.children.map(function(i) {
if ("null_" === i._baseState.tag) return i._encode(null, t, e);
if (null === i._baseState.key) return t.error("Child should have a key");
var r = t.enterKey(i._baseState.key);
if ("object" != typeof e) return t.error("Child expected, but input is not object");
var n = i._encode(e[i._baseState.key], t, e);
t.leaveKey(r);
return n;
}, this).filter(function(e) {
return e;
});
a = this._createEncoderBuffer(a);
} else if ("seqof" === n.tag || "setof" === n.tag) {
if (!n.args || 1 !== n.args.length) return t.error("Too many args for : " + n.tag);
if (!Array.isArray(e)) return t.error("seqof/setof, but data is not Array");
var c = this.clone();
c._baseState.implicit = null;
a = this._createEncoderBuffer(e.map(function(i) {
var r = this._baseState;
return this._getUse(r.args[0], e)._encode(i, t);
}, c));
} else if (null !== n.use) s = this._getUse(n.use, i)._encode(e, t); else {
a = this._encodePrimitive(n.tag, e);
o = !0;
}
if (!n.any && null === n.choice) {
var h = null !== n.implicit ? n.implicit : n.tag, f = null === n.implicit ? "universal" : "context";
null === h ? null === n.use && t.error("Tag could be omitted only for .use()") : null === n.use && (s = this._encodeComposite(h, o, f, a));
}
null !== n.explicit && (s = this._encodeComposite(n.explicit, !1, "context", s));
return s;
};
h.prototype._encodeChoice = function(e, t) {
var i = this._baseState, r = i.choice[e.type];
r || a(!1, e.type + " not found in " + JSON.stringify(Object.keys(i.choice)));
return r._encode(e.value, t);
};
h.prototype._encodePrimitive = function(e, t) {
var i = this._baseState;
if (/str$/.test(e)) return this._encodeStr(t, e);
if ("objid" === e && i.args) return this._encodeObjid(t, i.reverseArgs[0], i.args[1]);
if ("objid" === e) return this._encodeObjid(t, null, null);
if ("gentime" === e || "utctime" === e) return this._encodeTime(t, e);
if ("null_" === e) return this._encodeNull();
if ("int" === e || "enum" === e) return this._encodeInt(t, i.args && i.reverseArgs[0]);
if ("bool" === e) return this._encodeBool(t);
if ("objDesc" === e) return this._encodeStr(t, e);
throw new Error("Unsupported tag: " + e);
};
h.prototype._isNumstr = function(e) {
return /^[0-9 ]*$/.test(e);
};
h.prototype._isPrintstr = function(e) {
return /^[A-Za-z0-9 '\(\)\+,\-\.\/:=\?]*$/.test(e);
};
}, {
"../base": 4,
"minimalistic-assert": 105
} ],
6: [ function(e, t, i) {
var r = e("inherits");
function n(e) {
this._reporterState = {
obj: null,
path: [],
options: e || {},
errors: []
};
}
i.Reporter = n;
n.prototype.isError = function(e) {
return e instanceof s;
};
n.prototype.save = function() {
var e = this._reporterState;
return {
obj: e.obj,
pathLen: e.path.length
};
};
n.prototype.restore = function(e) {
var t = this._reporterState;
t.obj = e.obj;
t.path = t.path.slice(0, e.pathLen);
};
n.prototype.enterKey = function(e) {
return this._reporterState.path.push(e);
};
n.prototype.exitKey = function(e) {
var t = this._reporterState;
t.path = t.path.slice(0, e - 1);
};
n.prototype.leaveKey = function(e, t, i) {
var r = this._reporterState;
this.exitKey(e);
null !== r.obj && (r.obj[t] = i);
};
n.prototype.path = function() {
return this._reporterState.path.join("/");
};
n.prototype.enterObject = function() {
var e = this._reporterState, t = e.obj;
e.obj = {};
return t;
};
n.prototype.leaveObject = function(e) {
var t = this._reporterState, i = t.obj;
t.obj = e;
return i;
};
n.prototype.error = function(e) {
var t, i = this._reporterState, r = e instanceof s;
t = r ? e : new s(i.path.map(function(e) {
return "[" + JSON.stringify(e) + "]";
}).join(""), e.message || e, e.stack);
if (!i.options.partial) throw t;
r || i.errors.push(t);
return t;
};
n.prototype.wrapResult = function(e) {
var t = this._reporterState;
return t.options.partial ? {
result: this.isError(e) ? null : e,
errors: t.errors
} : e;
};
function s(e, t) {
this.path = e;
this.rethrow(t);
}
r(s, Error);
s.prototype.rethrow = function(e) {
this.message = e + " at: " + (this.path || "(shallow)");
Error.captureStackTrace && Error.captureStackTrace(this, s);
if (!this.stack) try {
throw new Error(this.message);
} catch (e) {
this.stack = e.stack;
}
return this;
};
}, {
inherits: 101
} ],
7: [ function(e, t, i) {
var r = e("../constants");
i.tagClass = {
0: "universal",
1: "application",
2: "context",
3: "private"
};
i.tagClassByName = r._reverse(i.tagClass);
i.tag = {
0: "end",
1: "bool",
2: "int",
3: "bitstr",
4: "octstr",
5: "null_",
6: "objid",
7: "objDesc",
8: "external",
9: "real",
10: "enum",
11: "embed",
12: "utf8str",
13: "relativeOid",
16: "seq",
17: "set",
18: "numstr",
19: "printstr",
20: "t61str",
21: "videostr",
22: "ia5str",
23: "utctime",
24: "gentime",
25: "graphstr",
26: "iso646str",
27: "genstr",
28: "unistr",
29: "charstr",
30: "bmpstr"
};
i.tagByName = r._reverse(i.tag);
}, {
"../constants": 8
} ],
8: [ function(e, t, i) {
var r = i;
r._reverse = function(e) {
var t = {};
Object.keys(e).forEach(function(i) {
(0 | i) == i && (i |= 0);
var r = e[i];
t[r] = i;
});
return t;
};
r.der = e("./der");
}, {
"./der": 7
} ],
9: [ function(e, t, i) {
var r = e("inherits"), n = e("../../asn1"), s = n.base, a = n.bignum, o = n.constants.der;
function c(e) {
this.enc = "der";
this.name = e.name;
this.entity = e;
this.tree = new h();
this.tree._init(e.body);
}
t.exports = c;
c.prototype.decode = function(e, t) {
e instanceof s.DecoderBuffer || (e = new s.DecoderBuffer(e, t));
return this.tree._decode(e, t);
};
function h(e) {
s.Node.call(this, "der", e);
}
r(h, s.Node);
h.prototype._peekTag = function(e, t, i) {
if (e.isEmpty()) return !1;
var r = e.save(), n = f(e, 'Failed to peek tag: "' + t + '"');
if (e.isError(n)) return n;
e.restore(r);
return n.tag === t || n.tagStr === t || n.tagStr + "of" === t || i;
};
h.prototype._decodeTag = function(e, t, i) {
var r = f(e, 'Failed to decode tag of "' + t + '"');
if (e.isError(r)) return r;
var n = d(e, r.primitive, 'Failed to get length of "' + t + '"');
if (e.isError(n)) return n;
if (!i && r.tag !== t && r.tagStr !== t && r.tagStr + "of" !== t) return e.error('Failed to match tag: "' + t + '"');
if (r.primitive || null !== n) return e.skip(n, 'Failed to match body of: "' + t + '"');
var s = e.save(), a = this._skipUntilEnd(e, 'Failed to skip indefinite length body: "' + this.tag + '"');
if (e.isError(a)) return a;
n = e.offset - s.offset;
e.restore(s);
return e.skip(n, 'Failed to match body of: "' + t + '"');
};
h.prototype._skipUntilEnd = function(e, t) {
for (;;) {
var i = f(e, t);
if (e.isError(i)) return i;
var r, n = d(e, i.primitive, t);
if (e.isError(n)) return n;
r = i.primitive || null !== n ? e.skip(n) : this._skipUntilEnd(e, t);
if (e.isError(r)) return r;
if ("end" === i.tagStr) break;
}
};
h.prototype._decodeList = function(e, t, i, r) {
for (var n = []; !e.isEmpty(); ) {
var s = this._peekTag(e, "end");
if (e.isError(s)) return s;
var a = i.decode(e, "der", r);
if (e.isError(a) && s) break;
n.push(a);
}
return n;
};
h.prototype._decodeStr = function(e, t) {
if ("bitstr" === t) {
var i = e.readUInt8();
return e.isError(i) ? i : {
unused: i,
data: e.raw()
};
}
if ("bmpstr" === t) {
var r = e.raw();
if (r.length % 2 == 1) return e.error("Decoding of string type: bmpstr length mismatch");
for (var n = "", s = 0; s < r.length / 2; s++) n += String.fromCharCode(r.readUInt16BE(2 * s));
return n;
}
if ("numstr" === t) {
var a = e.raw().toString("ascii");
return this._isNumstr(a) ? a : e.error("Decoding of string type: numstr unsupported characters");
}
if ("octstr" === t) return e.raw();
if ("objDesc" === t) return e.raw();
if ("printstr" === t) {
var o = e.raw().toString("ascii");
return this._isPrintstr(o) ? o : e.error("Decoding of string type: printstr unsupported characters");
}
return /str$/.test(t) ? e.raw().toString() : e.error("Decoding of string type: " + t + " unsupported");
};
h.prototype._decodeObjid = function(e, t, i) {
for (var r, n = [], s = 0; !e.isEmpty(); ) {
var a = e.readUInt8();
s <<= 7;
s |= 127 & a;
if (0 == (128 & a)) {
n.push(s);
s = 0;
}
}
128 & a && n.push(s);
var o = n[0] / 40 | 0, c = n[0] % 40;
r = i ? n : [ o, c ].concat(n.slice(1));
if (t) {
var h = t[r.join(" ")];
void 0 === h && (h = t[r.join(".")]);
void 0 !== h && (r = h);
}
return r;
};
h.prototype._decodeTime = function(e, t) {
var i = e.raw().toString();
if ("gentime" === t) var r = 0 | i.slice(0, 4), n = 0 | i.slice(4, 6), s = 0 | i.slice(6, 8), a = 0 | i.slice(8, 10), o = 0 | i.slice(10, 12), c = 0 | i.slice(12, 14); else {
if ("utctime" !== t) return e.error("Decoding " + t + " time is not supported yet");
r = 0 | i.slice(0, 2), n = 0 | i.slice(2, 4), s = 0 | i.slice(4, 6), a = 0 | i.slice(6, 8), 
o = 0 | i.slice(8, 10), c = 0 | i.slice(10, 12);
r = r < 70 ? 2e3 + r : 1900 + r;
}
return Date.UTC(r, n - 1, s, a, o, c, 0);
};
h.prototype._decodeNull = function(e) {
return null;
};
h.prototype._decodeBool = function(e) {
var t = e.readUInt8();
return e.isError(t) ? t : 0 !== t;
};
h.prototype._decodeInt = function(e, t) {
var i = e.raw(), r = new a(i);
t && (r = t[r.toString(10)] || r);
return r;
};
h.prototype._use = function(e, t) {
"function" == typeof e && (e = e(t));
return e._getDecoder("der").tree;
};
function f(e, t) {
var i = e.readUInt8(t);
if (e.isError(i)) return i;
var r = o.tagClass[i >> 6], n = 0 == (32 & i);
if (31 == (31 & i)) {
var s = i;
i = 0;
for (;128 == (128 & s); ) {
s = e.readUInt8(t);
if (e.isError(s)) return s;
i <<= 7;
i |= 127 & s;
}
} else i &= 31;
return {
cls: r,
primitive: n,
tag: i,
tagStr: o.tag[i]
};
}
function d(e, t, i) {
var r = e.readUInt8(i);
if (e.isError(r)) return r;
if (!t && 128 === r) return null;
if (0 == (128 & r)) return r;
var n = 127 & r;
if (n > 4) return e.error("length octect is too long");
r = 0;
for (var s = 0; s < n; s++) {
r <<= 8;
var a = e.readUInt8(i);
if (e.isError(a)) return a;
r |= a;
}
return r;
}
}, {
"../../asn1": 1,
inherits: 101
} ],
10: [ function(e, t, i) {
var r = i;
r.der = e("./der");
r.pem = e("./pem");
}, {
"./der": 9,
"./pem": 11
} ],
11: [ function(e, t, i) {
var r = e("inherits"), n = e("buffer").Buffer, s = e("./der");
function a(e) {
s.call(this, e);
this.enc = "pem";
}
r(a, s);
t.exports = a;
a.prototype.decode = function(e, t) {
for (var i = e.toString().split(/[\r\n]+/g), r = t.label.toUpperCase(), a = /^-----(BEGIN|END) ([^-]+)-----$/, o = -1, c = -1, h = 0; h < i.length; h++) {
var f = i[h].match(a);
if (null !== f && f[2] === r) {
if (-1 !== o) {
if ("END" !== f[1]) break;
c = h;
break;
}
if ("BEGIN" !== f[1]) break;
o = h;
}
}
if (-1 === o || -1 === c) throw new Error("PEM section not found for: " + r);
var d = i.slice(o + 1, c).join("");
d.replace(/[^a-z0-9\+\/=]+/gi, "");
var u = new n(d, "base64");
return s.prototype.decode.call(this, u, t);
};
}, {
"./der": 9,
buffer: 47,
inherits: 101
} ],
12: [ function(e, t, i) {
var r = e("inherits"), n = e("buffer").Buffer, s = e("../../asn1"), a = s.base, o = s.constants.der;
function c(e) {
this.enc = "der";
this.name = e.name;
this.entity = e;
this.tree = new h();
this.tree._init(e.body);
}
t.exports = c;
c.prototype.encode = function(e, t) {
return this.tree._encode(e, t).join();
};
function h(e) {
a.Node.call(this, "der", e);
}
r(h, a.Node);
h.prototype._encodeComposite = function(e, t, i, r) {
var s = function(e, t, i, r) {
var n;
"seqof" === e ? e = "seq" : "setof" === e && (e = "set");
if (o.tagByName.hasOwnProperty(e)) n = o.tagByName[e]; else {
if ("number" != typeof e || (0 | e) !== e) return r.error("Unknown tag: " + e);
n = e;
}
if (n >= 31) return r.error("Multi-octet tag encoding unsupported");
t || (n |= 32);
return n |= o.tagClassByName[i || "universal"] << 6;
}(e, t, i, this.reporter);
if (r.length < 128) {
var a;
(a = new n(2))[0] = s;
a[1] = r.length;
return this._createEncoderBuffer([ a, r ]);
}
for (var c = 1, h = r.length; h >= 256; h >>= 8) c++;
(a = new n(2 + c))[0] = s;
a[1] = 128 | c;
h = 1 + c;
for (var f = r.length; f > 0; h--, f >>= 8) a[h] = 255 & f;
return this._createEncoderBuffer([ a, r ]);
};
h.prototype._encodeStr = function(e, t) {
if ("bitstr" === t) return this._createEncoderBuffer([ 0 | e.unused, e.data ]);
if ("bmpstr" === t) {
for (var i = new n(2 * e.length), r = 0; r < e.length; r++) i.writeUInt16BE(e.charCodeAt(r), 2 * r);
return this._createEncoderBuffer(i);
}
return "numstr" === t ? this._isNumstr(e) ? this._createEncoderBuffer(e) : this.reporter.error("Encoding of string type: numstr supports only digits and space") : "printstr" === t ? this._isPrintstr(e) ? this._createEncoderBuffer(e) : this.reporter.error("Encoding of string type: printstr supports only latin upper and lower case letters, digits, space, apostrophe, left and rigth parenthesis, plus sign, comma, hyphen, dot, slash, colon, equal sign, question mark") : /str$/.test(t) ? this._createEncoderBuffer(e) : "objDesc" === t ? this._createEncoderBuffer(e) : this.reporter.error("Encoding of string type: " + t + " unsupported");
};
h.prototype._encodeObjid = function(e, t, i) {
if ("string" == typeof e) {
if (!t) return this.reporter.error("string objid given, but no values map found");
if (!t.hasOwnProperty(e)) return this.reporter.error("objid not found in values map");
e = t[e].split(/[\s\.]+/g);
for (var r = 0; r < e.length; r++) e[r] |= 0;
} else if (Array.isArray(e)) {
e = e.slice();
for (r = 0; r < e.length; r++) e[r] |= 0;
}
if (!Array.isArray(e)) return this.reporter.error("objid() should be either array or string, got: " + JSON.stringify(e));
if (!i) {
if (e[1] >= 40) return this.reporter.error("Second objid identifier OOB");
e.splice(0, 2, 40 * e[0] + e[1]);
}
var s = 0;
for (r = 0; r < e.length; r++) {
var a = e[r];
for (s++; a >= 128; a >>= 7) s++;
}
var o = new n(s), c = o.length - 1;
for (r = e.length - 1; r >= 0; r--) {
a = e[r];
o[c--] = 127 & a;
for (;(a >>= 7) > 0; ) o[c--] = 128 | 127 & a;
}
return this._createEncoderBuffer(o);
};
function f(e) {
return e < 10 ? "0" + e : e;
}
h.prototype._encodeTime = function(e, t) {
var i, r = new Date(e);
"gentime" === t ? i = [ f(r.getFullYear()), f(r.getUTCMonth() + 1), f(r.getUTCDate()), f(r.getUTCHours()), f(r.getUTCMinutes()), f(r.getUTCSeconds()), "Z" ].join("") : "utctime" === t ? i = [ f(r.getFullYear() % 100), f(r.getUTCMonth() + 1), f(r.getUTCDate()), f(r.getUTCHours()), f(r.getUTCMinutes()), f(r.getUTCSeconds()), "Z" ].join("") : this.reporter.error("Encoding " + t + " time is not supported yet");
return this._encodeStr(i, "octstr");
};
h.prototype._encodeNull = function() {
return this._createEncoderBuffer("");
};
h.prototype._encodeInt = function(e, t) {
if ("string" == typeof e) {
if (!t) return this.reporter.error("String int or enum given, but no values map");
if (!t.hasOwnProperty(e)) return this.reporter.error("Values map doesn't contain: " + JSON.stringify(e));
e = t[e];
}
if ("number" != typeof e && !n.isBuffer(e)) {
var i = e.toArray();
!e.sign && 128 & i[0] && i.unshift(0);
e = new n(i);
}
if (n.isBuffer(e)) {
var r = e.length;
0 === e.length && r++;
var s = new n(r);
e.copy(s);
0 === e.length && (s[0] = 0);
return this._createEncoderBuffer(s);
}
if (e < 128) return this._createEncoderBuffer(e);
if (e < 256) return this._createEncoderBuffer([ 0, e ]);
r = 1;
for (var a = e; a >= 256; a >>= 8) r++;
for (a = (s = new Array(r)).length - 1; a >= 0; a--) {
s[a] = 255 & e;
e >>= 8;
}
128 & s[0] && s.unshift(0);
return this._createEncoderBuffer(new n(s));
};
h.prototype._encodeBool = function(e) {
return this._createEncoderBuffer(e ? 255 : 0);
};
h.prototype._use = function(e, t) {
"function" == typeof e && (e = e(t));
return e._getEncoder("der").tree;
};
h.prototype._skipDefault = function(e, t, i) {
var r, n = this._baseState;
if (null === n.default) return !1;
var s = e.join();
void 0 === n.defaultBuffer && (n.defaultBuffer = this._encodeValue(n.default, t, i).join());
if (s.length !== n.defaultBuffer.length) return !1;
for (r = 0; r < s.length; r++) if (s[r] !== n.defaultBuffer[r]) return !1;
return !0;
};
}, {
"../../asn1": 1,
buffer: 47,
inherits: 101
} ],
13: [ function(e, t, i) {
var r = i;
r.der = e("./der");
r.pem = e("./pem");
}, {
"./der": 12,
"./pem": 14
} ],
14: [ function(e, t, i) {
var r = e("inherits"), n = e("./der");
function s(e) {
n.call(this, e);
this.enc = "pem";
}
r(s, n);
t.exports = s;
s.prototype.encode = function(e, t) {
for (var i = n.prototype.encode.call(this, e).toString("base64"), r = [ "-----BEGIN " + t.label + "-----" ], s = 0; s < i.length; s += 64) r.push(i.slice(s, s + 64));
r.push("-----END " + t.label + "-----");
return r.join("\n");
};
}, {
"./der": 12,
inherits: 101
} ],
15: [ function(e, t, i) {
"use strict";
i.byteLength = function(e) {
var t = h(e), i = t[0], r = t[1];
return 3 * (i + r) / 4 - r;
};
i.toByteArray = function(e) {
for (var t, i = h(e), r = i[0], a = i[1], o = new s(function(e, t, i) {
return 3 * (t + i) / 4 - i;
}(0, r, a)), c = 0, f = a > 0 ? r - 4 : r, d = 0; d < f; d += 4) {
t = n[e.charCodeAt(d)] << 18 | n[e.charCodeAt(d + 1)] << 12 | n[e.charCodeAt(d + 2)] << 6 | n[e.charCodeAt(d + 3)];
o[c++] = t >> 16 & 255;
o[c++] = t >> 8 & 255;
o[c++] = 255 & t;
}
if (2 === a) {
t = n[e.charCodeAt(d)] << 2 | n[e.charCodeAt(d + 1)] >> 4;
o[c++] = 255 & t;
}
if (1 === a) {
t = n[e.charCodeAt(d)] << 10 | n[e.charCodeAt(d + 1)] << 4 | n[e.charCodeAt(d + 2)] >> 2;
o[c++] = t >> 8 & 255;
o[c++] = 255 & t;
}
return o;
};
i.fromByteArray = function(e) {
for (var t, i = e.length, n = i % 3, s = [], a = 0, o = i - n; a < o; a += 16383) s.push(d(e, a, a + 16383 > o ? o : a + 16383));
if (1 === n) {
t = e[i - 1];
s.push(r[t >> 2] + r[t << 4 & 63] + "==");
} else if (2 === n) {
t = (e[i - 2] << 8) + e[i - 1];
s.push(r[t >> 10] + r[t >> 4 & 63] + r[t << 2 & 63] + "=");
}
return s.join("");
};
for (var r = [], n = [], s = "undefined" != typeof Uint8Array ? Uint8Array : Array, a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", o = 0, c = a.length; o < c; ++o) {
r[o] = a[o];
n[a.charCodeAt(o)] = o;
}
n["-".charCodeAt(0)] = 62;
n["_".charCodeAt(0)] = 63;
function h(e) {
var t = e.length;
if (t % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
var i = e.indexOf("=");
-1 === i && (i = t);
return [ i, i === t ? 0 : 4 - i % 4 ];
}
function f(e) {
return r[e >> 18 & 63] + r[e >> 12 & 63] + r[e >> 6 & 63] + r[63 & e];
}
function d(e, t, i) {
for (var r, n = [], s = t; s < i; s += 3) {
r = (e[s] << 16 & 16711680) + (e[s + 1] << 8 & 65280) + (255 & e[s + 2]);
n.push(f(r));
}
return n.join("");
}
}, {} ],
16: [ function(e, t, i) {
(function(t, i) {
"use strict";
function r(e, t) {
if (!e) throw new Error(t || "Assertion failed");
}
function n(e, t) {
e.super_ = t;
var i = function() {};
i.prototype = t.prototype;
e.prototype = new i();
e.prototype.constructor = e;
}
function s(e, t, i) {
if (s.isBN(e)) return e;
this.negative = 0;
this.words = null;
this.length = 0;
this.red = null;
if (null !== e) {
if ("le" === t || "be" === t) {
i = t;
t = 10;
}
this._init(e || 0, t || 10, i || "be");
}
}
"object" == typeof t ? t.exports = s : i.BN = s;
s.BN = s;
s.wordSize = 26;
var a;
try {
a = e("buffer").Buffer;
} catch (e) {}
s.isBN = function(e) {
return e instanceof s || null !== e && "object" == typeof e && e.constructor.wordSize === s.wordSize && Array.isArray(e.words);
};
s.max = function(e, t) {
return e.cmp(t) > 0 ? e : t;
};
s.min = function(e, t) {
return e.cmp(t) < 0 ? e : t;
};
s.prototype._init = function(e, t, i) {
if ("number" == typeof e) return this._initNumber(e, t, i);
if ("object" == typeof e) return this._initArray(e, t, i);
"hex" === t && (t = 16);
r(t === (0 | t) && t >= 2 && t <= 36);
var n = 0;
"-" === (e = e.toString().replace(/\s+/g, ""))[0] && n++;
16 === t ? this._parseHex(e, n) : this._parseBase(e, t, n);
"-" === e[0] && (this.negative = 1);
this.strip();
"le" === i && this._initArray(this.toArray(), t, i);
};
s.prototype._initNumber = function(e, t, i) {
if (e < 0) {
this.negative = 1;
e = -e;
}
if (e < 67108864) {
this.words = [ 67108863 & e ];
this.length = 1;
} else if (e < 4503599627370496) {
this.words = [ 67108863 & e, e / 67108864 & 67108863 ];
this.length = 2;
} else {
r(e < 9007199254740992);
this.words = [ 67108863 & e, e / 67108864 & 67108863, 1 ];
this.length = 3;
}
"le" === i && this._initArray(this.toArray(), t, i);
};
s.prototype._initArray = function(e, t, i) {
r("number" == typeof e.length);
if (e.length <= 0) {
this.words = [ 0 ];
this.length = 1;
return this;
}
this.length = Math.ceil(e.length / 3);
this.words = new Array(this.length);
for (var n = 0; n < this.length; n++) this.words[n] = 0;
var s, a, o = 0;
if ("be" === i) for (n = e.length - 1, s = 0; n >= 0; n -= 3) {
a = e[n] | e[n - 1] << 8 | e[n - 2] << 16;
this.words[s] |= a << o & 67108863;
this.words[s + 1] = a >>> 26 - o & 67108863;
if ((o += 24) >= 26) {
o -= 26;
s++;
}
} else if ("le" === i) for (n = 0, s = 0; n < e.length; n += 3) {
a = e[n] | e[n + 1] << 8 | e[n + 2] << 16;
this.words[s] |= a << o & 67108863;
this.words[s + 1] = a >>> 26 - o & 67108863;
if ((o += 24) >= 26) {
o -= 26;
s++;
}
}
return this.strip();
};
function o(e, t, i) {
for (var r = 0, n = Math.min(e.length, i), s = t; s < n; s++) {
var a = e.charCodeAt(s) - 48;
r <<= 4;
r |= a >= 49 && a <= 54 ? a - 49 + 10 : a >= 17 && a <= 22 ? a - 17 + 10 : 15 & a;
}
return r;
}
s.prototype._parseHex = function(e, t) {
this.length = Math.ceil((e.length - t) / 6);
this.words = new Array(this.length);
for (var i = 0; i < this.length; i++) this.words[i] = 0;
var r, n, s = 0;
for (i = e.length - 6, r = 0; i >= t; i -= 6) {
n = o(e, i, i + 6);
this.words[r] |= n << s & 67108863;
this.words[r + 1] |= n >>> 26 - s & 4194303;
if ((s += 24) >= 26) {
s -= 26;
r++;
}
}
if (i + 6 !== t) {
n = o(e, t, i + 6);
this.words[r] |= n << s & 67108863;
this.words[r + 1] |= n >>> 26 - s & 4194303;
}
this.strip();
};
function c(e, t, i, r) {
for (var n = 0, s = Math.min(e.length, i), a = t; a < s; a++) {
var o = e.charCodeAt(a) - 48;
n *= r;
n += o >= 49 ? o - 49 + 10 : o >= 17 ? o - 17 + 10 : o;
}
return n;
}
s.prototype._parseBase = function(e, t, i) {
this.words = [ 0 ];
this.length = 1;
for (var r = 0, n = 1; n <= 67108863; n *= t) r++;
r--;
n = n / t | 0;
for (var s = e.length - i, a = s % r, o = Math.min(s, s - a) + i, h = 0, f = i; f < o; f += r) {
h = c(e, f, f + r, t);
this.imuln(n);
this.words[0] + h < 67108864 ? this.words[0] += h : this._iaddn(h);
}
if (0 !== a) {
var d = 1;
h = c(e, f, e.length, t);
for (f = 0; f < a; f++) d *= t;
this.imuln(d);
this.words[0] + h < 67108864 ? this.words[0] += h : this._iaddn(h);
}
};
s.prototype.copy = function(e) {
e.words = new Array(this.length);
for (var t = 0; t < this.length; t++) e.words[t] = this.words[t];
e.length = this.length;
e.negative = this.negative;
e.red = this.red;
};
s.prototype.clone = function() {
var e = new s(null);
this.copy(e);
return e;
};
s.prototype._expand = function(e) {
for (;this.length < e; ) this.words[this.length++] = 0;
return this;
};
s.prototype.strip = function() {
for (;this.length > 1 && 0 === this.words[this.length - 1]; ) this.length--;
return this._normSign();
};
s.prototype._normSign = function() {
1 === this.length && 0 === this.words[0] && (this.negative = 0);
return this;
};
s.prototype.inspect = function() {
return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
};
var h = [ "", "0", "00", "000", "0000", "00000", "000000", "0000000", "00000000", "000000000", "0000000000", "00000000000", "000000000000", "0000000000000", "00000000000000", "000000000000000", "0000000000000000", "00000000000000000", "000000000000000000", "0000000000000000000", "00000000000000000000", "000000000000000000000", "0000000000000000000000", "00000000000000000000000", "000000000000000000000000", "0000000000000000000000000" ], f = [ 0, 0, 25, 16, 12, 11, 10, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5 ], d = [ 0, 0, 33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216, 43046721, 1e7, 19487171, 35831808, 62748517, 7529536, 11390625, 16777216, 24137569, 34012224, 47045881, 64e6, 4084101, 5153632, 6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149, 243e5, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176 ];
s.prototype.toString = function(e, t) {
e = e || 10;
t = 0 | t || 1;
var i;
if (16 === e || "hex" === e) {
i = "";
for (var n = 0, s = 0, a = 0; a < this.length; a++) {
var o = this.words[a], c = (16777215 & (o << n | s)).toString(16);
i = 0 !== (s = o >>> 24 - n & 16777215) || a !== this.length - 1 ? h[6 - c.length] + c + i : c + i;
if ((n += 2) >= 26) {
n -= 26;
a--;
}
}
0 !== s && (i = s.toString(16) + i);
for (;i.length % t != 0; ) i = "0" + i;
0 !== this.negative && (i = "-" + i);
return i;
}
if (e === (0 | e) && e >= 2 && e <= 36) {
var u = f[e], l = d[e];
i = "";
var p = this.clone();
p.negative = 0;
for (;!p.isZero(); ) {
var b = p.modn(l).toString(e);
i = (p = p.idivn(l)).isZero() ? b + i : h[u - b.length] + b + i;
}
this.isZero() && (i = "0" + i);
for (;i.length % t != 0; ) i = "0" + i;
0 !== this.negative && (i = "-" + i);
return i;
}
r(!1, "Base should be between 2 and 36");
};
s.prototype.toNumber = function() {
var e = this.words[0];
2 === this.length ? e += 67108864 * this.words[1] : 3 === this.length && 1 === this.words[2] ? e += 4503599627370496 + 67108864 * this.words[1] : this.length > 2 && r(!1, "Number can only safely store up to 53 bits");
return 0 !== this.negative ? -e : e;
};
s.prototype.toJSON = function() {
return this.toString(16);
};
s.prototype.toBuffer = function(e, t) {
r("undefined" != typeof a);
return this.toArrayLike(a, e, t);
};
s.prototype.toArray = function(e, t) {
return this.toArrayLike(Array, e, t);
};
s.prototype.toArrayLike = function(e, t, i) {
var n = this.byteLength(), s = i || Math.max(1, n);
r(n <= s, "byte array longer than desired length");
r(s > 0, "Requested array length <= 0");
this.strip();
var a, o, c = "le" === t, h = new e(s), f = this.clone();
if (c) {
for (o = 0; !f.isZero(); o++) {
a = f.andln(255);
f.iushrn(8);
h[o] = a;
}
for (;o < s; o++) h[o] = 0;
} else {
for (o = 0; o < s - n; o++) h[o] = 0;
for (o = 0; !f.isZero(); o++) {
a = f.andln(255);
f.iushrn(8);
h[s - o - 1] = a;
}
}
return h;
};
Math.clz32 ? s.prototype._countBits = function(e) {
return 32 - Math.clz32(e);
} : s.prototype._countBits = function(e) {
var t = e, i = 0;
if (t >= 4096) {
i += 13;
t >>>= 13;
}
if (t >= 64) {
i += 7;
t >>>= 7;
}
if (t >= 8) {
i += 4;
t >>>= 4;
}
if (t >= 2) {
i += 2;
t >>>= 2;
}
return i + t;
};
s.prototype._zeroBits = function(e) {
if (0 === e) return 26;
var t = e, i = 0;
if (0 == (8191 & t)) {
i += 13;
t >>>= 13;
}
if (0 == (127 & t)) {
i += 7;
t >>>= 7;
}
if (0 == (15 & t)) {
i += 4;
t >>>= 4;
}
if (0 == (3 & t)) {
i += 2;
t >>>= 2;
}
0 == (1 & t) && i++;
return i;
};
s.prototype.bitLength = function() {
var e = this.words[this.length - 1], t = this._countBits(e);
return 26 * (this.length - 1) + t;
};
s.prototype.zeroBits = function() {
if (this.isZero()) return 0;
for (var e = 0, t = 0; t < this.length; t++) {
var i = this._zeroBits(this.words[t]);
e += i;
if (26 !== i) break;
}
return e;
};
s.prototype.byteLength = function() {
return Math.ceil(this.bitLength() / 8);
};
s.prototype.toTwos = function(e) {
return 0 !== this.negative ? this.abs().inotn(e).iaddn(1) : this.clone();
};
s.prototype.fromTwos = function(e) {
return this.testn(e - 1) ? this.notn(e).iaddn(1).ineg() : this.clone();
};
s.prototype.isNeg = function() {
return 0 !== this.negative;
};
s.prototype.neg = function() {
return this.clone().ineg();
};
s.prototype.ineg = function() {
this.isZero() || (this.negative ^= 1);
return this;
};
s.prototype.iuor = function(e) {
for (;this.length < e.length; ) this.words[this.length++] = 0;
for (var t = 0; t < e.length; t++) this.words[t] = this.words[t] | e.words[t];
return this.strip();
};
s.prototype.ior = function(e) {
r(0 == (this.negative | e.negative));
return this.iuor(e);
};
s.prototype.or = function(e) {
return this.length > e.length ? this.clone().ior(e) : e.clone().ior(this);
};
s.prototype.uor = function(e) {
return this.length > e.length ? this.clone().iuor(e) : e.clone().iuor(this);
};
s.prototype.iuand = function(e) {
var t;
t = this.length > e.length ? e : this;
for (var i = 0; i < t.length; i++) this.words[i] = this.words[i] & e.words[i];
this.length = t.length;
return this.strip();
};
s.prototype.iand = function(e) {
r(0 == (this.negative | e.negative));
return this.iuand(e);
};
s.prototype.and = function(e) {
return this.length > e.length ? this.clone().iand(e) : e.clone().iand(this);
};
s.prototype.uand = function(e) {
return this.length > e.length ? this.clone().iuand(e) : e.clone().iuand(this);
};
s.prototype.iuxor = function(e) {
var t, i;
if (this.length > e.length) {
t = this;
i = e;
} else {
t = e;
i = this;
}
for (var r = 0; r < i.length; r++) this.words[r] = t.words[r] ^ i.words[r];
if (this !== t) for (;r < t.length; r++) this.words[r] = t.words[r];
this.length = t.length;
return this.strip();
};
s.prototype.ixor = function(e) {
r(0 == (this.negative | e.negative));
return this.iuxor(e);
};
s.prototype.xor = function(e) {
return this.length > e.length ? this.clone().ixor(e) : e.clone().ixor(this);
};
s.prototype.uxor = function(e) {
return this.length > e.length ? this.clone().iuxor(e) : e.clone().iuxor(this);
};
s.prototype.inotn = function(e) {
r("number" == typeof e && e >= 0);
var t = 0 | Math.ceil(e / 26), i = e % 26;
this._expand(t);
i > 0 && t--;
for (var n = 0; n < t; n++) this.words[n] = 67108863 & ~this.words[n];
i > 0 && (this.words[n] = ~this.words[n] & 67108863 >> 26 - i);
return this.strip();
};
s.prototype.notn = function(e) {
return this.clone().inotn(e);
};
s.prototype.setn = function(e, t) {
r("number" == typeof e && e >= 0);
var i = e / 26 | 0, n = e % 26;
this._expand(i + 1);
this.words[i] = t ? this.words[i] | 1 << n : this.words[i] & ~(1 << n);
return this.strip();
};
s.prototype.iadd = function(e) {
var t, i, r;
if (0 !== this.negative && 0 === e.negative) {
this.negative = 0;
t = this.isub(e);
this.negative ^= 1;
return this._normSign();
}
if (0 === this.negative && 0 !== e.negative) {
e.negative = 0;
t = this.isub(e);
e.negative = 1;
return t._normSign();
}
if (this.length > e.length) {
i = this;
r = e;
} else {
i = e;
r = this;
}
for (var n = 0, s = 0; s < r.length; s++) {
t = (0 | i.words[s]) + (0 | r.words[s]) + n;
this.words[s] = 67108863 & t;
n = t >>> 26;
}
for (;0 !== n && s < i.length; s++) {
t = (0 | i.words[s]) + n;
this.words[s] = 67108863 & t;
n = t >>> 26;
}
this.length = i.length;
if (0 !== n) {
this.words[this.length] = n;
this.length++;
} else if (i !== this) for (;s < i.length; s++) this.words[s] = i.words[s];
return this;
};
s.prototype.add = function(e) {
var t;
if (0 !== e.negative && 0 === this.negative) {
e.negative = 0;
t = this.sub(e);
e.negative ^= 1;
return t;
}
if (0 === e.negative && 0 !== this.negative) {
this.negative = 0;
t = e.sub(this);
this.negative = 1;
return t;
}
return this.length > e.length ? this.clone().iadd(e) : e.clone().iadd(this);
};
s.prototype.isub = function(e) {
if (0 !== e.negative) {
e.negative = 0;
var t = this.iadd(e);
e.negative = 1;
return t._normSign();
}
if (0 !== this.negative) {
this.negative = 0;
this.iadd(e);
this.negative = 1;
return this._normSign();
}
var i, r, n = this.cmp(e);
if (0 === n) {
this.negative = 0;
this.length = 1;
this.words[0] = 0;
return this;
}
if (n > 0) {
i = this;
r = e;
} else {
i = e;
r = this;
}
for (var s = 0, a = 0; a < r.length; a++) {
s = (t = (0 | i.words[a]) - (0 | r.words[a]) + s) >> 26;
this.words[a] = 67108863 & t;
}
for (;0 !== s && a < i.length; a++) {
s = (t = (0 | i.words[a]) + s) >> 26;
this.words[a] = 67108863 & t;
}
if (0 === s && a < i.length && i !== this) for (;a < i.length; a++) this.words[a] = i.words[a];
this.length = Math.max(this.length, a);
i !== this && (this.negative = 1);
return this.strip();
};
s.prototype.sub = function(e) {
return this.clone().isub(e);
};
function u(e, t, i) {
i.negative = t.negative ^ e.negative;
var r = e.length + t.length | 0;
i.length = r;
r = r - 1 | 0;
var n = 0 | e.words[0], s = 0 | t.words[0], a = n * s, o = 67108863 & a, c = a / 67108864 | 0;
i.words[0] = o;
for (var h = 1; h < r; h++) {
for (var f = c >>> 26, d = 67108863 & c, u = Math.min(h, t.length - 1), l = Math.max(0, h - e.length + 1); l <= u; l++) {
var p = h - l | 0;
f += (a = (n = 0 | e.words[p]) * (s = 0 | t.words[l]) + d) / 67108864 | 0;
d = 67108863 & a;
}
i.words[h] = 0 | d;
c = 0 | f;
}
0 !== c ? i.words[h] = 0 | c : i.length--;
return i.strip();
}
var l = function(e, t, i) {
var r, n, s, a = e.words, o = t.words, c = i.words, h = 0, f = 0 | a[0], d = 8191 & f, u = f >>> 13, l = 0 | a[1], p = 8191 & l, b = l >>> 13, g = 0 | a[2], y = 8191 & g, m = g >>> 13, v = 0 | a[3], _ = 8191 & v, w = v >>> 13, x = 0 | a[4], C = 8191 & x, E = x >>> 13, S = 0 | a[5], A = 8191 & S, D = S >>> 13, R = 0 | a[6], M = 8191 & R, k = R >>> 13, N = 0 | a[7], B = 8191 & N, L = N >>> 13, T = 0 | a[8], O = 8191 & T, P = T >>> 13, I = 0 | a[9], j = 8191 & I, F = I >>> 13, U = 0 | o[0], z = 8191 & U, q = U >>> 13, G = 0 | o[1], H = 8191 & G, V = G >>> 13, K = 0 | o[2], Y = 8191 & K, W = K >>> 13, X = 0 | o[3], J = 8191 & X, Z = X >>> 13, Q = 0 | o[4], $ = 8191 & Q, ee = Q >>> 13, te = 0 | o[5], ie = 8191 & te, re = te >>> 13, ne = 0 | o[6], se = 8191 & ne, ae = ne >>> 13, oe = 0 | o[7], ce = 8191 & oe, he = oe >>> 13, fe = 0 | o[8], de = 8191 & fe, ue = fe >>> 13, le = 0 | o[9], pe = 8191 & le, be = le >>> 13;
i.negative = e.negative ^ t.negative;
i.length = 19;
var ge = (h + (r = Math.imul(d, z)) | 0) + ((8191 & (n = (n = Math.imul(d, q)) + Math.imul(u, z) | 0)) << 13) | 0;
h = ((s = Math.imul(u, q)) + (n >>> 13) | 0) + (ge >>> 26) | 0;
ge &= 67108863;
r = Math.imul(p, z);
n = (n = Math.imul(p, q)) + Math.imul(b, z) | 0;
s = Math.imul(b, q);
var ye = (h + (r = r + Math.imul(d, H) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(d, V) | 0) + Math.imul(u, H) | 0)) << 13) | 0;
h = ((s = s + Math.imul(u, V) | 0) + (n >>> 13) | 0) + (ye >>> 26) | 0;
ye &= 67108863;
r = Math.imul(y, z);
n = (n = Math.imul(y, q)) + Math.imul(m, z) | 0;
s = Math.imul(m, q);
r = r + Math.imul(p, H) | 0;
n = (n = n + Math.imul(p, V) | 0) + Math.imul(b, H) | 0;
s = s + Math.imul(b, V) | 0;
var me = (h + (r = r + Math.imul(d, Y) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(d, W) | 0) + Math.imul(u, Y) | 0)) << 13) | 0;
h = ((s = s + Math.imul(u, W) | 0) + (n >>> 13) | 0) + (me >>> 26) | 0;
me &= 67108863;
r = Math.imul(_, z);
n = (n = Math.imul(_, q)) + Math.imul(w, z) | 0;
s = Math.imul(w, q);
r = r + Math.imul(y, H) | 0;
n = (n = n + Math.imul(y, V) | 0) + Math.imul(m, H) | 0;
s = s + Math.imul(m, V) | 0;
r = r + Math.imul(p, Y) | 0;
n = (n = n + Math.imul(p, W) | 0) + Math.imul(b, Y) | 0;
s = s + Math.imul(b, W) | 0;
var ve = (h + (r = r + Math.imul(d, J) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(d, Z) | 0) + Math.imul(u, J) | 0)) << 13) | 0;
h = ((s = s + Math.imul(u, Z) | 0) + (n >>> 13) | 0) + (ve >>> 26) | 0;
ve &= 67108863;
r = Math.imul(C, z);
n = (n = Math.imul(C, q)) + Math.imul(E, z) | 0;
s = Math.imul(E, q);
r = r + Math.imul(_, H) | 0;
n = (n = n + Math.imul(_, V) | 0) + Math.imul(w, H) | 0;
s = s + Math.imul(w, V) | 0;
r = r + Math.imul(y, Y) | 0;
n = (n = n + Math.imul(y, W) | 0) + Math.imul(m, Y) | 0;
s = s + Math.imul(m, W) | 0;
r = r + Math.imul(p, J) | 0;
n = (n = n + Math.imul(p, Z) | 0) + Math.imul(b, J) | 0;
s = s + Math.imul(b, Z) | 0;
var _e = (h + (r = r + Math.imul(d, $) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(d, ee) | 0) + Math.imul(u, $) | 0)) << 13) | 0;
h = ((s = s + Math.imul(u, ee) | 0) + (n >>> 13) | 0) + (_e >>> 26) | 0;
_e &= 67108863;
r = Math.imul(A, z);
n = (n = Math.imul(A, q)) + Math.imul(D, z) | 0;
s = Math.imul(D, q);
r = r + Math.imul(C, H) | 0;
n = (n = n + Math.imul(C, V) | 0) + Math.imul(E, H) | 0;
s = s + Math.imul(E, V) | 0;
r = r + Math.imul(_, Y) | 0;
n = (n = n + Math.imul(_, W) | 0) + Math.imul(w, Y) | 0;
s = s + Math.imul(w, W) | 0;
r = r + Math.imul(y, J) | 0;
n = (n = n + Math.imul(y, Z) | 0) + Math.imul(m, J) | 0;
s = s + Math.imul(m, Z) | 0;
r = r + Math.imul(p, $) | 0;
n = (n = n + Math.imul(p, ee) | 0) + Math.imul(b, $) | 0;
s = s + Math.imul(b, ee) | 0;
var we = (h + (r = r + Math.imul(d, ie) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(d, re) | 0) + Math.imul(u, ie) | 0)) << 13) | 0;
h = ((s = s + Math.imul(u, re) | 0) + (n >>> 13) | 0) + (we >>> 26) | 0;
we &= 67108863;
r = Math.imul(M, z);
n = (n = Math.imul(M, q)) + Math.imul(k, z) | 0;
s = Math.imul(k, q);
r = r + Math.imul(A, H) | 0;
n = (n = n + Math.imul(A, V) | 0) + Math.imul(D, H) | 0;
s = s + Math.imul(D, V) | 0;
r = r + Math.imul(C, Y) | 0;
n = (n = n + Math.imul(C, W) | 0) + Math.imul(E, Y) | 0;
s = s + Math.imul(E, W) | 0;
r = r + Math.imul(_, J) | 0;
n = (n = n + Math.imul(_, Z) | 0) + Math.imul(w, J) | 0;
s = s + Math.imul(w, Z) | 0;
r = r + Math.imul(y, $) | 0;
n = (n = n + Math.imul(y, ee) | 0) + Math.imul(m, $) | 0;
s = s + Math.imul(m, ee) | 0;
r = r + Math.imul(p, ie) | 0;
n = (n = n + Math.imul(p, re) | 0) + Math.imul(b, ie) | 0;
s = s + Math.imul(b, re) | 0;
var xe = (h + (r = r + Math.imul(d, se) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(d, ae) | 0) + Math.imul(u, se) | 0)) << 13) | 0;
h = ((s = s + Math.imul(u, ae) | 0) + (n >>> 13) | 0) + (xe >>> 26) | 0;
xe &= 67108863;
r = Math.imul(B, z);
n = (n = Math.imul(B, q)) + Math.imul(L, z) | 0;
s = Math.imul(L, q);
r = r + Math.imul(M, H) | 0;
n = (n = n + Math.imul(M, V) | 0) + Math.imul(k, H) | 0;
s = s + Math.imul(k, V) | 0;
r = r + Math.imul(A, Y) | 0;
n = (n = n + Math.imul(A, W) | 0) + Math.imul(D, Y) | 0;
s = s + Math.imul(D, W) | 0;
r = r + Math.imul(C, J) | 0;
n = (n = n + Math.imul(C, Z) | 0) + Math.imul(E, J) | 0;
s = s + Math.imul(E, Z) | 0;
r = r + Math.imul(_, $) | 0;
n = (n = n + Math.imul(_, ee) | 0) + Math.imul(w, $) | 0;
s = s + Math.imul(w, ee) | 0;
r = r + Math.imul(y, ie) | 0;
n = (n = n + Math.imul(y, re) | 0) + Math.imul(m, ie) | 0;
s = s + Math.imul(m, re) | 0;
r = r + Math.imul(p, se) | 0;
n = (n = n + Math.imul(p, ae) | 0) + Math.imul(b, se) | 0;
s = s + Math.imul(b, ae) | 0;
var Ce = (h + (r = r + Math.imul(d, ce) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(d, he) | 0) + Math.imul(u, ce) | 0)) << 13) | 0;
h = ((s = s + Math.imul(u, he) | 0) + (n >>> 13) | 0) + (Ce >>> 26) | 0;
Ce &= 67108863;
r = Math.imul(O, z);
n = (n = Math.imul(O, q)) + Math.imul(P, z) | 0;
s = Math.imul(P, q);
r = r + Math.imul(B, H) | 0;
n = (n = n + Math.imul(B, V) | 0) + Math.imul(L, H) | 0;
s = s + Math.imul(L, V) | 0;
r = r + Math.imul(M, Y) | 0;
n = (n = n + Math.imul(M, W) | 0) + Math.imul(k, Y) | 0;
s = s + Math.imul(k, W) | 0;
r = r + Math.imul(A, J) | 0;
n = (n = n + Math.imul(A, Z) | 0) + Math.imul(D, J) | 0;
s = s + Math.imul(D, Z) | 0;
r = r + Math.imul(C, $) | 0;
n = (n = n + Math.imul(C, ee) | 0) + Math.imul(E, $) | 0;
s = s + Math.imul(E, ee) | 0;
r = r + Math.imul(_, ie) | 0;
n = (n = n + Math.imul(_, re) | 0) + Math.imul(w, ie) | 0;
s = s + Math.imul(w, re) | 0;
r = r + Math.imul(y, se) | 0;
n = (n = n + Math.imul(y, ae) | 0) + Math.imul(m, se) | 0;
s = s + Math.imul(m, ae) | 0;
r = r + Math.imul(p, ce) | 0;
n = (n = n + Math.imul(p, he) | 0) + Math.imul(b, ce) | 0;
s = s + Math.imul(b, he) | 0;
var Ee = (h + (r = r + Math.imul(d, de) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(d, ue) | 0) + Math.imul(u, de) | 0)) << 13) | 0;
h = ((s = s + Math.imul(u, ue) | 0) + (n >>> 13) | 0) + (Ee >>> 26) | 0;
Ee &= 67108863;
r = Math.imul(j, z);
n = (n = Math.imul(j, q)) + Math.imul(F, z) | 0;
s = Math.imul(F, q);
r = r + Math.imul(O, H) | 0;
n = (n = n + Math.imul(O, V) | 0) + Math.imul(P, H) | 0;
s = s + Math.imul(P, V) | 0;
r = r + Math.imul(B, Y) | 0;
n = (n = n + Math.imul(B, W) | 0) + Math.imul(L, Y) | 0;
s = s + Math.imul(L, W) | 0;
r = r + Math.imul(M, J) | 0;
n = (n = n + Math.imul(M, Z) | 0) + Math.imul(k, J) | 0;
s = s + Math.imul(k, Z) | 0;
r = r + Math.imul(A, $) | 0;
n = (n = n + Math.imul(A, ee) | 0) + Math.imul(D, $) | 0;
s = s + Math.imul(D, ee) | 0;
r = r + Math.imul(C, ie) | 0;
n = (n = n + Math.imul(C, re) | 0) + Math.imul(E, ie) | 0;
s = s + Math.imul(E, re) | 0;
r = r + Math.imul(_, se) | 0;
n = (n = n + Math.imul(_, ae) | 0) + Math.imul(w, se) | 0;
s = s + Math.imul(w, ae) | 0;
r = r + Math.imul(y, ce) | 0;
n = (n = n + Math.imul(y, he) | 0) + Math.imul(m, ce) | 0;
s = s + Math.imul(m, he) | 0;
r = r + Math.imul(p, de) | 0;
n = (n = n + Math.imul(p, ue) | 0) + Math.imul(b, de) | 0;
s = s + Math.imul(b, ue) | 0;
var Se = (h + (r = r + Math.imul(d, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(d, be) | 0) + Math.imul(u, pe) | 0)) << 13) | 0;
h = ((s = s + Math.imul(u, be) | 0) + (n >>> 13) | 0) + (Se >>> 26) | 0;
Se &= 67108863;
r = Math.imul(j, H);
n = (n = Math.imul(j, V)) + Math.imul(F, H) | 0;
s = Math.imul(F, V);
r = r + Math.imul(O, Y) | 0;
n = (n = n + Math.imul(O, W) | 0) + Math.imul(P, Y) | 0;
s = s + Math.imul(P, W) | 0;
r = r + Math.imul(B, J) | 0;
n = (n = n + Math.imul(B, Z) | 0) + Math.imul(L, J) | 0;
s = s + Math.imul(L, Z) | 0;
r = r + Math.imul(M, $) | 0;
n = (n = n + Math.imul(M, ee) | 0) + Math.imul(k, $) | 0;
s = s + Math.imul(k, ee) | 0;
r = r + Math.imul(A, ie) | 0;
n = (n = n + Math.imul(A, re) | 0) + Math.imul(D, ie) | 0;
s = s + Math.imul(D, re) | 0;
r = r + Math.imul(C, se) | 0;
n = (n = n + Math.imul(C, ae) | 0) + Math.imul(E, se) | 0;
s = s + Math.imul(E, ae) | 0;
r = r + Math.imul(_, ce) | 0;
n = (n = n + Math.imul(_, he) | 0) + Math.imul(w, ce) | 0;
s = s + Math.imul(w, he) | 0;
r = r + Math.imul(y, de) | 0;
n = (n = n + Math.imul(y, ue) | 0) + Math.imul(m, de) | 0;
s = s + Math.imul(m, ue) | 0;
var Ae = (h + (r = r + Math.imul(p, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(p, be) | 0) + Math.imul(b, pe) | 0)) << 13) | 0;
h = ((s = s + Math.imul(b, be) | 0) + (n >>> 13) | 0) + (Ae >>> 26) | 0;
Ae &= 67108863;
r = Math.imul(j, Y);
n = (n = Math.imul(j, W)) + Math.imul(F, Y) | 0;
s = Math.imul(F, W);
r = r + Math.imul(O, J) | 0;
n = (n = n + Math.imul(O, Z) | 0) + Math.imul(P, J) | 0;
s = s + Math.imul(P, Z) | 0;
r = r + Math.imul(B, $) | 0;
n = (n = n + Math.imul(B, ee) | 0) + Math.imul(L, $) | 0;
s = s + Math.imul(L, ee) | 0;
r = r + Math.imul(M, ie) | 0;
n = (n = n + Math.imul(M, re) | 0) + Math.imul(k, ie) | 0;
s = s + Math.imul(k, re) | 0;
r = r + Math.imul(A, se) | 0;
n = (n = n + Math.imul(A, ae) | 0) + Math.imul(D, se) | 0;
s = s + Math.imul(D, ae) | 0;
r = r + Math.imul(C, ce) | 0;
n = (n = n + Math.imul(C, he) | 0) + Math.imul(E, ce) | 0;
s = s + Math.imul(E, he) | 0;
r = r + Math.imul(_, de) | 0;
n = (n = n + Math.imul(_, ue) | 0) + Math.imul(w, de) | 0;
s = s + Math.imul(w, ue) | 0;
var De = (h + (r = r + Math.imul(y, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(y, be) | 0) + Math.imul(m, pe) | 0)) << 13) | 0;
h = ((s = s + Math.imul(m, be) | 0) + (n >>> 13) | 0) + (De >>> 26) | 0;
De &= 67108863;
r = Math.imul(j, J);
n = (n = Math.imul(j, Z)) + Math.imul(F, J) | 0;
s = Math.imul(F, Z);
r = r + Math.imul(O, $) | 0;
n = (n = n + Math.imul(O, ee) | 0) + Math.imul(P, $) | 0;
s = s + Math.imul(P, ee) | 0;
r = r + Math.imul(B, ie) | 0;
n = (n = n + Math.imul(B, re) | 0) + Math.imul(L, ie) | 0;
s = s + Math.imul(L, re) | 0;
r = r + Math.imul(M, se) | 0;
n = (n = n + Math.imul(M, ae) | 0) + Math.imul(k, se) | 0;
s = s + Math.imul(k, ae) | 0;
r = r + Math.imul(A, ce) | 0;
n = (n = n + Math.imul(A, he) | 0) + Math.imul(D, ce) | 0;
s = s + Math.imul(D, he) | 0;
r = r + Math.imul(C, de) | 0;
n = (n = n + Math.imul(C, ue) | 0) + Math.imul(E, de) | 0;
s = s + Math.imul(E, ue) | 0;
var Re = (h + (r = r + Math.imul(_, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(_, be) | 0) + Math.imul(w, pe) | 0)) << 13) | 0;
h = ((s = s + Math.imul(w, be) | 0) + (n >>> 13) | 0) + (Re >>> 26) | 0;
Re &= 67108863;
r = Math.imul(j, $);
n = (n = Math.imul(j, ee)) + Math.imul(F, $) | 0;
s = Math.imul(F, ee);
r = r + Math.imul(O, ie) | 0;
n = (n = n + Math.imul(O, re) | 0) + Math.imul(P, ie) | 0;
s = s + Math.imul(P, re) | 0;
r = r + Math.imul(B, se) | 0;
n = (n = n + Math.imul(B, ae) | 0) + Math.imul(L, se) | 0;
s = s + Math.imul(L, ae) | 0;
r = r + Math.imul(M, ce) | 0;
n = (n = n + Math.imul(M, he) | 0) + Math.imul(k, ce) | 0;
s = s + Math.imul(k, he) | 0;
r = r + Math.imul(A, de) | 0;
n = (n = n + Math.imul(A, ue) | 0) + Math.imul(D, de) | 0;
s = s + Math.imul(D, ue) | 0;
var Me = (h + (r = r + Math.imul(C, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(C, be) | 0) + Math.imul(E, pe) | 0)) << 13) | 0;
h = ((s = s + Math.imul(E, be) | 0) + (n >>> 13) | 0) + (Me >>> 26) | 0;
Me &= 67108863;
r = Math.imul(j, ie);
n = (n = Math.imul(j, re)) + Math.imul(F, ie) | 0;
s = Math.imul(F, re);
r = r + Math.imul(O, se) | 0;
n = (n = n + Math.imul(O, ae) | 0) + Math.imul(P, se) | 0;
s = s + Math.imul(P, ae) | 0;
r = r + Math.imul(B, ce) | 0;
n = (n = n + Math.imul(B, he) | 0) + Math.imul(L, ce) | 0;
s = s + Math.imul(L, he) | 0;
r = r + Math.imul(M, de) | 0;
n = (n = n + Math.imul(M, ue) | 0) + Math.imul(k, de) | 0;
s = s + Math.imul(k, ue) | 0;
var ke = (h + (r = r + Math.imul(A, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(A, be) | 0) + Math.imul(D, pe) | 0)) << 13) | 0;
h = ((s = s + Math.imul(D, be) | 0) + (n >>> 13) | 0) + (ke >>> 26) | 0;
ke &= 67108863;
r = Math.imul(j, se);
n = (n = Math.imul(j, ae)) + Math.imul(F, se) | 0;
s = Math.imul(F, ae);
r = r + Math.imul(O, ce) | 0;
n = (n = n + Math.imul(O, he) | 0) + Math.imul(P, ce) | 0;
s = s + Math.imul(P, he) | 0;
r = r + Math.imul(B, de) | 0;
n = (n = n + Math.imul(B, ue) | 0) + Math.imul(L, de) | 0;
s = s + Math.imul(L, ue) | 0;
var Ne = (h + (r = r + Math.imul(M, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(M, be) | 0) + Math.imul(k, pe) | 0)) << 13) | 0;
h = ((s = s + Math.imul(k, be) | 0) + (n >>> 13) | 0) + (Ne >>> 26) | 0;
Ne &= 67108863;
r = Math.imul(j, ce);
n = (n = Math.imul(j, he)) + Math.imul(F, ce) | 0;
s = Math.imul(F, he);
r = r + Math.imul(O, de) | 0;
n = (n = n + Math.imul(O, ue) | 0) + Math.imul(P, de) | 0;
s = s + Math.imul(P, ue) | 0;
var Be = (h + (r = r + Math.imul(B, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(B, be) | 0) + Math.imul(L, pe) | 0)) << 13) | 0;
h = ((s = s + Math.imul(L, be) | 0) + (n >>> 13) | 0) + (Be >>> 26) | 0;
Be &= 67108863;
r = Math.imul(j, de);
n = (n = Math.imul(j, ue)) + Math.imul(F, de) | 0;
s = Math.imul(F, ue);
var Le = (h + (r = r + Math.imul(O, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(O, be) | 0) + Math.imul(P, pe) | 0)) << 13) | 0;
h = ((s = s + Math.imul(P, be) | 0) + (n >>> 13) | 0) + (Le >>> 26) | 0;
Le &= 67108863;
var Te = (h + (r = Math.imul(j, pe)) | 0) + ((8191 & (n = (n = Math.imul(j, be)) + Math.imul(F, pe) | 0)) << 13) | 0;
h = ((s = Math.imul(F, be)) + (n >>> 13) | 0) + (Te >>> 26) | 0;
Te &= 67108863;
c[0] = ge;
c[1] = ye;
c[2] = me;
c[3] = ve;
c[4] = _e;
c[5] = we;
c[6] = xe;
c[7] = Ce;
c[8] = Ee;
c[9] = Se;
c[10] = Ae;
c[11] = De;
c[12] = Re;
c[13] = Me;
c[14] = ke;
c[15] = Ne;
c[16] = Be;
c[17] = Le;
c[18] = Te;
if (0 !== h) {
c[19] = h;
i.length++;
}
return i;
};
Math.imul || (l = u);
function p(e, t, i) {
return new b().mulp(e, t, i);
}
s.prototype.mulTo = function(e, t) {
var i = this.length + e.length;
return 10 === this.length && 10 === e.length ? l(this, e, t) : i < 63 ? u(this, e, t) : i < 1024 ? function(e, t, i) {
i.negative = t.negative ^ e.negative;
i.length = e.length + t.length;
for (var r = 0, n = 0, s = 0; s < i.length - 1; s++) {
var a = n;
n = 0;
for (var o = 67108863 & r, c = Math.min(s, t.length - 1), h = Math.max(0, s - e.length + 1); h <= c; h++) {
var f = s - h, d = (0 | e.words[f]) * (0 | t.words[h]), u = 67108863 & d;
o = 67108863 & (u = u + o | 0);
n += (a = (a = a + (d / 67108864 | 0) | 0) + (u >>> 26) | 0) >>> 26;
a &= 67108863;
}
i.words[s] = o;
r = a;
a = n;
}
0 !== r ? i.words[s] = r : i.length--;
return i.strip();
}(this, e, t) : p(this, e, t);
};
function b(e, t) {
this.x = e;
this.y = t;
}
b.prototype.makeRBT = function(e) {
for (var t = new Array(e), i = s.prototype._countBits(e) - 1, r = 0; r < e; r++) t[r] = this.revBin(r, i, e);
return t;
};
b.prototype.revBin = function(e, t, i) {
if (0 === e || e === i - 1) return e;
for (var r = 0, n = 0; n < t; n++) {
r |= (1 & e) << t - n - 1;
e >>= 1;
}
return r;
};
b.prototype.permute = function(e, t, i, r, n, s) {
for (var a = 0; a < s; a++) {
r[a] = t[e[a]];
n[a] = i[e[a]];
}
};
b.prototype.transform = function(e, t, i, r, n, s) {
this.permute(s, e, t, i, r, n);
for (var a = 1; a < n; a <<= 1) for (var o = a << 1, c = Math.cos(2 * Math.PI / o), h = Math.sin(2 * Math.PI / o), f = 0; f < n; f += o) for (var d = c, u = h, l = 0; l < a; l++) {
var p = i[f + l], b = r[f + l], g = i[f + l + a], y = r[f + l + a], m = d * g - u * y;
y = d * y + u * g;
g = m;
i[f + l] = p + g;
r[f + l] = b + y;
i[f + l + a] = p - g;
r[f + l + a] = b - y;
if (l !== o) {
m = c * d - h * u;
u = c * u + h * d;
d = m;
}
}
};
b.prototype.guessLen13b = function(e, t) {
var i = 1 | Math.max(t, e), r = 1 & i, n = 0;
for (i = i / 2 | 0; i; i >>>= 1) n++;
return 1 << n + 1 + r;
};
b.prototype.conjugate = function(e, t, i) {
if (!(i <= 1)) for (var r = 0; r < i / 2; r++) {
var n = e[r];
e[r] = e[i - r - 1];
e[i - r - 1] = n;
n = t[r];
t[r] = -t[i - r - 1];
t[i - r - 1] = -n;
}
};
b.prototype.normalize13b = function(e, t) {
for (var i = 0, r = 0; r < t / 2; r++) {
var n = 8192 * Math.round(e[2 * r + 1] / t) + Math.round(e[2 * r] / t) + i;
e[r] = 67108863 & n;
i = n < 67108864 ? 0 : n / 67108864 | 0;
}
return e;
};
b.prototype.convert13b = function(e, t, i, n) {
for (var s = 0, a = 0; a < t; a++) {
s += 0 | e[a];
i[2 * a] = 8191 & s;
s >>>= 13;
i[2 * a + 1] = 8191 & s;
s >>>= 13;
}
for (a = 2 * t; a < n; ++a) i[a] = 0;
r(0 === s);
r(0 == (-8192 & s));
};
b.prototype.stub = function(e) {
for (var t = new Array(e), i = 0; i < e; i++) t[i] = 0;
return t;
};
b.prototype.mulp = function(e, t, i) {
var r = 2 * this.guessLen13b(e.length, t.length), n = this.makeRBT(r), s = this.stub(r), a = new Array(r), o = new Array(r), c = new Array(r), h = new Array(r), f = new Array(r), d = new Array(r), u = i.words;
u.length = r;
this.convert13b(e.words, e.length, a, r);
this.convert13b(t.words, t.length, h, r);
this.transform(a, s, o, c, r, n);
this.transform(h, s, f, d, r, n);
for (var l = 0; l < r; l++) {
var p = o[l] * f[l] - c[l] * d[l];
c[l] = o[l] * d[l] + c[l] * f[l];
o[l] = p;
}
this.conjugate(o, c, r);
this.transform(o, c, u, s, r, n);
this.conjugate(u, s, r);
this.normalize13b(u, r);
i.negative = e.negative ^ t.negative;
i.length = e.length + t.length;
return i.strip();
};
s.prototype.mul = function(e) {
var t = new s(null);
t.words = new Array(this.length + e.length);
return this.mulTo(e, t);
};
s.prototype.mulf = function(e) {
var t = new s(null);
t.words = new Array(this.length + e.length);
return p(this, e, t);
};
s.prototype.imul = function(e) {
return this.clone().mulTo(e, this);
};
s.prototype.imuln = function(e) {
r("number" == typeof e);
r(e < 67108864);
for (var t = 0, i = 0; i < this.length; i++) {
var n = (0 | this.words[i]) * e, s = (67108863 & n) + (67108863 & t);
t >>= 26;
t += n / 67108864 | 0;
t += s >>> 26;
this.words[i] = 67108863 & s;
}
if (0 !== t) {
this.words[i] = t;
this.length++;
}
return this;
};
s.prototype.muln = function(e) {
return this.clone().imuln(e);
};
s.prototype.sqr = function() {
return this.mul(this);
};
s.prototype.isqr = function() {
return this.imul(this.clone());
};
s.prototype.pow = function(e) {
var t = function(e) {
for (var t = new Array(e.bitLength()), i = 0; i < t.length; i++) {
var r = i / 26 | 0, n = i % 26;
t[i] = (e.words[r] & 1 << n) >>> n;
}
return t;
}(e);
if (0 === t.length) return new s(1);
for (var i = this, r = 0; r < t.length && 0 === t[r]; r++, i = i.sqr()) ;
if (++r < t.length) for (var n = i.sqr(); r < t.length; r++, n = n.sqr()) 0 !== t[r] && (i = i.mul(n));
return i;
};
s.prototype.iushln = function(e) {
r("number" == typeof e && e >= 0);
var t, i = e % 26, n = (e - i) / 26, s = 67108863 >>> 26 - i << 26 - i;
if (0 !== i) {
var a = 0;
for (t = 0; t < this.length; t++) {
var o = this.words[t] & s, c = (0 | this.words[t]) - o << i;
this.words[t] = c | a;
a = o >>> 26 - i;
}
if (a) {
this.words[t] = a;
this.length++;
}
}
if (0 !== n) {
for (t = this.length - 1; t >= 0; t--) this.words[t + n] = this.words[t];
for (t = 0; t < n; t++) this.words[t] = 0;
this.length += n;
}
return this.strip();
};
s.prototype.ishln = function(e) {
r(0 === this.negative);
return this.iushln(e);
};
s.prototype.iushrn = function(e, t, i) {
r("number" == typeof e && e >= 0);
var n;
n = t ? (t - t % 26) / 26 : 0;
var s = e % 26, a = Math.min((e - s) / 26, this.length), o = 67108863 ^ 67108863 >>> s << s, c = i;
n -= a;
n = Math.max(0, n);
if (c) {
for (var h = 0; h < a; h++) c.words[h] = this.words[h];
c.length = a;
}
if (0 === a) ; else if (this.length > a) {
this.length -= a;
for (h = 0; h < this.length; h++) this.words[h] = this.words[h + a];
} else {
this.words[0] = 0;
this.length = 1;
}
var f = 0;
for (h = this.length - 1; h >= 0 && (0 !== f || h >= n); h--) {
var d = 0 | this.words[h];
this.words[h] = f << 26 - s | d >>> s;
f = d & o;
}
c && 0 !== f && (c.words[c.length++] = f);
if (0 === this.length) {
this.words[0] = 0;
this.length = 1;
}
return this.strip();
};
s.prototype.ishrn = function(e, t, i) {
r(0 === this.negative);
return this.iushrn(e, t, i);
};
s.prototype.shln = function(e) {
return this.clone().ishln(e);
};
s.prototype.ushln = function(e) {
return this.clone().iushln(e);
};
s.prototype.shrn = function(e) {
return this.clone().ishrn(e);
};
s.prototype.ushrn = function(e) {
return this.clone().iushrn(e);
};
s.prototype.testn = function(e) {
r("number" == typeof e && e >= 0);
var t = e % 26, i = (e - t) / 26, n = 1 << t;
return !(this.length <= i) && !!(this.words[i] & n);
};
s.prototype.imaskn = function(e) {
r("number" == typeof e && e >= 0);
var t = e % 26, i = (e - t) / 26;
r(0 === this.negative, "imaskn works only with positive numbers");
if (this.length <= i) return this;
0 !== t && i++;
this.length = Math.min(i, this.length);
if (0 !== t) {
var n = 67108863 ^ 67108863 >>> t << t;
this.words[this.length - 1] &= n;
}
return this.strip();
};
s.prototype.maskn = function(e) {
return this.clone().imaskn(e);
};
s.prototype.iaddn = function(e) {
r("number" == typeof e);
r(e < 67108864);
if (e < 0) return this.isubn(-e);
if (0 !== this.negative) {
if (1 === this.length && (0 | this.words[0]) < e) {
this.words[0] = e - (0 | this.words[0]);
this.negative = 0;
return this;
}
this.negative = 0;
this.isubn(e);
this.negative = 1;
return this;
}
return this._iaddn(e);
};
s.prototype._iaddn = function(e) {
this.words[0] += e;
for (var t = 0; t < this.length && this.words[t] >= 67108864; t++) {
this.words[t] -= 67108864;
t === this.length - 1 ? this.words[t + 1] = 1 : this.words[t + 1]++;
}
this.length = Math.max(this.length, t + 1);
return this;
};
s.prototype.isubn = function(e) {
r("number" == typeof e);
r(e < 67108864);
if (e < 0) return this.iaddn(-e);
if (0 !== this.negative) {
this.negative = 0;
this.iaddn(e);
this.negative = 1;
return this;
}
this.words[0] -= e;
if (1 === this.length && this.words[0] < 0) {
this.words[0] = -this.words[0];
this.negative = 1;
} else for (var t = 0; t < this.length && this.words[t] < 0; t++) {
this.words[t] += 67108864;
this.words[t + 1] -= 1;
}
return this.strip();
};
s.prototype.addn = function(e) {
return this.clone().iaddn(e);
};
s.prototype.subn = function(e) {
return this.clone().isubn(e);
};
s.prototype.iabs = function() {
this.negative = 0;
return this;
};
s.prototype.abs = function() {
return this.clone().iabs();
};
s.prototype._ishlnsubmul = function(e, t, i) {
var n, s, a = e.length + i;
this._expand(a);
var o = 0;
for (n = 0; n < e.length; n++) {
s = (0 | this.words[n + i]) + o;
var c = (0 | e.words[n]) * t;
o = ((s -= 67108863 & c) >> 26) - (c / 67108864 | 0);
this.words[n + i] = 67108863 & s;
}
for (;n < this.length - i; n++) {
o = (s = (0 | this.words[n + i]) + o) >> 26;
this.words[n + i] = 67108863 & s;
}
if (0 === o) return this.strip();
r(-1 === o);
o = 0;
for (n = 0; n < this.length; n++) {
o = (s = -(0 | this.words[n]) + o) >> 26;
this.words[n] = 67108863 & s;
}
this.negative = 1;
return this.strip();
};
s.prototype._wordDiv = function(e, t) {
var i = (this.length, e.length), r = this.clone(), n = e, a = 0 | n.words[n.length - 1];
if (0 !== (i = 26 - this._countBits(a))) {
n = n.ushln(i);
r.iushln(i);
a = 0 | n.words[n.length - 1];
}
var o, c = r.length - n.length;
if ("mod" !== t) {
(o = new s(null)).length = c + 1;
o.words = new Array(o.length);
for (var h = 0; h < o.length; h++) o.words[h] = 0;
}
var f = r.clone()._ishlnsubmul(n, 1, c);
if (0 === f.negative) {
r = f;
o && (o.words[c] = 1);
}
for (var d = c - 1; d >= 0; d--) {
var u = 67108864 * (0 | r.words[n.length + d]) + (0 | r.words[n.length + d - 1]);
u = Math.min(u / a | 0, 67108863);
r._ishlnsubmul(n, u, d);
for (;0 !== r.negative; ) {
u--;
r.negative = 0;
r._ishlnsubmul(n, 1, d);
r.isZero() || (r.negative ^= 1);
}
o && (o.words[d] = u);
}
o && o.strip();
r.strip();
"div" !== t && 0 !== i && r.iushrn(i);
return {
div: o || null,
mod: r
};
};
s.prototype.divmod = function(e, t, i) {
r(!e.isZero());
if (this.isZero()) return {
div: new s(0),
mod: new s(0)
};
var n, a, o;
if (0 !== this.negative && 0 === e.negative) {
o = this.neg().divmod(e, t);
"mod" !== t && (n = o.div.neg());
if ("div" !== t) {
a = o.mod.neg();
i && 0 !== a.negative && a.iadd(e);
}
return {
div: n,
mod: a
};
}
if (0 === this.negative && 0 !== e.negative) {
o = this.divmod(e.neg(), t);
"mod" !== t && (n = o.div.neg());
return {
div: n,
mod: o.mod
};
}
if (0 != (this.negative & e.negative)) {
o = this.neg().divmod(e.neg(), t);
if ("div" !== t) {
a = o.mod.neg();
i && 0 !== a.negative && a.isub(e);
}
return {
div: o.div,
mod: a
};
}
return e.length > this.length || this.cmp(e) < 0 ? {
div: new s(0),
mod: this
} : 1 === e.length ? "div" === t ? {
div: this.divn(e.words[0]),
mod: null
} : "mod" === t ? {
div: null,
mod: new s(this.modn(e.words[0]))
} : {
div: this.divn(e.words[0]),
mod: new s(this.modn(e.words[0]))
} : this._wordDiv(e, t);
};
s.prototype.div = function(e) {
return this.divmod(e, "div", !1).div;
};
s.prototype.mod = function(e) {
return this.divmod(e, "mod", !1).mod;
};
s.prototype.umod = function(e) {
return this.divmod(e, "mod", !0).mod;
};
s.prototype.divRound = function(e) {
var t = this.divmod(e);
if (t.mod.isZero()) return t.div;
var i = 0 !== t.div.negative ? t.mod.isub(e) : t.mod, r = e.ushrn(1), n = e.andln(1), s = i.cmp(r);
return s < 0 || 1 === n && 0 === s ? t.div : 0 !== t.div.negative ? t.div.isubn(1) : t.div.iaddn(1);
};
s.prototype.modn = function(e) {
r(e <= 67108863);
for (var t = (1 << 26) % e, i = 0, n = this.length - 1; n >= 0; n--) i = (t * i + (0 | this.words[n])) % e;
return i;
};
s.prototype.idivn = function(e) {
r(e <= 67108863);
for (var t = 0, i = this.length - 1; i >= 0; i--) {
var n = (0 | this.words[i]) + 67108864 * t;
this.words[i] = n / e | 0;
t = n % e;
}
return this.strip();
};
s.prototype.divn = function(e) {
return this.clone().idivn(e);
};
s.prototype.egcd = function(e) {
r(0 === e.negative);
r(!e.isZero());
var t = this, i = e.clone();
t = 0 !== t.negative ? t.umod(e) : t.clone();
for (var n = new s(1), a = new s(0), o = new s(0), c = new s(1), h = 0; t.isEven() && i.isEven(); ) {
t.iushrn(1);
i.iushrn(1);
++h;
}
for (var f = i.clone(), d = t.clone(); !t.isZero(); ) {
for (var u = 0, l = 1; 0 == (t.words[0] & l) && u < 26; ++u, l <<= 1) ;
if (u > 0) {
t.iushrn(u);
for (;u-- > 0; ) {
if (n.isOdd() || a.isOdd()) {
n.iadd(f);
a.isub(d);
}
n.iushrn(1);
a.iushrn(1);
}
}
for (var p = 0, b = 1; 0 == (i.words[0] & b) && p < 26; ++p, b <<= 1) ;
if (p > 0) {
i.iushrn(p);
for (;p-- > 0; ) {
if (o.isOdd() || c.isOdd()) {
o.iadd(f);
c.isub(d);
}
o.iushrn(1);
c.iushrn(1);
}
}
if (t.cmp(i) >= 0) {
t.isub(i);
n.isub(o);
a.isub(c);
} else {
i.isub(t);
o.isub(n);
c.isub(a);
}
}
return {
a: o,
b: c,
gcd: i.iushln(h)
};
};
s.prototype._invmp = function(e) {
r(0 === e.negative);
r(!e.isZero());
var t = this, i = e.clone();
t = 0 !== t.negative ? t.umod(e) : t.clone();
for (var n, a = new s(1), o = new s(0), c = i.clone(); t.cmpn(1) > 0 && i.cmpn(1) > 0; ) {
for (var h = 0, f = 1; 0 == (t.words[0] & f) && h < 26; ++h, f <<= 1) ;
if (h > 0) {
t.iushrn(h);
for (;h-- > 0; ) {
a.isOdd() && a.iadd(c);
a.iushrn(1);
}
}
for (var d = 0, u = 1; 0 == (i.words[0] & u) && d < 26; ++d, u <<= 1) ;
if (d > 0) {
i.iushrn(d);
for (;d-- > 0; ) {
o.isOdd() && o.iadd(c);
o.iushrn(1);
}
}
if (t.cmp(i) >= 0) {
t.isub(i);
a.isub(o);
} else {
i.isub(t);
o.isub(a);
}
}
(n = 0 === t.cmpn(1) ? a : o).cmpn(0) < 0 && n.iadd(e);
return n;
};
s.prototype.gcd = function(e) {
if (this.isZero()) return e.abs();
if (e.isZero()) return this.abs();
var t = this.clone(), i = e.clone();
t.negative = 0;
i.negative = 0;
for (var r = 0; t.isEven() && i.isEven(); r++) {
t.iushrn(1);
i.iushrn(1);
}
for (;;) {
for (;t.isEven(); ) t.iushrn(1);
for (;i.isEven(); ) i.iushrn(1);
var n = t.cmp(i);
if (n < 0) {
var s = t;
t = i;
i = s;
} else if (0 === n || 0 === i.cmpn(1)) break;
t.isub(i);
}
return i.iushln(r);
};
s.prototype.invm = function(e) {
return this.egcd(e).a.umod(e);
};
s.prototype.isEven = function() {
return 0 == (1 & this.words[0]);
};
s.prototype.isOdd = function() {
return 1 == (1 & this.words[0]);
};
s.prototype.andln = function(e) {
return this.words[0] & e;
};
s.prototype.bincn = function(e) {
r("number" == typeof e);
var t = e % 26, i = (e - t) / 26, n = 1 << t;
if (this.length <= i) {
this._expand(i + 1);
this.words[i] |= n;
return this;
}
for (var s = n, a = i; 0 !== s && a < this.length; a++) {
var o = 0 | this.words[a];
s = (o += s) >>> 26;
o &= 67108863;
this.words[a] = o;
}
if (0 !== s) {
this.words[a] = s;
this.length++;
}
return this;
};
s.prototype.isZero = function() {
return 1 === this.length && 0 === this.words[0];
};
s.prototype.cmpn = function(e) {
var t, i = e < 0;
if (0 !== this.negative && !i) return -1;
if (0 === this.negative && i) return 1;
this.strip();
if (this.length > 1) t = 1; else {
i && (e = -e);
r(e <= 67108863, "Number is too big");
var n = 0 | this.words[0];
t = n === e ? 0 : n < e ? -1 : 1;
}
return 0 !== this.negative ? 0 | -t : t;
};
s.prototype.cmp = function(e) {
if (0 !== this.negative && 0 === e.negative) return -1;
if (0 === this.negative && 0 !== e.negative) return 1;
var t = this.ucmp(e);
return 0 !== this.negative ? 0 | -t : t;
};
s.prototype.ucmp = function(e) {
if (this.length > e.length) return 1;
if (this.length < e.length) return -1;
for (var t = 0, i = this.length - 1; i >= 0; i--) {
var r = 0 | this.words[i], n = 0 | e.words[i];
if (r !== n) {
r < n ? t = -1 : r > n && (t = 1);
break;
}
}
return t;
};
s.prototype.gtn = function(e) {
return 1 === this.cmpn(e);
};
s.prototype.gt = function(e) {
return 1 === this.cmp(e);
};
s.prototype.gten = function(e) {
return this.cmpn(e) >= 0;
};
s.prototype.gte = function(e) {
return this.cmp(e) >= 0;
};
s.prototype.ltn = function(e) {
return -1 === this.cmpn(e);
};
s.prototype.lt = function(e) {
return -1 === this.cmp(e);
};
s.prototype.lten = function(e) {
return this.cmpn(e) <= 0;
};
s.prototype.lte = function(e) {
return this.cmp(e) <= 0;
};
s.prototype.eqn = function(e) {
return 0 === this.cmpn(e);
};
s.prototype.eq = function(e) {
return 0 === this.cmp(e);
};
s.red = function(e) {
return new x(e);
};
s.prototype.toRed = function(e) {
r(!this.red, "Already a number in reduction context");
r(0 === this.negative, "red works only with positives");
return e.convertTo(this)._forceRed(e);
};
s.prototype.fromRed = function() {
r(this.red, "fromRed works only with numbers in reduction context");
return this.red.convertFrom(this);
};
s.prototype._forceRed = function(e) {
this.red = e;
return this;
};
s.prototype.forceRed = function(e) {
r(!this.red, "Already a number in reduction context");
return this._forceRed(e);
};
s.prototype.redAdd = function(e) {
r(this.red, "redAdd works only with red numbers");
return this.red.add(this, e);
};
s.prototype.redIAdd = function(e) {
r(this.red, "redIAdd works only with red numbers");
return this.red.iadd(this, e);
};
s.prototype.redSub = function(e) {
r(this.red, "redSub works only with red numbers");
return this.red.sub(this, e);
};
s.prototype.redISub = function(e) {
r(this.red, "redISub works only with red numbers");
return this.red.isub(this, e);
};
s.prototype.redShl = function(e) {
r(this.red, "redShl works only with red numbers");
return this.red.shl(this, e);
};
s.prototype.redMul = function(e) {
r(this.red, "redMul works only with red numbers");
this.red._verify2(this, e);
return this.red.mul(this, e);
};
s.prototype.redIMul = function(e) {
r(this.red, "redMul works only with red numbers");
this.red._verify2(this, e);
return this.red.imul(this, e);
};
s.prototype.redSqr = function() {
r(this.red, "redSqr works only with red numbers");
this.red._verify1(this);
return this.red.sqr(this);
};
s.prototype.redISqr = function() {
r(this.red, "redISqr works only with red numbers");
this.red._verify1(this);
return this.red.isqr(this);
};
s.prototype.redSqrt = function() {
r(this.red, "redSqrt works only with red numbers");
this.red._verify1(this);
return this.red.sqrt(this);
};
s.prototype.redInvm = function() {
r(this.red, "redInvm works only with red numbers");
this.red._verify1(this);
return this.red.invm(this);
};
s.prototype.redNeg = function() {
r(this.red, "redNeg works only with red numbers");
this.red._verify1(this);
return this.red.neg(this);
};
s.prototype.redPow = function(e) {
r(this.red && !e.red, "redPow(normalNum)");
this.red._verify1(this);
return this.red.pow(this, e);
};
var g = {
k256: null,
p224: null,
p192: null,
p25519: null
};
function y(e, t) {
this.name = e;
this.p = new s(t, 16);
this.n = this.p.bitLength();
this.k = new s(1).iushln(this.n).isub(this.p);
this.tmp = this._tmp();
}
y.prototype._tmp = function() {
var e = new s(null);
e.words = new Array(Math.ceil(this.n / 13));
return e;
};
y.prototype.ireduce = function(e) {
var t, i = e;
do {
this.split(i, this.tmp);
t = (i = (i = this.imulK(i)).iadd(this.tmp)).bitLength();
} while (t > this.n);
var r = t < this.n ? -1 : i.ucmp(this.p);
if (0 === r) {
i.words[0] = 0;
i.length = 1;
} else r > 0 ? i.isub(this.p) : i.strip();
return i;
};
y.prototype.split = function(e, t) {
e.iushrn(this.n, 0, t);
};
y.prototype.imulK = function(e) {
return e.imul(this.k);
};
function m() {
y.call(this, "k256", "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f");
}
n(m, y);
m.prototype.split = function(e, t) {
for (var i = Math.min(e.length, 9), r = 0; r < i; r++) t.words[r] = e.words[r];
t.length = i;
if (e.length <= 9) {
e.words[0] = 0;
e.length = 1;
} else {
var n = e.words[9];
t.words[t.length++] = 4194303 & n;
for (r = 10; r < e.length; r++) {
var s = 0 | e.words[r];
e.words[r - 10] = (4194303 & s) << 4 | n >>> 22;
n = s;
}
n >>>= 22;
e.words[r - 10] = n;
0 === n && e.length > 10 ? e.length -= 10 : e.length -= 9;
}
};
m.prototype.imulK = function(e) {
e.words[e.length] = 0;
e.words[e.length + 1] = 0;
e.length += 2;
for (var t = 0, i = 0; i < e.length; i++) {
var r = 0 | e.words[i];
t += 977 * r;
e.words[i] = 67108863 & t;
t = 64 * r + (t / 67108864 | 0);
}
if (0 === e.words[e.length - 1]) {
e.length--;
0 === e.words[e.length - 1] && e.length--;
}
return e;
};
function v() {
y.call(this, "p224", "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001");
}
n(v, y);
function _() {
y.call(this, "p192", "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff");
}
n(_, y);
function w() {
y.call(this, "25519", "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed");
}
n(w, y);
w.prototype.imulK = function(e) {
for (var t = 0, i = 0; i < e.length; i++) {
var r = 19 * (0 | e.words[i]) + t, n = 67108863 & r;
r >>>= 26;
e.words[i] = n;
t = r;
}
0 !== t && (e.words[e.length++] = t);
return e;
};
s._prime = function(e) {
if (g[e]) return g[e];
var t;
if ("k256" === e) t = new m(); else if ("p224" === e) t = new v(); else if ("p192" === e) t = new _(); else {
if ("p25519" !== e) throw new Error("Unknown prime " + e);
t = new w();
}
g[e] = t;
return t;
};
function x(e) {
if ("string" == typeof e) {
var t = s._prime(e);
this.m = t.p;
this.prime = t;
} else {
r(e.gtn(1), "modulus must be greater than 1");
this.m = e;
this.prime = null;
}
}
x.prototype._verify1 = function(e) {
r(0 === e.negative, "red works only with positives");
r(e.red, "red works only with red numbers");
};
x.prototype._verify2 = function(e, t) {
r(0 == (e.negative | t.negative), "red works only with positives");
r(e.red && e.red === t.red, "red works only with red numbers");
};
x.prototype.imod = function(e) {
return this.prime ? this.prime.ireduce(e)._forceRed(this) : e.umod(this.m)._forceRed(this);
};
x.prototype.neg = function(e) {
return e.isZero() ? e.clone() : this.m.sub(e)._forceRed(this);
};
x.prototype.add = function(e, t) {
this._verify2(e, t);
var i = e.add(t);
i.cmp(this.m) >= 0 && i.isub(this.m);
return i._forceRed(this);
};
x.prototype.iadd = function(e, t) {
this._verify2(e, t);
var i = e.iadd(t);
i.cmp(this.m) >= 0 && i.isub(this.m);
return i;
};
x.prototype.sub = function(e, t) {
this._verify2(e, t);
var i = e.sub(t);
i.cmpn(0) < 0 && i.iadd(this.m);
return i._forceRed(this);
};
x.prototype.isub = function(e, t) {
this._verify2(e, t);
var i = e.isub(t);
i.cmpn(0) < 0 && i.iadd(this.m);
return i;
};
x.prototype.shl = function(e, t) {
this._verify1(e);
return this.imod(e.ushln(t));
};
x.prototype.imul = function(e, t) {
this._verify2(e, t);
return this.imod(e.imul(t));
};
x.prototype.mul = function(e, t) {
this._verify2(e, t);
return this.imod(e.mul(t));
};
x.prototype.isqr = function(e) {
return this.imul(e, e.clone());
};
x.prototype.sqr = function(e) {
return this.mul(e, e);
};
x.prototype.sqrt = function(e) {
if (e.isZero()) return e.clone();
var t = this.m.andln(3);
r(t % 2 == 1);
if (3 === t) {
var i = this.m.add(new s(1)).iushrn(2);
return this.pow(e, i);
}
for (var n = this.m.subn(1), a = 0; !n.isZero() && 0 === n.andln(1); ) {
a++;
n.iushrn(1);
}
r(!n.isZero());
var o = new s(1).toRed(this), c = o.redNeg(), h = this.m.subn(1).iushrn(1), f = this.m.bitLength();
f = new s(2 * f * f).toRed(this);
for (;0 !== this.pow(f, h).cmp(c); ) f.redIAdd(c);
for (var d = this.pow(f, n), u = this.pow(e, n.addn(1).iushrn(1)), l = this.pow(e, n), p = a; 0 !== l.cmp(o); ) {
for (var b = l, g = 0; 0 !== b.cmp(o); g++) b = b.redSqr();
r(g < p);
var y = this.pow(d, new s(1).iushln(p - g - 1));
u = u.redMul(y);
d = y.redSqr();
l = l.redMul(d);
p = g;
}
return u;
};
x.prototype.invm = function(e) {
var t = e._invmp(this.m);
if (0 !== t.negative) {
t.negative = 0;
return this.imod(t).redNeg();
}
return this.imod(t);
};
x.prototype.pow = function(e, t) {
if (t.isZero()) return new s(1).toRed(this);
if (0 === t.cmpn(1)) return e.clone();
var i = new Array(16);
i[0] = new s(1).toRed(this);
i[1] = e;
for (var r = 2; r < i.length; r++) i[r] = this.mul(i[r - 1], e);
var n = i[0], a = 0, o = 0, c = t.bitLength() % 26;
0 === c && (c = 26);
for (r = t.length - 1; r >= 0; r--) {
for (var h = t.words[r], f = c - 1; f >= 0; f--) {
var d = h >> f & 1;
n !== i[0] && (n = this.sqr(n));
if (0 !== d || 0 !== a) {
a <<= 1;
a |= d;
if (4 === ++o || 0 === r && 0 === f) {
n = this.mul(n, i[a]);
o = 0;
a = 0;
}
} else o = 0;
}
c = 26;
}
return n;
};
x.prototype.convertTo = function(e) {
var t = e.umod(this.m);
return t === e ? t.clone() : t;
};
x.prototype.convertFrom = function(e) {
var t = e.clone();
t.red = null;
return t;
};
s.mont = function(e) {
return new C(e);
};
function C(e) {
x.call(this, e);
this.shift = this.m.bitLength();
this.shift % 26 != 0 && (this.shift += 26 - this.shift % 26);
this.r = new s(1).iushln(this.shift);
this.r2 = this.imod(this.r.sqr());
this.rinv = this.r._invmp(this.m);
this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
this.minv = this.minv.umod(this.r);
this.minv = this.r.sub(this.minv);
}
n(C, x);
C.prototype.convertTo = function(e) {
return this.imod(e.ushln(this.shift));
};
C.prototype.convertFrom = function(e) {
var t = this.imod(e.mul(this.rinv));
t.red = null;
return t;
};
C.prototype.imul = function(e, t) {
if (e.isZero() || t.isZero()) {
e.words[0] = 0;
e.length = 1;
return e;
}
var i = e.imul(t), r = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), n = i.isub(r).iushrn(this.shift), s = n;
n.cmp(this.m) >= 0 ? s = n.isub(this.m) : n.cmpn(0) < 0 && (s = n.iadd(this.m));
return s._forceRed(this);
};
C.prototype.mul = function(e, t) {
if (e.isZero() || t.isZero()) return new s(0)._forceRed(this);
var i = e.mul(t), r = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), n = i.isub(r).iushrn(this.shift), a = n;
n.cmp(this.m) >= 0 ? a = n.isub(this.m) : n.cmpn(0) < 0 && (a = n.iadd(this.m));
return a._forceRed(this);
};
C.prototype.invm = function(e) {
return this.imod(e._invmp(this.m).mul(this.r2))._forceRed(this);
};
})("undefined" == typeof t || t, this);
}, {
buffer: 18
} ],
17: [ function(e, t, i) {
var r;
t.exports = function(e) {
r || (r = new n(null));
return r.generate(e);
};
function n(e) {
this.rand = e;
}
t.exports.Rand = n;
n.prototype.generate = function(e) {
return this._rand(e);
};
n.prototype._rand = function(e) {
if (this.rand.getBytes) return this.rand.getBytes(e);
for (var t = new Uint8Array(e), i = 0; i < t.length; i++) t[i] = this.rand.getByte();
return t;
};
if ("object" == typeof self) self.crypto && self.crypto.getRandomValues ? n.prototype._rand = function(e) {
var t = new Uint8Array(e);
self.crypto.getRandomValues(t);
return t;
} : self.msCrypto && self.msCrypto.getRandomValues ? n.prototype._rand = function(e) {
var t = new Uint8Array(e);
self.msCrypto.getRandomValues(t);
return t;
} : "object" == typeof window && (n.prototype._rand = function() {
throw new Error("Not implemented yet");
}); else try {
var s = e("crypto");
if ("function" != typeof s.randomBytes) throw new Error("Not supported");
n.prototype._rand = function(e) {
return s.randomBytes(e);
};
} catch (e) {}
}, {
crypto: 18
} ],
18: [ function(e, t, i) {}, {} ],
19: [ function(e, t, i) {
var r = e("safe-buffer").Buffer;
function n(e) {
r.isBuffer(e) || (e = r.from(e));
for (var t = e.length / 4 | 0, i = new Array(t), n = 0; n < t; n++) i[n] = e.readUInt32BE(4 * n);
return i;
}
function s(e) {
for (;0 < e.length; e++) e[0] = 0;
}
function a(e, t, i, r, n) {
for (var s, a, o, c, h = i[0], f = i[1], d = i[2], u = i[3], l = e[0] ^ t[0], p = e[1] ^ t[1], b = e[2] ^ t[2], g = e[3] ^ t[3], y = 4, m = 1; m < n; m++) {
s = h[l >>> 24] ^ f[p >>> 16 & 255] ^ d[b >>> 8 & 255] ^ u[255 & g] ^ t[y++];
a = h[p >>> 24] ^ f[b >>> 16 & 255] ^ d[g >>> 8 & 255] ^ u[255 & l] ^ t[y++];
o = h[b >>> 24] ^ f[g >>> 16 & 255] ^ d[l >>> 8 & 255] ^ u[255 & p] ^ t[y++];
c = h[g >>> 24] ^ f[l >>> 16 & 255] ^ d[p >>> 8 & 255] ^ u[255 & b] ^ t[y++];
l = s;
p = a;
b = o;
g = c;
}
s = (r[l >>> 24] << 24 | r[p >>> 16 & 255] << 16 | r[b >>> 8 & 255] << 8 | r[255 & g]) ^ t[y++];
a = (r[p >>> 24] << 24 | r[b >>> 16 & 255] << 16 | r[g >>> 8 & 255] << 8 | r[255 & l]) ^ t[y++];
o = (r[b >>> 24] << 24 | r[g >>> 16 & 255] << 16 | r[l >>> 8 & 255] << 8 | r[255 & p]) ^ t[y++];
c = (r[g >>> 24] << 24 | r[l >>> 16 & 255] << 16 | r[p >>> 8 & 255] << 8 | r[255 & b]) ^ t[y++];
return [ s >>>= 0, a >>>= 0, o >>>= 0, c >>>= 0 ];
}
var o = [ 0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54 ], c = function() {
for (var e = new Array(256), t = 0; t < 256; t++) e[t] = t < 128 ? t << 1 : t << 1 ^ 283;
for (var i = [], r = [], n = [ [], [], [], [] ], s = [ [], [], [], [] ], a = 0, o = 0, c = 0; c < 256; ++c) {
var h = o ^ o << 1 ^ o << 2 ^ o << 3 ^ o << 4;
h = h >>> 8 ^ 255 & h ^ 99;
i[a] = h;
r[h] = a;
var f = e[a], d = e[f], u = e[d], l = 257 * e[h] ^ 16843008 * h;
n[0][a] = l << 24 | l >>> 8;
n[1][a] = l << 16 | l >>> 16;
n[2][a] = l << 8 | l >>> 24;
n[3][a] = l;
l = 16843009 * u ^ 65537 * d ^ 257 * f ^ 16843008 * a;
s[0][h] = l << 24 | l >>> 8;
s[1][h] = l << 16 | l >>> 16;
s[2][h] = l << 8 | l >>> 24;
s[3][h] = l;
if (0 === a) a = o = 1; else {
a = f ^ e[e[e[u ^ f]]];
o ^= e[e[o]];
}
}
return {
SBOX: i,
INV_SBOX: r,
SUB_MIX: n,
INV_SUB_MIX: s
};
}();
function h(e) {
this._key = n(e);
this._reset();
}
h.blockSize = 16;
h.keySize = 32;
h.prototype.blockSize = h.blockSize;
h.prototype.keySize = h.keySize;
h.prototype._reset = function() {
for (var e = this._key, t = e.length, i = t + 6, r = 4 * (i + 1), n = [], s = 0; s < t; s++) n[s] = e[s];
for (s = t; s < r; s++) {
var a = n[s - 1];
if (s % t == 0) {
a = a << 8 | a >>> 24;
a = c.SBOX[a >>> 24] << 24 | c.SBOX[a >>> 16 & 255] << 16 | c.SBOX[a >>> 8 & 255] << 8 | c.SBOX[255 & a];
a ^= o[s / t | 0] << 24;
} else t > 6 && s % t == 4 && (a = c.SBOX[a >>> 24] << 24 | c.SBOX[a >>> 16 & 255] << 16 | c.SBOX[a >>> 8 & 255] << 8 | c.SBOX[255 & a]);
n[s] = n[s - t] ^ a;
}
for (var h = [], f = 0; f < r; f++) {
var d = r - f, u = n[d - (f % 4 ? 0 : 4)];
h[f] = f < 4 || d <= 4 ? u : c.INV_SUB_MIX[0][c.SBOX[u >>> 24]] ^ c.INV_SUB_MIX[1][c.SBOX[u >>> 16 & 255]] ^ c.INV_SUB_MIX[2][c.SBOX[u >>> 8 & 255]] ^ c.INV_SUB_MIX[3][c.SBOX[255 & u]];
}
this._nRounds = i;
this._keySchedule = n;
this._invKeySchedule = h;
};
h.prototype.encryptBlockRaw = function(e) {
return a(e = n(e), this._keySchedule, c.SUB_MIX, c.SBOX, this._nRounds);
};
h.prototype.encryptBlock = function(e) {
var t = this.encryptBlockRaw(e), i = r.allocUnsafe(16);
i.writeUInt32BE(t[0], 0);
i.writeUInt32BE(t[1], 4);
i.writeUInt32BE(t[2], 8);
i.writeUInt32BE(t[3], 12);
return i;
};
h.prototype.decryptBlock = function(e) {
var t = (e = n(e))[1];
e[1] = e[3];
e[3] = t;
var i = a(e, this._invKeySchedule, c.INV_SUB_MIX, c.INV_SBOX, this._nRounds), s = r.allocUnsafe(16);
s.writeUInt32BE(i[0], 0);
s.writeUInt32BE(i[3], 4);
s.writeUInt32BE(i[2], 8);
s.writeUInt32BE(i[1], 12);
return s;
};
h.prototype.scrub = function() {
s(this._keySchedule);
s(this._invKeySchedule);
s(this._key);
};
t.exports.AES = h;
}, {
"safe-buffer": 143
} ],
20: [ function(e, t, i) {
var r = e("./aes"), n = e("safe-buffer").Buffer, s = e("cipher-base"), a = e("inherits"), o = e("./ghash"), c = e("buffer-xor"), h = e("./incr32");
function f(e, t, i, a) {
s.call(this);
var c = n.alloc(4, 0);
this._cipher = new r.AES(t);
var f = this._cipher.encryptBlock(c);
this._ghash = new o(f);
i = function(e, t, i) {
if (12 === t.length) {
e._finID = n.concat([ t, n.from([ 0, 0, 0, 1 ]) ]);
return n.concat([ t, n.from([ 0, 0, 0, 2 ]) ]);
}
var r = new o(i), s = t.length, a = s % 16;
r.update(t);
if (a) {
a = 16 - a;
r.update(n.alloc(a, 0));
}
r.update(n.alloc(8, 0));
var c = 8 * s, f = n.alloc(8);
f.writeUIntBE(c, 0, 8);
r.update(f);
e._finID = r.state;
var d = n.from(e._finID);
h(d);
return d;
}(this, i, f);
this._prev = n.from(i);
this._cache = n.allocUnsafe(0);
this._secCache = n.allocUnsafe(0);
this._decrypt = a;
this._alen = 0;
this._len = 0;
this._mode = e;
this._authTag = null;
this._called = !1;
}
a(f, s);
f.prototype._update = function(e) {
if (!this._called && this._alen) {
var t = 16 - this._alen % 16;
if (t < 16) {
t = n.alloc(t, 0);
this._ghash.update(t);
}
}
this._called = !0;
var i = this._mode.encrypt(this, e);
this._decrypt ? this._ghash.update(e) : this._ghash.update(i);
this._len += e.length;
return i;
};
f.prototype._final = function() {
if (this._decrypt && !this._authTag) throw new Error("Unsupported state or unable to authenticate data");
var e = c(this._ghash.final(8 * this._alen, 8 * this._len), this._cipher.encryptBlock(this._finID));
if (this._decrypt && function(e, t) {
var i = 0;
e.length !== t.length && i++;
for (var r = Math.min(e.length, t.length), n = 0; n < r; ++n) i += e[n] ^ t[n];
return i;
}(e, this._authTag)) throw new Error("Unsupported state or unable to authenticate data");
this._authTag = e;
this._cipher.scrub();
};
f.prototype.getAuthTag = function() {
if (this._decrypt || !n.isBuffer(this._authTag)) throw new Error("Attempting to get auth tag in unsupported state");
return this._authTag;
};
f.prototype.setAuthTag = function(e) {
if (!this._decrypt) throw new Error("Attempting to set auth tag in unsupported state");
this._authTag = e;
};
f.prototype.setAAD = function(e) {
if (this._called) throw new Error("Attempting to set AAD in unsupported state");
this._ghash.update(e);
this._alen += e.length;
};
t.exports = f;
}, {
"./aes": 19,
"./ghash": 24,
"./incr32": 25,
"buffer-xor": 46,
"cipher-base": 49,
inherits: 101,
"safe-buffer": 143
} ],
21: [ function(e, t, i) {
var r = e("./encrypter"), n = e("./decrypter"), s = e("./modes/list.json");
i.createCipher = i.Cipher = r.createCipher;
i.createCipheriv = i.Cipheriv = r.createCipheriv;
i.createDecipher = i.Decipher = n.createDecipher;
i.createDecipheriv = i.Decipheriv = n.createDecipheriv;
i.listCiphers = i.getCiphers = function() {
return Object.keys(s);
};
}, {
"./decrypter": 22,
"./encrypter": 23,
"./modes/list.json": 33
} ],
22: [ function(e, t, i) {
var r = e("./authCipher"), n = e("safe-buffer").Buffer, s = e("./modes"), a = e("./streamCipher"), o = e("cipher-base"), c = e("./aes"), h = e("evp_bytestokey");
function f(e, t, i) {
o.call(this);
this._cache = new d();
this._last = void 0;
this._cipher = new c.AES(t);
this._prev = n.from(i);
this._mode = e;
this._autopadding = !0;
}
e("inherits")(f, o);
f.prototype._update = function(e) {
this._cache.add(e);
for (var t, i, r = []; t = this._cache.get(this._autopadding); ) {
i = this._mode.decrypt(this, t);
r.push(i);
}
return n.concat(r);
};
f.prototype._final = function() {
var e = this._cache.flush();
if (this._autopadding) return function(e) {
var t = e[15];
if (t < 1 || t > 16) throw new Error("unable to decrypt data");
var i = -1;
for (;++i < t; ) if (e[i + (16 - t)] !== t) throw new Error("unable to decrypt data");
if (16 === t) return;
return e.slice(0, 16 - t);
}(this._mode.decrypt(this, e));
if (e) throw new Error("data not multiple of block length");
};
f.prototype.setAutoPadding = function(e) {
this._autopadding = !!e;
return this;
};
function d() {
this.cache = n.allocUnsafe(0);
}
d.prototype.add = function(e) {
this.cache = n.concat([ this.cache, e ]);
};
d.prototype.get = function(e) {
var t;
if (e) {
if (this.cache.length > 16) {
t = this.cache.slice(0, 16);
this.cache = this.cache.slice(16);
return t;
}
} else if (this.cache.length >= 16) {
t = this.cache.slice(0, 16);
this.cache = this.cache.slice(16);
return t;
}
return null;
};
d.prototype.flush = function() {
if (this.cache.length) return this.cache;
};
function u(e, t, i) {
var o = s[e.toLowerCase()];
if (!o) throw new TypeError("invalid suite type");
"string" == typeof i && (i = n.from(i));
if ("GCM" !== o.mode && i.length !== o.iv) throw new TypeError("invalid iv length " + i.length);
"string" == typeof t && (t = n.from(t));
if (t.length !== o.key / 8) throw new TypeError("invalid key length " + t.length);
return "stream" === o.type ? new a(o.module, t, i, !0) : "auth" === o.type ? new r(o.module, t, i, !0) : new f(o.module, t, i);
}
i.createDecipher = function(e, t) {
var i = s[e.toLowerCase()];
if (!i) throw new TypeError("invalid suite type");
var r = h(t, !1, i.key, i.iv);
return u(e, r.key, r.iv);
};
i.createDecipheriv = u;
}, {
"./aes": 19,
"./authCipher": 20,
"./modes": 32,
"./streamCipher": 35,
"cipher-base": 49,
evp_bytestokey: 84,
inherits: 101,
"safe-buffer": 143
} ],
23: [ function(e, t, i) {
var r = e("./modes"), n = e("./authCipher"), s = e("safe-buffer").Buffer, a = e("./streamCipher"), o = e("cipher-base"), c = e("./aes"), h = e("evp_bytestokey");
function f(e, t, i) {
o.call(this);
this._cache = new u();
this._cipher = new c.AES(t);
this._prev = s.from(i);
this._mode = e;
this._autopadding = !0;
}
e("inherits")(f, o);
f.prototype._update = function(e) {
this._cache.add(e);
for (var t, i, r = []; t = this._cache.get(); ) {
i = this._mode.encrypt(this, t);
r.push(i);
}
return s.concat(r);
};
var d = s.alloc(16, 16);
f.prototype._final = function() {
var e = this._cache.flush();
if (this._autopadding) {
e = this._mode.encrypt(this, e);
this._cipher.scrub();
return e;
}
if (!e.equals(d)) {
this._cipher.scrub();
throw new Error("data not multiple of block length");
}
};
f.prototype.setAutoPadding = function(e) {
this._autopadding = !!e;
return this;
};
function u() {
this.cache = s.allocUnsafe(0);
}
u.prototype.add = function(e) {
this.cache = s.concat([ this.cache, e ]);
};
u.prototype.get = function() {
if (this.cache.length > 15) {
var e = this.cache.slice(0, 16);
this.cache = this.cache.slice(16);
return e;
}
return null;
};
u.prototype.flush = function() {
for (var e = 16 - this.cache.length, t = s.allocUnsafe(e), i = -1; ++i < e; ) t.writeUInt8(e, i);
return s.concat([ this.cache, t ]);
};
function l(e, t, i) {
var o = r[e.toLowerCase()];
if (!o) throw new TypeError("invalid suite type");
"string" == typeof t && (t = s.from(t));
if (t.length !== o.key / 8) throw new TypeError("invalid key length " + t.length);
"string" == typeof i && (i = s.from(i));
if ("GCM" !== o.mode && i.length !== o.iv) throw new TypeError("invalid iv length " + i.length);
return "stream" === o.type ? new a(o.module, t, i) : "auth" === o.type ? new n(o.module, t, i) : new f(o.module, t, i);
}
i.createCipheriv = l;
i.createCipher = function(e, t) {
var i = r[e.toLowerCase()];
if (!i) throw new TypeError("invalid suite type");
var n = h(t, !1, i.key, i.iv);
return l(e, n.key, n.iv);
};
}, {
"./aes": 19,
"./authCipher": 20,
"./modes": 32,
"./streamCipher": 35,
"cipher-base": 49,
evp_bytestokey: 84,
inherits: 101,
"safe-buffer": 143
} ],
24: [ function(e, t, i) {
var r = e("safe-buffer").Buffer, n = r.alloc(16, 0);
function s(e) {
var t = r.allocUnsafe(16);
t.writeUInt32BE(e[0] >>> 0, 0);
t.writeUInt32BE(e[1] >>> 0, 4);
t.writeUInt32BE(e[2] >>> 0, 8);
t.writeUInt32BE(e[3] >>> 0, 12);
return t;
}
function a(e) {
this.h = e;
this.state = r.alloc(16, 0);
this.cache = r.allocUnsafe(0);
}
a.prototype.ghash = function(e) {
for (var t = -1; ++t < e.length; ) this.state[t] ^= e[t];
this._multiply();
};
a.prototype._multiply = function() {
for (var e, t, i = function(e) {
return [ e.readUInt32BE(0), e.readUInt32BE(4), e.readUInt32BE(8), e.readUInt32BE(12) ];
}(this.h), r = [ 0, 0, 0, 0 ], n = -1; ++n < 128; ) {
if (0 != (this.state[~~(n / 8)] & 1 << 7 - n % 8)) {
r[0] ^= i[0];
r[1] ^= i[1];
r[2] ^= i[2];
r[3] ^= i[3];
}
t = 0 != (1 & i[3]);
for (e = 3; e > 0; e--) i[e] = i[e] >>> 1 | (1 & i[e - 1]) << 31;
i[0] = i[0] >>> 1;
t && (i[0] = i[0] ^ 225 << 24);
}
this.state = s(r);
};
a.prototype.update = function(e) {
this.cache = r.concat([ this.cache, e ]);
for (var t; this.cache.length >= 16; ) {
t = this.cache.slice(0, 16);
this.cache = this.cache.slice(16);
this.ghash(t);
}
};
a.prototype.final = function(e, t) {
this.cache.length && this.ghash(r.concat([ this.cache, n ], 16));
this.ghash(s([ 0, e, 0, t ]));
return this.state;
};
t.exports = a;
}, {
"safe-buffer": 143
} ],
25: [ function(e, t, i) {
t.exports = function(e) {
for (var t, i = e.length; i--; ) {
if (255 !== (t = e.readUInt8(i))) {
t++;
e.writeUInt8(t, i);
break;
}
e.writeUInt8(0, i);
}
};
}, {} ],
26: [ function(e, t, i) {
var r = e("buffer-xor");
i.encrypt = function(e, t) {
var i = r(t, e._prev);
e._prev = e._cipher.encryptBlock(i);
return e._prev;
};
i.decrypt = function(e, t) {
var i = e._prev;
e._prev = t;
var n = e._cipher.decryptBlock(t);
return r(n, i);
};
}, {
"buffer-xor": 46
} ],
27: [ function(e, t, i) {
var r = e("safe-buffer").Buffer, n = e("buffer-xor");
function s(e, t, i) {
var s = t.length, a = n(t, e._cache);
e._cache = e._cache.slice(s);
e._prev = r.concat([ e._prev, i ? t : a ]);
return a;
}
i.encrypt = function(e, t, i) {
for (var n, a = r.allocUnsafe(0); t.length; ) {
if (0 === e._cache.length) {
e._cache = e._cipher.encryptBlock(e._prev);
e._prev = r.allocUnsafe(0);
}
if (!(e._cache.length <= t.length)) {
a = r.concat([ a, s(e, t, i) ]);
break;
}
n = e._cache.length;
a = r.concat([ a, s(e, t.slice(0, n), i) ]);
t = t.slice(n);
}
return a;
};
}, {
"buffer-xor": 46,
"safe-buffer": 143
} ],
28: [ function(e, t, i) {
var r = e("safe-buffer").Buffer;
function n(e, t, i) {
for (var r, n, a, o = -1, c = 0; ++o < 8; ) {
r = e._cipher.encryptBlock(e._prev);
n = t & 1 << 7 - o ? 128 : 0;
c += (128 & (a = r[0] ^ n)) >> o % 8;
e._prev = s(e._prev, i ? n : a);
}
return c;
}
function s(e, t) {
var i = e.length, n = -1, s = r.allocUnsafe(e.length);
e = r.concat([ e, r.from([ t ]) ]);
for (;++n < i; ) s[n] = e[n] << 1 | e[n + 1] >> 7;
return s;
}
i.encrypt = function(e, t, i) {
for (var s = t.length, a = r.allocUnsafe(s), o = -1; ++o < s; ) a[o] = n(e, t[o], i);
return a;
};
}, {
"safe-buffer": 143
} ],
29: [ function(e, t, i) {
var r = e("safe-buffer").Buffer;
function n(e, t, i) {
var n = e._cipher.encryptBlock(e._prev)[0] ^ t;
e._prev = r.concat([ e._prev.slice(1), r.from([ i ? t : n ]) ]);
return n;
}
i.encrypt = function(e, t, i) {
for (var s = t.length, a = r.allocUnsafe(s), o = -1; ++o < s; ) a[o] = n(e, t[o], i);
return a;
};
}, {
"safe-buffer": 143
} ],
30: [ function(e, t, i) {
var r = e("buffer-xor"), n = e("safe-buffer").Buffer, s = e("../incr32");
function a(e) {
var t = e._cipher.encryptBlockRaw(e._prev);
s(e._prev);
return t;
}
i.encrypt = function(e, t) {
var i = Math.ceil(t.length / 16), s = e._cache.length;
e._cache = n.concat([ e._cache, n.allocUnsafe(16 * i) ]);
for (var o = 0; o < i; o++) {
var c = a(e), h = s + 16 * o;
e._cache.writeUInt32BE(c[0], h + 0);
e._cache.writeUInt32BE(c[1], h + 4);
e._cache.writeUInt32BE(c[2], h + 8);
e._cache.writeUInt32BE(c[3], h + 12);
}
var f = e._cache.slice(0, t.length);
e._cache = e._cache.slice(t.length);
return r(t, f);
};
}, {
"../incr32": 25,
"buffer-xor": 46,
"safe-buffer": 143
} ],
31: [ function(e, t, i) {
i.encrypt = function(e, t) {
return e._cipher.encryptBlock(t);
};
i.decrypt = function(e, t) {
return e._cipher.decryptBlock(t);
};
}, {} ],
32: [ function(e, t, i) {
var r = {
ECB: e("./ecb"),
CBC: e("./cbc"),
CFB: e("./cfb"),
CFB8: e("./cfb8"),
CFB1: e("./cfb1"),
OFB: e("./ofb"),
CTR: e("./ctr"),
GCM: e("./ctr")
}, n = e("./list.json");
for (var s in n) n[s].module = r[n[s].mode];
t.exports = n;
}, {
"./cbc": 26,
"./cfb": 27,
"./cfb1": 28,
"./cfb8": 29,
"./ctr": 30,
"./ecb": 31,
"./list.json": 33,
"./ofb": 34
} ],
33: [ function(e, t, i) {
t.exports = {
"aes-128-ecb": {
cipher: "AES",
key: 128,
iv: 0,
mode: "ECB",
type: "block"
},
"aes-192-ecb": {
cipher: "AES",
key: 192,
iv: 0,
mode: "ECB",
type: "block"
},
"aes-256-ecb": {
cipher: "AES",
key: 256,
iv: 0,
mode: "ECB",
type: "block"
},
"aes-128-cbc": {
cipher: "AES",
key: 128,
iv: 16,
mode: "CBC",
type: "block"
},
"aes-192-cbc": {
cipher: "AES",
key: 192,
iv: 16,
mode: "CBC",
type: "block"
},
"aes-256-cbc": {
cipher: "AES",
key: 256,
iv: 16,
mode: "CBC",
type: "block"
},
aes128: {
cipher: "AES",
key: 128,
iv: 16,
mode: "CBC",
type: "block"
},
aes192: {
cipher: "AES",
key: 192,
iv: 16,
mode: "CBC",
type: "block"
},
aes256: {
cipher: "AES",
key: 256,
iv: 16,
mode: "CBC",
type: "block"
},
"aes-128-cfb": {
cipher: "AES",
key: 128,
iv: 16,
mode: "CFB",
type: "stream"
},
"aes-192-cfb": {
cipher: "AES",
key: 192,
iv: 16,
mode: "CFB",
type: "stream"
},
"aes-256-cfb": {
cipher: "AES",
key: 256,
iv: 16,
mode: "CFB",
type: "stream"
},
"aes-128-cfb8": {
cipher: "AES",
key: 128,
iv: 16,
mode: "CFB8",
type: "stream"
},
"aes-192-cfb8": {
cipher: "AES",
key: 192,
iv: 16,
mode: "CFB8",
type: "stream"
},
"aes-256-cfb8": {
cipher: "AES",
key: 256,
iv: 16,
mode: "CFB8",
type: "stream"
},
"aes-128-cfb1": {
cipher: "AES",
key: 128,
iv: 16,
mode: "CFB1",
type: "stream"
},
"aes-192-cfb1": {
cipher: "AES",
key: 192,
iv: 16,
mode: "CFB1",
type: "stream"
},
"aes-256-cfb1": {
cipher: "AES",
key: 256,
iv: 16,
mode: "CFB1",
type: "stream"
},
"aes-128-ofb": {
cipher: "AES",
key: 128,
iv: 16,
mode: "OFB",
type: "stream"
},
"aes-192-ofb": {
cipher: "AES",
key: 192,
iv: 16,
mode: "OFB",
type: "stream"
},
"aes-256-ofb": {
cipher: "AES",
key: 256,
iv: 16,
mode: "OFB",
type: "stream"
},
"aes-128-ctr": {
cipher: "AES",
key: 128,
iv: 16,
mode: "CTR",
type: "stream"
},
"aes-192-ctr": {
cipher: "AES",
key: 192,
iv: 16,
mode: "CTR",
type: "stream"
},
"aes-256-ctr": {
cipher: "AES",
key: 256,
iv: 16,
mode: "CTR",
type: "stream"
},
"aes-128-gcm": {
cipher: "AES",
key: 128,
iv: 12,
mode: "GCM",
type: "auth"
},
"aes-192-gcm": {
cipher: "AES",
key: 192,
iv: 12,
mode: "GCM",
type: "auth"
},
"aes-256-gcm": {
cipher: "AES",
key: 256,
iv: 12,
mode: "GCM",
type: "auth"
}
};
}, {} ],
34: [ function(e, t, i) {
(function(t) {
var r = e("buffer-xor");
function n(e) {
e._prev = e._cipher.encryptBlock(e._prev);
return e._prev;
}
i.encrypt = function(e, i) {
for (;e._cache.length < i.length; ) e._cache = t.concat([ e._cache, n(e) ]);
var s = e._cache.slice(0, i.length);
e._cache = e._cache.slice(i.length);
return r(i, s);
};
}).call(this, e("buffer").Buffer);
}, {
buffer: 47,
"buffer-xor": 46
} ],
35: [ function(e, t, i) {
var r = e("./aes"), n = e("safe-buffer").Buffer, s = e("cipher-base");
function a(e, t, i, a) {
s.call(this);
this._cipher = new r.AES(t);
this._prev = n.from(i);
this._cache = n.allocUnsafe(0);
this._secCache = n.allocUnsafe(0);
this._decrypt = a;
this._mode = e;
}
e("inherits")(a, s);
a.prototype._update = function(e) {
return this._mode.encrypt(this, e, this._decrypt);
};
a.prototype._final = function() {
this._cipher.scrub();
};
t.exports = a;
}, {
"./aes": 19,
"cipher-base": 49,
inherits: 101,
"safe-buffer": 143
} ],
36: [ function(e, t, i) {
var r = e("browserify-des"), n = e("browserify-aes/browser"), s = e("browserify-aes/modes"), a = e("browserify-des/modes"), o = e("evp_bytestokey");
function c(e, t, i) {
e = e.toLowerCase();
if (s[e]) return n.createCipheriv(e, t, i);
if (a[e]) return new r({
key: t,
iv: i,
mode: e
});
throw new TypeError("invalid suite type");
}
function h(e, t, i) {
e = e.toLowerCase();
if (s[e]) return n.createDecipheriv(e, t, i);
if (a[e]) return new r({
key: t,
iv: i,
mode: e,
decrypt: !0
});
throw new TypeError("invalid suite type");
}
i.createCipher = i.Cipher = function(e, t) {
e = e.toLowerCase();
var i, r;
if (s[e]) {
i = s[e].key;
r = s[e].iv;
} else {
if (!a[e]) throw new TypeError("invalid suite type");
i = 8 * a[e].key;
r = a[e].iv;
}
var n = o(t, !1, i, r);
return c(e, n.key, n.iv);
};
i.createCipheriv = i.Cipheriv = c;
i.createDecipher = i.Decipher = function(e, t) {
e = e.toLowerCase();
var i, r;
if (s[e]) {
i = s[e].key;
r = s[e].iv;
} else {
if (!a[e]) throw new TypeError("invalid suite type");
i = 8 * a[e].key;
r = a[e].iv;
}
var n = o(t, !1, i, r);
return h(e, n.key, n.iv);
};
i.createDecipheriv = i.Decipheriv = h;
i.listCiphers = i.getCiphers = function() {
return Object.keys(a).concat(n.getCiphers());
};
}, {
"browserify-aes/browser": 21,
"browserify-aes/modes": 32,
"browserify-des": 37,
"browserify-des/modes": 38,
evp_bytestokey: 84
} ],
37: [ function(e, t, i) {
var r = e("cipher-base"), n = e("des.js"), s = e("inherits"), a = e("safe-buffer").Buffer, o = {
"des-ede3-cbc": n.CBC.instantiate(n.EDE),
"des-ede3": n.EDE,
"des-ede-cbc": n.CBC.instantiate(n.EDE),
"des-ede": n.EDE,
"des-cbc": n.CBC.instantiate(n.DES),
"des-ecb": n.DES
};
o.des = o["des-cbc"];
o.des3 = o["des-ede3-cbc"];
t.exports = c;
s(c, r);
function c(e) {
r.call(this);
var t, i = e.mode.toLowerCase(), n = o[i];
t = e.decrypt ? "decrypt" : "encrypt";
var s = e.key;
a.isBuffer(s) || (s = a.from(s));
"des-ede" !== i && "des-ede-cbc" !== i || (s = a.concat([ s, s.slice(0, 8) ]));
var c = e.iv;
a.isBuffer(c) || (c = a.from(c));
this._des = n.create({
key: s,
iv: c,
type: t
});
}
c.prototype._update = function(e) {
return a.from(this._des.update(e));
};
c.prototype._final = function() {
return a.from(this._des.final());
};
}, {
"cipher-base": 49,
"des.js": 57,
inherits: 101,
"safe-buffer": 143
} ],
38: [ function(e, t, i) {
i["des-ecb"] = {
key: 8,
iv: 0
};
i["des-cbc"] = i.des = {
key: 8,
iv: 8
};
i["des-ede3-cbc"] = i.des3 = {
key: 24,
iv: 8
};
i["des-ede3"] = {
key: 24,
iv: 0
};
i["des-ede-cbc"] = {
key: 16,
iv: 8
};
i["des-ede"] = {
key: 16,
iv: 0
};
}, {} ],
39: [ function(e, t, i) {
(function(i) {
var r = e("bn.js"), n = e("randombytes");
t.exports = s;
function s(e, t) {
var n = function(e) {
var t = a(e);
return {
blinder: t.toRed(r.mont(e.modulus)).redPow(new r(e.publicExponent)).fromRed(),
unblinder: t.invm(e.modulus)
};
}(t), s = t.modulus.byteLength(), o = (r.mont(t.modulus), new r(e).mul(n.blinder).umod(t.modulus)), c = o.toRed(r.mont(t.prime1)), h = o.toRed(r.mont(t.prime2)), f = t.coefficient, d = t.prime1, u = t.prime2, l = c.redPow(t.exponent1), p = h.redPow(t.exponent2);
l = l.fromRed();
p = p.fromRed();
var b = l.isub(p).imul(f).umod(d);
b.imul(u);
p.iadd(b);
return new i(p.imul(n.unblinder).umod(t.modulus).toArray(!1, s));
}
s.getr = a;
function a(e) {
for (var t = e.modulus.byteLength(), i = new r(n(t)); i.cmp(e.modulus) >= 0 || !i.umod(e.prime1) || !i.umod(e.prime2); ) i = new r(n(t));
return i;
}
}).call(this, e("buffer").Buffer);
}, {
"bn.js": 16,
buffer: 47,
randombytes: 125
} ],
40: [ function(e, t, i) {
t.exports = e("./browser/algorithms.json");
}, {
"./browser/algorithms.json": 41
} ],
41: [ function(e, t, i) {
t.exports = {
sha224WithRSAEncryption: {
sign: "rsa",
hash: "sha224",
id: "302d300d06096086480165030402040500041c"
},
"RSA-SHA224": {
sign: "ecdsa/rsa",
hash: "sha224",
id: "302d300d06096086480165030402040500041c"
},
sha256WithRSAEncryption: {
sign: "rsa",
hash: "sha256",
id: "3031300d060960864801650304020105000420"
},
"RSA-SHA256": {
sign: "ecdsa/rsa",
hash: "sha256",
id: "3031300d060960864801650304020105000420"
},
sha384WithRSAEncryption: {
sign: "rsa",
hash: "sha384",
id: "3041300d060960864801650304020205000430"
},
"RSA-SHA384": {
sign: "ecdsa/rsa",
hash: "sha384",
id: "3041300d060960864801650304020205000430"
},
sha512WithRSAEncryption: {
sign: "rsa",
hash: "sha512",
id: "3051300d060960864801650304020305000440"
},
"RSA-SHA512": {
sign: "ecdsa/rsa",
hash: "sha512",
id: "3051300d060960864801650304020305000440"
},
"RSA-SHA1": {
sign: "rsa",
hash: "sha1",
id: "3021300906052b0e03021a05000414"
},
"ecdsa-with-SHA1": {
sign: "ecdsa",
hash: "sha1",
id: ""
},
sha256: {
sign: "ecdsa",
hash: "sha256",
id: ""
},
sha224: {
sign: "ecdsa",
hash: "sha224",
id: ""
},
sha384: {
sign: "ecdsa",
hash: "sha384",
id: ""
},
sha512: {
sign: "ecdsa",
hash: "sha512",
id: ""
},
"DSA-SHA": {
sign: "dsa",
hash: "sha1",
id: ""
},
"DSA-SHA1": {
sign: "dsa",
hash: "sha1",
id: ""
},
DSA: {
sign: "dsa",
hash: "sha1",
id: ""
},
"DSA-WITH-SHA224": {
sign: "dsa",
hash: "sha224",
id: ""
},
"DSA-SHA224": {
sign: "dsa",
hash: "sha224",
id: ""
},
"DSA-WITH-SHA256": {
sign: "dsa",
hash: "sha256",
id: ""
},
"DSA-SHA256": {
sign: "dsa",
hash: "sha256",
id: ""
},
"DSA-WITH-SHA384": {
sign: "dsa",
hash: "sha384",
id: ""
},
"DSA-SHA384": {
sign: "dsa",
hash: "sha384",
id: ""
},
"DSA-WITH-SHA512": {
sign: "dsa",
hash: "sha512",
id: ""
},
"DSA-SHA512": {
sign: "dsa",
hash: "sha512",
id: ""
},
"DSA-RIPEMD160": {
sign: "dsa",
hash: "rmd160",
id: ""
},
ripemd160WithRSA: {
sign: "rsa",
hash: "rmd160",
id: "3021300906052b2403020105000414"
},
"RSA-RIPEMD160": {
sign: "rsa",
hash: "rmd160",
id: "3021300906052b2403020105000414"
},
md5WithRSAEncryption: {
sign: "rsa",
hash: "md5",
id: "3020300c06082a864886f70d020505000410"
},
"RSA-MD5": {
sign: "rsa",
hash: "md5",
id: "3020300c06082a864886f70d020505000410"
}
};
}, {} ],
42: [ function(e, t, i) {
t.exports = {
"1.3.132.0.10": "secp256k1",
"1.3.132.0.33": "p224",
"1.2.840.10045.3.1.1": "p192",
"1.2.840.10045.3.1.7": "p256",
"1.3.132.0.34": "p384",
"1.3.132.0.35": "p521"
};
}, {} ],
43: [ function(e, t, i) {
(function(i) {
var r = e("create-hash"), n = e("stream"), s = e("inherits"), a = e("./sign"), o = e("./verify"), c = e("./algorithms.json");
Object.keys(c).forEach(function(e) {
c[e].id = new i(c[e].id, "hex");
c[e.toLowerCase()] = c[e];
});
function h(e) {
n.Writable.call(this);
var t = c[e];
if (!t) throw new Error("Unknown message digest");
this._hashType = t.hash;
this._hash = r(t.hash);
this._tag = t.id;
this._signType = t.sign;
}
s(h, n.Writable);
h.prototype._write = function(e, t, i) {
this._hash.update(e);
i();
};
h.prototype.update = function(e, t) {
"string" == typeof e && (e = new i(e, t));
this._hash.update(e);
return this;
};
h.prototype.sign = function(e, t) {
this.end();
var i = this._hash.digest(), r = a(i, e, this._hashType, this._signType, this._tag);
return t ? r.toString(t) : r;
};
function f(e) {
n.Writable.call(this);
var t = c[e];
if (!t) throw new Error("Unknown message digest");
this._hash = r(t.hash);
this._tag = t.id;
this._signType = t.sign;
}
s(f, n.Writable);
f.prototype._write = function(e, t, i) {
this._hash.update(e);
i();
};
f.prototype.update = function(e, t) {
"string" == typeof e && (e = new i(e, t));
this._hash.update(e);
return this;
};
f.prototype.verify = function(e, t, r) {
"string" == typeof t && (t = new i(t, r));
this.end();
var n = this._hash.digest();
return o(t, n, e, this._signType, this._tag);
};
function d(e) {
return new h(e);
}
function u(e) {
return new f(e);
}
t.exports = {
Sign: d,
Verify: u,
createSign: d,
createVerify: u
};
}).call(this, e("buffer").Buffer);
}, {
"./algorithms.json": 41,
"./sign": 44,
"./verify": 45,
buffer: 47,
"create-hash": 52,
inherits: 101,
stream: 152
} ],
44: [ function(e, t, i) {
(function(i) {
var r = e("create-hmac"), n = e("browserify-rsa"), s = e("elliptic").ec, a = e("bn.js"), o = e("parse-asn1"), c = e("./curves.json");
function h(e, t, n, s) {
if ((e = new i(e.toArray())).length < t.byteLength()) {
var a = new i(t.byteLength() - e.length);
a.fill(0);
e = i.concat([ a, e ]);
}
var o = n.length, c = function(e, t) {
e = (e = f(e, t)).mod(t);
var r = new i(e.toArray());
if (r.length < t.byteLength()) {
var n = new i(t.byteLength() - r.length);
n.fill(0);
r = i.concat([ n, r ]);
}
return r;
}(n, t), h = new i(o);
h.fill(1);
var d = new i(o);
d.fill(0);
d = r(s, d).update(h).update(new i([ 0 ])).update(e).update(c).digest();
h = r(s, d).update(h).digest();
return {
k: d = r(s, d).update(h).update(new i([ 1 ])).update(e).update(c).digest(),
v: h = r(s, d).update(h).digest()
};
}
function f(e, t) {
var i = new a(e), r = (e.length << 3) - t.bitLength();
r > 0 && i.ishrn(r);
return i;
}
function d(e, t, n) {
var s, a;
do {
s = new i(0);
for (;8 * s.length < e.bitLength(); ) {
t.v = r(n, t.k).update(t.v).digest();
s = i.concat([ s, t.v ]);
}
a = f(s, e);
t.k = r(n, t.k).update(t.v).update(new i([ 0 ])).digest();
t.v = r(n, t.k).update(t.v).digest();
} while (-1 !== a.cmp(e));
return a;
}
function u(e, t, i, r) {
return e.toRed(a.mont(i)).redPow(t).fromRed().mod(r);
}
t.exports = function(e, t, r, l, p) {
var b = o(t);
if (b.curve) {
if ("ecdsa" !== l && "ecdsa/rsa" !== l) throw new Error("wrong private key type");
return function(e, t) {
var r = c[t.curve.join(".")];
if (!r) throw new Error("unknown curve " + t.curve.join("."));
var n = new s(r).keyFromPrivate(t.privateKey).sign(e);
return new i(n.toDER());
}(e, b);
}
if ("dsa" === b.type) {
if ("dsa" !== l) throw new Error("wrong private key type");
return function(e, t, r) {
for (var n, s = t.params.priv_key, o = t.params.p, c = t.params.q, l = t.params.g, p = new a(0), b = f(e, c).mod(c), g = !1, y = h(s, c, e, r); !1 === g; ) {
n = d(c, y, r);
p = u(l, n, o, c);
if (0 === (g = n.invm(c).imul(b.add(s.mul(p))).mod(c)).cmpn(0)) {
g = !1;
p = new a(0);
}
}
return function(e, t) {
e = e.toArray();
t = t.toArray();
128 & e[0] && (e = [ 0 ].concat(e));
128 & t[0] && (t = [ 0 ].concat(t));
var r = [ 48, e.length + t.length + 4, 2, e.length ];
r = r.concat(e, [ 2, t.length ], t);
return new i(r);
}(p, g);
}(e, b, r);
}
if ("rsa" !== l && "ecdsa/rsa" !== l) throw new Error("wrong private key type");
e = i.concat([ p, e ]);
for (var g = b.modulus.byteLength(), y = [ 0, 1 ]; e.length + y.length + 1 < g; ) y.push(255);
y.push(0);
for (var m = -1; ++m < e.length; ) y.push(e[m]);
return n(y, b);
};
t.exports.getKey = h;
t.exports.makeKey = d;
}).call(this, e("buffer").Buffer);
}, {
"./curves.json": 42,
"bn.js": 16,
"browserify-rsa": 39,
buffer: 47,
"create-hmac": 54,
elliptic: 67,
"parse-asn1": 111
} ],
45: [ function(e, t, i) {
(function(i) {
var r = e("bn.js"), n = e("elliptic").ec, s = e("parse-asn1"), a = e("./curves.json");
function o(e, t) {
if (e.cmpn(0) <= 0) throw new Error("invalid sig");
if (e.cmp(t) >= t) throw new Error("invalid sig");
}
t.exports = function(e, t, c, h, f) {
var d = s(c);
if ("ec" === d.type) {
if ("ecdsa" !== h && "ecdsa/rsa" !== h) throw new Error("wrong public key type");
return function(e, t, i) {
var r = a[i.data.algorithm.curve.join(".")];
if (!r) throw new Error("unknown curve " + i.data.algorithm.curve.join("."));
var s = new n(r), o = i.data.subjectPrivateKey.data;
return s.verify(t, e, o);
}(e, t, d);
}
if ("dsa" === d.type) {
if ("dsa" !== h) throw new Error("wrong public key type");
return function(e, t, i) {
var n = i.data.p, a = i.data.q, c = i.data.g, h = i.data.pub_key, f = s.signature.decode(e, "der"), d = f.s, u = f.r;
o(d, a);
o(u, a);
var l = r.mont(n), p = d.invm(a);
return 0 === c.toRed(l).redPow(new r(t).mul(p).mod(a)).fromRed().mul(h.toRed(l).redPow(u.mul(p).mod(a)).fromRed()).mod(n).mod(a).cmp(u);
}(e, t, d);
}
if ("rsa" !== h && "ecdsa/rsa" !== h) throw new Error("wrong public key type");
t = i.concat([ f, t ]);
for (var u = d.modulus.byteLength(), l = [ 1 ], p = 0; t.length + l.length + 2 < u; ) {
l.push(255);
p++;
}
l.push(0);
for (var b = -1; ++b < t.length; ) l.push(t[b]);
l = new i(l);
var g = r.mont(d.modulus);
e = (e = new r(e).toRed(g)).redPow(new r(d.publicExponent));
e = new i(e.fromRed().toArray());
var y = p < 8 ? 1 : 0;
u = Math.min(e.length, l.length);
e.length !== l.length && (y = 1);
b = -1;
for (;++b < u; ) y |= e[b] ^ l[b];
return 0 === y;
};
}).call(this, e("buffer").Buffer);
}, {
"./curves.json": 42,
"bn.js": 16,
buffer: 47,
elliptic: 67,
"parse-asn1": 111
} ],
46: [ function(e, t, i) {
(function(e) {
t.exports = function(t, i) {
for (var r = Math.min(t.length, i.length), n = new e(r), s = 0; s < r; ++s) n[s] = t[s] ^ i[s];
return n;
};
}).call(this, e("buffer").Buffer);
}, {
buffer: 47
} ],
47: [ function(e, t, i) {
(function(t) {
"use strict";
var r = e("base64-js"), n = e("ieee754"), s = e("isarray");
i.Buffer = c;
i.SlowBuffer = function(e) {
+e != e && (e = 0);
return c.alloc(+e);
};
i.INSPECT_MAX_BYTES = 50;
c.TYPED_ARRAY_SUPPORT = void 0 !== t.TYPED_ARRAY_SUPPORT ? t.TYPED_ARRAY_SUPPORT : function() {
try {
var e = new Uint8Array(1);
e.__proto__ = {
__proto__: Uint8Array.prototype,
foo: function() {
return 42;
}
};
return 42 === e.foo() && "function" == typeof e.subarray && 0 === e.subarray(1, 1).byteLength;
} catch (e) {
return !1;
}
}();
i.kMaxLength = a();
function a() {
return c.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
}
function o(e, t) {
if (a() < t) throw new RangeError("Invalid typed array length");
if (c.TYPED_ARRAY_SUPPORT) (e = new Uint8Array(t)).__proto__ = c.prototype; else {
null === e && (e = new c(t));
e.length = t;
}
return e;
}
function c(e, t, i) {
if (!(c.TYPED_ARRAY_SUPPORT || this instanceof c)) return new c(e, t, i);
if ("number" == typeof e) {
if ("string" == typeof t) throw new Error("If encoding is specified then the first argument must be a string");
return d(this, e);
}
return h(this, e, t, i);
}
c.poolSize = 8192;
c._augment = function(e) {
e.__proto__ = c.prototype;
return e;
};
function h(e, t, i, r) {
if ("number" == typeof t) throw new TypeError('"value" argument must not be a number');
return "undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer ? function(e, t, i, r) {
t.byteLength;
if (i < 0 || t.byteLength < i) throw new RangeError("'offset' is out of bounds");
if (t.byteLength < i + (r || 0)) throw new RangeError("'length' is out of bounds");
t = void 0 === i && void 0 === r ? new Uint8Array(t) : void 0 === r ? new Uint8Array(t, i) : new Uint8Array(t, i, r);
c.TYPED_ARRAY_SUPPORT ? (e = t).__proto__ = c.prototype : e = u(e, t);
return e;
}(e, t, i, r) : "string" == typeof t ? function(e, t, i) {
"string" == typeof i && "" !== i || (i = "utf8");
if (!c.isEncoding(i)) throw new TypeError('"encoding" must be a valid string encoding');
var r = 0 | p(t, i), n = (e = o(e, r)).write(t, i);
n !== r && (e = e.slice(0, n));
return e;
}(e, t, i) : function(e, t) {
if (c.isBuffer(t)) {
var i = 0 | l(t.length);
if (0 === (e = o(e, i)).length) return e;
t.copy(e, 0, 0, i);
return e;
}
if (t) {
if ("undefined" != typeof ArrayBuffer && t.buffer instanceof ArrayBuffer || "length" in t) return "number" != typeof t.length || function(e) {
return e != e;
}(t.length) ? o(e, 0) : u(e, t);
if ("Buffer" === t.type && s(t.data)) return u(e, t.data);
}
throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
}(e, t);
}
c.from = function(e, t, i) {
return h(null, e, t, i);
};
if (c.TYPED_ARRAY_SUPPORT) {
c.prototype.__proto__ = Uint8Array.prototype;
c.__proto__ = Uint8Array;
"undefined" != typeof Symbol && Symbol.species && c[Symbol.species] === c && Object.defineProperty(c, Symbol.species, {
value: null,
configurable: !0
});
}
function f(e) {
if ("number" != typeof e) throw new TypeError('"size" argument must be a number');
if (e < 0) throw new RangeError('"size" argument must not be negative');
}
c.alloc = function(e, t, i) {
return function(e, t, i, r) {
f(t);
return t <= 0 ? o(e, t) : void 0 !== i ? "string" == typeof r ? o(e, t).fill(i, r) : o(e, t).fill(i) : o(e, t);
}(null, e, t, i);
};
function d(e, t) {
f(t);
e = o(e, t < 0 ? 0 : 0 | l(t));
if (!c.TYPED_ARRAY_SUPPORT) for (var i = 0; i < t; ++i) e[i] = 0;
return e;
}
c.allocUnsafe = function(e) {
return d(null, e);
};
c.allocUnsafeSlow = function(e) {
return d(null, e);
};
function u(e, t) {
var i = t.length < 0 ? 0 : 0 | l(t.length);
e = o(e, i);
for (var r = 0; r < i; r += 1) e[r] = 255 & t[r];
return e;
}
function l(e) {
if (e >= a()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + a().toString(16) + " bytes");
return 0 | e;
}
c.isBuffer = function(e) {
return !(null == e || !e._isBuffer);
};
c.compare = function(e, t) {
if (!c.isBuffer(e) || !c.isBuffer(t)) throw new TypeError("Arguments must be Buffers");
if (e === t) return 0;
for (var i = e.length, r = t.length, n = 0, s = Math.min(i, r); n < s; ++n) if (e[n] !== t[n]) {
i = e[n];
r = t[n];
break;
}
return i < r ? -1 : r < i ? 1 : 0;
};
c.isEncoding = function(e) {
switch (String(e).toLowerCase()) {
case "hex":
case "utf8":
case "utf-8":
case "ascii":
case "latin1":
case "binary":
case "base64":
case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return !0;

default:
return !1;
}
};
c.concat = function(e, t) {
if (!s(e)) throw new TypeError('"list" argument must be an Array of Buffers');
if (0 === e.length) return c.alloc(0);
var i;
if (void 0 === t) {
t = 0;
for (i = 0; i < e.length; ++i) t += e[i].length;
}
var r = c.allocUnsafe(t), n = 0;
for (i = 0; i < e.length; ++i) {
var a = e[i];
if (!c.isBuffer(a)) throw new TypeError('"list" argument must be an Array of Buffers');
a.copy(r, n);
n += a.length;
}
return r;
};
function p(e, t) {
if (c.isBuffer(e)) return e.length;
if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(e) || e instanceof ArrayBuffer)) return e.byteLength;
"string" != typeof e && (e = "" + e);
var i = e.length;
if (0 === i) return 0;
for (var r = !1; ;) switch (t) {
case "ascii":
case "latin1":
case "binary":
return i;

case "utf8":
case "utf-8":
case void 0:
return U(e).length;

case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return 2 * i;

case "hex":
return i >>> 1;

case "base64":
return z(e).length;

default:
if (r) return U(e).length;
t = ("" + t).toLowerCase();
r = !0;
}
}
c.byteLength = p;
c.prototype._isBuffer = !0;
function b(e, t, i) {
var r = e[t];
e[t] = e[i];
e[i] = r;
}
c.prototype.swap16 = function() {
var e = this.length;
if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
for (var t = 0; t < e; t += 2) b(this, t, t + 1);
return this;
};
c.prototype.swap32 = function() {
var e = this.length;
if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
for (var t = 0; t < e; t += 4) {
b(this, t, t + 3);
b(this, t + 1, t + 2);
}
return this;
};
c.prototype.swap64 = function() {
var e = this.length;
if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
for (var t = 0; t < e; t += 8) {
b(this, t, t + 7);
b(this, t + 1, t + 6);
b(this, t + 2, t + 5);
b(this, t + 3, t + 4);
}
return this;
};
c.prototype.toString = function() {
var e = 0 | this.length;
return 0 === e ? "" : 0 === arguments.length ? S(this, 0, e) : function(e, t, i) {
var r = !1;
(void 0 === t || t < 0) && (t = 0);
if (t > this.length) return "";
(void 0 === i || i > this.length) && (i = this.length);
if (i <= 0) return "";
if ((i >>>= 0) <= (t >>>= 0)) return "";
e || (e = "utf8");
for (;;) switch (e) {
case "hex":
return M(this, t, i);

case "utf8":
case "utf-8":
return S(this, t, i);

case "ascii":
return D(this, t, i);

case "latin1":
case "binary":
return R(this, t, i);

case "base64":
return E(this, t, i);

case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return k(this, t, i);

default:
if (r) throw new TypeError("Unknown encoding: " + e);
e = (e + "").toLowerCase();
r = !0;
}
}.apply(this, arguments);
};
c.prototype.equals = function(e) {
if (!c.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
return this === e || 0 === c.compare(this, e);
};
c.prototype.inspect = function() {
var e = "", t = i.INSPECT_MAX_BYTES;
if (this.length > 0) {
e = this.toString("hex", 0, t).match(/.{2}/g).join(" ");
this.length > t && (e += " ... ");
}
return "<Buffer " + e + ">";
};
c.prototype.compare = function(e, t, i, r, n) {
if (!c.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
void 0 === t && (t = 0);
void 0 === i && (i = e ? e.length : 0);
void 0 === r && (r = 0);
void 0 === n && (n = this.length);
if (t < 0 || i > e.length || r < 0 || n > this.length) throw new RangeError("out of range index");
if (r >= n && t >= i) return 0;
if (r >= n) return -1;
if (t >= i) return 1;
t >>>= 0;
i >>>= 0;
r >>>= 0;
n >>>= 0;
if (this === e) return 0;
for (var s = n - r, a = i - t, o = Math.min(s, a), h = this.slice(r, n), f = e.slice(t, i), d = 0; d < o; ++d) if (h[d] !== f[d]) {
s = h[d];
a = f[d];
break;
}
return s < a ? -1 : a < s ? 1 : 0;
};
function g(e, t, i, r, n) {
if (0 === e.length) return -1;
if ("string" == typeof i) {
r = i;
i = 0;
} else i > 2147483647 ? i = 2147483647 : i < -2147483648 && (i = -2147483648);
i = +i;
isNaN(i) && (i = n ? 0 : e.length - 1);
i < 0 && (i = e.length + i);
if (i >= e.length) {
if (n) return -1;
i = e.length - 1;
} else if (i < 0) {
if (!n) return -1;
i = 0;
}
"string" == typeof t && (t = c.from(t, r));
if (c.isBuffer(t)) return 0 === t.length ? -1 : y(e, t, i, r, n);
if ("number" == typeof t) {
t &= 255;
return c.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? n ? Uint8Array.prototype.indexOf.call(e, t, i) : Uint8Array.prototype.lastIndexOf.call(e, t, i) : y(e, [ t ], i, r, n);
}
throw new TypeError("val must be string, number or Buffer");
}
function y(e, t, i, r, n) {
var s, a = 1, o = e.length, c = t.length;
if (void 0 !== r && ("ucs2" === (r = String(r).toLowerCase()) || "ucs-2" === r || "utf16le" === r || "utf-16le" === r)) {
if (e.length < 2 || t.length < 2) return -1;
a = 2;
o /= 2;
c /= 2;
i /= 2;
}
function h(e, t) {
return 1 === a ? e[t] : e.readUInt16BE(t * a);
}
if (n) {
var f = -1;
for (s = i; s < o; s++) if (h(e, s) === h(t, -1 === f ? 0 : s - f)) {
-1 === f && (f = s);
if (s - f + 1 === c) return f * a;
} else {
-1 !== f && (s -= s - f);
f = -1;
}
} else {
i + c > o && (i = o - c);
for (s = i; s >= 0; s--) {
for (var d = !0, u = 0; u < c; u++) if (h(e, s + u) !== h(t, u)) {
d = !1;
break;
}
if (d) return s;
}
}
return -1;
}
c.prototype.includes = function(e, t, i) {
return -1 !== this.indexOf(e, t, i);
};
c.prototype.indexOf = function(e, t, i) {
return g(this, e, t, i, !0);
};
c.prototype.lastIndexOf = function(e, t, i) {
return g(this, e, t, i, !1);
};
function m(e, t, i, r) {
i = Number(i) || 0;
var n = e.length - i;
r ? (r = Number(r)) > n && (r = n) : r = n;
var s = t.length;
if (s % 2 != 0) throw new TypeError("Invalid hex string");
r > s / 2 && (r = s / 2);
for (var a = 0; a < r; ++a) {
var o = parseInt(t.substr(2 * a, 2), 16);
if (isNaN(o)) return a;
e[i + a] = o;
}
return a;
}
function v(e, t, i, r) {
return q(U(t, e.length - i), e, i, r);
}
function _(e, t, i, r) {
return q(function(e) {
for (var t = [], i = 0; i < e.length; ++i) t.push(255 & e.charCodeAt(i));
return t;
}(t), e, i, r);
}
function w(e, t, i, r) {
return _(e, t, i, r);
}
function x(e, t, i, r) {
return q(z(t), e, i, r);
}
function C(e, t, i, r) {
return q(function(e, t) {
for (var i, r, n, s = [], a = 0; a < e.length && !((t -= 2) < 0); ++a) {
i = e.charCodeAt(a);
r = i >> 8;
n = i % 256;
s.push(n);
s.push(r);
}
return s;
}(t, e.length - i), e, i, r);
}
c.prototype.write = function(e, t, i, r) {
if (void 0 === t) {
r = "utf8";
i = this.length;
t = 0;
} else if (void 0 === i && "string" == typeof t) {
r = t;
i = this.length;
t = 0;
} else {
if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
t |= 0;
if (isFinite(i)) {
i |= 0;
void 0 === r && (r = "utf8");
} else {
r = i;
i = void 0;
}
}
var n = this.length - t;
(void 0 === i || i > n) && (i = n);
if (e.length > 0 && (i < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
r || (r = "utf8");
for (var s = !1; ;) switch (r) {
case "hex":
return m(this, e, t, i);

case "utf8":
case "utf-8":
return v(this, e, t, i);

case "ascii":
return _(this, e, t, i);

case "latin1":
case "binary":
return w(this, e, t, i);

case "base64":
return x(this, e, t, i);

case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return C(this, e, t, i);

default:
if (s) throw new TypeError("Unknown encoding: " + r);
r = ("" + r).toLowerCase();
s = !0;
}
};
c.prototype.toJSON = function() {
return {
type: "Buffer",
data: Array.prototype.slice.call(this._arr || this, 0)
};
};
function E(e, t, i) {
return 0 === t && i === e.length ? r.fromByteArray(e) : r.fromByteArray(e.slice(t, i));
}
function S(e, t, i) {
i = Math.min(e.length, i);
for (var r = [], n = t; n < i; ) {
var s = e[n], a = null, o = s > 239 ? 4 : s > 223 ? 3 : s > 191 ? 2 : 1;
if (n + o <= i) {
var c, h, f, d;
switch (o) {
case 1:
s < 128 && (a = s);
break;

case 2:
128 == (192 & (c = e[n + 1])) && (d = (31 & s) << 6 | 63 & c) > 127 && (a = d);
break;

case 3:
c = e[n + 1];
h = e[n + 2];
128 == (192 & c) && 128 == (192 & h) && (d = (15 & s) << 12 | (63 & c) << 6 | 63 & h) > 2047 && (d < 55296 || d > 57343) && (a = d);
break;

case 4:
c = e[n + 1];
h = e[n + 2];
f = e[n + 3];
128 == (192 & c) && 128 == (192 & h) && 128 == (192 & f) && (d = (15 & s) << 18 | (63 & c) << 12 | (63 & h) << 6 | 63 & f) > 65535 && d < 1114112 && (a = d);
}
}
if (null === a) {
a = 65533;
o = 1;
} else if (a > 65535) {
a -= 65536;
r.push(a >>> 10 & 1023 | 55296);
a = 56320 | 1023 & a;
}
r.push(a);
n += o;
}
return function(e) {
var t = e.length;
if (t <= A) return String.fromCharCode.apply(String, e);
var i = "", r = 0;
for (;r < t; ) i += String.fromCharCode.apply(String, e.slice(r, r += A));
return i;
}(r);
}
var A = 4096;
function D(e, t, i) {
var r = "";
i = Math.min(e.length, i);
for (var n = t; n < i; ++n) r += String.fromCharCode(127 & e[n]);
return r;
}
function R(e, t, i) {
var r = "";
i = Math.min(e.length, i);
for (var n = t; n < i; ++n) r += String.fromCharCode(e[n]);
return r;
}
function M(e, t, i) {
var r = e.length;
(!t || t < 0) && (t = 0);
(!i || i < 0 || i > r) && (i = r);
for (var n = "", s = t; s < i; ++s) n += F(e[s]);
return n;
}
function k(e, t, i) {
for (var r = e.slice(t, i), n = "", s = 0; s < r.length; s += 2) n += String.fromCharCode(r[s] + 256 * r[s + 1]);
return n;
}
c.prototype.slice = function(e, t) {
var i, r = this.length;
e = ~~e;
t = void 0 === t ? r : ~~t;
e < 0 ? (e += r) < 0 && (e = 0) : e > r && (e = r);
t < 0 ? (t += r) < 0 && (t = 0) : t > r && (t = r);
t < e && (t = e);
if (c.TYPED_ARRAY_SUPPORT) (i = this.subarray(e, t)).__proto__ = c.prototype; else {
var n = t - e;
i = new c(n, void 0);
for (var s = 0; s < n; ++s) i[s] = this[s + e];
}
return i;
};
function N(e, t, i) {
if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");
if (e + t > i) throw new RangeError("Trying to access beyond buffer length");
}
c.prototype.readUIntLE = function(e, t, i) {
e |= 0;
t |= 0;
i || N(e, t, this.length);
for (var r = this[e], n = 1, s = 0; ++s < t && (n *= 256); ) r += this[e + s] * n;
return r;
};
c.prototype.readUIntBE = function(e, t, i) {
e |= 0;
t |= 0;
i || N(e, t, this.length);
for (var r = this[e + --t], n = 1; t > 0 && (n *= 256); ) r += this[e + --t] * n;
return r;
};
c.prototype.readUInt8 = function(e, t) {
t || N(e, 1, this.length);
return this[e];
};
c.prototype.readUInt16LE = function(e, t) {
t || N(e, 2, this.length);
return this[e] | this[e + 1] << 8;
};
c.prototype.readUInt16BE = function(e, t) {
t || N(e, 2, this.length);
return this[e] << 8 | this[e + 1];
};
c.prototype.readUInt32LE = function(e, t) {
t || N(e, 4, this.length);
return (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3];
};
c.prototype.readUInt32BE = function(e, t) {
t || N(e, 4, this.length);
return 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
};
c.prototype.readIntLE = function(e, t, i) {
e |= 0;
t |= 0;
i || N(e, t, this.length);
for (var r = this[e], n = 1, s = 0; ++s < t && (n *= 256); ) r += this[e + s] * n;
r >= (n *= 128) && (r -= Math.pow(2, 8 * t));
return r;
};
c.prototype.readIntBE = function(e, t, i) {
e |= 0;
t |= 0;
i || N(e, t, this.length);
for (var r = t, n = 1, s = this[e + --r]; r > 0 && (n *= 256); ) s += this[e + --r] * n;
s >= (n *= 128) && (s -= Math.pow(2, 8 * t));
return s;
};
c.prototype.readInt8 = function(e, t) {
t || N(e, 1, this.length);
return 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e];
};
c.prototype.readInt16LE = function(e, t) {
t || N(e, 2, this.length);
var i = this[e] | this[e + 1] << 8;
return 32768 & i ? 4294901760 | i : i;
};
c.prototype.readInt16BE = function(e, t) {
t || N(e, 2, this.length);
var i = this[e + 1] | this[e] << 8;
return 32768 & i ? 4294901760 | i : i;
};
c.prototype.readInt32LE = function(e, t) {
t || N(e, 4, this.length);
return this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
};
c.prototype.readInt32BE = function(e, t) {
t || N(e, 4, this.length);
return this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
};
c.prototype.readFloatLE = function(e, t) {
t || N(e, 4, this.length);
return n.read(this, e, !0, 23, 4);
};
c.prototype.readFloatBE = function(e, t) {
t || N(e, 4, this.length);
return n.read(this, e, !1, 23, 4);
};
c.prototype.readDoubleLE = function(e, t) {
t || N(e, 8, this.length);
return n.read(this, e, !0, 52, 8);
};
c.prototype.readDoubleBE = function(e, t) {
t || N(e, 8, this.length);
return n.read(this, e, !1, 52, 8);
};
function B(e, t, i, r, n, s) {
if (!c.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
if (t > n || t < s) throw new RangeError('"value" argument is out of bounds');
if (i + r > e.length) throw new RangeError("Index out of range");
}
c.prototype.writeUIntLE = function(e, t, i, r) {
e = +e;
t |= 0;
i |= 0;
if (!r) {
B(this, e, t, i, Math.pow(2, 8 * i) - 1, 0);
}
var n = 1, s = 0;
this[t] = 255 & e;
for (;++s < i && (n *= 256); ) this[t + s] = e / n & 255;
return t + i;
};
c.prototype.writeUIntBE = function(e, t, i, r) {
e = +e;
t |= 0;
i |= 0;
if (!r) {
B(this, e, t, i, Math.pow(2, 8 * i) - 1, 0);
}
var n = i - 1, s = 1;
this[t + n] = 255 & e;
for (;--n >= 0 && (s *= 256); ) this[t + n] = e / s & 255;
return t + i;
};
c.prototype.writeUInt8 = function(e, t, i) {
e = +e;
t |= 0;
i || B(this, e, t, 1, 255, 0);
c.TYPED_ARRAY_SUPPORT || (e = Math.floor(e));
this[t] = 255 & e;
return t + 1;
};
function L(e, t, i, r) {
t < 0 && (t = 65535 + t + 1);
for (var n = 0, s = Math.min(e.length - i, 2); n < s; ++n) e[i + n] = (t & 255 << 8 * (r ? n : 1 - n)) >>> 8 * (r ? n : 1 - n);
}
c.prototype.writeUInt16LE = function(e, t, i) {
e = +e;
t |= 0;
i || B(this, e, t, 2, 65535, 0);
if (c.TYPED_ARRAY_SUPPORT) {
this[t] = 255 & e;
this[t + 1] = e >>> 8;
} else L(this, e, t, !0);
return t + 2;
};
c.prototype.writeUInt16BE = function(e, t, i) {
e = +e;
t |= 0;
i || B(this, e, t, 2, 65535, 0);
if (c.TYPED_ARRAY_SUPPORT) {
this[t] = e >>> 8;
this[t + 1] = 255 & e;
} else L(this, e, t, !1);
return t + 2;
};
function T(e, t, i, r) {
t < 0 && (t = 4294967295 + t + 1);
for (var n = 0, s = Math.min(e.length - i, 4); n < s; ++n) e[i + n] = t >>> 8 * (r ? n : 3 - n) & 255;
}
c.prototype.writeUInt32LE = function(e, t, i) {
e = +e;
t |= 0;
i || B(this, e, t, 4, 4294967295, 0);
if (c.TYPED_ARRAY_SUPPORT) {
this[t + 3] = e >>> 24;
this[t + 2] = e >>> 16;
this[t + 1] = e >>> 8;
this[t] = 255 & e;
} else T(this, e, t, !0);
return t + 4;
};
c.prototype.writeUInt32BE = function(e, t, i) {
e = +e;
t |= 0;
i || B(this, e, t, 4, 4294967295, 0);
if (c.TYPED_ARRAY_SUPPORT) {
this[t] = e >>> 24;
this[t + 1] = e >>> 16;
this[t + 2] = e >>> 8;
this[t + 3] = 255 & e;
} else T(this, e, t, !1);
return t + 4;
};
c.prototype.writeIntLE = function(e, t, i, r) {
e = +e;
t |= 0;
if (!r) {
var n = Math.pow(2, 8 * i - 1);
B(this, e, t, i, n - 1, -n);
}
var s = 0, a = 1, o = 0;
this[t] = 255 & e;
for (;++s < i && (a *= 256); ) {
e < 0 && 0 === o && 0 !== this[t + s - 1] && (o = 1);
this[t + s] = (e / a >> 0) - o & 255;
}
return t + i;
};
c.prototype.writeIntBE = function(e, t, i, r) {
e = +e;
t |= 0;
if (!r) {
var n = Math.pow(2, 8 * i - 1);
B(this, e, t, i, n - 1, -n);
}
var s = i - 1, a = 1, o = 0;
this[t + s] = 255 & e;
for (;--s >= 0 && (a *= 256); ) {
e < 0 && 0 === o && 0 !== this[t + s + 1] && (o = 1);
this[t + s] = (e / a >> 0) - o & 255;
}
return t + i;
};
c.prototype.writeInt8 = function(e, t, i) {
e = +e;
t |= 0;
i || B(this, e, t, 1, 127, -128);
c.TYPED_ARRAY_SUPPORT || (e = Math.floor(e));
e < 0 && (e = 255 + e + 1);
this[t] = 255 & e;
return t + 1;
};
c.prototype.writeInt16LE = function(e, t, i) {
e = +e;
t |= 0;
i || B(this, e, t, 2, 32767, -32768);
if (c.TYPED_ARRAY_SUPPORT) {
this[t] = 255 & e;
this[t + 1] = e >>> 8;
} else L(this, e, t, !0);
return t + 2;
};
c.prototype.writeInt16BE = function(e, t, i) {
e = +e;
t |= 0;
i || B(this, e, t, 2, 32767, -32768);
if (c.TYPED_ARRAY_SUPPORT) {
this[t] = e >>> 8;
this[t + 1] = 255 & e;
} else L(this, e, t, !1);
return t + 2;
};
c.prototype.writeInt32LE = function(e, t, i) {
e = +e;
t |= 0;
i || B(this, e, t, 4, 2147483647, -2147483648);
if (c.TYPED_ARRAY_SUPPORT) {
this[t] = 255 & e;
this[t + 1] = e >>> 8;
this[t + 2] = e >>> 16;
this[t + 3] = e >>> 24;
} else T(this, e, t, !0);
return t + 4;
};
c.prototype.writeInt32BE = function(e, t, i) {
e = +e;
t |= 0;
i || B(this, e, t, 4, 2147483647, -2147483648);
e < 0 && (e = 4294967295 + e + 1);
if (c.TYPED_ARRAY_SUPPORT) {
this[t] = e >>> 24;
this[t + 1] = e >>> 16;
this[t + 2] = e >>> 8;
this[t + 3] = 255 & e;
} else T(this, e, t, !1);
return t + 4;
};
function O(e, t, i, r, n, s) {
if (i + r > e.length) throw new RangeError("Index out of range");
if (i < 0) throw new RangeError("Index out of range");
}
function P(e, t, i, r, s) {
s || O(e, 0, i, 4);
n.write(e, t, i, r, 23, 4);
return i + 4;
}
c.prototype.writeFloatLE = function(e, t, i) {
return P(this, e, t, !0, i);
};
c.prototype.writeFloatBE = function(e, t, i) {
return P(this, e, t, !1, i);
};
function I(e, t, i, r, s) {
s || O(e, 0, i, 8);
n.write(e, t, i, r, 52, 8);
return i + 8;
}
c.prototype.writeDoubleLE = function(e, t, i) {
return I(this, e, t, !0, i);
};
c.prototype.writeDoubleBE = function(e, t, i) {
return I(this, e, t, !1, i);
};
c.prototype.copy = function(e, t, i, r) {
i || (i = 0);
r || 0 === r || (r = this.length);
t >= e.length && (t = e.length);
t || (t = 0);
r > 0 && r < i && (r = i);
if (r === i) return 0;
if (0 === e.length || 0 === this.length) return 0;
if (t < 0) throw new RangeError("targetStart out of bounds");
if (i < 0 || i >= this.length) throw new RangeError("sourceStart out of bounds");
if (r < 0) throw new RangeError("sourceEnd out of bounds");
r > this.length && (r = this.length);
e.length - t < r - i && (r = e.length - t + i);
var n, s = r - i;
if (this === e && i < t && t < r) for (n = s - 1; n >= 0; --n) e[n + t] = this[n + i]; else if (s < 1e3 || !c.TYPED_ARRAY_SUPPORT) for (n = 0; n < s; ++n) e[n + t] = this[n + i]; else Uint8Array.prototype.set.call(e, this.subarray(i, i + s), t);
return s;
};
c.prototype.fill = function(e, t, i, r) {
if ("string" == typeof e) {
if ("string" == typeof t) {
r = t;
t = 0;
i = this.length;
} else if ("string" == typeof i) {
r = i;
i = this.length;
}
if (1 === e.length) {
var n = e.charCodeAt(0);
n < 256 && (e = n);
}
if (void 0 !== r && "string" != typeof r) throw new TypeError("encoding must be a string");
if ("string" == typeof r && !c.isEncoding(r)) throw new TypeError("Unknown encoding: " + r);
} else "number" == typeof e && (e &= 255);
if (t < 0 || this.length < t || this.length < i) throw new RangeError("Out of range index");
if (i <= t) return this;
t >>>= 0;
i = void 0 === i ? this.length : i >>> 0;
e || (e = 0);
var s;
if ("number" == typeof e) for (s = t; s < i; ++s) this[s] = e; else {
var a = c.isBuffer(e) ? e : U(new c(e, r).toString()), o = a.length;
for (s = 0; s < i - t; ++s) this[s + t] = a[s % o];
}
return this;
};
var j = /[^+\/0-9A-Za-z-_]/g;
function F(e) {
return e < 16 ? "0" + e.toString(16) : e.toString(16);
}
function U(e, t) {
t = t || Infinity;
for (var i, r = e.length, n = null, s = [], a = 0; a < r; ++a) {
if ((i = e.charCodeAt(a)) > 55295 && i < 57344) {
if (!n) {
if (i > 56319) {
(t -= 3) > -1 && s.push(239, 191, 189);
continue;
}
if (a + 1 === r) {
(t -= 3) > -1 && s.push(239, 191, 189);
continue;
}
n = i;
continue;
}
if (i < 56320) {
(t -= 3) > -1 && s.push(239, 191, 189);
n = i;
continue;
}
i = 65536 + (n - 55296 << 10 | i - 56320);
} else n && (t -= 3) > -1 && s.push(239, 191, 189);
n = null;
if (i < 128) {
if ((t -= 1) < 0) break;
s.push(i);
} else if (i < 2048) {
if ((t -= 2) < 0) break;
s.push(i >> 6 | 192, 63 & i | 128);
} else if (i < 65536) {
if ((t -= 3) < 0) break;
s.push(i >> 12 | 224, i >> 6 & 63 | 128, 63 & i | 128);
} else {
if (!(i < 1114112)) throw new Error("Invalid code point");
if ((t -= 4) < 0) break;
s.push(i >> 18 | 240, i >> 12 & 63 | 128, i >> 6 & 63 | 128, 63 & i | 128);
}
}
return s;
}
function z(e) {
return r.toByteArray(function(e) {
if ((e = function(e) {
return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "");
}(e).replace(j, "")).length < 2) return "";
for (;e.length % 4 != 0; ) e += "=";
return e;
}(e));
}
function q(e, t, i, r) {
for (var n = 0; n < r && !(n + i >= t.length || n >= e.length); ++n) t[n + i] = e[n];
return n;
}
}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
}, {
"base64-js": 15,
ieee754: 99,
isarray: 48
} ],
48: [ function(e, t, i) {
var r = {}.toString;
t.exports = Array.isArray || function(e) {
return "[object Array]" == r.call(e);
};
}, {} ],
49: [ function(e, t, i) {
var r = e("safe-buffer").Buffer, n = e("stream").Transform, s = e("string_decoder").StringDecoder;
function a(e) {
n.call(this);
this.hashMode = "string" == typeof e;
this.hashMode ? this[e] = this._finalOrDigest : this.final = this._finalOrDigest;
if (this._final) {
this.__final = this._final;
this._final = null;
}
this._decoder = null;
this._encoding = null;
}
e("inherits")(a, n);
a.prototype.update = function(e, t, i) {
"string" == typeof e && (e = r.from(e, t));
var n = this._update(e);
if (this.hashMode) return this;
i && (n = this._toString(n, i));
return n;
};
a.prototype.setAutoPadding = function() {};
a.prototype.getAuthTag = function() {
throw new Error("trying to get auth tag in unsupported state");
};
a.prototype.setAuthTag = function() {
throw new Error("trying to set auth tag in unsupported state");
};
a.prototype.setAAD = function() {
throw new Error("trying to set aad in unsupported state");
};
a.prototype._transform = function(e, t, i) {
var r;
try {
this.hashMode ? this._update(e) : this.push(this._update(e));
} catch (e) {
r = e;
} finally {
i(r);
}
};
a.prototype._flush = function(e) {
var t;
try {
this.push(this.__final());
} catch (e) {
t = e;
}
e(t);
};
a.prototype._finalOrDigest = function(e) {
var t = this.__final() || r.alloc(0);
e && (t = this._toString(t, e, !0));
return t;
};
a.prototype._toString = function(e, t, i) {
if (!this._decoder) {
this._decoder = new s(t);
this._encoding = t;
}
if (this._encoding !== t) throw new Error("can't switch encodings");
var r = this._decoder.write(e);
i && (r += this._decoder.end());
return r;
};
t.exports = a;
}, {
inherits: 101,
"safe-buffer": 143,
stream: 152,
string_decoder: 153
} ],
50: [ function(e, t, i) {
(function(e) {
i.isArray = function(e) {
return Array.isArray ? Array.isArray(e) : "[object Array]" === t(e);
};
i.isBoolean = function(e) {
return "boolean" == typeof e;
};
i.isNull = function(e) {
return null === e;
};
i.isNullOrUndefined = function(e) {
return null == e;
};
i.isNumber = function(e) {
return "number" == typeof e;
};
i.isString = function(e) {
return "string" == typeof e;
};
i.isSymbol = function(e) {
return "symbol" == typeof e;
};
i.isUndefined = function(e) {
return void 0 === e;
};
i.isRegExp = function(e) {
return "[object RegExp]" === t(e);
};
i.isObject = function(e) {
return "object" == typeof e && null !== e;
};
i.isDate = function(e) {
return "[object Date]" === t(e);
};
i.isError = function(e) {
return "[object Error]" === t(e) || e instanceof Error;
};
i.isFunction = function(e) {
return "function" == typeof e;
};
i.isPrimitive = function(e) {
return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == typeof e || "undefined" == typeof e;
};
i.isBuffer = e.isBuffer;
function t(e) {
return Object.prototype.toString.call(e);
}
}).call(this, {
isBuffer: e("../../is-buffer/index.js")
});
}, {
"../../is-buffer/index.js": 102
} ],
51: [ function(e, t, i) {
(function(i) {
var r = e("elliptic"), n = e("bn.js");
t.exports = function(e) {
return new a(e);
};
var s = {
secp256k1: {
name: "secp256k1",
byteLength: 32
},
secp224r1: {
name: "p224",
byteLength: 28
},
prime256v1: {
name: "p256",
byteLength: 32
},
prime192v1: {
name: "p192",
byteLength: 24
},
ed25519: {
name: "ed25519",
byteLength: 32
},
secp384r1: {
name: "p384",
byteLength: 48
},
secp521r1: {
name: "p521",
byteLength: 66
}
};
s.p224 = s.secp224r1;
s.p256 = s.secp256r1 = s.prime256v1;
s.p192 = s.secp192r1 = s.prime192v1;
s.p384 = s.secp384r1;
s.p521 = s.secp521r1;
function a(e) {
this.curveType = s[e];
this.curveType || (this.curveType = {
name: e
});
this.curve = new r.ec(this.curveType.name);
this.keys = void 0;
}
a.prototype.generateKeys = function(e, t) {
this.keys = this.curve.genKeyPair();
return this.getPublicKey(e, t);
};
a.prototype.computeSecret = function(e, t, r) {
t = t || "utf8";
i.isBuffer(e) || (e = new i(e, t));
return o(this.curve.keyFromPublic(e).getPublic().mul(this.keys.getPrivate()).getX(), r, this.curveType.byteLength);
};
a.prototype.getPublicKey = function(e, t) {
var i = this.keys.getPublic("compressed" === t, !0);
"hybrid" === t && (i[i.length - 1] % 2 ? i[0] = 7 : i[0] = 6);
return o(i, e);
};
a.prototype.getPrivateKey = function(e) {
return o(this.keys.getPrivate(), e);
};
a.prototype.setPublicKey = function(e, t) {
t = t || "utf8";
i.isBuffer(e) || (e = new i(e, t));
this.keys._importPublic(e);
return this;
};
a.prototype.setPrivateKey = function(e, t) {
t = t || "utf8";
i.isBuffer(e) || (e = new i(e, t));
var r = new n(e);
r = r.toString(16);
this.keys = this.curve.genKeyPair();
this.keys._importPrivate(r);
return this;
};
function o(e, t, r) {
Array.isArray(e) || (e = e.toArray());
var n = new i(e);
if (r && n.length < r) {
var s = new i(r - n.length);
s.fill(0);
n = i.concat([ s, n ]);
}
return t ? n.toString(t) : n;
}
}).call(this, e("buffer").Buffer);
}, {
"bn.js": 16,
buffer: 47,
elliptic: 67
} ],
52: [ function(e, t, i) {
"use strict";
var r = e("inherits"), n = e("md5.js"), s = e("ripemd160"), a = e("sha.js"), o = e("cipher-base");
function c(e) {
o.call(this, "digest");
this._hash = e;
}
r(c, o);
c.prototype._update = function(e) {
this._hash.update(e);
};
c.prototype._final = function() {
return this._hash.digest();
};
t.exports = function(e) {
return "md5" === (e = e.toLowerCase()) ? new n() : "rmd160" === e || "ripemd160" === e ? new s() : new c(a(e));
};
}, {
"cipher-base": 49,
inherits: 101,
"md5.js": 103,
ripemd160: 142,
"sha.js": 145
} ],
53: [ function(e, t, i) {
var r = e("md5.js");
t.exports = function(e) {
return new r().update(e).digest();
};
}, {
"md5.js": 103
} ],
54: [ function(e, t, i) {
"use strict";
var r = e("inherits"), n = e("./legacy"), s = e("cipher-base"), a = e("safe-buffer").Buffer, o = e("create-hash/md5"), c = e("ripemd160"), h = e("sha.js"), f = a.alloc(128);
function d(e, t) {
s.call(this, "digest");
"string" == typeof t && (t = a.from(t));
var i = "sha512" === e || "sha384" === e ? 128 : 64;
this._alg = e;
this._key = t;
if (t.length > i) {
t = ("rmd160" === e ? new c() : h(e)).update(t).digest();
} else t.length < i && (t = a.concat([ t, f ], i));
for (var r = this._ipad = a.allocUnsafe(i), n = this._opad = a.allocUnsafe(i), o = 0; o < i; o++) {
r[o] = 54 ^ t[o];
n[o] = 92 ^ t[o];
}
this._hash = "rmd160" === e ? new c() : h(e);
this._hash.update(r);
}
r(d, s);
d.prototype._update = function(e) {
this._hash.update(e);
};
d.prototype._final = function() {
var e = this._hash.digest();
return ("rmd160" === this._alg ? new c() : h(this._alg)).update(this._opad).update(e).digest();
};
t.exports = function(e, t) {
return "rmd160" === (e = e.toLowerCase()) || "ripemd160" === e ? new d("rmd160", t) : "md5" === e ? new n(o, t) : new d(e, t);
};
}, {
"./legacy": 55,
"cipher-base": 49,
"create-hash/md5": 53,
inherits: 101,
ripemd160: 142,
"safe-buffer": 143,
"sha.js": 145
} ],
55: [ function(e, t, i) {
"use strict";
var r = e("inherits"), n = e("safe-buffer").Buffer, s = e("cipher-base"), a = n.alloc(128), o = 64;
function c(e, t) {
s.call(this, "digest");
"string" == typeof t && (t = n.from(t));
this._alg = e;
this._key = t;
t.length > o ? t = e(t) : t.length < o && (t = n.concat([ t, a ], o));
for (var i = this._ipad = n.allocUnsafe(o), r = this._opad = n.allocUnsafe(o), c = 0; c < o; c++) {
i[c] = 54 ^ t[c];
r[c] = 92 ^ t[c];
}
this._hash = [ i ];
}
r(c, s);
c.prototype._update = function(e) {
this._hash.push(e);
};
c.prototype._final = function() {
var e = this._alg(n.concat(this._hash));
return this._alg(n.concat([ this._opad, e ]));
};
t.exports = c;
}, {
"cipher-base": 49,
inherits: 101,
"safe-buffer": 143
} ],
56: [ function(e, t, i) {
"use strict";
i.randomBytes = i.rng = i.pseudoRandomBytes = i.prng = e("randombytes");
i.createHash = i.Hash = e("create-hash");
i.createHmac = i.Hmac = e("create-hmac");
var r = e("browserify-sign/algos"), n = Object.keys(r), s = [ "sha1", "sha224", "sha256", "sha384", "sha512", "md5", "rmd160" ].concat(n);
i.getHashes = function() {
return s;
};
var a = e("pbkdf2");
i.pbkdf2 = a.pbkdf2;
i.pbkdf2Sync = a.pbkdf2Sync;
var o = e("browserify-cipher");
i.Cipher = o.Cipher;
i.createCipher = o.createCipher;
i.Cipheriv = o.Cipheriv;
i.createCipheriv = o.createCipheriv;
i.Decipher = o.Decipher;
i.createDecipher = o.createDecipher;
i.Decipheriv = o.Decipheriv;
i.createDecipheriv = o.createDecipheriv;
i.getCiphers = o.getCiphers;
i.listCiphers = o.listCiphers;
var c = e("diffie-hellman");
i.DiffieHellmanGroup = c.DiffieHellmanGroup;
i.createDiffieHellmanGroup = c.createDiffieHellmanGroup;
i.getDiffieHellman = c.getDiffieHellman;
i.createDiffieHellman = c.createDiffieHellman;
i.DiffieHellman = c.DiffieHellman;
var h = e("browserify-sign");
i.createSign = h.createSign;
i.Sign = h.Sign;
i.createVerify = h.createVerify;
i.Verify = h.Verify;
i.createECDH = e("create-ecdh");
var f = e("public-encrypt");
i.publicEncrypt = f.publicEncrypt;
i.privateEncrypt = f.privateEncrypt;
i.publicDecrypt = f.publicDecrypt;
i.privateDecrypt = f.privateDecrypt;
var d = e("randomfill");
i.randomFill = d.randomFill;
i.randomFillSync = d.randomFillSync;
i.createCredentials = function() {
throw new Error([ "sorry, createCredentials is not implemented yet", "we accept pull requests", "https://github.com/crypto-browserify/crypto-browserify" ].join("\n"));
};
i.constants = {
DH_CHECK_P_NOT_SAFE_PRIME: 2,
DH_CHECK_P_NOT_PRIME: 1,
DH_UNABLE_TO_CHECK_GENERATOR: 4,
DH_NOT_SUITABLE_GENERATOR: 8,
NPN_ENABLED: 1,
ALPN_ENABLED: 1,
RSA_PKCS1_PADDING: 1,
RSA_SSLV23_PADDING: 2,
RSA_NO_PADDING: 3,
RSA_PKCS1_OAEP_PADDING: 4,
RSA_X931_PADDING: 5,
RSA_PKCS1_PSS_PADDING: 6,
POINT_CONVERSION_COMPRESSED: 2,
POINT_CONVERSION_UNCOMPRESSED: 4,
POINT_CONVERSION_HYBRID: 6
};
}, {
"browserify-cipher": 36,
"browserify-sign": 43,
"browserify-sign/algos": 40,
"create-ecdh": 51,
"create-hash": 52,
"create-hmac": 54,
"diffie-hellman": 63,
pbkdf2: 112,
"public-encrypt": 119,
randombytes: 125,
randomfill: 126
} ],
57: [ function(e, t, i) {
"use strict";
i.utils = e("./des/utils");
i.Cipher = e("./des/cipher");
i.DES = e("./des/des");
i.CBC = e("./des/cbc");
i.EDE = e("./des/ede");
}, {
"./des/cbc": 58,
"./des/cipher": 59,
"./des/des": 60,
"./des/ede": 61,
"./des/utils": 62
} ],
58: [ function(e, t, i) {
"use strict";
var r = e("minimalistic-assert"), n = e("inherits"), s = {};
i.instantiate = function(e) {
function t(t) {
e.call(this, t);
this._cbcInit();
}
n(t, e);
for (var i = Object.keys(s), r = 0; r < i.length; r++) {
var a = i[r];
t.prototype[a] = s[a];
}
t.create = function(e) {
return new t(e);
};
return t;
};
s._cbcInit = function() {
var e = new function(e) {
r.equal(e.length, 8, "Invalid IV length");
this.iv = new Array(8);
for (var t = 0; t < this.iv.length; t++) this.iv[t] = e[t];
}(this.options.iv);
this._cbcState = e;
};
s._update = function(e, t, i, r) {
var n = this._cbcState, s = this.constructor.super_.prototype, a = n.iv;
if ("encrypt" === this.type) {
for (var o = 0; o < this.blockSize; o++) a[o] ^= e[t + o];
s._update.call(this, a, 0, i, r);
for (o = 0; o < this.blockSize; o++) a[o] = i[r + o];
} else {
s._update.call(this, e, t, i, r);
for (o = 0; o < this.blockSize; o++) i[r + o] ^= a[o];
for (o = 0; o < this.blockSize; o++) a[o] = e[t + o];
}
};
}, {
inherits: 101,
"minimalistic-assert": 105
} ],
59: [ function(e, t, i) {
"use strict";
var r = e("minimalistic-assert");
function n(e) {
this.options = e;
this.type = this.options.type;
this.blockSize = 8;
this._init();
this.buffer = new Array(this.blockSize);
this.bufferOff = 0;
}
t.exports = n;
n.prototype._init = function() {};
n.prototype.update = function(e) {
return 0 === e.length ? [] : "decrypt" === this.type ? this._updateDecrypt(e) : this._updateEncrypt(e);
};
n.prototype._buffer = function(e, t) {
for (var i = Math.min(this.buffer.length - this.bufferOff, e.length - t), r = 0; r < i; r++) this.buffer[this.bufferOff + r] = e[t + r];
this.bufferOff += i;
return i;
};
n.prototype._flushBuffer = function(e, t) {
this._update(this.buffer, 0, e, t);
this.bufferOff = 0;
return this.blockSize;
};
n.prototype._updateEncrypt = function(e) {
var t = 0, i = 0, r = (this.bufferOff + e.length) / this.blockSize | 0, n = new Array(r * this.blockSize);
if (0 !== this.bufferOff) {
t += this._buffer(e, t);
this.bufferOff === this.buffer.length && (i += this._flushBuffer(n, i));
}
for (var s = e.length - (e.length - t) % this.blockSize; t < s; t += this.blockSize) {
this._update(e, t, n, i);
i += this.blockSize;
}
for (;t < e.length; t++, this.bufferOff++) this.buffer[this.bufferOff] = e[t];
return n;
};
n.prototype._updateDecrypt = function(e) {
for (var t = 0, i = 0, r = Math.ceil((this.bufferOff + e.length) / this.blockSize) - 1, n = new Array(r * this.blockSize); r > 0; r--) {
t += this._buffer(e, t);
i += this._flushBuffer(n, i);
}
t += this._buffer(e, t);
return n;
};
n.prototype.final = function(e) {
var t, i;
e && (t = this.update(e));
i = "encrypt" === this.type ? this._finalEncrypt() : this._finalDecrypt();
return t ? t.concat(i) : i;
};
n.prototype._pad = function(e, t) {
if (0 === t) return !1;
for (;t < e.length; ) e[t++] = 0;
return !0;
};
n.prototype._finalEncrypt = function() {
if (!this._pad(this.buffer, this.bufferOff)) return [];
var e = new Array(this.blockSize);
this._update(this.buffer, 0, e, 0);
return e;
};
n.prototype._unpad = function(e) {
return e;
};
n.prototype._finalDecrypt = function() {
r.equal(this.bufferOff, this.blockSize, "Not enough data to decrypt");
var e = new Array(this.blockSize);
this._flushBuffer(e, 0);
return this._unpad(e);
};
}, {
"minimalistic-assert": 105
} ],
60: [ function(e, t, i) {
"use strict";
var r = e("minimalistic-assert"), n = e("inherits"), s = e("../des"), a = s.utils, o = s.Cipher;
function c(e) {
o.call(this, e);
var t = new function() {
this.tmp = new Array(2);
this.keys = null;
}();
this._desState = t;
this.deriveKeys(t, e.key);
}
n(c, o);
t.exports = c;
c.create = function(e) {
return new c(e);
};
var h = [ 1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1 ];
c.prototype.deriveKeys = function(e, t) {
e.keys = new Array(32);
r.equal(t.length, this.blockSize, "Invalid key length");
var i = a.readUInt32BE(t, 0), n = a.readUInt32BE(t, 4);
a.pc1(i, n, e.tmp, 0);
i = e.tmp[0];
n = e.tmp[1];
for (var s = 0; s < e.keys.length; s += 2) {
var o = h[s >>> 1];
i = a.r28shl(i, o);
n = a.r28shl(n, o);
a.pc2(i, n, e.keys, s);
}
};
c.prototype._update = function(e, t, i, r) {
var n = this._desState, s = a.readUInt32BE(e, t), o = a.readUInt32BE(e, t + 4);
a.ip(s, o, n.tmp, 0);
s = n.tmp[0];
o = n.tmp[1];
"encrypt" === this.type ? this._encrypt(n, s, o, n.tmp, 0) : this._decrypt(n, s, o, n.tmp, 0);
s = n.tmp[0];
o = n.tmp[1];
a.writeUInt32BE(i, s, r);
a.writeUInt32BE(i, o, r + 4);
};
c.prototype._pad = function(e, t) {
for (var i = e.length - t, r = t; r < e.length; r++) e[r] = i;
return !0;
};
c.prototype._unpad = function(e) {
for (var t = e[e.length - 1], i = e.length - t; i < e.length; i++) r.equal(e[i], t);
return e.slice(0, e.length - t);
};
c.prototype._encrypt = function(e, t, i, r, n) {
for (var s = t, o = i, c = 0; c < e.keys.length; c += 2) {
var h = e.keys[c], f = e.keys[c + 1];
a.expand(o, e.tmp, 0);
h ^= e.tmp[0];
f ^= e.tmp[1];
var d = a.substitute(h, f), u = o;
o = (s ^ a.permute(d)) >>> 0;
s = u;
}
a.rip(o, s, r, n);
};
c.prototype._decrypt = function(e, t, i, r, n) {
for (var s = i, o = t, c = e.keys.length - 2; c >= 0; c -= 2) {
var h = e.keys[c], f = e.keys[c + 1];
a.expand(s, e.tmp, 0);
h ^= e.tmp[0];
f ^= e.tmp[1];
var d = a.substitute(h, f), u = s;
s = (o ^ a.permute(d)) >>> 0;
o = u;
}
a.rip(s, o, r, n);
};
}, {
"../des": 57,
inherits: 101,
"minimalistic-assert": 105
} ],
61: [ function(e, t, i) {
"use strict";
var r = e("minimalistic-assert"), n = e("inherits"), s = e("../des"), a = s.Cipher, o = s.DES;
function c(e) {
a.call(this, e);
var t = new function(e, t) {
r.equal(t.length, 24, "Invalid key length");
var i = t.slice(0, 8), n = t.slice(8, 16), s = t.slice(16, 24);
this.ciphers = "encrypt" === e ? [ o.create({
type: "encrypt",
key: i
}), o.create({
type: "decrypt",
key: n
}), o.create({
type: "encrypt",
key: s
}) ] : [ o.create({
type: "decrypt",
key: s
}), o.create({
type: "encrypt",
key: n
}), o.create({
type: "decrypt",
key: i
}) ];
}(this.type, this.options.key);
this._edeState = t;
}
n(c, a);
t.exports = c;
c.create = function(e) {
return new c(e);
};
c.prototype._update = function(e, t, i, r) {
var n = this._edeState;
n.ciphers[0]._update(e, t, i, r);
n.ciphers[1]._update(i, r, i, r);
n.ciphers[2]._update(i, r, i, r);
};
c.prototype._pad = o.prototype._pad;
c.prototype._unpad = o.prototype._unpad;
}, {
"../des": 57,
inherits: 101,
"minimalistic-assert": 105
} ],
62: [ function(e, t, i) {
"use strict";
i.readUInt32BE = function(e, t) {
return (e[0 + t] << 24 | e[1 + t] << 16 | e[2 + t] << 8 | e[3 + t]) >>> 0;
};
i.writeUInt32BE = function(e, t, i) {
e[0 + i] = t >>> 24;
e[1 + i] = t >>> 16 & 255;
e[2 + i] = t >>> 8 & 255;
e[3 + i] = 255 & t;
};
i.ip = function(e, t, i, r) {
for (var n = 0, s = 0, a = 6; a >= 0; a -= 2) {
for (var o = 0; o <= 24; o += 8) {
n <<= 1;
n |= t >>> o + a & 1;
}
for (o = 0; o <= 24; o += 8) {
n <<= 1;
n |= e >>> o + a & 1;
}
}
for (a = 6; a >= 0; a -= 2) {
for (o = 1; o <= 25; o += 8) {
s <<= 1;
s |= t >>> o + a & 1;
}
for (o = 1; o <= 25; o += 8) {
s <<= 1;
s |= e >>> o + a & 1;
}
}
i[r + 0] = n >>> 0;
i[r + 1] = s >>> 0;
};
i.rip = function(e, t, i, r) {
for (var n = 0, s = 0, a = 0; a < 4; a++) for (var o = 24; o >= 0; o -= 8) {
n <<= 1;
n |= t >>> o + a & 1;
n <<= 1;
n |= e >>> o + a & 1;
}
for (a = 4; a < 8; a++) for (o = 24; o >= 0; o -= 8) {
s <<= 1;
s |= t >>> o + a & 1;
s <<= 1;
s |= e >>> o + a & 1;
}
i[r + 0] = n >>> 0;
i[r + 1] = s >>> 0;
};
i.pc1 = function(e, t, i, r) {
for (var n = 0, s = 0, a = 7; a >= 5; a--) {
for (var o = 0; o <= 24; o += 8) {
n <<= 1;
n |= t >> o + a & 1;
}
for (o = 0; o <= 24; o += 8) {
n <<= 1;
n |= e >> o + a & 1;
}
}
for (o = 0; o <= 24; o += 8) {
n <<= 1;
n |= t >> o + a & 1;
}
for (a = 1; a <= 3; a++) {
for (o = 0; o <= 24; o += 8) {
s <<= 1;
s |= t >> o + a & 1;
}
for (o = 0; o <= 24; o += 8) {
s <<= 1;
s |= e >> o + a & 1;
}
}
for (o = 0; o <= 24; o += 8) {
s <<= 1;
s |= e >> o + a & 1;
}
i[r + 0] = n >>> 0;
i[r + 1] = s >>> 0;
};
i.r28shl = function(e, t) {
return e << t & 268435455 | e >>> 28 - t;
};
var r = [ 14, 11, 17, 4, 27, 23, 25, 0, 13, 22, 7, 18, 5, 9, 16, 24, 2, 20, 12, 21, 1, 8, 15, 26, 15, 4, 25, 19, 9, 1, 26, 16, 5, 11, 23, 8, 12, 7, 17, 0, 22, 3, 10, 14, 6, 20, 27, 24 ];
i.pc2 = function(e, t, i, n) {
for (var s = 0, a = 0, o = r.length >>> 1, c = 0; c < o; c++) {
s <<= 1;
s |= e >>> r[c] & 1;
}
for (c = o; c < r.length; c++) {
a <<= 1;
a |= t >>> r[c] & 1;
}
i[n + 0] = s >>> 0;
i[n + 1] = a >>> 0;
};
i.expand = function(e, t, i) {
var r = 0, n = 0;
r = (1 & e) << 5 | e >>> 27;
for (var s = 23; s >= 15; s -= 4) {
r <<= 6;
r |= e >>> s & 63;
}
for (s = 11; s >= 3; s -= 4) {
n |= e >>> s & 63;
n <<= 6;
}
n |= (31 & e) << 1 | e >>> 31;
t[i + 0] = r >>> 0;
t[i + 1] = n >>> 0;
};
var n = [ 14, 0, 4, 15, 13, 7, 1, 4, 2, 14, 15, 2, 11, 13, 8, 1, 3, 10, 10, 6, 6, 12, 12, 11, 5, 9, 9, 5, 0, 3, 7, 8, 4, 15, 1, 12, 14, 8, 8, 2, 13, 4, 6, 9, 2, 1, 11, 7, 15, 5, 12, 11, 9, 3, 7, 14, 3, 10, 10, 0, 5, 6, 0, 13, 15, 3, 1, 13, 8, 4, 14, 7, 6, 15, 11, 2, 3, 8, 4, 14, 9, 12, 7, 0, 2, 1, 13, 10, 12, 6, 0, 9, 5, 11, 10, 5, 0, 13, 14, 8, 7, 10, 11, 1, 10, 3, 4, 15, 13, 4, 1, 2, 5, 11, 8, 6, 12, 7, 6, 12, 9, 0, 3, 5, 2, 14, 15, 9, 10, 13, 0, 7, 9, 0, 14, 9, 6, 3, 3, 4, 15, 6, 5, 10, 1, 2, 13, 8, 12, 5, 7, 14, 11, 12, 4, 11, 2, 15, 8, 1, 13, 1, 6, 10, 4, 13, 9, 0, 8, 6, 15, 9, 3, 8, 0, 7, 11, 4, 1, 15, 2, 14, 12, 3, 5, 11, 10, 5, 14, 2, 7, 12, 7, 13, 13, 8, 14, 11, 3, 5, 0, 6, 6, 15, 9, 0, 10, 3, 1, 4, 2, 7, 8, 2, 5, 12, 11, 1, 12, 10, 4, 14, 15, 9, 10, 3, 6, 15, 9, 0, 0, 6, 12, 10, 11, 1, 7, 13, 13, 8, 15, 9, 1, 4, 3, 5, 14, 11, 5, 12, 2, 7, 8, 2, 4, 14, 2, 14, 12, 11, 4, 2, 1, 12, 7, 4, 10, 7, 11, 13, 6, 1, 8, 5, 5, 0, 3, 15, 15, 10, 13, 3, 0, 9, 14, 8, 9, 6, 4, 11, 2, 8, 1, 12, 11, 7, 10, 1, 13, 14, 7, 2, 8, 13, 15, 6, 9, 15, 12, 0, 5, 9, 6, 10, 3, 4, 0, 5, 14, 3, 12, 10, 1, 15, 10, 4, 15, 2, 9, 7, 2, 12, 6, 9, 8, 5, 0, 6, 13, 1, 3, 13, 4, 14, 14, 0, 7, 11, 5, 3, 11, 8, 9, 4, 14, 3, 15, 2, 5, 12, 2, 9, 8, 5, 12, 15, 3, 10, 7, 11, 0, 14, 4, 1, 10, 7, 1, 6, 13, 0, 11, 8, 6, 13, 4, 13, 11, 0, 2, 11, 14, 7, 15, 4, 0, 9, 8, 1, 13, 10, 3, 14, 12, 3, 9, 5, 7, 12, 5, 2, 10, 15, 6, 8, 1, 6, 1, 6, 4, 11, 11, 13, 13, 8, 12, 1, 3, 4, 7, 10, 14, 7, 10, 9, 15, 5, 6, 0, 8, 15, 0, 14, 5, 2, 9, 3, 2, 12, 13, 1, 2, 15, 8, 13, 4, 8, 6, 10, 15, 3, 11, 7, 1, 4, 10, 12, 9, 5, 3, 6, 14, 11, 5, 0, 0, 14, 12, 9, 7, 2, 7, 2, 11, 1, 4, 14, 1, 7, 9, 4, 12, 10, 14, 8, 2, 13, 0, 15, 6, 12, 10, 9, 13, 0, 15, 3, 3, 5, 5, 6, 8, 11 ];
i.substitute = function(e, t) {
for (var i = 0, r = 0; r < 4; r++) {
i <<= 4;
i |= n[64 * r + (e >>> 18 - 6 * r & 63)];
}
for (r = 0; r < 4; r++) {
i <<= 4;
i |= n[256 + 64 * r + (t >>> 18 - 6 * r & 63)];
}
return i >>> 0;
};
var s = [ 16, 25, 12, 11, 3, 20, 4, 15, 31, 17, 9, 6, 27, 14, 1, 22, 30, 24, 8, 18, 0, 5, 29, 23, 13, 19, 2, 26, 10, 21, 28, 7 ];
i.permute = function(e) {
for (var t = 0, i = 0; i < s.length; i++) {
t <<= 1;
t |= e >>> s[i] & 1;
}
return t >>> 0;
};
i.padSplit = function(e, t, i) {
for (var r = e.toString(2); r.length < t; ) r = "0" + r;
for (var n = [], s = 0; s < t; s += i) n.push(r.slice(s, s + i));
return n.join(" ");
};
}, {} ],
63: [ function(e, t, i) {
(function(t) {
var r = e("./lib/generatePrime"), n = e("./lib/primes.json"), s = e("./lib/dh");
var a = {
binary: !0,
hex: !0,
base64: !0
};
i.DiffieHellmanGroup = i.createDiffieHellmanGroup = i.getDiffieHellman = function(e) {
var i = new t(n[e].prime, "hex"), r = new t(n[e].gen, "hex");
return new s(i, r);
};
i.createDiffieHellman = i.DiffieHellman = function e(i, n, o, c) {
if (t.isBuffer(n) || void 0 === a[n]) return e(i, "binary", n, o);
n = n || "binary";
c = c || "binary";
o = o || new t([ 2 ]);
t.isBuffer(o) || (o = new t(o, c));
if ("number" == typeof i) return new s(r(i, o), o, !0);
t.isBuffer(i) || (i = new t(i, n));
return new s(i, o, !0);
};
}).call(this, e("buffer").Buffer);
}, {
"./lib/dh": 64,
"./lib/generatePrime": 65,
"./lib/primes.json": 66,
buffer: 47
} ],
64: [ function(e, t, i) {
(function(i) {
var r = e("bn.js"), n = new (e("miller-rabin"))(), s = new r(24), a = new r(11), o = new r(10), c = new r(3), h = new r(7), f = e("./generatePrime"), d = e("randombytes");
t.exports = b;
function u(e, t) {
t = t || "utf8";
i.isBuffer(e) || (e = new i(e, t));
this._pub = new r(e);
return this;
}
function l(e, t) {
t = t || "utf8";
i.isBuffer(e) || (e = new i(e, t));
this._priv = new r(e);
return this;
}
var p = {};
function b(e, t, i) {
this.setGenerator(t);
this.__prime = new r(e);
this._prime = r.mont(this.__prime);
this._primeLen = e.length;
this._pub = void 0;
this._priv = void 0;
this._primeCode = void 0;
if (i) {
this.setPublicKey = u;
this.setPrivateKey = l;
} else this._primeCode = 8;
}
Object.defineProperty(b.prototype, "verifyError", {
enumerable: !0,
get: function() {
"number" != typeof this._primeCode && (this._primeCode = function(e, t) {
var i = t.toString("hex"), r = [ i, e.toString(16) ].join("_");
if (r in p) return p[r];
var d, u = 0;
if (e.isEven() || !f.simpleSieve || !f.fermatTest(e) || !n.test(e)) {
u += 1;
u += "02" === i || "05" === i ? 8 : 4;
p[r] = u;
return u;
}
n.test(e.shrn(1)) || (u += 2);
switch (i) {
case "02":
e.mod(s).cmp(a) && (u += 8);
break;

case "05":
(d = e.mod(o)).cmp(c) && d.cmp(h) && (u += 8);
break;

default:
u += 4;
}
p[r] = u;
return u;
}(this.__prime, this.__gen));
return this._primeCode;
}
});
b.prototype.generateKeys = function() {
this._priv || (this._priv = new r(d(this._primeLen)));
this._pub = this._gen.toRed(this._prime).redPow(this._priv).fromRed();
return this.getPublicKey();
};
b.prototype.computeSecret = function(e) {
var t = (e = (e = new r(e)).toRed(this._prime)).redPow(this._priv).fromRed(), n = new i(t.toArray()), s = this.getPrime();
if (n.length < s.length) {
var a = new i(s.length - n.length);
a.fill(0);
n = i.concat([ a, n ]);
}
return n;
};
b.prototype.getPublicKey = function(e) {
return g(this._pub, e);
};
b.prototype.getPrivateKey = function(e) {
return g(this._priv, e);
};
b.prototype.getPrime = function(e) {
return g(this.__prime, e);
};
b.prototype.getGenerator = function(e) {
return g(this._gen, e);
};
b.prototype.setGenerator = function(e, t) {
t = t || "utf8";
i.isBuffer(e) || (e = new i(e, t));
this.__gen = e;
this._gen = new r(e);
return this;
};
function g(e, t) {
var r = new i(e.toArray());
return t ? r.toString(t) : r;
}
}).call(this, e("buffer").Buffer);
}, {
"./generatePrime": 65,
"bn.js": 16,
buffer: 47,
"miller-rabin": 104,
randombytes: 125
} ],
65: [ function(e, t, i) {
var r = e("randombytes");
t.exports = m;
m.simpleSieve = g;
m.fermatTest = y;
var n = e("bn.js"), s = new n(24), a = new (e("miller-rabin"))(), o = new n(1), c = new n(2), h = new n(5), f = (new n(16), 
new n(8), new n(10)), d = new n(3), u = (new n(7), new n(11)), l = new n(4), p = (new n(12), 
null);
function b() {
if (null !== p) return p;
var e = [];
e[0] = 2;
for (var t = 1, i = 3; i < 1048576; i += 2) {
for (var r = Math.ceil(Math.sqrt(i)), n = 0; n < t && e[n] <= r && i % e[n] != 0; n++) ;
t !== n && e[n] <= r || (e[t++] = i);
}
p = e;
return e;
}
function g(e) {
for (var t = b(), i = 0; i < t.length; i++) if (0 === e.modn(t[i])) return 0 === e.cmpn(t[i]);
return !0;
}
function y(e) {
var t = n.mont(e);
return 0 === c.toRed(t).redPow(e.subn(1)).fromRed().cmpn(1);
}
function m(e, t) {
if (e < 16) return new n(2 === t || 5 === t ? [ 140, 123 ] : [ 140, 39 ]);
t = new n(t);
for (var i, p; ;) {
i = new n(r(Math.ceil(e / 8)));
for (;i.bitLength() > e; ) i.ishrn(1);
i.isEven() && i.iadd(o);
i.testn(1) || i.iadd(c);
if (t.cmp(c)) {
if (!t.cmp(h)) for (;i.mod(f).cmp(d); ) i.iadd(l);
} else for (;i.mod(s).cmp(u); ) i.iadd(l);
if (g(p = i.shrn(1)) && g(i) && y(p) && y(i) && a.test(p) && a.test(i)) return i;
}
}
}, {
"bn.js": 16,
"miller-rabin": 104,
randombytes: 125
} ],
66: [ function(e, t, i) {
t.exports = {
modp1: {
gen: "02",
prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a63a3620ffffffffffffffff"
},
modp2: {
gen: "02",
prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece65381ffffffffffffffff"
},
modp5: {
gen: "02",
prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca237327ffffffffffffffff"
},
modp14: {
gen: "02",
prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aacaa68ffffffffffffffff"
},
modp15: {
gen: "02",
prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a93ad2caffffffffffffffff"
},
modp16: {
gen: "02",
prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c934063199ffffffffffffffff"
},
modp17: {
gen: "02",
prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dcc4024ffffffffffffffff"
},
modp18: {
gen: "02",
prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dbe115974a3926f12fee5e438777cb6a932df8cd8bec4d073b931ba3bc832b68d9dd300741fa7bf8afc47ed2576f6936ba424663aab639c5ae4f5683423b4742bf1c978238f16cbe39d652de3fdb8befc848ad922222e04a4037c0713eb57a81a23f0c73473fc646cea306b4bcbc8862f8385ddfa9d4b7fa2c087e879683303ed5bdd3a062b3cf5b3a278a66d2a13f83f44f82ddf310ee074ab6a364597e899a0255dc164f31cc50846851df9ab48195ded7ea1b1d510bd7ee74d73faf36bc31ecfa268359046f4eb879f924009438b481c6cd7889a002ed5ee382bc9190da6fc026e479558e4475677e9aa9e3050e2765694dfc81f56e880b96e7160c980dd98edd3dfffffffffffffffff"
}
};
}, {} ],
67: [ function(e, t, i) {
"use strict";
var r = i;
r.version = e("../package.json").version;
r.utils = e("./elliptic/utils");
r.rand = e("brorand");
r.curve = e("./elliptic/curve");
r.curves = e("./elliptic/curves");
r.ec = e("./elliptic/ec");
r.eddsa = e("./elliptic/eddsa");
}, {
"../package.json": 82,
"./elliptic/curve": 70,
"./elliptic/curves": 73,
"./elliptic/ec": 74,
"./elliptic/eddsa": 77,
"./elliptic/utils": 81,
brorand: 17
} ],
68: [ function(e, t, i) {
"use strict";
var r = e("bn.js"), n = e("../../elliptic").utils, s = n.getNAF, a = n.getJSF, o = n.assert;
function c(e, t) {
this.type = e;
this.p = new r(t.p, 16);
this.red = t.prime ? r.red(t.prime) : r.mont(this.p);
this.zero = new r(0).toRed(this.red);
this.one = new r(1).toRed(this.red);
this.two = new r(2).toRed(this.red);
this.n = t.n && new r(t.n, 16);
this.g = t.g && this.pointFromJSON(t.g, t.gRed);
this._wnafT1 = new Array(4);
this._wnafT2 = new Array(4);
this._wnafT3 = new Array(4);
this._wnafT4 = new Array(4);
var i = this.n && this.p.div(this.n);
if (!i || i.cmpn(100) > 0) this.redN = null; else {
this._maxwellTrick = !0;
this.redN = this.n.toRed(this.red);
}
}
t.exports = c;
c.prototype.point = function() {
throw new Error("Not implemented");
};
c.prototype.validate = function() {
throw new Error("Not implemented");
};
c.prototype._fixedNafMul = function(e, t) {
o(e.precomputed);
var i = e._getDoubles(), r = s(t, 1), n = (1 << i.step + 1) - (i.step % 2 == 0 ? 2 : 1);
n /= 3;
for (var a = [], c = 0; c < r.length; c += i.step) {
var h = 0;
for (t = c + i.step - 1; t >= c; t--) h = (h << 1) + r[t];
a.push(h);
}
for (var f = this.jpoint(null, null, null), d = this.jpoint(null, null, null), u = n; u > 0; u--) {
for (c = 0; c < a.length; c++) {
(h = a[c]) === u ? d = d.mixedAdd(i.points[c]) : h === -u && (d = d.mixedAdd(i.points[c].neg()));
}
f = f.add(d);
}
return f.toP();
};
c.prototype._wnafMul = function(e, t) {
var i = 4, r = e._getNAFPoints(i);
i = r.wnd;
for (var n = r.points, a = s(t, i), c = this.jpoint(null, null, null), h = a.length - 1; h >= 0; h--) {
for (t = 0; h >= 0 && 0 === a[h]; h--) t++;
h >= 0 && t++;
c = c.dblp(t);
if (h < 0) break;
var f = a[h];
o(0 !== f);
c = "affine" === e.type ? f > 0 ? c.mixedAdd(n[f - 1 >> 1]) : c.mixedAdd(n[-f - 1 >> 1].neg()) : f > 0 ? c.add(n[f - 1 >> 1]) : c.add(n[-f - 1 >> 1].neg());
}
return "affine" === e.type ? c.toP() : c;
};
c.prototype._wnafMulAdd = function(e, t, i, r, n) {
for (var o = this._wnafT1, c = this._wnafT2, h = this._wnafT3, f = 0, d = 0; d < r; d++) {
var u = (S = t[d])._getNAFPoints(e);
o[d] = u.wnd;
c[d] = u.points;
}
for (d = r - 1; d >= 1; d -= 2) {
var l = d - 1, p = d;
if (1 === o[l] && 1 === o[p]) {
var b = [ t[l], null, null, t[p] ];
if (0 === t[l].y.cmp(t[p].y)) {
b[1] = t[l].add(t[p]);
b[2] = t[l].toJ().mixedAdd(t[p].neg());
} else if (0 === t[l].y.cmp(t[p].y.redNeg())) {
b[1] = t[l].toJ().mixedAdd(t[p]);
b[2] = t[l].add(t[p].neg());
} else {
b[1] = t[l].toJ().mixedAdd(t[p]);
b[2] = t[l].toJ().mixedAdd(t[p].neg());
}
var g = [ -3, -1, -5, -7, 0, 7, 5, 1, 3 ], y = a(i[l], i[p]);
f = Math.max(y[0].length, f);
h[l] = new Array(f);
h[p] = new Array(f);
for (var m = 0; m < f; m++) {
var v = 0 | y[0][m], _ = 0 | y[1][m];
h[l][m] = g[3 * (v + 1) + (_ + 1)];
h[p][m] = 0;
c[l] = b;
}
} else {
h[l] = s(i[l], o[l]);
h[p] = s(i[p], o[p]);
f = Math.max(h[l].length, f);
f = Math.max(h[p].length, f);
}
}
var w = this.jpoint(null, null, null), x = this._wnafT4;
for (d = f; d >= 0; d--) {
for (var C = 0; d >= 0; ) {
var E = !0;
for (m = 0; m < r; m++) {
x[m] = 0 | h[m][d];
0 !== x[m] && (E = !1);
}
if (!E) break;
C++;
d--;
}
d >= 0 && C++;
w = w.dblp(C);
if (d < 0) break;
for (m = 0; m < r; m++) {
var S, A = x[m];
if (0 !== A) {
A > 0 ? S = c[m][A - 1 >> 1] : A < 0 && (S = c[m][-A - 1 >> 1].neg());
w = "affine" === S.type ? w.mixedAdd(S) : w.add(S);
}
}
}
for (d = 0; d < r; d++) c[d] = null;
return n ? w : w.toP();
};
function h(e, t) {
this.curve = e;
this.type = t;
this.precomputed = null;
}
c.BasePoint = h;
h.prototype.eq = function() {
throw new Error("Not implemented");
};
h.prototype.validate = function() {
return this.curve.validate(this);
};
c.prototype.decodePoint = function(e, t) {
e = n.toArray(e, t);
var i = this.p.byteLength();
if ((4 === e[0] || 6 === e[0] || 7 === e[0]) && e.length - 1 == 2 * i) {
6 === e[0] ? o(e[e.length - 1] % 2 == 0) : 7 === e[0] && o(e[e.length - 1] % 2 == 1);
return this.point(e.slice(1, 1 + i), e.slice(1 + i, 1 + 2 * i));
}
if ((2 === e[0] || 3 === e[0]) && e.length - 1 === i) return this.pointFromX(e.slice(1, 1 + i), 3 === e[0]);
throw new Error("Unknown point format");
};
h.prototype.encodeCompressed = function(e) {
return this.encode(e, !0);
};
h.prototype._encode = function(e) {
var t = this.curve.p.byteLength(), i = this.getX().toArray("be", t);
return e ? [ this.getY().isEven() ? 2 : 3 ].concat(i) : [ 4 ].concat(i, this.getY().toArray("be", t));
};
h.prototype.encode = function(e, t) {
return n.encode(this._encode(t), e);
};
h.prototype.precompute = function(e) {
if (this.precomputed) return this;
var t = {
doubles: null,
naf: null,
beta: null
};
t.naf = this._getNAFPoints(8);
t.doubles = this._getDoubles(4, e);
t.beta = this._getBeta();
this.precomputed = t;
return this;
};
h.prototype._hasDoubles = function(e) {
if (!this.precomputed) return !1;
var t = this.precomputed.doubles;
return !!t && t.points.length >= Math.ceil((e.bitLength() + 1) / t.step);
};
h.prototype._getDoubles = function(e, t) {
if (this.precomputed && this.precomputed.doubles) return this.precomputed.doubles;
for (var i = [ this ], r = this, n = 0; n < t; n += e) {
for (var s = 0; s < e; s++) r = r.dbl();
i.push(r);
}
return {
step: e,
points: i
};
};
h.prototype._getNAFPoints = function(e) {
if (this.precomputed && this.precomputed.naf) return this.precomputed.naf;
for (var t = [ this ], i = (1 << e) - 1, r = 1 === i ? null : this.dbl(), n = 1; n < i; n++) t[n] = t[n - 1].add(r);
return {
wnd: e,
points: t
};
};
h.prototype._getBeta = function() {
return null;
};
h.prototype.dblp = function(e) {
for (var t = this, i = 0; i < e; i++) t = t.dbl();
return t;
};
}, {
"../../elliptic": 67,
"bn.js": 16
} ],
69: [ function(e, t, i) {
"use strict";
var r = e("../curve"), n = e("../../elliptic"), s = e("bn.js"), a = e("inherits"), o = r.base, c = n.utils.assert;
function h(e) {
this.twisted = 1 != (0 | e.a);
this.mOneA = this.twisted && -1 == (0 | e.a);
this.extended = this.mOneA;
o.call(this, "edwards", e);
this.a = new s(e.a, 16).umod(this.red.m);
this.a = this.a.toRed(this.red);
this.c = new s(e.c, 16).toRed(this.red);
this.c2 = this.c.redSqr();
this.d = new s(e.d, 16).toRed(this.red);
this.dd = this.d.redAdd(this.d);
c(!this.twisted || 0 === this.c.fromRed().cmpn(1));
this.oneC = 1 == (0 | e.c);
}
a(h, o);
t.exports = h;
h.prototype._mulA = function(e) {
return this.mOneA ? e.redNeg() : this.a.redMul(e);
};
h.prototype._mulC = function(e) {
return this.oneC ? e : this.c.redMul(e);
};
h.prototype.jpoint = function(e, t, i, r) {
return this.point(e, t, i, r);
};
h.prototype.pointFromX = function(e, t) {
(e = new s(e, 16)).red || (e = e.toRed(this.red));
var i = e.redSqr(), r = this.c2.redSub(this.a.redMul(i)), n = this.one.redSub(this.c2.redMul(this.d).redMul(i)), a = r.redMul(n.redInvm()), o = a.redSqrt();
if (0 !== o.redSqr().redSub(a).cmp(this.zero)) throw new Error("invalid point");
var c = o.fromRed().isOdd();
(t && !c || !t && c) && (o = o.redNeg());
return this.point(e, o);
};
h.prototype.pointFromY = function(e, t) {
(e = new s(e, 16)).red || (e = e.toRed(this.red));
var i = e.redSqr(), r = i.redSub(this.c2), n = i.redMul(this.d).redMul(this.c2).redSub(this.a), a = r.redMul(n.redInvm());
if (0 === a.cmp(this.zero)) {
if (t) throw new Error("invalid point");
return this.point(this.zero, e);
}
var o = a.redSqrt();
if (0 !== o.redSqr().redSub(a).cmp(this.zero)) throw new Error("invalid point");
o.fromRed().isOdd() !== t && (o = o.redNeg());
return this.point(o, e);
};
h.prototype.validate = function(e) {
if (e.isInfinity()) return !0;
e.normalize();
var t = e.x.redSqr(), i = e.y.redSqr(), r = t.redMul(this.a).redAdd(i), n = this.c2.redMul(this.one.redAdd(this.d.redMul(t).redMul(i)));
return 0 === r.cmp(n);
};
function f(e, t, i, r, n) {
o.BasePoint.call(this, e, "projective");
if (null === t && null === i && null === r) {
this.x = this.curve.zero;
this.y = this.curve.one;
this.z = this.curve.one;
this.t = this.curve.zero;
this.zOne = !0;
} else {
this.x = new s(t, 16);
this.y = new s(i, 16);
this.z = r ? new s(r, 16) : this.curve.one;
this.t = n && new s(n, 16);
this.x.red || (this.x = this.x.toRed(this.curve.red));
this.y.red || (this.y = this.y.toRed(this.curve.red));
this.z.red || (this.z = this.z.toRed(this.curve.red));
this.t && !this.t.red && (this.t = this.t.toRed(this.curve.red));
this.zOne = this.z === this.curve.one;
if (this.curve.extended && !this.t) {
this.t = this.x.redMul(this.y);
this.zOne || (this.t = this.t.redMul(this.z.redInvm()));
}
}
}
a(f, o.BasePoint);
h.prototype.pointFromJSON = function(e) {
return f.fromJSON(this, e);
};
h.prototype.point = function(e, t, i, r) {
return new f(this, e, t, i, r);
};
f.fromJSON = function(e, t) {
return new f(e, t[0], t[1], t[2]);
};
f.prototype.inspect = function() {
return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
};
f.prototype.isInfinity = function() {
return 0 === this.x.cmpn(0) && (0 === this.y.cmp(this.z) || this.zOne && 0 === this.y.cmp(this.curve.c));
};
f.prototype._extDbl = function() {
var e = this.x.redSqr(), t = this.y.redSqr(), i = this.z.redSqr();
i = i.redIAdd(i);
var r = this.curve._mulA(e), n = this.x.redAdd(this.y).redSqr().redISub(e).redISub(t), s = r.redAdd(t), a = s.redSub(i), o = r.redSub(t), c = n.redMul(a), h = s.redMul(o), f = n.redMul(o), d = a.redMul(s);
return this.curve.point(c, h, d, f);
};
f.prototype._projDbl = function() {
var e, t, i, r = this.x.redAdd(this.y).redSqr(), n = this.x.redSqr(), s = this.y.redSqr();
if (this.curve.twisted) {
var a = (h = this.curve._mulA(n)).redAdd(s);
if (this.zOne) {
e = r.redSub(n).redSub(s).redMul(a.redSub(this.curve.two));
t = a.redMul(h.redSub(s));
i = a.redSqr().redSub(a).redSub(a);
} else {
var o = this.z.redSqr(), c = a.redSub(o).redISub(o);
e = r.redSub(n).redISub(s).redMul(c);
t = a.redMul(h.redSub(s));
i = a.redMul(c);
}
} else {
var h = n.redAdd(s);
o = this.curve._mulC(this.z).redSqr(), c = h.redSub(o).redSub(o);
e = this.curve._mulC(r.redISub(h)).redMul(c);
t = this.curve._mulC(h).redMul(n.redISub(s));
i = h.redMul(c);
}
return this.curve.point(e, t, i);
};
f.prototype.dbl = function() {
return this.isInfinity() ? this : this.curve.extended ? this._extDbl() : this._projDbl();
};
f.prototype._extAdd = function(e) {
var t = this.y.redSub(this.x).redMul(e.y.redSub(e.x)), i = this.y.redAdd(this.x).redMul(e.y.redAdd(e.x)), r = this.t.redMul(this.curve.dd).redMul(e.t), n = this.z.redMul(e.z.redAdd(e.z)), s = i.redSub(t), a = n.redSub(r), o = n.redAdd(r), c = i.redAdd(t), h = s.redMul(a), f = o.redMul(c), d = s.redMul(c), u = a.redMul(o);
return this.curve.point(h, f, u, d);
};
f.prototype._projAdd = function(e) {
var t, i, r = this.z.redMul(e.z), n = r.redSqr(), s = this.x.redMul(e.x), a = this.y.redMul(e.y), o = this.curve.d.redMul(s).redMul(a), c = n.redSub(o), h = n.redAdd(o), f = this.x.redAdd(this.y).redMul(e.x.redAdd(e.y)).redISub(s).redISub(a), d = r.redMul(c).redMul(f);
if (this.curve.twisted) {
t = r.redMul(h).redMul(a.redSub(this.curve._mulA(s)));
i = c.redMul(h);
} else {
t = r.redMul(h).redMul(a.redSub(s));
i = this.curve._mulC(c).redMul(h);
}
return this.curve.point(d, t, i);
};
f.prototype.add = function(e) {
return this.isInfinity() ? e : e.isInfinity() ? this : this.curve.extended ? this._extAdd(e) : this._projAdd(e);
};
f.prototype.mul = function(e) {
return this._hasDoubles(e) ? this.curve._fixedNafMul(this, e) : this.curve._wnafMul(this, e);
};
f.prototype.mulAdd = function(e, t, i) {
return this.curve._wnafMulAdd(1, [ this, t ], [ e, i ], 2, !1);
};
f.prototype.jmulAdd = function(e, t, i) {
return this.curve._wnafMulAdd(1, [ this, t ], [ e, i ], 2, !0);
};
f.prototype.normalize = function() {
if (this.zOne) return this;
var e = this.z.redInvm();
this.x = this.x.redMul(e);
this.y = this.y.redMul(e);
this.t && (this.t = this.t.redMul(e));
this.z = this.curve.one;
this.zOne = !0;
return this;
};
f.prototype.neg = function() {
return this.curve.point(this.x.redNeg(), this.y, this.z, this.t && this.t.redNeg());
};
f.prototype.getX = function() {
this.normalize();
return this.x.fromRed();
};
f.prototype.getY = function() {
this.normalize();
return this.y.fromRed();
};
f.prototype.eq = function(e) {
return this === e || 0 === this.getX().cmp(e.getX()) && 0 === this.getY().cmp(e.getY());
};
f.prototype.eqXToP = function(e) {
var t = e.toRed(this.curve.red).redMul(this.z);
if (0 === this.x.cmp(t)) return !0;
for (var i = e.clone(), r = this.curve.redN.redMul(this.z); ;) {
i.iadd(this.curve.n);
if (i.cmp(this.curve.p) >= 0) return !1;
t.redIAdd(r);
if (0 === this.x.cmp(t)) return !0;
}
};
f.prototype.toP = f.prototype.normalize;
f.prototype.mixedAdd = f.prototype.add;
}, {
"../../elliptic": 67,
"../curve": 70,
"bn.js": 16,
inherits: 101
} ],
70: [ function(e, t, i) {
"use strict";
var r = i;
r.base = e("./base");
r.short = e("./short");
r.mont = e("./mont");
r.edwards = e("./edwards");
}, {
"./base": 68,
"./edwards": 69,
"./mont": 71,
"./short": 72
} ],
71: [ function(e, t, i) {
"use strict";
var r = e("../curve"), n = e("bn.js"), s = e("inherits"), a = r.base, o = e("../../elliptic").utils;
function c(e) {
a.call(this, "mont", e);
this.a = new n(e.a, 16).toRed(this.red);
this.b = new n(e.b, 16).toRed(this.red);
this.i4 = new n(4).toRed(this.red).redInvm();
this.two = new n(2).toRed(this.red);
this.a24 = this.i4.redMul(this.a.redAdd(this.two));
}
s(c, a);
t.exports = c;
c.prototype.validate = function(e) {
var t = e.normalize().x, i = t.redSqr(), r = i.redMul(t).redAdd(i.redMul(this.a)).redAdd(t);
return 0 === r.redSqrt().redSqr().cmp(r);
};
function h(e, t, i) {
a.BasePoint.call(this, e, "projective");
if (null === t && null === i) {
this.x = this.curve.one;
this.z = this.curve.zero;
} else {
this.x = new n(t, 16);
this.z = new n(i, 16);
this.x.red || (this.x = this.x.toRed(this.curve.red));
this.z.red || (this.z = this.z.toRed(this.curve.red));
}
}
s(h, a.BasePoint);
c.prototype.decodePoint = function(e, t) {
return this.point(o.toArray(e, t), 1);
};
c.prototype.point = function(e, t) {
return new h(this, e, t);
};
c.prototype.pointFromJSON = function(e) {
return h.fromJSON(this, e);
};
h.prototype.precompute = function() {};
h.prototype._encode = function() {
return this.getX().toArray("be", this.curve.p.byteLength());
};
h.fromJSON = function(e, t) {
return new h(e, t[0], t[1] || e.one);
};
h.prototype.inspect = function() {
return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
};
h.prototype.isInfinity = function() {
return 0 === this.z.cmpn(0);
};
h.prototype.dbl = function() {
var e = this.x.redAdd(this.z).redSqr(), t = this.x.redSub(this.z).redSqr(), i = e.redSub(t), r = e.redMul(t), n = i.redMul(t.redAdd(this.curve.a24.redMul(i)));
return this.curve.point(r, n);
};
h.prototype.add = function() {
throw new Error("Not supported on Montgomery curve");
};
h.prototype.diffAdd = function(e, t) {
var i = this.x.redAdd(this.z), r = this.x.redSub(this.z), n = e.x.redAdd(e.z), s = e.x.redSub(e.z).redMul(i), a = n.redMul(r), o = t.z.redMul(s.redAdd(a).redSqr()), c = t.x.redMul(s.redISub(a).redSqr());
return this.curve.point(o, c);
};
h.prototype.mul = function(e) {
for (var t = e.clone(), i = this, r = this.curve.point(null, null), n = []; 0 !== t.cmpn(0); t.iushrn(1)) n.push(t.andln(1));
for (var s = n.length - 1; s >= 0; s--) if (0 === n[s]) {
i = i.diffAdd(r, this);
r = r.dbl();
} else {
r = i.diffAdd(r, this);
i = i.dbl();
}
return r;
};
h.prototype.mulAdd = function() {
throw new Error("Not supported on Montgomery curve");
};
h.prototype.jumlAdd = function() {
throw new Error("Not supported on Montgomery curve");
};
h.prototype.eq = function(e) {
return 0 === this.getX().cmp(e.getX());
};
h.prototype.normalize = function() {
this.x = this.x.redMul(this.z.redInvm());
this.z = this.curve.one;
return this;
};
h.prototype.getX = function() {
this.normalize();
return this.x.fromRed();
};
}, {
"../../elliptic": 67,
"../curve": 70,
"bn.js": 16,
inherits: 101
} ],
72: [ function(e, t, i) {
"use strict";
var r = e("../curve"), n = e("../../elliptic"), s = e("bn.js"), a = e("inherits"), o = r.base, c = n.utils.assert;
function h(e) {
o.call(this, "short", e);
this.a = new s(e.a, 16).toRed(this.red);
this.b = new s(e.b, 16).toRed(this.red);
this.tinv = this.two.redInvm();
this.zeroA = 0 === this.a.fromRed().cmpn(0);
this.threeA = 0 === this.a.fromRed().sub(this.p).cmpn(-3);
this.endo = this._getEndomorphism(e);
this._endoWnafT1 = new Array(4);
this._endoWnafT2 = new Array(4);
}
a(h, o);
t.exports = h;
h.prototype._getEndomorphism = function(e) {
if (this.zeroA && this.g && this.n && 1 === this.p.modn(3)) {
var t, i;
if (e.beta) t = new s(e.beta, 16).toRed(this.red); else {
var r = this._getEndoRoots(this.p);
t = (t = r[0].cmp(r[1]) < 0 ? r[0] : r[1]).toRed(this.red);
}
if (e.lambda) i = new s(e.lambda, 16); else {
var n = this._getEndoRoots(this.n);
if (0 === this.g.mul(n[0]).x.cmp(this.g.x.redMul(t))) i = n[0]; else {
i = n[1];
c(0 === this.g.mul(i).x.cmp(this.g.x.redMul(t)));
}
}
return {
beta: t,
lambda: i,
basis: e.basis ? e.basis.map(function(e) {
return {
a: new s(e.a, 16),
b: new s(e.b, 16)
};
}) : this._getEndoBasis(i)
};
}
};
h.prototype._getEndoRoots = function(e) {
var t = e === this.p ? this.red : s.mont(e), i = new s(2).toRed(t).redInvm(), r = i.redNeg(), n = new s(3).toRed(t).redNeg().redSqrt().redMul(i);
return [ r.redAdd(n).fromRed(), r.redSub(n).fromRed() ];
};
h.prototype._getEndoBasis = function(e) {
for (var t, i, r, n, a, o, c, h, f, d = this.n.ushrn(Math.floor(this.n.bitLength() / 2)), u = e, l = this.n.clone(), p = new s(1), b = new s(0), g = new s(0), y = new s(1), m = 0; 0 !== u.cmpn(0); ) {
var v = l.div(u);
h = l.sub(v.mul(u));
f = g.sub(v.mul(p));
var _ = y.sub(v.mul(b));
if (!r && h.cmp(d) < 0) {
t = c.neg();
i = p;
r = h.neg();
n = f;
} else if (r && 2 == ++m) break;
c = h;
l = u;
u = h;
g = p;
p = f;
y = b;
b = _;
}
a = h.neg();
o = f;
var w = r.sqr().add(n.sqr());
if (a.sqr().add(o.sqr()).cmp(w) >= 0) {
a = t;
o = i;
}
if (r.negative) {
r = r.neg();
n = n.neg();
}
if (a.negative) {
a = a.neg();
o = o.neg();
}
return [ {
a: r,
b: n
}, {
a: a,
b: o
} ];
};
h.prototype._endoSplit = function(e) {
var t = this.endo.basis, i = t[0], r = t[1], n = r.b.mul(e).divRound(this.n), s = i.b.neg().mul(e).divRound(this.n), a = n.mul(i.a), o = s.mul(r.a), c = n.mul(i.b), h = s.mul(r.b);
return {
k1: e.sub(a).sub(o),
k2: c.add(h).neg()
};
};
h.prototype.pointFromX = function(e, t) {
(e = new s(e, 16)).red || (e = e.toRed(this.red));
var i = e.redSqr().redMul(e).redIAdd(e.redMul(this.a)).redIAdd(this.b), r = i.redSqrt();
if (0 !== r.redSqr().redSub(i).cmp(this.zero)) throw new Error("invalid point");
var n = r.fromRed().isOdd();
(t && !n || !t && n) && (r = r.redNeg());
return this.point(e, r);
};
h.prototype.validate = function(e) {
if (e.inf) return !0;
var t = e.x, i = e.y, r = this.a.redMul(t), n = t.redSqr().redMul(t).redIAdd(r).redIAdd(this.b);
return 0 === i.redSqr().redISub(n).cmpn(0);
};
h.prototype._endoWnafMulAdd = function(e, t, i) {
for (var r = this._endoWnafT1, n = this._endoWnafT2, s = 0; s < e.length; s++) {
var a = this._endoSplit(t[s]), o = e[s], c = o._getBeta();
if (a.k1.negative) {
a.k1.ineg();
o = o.neg(!0);
}
if (a.k2.negative) {
a.k2.ineg();
c = c.neg(!0);
}
r[2 * s] = o;
r[2 * s + 1] = c;
n[2 * s] = a.k1;
n[2 * s + 1] = a.k2;
}
for (var h = this._wnafMulAdd(1, r, n, 2 * s, i), f = 0; f < 2 * s; f++) {
r[f] = null;
n[f] = null;
}
return h;
};
function f(e, t, i, r) {
o.BasePoint.call(this, e, "affine");
if (null === t && null === i) {
this.x = null;
this.y = null;
this.inf = !0;
} else {
this.x = new s(t, 16);
this.y = new s(i, 16);
if (r) {
this.x.forceRed(this.curve.red);
this.y.forceRed(this.curve.red);
}
this.x.red || (this.x = this.x.toRed(this.curve.red));
this.y.red || (this.y = this.y.toRed(this.curve.red));
this.inf = !1;
}
}
a(f, o.BasePoint);
h.prototype.point = function(e, t, i) {
return new f(this, e, t, i);
};
h.prototype.pointFromJSON = function(e, t) {
return f.fromJSON(this, e, t);
};
f.prototype._getBeta = function() {
if (this.curve.endo) {
var e = this.precomputed;
if (e && e.beta) return e.beta;
var t = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
if (e) {
var i = this.curve, r = function(e) {
return i.point(e.x.redMul(i.endo.beta), e.y);
};
e.beta = t;
t.precomputed = {
beta: null,
naf: e.naf && {
wnd: e.naf.wnd,
points: e.naf.points.map(r)
},
doubles: e.doubles && {
step: e.doubles.step,
points: e.doubles.points.map(r)
}
};
}
return t;
}
};
f.prototype.toJSON = function() {
return this.precomputed ? [ this.x, this.y, this.precomputed && {
doubles: this.precomputed.doubles && {
step: this.precomputed.doubles.step,
points: this.precomputed.doubles.points.slice(1)
},
naf: this.precomputed.naf && {
wnd: this.precomputed.naf.wnd,
points: this.precomputed.naf.points.slice(1)
}
} ] : [ this.x, this.y ];
};
f.fromJSON = function(e, t, i) {
"string" == typeof t && (t = JSON.parse(t));
var r = e.point(t[0], t[1], i);
if (!t[2]) return r;
function n(t) {
return e.point(t[0], t[1], i);
}
var s = t[2];
r.precomputed = {
beta: null,
doubles: s.doubles && {
step: s.doubles.step,
points: [ r ].concat(s.doubles.points.map(n))
},
naf: s.naf && {
wnd: s.naf.wnd,
points: [ r ].concat(s.naf.points.map(n))
}
};
return r;
};
f.prototype.inspect = function() {
return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + ">";
};
f.prototype.isInfinity = function() {
return this.inf;
};
f.prototype.add = function(e) {
if (this.inf) return e;
if (e.inf) return this;
if (this.eq(e)) return this.dbl();
if (this.neg().eq(e)) return this.curve.point(null, null);
if (0 === this.x.cmp(e.x)) return this.curve.point(null, null);
var t = this.y.redSub(e.y);
0 !== t.cmpn(0) && (t = t.redMul(this.x.redSub(e.x).redInvm()));
var i = t.redSqr().redISub(this.x).redISub(e.x), r = t.redMul(this.x.redSub(i)).redISub(this.y);
return this.curve.point(i, r);
};
f.prototype.dbl = function() {
if (this.inf) return this;
var e = this.y.redAdd(this.y);
if (0 === e.cmpn(0)) return this.curve.point(null, null);
var t = this.curve.a, i = this.x.redSqr(), r = e.redInvm(), n = i.redAdd(i).redIAdd(i).redIAdd(t).redMul(r), s = n.redSqr().redISub(this.x.redAdd(this.x)), a = n.redMul(this.x.redSub(s)).redISub(this.y);
return this.curve.point(s, a);
};
f.prototype.getX = function() {
return this.x.fromRed();
};
f.prototype.getY = function() {
return this.y.fromRed();
};
f.prototype.mul = function(e) {
e = new s(e, 16);
return this._hasDoubles(e) ? this.curve._fixedNafMul(this, e) : this.curve.endo ? this.curve._endoWnafMulAdd([ this ], [ e ]) : this.curve._wnafMul(this, e);
};
f.prototype.mulAdd = function(e, t, i) {
var r = [ this, t ], n = [ e, i ];
return this.curve.endo ? this.curve._endoWnafMulAdd(r, n) : this.curve._wnafMulAdd(1, r, n, 2);
};
f.prototype.jmulAdd = function(e, t, i) {
var r = [ this, t ], n = [ e, i ];
return this.curve.endo ? this.curve._endoWnafMulAdd(r, n, !0) : this.curve._wnafMulAdd(1, r, n, 2, !0);
};
f.prototype.eq = function(e) {
return this === e || this.inf === e.inf && (this.inf || 0 === this.x.cmp(e.x) && 0 === this.y.cmp(e.y));
};
f.prototype.neg = function(e) {
if (this.inf) return this;
var t = this.curve.point(this.x, this.y.redNeg());
if (e && this.precomputed) {
var i = this.precomputed, r = function(e) {
return e.neg();
};
t.precomputed = {
naf: i.naf && {
wnd: i.naf.wnd,
points: i.naf.points.map(r)
},
doubles: i.doubles && {
step: i.doubles.step,
points: i.doubles.points.map(r)
}
};
}
return t;
};
f.prototype.toJ = function() {
return this.inf ? this.curve.jpoint(null, null, null) : this.curve.jpoint(this.x, this.y, this.curve.one);
};
function d(e, t, i, r) {
o.BasePoint.call(this, e, "jacobian");
if (null === t && null === i && null === r) {
this.x = this.curve.one;
this.y = this.curve.one;
this.z = new s(0);
} else {
this.x = new s(t, 16);
this.y = new s(i, 16);
this.z = new s(r, 16);
}
this.x.red || (this.x = this.x.toRed(this.curve.red));
this.y.red || (this.y = this.y.toRed(this.curve.red));
this.z.red || (this.z = this.z.toRed(this.curve.red));
this.zOne = this.z === this.curve.one;
}
a(d, o.BasePoint);
h.prototype.jpoint = function(e, t, i) {
return new d(this, e, t, i);
};
d.prototype.toP = function() {
if (this.isInfinity()) return this.curve.point(null, null);
var e = this.z.redInvm(), t = e.redSqr(), i = this.x.redMul(t), r = this.y.redMul(t).redMul(e);
return this.curve.point(i, r);
};
d.prototype.neg = function() {
return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
};
d.prototype.add = function(e) {
if (this.isInfinity()) return e;
if (e.isInfinity()) return this;
var t = e.z.redSqr(), i = this.z.redSqr(), r = this.x.redMul(t), n = e.x.redMul(i), s = this.y.redMul(t.redMul(e.z)), a = e.y.redMul(i.redMul(this.z)), o = r.redSub(n), c = s.redSub(a);
if (0 === o.cmpn(0)) return 0 !== c.cmpn(0) ? this.curve.jpoint(null, null, null) : this.dbl();
var h = o.redSqr(), f = h.redMul(o), d = r.redMul(h), u = c.redSqr().redIAdd(f).redISub(d).redISub(d), l = c.redMul(d.redISub(u)).redISub(s.redMul(f)), p = this.z.redMul(e.z).redMul(o);
return this.curve.jpoint(u, l, p);
};
d.prototype.mixedAdd = function(e) {
if (this.isInfinity()) return e.toJ();
if (e.isInfinity()) return this;
var t = this.z.redSqr(), i = this.x, r = e.x.redMul(t), n = this.y, s = e.y.redMul(t).redMul(this.z), a = i.redSub(r), o = n.redSub(s);
if (0 === a.cmpn(0)) return 0 !== o.cmpn(0) ? this.curve.jpoint(null, null, null) : this.dbl();
var c = a.redSqr(), h = c.redMul(a), f = i.redMul(c), d = o.redSqr().redIAdd(h).redISub(f).redISub(f), u = o.redMul(f.redISub(d)).redISub(n.redMul(h)), l = this.z.redMul(a);
return this.curve.jpoint(d, u, l);
};
d.prototype.dblp = function(e) {
if (0 === e) return this;
if (this.isInfinity()) return this;
if (!e) return this.dbl();
if (this.curve.zeroA || this.curve.threeA) {
for (var t = this, i = 0; i < e; i++) t = t.dbl();
return t;
}
var r = this.curve.a, n = this.curve.tinv, s = this.x, a = this.y, o = this.z, c = o.redSqr().redSqr(), h = a.redAdd(a);
for (i = 0; i < e; i++) {
var f = s.redSqr(), d = h.redSqr(), u = d.redSqr(), l = f.redAdd(f).redIAdd(f).redIAdd(r.redMul(c)), p = s.redMul(d), b = l.redSqr().redISub(p.redAdd(p)), g = p.redISub(b), y = l.redMul(g);
y = y.redIAdd(y).redISub(u);
var m = h.redMul(o);
i + 1 < e && (c = c.redMul(u));
s = b;
o = m;
h = y;
}
return this.curve.jpoint(s, h.redMul(n), o);
};
d.prototype.dbl = function() {
return this.isInfinity() ? this : this.curve.zeroA ? this._zeroDbl() : this.curve.threeA ? this._threeDbl() : this._dbl();
};
d.prototype._zeroDbl = function() {
var e, t, i;
if (this.zOne) {
var r = this.x.redSqr(), n = this.y.redSqr(), s = n.redSqr(), a = this.x.redAdd(n).redSqr().redISub(r).redISub(s);
a = a.redIAdd(a);
var o = r.redAdd(r).redIAdd(r), c = o.redSqr().redISub(a).redISub(a), h = s.redIAdd(s);
h = (h = h.redIAdd(h)).redIAdd(h);
e = c;
t = o.redMul(a.redISub(c)).redISub(h);
i = this.y.redAdd(this.y);
} else {
var f = this.x.redSqr(), d = this.y.redSqr(), u = d.redSqr(), l = this.x.redAdd(d).redSqr().redISub(f).redISub(u);
l = l.redIAdd(l);
var p = f.redAdd(f).redIAdd(f), b = p.redSqr(), g = u.redIAdd(u);
g = (g = g.redIAdd(g)).redIAdd(g);
e = b.redISub(l).redISub(l);
t = p.redMul(l.redISub(e)).redISub(g);
i = (i = this.y.redMul(this.z)).redIAdd(i);
}
return this.curve.jpoint(e, t, i);
};
d.prototype._threeDbl = function() {
var e, t, i;
if (this.zOne) {
var r = this.x.redSqr(), n = this.y.redSqr(), s = n.redSqr(), a = this.x.redAdd(n).redSqr().redISub(r).redISub(s);
a = a.redIAdd(a);
var o = r.redAdd(r).redIAdd(r).redIAdd(this.curve.a), c = o.redSqr().redISub(a).redISub(a);
e = c;
var h = s.redIAdd(s);
h = (h = h.redIAdd(h)).redIAdd(h);
t = o.redMul(a.redISub(c)).redISub(h);
i = this.y.redAdd(this.y);
} else {
var f = this.z.redSqr(), d = this.y.redSqr(), u = this.x.redMul(d), l = this.x.redSub(f).redMul(this.x.redAdd(f));
l = l.redAdd(l).redIAdd(l);
var p = u.redIAdd(u), b = (p = p.redIAdd(p)).redAdd(p);
e = l.redSqr().redISub(b);
i = this.y.redAdd(this.z).redSqr().redISub(d).redISub(f);
var g = d.redSqr();
g = (g = (g = g.redIAdd(g)).redIAdd(g)).redIAdd(g);
t = l.redMul(p.redISub(e)).redISub(g);
}
return this.curve.jpoint(e, t, i);
};
d.prototype._dbl = function() {
var e = this.curve.a, t = this.x, i = this.y, r = this.z, n = r.redSqr().redSqr(), s = t.redSqr(), a = i.redSqr(), o = s.redAdd(s).redIAdd(s).redIAdd(e.redMul(n)), c = t.redAdd(t), h = (c = c.redIAdd(c)).redMul(a), f = o.redSqr().redISub(h.redAdd(h)), d = h.redISub(f), u = a.redSqr();
u = (u = (u = u.redIAdd(u)).redIAdd(u)).redIAdd(u);
var l = o.redMul(d).redISub(u), p = i.redAdd(i).redMul(r);
return this.curve.jpoint(f, l, p);
};
d.prototype.trpl = function() {
if (!this.curve.zeroA) return this.dbl().add(this);
var e = this.x.redSqr(), t = this.y.redSqr(), i = this.z.redSqr(), r = t.redSqr(), n = e.redAdd(e).redIAdd(e), s = n.redSqr(), a = this.x.redAdd(t).redSqr().redISub(e).redISub(r), o = (a = (a = (a = a.redIAdd(a)).redAdd(a).redIAdd(a)).redISub(s)).redSqr(), c = r.redIAdd(r);
c = (c = (c = c.redIAdd(c)).redIAdd(c)).redIAdd(c);
var h = n.redIAdd(a).redSqr().redISub(s).redISub(o).redISub(c), f = t.redMul(h);
f = (f = f.redIAdd(f)).redIAdd(f);
var d = this.x.redMul(o).redISub(f);
d = (d = d.redIAdd(d)).redIAdd(d);
var u = this.y.redMul(h.redMul(c.redISub(h)).redISub(a.redMul(o)));
u = (u = (u = u.redIAdd(u)).redIAdd(u)).redIAdd(u);
var l = this.z.redAdd(a).redSqr().redISub(i).redISub(o);
return this.curve.jpoint(d, u, l);
};
d.prototype.mul = function(e, t) {
e = new s(e, t);
return this.curve._wnafMul(this, e);
};
d.prototype.eq = function(e) {
if ("affine" === e.type) return this.eq(e.toJ());
if (this === e) return !0;
var t = this.z.redSqr(), i = e.z.redSqr();
if (0 !== this.x.redMul(i).redISub(e.x.redMul(t)).cmpn(0)) return !1;
var r = t.redMul(this.z), n = i.redMul(e.z);
return 0 === this.y.redMul(n).redISub(e.y.redMul(r)).cmpn(0);
};
d.prototype.eqXToP = function(e) {
var t = this.z.redSqr(), i = e.toRed(this.curve.red).redMul(t);
if (0 === this.x.cmp(i)) return !0;
for (var r = e.clone(), n = this.curve.redN.redMul(t); ;) {
r.iadd(this.curve.n);
if (r.cmp(this.curve.p) >= 0) return !1;
i.redIAdd(n);
if (0 === this.x.cmp(i)) return !0;
}
};
d.prototype.inspect = function() {
return this.isInfinity() ? "<EC JPoint Infinity>" : "<EC JPoint x: " + this.x.toString(16, 2) + " y: " + this.y.toString(16, 2) + " z: " + this.z.toString(16, 2) + ">";
};
d.prototype.isInfinity = function() {
return 0 === this.z.cmpn(0);
};
}, {
"../../elliptic": 67,
"../curve": 70,
"bn.js": 16,
inherits: 101
} ],
73: [ function(e, t, i) {
"use strict";
var r, n = i, s = e("hash.js"), a = e("../elliptic"), o = a.utils.assert;
function c(e) {
"short" === e.type ? this.curve = new a.curve.short(e) : "edwards" === e.type ? this.curve = new a.curve.edwards(e) : this.curve = new a.curve.mont(e);
this.g = this.curve.g;
this.n = this.curve.n;
this.hash = e.hash;
o(this.g.validate(), "Invalid curve");
o(this.g.mul(this.n).isInfinity(), "Invalid curve, G*N != O");
}
n.PresetCurve = c;
function h(e, t) {
Object.defineProperty(n, e, {
configurable: !0,
enumerable: !0,
get: function() {
var i = new c(t);
Object.defineProperty(n, e, {
configurable: !0,
enumerable: !0,
value: i
});
return i;
}
});
}
h("p192", {
type: "short",
prime: "p192",
p: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff",
a: "ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc",
b: "64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1",
n: "ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831",
hash: s.sha256,
gRed: !1,
g: [ "188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012", "07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811" ]
});
h("p224", {
type: "short",
prime: "p224",
p: "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001",
a: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe",
b: "b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4",
n: "ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d",
hash: s.sha256,
gRed: !1,
g: [ "b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21", "bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34" ]
});
h("p256", {
type: "short",
prime: null,
p: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff",
a: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc",
b: "5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b",
n: "ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551",
hash: s.sha256,
gRed: !1,
g: [ "6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296", "4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5" ]
});
h("p384", {
type: "short",
prime: null,
p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 ffffffff",
a: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 fffffffc",
b: "b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f 5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef",
n: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 f4372ddf 581a0db2 48b0a77a ecec196a ccc52973",
hash: s.sha384,
gRed: !1,
g: [ "aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 5502f25d bf55296c 3a545e38 72760ab7", "3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 0a60b1ce 1d7e819d 7a431d7c 90ea0e5f" ]
});
h("p521", {
type: "short",
prime: null,
p: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff",
a: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffc",
b: "00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b 99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd 3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00",
n: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409",
hash: s.sha512,
gRed: !1,
g: [ "000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66", "00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 3fad0761 353c7086 a272c240 88be9476 9fd16650" ]
});
h("curve25519", {
type: "mont",
prime: "p25519",
p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
a: "76d06",
b: "1",
n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
hash: s.sha256,
gRed: !1,
g: [ "9" ]
});
h("ed25519", {
type: "edwards",
prime: "p25519",
p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
a: "-1",
c: "1",
d: "52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3",
n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
hash: s.sha256,
gRed: !1,
g: [ "216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a", "6666666666666666666666666666666666666666666666666666666666666658" ]
});
try {
r = e("./precomputed/secp256k1");
} catch (e) {
r = void 0;
}
h("secp256k1", {
type: "short",
prime: "k256",
p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f",
a: "0",
b: "7",
n: "ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141",
h: "1",
hash: s.sha256,
beta: "7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee",
lambda: "5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72",
basis: [ {
a: "3086d221a7d46bcde86c90e49284eb15",
b: "-e4437ed6010e88286f547fa90abfe4c3"
}, {
a: "114ca50f7a8e2f3f657c1108d9d44cfd8",
b: "3086d221a7d46bcde86c90e49284eb15"
} ],
gRed: !1,
g: [ "79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8", r ]
});
}, {
"../elliptic": 67,
"./precomputed/secp256k1": 80,
"hash.js": 86
} ],
74: [ function(e, t, i) {
"use strict";
var r = e("bn.js"), n = e("hmac-drbg"), s = e("../../elliptic"), a = s.utils.assert, o = e("./key"), c = e("./signature");
function h(e) {
if (!(this instanceof h)) return new h(e);
if ("string" == typeof e) {
a(s.curves.hasOwnProperty(e), "Unknown curve " + e);
e = s.curves[e];
}
e instanceof s.curves.PresetCurve && (e = {
curve: e
});
this.curve = e.curve.curve;
this.n = this.curve.n;
this.nh = this.n.ushrn(1);
this.g = this.curve.g;
this.g = e.curve.g;
this.g.precompute(e.curve.n.bitLength() + 1);
this.hash = e.hash || e.curve.hash;
}
t.exports = h;
h.prototype.keyPair = function(e) {
return new o(this, e);
};
h.prototype.keyFromPrivate = function(e, t) {
return o.fromPrivate(this, e, t);
};
h.prototype.keyFromPublic = function(e, t) {
return o.fromPublic(this, e, t);
};
h.prototype.genKeyPair = function(e) {
e || (e = {});
for (var t = new n({
hash: this.hash,
pers: e.pers,
persEnc: e.persEnc || "utf8",
entropy: e.entropy || s.rand(this.hash.hmacStrength),
entropyEnc: e.entropy && e.entropyEnc || "utf8",
nonce: this.n.toArray()
}), i = this.n.byteLength(), a = this.n.sub(new r(2)); ;) {
var o = new r(t.generate(i));
if (!(o.cmp(a) > 0)) {
o.iaddn(1);
return this.keyFromPrivate(o);
}
}
};
h.prototype._truncateToN = function(e, t) {
var i = 8 * e.byteLength() - this.n.bitLength();
i > 0 && (e = e.ushrn(i));
return !t && e.cmp(this.n) >= 0 ? e.sub(this.n) : e;
};
h.prototype.sign = function(e, t, i, s) {
if ("object" == typeof i) {
s = i;
i = null;
}
s || (s = {});
t = this.keyFromPrivate(t, i);
e = this._truncateToN(new r(e, 16));
for (var a = this.n.byteLength(), o = t.getPrivate().toArray("be", a), h = e.toArray("be", a), f = new n({
hash: this.hash,
entropy: o,
nonce: h,
pers: s.pers,
persEnc: s.persEnc || "utf8"
}), d = this.n.sub(new r(1)), u = 0; ;u++) {
var l = s.k ? s.k(u) : new r(f.generate(this.n.byteLength()));
if (!((l = this._truncateToN(l, !0)).cmpn(1) <= 0 || l.cmp(d) >= 0)) {
var p = this.g.mul(l);
if (!p.isInfinity()) {
var b = p.getX(), g = b.umod(this.n);
if (0 !== g.cmpn(0)) {
var y = l.invm(this.n).mul(g.mul(t.getPrivate()).iadd(e));
if (0 !== (y = y.umod(this.n)).cmpn(0)) {
var m = (p.getY().isOdd() ? 1 : 0) | (0 !== b.cmp(g) ? 2 : 0);
if (s.canonical && y.cmp(this.nh) > 0) {
y = this.n.sub(y);
m ^= 1;
}
return new c({
r: g,
s: y,
recoveryParam: m
});
}
}
}
}
}
};
h.prototype.verify = function(e, t, i, n) {
e = this._truncateToN(new r(e, 16));
i = this.keyFromPublic(i, n);
var s = (t = new c(t, "hex")).r, a = t.s;
if (s.cmpn(1) < 0 || s.cmp(this.n) >= 0) return !1;
if (a.cmpn(1) < 0 || a.cmp(this.n) >= 0) return !1;
var o = a.invm(this.n), h = o.mul(e).umod(this.n), f = o.mul(s).umod(this.n);
if (!this.curve._maxwellTrick) {
var d;
return !(d = this.g.mulAdd(h, i.getPublic(), f)).isInfinity() && 0 === d.getX().umod(this.n).cmp(s);
}
return !(d = this.g.jmulAdd(h, i.getPublic(), f)).isInfinity() && d.eqXToP(s);
};
h.prototype.recoverPubKey = function(e, t, i, n) {
a((3 & i) === i, "The recovery param is more than two bits");
t = new c(t, n);
var s = this.n, o = new r(e), h = t.r, f = t.s, d = 1 & i, u = i >> 1;
if (h.cmp(this.curve.p.umod(this.curve.n)) >= 0 && u) throw new Error("Unable to find sencond key candinate");
h = u ? this.curve.pointFromX(h.add(this.curve.n), d) : this.curve.pointFromX(h, d);
var l = t.r.invm(s), p = s.sub(o).mul(l).umod(s), b = f.mul(l).umod(s);
return this.g.mulAdd(p, h, b);
};
h.prototype.getKeyRecoveryParam = function(e, t, i, r) {
if (null !== (t = new c(t, r)).recoveryParam) return t.recoveryParam;
for (var n = 0; n < 4; n++) {
var s;
try {
s = this.recoverPubKey(e, t, n);
} catch (e) {
continue;
}
if (s.eq(i)) return n;
}
throw new Error("Unable to find valid recovery factor");
};
}, {
"../../elliptic": 67,
"./key": 75,
"./signature": 76,
"bn.js": 16,
"hmac-drbg": 98
} ],
75: [ function(e, t, i) {
"use strict";
var r = e("bn.js"), n = e("../../elliptic").utils.assert;
function s(e, t) {
this.ec = e;
this.priv = null;
this.pub = null;
t.priv && this._importPrivate(t.priv, t.privEnc);
t.pub && this._importPublic(t.pub, t.pubEnc);
}
t.exports = s;
s.fromPublic = function(e, t, i) {
return t instanceof s ? t : new s(e, {
pub: t,
pubEnc: i
});
};
s.fromPrivate = function(e, t, i) {
return t instanceof s ? t : new s(e, {
priv: t,
privEnc: i
});
};
s.prototype.validate = function() {
var e = this.getPublic();
return e.isInfinity() ? {
result: !1,
reason: "Invalid public key"
} : e.validate() ? e.mul(this.ec.curve.n).isInfinity() ? {
result: !0,
reason: null
} : {
result: !1,
reason: "Public key * N != O"
} : {
result: !1,
reason: "Public key is not a point"
};
};
s.prototype.getPublic = function(e, t) {
if ("string" == typeof e) {
t = e;
e = null;
}
this.pub || (this.pub = this.ec.g.mul(this.priv));
return t ? this.pub.encode(t, e) : this.pub;
};
s.prototype.getPrivate = function(e) {
return "hex" === e ? this.priv.toString(16, 2) : this.priv;
};
s.prototype._importPrivate = function(e, t) {
this.priv = new r(e, t || 16);
this.priv = this.priv.umod(this.ec.curve.n);
};
s.prototype._importPublic = function(e, t) {
if (e.x || e.y) {
"mont" === this.ec.curve.type ? n(e.x, "Need x coordinate") : "short" !== this.ec.curve.type && "edwards" !== this.ec.curve.type || n(e.x && e.y, "Need both x and y coordinate");
this.pub = this.ec.curve.point(e.x, e.y);
} else this.pub = this.ec.curve.decodePoint(e, t);
};
s.prototype.derive = function(e) {
return e.mul(this.priv).getX();
};
s.prototype.sign = function(e, t, i) {
return this.ec.sign(e, this, t, i);
};
s.prototype.verify = function(e, t) {
return this.ec.verify(e, t, this);
};
s.prototype.inspect = function() {
return "<Key priv: " + (this.priv && this.priv.toString(16, 2)) + " pub: " + (this.pub && this.pub.inspect()) + " >";
};
}, {
"../../elliptic": 67,
"bn.js": 16
} ],
76: [ function(e, t, i) {
"use strict";
var r = e("bn.js"), n = e("../../elliptic").utils, s = n.assert;
function a(e, t) {
if (e instanceof a) return e;
if (!this._importDER(e, t)) {
s(e.r && e.s, "Signature without r or s");
this.r = new r(e.r, 16);
this.s = new r(e.s, 16);
void 0 === e.recoveryParam ? this.recoveryParam = null : this.recoveryParam = e.recoveryParam;
}
}
t.exports = a;
function o(e, t) {
var i = e[t.place++];
if (!(128 & i)) return i;
for (var r = 15 & i, n = 0, s = 0, a = t.place; s < r; s++, a++) {
n <<= 8;
n |= e[a];
}
t.place = a;
return n;
}
function c(e) {
for (var t = 0, i = e.length - 1; !e[t] && !(128 & e[t + 1]) && t < i; ) t++;
return 0 === t ? e : e.slice(t);
}
a.prototype._importDER = function(e, t) {
e = n.toArray(e, t);
var i = new function() {
this.place = 0;
}();
if (48 !== e[i.place++]) return !1;
if (o(e, i) + i.place !== e.length) return !1;
if (2 !== e[i.place++]) return !1;
var s = o(e, i), a = e.slice(i.place, s + i.place);
i.place += s;
if (2 !== e[i.place++]) return !1;
var c = o(e, i);
if (e.length !== c + i.place) return !1;
var h = e.slice(i.place, c + i.place);
0 === a[0] && 128 & a[1] && (a = a.slice(1));
0 === h[0] && 128 & h[1] && (h = h.slice(1));
this.r = new r(a);
this.s = new r(h);
this.recoveryParam = null;
return !0;
};
function h(e, t) {
if (t < 128) e.push(t); else {
var i = 1 + (Math.log(t) / Math.LN2 >>> 3);
e.push(128 | i);
for (;--i; ) e.push(t >>> (i << 3) & 255);
e.push(t);
}
}
a.prototype.toDER = function(e) {
var t = this.r.toArray(), i = this.s.toArray();
128 & t[0] && (t = [ 0 ].concat(t));
128 & i[0] && (i = [ 0 ].concat(i));
t = c(t);
i = c(i);
for (;!(i[0] || 128 & i[1]); ) i = i.slice(1);
var r = [ 2 ];
h(r, t.length);
(r = r.concat(t)).push(2);
h(r, i.length);
var s = r.concat(i), a = [ 48 ];
h(a, s.length);
a = a.concat(s);
return n.encode(a, e);
};
}, {
"../../elliptic": 67,
"bn.js": 16
} ],
77: [ function(e, t, i) {
"use strict";
var r = e("hash.js"), n = e("../../elliptic"), s = n.utils, a = s.assert, o = s.parseBytes, c = e("./key"), h = e("./signature");
function f(e) {
a("ed25519" === e, "only tested with ed25519 so far");
if (!(this instanceof f)) return new f(e);
e = n.curves[e].curve;
this.curve = e;
this.g = e.g;
this.g.precompute(e.n.bitLength() + 1);
this.pointClass = e.point().constructor;
this.encodingLength = Math.ceil(e.n.bitLength() / 8);
this.hash = r.sha512;
}
t.exports = f;
f.prototype.sign = function(e, t) {
e = o(e);
var i = this.keyFromSecret(t), r = this.hashInt(i.messagePrefix(), e), n = this.g.mul(r), s = this.encodePoint(n), a = this.hashInt(s, i.pubBytes(), e).mul(i.priv()), c = r.add(a).umod(this.curve.n);
return this.makeSignature({
R: n,
S: c,
Rencoded: s
});
};
f.prototype.verify = function(e, t, i) {
e = o(e);
t = this.makeSignature(t);
var r = this.keyFromPublic(i), n = this.hashInt(t.Rencoded(), r.pubBytes(), e), s = this.g.mul(t.S());
return t.R().add(r.pub().mul(n)).eq(s);
};
f.prototype.hashInt = function() {
for (var e = this.hash(), t = 0; t < arguments.length; t++) e.update(arguments[t]);
return s.intFromLE(e.digest()).umod(this.curve.n);
};
f.prototype.keyFromPublic = function(e) {
return c.fromPublic(this, e);
};
f.prototype.keyFromSecret = function(e) {
return c.fromSecret(this, e);
};
f.prototype.makeSignature = function(e) {
return e instanceof h ? e : new h(this, e);
};
f.prototype.encodePoint = function(e) {
var t = e.getY().toArray("le", this.encodingLength);
t[this.encodingLength - 1] |= e.getX().isOdd() ? 128 : 0;
return t;
};
f.prototype.decodePoint = function(e) {
var t = (e = s.parseBytes(e)).length - 1, i = e.slice(0, t).concat(-129 & e[t]), r = 0 != (128 & e[t]), n = s.intFromLE(i);
return this.curve.pointFromY(n, r);
};
f.prototype.encodeInt = function(e) {
return e.toArray("le", this.encodingLength);
};
f.prototype.decodeInt = function(e) {
return s.intFromLE(e);
};
f.prototype.isPoint = function(e) {
return e instanceof this.pointClass;
};
}, {
"../../elliptic": 67,
"./key": 78,
"./signature": 79,
"hash.js": 86
} ],
78: [ function(e, t, i) {
"use strict";
var r = e("../../elliptic").utils, n = r.assert, s = r.parseBytes, a = r.cachedProperty;
function o(e, t) {
this.eddsa = e;
this._secret = s(t.secret);
e.isPoint(t.pub) ? this._pub = t.pub : this._pubBytes = s(t.pub);
}
o.fromPublic = function(e, t) {
return t instanceof o ? t : new o(e, {
pub: t
});
};
o.fromSecret = function(e, t) {
return t instanceof o ? t : new o(e, {
secret: t
});
};
o.prototype.secret = function() {
return this._secret;
};
a(o, "pubBytes", function() {
return this.eddsa.encodePoint(this.pub());
});
a(o, "pub", function() {
return this._pubBytes ? this.eddsa.decodePoint(this._pubBytes) : this.eddsa.g.mul(this.priv());
});
a(o, "privBytes", function() {
var e = this.eddsa, t = this.hash(), i = e.encodingLength - 1, r = t.slice(0, e.encodingLength);
r[0] &= 248;
r[i] &= 127;
r[i] |= 64;
return r;
});
a(o, "priv", function() {
return this.eddsa.decodeInt(this.privBytes());
});
a(o, "hash", function() {
return this.eddsa.hash().update(this.secret()).digest();
});
a(o, "messagePrefix", function() {
return this.hash().slice(this.eddsa.encodingLength);
});
o.prototype.sign = function(e) {
n(this._secret, "KeyPair can only verify");
return this.eddsa.sign(e, this);
};
o.prototype.verify = function(e, t) {
return this.eddsa.verify(e, t, this);
};
o.prototype.getSecret = function(e) {
n(this._secret, "KeyPair is public only");
return r.encode(this.secret(), e);
};
o.prototype.getPublic = function(e) {
return r.encode(this.pubBytes(), e);
};
t.exports = o;
}, {
"../../elliptic": 67
} ],
79: [ function(e, t, i) {
"use strict";
var r = e("bn.js"), n = e("../../elliptic").utils, s = n.assert, a = n.cachedProperty, o = n.parseBytes;
function c(e, t) {
this.eddsa = e;
"object" != typeof t && (t = o(t));
Array.isArray(t) && (t = {
R: t.slice(0, e.encodingLength),
S: t.slice(e.encodingLength)
});
s(t.R && t.S, "Signature without R or S");
e.isPoint(t.R) && (this._R = t.R);
t.S instanceof r && (this._S = t.S);
this._Rencoded = Array.isArray(t.R) ? t.R : t.Rencoded;
this._Sencoded = Array.isArray(t.S) ? t.S : t.Sencoded;
}
a(c, "S", function() {
return this.eddsa.decodeInt(this.Sencoded());
});
a(c, "R", function() {
return this.eddsa.decodePoint(this.Rencoded());
});
a(c, "Rencoded", function() {
return this.eddsa.encodePoint(this.R());
});
a(c, "Sencoded", function() {
return this.eddsa.encodeInt(this.S());
});
c.prototype.toBytes = function() {
return this.Rencoded().concat(this.Sencoded());
};
c.prototype.toHex = function() {
return n.encode(this.toBytes(), "hex").toUpperCase();
};
t.exports = c;
}, {
"../../elliptic": 67,
"bn.js": 16
} ],
80: [ function(e, t, i) {
t.exports = {
doubles: {
step: 4,
points: [ [ "e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a", "f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821" ], [ "8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508", "11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf" ], [ "175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739", "d3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695" ], [ "363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640", "4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9" ], [ "8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c", "4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36" ], [ "723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda", "96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f" ], [ "eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa", "5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999" ], [ "100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0", "cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09" ], [ "e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d", "9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d" ], [ "feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d", "e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088" ], [ "da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1", "9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d" ], [ "53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0", "5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8" ], [ "8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047", "10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a" ], [ "385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862", "283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453" ], [ "6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7", "7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160" ], [ "3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd", "56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0" ], [ "85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83", "7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6" ], [ "948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a", "53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589" ], [ "6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8", "bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17" ], [ "e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d", "4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda" ], [ "e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725", "7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd" ], [ "213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754", "4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2" ], [ "4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c", "17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6" ], [ "fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6", "6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f" ], [ "76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39", "c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01" ], [ "c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891", "893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3" ], [ "d895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b", "febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f" ], [ "b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03", "2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7" ], [ "e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d", "eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78" ], [ "a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070", "7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1" ], [ "90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4", "e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150" ], [ "8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da", "662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82" ], [ "e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11", "1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc" ], [ "8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e", "efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b" ], [ "e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41", "2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51" ], [ "b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef", "67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45" ], [ "d68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8", "db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120" ], [ "324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d", "648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84" ], [ "4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96", "35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d" ], [ "9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd", "ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d" ], [ "6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5", "9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8" ], [ "a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266", "40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8" ], [ "7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71", "34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac" ], [ "928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac", "c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f" ], [ "85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751", "1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962" ], [ "ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e", "493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907" ], [ "827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241", "c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec" ], [ "eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3", "be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d" ], [ "e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f", "4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414" ], [ "1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19", "aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd" ], [ "146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be", "b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0" ], [ "fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9", "6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811" ], [ "da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2", "8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1" ], [ "a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13", "7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c" ], [ "174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c", "ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73" ], [ "959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba", "2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd" ], [ "d2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151", "e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405" ], [ "64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073", "d99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589" ], [ "8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458", "38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e" ], [ "13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b", "69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27" ], [ "bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366", "d3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1" ], [ "8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa", "40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482" ], [ "8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0", "620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945" ], [ "dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787", "7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573" ], [ "f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e", "ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82" ] ]
},
naf: {
wnd: 7,
points: [ [ "f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9", "388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672" ], [ "2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4", "d8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6" ], [ "5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc", "6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da" ], [ "acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe", "cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37" ], [ "774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb", "d984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b" ], [ "f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8", "ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81" ], [ "d7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e", "581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58" ], [ "defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34", "4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77" ], [ "2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c", "85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a" ], [ "352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5", "321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c" ], [ "2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f", "2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67" ], [ "9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714", "73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402" ], [ "daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729", "a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55" ], [ "c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db", "2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482" ], [ "6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4", "e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82" ], [ "1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5", "b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396" ], [ "605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479", "2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49" ], [ "62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d", "80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf" ], [ "80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f", "1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a" ], [ "7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb", "d0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7" ], [ "d528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9", "eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933" ], [ "49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963", "758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a" ], [ "77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74", "958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6" ], [ "f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530", "e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37" ], [ "463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b", "5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e" ], [ "f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247", "cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6" ], [ "caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1", "cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476" ], [ "2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120", "4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40" ], [ "7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435", "91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61" ], [ "754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18", "673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683" ], [ "e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8", "59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5" ], [ "186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb", "3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b" ], [ "df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f", "55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417" ], [ "5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143", "efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868" ], [ "290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba", "e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a" ], [ "af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45", "f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6" ], [ "766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a", "744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996" ], [ "59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e", "c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e" ], [ "f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8", "e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d" ], [ "7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c", "30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2" ], [ "948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519", "e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e" ], [ "7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab", "100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437" ], [ "3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca", "ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311" ], [ "d3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf", "8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4" ], [ "1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610", "68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575" ], [ "733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4", "f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d" ], [ "15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c", "d56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d" ], [ "a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940", "edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629" ], [ "e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980", "a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06" ], [ "311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3", "66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374" ], [ "34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf", "9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee" ], [ "f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63", "4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1" ], [ "d7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448", "fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b" ], [ "32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf", "5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661" ], [ "7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5", "8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6" ], [ "ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6", "8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e" ], [ "16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5", "5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d" ], [ "eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99", "f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc" ], [ "78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51", "f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4" ], [ "494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5", "42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c" ], [ "a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5", "204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b" ], [ "c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997", "4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913" ], [ "841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881", "73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154" ], [ "5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5", "39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865" ], [ "36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66", "d2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc" ], [ "336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726", "ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224" ], [ "8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede", "6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e" ], [ "1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94", "60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6" ], [ "85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31", "3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511" ], [ "29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51", "b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b" ], [ "a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252", "ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2" ], [ "4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5", "cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c" ], [ "d24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b", "6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3" ], [ "ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4", "322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d" ], [ "af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f", "6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700" ], [ "e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889", "2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4" ], [ "591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246", "b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196" ], [ "11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984", "998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4" ], [ "3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a", "b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257" ], [ "cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030", "bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13" ], [ "c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197", "6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096" ], [ "c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593", "c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38" ], [ "a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef", "21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f" ], [ "347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38", "60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448" ], [ "da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a", "49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a" ], [ "c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111", "5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4" ], [ "4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502", "7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437" ], [ "3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea", "be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7" ], [ "cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26", "8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d" ], [ "b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986", "39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a" ], [ "d4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e", "62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54" ], [ "48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4", "25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77" ], [ "dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda", "ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517" ], [ "6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859", "cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10" ], [ "e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f", "f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125" ], [ "eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c", "6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e" ], [ "13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942", "fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1" ], [ "ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a", "1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2" ], [ "b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80", "5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423" ], [ "ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d", "438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8" ], [ "8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1", "cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758" ], [ "52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63", "c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375" ], [ "e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352", "6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d" ], [ "7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193", "ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec" ], [ "5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00", "9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0" ], [ "32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58", "ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c" ], [ "e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7", "d3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4" ], [ "8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8", "c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f" ], [ "4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e", "67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649" ], [ "3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d", "cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826" ], [ "674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b", "299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5" ], [ "d32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f", "f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87" ], [ "30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6", "462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b" ], [ "be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297", "62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc" ], [ "93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a", "7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c" ], [ "b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c", "ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f" ], [ "d5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52", "4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a" ], [ "d3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb", "bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46" ], [ "463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065", "bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f" ], [ "7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917", "603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03" ], [ "74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9", "cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08" ], [ "30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3", "553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8" ], [ "9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57", "712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373" ], [ "176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66", "ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3" ], [ "75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8", "9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8" ], [ "809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721", "9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1" ], [ "1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180", "4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9" ] ]
}
};
}, {} ],
81: [ function(e, t, i) {
"use strict";
var r = i, n = e("bn.js"), s = e("minimalistic-assert"), a = e("minimalistic-crypto-utils");
r.assert = s;
r.toArray = a.toArray;
r.zero2 = a.zero2;
r.toHex = a.toHex;
r.encode = a.encode;
r.getNAF = function(e, t) {
for (var i = [], r = 1 << t + 1, n = e.clone(); n.cmpn(1) >= 0; ) {
var s;
if (n.isOdd()) {
var a = n.andln(r - 1);
s = a > (r >> 1) - 1 ? (r >> 1) - a : a;
n.isubn(s);
} else s = 0;
i.push(s);
for (var o = 0 !== n.cmpn(0) && 0 === n.andln(r - 1) ? t + 1 : 1, c = 1; c < o; c++) i.push(0);
n.iushrn(o);
}
return i;
};
r.getJSF = function(e, t) {
var i = [ [], [] ];
e = e.clone();
t = t.clone();
for (var r = 0, n = 0; e.cmpn(-r) > 0 || t.cmpn(-n) > 0; ) {
var s, a, o = e.andln(3) + r & 3, c = t.andln(3) + n & 3;
3 === o && (o = -1);
3 === c && (c = -1);
s = 0 == (1 & o) ? 0 : 3 != (h = e.andln(7) + r & 7) && 5 !== h || 2 !== c ? o : -o;
i[0].push(s);
if (0 == (1 & c)) a = 0; else {
var h;
a = 3 != (h = t.andln(7) + n & 7) && 5 !== h || 2 !== o ? c : -c;
}
i[1].push(a);
2 * r === s + 1 && (r = 1 - r);
2 * n === a + 1 && (n = 1 - n);
e.iushrn(1);
t.iushrn(1);
}
return i;
};
r.cachedProperty = function(e, t, i) {
var r = "_" + t;
e.prototype[t] = function() {
return void 0 !== this[r] ? this[r] : this[r] = i.call(this);
};
};
r.parseBytes = function(e) {
return "string" == typeof e ? r.toArray(e, "hex") : e;
};
r.intFromLE = function(e) {
return new n(e, "hex", "le");
};
}, {
"bn.js": 16,
"minimalistic-assert": 105,
"minimalistic-crypto-utils": 106
} ],
82: [ function(e, t, i) {
t.exports = {
_args: [ [ {
raw: "elliptic@^6.0.0",
scope: null,
escapedName: "elliptic",
name: "elliptic",
rawSpec: "^6.0.0",
spec: ">=6.0.0 <7.0.0",
type: "range"
}, "C:\\Users\\nantas\\fireball-x\\fb_20-release\\dist\\resources\\app\\node_modules\\browserify-sign" ] ],
_cnpm_publish_time: 1533787091648,
_from: "elliptic@>=6.0.0 <7.0.0",
_hasShrinkwrap: !1,
_id: "elliptic@6.4.1",
_inCache: !0,
_location: "/elliptic",
_nodeVersion: "10.5.0",
_npmOperationalInternal: {
host: "s3://npm-registry-packages",
tmp: "tmp/elliptic_6.4.1_1533787091502_0.6309761823717674"
},
_npmUser: {
name: "indutny",
email: "fedor@indutny.com"
},
_npmVersion: "6.3.0",
_phantomChildren: {},
_requested: {
raw: "elliptic@^6.0.0",
scope: null,
escapedName: "elliptic",
name: "elliptic",
rawSpec: "^6.0.0",
spec: ">=6.0.0 <7.0.0",
type: "range"
},
_requiredBy: [ "/browserify-sign", "/create-ecdh" ],
_resolved: "https://registry.npm.taobao.org/elliptic/download/elliptic-6.4.1.tgz",
_shasum: "c2d0b7776911b86722c632c3c06c60f2f819939a",
_shrinkwrap: null,
_spec: "elliptic@^6.0.0",
_where: "C:\\Users\\nantas\\fireball-x\\fb_20-release\\dist\\resources\\app\\node_modules\\browserify-sign",
author: {
name: "Fedor Indutny",
email: "fedor@indutny.com"
},
bugs: {
url: "https://github.com/indutny/elliptic/issues"
},
dependencies: {
"bn.js": "^4.4.0",
brorand: "^1.0.1",
"hash.js": "^1.0.0",
"hmac-drbg": "^1.0.0",
inherits: "^2.0.1",
"minimalistic-assert": "^1.0.0",
"minimalistic-crypto-utils": "^1.0.0"
},
description: "EC cryptography",
devDependencies: {
brfs: "^1.4.3",
coveralls: "^2.11.3",
grunt: "^0.4.5",
"grunt-browserify": "^5.0.0",
"grunt-cli": "^1.2.0",
"grunt-contrib-connect": "^1.0.0",
"grunt-contrib-copy": "^1.0.0",
"grunt-contrib-uglify": "^1.0.1",
"grunt-mocha-istanbul": "^3.0.1",
"grunt-saucelabs": "^8.6.2",
istanbul: "^0.4.2",
jscs: "^2.9.0",
jshint: "^2.6.0",
mocha: "^2.1.0"
},
directories: {},
dist: {
shasum: "c2d0b7776911b86722c632c3c06c60f2f819939a",
size: 39520,
noattachment: !1,
tarball: "http://registry.npm.taobao.org/elliptic/download/elliptic-6.4.1.tgz"
},
files: [ "lib" ],
gitHead: "523da1cf71ddcfd607fbdee1858bc2af47f0e700",
homepage: "https://github.com/indutny/elliptic",
keywords: [ "EC", "Elliptic", "curve", "Cryptography" ],
license: "MIT",
main: "lib/elliptic.js",
maintainers: [ {
name: "indutny",
email: "fedor@indutny.com"
} ],
name: "elliptic",
optionalDependencies: {},
publish_time: 1533787091648,
readme: "ERROR: No README data found!",
repository: {
type: "git",
url: "git+ssh://git@github.com/indutny/elliptic.git"
},
scripts: {
jscs: "jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js",
jshint: "jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js",
lint: "npm run jscs && npm run jshint",
test: "npm run lint && npm run unit",
unit: "istanbul test _mocha --reporter=spec test/index.js",
version: "grunt dist && git add dist/"
},
version: "6.4.1"
};
}, {} ],
83: [ function(e, t, i) {
function r() {
this._events = this._events || {};
this._maxListeners = this._maxListeners || void 0;
}
t.exports = r;
r.EventEmitter = r;
r.prototype._events = void 0;
r.prototype._maxListeners = void 0;
r.defaultMaxListeners = 10;
r.prototype.setMaxListeners = function(e) {
if (!function(e) {
return "number" == typeof e;
}(e) || e < 0 || isNaN(e)) throw TypeError("n must be a positive number");
this._maxListeners = e;
return this;
};
r.prototype.emit = function(e) {
var t, i, r, o, c, h;
this._events || (this._events = {});
if ("error" === e && (!this._events.error || s(this._events.error) && !this._events.error.length)) {
if ((t = arguments[1]) instanceof Error) throw t;
var f = new Error('Uncaught, unspecified "error" event. (' + t + ")");
f.context = t;
throw f;
}
if (a(i = this._events[e])) return !1;
if (n(i)) switch (arguments.length) {
case 1:
i.call(this);
break;

case 2:
i.call(this, arguments[1]);
break;

case 3:
i.call(this, arguments[1], arguments[2]);
break;

default:
o = Array.prototype.slice.call(arguments, 1);
i.apply(this, o);
} else if (s(i)) {
o = Array.prototype.slice.call(arguments, 1);
r = (h = i.slice()).length;
for (c = 0; c < r; c++) h[c].apply(this, o);
}
return !0;
};
r.prototype.addListener = function(e, t) {
var i;
if (!n(t)) throw TypeError("listener must be a function");
this._events || (this._events = {});
this._events.newListener && this.emit("newListener", e, n(t.listener) ? t.listener : t);
this._events[e] ? s(this._events[e]) ? this._events[e].push(t) : this._events[e] = [ this._events[e], t ] : this._events[e] = t;
if (s(this._events[e]) && !this._events[e].warned && (i = a(this._maxListeners) ? r.defaultMaxListeners : this._maxListeners) && i > 0 && this._events[e].length > i) {
this._events[e].warned = !0;
console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[e].length);
"function" == typeof console.trace && console.trace();
}
return this;
};
r.prototype.on = r.prototype.addListener;
r.prototype.once = function(e, t) {
if (!n(t)) throw TypeError("listener must be a function");
var i = !1;
function r() {
this.removeListener(e, r);
if (!i) {
i = !0;
t.apply(this, arguments);
}
}
r.listener = t;
this.on(e, r);
return this;
};
r.prototype.removeListener = function(e, t) {
var i, r, a, o;
if (!n(t)) throw TypeError("listener must be a function");
if (!this._events || !this._events[e]) return this;
a = (i = this._events[e]).length;
r = -1;
if (i === t || n(i.listener) && i.listener === t) {
delete this._events[e];
this._events.removeListener && this.emit("removeListener", e, t);
} else if (s(i)) {
for (o = a; o-- > 0; ) if (i[o] === t || i[o].listener && i[o].listener === t) {
r = o;
break;
}
if (r < 0) return this;
if (1 === i.length) {
i.length = 0;
delete this._events[e];
} else i.splice(r, 1);
this._events.removeListener && this.emit("removeListener", e, t);
}
return this;
};
r.prototype.removeAllListeners = function(e) {
var t, i;
if (!this._events) return this;
if (!this._events.removeListener) {
0 === arguments.length ? this._events = {} : this._events[e] && delete this._events[e];
return this;
}
if (0 === arguments.length) {
for (t in this._events) "removeListener" !== t && this.removeAllListeners(t);
this.removeAllListeners("removeListener");
this._events = {};
return this;
}
if (n(i = this._events[e])) this.removeListener(e, i); else if (i) for (;i.length; ) this.removeListener(e, i[i.length - 1]);
delete this._events[e];
return this;
};
r.prototype.listeners = function(e) {
return this._events && this._events[e] ? n(this._events[e]) ? [ this._events[e] ] : this._events[e].slice() : [];
};
r.prototype.listenerCount = function(e) {
if (this._events) {
var t = this._events[e];
if (n(t)) return 1;
if (t) return t.length;
}
return 0;
};
r.listenerCount = function(e, t) {
return e.listenerCount(t);
};
function n(e) {
return "function" == typeof e;
}
function s(e) {
return "object" == typeof e && null !== e;
}
function a(e) {
return void 0 === e;
}
}, {} ],
84: [ function(e, t, i) {
var r = e("safe-buffer").Buffer, n = e("md5.js");
t.exports = function(e, t, i, s) {
r.isBuffer(e) || (e = r.from(e, "binary"));
if (t) {
r.isBuffer(t) || (t = r.from(t, "binary"));
if (8 !== t.length) throw new RangeError("salt should be Buffer with 8 byte length");
}
for (var a = i / 8, o = r.alloc(a), c = r.alloc(s || 0), h = r.alloc(0); a > 0 || s > 0; ) {
var f = new n();
f.update(h);
f.update(e);
t && f.update(t);
h = f.digest();
var d = 0;
if (a > 0) {
var u = o.length - a;
d = Math.min(a, h.length);
h.copy(o, u, 0, d);
a -= d;
}
if (d < h.length && s > 0) {
var l = c.length - s, p = Math.min(s, h.length - d);
h.copy(c, l, d, d + p);
s -= p;
}
}
h.fill(0);
return {
key: o,
iv: c
};
};
}, {
"md5.js": 103,
"safe-buffer": 143
} ],
85: [ function(e, t, i) {
"use strict";
var r = e("safe-buffer").Buffer, n = e("stream").Transform;
function s(e) {
n.call(this);
this._block = r.allocUnsafe(e);
this._blockSize = e;
this._blockOffset = 0;
this._length = [ 0, 0, 0, 0 ];
this._finalized = !1;
}
e("inherits")(s, n);
s.prototype._transform = function(e, t, i) {
var r = null;
try {
this.update(e, t);
} catch (e) {
r = e;
}
i(r);
};
s.prototype._flush = function(e) {
var t = null;
try {
this.push(this.digest());
} catch (e) {
t = e;
}
e(t);
};
s.prototype.update = function(e, t) {
(function(e, t) {
if (!r.isBuffer(e) && "string" != typeof e) throw new TypeError(t + " must be a string or a buffer");
})(e, "Data");
if (this._finalized) throw new Error("Digest already called");
r.isBuffer(e) || (e = r.from(e, t));
for (var i = this._block, n = 0; this._blockOffset + e.length - n >= this._blockSize; ) {
for (var s = this._blockOffset; s < this._blockSize; ) i[s++] = e[n++];
this._update();
this._blockOffset = 0;
}
for (;n < e.length; ) i[this._blockOffset++] = e[n++];
for (var a = 0, o = 8 * e.length; o > 0; ++a) {
this._length[a] += o;
(o = this._length[a] / 4294967296 | 0) > 0 && (this._length[a] -= 4294967296 * o);
}
return this;
};
s.prototype._update = function() {
throw new Error("_update is not implemented");
};
s.prototype.digest = function(e) {
if (this._finalized) throw new Error("Digest already called");
this._finalized = !0;
var t = this._digest();
void 0 !== e && (t = t.toString(e));
this._block.fill(0);
this._blockOffset = 0;
for (var i = 0; i < 4; ++i) this._length[i] = 0;
return t;
};
s.prototype._digest = function() {
throw new Error("_digest is not implemented");
};
t.exports = s;
}, {
inherits: 101,
"safe-buffer": 143,
stream: 152
} ],
86: [ function(e, t, i) {
var r = i;
r.utils = e("./hash/utils");
r.common = e("./hash/common");
r.sha = e("./hash/sha");
r.ripemd = e("./hash/ripemd");
r.hmac = e("./hash/hmac");
r.sha1 = r.sha.sha1;
r.sha256 = r.sha.sha256;
r.sha224 = r.sha.sha224;
r.sha384 = r.sha.sha384;
r.sha512 = r.sha.sha512;
r.ripemd160 = r.ripemd.ripemd160;
}, {
"./hash/common": 87,
"./hash/hmac": 88,
"./hash/ripemd": 89,
"./hash/sha": 90,
"./hash/utils": 97
} ],
87: [ function(e, t, i) {
"use strict";
var r = e("./utils"), n = e("minimalistic-assert");
function s() {
this.pending = null;
this.pendingTotal = 0;
this.blockSize = this.constructor.blockSize;
this.outSize = this.constructor.outSize;
this.hmacStrength = this.constructor.hmacStrength;
this.padLength = this.constructor.padLength / 8;
this.endian = "big";
this._delta8 = this.blockSize / 8;
this._delta32 = this.blockSize / 32;
}
i.BlockHash = s;
s.prototype.update = function(e, t) {
e = r.toArray(e, t);
this.pending ? this.pending = this.pending.concat(e) : this.pending = e;
this.pendingTotal += e.length;
if (this.pending.length >= this._delta8) {
var i = (e = this.pending).length % this._delta8;
this.pending = e.slice(e.length - i, e.length);
0 === this.pending.length && (this.pending = null);
e = r.join32(e, 0, e.length - i, this.endian);
for (var n = 0; n < e.length; n += this._delta32) this._update(e, n, n + this._delta32);
}
return this;
};
s.prototype.digest = function(e) {
this.update(this._pad());
n(null === this.pending);
return this._digest(e);
};
s.prototype._pad = function() {
var e = this.pendingTotal, t = this._delta8, i = t - (e + this.padLength) % t, r = new Array(i + this.padLength);
r[0] = 128;
for (var n = 1; n < i; n++) r[n] = 0;
e <<= 3;
if ("big" === this.endian) {
for (var s = 8; s < this.padLength; s++) r[n++] = 0;
r[n++] = 0;
r[n++] = 0;
r[n++] = 0;
r[n++] = 0;
r[n++] = e >>> 24 & 255;
r[n++] = e >>> 16 & 255;
r[n++] = e >>> 8 & 255;
r[n++] = 255 & e;
} else {
r[n++] = 255 & e;
r[n++] = e >>> 8 & 255;
r[n++] = e >>> 16 & 255;
r[n++] = e >>> 24 & 255;
r[n++] = 0;
r[n++] = 0;
r[n++] = 0;
r[n++] = 0;
for (s = 8; s < this.padLength; s++) r[n++] = 0;
}
return r;
};
}, {
"./utils": 97,
"minimalistic-assert": 105
} ],
88: [ function(e, t, i) {
"use strict";
var r = e("./utils"), n = e("minimalistic-assert");
function s(e, t, i) {
if (!(this instanceof s)) return new s(e, t, i);
this.Hash = e;
this.blockSize = e.blockSize / 8;
this.outSize = e.outSize / 8;
this.inner = null;
this.outer = null;
this._init(r.toArray(t, i));
}
t.exports = s;
s.prototype._init = function(e) {
e.length > this.blockSize && (e = new this.Hash().update(e).digest());
n(e.length <= this.blockSize);
for (var t = e.length; t < this.blockSize; t++) e.push(0);
for (t = 0; t < e.length; t++) e[t] ^= 54;
this.inner = new this.Hash().update(e);
for (t = 0; t < e.length; t++) e[t] ^= 106;
this.outer = new this.Hash().update(e);
};
s.prototype.update = function(e, t) {
this.inner.update(e, t);
return this;
};
s.prototype.digest = function(e) {
this.outer.update(this.inner.digest());
return this.outer.digest(e);
};
}, {
"./utils": 97,
"minimalistic-assert": 105
} ],
89: [ function(e, t, i) {
"use strict";
var r = e("./utils"), n = e("./common"), s = r.rotl32, a = r.sum32, o = r.sum32_3, c = r.sum32_4, h = n.BlockHash;
function f() {
if (!(this instanceof f)) return new f();
h.call(this);
this.h = [ 1732584193, 4023233417, 2562383102, 271733878, 3285377520 ];
this.endian = "little";
}
r.inherits(f, h);
i.ripemd160 = f;
f.blockSize = 512;
f.outSize = 160;
f.hmacStrength = 192;
f.padLength = 64;
f.prototype._update = function(e, t) {
for (var i = this.h[0], r = this.h[1], n = this.h[2], h = this.h[3], f = this.h[4], m = i, v = r, _ = n, w = h, x = f, C = 0; C < 80; C++) {
var E = a(s(c(i, d(C, r, n, h), e[p[C] + t], u(C)), g[C]), f);
i = f;
f = h;
h = s(n, 10);
n = r;
r = E;
E = a(s(c(m, d(79 - C, v, _, w), e[b[C] + t], l(C)), y[C]), x);
m = x;
x = w;
w = s(_, 10);
_ = v;
v = E;
}
E = o(this.h[1], n, w);
this.h[1] = o(this.h[2], h, x);
this.h[2] = o(this.h[3], f, m);
this.h[3] = o(this.h[4], i, v);
this.h[4] = o(this.h[0], r, _);
this.h[0] = E;
};
f.prototype._digest = function(e) {
return "hex" === e ? r.toHex32(this.h, "little") : r.split32(this.h, "little");
};
function d(e, t, i, r) {
return e <= 15 ? t ^ i ^ r : e <= 31 ? t & i | ~t & r : e <= 47 ? (t | ~i) ^ r : e <= 63 ? t & r | i & ~r : t ^ (i | ~r);
}
function u(e) {
return e <= 15 ? 0 : e <= 31 ? 1518500249 : e <= 47 ? 1859775393 : e <= 63 ? 2400959708 : 2840853838;
}
function l(e) {
return e <= 15 ? 1352829926 : e <= 31 ? 1548603684 : e <= 47 ? 1836072691 : e <= 63 ? 2053994217 : 0;
}
var p = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13 ], b = [ 5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11 ], g = [ 11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6 ], y = [ 8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11 ];
}, {
"./common": 87,
"./utils": 97
} ],
90: [ function(e, t, i) {
"use strict";
i.sha1 = e("./sha/1");
i.sha224 = e("./sha/224");
i.sha256 = e("./sha/256");
i.sha384 = e("./sha/384");
i.sha512 = e("./sha/512");
}, {
"./sha/1": 91,
"./sha/224": 92,
"./sha/256": 93,
"./sha/384": 94,
"./sha/512": 95
} ],
91: [ function(e, t, i) {
"use strict";
var r = e("../utils"), n = e("../common"), s = e("./common"), a = r.rotl32, o = r.sum32, c = r.sum32_5, h = s.ft_1, f = n.BlockHash, d = [ 1518500249, 1859775393, 2400959708, 3395469782 ];
function u() {
if (!(this instanceof u)) return new u();
f.call(this);
this.h = [ 1732584193, 4023233417, 2562383102, 271733878, 3285377520 ];
this.W = new Array(80);
}
r.inherits(u, f);
t.exports = u;
u.blockSize = 512;
u.outSize = 160;
u.hmacStrength = 80;
u.padLength = 64;
u.prototype._update = function(e, t) {
for (var i = this.W, r = 0; r < 16; r++) i[r] = e[t + r];
for (;r < i.length; r++) i[r] = a(i[r - 3] ^ i[r - 8] ^ i[r - 14] ^ i[r - 16], 1);
var n = this.h[0], s = this.h[1], f = this.h[2], u = this.h[3], l = this.h[4];
for (r = 0; r < i.length; r++) {
var p = ~~(r / 20), b = c(a(n, 5), h(p, s, f, u), l, i[r], d[p]);
l = u;
u = f;
f = a(s, 30);
s = n;
n = b;
}
this.h[0] = o(this.h[0], n);
this.h[1] = o(this.h[1], s);
this.h[2] = o(this.h[2], f);
this.h[3] = o(this.h[3], u);
this.h[4] = o(this.h[4], l);
};
u.prototype._digest = function(e) {
return "hex" === e ? r.toHex32(this.h, "big") : r.split32(this.h, "big");
};
}, {
"../common": 87,
"../utils": 97,
"./common": 96
} ],
92: [ function(e, t, i) {
"use strict";
var r = e("../utils"), n = e("./256");
function s() {
if (!(this instanceof s)) return new s();
n.call(this);
this.h = [ 3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428 ];
}
r.inherits(s, n);
t.exports = s;
s.blockSize = 512;
s.outSize = 224;
s.hmacStrength = 192;
s.padLength = 64;
s.prototype._digest = function(e) {
return "hex" === e ? r.toHex32(this.h.slice(0, 7), "big") : r.split32(this.h.slice(0, 7), "big");
};
}, {
"../utils": 97,
"./256": 93
} ],
93: [ function(e, t, i) {
"use strict";
var r = e("../utils"), n = e("../common"), s = e("./common"), a = e("minimalistic-assert"), o = r.sum32, c = r.sum32_4, h = r.sum32_5, f = s.ch32, d = s.maj32, u = s.s0_256, l = s.s1_256, p = s.g0_256, b = s.g1_256, g = n.BlockHash, y = [ 1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298 ];
function m() {
if (!(this instanceof m)) return new m();
g.call(this);
this.h = [ 1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225 ];
this.k = y;
this.W = new Array(64);
}
r.inherits(m, g);
t.exports = m;
m.blockSize = 512;
m.outSize = 256;
m.hmacStrength = 192;
m.padLength = 64;
m.prototype._update = function(e, t) {
for (var i = this.W, r = 0; r < 16; r++) i[r] = e[t + r];
for (;r < i.length; r++) i[r] = c(b(i[r - 2]), i[r - 7], p(i[r - 15]), i[r - 16]);
var n = this.h[0], s = this.h[1], g = this.h[2], y = this.h[3], m = this.h[4], v = this.h[5], _ = this.h[6], w = this.h[7];
a(this.k.length === i.length);
for (r = 0; r < i.length; r++) {
var x = h(w, l(m), f(m, v, _), this.k[r], i[r]), C = o(u(n), d(n, s, g));
w = _;
_ = v;
v = m;
m = o(y, x);
y = g;
g = s;
s = n;
n = o(x, C);
}
this.h[0] = o(this.h[0], n);
this.h[1] = o(this.h[1], s);
this.h[2] = o(this.h[2], g);
this.h[3] = o(this.h[3], y);
this.h[4] = o(this.h[4], m);
this.h[5] = o(this.h[5], v);
this.h[6] = o(this.h[6], _);
this.h[7] = o(this.h[7], w);
};
m.prototype._digest = function(e) {
return "hex" === e ? r.toHex32(this.h, "big") : r.split32(this.h, "big");
};
}, {
"../common": 87,
"../utils": 97,
"./common": 96,
"minimalistic-assert": 105
} ],
94: [ function(e, t, i) {
"use strict";
var r = e("../utils"), n = e("./512");
function s() {
if (!(this instanceof s)) return new s();
n.call(this);
this.h = [ 3418070365, 3238371032, 1654270250, 914150663, 2438529370, 812702999, 355462360, 4144912697, 1731405415, 4290775857, 2394180231, 1750603025, 3675008525, 1694076839, 1203062813, 3204075428 ];
}
r.inherits(s, n);
t.exports = s;
s.blockSize = 1024;
s.outSize = 384;
s.hmacStrength = 192;
s.padLength = 128;
s.prototype._digest = function(e) {
return "hex" === e ? r.toHex32(this.h.slice(0, 12), "big") : r.split32(this.h.slice(0, 12), "big");
};
}, {
"../utils": 97,
"./512": 95
} ],
95: [ function(e, t, i) {
"use strict";
var r = e("../utils"), n = e("../common"), s = e("minimalistic-assert"), a = r.rotr64_hi, o = r.rotr64_lo, c = r.shr64_hi, h = r.shr64_lo, f = r.sum64, d = r.sum64_hi, u = r.sum64_lo, l = r.sum64_4_hi, p = r.sum64_4_lo, b = r.sum64_5_hi, g = r.sum64_5_lo, y = n.BlockHash, m = [ 1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591 ];
function v() {
if (!(this instanceof v)) return new v();
y.call(this);
this.h = [ 1779033703, 4089235720, 3144134277, 2227873595, 1013904242, 4271175723, 2773480762, 1595750129, 1359893119, 2917565137, 2600822924, 725511199, 528734635, 4215389547, 1541459225, 327033209 ];
this.k = m;
this.W = new Array(160);
}
r.inherits(v, y);
t.exports = v;
v.blockSize = 1024;
v.outSize = 512;
v.hmacStrength = 192;
v.padLength = 128;
v.prototype._prepareBlock = function(e, t) {
for (var i = this.W, r = 0; r < 32; r++) i[r] = e[t + r];
for (;r < i.length; r += 2) {
var n = k(i[r - 4], i[r - 3]), s = N(i[r - 4], i[r - 3]), a = i[r - 14], o = i[r - 13], c = R(i[r - 30], i[r - 29]), h = M(i[r - 30], i[r - 29]), f = i[r - 32], d = i[r - 31];
i[r] = l(n, s, a, o, c, h, f, d);
i[r + 1] = p(n, s, a, o, c, h, f, d);
}
};
v.prototype._update = function(e, t) {
this._prepareBlock(e, t);
var i = this.W, r = this.h[0], n = this.h[1], a = this.h[2], o = this.h[3], c = this.h[4], h = this.h[5], l = this.h[6], p = this.h[7], y = this.h[8], m = this.h[9], v = this.h[10], R = this.h[11], M = this.h[12], k = this.h[13], N = this.h[14], B = this.h[15];
s(this.k.length === i.length);
for (var L = 0; L < i.length; L += 2) {
var T = N, O = B, P = A(y, m), I = D(y, m), j = _(y, m, v, R, M), F = w(y, m, v, R, M, k), U = this.k[L], z = this.k[L + 1], q = i[L], G = i[L + 1], H = b(T, O, P, I, j, F, U, z, q, G), V = g(T, O, P, I, j, F, U, z, q, G);
T = E(r, n);
O = S(r, n);
P = x(r, n, a, o, c);
I = C(r, n, a, o, c, h);
var K = d(T, O, P, I), Y = u(T, O, P, I);
N = M;
B = k;
M = v;
k = R;
v = y;
R = m;
y = d(l, p, H, V);
m = u(p, p, H, V);
l = c;
p = h;
c = a;
h = o;
a = r;
o = n;
r = d(H, V, K, Y);
n = u(H, V, K, Y);
}
f(this.h, 0, r, n);
f(this.h, 2, a, o);
f(this.h, 4, c, h);
f(this.h, 6, l, p);
f(this.h, 8, y, m);
f(this.h, 10, v, R);
f(this.h, 12, M, k);
f(this.h, 14, N, B);
};
v.prototype._digest = function(e) {
return "hex" === e ? r.toHex32(this.h, "big") : r.split32(this.h, "big");
};
function _(e, t, i, r, n) {
var s = e & i ^ ~e & n;
s < 0 && (s += 4294967296);
return s;
}
function w(e, t, i, r, n, s) {
var a = t & r ^ ~t & s;
a < 0 && (a += 4294967296);
return a;
}
function x(e, t, i, r, n) {
var s = e & i ^ e & n ^ i & n;
s < 0 && (s += 4294967296);
return s;
}
function C(e, t, i, r, n, s) {
var a = t & r ^ t & s ^ r & s;
a < 0 && (a += 4294967296);
return a;
}
function E(e, t) {
var i = a(e, t, 28) ^ a(t, e, 2) ^ a(t, e, 7);
i < 0 && (i += 4294967296);
return i;
}
function S(e, t) {
var i = o(e, t, 28) ^ o(t, e, 2) ^ o(t, e, 7);
i < 0 && (i += 4294967296);
return i;
}
function A(e, t) {
var i = a(e, t, 14) ^ a(e, t, 18) ^ a(t, e, 9);
i < 0 && (i += 4294967296);
return i;
}
function D(e, t) {
var i = o(e, t, 14) ^ o(e, t, 18) ^ o(t, e, 9);
i < 0 && (i += 4294967296);
return i;
}
function R(e, t) {
var i = a(e, t, 1) ^ a(e, t, 8) ^ c(e, t, 7);
i < 0 && (i += 4294967296);
return i;
}
function M(e, t) {
var i = o(e, t, 1) ^ o(e, t, 8) ^ h(e, t, 7);
i < 0 && (i += 4294967296);
return i;
}
function k(e, t) {
var i = a(e, t, 19) ^ a(t, e, 29) ^ c(e, t, 6);
i < 0 && (i += 4294967296);
return i;
}
function N(e, t) {
var i = o(e, t, 19) ^ o(t, e, 29) ^ h(e, t, 6);
i < 0 && (i += 4294967296);
return i;
}
}, {
"../common": 87,
"../utils": 97,
"minimalistic-assert": 105
} ],
96: [ function(e, t, i) {
"use strict";
var r = e("../utils").rotr32;
i.ft_1 = function(e, t, i, r) {
return 0 === e ? n(t, i, r) : 1 === e || 3 === e ? a(t, i, r) : 2 === e ? s(t, i, r) : void 0;
};
function n(e, t, i) {
return e & t ^ ~e & i;
}
i.ch32 = n;
function s(e, t, i) {
return e & t ^ e & i ^ t & i;
}
i.maj32 = s;
function a(e, t, i) {
return e ^ t ^ i;
}
i.p32 = a;
i.s0_256 = function(e) {
return r(e, 2) ^ r(e, 13) ^ r(e, 22);
};
i.s1_256 = function(e) {
return r(e, 6) ^ r(e, 11) ^ r(e, 25);
};
i.g0_256 = function(e) {
return r(e, 7) ^ r(e, 18) ^ e >>> 3;
};
i.g1_256 = function(e) {
return r(e, 17) ^ r(e, 19) ^ e >>> 10;
};
}, {
"../utils": 97
} ],
97: [ function(e, t, i) {
"use strict";
var r = e("minimalistic-assert"), n = e("inherits");
i.inherits = n;
i.toArray = function(e, t) {
if (Array.isArray(e)) return e.slice();
if (!e) return [];
var i = [];
if ("string" == typeof e) if (t) {
if ("hex" === t) {
(e = e.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 && (e = "0" + e);
for (r = 0; r < e.length; r += 2) i.push(parseInt(e[r] + e[r + 1], 16));
}
} else for (var r = 0; r < e.length; r++) {
var n = e.charCodeAt(r), s = n >> 8, a = 255 & n;
s ? i.push(s, a) : i.push(a);
} else for (r = 0; r < e.length; r++) i[r] = 0 | e[r];
return i;
};
i.toHex = function(e) {
for (var t = "", i = 0; i < e.length; i++) t += a(e[i].toString(16));
return t;
};
function s(e) {
return (e >>> 24 | e >>> 8 & 65280 | e << 8 & 16711680 | (255 & e) << 24) >>> 0;
}
i.htonl = s;
i.toHex32 = function(e, t) {
for (var i = "", r = 0; r < e.length; r++) {
var n = e[r];
"little" === t && (n = s(n));
i += o(n.toString(16));
}
return i;
};
function a(e) {
return 1 === e.length ? "0" + e : e;
}
i.zero2 = a;
function o(e) {
return 7 === e.length ? "0" + e : 6 === e.length ? "00" + e : 5 === e.length ? "000" + e : 4 === e.length ? "0000" + e : 3 === e.length ? "00000" + e : 2 === e.length ? "000000" + e : 1 === e.length ? "0000000" + e : e;
}
i.zero8 = o;
i.join32 = function(e, t, i, n) {
var s = i - t;
r(s % 4 == 0);
for (var a = new Array(s / 4), o = 0, c = t; o < a.length; o++, c += 4) {
var h;
h = "big" === n ? e[c] << 24 | e[c + 1] << 16 | e[c + 2] << 8 | e[c + 3] : e[c + 3] << 24 | e[c + 2] << 16 | e[c + 1] << 8 | e[c];
a[o] = h >>> 0;
}
return a;
};
i.split32 = function(e, t) {
for (var i = new Array(4 * e.length), r = 0, n = 0; r < e.length; r++, n += 4) {
var s = e[r];
if ("big" === t) {
i[n] = s >>> 24;
i[n + 1] = s >>> 16 & 255;
i[n + 2] = s >>> 8 & 255;
i[n + 3] = 255 & s;
} else {
i[n + 3] = s >>> 24;
i[n + 2] = s >>> 16 & 255;
i[n + 1] = s >>> 8 & 255;
i[n] = 255 & s;
}
}
return i;
};
i.rotr32 = function(e, t) {
return e >>> t | e << 32 - t;
};
i.rotl32 = function(e, t) {
return e << t | e >>> 32 - t;
};
i.sum32 = function(e, t) {
return e + t >>> 0;
};
i.sum32_3 = function(e, t, i) {
return e + t + i >>> 0;
};
i.sum32_4 = function(e, t, i, r) {
return e + t + i + r >>> 0;
};
i.sum32_5 = function(e, t, i, r, n) {
return e + t + i + r + n >>> 0;
};
i.sum64 = function(e, t, i, r) {
var n = e[t], s = r + e[t + 1] >>> 0, a = (s < r ? 1 : 0) + i + n;
e[t] = a >>> 0;
e[t + 1] = s;
};
i.sum64_hi = function(e, t, i, r) {
return (t + r >>> 0 < t ? 1 : 0) + e + i >>> 0;
};
i.sum64_lo = function(e, t, i, r) {
return t + r >>> 0;
};
i.sum64_4_hi = function(e, t, i, r, n, s, a, o) {
var c = 0, h = t;
c += (h = h + r >>> 0) < t ? 1 : 0;
c += (h = h + s >>> 0) < s ? 1 : 0;
return e + i + n + a + (c += (h = h + o >>> 0) < o ? 1 : 0) >>> 0;
};
i.sum64_4_lo = function(e, t, i, r, n, s, a, o) {
return t + r + s + o >>> 0;
};
i.sum64_5_hi = function(e, t, i, r, n, s, a, o, c, h) {
var f = 0, d = t;
f += (d = d + r >>> 0) < t ? 1 : 0;
f += (d = d + s >>> 0) < s ? 1 : 0;
f += (d = d + o >>> 0) < o ? 1 : 0;
return e + i + n + a + c + (f += (d = d + h >>> 0) < h ? 1 : 0) >>> 0;
};
i.sum64_5_lo = function(e, t, i, r, n, s, a, o, c, h) {
return t + r + s + o + h >>> 0;
};
i.rotr64_hi = function(e, t, i) {
return (t << 32 - i | e >>> i) >>> 0;
};
i.rotr64_lo = function(e, t, i) {
return (e << 32 - i | t >>> i) >>> 0;
};
i.shr64_hi = function(e, t, i) {
return e >>> i;
};
i.shr64_lo = function(e, t, i) {
return (e << 32 - i | t >>> i) >>> 0;
};
}, {
inherits: 101,
"minimalistic-assert": 105
} ],
98: [ function(e, t, i) {
"use strict";
var r = e("hash.js"), n = e("minimalistic-crypto-utils"), s = e("minimalistic-assert");
function a(e) {
if (!(this instanceof a)) return new a(e);
this.hash = e.hash;
this.predResist = !!e.predResist;
this.outLen = this.hash.outSize;
this.minEntropy = e.minEntropy || this.hash.hmacStrength;
this._reseed = null;
this.reseedInterval = null;
this.K = null;
this.V = null;
var t = n.toArray(e.entropy, e.entropyEnc || "hex"), i = n.toArray(e.nonce, e.nonceEnc || "hex"), r = n.toArray(e.pers, e.persEnc || "hex");
s(t.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits");
this._init(t, i, r);
}
t.exports = a;
a.prototype._init = function(e, t, i) {
var r = e.concat(t).concat(i);
this.K = new Array(this.outLen / 8);
this.V = new Array(this.outLen / 8);
for (var n = 0; n < this.V.length; n++) {
this.K[n] = 0;
this.V[n] = 1;
}
this._update(r);
this._reseed = 1;
this.reseedInterval = 281474976710656;
};
a.prototype._hmac = function() {
return new r.hmac(this.hash, this.K);
};
a.prototype._update = function(e) {
var t = this._hmac().update(this.V).update([ 0 ]);
e && (t = t.update(e));
this.K = t.digest();
this.V = this._hmac().update(this.V).digest();
if (e) {
this.K = this._hmac().update(this.V).update([ 1 ]).update(e).digest();
this.V = this._hmac().update(this.V).digest();
}
};
a.prototype.reseed = function(e, t, i, r) {
if ("string" != typeof t) {
r = i;
i = t;
t = null;
}
e = n.toArray(e, t);
i = n.toArray(i, r);
s(e.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits");
this._update(e.concat(i || []));
this._reseed = 1;
};
a.prototype.generate = function(e, t, i, r) {
if (this._reseed > this.reseedInterval) throw new Error("Reseed is required");
if ("string" != typeof t) {
r = i;
i = t;
t = null;
}
if (i) {
i = n.toArray(i, r || "hex");
this._update(i);
}
for (var s = []; s.length < e; ) {
this.V = this._hmac().update(this.V).digest();
s = s.concat(this.V);
}
var a = s.slice(0, e);
this._update(i);
this._reseed++;
return n.encode(a, t);
};
}, {
"hash.js": 86,
"minimalistic-assert": 105,
"minimalistic-crypto-utils": 106
} ],
99: [ function(e, t, i) {
i.read = function(e, t, i, r, n) {
var s, a, o = 8 * n - r - 1, c = (1 << o) - 1, h = c >> 1, f = -7, d = i ? n - 1 : 0, u = i ? -1 : 1, l = e[t + d];
d += u;
s = l & (1 << -f) - 1;
l >>= -f;
f += o;
for (;f > 0; s = 256 * s + e[t + d], d += u, f -= 8) ;
a = s & (1 << -f) - 1;
s >>= -f;
f += r;
for (;f > 0; a = 256 * a + e[t + d], d += u, f -= 8) ;
if (0 === s) s = 1 - h; else {
if (s === c) return a ? NaN : Infinity * (l ? -1 : 1);
a += Math.pow(2, r);
s -= h;
}
return (l ? -1 : 1) * a * Math.pow(2, s - r);
};
i.write = function(e, t, i, r, n, s) {
var a, o, c, h = 8 * s - n - 1, f = (1 << h) - 1, d = f >> 1, u = 23 === n ? Math.pow(2, -24) - Math.pow(2, -77) : 0, l = r ? 0 : s - 1, p = r ? 1 : -1, b = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
t = Math.abs(t);
if (isNaN(t) || Infinity === t) {
o = isNaN(t) ? 1 : 0;
a = f;
} else {
a = Math.floor(Math.log(t) / Math.LN2);
if (t * (c = Math.pow(2, -a)) < 1) {
a--;
c *= 2;
}
if ((t += a + d >= 1 ? u / c : u * Math.pow(2, 1 - d)) * c >= 2) {
a++;
c /= 2;
}
if (a + d >= f) {
o = 0;
a = f;
} else if (a + d >= 1) {
o = (t * c - 1) * Math.pow(2, n);
a += d;
} else {
o = t * Math.pow(2, d - 1) * Math.pow(2, n);
a = 0;
}
}
for (;n >= 8; e[i + l] = 255 & o, l += p, o /= 256, n -= 8) ;
a = a << n | o;
h += n;
for (;h > 0; e[i + l] = 255 & a, l += p, a /= 256, h -= 8) ;
e[i + l - p] |= 128 * b;
};
}, {} ],
100: [ function(e, t, i) {
var r = [].indexOf;
t.exports = function(e, t) {
if (r) return e.indexOf(t);
for (var i = 0; i < e.length; ++i) if (e[i] === t) return i;
return -1;
};
}, {} ],
101: [ function(e, t, i) {
"function" == typeof Object.create ? t.exports = function(e, t) {
e.super_ = t;
e.prototype = Object.create(t.prototype, {
constructor: {
value: e,
enumerable: !1,
writable: !0,
configurable: !0
}
});
} : t.exports = function(e, t) {
e.super_ = t;
var i = function() {};
i.prototype = t.prototype;
e.prototype = new i();
e.prototype.constructor = e;
};
}, {} ],
102: [ function(e, t, i) {
t.exports = function(e) {
return null != e && (r(e) || function(e) {
return "function" == typeof e.readFloatLE && "function" == typeof e.slice && r(e.slice(0, 0));
}(e) || !!e._isBuffer);
};
function r(e) {
return !!e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e);
}
}, {} ],
103: [ function(e, t, i) {
"use strict";
var r = e("inherits"), n = e("hash-base"), s = e("safe-buffer").Buffer, a = new Array(16);
function o() {
n.call(this, 64);
this._a = 1732584193;
this._b = 4023233417;
this._c = 2562383102;
this._d = 271733878;
}
r(o, n);
o.prototype._update = function() {
for (var e = a, t = 0; t < 16; ++t) e[t] = this._block.readInt32LE(4 * t);
var i = this._a, r = this._b, n = this._c, s = this._d;
r = u(r = u(r = u(r = u(r = d(r = d(r = d(r = d(r = f(r = f(r = f(r = f(r = h(r = h(r = h(r = h(r, n = h(n, s = h(s, i = h(i, r, n, s, e[0], 3614090360, 7), r, n, e[1], 3905402710, 12), i, r, e[2], 606105819, 17), s, i, e[3], 3250441966, 22), n = h(n, s = h(s, i = h(i, r, n, s, e[4], 4118548399, 7), r, n, e[5], 1200080426, 12), i, r, e[6], 2821735955, 17), s, i, e[7], 4249261313, 22), n = h(n, s = h(s, i = h(i, r, n, s, e[8], 1770035416, 7), r, n, e[9], 2336552879, 12), i, r, e[10], 4294925233, 17), s, i, e[11], 2304563134, 22), n = h(n, s = h(s, i = h(i, r, n, s, e[12], 1804603682, 7), r, n, e[13], 4254626195, 12), i, r, e[14], 2792965006, 17), s, i, e[15], 1236535329, 22), n = f(n, s = f(s, i = f(i, r, n, s, e[1], 4129170786, 5), r, n, e[6], 3225465664, 9), i, r, e[11], 643717713, 14), s, i, e[0], 3921069994, 20), n = f(n, s = f(s, i = f(i, r, n, s, e[5], 3593408605, 5), r, n, e[10], 38016083, 9), i, r, e[15], 3634488961, 14), s, i, e[4], 3889429448, 20), n = f(n, s = f(s, i = f(i, r, n, s, e[9], 568446438, 5), r, n, e[14], 3275163606, 9), i, r, e[3], 4107603335, 14), s, i, e[8], 1163531501, 20), n = f(n, s = f(s, i = f(i, r, n, s, e[13], 2850285829, 5), r, n, e[2], 4243563512, 9), i, r, e[7], 1735328473, 14), s, i, e[12], 2368359562, 20), n = d(n, s = d(s, i = d(i, r, n, s, e[5], 4294588738, 4), r, n, e[8], 2272392833, 11), i, r, e[11], 1839030562, 16), s, i, e[14], 4259657740, 23), n = d(n, s = d(s, i = d(i, r, n, s, e[1], 2763975236, 4), r, n, e[4], 1272893353, 11), i, r, e[7], 4139469664, 16), s, i, e[10], 3200236656, 23), n = d(n, s = d(s, i = d(i, r, n, s, e[13], 681279174, 4), r, n, e[0], 3936430074, 11), i, r, e[3], 3572445317, 16), s, i, e[6], 76029189, 23), n = d(n, s = d(s, i = d(i, r, n, s, e[9], 3654602809, 4), r, n, e[12], 3873151461, 11), i, r, e[15], 530742520, 16), s, i, e[2], 3299628645, 23), n = u(n, s = u(s, i = u(i, r, n, s, e[0], 4096336452, 6), r, n, e[7], 1126891415, 10), i, r, e[14], 2878612391, 15), s, i, e[5], 4237533241, 21), n = u(n, s = u(s, i = u(i, r, n, s, e[12], 1700485571, 6), r, n, e[3], 2399980690, 10), i, r, e[10], 4293915773, 15), s, i, e[1], 2240044497, 21), n = u(n, s = u(s, i = u(i, r, n, s, e[8], 1873313359, 6), r, n, e[15], 4264355552, 10), i, r, e[6], 2734768916, 15), s, i, e[13], 1309151649, 21), n = u(n, s = u(s, i = u(i, r, n, s, e[4], 4149444226, 6), r, n, e[11], 3174756917, 10), i, r, e[2], 718787259, 15), s, i, e[9], 3951481745, 21);
this._a = this._a + i | 0;
this._b = this._b + r | 0;
this._c = this._c + n | 0;
this._d = this._d + s | 0;
};
o.prototype._digest = function() {
this._block[this._blockOffset++] = 128;
if (this._blockOffset > 56) {
this._block.fill(0, this._blockOffset, 64);
this._update();
this._blockOffset = 0;
}
this._block.fill(0, this._blockOffset, 56);
this._block.writeUInt32LE(this._length[0], 56);
this._block.writeUInt32LE(this._length[1], 60);
this._update();
var e = s.allocUnsafe(16);
e.writeInt32LE(this._a, 0);
e.writeInt32LE(this._b, 4);
e.writeInt32LE(this._c, 8);
e.writeInt32LE(this._d, 12);
return e;
};
function c(e, t) {
return e << t | e >>> 32 - t;
}
function h(e, t, i, r, n, s, a) {
return c(e + (t & i | ~t & r) + n + s | 0, a) + t | 0;
}
function f(e, t, i, r, n, s, a) {
return c(e + (t & r | i & ~r) + n + s | 0, a) + t | 0;
}
function d(e, t, i, r, n, s, a) {
return c(e + (t ^ i ^ r) + n + s | 0, a) + t | 0;
}
function u(e, t, i, r, n, s, a) {
return c(e + (i ^ (t | ~r)) + n + s | 0, a) + t | 0;
}
t.exports = o;
}, {
"hash-base": 85,
inherits: 101,
"safe-buffer": 143
} ],
104: [ function(e, t, i) {
var r = e("bn.js"), n = e("brorand");
function s(e) {
this.rand = e || new n.Rand();
}
t.exports = s;
s.create = function(e) {
return new s(e);
};
s.prototype._randbelow = function(e) {
var t = e.bitLength(), i = Math.ceil(t / 8);
do {
var n = new r(this.rand.generate(i));
} while (n.cmp(e) >= 0);
return n;
};
s.prototype._randrange = function(e, t) {
var i = t.sub(e);
return e.add(this._randbelow(i));
};
s.prototype.test = function(e, t, i) {
var n = e.bitLength(), s = r.mont(e), a = new r(1).toRed(s);
t || (t = Math.max(1, n / 48 | 0));
for (var o = e.subn(1), c = 0; !o.testn(c); c++) ;
for (var h = e.shrn(c), f = o.toRed(s); t > 0; t--) {
var d = this._randrange(new r(2), o);
i && i(d);
var u = d.toRed(s).redPow(h);
if (0 !== u.cmp(a) && 0 !== u.cmp(f)) {
for (var l = 1; l < c; l++) {
if (0 === (u = u.redSqr()).cmp(a)) return !1;
if (0 === u.cmp(f)) break;
}
if (l === c) return !1;
}
}
return !0;
};
s.prototype.getDivisor = function(e, t) {
var i = e.bitLength(), n = r.mont(e), s = new r(1).toRed(n);
t || (t = Math.max(1, i / 48 | 0));
for (var a = e.subn(1), o = 0; !a.testn(o); o++) ;
for (var c = e.shrn(o), h = a.toRed(n); t > 0; t--) {
var f = this._randrange(new r(2), a), d = e.gcd(f);
if (0 !== d.cmpn(1)) return d;
var u = f.toRed(n).redPow(c);
if (0 !== u.cmp(s) && 0 !== u.cmp(h)) {
for (var l = 1; l < o; l++) {
if (0 === (u = u.redSqr()).cmp(s)) return u.fromRed().subn(1).gcd(e);
if (0 === u.cmp(h)) break;
}
if (l === o) return (u = u.redSqr()).fromRed().subn(1).gcd(e);
}
}
return !1;
};
}, {
"bn.js": 16,
brorand: 17
} ],
105: [ function(e, t, i) {
t.exports = r;
function r(e, t) {
if (!e) throw new Error(t || "Assertion failed");
}
r.equal = function(e, t, i) {
if (e != t) throw new Error(i || "Assertion failed: " + e + " != " + t);
};
}, {} ],
106: [ function(e, t, i) {
"use strict";
var r = i;
r.toArray = function(e, t) {
if (Array.isArray(e)) return e.slice();
if (!e) return [];
var i = [];
if ("string" != typeof e) {
for (var r = 0; r < e.length; r++) i[r] = 0 | e[r];
return i;
}
if ("hex" === t) {
(e = e.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 && (e = "0" + e);
for (r = 0; r < e.length; r += 2) i.push(parseInt(e[r] + e[r + 1], 16));
} else for (r = 0; r < e.length; r++) {
var n = e.charCodeAt(r), s = n >> 8, a = 255 & n;
s ? i.push(s, a) : i.push(a);
}
return i;
};
function n(e) {
return 1 === e.length ? "0" + e : e;
}
r.zero2 = n;
function s(e) {
for (var t = "", i = 0; i < e.length; i++) t += n(e[i].toString(16));
return t;
}
r.toHex = s;
r.encode = function(e, t) {
return "hex" === t ? s(e) : e;
};
}, {} ],
107: [ function(e, t, i) {
t.exports = {
"2.16.840.1.101.3.4.1.1": "aes-128-ecb",
"2.16.840.1.101.3.4.1.2": "aes-128-cbc",
"2.16.840.1.101.3.4.1.3": "aes-128-ofb",
"2.16.840.1.101.3.4.1.4": "aes-128-cfb",
"2.16.840.1.101.3.4.1.21": "aes-192-ecb",
"2.16.840.1.101.3.4.1.22": "aes-192-cbc",
"2.16.840.1.101.3.4.1.23": "aes-192-ofb",
"2.16.840.1.101.3.4.1.24": "aes-192-cfb",
"2.16.840.1.101.3.4.1.41": "aes-256-ecb",
"2.16.840.1.101.3.4.1.42": "aes-256-cbc",
"2.16.840.1.101.3.4.1.43": "aes-256-ofb",
"2.16.840.1.101.3.4.1.44": "aes-256-cfb"
};
}, {} ],
108: [ function(e, t, i) {
"use strict";
var r = e("asn1.js");
i.certificate = e("./certificate");
var n = r.define("RSAPrivateKey", function() {
this.seq().obj(this.key("version").int(), this.key("modulus").int(), this.key("publicExponent").int(), this.key("privateExponent").int(), this.key("prime1").int(), this.key("prime2").int(), this.key("exponent1").int(), this.key("exponent2").int(), this.key("coefficient").int());
});
i.RSAPrivateKey = n;
var s = r.define("RSAPublicKey", function() {
this.seq().obj(this.key("modulus").int(), this.key("publicExponent").int());
});
i.RSAPublicKey = s;
var a = r.define("SubjectPublicKeyInfo", function() {
this.seq().obj(this.key("algorithm").use(o), this.key("subjectPublicKey").bitstr());
});
i.PublicKey = a;
var o = r.define("AlgorithmIdentifier", function() {
this.seq().obj(this.key("algorithm").objid(), this.key("none").null_().optional(), this.key("curve").objid().optional(), this.key("params").seq().obj(this.key("p").int(), this.key("q").int(), this.key("g").int()).optional());
}), c = r.define("PrivateKeyInfo", function() {
this.seq().obj(this.key("version").int(), this.key("algorithm").use(o), this.key("subjectPrivateKey").octstr());
});
i.PrivateKey = c;
var h = r.define("EncryptedPrivateKeyInfo", function() {
this.seq().obj(this.key("algorithm").seq().obj(this.key("id").objid(), this.key("decrypt").seq().obj(this.key("kde").seq().obj(this.key("id").objid(), this.key("kdeparams").seq().obj(this.key("salt").octstr(), this.key("iters").int())), this.key("cipher").seq().obj(this.key("algo").objid(), this.key("iv").octstr()))), this.key("subjectPrivateKey").octstr());
});
i.EncryptedPrivateKey = h;
var f = r.define("DSAPrivateKey", function() {
this.seq().obj(this.key("version").int(), this.key("p").int(), this.key("q").int(), this.key("g").int(), this.key("pub_key").int(), this.key("priv_key").int());
});
i.DSAPrivateKey = f;
i.DSAparam = r.define("DSAparam", function() {
this.int();
});
var d = r.define("ECPrivateKey", function() {
this.seq().obj(this.key("version").int(), this.key("privateKey").octstr(), this.key("parameters").optional().explicit(0).use(u), this.key("publicKey").optional().explicit(1).bitstr());
});
i.ECPrivateKey = d;
var u = r.define("ECParameters", function() {
this.choice({
namedCurve: this.objid()
});
});
i.signature = r.define("signature", function() {
this.seq().obj(this.key("r").int(), this.key("s").int());
});
}, {
"./certificate": 109,
"asn1.js": 1
} ],
109: [ function(e, t, i) {
"use strict";
var r = e("asn1.js"), n = r.define("Time", function() {
this.choice({
utcTime: this.utctime(),
generalTime: this.gentime()
});
}), s = r.define("AttributeTypeValue", function() {
this.seq().obj(this.key("type").objid(), this.key("value").any());
}), a = r.define("AlgorithmIdentifier", function() {
this.seq().obj(this.key("algorithm").objid(), this.key("parameters").optional());
}), o = r.define("SubjectPublicKeyInfo", function() {
this.seq().obj(this.key("algorithm").use(a), this.key("subjectPublicKey").bitstr());
}), c = r.define("RelativeDistinguishedName", function() {
this.setof(s);
}), h = r.define("RDNSequence", function() {
this.seqof(c);
}), f = r.define("Name", function() {
this.choice({
rdnSequence: this.use(h)
});
}), d = r.define("Validity", function() {
this.seq().obj(this.key("notBefore").use(n), this.key("notAfter").use(n));
}), u = r.define("Extension", function() {
this.seq().obj(this.key("extnID").objid(), this.key("critical").bool().def(!1), this.key("extnValue").octstr());
}), l = r.define("TBSCertificate", function() {
this.seq().obj(this.key("version").explicit(0).int(), this.key("serialNumber").int(), this.key("signature").use(a), this.key("issuer").use(f), this.key("validity").use(d), this.key("subject").use(f), this.key("subjectPublicKeyInfo").use(o), this.key("issuerUniqueID").implicit(1).bitstr().optional(), this.key("subjectUniqueID").implicit(2).bitstr().optional(), this.key("extensions").explicit(3).seqof(u).optional());
}), p = r.define("X509Certificate", function() {
this.seq().obj(this.key("tbsCertificate").use(l), this.key("signatureAlgorithm").use(a), this.key("signatureValue").bitstr());
});
t.exports = p;
}, {
"asn1.js": 1
} ],
110: [ function(e, t, i) {
(function(i) {
var r = /Proc-Type: 4,ENCRYPTED[\n\r]+DEK-Info: AES-((?:128)|(?:192)|(?:256))-CBC,([0-9A-H]+)[\n\r]+([0-9A-z\n\r\+\/\=]+)[\n\r]+/m, n = /^-----BEGIN ((?:.* KEY)|CERTIFICATE)-----/m, s = /^-----BEGIN ((?:.* KEY)|CERTIFICATE)-----([0-9A-z\n\r\+\/\=]+)-----END \1-----$/m, a = e("evp_bytestokey"), o = e("browserify-aes");
t.exports = function(e, t) {
var c, h = e.toString(), f = h.match(r);
if (f) {
var d = "aes" + f[1], u = new i(f[2], "hex"), l = new i(f[3].replace(/[\r\n]/g, ""), "base64"), p = a(t, u.slice(0, 8), parseInt(f[1], 10)).key, b = [], g = o.createDecipheriv(d, p, u);
b.push(g.update(l));
b.push(g.final());
c = i.concat(b);
} else {
var y = h.match(s);
c = new i(y[2].replace(/[\r\n]/g, ""), "base64");
}
return {
tag: h.match(n)[1],
data: c
};
};
}).call(this, e("buffer").Buffer);
}, {
"browserify-aes": 21,
buffer: 47,
evp_bytestokey: 84
} ],
111: [ function(e, t, i) {
(function(i) {
var r = e("./asn1"), n = e("./aesid.json"), s = e("./fixProc"), a = e("browserify-aes"), o = e("pbkdf2");
t.exports = c;
function c(e) {
var t;
if ("object" == typeof e && !i.isBuffer(e)) {
t = e.passphrase;
e = e.key;
}
"string" == typeof e && (e = new i(e));
var c, h, f = s(e, t), d = f.tag, u = f.data;
switch (d) {
case "CERTIFICATE":
h = r.certificate.decode(u, "der").tbsCertificate.subjectPublicKeyInfo;

case "PUBLIC KEY":
h || (h = r.PublicKey.decode(u, "der"));
switch (c = h.algorithm.algorithm.join(".")) {
case "1.2.840.113549.1.1.1":
return r.RSAPublicKey.decode(h.subjectPublicKey.data, "der");

case "1.2.840.10045.2.1":
h.subjectPrivateKey = h.subjectPublicKey;
return {
type: "ec",
data: h
};

case "1.2.840.10040.4.1":
h.algorithm.params.pub_key = r.DSAparam.decode(h.subjectPublicKey.data, "der");
return {
type: "dsa",
data: h.algorithm.params
};

default:
throw new Error("unknown key id " + c);
}
throw new Error("unknown key type " + d);

case "ENCRYPTED PRIVATE KEY":
u = function(e, t) {
var r = e.algorithm.decrypt.kde.kdeparams.salt, s = parseInt(e.algorithm.decrypt.kde.kdeparams.iters.toString(), 10), c = n[e.algorithm.decrypt.cipher.algo.join(".")], h = e.algorithm.decrypt.cipher.iv, f = e.subjectPrivateKey, d = parseInt(c.split("-")[1], 10) / 8, u = o.pbkdf2Sync(t, r, s, d), l = a.createDecipheriv(c, u, h), p = [];
p.push(l.update(f));
p.push(l.final());
return i.concat(p);
}(u = r.EncryptedPrivateKey.decode(u, "der"), t);

case "PRIVATE KEY":
switch (c = (h = r.PrivateKey.decode(u, "der")).algorithm.algorithm.join(".")) {
case "1.2.840.113549.1.1.1":
return r.RSAPrivateKey.decode(h.subjectPrivateKey, "der");

case "1.2.840.10045.2.1":
return {
curve: h.algorithm.curve,
privateKey: r.ECPrivateKey.decode(h.subjectPrivateKey, "der").privateKey
};

case "1.2.840.10040.4.1":
h.algorithm.params.priv_key = r.DSAparam.decode(h.subjectPrivateKey, "der");
return {
type: "dsa",
params: h.algorithm.params
};

default:
throw new Error("unknown key id " + c);
}
throw new Error("unknown key type " + d);

case "RSA PUBLIC KEY":
return r.RSAPublicKey.decode(u, "der");

case "RSA PRIVATE KEY":
return r.RSAPrivateKey.decode(u, "der");

case "DSA PRIVATE KEY":
return {
type: "dsa",
params: r.DSAPrivateKey.decode(u, "der")
};

case "EC PRIVATE KEY":
return {
curve: (u = r.ECPrivateKey.decode(u, "der")).parameters.value,
privateKey: u.privateKey
};

default:
throw new Error("unknown key type " + d);
}
}
c.signature = r.signature;
}).call(this, e("buffer").Buffer);
}, {
"./aesid.json": 107,
"./asn1": 108,
"./fixProc": 110,
"browserify-aes": 21,
buffer: 47,
pbkdf2: 112
} ],
112: [ function(e, t, i) {
i.pbkdf2 = e("./lib/async");
i.pbkdf2Sync = e("./lib/sync");
}, {
"./lib/async": 113,
"./lib/sync": 116
} ],
113: [ function(e, t, i) {
(function(i, r) {
var n, s = e("./precondition"), a = e("./default-encoding"), o = e("./sync"), c = e("safe-buffer").Buffer, h = r.crypto && r.crypto.subtle, f = {
sha: "SHA-1",
"sha-1": "SHA-1",
sha1: "SHA-1",
sha256: "SHA-256",
"sha-256": "SHA-256",
sha384: "SHA-384",
"sha-384": "SHA-384",
"sha-512": "SHA-512",
sha512: "SHA-512"
}, d = [];
function u(e, t, i, r, n) {
return h.importKey("raw", e, {
name: "PBKDF2"
}, !1, [ "deriveBits" ]).then(function(e) {
return h.deriveBits({
name: "PBKDF2",
salt: t,
iterations: i,
hash: {
name: n
}
}, e, r << 3);
}).then(function(e) {
return c.from(e);
});
}
t.exports = function(e, t, l, p, b, g) {
if ("function" == typeof b) {
g = b;
b = void 0;
}
var y = f[(b = b || "sha1").toLowerCase()];
if (!y || "function" != typeof r.Promise) return i.nextTick(function() {
var i;
try {
i = o(e, t, l, p, b);
} catch (e) {
return g(e);
}
g(null, i);
});
s(e, t, l, p);
if ("function" != typeof g) throw new Error("No callback provided to pbkdf2");
c.isBuffer(e) || (e = c.from(e, a));
c.isBuffer(t) || (t = c.from(t, a));
(function(e, t) {
e.then(function(e) {
i.nextTick(function() {
t(null, e);
});
}, function(e) {
i.nextTick(function() {
t(e);
});
});
})(function(e) {
if (r.process && !r.process.browser) return Promise.resolve(!1);
if (!h || !h.importKey || !h.deriveBits) return Promise.resolve(!1);
if (void 0 !== d[e]) return d[e];
var t = u(n = n || c.alloc(8), n, 10, 128, e).then(function() {
return !0;
}).catch(function() {
return !1;
});
d[e] = t;
return t;
}(y).then(function(i) {
return i ? u(e, t, l, p, y) : o(e, t, l, p, b);
}), g);
};
}).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
}, {
"./default-encoding": 114,
"./precondition": 115,
"./sync": 116,
_process: 118,
"safe-buffer": 143
} ],
114: [ function(e, t, i) {
(function(e) {
var i;
if (e.browser) i = "utf-8"; else {
i = parseInt(e.version.split(".")[0].slice(1), 10) >= 6 ? "utf-8" : "binary";
}
t.exports = i;
}).call(this, e("_process"));
}, {
_process: 118
} ],
115: [ function(e, t, i) {
(function(e) {
var i = Math.pow(2, 30) - 1;
function r(t, i) {
if ("string" != typeof t && !e.isBuffer(t)) throw new TypeError(i + " must be a buffer or string");
}
t.exports = function(e, t, n, s) {
r(e, "Password");
r(t, "Salt");
if ("number" != typeof n) throw new TypeError("Iterations not a number");
if (n < 0) throw new TypeError("Bad iterations");
if ("number" != typeof s) throw new TypeError("Key length not a number");
if (s < 0 || s > i || s != s) throw new TypeError("Bad key length");
};
}).call(this, {
isBuffer: e("../../is-buffer/index.js")
});
}, {
"../../is-buffer/index.js": 102
} ],
116: [ function(e, t, i) {
var r = e("create-hash/md5"), n = e("ripemd160"), s = e("sha.js"), a = e("./precondition"), o = e("./default-encoding"), c = e("safe-buffer").Buffer, h = c.alloc(128), f = {
md5: 16,
sha1: 20,
sha224: 28,
sha256: 32,
sha384: 48,
sha512: 64,
rmd160: 20,
ripemd160: 20
};
function d(e, t, i) {
var a = function(e) {
return "rmd160" === e || "ripemd160" === e ? function(e) {
return new n().update(e).digest();
} : "md5" === e ? r : function(t) {
return s(e).update(t).digest();
};
}(e), o = "sha512" === e || "sha384" === e ? 128 : 64;
t.length > o ? t = a(t) : t.length < o && (t = c.concat([ t, h ], o));
for (var d = c.allocUnsafe(o + f[e]), u = c.allocUnsafe(o + f[e]), l = 0; l < o; l++) {
d[l] = 54 ^ t[l];
u[l] = 92 ^ t[l];
}
var p = c.allocUnsafe(o + i + 4);
d.copy(p, 0, 0, o);
this.ipad1 = p;
this.ipad2 = d;
this.opad = u;
this.alg = e;
this.blocksize = o;
this.hash = a;
this.size = f[e];
}
d.prototype.run = function(e, t) {
e.copy(t, this.blocksize);
this.hash(t).copy(this.opad, this.blocksize);
return this.hash(this.opad);
};
t.exports = function(e, t, i, r, n) {
a(e, t, i, r);
c.isBuffer(e) || (e = c.from(e, o));
c.isBuffer(t) || (t = c.from(t, o));
var s = new d(n = n || "sha1", e, t.length), h = c.allocUnsafe(r), u = c.allocUnsafe(t.length + 4);
t.copy(u, 0, 0, t.length);
for (var l = 0, p = f[n], b = Math.ceil(r / p), g = 1; g <= b; g++) {
u.writeUInt32BE(g, t.length);
for (var y = s.run(u, s.ipad1), m = y, v = 1; v < i; v++) {
m = s.run(m, s.ipad2);
for (var _ = 0; _ < p; _++) y[_] ^= m[_];
}
y.copy(h, l);
l += p;
}
return h;
};
}, {
"./default-encoding": 114,
"./precondition": 115,
"create-hash/md5": 53,
ripemd160: 142,
"safe-buffer": 143,
"sha.js": 145
} ],
117: [ function(e, t, i) {
(function(e) {
"use strict";
!e.version || 0 === e.version.indexOf("v0.") || 0 === e.version.indexOf("v1.") && 0 !== e.version.indexOf("v1.8.") ? t.exports = {
nextTick: function(t, i, r, n) {
if ("function" != typeof t) throw new TypeError('"callback" argument must be a function');
var s, a, o = arguments.length;
switch (o) {
case 0:
case 1:
return e.nextTick(t);

case 2:
return e.nextTick(function() {
t.call(null, i);
});

case 3:
return e.nextTick(function() {
t.call(null, i, r);
});

case 4:
return e.nextTick(function() {
t.call(null, i, r, n);
});

default:
s = new Array(o - 1);
a = 0;
for (;a < s.length; ) s[a++] = arguments[a];
return e.nextTick(function() {
t.apply(null, s);
});
}
}
} : t.exports = e;
}).call(this, e("_process"));
}, {
_process: 118
} ],
118: [ function(e, t, i) {
var r, n, s = t.exports = {};
function a() {
throw new Error("setTimeout has not been defined");
}
function o() {
throw new Error("clearTimeout has not been defined");
}
(function() {
try {
r = "function" == typeof setTimeout ? setTimeout : a;
} catch (e) {
r = a;
}
try {
n = "function" == typeof clearTimeout ? clearTimeout : o;
} catch (e) {
n = o;
}
})();
function c(e) {
if (r === setTimeout) return setTimeout(e, 0);
if ((r === a || !r) && setTimeout) {
r = setTimeout;
return setTimeout(e, 0);
}
try {
return r(e, 0);
} catch (t) {
try {
return r.call(null, e, 0);
} catch (t) {
return r.call(this, e, 0);
}
}
}
var h, f = [], d = !1, u = -1;
function l() {
if (d && h) {
d = !1;
h.length ? f = h.concat(f) : u = -1;
f.length && p();
}
}
function p() {
if (!d) {
var e = c(l);
d = !0;
for (var t = f.length; t; ) {
h = f;
f = [];
for (;++u < t; ) h && h[u].run();
u = -1;
t = f.length;
}
h = null;
d = !1;
(function(e) {
if (n === clearTimeout) return clearTimeout(e);
if ((n === o || !n) && clearTimeout) {
n = clearTimeout;
return clearTimeout(e);
}
try {
n(e);
} catch (t) {
try {
return n.call(null, e);
} catch (t) {
return n.call(this, e);
}
}
})(e);
}
}
s.nextTick = function(e) {
var t = new Array(arguments.length - 1);
if (arguments.length > 1) for (var i = 1; i < arguments.length; i++) t[i - 1] = arguments[i];
f.push(new b(e, t));
1 !== f.length || d || c(p);
};
function b(e, t) {
this.fun = e;
this.array = t;
}
b.prototype.run = function() {
this.fun.apply(null, this.array);
};
s.title = "browser";
s.browser = !0;
s.env = {};
s.argv = [];
s.version = "";
s.versions = {};
function g() {}
s.on = g;
s.addListener = g;
s.once = g;
s.off = g;
s.removeListener = g;
s.removeAllListeners = g;
s.emit = g;
s.prependListener = g;
s.prependOnceListener = g;
s.listeners = function(e) {
return [];
};
s.binding = function(e) {
throw new Error("process.binding is not supported");
};
s.cwd = function() {
return "/";
};
s.chdir = function(e) {
throw new Error("process.chdir is not supported");
};
s.umask = function() {
return 0;
};
}, {} ],
119: [ function(e, t, i) {
i.publicEncrypt = e("./publicEncrypt");
i.privateDecrypt = e("./privateDecrypt");
i.privateEncrypt = function(e, t) {
return i.publicEncrypt(e, t, !0);
};
i.publicDecrypt = function(e, t) {
return i.privateDecrypt(e, t, !0);
};
}, {
"./privateDecrypt": 121,
"./publicEncrypt": 122
} ],
120: [ function(e, t, i) {
var r = e("create-hash"), n = e("safe-buffer").Buffer;
t.exports = function(e, t) {
for (var i, a = n.alloc(0), o = 0; a.length < t; ) {
i = s(o++);
a = n.concat([ a, r("sha1").update(e).update(i).digest() ]);
}
return a.slice(0, t);
};
function s(e) {
var t = n.allocUnsafe(4);
t.writeUInt32BE(e, 0);
return t;
}
}, {
"create-hash": 52,
"safe-buffer": 143
} ],
121: [ function(e, t, i) {
var r = e("parse-asn1"), n = e("./mgf"), s = e("./xor"), a = e("bn.js"), o = e("browserify-rsa"), c = e("create-hash"), h = e("./withPublic"), f = e("safe-buffer").Buffer;
t.exports = function(e, t, i) {
var d;
d = e.padding ? e.padding : i ? 1 : 4;
var u, l = r(e), p = l.modulus.byteLength();
if (t.length > p || new a(t).cmp(l.modulus) >= 0) throw new Error("decryption error");
u = i ? h(new a(t), l) : o(t, l);
var b = f.alloc(p - u.length);
u = f.concat([ b, u ], p);
if (4 === d) return function(e, t) {
var i = e.modulus.byteLength(), r = c("sha1").update(f.alloc(0)).digest(), a = r.length;
if (0 !== t[0]) throw new Error("decryption error");
var o = t.slice(1, a + 1), h = t.slice(a + 1), d = s(o, n(h, a)), u = s(h, n(d, i - a - 1));
if (function(e, t) {
e = f.from(e);
t = f.from(t);
var i = 0, r = e.length;
if (e.length !== t.length) {
i++;
r = Math.min(e.length, t.length);
}
var n = -1;
for (;++n < r; ) i += e[n] ^ t[n];
return i;
}(r, u.slice(0, a))) throw new Error("decryption error");
var l = a;
for (;0 === u[l]; ) l++;
if (1 !== u[l++]) throw new Error("decryption error");
return u.slice(l);
}(l, u);
if (1 === d) return function(e, t, i) {
var r = t.slice(0, 2), n = 2, s = 0;
for (;0 !== t[n++]; ) if (n >= t.length) {
s++;
break;
}
var a = t.slice(2, n - 1);
("0002" !== r.toString("hex") && !i || "0001" !== r.toString("hex") && i) && s++;
a.length < 8 && s++;
if (s) throw new Error("decryption error");
return t.slice(n);
}(0, u, i);
if (3 === d) return u;
throw new Error("unknown padding");
};
}, {
"./mgf": 120,
"./withPublic": 123,
"./xor": 124,
"bn.js": 16,
"browserify-rsa": 39,
"create-hash": 52,
"parse-asn1": 111,
"safe-buffer": 143
} ],
122: [ function(e, t, i) {
var r = e("parse-asn1"), n = e("randombytes"), s = e("create-hash"), a = e("./mgf"), o = e("./xor"), c = e("bn.js"), h = e("./withPublic"), f = e("browserify-rsa"), d = e("safe-buffer").Buffer;
t.exports = function(e, t, i) {
var u;
u = e.padding ? e.padding : i ? 1 : 4;
var l, p = r(e);
if (4 === u) l = function(e, t) {
var i = e.modulus.byteLength(), r = t.length, h = s("sha1").update(d.alloc(0)).digest(), f = h.length, u = 2 * f;
if (r > i - u - 2) throw new Error("message too long");
var l = d.alloc(i - r - u - 2), p = i - f - 1, b = n(f), g = o(d.concat([ h, l, d.alloc(1, 1), t ], p), a(b, p)), y = o(b, a(g, f));
return new c(d.concat([ d.alloc(1), y, g ], i));
}(p, t); else if (1 === u) l = function(e, t, i) {
var r, s = t.length, a = e.modulus.byteLength();
if (s > a - 11) throw new Error("message too long");
r = i ? d.alloc(a - s - 3, 255) : function(e) {
var t, i = d.allocUnsafe(e), r = 0, s = n(2 * e), a = 0;
for (;r < e; ) {
if (a === s.length) {
s = n(2 * e);
a = 0;
}
(t = s[a++]) && (i[r++] = t);
}
return i;
}(a - s - 3);
return new c(d.concat([ d.from([ 0, i ? 1 : 2 ]), r, d.alloc(1), t ], a));
}(p, t, i); else {
if (3 !== u) throw new Error("unknown padding");
if ((l = new c(t)).cmp(p.modulus) >= 0) throw new Error("data too long for modulus");
}
return i ? f(l, p) : h(l, p);
};
}, {
"./mgf": 120,
"./withPublic": 123,
"./xor": 124,
"bn.js": 16,
"browserify-rsa": 39,
"create-hash": 52,
"parse-asn1": 111,
randombytes: 125,
"safe-buffer": 143
} ],
123: [ function(e, t, i) {
var r = e("bn.js"), n = e("safe-buffer").Buffer;
t.exports = function(e, t) {
return n.from(e.toRed(r.mont(t.modulus)).redPow(new r(t.publicExponent)).fromRed().toArray());
};
}, {
"bn.js": 16,
"safe-buffer": 143
} ],
124: [ function(e, t, i) {
t.exports = function(e, t) {
for (var i = e.length, r = -1; ++r < i; ) e[r] ^= t[r];
return e;
};
}, {} ],
125: [ function(e, t, i) {
(function(i, r) {
"use strict";
var n = e("safe-buffer").Buffer, s = r.crypto || r.msCrypto;
s && s.getRandomValues ? t.exports = function(e, t) {
if (e > 65536) throw new Error("requested too many random bytes");
var a = new r.Uint8Array(e);
e > 0 && s.getRandomValues(a);
var o = n.from(a.buffer);
if ("function" == typeof t) return i.nextTick(function() {
t(null, o);
});
return o;
} : t.exports = function() {
throw new Error("Secure random number generation is not supported by this browser.\nUse Chrome, Firefox or Internet Explorer 11");
};
}).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
}, {
_process: 118,
"safe-buffer": 143
} ],
126: [ function(e, t, i) {
(function(t, r) {
"use strict";
function n() {
throw new Error("secure random number generation not supported by this browser\nuse chrome, FireFox or Internet Explorer 11");
}
var s = e("safe-buffer"), a = e("randombytes"), o = s.Buffer, c = s.kMaxLength, h = r.crypto || r.msCrypto, f = Math.pow(2, 32) - 1;
function d(e, t) {
if ("number" != typeof e || e != e) throw new TypeError("offset must be a number");
if (e > f || e < 0) throw new TypeError("offset must be a uint32");
if (e > c || e > t) throw new RangeError("offset out of range");
}
function u(e, t, i) {
if ("number" != typeof e || e != e) throw new TypeError("size must be a number");
if (e > f || e < 0) throw new TypeError("size must be a uint32");
if (e + t > i || e > c) throw new RangeError("buffer too small");
}
if (h && h.getRandomValues || !t.browser) {
i.randomFill = function(e, t, i, n) {
if (!(o.isBuffer(e) || e instanceof r.Uint8Array)) throw new TypeError('"buf" argument must be a Buffer or Uint8Array');
if ("function" == typeof t) {
n = t;
t = 0;
i = e.length;
} else if ("function" == typeof i) {
n = i;
i = e.length - t;
} else if ("function" != typeof n) throw new TypeError('"cb" argument must be a function');
d(t, e.length);
u(i, t, e.length);
return l(e, t, i, n);
};
i.randomFillSync = function(e, t, i) {
"undefined" == typeof t && (t = 0);
if (!(o.isBuffer(e) || e instanceof r.Uint8Array)) throw new TypeError('"buf" argument must be a Buffer or Uint8Array');
d(t, e.length);
void 0 === i && (i = e.length - t);
u(i, t, e.length);
return l(e, t, i);
};
} else {
i.randomFill = n;
i.randomFillSync = n;
}
function l(e, i, r, n) {
if (t.browser) {
var s = e.buffer, o = new Uint8Array(s, i, r);
h.getRandomValues(o);
if (n) {
t.nextTick(function() {
n(null, e);
});
return;
}
return e;
}
if (!n) {
a(r).copy(e, i);
return e;
}
a(r, function(t, r) {
if (t) return n(t);
r.copy(e, i);
n(null, e);
});
}
}).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
}, {
_process: 118,
randombytes: 125,
"safe-buffer": 143
} ],
127: [ function(e, t, i) {
t.exports = e("./lib/_stream_duplex.js");
}, {
"./lib/_stream_duplex.js": 128
} ],
128: [ function(e, t, i) {
"use strict";
var r = e("process-nextick-args"), n = Object.keys || function(e) {
var t = [];
for (var i in e) t.push(i);
return t;
};
t.exports = d;
var s = e("core-util-is");
s.inherits = e("inherits");
var a = e("./_stream_readable"), o = e("./_stream_writable");
s.inherits(d, a);
for (var c = n(o.prototype), h = 0; h < c.length; h++) {
var f = c[h];
d.prototype[f] || (d.prototype[f] = o.prototype[f]);
}
function d(e) {
if (!(this instanceof d)) return new d(e);
a.call(this, e);
o.call(this, e);
e && !1 === e.readable && (this.readable = !1);
e && !1 === e.writable && (this.writable = !1);
this.allowHalfOpen = !0;
e && !1 === e.allowHalfOpen && (this.allowHalfOpen = !1);
this.once("end", u);
}
Object.defineProperty(d.prototype, "writableHighWaterMark", {
enumerable: !1,
get: function() {
return this._writableState.highWaterMark;
}
});
function u() {
this.allowHalfOpen || this._writableState.ended || r.nextTick(l, this);
}
function l(e) {
e.end();
}
Object.defineProperty(d.prototype, "destroyed", {
get: function() {
return void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed && this._writableState.destroyed);
},
set: function(e) {
if (void 0 !== this._readableState && void 0 !== this._writableState) {
this._readableState.destroyed = e;
this._writableState.destroyed = e;
}
}
});
d.prototype._destroy = function(e, t) {
this.push(null);
this.end();
r.nextTick(t, e);
};
}, {
"./_stream_readable": 130,
"./_stream_writable": 132,
"core-util-is": 50,
inherits: 101,
"process-nextick-args": 117
} ],
129: [ function(e, t, i) {
"use strict";
t.exports = s;
var r = e("./_stream_transform"), n = e("core-util-is");
n.inherits = e("inherits");
n.inherits(s, r);
function s(e) {
if (!(this instanceof s)) return new s(e);
r.call(this, e);
}
s.prototype._transform = function(e, t, i) {
i(null, e);
};
}, {
"./_stream_transform": 131,
"core-util-is": 50,
inherits: 101
} ],
130: [ function(e, t, i) {
(function(i, r) {
"use strict";
var n = e("process-nextick-args");
t.exports = v;
var s, a = e("isarray");
v.ReadableState = m;
e("events").EventEmitter;
var o = function(e, t) {
return e.listeners(t).length;
}, c = e("./internal/streams/stream"), h = e("safe-buffer").Buffer, f = r.Uint8Array || function() {};
var d = e("core-util-is");
d.inherits = e("inherits");
var u = e("util"), l = void 0;
l = u && u.debuglog ? u.debuglog("stream") : function() {};
var p, b = e("./internal/streams/BufferList"), g = e("./internal/streams/destroy");
d.inherits(v, c);
var y = [ "error", "close", "destroy", "pause", "resume" ];
function m(t, i) {
s = s || e("./_stream_duplex");
t = t || {};
var r = i instanceof s;
this.objectMode = !!t.objectMode;
r && (this.objectMode = this.objectMode || !!t.readableObjectMode);
var n = t.highWaterMark, a = t.readableHighWaterMark, o = this.objectMode ? 16 : 16384;
this.highWaterMark = n || 0 === n ? n : r && (a || 0 === a) ? a : o;
this.highWaterMark = Math.floor(this.highWaterMark);
this.buffer = new b();
this.length = 0;
this.pipes = null;
this.pipesCount = 0;
this.flowing = null;
this.ended = !1;
this.endEmitted = !1;
this.reading = !1;
this.sync = !0;
this.needReadable = !1;
this.emittedReadable = !1;
this.readableListening = !1;
this.resumeScheduled = !1;
this.destroyed = !1;
this.defaultEncoding = t.defaultEncoding || "utf8";
this.awaitDrain = 0;
this.readingMore = !1;
this.decoder = null;
this.encoding = null;
if (t.encoding) {
p || (p = e("string_decoder/").StringDecoder);
this.decoder = new p(t.encoding);
this.encoding = t.encoding;
}
}
function v(t) {
s = s || e("./_stream_duplex");
if (!(this instanceof v)) return new v(t);
this._readableState = new m(t, this);
this.readable = !0;
if (t) {
"function" == typeof t.read && (this._read = t.read);
"function" == typeof t.destroy && (this._destroy = t.destroy);
}
c.call(this);
}
Object.defineProperty(v.prototype, "destroyed", {
get: function() {
return void 0 !== this._readableState && this._readableState.destroyed;
},
set: function(e) {
this._readableState && (this._readableState.destroyed = e);
}
});
v.prototype.destroy = g.destroy;
v.prototype._undestroy = g.undestroy;
v.prototype._destroy = function(e, t) {
this.push(null);
t(e);
};
v.prototype.push = function(e, t) {
var i, r = this._readableState;
if (r.objectMode) i = !0; else if ("string" == typeof e) {
if ((t = t || r.defaultEncoding) !== r.encoding) {
e = h.from(e, t);
t = "";
}
i = !0;
}
return _(this, e, t, !1, i);
};
v.prototype.unshift = function(e) {
return _(this, e, null, !0, !1);
};
function _(e, t, i, r, n) {
var s = e._readableState;
if (null === t) {
s.reading = !1;
(function(e, t) {
if (t.ended) return;
if (t.decoder) {
var i = t.decoder.end();
if (i && i.length) {
t.buffer.push(i);
t.length += t.objectMode ? 1 : i.length;
}
}
t.ended = !0;
E(e);
})(e, s);
} else {
var a;
n || (a = function(e, t) {
var i;
(function(e) {
return h.isBuffer(e) || e instanceof f;
})(t) || "string" == typeof t || void 0 === t || e.objectMode || (i = new TypeError("Invalid non-string/buffer chunk"));
return i;
}(s, t));
if (a) e.emit("error", a); else if (s.objectMode || t && t.length > 0) {
"string" == typeof t || s.objectMode || Object.getPrototypeOf(t) === h.prototype || (t = function(e) {
return h.from(e);
}(t));
if (r) s.endEmitted ? e.emit("error", new Error("stream.unshift() after end event")) : w(e, s, t, !0); else if (s.ended) e.emit("error", new Error("stream.push() after EOF")); else {
s.reading = !1;
if (s.decoder && !i) {
t = s.decoder.write(t);
s.objectMode || 0 !== t.length ? w(e, s, t, !1) : A(e, s);
} else w(e, s, t, !1);
}
} else r || (s.reading = !1);
}
return function(e) {
return !e.ended && (e.needReadable || e.length < e.highWaterMark || 0 === e.length);
}(s);
}
function w(e, t, i, r) {
if (t.flowing && 0 === t.length && !t.sync) {
e.emit("data", i);
e.read(0);
} else {
t.length += t.objectMode ? 1 : i.length;
r ? t.buffer.unshift(i) : t.buffer.push(i);
t.needReadable && E(e);
}
A(e, t);
}
v.prototype.isPaused = function() {
return !1 === this._readableState.flowing;
};
v.prototype.setEncoding = function(t) {
p || (p = e("string_decoder/").StringDecoder);
this._readableState.decoder = new p(t);
this._readableState.encoding = t;
return this;
};
var x = 8388608;
function C(e, t) {
if (e <= 0 || 0 === t.length && t.ended) return 0;
if (t.objectMode) return 1;
if (e != e) return t.flowing && t.length ? t.buffer.head.data.length : t.length;
e > t.highWaterMark && (t.highWaterMark = function(e) {
if (e >= x) e = x; else {
e--;
e |= e >>> 1;
e |= e >>> 2;
e |= e >>> 4;
e |= e >>> 8;
e |= e >>> 16;
e++;
}
return e;
}(e));
if (e <= t.length) return e;
if (!t.ended) {
t.needReadable = !0;
return 0;
}
return t.length;
}
v.prototype.read = function(e) {
l("read", e);
e = parseInt(e, 10);
var t = this._readableState, i = e;
0 !== e && (t.emittedReadable = !1);
if (0 === e && t.needReadable && (t.length >= t.highWaterMark || t.ended)) {
l("read: emitReadable", t.length, t.ended);
0 === t.length && t.ended ? B(this) : E(this);
return null;
}
if (0 === (e = C(e, t)) && t.ended) {
0 === t.length && B(this);
return null;
}
var r, n = t.needReadable;
l("need readable", n);
(0 === t.length || t.length - e < t.highWaterMark) && l("length less than watermark", n = !0);
if (t.ended || t.reading) l("reading or ended", n = !1); else if (n) {
l("do read");
t.reading = !0;
t.sync = !0;
0 === t.length && (t.needReadable = !0);
this._read(t.highWaterMark);
t.sync = !1;
t.reading || (e = C(i, t));
}
if (null === (r = e > 0 ? N(e, t) : null)) {
t.needReadable = !0;
e = 0;
} else t.length -= e;
if (0 === t.length) {
t.ended || (t.needReadable = !0);
i !== e && t.ended && B(this);
}
null !== r && this.emit("data", r);
return r;
};
function E(e) {
var t = e._readableState;
t.needReadable = !1;
if (!t.emittedReadable) {
l("emitReadable", t.flowing);
t.emittedReadable = !0;
t.sync ? n.nextTick(S, e) : S(e);
}
}
function S(e) {
l("emit readable");
e.emit("readable");
k(e);
}
function A(e, t) {
if (!t.readingMore) {
t.readingMore = !0;
n.nextTick(D, e, t);
}
}
function D(e, t) {
for (var i = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark; ) {
l("maybeReadMore read 0");
e.read(0);
if (i === t.length) break;
i = t.length;
}
t.readingMore = !1;
}
v.prototype._read = function(e) {
this.emit("error", new Error("_read() is not implemented"));
};
v.prototype.pipe = function(e, t) {
var r = this, s = this._readableState;
switch (s.pipesCount) {
case 0:
s.pipes = e;
break;

case 1:
s.pipes = [ s.pipes, e ];
break;

default:
s.pipes.push(e);
}
s.pipesCount += 1;
l("pipe count=%d opts=%j", s.pipesCount, t);
var c = (!t || !1 !== t.end) && e !== i.stdout && e !== i.stderr ? f : v;
s.endEmitted ? n.nextTick(c) : r.once("end", c);
e.on("unpipe", h);
function h(t, i) {
l("onunpipe");
if (t === r && i && !1 === i.hasUnpiped) {
i.hasUnpiped = !0;
(function() {
l("cleanup");
e.removeListener("close", y);
e.removeListener("finish", m);
e.removeListener("drain", d);
e.removeListener("error", g);
e.removeListener("unpipe", h);
r.removeListener("end", f);
r.removeListener("end", v);
r.removeListener("data", b);
u = !0;
!s.awaitDrain || e._writableState && !e._writableState.needDrain || d();
})();
}
}
function f() {
l("onend");
e.end();
}
var d = function(e) {
return function() {
var t = e._readableState;
l("pipeOnDrain", t.awaitDrain);
t.awaitDrain && t.awaitDrain--;
if (0 === t.awaitDrain && o(e, "data")) {
t.flowing = !0;
k(e);
}
};
}(r);
e.on("drain", d);
var u = !1;
var p = !1;
r.on("data", b);
function b(t) {
l("ondata");
p = !1;
if (!1 === e.write(t) && !p) {
if ((1 === s.pipesCount && s.pipes === e || s.pipesCount > 1 && -1 !== T(s.pipes, e)) && !u) {
l("false write response, pause", r._readableState.awaitDrain);
r._readableState.awaitDrain++;
p = !0;
}
r.pause();
}
}
function g(t) {
l("onerror", t);
v();
e.removeListener("error", g);
0 === o(e, "error") && e.emit("error", t);
}
(function(e, t, i) {
if ("function" == typeof e.prependListener) return e.prependListener(t, i);
e._events && e._events[t] ? a(e._events[t]) ? e._events[t].unshift(i) : e._events[t] = [ i, e._events[t] ] : e.on(t, i);
})(e, "error", g);
function y() {
e.removeListener("finish", m);
v();
}
e.once("close", y);
function m() {
l("onfinish");
e.removeListener("close", y);
v();
}
e.once("finish", m);
function v() {
l("unpipe");
r.unpipe(e);
}
e.emit("pipe", r);
if (!s.flowing) {
l("pipe resume");
r.resume();
}
return e;
};
v.prototype.unpipe = function(e) {
var t = this._readableState, i = {
hasUnpiped: !1
};
if (0 === t.pipesCount) return this;
if (1 === t.pipesCount) {
if (e && e !== t.pipes) return this;
e || (e = t.pipes);
t.pipes = null;
t.pipesCount = 0;
t.flowing = !1;
e && e.emit("unpipe", this, i);
return this;
}
if (!e) {
var r = t.pipes, n = t.pipesCount;
t.pipes = null;
t.pipesCount = 0;
t.flowing = !1;
for (var s = 0; s < n; s++) r[s].emit("unpipe", this, i);
return this;
}
var a = T(t.pipes, e);
if (-1 === a) return this;
t.pipes.splice(a, 1);
t.pipesCount -= 1;
1 === t.pipesCount && (t.pipes = t.pipes[0]);
e.emit("unpipe", this, i);
return this;
};
v.prototype.on = function(e, t) {
var i = c.prototype.on.call(this, e, t);
if ("data" === e) !1 !== this._readableState.flowing && this.resume(); else if ("readable" === e) {
var r = this._readableState;
if (!r.endEmitted && !r.readableListening) {
r.readableListening = r.needReadable = !0;
r.emittedReadable = !1;
r.reading ? r.length && E(this) : n.nextTick(R, this);
}
}
return i;
};
v.prototype.addListener = v.prototype.on;
function R(e) {
l("readable nexttick read 0");
e.read(0);
}
v.prototype.resume = function() {
var e = this._readableState;
if (!e.flowing) {
l("resume");
e.flowing = !0;
(function(e, t) {
if (!t.resumeScheduled) {
t.resumeScheduled = !0;
n.nextTick(M, e, t);
}
})(this, e);
}
return this;
};
function M(e, t) {
if (!t.reading) {
l("resume read 0");
e.read(0);
}
t.resumeScheduled = !1;
t.awaitDrain = 0;
e.emit("resume");
k(e);
t.flowing && !t.reading && e.read(0);
}
v.prototype.pause = function() {
l("call pause flowing=%j", this._readableState.flowing);
if (!1 !== this._readableState.flowing) {
l("pause");
this._readableState.flowing = !1;
this.emit("pause");
}
return this;
};
function k(e) {
var t = e._readableState;
l("flow", t.flowing);
for (;t.flowing && null !== e.read(); ) ;
}
v.prototype.wrap = function(e) {
var t = this, i = this._readableState, r = !1;
e.on("end", function() {
l("wrapped end");
if (i.decoder && !i.ended) {
var e = i.decoder.end();
e && e.length && t.push(e);
}
t.push(null);
});
e.on("data", function(n) {
l("wrapped data");
i.decoder && (n = i.decoder.write(n));
if ((!i.objectMode || null !== n && void 0 !== n) && (i.objectMode || n && n.length)) {
if (!t.push(n)) {
r = !0;
e.pause();
}
}
});
for (var n in e) void 0 === this[n] && "function" == typeof e[n] && (this[n] = function(t) {
return function() {
return e[t].apply(e, arguments);
};
}(n));
for (var s = 0; s < y.length; s++) e.on(y[s], this.emit.bind(this, y[s]));
this._read = function(t) {
l("wrapped _read", t);
if (r) {
r = !1;
e.resume();
}
};
return this;
};
Object.defineProperty(v.prototype, "readableHighWaterMark", {
enumerable: !1,
get: function() {
return this._readableState.highWaterMark;
}
});
v._fromList = N;
function N(e, t) {
if (0 === t.length) return null;
var i;
if (t.objectMode) i = t.buffer.shift(); else if (!e || e >= t.length) {
i = t.decoder ? t.buffer.join("") : 1 === t.buffer.length ? t.buffer.head.data : t.buffer.concat(t.length);
t.buffer.clear();
} else i = function(e, t, i) {
var r;
if (e < t.head.data.length) {
r = t.head.data.slice(0, e);
t.head.data = t.head.data.slice(e);
} else r = e === t.head.data.length ? t.shift() : i ? function(e, t) {
var i = t.head, r = 1, n = i.data;
e -= n.length;
for (;i = i.next; ) {
var s = i.data, a = e > s.length ? s.length : e;
a === s.length ? n += s : n += s.slice(0, e);
if (0 === (e -= a)) {
if (a === s.length) {
++r;
i.next ? t.head = i.next : t.head = t.tail = null;
} else {
t.head = i;
i.data = s.slice(a);
}
break;
}
++r;
}
t.length -= r;
return n;
}(e, t) : function(e, t) {
var i = h.allocUnsafe(e), r = t.head, n = 1;
r.data.copy(i);
e -= r.data.length;
for (;r = r.next; ) {
var s = r.data, a = e > s.length ? s.length : e;
s.copy(i, i.length - e, 0, a);
if (0 === (e -= a)) {
if (a === s.length) {
++n;
r.next ? t.head = r.next : t.head = t.tail = null;
} else {
t.head = r;
r.data = s.slice(a);
}
break;
}
++n;
}
t.length -= n;
return i;
}(e, t);
return r;
}(e, t.buffer, t.decoder);
return i;
}
function B(e) {
var t = e._readableState;
if (t.length > 0) throw new Error('"endReadable()" called on non-empty stream');
if (!t.endEmitted) {
t.ended = !0;
n.nextTick(L, t, e);
}
}
function L(e, t) {
if (!e.endEmitted && 0 === e.length) {
e.endEmitted = !0;
t.readable = !1;
t.emit("end");
}
}
function T(e, t) {
for (var i = 0, r = e.length; i < r; i++) if (e[i] === t) return i;
return -1;
}
}).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
}, {
"./_stream_duplex": 128,
"./internal/streams/BufferList": 133,
"./internal/streams/destroy": 134,
"./internal/streams/stream": 135,
_process: 118,
"core-util-is": 50,
events: 83,
inherits: 101,
isarray: 136,
"process-nextick-args": 117,
"safe-buffer": 143,
"string_decoder/": 137,
util: 18
} ],
131: [ function(e, t, i) {
"use strict";
t.exports = s;
var r = e("./_stream_duplex"), n = e("core-util-is");
n.inherits = e("inherits");
n.inherits(s, r);
function s(e) {
if (!(this instanceof s)) return new s(e);
r.call(this, e);
this._transformState = {
afterTransform: function(e, t) {
var i = this._transformState;
i.transforming = !1;
var r = i.writecb;
if (!r) return this.emit("error", new Error("write callback called multiple times"));
i.writechunk = null;
i.writecb = null;
null != t && this.push(t);
r(e);
var n = this._readableState;
n.reading = !1;
(n.needReadable || n.length < n.highWaterMark) && this._read(n.highWaterMark);
}.bind(this),
needTransform: !1,
transforming: !1,
writecb: null,
writechunk: null,
writeencoding: null
};
this._readableState.needReadable = !0;
this._readableState.sync = !1;
if (e) {
"function" == typeof e.transform && (this._transform = e.transform);
"function" == typeof e.flush && (this._flush = e.flush);
}
this.on("prefinish", a);
}
function a() {
var e = this;
"function" == typeof this._flush ? this._flush(function(t, i) {
o(e, t, i);
}) : o(this, null, null);
}
s.prototype.push = function(e, t) {
this._transformState.needTransform = !1;
return r.prototype.push.call(this, e, t);
};
s.prototype._transform = function(e, t, i) {
throw new Error("_transform() is not implemented");
};
s.prototype._write = function(e, t, i) {
var r = this._transformState;
r.writecb = i;
r.writechunk = e;
r.writeencoding = t;
if (!r.transforming) {
var n = this._readableState;
(r.needTransform || n.needReadable || n.length < n.highWaterMark) && this._read(n.highWaterMark);
}
};
s.prototype._read = function(e) {
var t = this._transformState;
if (null !== t.writechunk && t.writecb && !t.transforming) {
t.transforming = !0;
this._transform(t.writechunk, t.writeencoding, t.afterTransform);
} else t.needTransform = !0;
};
s.prototype._destroy = function(e, t) {
var i = this;
r.prototype._destroy.call(this, e, function(e) {
t(e);
i.emit("close");
});
};
function o(e, t, i) {
if (t) return e.emit("error", t);
null != i && e.push(i);
if (e._writableState.length) throw new Error("Calling transform done when ws.length != 0");
if (e._transformState.transforming) throw new Error("Calling transform done when still transforming");
return e.push(null);
}
}, {
"./_stream_duplex": 128,
"core-util-is": 50,
inherits: 101
} ],
132: [ function(e, t, i) {
(function(i, r) {
"use strict";
var n = e("process-nextick-args");
t.exports = y;
function s(e) {
var t = this;
this.next = null;
this.entry = null;
this.finish = function() {
(function(e, t, i) {
var r = e.entry;
e.entry = null;
for (;r; ) {
var n = r.callback;
t.pendingcb--;
n(i);
r = r.next;
}
t.corkedRequestsFree ? t.corkedRequestsFree.next = e : t.corkedRequestsFree = e;
})(t, e);
};
}
var a, o = !i.browser && [ "v0.10", "v0.9." ].indexOf(i.version.slice(0, 5)) > -1 ? setImmediate : n.nextTick;
y.WritableState = g;
var c = e("core-util-is");
c.inherits = e("inherits");
var h = {
deprecate: e("util-deprecate")
}, f = e("./internal/streams/stream"), d = e("safe-buffer").Buffer, u = r.Uint8Array || function() {};
var l, p = e("./internal/streams/destroy");
c.inherits(y, f);
function b() {}
function g(t, i) {
a = a || e("./_stream_duplex");
t = t || {};
var r = i instanceof a;
this.objectMode = !!t.objectMode;
r && (this.objectMode = this.objectMode || !!t.writableObjectMode);
var c = t.highWaterMark, h = t.writableHighWaterMark, f = this.objectMode ? 16 : 16384;
this.highWaterMark = c || 0 === c ? c : r && (h || 0 === h) ? h : f;
this.highWaterMark = Math.floor(this.highWaterMark);
this.finalCalled = !1;
this.needDrain = !1;
this.ending = !1;
this.ended = !1;
this.finished = !1;
this.destroyed = !1;
var d = !1 === t.decodeStrings;
this.decodeStrings = !d;
this.defaultEncoding = t.defaultEncoding || "utf8";
this.length = 0;
this.writing = !1;
this.corked = 0;
this.sync = !0;
this.bufferProcessing = !1;
this.onwrite = function(e) {
(function(e, t) {
var i = e._writableState, r = i.sync, s = i.writecb;
(function(e) {
e.writing = !1;
e.writecb = null;
e.length -= e.writelen;
e.writelen = 0;
})(i);
if (t) (function(e, t, i, r, s) {
--t.pendingcb;
if (i) {
n.nextTick(s, r);
n.nextTick(C, e, t);
e._writableState.errorEmitted = !0;
e.emit("error", r);
} else {
s(r);
e._writableState.errorEmitted = !0;
e.emit("error", r);
C(e, t);
}
})(e, i, r, t, s); else {
var a = w(i);
a || i.corked || i.bufferProcessing || !i.bufferedRequest || _(e, i);
r ? o(v, e, i, a, s) : v(e, i, a, s);
}
})(i, e);
};
this.writecb = null;
this.writelen = 0;
this.bufferedRequest = null;
this.lastBufferedRequest = null;
this.pendingcb = 0;
this.prefinished = !1;
this.errorEmitted = !1;
this.bufferedRequestCount = 0;
this.corkedRequestsFree = new s(this);
}
g.prototype.getBuffer = function() {
for (var e = this.bufferedRequest, t = []; e; ) {
t.push(e);
e = e.next;
}
return t;
};
(function() {
try {
Object.defineProperty(g.prototype, "buffer", {
get: h.deprecate(function() {
return this.getBuffer();
}, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
});
} catch (e) {}
})();
if ("function" == typeof Symbol && Symbol.hasInstance && "function" == typeof Function.prototype[Symbol.hasInstance]) {
l = Function.prototype[Symbol.hasInstance];
Object.defineProperty(y, Symbol.hasInstance, {
value: function(e) {
return !!l.call(this, e) || this === y && (e && e._writableState instanceof g);
}
});
} else l = function(e) {
return e instanceof this;
};
function y(t) {
a = a || e("./_stream_duplex");
if (!(l.call(y, this) || this instanceof a)) return new y(t);
this._writableState = new g(t, this);
this.writable = !0;
if (t) {
"function" == typeof t.write && (this._write = t.write);
"function" == typeof t.writev && (this._writev = t.writev);
"function" == typeof t.destroy && (this._destroy = t.destroy);
"function" == typeof t.final && (this._final = t.final);
}
f.call(this);
}
y.prototype.pipe = function() {
this.emit("error", new Error("Cannot pipe, not readable"));
};
y.prototype.write = function(e, t, i) {
var r = this._writableState, s = !1, a = !r.objectMode && function(e) {
return d.isBuffer(e) || e instanceof u;
}(e);
a && !d.isBuffer(e) && (e = function(e) {
return d.from(e);
}(e));
if ("function" == typeof t) {
i = t;
t = null;
}
a ? t = "buffer" : t || (t = r.defaultEncoding);
"function" != typeof i && (i = b);
if (r.ended) (function(e, t) {
var i = new Error("write after end");
e.emit("error", i);
n.nextTick(t, i);
})(this, i); else if (a || function(e, t, i, r) {
var s = !0, a = !1;
null === i ? a = new TypeError("May not write null values to stream") : "string" == typeof i || void 0 === i || t.objectMode || (a = new TypeError("Invalid non-string/buffer chunk"));
if (a) {
e.emit("error", a);
n.nextTick(r, a);
s = !1;
}
return s;
}(this, r, e, i)) {
r.pendingcb++;
s = function(e, t, i, r, n, s) {
if (!i) {
var a = function(e, t, i) {
e.objectMode || !1 === e.decodeStrings || "string" != typeof t || (t = d.from(t, i));
return t;
}(t, r, n);
if (r !== a) {
i = !0;
n = "buffer";
r = a;
}
}
var o = t.objectMode ? 1 : r.length;
t.length += o;
var c = t.length < t.highWaterMark;
c || (t.needDrain = !0);
if (t.writing || t.corked) {
var h = t.lastBufferedRequest;
t.lastBufferedRequest = {
chunk: r,
encoding: n,
isBuf: i,
callback: s,
next: null
};
h ? h.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest;
t.bufferedRequestCount += 1;
} else m(e, t, !1, o, r, n, s);
return c;
}(this, r, a, e, t, i);
}
return s;
};
y.prototype.cork = function() {
this._writableState.corked++;
};
y.prototype.uncork = function() {
var e = this._writableState;
if (e.corked) {
e.corked--;
e.writing || e.corked || e.finished || e.bufferProcessing || !e.bufferedRequest || _(this, e);
}
};
y.prototype.setDefaultEncoding = function(e) {
"string" == typeof e && (e = e.toLowerCase());
if (!([ "hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw" ].indexOf((e + "").toLowerCase()) > -1)) throw new TypeError("Unknown encoding: " + e);
this._writableState.defaultEncoding = e;
return this;
};
Object.defineProperty(y.prototype, "writableHighWaterMark", {
enumerable: !1,
get: function() {
return this._writableState.highWaterMark;
}
});
function m(e, t, i, r, n, s, a) {
t.writelen = r;
t.writecb = a;
t.writing = !0;
t.sync = !0;
i ? e._writev(n, t.onwrite) : e._write(n, s, t.onwrite);
t.sync = !1;
}
function v(e, t, i, r) {
i || function(e, t) {
if (0 === t.length && t.needDrain) {
t.needDrain = !1;
e.emit("drain");
}
}(e, t);
t.pendingcb--;
r();
C(e, t);
}
function _(e, t) {
t.bufferProcessing = !0;
var i = t.bufferedRequest;
if (e._writev && i && i.next) {
var r = t.bufferedRequestCount, n = new Array(r), a = t.corkedRequestsFree;
a.entry = i;
for (var o = 0, c = !0; i; ) {
n[o] = i;
i.isBuf || (c = !1);
i = i.next;
o += 1;
}
n.allBuffers = c;
m(e, t, !0, t.length, n, "", a.finish);
t.pendingcb++;
t.lastBufferedRequest = null;
if (a.next) {
t.corkedRequestsFree = a.next;
a.next = null;
} else t.corkedRequestsFree = new s(t);
t.bufferedRequestCount = 0;
} else {
for (;i; ) {
var h = i.chunk, f = i.encoding, d = i.callback;
m(e, t, !1, t.objectMode ? 1 : h.length, h, f, d);
i = i.next;
t.bufferedRequestCount--;
if (t.writing) break;
}
null === i && (t.lastBufferedRequest = null);
}
t.bufferedRequest = i;
t.bufferProcessing = !1;
}
y.prototype._write = function(e, t, i) {
i(new Error("_write() is not implemented"));
};
y.prototype._writev = null;
y.prototype.end = function(e, t, i) {
var r = this._writableState;
if ("function" == typeof e) {
i = e;
e = null;
t = null;
} else if ("function" == typeof t) {
i = t;
t = null;
}
null !== e && void 0 !== e && this.write(e, t);
if (r.corked) {
r.corked = 1;
this.uncork();
}
r.ending || r.finished || function(e, t, i) {
t.ending = !0;
C(e, t);
i && (t.finished ? n.nextTick(i) : e.once("finish", i));
t.ended = !0;
e.writable = !1;
}(this, r, i);
};
function w(e) {
return e.ending && 0 === e.length && null === e.bufferedRequest && !e.finished && !e.writing;
}
function x(e, t) {
e._final(function(i) {
t.pendingcb--;
i && e.emit("error", i);
t.prefinished = !0;
e.emit("prefinish");
C(e, t);
});
}
function C(e, t) {
var i = w(t);
if (i) {
(function(e, t) {
if (!t.prefinished && !t.finalCalled) if ("function" == typeof e._final) {
t.pendingcb++;
t.finalCalled = !0;
n.nextTick(x, e, t);
} else {
t.prefinished = !0;
e.emit("prefinish");
}
})(e, t);
if (0 === t.pendingcb) {
t.finished = !0;
e.emit("finish");
}
}
return i;
}
Object.defineProperty(y.prototype, "destroyed", {
get: function() {
return void 0 !== this._writableState && this._writableState.destroyed;
},
set: function(e) {
this._writableState && (this._writableState.destroyed = e);
}
});
y.prototype.destroy = p.destroy;
y.prototype._undestroy = p.undestroy;
y.prototype._destroy = function(e, t) {
this.end();
t(e);
};
}).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
}, {
"./_stream_duplex": 128,
"./internal/streams/destroy": 134,
"./internal/streams/stream": 135,
_process: 118,
"core-util-is": 50,
inherits: 101,
"process-nextick-args": 117,
"safe-buffer": 143,
"util-deprecate": 154
} ],
133: [ function(e, t, i) {
"use strict";
var r = e("safe-buffer").Buffer, n = e("util");
function s(e, t, i) {
e.copy(t, i);
}
t.exports = function() {
function e() {
(function(e, t) {
if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
})(this, e);
this.head = null;
this.tail = null;
this.length = 0;
}
e.prototype.push = function(e) {
var t = {
data: e,
next: null
};
this.length > 0 ? this.tail.next = t : this.head = t;
this.tail = t;
++this.length;
};
e.prototype.unshift = function(e) {
var t = {
data: e,
next: this.head
};
0 === this.length && (this.tail = t);
this.head = t;
++this.length;
};
e.prototype.shift = function() {
if (0 !== this.length) {
var e = this.head.data;
1 === this.length ? this.head = this.tail = null : this.head = this.head.next;
--this.length;
return e;
}
};
e.prototype.clear = function() {
this.head = this.tail = null;
this.length = 0;
};
e.prototype.join = function(e) {
if (0 === this.length) return "";
for (var t = this.head, i = "" + t.data; t = t.next; ) i += e + t.data;
return i;
};
e.prototype.concat = function(e) {
if (0 === this.length) return r.alloc(0);
if (1 === this.length) return this.head.data;
for (var t = r.allocUnsafe(e >>> 0), i = this.head, n = 0; i; ) {
s(i.data, t, n);
n += i.data.length;
i = i.next;
}
return t;
};
return e;
}();
n && n.inspect && n.inspect.custom && (t.exports.prototype[n.inspect.custom] = function() {
var e = n.inspect({
length: this.length
});
return this.constructor.name + " " + e;
});
}, {
"safe-buffer": 143,
util: 18
} ],
134: [ function(e, t, i) {
"use strict";
var r = e("process-nextick-args");
function n(e, t) {
e.emit("error", t);
}
t.exports = {
destroy: function(e, t) {
var i = this, s = this._readableState && this._readableState.destroyed, a = this._writableState && this._writableState.destroyed;
if (s || a) {
t ? t(e) : !e || this._writableState && this._writableState.errorEmitted || r.nextTick(n, this, e);
return this;
}
this._readableState && (this._readableState.destroyed = !0);
this._writableState && (this._writableState.destroyed = !0);
this._destroy(e || null, function(e) {
if (!t && e) {
r.nextTick(n, i, e);
i._writableState && (i._writableState.errorEmitted = !0);
} else t && t(e);
});
return this;
},
undestroy: function() {
if (this._readableState) {
this._readableState.destroyed = !1;
this._readableState.reading = !1;
this._readableState.ended = !1;
this._readableState.endEmitted = !1;
}
if (this._writableState) {
this._writableState.destroyed = !1;
this._writableState.ended = !1;
this._writableState.ending = !1;
this._writableState.finished = !1;
this._writableState.errorEmitted = !1;
}
}
};
}, {
"process-nextick-args": 117
} ],
135: [ function(e, t, i) {
t.exports = e("events").EventEmitter;
}, {
events: 83
} ],
136: [ function(e, t, i) {
arguments[4][48][0].apply(i, arguments);
}, {
dup: 48
} ],
137: [ function(e, t, i) {
"use strict";
var r = e("safe-buffer").Buffer, n = r.isEncoding || function(e) {
switch ((e = "" + e) && e.toLowerCase()) {
case "hex":
case "utf8":
case "utf-8":
case "ascii":
case "binary":
case "base64":
case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
case "raw":
return !0;

default:
return !1;
}
};
i.StringDecoder = s;
function s(e) {
this.encoding = function(e) {
var t = function(e) {
if (!e) return "utf8";
for (var t; ;) switch (e) {
case "utf8":
case "utf-8":
return "utf8";

case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return "utf16le";

case "latin1":
case "binary":
return "latin1";

case "base64":
case "ascii":
case "hex":
return e;

default:
if (t) return;
e = ("" + e).toLowerCase();
t = !0;
}
}(e);
if ("string" != typeof t && (r.isEncoding === n || !n(e))) throw new Error("Unknown encoding: " + e);
return t || e;
}(e);
var t;
switch (this.encoding) {
case "utf16le":
this.text = c;
this.end = h;
t = 4;
break;

case "utf8":
this.fillLast = o;
t = 4;
break;

case "base64":
this.text = f;
this.end = d;
t = 3;
break;

default:
this.write = u;
this.end = l;
return;
}
this.lastNeed = 0;
this.lastTotal = 0;
this.lastChar = r.allocUnsafe(t);
}
s.prototype.write = function(e) {
if (0 === e.length) return "";
var t, i;
if (this.lastNeed) {
if (void 0 === (t = this.fillLast(e))) return "";
i = this.lastNeed;
this.lastNeed = 0;
} else i = 0;
return i < e.length ? t ? t + this.text(e, i) : this.text(e, i) : t || "";
};
s.prototype.end = function(e) {
var t = e && e.length ? this.write(e) : "";
return this.lastNeed ? t + "�" : t;
};
s.prototype.text = function(e, t) {
var i = function(e, t, i) {
var r = t.length - 1;
if (r < i) return 0;
var n = a(t[r]);
if (n >= 0) {
n > 0 && (e.lastNeed = n - 1);
return n;
}
if (--r < i || -2 === n) return 0;
if ((n = a(t[r])) >= 0) {
n > 0 && (e.lastNeed = n - 2);
return n;
}
if (--r < i || -2 === n) return 0;
if ((n = a(t[r])) >= 0) {
n > 0 && (2 === n ? n = 0 : e.lastNeed = n - 3);
return n;
}
return 0;
}(this, e, t);
if (!this.lastNeed) return e.toString("utf8", t);
this.lastTotal = i;
var r = e.length - (i - this.lastNeed);
e.copy(this.lastChar, 0, r);
return e.toString("utf8", t, r);
};
s.prototype.fillLast = function(e) {
if (this.lastNeed <= e.length) {
e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
return this.lastChar.toString(this.encoding, 0, this.lastTotal);
}
e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e.length);
this.lastNeed -= e.length;
};
function a(e) {
return e <= 127 ? 0 : e >> 5 == 6 ? 2 : e >> 4 == 14 ? 3 : e >> 3 == 30 ? 4 : e >> 6 == 2 ? -1 : -2;
}
function o(e) {
var t = this.lastTotal - this.lastNeed, i = function(e, t, i) {
if (128 != (192 & t[0])) {
e.lastNeed = 0;
return "�";
}
if (e.lastNeed > 1 && t.length > 1) {
if (128 != (192 & t[1])) {
e.lastNeed = 1;
return "�";
}
if (e.lastNeed > 2 && t.length > 2 && 128 != (192 & t[2])) {
e.lastNeed = 2;
return "�";
}
}
}(this, e);
if (void 0 !== i) return i;
if (this.lastNeed <= e.length) {
e.copy(this.lastChar, t, 0, this.lastNeed);
return this.lastChar.toString(this.encoding, 0, this.lastTotal);
}
e.copy(this.lastChar, t, 0, e.length);
this.lastNeed -= e.length;
}
function c(e, t) {
if ((e.length - t) % 2 == 0) {
var i = e.toString("utf16le", t);
if (i) {
var r = i.charCodeAt(i.length - 1);
if (r >= 55296 && r <= 56319) {
this.lastNeed = 2;
this.lastTotal = 4;
this.lastChar[0] = e[e.length - 2];
this.lastChar[1] = e[e.length - 1];
return i.slice(0, -1);
}
}
return i;
}
this.lastNeed = 1;
this.lastTotal = 2;
this.lastChar[0] = e[e.length - 1];
return e.toString("utf16le", t, e.length - 1);
}
function h(e) {
var t = e && e.length ? this.write(e) : "";
if (this.lastNeed) {
var i = this.lastTotal - this.lastNeed;
return t + this.lastChar.toString("utf16le", 0, i);
}
return t;
}
function f(e, t) {
var i = (e.length - t) % 3;
if (0 === i) return e.toString("base64", t);
this.lastNeed = 3 - i;
this.lastTotal = 3;
if (1 === i) this.lastChar[0] = e[e.length - 1]; else {
this.lastChar[0] = e[e.length - 2];
this.lastChar[1] = e[e.length - 1];
}
return e.toString("base64", t, e.length - i);
}
function d(e) {
var t = e && e.length ? this.write(e) : "";
return this.lastNeed ? t + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : t;
}
function u(e) {
return e.toString(this.encoding);
}
function l(e) {
return e && e.length ? this.write(e) : "";
}
}, {
"safe-buffer": 143
} ],
138: [ function(e, t, i) {
t.exports = e("./readable").PassThrough;
}, {
"./readable": 139
} ],
139: [ function(e, t, i) {
(i = t.exports = e("./lib/_stream_readable.js")).Stream = i;
i.Readable = i;
i.Writable = e("./lib/_stream_writable.js");
i.Duplex = e("./lib/_stream_duplex.js");
i.Transform = e("./lib/_stream_transform.js");
i.PassThrough = e("./lib/_stream_passthrough.js");
}, {
"./lib/_stream_duplex.js": 128,
"./lib/_stream_passthrough.js": 129,
"./lib/_stream_readable.js": 130,
"./lib/_stream_transform.js": 131,
"./lib/_stream_writable.js": 132
} ],
140: [ function(e, t, i) {
t.exports = e("./readable").Transform;
}, {
"./readable": 139
} ],
141: [ function(e, t, i) {
t.exports = e("./lib/_stream_writable.js");
}, {
"./lib/_stream_writable.js": 132
} ],
142: [ function(e, t, i) {
"use strict";
var r = e("buffer").Buffer, n = e("inherits"), s = e("hash-base"), a = new Array(16), o = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13 ], c = [ 5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11 ], h = [ 11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6 ], f = [ 8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11 ], d = [ 0, 1518500249, 1859775393, 2400959708, 2840853838 ], u = [ 1352829926, 1548603684, 1836072691, 2053994217, 0 ];
function l() {
s.call(this, 64);
this._a = 1732584193;
this._b = 4023233417;
this._c = 2562383102;
this._d = 271733878;
this._e = 3285377520;
}
n(l, s);
l.prototype._update = function() {
for (var e = a, t = 0; t < 16; ++t) e[t] = this._block.readInt32LE(4 * t);
for (var i = 0 | this._a, r = 0 | this._b, n = 0 | this._c, s = 0 | this._d, l = 0 | this._e, _ = 0 | this._a, w = 0 | this._b, x = 0 | this._c, C = 0 | this._d, E = 0 | this._e, S = 0; S < 80; S += 1) {
var A, D;
if (S < 16) {
A = b(i, r, n, s, l, e[o[S]], d[0], h[S]);
D = v(_, w, x, C, E, e[c[S]], u[0], f[S]);
} else if (S < 32) {
A = g(i, r, n, s, l, e[o[S]], d[1], h[S]);
D = m(_, w, x, C, E, e[c[S]], u[1], f[S]);
} else if (S < 48) {
A = y(i, r, n, s, l, e[o[S]], d[2], h[S]);
D = y(_, w, x, C, E, e[c[S]], u[2], f[S]);
} else if (S < 64) {
A = m(i, r, n, s, l, e[o[S]], d[3], h[S]);
D = g(_, w, x, C, E, e[c[S]], u[3], f[S]);
} else {
A = v(i, r, n, s, l, e[o[S]], d[4], h[S]);
D = b(_, w, x, C, E, e[c[S]], u[4], f[S]);
}
i = l;
l = s;
s = p(n, 10);
n = r;
r = A;
_ = E;
E = C;
C = p(x, 10);
x = w;
w = D;
}
var R = this._b + n + C | 0;
this._b = this._c + s + E | 0;
this._c = this._d + l + _ | 0;
this._d = this._e + i + w | 0;
this._e = this._a + r + x | 0;
this._a = R;
};
l.prototype._digest = function() {
this._block[this._blockOffset++] = 128;
if (this._blockOffset > 56) {
this._block.fill(0, this._blockOffset, 64);
this._update();
this._blockOffset = 0;
}
this._block.fill(0, this._blockOffset, 56);
this._block.writeUInt32LE(this._length[0], 56);
this._block.writeUInt32LE(this._length[1], 60);
this._update();
var e = r.alloc ? r.alloc(20) : new r(20);
e.writeInt32LE(this._a, 0);
e.writeInt32LE(this._b, 4);
e.writeInt32LE(this._c, 8);
e.writeInt32LE(this._d, 12);
e.writeInt32LE(this._e, 16);
return e;
};
function p(e, t) {
return e << t | e >>> 32 - t;
}
function b(e, t, i, r, n, s, a, o) {
return p(e + (t ^ i ^ r) + s + a | 0, o) + n | 0;
}
function g(e, t, i, r, n, s, a, o) {
return p(e + (t & i | ~t & r) + s + a | 0, o) + n | 0;
}
function y(e, t, i, r, n, s, a, o) {
return p(e + ((t | ~i) ^ r) + s + a | 0, o) + n | 0;
}
function m(e, t, i, r, n, s, a, o) {
return p(e + (t & r | i & ~r) + s + a | 0, o) + n | 0;
}
function v(e, t, i, r, n, s, a, o) {
return p(e + (t ^ (i | ~r)) + s + a | 0, o) + n | 0;
}
t.exports = l;
}, {
buffer: 47,
"hash-base": 85,
inherits: 101
} ],
143: [ function(e, t, i) {
var r = e("buffer"), n = r.Buffer;
function s(e, t) {
for (var i in e) t[i] = e[i];
}
if (n.from && n.alloc && n.allocUnsafe && n.allocUnsafeSlow) t.exports = r; else {
s(r, i);
i.Buffer = a;
}
function a(e, t, i) {
return n(e, t, i);
}
s(n, a);
a.from = function(e, t, i) {
if ("number" == typeof e) throw new TypeError("Argument must not be a number");
return n(e, t, i);
};
a.alloc = function(e, t, i) {
if ("number" != typeof e) throw new TypeError("Argument must be a number");
var r = n(e);
void 0 !== t ? "string" == typeof i ? r.fill(t, i) : r.fill(t) : r.fill(0);
return r;
};
a.allocUnsafe = function(e) {
if ("number" != typeof e) throw new TypeError("Argument must be a number");
return n(e);
};
a.allocUnsafeSlow = function(e) {
if ("number" != typeof e) throw new TypeError("Argument must be a number");
return r.SlowBuffer(e);
};
}, {
buffer: 47
} ],
144: [ function(e, t, i) {
var r = e("safe-buffer").Buffer;
function n(e, t) {
this._block = r.alloc(e);
this._finalSize = t;
this._blockSize = e;
this._len = 0;
}
n.prototype.update = function(e, t) {
if ("string" == typeof e) {
t = t || "utf8";
e = r.from(e, t);
}
for (var i = this._block, n = this._blockSize, s = e.length, a = this._len, o = 0; o < s; ) {
for (var c = a % n, h = Math.min(s - o, n - c), f = 0; f < h; f++) i[c + f] = e[o + f];
o += h;
(a += h) % n == 0 && this._update(i);
}
this._len += s;
return this;
};
n.prototype.digest = function(e) {
var t = this._len % this._blockSize;
this._block[t] = 128;
this._block.fill(0, t + 1);
if (t >= this._finalSize) {
this._update(this._block);
this._block.fill(0);
}
var i = 8 * this._len;
if (i <= 4294967295) this._block.writeUInt32BE(i, this._blockSize - 4); else {
var r = (4294967295 & i) >>> 0, n = (i - r) / 4294967296;
this._block.writeUInt32BE(n, this._blockSize - 8);
this._block.writeUInt32BE(r, this._blockSize - 4);
}
this._update(this._block);
var s = this._hash();
return e ? s.toString(e) : s;
};
n.prototype._update = function() {
throw new Error("_update must be implemented by subclass");
};
t.exports = n;
}, {
"safe-buffer": 143
} ],
145: [ function(e, t, i) {
(i = t.exports = function(e) {
e = e.toLowerCase();
var t = i[e];
if (!t) throw new Error(e + " is not supported (we accept pull requests)");
return new t();
}).sha = e("./sha");
i.sha1 = e("./sha1");
i.sha224 = e("./sha224");
i.sha256 = e("./sha256");
i.sha384 = e("./sha384");
i.sha512 = e("./sha512");
}, {
"./sha": 146,
"./sha1": 147,
"./sha224": 148,
"./sha256": 149,
"./sha384": 150,
"./sha512": 151
} ],
146: [ function(e, t, i) {
var r = e("inherits"), n = e("./hash"), s = e("safe-buffer").Buffer, a = [ 1518500249, 1859775393, -1894007588, -899497514 ], o = new Array(80);
function c() {
this.init();
this._w = o;
n.call(this, 64, 56);
}
r(c, n);
c.prototype.init = function() {
this._a = 1732584193;
this._b = 4023233417;
this._c = 2562383102;
this._d = 271733878;
this._e = 3285377520;
return this;
};
function h(e) {
return e << 5 | e >>> 27;
}
function f(e) {
return e << 30 | e >>> 2;
}
function d(e, t, i, r) {
return 0 === e ? t & i | ~t & r : 2 === e ? t & i | t & r | i & r : t ^ i ^ r;
}
c.prototype._update = function(e) {
for (var t = this._w, i = 0 | this._a, r = 0 | this._b, n = 0 | this._c, s = 0 | this._d, o = 0 | this._e, c = 0; c < 16; ++c) t[c] = e.readInt32BE(4 * c);
for (;c < 80; ++c) t[c] = t[c - 3] ^ t[c - 8] ^ t[c - 14] ^ t[c - 16];
for (var u = 0; u < 80; ++u) {
var l = ~~(u / 20), p = h(i) + d(l, r, n, s) + o + t[u] + a[l] | 0;
o = s;
s = n;
n = f(r);
r = i;
i = p;
}
this._a = i + this._a | 0;
this._b = r + this._b | 0;
this._c = n + this._c | 0;
this._d = s + this._d | 0;
this._e = o + this._e | 0;
};
c.prototype._hash = function() {
var e = s.allocUnsafe(20);
e.writeInt32BE(0 | this._a, 0);
e.writeInt32BE(0 | this._b, 4);
e.writeInt32BE(0 | this._c, 8);
e.writeInt32BE(0 | this._d, 12);
e.writeInt32BE(0 | this._e, 16);
return e;
};
t.exports = c;
}, {
"./hash": 144,
inherits: 101,
"safe-buffer": 143
} ],
147: [ function(e, t, i) {
var r = e("inherits"), n = e("./hash"), s = e("safe-buffer").Buffer, a = [ 1518500249, 1859775393, -1894007588, -899497514 ], o = new Array(80);
function c() {
this.init();
this._w = o;
n.call(this, 64, 56);
}
r(c, n);
c.prototype.init = function() {
this._a = 1732584193;
this._b = 4023233417;
this._c = 2562383102;
this._d = 271733878;
this._e = 3285377520;
return this;
};
function h(e) {
return e << 1 | e >>> 31;
}
function f(e) {
return e << 5 | e >>> 27;
}
function d(e) {
return e << 30 | e >>> 2;
}
function u(e, t, i, r) {
return 0 === e ? t & i | ~t & r : 2 === e ? t & i | t & r | i & r : t ^ i ^ r;
}
c.prototype._update = function(e) {
for (var t = this._w, i = 0 | this._a, r = 0 | this._b, n = 0 | this._c, s = 0 | this._d, o = 0 | this._e, c = 0; c < 16; ++c) t[c] = e.readInt32BE(4 * c);
for (;c < 80; ++c) t[c] = h(t[c - 3] ^ t[c - 8] ^ t[c - 14] ^ t[c - 16]);
for (var l = 0; l < 80; ++l) {
var p = ~~(l / 20), b = f(i) + u(p, r, n, s) + o + t[l] + a[p] | 0;
o = s;
s = n;
n = d(r);
r = i;
i = b;
}
this._a = i + this._a | 0;
this._b = r + this._b | 0;
this._c = n + this._c | 0;
this._d = s + this._d | 0;
this._e = o + this._e | 0;
};
c.prototype._hash = function() {
var e = s.allocUnsafe(20);
e.writeInt32BE(0 | this._a, 0);
e.writeInt32BE(0 | this._b, 4);
e.writeInt32BE(0 | this._c, 8);
e.writeInt32BE(0 | this._d, 12);
e.writeInt32BE(0 | this._e, 16);
return e;
};
t.exports = c;
}, {
"./hash": 144,
inherits: 101,
"safe-buffer": 143
} ],
148: [ function(e, t, i) {
var r = e("inherits"), n = e("./sha256"), s = e("./hash"), a = e("safe-buffer").Buffer, o = new Array(64);
function c() {
this.init();
this._w = o;
s.call(this, 64, 56);
}
r(c, n);
c.prototype.init = function() {
this._a = 3238371032;
this._b = 914150663;
this._c = 812702999;
this._d = 4144912697;
this._e = 4290775857;
this._f = 1750603025;
this._g = 1694076839;
this._h = 3204075428;
return this;
};
c.prototype._hash = function() {
var e = a.allocUnsafe(28);
e.writeInt32BE(this._a, 0);
e.writeInt32BE(this._b, 4);
e.writeInt32BE(this._c, 8);
e.writeInt32BE(this._d, 12);
e.writeInt32BE(this._e, 16);
e.writeInt32BE(this._f, 20);
e.writeInt32BE(this._g, 24);
return e;
};
t.exports = c;
}, {
"./hash": 144,
"./sha256": 149,
inherits: 101,
"safe-buffer": 143
} ],
149: [ function(e, t, i) {
var r = e("inherits"), n = e("./hash"), s = e("safe-buffer").Buffer, a = [ 1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298 ], o = new Array(64);
function c() {
this.init();
this._w = o;
n.call(this, 64, 56);
}
r(c, n);
c.prototype.init = function() {
this._a = 1779033703;
this._b = 3144134277;
this._c = 1013904242;
this._d = 2773480762;
this._e = 1359893119;
this._f = 2600822924;
this._g = 528734635;
this._h = 1541459225;
return this;
};
function h(e, t, i) {
return i ^ e & (t ^ i);
}
function f(e, t, i) {
return e & t | i & (e | t);
}
function d(e) {
return (e >>> 2 | e << 30) ^ (e >>> 13 | e << 19) ^ (e >>> 22 | e << 10);
}
function u(e) {
return (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
}
function l(e) {
return (e >>> 7 | e << 25) ^ (e >>> 18 | e << 14) ^ e >>> 3;
}
function p(e) {
return (e >>> 17 | e << 15) ^ (e >>> 19 | e << 13) ^ e >>> 10;
}
c.prototype._update = function(e) {
for (var t = this._w, i = 0 | this._a, r = 0 | this._b, n = 0 | this._c, s = 0 | this._d, o = 0 | this._e, c = 0 | this._f, b = 0 | this._g, g = 0 | this._h, y = 0; y < 16; ++y) t[y] = e.readInt32BE(4 * y);
for (;y < 64; ++y) t[y] = p(t[y - 2]) + t[y - 7] + l(t[y - 15]) + t[y - 16] | 0;
for (var m = 0; m < 64; ++m) {
var v = g + u(o) + h(o, c, b) + a[m] + t[m] | 0, _ = d(i) + f(i, r, n) | 0;
g = b;
b = c;
c = o;
o = s + v | 0;
s = n;
n = r;
r = i;
i = v + _ | 0;
}
this._a = i + this._a | 0;
this._b = r + this._b | 0;
this._c = n + this._c | 0;
this._d = s + this._d | 0;
this._e = o + this._e | 0;
this._f = c + this._f | 0;
this._g = b + this._g | 0;
this._h = g + this._h | 0;
};
c.prototype._hash = function() {
var e = s.allocUnsafe(32);
e.writeInt32BE(this._a, 0);
e.writeInt32BE(this._b, 4);
e.writeInt32BE(this._c, 8);
e.writeInt32BE(this._d, 12);
e.writeInt32BE(this._e, 16);
e.writeInt32BE(this._f, 20);
e.writeInt32BE(this._g, 24);
e.writeInt32BE(this._h, 28);
return e;
};
t.exports = c;
}, {
"./hash": 144,
inherits: 101,
"safe-buffer": 143
} ],
150: [ function(e, t, i) {
var r = e("inherits"), n = e("./sha512"), s = e("./hash"), a = e("safe-buffer").Buffer, o = new Array(160);
function c() {
this.init();
this._w = o;
s.call(this, 128, 112);
}
r(c, n);
c.prototype.init = function() {
this._ah = 3418070365;
this._bh = 1654270250;
this._ch = 2438529370;
this._dh = 355462360;
this._eh = 1731405415;
this._fh = 2394180231;
this._gh = 3675008525;
this._hh = 1203062813;
this._al = 3238371032;
this._bl = 914150663;
this._cl = 812702999;
this._dl = 4144912697;
this._el = 4290775857;
this._fl = 1750603025;
this._gl = 1694076839;
this._hl = 3204075428;
return this;
};
c.prototype._hash = function() {
var e = a.allocUnsafe(48);
function t(t, i, r) {
e.writeInt32BE(t, r);
e.writeInt32BE(i, r + 4);
}
t(this._ah, this._al, 0);
t(this._bh, this._bl, 8);
t(this._ch, this._cl, 16);
t(this._dh, this._dl, 24);
t(this._eh, this._el, 32);
t(this._fh, this._fl, 40);
return e;
};
t.exports = c;
}, {
"./hash": 144,
"./sha512": 151,
inherits: 101,
"safe-buffer": 143
} ],
151: [ function(e, t, i) {
var r = e("inherits"), n = e("./hash"), s = e("safe-buffer").Buffer, a = [ 1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591 ], o = new Array(160);
function c() {
this.init();
this._w = o;
n.call(this, 128, 112);
}
r(c, n);
c.prototype.init = function() {
this._ah = 1779033703;
this._bh = 3144134277;
this._ch = 1013904242;
this._dh = 2773480762;
this._eh = 1359893119;
this._fh = 2600822924;
this._gh = 528734635;
this._hh = 1541459225;
this._al = 4089235720;
this._bl = 2227873595;
this._cl = 4271175723;
this._dl = 1595750129;
this._el = 2917565137;
this._fl = 725511199;
this._gl = 4215389547;
this._hl = 327033209;
return this;
};
function h(e, t, i) {
return i ^ e & (t ^ i);
}
function f(e, t, i) {
return e & t | i & (e | t);
}
function d(e, t) {
return (e >>> 28 | t << 4) ^ (t >>> 2 | e << 30) ^ (t >>> 7 | e << 25);
}
function u(e, t) {
return (e >>> 14 | t << 18) ^ (e >>> 18 | t << 14) ^ (t >>> 9 | e << 23);
}
function l(e, t) {
return (e >>> 1 | t << 31) ^ (e >>> 8 | t << 24) ^ e >>> 7;
}
function p(e, t) {
return (e >>> 1 | t << 31) ^ (e >>> 8 | t << 24) ^ (e >>> 7 | t << 25);
}
function b(e, t) {
return (e >>> 19 | t << 13) ^ (t >>> 29 | e << 3) ^ e >>> 6;
}
function g(e, t) {
return (e >>> 19 | t << 13) ^ (t >>> 29 | e << 3) ^ (e >>> 6 | t << 26);
}
function y(e, t) {
return e >>> 0 < t >>> 0 ? 1 : 0;
}
c.prototype._update = function(e) {
for (var t = this._w, i = 0 | this._ah, r = 0 | this._bh, n = 0 | this._ch, s = 0 | this._dh, o = 0 | this._eh, c = 0 | this._fh, m = 0 | this._gh, v = 0 | this._hh, _ = 0 | this._al, w = 0 | this._bl, x = 0 | this._cl, C = 0 | this._dl, E = 0 | this._el, S = 0 | this._fl, A = 0 | this._gl, D = 0 | this._hl, R = 0; R < 32; R += 2) {
t[R] = e.readInt32BE(4 * R);
t[R + 1] = e.readInt32BE(4 * R + 4);
}
for (;R < 160; R += 2) {
var M = t[R - 30], k = t[R - 30 + 1], N = l(M, k), B = p(k, M), L = b(M = t[R - 4], k = t[R - 4 + 1]), T = g(k, M), O = t[R - 14], P = t[R - 14 + 1], I = t[R - 32], j = t[R - 32 + 1], F = B + P | 0, U = N + O + y(F, B) | 0;
U = (U = U + L + y(F = F + T | 0, T) | 0) + I + y(F = F + j | 0, j) | 0;
t[R] = U;
t[R + 1] = F;
}
for (var z = 0; z < 160; z += 2) {
U = t[z];
F = t[z + 1];
var q = f(i, r, n), G = f(_, w, x), H = d(i, _), V = d(_, i), K = u(o, E), Y = u(E, o), W = a[z], X = a[z + 1], J = h(o, c, m), Z = h(E, S, A), Q = D + Y | 0, $ = v + K + y(Q, D) | 0;
$ = ($ = ($ = $ + J + y(Q = Q + Z | 0, Z) | 0) + W + y(Q = Q + X | 0, X) | 0) + U + y(Q = Q + F | 0, F) | 0;
var ee = V + G | 0, te = H + q + y(ee, V) | 0;
v = m;
D = A;
m = c;
A = S;
c = o;
S = E;
o = s + $ + y(E = C + Q | 0, C) | 0;
s = n;
C = x;
n = r;
x = w;
r = i;
w = _;
i = $ + te + y(_ = Q + ee | 0, Q) | 0;
}
this._al = this._al + _ | 0;
this._bl = this._bl + w | 0;
this._cl = this._cl + x | 0;
this._dl = this._dl + C | 0;
this._el = this._el + E | 0;
this._fl = this._fl + S | 0;
this._gl = this._gl + A | 0;
this._hl = this._hl + D | 0;
this._ah = this._ah + i + y(this._al, _) | 0;
this._bh = this._bh + r + y(this._bl, w) | 0;
this._ch = this._ch + n + y(this._cl, x) | 0;
this._dh = this._dh + s + y(this._dl, C) | 0;
this._eh = this._eh + o + y(this._el, E) | 0;
this._fh = this._fh + c + y(this._fl, S) | 0;
this._gh = this._gh + m + y(this._gl, A) | 0;
this._hh = this._hh + v + y(this._hl, D) | 0;
};
c.prototype._hash = function() {
var e = s.allocUnsafe(64);
function t(t, i, r) {
e.writeInt32BE(t, r);
e.writeInt32BE(i, r + 4);
}
t(this._ah, this._al, 0);
t(this._bh, this._bl, 8);
t(this._ch, this._cl, 16);
t(this._dh, this._dl, 24);
t(this._eh, this._el, 32);
t(this._fh, this._fl, 40);
t(this._gh, this._gl, 48);
t(this._hh, this._hl, 56);
return e;
};
t.exports = c;
}, {
"./hash": 144,
inherits: 101,
"safe-buffer": 143
} ],
152: [ function(e, t, i) {
t.exports = n;
var r = e("events").EventEmitter;
e("inherits")(n, r);
n.Readable = e("readable-stream/readable.js");
n.Writable = e("readable-stream/writable.js");
n.Duplex = e("readable-stream/duplex.js");
n.Transform = e("readable-stream/transform.js");
n.PassThrough = e("readable-stream/passthrough.js");
n.Stream = n;
function n() {
r.call(this);
}
n.prototype.pipe = function(e, t) {
var i = this;
function n(t) {
e.writable && !1 === e.write(t) && i.pause && i.pause();
}
i.on("data", n);
function s() {
i.readable && i.resume && i.resume();
}
e.on("drain", s);
if (!(e._isStdio || t && !1 === t.end)) {
i.on("end", o);
i.on("close", c);
}
var a = !1;
function o() {
if (!a) {
a = !0;
e.end();
}
}
function c() {
if (!a) {
a = !0;
"function" == typeof e.destroy && e.destroy();
}
}
function h(e) {
f();
if (0 === r.listenerCount(this, "error")) throw e;
}
i.on("error", h);
e.on("error", h);
function f() {
i.removeListener("data", n);
e.removeListener("drain", s);
i.removeListener("end", o);
i.removeListener("close", c);
i.removeListener("error", h);
e.removeListener("error", h);
i.removeListener("end", f);
i.removeListener("close", f);
e.removeListener("close", f);
}
i.on("end", f);
i.on("close", f);
e.on("close", f);
e.emit("pipe", i);
return e;
};
}, {
events: 83,
inherits: 101,
"readable-stream/duplex.js": 127,
"readable-stream/passthrough.js": 138,
"readable-stream/readable.js": 139,
"readable-stream/transform.js": 140,
"readable-stream/writable.js": 141
} ],
153: [ function(e, t, i) {
var r = e("buffer").Buffer, n = r.isEncoding || function(e) {
switch (e && e.toLowerCase()) {
case "hex":
case "utf8":
case "utf-8":
case "ascii":
case "binary":
case "base64":
case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
case "raw":
return !0;

default:
return !1;
}
};
var s = i.StringDecoder = function(e) {
this.encoding = (e || "utf8").toLowerCase().replace(/[-_]/, "");
(function(e) {
if (e && !n(e)) throw new Error("Unknown encoding: " + e);
})(e);
switch (this.encoding) {
case "utf8":
this.surrogateSize = 3;
break;

case "ucs2":
case "utf16le":
this.surrogateSize = 2;
this.detectIncompleteChar = o;
break;

case "base64":
this.surrogateSize = 3;
this.detectIncompleteChar = c;
break;

default:
this.write = a;
return;
}
this.charBuffer = new r(6);
this.charReceived = 0;
this.charLength = 0;
};
s.prototype.write = function(e) {
for (var t = ""; this.charLength; ) {
var i = e.length >= this.charLength - this.charReceived ? this.charLength - this.charReceived : e.length;
e.copy(this.charBuffer, this.charReceived, 0, i);
this.charReceived += i;
if (this.charReceived < this.charLength) return "";
e = e.slice(i, e.length);
if (!((n = (t = this.charBuffer.slice(0, this.charLength).toString(this.encoding)).charCodeAt(t.length - 1)) >= 55296 && n <= 56319)) {
this.charReceived = this.charLength = 0;
if (0 === e.length) return t;
break;
}
this.charLength += this.surrogateSize;
t = "";
}
this.detectIncompleteChar(e);
var r = e.length;
if (this.charLength) {
e.copy(this.charBuffer, 0, e.length - this.charReceived, r);
r -= this.charReceived;
}
var n;
r = (t += e.toString(this.encoding, 0, r)).length - 1;
if ((n = t.charCodeAt(r)) >= 55296 && n <= 56319) {
var s = this.surrogateSize;
this.charLength += s;
this.charReceived += s;
this.charBuffer.copy(this.charBuffer, s, 0, s);
e.copy(this.charBuffer, 0, 0, s);
return t.substring(0, r);
}
return t;
};
s.prototype.detectIncompleteChar = function(e) {
for (var t = e.length >= 3 ? 3 : e.length; t > 0; t--) {
var i = e[e.length - t];
if (1 == t && i >> 5 == 6) {
this.charLength = 2;
break;
}
if (t <= 2 && i >> 4 == 14) {
this.charLength = 3;
break;
}
if (t <= 3 && i >> 3 == 30) {
this.charLength = 4;
break;
}
}
this.charReceived = t;
};
s.prototype.end = function(e) {
var t = "";
e && e.length && (t = this.write(e));
if (this.charReceived) {
var i = this.charReceived, r = this.charBuffer, n = this.encoding;
t += r.slice(0, i).toString(n);
}
return t;
};
function a(e) {
return e.toString(this.encoding);
}
function o(e) {
this.charReceived = e.length % 2;
this.charLength = this.charReceived ? 2 : 0;
}
function c(e) {
this.charReceived = e.length % 3;
this.charLength = this.charReceived ? 3 : 0;
}
}, {
buffer: 47
} ],
154: [ function(e, t, i) {
(function(e) {
t.exports = function(e, t) {
if (i("noDeprecation")) return e;
var r = !1;
return function() {
if (!r) {
if (i("throwDeprecation")) throw new Error(t);
i("traceDeprecation") ? console.trace(t) : console.warn(t);
r = !0;
}
return e.apply(this, arguments);
};
};
function i(t) {
try {
if (!e.localStorage) return !1;
} catch (e) {
return !1;
}
var i = e.localStorage[t];
return null != i && "true" === String(i).toLowerCase();
}
}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
}, {} ],
155: [ function(require, module, exports) {
var indexOf = require("indexof"), Object_keys = function(e) {
if (Object.keys) return Object.keys(e);
var t = [];
for (var i in e) t.push(i);
return t;
}, forEach = function(e, t) {
if (e.forEach) return e.forEach(t);
for (var i = 0; i < e.length; i++) t(e[i], i, e);
}, defineProp = function() {
try {
Object.defineProperty({}, "_", {});
return function(e, t, i) {
Object.defineProperty(e, t, {
writable: !0,
enumerable: !1,
configurable: !0,
value: i
});
};
} catch (e) {
return function(e, t, i) {
e[t] = i;
};
}
}(), globals = [ "Array", "Boolean", "Date", "Error", "EvalError", "Function", "Infinity", "JSON", "Math", "NaN", "Number", "Object", "RangeError", "ReferenceError", "RegExp", "String", "SyntaxError", "TypeError", "URIError", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "escape", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "undefined", "unescape" ];
function Context() {}
Context.prototype = {};
var Script = exports.Script = function(e) {
if (!(this instanceof Script)) return new Script(e);
this.code = e;
};
Script.prototype.runInContext = function(e) {
if (!(e instanceof Context)) throw new TypeError("needs a 'context' argument.");
var t = document.createElement("iframe");
t.style || (t.style = {});
t.style.display = "none";
document.body.appendChild(t);
var i = t.contentWindow, r = i.eval, n = i.execScript;
if (!r && n) {
n.call(i, "null");
r = i.eval;
}
forEach(Object_keys(e), function(t) {
i[t] = e[t];
});
forEach(globals, function(t) {
e[t] && (i[t] = e[t]);
});
var s = Object_keys(i), a = r.call(i, this.code);
forEach(Object_keys(i), function(t) {
(t in e || -1 === indexOf(s, t)) && (e[t] = i[t]);
});
forEach(globals, function(t) {
t in e || defineProp(e, t, i[t]);
});
document.body.removeChild(t);
return a;
};
Script.prototype.runInThisContext = function() {
return eval(this.code);
};
Script.prototype.runInNewContext = function(e) {
var t = Script.createContext(e), i = this.runInContext(t);
forEach(Object_keys(t), function(i) {
e[i] = t[i];
});
return i;
};
forEach(Object_keys(Script.prototype), function(e) {
exports[e] = Script[e] = function(t) {
var i = Script(t);
return i[e].apply(i, [].slice.call(arguments, 1));
};
});
exports.createScript = function(e) {
return exports.Script(e);
};
exports.createContext = Script.createContext = function(e) {
var t = new Context();
"object" == typeof e && forEach(Object_keys(e), function(i) {
t[i] = e[i];
});
return t;
};
}, {
indexof: 100
} ],
backgroundParticles: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "c0032NE1WZMn6vInk8g4bwg", "backgroundParticles");
cc.Class({
extends: cc.Component,
properties: {
particlesSpriteFrame: [ cc.SpriteFrame ]
},
onLoad: function() {
window.pr = this;
},
start: function() {},
makeParticles: function() {
var e = this.particlesSpriteFrame[0], t = new cc.Node();
t.addComponent(cc.Sprite).spriteFrame = e;
t.position = new cc.v2(400, 240);
this.node.addChild(t);
var i = cc.moveTo(10, -400, -240);
t.runAction(i);
window.prNode = t;
}
});
cc._RF.pop();
}, {} ],
ballController: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "26c3730Km9HOIkvIKD+rid/", "ballController");
var r = e("event"), n = e("scene");
cc.Class({
extends: cc.Component,
properties: {
dotPrefab: cc.Prefab,
trailPrefab: cc.Prefab,
soundImpulseLimit: 100
},
onLoad: function() {
this.dotsArray = [];
this.dotsDrawingTime = .03;
window.boll = this;
this.trail = cc.instantiate(this.trailPrefab);
this.ballStuckCountThreshold = 50;
this.stuckedVelocity = 30;
this.longProjectionDotsCount = 32;
this.normalProjectionDotsCount = 12;
this.magnetPowerRadius = this.node.getChildByName("magnet_pull").getChildByName("ring").width / 2;
this.ballStucked = !1;
this.ballCounter = 0;
this.ballBody = this.node.getComponent(cc.RigidBody);
this.bounceSound = this.node.getComponent(cc.AudioSource);
this.dotsArea = this.node.parent.getChildByName("dotsArea");
this.node.parent.addChild(this.trail, -1);
for (var e = 0; e < this.longProjectionDotsCount; e++) {
var t = cc.instantiate(this.dotPrefab);
this.dotsArea.addChild(t);
this.dotsArray.push(t);
}
this.loadBall();
this.deactivateLongProjection();
this.deactivateMagnet();
cc.systemEvent.on(r.BALL_CHANGE, this.onBallChange, this);
cc.systemEvent.on(r.ENABLE_POWER_UP_LONG_PROJECTILE, this.activateLongProjection, this);
cc.systemEvent.on(r.DISABLE_POWER_UP_LONG_PROJECTILE, this.deactivateLongProjection, this);
cc.systemEvent.on(r.ENABLE_POWER_UP_MAGNET, this.activeMagnet, this);
cc.systemEvent.on(r.DISABLE_POWER_UP_MAGNET, this.deactivateMagnet, this);
},
loadBall: function() {
var e = n.CUSTOMIZATION_SCREEN_CONTROLLER.getCurrentBallSkin();
this.setBallFrame(e);
},
onBallChange: function(e) {
var t = e.getUserData();
this.setBallFrame(t.ballFrame);
},
setBallFrame: function(e) {
this.node.getComponent(cc.Sprite).spriteFrame = e;
},
projectionTrackTheBall: function(e, t) {
if (!this.disableBallControls) for (var i = 0; i < this.dotsArray.length; i++) {
var r = this.getProjectilePoint(e, t, this.dotsDrawingTime * i);
this.dotsArray[i].x = -r.Dx + this.node.x;
this.dotsArray[i].y = r.Dy + this.node.y;
}
},
trailTrack: function() {
this.trail.x = this.node.x;
this.trail.y = this.node.y;
},
update: function(e) {
this.trailTrack();
this.isBallStucked();
},
activateLongProjection: function() {
this.updateProjectionDotsScale(4, 15, this.longProjectionDotsCount);
},
deactivateLongProjection: function() {
this.updateProjectionDotsScale(2, 14, this.normalProjectionDotsCount);
},
activeMagnet: function() {
this.node.getChildByName("magnet_pull").active = !0;
this.node.getChildByName("starCatcher").getComponent(cc.CircleCollider).radius = this.magnetPowerRadius;
},
deactivateMagnet: function() {
this.node.getChildByName("magnet_pull").active = !1;
this.node.getChildByName("starCatcher").getComponent(cc.CircleCollider).radius = this.node.width / 2;
},
updateProjectionDotsScale: function(e, t, i) {
for (var r = 0, n = t, s = (t - e) / this.longProjectionDotsCount, a = 0; a < this.dotsArea.children.length; a++) {
var o = this.dotsArea.children[a];
o.width = o.height = n;
n -= s;
o.opacity = r < i ? 255 : 0;
r++;
}
},
isBallStucked: function() {
var e = this.ballBody.linearVelocity;
if (Math.abs(e.x) < this.stuckedVelocity && Math.abs(e.y) < this.stuckedVelocity && 0 != this.ballBody.type) {
this.ballCounter++;
if (this.ballCounter > this.ballStuckCountThreshold && !this.ballStucked) {
console.log("ball has stucked");
this.ballStucked = !0;
this.ballCounter = 0;
var t = new cc.Event.EventCustom(r.RESET_BALL_POSITION, !1);
cc.systemEvent.dispatchEvent(t);
}
}
},
getProjectilePoint: function(e, t, i) {
t = void 0 == t ? 0 : t;
var r = cc.director.getPhysicsManager().gravity.y;
t *= Math.PI / 180;
var n = e * Math.cos(t), s = e * Math.sin(t) + r * i;
return {
Dx: n * i,
Dy: s * i,
Vx: n,
Vy: s
};
},
getMaxHeight: function(e, t) {
for (var i = this.node.y, r = i, n = 0, s = .07; ;) {
if (!((r = this.getProjectilePoint(e, t, s).Dy + i) - i > n)) break;
n = r - i;
s += .07;
}
return n;
},
applyVelocity: function(e, t) {
var i = this.getProjectilePoint(e, t, 0);
this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(i.Vx, i.Vy);
},
switchGravity: function() {
var e = this.node.getComponent(cc.RigidBody).gravityScale;
e = 1 == e ? -1 : 1;
this.node.getComponent(cc.RigidBody).gravityScale = e;
},
resetGravity: function() {
this.node.getComponent(cc.RigidBody).gravityScale = 1;
},
onPostSolve: function(e, t, i) {
e.getImpulse().normalImpulses[0] > this.soundImpulseLimit && n.MANAGER_SCREEN_CONTROLLER.playAudio(this.bounceSound);
},
setIncreaseVelocity: function(e) {
this.increaseVelocity = e;
},
freezeBall: function() {
this.ballBody.type = 0;
this.ballStucked = !1;
this.trail.active = !1;
},
unFreezeBall: function() {
this.ballBody.type = 2;
this.trail.active = !0;
},
teleportBall: function(e, t) {
this.freezeBall();
this.node.x = e;
this.node.y = t;
this.unFreezeBall();
}
});
cc._RF.pop();
}, {
event: "event",
scene: "scene"
} ],
ball_template_controller: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "cc445ullaREy7D4FQATJ08p", "ball_template_controller");
var r = e("event"), n = e("scene");
cc.Class({
extends: cc.Component,
properties: {},
onLoad: function() {
this.lockCurtain = this.node.getChildByName("lockCurtain");
this.unlockCurtain = this.node.getChildByName("unlockCurtain");
this.selectCurtain = this.node.getChildByName("selectCurtain");
this.ballSprite = this.node.getChildByName("ball").getComponent(cc.Sprite);
console.log("onload of ball_template_controlller called!!");
},
setBall: function(e) {
this.ballSprite.spriteFrame = e;
},
disableAllCurtains: function() {
this.lockCurtain.active = !1;
this.unlockCurtain.active = !1;
this.selectCurtain.active = !1;
},
selectBall: function() {
for (var e = 0; e < this.node.parent.children.length; e++) {
var t = this.node.parent.children[e].getComponent("ball_template_controller");
t.selectCurtain.active && t.unlockBall();
}
this.disableAllCurtains();
this.selectCurtain.active = !0;
},
lockBall: function() {
this.disableAllCurtains();
this.lockCurtain.active = !0;
},
unlockBall: function() {
this.disableAllCurtains();
this.unlockCurtain.active = !0;
},
updateSelectBallStoreData: function() {
for (var e = this.ballSprite.spriteFrame.name.split("_")[0], t = n.CUSTOMIZATION_SCREEN_CONTROLLER.getStoreData(), i = 0; i < t.ballSkins.length; i++) if (2 == t.ballSkins[i].status) {
t.ballSkins[i].status = 1;
break;
}
for (i = 0; i < t.ballSkins.length; i++) if (t.ballSkins[i].name == e) {
t.ballSkins[i].status = 2;
break;
}
n.CUSTOMIZATION_SCREEN_CONTROLLER.setStoreData(t);
},
ballClick: function() {
if (this.lockCurtain.active) {
var e = parseInt(this.lockCurtain.getChildByName("count").getComponent(cc.Label).string), t = n.PLAY_SCREEN_CONTROLLER.getStarsCount();
e = null == e ? 0 : e;
if (t >= (e = parseInt(e))) {
n.PLAY_SCREEN_CONTROLLER.setStarsCount(t - e);
this.selectBall();
this.updateSelectBallStoreData();
(i = new cc.Event.EventCustom(r.BALL_CHANGE, !1)).setUserData({
ballFrame: this.ballSprite.spriteFrame
});
cc.systemEvent.dispatchEvent(i);
n.CUSTOMIZATION_SCREEN_CONTROLLER.playUnlockSound();
} else n.PLAY_SCREEN_CONTROLLER.shakeStar();
} else if (this.unlockCurtain.active) {
n.MANAGER_SCREEN_CONTROLLER.playClick();
this.selectBall();
this.updateSelectBallStoreData();
var i;
(i = new cc.Event.EventCustom(r.BALL_CHANGE, !1)).setUserData({
ballFrame: this.ballSprite.spriteFrame
});
cc.systemEvent.dispatchEvent(i);
}
}
});
cc._RF.pop();
}, {
event: "event",
scene: "scene"
} ],
button: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "87f5eLoopFCt6V4JpBW20Bt", "button");
cc.Class({
extends: cc.Component,
properties: {},
onLoad: function() {
this.node.on(cc.Node.EventType.TOUCH_START, function(e) {
e.stopPropagation();
}, this);
},
start: function() {}
});
cc._RF.pop();
}, {} ],
cameraController: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "50e05LKTORKV5lMdzE0sC/W", "cameraController");
var r = e("shifty"), n = e("scene");
cc.Class({
extends: cc.Component,
properties: {
cam_mid_up: cc.Node,
cam_mid_down: cc.Node
},
onLoad: function() {
window.camController = this;
this.customizationMargin = 200;
this.customizationTime = 400;
},
customizationSceneOn: function() {
var e = this, t = {
from: {
x: this.node.x
},
to: {
x: this.node.x - this.customizationMargin
},
duration: this.customizationTime,
easing: "easeOutQuad",
step: function(t) {
e.cam_mid_down.x = e.cam_mid_up.x = e.node.x = t.x;
}
};
r.tween(t);
},
customizationSceneOff: function() {
var e = this, t = {
from: {
x: this.node.x
},
to: {
x: this.node.x + this.customizationMargin
},
duration: this.customizationTime,
easing: "easeOutQuad",
step: function(t) {
e.cam_mid_down.x = e.cam_mid_up.x = e.node.x = t.x;
}
};
r.tween(t);
},
setCamera: function(e) {
var t = e.position, i = e.zoom, s = this;
window.playingCamera = n.CAMERA_NODE.getComponent(cc.Camera);
var a = {
from: {
x: this.node.x,
y: this.node.y,
zoom: n.CAMERA_NODE.getComponent(cc.Camera).zoomRatio
},
to: {
x: t.x,
y: t.y,
zoom: i
},
duration: 600,
easing: "easeOutQuad",
step: function(e) {
s.cam_mid_down.x = s.cam_mid_up.x = s.node.x = e.x;
s.cam_mid_down.y = s.cam_mid_up.y = s.node.y = e.y;
s.cam_mid_down.getComponent(cc.Camera).zoomRatio = s.cam_mid_up.getComponent(cc.Camera).zoomRatio = s.node.getComponent(cc.Camera).zoomRatio = e.zoom;
}
};
r.tween(a);
},
start: function() {}
});
cc._RF.pop();
}, {
scene: "scene",
shifty: "shifty"
} ],
challengeButton: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "63229ewDQRFFov5gwgJ7aMV", "challengeButton");
var r = e("event"), n = e("scene");
cc.Class({
extends: cc.Component,
properties: {},
onLoad: function() {
this.lockNode = this.node.getChildByName("lock");
},
getNumber: function() {
return parseInt(this.node.getChildByName("label").getComponent(cc.Label).string);
},
onClick: function() {
if (!this.lockNode.active) {
var e = new cc.Event.EventCustom(r.CHALLENGE_CLICKED, !1);
e.setUserData(parseInt(this.getNumber()) - 1);
cc.systemEvent.dispatchEvent(e);
n.PLAY_SCREEN_CONTROLLER.score.active = !1;
}
},
lock: function() {
this.lockNode.active = !0;
},
unlock: function() {
this.lockNode.active = !1;
}
});
cc._RF.pop();
}, {
event: "event",
scene: "scene"
} ],
challenge_complete_screen_controller: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "51335D0vPNIQLh59fNj1Kpi", "challenge_complete_screen_controller");
cc.Class({
extends: cc.Component,
show: function() {
this.node.active = !0;
},
hide: function() {
this.node.active = !1;
}
});
cc._RF.pop();
}, {} ],
challenges_screen_controller: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "ef0fblOCOZBgYSe4WkrdnOz", "challenges_screen_controller");
var r = e("scene"), n = e("event"), s = e("challenges"), a = e("shifty");
cc.Class({
extends: cc.Component,
properties: {
challenge_button_prefab: cc.Prefab,
panelTime: 400
},
onLoad: function() {
window.ch = this;
this.itemsPerRow = 5;
this.container = this.node.getChildByName("challengesContainer").getChildByName("view").getChildByName("content");
this.progress = this.node.getChildByName("progress");
this.mask = this.container.parent;
cc.systemEvent.on(n.CHALLENGE_CLICKED, this.challengeClick, this);
this.buildButtons();
this.refreshButtons();
},
getUnlockedChallengesCount: function() {
var e = r.MANAGER_SCREEN_CONTROLLER.getItem("maxUnlockedChallenges");
return e = null == e ? 1 : e;
},
setUnlockedChallengesCount: function(e) {
e > s.length || r.MANAGER_SCREEN_CONTROLLER.setItem("maxUnlockedChallenges", e);
},
challengeClick: function(e) {
r.PLAY_SCREEN_CONTROLLER.challengeIndex = e.getUserData();
r.MANAGER_SCREEN_CONTROLLER.playScreen();
r.MANAGER_SCREEN_CONTROLLER.playClick();
},
getChallengesData: function() {},
refreshButtons: function() {
for (var e = this.getUnlockedChallengesCount(), t = 0; t < this.container.children.length; t++) {
var i = t + 1, r = this.container.children[t];
i <= e ? r.getComponent("challengeButton").unlock() : r.getComponent("challengeButton").lock();
}
this.progress.getComponent(cc.Label).string = e + "/" + this.container.children.length;
},
buildButtons: function() {
var e = this.container.width / this.itemsPerRow, t = -this.container.width / 2 + e / 2, i = -e / 2;
this.challenge_button_prefab.data.width;
for (var r = 0, n = 0, a = 0; a < s.length; a++) {
var o = a + 1, c = cc.instantiate(this.challenge_button_prefab);
this.container.addChild(c);
c.getChildByName("label").getComponent(cc.Label).string = o;
c.x = t + e * n;
c.y = i - e * r;
if (++n == this.itemsPerRow) {
n = 0;
r++;
}
}
s.length % this.itemsPerRow > 0 && r++;
this.container.height = e * r;
},
show: function() {
var e = cc.view.getVisibleSize().height / 2, t = this.node;
t.active = !0;
var i = new a.Tweenable();
i.setConfig({
from: {
y: -e
},
to: {
y: e
},
duration: this.panelTime,
easing: "easeOutQuart",
step: function(e) {
t.y = e.y;
}
});
i.tween();
this.refreshButtons();
},
hide: function() {
var e = cc.view.getVisibleSize().height / 2, t = this.node, i = new a.Tweenable();
i.setConfig({
from: {
y: e
},
to: {
y: -e
},
duration: this.panelTime,
easing: "easeInQuart",
step: function(e) {
t.y = e.y;
}
});
i.tween().then(function() {
t.active = !1;
});
},
backButton: function() {
r.MANAGER_SCREEN_CONTROLLER.homeScreen();
r.MANAGER_SCREEN_CONTROLLER.playClick();
}
});
cc._RF.pop();
}, {
challenges: "challenges",
event: "event",
scene: "scene",
shifty: "shifty"
} ],
challenges: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "23c7a1U7NdL2JNtyJdTzy8J", "challenges");
var r = [];
r[0] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 0,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
} ];
r[1] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 0,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 150
}, {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -150
} ];
r[2] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 0,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -150
}, {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -150
}, {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -150
}, {
index: 0,
star: 1,
powerup: 2,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 150
}, {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 150
}, {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 150
} ];
r[3] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 15,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 15,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -150
}, {
index: 15,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 150
} ];
r[4] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 15,
star: 0,
powerup: 2,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -200
}, {
index: 15,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 200
}, {
index: 0,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 15,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -200
}, {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 200
}, {
index: 15,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 200
}, {
index: 15,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 200
} ];
r[5] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 1,
star: 0,
powerup: 1,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: 0
}, {
index: 1,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: -200
}, {
index: 1,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 200
} ];
r[6] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 1,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: -200
}, {
index: 15,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 100,
yDis: 200
}, {
index: 1,
star: 1,
powerup: 2,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: -200
}, {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -100
}, {
index: 15,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: 200
}, {
index: 15,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: 200
}, {
index: 0,
star: 1,
powerup: 2,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: -200
}, {
index: 1,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: 200
} ];
r[7] = [ {
index: 1,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 1,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: -200
}, {
index: 1,
star: 0,
powerup: 2,
highlighter: 0,
catched: 0,
xDis: 100,
yDis: 200
}, {
index: 1,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: -200
}, {
index: 1,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -200
}, {
index: 1,
star: 0,
powerup: 1,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: 200
}, {
index: 1,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: 200
}, {
index: 1,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: -200
}, {
index: 1,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: 200
} ];
r[8] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 3,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
} ];
r[9] = [ {
index: 1,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 3,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: -200
}, {
index: 1,
star: 0,
powerup: 2,
highlighter: 0,
catched: 0,
xDis: 100,
yDis: -200
}, {
index: 3,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: 200
}, {
index: 1,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 200
} ];
r[10] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 3,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 3,
star: 0,
powerup: 2,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 3,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -200
}, {
index: 3,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 3,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 200
}, {
index: 3,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
} ];
r[11] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 3,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 200
}, {
index: 1,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 200
}, {
index: 3,
star: 0,
powerup: 2,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -200
}, {
index: 1,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -200
}, {
index: 3,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 200
}, {
index: 1,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 200
}, {
index: 3,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -200
} ];
r[12] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 2,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
} ];
r[13] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 2,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -150
}, {
index: 2,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 150
}, {
index: 2,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -150
}, {
index: 0,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 150
} ];
r[14] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 1,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -150
}, {
index: 2,
star: 0,
powerup: 2,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -150
}, {
index: 1,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 150
}, {
index: 2,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 1,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 2,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 150
}, {
index: 1,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -150
} ];
r[15] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 3,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -150
}, {
index: 2,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -150
}, {
index: 3,
star: 0,
powerup: 2,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 150
}, {
index: 2,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 3,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 2,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 150
}, {
index: 3,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -150
} ];
r[16] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 5,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
} ];
r[17] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 5,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -150
}, {
index: 0,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -150
}, {
index: 5,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 150
}, {
index: 0,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 150
} ];
r[18] = [ {
index: 0,
star: 0,
powerup: 2,
highlighter: 0,
catched: 1,
xDis: 50,
yDis: 0
}, {
index: 5,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: 0
}, {
index: 5,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: 0
}, {
index: 5,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: -200
}, {
index: 5,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: 0
}, {
index: 5,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: 200
}, {
index: 5,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 150,
yDis: 0
} ];
r[19] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 50,
yDis: 0
}, {
index: 5,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: -150
}, {
index: 2,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: 150
}, {
index: 5,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: -150
}, {
index: 5,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: 150
}, {
index: 3,
star: 1,
powerup: 1,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: -150
}, {
index: 5,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: 150
}, {
index: 5,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: -150
}, {
index: 1,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: 150
}, {
index: 5,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: -150
} ];
r[20] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 11,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
} ];
r[21] = [ {
index: 0,
star: 0,
powerup: 2,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 11,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -100
}, {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -100
}, {
index: 11,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 100
}, {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 100
} ];
r[22] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 11,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 100,
yDis: 0
}, {
index: 11,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 100,
yDis: -100
}, {
index: 11,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 100,
yDis: 100
}, {
index: 11,
star: 0,
powerup: 1,
highlighter: 0,
catched: 0,
xDis: 100,
yDis: 0
}, {
index: 11,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 100,
yDis: -100
}, {
index: 11,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 100,
yDis: 100
} ];
r[23] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 11,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: -150
}, {
index: 1,
star: 1,
powerup: 2,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: 150
}, {
index: 11,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: -150
}, {
index: 11,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: 150
}, {
index: 2,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: -150
}, {
index: 11,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: 150
}, {
index: 11,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: -150
}, {
index: 5,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: 150
}, {
index: 11,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: -150
} ];
r[24] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 7,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
} ];
r[25] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 15,
star: 0,
powerup: 2,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 7,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -250
}, {
index: 15,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -150
}, {
index: 7,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 150
}, {
index: 15,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 150
} ];
r[26] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 7,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -150
}, {
index: 7,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 150
}, {
index: 7,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -150
}, {
index: 7,
star: 1,
powerup: 2,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 150
}, {
index: 7,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -150
} ];
r[27] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 14,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
} ];
r[28] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 5,
star: 0,
powerup: 2,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: 0
}, {
index: 14,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: -150
}, {
index: 0,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: -150
}, {
index: 14,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: 150
}, {
index: 5,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: 150
} ];
r[29] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 14,
star: 0,
powerup: 2,
highlighter: 0,
catched: 0,
xDis: 100,
yDis: 0
}, {
index: 14,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 100,
yDis: -200
}, {
index: 14,
star: 1,
powerup: 1,
highlighter: 0,
catched: 0,
xDis: 100,
yDis: 200
}, {
index: 14,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 100,
yDis: -200
}, {
index: 14,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 100,
yDis: 200
}, {
index: 14,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 100,
yDis: -200
} ];
r[30] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 4,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
} ];
r[31] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 4,
star: 1,
powerup: 2,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 170
}, {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -170
}, {
index: 4,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -170
}, {
index: 0,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 170
}, {
index: 4,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 170
} ];
r[32] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 4,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 40,
yDis: 100
}, {
index: 4,
star: 0,
powerup: 2,
highlighter: 0,
catched: 0,
xDis: 40,
yDis: -100
}, {
index: 4,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 40,
yDis: 100
}, {
index: 4,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 40,
yDis: -100
}, {
index: 4,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 40,
yDis: 0
}, {
index: 4,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 40,
yDis: 100
}, {
index: 4,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 40,
yDis: -100
}, {
index: 4,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 40,
yDis: 100
} ];
r[33] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 4,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -100
}, {
index: 14,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 100
}, {
index: 4,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -100
}, {
index: 4,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 100
}, {
index: 7,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -100
}, {
index: 4,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 100
}, {
index: 4,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -100
}, {
index: 5,
star: 0,
powerup: 1,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 100
}, {
index: 4,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -100
} ];
r[34] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 9,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
} ];
r[35] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 9,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 30,
yDis: 0
}, {
index: 2,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 30,
yDis: -150
}, {
index: 9,
star: 0,
powerup: 2,
highlighter: 0,
catched: 0,
xDis: 30,
yDis: -150
}, {
index: 2,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 30,
yDis: 150
}, {
index: 9,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 30,
yDis: 150
} ];
r[36] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 9,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: 0
}, {
index: 9,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: 0
}, {
index: 9,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: -100
}, {
index: 9,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: 0
}, {
index: 9,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: 100
}, {
index: 9,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 50,
yDis: 0
} ];
r[37] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 9,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -100
}, {
index: 5,
star: 0,
powerup: 2,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 100
}, {
index: 9,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -100
}, {
index: 9,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 100
}, {
index: 1,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -100
}, {
index: 9,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 100
}, {
index: 9,
star: 0,
powerup: 1,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -100
}, {
index: 4,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 100
}, {
index: 9,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -100
} ];
r[38] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 6,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
} ];
r[39] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 6,
star: 1,
powerup: 2,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 11,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -150
}, {
index: 6,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -50
}, {
index: 11,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 200
}, {
index: 6,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 200
} ];
r[40] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 6,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 6,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -100
}, {
index: 6,
star: 0,
powerup: 2,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 150
}, {
index: 6,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 6,
star: 1,
powerup: 1,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 200
}, {
index: 6,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -100
} ];
r[41] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 17,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
} ];
r[42] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 17,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 150
}, {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -150
}, {
index: 17,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -150
}, {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 150
}, {
index: 17,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 150
} ];
r[43] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 17,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 250
}, {
index: 2,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -250
}, {
index: 17,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 250
}, {
index: 17,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -250
}, {
index: 2,
star: 1,
powerup: 2,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 250
}, {
index: 17,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -250
} ];
r[44] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 8,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
} ];
r[45] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 8,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 8,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -170
}, {
index: 8,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 170
}, {
index: 8,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -170
}, {
index: 8,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 170
}, {
index: 8,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -170
} ];
r[46] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 18,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
} ];
r[47] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 18,
star: 1,
powerup: 2,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 2,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 200
}, {
index: 18,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -200
} ];
r[48] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 18,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 18,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 130
}, {
index: 9,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 130
}, {
index: 18,
star: 1,
powerup: 1,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -130
}, {
index: 18,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -130
} ];
r[49] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 16,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
} ];
r[50] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 16,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 150
}, {
index: 0,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 16,
star: 0,
powerup: 2,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -150
}, {
index: 0,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 16,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 150
}, {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 16,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -150
}, {
index: 0,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 16,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 150
} ];
r[51] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 10,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
} ];
r[52] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 10,
star: 1,
powerup: 2,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 8,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 100,
yDis: -150
}, {
index: 10,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 4,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 150
}, {
index: 10,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
} ];
r[53] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 10,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 10,
star: 0,
powerup: 2,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 10,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -150
}, {
index: 0,
star: 1,
powerup: 1,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 10,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 10,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 150
}, {
index: 10,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
} ];
r[54] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 12,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
} ];
r[55] = [ {
index: 0,
star: 0,
powerup: 2,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 12,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -150
}, {
index: 12,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 150
}, {
index: 16,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -150
}, {
index: 12,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 150
}, {
index: 12,
star: 0,
powerup: 1,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -150
}, {
index: 10,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 150
}, {
index: 12,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -150
}, {
index: 12,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 150
} ];
r[56] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 19,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
} ];
r[57] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 19,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 19,
star: 1,
powerup: 2,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -150
}, {
index: 19,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -150
}, {
index: 19,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: -150
}, {
index: 19,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 150
}, {
index: 19,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 150
}, {
index: 19,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 150
} ];
r[58] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 13,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 13,
star: 1,
powerup: 2,
highlighter: 0,
catched: 0,
xDis: 100,
yDis: -100
}, {
index: 13,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 100,
yDis: 100
}, {
index: 0,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 200,
yDis: -100
}, {
index: 13,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 200,
yDis: 200
} ];
r[59] = [ {
index: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 1,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 2,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 3,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 4,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 5,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 6,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 7,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 8,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 10,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 10,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 11,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 12,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 13,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 14,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 15,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 16,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 17,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 18,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
}, {
index: 19,
star: 1,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
} ];
t.exports = r;
cc._RF.pop();
}, {} ],
customization_screen_controller: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "91c07dvv0FHcpc0lgjqk7iL", "customization_screen_controller");
var r = e("shifty"), n = e("scene");
e("event");
cc.Class({
extends: cc.Component,
properties: {
outfit_template: cc.Prefab,
ball_template: cc.Prefab,
playerSkinFrames: [ cc.SpriteFrame ],
handsSkinFrames: [ cc.SpriteFrame ],
ballSkinFrames: [ cc.SpriteFrame ]
},
onLoad: function() {
window.cus = this;
this.touchComplete = 0;
this.ballView = this.node.getChildByName("scrollView_ball");
this.outfitView = this.node.getChildByName("scrollView_outfit");
this.ballContainer = this.ballView.getChildByName("view").getChildByName("content");
this.outfitContainer = this.outfitView.getChildByName("view").getChildByName("content");
this.storeData = null;
this.unlockAudio = this.node.getComponent(cc.AudioSource);
this.hide();
this.loadOutfits();
this.loadBalls();
this.setStoreData(this.getStoreData());
this.outfitView.active = !0;
this.ballView.active = !1;
},
playUnlockSound: function() {
n.MANAGER_SCREEN_CONTROLLER.playAudio(this.unlockAudio);
},
getCurrentOutfit: function() {
for (var e = this.getStoreData(), t = null, i = null, r = null, n = 0; n < e.playerSkins.length; n++) if (2 == e.playerSkins[n].status) {
t = e.playerSkins[n].name;
break;
}
for (n = 0; n < this.playerSkinFrames.length; n++) if (this.playerSkinFrames[n].name.split("_")[0] == t) {
i = this.playerSkinFrames[n];
r = this.handsSkinFrames[n];
break;
}
return {
outfitFrame: i,
handsFrame: r
};
},
getCurrentBallSkin: function() {
for (var e = this.getStoreData(), t = "", i = null, r = 0; r < e.ballSkins.length; r++) if (2 == e.ballSkins[r].status) {
t = e.ballSkins[r].name;
break;
}
for (r = 0; r < this.ballSkinFrames.length; r++) if (this.ballSkinFrames[r].name.split("_")[0] == t) {
i = this.ballSkinFrames[r];
break;
}
return i;
},
getStoreData: function() {
var e = n.MANAGER_SCREEN_CONTROLLER.getItem("storeData");
if (null == e) {
var t = {
activePlayerSkin: "0",
activeBallSkin: "0",
playerSkins: [],
ballSkins: []
};
t.playerSkins[t.playerSkins.length] = {
name: "0",
condition: "100 stars",
status: 2
};
for (var i = 1; i < this.playerSkinFrames.length; i++) t.playerSkins[t.playerSkins.length] = {
name: i.toString(),
condition: "100 stars",
status: 0
};
t.ballSkins[t.ballSkins.length] = {
name: "0",
condition: "100 stars",
status: 2
};
for (i = 1; i < this.ballSkinFrames.length; i++) t.ballSkins[t.ballSkins.length] = {
name: i.toString(),
condition: "100 stars",
status: 0
};
e = JSON.stringify(t);
n.MANAGER_SCREEN_CONTROLLER.setItem("storeData", e);
}
return JSON.parse(e);
},
closeCustomization: function() {
n.MANAGER_SCREEN_CONTROLLER.homeScreen();
},
setStoreData: function(e) {
n.MANAGER_SCREEN_CONTROLLER.setItem("storeData", JSON.stringify(e));
for (var t = 0; t < e.playerSkins.length; t++) for (var i = e.playerSkins[t], r = 0; r < this.outfitContainer.children.length; r++) {
var s = this.outfitContainer.children[r];
if (s.getChildByName("body").getComponent(cc.Sprite).spriteFrame.name.split("_")[0] == i.name) {
var a = s.getComponent("outfit_controller");
0 == i.status ? a.lockOutfit() : 1 == i.status ? a.unlockOutfit() : a.selectOutfit();
}
}
for (t = 0; t < e.ballSkins.length; t++) {
var o = e.ballSkins[t];
for (r = 0; r < this.ballContainer.children.length; r++) {
var c = this.ballContainer.children[r];
if (c.getChildByName("ball").getComponent(cc.Sprite).spriteFrame.name.split("_")[0] == o.name) {
a = c.getComponent("ball_template_controller");
0 == o.status ? a.lockBall() : 1 == o.status ? a.unlockBall() : a.selectBall();
}
}
}
},
loadBalls: function() {
for (var e = 0, t = 0, i = -this.ballContainer.width / 2, r = this.getStoreData(), n = 0; n < r.ballSkins.length; n++) if (2 == r.ballSkins[n].status) {
r.ballSkins[n].name;
break;
}
var s = this.ballSkinFrames.length / 2, a = this.ball_template.data.height;
for (n = 0; n < this.ballSkinFrames.length; n++) {
var o = this.ballSkinFrames[n], c = cc.instantiate(this.ball_template);
this.ballContainer.addChild(c);
c.getComponent("ball_template_controller").setBall(o);
c.x = i + t * c.width;
c.y = 0 + e * -c.height;
c.x += c.width / 2 + 20;
c.y -= c.height / 2 + 20;
c.x = c.x + 30 * t;
c.y = c.y - 30 * e;
if (3 == ++t) {
t = 0;
e++;
}
}
s % 3 != 0 && e++;
this.ballContainer.height = e * a + 30 * e + 20;
},
loadOutfits: function() {
for (var e = 0, t = 0, i = -this.outfitContainer.width / 2, r = this.getStoreData(), n = 0; n < r.playerSkins.length; n++) if (2 == r.playerSkins[n].status) {
r.playerSkins[n].name;
break;
}
var s = this.playerSkinFrames.length / 2, a = this.outfit_template.data.height;
for (n = 0; n < this.playerSkinFrames.length; n++) {
var o = this.playerSkinFrames[n], c = this.handsSkinFrames[n], h = cc.instantiate(this.outfit_template);
this.outfitContainer.addChild(h);
h.getComponent("outfit_controller").setOutfit(o, c);
h.x = i + t * h.width;
h.y = 0 + e * -h.height;
h.x += h.width / 2 + 20;
h.y -= h.height / 2 + 20;
h.x = h.x + 30 * t;
h.y = h.y - 30 * e;
if (3 == ++t) {
t = 0;
e++;
}
}
s % 3 != 0 && e++;
this.outfitContainer.height = e * a + 30 * e + 20;
},
show: function() {
var e = this, t = {
from: {
x: this.node.x,
opacity: this.node.opacity
},
to: {
x: 0,
opacity: 255
},
duration: 400,
easing: "easeOutCirc",
step: function(t) {
e.node.x = t.x;
e.node.opacity = t.opacity;
}
};
e.node.active = !0;
r.tween(t);
},
hide: function() {
var e = cc.director.getScene().getChildByName("Canvas").getComponent(cc.Canvas).designResolution, t = this, i = {
from: {
x: this.node.x,
opacity: this.node.opacity
},
to: {
x: -e.width / 2,
opacity: 0
},
duration: 400,
easing: "easeOutCirc",
step: function(e) {
t.node.x = e.x;
t.node.opacity = e.opacity;
}
};
r.tween(i).then(function() {
t.node.active = !1;
});
},
outfitButtonClick: function() {
this.outfitView.active = !0;
this.ballView.active = !1;
n.MANAGER_SCREEN_CONTROLLER.playClick();
},
ballButtonClick: function() {
this.outfitView.active = !1;
this.ballView.active = !0;
n.MANAGER_SCREEN_CONTROLLER.playClick();
}
});
cc._RF.pop();
}, {
event: "event",
scene: "scene",
shifty: "shifty"
} ],
data_controller: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "2f381Vj1I5Nu741DPY+tHnl", "data_controller");
cc.Class({
extends: cc.Component,
properties: {
playerSkinFrames: [ cc.SpriteFrame ],
handsSkinFrames: [ cc.SpriteFrame ],
ballSkinFrames: [ cc.SpriteFrame ]
},
onLoad: function() {},
start: function() {}
});
cc._RF.pop();
}, {} ],
deathBorderController: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "2f204e6HThBiq41+heyc9fs", "deathBorderController");
var r = e("scene");
cc.Class({
extends: cc.Component,
properties: {
margin: 1e4
},
onLoad: function() {
this.play_screen_controller = this.node.parent.getComponent("play_screen_controller");
this.ballOutOfAreaSound = this.node.getComponent(cc.AudioSource);
window.db = this;
this.ignoreThisCollision = !1;
console.log("on load db");
},
start: function() {},
onCollisionExit: function(e, t) {
if ("ball" == e.node.name) {
console.log("this.ignoreThisCollision", this.ignoreThisCollision);
if (this.ignoreThisCollision) {
this.ignoreThisCollision = !1;
console.log("false the ignoreThisCollision");
} else {
console.log("db collision exit", e.node.name);
if (0 != this.play_screen_controller.getScore()) {
if (1 != r.GAMEOVER_SCREEN_CONTROLLER.win) {
r.GAMEOVER_SCREEN_CONTROLLER.win = -1;
r.MANAGER_SCREEN_CONTROLLER.playAudio(this.ballOutOfAreaSound);
this.play_screen_controller.deathEffect(function() {
r.MANAGER_SCREEN_CONTROLLER.gameoverScreen();
});
}
} else this.play_screen_controller.resetBallPosition();
}
}
},
setDeathBorder: function(e) {
this.node.x = e.position.x;
this.node.y = e.position.y;
this.node.width = this.node.getComponent(cc.BoxCollider).size.width = e.width + this.margin;
this.node.height = this.node.getComponent(cc.BoxCollider).size.height = e.height + this.margin;
}
});
cc._RF.pop();
}, {
scene: "scene"
} ],
event: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "ad1d3z3Rw9FTagvcs6ccXVg", "event");
t.exports = {
BALL_FIRST_TIME_CATCHED: "00",
BALL_IN_HANDS: "01",
BALL_OUT_HANDS: "02",
SET_CAMERA: "03",
CANVAS_NODE_MOUSE_DOWN: "04",
CANVAS_NODE_MOUSE_MOVE: "05",
CANVAS_NODE_MOUSE_UP: "06",
DISABLE_HANDS_CONTROL: "07",
ENABLE_HANDS_CONTROL: "08",
DISABLE_BALL_CONTROLS: "09",
ENABLE_BALL_CONTROLS: "10",
OUTFIT_CHANGE: "11",
BALL_CHANGE: "12",
STAR_COLLECT: "13",
RESET_BALL_POSITION: "14",
ENABLE_POWER_UP_LONG_PROJECTILE: "15",
DISABLE_POWER_UP_LONG_PROJECTILE: "16",
ENABLE_POWER_UP_MAGNET: "17",
DISABLE_POWER_UP_MAGNET: "18",
CHALLENGE_CLICKED: "19",
BALL_CATCHED: "20"
};
cc._RF.pop();
}, {} ],
finishLine: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "d927a6yQZNC24b6MwEdTtUR", "finishLine");
var r = e("scene");
cc.Class({
extends: cc.Component,
properties: {},
onCollisionEnter: function(e, t) {
if ("ball" == e.node.name && -1 != r.GAMEOVER_SCREEN_CONTROLLER.win) {
r.GAMEOVER_SCREEN_CONTROLLER.win = 1;
r.MANAGER_SCREEN_CONTROLLER.gameoverScreen();
}
}
});
cc._RF.pop();
}, {
scene: "scene"
} ],
gameover_screen_controller: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "2c11eYCfbdOH4dYHsOUhpDT", "gameover_screen_controller");
var r = e("scene");
cc.Class({
extends: cc.Component,
properties: {},
onLoad: function() {
window.go = this;
this.gameover = this.node.getChildByName("gameover");
this.challenge_complete = this.node.getChildByName("challenge_complete");
this.challenge_fail = this.node.getChildByName("challenge_fail");
this.gameOverAnimation = this.node.getComponent(cc.Animation);
this.playPartyPooper = !1;
this.successAudio = this.node.getChildByName("successAudio").getComponent(cc.AudioSource);
this.endConditionSet = !1;
this.win = 0;
this.node.active = !1;
},
hide: function(e) {
"undefined" == typeof e && (e = function() {});
this.node.active = !1;
e();
this.win = 0;
},
homeButtonClick: function() {
this.win = 0;
r.MANAGER_SCREEN_CONTROLLER.homeScreen();
r.MANAGER_SCREEN_CONTROLLER.playClick();
},
nextChallengeClick: function() {
this.win = 0;
r.PLAY_SCREEN_CONTROLLER.challengeIndex++;
r.MANAGER_SCREEN_CONTROLLER.playScreen();
r.MANAGER_SCREEN_CONTROLLER.playClick();
},
reloadButtonClick: function() {
this.win = 0;
r.MANAGER_SCREEN_CONTROLLER.playScreen();
r.MANAGER_SCREEN_CONTROLLER.playClick();
},
reloadChallengeClick: function() {
this.win = 0;
r.MANAGER_SCREEN_CONTROLLER.playScreen();
r.MANAGER_SCREEN_CONTROLLER.playClick();
},
hideAll: function() {
this.gameover.active = !1;
this.challenge_complete.active = !1;
this.challenge_fail.active = !1;
},
show: function() {
var e = r.PLAY_SCREEN_CONTROLLER;
"INFINITE" == e.mode ? this.showGameover() : "CHALLENGE" == e.mode && (1 == this.win ? this.showChallenegeComplete() : this.showChallenegeFail());
r.POWERUP_MANAGER.reset();
},
showGameover: function(e) {
"undefined" == typeof e && (e = function() {});
this.hideAll();
this.node.opacity = 0;
this.node.active = !0;
this.gameover.active = !0;
this.gameOverAnimation.play();
this.gameover.active = !0;
var t = r.MANAGER_SCREEN_CONTROLLER.getItem("score"), i = r.MANAGER_SCREEN_CONTROLLER.getItem("highScore");
i = null == i ? 0 : i;
t = null == t ? 0 : t;
this.gameover.getChildByName("currentScore").getComponent(cc.Label).string = t;
this.gameover.getChildByName("highScoreContainer").getChildByName("highScore").getComponent(cc.Label).string = i;
if (t > i) {
r.MANAGER_SCREEN_CONTROLLER.setItem("highScore", t);
this.gameover.getChildByName("highScoreContainer").getChildByName("highScore").getComponent(cc.Label).string = t;
this.gameover.getChildByName("highScoreContainer").getChildByName("newBest").active = !0;
console.log("broke the high score");
this.playPartyPooper = !0;
} else {
this.gameover.getChildByName("highScoreContainer").getChildByName("newBest").active = !1;
this.playPartyPooper = !1;
}
e();
},
showChallenegeComplete: function() {
this.hideAll();
this.node.opacity = 0;
this.node.active = !0;
this.gameOverAnimation.play();
var e = r.PLAY_SCREEN_CONTROLLER.challengeIndex + 1;
this.challenge_complete.active = !0;
this.challenge_complete.getChildByName("challenge_number").getComponent(cc.Label).string = e;
this.challenge_complete.getChildByName("next_challenge_button").opacity = 0;
var t = e + 1;
r.CHALLENGES_SCREEN_CONTROLLER.getUnlockedChallengesCount() < t && r.CHALLENGES_SCREEN_CONTROLLER.setUnlockedChallengesCount(e + 1);
this.playPartyPooper = !0;
},
showChallenegeFail: function() {
this.hideAll();
this.node.opacity = 0;
this.node.active = !0;
this.gameOverAnimation.play();
var e = r.PLAY_SCREEN_CONTROLLER.challengeIndex + 1;
this.challenge_fail.active = !0;
this.challenge_fail.getChildByName("challenge_number").getComponent(cc.Label).string = e;
this.playPartyPooper = !1;
},
animationFinished: function() {
if (this.playPartyPooper) {
this.playPartyPooper = !1;
this.node.getChildByName("partyPooper").getComponent(cc.ParticleSystem).resetSystem();
r.MANAGER_SCREEN_CONTROLLER.playAudio(this.successAudio);
}
},
animationFinished1: function() {
this.animationFinished();
}
});
cc._RF.pop();
}, {
scene: "scene"
} ],
gravity_switch_boost: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "7d803CQyG5M/JXGf44Nwit4", "gravity_switch_boost");
var r = e("scene");
cc.Class({
extends: cc.Component,
properties: {},
start: function() {},
onCollisionEnter: function(e, t) {
if ("ball" == e.node.name) {
e.getComponent("ballController").switchGravity();
r.MANAGER_SCREEN_CONTROLLER.playAudio(this.node.getComponent(cc.AudioSource));
t = this;
setTimeout(function() {
t.node.active = !1;
}, 300);
}
}
});
cc._RF.pop();
}, {
scene: "scene"
} ],
groundMover: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "b40d6ujV8JPx6227pQgU9DN", "groundMover");
var r = e("shifty"), n = e("event");
cc.Class({
extends: cc.Component,
properties: {
verticalLength: 100,
time: 1,
ground: cc.Node,
easingFunctionName: "easeInQuint"
},
onLoad: function() {
this.stopMovement = !1;
this.tween1 = null;
this.tween2 = null;
cc.systemEvent.on(n.BALL_FIRST_TIME_CATCHED, function() {
null != e.tween1 && e.tween1.pause();
null != e.tween2 && e.tween2.pause();
}, this);
var e = this, t = this.ground, i = cc.v2(t.x, t.y), s = {
from: {
x: this.node.x,
y: this.node.y
},
to: {
x: this.node.x,
y: this.node.y - this.verticalLength
},
duration: 1e3 * this.time,
easing: this.easingFunctionName,
step: function(r) {
e.node.x = r.x;
e.node.y = r.y;
t.x = i.x;
t.y = i.y;
}
}, a = {
from: {
x: this.node.x,
y: this.node.y - this.verticalLength
},
to: {
x: this.node.x,
y: this.node.y
},
duration: 1e3 * this.time,
easing: this.easingFunctionName,
step: function(r) {
e.node.x = r.x;
e.node.y = r.y;
t.x = i.x;
t.y = i.y;
}
};
(function t() {
e.tween1 = new r.Tweenable();
e.tween1.setConfig(s);
e.tween1.tween().then(function() {
e.tween2 = new r.Tweenable();
e.tween2.setConfig(a);
e.tween2.tween().then(t);
});
})();
}
});
cc._RF.pop();
}, {
event: "event",
shifty: "shifty"
} ],
groundRemover: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "351ef8HVclPa5lFKxBtJSFE", "groundRemover");
var r = e("event"), n = e("shifty");
cc.Class({
extends: cc.Component,
properties: {},
onLoad: function() {
cc.systemEvent.on(r.BALL_FIRST_TIME_CATCHED, this.removeGround, this);
},
removeGround: function(e) {
e.getUserData();
var t = this, i = {
from: {
opacity: 255
},
to: {
opacity: 0
},
duration: 300,
easing: "linear",
step: function(e) {
t.node.opacity = e.opacity;
}
};
t.node.removeComponent(cc.RigidBody);
n.tween(i).then(function() {
t.node.destroy();
});
}
});
cc._RF.pop();
}, {
event: "event",
shifty: "shifty"
} ],
groundRotator: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "dfec3VpToFIBK84GFPAyoGf", "groundRotator");
e("event"), e("shifty");
cc.Class({
extends: cc.Component,
properties: {
timeToCompleteCircle: 2
},
onLoad: function() {
var e = cc.repeatForever(cc.rotateBy(this.timeToCompleteCircle, 360));
this.node.runAction(e);
}
});
cc._RF.pop();
}, {
event: "event",
shifty: "shifty"
} ],
handsController: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "dbc81iFnoNHiK/iqngNoLut", "handsController");
var r = e("event"), n = e("scene"), s = e("shifty");
window.time = 100;
cc.Class({
extends: cc.Component,
properties: {
ballResetTime: 5
},
onLoad: function() {
window.hnds = this;
this.handsFollowBall = !1;
this.disableHandsControl = !1;
this.ballCatched = !1;
this.towardsBallTween = null;
this.towardsHandsRestTween = null;
this.handsStartPoint = cc.v2(this.node.x, this.node.y);
this.velocityMagnitude = 0;
this.ballNode = n.BALL_NODE;
this.ballController = this.ballNode.getComponent("ballController");
this.throwAudio = this.node.getChildByName("throwAudio").getComponent(cc.AudioSource);
this.catchAudio = this.node.getChildByName("catchAudio").getComponent(cc.AudioSource);
cc.systemEvent.on(r.DISABLE_HANDS_CONTROL, this.onDisableHandsControl, this);
cc.systemEvent.on(r.ENABLE_HANDS_CONTROL, this.onEnableHandsControl, this);
var e = 0, t = cc.v2(0, 0);
this.onTouchDown = function(i) {
if (!this.disableHandsControl && this.ballCatched) {
this.cancelAnimation();
t = cc.v2(i.getLocationX(), i.getLocationY());
e = 1;
}
};
this.onTouchMove = function(i) {
if (!this.disableHandsControl && this.ballCatched && 0 != e) if (1 != e) {
var r = cc.v2(i.getLocationX(), i.getLocationY()), n = Math.atan2(r.y - t.y, r.x - t.x) * (180 / Math.PI), s = Math.sqrt(Math.pow(r.x - t.x, 2) + Math.pow(r.y - t.y, 2));
this.ballAngle = -n;
var a = -(n + 90);
this.node.rotation = a;
this.ballNode.rotation = this.ballNode.ang + a;
console.log("pointerRadius", s);
if (s >= 30 && s <= 150) {
this.velocityMagnitude = 10 * s;
this.ballController.dotsArea.opacity = 200 / 120 * (s - 30);
this.ballController.dotsArea.opacity += 50;
console.log("pointerRadius>=minRadius && pointerRadius<=maxRadius", this.velocityMagnitude);
console.log("opacity", this.ballController.dotsArea.opacity);
} else if (s < 30) {
this.velocityMagnitude = 0;
this.ballController.dotsArea.opacity = 0;
console.log("pointerRadius<minRadius");
} else if (s > 150) {
this.velocityMagnitude = 1500;
this.ballController.dotsArea.opacity = 255;
s = 150;
console.log("pointerRadius>maxRadius", this.velocityMagnitude);
}
var o = this.handsStartPoint.x + s / 5 * Math.cos(n * (Math.PI / 180)), c = this.handsStartPoint.y + s / 5 * Math.sin(n * (Math.PI / 180));
this.ballController.projectionTrackTheBall(this.velocityMagnitude, this.ballAngle);
this.node.x = o;
this.node.y = c;
this.ballNode.x = this.node.parent.parent.x + this.node.parent.x + this.node.x;
this.ballNode.y = this.node.parent.parent.y + this.node.parent.y + this.node.y;
} else e++;
};
this.onTouchEnd = function(t) {
console.log(e);
if (!this.disableHandsControl && this.ballCatched && 2 == e) {
e = 0;
if (0 != this.velocityMagnitude) {
this.ballCatched = !1;
this.velocityMagnitude /= 1.4;
var i = this.ballController.getProjectilePoint(this.velocityMagnitude, this.ballAngle, 0);
this.ballController.unFreezeBall();
this.ballNode.getComponent(cc.RigidBody).linearVelocity = cc.v2(-i.Vx, i.Vy);
this.ballNode.getComponent(cc.RigidBody).angularVelocity = Math.abs(i.Vx > i.Vy ? i.Vx : i.Vy);
this.ballController.dotsArea.opacity = 0;
var r = this.node, a = {
from: {
x: this.node.x,
y: this.node.y
},
to: {
x: this.handsStartPoint.x,
y: this.handsStartPoint.y
},
duration: 20,
easing: "linear",
step: function(e) {
r.x = e.x;
r.y = e.y;
}
}, o = this;
s.tween(a).then(function() {
n.MANAGER_SCREEN_CONTROLLER.playAudio(o.throwAudio);
});
} else {
this.node.x = this.handsStartPoint.x;
this.node.y = this.handsStartPoint.y;
this.ballNode.rotation = 0;
this.node.rotation = 0;
var c = this.node;
c = new cc.Vec2(c.parent.parent.x + c.parent.x + c.x, c.parent.parent.y + c.parent.y + c.y);
this.ballNode.x = c.x;
this.ballNode.y = c.y;
}
}
};
var i = n.PLAY_SCREEN.getChildByName("screenTouch");
i.on(cc.Node.EventType.TOUCH_START, this.onTouchDown, this);
i.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
i.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
},
onCollisionEnter: function(e, t) {
if ("ball" == e.node.name) {
n.PLAY_SCREEN_CONTROLLER.ballInHands();
var i = this, a = e.node, o = this.node, c = new cc.Vec2(o.parent.parent.x + o.parent.x + o.x, o.parent.parent.y + o.parent.y + o.y), h = Math.atan2(a.y - c.y, a.x - c.x) * (180 / Math.PI);
(h = -h) <= 0 && h > -90 ? h = -h : h <= -90 && h > -180 ? h = 90 + h : h <= 180 && h > 90 ? h = 180 - h : h <= 90 && h > 0 && (h = -h);
var f = h;
a.getComponent("ballController").freezeBall();
a.getComponent("ballController").resetGravity();
i.ballCatched = !0;
var d = this.node.parent, u = d.parent, l = u.parent, p = a.x - l.x - u.x - d.x, b = a.y - l.y - u.y - d.y;
this.towardsBallTween = new s.Tweenable();
this.towardsBallTween.setConfig({
from: {
x: this.handsStartPoint.x,
y: this.handsStartPoint.y,
rotation: 0
},
to: {
x: p,
y: b,
rotation: f
},
duration: 50,
easing: "easeOutQuad",
step: function(e) {
o.x = e.x;
o.y = e.y;
o.rotation = e.rotation;
}
});
this.towardsHandsRestTween = new s.Tweenable();
this.towardsHandsRestTween.setConfig({
from: {
x: p,
y: b,
rotation: f
},
to: {
x: this.handsStartPoint.x,
y: this.handsStartPoint.y,
rotation: 0
},
duration: 500,
easing: "easeOutQuad",
step: function(e) {
o.x = e.x;
o.y = e.y;
o.rotation = e.rotation;
a.x = o.parent.x + o.parent.parent.x + e.x;
a.y = o.parent.y + o.parent.parent.y + e.y;
}
});
t = this;
this.towardsBallTween.tween().then(function() {
n.MANAGER_SCREEN_CONTROLLER.playAudio(i.catchAudio);
i.towardsHandsRestTween.tween().then(function() {
t.ballNode.ang = t.ballNode.rotation;
});
});
cc.systemEvent.dispatchEvent(new cc.Event.EventCustom(r.BALL_CATCHED, !1));
if (!this.firstTimeBallCatched) {
var g = new cc.Event.EventCustom(r.BALL_FIRST_TIME_CATCHED, !1);
g.setUserData(o);
cc.systemEvent.dispatchEvent(g);
this.firstTimeBallCatched = !0;
}
}
},
cancelAnimation: function() {
if (null != this.towardsBallTween && null != this.towardsHandsRestTween) {
this.towardsBallTween.isPlaying() && this.towardsBallTween.pause();
this.towardsHandsRestTween.isPlaying() && this.towardsHandsRestTween.pause();
this.node.x = this.handsStartPoint.x;
this.node.y = this.handsStartPoint.y;
this.ballNode.x = this.node.parent.parent.x + this.node.parent.x + this.node.x;
this.ballNode.y = this.node.parent.parent.y + this.node.parent.y + this.node.y;
this.node.rotation = 0;
}
},
removeListners: function() {
var e = n.PLAY_SCREEN.getChildByName("screenTouch");
e.off(cc.Node.EventType.TOUCH_START, this.onTouchDown, this);
e.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchDown, this);
e.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
},
onCollisionExit: function(e, t) {
if ("ball" == e.node.name) {
n.PLAY_SCREEN_CONTROLLER.ballOutHands();
this.ballCatched = !1;
}
},
onDisableHandsControl: function() {
this.disableHandsControl = !0;
},
onEnableHandsControl: function() {
this.disableHandsControl = !1;
},
update: function(e) {}
});
cc._RF.pop();
}, {
event: "event",
scene: "scene",
shifty: "shifty"
} ],
home_screen_controller: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "a6cb1wVvQ9GdYdJuHknOEmC", "home_screen_controller");
var r = e("scene"), n = null;
cc.Class({
extends: cc.Component,
properties: {},
onLoad: function() {
this.volume = !0;
this._touchComplete = 0;
this.controls = !0;
this.speakerNode = this.node.getChildByName("speaker");
this.highScoreNode = this.node.getChildByName("bestScore").getChildByName("score");
this.challengeButton = this.node.getChildByName("challengesButton");
this.fingerTutorialNode = this.node.getChildByName("fingerTutorial");
this.loadSpeakerState();
this.loadChallengeMenuChecked();
this.loadHighScore();
n = this;
window.hs = this;
r.MANAGER_SCREEN_CONTROLLER.onResize(this.adjustGui);
this.adjustGui();
},
homeScreenClick: function() {
r.PLAY_SCREEN_CONTROLLER.mode = "INFINITE";
r.MANAGER_SCREEN_CONTROLLER.playScreen();
},
loadHighScore: function() {
var e = r.MANAGER_SCREEN_CONTROLLER.getItem("highScore");
e = null == e ? 0 : e;
this.highScoreNode.getComponent(cc.Label).string = e;
},
loadChallengeMenuChecked: function() {
var e = r.MANAGER_SCREEN_CONTROLLER.getItem("challengeMenuChecked");
null == e ? this.challengeButton.getComponent(cc.Animation).play("reminder_popup") : this.challengeButton.getComponent(cc.Animation).stop("reminder_popup");
console.log("challengeMenuChecked", e);
},
remindChallenges: function() {
this.challengeButton.getComponent(cc.Animation).play("reminder_popup");
},
hide: function(e) {
"undefined" == typeof e && (e = function() {});
this.node.active = !1;
this.disableControls();
e();
},
show: function(e) {
"undefined" == typeof e && (e = function() {});
this.node.active = !0;
this.loadHighScore();
this.enableControls();
this.loadSpeakerState();
e();
},
customizationClick: function() {
r.MANAGER_SCREEN_CONTROLLER.customizationScreen();
r.MANAGER_SCREEN_CONTROLLER.playClick();
},
challengesButton: function() {
r.MANAGER_SCREEN_CONTROLLER.setItem("challengeMenuChecked", !0);
this.loadChallengeMenuChecked();
r.MANAGER_SCREEN_CONTROLLER.challengesScreen();
r.MANAGER_SCREEN_CONTROLLER.playClick();
},
loadSpeakerState: function() {
r.MANAGER_SCREEN_CONTROLLER.getAudio() ? this.setSpeakerState("on") : this.setSpeakerState("off");
},
setSpeakerState: function(e) {
if ("off" == e) {
this.volume = !1;
this.speakerNode.getChildByName("on").active = !1;
this.speakerNode.getChildByName("off").active = !0;
r.MANAGER_SCREEN_CONTROLLER.setAudio(!1);
} else {
this.volume = !0;
this.speakerNode.getChildByName("on").active = !0;
this.speakerNode.getChildByName("off").active = !1;
r.MANAGER_SCREEN_CONTROLLER.setAudio(!0);
}
},
volumeClick: function() {
r.MANAGER_SCREEN_CONTROLLER.getAudio() ? this.setSpeakerState("off") : this.setSpeakerState("on");
r.MANAGER_SCREEN_CONTROLLER.playClick();
},
tutorialClick: function() {
r.PLAY_SCREEN_CONTROLLER.secondPartTutorial();
r.MANAGER_SCREEN_CONTROLLER.playScreen();
r.MANAGER_SCREEN_CONTROLLER.playClick();
},
enableControls: function() {
this.controls = !0;
},
disableControls: function() {
this.controls = !1;
},
adjustGui: function(e) {
void 0 == e && (e = cc.view.getFrameSize());
if (e.width / e.height > 1.9) {
console.log("adjust finger");
n.fingerTutorialNode.getComponent(cc.Widget).left = .25;
n.fingerTutorialNode.getComponent(cc.Widget).bottom = .25;
} else {
n.fingerTutorialNode.getComponent(cc.Widget).left = .45;
n.fingerTutorialNode.getComponent(cc.Widget).bottom = 0;
}
n.fingerTutorialNode.getComponent(cc.Widget).updateAlignment();
}
});
cc._RF.pop();
}, {
scene: "scene"
} ],
logo_screen_controller: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "91a7cqExvBPxIsrRVTExE3K", "logo_screen_controller");
var r = e("shifty");
cc.Class({
extends: cc.Component,
properties: {
screenShowTime: 1,
screenHideTime: 2
},
onLoad: function() {
this.screenShowTime *= 1e3;
this.screenHideTime *= 1e3;
},
init: function(e) {
var t = this.screenHideTime, i = this.node;
setTimeout(function() {
i.active = !0;
var n = {
from: {
opacity: 255
},
to: {
opacity: 0
},
duration: t,
easing: "linear",
step: function(e) {
i.opacity = e.opacity;
}
};
r.tween(n).then(function() {
i.active = !1;
e();
});
}, this.screenShowTime);
},
show: function(e) {
this.node.active = !0;
e();
},
hide: function(e) {
this.node.active = !1;
e();
}
});
cc._RF.pop();
}, {
shifty: "shifty"
} ],
magnet_pull_animation: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "2ead2wBYTdAT7nWVI3kQl/R", "magnet_pull_animation");
cc.Class({
extends: cc.Component,
properties: {},
onLoad: function() {},
makeRing: function() {
var e = cc.instantiate(this.node);
this.node.parent.addChild(e);
},
finish: function() {
this.node.destroy();
}
});
cc._RF.pop();
}, {} ],
manager_screen_controller: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "a1ca4EukIJOXba5NGV2btBd", "manager_screen_controller");
var r, n, s, a, o, c, h, f = e("sjcl"), d = null;
cc.Class({
extends: cc.Component,
properties: {
logo_screen: cc.Node,
play_screen: cc.Node,
home_screen: cc.Node,
gameover_screen: cc.Node,
pause_screen: cc.Node,
customization_screen: cc.Node,
challenges_screen: cc.Node,
challenge_complete_screen: cc.Node
},
onLoad: function() {
r = this.logo_screen.getComponent("logo_screen_controller");
n = this.play_screen.getComponent("play_screen_controller");
s = this.home_screen.getComponent("home_screen_controller");
a = this.gameover_screen.getComponent("gameover_screen_controller");
o = this.pause_screen.getComponent("pause_screen_controller");
c = this.customization_screen.getComponent("customization_screen_controller");
h = this.challenges_screen.getComponent("challenges_screen_controller");
this.clickAudio = this.node.getComponent(cc.AudioSource);
this._resizeCallbacks = [];
this.currentScreen = "";
this.logoScreen();
this.resized = !1;
this.dirty = !1;
d = this;
window.ms = this;
cc.view.setResizeCallback(function() {
for (var e = 0; e < d._resizeCallbacks.length; e++) d._resizeCallbacks[e](cc.view.getFrameSize());
});
this.onResize(this.dirtyPartsPosition);
this.onResize(this.checkDeviceRotation);
setTimeout(this.checkDeviceRotation, 1e3);
},
onResize: function(e) {
d._resizeCallbacks[d._resizeCallbacks.length] = e;
},
dirtyPartsPosition: function() {
d.dirty = !0;
},
checkDeviceRotation: function() {
var e = cc.view.getViewportRect();
if (e.width < e.height) {
n.rotationalPause();
d.node.parent.getChildByName("rotateDevice").active = !0;
} else {
n.rotationalResume();
d.node.parent.getChildByName("rotateDevice").active = !1;
}
},
update: function(e) {
this.dirty && n.rotationalPause();
},
lateUpdate: function() {
if (this.dirty) {
n.rotationalResume();
this.dirty = !1;
}
},
playClick: function() {
this.playAudio(this.clickAudio);
},
logoScreen: function() {
if ("" == this.currentScreen) {
var e = this;
n.hide();
s.hide();
o.hide();
h.hide();
r.show(function() {
console.log("callback!");
setTimeout(function() {
e.homeScreen();
}, 1e3 * e.logoShowTime);
});
}
this.currentScreen = "LOGO";
},
customizationScreen: function() {
if ("HOME" == this.currentScreen) {
s.hide();
n.customizationCameraOn();
c.show();
}
this.currentScreen = "CUSTOMIZATION";
},
homeScreen: function() {
console.log(this.currentScreen, "><><<>>");
if ("LOGO" == this.currentScreen) r.hide(function() {
s.show();
n.show();
n.hideGui();
n.load("INFINITE");
n.makePart();
}); else if ("GAMEOVER" == this.currentScreen) {
console.log("over > home");
a.hide();
s.show();
s.enableControls();
n.load("INFINITE");
n.makePart();
n.show();
n.hideGui();
} else if ("CUSTOMIZATION" == this.currentScreen) {
s.show();
n.customizationCameraOff();
c.hide();
} else if ("CHALLENGES" == this.currentScreen) h.hide(); else if ("PAUSE" == this.currentScreen) {
o.hide();
s.show();
s.enableControls();
n.load("INFINITE");
n.makePart();
n.show();
n.resume();
n.hideGui();
}
this.currentScreen = "HOME";
},
challengesScreen: function() {
"HOME" == this.currentScreen && h.show();
this.currentScreen = "CHALLENGES";
},
playScreen: function() {
if ("HOME" == this.currentScreen) s.hide(function() {
n.resume();
n.makePart();
n.showGui();
}); else if ("GAMEOVER" == this.currentScreen) {
a.hide();
n.showGui();
n.resume();
n.load();
n.makePart();
n.makePart();
} else if ("CHALLENGES" == this.currentScreen) s.hide(function() {
h.hide();
n.load("CHALLENGE");
n.showGui();
n.resume();
n.makePart();
n.makePart();
}); else if ("PAUSE_RESUME" == this.currentScreen) {
o.hide();
n.showGui();
n.resume();
} else if ("PAUSE" == this.currentScreen) {
o.hide();
n.showGui();
n.resume();
n.load();
n.makePart();
n.makePart();
}
console.log(this.currentScreen, ">>>>>>");
this.currentScreen = "PLAY";
},
pauseScreen: function() {
if ("PLAY" == this.currentScreen) {
n.disableControls();
n.hideGui(!0);
n.pause();
o.show();
}
this.currentScreen = "PAUSE";
},
gameoverScreen: function() {
if ("PLAY" == this.currentScreen) {
this.currentScreen = "GAMEOVER";
n.disableControls();
n.hideGui(!0);
a.show();
}
},
setAudio: function(e) {
this.setItem("audio", e);
},
getAudio: function() {
var e = this.getItem("audio");
null == e && (e = !0);
return JSON.parse(e);
},
playAudio: function(e) {
this.getAudio() && e.play();
},
_getData: function() {
var e = cc.sys.localStorage.getItem("_000_pm_5485964");
if (null == e) {
e = JSON.stringify({});
e = f.encrypt("skldjfklsdf", e);
}
e = f.decrypt("skldjfklsdf", e);
return e = JSON.parse(e);
},
setItem: function(e, t) {
var i = this._getData();
i[e] = t;
i = JSON.stringify(i);
i = f.encrypt("skldjfklsdf", i);
cc.sys.localStorage.setItem("_000_pm_5485964", i);
},
getItem: function(e) {
var t = this._getData();
return t = void 0 == (t = t[e]) ? null : t;
}
});
cc._RF.pop();
}, {
sjcl: "sjcl"
} ],
outfit_controller: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "c48a1zpc1hLAqz5FKghZnBd", "outfit_controller");
var r = e("event"), n = e("scene");
cc.Class({
extends: cc.Component,
properties: {},
onLoad: function() {
this.lockCurtain = this.node.getChildByName("lockCurtain");
this.unlockCurtain = this.node.getChildByName("unlockCurtain");
this.selectCurtain = this.node.getChildByName("selectCurtain");
this.bodySprite = this.node.getChildByName("body").getComponent(cc.Sprite);
this.handsSprite = this.node.getChildByName("hands").getComponent(cc.Sprite);
console.log("outfit onload callled");
},
setOutfit: function(e, t) {
this.bodySprite.spriteFrame = e;
this.handsSprite.spriteFrame = t;
},
onPoint: function() {
var e = new cc.Event.EventCustom(r.OUTFIT_CHANGE, !1);
e.setUserData({
bodyFrame: this.bodySprite.spriteFrame,
handsFrame: this.handsSprite.spriteFrame
});
cc.systemEvent.dispatchEvent(e);
},
disableAllCurtains: function() {
this.lockCurtain.active = !1;
this.unlockCurtain.active = !1;
this.selectCurtain.active = !1;
},
selectOutfit: function() {
for (var e = 0; e < this.node.parent.children.length; e++) {
var t = this.node.parent.children[e].getComponent("outfit_controller");
t.selectCurtain.active && t.unlockOutfit();
}
this.disableAllCurtains();
this.selectCurtain.active = !0;
},
lockOutfit: function() {
this.disableAllCurtains();
this.lockCurtain.active = !0;
},
unlockOutfit: function() {
this.disableAllCurtains();
this.unlockCurtain.active = !0;
},
updateUnlockOutfitStoreData: function() {
for (var e = this.node.getChildByName("body").getComponent(cc.Sprite).spriteFrame.name.split("_")[0], t = n.CUSTOMIZATION_SCREEN_CONTROLLER.getStoreData(), i = 0; i < t.playerSkins.length; i++) if (t.playerSkins[i].name == e) {
t.playerSkins[i].status = 1;
n.CUSTOMIZATION_SCREEN_CONTROLLER.setStoreData(t);
break;
}
},
updateSelectOutfitStoreData: function() {
for (var e = this.node.getChildByName("body").getComponent(cc.Sprite).spriteFrame.name.split("_")[0], t = n.CUSTOMIZATION_SCREEN_CONTROLLER.getStoreData(), i = 0; i < t.playerSkins.length; i++) if (2 == t.playerSkins[i].status) {
t.playerSkins[i].status = 1;
break;
}
for (i = 0; i < t.playerSkins.length; i++) if (t.playerSkins[i].name == e) {
t.playerSkins[i].status = 2;
n.CUSTOMIZATION_SCREEN_CONTROLLER.setStoreData(t);
break;
}
},
outfitClick: function() {
if (this.lockCurtain.active) {
var e = parseInt(this.lockCurtain.getChildByName("count").getComponent(cc.Label).string), t = n.PLAY_SCREEN_CONTROLLER.getStarsCount();
e = null == e ? 0 : e;
if (t >= (e = parseInt(e))) {
n.PLAY_SCREEN_CONTROLLER.setStarsCount(t - e);
this.selectOutfit();
this.updateSelectOutfitStoreData();
(i = new cc.Event.EventCustom(r.OUTFIT_CHANGE, !1)).setUserData({
bodyFrame: this.bodySprite.spriteFrame,
handsFrame: this.handsSprite.spriteFrame
});
cc.systemEvent.dispatchEvent(i);
n.CUSTOMIZATION_SCREEN_CONTROLLER.playUnlockSound();
} else n.PLAY_SCREEN_CONTROLLER.shakeStar();
} else if (this.unlockCurtain.active) {
n.MANAGER_SCREEN_CONTROLLER.playClick();
this.selectOutfit();
this.updateSelectOutfitStoreData();
var i;
(i = new cc.Event.EventCustom(r.OUTFIT_CHANGE, !1)).setUserData({
bodyFrame: this.bodySprite.spriteFrame,
handsFrame: this.handsSprite.spriteFrame
});
cc.systemEvent.dispatchEvent(i);
}
}
});
cc._RF.pop();
}, {
event: "event",
scene: "scene"
} ],
part_manager: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "2a5aceSEktA4rV1jy+c+yYT", "part_manager");
var r = e("event");
e("scene");
cc.Class({
extends: cc.Component,
properties: {},
onLoad: function() {
window.pr = this;
var e = this.node.parent.getComponent("partsGenerator");
this.starPreb = e.star;
this.powerup_projectile = e.powerup_projectile;
this.powerup_magnet = e.powerup_magnet;
this.highlighter = e.highlighter;
this.speedBoost = e.speedBoost;
this.gravityReverseBoost = e.gravityReverseBoost;
this.player = e.player;
this.starSpawnChance = 50;
this.powerupSpawnChance = 100;
this.projectilePowerupSpawnChance = [ 0, 50 ];
this.magneticPowerupSpawnChance = [ 51, 100 ];
this.powerup_manager = this.node.parent.parent.getChildByName("powerup_manager").getComponent("powerup_manager");
this.starNode = null;
this.speedBoostList = [];
this.gravityBoostList = [];
this.currentBodyFrame = null;
this.currentHandsFrame = null;
this._activePowerup = null;
this.placePlayer();
this.placeGravityReverseBoost();
this.placeSpeedBoost();
this.truePostion = cc.v2(this.node.children[1].x, this.node.children[1].y);
cc.systemEvent.on(r.BALL_FIRST_TIME_CATCHED, this.removeBoosters, this);
},
placePlayer: function() {
var e = cc.instantiate(this.player), t = this.node.getChildByName("player");
e.x = t.x;
e.y = t.y;
this.node.removeChild(t);
this.node.addChild(e);
this.player = e;
},
removeBoosters: function() {
for (var e = "speed_boost", t = this.node.getChildByName(e); null != t; ) {
this.node.removeChild(t);
t = this.node.getChildByName(e);
}
for (e = "gravity_reverse_boost", t = this.node.getChildByName(e); null != t; ) {
this.node.removeChild(t);
t = this.node.getChildByName(e);
}
},
resetBoosters: function() {
for (var e = "speed_boost", t = this.node.getChildByName(e); null != t; ) {
this.node.removeChild(t);
t = this.node.getChildByName(e);
}
var i = this.speedBoostList;
this.speedBoostList = [];
for (var r = 0; r < i.length; r++) this.node.addChild(i[r]);
this.placeSpeedBoost();
for (e = "gravity_reverse_boost", t = this.node.getChildByName(e); null != t; ) {
this.node.removeChild(t);
t = this.node.getChildByName(e);
}
var n = this.gravityBoostList;
this.gravityBoostList = [];
for (r = 0; r < n.length; r++) this.node.addChild(n[r]);
this.placeGravityReverseBoost();
},
placeSpeedBoost: function() {
for (var e = "speedBoost", t = 0, i = this.node.getChildByName(e + t); null != i; ) {
t++;
var r = cc.instantiate(this.speedBoost);
r.getComponent(e).velocity = i.getComponent(e).velocity;
r.rotation = i.rotation;
r.x = i.x;
r.y = i.y;
this.node.addChild(r);
this.node.removeChild(i);
this.speedBoostList.push(i);
i = this.node.getChildByName(e + t);
}
},
placeGravityReverseBoost: function() {
for (var e = "gravityReverseBoost", t = 0, i = this.node.getChildByName(e + t); null != i; ) {
t++;
var r = cc.instantiate(this.gravityReverseBoost);
r.x = i.x;
r.y = i.y;
this.node.addChild(r);
this.node.removeChild(i);
this.gravityBoostList.push(i);
i = this.node.getChildByName(e + t);
}
},
placeStar: function() {
var e = cc.v2(), t = this.node.getChildByName("star");
if (null != t) {
e.x = t.x;
e.y = t.y;
this.node.removeChild(t);
} else {
e.x = this.player.x;
e.y = this.player.y + 70;
}
this.starNode = cc.instantiate(this.starPreb);
this.starNode.x = e.x;
this.starNode.y = e.y;
this.node.addChild(this.starNode);
},
removeStar: function() {},
getBallAbsSpawnPostion: function() {
var e = cc.v2(this.node.x + this.player.x, this.node.y + this.player.y + 150);
console.log(e);
return e;
},
placeProjectilePowerup: function() {
var e = cc.instantiate(this.powerup_projectile);
e.x = this.player.x;
e.y = this.player.y;
this.node.addChild(e);
this._activePowerup = e;
var t = this;
this._projectile = function() {
console.log("enable projectile");
e.getChildByName("particles").getComponent(cc.ParticleSystem).stopSystem();
this.powerup_manager.enableProjectile();
cc.systemEvent.off(r.BALL_FIRST_TIME_CATCHED, t._projectile, this);
};
cc.systemEvent.on(r.BALL_FIRST_TIME_CATCHED, this._projectile, this);
},
placeMagnetPowerup: function() {
var e = cc.instantiate(this.powerup_magnet);
e.x = this.player.x;
e.y = this.player.y;
this.node.addChild(e);
this._activePowerup = e;
var t = this;
this._magnet = function() {
e.getChildByName("particles").getComponent(cc.ParticleSystem).stopSystem();
this.powerup_manager.enableMagnet();
cc.systemEvent.off(r.BALL_FIRST_TIME_CATCHED, t._magnet, this);
};
cc.systemEvent.on(r.BALL_FIRST_TIME_CATCHED, this._magnet, this);
},
placeHighlighter: function() {
var e = this.node.getChildByName("player");
this.highlighterNode = cc.instantiate(this.highlighter);
this.highlighterNode.x = e.x;
this.highlighterNode.y = e.y;
this.highlighterNode.scale = e.scale;
this.node.addChild(this.highlighterNode, cc.macro.MAX_ZINDEX);
this.highlighterNode.getComponent(cc.Animation).play();
},
removeHighlighter: function() {
void 0 != this.highlighterNode && this.node.removeChild(this.highlighterNode);
},
setCatchState: function(e) {
this.node.getChildByName("player").getChildByName("hands").getComponent("handsController").firstTimeBallCatched = e;
},
removeListners: function() {
this.node.getChildByName("player").getChildByName("hands").getComponent("handsController").removeListners();
void 0 != this._projectile && cc.systemEvent.off(r.BALL_FIRST_TIME_CATCHED, this._projectile, this);
void 0 != this._magnet && cc.systemEvent.off(r.BALL_FIRST_TIME_CATCHED, this._magnet, this);
console.log("remove listners");
},
setOutfit: function(e, t) {
this.node.getChildByName("player").getComponent(cc.Sprite).spriteFrame = e;
this.node.getChildByName("player").getChildByName("hands").getComponent(cc.Sprite).spriteFrame = t;
},
onDestroy: function() {}
});
cc._RF.pop();
}, {
event: "event",
scene: "scene"
} ],
particles: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "bb7a6YU6XVFdLPGAClJECyC", "particles");
var r = e("scene"), n = e("shifty"), s = null;
cc.Class({
extends: cc.Component,
properties: {
particlesList: [ cc.SpriteFrame ],
horizontalAreaCover: 2e3,
verticalAreaCover: 600,
angle: -200,
spawnTimeDifference: .4,
animationTime: 7
},
onLoad: function() {
s = this;
this.startMakingParticles();
},
startMakingParticles: function() {
setInterval(this.makeParticle, 1e3 * this.spawnTimeDifference);
},
makeParticle: function() {
var e = r.CAMERA_NODE.position, t = Math.floor(Math.random() * s.horizontalAreaCover / 2), i = Math.floor(2 * Math.random()), a = s.particlesList[Math.floor(Math.random() * (s.particlesList.length + 1))];
0 == i && (t = -t);
var o = cc.v2(e.x + t, e.y + s.verticalAreaCover / 2), c = cc.v2(e.x + t + s.angle, e.y - s.verticalAreaCover / 2), h = new cc.Node();
h.scale = .5;
h.addComponent(cc.Sprite).spriteFrame = a;
s.node.addChild(h);
var f = {
from: {
x: o.x,
y: o.y,
opacity: 255,
rotation: 0
},
to: {
x: c.x,
y: c.y,
opacity: 0,
rotation: 360
},
duration: 1e3 * s.animationTime,
easing: "linear",
step: function(e) {
h.x = e.x;
h.y = e.y;
h.rotation = e.rotation;
}
};
n.tween(f).then(function() {
s.node.removeChild(h);
});
}
});
cc._RF.pop();
}, {
scene: "scene",
shifty: "shifty"
} ],
partsDefination: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "731f1DkyvdEoamE8pwcmlig", "partsDefination");
t.exports = {
part1: {
difficultyScore: 1,
notAllowedParts: []
},
part2: {
difficultyScore: 2,
notAllowedParts: []
},
part3: {
difficultyScore: 3,
notAllowedParts: []
},
part4: {
difficultyScore: 2,
notAllowedParts: []
},
part5: {
difficultyScore: 5,
notAllowedParts: []
},
part6: {
difficultyScore: 4,
notAllowedParts: []
},
part7: {
difficultyScore: 6,
notAllowedParts: []
},
part8: {
difficultyScore: 5,
notAllowedParts: []
},
part9: {
difficultyScore: 7,
notAllowedParts: []
},
part10: {
difficultyScore: 6,
notAllowedParts: []
},
part11: {
difficultyScore: 8,
notAllowedParts: []
},
part12: {
difficultyScore: 5,
notAllowedParts: []
},
part13: {
difficultyScore: 10,
notAllowedParts: []
},
part14: {
difficultyScore: 10,
notAllowedParts: []
},
part15: {
difficultyScore: 5,
notAllowedParts: []
},
part16: {
difficultyScore: 2,
notAllowedParts: []
},
part17: {
difficultyScore: 9,
notAllowedParts: []
},
part18: {
difficultyScore: 7,
notAllowedParts: []
},
part19: {
difficultyScore: 8,
notAllowedParts: []
},
part20: {
difficultyScore: 8,
notAllowedParts: []
}
};
cc._RF.pop();
}, {} ],
partsGenerator: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "5236dlWQuZPvKnB0P0oiN15", "partsGenerator");
var r = e("event"), n = e("scene"), s = e("shifty"), a = e("partsDefination"), o = null;
cc.Class({
extends: cc.Component,
properties: {
parts: [ cc.Prefab ],
star: cc.Prefab,
point: cc.Prefab,
highlighter: cc.Prefab,
powerup_projectile: cc.Prefab,
powerup_magnet: cc.Prefab,
finishLine: cc.Prefab,
speedBoost: cc.Prefab,
gravityReverseBoost: cc.Prefab,
player: cc.Prefab
},
onLoad: function() {
window.pg = this;
this.partsSpawnArea = this.node.parent.getChildByName("partsSpawnArea");
this.justStarted = !0;
this.part_1 = null;
this.part_2 = null;
this.partPreviousPoint = null;
this.currentOutfit = null;
this.currentBodyFrame = null;
this.currentHandsFrame = null;
this.highlighterNode = null;
this.partsData = [];
this.currentPartIndex = null;
this.ballNode = n.BALL_NODE;
this;
o = this;
this._partIndex = 0;
this._xDev = 0;
this._yDev = 0;
this._powerup = 0;
this._star = .7;
var e = n.CUSTOMIZATION_SCREEN_CONTROLLER.getCurrentOutfit();
this.currentBodyFrame = e.outfitFrame;
this.currentHandsFrame = e.handsFrame;
cc.systemEvent.on(r.OUTFIT_CHANGE, this.onOutfitChange, this);
n.MANAGER_SCREEN_CONTROLLER.onResize(this.adjustFirstPartCamera);
},
pausePartsAnimation: function() {
var e = function e(t) {
for (var i = 0; i < t.children.length; i++) e(t.children[i]);
var r = t.getComponent(cc.Animation);
null != r && r.pause();
};
null != this.part_1 && e(this.part_1);
null != this.part_2 && e(this.part_2);
},
resumePartsAnimation: function() {
var e = function e(t) {
for (var i = 0; i < t.children.length; i++) e(t.children[i]);
var r = t.getComponent(cc.Animation);
null != r && r.resume();
};
null != this.part_1 && e(this.part_1);
null != this.part_2 && e(this.part_2);
},
onOutfitChange: function(e) {
var t = e.getUserData();
this.currentBodyFrame = t.bodyFrame;
this.currentHandsFrame = t.handsFrame;
null != this.part_1 && this.part_1.getComponent("part_manager").setOutfit(this.currentBodyFrame, this.currentHandsFrame);
null != this.part_2 && this.part_2.getComponent("part_manager").setOutfit(this.currentBodyFrame, this.currentHandsFrame);
},
trashAllParts: function() {
for (;void 0 != this.partsSpawnArea.children[0]; ) {
var e = this.partsSpawnArea.children[0];
"finish_line" != e.name && e.getComponent("part_manager").removeListners();
this.partsSpawnArea.removeChild(e);
}
this.part_1 = null;
this.part_2 = null;
},
trashPart: function(e) {
e.removeListners();
this.partsSpawnArea.removeChild(e);
this.part_1 = null;
this.part_2 = null;
},
reset: function() {
console.log("reset called");
this.trashAllParts();
this.makePart({
catched: 1,
powerup: 0,
star: 0
});
this.makePart();
},
resetBoosters: function() {
null != this.part_2 && this.part_2.getComponent("part_manager").resetBoosters();
},
startOver: function() {
this.trashAllParts();
this.makePart({
catched: 1,
powerup: 0,
star: 0
});
console.log("startOver called");
},
loadTutorialPart: function() {
this.trashAllParts();
this.makePart({
catched: 1,
powerup: 0,
star: 0,
highlighter: 1
});
},
removeHighliter: function() {
this.part_2.getComponent("part_manager").removeHighlighter();
},
getBallSpawnPosition: function() {
return this.part_1.getComponent("part_manager").getBallAbsSpawnPostion();
},
resetAdjustment: function() {
this._partIndex = 0;
this._yDev = 0;
this._xDev = 0;
this._powerup = 0;
this._star = .7;
},
adjustPartIndexDifficulty: function() {
this._partIndex++;
this._partIndex > this.parts.length - 1 && (this._partIndex = this.parts.length - 1);
},
adjustYDev: function() {
this._yDev += 10;
this._yDev > 100 && (this._yDev = 100);
},
adjustXDev: function() {
this._xDev += 5;
this._xDev > 100 && (this._xDev = 100);
},
adjustPowerup: function() {
this._powerup += .05;
this._powerup >= .3 && (this._powerup = 0);
},
adjustStar: function() {
this._star -= .05;
this._star < .5 && (this._star = .8);
},
_getPartIndex: function() {
if (null == this.part_2) return 0;
for (var e = a[this.part_2.name].notAllowedParts, t = [], i = 0; i <= this._partIndex; i++) {
var r = parseInt(this.parts[i].name.replace("part", ""));
-1 == e.indexOf(r) && (t[t.length] = i);
}
var n = Math.floor(Math.random() * t.length);
return void 0 == t[n] ? 0 : t[n];
},
_getPartLevel: function() {
return 0;
},
_getStar: function() {
return (Math.floor(100 * Math.random()) + 1) / 100 <= this._star ? 1 : 0;
},
_getPowerup: function() {
if ((Math.floor(100 * Math.random()) + 1) / 100 <= this._powerup) {
return Math.floor(2 * Math.random()) + 1;
}
return 0;
},
_getHighlighter: function() {
return 0;
},
_getCatched: function() {
return 0;
},
_getXDis: function() {
return Math.floor(Math.random() * this._xDev) + 1;
},
_getYDis: function() {
var e = Math.floor(Math.random() * this._yDev) + 1, t = Math.floor(2 * Math.random());
return e *= t = 0 == t ? -1 : 1;
},
getPartData: function(e) {
var t = {
index: 0,
level: 0,
star: 0,
powerup: 0,
highlighter: 1,
catched: 0,
xDis: 0,
yDis: 0
};
void 0 == (e = void 0 == e ? {} : e).index ? t.index = this._getPartIndex() : t.index = e.index;
void 0 == e.star ? t.star = this._getStar() : t.star = e.star;
void 0 == e.powerup ? t.powerup = this._getPowerup() : t.powerup = e.powerup;
void 0 == e.highlighter ? t.highlighter = this._getHighlighter() : t.highlighter = e.highlighter;
void 0 == e.catched ? t.catched = this._getCatched() : t.catched = e.catched;
void 0 == e.xDis ? t.xDis = this._getXDis() : t.xDis = e.xDis;
void 0 == e.yDis ? t.yDis = this._getYDis() : t.yDis = e.yDis;
return t;
},
makeFinishLine: function() {
this.makePart({
index: 0,
level: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
});
var e = cc.instantiate(this.finishLine);
e.x = this.part_2.x;
e.y = this.part_2.y;
this.partsSpawnArea.removeChild(this.part_2);
this.partsSpawnArea.addChild(e);
},
disableParts: function() {
null != this.part_1 && (this.part_1.active = !1);
null != this.part_2 && (this.part_2.active = !1);
},
enableParts: function() {
null != this.part_1 && (this.part_1.active = !0);
null != this.part_2 && (this.part_2.active = !0);
},
adjustFirstPartCamera: function(e) {
if (null == o.part_2) {
void 0 == e && (e = cc.view.getFrameSize());
var t = 20, i = 1;
if (e.width / e.height > 1.9) {
t = 60;
i = .8;
}
var r = {
position: cc.v2(0, t),
zoom: i
};
n.CAMERA_COMPONENT.setCamera(r);
}
},
makePart: function(e) {
e = this.getPartData(e);
var t = this.parts[e.index], i = cc.instantiate(t), r = i.getComponent("part_manager"), s = i.getChildByName("aabb");
i.name = t.name;
s.opacity = 0;
if (null == this.part_1) this.part_1 = i; else if (null == this.part_2) this.part_2 = i; else {
this.part_1 = this.part_2;
this.part_2 = i;
}
if (null == this.part_2) {
this.part_1.x = 0;
this.part_1.y = 0;
} else {
var a = this.part_1.getChildByName("aabb"), o = this.part_2.getChildByName("aabb");
this.part_2.x = this.part_1.x + a.x + a.width / 2 + o.width / 2;
this.part_2.y = this.part_1.y;
}
i.x = i.x + e.xDis;
i.y = i.y + e.yDis;
var c = 0;
if (null != this.part_2) {
var h = this.part_1.getChildByName("player"), f = h.getChildByName("hands"), d = this.part_1.x + h.x + f.x, u = this.part_1.y + h.y + f.y, l = (s = this.part_2.getChildByName("aabb"), 
this.part_2.x - s.width / 2), p = this.part_2.y + s.height / 2, b = Math.atan2(p - u, l - d) * (180 / Math.PI), g = this.ballNode.getComponent("ballController").getMaxHeight(1495, b), y = p - u;
y > g && (c = y - g);
}
console.log("heightAdjustment", c);
i.y -= c;
this.partsSpawnArea.addChild(i);
r.setOutfit(this.currentBodyFrame, this.currentHandsFrame);
1 == e.star && r.placeStar();
1 == e.powerup ? r.placeProjectilePowerup() : 2 == e.powerup && r.placeMagnetPowerup();
1 == e.highlighter && r.placeHighlighter();
1 == e.catched ? r.setCatchState(!0) : r.setCatchState(!1);
null != this.part_1 && null == this.part_2 && this.adjustFirstPartCamera();
if (null != this.part_1 && null != this.part_2) {
var m = this.part_1.getChildByName("aabb"), v = this.part_2.getChildByName("aabb"), _ = this.part_1.x + m.x, w = this.part_1.y + m.y, x = this.part_2.x + v.x, C = this.part_2.y + v.y, E = m.width, S = m.height, A = v.width, D = v.height, R = _ - E / 2, M = x - A / 2, k = R < M ? R : M, N = w + S / 2, B = C + D / 2, L = N > B ? N : B, T = _ + E / 2, O = x + A / 2, P = T > O ? T : O, I = w - S / 2, j = C - D / 2, F = I < j ? I : j;
void 0 != window.p1 && n.CANVAS_NODE.removeChild(p1);
void 0 != window.p2 && n.CANVAS_NODE.removeChild(p2);
void 0 != window.p3 && n.CANVAS_NODE.removeChild(p3);
window.p1 = cc.instantiate(this.point);
window.p2 = cc.instantiate(this.point);
window.p3 = cc.instantiate(this.point);
p1.opacity = p2.opacity = p3.opacity = 0;
n.CANVAS_NODE.addChild(p1);
n.CANVAS_NODE.addChild(p2);
n.CANVAS_NODE.addChild(p3);
var U = cc.v2(k, L), z = cc.v2(P, F);
U.x -= 0;
U.y += 0;
z.x += 0;
z.y -= 0;
var q = z.x - U.x, G = U.y - z.y, H = (cc.director.getScene().getChildByName("Canvas").getComponent(cc.Canvas).designResolution, 
cc.view.getVisibleSize()), V = H.width / q, K = H.height / G, Y = V < K ? V : K, W = cc.v2(U.x + q / 2, z.y + G / 2), X = {
position: cc.v2(W.x, W.y),
zoom: Y,
width: q,
height: G
};
p1.x = U.x;
p1.y = U.y;
p2.x = z.x;
p2.y = z.y;
p3.x = W.x;
p3.y = W.y;
n.CAMERA_COMPONENT.setCamera(X);
n.DEATH_BORDER_COMPONENT.setDeathBorder(X);
}
},
deletePart: function(e) {
var t = this, i = {
from: {
scale: this.part_1.scale,
opacity: this.part_1.opacity
},
to: {
scale: 0,
opacity: 0
},
duration: 300,
easing: "easeOutQuad",
step: function(e) {
t.part_1.opacity = e.opacity;
}
};
s.tween(i).then(function() {
t.part_1.getComponent("part_manager").removeListners();
t.partsSpawnArea.removeChild(t.part_1);
e();
});
}
});
cc._RF.pop();
}, {
event: "event",
partsDefination: "partsDefination",
scene: "scene",
shifty: "shifty"
} ],
pause_screen_controller: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "c5193DFBw5PJrXYqg/14Bow", "pause_screen_controller");
var r = e("scene");
cc.Class({
extends: cc.Component,
properties: {},
onLoad: function() {
this.disableControls = !1;
this.speakerNode = this.node.getChildByName("buttonsPanel").getChildByName("speaker");
this.loadSpeakerState();
},
start: function() {},
show: function() {
this.node.active = !0;
this.loadSpeakerState();
this.node.getComponent(cc.Animation).play("pauseAnimationIn");
r.POWERUP_MANAGER.pause();
},
hide: function() {
this.disableControls = !0;
this.node.getComponent(cc.Animation).play("pauseAnimationOut");
r.POWERUP_MANAGER.resume();
},
homeClick: function() {
console.log("home clicked");
r.POWERUP_MANAGER.reset();
r.MANAGER_SCREEN_CONTROLLER.homeScreen();
r.MANAGER_SCREEN_CONTROLLER.playClick();
},
loadSpeakerState: function() {
r.MANAGER_SCREEN_CONTROLLER.getAudio() ? this.setSpeakerState("on") : this.setSpeakerState("off");
},
setSpeakerState: function(e) {
if ("off" == e) {
this.speakerNode.getChildByName("on").active = !1;
this.speakerNode.getChildByName("off").active = !0;
r.MANAGER_SCREEN_CONTROLLER.setAudio(!1);
} else {
this.speakerNode.getChildByName("on").active = !0;
this.speakerNode.getChildByName("off").active = !1;
r.MANAGER_SCREEN_CONTROLLER.setAudio(!0);
}
},
volumeClick: function() {
r.MANAGER_SCREEN_CONTROLLER.getAudio() ? this.setSpeakerState("off") : this.setSpeakerState("on");
r.MANAGER_SCREEN_CONTROLLER.playClick();
},
reloadClick: function() {
r.PLAY_SCREEN_CONTROLLER.challengeState = "fail";
r.MANAGER_SCREEN_CONTROLLER.playScreen();
r.MANAGER_SCREEN_CONTROLLER.playClick();
},
resume: function() {
if (!this.disableControls) {
console.log("resuem clicked");
r.MANAGER_SCREEN_CONTROLLER.currentScreen = "PAUSE_RESUME";
r.MANAGER_SCREEN_CONTROLLER.playScreen();
r.MANAGER_SCREEN_CONTROLLER.playClick();
}
},
_animationComplete: function(e) {
"in" == e ? this.disableControls = !1 : "out" == e && (this.node.active = !1);
}
});
cc._RF.pop();
}, {
scene: "scene"
} ],
physicsSettings: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "dd7b7RCOdRPs6ADv2D6Vbqi", "physicsSettings");
cc.Class({
extends: cc.Component,
properties: {},
onLoad: function() {
var e = cc.director.getPhysicsManager(), t = cc.director.getCollisionManager();
e.enabled = !0;
t.enabled = !0;
e.gravity = cc.v2({
x: 0,
y: -1e3
});
cc.debug.setDisplayStats(!1);
},
pause: function() {
var e = cc.director.getPhysicsManager();
cc.director.getCollisionManager().enabled = !1;
e.enabled = !1;
}
});
cc._RF.pop();
}, {} ],
play_buttons_handler: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "45b11KDAF5Jsq60vF87kH/f", "play_buttons_handler");
var r = e("scene");
cc.Class({
extends: cc.Component,
properties: {},
onLoad: function() {},
pause: function(e) {
r.MANAGER_SCREEN_CONTROLLER.pauseScreen();
}
});
cc._RF.pop();
}, {
scene: "scene"
} ],
play_screen_controller: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "0149a5J5gtI/pRGFAryd6Bo", "play_screen_controller");
var r = e("event"), n = e("scene"), s = e("challenges");
cc.Class({
extends: cc.Component,
properties: {
cameraMid: cc.Node
},
onLoad: function() {
window.ps = this;
this.score = this.node.getChildByName("score");
this.star = this.node.getChildByName("starContainer").getChildByName("star");
this.resetBallButton = this.node.getChildByName("reset").getChildByName("button");
this.pauseButton = this.node.getChildByName("pauseButton");
this.ball = this.node.getChildByName("ball");
this.partsGenerator = this.node.getChildByName("partsSpawnArea").getComponent("partsGenerator");
this.tutorialNode = this.node.getChildByName("tutorial");
this.screenTouch = this.node.getChildByName("screenTouch");
this.challengeIndex = 0;
this.dataIndex = 0;
this.data = null;
this.mode = "INFINITE";
this.disableScore = !1;
this.tutorialNode.active = !1;
this.loadStarsCount();
cc.systemEvent.on(r.BALL_FIRST_TIME_CATCHED, this.onBallFirstTimeCatched, this);
cc.systemEvent.on(r.BALL_FIRST_TIME_CATCHED, this.addScore, this);
cc.systemEvent.on(r.STAR_COLLECT, this.addStar, this);
cc.systemEvent.on(r.RESET_BALL_POSITION, this.showResetBallButton, this);
cc.systemEvent.on(r.BALL_CATCHED, this.hideResetBallButton, this);
},
makePart: function() {
if (void 0 != this.data[this.dataIndex] || "CHALLENGE" != this.mode) {
this.adjustDifficulty();
this.partsGenerator.makePart(this.data[this.dataIndex]);
0 == this.dataIndex && this.resetBallPosition();
this.getFirstTimePlaying() && this.dataIndex > 0 && (this.tutorialNode.active = !0);
this.dataIndex++;
} else this.partsGenerator.makeFinishLine();
},
resetDifficulty: function() {
var e = function() {
return Math.floor(5 * Math.random()) + 3;
};
this._partIndex_pn = e();
this._partIndex_pc = 0;
this._xDev_pn = e();
this._xDev_pc = 0;
this._yDev_pn = e();
this._yDev_pc = 0;
this._powerup_pn = e();
this._powerup_pc = 0;
this.partsGenerator.resetAdjustment();
},
adjustDifficulty: function() {
var e = function() {
return Math.floor(5 * Math.random()) + 3;
};
if (this._partIndex_pc == this._partIndex_pn - 1) {
this.partsGenerator.adjustPartIndexDifficulty();
this._partIndex_pn = e();
this._partIndex_pc = 0;
console.log("adjusting part index...");
}
this._partIndex_pc++;
if (this._xDev_pc == this._xDev_pn - 1) {
this.partsGenerator.adjustXDev();
this._xDev_pn = e();
this._xDev_pc = 0;
console.log("adjusting xDev index...");
}
this._xDev_pc++;
if (this._yDev_pc == this._yDev_pn - 1) {
this.partsGenerator.adjustYDev();
this._yDev_pn = e();
this._yDev_pc = 0;
console.log("adjusting yDev index...");
}
this._yDev_pc++;
if (this._powerup_pc == this._powerup_pn - 1) {
this.partsGenerator.adjustPowerup();
this._powerup_pn = e();
this._powerup_pc = 0;
console.log("adjusting powerup index...");
}
this._powerup_pc++;
},
load: function(e) {
this.mode = void 0 == e ? this.mode : e;
"INFINITE" == this.mode ? this.loadInfinite() : "CHALLENGE" == this.mode ? this.loadChallenge() : console.log("mode not defined", this.mode);
},
loadInfinite: function() {
this.dataIndex = 0;
this.partsGenerator.trashAllParts();
this.setData(this.getDefaultData());
this.setScore(0);
this.resetDifficulty();
},
loadChallenge: function() {
this.loadInfinite();
this.challengeIndex = void 0 == s[this.challengeIndex] ? 0 : this.challengeIndex;
this.setData(s[this.challengeIndex]);
},
ballInHands: function() {
clearInterval(this._resetTimer);
},
ballOutHands: function() {
console.log("start timer");
var e = this;
this._resetTimer = setTimeout(function() {
e.showResetBallButton();
}, 7e3);
},
showResetBallButton: function() {
this.resetBallButton.active = !0;
this.resetBallButton.getComponent(cc.Animation).play("shakeEffect");
},
hideResetBallButton: function() {
this.resetBallButton.active = !1;
},
shakeStar: function() {
this.star.parent.getComponent(cc.Animation).play("vibrate");
n.MANAGER_SCREEN_CONTROLLER.playAudio(this.star.parent.getComponent(cc.AudioSource));
},
feedStar: function() {
this.star.parent.getComponent(cc.Animation).play("feedStar");
},
deathEffect: function(e) {
this.deadAnimationFinishCallback = e;
this.node.getComponent(cc.Animation).play();
},
deadAnimationFinish: function() {
this.deadAnimationFinishCallback();
},
getFirstTimePlaying: function() {
var e = n.MANAGER_SCREEN_CONTROLLER.getItem("firstTimePlaying");
null == e && (e = !0);
return JSON.parse(e);
},
setFirstTimePlaying: function(e) {
n.MANAGER_SCREEN_CONTROLLER.setItem("firstTimePlaying", e);
},
secondPartTutorial: function() {
this.setFirstTimePlaying(!0);
this.setData(this.getDefaultData());
this.tutorialNode.active = !0;
},
setData: function(e) {
this.data = e;
},
getDefaultData: function() {
var e = [ {
index: 0,
level: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 1,
xDis: 0,
yDis: 0
}, {
index: 0,
level: 0,
star: 0,
powerup: 0,
highlighter: 0,
catched: 0,
xDis: 0,
yDis: 0
} ];
this.getFirstTimePlaying() && (e[1].highlighter = 1);
return e;
},
loadStarsCount: function() {
this.star.getChildByName("count").getComponent(cc.Label).string = this.getStarsCount();
},
setStarsCount: function(e) {
n.MANAGER_SCREEN_CONTROLLER.setItem("stars", parseInt(e));
this.star.getChildByName("count").getComponent(cc.Label).string = e;
},
getStarsCount: function() {
var e = n.MANAGER_SCREEN_CONTROLLER.getItem("stars");
e = null == e ? 0 : e;
return parseInt(e);
},
setScore: function(e) {
e = parseInt(e);
n.MANAGER_SCREEN_CONTROLLER.setItem("score", e);
this.score.getComponent(cc.Label).string = e;
e > 0 && this.score.getComponent(cc.Animation).play();
},
getScore: function() {
var e = n.MANAGER_SCREEN_CONTROLLER.getItem("score");
e = null == e ? 0 : e;
return parseInt(e);
},
customizationCameraOn: function() {
n.CAMERA_NODE.getComponent("cameraController").customizationSceneOn();
},
customizationCameraOff: function() {
n.CAMERA_NODE.getComponent("cameraController").customizationSceneOff();
},
hideGui: function(e) {
this.score.active = !1;
this.pauseButton.active = !1;
this.resetBallButton.active = !1;
this.tutorialNode.active = !1;
this.star.active = !e;
},
showGui: function(e) {
this.score.active = !0;
this.pauseButton.active = !0;
this.star.active = !0;
},
resetBallPosition: function() {
var e = this.partsGenerator.getBallSpawnPosition();
this.ball.getComponent("ballController").teleportBall(e.x, e.y);
this.ball.getComponent("ballController").resetGravity();
this.partsGenerator.resetBoosters();
},
resetBallPositionButton: function() {
this.resetBallButton.active = !1;
this.resetBallPosition();
n.MANAGER_SCREEN_CONTROLLER.playClick();
},
hide: function(e) {
"undefined" == typeof e && (e = function() {});
this.node.active = !1;
e();
},
show: function(e) {
"undefined" == typeof e && (e = function() {});
this.node.active = !0;
e();
},
resume: function() {
n.PARTS_GENERATOR.resumePartsAnimation();
cc.director.getPhysicsManager().enabled = !0;
this.screenTouch.active = !0;
},
rotationalPause: function() {
db.ignoreThisCollision = !0;
this.node.active = !1;
},
rotationalResume: function() {
this.node.active = !0;
db.ignoreThisCollision = !1;
},
pause: function() {
n.PARTS_GENERATOR.pausePartsAnimation();
cc.director.getPhysicsManager().enabled = !1;
this.screenTouch.active = !1;
clearInterval(this._resetTimer);
n.MANAGER_SCREEN_CONTROLLER.playClick();
},
enableControls: function() {
this.screenTouch.active = !0;
},
disableControls: function() {
this.screenTouch.active = !1;
},
addScore: function() {
var e = this.getScore() + 1;
this.setScore(e);
},
addStar: function() {
var e = this.getStarsCount() + 1;
this.setStarsCount(e);
this.feedStar();
},
onBallFirstTimeCatched: function() {
if (this.getFirstTimePlaying()) {
n.PARTS_GENERATOR.removeHighliter();
this.tutorialNode.active = !1;
this.setFirstTimePlaying(!1);
}
var e = this;
n.PARTS_GENERATOR.deletePart(function() {
e.makePart();
});
}
});
cc._RF.pop();
}, {
challenges: "challenges",
event: "event",
scene: "scene"
} ],
playerController: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "8569fXjb5NBALDQwGM8GptV", "playerController");
cc.Class({
extends: cc.Component,
properties: {},
onCollisionEnter: function(e, t) {
this.node.getChildByName("hands").getComponent("handsController").onCollisionEnter(e, t);
},
onCollisionExit: function(e, t) {
this.node.getChildByName("hands").getComponent("handsController").onCollisionExit(e, t);
}
});
cc._RF.pop();
}, {} ],
playerHeighlighter: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "fcea8sx5ChGA7olOUrbkjrJ", "playerHeighlighter");
cc.Class({
extends: cc.Component,
properties: {},
onLoad: function() {
window.hi = this;
},
enable: function() {
this.node.getChildByName("highlighter").getComponent(cc.Animation).play("highlighter");
},
start: function() {}
});
cc._RF.pop();
}, {} ],
powerup_manager: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "e79cb762fNI9rENy5HtEyXo", "powerup_manager");
var r = e("event"), n = e("scene");
cc.Class({
extends: cc.Component,
properties: {},
onLoad: function() {
window.pu = this;
this.projectileContainer = this.node.getChildByName("projectile");
this.magnetContainer = this.node.getChildByName("magnet");
this.projectileContainer.active = !1;
this.magnetContainer.active = !1;
this.projectileFinishEvent = !1;
this.magnetFinishEvent = !1;
this.powerupSound = this.node.getComponent(cc.AudioSource);
this.slot1 = {
free: !0,
pos: this.projectileContainer.position
};
this.slot2 = {
free: !0,
pos: this.magnetContainer.position
};
},
reset: function() {
this.projectileContainer.getComponent(cc.Animation).stop();
this.magnetContainer.getComponent(cc.Animation).stop();
this.projectileContainer.active = !1;
this.magnetContainer.active = !1;
cc.systemEvent.dispatchEvent(new cc.Event.EventCustom(r.DISABLE_POWER_UP_LONG_PROJECTILE, !1));
cc.systemEvent.dispatchEvent(new cc.Event.EventCustom(r.DISABLE_POWER_UP_MAGNET, !1));
},
pause: function() {
if (void 0 != this.projectileContainer && void 0 != this.magnetContainer) {
this.projectileContainer.getComponent(cc.Animation).pause();
this.magnetContainer.getComponent(cc.Animation).pause();
}
},
resume: function() {
if (void 0 != this.projectileContainer && void 0 != this.magnetContainer) {
this.projectileContainer.getComponent(cc.Animation).resume();
this.magnetContainer.getComponent(cc.Animation).resume();
}
},
enablePower: function(e, t, i) {
e.active = !0;
e.scale = 0;
var r = e.getComponent(cc.Animation);
r.playAdditive("powerup_icon_anim_in");
n.MANAGER_SCREEN_CONTROLLER.playAudio(this.powerupSound);
window.anim = r;
if (void 0 == e.finishEvent) {
r.on("finished", function(e, t) {
if ("emptyPower" == t.name) {
r.play("powerup_icon_anim_out");
cc.systemEvent.dispatchEvent(new cc.Event.EventCustom(i, !1));
}
}, this);
e.finishEvent = !0;
}
r.playAdditive("emptyPower");
cc.systemEvent.dispatchEvent(new cc.Event.EventCustom(t, !1));
},
enableProjectile: function() {
this.enablePower(this.projectileContainer, r.ENABLE_POWER_UP_LONG_PROJECTILE, r.DISABLE_POWER_UP_LONG_PROJECTILE);
},
enableMagnet: function() {
this.enablePower(this.magnetContainer, r.ENABLE_POWER_UP_MAGNET, r.DISABLE_POWER_UP_MAGNET);
},
place: function(e) {}
});
cc._RF.pop();
}, {
event: "event",
scene: "scene"
} ],
sceneConstantsInit: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "a9e6fXPPRRAdaSNoL53ct6c", "sceneConstantsInit");
var r = e("scene");
cc.Class({
extends: cc.Component,
properties: {
CANVAS_NODE: cc.Node,
CAMERA_NODE: cc.Node,
PARTS_SPAWN_AREA_NODE: cc.Node,
DEATH_BORDER_NODE: cc.Node,
GAMEOVER_UI: cc.Node,
MANAGER_SCREEN: cc.Node,
PLAY_SCREEN: cc.Node,
BALL_NODE: cc.Node,
font: cc.Font
},
onLoad: function() {
r.CANVAS_NODE = this.CANVAS_NODE;
r.BALL_NODE = this.BALL_NODE;
r.CAMERA_NODE = this.CAMERA_NODE;
r.CAMERA_COMPONENT = this.CAMERA_NODE.getComponent("cameraController");
r.PARTS_SPAWN_AREA_NODE = this.PARTS_SPAWN_AREA_NODE;
r.PARTS_GENERATOR = this.PARTS_SPAWN_AREA_NODE.getComponent("partsGenerator");
r.DEATH_BORDER_COMPONENT = this.DEATH_BORDER_NODE.getComponent("deathBorderController");
r.PHYSICS_SETTINGS = this.getComponent("physicsSettings");
r.GAMEOVER_UI = this.GAMEOVER_UI;
r.MANAGER_SCREEN_CONTROLLER = this.MANAGER_SCREEN.getComponent("manager_screen_controller");
r.PLAY_SCREEN = this.PLAY_SCREEN;
r.BALL_PREFAB = this.BALL_PREFAB;
r.DOT_PREFAB = this.DOT_PREFAB;
r.TRAIL_PREFAB = this.TRAIL_PREFAB;
r.BALL_SPAWN_AREA = this.BALL_SPAWN_AREA;
r.PLAY_SCREEN_CONTROLLER = this.node.getChildByName("play_screen").getComponent("play_screen_controller");
r.CUSTOMIZATION_SCREEN_CONTROLLER = this.node.getChildByName("customization_screen").getComponent("customization_screen_controller");
r.CHALLENGES_SCREEN_CONTROLLER = this.node.getChildByName("challenges_screen").getComponent("challenges_screen_controller");
r.GAMEOVER_SCREEN_CONTROLLER = this.node.getChildByName("gameover_screen").getComponent("gameover_screen_controller");
r.POWERUP_MANAGER = this.node.getChildByName("play_screen").getChildByName("powerup_manager").getComponent("powerup_manager");
}
});
cc._RF.pop();
}, {
scene: "scene"
} ],
scene: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "85b318mzyZKL7ppI05fUUgf", "scene");
t.exports = {};
cc._RF.pop();
}, {} ],
shifty: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "dbbf7ltjIJFEK5nDyyKUeBj", "shifty");
var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
return typeof e;
} : function(e) {
return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
};
!function(e, n) {
"object" == ("undefined" == typeof i ? "undefined" : r(i)) && "object" == ("undefined" == typeof t ? "undefined" : r(t)) ? t.exports = n() : "function" == typeof define && define.amd ? define("shifty", [], n) : "object" == ("undefined" == typeof i ? "undefined" : r(i)) ? i.shifty = n() : e.shifty = n();
}(void 0, function() {
return function(e) {
function t(r) {
if (i[r]) return i[r].exports;
var n = i[r] = {
i: r,
l: !1,
exports: {}
};
return e[r].call(n.exports, n, n.exports, t), n.l = !0, n.exports;
}
var i = {};
return t.m = e, t.c = i, t.i = function(e) {
return e;
}, t.d = function(e, i, r) {
t.o(e, i) || Object.defineProperty(e, i, {
configurable: !1,
enumerable: !0,
get: r
});
}, t.n = function(e) {
var i = e && e.__esModule ? function() {
return e.default;
} : function() {
return e;
};
return t.d(i, "a", i), i;
}, t.o = function(e, t) {
return Object.prototype.hasOwnProperty.call(e, t);
}, t.p = "/assets/", t(t.s = 6);
}([ function(e, t, i) {
(function(e) {
Object.defineProperty(t, "__esModule", {
value: !0
}), t.Tweenable = t.composeEasingObject = t.scheduleUpdate = t.processTweens = t.tweenProps = void 0;
var n = function() {
function e(e, t) {
for (var i = 0; i < t.length; i++) {
var r = t[i];
r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), 
Object.defineProperty(e, r.key, r);
}
}
return function(t, i, r) {
return i && e(t.prototype, i), r && e(t, r), t;
};
}(), s = "function" == typeof Symbol && "symbol" == r(Symbol.iterator) ? function(e) {
return "undefined" == typeof e ? "undefined" : r(e);
} : function(e) {
return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : "undefined" == typeof e ? "undefined" : r(e);
}, a = Object.assign || function(e) {
for (var t = 1; t < arguments.length; t++) {
var i = arguments[t];
for (var r in i) Object.prototype.hasOwnProperty.call(i, r) && (e[r] = i[r]);
}
return e;
};
t.tween = function() {
var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t = new _(), i = t.tween(e);
return i.tweenable = t, i;
};
var o = function(e) {
if (e && e.__esModule) return e;
var t = {};
if (null != e) for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
return t.default = e, t;
}(i(5)), c = "undefined" != typeof window ? window : e, h = c.requestAnimationFrame || c.webkitRequestAnimationFrame || c.oRequestAnimationFrame || c.msRequestAnimationFrame || c.mozCancelRequestAnimationFrame && c.mozRequestAnimationFrame || setTimeout, f = function() {}, d = null, u = null, l = a({}, o), p = t.tweenProps = function(e, t, i, r, n, s, a) {
var o = e < s ? 0 : (e - s) / n;
for (var c in t) {
var h = a[c], f = h.call ? h : l[h], d = i[c];
t[c] = d + (r[c] - d) * f(o);
}
return t;
}, b = function(e, t) {
var i = e._attachment, r = e._currentState, n = e._delay, s = e._easing, a = e._originalState, o = e._duration, c = e._step, h = e._targetState, f = e._timestamp, d = f + n + o, u = t > d ? d : t, l = o - (d - u);
u >= d ? (c(h, i, l), e.stop(!0)) : (e._applyFilter("beforeTween"), u < f + n ? (u = 1, 
o = 1, f = 1) : f += n, p(u, r, a, h, o, f, s), e._applyFilter("afterTween"), c(r, i, l));
}, g = t.processTweens = function() {
for (var e = _.now(), t = d; t; ) b(t, e), t = t._next;
}, y = t.scheduleUpdate = function e() {
d && (h.call(c, e, 1e3 / 60), g());
}, m = t.composeEasingObject = function(e) {
var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "linear", i = {}, r = void 0 === t ? "undefined" : s(t);
if ("string" === r || "function" === r) for (var n in e) i[n] = t; else for (var a in e) i[a] = t[a] || "linear";
return i;
}, v = function(e) {
if (d) if (e === d) (d = e._next) && (d._previous = null), e === u && (u = null); else if (e === u) (u = e._previous)._next = null; else {
var t = e._previous, i = e._next;
t._next = i, i._previous = t;
}
}, _ = t.Tweenable = function() {
function e() {
var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : void 0;
(function(e, t) {
if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
})(this, e), this._currentState = t, this._configured = !1, this._filters = [], 
this._next = null, this._previous = null, i && this.setConfig(i);
}
return n(e, [ {
key: "_applyFilter",
value: function(e) {
var t = this._filterArgs, i = !0, r = !1, n = void 0;
try {
for (var s, a = this._filters[Symbol.iterator](); !(i = (s = a.next()).done); i = !0) {
var o = s.value[e];
o && o.apply(this, t);
}
} catch (e) {
r = !0, n = e;
} finally {
try {
!i && a.return && a.return();
} finally {
if (r) throw n;
}
}
}
}, {
key: "tween",
value: function() {
var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : void 0, i = this._attachment, r = this._configured;
return this._isTweening ? this : (void 0 === t && r || this.setConfig(t), this._timestamp = e.now(), 
this._start(this.get(), i), this.resume());
}
}, {
key: "setConfig",
value: function(t) {
var i = this, r = t.attachment, n = t.delay, s = void 0 === n ? 0 : n, o = t.duration, c = void 0 === o ? 500 : o, h = t.easing, d = t.from, u = t.promise, l = void 0 === u ? Promise : u, p = t.start, b = void 0 === p ? f : p, g = t.step, y = void 0 === g ? f : g, v = t.to;
this._configured = !0, this._attachment = r, this._pausedAtTime = null, this._scheduleId = null, 
this._delay = s, this._start = b, this._step = y, this._duration = c, this._currentState = a({}, d || this.get()), 
this._originalState = this.get(), this._targetState = a({}, v || this.get());
var _ = this._currentState;
this._targetState = a({}, _, this._targetState), this._easing = m(_, h);
var w = e.filters;
this._filters.length = 0;
for (var x in w) w[x].doesApply(_) && this._filters.push(w[x]);
return this._filterArgs = [ _, this._originalState, this._targetState, this._easing ], 
this._applyFilter("tweenCreated"), this._promise = new l(function(e, t) {
i._resolve = e, i._reject = t;
}), this._promise.catch(f), this;
}
}, {
key: "get",
value: function() {
return a({}, this._currentState);
}
}, {
key: "set",
value: function(e) {
this._currentState = e;
}
}, {
key: "pause",
value: function() {
return this._pausedAtTime = e.now(), this._isPaused = !0, v(this), this;
}
}, {
key: "resume",
value: function() {
var t = e.now();
return this._isPaused && (this._timestamp += t - this._pausedAtTime), this._isPaused = !1, 
this._isTweening = !0, null === d ? (d = this, u = this, y()) : (this._previous = u, 
this._previous._next = this, u = this), this._promise;
}
}, {
key: "seek",
value: function(t) {
t = Math.max(t, 0);
var i = e.now();
return this._timestamp + t === 0 ? this : (this._timestamp = i - t, this.isPlaying() || (this._isTweening = !0, 
this._isPaused = !1, b(this, i), this.pause()), this);
}
}, {
key: "stop",
value: function() {
var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0], t = this._attachment, i = this._currentState, r = this._easing, n = this._originalState, s = this._targetState;
return this._isTweening = !1, this._isPaused = !1, v(this), e ? (this._applyFilter("beforeTween"), 
p(1, i, n, s, 1, 0, r), this._applyFilter("afterTween"), this._applyFilter("afterTweenEnd"), 
this._resolve(i, t)) : this._reject(i, t), this;
}
}, {
key: "isPlaying",
value: function() {
return this._isTweening && !this._isPaused;
}
}, {
key: "setScheduleFunction",
value: function(t) {
e.setScheduleFunction(t);
}
}, {
key: "dispose",
value: function() {
for (var e in this) delete this[e];
}
} ]), e;
}();
_.setScheduleFunction = function(e) {
return h = e;
}, _.formulas = l, _.filters = {}, _.now = Date.now || function() {
return +new Date();
};
}).call(t, i(4));
}, function(e, t, i) {
function r(e, t, i, r, n, s) {
var a = 0, o = 0, c = 0, h = 0, f = 0, d = 0, u = function(e) {
return ((a * e + o) * e + c) * e;
}, l = function(e) {
return (3 * a * e + 2 * o) * e + c;
}, p = function(e) {
return e >= 0 ? e : 0 - e;
};
return a = 1 - (c = 3 * t) - (o = 3 * (r - t) - c), h = 1 - (d = 3 * i) - (f = 3 * (n - i) - d), 
function(e, t) {
return function(e) {
return ((h * e + f) * e + d) * e;
}(function(e, t) {
var i = void 0, r = void 0, n = void 0, s = void 0, a = void 0, o = void 0;
for (n = e, o = 0; o < 8; o++) {
if (s = u(n) - e, p(s) < t) return n;
if (a = l(n), p(a) < 1e-6) break;
n -= s / a;
}
if (r = 1, (n = e) < (i = 0)) return i;
if (n > r) return r;
for (;i < r; ) {
if (s = u(n), p(s - e) < t) return n;
e > s ? i = n : r = n, n = .5 * (r - i) + i;
}
return n;
}(e, t));
}(e, 1 / (200 * s));
}
Object.defineProperty(t, "__esModule", {
value: !0
}), t.unsetBezierFunction = t.setBezierFunction = void 0;
var n = i(0), s = function(e, t, i, n) {
return function(s) {
return r(s, e, t, i, n, 1);
};
};
t.setBezierFunction = function(e, t, i, r, a) {
var o = s(t, i, r, a);
return o.displayName = e, o.x1 = t, o.y1 = i, o.x2 = r, o.y2 = a, n.Tweenable.formulas[e] = o;
}, t.unsetBezierFunction = function(e) {
return delete n.Tweenable.formulas[e];
};
}, function(e, t, i) {
Object.defineProperty(t, "__esModule", {
value: !0
}), t.interpolate = void 0;
var r = Object.assign || function(e) {
for (var t = 1; t < arguments.length; t++) {
var i = arguments[t];
for (var r in i) Object.prototype.hasOwnProperty.call(i, r) && (e[r] = i[r]);
}
return e;
}, n = i(0), s = new n.Tweenable(), a = n.Tweenable.filters;
s._filterArgs = [];
t.interpolate = function(e, t, i, o) {
var c = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 0, h = r({}, e), f = (0, 
n.composeEasingObject)(e, o);
s._filters.length = 0;
for (var d in a) a[d].doesApply(e) && s._filters.push(a[d]);
s.set({}), s._filterArgs = [ h, e, t, f ], s._applyFilter("tweenCreated"), s._applyFilter("beforeTween");
var u = (0, n.tweenProps)(i, h, e, t, 1, c, f);
return s._applyFilter("afterTween"), u;
};
}, function(e, t, i) {
function r(e) {
return parseInt(e, 16);
}
Object.defineProperty(t, "__esModule", {
value: !0
}), t.tweenCreated = function(e, t, i) {
[ e, t, i ].forEach(b), this._tokenData = v(e);
}, t.beforeTween = function(e, t, i, r) {
var n = this._tokenData;
S(r, n), [ e, t, i ].forEach(function(e) {
return _(e, n);
});
}, t.afterTween = function(e, t, i, r) {
var n = this._tokenData;
[ e, t, i ].forEach(function(e) {
return E(e, n);
}), A(r, n);
};
var n = /(\d|-|\.)/, s = /([^\-0-9.]+)/g, a = /[0-9.-]+/g, o = function() {
var e = a.source, t = /,\s*/.source;
return new RegExp("rgb\\(" + e + t + e + t + e + "\\)", "g");
}(), c = /^.*\(/, h = /#([0-9]|[a-f]){3,6}/gi, f = function(e, t) {
return e.map(function(e, i) {
return "_" + t + "_" + i;
});
}, d = function(e) {
var t = e.match(s);
return t ? (1 === t.length || e.charAt(0).match(n)) && t.unshift("") : t = [ "", "" ], 
t.join("VAL");
}, u = function(e) {
return "rgb(" + function(e) {
return 3 === (e = e.replace(/#/, "")).length && (e = (e = e.split(""))[0] + e[0] + e[1] + e[1] + e[2] + e[2]), 
[ r(e.substr(0, 2)), r(e.substr(2, 2)), r(e.substr(4, 2)) ];
}(e).join(",") + ")";
}, l = function(e, t, i) {
var r = t.match(e), n = t.replace(e, "VAL");
return r && r.forEach(function(e) {
return n = n.replace("VAL", i(e));
}), n;
}, p = function(e) {
return l(h, e, u);
}, b = function(e) {
for (var t in e) {
var i = e[t];
"string" == typeof i && i.match(h) && (e[t] = p(i));
}
}, g = function(e) {
var t = e.match(a).map(Math.floor);
return "" + e.match(c)[0] + t.join(",") + ")";
}, y = function(e) {
return l(o, e, g);
}, m = function(e) {
return e.match(a);
}, v = function(e) {
var t = {};
for (var i in e) {
var r = e[i];
"string" == typeof r && (t[i] = {
formatString: d(r),
chunkNames: f(m(r), i)
});
}
return t;
}, _ = function(e, t) {
for (var i in t) !function(i) {
m(e[i]).forEach(function(r, n) {
return e[t[i].chunkNames[n]] = +r;
}), delete e[i];
}(i);
}, w = function(e, t) {
var i = {};
return t.forEach(function(t) {
i[t] = e[t], delete e[t];
}), i;
}, x = function(e, t) {
return t.map(function(t) {
return e[t];
});
}, C = function(e, t) {
return t.forEach(function(t) {
return e = e.replace("VAL", +t.toFixed(4));
}), e;
}, E = function(e, t) {
for (var i in t) {
var r = t[i], n = r.chunkNames, s = r.formatString, a = C(s, x(w(e, n), n));
e[i] = y(a);
}
}, S = function(e, t) {
for (var i in t) !function(i) {
var r = t[i].chunkNames, n = e[i];
if ("string" == typeof n) {
var s = n.split(" "), a = s[s.length - 1];
r.forEach(function(t, i) {
return e[t] = s[i] || a;
});
} else r.forEach(function(t) {
return e[t] = n;
});
delete e[i];
}(i);
}, A = function(e, t) {
for (var i in t) {
var r = t[i].chunkNames, n = e[r[0]];
e[i] = "string" == typeof n ? r.map(function(t) {
var i = e[t];
return delete e[t], i;
}).join(" ") : n;
}
};
t.doesApply = function(e) {
return Object.keys(e).some(function(t) {
return "string" == typeof e[t];
});
};
}, function(e, t, i) {
var n, s = "function" == typeof Symbol && "symbol" == r(Symbol.iterator) ? function(e) {
return "undefined" == typeof e ? "undefined" : r(e);
} : function(e) {
return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : "undefined" == typeof e ? "undefined" : r(e);
};
n = function() {
return this;
}();
try {
n = n || Function("return this")() || (0, eval)("this");
} catch (e) {
"object" === ("undefined" == typeof window ? "undefined" : s(window)) && (n = window);
}
e.exports = n;
}, function(e, t, i) {
Object.defineProperty(t, "__esModule", {
value: !0
});
t.linear = function(e) {
return e;
}, t.easeInQuad = function(e) {
return Math.pow(e, 2);
}, t.easeOutQuad = function(e) {
return -(Math.pow(e - 1, 2) - 1);
}, t.easeInOutQuad = function(e) {
return (e /= .5) < 1 ? .5 * Math.pow(e, 2) : -.5 * ((e -= 2) * e - 2);
}, t.easeInCubic = function(e) {
return Math.pow(e, 3);
}, t.easeOutCubic = function(e) {
return Math.pow(e - 1, 3) + 1;
}, t.easeInOutCubic = function(e) {
return (e /= .5) < 1 ? .5 * Math.pow(e, 3) : .5 * (Math.pow(e - 2, 3) + 2);
}, t.easeInQuart = function(e) {
return Math.pow(e, 4);
}, t.easeOutQuart = function(e) {
return -(Math.pow(e - 1, 4) - 1);
}, t.easeInOutQuart = function(e) {
return (e /= .5) < 1 ? .5 * Math.pow(e, 4) : -.5 * ((e -= 2) * Math.pow(e, 3) - 2);
}, t.easeInQuint = function(e) {
return Math.pow(e, 5);
}, t.easeOutQuint = function(e) {
return Math.pow(e - 1, 5) + 1;
}, t.easeInOutQuint = function(e) {
return (e /= .5) < 1 ? .5 * Math.pow(e, 5) : .5 * (Math.pow(e - 2, 5) + 2);
}, t.easeInSine = function(e) {
return 1 - Math.cos(e * (Math.PI / 2));
}, t.easeOutSine = function(e) {
return Math.sin(e * (Math.PI / 2));
}, t.easeInOutSine = function(e) {
return -.5 * (Math.cos(Math.PI * e) - 1);
}, t.easeInExpo = function(e) {
return 0 === e ? 0 : Math.pow(2, 10 * (e - 1));
}, t.easeOutExpo = function(e) {
return 1 === e ? 1 : 1 - Math.pow(2, -10 * e);
}, t.easeInOutExpo = function(e) {
return 0 === e ? 0 : 1 === e ? 1 : (e /= .5) < 1 ? .5 * Math.pow(2, 10 * (e - 1)) : .5 * (2 - Math.pow(2, -10 * --e));
}, t.easeInCirc = function(e) {
return -(Math.sqrt(1 - e * e) - 1);
}, t.easeOutCirc = function(e) {
return Math.sqrt(1 - Math.pow(e - 1, 2));
}, t.easeInOutCirc = function(e) {
return (e /= .5) < 1 ? -.5 * (Math.sqrt(1 - e * e) - 1) : .5 * (Math.sqrt(1 - (e -= 2) * e) + 1);
}, t.easeOutBounce = function(e) {
return e < 1 / 2.75 ? 7.5625 * e * e : e < 2 / 2.75 ? 7.5625 * (e -= 1.5 / 2.75) * e + .75 : e < 2.5 / 2.75 ? 7.5625 * (e -= 2.25 / 2.75) * e + .9375 : 7.5625 * (e -= 2.625 / 2.75) * e + .984375;
}, t.easeInBack = function(e) {
var t = 1.70158;
return e * e * ((t + 1) * e - t);
}, t.easeOutBack = function(e) {
var t = 1.70158;
return (e -= 1) * e * ((t + 1) * e + t) + 1;
}, t.easeInOutBack = function(e) {
var t = 1.70158;
return (e /= .5) < 1 ? e * e * ((1 + (t *= 1.525)) * e - t) * .5 : .5 * ((e -= 2) * e * ((1 + (t *= 1.525)) * e + t) + 2);
}, t.elastic = function(e) {
return -1 * Math.pow(4, -8 * e) * Math.sin((6 * e - 1) * (2 * Math.PI) / 2) + 1;
}, t.swingFromTo = function(e) {
var t = 1.70158;
return (e /= .5) < 1 ? e * e * ((1 + (t *= 1.525)) * e - t) * .5 : .5 * ((e -= 2) * e * ((1 + (t *= 1.525)) * e + t) + 2);
}, t.swingFrom = function(e) {
var t = 1.70158;
return e * e * ((t + 1) * e - t);
}, t.swingTo = function(e) {
var t = 1.70158;
return (e -= 1) * e * ((t + 1) * e + t) + 1;
}, t.bounce = function(e) {
return e < 1 / 2.75 ? 7.5625 * e * e : e < 2 / 2.75 ? 7.5625 * (e -= 1.5 / 2.75) * e + .75 : e < 2.5 / 2.75 ? 7.5625 * (e -= 2.25 / 2.75) * e + .9375 : 7.5625 * (e -= 2.625 / 2.75) * e + .984375;
}, t.bouncePast = function(e) {
return e < 1 / 2.75 ? 7.5625 * e * e : e < 2 / 2.75 ? 2 - (7.5625 * (e -= 1.5 / 2.75) * e + .75) : e < 2.5 / 2.75 ? 2 - (7.5625 * (e -= 2.25 / 2.75) * e + .9375) : 2 - (7.5625 * (e -= 2.625 / 2.75) * e + .984375);
}, t.easeFromTo = function(e) {
return (e /= .5) < 1 ? .5 * Math.pow(e, 4) : -.5 * ((e -= 2) * Math.pow(e, 3) - 2);
}, t.easeFrom = function(e) {
return Math.pow(e, 4);
}, t.easeTo = function(e) {
return Math.pow(e, .25);
};
}, function(e, t, i) {
Object.defineProperty(t, "__esModule", {
value: !0
}), t.unsetBezierFunction = t.setBezierFunction = t.interpolate = t.tween = t.Tweenable = void 0;
var r = i(2);
Object.defineProperty(t, "interpolate", {
enumerable: !0,
get: function() {
return r.interpolate;
}
});
var n = i(1);
Object.defineProperty(t, "setBezierFunction", {
enumerable: !0,
get: function() {
return n.setBezierFunction;
}
}), Object.defineProperty(t, "unsetBezierFunction", {
enumerable: !0,
get: function() {
return n.unsetBezierFunction;
}
});
var s = i(0), a = function(e) {
if (e && e.__esModule) return e;
var t = {};
if (null != e) for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
return t.default = e, t;
}(i(3));
s.Tweenable.filters.token = a, t.Tweenable = s.Tweenable, t.tween = s.tween;
} ]);
});
cc._RF.pop();
}, {} ],
sjcl: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "07f4d4QujxEVoOekRAbAylT", "sjcl");
var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
return typeof e;
} : function(e) {
return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
}, n = {
cipher: {},
hash: {},
keyexchange: {},
mode: {},
misc: {},
codec: {},
exception: {
corrupt: function(e) {
this.toString = function() {
return "CORRUPT: " + this.message;
};
this.message = e;
},
invalid: function(e) {
this.toString = function() {
return "INVALID: " + this.message;
};
this.message = e;
},
bug: function(e) {
this.toString = function() {
return "BUG: " + this.message;
};
this.message = e;
},
notReady: function(e) {
this.toString = function() {
return "NOT READY: " + this.message;
};
this.message = e;
}
}
};
n.cipher.aes = function(e) {
this.s[0][0][0] || this.O();
var t, i, r, s, a = this.s[0][4], o = this.s[1], c = 1;
if (4 !== (t = e.length) && 6 !== t && 8 !== t) throw new n.exception.invalid("invalid aes key size");
this.b = [ r = e.slice(0), s = [] ];
for (e = t; e < 4 * t + 28; e++) {
i = r[e - 1];
(0 == e % t || 8 === t && 4 == e % t) && (i = a[i >>> 24] << 24 ^ a[i >> 16 & 255] << 16 ^ a[i >> 8 & 255] << 8 ^ a[255 & i], 
0 == e % t && (i = i << 8 ^ i >>> 24 ^ c << 24, c = c << 1 ^ 283 * (c >> 7)));
r[e] = r[e - t] ^ i;
}
for (t = 0; e; t++, e--) i = r[3 & t ? e : e - 4], s[t] = 4 >= e || 4 > t ? i : o[0][a[i >>> 24]] ^ o[1][a[i >> 16 & 255]] ^ o[2][a[i >> 8 & 255]] ^ o[3][a[255 & i]];
};
n.cipher.aes.prototype = {
encrypt: function(e) {
return s(this, e, 0);
},
decrypt: function(e) {
return s(this, e, 1);
},
s: [ [ [], [], [], [], [] ], [ [], [], [], [], [] ] ],
O: function() {
var e, t, i, r, n, s, a, o = this.s[0], c = this.s[1], h = o[4], f = c[4], d = [], u = [];
for (e = 0; 256 > e; e++) u[(d[e] = e << 1 ^ 283 * (e >> 7)) ^ e] = e;
for (t = i = 0; !h[t]; t ^= r || 1, i = u[i] || 1) for (s = (s = i ^ i << 1 ^ i << 2 ^ i << 3 ^ i << 4) >> 8 ^ 255 & s ^ 99, 
h[t] = s, f[s] = t, a = 16843009 * (n = d[e = d[r = d[t]]]) ^ 65537 * e ^ 257 * r ^ 16843008 * t, 
n = 257 * d[s] ^ 16843008 * s, e = 0; 4 > e; e++) o[e][t] = n = n << 24 ^ n >>> 8, 
c[e][s] = a = a << 24 ^ a >>> 8;
for (e = 0; 5 > e; e++) o[e] = o[e].slice(0), c[e] = c[e].slice(0);
}
};
function s(e, t, i) {
if (4 !== t.length) throw new n.exception.invalid("invalid aes block size");
var r = e.b[i], s = t[0] ^ r[0], a = t[i ? 3 : 1] ^ r[1], o = t[2] ^ r[2];
t = t[i ? 1 : 3] ^ r[3];
var c, h, f, d, u = r.length / 4 - 2, l = 4, p = [ 0, 0, 0, 0 ];
e = (c = e.s[i])[0];
var b = c[1], g = c[2], y = c[3], m = c[4];
for (d = 0; d < u; d++) c = e[s >>> 24] ^ b[a >> 16 & 255] ^ g[o >> 8 & 255] ^ y[255 & t] ^ r[l], 
h = e[a >>> 24] ^ b[o >> 16 & 255] ^ g[t >> 8 & 255] ^ y[255 & s] ^ r[l + 1], f = e[o >>> 24] ^ b[t >> 16 & 255] ^ g[s >> 8 & 255] ^ y[255 & a] ^ r[l + 2], 
t = e[t >>> 24] ^ b[s >> 16 & 255] ^ g[a >> 8 & 255] ^ y[255 & o] ^ r[l + 3], l += 4, 
s = c, a = h, o = f;
for (d = 0; 4 > d; d++) p[i ? 3 & -d : d] = m[s >>> 24] << 24 ^ m[a >> 16 & 255] << 16 ^ m[o >> 8 & 255] << 8 ^ m[255 & t] ^ r[l++], 
c = s, s = a, a = o, o = t, t = c;
return p;
}
n.bitArray = {
bitSlice: function(e, t, i) {
e = n.bitArray.$(e.slice(t / 32), 32 - (31 & t)).slice(1);
return void 0 === i ? e : n.bitArray.clamp(e, i - t);
},
extract: function(e, t, i) {
var r = Math.floor(-t - i & 31);
return (-32 & (t + i - 1 ^ t) ? e[t / 32 | 0] << 32 - r ^ e[t / 32 + 1 | 0] >>> r : e[t / 32 | 0] >>> r) & (1 << i) - 1;
},
concat: function(e, t) {
if (0 === e.length || 0 === t.length) return e.concat(t);
var i = e[e.length - 1], r = n.bitArray.getPartial(i);
return 32 === r ? e.concat(t) : n.bitArray.$(t, r, 0 | i, e.slice(0, e.length - 1));
},
bitLength: function(e) {
var t = e.length;
return 0 === t ? 0 : 32 * (t - 1) + n.bitArray.getPartial(e[t - 1]);
},
clamp: function(e, t) {
if (32 * e.length < t) return e;
var i = (e = e.slice(0, Math.ceil(t / 32))).length;
t &= 31;
0 < i && t && (e[i - 1] = n.bitArray.partial(t, e[i - 1] & 2147483648 >> t - 1, 1));
return e;
},
partial: function(e, t, i) {
return 32 === e ? t : (i ? 0 | t : t << 32 - e) + 1099511627776 * e;
},
getPartial: function(e) {
return Math.round(e / 1099511627776) || 32;
},
equal: function(e, t) {
if (n.bitArray.bitLength(e) !== n.bitArray.bitLength(t)) return !1;
var i, r = 0;
for (i = 0; i < e.length; i++) r |= e[i] ^ t[i];
return 0 === r;
},
$: function(e, t, i, r) {
var s;
s = 0;
for (void 0 === r && (r = []); 32 <= t; t -= 32) r.push(i), i = 0;
if (0 === t) return r.concat(e);
for (s = 0; s < e.length; s++) r.push(i | e[s] >>> t), i = e[s] << 32 - t;
s = e.length ? e[e.length - 1] : 0;
e = n.bitArray.getPartial(s);
r.push(n.bitArray.partial(t + e & 31, 32 < t + e ? i : r.pop(), 1));
return r;
},
i: function(e, t) {
return [ e[0] ^ t[0], e[1] ^ t[1], e[2] ^ t[2], e[3] ^ t[3] ];
},
byteswapM: function(e) {
var t, i;
for (t = 0; t < e.length; ++t) i = e[t], e[t] = i >>> 24 | i >>> 8 & 65280 | (65280 & i) << 8 | i << 24;
return e;
}
};
n.codec.utf8String = {
fromBits: function(e) {
var t, i, r = "", s = n.bitArray.bitLength(e);
for (t = 0; t < s / 8; t++) 0 == (3 & t) && (i = e[t / 4]), r += String.fromCharCode(i >>> 8 >>> 8 >>> 8), 
i <<= 8;
return decodeURIComponent(escape(r));
},
toBits: function(e) {
e = unescape(encodeURIComponent(e));
var t, i = [], r = 0;
for (t = 0; t < e.length; t++) r = r << 8 | e.charCodeAt(t), 3 == (3 & t) && (i.push(r), 
r = 0);
3 & t && i.push(n.bitArray.partial(8 * (3 & t), r));
return i;
}
};
n.codec.hex = {
fromBits: function(e) {
var t, i = "";
for (t = 0; t < e.length; t++) i += (0xf00000000000 + (0 | e[t])).toString(16).substr(4);
return i.substr(0, n.bitArray.bitLength(e) / 4);
},
toBits: function(e) {
var t, i, r = [];
i = (e = e.replace(/\s|0x/g, "")).length;
e += "00000000";
for (t = 0; t < e.length; t += 8) r.push(0 ^ parseInt(e.substr(t, 8), 16));
return n.bitArray.clamp(r, 4 * i);
}
};
n.codec.base32 = {
B: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
X: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
BITS: 32,
BASE: 5,
REMAINING: 27,
fromBits: function(e, t, i) {
var r = n.codec.base32.BASE, s = n.codec.base32.REMAINING, a = "", o = 0, c = n.codec.base32.B, h = 0, f = n.bitArray.bitLength(e);
i && (c = n.codec.base32.X);
for (i = 0; a.length * r < f; ) a += c.charAt((h ^ e[i] >>> o) >>> s), o < r ? (h = e[i] << r - o, 
o += s, i++) : (h <<= r, o -= r);
for (;7 & a.length && !t; ) a += "=";
return a;
},
toBits: function(e, t) {
e = e.replace(/\s|=/g, "").toUpperCase();
var i, r, s = n.codec.base32.BITS, a = n.codec.base32.BASE, o = n.codec.base32.REMAINING, c = [], h = 0, f = n.codec.base32.B, d = 0, u = "base32";
t && (f = n.codec.base32.X, u = "base32hex");
for (i = 0; i < e.length; i++) {
if (0 > (r = f.indexOf(e.charAt(i)))) {
if (!t) try {
return n.codec.base32hex.toBits(e);
} catch (e) {}
throw new n.exception.invalid("this isn't " + u + "!");
}
h > o ? (h -= o, c.push(d ^ r >>> h), d = r << s - h) : d ^= r << s - (h += a);
}
56 & h && c.push(n.bitArray.partial(56 & h, d, 1));
return c;
}
};
n.codec.base32hex = {
fromBits: function(e, t) {
return n.codec.base32.fromBits(e, t, 1);
},
toBits: function(e) {
return n.codec.base32.toBits(e, 1);
}
};
n.codec.base64 = {
B: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
fromBits: function(e, t, i) {
var r = "", s = 0, a = n.codec.base64.B, o = 0, c = n.bitArray.bitLength(e);
i && (a = a.substr(0, 62) + "-_");
for (i = 0; 6 * r.length < c; ) r += a.charAt((o ^ e[i] >>> s) >>> 26), 6 > s ? (o = e[i] << 6 - s, 
s += 26, i++) : (o <<= 6, s -= 6);
for (;3 & r.length && !t; ) r += "=";
return r;
},
toBits: function(e, t) {
e = e.replace(/\s|=/g, "");
var i, r, s = [], a = 0, o = n.codec.base64.B, c = 0;
t && (o = o.substr(0, 62) + "-_");
for (i = 0; i < e.length; i++) {
if (0 > (r = o.indexOf(e.charAt(i)))) throw new n.exception.invalid("this isn't base64!");
26 < a ? (a -= 26, s.push(c ^ r >>> a), c = r << 32 - a) : c ^= r << 32 - (a += 6);
}
56 & a && s.push(n.bitArray.partial(56 & a, c, 1));
return s;
}
};
n.codec.base64url = {
fromBits: function(e) {
return n.codec.base64.fromBits(e, 1, 1);
},
toBits: function(e) {
return n.codec.base64.toBits(e, 1);
}
};
n.hash.sha256 = function(e) {
this.b[0] || this.O();
e ? (this.F = e.F.slice(0), this.A = e.A.slice(0), this.l = e.l) : this.reset();
};
n.hash.sha256.hash = function(e) {
return new n.hash.sha256().update(e).finalize();
};
n.hash.sha256.prototype = {
blockSize: 512,
reset: function() {
this.F = this.Y.slice(0);
this.A = [];
this.l = 0;
return this;
},
update: function(e) {
"string" == typeof e && (e = n.codec.utf8String.toBits(e));
var t, i = this.A = n.bitArray.concat(this.A, e);
t = this.l;
if (9007199254740991 < (e = this.l = t + n.bitArray.bitLength(e))) throw new n.exception.invalid("Cannot hash more than 2^53 - 1 bits");
if ("undefined" != typeof Uint32Array) {
var r = new Uint32Array(i), s = 0;
for (t = 512 + t - (512 + t & 511); t <= e; t += 512) a(this, r.subarray(16 * s, 16 * (s + 1))), 
s += 1;
i.splice(0, 16 * s);
} else for (t = 512 + t - (512 + t & 511); t <= e; t += 512) a(this, i.splice(0, 16));
return this;
},
finalize: function() {
var e, t = this.A, i = this.F;
for (e = (t = n.bitArray.concat(t, [ n.bitArray.partial(1, 1) ])).length + 2; 15 & e; e++) t.push(0);
t.push(Math.floor(this.l / 4294967296));
for (t.push(0 | this.l); t.length; ) a(this, t.splice(0, 16));
this.reset();
return i;
},
Y: [],
b: [],
O: function() {
function e(e) {
return 4294967296 * (e - Math.floor(e)) | 0;
}
for (var t, i, r = 0, n = 2; 64 > r; n++) {
i = !0;
for (t = 2; t * t <= n; t++) if (0 == n % t) {
i = !1;
break;
}
i && (8 > r && (this.Y[r] = e(Math.pow(n, .5))), this.b[r] = e(Math.pow(n, 1 / 3)), 
r++);
}
}
};
function a(e, t) {
var i, r, n, s = e.F, a = e.b, o = s[0], c = s[1], h = s[2], f = s[3], d = s[4], u = s[5], l = s[6], p = s[7];
for (i = 0; 64 > i; i++) 16 > i ? r = t[i] : (r = t[i + 1 & 15], n = t[i + 14 & 15], 
r = t[15 & i] = (r >>> 7 ^ r >>> 18 ^ r >>> 3 ^ r << 25 ^ r << 14) + (n >>> 17 ^ n >>> 19 ^ n >>> 10 ^ n << 15 ^ n << 13) + t[15 & i] + t[i + 9 & 15] | 0), 
r = r + p + (d >>> 6 ^ d >>> 11 ^ d >>> 25 ^ d << 26 ^ d << 21 ^ d << 7) + (l ^ d & (u ^ l)) + a[i], 
p = l, l = u, u = d, d = f + r | 0, f = h, h = c, o = r + ((c = o) & h ^ f & (c ^ h)) + (c >>> 2 ^ c >>> 13 ^ c >>> 22 ^ c << 30 ^ c << 19 ^ c << 10) | 0;
s[0] = s[0] + o | 0;
s[1] = s[1] + c | 0;
s[2] = s[2] + h | 0;
s[3] = s[3] + f | 0;
s[4] = s[4] + d | 0;
s[5] = s[5] + u | 0;
s[6] = s[6] + l | 0;
s[7] = s[7] + p | 0;
}
n.mode.ccm = {
name: "ccm",
G: [],
listenProgress: function(e) {
n.mode.ccm.G.push(e);
},
unListenProgress: function(e) {
-1 < (e = n.mode.ccm.G.indexOf(e)) && n.mode.ccm.G.splice(e, 1);
},
fa: function(e) {
var t, i = n.mode.ccm.G.slice();
for (t = 0; t < i.length; t += 1) i[t](e);
},
encrypt: function(e, t, i, r, s) {
var a, o = t.slice(0), c = n.bitArray, h = c.bitLength(i) / 8, f = c.bitLength(o) / 8;
s = s || 64;
r = r || [];
if (7 > h) throw new n.exception.invalid("ccm: iv must be at least 7 bytes");
for (a = 2; 4 > a && f >>> 8 * a; a++) ;
a < 15 - h && (a = 15 - h);
i = c.clamp(i, 8 * (15 - a));
t = n.mode.ccm.V(e, t, i, r, s, a);
o = n.mode.ccm.C(e, o, i, t, s, a);
return c.concat(o.data, o.tag);
},
decrypt: function(e, t, i, r, s) {
s = s || 64;
r = r || [];
var a = n.bitArray, o = a.bitLength(i) / 8, c = a.bitLength(t), h = a.clamp(t, c - s), f = a.bitSlice(t, c - s);
c = (c - s) / 8;
if (7 > o) throw new n.exception.invalid("ccm: iv must be at least 7 bytes");
for (t = 2; 4 > t && c >>> 8 * t; t++) ;
t < 15 - o && (t = 15 - o);
i = a.clamp(i, 8 * (15 - t));
h = n.mode.ccm.C(e, h, i, f, s, t);
e = n.mode.ccm.V(e, h.data, i, r, s, t);
if (!a.equal(h.tag, e)) throw new n.exception.corrupt("ccm: tag doesn't match");
return h.data;
},
na: function(e, t, i, r, s, a) {
var o = [], c = n.bitArray, h = c.i;
r = [ c.partial(8, (t.length ? 64 : 0) | r - 2 << 2 | a - 1) ];
(r = c.concat(r, i))[3] |= s;
r = e.encrypt(r);
if (t.length) for (65279 >= (i = c.bitLength(t) / 8) ? o = [ c.partial(16, i) ] : 4294967295 >= i && (o = c.concat([ c.partial(16, 65534) ], [ i ])), 
o = c.concat(o, t), t = 0; t < o.length; t += 4) r = e.encrypt(h(r, o.slice(t, t + 4).concat([ 0, 0, 0 ])));
return r;
},
V: function(e, t, i, r, s, a) {
var o = n.bitArray, c = o.i;
if ((s /= 8) % 2 || 4 > s || 16 < s) throw new n.exception.invalid("ccm: invalid tag length");
if (4294967295 < r.length || 4294967295 < t.length) throw new n.exception.bug("ccm: can't deal with 4GiB or more data");
i = n.mode.ccm.na(e, r, i, s, o.bitLength(t) / 8, a);
for (r = 0; r < t.length; r += 4) i = e.encrypt(c(i, t.slice(r, r + 4).concat([ 0, 0, 0 ])));
return o.clamp(i, 8 * s);
},
C: function(e, t, i, r, s, a) {
var o, c = n.bitArray;
o = c.i;
var h = t.length, f = c.bitLength(t), d = h / 50, u = d;
i = c.concat([ c.partial(8, a - 1) ], i).concat([ 0, 0, 0 ]).slice(0, 4);
r = c.bitSlice(o(r, e.encrypt(i)), 0, s);
if (!h) return {
tag: r,
data: []
};
for (o = 0; o < h; o += 4) o > d && (n.mode.ccm.fa(o / h), d += u), i[3]++, s = e.encrypt(i), 
t[o] ^= s[0], t[o + 1] ^= s[1], t[o + 2] ^= s[2], t[o + 3] ^= s[3];
return {
tag: r,
data: c.clamp(t, f)
};
}
};
n.mode.ocb2 = {
name: "ocb2",
encrypt: function(e, t, i, r, s, a) {
if (128 !== n.bitArray.bitLength(i)) throw new n.exception.invalid("ocb iv must be 128 bits");
var o, c = n.mode.ocb2.S, h = n.bitArray, f = h.i, d = [ 0, 0, 0, 0 ];
i = c(e.encrypt(i));
var u, l = [];
r = r || [];
s = s || 64;
for (o = 0; o + 4 < t.length; o += 4) d = f(d, u = t.slice(o, o + 4)), l = l.concat(f(i, e.encrypt(f(i, u)))), 
i = c(i);
u = t.slice(o);
t = h.bitLength(u);
o = e.encrypt(f(i, [ 0, 0, 0, t ]));
d = f(d, f((u = h.clamp(f(u.concat([ 0, 0, 0 ]), o), t)).concat([ 0, 0, 0 ]), o));
d = e.encrypt(f(d, f(i, c(i))));
r.length && (d = f(d, a ? r : n.mode.ocb2.pmac(e, r)));
return l.concat(h.concat(u, h.clamp(d, s)));
},
decrypt: function(e, t, i, r, s, a) {
if (128 !== n.bitArray.bitLength(i)) throw new n.exception.invalid("ocb iv must be 128 bits");
s = s || 64;
var o, c, h = n.mode.ocb2.S, f = n.bitArray, d = f.i, u = [ 0, 0, 0, 0 ], l = h(e.encrypt(i)), p = n.bitArray.bitLength(t) - s, b = [];
r = r || [];
for (i = 0; i + 4 < p / 32; i += 4) u = d(u, o = d(l, e.decrypt(d(l, t.slice(i, i + 4))))), 
b = b.concat(o), l = h(l);
c = p - 32 * i;
u = d(u, o = d(o = e.encrypt(d(l, [ 0, 0, 0, c ])), f.clamp(t.slice(i), c).concat([ 0, 0, 0 ])));
u = e.encrypt(d(u, d(l, h(l))));
r.length && (u = d(u, a ? r : n.mode.ocb2.pmac(e, r)));
if (!f.equal(f.clamp(u, s), f.bitSlice(t, p))) throw new n.exception.corrupt("ocb: tag doesn't match");
return b.concat(f.clamp(o, c));
},
pmac: function(e, t) {
var i, r = n.mode.ocb2.S, s = n.bitArray, a = s.i, o = [ 0, 0, 0, 0 ], c = a(c = e.encrypt([ 0, 0, 0, 0 ]), r(r(c)));
for (i = 0; i + 4 < t.length; i += 4) c = r(c), o = a(o, e.encrypt(a(c, t.slice(i, i + 4))));
i = t.slice(i);
128 > s.bitLength(i) && (c = a(c, r(c)), i = s.concat(i, [ -2147483648, 0, 0, 0 ]));
o = a(o, i);
return e.encrypt(a(r(a(c, r(c))), o));
},
S: function(e) {
return [ e[0] << 1 ^ e[1] >>> 31, e[1] << 1 ^ e[2] >>> 31, e[2] << 1 ^ e[3] >>> 31, e[3] << 1 ^ 135 * (e[0] >>> 31) ];
}
};
n.mode.gcm = {
name: "gcm",
encrypt: function(e, t, i, r, s) {
var a = t.slice(0);
t = n.bitArray;
r = r || [];
e = n.mode.gcm.C(!0, e, a, r, i, s || 128);
return t.concat(e.data, e.tag);
},
decrypt: function(e, t, i, r, s) {
var a = t.slice(0), o = n.bitArray, c = o.bitLength(a);
s = s || 128;
r = r || [];
s <= c ? (t = o.bitSlice(a, c - s), a = o.bitSlice(a, 0, c - s)) : (t = a, a = []);
e = n.mode.gcm.C(!1, e, a, r, i, s);
if (!o.equal(e.tag, t)) throw new n.exception.corrupt("gcm: tag doesn't match");
return e.data;
},
ka: function(e, t) {
var i, r, s, a, o, c = n.bitArray.i;
s = [ 0, 0, 0, 0 ];
a = t.slice(0);
for (i = 0; 128 > i; i++) {
(r = 0 != (e[Math.floor(i / 32)] & 1 << 31 - i % 32)) && (s = c(s, a));
o = 0 != (1 & a[3]);
for (r = 3; 0 < r; r--) a[r] = a[r] >>> 1 | (1 & a[r - 1]) << 31;
a[0] >>>= 1;
o && (a[0] ^= -520093696);
}
return s;
},
j: function(e, t, i) {
var r, s = i.length;
t = t.slice(0);
for (r = 0; r < s; r += 4) t[0] ^= 4294967295 & i[r], t[1] ^= 4294967295 & i[r + 1], 
t[2] ^= 4294967295 & i[r + 2], t[3] ^= 4294967295 & i[r + 3], t = n.mode.gcm.ka(t, e);
return t;
},
C: function(e, t, i, r, s, a) {
var o, c, h, f, d, u, l, p, b = n.bitArray;
u = i.length;
l = b.bitLength(i);
p = b.bitLength(r);
c = b.bitLength(s);
o = t.encrypt([ 0, 0, 0, 0 ]);
96 === c ? (s = s.slice(0), s = b.concat(s, [ 1 ])) : (s = n.mode.gcm.j(o, [ 0, 0, 0, 0 ], s), 
s = n.mode.gcm.j(o, s, [ 0, 0, Math.floor(c / 4294967296), 4294967295 & c ]));
c = n.mode.gcm.j(o, [ 0, 0, 0, 0 ], r);
d = s.slice(0);
r = c.slice(0);
e || (r = n.mode.gcm.j(o, c, i));
for (f = 0; f < u; f += 4) d[3]++, h = t.encrypt(d), i[f] ^= h[0], i[f + 1] ^= h[1], 
i[f + 2] ^= h[2], i[f + 3] ^= h[3];
i = b.clamp(i, l);
e && (r = n.mode.gcm.j(o, c, i));
e = [ Math.floor(p / 4294967296), 4294967295 & p, Math.floor(l / 4294967296), 4294967295 & l ];
r = n.mode.gcm.j(o, r, e);
h = t.encrypt(s);
r[0] ^= h[0];
r[1] ^= h[1];
r[2] ^= h[2];
r[3] ^= h[3];
return {
tag: b.bitSlice(r, 0, a),
data: i
};
}
};
n.misc.hmac = function(e, t) {
this.W = t = t || n.hash.sha256;
var i, r = [ [], [] ], s = t.prototype.blockSize / 32;
this.w = [ new t(), new t() ];
e.length > s && (e = t.hash(e));
for (i = 0; i < s; i++) r[0][i] = 909522486 ^ e[i], r[1][i] = 1549556828 ^ e[i];
this.w[0].update(r[0]);
this.w[1].update(r[1]);
this.R = new t(this.w[0]);
};
n.misc.hmac.prototype.encrypt = n.misc.hmac.prototype.mac = function(e) {
if (this.aa) throw new n.exception.invalid("encrypt on already updated hmac called!");
this.update(e);
return this.digest(e);
};
n.misc.hmac.prototype.reset = function() {
this.R = new this.W(this.w[0]);
this.aa = !1;
};
n.misc.hmac.prototype.update = function(e) {
this.aa = !0;
this.R.update(e);
};
n.misc.hmac.prototype.digest = function() {
var e = this.R.finalize();
e = new this.W(this.w[1]).update(e).finalize();
this.reset();
return e;
};
n.misc.pbkdf2 = function(e, t, i, r, s) {
i = i || 1e4;
if (0 > r || 0 > i) throw new n.exception.invalid("invalid params to pbkdf2");
"string" == typeof e && (e = n.codec.utf8String.toBits(e));
"string" == typeof t && (t = n.codec.utf8String.toBits(t));
e = new (s = s || n.misc.hmac)(e);
var a, o, c, h, f = [], d = n.bitArray;
for (h = 1; 32 * f.length < (r || 1); h++) {
s = a = e.encrypt(d.concat(t, [ h ]));
for (o = 1; o < i; o++) for (a = e.encrypt(a), c = 0; c < a.length; c++) s[c] ^= a[c];
f = f.concat(s);
}
r && (f = d.clamp(f, r));
return f;
};
n.prng = function(e) {
this.c = [ new n.hash.sha256() ];
this.m = [ 0 ];
this.P = 0;
this.H = {};
this.N = 0;
this.U = {};
this.Z = this.f = this.o = this.ha = 0;
this.b = [ 0, 0, 0, 0, 0, 0, 0, 0 ];
this.h = [ 0, 0, 0, 0 ];
this.L = void 0;
this.M = e;
this.D = !1;
this.K = {
progress: {},
seeded: {}
};
this.u = this.ga = 0;
this.I = 1;
this.J = 2;
this.ca = 65536;
this.T = [ 0, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024 ];
this.da = 3e4;
this.ba = 80;
};
n.prng.prototype = {
randomWords: function(e, t) {
var i, r, s = [];
if ((i = this.isReady(t)) === this.u) throw new n.exception.notReady("generator isn't seeded");
if (i & this.J) {
i = !(i & this.I);
r = [];
var a, o = 0;
this.Z = r[0] = new Date().valueOf() + this.da;
for (a = 0; 16 > a; a++) r.push(4294967296 * Math.random() | 0);
for (a = 0; a < this.c.length && (r = r.concat(this.c[a].finalize()), o += this.m[a], 
this.m[a] = 0, i || !(this.P & 1 << a)); a++) ;
this.P >= 1 << this.c.length && (this.c.push(new n.hash.sha256()), this.m.push(0));
this.f -= o;
o > this.o && (this.o = o);
this.P++;
this.b = n.hash.sha256.hash(this.b.concat(r));
this.L = new n.cipher.aes(this.b);
for (i = 0; 4 > i && (this.h[i] = this.h[i] + 1 | 0, !this.h[i]); i++) ;
}
for (i = 0; i < e; i += 4) 0 == (i + 1) % this.ca && h(this), r = f(this), s.push(r[0], r[1], r[2], r[3]);
h(this);
return s.slice(0, e);
},
setDefaultParanoia: function(e, t) {
if (0 === e && "Setting paranoia=0 will ruin your security; use it only for testing" !== t) throw new n.exception.invalid("Setting paranoia=0 will ruin your security; use it only for testing");
this.M = e;
},
addEntropy: function(e, t, i) {
i = i || "user";
var s, a, c = new Date().valueOf(), h = this.H[i], f = this.isReady(), d = 0;
void 0 === (s = this.U[i]) && (s = this.U[i] = this.ha++);
void 0 === h && (h = this.H[i] = 0);
this.H[i] = (this.H[i] + 1) % this.c.length;
switch ("undefined" == typeof e ? "undefined" : r(e)) {
case "number":
void 0 === t && (t = 1);
this.c[h].update([ s, this.N++, 1, t, c, 1, 0 | e ]);
break;

case "object":
if ("[object Uint32Array]" === (i = Object.prototype.toString.call(e))) {
a = [];
for (i = 0; i < e.length; i++) a.push(e[i]);
e = a;
} else for ("[object Array]" !== i && (d = 1), i = 0; i < e.length && !d; i++) "number" != typeof e[i] && (d = 1);
if (!d) {
if (void 0 === t) for (i = t = 0; i < e.length; i++) for (a = e[i]; 0 < a; ) t++, 
a >>>= 1;
this.c[h].update([ s, this.N++, 2, t, c, e.length ].concat(e));
}
break;

case "string":
void 0 === t && (t = e.length);
this.c[h].update([ s, this.N++, 3, t, c, e.length ]);
this.c[h].update(e);
break;

default:
d = 1;
}
if (d) throw new n.exception.bug("random: addEntropy only supports number, array of numbers or string");
this.m[h] += t;
this.f += t;
f === this.u && (this.isReady() !== this.u && o("seeded", Math.max(this.o, this.f)), 
o("progress", this.getProgress()));
},
isReady: function(e) {
e = this.T[void 0 !== e ? e : this.M];
return this.o && this.o >= e ? this.m[0] > this.ba && new Date().valueOf() > this.Z ? this.J | this.I : this.I : this.f >= e ? this.J | this.u : this.u;
},
getProgress: function(e) {
e = this.T[e || this.M];
return this.o >= e ? 1 : this.f > e ? 1 : this.f / e;
},
startCollectors: function() {
if (!this.D) {
this.a = {
loadTimeCollector: d(this, this.ma),
mouseCollector: d(this, this.oa),
keyboardCollector: d(this, this.la),
accelerometerCollector: d(this, this.ea),
touchCollector: d(this, this.qa)
};
if (window.addEventListener) window.addEventListener("load", this.a.loadTimeCollector, !1), 
window.addEventListener("mousemove", this.a.mouseCollector, !1), window.addEventListener("keypress", this.a.keyboardCollector, !1), 
window.addEventListener("devicemotion", this.a.accelerometerCollector, !1), window.addEventListener("touchmove", this.a.touchCollector, !1); else {
if (!document.attachEvent) throw new n.exception.bug("can't attach event");
document.attachEvent("onload", this.a.loadTimeCollector), document.attachEvent("onmousemove", this.a.mouseCollector), 
document.attachEvent("keypress", this.a.keyboardCollector);
}
this.D = !0;
}
},
stopCollectors: function() {
this.D && (window.removeEventListener ? (window.removeEventListener("load", this.a.loadTimeCollector, !1), 
window.removeEventListener("mousemove", this.a.mouseCollector, !1), window.removeEventListener("keypress", this.a.keyboardCollector, !1), 
window.removeEventListener("devicemotion", this.a.accelerometerCollector, !1), window.removeEventListener("touchmove", this.a.touchCollector, !1)) : document.detachEvent && (document.detachEvent("onload", this.a.loadTimeCollector), 
document.detachEvent("onmousemove", this.a.mouseCollector), document.detachEvent("keypress", this.a.keyboardCollector)), 
this.D = !1);
},
addEventListener: function(e, t) {
this.K[e][this.ga++] = t;
},
removeEventListener: function(e, t) {
var i, r, n = this.K[e], s = [];
for (r in n) n.hasOwnProperty(r) && n[r] === t && s.push(r);
for (i = 0; i < s.length; i++) delete n[r = s[i]];
},
la: function() {
c(this, 1);
},
oa: function(e) {
var t, i;
try {
t = e.x || e.clientX || e.offsetX || 0, i = e.y || e.clientY || e.offsetY || 0;
} catch (e) {
i = t = 0;
}
0 != t && 0 != i && this.addEntropy([ t, i ], 2, "mouse");
c(this, 0);
},
qa: function(e) {
e = e.touches[0] || e.changedTouches[0];
this.addEntropy([ e.pageX || e.clientX, e.pageY || e.clientY ], 1, "touch");
c(this, 0);
},
ma: function() {
c(this, 2);
},
ea: function(e) {
e = e.accelerationIncludingGravity.x || e.accelerationIncludingGravity.y || e.accelerationIncludingGravity.z;
if (window.orientation) {
var t = window.orientation;
"number" == typeof t && this.addEntropy(t, 1, "accelerometer");
}
e && this.addEntropy(e, 2, "accelerometer");
c(this, 0);
}
};
function o(e, t) {
var i, r = n.random.K[e], s = [];
for (i in r) r.hasOwnProperty(i) && s.push(r[i]);
for (i = 0; i < s.length; i++) s[i](t);
}
function c(e, t) {
"undefined" != typeof window && window.performance && "function" == typeof window.performance.now ? e.addEntropy(window.performance.now(), t, "loadtime") : e.addEntropy(new Date().valueOf(), t, "loadtime");
}
function h(e) {
e.b = f(e).concat(f(e));
e.L = new n.cipher.aes(e.b);
}
function f(e) {
for (var t = 0; 4 > t && (e.h[t] = e.h[t] + 1 | 0, !e.h[t]); t++) ;
return e.L.encrypt(e.h);
}
function d(e, t) {
return function() {
t.apply(e, arguments);
};
}
n.random = new n.prng(6);
e: try {
var u, l, p, b;
if (b = "undefined" != typeof t && t.exports) {
var g;
try {
g = e("crypto");
} catch (e) {
g = null;
}
b = l = g;
}
if (b && l.randomBytes) u = l.randomBytes(128), u = new Uint32Array(new Uint8Array(u).buffer), 
n.random.addEntropy(u, 1024, "crypto['randomBytes']"); else if ("undefined" != typeof window && "undefined" != typeof Uint32Array) {
p = new Uint32Array(32);
if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(p); else {
if (!window.msCrypto || !window.msCrypto.getRandomValues) break e;
window.msCrypto.getRandomValues(p);
}
n.random.addEntropy(p, 1024, "crypto['getRandomValues']");
}
} catch (e) {
"undefined" != typeof window && window.console && (console.log("There was an error collecting entropy from the browser:"), 
console.log(e));
}
n.json = {
defaults: {
v: 1,
iter: 1e4,
ks: 128,
ts: 64,
mode: "ccm",
adata: "",
cipher: "aes"
},
ja: function(e, t, i, r) {
i = i || {};
r = r || {};
var s, a = n.json, o = a.g({
iv: n.random.randomWords(4, 0)
}, a.defaults);
a.g(o, i);
i = o.adata;
"string" == typeof o.salt && (o.salt = n.codec.base64.toBits(o.salt));
"string" == typeof o.iv && (o.iv = n.codec.base64.toBits(o.iv));
if (!n.mode[o.mode] || !n.cipher[o.cipher] || "string" == typeof e && 100 >= o.iter || 64 !== o.ts && 96 !== o.ts && 128 !== o.ts || 128 !== o.ks && 192 !== o.ks && 256 !== o.ks || 2 > o.iv.length || 4 < o.iv.length) throw new n.exception.invalid("json encrypt: invalid parameters");
"string" == typeof e ? (e = (s = n.misc.cachedPbkdf2(e, o)).key.slice(0, o.ks / 32), 
o.salt = s.salt) : n.ecc && e instanceof n.ecc.elGamal.publicKey && (s = e.kem(), 
o.kemtag = s.tag, e = s.key.slice(0, o.ks / 32));
"string" == typeof t && (t = n.codec.utf8String.toBits(t));
"string" == typeof i && (o.adata = i = n.codec.utf8String.toBits(i));
s = new n.cipher[o.cipher](e);
a.g(r, o);
r.key = e;
o.ct = "ccm" === o.mode && n.arrayBuffer && n.arrayBuffer.ccm && t instanceof ArrayBuffer ? n.arrayBuffer.ccm.encrypt(s, t, o.iv, i, o.ts) : n.mode[o.mode].encrypt(s, t, o.iv, i, o.ts);
return o;
},
encrypt: function(e, t, i, r) {
var s = n.json, a = s.ja.apply(s, arguments);
return s.encode(a);
},
ia: function(e, t, i, r) {
i = i || {};
r = r || {};
var s, a, o = n.json;
s = (t = o.g(o.g(o.g({}, o.defaults), t), i, !0)).adata;
"string" == typeof t.salt && (t.salt = n.codec.base64.toBits(t.salt));
"string" == typeof t.iv && (t.iv = n.codec.base64.toBits(t.iv));
if (!n.mode[t.mode] || !n.cipher[t.cipher] || "string" == typeof e && 100 >= t.iter || 64 !== t.ts && 96 !== t.ts && 128 !== t.ts || 128 !== t.ks && 192 !== t.ks && 256 !== t.ks || !t.iv || 2 > t.iv.length || 4 < t.iv.length) throw new n.exception.invalid("json decrypt: invalid parameters");
"string" == typeof e ? (e = (a = n.misc.cachedPbkdf2(e, t)).key.slice(0, t.ks / 32), 
t.salt = a.salt) : n.ecc && e instanceof n.ecc.elGamal.secretKey && (e = e.unkem(n.codec.base64.toBits(t.kemtag)).slice(0, t.ks / 32));
"string" == typeof s && (s = n.codec.utf8String.toBits(s));
a = new n.cipher[t.cipher](e);
s = "ccm" === t.mode && n.arrayBuffer && n.arrayBuffer.ccm && t.ct instanceof ArrayBuffer ? n.arrayBuffer.ccm.decrypt(a, t.ct, t.iv, t.tag, s, t.ts) : n.mode[t.mode].decrypt(a, t.ct, t.iv, s, t.ts);
o.g(r, t);
r.key = e;
return 1 === i.raw ? s : n.codec.utf8String.fromBits(s);
},
decrypt: function(e, t, i, r) {
var s = n.json;
return s.ia(e, s.decode(t), i, r);
},
encode: function(e) {
var t, i = "{", s = "";
for (t in e) if (e.hasOwnProperty(t)) {
if (!t.match(/^[a-z0-9]+$/i)) throw new n.exception.invalid("json encode: invalid property name");
i += s + '"' + t + '":';
s = ",";
switch (r(e[t])) {
case "number":
case "boolean":
i += e[t];
break;

case "string":
i += '"' + escape(e[t]) + '"';
break;

case "object":
i += '"' + n.codec.base64.fromBits(e[t], 0) + '"';
break;

default:
throw new n.exception.bug("json encode: unsupported type");
}
}
return i + "}";
},
decode: function(e) {
if (!(e = e.replace(/\s/g, "")).match(/^\{.*\}$/)) throw new n.exception.invalid("json decode: this isn't json!");
e = e.replace(/^\{|\}$/g, "").split(/,/);
var t, i, r = {};
for (t = 0; t < e.length; t++) {
if (!(i = e[t].match(/^\s*(?:(["']?)([a-z][a-z0-9]*)\1)\s*:\s*(?:(-?\d+)|"([a-z0-9+\/%*_.@=\-]*)"|(true|false))$/i))) throw new n.exception.invalid("json decode: this isn't json!");
null != i[3] ? r[i[2]] = parseInt(i[3], 10) : null != i[4] ? r[i[2]] = i[2].match(/^(ct|adata|salt|iv)$/) ? n.codec.base64.toBits(i[4]) : unescape(i[4]) : null != i[5] && (r[i[2]] = "true" === i[5]);
}
return r;
},
g: function(e, t, i) {
void 0 === e && (e = {});
if (void 0 === t) return e;
for (var r in t) if (t.hasOwnProperty(r)) {
if (i && void 0 !== e[r] && e[r] !== t[r]) throw new n.exception.invalid("required parameter overridden");
e[r] = t[r];
}
return e;
},
sa: function(e, t) {
var i, r = {};
for (i in e) e.hasOwnProperty(i) && e[i] !== t[i] && (r[i] = e[i]);
return r;
},
ra: function(e, t) {
var i, r = {};
for (i = 0; i < t.length; i++) void 0 !== e[t[i]] && (r[t[i]] = e[t[i]]);
return r;
}
};
n.encrypt = n.json.encrypt;
n.decrypt = n.json.decrypt;
n.misc.pa = {};
n.misc.cachedPbkdf2 = function(e, t) {
var i, r = n.misc.pa;
i = (t = t || {}).iter || 1e3;
(i = (r = r[e] = r[e] || {})[i] = r[i] || {
firstSalt: t.salt && t.salt.length ? t.salt.slice(0) : n.random.randomWords(2, 0)
})[r = void 0 === t.salt ? i.firstSalt : t.salt] = i[r] || n.misc.pbkdf2(e, r, t.iter);
return {
key: i[r].slice(0),
salt: r.slice(0)
};
};
"undefined" != typeof t && t.exports && (t.exports = n);
"function" == typeof define && define([], function() {
return n;
});
cc._RF.pop();
}, {
crypto: 56
} ],
speedBoost: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "2245bEqJ4VK9bUctCcjDLn3", "speedBoost");
var r = e("utility"), n = e("shifty"), s = e("scene");
cc.Class({
extends: cc.Component,
properties: {
velocity: 700
},
onLoad: function() {
this.speedBoostSound = this.node.getComponent(cc.AudioSource);
"speed_boost" == this.node.name && (window.sb = this);
},
start: function() {},
makeArrow: function() {
var e = cc.instantiate(this.node);
this.node.parent.addChild(e);
},
finish: function() {
this.node.destroy();
},
onCollisionEnter: function(e, t) {
if ("speed_boost" == this.node.name && "ball" == e.node.name) {
var i = e.node, a = t.node, o = this, c = r.getChildPosInAnyParent(this.node, i.parent), h = cc.v2(c.x - i.x, c.y - i.y);
h.x = i.x + h.x;
h.y = i.y + h.y;
s.MANAGER_SCREEN_CONTROLLER.playAudio(this.speedBoostSound);
var f = new n.Tweenable();
f.setConfig({
from: {
x: i.x,
y: i.y
},
to: {
x: h.x,
y: h.y
},
duration: 40,
easing: "linear",
step: function(e) {
i.x = e.x;
i.y = e.y;
}
});
f.tween().then(function() {
setTimeout(function() {
a.active = !1;
}, 400);
i.getComponent("ballController").unFreezeBall();
i.getComponent("ballController").applyVelocity(o.velocity, -a.rotation);
});
}
},
onCollisionExit: function(e, t) {}
});
cc._RF.pop();
}, {
scene: "scene",
shifty: "shifty",
utility: "utility"
} ],
starController: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "7c3514dQNZNk6WJVTOMBFyi", "starController");
var r = e("shifty"), n = e("event"), s = e("scene");
cc.Class({
extends: cc.Component,
properties: {},
onLoad: function() {
this.starToBallTime = 500;
this._ballNode = null;
this._start = !1;
this._timepassed = 0;
this._tweenObj = null;
this.starSound = this.node.getComponent(cc.AudioSource);
},
resetTween: function(e) {
null != this._tweenObj && this._tweenObj.pause();
var t = this.node, i = this._ballNode, n = this.node.parent.x + this.node.x, s = this.node.parent.y + this.node.y, a = t.x + (i.x - n), o = t.y + (i.y - s), c = {
from: {
x: t.x,
y: t.y
},
to: {
x: a,
y: o
},
duration: e,
easing: "linear",
step: function(e) {
t.x = e.x;
t.y = e.y;
}
};
this._tweenObj = new r.Tweenable();
this._tweenObj.setConfig(c);
this._tweenObj.tween().then(function() {});
},
onCollisionEnter: function(e, t) {
if ("starCatcher" == e.node.name) {
var i = cc.instantiate(this.node), a = cc.v2(this.node.parent.x + this.node.x, this.node.parent.y + this.node.y);
i.getComponent(cc.BoxCollider).enabled = !1;
s.MANAGER_SCREEN_CONTROLLER.playAudio(this.starSound);
this.node.opacity = 0;
this.node.getComponent(cc.BoxCollider).enabled = !1;
this.camera_mid_up_up = window.playingCamera.node.parent.getChildByName("camera_mid_up_up");
this.camera_mid_up_up.x = playingCamera.node.x;
this.camera_mid_up_up.y = playingCamera.node.y;
this.camera_mid_up_up.getComponent(cc.Camera).zoomRatio = playingCamera.zoomRatio;
i.group = "mid_up_up";
i.position = a;
ps.node.addChild(i);
var o = ps.node.getChildByName("starContainer"), c = cc.view.getVisibleSize(), h = cc.v2(playingCamera.node.x + c.width / 2 / playingCamera.zoomRatio, playingCamera.node.y + c.height / 2 / playingCamera.zoomRatio), f = cc.v2(h.x - o.width / 2 - o.getComponent(cc.Widget).right, h.y - o.height / 2 - o.getComponent(cc.Widget).top);
f.x = f.x + o.getChildByName("star").getChildByName("sprite").x;
f.y = f.y + o.getChildByName("star").getChildByName("sprite").y;
var d = {
from: {
x: i.x,
y: i.y,
rotation: i.rotation
},
to: {
x: f.x,
y: f.y,
rotation: i.rotation + 360
},
duration: 650,
easing: "easeInCubic",
step: function(e) {
i.x = e.x;
i.y = e.y;
i.rotation = e.rotation;
}
};
r.tween(d).then(function() {
i.active = !1;
var e = new cc.Event.EventCustom(n.STAR_COLLECT, !1);
cc.systemEvent.dispatchEvent(e);
});
}
}
});
cc._RF.pop();
}, {
event: "event",
scene: "scene",
shifty: "shifty"
} ],
temp_handsController: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "fb124dGXb5LaaOtQ96EKzbW", "temp_handsController");
var r = e("event"), n = e("scene"), s = e("shifty");
window.time = 100;
cc.Class({
extends: cc.Component,
properties: {},
onLoad: function() {
this.handsFollowBall = !1;
this.disableHandsControl = !1;
this.ballCatched = !1;
this.towardsBallTween = null;
this.towardsHandsRestTween = null;
this.handsStartPoint = cc.v2(this.node.x, this.node.y);
this.velocityMagnitude = 0;
this.ballNode = n.BALL_NODE;
this.ballController = this.ballNode.getComponent("ballController");
cc.systemEvent.on(r.DISABLE_HANDS_CONTROL, this.onDisableHandsControl, this);
cc.systemEvent.on(r.ENABLE_HANDS_CONTROL, this.onEnableHandsControl, this);
window.hc = this;
var e = 0, t = cc.v2(0, 0);
this.onTouchDown = function(i) {
if (!this.disableHandsControl && this.ballCatched) {
this.cancelAnimation();
t = cc.v2(i.getLocationX(), i.getLocationY());
e = 1;
}
};
this.onTouchMove = function(i) {
if (!this.disableHandsControl && this.ballCatched && 0 != e) if (1 != e) {
var r = cc.v2(i.getLocationX(), i.getLocationY()), n = Math.atan2(r.y - t.y, r.x - t.x) * (180 / Math.PI), s = Math.sqrt(Math.pow(r.x - t.x, 2) + Math.pow(r.y - t.y, 2)) / 5;
this.ballAngle = -n;
var a = -(n + 90);
this.node.rotation = a;
this.ballNode.rotation = a;
if (s <= 30) {
this.velocityMagnitude = 10 * Math.sqrt(Math.pow(r.x - t.x, 2) + Math.pow(r.y - t.y, 2));
var o = 8.5 * s;
this.ballNode.getComponent("ballController").dotsArea.opacity = o;
} else s = 30;
var c = this.handsStartPoint.x + s * Math.cos(n * (Math.PI / 180)), h = this.handsStartPoint.y + s * Math.sin(n * (Math.PI / 180));
this.ballNode.getComponent("ballController").projectionTrackTheBall(this.velocityMagnitude, this.ballAngle);
this.node.x = c;
this.node.y = h;
this.ballNode.x = this.node.parent.x + this.node.x;
this.ballNode.y = this.node.parent.y + this.node.y;
} else e++;
};
this.onTouchEnd = function(t) {
console.log(e);
if (!this.disableHandsControl && this.ballCatched && 2 == e) {
e = 0;
this.ballCatched = !1;
this.velocityMagnitude /= 1.4;
var i = this.ballNode.getComponent("ballController").getProjectilePoint(this.velocityMagnitude, this.ballAngle, 0);
this.ballNode.getComponent("ballController").unFreezeBall();
this.ballNode.getComponent(cc.RigidBody).linearVelocity = cc.v2(-i.Vx, i.Vy);
this.ballNode.getComponent(cc.RigidBody).angularVelocity = Math.abs(i.Vx > i.Vy ? i.Vx : i.Vy);
this.ballNode.getComponent("ballController").dotsArea.opacity = 0;
var r = this.node, n = {
from: {
x: this.node.x,
y: this.node.y
},
to: {
x: this.handsStartPoint.x,
y: this.handsStartPoint.y
},
duration: 20,
easing: "linear",
step: function(e) {
r.x = e.x;
r.y = e.y;
}
};
s.tween(n).then(function() {});
}
};
var i = n.PLAY_SCREEN.getChildByName("screenTouch");
i.on(cc.Node.EventType.TOUCH_START, this.onTouchDown, this);
i.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
i.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
},
onCollisionEnter: function(e, t) {
if ("ball" == e.node.name) {
var i = this, n = e.node, a = this.node, o = new cc.Vec2(a.parent.x + a.x, a.parent.y + a.y), c = -Math.atan2(n.y - o.y, n.x - o.x) * (180 / Math.PI) + 90;
n.getComponent("ballController").freezeBall();
n.getComponent("ballController").resetGravity();
i.ballCatched = !0;
this.towardsBallTween = new s.Tweenable();
this.towardsBallTween.setConfig({
from: {
x: a.x,
y: a.y,
rotation: a.rotation
},
to: {
x: n.x - this.node.parent.x,
y: n.y - this.node.parent.y,
rotation: c
},
duration: 100,
easing: "easeOutQuad",
step: function(e) {
a.x = e.x;
a.y = e.y;
a.rotation = e.rotation;
}
});
this.towardsHandsRestTween = new s.Tweenable();
this.towardsHandsRestTween.setConfig({
from: {
x: n.x - this.node.parent.x,
y: n.y - this.node.parent.y,
rotation: c
},
to: {
x: this.handsStartPoint.x,
y: this.handsStartPoint.y,
rotation: 0
},
duration: 300,
easing: "easeOutQuad",
step: function(e) {
a.x = e.x;
a.y = e.y;
a.rotation = e.rotation;
n.x = i.node.parent.x + e.x;
n.y = i.node.parent.y + e.y;
}
});
this.towardsBallTween.tween().then(function() {
i.towardsHandsRestTween.tween();
});
if (!this.firstTimeBallCatched) {
var h = new cc.Event.EventCustom(r.BALL_FIRST_TIME_CATCHED, !1);
h.setUserData(a);
cc.systemEvent.dispatchEvent(h);
this.firstTimeBallCatched = !0;
this.node.parent.getChildByName("+1").getComponent("+1").triggerAnimation();
}
}
},
cancelAnimation: function() {
if (null != this.towardsBallTween && null != this.towardsHandsRestTween) {
this.towardsBallTween.isPlaying() && this.towardsBallTween.pause();
this.towardsHandsRestTween.isPlaying() && this.towardsHandsRestTween.pause();
this.node.x = this.handsStartPoint.x;
this.node.y = this.handsStartPoint.y;
this.ballNode.x = this.node.parent.x + this.node.x;
this.ballNode.y = this.node.parent.y + this.node.y;
this.ballNode.rotation = this.node.rotation = 0;
}
},
removeListners: function() {
var e = n.PLAY_SCREEN.getChildByName("screenTouch");
e.off(cc.Node.EventType.TOUCH_START, this.onTouchDown, this);
e.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchDown, this);
e.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
},
onCollisionExit: function(e, t) {
"ball" == e.node.name && (this.ballCatched = !1);
},
onDisableHandsControl: function() {
this.disableHandsControl = !0;
console.log("handsControlDisabled");
},
onEnableHandsControl: function() {
this.disableHandsControl = !1;
console.log("handsCOntrolsEnabled");
}
});
cc._RF.pop();
}, {
event: "event",
scene: "scene",
shifty: "shifty"
} ],
utility: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "6dd19NeOAtOja1xxBKzGVPP", "utility");
var r = {
getChildPosInAnyParent: function(e, t) {
for (var i = cc.v2(); e.uuid != t.uuid; ) {
i.x += e.x;
i.y += e.y;
e = e.parent;
}
return i;
}
};
t.exports = r;
cc._RF.pop();
}, {} ]
}, {}, [ "+1", "backgroundParticles", "ballController", "ball_template_controller", "button", "cameraController", "challengeButton", "challenge_complete_screen_controller", "challenges", "challenges_screen_controller", "event", "scene", "customization_screen_controller", "data_controller", "deathBorderController", "finishLine", "gameover_screen_controller", "gravity_switch_boost", "groundMover", "groundRemover", "groundRotator", "handsController", "home_screen_controller", "shifty", "sjcl", "logo_screen_controller", "magnet_pull_animation", "manager_screen_controller", "outfit_controller", "part_manager", "particles", "partsDefination", "partsGenerator", "pause_screen_controller", "physicsSettings", "play_buttons_handler", "play_screen_controller", "playerController", "playerHeighlighter", "powerup_manager", "sceneConstantsInit", "speedBoost", "starController", "temp_handsController", "utility" ]);