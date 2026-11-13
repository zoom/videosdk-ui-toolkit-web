var Xc = (e) => {
  throw TypeError(e);
};
var Zc = (e, t, n) => t.has(e) || Xc("Cannot " + n);
var Ze = (e, t, n) => (Zc(e, t, "read from private field"), n ? n.call(e) : t.get(e)), Jc = (e, t, n) => t.has(e) ? Xc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), Li = (e, t, n, r) => (Zc(e, t, "write to private field"), r ? r.call(e, n) : t.set(e, n), n);
import { jsx as h, jsxs as P, Fragment as pe } from "react/jsx-runtime";
import * as m from "react";
import k, { createContext as or, useContext as xn, useMemo as he, useRef as ue, useCallback as q, useState as ne, useEffect as oe, createElement as Uo, forwardRef as Sa, cloneElement as Kd, useLayoutEffect as jt, useSyncExternalStore as ry, useId as En, Children as oy } from "react";
import * as Rn from "react-dom";
import Br, { flushSync as iy } from "react-dom";
import { ActiveMediaFailedCode as et, ConnectionState as we, SharePrivilege as Ot, ChatPrivilege as $o, RecordingStatus as tt, ExceptionCode as Fi, ChatMsgType as qd, VideoQuality as Rr } from "@zoom/videosdk";
import { ConnectionState as H$ } from "@zoom/videosdk";
const fe = (e) => typeof e == "string", wr = () => {
  let e, t;
  const n = new Promise((r, o) => {
    e = r, t = o;
  });
  return n.resolve = e, n.reject = t, n;
}, Qc = (e) => e == null ? "" : String(e), sy = (e, t, n) => {
  e.forEach((r) => {
    t[r] && (n[r] = t[r]);
  });
}, ay = /###/g, el = (e) => e && e.includes("###") ? e.replace(ay, ".") : e, tl = (e) => !e || fe(e), Nr = (e, t, n) => {
  const r = fe(t) ? t.split(".") : t;
  let o = 0;
  for (; o < r.length - 1; ) {
    if (tl(e)) return {};
    const i = el(r[o]);
    !e[i] && n && (e[i] = new n()), Object.prototype.hasOwnProperty.call(e, i) ? e = e[i] : e = {}, ++o;
  }
  return tl(e) ? {} : {
    obj: e,
    k: el(r[o])
  };
}, nl = (e, t, n) => {
  const {
    obj: r,
    k: o
  } = Nr(e, t, Object);
  if (r !== void 0 || t.length === 1) {
    r[o] = n;
    return;
  }
  let i = t[t.length - 1], s = t.slice(0, t.length - 1), a = Nr(e, s, Object);
  for (; a.obj === void 0 && s.length; )
    i = `${s[s.length - 1]}.${i}`, s = s.slice(0, s.length - 1), a = Nr(e, s, Object), a != null && a.obj && typeof a.obj[`${a.k}.${i}`] < "u" && (a.obj = void 0);
  a.obj[`${a.k}.${i}`] = n;
}, cy = (e, t, n, r) => {
  const {
    obj: o,
    k: i
  } = Nr(e, t, Object);
  o[i] = o[i] || [], o[i].push(n);
}, Ho = (e, t) => {
  const {
    obj: n,
    k: r
  } = Nr(e, t);
  if (n && Object.prototype.hasOwnProperty.call(n, r))
    return n[r];
}, ly = (e, t, n) => {
  const r = Ho(e, n);
  return r !== void 0 ? r : Ho(t, n);
}, Gd = (e, t, n) => {
  for (const r in t)
    r !== "__proto__" && r !== "constructor" && (r in e ? fe(e[r]) || e[r] instanceof String || fe(t[r]) || t[r] instanceof String ? n && (e[r] = t[r]) : Gd(e[r], t[r], n) : e[r] = t[r]);
  return e;
}, Vt = (e) => e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), uy = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;"
}, dy = (e) => fe(e) ? e.replace(/[&<>"'\/]/g, (t) => uy[t]) : e;
class fy {
  constructor(t) {
    this.capacity = t, this.regExpMap = /* @__PURE__ */ new Map(), this.regExpQueue = [];
  }
  getRegExp(t) {
    const n = this.regExpMap.get(t);
    if (n !== void 0)
      return n;
    const r = new RegExp(t);
    return this.regExpQueue.length === this.capacity && this.regExpMap.delete(this.regExpQueue.shift()), this.regExpMap.set(t, r), this.regExpQueue.push(t), r;
  }
}
const hy = [" ", ",", "?", "!", ";"], py = new fy(20), my = (e, t, n) => {
  t = t || "", n = n || "";
  const r = hy.filter((s) => !t.includes(s) && !n.includes(s));
  if (r.length === 0) return !0;
  const o = py.getRegExp(`(${r.map((s) => s === "?" ? "\\?" : s).join("|")})`);
  let i = !o.test(e);
  if (!i) {
    const s = e.indexOf(n);
    s > 0 && !o.test(e.substring(0, s)) && (i = !0);
  }
  return i;
}, As = (e, t, n = ".") => {
  if (!e) return;
  if (e[t])
    return Object.prototype.hasOwnProperty.call(e, t) ? e[t] : void 0;
  const r = t.split(n);
  let o = e;
  for (let i = 0; i < r.length; ) {
    if (!o || typeof o != "object")
      return;
    let s, a = "";
    for (let c = i; c < r.length; ++c)
      if (c !== i && (a += n), a += r[c], s = o[a], s !== void 0) {
        if (["string", "number", "boolean"].includes(typeof s) && c < r.length - 1)
          continue;
        i += c - i + 1;
        break;
      }
    o = s;
  }
  return o;
}, Pr = (e) => e == null ? void 0 : e.replace(/_/g, "-"), gy = {
  type: "logger",
  log(e) {
    this.output("log", e);
  },
  warn(e) {
    this.output("warn", e);
  },
  error(e) {
    this.output("error", e);
  },
  output(e, t) {
    var n, r;
    (r = (n = console == null ? void 0 : console[e]) == null ? void 0 : n.apply) == null || r.call(n, console, t);
  }
};
class Wo {
  constructor(t, n = {}) {
    this.init(t, n);
  }
  init(t, n = {}) {
    this.prefix = n.prefix || "i18next:", this.logger = t || gy, this.options = n, this.debug = n.debug;
  }
  log(...t) {
    return this.forward(t, "log", "", !0);
  }
  warn(...t) {
    return this.forward(t, "warn", "", !0);
  }
  error(...t) {
    return this.forward(t, "error", "");
  }
  deprecate(...t) {
    return this.forward(t, "warn", "WARNING DEPRECATED: ", !0);
  }
  forward(t, n, r, o) {
    return o && !this.debug ? null : (t = t.map((i) => fe(i) ? i.replace(/[\r\n\x00-\x1F\x7F]/g, " ") : i), fe(t[0]) && (t[0] = `${r}${this.prefix} ${t[0]}`), this.logger[n](t));
  }
  create(t) {
    return new Wo(this.logger, {
      prefix: `${this.prefix}:${t}:`,
      ...this.options
    });
  }
  clone(t) {
    return t = t || this.options, t.prefix = t.prefix || this.prefix, new Wo(this.logger, t);
  }
}
var Pt = new Wo();
class oi {
  constructor() {
    this.observers = {};
  }
  on(t, n) {
    return t.split(" ").forEach((r) => {
      this.observers[r] || (this.observers[r] = /* @__PURE__ */ new Map());
      const o = this.observers[r].get(n) || 0;
      this.observers[r].set(n, o + 1);
    }), this;
  }
  off(t, n) {
    if (this.observers[t]) {
      if (!n) {
        delete this.observers[t];
        return;
      }
      this.observers[t].delete(n);
    }
  }
  once(t, n) {
    const r = (...o) => {
      n(...o), this.off(t, r);
    };
    return this.on(t, r), this;
  }
  emit(t, ...n) {
    this.observers[t] && Array.from(this.observers[t].entries()).forEach(([o, i]) => {
      for (let s = 0; s < i; s++)
        o(...n);
    }), this.observers["*"] && Array.from(this.observers["*"].entries()).forEach(([o, i]) => {
      for (let s = 0; s < i; s++)
        o(t, ...n);
    });
  }
}
class rl extends oi {
  constructor(t, n = {
    ns: ["translation"],
    defaultNS: "translation"
  }) {
    super(), this.data = t || {}, this.options = n, this.options.keySeparator === void 0 && (this.options.keySeparator = "."), this.options.ignoreJSONStructure === void 0 && (this.options.ignoreJSONStructure = !0);
  }
  addNamespaces(t) {
    this.options.ns.includes(t) || this.options.ns.push(t);
  }
  removeNamespaces(t) {
    const n = this.options.ns.indexOf(t);
    n > -1 && this.options.ns.splice(n, 1);
  }
  getResource(t, n, r, o = {}) {
    var u, d;
    const i = o.keySeparator !== void 0 ? o.keySeparator : this.options.keySeparator, s = o.ignoreJSONStructure !== void 0 ? o.ignoreJSONStructure : this.options.ignoreJSONStructure;
    let a;
    t.includes(".") ? a = t.split(".") : (a = [t, n], r && (Array.isArray(r) ? a.push(...r) : fe(r) && i ? a.push(...r.split(i)) : a.push(r)));
    const c = Ho(this.data, a);
    return !c && !n && !r && t.includes(".") && (t = a[0], n = a[1], r = a.slice(2).join(".")), c || !s || !fe(r) ? c : As((d = (u = this.data) == null ? void 0 : u[t]) == null ? void 0 : d[n], r, i);
  }
  addResource(t, n, r, o, i = {
    silent: !1
  }) {
    const s = i.keySeparator !== void 0 ? i.keySeparator : this.options.keySeparator;
    let a = [t, n];
    r && (a = a.concat(s ? r.split(s) : r)), t.includes(".") && (a = t.split("."), o = n, n = a[1]), this.addNamespaces(n), nl(this.data, a, o), i.silent || this.emit("added", t, n, r, o);
  }
  addResources(t, n, r, o = {
    silent: !1
  }) {
    for (const i in r)
      (fe(r[i]) || Array.isArray(r[i])) && this.addResource(t, n, i, r[i], {
        silent: !0
      });
    o.silent || this.emit("added", t, n, r);
  }
  addResourceBundle(t, n, r, o, i, s = {
    silent: !1,
    skipCopy: !1
  }) {
    let a = [t, n];
    t.includes(".") && (a = t.split("."), o = r, r = n, n = a[1]), this.addNamespaces(n);
    let c = Ho(this.data, a) || {};
    s.skipCopy || (r = JSON.parse(JSON.stringify(r))), o ? Gd(c, r, i) : c = {
      ...c,
      ...r
    }, nl(this.data, a, c), s.silent || this.emit("added", t, n, r);
  }
  removeResourceBundle(t, n) {
    this.hasResourceBundle(t, n) && delete this.data[t][n], this.removeNamespaces(n), this.emit("removed", t, n);
  }
  hasResourceBundle(t, n) {
    return this.getResource(t, n) !== void 0;
  }
  getResourceBundle(t, n) {
    return n || (n = this.options.defaultNS), this.getResource(t, n);
  }
  getDataByLanguage(t) {
    return this.data[t];
  }
  hasLanguageSomeTranslations(t) {
    const n = this.getDataByLanguage(t);
    return !!(n && Object.keys(n) || []).find((o) => n[o] && Object.keys(n[o]).length > 0);
  }
  toJSON() {
    return this.data;
  }
}
var Yd = {
  processors: {},
  addPostProcessor(e) {
    this.processors[e.name] = e;
  },
  handle(e, t, n, r, o) {
    return e.forEach((i) => {
      var s;
      t = ((s = this.processors[i]) == null ? void 0 : s.process(t, n, r, o)) ?? t;
    }), t;
  }
};
const Xd = Symbol("i18next/PATH_KEY");
function vy() {
  const e = [], t = /* @__PURE__ */ Object.create(null);
  let n;
  return t.get = (r, o) => {
    var i;
    return (i = n == null ? void 0 : n.revoke) == null || i.call(n), o === Xd ? e : (e.push(o), n = Proxy.revocable(r, t), n.proxy);
  }, Proxy.revocable(/* @__PURE__ */ Object.create(null), t).proxy;
}
function qn(e, t) {
  const {
    [Xd]: n
  } = e(vy()), r = (t == null ? void 0 : t.keySeparator) ?? ".", o = (t == null ? void 0 : t.nsSeparator) ?? ":";
  if (n.length > 1 && o) {
    const i = t == null ? void 0 : t.ns, s = Array.isArray(i) ? i : null;
    if (s && s.length > 1 && s.slice(1).includes(n[0]))
      return `${n[0]}${o}${n.slice(1).join(r)}`;
  }
  return n.join(r);
}
const Vi = (e) => !fe(e) && typeof e != "boolean" && typeof e != "number";
class Ko extends oi {
  constructor(t, n = {}) {
    super(), sy(["resourceStore", "languageUtils", "pluralResolver", "interpolator", "backendConnector", "i18nFormat", "utils"], t, this), this.options = n, this.options.keySeparator === void 0 && (this.options.keySeparator = "."), this.logger = Pt.create("translator"), this.checkedLoadedFor = {};
  }
  changeLanguage(t) {
    t && (this.language = t);
  }
  exists(t, n = {
    interpolation: {}
  }) {
    const r = {
      ...n
    };
    if (t == null) return !1;
    const o = this.resolve(t, r);
    if ((o == null ? void 0 : o.res) === void 0) return !1;
    const i = Vi(o.res);
    return !(r.returnObjects === !1 && i);
  }
  extractFromKey(t, n) {
    let r = n.nsSeparator !== void 0 ? n.nsSeparator : this.options.nsSeparator;
    r === void 0 && (r = ":");
    const o = n.keySeparator !== void 0 ? n.keySeparator : this.options.keySeparator;
    let i = n.ns || this.options.defaultNS || [];
    const s = r && t.includes(r), a = !this.options.userDefinedKeySeparator && !n.keySeparator && !this.options.userDefinedNsSeparator && !n.nsSeparator && !my(t, r, o);
    if (s && !a) {
      const c = t.match(this.interpolator.nestingRegexp);
      if (c && c.length > 0)
        return {
          key: t,
          namespaces: fe(i) ? [i] : i
        };
      const u = t.split(r);
      (r !== o || r === o && this.options.ns.includes(u[0])) && (i = u.shift()), t = u.join(o);
    }
    return {
      key: t,
      namespaces: fe(i) ? [i] : i
    };
  }
  translate(t, n, r) {
    let o = typeof n == "object" ? {
      ...n
    } : n;
    if (typeof o != "object" && this.options.overloadTranslationOptionHandler && (o = this.options.overloadTranslationOptionHandler(arguments)), typeof o == "object" && (o = {
      ...o
    }), o || (o = {}), t == null) return "";
    typeof t == "function" && (t = qn(t, {
      ...this.options,
      ...o
    })), Array.isArray(t) || (t = [String(t)]), t = t.map((T) => typeof T == "function" ? qn(T, {
      ...this.options,
      ...o
    }) : String(T));
    const i = o.returnDetails !== void 0 ? o.returnDetails : this.options.returnDetails, s = o.keySeparator !== void 0 ? o.keySeparator : this.options.keySeparator, {
      key: a,
      namespaces: c
    } = this.extractFromKey(t[t.length - 1], o), u = c[c.length - 1];
    let d = o.nsSeparator !== void 0 ? o.nsSeparator : this.options.nsSeparator;
    d === void 0 && (d = ":");
    const l = o.lng || this.language, f = o.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
    if ((l == null ? void 0 : l.toLowerCase()) === "cimode")
      return f ? i ? {
        res: `${u}${d}${a}`,
        usedKey: a,
        exactUsedKey: a,
        usedLng: l,
        usedNS: u,
        usedParams: this.getUsedParamsDetails(o)
      } : `${u}${d}${a}` : i ? {
        res: a,
        usedKey: a,
        exactUsedKey: a,
        usedLng: l,
        usedNS: u,
        usedParams: this.getUsedParamsDetails(o)
      } : a;
    const g = this.resolve(t, o);
    let v = g == null ? void 0 : g.res;
    const p = (g == null ? void 0 : g.usedKey) || a, b = (g == null ? void 0 : g.exactUsedKey) || a, y = ["[object Number]", "[object Function]", "[object RegExp]"], S = o.joinArrays !== void 0 ? o.joinArrays : this.options.joinArrays, w = !this.i18nFormat || this.i18nFormat.handleAsObject, _ = o.count !== void 0 && !fe(o.count), C = Ko.hasDefaultValue(o), R = _ ? this.pluralResolver.getSuffix(l, o.count, o) : "", x = o.ordinal && _ ? this.pluralResolver.getSuffix(l, o.count, {
      ordinal: !1
    }) : "", E = _ && !o.ordinal && o.count === 0, I = E && o[`defaultValue${this.options.pluralSeparator}zero`] || o[`defaultValue${R}`] || o[`defaultValue${x}`] || o.defaultValue;
    let M = v;
    w && !v && C && (M = I);
    const N = Vi(M), $ = Object.prototype.toString.apply(M);
    if (w && M && N && !y.includes($) && !(fe(S) && Array.isArray(M))) {
      if (!o.returnObjects && !this.options.returnObjects) {
        this.options.returnedObjectHandler || this.logger.warn("accessing an object - but returnObjects options is not enabled!");
        const T = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(p, M, {
          ...o,
          ns: c
        }) : `key '${a} (${this.language})' returned an object instead of string.`;
        return i ? (g.res = T, g.usedParams = this.getUsedParamsDetails(o), g) : T;
      }
      if (s) {
        const T = Array.isArray(M), O = T ? [] : {}, F = T ? b : p;
        for (const A in M)
          if (Object.prototype.hasOwnProperty.call(M, A)) {
            const D = `${F}${s}${A}`;
            C && !v ? O[A] = this.translate(D, {
              ...o,
              defaultValue: Vi(I) ? I[A] : void 0,
              joinArrays: !1,
              ns: c
            }) : O[A] = this.translate(D, {
              ...o,
              joinArrays: !1,
              ns: c
            }), O[A] === D && (O[A] = M[A]);
          }
        v = O;
      }
    } else if (w && fe(S) && Array.isArray(v))
      v = v.join(S), v && (v = this.extendTranslation(v, t, o, r));
    else {
      let T = !1, O = !1;
      !this.isValidLookup(v) && C && (T = !0, v = I), this.isValidLookup(v) || (O = !0, v = a);
      const A = (o.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey) && O ? void 0 : v, D = C && I !== v && this.options.updateMissing;
      if (O || T || D) {
        if (this.logger.log(D ? "updateKey" : "missingKey", l, u, _ && !D ? `${a}${this.pluralResolver.getSuffix(l, o.count, o)}` : a, D ? I : v), s) {
          const j = this.resolve(a, {
            ...o,
            keySeparator: !1
          });
          j && j.res && this.logger.warn("Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.");
        }
        let V = [];
        const z = this.languageUtils.getFallbackCodes(this.options.fallbackLng, o.lng || this.language);
        if (this.options.saveMissingTo === "fallback" && z && z[0])
          for (let j = 0; j < z.length; j++)
            V.push(z[j]);
        else this.options.saveMissingTo === "all" ? V = this.languageUtils.toResolveHierarchy(o.lng || this.language) : V.push(o.lng || this.language);
        const L = (j, Z, K) => {
          var J;
          const G = C && K !== v ? K : A;
          this.options.missingKeyHandler ? this.options.missingKeyHandler(j, u, Z, G, D, o) : (J = this.backendConnector) != null && J.saveMissing && this.backendConnector.saveMissing(j, u, Z, G, D, o), this.emit("missingKey", j, u, Z, v);
        };
        this.options.saveMissing && (this.options.saveMissingPlurals && _ ? V.forEach((j) => {
          const Z = this.pluralResolver.getSuffixes(j, o);
          E && o[`defaultValue${this.options.pluralSeparator}zero`] && !Z.includes(`${this.options.pluralSeparator}zero`) && Z.push(`${this.options.pluralSeparator}zero`), Z.forEach((K) => {
            L([j], a + K, o[`defaultValue${K}`] || I);
          });
        }) : L(V, a, I));
      }
      v = this.extendTranslation(v, t, o, g, r), O && v === a && this.options.appendNamespaceToMissingKey && (v = `${u}${d}${a}`), (O || T) && this.options.parseMissingKeyHandler && (v = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? `${u}${d}${a}` : a, T ? v : void 0, o));
    }
    return i ? (g.res = v, g.usedParams = this.getUsedParamsDetails(o), g) : v;
  }
  extendTranslation(t, n, r, o, i) {
    var c, u;
    if ((c = this.i18nFormat) != null && c.parse)
      t = this.i18nFormat.parse(t, {
        ...this.options.interpolation.defaultVariables,
        ...r
      }, r.lng || this.language || o.usedLng, o.usedNS, o.usedKey, {
        resolved: o
      });
    else if (!r.skipInterpolation) {
      r.interpolation && this.interpolator.init({
        ...r,
        interpolation: {
          ...this.options.interpolation,
          ...r.interpolation
        }
      });
      const d = fe(t) && (((u = r == null ? void 0 : r.interpolation) == null ? void 0 : u.skipOnVariables) !== void 0 ? r.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables);
      let l;
      if (d) {
        const g = t.match(this.interpolator.nestingRegexp);
        l = g && g.length;
      }
      let f = r.replace && !fe(r.replace) ? r.replace : r;
      if (this.options.interpolation.defaultVariables && (f = {
        ...this.options.interpolation.defaultVariables,
        ...f
      }), t = this.interpolator.interpolate(t, f, r.lng || this.language || o.usedLng, r), d) {
        const g = t.match(this.interpolator.nestingRegexp), v = g && g.length;
        l < v && (r.nest = !1);
      }
      !r.lng && o && o.res && (r.lng = this.language || o.usedLng), r.nest !== !1 && (t = this.interpolator.nest(t, (...g) => (i == null ? void 0 : i[0]) === g[0] && !r.context ? (this.logger.warn(`It seems you are nesting recursively key: ${g[0]} in key: ${n[0]}`), null) : this.translate(...g, n), r)), r.interpolation && this.interpolator.reset();
    }
    const s = r.postProcess || this.options.postProcess, a = fe(s) ? [s] : s;
    return t != null && (a != null && a.length) && r.applyPostProcessor !== !1 && (t = Yd.handle(a, t, n, this.options && this.options.postProcessPassResolved ? {
      i18nResolved: {
        ...o,
        usedParams: this.getUsedParamsDetails(r)
      },
      ...r
    } : r, this)), t;
  }
  resolve(t, n = {}) {
    let r, o, i, s, a;
    return fe(t) && (t = [t]), Array.isArray(t) && (t = t.map((c) => typeof c == "function" ? qn(c, {
      ...this.options,
      ...n
    }) : c)), t.forEach((c) => {
      if (this.isValidLookup(r)) return;
      const u = this.extractFromKey(c, n), d = u.key;
      o = d;
      let l = u.namespaces;
      this.options.fallbackNS && (l = l.concat(this.options.fallbackNS));
      const f = n.count !== void 0 && !fe(n.count), g = f && !n.ordinal && n.count === 0, v = n.context !== void 0 && (fe(n.context) || typeof n.context == "number") && n.context !== "", p = n.lngs ? n.lngs : this.languageUtils.toResolveHierarchy(n.lng || this.language, n.fallbackLng);
      l.forEach((b) => {
        var y, S;
        this.isValidLookup(r) || (a = b, !this.checkedLoadedFor[`${p[0]}-${b}`] && ((y = this.utils) != null && y.hasLoadedNamespace) && !((S = this.utils) != null && S.hasLoadedNamespace(a)) && (this.checkedLoadedFor[`${p[0]}-${b}`] = !0, this.logger.warn(`key "${o}" for languages "${p.join(", ")}" won't get resolved as namespace "${a}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!")), p.forEach((w) => {
          var R;
          if (this.isValidLookup(r)) return;
          s = w;
          const _ = [d];
          if ((R = this.i18nFormat) != null && R.addLookupKeys)
            this.i18nFormat.addLookupKeys(_, d, w, b, n);
          else {
            let x;
            f && (x = this.pluralResolver.getSuffix(w, n.count, n));
            const E = `${this.options.pluralSeparator}zero`, I = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`;
            if (f && (n.ordinal && x.startsWith(I) && _.push(d + x.replace(I, this.options.pluralSeparator)), _.push(d + x), g && _.push(d + E)), v) {
              const M = `${d}${this.options.contextSeparator || "_"}${n.context}`;
              _.push(M), f && (n.ordinal && x.startsWith(I) && _.push(M + x.replace(I, this.options.pluralSeparator)), _.push(M + x), g && _.push(M + E));
            }
          }
          let C;
          for (; C = _.pop(); )
            this.isValidLookup(r) || (i = C, r = this.getResource(w, b, C, n));
        }));
      });
    }), {
      res: r,
      usedKey: o,
      exactUsedKey: i,
      usedLng: s,
      usedNS: a
    };
  }
  isValidLookup(t) {
    return t !== void 0 && !(!this.options.returnNull && t === null) && !(!this.options.returnEmptyString && t === "");
  }
  getResource(t, n, r, o = {}) {
    var i;
    return (i = this.i18nFormat) != null && i.getResource ? this.i18nFormat.getResource(t, n, r, o) : this.resourceStore.getResource(t, n, r, o);
  }
  getUsedParamsDetails(t = {}) {
    const n = ["defaultValue", "ordinal", "context", "replace", "lng", "lngs", "fallbackLng", "ns", "keySeparator", "nsSeparator", "returnObjects", "returnDetails", "joinArrays", "postProcess", "interpolation"], r = t.replace && !fe(t.replace);
    let o = r ? t.replace : t;
    if (r && typeof t.count < "u" && (o.count = t.count), this.options.interpolation.defaultVariables && (o = {
      ...this.options.interpolation.defaultVariables,
      ...o
    }), !r) {
      o = {
        ...o
      };
      for (const i of n)
        delete o[i];
    }
    return o;
  }
  static hasDefaultValue(t) {
    const n = "defaultValue";
    for (const r in t)
      if (Object.prototype.hasOwnProperty.call(t, r) && r.startsWith(n) && t[r] !== void 0)
        return !0;
    return !1;
  }
}
class ol {
  constructor(t) {
    this.options = t, this.supportedLngs = this.options.supportedLngs || !1, this.logger = Pt.create("languageUtils");
  }
  getScriptPartFromCode(t) {
    if (t = Pr(t), !t || !t.includes("-")) return null;
    const n = t.split("-");
    return n.length === 2 || (n.pop(), n[n.length - 1].toLowerCase() === "x") ? null : this.formatLanguageCode(n.join("-"));
  }
  getLanguagePartFromCode(t) {
    if (t = Pr(t), !t || !t.includes("-")) return t;
    const n = t.split("-");
    return this.formatLanguageCode(n[0]);
  }
  formatLanguageCode(t) {
    if (fe(t) && t.includes("-")) {
      let n;
      try {
        n = Intl.getCanonicalLocales(t)[0];
      } catch {
      }
      return n && this.options.lowerCaseLng && (n = n.toLowerCase()), n || (this.options.lowerCaseLng ? t.toLowerCase() : t);
    }
    return this.options.cleanCode || this.options.lowerCaseLng ? t.toLowerCase() : t;
  }
  isSupportedCode(t) {
    return (this.options.load === "languageOnly" || this.options.nonExplicitSupportedLngs) && (t = this.getLanguagePartFromCode(t)), !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.includes(t);
  }
  getBestMatchFromCodes(t) {
    if (!t) return null;
    let n;
    return t.forEach((r) => {
      if (n) return;
      const o = this.formatLanguageCode(r);
      (!this.options.supportedLngs || this.isSupportedCode(o)) && (n = o);
    }), !n && this.options.supportedLngs && t.forEach((r) => {
      if (n) return;
      const o = this.getScriptPartFromCode(r);
      if (this.isSupportedCode(o)) return n = o;
      const i = this.getLanguagePartFromCode(r);
      if (this.isSupportedCode(i)) return n = i;
      n = this.options.supportedLngs.find((s) => s === i ? !0 : !s.includes("-") && !i.includes("-") ? !1 : !!(s.includes("-") && !i.includes("-") && s.slice(0, s.indexOf("-")) === i || s.startsWith(i) && i.length > 1));
    }), n || (n = this.getFallbackCodes(this.options.fallbackLng)[0]), n;
  }
  getFallbackCodes(t, n) {
    if (!t) return [];
    if (typeof t == "function" && (t = t(n)), fe(t) && (t = [t]), Array.isArray(t)) return t;
    if (!n) return t.default || [];
    let r = t[n];
    return r || (r = t[this.getScriptPartFromCode(n)]), r || (r = t[this.formatLanguageCode(n)]), r || (r = t[this.getLanguagePartFromCode(n)]), r || (r = t.default), r || [];
  }
  toResolveHierarchy(t, n) {
    const r = this.getFallbackCodes((n === !1 ? [] : n) || this.options.fallbackLng || [], t), o = [], i = (s) => {
      s && (this.isSupportedCode(s) ? o.push(s) : this.logger.warn(`rejecting language code not found in supportedLngs: ${s}`));
    };
    return fe(t) && (t.includes("-") || t.includes("_")) ? (this.options.load !== "languageOnly" && i(this.formatLanguageCode(t)), this.options.load !== "languageOnly" && this.options.load !== "currentOnly" && i(this.getScriptPartFromCode(t)), this.options.load !== "currentOnly" && i(this.getLanguagePartFromCode(t))) : fe(t) && i(this.formatLanguageCode(t)), r.forEach((s) => {
      o.includes(s) || i(this.formatLanguageCode(s));
    }), o;
  }
}
const il = {
  zero: 0,
  one: 1,
  two: 2,
  few: 3,
  many: 4,
  other: 5
}, sl = {
  select: (e) => e === 1 ? "one" : "other",
  resolvedOptions: () => ({
    pluralCategories: ["one", "other"]
  })
};
class yy {
  constructor(t, n = {}) {
    this.languageUtils = t, this.options = n, this.logger = Pt.create("pluralResolver"), this.pluralRulesCache = {};
  }
  clearCache() {
    this.pluralRulesCache = {};
  }
  getRule(t, n = {}) {
    const r = Pr(t === "dev" ? "en" : t), o = n.ordinal ? "ordinal" : "cardinal", i = JSON.stringify({
      cleanedCode: r,
      type: o
    });
    if (i in this.pluralRulesCache)
      return this.pluralRulesCache[i];
    let s;
    try {
      s = new Intl.PluralRules(r, {
        type: o
      });
    } catch {
      if (typeof Intl > "u")
        return this.logger.error("No Intl support, please use an Intl polyfill!"), sl;
      if (!t.match(/-|_/)) return sl;
      const c = this.languageUtils.getLanguagePartFromCode(t);
      s = this.getRule(c, n);
    }
    return this.pluralRulesCache[i] = s, s;
  }
  needsPlural(t, n = {}) {
    let r = this.getRule(t, n);
    return r || (r = this.getRule("dev", n)), (r == null ? void 0 : r.resolvedOptions().pluralCategories.length) > 1;
  }
  getPluralFormsOfKey(t, n, r = {}) {
    return this.getSuffixes(t, r).map((o) => `${n}${o}`);
  }
  getSuffixes(t, n = {}) {
    let r = this.getRule(t, n);
    return r || (r = this.getRule("dev", n)), r ? r.resolvedOptions().pluralCategories.sort((o, i) => il[o] - il[i]).map((o) => `${this.options.prepend}${n.ordinal ? `ordinal${this.options.prepend}` : ""}${o}`) : [];
  }
  getSuffix(t, n, r = {}) {
    const o = this.getRule(t, r);
    return o ? `${this.options.prepend}${r.ordinal ? `ordinal${this.options.prepend}` : ""}${o.select(n)}` : (this.logger.warn(`no plural rule found for: ${t}`), this.getSuffix("dev", n, r));
  }
}
const al = (e, t, n, r = ".", o = !0) => {
  let i = ly(e, t, n);
  return !i && o && fe(n) && (i = As(e, n, r), i === void 0 && (i = As(t, n, r))), i;
}, Bi = (e) => e.replace(/\$/g, "$$$$");
class cl {
  constructor(t = {}) {
    var n;
    this.logger = Pt.create("interpolator"), this.options = t, this.format = ((n = t == null ? void 0 : t.interpolation) == null ? void 0 : n.format) || ((r) => r), this.init(t);
  }
  init(t = {}) {
    t.interpolation || (t.interpolation = {
      escapeValue: !0
    });
    const {
      escape: n,
      escapeValue: r,
      useRawValueToEscape: o,
      prefix: i,
      prefixEscaped: s,
      suffix: a,
      suffixEscaped: c,
      formatSeparator: u,
      unescapeSuffix: d,
      unescapePrefix: l,
      nestingPrefix: f,
      nestingPrefixEscaped: g,
      nestingSuffix: v,
      nestingSuffixEscaped: p,
      nestingOptionsSeparator: b,
      maxReplaces: y,
      alwaysFormat: S
    } = t.interpolation;
    this.escape = n !== void 0 ? n : dy, this.escapeValue = r !== void 0 ? r : !0, this.useRawValueToEscape = o !== void 0 ? o : !1, this.prefix = i ? Vt(i) : s || "{{", this.suffix = a ? Vt(a) : c || "}}", this.formatSeparator = u || ",", this.unescapePrefix = d ? "" : l ? Vt(l) : "-", this.unescapeSuffix = this.unescapePrefix ? "" : d ? Vt(d) : "", this.nestingPrefix = f ? Vt(f) : g || Vt("$t("), this.nestingSuffix = v ? Vt(v) : p || Vt(")"), this.nestingOptionsSeparator = b || ",", this.maxReplaces = y || 1e3, this.alwaysFormat = S !== void 0 ? S : !1, this.resetRegExp();
  }
  reset() {
    this.options && this.init(this.options);
  }
  resetRegExp() {
    const t = (n, r) => (n == null ? void 0 : n.source) === r ? (n.lastIndex = 0, n) : new RegExp(r, "g");
    this.regexp = t(this.regexp, `${this.prefix}(.+?)${this.suffix}`), this.regexpUnescape = t(this.regexpUnescape, `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`), this.nestingRegexp = t(this.nestingRegexp, `${this.nestingPrefix}((?:[^()"']+|"[^"]*"|'[^']*'|\\((?:[^()]|"[^"]*"|'[^']*')*\\))*?)${this.nestingSuffix}`);
  }
  interpolate(t, n, r, o) {
    var g;
    let i, s, a;
    const c = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {}, u = (v) => {
      if (!v.includes(this.formatSeparator)) {
        const S = al(n, c, v, this.options.keySeparator, this.options.ignoreJSONStructure);
        return this.alwaysFormat ? this.format(S, void 0, r, {
          ...o,
          ...n,
          interpolationkey: v
        }) : S;
      }
      const p = v.split(this.formatSeparator), b = p.shift().trim(), y = p.join(this.formatSeparator).trim();
      return this.format(al(n, c, b, this.options.keySeparator, this.options.ignoreJSONStructure), y, r, {
        ...o,
        ...n,
        interpolationkey: b
      });
    };
    this.resetRegExp(), !this.escapeValue && typeof t == "string" && /\$t\([^)]*\{[^}]*\{\{/.test(t) && this.logger.warn("nesting options string contains interpolated variables with escapeValue: false — if any of those values are attacker-controlled they can inject additional nesting options (e.g. redirect lng/ns). Sanitise untrusted input before passing it to t(), or keep escapeValue: true.");
    const d = (o == null ? void 0 : o.missingInterpolationHandler) || this.options.missingInterpolationHandler, l = ((g = o == null ? void 0 : o.interpolation) == null ? void 0 : g.skipOnVariables) !== void 0 ? o.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables;
    return [{
      regex: this.regexpUnescape,
      safeValue: (v) => Bi(v)
    }, {
      regex: this.regexp,
      safeValue: (v) => this.escapeValue ? Bi(this.escape(v)) : Bi(v)
    }].forEach((v) => {
      for (a = 0; i = v.regex.exec(t); ) {
        const p = i[1].trim();
        if (s = u(p), s === void 0)
          if (typeof d == "function") {
            const y = d(t, i, o);
            s = fe(y) ? y : "";
          } else if (o && Object.prototype.hasOwnProperty.call(o, p))
            s = "";
          else if (l) {
            s = i[0];
            continue;
          } else
            this.logger.warn(`missed to pass in variable ${p} for interpolating ${t}`), s = "";
        else !fe(s) && !this.useRawValueToEscape && (s = Qc(s));
        const b = v.safeValue(s);
        if (t = t.replace(i[0], b), l ? (v.regex.lastIndex += s.length, v.regex.lastIndex -= i[0].length) : v.regex.lastIndex = 0, a++, a >= this.maxReplaces)
          break;
      }
    }), t;
  }
  nest(t, n, r = {}) {
    let o, i, s;
    const a = (c, u) => {
      const d = this.nestingOptionsSeparator;
      if (!c.includes(d)) return c;
      const l = c.split(new RegExp(`${Vt(d)}[ ]*{`));
      let f = `{${l[1]}`;
      c = l[0], f = this.interpolate(f, s);
      const g = f.match(/'/g), v = f.match(/"/g);
      (((g == null ? void 0 : g.length) ?? 0) % 2 === 0 && !v || ((v == null ? void 0 : v.length) ?? 0) % 2 !== 0) && (f = f.replace(/'/g, '"'));
      try {
        s = JSON.parse(f), u && (s = {
          ...u,
          ...s
        });
      } catch (p) {
        return this.logger.warn(`failed parsing options string in nesting for key ${c}`, p), `${c}${d}${f}`;
      }
      return s.defaultValue && s.defaultValue.includes(this.prefix) && delete s.defaultValue, c;
    };
    for (; o = this.nestingRegexp.exec(t); ) {
      let c = [];
      s = {
        ...r
      }, s = s.replace && !fe(s.replace) ? s.replace : s, s.applyPostProcessor = !1, delete s.defaultValue;
      const u = /{.*}/.test(o[1]) ? o[1].lastIndexOf("}") + 1 : o[1].indexOf(this.formatSeparator);
      if (u !== -1 && (c = o[1].slice(u).split(this.formatSeparator).map((d) => d.trim()).filter(Boolean), o[1] = o[1].slice(0, u)), i = n(a.call(this, o[1].trim(), s), s), i && o[0] === t && !fe(i)) return i;
      fe(i) || (i = Qc(i)), i || (this.logger.warn(`missed to resolve ${o[1]} for nesting ${t}`), i = ""), c.length && (i = c.reduce((d, l) => this.format(d, l, r.lng, {
        ...r,
        interpolationkey: o[1].trim()
      }), i.trim())), t = t.replace(o[0], i), this.regexp.lastIndex = 0;
    }
    return t;
  }
}
const by = (e) => {
  let t = e.toLowerCase().trim();
  const n = {};
  if (e.includes("(")) {
    const r = e.split("(");
    t = r[0].toLowerCase().trim();
    const o = r[1].slice(0, -1);
    t === "currency" && !o.includes(":") ? n.currency || (n.currency = o.trim()) : t === "relativetime" && !o.includes(":") ? n.range || (n.range = o.trim()) : o.split(";").forEach((s) => {
      if (s) {
        const [a, ...c] = s.split(":"), u = c.join(":").trim().replace(/^'+|'+$/g, ""), d = a.trim();
        n[d] || (n[d] = u), u === "false" && (n[d] = !1), u === "true" && (n[d] = !0), isNaN(u) || (n[d] = parseInt(u, 10));
      }
    });
  }
  return {
    formatName: t,
    formatOptions: n
  };
}, ll = (e) => {
  const t = {};
  return (n, r, o) => {
    let i = o;
    o && o.interpolationkey && o.formatParams && o.formatParams[o.interpolationkey] && o[o.interpolationkey] && (i = {
      ...i,
      [o.interpolationkey]: void 0
    });
    const s = r + JSON.stringify(i);
    let a = t[s];
    return a || (a = e(Pr(r), o), t[s] = a), a(n);
  };
}, Sy = (e) => (t, n, r) => e(Pr(n), r)(t);
class wy {
  constructor(t = {}) {
    this.logger = Pt.create("formatter"), this.options = t, this.init(t);
  }
  init(t, n = {
    interpolation: {}
  }) {
    this.formatSeparator = n.interpolation.formatSeparator || ",";
    const r = n.cacheInBuiltFormats ? ll : Sy;
    this.formats = {
      number: r((o, i) => {
        const s = new Intl.NumberFormat(o, {
          ...i
        });
        return (a) => s.format(a);
      }),
      currency: r((o, i) => {
        const s = new Intl.NumberFormat(o, {
          ...i,
          style: "currency"
        });
        return (a) => s.format(a);
      }),
      datetime: r((o, i) => {
        const s = new Intl.DateTimeFormat(o, {
          ...i
        });
        return (a) => s.format(a);
      }),
      relativetime: r((o, i) => {
        const s = new Intl.RelativeTimeFormat(o, {
          ...i
        });
        return (a) => s.format(a, i.range || "day");
      }),
      list: r((o, i) => {
        const s = new Intl.ListFormat(o, {
          ...i
        });
        return (a) => s.format(a);
      })
    };
  }
  add(t, n) {
    this.formats[t.toLowerCase().trim()] = n;
  }
  addCached(t, n) {
    this.formats[t.toLowerCase().trim()] = ll(n);
  }
  format(t, n, r, o = {}) {
    if (!n || t == null) return t;
    const i = n.split(this.formatSeparator);
    if (i.length > 1 && i[0].indexOf("(") > 1 && !i[0].includes(")") && i.find((a) => a.includes(")"))) {
      const a = i.findIndex((c) => c.includes(")"));
      i[0] = [i[0], ...i.splice(1, a)].join(this.formatSeparator);
    }
    return i.reduce((a, c) => {
      var l;
      const {
        formatName: u,
        formatOptions: d
      } = by(c);
      if (this.formats[u]) {
        let f = a;
        try {
          const g = ((l = o == null ? void 0 : o.formatParams) == null ? void 0 : l[o.interpolationkey]) || {}, v = g.locale || g.lng || o.locale || o.lng || r;
          f = this.formats[u](a, v, {
            ...d,
            ...o,
            ...g
          });
        } catch (g) {
          this.logger.warn(g);
        }
        return f;
      } else
        this.logger.warn(`there was no format function for ${u}`);
      return a;
    }, t);
  }
}
const _y = (e, t) => {
  e.pending[t] !== void 0 && (delete e.pending[t], e.pendingCount--);
};
class Cy extends oi {
  constructor(t, n, r, o = {}) {
    var i, s;
    super(), this.backend = t, this.store = n, this.services = r, this.languageUtils = r.languageUtils, this.options = o, this.logger = Pt.create("backendConnector"), this.waitingReads = [], this.maxParallelReads = o.maxParallelReads || 10, this.readingCalls = 0, this.maxRetries = o.maxRetries >= 0 ? o.maxRetries : 5, this.retryTimeout = o.retryTimeout >= 1 ? o.retryTimeout : 350, this.state = {}, this.queue = [], (s = (i = this.backend) == null ? void 0 : i.init) == null || s.call(i, r, o.backend, o);
  }
  queueLoad(t, n, r, o) {
    const i = {}, s = {}, a = {}, c = {};
    return t.forEach((u) => {
      let d = !0;
      n.forEach((l) => {
        const f = `${u}|${l}`;
        !r.reload && this.store.hasResourceBundle(u, l) ? this.state[f] = 2 : this.state[f] < 0 || (this.state[f] === 1 ? s[f] === void 0 && (s[f] = !0) : (this.state[f] = 1, d = !1, s[f] === void 0 && (s[f] = !0), i[f] === void 0 && (i[f] = !0), c[l] === void 0 && (c[l] = !0)));
      }), d || (a[u] = !0);
    }), (Object.keys(i).length || Object.keys(s).length) && this.queue.push({
      pending: s,
      pendingCount: Object.keys(s).length,
      loaded: {},
      errors: [],
      callback: o
    }), {
      toLoad: Object.keys(i),
      pending: Object.keys(s),
      toLoadLanguages: Object.keys(a),
      toLoadNamespaces: Object.keys(c)
    };
  }
  loaded(t, n, r) {
    const o = t.split("|"), i = o[0], s = o[1];
    n && this.emit("failedLoading", i, s, n), !n && r && this.store.addResourceBundle(i, s, r, void 0, void 0, {
      skipCopy: !0
    }), this.state[t] = n ? -1 : 2, n && r && (this.state[t] = 0);
    const a = {};
    this.queue.forEach((c) => {
      cy(c.loaded, [i], s), _y(c, t), n && c.errors.push(n), c.pendingCount === 0 && !c.done && (Object.keys(c.loaded).forEach((u) => {
        a[u] || (a[u] = {});
        const d = c.loaded[u];
        d.length && d.forEach((l) => {
          a[u][l] === void 0 && (a[u][l] = !0);
        });
      }), c.done = !0, c.errors.length ? c.callback(c.errors) : c.callback());
    }), this.emit("loaded", a), this.queue = this.queue.filter((c) => !c.done);
  }
  read(t, n, r, o = 0, i = this.retryTimeout, s) {
    if (!t.length) return s(null, {});
    if (this.readingCalls >= this.maxParallelReads) {
      this.waitingReads.push({
        lng: t,
        ns: n,
        fcName: r,
        tried: o,
        wait: i,
        callback: s
      });
      return;
    }
    this.readingCalls++;
    const a = (u, d) => {
      if (this.readingCalls--, this.waitingReads.length > 0) {
        const l = this.waitingReads.shift();
        this.read(l.lng, l.ns, l.fcName, l.tried, l.wait, l.callback);
      }
      if (u && d && o < this.maxRetries) {
        setTimeout(() => {
          this.read(t, n, r, o + 1, i * 2, s);
        }, i);
        return;
      }
      s(u, d);
    }, c = this.backend[r].bind(this.backend);
    if (c.length === 2) {
      try {
        const u = c(t, n);
        u && typeof u.then == "function" ? u.then((d) => a(null, d)).catch(a) : a(null, u);
      } catch (u) {
        a(u);
      }
      return;
    }
    return c(t, n, a);
  }
  prepareLoading(t, n, r = {}, o) {
    if (!this.backend)
      return this.logger.warn("No backend was added via i18next.use. Will not load resources."), o && o();
    fe(t) && (t = this.languageUtils.toResolveHierarchy(t)), fe(n) && (n = [n]);
    const i = this.queueLoad(t, n, r, o);
    if (!i.toLoad.length)
      return i.pending.length || o(), null;
    i.toLoad.forEach((s) => {
      this.loadOne(s);
    });
  }
  load(t, n, r) {
    this.prepareLoading(t, n, {}, r);
  }
  reload(t, n, r) {
    this.prepareLoading(t, n, {
      reload: !0
    }, r);
  }
  loadOne(t, n = "") {
    const r = t.split("|"), o = r[0], i = r[1];
    this.read(o, i, "read", void 0, void 0, (s, a) => {
      s && this.logger.warn(`${n}loading namespace ${i} for language ${o} failed`, s), !s && a && this.logger.log(`${n}loaded namespace ${i} for language ${o}`, a), this.loaded(t, s, a);
    });
  }
  saveMissing(t, n, r, o, i, s = {}, a = () => {
  }) {
    var c, u, d, l, f;
    if ((u = (c = this.services) == null ? void 0 : c.utils) != null && u.hasLoadedNamespace && !((l = (d = this.services) == null ? void 0 : d.utils) != null && l.hasLoadedNamespace(n))) {
      this.logger.warn(`did not save key "${r}" as the namespace "${n}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
      return;
    }
    if (!(r == null || r === "")) {
      if ((f = this.backend) != null && f.create) {
        const g = {
          ...s,
          isUpdate: i
        }, v = this.backend.create.bind(this.backend);
        if (v.length < 6)
          try {
            let p;
            v.length === 5 ? p = v(t, n, r, o, g) : p = v(t, n, r, o), p && typeof p.then == "function" ? p.then((b) => a(null, b)).catch(a) : a(null, p);
          } catch (p) {
            a(p);
          }
        else
          v(t, n, r, o, a, g);
      }
      !t || !t[0] || this.store.addResource(t[0], n, r, o);
    }
  }
}
const zi = () => ({
  debug: !1,
  initAsync: !0,
  ns: ["translation"],
  defaultNS: ["translation"],
  fallbackLng: ["dev"],
  fallbackNS: !1,
  supportedLngs: !1,
  nonExplicitSupportedLngs: !1,
  load: "all",
  preload: !1,
  keySeparator: ".",
  nsSeparator: ":",
  pluralSeparator: "_",
  contextSeparator: "_",
  partialBundledLanguages: !1,
  saveMissing: !1,
  updateMissing: !1,
  saveMissingTo: "fallback",
  saveMissingPlurals: !0,
  missingKeyHandler: !1,
  missingInterpolationHandler: !1,
  postProcess: !1,
  postProcessPassResolved: !1,
  returnNull: !1,
  returnEmptyString: !0,
  returnObjects: !1,
  joinArrays: !1,
  returnedObjectHandler: !1,
  parseMissingKeyHandler: !1,
  appendNamespaceToMissingKey: !1,
  appendNamespaceToCIMode: !1,
  overloadTranslationOptionHandler: (e) => {
    let t = {};
    if (typeof e[1] == "object" && (t = e[1]), fe(e[1]) && (t.defaultValue = e[1]), fe(e[2]) && (t.tDescription = e[2]), typeof e[2] == "object" || typeof e[3] == "object") {
      const n = e[3] || e[2];
      Object.keys(n).forEach((r) => {
        t[r] = n[r];
      });
    }
    return t;
  },
  interpolation: {
    escapeValue: !0,
    prefix: "{{",
    suffix: "}}",
    formatSeparator: ",",
    unescapePrefix: "-",
    nestingPrefix: "$t(",
    nestingSuffix: ")",
    nestingOptionsSeparator: ",",
    maxReplaces: 1e3,
    skipOnVariables: !0
  },
  cacheInBuiltFormats: !0
}), ul = (e) => (fe(e.ns) && (e.ns = [e.ns]), fe(e.fallbackLng) && (e.fallbackLng = [e.fallbackLng]), fe(e.fallbackNS) && (e.fallbackNS = [e.fallbackNS]), e.supportedLngs && !e.supportedLngs.includes("cimode") && (e.supportedLngs = e.supportedLngs.concat(["cimode"])), e), ho = () => {
}, xy = (e) => {
  Object.getOwnPropertyNames(Object.getPrototypeOf(e)).forEach((n) => {
    typeof e[n] == "function" && (e[n] = e[n].bind(e));
  });
};
class Ar extends oi {
  constructor(t = {}, n) {
    if (super(), this.options = ul(t), this.services = {}, this.logger = Pt, this.modules = {
      external: []
    }, xy(this), n && !this.isInitialized && !t.isClone) {
      if (!this.options.initAsync)
        return this.init(t, n), this;
      setTimeout(() => {
        this.init(t, n);
      }, 0);
    }
  }
  init(t = {}, n) {
    this.isInitializing = !0, typeof t == "function" && (n = t, t = {}), t.defaultNS == null && t.ns && (fe(t.ns) ? t.defaultNS = t.ns : t.ns.includes("translation") || (t.defaultNS = t.ns[0]));
    const r = zi();
    this.options = {
      ...r,
      ...this.options,
      ...ul(t)
    }, this.options.interpolation = {
      ...r.interpolation,
      ...this.options.interpolation
    }, t.keySeparator !== void 0 && (this.options.userDefinedKeySeparator = t.keySeparator), t.nsSeparator !== void 0 && (this.options.userDefinedNsSeparator = t.nsSeparator), typeof this.options.overloadTranslationOptionHandler != "function" && (this.options.overloadTranslationOptionHandler = r.overloadTranslationOptionHandler);
    const o = (u) => u ? typeof u == "function" ? new u() : u : null;
    if (!this.options.isClone) {
      this.modules.logger ? Pt.init(o(this.modules.logger), this.options) : Pt.init(null, this.options);
      let u;
      this.modules.formatter ? u = this.modules.formatter : u = wy;
      const d = new ol(this.options);
      this.store = new rl(this.options.resources, this.options);
      const l = this.services;
      l.logger = Pt, l.resourceStore = this.store, l.languageUtils = d, l.pluralResolver = new yy(d, {
        prepend: this.options.pluralSeparator
      }), u && (l.formatter = o(u), l.formatter.init && l.formatter.init(l, this.options), this.options.interpolation.format = l.formatter.format.bind(l.formatter)), l.interpolator = new cl(this.options), l.utils = {
        hasLoadedNamespace: this.hasLoadedNamespace.bind(this)
      }, l.backendConnector = new Cy(o(this.modules.backend), l.resourceStore, l, this.options), l.backendConnector.on("*", (f, ...g) => {
        this.emit(f, ...g);
      }), this.modules.languageDetector && (l.languageDetector = o(this.modules.languageDetector), l.languageDetector.init && l.languageDetector.init(l, this.options.detection, this.options)), this.modules.i18nFormat && (l.i18nFormat = o(this.modules.i18nFormat), l.i18nFormat.init && l.i18nFormat.init(this)), this.translator = new Ko(this.services, this.options), this.translator.on("*", (f, ...g) => {
        this.emit(f, ...g);
      }), this.modules.external.forEach((f) => {
        f.init && f.init(this);
      });
    }
    if (this.format = this.options.interpolation.format, n || (n = ho), this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
      const u = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
      u.length > 0 && u[0] !== "dev" && (this.options.lng = u[0]);
    }
    !this.services.languageDetector && !this.options.lng && this.logger.warn("init: no languageDetector is used and no lng is defined"), ["getResource", "hasResourceBundle", "getResourceBundle", "getDataByLanguage"].forEach((u) => {
      this[u] = (...d) => this.store[u](...d);
    }), ["addResource", "addResources", "addResourceBundle", "removeResourceBundle"].forEach((u) => {
      this[u] = (...d) => (this.store[u](...d), this);
    });
    const a = wr(), c = () => {
      const u = (d, l) => {
        this.isInitializing = !1, this.isInitialized && !this.initializedStoreOnce && this.logger.warn("init: i18next is already initialized. You should call init just once!"), this.isInitialized = !0, this.options.isClone || this.logger.log("initialized", this.options), this.emit("initialized", this.options), a.resolve(l), n(d, l);
      };
      if ((this.languages || this.isLanguageChangingTo) && !this.isInitialized) return u(null, this.t.bind(this));
      this.changeLanguage(this.options.lng, u);
    };
    return this.options.resources || !this.options.initAsync ? c() : setTimeout(c, 0), a;
  }
  loadResources(t, n = ho) {
    var i, s;
    let r = n;
    const o = fe(t) ? t : this.language;
    if (typeof t == "function" && (r = t), !this.options.resources || this.options.partialBundledLanguages) {
      if ((o == null ? void 0 : o.toLowerCase()) === "cimode" && (!this.options.preload || this.options.preload.length === 0)) return r();
      const a = [], c = (u) => {
        if (!u || u === "cimode") return;
        this.services.languageUtils.toResolveHierarchy(u).forEach((l) => {
          l !== "cimode" && (a.includes(l) || a.push(l));
        });
      };
      o ? c(o) : this.services.languageUtils.getFallbackCodes(this.options.fallbackLng).forEach((d) => c(d)), (s = (i = this.options.preload) == null ? void 0 : i.forEach) == null || s.call(i, (u) => c(u)), this.services.backendConnector.load(a, this.options.ns, (u) => {
        !u && !this.resolvedLanguage && this.language && this.setResolvedLanguage(this.language), r(u);
      });
    } else
      r(null);
  }
  reloadResources(t, n, r) {
    const o = wr();
    return typeof t == "function" && (r = t, t = void 0), typeof n == "function" && (r = n, n = void 0), t || (t = this.languages), n || (n = this.options.ns), r || (r = ho), this.services.backendConnector.reload(t, n, (i) => {
      o.resolve(), r(i);
    }), o;
  }
  use(t) {
    if (!t) throw new Error("You are passing an undefined module! Please check the object you are passing to i18next.use()");
    if (!t.type) throw new Error("You are passing a wrong module! Please check the object you are passing to i18next.use()");
    return t.type === "backend" && (this.modules.backend = t), (t.type === "logger" || t.log && t.warn && t.error) && (this.modules.logger = t), t.type === "languageDetector" && (this.modules.languageDetector = t), t.type === "i18nFormat" && (this.modules.i18nFormat = t), t.type === "postProcessor" && Yd.addPostProcessor(t), t.type === "formatter" && (this.modules.formatter = t), t.type === "3rdParty" && this.modules.external.push(t), this;
  }
  setResolvedLanguage(t) {
    if (!(!t || !this.languages) && !["cimode", "dev"].includes(t)) {
      for (let n = 0; n < this.languages.length; n++) {
        const r = this.languages[n];
        if (!["cimode", "dev"].includes(r) && this.store.hasLanguageSomeTranslations(r)) {
          this.resolvedLanguage = r;
          break;
        }
      }
      !this.resolvedLanguage && !this.languages.includes(t) && this.store.hasLanguageSomeTranslations(t) && (this.resolvedLanguage = t, this.languages.unshift(t));
    }
  }
  changeLanguage(t, n) {
    this.isLanguageChangingTo = t;
    const r = wr();
    this.emit("languageChanging", t);
    const o = (a) => {
      this.language = a, this.languages = this.services.languageUtils.toResolveHierarchy(a), this.resolvedLanguage = void 0, this.setResolvedLanguage(a);
    }, i = (a, c) => {
      c ? this.isLanguageChangingTo === t && (o(c), this.translator.changeLanguage(c), this.isLanguageChangingTo = void 0, this.emit("languageChanged", c), this.logger.log("languageChanged", c)) : this.isLanguageChangingTo = void 0, r.resolve((...u) => this.t(...u)), n && n(a, (...u) => this.t(...u));
    }, s = (a) => {
      var d, l;
      !t && !a && this.services.languageDetector && (a = []);
      const c = fe(a) ? a : a && a[0], u = this.store.hasLanguageSomeTranslations(c) ? c : this.services.languageUtils.getBestMatchFromCodes(fe(a) ? [a] : a);
      u && (this.language || o(u), this.translator.language || this.translator.changeLanguage(u), (l = (d = this.services.languageDetector) == null ? void 0 : d.cacheUserLanguage) == null || l.call(d, u)), this.loadResources(u, (f) => {
        i(f, u);
      });
    };
    return !t && this.services.languageDetector && !this.services.languageDetector.async ? s(this.services.languageDetector.detect()) : !t && this.services.languageDetector && this.services.languageDetector.async ? this.services.languageDetector.detect.length === 0 ? this.services.languageDetector.detect().then(s) : this.services.languageDetector.detect(s) : s(t), r;
  }
  getFixedT(t, n, r) {
    const o = (i, s, ...a) => {
      let c;
      typeof s != "object" ? c = this.options.overloadTranslationOptionHandler([i, s].concat(a)) : c = {
        ...s
      }, c.lng = c.lng || o.lng, c.lngs = c.lngs || o.lngs, c.ns = c.ns || o.ns, c.keyPrefix !== "" && (c.keyPrefix = c.keyPrefix || r || o.keyPrefix);
      const u = {
        ...this.options,
        ...c
      };
      typeof c.keyPrefix == "function" && (c.keyPrefix = qn(c.keyPrefix, u));
      const d = this.options.keySeparator || ".";
      let l;
      return c.keyPrefix && Array.isArray(i) ? l = i.map((f) => (typeof f == "function" && (f = qn(f, u)), `${c.keyPrefix}${d}${f}`)) : (typeof i == "function" && (i = qn(i, u)), l = c.keyPrefix ? `${c.keyPrefix}${d}${i}` : i), this.t(l, c);
    };
    return fe(t) ? o.lng = t : o.lngs = t, o.ns = n, o.keyPrefix = r, o;
  }
  t(...t) {
    var n;
    return (n = this.translator) == null ? void 0 : n.translate(...t);
  }
  exists(...t) {
    var n;
    return (n = this.translator) == null ? void 0 : n.exists(...t);
  }
  setDefaultNamespace(t) {
    this.options.defaultNS = t;
  }
  hasLoadedNamespace(t, n = {}) {
    if (!this.isInitialized)
      return this.logger.warn("hasLoadedNamespace: i18next was not initialized", this.languages), !1;
    if (!this.languages || !this.languages.length)
      return this.logger.warn("hasLoadedNamespace: i18n.languages were undefined or empty", this.languages), !1;
    const r = n.lng || this.resolvedLanguage || this.languages[0], o = this.options ? this.options.fallbackLng : !1, i = this.languages[this.languages.length - 1];
    if (r.toLowerCase() === "cimode") return !0;
    const s = (a, c) => {
      const u = this.services.backendConnector.state[`${a}|${c}`];
      return u === -1 || u === 0 || u === 2;
    };
    if (n.precheck) {
      const a = n.precheck(this, s);
      if (a !== void 0) return a;
    }
    return !!(this.hasResourceBundle(r, t) || !this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages || s(r, t) && (!o || s(i, t)));
  }
  loadNamespaces(t, n) {
    const r = wr();
    return this.options.ns ? (fe(t) && (t = [t]), t.forEach((o) => {
      this.options.ns.includes(o) || this.options.ns.push(o);
    }), this.loadResources((o) => {
      r.resolve(), n && n(o);
    }), r) : (n && n(), Promise.resolve());
  }
  loadLanguages(t, n) {
    const r = wr();
    fe(t) && (t = [t]);
    const o = this.options.preload || [], i = t.filter((s) => !o.includes(s) && this.services.languageUtils.isSupportedCode(s));
    return i.length ? (this.options.preload = o.concat(i), this.loadResources((s) => {
      r.resolve(), n && n(s);
    }), r) : (n && n(), Promise.resolve());
  }
  dir(t) {
    var o, i;
    if (t || (t = this.resolvedLanguage || (((o = this.languages) == null ? void 0 : o.length) > 0 ? this.languages[0] : this.language)), !t) return "rtl";
    try {
      const s = new Intl.Locale(t);
      if (s && s.getTextInfo) {
        const a = s.getTextInfo();
        if (a && a.direction) return a.direction;
      }
    } catch {
    }
    const n = ["ar", "shu", "sqr", "ssh", "xaa", "yhd", "yud", "aao", "abh", "abv", "acm", "acq", "acw", "acx", "acy", "adf", "ads", "aeb", "aec", "afb", "ajp", "apc", "apd", "arb", "arq", "ars", "ary", "arz", "auz", "avl", "ayh", "ayl", "ayn", "ayp", "bbz", "pga", "he", "iw", "ps", "pbt", "pbu", "pst", "prp", "prd", "ug", "ur", "ydd", "yds", "yih", "ji", "yi", "hbo", "men", "xmn", "fa", "jpr", "peo", "pes", "prs", "dv", "sam", "ckb"], r = ((i = this.services) == null ? void 0 : i.languageUtils) || new ol(zi());
    return t.toLowerCase().indexOf("-latn") > 1 ? "ltr" : n.includes(r.getLanguagePartFromCode(t)) || t.toLowerCase().indexOf("-arab") > 1 ? "rtl" : "ltr";
  }
  static createInstance(t = {}, n) {
    const r = new Ar(t, n);
    return r.createInstance = Ar.createInstance, r;
  }
  cloneInstance(t = {}, n = ho) {
    const r = t.forkResourceStore;
    r && delete t.forkResourceStore;
    const o = {
      ...this.options,
      ...t,
      isClone: !0
    }, i = new Ar(o);
    if ((t.debug !== void 0 || t.prefix !== void 0) && (i.logger = i.logger.clone(t)), ["store", "services", "language"].forEach((a) => {
      i[a] = this[a];
    }), i.services = {
      ...this.services
    }, i.services.utils = {
      hasLoadedNamespace: i.hasLoadedNamespace.bind(i)
    }, r) {
      const a = Object.keys(this.store.data).reduce((c, u) => (c[u] = {
        ...this.store.data[u]
      }, c[u] = Object.keys(c[u]).reduce((d, l) => (d[l] = {
        ...c[u][l]
      }, d), c[u]), c), {});
      i.store = new rl(a, o), i.services.resourceStore = i.store;
    }
    if (t.interpolation) {
      const c = {
        ...zi().interpolation,
        ...this.options.interpolation,
        ...t.interpolation
      }, u = {
        ...o,
        interpolation: c
      };
      i.services.interpolator = new cl(u);
    }
    return i.translator = new Ko(i.services, o), i.translator.on("*", (a, ...c) => {
      i.emit(a, ...c);
    }), i.init(o, n), i.translator.options = o, i.translator.backendConnector.services.utils = {
      hasLoadedNamespace: i.hasLoadedNamespace.bind(i)
    }, i;
  }
  toJSON() {
    return {
      options: this.options,
      store: this.store,
      language: this.language,
      languages: this.languages,
      resolvedLanguage: this.resolvedLanguage
    };
  }
}
const st = Ar.createInstance(), Ey = st.createInstance;
st.dir;
st.init;
st.loadResources;
st.reloadResources;
st.use;
st.changeLanguage;
st.getFixedT;
st.t;
st.exists;
st.setDefaultNamespace;
st.hasLoadedNamespace;
st.loadNamespaces;
st.loadLanguages;
function Ry(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
const Iy = (e, t, n, r) => {
  var i, s, a, c;
  const o = [n, {
    code: t,
    ...r || {}
  }];
  if ((s = (i = e == null ? void 0 : e.services) == null ? void 0 : i.logger) != null && s.forward)
    return e.services.logger.forward(o, "warn", "react-i18next::", !0);
  yn(o[0]) && (o[0] = `react-i18next:: ${o[0]}`), (c = (a = e == null ? void 0 : e.services) == null ? void 0 : a.logger) != null && c.warn ? e.services.logger.warn(...o) : console != null && console.warn && console.warn(...o);
}, dl = {}, Os = (e, t, n, r) => {
  yn(n) && dl[n] || (yn(n) && (dl[n] = /* @__PURE__ */ new Date()), Iy(e, t, n, r));
}, Zd = (e, t) => () => {
  if (e.isInitialized)
    t();
  else {
    const n = () => {
      setTimeout(() => {
        e.off("initialized", n);
      }, 0), t();
    };
    e.on("initialized", n);
  }
}, Ps = (e, t, n) => {
  e.loadNamespaces(t, Zd(e, n));
}, fl = (e, t, n, r) => {
  if (yn(n) && (n = [n]), e.options.preload && e.options.preload.indexOf(t) > -1) return Ps(e, n, r);
  n.forEach((o) => {
    e.options.ns.indexOf(o) < 0 && e.options.ns.push(o);
  }), e.loadLanguages(t, Zd(e, r));
}, Ty = (e, t, n = {}) => !t.languages || !t.languages.length ? (Os(t, "NO_LANGUAGES", "i18n.languages were undefined or empty", {
  languages: t.languages
}), !0) : t.hasLoadedNamespace(e, {
  lng: n.lng,
  precheck: (r, o) => {
    if (n.bindI18n && n.bindI18n.indexOf("languageChanging") > -1 && r.services.backendConnector.backend && r.isLanguageChangingTo && !o(r.isLanguageChangingTo, e)) return !1;
  }
}), yn = (e) => typeof e == "string", Ny = (e) => typeof e == "object" && e !== null, Ay = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g, Oy = {
  "&amp;": "&",
  "&#38;": "&",
  "&lt;": "<",
  "&#60;": "<",
  "&gt;": ">",
  "&#62;": ">",
  "&apos;": "'",
  "&#39;": "'",
  "&quot;": '"',
  "&#34;": '"',
  "&nbsp;": " ",
  "&#160;": " ",
  "&copy;": "©",
  "&#169;": "©",
  "&reg;": "®",
  "&#174;": "®",
  "&hellip;": "…",
  "&#8230;": "…",
  "&#x2F;": "/",
  "&#47;": "/"
}, Py = (e) => Oy[e], My = (e) => e.replace(Ay, Py);
let Ms = {
  bindI18n: "languageChanged",
  bindI18nStore: "",
  transEmptyNodeValue: "",
  transSupportBasicHtmlNodes: !0,
  transWrapTextNodes: "",
  transKeepBasicHtmlNodesFor: ["br", "strong", "i", "p"],
  useSuspense: !0,
  unescape: My,
  transDefaultProps: void 0
};
const ky = (e = {}) => {
  Ms = {
    ...Ms,
    ...e
  };
}, Dy = () => Ms;
let Jd;
const $y = (e) => {
  Jd = e;
}, Ly = () => Jd, Fy = {
  type: "3rdParty",
  init(e) {
    ky(e.options.react), $y(e);
  }
}, Qd = or();
class Vy {
  constructor() {
    this.usedNamespaces = {};
  }
  addUsedNamespaces(t) {
    t.forEach((n) => {
      this.usedNamespaces[n] || (this.usedNamespaces[n] = !0);
    });
  }
  getUsedNamespaces() {
    return Object.keys(this.usedNamespaces);
  }
}
var po = { exports: {} }, ji = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hl;
function By() {
  if (hl) return ji;
  hl = 1;
  var e = k;
  function t(l, f) {
    return l === f && (l !== 0 || 1 / l === 1 / f) || l !== l && f !== f;
  }
  var n = typeof Object.is == "function" ? Object.is : t, r = e.useState, o = e.useEffect, i = e.useLayoutEffect, s = e.useDebugValue;
  function a(l, f) {
    var g = f(), v = r({ inst: { value: g, getSnapshot: f } }), p = v[0].inst, b = v[1];
    return i(
      function() {
        p.value = g, p.getSnapshot = f, c(p) && b({ inst: p });
      },
      [l, g, f]
    ), o(
      function() {
        return c(p) && b({ inst: p }), l(function() {
          c(p) && b({ inst: p });
        });
      },
      [l]
    ), s(g), g;
  }
  function c(l) {
    var f = l.getSnapshot;
    l = l.value;
    try {
      var g = f();
      return !n(l, g);
    } catch {
      return !0;
    }
  }
  function u(l, f) {
    return f();
  }
  var d = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? u : a;
  return ji.useSyncExternalStore = e.useSyncExternalStore !== void 0 ? e.useSyncExternalStore : d, ji;
}
var Ui = {};
/**
 * @license React
 * use-sync-external-store-shim.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var pl;
function zy() {
  return pl || (pl = 1, process.env.NODE_ENV !== "production" && (function() {
    function e(g, v) {
      return g === v && (g !== 0 || 1 / g === 1 / v) || g !== g && v !== v;
    }
    function t(g, v) {
      d || o.startTransition === void 0 || (d = !0, console.error(
        "You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."
      ));
      var p = v();
      if (!l) {
        var b = v();
        i(p, b) || (console.error(
          "The result of getSnapshot should be cached to avoid an infinite loop"
        ), l = !0);
      }
      b = s({
        inst: { value: p, getSnapshot: v }
      });
      var y = b[0].inst, S = b[1];
      return c(
        function() {
          y.value = p, y.getSnapshot = v, n(y) && S({ inst: y });
        },
        [g, p, v]
      ), a(
        function() {
          return n(y) && S({ inst: y }), g(function() {
            n(y) && S({ inst: y });
          });
        },
        [g]
      ), u(p), p;
    }
    function n(g) {
      var v = g.getSnapshot;
      g = g.value;
      try {
        var p = v();
        return !i(g, p);
      } catch {
        return !0;
      }
    }
    function r(g, v) {
      return v();
    }
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var o = k, i = typeof Object.is == "function" ? Object.is : e, s = o.useState, a = o.useEffect, c = o.useLayoutEffect, u = o.useDebugValue, d = !1, l = !1, f = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? r : t;
    Ui.useSyncExternalStore = o.useSyncExternalStore !== void 0 ? o.useSyncExternalStore : f, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  })()), Ui;
}
var ml;
function jy() {
  return ml || (ml = 1, process.env.NODE_ENV === "production" ? po.exports = By() : po.exports = zy()), po.exports;
}
var Uy = jy();
const Hy = (e, t) => {
  if (yn(t)) return t;
  if (Ny(t) && yn(t.defaultValue)) return t.defaultValue;
  if (typeof e == "function") return "";
  if (Array.isArray(e)) {
    const n = e[e.length - 1];
    return typeof n == "function" ? "" : n;
  }
  return e;
}, Wy = {
  t: Hy,
  ready: !1
}, Ky = () => () => {
}, de = (e, t = {}) => {
  var I, M, N;
  const {
    i18n: n
  } = t, {
    i18n: r,
    defaultNS: o
  } = xn(Qd) || {}, i = n || r || Ly();
  i && !i.reportNamespaces && (i.reportNamespaces = new Vy()), i || Os(i, "NO_I18NEXT_INSTANCE", "useTranslation: You will need to pass in an i18next instance by using initReactI18next");
  const s = he(() => {
    var $;
    return {
      ...Dy(),
      ...($ = i == null ? void 0 : i.options) == null ? void 0 : $.react,
      ...t
    };
  }, [i, t]), {
    useSuspense: a,
    keyPrefix: c
  } = s, u = o || ((I = i == null ? void 0 : i.options) == null ? void 0 : I.defaultNS), d = yn(u) ? [u] : u || ["translation"], l = he(() => d, d);
  (N = (M = i == null ? void 0 : i.reportNamespaces) == null ? void 0 : M.addUsedNamespaces) == null || N.call(M, l);
  const f = ue(0), g = q(($) => {
    if (!i) return Ky;
    const {
      bindI18n: T,
      bindI18nStore: O
    } = s, F = () => {
      f.current += 1, $();
    };
    return T && i.on(T, F), O && i.store.on(O, F), () => {
      T && T.split(" ").forEach((A) => i.off(A, F)), O && O.split(" ").forEach((A) => i.store.off(A, F));
    };
  }, [i, s]), v = ue(), p = q(() => {
    if (!i)
      return Wy;
    const $ = !!(i.isInitialized || i.initializedStoreOnce) && l.every((V) => Ty(V, i, s)), T = t.lng || i.language, O = f.current, F = v.current;
    if (F && F.ready === $ && F.lng === T && F.keyPrefix === c && F.revision === O)
      return F;
    const D = {
      t: i.getFixedT(T, s.nsMode === "fallback" ? l : l[0], c),
      ready: $,
      lng: T,
      keyPrefix: c,
      revision: O
    };
    return v.current = D, D;
  }, [i, l, c, s, t.lng]), [b, y] = ne(0), {
    t: S,
    ready: w
  } = Uy.useSyncExternalStore(g, p, p);
  oe(() => {
    if (i && !w && !a) {
      const $ = () => y((T) => T + 1);
      t.lng ? fl(i, t.lng, l, $) : Ps(i, l, $);
    }
  }, [i, t.lng, l, w, a, b]);
  const _ = i || {}, C = ue(null), R = ue(), x = ($) => {
    const T = Object.getOwnPropertyDescriptors($);
    T.__original && delete T.__original;
    const O = Object.create(Object.getPrototypeOf($), T);
    if (!Object.prototype.hasOwnProperty.call(O, "__original"))
      try {
        Object.defineProperty(O, "__original", {
          value: $,
          writable: !1,
          enumerable: !1,
          configurable: !1
        });
      } catch {
      }
    return O;
  }, E = he(() => {
    const $ = _, T = $ == null ? void 0 : $.language;
    let O = $;
    $ && (C.current && C.current.__original === $ ? R.current !== T ? (O = x($), C.current = O, R.current = T) : O = C.current : (O = x($), C.current = O, R.current = T));
    const F = !w && !a ? (...D) => (Os(i, "USE_T_BEFORE_READY", "useTranslation: t was called before ready. When using useSuspense: false, make sure to check the ready flag before using t."), S(...D)) : S, A = [F, O, w];
    return A.t = F, A.i18n = O, A.ready = w, A;
  }, [S, _, w, _.resolvedLanguage, _.language, _.languages]);
  if (i && a && !w)
    throw new Promise(($) => {
      const T = () => $();
      t.lng ? fl(i, t.lng, l, T) : Ps(i, l, T);
    });
  return E;
};
function qy({
  i18n: e,
  defaultNS: t,
  children: n
}) {
  const r = he(() => ({
    i18n: e,
    defaultNS: t
  }), [e, t]);
  return Uo(Qd.Provider, {
    value: r
  }, n);
}
const Gy = {
  "participant.previous_page": "Previous page",
  "participant.next_page": "Next page",
  "audio.audio_options": "Audio options",
  "audio.autoplay_blocked": "Interaction is required to start audio",
  "audio.join_audio": "Join audio",
  "audio.leave": "Leave audio",
  "audio.microphone": "Microphone",
  "audio.muted_by_host": "Host muted you",
  "audio.muted_notification": "You are muted now.",
  "audio.mute": "Mute",
  "audio.speaker": "Speaker",
  "audio.unmute": "Unmute",
  "common.close": "Close",
  "common.cancel": "Cancel",
  "common.delete": "Delete",
  "common.ok": "OK",
  "common.copy": "Copy",
  "common.copied": "Copied",
  "common.connecting": "Connecting...",
  "common.ending": "Ending...",
  "common.guest": "Guest",
  "common.save": "Save",
  "common.me": "me",
  "common.working": "Working...",
  "common.no_devices": "No devices",
  "common.select_device": "Select device",
  "common.switching": "Switching...",
  "common.you": "You",
  "chat.disabled": "Chat is disabled",
  "chat.message_actions": "Message actions",
  "chat.delete_message": "Delete message",
  "chat.delete_message_title": "Delete message?",
  "chat.delete_message_confirmation": "This message will be permanently deleted for everyone.",
  "chat.delete_message_failed": "Unable to delete the message",
  "chat.everyone": "Everyone",
  "chat.jump_to_latest": "Jump to latest messages",
  "chat.message_history": "Chat message history",
  "chat.message_input": "Chat message",
  "chat.message_placeholder": "Type message here ...",
  "chat.more_options": "More chat options",
  "chat.no_receivers": "No available recipients",
  "chat.privilege_all": "Everyone and anyone directly",
  "chat.privilege_label": "Participants Can Chat with:",
  "chat.privilege_none": "No one",
  "chat.privilege_public": "Everyone",
  "chat.receiver_label": "Send chat to",
  "chat.send": "Send message",
  "chat.title": "Meeting Chat",
  "chat.to": "To:",
  "chat.to_receiver": "to",
  "chat.unread_count": "{{count}} unread message",
  "chat.unread_count_other": "{{count}} unread messages",
  "error.auth_endpoint_required": "authEndpoint is required when fetching a Video SDK token.",
  "error.auth_endpoint_response_missing_token": "The auth endpoint response did not include a token.",
  "error.create_client_before_join": "Create a Zoom Video SDK client before joining a session.",
  "error.create_client_before_provider": "Create a Zoom Video SDK client before using the toolkit provider.",
  "error.topic_and_user_name_required": "topic and userName are required to join a Zoom Video SDK session.",
  "error.missing_session_credentials": "Missing session credentials. Provide token, getToken, or authEndpoint.",
  "error.zoom_video_sdk_generic": "Something went wrong while talking to the Zoom Video SDK.",
  "error.token_request_failed": "Token request failed with status {{status}}.",
  "media.start_audio_failed": "Start audio failed",
  "media.start_audio_permission_denied": "Microphone access was denied. Check your browser and system permissions, then try again.",
  "media.leave_audio_failed": "Leave audio failed",
  "media.switch_microphone_failed": "Switch microphone failed",
  "media.switch_camera_failed": "Switch camera failed",
  "media.switch_speaker_failed": "Switch speaker failed",
  "media.toggle_audio_failed": "Toggle audio failed",
  "media.noise_suppression_failed": "Noise suppression failed",
  "media.original_sound_failed": "Original sound failed",
  "media.headset_sync_failed": "Headset sync failed",
  "media.mirror_video_failed": "Mirror video failed",
  "media.hardware_acceleration_failed": "Hardware acceleration failed",
  "media.virtual_background_failed": "Virtual background failed",
  "media.stop_video_failed": "Stop video failed",
  "media.video_capture_failed": "Video capture failed",
  "media.video_no_camera": "No camera was detected.",
  "media.video_camera_unavailable": "The selected camera is unavailable. Choose another camera and try again.",
  "media.video_permission_denied": "Camera access was denied. Check your browser and system permissions, then try again.",
  "media.video_camera_in_use": "Your camera is being used by another application.",
  "media.video_connection_failed": "Could not connect to the camera. Try again.",
  "media.active_error.title": "Media issue detected",
  "media.active_error.title_microphone_connection": "Microphone connection failed",
  "media.active_error.title_microphone_permission": "Microphone permission required",
  "media.active_error.title_microphone_muted": "Microphone muted",
  "media.active_error.title_microphone_interrupted": "Microphone interrupted",
  "media.active_error.title_audio_playback_interrupted": "Audio playback interrupted",
  "media.active_error.title_camera_connection": "Camera connection failed",
  "media.active_error.title_camera_permission": "Camera permission required",
  "media.active_error.title_video_rendering": "Video rendering issue",
  "media.active_error.title_camera_interrupted": "Camera interrupted",
  "media.active_error.title_screen_share_connection": "Screen sharing connection failed",
  "media.active_error.refresh": "Refresh",
  "media.active_error.resume_audio": "Resume audio",
  "media.active_error.resume_video": "Resume video",
  "media.active_error.generic": `We detected a media issue that cannot be recovered automatically.
Refresh the browser or rejoin the session if the issue continues.`,
  "media.active_error.code_101": `Audio could not connect.
Refresh the browser to reconnect audio.`,
  "media.active_error.code_102": `The audio stream was interrupted.
Refresh the browser, then rejoin audio.`,
  "media.active_error.code_103": `Microphone permission was denied.
Grant microphone permission, then try audio again.`,
  "media.active_error.code_104": `Audio data could not be read from the stream.
Close all browser windows, then rejoin the session.`,
  "media.active_error.code_105": `The microphone is muted in system or browser settings.
Unmute it there, then try again.`,
  "media.active_error.code_106": `The microphone was temporarily interrupted.
Click anywhere on the page to restore audio.`,
  "media.active_error.code_107": `Audio playback was interrupted by the system.
Click anywhere on the page to resume playback.`,
  "media.active_error.code_201": `Video could not connect.
Refresh the browser to reconnect video.`,
  "media.active_error.code_202": `The camera stream was interrupted.
Refresh the browser, then try video again.`,
  "media.active_error.code_203": `Camera permission was denied.
Grant camera permission, then try video again.`,
  "media.active_error.code_204": `Video rendering lost its WebGL context.
Check browser WebGL support or refresh the browser.`,
  "media.active_error.code_205": `The browser ran out of memory for video processing.
Close all browser windows, then rejoin the session.`,
  "media.active_error.code_206": `Video data could not be read from the stream.
Close all browser windows, then rejoin the session.`,
  "media.active_error.code_207": `The camera was temporarily interrupted.
Click anywhere on the page to restore video.`,
  "media.active_error.code_301": `Screen share data could not be read from the stream.
Close all browser windows, then rejoin the session.`,
  "media.permission_required_camera": "Camera access is required.",
  "media.permission_required_description": "Allow access in your browser settings, then try again.",
  "media.permission_required_microphone": "Microphone access is required.",
  "session.assign_and_leave": "Assign and leave",
  "session.assign_new_host": "Assign a new host",
  "session.end_meeting_for_all": "End meeting for all",
  "session.join_session": "Join session",
  "session.joining": "Joining the session...",
  "session.leave": "Leave",
  "session.leave_meeting": "Leave meeting",
  "session.leave_session": "Leave session",
  "session.leaving": "Leaving...",
  "session.reclaim_host": "Reclaim host",
  "session.reclaim_host_message": "{{name}} is currently host. Reclaiming host may disrupt current session experience.",
  "session.stay_manager": "Stay manager",
  "session.stay_participant": "Stay participant",
  "participant.actions_for": "Actions for {{name}}",
  "participant.ask_to_unmute": "Ask to unmute",
  "participant.cancel": "Cancel",
  "participant.change_host": "Change host",
  "participant.change_host_to": "Change host to {{name}}",
  "participant.manager": "Manager",
  "participant.host": "Host",
  "participant.make_host": "Make Host",
  "participant.make_host_info": "You can't assign co-owner access to Zoom Room or users from different accounts.",
  "participant.make_manager": "Make Manager",
  "participant.mute_all": "Mute All",
  "participant.no_results": "No participants found",
  "participant.remove": "Remove",
  "participant.go_to_page": "Go to page {{page}}",
  "participant.go_to_shared_screen": "Go to shared screen",
  "participant.rename": "Rename",
  "participant.rename_placeholder": "Enter a new name",
  "participant.revoke_manager": "Demote from Manager",
  "participant.search_label": "Search participants",
  "participant.clear_search": "Clear participant search",
  "participant.search_placeholder": "Search participants…",
  "recording.pause_recording": "Pause recording",
  "recording.resume_recording": "Resume recording",
  "recording.start_recording": "Start recording",
  "recording.stop_recording": "Stop recording",
  "recording.recording_options": "Recording options",
  "recording.recording": "Recording",
  "recording.paused": "Recording paused",
  "recording.error_start": "Could not start cloud recording",
  "recording.error_stop": "Could not stop cloud recording",
  "recording.error_pause": "Could not pause cloud recording",
  "recording.error_resume": "Could not resume cloud recording",
  "recording.error_account_disabled": "Cloud recording is not enabled for this account.",
  "recording.error_host_only": "Only the host or co-host can control cloud recording.",
  "recording.error_stop_forbidden": "This account does not allow cloud recording to be paused or stopped.",
  "recording.error_state_mismatch": "The cloud recording status changed before the action completed. Try again.",
  "recording.consent_title": "This session is being recorded",
  "recording.consent_message": "By staying in the session, you consent to being recorded. After the session ends, the recording file will be available to the host and participants who have recording permissions.",
  "recording.consent_leave": "Leave",
  "recording.consent_stay": "Stay",
  "recording.individual_consent_title": "Allow individual cloud recording?",
  "recording.individual_consent_message": "The host has started individual cloud recording. Do you want to allow your audio and video to be recorded?",
  "recording.individual_consent_allow": "Allow",
  "recording.individual_consent_decline": "Decline",
  "notification.later": "Later",
  "notification.spotlight_join_audio": "Join audio",
  "notification.spotlight_join_audio_content": "The host has spotlighted your video for everyone. Would you like to join audio to speak?",
  "notification.spotlight_unmute_content": "The host has spotlighted your video for everyone. Would you like to unmute your microphone to speak?",
  "notification.spotlight_unmute_myself": "Unmute myself",
  "notification.stay_muted": "Stay muted",
  "notification.unmute_button": "Unmute myself",
  "notification.unmute_content": "If you choose to unmute, others in the session will be able to hear you.",
  "notification.unmute_title": "The host would like you to unmute",
  "toolbar.ai_companion": "AI Companion",
  "toolbar.chat": "Chat",
  "toolbar.end": "End",
  "toolbar.join": "Join",
  "toolbar.more": "More",
  "toolbar.more_empty": "No additional controls",
  "toolbar.participants": "Participants",
  "toolbar.react": "React",
  "toolbar.record": "Record",
  "share.advanced_options": "Screen share options",
  "share.disable_annotation_for_others": "Disable annotation for others",
  "share.error.generic": "Unable to start screen share.",
  "share.error.host_disabled": "Host disabled attendee screen sharing.",
  "share.error.other_sharing": "You cannot start screen share while another participant is sharing.",
  "share.error.start_failed": "Failed to start sharing your screen.",
  "share.error.stopped_privilege_change": "Your screen share was stopped because the host changed the sharing privileges.",
  "share.fit_to_window": "Fit to window",
  "share.hide_names_of_annotators": "Hide names of annotators",
  "share.move_controls": "Move sharing controls",
  "share.no_active_share": "No active screen share",
  "share.optimize_for_video_clip": "Optimize for video clip",
  "share.original_size": "Original size",
  "share.pause_share": "Pause share",
  "share.presenter_name": "{{name}}'s screen",
  "share.presenter_status": "You're screen sharing",
  "share.resume_share": "Resume share",
  "share.privilege_host_only": "Only host or cohost can share screen",
  "share.privilege_multiple": "Multiple participants can share simultaneously",
  "share.privilege_one_at_a_time": "One participant can share at a time",
  "share.share_options": "Share options",
  "share.share_screen": "Share screen",
  "share.stop_share": "Stop share",
  "share.view_options": "View Options",
  "share.viewing_screen": "You are viewing {{name}}'s screen",
  "settings.tab.audio": "Audio",
  "settings.tab.video": "Video",
  "settings.tab.share": "Share screen",
  "settings.tab.qos": "Statistics",
  "settings.tabs_label": "Settings categories",
  "settings.audio.headset": "Headset",
  "settings.audio.headset_sync": "Sync Headset Buttons",
  "settings.audio.microphone": "Microphone",
  "settings.audio.microphone_modes": "Microphone modes",
  "settings.audio.no_devices": "No devices found",
  "settings.audio.noise_suppression": "Noise Suppression",
  "settings.audio.original_sound": "Original Sound",
  "settings.audio.recording_playing": "Recording playing...",
  "settings.audio.stop_playing": "Stop playing",
  "settings.audio.stop_recording": "Stop recording",
  "settings.audio.speaker": "Speaker",
  "settings.audio.stop_test": "Stop",
  "settings.audio.test_microphone": "Test microphone",
  "settings.audio.test_speaker": "Test speaker",
  "settings.video.camera": "Camera",
  "settings.video.preview_unavailable": "Camera preview unavailable",
  "settings.video.virtual_background": "Virtual Background",
  "settings.video.background_none": "None",
  "settings.video.background_blur": "Blur",
  "settings.video.options": "Video options",
  "settings.video.mirror": "Mirror my video",
  "settings.video.hardware_acceleration_receiving": "Enable Hardware Acceleration (Receiving)",
  "settings.video.hardware_acceleration_sending": "Enable Hardware Acceleration (Sending)",
  "settings.qos.audio": "Audio",
  "settings.qos.video": "Video",
  "settings.qos.share": "Share",
  "settings.qos.item_name": "Item name",
  "settings.qos.send": "Send",
  "settings.qos.receive": "Receive",
  "settings.qos.frequency": "Frequency",
  "settings.qos.latency": "Latency",
  "settings.qos.jitter": "Jitter",
  "settings.qos.packet_loss": "Packet Loss - Avg(Max)",
  "settings.qos.resolution": "Resolution",
  "settings.qos.fps": "Frame Per Second",
  "toolbar.settings": "Settings",
  "toolbar.share": "Share",
  "video.camera": "Camera",
  "video.connecting_to_audio": "Connecting",
  "video.empty_description_in_session": "Participant video tiles will appear here automatically as cameras connect.",
  "video.empty_description_prejoin": "Render this surface after your pre-join flow completes to launch the meeting layout.",
  "video.empty_title_in_session": "Waiting for participants to join.",
  "video.empty_title_prejoin": "Video stage is ready.",
  "video.start_video": "Start video",
  "video.stop_video": "Stop video",
  "video.video": "Video",
  "video.video_options": "Video options",
  "view.gallery": "Gallery",
  "view.speaker": "Speaker",
  "sessionInfo.title": "Session Info",
  "sessionInfo.topic": "Topic",
  "sessionInfo.sessionId": "Session ID",
  "sessionInfo.inviteLink": "Invite Link",
  "sessionInfo.yourName": "Your Name",
  "sessionInfo.yourUserId": "Your User ID"
}, Yy = {
  "participant.previous_page": "上一页",
  "participant.next_page": "下一页",
  "audio.audio_options": "音频选项",
  "audio.autoplay_blocked": "需要交互以开始播放音频",
  "audio.join_audio": "加入音频",
  "audio.leave": "离开音频",
  "audio.microphone": "麦克风",
  "audio.muted_by_host": "主持人已将您静音",
  "audio.muted_notification": "您已被静音。",
  "audio.mute": "静音",
  "audio.speaker": "扬声器",
  "audio.unmute": "取消静音",
  "common.close": "关闭",
  "common.cancel": "取消",
  "common.delete": "删除",
  "common.ok": "确定",
  "common.copy": "复制",
  "common.copied": "已复制",
  "common.connecting": "连接中...",
  "common.ending": "结束中...",
  "common.guest": "访客",
  "common.save": "保存",
  "common.me": "我",
  "common.working": "处理中...",
  "common.no_devices": "无设备",
  "common.select_device": "选择设备",
  "common.switching": "切换中...",
  "common.you": "您",
  "chat.disabled": "聊天已禁用",
  "chat.message_actions": "消息操作",
  "chat.delete_message": "删除消息",
  "chat.delete_message_title": "删除消息？",
  "chat.delete_message_confirmation": "此消息将对所有人永久删除。",
  "chat.delete_message_failed": "无法删除消息",
  "chat.everyone": "所有人",
  "chat.jump_to_latest": "跳到最新消息",
  "chat.message_history": "聊天消息记录",
  "chat.message_input": "聊天消息",
  "chat.message_placeholder": "在此输入消息 ...",
  "chat.more_options": "更多聊天选项",
  "chat.no_receivers": "没有可用的接收者",
  "chat.privilege_all": "所有人及任何人私聊",
  "chat.privilege_label": "参会者可以聊天的对象：",
  "chat.privilege_none": "无人",
  "chat.privilege_public": "所有人",
  "chat.receiver_label": "发送聊天给",
  "chat.send": "发送消息",
  "chat.title": "会议聊天",
  "chat.to": "发送给：",
  "chat.to_receiver": "发送给",
  "chat.unread_count": "{{count}} 条未读消息",
  "error.auth_endpoint_required": "获取 Video SDK 令牌时必须提供 authEndpoint。",
  "error.auth_endpoint_response_missing_token": "身份验证端点响应未包含令牌。",
  "error.create_client_before_join": "加入会话前请先创建 Zoom Video SDK 客户端。",
  "error.create_client_before_provider": "使用工具包 provider 前请先创建 Zoom Video SDK 客户端。",
  "error.topic_and_user_name_required": "加入 Zoom Video SDK 会话需要 topic 和 userName。",
  "error.missing_session_credentials": "缺少会话凭据。请提供 token、getToken 或 authEndpoint。",
  "error.zoom_video_sdk_generic": "与 Zoom Video SDK 通信时出现问题。",
  "error.token_request_failed": "令牌请求失败，状态码为 {{status}}。",
  "media.start_audio_failed": "启动音频失败",
  "media.start_audio_permission_denied": "麦克风访问被拒绝。请检查浏览器和系统权限，然后重试。",
  "media.leave_audio_failed": "离开音频失败",
  "media.switch_microphone_failed": "切换麦克风失败",
  "media.switch_camera_failed": "切换摄像头失败",
  "media.switch_speaker_failed": "切换扬声器失败",
  "media.toggle_audio_failed": "切换音频失败",
  "media.noise_suppression_failed": "噪音消除失败",
  "media.original_sound_failed": "原声设置失败",
  "media.headset_sync_failed": "耳机同步失败",
  "media.mirror_video_failed": "视频镜像设置失败",
  "media.hardware_acceleration_failed": "硬件加速设置失败",
  "media.virtual_background_failed": "虚拟背景设置失败",
  "media.stop_video_failed": "停止视频失败",
  "media.video_capture_failed": "视频采集失败",
  "media.video_no_camera": "未检测到摄像头。",
  "media.video_camera_unavailable": "所选摄像头不可用。请选择其他摄像头，然后重试。",
  "media.video_permission_denied": "摄像头访问被拒绝。请检查浏览器和系统权限，然后重试。",
  "media.video_camera_in_use": "摄像头正被其他应用程序使用。",
  "media.video_connection_failed": "无法连接摄像头。请重试。",
  "media.active_error.title": "检测到媒体问题",
  "media.active_error.title_microphone_connection": "麦克风连接失败",
  "media.active_error.title_microphone_permission": "需要麦克风权限",
  "media.active_error.title_microphone_muted": "麦克风已静音",
  "media.active_error.title_microphone_interrupted": "麦克风已中断",
  "media.active_error.title_audio_playback_interrupted": "音频播放已中断",
  "media.active_error.title_camera_connection": "摄像头连接失败",
  "media.active_error.title_camera_permission": "需要摄像头权限",
  "media.active_error.title_video_rendering": "视频渲染问题",
  "media.active_error.title_camera_interrupted": "摄像头已中断",
  "media.active_error.title_screen_share_connection": "屏幕共享连接失败",
  "media.active_error.refresh": "刷新",
  "media.active_error.resume_audio": "恢复音频",
  "media.active_error.resume_video": "恢复视频",
  "media.active_error.generic": `检测到无法自动恢复的媒体问题。
如果问题仍然存在，请刷新浏览器或重新加入会话。`,
  "media.active_error.code_101": `音频无法连接。
请刷新浏览器以重新连接音频。`,
  "media.active_error.code_102": `音频流已中断。
请刷新浏览器，然后重新加入音频。`,
  "media.active_error.code_103": `麦克风权限被拒绝。
请授予麦克风权限，然后重试音频。`,
  "media.active_error.code_104": `无法从音频流读取数据。
请关闭所有浏览器窗口，然后重新加入会话。`,
  "media.active_error.code_105": `麦克风已在系统或浏览器设置中静音。
请在那里取消静音，然后重试。`,
  "media.active_error.code_106": `麦克风曾被临时中断。
点击页面任意位置以恢复音频。`,
  "media.active_error.code_107": `音频播放被系统中断。
点击页面任意位置以恢复播放。`,
  "media.active_error.code_201": `视频无法连接。
请刷新浏览器以重新连接视频。`,
  "media.active_error.code_202": `摄像头流已中断。
请刷新浏览器，然后重试视频。`,
  "media.active_error.code_203": `摄像头权限被拒绝。
请授予摄像头权限，然后重试视频。`,
  "media.active_error.code_204": `视频渲染失去了 WebGL 上下文。
请检查浏览器 WebGL 支持或刷新浏览器。`,
  "media.active_error.code_205": `浏览器的视频处理内存不足。
请关闭所有浏览器窗口，然后重新加入会话。`,
  "media.active_error.code_206": `无法从视频流读取数据。
请关闭所有浏览器窗口，然后重新加入会话。`,
  "media.active_error.code_207": `摄像头曾被临时中断。
点击页面任意位置以恢复视频。`,
  "media.active_error.code_301": `无法从屏幕共享流读取数据。
请关闭所有浏览器窗口，然后重新加入会话。`,
  "media.permission_required_camera": "需要摄像头访问权限。",
  "media.permission_required_description": "请在浏览器设置中允许访问，然后重试。",
  "media.permission_required_microphone": "需要麦克风访问权限。",
  "session.assign_and_leave": "指定并离开",
  "session.assign_new_host": "指定新主持人",
  "session.end_meeting_for_all": "为所有人结束会议",
  "session.join_session": "加入会话",
  "session.joining": "正在加入会话...",
  "session.leave": "离开",
  "session.leave_meeting": "离开会议",
  "session.leave_session": "离开会话",
  "session.leaving": "离开中...",
  "session.reclaim_host": "收回主持人",
  "session.reclaim_host_message": "{{name}} 当前是主持人。收回主持人权限可能会影响当前会话体验。",
  "session.stay_manager": "保持管理员",
  "session.stay_participant": "保持参会者身份",
  "participant.actions_for": "{{name}} 的操作",
  "participant.ask_to_unmute": "请求取消静音",
  "participant.cancel": "取消",
  "participant.change_host": "更改主持人",
  "participant.change_host_to": "将主持人更改为 {{name}}",
  "participant.manager": "管理员",
  "participant.host": "主持人",
  "participant.make_host": "设为主持人",
  "participant.make_host_info": "无法将共同所有者权限分配给 Zoom Room 或来自其他账户的用户。",
  "participant.make_manager": "设为管理员",
  "participant.mute_all": "全部静音",
  "participant.no_results": "未找到参会者",
  "participant.remove": "移除",
  "participant.go_to_page": "转到第 {{page}} 页",
  "participant.go_to_shared_screen": "转到共享屏幕",
  "participant.rename": "重命名",
  "participant.rename_placeholder": "输入新名称",
  "participant.revoke_manager": "取消管理员",
  "participant.search_label": "搜索参会者",
  "participant.clear_search": "清除参会者搜索",
  "participant.search_placeholder": "搜索参会者…",
  "recording.pause_recording": "暂停录制",
  "recording.resume_recording": "恢复录制",
  "recording.start_recording": "开始录制",
  "recording.stop_recording": "停止录制",
  "recording.recording_options": "录制选项",
  "recording.recording": "录制中",
  "recording.paused": "录制已暂停",
  "recording.error_start": "无法开始云录制",
  "recording.error_stop": "无法停止云录制",
  "recording.error_pause": "无法暂停云录制",
  "recording.error_resume": "无法恢复云录制",
  "recording.error_account_disabled": "此账户未启用云录制。",
  "recording.error_host_only": "只有主持人或联席主持人可以控制云录制。",
  "recording.error_stop_forbidden": "此账户不允许暂停或停止云录制。",
  "recording.error_state_mismatch": "操作完成前云录制状态已更改。请重试。",
  "recording.consent_title": "此会话正在录制中",
  "recording.consent_message": "继续留在会话中即表示您同意被录制。会话结束后，录制文件将提供给主持人和具有录制权限的参会者。",
  "recording.consent_leave": "离开",
  "recording.consent_stay": "留下",
  "recording.individual_consent_title": "允许个人云录制？",
  "recording.individual_consent_message": "主持人已开始个人云录制。您是否允许录制您的音频和视频？",
  "recording.individual_consent_allow": "允许",
  "recording.individual_consent_decline": "拒绝",
  "notification.later": "稍后",
  "notification.spotlight_join_audio": "加入音频",
  "notification.spotlight_join_audio_content": "主持人已将你的视频设为所有人可见的焦点。你想加入音频发言吗？",
  "notification.spotlight_unmute_content": "主持人已将你的视频设为所有人可见的焦点。你想取消麦克风静音发言吗？",
  "notification.spotlight_unmute_myself": "取消我的静音",
  "notification.stay_muted": "保持静音",
  "notification.unmute_button": "取消我的静音",
  "notification.unmute_content": "如果你选择取消静音，会话中的其他人将能够听到你的声音。",
  "notification.unmute_title": "主持人希望你取消静音",
  "toolbar.ai_companion": "AI Companion",
  "toolbar.chat": "聊天",
  "toolbar.end": "结束",
  "toolbar.join": "加入",
  "toolbar.more": "更多",
  "toolbar.more_empty": "没有更多控件",
  "toolbar.participants": "参会者",
  "toolbar.react": "回应",
  "toolbar.record": "录制",
  "share.advanced_options": "屏幕共享选项",
  "share.disable_annotation_for_others": "禁止其他人注释",
  "share.error.generic": "无法开始屏幕共享。",
  "share.error.host_disabled": "主持人已禁止参会者共享屏幕。",
  "share.error.other_sharing": "其他参会者正在共享时，您无法开始屏幕共享。",
  "share.error.start_failed": "无法开始共享您的屏幕。",
  "share.error.stopped_privilege_change": "由于主持人更改了共享权限，您的屏幕共享已停止。",
  "share.fit_to_window": "适应窗口",
  "share.hide_names_of_annotators": "隐藏注释者姓名",
  "share.move_controls": "移动共享控制栏",
  "share.no_active_share": "无屏幕共享",
  "share.optimize_for_video_clip": "针对视频剪辑优化",
  "share.original_size": "原始尺寸",
  "share.pause_share": "暂停共享",
  "share.presenter_name": "{{name}} 的屏幕",
  "share.presenter_status": "您正在共享屏幕",
  "share.resume_share": "恢复共享",
  "share.privilege_host_only": "仅主持人或联席主持人可以共享屏幕",
  "share.privilege_multiple": "多位参会者可同时共享",
  "share.privilege_one_at_a_time": "同一时间仅一位参会者可共享",
  "share.share_options": "共享选项",
  "share.share_screen": "共享屏幕",
  "share.stop_share": "停止共享",
  "share.view_options": "查看选项",
  "share.viewing_screen": "您正在查看 {{name}} 的屏幕",
  "settings.tab.audio": "音频",
  "settings.tab.video": "视频",
  "settings.tab.share": "共享屏幕",
  "settings.tab.qos": "统计信息",
  "settings.tabs_label": "设置类别",
  "settings.audio.headset": "耳机",
  "settings.audio.headset_sync": "同步耳机按钮",
  "settings.audio.microphone": "麦克风",
  "settings.audio.microphone_modes": "麦克风模式",
  "settings.audio.no_devices": "未找到设备",
  "settings.audio.noise_suppression": "噪音消除",
  "settings.audio.original_sound": "原声",
  "settings.audio.recording_playing": "正在播放录音...",
  "settings.audio.stop_playing": "停止播放",
  "settings.audio.stop_recording": "停止录音",
  "settings.audio.speaker": "扬声器",
  "settings.audio.stop_test": "停止",
  "settings.audio.test_microphone": "测试麦克风",
  "settings.audio.test_speaker": "测试扬声器",
  "settings.video.camera": "摄像头",
  "settings.video.preview_unavailable": "无法预览摄像头",
  "settings.video.virtual_background": "虚拟背景",
  "settings.video.background_none": "无",
  "settings.video.background_blur": "虚化",
  "settings.video.options": "视频选项",
  "settings.video.mirror": "镜像我的视频",
  "settings.video.hardware_acceleration_receiving": "启用硬件加速（接收）",
  "settings.video.hardware_acceleration_sending": "启用硬件加速（发送）",
  "settings.qos.audio": "音频",
  "settings.qos.video": "视频",
  "settings.qos.share": "共享",
  "settings.qos.item_name": "项目名称",
  "settings.qos.send": "发送",
  "settings.qos.receive": "接收",
  "settings.qos.frequency": "频率",
  "settings.qos.latency": "延迟",
  "settings.qos.jitter": "抖动",
  "settings.qos.packet_loss": "丢包 - 平均（最大）",
  "settings.qos.resolution": "分辨率",
  "settings.qos.fps": "帧率",
  "toolbar.settings": "设置",
  "toolbar.share": "共享",
  "video.camera": "摄像头",
  "video.connecting_to_audio": "正在连接",
  "video.empty_description_in_session": "当摄像头连接后，参会者视频画面将自动显示在这里。",
  "video.empty_description_prejoin": "预加入流程完成后渲染此区域以启动会议布局。",
  "video.empty_title_in_session": "正在等待参会者加入。",
  "video.empty_title_prejoin": "视频区域已就绪。",
  "video.start_video": "开启视频",
  "video.stop_video": "停止视频",
  "video.video": "视频",
  "video.video_options": "视频选项",
  "view.gallery": "画廊视图",
  "view.speaker": "演讲者视图",
  "sessionInfo.title": "会话信息",
  "sessionInfo.topic": "主题",
  "sessionInfo.sessionId": "会话 ID",
  "sessionInfo.inviteLink": "邀请链接",
  "sessionInfo.yourName": "你的名称",
  "sessionInfo.yourUserId": "你的用户 ID"
}, ks = "en-US", Xy = {
  "en-US": {
    translation: Gy
  },
  "zh-CN": {
    translation: Yy
  }
}, qe = Ey();
qe.use(Fy).init({
  resources: Xy,
  lng: ks,
  fallbackLng: ks,
  interpolation: {
    escapeValue: !1
  },
  react: {
    useSuspense: !1
  }
});
function ce(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
  return function(o) {
    if (e == null || e(o), n === !1 || !o.defaultPrevented)
      return t == null ? void 0 : t(o);
  };
}
function gl(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
function ii(...e) {
  return (t) => {
    let n = !1;
    const r = e.map((o) => {
      const i = gl(o, t);
      return !n && typeof i == "function" && (n = !0), i;
    });
    if (n)
      return () => {
        for (let o = 0; o < r.length; o++) {
          const i = r[o];
          typeof i == "function" ? i() : gl(e[o], null);
        }
      };
  };
}
function ze(...e) {
  return m.useCallback(ii(...e), e);
}
function Zy(e, t) {
  const n = m.createContext(t), r = (i) => {
    const { children: s, ...a } = i, c = m.useMemo(() => a, Object.values(a));
    return /* @__PURE__ */ h(n.Provider, { value: c, children: s });
  };
  r.displayName = e + "Provider";
  function o(i) {
    const s = m.useContext(n);
    if (s) return s;
    if (t !== void 0) return t;
    throw new Error(`\`${i}\` must be used within \`${e}\``);
  }
  return [r, o];
}
function sn(e, t = []) {
  let n = [];
  function r(i, s) {
    const a = m.createContext(s), c = n.length;
    n = [...n, s];
    const u = (l) => {
      var y;
      const { scope: f, children: g, ...v } = l, p = ((y = f == null ? void 0 : f[e]) == null ? void 0 : y[c]) || a, b = m.useMemo(() => v, Object.values(v));
      return /* @__PURE__ */ h(p.Provider, { value: b, children: g });
    };
    u.displayName = i + "Provider";
    function d(l, f) {
      var p;
      const g = ((p = f == null ? void 0 : f[e]) == null ? void 0 : p[c]) || a, v = m.useContext(g);
      if (v) return v;
      if (s !== void 0) return s;
      throw new Error(`\`${l}\` must be used within \`${i}\``);
    }
    return [u, d];
  }
  const o = () => {
    const i = n.map((s) => m.createContext(s));
    return function(a) {
      const c = (a == null ? void 0 : a[e]) || i;
      return m.useMemo(
        () => ({ [`__scope${e}`]: { ...a, [e]: c } }),
        [a, c]
      );
    };
  };
  return o.scopeName = e, [r, Jy(o, ...t)];
}
function Jy(...e) {
  const t = e[0];
  if (e.length === 1) return t;
  const n = () => {
    const r = e.map((o) => ({
      useScope: o(),
      scopeName: o.scopeName
    }));
    return function(i) {
      const s = r.reduce((a, { useScope: c, scopeName: u }) => {
        const l = c(i)[`__scope${u}`];
        return { ...a, ...l };
      }, {});
      return m.useMemo(() => ({ [`__scope${t.scopeName}`]: s }), [s]);
    };
  };
  return n.scopeName = t.scopeName, n;
}
// @__NO_SIDE_EFFECTS__
function Jn(e) {
  const t = /* @__PURE__ */ Qy(e), n = m.forwardRef((r, o) => {
    const { children: i, ...s } = r, a = m.Children.toArray(i), c = a.find(tb);
    if (c) {
      const u = c.props.children, d = a.map((l) => l === c ? m.Children.count(u) > 1 ? m.Children.only(null) : m.isValidElement(u) ? u.props.children : null : l);
      return /* @__PURE__ */ h(t, { ...s, ref: o, children: m.isValidElement(u) ? m.cloneElement(u, void 0, d) : null });
    }
    return /* @__PURE__ */ h(t, { ...s, ref: o, children: i });
  });
  return n.displayName = `${e}.Slot`, n;
}
// @__NO_SIDE_EFFECTS__
function Qy(e) {
  const t = m.forwardRef((n, r) => {
    const { children: o, ...i } = n;
    if (m.isValidElement(o)) {
      const s = rb(o), a = nb(i, o.props);
      return o.type !== m.Fragment && (a.ref = r ? ii(r, s) : s), m.cloneElement(o, a);
    }
    return m.Children.count(o) > 1 ? m.Children.only(null) : null;
  });
  return t.displayName = `${e}.SlotClone`, t;
}
var eb = Symbol("radix.slottable");
function tb(e) {
  return m.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === eb;
}
function nb(e, t) {
  const n = { ...t };
  for (const r in t) {
    const o = e[r], i = t[r];
    /^on[A-Z]/.test(r) ? o && i ? n[r] = (...a) => {
      const c = i(...a);
      return o(...a), c;
    } : o && (n[r] = o) : r === "style" ? n[r] = { ...o, ...i } : r === "className" && (n[r] = [o, i].filter(Boolean).join(" "));
  }
  return { ...e, ...n };
}
function rb(e) {
  var r, o;
  let t = (r = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : r.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
function wa(e) {
  const t = e + "CollectionProvider", [n, r] = sn(t), [o, i] = n(
    t,
    { collectionRef: { current: null }, itemMap: /* @__PURE__ */ new Map() }
  ), s = (p) => {
    const { scope: b, children: y } = p, S = k.useRef(null), w = k.useRef(/* @__PURE__ */ new Map()).current;
    return /* @__PURE__ */ h(o, { scope: b, itemMap: w, collectionRef: S, children: y });
  };
  s.displayName = t;
  const a = e + "CollectionSlot", c = /* @__PURE__ */ Jn(a), u = k.forwardRef(
    (p, b) => {
      const { scope: y, children: S } = p, w = i(a, y), _ = ze(b, w.collectionRef);
      return /* @__PURE__ */ h(c, { ref: _, children: S });
    }
  );
  u.displayName = a;
  const d = e + "CollectionItemSlot", l = "data-radix-collection-item", f = /* @__PURE__ */ Jn(d), g = k.forwardRef(
    (p, b) => {
      const { scope: y, children: S, ...w } = p, _ = k.useRef(null), C = ze(b, _), R = i(d, y);
      return k.useEffect(() => (R.itemMap.set(_, { ref: _, ...w }), () => void R.itemMap.delete(_))), /* @__PURE__ */ h(f, { [l]: "", ref: C, children: S });
    }
  );
  g.displayName = d;
  function v(p) {
    const b = i(e + "CollectionConsumer", p);
    return k.useCallback(() => {
      const S = b.collectionRef.current;
      if (!S) return [];
      const w = Array.from(S.querySelectorAll(`[${l}]`));
      return Array.from(b.itemMap.values()).sort(
        (R, x) => w.indexOf(R.ref.current) - w.indexOf(x.ref.current)
      );
    }, [b.collectionRef, b.itemMap]);
  }
  return [
    { Provider: s, Slot: u, ItemSlot: g },
    v,
    r
  ];
}
var ob = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
], Te = ob.reduce((e, t) => {
  const n = /* @__PURE__ */ Jn(`Primitive.${t}`), r = m.forwardRef((o, i) => {
    const { asChild: s, ...a } = o, c = s ? n : t;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ h(c, { ...a, ref: i });
  });
  return r.displayName = `Primitive.${t}`, { ...e, [t]: r };
}, {});
function _a(e, t) {
  e && Rn.flushSync(() => e.dispatchEvent(t));
}
function it(e) {
  const t = m.useRef(e);
  return m.useEffect(() => {
    t.current = e;
  }), m.useMemo(() => (...n) => {
    var r;
    return (r = t.current) == null ? void 0 : r.call(t, ...n);
  }, []);
}
function ib(e, t = globalThis == null ? void 0 : globalThis.document) {
  const n = it(e);
  m.useEffect(() => {
    const r = (o) => {
      o.key === "Escape" && n(o);
    };
    return t.addEventListener("keydown", r, { capture: !0 }), () => t.removeEventListener("keydown", r, { capture: !0 });
  }, [n, t]);
}
var sb = "DismissableLayer", Ds = "dismissableLayer.update", ab = "dismissableLayer.pointerDownOutside", cb = "dismissableLayer.focusOutside", vl, ef = m.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set()
}), zr = m.forwardRef(
  (e, t) => {
    const {
      disableOutsidePointerEvents: n = !1,
      onEscapeKeyDown: r,
      onPointerDownOutside: o,
      onFocusOutside: i,
      onInteractOutside: s,
      onDismiss: a,
      ...c
    } = e, u = m.useContext(ef), [d, l] = m.useState(null), f = (d == null ? void 0 : d.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document), [, g] = m.useState({}), v = ze(t, (x) => l(x)), p = Array.from(u.layers), [b] = [...u.layersWithOutsidePointerEventsDisabled].slice(-1), y = p.indexOf(b), S = d ? p.indexOf(d) : -1, w = u.layersWithOutsidePointerEventsDisabled.size > 0, _ = S >= y, C = ub((x) => {
      const E = x.target, I = [...u.branches].some((M) => M.contains(E));
      !_ || I || (o == null || o(x), s == null || s(x), x.defaultPrevented || a == null || a());
    }, f), R = db((x) => {
      const E = x.target;
      [...u.branches].some((M) => M.contains(E)) || (i == null || i(x), s == null || s(x), x.defaultPrevented || a == null || a());
    }, f);
    return ib((x) => {
      S === u.layers.size - 1 && (r == null || r(x), !x.defaultPrevented && a && (x.preventDefault(), a()));
    }, f), m.useEffect(() => {
      if (d)
        return n && (u.layersWithOutsidePointerEventsDisabled.size === 0 && (vl = f.body.style.pointerEvents, f.body.style.pointerEvents = "none"), u.layersWithOutsidePointerEventsDisabled.add(d)), u.layers.add(d), yl(), () => {
          n && u.layersWithOutsidePointerEventsDisabled.size === 1 && (f.body.style.pointerEvents = vl);
        };
    }, [d, f, n, u]), m.useEffect(() => () => {
      d && (u.layers.delete(d), u.layersWithOutsidePointerEventsDisabled.delete(d), yl());
    }, [d, u]), m.useEffect(() => {
      const x = () => g({});
      return document.addEventListener(Ds, x), () => document.removeEventListener(Ds, x);
    }, []), /* @__PURE__ */ h(
      Te.div,
      {
        ...c,
        ref: v,
        style: {
          pointerEvents: w ? _ ? "auto" : "none" : void 0,
          ...e.style
        },
        onFocusCapture: ce(e.onFocusCapture, R.onFocusCapture),
        onBlurCapture: ce(e.onBlurCapture, R.onBlurCapture),
        onPointerDownCapture: ce(
          e.onPointerDownCapture,
          C.onPointerDownCapture
        )
      }
    );
  }
);
zr.displayName = sb;
var lb = "DismissableLayerBranch", tf = m.forwardRef((e, t) => {
  const n = m.useContext(ef), r = m.useRef(null), o = ze(t, r);
  return m.useEffect(() => {
    const i = r.current;
    if (i)
      return n.branches.add(i), () => {
        n.branches.delete(i);
      };
  }, [n.branches]), /* @__PURE__ */ h(Te.div, { ...e, ref: o });
});
tf.displayName = lb;
function ub(e, t = globalThis == null ? void 0 : globalThis.document) {
  const n = it(e), r = m.useRef(!1), o = m.useRef(() => {
  });
  return m.useEffect(() => {
    const i = (a) => {
      if (a.target && !r.current) {
        let c = function() {
          nf(
            ab,
            n,
            u,
            { discrete: !0 }
          );
        };
        const u = { originalEvent: a };
        a.pointerType === "touch" ? (t.removeEventListener("click", o.current), o.current = c, t.addEventListener("click", o.current, { once: !0 })) : c();
      } else
        t.removeEventListener("click", o.current);
      r.current = !1;
    }, s = window.setTimeout(() => {
      t.addEventListener("pointerdown", i);
    }, 0);
    return () => {
      window.clearTimeout(s), t.removeEventListener("pointerdown", i), t.removeEventListener("click", o.current);
    };
  }, [t, n]), {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: () => r.current = !0
  };
}
function db(e, t = globalThis == null ? void 0 : globalThis.document) {
  const n = it(e), r = m.useRef(!1);
  return m.useEffect(() => {
    const o = (i) => {
      i.target && !r.current && nf(cb, n, { originalEvent: i }, {
        discrete: !1
      });
    };
    return t.addEventListener("focusin", o), () => t.removeEventListener("focusin", o);
  }, [t, n]), {
    onFocusCapture: () => r.current = !0,
    onBlurCapture: () => r.current = !1
  };
}
function yl() {
  const e = new CustomEvent(Ds);
  document.dispatchEvent(e);
}
function nf(e, t, n, { discrete: r }) {
  const o = n.originalEvent.target, i = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: n });
  t && o.addEventListener(e, t, { once: !0 }), r ? _a(o, i) : o.dispatchEvent(i);
}
var fb = zr, hb = tf, Ut = globalThis != null && globalThis.document ? m.useLayoutEffect : () => {
}, pb = "Portal", In = m.forwardRef((e, t) => {
  var a;
  const { container: n, ...r } = e, [o, i] = m.useState(!1);
  Ut(() => i(!0), []);
  const s = n || o && ((a = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : a.body);
  return s ? Br.createPortal(/* @__PURE__ */ h(Te.div, { ...r, ref: t }), s) : null;
});
In.displayName = pb;
function mb(e, t) {
  return m.useReducer((n, r) => t[n][r] ?? n, e);
}
var Et = (e) => {
  const { present: t, children: n } = e, r = gb(t), o = typeof n == "function" ? n({ present: r.isPresent }) : m.Children.only(n), i = ze(r.ref, vb(o));
  return typeof n == "function" || r.isPresent ? m.cloneElement(o, { ref: i }) : null;
};
Et.displayName = "Presence";
function gb(e) {
  const [t, n] = m.useState(), r = m.useRef(null), o = m.useRef(e), i = m.useRef("none"), s = e ? "mounted" : "unmounted", [a, c] = mb(s, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  });
  return m.useEffect(() => {
    const u = mo(r.current);
    i.current = a === "mounted" ? u : "none";
  }, [a]), Ut(() => {
    const u = r.current, d = o.current;
    if (d !== e) {
      const f = i.current, g = mo(u);
      e ? c("MOUNT") : g === "none" || (u == null ? void 0 : u.display) === "none" ? c("UNMOUNT") : c(d && f !== g ? "ANIMATION_OUT" : "UNMOUNT"), o.current = e;
    }
  }, [e, c]), Ut(() => {
    if (t) {
      let u;
      const d = t.ownerDocument.defaultView ?? window, l = (g) => {
        const p = mo(r.current).includes(CSS.escape(g.animationName));
        if (g.target === t && p && (c("ANIMATION_END"), !o.current)) {
          const b = t.style.animationFillMode;
          t.style.animationFillMode = "forwards", u = d.setTimeout(() => {
            t.style.animationFillMode === "forwards" && (t.style.animationFillMode = b);
          });
        }
      }, f = (g) => {
        g.target === t && (i.current = mo(r.current));
      };
      return t.addEventListener("animationstart", f), t.addEventListener("animationcancel", l), t.addEventListener("animationend", l), () => {
        d.clearTimeout(u), t.removeEventListener("animationstart", f), t.removeEventListener("animationcancel", l), t.removeEventListener("animationend", l);
      };
    } else
      c("ANIMATION_END");
  }, [t, c]), {
    isPresent: ["mounted", "unmountSuspended"].includes(a),
    ref: m.useCallback((u) => {
      r.current = u ? getComputedStyle(u) : null, n(u);
    }, [])
  };
}
function mo(e) {
  return (e == null ? void 0 : e.animationName) || "none";
}
function vb(e) {
  var r, o;
  let t = (r = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : r.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
var yb = m[" useInsertionEffect ".trim().toString()] || Ut;
function ir({
  prop: e,
  defaultProp: t,
  onChange: n = () => {
  },
  caller: r
}) {
  const [o, i, s] = bb({
    defaultProp: t,
    onChange: n
  }), a = e !== void 0, c = a ? e : o;
  {
    const d = m.useRef(e !== void 0);
    m.useEffect(() => {
      const l = d.current;
      l !== a && console.warn(
        `${r} is changing from ${l ? "controlled" : "uncontrolled"} to ${a ? "controlled" : "uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
      ), d.current = a;
    }, [a, r]);
  }
  const u = m.useCallback(
    (d) => {
      var l;
      if (a) {
        const f = Sb(d) ? d(e) : d;
        f !== e && ((l = s.current) == null || l.call(s, f));
      } else
        i(d);
    },
    [a, e, i, s]
  );
  return [c, u];
}
function bb({
  defaultProp: e,
  onChange: t
}) {
  const [n, r] = m.useState(e), o = m.useRef(n), i = m.useRef(t);
  return yb(() => {
    i.current = t;
  }, [t]), m.useEffect(() => {
    var s;
    o.current !== n && ((s = i.current) == null || s.call(i, n), o.current = n);
  }, [n, o]), [n, r, i];
}
function Sb(e) {
  return typeof e == "function";
}
var wb = Object.freeze({
  // See: https://github.com/twbs/bootstrap/blob/main/scss/mixins/_visually-hidden.scss
  position: "absolute",
  border: 0,
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  wordWrap: "normal"
}), _b = "VisuallyHidden", Ca = m.forwardRef(
  (e, t) => /* @__PURE__ */ h(
    Te.span,
    {
      ...e,
      ref: t,
      style: { ...wb, ...e.style }
    }
  )
);
Ca.displayName = _b;
var xa = "ToastProvider", [Ea, Cb, xb] = wa("Toast"), [rf] = sn("Toast", [xb]), [Eb, si] = rf(xa), of = (e) => {
  const {
    __scopeToast: t,
    label: n = "Notification",
    duration: r = 5e3,
    swipeDirection: o = "right",
    swipeThreshold: i = 50,
    children: s
  } = e, [a, c] = m.useState(null), [u, d] = m.useState(0), l = m.useRef(!1), f = m.useRef(!1);
  return n.trim() || console.error(
    `Invalid prop \`label\` supplied to \`${xa}\`. Expected non-empty \`string\`.`
  ), /* @__PURE__ */ h(Ea.Provider, { scope: t, children: /* @__PURE__ */ h(
    Eb,
    {
      scope: t,
      label: n,
      duration: r,
      swipeDirection: o,
      swipeThreshold: i,
      toastCount: u,
      viewport: a,
      onViewportChange: c,
      onToastAdd: m.useCallback(() => d((g) => g + 1), []),
      onToastRemove: m.useCallback(() => d((g) => g - 1), []),
      isFocusedToastEscapeKeyDownRef: l,
      isClosePausedRef: f,
      children: s
    }
  ) });
};
of.displayName = xa;
var sf = "ToastViewport", Rb = ["F8"], $s = "toast.viewportPause", Ls = "toast.viewportResume", af = m.forwardRef(
  (e, t) => {
    const {
      __scopeToast: n,
      hotkey: r = Rb,
      label: o = "Notifications ({hotkey})",
      ...i
    } = e, s = si(sf, n), a = Cb(n), c = m.useRef(null), u = m.useRef(null), d = m.useRef(null), l = m.useRef(null), f = ze(t, l, s.onViewportChange), g = r.join("+").replace(/Key/g, "").replace(/Digit/g, ""), v = s.toastCount > 0;
    m.useEffect(() => {
      const b = (y) => {
        var w;
        r.length !== 0 && r.every((_) => y[_] || y.code === _) && ((w = l.current) == null || w.focus());
      };
      return document.addEventListener("keydown", b), () => document.removeEventListener("keydown", b);
    }, [r]), m.useEffect(() => {
      const b = c.current, y = l.current;
      if (v && b && y) {
        const S = () => {
          if (!s.isClosePausedRef.current) {
            const R = new CustomEvent($s);
            y.dispatchEvent(R), s.isClosePausedRef.current = !0;
          }
        }, w = () => {
          if (s.isClosePausedRef.current) {
            const R = new CustomEvent(Ls);
            y.dispatchEvent(R), s.isClosePausedRef.current = !1;
          }
        }, _ = (R) => {
          !b.contains(R.relatedTarget) && w();
        }, C = () => {
          b.contains(document.activeElement) || w();
        };
        return b.addEventListener("focusin", S), b.addEventListener("focusout", _), b.addEventListener("pointermove", S), b.addEventListener("pointerleave", C), window.addEventListener("blur", S), window.addEventListener("focus", w), () => {
          b.removeEventListener("focusin", S), b.removeEventListener("focusout", _), b.removeEventListener("pointermove", S), b.removeEventListener("pointerleave", C), window.removeEventListener("blur", S), window.removeEventListener("focus", w);
        };
      }
    }, [v, s.isClosePausedRef]);
    const p = m.useCallback(
      ({ tabbingDirection: b }) => {
        const S = a().map((w) => {
          const _ = w.ref.current, C = [_, ...Bb(_)];
          return b === "forwards" ? C : C.reverse();
        });
        return (b === "forwards" ? S.reverse() : S).flat();
      },
      [a]
    );
    return m.useEffect(() => {
      const b = l.current;
      if (b) {
        const y = (S) => {
          var C, R, x;
          const w = S.altKey || S.ctrlKey || S.metaKey;
          if (S.key === "Tab" && !w) {
            const E = document.activeElement, I = S.shiftKey;
            if (S.target === b && I) {
              (C = u.current) == null || C.focus();
              return;
            }
            const $ = p({ tabbingDirection: I ? "backwards" : "forwards" }), T = $.findIndex((O) => O === E);
            Hi($.slice(T + 1)) ? S.preventDefault() : I ? (R = u.current) == null || R.focus() : (x = d.current) == null || x.focus();
          }
        };
        return b.addEventListener("keydown", y), () => b.removeEventListener("keydown", y);
      }
    }, [a, p]), /* @__PURE__ */ P(
      hb,
      {
        ref: c,
        role: "region",
        "aria-label": o.replace("{hotkey}", g),
        tabIndex: -1,
        style: { pointerEvents: v ? void 0 : "none" },
        children: [
          v && /* @__PURE__ */ h(
            Fs,
            {
              ref: u,
              onFocusFromOutsideViewport: () => {
                const b = p({
                  tabbingDirection: "forwards"
                });
                Hi(b);
              }
            }
          ),
          /* @__PURE__ */ h(Ea.Slot, { scope: n, children: /* @__PURE__ */ h(Te.ol, { tabIndex: -1, ...i, ref: f }) }),
          v && /* @__PURE__ */ h(
            Fs,
            {
              ref: d,
              onFocusFromOutsideViewport: () => {
                const b = p({
                  tabbingDirection: "backwards"
                });
                Hi(b);
              }
            }
          )
        ]
      }
    );
  }
);
af.displayName = sf;
var cf = "ToastFocusProxy", Fs = m.forwardRef(
  (e, t) => {
    const { __scopeToast: n, onFocusFromOutsideViewport: r, ...o } = e, i = si(cf, n);
    return /* @__PURE__ */ h(
      Ca,
      {
        tabIndex: 0,
        ...o,
        ref: t,
        style: { position: "fixed" },
        onFocus: (s) => {
          var u;
          const a = s.relatedTarget;
          !((u = i.viewport) != null && u.contains(a)) && r();
        }
      }
    );
  }
);
Fs.displayName = cf;
var jr = "Toast", Ib = "toast.swipeStart", Tb = "toast.swipeMove", Nb = "toast.swipeCancel", Ab = "toast.swipeEnd", lf = m.forwardRef(
  (e, t) => {
    const { forceMount: n, open: r, defaultOpen: o, onOpenChange: i, ...s } = e, [a, c] = ir({
      prop: r,
      defaultProp: o ?? !0,
      onChange: i,
      caller: jr
    });
    return /* @__PURE__ */ h(Et, { present: n || a, children: /* @__PURE__ */ h(
      Mb,
      {
        open: a,
        ...s,
        ref: t,
        onClose: () => c(!1),
        onPause: it(e.onPause),
        onResume: it(e.onResume),
        onSwipeStart: ce(e.onSwipeStart, (u) => {
          u.currentTarget.setAttribute("data-swipe", "start");
        }),
        onSwipeMove: ce(e.onSwipeMove, (u) => {
          const { x: d, y: l } = u.detail.delta;
          u.currentTarget.setAttribute("data-swipe", "move"), u.currentTarget.style.setProperty("--radix-toast-swipe-move-x", `${d}px`), u.currentTarget.style.setProperty("--radix-toast-swipe-move-y", `${l}px`);
        }),
        onSwipeCancel: ce(e.onSwipeCancel, (u) => {
          u.currentTarget.setAttribute("data-swipe", "cancel"), u.currentTarget.style.removeProperty("--radix-toast-swipe-move-x"), u.currentTarget.style.removeProperty("--radix-toast-swipe-move-y"), u.currentTarget.style.removeProperty("--radix-toast-swipe-end-x"), u.currentTarget.style.removeProperty("--radix-toast-swipe-end-y");
        }),
        onSwipeEnd: ce(e.onSwipeEnd, (u) => {
          const { x: d, y: l } = u.detail.delta;
          u.currentTarget.setAttribute("data-swipe", "end"), u.currentTarget.style.removeProperty("--radix-toast-swipe-move-x"), u.currentTarget.style.removeProperty("--radix-toast-swipe-move-y"), u.currentTarget.style.setProperty("--radix-toast-swipe-end-x", `${d}px`), u.currentTarget.style.setProperty("--radix-toast-swipe-end-y", `${l}px`), c(!1);
        })
      }
    ) });
  }
);
lf.displayName = jr;
var [Ob, Pb] = rf(jr, {
  onClose() {
  }
}), Mb = m.forwardRef(
  (e, t) => {
    const {
      __scopeToast: n,
      type: r = "foreground",
      duration: o,
      open: i,
      onClose: s,
      onEscapeKeyDown: a,
      onPause: c,
      onResume: u,
      onSwipeStart: d,
      onSwipeMove: l,
      onSwipeCancel: f,
      onSwipeEnd: g,
      ...v
    } = e, p = si(jr, n), [b, y] = m.useState(null), S = ze(t, (O) => y(O)), w = m.useRef(null), _ = m.useRef(null), C = o || p.duration, R = m.useRef(0), x = m.useRef(C), E = m.useRef(0), { onToastAdd: I, onToastRemove: M } = p, N = it(() => {
      var F;
      (b == null ? void 0 : b.contains(document.activeElement)) && ((F = p.viewport) == null || F.focus()), s();
    }), $ = m.useCallback(
      (O) => {
        !O || O === 1 / 0 || (window.clearTimeout(E.current), R.current = (/* @__PURE__ */ new Date()).getTime(), E.current = window.setTimeout(N, O));
      },
      [N]
    );
    m.useEffect(() => {
      const O = p.viewport;
      if (O) {
        const F = () => {
          $(x.current), u == null || u();
        }, A = () => {
          const D = (/* @__PURE__ */ new Date()).getTime() - R.current;
          x.current = x.current - D, window.clearTimeout(E.current), c == null || c();
        };
        return O.addEventListener($s, A), O.addEventListener(Ls, F), () => {
          O.removeEventListener($s, A), O.removeEventListener(Ls, F);
        };
      }
    }, [p.viewport, C, c, u, $]), m.useEffect(() => {
      i && !p.isClosePausedRef.current && $(C);
    }, [i, C, p.isClosePausedRef, $]), m.useEffect(() => (I(), () => M()), [I, M]);
    const T = m.useMemo(() => b ? gf(b) : null, [b]);
    return p.viewport ? /* @__PURE__ */ P(pe, { children: [
      T && /* @__PURE__ */ h(
        kb,
        {
          __scopeToast: n,
          role: "status",
          "aria-live": r === "foreground" ? "assertive" : "polite",
          children: T
        }
      ),
      /* @__PURE__ */ h(Ob, { scope: n, onClose: N, children: Rn.createPortal(
        /* @__PURE__ */ h(Ea.ItemSlot, { scope: n, children: /* @__PURE__ */ h(
          fb,
          {
            asChild: !0,
            onEscapeKeyDown: ce(a, () => {
              p.isFocusedToastEscapeKeyDownRef.current || N(), p.isFocusedToastEscapeKeyDownRef.current = !1;
            }),
            children: /* @__PURE__ */ h(
              Te.li,
              {
                tabIndex: 0,
                "data-state": i ? "open" : "closed",
                "data-swipe-direction": p.swipeDirection,
                ...v,
                ref: S,
                style: { userSelect: "none", touchAction: "none", ...e.style },
                onKeyDown: ce(e.onKeyDown, (O) => {
                  O.key === "Escape" && (a == null || a(O.nativeEvent), O.nativeEvent.defaultPrevented || (p.isFocusedToastEscapeKeyDownRef.current = !0, N()));
                }),
                onPointerDown: ce(e.onPointerDown, (O) => {
                  O.button === 0 && (w.current = { x: O.clientX, y: O.clientY });
                }),
                onPointerMove: ce(e.onPointerMove, (O) => {
                  if (!w.current) return;
                  const F = O.clientX - w.current.x, A = O.clientY - w.current.y, D = !!_.current, V = ["left", "right"].includes(p.swipeDirection), z = ["left", "up"].includes(p.swipeDirection) ? Math.min : Math.max, L = V ? z(0, F) : 0, j = V ? 0 : z(0, A), Z = O.pointerType === "touch" ? 10 : 2, K = { x: L, y: j }, G = { originalEvent: O, delta: K };
                  D ? (_.current = K, go(Tb, l, G, {
                    discrete: !1
                  })) : bl(K, p.swipeDirection, Z) ? (_.current = K, go(Ib, d, G, {
                    discrete: !1
                  }), O.target.setPointerCapture(O.pointerId)) : (Math.abs(F) > Z || Math.abs(A) > Z) && (w.current = null);
                }),
                onPointerUp: ce(e.onPointerUp, (O) => {
                  const F = _.current, A = O.target;
                  if (A.hasPointerCapture(O.pointerId) && A.releasePointerCapture(O.pointerId), _.current = null, w.current = null, F) {
                    const D = O.currentTarget, V = { originalEvent: O, delta: F };
                    bl(F, p.swipeDirection, p.swipeThreshold) ? go(Ab, g, V, {
                      discrete: !0
                    }) : go(
                      Nb,
                      f,
                      V,
                      {
                        discrete: !0
                      }
                    ), D.addEventListener("click", (z) => z.preventDefault(), {
                      once: !0
                    });
                  }
                })
              }
            )
          }
        ) }),
        p.viewport
      ) })
    ] }) : null;
  }
), kb = (e) => {
  const { __scopeToast: t, children: n, ...r } = e, o = si(jr, t), [i, s] = m.useState(!1), [a, c] = m.useState(!1);
  return Fb(() => s(!0)), m.useEffect(() => {
    const u = window.setTimeout(() => c(!0), 1e3);
    return () => window.clearTimeout(u);
  }, []), a ? null : /* @__PURE__ */ h(In, { asChild: !0, children: /* @__PURE__ */ h(Ca, { ...r, children: i && /* @__PURE__ */ P(pe, { children: [
    o.label,
    " ",
    n
  ] }) }) });
}, Db = "ToastTitle", $b = m.forwardRef(
  (e, t) => {
    const { __scopeToast: n, ...r } = e;
    return /* @__PURE__ */ h(Te.div, { ...r, ref: t });
  }
);
$b.displayName = Db;
var Lb = "ToastDescription", uf = m.forwardRef(
  (e, t) => {
    const { __scopeToast: n, ...r } = e;
    return /* @__PURE__ */ h(Te.div, { ...r, ref: t });
  }
);
uf.displayName = Lb;
var df = "ToastAction", ff = m.forwardRef(
  (e, t) => {
    const { altText: n, ...r } = e;
    return n.trim() ? /* @__PURE__ */ h(mf, { altText: n, asChild: !0, children: /* @__PURE__ */ h(pf, { ...r, ref: t }) }) : (console.error(
      `Invalid prop \`altText\` supplied to \`${df}\`. Expected non-empty \`string\`.`
    ), null);
  }
);
ff.displayName = df;
var hf = "ToastClose", pf = m.forwardRef(
  (e, t) => {
    const { __scopeToast: n, ...r } = e, o = Pb(hf, n);
    return /* @__PURE__ */ h(mf, { asChild: !0, children: /* @__PURE__ */ h(
      Te.button,
      {
        type: "button",
        ...r,
        ref: t,
        onClick: ce(e.onClick, o.onClose)
      }
    ) });
  }
);
pf.displayName = hf;
var mf = m.forwardRef((e, t) => {
  const { __scopeToast: n, altText: r, ...o } = e;
  return /* @__PURE__ */ h(
    Te.div,
    {
      "data-radix-toast-announce-exclude": "",
      "data-radix-toast-announce-alt": r || void 0,
      ...o,
      ref: t
    }
  );
});
function gf(e) {
  const t = [];
  return Array.from(e.childNodes).forEach((r) => {
    if (r.nodeType === r.TEXT_NODE && r.textContent && t.push(r.textContent), Vb(r)) {
      const o = r.ariaHidden || r.hidden || r.style.display === "none", i = r.dataset.radixToastAnnounceExclude === "";
      if (!o)
        if (i) {
          const s = r.dataset.radixToastAnnounceAlt;
          s && t.push(s);
        } else
          t.push(...gf(r));
    }
  }), t;
}
function go(e, t, n, { discrete: r }) {
  const o = n.originalEvent.currentTarget, i = new CustomEvent(e, { bubbles: !0, cancelable: !0, detail: n });
  t && o.addEventListener(e, t, { once: !0 }), r ? _a(o, i) : o.dispatchEvent(i);
}
var bl = (e, t, n = 0) => {
  const r = Math.abs(e.x), o = Math.abs(e.y), i = r > o;
  return t === "left" || t === "right" ? i && r > n : !i && o > n;
};
function Fb(e = () => {
}) {
  const t = it(e);
  Ut(() => {
    let n = 0, r = 0;
    return n = window.requestAnimationFrame(() => r = window.requestAnimationFrame(t)), () => {
      window.cancelAnimationFrame(n), window.cancelAnimationFrame(r);
    };
  }, [t]);
}
function Vb(e) {
  return e.nodeType === e.ELEMENT_NODE;
}
function Bb(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (r) => {
      const o = r.tagName === "INPUT" && r.type === "hidden";
      return r.disabled || r.hidden || o ? NodeFilter.FILTER_SKIP : r.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  for (; n.nextNode(); ) t.push(n.currentNode);
  return t;
}
function Hi(e) {
  const t = document.activeElement;
  return e.some((n) => n === t ? !0 : (n.focus(), document.activeElement !== t));
}
var zb = of, jb = af, Ub = lf, Hb = uf, Sl = ff;
function Wb(e) {
  if (typeof document > "u") return;
  let t = document.head || document.getElementsByTagName("head")[0], n = document.createElement("style");
  n.type = "text/css", t.appendChild(n), n.styleSheet ? n.styleSheet.cssText = e : n.appendChild(document.createTextNode(e));
}
const Kb = (e) => {
  switch (e) {
    case "success":
      return Yb;
    case "info":
      return Zb;
    case "warning":
      return Xb;
    case "error":
      return Jb;
    default:
      return null;
  }
}, qb = Array(12).fill(0), Gb = ({ visible: e, className: t }) => /* @__PURE__ */ k.createElement("div", {
  className: [
    "sonner-loading-wrapper",
    t
  ].filter(Boolean).join(" "),
  "data-visible": e
}, /* @__PURE__ */ k.createElement("div", {
  className: "sonner-spinner"
}, qb.map((n, r) => /* @__PURE__ */ k.createElement("div", {
  className: "sonner-loading-bar",
  key: `spinner-bar-${r}`
})))), Yb = /* @__PURE__ */ k.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20"
}, /* @__PURE__ */ k.createElement("path", {
  fillRule: "evenodd",
  d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",
  clipRule: "evenodd"
})), Xb = /* @__PURE__ */ k.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "currentColor",
  height: "20",
  width: "20"
}, /* @__PURE__ */ k.createElement("path", {
  fillRule: "evenodd",
  d: "M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z",
  clipRule: "evenodd"
})), Zb = /* @__PURE__ */ k.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20"
}, /* @__PURE__ */ k.createElement("path", {
  fillRule: "evenodd",
  d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z",
  clipRule: "evenodd"
})), Jb = /* @__PURE__ */ k.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20"
}, /* @__PURE__ */ k.createElement("path", {
  fillRule: "evenodd",
  d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z",
  clipRule: "evenodd"
})), Qb = /* @__PURE__ */ k.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: "12",
  height: "12",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /* @__PURE__ */ k.createElement("line", {
  x1: "18",
  y1: "6",
  x2: "6",
  y2: "18"
}), /* @__PURE__ */ k.createElement("line", {
  x1: "6",
  y1: "6",
  x2: "18",
  y2: "18"
})), eS = () => {
  const [e, t] = k.useState(document.hidden);
  return k.useEffect(() => {
    const n = () => {
      t(document.hidden);
    };
    return document.addEventListener("visibilitychange", n), () => window.removeEventListener("visibilitychange", n);
  }, []), e;
};
let Vs = 1;
class tS {
  constructor() {
    this.subscribe = (t) => (this.subscribers.push(t), () => {
      const n = this.subscribers.indexOf(t);
      this.subscribers.splice(n, 1);
    }), this.publish = (t) => {
      this.subscribers.forEach((n) => n(t));
    }, this.addToast = (t) => {
      this.publish(t), this.toasts = [
        ...this.toasts,
        t
      ];
    }, this.create = (t) => {
      var n;
      const { message: r, ...o } = t, i = typeof (t == null ? void 0 : t.id) == "number" || ((n = t.id) == null ? void 0 : n.length) > 0 ? t.id : Vs++, s = this.toasts.find((c) => c.id === i), a = t.dismissible === void 0 ? !0 : t.dismissible;
      return this.dismissedToasts.has(i) && this.dismissedToasts.delete(i), s ? this.toasts = this.toasts.map((c) => c.id === i ? (this.publish({
        ...c,
        ...t,
        id: i,
        title: r
      }), {
        ...c,
        ...t,
        id: i,
        dismissible: a,
        title: r
      }) : c) : this.addToast({
        title: r,
        ...o,
        dismissible: a,
        id: i
      }), i;
    }, this.dismiss = (t) => (t ? (this.dismissedToasts.add(t), requestAnimationFrame(() => this.subscribers.forEach((n) => n({
      id: t,
      dismiss: !0
    })))) : this.toasts.forEach((n) => {
      this.subscribers.forEach((r) => r({
        id: n.id,
        dismiss: !0
      }));
    }), t), this.message = (t, n) => this.create({
      ...n,
      message: t
    }), this.error = (t, n) => this.create({
      ...n,
      message: t,
      type: "error"
    }), this.success = (t, n) => this.create({
      ...n,
      type: "success",
      message: t
    }), this.info = (t, n) => this.create({
      ...n,
      type: "info",
      message: t
    }), this.warning = (t, n) => this.create({
      ...n,
      type: "warning",
      message: t
    }), this.loading = (t, n) => this.create({
      ...n,
      type: "loading",
      message: t
    }), this.promise = (t, n) => {
      if (!n)
        return;
      let r;
      n.loading !== void 0 && (r = this.create({
        ...n,
        promise: t,
        type: "loading",
        message: n.loading,
        description: typeof n.description != "function" ? n.description : void 0
      }));
      const o = Promise.resolve(t instanceof Function ? t() : t);
      let i = r !== void 0, s;
      const a = o.then(async (u) => {
        if (s = [
          "resolve",
          u
        ], k.isValidElement(u))
          i = !1, this.create({
            id: r,
            type: "default",
            message: u
          });
        else if (rS(u) && !u.ok) {
          i = !1;
          const l = typeof n.error == "function" ? await n.error(`HTTP error! status: ${u.status}`) : n.error, f = typeof n.description == "function" ? await n.description(`HTTP error! status: ${u.status}`) : n.description, v = typeof l == "object" && !k.isValidElement(l) ? l : {
            message: l
          };
          this.create({
            id: r,
            type: "error",
            description: f,
            ...v
          });
        } else if (u instanceof Error) {
          i = !1;
          const l = typeof n.error == "function" ? await n.error(u) : n.error, f = typeof n.description == "function" ? await n.description(u) : n.description, v = typeof l == "object" && !k.isValidElement(l) ? l : {
            message: l
          };
          this.create({
            id: r,
            type: "error",
            description: f,
            ...v
          });
        } else if (n.success !== void 0) {
          i = !1;
          const l = typeof n.success == "function" ? await n.success(u) : n.success, f = typeof n.description == "function" ? await n.description(u) : n.description, v = typeof l == "object" && !k.isValidElement(l) ? l : {
            message: l
          };
          this.create({
            id: r,
            type: "success",
            description: f,
            ...v
          });
        }
      }).catch(async (u) => {
        if (s = [
          "reject",
          u
        ], n.error !== void 0) {
          i = !1;
          const d = typeof n.error == "function" ? await n.error(u) : n.error, l = typeof n.description == "function" ? await n.description(u) : n.description, g = typeof d == "object" && !k.isValidElement(d) ? d : {
            message: d
          };
          this.create({
            id: r,
            type: "error",
            description: l,
            ...g
          });
        }
      }).finally(() => {
        i && (this.dismiss(r), r = void 0), n.finally == null || n.finally.call(n);
      }), c = () => new Promise((u, d) => a.then(() => s[0] === "reject" ? d(s[1]) : u(s[1])).catch(d));
      return typeof r != "string" && typeof r != "number" ? {
        unwrap: c
      } : Object.assign(r, {
        unwrap: c
      });
    }, this.custom = (t, n) => {
      const r = (n == null ? void 0 : n.id) || Vs++;
      return this.create({
        jsx: t(r),
        id: r,
        ...n
      }), r;
    }, this.getActiveToasts = () => this.toasts.filter((t) => !this.dismissedToasts.has(t.id)), this.subscribers = [], this.toasts = [], this.dismissedToasts = /* @__PURE__ */ new Set();
  }
}
const ot = new tS(), nS = (e, t) => {
  const n = (t == null ? void 0 : t.id) || Vs++;
  return ot.addToast({
    title: e,
    ...t,
    id: n
  }), n;
}, rS = (e) => e && typeof e == "object" && "ok" in e && typeof e.ok == "boolean" && "status" in e && typeof e.status == "number", oS = nS, iS = () => ot.toasts, sS = () => ot.getActiveToasts(), Ve = Object.assign(oS, {
  success: ot.success,
  info: ot.info,
  warning: ot.warning,
  error: ot.error,
  custom: ot.custom,
  message: ot.message,
  promise: ot.promise,
  dismiss: ot.dismiss,
  loading: ot.loading
}, {
  getHistory: iS,
  getToasts: sS
});
Wb("[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);background:var(--normal-bg);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}");
function vo(e) {
  return e.label !== void 0;
}
const aS = 3, cS = "24px", lS = "16px", wl = 4e3, uS = 356, dS = 14, fS = 45, hS = 200;
function Tt(...e) {
  return e.filter(Boolean).join(" ");
}
function pS(e) {
  const [t, n] = e.split("-"), r = [];
  return t && r.push(t), n && r.push(n), r;
}
const mS = (e) => {
  var t, n, r, o, i, s, a, c, u;
  const { invert: d, toast: l, unstyled: f, interacting: g, setHeights: v, visibleToasts: p, heights: b, index: y, toasts: S, expanded: w, removeToast: _, defaultRichColors: C, closeButton: R, style: x, cancelButtonStyle: E, actionButtonStyle: I, className: M = "", descriptionClassName: N = "", duration: $, position: T, gap: O, expandByDefault: F, classNames: A, icons: D, closeButtonAriaLabel: V = "Close toast" } = e, [z, L] = k.useState(null), [j, Z] = k.useState(null), [K, G] = k.useState(!1), [J, te] = k.useState(!1), [U, H] = k.useState(!1), [Q, ee] = k.useState(!1), [ie, W] = k.useState(!1), [ge, re] = k.useState(0), [Y, ye] = k.useState(0), De = k.useRef(l.duration || $ || wl), at = k.useRef(null), Oe = k.useRef(null), ht = y === 0, On = y + 1 <= p, Qe = l.type, pt = l.dismissible !== !1, Mi = l.className || "", ao = l.descriptionClassName || "", Pn = k.useMemo(() => b.findIndex((ae) => ae.toastId === l.id) || 0, [
    b,
    l.id
  ]), ki = k.useMemo(() => {
    var ae;
    return (ae = l.closeButton) != null ? ae : R;
  }, [
    l.closeButton,
    R
  ]), dn = k.useMemo(() => l.duration || $ || wl, [
    l.duration,
    $
  ]), br = k.useRef(0), Lt = k.useRef(0), co = k.useRef(0), mt = k.useRef(null), [lo, Di] = T.split("-"), uo = k.useMemo(() => b.reduce((ae, be, Me) => Me >= Pn ? ae : ae + be.height, 0), [
    b,
    Pn
  ]), fo = eS(), $i = l.invert || d, Sr = Qe === "loading";
  Lt.current = k.useMemo(() => Pn * O + uo, [
    Pn,
    uo
  ]), k.useEffect(() => {
    De.current = dn;
  }, [
    dn
  ]), k.useEffect(() => {
    G(!0);
  }, []), k.useEffect(() => {
    const ae = Oe.current;
    if (ae) {
      const be = ae.getBoundingClientRect().height;
      return ye(be), v((Me) => [
        {
          toastId: l.id,
          height: be,
          position: l.position
        },
        ...Me
      ]), () => v((Me) => Me.filter((ke) => ke.toastId !== l.id));
    }
  }, [
    v,
    l.id
  ]), k.useLayoutEffect(() => {
    if (!K) return;
    const ae = Oe.current, be = ae.style.height;
    ae.style.height = "auto";
    const Me = ae.getBoundingClientRect().height;
    ae.style.height = be, ye(Me), v((ke) => ke.find((Pe) => Pe.toastId === l.id) ? ke.map((Pe) => Pe.toastId === l.id ? {
      ...Pe,
      height: Me
    } : Pe) : [
      {
        toastId: l.id,
        height: Me,
        position: l.position
      },
      ...ke
    ]);
  }, [
    K,
    l.title,
    l.description,
    v,
    l.id,
    l.jsx,
    l.action,
    l.cancel
  ]);
  const se = k.useCallback(() => {
    te(!0), re(Lt.current), v((ae) => ae.filter((be) => be.toastId !== l.id)), setTimeout(() => {
      _(l);
    }, hS);
  }, [
    l,
    _,
    v,
    Lt
  ]);
  k.useEffect(() => {
    if (l.promise && Qe === "loading" || l.duration === 1 / 0 || l.type === "loading") return;
    let ae;
    return w || g || fo ? (() => {
      if (co.current < br.current) {
        const ke = (/* @__PURE__ */ new Date()).getTime() - br.current;
        De.current = De.current - ke;
      }
      co.current = (/* @__PURE__ */ new Date()).getTime();
    })() : (() => {
      De.current !== 1 / 0 && (br.current = (/* @__PURE__ */ new Date()).getTime(), ae = setTimeout(() => {
        l.onAutoClose == null || l.onAutoClose.call(l, l), se();
      }, De.current));
    })(), () => clearTimeout(ae);
  }, [
    w,
    g,
    l,
    Qe,
    fo,
    se
  ]), k.useEffect(() => {
    l.delete && (se(), l.onDismiss == null || l.onDismiss.call(l, l));
  }, [
    se,
    l.delete
  ]);
  function Ce() {
    var ae;
    if (D != null && D.loading) {
      var be;
      return /* @__PURE__ */ k.createElement("div", {
        className: Tt(A == null ? void 0 : A.loader, l == null || (be = l.classNames) == null ? void 0 : be.loader, "sonner-loader"),
        "data-visible": Qe === "loading"
      }, D.loading);
    }
    return /* @__PURE__ */ k.createElement(Gb, {
      className: Tt(A == null ? void 0 : A.loader, l == null || (ae = l.classNames) == null ? void 0 : ae.loader),
      visible: Qe === "loading"
    });
  }
  const Ne = l.icon || (D == null ? void 0 : D[Qe]) || Kb(Qe);
  var ve, $e;
  return /* @__PURE__ */ k.createElement("li", {
    tabIndex: 0,
    ref: Oe,
    className: Tt(M, Mi, A == null ? void 0 : A.toast, l == null || (t = l.classNames) == null ? void 0 : t.toast, A == null ? void 0 : A.default, A == null ? void 0 : A[Qe], l == null || (n = l.classNames) == null ? void 0 : n[Qe]),
    "data-sonner-toast": "",
    "data-rich-colors": (ve = l.richColors) != null ? ve : C,
    "data-styled": !(l.jsx || l.unstyled || f),
    "data-mounted": K,
    "data-promise": !!l.promise,
    "data-swiped": ie,
    "data-removed": J,
    "data-visible": On,
    "data-y-position": lo,
    "data-x-position": Di,
    "data-index": y,
    "data-front": ht,
    "data-swiping": U,
    "data-dismissible": pt,
    "data-type": Qe,
    "data-invert": $i,
    "data-swipe-out": Q,
    "data-swipe-direction": j,
    "data-expanded": !!(w || F && K),
    "data-testid": l.testId,
    style: {
      "--index": y,
      "--toasts-before": y,
      "--z-index": S.length - y,
      "--offset": `${J ? ge : Lt.current}px`,
      "--initial-height": F ? "auto" : `${Y}px`,
      ...x,
      ...l.style
    },
    onDragEnd: () => {
      H(!1), L(null), mt.current = null;
    },
    onPointerDown: (ae) => {
      ae.button !== 2 && (Sr || !pt || (at.current = /* @__PURE__ */ new Date(), re(Lt.current), ae.target.setPointerCapture(ae.pointerId), ae.target.tagName !== "BUTTON" && (H(!0), mt.current = {
        x: ae.clientX,
        y: ae.clientY
      })));
    },
    onPointerUp: () => {
      var ae, be, Me;
      if (Q || !pt) return;
      mt.current = null;
      const ke = Number(((ae = Oe.current) == null ? void 0 : ae.style.getPropertyValue("--swipe-amount-x").replace("px", "")) || 0), gt = Number(((be = Oe.current) == null ? void 0 : be.style.getPropertyValue("--swipe-amount-y").replace("px", "")) || 0), Pe = (/* @__PURE__ */ new Date()).getTime() - ((Me = at.current) == null ? void 0 : Me.getTime()), Le = z === "x" ? ke : gt, Ft = Math.abs(Le) / Pe;
      if (Math.abs(Le) >= fS || Ft > 0.11) {
        re(Lt.current), l.onDismiss == null || l.onDismiss.call(l, l), Z(z === "x" ? ke > 0 ? "right" : "left" : gt > 0 ? "down" : "up"), se(), ee(!0);
        return;
      } else {
        var rt, wt;
        (rt = Oe.current) == null || rt.style.setProperty("--swipe-amount-x", "0px"), (wt = Oe.current) == null || wt.style.setProperty("--swipe-amount-y", "0px");
      }
      W(!1), H(!1), L(null);
    },
    onPointerMove: (ae) => {
      var be, Me, ke;
      if (!mt.current || !pt || ((be = window.getSelection()) == null ? void 0 : be.toString().length) > 0) return;
      const Pe = ae.clientY - mt.current.y, Le = ae.clientX - mt.current.x;
      var Ft;
      const rt = (Ft = e.swipeDirections) != null ? Ft : pS(T);
      !z && (Math.abs(Le) > 1 || Math.abs(Pe) > 1) && L(Math.abs(Le) > Math.abs(Pe) ? "x" : "y");
      let wt = {
        x: 0,
        y: 0
      };
      const Yc = (fn) => 1 / (1.5 + Math.abs(fn) / 20);
      if (z === "y") {
        if (rt.includes("top") || rt.includes("bottom"))
          if (rt.includes("top") && Pe < 0 || rt.includes("bottom") && Pe > 0)
            wt.y = Pe;
          else {
            const fn = Pe * Yc(Pe);
            wt.y = Math.abs(fn) < Math.abs(Pe) ? fn : Pe;
          }
      } else if (z === "x" && (rt.includes("left") || rt.includes("right")))
        if (rt.includes("left") && Le < 0 || rt.includes("right") && Le > 0)
          wt.x = Le;
        else {
          const fn = Le * Yc(Le);
          wt.x = Math.abs(fn) < Math.abs(Le) ? fn : Le;
        }
      (Math.abs(wt.x) > 0 || Math.abs(wt.y) > 0) && W(!0), (Me = Oe.current) == null || Me.style.setProperty("--swipe-amount-x", `${wt.x}px`), (ke = Oe.current) == null || ke.style.setProperty("--swipe-amount-y", `${wt.y}px`);
    }
  }, ki && !l.jsx && Qe !== "loading" ? /* @__PURE__ */ k.createElement("button", {
    "aria-label": V,
    "data-disabled": Sr,
    "data-close-button": !0,
    onClick: Sr || !pt ? () => {
    } : () => {
      se(), l.onDismiss == null || l.onDismiss.call(l, l);
    },
    className: Tt(A == null ? void 0 : A.closeButton, l == null || (r = l.classNames) == null ? void 0 : r.closeButton)
  }, ($e = D == null ? void 0 : D.close) != null ? $e : Qb) : null, (Qe || l.icon || l.promise) && l.icon !== null && ((D == null ? void 0 : D[Qe]) !== null || l.icon) ? /* @__PURE__ */ k.createElement("div", {
    "data-icon": "",
    className: Tt(A == null ? void 0 : A.icon, l == null || (o = l.classNames) == null ? void 0 : o.icon)
  }, l.promise || l.type === "loading" && !l.icon ? l.icon || Ce() : null, l.type !== "loading" ? Ne : null) : null, /* @__PURE__ */ k.createElement("div", {
    "data-content": "",
    className: Tt(A == null ? void 0 : A.content, l == null || (i = l.classNames) == null ? void 0 : i.content)
  }, /* @__PURE__ */ k.createElement("div", {
    "data-title": "",
    className: Tt(A == null ? void 0 : A.title, l == null || (s = l.classNames) == null ? void 0 : s.title)
  }, l.jsx ? l.jsx : typeof l.title == "function" ? l.title() : l.title), l.description ? /* @__PURE__ */ k.createElement("div", {
    "data-description": "",
    className: Tt(N, ao, A == null ? void 0 : A.description, l == null || (a = l.classNames) == null ? void 0 : a.description)
  }, typeof l.description == "function" ? l.description() : l.description) : null), /* @__PURE__ */ k.isValidElement(l.cancel) ? l.cancel : l.cancel && vo(l.cancel) ? /* @__PURE__ */ k.createElement("button", {
    "data-button": !0,
    "data-cancel": !0,
    style: l.cancelButtonStyle || E,
    onClick: (ae) => {
      vo(l.cancel) && pt && (l.cancel.onClick == null || l.cancel.onClick.call(l.cancel, ae), se());
    },
    className: Tt(A == null ? void 0 : A.cancelButton, l == null || (c = l.classNames) == null ? void 0 : c.cancelButton)
  }, l.cancel.label) : null, /* @__PURE__ */ k.isValidElement(l.action) ? l.action : l.action && vo(l.action) ? /* @__PURE__ */ k.createElement("button", {
    "data-button": !0,
    "data-action": !0,
    style: l.actionButtonStyle || I,
    onClick: (ae) => {
      vo(l.action) && (l.action.onClick == null || l.action.onClick.call(l.action, ae), !ae.defaultPrevented && se());
    },
    className: Tt(A == null ? void 0 : A.actionButton, l == null || (u = l.classNames) == null ? void 0 : u.actionButton)
  }, l.action.label) : null);
};
function _l() {
  if (typeof window > "u" || typeof document > "u") return "ltr";
  const e = document.documentElement.getAttribute("dir");
  return e === "auto" || !e ? window.getComputedStyle(document.documentElement).direction : e;
}
function gS(e, t) {
  const n = {};
  return [
    e,
    t
  ].forEach((r, o) => {
    const i = o === 1, s = i ? "--mobile-offset" : "--offset", a = i ? lS : cS;
    function c(u) {
      [
        "top",
        "right",
        "bottom",
        "left"
      ].forEach((d) => {
        n[`${s}-${d}`] = typeof u == "number" ? `${u}px` : u;
      });
    }
    typeof r == "number" || typeof r == "string" ? c(r) : typeof r == "object" ? [
      "top",
      "right",
      "bottom",
      "left"
    ].forEach((u) => {
      r[u] === void 0 ? n[`${s}-${u}`] = a : n[`${s}-${u}`] = typeof r[u] == "number" ? `${r[u]}px` : r[u];
    }) : c(a);
  }), n;
}
const vS = /* @__PURE__ */ k.forwardRef(function(t, n) {
  const { id: r, invert: o, position: i = "bottom-right", hotkey: s = [
    "altKey",
    "KeyT"
  ], expand: a, closeButton: c, className: u, offset: d, mobileOffset: l, theme: f = "light", richColors: g, duration: v, style: p, visibleToasts: b = aS, toastOptions: y, dir: S = _l(), gap: w = dS, icons: _, containerAriaLabel: C = "Notifications" } = t, [R, x] = k.useState([]), E = k.useMemo(() => r ? R.filter((K) => K.toasterId === r) : R.filter((K) => !K.toasterId), [
    R,
    r
  ]), I = k.useMemo(() => Array.from(new Set([
    i
  ].concat(E.filter((K) => K.position).map((K) => K.position)))), [
    E,
    i
  ]), [M, N] = k.useState([]), [$, T] = k.useState(!1), [O, F] = k.useState(!1), [A, D] = k.useState(f !== "system" ? f : typeof window < "u" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"), V = k.useRef(null), z = s.join("+").replace(/Key/g, "").replace(/Digit/g, ""), L = k.useRef(null), j = k.useRef(!1), Z = k.useCallback((K) => {
    x((G) => {
      var J;
      return (J = G.find((te) => te.id === K.id)) != null && J.delete || ot.dismiss(K.id), G.filter(({ id: te }) => te !== K.id);
    });
  }, []);
  return k.useEffect(() => ot.subscribe((K) => {
    if (K.dismiss) {
      requestAnimationFrame(() => {
        x((G) => G.map((J) => J.id === K.id ? {
          ...J,
          delete: !0
        } : J));
      });
      return;
    }
    setTimeout(() => {
      Br.flushSync(() => {
        x((G) => {
          const J = G.findIndex((te) => te.id === K.id);
          return J !== -1 ? [
            ...G.slice(0, J),
            {
              ...G[J],
              ...K
            },
            ...G.slice(J + 1)
          ] : [
            K,
            ...G
          ];
        });
      });
    });
  }), [
    R
  ]), k.useEffect(() => {
    if (f !== "system") {
      D(f);
      return;
    }
    if (f === "system" && (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? D("dark") : D("light")), typeof window > "u") return;
    const K = window.matchMedia("(prefers-color-scheme: dark)");
    try {
      K.addEventListener("change", ({ matches: G }) => {
        D(G ? "dark" : "light");
      });
    } catch {
      K.addListener(({ matches: J }) => {
        try {
          D(J ? "dark" : "light");
        } catch (te) {
          console.error(te);
        }
      });
    }
  }, [
    f
  ]), k.useEffect(() => {
    R.length <= 1 && T(!1);
  }, [
    R
  ]), k.useEffect(() => {
    const K = (G) => {
      var J;
      if (s.every((H) => G[H] || G.code === H)) {
        var U;
        T(!0), (U = V.current) == null || U.focus();
      }
      G.code === "Escape" && (document.activeElement === V.current || (J = V.current) != null && J.contains(document.activeElement)) && T(!1);
    };
    return document.addEventListener("keydown", K), () => document.removeEventListener("keydown", K);
  }, [
    s
  ]), k.useEffect(() => {
    if (V.current)
      return () => {
        L.current && (L.current.focus({
          preventScroll: !0
        }), L.current = null, j.current = !1);
      };
  }, [
    V.current
  ]), // Remove item from normal navigation flow, only available via hotkey
  /* @__PURE__ */ k.createElement("section", {
    ref: n,
    "aria-label": `${C} ${z}`,
    tabIndex: -1,
    "aria-live": "polite",
    "aria-relevant": "additions text",
    "aria-atomic": "false",
    suppressHydrationWarning: !0
  }, I.map((K, G) => {
    var J;
    const [te, U] = K.split("-");
    return E.length ? /* @__PURE__ */ k.createElement("ol", {
      key: K,
      dir: S === "auto" ? _l() : S,
      tabIndex: -1,
      ref: V,
      className: u,
      "data-sonner-toaster": !0,
      "data-sonner-theme": A,
      "data-y-position": te,
      "data-x-position": U,
      style: {
        "--front-toast-height": `${((J = M[0]) == null ? void 0 : J.height) || 0}px`,
        "--width": `${uS}px`,
        "--gap": `${w}px`,
        ...p,
        ...gS(d, l)
      },
      onBlur: (H) => {
        j.current && !H.currentTarget.contains(H.relatedTarget) && (j.current = !1, L.current && (L.current.focus({
          preventScroll: !0
        }), L.current = null));
      },
      onFocus: (H) => {
        H.target instanceof HTMLElement && H.target.dataset.dismissible === "false" || j.current || (j.current = !0, L.current = H.relatedTarget);
      },
      onMouseEnter: () => T(!0),
      onMouseMove: () => T(!0),
      onMouseLeave: () => {
        O || T(!1);
      },
      onDragEnd: () => T(!1),
      onPointerDown: (H) => {
        H.target instanceof HTMLElement && H.target.dataset.dismissible === "false" || F(!0);
      },
      onPointerUp: () => F(!1)
    }, E.filter((H) => !H.position && G === 0 || H.position === K).map((H, Q) => {
      var ee, ie;
      return /* @__PURE__ */ k.createElement(mS, {
        key: H.id,
        icons: _,
        index: Q,
        toast: H,
        defaultRichColors: g,
        duration: (ee = y == null ? void 0 : y.duration) != null ? ee : v,
        className: y == null ? void 0 : y.className,
        descriptionClassName: y == null ? void 0 : y.descriptionClassName,
        invert: o,
        visibleToasts: b,
        closeButton: (ie = y == null ? void 0 : y.closeButton) != null ? ie : c,
        interacting: O,
        position: K,
        style: y == null ? void 0 : y.style,
        unstyled: y == null ? void 0 : y.unstyled,
        classNames: y == null ? void 0 : y.classNames,
        cancelButtonStyle: y == null ? void 0 : y.cancelButtonStyle,
        actionButtonStyle: y == null ? void 0 : y.actionButtonStyle,
        closeButtonAriaLabel: y == null ? void 0 : y.closeButtonAriaLabel,
        removeToast: Z,
        toasts: E.filter((W) => W.position == H.position),
        heights: M.filter((W) => W.position == H.position),
        setHeights: N,
        expandByDefault: a,
        gap: w,
        expanded: $,
        swipeDirections: t.swipeDirections
      });
    })) : null;
  }));
}), Ra = [
  { id: "", name: "None", url: "" },
  { id: "blur", name: "Blur", url: "blur" }
], Bs = {
  isVideoOn: !1,
  vbImageId: "",
  virtualBackgroundImageList: Ra,
  isVirtualBackgroundReady: !1,
  isMirrored: !0,
  hardwareAccelerationReceiving: !1,
  hardwareAccelerationSending: !1,
  isLoading: !1,
  warning: null
}, yS = (e) => ({
  videoState: Bs,
  setVideoState: (t) => e((n) => ({ videoState: { ...n.videoState, ...t } })),
  resetVideoState: () => e(() => ({ videoState: Bs }))
}), Lo = {
  audio: {
    noiseSuppression: !1,
    disableUnmuteConsentDialog: !1
  },
  video: {
    virtualBackground: {
      virtualBackgroundImageList: Ra,
      defaultVirtualBackgroundImageId: ""
    }
  },
  recording: {
    disableRecordingConsentDialog: !1
  },
  session: {
    disableReclaimHostBanner: !1
  }
};
function bS(e) {
  var s;
  const { virtualBackgroundImageList: t = [], defaultVirtualBackgroundImageId: n = "" } = ((s = e == null ? void 0 : e.video) == null ? void 0 : s.virtualBackground) ?? {}, r = t.filter((a) => !a.name || !a.url ? (console.warn(
    `[Zoom UI Toolkit] Virtual background image (id: "${a.id}") was dropped because its name or url is empty.`
  ), !1) : !0), o = /* @__PURE__ */ new Set(), i = [...Ra, ...r].filter((a) => o.has(a.id) ? (console.warn(
    `[Zoom UI Toolkit] Virtual background image "${a.name}" (id: "${a.id}") was dropped because the id is reserved or already in use.`
  ), !1) : (o.add(a.id), !0));
  return {
    audio: {
      ...Lo.audio,
      ...e == null ? void 0 : e.audio
    },
    video: {
      virtualBackground: {
        virtualBackgroundImageList: i,
        defaultVirtualBackgroundImageId: o.has(n) ? n : ""
      }
    },
    recording: {
      ...Lo.recording,
      ...e == null ? void 0 : e.recording
    },
    session: {
      ...Lo.session,
      ...e == null ? void 0 : e.session
    }
  };
}
const vf = or({
  client: null,
  sessionOptions: Lo
});
function _e() {
  return xn(vf);
}
var SS = "_180z7y90";
const wS = "zoom-uitoolkit-active-media-failure", _S = 1 / 0, CS = {
  refresh: "media.active_error.refresh",
  ok: "common.ok",
  resumeAudio: "media.active_error.resume_audio",
  resumeVideo: "media.active_error.resume_video"
}, xS = {
  [et.AudioConnectionFailed]: {
    titleKey: "media.active_error.title_microphone_connection",
    descriptionKey: "media.active_error.code_101",
    action: "refresh"
  },
  [et.AudioStreamEnded]: {
    titleKey: "media.active_error.title_microphone_connection",
    descriptionKey: "media.active_error.code_102",
    action: "refresh"
  },
  [et.MicrophonePermissionReset]: {
    titleKey: "media.active_error.title_microphone_permission",
    descriptionKey: "media.active_error.code_103",
    action: "ok"
  },
  [et.AudioStreamFailed]: {
    titleKey: "media.active_error.title_microphone_connection",
    descriptionKey: "media.active_error.code_104",
    action: "ok"
  },
  [et.MicrophoneMuted]: {
    titleKey: "media.active_error.title_microphone_muted",
    descriptionKey: "media.active_error.code_105",
    action: "ok"
  },
  [et.AudioStreamMuted]: {
    titleKey: "media.active_error.title_microphone_interrupted",
    descriptionKey: "media.active_error.code_106",
    action: "resumeAudio"
  },
  [et.AudioPlaybackInterrupted]: {
    titleKey: "media.active_error.title_audio_playback_interrupted",
    descriptionKey: "media.active_error.code_107",
    action: "resumeAudio"
  },
  [et.VideoConnectionFailed]: {
    titleKey: "media.active_error.title_camera_connection",
    descriptionKey: "media.active_error.code_201",
    action: "refresh"
  },
  [et.VideoStreamEnded]: {
    titleKey: "media.active_error.title_camera_connection",
    descriptionKey: "media.active_error.code_202",
    action: "refresh"
  },
  [et.CameraPermissionReset]: {
    titleKey: "media.active_error.title_camera_permission",
    descriptionKey: "media.active_error.code_203",
    action: "ok"
  },
  [et.WebGlContextInvalid]: {
    titleKey: "media.active_error.title_video_rendering",
    descriptionKey: "media.active_error.code_204",
    action: "ok"
  },
  [et.WasmOutOfMemory]: {
    titleKey: "media.active_error.title_camera_connection",
    descriptionKey: "media.active_error.code_205",
    action: "ok"
  },
  [et.VideoStreamFailed]: {
    titleKey: "media.active_error.title_camera_connection",
    descriptionKey: "media.active_error.code_206",
    action: "ok"
  },
  [et.VideoStreamMuted]: {
    titleKey: "media.active_error.title_camera_interrupted",
    descriptionKey: "media.active_error.code_207",
    action: "resumeVideo"
  },
  [et.SharingStreamFailed]: {
    titleKey: "media.active_error.title_screen_share_connection",
    descriptionKey: "media.active_error.code_301",
    action: "ok"
  }
}, ES = {
  titleKey: "media.active_error.title",
  descriptionKey: "media.active_error.generic",
  action: "refresh"
};
function RS({ client: e }) {
  oe(() => {
    if (!e)
      return;
    let t = 0;
    const n = /* @__PURE__ */ new Set(), r = (o) => {
      const i = `${wS}-${t}`;
      t += 1, n.add(i);
      const { titleKey: s, descriptionKey: a, action: c } = xS[o.code] ?? ES, u = () => {
        Ve.dismiss(i), n.delete(i);
      };
      Ve.error(qe.t(s), {
        id: i,
        duration: _S,
        position: "top-center",
        description: qe.t(a),
        descriptionClassName: SS,
        action: {
          label: qe.t(CS[c]),
          onClick: c === "refresh" ? () => window.location.reload() : u
        },
        cancel: c === "refresh" ? { label: qe.t("common.cancel"), onClick: u } : void 0
      });
    };
    return e.on("active-media-failed", r), () => {
      e.off("active-media-failed", r), n.forEach((o) => Ve.dismiss(o)), n.clear();
    };
  }, [e]);
}
function Re(e) {
  var t;
  try {
    return ((t = e == null ? void 0 : e.getMediaStream) == null ? void 0 : t.call(e)) ?? null;
  } catch {
    return null;
  }
}
function yf(e) {
  var t;
  try {
    return ((t = e == null ? void 0 : e.getCurrentUserInfo) == null ? void 0 : t.call(e)) ?? null;
  } catch {
    return null;
  }
}
function Un(e) {
  var t;
  try {
    return ((t = e == null ? void 0 : e.getRecordingClient) == null ? void 0 : t.call(e)) ?? null;
  } catch {
    return null;
  }
}
function bf(e) {
  var t;
  try {
    return ((t = e == null ? void 0 : e.getChatClient) == null ? void 0 : t.call(e)) ?? null;
  } catch {
    return null;
  }
}
const Cl = (e) => {
  let t;
  const n = /* @__PURE__ */ new Set(), r = (u, d) => {
    const l = typeof u == "function" ? u(t) : u;
    if (!Object.is(l, t)) {
      const f = t;
      t = d ?? (typeof l != "object" || l === null) ? l : Object.assign({}, t, l), n.forEach((g) => g(t, f));
    }
  }, o = () => t, a = { setState: r, getState: o, getInitialState: () => c, subscribe: (u) => (n.add(u), () => n.delete(u)) }, c = t = e(r, o, a);
  return a;
}, IS = ((e) => e ? Cl(e) : Cl), TS = (e) => e;
function NS(e, t = TS) {
  const n = k.useSyncExternalStore(
    e.subscribe,
    k.useCallback(() => t(e.getState()), [e, t]),
    k.useCallback(() => t(e.getInitialState()), [e, t])
  );
  return k.useDebugValue(n), n;
}
const AS = (e) => {
  const t = IS(e), n = (r) => NS(t, r);
  return Object.assign(n, t), n;
}, OS = ((e) => AS), Sf = {
  topic: "",
  password: "",
  userName: "",
  userId: 0,
  isInMeeting: !1,
  sessionId: ""
}, xl = {
  connectionState: we.Closed,
  sessionInfo: Sf,
  isJoining: !1,
  isLeaving: !1,
  errorMessage: null,
  reason: null,
  isOriginalHost: !1
}, PS = (e) => ({
  sessionState: xl,
  setSessionState: (t) => e((n) => ({ sessionState: { ...n.sessionState, ...t } })),
  resetSessionState: () => e(() => ({ sessionState: xl }))
}), El = {
  isJoined: !1,
  isMuted: !0,
  isLoading: !1,
  noiseSuppression: !1,
  warning: null
}, MS = (e) => ({
  audioState: El,
  setAudioState: (t) => e((n) => ({ audioState: { ...n.audioState, ...t } })),
  resetAudioState: () => e(() => ({ audioState: El }))
}), Rl = {
  cameras: [],
  microphones: [],
  speakers: [],
  activeCameraId: null,
  activeMicrophoneId: null,
  activeSpeakerId: null,
  isSwitchingCamera: !1,
  isSwitchingMicrophone: !1,
  isSwitchingSpeaker: !1
}, kS = (e) => ({
  deviceState: Rl,
  setDeviceState: (t) => e((n) => ({ deviceState: { ...n.deviceState, ...t } })),
  resetDeviceState: () => e(() => ({ deviceState: Rl }))
}), Il = {
  isSharing: !1,
  isReceivingShare: !1,
  sharePrivilege: Ot.MultipleShare,
  isEnableOptimizeForSharedVideo: !1,
  annotation: {
    canDoAnnotation: !1,
    canRedo: !1,
    canUndo: !1,
    isAnnotationStarted: !1,
    isEnableViewerAnnotation: !0,
    isShowAnnotatorName: !1
  }
}, DS = (e) => ({
  shareState: Il,
  setShareState: (t) => e((n) => ({ shareState: { ...n.shareState, ...t } })),
  setAnnotationState: (t) => e((n) => ({ shareState: { ...n.shareState, annotation: { ...n.shareState.annotation, ...t } } })),
  resetShareState: () => e(() => ({ shareState: Il }))
}), Tl = {
  participants: [],
  currentUser: null,
  activeVideoUser: null,
  activeSpeakers: [],
  activeShareUsersList: [],
  activeShareUser: null
}, $S = (e) => ({
  participantState: Tl,
  setParticipantState: (t) => e((n) => ({ participantState: { ...n.participantState, ...t } })),
  resetParticipantState: () => e(() => ({ participantState: Tl }))
}), Nl = {
  messages: [],
  receivers: [],
  privilege: $o.All,
  isAvailable: !1,
  unreadCount: 0,
  unreadMessageIds: [],
  draftMessage: "",
  receiverId: "",
  pendingSendId: null
}, LS = (e) => ({
  chatState: Nl,
  setChatState: (t) => e((n) => ({
    chatState: {
      ...n.chatState,
      ...t,
      ...t.unreadCount === 0 ? { unreadMessageIds: [] } : {}
    }
  })),
  receiveChatMessage: (t) => e((n) => {
    var i;
    const r = (i = n.participantState.currentUser) == null ? void 0 : i.userId, o = !!t.message && t.sender.userId !== r;
    return {
      chatState: {
        ...n.chatState,
        messages: [...n.chatState.messages, t],
        unreadCount: n.chatState.unreadCount + (o ? 1 : 0),
        unreadMessageIds: o && t.id ? [...n.chatState.unreadMessageIds, t.id] : n.chatState.unreadMessageIds
      }
    };
  }),
  removeChatMessage: (t) => e((n) => {
    if (!t || !n.chatState.messages.some((i) => i.id === t)) return {};
    const r = n.chatState.unreadMessageIds.filter((i) => i !== t), o = n.chatState.unreadMessageIds.length - r.length;
    return {
      chatState: {
        ...n.chatState,
        messages: n.chatState.messages.filter((i) => i.id !== t),
        unreadCount: Math.max(0, n.chatState.unreadCount - o),
        unreadMessageIds: r
      }
    };
  }),
  markChatRead: () => e(
    (t) => t.chatState.unreadCount === 0 ? {} : { chatState: { ...t.chatState, unreadCount: 0, unreadMessageIds: [] } }
  ),
  resetChatState: () => e(() => ({ chatState: Nl }))
}), B = OS()((e) => ({
  ...PS(e),
  ...MS(e),
  ...yS(e),
  ...kS(e),
  ...DS(e),
  ...$S(e),
  ...LS(e)
}));
function Al(e) {
  return {
    receivers: [...e.getReceivers()],
    privilege: e.getPrivilege()
  };
}
function FS({ client: e }) {
  const t = B((s) => s.sessionState.connectionState), n = B((s) => s.setChatState), r = B((s) => s.receiveChatMessage), o = B((s) => s.removeChatMessage), i = B((s) => s.resetChatState);
  oe(() => {
    if (!e || t !== we.Connected) {
      i();
      return;
    }
    const s = bf(e);
    if (!s) {
      i();
      return;
    }
    const a = () => {
      try {
        n(Al(s));
      } catch {
      }
    }, c = (d) => {
      r(d);
    }, u = ({ id: d }) => {
      o(d);
    };
    try {
      n({
        messages: [...s.getHistory()],
        ...Al(s),
        isAvailable: !0,
        unreadCount: 0
      });
    } catch {
      i();
      return;
    }
    return e.on("chat-on-message", c), e.on("chat-delete-message", u), e.on("chat-privilege-change", a), e.on("user-added", a), e.on("user-removed", a), e.on("user-updated", a), () => {
      e.off("chat-on-message", c), e.off("chat-delete-message", u), e.off("chat-privilege-change", a), e.off("user-added", a), e.off("user-removed", a), e.off("user-updated", a);
    };
  }, [e, t, r, o, i, n]);
}
const wf = "zoom-uitoolkit-media-permission-microphone", _f = "zoom-uitoolkit-media-permission-camera";
function Cf(e, { description: t, closeLabel: n }) {
  return {
    id: e,
    description: t,
    duration: 1 / 0,
    position: "top-center",
    action: {
      label: n,
      onClick: () => Ve.dismiss(e)
    }
  };
}
function VS(e) {
  Ve.warning(e.message, Cf(wf, e));
}
function BS(e) {
  Ve.warning(e.message, Cf(_f, e));
}
function xf() {
  Ve.dismiss(wf);
}
function Ef() {
  Ve.dismiss(_f);
}
function Rf() {
  xf(), Ef();
}
const If = "default";
let Ol = 0;
async function en(e) {
  if (!e) return;
  const t = ++Ol;
  try {
    const { sessionState: n, deviceState: r, setDeviceState: o } = B.getState();
    if (n.connectionState !== we.Connected || t !== Ol) return;
    const i = Wi(e.getCameraList()), s = Wi(e.getMicList()), a = Wi(e.getSpeakerList());
    o({
      cameras: i,
      microphones: s,
      speakers: a,
      activeCameraId: Ki(e.getActiveCamera() || r.activeCameraId, i),
      activeMicrophoneId: Ki(
        e.getActiveMicrophone() || r.activeMicrophoneId,
        s
      ),
      activeSpeakerId: Ki(e.getActiveSpeaker() || r.activeSpeakerId, a)
    });
  } catch {
  }
}
function Wi(e) {
  const t = [];
  for (const n of e ?? []) {
    if (!n.deviceId) continue;
    const r = t.findIndex(
      (c) => c.deviceId === n.deviceId
    );
    if (r === -1) {
      t.push(n);
      continue;
    }
    const o = t[r], i = /^default\b/i.test(o.label.trim()), s = /^default\b/i.test(n.label.trim());
    n.deviceId !== If && i && !s && (t[r] = n);
  }
  return t;
}
function Ki(e, t) {
  var n, r;
  return t.length === 0 ? null : e && t.some((o) => o.deviceId === e) ? e : ((n = t.find((o) => o.deviceId === If)) == null ? void 0 : n.deviceId) ?? ((r = t[0]) == null ? void 0 : r.deviceId) ?? null;
}
function zS({ client: e }) {
  const t = B((u) => u.setSessionState), n = B((u) => u.resetAudioState), r = B((u) => u.resetDeviceState), o = B((u) => u.resetVideoState), i = B((u) => u.resetSessionState), s = B((u) => u.resetShareState), a = B((u) => u.resetParticipantState), c = B((u) => u.resetChatState);
  oe(() => {
    if (!e)
      return;
    const u = (d) => {
      const l = d.state === we.Connected, g = d.state === we.Closed || d.state === we.Fail || d.state === we.Reconnecting, v = l ? e.getMediaStream() : null;
      if (g && (Rf(), i(), n(), r(), a(), c(), o(), s()), t({
        connectionState: d.state,
        isJoining: !1,
        isLeaving: !1,
        reason: d.reason ?? null,
        errorMessage: d.state === we.Fail ? d.reason ?? null : null
      }), l) {
        en(v);
        try {
          t({ sessionInfo: e.getSessionInfo() });
        } catch {
          t({ sessionInfo: Sf });
        }
      }
    };
    return e.on("connection-change", u), () => {
      e.off("connection-change", u);
    };
  }, [
    e,
    n,
    r,
    a,
    c,
    o,
    t,
    i,
    s
  ]);
}
function jS({ client: e }) {
  oe(() => {
    if (!e)
      return;
    const t = (n) => {
      var c, u;
      const { audioState: r, videoState: o, setAudioState: i, setVideoState: s } = B.getState(), a = n.state === "denied";
      if (n.name === "microphone") {
        a ? (i({ warning: { type: "permission" } }), VS({
          message: qe.t("media.permission_required_microphone"),
          description: qe.t("media.permission_required_description"),
          closeLabel: qe.t("common.close")
        })) : (((c = r.warning) == null ? void 0 : c.type) === "permission" && i({ warning: null }), xf());
        return;
      }
      n.name === "camera" && (a ? (s({ warning: { type: "permission" } }), BS({
        message: qe.t("media.permission_required_camera"),
        description: qe.t("media.permission_required_description"),
        closeLabel: qe.t("common.close")
      })) : (((u = o.warning) == null ? void 0 : u.type) === "permission" && s({ warning: null }), Ef()));
    };
    return e.on("device-permission-change", t), () => {
      e.off("device-permission-change", t), Rf();
    };
  }, [e]);
}
function US({ client: e }) {
  const t = B((n) => n.setVideoState);
  oe(() => {
    if (!e) return;
    const n = async (o) => {
      const i = Re(e), s = o === "encode";
      try {
        if (!await (i == null ? void 0 : i.enableHardwareAcceleration(s ? { encode: !0 } : { decode: !0 }))) return;
        t(s ? { hardwareAccelerationSending: !0 } : { hardwareAccelerationReceiving: !0 });
      } catch {
        console.log(`Failed to enable hardware acceleration for video ${o}`);
      }
    }, r = ({ type: o, action: i, result: s }) => {
      o === "video" && s === "success" && n(i);
    };
    return e.on("media-sdk-change", r), () => {
      e.off("media-sdk-change", r);
    };
  }, [e, t]);
}
function HS({ client: e }) {
  oe(() => {
    if (!e)
      return;
    const t = () => {
      en(Re(e));
    };
    return e.on("device-change", t), () => {
      e.off("device-change", t);
    };
  }, [e]);
}
function Mn(e, t) {
  try {
    return e.getUser(t) ?? null;
  } catch {
    return null;
  }
}
function WS({ client: e }) {
  const t = B((s) => s.setSessionState), n = B((s) => s.setParticipantState), r = B((s) => s.setShareState), o = ue(null), i = ue(null);
  oe(() => {
    if (!e)
      return;
    const s = () => {
      let l, f;
      try {
        l = e.getAllUser();
      } catch {
        l = [];
      }
      try {
        f = e.getCurrentUserInfo();
      } catch {
        f = null;
      }
      try {
        const g = (e == null ? void 0 : e.isOriginalHost()) ?? !1;
        t({ isOriginalHost: g });
      } catch {
      }
      if (n({ participants: l, currentUser: f }), r({
        isSharing: f == null ? void 0 : f.sharerOn,
        ...f != null && f.sharerOn ? {} : { isEnableOptimizeForSharedVideo: !1 }
      }), o.current !== null) {
        const g = Mn(e, o.current);
        g && (n({ activeShareUser: g }), o.current = null);
      }
      if (i.current !== null) {
        const g = Mn(e, i.current);
        g && (n({ activeVideoUser: g }), i.current = null);
      }
    }, a = (l) => {
      const f = Mn(e, l.userId);
      f ? (n({ activeVideoUser: f }), i.current = null) : i.current = l.userId;
    }, c = (l) => {
      const f = l.map(({ userId: g }) => Mn(e, g)).filter((g) => g !== null);
      n({ activeSpeakers: f });
    }, u = (l) => {
      const { userId: f, action: g } = l, v = Mn(e, f), p = B.getState().participantState.activeShareUsersList;
      if (g === "Start" && v && (n({ activeShareUsersList: [...p, v] }), r({ isReceivingShare: !0 })), g === "Stop") {
        const b = p.filter((y) => y.userId !== f);
        n({ activeShareUsersList: b }), b.length === 0 && r({ isReceivingShare: !1 });
      }
    }, d = (l) => {
      const { userId: f, state: g } = l;
      if (g === "Active") {
        r({ isReceivingShare: !0 });
        const v = Mn(e, f);
        v ? (n({ activeShareUser: v }), o.current = null) : o.current = f;
      }
      g === "Inactive" && (n({ activeShareUser: null }), o.current = null, B.getState().participantState.activeShareUsersList.length === 0 && r({ isReceivingShare: !1 }));
    };
    return e.on("user-added", s), e.on("user-removed", s), e.on("user-updated", s), e.on("video-active-change", a), e.on("active-speaker", c), e.on("peer-share-state-change", u), e.on("active-share-change", d), () => {
      e.off("user-added", s), e.off("user-removed", s), e.off("user-updated", s), e.off("video-active-change", a), e.off("active-speaker", c), e.off("peer-share-state-change", u), e.off("active-share-change", d);
    };
  }, [e, n, t, r]);
}
const KS = ({ client: e }) => {
  const { t } = de(), n = he(() => Re(e), [e]), r = B((s) => s.setShareState), o = q(() => {
    if (!n) return;
    const s = n.getSharePrivilege();
    r({ sharePrivilege: s });
  }, [r, n]), i = q(
    (s) => {
      s.reason === "PrivilegeChange" && Ve.error(t("share.error.stopped_privilege_change"), {
        duration: 3e3,
        position: "top-center"
      });
    },
    [t]
  );
  oe(() => {
    if (e)
      return e.on("share-privilege-change", o), e.on("passively-stop-share", i), () => {
        e.off("share-privilege-change", o), e.off("passively-stop-share", i);
      };
  }, [e, o, i]);
};
function qS({ client: e }) {
  const t = B((o) => o.setAnnotationState), n = B((o) => o.shareState.isSharing), r = B((o) => o.shareState.isReceivingShare);
  oe(() => {
    !n && !r && t({ isAnnotationStarted: !1 });
  }, [n, r, t]), oe(() => {
    if (!e) return;
    const o = async () => {
      const s = Re(e), a = (s == null ? void 0 : s.canDoAnnotation()) ?? !1, c = B.getState().shareState.annotation.isAnnotationStarted;
      if (!a && c)
        try {
          await (s == null ? void 0 : s.stopAnnotation()), t({ canDoAnnotation: a, isAnnotationStarted: !1 });
          return;
        } catch (u) {
          console.error(u);
        }
      t({ canDoAnnotation: a });
    }, i = async () => {
      const s = Re(e);
      if (!B.getState().shareState.annotation.isAnnotationStarted)
        try {
          await (s == null ? void 0 : s.startAnnotation()), t({ isAnnotationStarted: !0 });
        } catch (c) {
          console.error(c);
        }
    };
    return e.on("annotation-privilege-change", o), e.on("annotation-viewer-draw-request", i), () => {
      e.off("annotation-privilege-change", o), e.off("annotation-viewer-draw-request", i);
    };
  }, [e, t]);
}
function GS({ client: e }) {
  const t = B((n) => n.setVideoState);
  oe(() => {
    if (!e) return;
    const n = ({ isReady: r }) => {
      t({ isVirtualBackgroundReady: r });
    };
    return e.on("video-virtual-background-preload-change", n), () => {
      e.off("video-virtual-background-preload-change", n);
    };
  }, [e, t]);
}
function Tf() {
  const e = B((u) => u.sessionState), t = B((u) => u.participantState), n = t.currentUser;
  if (!n)
    return !1;
  const r = e.isOriginalHost, o = n.isAlternativeHost ?? !1, i = t.participants.some((u) => !!u.isOriginalHost && u.userId !== n.userId), s = r || o && n.isManager && !i, a = !n.isHost, c = !n.subsessionId;
  return s && a && c;
}
function Nf() {
  const { client: e } = _e();
  return q(async () => {
    if (e)
      try {
        await e.reclaimHost();
      } catch (t) {
        console.error(t);
      }
  }, [e]);
}
const Af = or("dark");
function Se() {
  return xn(Af);
}
var Ia = "--zui-base-z-index";
const Of = or(1e3);
function Ta() {
  return xn(Of);
}
function Ye() {
  const e = Ta();
  return { [Ia]: e };
}
function X(...e) {
  return e.filter(Boolean).join(" ");
}
var YS = "mkxfq22", XS = "mkxfq23", ZS = "mkxfq24", JS = "mkxfq25";
function QS(e, t) {
  if (typeof e != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (typeof r != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function ew(e) {
  var t = QS(e, "string");
  return typeof t == "symbol" ? t : String(t);
}
function tw(e, t, n) {
  return t = ew(t), t in e ? Object.defineProperty(e, t, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[t] = n, e;
}
function Pl(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function Ml(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Pl(Object(n), !0).forEach(function(r) {
      tw(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Pl(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function kl(e, t) {
  var n = {};
  for (var r in e)
    n[r] = t(e[r], r);
  return n;
}
var nw = (e, t, n) => {
  for (var r of Object.keys(e)) {
    var o;
    if (e[r] !== ((o = t[r]) !== null && o !== void 0 ? o : n[r]))
      return !1;
  }
  return !0;
}, St = (e) => {
  var t = (n) => {
    var r = e.defaultClassName, o = Ml(Ml({}, e.defaultVariants), n);
    for (var i in o) {
      var s, a = (s = o[i]) !== null && s !== void 0 ? s : e.defaultVariants[i];
      if (a != null) {
        var c = a;
        typeof c == "boolean" && (c = c === !0 ? "true" : "false");
        var u = (
          // @ts-expect-error
          e.variantClassNames[i][c]
        );
        u && (r += " " + u);
      }
    }
    for (var [d, l] of e.compoundVariants)
      nw(d, o, e.defaultVariants) && (r += " " + l);
    return r;
  };
  return t.variants = () => Object.keys(e.variantClassNames), t.classNames = {
    get base() {
      return e.defaultClassName.split(" ")[0];
    },
    get variants() {
      return kl(e.variantClassNames, (n) => kl(n, (r) => r.split(" ")[0]));
    }
  }, t;
}, rw = "_1954r2k2", ow = "_1954r2k3 _1954r2k1", iw = "_1954r2k4", Dl = "_1954r2k5", sw = "_1954r2k6", aw = St({ defaultClassName: "_1954r2k7 _1954r2k1", variantClassNames: { tone: { neutral: "_1954r2k8", accent: "_1954r2k9", danger: "_1954r2ka" }, size: { sm: "_1954r2kb", md: "_1954r2kc", lg: "_1954r2kd" }, fullWidth: { true: "_1954r2ke", false: "_1954r2kf" }, active: { true: "_1954r2kg", false: "_1954r2kh" } }, defaultVariants: { tone: "neutral", size: "sm", fullWidth: !1, active: !1 }, compoundVariants: [[{ tone: "accent", active: !0 }, "_1954r2ki"]] }), cw = "_1954r2kj", lw = "_1954r2kk", uw = "_1954r2kl", dw = "_1954r2kn", fw = "_1954r2kr", hw = "_1954r2ks", pw = { default: void 0, quiet: "_1954r2ko", overlay: "_1954r2kp", segment: "_1954r2kq" }, mw = "_1954r2kt", gw = "_1954r2ku", vw = St({ defaultClassName: "_1954r2kv _1954r2km _1954r2k1", variantClassNames: { presentation: { dropdown: "_1954r2kw", sheet: "_1954r2kx", selection: "_1954r2ky" }, layout: { plain: "_1954r2kz", leading: "_1954r2k10", trailing: "_1954r2k11" }, danger: { true: "_1954r2k12", false: "_1954r2k13" } }, defaultVariants: {}, compoundVariants: [] }), yw = "_1954r2k14 _1954r2k1", bw = "_14sdsl32", sr = "_14sdsl34", Sw = "_14sdsl35", ww = "_14sdsl39", ar = "_14sdsl3a", Na = "_14sdsl3b _14sdsl39", Ur = "_14sdsl3c", Hr = "_14sdsl3d";
St({ defaultClassName: "_14sdsl3f", variantClassNames: { tone: { neutral: "_14sdsl3g", accent: "_14sdsl3h", success: "_14sdsl3i", warning: "_14sdsl3j", danger: "_14sdsl3k" } }, defaultVariants: { tone: "neutral" }, compoundVariants: [] });
St({ defaultClassName: "_14sdsl3m", variantClassNames: { tone: { accent: "_14sdsl3n", danger: "_14sdsl3o" } }, defaultVariants: { tone: "accent" }, compoundVariants: [] });
var Ie = { iconSize: 18 };
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pf = (...e) => e.filter((t, n, r) => !!t && t.trim() !== "" && r.indexOf(t) === n).join(" ").trim();
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const _w = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Cw = (e) => e.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (t, n, r) => r ? r.toUpperCase() : n.toLowerCase()
);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const $l = (e) => {
  const t = Cw(e);
  return t.charAt(0).toUpperCase() + t.slice(1);
};
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var qi = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const xw = (e) => {
  for (const t in e)
    if (t.startsWith("aria-") || t === "role" || t === "title")
      return !0;
  return !1;
}, Ew = or({}), Rw = () => xn(Ew), Iw = Sa(
  ({ color: e, size: t, strokeWidth: n, absoluteStrokeWidth: r, className: o = "", children: i, iconNode: s, ...a }, c) => {
    const {
      size: u = 24,
      strokeWidth: d = 2,
      absoluteStrokeWidth: l = !1,
      color: f = "currentColor",
      className: g = ""
    } = Rw() ?? {}, v = r ?? l ? Number(n ?? d) * 24 / Number(t ?? u) : n ?? d;
    return Uo(
      "svg",
      {
        ref: c,
        ...qi,
        width: t ?? u ?? qi.width,
        height: t ?? u ?? qi.height,
        stroke: e ?? f,
        strokeWidth: v,
        className: Pf("lucide", g, o),
        ...!i && !xw(a) && { "aria-hidden": "true" },
        ...a
      },
      [
        ...s.map(([p, b]) => Uo(p, b)),
        ...Array.isArray(i) ? i : [i]
      ]
    );
  }
);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const me = (e, t) => {
  const n = Sa(
    ({ className: r, ...o }, i) => Uo(Iw, {
      ref: i,
      iconNode: t,
      className: Pf(
        `lucide-${_w($l(e))}`,
        `lucide-${e}`,
        r
      ),
      ...o
    })
  );
  return n.displayName = $l(e), n;
};
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Tw = [
  ["path", { d: "M5 21v-6", key: "1hz6c0" }],
  ["path", { d: "M12 21V3", key: "1lcnhd" }],
  ["path", { d: "M19 21V9", key: "unv183" }]
], Nw = me("chart-no-axes-column", Tw);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Aw = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]], yt = me("check", Aw);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ow = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]], Wr = me("chevron-down", Ow);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pw = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]], Aa = me("chevron-left", Pw);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Mw = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]], ai = me("chevron-right", Mw);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const kw = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]], Oa = me("chevron-up", kw);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Dw = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }]
], $w = me("circle-dot", Dw);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Lw = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
], Fw = me("circle-x", Lw);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Vw = [["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]], Bw = me("circle", Vw);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const zw = [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
], jw = me("copy", zw);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Uw = [
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
  ["circle", { cx: "12", cy: "5", r: "1", key: "gxeob9" }],
  ["circle", { cx: "12", cy: "19", r: "1", key: "lyex9k" }]
], Hw = me("ellipsis-vertical", Uw);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ww = [
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
  ["circle", { cx: "19", cy: "12", r: "1", key: "1wjl8i" }],
  ["circle", { cx: "5", cy: "12", r: "1", key: "1pcz8c" }]
], Pa = me("ellipsis", Ww);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Kw = [
  [
    "path",
    {
      d: "M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3",
      key: "1xhozi"
    }
  ]
], Mf = me("headphones", Kw);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const qw = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
], Gw = me("info", qw);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Yw = [
  ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1", key: "1g98yp" }],
  ["rect", { width: "7", height: "7", x: "14", y: "3", rx: "1", key: "6d4xhi" }],
  ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1", key: "nxv5o0" }],
  ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1", key: "1bb6yr" }]
], Ll = me("layout-grid", Yw);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Xw = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]], Tn = me("loader-circle", Xw);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Zw = [
  ["path", { d: "m10 17 5-5-5-5", key: "1bsop3" }],
  ["path", { d: "M15 12H3", key: "6jk70r" }],
  ["path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4", key: "u53s6r" }]
], Jw = me("log-in", Zw);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Qw = [
  ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
], e_ = me("log-out", Qw);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const t_ = [
  [
    "path",
    {
      d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
      key: "18887p"
    }
  ]
], n_ = me("message-square", t_);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r_ = [
  ["path", { d: "M12 19v3", key: "npa21l" }],
  ["path", { d: "M15 9.34V5a3 3 0 0 0-5.68-1.33", key: "1gzdoj" }],
  ["path", { d: "M16.95 16.95A7 7 0 0 1 5 12v-2", key: "cqa7eg" }],
  ["path", { d: "M18.89 13.23A7 7 0 0 0 19 12v-2", key: "16hl24" }],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  ["path", { d: "M9 9v3a3 3 0 0 0 5.12 2.12", key: "r2i35w" }]
], Ma = me("mic-off", r_);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const o_ = [
  ["path", { d: "M12 19v3", key: "npa21l" }],
  ["path", { d: "M19 10v2a7 7 0 0 1-14 0v-2", key: "1vc78b" }],
  ["rect", { x: "9", y: "2", width: "6", height: "13", rx: "3", key: "s6n7sd" }]
], kf = me("mic", o_);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const i_ = [
  ["path", { d: "m9 10 3-3 3 3", key: "11gsxs" }],
  ["path", { d: "M12 13V7", key: "h0r20n" }],
  ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2", key: "48i651" }],
  ["path", { d: "M12 17v4", key: "1riwvh" }],
  ["path", { d: "M8 21h8", key: "1ev6f3" }]
], ci = me("monitor-up", i_);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const s_ = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M3 9h18", key: "1pudct" }]
], Fl = me("panel-top", s_);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const a_ = [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
], c_ = me("pause", a_);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const l_ = [
  [
    "path",
    {
      d: "M10.1 13.9a14 14 0 0 0 3.732 2.668 1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2 18 18 0 0 1-12.728-5.272",
      key: "1wngk7"
    }
  ],
  ["path", { d: "M22 2 2 22", key: "y4kqgn" }],
  [
    "path",
    {
      d: "M4.76 13.582A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 .244.473",
      key: "10hv5p"
    }
  ]
], u_ = me("phone-off", l_);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const d_ = [
  [
    "path",
    {
      d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
      key: "9njp5v"
    }
  ]
], Df = me("phone", d_);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const f_ = [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
], $f = me("play", f_);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const h_ = [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }],
  ["path", { d: "M11 7v4", key: "m2edmq" }],
  ["path", { d: "M11 15h.01", key: "k85uqc" }]
], p_ = me("search-alert", h_);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const m_ = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
], g_ = me("search", m_);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const v_ = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
], y_ = me("send", v_);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const b_ = [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
], S_ = me("settings", b_);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const w_ = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }]
], Vl = me("square", w_);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __ = [
  ["path", { d: "M10 11v6", key: "nco0om" }],
  ["path", { d: "M14 11v6", key: "outv1u" }],
  ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }]
], Bl = me("trash-2", __);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const C_ = [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
], Lf = me("triangle-alert", C_);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const x_ = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
], E_ = me("users", x_);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const R_ = [
  [
    "path",
    { d: "M10.66 6H14a2 2 0 0 1 2 2v2.5l5.248-3.062A.5.5 0 0 1 22 7.87v8.196", key: "w8jjjt" }
  ],
  ["path", { d: "M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2", key: "1xawa7" }],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
], ka = me("video-off", R_);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const I_ = [
  [
    "path",
    {
      d: "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",
      key: "ftymec"
    }
  ],
  ["rect", { x: "2", y: "6", width: "14", height: "12", rx: "2", key: "158x01" }]
], Da = me("video", I_);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const T_ = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
], li = me("x", T_);
function Ff({ children: e, loading: t }) {
  return /* @__PURE__ */ P(pe, { children: [
    t ? /* @__PURE__ */ h("span", { className: mw, children: e }) : e,
    t && /* @__PURE__ */ h(Tn, { "aria-hidden": "true", size: Ie.iconSize, className: X(gw, sr) })
  ] });
}
function le({
  kind: e = "text",
  tone: t = "neutral",
  appearance: n = "default",
  size: r = "sm",
  active: o = !1,
  fullWidth: i = !1,
  loading: s = !1,
  count: a,
  contentSized: c = !1,
  className: u,
  children: d,
  disabled: l,
  type: f = "button",
  "aria-busy": g,
  ...v
}) {
  const p = Se(), b = /* @__PURE__ */ P(pe, { children: [
    d,
    e === "count" && /* @__PURE__ */ h("span", { className: uw, "aria-hidden": "true", children: a && a > 0 ? a > 99 ? "99+" : a : null })
  ] });
  return /* @__PURE__ */ h(
    "button",
    {
      "data-theme": p,
      "data-button-kind": e,
      ...v,
      type: f,
      disabled: l || s,
      "aria-busy": s || g,
      "data-active": o ? "true" : void 0,
      className: X(
        aw({ tone: t, size: r, active: o, fullWidth: i }),
        e === "icon" && !i && cw,
        e === "count" && !c && !i && lw,
        pw[n],
        n === "quiet" && t === "accent" && fw,
        n === "quiet" && t === "danger" && hw,
        u
      ),
      children: /* @__PURE__ */ h(Ff, { loading: s, children: b })
    }
  );
}
function nt({
  asChild: e,
  presentation: t = "dropdown",
  layout: n = "plain",
  danger: r = !1,
  className: o,
  children: i,
  ...s
}) {
  const a = X(vw({ presentation: t, layout: n, danger: r }), o);
  return e ? Kd(i, { className: X(a, i.props.className) }) : /* @__PURE__ */ h("button", { type: "button", ...s, className: a, "data-button-kind": "menu", children: i });
}
function $a({
  children: e,
  menu: t,
  contentSized: n,
  loading: r = !1,
  className: o,
  style: i,
  buttonProps: s
}) {
  const a = Se();
  return t ? /* @__PURE__ */ P(
    "div",
    {
      "data-theme": a,
      className: X(rw, n && Dl, o),
      style: i,
      "data-button-kind": "split",
      children: [
        /* @__PURE__ */ h(
          "button",
          {
            type: "button",
            "data-theme": a,
            ...s,
            disabled: s.disabled || r,
            "aria-busy": r || s["aria-busy"],
            className: X(ow, n && sw),
            children: /* @__PURE__ */ h(Ff, { loading: r, children: e })
          }
        ),
        t
      ]
    }
  ) : /* @__PURE__ */ h(
    le,
    {
      ...s,
      loading: r,
      className: X(
        iw,
        n && Dl,
        n && dw,
        o
      ),
      style: i,
      "data-button-kind": "split",
      children: e
    }
  );
}
function N_({
  className: e,
  overrideClassName: t,
  type: n = "button",
  ...r
}) {
  return /* @__PURE__ */ h("button", { ...r, type: n, className: X(t ?? yw, e) });
}
function A_({ className: e, style: t, withOwnViewport: n = !0 }) {
  var _, C;
  const { t: r } = de(), o = Se(), i = Ye(), s = B((R) => R.participantState), a = Tf(), c = Nf(), [u, d] = ne(!1), [l, f] = ne(!1), g = ((_ = s.currentUser) == null ? void 0 : _.isHost) ?? !1, v = s.participants.find((R) => R.isHost);
  g !== l && (f(g), g && d(!1));
  const p = a && !!v && !u, b = (v == null ? void 0 : v.displayName) || r("common.guest"), y = (C = s.currentUser) != null && C.isManager ? r("session.stay_manager") : r("session.stay_participant");
  async function S() {
    d(!0), await c();
  }
  const w = /* @__PURE__ */ P(
    Ub,
    {
      open: p,
      onOpenChange: (R) => {
        R || d(!0);
      },
      duration: 1 / 0,
      className: X(XS, e),
      style: t,
      "data-theme": o,
      "data-testid": "reclaim-host-banner",
      children: [
        /* @__PURE__ */ h(Hb, { className: ZS, children: r("session.reclaim_host_message", { name: b }) }),
        /* @__PURE__ */ P("div", { className: JS, children: [
          /* @__PURE__ */ h(Sl, { altText: y, asChild: !0, children: /* @__PURE__ */ h(le, { type: "button", onClick: () => d(!0), "data-testid": "reclaim-stay-manager", children: y }) }),
          /* @__PURE__ */ h(Sl, { altText: r("session.reclaim_host"), asChild: !0, children: /* @__PURE__ */ h(le, { tone: "accent", type: "button", onClick: () => void S(), "data-testid": "reclaim-host", children: r("session.reclaim_host") }) })
        ] })
      ]
    }
  );
  return n ? /* @__PURE__ */ P(pe, { children: [
    w,
    /* @__PURE__ */ h(jb, { className: YS, style: i })
  ] }) : w;
}
var O_ = m[" useId ".trim().toString()] || (() => {
}), P_ = 0;
function Bt(e) {
  const [t, n] = m.useState(O_());
  return Ut(() => {
    n((r) => r ?? String(P_++));
  }, [e]), e || (t ? `radix-${t}` : "");
}
var Gi = "focusScope.autoFocusOnMount", Yi = "focusScope.autoFocusOnUnmount", zl = { bubbles: !1, cancelable: !0 }, M_ = "FocusScope", ui = m.forwardRef((e, t) => {
  const {
    loop: n = !1,
    trapped: r = !1,
    onMountAutoFocus: o,
    onUnmountAutoFocus: i,
    ...s
  } = e, [a, c] = m.useState(null), u = it(o), d = it(i), l = m.useRef(null), f = ze(t, (p) => c(p)), g = m.useRef({
    paused: !1,
    pause() {
      this.paused = !0;
    },
    resume() {
      this.paused = !1;
    }
  }).current;
  m.useEffect(() => {
    if (r) {
      let p = function(w) {
        if (g.paused || !a) return;
        const _ = w.target;
        a.contains(_) ? l.current = _ : Jt(l.current, { select: !0 });
      }, b = function(w) {
        if (g.paused || !a) return;
        const _ = w.relatedTarget;
        _ !== null && (a.contains(_) || Jt(l.current, { select: !0 }));
      }, y = function(w) {
        if (document.activeElement === document.body)
          for (const C of w)
            C.removedNodes.length > 0 && Jt(a);
      };
      document.addEventListener("focusin", p), document.addEventListener("focusout", b);
      const S = new MutationObserver(y);
      return a && S.observe(a, { childList: !0, subtree: !0 }), () => {
        document.removeEventListener("focusin", p), document.removeEventListener("focusout", b), S.disconnect();
      };
    }
  }, [r, a, g.paused]), m.useEffect(() => {
    if (a) {
      Ul.add(g);
      const p = document.activeElement;
      if (!a.contains(p)) {
        const y = new CustomEvent(Gi, zl);
        a.addEventListener(Gi, u), a.dispatchEvent(y), y.defaultPrevented || (k_(V_(Vf(a)), { select: !0 }), document.activeElement === p && Jt(a));
      }
      return () => {
        a.removeEventListener(Gi, u), setTimeout(() => {
          const y = new CustomEvent(Yi, zl);
          a.addEventListener(Yi, d), a.dispatchEvent(y), y.defaultPrevented || Jt(p ?? document.body, { select: !0 }), a.removeEventListener(Yi, d), Ul.remove(g);
        }, 0);
      };
    }
  }, [a, u, d, g]);
  const v = m.useCallback(
    (p) => {
      if (!n && !r || g.paused) return;
      const b = p.key === "Tab" && !p.altKey && !p.ctrlKey && !p.metaKey, y = document.activeElement;
      if (b && y) {
        const S = p.currentTarget, [w, _] = D_(S);
        w && _ ? !p.shiftKey && y === _ ? (p.preventDefault(), n && Jt(w, { select: !0 })) : p.shiftKey && y === w && (p.preventDefault(), n && Jt(_, { select: !0 })) : y === S && p.preventDefault();
      }
    },
    [n, r, g.paused]
  );
  return /* @__PURE__ */ h(Te.div, { tabIndex: -1, ...s, ref: f, onKeyDown: v });
});
ui.displayName = M_;
function k_(e, { select: t = !1 } = {}) {
  const n = document.activeElement;
  for (const r of e)
    if (Jt(r, { select: t }), document.activeElement !== n) return;
}
function D_(e) {
  const t = Vf(e), n = jl(t, e), r = jl(t.reverse(), e);
  return [n, r];
}
function Vf(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (r) => {
      const o = r.tagName === "INPUT" && r.type === "hidden";
      return r.disabled || r.hidden || o ? NodeFilter.FILTER_SKIP : r.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  for (; n.nextNode(); ) t.push(n.currentNode);
  return t;
}
function jl(e, t) {
  for (const n of e)
    if (!$_(n, { upTo: t })) return n;
}
function $_(e, { upTo: t }) {
  if (getComputedStyle(e).visibility === "hidden") return !0;
  for (; e; ) {
    if (t !== void 0 && e === t) return !1;
    if (getComputedStyle(e).display === "none") return !0;
    e = e.parentElement;
  }
  return !1;
}
function L_(e) {
  return e instanceof HTMLInputElement && "select" in e;
}
function Jt(e, { select: t = !1 } = {}) {
  if (e && e.focus) {
    const n = document.activeElement;
    e.focus({ preventScroll: !0 }), e !== n && L_(e) && t && e.select();
  }
}
var Ul = F_();
function F_() {
  let e = [];
  return {
    add(t) {
      const n = e[0];
      t !== n && (n == null || n.pause()), e = Hl(e, t), e.unshift(t);
    },
    remove(t) {
      var n;
      e = Hl(e, t), (n = e[0]) == null || n.resume();
    }
  };
}
function Hl(e, t) {
  const n = [...e], r = n.indexOf(t);
  return r !== -1 && n.splice(r, 1), n;
}
function V_(e) {
  return e.filter((t) => t.tagName !== "A");
}
var Xi = 0;
function La() {
  m.useEffect(() => {
    const e = document.querySelectorAll("[data-radix-focus-guard]");
    return document.body.insertAdjacentElement("afterbegin", e[0] ?? Wl()), document.body.insertAdjacentElement("beforeend", e[1] ?? Wl()), Xi++, () => {
      Xi === 1 && document.querySelectorAll("[data-radix-focus-guard]").forEach((t) => t.remove()), Xi--;
    };
  }, []);
}
function Wl() {
  const e = document.createElement("span");
  return e.setAttribute("data-radix-focus-guard", ""), e.tabIndex = 0, e.style.outline = "none", e.style.opacity = "0", e.style.position = "fixed", e.style.pointerEvents = "none", e;
}
var At = function() {
  return At = Object.assign || function(t) {
    for (var n, r = 1, o = arguments.length; r < o; r++) {
      n = arguments[r];
      for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i]);
    }
    return t;
  }, At.apply(this, arguments);
};
function Bf(e, t) {
  var n = {};
  for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]]);
  return n;
}
function B_(e, t, n) {
  if (n || arguments.length === 2) for (var r = 0, o = t.length, i; r < o; r++)
    (i || !(r in t)) && (i || (i = Array.prototype.slice.call(t, 0, r)), i[r] = t[r]);
  return e.concat(i || Array.prototype.slice.call(t));
}
var Fo = "right-scroll-bar-position", Vo = "width-before-scroll-bar", z_ = "with-scroll-bars-hidden", j_ = "--removed-body-scroll-bar-size";
function Zi(e, t) {
  return typeof e == "function" ? e(t) : e && (e.current = t), e;
}
function U_(e, t) {
  var n = ne(function() {
    return {
      // value
      value: e,
      // last callback
      callback: t,
      // "memoized" public interface
      facade: {
        get current() {
          return n.value;
        },
        set current(r) {
          var o = n.value;
          o !== r && (n.value = r, n.callback(r, o));
        }
      }
    };
  })[0];
  return n.callback = t, n.facade;
}
var H_ = typeof window < "u" ? m.useLayoutEffect : m.useEffect, Kl = /* @__PURE__ */ new WeakMap();
function W_(e, t) {
  var n = U_(null, function(r) {
    return e.forEach(function(o) {
      return Zi(o, r);
    });
  });
  return H_(function() {
    var r = Kl.get(n);
    if (r) {
      var o = new Set(r), i = new Set(e), s = n.current;
      o.forEach(function(a) {
        i.has(a) || Zi(a, null);
      }), i.forEach(function(a) {
        o.has(a) || Zi(a, s);
      });
    }
    Kl.set(n, e);
  }, [e]), n;
}
function K_(e) {
  return e;
}
function q_(e, t) {
  t === void 0 && (t = K_);
  var n = [], r = !1, o = {
    read: function() {
      if (r)
        throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
      return n.length ? n[n.length - 1] : e;
    },
    useMedium: function(i) {
      var s = t(i, r);
      return n.push(s), function() {
        n = n.filter(function(a) {
          return a !== s;
        });
      };
    },
    assignSyncMedium: function(i) {
      for (r = !0; n.length; ) {
        var s = n;
        n = [], s.forEach(i);
      }
      n = {
        push: function(a) {
          return i(a);
        },
        filter: function() {
          return n;
        }
      };
    },
    assignMedium: function(i) {
      r = !0;
      var s = [];
      if (n.length) {
        var a = n;
        n = [], a.forEach(i), s = n;
      }
      var c = function() {
        var d = s;
        s = [], d.forEach(i);
      }, u = function() {
        return Promise.resolve().then(c);
      };
      u(), n = {
        push: function(d) {
          s.push(d), u();
        },
        filter: function(d) {
          return s = s.filter(d), n;
        }
      };
    }
  };
  return o;
}
function G_(e) {
  e === void 0 && (e = {});
  var t = q_(null);
  return t.options = At({ async: !0, ssr: !1 }, e), t;
}
var zf = function(e) {
  var t = e.sideCar, n = Bf(e, ["sideCar"]);
  if (!t)
    throw new Error("Sidecar: please provide `sideCar` property to import the right car");
  var r = t.read();
  if (!r)
    throw new Error("Sidecar medium not found");
  return m.createElement(r, At({}, n));
};
zf.isSideCarExport = !0;
function Y_(e, t) {
  return e.useMedium(t), zf;
}
var jf = G_(), Ji = function() {
}, di = m.forwardRef(function(e, t) {
  var n = m.useRef(null), r = m.useState({
    onScrollCapture: Ji,
    onWheelCapture: Ji,
    onTouchMoveCapture: Ji
  }), o = r[0], i = r[1], s = e.forwardProps, a = e.children, c = e.className, u = e.removeScrollBar, d = e.enabled, l = e.shards, f = e.sideCar, g = e.noRelative, v = e.noIsolation, p = e.inert, b = e.allowPinchZoom, y = e.as, S = y === void 0 ? "div" : y, w = e.gapMode, _ = Bf(e, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]), C = f, R = W_([n, t]), x = At(At({}, _), o);
  return m.createElement(
    m.Fragment,
    null,
    d && m.createElement(C, { sideCar: jf, removeScrollBar: u, shards: l, noRelative: g, noIsolation: v, inert: p, setCallbacks: i, allowPinchZoom: !!b, lockRef: n, gapMode: w }),
    s ? m.cloneElement(m.Children.only(a), At(At({}, x), { ref: R })) : m.createElement(S, At({}, x, { className: c, ref: R }), a)
  );
});
di.defaultProps = {
  enabled: !0,
  removeScrollBar: !0,
  inert: !1
};
di.classNames = {
  fullWidth: Vo,
  zeroRight: Fo
};
var X_ = function() {
  if (typeof __webpack_nonce__ < "u")
    return __webpack_nonce__;
};
function Z_() {
  if (!document)
    return null;
  var e = document.createElement("style");
  e.type = "text/css";
  var t = X_();
  return t && e.setAttribute("nonce", t), e;
}
function J_(e, t) {
  e.styleSheet ? e.styleSheet.cssText = t : e.appendChild(document.createTextNode(t));
}
function Q_(e) {
  var t = document.head || document.getElementsByTagName("head")[0];
  t.appendChild(e);
}
var e0 = function() {
  var e = 0, t = null;
  return {
    add: function(n) {
      e == 0 && (t = Z_()) && (J_(t, n), Q_(t)), e++;
    },
    remove: function() {
      e--, !e && t && (t.parentNode && t.parentNode.removeChild(t), t = null);
    }
  };
}, t0 = function() {
  var e = e0();
  return function(t, n) {
    m.useEffect(function() {
      return e.add(t), function() {
        e.remove();
      };
    }, [t && n]);
  };
}, Uf = function() {
  var e = t0(), t = function(n) {
    var r = n.styles, o = n.dynamic;
    return e(r, o), null;
  };
  return t;
}, n0 = {
  left: 0,
  top: 0,
  right: 0,
  gap: 0
}, Qi = function(e) {
  return parseInt(e || "", 10) || 0;
}, r0 = function(e) {
  var t = window.getComputedStyle(document.body), n = t[e === "padding" ? "paddingLeft" : "marginLeft"], r = t[e === "padding" ? "paddingTop" : "marginTop"], o = t[e === "padding" ? "paddingRight" : "marginRight"];
  return [Qi(n), Qi(r), Qi(o)];
}, o0 = function(e) {
  if (e === void 0 && (e = "margin"), typeof window > "u")
    return n0;
  var t = r0(e), n = document.documentElement.clientWidth, r = window.innerWidth;
  return {
    left: t[0],
    top: t[1],
    right: t[2],
    gap: Math.max(0, r - n + t[2] - t[0])
  };
}, i0 = Uf(), Gn = "data-scroll-locked", s0 = function(e, t, n, r) {
  var o = e.left, i = e.top, s = e.right, a = e.gap;
  return n === void 0 && (n = "margin"), `
  .`.concat(z_, ` {
   overflow: hidden `).concat(r, `;
   padding-right: `).concat(a, "px ").concat(r, `;
  }
  body[`).concat(Gn, `] {
    overflow: hidden `).concat(r, `;
    overscroll-behavior: contain;
    `).concat([
    t && "position: relative ".concat(r, ";"),
    n === "margin" && `
    padding-left: `.concat(o, `px;
    padding-top: `).concat(i, `px;
    padding-right: `).concat(s, `px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(a, "px ").concat(r, `;
    `),
    n === "padding" && "padding-right: ".concat(a, "px ").concat(r, ";")
  ].filter(Boolean).join(""), `
  }
  
  .`).concat(Fo, ` {
    right: `).concat(a, "px ").concat(r, `;
  }
  
  .`).concat(Vo, ` {
    margin-right: `).concat(a, "px ").concat(r, `;
  }
  
  .`).concat(Fo, " .").concat(Fo, ` {
    right: 0 `).concat(r, `;
  }
  
  .`).concat(Vo, " .").concat(Vo, ` {
    margin-right: 0 `).concat(r, `;
  }
  
  body[`).concat(Gn, `] {
    `).concat(j_, ": ").concat(a, `px;
  }
`);
}, ql = function() {
  var e = parseInt(document.body.getAttribute(Gn) || "0", 10);
  return isFinite(e) ? e : 0;
}, a0 = function() {
  m.useEffect(function() {
    return document.body.setAttribute(Gn, (ql() + 1).toString()), function() {
      var e = ql() - 1;
      e <= 0 ? document.body.removeAttribute(Gn) : document.body.setAttribute(Gn, e.toString());
    };
  }, []);
}, c0 = function(e) {
  var t = e.noRelative, n = e.noImportant, r = e.gapMode, o = r === void 0 ? "margin" : r;
  a0();
  var i = m.useMemo(function() {
    return o0(o);
  }, [o]);
  return m.createElement(i0, { styles: s0(i, !t, o, n ? "" : "!important") });
}, zs = !1;
if (typeof window < "u")
  try {
    var yo = Object.defineProperty({}, "passive", {
      get: function() {
        return zs = !0, !0;
      }
    });
    window.addEventListener("test", yo, yo), window.removeEventListener("test", yo, yo);
  } catch {
    zs = !1;
  }
var kn = zs ? { passive: !1 } : !1, l0 = function(e) {
  return e.tagName === "TEXTAREA";
}, Hf = function(e, t) {
  if (!(e instanceof Element))
    return !1;
  var n = window.getComputedStyle(e);
  return (
    // not-not-scrollable
    n[t] !== "hidden" && // contains scroll inside self
    !(n.overflowY === n.overflowX && !l0(e) && n[t] === "visible")
  );
}, u0 = function(e) {
  return Hf(e, "overflowY");
}, d0 = function(e) {
  return Hf(e, "overflowX");
}, Gl = function(e, t) {
  var n = t.ownerDocument, r = t;
  do {
    typeof ShadowRoot < "u" && r instanceof ShadowRoot && (r = r.host);
    var o = Wf(e, r);
    if (o) {
      var i = Kf(e, r), s = i[1], a = i[2];
      if (s > a)
        return !0;
    }
    r = r.parentNode;
  } while (r && r !== n.body);
  return !1;
}, f0 = function(e) {
  var t = e.scrollTop, n = e.scrollHeight, r = e.clientHeight;
  return [
    t,
    n,
    r
  ];
}, h0 = function(e) {
  var t = e.scrollLeft, n = e.scrollWidth, r = e.clientWidth;
  return [
    t,
    n,
    r
  ];
}, Wf = function(e, t) {
  return e === "v" ? u0(t) : d0(t);
}, Kf = function(e, t) {
  return e === "v" ? f0(t) : h0(t);
}, p0 = function(e, t) {
  return e === "h" && t === "rtl" ? -1 : 1;
}, m0 = function(e, t, n, r, o) {
  var i = p0(e, window.getComputedStyle(t).direction), s = i * r, a = n.target, c = t.contains(a), u = !1, d = s > 0, l = 0, f = 0;
  do {
    if (!a)
      break;
    var g = Kf(e, a), v = g[0], p = g[1], b = g[2], y = p - b - i * v;
    (v || y) && Wf(e, a) && (l += y, f += v);
    var S = a.parentNode;
    a = S && S.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? S.host : S;
  } while (
    // portaled content
    !c && a !== document.body || // self content
    c && (t.contains(a) || t === a)
  );
  return (d && Math.abs(l) < 1 || !d && Math.abs(f) < 1) && (u = !0), u;
}, bo = function(e) {
  return "changedTouches" in e ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY] : [0, 0];
}, Yl = function(e) {
  return [e.deltaX, e.deltaY];
}, Xl = function(e) {
  return e && "current" in e ? e.current : e;
}, g0 = function(e, t) {
  return e[0] === t[0] && e[1] === t[1];
}, v0 = function(e) {
  return `
  .block-interactivity-`.concat(e, ` {pointer-events: none;}
  .allow-interactivity-`).concat(e, ` {pointer-events: all;}
`);
}, y0 = 0, Dn = [];
function b0(e) {
  var t = m.useRef([]), n = m.useRef([0, 0]), r = m.useRef(), o = m.useState(y0++)[0], i = m.useState(Uf)[0], s = m.useRef(e);
  m.useEffect(function() {
    s.current = e;
  }, [e]), m.useEffect(function() {
    if (e.inert) {
      document.body.classList.add("block-interactivity-".concat(o));
      var p = B_([e.lockRef.current], (e.shards || []).map(Xl), !0).filter(Boolean);
      return p.forEach(function(b) {
        return b.classList.add("allow-interactivity-".concat(o));
      }), function() {
        document.body.classList.remove("block-interactivity-".concat(o)), p.forEach(function(b) {
          return b.classList.remove("allow-interactivity-".concat(o));
        });
      };
    }
  }, [e.inert, e.lockRef.current, e.shards]);
  var a = m.useCallback(function(p, b) {
    if ("touches" in p && p.touches.length === 2 || p.type === "wheel" && p.ctrlKey)
      return !s.current.allowPinchZoom;
    var y = bo(p), S = n.current, w = "deltaX" in p ? p.deltaX : S[0] - y[0], _ = "deltaY" in p ? p.deltaY : S[1] - y[1], C, R = p.target, x = Math.abs(w) > Math.abs(_) ? "h" : "v";
    if ("touches" in p && x === "h" && R.type === "range")
      return !1;
    var E = window.getSelection(), I = E && E.anchorNode, M = I ? I === R || I.contains(R) : !1;
    if (M)
      return !1;
    var N = Gl(x, R);
    if (!N)
      return !0;
    if (N ? C = x : (C = x === "v" ? "h" : "v", N = Gl(x, R)), !N)
      return !1;
    if (!r.current && "changedTouches" in p && (w || _) && (r.current = C), !C)
      return !0;
    var $ = r.current || C;
    return m0($, b, p, $ === "h" ? w : _);
  }, []), c = m.useCallback(function(p) {
    var b = p;
    if (!(!Dn.length || Dn[Dn.length - 1] !== i)) {
      var y = "deltaY" in b ? Yl(b) : bo(b), S = t.current.filter(function(C) {
        return C.name === b.type && (C.target === b.target || b.target === C.shadowParent) && g0(C.delta, y);
      })[0];
      if (S && S.should) {
        b.cancelable && b.preventDefault();
        return;
      }
      if (!S) {
        var w = (s.current.shards || []).map(Xl).filter(Boolean).filter(function(C) {
          return C.contains(b.target);
        }), _ = w.length > 0 ? a(b, w[0]) : !s.current.noIsolation;
        _ && b.cancelable && b.preventDefault();
      }
    }
  }, []), u = m.useCallback(function(p, b, y, S) {
    var w = { name: p, delta: b, target: y, should: S, shadowParent: S0(y) };
    t.current.push(w), setTimeout(function() {
      t.current = t.current.filter(function(_) {
        return _ !== w;
      });
    }, 1);
  }, []), d = m.useCallback(function(p) {
    n.current = bo(p), r.current = void 0;
  }, []), l = m.useCallback(function(p) {
    u(p.type, Yl(p), p.target, a(p, e.lockRef.current));
  }, []), f = m.useCallback(function(p) {
    u(p.type, bo(p), p.target, a(p, e.lockRef.current));
  }, []);
  m.useEffect(function() {
    return Dn.push(i), e.setCallbacks({
      onScrollCapture: l,
      onWheelCapture: l,
      onTouchMoveCapture: f
    }), document.addEventListener("wheel", c, kn), document.addEventListener("touchmove", c, kn), document.addEventListener("touchstart", d, kn), function() {
      Dn = Dn.filter(function(p) {
        return p !== i;
      }), document.removeEventListener("wheel", c, kn), document.removeEventListener("touchmove", c, kn), document.removeEventListener("touchstart", d, kn);
    };
  }, []);
  var g = e.removeScrollBar, v = e.inert;
  return m.createElement(
    m.Fragment,
    null,
    v ? m.createElement(i, { styles: v0(o) }) : null,
    g ? m.createElement(c0, { noRelative: e.noRelative, gapMode: e.gapMode }) : null
  );
}
function S0(e) {
  for (var t = null; e !== null; )
    e instanceof ShadowRoot && (t = e.host, e = e.host), e = e.parentNode;
  return t;
}
const w0 = Y_(jf, b0);
var Kr = m.forwardRef(function(e, t) {
  return m.createElement(di, At({}, e, { ref: t, sideCar: w0 }));
});
Kr.classNames = di.classNames;
var _0 = function(e) {
  if (typeof document > "u")
    return null;
  var t = Array.isArray(e) ? e[0] : e;
  return t.ownerDocument.body;
}, $n = /* @__PURE__ */ new WeakMap(), So = /* @__PURE__ */ new WeakMap(), wo = {}, es = 0, qf = function(e) {
  return e && (e.host || qf(e.parentNode));
}, C0 = function(e, t) {
  return t.map(function(n) {
    if (e.contains(n))
      return n;
    var r = qf(n);
    return r && e.contains(r) ? r : (console.error("aria-hidden", n, "in not contained inside", e, ". Doing nothing"), null);
  }).filter(function(n) {
    return !!n;
  });
}, x0 = function(e, t, n, r) {
  var o = C0(t, Array.isArray(e) ? e : [e]);
  wo[n] || (wo[n] = /* @__PURE__ */ new WeakMap());
  var i = wo[n], s = [], a = /* @__PURE__ */ new Set(), c = new Set(o), u = function(l) {
    !l || a.has(l) || (a.add(l), u(l.parentNode));
  };
  o.forEach(u);
  var d = function(l) {
    !l || c.has(l) || Array.prototype.forEach.call(l.children, function(f) {
      if (a.has(f))
        d(f);
      else
        try {
          var g = f.getAttribute(r), v = g !== null && g !== "false", p = ($n.get(f) || 0) + 1, b = (i.get(f) || 0) + 1;
          $n.set(f, p), i.set(f, b), s.push(f), p === 1 && v && So.set(f, !0), b === 1 && f.setAttribute(n, "true"), v || f.setAttribute(r, "true");
        } catch (y) {
          console.error("aria-hidden: cannot operate on ", f, y);
        }
    });
  };
  return d(t), a.clear(), es++, function() {
    s.forEach(function(l) {
      var f = $n.get(l) - 1, g = i.get(l) - 1;
      $n.set(l, f), i.set(l, g), f || (So.has(l) || l.removeAttribute(r), So.delete(l)), g || l.removeAttribute(n);
    }), es--, es || ($n = /* @__PURE__ */ new WeakMap(), $n = /* @__PURE__ */ new WeakMap(), So = /* @__PURE__ */ new WeakMap(), wo = {});
  };
}, fi = function(e, t, n) {
  n === void 0 && (n = "data-aria-hidden");
  var r = Array.from(Array.isArray(e) ? e : [e]), o = _0(e);
  return o ? (r.push.apply(r, Array.from(o.querySelectorAll("[aria-live], script"))), x0(r, o, n, "aria-hidden")) : function() {
    return null;
  };
}, hi = "Dialog", [Gf] = sn(hi), [E0, Rt] = Gf(hi), Yf = (e) => {
  const {
    __scopeDialog: t,
    children: n,
    open: r,
    defaultOpen: o,
    onOpenChange: i,
    modal: s = !0
  } = e, a = m.useRef(null), c = m.useRef(null), [u, d] = ir({
    prop: r,
    defaultProp: o ?? !1,
    onChange: i,
    caller: hi
  });
  return /* @__PURE__ */ h(
    E0,
    {
      scope: t,
      triggerRef: a,
      contentRef: c,
      contentId: Bt(),
      titleId: Bt(),
      descriptionId: Bt(),
      open: u,
      onOpenChange: d,
      onOpenToggle: m.useCallback(() => d((l) => !l), [d]),
      modal: s,
      children: n
    }
  );
};
Yf.displayName = hi;
var Xf = "DialogTrigger", Zf = m.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...r } = e, o = Rt(Xf, n), i = ze(t, o.triggerRef);
    return /* @__PURE__ */ h(
      Te.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": o.open,
        "aria-controls": o.contentId,
        "data-state": Ba(o.open),
        ...r,
        ref: i,
        onClick: ce(e.onClick, o.onOpenToggle)
      }
    );
  }
);
Zf.displayName = Xf;
var Fa = "DialogPortal", [R0, Jf] = Gf(Fa, {
  forceMount: void 0
}), Qf = (e) => {
  const { __scopeDialog: t, forceMount: n, children: r, container: o } = e, i = Rt(Fa, t);
  return /* @__PURE__ */ h(R0, { scope: t, forceMount: n, children: m.Children.map(r, (s) => /* @__PURE__ */ h(Et, { present: n || i.open, children: /* @__PURE__ */ h(In, { asChild: !0, container: o, children: s }) })) });
};
Qf.displayName = Fa;
var qo = "DialogOverlay", eh = m.forwardRef(
  (e, t) => {
    const n = Jf(qo, e.__scopeDialog), { forceMount: r = n.forceMount, ...o } = e, i = Rt(qo, e.__scopeDialog);
    return i.modal ? /* @__PURE__ */ h(Et, { present: r || i.open, children: /* @__PURE__ */ h(T0, { ...o, ref: t }) }) : null;
  }
);
eh.displayName = qo;
var I0 = /* @__PURE__ */ Jn("DialogOverlay.RemoveScroll"), T0 = m.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...r } = e, o = Rt(qo, n);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ h(Kr, { as: I0, allowPinchZoom: !0, shards: [o.contentRef], children: /* @__PURE__ */ h(
        Te.div,
        {
          "data-state": Ba(o.open),
          ...r,
          ref: t,
          style: { pointerEvents: "auto", ...r.style }
        }
      ) })
    );
  }
), bn = "DialogContent", th = m.forwardRef(
  (e, t) => {
    const n = Jf(bn, e.__scopeDialog), { forceMount: r = n.forceMount, ...o } = e, i = Rt(bn, e.__scopeDialog);
    return /* @__PURE__ */ h(Et, { present: r || i.open, children: i.modal ? /* @__PURE__ */ h(N0, { ...o, ref: t }) : /* @__PURE__ */ h(A0, { ...o, ref: t }) });
  }
);
th.displayName = bn;
var N0 = m.forwardRef(
  (e, t) => {
    const n = Rt(bn, e.__scopeDialog), r = m.useRef(null), o = ze(t, n.contentRef, r);
    return m.useEffect(() => {
      const i = r.current;
      if (i) return fi(i);
    }, []), /* @__PURE__ */ h(
      nh,
      {
        ...e,
        ref: o,
        trapFocus: n.open,
        disableOutsidePointerEvents: !0,
        onCloseAutoFocus: ce(e.onCloseAutoFocus, (i) => {
          var s;
          i.preventDefault(), (s = n.triggerRef.current) == null || s.focus();
        }),
        onPointerDownOutside: ce(e.onPointerDownOutside, (i) => {
          const s = i.detail.originalEvent, a = s.button === 0 && s.ctrlKey === !0;
          (s.button === 2 || a) && i.preventDefault();
        }),
        onFocusOutside: ce(
          e.onFocusOutside,
          (i) => i.preventDefault()
        )
      }
    );
  }
), A0 = m.forwardRef(
  (e, t) => {
    const n = Rt(bn, e.__scopeDialog), r = m.useRef(!1), o = m.useRef(!1);
    return /* @__PURE__ */ h(
      nh,
      {
        ...e,
        ref: t,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: (i) => {
          var s, a;
          (s = e.onCloseAutoFocus) == null || s.call(e, i), i.defaultPrevented || (r.current || (a = n.triggerRef.current) == null || a.focus(), i.preventDefault()), r.current = !1, o.current = !1;
        },
        onInteractOutside: (i) => {
          var c, u;
          (c = e.onInteractOutside) == null || c.call(e, i), i.defaultPrevented || (r.current = !0, i.detail.originalEvent.type === "pointerdown" && (o.current = !0));
          const s = i.target;
          ((u = n.triggerRef.current) == null ? void 0 : u.contains(s)) && i.preventDefault(), i.detail.originalEvent.type === "focusin" && o.current && i.preventDefault();
        }
      }
    );
  }
), nh = m.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, trapFocus: r, onOpenAutoFocus: o, onCloseAutoFocus: i, ...s } = e, a = Rt(bn, n), c = m.useRef(null), u = ze(t, c);
    return La(), /* @__PURE__ */ P(pe, { children: [
      /* @__PURE__ */ h(
        ui,
        {
          asChild: !0,
          loop: !0,
          trapped: r,
          onMountAutoFocus: o,
          onUnmountAutoFocus: i,
          children: /* @__PURE__ */ h(
            zr,
            {
              role: "dialog",
              id: a.contentId,
              "aria-describedby": a.descriptionId,
              "aria-labelledby": a.titleId,
              "data-state": Ba(a.open),
              ...s,
              ref: u,
              onDismiss: () => a.onOpenChange(!1)
            }
          )
        }
      ),
      /* @__PURE__ */ P(pe, { children: [
        /* @__PURE__ */ h(O0, { titleId: a.titleId }),
        /* @__PURE__ */ h(M0, { contentRef: c, descriptionId: a.descriptionId })
      ] })
    ] });
  }
), Va = "DialogTitle", rh = m.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...r } = e, o = Rt(Va, n);
    return /* @__PURE__ */ h(Te.h2, { id: o.titleId, ...r, ref: t });
  }
);
rh.displayName = Va;
var oh = "DialogDescription", ih = m.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...r } = e, o = Rt(oh, n);
    return /* @__PURE__ */ h(Te.p, { id: o.descriptionId, ...r, ref: t });
  }
);
ih.displayName = oh;
var sh = "DialogClose", ah = m.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...r } = e, o = Rt(sh, n);
    return /* @__PURE__ */ h(
      Te.button,
      {
        type: "button",
        ...r,
        ref: t,
        onClick: ce(e.onClick, () => o.onOpenChange(!1))
      }
    );
  }
);
ah.displayName = sh;
function Ba(e) {
  return e ? "open" : "closed";
}
var ch = "DialogTitleWarning", [k$, lh] = Zy(ch, {
  contentName: bn,
  titleName: Va,
  docsSlug: "dialog"
}), O0 = ({ titleId: e }) => {
  const t = lh(ch), n = `\`${t.contentName}\` requires a \`${t.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${t.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${t.docsSlug}`;
  return m.useEffect(() => {
    e && (document.getElementById(e) || console.error(n));
  }, [n, e]), null;
}, P0 = "DialogDescriptionWarning", M0 = ({ contentRef: e, descriptionId: t }) => {
  const r = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${lh(P0).contentName}}.`;
  return m.useEffect(() => {
    var i;
    const o = (i = e.current) == null ? void 0 : i.getAttribute("aria-describedby");
    t && o && (document.getElementById(t) || console.warn(r));
  }, [r, e, t]), null;
}, uh = Yf, dh = Zf, fh = Qf, hh = eh, ph = th, mh = rh, k0 = ih, gh = ah, D0 = "_18thc6l4", $0 = "_18thc6l5 _14sdsl35 _14sdsl37 _14sdsl36", L0 = "_18thc6l6", F0 = "_18thc6l7", V0 = "_18thc6l8", B0 = "_18thc6l9";
function Sn({
  open: e,
  defaultOpen: t,
  onOpenChange: n,
  title: r,
  description: o,
  trigger: i,
  showCloseButton: s = !0,
  closeLabel: a = "Close",
  className: c,
  style: u,
  contentOptions: d,
  portalContainer: l,
  children: f
}) {
  const g = Se(), v = Ye();
  return /* @__PURE__ */ P(uh, { open: e, defaultOpen: t, onOpenChange: n, children: [
    i && /* @__PURE__ */ h(dh, { asChild: !0, children: i }),
    /* @__PURE__ */ P(fh, { container: l, children: [
      /* @__PURE__ */ h(hh, { className: D0, style: v, "data-theme": g }),
      /* @__PURE__ */ P(
        ph,
        {
          className: X($0, c),
          style: { ...v, ...u },
          "data-theme": g,
          ...o ? {} : { "aria-describedby": void 0 },
          ...d,
          children: [
            /* @__PURE__ */ P("div", { className: L0, children: [
              /* @__PURE__ */ h(mh, { className: F0, children: r }),
              s && /* @__PURE__ */ h(gh, { asChild: !0, children: /* @__PURE__ */ h(le, { kind: "icon", appearance: "quiet", "aria-label": a, children: /* @__PURE__ */ h(li, { "aria-hidden": "true", size: Ie.iconSize }) }) })
            ] }),
            o && /* @__PURE__ */ h(k0, { className: V0, children: o }),
            f && /* @__PURE__ */ h("div", { className: B0, children: f })
          ]
        }
      )
    ] })
  ] });
}
function Or(e) {
  if (typeof e == "string")
    return e;
  if (e && typeof e == "object") {
    const t = "reason" in e ? e.reason : void 0, n = "message" in e ? e.message : void 0;
    if (typeof t == "string" && t.length > 0)
      return t;
    if (typeof n == "string" && n.length > 0)
      return n;
  }
  return qe.t("error.zoom_video_sdk_generic");
}
function za() {
  const e = B((t) => t.setSessionState);
  return q(
    (t) => {
      const n = Or(t);
      e({ errorMessage: n, reason: n });
    },
    [e]
  );
}
function z0({
  recordingStatus: e
}) {
  const { client: t } = _e(), n = B((f) => f.participantState.currentUser), r = B((f) => f.sessionState.isLeaving), o = B((f) => f.setSessionState), i = za(), s = n !== null, a = !!(n != null && n.isHost || n != null && n.isManager), [c, u] = ne(!1);
  oe(() => {
    (!s || e === tt.Stopped) && u(!1);
  }, [s, e]);
  const d = q(() => {
    u(!0);
  }, []), l = q(async () => {
    if (!(!t || r)) {
      o({ isLeaving: !0, errorMessage: null, reason: null });
      try {
        await t.leave(!1);
      } catch (f) {
        i(f), o({ isLeaving: !1 });
      }
    }
  }, [t, r, i, o]);
  return {
    showCloudRecordingConsent: s && e === tt.Recording && !c && !a,
    stayInSession: d,
    leaveSession: l
  };
}
function j0({
  recordingStatus: e
}) {
  const { client: t } = _e(), n = B((p) => p.participantState.currentUser), r = za(), o = n == null ? void 0 : n.userId, i = n !== null, s = !!(n != null && n.isHost || n != null && n.isManager), [a, c] = ne(!1), [u, d] = ne(null), l = u !== null;
  oe(() => {
    (!i || e === tt.Stopped) && (c(!1), d(null));
  }, [i, e]), oe(() => {
    if (!t) return;
    const p = (b) => {
      const y = b.status, S = b.userId;
      if (i && !(S !== void 0 && S !== o) && !(y === tt.Ask && s)) {
        if (y === tt.Ask) {
          c(!0);
          return;
        }
        (y === tt.Accept || y === tt.Decline) && c(!1);
      }
    };
    return t.on("individual-recording-change", p), () => {
      t.off("individual-recording-change", p);
    };
  }, [t, o, i, s]);
  const f = q(
    async (p) => {
      if (l) return;
      const b = Un(t);
      if (b) {
        d(p);
        try {
          p === "accept" ? await b.acceptIndividualRecording() : await b.declineIndividualRecording(), c(!1);
        } catch (y) {
          r(y);
        } finally {
          d(null);
        }
      }
    },
    [t, l, r]
  ), g = q(
    () => f("accept"),
    [f]
  ), v = q(
    () => f("decline"),
    [f]
  );
  return {
    showIndividualRecordingConsent: i && !s && a,
    isResponding: l,
    respondingAction: u,
    acceptIndividualRecording: g,
    declineIndividualRecording: v
  };
}
const U0 = {
  recordingStatus: tt.Stopped,
  isCloudRecordingEnabled: !1
};
function H0(e) {
  try {
    return e.getCloudRecordingStatus();
  } catch {
    return tt.Stopped;
  }
}
function W0(e) {
  try {
    return e.canStartRecording();
  } catch {
    return !1;
  }
}
function K0(e) {
  const t = Un(e);
  return t ? {
    recordingStatus: H0(t),
    isCloudRecordingEnabled: W0(t)
  } : U0;
}
function ja() {
  const { client: e } = _e();
  B((o) => o.sessionState.connectionState);
  const t = K0(e), [n, r] = ne(t.recordingStatus);
  return oe(() => {
    if (!e) return;
    const o = (i) => {
      r(i);
    };
    return e.on("recording-change", o), () => {
      e.off("recording-change", o);
    };
  }, [e]), {
    recordingStatus: n,
    isCloudRecordingEnabled: t.isCloudRecordingEnabled
  };
}
var Zl = "vhnzwe0";
function q0() {
  const { t: e } = de(), t = B((f) => f.sessionState.isLeaving), { recordingStatus: n } = ja(), { showCloudRecordingConsent: r, stayInSession: o, leaveSession: i } = z0({
    recordingStatus: n
  }), {
    showIndividualRecordingConsent: s,
    isResponding: a,
    respondingAction: c,
    acceptIndividualRecording: u,
    declineIndividualRecording: d
  } = j0({ recordingStatus: n }), l = t || a;
  if (r)
    return /* @__PURE__ */ h(
      Sn,
      {
        open: !0,
        title: e("recording.consent_title"),
        description: e("recording.consent_message"),
        showCloseButton: !1,
        contentOptions: { id: "cloud-recording-consent-dialog" },
        children: /* @__PURE__ */ P("div", { className: Zl, children: [
          /* @__PURE__ */ h(le, { type: "button", onClick: () => void i(), disabled: l, "aria-busy": t, children: e("recording.consent_leave") }),
          /* @__PURE__ */ h(le, { tone: "accent", type: "button", onClick: o, disabled: l, children: e("recording.consent_stay") })
        ] })
      }
    );
  if (s) {
    const f = c === "decline", g = c === "accept";
    return /* @__PURE__ */ h(
      Sn,
      {
        open: !0,
        title: e("recording.individual_consent_title"),
        description: e("recording.individual_consent_message"),
        showCloseButton: !1,
        contentOptions: { id: "individual-recording-consent-dialog" },
        children: /* @__PURE__ */ P("div", { className: Zl, children: [
          /* @__PURE__ */ h(
            le,
            {
              type: "button",
              onClick: () => void d(),
              disabled: l,
              "aria-busy": f,
              children: e("recording.individual_consent_decline")
            }
          ),
          /* @__PURE__ */ h(
            le,
            {
              tone: "accent",
              type: "button",
              onClick: () => void u(),
              disabled: l,
              "aria-busy": g,
              children: e("recording.individual_consent_allow")
            }
          )
        ] })
      }
    );
  }
  return null;
}
function G0({ theme: e, children: t }) {
  return /* @__PURE__ */ h(Af.Provider, { value: e, children: t });
}
function Y0({ baseZIndex: e, children: t }) {
  return /* @__PURE__ */ h(Of.Provider, { value: e, children: t });
}
function D$({
  clientInstance: e,
  sessionOptions: t,
  children: n,
  theme: r = "dark",
  baseZIndex: o = 1e3,
  localAudioTrack: i
}) {
  const s = B((y) => y.setAudioState), a = B((y) => y.setVideoState), c = B((y) => y.sessionState.connectionState);
  oe(() => {
    qe.changeLanguage(ks);
  }, []);
  const u = he(() => bS(t), [t]), { audio: d, video: l, session: f, recording: g } = u;
  oe(() => {
    s({ noiseSuppression: (d == null ? void 0 : d.noiseSuppression) ?? !1 });
  }, [c, d == null ? void 0 : d.noiseSuppression, s]), oe(() => {
    const { virtualBackgroundImageList: y = [], defaultVirtualBackgroundImageId: S = "" } = (l == null ? void 0 : l.virtualBackground) ?? {};
    a({ virtualBackgroundImageList: y, vbImageId: S });
  }, [c, l == null ? void 0 : l.virtualBackground, a]), WS({ client: e }), zS({ client: e }), FS({ client: e }), RS({ client: e }), jS({ client: e }), US({ client: e }), HS({ client: e }), KS({ client: e }), qS({ client: e }), GS({ client: e });
  const v = he(
    () => ({
      client: e,
      sessionOptions: u,
      localAudioTrack: i
    }),
    [e, u, i]
  ), p = f == null ? void 0 : f.disableReclaimHostBanner, b = g == null ? void 0 : g.disableRecordingConsentDialog;
  return /* @__PURE__ */ h(qy, { i18n: qe, children: /* @__PURE__ */ h(vf.Provider, { value: v, children: /* @__PURE__ */ h(G0, { theme: r, children: /* @__PURE__ */ h(Y0, { baseZIndex: o, children: /* @__PURE__ */ P(zb, { swipeDirection: "up", children: [
    n,
    /* @__PURE__ */ h(vS, { theme: r, richColors: !0, containerAriaLabel: "Toolkit notifications" }),
    p ? null : /* @__PURE__ */ h(A_, {}),
    b ? null : /* @__PURE__ */ h(q0, {})
  ] }) }) }) }) });
}
var X0 = "_1dqp1bg0";
function $$({ children: e }) {
  const t = Ta(), n = { zIndex: t, [Ia]: t };
  return /* @__PURE__ */ h("div", { className: X0, style: n, children: e });
}
var Z0 = "_1j11ecm0 _1dqp1bg0", J0 = "_1j11ecm1", Q0 = m.createContext(void 0);
function vh(e) {
  const t = m.useContext(Q0);
  return e || t || "ltr";
}
const eC = ["top", "right", "bottom", "left"], nn = Math.min, ut = Math.max, Go = Math.round, _o = Math.floor, kt = (e) => ({
  x: e,
  y: e
}), tC = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function js(e, t, n) {
  return ut(e, nn(t, n));
}
function Ht(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function Wt(e) {
  return e.split("-")[0];
}
function cr(e) {
  return e.split("-")[1];
}
function Ua(e) {
  return e === "x" ? "y" : "x";
}
function Ha(e) {
  return e === "y" ? "height" : "width";
}
function Mt(e) {
  const t = e[0];
  return t === "t" || t === "b" ? "y" : "x";
}
function Wa(e) {
  return Ua(Mt(e));
}
function nC(e, t, n) {
  n === void 0 && (n = !1);
  const r = cr(e), o = Wa(e), i = Ha(o);
  let s = o === "x" ? r === (n ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
  return t.reference[i] > t.floating[i] && (s = Yo(s)), [s, Yo(s)];
}
function rC(e) {
  const t = Yo(e);
  return [Us(e), t, Us(t)];
}
function Us(e) {
  return e.includes("start") ? e.replace("start", "end") : e.replace("end", "start");
}
const Jl = ["left", "right"], Ql = ["right", "left"], oC = ["top", "bottom"], iC = ["bottom", "top"];
function sC(e, t, n) {
  switch (e) {
    case "top":
    case "bottom":
      return n ? t ? Ql : Jl : t ? Jl : Ql;
    case "left":
    case "right":
      return t ? oC : iC;
    default:
      return [];
  }
}
function aC(e, t, n, r) {
  const o = cr(e);
  let i = sC(Wt(e), n === "start", r);
  return o && (i = i.map((s) => s + "-" + o), t && (i = i.concat(i.map(Us)))), i;
}
function Yo(e) {
  const t = Wt(e);
  return tC[t] + e.slice(t.length);
}
function cC(e) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...e
  };
}
function yh(e) {
  return typeof e != "number" ? cC(e) : {
    top: e,
    right: e,
    bottom: e,
    left: e
  };
}
function Xo(e) {
  const {
    x: t,
    y: n,
    width: r,
    height: o
  } = e;
  return {
    width: r,
    height: o,
    top: n,
    left: t,
    right: t + r,
    bottom: n + o,
    x: t,
    y: n
  };
}
function eu(e, t, n) {
  let {
    reference: r,
    floating: o
  } = e;
  const i = Mt(t), s = Wa(t), a = Ha(s), c = Wt(t), u = i === "y", d = r.x + r.width / 2 - o.width / 2, l = r.y + r.height / 2 - o.height / 2, f = r[a] / 2 - o[a] / 2;
  let g;
  switch (c) {
    case "top":
      g = {
        x: d,
        y: r.y - o.height
      };
      break;
    case "bottom":
      g = {
        x: d,
        y: r.y + r.height
      };
      break;
    case "right":
      g = {
        x: r.x + r.width,
        y: l
      };
      break;
    case "left":
      g = {
        x: r.x - o.width,
        y: l
      };
      break;
    default:
      g = {
        x: r.x,
        y: r.y
      };
  }
  switch (cr(t)) {
    case "start":
      g[s] -= f * (n && u ? -1 : 1);
      break;
    case "end":
      g[s] += f * (n && u ? -1 : 1);
      break;
  }
  return g;
}
async function lC(e, t) {
  var n;
  t === void 0 && (t = {});
  const {
    x: r,
    y: o,
    platform: i,
    rects: s,
    elements: a,
    strategy: c
  } = e, {
    boundary: u = "clippingAncestors",
    rootBoundary: d = "viewport",
    elementContext: l = "floating",
    altBoundary: f = !1,
    padding: g = 0
  } = Ht(t, e), v = yh(g), b = a[f ? l === "floating" ? "reference" : "floating" : l], y = Xo(await i.getClippingRect({
    element: (n = await (i.isElement == null ? void 0 : i.isElement(b))) == null || n ? b : b.contextElement || await (i.getDocumentElement == null ? void 0 : i.getDocumentElement(a.floating)),
    boundary: u,
    rootBoundary: d,
    strategy: c
  })), S = l === "floating" ? {
    x: r,
    y: o,
    width: s.floating.width,
    height: s.floating.height
  } : s.reference, w = await (i.getOffsetParent == null ? void 0 : i.getOffsetParent(a.floating)), _ = await (i.isElement == null ? void 0 : i.isElement(w)) ? await (i.getScale == null ? void 0 : i.getScale(w)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, C = Xo(i.convertOffsetParentRelativeRectToViewportRelativeRect ? await i.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: S,
    offsetParent: w,
    strategy: c
  }) : S);
  return {
    top: (y.top - C.top + v.top) / _.y,
    bottom: (C.bottom - y.bottom + v.bottom) / _.y,
    left: (y.left - C.left + v.left) / _.x,
    right: (C.right - y.right + v.right) / _.x
  };
}
const uC = 50, dC = async (e, t, n) => {
  const {
    placement: r = "bottom",
    strategy: o = "absolute",
    middleware: i = [],
    platform: s
  } = n, a = s.detectOverflow ? s : {
    ...s,
    detectOverflow: lC
  }, c = await (s.isRTL == null ? void 0 : s.isRTL(t));
  let u = await s.getElementRects({
    reference: e,
    floating: t,
    strategy: o
  }), {
    x: d,
    y: l
  } = eu(u, r, c), f = r, g = 0;
  const v = {};
  for (let p = 0; p < i.length; p++) {
    const b = i[p];
    if (!b)
      continue;
    const {
      name: y,
      fn: S
    } = b, {
      x: w,
      y: _,
      data: C,
      reset: R
    } = await S({
      x: d,
      y: l,
      initialPlacement: r,
      placement: f,
      strategy: o,
      middlewareData: v,
      rects: u,
      platform: a,
      elements: {
        reference: e,
        floating: t
      }
    });
    d = w ?? d, l = _ ?? l, v[y] = {
      ...v[y],
      ...C
    }, R && g < uC && (g++, typeof R == "object" && (R.placement && (f = R.placement), R.rects && (u = R.rects === !0 ? await s.getElementRects({
      reference: e,
      floating: t,
      strategy: o
    }) : R.rects), {
      x: d,
      y: l
    } = eu(u, f, c)), p = -1);
  }
  return {
    x: d,
    y: l,
    placement: f,
    strategy: o,
    middlewareData: v
  };
}, fC = (e) => ({
  name: "arrow",
  options: e,
  async fn(t) {
    const {
      x: n,
      y: r,
      placement: o,
      rects: i,
      platform: s,
      elements: a,
      middlewareData: c
    } = t, {
      element: u,
      padding: d = 0
    } = Ht(e, t) || {};
    if (u == null)
      return {};
    const l = yh(d), f = {
      x: n,
      y: r
    }, g = Wa(o), v = Ha(g), p = await s.getDimensions(u), b = g === "y", y = b ? "top" : "left", S = b ? "bottom" : "right", w = b ? "clientHeight" : "clientWidth", _ = i.reference[v] + i.reference[g] - f[g] - i.floating[v], C = f[g] - i.reference[g], R = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(u));
    let x = R ? R[w] : 0;
    (!x || !await (s.isElement == null ? void 0 : s.isElement(R))) && (x = a.floating[w] || i.floating[v]);
    const E = _ / 2 - C / 2, I = x / 2 - p[v] / 2 - 1, M = nn(l[y], I), N = nn(l[S], I), $ = M, T = x - p[v] - N, O = x / 2 - p[v] / 2 + E, F = js($, O, T), A = !c.arrow && cr(o) != null && O !== F && i.reference[v] / 2 - (O < $ ? M : N) - p[v] / 2 < 0, D = A ? O < $ ? O - $ : O - T : 0;
    return {
      [g]: f[g] + D,
      data: {
        [g]: F,
        centerOffset: O - F - D,
        ...A && {
          alignmentOffset: D
        }
      },
      reset: A
    };
  }
}), hC = function(e) {
  return e === void 0 && (e = {}), {
    name: "flip",
    options: e,
    async fn(t) {
      var n, r;
      const {
        placement: o,
        middlewareData: i,
        rects: s,
        initialPlacement: a,
        platform: c,
        elements: u
      } = t, {
        mainAxis: d = !0,
        crossAxis: l = !0,
        fallbackPlacements: f,
        fallbackStrategy: g = "bestFit",
        fallbackAxisSideDirection: v = "none",
        flipAlignment: p = !0,
        ...b
      } = Ht(e, t);
      if ((n = i.arrow) != null && n.alignmentOffset)
        return {};
      const y = Wt(o), S = Mt(a), w = Wt(a) === a, _ = await (c.isRTL == null ? void 0 : c.isRTL(u.floating)), C = f || (w || !p ? [Yo(a)] : rC(a)), R = v !== "none";
      !f && R && C.push(...aC(a, p, v, _));
      const x = [a, ...C], E = await c.detectOverflow(t, b), I = [];
      let M = ((r = i.flip) == null ? void 0 : r.overflows) || [];
      if (d && I.push(E[y]), l) {
        const O = nC(o, s, _);
        I.push(E[O[0]], E[O[1]]);
      }
      if (M = [...M, {
        placement: o,
        overflows: I
      }], !I.every((O) => O <= 0)) {
        var N, $;
        const O = (((N = i.flip) == null ? void 0 : N.index) || 0) + 1, F = x[O];
        if (F && (!(l === "alignment" ? S !== Mt(F) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        M.every((V) => Mt(V.placement) === S ? V.overflows[0] > 0 : !0)))
          return {
            data: {
              index: O,
              overflows: M
            },
            reset: {
              placement: F
            }
          };
        let A = ($ = M.filter((D) => D.overflows[0] <= 0).sort((D, V) => D.overflows[1] - V.overflows[1])[0]) == null ? void 0 : $.placement;
        if (!A)
          switch (g) {
            case "bestFit": {
              var T;
              const D = (T = M.filter((V) => {
                if (R) {
                  const z = Mt(V.placement);
                  return z === S || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  z === "y";
                }
                return !0;
              }).map((V) => [V.placement, V.overflows.filter((z) => z > 0).reduce((z, L) => z + L, 0)]).sort((V, z) => V[1] - z[1])[0]) == null ? void 0 : T[0];
              D && (A = D);
              break;
            }
            case "initialPlacement":
              A = a;
              break;
          }
        if (o !== A)
          return {
            reset: {
              placement: A
            }
          };
      }
      return {};
    }
  };
};
function tu(e, t) {
  return {
    top: e.top - t.height,
    right: e.right - t.width,
    bottom: e.bottom - t.height,
    left: e.left - t.width
  };
}
function nu(e) {
  return eC.some((t) => e[t] >= 0);
}
const pC = function(e) {
  return e === void 0 && (e = {}), {
    name: "hide",
    options: e,
    async fn(t) {
      const {
        rects: n,
        platform: r
      } = t, {
        strategy: o = "referenceHidden",
        ...i
      } = Ht(e, t);
      switch (o) {
        case "referenceHidden": {
          const s = await r.detectOverflow(t, {
            ...i,
            elementContext: "reference"
          }), a = tu(s, n.reference);
          return {
            data: {
              referenceHiddenOffsets: a,
              referenceHidden: nu(a)
            }
          };
        }
        case "escaped": {
          const s = await r.detectOverflow(t, {
            ...i,
            altBoundary: !0
          }), a = tu(s, n.floating);
          return {
            data: {
              escapedOffsets: a,
              escaped: nu(a)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, bh = /* @__PURE__ */ new Set(["left", "top"]);
async function mC(e, t) {
  const {
    placement: n,
    platform: r,
    elements: o
  } = e, i = await (r.isRTL == null ? void 0 : r.isRTL(o.floating)), s = Wt(n), a = cr(n), c = Mt(n) === "y", u = bh.has(s) ? -1 : 1, d = i && c ? -1 : 1, l = Ht(t, e);
  let {
    mainAxis: f,
    crossAxis: g,
    alignmentAxis: v
  } = typeof l == "number" ? {
    mainAxis: l,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: l.mainAxis || 0,
    crossAxis: l.crossAxis || 0,
    alignmentAxis: l.alignmentAxis
  };
  return a && typeof v == "number" && (g = a === "end" ? v * -1 : v), c ? {
    x: g * d,
    y: f * u
  } : {
    x: f * u,
    y: g * d
  };
}
const gC = function(e) {
  return e === void 0 && (e = 0), {
    name: "offset",
    options: e,
    async fn(t) {
      var n, r;
      const {
        x: o,
        y: i,
        placement: s,
        middlewareData: a
      } = t, c = await mC(t, e);
      return s === ((n = a.offset) == null ? void 0 : n.placement) && (r = a.arrow) != null && r.alignmentOffset ? {} : {
        x: o + c.x,
        y: i + c.y,
        data: {
          ...c,
          placement: s
        }
      };
    }
  };
}, vC = function(e) {
  return e === void 0 && (e = {}), {
    name: "shift",
    options: e,
    async fn(t) {
      const {
        x: n,
        y: r,
        placement: o,
        platform: i
      } = t, {
        mainAxis: s = !0,
        crossAxis: a = !1,
        limiter: c = {
          fn: (y) => {
            let {
              x: S,
              y: w
            } = y;
            return {
              x: S,
              y: w
            };
          }
        },
        ...u
      } = Ht(e, t), d = {
        x: n,
        y: r
      }, l = await i.detectOverflow(t, u), f = Mt(Wt(o)), g = Ua(f);
      let v = d[g], p = d[f];
      if (s) {
        const y = g === "y" ? "top" : "left", S = g === "y" ? "bottom" : "right", w = v + l[y], _ = v - l[S];
        v = js(w, v, _);
      }
      if (a) {
        const y = f === "y" ? "top" : "left", S = f === "y" ? "bottom" : "right", w = p + l[y], _ = p - l[S];
        p = js(w, p, _);
      }
      const b = c.fn({
        ...t,
        [g]: v,
        [f]: p
      });
      return {
        ...b,
        data: {
          x: b.x - n,
          y: b.y - r,
          enabled: {
            [g]: s,
            [f]: a
          }
        }
      };
    }
  };
}, yC = function(e) {
  return e === void 0 && (e = {}), {
    options: e,
    fn(t) {
      const {
        x: n,
        y: r,
        placement: o,
        rects: i,
        middlewareData: s
      } = t, {
        offset: a = 0,
        mainAxis: c = !0,
        crossAxis: u = !0
      } = Ht(e, t), d = {
        x: n,
        y: r
      }, l = Mt(o), f = Ua(l);
      let g = d[f], v = d[l];
      const p = Ht(a, t), b = typeof p == "number" ? {
        mainAxis: p,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...p
      };
      if (c) {
        const w = f === "y" ? "height" : "width", _ = i.reference[f] - i.floating[w] + b.mainAxis, C = i.reference[f] + i.reference[w] - b.mainAxis;
        g < _ ? g = _ : g > C && (g = C);
      }
      if (u) {
        var y, S;
        const w = f === "y" ? "width" : "height", _ = bh.has(Wt(o)), C = i.reference[l] - i.floating[w] + (_ && ((y = s.offset) == null ? void 0 : y[l]) || 0) + (_ ? 0 : b.crossAxis), R = i.reference[l] + i.reference[w] + (_ ? 0 : ((S = s.offset) == null ? void 0 : S[l]) || 0) - (_ ? b.crossAxis : 0);
        v < C ? v = C : v > R && (v = R);
      }
      return {
        [f]: g,
        [l]: v
      };
    }
  };
}, bC = function(e) {
  return e === void 0 && (e = {}), {
    name: "size",
    options: e,
    async fn(t) {
      var n, r;
      const {
        placement: o,
        rects: i,
        platform: s,
        elements: a
      } = t, {
        apply: c = () => {
        },
        ...u
      } = Ht(e, t), d = await s.detectOverflow(t, u), l = Wt(o), f = cr(o), g = Mt(o) === "y", {
        width: v,
        height: p
      } = i.floating;
      let b, y;
      l === "top" || l === "bottom" ? (b = l, y = f === (await (s.isRTL == null ? void 0 : s.isRTL(a.floating)) ? "start" : "end") ? "left" : "right") : (y = l, b = f === "end" ? "top" : "bottom");
      const S = p - d.top - d.bottom, w = v - d.left - d.right, _ = nn(p - d[b], S), C = nn(v - d[y], w), R = !t.middlewareData.shift;
      let x = _, E = C;
      if ((n = t.middlewareData.shift) != null && n.enabled.x && (E = w), (r = t.middlewareData.shift) != null && r.enabled.y && (x = S), R && !f) {
        const M = ut(d.left, 0), N = ut(d.right, 0), $ = ut(d.top, 0), T = ut(d.bottom, 0);
        g ? E = v - 2 * (M !== 0 || N !== 0 ? M + N : ut(d.left, d.right)) : x = p - 2 * ($ !== 0 || T !== 0 ? $ + T : ut(d.top, d.bottom));
      }
      await c({
        ...t,
        availableWidth: E,
        availableHeight: x
      });
      const I = await s.getDimensions(a.floating);
      return v !== I.width || p !== I.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function pi() {
  return typeof window < "u";
}
function lr(e) {
  return Sh(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function dt(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function $t(e) {
  var t;
  return (t = (Sh(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function Sh(e) {
  return pi() ? e instanceof Node || e instanceof dt(e).Node : !1;
}
function Ct(e) {
  return pi() ? e instanceof Element || e instanceof dt(e).Element : !1;
}
function Gt(e) {
  return pi() ? e instanceof HTMLElement || e instanceof dt(e).HTMLElement : !1;
}
function ru(e) {
  return !pi() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof dt(e).ShadowRoot;
}
function qr(e) {
  const {
    overflow: t,
    overflowX: n,
    overflowY: r,
    display: o
  } = xt(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && o !== "inline" && o !== "contents";
}
function SC(e) {
  return /^(table|td|th)$/.test(lr(e));
}
function mi(e) {
  try {
    if (e.matches(":popover-open"))
      return !0;
  } catch {
  }
  try {
    return e.matches(":modal");
  } catch {
    return !1;
  }
}
const wC = /transform|translate|scale|rotate|perspective|filter/, _C = /paint|layout|strict|content/, hn = (e) => !!e && e !== "none";
let ts;
function Ka(e) {
  const t = Ct(e) ? xt(e) : e;
  return hn(t.transform) || hn(t.translate) || hn(t.scale) || hn(t.rotate) || hn(t.perspective) || !qa() && (hn(t.backdropFilter) || hn(t.filter)) || wC.test(t.willChange || "") || _C.test(t.contain || "");
}
function CC(e) {
  let t = rn(e);
  for (; Gt(t) && !Qn(t); ) {
    if (Ka(t))
      return t;
    if (mi(t))
      return null;
    t = rn(t);
  }
  return null;
}
function qa() {
  return ts == null && (ts = typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none")), ts;
}
function Qn(e) {
  return /^(html|body|#document)$/.test(lr(e));
}
function xt(e) {
  return dt(e).getComputedStyle(e);
}
function gi(e) {
  return Ct(e) ? {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  } : {
    scrollLeft: e.scrollX,
    scrollTop: e.scrollY
  };
}
function rn(e) {
  if (lr(e) === "html")
    return e;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    e.assignedSlot || // DOM Element detected.
    e.parentNode || // ShadowRoot detected.
    ru(e) && e.host || // Fallback.
    $t(e)
  );
  return ru(t) ? t.host : t;
}
function wh(e) {
  const t = rn(e);
  return Qn(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : Gt(t) && qr(t) ? t : wh(t);
}
function Mr(e, t, n) {
  var r;
  t === void 0 && (t = []), n === void 0 && (n = !0);
  const o = wh(e), i = o === ((r = e.ownerDocument) == null ? void 0 : r.body), s = dt(o);
  if (i) {
    const a = Hs(s);
    return t.concat(s, s.visualViewport || [], qr(o) ? o : [], a && n ? Mr(a) : []);
  } else
    return t.concat(o, Mr(o, [], n));
}
function Hs(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function _h(e) {
  const t = xt(e);
  let n = parseFloat(t.width) || 0, r = parseFloat(t.height) || 0;
  const o = Gt(e), i = o ? e.offsetWidth : n, s = o ? e.offsetHeight : r, a = Go(n) !== i || Go(r) !== s;
  return a && (n = i, r = s), {
    width: n,
    height: r,
    $: a
  };
}
function Ga(e) {
  return Ct(e) ? e : e.contextElement;
}
function Yn(e) {
  const t = Ga(e);
  if (!Gt(t))
    return kt(1);
  const n = t.getBoundingClientRect(), {
    width: r,
    height: o,
    $: i
  } = _h(t);
  let s = (i ? Go(n.width) : n.width) / r, a = (i ? Go(n.height) : n.height) / o;
  return (!s || !Number.isFinite(s)) && (s = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: s,
    y: a
  };
}
const xC = /* @__PURE__ */ kt(0);
function Ch(e) {
  const t = dt(e);
  return !qa() || !t.visualViewport ? xC : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function EC(e, t, n) {
  return t === void 0 && (t = !1), !n || t && n !== dt(e) ? !1 : t;
}
function wn(e, t, n, r) {
  t === void 0 && (t = !1), n === void 0 && (n = !1);
  const o = e.getBoundingClientRect(), i = Ga(e);
  let s = kt(1);
  t && (r ? Ct(r) && (s = Yn(r)) : s = Yn(e));
  const a = EC(i, n, r) ? Ch(i) : kt(0);
  let c = (o.left + a.x) / s.x, u = (o.top + a.y) / s.y, d = o.width / s.x, l = o.height / s.y;
  if (i) {
    const f = dt(i), g = r && Ct(r) ? dt(r) : r;
    let v = f, p = Hs(v);
    for (; p && r && g !== v; ) {
      const b = Yn(p), y = p.getBoundingClientRect(), S = xt(p), w = y.left + (p.clientLeft + parseFloat(S.paddingLeft)) * b.x, _ = y.top + (p.clientTop + parseFloat(S.paddingTop)) * b.y;
      c *= b.x, u *= b.y, d *= b.x, l *= b.y, c += w, u += _, v = dt(p), p = Hs(v);
    }
  }
  return Xo({
    width: d,
    height: l,
    x: c,
    y: u
  });
}
function vi(e, t) {
  const n = gi(e).scrollLeft;
  return t ? t.left + n : wn($t(e)).left + n;
}
function xh(e, t) {
  const n = e.getBoundingClientRect(), r = n.left + t.scrollLeft - vi(e, n), o = n.top + t.scrollTop;
  return {
    x: r,
    y: o
  };
}
function RC(e) {
  let {
    elements: t,
    rect: n,
    offsetParent: r,
    strategy: o
  } = e;
  const i = o === "fixed", s = $t(r), a = t ? mi(t.floating) : !1;
  if (r === s || a && i)
    return n;
  let c = {
    scrollLeft: 0,
    scrollTop: 0
  }, u = kt(1);
  const d = kt(0), l = Gt(r);
  if ((l || !l && !i) && ((lr(r) !== "body" || qr(s)) && (c = gi(r)), l)) {
    const g = wn(r);
    u = Yn(r), d.x = g.x + r.clientLeft, d.y = g.y + r.clientTop;
  }
  const f = s && !l && !i ? xh(s, c) : kt(0);
  return {
    width: n.width * u.x,
    height: n.height * u.y,
    x: n.x * u.x - c.scrollLeft * u.x + d.x + f.x,
    y: n.y * u.y - c.scrollTop * u.y + d.y + f.y
  };
}
function IC(e) {
  return Array.from(e.getClientRects());
}
function TC(e) {
  const t = $t(e), n = gi(e), r = e.ownerDocument.body, o = ut(t.scrollWidth, t.clientWidth, r.scrollWidth, r.clientWidth), i = ut(t.scrollHeight, t.clientHeight, r.scrollHeight, r.clientHeight);
  let s = -n.scrollLeft + vi(e);
  const a = -n.scrollTop;
  return xt(r).direction === "rtl" && (s += ut(t.clientWidth, r.clientWidth) - o), {
    width: o,
    height: i,
    x: s,
    y: a
  };
}
const ou = 25;
function NC(e, t) {
  const n = dt(e), r = $t(e), o = n.visualViewport;
  let i = r.clientWidth, s = r.clientHeight, a = 0, c = 0;
  if (o) {
    i = o.width, s = o.height;
    const d = qa();
    (!d || d && t === "fixed") && (a = o.offsetLeft, c = o.offsetTop);
  }
  const u = vi(r);
  if (u <= 0) {
    const d = r.ownerDocument, l = d.body, f = getComputedStyle(l), g = d.compatMode === "CSS1Compat" && parseFloat(f.marginLeft) + parseFloat(f.marginRight) || 0, v = Math.abs(r.clientWidth - l.clientWidth - g);
    v <= ou && (i -= v);
  } else u <= ou && (i += u);
  return {
    width: i,
    height: s,
    x: a,
    y: c
  };
}
function AC(e, t) {
  const n = wn(e, !0, t === "fixed"), r = n.top + e.clientTop, o = n.left + e.clientLeft, i = Gt(e) ? Yn(e) : kt(1), s = e.clientWidth * i.x, a = e.clientHeight * i.y, c = o * i.x, u = r * i.y;
  return {
    width: s,
    height: a,
    x: c,
    y: u
  };
}
function iu(e, t, n) {
  let r;
  if (t === "viewport")
    r = NC(e, n);
  else if (t === "document")
    r = TC($t(e));
  else if (Ct(t))
    r = AC(t, n);
  else {
    const o = Ch(e);
    r = {
      x: t.x - o.x,
      y: t.y - o.y,
      width: t.width,
      height: t.height
    };
  }
  return Xo(r);
}
function Eh(e, t) {
  const n = rn(e);
  return n === t || !Ct(n) || Qn(n) ? !1 : xt(n).position === "fixed" || Eh(n, t);
}
function OC(e, t) {
  const n = t.get(e);
  if (n)
    return n;
  let r = Mr(e, [], !1).filter((a) => Ct(a) && lr(a) !== "body"), o = null;
  const i = xt(e).position === "fixed";
  let s = i ? rn(e) : e;
  for (; Ct(s) && !Qn(s); ) {
    const a = xt(s), c = Ka(s);
    !c && a.position === "fixed" && (o = null), (i ? !c && !o : !c && a.position === "static" && !!o && (o.position === "absolute" || o.position === "fixed") || qr(s) && !c && Eh(e, s)) ? r = r.filter((d) => d !== s) : o = a, s = rn(s);
  }
  return t.set(e, r), r;
}
function PC(e) {
  let {
    element: t,
    boundary: n,
    rootBoundary: r,
    strategy: o
  } = e;
  const s = [...n === "clippingAncestors" ? mi(t) ? [] : OC(t, this._c) : [].concat(n), r], a = iu(t, s[0], o);
  let c = a.top, u = a.right, d = a.bottom, l = a.left;
  for (let f = 1; f < s.length; f++) {
    const g = iu(t, s[f], o);
    c = ut(g.top, c), u = nn(g.right, u), d = nn(g.bottom, d), l = ut(g.left, l);
  }
  return {
    width: u - l,
    height: d - c,
    x: l,
    y: c
  };
}
function MC(e) {
  const {
    width: t,
    height: n
  } = _h(e);
  return {
    width: t,
    height: n
  };
}
function kC(e, t, n) {
  const r = Gt(t), o = $t(t), i = n === "fixed", s = wn(e, !0, i, t);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const c = kt(0);
  function u() {
    c.x = vi(o);
  }
  if (r || !r && !i)
    if ((lr(t) !== "body" || qr(o)) && (a = gi(t)), r) {
      const g = wn(t, !0, i, t);
      c.x = g.x + t.clientLeft, c.y = g.y + t.clientTop;
    } else o && u();
  i && !r && o && u();
  const d = o && !r && !i ? xh(o, a) : kt(0), l = s.left + a.scrollLeft - c.x - d.x, f = s.top + a.scrollTop - c.y - d.y;
  return {
    x: l,
    y: f,
    width: s.width,
    height: s.height
  };
}
function ns(e) {
  return xt(e).position === "static";
}
function su(e, t) {
  if (!Gt(e) || xt(e).position === "fixed")
    return null;
  if (t)
    return t(e);
  let n = e.offsetParent;
  return $t(e) === n && (n = n.ownerDocument.body), n;
}
function Rh(e, t) {
  const n = dt(e);
  if (mi(e))
    return n;
  if (!Gt(e)) {
    let o = rn(e);
    for (; o && !Qn(o); ) {
      if (Ct(o) && !ns(o))
        return o;
      o = rn(o);
    }
    return n;
  }
  let r = su(e, t);
  for (; r && SC(r) && ns(r); )
    r = su(r, t);
  return r && Qn(r) && ns(r) && !Ka(r) ? n : r || CC(e) || n;
}
const DC = async function(e) {
  const t = this.getOffsetParent || Rh, n = this.getDimensions, r = await n(e.floating);
  return {
    reference: kC(e.reference, await t(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: r.width,
      height: r.height
    }
  };
};
function $C(e) {
  return xt(e).direction === "rtl";
}
const LC = {
  convertOffsetParentRelativeRectToViewportRelativeRect: RC,
  getDocumentElement: $t,
  getClippingRect: PC,
  getOffsetParent: Rh,
  getElementRects: DC,
  getClientRects: IC,
  getDimensions: MC,
  getScale: Yn,
  isElement: Ct,
  isRTL: $C
};
function Ih(e, t) {
  return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function FC(e, t) {
  let n = null, r;
  const o = $t(e);
  function i() {
    var a;
    clearTimeout(r), (a = n) == null || a.disconnect(), n = null;
  }
  function s(a, c) {
    a === void 0 && (a = !1), c === void 0 && (c = 1), i();
    const u = e.getBoundingClientRect(), {
      left: d,
      top: l,
      width: f,
      height: g
    } = u;
    if (a || t(), !f || !g)
      return;
    const v = _o(l), p = _o(o.clientWidth - (d + f)), b = _o(o.clientHeight - (l + g)), y = _o(d), w = {
      rootMargin: -v + "px " + -p + "px " + -b + "px " + -y + "px",
      threshold: ut(0, nn(1, c)) || 1
    };
    let _ = !0;
    function C(R) {
      const x = R[0].intersectionRatio;
      if (x !== c) {
        if (!_)
          return s();
        x ? s(!1, x) : r = setTimeout(() => {
          s(!1, 1e-7);
        }, 1e3);
      }
      x === 1 && !Ih(u, e.getBoundingClientRect()) && s(), _ = !1;
    }
    try {
      n = new IntersectionObserver(C, {
        ...w,
        // Handle <iframe>s
        root: o.ownerDocument
      });
    } catch {
      n = new IntersectionObserver(C, w);
    }
    n.observe(e);
  }
  return s(!0), i;
}
function Th(e, t, n, r) {
  r === void 0 && (r = {});
  const {
    ancestorScroll: o = !0,
    ancestorResize: i = !0,
    elementResize: s = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: c = !1
  } = r, u = Ga(e), d = o || i ? [...u ? Mr(u) : [], ...t ? Mr(t) : []] : [];
  d.forEach((y) => {
    o && y.addEventListener("scroll", n, {
      passive: !0
    }), i && y.addEventListener("resize", n);
  });
  const l = u && a ? FC(u, n) : null;
  let f = -1, g = null;
  s && (g = new ResizeObserver((y) => {
    let [S] = y;
    S && S.target === u && g && t && (g.unobserve(t), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
      var w;
      (w = g) == null || w.observe(t);
    })), n();
  }), u && !c && g.observe(u), t && g.observe(t));
  let v, p = c ? wn(e) : null;
  c && b();
  function b() {
    const y = wn(e);
    p && !Ih(p, y) && n(), p = y, v = requestAnimationFrame(b);
  }
  return n(), () => {
    var y;
    d.forEach((S) => {
      o && S.removeEventListener("scroll", n), i && S.removeEventListener("resize", n);
    }), l == null || l(), (y = g) == null || y.disconnect(), g = null, c && cancelAnimationFrame(v);
  };
}
const VC = gC, BC = vC, zC = hC, jC = bC, UC = pC, au = fC, HC = yC, WC = (e, t, n) => {
  const r = /* @__PURE__ */ new Map(), o = {
    platform: LC,
    ...n
  }, i = {
    ...o.platform,
    _c: r
  };
  return dC(e, t, {
    ...o,
    platform: i
  });
};
var KC = typeof document < "u", qC = function() {
}, Bo = KC ? jt : qC;
function Zo(e, t) {
  if (e === t)
    return !0;
  if (typeof e != typeof t)
    return !1;
  if (typeof e == "function" && e.toString() === t.toString())
    return !0;
  let n, r, o;
  if (e && t && typeof e == "object") {
    if (Array.isArray(e)) {
      if (n = e.length, n !== t.length) return !1;
      for (r = n; r-- !== 0; )
        if (!Zo(e[r], t[r]))
          return !1;
      return !0;
    }
    if (o = Object.keys(e), n = o.length, n !== Object.keys(t).length)
      return !1;
    for (r = n; r-- !== 0; )
      if (!{}.hasOwnProperty.call(t, o[r]))
        return !1;
    for (r = n; r-- !== 0; ) {
      const i = o[r];
      if (!(i === "_owner" && e.$$typeof) && !Zo(e[i], t[i]))
        return !1;
    }
    return !0;
  }
  return e !== e && t !== t;
}
function Nh(e) {
  return typeof window > "u" ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function cu(e, t) {
  const n = Nh(e);
  return Math.round(t * n) / n;
}
function rs(e) {
  const t = m.useRef(e);
  return Bo(() => {
    t.current = e;
  }), t;
}
function Ah(e) {
  e === void 0 && (e = {});
  const {
    placement: t = "bottom",
    strategy: n = "absolute",
    middleware: r = [],
    platform: o,
    elements: {
      reference: i,
      floating: s
    } = {},
    transform: a = !0,
    whileElementsMounted: c,
    open: u
  } = e, [d, l] = m.useState({
    x: 0,
    y: 0,
    strategy: n,
    placement: t,
    middlewareData: {},
    isPositioned: !1
  }), [f, g] = m.useState(r);
  Zo(f, r) || g(r);
  const [v, p] = m.useState(null), [b, y] = m.useState(null), S = m.useCallback((V) => {
    V !== R.current && (R.current = V, p(V));
  }, []), w = m.useCallback((V) => {
    V !== x.current && (x.current = V, y(V));
  }, []), _ = i || v, C = s || b, R = m.useRef(null), x = m.useRef(null), E = m.useRef(d), I = c != null, M = rs(c), N = rs(o), $ = rs(u), T = m.useCallback(() => {
    if (!R.current || !x.current)
      return;
    const V = {
      placement: t,
      strategy: n,
      middleware: f
    };
    N.current && (V.platform = N.current), WC(R.current, x.current, V).then((z) => {
      const L = {
        ...z,
        // The floating element's position may be recomputed while it's closed
        // but still mounted (such as when transitioning out). To ensure
        // `isPositioned` will be `false` initially on the next open, avoid
        // setting it to `true` when `open === false` (must be specified).
        isPositioned: $.current !== !1
      };
      O.current && !Zo(E.current, L) && (E.current = L, Rn.flushSync(() => {
        l(L);
      }));
    });
  }, [f, t, n, N, $]);
  Bo(() => {
    u === !1 && E.current.isPositioned && (E.current.isPositioned = !1, l((V) => ({
      ...V,
      isPositioned: !1
    })));
  }, [u]);
  const O = m.useRef(!1);
  Bo(() => (O.current = !0, () => {
    O.current = !1;
  }), []), Bo(() => {
    if (_ && (R.current = _), C && (x.current = C), _ && C) {
      if (M.current)
        return M.current(_, C, T);
      T();
    }
  }, [_, C, T, M, I]);
  const F = m.useMemo(() => ({
    reference: R,
    floating: x,
    setReference: S,
    setFloating: w
  }), [S, w]), A = m.useMemo(() => ({
    reference: _,
    floating: C
  }), [_, C]), D = m.useMemo(() => {
    const V = {
      position: n,
      left: 0,
      top: 0
    };
    if (!A.floating)
      return V;
    const z = cu(A.floating, d.x), L = cu(A.floating, d.y);
    return a ? {
      ...V,
      transform: "translate(" + z + "px, " + L + "px)",
      ...Nh(A.floating) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: n,
      left: z,
      top: L
    };
  }, [n, a, A.floating, d.x, d.y]);
  return m.useMemo(() => ({
    ...d,
    update: T,
    refs: F,
    elements: A,
    floatingStyles: D
  }), [d, T, F, A, D]);
}
const GC = (e) => {
  function t(n) {
    return {}.hasOwnProperty.call(n, "current");
  }
  return {
    name: "arrow",
    options: e,
    fn(n) {
      const {
        element: r,
        padding: o
      } = typeof e == "function" ? e(n) : e;
      return r && t(r) ? r.current != null ? au({
        element: r.current,
        padding: o
      }).fn(n) : {} : r ? au({
        element: r,
        padding: o
      }).fn(n) : {};
    }
  };
}, Oh = (e, t) => {
  const n = VC(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, Ph = (e, t) => {
  const n = BC(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, Mh = (e, t) => ({
  fn: HC(e).fn,
  options: [e, t]
}), kh = (e, t) => {
  const n = zC(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, Dh = (e, t) => {
  const n = jC(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, $h = (e, t) => {
  const n = UC(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, Lh = (e, t) => {
  const n = GC(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
};
var YC = "Arrow", Fh = m.forwardRef((e, t) => {
  const { children: n, width: r = 10, height: o = 5, ...i } = e;
  return /* @__PURE__ */ h(
    Te.svg,
    {
      ...i,
      ref: t,
      width: r,
      height: o,
      viewBox: "0 0 30 10",
      preserveAspectRatio: "none",
      children: e.asChild ? n : /* @__PURE__ */ h("polygon", { points: "0,0 30,0 15,10" })
    }
  );
});
Fh.displayName = YC;
var XC = Fh;
function ZC(e) {
  const [t, n] = m.useState(void 0);
  return Ut(() => {
    if (e) {
      n({ width: e.offsetWidth, height: e.offsetHeight });
      const r = new ResizeObserver((o) => {
        if (!Array.isArray(o) || !o.length)
          return;
        const i = o[0];
        let s, a;
        if ("borderBoxSize" in i) {
          const c = i.borderBoxSize, u = Array.isArray(c) ? c[0] : c;
          s = u.inlineSize, a = u.blockSize;
        } else
          s = e.offsetWidth, a = e.offsetHeight;
        n({ width: s, height: a });
      });
      return r.observe(e, { box: "border-box" }), () => r.unobserve(e);
    } else
      n(void 0);
  }, [e]), t;
}
var Ya = "Popper", [Vh, yi] = sn(Ya), [JC, Bh] = Vh(Ya), zh = (e) => {
  const { __scopePopper: t, children: n } = e, [r, o] = m.useState(null);
  return /* @__PURE__ */ h(JC, { scope: t, anchor: r, onAnchorChange: o, children: n });
};
zh.displayName = Ya;
var jh = "PopperAnchor", Uh = m.forwardRef(
  (e, t) => {
    const { __scopePopper: n, virtualRef: r, ...o } = e, i = Bh(jh, n), s = m.useRef(null), a = ze(t, s), c = m.useRef(null);
    return m.useEffect(() => {
      const u = c.current;
      c.current = (r == null ? void 0 : r.current) || s.current, u !== c.current && i.onAnchorChange(c.current);
    }), r ? null : /* @__PURE__ */ h(Te.div, { ...o, ref: a });
  }
);
Uh.displayName = jh;
var Xa = "PopperContent", [QC, ex] = Vh(Xa), Hh = m.forwardRef(
  (e, t) => {
    var U, H, Q, ee, ie, W;
    const {
      __scopePopper: n,
      side: r = "bottom",
      sideOffset: o = 0,
      align: i = "center",
      alignOffset: s = 0,
      arrowPadding: a = 0,
      avoidCollisions: c = !0,
      collisionBoundary: u = [],
      collisionPadding: d = 0,
      sticky: l = "partial",
      hideWhenDetached: f = !1,
      updatePositionStrategy: g = "optimized",
      onPlaced: v,
      ...p
    } = e, b = Bh(Xa, n), [y, S] = m.useState(null), w = ze(t, (ge) => S(ge)), [_, C] = m.useState(null), R = ZC(_), x = (R == null ? void 0 : R.width) ?? 0, E = (R == null ? void 0 : R.height) ?? 0, I = r + (i !== "center" ? "-" + i : ""), M = typeof d == "number" ? d : { top: 0, right: 0, bottom: 0, left: 0, ...d }, N = Array.isArray(u) ? u : [u], $ = N.length > 0, T = {
      padding: M,
      boundary: N.filter(nx),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: $
    }, { refs: O, floatingStyles: F, placement: A, isPositioned: D, middlewareData: V } = Ah({
      // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
      strategy: "fixed",
      placement: I,
      whileElementsMounted: (...ge) => Th(...ge, {
        animationFrame: g === "always"
      }),
      elements: {
        reference: b.anchor
      },
      middleware: [
        Oh({ mainAxis: o + E, alignmentAxis: s }),
        c && Ph({
          mainAxis: !0,
          crossAxis: !1,
          limiter: l === "partial" ? Mh() : void 0,
          ...T
        }),
        c && kh({ ...T }),
        Dh({
          ...T,
          apply: ({ elements: ge, rects: re, availableWidth: Y, availableHeight: ye }) => {
            const { width: De, height: at } = re.reference, Oe = ge.floating.style;
            Oe.setProperty("--radix-popper-available-width", `${Y}px`), Oe.setProperty("--radix-popper-available-height", `${ye}px`), Oe.setProperty("--radix-popper-anchor-width", `${De}px`), Oe.setProperty("--radix-popper-anchor-height", `${at}px`);
          }
        }),
        _ && Lh({ element: _, padding: a }),
        rx({ arrowWidth: x, arrowHeight: E }),
        f && $h({ strategy: "referenceHidden", ...T })
      ]
    }), [z, L] = qh(A), j = it(v);
    Ut(() => {
      D && (j == null || j());
    }, [D, j]);
    const Z = (U = V.arrow) == null ? void 0 : U.x, K = (H = V.arrow) == null ? void 0 : H.y, G = ((Q = V.arrow) == null ? void 0 : Q.centerOffset) !== 0, [J, te] = m.useState();
    return Ut(() => {
      y && te(window.getComputedStyle(y).zIndex);
    }, [y]), /* @__PURE__ */ h(
      "div",
      {
        ref: O.setFloating,
        "data-radix-popper-content-wrapper": "",
        style: {
          ...F,
          transform: D ? F.transform : "translate(0, -200%)",
          // keep off the page when measuring
          minWidth: "max-content",
          zIndex: J,
          "--radix-popper-transform-origin": [
            (ee = V.transformOrigin) == null ? void 0 : ee.x,
            (ie = V.transformOrigin) == null ? void 0 : ie.y
          ].join(" "),
          // hide the content if using the hide middleware and should be hidden
          // set visibility to hidden and disable pointer events so the UI behaves
          // as if the PopperContent isn't there at all
          ...((W = V.hide) == null ? void 0 : W.referenceHidden) && {
            visibility: "hidden",
            pointerEvents: "none"
          }
        },
        dir: e.dir,
        children: /* @__PURE__ */ h(
          QC,
          {
            scope: n,
            placedSide: z,
            onArrowChange: C,
            arrowX: Z,
            arrowY: K,
            shouldHideArrow: G,
            children: /* @__PURE__ */ h(
              Te.div,
              {
                "data-side": z,
                "data-align": L,
                ...p,
                ref: w,
                style: {
                  ...p.style,
                  // if the PopperContent hasn't been placed yet (not all measurements done)
                  // we prevent animations so that users's animation don't kick in too early referring wrong sides
                  animation: D ? void 0 : "none"
                }
              }
            )
          }
        )
      }
    );
  }
);
Hh.displayName = Xa;
var Wh = "PopperArrow", tx = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
}, Kh = m.forwardRef(function(t, n) {
  const { __scopePopper: r, ...o } = t, i = ex(Wh, r), s = tx[i.placedSide];
  return (
    // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
    // doesn't report size as we'd expect on SVG elements.
    // it reports their bounding box which is effectively the largest path inside the SVG.
    /* @__PURE__ */ h(
      "span",
      {
        ref: i.onArrowChange,
        style: {
          position: "absolute",
          left: i.arrowX,
          top: i.arrowY,
          [s]: 0,
          transformOrigin: {
            top: "",
            right: "0 0",
            bottom: "center 0",
            left: "100% 0"
          }[i.placedSide],
          transform: {
            top: "translateY(100%)",
            right: "translateY(50%) rotate(90deg) translateX(-50%)",
            bottom: "rotate(180deg)",
            left: "translateY(50%) rotate(-90deg) translateX(50%)"
          }[i.placedSide],
          visibility: i.shouldHideArrow ? "hidden" : void 0
        },
        children: /* @__PURE__ */ h(
          XC,
          {
            ...o,
            ref: n,
            style: {
              ...o.style,
              // ensures the element can be measured correctly (mostly for if SVG)
              display: "block"
            }
          }
        )
      }
    )
  );
});
Kh.displayName = Wh;
function nx(e) {
  return e !== null;
}
var rx = (e) => ({
  name: "transformOrigin",
  options: e,
  fn(t) {
    var b, y, S;
    const { placement: n, rects: r, middlewareData: o } = t, s = ((b = o.arrow) == null ? void 0 : b.centerOffset) !== 0, a = s ? 0 : e.arrowWidth, c = s ? 0 : e.arrowHeight, [u, d] = qh(n), l = { start: "0%", center: "50%", end: "100%" }[d], f = (((y = o.arrow) == null ? void 0 : y.x) ?? 0) + a / 2, g = (((S = o.arrow) == null ? void 0 : S.y) ?? 0) + c / 2;
    let v = "", p = "";
    return u === "bottom" ? (v = s ? l : `${f}px`, p = `${-c}px`) : u === "top" ? (v = s ? l : `${f}px`, p = `${r.floating.height + c}px`) : u === "right" ? (v = `${-c}px`, p = s ? l : `${g}px`) : u === "left" && (v = `${r.floating.width + c}px`, p = s ? l : `${g}px`), { data: { x: v, y: p } };
  }
});
function qh(e) {
  const [t, n = "center"] = e.split("-");
  return [t, n];
}
var Za = zh, Ja = Uh, Gh = Hh, Yh = Kh, os = "rovingFocusGroup.onEntryFocus", ox = { bubbles: !1, cancelable: !0 }, Gr = "RovingFocusGroup", [Ws, Xh, ix] = wa(Gr), [sx, Zh] = sn(
  Gr,
  [ix]
), [ax, cx] = sx(Gr), Jh = m.forwardRef(
  (e, t) => /* @__PURE__ */ h(Ws.Provider, { scope: e.__scopeRovingFocusGroup, children: /* @__PURE__ */ h(Ws.Slot, { scope: e.__scopeRovingFocusGroup, children: /* @__PURE__ */ h(lx, { ...e, ref: t }) }) })
);
Jh.displayName = Gr;
var lx = m.forwardRef((e, t) => {
  const {
    __scopeRovingFocusGroup: n,
    orientation: r,
    loop: o = !1,
    dir: i,
    currentTabStopId: s,
    defaultCurrentTabStopId: a,
    onCurrentTabStopIdChange: c,
    onEntryFocus: u,
    preventScrollOnEntryFocus: d = !1,
    ...l
  } = e, f = m.useRef(null), g = ze(t, f), v = vh(i), [p, b] = ir({
    prop: s,
    defaultProp: a ?? null,
    onChange: c,
    caller: Gr
  }), [y, S] = m.useState(!1), w = it(u), _ = Xh(n), C = m.useRef(!1), [R, x] = m.useState(0);
  return m.useEffect(() => {
    const E = f.current;
    if (E)
      return E.addEventListener(os, w), () => E.removeEventListener(os, w);
  }, [w]), /* @__PURE__ */ h(
    ax,
    {
      scope: n,
      orientation: r,
      dir: v,
      loop: o,
      currentTabStopId: p,
      onItemFocus: m.useCallback(
        (E) => b(E),
        [b]
      ),
      onItemShiftTab: m.useCallback(() => S(!0), []),
      onFocusableItemAdd: m.useCallback(
        () => x((E) => E + 1),
        []
      ),
      onFocusableItemRemove: m.useCallback(
        () => x((E) => E - 1),
        []
      ),
      children: /* @__PURE__ */ h(
        Te.div,
        {
          tabIndex: y || R === 0 ? -1 : 0,
          "data-orientation": r,
          ...l,
          ref: g,
          style: { outline: "none", ...e.style },
          onMouseDown: ce(e.onMouseDown, () => {
            C.current = !0;
          }),
          onFocus: ce(e.onFocus, (E) => {
            const I = !C.current;
            if (E.target === E.currentTarget && I && !y) {
              const M = new CustomEvent(os, ox);
              if (E.currentTarget.dispatchEvent(M), !M.defaultPrevented) {
                const N = _().filter((A) => A.focusable), $ = N.find((A) => A.active), T = N.find((A) => A.id === p), F = [$, T, ...N].filter(
                  Boolean
                ).map((A) => A.ref.current);
                tp(F, d);
              }
            }
            C.current = !1;
          }),
          onBlur: ce(e.onBlur, () => S(!1))
        }
      )
    }
  );
}), Qh = "RovingFocusGroupItem", ep = m.forwardRef(
  (e, t) => {
    const {
      __scopeRovingFocusGroup: n,
      focusable: r = !0,
      active: o = !1,
      tabStopId: i,
      children: s,
      ...a
    } = e, c = Bt(), u = i || c, d = cx(Qh, n), l = d.currentTabStopId === u, f = Xh(n), { onFocusableItemAdd: g, onFocusableItemRemove: v, currentTabStopId: p } = d;
    return m.useEffect(() => {
      if (r)
        return g(), () => v();
    }, [r, g, v]), /* @__PURE__ */ h(
      Ws.ItemSlot,
      {
        scope: n,
        id: u,
        focusable: r,
        active: o,
        children: /* @__PURE__ */ h(
          Te.span,
          {
            tabIndex: l ? 0 : -1,
            "data-orientation": d.orientation,
            ...a,
            ref: t,
            onMouseDown: ce(e.onMouseDown, (b) => {
              r ? d.onItemFocus(u) : b.preventDefault();
            }),
            onFocus: ce(e.onFocus, () => d.onItemFocus(u)),
            onKeyDown: ce(e.onKeyDown, (b) => {
              if (b.key === "Tab" && b.shiftKey) {
                d.onItemShiftTab();
                return;
              }
              if (b.target !== b.currentTarget) return;
              const y = fx(b, d.orientation, d.dir);
              if (y !== void 0) {
                if (b.metaKey || b.ctrlKey || b.altKey || b.shiftKey) return;
                b.preventDefault();
                let w = f().filter((_) => _.focusable).map((_) => _.ref.current);
                if (y === "last") w.reverse();
                else if (y === "prev" || y === "next") {
                  y === "prev" && w.reverse();
                  const _ = w.indexOf(b.currentTarget);
                  w = d.loop ? hx(w, _ + 1) : w.slice(_ + 1);
                }
                setTimeout(() => tp(w));
              }
            }),
            children: typeof s == "function" ? s({ isCurrentTabStop: l, hasTabStop: p != null }) : s
          }
        )
      }
    );
  }
);
ep.displayName = Qh;
var ux = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function dx(e, t) {
  return t !== "rtl" ? e : e === "ArrowLeft" ? "ArrowRight" : e === "ArrowRight" ? "ArrowLeft" : e;
}
function fx(e, t, n) {
  const r = dx(e.key, n);
  if (!(t === "vertical" && ["ArrowLeft", "ArrowRight"].includes(r)) && !(t === "horizontal" && ["ArrowUp", "ArrowDown"].includes(r)))
    return ux[r];
}
function tp(e, t = !1) {
  const n = document.activeElement;
  for (const r of e)
    if (r === n || (r.focus({ preventScroll: t }), document.activeElement !== n)) return;
}
function hx(e, t) {
  return e.map((n, r) => e[(t + r) % e.length]);
}
var px = Jh, mx = ep, Ks = ["Enter", " "], gx = ["ArrowDown", "PageUp", "Home"], np = ["ArrowUp", "PageDown", "End"], vx = [...gx, ...np], yx = {
  ltr: [...Ks, "ArrowRight"],
  rtl: [...Ks, "ArrowLeft"]
}, bx = {
  ltr: ["ArrowLeft"],
  rtl: ["ArrowRight"]
}, Yr = "Menu", [kr, Sx, wx] = wa(Yr), [Nn, rp] = sn(Yr, [
  wx,
  yi,
  Zh
]), Xr = yi(), op = Zh(), [ip, an] = Nn(Yr), [_x, Zr] = Nn(Yr), sp = (e) => {
  const { __scopeMenu: t, open: n = !1, children: r, dir: o, onOpenChange: i, modal: s = !0 } = e, a = Xr(t), [c, u] = m.useState(null), d = m.useRef(!1), l = it(i), f = vh(o);
  return m.useEffect(() => {
    const g = () => {
      d.current = !0, document.addEventListener("pointerdown", v, { capture: !0, once: !0 }), document.addEventListener("pointermove", v, { capture: !0, once: !0 });
    }, v = () => d.current = !1;
    return document.addEventListener("keydown", g, { capture: !0 }), () => {
      document.removeEventListener("keydown", g, { capture: !0 }), document.removeEventListener("pointerdown", v, { capture: !0 }), document.removeEventListener("pointermove", v, { capture: !0 });
    };
  }, []), /* @__PURE__ */ h(Za, { ...a, children: /* @__PURE__ */ h(
    ip,
    {
      scope: t,
      open: n,
      onOpenChange: l,
      content: c,
      onContentChange: u,
      children: /* @__PURE__ */ h(
        _x,
        {
          scope: t,
          onClose: m.useCallback(() => l(!1), [l]),
          isUsingKeyboardRef: d,
          dir: f,
          modal: s,
          children: r
        }
      )
    }
  ) });
};
sp.displayName = Yr;
var Cx = "MenuAnchor", Qa = m.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, ...r } = e, o = Xr(n);
    return /* @__PURE__ */ h(Ja, { ...o, ...r, ref: t });
  }
);
Qa.displayName = Cx;
var ec = "MenuPortal", [xx, ap] = Nn(ec, {
  forceMount: void 0
}), cp = (e) => {
  const { __scopeMenu: t, forceMount: n, children: r, container: o } = e, i = an(ec, t);
  return /* @__PURE__ */ h(xx, { scope: t, forceMount: n, children: /* @__PURE__ */ h(Et, { present: n || i.open, children: /* @__PURE__ */ h(In, { asChild: !0, container: o, children: r }) }) });
};
cp.displayName = ec;
var bt = "MenuContent", [Ex, tc] = Nn(bt), lp = m.forwardRef(
  (e, t) => {
    const n = ap(bt, e.__scopeMenu), { forceMount: r = n.forceMount, ...o } = e, i = an(bt, e.__scopeMenu), s = Zr(bt, e.__scopeMenu);
    return /* @__PURE__ */ h(kr.Provider, { scope: e.__scopeMenu, children: /* @__PURE__ */ h(Et, { present: r || i.open, children: /* @__PURE__ */ h(kr.Slot, { scope: e.__scopeMenu, children: s.modal ? /* @__PURE__ */ h(Rx, { ...o, ref: t }) : /* @__PURE__ */ h(Ix, { ...o, ref: t }) }) }) });
  }
), Rx = m.forwardRef(
  (e, t) => {
    const n = an(bt, e.__scopeMenu), r = m.useRef(null), o = ze(t, r);
    return m.useEffect(() => {
      const i = r.current;
      if (i) return fi(i);
    }, []), /* @__PURE__ */ h(
      nc,
      {
        ...e,
        ref: o,
        trapFocus: n.open,
        disableOutsidePointerEvents: n.open,
        disableOutsideScroll: !0,
        onFocusOutside: ce(
          e.onFocusOutside,
          (i) => i.preventDefault(),
          { checkForDefaultPrevented: !1 }
        ),
        onDismiss: () => n.onOpenChange(!1)
      }
    );
  }
), Ix = m.forwardRef((e, t) => {
  const n = an(bt, e.__scopeMenu);
  return /* @__PURE__ */ h(
    nc,
    {
      ...e,
      ref: t,
      trapFocus: !1,
      disableOutsidePointerEvents: !1,
      disableOutsideScroll: !1,
      onDismiss: () => n.onOpenChange(!1)
    }
  );
}), Tx = /* @__PURE__ */ Jn("MenuContent.ScrollLock"), nc = m.forwardRef(
  (e, t) => {
    const {
      __scopeMenu: n,
      loop: r = !1,
      trapFocus: o,
      onOpenAutoFocus: i,
      onCloseAutoFocus: s,
      disableOutsidePointerEvents: a,
      onEntryFocus: c,
      onEscapeKeyDown: u,
      onPointerDownOutside: d,
      onFocusOutside: l,
      onInteractOutside: f,
      onDismiss: g,
      disableOutsideScroll: v,
      ...p
    } = e, b = an(bt, n), y = Zr(bt, n), S = Xr(n), w = op(n), _ = Sx(n), [C, R] = m.useState(null), x = m.useRef(null), E = ze(t, x, b.onContentChange), I = m.useRef(0), M = m.useRef(""), N = m.useRef(0), $ = m.useRef(null), T = m.useRef("right"), O = m.useRef(0), F = v ? Kr : m.Fragment, A = v ? { as: Tx, allowPinchZoom: !0 } : void 0, D = (z) => {
      var U, H;
      const L = M.current + z, j = _().filter((Q) => !Q.disabled), Z = document.activeElement, K = (U = j.find((Q) => Q.ref.current === Z)) == null ? void 0 : U.textValue, G = j.map((Q) => Q.textValue), J = Bx(G, L, K), te = (H = j.find((Q) => Q.textValue === J)) == null ? void 0 : H.ref.current;
      (function Q(ee) {
        M.current = ee, window.clearTimeout(I.current), ee !== "" && (I.current = window.setTimeout(() => Q(""), 1e3));
      })(L), te && setTimeout(() => te.focus());
    };
    m.useEffect(() => () => window.clearTimeout(I.current), []), La();
    const V = m.useCallback((z) => {
      var j, Z;
      return T.current === ((j = $.current) == null ? void 0 : j.side) && jx(z, (Z = $.current) == null ? void 0 : Z.area);
    }, []);
    return /* @__PURE__ */ h(
      Ex,
      {
        scope: n,
        searchRef: M,
        onItemEnter: m.useCallback(
          (z) => {
            V(z) && z.preventDefault();
          },
          [V]
        ),
        onItemLeave: m.useCallback(
          (z) => {
            var L;
            V(z) || ((L = x.current) == null || L.focus(), R(null));
          },
          [V]
        ),
        onTriggerLeave: m.useCallback(
          (z) => {
            V(z) && z.preventDefault();
          },
          [V]
        ),
        pointerGraceTimerRef: N,
        onPointerGraceIntentChange: m.useCallback((z) => {
          $.current = z;
        }, []),
        children: /* @__PURE__ */ h(F, { ...A, children: /* @__PURE__ */ h(
          ui,
          {
            asChild: !0,
            trapped: o,
            onMountAutoFocus: ce(i, (z) => {
              var L;
              z.preventDefault(), (L = x.current) == null || L.focus({ preventScroll: !0 });
            }),
            onUnmountAutoFocus: s,
            children: /* @__PURE__ */ h(
              zr,
              {
                asChild: !0,
                disableOutsidePointerEvents: a,
                onEscapeKeyDown: u,
                onPointerDownOutside: d,
                onFocusOutside: l,
                onInteractOutside: f,
                onDismiss: g,
                children: /* @__PURE__ */ h(
                  px,
                  {
                    asChild: !0,
                    ...w,
                    dir: y.dir,
                    orientation: "vertical",
                    loop: r,
                    currentTabStopId: C,
                    onCurrentTabStopIdChange: R,
                    onEntryFocus: ce(c, (z) => {
                      y.isUsingKeyboardRef.current || z.preventDefault();
                    }),
                    preventScrollOnEntryFocus: !0,
                    children: /* @__PURE__ */ h(
                      Gh,
                      {
                        role: "menu",
                        "aria-orientation": "vertical",
                        "data-state": Rp(b.open),
                        "data-radix-menu-content": "",
                        dir: y.dir,
                        ...S,
                        ...p,
                        ref: E,
                        style: { outline: "none", ...p.style },
                        onKeyDown: ce(p.onKeyDown, (z) => {
                          const j = z.target.closest("[data-radix-menu-content]") === z.currentTarget, Z = z.ctrlKey || z.altKey || z.metaKey, K = z.key.length === 1;
                          j && (z.key === "Tab" && z.preventDefault(), !Z && K && D(z.key));
                          const G = x.current;
                          if (z.target !== G || !vx.includes(z.key)) return;
                          z.preventDefault();
                          const te = _().filter((U) => !U.disabled).map((U) => U.ref.current);
                          np.includes(z.key) && te.reverse(), Fx(te);
                        }),
                        onBlur: ce(e.onBlur, (z) => {
                          z.currentTarget.contains(z.target) || (window.clearTimeout(I.current), M.current = "");
                        }),
                        onPointerMove: ce(
                          e.onPointerMove,
                          Dr((z) => {
                            const L = z.target, j = O.current !== z.clientX;
                            if (z.currentTarget.contains(L) && j) {
                              const Z = z.clientX > O.current ? "right" : "left";
                              T.current = Z, O.current = z.clientX;
                            }
                          })
                        )
                      }
                    )
                  }
                )
              }
            )
          }
        ) })
      }
    );
  }
);
lp.displayName = bt;
var Nx = "MenuGroup", rc = m.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, ...r } = e;
    return /* @__PURE__ */ h(Te.div, { role: "group", ...r, ref: t });
  }
);
rc.displayName = Nx;
var Ax = "MenuLabel", up = m.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, ...r } = e;
    return /* @__PURE__ */ h(Te.div, { ...r, ref: t });
  }
);
up.displayName = Ax;
var Jo = "MenuItem", lu = "menu.itemSelect", bi = m.forwardRef(
  (e, t) => {
    const { disabled: n = !1, onSelect: r, ...o } = e, i = m.useRef(null), s = Zr(Jo, e.__scopeMenu), a = tc(Jo, e.__scopeMenu), c = ze(t, i), u = m.useRef(!1), d = () => {
      const l = i.current;
      if (!n && l) {
        const f = new CustomEvent(lu, { bubbles: !0, cancelable: !0 });
        l.addEventListener(lu, (g) => r == null ? void 0 : r(g), { once: !0 }), _a(l, f), f.defaultPrevented ? u.current = !1 : s.onClose();
      }
    };
    return /* @__PURE__ */ h(
      dp,
      {
        ...o,
        ref: c,
        disabled: n,
        onClick: ce(e.onClick, d),
        onPointerDown: (l) => {
          var f;
          (f = e.onPointerDown) == null || f.call(e, l), u.current = !0;
        },
        onPointerUp: ce(e.onPointerUp, (l) => {
          var f;
          u.current || (f = l.currentTarget) == null || f.click();
        }),
        onKeyDown: ce(e.onKeyDown, (l) => {
          const f = a.searchRef.current !== "";
          n || f && l.key === " " || Ks.includes(l.key) && (l.currentTarget.click(), l.preventDefault());
        })
      }
    );
  }
);
bi.displayName = Jo;
var dp = m.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, disabled: r = !1, textValue: o, ...i } = e, s = tc(Jo, n), a = op(n), c = m.useRef(null), u = ze(t, c), [d, l] = m.useState(!1), [f, g] = m.useState("");
    return m.useEffect(() => {
      const v = c.current;
      v && g((v.textContent ?? "").trim());
    }, [i.children]), /* @__PURE__ */ h(
      kr.ItemSlot,
      {
        scope: n,
        disabled: r,
        textValue: o ?? f,
        children: /* @__PURE__ */ h(mx, { asChild: !0, ...a, focusable: !r, children: /* @__PURE__ */ h(
          Te.div,
          {
            role: "menuitem",
            "data-highlighted": d ? "" : void 0,
            "aria-disabled": r || void 0,
            "data-disabled": r ? "" : void 0,
            ...i,
            ref: u,
            onPointerMove: ce(
              e.onPointerMove,
              Dr((v) => {
                r ? s.onItemLeave(v) : (s.onItemEnter(v), v.defaultPrevented || v.currentTarget.focus({ preventScroll: !0 }));
              })
            ),
            onPointerLeave: ce(
              e.onPointerLeave,
              Dr((v) => s.onItemLeave(v))
            ),
            onFocus: ce(e.onFocus, () => l(!0)),
            onBlur: ce(e.onBlur, () => l(!1))
          }
        ) })
      }
    );
  }
), Ox = "MenuCheckboxItem", fp = m.forwardRef(
  (e, t) => {
    const { checked: n = !1, onCheckedChange: r, ...o } = e;
    return /* @__PURE__ */ h(vp, { scope: e.__scopeMenu, checked: n, children: /* @__PURE__ */ h(
      bi,
      {
        role: "menuitemcheckbox",
        "aria-checked": Qo(n) ? "mixed" : n,
        ...o,
        ref: t,
        "data-state": sc(n),
        onSelect: ce(
          o.onSelect,
          () => r == null ? void 0 : r(Qo(n) ? !0 : !n),
          { checkForDefaultPrevented: !1 }
        )
      }
    ) });
  }
);
fp.displayName = Ox;
var hp = "MenuRadioGroup", [Px, Mx] = Nn(
  hp,
  { value: void 0, onValueChange: () => {
  } }
), pp = m.forwardRef(
  (e, t) => {
    const { value: n, onValueChange: r, ...o } = e, i = it(r);
    return /* @__PURE__ */ h(Px, { scope: e.__scopeMenu, value: n, onValueChange: i, children: /* @__PURE__ */ h(rc, { ...o, ref: t }) });
  }
);
pp.displayName = hp;
var mp = "MenuRadioItem", gp = m.forwardRef(
  (e, t) => {
    const { value: n, ...r } = e, o = Mx(mp, e.__scopeMenu), i = n === o.value;
    return /* @__PURE__ */ h(vp, { scope: e.__scopeMenu, checked: i, children: /* @__PURE__ */ h(
      bi,
      {
        role: "menuitemradio",
        "aria-checked": i,
        ...r,
        ref: t,
        "data-state": sc(i),
        onSelect: ce(
          r.onSelect,
          () => {
            var s;
            return (s = o.onValueChange) == null ? void 0 : s.call(o, n);
          },
          { checkForDefaultPrevented: !1 }
        )
      }
    ) });
  }
);
gp.displayName = mp;
var oc = "MenuItemIndicator", [vp, kx] = Nn(
  oc,
  { checked: !1 }
), yp = m.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, forceMount: r, ...o } = e, i = kx(oc, n);
    return /* @__PURE__ */ h(
      Et,
      {
        present: r || Qo(i.checked) || i.checked === !0,
        children: /* @__PURE__ */ h(
          Te.span,
          {
            ...o,
            ref: t,
            "data-state": sc(i.checked)
          }
        )
      }
    );
  }
);
yp.displayName = oc;
var Dx = "MenuSeparator", bp = m.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, ...r } = e;
    return /* @__PURE__ */ h(
      Te.div,
      {
        role: "separator",
        "aria-orientation": "horizontal",
        ...r,
        ref: t
      }
    );
  }
);
bp.displayName = Dx;
var $x = "MenuArrow", Sp = m.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, ...r } = e, o = Xr(n);
    return /* @__PURE__ */ h(Yh, { ...o, ...r, ref: t });
  }
);
Sp.displayName = $x;
var ic = "MenuSub", [Lx, wp] = Nn(ic), _p = (e) => {
  const { __scopeMenu: t, children: n, open: r = !1, onOpenChange: o } = e, i = an(ic, t), s = Xr(t), [a, c] = m.useState(null), [u, d] = m.useState(null), l = it(o);
  return m.useEffect(() => (i.open === !1 && l(!1), () => l(!1)), [i.open, l]), /* @__PURE__ */ h(Za, { ...s, children: /* @__PURE__ */ h(
    ip,
    {
      scope: t,
      open: r,
      onOpenChange: l,
      content: u,
      onContentChange: d,
      children: /* @__PURE__ */ h(
        Lx,
        {
          scope: t,
          contentId: Bt(),
          triggerId: Bt(),
          trigger: a,
          onTriggerChange: c,
          children: n
        }
      )
    }
  ) });
};
_p.displayName = ic;
var Ir = "MenuSubTrigger", Cp = m.forwardRef(
  (e, t) => {
    const n = an(Ir, e.__scopeMenu), r = Zr(Ir, e.__scopeMenu), o = wp(Ir, e.__scopeMenu), i = tc(Ir, e.__scopeMenu), s = m.useRef(null), { pointerGraceTimerRef: a, onPointerGraceIntentChange: c } = i, u = { __scopeMenu: e.__scopeMenu }, d = m.useCallback(() => {
      s.current && window.clearTimeout(s.current), s.current = null;
    }, []);
    return m.useEffect(() => d, [d]), m.useEffect(() => {
      const l = a.current;
      return () => {
        window.clearTimeout(l), c(null);
      };
    }, [a, c]), /* @__PURE__ */ h(Qa, { asChild: !0, ...u, children: /* @__PURE__ */ h(
      dp,
      {
        id: o.triggerId,
        "aria-haspopup": "menu",
        "aria-expanded": n.open,
        "aria-controls": o.contentId,
        "data-state": Rp(n.open),
        ...e,
        ref: ii(t, o.onTriggerChange),
        onClick: (l) => {
          var f;
          (f = e.onClick) == null || f.call(e, l), !(e.disabled || l.defaultPrevented) && (l.currentTarget.focus(), n.open || n.onOpenChange(!0));
        },
        onPointerMove: ce(
          e.onPointerMove,
          Dr((l) => {
            i.onItemEnter(l), !l.defaultPrevented && !e.disabled && !n.open && !s.current && (i.onPointerGraceIntentChange(null), s.current = window.setTimeout(() => {
              n.onOpenChange(!0), d();
            }, 100));
          })
        ),
        onPointerLeave: ce(
          e.onPointerLeave,
          Dr((l) => {
            var g, v;
            d();
            const f = (g = n.content) == null ? void 0 : g.getBoundingClientRect();
            if (f) {
              const p = (v = n.content) == null ? void 0 : v.dataset.side, b = p === "right", y = b ? -5 : 5, S = f[b ? "left" : "right"], w = f[b ? "right" : "left"];
              i.onPointerGraceIntentChange({
                area: [
                  // Apply a bleed on clientX to ensure that our exit point is
                  // consistently within polygon bounds
                  { x: l.clientX + y, y: l.clientY },
                  { x: S, y: f.top },
                  { x: w, y: f.top },
                  { x: w, y: f.bottom },
                  { x: S, y: f.bottom }
                ],
                side: p
              }), window.clearTimeout(a.current), a.current = window.setTimeout(
                () => i.onPointerGraceIntentChange(null),
                300
              );
            } else {
              if (i.onTriggerLeave(l), l.defaultPrevented) return;
              i.onPointerGraceIntentChange(null);
            }
          })
        ),
        onKeyDown: ce(e.onKeyDown, (l) => {
          var g;
          const f = i.searchRef.current !== "";
          e.disabled || f && l.key === " " || yx[r.dir].includes(l.key) && (n.onOpenChange(!0), (g = n.content) == null || g.focus(), l.preventDefault());
        })
      }
    ) });
  }
);
Cp.displayName = Ir;
var xp = "MenuSubContent", Ep = m.forwardRef(
  (e, t) => {
    const n = ap(bt, e.__scopeMenu), { forceMount: r = n.forceMount, ...o } = e, i = an(bt, e.__scopeMenu), s = Zr(bt, e.__scopeMenu), a = wp(xp, e.__scopeMenu), c = m.useRef(null), u = ze(t, c);
    return /* @__PURE__ */ h(kr.Provider, { scope: e.__scopeMenu, children: /* @__PURE__ */ h(Et, { present: r || i.open, children: /* @__PURE__ */ h(kr.Slot, { scope: e.__scopeMenu, children: /* @__PURE__ */ h(
      nc,
      {
        id: a.contentId,
        "aria-labelledby": a.triggerId,
        ...o,
        ref: u,
        align: "start",
        side: s.dir === "rtl" ? "left" : "right",
        disableOutsidePointerEvents: !1,
        disableOutsideScroll: !1,
        trapFocus: !1,
        onOpenAutoFocus: (d) => {
          var l;
          s.isUsingKeyboardRef.current && ((l = c.current) == null || l.focus()), d.preventDefault();
        },
        onCloseAutoFocus: (d) => d.preventDefault(),
        onFocusOutside: ce(e.onFocusOutside, (d) => {
          d.target !== a.trigger && i.onOpenChange(!1);
        }),
        onEscapeKeyDown: ce(e.onEscapeKeyDown, (d) => {
          s.onClose(), d.preventDefault();
        }),
        onKeyDown: ce(e.onKeyDown, (d) => {
          var g;
          const l = d.currentTarget.contains(d.target), f = bx[s.dir].includes(d.key);
          l && f && (i.onOpenChange(!1), (g = a.trigger) == null || g.focus(), d.preventDefault());
        })
      }
    ) }) }) });
  }
);
Ep.displayName = xp;
function Rp(e) {
  return e ? "open" : "closed";
}
function Qo(e) {
  return e === "indeterminate";
}
function sc(e) {
  return Qo(e) ? "indeterminate" : e ? "checked" : "unchecked";
}
function Fx(e) {
  const t = document.activeElement;
  for (const n of e)
    if (n === t || (n.focus(), document.activeElement !== t)) return;
}
function Vx(e, t) {
  return e.map((n, r) => e[(t + r) % e.length]);
}
function Bx(e, t, n) {
  const o = t.length > 1 && Array.from(t).every((u) => u === t[0]) ? t[0] : t, i = n ? e.indexOf(n) : -1;
  let s = Vx(e, Math.max(i, 0));
  o.length === 1 && (s = s.filter((u) => u !== n));
  const c = s.find(
    (u) => u.toLowerCase().startsWith(o.toLowerCase())
  );
  return c !== n ? c : void 0;
}
function zx(e, t) {
  const { x: n, y: r } = e;
  let o = !1;
  for (let i = 0, s = t.length - 1; i < t.length; s = i++) {
    const a = t[i], c = t[s], u = a.x, d = a.y, l = c.x, f = c.y;
    d > r != f > r && n < (l - u) * (r - d) / (f - d) + u && (o = !o);
  }
  return o;
}
function jx(e, t) {
  if (!t) return !1;
  const n = { x: e.clientX, y: e.clientY };
  return zx(n, t);
}
function Dr(e) {
  return (t) => t.pointerType === "mouse" ? e(t) : void 0;
}
var Ux = sp, Hx = Qa, Wx = cp, Kx = lp, qx = rc, Gx = up, Yx = bi, Xx = fp, Zx = pp, Jx = gp, Qx = yp, eE = bp, tE = Sp, nE = _p, rE = Cp, oE = Ep, Si = "DropdownMenu", [iE] = sn(
  Si,
  [rp]
), Je = rp(), [sE, Ip] = iE(Si), Tp = (e) => {
  const {
    __scopeDropdownMenu: t,
    children: n,
    dir: r,
    open: o,
    defaultOpen: i,
    onOpenChange: s,
    modal: a = !0
  } = e, c = Je(t), u = m.useRef(null), [d, l] = ir({
    prop: o,
    defaultProp: i ?? !1,
    onChange: s,
    caller: Si
  });
  return /* @__PURE__ */ h(
    sE,
    {
      scope: t,
      triggerId: Bt(),
      triggerRef: u,
      contentId: Bt(),
      open: d,
      onOpenChange: l,
      onOpenToggle: m.useCallback(() => l((f) => !f), [l]),
      modal: a,
      children: /* @__PURE__ */ h(Ux, { ...c, open: d, onOpenChange: l, dir: r, modal: a, children: n })
    }
  );
};
Tp.displayName = Si;
var Np = "DropdownMenuTrigger", Ap = m.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, disabled: r = !1, ...o } = e, i = Ip(Np, n), s = Je(n);
    return /* @__PURE__ */ h(Hx, { asChild: !0, ...s, children: /* @__PURE__ */ h(
      Te.button,
      {
        type: "button",
        id: i.triggerId,
        "aria-haspopup": "menu",
        "aria-expanded": i.open,
        "aria-controls": i.open ? i.contentId : void 0,
        "data-state": i.open ? "open" : "closed",
        "data-disabled": r ? "" : void 0,
        disabled: r,
        ...o,
        ref: ii(t, i.triggerRef),
        onPointerDown: ce(e.onPointerDown, (a) => {
          !r && a.button === 0 && a.ctrlKey === !1 && (i.onOpenToggle(), i.open || a.preventDefault());
        }),
        onKeyDown: ce(e.onKeyDown, (a) => {
          r || (["Enter", " "].includes(a.key) && i.onOpenToggle(), a.key === "ArrowDown" && i.onOpenChange(!0), ["Enter", " ", "ArrowDown"].includes(a.key) && a.preventDefault());
        })
      }
    ) });
  }
);
Ap.displayName = Np;
var aE = "DropdownMenuPortal", Op = (e) => {
  const { __scopeDropdownMenu: t, ...n } = e, r = Je(t);
  return /* @__PURE__ */ h(Wx, { ...r, ...n });
};
Op.displayName = aE;
var Pp = "DropdownMenuContent", Mp = m.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, ...r } = e, o = Ip(Pp, n), i = Je(n), s = m.useRef(!1);
    return /* @__PURE__ */ h(
      Kx,
      {
        id: o.contentId,
        "aria-labelledby": o.triggerId,
        ...i,
        ...r,
        ref: t,
        onCloseAutoFocus: ce(e.onCloseAutoFocus, (a) => {
          var c;
          s.current || (c = o.triggerRef.current) == null || c.focus(), s.current = !1, a.preventDefault();
        }),
        onInteractOutside: ce(e.onInteractOutside, (a) => {
          const c = a.detail.originalEvent, u = c.button === 0 && c.ctrlKey === !0, d = c.button === 2 || u;
          (!o.modal || d) && (s.current = !0);
        }),
        style: {
          ...e.style,
          "--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
          "--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
          "--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
          "--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
          "--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
        }
      }
    );
  }
);
Mp.displayName = Pp;
var cE = "DropdownMenuGroup", kp = m.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, ...r } = e, o = Je(n);
    return /* @__PURE__ */ h(qx, { ...o, ...r, ref: t });
  }
);
kp.displayName = cE;
var lE = "DropdownMenuLabel", Dp = m.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, ...r } = e, o = Je(n);
    return /* @__PURE__ */ h(Gx, { ...o, ...r, ref: t });
  }
);
Dp.displayName = lE;
var uE = "DropdownMenuItem", $p = m.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, ...r } = e, o = Je(n);
    return /* @__PURE__ */ h(Yx, { ...o, ...r, ref: t });
  }
);
$p.displayName = uE;
var dE = "DropdownMenuCheckboxItem", Lp = m.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e, o = Je(n);
  return /* @__PURE__ */ h(Xx, { ...o, ...r, ref: t });
});
Lp.displayName = dE;
var fE = "DropdownMenuRadioGroup", Fp = m.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e, o = Je(n);
  return /* @__PURE__ */ h(Zx, { ...o, ...r, ref: t });
});
Fp.displayName = fE;
var hE = "DropdownMenuRadioItem", Vp = m.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e, o = Je(n);
  return /* @__PURE__ */ h(Jx, { ...o, ...r, ref: t });
});
Vp.displayName = hE;
var pE = "DropdownMenuItemIndicator", Bp = m.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e, o = Je(n);
  return /* @__PURE__ */ h(Qx, { ...o, ...r, ref: t });
});
Bp.displayName = pE;
var mE = "DropdownMenuSeparator", zp = m.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e, o = Je(n);
  return /* @__PURE__ */ h(eE, { ...o, ...r, ref: t });
});
zp.displayName = mE;
var gE = "DropdownMenuArrow", vE = m.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, ...r } = e, o = Je(n);
    return /* @__PURE__ */ h(tE, { ...o, ...r, ref: t });
  }
);
vE.displayName = gE;
var yE = (e) => {
  const { __scopeDropdownMenu: t, children: n, open: r, onOpenChange: o, defaultOpen: i } = e, s = Je(t), [a, c] = ir({
    prop: r,
    defaultProp: i ?? !1,
    onChange: o,
    caller: "DropdownMenuSub"
  });
  return /* @__PURE__ */ h(nE, { ...s, open: a, onOpenChange: c, children: n });
}, bE = "DropdownMenuSubTrigger", jp = m.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e, o = Je(n);
  return /* @__PURE__ */ h(rE, { ...o, ...r, ref: t });
});
jp.displayName = bE;
var SE = "DropdownMenuSubContent", Up = m.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e, o = Je(n);
  return /* @__PURE__ */ h(
    oE,
    {
      ...o,
      ...r,
      ref: t,
      style: {
        ...e.style,
        "--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
        "--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
        "--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
        "--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
        "--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
      }
    }
  );
});
Up.displayName = SE;
var Jr = Tp, Qr = Ap, ur = Op, eo = Mp, wE = kp, _E = Dp, ei = $p, is = Lp, Hp = Fp, qs = Vp, Xn = Bp, Wp = zp, CE = yE, xE = jp, EE = Up, RE = "_1qprlh50 _14sdsl32", uu = "_1qprlh51";
function IE({ value: e, onChange: t }) {
  const { t: n } = de(), r = Se(), o = Ye(), [i, s] = ne(!1), a = e === "gallery", c = a ? Ll : Fl;
  return /* @__PURE__ */ P(Jr, { open: i, onOpenChange: s, modal: !1, children: [
    /* @__PURE__ */ h(Qr, { asChild: !0, children: /* @__PURE__ */ h(
      le,
      {
        kind: "icon",
        size: "sm",
        active: i,
        "aria-label": n(a ? "view.gallery" : "view.speaker"),
        "aria-haspopup": "menu",
        children: /* @__PURE__ */ h(c, { size: 18, "aria-hidden": "true" })
      }
    ) }),
    /* @__PURE__ */ h(ur, { children: /* @__PURE__ */ P(
      eo,
      {
        style: o,
        className: RE,
        align: "end",
        sideOffset: 8,
        collisionPadding: 12,
        avoidCollisions: !0,
        "data-theme": r,
        children: [
          /* @__PURE__ */ h(nt, { asChild: !0, layout: "leading", children: /* @__PURE__ */ P(ei, { "aria-current": a ? "true" : void 0, onSelect: () => t("gallery"), children: [
            /* @__PURE__ */ h("span", { className: uu, children: a ? /* @__PURE__ */ h(yt, { size: 14, "aria-hidden": "true" }) : null }),
            /* @__PURE__ */ P("span", { children: [
              /* @__PURE__ */ h(Ll, { size: 14, "aria-hidden": "true", style: { verticalAlign: "-2px", marginRight: 6 } }),
              n("view.gallery")
            ] })
          ] }) }),
          /* @__PURE__ */ h(nt, { asChild: !0, layout: "leading", children: /* @__PURE__ */ P(ei, { "aria-current": a ? void 0 : "true", onSelect: () => t("speaker"), children: [
            /* @__PURE__ */ h("span", { className: uu, children: a ? null : /* @__PURE__ */ h(yt, { size: 14, "aria-hidden": "true" }) }),
            /* @__PURE__ */ P("span", { children: [
              /* @__PURE__ */ h(Fl, { size: 14, "aria-hidden": "true", style: { verticalAlign: "-2px", marginRight: 6 } }),
              n("view.speaker")
            ] })
          ] }) })
        ]
      }
    ) })
  ] });
}
function TE(e) {
  if (typeof document > "u") return;
  let t = document.head || document.getElementsByTagName("head")[0], n = document.createElement("style");
  n.type = "text/css", t.appendChild(n), n.styleSheet ? n.styleSheet.cssText = e : n.appendChild(document.createTextNode(e));
}
const Kp = k.createContext({
  drawerRef: {
    current: null
  },
  overlayRef: {
    current: null
  },
  onPress: () => {
  },
  onRelease: () => {
  },
  onDrag: () => {
  },
  onNestedDrag: () => {
  },
  onNestedOpenChange: () => {
  },
  onNestedRelease: () => {
  },
  openProp: void 0,
  dismissible: !1,
  isOpen: !1,
  isDragging: !1,
  keyboardIsOpen: {
    current: !1
  },
  snapPointsOffset: null,
  snapPoints: null,
  handleOnly: !1,
  modal: !1,
  shouldFade: !1,
  activeSnapPoint: null,
  onOpenChange: () => {
  },
  setActiveSnapPoint: () => {
  },
  closeDrawer: () => {
  },
  direction: "bottom",
  shouldAnimate: {
    current: !0
  },
  shouldScaleBackground: !1,
  setBackgroundColorOnScale: !0,
  noBodyStyles: !1,
  container: null,
  autoFocus: !1
}), dr = () => {
  const e = k.useContext(Kp);
  if (!e)
    throw new Error("useDrawerContext must be used within a Drawer.Root");
  return e;
};
TE(`[data-vaul-drawer]{touch-action:none;will-change:transform;transition:transform .5s cubic-bezier(.32, .72, 0, 1);animation-duration:.5s;animation-timing-function:cubic-bezier(0.32,0.72,0,1)}[data-vaul-drawer][data-vaul-snap-points=false][data-vaul-drawer-direction=bottom][data-state=open]{animation-name:slideFromBottom}[data-vaul-drawer][data-vaul-snap-points=false][data-vaul-drawer-direction=bottom][data-state=closed]{animation-name:slideToBottom}[data-vaul-drawer][data-vaul-snap-points=false][data-vaul-drawer-direction=top][data-state=open]{animation-name:slideFromTop}[data-vaul-drawer][data-vaul-snap-points=false][data-vaul-drawer-direction=top][data-state=closed]{animation-name:slideToTop}[data-vaul-drawer][data-vaul-snap-points=false][data-vaul-drawer-direction=left][data-state=open]{animation-name:slideFromLeft}[data-vaul-drawer][data-vaul-snap-points=false][data-vaul-drawer-direction=left][data-state=closed]{animation-name:slideToLeft}[data-vaul-drawer][data-vaul-snap-points=false][data-vaul-drawer-direction=right][data-state=open]{animation-name:slideFromRight}[data-vaul-drawer][data-vaul-snap-points=false][data-vaul-drawer-direction=right][data-state=closed]{animation-name:slideToRight}[data-vaul-drawer][data-vaul-snap-points=true][data-vaul-drawer-direction=bottom]{transform:translate3d(0,var(--initial-transform,100%),0)}[data-vaul-drawer][data-vaul-snap-points=true][data-vaul-drawer-direction=top]{transform:translate3d(0,calc(var(--initial-transform,100%) * -1),0)}[data-vaul-drawer][data-vaul-snap-points=true][data-vaul-drawer-direction=left]{transform:translate3d(calc(var(--initial-transform,100%) * -1),0,0)}[data-vaul-drawer][data-vaul-snap-points=true][data-vaul-drawer-direction=right]{transform:translate3d(var(--initial-transform,100%),0,0)}[data-vaul-drawer][data-vaul-delayed-snap-points=true][data-vaul-drawer-direction=top]{transform:translate3d(0,var(--snap-point-height,0),0)}[data-vaul-drawer][data-vaul-delayed-snap-points=true][data-vaul-drawer-direction=bottom]{transform:translate3d(0,var(--snap-point-height,0),0)}[data-vaul-drawer][data-vaul-delayed-snap-points=true][data-vaul-drawer-direction=left]{transform:translate3d(var(--snap-point-height,0),0,0)}[data-vaul-drawer][data-vaul-delayed-snap-points=true][data-vaul-drawer-direction=right]{transform:translate3d(var(--snap-point-height,0),0,0)}[data-vaul-overlay][data-vaul-snap-points=false]{animation-duration:.5s;animation-timing-function:cubic-bezier(0.32,0.72,0,1)}[data-vaul-overlay][data-vaul-snap-points=false][data-state=open]{animation-name:fadeIn}[data-vaul-overlay][data-state=closed]{animation-name:fadeOut}[data-vaul-animate=false]{animation:none!important}[data-vaul-overlay][data-vaul-snap-points=true]{opacity:0;transition:opacity .5s cubic-bezier(.32, .72, 0, 1)}[data-vaul-overlay][data-vaul-snap-points=true]{opacity:1}[data-vaul-drawer]:not([data-vaul-custom-container=true])::after{content:'';position:absolute;background:inherit;background-color:inherit}[data-vaul-drawer][data-vaul-drawer-direction=top]::after{top:initial;bottom:100%;left:0;right:0;height:200%}[data-vaul-drawer][data-vaul-drawer-direction=bottom]::after{top:100%;bottom:initial;left:0;right:0;height:200%}[data-vaul-drawer][data-vaul-drawer-direction=left]::after{left:initial;right:100%;top:0;bottom:0;width:200%}[data-vaul-drawer][data-vaul-drawer-direction=right]::after{left:100%;right:initial;top:0;bottom:0;width:200%}[data-vaul-overlay][data-vaul-snap-points=true]:not([data-vaul-snap-points-overlay=true]):not(
[data-state=closed]
){opacity:0}[data-vaul-overlay][data-vaul-snap-points-overlay=true]{opacity:1}[data-vaul-handle]{display:block;position:relative;opacity:.7;background:#e2e2e4;margin-left:auto;margin-right:auto;height:5px;width:32px;border-radius:1rem;touch-action:pan-y}[data-vaul-handle]:active,[data-vaul-handle]:hover{opacity:1}[data-vaul-handle-hitarea]{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:max(100%,2.75rem);height:max(100%,2.75rem);touch-action:inherit}@media (hover:hover) and (pointer:fine){[data-vaul-drawer]{user-select:none}}@media (pointer:fine){[data-vaul-handle-hitarea]:{width:100%;height:100%}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes fadeOut{to{opacity:0}}@keyframes slideFromBottom{from{transform:translate3d(0,var(--initial-transform,100%),0)}to{transform:translate3d(0,0,0)}}@keyframes slideToBottom{to{transform:translate3d(0,var(--initial-transform,100%),0)}}@keyframes slideFromTop{from{transform:translate3d(0,calc(var(--initial-transform,100%) * -1),0)}to{transform:translate3d(0,0,0)}}@keyframes slideToTop{to{transform:translate3d(0,calc(var(--initial-transform,100%) * -1),0)}}@keyframes slideFromLeft{from{transform:translate3d(calc(var(--initial-transform,100%) * -1),0,0)}to{transform:translate3d(0,0,0)}}@keyframes slideToLeft{to{transform:translate3d(calc(var(--initial-transform,100%) * -1),0,0)}}@keyframes slideFromRight{from{transform:translate3d(var(--initial-transform,100%),0,0)}to{transform:translate3d(0,0,0)}}@keyframes slideToRight{to{transform:translate3d(var(--initial-transform,100%),0,0)}}`);
function NE() {
  const e = navigator.userAgent;
  return typeof window < "u" && (/Firefox/.test(e) && /Mobile/.test(e) || // Android Firefox
  /FxiOS/.test(e));
}
function AE() {
  return ac(/^Mac/);
}
function OE() {
  return ac(/^iPhone/);
}
function du() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
function PE() {
  return ac(/^iPad/) || // iPadOS 13 lies and says it's a Mac, but we can distinguish by detecting touch support.
  AE() && navigator.maxTouchPoints > 1;
}
function qp() {
  return OE() || PE();
}
function ac(e) {
  return typeof window < "u" && window.navigator != null ? e.test(window.navigator.platform) : void 0;
}
const ME = 24, kE = typeof window < "u" ? jt : oe;
function fu(...e) {
  return (...t) => {
    for (let n of e)
      typeof n == "function" && n(...t);
  };
}
const ss = typeof document < "u" && window.visualViewport;
function hu(e) {
  let t = window.getComputedStyle(e);
  return /(auto|scroll)/.test(t.overflow + t.overflowX + t.overflowY);
}
function Gp(e) {
  for (hu(e) && (e = e.parentElement); e && !hu(e); )
    e = e.parentElement;
  return e || document.scrollingElement || document.documentElement;
}
const DE = /* @__PURE__ */ new Set([
  "checkbox",
  "radio",
  "range",
  "color",
  "file",
  "image",
  "button",
  "submit",
  "reset"
]);
let Co = 0, as;
function $E(e = {}) {
  let { isDisabled: t } = e;
  kE(() => {
    if (!t)
      return Co++, Co === 1 && qp() && (as = LE()), () => {
        Co--, Co === 0 && (as == null || as());
      };
  }, [
    t
  ]);
}
function LE() {
  let e, t = 0, n = (l) => {
    e = Gp(l.target), !(e === document.documentElement && e === document.body) && (t = l.changedTouches[0].pageY);
  }, r = (l) => {
    if (!e || e === document.documentElement || e === document.body) {
      l.preventDefault();
      return;
    }
    let f = l.changedTouches[0].pageY, g = e.scrollTop, v = e.scrollHeight - e.clientHeight;
    v !== 0 && ((g <= 0 && f > t || g >= v && f < t) && l.preventDefault(), t = f);
  }, o = (l) => {
    let f = l.target;
    Gs(f) && f !== document.activeElement && (l.preventDefault(), f.style.transform = "translateY(-2000px)", f.focus(), requestAnimationFrame(() => {
      f.style.transform = "";
    }));
  }, i = (l) => {
    let f = l.target;
    Gs(f) && (f.style.transform = "translateY(-2000px)", requestAnimationFrame(() => {
      f.style.transform = "", ss && (ss.height < window.innerHeight ? requestAnimationFrame(() => {
        pu(f);
      }) : ss.addEventListener("resize", () => pu(f), {
        once: !0
      }));
    }));
  }, s = () => {
    window.scrollTo(0, 0);
  }, a = window.pageXOffset, c = window.pageYOffset, u = fu(FE(document.documentElement, "paddingRight", `${window.innerWidth - document.documentElement.clientWidth}px`));
  window.scrollTo(0, 0);
  let d = fu(_r(document, "touchstart", n, {
    passive: !1,
    capture: !0
  }), _r(document, "touchmove", r, {
    passive: !1,
    capture: !0
  }), _r(document, "touchend", o, {
    passive: !1,
    capture: !0
  }), _r(document, "focus", i, !0), _r(window, "scroll", s));
  return () => {
    u(), d(), window.scrollTo(a, c);
  };
}
function FE(e, t, n) {
  let r = e.style[t];
  return e.style[t] = n, () => {
    e.style[t] = r;
  };
}
function _r(e, t, n, r) {
  return e.addEventListener(t, n, r), () => {
    e.removeEventListener(t, n, r);
  };
}
function pu(e) {
  let t = document.scrollingElement || document.documentElement;
  for (; e && e !== t; ) {
    let n = Gp(e);
    if (n !== document.documentElement && n !== document.body && n !== e) {
      let r = n.getBoundingClientRect().top, o = e.getBoundingClientRect().top, i = e.getBoundingClientRect().bottom;
      const s = n.getBoundingClientRect().bottom + ME;
      i > s && (n.scrollTop += o - r);
    }
    e = n.parentElement;
  }
}
function Gs(e) {
  return e instanceof HTMLInputElement && !DE.has(e.type) || e instanceof HTMLTextAreaElement || e instanceof HTMLElement && e.isContentEditable;
}
function VE(e, t) {
  typeof e == "function" ? e(t) : e != null && (e.current = t);
}
function BE(...e) {
  return (t) => e.forEach((n) => VE(n, t));
}
function Yp(...e) {
  return m.useCallback(BE(...e), e);
}
const Xp = /* @__PURE__ */ new WeakMap();
function Ke(e, t, n = !1) {
  if (!e || !(e instanceof HTMLElement)) return;
  let r = {};
  Object.entries(t).forEach(([o, i]) => {
    if (o.startsWith("--")) {
      e.style.setProperty(o, i);
      return;
    }
    r[o] = e.style[o], e.style[o] = i;
  }), !n && Xp.set(e, r);
}
function zE(e, t) {
  if (!e || !(e instanceof HTMLElement)) return;
  let n = Xp.get(e);
  n && (e.style[t] = n[t]);
}
const Ue = (e) => {
  switch (e) {
    case "top":
    case "bottom":
      return !0;
    case "left":
    case "right":
      return !1;
    default:
      return e;
  }
};
function xo(e, t) {
  if (!e)
    return null;
  const n = window.getComputedStyle(e), r = (
    // @ts-ignore
    n.transform || n.webkitTransform || n.mozTransform
  );
  let o = r.match(/^matrix3d\((.+)\)$/);
  return o ? parseFloat(o[1].split(", ")[Ue(t) ? 13 : 12]) : (o = r.match(/^matrix\((.+)\)$/), o ? parseFloat(o[1].split(", ")[Ue(t) ? 5 : 4]) : null);
}
function jE(e) {
  return 8 * (Math.log(e + 1) - 2);
}
function cs(e, t) {
  if (!e) return () => {
  };
  const n = e.style.cssText;
  return Object.assign(e.style, t), () => {
    e.style.cssText = n;
  };
}
function UE(...e) {
  return (...t) => {
    for (const n of e)
      typeof n == "function" && n(...t);
  };
}
const Fe = {
  DURATION: 0.5,
  EASE: [
    0.32,
    0.72,
    0,
    1
  ]
}, Zp = 0.4, HE = 0.25, WE = 100, Jp = 8, pn = 16, Ys = 26, ls = "vaul-dragging";
function Qp(e) {
  const t = k.useRef(e);
  return k.useEffect(() => {
    t.current = e;
  }), k.useMemo(() => (...n) => t.current == null ? void 0 : t.current.call(t, ...n), []);
}
function KE({ defaultProp: e, onChange: t }) {
  const n = k.useState(e), [r] = n, o = k.useRef(r), i = Qp(t);
  return k.useEffect(() => {
    o.current !== r && (i(r), o.current = r);
  }, [
    r,
    o,
    i
  ]), n;
}
function em({ prop: e, defaultProp: t, onChange: n = () => {
} }) {
  const [r, o] = KE({
    defaultProp: t,
    onChange: n
  }), i = e !== void 0, s = i ? e : r, a = Qp(n), c = k.useCallback((u) => {
    if (i) {
      const l = typeof u == "function" ? u(e) : u;
      l !== e && a(l);
    } else
      o(u);
  }, [
    i,
    e,
    o,
    a
  ]);
  return [
    s,
    c
  ];
}
function qE({ activeSnapPointProp: e, setActiveSnapPointProp: t, snapPoints: n, drawerRef: r, overlayRef: o, fadeFromIndex: i, onSnapPointChange: s, direction: a = "bottom", container: c, snapToSequentialPoint: u }) {
  const [d, l] = em({
    prop: e,
    defaultProp: n == null ? void 0 : n[0],
    onChange: t
  }), [f, g] = k.useState(typeof window < "u" ? {
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight
  } : void 0);
  k.useEffect(() => {
    function x() {
      g({
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight
      });
    }
    return window.addEventListener("resize", x), () => window.removeEventListener("resize", x);
  }, []);
  const v = k.useMemo(() => d === (n == null ? void 0 : n[n.length - 1]) || null, [
    n,
    d
  ]), p = k.useMemo(() => {
    var x;
    return (x = n == null ? void 0 : n.findIndex((E) => E === d)) != null ? x : null;
  }, [
    n,
    d
  ]), b = n && n.length > 0 && (i || i === 0) && !Number.isNaN(i) && n[i] === d || !n, y = k.useMemo(() => {
    const x = c ? {
      width: c.getBoundingClientRect().width,
      height: c.getBoundingClientRect().height
    } : typeof window < "u" ? {
      width: window.innerWidth,
      height: window.innerHeight
    } : {
      width: 0,
      height: 0
    };
    var E;
    return (E = n == null ? void 0 : n.map((I) => {
      const M = typeof I == "string";
      let N = 0;
      if (M && (N = parseInt(I, 10)), Ue(a)) {
        const T = M ? N : f ? I * x.height : 0;
        return f ? a === "bottom" ? x.height - T : -x.height + T : T;
      }
      const $ = M ? N : f ? I * x.width : 0;
      return f ? a === "right" ? x.width - $ : -x.width + $ : $;
    })) != null ? E : [];
  }, [
    n,
    f,
    c
  ]), S = k.useMemo(() => p !== null ? y == null ? void 0 : y[p] : null, [
    y,
    p
  ]), w = k.useCallback((x) => {
    var E;
    const I = (E = y == null ? void 0 : y.findIndex((M) => M === x)) != null ? E : null;
    s(I), Ke(r.current, {
      transition: `transform ${Fe.DURATION}s cubic-bezier(${Fe.EASE.join(",")})`,
      transform: Ue(a) ? `translate3d(0, ${x}px, 0)` : `translate3d(${x}px, 0, 0)`
    }), y && I !== y.length - 1 && i !== void 0 && I !== i && I < i ? Ke(o.current, {
      transition: `opacity ${Fe.DURATION}s cubic-bezier(${Fe.EASE.join(",")})`,
      opacity: "0"
    }) : Ke(o.current, {
      transition: `opacity ${Fe.DURATION}s cubic-bezier(${Fe.EASE.join(",")})`,
      opacity: "1"
    }), l(n == null ? void 0 : n[Math.max(I, 0)]);
  }, [
    r.current,
    n,
    y,
    i,
    o,
    l
  ]);
  k.useEffect(() => {
    if (d || e) {
      var x;
      const E = (x = n == null ? void 0 : n.findIndex((I) => I === e || I === d)) != null ? x : -1;
      y && E !== -1 && typeof y[E] == "number" && w(y[E]);
    }
  }, [
    d,
    e,
    n,
    y,
    w
  ]);
  function _({ draggedDistance: x, closeDrawer: E, velocity: I, dismissible: M }) {
    if (i === void 0) return;
    const N = a === "bottom" || a === "right" ? (S ?? 0) - x : (S ?? 0) + x, $ = p === i - 1, T = p === 0, O = x > 0;
    if ($ && Ke(o.current, {
      transition: `opacity ${Fe.DURATION}s cubic-bezier(${Fe.EASE.join(",")})`
    }), !u && I > 2 && !O) {
      M ? E() : w(y[0]);
      return;
    }
    if (!u && I > 2 && O && y && n) {
      w(y[n.length - 1]);
      return;
    }
    const F = y == null ? void 0 : y.reduce((D, V) => typeof D != "number" || typeof V != "number" ? D : Math.abs(V - N) < Math.abs(D - N) ? V : D), A = Ue(a) ? window.innerHeight : window.innerWidth;
    if (I > Zp && Math.abs(x) < A * 0.4) {
      const D = O ? 1 : -1;
      if (D > 0 && v && n) {
        w(y[n.length - 1]);
        return;
      }
      if (T && D < 0 && M && E(), p === null) return;
      w(y[p + D]);
      return;
    }
    w(F);
  }
  function C({ draggedDistance: x }) {
    if (S === null) return;
    const E = a === "bottom" || a === "right" ? S - x : S + x;
    (a === "bottom" || a === "right") && E < y[y.length - 1] || (a === "top" || a === "left") && E > y[y.length - 1] || Ke(r.current, {
      transform: Ue(a) ? `translate3d(0, ${E}px, 0)` : `translate3d(${E}px, 0, 0)`
    });
  }
  function R(x, E) {
    if (!n || typeof p != "number" || !y || i === void 0) return null;
    const I = p === i - 1;
    if (p >= i && E)
      return 0;
    if (I && !E) return 1;
    if (!b && !I) return null;
    const N = I ? p + 1 : p - 1, $ = I ? y[N] - y[N - 1] : y[N + 1] - y[N], T = x / Math.abs($);
    return I ? 1 - T : T;
  }
  return {
    isLastSnapPoint: v,
    activeSnapPoint: d,
    shouldFade: b,
    getPercentageDragged: R,
    setActiveSnapPoint: l,
    activeSnapPointIndex: p,
    onRelease: _,
    onDrag: C,
    snapPointsOffset: y
  };
}
const GE = () => () => {
};
function YE() {
  const { direction: e, isOpen: t, shouldScaleBackground: n, setBackgroundColorOnScale: r, noBodyStyles: o } = dr(), i = k.useRef(null), s = he(() => document.body.style.backgroundColor, []);
  function a() {
    return (window.innerWidth - Ys) / window.innerWidth;
  }
  k.useEffect(() => {
    if (t && n) {
      i.current && clearTimeout(i.current);
      const c = document.querySelector("[data-vaul-drawer-wrapper]") || document.querySelector("[vaul-drawer-wrapper]");
      if (!c) return;
      UE(r && !o ? cs(document.body, {
        background: "black"
      }) : GE, cs(c, {
        transformOrigin: Ue(e) ? "top" : "left",
        transitionProperty: "transform, border-radius",
        transitionDuration: `${Fe.DURATION}s`,
        transitionTimingFunction: `cubic-bezier(${Fe.EASE.join(",")})`
      }));
      const u = cs(c, {
        borderRadius: `${Jp}px`,
        overflow: "hidden",
        ...Ue(e) ? {
          transform: `scale(${a()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`
        } : {
          transform: `scale(${a()}) translate3d(calc(env(safe-area-inset-top) + 14px), 0, 0)`
        }
      });
      return () => {
        u(), i.current = window.setTimeout(() => {
          s ? document.body.style.background = s : document.body.style.removeProperty("background");
        }, Fe.DURATION * 1e3);
      };
    }
  }, [
    t,
    n,
    s
  ]);
}
let Cr = null;
function XE({ isOpen: e, modal: t, nested: n, hasBeenOpened: r, preventScrollRestoration: o, noBodyStyles: i }) {
  const [s, a] = k.useState(() => typeof window < "u" ? window.location.href : ""), c = k.useRef(0), u = k.useCallback(() => {
    if (du() && Cr === null && e && !i) {
      Cr = {
        position: document.body.style.position,
        top: document.body.style.top,
        left: document.body.style.left,
        height: document.body.style.height,
        right: "unset"
      };
      const { scrollX: l, innerHeight: f } = window;
      document.body.style.setProperty("position", "fixed", "important"), Object.assign(document.body.style, {
        top: `${-c.current}px`,
        left: `${-l}px`,
        right: "0px",
        height: "auto"
      }), window.setTimeout(() => window.requestAnimationFrame(() => {
        const g = f - window.innerHeight;
        g && c.current >= f && (document.body.style.top = `${-(c.current + g)}px`);
      }), 300);
    }
  }, [
    e
  ]), d = k.useCallback(() => {
    if (du() && Cr !== null && !i) {
      const l = -parseInt(document.body.style.top, 10), f = -parseInt(document.body.style.left, 10);
      Object.assign(document.body.style, Cr), window.requestAnimationFrame(() => {
        if (o && s !== window.location.href) {
          a(window.location.href);
          return;
        }
        window.scrollTo(f, l);
      }), Cr = null;
    }
  }, [
    s
  ]);
  return k.useEffect(() => {
    function l() {
      c.current = window.scrollY;
    }
    return l(), window.addEventListener("scroll", l), () => {
      window.removeEventListener("scroll", l);
    };
  }, []), k.useEffect(() => {
    if (t)
      return () => {
        typeof document > "u" || document.querySelector("[data-vaul-drawer]") || d();
      };
  }, [
    t,
    d
  ]), k.useEffect(() => {
    n || !r || (e ? (!window.matchMedia("(display-mode: standalone)").matches && u(), t || window.setTimeout(() => {
      d();
    }, 500)) : d());
  }, [
    e,
    r,
    s,
    t,
    n,
    u,
    d
  ]), {
    restorePositionSetting: d
  };
}
function tm({ open: e, onOpenChange: t, children: n, onDrag: r, onRelease: o, snapPoints: i, shouldScaleBackground: s = !1, setBackgroundColorOnScale: a = !0, closeThreshold: c = HE, scrollLockTimeout: u = WE, dismissible: d = !0, handleOnly: l = !1, fadeFromIndex: f = i && i.length - 1, activeSnapPoint: g, setActiveSnapPoint: v, fixed: p, modal: b = !0, onClose: y, nested: S, noBodyStyles: w = !1, direction: _ = "bottom", defaultOpen: C = !1, disablePreventScroll: R = !0, snapToSequentialPoint: x = !1, preventScrollRestoration: E = !1, repositionInputs: I = !0, onAnimationEnd: M, container: N, autoFocus: $ = !1 }) {
  var T, O;
  const [F = !1, A] = em({
    defaultProp: C,
    prop: e,
    onChange: (se) => {
      t == null || t(se), !se && !S && ki(), setTimeout(() => {
        M == null || M(se);
      }, Fe.DURATION * 1e3), se && !b && typeof window < "u" && window.requestAnimationFrame(() => {
        document.body.style.pointerEvents = "auto";
      }), se || (document.body.style.pointerEvents = "auto");
    }
  }), [D, V] = k.useState(!1), [z, L] = k.useState(!1), [j, Z] = k.useState(!1), K = k.useRef(null), G = k.useRef(null), J = k.useRef(null), te = k.useRef(null), U = k.useRef(null), H = k.useRef(!1), Q = k.useRef(null), ee = k.useRef(0), ie = k.useRef(!1), W = k.useRef(!C), ge = k.useRef(0), re = k.useRef(null), Y = k.useRef(((T = re.current) == null ? void 0 : T.getBoundingClientRect().height) || 0), ye = k.useRef(((O = re.current) == null ? void 0 : O.getBoundingClientRect().width) || 0), De = k.useRef(0), at = k.useCallback((se) => {
    i && se === pt.length - 1 && (G.current = /* @__PURE__ */ new Date());
  }, []), { activeSnapPoint: Oe, activeSnapPointIndex: ht, setActiveSnapPoint: On, onRelease: Qe, snapPointsOffset: pt, onDrag: Mi, shouldFade: ao, getPercentageDragged: Pn } = qE({
    snapPoints: i,
    activeSnapPointProp: g,
    setActiveSnapPointProp: v,
    drawerRef: re,
    fadeFromIndex: f,
    overlayRef: K,
    onSnapPointChange: at,
    direction: _,
    container: N,
    snapToSequentialPoint: x
  });
  $E({
    isDisabled: !F || z || !b || j || !D || !I || !R
  });
  const { restorePositionSetting: ki } = XE({
    isOpen: F,
    modal: b,
    nested: S ?? !1,
    hasBeenOpened: D,
    preventScrollRestoration: E,
    noBodyStyles: w
  });
  function dn() {
    return (window.innerWidth - Ys) / window.innerWidth;
  }
  function br(se) {
    var Ce, Ne;
    !d && !i || re.current && !re.current.contains(se.target) || (Y.current = ((Ce = re.current) == null ? void 0 : Ce.getBoundingClientRect().height) || 0, ye.current = ((Ne = re.current) == null ? void 0 : Ne.getBoundingClientRect().width) || 0, L(!0), J.current = /* @__PURE__ */ new Date(), qp() && window.addEventListener("touchend", () => H.current = !1, {
      once: !0
    }), se.target.setPointerCapture(se.pointerId), ee.current = Ue(_) ? se.pageY : se.pageX);
  }
  function Lt(se, Ce) {
    var Ne;
    let ve = se;
    const $e = (Ne = window.getSelection()) == null ? void 0 : Ne.toString(), ae = re.current ? xo(re.current, _) : null, be = /* @__PURE__ */ new Date();
    if (ve.tagName === "SELECT" || ve.hasAttribute("data-vaul-no-drag") || ve.closest("[data-vaul-no-drag]"))
      return !1;
    if (_ === "right" || _ === "left")
      return !0;
    if (G.current && be.getTime() - G.current.getTime() < 500)
      return !1;
    if (ae !== null && (_ === "bottom" ? ae > 0 : ae < 0))
      return !0;
    if ($e && $e.length > 0)
      return !1;
    if (U.current && be.getTime() - U.current.getTime() < u && ae === 0 || Ce)
      return U.current = be, !1;
    for (; ve; ) {
      if (ve.scrollHeight > ve.clientHeight) {
        if (ve.scrollTop !== 0)
          return U.current = /* @__PURE__ */ new Date(), !1;
        if (ve.getAttribute("role") === "dialog")
          return !0;
      }
      ve = ve.parentNode;
    }
    return !0;
  }
  function co(se) {
    if (re.current && z) {
      const Ce = _ === "bottom" || _ === "right" ? 1 : -1, Ne = (ee.current - (Ue(_) ? se.pageY : se.pageX)) * Ce, ve = Ne > 0, $e = i && !d && !ve;
      if ($e && ht === 0) return;
      const ae = Math.abs(Ne), be = document.querySelector("[data-vaul-drawer-wrapper]"), Me = _ === "bottom" || _ === "top" ? Y.current : ye.current;
      let ke = ae / Me;
      const gt = Pn(ae, ve);
      if (gt !== null && (ke = gt), $e && ke >= 1 || !H.current && !Lt(se.target, ve)) return;
      if (re.current.classList.add(ls), H.current = !0, Ke(re.current, {
        transition: "none"
      }), Ke(K.current, {
        transition: "none"
      }), i && Mi({
        draggedDistance: Ne
      }), ve && !i) {
        const Le = jE(Ne), Ft = Math.min(Le * -1, 0) * Ce;
        Ke(re.current, {
          transform: Ue(_) ? `translate3d(0, ${Ft}px, 0)` : `translate3d(${Ft}px, 0, 0)`
        });
        return;
      }
      const Pe = 1 - ke;
      if ((ao || f && ht === f - 1) && (r == null || r(se, ke), Ke(K.current, {
        opacity: `${Pe}`,
        transition: "none"
      }, !0)), be && K.current && s) {
        const Le = Math.min(dn() + ke * (1 - dn()), 1), Ft = 8 - ke * 8, rt = Math.max(0, 14 - ke * 14);
        Ke(be, {
          borderRadius: `${Ft}px`,
          transform: Ue(_) ? `scale(${Le}) translate3d(0, ${rt}px, 0)` : `scale(${Le}) translate3d(${rt}px, 0, 0)`,
          transition: "none"
        }, !0);
      }
      if (!i) {
        const Le = ae * Ce;
        Ke(re.current, {
          transform: Ue(_) ? `translate3d(0, ${Le}px, 0)` : `translate3d(${Le}px, 0, 0)`
        });
      }
    }
  }
  k.useEffect(() => {
    window.requestAnimationFrame(() => {
      W.current = !0;
    });
  }, []), k.useEffect(() => {
    var se;
    function Ce() {
      if (!re.current || !I) return;
      const Ne = document.activeElement;
      if (Gs(Ne) || ie.current) {
        var ve;
        const $e = ((ve = window.visualViewport) == null ? void 0 : ve.height) || 0, ae = window.innerHeight;
        let be = ae - $e;
        const Me = re.current.getBoundingClientRect().height || 0, ke = Me > ae * 0.8;
        De.current || (De.current = Me);
        const gt = re.current.getBoundingClientRect().top;
        if (Math.abs(ge.current - be) > 60 && (ie.current = !ie.current), i && i.length > 0 && pt && ht) {
          const Pe = pt[ht] || 0;
          be += Pe;
        }
        if (ge.current = be, Me > $e || ie.current) {
          const Pe = re.current.getBoundingClientRect().height;
          let Le = Pe;
          Pe > $e && (Le = $e - (ke ? gt : Ys)), p ? re.current.style.height = `${Pe - Math.max(be, 0)}px` : re.current.style.height = `${Math.max(Le, $e - gt)}px`;
        } else NE() || (re.current.style.height = `${De.current}px`);
        i && i.length > 0 && !ie.current ? re.current.style.bottom = "0px" : re.current.style.bottom = `${Math.max(be, 0)}px`;
      }
    }
    return (se = window.visualViewport) == null || se.addEventListener("resize", Ce), () => {
      var Ne;
      return (Ne = window.visualViewport) == null ? void 0 : Ne.removeEventListener("resize", Ce);
    };
  }, [
    ht,
    i,
    pt
  ]);
  function mt(se) {
    Di(), y == null || y(), se || A(!1), setTimeout(() => {
      i && On(i[0]);
    }, Fe.DURATION * 1e3);
  }
  function lo() {
    if (!re.current) return;
    const se = document.querySelector("[data-vaul-drawer-wrapper]"), Ce = xo(re.current, _);
    Ke(re.current, {
      transform: "translate3d(0, 0, 0)",
      transition: `transform ${Fe.DURATION}s cubic-bezier(${Fe.EASE.join(",")})`
    }), Ke(K.current, {
      transition: `opacity ${Fe.DURATION}s cubic-bezier(${Fe.EASE.join(",")})`,
      opacity: "1"
    }), s && Ce && Ce > 0 && F && Ke(se, {
      borderRadius: `${Jp}px`,
      overflow: "hidden",
      ...Ue(_) ? {
        transform: `scale(${dn()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`,
        transformOrigin: "top"
      } : {
        transform: `scale(${dn()}) translate3d(calc(env(safe-area-inset-top) + 14px), 0, 0)`,
        transformOrigin: "left"
      },
      transitionProperty: "transform, border-radius",
      transitionDuration: `${Fe.DURATION}s`,
      transitionTimingFunction: `cubic-bezier(${Fe.EASE.join(",")})`
    }, !0);
  }
  function Di() {
    !z || !re.current || (re.current.classList.remove(ls), H.current = !1, L(!1), te.current = /* @__PURE__ */ new Date());
  }
  function uo(se) {
    if (!z || !re.current) return;
    re.current.classList.remove(ls), H.current = !1, L(!1), te.current = /* @__PURE__ */ new Date();
    const Ce = xo(re.current, _);
    if (!se || !Lt(se.target, !1) || !Ce || Number.isNaN(Ce) || J.current === null) return;
    const Ne = te.current.getTime() - J.current.getTime(), ve = ee.current - (Ue(_) ? se.pageY : se.pageX), $e = Math.abs(ve) / Ne;
    if ($e > 0.05 && (Z(!0), setTimeout(() => {
      Z(!1);
    }, 200)), i) {
      Qe({
        draggedDistance: ve * (_ === "bottom" || _ === "right" ? 1 : -1),
        closeDrawer: mt,
        velocity: $e,
        dismissible: d
      }), o == null || o(se, !0);
      return;
    }
    if (_ === "bottom" || _ === "right" ? ve > 0 : ve < 0) {
      lo(), o == null || o(se, !0);
      return;
    }
    if ($e > Zp) {
      mt(), o == null || o(se, !1);
      return;
    }
    var ae;
    const be = Math.min((ae = re.current.getBoundingClientRect().height) != null ? ae : 0, window.innerHeight);
    var Me;
    const ke = Math.min((Me = re.current.getBoundingClientRect().width) != null ? Me : 0, window.innerWidth), gt = _ === "left" || _ === "right";
    if (Math.abs(Ce) >= (gt ? ke : be) * c) {
      mt(), o == null || o(se, !1);
      return;
    }
    o == null || o(se, !0), lo();
  }
  k.useEffect(() => (F && (Ke(document.documentElement, {
    scrollBehavior: "auto"
  }), G.current = /* @__PURE__ */ new Date()), () => {
    zE(document.documentElement, "scrollBehavior");
  }), [
    F
  ]);
  function fo(se) {
    const Ce = se ? (window.innerWidth - pn) / window.innerWidth : 1, Ne = se ? -pn : 0;
    Q.current && window.clearTimeout(Q.current), Ke(re.current, {
      transition: `transform ${Fe.DURATION}s cubic-bezier(${Fe.EASE.join(",")})`,
      transform: Ue(_) ? `scale(${Ce}) translate3d(0, ${Ne}px, 0)` : `scale(${Ce}) translate3d(${Ne}px, 0, 0)`
    }), !se && re.current && (Q.current = setTimeout(() => {
      const ve = xo(re.current, _);
      Ke(re.current, {
        transition: "none",
        transform: Ue(_) ? `translate3d(0, ${ve}px, 0)` : `translate3d(${ve}px, 0, 0)`
      });
    }, 500));
  }
  function $i(se, Ce) {
    if (Ce < 0) return;
    const Ne = (window.innerWidth - pn) / window.innerWidth, ve = Ne + Ce * (1 - Ne), $e = -pn + Ce * pn;
    Ke(re.current, {
      transform: Ue(_) ? `scale(${ve}) translate3d(0, ${$e}px, 0)` : `scale(${ve}) translate3d(${$e}px, 0, 0)`,
      transition: "none"
    });
  }
  function Sr(se, Ce) {
    const Ne = Ue(_) ? window.innerHeight : window.innerWidth, ve = Ce ? (Ne - pn) / Ne : 1, $e = Ce ? -pn : 0;
    Ce && Ke(re.current, {
      transition: `transform ${Fe.DURATION}s cubic-bezier(${Fe.EASE.join(",")})`,
      transform: Ue(_) ? `scale(${ve}) translate3d(0, ${$e}px, 0)` : `scale(${ve}) translate3d(${$e}px, 0, 0)`
    });
  }
  return k.useEffect(() => {
    b || window.requestAnimationFrame(() => {
      document.body.style.pointerEvents = "auto";
    });
  }, [
    b
  ]), /* @__PURE__ */ k.createElement(uh, {
    defaultOpen: C,
    onOpenChange: (se) => {
      !d && !se || (se ? V(!0) : mt(!0), A(se));
    },
    open: F
  }, /* @__PURE__ */ k.createElement(Kp.Provider, {
    value: {
      activeSnapPoint: Oe,
      snapPoints: i,
      setActiveSnapPoint: On,
      drawerRef: re,
      overlayRef: K,
      onOpenChange: t,
      onPress: br,
      onRelease: uo,
      onDrag: co,
      dismissible: d,
      shouldAnimate: W,
      handleOnly: l,
      isOpen: F,
      isDragging: z,
      shouldFade: ao,
      closeDrawer: mt,
      onNestedDrag: $i,
      onNestedOpenChange: fo,
      onNestedRelease: Sr,
      keyboardIsOpen: ie,
      modal: b,
      snapPointsOffset: pt,
      activeSnapPointIndex: ht,
      direction: _,
      shouldScaleBackground: s,
      setBackgroundColorOnScale: a,
      noBodyStyles: w,
      container: N,
      autoFocus: $
    }
  }, n));
}
const nm = /* @__PURE__ */ k.forwardRef(function({ ...e }, t) {
  const { overlayRef: n, snapPoints: r, onRelease: o, shouldFade: i, isOpen: s, modal: a, shouldAnimate: c } = dr(), u = Yp(t, n), d = r && r.length > 0;
  if (!a)
    return null;
  const l = k.useCallback((f) => o(f), [
    o
  ]);
  return /* @__PURE__ */ k.createElement(hh, {
    onMouseUp: l,
    ref: u,
    "data-vaul-overlay": "",
    "data-vaul-snap-points": s && d ? "true" : "false",
    "data-vaul-snap-points-overlay": s && i ? "true" : "false",
    "data-vaul-animate": c != null && c.current ? "true" : "false",
    ...e
  });
});
nm.displayName = "Drawer.Overlay";
const rm = /* @__PURE__ */ k.forwardRef(function({ onPointerDownOutside: e, style: t, onOpenAutoFocus: n, ...r }, o) {
  const { drawerRef: i, onPress: s, onRelease: a, onDrag: c, keyboardIsOpen: u, snapPointsOffset: d, activeSnapPointIndex: l, modal: f, isOpen: g, direction: v, snapPoints: p, container: b, handleOnly: y, shouldAnimate: S, autoFocus: w } = dr(), [_, C] = k.useState(!1), R = Yp(o, i), x = k.useRef(null), E = k.useRef(null), I = k.useRef(!1), M = p && p.length > 0;
  YE();
  const N = (T, O, F = 0) => {
    if (I.current) return !0;
    const A = Math.abs(T.y), D = Math.abs(T.x), V = D > A, z = [
      "bottom",
      "right"
    ].includes(O) ? 1 : -1;
    if (O === "left" || O === "right") {
      if (!(T.x * z < 0) && D >= 0 && D <= F)
        return V;
    } else if (!(T.y * z < 0) && A >= 0 && A <= F)
      return !V;
    return I.current = !0, !0;
  };
  k.useEffect(() => {
    M && window.requestAnimationFrame(() => {
      C(!0);
    });
  }, []);
  function $(T) {
    x.current = null, I.current = !1, a(T);
  }
  return /* @__PURE__ */ k.createElement(ph, {
    "data-vaul-drawer-direction": v,
    "data-vaul-drawer": "",
    "data-vaul-delayed-snap-points": _ ? "true" : "false",
    "data-vaul-snap-points": g && M ? "true" : "false",
    "data-vaul-custom-container": b ? "true" : "false",
    "data-vaul-animate": S != null && S.current ? "true" : "false",
    ...r,
    ref: R,
    style: d && d.length > 0 ? {
      "--snap-point-height": `${d[l ?? 0]}px`,
      ...t
    } : t,
    onPointerDown: (T) => {
      y || (r.onPointerDown == null || r.onPointerDown.call(r, T), x.current = {
        x: T.pageX,
        y: T.pageY
      }, s(T));
    },
    onOpenAutoFocus: (T) => {
      n == null || n(T), w || T.preventDefault();
    },
    onPointerDownOutside: (T) => {
      if (e == null || e(T), !f || T.defaultPrevented) {
        T.preventDefault();
        return;
      }
      u.current && (u.current = !1);
    },
    onFocusOutside: (T) => {
      if (!f) {
        T.preventDefault();
        return;
      }
    },
    onPointerMove: (T) => {
      if (E.current = T, y || (r.onPointerMove == null || r.onPointerMove.call(r, T), !x.current)) return;
      const O = T.pageY - x.current.y, F = T.pageX - x.current.x, A = T.pointerType === "touch" ? 10 : 2;
      N({
        x: F,
        y: O
      }, v, A) ? c(T) : (Math.abs(F) > A || Math.abs(O) > A) && (x.current = null);
    },
    onPointerUp: (T) => {
      r.onPointerUp == null || r.onPointerUp.call(r, T), x.current = null, I.current = !1, a(T);
    },
    onPointerOut: (T) => {
      r.onPointerOut == null || r.onPointerOut.call(r, T), $(E.current);
    },
    onContextMenu: (T) => {
      r.onContextMenu == null || r.onContextMenu.call(r, T), E.current && $(E.current);
    }
  });
});
rm.displayName = "Drawer.Content";
const ZE = 250, JE = 120, QE = /* @__PURE__ */ k.forwardRef(function({ preventCycle: e = !1, children: t, ...n }, r) {
  const { closeDrawer: o, isDragging: i, snapPoints: s, activeSnapPoint: a, setActiveSnapPoint: c, dismissible: u, handleOnly: d, isOpen: l, onPress: f, onDrag: g } = dr(), v = k.useRef(null), p = k.useRef(!1);
  function b() {
    if (p.current) {
      w();
      return;
    }
    window.setTimeout(() => {
      y();
    }, JE);
  }
  function y() {
    if (i || e || p.current) {
      w();
      return;
    }
    if (w(), !s || s.length === 0) {
      u || o();
      return;
    }
    if (a === s[s.length - 1] && u) {
      o();
      return;
    }
    const C = s.findIndex((x) => x === a);
    if (C === -1) return;
    const R = s[C + 1];
    c(R);
  }
  function S() {
    v.current = window.setTimeout(() => {
      p.current = !0;
    }, ZE);
  }
  function w() {
    v.current && window.clearTimeout(v.current), p.current = !1;
  }
  return /* @__PURE__ */ k.createElement("div", {
    onClick: b,
    onPointerCancel: w,
    onPointerDown: (_) => {
      d && f(_), S();
    },
    onPointerMove: (_) => {
      d && g(_);
    },
    // onPointerUp is already handled by the content component
    ref: r,
    "data-vaul-drawer-visible": l ? "true" : "false",
    "data-vaul-handle": "",
    "aria-hidden": "true",
    ...n
  }, /* @__PURE__ */ k.createElement("span", {
    "data-vaul-handle-hitarea": "",
    "aria-hidden": "true"
  }, t));
});
QE.displayName = "Drawer.Handle";
function e1({ onDrag: e, onOpenChange: t, open: n, ...r }) {
  const { onNestedDrag: o, onNestedOpenChange: i, onNestedRelease: s } = dr();
  if (!o)
    throw new Error("Drawer.NestedRoot must be placed in another drawer");
  return /* @__PURE__ */ k.createElement(tm, {
    nested: !0,
    open: n,
    onClose: () => {
      i(!1);
    },
    onDrag: (a, c) => {
      o(a, c), e == null || e(a, c);
    },
    onOpenChange: (a) => {
      a && i(a), t == null || t(a);
    },
    onRelease: s,
    ...r
  });
}
function t1(e) {
  const t = dr(), { container: n = t.container, ...r } = e;
  return /* @__PURE__ */ k.createElement(fh, {
    container: n,
    ...r
  });
}
const Ae = {
  Root: tm,
  NestedRoot: e1,
  Content: rm,
  Overlay: nm,
  Trigger: dh,
  Portal: t1,
  Close: gh,
  Title: mh
}, cc = or("outside");
function om() {
  return xn(cc) !== "outside";
}
function fr({ children: e, ...t }) {
  const n = om(), r = n ? Ae.NestedRoot : Ae.Root;
  return /* @__PURE__ */ h(r, { ...t, children: /* @__PURE__ */ h(cc.Provider, { value: n ? "nested" : "root", children: e }) });
}
function hr(e) {
  const t = xn(cc) === "nested", n = Ye();
  return /* @__PURE__ */ h(
    Ae.Overlay,
    {
      ...e,
      style: { ...n, ...e.style },
      "data-sheet-nested": t ? "true" : void 0
    }
  );
}
function vn({ enabled: e = !0, asChild: t, ...n }) {
  const r = om(), o = t ? n.children : /* @__PURE__ */ h(le, { ...n });
  return e && r ? /* @__PURE__ */ h(Ae.Close, { asChild: !0, children: o }) : o;
}
var n1 = "_1yxu65s0", r1 = "_1yxu65s1", o1 = "_1yxu65s2", i1 = "_1yxu65s3", s1 = "_1yxu65s4", a1 = "_1yxu65s5";
function lc({
  open: e,
  onOpenChange: t,
  title: n,
  titleAction: r,
  trigger: o,
  closeLabel: i = "Cancel",
  onCloseAutoFocus: s,
  layer: a = "action",
  showCloseButton: c = !0,
  children: u
}) {
  const d = Se(), l = Ye(), f = a === "navigation" ? r1 : n1;
  return /* @__PURE__ */ P(fr, { open: e, onOpenChange: t, autoFocus: !0, children: [
    o && /* @__PURE__ */ h(Ae.Trigger, { asChild: !0, children: o }),
    /* @__PURE__ */ P(Ae.Portal, { children: [
      /* @__PURE__ */ h(hr, { className: X(ar, f), "data-theme": d }),
      /* @__PURE__ */ P(
        Ae.Content,
        {
          style: l,
          className: X(ww, f),
          "aria-describedby": void 0,
          "data-theme": d,
          onCloseAutoFocus: s,
          children: [
            /* @__PURE__ */ h("div", { className: o1, "aria-hidden": !0 }),
            /* @__PURE__ */ P("div", { className: i1, "data-has-title-action": r ? "true" : void 0, children: [
              r,
              /* @__PURE__ */ h(Ae.Title, { className: s1, children: n })
            ] }),
            u,
            c && /* @__PURE__ */ P(vn, { className: a1, children: [
              /* @__PURE__ */ h(li, { size: Ie.iconSize }),
              i
            ] })
          ]
        }
      )
    ] })
  ] });
}
var im = "whbz460", c1 = "whbz461", sm = "whbz462 _14sdsl36", l1 = "whbz463", am = "whbz464", u1 = "whbz465", cm = "whbz466", lm = "whbz467", um = "whbz468", d1 = "whbz469", f1 = "whbz46a", h1 = "whbz46b";
function uc(e) {
  return "items" in e;
}
function p1(e) {
  var t;
  return (t = e.find((n) => !uc(n) && n.selected)) == null ? void 0 : t.id;
}
function m1(e, t, n) {
  return n === "single" ? /* @__PURE__ */ h(nt, { asChild: !0, layout: "leading", children: /* @__PURE__ */ P(
    qs,
    {
      "aria-current": e.selected ? "true" : void 0,
      disabled: e.disabled,
      value: e.id,
      onSelect: () => {
        var r;
        (r = e.onSelect) == null || r.call(e, e, t);
      },
      children: [
        /* @__PURE__ */ h("span", { className: u1, children: /* @__PURE__ */ h(Xn, { children: /* @__PURE__ */ h(yt, { "aria-hidden": "true", size: 14 }) }) }),
        /* @__PURE__ */ h("span", { children: e.label })
      ]
    }
  ) }, e.id) : /* @__PURE__ */ h(nt, { asChild: !0, children: /* @__PURE__ */ h(
    ei,
    {
      disabled: e.disabled,
      onSelect: () => {
        var r;
        (r = e.onSelect) == null || r.call(e, e, t);
      },
      children: e.label
    }
  ) }, e.id);
}
function Xs(e, t, n, r, o, i) {
  return uc(e) ? /* @__PURE__ */ P(CE, { children: [
    /* @__PURE__ */ h(nt, { asChild: !0, layout: "trailing", children: /* @__PURE__ */ P(xE, { disabled: e.disabled, children: [
      /* @__PURE__ */ h("span", { children: e.label }),
      /* @__PURE__ */ h(ai, { "aria-hidden": "true", className: um, size: 14 })
    ] }) }),
    /* @__PURE__ */ h(ur, { container: r, children: /* @__PURE__ */ h(
      EE,
      {
        style: i,
        alignOffset: -4,
        avoidCollisions: !0,
        className: X(im, c1),
        collisionPadding: 8,
        sideOffset: 8,
        "data-theme": o,
        children: /* @__PURE__ */ h("div", { className: sm, children: e.items.map(
          (s) => Xs(s, t, void 0, r, o, i)
        ) })
      }
    ) })
  ] }, e.id) : m1(e, t, n);
}
function g1(e, t, n, r) {
  const o = r === "single";
  return /* @__PURE__ */ h(vn, { asChild: !0, children: /* @__PURE__ */ P(
    nt,
    {
      presentation: "sheet",
      layout: o ? "leading" : "trailing",
      "aria-checked": o ? !!e.selected : void 0,
      disabled: e.disabled,
      role: o ? "radio" : void 0,
      onClick: () => {
        var i;
        (i = e.onSelect) == null || i.call(e, e, t), n();
      },
      children: [
        o ? /* @__PURE__ */ h("span", { className: h1, children: e.selected ? /* @__PURE__ */ h(yt, { "aria-hidden": "true", size: 16 }) : null }) : null,
        /* @__PURE__ */ h("span", { children: e.label })
      ]
    }
  ) }, e.id);
}
function v1(e, t, n, r) {
  return uc(e) ? /* @__PURE__ */ P(
    nt,
    {
      presentation: "sheet",
      layout: "trailing",
      type: "button",
      disabled: e.disabled,
      onClick: () => {
        r == null || r({
          label: e.label,
          groups: [
            {
              id: e.id,
              items: e.items,
              callbackGroup: t.callbackGroup
            }
          ]
        });
      },
      children: [
        /* @__PURE__ */ h("span", { children: e.label }),
        /* @__PURE__ */ h(ai, { "aria-hidden": "true", className: um, size: 16 })
      ]
    },
    e.id
  ) : g1(e, t.callbackGroup, n, t.selectionMode);
}
function y1(e, t, n, r) {
  return /* @__PURE__ */ P(
    "div",
    {
      className: f1,
      role: e.selectionMode === "single" ? "radiogroup" : void 0,
      "aria-label": typeof e.label == "string" ? e.label : void 0,
      children: [
        t > 0 && /* @__PURE__ */ h("div", { className: lm }),
        e.label && /* @__PURE__ */ h("div", { className: am, children: e.label }),
        e.items.length === 0 && e.emptyLabel ? /* @__PURE__ */ h("div", { className: cm, children: e.emptyLabel }) : e.items.map((o) => v1(o, e, n, r))
      ]
    },
    e.id
  );
}
function b1(e) {
  return e.map((t) => ({
    id: t.id,
    label: t.label,
    emptyLabel: t.emptyLabel,
    items: t.items,
    selectionMode: t.selectionMode,
    callbackGroup: t
  }));
}
function S1({ label: e, trigger: t, visibleGroups: n }) {
  const [r, o] = ne(!1), [i, s] = ne([]), a = () => {
    o(!1), s([]);
  }, c = (v) => {
    o(v), v || s([]);
  }, u = (v) => {
    s((p) => [...p, v]);
  }, d = () => {
    s((v) => v.slice(0, -1));
  }, l = {
    label: e,
    groups: b1(n)
  }, f = i[i.length - 1] ?? l, g = i.length > 0;
  return /* @__PURE__ */ h(
    lc,
    {
      open: r,
      onOpenChange: c,
      title: f.label,
      titleAction: g ? /* @__PURE__ */ h(le, { kind: "icon", appearance: "quiet", type: "button", "aria-label": "Back", onClick: d, children: /* @__PURE__ */ h(Aa, { "aria-hidden": "true", size: 16 }) }) : null,
      trigger: t,
      closeLabel: "Cancel",
      children: /* @__PURE__ */ h("div", { className: d1, children: f.groups.map(
        (v, p) => y1(v, p, a, u)
      ) })
    }
  );
}
function er({
  label: e,
  groups: t,
  trigger: n,
  triggerDisabled: r = !1,
  triggerIcon: o,
  triggerClassName: i,
  dropdownOptions: s,
  isMobile: a
}) {
  const c = Se(), u = Ye(), d = t.filter((y) => y.items.length > 0 || y.emptyLabel), {
    className: l,
    style: f,
    portalContainer: g,
    ...v
  } = s ?? {}, p = r || !!(n != null && n.props.disabled), b = n ? Kd(n, {
    disabled: p
  }) : /* @__PURE__ */ h(
    N_,
    {
      type: "button",
      "aria-label": e,
      overrideClassName: i,
      disabled: p,
      children: o ?? /* @__PURE__ */ h(Oa, { "aria-hidden": "true", size: 12 })
    }
  );
  return a ? /* @__PURE__ */ h(S1, { label: e, trigger: b, visibleGroups: d }) : /* @__PURE__ */ P(Jr, { modal: !1, children: [
    /* @__PURE__ */ h(Qr, { asChild: !0, disabled: p, children: b }),
    /* @__PURE__ */ h(ur, { container: g, children: /* @__PURE__ */ h(
      eo,
      {
        align: "start",
        "aria-label": e,
        avoidCollisions: !0,
        className: X(im, l),
        collisionPadding: 8,
        sideOffset: 10,
        style: { ...u, ...f },
        "data-theme": c,
        ...v,
        children: /* @__PURE__ */ h("div", { className: sm, children: d.map((y, S) => /* @__PURE__ */ P(wE, { className: l1, children: [
          S > 0 && /* @__PURE__ */ h(Wp, { className: lm }),
          y.label && /* @__PURE__ */ h(_E, { className: am, children: y.label }),
          y.items.length === 0 ? /* @__PURE__ */ h("div", { className: cm, children: y.emptyLabel }) : y.selectionMode === "single" ? /* @__PURE__ */ h(Hp, { value: p1(y.items), children: y.items.map(
            (w) => Xs(w, y, y.selectionMode, g, c, u)
          ) }) : y.items.map((w) => Xs(w, y, void 0, g, c, u))
        ] }, y.id)) })
      }
    ) })
  ] });
}
const zo = {
  Spotlight: "Spotlight",
  Unmute: "Unmute"
};
function w1() {
  const { client: e } = _e(), [t, n] = ne(!1), [r, o] = ne(zo.Unmute), i = q(() => {
    n(!1);
  }, []), s = q((a) => {
    const c = a == null ? void 0 : a.reason;
    if (c !== zo.Spotlight && c !== zo.Unmute) {
      console.warn("Ignoring host-ask-unmute-audio event with missing or unsupported reason.", {
        reason: c
      });
      return;
    }
    o(c), n(!0);
  }, []);
  return oe(() => {
    if (e)
      return e.on("host-ask-unmute-audio", s), () => {
        e.off("host-ask-unmute-audio", s);
      };
  }, [e, s]), {
    open: t,
    reason: r,
    dismiss: i
  };
}
var _1 = "_1yc395m0";
function C1({ audioState: e, acceptConsent: t }) {
  const { open: n, reason: r, dismiss: o } = w1(), i = e.isJoined && !e.isMuted;
  return oe(() => {
    n && i && o();
  }, [o, i, n]), /* @__PURE__ */ h(
    x1,
    {
      open: n && !i,
      reason: r,
      isAudioJoined: e.isJoined,
      acceptConsent: t,
      dismiss: o
    }
  );
}
function x1({
  open: e,
  reason: t,
  isAudioJoined: n,
  acceptConsent: r,
  dismiss: o
}) {
  const { t: i } = de(), [s, a] = ne(!1), c = he(() => t === zo.Spotlight ? {
    title: i("notification.unmute_title"),
    content: i(n ? "notification.spotlight_unmute_content" : "notification.spotlight_join_audio_content"),
    okText: i(n ? "notification.spotlight_unmute_myself" : "notification.spotlight_join_audio"),
    cancelText: i("notification.later")
  } : {
    title: i("notification.unmute_title"),
    content: i("notification.unmute_content"),
    okText: i("notification.unmute_button"),
    cancelText: i("notification.stay_muted")
  }, [n, t, i]), u = async () => {
    a(!0);
    try {
      await r();
    } finally {
      a(!1), o();
    }
  };
  return /* @__PURE__ */ h(
    Sn,
    {
      open: e,
      onOpenChange: (d) => !d && o(),
      title: c.title,
      description: c.content,
      showCloseButton: !1,
      children: /* @__PURE__ */ P("div", { className: _1, children: [
        /* @__PURE__ */ h(le, { type: "button", onClick: o, disabled: s, children: c.cancelText }),
        /* @__PURE__ */ h(
          le,
          {
            tone: "accent",
            type: "button",
            onClick: () => void u(),
            disabled: s,
            "aria-busy": s,
            children: c.okText
          }
        )
      ] })
    }
  );
}
function dm(e) {
  return !e || typeof e != "object" || !("type" in e) || typeof e.type != "string" ? null : e.type;
}
function E1(e) {
  switch (dm(e)) {
    case "INSUFFICIENT_PRIVILEGES":
      return "media.start_audio_permission_denied";
    default:
      return "media.start_audio_failed";
  }
}
function ti(e, t) {
  return e instanceof Error && e.message ? e.message : typeof e == "object" && e && "reason" in e && typeof e.reason == "string" ? e.reason : typeof e == "object" && e && "type" in e && typeof e.type == "string" ? e.type : t;
}
function Ln(e, t) {
  return R1(e) ? { type: "permission", message: ti(e, t) } : { type: "operation", message: ti(e, t) };
}
function R1(e) {
  if (typeof e != "object" || !e) return !1;
  const t = "type" in e ? e.type : void 0, n = "reason" in e ? e.reason : void 0;
  return t === "INSUFFICIENT_PRIVILEGES" || n === "AUDIO_CAPTURE_FAILED";
}
function fm() {
  var R, x;
  const { t: e } = de(), { client: t } = _e(), n = B((E) => E.audioState), r = B((E) => E.deviceState), o = B((E) => E.sessionState.connectionState), i = B((E) => E.participantState.currentUser), s = B((E) => E.setAudioState), a = B((E) => E.setDeviceState), c = Re(t), u = !!c, d = !!((R = c == null ? void 0 : c.isSupportBackgroundNoiseSuppression) != null && R.call(c)), l = typeof ((x = window.navigator.hid) == null ? void 0 : x.requestDevice) == "function", f = n.noiseSuppression;
  oe(() => {
    s({
      isJoined: (i == null ? void 0 : i.audio) === "computer" || (i == null ? void 0 : i.audio) === "phone",
      isMuted: (i == null ? void 0 : i.muted) ?? !0
    });
  }, [i == null ? void 0 : i.audio, i == null ? void 0 : i.muted, s]);
  const g = q(
    async (E) => {
      if (!c) return;
      s({ isLoading: !0, warning: null });
      const I = (E == null ? void 0 : E.muted) ?? !1;
      try {
        await c.startAudio({
          microphoneId: r.activeMicrophoneId ?? void 0,
          speakerId: r.activeSpeakerId ?? void 0,
          mute: I,
          backgroundNoiseSuppression: f
        });
      } catch (M) {
        s({
          isLoading: !1,
          warning: Ln(M, e("media.start_audio_failed"))
        }), Ve.error(e(E1(M)), { position: "top-center", duration: 3e3 });
        return;
      }
      en(c), s({
        noiseSuppressionEnabled: f,
        isLoading: !1,
        warning: null
      });
    },
    [f, c, r.activeMicrophoneId, r.activeSpeakerId, s, e]
  ), v = q(
    async (E) => {
      if (c) {
        s({ isLoading: !0, warning: null });
        try {
          E ? await c.muteAudio() : await c.unmuteAudio(), s({ isLoading: !1, warning: null });
        } catch (I) {
          s({
            isLoading: !1,
            warning: Ln(I, e("media.toggle_audio_failed"))
          });
        }
      }
    },
    [c, s, e]
  ), p = q(async () => {
    if (c) {
      if (!n.isJoined) {
        await g({ muted: !1 });
        return;
      }
      await v(!n.isMuted);
    }
  }, [c, g, v, n.isJoined, n.isMuted]), b = q(async () => {
    if (c) {
      s({ isLoading: !0, warning: null });
      try {
        await c.stopAudio(), en(c), s({ isLoading: !1, warning: null });
      } catch (E) {
        s({
          isLoading: !1,
          warning: Ln(E, e("media.leave_audio_failed"))
        });
      }
    }
  }, [c, s, e]), y = q(
    async (E) => {
      if (c) {
        s({ warning: null }), a({ isSwitchingMicrophone: !0 });
        try {
          await c.switchMicrophone(E), o === we.Connected && (a({ activeMicrophoneId: E }), en(c));
        } catch (I) {
          s({
            warning: { type: "operation", message: ti(I, e("media.switch_microphone_failed")) }
          });
        } finally {
          a({ isSwitchingMicrophone: !1 });
        }
      }
    },
    [c, o, s, a, e]
  ), S = q(
    async (E) => {
      if (c) {
        s({ warning: null }), a({ isSwitchingSpeaker: !0 });
        try {
          await c.switchSpeaker(E), o === we.Connected && (a({ activeSpeakerId: E }), en(c));
        } catch (I) {
          s({
            warning: { type: "operation", message: ti(I, e("media.switch_speaker_failed")) }
          });
        } finally {
          a({ isSwitchingSpeaker: !1 });
        }
      }
    },
    [c, o, s, a, e]
  ), w = q(
    async (E) => {
      if (c)
        try {
          E && n.originalSound && (await c.enableOriginalSound(!1), s({ originalSound: !1 })), await c.enableBackgroundNoiseSuppression(E), s({ noiseSuppressionEnabled: E });
        } catch (I) {
          console.warn("Failed to set noise suppression", I), s({ warning: Ln(I, e("media.noise_suppression_failed")) });
        }
    },
    [c, s, n.originalSound, e]
  ), _ = q(
    async (E) => {
      if (c)
        try {
          E && n.noiseSuppressionEnabled && (await c.enableBackgroundNoiseSuppression(!1), s({ noiseSuppressionEnabled: !1 })), await c.enableOriginalSound(E), s({ originalSound: E });
        } catch (I) {
          console.warn("Failed to set original sound", I), s({ warning: Ln(I, e("media.original_sound_failed")) });
        }
    },
    [c, s, n.noiseSuppressionEnabled, e]
  ), C = q(
    async (E) => {
      if (c)
        try {
          await c.enableSyncButtonsOnHeadset(E), s({ headsetSync: E });
        } catch (I) {
          console.warn("Failed to set headset sync", I), s({ warning: Ln(I, e("media.headset_sync_failed")) });
        }
    },
    [c, s, e]
  );
  return {
    audioState: n,
    canControlAudio: u,
    canUseNoiseSuppression: d,
    canUseHeadsetSync: l,
    toggleAudio: p,
    joinAudio: g,
    leaveAudio: b,
    switchMicrophone: y,
    switchSpeaker: S,
    setNoiseSuppression: w,
    setOriginalSound: _,
    setHeadsetSync: C
  };
}
function I1(e) {
  switch (dm(e)) {
    case "CAN_NOT_DETECT_CAMERA":
      return "media.video_no_camera";
    case "CAN_NOT_FIND_CAMERA":
      return "media.video_camera_unavailable";
    case "VIDEO_USER_FORBIDDEN_CAPTURE":
    case "VIDEO_CAMERA_PERMISSION_DENIED":
      return "media.video_permission_denied";
    case "VIDEO_CAMERA_IS_TAKEN":
    case "VIDEO_CAMERA_TAKEN":
      return "media.video_camera_in_use";
    case "VIDEO_ESTABLISH_STREAM_ERROR":
      return "media.video_connection_failed";
    default:
      return "media.video_capture_failed";
  }
}
function mu(e, t) {
  return e instanceof Error && e.message ? e.message : typeof e == "object" && e && "reason" in e && typeof e.reason == "string" ? e.reason : typeof e == "object" && e && "type" in e && typeof e.type == "string" ? e.type : t;
}
function Fn(e, t) {
  return T1(e) ? { type: "permission", message: mu(e, t) } : { type: "operation", message: mu(e, t) };
}
function T1(e) {
  if (typeof e != "object" || !e) return !1;
  const t = "type" in e ? e.type : void 0, n = "reason" in e ? e.reason : void 0, r = "errorCode" in e ? e.errorCode : void 0;
  return n === "VIDEO_CAMERA_PERMISSION_DENIED" || n === "VIDEO_USER_FORBIDDEN_CAPTURE" || t === "VIDEO_CAMERA_PERMISSION_DENIED" || t === "VIDEO_USER_FORBIDDEN_CAPTURE" || r === 6100;
}
function hm() {
  var y, S;
  const { t: e } = de(), { client: t } = _e(), n = B((w) => w.sessionState.connectionState), r = B((w) => w.deviceState), o = B((w) => w.videoState), i = B((w) => w.participantState.currentUser), s = B((w) => w.setDeviceState), a = B((w) => w.setVideoState), c = !!Re(t), u = !!((S = (y = Re(t)) == null ? void 0 : y.isSupportVirtualBackground) != null && S.call(y)) && o.isVirtualBackgroundReady;
  oe(() => {
    a({ isVideoOn: (i == null ? void 0 : i.bVideoOn) ?? !1 });
  }, [i == null ? void 0 : i.bVideoOn, a]);
  const d = q(async () => {
    var _;
    const w = Re(t);
    if (w != null && w.startVideo) {
      a({ isLoading: !0, warning: null });
      try {
        await w.startVideo({
          cameraId: r.activeCameraId ?? "default",
          mirrored: o.isMirrored,
          hd: !0,
          ...u && {
            virtualBackground: {
              imageUrl: ((_ = o.virtualBackgroundImageList.find((C) => C.id === o.vbImageId)) == null ? void 0 : _.url) || void 0
            }
          }
        }), await en(w), a({ isLoading: !1, warning: null });
      } catch (C) {
        a({
          isLoading: !1,
          warning: Fn(C, e("media.video_capture_failed"))
        }), Ve.error(e(I1(C)), { position: "top-center", duration: 3e3 });
      }
    }
  }, [
    u,
    t,
    r.activeCameraId,
    a,
    e,
    o.isMirrored,
    o.vbImageId,
    o.virtualBackgroundImageList
  ]), l = q(async () => {
    const w = Re(t);
    if (w != null && w.stopVideo) {
      a({ isLoading: !0, warning: null });
      try {
        await w.stopVideo(), a({ isLoading: !1, warning: null });
      } catch (_) {
        a({
          isLoading: !1,
          warning: Fn(_, e("media.stop_video_failed"))
        });
      }
    }
  }, [t, a, e]), f = q(async () => {
    if (Re(t)) {
      if (o.isVideoOn) {
        await l();
        return;
      }
      await d();
    }
  }, [t, d, l, o.isVideoOn]), g = q(
    async (w) => {
      var C;
      if (n !== we.Connected) return;
      if (a({ warning: null }), !o.isVideoOn) {
        s({ activeCameraId: w });
        return;
      }
      const _ = Re(t);
      if (_ != null && _.switchCamera) {
        s({ isSwitchingCamera: !0 });
        try {
          if (await _.switchCamera(w), await en(_), s({ activeCameraId: w }), o.isMirrored)
            try {
              await ((C = _.mirrorVideo) == null ? void 0 : C.call(_, !0));
            } catch {
              console.log("Failed to re-apply mirroring after switching camera");
            }
        } catch (R) {
          a({
            warning: Fn(R, e("media.switch_camera_failed"))
          });
        } finally {
          s({ isSwitchingCamera: !1 });
        }
      }
    },
    [t, n, s, a, e, o.isVideoOn, o.isMirrored]
  ), v = q(
    async (w) => {
      const _ = Re(t);
      try {
        await (_ == null ? void 0 : _.mirrorVideo(w)), a({ isMirrored: w, warning: null });
      } catch (C) {
        a({ warning: Fn(C, e("media.mirror_video_failed")) });
      }
    },
    [t, a, e]
  ), p = q(
    async (w) => {
      const _ = Re(t);
      try {
        if (!await (_ == null ? void 0 : _.enableHardwareAcceleration(w))) return;
        a({
          ...w.decode !== void 0 && { hardwareAccelerationReceiving: w.decode },
          ...w.encode !== void 0 && { hardwareAccelerationSending: w.encode },
          warning: null
        });
      } catch (C) {
        a({ warning: Fn(C, e("media.hardware_acceleration_failed")) });
      }
    },
    [t, a, e]
  ), b = q(
    async (w) => {
      const _ = Re(t), C = o.virtualBackgroundImageList.find((R) => R.id === w);
      if (!C) {
        a({ warning: { type: "operation", message: e("media.virtual_background_failed") } }), console.error(`Invalid virtual background image id: ${w}`);
        return;
      }
      try {
        const R = C.url || void 0;
        await (_ == null ? void 0 : _.updateVirtualBackgroundImage(R)), a({ vbImageId: w, warning: null });
      } catch (R) {
        a({ warning: Fn(R, e("media.virtual_background_failed")) }), console.error(`Error setting virtual background: ${R}`);
      }
    },
    [t, a, e, o.virtualBackgroundImageList]
  );
  return {
    videoState: o,
    canControlVideo: c,
    canUseVirtualBackground: u,
    toggleVideo: f,
    startVideo: d,
    stopVideo: l,
    switchCamera: g,
    setMirrored: v,
    setHardwareAcceleration: p,
    setVirtualBackground: b
  };
}
function dc() {
  const { t: e } = de(), { client: t } = _e(), { isSharing: n, sharePrivilege: r, isEnableOptimizeForSharedVideo: o } = B((w) => w.shareState), i = B((w) => w.participantState.currentUser), s = he(() => Re(t), [t]), a = ue(void 0), c = !!(i != null && i.isHost || i != null && i.isManager), u = !!(i != null && i.sharerPause), d = !!(s != null && s.isSupportOptimizedForSharedVideo()), l = B((w) => w.setShareState), f = B((w) => w.setAnnotationState), g = q(
    async (w) => {
      if (!s) return;
      const _ = s.isStartShareScreenWithVideoElement() ? "VIDEO" : "CANVAS";
      let C = a.current;
      (!C || C.tagName !== _) && (C = document.createElement(_ === "VIDEO" ? "video" : "canvas"), C.style.display = "none", a.current = C);
      try {
        n && await s.stopShareScreen(), await s.startShareScreen(C, w), await s.showAnnotatorName(!0), f({ isShowAnnotatorName: !0 });
      } catch (R) {
        console.warn(R);
        const x = R == null ? void 0 : R.type;
        let E;
        x === "INVALID_OPERATION" ? E = "share.error.start_failed" : x === "INSUFFICIENT_PRIVILEGES" ? E = r === Ot.Locked ? "share.error.host_disabled" : "share.error.other_sharing" : E = "share.error.generic", Ve.error(e(E), {
          position: "top-center",
          duration: 3e3
        });
      }
    },
    [s, n, f, e, r]
  ), v = q(async () => {
    if (!(!s || !n))
      try {
        await s.stopShareScreen();
      } catch (w) {
        console.warn(w);
      }
  }, [s, n]), p = q(
    async (w) => {
      if (!(!s || !c))
        try {
          await s.setSharePrivilege(w);
        } catch (_) {
          console.warn(_);
        }
    },
    [c, s]
  ), b = q(async () => {
    if (!(!s || !n))
      try {
        u || await s.pauseShareScreen();
      } catch (w) {
        console.warn(w);
      }
  }, [n, u, s]), y = q(async () => {
    if (!(!s || !n))
      try {
        u && await s.resumeShareScreen();
      } catch (w) {
        console.warn(w);
      }
  }, [n, u, s]), S = q(async () => {
    if (!(!s || !n || !d))
      try {
        await s.enableOptimizeForSharedVideo(!o), l({ isEnableOptimizeForSharedVideo: !o });
      } catch (w) {
        console.warn(w);
      }
  }, [o, n, d, l, s]);
  return {
    isSharing: n,
    sharePrivilege: r,
    canChangeSharePrivilege: c,
    isSharingPaused: u,
    isSupportOptimizedForSharedVideo: d,
    isEnableOptimizeForSharedVideo: o,
    toggleShare: g,
    stopShare: v,
    pauseShare: b,
    resumeShare: y,
    changeSharePrivilege: p,
    toggleOptimizeForSharedVideo: S
  };
}
const N1 = {
  [Fi.RECORDING_ACCOUNT_DISABLE]: "recording.error_account_disabled",
  [Fi.RECORDING_STOP_FORBIDDEN]: "recording.error_stop_forbidden",
  [Fi.RECORDING_MISMATCH_STATE]: "recording.error_state_mismatch"
};
function A1(e, t) {
  return !e || typeof e != "object" || !("errorCode" in e) || typeof e.errorCode != "number" ? t : N1[e.errorCode] ?? t;
}
function O1() {
  const { t: e } = de(), { client: t } = _e(), { recordingStatus: n, isCloudRecordingEnabled: r } = ja(), o = B((S) => S.sessionState.connectionState);
  B((S) => S.participantState.currentUser);
  const i = yf(t), s = !!(i != null && i.isHost || i != null && i.isManager), a = n === tt.Recording, c = n === tt.Paused, u = a || c, [d, l] = ne(!1), f = o === we.Connected && r && s && !d, g = q(
    async (S, w) => {
      l(!0);
      try {
        await S();
      } catch (_) {
        Ve.error(e(A1(_, w)), {
          position: "top-center",
          duration: 4e3
        });
      } finally {
        l(!1);
      }
    },
    [e]
  ), v = q(async () => {
    if (!f || u) return;
    const S = Un(t);
    S && await g(() => S.startCloudRecording(), "recording.error_start");
  }, [f, t, u, g]), p = q(async () => {
    if (!f || !u) return;
    const S = Un(t);
    S && await g(() => S.stopCloudRecording(), "recording.error_stop");
  }, [f, t, u, g]), b = q(async () => {
    if (!f || !a) return;
    const S = Un(t);
    S && await g(() => S.pauseCloudRecording(), "recording.error_pause");
  }, [f, t, a, g]), y = q(async () => {
    if (!f || !c) return;
    const S = Un(t);
    S && await g(() => S.resumeCloudRecording(), "recording.error_resume");
  }, [f, t, c, g]);
  return {
    recordingStatus: n,
    isCloudRecordingEnabled: r,
    isLoading: d,
    canControlRecording: f,
    startRecording: v,
    stopRecording: p,
    pauseRecording: b,
    resumeRecording: y
  };
}
const Eo = "zoom-uitoolkit-speaking-while-muted", gu = "zoom-auto-play-audio-failed", P1 = 5e3, M1 = 2e3;
function k1({ toggleAudio: e }) {
  const { client: t } = _e();
  oe(() => {
    if (!t)
      return;
    const n = async () => {
      var i, s;
      try {
        await ((s = (i = Re(t)) == null ? void 0 : i.unmuteAudio) == null ? void 0 : s.call(i)), Ve.dismiss(Eo);
      } catch {
      }
    }, r = () => {
      Ve(qe.t("audio.muted_notification"), {
        id: Eo,
        duration: P1,
        position: "top-center",
        action: {
          label: qe.t("audio.unmute"),
          onClick: () => void n()
        }
      });
    }, o = (i) => {
      (i.action === "unmuted" || i.action === "leave") && Ve.dismiss(Eo), i.action === "muted" && ((i == null ? void 0 : i.source) === "passive(mute one)" || (i == null ? void 0 : i.source) === "passive(mute all)") && Ve.warning(qe.t("audio.muted_by_host"), {
        position: "top-center",
        duration: M1
      });
    };
    return t.on("speaking-while-muted", r), t.on("current-audio-change", o), () => {
      t.off("speaking-while-muted", r), t.off("current-audio-change", o), Ve.dismiss(Eo);
    };
  }, [t]), oe(() => {
    if (!t) return;
    const n = () => {
      Ve(qe.t("audio.autoplay_blocked"), {
        id: gu,
        duration: 1 / 0,
        position: "top-center",
        action: {
          label: qe.t("audio.join_audio"),
          onClick: () => e()
        }
      });
    };
    return t.on("auto-play-audio-failed", n), () => {
      t.off("auto-play-audio-failed", n), Ve.dismiss(gu);
    };
  }, [t, e]);
}
var D1 = "ltr62m0 _14sdsl3l", $1 = "ltr62m1 _14sdsl3l";
const L1 = {
  isJoined: !1,
  isMuted: !0,
  isLoading: !1,
  noiseSuppression: !1,
  warning: null
}, vu = async () => {
}, yu = async () => {
};
function F1(e) {
  return B((n) => n.sessionState.connectionState) !== we.Connected ? /* @__PURE__ */ h(B1, { ...e }) : /* @__PURE__ */ h(V1, { ...e });
}
function V1(e) {
  var i;
  const { sessionOptions: t } = _e(), n = fm(), { audioState: r, toggleAudio: o } = n;
  return k1({ toggleAudio: o }), /* @__PURE__ */ P(pe, { children: [
    /* @__PURE__ */ h(pm, { ...e, ...n, isConnected: !0 }),
    (i = t.audio) != null && i.disableUnmuteConsentDialog ? null : /* @__PURE__ */ h(C1, { audioState: r, acceptConsent: o })
  ] });
}
function B1(e) {
  return /* @__PURE__ */ h(
    pm,
    {
      ...e,
      audioState: L1,
      canControlAudio: !1,
      leaveAudio: vu,
      switchMicrophone: yu,
      switchSpeaker: yu,
      toggleAudio: vu,
      isConnected: !1
    }
  );
}
function pm({
  className: e,
  style: t,
  isMobile: n = !1,
  showMenu: r = !0,
  menuGroups: o,
  dropdownOptions: i,
  renderContent: s,
  audioState: a,
  canControlAudio: c,
  toggleAudio: u,
  leaveAudio: d,
  switchMicrophone: l,
  switchSpeaker: f,
  isConnected: g
}) {
  const { t: v } = de(), p = B((V) => V.deviceState), b = g && c, { contentState: y, defaultButtonContent: S } = j1(a), w = a.isJoined ? a.isMuted ? v("audio.unmute") : v("audio.mute") : v("audio.join_audio"), _ = v("audio.audio_options"), C = o ?? [], R = C.length > 0, x = !b || a.isLoading, E = !g || !R && !b, I = {
    audioState: a,
    deviceState: p,
    canControlAudio: b,
    label: w,
    menuLabel: _,
    isDisabled: x,
    isMenuTriggerDisabled: E,
    toggleAudio: u,
    leaveAudio: d,
    switchMicrophone: l,
    switchSpeaker: f
  }, N = [...a.isJoined ? [
    {
      id: "microphone",
      label: v("audio.microphone"),
      emptyLabel: v("common.no_devices"),
      selectionMode: "single",
      items: p.microphones.map((V) => ({
        id: V.deviceId,
        label: V.label || V.deviceId,
        disabled: p.isSwitchingMicrophone || p.activeMicrophoneId === V.deviceId,
        selected: p.activeMicrophoneId === V.deviceId,
        onSelect: () => {
          l(V.deviceId);
        }
      }))
    },
    {
      id: "speaker",
      label: v("audio.speaker"),
      emptyLabel: v("common.no_devices"),
      selectionMode: "single",
      items: p.speakers.map((V) => ({
        id: V.deviceId,
        label: V.label || V.deviceId,
        disabled: p.isSwitchingSpeaker || p.activeSpeakerId === V.deviceId,
        selected: p.activeSpeakerId === V.deviceId,
        onSelect: () => {
          f(V.deviceId);
        }
      }))
    },
    {
      id: "leave",
      items: [
        {
          id: "leave-audio",
          label: v("audio.leave"),
          disabled: a.isLoading,
          onSelect: () => {
            d();
          }
        }
      ]
    }
  ] : [], ...C], $ = y === "joinAudio" ? $1 : y === "muted" ? D1 : void 0, T = z1(s, I, y), O = T !== void 0 ? T : $ ? /* @__PURE__ */ h("span", { className: $, children: S }) : S, F = a.isLoading ? v("common.working") : w, A = r && a.isJoined && (b || R), D = () => {
    u();
  };
  return /* @__PURE__ */ h(
    $a,
    {
      className: e,
      style: t,
      contentSized: T !== void 0,
      buttonProps: {
        "aria-label": F,
        "aria-busy": a.isLoading,
        "data-testid": "toolbar-audio",
        disabled: x,
        onClick: D
      },
      menu: A ? /* @__PURE__ */ h(
        er,
        {
          label: _,
          triggerDisabled: E,
          groups: N,
          dropdownOptions: i,
          isMobile: n
        }
      ) : void 0,
      children: O
    }
  );
}
function z1(e, t, n) {
  if (!e)
    return;
  const r = e[n];
  return typeof r == "function" ? r(t) : r;
}
function j1(e) {
  return e.isLoading ? {
    contentState: "loading",
    defaultButtonContent: /* @__PURE__ */ h(Tn, { "aria-hidden": "true", className: sr, size: Ie.iconSize })
  } : e.warning ? {
    contentState: "warning",
    defaultButtonContent: /* @__PURE__ */ h(Lf, { "aria-hidden": "true", size: Ie.iconSize })
  } : e.isJoined ? e.isMuted ? {
    contentState: "muted",
    defaultButtonContent: /* @__PURE__ */ h(Ma, { "aria-hidden": "true", size: 18 })
  } : {
    contentState: "unmuted",
    defaultButtonContent: /* @__PURE__ */ h(kf, { "aria-hidden": "true", size: 18 })
  } : {
    contentState: "joinAudio",
    defaultButtonContent: /* @__PURE__ */ h(Mf, { "aria-hidden": "true", size: 18 })
  };
}
var U1 = "szia6l0 _14sdsl3l";
function H1({
  className: e,
  style: t,
  isMobile: n = !1,
  showMenu: r = !0,
  menuGroups: o,
  dropdownOptions: i
}) {
  const { t: s } = de(), { client: a } = _e(), {
    recordingStatus: c,
    isCloudRecordingEnabled: u,
    isLoading: d,
    canControlRecording: l,
    startRecording: f,
    stopRecording: g,
    pauseRecording: v,
    resumeRecording: p
  } = O1(), b = c === tt.Recording, y = c === tt.Paused, S = b || y, w = yf(a), _ = w !== null, C = !!(w != null && w.isHost || w != null && w.isManager);
  oe(() => {
    _ && (C ? u || console.warn("RecordButton is disabled because cloud recording is not enabled for this account.") : console.warn("RecordButton is disabled because only the host or co-host can control cloud recording."));
  }, [_, C, u]);
  const R = !l;
  function x() {
    if (_) {
      if (!C) return s("recording.error_host_only");
      if (!u) return s("recording.error_account_disabled");
    }
  }
  const E = s("recording.recording_options"), I = o ?? [], N = [...S ? [
    {
      id: "recording-actions",
      items: [
        {
          id: b ? "pause-recording" : "resume-recording",
          label: s(b ? "recording.pause_recording" : "recording.resume_recording"),
          disabled: R,
          onSelect: () => {
            b ? v() : p();
          }
        },
        {
          id: "stop-recording",
          label: s("recording.stop_recording"),
          disabled: R,
          onSelect: () => {
            g();
          }
        }
      ]
    }
  ] : [], ...I], $ = s(d ? "common.working" : S ? "recording.recording" : "recording.start_recording"), T = r && S, O = /* @__PURE__ */ h($w, { "aria-hidden": "true", size: 18 }), F = S ? /* @__PURE__ */ h("span", { className: U1, children: O }) : O, A = /* @__PURE__ */ h(
    le,
    {
      kind: "icon",
      className: e,
      style: t,
      size: "sm",
      "aria-label": $,
      "aria-pressed": S,
      "aria-busy": d,
      "data-testid": "recording-button",
      title: x(),
      disabled: R || S && !T,
      onClick: S ? void 0 : () => {
        f();
      },
      children: F
    }
  );
  return T ? /* @__PURE__ */ h(
    er,
    {
      label: E,
      trigger: A,
      triggerDisabled: R,
      groups: N,
      dropdownOptions: i,
      isMobile: n
    }
  ) : A;
}
var W1 = "_1unnqa60 _14sdsl3l";
const K1 = Bs, us = async () => {
}, q1 = async () => {
};
function G1(e) {
  return B((n) => n.sessionState.connectionState) !== we.Connected ? /* @__PURE__ */ h(X1, { ...e }) : /* @__PURE__ */ h(Y1, { ...e });
}
function Y1(e) {
  const t = hm();
  return /* @__PURE__ */ h(mm, { ...e, ...t, isConnected: !0 });
}
function X1(e) {
  return /* @__PURE__ */ h(
    mm,
    {
      ...e,
      videoState: K1,
      canControlVideo: !1,
      toggleVideo: us,
      startVideo: us,
      stopVideo: us,
      switchCamera: q1,
      isConnected: !1
    }
  );
}
function mm({
  className: e,
  style: t,
  isMobile: n = !1,
  showMenu: r = !0,
  menuGroups: o,
  dropdownOptions: i,
  renderContent: s,
  videoState: a,
  canControlVideo: c,
  toggleVideo: u,
  startVideo: d,
  stopVideo: l,
  switchCamera: f,
  isConnected: g
}) {
  const { t: v } = de(), p = B((L) => L.deviceState), b = g && c, [y, S] = ne(a.isVideoOn);
  a.isVideoOn && !y && S(!0);
  const { contentState: w, defaultButtonContent: _ } = J1(a), C = a.isVideoOn ? v("video.stop_video") : v("video.start_video"), R = v("video.video_options"), x = o ?? [], E = x.length > 0, I = !b || a.isLoading, M = !g || !E && !b, N = a.isVideoOn || y && p.cameras.length > 0, $ = r && N && g && (b || E), T = {
    videoState: a,
    deviceState: p,
    canControlVideo: b,
    label: C,
    menuLabel: R,
    isDisabled: I,
    isMenuTriggerDisabled: M,
    toggleVideo: u,
    startVideo: d,
    stopVideo: l,
    switchCamera: f
  }, F = [...N ? [
    {
      id: "camera",
      label: v("video.camera"),
      emptyLabel: v("common.no_devices"),
      selectionMode: "single",
      items: p.cameras.map((L) => ({
        id: L.deviceId,
        label: L.label || L.deviceId,
        disabled: p.isSwitchingCamera || p.activeCameraId === L.deviceId,
        selected: p.activeCameraId === L.deviceId,
        onSelect: () => {
          f(L.deviceId);
        }
      }))
    }
  ] : [], ...x], A = Z1(s, T, w), D = A !== void 0 ? A : w === "videoOff" ? /* @__PURE__ */ h("span", { className: W1, children: _ }) : _, V = a.isLoading ? v("common.working") : C, z = () => {
    u();
  };
  return /* @__PURE__ */ h(
    $a,
    {
      className: e,
      style: t,
      contentSized: A !== void 0,
      buttonProps: {
        "aria-label": V,
        "aria-busy": a.isLoading,
        "data-testid": "video-button",
        disabled: I,
        onClick: z
      },
      menu: $ ? /* @__PURE__ */ h(
        er,
        {
          label: R,
          triggerDisabled: M,
          groups: F,
          dropdownOptions: i,
          isMobile: n
        }
      ) : void 0,
      children: D
    }
  );
}
function Z1(e, t, n) {
  if (!e)
    return;
  const r = e[n];
  return typeof r == "function" ? r(t) : r;
}
function J1(e) {
  return e.isLoading ? {
    contentState: "loading",
    defaultButtonContent: /* @__PURE__ */ h(Tn, { "aria-hidden": "true", className: sr, size: Ie.iconSize })
  } : e.warning ? {
    contentState: "warning",
    defaultButtonContent: /* @__PURE__ */ h(Lf, { "aria-hidden": "true", size: Ie.iconSize })
  } : e.isVideoOn ? {
    contentState: "videoOn",
    defaultButtonContent: /* @__PURE__ */ h(Da, { "aria-hidden": "true", size: 18 })
  } : {
    contentState: "videoOff",
    defaultButtonContent: /* @__PURE__ */ h(ka, { "aria-hidden": "true", size: 18 })
  };
}
var ds = "_1aeu8340", Q1 = "_1aeu8341 _14sdsl35 _14sdsl32", eR = "_1aeu8342", tR = "_1aeu8343", nR = "_1aeu8344", rR = "_1aeu8345 _14sdsl37 _14sdsl36", oR = "_1aeu8346", iR = "_1aeu8347", sR = "_1aeu8348", wi = "Popover", [gm] = sn(wi, [
  yi
]), to = yi(), [aR, cn] = gm(wi), vm = (e) => {
  const {
    __scopePopover: t,
    children: n,
    open: r,
    defaultOpen: o,
    onOpenChange: i,
    modal: s = !1
  } = e, a = to(t), c = m.useRef(null), [u, d] = m.useState(!1), [l, f] = ir({
    prop: r,
    defaultProp: o ?? !1,
    onChange: i,
    caller: wi
  });
  return /* @__PURE__ */ h(Za, { ...a, children: /* @__PURE__ */ h(
    aR,
    {
      scope: t,
      contentId: Bt(),
      triggerRef: c,
      open: l,
      onOpenChange: f,
      onOpenToggle: m.useCallback(() => f((g) => !g), [f]),
      hasCustomAnchor: u,
      onCustomAnchorAdd: m.useCallback(() => d(!0), []),
      onCustomAnchorRemove: m.useCallback(() => d(!1), []),
      modal: s,
      children: n
    }
  ) });
};
vm.displayName = wi;
var ym = "PopoverAnchor", bm = m.forwardRef(
  (e, t) => {
    const { __scopePopover: n, ...r } = e, o = cn(ym, n), i = to(n), { onCustomAnchorAdd: s, onCustomAnchorRemove: a } = o;
    return m.useEffect(() => (s(), () => a()), [s, a]), /* @__PURE__ */ h(Ja, { ...i, ...r, ref: t });
  }
);
bm.displayName = ym;
var Sm = "PopoverTrigger", wm = m.forwardRef(
  (e, t) => {
    const { __scopePopover: n, ...r } = e, o = cn(Sm, n), i = to(n), s = ze(t, o.triggerRef), a = /* @__PURE__ */ h(
      Te.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": o.open,
        "aria-controls": o.contentId,
        "data-state": Rm(o.open),
        ...r,
        ref: s,
        onClick: ce(e.onClick, o.onOpenToggle)
      }
    );
    return o.hasCustomAnchor ? a : /* @__PURE__ */ h(Ja, { asChild: !0, ...i, children: a });
  }
);
wm.displayName = Sm;
var fc = "PopoverPortal", [cR, lR] = gm(fc, {
  forceMount: void 0
}), _m = (e) => {
  const { __scopePopover: t, forceMount: n, children: r, container: o } = e, i = cn(fc, t);
  return /* @__PURE__ */ h(cR, { scope: t, forceMount: n, children: /* @__PURE__ */ h(Et, { present: n || i.open, children: /* @__PURE__ */ h(In, { asChild: !0, container: o, children: r }) }) });
};
_m.displayName = fc;
var tr = "PopoverContent", Cm = m.forwardRef(
  (e, t) => {
    const n = lR(tr, e.__scopePopover), { forceMount: r = n.forceMount, ...o } = e, i = cn(tr, e.__scopePopover);
    return /* @__PURE__ */ h(Et, { present: r || i.open, children: i.modal ? /* @__PURE__ */ h(dR, { ...o, ref: t }) : /* @__PURE__ */ h(fR, { ...o, ref: t }) });
  }
);
Cm.displayName = tr;
var uR = /* @__PURE__ */ Jn("PopoverContent.RemoveScroll"), dR = m.forwardRef(
  (e, t) => {
    const n = cn(tr, e.__scopePopover), r = m.useRef(null), o = ze(t, r), i = m.useRef(!1);
    return m.useEffect(() => {
      const s = r.current;
      if (s) return fi(s);
    }, []), /* @__PURE__ */ h(Kr, { as: uR, allowPinchZoom: !0, children: /* @__PURE__ */ h(
      xm,
      {
        ...e,
        ref: o,
        trapFocus: n.open,
        disableOutsidePointerEvents: !0,
        onCloseAutoFocus: ce(e.onCloseAutoFocus, (s) => {
          var a;
          s.preventDefault(), i.current || (a = n.triggerRef.current) == null || a.focus();
        }),
        onPointerDownOutside: ce(
          e.onPointerDownOutside,
          (s) => {
            const a = s.detail.originalEvent, c = a.button === 0 && a.ctrlKey === !0, u = a.button === 2 || c;
            i.current = u;
          },
          { checkForDefaultPrevented: !1 }
        ),
        onFocusOutside: ce(
          e.onFocusOutside,
          (s) => s.preventDefault(),
          { checkForDefaultPrevented: !1 }
        )
      }
    ) });
  }
), fR = m.forwardRef(
  (e, t) => {
    const n = cn(tr, e.__scopePopover), r = m.useRef(!1), o = m.useRef(!1);
    return /* @__PURE__ */ h(
      xm,
      {
        ...e,
        ref: t,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: (i) => {
          var s, a;
          (s = e.onCloseAutoFocus) == null || s.call(e, i), i.defaultPrevented || (r.current || (a = n.triggerRef.current) == null || a.focus(), i.preventDefault()), r.current = !1, o.current = !1;
        },
        onInteractOutside: (i) => {
          var c, u;
          (c = e.onInteractOutside) == null || c.call(e, i), i.defaultPrevented || (r.current = !0, i.detail.originalEvent.type === "pointerdown" && (o.current = !0));
          const s = i.target;
          ((u = n.triggerRef.current) == null ? void 0 : u.contains(s)) && i.preventDefault(), i.detail.originalEvent.type === "focusin" && o.current && i.preventDefault();
        }
      }
    );
  }
), xm = m.forwardRef(
  (e, t) => {
    const {
      __scopePopover: n,
      trapFocus: r,
      onOpenAutoFocus: o,
      onCloseAutoFocus: i,
      disableOutsidePointerEvents: s,
      onEscapeKeyDown: a,
      onPointerDownOutside: c,
      onFocusOutside: u,
      onInteractOutside: d,
      ...l
    } = e, f = cn(tr, n), g = to(n);
    return La(), /* @__PURE__ */ h(
      ui,
      {
        asChild: !0,
        loop: !0,
        trapped: r,
        onMountAutoFocus: o,
        onUnmountAutoFocus: i,
        children: /* @__PURE__ */ h(
          zr,
          {
            asChild: !0,
            disableOutsidePointerEvents: s,
            onInteractOutside: d,
            onEscapeKeyDown: a,
            onPointerDownOutside: c,
            onFocusOutside: u,
            onDismiss: () => f.onOpenChange(!1),
            children: /* @__PURE__ */ h(
              Gh,
              {
                "data-state": Rm(f.open),
                role: "dialog",
                id: f.contentId,
                ...g,
                ...l,
                ref: t,
                style: {
                  ...l.style,
                  "--radix-popover-content-transform-origin": "var(--radix-popper-transform-origin)",
                  "--radix-popover-content-available-width": "var(--radix-popper-available-width)",
                  "--radix-popover-content-available-height": "var(--radix-popper-available-height)",
                  "--radix-popover-trigger-width": "var(--radix-popper-anchor-width)",
                  "--radix-popover-trigger-height": "var(--radix-popper-anchor-height)"
                }
              }
            )
          }
        )
      }
    );
  }
), Em = "PopoverClose", hR = m.forwardRef(
  (e, t) => {
    const { __scopePopover: n, ...r } = e, o = cn(Em, n);
    return /* @__PURE__ */ h(
      Te.button,
      {
        type: "button",
        ...r,
        ref: t,
        onClick: ce(e.onClick, () => o.onOpenChange(!1))
      }
    );
  }
);
hR.displayName = Em;
var pR = "PopoverArrow", mR = m.forwardRef(
  (e, t) => {
    const { __scopePopover: n, ...r } = e, o = to(n);
    return /* @__PURE__ */ h(Yh, { ...o, ...r, ref: t });
  }
);
mR.displayName = pR;
function Rm(e) {
  return e ? "open" : "closed";
}
var hc = vm, Im = bm, Tm = wm, pc = _m, mc = Cm;
function gc(e, t = 2) {
  return e.split(" ").slice(0, t).map((n) => n[0] ?? "").join("").toUpperCase();
}
function gR({
  open: e,
  onOpenChange: t,
  isAssigningHost: n,
  isMobile: r = !1,
  anchor: o,
  popoverProps: i,
  otherParticipants: s,
  selectedUserId: a,
  onSelectUser: c,
  onEndForAll: u,
  onHostLeave: d,
  onAssignAndLeave: l,
  menuClassName: f,
  menuStyle: g,
  trigger: v
}) {
  const { t: p } = de(), b = Se(), y = Ye(), S = he(() => ({ current: o }), [o]), w = n ? /* @__PURE__ */ P(pe, { children: [
    r ? null : /* @__PURE__ */ h("h3", { className: nR, children: p("session.assign_new_host") }),
    /* @__PURE__ */ h("div", { className: rR, role: "radiogroup", "aria-label": p("session.assign_new_host"), children: s.map((_) => {
      const C = _.displayName || p("common.guest"), R = a === _.userId;
      return /* @__PURE__ */ P(
        nt,
        {
          presentation: "selection",
          type: "button",
          role: "radio",
          "aria-checked": R,
          "aria-pressed": R,
          onClick: () => c(_.userId),
          children: [
            /* @__PURE__ */ h("span", { className: oR, children: gc(C) }),
            /* @__PURE__ */ h("span", { className: iR, children: C }),
            R ? /* @__PURE__ */ h(yt, { size: 16, className: sR }) : null
          ]
        },
        _.userId
      );
    }) }),
    /* @__PURE__ */ h(
      vn,
      {
        fullWidth: !0,
        tone: "danger",
        enabled: r,
        type: "button",
        disabled: a == null,
        onClick: l,
        "data-testid": "assign-and-leave",
        children: p("session.assign_and_leave")
      }
    )
  ] }) : /* @__PURE__ */ P(pe, { children: [
    /* @__PURE__ */ h(
      vn,
      {
        fullWidth: !0,
        tone: "danger",
        enabled: r,
        type: "button",
        onClick: u,
        "data-testid": "leave-end-for-all",
        children: p("session.end_meeting_for_all")
      }
    ),
    /* @__PURE__ */ h(
      vn,
      {
        fullWidth: !0,
        tone: "neutral",
        enabled: r && s.length === 0,
        type: "button",
        onClick: d,
        "data-testid": "leave-meeting",
        children: p("session.leave_meeting")
      }
    )
  ] });
  if (r) {
    const _ = p(n ? "session.assign_new_host" : "session.leave_meeting");
    return /* @__PURE__ */ P(fr, { open: e, onOpenChange: t, autoFocus: !0, children: [
      /* @__PURE__ */ h(Ae.Trigger, { asChild: !0, children: v }),
      /* @__PURE__ */ P(Ae.Portal, { children: [
        /* @__PURE__ */ h(hr, { className: ar, "data-theme": b }),
        /* @__PURE__ */ P(
          Ae.Content,
          {
            style: y,
            className: Na,
            "aria-describedby": void 0,
            "data-theme": b,
            "data-testid": "leave-popover-sheet",
            children: [
              /* @__PURE__ */ h("div", { className: Ur, "aria-hidden": "true" }),
              /* @__PURE__ */ h(Ae.Title, { className: tR, children: _ }),
              /* @__PURE__ */ h("div", { className: X(eR, f), style: g, "data-testid": "leave-popover", children: w })
            ]
          }
        )
      ] })
    ] });
  }
  return /* @__PURE__ */ P(hc, { open: e, onOpenChange: t, children: [
    o ? /* @__PURE__ */ h(Im, { virtualRef: S }) : null,
    /* @__PURE__ */ h(Tm, { asChild: !0, children: v }),
    /* @__PURE__ */ h(pc, { children: /* @__PURE__ */ h(
      mc,
      {
        className: X(Q1, f),
        style: { ...y, ...g },
        side: (i == null ? void 0 : i.side) ?? "top",
        align: (i == null ? void 0 : i.align) ?? "start",
        sideOffset: (i == null ? void 0 : i.sideOffset) ?? 10,
        alignOffset: i == null ? void 0 : i.alignOffset,
        collisionPadding: (i == null ? void 0 : i.collisionPadding) ?? 12,
        avoidCollisions: !0,
        "data-theme": b,
        "data-testid": "leave-popover",
        children: w
      }
    ) })
  ] });
}
function Nm({
  className: e,
  style: t,
  fullWidth: n = !1,
  isMobile: r = !1,
  renderContent: o,
  onClick: i,
  anchor: s,
  popoverProps: a,
  menuClassName: c,
  menuStyle: u
}) {
  var te, U;
  const { t: d } = de(), { client: l } = _e(), f = B((H) => H.sessionState), g = B((H) => H.participantState), v = B((H) => H.setSessionState), p = za(), [b, y] = ne(!1), [S, w] = ne(!1), [_, C] = ne(null), R = ((te = g.currentUser) == null ? void 0 : te.isHost) ?? !1, x = f.isLeaving, E = f.connectionState === we.Connected, I = (U = g.currentUser) == null ? void 0 : U.userId, M = g.participants.filter((H) => H.userId !== I), N = M.length > 0;
  function $() {
    w(!1), C(null);
  }
  function T(H) {
    y(H), H && $();
  }
  const O = q(
    async (H) => {
      if (l) {
        v({ isLeaving: !0, errorMessage: null, reason: null });
        try {
          await l.leave(H);
        } catch (Q) {
          p(Q), v({ isLeaving: !1 });
        }
      }
    },
    [l, p, v]
  ), F = q(
    async (H) => {
      if (l)
        try {
          await l.makeHost(H);
        } catch (Q) {
          p(Q);
        }
    },
    [l, p]
  ), A = q(async () => {
    y(!1), await O(!1);
  }, [O]), D = q(async () => {
    y(!1), await O(!0), i == null || i();
  }, [O, i]), V = q(async () => {
    if (!N) {
      y(!1), await O(!1), i == null || i();
      return;
    }
    w(!0);
  }, [N, O, i]), z = q(async () => {
    _ != null && (y(!1), await F(_), await O(!1), i == null || i());
  }, [_, F, O, i]), L = R ? /* @__PURE__ */ h(Fw, { size: Ie.iconSize, className: ds }) : /* @__PURE__ */ h(e_, { size: Ie.iconSize, className: ds }), j = d(x ? "session.leaving" : R ? "toolbar.end" : "session.leave"), Z = !l || x || !E, K = {
    isHost: R,
    isBusy: x,
    isConnected: E,
    disabled: Z,
    // Host: Popover.Trigger asChild merges its own onClick onto the child to open the menu.
    // Non-host: fires the leave action directly.
    onClick: R ? () => i == null ? void 0 : i() : () => {
      i == null || i(), A();
    }
  }, G = /* @__PURE__ */ h(
    le,
    {
      kind: n ? "text" : "icon",
      tone: "danger",
      size: "sm",
      fullWidth: n,
      className: e,
      style: t,
      disabled: Z,
      "aria-busy": x,
      "data-testid": "leave-button",
      "aria-label": j,
      onClick: K.onClick,
      children: x ? /* @__PURE__ */ h(Tn, { className: X(ds, sr), size: Ie.iconSize }) : L
    }
  );
  if (!R)
    return /* @__PURE__ */ h(pe, { children: o ? o(K) : G });
  const J = o ? o(K) : G;
  return /* @__PURE__ */ h(
    gR,
    {
      open: b,
      onOpenChange: T,
      isAssigningHost: S,
      isMobile: r,
      anchor: s,
      popoverProps: a,
      otherParticipants: M,
      selectedUserId: _,
      onSelectUser: C,
      onEndForAll: () => void D(),
      onHostLeave: () => void V(),
      onAssignAndLeave: () => void z(),
      menuClassName: c,
      menuStyle: u,
      trigger: J
    }
  );
}
var xr = { exports: {} }, fs = {}, Ro = { exports: {} }, Io = { exports: {} }, xe = {};
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var bu;
function vR() {
  if (bu) return xe;
  bu = 1;
  var e = typeof Symbol == "function" && Symbol.for, t = e ? Symbol.for("react.element") : 60103, n = e ? Symbol.for("react.portal") : 60106, r = e ? Symbol.for("react.fragment") : 60107, o = e ? Symbol.for("react.strict_mode") : 60108, i = e ? Symbol.for("react.profiler") : 60114, s = e ? Symbol.for("react.provider") : 60109, a = e ? Symbol.for("react.context") : 60110, c = e ? Symbol.for("react.async_mode") : 60111, u = e ? Symbol.for("react.concurrent_mode") : 60111, d = e ? Symbol.for("react.forward_ref") : 60112, l = e ? Symbol.for("react.suspense") : 60113, f = e ? Symbol.for("react.suspense_list") : 60120, g = e ? Symbol.for("react.memo") : 60115, v = e ? Symbol.for("react.lazy") : 60116, p = e ? Symbol.for("react.block") : 60121, b = e ? Symbol.for("react.fundamental") : 60117, y = e ? Symbol.for("react.responder") : 60118, S = e ? Symbol.for("react.scope") : 60119;
  function w(C) {
    if (typeof C == "object" && C !== null) {
      var R = C.$$typeof;
      switch (R) {
        case t:
          switch (C = C.type, C) {
            case c:
            case u:
            case r:
            case i:
            case o:
            case l:
              return C;
            default:
              switch (C = C && C.$$typeof, C) {
                case a:
                case d:
                case v:
                case g:
                case s:
                  return C;
                default:
                  return R;
              }
          }
        case n:
          return R;
      }
    }
  }
  function _(C) {
    return w(C) === u;
  }
  return xe.AsyncMode = c, xe.ConcurrentMode = u, xe.ContextConsumer = a, xe.ContextProvider = s, xe.Element = t, xe.ForwardRef = d, xe.Fragment = r, xe.Lazy = v, xe.Memo = g, xe.Portal = n, xe.Profiler = i, xe.StrictMode = o, xe.Suspense = l, xe.isAsyncMode = function(C) {
    return _(C) || w(C) === c;
  }, xe.isConcurrentMode = _, xe.isContextConsumer = function(C) {
    return w(C) === a;
  }, xe.isContextProvider = function(C) {
    return w(C) === s;
  }, xe.isElement = function(C) {
    return typeof C == "object" && C !== null && C.$$typeof === t;
  }, xe.isForwardRef = function(C) {
    return w(C) === d;
  }, xe.isFragment = function(C) {
    return w(C) === r;
  }, xe.isLazy = function(C) {
    return w(C) === v;
  }, xe.isMemo = function(C) {
    return w(C) === g;
  }, xe.isPortal = function(C) {
    return w(C) === n;
  }, xe.isProfiler = function(C) {
    return w(C) === i;
  }, xe.isStrictMode = function(C) {
    return w(C) === o;
  }, xe.isSuspense = function(C) {
    return w(C) === l;
  }, xe.isValidElementType = function(C) {
    return typeof C == "string" || typeof C == "function" || C === r || C === u || C === i || C === o || C === l || C === f || typeof C == "object" && C !== null && (C.$$typeof === v || C.$$typeof === g || C.$$typeof === s || C.$$typeof === a || C.$$typeof === d || C.$$typeof === b || C.$$typeof === y || C.$$typeof === S || C.$$typeof === p);
  }, xe.typeOf = w, xe;
}
var Ee = {};
/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Su;
function yR() {
  return Su || (Su = 1, process.env.NODE_ENV !== "production" && (function() {
    var e = typeof Symbol == "function" && Symbol.for, t = e ? Symbol.for("react.element") : 60103, n = e ? Symbol.for("react.portal") : 60106, r = e ? Symbol.for("react.fragment") : 60107, o = e ? Symbol.for("react.strict_mode") : 60108, i = e ? Symbol.for("react.profiler") : 60114, s = e ? Symbol.for("react.provider") : 60109, a = e ? Symbol.for("react.context") : 60110, c = e ? Symbol.for("react.async_mode") : 60111, u = e ? Symbol.for("react.concurrent_mode") : 60111, d = e ? Symbol.for("react.forward_ref") : 60112, l = e ? Symbol.for("react.suspense") : 60113, f = e ? Symbol.for("react.suspense_list") : 60120, g = e ? Symbol.for("react.memo") : 60115, v = e ? Symbol.for("react.lazy") : 60116, p = e ? Symbol.for("react.block") : 60121, b = e ? Symbol.for("react.fundamental") : 60117, y = e ? Symbol.for("react.responder") : 60118, S = e ? Symbol.for("react.scope") : 60119;
    function w(W) {
      return typeof W == "string" || typeof W == "function" || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
      W === r || W === u || W === i || W === o || W === l || W === f || typeof W == "object" && W !== null && (W.$$typeof === v || W.$$typeof === g || W.$$typeof === s || W.$$typeof === a || W.$$typeof === d || W.$$typeof === b || W.$$typeof === y || W.$$typeof === S || W.$$typeof === p);
    }
    function _(W) {
      if (typeof W == "object" && W !== null) {
        var ge = W.$$typeof;
        switch (ge) {
          case t:
            var re = W.type;
            switch (re) {
              case c:
              case u:
              case r:
              case i:
              case o:
              case l:
                return re;
              default:
                var Y = re && re.$$typeof;
                switch (Y) {
                  case a:
                  case d:
                  case v:
                  case g:
                  case s:
                    return Y;
                  default:
                    return ge;
                }
            }
          case n:
            return ge;
        }
      }
    }
    var C = c, R = u, x = a, E = s, I = t, M = d, N = r, $ = v, T = g, O = n, F = i, A = o, D = l, V = !1;
    function z(W) {
      return V || (V = !0, console.warn("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.")), L(W) || _(W) === c;
    }
    function L(W) {
      return _(W) === u;
    }
    function j(W) {
      return _(W) === a;
    }
    function Z(W) {
      return _(W) === s;
    }
    function K(W) {
      return typeof W == "object" && W !== null && W.$$typeof === t;
    }
    function G(W) {
      return _(W) === d;
    }
    function J(W) {
      return _(W) === r;
    }
    function te(W) {
      return _(W) === v;
    }
    function U(W) {
      return _(W) === g;
    }
    function H(W) {
      return _(W) === n;
    }
    function Q(W) {
      return _(W) === i;
    }
    function ee(W) {
      return _(W) === o;
    }
    function ie(W) {
      return _(W) === l;
    }
    Ee.AsyncMode = C, Ee.ConcurrentMode = R, Ee.ContextConsumer = x, Ee.ContextProvider = E, Ee.Element = I, Ee.ForwardRef = M, Ee.Fragment = N, Ee.Lazy = $, Ee.Memo = T, Ee.Portal = O, Ee.Profiler = F, Ee.StrictMode = A, Ee.Suspense = D, Ee.isAsyncMode = z, Ee.isConcurrentMode = L, Ee.isContextConsumer = j, Ee.isContextProvider = Z, Ee.isElement = K, Ee.isForwardRef = G, Ee.isFragment = J, Ee.isLazy = te, Ee.isMemo = U, Ee.isPortal = H, Ee.isProfiler = Q, Ee.isStrictMode = ee, Ee.isSuspense = ie, Ee.isValidElementType = w, Ee.typeOf = _;
  })()), Ee;
}
var wu;
function Am() {
  return wu || (wu = 1, process.env.NODE_ENV === "production" ? Io.exports = vR() : Io.exports = yR()), Io.exports;
}
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var hs, _u;
function bR() {
  if (_u) return hs;
  _u = 1;
  var e = Object.getOwnPropertySymbols, t = Object.prototype.hasOwnProperty, n = Object.prototype.propertyIsEnumerable;
  function r(i) {
    if (i == null)
      throw new TypeError("Object.assign cannot be called with null or undefined");
    return Object(i);
  }
  function o() {
    try {
      if (!Object.assign)
        return !1;
      var i = new String("abc");
      if (i[5] = "de", Object.getOwnPropertyNames(i)[0] === "5")
        return !1;
      for (var s = {}, a = 0; a < 10; a++)
        s["_" + String.fromCharCode(a)] = a;
      var c = Object.getOwnPropertyNames(s).map(function(d) {
        return s[d];
      });
      if (c.join("") !== "0123456789")
        return !1;
      var u = {};
      return "abcdefghijklmnopqrst".split("").forEach(function(d) {
        u[d] = d;
      }), Object.keys(Object.assign({}, u)).join("") === "abcdefghijklmnopqrst";
    } catch {
      return !1;
    }
  }
  return hs = o() ? Object.assign : function(i, s) {
    for (var a, c = r(i), u, d = 1; d < arguments.length; d++) {
      a = Object(arguments[d]);
      for (var l in a)
        t.call(a, l) && (c[l] = a[l]);
      if (e) {
        u = e(a);
        for (var f = 0; f < u.length; f++)
          n.call(a, u[f]) && (c[u[f]] = a[u[f]]);
      }
    }
    return c;
  }, hs;
}
var ps, Cu;
function vc() {
  if (Cu) return ps;
  Cu = 1;
  var e = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  return ps = e, ps;
}
var ms, xu;
function Om() {
  return xu || (xu = 1, ms = Function.call.bind(Object.prototype.hasOwnProperty)), ms;
}
var gs, Eu;
function SR() {
  if (Eu) return gs;
  Eu = 1;
  var e = function() {
  };
  if (process.env.NODE_ENV !== "production") {
    var t = /* @__PURE__ */ vc(), n = {}, r = /* @__PURE__ */ Om();
    e = function(i) {
      var s = "Warning: " + i;
      typeof console < "u" && console.error(s);
      try {
        throw new Error(s);
      } catch {
      }
    };
  }
  function o(i, s, a, c, u) {
    if (process.env.NODE_ENV !== "production") {
      for (var d in i)
        if (r(i, d)) {
          var l;
          try {
            if (typeof i[d] != "function") {
              var f = Error(
                (c || "React class") + ": " + a + " type `" + d + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof i[d] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`."
              );
              throw f.name = "Invariant Violation", f;
            }
            l = i[d](s, d, c, a, null, t);
          } catch (v) {
            l = v;
          }
          if (l && !(l instanceof Error) && e(
            (c || "React class") + ": type specification of " + a + " `" + d + "` is invalid; the type checker function must return `null` or an `Error` but returned a " + typeof l + ". You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument)."
          ), l instanceof Error && !(l.message in n)) {
            n[l.message] = !0;
            var g = u ? u() : "";
            e(
              "Failed " + a + " type: " + l.message + (g ?? "")
            );
          }
        }
    }
  }
  return o.resetWarningCache = function() {
    process.env.NODE_ENV !== "production" && (n = {});
  }, gs = o, gs;
}
var vs, Ru;
function wR() {
  if (Ru) return vs;
  Ru = 1;
  var e = Am(), t = bR(), n = /* @__PURE__ */ vc(), r = /* @__PURE__ */ Om(), o = /* @__PURE__ */ SR(), i = function() {
  };
  process.env.NODE_ENV !== "production" && (i = function(a) {
    var c = "Warning: " + a;
    typeof console < "u" && console.error(c);
    try {
      throw new Error(c);
    } catch {
    }
  });
  function s() {
    return null;
  }
  return vs = function(a, c) {
    var u = typeof Symbol == "function" && Symbol.iterator, d = "@@iterator";
    function l(L) {
      var j = L && (u && L[u] || L[d]);
      if (typeof j == "function")
        return j;
    }
    var f = "<<anonymous>>", g = {
      array: y("array"),
      bigint: y("bigint"),
      bool: y("boolean"),
      func: y("function"),
      number: y("number"),
      object: y("object"),
      string: y("string"),
      symbol: y("symbol"),
      any: S(),
      arrayOf: w,
      element: _(),
      elementType: C(),
      instanceOf: R,
      node: M(),
      objectOf: E,
      oneOf: x,
      oneOfType: I,
      shape: $,
      exact: T
    };
    function v(L, j) {
      return L === j ? L !== 0 || 1 / L === 1 / j : L !== L && j !== j;
    }
    function p(L, j) {
      this.message = L, this.data = j && typeof j == "object" ? j : {}, this.stack = "";
    }
    p.prototype = Error.prototype;
    function b(L) {
      if (process.env.NODE_ENV !== "production")
        var j = {}, Z = 0;
      function K(J, te, U, H, Q, ee, ie) {
        if (H = H || f, ee = ee || U, ie !== n) {
          if (c) {
            var W = new Error(
              "Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types"
            );
            throw W.name = "Invariant Violation", W;
          } else if (process.env.NODE_ENV !== "production" && typeof console < "u") {
            var ge = H + ":" + U;
            !j[ge] && // Avoid spamming the console because they are often not actionable except for lib authors
            Z < 3 && (i(
              "You are manually calling a React.PropTypes validation function for the `" + ee + "` prop on `" + H + "`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details."
            ), j[ge] = !0, Z++);
          }
        }
        return te[U] == null ? J ? te[U] === null ? new p("The " + Q + " `" + ee + "` is marked as required " + ("in `" + H + "`, but its value is `null`.")) : new p("The " + Q + " `" + ee + "` is marked as required in " + ("`" + H + "`, but its value is `undefined`.")) : null : L(te, U, H, Q, ee);
      }
      var G = K.bind(null, !1);
      return G.isRequired = K.bind(null, !0), G;
    }
    function y(L) {
      function j(Z, K, G, J, te, U) {
        var H = Z[K], Q = A(H);
        if (Q !== L) {
          var ee = D(H);
          return new p(
            "Invalid " + J + " `" + te + "` of type " + ("`" + ee + "` supplied to `" + G + "`, expected ") + ("`" + L + "`."),
            { expectedType: L }
          );
        }
        return null;
      }
      return b(j);
    }
    function S() {
      return b(s);
    }
    function w(L) {
      function j(Z, K, G, J, te) {
        if (typeof L != "function")
          return new p("Property `" + te + "` of component `" + G + "` has invalid PropType notation inside arrayOf.");
        var U = Z[K];
        if (!Array.isArray(U)) {
          var H = A(U);
          return new p("Invalid " + J + " `" + te + "` of type " + ("`" + H + "` supplied to `" + G + "`, expected an array."));
        }
        for (var Q = 0; Q < U.length; Q++) {
          var ee = L(U, Q, G, J, te + "[" + Q + "]", n);
          if (ee instanceof Error)
            return ee;
        }
        return null;
      }
      return b(j);
    }
    function _() {
      function L(j, Z, K, G, J) {
        var te = j[Z];
        if (!a(te)) {
          var U = A(te);
          return new p("Invalid " + G + " `" + J + "` of type " + ("`" + U + "` supplied to `" + K + "`, expected a single ReactElement."));
        }
        return null;
      }
      return b(L);
    }
    function C() {
      function L(j, Z, K, G, J) {
        var te = j[Z];
        if (!e.isValidElementType(te)) {
          var U = A(te);
          return new p("Invalid " + G + " `" + J + "` of type " + ("`" + U + "` supplied to `" + K + "`, expected a single ReactElement type."));
        }
        return null;
      }
      return b(L);
    }
    function R(L) {
      function j(Z, K, G, J, te) {
        if (!(Z[K] instanceof L)) {
          var U = L.name || f, H = z(Z[K]);
          return new p("Invalid " + J + " `" + te + "` of type " + ("`" + H + "` supplied to `" + G + "`, expected ") + ("instance of `" + U + "`."));
        }
        return null;
      }
      return b(j);
    }
    function x(L) {
      if (!Array.isArray(L))
        return process.env.NODE_ENV !== "production" && (arguments.length > 1 ? i(
          "Invalid arguments supplied to oneOf, expected an array, got " + arguments.length + " arguments. A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z])."
        ) : i("Invalid argument supplied to oneOf, expected an array.")), s;
      function j(Z, K, G, J, te) {
        for (var U = Z[K], H = 0; H < L.length; H++)
          if (v(U, L[H]))
            return null;
        var Q = JSON.stringify(L, function(ie, W) {
          var ge = D(W);
          return ge === "symbol" ? String(W) : W;
        });
        return new p("Invalid " + J + " `" + te + "` of value `" + String(U) + "` " + ("supplied to `" + G + "`, expected one of " + Q + "."));
      }
      return b(j);
    }
    function E(L) {
      function j(Z, K, G, J, te) {
        if (typeof L != "function")
          return new p("Property `" + te + "` of component `" + G + "` has invalid PropType notation inside objectOf.");
        var U = Z[K], H = A(U);
        if (H !== "object")
          return new p("Invalid " + J + " `" + te + "` of type " + ("`" + H + "` supplied to `" + G + "`, expected an object."));
        for (var Q in U)
          if (r(U, Q)) {
            var ee = L(U, Q, G, J, te + "." + Q, n);
            if (ee instanceof Error)
              return ee;
          }
        return null;
      }
      return b(j);
    }
    function I(L) {
      if (!Array.isArray(L))
        return process.env.NODE_ENV !== "production" && i("Invalid argument supplied to oneOfType, expected an instance of array."), s;
      for (var j = 0; j < L.length; j++) {
        var Z = L[j];
        if (typeof Z != "function")
          return i(
            "Invalid argument supplied to oneOfType. Expected an array of check functions, but received " + V(Z) + " at index " + j + "."
          ), s;
      }
      function K(G, J, te, U, H) {
        for (var Q = [], ee = 0; ee < L.length; ee++) {
          var ie = L[ee], W = ie(G, J, te, U, H, n);
          if (W == null)
            return null;
          W.data && r(W.data, "expectedType") && Q.push(W.data.expectedType);
        }
        var ge = Q.length > 0 ? ", expected one of type [" + Q.join(", ") + "]" : "";
        return new p("Invalid " + U + " `" + H + "` supplied to " + ("`" + te + "`" + ge + "."));
      }
      return b(K);
    }
    function M() {
      function L(j, Z, K, G, J) {
        return O(j[Z]) ? null : new p("Invalid " + G + " `" + J + "` supplied to " + ("`" + K + "`, expected a ReactNode."));
      }
      return b(L);
    }
    function N(L, j, Z, K, G) {
      return new p(
        (L || "React class") + ": " + j + " type `" + Z + "." + K + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + G + "`."
      );
    }
    function $(L) {
      function j(Z, K, G, J, te) {
        var U = Z[K], H = A(U);
        if (H !== "object")
          return new p("Invalid " + J + " `" + te + "` of type `" + H + "` " + ("supplied to `" + G + "`, expected `object`."));
        for (var Q in L) {
          var ee = L[Q];
          if (typeof ee != "function")
            return N(G, J, te, Q, D(ee));
          var ie = ee(U, Q, G, J, te + "." + Q, n);
          if (ie)
            return ie;
        }
        return null;
      }
      return b(j);
    }
    function T(L) {
      function j(Z, K, G, J, te) {
        var U = Z[K], H = A(U);
        if (H !== "object")
          return new p("Invalid " + J + " `" + te + "` of type `" + H + "` " + ("supplied to `" + G + "`, expected `object`."));
        var Q = t({}, Z[K], L);
        for (var ee in Q) {
          var ie = L[ee];
          if (r(L, ee) && typeof ie != "function")
            return N(G, J, te, ee, D(ie));
          if (!ie)
            return new p(
              "Invalid " + J + " `" + te + "` key `" + ee + "` supplied to `" + G + "`.\nBad object: " + JSON.stringify(Z[K], null, "  ") + `
Valid keys: ` + JSON.stringify(Object.keys(L), null, "  ")
            );
          var W = ie(U, ee, G, J, te + "." + ee, n);
          if (W)
            return W;
        }
        return null;
      }
      return b(j);
    }
    function O(L) {
      switch (typeof L) {
        case "number":
        case "string":
        case "undefined":
          return !0;
        case "boolean":
          return !L;
        case "object":
          if (Array.isArray(L))
            return L.every(O);
          if (L === null || a(L))
            return !0;
          var j = l(L);
          if (j) {
            var Z = j.call(L), K;
            if (j !== L.entries) {
              for (; !(K = Z.next()).done; )
                if (!O(K.value))
                  return !1;
            } else
              for (; !(K = Z.next()).done; ) {
                var G = K.value;
                if (G && !O(G[1]))
                  return !1;
              }
          } else
            return !1;
          return !0;
        default:
          return !1;
      }
    }
    function F(L, j) {
      return L === "symbol" ? !0 : j ? j["@@toStringTag"] === "Symbol" || typeof Symbol == "function" && j instanceof Symbol : !1;
    }
    function A(L) {
      var j = typeof L;
      return Array.isArray(L) ? "array" : L instanceof RegExp ? "object" : F(j, L) ? "symbol" : j;
    }
    function D(L) {
      if (typeof L > "u" || L === null)
        return "" + L;
      var j = A(L);
      if (j === "object") {
        if (L instanceof Date)
          return "date";
        if (L instanceof RegExp)
          return "regexp";
      }
      return j;
    }
    function V(L) {
      var j = D(L);
      switch (j) {
        case "array":
        case "object":
          return "an " + j;
        case "boolean":
        case "date":
        case "regexp":
          return "a " + j;
        default:
          return j;
      }
    }
    function z(L) {
      return !L.constructor || !L.constructor.name ? f : L.constructor.name;
    }
    return g.checkPropTypes = o, g.resetWarningCache = o.resetWarningCache, g.PropTypes = g, g;
  }, vs;
}
var ys, Iu;
function _R() {
  if (Iu) return ys;
  Iu = 1;
  var e = /* @__PURE__ */ vc();
  function t() {
  }
  function n() {
  }
  return n.resetWarningCache = t, ys = function() {
    function r(s, a, c, u, d, l) {
      if (l !== e) {
        var f = new Error(
          "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
        );
        throw f.name = "Invariant Violation", f;
      }
    }
    r.isRequired = r;
    function o() {
      return r;
    }
    var i = {
      array: r,
      bigint: r,
      bool: r,
      func: r,
      number: r,
      object: r,
      string: r,
      symbol: r,
      any: r,
      arrayOf: o,
      element: r,
      elementType: r,
      instanceOf: o,
      node: r,
      objectOf: o,
      oneOf: o,
      oneOfType: o,
      shape: o,
      exact: o,
      checkPropTypes: n,
      resetWarningCache: t
    };
    return i.PropTypes = i, i;
  }, ys;
}
var Tu;
function Pm() {
  if (Tu) return Ro.exports;
  if (Tu = 1, process.env.NODE_ENV !== "production") {
    var e = Am(), t = !0;
    Ro.exports = /* @__PURE__ */ wR()(e.isElement, t);
  } else
    Ro.exports = /* @__PURE__ */ _R()();
  return Ro.exports;
}
var To = { exports: {} }, Nu;
function CR() {
  if (Nu) return To.exports;
  Nu = 1;
  function e(n) {
    var r, o, i = "";
    if (typeof n == "string" || typeof n == "number") i += n;
    else if (typeof n == "object") if (Array.isArray(n)) {
      var s = n.length;
      for (r = 0; r < s; r++) n[r] && (o = e(n[r])) && (i && (i += " "), i += o);
    } else for (o in n) n[o] && (i && (i += " "), i += o);
    return i;
  }
  function t() {
    for (var n, r, o = 0, i = "", s = arguments.length; o < s; o++) (n = arguments[o]) && (r = e(n)) && (i && (i += " "), i += r);
    return i;
  }
  return To.exports = t, To.exports.clsx = t, To.exports;
}
var Be = {}, Yt = {}, Au;
function _i() {
  if (Au) return Yt;
  Au = 1, Object.defineProperty(Yt, "__esModule", {
    value: !0
  }), Yt.dontSetMe = o, Yt.findInArray = e, Yt.int = r, Yt.isFunction = t, Yt.isNum = n;
  function e(i, s) {
    for (let a = 0, c = i.length; a < c; a++)
      if (s.apply(s, [i[a], a, i])) return i[a];
  }
  function t(i) {
    return typeof i == "function" || Object.prototype.toString.call(i) === "[object Function]";
  }
  function n(i) {
    return typeof i == "number" && !isNaN(i);
  }
  function r(i) {
    return parseInt(i, 10);
  }
  function o(i, s, a) {
    if (i[s])
      return new Error(`Invalid prop ${s} passed to ${a} - do not set this, set it on the child.`);
  }
  return Yt;
}
var Xt = {}, Ou;
function xR() {
  if (Ou) return Xt;
  Ou = 1, Object.defineProperty(Xt, "__esModule", {
    value: !0
  }), Xt.browserPrefixToKey = n, Xt.browserPrefixToStyle = r, Xt.default = void 0, Xt.getPrefix = t;
  const e = ["Moz", "Webkit", "O", "ms"];
  function t() {
    var a, c;
    let i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "transform";
    if (typeof window > "u") return "";
    const s = (c = (a = window.document) == null ? void 0 : a.documentElement) == null ? void 0 : c.style;
    if (!s || i in s) return "";
    for (let u = 0; u < e.length; u++)
      if (n(i, e[u]) in s) return e[u];
    return "";
  }
  function n(i, s) {
    return s ? `${s}${o(i)}` : i;
  }
  function r(i, s) {
    return s ? `-${s.toLowerCase()}-${i}` : i;
  }
  function o(i) {
    let s = "", a = !0;
    for (let c = 0; c < i.length; c++)
      a ? (s += i[c].toUpperCase(), a = !1) : i[c] === "-" ? a = !0 : s += i[c];
    return s;
  }
  return Xt.default = t(), Xt;
}
var Pu;
function yc() {
  if (Pu) return Be;
  Pu = 1, Object.defineProperty(Be, "__esModule", {
    value: !0
  }), Be.addClassName = C, Be.addEvent = s, Be.addUserSelectStyles = S, Be.createCSSTransform = g, Be.createSVGTransform = v, Be.getTouch = b, Be.getTouchIdentifier = y, Be.getTranslation = p, Be.innerHeight = d, Be.innerWidth = l, Be.matchesSelector = o, Be.matchesSelectorAndParentsTo = i, Be.offsetXYFromParent = f, Be.outerHeight = c, Be.outerWidth = u, Be.removeClassName = R, Be.removeEvent = a, Be.scheduleRemoveUserSelectStyles = w;
  var e = _i(), t = n(xR());
  function n(x, E) {
    if (typeof WeakMap == "function") var I = /* @__PURE__ */ new WeakMap(), M = /* @__PURE__ */ new WeakMap();
    return (n = function(N, $) {
      if (!$ && N && N.__esModule) return N;
      var T, O, F = { __proto__: null, default: N };
      if (N === null || typeof N != "object" && typeof N != "function") return F;
      if (T = $ ? M : I) {
        if (T.has(N)) return T.get(N);
        T.set(N, F);
      }
      for (const A in N) A !== "default" && {}.hasOwnProperty.call(N, A) && ((O = (T = Object.defineProperty) && Object.getOwnPropertyDescriptor(N, A)) && (O.get || O.set) ? T(F, A, O) : F[A] = N[A]);
      return F;
    })(x, E);
  }
  let r = "";
  function o(x, E) {
    return r || (r = (0, e.findInArray)(["matches", "webkitMatchesSelector", "mozMatchesSelector", "msMatchesSelector", "oMatchesSelector"], function(I) {
      return (0, e.isFunction)(x[I]);
    })), (0, e.isFunction)(x[r]) ? x[r](E) : !1;
  }
  function i(x, E, I) {
    let M = x;
    do {
      if (o(M, E)) return !0;
      if (M === I) return !1;
      M = M.parentNode;
    } while (M);
    return !1;
  }
  function s(x, E, I, M) {
    if (!x) return;
    const N = {
      capture: !0,
      ...M
    };
    x.addEventListener ? x.addEventListener(E, I, N) : x.attachEvent ? x.attachEvent("on" + E, I) : x["on" + E] = I;
  }
  function a(x, E, I, M) {
    if (!x) return;
    const N = {
      capture: !0,
      ...M
    };
    x.removeEventListener ? x.removeEventListener(E, I, N) : x.detachEvent ? x.detachEvent("on" + E, I) : x["on" + E] = null;
  }
  function c(x) {
    let E = x.clientHeight;
    const I = x.ownerDocument.defaultView.getComputedStyle(x);
    return E += (0, e.int)(I.borderTopWidth), E += (0, e.int)(I.borderBottomWidth), E;
  }
  function u(x) {
    let E = x.clientWidth;
    const I = x.ownerDocument.defaultView.getComputedStyle(x);
    return E += (0, e.int)(I.borderLeftWidth), E += (0, e.int)(I.borderRightWidth), E;
  }
  function d(x) {
    let E = x.clientHeight;
    const I = x.ownerDocument.defaultView.getComputedStyle(x);
    return E -= (0, e.int)(I.paddingTop), E -= (0, e.int)(I.paddingBottom), E;
  }
  function l(x) {
    let E = x.clientWidth;
    const I = x.ownerDocument.defaultView.getComputedStyle(x);
    return E -= (0, e.int)(I.paddingLeft), E -= (0, e.int)(I.paddingRight), E;
  }
  function f(x, E, I) {
    const N = E === E.ownerDocument.body ? {
      left: 0,
      top: 0
    } : E.getBoundingClientRect(), $ = (x.clientX + E.scrollLeft - N.left) / I, T = (x.clientY + E.scrollTop - N.top) / I;
    return {
      x: $,
      y: T
    };
  }
  function g(x, E) {
    const I = p(x, E, "px");
    return {
      [(0, t.browserPrefixToKey)("transform", t.default)]: I
    };
  }
  function v(x, E) {
    return p(x, E, "");
  }
  function p(x, E, I) {
    let {
      x: M,
      y: N
    } = x, $ = `translate(${M}${I},${N}${I})`;
    if (E) {
      const T = `${typeof E.x == "string" ? E.x : E.x + I}`, O = `${typeof E.y == "string" ? E.y : E.y + I}`;
      $ = `translate(${T}, ${O})` + $;
    }
    return $;
  }
  function b(x, E) {
    return x.targetTouches && (0, e.findInArray)(x.targetTouches, (I) => E === I.identifier) || x.changedTouches && (0, e.findInArray)(x.changedTouches, (I) => E === I.identifier);
  }
  function y(x) {
    if (x.targetTouches && x.targetTouches[0]) return x.targetTouches[0].identifier;
    if (x.changedTouches && x.changedTouches[0]) return x.changedTouches[0].identifier;
  }
  function S(x) {
    if (!x) return;
    let E = x.getElementById("react-draggable-style-el");
    E || (E = x.createElement("style"), E.type = "text/css", E.id = "react-draggable-style-el", E.innerHTML = `.react-draggable-transparent-selection *::-moz-selection {all: inherit;}
`, E.innerHTML += `.react-draggable-transparent-selection *::selection {all: inherit;}
`, x.getElementsByTagName("head")[0].appendChild(E)), x.body && C(x.body, "react-draggable-transparent-selection");
  }
  function w(x) {
    window.requestAnimationFrame ? window.requestAnimationFrame(() => {
      _(x);
    }) : _(x);
  }
  function _(x) {
    if (x)
      try {
        if (x.body && R(x.body, "react-draggable-transparent-selection"), x.selection)
          x.selection.empty();
        else {
          const E = (x.defaultView || window).getSelection();
          E && E.type !== "Caret" && E.removeAllRanges();
        }
      } catch {
      }
  }
  function C(x, E) {
    x.classList ? x.classList.add(E) : x.className.match(new RegExp(`(?:^|\\s)${E}(?!\\S)`)) || (x.className += ` ${E}`);
  }
  function R(x, E) {
    x.classList ? x.classList.remove(E) : x.className = x.className.replace(new RegExp(`(?:^|\\s)${E}(?!\\S)`, "g"), "");
  }
  return Be;
}
var Nt = {}, Mu;
function Mm() {
  if (Mu) return Nt;
  Mu = 1, Object.defineProperty(Nt, "__esModule", {
    value: !0
  }), Nt.canDragX = o, Nt.canDragY = i, Nt.createCoreData = a, Nt.createDraggableData = c, Nt.getBoundPosition = n, Nt.getControlPosition = s, Nt.snapToGrid = r;
  var e = _i(), t = yc();
  function n(l, f, g) {
    if (!l.props.bounds) return [f, g];
    let {
      bounds: v
    } = l.props;
    v = typeof v == "string" ? v : u(v);
    const p = d(l);
    if (typeof v == "string") {
      const {
        ownerDocument: b
      } = p, y = b.defaultView;
      let S;
      if (v === "parent" ? S = p.parentNode : S = p.getRootNode().querySelector(v), !(S instanceof y.HTMLElement))
        throw new Error('Bounds selector "' + v + '" could not find an element.');
      const w = S, _ = y.getComputedStyle(p), C = y.getComputedStyle(w);
      v = {
        left: -p.offsetLeft + (0, e.int)(C.paddingLeft) + (0, e.int)(_.marginLeft),
        top: -p.offsetTop + (0, e.int)(C.paddingTop) + (0, e.int)(_.marginTop),
        right: (0, t.innerWidth)(w) - (0, t.outerWidth)(p) - p.offsetLeft + (0, e.int)(C.paddingRight) - (0, e.int)(_.marginRight),
        bottom: (0, t.innerHeight)(w) - (0, t.outerHeight)(p) - p.offsetTop + (0, e.int)(C.paddingBottom) - (0, e.int)(_.marginBottom)
      };
    }
    return (0, e.isNum)(v.right) && (f = Math.min(f, v.right)), (0, e.isNum)(v.bottom) && (g = Math.min(g, v.bottom)), (0, e.isNum)(v.left) && (f = Math.max(f, v.left)), (0, e.isNum)(v.top) && (g = Math.max(g, v.top)), [f, g];
  }
  function r(l, f, g) {
    const v = Math.round(f / l[0]) * l[0], p = Math.round(g / l[1]) * l[1];
    return [v, p];
  }
  function o(l) {
    return l.props.axis === "both" || l.props.axis === "x";
  }
  function i(l) {
    return l.props.axis === "both" || l.props.axis === "y";
  }
  function s(l, f, g) {
    const v = typeof f == "number" ? (0, t.getTouch)(l, f) : null;
    if (typeof f == "number" && !v) return null;
    const p = d(g), b = g.props.offsetParent || p.offsetParent || p.ownerDocument.body;
    return (0, t.offsetXYFromParent)(v || l, b, g.props.scale);
  }
  function a(l, f, g) {
    const v = !(0, e.isNum)(l.lastX), p = d(l);
    return v ? {
      node: p,
      deltaX: 0,
      deltaY: 0,
      lastX: f,
      lastY: g,
      x: f,
      y: g
    } : {
      node: p,
      deltaX: f - l.lastX,
      deltaY: g - l.lastY,
      lastX: l.lastX,
      lastY: l.lastY,
      x: f,
      y: g
    };
  }
  function c(l, f) {
    const g = l.props.scale;
    return {
      node: f.node,
      x: l.state.x + f.deltaX / g,
      y: l.state.y + f.deltaY / g,
      deltaX: f.deltaX / g,
      deltaY: f.deltaY / g,
      lastX: l.state.x,
      lastY: l.state.y
    };
  }
  function u(l) {
    return {
      left: l.left,
      top: l.top,
      right: l.right,
      bottom: l.bottom
    };
  }
  function d(l) {
    const f = l.findDOMNode();
    if (!f)
      throw new Error("<DraggableCore>: Unmounted during event!");
    return f;
  }
  return Nt;
}
var Er = {}, No = {}, ku;
function km() {
  if (ku) return No;
  ku = 1, Object.defineProperty(No, "__esModule", {
    value: !0
  }), No.default = e;
  function e() {
  }
  return No;
}
var Du;
function ER() {
  if (Du) return Er;
  Du = 1, Object.defineProperty(Er, "__esModule", {
    value: !0
  }), Er.default = void 0;
  var e = c(k), t = a(/* @__PURE__ */ Pm()), n = a(Br), r = yc(), o = Mm(), i = _i(), s = a(km());
  function a(p) {
    return p && p.__esModule ? p : { default: p };
  }
  function c(p, b) {
    if (typeof WeakMap == "function") var y = /* @__PURE__ */ new WeakMap(), S = /* @__PURE__ */ new WeakMap();
    return (c = function(w, _) {
      if (!_ && w && w.__esModule) return w;
      var C, R, x = { __proto__: null, default: w };
      if (w === null || typeof w != "object" && typeof w != "function") return x;
      if (C = _ ? S : y) {
        if (C.has(w)) return C.get(w);
        C.set(w, x);
      }
      for (const E in w) E !== "default" && {}.hasOwnProperty.call(w, E) && ((R = (C = Object.defineProperty) && Object.getOwnPropertyDescriptor(w, E)) && (R.get || R.set) ? C(x, E, R) : x[E] = w[E]);
      return x;
    })(p, b);
  }
  function u(p, b, y) {
    return (b = d(b)) in p ? Object.defineProperty(p, b, { value: y, enumerable: !0, configurable: !0, writable: !0 }) : p[b] = y, p;
  }
  function d(p) {
    var b = l(p, "string");
    return typeof b == "symbol" ? b : b + "";
  }
  function l(p, b) {
    if (typeof p != "object" || !p) return p;
    var y = p[Symbol.toPrimitive];
    if (y !== void 0) {
      var S = y.call(p, b);
      if (typeof S != "object") return S;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (b === "string" ? String : Number)(p);
  }
  const f = {
    touch: {
      start: "touchstart",
      move: "touchmove",
      stop: "touchend"
    },
    mouse: {
      start: "mousedown",
      move: "mousemove",
      stop: "mouseup"
    }
  };
  let g = f.mouse, v = class extends e.Component {
    constructor() {
      super(...arguments), u(this, "dragging", !1), u(this, "lastX", NaN), u(this, "lastY", NaN), u(this, "touchIdentifier", null), u(this, "mounted", !1), u(this, "handleDragStart", (b) => {
        if (this.props.onMouseDown(b), !this.props.allowAnyClick && typeof b.button == "number" && b.button !== 0) return !1;
        const y = this.findDOMNode();
        if (!y || !y.ownerDocument || !y.ownerDocument.body)
          throw new Error("<DraggableCore> not mounted on DragStart!");
        const {
          ownerDocument: S
        } = y;
        if (this.props.disabled || !(b.target instanceof S.defaultView.Node) || this.props.handle && !(0, r.matchesSelectorAndParentsTo)(b.target, this.props.handle, y) || this.props.cancel && (0, r.matchesSelectorAndParentsTo)(b.target, this.props.cancel, y))
          return;
        b.type === "touchstart" && !this.props.allowMobileScroll && b.preventDefault();
        const w = (0, r.getTouchIdentifier)(b);
        this.touchIdentifier = w;
        const _ = (0, o.getControlPosition)(b, w, this);
        if (_ == null) return;
        const {
          x: C,
          y: R
        } = _, x = (0, o.createCoreData)(this, C, R);
        (0, s.default)("DraggableCore: handleDragStart: %j", x), (0, s.default)("calling", this.props.onStart), !(this.props.onStart(b, x) === !1 || this.mounted === !1) && (this.props.enableUserSelectHack && (0, r.addUserSelectStyles)(S), this.dragging = !0, this.lastX = C, this.lastY = R, (0, r.addEvent)(S, g.move, this.handleDrag), (0, r.addEvent)(S, g.stop, this.handleDragStop));
      }), u(this, "handleDrag", (b) => {
        const y = (0, o.getControlPosition)(b, this.touchIdentifier, this);
        if (y == null) return;
        let {
          x: S,
          y: w
        } = y;
        if (Array.isArray(this.props.grid)) {
          let R = S - this.lastX, x = w - this.lastY;
          if ([R, x] = (0, o.snapToGrid)(this.props.grid, R, x), !R && !x) return;
          S = this.lastX + R, w = this.lastY + x;
        }
        const _ = (0, o.createCoreData)(this, S, w);
        if ((0, s.default)("DraggableCore: handleDrag: %j", _), this.props.onDrag(b, _) === !1 || this.mounted === !1) {
          try {
            this.handleDragStop(new MouseEvent("mouseup"));
          } catch {
            const x = document.createEvent("MouseEvents");
            x.initMouseEvent("mouseup", !0, !0, window, 0, 0, 0, 0, 0, !1, !1, !1, !1, 0, null), this.handleDragStop(x);
          }
          return;
        }
        this.lastX = S, this.lastY = w;
      }), u(this, "handleDragStop", (b) => {
        if (!this.dragging) return;
        const y = (0, o.getControlPosition)(b, this.touchIdentifier, this);
        if (y == null) return;
        let {
          x: S,
          y: w
        } = y;
        if (Array.isArray(this.props.grid)) {
          let x = S - this.lastX || 0, E = w - this.lastY || 0;
          [x, E] = (0, o.snapToGrid)(this.props.grid, x, E), S = this.lastX + x, w = this.lastY + E;
        }
        const _ = (0, o.createCoreData)(this, S, w);
        if (this.props.onStop(b, _) === !1 || this.mounted === !1) return !1;
        const R = this.findDOMNode();
        R && this.props.enableUserSelectHack && (0, r.scheduleRemoveUserSelectStyles)(R.ownerDocument), (0, s.default)("DraggableCore: handleDragStop: %j", _), this.dragging = !1, this.lastX = NaN, this.lastY = NaN, R && ((0, s.default)("DraggableCore: Removing handlers"), (0, r.removeEvent)(R.ownerDocument, g.move, this.handleDrag), (0, r.removeEvent)(R.ownerDocument, g.stop, this.handleDragStop));
      }), u(this, "onMouseDown", (b) => (g = f.mouse, this.handleDragStart(b))), u(this, "onMouseUp", (b) => (g = f.mouse, this.handleDragStop(b))), u(this, "onTouchStart", (b) => (g = f.touch, this.handleDragStart(b))), u(this, "onTouchEnd", (b) => (g = f.touch, this.handleDragStop(b)));
    }
    componentDidMount() {
      this.mounted = !0;
      const b = this.findDOMNode();
      b && (0, r.addEvent)(b, f.touch.start, this.onTouchStart, {
        passive: !1
      });
    }
    componentWillUnmount() {
      this.mounted = !1;
      const b = this.findDOMNode();
      if (b) {
        const {
          ownerDocument: y
        } = b;
        (0, r.removeEvent)(y, f.mouse.move, this.handleDrag), (0, r.removeEvent)(y, f.touch.move, this.handleDrag), (0, r.removeEvent)(y, f.mouse.stop, this.handleDragStop), (0, r.removeEvent)(y, f.touch.stop, this.handleDragStop), (0, r.removeEvent)(b, f.touch.start, this.onTouchStart, {
          passive: !1
        }), this.props.enableUserSelectHack && (0, r.scheduleRemoveUserSelectStyles)(y);
      }
    }
    // React Strict Mode compatibility: if `nodeRef` is passed, we will use it instead of trying to find
    // the underlying DOM node ourselves. See the README for more information.
    findDOMNode() {
      var b, y, S;
      return (b = this.props) != null && b.nodeRef ? (S = (y = this.props) == null ? void 0 : y.nodeRef) == null ? void 0 : S.current : n.default.findDOMNode(this);
    }
    render() {
      return /* @__PURE__ */ e.cloneElement(e.Children.only(this.props.children), {
        // Note: mouseMove handler is attached to document so it will still function
        // when the user drags quickly and leaves the bounds of the element.
        onMouseDown: this.onMouseDown,
        onMouseUp: this.onMouseUp,
        // onTouchStart is added on `componentDidMount` so they can be added with
        // {passive: false}, which allows it to cancel. See
        // https://developers.google.com/web/updates/2017/01/scrolling-intervention
        onTouchEnd: this.onTouchEnd
      });
    }
  };
  return Er.default = v, u(v, "displayName", "DraggableCore"), u(v, "propTypes", {
    /**
     * `allowAnyClick` allows dragging using any mouse button.
     * By default, we only accept the left button.
     *
     * Defaults to `false`.
     */
    allowAnyClick: t.default.bool,
    /**
     * `allowMobileScroll` turns off cancellation of the 'touchstart' event
     * on mobile devices. Only enable this if you are having trouble with click
     * events. Prefer using 'handle' / 'cancel' instead.
     *
     * Defaults to `false`.
     */
    allowMobileScroll: t.default.bool,
    children: t.default.node.isRequired,
    /**
     * `disabled`, if true, stops the <Draggable> from dragging. All handlers,
     * with the exception of `onMouseDown`, will not fire.
     */
    disabled: t.default.bool,
    /**
     * By default, we add 'user-select:none' attributes to the document body
     * to prevent ugly text selection during drag. If this is causing problems
     * for your app, set this to `false`.
     */
    enableUserSelectHack: t.default.bool,
    /**
     * `offsetParent`, if set, uses the passed DOM node to compute drag offsets
     * instead of using the parent node.
     */
    offsetParent: function(p, b) {
      if (p[b] && p[b].nodeType !== 1)
        throw new Error("Draggable's offsetParent must be a DOM Node.");
    },
    /**
     * `grid` specifies the x and y that dragging should snap to.
     */
    grid: t.default.arrayOf(t.default.number),
    /**
     * `handle` specifies a selector to be used as the handle that initiates drag.
     *
     * Example:
     *
     * ```jsx
     *   let App = React.createClass({
     *       render: function () {
     *         return (
     *            <Draggable handle=".handle">
     *              <div>
     *                  <div className="handle">Click me to drag</div>
     *                  <div>This is some other content</div>
     *              </div>
     *           </Draggable>
     *         );
     *       }
     *   });
     * ```
     */
    handle: t.default.string,
    /**
     * `cancel` specifies a selector to be used to prevent drag initialization.
     *
     * Example:
     *
     * ```jsx
     *   let App = React.createClass({
     *       render: function () {
     *           return(
     *               <Draggable cancel=".cancel">
     *                   <div>
     *                     <div className="cancel">You can't drag from here</div>
     *                     <div>Dragging here works fine</div>
     *                   </div>
     *               </Draggable>
     *           );
     *       }
     *   });
     * ```
     */
    cancel: t.default.string,
    /* If running in React Strict mode, ReactDOM.findDOMNode() is deprecated.
     * Unfortunately, in order for <Draggable> to work properly, we need raw access
     * to the underlying DOM node. If you want to avoid the warning, pass a `nodeRef`
     * as in this example:
     *
     * function MyComponent() {
     *   const nodeRef = React.useRef(null);
     *   return (
     *     <Draggable nodeRef={nodeRef}>
     *       <div ref={nodeRef}>Example Target</div>
     *     </Draggable>
     *   );
     * }
     *
     * This can be used for arbitrarily nested components, so long as the ref ends up
     * pointing to the actual child DOM node and not a custom component.
     */
    nodeRef: t.default.object,
    /**
     * Called when dragging starts.
     * If this function returns the boolean false, dragging will be canceled.
     */
    onStart: t.default.func,
    /**
     * Called while dragging.
     * If this function returns the boolean false, dragging will be canceled.
     */
    onDrag: t.default.func,
    /**
     * Called when dragging stops.
     * If this function returns the boolean false, the drag will remain active.
     */
    onStop: t.default.func,
    /**
     * A workaround option which can be passed if onMouseDown needs to be accessed,
     * since it'll always be blocked (as there is internal use of onMouseDown)
     */
    onMouseDown: t.default.func,
    /**
     * `scale`, if set, applies scaling while dragging an element
     */
    scale: t.default.number,
    /**
     * These properties should be defined on the child, not here.
     */
    className: i.dontSetMe,
    style: i.dontSetMe,
    transform: i.dontSetMe
  }), u(v, "defaultProps", {
    allowAnyClick: !1,
    // by default only accept left click
    allowMobileScroll: !1,
    disabled: !1,
    enableUserSelectHack: !0,
    onStart: function() {
    },
    onDrag: function() {
    },
    onStop: function() {
    },
    onMouseDown: function() {
    },
    scale: 1
  }), Er;
}
var $u;
function RR() {
  return $u || ($u = 1, (function(e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), Object.defineProperty(e, "DraggableCore", {
      enumerable: !0,
      get: function() {
        return c.default;
      }
    }), e.default = void 0;
    var t = l(k), n = d(/* @__PURE__ */ Pm()), r = d(Br), o = CR(), i = yc(), s = Mm(), a = _i(), c = d(ER()), u = d(km());
    function d(y) {
      return y && y.__esModule ? y : { default: y };
    }
    function l(y, S) {
      if (typeof WeakMap == "function") var w = /* @__PURE__ */ new WeakMap(), _ = /* @__PURE__ */ new WeakMap();
      return (l = function(C, R) {
        if (!R && C && C.__esModule) return C;
        var x, E, I = { __proto__: null, default: C };
        if (C === null || typeof C != "object" && typeof C != "function") return I;
        if (x = R ? _ : w) {
          if (x.has(C)) return x.get(C);
          x.set(C, I);
        }
        for (const M in C) M !== "default" && {}.hasOwnProperty.call(C, M) && ((E = (x = Object.defineProperty) && Object.getOwnPropertyDescriptor(C, M)) && (E.get || E.set) ? x(I, M, E) : I[M] = C[M]);
        return I;
      })(y, S);
    }
    function f() {
      return f = Object.assign ? Object.assign.bind() : function(y) {
        for (var S = 1; S < arguments.length; S++) {
          var w = arguments[S];
          for (var _ in w) ({}).hasOwnProperty.call(w, _) && (y[_] = w[_]);
        }
        return y;
      }, f.apply(null, arguments);
    }
    function g(y, S, w) {
      return (S = v(S)) in y ? Object.defineProperty(y, S, { value: w, enumerable: !0, configurable: !0, writable: !0 }) : y[S] = w, y;
    }
    function v(y) {
      var S = p(y, "string");
      return typeof S == "symbol" ? S : S + "";
    }
    function p(y, S) {
      if (typeof y != "object" || !y) return y;
      var w = y[Symbol.toPrimitive];
      if (w !== void 0) {
        var _ = w.call(y, S);
        if (typeof _ != "object") return _;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (S === "string" ? String : Number)(y);
    }
    class b extends t.Component {
      // React 16.3+
      // Arity (props, state)
      static getDerivedStateFromProps(S, w) {
        let {
          position: _
        } = S, {
          prevPropsPosition: C
        } = w;
        return _ && (!C || _.x !== C.x || _.y !== C.y) ? ((0, u.default)("Draggable: getDerivedStateFromProps %j", {
          position: _,
          prevPropsPosition: C
        }), {
          x: _.x,
          y: _.y,
          prevPropsPosition: {
            ..._
          }
        }) : null;
      }
      constructor(S) {
        super(S), g(this, "onDragStart", (w, _) => {
          if ((0, u.default)("Draggable: onDragStart: %j", _), this.props.onStart(w, (0, s.createDraggableData)(this, _)) === !1) return !1;
          this.setState({
            dragging: !0,
            dragged: !0
          });
        }), g(this, "onDrag", (w, _) => {
          if (!this.state.dragging) return !1;
          (0, u.default)("Draggable: onDrag: %j", _);
          const C = (0, s.createDraggableData)(this, _), R = {
            x: C.x,
            y: C.y,
            slackX: 0,
            slackY: 0
          };
          if (this.props.bounds) {
            const {
              x: E,
              y: I
            } = R;
            R.x += this.state.slackX, R.y += this.state.slackY;
            const [M, N] = (0, s.getBoundPosition)(this, R.x, R.y);
            R.x = M, R.y = N, R.slackX = this.state.slackX + (E - R.x), R.slackY = this.state.slackY + (I - R.y), C.x = R.x, C.y = R.y, C.deltaX = R.x - this.state.x, C.deltaY = R.y - this.state.y;
          }
          if (this.props.onDrag(w, C) === !1) return !1;
          this.setState(R);
        }), g(this, "onDragStop", (w, _) => {
          if (!this.state.dragging || this.props.onStop(w, (0, s.createDraggableData)(this, _)) === !1) return !1;
          (0, u.default)("Draggable: onDragStop: %j", _);
          const R = {
            dragging: !1,
            slackX: 0,
            slackY: 0
          };
          if (!!this.props.position) {
            const {
              x: E,
              y: I
            } = this.props.position;
            R.x = E, R.y = I;
          }
          this.setState(R);
        }), this.state = {
          // Whether or not we are currently dragging.
          dragging: !1,
          // Whether or not we have been dragged before.
          dragged: !1,
          // Current transform x and y.
          x: S.position ? S.position.x : S.defaultPosition.x,
          y: S.position ? S.position.y : S.defaultPosition.y,
          prevPropsPosition: {
            ...S.position
          },
          // Used for compensating for out-of-bounds drags
          slackX: 0,
          slackY: 0,
          // Can only determine if SVG after mounting
          isElementSVG: !1
        }, S.position && !(S.onDrag || S.onStop) && console.warn("A `position` was applied to this <Draggable>, without drag handlers. This will make this component effectively undraggable. Please attach `onDrag` or `onStop` handlers so you can adjust the `position` of this element.");
      }
      componentDidMount() {
        typeof window.SVGElement < "u" && this.findDOMNode() instanceof window.SVGElement && this.setState({
          isElementSVG: !0
        });
      }
      componentWillUnmount() {
        this.state.dragging && this.setState({
          dragging: !1
        });
      }
      // React Strict Mode compatibility: if `nodeRef` is passed, we will use it instead of trying to find
      // the underlying DOM node ourselves. See the README for more information.
      findDOMNode() {
        var S, w;
        return ((w = (S = this.props) == null ? void 0 : S.nodeRef) == null ? void 0 : w.current) ?? r.default.findDOMNode(this);
      }
      render() {
        const {
          axis: S,
          bounds: w,
          children: _,
          defaultPosition: C,
          defaultClassName: R,
          defaultClassNameDragging: x,
          defaultClassNameDragged: E,
          position: I,
          positionOffset: M,
          scale: N,
          ...$
        } = this.props;
        let T = {}, O = null;
        const A = !!!I || this.state.dragging, D = I || C, V = {
          // Set left if horizontal drag is enabled
          x: (0, s.canDragX)(this) && A ? this.state.x : D.x,
          // Set top if vertical drag is enabled
          y: (0, s.canDragY)(this) && A ? this.state.y : D.y
        };
        this.state.isElementSVG ? O = (0, i.createSVGTransform)(V, M) : T = (0, i.createCSSTransform)(V, M);
        const z = (0, o.clsx)(_.props.className || "", R, {
          [x]: this.state.dragging,
          [E]: this.state.dragged
        });
        return /* @__PURE__ */ t.createElement(c.default, f({}, $, {
          onStart: this.onDragStart,
          onDrag: this.onDrag,
          onStop: this.onDragStop
        }), /* @__PURE__ */ t.cloneElement(t.Children.only(_), {
          className: z,
          style: {
            ..._.props.style,
            ...T
          },
          transform: O
        }));
      }
    }
    e.default = b, g(b, "displayName", "Draggable"), g(b, "propTypes", {
      // Accepts all props <DraggableCore> accepts.
      ...c.default.propTypes,
      /**
       * `axis` determines which axis the draggable can move.
       *
       *  Note that all callbacks will still return data as normal. This only
       *  controls flushing to the DOM.
       *
       * 'both' allows movement horizontally and vertically.
       * 'x' limits movement to horizontal axis.
       * 'y' limits movement to vertical axis.
       * 'none' limits all movement.
       *
       * Defaults to 'both'.
       */
      axis: n.default.oneOf(["both", "x", "y", "none"]),
      /**
       * `bounds` determines the range of movement available to the element.
       * Available values are:
       *
       * 'parent' restricts movement within the Draggable's parent node.
       *
       * Alternatively, pass an object with the following properties, all of which are optional:
       *
       * {left: LEFT_BOUND, right: RIGHT_BOUND, bottom: BOTTOM_BOUND, top: TOP_BOUND}
       *
       * All values are in px.
       *
       * Example:
       *
       * ```jsx
       *   let App = React.createClass({
       *       render: function () {
       *         return (
       *            <Draggable bounds={{right: 300, bottom: 300}}>
       *              <div>Content</div>
       *           </Draggable>
       *         );
       *       }
       *   });
       * ```
       */
      bounds: n.default.oneOfType([n.default.shape({
        left: n.default.number,
        right: n.default.number,
        top: n.default.number,
        bottom: n.default.number
      }), n.default.string, n.default.oneOf([!1])]),
      defaultClassName: n.default.string,
      defaultClassNameDragging: n.default.string,
      defaultClassNameDragged: n.default.string,
      /**
       * `defaultPosition` specifies the x and y that the dragged item should start at
       *
       * Example:
       *
       * ```jsx
       *      let App = React.createClass({
       *          render: function () {
       *              return (
       *                  <Draggable defaultPosition={{x: 25, y: 25}}>
       *                      <div>I start with transformX: 25px and transformY: 25px;</div>
       *                  </Draggable>
       *              );
       *          }
       *      });
       * ```
       */
      defaultPosition: n.default.shape({
        x: n.default.number,
        y: n.default.number
      }),
      positionOffset: n.default.shape({
        x: n.default.oneOfType([n.default.number, n.default.string]),
        y: n.default.oneOfType([n.default.number, n.default.string])
      }),
      /**
       * `position`, if present, defines the current position of the element.
       *
       *  This is similar to how form elements in React work - if no `position` is supplied, the component
       *  is uncontrolled.
       *
       * Example:
       *
       * ```jsx
       *      let App = React.createClass({
       *          render: function () {
       *              return (
       *                  <Draggable position={{x: 25, y: 25}}>
       *                      <div>I start with transformX: 25px and transformY: 25px;</div>
       *                  </Draggable>
       *              );
       *          }
       *      });
       * ```
       */
      position: n.default.shape({
        x: n.default.number,
        y: n.default.number
      }),
      /**
       * These properties should be defined on the child, not here.
       */
      className: a.dontSetMe,
      style: a.dontSetMe,
      transform: a.dontSetMe
    }), g(b, "defaultProps", {
      ...c.default.defaultProps,
      axis: "both",
      bounds: !1,
      defaultClassName: "react-draggable",
      defaultClassNameDragging: "react-draggable-dragging",
      defaultClassNameDragged: "react-draggable-dragged",
      defaultPosition: {
        x: 0,
        y: 0
      },
      scale: 1
    });
  })(fs)), fs;
}
var Lu;
function IR() {
  if (Lu) return xr.exports;
  Lu = 1;
  const {
    default: e,
    DraggableCore: t
  } = RR();
  return xr.exports = e, xr.exports.default = e, xr.exports.DraggableCore = t, xr.exports;
}
var TR = IR();
const bc = /* @__PURE__ */ Ry(TR);
var NR = "sbg7cx0", AR = "sbg7cx1";
let $r = null;
const Zs = /* @__PURE__ */ new Set();
function Dm() {
  for (const e of Zs) e();
}
function OR(e) {
  $r !== e && ($r = e, Dm());
}
function PR(e) {
  $r === e && ($r = null, Dm());
}
function MR(e) {
  return Zs.add(e), () => {
    Zs.delete(e);
  };
}
function kR(e) {
  return ry(
    MR,
    () => $r === e,
    () => !1
  );
}
function $m({
  rect: e,
  committed: t,
  viewport: n,
  collisionPadding: r
}) {
  const o = e.left - t.x, i = e.top - t.y, s = r - o, a = r - i, c = Math.max(s, n.width - r - e.width - o), u = Math.max(a, n.height - r - e.height - i);
  return { left: s, top: a, right: c, bottom: u };
}
function DR({ rect: e, target: t, committed: n, viewport: r, collisionPadding: o }) {
  const { left: i, top: s, right: a, bottom: c } = $m({ rect: e, committed: n, viewport: r, collisionPadding: o });
  return {
    x: Math.min(Math.max(t.x, i), a),
    y: Math.min(Math.max(t.y, s), c)
  };
}
const $R = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left"
};
function Fu(e, t) {
  const { rect: n, size: r, sideOffset: o, collisionPadding: i, viewport: s } = t, a = o + (e === "top" || e === "bottom" ? r.height : r.width);
  switch (e) {
    case "top":
      return n.top - i >= a;
    case "bottom":
      return s.height - n.bottom - i >= a;
    case "left":
      return n.left - i >= a;
    case "right":
      return s.width - n.right - i >= a;
  }
}
function Vu(e, { rect: t, viewport: n }) {
  switch (e) {
    case "top":
      return t.top;
    case "bottom":
      return n.height - t.bottom;
    case "left":
      return t.left;
    case "right":
      return n.width - t.right;
  }
}
function LR(e) {
  const { side: t } = e;
  if (Fu(t, e)) return t;
  const n = $R[t];
  return Fu(n, e) || Vu(n, e) > Vu(t, e) ? n : t;
}
function FR(e) {
  const { rect: t, size: n, align: r, sideOffset: o, alignOffset: i, viewport: s } = e, a = LR(e), c = a === "top" || a === "bottom", u = { side: a };
  return a === "top" ? u.bottom = s.height - t.top + o : a === "bottom" ? u.top = t.bottom + o : a === "left" ? u.right = s.width - t.left + o : u.left = t.right + o, c ? r === "center" ? u.left = t.left + t.width / 2 - n.width / 2 + i : r === "end" ? u.right = s.width - t.right + i : u.left = t.left + i : r === "center" ? u.top = t.top + t.height / 2 - n.height / 2 + i : r === "end" ? u.bottom = s.height - t.bottom + i : u.top = t.top + i, u;
}
function VR({
  anchor: e,
  triggerRef: t,
  nodeRef: n,
  side: r,
  align: o,
  sideOffset: i,
  alignOffset: s,
  fallbackOffset: a,
  collisionPadding: c
}) {
  const [u, d] = ne(null);
  return jt(() => {
    const l = e ?? t.current, f = n.current, g = { width: window.innerWidth, height: window.innerHeight };
    d(
      l ? FR({
        rect: l.getBoundingClientRect(),
        // `node` is normally present (its ref attaches before this layout effect). If it isn't,
        // fall back to a zero size rather than the corner: the position still edge-anchors to
        // the trigger (size only affects the flip decision and centering), which degrades far
        // more gracefully than dropping the panel to the top-left of the viewport.
        size: f ? { width: f.offsetWidth, height: f.offsetHeight } : { width: 0, height: 0 },
        side: r,
        align: o,
        sideOffset: i,
        alignOffset: s,
        collisionPadding: c,
        viewport: g
      }) : { top: a, left: a, side: r }
    );
  }, []), u;
}
function BR({
  anchor: e,
  triggerRef: t,
  side: n,
  align: r,
  sideOffset: o,
  alignOffset: i,
  collisionPadding: s
}) {
  const a = ue(null), [c, u] = ne(null), [d, l] = ne({ x: 0, y: 0 }), [f, g] = ne(void 0), v = q((w) => {
    a.current = w, u(w);
  }, []), p = VR({
    anchor: e,
    triggerRef: t,
    nodeRef: a,
    side: n,
    align: r,
    sideOffset: o,
    alignOffset: i,
    fallbackOffset: s,
    collisionPadding: s
  }), b = q(
    (w, _) => {
      const C = a.current;
      return C ? DR({
        rect: C.getBoundingClientRect(),
        target: w,
        committed: _,
        viewport: { width: window.innerWidth, height: window.innerHeight },
        collisionPadding: s
      }) : w;
    },
    [s]
  ), y = q(
    (w, _) => {
      const C = a.current;
      C && g(
        $m({
          rect: C.getBoundingClientRect(),
          committed: { x: _.x, y: _.y },
          viewport: { width: window.innerWidth, height: window.innerHeight },
          collisionPadding: s
        })
      );
    },
    [s]
  ), S = q((w, _) => {
    l({ x: _.x, y: _.y });
  }, []);
  return jt(() => {
    if (!p) return;
    const w = () => l((_) => b(_, _));
    return w(), window.addEventListener("resize", w), () => window.removeEventListener("resize", w);
  }, [p, b]), { setWrapper: v, nodeRef: a, wrapperEl: c, anchorStyle: p, position: d, bounds: f, onStart: y, onDrag: S };
}
const zR = "zui-panel-drag-handle", jR = "zui-panel-no-drag", UR = 8;
function Ci({
  open: e,
  triggerRef: t,
  anchor: n,
  side: r = "top",
  align: o = "start",
  sideOffset: i = 8,
  alignOffset: s = 0,
  collisionPadding: a = UR,
  id: c,
  "aria-label": u,
  className: d,
  style: l,
  "data-testid": f,
  children: g
}) {
  const v = Se(), p = Ye(), [b, y] = ne(!1), S = En(), w = kR(S), { setWrapper: _, nodeRef: C, wrapperEl: R, anchorStyle: x, position: E, bounds: I, onStart: M, onDrag: N } = BR({
    anchor: n,
    triggerRef: t,
    side: r,
    align: o,
    sideOffset: i,
    alignOffset: s,
    collisionPadding: a
  });
  oe(() => {
    y(!0);
  }, []), oe(() => {
    if (!R) return;
    const T = t.current;
    return R.focus(), () => {
      var O;
      (O = T == null ? void 0 : T.focus) == null || O.call(T);
    };
  }, [R, t]);
  const $ = q(() => OR(S), [S]);
  return oe(() => ($(), () => PR(S)), [$, S]), e ? /* @__PURE__ */ h(In, { children: /* @__PURE__ */ h("div", { className: NR, style: p, "data-theme": v, "data-active": w || void 0, children: /* @__PURE__ */ h(
    bc,
    {
      nodeRef: C,
      handle: `.${zR}`,
      cancel: `.${jR}`,
      position: E,
      bounds: I,
      onStart: M,
      onDrag: N,
      children: /* @__PURE__ */ h(
        "div",
        {
          ref: _,
          id: c,
          className: X(AR, bw, d),
          style: {
            visibility: x ? "visible" : "hidden",
            ...x && {
              top: x.top,
              bottom: x.bottom,
              left: x.left,
              right: x.right
            },
            ...l
          },
          "data-state": b ? "open" : "closed",
          "data-theme": v,
          "data-testid": f,
          role: "dialog",
          "aria-label": u,
          tabIndex: -1,
          onPointerDownCapture: $,
          onFocusCapture: $,
          children: g
        }
      )
    }
  ) }) }) : null;
}
function HR(e, t) {
  const [n, r] = ne(e);
  return oe(() => {
    const o = setTimeout(() => r(e), t);
    return () => clearTimeout(o);
  }, [e, t]), n;
}
function Vn(e, t, n) {
  let r = n.initialDeps ?? [], o, i = !0;
  function s() {
    var a, c, u;
    let d;
    n.key && ((a = n.debug) != null && a.call(n)) && (d = Date.now());
    const l = e();
    if (!(l.length !== r.length || l.some((v, p) => r[p] !== v)))
      return o;
    r = l;
    let g;
    if (n.key && ((c = n.debug) != null && c.call(n)) && (g = Date.now()), o = t(...l), n.key && ((u = n.debug) != null && u.call(n))) {
      const v = Math.round((Date.now() - d) * 100) / 100, p = Math.round((Date.now() - g) * 100) / 100, b = p / 16, y = (S, w) => {
        for (S = String(S); S.length < w; )
          S = " " + S;
        return S;
      };
      console.info(
        `%c⏱ ${y(p, 5)} /${y(v, 5)} ms`,
        `
            font-size: .6rem;
            font-weight: bold;
            color: hsl(${Math.max(
          0,
          Math.min(120 - 120 * b, 120)
        )}deg 100% 31%);`,
        n == null ? void 0 : n.key
      );
    }
    return n != null && n.onChange && !(i && n.skipInitialOnChange) && n.onChange(o), i = !1, o;
  }
  return s.updateDeps = (a) => {
    r = a;
  }, s;
}
function Bu(e, t) {
  if (e === void 0)
    throw new Error("Unexpected undefined");
  return e;
}
const WR = (e, t) => Math.abs(e - t) < 1.01, KR = (e, t, n) => {
  let r;
  return function(...o) {
    e.clearTimeout(r), r = e.setTimeout(() => t.apply(this, o), n);
  };
}, zu = (e) => {
  const { offsetWidth: t, offsetHeight: n } = e;
  return { width: t, height: n };
}, qR = (e) => e, GR = (e) => {
  const t = Math.max(e.startIndex - e.overscan, 0), n = Math.min(e.endIndex + e.overscan, e.count - 1), r = [];
  for (let o = t; o <= n; o++)
    r.push(o);
  return r;
}, YR = (e, t) => {
  const n = e.scrollElement;
  if (!n)
    return;
  const r = e.targetWindow;
  if (!r)
    return;
  const o = (s) => {
    const { width: a, height: c } = s;
    t({ width: Math.round(a), height: Math.round(c) });
  };
  if (o(zu(n)), !r.ResizeObserver)
    return () => {
    };
  const i = new r.ResizeObserver((s) => {
    const a = () => {
      const c = s[0];
      if (c != null && c.borderBoxSize) {
        const u = c.borderBoxSize[0];
        if (u) {
          o({ width: u.inlineSize, height: u.blockSize });
          return;
        }
      }
      o(zu(n));
    };
    e.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(a) : a();
  });
  return i.observe(n, { box: "border-box" }), () => {
    i.unobserve(n);
  };
}, ju = {
  passive: !0
}, Uu = typeof window > "u" ? !0 : "onscrollend" in window, XR = (e, t) => {
  const n = e.scrollElement;
  if (!n)
    return;
  const r = e.targetWindow;
  if (!r)
    return;
  let o = 0;
  const i = e.options.useScrollendEvent && Uu ? () => {
  } : KR(
    r,
    () => {
      t(o, !1);
    },
    e.options.isScrollingResetDelay
  ), s = (d) => () => {
    const { horizontal: l, isRtl: f } = e.options;
    o = l ? n.scrollLeft * (f && -1 || 1) : n.scrollTop, i(), t(o, d);
  }, a = s(!0), c = s(!1);
  n.addEventListener("scroll", a, ju);
  const u = e.options.useScrollendEvent && Uu;
  return u && n.addEventListener("scrollend", c, ju), () => {
    n.removeEventListener("scroll", a), u && n.removeEventListener("scrollend", c);
  };
}, ZR = (e, t, n) => {
  if (t != null && t.borderBoxSize) {
    const r = t.borderBoxSize[0];
    if (r)
      return Math.round(
        r[n.options.horizontal ? "inlineSize" : "blockSize"]
      );
  }
  return e[n.options.horizontal ? "offsetWidth" : "offsetHeight"];
}, JR = (e, {
  adjustments: t = 0,
  behavior: n
}, r) => {
  var o, i;
  const s = e + t;
  (i = (o = r.scrollElement) == null ? void 0 : o.scrollTo) == null || i.call(o, {
    [r.options.horizontal ? "left" : "top"]: s,
    behavior: n
  });
};
class QR {
  constructor(t) {
    this.unsubs = [], this.scrollElement = null, this.targetWindow = null, this.isScrolling = !1, this.scrollState = null, this.measurementsCache = [], this.itemSizeCache = /* @__PURE__ */ new Map(), this.laneAssignments = /* @__PURE__ */ new Map(), this.pendingMeasuredCacheIndexes = [], this.prevLanes = void 0, this.lanesChangedFlag = !1, this.lanesSettling = !1, this.scrollRect = null, this.scrollOffset = null, this.scrollDirection = null, this.scrollAdjustments = 0, this.elementsCache = /* @__PURE__ */ new Map(), this.now = () => {
      var n, r, o;
      return ((o = (r = (n = this.targetWindow) == null ? void 0 : n.performance) == null ? void 0 : r.now) == null ? void 0 : o.call(r)) ?? Date.now();
    }, this.observer = /* @__PURE__ */ (() => {
      let n = null;
      const r = () => n || (!this.targetWindow || !this.targetWindow.ResizeObserver ? null : n = new this.targetWindow.ResizeObserver((o) => {
        o.forEach((i) => {
          const s = () => {
            const a = i.target, c = this.indexFromElement(a);
            if (!a.isConnected) {
              this.observer.unobserve(a);
              return;
            }
            this.shouldMeasureDuringScroll(c) && this.resizeItem(
              c,
              this.options.measureElement(a, i, this)
            );
          };
          this.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(s) : s();
        });
      }));
      return {
        disconnect: () => {
          var o;
          (o = r()) == null || o.disconnect(), n = null;
        },
        observe: (o) => {
          var i;
          return (i = r()) == null ? void 0 : i.observe(o, { box: "border-box" });
        },
        unobserve: (o) => {
          var i;
          return (i = r()) == null ? void 0 : i.unobserve(o);
        }
      };
    })(), this.range = null, this.setOptions = (n) => {
      Object.entries(n).forEach(([r, o]) => {
        typeof o > "u" && delete n[r];
      }), this.options = {
        debug: !1,
        initialOffset: 0,
        overscan: 1,
        paddingStart: 0,
        paddingEnd: 0,
        scrollPaddingStart: 0,
        scrollPaddingEnd: 0,
        horizontal: !1,
        getItemKey: qR,
        rangeExtractor: GR,
        onChange: () => {
        },
        measureElement: ZR,
        initialRect: { width: 0, height: 0 },
        scrollMargin: 0,
        gap: 0,
        indexAttribute: "data-index",
        initialMeasurementsCache: [],
        lanes: 1,
        isScrollingResetDelay: 150,
        enabled: !0,
        isRtl: !1,
        useScrollendEvent: !1,
        useAnimationFrameWithResizeObserver: !1,
        ...n
      };
    }, this.notify = (n) => {
      var r, o;
      (o = (r = this.options).onChange) == null || o.call(r, this, n);
    }, this.maybeNotify = Vn(
      () => (this.calculateRange(), [
        this.isScrolling,
        this.range ? this.range.startIndex : null,
        this.range ? this.range.endIndex : null
      ]),
      (n) => {
        this.notify(n);
      },
      {
        key: process.env.NODE_ENV !== "production" && "maybeNotify",
        debug: () => this.options.debug,
        initialDeps: [
          this.isScrolling,
          this.range ? this.range.startIndex : null,
          this.range ? this.range.endIndex : null
        ]
      }
    ), this.cleanup = () => {
      this.unsubs.filter(Boolean).forEach((n) => n()), this.unsubs = [], this.observer.disconnect(), this.rafId != null && this.targetWindow && (this.targetWindow.cancelAnimationFrame(this.rafId), this.rafId = null), this.scrollState = null, this.scrollElement = null, this.targetWindow = null;
    }, this._didMount = () => () => {
      this.cleanup();
    }, this._willUpdate = () => {
      var n;
      const r = this.options.enabled ? this.options.getScrollElement() : null;
      if (this.scrollElement !== r) {
        if (this.cleanup(), !r) {
          this.maybeNotify();
          return;
        }
        this.scrollElement = r, this.scrollElement && "ownerDocument" in this.scrollElement ? this.targetWindow = this.scrollElement.ownerDocument.defaultView : this.targetWindow = ((n = this.scrollElement) == null ? void 0 : n.window) ?? null, this.elementsCache.forEach((o) => {
          this.observer.observe(o);
        }), this.unsubs.push(
          this.options.observeElementRect(this, (o) => {
            this.scrollRect = o, this.maybeNotify();
          })
        ), this.unsubs.push(
          this.options.observeElementOffset(this, (o, i) => {
            this.scrollAdjustments = 0, this.scrollDirection = i ? this.getScrollOffset() < o ? "forward" : "backward" : null, this.scrollOffset = o, this.isScrolling = i, this.scrollState && this.scheduleScrollReconcile(), this.maybeNotify();
          })
        ), this._scrollToOffset(this.getScrollOffset(), {
          adjustments: void 0,
          behavior: void 0
        });
      }
    }, this.rafId = null, this.getSize = () => this.options.enabled ? (this.scrollRect = this.scrollRect ?? this.options.initialRect, this.scrollRect[this.options.horizontal ? "width" : "height"]) : (this.scrollRect = null, 0), this.getScrollOffset = () => this.options.enabled ? (this.scrollOffset = this.scrollOffset ?? (typeof this.options.initialOffset == "function" ? this.options.initialOffset() : this.options.initialOffset), this.scrollOffset) : (this.scrollOffset = null, 0), this.getFurthestMeasurement = (n, r) => {
      const o = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
      for (let s = r - 1; s >= 0; s--) {
        const a = n[s];
        if (o.has(a.lane))
          continue;
        const c = i.get(
          a.lane
        );
        if (c == null || a.end > c.end ? i.set(a.lane, a) : a.end < c.end && o.set(a.lane, !0), o.size === this.options.lanes)
          break;
      }
      return i.size === this.options.lanes ? Array.from(i.values()).sort((s, a) => s.end === a.end ? s.index - a.index : s.end - a.end)[0] : void 0;
    }, this.getMeasurementOptions = Vn(
      () => [
        this.options.count,
        this.options.paddingStart,
        this.options.scrollMargin,
        this.options.getItemKey,
        this.options.enabled,
        this.options.lanes
      ],
      (n, r, o, i, s, a) => (this.prevLanes !== void 0 && this.prevLanes !== a && (this.lanesChangedFlag = !0), this.prevLanes = a, this.pendingMeasuredCacheIndexes = [], {
        count: n,
        paddingStart: r,
        scrollMargin: o,
        getItemKey: i,
        enabled: s,
        lanes: a
      }),
      {
        key: !1
      }
    ), this.getMeasurements = Vn(
      () => [this.getMeasurementOptions(), this.itemSizeCache],
      ({ count: n, paddingStart: r, scrollMargin: o, getItemKey: i, enabled: s, lanes: a }, c) => {
        if (!s)
          return this.measurementsCache = [], this.itemSizeCache.clear(), this.laneAssignments.clear(), [];
        if (this.laneAssignments.size > n)
          for (const f of this.laneAssignments.keys())
            f >= n && this.laneAssignments.delete(f);
        this.lanesChangedFlag && (this.lanesChangedFlag = !1, this.lanesSettling = !0, this.measurementsCache = [], this.itemSizeCache.clear(), this.laneAssignments.clear(), this.pendingMeasuredCacheIndexes = []), this.measurementsCache.length === 0 && !this.lanesSettling && (this.measurementsCache = this.options.initialMeasurementsCache, this.measurementsCache.forEach((f) => {
          this.itemSizeCache.set(f.key, f.size);
        }));
        const u = this.lanesSettling ? 0 : this.pendingMeasuredCacheIndexes.length > 0 ? Math.min(...this.pendingMeasuredCacheIndexes) : 0;
        this.pendingMeasuredCacheIndexes = [], this.lanesSettling && this.measurementsCache.length === n && (this.lanesSettling = !1);
        const d = this.measurementsCache.slice(0, u), l = new Array(a).fill(
          void 0
        );
        for (let f = 0; f < u; f++) {
          const g = d[f];
          g && (l[g.lane] = f);
        }
        for (let f = u; f < n; f++) {
          const g = i(f), v = this.laneAssignments.get(f);
          let p, b;
          if (v !== void 0 && this.options.lanes > 1) {
            p = v;
            const _ = l[p], C = _ !== void 0 ? d[_] : void 0;
            b = C ? C.end + this.options.gap : r + o;
          } else {
            const _ = this.options.lanes === 1 ? d[f - 1] : this.getFurthestMeasurement(d, f);
            b = _ ? _.end + this.options.gap : r + o, p = _ ? _.lane : f % this.options.lanes, this.options.lanes > 1 && this.laneAssignments.set(f, p);
          }
          const y = c.get(g), S = typeof y == "number" ? y : this.options.estimateSize(f), w = b + S;
          d[f] = {
            index: f,
            start: b,
            size: S,
            end: w,
            key: g,
            lane: p
          }, l[p] = f;
        }
        return this.measurementsCache = d, d;
      },
      {
        key: process.env.NODE_ENV !== "production" && "getMeasurements",
        debug: () => this.options.debug
      }
    ), this.calculateRange = Vn(
      () => [
        this.getMeasurements(),
        this.getSize(),
        this.getScrollOffset(),
        this.options.lanes
      ],
      (n, r, o, i) => this.range = n.length > 0 && r > 0 ? eI({
        measurements: n,
        outerSize: r,
        scrollOffset: o,
        lanes: i
      }) : null,
      {
        key: process.env.NODE_ENV !== "production" && "calculateRange",
        debug: () => this.options.debug
      }
    ), this.getVirtualIndexes = Vn(
      () => {
        let n = null, r = null;
        const o = this.calculateRange();
        return o && (n = o.startIndex, r = o.endIndex), this.maybeNotify.updateDeps([this.isScrolling, n, r]), [
          this.options.rangeExtractor,
          this.options.overscan,
          this.options.count,
          n,
          r
        ];
      },
      (n, r, o, i, s) => i === null || s === null ? [] : n({
        startIndex: i,
        endIndex: s,
        overscan: r,
        count: o
      }),
      {
        key: process.env.NODE_ENV !== "production" && "getVirtualIndexes",
        debug: () => this.options.debug
      }
    ), this.indexFromElement = (n) => {
      const r = this.options.indexAttribute, o = n.getAttribute(r);
      return o ? parseInt(o, 10) : (console.warn(
        `Missing attribute name '${r}={index}' on measured element.`
      ), -1);
    }, this.shouldMeasureDuringScroll = (n) => {
      var r;
      if (!this.scrollState || this.scrollState.behavior !== "smooth")
        return !0;
      const o = this.scrollState.index ?? ((r = this.getVirtualItemForOffset(this.scrollState.lastTargetOffset)) == null ? void 0 : r.index);
      if (o !== void 0 && this.range) {
        const i = Math.max(
          this.options.overscan,
          Math.ceil((this.range.endIndex - this.range.startIndex) / 2)
        ), s = Math.max(0, o - i), a = Math.min(
          this.options.count - 1,
          o + i
        );
        return n >= s && n <= a;
      }
      return !0;
    }, this.measureElement = (n) => {
      if (!n) {
        this.elementsCache.forEach((s, a) => {
          s.isConnected || (this.observer.unobserve(s), this.elementsCache.delete(a));
        });
        return;
      }
      const r = this.indexFromElement(n), o = this.options.getItemKey(r), i = this.elementsCache.get(o);
      i !== n && (i && this.observer.unobserve(i), this.observer.observe(n), this.elementsCache.set(o, n)), (!this.isScrolling || this.scrollState) && this.shouldMeasureDuringScroll(r) && this.resizeItem(r, this.options.measureElement(n, void 0, this));
    }, this.resizeItem = (n, r) => {
      var o;
      const i = this.measurementsCache[n];
      if (!i) return;
      const s = this.itemSizeCache.get(i.key) ?? i.size, a = r - s;
      a !== 0 && (((o = this.scrollState) == null ? void 0 : o.behavior) !== "smooth" && (this.shouldAdjustScrollPositionOnItemSizeChange !== void 0 ? this.shouldAdjustScrollPositionOnItemSizeChange(i, a, this) : i.start < this.getScrollOffset() + this.scrollAdjustments) && (process.env.NODE_ENV !== "production" && this.options.debug && console.info("correction", a), this._scrollToOffset(this.getScrollOffset(), {
        adjustments: this.scrollAdjustments += a,
        behavior: void 0
      })), this.pendingMeasuredCacheIndexes.push(i.index), this.itemSizeCache = new Map(this.itemSizeCache.set(i.key, r)), this.notify(!1));
    }, this.getVirtualItems = Vn(
      () => [this.getVirtualIndexes(), this.getMeasurements()],
      (n, r) => {
        const o = [];
        for (let i = 0, s = n.length; i < s; i++) {
          const a = n[i], c = r[a];
          o.push(c);
        }
        return o;
      },
      {
        key: process.env.NODE_ENV !== "production" && "getVirtualItems",
        debug: () => this.options.debug
      }
    ), this.getVirtualItemForOffset = (n) => {
      const r = this.getMeasurements();
      if (r.length !== 0)
        return Bu(
          r[Lm(
            0,
            r.length - 1,
            (o) => Bu(r[o]).start,
            n
          )]
        );
    }, this.getMaxScrollOffset = () => {
      if (!this.scrollElement) return 0;
      if ("scrollHeight" in this.scrollElement)
        return this.options.horizontal ? this.scrollElement.scrollWidth - this.scrollElement.clientWidth : this.scrollElement.scrollHeight - this.scrollElement.clientHeight;
      {
        const n = this.scrollElement.document.documentElement;
        return this.options.horizontal ? n.scrollWidth - this.scrollElement.innerWidth : n.scrollHeight - this.scrollElement.innerHeight;
      }
    }, this.getOffsetForAlignment = (n, r, o = 0) => {
      if (!this.scrollElement) return 0;
      const i = this.getSize(), s = this.getScrollOffset();
      r === "auto" && (r = n >= s + i ? "end" : "start"), r === "center" ? n += (o - i) / 2 : r === "end" && (n -= i);
      const a = this.getMaxScrollOffset();
      return Math.max(Math.min(a, n), 0);
    }, this.getOffsetForIndex = (n, r = "auto") => {
      n = Math.max(0, Math.min(n, this.options.count - 1));
      const o = this.getSize(), i = this.getScrollOffset(), s = this.measurementsCache[n];
      if (!s) return;
      if (r === "auto")
        if (s.end >= i + o - this.options.scrollPaddingEnd)
          r = "end";
        else if (s.start <= i + this.options.scrollPaddingStart)
          r = "start";
        else
          return [i, r];
      if (r === "end" && n === this.options.count - 1)
        return [this.getMaxScrollOffset(), r];
      const a = r === "end" ? s.end + this.options.scrollPaddingEnd : s.start - this.options.scrollPaddingStart;
      return [
        this.getOffsetForAlignment(a, r, s.size),
        r
      ];
    }, this.scrollToOffset = (n, { align: r = "start", behavior: o = "auto" } = {}) => {
      const i = this.getOffsetForAlignment(n, r), s = this.now();
      this.scrollState = {
        index: null,
        align: r,
        behavior: o,
        startedAt: s,
        lastTargetOffset: i,
        stableFrames: 0
      }, this._scrollToOffset(i, { adjustments: void 0, behavior: o }), this.scheduleScrollReconcile();
    }, this.scrollToIndex = (n, {
      align: r = "auto",
      behavior: o = "auto"
    } = {}) => {
      n = Math.max(0, Math.min(n, this.options.count - 1));
      const i = this.getOffsetForIndex(n, r);
      if (!i)
        return;
      const [s, a] = i, c = this.now();
      this.scrollState = {
        index: n,
        align: a,
        behavior: o,
        startedAt: c,
        lastTargetOffset: s,
        stableFrames: 0
      }, this._scrollToOffset(s, { adjustments: void 0, behavior: o }), this.scheduleScrollReconcile();
    }, this.scrollBy = (n, { behavior: r = "auto" } = {}) => {
      const o = this.getScrollOffset() + n, i = this.now();
      this.scrollState = {
        index: null,
        align: "start",
        behavior: r,
        startedAt: i,
        lastTargetOffset: o,
        stableFrames: 0
      }, this._scrollToOffset(o, { adjustments: void 0, behavior: r }), this.scheduleScrollReconcile();
    }, this.getTotalSize = () => {
      var n;
      const r = this.getMeasurements();
      let o;
      if (r.length === 0)
        o = this.options.paddingStart;
      else if (this.options.lanes === 1)
        o = ((n = r[r.length - 1]) == null ? void 0 : n.end) ?? 0;
      else {
        const i = Array(this.options.lanes).fill(null);
        let s = r.length - 1;
        for (; s >= 0 && i.some((a) => a === null); ) {
          const a = r[s];
          i[a.lane] === null && (i[a.lane] = a.end), s--;
        }
        o = Math.max(...i.filter((a) => a !== null));
      }
      return Math.max(
        o - this.options.scrollMargin + this.options.paddingEnd,
        0
      );
    }, this._scrollToOffset = (n, {
      adjustments: r,
      behavior: o
    }) => {
      this.options.scrollToFn(n, { behavior: o, adjustments: r }, this);
    }, this.measure = () => {
      this.itemSizeCache = /* @__PURE__ */ new Map(), this.laneAssignments = /* @__PURE__ */ new Map(), this.notify(!1);
    }, this.setOptions(t);
  }
  scheduleScrollReconcile() {
    if (!this.targetWindow) {
      this.scrollState = null;
      return;
    }
    this.rafId == null && (this.rafId = this.targetWindow.requestAnimationFrame(() => {
      this.rafId = null, this.reconcileScroll();
    }));
  }
  reconcileScroll() {
    if (!this.scrollState || !this.scrollElement) return;
    if (this.now() - this.scrollState.startedAt > 5e3) {
      this.scrollState = null;
      return;
    }
    const r = this.scrollState.index != null ? this.getOffsetForIndex(this.scrollState.index, this.scrollState.align) : void 0, o = r ? r[0] : this.scrollState.lastTargetOffset, i = 1, s = o !== this.scrollState.lastTargetOffset;
    if (!s && WR(o, this.getScrollOffset())) {
      if (this.scrollState.stableFrames++, this.scrollState.stableFrames >= i) {
        this.scrollState = null;
        return;
      }
    } else
      this.scrollState.stableFrames = 0, s && (this.scrollState.lastTargetOffset = o, this.scrollState.behavior = "auto", this._scrollToOffset(o, {
        adjustments: void 0,
        behavior: "auto"
      }));
    this.scheduleScrollReconcile();
  }
}
const Lm = (e, t, n, r) => {
  for (; e <= t; ) {
    const o = (e + t) / 2 | 0, i = n(o);
    if (i < r)
      e = o + 1;
    else if (i > r)
      t = o - 1;
    else
      return o;
  }
  return e > 0 ? e - 1 : 0;
};
function eI({
  measurements: e,
  outerSize: t,
  scrollOffset: n,
  lanes: r
}) {
  const o = e.length - 1, i = (c) => e[c].start;
  if (e.length <= r)
    return {
      startIndex: 0,
      endIndex: o
    };
  let s = Lm(
    0,
    o,
    i,
    n
  ), a = s;
  if (r === 1)
    for (; a < o && e[a].end < n + t; )
      a++;
  else if (r > 1) {
    const c = Array(r).fill(0);
    for (; a < o && c.some((d) => d < n + t); ) {
      const d = e[a];
      c[d.lane] = d.end, a++;
    }
    const u = Array(r).fill(n + t);
    for (; s >= 0 && u.some((d) => d >= n); ) {
      const d = e[s];
      u[d.lane] = d.start, s--;
    }
    s = Math.max(0, s - s % r), a = Math.min(o, a + (r - 1 - a % r));
  }
  return { startIndex: s, endIndex: a };
}
const Hu = typeof document < "u" ? m.useLayoutEffect : m.useEffect;
function tI({
  useFlushSync: e = !0,
  ...t
}) {
  const n = m.useReducer(() => ({}), {})[1], r = {
    ...t,
    onChange: (i, s) => {
      var a;
      e && s ? iy(n) : n(), (a = t.onChange) == null || a.call(t, i, s);
    }
  }, [o] = m.useState(
    () => new QR(r)
  );
  return o.setOptions(r), Hu(() => o._didMount(), []), Hu(() => o._willUpdate()), o;
}
function nI(e) {
  return tI({
    observeElementRect: YR,
    observeElementOffset: XR,
    scrollToFn: JR,
    ...e
  });
}
function Sc({
  count: e,
  rowHeight: t,
  scrollElement: n,
  overscan: r = 5,
  horizontal: o = !1,
  getItemKey: i
}) {
  return nI({
    count: e,
    // Take the resolved element (via a callback ref + state), not a RefObject: TanStack reads
    // getScrollElement in a layout effect and won't retry if it sees null. A ref mutation is
    // invisible to it, so a deferred/remounted scroll node (Radix popover/dialog, mobile sheet)
    // leaves the virtualizer attached to nothing. A state change re-triggers the effect and re-attaches.
    getScrollElement: () => n,
    estimateSize: () => t,
    overscan: r,
    horizontal: o,
    ...i ? { getItemKey: i } : {}
  });
}
var Wu = "vzfug0 _14sdsl35", rI = "vzfug1", oI = "vzfug2";
const iI = "zui-panel-drag-handle", sI = "zui-panel-no-drag";
function Lr({
  title: e,
  children: t,
  className: n,
  style: r,
  anchor: o,
  placement: i = "top",
  open: s = !0,
  isMobile: a = !1,
  onClose: c,
  closeLabel: u = "Close",
  testId: d
}) {
  const l = Se(), f = Ye(), g = he(() => ({ current: o }), [o]), v = /* @__PURE__ */ P(pe, { children: [
    /* @__PURE__ */ P("div", { "data-theme": l, className: X(rI, iI), "data-mobile": a ? "true" : void 0, children: [
      /* @__PURE__ */ h("h2", { className: oI, children: e }),
      c && /* @__PURE__ */ h(
        vn,
        {
          kind: "icon",
          appearance: "quiet",
          enabled: a,
          type: "button",
          className: sI,
          "data-mobile": a ? "true" : void 0,
          onClick: c,
          "aria-label": u,
          "data-testid": d ? `${d}-close` : void 0,
          children: /* @__PURE__ */ h(li, { size: Ie.iconSize, "aria-hidden": "true" })
        }
      )
    ] }),
    t
  ] });
  return a ? s ? v : null : o ? /* @__PURE__ */ P(hc, { open: s, onOpenChange: (p) => !p && (c == null ? void 0 : c()), children: [
    /* @__PURE__ */ h(Im, { virtualRef: g }),
    /* @__PURE__ */ h(pc, { children: /* @__PURE__ */ h(
      mc,
      {
        asChild: !0,
        side: i,
        align: "start",
        sideOffset: 8,
        collisionPadding: 12,
        avoidCollisions: !0,
        "data-theme": l,
        children: /* @__PURE__ */ h(
          "div",
          {
            "data-theme": l,
            className: X(Wu, n),
            style: { ...f, ...r },
            "data-testid": d,
            children: v
          }
        )
      }
    ) })
  ] }) : s ? /* @__PURE__ */ h("div", { "data-theme": l, className: X(Wu, n), style: { ...f, ...r }, "data-testid": d, children: v }) : null;
}
var aI = "_55jvu00";
function wc({ className: e, label: t, size: n = 16, testId: r }) {
  const { t: o } = de();
  return /* @__PURE__ */ P("div", { className: X(aI, e), role: "status", "data-testid": r, children: [
    /* @__PURE__ */ h(Tn, { size: n, className: sr, "aria-hidden": "true" }),
    /* @__PURE__ */ h("span", { children: t ?? o("common.connecting") })
  ] });
}
function cI(e, t) {
  const n = [], r = [], o = [], i = [];
  for (const s of e)
    t !== void 0 && s.userId === t ? n.push(s) : s.isHost ? r.push(s) : s.isManager ? o.push(s) : i.push(s);
  return [...n, ...r, ...o, ...i];
}
var lI = "kxyey60", uI = "kxyey61 _14sdsl35", dI = "kxyey62";
function fI(e) {
  const t = e == null ? void 0 : e.closest(`.${Sw}`);
  if (!t || typeof window > "u") return;
  const n = window.getComputedStyle(t), r = t instanceof HTMLElement ? t.style : void 0;
  return {
    backgroundColor: n.backgroundColor,
    backdropFilter: n.getPropertyValue("backdrop-filter") || (r == null ? void 0 : r.backdropFilter),
    WebkitBackdropFilter: n.getPropertyValue("-webkit-backdrop-filter") || (r == null ? void 0 : r.WebkitBackdropFilter),
    borderColor: n.borderColor,
    boxShadow: n.boxShadow,
    color: n.color,
    fontFamily: n.fontFamily,
    fontSize: n.fontSize,
    fontWeight: n.fontWeight,
    opacity: n.opacity
  };
}
function Fm({
  label: e,
  title: t,
  trigger: n,
  items: r,
  open: o,
  onOpenChange: i,
  onCloseAutoFocus: s,
  isMobile: a = !1,
  side: c = "bottom",
  align: u = "center",
  sideOffset: d = 6,
  closeLabel: l
}) {
  const f = Se(), g = Ye(), [v, p] = ne(!1), b = o ?? v, y = q(
    (C) => {
      o === void 0 && p(C), i == null || i(C);
    },
    [o, i]
  ), S = ue(null), [w, _] = ne(void 0);
  return jt(() => {
    !b || a || _(fI(S.current));
  }, [a, b, f]), a ? /* @__PURE__ */ h(
    lc,
    {
      open: b,
      onOpenChange: y,
      title: t ?? e,
      trigger: n,
      closeLabel: l,
      onCloseAutoFocus: s,
      children: /* @__PURE__ */ h("div", { className: lI, children: r.map((C) => /* @__PURE__ */ h(vn, { asChild: !0, children: /* @__PURE__ */ P(
        nt,
        {
          presentation: "sheet",
          danger: C.danger,
          disabled: C.disabled,
          "data-disabled": C.disabled ? "" : void 0,
          onClick: C.onClick,
          children: [
            C.icon,
            C.text
          ]
        }
      ) }, C.id)) })
    }
  ) : /* @__PURE__ */ P(Jr, { open: b, onOpenChange: y, modal: !1, children: [
    /* @__PURE__ */ h(Qr, { asChild: !0, ref: S, children: n }),
    /* @__PURE__ */ h(ur, { children: /* @__PURE__ */ h(
      eo,
      {
        className: uI,
        side: c,
        align: u,
        avoidCollisions: !0,
        collisionPadding: 8,
        sideOffset: d,
        style: { ...g, ...w },
        "data-theme": f,
        onCloseAutoFocus: s,
        children: /* @__PURE__ */ h("div", { className: dI, children: r.map((C) => /* @__PURE__ */ h(nt, { asChild: !0, danger: C.danger, children: /* @__PURE__ */ P(
          ei,
          {
            disabled: C.disabled,
            style: w ? { color: C.danger ? void 0 : w.color, fontSize: w.fontSize } : void 0,
            onSelect: () => C.onClick(),
            children: [
              C.icon,
              C.text
            ]
          }
        ) }, C.id)) })
      }
    ) })
  ] });
}
const Ku = {
  rename: -1,
  mute: 0,
  unmute: 0,
  "make-host": 1,
  "make-manager": 2,
  "revoke-manager": 2,
  remove: 1 / 0
}, hI = (e) => e.filter((t) => !!t).sort((t, n) => Ku[t.id] - Ku[n.id]);
function pI() {
  var v, p, b;
  const { t: e } = de(), { client: t } = _e(), n = B((y) => y.participantState), r = (v = n.currentUser) == null ? void 0 : v.userId, o = ((p = n.currentUser) == null ? void 0 : p.isHost) ?? !1, i = ((b = n.currentUser) == null ? void 0 : b.isManager) ?? !1, s = he(() => Re(t), [t]), a = he(() => {
    var y;
    try {
      return ((y = t == null ? void 0 : t.isAllowToRename) == null ? void 0 : y.call(t)) ?? !0;
    } catch {
      return !0;
    }
  }, [t]), c = q(
    async (y) => {
      if (s)
        try {
          await s.muteAudio(y);
        } catch (S) {
          console.error(S);
        }
    },
    [s]
  ), u = q(
    async (y) => {
      if (s)
        try {
          await s.unmuteAudio(y);
        } catch (S) {
          console.error(S);
        }
    },
    [s]
  ), d = q(
    async (y) => {
      if (t)
        try {
          await t.removeUser(y);
        } catch (S) {
          console.error(S);
        }
    },
    [t]
  ), l = q(
    async (y) => {
      if (t)
        try {
          await t.makeManager(y);
        } catch (S) {
          console.error(S);
        }
    },
    [t]
  ), f = q(
    async (y) => {
      if (t)
        try {
          await t.revokeManager(y);
        } catch (S) {
          console.error(S);
        }
    },
    [t]
  );
  return q(
    (y, { onRename: S, onMakeHost: w } = {}) => {
      const { userId: _, isHost: C, isManager: R, muted: x, audio: E } = y, I = E === "computer" || E === "phone", M = _ === r, N = (A) => {
        switch (A) {
          case "rename":
            return !!S && {
              id: A,
              text: e("participant.rename"),
              onClick: S
            };
          case "mute":
            return I && x === !1 && {
              id: A,
              text: e("audio.mute"),
              onClick: () => c(_)
            };
          case "unmute":
            return I && x === !0 && {
              id: A,
              text: e("participant.ask_to_unmute"),
              onClick: () => u(_)
            };
          case "make-host":
            return !!w && {
              id: A,
              text: e("participant.make_host"),
              onClick: w
            };
          case "make-manager":
            return !R && {
              id: A,
              text: e("participant.make_manager"),
              onClick: () => l(_)
            };
          case "revoke-manager":
            return !!R && {
              id: A,
              text: e("participant.revoke_manager"),
              onClick: () => f(_)
            };
          case "remove":
            return {
              id: A,
              text: e("participant.remove"),
              onClick: () => d(_),
              danger: !0
            };
        }
      }, $ = [a && N("rename"), N("mute")], T = C ? [] : [
        N("rename"),
        N("mute"),
        N("unmute"),
        N("make-host"),
        N("make-manager"),
        N("revoke-manager"),
        N("remove")
      ], O = C ? [] : [
        !R && N("rename"),
        N("mute"),
        !R && N("unmute"),
        !R && N("remove")
      ];
      return hI(M ? $ : o ? T : i ? O : []);
    },
    [
      e,
      r,
      a,
      o,
      i,
      c,
      u,
      l,
      f,
      d
    ]
  );
}
var mI = "qm5m040", gI = "qm5m041", vI = "qm5m042";
const yI = 128;
function bI({
  open: e,
  onOpenChange: t,
  onCloseAutoFocus: n,
  participant: r
}) {
  const { t: o } = de(), { client: i } = _e(), s = r.displayName ?? "", [a, c] = ne(s), u = ue(null), d = e ? r.userId : null, [l, f] = ne(null);
  d !== l && (f(d), e && c(s));
  const g = a.trim(), v = g.length > 0 && g !== s.trim(), p = q(
    async (y) => {
      if (i)
        try {
          await i.changeName(y, r.userId);
        } catch (S) {
          console.error(S);
        }
    },
    [i, r.userId]
  ), b = q(
    (y) => {
      y.preventDefault(), v && (p(g), t(!1));
    },
    [v, p, g, t]
  );
  return /* @__PURE__ */ h(
    Sn,
    {
      open: e,
      onOpenChange: t,
      title: o("participant.rename"),
      contentOptions: {
        onCloseAutoFocus: n,
        onOpenAutoFocus: (y) => {
          var S;
          y.preventDefault(), (S = u.current) == null || S.focus();
        }
      },
      children: /* @__PURE__ */ P("form", { className: mI, onSubmit: b, children: [
        /* @__PURE__ */ h(
          "input",
          {
            ref: u,
            className: gI,
            type: "text",
            value: a,
            onChange: (y) => c(y.target.value),
            placeholder: o("participant.rename_placeholder"),
            "aria-label": o("participant.rename"),
            maxLength: yI,
            autoFocus: !0,
            onFocus: (y) => y.currentTarget.select()
          }
        ),
        /* @__PURE__ */ P("div", { className: vI, children: [
          /* @__PURE__ */ h(le, { size: "sm", type: "button", onClick: () => t(!1), children: o("participant.cancel") }),
          /* @__PURE__ */ h(le, { tone: "accent", size: "sm", type: "submit", disabled: !v, children: o("common.save") })
        ] })
      ] })
    }
  );
}
var SI = "_1x2hbti0";
function wI({ open: e, onOpenChange: t, onCloseAutoFocus: n, participant: r }) {
  const { t: o } = de(), { client: i } = _e(), s = r.displayName || o("common.guest"), a = q(async () => {
    if (i)
      try {
        await i.makeHost(r.userId);
      } catch (u) {
        console.error(u);
      }
  }, [i, r.userId]), c = q(() => {
    a(), t(!1);
  }, [a, t]);
  return /* @__PURE__ */ h(
    Sn,
    {
      open: e,
      onOpenChange: t,
      title: o("participant.change_host_to", { name: s }),
      description: o("participant.make_host_info"),
      showCloseButton: !1,
      contentOptions: { onCloseAutoFocus: n },
      children: /* @__PURE__ */ P("div", { className: SI, children: [
        /* @__PURE__ */ h(le, { size: "sm", type: "button", onClick: () => t(!1), children: o("participant.cancel") }),
        /* @__PURE__ */ h(le, { tone: "accent", size: "sm", type: "button", onClick: c, children: o("participant.change_host") })
      ] })
    }
  );
}
function _I({ participant: e, isMobile: t = !1, open: n, onOpenChange: r }) {
  const { t: o } = de(), i = pI(), s = ue(null), [a, c] = ne(null), u = q(() => c(
    "rename"
    /* Rename */
  ), []), d = q(() => c(
    "makehost"
    /* MakeHost */
  ), []), l = q(
    (y) => c(y ? "rename" : null),
    []
  ), f = q(
    (y) => c(y ? "makehost" : null),
    []
  ), g = q((y) => {
    var S;
    y.preventDefault(), (S = s.current) == null || S.focus({ preventScroll: !0 });
  }, []), v = he(
    () => i(e, { onRename: u, onMakeHost: d }),
    [i, e, u, d]
  ), p = e.displayName || o("common.guest"), b = /* @__PURE__ */ h(
    le,
    {
      kind: "icon",
      appearance: "quiet",
      ref: s,
      type: "button",
      "aria-label": o("participant.actions_for", { name: p }),
      children: /* @__PURE__ */ h(Hw, { size: Ie.iconSize })
    }
  );
  return /* @__PURE__ */ P(pe, { children: [
    v.length > 0 && /* @__PURE__ */ h(
      Fm,
      {
        label: o("participant.actions_for", { name: p }),
        title: p,
        trigger: b,
        items: v,
        open: n,
        onOpenChange: r,
        onCloseAutoFocus: (y) => {
          a !== null && y.preventDefault();
        },
        isMobile: t,
        side: "left",
        align: "center",
        sideOffset: 6,
        closeLabel: o("participant.cancel")
      }
    ),
    /* @__PURE__ */ h(
      bI,
      {
        open: a === "rename",
        onOpenChange: l,
        onCloseAutoFocus: g,
        participant: e
      }
    ),
    /* @__PURE__ */ h(
      wI,
      {
        open: a === "makehost",
        onOpenChange: f,
        onCloseAutoFocus: g,
        participant: e
      }
    )
  ] });
}
var CI = "ox6vq61", xI = "ox6vq62", EI = "ox6vq63", RI = "ox6vq64", II = "ox6vq65", TI = "ox6vq66", NI = "ox6vq67", AI = "ox6vq68", OI = "ox6vq69", Js = "ox6vq6a";
function PI({ audio: e, muted: t }) {
  return e ? e === "phone" ? t ? /* @__PURE__ */ h(u_, { size: 14, className: Js }) : /* @__PURE__ */ h(Df, { size: 14 }) : t ? /* @__PURE__ */ h(Ma, { size: 14, className: Js }) : /* @__PURE__ */ h(kf, { size: 14 }) : null;
}
function MI({ participant: e, isMobile: t, actionMenuOpen: n, onActionMenuOpenChange: r }) {
  var g;
  const { t: o } = de(), i = B((v) => v.participantState), s = e.userId === ((g = i.currentUser) == null ? void 0 : g.userId), a = i.activeSpeakers.some(({ userId: v }) => v === e.userId), c = e.displayName || o("common.guest"), d = [e.isHost ? o("participant.host") : e.isManager ? o("participant.manager") : null, s ? o("common.me") : null].filter(Boolean), l = d.length > 0 ? `(${d.join(", ")})` : null, f = q(
    (v) => r == null ? void 0 : r(e.userId, v),
    [r, e.userId]
  );
  return /* @__PURE__ */ P("div", { className: CI, role: "listitem", children: [
    /* @__PURE__ */ P("div", { className: xI, children: [
      /* @__PURE__ */ h("div", { className: EI, children: e.avatar ? /* @__PURE__ */ h("img", { src: e.avatar, alt: "", className: RI }) : gc(c) }),
      a && /* @__PURE__ */ h("span", { className: II, "aria-hidden": "true" })
    ] }),
    /* @__PURE__ */ P("div", { className: TI, children: [
      /* @__PURE__ */ h("span", { className: NI, children: c }),
      l && /* @__PURE__ */ h("span", { className: AI, children: l })
    ] }),
    /* @__PURE__ */ P("div", { className: OI, "aria-hidden": "true", children: [
      PI(e),
      e.bVideoOn ? /* @__PURE__ */ h(Da, { size: 14 }) : /* @__PURE__ */ h(ka, { size: 14, className: Js }),
      e.sharerOn && /* @__PURE__ */ h(ci, { size: 12 })
    ] }),
    /* @__PURE__ */ h(
      _I,
      {
        participant: e,
        isMobile: t,
        open: n,
        onOpenChange: f
      }
    )
  ] });
}
var kI = "_2i0rny0", DI = "_2i0rny1", $I = "_2i0rny2", LI = "_2i0rny3", FI = "_2i0rny4 _14sdsl36", VI = "_2i0rny5", qu = "_2i0rny6", BI = "_2i0rny7", Gu = "_2i0rny8";
const zI = 52;
function Yu({
  className: e,
  style: t,
  anchor: n,
  placement: r = "top",
  open: o = !0,
  isMobile: i = !1,
  onClose: s
}) {
  var O, F, A;
  const a = Se(), { t: c } = de(), { client: u } = _e(), d = B((D) => D.participantState), l = B((D) => D.sessionState), f = Tf(), g = Nf(), [v, p] = ne(""), b = ue(null), y = HR(v, 150), [S, w] = ne(null), [_, C] = ne(null), R = (((O = d.currentUser) == null ? void 0 : O.isHost) || ((F = d.currentUser) == null ? void 0 : F.isManager)) ?? !1, x = q(async () => {
    const D = Re(u);
    if (D)
      try {
        await D.muteAllAudio();
      } catch (V) {
        console.error(V);
      }
  }, [u]), E = q((D, V) => {
    C((z) => V ? D : z === D ? null : z);
  }, []);
  oe(() => {
    o || C(null);
  }, [o]);
  const I = l.connectionState === we.Connected, M = he(
    () => {
      var D;
      return cI(d.participants, (D = d.currentUser) == null ? void 0 : D.userId);
    },
    [d.participants, (A = d.currentUser) == null ? void 0 : A.userId]
  ), N = he(() => {
    const D = y.trim().toLowerCase();
    return D ? M.filter((V) => (V.displayName ?? "").toLowerCase().includes(D)) : M;
  }, [M, y]), $ = Sc({
    count: N.length,
    scrollElement: S,
    rowHeight: zI,
    getItemKey: (D) => N[D].userId
  }), T = d.participants.length;
  return /* @__PURE__ */ P(
    Lr,
    {
      title: `${c("toolbar.participants")} (${T})`,
      className: X(kI, e),
      style: t,
      anchor: n,
      placement: r,
      open: o,
      isMobile: i,
      onClose: s,
      closeLabel: c("common.close"),
      testId: "participant-panel",
      children: [
        /* @__PURE__ */ P("div", { "data-theme": a, className: DI, children: [
          /* @__PURE__ */ h(g_, { className: $I, size: 15, "aria-hidden": "true" }),
          /* @__PURE__ */ h(
            "input",
            {
              ref: b,
              className: LI,
              "data-mobile": i ? "true" : void 0,
              type: "search",
              placeholder: c("participant.search_placeholder"),
              value: v,
              onChange: (D) => p(D.target.value),
              "aria-label": c("participant.search_label")
            }
          ),
          v.length > 0 && /* @__PURE__ */ h(
            le,
            {
              kind: "icon",
              appearance: "quiet",
              type: "button",
              "data-mobile": i ? "true" : void 0,
              "aria-label": c("participant.clear_search"),
              onClick: () => {
                var D;
                p(""), (D = b.current) == null || D.focus();
              },
              children: /* @__PURE__ */ h(li, { size: Ie.iconSize, "aria-hidden": "true" })
            }
          )
        ] }),
        /* @__PURE__ */ h(
          "div",
          {
            "data-theme": a,
            ref: w,
            className: FI,
            role: "list",
            "aria-label": c("toolbar.participants"),
            children: /* @__PURE__ */ h("div", { className: VI, style: { height: $.getTotalSize() }, children: I ? N.length === 0 ? /* @__PURE__ */ h("div", { className: qu, children: c("participant.no_results") }) : $.getVirtualItems().map((D) => {
              const V = N[D.index];
              return /* @__PURE__ */ h(
                "div",
                {
                  style: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${D.size}px`,
                    transform: `translateY(${D.start}px)`
                  },
                  children: /* @__PURE__ */ h(
                    MI,
                    {
                      participant: V,
                      isMobile: i,
                      actionMenuOpen: _ === V.userId,
                      onActionMenuOpenChange: E
                    }
                  )
                },
                D.key
              );
            }) : (
              // The list is empty before the session connects for the same reason it is empty
              // after a search miss — show why, rather than "no results".
              /* @__PURE__ */ h(wc, { className: qu, testId: "participant-panel-loading" })
            ) })
          }
        ),
        /* @__PURE__ */ P("div", { "data-theme": a, className: BI, children: [
          f && /* @__PURE__ */ h(
            le,
            {
              tone: "neutral",
              size: "sm",
              className: Gu,
              type: "button",
              onClick: () => void g(),
              disabled: !I,
              "data-testid": "participant-panel-reclaim-host",
              children: c("session.reclaim_host")
            }
          ),
          R && /* @__PURE__ */ h(
            le,
            {
              tone: "danger",
              size: "sm",
              className: Gu,
              type: "button",
              onClick: () => void x(),
              disabled: !I,
              children: c("participant.mute_all")
            }
          )
        ] })
      ]
    }
  );
}
var jI = "_1fcn2100", UI = "_1fcn2101 _14sdsl3b _14sdsl39";
function HI({
  className: e,
  style: t,
  renderContent: n,
  onOpen: r,
  onClose: o,
  isMobile: i,
  panelClassName: s,
  panelStyle: a,
  anchor: c,
  popoverProps: u
}) {
  const { t: d } = de(), l = Se(), f = Ye(), g = B((I) => I.participantState), v = B((I) => I.sessionState), [p, b] = ne(!1), y = ue(null), S = En(), w = v.connectionState === we.Connected, _ = g.participants.length, C = q(() => {
    b(!0), r == null || r();
  }, [r]), R = q(() => {
    b(!1), o == null || o();
  }, [o]), x = () => /* @__PURE__ */ h(E_, { className: jI, size: Ie.iconSize, "aria-hidden": "true" }), E = `${d("toolbar.participants")}, ${_}`;
  return i ? /* @__PURE__ */ P(fr, { open: p, onOpenChange: (I) => I ? C() : R(), autoFocus: !0, children: [
    /* @__PURE__ */ h(Ae.Trigger, { asChild: !0, children: /* @__PURE__ */ h(
      le,
      {
        kind: "count",
        count: _,
        contentSized: !!n,
        className: e,
        style: t,
        size: "sm",
        active: p,
        disabled: !w,
        "aria-haspopup": "dialog",
        "aria-label": E,
        "data-testid": "participant-button",
        children: (n ?? x)()
      }
    ) }),
    /* @__PURE__ */ P(Ae.Portal, { children: [
      /* @__PURE__ */ h(hr, { className: ar, "data-theme": l }),
      /* @__PURE__ */ P(
        Ae.Content,
        {
          style: f,
          className: UI,
          "aria-describedby": void 0,
          "data-theme": l,
          "data-testid": "participant-panel",
          children: [
            /* @__PURE__ */ h(Ae.Title, { className: Hr, children: d("toolbar.participants") }),
            /* @__PURE__ */ h("div", { className: Ur, "aria-hidden": "true" }),
            /* @__PURE__ */ h(
              Yu,
              {
                className: s,
                style: a,
                isMobile: !0,
                onClose: () => b(!1)
              }
            )
          ]
        }
      )
    ] })
  ] }) : /* @__PURE__ */ P(pe, { children: [
    /* @__PURE__ */ h(
      le,
      {
        kind: "count",
        count: _,
        contentSized: !!n,
        ref: y,
        className: e,
        style: t,
        size: "sm",
        active: p,
        disabled: !w,
        "aria-haspopup": "dialog",
        "aria-label": E,
        "aria-expanded": p,
        "aria-controls": p ? S : void 0,
        "data-testid": "participant-button",
        onClick: () => p ? R() : C(),
        children: (n ?? x)()
      }
    ),
    p && /* @__PURE__ */ h(
      Ci,
      {
        open: !0,
        triggerRef: y,
        anchor: c,
        id: S,
        "aria-label": d("toolbar.participants"),
        side: (u == null ? void 0 : u.side) ?? "top",
        align: (u == null ? void 0 : u.align) ?? "start",
        sideOffset: (u == null ? void 0 : u.sideOffset) ?? 8,
        alignOffset: u == null ? void 0 : u.alignOffset,
        collisionPadding: (u == null ? void 0 : u.collisionPadding) ?? 12,
        children: /* @__PURE__ */ h(Yu, { className: s, style: a, open: !0, onClose: R })
      }
    )
  ] });
}
var WI = Object.defineProperty, pr = (e, t) => WI(e, "name", { value: t, configurable: !0 }), Vm = !!(typeof window < "u" && window.document && window.document.createElement);
function Dt(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
  return /* @__PURE__ */ pr(function(o) {
    if (e == null || e(o), n === !1 || !o || !o.defaultPrevented)
      return t == null ? void 0 : t(o);
  }, "handleEvent");
}
pr(Dt, "composeEventHandlers");
function KI(e) {
  var t;
  if (!Vm)
    throw new Error("Cannot access window outside of the DOM");
  return ((t = e == null ? void 0 : e.ownerDocument) == null ? void 0 : t.defaultView) ?? window;
}
pr(KI, "getOwnerWindow");
function Qs(e) {
  if (!Vm)
    throw new Error("Cannot access document outside of the DOM");
  return (e == null ? void 0 : e.ownerDocument) ?? document;
}
pr(Qs, "getOwnerDocument");
function Bm(e, t = !1) {
  const { activeElement: n } = Qs(e);
  if (!(n != null && n.nodeName))
    return null;
  if (zm(n) && n.contentDocument)
    return Bm(n.contentDocument.body, t);
  if (t) {
    const r = n.getAttribute("aria-activedescendant");
    if (r) {
      const o = Qs(n).getElementById(r);
      if (o)
        return o;
    }
  }
  return n;
}
pr(Bm, "getActiveElement");
function zm(e) {
  return e.tagName === "IFRAME";
}
pr(zm, "isFrame");
var qI = Object.defineProperty, vt = (e, t) => qI(e, "name", { value: t, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function GI(e, t) {
  const n = m.createContext(t);
  n.displayName = e + "Context";
  const r = /* @__PURE__ */ vt((i) => {
    const { children: s, ...a } = i, c = m.useMemo(() => a, Object.values(a));
    return /* @__PURE__ */ h(n.Provider, { value: c, children: s });
  }, "Provider");
  r.displayName = e + "Provider";
  function o(i, s = {}) {
    const { optional: a = !1 } = s, c = m.useContext(n);
    if (c) return c;
    if (t !== void 0) return t;
    if (!a)
      throw new Error(`\`${i}\` must be used within \`${e}\``);
  }
  return vt(o, "useContext"), [r, o];
}
vt(GI, "createContext");
// @__NO_SIDE_EFFECTS__
function no(e, t = []) {
  let n = [];
  function r(i, s) {
    const a = m.createContext(s);
    a.displayName = i + "Context";
    const c = n.length;
    n = [...n, s];
    const u = /* @__PURE__ */ vt((l) => {
      var y;
      const { scope: f, children: g, ...v } = l, p = ((y = f == null ? void 0 : f[e]) == null ? void 0 : y[c]) || a, b = m.useMemo(() => v, Object.values(v));
      return /* @__PURE__ */ h(p.Provider, { value: b, children: g });
    }, "Provider");
    u.displayName = i + "Provider";
    function d(l, f, g = {}) {
      var y;
      const { optional: v = !1 } = g, p = ((y = f == null ? void 0 : f[e]) == null ? void 0 : y[c]) || a, b = m.useContext(p);
      if (b) return b;
      if (s !== void 0) return s;
      if (!v)
        throw new Error(`\`${l}\` must be used within \`${i}\``);
    }
    return vt(d, "useContext"), [u, d];
  }
  vt(r, "createContext");
  const o = /* @__PURE__ */ vt(() => {
    const i = n.map((s) => m.createContext(s));
    return /* @__PURE__ */ vt(function(a) {
      const c = (a == null ? void 0 : a[e]) || i;
      return m.useMemo(
        () => ({ [`__scope${e}`]: { ...a, [e]: c } }),
        [a, c]
      );
    }, "useScope");
  }, "createScope");
  return o.scopeName = e, [r, jm(o, ...t)];
}
vt(no, "createContextScope");
function jm(...e) {
  const t = e[0];
  if (e.length === 1) return t;
  const n = /* @__PURE__ */ vt(() => {
    const r = e.map((o) => ({
      useScope: o(),
      scopeName: o.scopeName
    }));
    return /* @__PURE__ */ vt(function(i) {
      const s = r.reduce((a, { useScope: c, scopeName: u }) => {
        const l = c(i)[`__scope${u}`];
        return { ...a, ...l };
      }, {});
      return m.useMemo(() => ({ [`__scope${t.scopeName}`]: s }), [s]);
    }, "useComposedScopes");
  }, "createScope");
  return n.scopeName = t.scopeName, n;
}
vt(jm, "composeContextScopes");
var YI = Object.defineProperty, _c = (e, t) => YI(e, "name", { value: t, configurable: !0 });
function ea(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
_c(ea, "setRef");
function Um(...e) {
  return (t) => {
    let n = !1;
    const r = e.map((o) => {
      const i = ea(o, t);
      return !n && typeof i == "function" && (n = !0), i;
    });
    if (n)
      return () => {
        for (let o = 0; o < r.length; o++) {
          const i = r[o];
          typeof i == "function" ? i() : ea(e[o], null);
        }
      };
  };
}
_c(Um, "composeRefs");
function tn(...e) {
  return m.useCallback(Um(...e), e);
}
_c(tn, "useComposedRefs");
var XI = Object.defineProperty, It = (e, t) => XI(e, "name", { value: t, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function nr(e) {
  const t = m.forwardRef((n, r) => {
    let { children: o, ...i } = n, s = null, a = !1;
    const c = [];
    ta(o) && typeof Ao == "function" && (o = Ao(o._payload)), m.Children.forEach(o, (f) => {
      var g;
      if (qm(f)) {
        a = !0;
        const v = f;
        let p = "child" in v.props ? v.props.child : v.props.children;
        ta(p) && typeof Ao == "function" && (p = Ao(p._payload)), s = JI(v, p), c.push((g = s == null ? void 0 : s.props) == null ? void 0 : g.children);
      } else
        c.push(f);
    }), s ? s = m.cloneElement(s, void 0, c) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !a && m.Children.count(o) === 1 && m.isValidElement(o) && (s = o)
    );
    const u = s ? Km(s) : void 0, d = tn(r, u);
    if (!s) {
      if (o || o === 0)
        throw new Error(
          a ? tT(e) : eT(e)
        );
      return o;
    }
    const l = Wm(i, s.props ?? {});
    return s.type !== m.Fragment && (l.ref = r ? d : u), m.cloneElement(s, l);
  });
  return t.displayName = `${e}.Slot`, t;
}
It(nr, "createSlot");
var Hm = Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function ZI(e) {
  const t = /* @__PURE__ */ It((n) => "child" in n ? n.children(n.child) : n.children, "Slottable");
  return t.displayName = `${e}.Slottable`, t.__radixId = Hm, t;
}
It(ZI, "createSlottable");
var JI = /* @__PURE__ */ It((e, t) => {
  if ("child" in e.props) {
    const n = e.props.child;
    return m.isValidElement(n) ? m.cloneElement(n, void 0, e.props.children(n.props.children)) : null;
  }
  return m.isValidElement(t) ? t : null;
}, "getSlottableElementFromSlottable");
function Wm(e, t) {
  const n = { ...t };
  for (const r in t) {
    const o = e[r], i = t[r];
    /^on[A-Z]/.test(r) ? o && i ? n[r] = (...a) => {
      const c = i(...a);
      return o(...a), c;
    } : o && (n[r] = o) : r === "style" ? n[r] = { ...o, ...i } : r === "className" && (n[r] = [o, i].filter(Boolean).join(" "));
  }
  return { ...e, ...n };
}
It(Wm, "mergeProps");
function Km(e) {
  var r, o;
  let t = (r = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : r.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
It(Km, "getElementRef");
function qm(e) {
  return m.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === Hm;
}
It(qm, "isSlottable");
var QI = Symbol.for("react.lazy");
function ta(e) {
  return e != null && typeof e == "object" && "$$typeof" in e && e.$$typeof === QI && "_payload" in e && Gm(e._payload);
}
It(ta, "isLazyComponent");
function Gm(e) {
  return typeof e == "object" && e !== null && "then" in e;
}
It(Gm, "isPromiseLike");
var eT = /* @__PURE__ */ It((e) => `${e} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, "createSlotError"), tT = /* @__PURE__ */ It((e) => `${e} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, "createSlottableError"), Ao = m[" use ".trim().toString()], nT = Object.defineProperty, Ge = (e, t) => nT(e, "name", { value: t, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function Ym(e) {
  const t = e + "CollectionProvider", [n, r] = /* @__PURE__ */ no(t), [o, i] = n(
    t,
    { collectionRef: { current: null }, itemMap: /* @__PURE__ */ new Map() }
  ), s = /* @__PURE__ */ Ge((p) => {
    const { scope: b, children: y } = p, S = m.useRef(null), w = m.useRef(/* @__PURE__ */ new Map()).current;
    return /* @__PURE__ */ h(o, { scope: b, itemMap: w, collectionRef: S, children: y });
  }, "CollectionProvider");
  s.displayName = t;
  const a = e + "CollectionSlot", c = /* @__PURE__ */ nr(a), u = m.forwardRef(
    (p, b) => {
      const { scope: y, children: S } = p, w = i(a, y), _ = tn(b, w.collectionRef);
      return /* @__PURE__ */ h(c, { ref: _, children: S });
    }
  );
  u.displayName = a;
  const d = e + "CollectionItemSlot", l = "data-radix-collection-item", f = /* @__PURE__ */ nr(d), g = m.forwardRef(
    (p, b) => {
      const { scope: y, children: S, ...w } = p, _ = m.useRef(null), C = tn(b, _), R = i(d, y);
      return m.useEffect(() => (R.itemMap.set(_, { ref: _, ...w }), () => void R.itemMap.delete(_))), /* @__PURE__ */ h(f, { [l]: "", ref: C, children: S });
    }
  );
  g.displayName = d;
  function v(p) {
    const b = i(e + "CollectionConsumer", p);
    return m.useCallback(() => {
      const S = b.collectionRef.current;
      if (!S) return [];
      const w = Array.from(S.querySelectorAll(`[${l}]`));
      return Array.from(b.itemMap.values()).sort(
        (R, x) => w.indexOf(R.ref.current) - w.indexOf(x.ref.current)
      );
    }, [b.collectionRef, b.itemMap]);
  }
  return Ge(v, "useCollection"), [
    { Provider: s, Slot: u, ItemSlot: g },
    v,
    r
  ];
}
Ge(Ym, "createCollection");
var Xu = /* @__PURE__ */ new WeakMap(), je, ct, bs = (ct = class extends Map {
  constructor(n) {
    super(n);
    Jc(this, je);
    Li(this, je, [...super.keys()]), Xu.set(this, !0);
  }
  set(n, r) {
    return Xu.get(this) && (this.has(n) ? Ze(this, je)[Ze(this, je).indexOf(n)] = n : Ze(this, je).push(n)), super.set(n, r), this;
  }
  insert(n, r, o) {
    const i = this.has(r), s = Ze(this, je).length, a = Cc(n);
    let c = a >= 0 ? a : s + a;
    const u = c < 0 || c >= s ? -1 : c;
    if (u === this.size || i && u === this.size - 1 || u === -1)
      return this.set(r, o), this;
    const d = this.size + (i ? 0 : 1);
    a < 0 && c++;
    const l = [...Ze(this, je)];
    let f, g = !1;
    for (let v = c; v < d; v++)
      if (c === v) {
        let p = l[v];
        l[v] === r && (p = l[v + 1]), i && this.delete(r), f = this.get(p), this.set(r, o);
      } else {
        !g && l[v - 1] === r && (g = !0);
        const p = l[g ? v : v - 1], b = f;
        f = this.get(p), this.delete(p), this.set(p, b);
      }
    return this;
  }
  with(n, r, o) {
    const i = new ct(this);
    return i.insert(n, r, o), i;
  }
  before(n) {
    const r = Ze(this, je).indexOf(n) - 1;
    if (!(r < 0))
      return this.entryAt(r);
  }
  /**
   * Sets a new key-value pair at the position before the given key.
   */
  setBefore(n, r, o) {
    const i = Ze(this, je).indexOf(n);
    return i === -1 ? this : this.insert(i, r, o);
  }
  after(n) {
    let r = Ze(this, je).indexOf(n);
    if (r = r === -1 || r === this.size - 1 ? -1 : r + 1, r !== -1)
      return this.entryAt(r);
  }
  /**
   * Sets a new key-value pair at the position after the given key.
   */
  setAfter(n, r, o) {
    const i = Ze(this, je).indexOf(n);
    return i === -1 ? this : this.insert(i + 1, r, o);
  }
  first() {
    return this.entryAt(0);
  }
  last() {
    return this.entryAt(-1);
  }
  clear() {
    return Li(this, je, []), super.clear();
  }
  delete(n) {
    const r = super.delete(n);
    return r && Ze(this, je).splice(Ze(this, je).indexOf(n), 1), r;
  }
  deleteAt(n) {
    const r = this.keyAt(n);
    return r !== void 0 ? this.delete(r) : !1;
  }
  at(n) {
    const r = jo(Ze(this, je), n);
    if (r !== void 0)
      return this.get(r);
  }
  entryAt(n) {
    const r = jo(Ze(this, je), n);
    if (r !== void 0)
      return [r, this.get(r)];
  }
  indexOf(n) {
    return Ze(this, je).indexOf(n);
  }
  keyAt(n) {
    return jo(Ze(this, je), n);
  }
  from(n, r) {
    const o = this.indexOf(n);
    if (o === -1)
      return;
    let i = o + r;
    return i < 0 && (i = 0), i >= this.size && (i = this.size - 1), this.at(i);
  }
  keyFrom(n, r) {
    const o = this.indexOf(n);
    if (o === -1)
      return;
    let i = o + r;
    return i < 0 && (i = 0), i >= this.size && (i = this.size - 1), this.keyAt(i);
  }
  find(n, r) {
    let o = 0;
    for (const i of this) {
      if (Reflect.apply(n, r, [i, o, this]))
        return i;
      o++;
    }
  }
  findIndex(n, r) {
    let o = 0;
    for (const i of this) {
      if (Reflect.apply(n, r, [i, o, this]))
        return o;
      o++;
    }
    return -1;
  }
  filter(n, r) {
    const o = [];
    let i = 0;
    for (const s of this)
      Reflect.apply(n, r, [s, i, this]) && o.push(s), i++;
    return new ct(o);
  }
  map(n, r) {
    const o = [];
    let i = 0;
    for (const s of this)
      o.push([s[0], Reflect.apply(n, r, [s, i, this])]), i++;
    return new ct(o);
  }
  reduce(...n) {
    const [r, o] = n;
    let i = 0, s = o ?? this.at(0);
    for (const a of this)
      i === 0 && n.length === 1 ? s = a : s = Reflect.apply(r, this, [s, a, i, this]), i++;
    return s;
  }
  reduceRight(...n) {
    const [r, o] = n;
    let i = o ?? this.at(-1);
    for (let s = this.size - 1; s >= 0; s--) {
      const a = this.at(s);
      s === this.size - 1 && n.length === 1 ? i = a : i = Reflect.apply(r, this, [i, a, s, this]);
    }
    return i;
  }
  toSorted(n) {
    const r = [...this.entries()].sort(n);
    return new ct(r);
  }
  toReversed() {
    const n = new ct();
    for (let r = this.size - 1; r >= 0; r--) {
      const o = this.keyAt(r), i = this.get(o);
      n.set(o, i);
    }
    return n;
  }
  toSpliced(...n) {
    const r = [...this.entries()];
    return r.splice(...n), new ct(r);
  }
  slice(n, r) {
    const o = new ct();
    let i = this.size - 1;
    if (n === void 0)
      return o;
    n < 0 && (n = n + this.size), r !== void 0 && r > 0 && (i = r - 1);
    for (let s = n; s <= i; s++) {
      const a = this.keyAt(s), c = this.get(a);
      o.set(a, c);
    }
    return o;
  }
  every(n, r) {
    let o = 0;
    for (const i of this) {
      if (!Reflect.apply(n, r, [i, o, this]))
        return !1;
      o++;
    }
    return !0;
  }
  some(n, r) {
    let o = 0;
    for (const i of this) {
      if (Reflect.apply(n, r, [i, o, this]))
        return !0;
      o++;
    }
    return !1;
  }
}, je = new WeakMap(), Ge(ct, "OrderedDict"), ct);
function jo(e, t) {
  if ("at" in Array.prototype)
    return Array.prototype.at.call(e, t);
  const n = Xm(e, t);
  return n === -1 ? void 0 : e[n];
}
Ge(jo, "at");
function Xm(e, t) {
  const n = e.length, r = Cc(t), o = r >= 0 ? r : n + r;
  return o < 0 || o >= n ? -1 : o;
}
Ge(Xm, "toSafeIndex");
function Cc(e) {
  return e !== e || e === 0 ? 0 : Math.trunc(e);
}
Ge(Cc, "toSafeInteger");
// @__NO_SIDE_EFFECTS__
function rT(e) {
  const t = e + "CollectionProvider", [n, r] = /* @__PURE__ */ no(t), [o, i] = n(
    t,
    {
      collectionElement: null,
      collectionRef: { current: null },
      collectionRefObject: { current: null },
      itemMap: new bs(),
      setItemMap: /* @__PURE__ */ Ge(() => {
      }, "setItemMap")
    }
  ), s = /* @__PURE__ */ Ge(({ state: w, ..._ }) => w ? /* @__PURE__ */ h(c, { ..._, state: w }) : /* @__PURE__ */ h(a, { ..._ }), "CollectionProvider");
  s.displayName = t;
  const a = /* @__PURE__ */ Ge((w) => {
    const _ = b();
    return /* @__PURE__ */ h(c, { ...w, state: _ });
  }, "CollectionInit");
  a.displayName = t + "Init";
  const c = /* @__PURE__ */ Ge((w) => {
    const { scope: _, children: C, state: R } = w, x = m.useRef(null), [E, I] = m.useState(
      null
    ), M = tn(x, I), [N, $] = R;
    return m.useEffect(() => {
      if (!E) return;
      const T = Qm(() => {
      });
      return T.observe(E, {
        childList: !0,
        subtree: !0
      }), () => {
        T.disconnect();
      };
    }, [E]), /* @__PURE__ */ h(
      o,
      {
        scope: _,
        itemMap: N,
        setItemMap: $,
        collectionRef: M,
        collectionRefObject: x,
        collectionElement: E,
        children: C
      }
    );
  }, "CollectionProviderImpl");
  c.displayName = t + "Impl";
  const u = e + "CollectionSlot", d = /* @__PURE__ */ nr(u), l = m.forwardRef(
    (w, _) => {
      const { scope: C, children: R } = w, x = i(u, C), E = tn(_, x.collectionRef);
      return /* @__PURE__ */ h(d, { ref: E, children: R });
    }
  );
  l.displayName = u;
  const f = e + "CollectionItemSlot", g = "data-radix-collection-item", v = /* @__PURE__ */ nr(f), p = m.forwardRef(
    (w, _) => {
      const { scope: C, children: R, ...x } = w, E = m.useRef(null), [I, M] = m.useState(null), N = tn(_, E, M), $ = i(f, C), { setItemMap: T } = $, O = m.useRef(x);
      Zm(O.current, x) || (O.current = x);
      const F = O.current;
      return m.useEffect(() => {
        const A = F;
        return T((D) => I ? D.has(I) ? D.set(I, { ...A, element: I }).toSorted(na) : (D.set(I, { ...A, element: I }), D.toSorted(na)) : D), () => {
          T((D) => !I || !D.has(I) ? D : (D.delete(I), new bs(D)));
        };
      }, [I, F, T]), /* @__PURE__ */ h(v, { [g]: "", ref: N, children: R });
    }
  );
  p.displayName = f;
  function b() {
    return m.useState(new bs());
  }
  Ge(b, "useInitCollection");
  function y(w) {
    const { itemMap: _ } = i(e + "CollectionConsumer", w);
    return _;
  }
  return Ge(y, "useCollection"), [
    { Provider: s, Slot: l, ItemSlot: p },
    {
      createCollectionScope: r,
      useCollection: y,
      useInitCollection: b
    }
  ];
}
Ge(rT, "createCollection");
function Zm(e, t) {
  if (e === t) return !0;
  if (typeof e != "object" || typeof t != "object" || e == null || t == null) return !1;
  const n = Object.keys(e), r = Object.keys(t);
  if (n.length !== r.length) return !1;
  for (const o of n)
    if (!Object.prototype.hasOwnProperty.call(t, o) || e[o] !== t[o]) return !1;
  return !0;
}
Ge(Zm, "shallowEqual");
function Jm(e, t) {
  return !!(t.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_PRECEDING);
}
Ge(Jm, "isElementPreceding");
function na(e, t) {
  return !e[1].element || !t[1].element ? 0 : Jm(e[1].element, t[1].element) ? -1 : 1;
}
Ge(na, "sortByDocumentPosition");
function Qm(e) {
  return new MutationObserver((n) => {
    for (const r of n)
      if (r.type === "childList") {
        e();
        return;
      }
  });
}
Ge(Qm, "getChildListObserver");
var rr = globalThis != null && globalThis.document ? m.useLayoutEffect : () => {
}, oT = Object.defineProperty, iT = (e, t) => oT(e, "name", { value: t, configurable: !0 }), sT = m[" useId ".trim().toString()] || (() => {
}), aT = 0;
function xc(e) {
  const [t, n] = m.useState(sT());
  return rr(() => {
    e || n((r) => r ?? String(aT++));
  }, [e]), e || (t ? `radix-${t}` : "");
}
iT(xc, "useId");
var cT = Object.defineProperty, lT = (e, t) => cT(e, "name", { value: t, configurable: !0 }), uT = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
], mr = uT.reduce((e, t) => {
  const n = /* @__PURE__ */ nr(`Primitive.${t}`), r = m.forwardRef((o, i) => {
    const { asChild: s, ...a } = o, c = s ? n : t;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ h(c, { ...a, ref: i });
  });
  return r.displayName = `Primitive.${t}`, { ...e, [t]: r };
}, {});
function dT(e, t) {
  e && Rn.flushSync(() => e.dispatchEvent(t));
}
lT(dT, "dispatchDiscreteCustomEvent");
var fT = Object.defineProperty, hT = (e, t) => fT(e, "name", { value: t, configurable: !0 });
function eg(e) {
  const t = m.useRef(e);
  return m.useEffect(() => {
    t.current = e;
  }), m.useMemo(() => ((...n) => {
    var r;
    return (r = t.current) == null ? void 0 : r.call(t, ...n);
  }), []);
}
hT(eg, "useCallbackRef");
var pT = Object.defineProperty, mT = (e, t) => pT(e, "name", { value: t, configurable: !0 }), Zu = m[" useEffectEvent ".trim().toString()], Ju = m[" useInsertionEffect ".trim().toString()];
function tg(e) {
  if (typeof Zu == "function")
    return Zu(e);
  const t = m.useRef(() => {
    throw new Error("Cannot call an event handler while rendering.");
  });
  return typeof Ju == "function" ? Ju(() => {
    t.current = e;
  }) : rr(() => {
    t.current = e;
  }), m.useMemo(() => ((...n) => {
    var r;
    return (r = t.current) == null ? void 0 : r.call(t, ...n);
  }), []);
}
mT(tg, "useEffectEvent");
var gT = Object.defineProperty, ro = (e, t) => gT(e, "name", { value: t, configurable: !0 }), vT = m[" useInsertionEffect ".trim().toString()] || rr;
function Ec({
  prop: e,
  defaultProp: t,
  onChange: n = /* @__PURE__ */ ro(() => {
  }, "onChange"),
  caller: r
}) {
  const [o, i, s] = ng({
    defaultProp: t,
    onChange: n
  }), a = e !== void 0, c = a ? e : o, u = m.useCallback(
    (d) => {
      var l;
      if (a) {
        const f = rg(d) ? d(e) : d;
        f !== e && ((l = s.current) == null || l.call(s, f));
      } else
        i(d);
    },
    [a, e, i, s]
  );
  return [c, u];
}
ro(Ec, "useControllableState");
function ng({
  defaultProp: e,
  onChange: t
}) {
  const [n, r] = m.useState(e), o = m.useRef(n), i = m.useRef(t);
  return vT(() => {
    i.current = t;
  }, [t]), m.useEffect(() => {
    var s;
    o.current !== n && ((s = i.current) == null || s.call(i, n), o.current = n);
  }, [n, o]), [n, r, i];
}
ro(ng, "useUncontrolledState");
function rg(e) {
  return typeof e == "function";
}
ro(rg, "isFunction");
var Qu = Symbol("RADIX:SYNC_STATE");
function yT(e, t, n, r) {
  const { prop: o, defaultProp: i, onChange: s, caller: a } = t, c = o !== void 0, u = tg(s), d = [{ ...n, state: i }];
  r && d.push(r);
  const [l, f] = m.useReducer(
    (b, y) => {
      if (y.type === Qu)
        return { ...b, state: y.state };
      const S = e(b, y);
      return c && !Object.is(S.state, b.state) && u(S.state), S;
    },
    ...d
  ), g = l.state, v = m.useRef(g);
  m.useEffect(() => {
    v.current !== g && (v.current = g, c || u(g));
  }, [g, v, c]);
  const p = m.useMemo(() => o !== void 0 ? { ...l, state: o } : l, [l, o]);
  return m.useEffect(() => {
    c && !Object.is(o, l.state) && f({ type: Qu, state: o });
  }, [o, l.state, c]), [p, f];
}
ro(yT, "useControllableStateReducer");
var bT = Object.defineProperty, ST = (e, t) => bT(e, "name", { value: t, configurable: !0 }), wT = m.createContext(void 0);
function Rc(e) {
  const t = m.useContext(wT);
  return e || t || "ltr";
}
ST(Rc, "useDirection");
var _T = Object.defineProperty, Ic = (e, t) => _T(e, "name", { value: t, configurable: !0 }), Ss = !1;
function og() {
  const [e, t] = m.useState(Ss);
  return m.useEffect(() => {
    Ss || (Ss = !0, t(!0));
  }, []), e;
}
Ic(og, "useIsHydrated");
var ig = m[" useSyncExternalStore ".trim().toString()];
function sg() {
  return () => {
  };
}
Ic(sg, "subscribe");
function ag() {
  return ig(
    sg,
    () => !0,
    () => !1
  );
}
Ic(ag, "useIsHydratedModern");
var CT = typeof ig == "function" ? ag : og, xT = Object.defineProperty, An = (e, t) => xT(e, "name", { value: t, configurable: !0 }), ws = "rovingFocusGroup.onEntryFocus", ET = { bubbles: !1, cancelable: !0 }, xi = "RovingFocusGroup", [ra, cg, RT] = /* @__PURE__ */ Ym(xi), [IT, lg] = /* @__PURE__ */ no(
  xi,
  [RT]
), [TT, NT] = IT(xi), AT = /* @__PURE__ */ m.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ An(function(t, n) {
    return /* @__PURE__ */ h(ra.Provider, { scope: t.__scopeRovingFocusGroup, children: /* @__PURE__ */ h(ra.Slot, { scope: t.__scopeRovingFocusGroup, children: /* @__PURE__ */ h(OT, { ...t, ref: n }) }) });
  }, "RovingFocusGroup")
), OT = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ An(function(t, n) {
  const {
    __scopeRovingFocusGroup: r,
    orientation: o,
    loop: i = !1,
    dir: s,
    currentTabStopId: a,
    defaultCurrentTabStopId: c,
    onCurrentTabStopIdChange: u,
    onEntryFocus: d,
    preventScrollOnEntryFocus: l = !1,
    ...f
  } = t, g = m.useRef(null), v = tn(n, g), p = Rc(s), [b, y] = Ec({
    prop: a,
    defaultProp: c ?? null,
    onChange: u,
    caller: xi
  }), [S, w] = m.useState(!1), _ = eg(d), C = cg(r), R = m.useRef(!1), [x, E] = m.useState(0);
  return m.useEffect(() => {
    const I = g.current;
    if (I)
      return I.addEventListener(ws, _), () => I.removeEventListener(ws, _);
  }, [_]), /* @__PURE__ */ h(
    TT,
    {
      scope: r,
      orientation: o,
      dir: p,
      loop: i,
      currentTabStopId: b,
      onItemFocus: m.useCallback(
        (I) => y(I),
        [y]
      ),
      onItemShiftTab: m.useCallback(() => w(!0), []),
      onFocusableItemAdd: m.useCallback(
        () => E((I) => I + 1),
        []
      ),
      onFocusableItemRemove: m.useCallback(
        () => E((I) => I - 1),
        []
      ),
      children: /* @__PURE__ */ h(
        mr.div,
        {
          tabIndex: S || x === 0 ? -1 : 0,
          "data-orientation": o,
          ...f,
          ref: v,
          style: { outline: "none", ...t.style },
          onMouseDown: Dt(t.onMouseDown, () => {
            R.current = !0;
          }),
          onFocus: Dt(t.onFocus, (I) => {
            const M = !R.current;
            if (I.target === I.currentTarget && M && !S) {
              const N = new CustomEvent(ws, ET);
              if (I.currentTarget.dispatchEvent(N), !N.defaultPrevented) {
                const $ = C().filter((D) => D.focusable), T = $.find((D) => D.active), O = $.find((D) => D.id === b), A = [T, O, ...$].filter(
                  Boolean
                ).map((D) => D.ref.current);
                Tc(A, l);
              }
            }
            R.current = !1;
          }),
          onBlur: Dt(t.onBlur, () => w(!1))
        }
      )
    }
  );
}, "RovingFocusGroupImpl")), PT = "RovingFocusGroupItem", MT = /* @__PURE__ */ m.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ An(function(t, n) {
    const {
      __scopeRovingFocusGroup: r,
      focusable: o = !0,
      active: i = !1,
      tabStopId: s,
      children: a,
      ...c
    } = t, u = xc(), d = s || u, l = NT(PT, r), f = l.currentTabStopId === d, g = cg(r), { onFocusableItemAdd: v, onFocusableItemRemove: p, currentTabStopId: b } = l, y = CT();
    return rr(() => {
      if (!(!y || !o))
        return v(), () => p();
    }, [y, o, v, p]), m.useEffect(() => {
      if (!(y || !o))
        return v(), () => p();
    }, [y, o, v, p]), /* @__PURE__ */ h(
      ra.ItemSlot,
      {
        scope: r,
        id: d,
        focusable: o,
        active: i,
        children: /* @__PURE__ */ h(
          mr.span,
          {
            tabIndex: f ? 0 : -1,
            "data-orientation": l.orientation,
            ...c,
            ref: n,
            onMouseDown: Dt(t.onMouseDown, (S) => {
              o ? l.onItemFocus(d) : S.preventDefault();
            }),
            onFocus: Dt(t.onFocus, () => l.onItemFocus(d)),
            onKeyDown: Dt(t.onKeyDown, (S) => {
              if (S.key === "Tab" && S.shiftKey) {
                l.onItemShiftTab();
                return;
              }
              if (S.target !== S.currentTarget) return;
              const w = dg(S, l.orientation, l.dir);
              if (w !== void 0) {
                if (S.metaKey || S.ctrlKey || S.altKey || S.shiftKey) return;
                S.preventDefault();
                let C = g().filter((R) => R.focusable).map((R) => R.ref.current);
                if (w === "last") C.reverse();
                else if (w === "prev" || w === "next") {
                  w === "prev" && C.reverse();
                  const R = C.indexOf(S.currentTarget);
                  C = l.loop ? fg(C, R + 1) : C.slice(R + 1);
                }
                setTimeout(() => Tc(C));
              }
            }),
            children: typeof a == "function" ? a({ isCurrentTabStop: f, hasTabStop: b != null }) : a
          }
        )
      }
    );
  }, "RovingFocusGroupItem")
), kT = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function ug(e, t) {
  return t !== "rtl" ? e : e === "ArrowLeft" ? "ArrowRight" : e === "ArrowRight" ? "ArrowLeft" : e;
}
An(ug, "getDirectionAwareKey");
function dg(e, t, n) {
  const r = ug(e.key, n);
  if (!(t === "vertical" && ["ArrowLeft", "ArrowRight"].includes(r)) && !(t === "horizontal" && ["ArrowUp", "ArrowDown"].includes(r)))
    return kT[r];
}
An(dg, "getFocusIntent");
function Tc(e, t = !1) {
  const n = document.activeElement;
  for (const r of e)
    if (r === n || (r.focus({ preventScroll: t }), document.activeElement !== n)) return;
}
An(Tc, "focusFirst");
function fg(e, t) {
  return e.map((n, r) => e[(t + r) % e.length]);
}
An(fg, "wrapArray");
var DT = AT, $T = MT, LT = Object.defineProperty, Kt = (e, t) => LT(e, "name", { value: t, configurable: !0 });
function hg(e, t) {
  return m.useReducer((n, r) => t[n][r] ?? n, e);
}
Kt(hg, "useStateMachine");
var FT = /* @__PURE__ */ Kt((e) => {
  const { present: t, children: n } = e, r = pg(t), o = typeof n == "function" ? n({ present: r.isPresent }) : m.Children.only(n), i = mg(r.ref, gg(o));
  return typeof n == "function" || r.isPresent ? m.cloneElement(o, { ref: i }) : null;
}, "Presence");
function pg(e) {
  const [t, n] = m.useState(), r = m.useRef(null), o = m.useRef(e), i = m.useRef("none"), s = m.useRef(void 0), a = e ? "mounted" : "unmounted", [c, u] = hg(a, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  });
  return m.useEffect(() => {
    c === "mounted" ? (i.current = s.current ?? jn(r.current), s.current = void 0) : i.current = "none";
  }, [c]), rr(() => {
    const d = r.current, l = o.current;
    if (l !== e) {
      const g = i.current, v = jn(d);
      e ? (s.current = v, u("MOUNT")) : v === "none" || (d == null ? void 0 : d.display) === "none" ? u("UNMOUNT") : u(l && g !== v ? "ANIMATION_OUT" : "UNMOUNT"), o.current = e;
    }
  }, [e, u]), rr(() => {
    if (t) {
      let d;
      const l = t.ownerDocument.defaultView ?? window, f = /* @__PURE__ */ Kt((v) => {
        const b = jn(r.current).includes(CSS.escape(v.animationName));
        if (v.target === t && b && (u("ANIMATION_END"), !o.current)) {
          const y = t.style.animationFillMode;
          t.style.animationFillMode = "forwards", d = l.setTimeout(() => {
            t.style.animationFillMode === "forwards" && (t.style.animationFillMode = y);
          });
        }
      }, "handleAnimationEnd"), g = /* @__PURE__ */ Kt((v) => {
        v.target === t && (i.current = jn(r.current));
      }, "handleAnimationStart");
      return t.addEventListener("animationstart", g), t.addEventListener("animationcancel", f), t.addEventListener("animationend", f), () => {
        l.clearTimeout(d), t.removeEventListener("animationstart", g), t.removeEventListener("animationcancel", f), t.removeEventListener("animationend", f);
      };
    } else
      u("ANIMATION_END");
  }, [t, u]), {
    isPresent: ["mounted", "unmountSuspended"].includes(c),
    ref: m.useCallback((d) => {
      if (d) {
        const l = getComputedStyle(d);
        r.current = l, s.current = jn(l);
      } else
        r.current = null;
      n(d);
    }, [])
  };
}
Kt(pg, "usePresence");
function oa(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
Kt(oa, "setRef");
function mg(...e) {
  const t = m.useRef(e);
  return t.current = e, m.useCallback((n) => {
    const r = t.current;
    let o = !1;
    const i = r.map((s) => {
      const a = oa(s, n);
      return !o && typeof a == "function" && (o = !0), a;
    });
    if (o)
      return () => {
        for (let s = 0; s < i.length; s++) {
          const a = i[s];
          typeof a == "function" ? a() : oa(r[s], null);
        }
      };
  }, []);
}
Kt(mg, "useStableComposedRefs");
function jn(e) {
  return (e == null ? void 0 : e.animationName) || "none";
}
Kt(jn, "getAnimationName");
function gg(e) {
  var r, o;
  let t = (r = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : r.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
Kt(gg, "getElementRef");
var VT = Object.defineProperty, gr = (e, t) => VT(e, "name", { value: t, configurable: !0 }), Nc = "Tabs", [BT, F$] = /* @__PURE__ */ no(Nc, [
  lg
]), vg = lg(), [zT, Ac] = BT(Nc), jT = /* @__PURE__ */ m.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ gr(function(t, n) {
    const {
      __scopeTabs: r,
      value: o,
      onValueChange: i,
      defaultValue: s,
      orientation: a = "horizontal",
      dir: c,
      activationMode: u = "automatic",
      ...d
    } = t, l = Rc(c), [f, g] = Ec({
      prop: o,
      onChange: i,
      defaultProp: s ?? "",
      caller: Nc
    });
    return /* @__PURE__ */ h(
      zT,
      {
        scope: r,
        baseId: xc(),
        value: f,
        onValueChange: g,
        orientation: a,
        dir: l,
        activationMode: u,
        children: /* @__PURE__ */ h(
          mr.div,
          {
            dir: l,
            "data-orientation": a,
            ...d,
            ref: n
          }
        )
      }
    );
  }, "Tabs")
), UT = "TabsList", HT = /* @__PURE__ */ m.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ gr(function(t, n) {
    const { __scopeTabs: r, loop: o = !0, ...i } = t, s = Ac(UT, r), a = vg(r);
    return /* @__PURE__ */ h(
      DT,
      {
        asChild: !0,
        ...a,
        orientation: s.orientation,
        dir: s.dir,
        loop: o,
        children: /* @__PURE__ */ h(
          mr.div,
          {
            role: "tablist",
            "aria-orientation": s.orientation,
            ...i,
            ref: n
          }
        )
      }
    );
  }, "TabsList")
), WT = "TabsTrigger", KT = /* @__PURE__ */ m.forwardRef(
  /* @__PURE__ */ gr(function(t, n) {
    const { __scopeTabs: r, value: o, disabled: i = !1, ...s } = t, a = Ac(WT, r), c = vg(r), u = Oc(a.baseId, o), d = Pc(a.baseId, o), l = o === a.value;
    return /* @__PURE__ */ h(
      $T,
      {
        asChild: !0,
        ...c,
        focusable: !i,
        active: l,
        children: /* @__PURE__ */ h(
          mr.button,
          {
            type: "button",
            role: "tab",
            "aria-selected": l,
            "aria-controls": d,
            "data-state": l ? "active" : "inactive",
            "data-disabled": i ? "" : void 0,
            disabled: i,
            id: u,
            ...s,
            ref: n,
            onMouseDown: Dt(t.onMouseDown, (f) => {
              !i && f.button === 0 && f.ctrlKey === !1 ? a.onValueChange(o) : f.preventDefault();
            }),
            onKeyDown: Dt(t.onKeyDown, (f) => {
              i || f.target !== f.currentTarget || [" ", "Enter"].includes(f.key) && a.onValueChange(o);
            }),
            onFocus: Dt(t.onFocus, () => {
              const f = a.activationMode !== "manual";
              !l && !i && f && a.onValueChange(o);
            })
          }
        )
      }
    );
  }, "TabsTrigger")
), qT = "TabsContent", GT = /* @__PURE__ */ m.forwardRef(
  /* @__PURE__ */ gr(function(t, n) {
    const { __scopeTabs: r, value: o, forceMount: i, children: s, ...a } = t, c = Ac(qT, r), u = Oc(c.baseId, o), d = Pc(c.baseId, o), l = o === c.value, f = m.useRef(l);
    return m.useEffect(() => {
      const g = requestAnimationFrame(() => f.current = !1);
      return () => cancelAnimationFrame(g);
    }, []), /* @__PURE__ */ h(FT, { present: i || l, children: ({ present: g }) => /* @__PURE__ */ h(
      mr.div,
      {
        "data-state": l ? "active" : "inactive",
        "data-orientation": c.orientation,
        role: "tabpanel",
        "aria-labelledby": u,
        hidden: !g,
        id: d,
        tabIndex: 0,
        ...a,
        ref: n,
        style: {
          ...t.style,
          animationDuration: f.current ? "0s" : void 0
        },
        children: g && s
      }
    ) });
  }, "TabsContent")
);
function Oc(e, t) {
  return `${e}-trigger-${t}`;
}
gr(Oc, "makeTriggerId");
function Pc(e, t) {
  return `${e}-content-${t}`;
}
gr(Pc, "makeContentId");
var ia = jT, sa = HT, aa = KT, ca = GT, YT = "_1b2maak0", XT = "_1b2maak1", ZT = "_1b2maak2 _14sdsl37 _14sdsl36", JT = St({ defaultClassName: "_1b2maak3", variantClassNames: {}, defaultVariants: {}, compoundVariants: [] }), QT = "_1b2maak4 _14sdsl37 _14sdsl36", ed = "_1b2maak5", eN = "_1b2maak6", tN = "_1b2maak7", nN = "_1b2maak8", rN = "_1b2maak9", oN = "_1b2maaka", td = "_1b2maakb";
function iN(e, t = []) {
  let n = [];
  function r(i, s) {
    const a = m.createContext(s);
    a.displayName = i + "Context";
    const c = n.length;
    n = [...n, s];
    const u = (l) => {
      var y;
      const { scope: f, children: g, ...v } = l, p = ((y = f == null ? void 0 : f[e]) == null ? void 0 : y[c]) || a, b = m.useMemo(() => v, Object.values(v));
      return /* @__PURE__ */ h(p.Provider, { value: b, children: g });
    };
    u.displayName = i + "Provider";
    function d(l, f) {
      var p;
      const g = ((p = f == null ? void 0 : f[e]) == null ? void 0 : p[c]) || a, v = m.useContext(g);
      if (v) return v;
      if (s !== void 0) return s;
      throw new Error(`\`${l}\` must be used within \`${i}\``);
    }
    return [u, d];
  }
  const o = () => {
    const i = n.map((s) => m.createContext(s));
    return function(a) {
      const c = (a == null ? void 0 : a[e]) || i;
      return m.useMemo(
        () => ({ [`__scope${e}`]: { ...a, [e]: c } }),
        [a, c]
      );
    };
  };
  return o.scopeName = e, [r, sN(o, ...t)];
}
function sN(...e) {
  const t = e[0];
  if (e.length === 1) return t;
  const n = () => {
    const r = e.map((o) => ({
      useScope: o(),
      scopeName: o.scopeName
    }));
    return function(i) {
      const s = r.reduce((a, { useScope: c, scopeName: u }) => {
        const l = c(i)[`__scope${u}`];
        return { ...a, ...l };
      }, {});
      return m.useMemo(() => ({ [`__scope${t.scopeName}`]: s }), [s]);
    };
  };
  return n.scopeName = t.scopeName, n;
}
function nd(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
function aN(...e) {
  return (t) => {
    let n = !1;
    const r = e.map((o) => {
      const i = nd(o, t);
      return !n && typeof i == "function" && (n = !0), i;
    });
    if (n)
      return () => {
        for (let o = 0; o < r.length; o++) {
          const i = r[o];
          typeof i == "function" ? i() : nd(e[o], null);
        }
      };
  };
}
function cN(...e) {
  return m.useCallback(aN(...e), e);
}
// @__NO_SIDE_EFFECTS__
function lN(e) {
  const t = m.forwardRef((n, r) => {
    let { children: o, ...i } = n, s = null, a = !1;
    const c = [];
    rd(o) && typeof Oo == "function" && (o = Oo(o._payload)), m.Children.forEach(o, (f) => {
      var g;
      if (pN(f)) {
        a = !0;
        const v = f;
        let p = "child" in v.props ? v.props.child : v.props.children;
        rd(p) && typeof Oo == "function" && (p = Oo(p._payload)), s = dN(v, p), c.push((g = s == null ? void 0 : s.props) == null ? void 0 : g.children);
      } else
        c.push(f);
    }), s ? s = m.cloneElement(s, void 0, c) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !a && m.Children.count(o) === 1 && m.isValidElement(o) && (s = o)
    );
    const u = s ? hN(s) : void 0, d = cN(r, u);
    if (!s) {
      if (o || o === 0)
        throw new Error(
          a ? yN(e) : vN(e)
        );
      return o;
    }
    const l = fN(i, s.props ?? {});
    return s.type !== m.Fragment && (l.ref = r ? d : u), m.cloneElement(s, l);
  });
  return t.displayName = `${e}.Slot`, t;
}
var uN = Symbol.for("radix.slottable"), dN = (e, t) => {
  if ("child" in e.props) {
    const n = e.props.child;
    return m.isValidElement(n) ? m.cloneElement(n, void 0, e.props.children(n.props.children)) : null;
  }
  return m.isValidElement(t) ? t : null;
};
function fN(e, t) {
  const n = { ...t };
  for (const r in t) {
    const o = e[r], i = t[r];
    /^on[A-Z]/.test(r) ? o && i ? n[r] = (...a) => {
      const c = i(...a);
      return o(...a), c;
    } : o && (n[r] = o) : r === "style" ? n[r] = { ...o, ...i } : r === "className" && (n[r] = [o, i].filter(Boolean).join(" "));
  }
  return { ...e, ...n };
}
function hN(e) {
  var r, o;
  let t = (r = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : r.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
function pN(e) {
  return m.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === uN;
}
var mN = Symbol.for("react.lazy");
function rd(e) {
  return e != null && typeof e == "object" && "$$typeof" in e && e.$$typeof === mN && "_payload" in e && gN(e._payload);
}
function gN(e) {
  return typeof e == "object" && e !== null && "then" in e;
}
var vN = (e) => `${e} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, yN = (e) => `${e} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, Oo = m[" use ".trim().toString()], bN = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
], yg = bN.reduce((e, t) => {
  const n = /* @__PURE__ */ lN(`Primitive.${t}`), r = m.forwardRef((o, i) => {
    const { asChild: s, ...a } = o, c = s ? n : t;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ h(c, { ...a, ref: i });
  });
  return r.displayName = `Primitive.${t}`, { ...e, [t]: r };
}, {}), Mc = "Progress", kc = 100, [SN] = iN(Mc), [wN, _N] = SN(Mc), bg = m.forwardRef(
  (e, t) => {
    const {
      __scopeProgress: n,
      value: r = null,
      max: o,
      getValueLabel: i = CN,
      ...s
    } = e;
    (o || o === 0) && !od(o) && console.error(xN(`${o}`, "Progress"));
    const a = od(o) ? o : kc;
    r !== null && !id(r, a) && console.error(EN(`${r}`, "Progress"));
    const c = id(r, a) ? r : null, u = ni(c) ? i(c, a) : void 0;
    return /* @__PURE__ */ h(wN, { scope: n, value: c, max: a, children: /* @__PURE__ */ h(
      yg.div,
      {
        "aria-valuemax": a,
        "aria-valuemin": 0,
        "aria-valuenow": ni(c) ? c : void 0,
        "aria-valuetext": u,
        role: "progressbar",
        "data-state": _g(c, a),
        "data-value": c ?? void 0,
        "data-max": a,
        ...s,
        ref: t
      }
    ) });
  }
);
bg.displayName = Mc;
var Sg = "ProgressIndicator", wg = m.forwardRef(
  (e, t) => {
    const { __scopeProgress: n, ...r } = e, o = _N(Sg, n);
    return /* @__PURE__ */ h(
      yg.div,
      {
        "data-state": _g(o.value, o.max),
        "data-value": o.value ?? void 0,
        "data-max": o.max,
        ...r,
        ref: t
      }
    );
  }
);
wg.displayName = Sg;
function CN(e, t) {
  return `${Math.round(e / t * 100)}%`;
}
function _g(e, t) {
  return e == null ? "indeterminate" : e === t ? "complete" : "loading";
}
function ni(e) {
  return typeof e == "number";
}
function od(e) {
  return ni(e) && !isNaN(e) && e > 0;
}
function id(e, t) {
  return ni(e) && !isNaN(e) && e <= t && e >= 0;
}
function xN(e, t) {
  return `Invalid prop \`max\` of value \`${e}\` supplied to \`${t}\`. Only numbers greater than 0 are valid max values. Defaulting to \`${kc}\`.`;
}
function EN(e, t) {
  return `Invalid prop \`value\` of value \`${e}\` supplied to \`${t}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${kc} if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`;
}
var RN = bg, IN = wg;
function sd(e, [t, n]) {
  return Math.min(n, Math.max(t, e));
}
function He(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
  return function(o) {
    if (e == null || e(o), n === !1 || !o.defaultPrevented)
      return t == null ? void 0 : t(o);
  };
}
function Dc(e, t = []) {
  let n = [];
  function r(i, s) {
    const a = m.createContext(s), c = n.length;
    n = [...n, s];
    const u = (l) => {
      var y;
      const { scope: f, children: g, ...v } = l, p = ((y = f == null ? void 0 : f[e]) == null ? void 0 : y[c]) || a, b = m.useMemo(() => v, Object.values(v));
      return /* @__PURE__ */ h(p.Provider, { value: b, children: g });
    };
    u.displayName = i + "Provider";
    function d(l, f) {
      var p;
      const g = ((p = f == null ? void 0 : f[e]) == null ? void 0 : p[c]) || a, v = m.useContext(g);
      if (v) return v;
      if (s !== void 0) return s;
      throw new Error(`\`${l}\` must be used within \`${i}\``);
    }
    return [u, d];
  }
  const o = () => {
    const i = n.map((s) => m.createContext(s));
    return function(a) {
      const c = (a == null ? void 0 : a[e]) || i;
      return m.useMemo(
        () => ({ [`__scope${e}`]: { ...a, [e]: c } }),
        [a, c]
      );
    };
  };
  return o.scopeName = e, [r, TN(o, ...t)];
}
function TN(...e) {
  const t = e[0];
  if (e.length === 1) return t;
  const n = () => {
    const r = e.map((o) => ({
      useScope: o(),
      scopeName: o.scopeName
    }));
    return function(i) {
      const s = r.reduce((a, { useScope: c, scopeName: u }) => {
        const l = c(i)[`__scope${u}`];
        return { ...a, ...l };
      }, {});
      return m.useMemo(() => ({ [`__scope${t.scopeName}`]: s }), [s]);
    };
  };
  return n.scopeName = t.scopeName, n;
}
function ad(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
function Cg(...e) {
  return (t) => {
    let n = !1;
    const r = e.map((o) => {
      const i = ad(o, t);
      return !n && typeof i == "function" && (n = !0), i;
    });
    if (n)
      return () => {
        for (let o = 0; o < r.length; o++) {
          const i = r[o];
          typeof i == "function" ? i() : ad(e[o], null);
        }
      };
  };
}
function Xe(...e) {
  return m.useCallback(Cg(...e), e);
}
var Fr = m.forwardRef((e, t) => {
  const { children: n, ...r } = e, o = m.Children.toArray(n), i = o.find(AN);
  if (i) {
    const s = i.props.children, a = o.map((c) => c === i ? m.Children.count(s) > 1 ? m.Children.only(null) : m.isValidElement(s) ? s.props.children : null : c);
    return /* @__PURE__ */ h(la, { ...r, ref: t, children: m.isValidElement(s) ? m.cloneElement(s, void 0, a) : null });
  }
  return /* @__PURE__ */ h(la, { ...r, ref: t, children: n });
});
Fr.displayName = "Slot";
var la = m.forwardRef((e, t) => {
  const { children: n, ...r } = e;
  if (m.isValidElement(n)) {
    const o = PN(n), i = ON(r, n.props);
    return n.type !== m.Fragment && (i.ref = t ? Cg(t, o) : o), m.cloneElement(n, i);
  }
  return m.Children.count(n) > 1 ? m.Children.only(null) : null;
});
la.displayName = "SlotClone";
var NN = ({ children: e }) => /* @__PURE__ */ h(pe, { children: e });
function AN(e) {
  return m.isValidElement(e) && e.type === NN;
}
function ON(e, t) {
  const n = { ...t };
  for (const r in t) {
    const o = e[r], i = t[r];
    /^on[A-Z]/.test(r) ? o && i ? n[r] = (...a) => {
      i(...a), o(...a);
    } : o && (n[r] = o) : r === "style" ? n[r] = { ...o, ...i } : r === "className" && (n[r] = [o, i].filter(Boolean).join(" "));
  }
  return { ...e, ...n };
}
function PN(e) {
  var r, o;
  let t = (r = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : r.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
function MN(e) {
  const t = e + "CollectionProvider", [n, r] = Dc(t), [o, i] = n(
    t,
    { collectionRef: { current: null }, itemMap: /* @__PURE__ */ new Map() }
  ), s = (g) => {
    const { scope: v, children: p } = g, b = k.useRef(null), y = k.useRef(/* @__PURE__ */ new Map()).current;
    return /* @__PURE__ */ h(o, { scope: v, itemMap: y, collectionRef: b, children: p });
  };
  s.displayName = t;
  const a = e + "CollectionSlot", c = k.forwardRef(
    (g, v) => {
      const { scope: p, children: b } = g, y = i(a, p), S = Xe(v, y.collectionRef);
      return /* @__PURE__ */ h(Fr, { ref: S, children: b });
    }
  );
  c.displayName = a;
  const u = e + "CollectionItemSlot", d = "data-radix-collection-item", l = k.forwardRef(
    (g, v) => {
      const { scope: p, children: b, ...y } = g, S = k.useRef(null), w = Xe(v, S), _ = i(u, p);
      return k.useEffect(() => (_.itemMap.set(S, { ref: S, ...y }), () => void _.itemMap.delete(S))), /* @__PURE__ */ h(Fr, { [d]: "", ref: w, children: b });
    }
  );
  l.displayName = u;
  function f(g) {
    const v = i(e + "CollectionConsumer", g);
    return k.useCallback(() => {
      const b = v.collectionRef.current;
      if (!b) return [];
      const y = Array.from(b.querySelectorAll(`[${d}]`));
      return Array.from(v.itemMap.values()).sort(
        (_, C) => y.indexOf(_.ref.current) - y.indexOf(C.ref.current)
      );
    }, [v.collectionRef, v.itemMap]);
  }
  return [
    { Provider: s, Slot: c, ItemSlot: l },
    f,
    r
  ];
}
var kN = m.createContext(void 0);
function DN(e) {
  const t = m.useContext(kN);
  return e || t || "ltr";
}
var $N = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "span",
  "svg",
  "ul"
], We = $N.reduce((e, t) => {
  const n = m.forwardRef((r, o) => {
    const { asChild: i, ...s } = r, a = i ? Fr : t;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ h(a, { ...s, ref: o });
  });
  return n.displayName = `Primitive.${t}`, { ...e, [t]: n };
}, {});
function LN(e, t) {
  e && Rn.flushSync(() => e.dispatchEvent(t));
}
function qt(e) {
  const t = m.useRef(e);
  return m.useEffect(() => {
    t.current = e;
  }), m.useMemo(() => (...n) => {
    var r;
    return (r = t.current) == null ? void 0 : r.call(t, ...n);
  }, []);
}
function FN(e, t = globalThis == null ? void 0 : globalThis.document) {
  const n = qt(e);
  m.useEffect(() => {
    const r = (o) => {
      o.key === "Escape" && n(o);
    };
    return t.addEventListener("keydown", r, { capture: !0 }), () => t.removeEventListener("keydown", r, { capture: !0 });
  }, [n, t]);
}
var VN = "DismissableLayer", ua = "dismissableLayer.update", BN = "dismissableLayer.pointerDownOutside", zN = "dismissableLayer.focusOutside", cd, xg = m.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set()
}), Eg = m.forwardRef(
  (e, t) => {
    const {
      disableOutsidePointerEvents: n = !1,
      onEscapeKeyDown: r,
      onPointerDownOutside: o,
      onFocusOutside: i,
      onInteractOutside: s,
      onDismiss: a,
      ...c
    } = e, u = m.useContext(xg), [d, l] = m.useState(null), f = (d == null ? void 0 : d.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document), [, g] = m.useState({}), v = Xe(t, (x) => l(x)), p = Array.from(u.layers), [b] = [...u.layersWithOutsidePointerEventsDisabled].slice(-1), y = p.indexOf(b), S = d ? p.indexOf(d) : -1, w = u.layersWithOutsidePointerEventsDisabled.size > 0, _ = S >= y, C = HN((x) => {
      const E = x.target, I = [...u.branches].some((M) => M.contains(E));
      !_ || I || (o == null || o(x), s == null || s(x), x.defaultPrevented || a == null || a());
    }, f), R = WN((x) => {
      const E = x.target;
      [...u.branches].some((M) => M.contains(E)) || (i == null || i(x), s == null || s(x), x.defaultPrevented || a == null || a());
    }, f);
    return FN((x) => {
      S === u.layers.size - 1 && (r == null || r(x), !x.defaultPrevented && a && (x.preventDefault(), a()));
    }, f), m.useEffect(() => {
      if (d)
        return n && (u.layersWithOutsidePointerEventsDisabled.size === 0 && (cd = f.body.style.pointerEvents, f.body.style.pointerEvents = "none"), u.layersWithOutsidePointerEventsDisabled.add(d)), u.layers.add(d), ld(), () => {
          n && u.layersWithOutsidePointerEventsDisabled.size === 1 && (f.body.style.pointerEvents = cd);
        };
    }, [d, f, n, u]), m.useEffect(() => () => {
      d && (u.layers.delete(d), u.layersWithOutsidePointerEventsDisabled.delete(d), ld());
    }, [d, u]), m.useEffect(() => {
      const x = () => g({});
      return document.addEventListener(ua, x), () => document.removeEventListener(ua, x);
    }, []), /* @__PURE__ */ h(
      We.div,
      {
        ...c,
        ref: v,
        style: {
          pointerEvents: w ? _ ? "auto" : "none" : void 0,
          ...e.style
        },
        onFocusCapture: He(e.onFocusCapture, R.onFocusCapture),
        onBlurCapture: He(e.onBlurCapture, R.onBlurCapture),
        onPointerDownCapture: He(
          e.onPointerDownCapture,
          C.onPointerDownCapture
        )
      }
    );
  }
);
Eg.displayName = VN;
var jN = "DismissableLayerBranch", UN = m.forwardRef((e, t) => {
  const n = m.useContext(xg), r = m.useRef(null), o = Xe(t, r);
  return m.useEffect(() => {
    const i = r.current;
    if (i)
      return n.branches.add(i), () => {
        n.branches.delete(i);
      };
  }, [n.branches]), /* @__PURE__ */ h(We.div, { ...e, ref: o });
});
UN.displayName = jN;
function HN(e, t = globalThis == null ? void 0 : globalThis.document) {
  const n = qt(e), r = m.useRef(!1), o = m.useRef(() => {
  });
  return m.useEffect(() => {
    const i = (a) => {
      if (a.target && !r.current) {
        let c = function() {
          Rg(
            BN,
            n,
            u,
            { discrete: !0 }
          );
        };
        const u = { originalEvent: a };
        a.pointerType === "touch" ? (t.removeEventListener("click", o.current), o.current = c, t.addEventListener("click", o.current, { once: !0 })) : c();
      } else
        t.removeEventListener("click", o.current);
      r.current = !1;
    }, s = window.setTimeout(() => {
      t.addEventListener("pointerdown", i);
    }, 0);
    return () => {
      window.clearTimeout(s), t.removeEventListener("pointerdown", i), t.removeEventListener("click", o.current);
    };
  }, [t, n]), {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: () => r.current = !0
  };
}
function WN(e, t = globalThis == null ? void 0 : globalThis.document) {
  const n = qt(e), r = m.useRef(!1);
  return m.useEffect(() => {
    const o = (i) => {
      i.target && !r.current && Rg(zN, n, { originalEvent: i }, {
        discrete: !1
      });
    };
    return t.addEventListener("focusin", o), () => t.removeEventListener("focusin", o);
  }, [t, n]), {
    onFocusCapture: () => r.current = !0,
    onBlurCapture: () => r.current = !1
  };
}
function ld() {
  const e = new CustomEvent(ua);
  document.dispatchEvent(e);
}
function Rg(e, t, n, { discrete: r }) {
  const o = n.originalEvent.target, i = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: n });
  t && o.addEventListener(e, t, { once: !0 }), r ? LN(o, i) : o.dispatchEvent(i);
}
var _s = 0;
function KN() {
  m.useEffect(() => {
    const e = document.querySelectorAll("[data-radix-focus-guard]");
    return document.body.insertAdjacentElement("afterbegin", e[0] ?? ud()), document.body.insertAdjacentElement("beforeend", e[1] ?? ud()), _s++, () => {
      _s === 1 && document.querySelectorAll("[data-radix-focus-guard]").forEach((t) => t.remove()), _s--;
    };
  }, []);
}
function ud() {
  const e = document.createElement("span");
  return e.setAttribute("data-radix-focus-guard", ""), e.tabIndex = 0, e.style.outline = "none", e.style.opacity = "0", e.style.position = "fixed", e.style.pointerEvents = "none", e;
}
var Cs = "focusScope.autoFocusOnMount", xs = "focusScope.autoFocusOnUnmount", dd = { bubbles: !1, cancelable: !0 }, qN = "FocusScope", Ig = m.forwardRef((e, t) => {
  const {
    loop: n = !1,
    trapped: r = !1,
    onMountAutoFocus: o,
    onUnmountAutoFocus: i,
    ...s
  } = e, [a, c] = m.useState(null), u = qt(o), d = qt(i), l = m.useRef(null), f = Xe(t, (p) => c(p)), g = m.useRef({
    paused: !1,
    pause() {
      this.paused = !0;
    },
    resume() {
      this.paused = !1;
    }
  }).current;
  m.useEffect(() => {
    if (r) {
      let p = function(w) {
        if (g.paused || !a) return;
        const _ = w.target;
        a.contains(_) ? l.current = _ : Qt(l.current, { select: !0 });
      }, b = function(w) {
        if (g.paused || !a) return;
        const _ = w.relatedTarget;
        _ !== null && (a.contains(_) || Qt(l.current, { select: !0 }));
      }, y = function(w) {
        if (document.activeElement === document.body)
          for (const C of w)
            C.removedNodes.length > 0 && Qt(a);
      };
      document.addEventListener("focusin", p), document.addEventListener("focusout", b);
      const S = new MutationObserver(y);
      return a && S.observe(a, { childList: !0, subtree: !0 }), () => {
        document.removeEventListener("focusin", p), document.removeEventListener("focusout", b), S.disconnect();
      };
    }
  }, [r, a, g.paused]), m.useEffect(() => {
    if (a) {
      hd.add(g);
      const p = document.activeElement;
      if (!a.contains(p)) {
        const y = new CustomEvent(Cs, dd);
        a.addEventListener(Cs, u), a.dispatchEvent(y), y.defaultPrevented || (GN(QN(Tg(a)), { select: !0 }), document.activeElement === p && Qt(a));
      }
      return () => {
        a.removeEventListener(Cs, u), setTimeout(() => {
          const y = new CustomEvent(xs, dd);
          a.addEventListener(xs, d), a.dispatchEvent(y), y.defaultPrevented || Qt(p ?? document.body, { select: !0 }), a.removeEventListener(xs, d), hd.remove(g);
        }, 0);
      };
    }
  }, [a, u, d, g]);
  const v = m.useCallback(
    (p) => {
      if (!n && !r || g.paused) return;
      const b = p.key === "Tab" && !p.altKey && !p.ctrlKey && !p.metaKey, y = document.activeElement;
      if (b && y) {
        const S = p.currentTarget, [w, _] = YN(S);
        w && _ ? !p.shiftKey && y === _ ? (p.preventDefault(), n && Qt(w, { select: !0 })) : p.shiftKey && y === w && (p.preventDefault(), n && Qt(_, { select: !0 })) : y === S && p.preventDefault();
      }
    },
    [n, r, g.paused]
  );
  return /* @__PURE__ */ h(We.div, { tabIndex: -1, ...s, ref: f, onKeyDown: v });
});
Ig.displayName = qN;
function GN(e, { select: t = !1 } = {}) {
  const n = document.activeElement;
  for (const r of e)
    if (Qt(r, { select: t }), document.activeElement !== n) return;
}
function YN(e) {
  const t = Tg(e), n = fd(t, e), r = fd(t.reverse(), e);
  return [n, r];
}
function Tg(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (r) => {
      const o = r.tagName === "INPUT" && r.type === "hidden";
      return r.disabled || r.hidden || o ? NodeFilter.FILTER_SKIP : r.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  for (; n.nextNode(); ) t.push(n.currentNode);
  return t;
}
function fd(e, t) {
  for (const n of e)
    if (!XN(n, { upTo: t })) return n;
}
function XN(e, { upTo: t }) {
  if (getComputedStyle(e).visibility === "hidden") return !0;
  for (; e; ) {
    if (t !== void 0 && e === t) return !1;
    if (getComputedStyle(e).display === "none") return !0;
    e = e.parentElement;
  }
  return !1;
}
function ZN(e) {
  return e instanceof HTMLInputElement && "select" in e;
}
function Qt(e, { select: t = !1 } = {}) {
  if (e && e.focus) {
    const n = document.activeElement;
    e.focus({ preventScroll: !0 }), e !== n && ZN(e) && t && e.select();
  }
}
var hd = JN();
function JN() {
  let e = [];
  return {
    add(t) {
      const n = e[0];
      t !== n && (n == null || n.pause()), e = pd(e, t), e.unshift(t);
    },
    remove(t) {
      var n;
      e = pd(e, t), (n = e[0]) == null || n.resume();
    }
  };
}
function pd(e, t) {
  const n = [...e], r = n.indexOf(t);
  return r !== -1 && n.splice(r, 1), n;
}
function QN(e) {
  return e.filter((t) => t.tagName !== "A");
}
var ft = globalThis != null && globalThis.document ? m.useLayoutEffect : () => {
}, eA = m.useId || (() => {
}), tA = 0;
function $c(e) {
  const [t, n] = m.useState(eA());
  return ft(() => {
    n((r) => r ?? String(tA++));
  }, [e]), e || (t ? `radix-${t}` : "");
}
var nA = "Arrow", Ng = m.forwardRef((e, t) => {
  const { children: n, width: r = 10, height: o = 5, ...i } = e;
  return /* @__PURE__ */ h(
    We.svg,
    {
      ...i,
      ref: t,
      width: r,
      height: o,
      viewBox: "0 0 30 10",
      preserveAspectRatio: "none",
      children: e.asChild ? n : /* @__PURE__ */ h("polygon", { points: "0,0 30,0 15,10" })
    }
  );
});
Ng.displayName = nA;
var rA = Ng;
function oA(e) {
  const [t, n] = m.useState(void 0);
  return ft(() => {
    if (e) {
      n({ width: e.offsetWidth, height: e.offsetHeight });
      const r = new ResizeObserver((o) => {
        if (!Array.isArray(o) || !o.length)
          return;
        const i = o[0];
        let s, a;
        if ("borderBoxSize" in i) {
          const c = i.borderBoxSize, u = Array.isArray(c) ? c[0] : c;
          s = u.inlineSize, a = u.blockSize;
        } else
          s = e.offsetWidth, a = e.offsetHeight;
        n({ width: s, height: a });
      });
      return r.observe(e, { box: "border-box" }), () => r.unobserve(e);
    } else
      n(void 0);
  }, [e]), t;
}
var Lc = "Popper", [Ag, Og] = Dc(Lc), [iA, Pg] = Ag(Lc), Mg = (e) => {
  const { __scopePopper: t, children: n } = e, [r, o] = m.useState(null);
  return /* @__PURE__ */ h(iA, { scope: t, anchor: r, onAnchorChange: o, children: n });
};
Mg.displayName = Lc;
var kg = "PopperAnchor", Dg = m.forwardRef(
  (e, t) => {
    const { __scopePopper: n, virtualRef: r, ...o } = e, i = Pg(kg, n), s = m.useRef(null), a = Xe(t, s);
    return m.useEffect(() => {
      i.onAnchorChange((r == null ? void 0 : r.current) || s.current);
    }), r ? null : /* @__PURE__ */ h(We.div, { ...o, ref: a });
  }
);
Dg.displayName = kg;
var Fc = "PopperContent", [sA, aA] = Ag(Fc), $g = m.forwardRef(
  (e, t) => {
    var U, H, Q, ee, ie, W;
    const {
      __scopePopper: n,
      side: r = "bottom",
      sideOffset: o = 0,
      align: i = "center",
      alignOffset: s = 0,
      arrowPadding: a = 0,
      avoidCollisions: c = !0,
      collisionBoundary: u = [],
      collisionPadding: d = 0,
      sticky: l = "partial",
      hideWhenDetached: f = !1,
      updatePositionStrategy: g = "optimized",
      onPlaced: v,
      ...p
    } = e, b = Pg(Fc, n), [y, S] = m.useState(null), w = Xe(t, (ge) => S(ge)), [_, C] = m.useState(null), R = oA(_), x = (R == null ? void 0 : R.width) ?? 0, E = (R == null ? void 0 : R.height) ?? 0, I = r + (i !== "center" ? "-" + i : ""), M = typeof d == "number" ? d : { top: 0, right: 0, bottom: 0, left: 0, ...d }, N = Array.isArray(u) ? u : [u], $ = N.length > 0, T = {
      padding: M,
      boundary: N.filter(lA),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: $
    }, { refs: O, floatingStyles: F, placement: A, isPositioned: D, middlewareData: V } = Ah({
      // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
      strategy: "fixed",
      placement: I,
      whileElementsMounted: (...ge) => Th(...ge, {
        animationFrame: g === "always"
      }),
      elements: {
        reference: b.anchor
      },
      middleware: [
        Oh({ mainAxis: o + E, alignmentAxis: s }),
        c && Ph({
          mainAxis: !0,
          crossAxis: !1,
          limiter: l === "partial" ? Mh() : void 0,
          ...T
        }),
        c && kh({ ...T }),
        Dh({
          ...T,
          apply: ({ elements: ge, rects: re, availableWidth: Y, availableHeight: ye }) => {
            const { width: De, height: at } = re.reference, Oe = ge.floating.style;
            Oe.setProperty("--radix-popper-available-width", `${Y}px`), Oe.setProperty("--radix-popper-available-height", `${ye}px`), Oe.setProperty("--radix-popper-anchor-width", `${De}px`), Oe.setProperty("--radix-popper-anchor-height", `${at}px`);
          }
        }),
        _ && Lh({ element: _, padding: a }),
        uA({ arrowWidth: x, arrowHeight: E }),
        f && $h({ strategy: "referenceHidden", ...T })
      ]
    }), [z, L] = Vg(A), j = qt(v);
    ft(() => {
      D && (j == null || j());
    }, [D, j]);
    const Z = (U = V.arrow) == null ? void 0 : U.x, K = (H = V.arrow) == null ? void 0 : H.y, G = ((Q = V.arrow) == null ? void 0 : Q.centerOffset) !== 0, [J, te] = m.useState();
    return ft(() => {
      y && te(window.getComputedStyle(y).zIndex);
    }, [y]), /* @__PURE__ */ h(
      "div",
      {
        ref: O.setFloating,
        "data-radix-popper-content-wrapper": "",
        style: {
          ...F,
          transform: D ? F.transform : "translate(0, -200%)",
          // keep off the page when measuring
          minWidth: "max-content",
          zIndex: J,
          "--radix-popper-transform-origin": [
            (ee = V.transformOrigin) == null ? void 0 : ee.x,
            (ie = V.transformOrigin) == null ? void 0 : ie.y
          ].join(" "),
          // hide the content if using the hide middleware and should be hidden
          // set visibility to hidden and disable pointer events so the UI behaves
          // as if the PopperContent isn't there at all
          ...((W = V.hide) == null ? void 0 : W.referenceHidden) && {
            visibility: "hidden",
            pointerEvents: "none"
          }
        },
        dir: e.dir,
        children: /* @__PURE__ */ h(
          sA,
          {
            scope: n,
            placedSide: z,
            onArrowChange: C,
            arrowX: Z,
            arrowY: K,
            shouldHideArrow: G,
            children: /* @__PURE__ */ h(
              We.div,
              {
                "data-side": z,
                "data-align": L,
                ...p,
                ref: w,
                style: {
                  ...p.style,
                  // if the PopperContent hasn't been placed yet (not all measurements done)
                  // we prevent animations so that users's animation don't kick in too early referring wrong sides
                  animation: D ? void 0 : "none"
                }
              }
            )
          }
        )
      }
    );
  }
);
$g.displayName = Fc;
var Lg = "PopperArrow", cA = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
}, Fg = m.forwardRef(function(t, n) {
  const { __scopePopper: r, ...o } = t, i = aA(Lg, r), s = cA[i.placedSide];
  return (
    // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
    // doesn't report size as we'd expect on SVG elements.
    // it reports their bounding box which is effectively the largest path inside the SVG.
    /* @__PURE__ */ h(
      "span",
      {
        ref: i.onArrowChange,
        style: {
          position: "absolute",
          left: i.arrowX,
          top: i.arrowY,
          [s]: 0,
          transformOrigin: {
            top: "",
            right: "0 0",
            bottom: "center 0",
            left: "100% 0"
          }[i.placedSide],
          transform: {
            top: "translateY(100%)",
            right: "translateY(50%) rotate(90deg) translateX(-50%)",
            bottom: "rotate(180deg)",
            left: "translateY(50%) rotate(-90deg) translateX(50%)"
          }[i.placedSide],
          visibility: i.shouldHideArrow ? "hidden" : void 0
        },
        children: /* @__PURE__ */ h(
          rA,
          {
            ...o,
            ref: n,
            style: {
              ...o.style,
              // ensures the element can be measured correctly (mostly for if SVG)
              display: "block"
            }
          }
        )
      }
    )
  );
});
Fg.displayName = Lg;
function lA(e) {
  return e !== null;
}
var uA = (e) => ({
  name: "transformOrigin",
  options: e,
  fn(t) {
    var b, y, S;
    const { placement: n, rects: r, middlewareData: o } = t, s = ((b = o.arrow) == null ? void 0 : b.centerOffset) !== 0, a = s ? 0 : e.arrowWidth, c = s ? 0 : e.arrowHeight, [u, d] = Vg(n), l = { start: "0%", center: "50%", end: "100%" }[d], f = (((y = o.arrow) == null ? void 0 : y.x) ?? 0) + a / 2, g = (((S = o.arrow) == null ? void 0 : S.y) ?? 0) + c / 2;
    let v = "", p = "";
    return u === "bottom" ? (v = s ? l : `${f}px`, p = `${-c}px`) : u === "top" ? (v = s ? l : `${f}px`, p = `${r.floating.height + c}px`) : u === "right" ? (v = `${-c}px`, p = s ? l : `${g}px`) : u === "left" && (v = `${r.floating.width + c}px`, p = s ? l : `${g}px`), { data: { x: v, y: p } };
  }
});
function Vg(e) {
  const [t, n = "center"] = e.split("-");
  return [t, n];
}
var dA = Mg, fA = Dg, hA = $g, pA = Fg, mA = "Portal", Bg = m.forwardRef((e, t) => {
  var a;
  const { container: n, ...r } = e, [o, i] = m.useState(!1);
  ft(() => i(!0), []);
  const s = n || o && ((a = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : a.body);
  return s ? Br.createPortal(/* @__PURE__ */ h(We.div, { ...r, ref: t }), s) : null;
});
Bg.displayName = mA;
function md({
  prop: e,
  defaultProp: t,
  onChange: n = () => {
  }
}) {
  const [r, o] = gA({ defaultProp: t, onChange: n }), i = e !== void 0, s = i ? e : r, a = qt(n), c = m.useCallback(
    (u) => {
      if (i) {
        const l = typeof u == "function" ? u(e) : u;
        l !== e && a(l);
      } else
        o(u);
    },
    [i, e, o, a]
  );
  return [s, c];
}
function gA({
  defaultProp: e,
  onChange: t
}) {
  const n = m.useState(e), [r] = n, o = m.useRef(r), i = qt(t);
  return m.useEffect(() => {
    o.current !== r && (i(r), o.current = r);
  }, [r, o, i]), n;
}
function vA(e) {
  const t = m.useRef({ value: e, previous: e });
  return m.useMemo(() => (t.current.value !== e && (t.current.previous = t.current.value, t.current.value = e), t.current.previous), [e]);
}
var yA = "VisuallyHidden", zg = m.forwardRef(
  (e, t) => /* @__PURE__ */ h(
    We.span,
    {
      ...e,
      ref: t,
      style: {
        // See: https://github.com/twbs/bootstrap/blob/main/scss/mixins/_visually-hidden.scss
        position: "absolute",
        border: 0,
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        wordWrap: "normal",
        ...e.style
      }
    }
  )
);
zg.displayName = yA;
var bA = [" ", "Enter", "ArrowUp", "ArrowDown"], SA = [" ", "Enter"], oo = "Select", [Ei, Ri, wA] = MN(oo), [vr] = Dc(oo, [
  wA,
  Og
]), Ii = Og(), [_A, ln] = vr(oo), [CA, xA] = vr(oo), jg = (e) => {
  const {
    __scopeSelect: t,
    children: n,
    open: r,
    defaultOpen: o,
    onOpenChange: i,
    value: s,
    defaultValue: a,
    onValueChange: c,
    dir: u,
    name: d,
    autoComplete: l,
    disabled: f,
    required: g,
    form: v
  } = e, p = Ii(t), [b, y] = m.useState(null), [S, w] = m.useState(null), [_, C] = m.useState(!1), R = DN(u), [x = !1, E] = md({
    prop: r,
    defaultProp: o,
    onChange: i
  }), [I, M] = md({
    prop: s,
    defaultProp: a,
    onChange: c
  }), N = m.useRef(null), $ = b ? v || !!b.closest("form") : !0, [T, O] = m.useState(/* @__PURE__ */ new Set()), F = Array.from(T).map((A) => A.props.value).join(";");
  return /* @__PURE__ */ h(dA, { ...p, children: /* @__PURE__ */ P(
    _A,
    {
      required: g,
      scope: t,
      trigger: b,
      onTriggerChange: y,
      valueNode: S,
      onValueNodeChange: w,
      valueNodeHasChildren: _,
      onValueNodeHasChildrenChange: C,
      contentId: $c(),
      value: I,
      onValueChange: M,
      open: x,
      onOpenChange: E,
      dir: R,
      triggerPointerDownPosRef: N,
      disabled: f,
      children: [
        /* @__PURE__ */ h(Ei.Provider, { scope: t, children: /* @__PURE__ */ h(
          CA,
          {
            scope: e.__scopeSelect,
            onNativeOptionAdd: m.useCallback((A) => {
              O((D) => new Set(D).add(A));
            }, []),
            onNativeOptionRemove: m.useCallback((A) => {
              O((D) => {
                const V = new Set(D);
                return V.delete(A), V;
              });
            }, []),
            children: n
          }
        ) }),
        $ ? /* @__PURE__ */ P(
          lv,
          {
            "aria-hidden": !0,
            required: g,
            tabIndex: -1,
            name: d,
            autoComplete: l,
            value: I,
            onChange: (A) => M(A.target.value),
            disabled: f,
            form: v,
            children: [
              I === void 0 ? /* @__PURE__ */ h("option", { value: "" }) : null,
              Array.from(T)
            ]
          },
          F
        ) : null
      ]
    }
  ) });
};
jg.displayName = oo;
var Ug = "SelectTrigger", Hg = m.forwardRef(
  (e, t) => {
    const { __scopeSelect: n, disabled: r = !1, ...o } = e, i = Ii(n), s = ln(Ug, n), a = s.disabled || r, c = Xe(t, s.onTriggerChange), u = Ri(n), d = m.useRef("touch"), [l, f, g] = uv((p) => {
      const b = u().filter((w) => !w.disabled), y = b.find((w) => w.value === s.value), S = dv(b, p, y);
      S !== void 0 && s.onValueChange(S.value);
    }), v = (p) => {
      a || (s.onOpenChange(!0), g()), p && (s.triggerPointerDownPosRef.current = {
        x: Math.round(p.pageX),
        y: Math.round(p.pageY)
      });
    };
    return /* @__PURE__ */ h(fA, { asChild: !0, ...i, children: /* @__PURE__ */ h(
      We.button,
      {
        type: "button",
        role: "combobox",
        "aria-controls": s.contentId,
        "aria-expanded": s.open,
        "aria-required": s.required,
        "aria-autocomplete": "none",
        dir: s.dir,
        "data-state": s.open ? "open" : "closed",
        disabled: a,
        "data-disabled": a ? "" : void 0,
        "data-placeholder": cv(s.value) ? "" : void 0,
        ...o,
        ref: c,
        onClick: He(o.onClick, (p) => {
          p.currentTarget.focus(), d.current !== "mouse" && v(p);
        }),
        onPointerDown: He(o.onPointerDown, (p) => {
          d.current = p.pointerType;
          const b = p.target;
          b.hasPointerCapture(p.pointerId) && b.releasePointerCapture(p.pointerId), p.button === 0 && p.ctrlKey === !1 && p.pointerType === "mouse" && (v(p), p.preventDefault());
        }),
        onKeyDown: He(o.onKeyDown, (p) => {
          const b = l.current !== "";
          !(p.ctrlKey || p.altKey || p.metaKey) && p.key.length === 1 && f(p.key), !(b && p.key === " ") && bA.includes(p.key) && (v(), p.preventDefault());
        })
      }
    ) });
  }
);
Hg.displayName = Ug;
var Wg = "SelectValue", Kg = m.forwardRef(
  (e, t) => {
    const { __scopeSelect: n, className: r, style: o, children: i, placeholder: s = "", ...a } = e, c = ln(Wg, n), { onValueNodeHasChildrenChange: u } = c, d = i !== void 0, l = Xe(t, c.onValueNodeChange);
    return ft(() => {
      u(d);
    }, [u, d]), /* @__PURE__ */ h(
      We.span,
      {
        ...a,
        ref: l,
        style: { pointerEvents: "none" },
        children: cv(c.value) ? /* @__PURE__ */ h(pe, { children: s }) : i
      }
    );
  }
);
Kg.displayName = Wg;
var EA = "SelectIcon", qg = m.forwardRef(
  (e, t) => {
    const { __scopeSelect: n, children: r, ...o } = e;
    return /* @__PURE__ */ h(We.span, { "aria-hidden": !0, ...o, ref: t, children: r || "▼" });
  }
);
qg.displayName = EA;
var RA = "SelectPortal", Gg = (e) => /* @__PURE__ */ h(Bg, { asChild: !0, ...e });
Gg.displayName = RA;
var _n = "SelectContent", Yg = m.forwardRef(
  (e, t) => {
    const n = ln(_n, e.__scopeSelect), [r, o] = m.useState();
    if (ft(() => {
      o(new DocumentFragment());
    }, []), !n.open) {
      const i = r;
      return i ? Rn.createPortal(
        /* @__PURE__ */ h(Xg, { scope: e.__scopeSelect, children: /* @__PURE__ */ h(Ei.Slot, { scope: e.__scopeSelect, children: /* @__PURE__ */ h("div", { children: e.children }) }) }),
        i
      ) : null;
    }
    return /* @__PURE__ */ h(Zg, { ...e, ref: t });
  }
);
Yg.displayName = _n;
var _t = 10, [Xg, un] = vr(_n), IA = "SelectContentImpl", Zg = m.forwardRef(
  (e, t) => {
    const {
      __scopeSelect: n,
      position: r = "item-aligned",
      onCloseAutoFocus: o,
      onEscapeKeyDown: i,
      onPointerDownOutside: s,
      //
      // PopperContent props
      side: a,
      sideOffset: c,
      align: u,
      alignOffset: d,
      arrowPadding: l,
      collisionBoundary: f,
      collisionPadding: g,
      sticky: v,
      hideWhenDetached: p,
      avoidCollisions: b,
      //
      ...y
    } = e, S = ln(_n, n), [w, _] = m.useState(null), [C, R] = m.useState(null), x = Xe(t, (U) => _(U)), [E, I] = m.useState(null), [M, N] = m.useState(
      null
    ), $ = Ri(n), [T, O] = m.useState(!1), F = m.useRef(!1);
    m.useEffect(() => {
      if (w) return fi(w);
    }, [w]), KN();
    const A = m.useCallback(
      (U) => {
        const [H, ...Q] = $().map((W) => W.ref.current), [ee] = Q.slice(-1), ie = document.activeElement;
        for (const W of U)
          if (W === ie || (W == null || W.scrollIntoView({ block: "nearest" }), W === H && C && (C.scrollTop = 0), W === ee && C && (C.scrollTop = C.scrollHeight), W == null || W.focus(), document.activeElement !== ie)) return;
      },
      [$, C]
    ), D = m.useCallback(
      () => A([E, w]),
      [A, E, w]
    );
    m.useEffect(() => {
      T && D();
    }, [T, D]);
    const { onOpenChange: V, triggerPointerDownPosRef: z } = S;
    m.useEffect(() => {
      if (w) {
        let U = { x: 0, y: 0 };
        const H = (ee) => {
          var ie, W;
          U = {
            x: Math.abs(Math.round(ee.pageX) - (((ie = z.current) == null ? void 0 : ie.x) ?? 0)),
            y: Math.abs(Math.round(ee.pageY) - (((W = z.current) == null ? void 0 : W.y) ?? 0))
          };
        }, Q = (ee) => {
          U.x <= 10 && U.y <= 10 ? ee.preventDefault() : w.contains(ee.target) || V(!1), document.removeEventListener("pointermove", H), z.current = null;
        };
        return z.current !== null && (document.addEventListener("pointermove", H), document.addEventListener("pointerup", Q, { capture: !0, once: !0 })), () => {
          document.removeEventListener("pointermove", H), document.removeEventListener("pointerup", Q, { capture: !0 });
        };
      }
    }, [w, V, z]), m.useEffect(() => {
      const U = () => V(!1);
      return window.addEventListener("blur", U), window.addEventListener("resize", U), () => {
        window.removeEventListener("blur", U), window.removeEventListener("resize", U);
      };
    }, [V]);
    const [L, j] = uv((U) => {
      const H = $().filter((ie) => !ie.disabled), Q = H.find((ie) => ie.ref.current === document.activeElement), ee = dv(H, U, Q);
      ee && setTimeout(() => ee.ref.current.focus());
    }), Z = m.useCallback(
      (U, H, Q) => {
        const ee = !F.current && !Q;
        (S.value !== void 0 && S.value === H || ee) && (I(U), ee && (F.current = !0));
      },
      [S.value]
    ), K = m.useCallback(() => w == null ? void 0 : w.focus(), [w]), G = m.useCallback(
      (U, H, Q) => {
        const ee = !F.current && !Q;
        (S.value !== void 0 && S.value === H || ee) && N(U);
      },
      [S.value]
    ), J = r === "popper" ? da : Jg, te = J === da ? {
      side: a,
      sideOffset: c,
      align: u,
      alignOffset: d,
      arrowPadding: l,
      collisionBoundary: f,
      collisionPadding: g,
      sticky: v,
      hideWhenDetached: p,
      avoidCollisions: b
    } : {};
    return /* @__PURE__ */ h(
      Xg,
      {
        scope: n,
        content: w,
        viewport: C,
        onViewportChange: R,
        itemRefCallback: Z,
        selectedItem: E,
        onItemLeave: K,
        itemTextRefCallback: G,
        focusSelectedItem: D,
        selectedItemText: M,
        position: r,
        isPositioned: T,
        searchRef: L,
        children: /* @__PURE__ */ h(Kr, { as: Fr, allowPinchZoom: !0, children: /* @__PURE__ */ h(
          Ig,
          {
            asChild: !0,
            trapped: S.open,
            onMountAutoFocus: (U) => {
              U.preventDefault();
            },
            onUnmountAutoFocus: He(o, (U) => {
              var H;
              (H = S.trigger) == null || H.focus({ preventScroll: !0 }), U.preventDefault();
            }),
            children: /* @__PURE__ */ h(
              Eg,
              {
                asChild: !0,
                disableOutsidePointerEvents: !0,
                onEscapeKeyDown: i,
                onPointerDownOutside: s,
                onFocusOutside: (U) => U.preventDefault(),
                onDismiss: () => S.onOpenChange(!1),
                children: /* @__PURE__ */ h(
                  J,
                  {
                    role: "listbox",
                    id: S.contentId,
                    "data-state": S.open ? "open" : "closed",
                    dir: S.dir,
                    onContextMenu: (U) => U.preventDefault(),
                    ...y,
                    ...te,
                    onPlaced: () => O(!0),
                    ref: x,
                    style: {
                      // flex layout so we can place the scroll buttons properly
                      display: "flex",
                      flexDirection: "column",
                      // reset the outline by default as the content MAY get focused
                      outline: "none",
                      ...y.style
                    },
                    onKeyDown: He(y.onKeyDown, (U) => {
                      const H = U.ctrlKey || U.altKey || U.metaKey;
                      if (U.key === "Tab" && U.preventDefault(), !H && U.key.length === 1 && j(U.key), ["ArrowUp", "ArrowDown", "Home", "End"].includes(U.key)) {
                        let ee = $().filter((ie) => !ie.disabled).map((ie) => ie.ref.current);
                        if (["ArrowUp", "End"].includes(U.key) && (ee = ee.slice().reverse()), ["ArrowUp", "ArrowDown"].includes(U.key)) {
                          const ie = U.target, W = ee.indexOf(ie);
                          ee = ee.slice(W + 1);
                        }
                        setTimeout(() => A(ee)), U.preventDefault();
                      }
                    })
                  }
                )
              }
            )
          }
        ) })
      }
    );
  }
);
Zg.displayName = IA;
var TA = "SelectItemAlignedPosition", Jg = m.forwardRef((e, t) => {
  const { __scopeSelect: n, onPlaced: r, ...o } = e, i = ln(_n, n), s = un(_n, n), [a, c] = m.useState(null), [u, d] = m.useState(null), l = Xe(t, (x) => d(x)), f = Ri(n), g = m.useRef(!1), v = m.useRef(!0), { viewport: p, selectedItem: b, selectedItemText: y, focusSelectedItem: S } = s, w = m.useCallback(() => {
    if (i.trigger && i.valueNode && a && u && p && b && y) {
      const x = i.trigger.getBoundingClientRect(), E = u.getBoundingClientRect(), I = i.valueNode.getBoundingClientRect(), M = y.getBoundingClientRect();
      if (i.dir !== "rtl") {
        const ie = M.left - E.left, W = I.left - ie, ge = x.left - W, re = x.width + ge, Y = Math.max(re, E.width), ye = window.innerWidth - _t, De = sd(W, [
          _t,
          // Prevents the content from going off the starting edge of the
          // viewport. It may still go off the ending edge, but this can be
          // controlled by the user since they may want to manage overflow in a
          // specific way.
          // https://github.com/radix-ui/primitives/issues/2049
          Math.max(_t, ye - Y)
        ]);
        a.style.minWidth = re + "px", a.style.left = De + "px";
      } else {
        const ie = E.right - M.right, W = window.innerWidth - I.right - ie, ge = window.innerWidth - x.right - W, re = x.width + ge, Y = Math.max(re, E.width), ye = window.innerWidth - _t, De = sd(W, [
          _t,
          Math.max(_t, ye - Y)
        ]);
        a.style.minWidth = re + "px", a.style.right = De + "px";
      }
      const N = f(), $ = window.innerHeight - _t * 2, T = p.scrollHeight, O = window.getComputedStyle(u), F = parseInt(O.borderTopWidth, 10), A = parseInt(O.paddingTop, 10), D = parseInt(O.borderBottomWidth, 10), V = parseInt(O.paddingBottom, 10), z = F + A + T + V + D, L = Math.min(b.offsetHeight * 5, z), j = window.getComputedStyle(p), Z = parseInt(j.paddingTop, 10), K = parseInt(j.paddingBottom, 10), G = x.top + x.height / 2 - _t, J = $ - G, te = b.offsetHeight / 2, U = b.offsetTop + te, H = F + A + U, Q = z - H;
      if (H <= G) {
        const ie = N.length > 0 && b === N[N.length - 1].ref.current;
        a.style.bottom = "0px";
        const W = u.clientHeight - p.offsetTop - p.offsetHeight, ge = Math.max(
          J,
          te + // viewport might have padding bottom, include it to avoid a scrollable viewport
          (ie ? K : 0) + W + D
        ), re = H + ge;
        a.style.height = re + "px";
      } else {
        const ie = N.length > 0 && b === N[0].ref.current;
        a.style.top = "0px";
        const ge = Math.max(
          G,
          F + p.offsetTop + // viewport might have padding top, include it to avoid a scrollable viewport
          (ie ? Z : 0) + te
        ) + Q;
        a.style.height = ge + "px", p.scrollTop = H - G + p.offsetTop;
      }
      a.style.margin = `${_t}px 0`, a.style.minHeight = L + "px", a.style.maxHeight = $ + "px", r == null || r(), requestAnimationFrame(() => g.current = !0);
    }
  }, [
    f,
    i.trigger,
    i.valueNode,
    a,
    u,
    p,
    b,
    y,
    i.dir,
    r
  ]);
  ft(() => w(), [w]);
  const [_, C] = m.useState();
  ft(() => {
    u && C(window.getComputedStyle(u).zIndex);
  }, [u]);
  const R = m.useCallback(
    (x) => {
      x && v.current === !0 && (w(), S == null || S(), v.current = !1);
    },
    [w, S]
  );
  return /* @__PURE__ */ h(
    AA,
    {
      scope: n,
      contentWrapper: a,
      shouldExpandOnScrollRef: g,
      onScrollButtonChange: R,
      children: /* @__PURE__ */ h(
        "div",
        {
          ref: c,
          style: {
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            zIndex: _
          },
          children: /* @__PURE__ */ h(
            We.div,
            {
              ...o,
              ref: l,
              style: {
                // When we get the height of the content, it includes borders. If we were to set
                // the height without having `boxSizing: 'border-box'` it would be too big.
                boxSizing: "border-box",
                // We need to ensure the content doesn't get taller than the wrapper
                maxHeight: "100%",
                ...o.style
              }
            }
          )
        }
      )
    }
  );
});
Jg.displayName = TA;
var NA = "SelectPopperPosition", da = m.forwardRef((e, t) => {
  const {
    __scopeSelect: n,
    align: r = "start",
    collisionPadding: o = _t,
    ...i
  } = e, s = Ii(n);
  return /* @__PURE__ */ h(
    hA,
    {
      ...s,
      ...i,
      ref: t,
      align: r,
      collisionPadding: o,
      style: {
        // Ensure border-box for floating-ui calculations
        boxSizing: "border-box",
        ...i.style,
        "--radix-select-content-transform-origin": "var(--radix-popper-transform-origin)",
        "--radix-select-content-available-width": "var(--radix-popper-available-width)",
        "--radix-select-content-available-height": "var(--radix-popper-available-height)",
        "--radix-select-trigger-width": "var(--radix-popper-anchor-width)",
        "--radix-select-trigger-height": "var(--radix-popper-anchor-height)"
      }
    }
  );
});
da.displayName = NA;
var [AA, Vc] = vr(_n, {}), fa = "SelectViewport", Qg = m.forwardRef(
  (e, t) => {
    const { __scopeSelect: n, nonce: r, ...o } = e, i = un(fa, n), s = Vc(fa, n), a = Xe(t, i.onViewportChange), c = m.useRef(0);
    return /* @__PURE__ */ P(pe, { children: [
      /* @__PURE__ */ h(
        "style",
        {
          dangerouslySetInnerHTML: {
            __html: "[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}"
          },
          nonce: r
        }
      ),
      /* @__PURE__ */ h(Ei.Slot, { scope: n, children: /* @__PURE__ */ h(
        We.div,
        {
          "data-radix-select-viewport": "",
          role: "presentation",
          ...o,
          ref: a,
          style: {
            // we use position: 'relative' here on the `viewport` so that when we call
            // `selectedItem.offsetTop` in calculations, the offset is relative to the viewport
            // (independent of the scrollUpButton).
            position: "relative",
            flex: 1,
            // Viewport should only be scrollable in the vertical direction.
            // This won't work in vertical writing modes, so we'll need to
            // revisit this if/when that is supported
            // https://developer.chrome.com/blog/vertical-form-controls
            overflow: "hidden auto",
            ...o.style
          },
          onScroll: He(o.onScroll, (u) => {
            const d = u.currentTarget, { contentWrapper: l, shouldExpandOnScrollRef: f } = s;
            if (f != null && f.current && l) {
              const g = Math.abs(c.current - d.scrollTop);
              if (g > 0) {
                const v = window.innerHeight - _t * 2, p = parseFloat(l.style.minHeight), b = parseFloat(l.style.height), y = Math.max(p, b);
                if (y < v) {
                  const S = y + g, w = Math.min(v, S), _ = S - w;
                  l.style.height = w + "px", l.style.bottom === "0px" && (d.scrollTop = _ > 0 ? _ : 0, l.style.justifyContent = "flex-end");
                }
              }
            }
            c.current = d.scrollTop;
          })
        }
      ) })
    ] });
  }
);
Qg.displayName = fa;
var ev = "SelectGroup", [OA, PA] = vr(ev), MA = m.forwardRef(
  (e, t) => {
    const { __scopeSelect: n, ...r } = e, o = $c();
    return /* @__PURE__ */ h(OA, { scope: n, id: o, children: /* @__PURE__ */ h(We.div, { role: "group", "aria-labelledby": o, ...r, ref: t }) });
  }
);
MA.displayName = ev;
var tv = "SelectLabel", kA = m.forwardRef(
  (e, t) => {
    const { __scopeSelect: n, ...r } = e, o = PA(tv, n);
    return /* @__PURE__ */ h(We.div, { id: o.id, ...r, ref: t });
  }
);
kA.displayName = tv;
var ri = "SelectItem", [DA, nv] = vr(ri), rv = m.forwardRef(
  (e, t) => {
    const {
      __scopeSelect: n,
      value: r,
      disabled: o = !1,
      textValue: i,
      ...s
    } = e, a = ln(ri, n), c = un(ri, n), u = a.value === r, [d, l] = m.useState(i ?? ""), [f, g] = m.useState(!1), v = Xe(
      t,
      (S) => {
        var w;
        return (w = c.itemRefCallback) == null ? void 0 : w.call(c, S, r, o);
      }
    ), p = $c(), b = m.useRef("touch"), y = () => {
      o || (a.onValueChange(r), a.onOpenChange(!1));
    };
    if (r === "")
      throw new Error(
        "A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder."
      );
    return /* @__PURE__ */ h(
      DA,
      {
        scope: n,
        value: r,
        disabled: o,
        textId: p,
        isSelected: u,
        onItemTextChange: m.useCallback((S) => {
          l((w) => w || ((S == null ? void 0 : S.textContent) ?? "").trim());
        }, []),
        children: /* @__PURE__ */ h(
          Ei.ItemSlot,
          {
            scope: n,
            value: r,
            disabled: o,
            textValue: d,
            children: /* @__PURE__ */ h(
              We.div,
              {
                role: "option",
                "aria-labelledby": p,
                "data-highlighted": f ? "" : void 0,
                "aria-selected": u && f,
                "data-state": u ? "checked" : "unchecked",
                "aria-disabled": o || void 0,
                "data-disabled": o ? "" : void 0,
                tabIndex: o ? void 0 : -1,
                ...s,
                ref: v,
                onFocus: He(s.onFocus, () => g(!0)),
                onBlur: He(s.onBlur, () => g(!1)),
                onClick: He(s.onClick, () => {
                  b.current !== "mouse" && y();
                }),
                onPointerUp: He(s.onPointerUp, () => {
                  b.current === "mouse" && y();
                }),
                onPointerDown: He(s.onPointerDown, (S) => {
                  b.current = S.pointerType;
                }),
                onPointerMove: He(s.onPointerMove, (S) => {
                  var w;
                  b.current = S.pointerType, o ? (w = c.onItemLeave) == null || w.call(c) : b.current === "mouse" && S.currentTarget.focus({ preventScroll: !0 });
                }),
                onPointerLeave: He(s.onPointerLeave, (S) => {
                  var w;
                  S.currentTarget === document.activeElement && ((w = c.onItemLeave) == null || w.call(c));
                }),
                onKeyDown: He(s.onKeyDown, (S) => {
                  var _;
                  ((_ = c.searchRef) == null ? void 0 : _.current) !== "" && S.key === " " || (SA.includes(S.key) && y(), S.key === " " && S.preventDefault());
                })
              }
            )
          }
        )
      }
    );
  }
);
rv.displayName = ri;
var Tr = "SelectItemText", ov = m.forwardRef(
  (e, t) => {
    const { __scopeSelect: n, className: r, style: o, ...i } = e, s = ln(Tr, n), a = un(Tr, n), c = nv(Tr, n), u = xA(Tr, n), [d, l] = m.useState(null), f = Xe(
      t,
      (y) => l(y),
      c.onItemTextChange,
      (y) => {
        var S;
        return (S = a.itemTextRefCallback) == null ? void 0 : S.call(a, y, c.value, c.disabled);
      }
    ), g = d == null ? void 0 : d.textContent, v = m.useMemo(
      () => /* @__PURE__ */ h("option", { value: c.value, disabled: c.disabled, children: g }, c.value),
      [c.disabled, c.value, g]
    ), { onNativeOptionAdd: p, onNativeOptionRemove: b } = u;
    return ft(() => (p(v), () => b(v)), [p, b, v]), /* @__PURE__ */ P(pe, { children: [
      /* @__PURE__ */ h(We.span, { id: c.textId, ...i, ref: f }),
      c.isSelected && s.valueNode && !s.valueNodeHasChildren ? Rn.createPortal(i.children, s.valueNode) : null
    ] });
  }
);
ov.displayName = Tr;
var iv = "SelectItemIndicator", sv = m.forwardRef(
  (e, t) => {
    const { __scopeSelect: n, ...r } = e;
    return nv(iv, n).isSelected ? /* @__PURE__ */ h(We.span, { "aria-hidden": !0, ...r, ref: t }) : null;
  }
);
sv.displayName = iv;
var ha = "SelectScrollUpButton", $A = m.forwardRef((e, t) => {
  const n = un(ha, e.__scopeSelect), r = Vc(ha, e.__scopeSelect), [o, i] = m.useState(!1), s = Xe(t, r.onScrollButtonChange);
  return ft(() => {
    if (n.viewport && n.isPositioned) {
      let a = function() {
        const u = c.scrollTop > 0;
        i(u);
      };
      const c = n.viewport;
      return a(), c.addEventListener("scroll", a), () => c.removeEventListener("scroll", a);
    }
  }, [n.viewport, n.isPositioned]), o ? /* @__PURE__ */ h(
    av,
    {
      ...e,
      ref: s,
      onAutoScroll: () => {
        const { viewport: a, selectedItem: c } = n;
        a && c && (a.scrollTop = a.scrollTop - c.offsetHeight);
      }
    }
  ) : null;
});
$A.displayName = ha;
var pa = "SelectScrollDownButton", LA = m.forwardRef((e, t) => {
  const n = un(pa, e.__scopeSelect), r = Vc(pa, e.__scopeSelect), [o, i] = m.useState(!1), s = Xe(t, r.onScrollButtonChange);
  return ft(() => {
    if (n.viewport && n.isPositioned) {
      let a = function() {
        const u = c.scrollHeight - c.clientHeight, d = Math.ceil(c.scrollTop) < u;
        i(d);
      };
      const c = n.viewport;
      return a(), c.addEventListener("scroll", a), () => c.removeEventListener("scroll", a);
    }
  }, [n.viewport, n.isPositioned]), o ? /* @__PURE__ */ h(
    av,
    {
      ...e,
      ref: s,
      onAutoScroll: () => {
        const { viewport: a, selectedItem: c } = n;
        a && c && (a.scrollTop = a.scrollTop + c.offsetHeight);
      }
    }
  ) : null;
});
LA.displayName = pa;
var av = m.forwardRef((e, t) => {
  const { __scopeSelect: n, onAutoScroll: r, ...o } = e, i = un("SelectScrollButton", n), s = m.useRef(null), a = Ri(n), c = m.useCallback(() => {
    s.current !== null && (window.clearInterval(s.current), s.current = null);
  }, []);
  return m.useEffect(() => () => c(), [c]), ft(() => {
    var d;
    const u = a().find((l) => l.ref.current === document.activeElement);
    (d = u == null ? void 0 : u.ref.current) == null || d.scrollIntoView({ block: "nearest" });
  }, [a]), /* @__PURE__ */ h(
    We.div,
    {
      "aria-hidden": !0,
      ...o,
      ref: t,
      style: { flexShrink: 0, ...o.style },
      onPointerDown: He(o.onPointerDown, () => {
        s.current === null && (s.current = window.setInterval(r, 50));
      }),
      onPointerMove: He(o.onPointerMove, () => {
        var u;
        (u = i.onItemLeave) == null || u.call(i), s.current === null && (s.current = window.setInterval(r, 50));
      }),
      onPointerLeave: He(o.onPointerLeave, () => {
        c();
      })
    }
  );
}), FA = "SelectSeparator", VA = m.forwardRef(
  (e, t) => {
    const { __scopeSelect: n, ...r } = e;
    return /* @__PURE__ */ h(We.div, { "aria-hidden": !0, ...r, ref: t });
  }
);
VA.displayName = FA;
var ma = "SelectArrow", BA = m.forwardRef(
  (e, t) => {
    const { __scopeSelect: n, ...r } = e, o = Ii(n), i = ln(ma, n), s = un(ma, n);
    return i.open && s.position === "popper" ? /* @__PURE__ */ h(pA, { ...o, ...r, ref: t }) : null;
  }
);
BA.displayName = ma;
function cv(e) {
  return e === "" || e === void 0;
}
var lv = m.forwardRef(
  (e, t) => {
    const { value: n, ...r } = e, o = m.useRef(null), i = Xe(t, o), s = vA(n);
    return m.useEffect(() => {
      const a = o.current, c = window.HTMLSelectElement.prototype, d = Object.getOwnPropertyDescriptor(
        c,
        "value"
      ).set;
      if (s !== n && d) {
        const l = new Event("change", { bubbles: !0 });
        d.call(a, n), a.dispatchEvent(l);
      }
    }, [s, n]), /* @__PURE__ */ h(zg, { asChild: !0, children: /* @__PURE__ */ h("select", { ...r, ref: i, defaultValue: n }) });
  }
);
lv.displayName = "BubbleSelect";
function uv(e) {
  const t = qt(e), n = m.useRef(""), r = m.useRef(0), o = m.useCallback(
    (s) => {
      const a = n.current + s;
      t(a), (function c(u) {
        n.current = u, window.clearTimeout(r.current), u !== "" && (r.current = window.setTimeout(() => c(""), 1e3));
      })(a);
    },
    [t]
  ), i = m.useCallback(() => {
    n.current = "", window.clearTimeout(r.current);
  }, []);
  return m.useEffect(() => () => window.clearTimeout(r.current), []), [n, o, i];
}
function dv(e, t, n) {
  const o = t.length > 1 && Array.from(t).every((u) => u === t[0]) ? t[0] : t, i = n ? e.indexOf(n) : -1;
  let s = zA(e, Math.max(i, 0));
  o.length === 1 && (s = s.filter((u) => u !== n));
  const c = s.find(
    (u) => u.textValue.toLowerCase().startsWith(o.toLowerCase())
  );
  return c !== n ? c : void 0;
}
function zA(e, t) {
  return e.map((n, r) => e[(t + r) % e.length]);
}
var jA = jg, UA = Hg, HA = Kg, WA = qg, KA = Gg, qA = Yg, GA = Qg, YA = rv, XA = ov, ZA = sv, JA = "_1csgdcy0", QA = "_1csgdcy1", eO = "_1csgdcy2", tO = "_1csgdcy3", nO = "_1csgdcy4", rO = "_1csgdcy5", oO = "_1csgdcy6 _14sdsl36", iO = "_1csgdcy7", sO = "_1csgdcy8", aO = "_1csgdcy9";
function ga({
  options: e,
  value: t,
  onChange: n,
  disabled: r,
  ariaLabel: o,
  emptyLabel: i,
  open: s,
  onOpenChange: a,
  isMobile: c = !1,
  triggerClassName: u,
  triggerIconClassName: d
}) {
  const l = Se(), f = Ye();
  return /* @__PURE__ */ P(
    jA,
    {
      value: t,
      onValueChange: n,
      disabled: r || e.length === 0,
      open: s,
      onOpenChange: a,
      children: [
        /* @__PURE__ */ P(UA, { className: X(JA, c && QA, u), "aria-label": o, children: [
          /* @__PURE__ */ h("span", { className: eO, children: /* @__PURE__ */ h(HA, { placeholder: i }) }),
          /* @__PURE__ */ h(WA, { asChild: !0, children: /* @__PURE__ */ h(Wr, { size: 14, className: X(tO, d), "aria-hidden": "true" }) })
        ] }),
        /* @__PURE__ */ h(KA, { children: /* @__PURE__ */ h(
          qA,
          {
            style: f,
            className: X(nO, c && rO),
            position: "popper",
            sideOffset: 4,
            "data-theme": l,
            children: /* @__PURE__ */ h(GA, { className: oO, children: e.map((g) => /* @__PURE__ */ P(YA, { value: g.value, className: X(iO, c && sO), children: [
              /* @__PURE__ */ h(XA, { children: g.label }),
              /* @__PURE__ */ h(ZA, { className: aO, children: /* @__PURE__ */ h(yt, { size: 13, "aria-hidden": "true" }) })
            ] }, g.value)) })
          }
        ) })
      ]
    }
  );
}
function cO(e, t, n) {
  return n ? t : e === t ? null : e;
}
var lt = /* @__PURE__ */ ((e) => (e.Idle = "idle", e.Recording = "recording", e.Playing = "playing", e))(lt || {});
function lO(e, t) {
  const { localAudioTrack: n } = _e(), [r, o] = ne(lt.Idle), [i, s] = ne(0), a = ue(null), c = ue(!1), u = ue(!1), d = q(async () => {
    var f, g, v;
    if (!n) return;
    if (r === lt.Playing) {
      u.current = !1, (f = a.current) == null || f.stop(), (g = a.current) == null || g.destroy(), a.current = null, s(0), o(lt.Idle);
      try {
        await n.stop();
      } catch {
      }
      return;
    }
    if (r === lt.Recording) {
      (v = a.current) == null || v.stopRecording();
      return;
    }
    if (c.current) return;
    c.current = !0;
    try {
      await n.start();
    } catch {
      c.current = !1;
      return;
    }
    u.current = !0;
    const l = n.testMicrophone({
      microphoneId: e ?? void 0,
      speakerId: t ?? void 0,
      recordAndPlay: !0,
      onAnalyseFrequency: (p) => s(Math.min(100, Math.round(p / 255 * 100))),
      onStartRecording: () => {
        c.current = !1, o(lt.Recording);
      },
      onStartPlayRecording: () => {
        s(0), o(lt.Playing);
      },
      onStopPlayRecording: () => {
        s(0), o(lt.Idle), u.current && (u.current = !1, n.stop());
      }
    });
    if (!l) {
      c.current = !1;
      try {
        await n.stop();
      } finally {
        u.current = !1;
      }
      return;
    }
    a.current = l;
  }, [r, n, e, t]);
  return oe(() => () => {
    var l;
    c.current = !1, (l = a.current) == null || l.destroy(), u.current && (u.current = !1, n == null || n.stop());
  }, [n]), { phase: r, level: r === "idle" ? 0 : i, toggle: d };
}
function uO(e, t) {
  const { localAudioTrack: n } = _e(), [r, o] = ne(!1), [i, s] = ne(0), a = ue(null), c = ue(null), u = q(() => {
    var l, f;
    c.current !== null && (clearTimeout(c.current), c.current = null), (l = a.current) == null || l.stop(), (f = a.current) == null || f.destroy(), a.current = null, s(0), o(!1);
  }, []), d = q(async () => {
    if (!n) return;
    if (r) {
      u();
      return;
    }
    const l = n.testSpeaker({
      speakerId: e ?? void 0,
      sampleAudioUrl: t,
      onAnalyseFrequency: (f) => {
        s(Math.min(100, Math.round(f / 255 * 100))), c.current !== null && clearTimeout(c.current), c.current = setTimeout(u, 600);
      }
    });
    l && (a.current = l, o(!0));
  }, [r, n, e, t, u]);
  return oe(() => () => {
    var l;
    c.current !== null && clearTimeout(c.current), (l = a.current) == null || l.destroy();
  }, []), { isTesting: r, level: i, toggle: d };
}
var gd = "_1diy3sb0", vd = "_1diy3sb1", yd = "_1diy3sb2", bd = "_1diy3sb3", dO = "_1diy3sb4", fO = "_1diy3sb5", hO = "_1diy3sb6", pO = "_1diy3sb7", mO = "_1diy3sb8";
function gO(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
  return function(o) {
    if (e == null || e(o), n === !1 || !o.defaultPrevented)
      return t == null ? void 0 : t(o);
  };
}
function Sd(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
function vO(...e) {
  return (t) => {
    let n = !1;
    const r = e.map((o) => {
      const i = Sd(o, t);
      return !n && typeof i == "function" && (n = !0), i;
    });
    if (n)
      return () => {
        for (let o = 0; o < r.length; o++) {
          const i = r[o];
          typeof i == "function" ? i() : Sd(e[o], null);
        }
      };
  };
}
function Bc(...e) {
  return m.useCallback(vO(...e), e);
}
function yO(e, t = []) {
  let n = [];
  function r(i, s) {
    const a = m.createContext(s);
    a.displayName = i + "Context";
    const c = n.length;
    n = [...n, s];
    const u = (l) => {
      var y;
      const { scope: f, children: g, ...v } = l, p = ((y = f == null ? void 0 : f[e]) == null ? void 0 : y[c]) || a, b = m.useMemo(() => v, Object.values(v));
      return /* @__PURE__ */ h(p.Provider, { value: b, children: g });
    };
    u.displayName = i + "Provider";
    function d(l, f) {
      var p;
      const g = ((p = f == null ? void 0 : f[e]) == null ? void 0 : p[c]) || a, v = m.useContext(g);
      if (v) return v;
      if (s !== void 0) return s;
      throw new Error(`\`${l}\` must be used within \`${i}\``);
    }
    return [u, d];
  }
  const o = () => {
    const i = n.map((s) => m.createContext(s));
    return function(a) {
      const c = (a == null ? void 0 : a[e]) || i;
      return m.useMemo(
        () => ({ [`__scope${e}`]: { ...a, [e]: c } }),
        [a, c]
      );
    };
  };
  return o.scopeName = e, [r, bO(o, ...t)];
}
function bO(...e) {
  const t = e[0];
  if (e.length === 1) return t;
  const n = () => {
    const r = e.map((o) => ({
      useScope: o(),
      scopeName: o.scopeName
    }));
    return function(i) {
      const s = r.reduce((a, { useScope: c, scopeName: u }) => {
        const l = c(i)[`__scope${u}`];
        return { ...a, ...l };
      }, {});
      return m.useMemo(() => ({ [`__scope${t.scopeName}`]: s }), [s]);
    };
  };
  return n.scopeName = t.scopeName, n;
}
var fv = globalThis != null && globalThis.document ? m.useLayoutEffect : () => {
}, SO = m[" useInsertionEffect ".trim().toString()] || fv;
function wO({
  prop: e,
  defaultProp: t,
  onChange: n = () => {
  },
  caller: r
}) {
  const [o, i, s] = _O({
    defaultProp: t,
    onChange: n
  }), a = e !== void 0, c = a ? e : o;
  {
    const d = m.useRef(e !== void 0);
    m.useEffect(() => {
      const l = d.current;
      l !== a && console.warn(
        `${r} is changing from ${l ? "controlled" : "uncontrolled"} to ${a ? "controlled" : "uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
      ), d.current = a;
    }, [a, r]);
  }
  const u = m.useCallback(
    (d) => {
      var l;
      if (a) {
        const f = CO(d) ? d(e) : d;
        f !== e && ((l = s.current) == null || l.call(s, f));
      } else
        i(d);
    },
    [a, e, i, s]
  );
  return [c, u];
}
function _O({
  defaultProp: e,
  onChange: t
}) {
  const [n, r] = m.useState(e), o = m.useRef(n), i = m.useRef(t);
  return SO(() => {
    i.current = t;
  }, [t]), m.useEffect(() => {
    var s;
    o.current !== n && ((s = i.current) == null || s.call(i, n), o.current = n);
  }, [n, o]), [n, r, i];
}
function CO(e) {
  return typeof e == "function";
}
function xO(e) {
  const t = m.useRef({ value: e, previous: e });
  return m.useMemo(() => (t.current.value !== e && (t.current.previous = t.current.value, t.current.value = e), t.current.previous), [e]);
}
function EO(e) {
  const [t, n] = m.useState(void 0);
  return fv(() => {
    if (e) {
      n({ width: e.offsetWidth, height: e.offsetHeight });
      const r = new ResizeObserver((o) => {
        if (!Array.isArray(o) || !o.length)
          return;
        const i = o[0];
        let s, a;
        if ("borderBoxSize" in i) {
          const c = i.borderBoxSize, u = Array.isArray(c) ? c[0] : c;
          s = u.inlineSize, a = u.blockSize;
        } else
          s = e.offsetWidth, a = e.offsetHeight;
        n({ width: s, height: a });
      });
      return r.observe(e, { box: "border-box" }), () => r.unobserve(e);
    } else
      n(void 0);
  }, [e]), t;
}
// @__NO_SIDE_EFFECTS__
function RO(e) {
  const t = m.forwardRef((n, r) => {
    let { children: o, ...i } = n, s = null, a = !1;
    const c = [];
    wd(o) && typeof Po == "function" && (o = Po(o._payload)), m.Children.forEach(o, (f) => {
      var g;
      if (OO(f)) {
        a = !0;
        const v = f;
        let p = "child" in v.props ? v.props.child : v.props.children;
        wd(p) && typeof Po == "function" && (p = Po(p._payload)), s = TO(v, p), c.push((g = s == null ? void 0 : s.props) == null ? void 0 : g.children);
      } else
        c.push(f);
    }), s ? s = m.cloneElement(s, void 0, c) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !a && m.Children.count(o) === 1 && m.isValidElement(o) && (s = o)
    );
    const u = s ? AO(s) : void 0, d = Bc(r, u);
    if (!s) {
      if (o || o === 0)
        throw new Error(
          a ? DO(e) : kO(e)
        );
      return o;
    }
    const l = NO(i, s.props ?? {});
    return s.type !== m.Fragment && (l.ref = r ? d : u), m.cloneElement(s, l);
  });
  return t.displayName = `${e}.Slot`, t;
}
var IO = Symbol.for("radix.slottable"), TO = (e, t) => {
  if ("child" in e.props) {
    const n = e.props.child;
    return m.isValidElement(n) ? m.cloneElement(n, void 0, e.props.children(n.props.children)) : null;
  }
  return m.isValidElement(t) ? t : null;
};
function NO(e, t) {
  const n = { ...t };
  for (const r in t) {
    const o = e[r], i = t[r];
    /^on[A-Z]/.test(r) ? o && i ? n[r] = (...a) => {
      const c = i(...a);
      return o(...a), c;
    } : o && (n[r] = o) : r === "style" ? n[r] = { ...o, ...i } : r === "className" && (n[r] = [o, i].filter(Boolean).join(" "));
  }
  return { ...e, ...n };
}
function AO(e) {
  var r, o;
  let t = (r = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : r.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
function OO(e) {
  return m.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === IO;
}
var PO = Symbol.for("react.lazy");
function wd(e) {
  return e != null && typeof e == "object" && "$$typeof" in e && e.$$typeof === PO && "_payload" in e && MO(e._payload);
}
function MO(e) {
  return typeof e == "object" && e !== null && "then" in e;
}
var kO = (e) => `${e} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, DO = (e) => `${e} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, Po = m[" use ".trim().toString()], $O = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
], zc = $O.reduce((e, t) => {
  const n = /* @__PURE__ */ RO(`Primitive.${t}`), r = m.forwardRef((o, i) => {
    const { asChild: s, ...a } = o, c = s ? n : t;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ h(c, { ...a, ref: i });
  });
  return r.displayName = `Primitive.${t}`, { ...e, [t]: r };
}, {}), Ti = "Switch", [LO] = yO(Ti), [FO, jc] = LO(Ti);
function VO(e) {
  const {
    __scopeSwitch: t,
    checked: n,
    children: r,
    defaultChecked: o,
    disabled: i,
    form: s,
    name: a,
    onCheckedChange: c,
    required: u,
    value: d = "on",
    // @ts-expect-error
    internal_do_not_use_render: l
  } = e, [f, g] = wO({
    prop: n,
    defaultProp: o ?? !1,
    onChange: c,
    caller: Ti
  }), [v, p] = m.useState(null), [b, y] = m.useState(null), S = m.useRef(!1), w = v ? !!s || !!v.closest("form") : (
    // We set this to true by default so that events bubble to forms without JS (SSR)
    !0
  ), _ = {
    checked: f,
    setChecked: g,
    disabled: i,
    control: v,
    setControl: p,
    name: a,
    form: s,
    value: d,
    hasConsumerStoppedPropagationRef: S,
    required: u,
    defaultChecked: o,
    isFormControl: w,
    bubbleInput: b,
    setBubbleInput: y
  };
  return /* @__PURE__ */ h(FO, { scope: t, ..._, children: BO(l) ? l(_) : r });
}
var hv = "SwitchTrigger", pv = m.forwardRef(
  ({ __scopeSwitch: e, onClick: t, ...n }, r) => {
    const {
      value: o,
      disabled: i,
      checked: s,
      required: a,
      setControl: c,
      setChecked: u,
      hasConsumerStoppedPropagationRef: d,
      isFormControl: l,
      bubbleInput: f
    } = jc(hv, e), g = Bc(r, c);
    return /* @__PURE__ */ h(
      zc.button,
      {
        type: "button",
        role: "switch",
        "aria-checked": s,
        "aria-required": a,
        "data-state": Sv(s),
        "data-disabled": i ? "" : void 0,
        disabled: i,
        value: o,
        ...n,
        ref: g,
        onClick: gO(t, (v) => {
          u((p) => !p), f && l && (d.current = v.isPropagationStopped(), d.current || v.stopPropagation());
        })
      }
    );
  }
);
pv.displayName = hv;
var mv = m.forwardRef(
  (e, t) => {
    const {
      __scopeSwitch: n,
      name: r,
      checked: o,
      defaultChecked: i,
      required: s,
      disabled: a,
      value: c,
      onCheckedChange: u,
      form: d,
      ...l
    } = e;
    return /* @__PURE__ */ h(
      VO,
      {
        __scopeSwitch: n,
        checked: o,
        defaultChecked: i,
        disabled: a,
        required: s,
        onCheckedChange: u,
        name: r,
        form: d,
        value: c,
        internal_do_not_use_render: ({ isFormControl: f }) => /* @__PURE__ */ P(pe, { children: [
          /* @__PURE__ */ h(
            pv,
            {
              ...l,
              ref: t,
              __scopeSwitch: n
            }
          ),
          f && /* @__PURE__ */ h(
            bv,
            {
              __scopeSwitch: n
            }
          )
        ] })
      }
    );
  }
);
mv.displayName = Ti;
var gv = "SwitchThumb", vv = m.forwardRef(
  (e, t) => {
    const { __scopeSwitch: n, ...r } = e, o = jc(gv, n);
    return /* @__PURE__ */ h(
      zc.span,
      {
        "data-state": Sv(o.checked),
        "data-disabled": o.disabled ? "" : void 0,
        ...r,
        ref: t
      }
    );
  }
);
vv.displayName = gv;
var yv = "SwitchBubbleInput", bv = m.forwardRef(
  ({ __scopeSwitch: e, ...t }, n) => {
    const {
      control: r,
      hasConsumerStoppedPropagationRef: o,
      checked: i,
      defaultChecked: s,
      required: a,
      disabled: c,
      name: u,
      value: d,
      form: l,
      bubbleInput: f,
      setBubbleInput: g
    } = jc(yv, e), v = Bc(n, g), p = xO(i), b = EO(r);
    m.useEffect(() => {
      const S = f;
      if (!S) return;
      const w = window.HTMLInputElement.prototype, C = Object.getOwnPropertyDescriptor(
        w,
        "checked"
      ).set, R = !o.current;
      if (p !== i && C) {
        const x = new Event("click", { bubbles: R });
        C.call(S, i), S.dispatchEvent(x);
      }
    }, [f, p, i, o]);
    const y = m.useRef(i);
    return /* @__PURE__ */ h(
      zc.input,
      {
        type: "checkbox",
        "aria-hidden": !0,
        defaultChecked: s ?? y.current,
        required: a,
        disabled: c,
        name: u,
        value: d,
        form: l,
        ...t,
        tabIndex: -1,
        ref: v,
        style: {
          ...t.style,
          ...b,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0,
          // We transform because the input is absolutely positioned but we have
          // rendered it **after** the button. This pulls it back to sit on top
          // of the button.
          transform: "translateX(-100%)"
        }
      }
    );
  }
);
bv.displayName = yv;
function BO(e) {
  return typeof e == "function";
}
function Sv(e) {
  return e ? "checked" : "unchecked";
}
var wv = "fajjjh0", _v = "fajjjh1", mn = "fajjjh2", Hn = "fajjjh3", gn = "fajjjh4", Wn = "fajjjh5", zO = "fajjjh6", jO = "fajjjh7", UO = "fajjjh8", HO = St({ defaultClassName: "fajjjh9", variantClassNames: { checked: { true: "fajjjha", false: "fajjjhb" } }, defaultVariants: { checked: !1 }, compoundVariants: [] }), WO = St({ defaultClassName: "fajjjhc", variantClassNames: { checked: { true: "fajjjhd", false: "fajjjhe" } }, defaultVariants: { checked: !1 }, compoundVariants: [] });
const Zn = ({ label: e, checked: t, onChange: n, disabled: r, isMobile: o = !1 }) => {
  const i = En();
  return /* @__PURE__ */ P("div", { className: X(zO, o && jO), children: [
    /* @__PURE__ */ h("label", { htmlFor: i, className: UO, children: e }),
    /* @__PURE__ */ h(
      mv,
      {
        id: i,
        checked: t,
        onCheckedChange: n,
        disabled: r,
        className: HO({ checked: t }),
        "data-mobile": o ? "true" : void 0,
        children: /* @__PURE__ */ h(vv, { className: WO({ checked: t }), "data-mobile": o ? "true" : void 0 })
      }
    )
  ] });
};
function _d({ level: e, isMobile: t = !1 }) {
  return /* @__PURE__ */ h(
    RN,
    {
      className: X(dO, t && fO),
      value: e,
      max: 100,
      "aria-label": "Audio level",
      children: /* @__PURE__ */ h(IN, { className: hO, style: { width: `${e}%` } })
    }
  );
}
function Cv({ testSoundUrl: e, isMobile: t = !1 }) {
  const { t: n } = de(), {
    canUseNoiseSuppression: r,
    canUseHeadsetSync: o,
    switchMicrophone: i,
    switchSpeaker: s,
    setNoiseSuppression: a,
    setOriginalSound: c,
    setHeadsetSync: u
  } = fm(), d = B((N) => N.deviceState), l = B((N) => N.audioState), f = he(
    () => d.microphones.map((N) => ({
      value: N.deviceId,
      label: N.label || N.deviceId
    })),
    [d.microphones]
  ), g = he(
    () => d.speakers.map((N) => ({
      value: N.deviceId,
      label: N.label || N.deviceId
    })),
    [d.speakers]
  ), { localAudioTrack: v } = _e(), p = uO(d.activeSpeakerId, e), b = lO(d.activeMicrophoneId, d.activeSpeakerId), y = q((N) => void i(N), [i]), S = q((N) => void s(N), [s]), w = q(() => void b.toggle(), [b]), _ = q(() => void p.toggle(), [p]), C = q((N) => void a(N), [a]), R = q((N) => void c(N), [c]), x = q((N) => void u(N), [u]), [E, I] = ne(null), M = q(
    (N, $) => I((T) => cO(T, N, $)),
    []
  );
  return oe(() => {
    E && (E === "microphone" ? f : g).length === 0 && I(null);
  }, [f, E, g]), /* @__PURE__ */ P("div", { className: X(wv, t && _v), children: [
    /* @__PURE__ */ P("div", { className: X(mn, t && Hn), children: [
      /* @__PURE__ */ h("div", { className: X(gn, t && Wn), children: n("settings.audio.microphone") }),
      /* @__PURE__ */ h(
        ga,
        {
          options: f,
          value: f.length === 0 ? "" : d.activeMicrophoneId ?? "",
          onChange: y,
          disabled: d.isSwitchingMicrophone,
          ariaLabel: n("settings.audio.microphone"),
          emptyLabel: "Unrecognized device",
          open: E === "microphone",
          onOpenChange: (N) => M("microphone", N),
          isMobile: t
        }
      ),
      v && /* @__PURE__ */ P("div", { className: t ? yd : vd, children: [
        /* @__PURE__ */ P(
          le,
          {
            type: "button",
            active: b.phase !== lt.Idle,
            className: X(gd, t && bd),
            onClick: w,
            children: [
              b.phase !== lt.Idle ? /* @__PURE__ */ h(Vl, { size: 10, fill: "currentColor" }) : /* @__PURE__ */ h(Bw, { size: 10, fill: "currentColor" }),
              b.phase === lt.Recording ? n("settings.audio.stop_recording") : b.phase === lt.Playing ? n("settings.audio.stop_playing") : n("settings.audio.test_microphone")
            ]
          }
        ),
        /* @__PURE__ */ h(_d, { level: b.level, isMobile: t })
      ] }),
      v && /* @__PURE__ */ h(
        "span",
        {
          className: X(pO, t && mO),
          "aria-hidden": b.phase !== "playing",
          style: { opacity: b.phase === lt.Playing ? 1 : 0 },
          children: n("settings.audio.recording_playing")
        }
      )
    ] }),
    /* @__PURE__ */ P("div", { className: X(mn, t && Hn), children: [
      /* @__PURE__ */ h("div", { className: X(gn, t && Wn), children: n("settings.audio.speaker") }),
      /* @__PURE__ */ h(
        ga,
        {
          options: g,
          value: g.length === 0 ? "" : d.activeSpeakerId ?? "",
          onChange: S,
          disabled: d.isSwitchingSpeaker,
          ariaLabel: n("settings.audio.speaker"),
          emptyLabel: "Unrecognized device",
          open: E === "speaker",
          onOpenChange: (N) => M("speaker", N),
          isMobile: t
        }
      ),
      v && /* @__PURE__ */ P("div", { className: t ? yd : vd, children: [
        /* @__PURE__ */ P(
          le,
          {
            type: "button",
            active: p.isTesting,
            className: X(gd, t && bd),
            onClick: _,
            children: [
              p.isTesting ? /* @__PURE__ */ h(Vl, { size: 10, fill: "currentColor" }) : /* @__PURE__ */ h($f, { size: 10, fill: "currentColor" }),
              p.isTesting ? n("settings.audio.stop_test") : n("settings.audio.test_speaker")
            ]
          }
        ),
        /* @__PURE__ */ h(_d, { level: p.level, isMobile: t })
      ] })
    ] }),
    /* @__PURE__ */ P("div", { className: X(mn, t && Hn), children: [
      /* @__PURE__ */ h("div", { className: X(gn, t && Wn), children: n("settings.audio.microphone_modes") }),
      r && /* @__PURE__ */ h(
        Zn,
        {
          label: n("settings.audio.noise_suppression"),
          checked: l.noiseSuppressionEnabled ?? !1,
          onChange: C,
          isMobile: t
        }
      ),
      /* @__PURE__ */ h(
        Zn,
        {
          label: n("settings.audio.original_sound"),
          checked: l.originalSound ?? !1,
          onChange: R,
          isMobile: t
        }
      )
    ] }),
    o && /* @__PURE__ */ P("div", { className: X(mn, t && Hn), children: [
      /* @__PURE__ */ h("div", { className: X(gn, t && Wn), children: n("settings.audio.headset") }),
      /* @__PURE__ */ h(
        Zn,
        {
          label: n("settings.audio.headset_sync"),
          checked: l.headsetSync ?? !1,
          onChange: x,
          isMobile: t
        }
      )
    ] })
  ] });
}
function zt(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
  return function(o) {
    if (e == null || e(o), n === !1 || !o.defaultPrevented)
      return t == null ? void 0 : t(o);
  };
}
function Cd(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
function KO(...e) {
  return (t) => {
    let n = !1;
    const r = e.map((o) => {
      const i = Cd(o, t);
      return !n && typeof i == "function" && (n = !0), i;
    });
    if (n)
      return () => {
        for (let o = 0; o < r.length; o++) {
          const i = r[o];
          typeof i == "function" ? i() : Cd(e[o], null);
        }
      };
  };
}
function Cn(...e) {
  return m.useCallback(KO(...e), e);
}
function Ni(e, t = []) {
  let n = [];
  function r(i, s) {
    const a = m.createContext(s);
    a.displayName = i + "Context";
    const c = n.length;
    n = [...n, s];
    const u = (l) => {
      var y;
      const { scope: f, children: g, ...v } = l, p = ((y = f == null ? void 0 : f[e]) == null ? void 0 : y[c]) || a, b = m.useMemo(() => v, Object.values(v));
      return /* @__PURE__ */ h(p.Provider, { value: b, children: g });
    };
    u.displayName = i + "Provider";
    function d(l, f) {
      var p;
      const g = ((p = f == null ? void 0 : f[e]) == null ? void 0 : p[c]) || a, v = m.useContext(g);
      if (v) return v;
      if (s !== void 0) return s;
      throw new Error(`\`${l}\` must be used within \`${i}\``);
    }
    return [u, d];
  }
  const o = () => {
    const i = n.map((s) => m.createContext(s));
    return function(a) {
      const c = (a == null ? void 0 : a[e]) || i;
      return m.useMemo(
        () => ({ [`__scope${e}`]: { ...a, [e]: c } }),
        [a, c]
      );
    };
  };
  return o.scopeName = e, [r, qO(o, ...t)];
}
function qO(...e) {
  const t = e[0];
  if (e.length === 1) return t;
  const n = () => {
    const r = e.map((o) => ({
      useScope: o(),
      scopeName: o.scopeName
    }));
    return function(i) {
      const s = r.reduce((a, { useScope: c, scopeName: u }) => {
        const l = c(i)[`__scope${u}`];
        return { ...a, ...l };
      }, {});
      return m.useMemo(() => ({ [`__scope${t.scopeName}`]: s }), [s]);
    };
  };
  return n.scopeName = t.scopeName, n;
}
// @__NO_SIDE_EFFECTS__
function va(e) {
  const t = m.forwardRef((n, r) => {
    let { children: o, ...i } = n, s = null, a = !1;
    const c = [];
    xd(o) && typeof Mo == "function" && (o = Mo(o._payload)), m.Children.forEach(o, (f) => {
      var g;
      if (JO(f)) {
        a = !0;
        const v = f;
        let p = "child" in v.props ? v.props.child : v.props.children;
        xd(p) && typeof Mo == "function" && (p = Mo(p._payload)), s = YO(v, p), c.push((g = s == null ? void 0 : s.props) == null ? void 0 : g.children);
      } else
        c.push(f);
    }), s ? s = m.cloneElement(s, void 0, c) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !a && m.Children.count(o) === 1 && m.isValidElement(o) && (s = o)
    );
    const u = s ? ZO(s) : void 0, d = Cn(r, u);
    if (!s) {
      if (o || o === 0)
        throw new Error(
          a ? nP(e) : tP(e)
        );
      return o;
    }
    const l = XO(i, s.props ?? {});
    return s.type !== m.Fragment && (l.ref = r ? d : u), m.cloneElement(s, l);
  });
  return t.displayName = `${e}.Slot`, t;
}
var GO = Symbol.for("radix.slottable"), YO = (e, t) => {
  if ("child" in e.props) {
    const n = e.props.child;
    return m.isValidElement(n) ? m.cloneElement(n, void 0, e.props.children(n.props.children)) : null;
  }
  return m.isValidElement(t) ? t : null;
};
function XO(e, t) {
  const n = { ...t };
  for (const r in t) {
    const o = e[r], i = t[r];
    /^on[A-Z]/.test(r) ? o && i ? n[r] = (...a) => {
      const c = i(...a);
      return o(...a), c;
    } : o && (n[r] = o) : r === "style" ? n[r] = { ...o, ...i } : r === "className" && (n[r] = [o, i].filter(Boolean).join(" "));
  }
  return { ...e, ...n };
}
function ZO(e) {
  var r, o;
  let t = (r = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : r.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
function JO(e) {
  return m.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === GO;
}
var QO = Symbol.for("react.lazy");
function xd(e) {
  return e != null && typeof e == "object" && "$$typeof" in e && e.$$typeof === QO && "_payload" in e && eP(e._payload);
}
function eP(e) {
  return typeof e == "object" && e !== null && "then" in e;
}
var tP = (e) => `${e} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, nP = (e) => `${e} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, Mo = m[" use ".trim().toString()], rP = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
], yr = rP.reduce((e, t) => {
  const n = /* @__PURE__ */ va(`Primitive.${t}`), r = m.forwardRef((o, i) => {
    const { asChild: s, ...a } = o, c = s ? n : t;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ h(c, { ...a, ref: i });
  });
  return r.displayName = `Primitive.${t}`, { ...e, [t]: r };
}, {});
function oP(e) {
  const t = e + "CollectionProvider", [n, r] = Ni(t), [o, i] = n(
    t,
    { collectionRef: { current: null }, itemMap: /* @__PURE__ */ new Map() }
  ), s = (p) => {
    const { scope: b, children: y } = p, S = m.useRef(null), w = m.useRef(/* @__PURE__ */ new Map()).current;
    return /* @__PURE__ */ h(o, { scope: b, itemMap: w, collectionRef: S, children: y });
  };
  s.displayName = t;
  const a = e + "CollectionSlot", c = /* @__PURE__ */ va(a), u = m.forwardRef(
    (p, b) => {
      const { scope: y, children: S } = p, w = i(a, y), _ = Cn(b, w.collectionRef);
      return /* @__PURE__ */ h(c, { ref: _, children: S });
    }
  );
  u.displayName = a;
  const d = e + "CollectionItemSlot", l = "data-radix-collection-item", f = /* @__PURE__ */ va(d), g = m.forwardRef(
    (p, b) => {
      const { scope: y, children: S, ...w } = p, _ = m.useRef(null), C = Cn(b, _), R = i(d, y);
      return m.useEffect(() => (R.itemMap.set(_, { ref: _, ...w }), () => void R.itemMap.delete(_))), /* @__PURE__ */ h(f, { [l]: "", ref: C, children: S });
    }
  );
  g.displayName = d;
  function v(p) {
    const b = i(e + "CollectionConsumer", p);
    return m.useCallback(() => {
      const S = b.collectionRef.current;
      if (!S) return [];
      const w = Array.from(S.querySelectorAll(`[${l}]`));
      return Array.from(b.itemMap.values()).sort(
        (R, x) => w.indexOf(R.ref.current) - w.indexOf(x.ref.current)
      );
    }, [b.collectionRef, b.itemMap]);
  }
  return [
    { Provider: s, Slot: u, ItemSlot: g },
    v,
    r
  ];
}
var Vr = globalThis != null && globalThis.document ? m.useLayoutEffect : () => {
}, iP = m[" useId ".trim().toString()] || (() => {
}), sP = 0;
function aP(e) {
  const [t, n] = m.useState(iP());
  return Vr(() => {
    n((r) => r ?? String(sP++));
  }, [e]), t ? `radix-${t}` : "";
}
function cP(e) {
  const t = m.useRef(e);
  return m.useEffect(() => {
    t.current = e;
  }), m.useMemo(() => ((...n) => {
    var r;
    return (r = t.current) == null ? void 0 : r.call(t, ...n);
  }), []);
}
var lP = m[" useInsertionEffect ".trim().toString()] || Vr;
function xv({
  prop: e,
  defaultProp: t,
  onChange: n = () => {
  },
  caller: r
}) {
  const [o, i, s] = uP({
    defaultProp: t,
    onChange: n
  }), a = e !== void 0, c = a ? e : o;
  {
    const d = m.useRef(e !== void 0);
    m.useEffect(() => {
      const l = d.current;
      l !== a && console.warn(
        `${r} is changing from ${l ? "controlled" : "uncontrolled"} to ${a ? "controlled" : "uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
      ), d.current = a;
    }, [a, r]);
  }
  const u = m.useCallback(
    (d) => {
      var l;
      if (a) {
        const f = dP(d) ? d(e) : d;
        f !== e && ((l = s.current) == null || l.call(s, f));
      } else
        i(d);
    },
    [a, e, i, s]
  );
  return [c, u];
}
function uP({
  defaultProp: e,
  onChange: t
}) {
  const [n, r] = m.useState(e), o = m.useRef(n), i = m.useRef(t);
  return lP(() => {
    i.current = t;
  }, [t]), m.useEffect(() => {
    var s;
    o.current !== n && ((s = i.current) == null || s.call(i, n), o.current = n);
  }, [n, o]), [n, r, i];
}
function dP(e) {
  return typeof e == "function";
}
var fP = m.createContext(void 0);
function Ev(e) {
  const t = m.useContext(fP);
  return e || t || "ltr";
}
var Es = "rovingFocusGroup.onEntryFocus", hP = { bubbles: !1, cancelable: !0 }, io = "RovingFocusGroup", [ya, Rv, pP] = oP(io), [mP, Iv] = Ni(
  io,
  [pP]
), [gP, vP] = mP(io), Tv = m.forwardRef(
  (e, t) => /* @__PURE__ */ h(ya.Provider, { scope: e.__scopeRovingFocusGroup, children: /* @__PURE__ */ h(ya.Slot, { scope: e.__scopeRovingFocusGroup, children: /* @__PURE__ */ h(yP, { ...e, ref: t }) }) })
);
Tv.displayName = io;
var yP = m.forwardRef((e, t) => {
  const {
    __scopeRovingFocusGroup: n,
    orientation: r,
    loop: o = !1,
    dir: i,
    currentTabStopId: s,
    defaultCurrentTabStopId: a,
    onCurrentTabStopIdChange: c,
    onEntryFocus: u,
    preventScrollOnEntryFocus: d = !1,
    ...l
  } = e, f = m.useRef(null), g = Cn(t, f), v = Ev(i), [p, b] = xv({
    prop: s,
    defaultProp: a ?? null,
    onChange: c,
    caller: io
  }), [y, S] = m.useState(!1), w = cP(u), _ = Rv(n), C = m.useRef(!1), [R, x] = m.useState(0);
  return m.useEffect(() => {
    const E = f.current;
    if (E)
      return E.addEventListener(Es, w), () => E.removeEventListener(Es, w);
  }, [w]), /* @__PURE__ */ h(
    gP,
    {
      scope: n,
      orientation: r,
      dir: v,
      loop: o,
      currentTabStopId: p,
      onItemFocus: m.useCallback(
        (E) => b(E),
        [b]
      ),
      onItemShiftTab: m.useCallback(() => S(!0), []),
      onFocusableItemAdd: m.useCallback(
        () => x((E) => E + 1),
        []
      ),
      onFocusableItemRemove: m.useCallback(
        () => x((E) => E - 1),
        []
      ),
      children: /* @__PURE__ */ h(
        yr.div,
        {
          tabIndex: y || R === 0 ? -1 : 0,
          "data-orientation": r,
          ...l,
          ref: g,
          style: { outline: "none", ...e.style },
          onMouseDown: zt(e.onMouseDown, () => {
            C.current = !0;
          }),
          onFocus: zt(e.onFocus, (E) => {
            const I = !C.current;
            if (E.target === E.currentTarget && I && !y) {
              const M = new CustomEvent(Es, hP);
              if (E.currentTarget.dispatchEvent(M), !M.defaultPrevented) {
                const N = _().filter((A) => A.focusable), $ = N.find((A) => A.active), T = N.find((A) => A.id === p), F = [$, T, ...N].filter(
                  Boolean
                ).map((A) => A.ref.current);
                Ov(F, d);
              }
            }
            C.current = !1;
          }),
          onBlur: zt(e.onBlur, () => S(!1))
        }
      )
    }
  );
}), Nv = "RovingFocusGroupItem", Av = m.forwardRef(
  (e, t) => {
    const {
      __scopeRovingFocusGroup: n,
      focusable: r = !0,
      active: o = !1,
      tabStopId: i,
      children: s,
      ...a
    } = e, c = aP(), u = i || c, d = vP(Nv, n), l = d.currentTabStopId === u, f = Rv(n), { onFocusableItemAdd: g, onFocusableItemRemove: v, currentTabStopId: p } = d;
    return m.useEffect(() => {
      if (r)
        return g(), () => v();
    }, [r, g, v]), /* @__PURE__ */ h(
      ya.ItemSlot,
      {
        scope: n,
        id: u,
        focusable: r,
        active: o,
        children: /* @__PURE__ */ h(
          yr.span,
          {
            tabIndex: l ? 0 : -1,
            "data-orientation": d.orientation,
            ...a,
            ref: t,
            onMouseDown: zt(e.onMouseDown, (b) => {
              r ? d.onItemFocus(u) : b.preventDefault();
            }),
            onFocus: zt(e.onFocus, () => d.onItemFocus(u)),
            onKeyDown: zt(e.onKeyDown, (b) => {
              if (b.key === "Tab" && b.shiftKey) {
                d.onItemShiftTab();
                return;
              }
              if (b.target !== b.currentTarget) return;
              const y = wP(b, d.orientation, d.dir);
              if (y !== void 0) {
                if (b.metaKey || b.ctrlKey || b.altKey || b.shiftKey) return;
                b.preventDefault();
                let w = f().filter((_) => _.focusable).map((_) => _.ref.current);
                if (y === "last") w.reverse();
                else if (y === "prev" || y === "next") {
                  y === "prev" && w.reverse();
                  const _ = w.indexOf(b.currentTarget);
                  w = d.loop ? _P(w, _ + 1) : w.slice(_ + 1);
                }
                setTimeout(() => Ov(w));
              }
            }),
            children: typeof s == "function" ? s({ isCurrentTabStop: l, hasTabStop: p != null }) : s
          }
        )
      }
    );
  }
);
Av.displayName = Nv;
var bP = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function SP(e, t) {
  return t !== "rtl" ? e : e === "ArrowLeft" ? "ArrowRight" : e === "ArrowRight" ? "ArrowLeft" : e;
}
function wP(e, t, n) {
  const r = SP(e.key, n);
  if (!(t === "vertical" && ["ArrowLeft", "ArrowRight"].includes(r)) && !(t === "horizontal" && ["ArrowUp", "ArrowDown"].includes(r)))
    return bP[r];
}
function Ov(e, t = !1) {
  const n = document.activeElement;
  for (const r of e)
    if (r === n || (r.focus({ preventScroll: t }), document.activeElement !== n)) return;
}
function _P(e, t) {
  return e.map((n, r) => e[(t + r) % e.length]);
}
var CP = Tv, xP = Av;
function EP(e) {
  const [t, n] = m.useState(void 0);
  return Vr(() => {
    if (e) {
      n({ width: e.offsetWidth, height: e.offsetHeight });
      const r = new ResizeObserver((o) => {
        if (!Array.isArray(o) || !o.length)
          return;
        const i = o[0];
        let s, a;
        if ("borderBoxSize" in i) {
          const c = i.borderBoxSize, u = Array.isArray(c) ? c[0] : c;
          s = u.inlineSize, a = u.blockSize;
        } else
          s = e.offsetWidth, a = e.offsetHeight;
        n({ width: s, height: a });
      });
      return r.observe(e, { box: "border-box" }), () => r.unobserve(e);
    } else
      n(void 0);
  }, [e]), t;
}
function RP(e) {
  const t = m.useRef({ value: e, previous: e });
  return m.useMemo(() => (t.current.value !== e && (t.current.previous = t.current.value, t.current.value = e), t.current.previous), [e]);
}
function IP(e, t) {
  return m.useReducer((n, r) => t[n][r] ?? n, e);
}
var Pv = (e) => {
  const { present: t, children: n } = e, r = TP(t), o = typeof n == "function" ? n({ present: r.isPresent }) : m.Children.only(n), i = NP(r.ref, AP(o));
  return typeof n == "function" || r.isPresent ? m.cloneElement(o, { ref: i }) : null;
};
Pv.displayName = "Presence";
function TP(e) {
  const [t, n] = m.useState(), r = m.useRef(null), o = m.useRef(e), i = m.useRef("none"), s = e ? "mounted" : "unmounted", [a, c] = IP(s, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  });
  return m.useEffect(() => {
    const u = ko(r.current);
    i.current = a === "mounted" ? u : "none";
  }, [a]), Vr(() => {
    const u = r.current, d = o.current;
    if (d !== e) {
      const f = i.current, g = ko(u);
      e ? c("MOUNT") : g === "none" || (u == null ? void 0 : u.display) === "none" ? c("UNMOUNT") : c(d && f !== g ? "ANIMATION_OUT" : "UNMOUNT"), o.current = e;
    }
  }, [e, c]), Vr(() => {
    if (t) {
      let u;
      const d = t.ownerDocument.defaultView ?? window, l = (g) => {
        const p = ko(r.current).includes(CSS.escape(g.animationName));
        if (g.target === t && p && (c("ANIMATION_END"), !o.current)) {
          const b = t.style.animationFillMode;
          t.style.animationFillMode = "forwards", u = d.setTimeout(() => {
            t.style.animationFillMode === "forwards" && (t.style.animationFillMode = b);
          });
        }
      }, f = (g) => {
        g.target === t && (i.current = ko(r.current));
      };
      return t.addEventListener("animationstart", f), t.addEventListener("animationcancel", l), t.addEventListener("animationend", l), () => {
        d.clearTimeout(u), t.removeEventListener("animationstart", f), t.removeEventListener("animationcancel", l), t.removeEventListener("animationend", l);
      };
    } else
      c("ANIMATION_END");
  }, [t, c]), {
    isPresent: ["mounted", "unmountSuspended"].includes(a),
    ref: m.useCallback((u) => {
      r.current = u ? getComputedStyle(u) : null, n(u);
    }, [])
  };
}
function Ed(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
function NP(...e) {
  const t = m.useRef(e);
  return t.current = e, m.useCallback((n) => {
    const r = t.current;
    let o = !1;
    const i = r.map((s) => {
      const a = Ed(s, n);
      return !o && typeof a == "function" && (o = !0), a;
    });
    if (o)
      return () => {
        for (let s = 0; s < i.length; s++) {
          const a = i[s];
          typeof a == "function" ? a() : Ed(r[s], null);
        }
      };
  }, []);
}
function ko(e) {
  return (e == null ? void 0 : e.animationName) || "none";
}
function AP(e) {
  var r, o;
  let t = (r = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : r.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
var Uc = "Radio", [OP, Mv] = Ni(Uc), [PP, Ai] = OP(Uc);
function kv(e) {
  const {
    __scopeRadio: t,
    checked: n = !1,
    children: r,
    disabled: o,
    form: i,
    name: s,
    onCheck: a,
    required: c,
    value: u = "on",
    // @ts-expect-error
    internal_do_not_use_render: d
  } = e, [l, f] = m.useState(null), [g, v] = m.useState(null), p = m.useRef(!1), b = l ? !!i || !!l.closest("form") : (
    // We set this to true by default so that events bubble to forms without JS (SSR)
    !0
  ), y = {
    checked: n,
    disabled: o,
    required: c,
    name: s,
    form: i,
    value: u,
    control: l,
    setControl: f,
    hasConsumerStoppedPropagationRef: p,
    isFormControl: b,
    bubbleInput: g,
    setBubbleInput: v,
    onCheck: () => a == null ? void 0 : a()
  };
  return /* @__PURE__ */ h(PP, { scope: t, ...y, children: kP(d) ? d(y) : r });
}
var Dv = "RadioTrigger", Hc = m.forwardRef(
  ({ __scopeRadio: e, onClick: t, ...n }, r) => {
    const {
      checked: o,
      disabled: i,
      value: s,
      setControl: a,
      onCheck: c,
      hasConsumerStoppedPropagationRef: u,
      isFormControl: d,
      bubbleInput: l
    } = Ai(Dv, e), f = Cn(r, a);
    return /* @__PURE__ */ h(
      yr.button,
      {
        type: "button",
        role: "radio",
        "aria-checked": o,
        "data-state": Vv(o),
        "data-disabled": i ? "" : void 0,
        disabled: i,
        value: s,
        ...n,
        ref: f,
        onClick: zt(t, (g) => {
          o || c(), l && d && (u.current = g.isPropagationStopped(), u.current || g.stopPropagation());
        })
      }
    );
  }
);
Hc.displayName = Dv;
var MP = m.forwardRef(
  (e, t) => {
    const { __scopeRadio: n, name: r, checked: o, required: i, disabled: s, value: a, onCheck: c, form: u, ...d } = e;
    return /* @__PURE__ */ h(
      kv,
      {
        __scopeRadio: n,
        checked: o,
        disabled: s,
        required: i,
        onCheck: c,
        name: r,
        form: u,
        value: a,
        internal_do_not_use_render: ({ isFormControl: l }) => /* @__PURE__ */ P(pe, { children: [
          /* @__PURE__ */ h(
            Hc,
            {
              ...d,
              ref: t,
              __scopeRadio: n
            }
          ),
          l && /* @__PURE__ */ h(
            Wc,
            {
              __scopeRadio: n
            }
          )
        ] })
      }
    );
  }
);
MP.displayName = Uc;
var $v = "RadioIndicator", Lv = m.forwardRef(
  (e, t) => {
    const { __scopeRadio: n, forceMount: r, ...o } = e, i = Ai($v, n);
    return /* @__PURE__ */ h(Pv, { present: r || i.checked, children: /* @__PURE__ */ h(
      yr.span,
      {
        "data-state": Vv(i.checked),
        "data-disabled": i.disabled ? "" : void 0,
        ...o,
        ref: t
      }
    ) });
  }
);
Lv.displayName = $v;
var Fv = "RadioBubbleInput", Wc = m.forwardRef(
  ({ __scopeRadio: e, ...t }, n) => {
    const {
      control: r,
      checked: o,
      required: i,
      disabled: s,
      name: a,
      value: c,
      form: u,
      bubbleInput: d,
      setBubbleInput: l,
      hasConsumerStoppedPropagationRef: f
    } = Ai(Fv, e), g = Cn(n, l), v = RP(o), p = EP(r);
    m.useEffect(() => {
      const y = d;
      if (!y) return;
      const S = window.HTMLInputElement.prototype, _ = Object.getOwnPropertyDescriptor(
        S,
        "checked"
      ).set, C = !f.current;
      if (v !== o && _) {
        const R = new Event("click", { bubbles: C });
        _.call(y, o), y.dispatchEvent(R);
      }
    }, [d, v, o, f]);
    const b = m.useRef(o);
    return /* @__PURE__ */ h(
      yr.input,
      {
        type: "radio",
        "aria-hidden": !0,
        defaultChecked: b.current,
        required: i,
        disabled: s,
        name: a,
        value: c,
        form: u,
        ...t,
        tabIndex: -1,
        ref: g,
        style: {
          ...t.style,
          ...p,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0,
          // We transform because the input is absolutely positioned but we have
          // rendered it **after** the button. This pulls it back to sit on top
          // of the button.
          transform: "translateX(-100%)"
        }
      }
    );
  }
);
Wc.displayName = Fv;
function kP(e) {
  return typeof e == "function";
}
function Vv(e) {
  return e ? "checked" : "unchecked";
}
var DP = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"], Oi = "RadioGroup", [$P] = Ni(Oi, [
  Iv,
  Mv
]), Bv = Iv(), Pi = Mv(), [LP, FP] = $P(Oi), Kc = m.forwardRef(
  (e, t) => {
    const {
      __scopeRadioGroup: n,
      name: r,
      defaultValue: o,
      value: i,
      required: s = !1,
      disabled: a = !1,
      orientation: c,
      dir: u,
      loop: d = !0,
      onValueChange: l,
      ...f
    } = e, g = Bv(n), v = Ev(u), [p, b] = xv({
      prop: i,
      defaultProp: o ?? null,
      onChange: l,
      caller: Oi
    });
    return /* @__PURE__ */ h(
      LP,
      {
        scope: n,
        name: r,
        required: s,
        disabled: a,
        value: p,
        onValueChange: b,
        children: /* @__PURE__ */ h(
          CP,
          {
            asChild: !0,
            ...g,
            orientation: c,
            dir: v,
            loop: d,
            children: /* @__PURE__ */ h(
              yr.div,
              {
                role: "radiogroup",
                "aria-required": s,
                "aria-orientation": c,
                "data-disabled": a ? "" : void 0,
                dir: v,
                ...f,
                ref: t
              }
            )
          }
        )
      }
    );
  }
);
Kc.displayName = Oi;
var VP = "RadioGroupItem", BP = "RadioGroupItemProvider", zv = "RadioGroupItemTrigger", zP = "RadioGroupItemBubbleInput";
function jP(e) {
  const {
    __scopeRadioGroup: t,
    value: n,
    disabled: r,
    children: o,
    // @ts-expect-error
    internal_do_not_use_render: i
  } = e, s = FP(BP, t), a = Pi(t), c = s.disabled || r;
  return /* @__PURE__ */ h(
    kv,
    {
      ...a,
      checked: s.value === n,
      disabled: c,
      required: s.required,
      name: s.name,
      value: n,
      onCheck: () => s.onValueChange(n),
      internal_do_not_use_render: i,
      children: o
    }
  );
}
var jv = m.forwardRef((e, t) => {
  const { __scopeRadioGroup: n, ...r } = e, o = Bv(n), i = Pi(n), { checked: s, disabled: a } = Ai(zv, i.__scopeRadio), c = m.useRef(null), u = Cn(t, c), d = m.useRef(!1);
  return m.useEffect(() => {
    const l = (g) => {
      DP.includes(g.key) && (d.current = !0);
    }, f = () => d.current = !1;
    return document.addEventListener("keydown", l), document.addEventListener("keyup", f), () => {
      document.removeEventListener("keydown", l), document.removeEventListener("keyup", f);
    };
  }, []), /* @__PURE__ */ h(
    xP,
    {
      asChild: !0,
      ...o,
      focusable: !a,
      active: s,
      children: /* @__PURE__ */ h(
        Hc,
        {
          ...i,
          ...r,
          ref: u,
          onKeyDown: zt(r.onKeyDown, (l) => {
            l.key === "Enter" && l.preventDefault();
          }),
          onFocus: zt(r.onFocus, () => {
            var l;
            d.current && ((l = c.current) == null || l.click());
          })
        }
      )
    }
  );
});
jv.displayName = zv;
var qc = m.forwardRef(
  (e, t) => {
    const { __scopeRadioGroup: n, value: r, disabled: o, ...i } = e;
    return /* @__PURE__ */ h(
      jP,
      {
        __scopeRadioGroup: n,
        value: r,
        disabled: o,
        internal_do_not_use_render: ({ isFormControl: s }) => /* @__PURE__ */ P(pe, { children: [
          /* @__PURE__ */ h(
            jv,
            {
              ...i,
              ref: t,
              __scopeRadioGroup: n
            }
          ),
          s && /* @__PURE__ */ h(
            Uv,
            {
              __scopeRadioGroup: n
            }
          )
        ] })
      }
    );
  }
);
qc.displayName = VP;
var Uv = m.forwardRef((e, t) => {
  const { __scopeRadioGroup: n, ...r } = e, o = Pi(n);
  return /* @__PURE__ */ h(Wc, { ...o, ...r, ref: t });
});
Uv.displayName = zP;
var UP = "RadioGroupIndicator", Hv = m.forwardRef(
  (e, t) => {
    const { __scopeRadioGroup: n, ...r } = e, o = Pi(n);
    return /* @__PURE__ */ h(Lv, { ...o, ...r, ref: t });
  }
);
Hv.displayName = UP;
function HP({ cameraId: e, background: t }) {
  const { client: n } = _e(), r = Re(n), o = ue(null), [i, s] = ne("loading"), a = ue(t);
  return oe(() => {
    a.current = t;
  }, [t]), oe(() => {
    const c = o.current;
    if (!r || !c) {
      s("error");
      return;
    }
    let u = !1;
    s("loading");
    const d = async () => {
      try {
        await r.previewVirtualBackground(c, a.current, !1, e ?? void 0), u || s("ready");
      } catch (f) {
        u || s("error"), console.error(f);
      }
    }, l = async () => {
      var f;
      try {
        await ((f = r.stopPreviewVirtualBackground) == null ? void 0 : f.call(r));
      } catch (g) {
        console.error(g);
      }
    };
    return d(), () => {
      u = !0, l();
    };
  }, [r, e]), { videoPlayerRef: o, status: i };
}
var WP = "gqk0oj0", Rd = "gqk0oj1", KP = "gqk0oj2", qP = "gqk0oj3", GP = "gqk0oj4", YP = "gqk0oj5", XP = "gqk0oj6";
const ZP = () => {
  const { t: e } = de(), t = B((a) => a.deviceState.activeCameraId), n = B((a) => a.videoState.vbImageId), r = B((a) => a.videoState.virtualBackgroundImageList), o = he(
    () => {
      var a;
      return ((a = r.find((c) => c.id === n)) == null ? void 0 : a.url) || void 0;
    },
    [n, r]
  ), { videoPlayerRef: i, status: s } = HP({ cameraId: t, background: o });
  return /* @__PURE__ */ P("div", { className: WP, "data-testid": "video-settings-preview", children: [
    /* @__PURE__ */ h("video-player-container", { style: { width: "100%", height: "100%" }, children: /* @__PURE__ */ h("div", { style: { width: "100%", height: "100%" }, children: /* @__PURE__ */ h("video-player", { ref: i, style: { width: "100%", height: "100%" } }) }) }),
    s === "loading" && /* @__PURE__ */ h("div", { className: Rd, children: /* @__PURE__ */ h(Tn, { size: 20, className: sr, "aria-hidden": "true" }) }),
    s === "error" && /* @__PURE__ */ P("div", { className: Rd, children: [
      /* @__PURE__ */ h(ka, { size: 22, "aria-hidden": "true" }),
      /* @__PURE__ */ h("span", { children: e("settings.video.preview_unavailable") })
    ] })
  ] });
}, JP = ({ value: e, label: t, imageUrl: n }) => {
  const [r, o] = ne(!1), i = q(() => o(!0), []);
  return r ? null : /* @__PURE__ */ P(qc, { className: qP, value: e, "aria-label": t, children: [
    e === "blur" && /* @__PURE__ */ h("span", { className: YP, "aria-hidden": "true" }),
    n ? /* @__PURE__ */ h("img", { src: n, alt: "", className: GP, onError: i }) : /* @__PURE__ */ h("span", { className: XP, children: t })
  ] });
}, Wv = ({ isMobile: e = !1 }) => {
  const { t } = de(), {
    videoState: n,
    canUseVirtualBackground: r,
    switchCamera: o,
    setMirrored: i,
    setHardwareAcceleration: s,
    setVirtualBackground: a
  } = hm(), c = B((y) => y.videoState.virtualBackgroundImageList), u = B((y) => y.deviceState), d = he(
    () => u.cameras.map((y) => ({
      value: y.deviceId,
      label: y.label || y.deviceId
    })),
    [u.cameras]
  ), l = he(
    () => c.map(({ id: y, name: S, url: w }) => y === "" ? { value: y, label: t("settings.video.background_none") } : y === "blur" ? { value: y, label: t("settings.video.background_blur") } : { value: y, label: S, imageUrl: w }),
    [c, t]
  ), f = q((y) => void o(y), [o]), g = q(
    (y) => void a(y),
    [a]
  ), v = q((y) => void i(y), [i]), p = q(
    (y) => void s({ decode: y }),
    [s]
  ), b = q(
    (y) => void s({ encode: y }),
    [s]
  );
  return /* @__PURE__ */ P("div", { className: X(wv, e && _v), children: [
    r && /* @__PURE__ */ h(ZP, {}),
    /* @__PURE__ */ P("div", { className: X(mn, e && Hn), children: [
      /* @__PURE__ */ h("div", { className: X(gn, e && Wn), children: t("settings.video.camera") }),
      /* @__PURE__ */ h(
        ga,
        {
          options: d,
          value: d.length === 0 ? "" : u.activeCameraId ?? "",
          onChange: f,
          disabled: u.isSwitchingCamera,
          ariaLabel: t("settings.video.camera"),
          emptyLabel: "Unrecognized device",
          isMobile: e
        }
      )
    ] }),
    r && /* @__PURE__ */ P("div", { className: mn, children: [
      /* @__PURE__ */ h("div", { className: gn, children: t("settings.video.virtual_background") }),
      /* @__PURE__ */ h(
        Kc,
        {
          className: KP,
          value: n.vbImageId,
          onValueChange: g,
          "aria-label": t("settings.video.virtual_background"),
          children: l.map(({ value: y, label: S, imageUrl: w }) => /* @__PURE__ */ h(JP, { value: y, label: S, imageUrl: w }, y))
        }
      )
    ] }),
    /* @__PURE__ */ P("div", { className: X(mn, e && Hn), children: [
      /* @__PURE__ */ h("div", { className: X(gn, e && Wn), children: t("settings.video.options") }),
      /* @__PURE__ */ h(
        Zn,
        {
          label: t("settings.video.mirror"),
          checked: n.isMirrored,
          onChange: v,
          isMobile: e
        }
      ),
      /* @__PURE__ */ h(
        Zn,
        {
          label: t("settings.video.hardware_acceleration_receiving"),
          checked: n.hardwareAccelerationReceiving,
          onChange: p,
          isMobile: e
        }
      ),
      /* @__PURE__ */ h(
        Zn,
        {
          label: t("settings.video.hardware_acceleration_sending"),
          checked: n.hardwareAccelerationSending,
          onChange: b,
          isMobile: e
        }
      )
    ] })
  ] });
}, Kn = {
  encoding: !1,
  sample_rate: 0,
  rtt: 0,
  jitter: 0,
  avg_loss: 0,
  max_loss: 0
}, Bn = { send: Kn, receive: Kn }, Rs = 2e3, zn = async (e) => {
  try {
    await e();
  } catch (t) {
    console.error(t);
  }
}, QP = (e) => {
  const { client: t } = _e(), n = Re(t), r = B((_) => _.audioState.isJoined), o = B((_) => _.audioState.isMuted), i = B((_) => _.videoState.isVideoOn), s = B((_) => _.shareState.isSharing), [a, c] = ne(Bn), [u, d] = ne(Bn), [l, f] = ne(Bn), g = ue(0), v = ue(0), p = ue(0), b = q((_) => {
    if (_ != null && _.data) {
      if (_.data.encoding) {
        c((C) => ({ ...C, send: _.data }));
        return;
      }
      c((C) => ({ ...C, receive: _.data })), clearTimeout(g.current), g.current = window.setTimeout(
        () => c((C) => ({ ...C, receive: Kn })),
        Rs
      );
    }
  }, []), y = q((_) => {
    if (_ != null && _.data) {
      if (_.data.encoding) {
        d((C) => ({ ...C, send: _.data }));
        return;
      }
      d((C) => ({ ...C, receive: _.data })), clearTimeout(v.current), v.current = window.setTimeout(
        () => d((C) => ({ ...C, receive: Kn })),
        Rs
      );
    }
  }, []), S = q((_) => {
    if (_ != null && _.data) {
      if (_.data.encoding) {
        f((C) => ({ ...C, send: _.data }));
        return;
      }
      f((C) => ({ ...C, receive: _.data })), clearTimeout(p.current), p.current = window.setTimeout(
        () => f((C) => ({ ...C, receive: Kn })),
        Rs
      );
    }
  }, []);
  oe(() => {
    if (c(Bn), !(!n || e !== "audio" || !r))
      return zn(() => n.subscribeAudioStatisticData()), () => {
        zn(() => n.unsubscribeAudioStatisticData()), clearTimeout(g.current);
      };
  }, [n, e, r]), oe(() => {
    if (d(Bn), !(!n || e !== "video"))
      return zn(() => n.subscribeVideoStatisticData()), () => {
        zn(() => n.unsubscribeVideoStatisticData()), clearTimeout(v.current);
      };
  }, [n, e]), oe(() => {
    if (f(Bn), !(!n || e !== "share"))
      return zn(() => n.subscribeShareStatisticData()), () => {
        zn(() => n.unsubscribeShareStatisticData()), clearTimeout(p.current);
      };
  }, [n, e]), oe(() => {
    if (t)
      return t.on("audio-statistic-data-change", b), t.on("video-statistic-data-change", y), t.on("share-statistic-data-change", S), () => {
        t.off("audio-statistic-data-change", b), t.off("video-statistic-data-change", y), t.off("share-statistic-data-change", S);
      };
  }, [t, b, y, S]);
  const w = { audio: r && !o, video: i, share: s }[e];
  return oe(() => {
    if (w) return;
    const _ = { audio: c, video: d, share: f }[e];
    _((C) => ({ ...C, send: Kn }));
  }, [e, w]), { audio: a, video: u, share: l }[e];
};
var eM = "_1ibhb5j0", tM = "_1ibhb5j1", nM = "_1ibhb5j2", rM = "_1ibhb5j3", oM = "_1ibhb5j4", iM = "_1ibhb5j5", sM = "_1ibhb5j6", aM = "_1ibhb5j7", cM = "_1ibhb5j8", lM = "_1ibhb5j9", uM = "_1ibhb5ja", dM = "_1ibhb5jb", Id = "_1ibhb5jc", Do = "_1ibhb5jd";
const Td = "-", Zt = (e) => {
  const t = Number(e);
  return Number.isFinite(t) && t !== 0 ? t : null;
}, Nd = (e) => `${(e / 1e3 * 100).toFixed(1)}%`, fM = "×", Is = {
  frequency: {
    labelKey: "settings.qos.frequency",
    cell: (e) => {
      const t = Zt(e.sample_rate);
      return t === null ? null : `${t} khz`;
    }
  },
  latency: {
    labelKey: "settings.qos.latency",
    cell: (e) => {
      const t = Zt(e.rtt);
      return t === null ? null : `${t} ms`;
    }
  },
  jitter: {
    labelKey: "settings.qos.jitter",
    cell: (e) => {
      const t = Zt(e.jitter);
      return t === null ? null : `${t} ms`;
    }
  },
  packet_loss: {
    labelKey: "settings.qos.packet_loss",
    cell: (e) => {
      const t = Zt(e.avg_loss), n = Zt(e.max_loss);
      return t === null || n === null ? null : `${Nd(t)} (${Nd(n)})`;
    }
  },
  resolution: {
    labelKey: "settings.qos.resolution",
    cell: (e) => {
      const t = Zt(e.width), n = Zt(e.height);
      return t === null || n === null ? null : `${t}${fM}${n}`;
    }
  },
  fps: {
    labelKey: "settings.qos.fps",
    cell: (e) => {
      const t = Zt(e.fps);
      return t === null ? null : `${t} fps`;
    }
  }
}, Ad = ["audio", "video", "share"], hM = {
  audio: ["frequency", "latency", "jitter", "packet_loss"],
  video: ["latency", "jitter", "packet_loss", "resolution", "fps"],
  share: ["latency", "jitter", "packet_loss", "resolution", "fps"]
}, Kv = ({ isMobile: e = !1 }) => {
  const { t } = de(), [n, r] = ne(Ad[0]), o = QP(n), i = q((a) => r(a), []), s = X(lM, e && Do);
  return /* @__PURE__ */ P(
    ia,
    {
      className: X(eM, e && rM),
      value: n,
      onValueChange: i,
      "data-testid": "statistics-settings",
      "data-mobile": e ? "true" : void 0,
      children: [
        /* @__PURE__ */ h(sa, { className: X(tM, e && oM), "aria-label": t("settings.tab.qos"), children: Ad.map((a) => /* @__PURE__ */ h(aa, { value: a, className: X(nM, e && iM), children: t(`settings.qos.${a}`) }, a)) }),
        /* @__PURE__ */ h(ca, { value: n, className: X(sM, e && aM), children: /* @__PURE__ */ P("table", { className: cM, children: [
          /* @__PURE__ */ h("thead", { children: /* @__PURE__ */ P("tr", { children: [
            /* @__PURE__ */ h("th", { className: s, children: t("settings.qos.item_name") }),
            /* @__PURE__ */ h("th", { className: s, children: t("settings.qos.send") }),
            /* @__PURE__ */ h("th", { className: s, children: t("settings.qos.receive") })
          ] }) }),
          /* @__PURE__ */ h("tbody", { children: hM[n].map((a) => /* @__PURE__ */ P("tr", { className: uM, "data-testid": `qos-row-${a}`, children: [
            /* @__PURE__ */ h("td", { className: X(dM, e && Do), children: t(Is[a].labelKey) }),
            /* @__PURE__ */ h("td", { className: X(Id, e && Do), children: Is[a].cell(o.send) ?? Td }),
            /* @__PURE__ */ h("td", { className: X(Id, e && Do), children: Is[a].cell(o.receive) ?? Td })
          ] }, a)) })
        ] }) })
      ]
    }
  );
}, Od = [
  { id: "audio", icon: /* @__PURE__ */ h(Mf, { size: 15 }) },
  { id: "video", icon: /* @__PURE__ */ h(Da, { size: 15 }) },
  { id: "share", icon: /* @__PURE__ */ h(ci, { size: 15 }) },
  { id: "qos", icon: /* @__PURE__ */ h(Nw, { size: 15 }) }
];
function pM({ activeTab: e, isConnected: t, testSoundUrl: n }) {
  if (!t) return /* @__PURE__ */ h(wc, { className: ed, testId: "settings-loading" });
  switch (e) {
    case "audio":
      return /* @__PURE__ */ h(Cv, { testSoundUrl: n });
    case "video":
      return /* @__PURE__ */ h(Wv, {});
    case "qos":
      return /* @__PURE__ */ h(Kv, {});
    default:
      return /* @__PURE__ */ h("div", { className: ed, children: "Settings coming soon" });
  }
}
function mM({ activeTab: e, isConnected: t, testSoundUrl: n }) {
  if (!t) return /* @__PURE__ */ h(wc, { className: td, testId: "settings-loading" });
  switch (e) {
    case "audio":
      return /* @__PURE__ */ h(Cv, { testSoundUrl: n, isMobile: !0 });
    case "video":
      return /* @__PURE__ */ h(Wv, { isMobile: !0 });
    case "qos":
      return /* @__PURE__ */ h(Kv, { isMobile: !0 });
    default:
      return /* @__PURE__ */ h("div", { className: td, children: "Settings coming soon" });
  }
}
function Pd({
  className: e,
  style: t,
  open: n = !0,
  isMobile: r = !1,
  onClose: o,
  activeTab: i,
  onTabChange: s,
  tabs: a,
  testSoundUrl: c
}) {
  var b, y;
  const u = Se(), { t: d } = de(), l = B((S) => S.sessionState.connectionState === we.Connected), f = he(
    () => (a && a.length > 0 ? a : Od.map((S) => S.id)).map((S) => {
      const w = Od.find((_) => _.id === S);
      return w ? { ...w, label: d(`settings.tab.${S}`) } : void 0;
    }).filter((S) => S !== void 0),
    [a, d]
  ), g = ((b = f[0]) == null ? void 0 : b.id) ?? "audio", v = i === void 0 ? void 0 : ((y = f.find((S) => S.id === i)) == null ? void 0 : y.id) ?? g, p = q((S) => s == null ? void 0 : s(S), [s]);
  return r && !n ? null : r ? /* @__PURE__ */ h("div", { "data-theme": u, className: X(eN, e), style: t, "data-testid": "settings-panel", children: /* @__PURE__ */ h(
    Lr,
    {
      title: d("toolbar.settings"),
      open: n,
      isMobile: !0,
      onClose: o,
      closeLabel: d("common.close"),
      testId: "settings-panel",
      children: /* @__PURE__ */ P(
        ia,
        {
          className: tN,
          value: v,
          defaultValue: g,
          onValueChange: p,
          orientation: "horizontal",
          children: [
            /* @__PURE__ */ h(sa, { className: nN, "aria-label": d("settings.tabs_label"), children: f.map((S) => /* @__PURE__ */ P(aa, { value: S.id, className: rN, children: [
              S.icon,
              S.label
            ] }, S.id)) }),
            f.map((S) => /* @__PURE__ */ h(ca, { value: S.id, className: oN, children: /* @__PURE__ */ h(mM, { activeTab: S.id, isConnected: l, testSoundUrl: c }) }, S.id))
          ]
        }
      )
    }
  ) }) : /* @__PURE__ */ h(
    Lr,
    {
      title: d("toolbar.settings"),
      className: X(YT, e),
      style: t,
      open: n,
      onClose: o,
      closeLabel: d("common.close"),
      testId: "settings-panel",
      children: /* @__PURE__ */ P(
        ia,
        {
          className: XT,
          value: v,
          defaultValue: g,
          onValueChange: p,
          orientation: "vertical",
          children: [
            /* @__PURE__ */ h(sa, { className: ZT, "aria-label": d("settings.tabs_label"), children: f.map((S) => /* @__PURE__ */ P(aa, { value: S.id, className: JT(), children: [
              S.icon,
              S.label
            ] }, S.id)) }),
            f.map((S) => /* @__PURE__ */ h(ca, { value: S.id, className: QT, children: /* @__PURE__ */ h(pM, { activeTab: S.id, isConnected: l, testSoundUrl: c }) }, S.id))
          ]
        }
      )
    }
  );
}
var gM = "dl88zh0 _14sdsl3b _14sdsl39";
function vM({
  className: e,
  style: t,
  renderContent: n,
  onOpen: r,
  onClose: o,
  isMobile: i,
  panelClassName: s,
  panelStyle: a,
  anchor: c,
  panelProps: u,
  popoverProps: d
}) {
  const { t: l } = de(), f = Se(), g = Ye(), v = B((N) => N.sessionState), [p, b] = ne(!1), [y, S] = ne("audio"), w = ue(null), _ = En(), C = q((N) => S(N), []), R = v.connectionState === we.Connected, x = () => /* @__PURE__ */ h(S_, { size: 18 }), E = q(() => {
    b(!0), r == null || r();
  }, [r]), I = q(() => {
    b(!1), o == null || o();
  }, [o]), M = /* @__PURE__ */ h(
    Pd,
    {
      ...u,
      className: s,
      style: a,
      activeTab: y,
      onTabChange: C,
      open: !0,
      onClose: I
    }
  );
  return i ? /* @__PURE__ */ P(fr, { open: p, onOpenChange: (N) => N ? E() : I(), autoFocus: !0, children: [
    /* @__PURE__ */ h(Ae.Trigger, { asChild: !0, children: /* @__PURE__ */ h(
      le,
      {
        kind: n ? "text" : "icon",
        className: e,
        style: t,
        size: "sm",
        active: p,
        disabled: !R,
        "aria-haspopup": "dialog",
        "aria-label": l("toolbar.settings"),
        "data-testid": "settings-button",
        children: (n ?? x)()
      }
    ) }),
    /* @__PURE__ */ P(Ae.Portal, { children: [
      /* @__PURE__ */ h(hr, { className: ar, "data-theme": f }),
      /* @__PURE__ */ P(
        Ae.Content,
        {
          style: g,
          className: gM,
          "aria-describedby": void 0,
          "data-theme": f,
          children: [
            /* @__PURE__ */ h("div", { className: Ur, "aria-hidden": "true" }),
            /* @__PURE__ */ h(Ae.Title, { className: Hr, children: l("toolbar.settings") }),
            /* @__PURE__ */ h(
              Pd,
              {
                ...u,
                className: s,
                style: a,
                activeTab: y,
                onTabChange: C,
                isMobile: !0,
                onClose: () => b(!1)
              }
            )
          ]
        }
      )
    ] })
  ] }) : /* @__PURE__ */ P(pe, { children: [
    /* @__PURE__ */ h(
      le,
      {
        kind: n ? "text" : "icon",
        ref: w,
        className: e,
        style: t,
        size: "sm",
        active: p,
        disabled: !R,
        "aria-haspopup": "dialog",
        "aria-label": l("toolbar.settings"),
        "aria-expanded": p,
        "aria-controls": p ? _ : void 0,
        "data-testid": "settings-button",
        onClick: () => p ? I() : E(),
        children: (n ?? x)()
      }
    ),
    p && /* @__PURE__ */ h(
      Ci,
      {
        open: !0,
        triggerRef: w,
        anchor: c,
        id: _,
        "aria-label": l("toolbar.settings"),
        side: (d == null ? void 0 : d.side) ?? "top",
        align: (d == null ? void 0 : d.align) ?? "start",
        sideOffset: (d == null ? void 0 : d.sideOffset) ?? 8,
        alignOffset: d == null ? void 0 : d.alignOffset,
        collisionPadding: (d == null ? void 0 : d.collisionPadding) ?? 12,
        children: M
      }
    )
  ] });
}
function so() {
  return typeof navigator > "u" ? !1 : !!(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || /Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
}
var yM = St({ defaultClassName: "_1ebc7mo0", variantClassNames: { mobile: { true: "_1ebc7mo1", false: "_1ebc7mo2" }, isHorizontal: { true: "_1ebc7mo3", false: "_1ebc7mo4" } }, defaultVariants: { mobile: !1 }, compoundVariants: [] }), Ts = St({ defaultClassName: "_1ebc7mo5", variantClassNames: { isHorizontal: { true: "_1ebc7mo6", false: "_1ebc7mo7" }, mobile: { true: "_1ebc7mo8", false: "_1ebc7mo9" } }, defaultVariants: { mobile: !1 }, compoundVariants: [] }), bM = St({ defaultClassName: "_1ebc7moa", variantClassNames: { isHorizontal: { true: "_1ebc7mob", false: "_1ebc7moc" } }, defaultVariants: {}, compoundVariants: [] }), SM = "_1ebc7mod", wM = "_1ebc7moe";
St({ defaultClassName: "_1ebc7mof", variantClassNames: { tone: { neutral: "_1ebc7mog", danger: "_1ebc7moh", accent: "_1ebc7moi" }, decorative: { true: "_1ebc7moj", false: "_1ebc7mok" } }, defaultVariants: { tone: "neutral", decorative: !1 }, compoundVariants: [] });
St({ defaultClassName: "_1ebc7mom", variantClassNames: { tone: { neutral: "_1ebc7mon", danger: "_1ebc7moo", accent: "_1ebc7mop" }, decorative: { true: "_1ebc7moq", false: "_1ebc7mor" } }, defaultVariants: { tone: "neutral", decorative: !1 }, compoundVariants: [] });
var _M = "mcpvp13", CM = "mcpvp14", xM = "mcpvp15", EM = "mcpvp16", RM = "mcpvp17", IM = "mcpvp18", TM = "mcpvp19", Ns = "mcpvp1a", NM = "mcpvp1b";
const AM = () => {
  const { client: e } = _e(), t = B((g) => g.shareState.annotation), n = B((g) => g.setAnnotationState), { isAnnotationStarted: r, canDoAnnotation: o, canRedo: i, canUndo: s, isEnableViewerAnnotation: a, isShowAnnotatorName: c } = t, u = q(async () => {
    const g = Re(e);
    if (!(!g || r))
      try {
        await g.startAnnotation(), n({ isAnnotationStarted: !0 });
      } catch (v) {
        console.error(v);
      }
  }, [e, r, n]), d = q(async () => {
    const g = Re(e);
    if (!(!g || !r))
      try {
        await g.stopAnnotation(), n({ isAnnotationStarted: !1 });
      } catch (v) {
        console.error(v);
      }
  }, [e, r, n]), l = q(
    async (g) => {
      const v = Re(e);
      if (v)
        try {
          await v.changeAnnotationPrivilege(g), n({ isEnableViewerAnnotation: g });
        } catch (p) {
          console.error(p);
        }
    },
    [e, n]
  ), f = q(
    async (g) => {
      const v = Re(e);
      if (v)
        try {
          await v.showAnnotatorName(g), n({ isShowAnnotatorName: g });
        } catch (p) {
          console.error(p);
        }
    },
    [e, n]
  );
  return {
    startAnnotation: u,
    stopAnnotation: d,
    changeAnnotationPrivilege: l,
    showAnnotatorName: f,
    isAnnotationStarted: r,
    canDoAnnotation: o,
    canRedo: i,
    canUndo: s,
    isEnableViewerAnnotation: a,
    isShowAnnotatorName: c
  };
}, Md = "zui-share-presenter-drag-handle", kd = "zui-share-presenter-no-drag";
function OM() {
  const { t: e } = de(), t = Se(), n = Ye(), {
    isSharing: r,
    isSharingPaused: o,
    isSupportOptimizedForSharedVideo: i,
    isEnableOptimizeForSharedVideo: s,
    sharePrivilege: a,
    pauseShare: c,
    resumeShare: u,
    stopShare: d,
    toggleOptimizeForSharedVideo: l
  } = dc(), { changeAnnotationPrivilege: f, showAnnotatorName: g, isShowAnnotatorName: v, isEnableViewerAnnotation: p } = AM(), b = ue(null);
  return r ? /* @__PURE__ */ h(In, { children: /* @__PURE__ */ h("div", { className: _M, style: n, "data-theme": t, children: /* @__PURE__ */ h(bc, { nodeRef: b, handle: `.${Md}`, cancel: `.${kd}`, bounds: "parent", children: /* @__PURE__ */ P("div", { ref: b, className: CM, "data-testid": "share-presenter-control", children: [
    /* @__PURE__ */ P(
      "div",
      {
        className: X(Md, xM),
        role: "button",
        tabIndex: -1,
        "aria-label": e("share.move_controls"),
        children: [
          /* @__PURE__ */ h(ci, { "aria-hidden": "true", className: EM, size: 18 }),
          /* @__PURE__ */ h("span", { className: RM, children: e("share.presenter_status") }),
          /* @__PURE__ */ P(Jr, { modal: !1, children: [
            /* @__PURE__ */ h(Qr, { asChild: !0, children: /* @__PURE__ */ h(
              le,
              {
                kind: "icon",
                appearance: "quiet",
                type: "button",
                className: kd,
                "aria-label": e("share.share_options"),
                children: /* @__PURE__ */ h(Pa, { "aria-hidden": "true", size: Ie.iconSize })
              }
            ) }),
            /* @__PURE__ */ h(ur, { children: /* @__PURE__ */ P(
              eo,
              {
                style: n,
                className: TM,
                "data-theme": t,
                align: "start",
                sideOffset: 14,
                collisionPadding: 8,
                children: [
                  i && a !== Ot.MultipleShare && /* @__PURE__ */ P(pe, { children: [
                    /* @__PURE__ */ h(nt, { asChild: !0, layout: "leading", children: /* @__PURE__ */ P(
                      is,
                      {
                        checked: s,
                        onCheckedChange: l,
                        onSelect: (y) => y.preventDefault(),
                        children: [
                          /* @__PURE__ */ h("span", { className: Ns, children: /* @__PURE__ */ h(Xn, { children: /* @__PURE__ */ h(yt, { "aria-hidden": "true", size: 14 }) }) }),
                          /* @__PURE__ */ h("span", { children: e("share.optimize_for_video_clip") })
                        ]
                      }
                    ) }),
                    /* @__PURE__ */ h(Wp, { className: NM })
                  ] }),
                  /* @__PURE__ */ h(nt, { asChild: !0, layout: "leading", children: /* @__PURE__ */ P(
                    is,
                    {
                      checked: !p,
                      onCheckedChange: () => f(!p),
                      onSelect: (y) => y.preventDefault(),
                      children: [
                        /* @__PURE__ */ h("span", { className: Ns, children: /* @__PURE__ */ h(Xn, { children: /* @__PURE__ */ h(yt, { "aria-hidden": "true", size: 14 }) }) }),
                        /* @__PURE__ */ h("span", { children: e("share.disable_annotation_for_others") })
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ h(nt, { asChild: !0, layout: "leading", children: /* @__PURE__ */ P(
                    is,
                    {
                      checked: !v,
                      onCheckedChange: () => g(!v),
                      onSelect: (y) => y.preventDefault(),
                      children: [
                        /* @__PURE__ */ h("span", { className: Ns, children: /* @__PURE__ */ h(Xn, { children: /* @__PURE__ */ h(yt, { "aria-hidden": "true", size: 14 }) }) }),
                        /* @__PURE__ */ h("span", { children: e("share.hide_names_of_annotators") })
                      ]
                    }
                  ) })
                ]
              }
            ) })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ h(
      le,
      {
        kind: "icon",
        type: "button",
        "aria-label": e(o ? "share.resume_share" : "share.pause_share"),
        onClick: () => void (o ? u() : c()),
        children: o ? /* @__PURE__ */ h($f, { "aria-hidden": "true", size: Ie.iconSize }) : /* @__PURE__ */ h(c_, { "aria-hidden": "true", size: Ie.iconSize })
      }
    ),
    /* @__PURE__ */ P(le, { tone: "danger", type: "button", onClick: () => void d(), children: [
      /* @__PURE__ */ h("span", { className: IM, "aria-hidden": "true" }),
      e("share.stop_share")
    ] })
  ] }) }) }) }) : null;
}
var PM = "nokupr0", MM = "nokupr1", kM = "nokupr2", DM = "nokupr3", $M = "nokupr4";
const LM = [
  { value: Ot.Unlocked, labelKey: "share.privilege_one_at_a_time" },
  { value: Ot.Locked, labelKey: "share.privilege_host_only" },
  { value: Ot.MultipleShare, labelKey: "share.privilege_multiple" }
];
function FM({ open: e, onOpenChange: t }) {
  const { t: n } = de(), { sharePrivilege: r, changeSharePrivilege: o } = dc(), i = En();
  return /* @__PURE__ */ h(Sn, { open: e, onOpenChange: t, title: n("share.advanced_options"), children: /* @__PURE__ */ h(
    Kc,
    {
      className: PM,
      value: String(r),
      onValueChange: (s) => {
        o(Number(s));
      },
      children: LM.map((s) => {
        const a = `${i}-${s.value}`;
        return /* @__PURE__ */ P("div", { className: MM, children: [
          /* @__PURE__ */ h(qc, { className: kM, value: String(s.value), id: a, children: /* @__PURE__ */ h(Hv, { className: DM }) }),
          /* @__PURE__ */ h("label", { className: $M, htmlFor: a, children: n(s.labelKey) })
        ] }, s.value);
      })
    }
  ) });
}
var VM = "_8w0me60 _14sdsl3l";
function BM({ showPresenterControl: e = !0, ...t }) {
  const n = B((i) => i.sessionState.connectionState), r = dc(), o = n === we.Connected;
  return /* @__PURE__ */ P(pe, { children: [
    /* @__PURE__ */ h(zM, { ...t, ...r, isConnected: o }),
    e && o && r.isSharing && /* @__PURE__ */ h(OM, {})
  ] });
}
function zM({
  className: e,
  style: t,
  showMenu: n = !0,
  menuGroups: r,
  dropdownOptions: o,
  renderContent: i,
  isSharing: s,
  sharePrivilege: a,
  canChangeSharePrivilege: c,
  toggleShare: u,
  changeSharePrivilege: d,
  isConnected: l
}) {
  const { t: f } = de(), [g, v] = ne(!1), p = f(s ? "share.stop_share" : "share.share_screen"), b = f("share.share_options"), y = r ?? [], S = y.length > 0, w = so(), _ = !l || w, C = !l || w || !c && !S, R = s ? "sharing" : "idle", x = {
    isSharing: s,
    sharePrivilege: a,
    canChangeSharePrivilege: c,
    label: p,
    menuLabel: b,
    isDisabled: _,
    isMenuTriggerDisabled: C,
    toggleShare: u,
    changeSharePrivilege: d
  }, I = [...c ? [
    {
      id: "share-privilege",
      selectionMode: "single",
      items: [
        {
          id: "privilege-unlocked",
          label: f("share.privilege_one_at_a_time"),
          selected: a === Ot.Unlocked,
          onSelect: () => {
            d(Ot.Unlocked);
          }
        },
        {
          id: "privilege-multiple",
          label: f("share.privilege_multiple"),
          selected: a === Ot.MultipleShare,
          onSelect: () => {
            d(Ot.MultipleShare);
          }
        }
      ]
    },
    {
      id: "share-advanced",
      items: [
        {
          id: "advanced-sharing-options",
          label: f("share.advanced_options"),
          onSelect: () => {
            v(!0);
          }
        }
      ]
    }
  ] : [], ...y], M = n && l && (c || S), N = jM(i, x, R), $ = /* @__PURE__ */ h(ci, { "aria-hidden": "true", size: 18 });
  return /* @__PURE__ */ P(pe, { children: [
    /* @__PURE__ */ h(
      $a,
      {
        className: e,
        style: t,
        contentSized: N !== void 0,
        buttonProps: {
          "aria-label": p,
          "aria-pressed": s,
          "data-testid": "share-button",
          disabled: _,
          onClick: () => {
            u();
          }
        },
        menu: M ? /* @__PURE__ */ h(
          er,
          {
            label: b,
            triggerDisabled: C,
            groups: I,
            dropdownOptions: o
          }
        ) : void 0,
        children: N === void 0 ? s ? /* @__PURE__ */ h("span", { className: VM, children: $ }) : $ : N
      }
    ),
    c && /* @__PURE__ */ h(FM, { open: g, onOpenChange: v })
  ] });
}
function jM(e, t, n) {
  if (!e)
    return;
  const r = e[n];
  return typeof r == "function" ? r(t) : r;
}
var UM = "_1uvngxs0", HM = "_1uvngxs1", WM = "_1uvngxs2", KM = "_1uvngxs3", Dd = "_1uvngxs4", qM = "_1uvngxs5", GM = "_1uvngxs6", YM = "_1uvngxs7", XM = "_1uvngxs8", ZM = "_1uvngxs9", JM = "_1uvngxsa", QM = "_1uvngxsb", ek = "_1uvngxsc", tk = "_1uvngxsd", nk = "_1uvngxse";
function rk({
  message: e,
  currentUserId: t,
  showHeader: n,
  isMobile: r = !1,
  onDelete: o,
  bubbleStyles: i
}) {
  const { t: s } = de(), a = ue(null), c = e.sender.userId === t, u = c ? s("common.you") : e.sender.name || "?", d = e.receiver.userId === qd.All ? s("chat.everyone") : e.receiver.name || s("chat.everyone"), l = new Date(e.timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), f = /* @__PURE__ */ h(
    "span",
    {
      className: X(ZM, c && tk),
      style: c ? i == null ? void 0 : i.outgoing : i == null ? void 0 : i.incoming,
      children: /* @__PURE__ */ h("span", { className: nk, dir: "auto", children: e.message })
    }
  );
  return /* @__PURE__ */ P("article", { className: UM, "data-testid": "chat-message", children: [
    n ? /* @__PURE__ */ P("div", { className: HM, children: [
      /* @__PURE__ */ h("strong", { className: WM, children: u }),
      /* @__PURE__ */ h("span", { className: Dd, children: s("chat.to_receiver") }),
      /* @__PURE__ */ h("span", { className: KM, children: d }),
      /* @__PURE__ */ h("time", { className: Dd, dateTime: new Date(e.timestamp).toISOString(), children: l })
    ] }) : null,
    /* @__PURE__ */ P("div", { className: n ? qM : GM, children: [
      n ? /* @__PURE__ */ h("div", { className: YM, "aria-hidden": "true", children: e.sender.avatar ? /* @__PURE__ */ h("img", { className: XM, src: e.sender.avatar, alt: "" }) : gc(e.sender.name) || "?" }) : null,
      /* @__PURE__ */ P("div", { className: JM, children: [
        r && o ? /* @__PURE__ */ h(
          Fm,
          {
            label: s("chat.message_actions"),
            isMobile: !0,
            closeLabel: s("common.cancel"),
            trigger: /* @__PURE__ */ h(
              "button",
              {
                ref: a,
                type: "button",
                "aria-label": `${e.message} — ${s("chat.message_actions")}`,
                className: ek,
                children: f
              }
            ),
            items: [
              {
                id: "delete",
                icon: /* @__PURE__ */ h(Bl, { size: 16, "aria-hidden": "true" }),
                text: s("common.delete"),
                danger: !0,
                onClick: () => o(e, a.current)
              }
            ]
          }
        ) : f,
        !r && o && /* @__PURE__ */ h(
          le,
          {
            kind: "icon",
            appearance: "quiet",
            ref: a,
            type: "button",
            className: QM,
            "aria-label": s("chat.delete_message"),
            title: s("chat.delete_message"),
            "aria-haspopup": "dialog",
            onClick: () => o(e, a.current),
            children: /* @__PURE__ */ h(Bl, { size: 18, "aria-hidden": "true" })
          }
        )
      ] })
    ] })
  ] });
}
var ok = "rbi1v60", ik = "rbi1v61", sk = "rbi1v62", ak = "rbi1v63", ck = "rbi1v64", lk = "rbi1v65", uk = "rbi1v66", dk = "rbi1v67", fk = "rbi1v68", hk = "rbi1v69", pk = "rbi1v6a", mk = "rbi1v6b", gk = "rbi1v6c", vk = "rbi1v6d", yk = "rbi1v6e", bk = "rbi1v6f";
const Sk = 1024, wk = 58, _k = 6e4;
let Ck = 0;
function xk(e, t) {
  return e.id ?? `${e.timestamp}-${e.sender.userId}-${e.receiver.userId}-${t}`;
}
function Ek(e, t) {
  const n = e[t], r = e[t - 1];
  return !r || r.sender.userId !== n.sender.userId || r.receiver.userId !== n.receiver.userId || Math.abs(n.timestamp - r.timestamp) >= _k;
}
function $d({
  className: e,
  style: t,
  isMobile: n = !1,
  onClose: r,
  onMessageSent: o,
  messageBubbleStyles: i
}) {
  var re;
  const { t: s } = de(), { client: a } = _e(), c = bf(a), u = B((Y) => Y.sessionState.connectionState === we.Connected), d = B((Y) => Y.chatState), l = B((Y) => Y.participantState.currentUser), f = B((Y) => Y.markChatRead), g = u && d.isAvailable && !!c, v = B((Y) => Y.setChatState), { draftMessage: p, receiverId: b, pendingSendId: y } = d, S = y !== null, [w, _] = ne(null), [C, R] = ne(!1), x = ue(null), [E, I] = ne(!1), M = ue(null), [N, $] = ne(null), T = ue(!0), O = ue(!1), F = he(
    () => d.messages.filter((Y) => !!Y.message),
    [d.messages]
  ), A = he(
    () => d.receivers.map((Y) => ({
      value: String(Y.userId),
      label: Y.displayName
    })),
    [d.receivers]
  ), D = q((Y) => xk(F[Y], Y), [F]), V = q((Y) => {
    M.current = Y, $(Y);
  }, []), z = Sc({
    count: F.length,
    scrollElement: N,
    rowHeight: wk,
    overscan: 8,
    getItemKey: D
  }), L = g && !!(l != null && l.isHost || l != null && l.isManager), j = g && A.length > 0, Z = (Y) => !!(g && Y.id && typeof (c == null ? void 0 : c.deleteMessage) == "function" && l && (l.isHost || l.isManager || l.userId === Y.sender.userId)), K = !!(w && Z(w) && d.messages.some((Y) => Y.id === w.id)), G = ((re = A.find((Y) => Y.value === b)) == null ? void 0 : re.label) ?? s("chat.no_receivers"), J = he(
    () => [
      {
        id: "chat-receivers",
        selectionMode: "single",
        items: A.map((Y) => ({
          id: Y.value,
          label: Y.label,
          selected: Y.value === b,
          onSelect: () => {
            Y.value !== b && v({ receiverId: Y.value, pendingSendId: null });
          }
        }))
      }
    ],
    [b, A, v]
  ), te = he(
    () => [
      {
        id: "chat-privilege",
        label: s("chat.privilege_label"),
        selectionMode: "single",
        items: [
          { id: "none", privilege: $o.NoOne, label: s("chat.privilege_none") },
          { id: "public", privilege: $o.EveryonePublicly, label: s("chat.privilege_public") },
          { id: "all", privilege: $o.All, label: s("chat.privilege_all") }
        ].map((Y) => ({
          id: Y.id,
          label: Y.label,
          selected: Y.privilege === d.privilege,
          onSelect: async () => {
            if (c)
              try {
                await c.setPrivilege(Y.privilege);
              } catch (ye) {
                Ve.error(Or(ye));
              }
          }
        }))
      }
    ],
    [c, d.privilege, s]
  ), U = q(() => {
    const Y = M.current;
    if (!Y || F.length === 0) {
      f();
      return;
    }
    const ye = Y.scrollHeight - Y.scrollTop - Y.clientHeight < 24;
    O.current = !ye, I(!1), Y.scrollTop = Y.scrollHeight, requestAnimationFrame(() => {
      Y.scrollTop = Y.scrollHeight, O.current = !1;
    }), T.current = !0, f();
  }, [f, F.length]);
  oe(() => {
    K || _(null);
  }, [K]), oe(() => {
    var ye;
    A.some((De) => De.value === b) || v({ draftMessage: "", receiverId: ((ye = A[0]) == null ? void 0 : ye.value) ?? "", pendingSendId: null });
  }, [b, A, v]), oe(() => {
    T.current ? requestAnimationFrame(U) : F.length > 0 && !O.current && I(!0);
  }, [U, F.length]);
  const H = () => {
    const Y = M.current;
    if (!Y) return;
    const ye = Y.scrollHeight - Y.scrollTop - Y.clientHeight < 24;
    T.current = ye, ye ? (O.current = !1, I(!1), f()) : O.current || I(!0);
  }, Q = () => {
    O.current = !1;
  }, ee = async () => {
    const { draftMessage: Y, receiverId: ye, pendingSendId: De } = B.getState().chatState, at = Y.trim(), Oe = Number(ye);
    if (!at || !j || !c || !Number.isFinite(Oe) || De !== null) return;
    const ht = ++Ck;
    v({ pendingSendId: ht });
    try {
      Oe === qd.All ? await c.sendToAll(at) : await c.send(at, Oe), B.getState().chatState.pendingSendId === ht && v({ draftMessage: "", pendingSendId: null }), o == null || o(at, Oe), requestAnimationFrame(U);
    } catch (On) {
      B.getState().chatState.pendingSendId === ht && v({ pendingSendId: null }), Ve.error(Or(On));
    }
  }, ie = (Y, ye) => {
    C || (x.current = ye, _(Y));
  }, W = async () => {
    if (!(!K || !(w != null && w.id) || !c || C)) {
      R(!0);
      try {
        await c.deleteMessage(w.id), x.current = null, _(null);
      } catch (Y) {
        Ve.error(s("chat.delete_message_failed"), { description: Or(Y) });
      } finally {
        R(!1);
      }
    }
  }, ge = (Y) => {
    Y.key === "Enter" && !Y.shiftKey && !Y.nativeEvent.isComposing && (Y.preventDefault(), ee());
  };
  return /* @__PURE__ */ P(
    Lr,
    {
      title: s("chat.title"),
      className: n ? void 0 : X(ik, e),
      style: n ? void 0 : t,
      open: !0,
      isMobile: n,
      onClose: r,
      closeLabel: s("common.close"),
      testId: "chat-panel",
      children: [
        /* @__PURE__ */ P(
          "div",
          {
            className: X(ak, n && sk, n && e),
            style: n ? t : void 0,
            children: [
              /* @__PURE__ */ h(
                "div",
                {
                  ref: V,
                  className: ck,
                  role: "log",
                  tabIndex: -1,
                  "aria-live": "polite",
                  "aria-label": s("chat.message_history"),
                  onScroll: H,
                  onWheel: Q,
                  onPointerDown: Q,
                  onTouchStart: Q,
                  children: /* @__PURE__ */ h("div", { className: lk, style: { height: z.getTotalSize() }, children: z.getVirtualItems().map((Y) => {
                    const ye = F[Y.index];
                    return /* @__PURE__ */ h(
                      "div",
                      {
                        ref: z.measureElement,
                        "data-index": Y.index,
                        style: {
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          transform: `translateY(${Y.start}px)`
                        },
                        children: /* @__PURE__ */ h(
                          rk,
                          {
                            message: ye,
                            isMobile: n,
                            currentUserId: l == null ? void 0 : l.userId,
                            showHeader: Ek(F, Y.index),
                            onDelete: Z(ye) ? ie : void 0,
                            bubbleStyles: i
                          }
                        )
                      },
                      Y.key
                    );
                  }) })
                }
              ),
              /* @__PURE__ */ P("div", { className: X(uk, n && dk), children: [
                /* @__PURE__ */ P("div", { className: fk, children: [
                  /* @__PURE__ */ h("span", { children: s("chat.to") }),
                  /* @__PURE__ */ h("div", { className: hk, children: /* @__PURE__ */ h(
                    er,
                    {
                      label: s("chat.receiver_label"),
                      groups: J,
                      trigger: /* @__PURE__ */ h(
                        le,
                        {
                          tone: "accent",
                          type: "button",
                          className: pk,
                          "aria-label": `${s("chat.receiver_label")}: ${G}`,
                          children: /* @__PURE__ */ h("span", { className: mk, children: G })
                        }
                      ),
                      triggerDisabled: !j,
                      dropdownOptions: {
                        side: "top"
                      },
                      isMobile: n
                    }
                  ) })
                ] }),
                /* @__PURE__ */ h(
                  "textarea",
                  {
                    className: gk,
                    value: p,
                    onChange: (Y) => v({ draftMessage: Y.target.value, pendingSendId: null }),
                    onKeyDown: ge,
                    disabled: !j,
                    readOnly: S,
                    "aria-busy": S,
                    maxLength: Sk,
                    rows: 2,
                    placeholder: s(j ? "chat.message_placeholder" : "chat.disabled"),
                    "aria-label": s("chat.message_input"),
                    autoComplete: "off",
                    "data-testid": "chat-message-input"
                  }
                ),
                /* @__PURE__ */ P("div", { className: vk, children: [
                  /* @__PURE__ */ h("div", { className: yk, children: L ? /* @__PURE__ */ h(
                    er,
                    {
                      label: s("chat.more_options"),
                      groups: te,
                      trigger: /* @__PURE__ */ h(le, { kind: "icon", appearance: "quiet", "aria-label": s("chat.more_options"), children: /* @__PURE__ */ h(Pa, { size: Ie.iconSize, strokeWidth: 1.8, "aria-hidden": "true" }) }),
                      dropdownOptions: { side: "top", align: "start", sideOffset: 8 },
                      isMobile: n
                    }
                  ) : null }),
                  /* @__PURE__ */ h(
                    le,
                    {
                      kind: "icon",
                      appearance: "quiet",
                      tone: "accent",
                      type: "button",
                      onClick: () => void ee(),
                      disabled: !j || S || p.trim().length === 0,
                      "aria-label": s("chat.send"),
                      "data-testid": "chat-send-button",
                      children: /* @__PURE__ */ h(y_, { size: Ie.iconSize, strokeWidth: 1.8, "aria-hidden": "true" })
                    }
                  )
                ] }),
                E ? /* @__PURE__ */ h(
                  le,
                  {
                    kind: "icon",
                    tone: "accent",
                    type: "button",
                    className: bk,
                    onClick: U,
                    "aria-label": s("chat.jump_to_latest"),
                    children: /* @__PURE__ */ h(Wr, { size: 18, "aria-hidden": "true" })
                  }
                ) : null
              ] })
            ]
          }
        ),
        /* @__PURE__ */ h(
          Sn,
          {
            open: w !== null,
            onOpenChange: (Y) => {
              !Y && !C && _(null);
            },
            title: s("chat.delete_message_title"),
            description: s("chat.delete_message_confirmation"),
            closeLabel: s("common.close"),
            contentOptions: {
              onCloseAutoFocus: (Y) => {
                var De;
                Y.preventDefault();
                const ye = (De = x.current) != null && De.isConnected ? x.current : M.current;
                ye == null || ye.focus({ preventScroll: !0 });
              }
            },
            children: /* @__PURE__ */ P("div", { className: ok, children: [
              /* @__PURE__ */ h(le, { size: "sm", type: "button", onClick: () => _(null), disabled: C, children: s("common.cancel") }),
              /* @__PURE__ */ h(
                le,
                {
                  tone: "danger",
                  size: "sm",
                  type: "button",
                  onClick: () => void W(),
                  disabled: C,
                  "aria-busy": C,
                  children: s("common.delete")
                }
              )
            ] })
          }
        )
      ]
    }
  );
}
var Ld = "eivjz70", Rk = "eivjz71", Ik = "eivjz72 _14sdsl3m _14sdsl3o", Tk = "eivjz73";
function Nk({
  className: e,
  style: t,
  renderContent: n,
  onOpen: r,
  onClose: o,
  onMessageSent: i,
  isMobile: s,
  panelClassName: a,
  panelStyle: c,
  anchor: u,
  popoverProps: d,
  messageBubbleStyles: l
}) {
  const { t: f } = de(), g = Se(), v = Ye(), p = B(($) => $.sessionState.connectionState === we.Connected), b = B(($) => $.chatState.isAvailable), y = B(($) => $.chatState.unreadCount), [S, w] = ne(!1), _ = ue(null), C = En(), R = y > 0 ? `${f("toolbar.chat")}, ${f("chat.unread_count", { count: y })}` : f("toolbar.chat"), x = p && b, E = q(() => {
    w(!0), r == null || r();
  }, [r]), I = q(() => {
    w(!1), o == null || o();
  }, [o]), M = () => /* @__PURE__ */ h(n_, { className: Rk, size: 18, "aria-hidden": "true" }), N = y > 0 ? /* @__PURE__ */ h("span", { className: Ik, "aria-label": f("chat.unread_count", { count: y }), children: y > 99 ? "99+" : y }) : null;
  return s ? /* @__PURE__ */ P(fr, { open: S, onOpenChange: ($) => $ ? E() : I(), autoFocus: !0, children: [
    /* @__PURE__ */ h(Ae.Trigger, { asChild: !0, children: /* @__PURE__ */ P(
      le,
      {
        kind: n ? "text" : "icon",
        className: X(Ld, e),
        style: t,
        size: "sm",
        active: S,
        disabled: !x,
        "aria-label": R,
        "aria-haspopup": "dialog",
        "data-testid": "chat-button",
        children: [
          (n ?? M)(),
          N
        ]
      }
    ) }),
    /* @__PURE__ */ P(Ae.Portal, { children: [
      /* @__PURE__ */ h(hr, { className: ar, "data-theme": g }),
      /* @__PURE__ */ P(
        Ae.Content,
        {
          style: v,
          className: X(Na, Tk),
          "aria-describedby": void 0,
          "data-theme": g,
          "data-testid": "chat-panel",
          children: [
            /* @__PURE__ */ h(Ae.Title, { asChild: !0, children: /* @__PURE__ */ h("span", { className: Hr, children: f("chat.title") }) }),
            /* @__PURE__ */ h("div", { className: Ur, "aria-hidden": "true" }),
            /* @__PURE__ */ h(
              $d,
              {
                className: a,
                style: c,
                isMobile: !0,
                onClose: () => w(!1),
                onMessageSent: i,
                messageBubbleStyles: l
              }
            )
          ]
        }
      )
    ] })
  ] }) : /* @__PURE__ */ P(pe, { children: [
    /* @__PURE__ */ P(
      le,
      {
        kind: n ? "text" : "icon",
        ref: _,
        className: X(Ld, e),
        style: t,
        size: "sm",
        active: S,
        disabled: !x,
        "aria-label": R,
        "aria-haspopup": "dialog",
        "aria-expanded": S,
        "aria-controls": S ? C : void 0,
        "data-testid": "chat-button",
        onClick: () => S ? I() : E(),
        children: [
          (n ?? M)(),
          N
        ]
      }
    ),
    S && /* @__PURE__ */ h(
      Ci,
      {
        open: !0,
        triggerRef: _,
        anchor: u,
        id: C,
        "aria-label": f("chat.title"),
        side: (d == null ? void 0 : d.side) ?? "top",
        align: (d == null ? void 0 : d.align) ?? "start",
        sideOffset: (d == null ? void 0 : d.sideOffset) ?? 8,
        alignOffset: d == null ? void 0 : d.alignOffset,
        collisionPadding: (d == null ? void 0 : d.collisionPadding) ?? 12,
        children: /* @__PURE__ */ h(
          $d,
          {
            className: a,
            style: c,
            onClose: I,
            onMessageSent: i,
            messageBubbleStyles: l
          }
        )
      }
    )
  ] });
}
var Ak = "_1429lod0", Ok = "_1429lod1", Pk = "_1429lod2", Mk = "_1429lod3 _14sdsl36";
function kk({
  buttons: e = [],
  isMobile: t = so(),
  className: n,
  style: r,
  menuClassName: o,
  menuStyle: i
}) {
  const { t: s } = de(), a = Se(), c = Ye(), [u, d] = ne(!1), l = oy.toArray(e), f = /* @__PURE__ */ h(
    le,
    {
      kind: "icon",
      active: u,
      "aria-label": s("toolbar.more"),
      className: n,
      style: r,
      "data-testid": "more-button",
      size: "sm",
      children: /* @__PURE__ */ h(Pa, { "aria-hidden": "true", size: Ie.iconSize })
    }
  ), g = /* @__PURE__ */ P("div", { className: Ok, role: "group", "aria-label": s("toolbar.more"), children: [
    l,
    l.length === 0 ? /* @__PURE__ */ h("div", { className: Pk, children: s("toolbar.more_empty") }) : null
  ] });
  return t ? /* @__PURE__ */ h(
    lc,
    {
      layer: "navigation",
      open: u,
      onOpenChange: d,
      title: s("toolbar.more"),
      trigger: f,
      closeLabel: s("common.cancel"),
      children: /* @__PURE__ */ h("div", { className: X(Mk, o), style: i, children: g })
    }
  ) : /* @__PURE__ */ P(hc, { open: u, onOpenChange: d, children: [
    /* @__PURE__ */ h(Tm, { asChild: !0, children: f }),
    /* @__PURE__ */ h(pc, { children: /* @__PURE__ */ h(
      mc,
      {
        align: "start",
        "aria-label": s("toolbar.more"),
        className: X(Ak, o),
        style: { ...c, ...i },
        collisionPadding: 8,
        "data-theme": a,
        side: "top",
        sideOffset: 10,
        children: g
      }
    ) })
  ] });
}
const Dk = [
  "audio",
  "video",
  "participant",
  "chat",
  "share",
  "record",
  "settings",
  "leave"
];
function qv({
  className: e,
  style: t,
  isHorizontal: n = !0,
  audioButtonProps: r,
  videoButtonProps: o,
  recordButtonProps: i,
  chatButtonProps: s,
  visibleButtons: a
}) {
  const c = Se(), { t: u } = de(), d = so(), [l, f] = ne([]), g = ue(null), v = ue({}), p = ue({}), b = he(
    () => Dk.filter((C) => a ? a[C] === !0 : !0),
    [a]
  ), y = b.filter((C) => l.includes(C));
  jt(() => {
    f([]);
  }, [n]), jt(() => {
    const C = g.current;
    if (!C) return;
    const R = n ? "width" : "height", x = n ? "columnGap" : "rowGap", E = Array.from(C.children), I = d ? E.flatMap((T) => Array.from(T.children)) : E, M = b.filter((T) => !["audio", "video", "leave"].includes(T)).reverse(), N = () => {
      const T = n ? C.clientWidth : C.clientHeight;
      if (!T) return;
      const O = getComputedStyle(C), F = parseFloat(O[x]) || 0, A = d ? F : parseFloat(getComputedStyle(E[1])[x]) || 0;
      let D = (parseFloat(O[n ? "paddingLeft" : "paddingTop"]) || 0) + (parseFloat(O[n ? "paddingRight" : "paddingBottom"]) || 0) + F * (I.length - 1) + I.reduce((z, L) => z + L.getBoundingClientRect()[R], 0);
      for (const z of M) {
        const L = v.current[z];
        L ? p.current[z] = L.getBoundingClientRect()[R] : D += (p.current[z] ?? 0) + A;
      }
      const V = [];
      for (const z of M) {
        if (Math.round(D) <= T) break;
        D -= (p.current[z] ?? 0) + A, V.push(z);
      }
      f(
        (z) => z.length === V.length && z.every((L, j) => L === V[j]) ? z : V
      );
    }, $ = new ResizeObserver(N);
    return $.observe(C), I.forEach((T) => $.observe(T)), () => $.disconnect();
  }, [d, n, b, l]);
  const S = {
    audio: /* @__PURE__ */ h(F1, { ...r, isMobile: d }),
    video: /* @__PURE__ */ h(G1, { ...o, isMobile: d }),
    participant: /* @__PURE__ */ h(HI, { isMobile: d }),
    chat: /* @__PURE__ */ h(Nk, { ...s, isMobile: d }),
    share: /* @__PURE__ */ h(BM, {}),
    record: /* @__PURE__ */ h(H1, { ...i, isMobile: d }),
    settings: /* @__PURE__ */ h(vM, { isMobile: d }),
    leave: /* @__PURE__ */ h(Nm, { isMobile: d })
  }, w = {
    participant: u("toolbar.participants"),
    chat: u("toolbar.chat"),
    share: u("toolbar.share"),
    record: u("toolbar.record"),
    settings: u("toolbar.settings")
  }, _ = (C) => !b.includes(C) || y.includes(C) ? null : /* @__PURE__ */ h(
    "div",
    {
      ref: (R) => {
        v.current[C] = R;
      },
      className: bM({ isHorizontal: n }),
      children: S[C]
    },
    C
  );
  return /* @__PURE__ */ P(
    "div",
    {
      "data-theme": c,
      ref: g,
      className: X(yM({ mobile: d, isHorizontal: n }), e),
      style: t,
      "data-testid": "toolbar",
      children: [
        /* @__PURE__ */ P("div", { className: Ts({ mobile: d, isHorizontal: n }), children: [
          _("audio"),
          _("video")
        ] }),
        /* @__PURE__ */ P("div", { className: Ts({ mobile: d, isHorizontal: n }), children: [
          _("participant"),
          _("chat"),
          _("share"),
          _("record"),
          _("settings"),
          /* @__PURE__ */ h(
            kk,
            {
              isMobile: d,
              buttons: y.map((C) => /* @__PURE__ */ P("div", { className: SM, "data-testid": `more-menu-${C}`, children: [
                S[C],
                /* @__PURE__ */ h("span", { className: wM, children: w[C] })
              ] }, C))
            }
          )
        ] }),
        /* @__PURE__ */ h("div", { className: Ts({ mobile: d, isHorizontal: n }), children: _("leave") })
      ]
    }
  );
}
const on = {
  background: "--zui-tile-background",
  color: "--zui-tile-color"
};
var $k = "_1fher9t0", Fd = "_1fher9t1", Lk = "_1fher9t2", Fk = "_1fher9t3", Vk = "_1fher9t4", Bk = "_1fher9t5", zk = "_1fher9t7";
function Gv({
  containerWidth: e,
  containerHeight: t,
  tileCount: n,
  minTileWidth: r = 160,
  gap: o = 8,
  aspectRatio: i = 16 / 9
}) {
  if (!e || !t || n <= 0)
    return {
      columns: 0,
      rows: 0,
      tileWidth: 0,
      tileHeight: 0,
      positions: []
    };
  let s = null;
  for (let f = 1; f <= n; f += 1) {
    const g = Math.ceil(n / f), v = e - o * (f - 1), p = t - o * (g - 1);
    if (v <= 0 || p <= 0) continue;
    const b = v / f, y = p * i / g, S = Math.min(b, y), w = S / i, _ = S >= r, C = f * S + (f - 1) * o, R = g * w + (g - 1) * o, x = S * w, E = {
      columns: f,
      rows: g,
      tileWidth: S,
      tileHeight: w,
      gridWidth: C,
      gridHeight: R,
      fitsMinWidth: _,
      area: x
    };
    (!s || E.fitsMinWidth && !s.fitsMinWidth || E.fitsMinWidth === s.fitsMinWidth && E.area > s.area) && (s = E);
  }
  if (!s)
    return {
      columns: 0,
      rows: 0,
      tileWidth: 0,
      tileHeight: 0,
      positions: []
    };
  const a = Math.max(s.tileWidth, r), c = a / i, u = s.rows * c + (s.rows - 1) * o, d = [], l = (t - u) / 2;
  for (let f = 0; f < n; f += 1) {
    const g = Math.floor(f / s.columns), v = f % s.columns, p = Math.min(s.columns, n - g * s.columns), b = p * a + (p - 1) * o, y = (e - b) / 2;
    d.push({
      index: f,
      row: g,
      column: v,
      x: y + v * (a + o),
      y: l + g * (c + o),
      width: a,
      height: c
    });
  }
  return {
    columns: s.columns,
    rows: s.rows,
    tileWidth: a,
    tileHeight: c,
    positions: d
  };
}
function jk({
  containerWidth: e,
  containerHeight: t,
  tileCount: n = 4,
  rows: r,
  gap: o = 2,
  aspectRatio: i
}) {
  const s = r > 0 ? Math.ceil(n / r) : 0;
  if (!e || !t || n <= 0 || r <= 0 || s <= 0)
    return {
      columns: 0,
      rows: 0,
      tileWidth: 0,
      tileHeight: 0,
      positions: []
    };
  const a = e - o * (s + 1), c = t - o * (r + 1);
  if (a <= 0 || c <= 0)
    return {
      columns: 0,
      rows: 0,
      tileWidth: 0,
      tileHeight: 0,
      positions: []
    };
  const u = a / s, d = c / r;
  let l, f;
  i ? (l = Math.min(u, d * i), f = l / i) : (l = u, f = d);
  const g = s * l + (s - 1) * o, v = r * f + (r - 1) * o, p = (e - g) / 2, b = (t - v) / 2, y = [];
  for (let S = 0; S < n; S += 1) {
    const w = Math.floor(S / s), _ = S % s;
    y.push({
      index: S,
      row: w,
      column: _,
      x: p + _ * (l + o),
      y: b + w * (f + o),
      width: l,
      height: f
    });
  }
  return {
    columns: s,
    rows: r,
    tileWidth: l,
    tileHeight: f,
    positions: y
  };
}
const Yv = (e, t) => {
  let n = Rr.Video_180P;
  return e <= 2 && t >= 550 ? n = Rr.Video_720P : e <= 4 && t >= 270 ? n = Rr.Video_360P : t >= 130 && (n = Rr.Video_180P), n;
};
var Xv = "bz1vxo0", Zv = "bz1vxo1", Uk = "_1nmkuch0", Hk = "_1nmkuch1", Wk = "_1nmkuch2", Kk = "_1nmkuch3", qk = "_1nmkuch4";
const Gk = ({ icon: e, size: t = 16, style: n, ...r }) => /* @__PURE__ */ h(e, { width: t, height: t, style: { flexShrink: 0, ...n }, ...r }), Yk = (e) => /* @__PURE__ */ m.createElement("svg", { width: 16, height: 16, fill: "none", xmlns: "http://www.w3.org/2000/svg", ...e }, /* @__PURE__ */ m.createElement("rect", { opacity: 0.8, x: 3, y: 4, width: 2, height: 2, fill: "#FFF" }, /* @__PURE__ */ m.createElement("animate", { attributeName: "y", values: "4;6;8;6;4", dur: "1s", repeatCount: "indefinite" })), /* @__PURE__ */ m.createElement("rect", { opacity: 0.8, x: 7, y: 4, width: 2, height: 2, fill: "#FFF" }, /* @__PURE__ */ m.createElement("animate", { attributeName: "y", values: "6;8;6;4;6", dur: "1s", repeatCount: "indefinite" })), /* @__PURE__ */ m.createElement("rect", { opacity: 0.8, x: 11, y: 4, width: 2, height: 2, fill: "#FFF" }, /* @__PURE__ */ m.createElement("animate", { attributeName: "y", values: "8;6;4;6;8", dur: "1s", repeatCount: "indefinite" })));
function ba(e) {
  const t = ue(void 0);
  return oe(() => {
    t.current = e;
  }), t.current;
}
function V$() {
  const e = B((u) => u.sessionState), t = B((u) => u.audioState), n = B((u) => u.videoState), r = B((u) => u.shareState), o = B((u) => u.participantState), i = B((u) => u.chatState), s = B((u) => u.deviceState), { client: a, sessionOptions: c } = _e();
  return {
    sessionState: e,
    audioState: t,
    videoState: n,
    shareState: r,
    participantState: o,
    chatState: i,
    sessionOptions: c,
    deviceState: s,
    client: a
  };
}
const Xk = (e, t, n) => {
  const { client: r } = _e(), o = he(() => Re(r), [r]), i = ue(e), s = ba(e), a = ba(t);
  jt(() => {
    i.current = e;
  }, [e]), oe(() => {
    const c = n.current;
    (async () => {
      try {
        if (!o || !c) return;
        const d = (s == null ? void 0 : s.userId) !== void 0 && s.userId !== e.userId;
        s != null && s.bVideoOn && (!e.bVideoOn || d) && await o.detachVideo(s.userId, c), e.bVideoOn && (!(s != null && s.bVideoOn) || d || a !== t) && await o.attachVideo(e.userId, t, c);
      } catch (d) {
        console.error(d);
      }
    })();
  }, [s, e, t, n, o, a]), oe(() => {
    const c = n.current;
    return () => {
      o && i.current.bVideoOn && c && o.detachVideo(i.current.userId, c);
    };
  }, [n]);
}, Zk = ({ participant: e, width: t, videoQuality: n, aspectRatio: r }) => {
  const o = ue(null);
  return Xk(e, n, o), /* @__PURE__ */ h(pe, { children: /* @__PURE__ */ h("video-player", { ref: o, style: { width: t, height: "auto", aspectRatio: r } }) });
}, Jv = ({
  participant: e,
  width: t,
  height: n,
  aspectRatio: r = 16 / 9,
  videoQuality: o = Rr.Video_360P,
  isActive: i,
  renderVideo: s = !0,
  activeClassName: a,
  activeStyle: c,
  className: u,
  style: d,
  customNameTag: l
}) => {
  const f = Se(), g = r ? t / r : n, { t: v } = de(), p = e == null ? void 0 : e.audio, b = e == null ? void 0 : e.muted, y = (e == null ? void 0 : e.displayName) ?? "", S = (e == null ? void 0 : e.bVideoOn) && s, _ = l ?? /* @__PURE__ */ h("span", { className: qk, style: { display: "flex", alignItems: "center", gap: 4 }, children: p === "" ? /* @__PURE__ */ P(pe, { children: [
    v("video.connecting_to_audio"),
    /* @__PURE__ */ h(Gk, { icon: Yk, size: 14 })
  ] }) : p === "phone" ? /* @__PURE__ */ P(pe, { children: [
    /* @__PURE__ */ h(Df, { size: 14, color: "#22c55e", style: { flexShrink: 0 } }),
    y
  ] }) : /* @__PURE__ */ P(pe, { children: [
    b && /* @__PURE__ */ h(Ma, { size: 14, color: "#ef4444", style: { flexShrink: 0 } }),
    y
  ] }) });
  return /* @__PURE__ */ P(
    "div",
    {
      "data-theme": f,
      className: `${Uk}${i ? ` ${a ?? Hk}` : ""}${u ? ` ${u}` : ""}`,
      style: {
        ...d,
        ...i ? c : void 0,
        width: t,
        height: g,
        ...S ? { backgroundColor: "transparent" } : {}
      },
      children: [
        !S && /* @__PURE__ */ P("div", { className: Kk, children: [
          /* @__PURE__ */ h("span", { className: Wk, style: { fontSize: Math.max(12, Math.min(28, t * 0.08)) }, children: y }),
          _
        ] }),
        S && /* @__PURE__ */ P("div", { style: { position: "relative" }, children: [
          /* @__PURE__ */ h(
            Zk,
            {
              participant: e,
              width: t,
              videoQuality: o,
              aspectRatio: r
            }
          ),
          _
        ] })
      ]
    }
  );
}, Qv = ({
  participants: e,
  width: t = 800,
  height: n = 450,
  minTileWidth: r = 160,
  gap: o = 8,
  videoTileAspectRatio: i = 16 / 9,
  activeSpeakerBorder: s = !0
}) => {
  var b;
  const a = Se(), { client: c } = _e(), u = B((y) => y.participantState), d = B((y) => y.sessionState.connectionState), l = u.activeVideoUser, f = (b = u.participants) == null ? void 0 : b.length, g = he(() => Re(c), [c]), v = he(() => {
    if (!g) return 0;
    const y = g.getMaxRenderableVideos();
    return g.isSupportMultipleVideos() ? e.length > y ? (console.warn(`Number of participants exceeds the maximum number of ${y} renderable videos`), y) : e.length : (e.length > 1 && console.warn("Multiple videos are not supported on your environment"), 1);
  }, [e, g]), p = he(
    () => Gv({
      containerWidth: t,
      containerHeight: n,
      tileCount: v,
      minTileWidth: r,
      gap: o,
      aspectRatio: i
    }),
    [t, n, v, r, o, i]
  );
  return /* @__PURE__ */ h("div", { "data-theme": a, className: Xv, style: { width: t, height: n }, children: d === we.Connected && /* @__PURE__ */ h("video-player-container", { style: { width: "100%", height: "100%" }, children: e == null ? void 0 : e.map((y, S) => {
    if (S >= v) return null;
    const w = p.positions[S];
    return w ? /* @__PURE__ */ h(
      Jv,
      {
        participant: y,
        className: Zv,
        width: w.width,
        height: w.height,
        aspectRatio: i,
        style: {
          left: w.x,
          top: w.y,
          width: w.width,
          height: w.height
        },
        isActive: s && f > 2 && (l == null ? void 0 : l.userId) === y.userId,
        videoQuality: Yv(v, w.height)
      },
      y.userId + `_video_${S}`
    ) : null;
  }) }) });
}, ey = (e, t, n) => {
  const r = e.find((c) => c.userId === (t == null ? void 0 : t.userId)), o = e.filter((c) => c.userId !== (t == null ? void 0 : t.userId)), i = o.filter((c) => c == null ? void 0 : c.bVideoOn), s = o.filter((c) => !(c != null && c.bVideoOn)), a = [...i, ...s];
  return !n || !r ? a : [a[0], r, ...a.slice(1)].filter(Boolean);
}, Jk = (e, t, n, r, o = !0) => {
  const i = ey(e, t, r), [s, a] = ne(1), [c, u] = ne(n), d = Math.max(1, Math.ceil(i.length / n));
  c !== n && (u(n), a(1));
  const l = Math.min(s, d), f = (l - 1) * n, g = i.slice(f, f + n), v = o && g.length < n ? i.slice(-n) : g;
  return { page: l, totalPages: d, prevPage: () => a(Math.max(1, l - 1)), nextPage: () => a(Math.min(d, l + 1)), pageParticipants: v };
}, Qk = (e, t, n, r) => {
  const o = ey(e, t, r), i = Math.max(1, Math.ceil(o.length / n));
  return { pages: he(
    () => Array.from({ length: i }, (a, c) => o.slice(c * n, c * n + n)),
    [o, i, n]
  ), totalPages: i };
};
function eD(e) {
  return Object.keys(e).length > 0;
}
function tD(e) {
  if (!e)
    return;
  const { backgroundColor: t, color: n, ...r } = e, o = { ...r };
  return t !== void 0 && (o.backgroundColor = t, o[on.background] = t), n !== void 0 && (o.color = n, o[on.color] = n), eD(o) ? o : void 0;
}
function nD({
  className: e,
  style: t,
  tileAspectRatio: n = 16 / 9,
  pageSize: r = 4,
  isShowSelf: o = !0,
  paginationDirection: i = "horizontal",
  hidePagination: s = !1,
  hidden: a = !1
}) {
  const c = Se(), u = B((E) => E.participantState), d = B((E) => E.sessionState), l = u.participants, f = u.currentUser, { page: g, totalPages: v, prevPage: p, nextPage: b, pageParticipants: y } = Jk(
    l,
    f,
    r,
    o
  ), S = ue(null), [w, _] = ne({ width: 0, height: 0 });
  oe(() => {
    const E = S.current;
    if (!E) return;
    const I = new ResizeObserver(([M]) => {
      const { width: N, height: $ } = M.contentRect;
      _({ width: N, height: $ });
    });
    return I.observe(E), () => I.disconnect();
  }, []);
  const { t: C } = de(), R = i === "vertical", x = tD({ ...t, ...a ? { display: "none" } : {} });
  return /* @__PURE__ */ P("div", { "data-theme": c, className: X($k, e), style: x, children: [
    /* @__PURE__ */ h("div", { ref: S, style: { position: "absolute", inset: 0, pointerEvents: "none" } }),
    d.connectionState === we.Connected && /* @__PURE__ */ P(pe, { children: [
      !s && g > 1 && /* @__PURE__ */ h(
        le,
        {
          kind: "icon",
          appearance: "overlay",
          "aria-label": C("participant.previous_page"),
          className: X(Fd, R ? Vk : Lk),
          onClick: p,
          disabled: g === 1,
          children: R ? /* @__PURE__ */ h(Oa, { size: Ie.iconSize }) : /* @__PURE__ */ h(Aa, { size: Ie.iconSize })
        }
      ),
      /* @__PURE__ */ h(
        Qv,
        {
          participants: y,
          width: w.width,
          height: w.height,
          minTileWidth: 160,
          gap: 8,
          videoTileAspectRatio: n
        }
      ),
      !s && g < v && /* @__PURE__ */ h(
        le,
        {
          kind: "icon",
          appearance: "overlay",
          "aria-label": C("participant.next_page"),
          className: X(Fd, R ? Bk : Fk),
          onClick: b,
          disabled: g === v,
          children: R ? /* @__PURE__ */ h(Wr, { size: Ie.iconSize }) : /* @__PURE__ */ h(ai, { size: Ie.iconSize })
        }
      ),
      /* @__PURE__ */ P("span", { className: zk, children: [
        g,
        " / ",
        v
      ] }, g)
    ] })
  ] });
}
var rD = "u3qpww0", oD = "u3qpww1", iD = "u3qpww2", Vd = "u3qpww3", sD = "u3qpww4", aD = "u3qpww5", cD = "u3qpww6", lD = "u3qpww7";
const Bd = 4, uD = ({
  participants: e,
  width: t = 800,
  height: n = 450,
  gap: r = 8,
  activeSpeakerBorder: o = !0,
  renderVideo: i = !0
}) => {
  var b;
  const s = Se(), { client: a } = _e(), c = B((y) => y.participantState), u = B((y) => y.sessionState.connectionState), d = c.activeVideoUser, l = (b = c.participants) == null ? void 0 : b.length, f = he(() => Re(a), [a]), g = he(() => {
    if (!f) return 0;
    const y = f.getMaxRenderableVideos(), S = Math.min(Bd, y);
    return f.isSupportMultipleVideos() ? e.length > S ? (console.warn(`Number of participants exceeds the maximum number of ${S} renderable videos`), S) : e.length : (e.length > 1 && console.warn("Multiple videos are not supported on your environment"), 1);
  }, [e, f]), v = he(() => t / n > 2 ? 1 : 2, [t, n]), p = he(
    () => jk({
      containerWidth: t,
      containerHeight: n,
      tileCount: Bd,
      rows: v,
      gap: r
    }),
    [t, n, r, v]
  );
  return /* @__PURE__ */ h("div", { "data-theme": s, className: Xv, style: { width: t, height: n }, children: u === we.Connected && /* @__PURE__ */ h("video-player-container", { style: { width: "100%", height: "100%" }, children: e == null ? void 0 : e.map((y, S) => {
    if (S >= g) return null;
    const w = p.positions[S];
    return w ? /* @__PURE__ */ h(
      Jv,
      {
        participant: y,
        className: Zv,
        width: w.width,
        height: w.height,
        aspectRatio: w.width / w.height,
        style: {
          left: w.x,
          top: w.y,
          width: w.width,
          height: w.height
        },
        isActive: o && l > 2 && (d == null ? void 0 : d.userId) === y.userId,
        videoQuality: Yv(g, w.height),
        renderVideo: i
      },
      y.userId + `_video_${S}`
    ) : null;
  }) }) });
};
var dD = "_1j6j9kg0", fD = "_1vtacrp1", hD = "_1vtacrp2", pD = "_1vtacrp3", mD = "_1vtacrp4";
const gD = (e, t) => {
  const { client: n } = _e(), r = he(() => Re(n), [n]), o = ue(e), i = ba(e);
  jt(() => {
    o.current = e;
  }, [e]), oe(() => {
    const s = t.current;
    (async () => {
      try {
        if (!r || !s) return;
        const c = (i == null ? void 0 : i.userId) !== void 0 && i.userId !== (e == null ? void 0 : e.userId);
        i != null && i.sharerOn && (!(e != null && e.sharerOn) || c) && await r.detachShareView(i.userId, s), e != null && e.sharerOn && (!(i != null && i.sharerOn) || c) && await r.attachShareView(e.userId, s);
      } catch (c) {
        console.error(c);
      }
    })();
  }, [i, e, t, r]), oe(() => {
    const s = t.current;
    return () => {
      var a;
      r && ((a = o.current) != null && a.sharerOn) && s && r.detachShareView(o.current.userId, s);
    };
  }, [t]);
}, vD = (e) => {
  const { client: t } = _e(), [n, r] = ne({ width: 0, height: 0 }), o = q(
    (i) => {
      const { width: s, height: a, userId: c } = i;
      c === e && r({ width: s, height: a });
    },
    [e]
  );
  return oe(() => {
    if (t)
      return t.on("share-content-dimension-change", o), () => {
        t == null || t.off("share-content-dimension-change", o);
      };
  }, [t, o]), n;
}, yD = ({
  participant: e,
  width: t,
  height: n,
  aspectRatio: r = 16 / 9,
  className: o,
  style: i,
  customNameTag: s,
  fitToContent: a = !1,
  showContentOriginalSize: c = !1
}) => {
  const u = Se(), d = ue(null);
  gD(e, d);
  const l = vD(e == null ? void 0 : e.userId), { t: f } = de(), g = (e == null ? void 0 : e.displayName) ?? "", v = g.length > 15 ? `${g.slice(0, 15)}…` : g, { width: p, height: b } = l, y = t > 0 && n > 0 && p > 0 && b > 0, S = y ? Math.min(t / p, n / b) : 0, w = y ? p * S : t, _ = y ? b * S : r ? t / r : n, C = c ? p : w, R = c ? b : _, x = a ? C : t, E = a ? R : n;
  if (!e)
    return null;
  if (e && !(e != null && e.sharerOn))
    return console.warn(`Participant ${e == null ? void 0 : e.displayName} (userId: ${e == null ? void 0 : e.userId}) is not sharing`), null;
  const I = s ?? /* @__PURE__ */ h("span", { className: mD, children: f("share.presenter_name", { name: v }) });
  return /* @__PURE__ */ P(
    "div",
    {
      "data-theme": u,
      className: `${fD}${o ? ` ${o}` : ""}`,
      style: {
        ...i,
        width: x,
        height: E,
        ...e != null && e.sharerOn ? { backgroundColor: "transparent" } : {}
      },
      children: [
        /* @__PURE__ */ h("div", { className: X(hD, !c && pD), children: /* @__PURE__ */ h("video-player", { ref: d, style: { width: C, height: R } }) }),
        I
      ]
    }
  );
}, Gc = (e) => {
  var t;
  return (t = e.participant) != null && t.sharerOn ? /* @__PURE__ */ h(yD, { ...e }) : null;
};
var bD = "fjyzsw0", SD = "fjyzsw1";
const wD = ({
  participants: e,
  width: t,
  height: n,
  minTileWidth: r = 160,
  gap: o = 8,
  shareTileAspectRatio: i = 16 / 9
}) => {
  const { client: s } = _e(), a = B((l) => l.sessionState.connectionState), c = he(() => Re(s), [s]), u = he(() => {
    if (!c) return 0;
    const l = c.getMaxRenderableShareViews();
    return e.length > l ? (console.warn(
      `Number of participants exceeds the maximum number of ${l} renderable share views`
    ), l) : e.length;
  }, [c, e]), d = he(
    () => Gv({
      containerWidth: t,
      containerHeight: n,
      tileCount: u,
      minTileWidth: r,
      gap: o,
      aspectRatio: i
    }),
    [t, n, u, r, o, i]
  );
  return /* @__PURE__ */ h("div", { className: bD, style: { width: t, height: n }, children: a === we.Connected && /* @__PURE__ */ h("video-player-container", { style: { width: "100%", height: "100%" }, children: e == null ? void 0 : e.map((l, f) => {
    var g;
    return f >= u || !((g = d == null ? void 0 : d.positions) != null && g[f]) ? null : /* @__PURE__ */ h(
      Gc,
      {
        participant: l,
        className: SD,
        width: d.positions[f].width,
        height: d.positions[f].height,
        aspectRatio: i,
        style: {
          position: "absolute",
          left: d.positions[f].x,
          top: d.positions[f].y,
          width: d.positions[f].width,
          height: d.positions[f].height
        }
      },
      l.userId + `_share_${f}`
    );
  }) }) });
};
function _D({ className: e, style: t, hidden: n }) {
  const r = Se(), o = B((l) => l.participantState), i = B((l) => l.sessionState), s = o == null ? void 0 : o.currentUser, a = ue(null), [c, u] = ne({ width: 0, height: 0 }), d = n ? { display: "none" } : {};
  return oe(() => {
    const l = a.current;
    if (!l) return;
    const f = new ResizeObserver(([g]) => {
      const { width: v, height: p } = g.contentRect;
      u({ width: v, height: p });
    });
    return f.observe(l), () => f.disconnect();
  }, []), /* @__PURE__ */ P("div", { "data-theme": r, className: X(dD, e), style: { ...t, ...d }, children: [
    /* @__PURE__ */ h("div", { ref: a, style: { position: "absolute", inset: 0, pointerEvents: "none" } }),
    i.connectionState === we.Connected && /* @__PURE__ */ h("video-player-container", { children: /* @__PURE__ */ h("div", { children: /* @__PURE__ */ h(
      Gc,
      {
        participant: s,
        width: c.width,
        height: c.height,
        customNameTag: /* @__PURE__ */ h("div", {}),
        fitToContent: !0
      }
    ) }) })
  ] });
}
var CD = "_1gdfdi20", xD = "_1gdfdi21", zd = "_1gdfdi22", ED = "_1gdfdi23", RD = "_1gdfdi24", ID = "_1gdfdi25", TD = "_1gdfdi26", ND = "_1gdfdi28";
const AD = (e, t) => {
  const [n, r] = ne(1), [o, i] = ne(t), s = Math.max(1, Math.ceil(e.length / t));
  o !== t && (i(t), r(1));
  const a = Math.min(n, s), c = (a - 1) * t, u = e.slice(c, c + t), d = u.length < t ? e.slice(-t) : u;
  return { page: a, totalPages: s, prevPage: () => r(Math.max(1, a - 1)), nextPage: () => r(Math.min(s, a + 1)), pageParticipants: d };
};
var OD = "_13i75vz2", PD = "_13i75vz3", MD = "_13i75vz4", kD = "_13i75vz5", DD = "_13i75vz6", $D = "_13i75vz7", LD = "_13i75vz8", FD = "_13i75vz9", VD = "_13i75vza", BD = "_13i75vzb", jd = "_13i75vzc";
function zD({ name: e, shareViewMode: t, onShareViewModeChange: n }) {
  const { t: r } = de(), o = Se(), i = Ye(), [s, a] = ne(!1), c = e.length > 30 ? `${e.slice(0, 30)}…` : e;
  return /* @__PURE__ */ P("div", { className: X(MD, s && kD), style: i, children: [
    /* @__PURE__ */ h("span", { className: DD }),
    /* @__PURE__ */ h("span", { className: $D, children: /* @__PURE__ */ h("span", { className: LD, children: /* @__PURE__ */ h("b", { children: r("share.viewing_screen", { name: c }) }) }) }),
    /* @__PURE__ */ h("span", { className: FD }),
    /* @__PURE__ */ P(Jr, { onOpenChange: a, modal: !1, children: [
      /* @__PURE__ */ h(Qr, { asChild: !0, children: /* @__PURE__ */ P(le, { appearance: "segment", type: "button", children: [
        r("share.view_options"),
        /* @__PURE__ */ h(Wr, { "aria-hidden": "true", className: VD, size: 14 })
      ] }) }),
      /* @__PURE__ */ h(ur, { children: /* @__PURE__ */ h(
        eo,
        {
          style: i,
          align: "end",
          avoidCollisions: !0,
          className: BD,
          collisionPadding: 8,
          "data-theme": o,
          sideOffset: 6,
          children: /* @__PURE__ */ P(
            Hp,
            {
              value: t,
              onValueChange: (u) => n(u),
              children: [
                /* @__PURE__ */ h(nt, { asChild: !0, layout: "leading", children: /* @__PURE__ */ P(qs, { value: "fit", children: [
                  /* @__PURE__ */ h("span", { className: jd, children: /* @__PURE__ */ h(Xn, { children: /* @__PURE__ */ h(yt, { "aria-hidden": "true", size: 14 }) }) }),
                  /* @__PURE__ */ h("span", { children: r("share.fit_to_window") })
                ] }) }),
                /* @__PURE__ */ h(nt, { asChild: !0, layout: "leading", children: /* @__PURE__ */ P(qs, { value: "original", children: [
                  /* @__PURE__ */ h("span", { className: jd, children: /* @__PURE__ */ h(Xn, { children: /* @__PURE__ */ h(yt, { "aria-hidden": "true", size: 14 }) }) }),
                  /* @__PURE__ */ h("span", { children: r("share.original_size") })
                ] }) })
              ]
            }
          )
        }
      ) })
    ] })
  ] });
}
function jD({ participant: e, width: t, height: n }) {
  const [r, o] = ne(
    "fit"
    /* FitToWindow */
  ), [i, s] = ne({ x: 0, y: 0 }), [a, c] = ne({ left: 0, top: 0, right: 0, bottom: 0 }), u = ue(null), d = r === "original", l = (e == null ? void 0 : e.displayName) ?? "", f = B((v) => v.shareState.isSharing), g = (v) => {
    v === "fit" && s({ x: 0, y: 0 }), o(v);
  };
  return oe(() => {
    o(
      "fit"
      /* FitToWindow */
    ), s({ x: 0, y: 0 });
  }, [e == null ? void 0 : e.userId]), oe(() => {
    const v = u.current, p = v == null ? void 0 : v.parentElement;
    if (!v || !p) return;
    const b = () => {
      const S = Math.max(0, v.offsetWidth - p.clientWidth), w = Math.max(0, v.offsetHeight - p.clientHeight);
      c({ left: -S, top: -w, right: 0, bottom: 0 }), s((_) => ({
        x: Math.min(0, Math.max(_.x, -S)),
        y: Math.min(0, Math.max(_.y, -w))
      }));
    };
    b();
    const y = new ResizeObserver(b);
    return y.observe(v), y.observe(p), () => y.disconnect();
  }, [d]), /* @__PURE__ */ P(pe, { children: [
    e && /* @__PURE__ */ h(
      zD,
      {
        name: l,
        shareViewMode: r,
        onShareViewModeChange: g
      }
    ),
    /* @__PURE__ */ h(
      bc,
      {
        nodeRef: u,
        bounds: a,
        position: i,
        disabled: !d,
        onDrag: (v, p) => s({ x: p.x, y: p.y }),
        children: /* @__PURE__ */ h("div", { ref: u, className: X(OD, d && PD), children: /* @__PURE__ */ h("video-player-container", { children: !f && /* @__PURE__ */ h(
          Gc,
          {
            participant: e,
            width: t,
            height: n,
            customNameTag: /* @__PURE__ */ h("div", {}),
            showContentOriginalSize: d,
            fitToContent: d
          }
        ) }) })
      }
    )
  ] });
}
function UD(e) {
  return Object.keys(e).length > 0;
}
function HD(e) {
  if (!e)
    return;
  const { backgroundColor: t, color: n, ...r } = e, o = { ...r };
  return t !== void 0 && (o.backgroundColor = t, o[on.background] = t), n !== void 0 && (o.color = n, o[on.color] = n), UD(o) ? o : void 0;
}
function ty({
  className: e,
  style: t,
  tileAspectRatio: n = 16 / 9,
  pageSize: r = 4,
  hidden: o = !1,
  isMultiShareRender: i = !1,
  paginationDirection: s = "horizontal",
  hidePagination: a = !1
}) {
  const c = Se(), { t: u } = de(), d = B((I) => I.participantState), l = B((I) => I.sessionState), f = d.activeShareUsersList, g = d.activeShareUser, v = ue(null), [p, b] = ne({ width: 0, height: 0 }), { page: y, totalPages: S, prevPage: w, nextPage: _, pageParticipants: C } = AD(
    f,
    r
  );
  oe(() => {
    const I = v.current;
    if (!I) return;
    const M = new ResizeObserver(([N]) => {
      const { width: $, height: T } = N.contentRect;
      b({ width: $, height: T });
    });
    return M.observe(I), () => M.disconnect();
  }, []);
  const R = s === "vertical", x = HD({ ...t, ...o ? { display: "none" } : {} }), E = o ? [] : i ? C : g ? [g] : [];
  return /* @__PURE__ */ P("div", { "data-theme": c, className: X(CD, e), style: x, children: [
    /* @__PURE__ */ h("div", { ref: v, style: { position: "absolute", inset: 0, pointerEvents: "none" } }),
    l.connectionState === we.Connected && /* @__PURE__ */ P(pe, { children: [
      !a && i && y > 1 && /* @__PURE__ */ h(
        le,
        {
          kind: "icon",
          appearance: "overlay",
          "aria-label": u("participant.previous_page"),
          className: X(zd, R ? ID : ED),
          onClick: w,
          disabled: y === 1,
          children: R ? /* @__PURE__ */ h(Oa, { size: Ie.iconSize }) : /* @__PURE__ */ h(Aa, { size: Ie.iconSize })
        }
      ),
      i ? /* @__PURE__ */ h(
        wD,
        {
          participants: E,
          width: p.width,
          height: p.height,
          shareTileAspectRatio: n
        }
      ) : /* @__PURE__ */ h(
        jD,
        {
          participant: g,
          width: p.width,
          height: p.height
        }
      ),
      (i ? C.length === 0 : !g) && /* @__PURE__ */ h("span", { className: xD, children: u("share.no_active_share") }),
      !a && i && y < S && /* @__PURE__ */ h(
        le,
        {
          kind: "icon",
          appearance: "overlay",
          "aria-label": u("participant.next_page"),
          className: X(zd, R ? TD : RD),
          onClick: _,
          disabled: y === S,
          children: R ? /* @__PURE__ */ h(Wr, { size: Ie.iconSize }) : /* @__PURE__ */ h(ai, { size: Ie.iconSize })
        }
      ),
      i && /* @__PURE__ */ P("span", { className: ND, children: [
        y,
        " / ",
        S
      ] }, y)
    ] })
  ] });
}
const WD = 4;
function KD(e) {
  return Object.keys(e).length > 0;
}
function qD(e) {
  if (!e)
    return;
  const { backgroundColor: t, color: n, ...r } = e, o = { ...r };
  return t !== void 0 && (o.backgroundColor = t, o[on.background] = t), n !== void 0 && (o.color = n, o[on.color] = n), KD(o) ? o : void 0;
}
function GD({
  className: e,
  style: t,
  isShowSelf: n = !0,
  paginationDirection: r = "horizontal",
  hidePagination: o = !1,
  hidden: i = !1
}) {
  const s = Se(), { t: a } = de(), c = B((F) => F.participantState), u = B((F) => F.sessionState), d = B((F) => F.shareState.isReceivingShare), l = c.participants, f = c.currentUser, { pages: g, totalPages: v } = Qk(l, f, WD, n), p = d, b = p ? 1 : 0, y = v + b, S = ue(null), [w, _] = ne({ width: 0, height: 0 });
  oe(() => {
    const F = S.current;
    if (!F) return;
    const A = new ResizeObserver(([D]) => {
      const { width: V, height: z } = D.contentRect;
      _({ width: V, height: z });
    });
    return A.observe(F), () => A.disconnect();
  }, []);
  const C = r === "vertical", R = C ? w.height : w.width, [x, E] = ne(null), I = Sc({
    count: y,
    rowHeight: R,
    scrollElement: x,
    horizontal: !C,
    overscan: 1,
    getItemKey: (F) => F
  });
  oe(() => {
    I.measure();
  }, [R, I]);
  const M = R ? Math.round((I.scrollOffset ?? 0) / R) : 0, N = Math.min(y - 1, Math.max(0, M));
  oe(() => {
    M > y - 1 && I.scrollToIndex(y - 1, { align: "start" });
  }, [M, y, I]), oe(() => {
    I.scrollToIndex(0, { align: "start" });
  }, [p, I]);
  const $ = qD({ ...t, ...i ? { display: "none" } : {} }), T = u.connectionState === we.Connected, O = !o && y > 1;
  return /* @__PURE__ */ P("div", { "data-theme": s, className: X(rD, e), style: $, children: [
    /* @__PURE__ */ h("div", { ref: S, style: { position: "absolute", inset: 0, pointerEvents: "none" } }),
    T && /* @__PURE__ */ P(pe, { children: [
      /* @__PURE__ */ h("div", { ref: E, className: X(oD, C && iD), children: /* @__PURE__ */ P(
        "div",
        {
          style: {
            position: "relative",
            width: C ? "100%" : I.getTotalSize(),
            height: C ? I.getTotalSize() : "100%"
          },
          children: [
            /* @__PURE__ */ h(
              "div",
              {
                className: Vd,
                style: {
                  width: w.width,
                  height: w.height,
                  display: p ? void 0 : "none"
                },
                children: /* @__PURE__ */ h(
                  ty,
                  {
                    isMultiShareRender: !1,
                    hidePagination: !0,
                    hidden: !p,
                    style: { width: "100%", height: "100%" }
                  }
                )
              }
            ),
            I.getVirtualItems().map((F) => {
              if (p && F.index === 0) return null;
              const A = F.index - b;
              return /* @__PURE__ */ h(
                "div",
                {
                  className: Vd,
                  style: {
                    width: w.width,
                    height: w.height,
                    transform: C ? `translateY(${F.start}px)` : `translateX(${F.start}px)`
                  },
                  children: /* @__PURE__ */ h(
                    uD,
                    {
                      participants: g[A],
                      width: w.width,
                      height: w.height,
                      gap: 2,
                      renderVideo: F.index === N
                    }
                  )
                },
                F.key
              );
            })
          ]
        }
      ) }),
      O && /* @__PURE__ */ h("div", { className: X(sD, C && aD), children: Array.from({ length: y }, (F, A) => /* @__PURE__ */ h(
        "button",
        {
          className: X(cD, A === N && lD),
          onClick: () => I.scrollToIndex(A, { align: "start" }),
          "aria-label": p && A === 0 ? a("participant.go_to_shared_screen") : a("participant.go_to_page", { page: A - b + 1 })
        },
        A
      )) })
    ] })
  ] });
}
var YD = "or6xcu0";
function XD({
  value: e,
  className: t,
  style: n,
  iconSize: r = Ie.iconSize,
  copiedDuration: o = 1500,
  label: i,
  copiedLabel: s,
  testId: a
}) {
  const { t: c } = de(), [u, d] = ne(!1), l = i ?? c("common.copy"), f = s ?? c("common.copied"), g = async () => {
    try {
      await navigator.clipboard.writeText(e), d(!0), window.setTimeout(() => d(!1), o);
    } catch {
    }
  };
  return /* @__PURE__ */ h(
    le,
    {
      kind: "icon",
      appearance: "quiet",
      type: "button",
      className: t,
      style: n,
      onClick: () => void g(),
      "aria-label": u ? f : l,
      title: u ? f : l,
      "data-testid": a,
      children: u ? /* @__PURE__ */ h(yt, { size: r, "aria-hidden": "true" }) : /* @__PURE__ */ h(jw, { size: r, "aria-hidden": "true" })
    }
  );
}
function ZD(e) {
  const t = B((r) => r.sessionState.sessionInfo), n = B((r) => r.participantState.currentUser);
  return he(() => ({
    topic: t == null ? void 0 : t.topic,
    sessionId: t == null ? void 0 : t.sessionId,
    yourName: n ? n == null ? void 0 : n.displayName : "",
    yourUserId: n ? n == null ? void 0 : n.userId : "",
    inviteLink: e
  }), [t, n, e]);
}
var JD = "_25kcxc0", QD = "_25kcxc1 _14sdsl37 _14sdsl36", e$ = "_25kcxc2", t$ = "_25kcxc3", n$ = "_25kcxc4", r$ = "_25kcxc5", o$ = "_25kcxc6", i$ = "_25kcxc7";
function Ud({
  className: e,
  style: t,
  anchor: n,
  placement: r = "bottom",
  open: o = !0,
  isMobile: i = !1,
  onClose: s,
  inviteLink: a
}) {
  const c = Se(), { t: u } = de(), d = ZD(a), l = he(
    () => Object.entries(d).filter(([f, g]) => f !== "inviteLink" || !!g).map(([f, g]) => ({
      key: f,
      label: u(`sessionInfo.${f}`),
      value: String(g ?? "")
    })),
    [d, u]
  );
  return /* @__PURE__ */ h(
    Lr,
    {
      title: u("sessionInfo.title"),
      className: X(JD, e),
      style: t,
      anchor: n,
      placement: r,
      open: o,
      isMobile: i,
      onClose: s,
      closeLabel: u("common.close"),
      testId: "session-info-panel",
      children: /* @__PURE__ */ h("div", { "data-theme": c, className: QD, role: "list", children: l.map((f) => {
        const g = f.key === "inviteLink", v = g || f.key === "sessionId";
        return /* @__PURE__ */ P("div", { className: X(e$, g && r$), role: "listitem", children: [
          /* @__PURE__ */ h("span", { className: t$, children: f.label }),
          /* @__PURE__ */ h("span", { className: g ? i$ : n$, title: f.value, children: f.value }),
          v ? /* @__PURE__ */ h(XD, { value: f.value, testId: `session-info-panel-copy-${f.key}` }) : /* @__PURE__ */ h("span", { className: o$, "aria-hidden": "true" })
        ] }, f.key);
      }) })
    }
  );
}
var Hd = "p0wivc0", s$ = "p0wivc1", Wd = "p0wivc2";
function a$({
  className: e,
  style: t,
  showSessionName: n = !0,
  renderContent: r,
  ariaLabel: o,
  isMobile: i,
  panelClassName: s,
  panelStyle: a,
  anchor: c,
  popoverProps: u,
  onOpen: d,
  onClose: l,
  inviteLink: f
}) {
  var I, M;
  const { t: g } = de(), v = Se(), p = Ye(), b = B((N) => N.sessionState), [y, S] = ne(!1), w = ue(null), _ = En(), C = b.connectionState === we.Connected, R = o ?? g("sessionInfo.title"), x = () => /* @__PURE__ */ h(Gw, { className: s$, size: 18, "aria-hidden": "true" }), E = q(
    (N) => {
      S(N), N ? d == null || d() : l == null || l();
    },
    [d, l]
  );
  return i ? /* @__PURE__ */ P(fr, { open: y, onOpenChange: E, autoFocus: !0, children: [
    /* @__PURE__ */ h(Ae.Trigger, { asChild: !0, children: /* @__PURE__ */ P(
      le,
      {
        kind: n || r ? "text" : "icon",
        className: X(Hd, e),
        style: t,
        size: "sm",
        active: y,
        disabled: !C,
        "aria-haspopup": "dialog",
        "aria-label": R,
        "data-testid": "topbar-session-info",
        children: [
          (r ?? x)(),
          n && /* @__PURE__ */ h("span", { className: Wd, children: (I = b == null ? void 0 : b.sessionInfo) == null ? void 0 : I.topic })
        ]
      }
    ) }),
    /* @__PURE__ */ P(Ae.Portal, { children: [
      /* @__PURE__ */ h(hr, { className: ar, "data-theme": v }),
      /* @__PURE__ */ P(
        Ae.Content,
        {
          style: p,
          className: Na,
          "aria-describedby": void 0,
          "data-theme": v,
          "data-testid": "session-info-panel",
          children: [
            /* @__PURE__ */ h(Ae.Title, { className: Hr, children: R }),
            /* @__PURE__ */ h("div", { className: Ur, "aria-hidden": "true" }),
            /* @__PURE__ */ h(
              Ud,
              {
                className: s,
                style: a,
                isMobile: !0,
                onClose: () => S(!1),
                inviteLink: f
              }
            )
          ]
        }
      )
    ] })
  ] }) : /* @__PURE__ */ P(pe, { children: [
    /* @__PURE__ */ P(
      le,
      {
        kind: n || r ? "text" : "icon",
        ref: w,
        className: X(Hd, e),
        style: t,
        size: "sm",
        active: y,
        disabled: !C,
        "aria-haspopup": "dialog",
        "aria-expanded": y,
        "aria-controls": y ? _ : void 0,
        "aria-label": R,
        "data-testid": "topbar-session-info",
        onClick: () => E(!y),
        children: [
          (r ?? x)(),
          n && /* @__PURE__ */ h("span", { className: Wd, children: (M = b == null ? void 0 : b.sessionInfo) == null ? void 0 : M.topic })
        ]
      }
    ),
    y && /* @__PURE__ */ h(
      Ci,
      {
        open: !0,
        triggerRef: w,
        anchor: c,
        id: _,
        "aria-label": R,
        side: (u == null ? void 0 : u.side) ?? "bottom",
        align: (u == null ? void 0 : u.align) ?? "start",
        sideOffset: (u == null ? void 0 : u.sideOffset) ?? 8,
        alignOffset: u == null ? void 0 : u.alignOffset,
        collisionPadding: (u == null ? void 0 : u.collisionPadding) ?? 12,
        children: /* @__PURE__ */ h(
          Ud,
          {
            className: s,
            style: a,
            open: !0,
            onClose: () => E(!1),
            inviteLink: f
          }
        )
      }
    )
  ] });
}
var c$ = "_11tlan51", l$ = "_11tlan52";
function u$({ isMobile: e }) {
  const { t } = de(), { recordingStatus: n } = ja(), r = n === tt.Recording, i = n === tt.Paused ? t("recording.paused") : r ? t("recording.recording") : null;
  return /* @__PURE__ */ h(
    "span",
    {
      className: c$,
      role: "status",
      "aria-atomic": "true",
      "data-testid": i ? "recording-indicator" : void 0,
      children: i ? /* @__PURE__ */ P(pe, { children: [
        /* @__PURE__ */ h("span", { className: l$, "aria-hidden": "true" }),
        /* @__PURE__ */ h("span", { className: e ? Hr : void 0, children: i })
      ] }) : null
    }
  );
}
var d$ = "tqcg9j0", f$ = "tqcg9j1", h$ = "tqcg9j2";
function ny({ className: e, style: t, customizedButtons: n }) {
  const r = Se(), o = so();
  return /* @__PURE__ */ P("div", { "data-theme": r, className: X(d$, e), style: t, "data-testid": "top-bar", children: [
    /* @__PURE__ */ P("div", { className: f$, children: [
      /* @__PURE__ */ h(a$, { isMobile: o, showSessionName: !o }),
      /* @__PURE__ */ h(u$, { isMobile: o })
    ] }),
    n && n.length > 0 && /* @__PURE__ */ h("div", { className: h$, children: n.map((i, s) => /* @__PURE__ */ h("div", { children: i }, s)) })
  ] });
}
var p$ = "_9zre9u0";
function m$(e) {
  return Object.keys(e).length > 0;
}
function g$(e) {
  if (!e)
    return;
  const { backgroundColor: t, color: n, ...r } = e, o = { ...r };
  return t !== void 0 && (o.backgroundColor = t, o[on.background] = t), n !== void 0 && (o.color = n, o[on.color] = n), m$(o) ? o : void 0;
}
function v$({
  className: e,
  style: t,
  tileAspectRatio: n = 16 / 9,
  hidden: r = !1
}) {
  const o = Se(), i = B((f) => f.participantState), s = B((f) => f.sessionState), a = i.activeVideoUser, c = ue(null), [u, d] = ne({ width: 0, height: 0 });
  oe(() => {
    const f = c.current;
    if (!f) return;
    const g = new ResizeObserver(([v]) => {
      const { width: p, height: b } = v.contentRect;
      d({ width: p, height: b });
    });
    return g.observe(f), () => g.disconnect();
  }, []);
  const l = g$({ ...t, ...r ? { display: "none" } : {} });
  return /* @__PURE__ */ P("div", { "data-theme": o, className: X(p$, e), style: l, children: [
    /* @__PURE__ */ h("div", { ref: c, style: { position: "absolute", inset: 0, pointerEvents: "none" } }),
    s.connectionState === we.Connected && /* @__PURE__ */ h(
      Qv,
      {
        participants: a ? [a] : [],
        width: u.width,
        height: u.height,
        minTileWidth: 160,
        gap: 8,
        videoTileAspectRatio: n,
        activeSpeakerBorder: !1
      }
    )
  ] });
}
function y$({ toolbarProps: e }) {
  const { client: t } = _e(), n = B((p) => p.participantState), r = B((p) => p.shareState), [o, i] = ne("gallery"), s = r.isSharing, a = r.isReceivingShare, c = o === "speaker" && !s && !a && (n == null ? void 0 : n.participants.length) >= 2, u = !c && !s && !a, d = ue(null), [l, f] = ne(0);
  oe(() => {
    const p = d.current;
    if (!p) return;
    const b = new ResizeObserver((y) => {
      for (const S of y)
        f(S.contentRect.width);
    });
    return b.observe(p), () => b.disconnect();
  }, []);
  const g = he(() => t ? Math.min(t.getMediaStream().getMaxRenderableVideos(), 9) : 1, [t]), v = he(() => Math.min(Math.max(Math.floor(l / 160) - 1, 1), g), [l, g]);
  return /* @__PURE__ */ P(pe, { children: [
    /* @__PURE__ */ h(ny, { customizedButtons: [/* @__PURE__ */ h(IE, { value: o, onChange: i }, "view-type")] }),
    /* @__PURE__ */ P("main", { className: YD, ref: d, children: [
      /* @__PURE__ */ h(
        nD,
        {
          style: u ? { height: "80%", margin: "auto 0" } : { height: "120px", flexShrink: 0, margin: "0.75rem 0" },
          pageSize: u ? g : v
        }
      ),
      /* @__PURE__ */ h(v$, { style: { height: "70%", margin: "auto 0" }, hidden: !c }),
      /* @__PURE__ */ h(
        ty,
        {
          style: { height: "70%", margin: "auto 0" },
          hidden: !a || s
        }
      ),
      /* @__PURE__ */ h(_D, { style: { height: "70%", margin: "auto 0" }, hidden: !s })
    ] }),
    /* @__PURE__ */ h(qv, { ...e })
  ] });
}
var b$ = "skz8xm0", S$ = "skz8xm1 _14sdsl34", w$ = "skz8xm2";
function _$() {
  const { t: e } = de();
  return /* @__PURE__ */ P("div", { className: b$, "data-testid": "session-loading", children: [
    /* @__PURE__ */ h(Tn, { className: S$, size: 48 }),
    /* @__PURE__ */ h("span", { className: w$, children: e("session.joining") })
  ] });
}
var C$ = "_18az99r0";
function x$({ toolbarProps: e }) {
  const t = ue(null);
  return /* @__PURE__ */ P(pe, { children: [
    /* @__PURE__ */ h(ny, { customizedButtons: [/* @__PURE__ */ h(Nm, { isMobile: !0 })] }),
    /* @__PURE__ */ h("main", { className: C$, ref: t, children: /* @__PURE__ */ h(GD, { style: { width: "100%", height: "100%" } }) }),
    /* @__PURE__ */ h(
      qv,
      {
        ...e,
        visibleButtons: (e == null ? void 0 : e.visibleButtons) ?? { audio: !0, video: !0, participant: !0, chat: !0, settings: !0 }
      }
    )
  ] });
}
function B$({
  width: e = "100%",
  height: t = "100%",
  className: n,
  style: r,
  toolbarProps: o
}) {
  const i = Se(), s = Ta(), a = { zIndex: s, [Ia]: s }, { connectionState: c, isJoining: u } = B((f) => f.sessionState), d = u || c === we.Reconnecting, l = so();
  return /* @__PURE__ */ P(
    "div",
    {
      className: X(Z0, l && J0, n),
      style: { ...a, width: e, ...l ? {} : { height: t }, ...r },
      "data-theme": i,
      "data-testid": "uitoolkit-app",
      children: [
        d && /* @__PURE__ */ h(_$, {}),
        c === we.Connected && (l ? /* @__PURE__ */ h(x$, { toolbarProps: o }) : /* @__PURE__ */ h(y$, { toolbarProps: o }))
      ]
    }
  );
}
var E$ = "_1bwzgkr0";
function z$({ joinParameters: e, className: t, style: n, fullWidth: r = !1 }) {
  const { t: o } = de(), { client: i } = _e(), s = B((l) => l.sessionState), a = B((l) => l.setSessionState), c = s.isJoining, u = !!(i && e.topic && e.userName);
  async function d() {
    if (!(!u || c || !i))
      try {
        a({
          isJoining: !0,
          errorMessage: null
        }), await i.join(
          e.topic,
          e.token,
          e.userName,
          e.sessionPassword,
          e.sessionIdleTimeoutMins
        );
      } catch (l) {
        console.error(l), a({
          isJoining: !1,
          errorMessage: Or(l)
        });
      }
  }
  return /* @__PURE__ */ P(
    le,
    {
      tone: "accent",
      size: "md",
      fullWidth: r,
      className: t,
      style: n,
      onClick: () => void d(),
      disabled: !u || c,
      "aria-busy": c,
      type: "button",
      "data-testid": "join-button",
      children: [
        /* @__PURE__ */ h(Jw, { className: E$, size: 18, "aria-hidden": "true" }),
        o("session.join_session")
      ]
    }
  );
}
const R$ = () => /* @__PURE__ */ h(p_, { size: 18 }), I$ = Sa(
  ({ className: e, active: t = !1, tone: n = "neutral", size: r = "md", fullWidth: o = !1, renderContent: i, children: s, ...a }, c) => /* @__PURE__ */ P(le, { ref: c, className: e, active: t, tone: n, size: r, fullWidth: o, ...a, children: [
    (i ?? R$)(),
    s
  ] })
);
I$.displayName = "ToolbarButton";
export {
  v$ as ActiveSpeakerView,
  F1 as AudioButton,
  Nk as ChatButton,
  H$ as ConnectionState,
  z$ as JoinButton,
  Nm as LeaveButton,
  lt as MicTestPhase,
  GD as MobileParticipantView,
  uD as MobileVideoLayout,
  kk as MoreButton,
  HI as ParticipantButton,
  Yu as ParticipantPanel,
  Jv as ParticipantTile,
  nD as ParticipantView,
  A_ as ReclaimHostBanner,
  H1 as RecordButton,
  ga as Select,
  a$ as SessionInfoButton,
  Ud as SessionInfoPanel,
  vM as SettingsButton,
  Pd as SettingsPanel,
  BM as ShareButton,
  _D as SharePresenterView,
  Gc as ShareTile,
  wD as ShareViewLayout,
  ty as ShareViewerView,
  G0 as ThemeProvider,
  qv as Toolbar,
  I$ as ToolbarButton,
  ny as TopBar,
  G1 as VideoButton,
  Qv as VideoLayout,
  B$ as ZoomUIToolkitApp,
  D$ as ZoomUIToolkitProvider,
  $$ as ZoomUIToolkitRoot,
  fm as useAudioController,
  O1 as useRecordingController,
  dc as useShareController,
  Se as useTheme,
  hm as useVideoController,
  V$ as useZoomUIToolkit
};
