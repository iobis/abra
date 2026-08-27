//#region node_modules/d3-array/src/ascending.js
function e(e, t) {
	return e == null || t == null ? NaN : e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
//#endregion
//#region node_modules/d3-array/src/descending.js
function t(e, t) {
	return e == null || t == null ? NaN : t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
//#endregion
//#region node_modules/d3-array/src/bisector.js
function n(n) {
	let i, a, o;
	n.length === 2 ? (i = n === e || n === t ? n : r, a = n, o = n) : (i = e, a = (t, r) => e(n(t), r), o = (e, t) => n(e) - t);
	function s(e, t, n = 0, r = e.length) {
		if (n < r) {
			if (i(t, t) !== 0) return r;
			do {
				let i = n + r >>> 1;
				a(e[i], t) < 0 ? n = i + 1 : r = i;
			} while (n < r);
		}
		return n;
	}
	function c(e, t, n = 0, r = e.length) {
		if (n < r) {
			if (i(t, t) !== 0) return r;
			do {
				let i = n + r >>> 1;
				a(e[i], t) <= 0 ? n = i + 1 : r = i;
			} while (n < r);
		}
		return n;
	}
	function l(e, t, n = 0, r = e.length) {
		let i = s(e, t, n, r - 1);
		return i > n && o(e[i - 1], t) > -o(e[i], t) ? i - 1 : i;
	}
	return {
		left: s,
		center: l,
		right: c
	};
}
function r() {
	return 0;
}
//#endregion
//#region node_modules/d3-array/src/number.js
function i(e) {
	return e === null ? NaN : +e;
}
function* a(e, t) {
	if (t === void 0) for (let t of e) t != null && (t = +t) >= t && (yield t);
	else {
		let n = -1;
		for (let r of e) (r = t(r, ++n, e)) != null && (r = +r) >= r && (yield r);
	}
}
//#endregion
//#region node_modules/d3-array/src/bisect.js
var o = n(e), s = o.right;
o.left, n(i).center;
//#endregion
//#region node_modules/d3-array/src/count.js
function c(e, t) {
	let n = 0;
	if (t === void 0) for (let t of e) t != null && (t = +t) >= t && ++n;
	else {
		let r = -1;
		for (let i of e) (i = t(i, ++r, e)) != null && (i = +i) >= i && ++n;
	}
	return n;
}
//#endregion
//#region node_modules/d3-array/src/cross.js
function l(e) {
	return e.length | 0;
}
function u(e) {
	return !(e > 0);
}
function d(e) {
	return typeof e != "object" || "length" in e ? e : Array.from(e);
}
function f(e) {
	return (t) => e(...t);
}
function p(...e) {
	let t = typeof e[e.length - 1] == "function" && f(e.pop());
	e = e.map(d);
	let n = e.map(l), r = e.length - 1, i = Array(r + 1).fill(0), a = [];
	if (r < 0 || n.some(u)) return a;
	for (;;) {
		a.push(i.map((t, n) => e[n][t]));
		let o = r;
		for (; ++i[o] === n[o];) {
			if (o === 0) return t ? a.map(t) : a;
			i[o--] = 0;
		}
	}
}
//#endregion
//#region node_modules/d3-array/src/cumsum.js
function m(e, t) {
	var n = 0, r = 0;
	return Float64Array.from(e, t === void 0 ? (e) => n += +e || 0 : (i) => n += +t(i, r++, e) || 0);
}
//#endregion
//#region node_modules/d3-array/src/variance.js
function h(e, t) {
	let n = 0, r, i = 0, a = 0;
	if (t === void 0) for (let t of e) t != null && (t = +t) >= t && (r = t - i, i += r / ++n, a += r * (t - i));
	else {
		let o = -1;
		for (let s of e) (s = t(s, ++o, e)) != null && (s = +s) >= s && (r = s - i, i += r / ++n, a += r * (s - i));
	}
	if (n > 1) return a / (n - 1);
}
//#endregion
//#region node_modules/d3-array/src/deviation.js
function g(e, t) {
	let n = h(e, t);
	return n && Math.sqrt(n);
}
//#endregion
//#region node_modules/d3-array/src/extent.js
function _(e, t) {
	let n, r;
	if (t === void 0) for (let t of e) t != null && (n === void 0 ? t >= t && (n = r = t) : (n > t && (n = t), r < t && (r = t)));
	else {
		let i = -1;
		for (let a of e) (a = t(a, ++i, e)) != null && (n === void 0 ? a >= a && (n = r = a) : (n > a && (n = a), r < a && (r = a)));
	}
	return [n, r];
}
//#endregion
//#region node_modules/d3-array/src/fsum.js
var v = class {
	constructor() {
		this._partials = /* @__PURE__ */ new Float64Array(32), this._n = 0;
	}
	add(e) {
		let t = this._partials, n = 0;
		for (let r = 0; r < this._n && r < 32; r++) {
			let i = t[r], a = e + i, o = Math.abs(e) < Math.abs(i) ? e - (a - i) : i - (a - e);
			o && (t[n++] = o), e = a;
		}
		return t[n] = e, this._n = n + 1, this;
	}
	valueOf() {
		let e = this._partials, t = this._n, n, r, i, a = 0;
		if (t > 0) {
			for (a = e[--t]; t > 0 && (n = a, r = e[--t], a = n + r, i = r - (a - n), !i););
			t > 0 && (i < 0 && e[t - 1] < 0 || i > 0 && e[t - 1] > 0) && (r = i * 2, n = a + r, r == n - a && (a = n));
		}
		return a;
	}
}, y = class extends Map {
	constructor(e, t = w) {
		if (super(), Object.defineProperties(this, {
			_intern: { value: /* @__PURE__ */ new Map() },
			_key: { value: t }
		}), e != null) for (let [t, n] of e) this.set(t, n);
	}
	get(e) {
		return super.get(x(this, e));
	}
	has(e) {
		return super.has(x(this, e));
	}
	set(e, t) {
		return super.set(S(this, e), t);
	}
	delete(e) {
		return super.delete(C(this, e));
	}
}, b = class extends Set {
	constructor(e, t = w) {
		if (super(), Object.defineProperties(this, {
			_intern: { value: /* @__PURE__ */ new Map() },
			_key: { value: t }
		}), e != null) for (let t of e) this.add(t);
	}
	has(e) {
		return super.has(x(this, e));
	}
	add(e) {
		return super.add(S(this, e));
	}
	delete(e) {
		return super.delete(C(this, e));
	}
};
function x({ _intern: e, _key: t }, n) {
	let r = t(n);
	return e.has(r) ? e.get(r) : n;
}
function S({ _intern: e, _key: t }, n) {
	let r = t(n);
	return e.has(r) ? e.get(r) : (e.set(r, n), n);
}
function C({ _intern: e, _key: t }, n) {
	let r = t(n);
	return e.has(r) && (n = e.get(r), e.delete(r)), n;
}
function w(e) {
	return typeof e == "object" && e ? e.valueOf() : e;
}
//#endregion
//#region node_modules/d3-array/src/identity.js
function T(e) {
	return e;
}
//#endregion
//#region node_modules/d3-array/src/group.js
function E(e, ...t) {
	return k(e, T, T, t);
}
function D(e, t, ...n) {
	return k(e, T, t, n);
}
function O(e, t, ...n) {
	return k(e, Array.from, t, n);
}
function k(e, t, n, r) {
	return (function e(i, a) {
		if (a >= r.length) return n(i);
		let o = new y(), s = r[a++], c = -1;
		for (let e of i) {
			let t = s(e, ++c, i), n = o.get(t);
			n ? n.push(e) : o.set(t, [e]);
		}
		for (let [t, n] of o) o.set(t, e(n, a));
		return t(o);
	})(e, 0);
}
//#endregion
//#region node_modules/d3-array/src/permute.js
function A(e, t) {
	return Array.from(t, (t) => e[t]);
}
//#endregion
//#region node_modules/d3-array/src/sort.js
function j(e, ...t) {
	if (typeof e[Symbol.iterator] != "function") throw TypeError("values is not iterable");
	e = Array.from(e);
	let [n] = t;
	if (n && n.length !== 2 || t.length > 1) {
		let r = Uint32Array.from(e, (e, t) => t);
		return t.length > 1 ? (t = t.map((t) => e.map(t)), r.sort((e, n) => {
			for (let r of t) {
				let t = te(r[e], r[n]);
				if (t) return t;
			}
		})) : (n = e.map(n), r.sort((e, t) => te(n[e], n[t]))), A(e, r);
	}
	return e.sort(ee(n));
}
function ee(t = e) {
	if (t === e) return te;
	if (typeof t != "function") throw TypeError("compare is not a function");
	return (e, n) => {
		let r = t(e, n);
		return r || r === 0 ? r : (t(n, n) === 0) - (t(e, e) === 0);
	};
}
function te(e, t) {
	return (e == null || !(e >= e)) - (t == null || !(t >= t)) || (e < t ? -1 : +(e > t));
}
//#endregion
//#region node_modules/d3-array/src/groupSort.js
function ne(t, n, r) {
	return (n.length === 2 ? j(E(t, r), (([t, r], [i, a]) => n(r, a) || e(t, i))) : j(D(t, n, r), (([t, n], [r, i]) => e(n, i) || e(t, r)))).map(([e]) => e);
}
//#endregion
//#region node_modules/d3-array/src/ticks.js
var re = Math.sqrt(50), ie = Math.sqrt(10), ae = Math.sqrt(2);
function oe(e, t, n) {
	let r = (t - e) / Math.max(0, n), i = Math.floor(Math.log10(r)), a = r / 10 ** i, o = a >= re ? 10 : a >= ie ? 5 : a >= ae ? 2 : 1, s, c, l;
	return i < 0 ? (l = 10 ** -i / o, s = Math.round(e * l), c = Math.round(t * l), s / l < e && ++s, c / l > t && --c, l = -l) : (l = 10 ** i * o, s = Math.round(e / l), c = Math.round(t / l), s * l < e && ++s, c * l > t && --c), c < s && .5 <= n && n < 2 ? oe(e, t, n * 2) : [
		s,
		c,
		l
	];
}
function se(e, t, n) {
	if (t = +t, e = +e, n = +n, !(n > 0)) return [];
	if (e === t) return [e];
	let r = t < e, [i, a, o] = r ? oe(t, e, n) : oe(e, t, n);
	if (!(a >= i)) return [];
	let s = a - i + 1, c = Array(s);
	if (r) {
		if (o < 0) for (let e = 0; e < s; ++e) c[e] = (a - e) / -o;
		else for (let e = 0; e < s; ++e) c[e] = (a - e) * o;
	} else if (o < 0) for (let e = 0; e < s; ++e) c[e] = (i + e) / -o;
	else for (let e = 0; e < s; ++e) c[e] = (i + e) * o;
	return c;
}
function ce(e, t, n) {
	return t = +t, e = +e, n = +n, oe(e, t, n)[2];
}
function le(e, t, n) {
	t = +t, e = +e, n = +n;
	let r = t < e, i = r ? ce(t, e, n) : ce(e, t, n);
	return (r ? -1 : 1) * (i < 0 ? 1 / -i : i);
}
//#endregion
//#region node_modules/d3-array/src/threshold/sturges.js
function ue(e) {
	return Math.max(1, Math.ceil(Math.log(c(e)) / Math.LN2) + 1);
}
//#endregion
//#region node_modules/d3-array/src/max.js
function de(e, t) {
	let n;
	if (t === void 0) for (let t of e) t != null && (n < t || n === void 0 && t >= t) && (n = t);
	else {
		let r = -1;
		for (let i of e) (i = t(i, ++r, e)) != null && (n < i || n === void 0 && i >= i) && (n = i);
	}
	return n;
}
//#endregion
//#region node_modules/d3-array/src/maxIndex.js
function fe(e, t) {
	let n, r = -1, i = -1;
	if (t === void 0) for (let t of e) ++i, t != null && (n < t || n === void 0 && t >= t) && (n = t, r = i);
	else for (let a of e) (a = t(a, ++i, e)) != null && (n < a || n === void 0 && a >= a) && (n = a, r = i);
	return r;
}
//#endregion
//#region node_modules/d3-array/src/min.js
function pe(e, t) {
	let n;
	if (t === void 0) for (let t of e) t != null && (n > t || n === void 0 && t >= t) && (n = t);
	else {
		let r = -1;
		for (let i of e) (i = t(i, ++r, e)) != null && (n > i || n === void 0 && i >= i) && (n = i);
	}
	return n;
}
//#endregion
//#region node_modules/d3-array/src/minIndex.js
function me(e, t) {
	let n, r = -1, i = -1;
	if (t === void 0) for (let t of e) ++i, t != null && (n > t || n === void 0 && t >= t) && (n = t, r = i);
	else for (let a of e) (a = t(a, ++i, e)) != null && (n > a || n === void 0 && a >= a) && (n = a, r = i);
	return r;
}
//#endregion
//#region node_modules/d3-array/src/quickselect.js
function he(e, t, n = 0, r = Infinity, i) {
	if (t = Math.floor(t), n = Math.floor(Math.max(0, n)), r = Math.floor(Math.min(e.length - 1, r)), !(n <= t && t <= r)) return e;
	for (i = i === void 0 ? te : ee(i); r > n;) {
		if (r - n > 600) {
			let a = r - n + 1, o = t - n + 1, s = Math.log(a), c = .5 * Math.exp(2 * s / 3), l = .5 * Math.sqrt(s * c * (a - c) / a) * (o - a / 2 < 0 ? -1 : 1), u = Math.max(n, Math.floor(t - o * c / a + l)), d = Math.min(r, Math.floor(t + (a - o) * c / a + l));
			he(e, t, u, d, i);
		}
		let a = e[t], o = n, s = r;
		for (ge(e, n, t), i(e[r], a) > 0 && ge(e, n, r); o < s;) {
			for (ge(e, o, s), ++o, --s; i(e[o], a) < 0;) ++o;
			for (; i(e[s], a) > 0;) --s;
		}
		i(e[n], a) === 0 ? ge(e, n, s) : (++s, ge(e, s, r)), s <= t && (n = s + 1), t <= s && (r = s - 1);
	}
	return e;
}
function ge(e, t, n) {
	let r = e[t];
	e[t] = e[n], e[n] = r;
}
//#endregion
//#region node_modules/d3-array/src/greatest.js
function _e(t, n = e) {
	let r, i = !1;
	if (n.length === 1) {
		let a;
		for (let o of t) {
			let t = n(o);
			(i ? e(t, a) > 0 : e(t, t) === 0) && (r = o, a = t, i = !0);
		}
	} else for (let e of t) (i ? n(e, r) > 0 : n(e, e) === 0) && (r = e, i = !0);
	return r;
}
//#endregion
//#region node_modules/d3-array/src/quantile.js
function ve(e, t, n) {
	if (e = Float64Array.from(a(e, n)), !(!(r = e.length) || isNaN(t = +t))) {
		if (t <= 0 || r < 2) return pe(e);
		if (t >= 1) return de(e);
		var r, i = (r - 1) * t, o = Math.floor(i), s = de(he(e, o).subarray(0, o + 1));
		return s + (pe(e.subarray(o + 1)) - s) * (i - o);
	}
}
function ye(e, t, n = i) {
	if (!(!(r = e.length) || isNaN(t = +t))) {
		if (t <= 0 || r < 2) return +n(e[0], 0, e);
		if (t >= 1) return +n(e[r - 1], r - 1, e);
		var r, a = (r - 1) * t, o = Math.floor(a), s = +n(e[o], o, e);
		return s + (+n(e[o + 1], o + 1, e) - s) * (a - o);
	}
}
//#endregion
//#region node_modules/d3-array/src/threshold/freedmanDiaconis.js
function be(e, t, n) {
	let r = c(e), i = ve(e, .75) - ve(e, .25);
	return r && i ? Math.ceil((n - t) / (2 * i * r ** (-1 / 3))) : 1;
}
//#endregion
//#region node_modules/d3-array/src/threshold/scott.js
function xe(e, t, n) {
	let r = c(e), i = g(e);
	return r && i ? Math.ceil((n - t) * Math.cbrt(r) / (3.49 * i)) : 1;
}
//#endregion
//#region node_modules/d3-array/src/mean.js
function Se(e, t) {
	let n = 0, r = 0;
	if (t === void 0) for (let t of e) t != null && (t = +t) >= t && (++n, r += t);
	else {
		let i = -1;
		for (let a of e) (a = t(a, ++i, e)) != null && (a = +a) >= a && (++n, r += a);
	}
	if (n) return r / n;
}
//#endregion
//#region node_modules/d3-array/src/median.js
function Ce(e, t) {
	return ve(e, .5, t);
}
//#endregion
//#region node_modules/d3-array/src/merge.js
function* we(e) {
	for (let t of e) yield* t;
}
function Te(e) {
	return Array.from(we(e));
}
//#endregion
//#region node_modules/d3-array/src/mode.js
function Ee(e, t) {
	let n = new y();
	if (t === void 0) for (let t of e) t != null && t >= t && n.set(t, (n.get(t) || 0) + 1);
	else {
		let r = -1;
		for (let i of e) (i = t(i, ++r, e)) != null && i >= i && n.set(i, (n.get(i) || 0) + 1);
	}
	let r, i = 0;
	for (let [e, t] of n) t > i && (i = t, r = e);
	return r;
}
//#endregion
//#region node_modules/d3-array/src/pairs.js
function De(e, t = Oe) {
	let n = [], r, i = !1;
	for (let a of e) i && n.push(t(r, a)), r = a, i = !0;
	return n;
}
function Oe(e, t) {
	return [e, t];
}
//#endregion
//#region node_modules/d3-array/src/range.js
function ke(e, t, n) {
	e = +e, t = +t, n = (i = arguments.length) < 2 ? (t = e, e = 0, 1) : i < 3 ? 1 : +n;
	for (var r = -1, i = Math.max(0, Math.ceil((t - e) / n)) | 0, a = Array(i); ++r < i;) a[r] = e + r * n;
	return a;
}
//#endregion
//#region node_modules/d3-array/src/sum.js
function Ae(e, t) {
	let n = 0;
	if (t === void 0) for (let t of e) (t = +t) && (n += t);
	else {
		let r = -1;
		for (let i of e) (i = +t(i, ++r, e)) && (n += i);
	}
	return n;
}
//#endregion
//#region node_modules/d3-array/src/reverse.js
function je(e) {
	if (typeof e[Symbol.iterator] != "function") throw TypeError("values is not iterable");
	return Array.from(e).reverse();
}
//#endregion
//#region node_modules/d3-axis/src/identity.js
function Me(e) {
	return e;
}
//#endregion
//#region node_modules/d3-axis/src/axis.js
var Ne = 1, Pe = 2, Fe = 3, Ie = 4, Le = 1e-6;
function Re(e) {
	return "translate(" + e + ",0)";
}
function ze(e) {
	return "translate(0," + e + ")";
}
function Be(e) {
	return (t) => +e(t);
}
function Ve(e, t) {
	return t = Math.max(0, e.bandwidth() - t * 2) / 2, e.round() && (t = Math.round(t)), (n) => +e(n) + t;
}
function He() {
	return !this.__axis;
}
function Ue(e, t) {
	var n = [], r = null, i = null, a = 6, o = 6, s = 3, c = typeof window < "u" && window.devicePixelRatio > 1 ? 0 : .5, l = e === Ne || e === Ie ? -1 : 1, u = e === Ie || e === Pe ? "x" : "y", d = e === Ne || e === Fe ? Re : ze;
	function f(f) {
		var p = r ?? (t.ticks ? t.ticks.apply(t, n) : t.domain()), m = i ?? (t.tickFormat ? t.tickFormat.apply(t, n) : Me), h = Math.max(a, 0) + s, g = t.range(), _ = +g[0] + c, v = +g[g.length - 1] + c, y = (t.bandwidth ? Ve : Be)(t.copy(), c), b = f.selection ? f.selection() : f, x = b.selectAll(".domain").data([null]), S = b.selectAll(".tick").data(p, t).order(), C = S.exit(), w = S.enter().append("g").attr("class", "tick"), T = S.select("line"), E = S.select("text");
		x = x.merge(x.enter().insert("path", ".tick").attr("class", "domain").attr("stroke", "currentColor")), S = S.merge(w), T = T.merge(w.append("line").attr("stroke", "currentColor").attr(u + "2", l * a)), E = E.merge(w.append("text").attr("fill", "currentColor").attr(u, l * h).attr("dy", e === Ne ? "0em" : e === Fe ? "0.71em" : "0.32em")), f !== b && (x = x.transition(f), S = S.transition(f), T = T.transition(f), E = E.transition(f), C = C.transition(f).attr("opacity", Le).attr("transform", function(e) {
			return isFinite(e = y(e)) ? d(e + c) : this.getAttribute("transform");
		}), w.attr("opacity", Le).attr("transform", function(e) {
			var t = this.parentNode.__axis;
			return d((t && isFinite(t = t(e)) ? t : y(e)) + c);
		})), C.remove(), x.attr("d", e === Ie || e === Pe ? o ? "M" + l * o + "," + _ + "H" + c + "V" + v + "H" + l * o : "M" + c + "," + _ + "V" + v : o ? "M" + _ + "," + l * o + "V" + c + "H" + v + "V" + l * o : "M" + _ + "," + c + "H" + v), S.attr("opacity", 1).attr("transform", function(e) {
			return d(y(e) + c);
		}), T.attr(u + "2", l * a), E.attr(u, l * h).text(m), b.filter(He).attr("fill", "none").attr("font-size", 10).attr("font-family", "sans-serif").attr("text-anchor", e === Pe ? "start" : e === Ie ? "end" : "middle"), b.each(function() {
			this.__axis = y;
		});
	}
	return f.scale = function(e) {
		return arguments.length ? (t = e, f) : t;
	}, f.ticks = function() {
		return n = Array.from(arguments), f;
	}, f.tickArguments = function(e) {
		return arguments.length ? (n = e == null ? [] : Array.from(e), f) : n.slice();
	}, f.tickValues = function(e) {
		return arguments.length ? (r = e == null ? null : Array.from(e), f) : r && r.slice();
	}, f.tickFormat = function(e) {
		return arguments.length ? (i = e, f) : i;
	}, f.tickSize = function(e) {
		return arguments.length ? (a = o = +e, f) : a;
	}, f.tickSizeInner = function(e) {
		return arguments.length ? (a = +e, f) : a;
	}, f.tickSizeOuter = function(e) {
		return arguments.length ? (o = +e, f) : o;
	}, f.tickPadding = function(e) {
		return arguments.length ? (s = +e, f) : s;
	}, f.offset = function(e) {
		return arguments.length ? (c = +e, f) : c;
	}, f;
}
function We(e) {
	return Ue(Fe, e);
}
//#endregion
//#region node_modules/d3-dispatch/src/dispatch.js
var Ge = { value: () => {} };
function Ke() {
	for (var e = 0, t = arguments.length, n = {}, r; e < t; ++e) {
		if (!(r = arguments[e] + "") || r in n || /[\s.]/.test(r)) throw Error("illegal type: " + r);
		n[r] = [];
	}
	return new qe(n);
}
function qe(e) {
	this._ = e;
}
function Je(e, t) {
	return e.trim().split(/^|\s+/).map(function(e) {
		var n = "", r = e.indexOf(".");
		if (r >= 0 && (n = e.slice(r + 1), e = e.slice(0, r)), e && !t.hasOwnProperty(e)) throw Error("unknown type: " + e);
		return {
			type: e,
			name: n
		};
	});
}
qe.prototype = Ke.prototype = {
	constructor: qe,
	on: function(e, t) {
		var n = this._, r = Je(e + "", n), i, a = -1, o = r.length;
		if (arguments.length < 2) {
			for (; ++a < o;) if ((i = (e = r[a]).type) && (i = Ye(n[i], e.name))) return i;
			return;
		}
		if (t != null && typeof t != "function") throw Error("invalid callback: " + t);
		for (; ++a < o;) if (i = (e = r[a]).type) n[i] = Xe(n[i], e.name, t);
		else if (t == null) for (i in n) n[i] = Xe(n[i], e.name, null);
		return this;
	},
	copy: function() {
		var e = {}, t = this._;
		for (var n in t) e[n] = t[n].slice();
		return new qe(e);
	},
	call: function(e, t) {
		if ((i = arguments.length - 2) > 0) for (var n = Array(i), r = 0, i, a; r < i; ++r) n[r] = arguments[r + 2];
		if (!this._.hasOwnProperty(e)) throw Error("unknown type: " + e);
		for (a = this._[e], r = 0, i = a.length; r < i; ++r) a[r].value.apply(t, n);
	},
	apply: function(e, t, n) {
		if (!this._.hasOwnProperty(e)) throw Error("unknown type: " + e);
		for (var r = this._[e], i = 0, a = r.length; i < a; ++i) r[i].value.apply(t, n);
	}
};
function Ye(e, t) {
	for (var n = 0, r = e.length, i; n < r; ++n) if ((i = e[n]).name === t) return i.value;
}
function Xe(e, t, n) {
	for (var r = 0, i = e.length; r < i; ++r) if (e[r].name === t) {
		e[r] = Ge, e = e.slice(0, r).concat(e.slice(r + 1));
		break;
	}
	return n != null && e.push({
		name: t,
		value: n
	}), e;
}
var Ze = {
	svg: "http://www.w3.org/2000/svg",
	xhtml: "http://www.w3.org/1999/xhtml",
	xlink: "http://www.w3.org/1999/xlink",
	xml: "http://www.w3.org/XML/1998/namespace",
	xmlns: "http://www.w3.org/2000/xmlns/"
};
//#endregion
//#region node_modules/d3-selection/src/namespace.js
function Qe(e) {
	var t = e += "", n = t.indexOf(":");
	return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), Ze.hasOwnProperty(t) ? {
		space: Ze[t],
		local: e
	} : e;
}
//#endregion
//#region node_modules/d3-selection/src/creator.js
function $e(e) {
	return function() {
		var t = this.ownerDocument, n = this.namespaceURI;
		return n === "http://www.w3.org/1999/xhtml" && t.documentElement.namespaceURI === "http://www.w3.org/1999/xhtml" ? t.createElement(e) : t.createElementNS(n, e);
	};
}
function et(e) {
	return function() {
		return this.ownerDocument.createElementNS(e.space, e.local);
	};
}
function tt(e) {
	var t = Qe(e);
	return (t.local ? et : $e)(t);
}
//#endregion
//#region node_modules/d3-selection/src/selector.js
function nt() {}
function rt(e) {
	return e == null ? nt : function() {
		return this.querySelector(e);
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/select.js
function at(e) {
	typeof e != "function" && (e = rt(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = Array(o), c, l, u = 0; u < o; ++u) (c = a[u]) && (l = e.call(c, c.__data__, u, a)) && ("__data__" in c && (l.__data__ = c.__data__), s[u] = l);
	return new Jn(r, this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/array.js
function ot(e) {
	return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
//#endregion
//#region node_modules/d3-selection/src/selectorAll.js
function st() {
	return [];
}
function ct(e) {
	return e == null ? st : function() {
		return this.querySelectorAll(e);
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/selectAll.js
function lt(e) {
	return function() {
		return ot(e.apply(this, arguments));
	};
}
function ut(e) {
	e = typeof e == "function" ? lt(e) : ct(e);
	for (var t = this._groups, n = t.length, r = [], i = [], a = 0; a < n; ++a) for (var o = t[a], s = o.length, c, l = 0; l < s; ++l) (c = o[l]) && (r.push(e.call(c, c.__data__, l, o)), i.push(c));
	return new Jn(r, i);
}
//#endregion
//#region node_modules/d3-selection/src/matcher.js
function dt(e) {
	return function() {
		return this.matches(e);
	};
}
function ft(e) {
	return function(t) {
		return t.matches(e);
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/selectChild.js
var pt = Array.prototype.find;
function mt(e) {
	return function() {
		return pt.call(this.children, e);
	};
}
function ht() {
	return this.firstElementChild;
}
function gt(e) {
	return this.select(e == null ? ht : mt(typeof e == "function" ? e : ft(e)));
}
//#endregion
//#region node_modules/d3-selection/src/selection/selectChildren.js
var _t = Array.prototype.filter;
function vt() {
	return Array.from(this.children);
}
function yt(e) {
	return function() {
		return _t.call(this.children, e);
	};
}
function bt(e) {
	return this.selectAll(e == null ? vt : yt(typeof e == "function" ? e : ft(e)));
}
//#endregion
//#region node_modules/d3-selection/src/selection/filter.js
function xt(e) {
	typeof e != "function" && (e = dt(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = [], c, l = 0; l < o; ++l) (c = a[l]) && e.call(c, c.__data__, l, a) && s.push(c);
	return new Jn(r, this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/selection/sparse.js
function St(e) {
	return Array(e.length);
}
//#endregion
//#region node_modules/d3-selection/src/selection/enter.js
function Ct() {
	return new Jn(this._enter || this._groups.map(St), this._parents);
}
function wt(e, t) {
	this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
wt.prototype = {
	constructor: wt,
	appendChild: function(e) {
		return this._parent.insertBefore(e, this._next);
	},
	insertBefore: function(e, t) {
		return this._parent.insertBefore(e, t);
	},
	querySelector: function(e) {
		return this._parent.querySelector(e);
	},
	querySelectorAll: function(e) {
		return this._parent.querySelectorAll(e);
	}
};
//#endregion
//#region node_modules/d3-selection/src/constant.js
function Tt(e) {
	return function() {
		return e;
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/data.js
function Et(e, t, n, r, i, a) {
	for (var o = 0, s, c = t.length, l = a.length; o < l; ++o) (s = t[o]) ? (s.__data__ = a[o], r[o] = s) : n[o] = new wt(e, a[o]);
	for (; o < c; ++o) (s = t[o]) && (i[o] = s);
}
function Dt(e, t, n, r, i, a, o) {
	var s, c, l = /* @__PURE__ */ new Map(), u = t.length, d = a.length, f = Array(u), p;
	for (s = 0; s < u; ++s) (c = t[s]) && (f[s] = p = o.call(c, c.__data__, s, t) + "", l.has(p) ? i[s] = c : l.set(p, c));
	for (s = 0; s < d; ++s) p = o.call(e, a[s], s, a) + "", (c = l.get(p)) ? (r[s] = c, c.__data__ = a[s], l.delete(p)) : n[s] = new wt(e, a[s]);
	for (s = 0; s < u; ++s) (c = t[s]) && l.get(f[s]) === c && (i[s] = c);
}
function Ot(e) {
	return e.__data__;
}
function kt(e, t) {
	if (!arguments.length) return Array.from(this, Ot);
	var n = t ? Dt : Et, r = this._parents, i = this._groups;
	typeof e != "function" && (e = Tt(e));
	for (var a = i.length, o = Array(a), s = Array(a), c = Array(a), l = 0; l < a; ++l) {
		var u = r[l], d = i[l], f = d.length, p = At(e.call(u, u && u.__data__, l, r)), m = p.length, h = s[l] = Array(m), g = o[l] = Array(m);
		n(u, d, h, g, c[l] = Array(f), p, t);
		for (var _ = 0, v = 0, y, b; _ < m; ++_) if (y = h[_]) {
			for (_ >= v && (v = _ + 1); !(b = g[v]) && ++v < m;);
			y._next = b || null;
		}
	}
	return o = new Jn(o, r), o._enter = s, o._exit = c, o;
}
function At(e) {
	return typeof e == "object" && "length" in e ? e : Array.from(e);
}
//#endregion
//#region node_modules/d3-selection/src/selection/exit.js
function jt() {
	return new Jn(this._exit || this._groups.map(St), this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/selection/join.js
function Mt(e, t, n) {
	var r = this.enter(), i = this, a = this.exit();
	return typeof e == "function" ? (r = e(r), r &&= r.selection()) : r = r.append(e + ""), t != null && (i = t(i), i &&= i.selection()), n == null ? a.remove() : n(a), r && i ? r.merge(i).order() : i;
}
//#endregion
//#region node_modules/d3-selection/src/selection/merge.js
function Nt(e) {
	for (var t = e.selection ? e.selection() : e, n = this._groups, r = t._groups, i = n.length, a = r.length, o = Math.min(i, a), s = Array(i), c = 0; c < o; ++c) for (var l = n[c], u = r[c], d = l.length, f = s[c] = Array(d), p, m = 0; m < d; ++m) (p = l[m] || u[m]) && (f[m] = p);
	for (; c < i; ++c) s[c] = n[c];
	return new Jn(s, this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/selection/order.js
function Pt() {
	for (var e = this._groups, t = -1, n = e.length; ++t < n;) for (var r = e[t], i = r.length - 1, a = r[i], o; --i >= 0;) (o = r[i]) && (a && o.compareDocumentPosition(a) ^ 4 && a.parentNode.insertBefore(o, a), a = o);
	return this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/sort.js
function Ft(e) {
	e ||= It;
	function t(t, n) {
		return t && n ? e(t.__data__, n.__data__) : !t - !n;
	}
	for (var n = this._groups, r = n.length, i = Array(r), a = 0; a < r; ++a) {
		for (var o = n[a], s = o.length, c = i[a] = Array(s), l, u = 0; u < s; ++u) (l = o[u]) && (c[u] = l);
		c.sort(t);
	}
	return new Jn(i, this._parents).order();
}
function It(e, t) {
	return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
//#endregion
//#region node_modules/d3-selection/src/selection/call.js
function Lt() {
	var e = arguments[0];
	return arguments[0] = this, e.apply(null, arguments), this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/nodes.js
function Rt() {
	return Array.from(this);
}
//#endregion
//#region node_modules/d3-selection/src/selection/node.js
function zt() {
	for (var e = this._groups, t = 0, n = e.length; t < n; ++t) for (var r = e[t], i = 0, a = r.length; i < a; ++i) {
		var o = r[i];
		if (o) return o;
	}
	return null;
}
//#endregion
//#region node_modules/d3-selection/src/selection/size.js
function Bt() {
	let e = 0;
	for (let t of this) ++e;
	return e;
}
//#endregion
//#region node_modules/d3-selection/src/selection/empty.js
function Vt() {
	return !this.node();
}
//#endregion
//#region node_modules/d3-selection/src/selection/each.js
function Ht(e) {
	for (var t = this._groups, n = 0, r = t.length; n < r; ++n) for (var i = t[n], a = 0, o = i.length, s; a < o; ++a) (s = i[a]) && e.call(s, s.__data__, a, i);
	return this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/attr.js
function Ut(e) {
	return function() {
		this.removeAttribute(e);
	};
}
function Wt(e) {
	return function() {
		this.removeAttributeNS(e.space, e.local);
	};
}
function Gt(e, t) {
	return function() {
		this.setAttribute(e, t);
	};
}
function Kt(e, t) {
	return function() {
		this.setAttributeNS(e.space, e.local, t);
	};
}
function qt(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
	};
}
function Jt(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
	};
}
function Yt(e, t) {
	var n = Qe(e);
	if (arguments.length < 2) {
		var r = this.node();
		return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
	}
	return this.each((t == null ? n.local ? Wt : Ut : typeof t == "function" ? n.local ? Jt : qt : n.local ? Kt : Gt)(n, t));
}
//#endregion
//#region node_modules/d3-selection/src/window.js
function Xt(e) {
	return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
//#endregion
//#region node_modules/d3-selection/src/selection/style.js
function Zt(e) {
	return function() {
		this.style.removeProperty(e);
	};
}
function Qt(e, t, n) {
	return function() {
		this.style.setProperty(e, t, n);
	};
}
function $t(e, t, n) {
	return function() {
		var r = t.apply(this, arguments);
		r == null ? this.style.removeProperty(e) : this.style.setProperty(e, r, n);
	};
}
function en(e, t, n) {
	return arguments.length > 1 ? this.each((t == null ? Zt : typeof t == "function" ? $t : Qt)(e, t, n ?? "")) : tn(this.node(), e);
}
function tn(e, t) {
	return e.style.getPropertyValue(t) || Xt(e).getComputedStyle(e, null).getPropertyValue(t);
}
//#endregion
//#region node_modules/d3-selection/src/selection/property.js
function nn(e) {
	return function() {
		delete this[e];
	};
}
function rn(e, t) {
	return function() {
		this[e] = t;
	};
}
function an(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? delete this[e] : this[e] = n;
	};
}
function on(e, t) {
	return arguments.length > 1 ? this.each((t == null ? nn : typeof t == "function" ? an : rn)(e, t)) : this.node()[e];
}
//#endregion
//#region node_modules/d3-selection/src/selection/classed.js
function sn(e) {
	return e.trim().split(/^|\s+/);
}
function cn(e) {
	return e.classList || new ln(e);
}
function ln(e) {
	this._node = e, this._names = sn(e.getAttribute("class") || "");
}
ln.prototype = {
	add: function(e) {
		this._names.indexOf(e) < 0 && (this._names.push(e), this._node.setAttribute("class", this._names.join(" ")));
	},
	remove: function(e) {
		var t = this._names.indexOf(e);
		t >= 0 && (this._names.splice(t, 1), this._node.setAttribute("class", this._names.join(" ")));
	},
	contains: function(e) {
		return this._names.indexOf(e) >= 0;
	}
};
function un(e, t) {
	for (var n = cn(e), r = -1, i = t.length; ++r < i;) n.add(t[r]);
}
function dn(e, t) {
	for (var n = cn(e), r = -1, i = t.length; ++r < i;) n.remove(t[r]);
}
function fn(e) {
	return function() {
		un(this, e);
	};
}
function pn(e) {
	return function() {
		dn(this, e);
	};
}
function mn(e, t) {
	return function() {
		(t.apply(this, arguments) ? un : dn)(this, e);
	};
}
function hn(e, t) {
	var n = sn(e + "");
	if (arguments.length < 2) {
		for (var r = cn(this.node()), i = -1, a = n.length; ++i < a;) if (!r.contains(n[i])) return !1;
		return !0;
	}
	return this.each((typeof t == "function" ? mn : t ? fn : pn)(n, t));
}
//#endregion
//#region node_modules/d3-selection/src/selection/text.js
function gn() {
	this.textContent = "";
}
function _n(e) {
	return function() {
		this.textContent = e;
	};
}
function vn(e) {
	return function() {
		var t = e.apply(this, arguments);
		this.textContent = t ?? "";
	};
}
function yn(e) {
	return arguments.length ? this.each(e == null ? gn : (typeof e == "function" ? vn : _n)(e)) : this.node().textContent;
}
//#endregion
//#region node_modules/d3-selection/src/selection/html.js
function bn() {
	this.innerHTML = "";
}
function xn(e) {
	return function() {
		this.innerHTML = e;
	};
}
function Sn(e) {
	return function() {
		var t = e.apply(this, arguments);
		this.innerHTML = t ?? "";
	};
}
function Cn(e) {
	return arguments.length ? this.each(e == null ? bn : (typeof e == "function" ? Sn : xn)(e)) : this.node().innerHTML;
}
//#endregion
//#region node_modules/d3-selection/src/selection/raise.js
function wn() {
	this.nextSibling && this.parentNode.appendChild(this);
}
function Tn() {
	return this.each(wn);
}
//#endregion
//#region node_modules/d3-selection/src/selection/lower.js
function En() {
	this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function Dn() {
	return this.each(En);
}
//#endregion
//#region node_modules/d3-selection/src/selection/append.js
function On(e) {
	var t = typeof e == "function" ? e : tt(e);
	return this.select(function() {
		return this.appendChild(t.apply(this, arguments));
	});
}
//#endregion
//#region node_modules/d3-selection/src/selection/insert.js
function kn() {
	return null;
}
function An(e, t) {
	var n = typeof e == "function" ? e : tt(e), r = t == null ? kn : typeof t == "function" ? t : rt(t);
	return this.select(function() {
		return this.insertBefore(n.apply(this, arguments), r.apply(this, arguments) || null);
	});
}
//#endregion
//#region node_modules/d3-selection/src/selection/remove.js
function jn() {
	var e = this.parentNode;
	e && e.removeChild(this);
}
function Mn() {
	return this.each(jn);
}
//#endregion
//#region node_modules/d3-selection/src/selection/clone.js
function Nn() {
	var e = this.cloneNode(!1), t = this.parentNode;
	return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Pn() {
	var e = this.cloneNode(!0), t = this.parentNode;
	return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Fn(e) {
	return this.select(e ? Pn : Nn);
}
//#endregion
//#region node_modules/d3-selection/src/selection/datum.js
function In(e) {
	return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
//#endregion
//#region node_modules/d3-selection/src/selection/on.js
function Ln(e) {
	return function(t) {
		e.call(this, t, this.__data__);
	};
}
function Rn(e) {
	return e.trim().split(/^|\s+/).map(function(e) {
		var t = "", n = e.indexOf(".");
		return n >= 0 && (t = e.slice(n + 1), e = e.slice(0, n)), {
			type: e,
			name: t
		};
	});
}
function zn(e) {
	return function() {
		var t = this.__on;
		if (t) {
			for (var n = 0, r = -1, i = t.length, a; n < i; ++n) a = t[n], (!e.type || a.type === e.type) && a.name === e.name ? this.removeEventListener(a.type, a.listener, a.options) : t[++r] = a;
			++r ? t.length = r : delete this.__on;
		}
	};
}
function Bn(e, t, n) {
	return function() {
		var r = this.__on, i, a = Ln(t);
		if (r) {
			for (var o = 0, s = r.length; o < s; ++o) if ((i = r[o]).type === e.type && i.name === e.name) {
				this.removeEventListener(i.type, i.listener, i.options), this.addEventListener(i.type, i.listener = a, i.options = n), i.value = t;
				return;
			}
		}
		this.addEventListener(e.type, a, n), i = {
			type: e.type,
			name: e.name,
			value: t,
			listener: a,
			options: n
		}, r ? r.push(i) : this.__on = [i];
	};
}
function Vn(e, t, n) {
	var r = Rn(e + ""), i, a = r.length, o;
	if (arguments.length < 2) {
		var s = this.node().__on;
		if (s) {
			for (var c = 0, l = s.length, u; c < l; ++c) for (i = 0, u = s[c]; i < a; ++i) if ((o = r[i]).type === u.type && o.name === u.name) return u.value;
		}
		return;
	}
	for (s = t ? Bn : zn, i = 0; i < a; ++i) this.each(s(r[i], t, n));
	return this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/dispatch.js
function Hn(e, t, n) {
	var r = Xt(e), i = r.CustomEvent;
	typeof i == "function" ? i = new i(t, n) : (i = r.document.createEvent("Event"), n ? (i.initEvent(t, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(t, !1, !1)), e.dispatchEvent(i);
}
function Un(e, t) {
	return function() {
		return Hn(this, e, t);
	};
}
function Wn(e, t) {
	return function() {
		return Hn(this, e, t.apply(this, arguments));
	};
}
function Gn(e, t) {
	return this.each((typeof t == "function" ? Wn : Un)(e, t));
}
//#endregion
//#region node_modules/d3-selection/src/selection/iterator.js
function* Kn() {
	for (var e = this._groups, t = 0, n = e.length; t < n; ++t) for (var r = e[t], i = 0, a = r.length, o; i < a; ++i) (o = r[i]) && (yield o);
}
//#endregion
//#region node_modules/d3-selection/src/selection/index.js
var qn = [null];
function Jn(e, t) {
	this._groups = e, this._parents = t;
}
function Yn() {
	return new Jn([[document.documentElement]], qn);
}
function Xn() {
	return this;
}
Jn.prototype = Yn.prototype = {
	constructor: Jn,
	select: at,
	selectAll: ut,
	selectChild: gt,
	selectChildren: bt,
	filter: xt,
	data: kt,
	enter: Ct,
	exit: jt,
	join: Mt,
	merge: Nt,
	selection: Xn,
	order: Pt,
	sort: Ft,
	call: Lt,
	nodes: Rt,
	node: zt,
	size: Bt,
	empty: Vt,
	each: Ht,
	attr: Yt,
	style: en,
	property: on,
	classed: hn,
	text: yn,
	html: Cn,
	raise: Tn,
	lower: Dn,
	append: On,
	insert: An,
	remove: Mn,
	clone: Fn,
	datum: In,
	on: Vn,
	dispatch: Gn,
	[Symbol.iterator]: Kn
};
//#endregion
//#region node_modules/d3-selection/src/select.js
function Zn(e) {
	return typeof e == "string" ? new Jn([[document.querySelector(e)]], [document.documentElement]) : new Jn([[e]], qn);
}
//#endregion
//#region node_modules/d3-selection/src/sourceEvent.js
function Qn(e) {
	let t;
	for (; t = e.sourceEvent;) e = t;
	return e;
}
//#endregion
//#region node_modules/d3-selection/src/pointer.js
function $n(e, t) {
	if (e = Qn(e), t === void 0 && (t = e.currentTarget), t) {
		var n = t.ownerSVGElement || t;
		if (n.createSVGPoint) {
			var r = n.createSVGPoint();
			return r.x = e.clientX, r.y = e.clientY, r = r.matrixTransform(t.getScreenCTM().inverse()), [r.x, r.y];
		}
		if (t.getBoundingClientRect) {
			var i = t.getBoundingClientRect();
			return [e.clientX - i.left - t.clientLeft, e.clientY - i.top - t.clientTop];
		}
	}
	return [e.pageX, e.pageY];
}
//#endregion
//#region node_modules/d3-color/src/define.js
function er(e, t, n) {
	e.prototype = t.prototype = n, n.constructor = e;
}
function tr(e, t) {
	var n = Object.create(e.prototype);
	for (var r in t) n[r] = t[r];
	return n;
}
//#endregion
//#region node_modules/d3-color/src/color.js
function nr() {}
var rr = .7, ir = 1 / rr, ar = "\\s*([+-]?\\d+)\\s*", or = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", sr = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", cr = /^#([0-9a-f]{3,8})$/, lr = RegExp(`^rgb\\(${ar},${ar},${ar}\\)$`), ur = RegExp(`^rgb\\(${sr},${sr},${sr}\\)$`), dr = RegExp(`^rgba\\(${ar},${ar},${ar},${or}\\)$`), fr = RegExp(`^rgba\\(${sr},${sr},${sr},${or}\\)$`), pr = RegExp(`^hsl\\(${or},${sr},${sr}\\)$`), mr = RegExp(`^hsla\\(${or},${sr},${sr},${or}\\)$`), hr = {
	aliceblue: 15792383,
	antiquewhite: 16444375,
	aqua: 65535,
	aquamarine: 8388564,
	azure: 15794175,
	beige: 16119260,
	bisque: 16770244,
	black: 0,
	blanchedalmond: 16772045,
	blue: 255,
	blueviolet: 9055202,
	brown: 10824234,
	burlywood: 14596231,
	cadetblue: 6266528,
	chartreuse: 8388352,
	chocolate: 13789470,
	coral: 16744272,
	cornflowerblue: 6591981,
	cornsilk: 16775388,
	crimson: 14423100,
	cyan: 65535,
	darkblue: 139,
	darkcyan: 35723,
	darkgoldenrod: 12092939,
	darkgray: 11119017,
	darkgreen: 25600,
	darkgrey: 11119017,
	darkkhaki: 12433259,
	darkmagenta: 9109643,
	darkolivegreen: 5597999,
	darkorange: 16747520,
	darkorchid: 10040012,
	darkred: 9109504,
	darksalmon: 15308410,
	darkseagreen: 9419919,
	darkslateblue: 4734347,
	darkslategray: 3100495,
	darkslategrey: 3100495,
	darkturquoise: 52945,
	darkviolet: 9699539,
	deeppink: 16716947,
	deepskyblue: 49151,
	dimgray: 6908265,
	dimgrey: 6908265,
	dodgerblue: 2003199,
	firebrick: 11674146,
	floralwhite: 16775920,
	forestgreen: 2263842,
	fuchsia: 16711935,
	gainsboro: 14474460,
	ghostwhite: 16316671,
	gold: 16766720,
	goldenrod: 14329120,
	gray: 8421504,
	green: 32768,
	greenyellow: 11403055,
	grey: 8421504,
	honeydew: 15794160,
	hotpink: 16738740,
	indianred: 13458524,
	indigo: 4915330,
	ivory: 16777200,
	khaki: 15787660,
	lavender: 15132410,
	lavenderblush: 16773365,
	lawngreen: 8190976,
	lemonchiffon: 16775885,
	lightblue: 11393254,
	lightcoral: 15761536,
	lightcyan: 14745599,
	lightgoldenrodyellow: 16448210,
	lightgray: 13882323,
	lightgreen: 9498256,
	lightgrey: 13882323,
	lightpink: 16758465,
	lightsalmon: 16752762,
	lightseagreen: 2142890,
	lightskyblue: 8900346,
	lightslategray: 7833753,
	lightslategrey: 7833753,
	lightsteelblue: 11584734,
	lightyellow: 16777184,
	lime: 65280,
	limegreen: 3329330,
	linen: 16445670,
	magenta: 16711935,
	maroon: 8388608,
	mediumaquamarine: 6737322,
	mediumblue: 205,
	mediumorchid: 12211667,
	mediumpurple: 9662683,
	mediumseagreen: 3978097,
	mediumslateblue: 8087790,
	mediumspringgreen: 64154,
	mediumturquoise: 4772300,
	mediumvioletred: 13047173,
	midnightblue: 1644912,
	mintcream: 16121850,
	mistyrose: 16770273,
	moccasin: 16770229,
	navajowhite: 16768685,
	navy: 128,
	oldlace: 16643558,
	olive: 8421376,
	olivedrab: 7048739,
	orange: 16753920,
	orangered: 16729344,
	orchid: 14315734,
	palegoldenrod: 15657130,
	palegreen: 10025880,
	paleturquoise: 11529966,
	palevioletred: 14381203,
	papayawhip: 16773077,
	peachpuff: 16767673,
	peru: 13468991,
	pink: 16761035,
	plum: 14524637,
	powderblue: 11591910,
	purple: 8388736,
	rebeccapurple: 6697881,
	red: 16711680,
	rosybrown: 12357519,
	royalblue: 4286945,
	saddlebrown: 9127187,
	salmon: 16416882,
	sandybrown: 16032864,
	seagreen: 3050327,
	seashell: 16774638,
	sienna: 10506797,
	silver: 12632256,
	skyblue: 8900331,
	slateblue: 6970061,
	slategray: 7372944,
	slategrey: 7372944,
	snow: 16775930,
	springgreen: 65407,
	steelblue: 4620980,
	tan: 13808780,
	teal: 32896,
	thistle: 14204888,
	tomato: 16737095,
	turquoise: 4251856,
	violet: 15631086,
	wheat: 16113331,
	white: 16777215,
	whitesmoke: 16119285,
	yellow: 16776960,
	yellowgreen: 10145074
};
er(nr, br, {
	copy(e) {
		return Object.assign(new this.constructor(), this, e);
	},
	displayable() {
		return this.rgb().displayable();
	},
	hex: gr,
	formatHex: gr,
	formatHex8: _r,
	formatHsl: vr,
	formatRgb: yr,
	toString: yr
});
function gr() {
	return this.rgb().formatHex();
}
function _r() {
	return this.rgb().formatHex8();
}
function vr() {
	return Mr(this).formatHsl();
}
function yr() {
	return this.rgb().formatRgb();
}
function br(e) {
	var t, n;
	return e = (e + "").trim().toLowerCase(), (t = cr.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? xr(t) : n === 3 ? new M(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? Sr(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? Sr(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = lr.exec(e)) ? new M(t[1], t[2], t[3], 1) : (t = ur.exec(e)) ? new M(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = dr.exec(e)) ? Sr(t[1], t[2], t[3], t[4]) : (t = fr.exec(e)) ? Sr(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = pr.exec(e)) ? jr(t[1], t[2] / 100, t[3] / 100, 1) : (t = mr.exec(e)) ? jr(t[1], t[2] / 100, t[3] / 100, t[4]) : hr.hasOwnProperty(e) ? xr(hr[e]) : e === "transparent" ? new M(NaN, NaN, NaN, 0) : null;
}
function xr(e) {
	return new M(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function Sr(e, t, n, r) {
	return r <= 0 && (e = t = n = NaN), new M(e, t, n, r);
}
function Cr(e) {
	return e instanceof nr || (e = br(e)), e ? (e = e.rgb(), new M(e.r, e.g, e.b, e.opacity)) : new M();
}
function wr(e, t, n, r) {
	return arguments.length === 1 ? Cr(e) : new M(e, t, n, r ?? 1);
}
function M(e, t, n, r) {
	this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
er(M, wr, tr(nr, {
	brighter(e) {
		return e = e == null ? ir : ir ** +e, new M(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? rr : rr ** +e, new M(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	rgb() {
		return this;
	},
	clamp() {
		return new M(kr(this.r), kr(this.g), kr(this.b), Or(this.opacity));
	},
	displayable() {
		return -.5 <= this.r && this.r < 255.5 && -.5 <= this.g && this.g < 255.5 && -.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
	},
	hex: Tr,
	formatHex: Tr,
	formatHex8: Er,
	formatRgb: Dr,
	toString: Dr
}));
function Tr() {
	return `#${Ar(this.r)}${Ar(this.g)}${Ar(this.b)}`;
}
function Er() {
	return `#${Ar(this.r)}${Ar(this.g)}${Ar(this.b)}${Ar((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Dr() {
	let e = Or(this.opacity);
	return `${e === 1 ? "rgb(" : "rgba("}${kr(this.r)}, ${kr(this.g)}, ${kr(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function Or(e) {
	return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function kr(e) {
	return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function Ar(e) {
	return e = kr(e), (e < 16 ? "0" : "") + e.toString(16);
}
function jr(e, t, n, r) {
	return r <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new Pr(e, t, n, r);
}
function Mr(e) {
	if (e instanceof Pr) return new Pr(e.h, e.s, e.l, e.opacity);
	if (e instanceof nr || (e = br(e)), !e) return new Pr();
	if (e instanceof Pr) return e;
	e = e.rgb();
	var t = e.r / 255, n = e.g / 255, r = e.b / 255, i = Math.min(t, n, r), a = Math.max(t, n, r), o = NaN, s = a - i, c = (a + i) / 2;
	return s ? (o = t === a ? (n - r) / s + (n < r) * 6 : n === a ? (r - t) / s + 2 : (t - n) / s + 4, s /= c < .5 ? a + i : 2 - a - i, o *= 60) : s = c > 0 && c < 1 ? 0 : o, new Pr(o, s, c, e.opacity);
}
function Nr(e, t, n, r) {
	return arguments.length === 1 ? Mr(e) : new Pr(e, t, n, r ?? 1);
}
function Pr(e, t, n, r) {
	this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
er(Pr, Nr, tr(nr, {
	brighter(e) {
		return e = e == null ? ir : ir ** +e, new Pr(this.h, this.s, this.l * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? rr : rr ** +e, new Pr(this.h, this.s, this.l * e, this.opacity);
	},
	rgb() {
		var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < .5 ? n : 1 - n) * t, i = 2 * n - r;
		return new M(Lr(e >= 240 ? e - 240 : e + 120, i, r), Lr(e, i, r), Lr(e < 120 ? e + 240 : e - 120, i, r), this.opacity);
	},
	clamp() {
		return new Pr(Fr(this.h), Ir(this.s), Ir(this.l), Or(this.opacity));
	},
	displayable() {
		return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
	},
	formatHsl() {
		let e = Or(this.opacity);
		return `${e === 1 ? "hsl(" : "hsla("}${Fr(this.h)}, ${Ir(this.s) * 100}%, ${Ir(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
	}
}));
function Fr(e) {
	return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function Ir(e) {
	return Math.max(0, Math.min(1, e || 0));
}
function Lr(e, t, n) {
	return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
//#endregion
//#region node_modules/d3-color/src/math.js
var Rr = Math.PI / 180, zr = 180 / Math.PI, Br = 18, Vr = .96422, Hr = 1, Ur = .82521, Wr = 4 / 29, Gr = 6 / 29, Kr = 3 * Gr * Gr, qr = Gr * Gr * Gr;
function Jr(e) {
	if (e instanceof Xr) return new Xr(e.l, e.a, e.b, e.opacity);
	if (e instanceof ri) return ii(e);
	e instanceof M || (e = Cr(e));
	var t = ei(e.r), n = ei(e.g), r = ei(e.b), i = Zr((.2225045 * t + .7168786 * n + .0606169 * r) / Hr), a, o;
	return t === n && n === r ? a = o = i : (a = Zr((.4360747 * t + .3850649 * n + .1430804 * r) / Vr), o = Zr((.0139322 * t + .0971045 * n + .7141733 * r) / Ur)), new Xr(116 * i - 16, 500 * (a - i), 200 * (i - o), e.opacity);
}
function Yr(e, t, n, r) {
	return arguments.length === 1 ? Jr(e) : new Xr(e, t, n, r ?? 1);
}
function Xr(e, t, n, r) {
	this.l = +e, this.a = +t, this.b = +n, this.opacity = +r;
}
er(Xr, Yr, tr(nr, {
	brighter(e) {
		return new Xr(this.l + Br * (e ?? 1), this.a, this.b, this.opacity);
	},
	darker(e) {
		return new Xr(this.l - Br * (e ?? 1), this.a, this.b, this.opacity);
	},
	rgb() {
		var e = (this.l + 16) / 116, t = isNaN(this.a) ? e : e + this.a / 500, n = isNaN(this.b) ? e : e - this.b / 200;
		return t = Vr * Qr(t), e = Hr * Qr(e), n = Ur * Qr(n), new M($r(3.1338561 * t - 1.6168667 * e - .4906146 * n), $r(-.9787684 * t + 1.9161415 * e + .033454 * n), $r(.0719453 * t - .2289914 * e + 1.4052427 * n), this.opacity);
	}
}));
function Zr(e) {
	return e > qr ? e ** (1 / 3) : e / Kr + Wr;
}
function Qr(e) {
	return e > Gr ? e * e * e : Kr * (e - Wr);
}
function $r(e) {
	return 255 * (e <= .0031308 ? 12.92 * e : 1.055 * e ** (1 / 2.4) - .055);
}
function ei(e) {
	return (e /= 255) <= .04045 ? e / 12.92 : ((e + .055) / 1.055) ** 2.4;
}
function ti(e) {
	if (e instanceof ri) return new ri(e.h, e.c, e.l, e.opacity);
	if (e instanceof Xr || (e = Jr(e)), e.a === 0 && e.b === 0) return new ri(NaN, 0 < e.l && e.l < 100 ? 0 : NaN, e.l, e.opacity);
	var t = Math.atan2(e.b, e.a) * zr;
	return new ri(t < 0 ? t + 360 : t, Math.sqrt(e.a * e.a + e.b * e.b), e.l, e.opacity);
}
function ni(e, t, n, r) {
	return arguments.length === 1 ? ti(e) : new ri(e, t, n, r ?? 1);
}
function ri(e, t, n, r) {
	this.h = +e, this.c = +t, this.l = +n, this.opacity = +r;
}
function ii(e) {
	if (isNaN(e.h)) return new Xr(e.l, 0, 0, e.opacity);
	var t = e.h * Rr;
	return new Xr(e.l, Math.cos(t) * e.c, Math.sin(t) * e.c, e.opacity);
}
er(ri, ni, tr(nr, {
	brighter(e) {
		return new ri(this.h, this.c, this.l + Br * (e ?? 1), this.opacity);
	},
	darker(e) {
		return new ri(this.h, this.c, this.l - Br * (e ?? 1), this.opacity);
	},
	rgb() {
		return ii(this).rgb();
	}
}));
//#endregion
//#region node_modules/d3-color/src/cubehelix.js
var ai = -.14861, oi = 1.78277, si = -.29227, ci = -.90649, li = 1.97294, ui = li * ci, di = li * oi, fi = oi * si - ci * ai;
function pi(e) {
	if (e instanceof hi) return new hi(e.h, e.s, e.l, e.opacity);
	e instanceof M || (e = Cr(e));
	var t = e.r / 255, n = e.g / 255, r = e.b / 255, i = (fi * r + ui * t - di * n) / (fi + ui - di), a = r - i, o = (li * (n - i) - si * a) / ci, s = Math.sqrt(o * o + a * a) / (li * i * (1 - i)), c = s ? Math.atan2(o, a) * zr - 120 : NaN;
	return new hi(c < 0 ? c + 360 : c, s, i, e.opacity);
}
function mi(e, t, n, r) {
	return arguments.length === 1 ? pi(e) : new hi(e, t, n, r ?? 1);
}
function hi(e, t, n, r) {
	this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
er(hi, mi, tr(nr, {
	brighter(e) {
		return e = e == null ? ir : ir ** +e, new hi(this.h, this.s, this.l * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? rr : rr ** +e, new hi(this.h, this.s, this.l * e, this.opacity);
	},
	rgb() {
		var e = isNaN(this.h) ? 0 : (this.h + 120) * Rr, t = +this.l, n = isNaN(this.s) ? 0 : this.s * t * (1 - t), r = Math.cos(e), i = Math.sin(e);
		return new M(255 * (t + n * (ai * r + oi * i)), 255 * (t + n * (si * r + ci * i)), 255 * (t + li * r * n), this.opacity);
	}
}));
//#endregion
//#region node_modules/d3-interpolate/src/basis.js
function gi(e, t, n, r, i) {
	var a = e * e, o = a * e;
	return ((1 - 3 * e + 3 * a - o) * t + (4 - 6 * a + 3 * o) * n + (1 + 3 * e + 3 * a - 3 * o) * r + o * i) / 6;
}
function _i(e) {
	var t = e.length - 1;
	return function(n) {
		var r = n <= 0 ? n = 0 : n >= 1 ? (n = 1, t - 1) : Math.floor(n * t), i = e[r], a = e[r + 1], o = r > 0 ? e[r - 1] : 2 * i - a, s = r < t - 1 ? e[r + 2] : 2 * a - i;
		return gi((n - r / t) * t, o, i, a, s);
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/constant.js
var vi = (e) => () => e;
//#endregion
//#region node_modules/d3-interpolate/src/color.js
function yi(e, t) {
	return function(n) {
		return e + n * t;
	};
}
function bi(e, t, n) {
	return e **= +n, t = t ** +n - e, n = 1 / n, function(r) {
		return (e + r * t) ** +n;
	};
}
function xi(e, t) {
	var n = t - e;
	return n ? yi(e, n > 180 || n < -180 ? n - 360 * Math.round(n / 360) : n) : vi(isNaN(e) ? t : e);
}
function Si(e) {
	return (e = +e) == 1 ? Ci : function(t, n) {
		return n - t ? bi(t, n, e) : vi(isNaN(t) ? n : t);
	};
}
function Ci(e, t) {
	var n = t - e;
	return n ? yi(e, n) : vi(isNaN(e) ? t : e);
}
//#endregion
//#region node_modules/d3-interpolate/src/rgb.js
var wi = (function e(t) {
	var n = Si(t);
	function r(e, t) {
		var r = n((e = wr(e)).r, (t = wr(t)).r), i = n(e.g, t.g), a = n(e.b, t.b), o = Ci(e.opacity, t.opacity);
		return function(t) {
			return e.r = r(t), e.g = i(t), e.b = a(t), e.opacity = o(t), e + "";
		};
	}
	return r.gamma = e, r;
})(1);
function Ti(e) {
	return function(t) {
		var n = t.length, r = Array(n), i = Array(n), a = Array(n), o, s;
		for (o = 0; o < n; ++o) s = wr(t[o]), r[o] = s.r || 0, i[o] = s.g || 0, a[o] = s.b || 0;
		return r = e(r), i = e(i), a = e(a), s.opacity = 1, function(e) {
			return s.r = r(e), s.g = i(e), s.b = a(e), s + "";
		};
	};
}
var Ei = Ti(_i);
//#endregion
//#region node_modules/d3-interpolate/src/numberArray.js
function Di(e, t) {
	t ||= [];
	var n = e ? Math.min(t.length, e.length) : 0, r = t.slice(), i;
	return function(a) {
		for (i = 0; i < n; ++i) r[i] = e[i] * (1 - a) + t[i] * a;
		return r;
	};
}
function Oi(e) {
	return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
//#endregion
//#region node_modules/d3-interpolate/src/array.js
function ki(e, t) {
	var n = t ? t.length : 0, r = e ? Math.min(n, e.length) : 0, i = Array(r), a = Array(n), o;
	for (o = 0; o < r; ++o) i[o] = Ri(e[o], t[o]);
	for (; o < n; ++o) a[o] = t[o];
	return function(e) {
		for (o = 0; o < r; ++o) a[o] = i[o](e);
		return a;
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/date.js
function Ai(e, t) {
	var n = /* @__PURE__ */ new Date();
	return e = +e, t = +t, function(r) {
		return n.setTime(e * (1 - r) + t * r), n;
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/number.js
function ji(e, t) {
	return e = +e, t = +t, function(n) {
		return e * (1 - n) + t * n;
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/object.js
function Mi(e, t) {
	var n = {}, r = {}, i;
	for (i in (typeof e != "object" || !e) && (e = {}), (typeof t != "object" || !t) && (t = {}), t) i in e ? n[i] = Ri(e[i], t[i]) : r[i] = t[i];
	return function(e) {
		for (i in n) r[i] = n[i](e);
		return r;
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/string.js
var Ni = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Pi = new RegExp(Ni.source, "g");
function Fi(e) {
	return function() {
		return e;
	};
}
function Ii(e) {
	return function(t) {
		return e(t) + "";
	};
}
function Li(e, t) {
	var n = Ni.lastIndex = Pi.lastIndex = 0, r, i, a, o = -1, s = [], c = [];
	for (e += "", t += ""; (r = Ni.exec(e)) && (i = Pi.exec(t));) (a = i.index) > n && (a = t.slice(n, a), s[o] ? s[o] += a : s[++o] = a), (r = r[0]) === (i = i[0]) ? s[o] ? s[o] += i : s[++o] = i : (s[++o] = null, c.push({
		i: o,
		x: ji(r, i)
	})), n = Pi.lastIndex;
	return n < t.length && (a = t.slice(n), s[o] ? s[o] += a : s[++o] = a), s.length < 2 ? c[0] ? Ii(c[0].x) : Fi(t) : (t = c.length, function(e) {
		for (var n = 0, r; n < t; ++n) s[(r = c[n]).i] = r.x(e);
		return s.join("");
	});
}
//#endregion
//#region node_modules/d3-interpolate/src/value.js
function Ri(e, t) {
	var n = typeof t, r;
	return t == null || n === "boolean" ? vi(t) : (n === "number" ? ji : n === "string" ? (r = br(t)) ? (t = r, wi) : Li : t instanceof br ? wi : t instanceof Date ? Ai : Oi(t) ? Di : Array.isArray(t) ? ki : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? Mi : ji)(e, t);
}
//#endregion
//#region node_modules/d3-interpolate/src/round.js
function zi(e, t) {
	return e = +e, t = +t, function(n) {
		return Math.round(e * (1 - n) + t * n);
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/transform/decompose.js
var Bi = 180 / Math.PI, Vi = {
	translateX: 0,
	translateY: 0,
	rotate: 0,
	skewX: 0,
	scaleX: 1,
	scaleY: 1
};
function Hi(e, t, n, r, i, a) {
	var o, s, c;
	return (o = Math.sqrt(e * e + t * t)) && (e /= o, t /= o), (c = e * n + t * r) && (n -= e * c, r -= t * c), (s = Math.sqrt(n * n + r * r)) && (n /= s, r /= s, c /= s), e * r < t * n && (e = -e, t = -t, c = -c, o = -o), {
		translateX: i,
		translateY: a,
		rotate: Math.atan2(t, e) * Bi,
		skewX: Math.atan(c) * Bi,
		scaleX: o,
		scaleY: s
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/transform/parse.js
var Ui;
function Wi(e) {
	let t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
	return t.isIdentity ? Vi : Hi(t.a, t.b, t.c, t.d, t.e, t.f);
}
function Gi(e) {
	return e == null || (Ui ||= document.createElementNS("http://www.w3.org/2000/svg", "g"), Ui.setAttribute("transform", e), !(e = Ui.transform.baseVal.consolidate())) ? Vi : (e = e.matrix, Hi(e.a, e.b, e.c, e.d, e.e, e.f));
}
//#endregion
//#region node_modules/d3-interpolate/src/transform/index.js
function Ki(e, t, n, r) {
	function i(e) {
		return e.length ? e.pop() + " " : "";
	}
	function a(e, r, i, a, o, s) {
		if (e !== i || r !== a) {
			var c = o.push("translate(", null, t, null, n);
			s.push({
				i: c - 4,
				x: ji(e, i)
			}, {
				i: c - 2,
				x: ji(r, a)
			});
		} else (i || a) && o.push("translate(" + i + t + a + n);
	}
	function o(e, t, n, a) {
		e === t ? t && n.push(i(n) + "rotate(" + t + r) : (e - t > 180 ? t += 360 : t - e > 180 && (e += 360), a.push({
			i: n.push(i(n) + "rotate(", null, r) - 2,
			x: ji(e, t)
		}));
	}
	function s(e, t, n, a) {
		e === t ? t && n.push(i(n) + "skewX(" + t + r) : a.push({
			i: n.push(i(n) + "skewX(", null, r) - 2,
			x: ji(e, t)
		});
	}
	function c(e, t, n, r, a, o) {
		if (e !== n || t !== r) {
			var s = a.push(i(a) + "scale(", null, ",", null, ")");
			o.push({
				i: s - 4,
				x: ji(e, n)
			}, {
				i: s - 2,
				x: ji(t, r)
			});
		} else (n !== 1 || r !== 1) && a.push(i(a) + "scale(" + n + "," + r + ")");
	}
	return function(t, n) {
		var r = [], i = [];
		return t = e(t), n = e(n), a(t.translateX, t.translateY, n.translateX, n.translateY, r, i), o(t.rotate, n.rotate, r, i), s(t.skewX, n.skewX, r, i), c(t.scaleX, t.scaleY, n.scaleX, n.scaleY, r, i), t = n = null, function(e) {
			for (var t = -1, n = i.length, a; ++t < n;) r[(a = i[t]).i] = a.x(e);
			return r.join("");
		};
	};
}
var qi = Ki(Wi, "px, ", "px)", "deg)"), Ji = Ki(Gi, ", ", ")", ")");
//#endregion
//#region node_modules/d3-interpolate/src/hsl.js
function Yi(e) {
	return function(t, n) {
		var r = e((t = Nr(t)).h, (n = Nr(n)).h), i = Ci(t.s, n.s), a = Ci(t.l, n.l), o = Ci(t.opacity, n.opacity);
		return function(e) {
			return t.h = r(e), t.s = i(e), t.l = a(e), t.opacity = o(e), t + "";
		};
	};
}
var Xi = Yi(xi);
//#endregion
//#region node_modules/d3-interpolate/src/lab.js
function Zi(e, t) {
	var n = Ci((e = Yr(e)).l, (t = Yr(t)).l), r = Ci(e.a, t.a), i = Ci(e.b, t.b), a = Ci(e.opacity, t.opacity);
	return function(t) {
		return e.l = n(t), e.a = r(t), e.b = i(t), e.opacity = a(t), e + "";
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/hcl.js
function Qi(e) {
	return function(t, n) {
		var r = e((t = ni(t)).h, (n = ni(n)).h), i = Ci(t.c, n.c), a = Ci(t.l, n.l), o = Ci(t.opacity, n.opacity);
		return function(e) {
			return t.h = r(e), t.c = i(e), t.l = a(e), t.opacity = o(e), t + "";
		};
	};
}
var $i = Qi(xi);
//#endregion
//#region node_modules/d3-interpolate/src/cubehelix.js
function ea(e) {
	return (function t(n) {
		n = +n;
		function r(t, r) {
			var i = e((t = mi(t)).h, (r = mi(r)).h), a = Ci(t.s, r.s), o = Ci(t.l, r.l), s = Ci(t.opacity, r.opacity);
			return function(e) {
				return t.h = i(e), t.s = a(e), t.l = o(e ** +n), t.opacity = s(e), t + "";
			};
		}
		return r.gamma = t, r;
	})(1);
}
ea(xi);
var ta = ea(Ci);
//#endregion
//#region node_modules/d3-interpolate/src/piecewise.js
function na(e, t) {
	t === void 0 && (t = e, e = Ri);
	for (var n = 0, r = t.length - 1, i = t[0], a = Array(r < 0 ? 0 : r); n < r;) a[n] = e(i, i = t[++n]);
	return function(e) {
		var t = Math.max(0, Math.min(r - 1, Math.floor(e *= r)));
		return a[t](e - t);
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/quantize.js
function ra(e, t) {
	for (var n = Array(t), r = 0; r < t; ++r) n[r] = e(r / (t - 1));
	return n;
}
//#endregion
//#region node_modules/d3-timer/src/timer.js
var ia = 0, aa = 0, oa = 0, sa = 1e3, ca, la, ua = 0, da = 0, fa = 0, pa = typeof performance == "object" && performance.now ? performance : Date, ma = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
	setTimeout(e, 17);
};
function ha() {
	return da ||= (ma(ga), pa.now() + fa);
}
function ga() {
	da = 0;
}
function _a() {
	this._call = this._time = this._next = null;
}
_a.prototype = va.prototype = {
	constructor: _a,
	restart: function(e, t, n) {
		if (typeof e != "function") throw TypeError("callback is not a function");
		n = (n == null ? ha() : +n) + (t == null ? 0 : +t), !this._next && la !== this && (la ? la._next = this : ca = this, la = this), this._call = e, this._time = n, Ca();
	},
	stop: function() {
		this._call && (this._call = null, this._time = Infinity, Ca());
	}
};
function va(e, t, n) {
	var r = new _a();
	return r.restart(e, t, n), r;
}
function ya() {
	ha(), ++ia;
	for (var e = ca, t; e;) (t = da - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
	--ia;
}
function ba() {
	da = (ua = pa.now()) + fa, ia = aa = 0;
	try {
		ya();
	} finally {
		ia = 0, Sa(), da = 0;
	}
}
function xa() {
	var e = pa.now(), t = e - ua;
	t > sa && (fa -= t, ua = e);
}
function Sa() {
	for (var e, t = ca, n, r = Infinity; t;) t._call ? (r > t._time && (r = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : ca = n);
	la = e, Ca(r);
}
function Ca(e) {
	ia || (aa &&= clearTimeout(aa), e - da > 24 ? (e < Infinity && (aa = setTimeout(ba, e - pa.now() - fa)), oa &&= clearInterval(oa)) : (oa ||= (ua = pa.now(), setInterval(xa, sa)), ia = 1, ma(ba)));
}
//#endregion
//#region node_modules/d3-timer/src/timeout.js
function wa(e, t, n) {
	var r = new _a();
	return t = t == null ? 0 : +t, r.restart((n) => {
		r.stop(), e(n + t);
	}, t, n), r;
}
//#endregion
//#region node_modules/d3-transition/src/transition/schedule.js
var Ta = Ke("start", "end", "cancel", "interrupt"), Ea = [];
function Da(e, t, n, r, i, a) {
	var o = e.__transition;
	if (!o) e.__transition = {};
	else if (n in o) return;
	ja(e, n, {
		name: t,
		index: r,
		group: i,
		on: Ta,
		tween: Ea,
		time: a.time,
		delay: a.delay,
		duration: a.duration,
		ease: a.ease,
		timer: null,
		state: 0
	});
}
function Oa(e, t) {
	var n = Aa(e, t);
	if (n.state > 0) throw Error("too late; already scheduled");
	return n;
}
function ka(e, t) {
	var n = Aa(e, t);
	if (n.state > 3) throw Error("too late; already running");
	return n;
}
function Aa(e, t) {
	var n = e.__transition;
	if (!n || !(n = n[t])) throw Error("transition not found");
	return n;
}
function ja(e, t, n) {
	var r = e.__transition, i;
	r[t] = n, n.timer = va(a, 0, n.time);
	function a(e) {
		n.state = 1, n.timer.restart(o, n.delay, n.time), n.delay <= e && o(e - n.delay);
	}
	function o(a) {
		var l, u, d, f;
		if (n.state !== 1) return c();
		for (l in r) if (f = r[l], f.name === n.name) {
			if (f.state === 3) return wa(o);
			f.state === 4 ? (f.state = 6, f.timer.stop(), f.on.call("interrupt", e, e.__data__, f.index, f.group), delete r[l]) : +l < t && (f.state = 6, f.timer.stop(), f.on.call("cancel", e, e.__data__, f.index, f.group), delete r[l]);
		}
		if (wa(function() {
			n.state === 3 && (n.state = 4, n.timer.restart(s, n.delay, n.time), s(a));
		}), n.state = 2, n.on.call("start", e, e.__data__, n.index, n.group), n.state === 2) {
			for (n.state = 3, i = Array(d = n.tween.length), l = 0, u = -1; l < d; ++l) (f = n.tween[l].value.call(e, e.__data__, n.index, n.group)) && (i[++u] = f);
			i.length = u + 1;
		}
	}
	function s(t) {
		for (var r = t < n.duration ? n.ease.call(null, t / n.duration) : (n.timer.restart(c), n.state = 5, 1), a = -1, o = i.length; ++a < o;) i[a].call(e, r);
		n.state === 5 && (n.on.call("end", e, e.__data__, n.index, n.group), c());
	}
	function c() {
		for (var i in n.state = 6, n.timer.stop(), delete r[t], r) return;
		delete e.__transition;
	}
}
//#endregion
//#region node_modules/d3-transition/src/interrupt.js
function Ma(e, t) {
	var n = e.__transition, r, i, a = !0, o;
	if (n) {
		for (o in t = t == null ? null : t + "", n) {
			if ((r = n[o]).name !== t) {
				a = !1;
				continue;
			}
			i = r.state > 2 && r.state < 5, r.state = 6, r.timer.stop(), r.on.call(i ? "interrupt" : "cancel", e, e.__data__, r.index, r.group), delete n[o];
		}
		a && delete e.__transition;
	}
}
//#endregion
//#region node_modules/d3-transition/src/selection/interrupt.js
function Na(e) {
	return this.each(function() {
		Ma(this, e);
	});
}
//#endregion
//#region node_modules/d3-transition/src/transition/tween.js
function Pa(e, t) {
	var n, r;
	return function() {
		var i = ka(this, e), a = i.tween;
		if (a !== n) {
			r = n = a;
			for (var o = 0, s = r.length; o < s; ++o) if (r[o].name === t) {
				r = r.slice(), r.splice(o, 1);
				break;
			}
		}
		i.tween = r;
	};
}
function Fa(e, t, n) {
	var r, i;
	if (typeof n != "function") throw Error();
	return function() {
		var a = ka(this, e), o = a.tween;
		if (o !== r) {
			i = (r = o).slice();
			for (var s = {
				name: t,
				value: n
			}, c = 0, l = i.length; c < l; ++c) if (i[c].name === t) {
				i[c] = s;
				break;
			}
			c === l && i.push(s);
		}
		a.tween = i;
	};
}
function Ia(e, t) {
	var n = this._id;
	if (e += "", arguments.length < 2) {
		for (var r = Aa(this.node(), n).tween, i = 0, a = r.length, o; i < a; ++i) if ((o = r[i]).name === e) return o.value;
		return null;
	}
	return this.each((t == null ? Pa : Fa)(n, e, t));
}
function La(e, t, n) {
	var r = e._id;
	return e.each(function() {
		var e = ka(this, r);
		(e.value ||= {})[t] = n.apply(this, arguments);
	}), function(e) {
		return Aa(e, r).value[t];
	};
}
//#endregion
//#region node_modules/d3-transition/src/transition/interpolate.js
function Ra(e, t) {
	var n;
	return (typeof t == "number" ? ji : t instanceof br ? wi : (n = br(t)) ? (t = n, wi) : Li)(e, t);
}
//#endregion
//#region node_modules/d3-transition/src/transition/attr.js
function za(e) {
	return function() {
		this.removeAttribute(e);
	};
}
function Ba(e) {
	return function() {
		this.removeAttributeNS(e.space, e.local);
	};
}
function Va(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = this.getAttribute(e);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function Ha(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = this.getAttributeNS(e.space, e.local);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function Ua(e, t, n) {
	var r, i, a;
	return function() {
		var o, s = n(this), c;
		return s == null ? void this.removeAttribute(e) : (o = this.getAttribute(e), c = s + "", o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s)));
	};
}
function Wa(e, t, n) {
	var r, i, a;
	return function() {
		var o, s = n(this), c;
		return s == null ? void this.removeAttributeNS(e.space, e.local) : (o = this.getAttributeNS(e.space, e.local), c = s + "", o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s)));
	};
}
function Ga(e, t) {
	var n = Qe(e), r = n === "transform" ? Ji : Ra;
	return this.attrTween(e, typeof t == "function" ? (n.local ? Wa : Ua)(n, r, La(this, "attr." + e, t)) : t == null ? (n.local ? Ba : za)(n) : (n.local ? Ha : Va)(n, r, t));
}
//#endregion
//#region node_modules/d3-transition/src/transition/attrTween.js
function Ka(e, t) {
	return function(n) {
		this.setAttribute(e, t.call(this, n));
	};
}
function qa(e, t) {
	return function(n) {
		this.setAttributeNS(e.space, e.local, t.call(this, n));
	};
}
function Ja(e, t) {
	var n, r;
	function i() {
		var i = t.apply(this, arguments);
		return i !== r && (n = (r = i) && qa(e, i)), n;
	}
	return i._value = t, i;
}
function Ya(e, t) {
	var n, r;
	function i() {
		var i = t.apply(this, arguments);
		return i !== r && (n = (r = i) && Ka(e, i)), n;
	}
	return i._value = t, i;
}
function Xa(e, t) {
	var n = "attr." + e;
	if (arguments.length < 2) return (n = this.tween(n)) && n._value;
	if (t == null) return this.tween(n, null);
	if (typeof t != "function") throw Error();
	var r = Qe(e);
	return this.tween(n, (r.local ? Ja : Ya)(r, t));
}
//#endregion
//#region node_modules/d3-transition/src/transition/delay.js
function Za(e, t) {
	return function() {
		Oa(this, e).delay = +t.apply(this, arguments);
	};
}
function Qa(e, t) {
	return t = +t, function() {
		Oa(this, e).delay = t;
	};
}
function $a(e) {
	var t = this._id;
	return arguments.length ? this.each((typeof e == "function" ? Za : Qa)(t, e)) : Aa(this.node(), t).delay;
}
//#endregion
//#region node_modules/d3-transition/src/transition/duration.js
function eo(e, t) {
	return function() {
		ka(this, e).duration = +t.apply(this, arguments);
	};
}
function to(e, t) {
	return t = +t, function() {
		ka(this, e).duration = t;
	};
}
function no(e) {
	var t = this._id;
	return arguments.length ? this.each((typeof e == "function" ? eo : to)(t, e)) : Aa(this.node(), t).duration;
}
//#endregion
//#region node_modules/d3-transition/src/transition/ease.js
function ro(e, t) {
	if (typeof t != "function") throw Error();
	return function() {
		ka(this, e).ease = t;
	};
}
function io(e) {
	var t = this._id;
	return arguments.length ? this.each(ro(t, e)) : Aa(this.node(), t).ease;
}
//#endregion
//#region node_modules/d3-transition/src/transition/easeVarying.js
function ao(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		if (typeof n != "function") throw Error();
		ka(this, e).ease = n;
	};
}
function oo(e) {
	if (typeof e != "function") throw Error();
	return this.each(ao(this._id, e));
}
//#endregion
//#region node_modules/d3-transition/src/transition/filter.js
function so(e) {
	typeof e != "function" && (e = dt(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = [], c, l = 0; l < o; ++l) (c = a[l]) && e.call(c, c.__data__, l, a) && s.push(c);
	return new Lo(r, this._parents, this._name, this._id);
}
//#endregion
//#region node_modules/d3-transition/src/transition/merge.js
function co(e) {
	if (e._id !== this._id) throw Error();
	for (var t = this._groups, n = e._groups, r = t.length, i = n.length, a = Math.min(r, i), o = Array(r), s = 0; s < a; ++s) for (var c = t[s], l = n[s], u = c.length, d = o[s] = Array(u), f, p = 0; p < u; ++p) (f = c[p] || l[p]) && (d[p] = f);
	for (; s < r; ++s) o[s] = t[s];
	return new Lo(o, this._parents, this._name, this._id);
}
//#endregion
//#region node_modules/d3-transition/src/transition/on.js
function lo(e) {
	return (e + "").trim().split(/^|\s+/).every(function(e) {
		var t = e.indexOf(".");
		return t >= 0 && (e = e.slice(0, t)), !e || e === "start";
	});
}
function uo(e, t, n) {
	var r, i, a = lo(t) ? Oa : ka;
	return function() {
		var o = a(this, e), s = o.on;
		s !== r && (i = (r = s).copy()).on(t, n), o.on = i;
	};
}
function fo(e, t) {
	var n = this._id;
	return arguments.length < 2 ? Aa(this.node(), n).on.on(e) : this.each(uo(n, e, t));
}
//#endregion
//#region node_modules/d3-transition/src/transition/remove.js
function po(e) {
	return function() {
		var t = this.parentNode;
		for (var n in this.__transition) if (+n !== e) return;
		t && t.removeChild(this);
	};
}
function mo() {
	return this.on("end.remove", po(this._id));
}
//#endregion
//#region node_modules/d3-transition/src/transition/select.js
function ho(e) {
	var t = this._name, n = this._id;
	typeof e != "function" && (e = rt(e));
	for (var r = this._groups, i = r.length, a = Array(i), o = 0; o < i; ++o) for (var s = r[o], c = s.length, l = a[o] = Array(c), u, d, f = 0; f < c; ++f) (u = s[f]) && (d = e.call(u, u.__data__, f, s)) && ("__data__" in u && (d.__data__ = u.__data__), l[f] = d, Da(l[f], t, n, f, l, Aa(u, n)));
	return new Lo(a, this._parents, t, n);
}
//#endregion
//#region node_modules/d3-transition/src/transition/selectAll.js
function go(e) {
	var t = this._name, n = this._id;
	typeof e != "function" && (e = ct(e));
	for (var r = this._groups, i = r.length, a = [], o = [], s = 0; s < i; ++s) for (var c = r[s], l = c.length, u, d = 0; d < l; ++d) if (u = c[d]) {
		for (var f = e.call(u, u.__data__, d, c), p, m = Aa(u, n), h = 0, g = f.length; h < g; ++h) (p = f[h]) && Da(p, t, n, h, f, m);
		a.push(f), o.push(u);
	}
	return new Lo(a, o, t, n);
}
//#endregion
//#region node_modules/d3-transition/src/transition/selection.js
var _o = Yn.prototype.constructor;
function vo() {
	return new _o(this._groups, this._parents);
}
//#endregion
//#region node_modules/d3-transition/src/transition/style.js
function yo(e, t) {
	var n, r, i;
	return function() {
		var a = tn(this, e), o = (this.style.removeProperty(e), tn(this, e));
		return a === o ? null : a === n && o === r ? i : i = t(n = a, r = o);
	};
}
function bo(e) {
	return function() {
		this.style.removeProperty(e);
	};
}
function xo(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = tn(this, e);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function So(e, t, n) {
	var r, i, a;
	return function() {
		var o = tn(this, e), s = n(this), c = s + "";
		return s ?? (c = s = (this.style.removeProperty(e), tn(this, e))), o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s));
	};
}
function Co(e, t) {
	var n, r, i, a = "style." + t, o = "end." + a, s;
	return function() {
		var c = ka(this, e), l = c.on, u = c.value[a] == null ? s ||= bo(t) : void 0;
		(l !== n || i !== u) && (r = (n = l).copy()).on(o, i = u), c.on = r;
	};
}
function wo(e, t, n) {
	var r = (e += "") == "transform" ? qi : Ra;
	return t == null ? this.styleTween(e, yo(e, r)).on("end.style." + e, bo(e)) : typeof t == "function" ? this.styleTween(e, So(e, r, La(this, "style." + e, t))).each(Co(this._id, e)) : this.styleTween(e, xo(e, r, t), n).on("end.style." + e, null);
}
//#endregion
//#region node_modules/d3-transition/src/transition/styleTween.js
function To(e, t, n) {
	return function(r) {
		this.style.setProperty(e, t.call(this, r), n);
	};
}
function Eo(e, t, n) {
	var r, i;
	function a() {
		var a = t.apply(this, arguments);
		return a !== i && (r = (i = a) && To(e, a, n)), r;
	}
	return a._value = t, a;
}
function Do(e, t, n) {
	var r = "style." + (e += "");
	if (arguments.length < 2) return (r = this.tween(r)) && r._value;
	if (t == null) return this.tween(r, null);
	if (typeof t != "function") throw Error();
	return this.tween(r, Eo(e, t, n ?? ""));
}
//#endregion
//#region node_modules/d3-transition/src/transition/text.js
function Oo(e) {
	return function() {
		this.textContent = e;
	};
}
function ko(e) {
	return function() {
		var t = e(this);
		this.textContent = t ?? "";
	};
}
function Ao(e) {
	return this.tween("text", typeof e == "function" ? ko(La(this, "text", e)) : Oo(e == null ? "" : e + ""));
}
//#endregion
//#region node_modules/d3-transition/src/transition/textTween.js
function jo(e) {
	return function(t) {
		this.textContent = e.call(this, t);
	};
}
function Mo(e) {
	var t, n;
	function r() {
		var r = e.apply(this, arguments);
		return r !== n && (t = (n = r) && jo(r)), t;
	}
	return r._value = e, r;
}
function No(e) {
	var t = "text";
	if (arguments.length < 1) return (t = this.tween(t)) && t._value;
	if (e == null) return this.tween(t, null);
	if (typeof e != "function") throw Error();
	return this.tween(t, Mo(e));
}
//#endregion
//#region node_modules/d3-transition/src/transition/transition.js
function Po() {
	for (var e = this._name, t = this._id, n = Ro(), r = this._groups, i = r.length, a = 0; a < i; ++a) for (var o = r[a], s = o.length, c, l = 0; l < s; ++l) if (c = o[l]) {
		var u = Aa(c, t);
		Da(c, e, n, l, o, {
			time: u.time + u.delay + u.duration,
			delay: 0,
			duration: u.duration,
			ease: u.ease
		});
	}
	return new Lo(r, this._parents, e, n);
}
//#endregion
//#region node_modules/d3-transition/src/transition/end.js
function Fo() {
	var e, t, n = this, r = n._id, i = n.size();
	return new Promise(function(a, o) {
		var s = { value: o }, c = { value: function() {
			--i === 0 && a();
		} };
		n.each(function() {
			var n = ka(this, r), i = n.on;
			i !== e && (t = (e = i).copy(), t._.cancel.push(s), t._.interrupt.push(s), t._.end.push(c)), n.on = t;
		}), i === 0 && a();
	});
}
//#endregion
//#region node_modules/d3-transition/src/transition/index.js
var Io = 0;
function Lo(e, t, n, r) {
	this._groups = e, this._parents = t, this._name = n, this._id = r;
}
function Ro() {
	return ++Io;
}
var zo = Yn.prototype;
Lo.prototype = {
	constructor: Lo,
	select: ho,
	selectAll: go,
	selectChild: zo.selectChild,
	selectChildren: zo.selectChildren,
	filter: so,
	merge: co,
	selection: vo,
	transition: Po,
	call: zo.call,
	nodes: zo.nodes,
	node: zo.node,
	size: zo.size,
	empty: zo.empty,
	each: zo.each,
	on: fo,
	attr: Ga,
	attrTween: Xa,
	style: wo,
	styleTween: Do,
	text: Ao,
	textTween: No,
	remove: mo,
	tween: Ia,
	delay: $a,
	duration: no,
	ease: io,
	easeVarying: oo,
	end: Fo,
	[Symbol.iterator]: zo[Symbol.iterator]
};
//#endregion
//#region node_modules/d3-ease/src/cubic.js
function Bo(e) {
	return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
//#endregion
//#region node_modules/d3-transition/src/selection/transition.js
var Vo = {
	time: null,
	delay: 0,
	duration: 250,
	ease: Bo
};
function Ho(e, t) {
	for (var n; !(n = e.__transition) || !(n = n[t]);) if (!(e = e.parentNode)) throw Error(`transition ${t} not found`);
	return n;
}
function Uo(e) {
	var t, n;
	e instanceof Lo ? (t = e._id, e = e._name) : (t = Ro(), (n = Vo).time = ha(), e = e == null ? null : e + "");
	for (var r = this._groups, i = r.length, a = 0; a < i; ++a) for (var o = r[a], s = o.length, c, l = 0; l < s; ++l) (c = o[l]) && Da(c, e, t, l, o, n || Ho(c, t));
	return new Lo(r, this._parents, e, t);
}
Yn.prototype.interrupt = Na, Yn.prototype.transition = Uo;
//#endregion
//#region node_modules/d3-brush/src/brush.js
var { abs: Wo, max: Go, min: Ko } = Math;
["w", "e"].map(qo), ["n", "s"].map(qo), [
	"n",
	"w",
	"e",
	"s",
	"nw",
	"ne",
	"sw",
	"se"
].map(qo);
function qo(e) {
	return { type: e };
}
//#endregion
//#region node_modules/d3-path/src/path.js
var Jo = Math.PI, Yo = 2 * Jo, Xo = 1e-6, Zo = Yo - Xo;
function Qo(e) {
	this._ += e[0];
	for (let t = 1, n = e.length; t < n; ++t) this._ += arguments[t] + e[t];
}
function $o(e) {
	let t = Math.floor(e);
	if (!(t >= 0)) throw Error(`invalid digits: ${e}`);
	if (t > 15) return Qo;
	let n = 10 ** t;
	return function(e) {
		this._ += e[0];
		for (let t = 1, r = e.length; t < r; ++t) this._ += Math.round(arguments[t] * n) / n + e[t];
	};
}
var es = class {
	constructor(e) {
		this._x0 = this._y0 = this._x1 = this._y1 = null, this._ = "", this._append = e == null ? Qo : $o(e);
	}
	moveTo(e, t) {
		this._append`M${this._x0 = this._x1 = +e},${this._y0 = this._y1 = +t}`;
	}
	closePath() {
		this._x1 !== null && (this._x1 = this._x0, this._y1 = this._y0, this._append`Z`);
	}
	lineTo(e, t) {
		this._append`L${this._x1 = +e},${this._y1 = +t}`;
	}
	quadraticCurveTo(e, t, n, r) {
		this._append`Q${+e},${+t},${this._x1 = +n},${this._y1 = +r}`;
	}
	bezierCurveTo(e, t, n, r, i, a) {
		this._append`C${+e},${+t},${+n},${+r},${this._x1 = +i},${this._y1 = +a}`;
	}
	arcTo(e, t, n, r, i) {
		if (e = +e, t = +t, n = +n, r = +r, i = +i, i < 0) throw Error(`negative radius: ${i}`);
		let a = this._x1, o = this._y1, s = n - e, c = r - t, l = a - e, u = o - t, d = l * l + u * u;
		if (this._x1 === null) this._append`M${this._x1 = e},${this._y1 = t}`;
		else if (d > Xo) {
			if (!(Math.abs(u * s - c * l) > Xo) || !i) this._append`L${this._x1 = e},${this._y1 = t}`;
			else {
				let f = n - a, p = r - o, m = s * s + c * c, h = f * f + p * p, g = Math.sqrt(m), _ = Math.sqrt(d), v = i * Math.tan((Jo - Math.acos((m + d - h) / (2 * g * _))) / 2), y = v / _, b = v / g;
				Math.abs(y - 1) > Xo && this._append`L${e + y * l},${t + y * u}`, this._append`A${i},${i},0,0,${+(u * f > l * p)},${this._x1 = e + b * s},${this._y1 = t + b * c}`;
			}
		}
	}
	arc(e, t, n, r, i, a) {
		if (e = +e, t = +t, n = +n, a = !!a, n < 0) throw Error(`negative radius: ${n}`);
		let o = n * Math.cos(r), s = n * Math.sin(r), c = e + o, l = t + s, u = 1 ^ a, d = a ? r - i : i - r;
		this._x1 === null ? this._append`M${c},${l}` : (Math.abs(this._x1 - c) > Xo || Math.abs(this._y1 - l) > Xo) && this._append`L${c},${l}`, n && (d < 0 && (d = d % Yo + Yo), d > Zo ? this._append`A${n},${n},0,1,${u},${e - o},${t - s}A${n},${n},0,1,${u},${this._x1 = c},${this._y1 = l}` : d > Xo && this._append`A${n},${n},0,${+(d >= Jo)},${u},${this._x1 = e + n * Math.cos(i)},${this._y1 = t + n * Math.sin(i)}`);
	}
	rect(e, t, n, r) {
		this._append`M${this._x0 = this._x1 = +e},${this._y0 = this._y1 = +t}h${n = +n}v${+r}h${-n}Z`;
	}
	toString() {
		return this._;
	}
};
es.prototype;
function ts(e = 3) {
	return new es(+e);
}
//#endregion
//#region node_modules/d3-format/src/formatDecimal.js
function ns(e) {
	return Math.abs(e = Math.round(e)) >= 1e21 ? e.toLocaleString("en").replace(/,/g, "") : e.toString(10);
}
function rs(e, t) {
	if (!isFinite(e) || e === 0) return null;
	var n = (e = t ? e.toExponential(t - 1) : e.toExponential()).indexOf("e"), r = e.slice(0, n);
	return [r.length > 1 ? r[0] + r.slice(2) : r, +e.slice(n + 1)];
}
//#endregion
//#region node_modules/d3-format/src/exponent.js
function is(e) {
	return e = rs(Math.abs(e)), e ? e[1] : NaN;
}
//#endregion
//#region node_modules/d3-format/src/formatGroup.js
function as(e, t) {
	return function(n, r) {
		for (var i = n.length, a = [], o = 0, s = e[0], c = 0; i > 0 && s > 0 && (c + s + 1 > r && (s = Math.max(1, r - c)), a.push(n.substring(i -= s, i + s)), !((c += s + 1) > r));) s = e[o = (o + 1) % e.length];
		return a.reverse().join(t);
	};
}
//#endregion
//#region node_modules/d3-format/src/formatNumerals.js
function os(e) {
	return function(t) {
		return t.replace(/[0-9]/g, function(t) {
			return e[+t];
		});
	};
}
//#endregion
//#region node_modules/d3-format/src/formatSpecifier.js
var ss = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function cs(e) {
	if (!(t = ss.exec(e))) throw Error("invalid format: " + e);
	var t;
	return new ls({
		fill: t[1],
		align: t[2],
		sign: t[3],
		symbol: t[4],
		zero: t[5],
		width: t[6],
		comma: t[7],
		precision: t[8] && t[8].slice(1),
		trim: t[9],
		type: t[10]
	});
}
cs.prototype = ls.prototype;
function ls(e) {
	this.fill = e.fill === void 0 ? " " : e.fill + "", this.align = e.align === void 0 ? ">" : e.align + "", this.sign = e.sign === void 0 ? "-" : e.sign + "", this.symbol = e.symbol === void 0 ? "" : e.symbol + "", this.zero = !!e.zero, this.width = e.width === void 0 ? void 0 : +e.width, this.comma = !!e.comma, this.precision = e.precision === void 0 ? void 0 : +e.precision, this.trim = !!e.trim, this.type = e.type === void 0 ? "" : e.type + "";
}
ls.prototype.toString = function() {
	return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
//#endregion
//#region node_modules/d3-format/src/formatTrim.js
function us(e) {
	out: for (var t = e.length, n = 1, r = -1, i; n < t; ++n) switch (e[n]) {
		case ".":
			r = i = n;
			break;
		case "0":
			r === 0 && (r = n), i = n;
			break;
		default:
			if (!+e[n]) break out;
			r > 0 && (r = 0);
	}
	return r > 0 ? e.slice(0, r) + e.slice(i + 1) : e;
}
//#endregion
//#region node_modules/d3-format/src/formatPrefixAuto.js
var ds;
function fs(e, t) {
	var n = rs(e, t);
	if (!n) return ds = void 0, e.toPrecision(t);
	var r = n[0], i = n[1], a = i - (ds = Math.max(-8, Math.min(8, Math.floor(i / 3))) * 3) + 1, o = r.length;
	return a === o ? r : a > o ? r + Array(a - o + 1).join("0") : a > 0 ? r.slice(0, a) + "." + r.slice(a) : "0." + Array(1 - a).join("0") + rs(e, Math.max(0, t + a - 1))[0];
}
//#endregion
//#region node_modules/d3-format/src/formatRounded.js
function ps(e, t) {
	var n = rs(e, t);
	if (!n) return e + "";
	var r = n[0], i = n[1];
	return i < 0 ? "0." + Array(-i).join("0") + r : r.length > i + 1 ? r.slice(0, i + 1) + "." + r.slice(i + 1) : r + Array(i - r.length + 2).join("0");
}
//#endregion
//#region node_modules/d3-format/src/formatTypes.js
var ms = {
	"%": (e, t) => (e * 100).toFixed(t),
	b: (e) => Math.round(e).toString(2),
	c: (e) => e + "",
	d: ns,
	e: (e, t) => e.toExponential(t),
	f: (e, t) => e.toFixed(t),
	g: (e, t) => e.toPrecision(t),
	o: (e) => Math.round(e).toString(8),
	p: (e, t) => ps(e * 100, t),
	r: ps,
	s: fs,
	X: (e) => Math.round(e).toString(16).toUpperCase(),
	x: (e) => Math.round(e).toString(16)
};
//#endregion
//#region node_modules/d3-format/src/identity.js
function hs(e) {
	return e;
}
//#endregion
//#region node_modules/d3-format/src/locale.js
var gs = Array.prototype.map, _s = [
	"y",
	"z",
	"a",
	"f",
	"p",
	"n",
	"µ",
	"m",
	"",
	"k",
	"M",
	"G",
	"T",
	"P",
	"E",
	"Z",
	"Y"
];
function vs(e) {
	var t = e.grouping === void 0 || e.thousands === void 0 ? hs : as(gs.call(e.grouping, Number), e.thousands + ""), n = e.currency === void 0 ? "" : e.currency[0] + "", r = e.currency === void 0 ? "" : e.currency[1] + "", i = e.decimal === void 0 ? "." : e.decimal + "", a = e.numerals === void 0 ? hs : os(gs.call(e.numerals, String)), o = e.percent === void 0 ? "%" : e.percent + "", s = e.minus === void 0 ? "−" : e.minus + "", c = e.nan === void 0 ? "NaN" : e.nan + "";
	function l(e, l) {
		e = cs(e);
		var u = e.fill, d = e.align, f = e.sign, p = e.symbol, m = e.zero, h = e.width, g = e.comma, _ = e.precision, v = e.trim, y = e.type;
		y === "n" ? (g = !0, y = "g") : ms[y] || (_ === void 0 && (_ = 12), v = !0, y = "g"), (m || u === "0" && d === "=") && (m = !0, u = "0", d = "=");
		var b = (l && l.prefix !== void 0 ? l.prefix : "") + (p === "$" ? n : p === "#" && /[boxX]/.test(y) ? "0" + y.toLowerCase() : ""), x = (p === "$" ? r : /[%p]/.test(y) ? o : "") + (l && l.suffix !== void 0 ? l.suffix : ""), S = ms[y], C = /[defgprs%]/.test(y);
		_ = _ === void 0 ? 6 : /[gprs]/.test(y) ? Math.max(1, Math.min(21, _)) : Math.max(0, Math.min(20, _));
		function w(e) {
			var n = b, r = x, o, l, p;
			if (y === "c") r = S(e) + r, e = "";
			else {
				e = +e;
				var w = e < 0 || 1 / e < 0;
				if (e = isNaN(e) ? c : S(Math.abs(e), _), v && (e = us(e)), w && +e == 0 && f !== "+" && (w = !1), n = (w ? f === "(" ? f : s : f === "-" || f === "(" ? "" : f) + n, r = (y === "s" && !isNaN(e) && ds !== void 0 ? _s[8 + ds / 3] : "") + r + (w && f === "(" ? ")" : ""), C) {
					for (o = -1, l = e.length; ++o < l;) if (p = e.charCodeAt(o), 48 > p || p > 57) {
						r = (p === 46 ? i + e.slice(o + 1) : e.slice(o)) + r, e = e.slice(0, o);
						break;
					}
				}
			}
			g && !m && (e = t(e, Infinity));
			var T = n.length + e.length + r.length, E = T < h ? Array(h - T + 1).join(u) : "";
			switch (g && m && (e = t(E + e, E.length ? h - r.length : Infinity), E = ""), d) {
				case "<":
					e = n + e + r + E;
					break;
				case "=":
					e = n + E + e + r;
					break;
				case "^":
					e = E.slice(0, T = E.length >> 1) + n + e + r + E.slice(T);
					break;
				default: e = E + n + e + r;
			}
			return a(e);
		}
		return w.toString = function() {
			return e + "";
		}, w;
	}
	function u(e, t) {
		var n = Math.max(-8, Math.min(8, Math.floor(is(t) / 3))) * 3, r = 10 ** -n, i = l((e = cs(e), e.type = "f", e), { suffix: _s[8 + n / 3] });
		return function(e) {
			return i(r * e);
		};
	}
	return {
		format: l,
		formatPrefix: u
	};
}
//#endregion
//#region node_modules/d3-format/src/defaultLocale.js
var ys, bs, xs;
Ss({
	thousands: ",",
	grouping: [3],
	currency: ["$", ""]
});
function Ss(e) {
	return ys = vs(e), bs = ys.format, xs = ys.formatPrefix, ys;
}
//#endregion
//#region node_modules/d3-format/src/precisionFixed.js
function Cs(e) {
	return Math.max(0, -is(Math.abs(e)));
}
//#endregion
//#region node_modules/d3-format/src/precisionPrefix.js
function ws(e, t) {
	return Math.max(0, Math.max(-8, Math.min(8, Math.floor(is(t) / 3))) * 3 - is(Math.abs(e)));
}
//#endregion
//#region node_modules/d3-format/src/precisionRound.js
function Ts(e, t) {
	return e = Math.abs(e), t = Math.abs(t) - e, Math.max(0, is(t) - is(e)) + 1;
}
//#endregion
//#region node_modules/d3-geo/src/math.js
var N = 1e-6, P = Math.PI, F = P / 2, Es = P / 4, Ds = P * 2, Os = 180 / P, I = P / 180, L = Math.abs, ks = Math.atan, As = Math.atan2, R = Math.cos, js = Math.exp, Ms = Math.log, Ns = Math.pow, z = Math.sin, Ps = Math.sign || function(e) {
	return e > 0 ? 1 : e < 0 ? -1 : 0;
}, Fs = Math.sqrt, Is = Math.tan;
function Ls(e) {
	return e > 1 ? 0 : e < -1 ? P : Math.acos(e);
}
function Rs(e) {
	return e > 1 ? F : e < -1 ? -F : Math.asin(e);
}
//#endregion
//#region node_modules/d3-geo/src/noop.js
function zs() {}
//#endregion
//#region node_modules/d3-geo/src/stream.js
function Bs(e, t) {
	e && Hs.hasOwnProperty(e.type) && Hs[e.type](e, t);
}
var Vs = {
	Feature: function(e, t) {
		Bs(e.geometry, t);
	},
	FeatureCollection: function(e, t) {
		for (var n = e.features, r = -1, i = n.length; ++r < i;) Bs(n[r].geometry, t);
	}
}, Hs = {
	Sphere: function(e, t) {
		t.sphere();
	},
	Point: function(e, t) {
		e = e.coordinates, t.point(e[0], e[1], e[2]);
	},
	MultiPoint: function(e, t) {
		for (var n = e.coordinates, r = -1, i = n.length; ++r < i;) e = n[r], t.point(e[0], e[1], e[2]);
	},
	LineString: function(e, t) {
		Us(e.coordinates, t, 0);
	},
	MultiLineString: function(e, t) {
		for (var n = e.coordinates, r = -1, i = n.length; ++r < i;) Us(n[r], t, 0);
	},
	Polygon: function(e, t) {
		Ws(e.coordinates, t);
	},
	MultiPolygon: function(e, t) {
		for (var n = e.coordinates, r = -1, i = n.length; ++r < i;) Ws(n[r], t);
	},
	GeometryCollection: function(e, t) {
		for (var n = e.geometries, r = -1, i = n.length; ++r < i;) Bs(n[r], t);
	}
};
function Us(e, t, n) {
	var r = -1, i = e.length - n, a;
	for (t.lineStart(); ++r < i;) a = e[r], t.point(a[0], a[1], a[2]);
	t.lineEnd();
}
function Ws(e, t) {
	var n = -1, r = e.length;
	for (t.polygonStart(); ++n < r;) Us(e[n], t, 1);
	t.polygonEnd();
}
function Gs(e, t) {
	e && Vs.hasOwnProperty(e.type) ? Vs[e.type](e, t) : Bs(e, t);
}
//#endregion
//#region node_modules/d3-geo/src/cartesian.js
function Ks(e) {
	return [As(e[1], e[0]), Rs(e[2])];
}
function qs(e) {
	var t = e[0], n = e[1], r = R(n);
	return [
		r * R(t),
		r * z(t),
		z(n)
	];
}
function Js(e, t) {
	return e[0] * t[0] + e[1] * t[1] + e[2] * t[2];
}
function Ys(e, t) {
	return [
		e[1] * t[2] - e[2] * t[1],
		e[2] * t[0] - e[0] * t[2],
		e[0] * t[1] - e[1] * t[0]
	];
}
function Xs(e, t) {
	e[0] += t[0], e[1] += t[1], e[2] += t[2];
}
function Zs(e, t) {
	return [
		e[0] * t,
		e[1] * t,
		e[2] * t
	];
}
function Qs(e) {
	var t = Fs(e[0] * e[0] + e[1] * e[1] + e[2] * e[2]);
	e[0] /= t, e[1] /= t, e[2] /= t;
}
//#endregion
//#region node_modules/d3-geo/src/compose.js
function $s(e, t) {
	function n(n, r) {
		return n = e(n, r), t(n[0], n[1]);
	}
	return e.invert && t.invert && (n.invert = function(n, r) {
		return n = t.invert(n, r), n && e.invert(n[0], n[1]);
	}), n;
}
//#endregion
//#region node_modules/d3-geo/src/rotation.js
function ec(e, t) {
	return L(e) > P && (e -= Math.round(e / Ds) * Ds), [e, t];
}
ec.invert = ec;
function tc(e, t, n) {
	return (e %= Ds) ? t || n ? $s(rc(e), ic(t, n)) : rc(e) : t || n ? ic(t, n) : ec;
}
function nc(e) {
	return function(t, n) {
		return t += e, L(t) > P && (t -= Math.round(t / Ds) * Ds), [t, n];
	};
}
function rc(e) {
	var t = nc(e);
	return t.invert = nc(-e), t;
}
function ic(e, t) {
	var n = R(e), r = z(e), i = R(t), a = z(t);
	function o(e, t) {
		var o = R(t), s = R(e) * o, c = z(e) * o, l = z(t), u = l * n + s * r;
		return [As(c * i - u * a, s * n - l * r), Rs(u * i + c * a)];
	}
	return o.invert = function(e, t) {
		var o = R(t), s = R(e) * o, c = z(e) * o, l = z(t), u = l * i - c * a;
		return [As(c * i + l * a, s * n + u * r), Rs(u * n - s * r)];
	}, o;
}
function ac(e) {
	e = tc(e[0] * I, e[1] * I, e.length > 2 ? e[2] * I : 0);
	function t(t) {
		return t = e(t[0] * I, t[1] * I), t[0] *= Os, t[1] *= Os, t;
	}
	return t.invert = function(t) {
		return t = e.invert(t[0] * I, t[1] * I), t[0] *= Os, t[1] *= Os, t;
	}, t;
}
//#endregion
//#region node_modules/d3-geo/src/circle.js
function oc(e, t, n, r, i, a) {
	if (n) {
		var o = R(t), s = z(t), c = r * n;
		i == null ? (i = t + r * Ds, a = t - c / 2) : (i = sc(o, i), a = sc(o, a), (r > 0 ? i < a : i > a) && (i += r * Ds));
		for (var l, u = i; r > 0 ? u > a : u < a; u -= c) l = Ks([
			o,
			-s * R(u),
			-s * z(u)
		]), e.point(l[0], l[1]);
	}
}
function sc(e, t) {
	t = qs(t), t[0] -= e, Qs(t);
	var n = Ls(-t[1]);
	return ((-t[2] < 0 ? -n : n) + Ds - N) % Ds;
}
//#endregion
//#region node_modules/d3-geo/src/clip/buffer.js
function cc() {
	var e = [], t;
	return {
		point: function(e, n, r) {
			t.push([
				e,
				n,
				r
			]);
		},
		lineStart: function() {
			e.push(t = []);
		},
		lineEnd: zs,
		rejoin: function() {
			e.length > 1 && e.push(e.pop().concat(e.shift()));
		},
		result: function() {
			var n = e;
			return e = [], t = null, n;
		}
	};
}
//#endregion
//#region node_modules/d3-geo/src/pointEqual.js
function lc(e, t) {
	return L(e[0] - t[0]) < 1e-6 && L(e[1] - t[1]) < 1e-6;
}
//#endregion
//#region node_modules/d3-geo/src/clip/rejoin.js
function uc(e, t, n, r) {
	this.x = e, this.z = t, this.o = n, this.e = r, this.v = !1, this.n = this.p = null;
}
function dc(e, t, n, r, i) {
	var a = [], o = [], s, c;
	if (e.forEach(function(e) {
		if (!((t = e.length - 1) <= 0)) {
			var t, n = e[0], r = e[t], c;
			if (lc(n, r)) {
				if (!n[2] && !r[2]) {
					for (i.lineStart(), s = 0; s < t; ++s) i.point((n = e[s])[0], n[1]);
					i.lineEnd();
					return;
				}
				r[0] += 2 * N;
			}
			a.push(c = new uc(n, e, null, !0)), o.push(c.o = new uc(n, null, c, !1)), a.push(c = new uc(r, e, null, !1)), o.push(c.o = new uc(r, null, c, !0));
		}
	}), a.length) {
		for (o.sort(t), fc(a), fc(o), s = 0, c = o.length; s < c; ++s) o[s].e = n = !n;
		for (var l = a[0], u, d;;) {
			for (var f = l, p = !0; f.v;) if ((f = f.n) === l) return;
			u = f.z, i.lineStart();
			do {
				if (f.v = f.o.v = !0, f.e) {
					if (p) for (s = 0, c = u.length; s < c; ++s) i.point((d = u[s])[0], d[1]);
					else r(f.x, f.n.x, 1, i);
					f = f.n;
				} else {
					if (p) for (u = f.p.z, s = u.length - 1; s >= 0; --s) i.point((d = u[s])[0], d[1]);
					else r(f.x, f.p.x, -1, i);
					f = f.p;
				}
				f = f.o, u = f.z, p = !p;
			} while (!f.v);
			i.lineEnd();
		}
	}
}
function fc(e) {
	if (t = e.length) {
		for (var t, n = 0, r = e[0], i; ++n < t;) r.n = i = e[n], i.p = r, r = i;
		r.n = i = e[0], i.p = r;
	}
}
//#endregion
//#region node_modules/d3-geo/src/polygonContains.js
function pc(e) {
	return L(e[0]) <= P ? e[0] : Ps(e[0]) * ((L(e[0]) + P) % Ds - P);
}
function mc(e, t) {
	var n = pc(t), r = t[1], i = z(r), a = [
		z(n),
		-R(n),
		0
	], o = 0, s = 0, c = new v();
	i === 1 ? r = F + N : i === -1 && (r = -F - N);
	for (var l = 0, u = e.length; l < u; ++l) if (f = (d = e[l]).length) for (var d, f, p = d[f - 1], m = pc(p), h = p[1] / 2 + Es, g = z(h), _ = R(h), y = 0; y < f; ++y, m = x, g = C, _ = w, p = b) {
		var b = d[y], x = pc(b), S = b[1] / 2 + Es, C = z(S), w = R(S), T = x - m, E = T >= 0 ? 1 : -1, D = E * T, O = D > P, k = g * C;
		if (c.add(As(k * E * z(D), _ * w + k * R(D))), o += O ? T + E * Ds : T, O ^ m >= n ^ x >= n) {
			var A = Ys(qs(p), qs(b));
			Qs(A);
			var j = Ys(a, A);
			Qs(j);
			var ee = (O ^ T >= 0 ? -1 : 1) * Rs(j[2]);
			(r > ee || r === ee && (A[0] || A[1])) && (s += O ^ T >= 0 ? 1 : -1);
		}
	}
	return (o < -1e-6 || o < 1e-6 && c < -1e-12) ^ s & 1;
}
//#endregion
//#region node_modules/d3-geo/src/clip/index.js
function hc(e, t, n, r) {
	return function(i) {
		var a = t(i), o = cc(), s = t(o), c = !1, l, u, d, f = {
			point: p,
			lineStart: h,
			lineEnd: g,
			polygonStart: function() {
				f.point = _, f.lineStart = v, f.lineEnd = y, u = [], l = [];
			},
			polygonEnd: function() {
				f.point = p, f.lineStart = h, f.lineEnd = g, u = Te(u);
				var e = mc(l, r);
				u.length ? (c ||= (i.polygonStart(), !0), dc(u, _c, e, n, i)) : e && (c ||= (i.polygonStart(), !0), i.lineStart(), n(null, null, 1, i), i.lineEnd()), c &&= (i.polygonEnd(), !1), u = l = null;
			},
			sphere: function() {
				i.polygonStart(), i.lineStart(), n(null, null, 1, i), i.lineEnd(), i.polygonEnd();
			}
		};
		function p(t, n) {
			e(t, n) && i.point(t, n);
		}
		function m(e, t) {
			a.point(e, t);
		}
		function h() {
			f.point = m, a.lineStart();
		}
		function g() {
			f.point = p, a.lineEnd();
		}
		function _(e, t) {
			d.push([e, t]), s.point(e, t);
		}
		function v() {
			s.lineStart(), d = [];
		}
		function y() {
			_(d[0][0], d[0][1]), s.lineEnd();
			var e = s.clean(), t = o.result(), n, r = t.length, a, f, p;
			if (d.pop(), l.push(d), d = null, r) {
				if (e & 1) {
					if (f = t[0], (a = f.length - 1) > 0) {
						for (c ||= (i.polygonStart(), !0), i.lineStart(), n = 0; n < a; ++n) i.point((p = f[n])[0], p[1]);
						i.lineEnd();
					}
					return;
				}
				r > 1 && e & 2 && t.push(t.pop().concat(t.shift())), u.push(t.filter(gc));
			}
		}
		return f;
	};
}
function gc(e) {
	return e.length > 1;
}
function _c(e, t) {
	return ((e = e.x)[0] < 0 ? e[1] - F - N : F - e[1]) - ((t = t.x)[0] < 0 ? t[1] - F - N : F - t[1]);
}
//#endregion
//#region node_modules/d3-geo/src/clip/antimeridian.js
var vc = hc(function() {
	return !0;
}, yc, xc, [-P, -F]);
function yc(e) {
	var t = NaN, n = NaN, r = NaN, i;
	return {
		lineStart: function() {
			e.lineStart(), i = 1;
		},
		point: function(a, o) {
			var s = a > 0 ? P : -P, c = L(a - t);
			L(c - P) < 1e-6 ? (e.point(t, n = (n + o) / 2 > 0 ? F : -F), e.point(r, n), e.lineEnd(), e.lineStart(), e.point(s, n), e.point(a, n), i = 0) : r !== s && c >= P && (L(t - r) < 1e-6 && (t -= r * N), L(a - s) < 1e-6 && (a -= s * N), n = bc(t, n, a, o), e.point(r, n), e.lineEnd(), e.lineStart(), e.point(s, n), i = 0), e.point(t = a, n = o), r = s;
		},
		lineEnd: function() {
			e.lineEnd(), t = n = NaN;
		},
		clean: function() {
			return 2 - i;
		}
	};
}
function bc(e, t, n, r) {
	var i, a, o = z(e - n);
	return L(o) > 1e-6 ? ks((z(t) * (a = R(r)) * z(n) - z(r) * (i = R(t)) * z(e)) / (i * a * o)) : (t + r) / 2;
}
function xc(e, t, n, r) {
	var i;
	if (e == null) i = n * F, r.point(-P, i), r.point(0, i), r.point(P, i), r.point(P, 0), r.point(P, -i), r.point(0, -i), r.point(-P, -i), r.point(-P, 0), r.point(-P, i);
	else if (L(e[0] - t[0]) > 1e-6) {
		var a = e[0] < t[0] ? P : -P;
		i = n * a / 2, r.point(-a, i), r.point(0, i), r.point(a, i);
	} else r.point(t[0], t[1]);
}
//#endregion
//#region node_modules/d3-geo/src/clip/circle.js
function Sc(e) {
	var t = R(e), n = 2 * I, r = t > 0, i = L(t) > N;
	function a(t, r, i, a) {
		oc(a, e, n, i, t, r);
	}
	function o(e, n) {
		return R(e) * R(n) > t;
	}
	function s(e) {
		var t, n, a, s, u;
		return {
			lineStart: function() {
				s = a = !1, u = 1;
			},
			point: function(d, f) {
				var p = [d, f], m, h = o(d, f), g = r ? h ? 0 : l(d, f) : h ? l(d + (d < 0 ? P : -P), f) : 0;
				if (!t && (s = a = h) && e.lineStart(), h !== a && (m = c(t, p), (!m || lc(t, m) || lc(p, m)) && (p[2] = 1)), h !== a) u = 0, h ? (e.lineStart(), m = c(p, t), e.point(m[0], m[1])) : (m = c(t, p), e.point(m[0], m[1], 2), e.lineEnd()), t = m;
				else if (i && t && r ^ h) {
					var _;
					!(g & n) && (_ = c(p, t, !0)) && (u = 0, r ? (e.lineStart(), e.point(_[0][0], _[0][1]), e.point(_[1][0], _[1][1]), e.lineEnd()) : (e.point(_[1][0], _[1][1]), e.lineEnd(), e.lineStart(), e.point(_[0][0], _[0][1], 3)));
				}
				h && (!t || !lc(t, p)) && e.point(p[0], p[1]), t = p, a = h, n = g;
			},
			lineEnd: function() {
				a && e.lineEnd(), t = null;
			},
			clean: function() {
				return u | (s && a) << 1;
			}
		};
	}
	function c(e, n, r) {
		var i = qs(e), a = qs(n), o = [
			1,
			0,
			0
		], s = Ys(i, a), c = Js(s, s), l = s[0], u = c - l * l;
		if (!u) return !r && e;
		var d = t * c / u, f = -t * l / u, p = Ys(o, s), m = Zs(o, d);
		Xs(m, Zs(s, f));
		var h = p, g = Js(m, h), _ = Js(h, h), v = g * g - _ * (Js(m, m) - 1);
		if (!(v < 0)) {
			var y = Fs(v), b = Zs(h, (-g - y) / _);
			if (Xs(b, m), b = Ks(b), !r) return b;
			var x = e[0], S = n[0], C = e[1], w = n[1], T;
			S < x && (T = x, x = S, S = T);
			var E = S - x, D = L(E - P) < N, O = D || E < 1e-6;
			if (!D && w < C && (T = C, C = w, w = T), O ? D ? C + w > 0 ^ b[1] < (L(b[0] - x) < 1e-6 ? C : w) : C <= b[1] && b[1] <= w : E > P ^ (x <= b[0] && b[0] <= S)) {
				var k = Zs(h, (-g + y) / _);
				return Xs(k, m), [b, Ks(k)];
			}
		}
	}
	function l(t, n) {
		var i = r ? e : P - e, a = 0;
		return t < -i ? a |= 1 : t > i && (a |= 2), n < -i ? a |= 4 : n > i && (a |= 8), a;
	}
	return hc(o, s, a, r ? [0, -e] : [-P, e - P]);
}
//#endregion
//#region node_modules/d3-geo/src/clip/line.js
function Cc(e, t, n, r, i, a) {
	var o = e[0], s = e[1], c = t[0], l = t[1], u = 0, d = 1, f = c - o, p = l - s, m = n - o;
	if (!(!f && m > 0)) {
		if (m /= f, f < 0) {
			if (m < u) return;
			m < d && (d = m);
		} else if (f > 0) {
			if (m > d) return;
			m > u && (u = m);
		}
		if (m = i - o, !(!f && m < 0)) {
			if (m /= f, f < 0) {
				if (m > d) return;
				m > u && (u = m);
			} else if (f > 0) {
				if (m < u) return;
				m < d && (d = m);
			}
			if (m = r - s, !(!p && m > 0)) {
				if (m /= p, p < 0) {
					if (m < u) return;
					m < d && (d = m);
				} else if (p > 0) {
					if (m > d) return;
					m > u && (u = m);
				}
				if (m = a - s, !(!p && m < 0)) {
					if (m /= p, p < 0) {
						if (m > d) return;
						m > u && (u = m);
					} else if (p > 0) {
						if (m < u) return;
						m < d && (d = m);
					}
					return u > 0 && (e[0] = o + u * f, e[1] = s + u * p), d < 1 && (t[0] = o + d * f, t[1] = s + d * p), !0;
				}
			}
		}
	}
}
//#endregion
//#region node_modules/d3-geo/src/clip/rectangle.js
var wc = 1e9, Tc = -wc;
function Ec(e, t, n, r) {
	function i(i, a) {
		return e <= i && i <= n && t <= a && a <= r;
	}
	function a(i, a, s, l) {
		var u = 0, d = 0;
		if (i == null || (u = o(i, s)) !== (d = o(a, s)) || c(i, a) < 0 ^ s > 0) do
			l.point(u === 0 || u === 3 ? e : n, u > 1 ? r : t);
		while ((u = (u + s + 4) % 4) !== d);
		else l.point(a[0], a[1]);
	}
	function o(r, i) {
		return L(r[0] - e) < 1e-6 ? i > 0 ? 0 : 3 : L(r[0] - n) < 1e-6 ? i > 0 ? 2 : 1 : L(r[1] - t) < 1e-6 ? +(i > 0) : i > 0 ? 3 : 2;
	}
	function s(e, t) {
		return c(e.x, t.x);
	}
	function c(e, t) {
		var n = o(e, 1), r = o(t, 1);
		return n === r ? n === 0 ? t[1] - e[1] : n === 1 ? e[0] - t[0] : n === 2 ? e[1] - t[1] : t[0] - e[0] : n - r;
	}
	return function(o) {
		var c = o, l = cc(), u, d, f, p, m, h, g, _, v, y, b, x = {
			point: S,
			lineStart: E,
			lineEnd: D,
			polygonStart: w,
			polygonEnd: T
		};
		function S(e, t) {
			i(e, t) && c.point(e, t);
		}
		function C() {
			for (var t = 0, n = 0, i = d.length; n < i; ++n) for (var a = d[n], o = 1, s = a.length, c = a[0], l, u, f = c[0], p = c[1]; o < s; ++o) l = f, u = p, c = a[o], f = c[0], p = c[1], u <= r ? p > r && (f - l) * (r - u) > (p - u) * (e - l) && ++t : p <= r && (f - l) * (r - u) < (p - u) * (e - l) && --t;
			return t;
		}
		function w() {
			c = l, u = [], d = [], b = !0;
		}
		function T() {
			var e = C(), t = b && e, n = (u = Te(u)).length;
			(t || n) && (o.polygonStart(), t && (o.lineStart(), a(null, null, 1, o), o.lineEnd()), n && dc(u, s, e, a, o), o.polygonEnd()), c = o, u = d = f = null;
		}
		function E() {
			x.point = O, d && d.push(f = []), y = !0, v = !1, g = _ = NaN;
		}
		function D() {
			u && (O(p, m), h && v && l.rejoin(), u.push(l.result())), x.point = S, v && c.lineEnd();
		}
		function O(a, o) {
			var s = i(a, o);
			if (d && f.push([a, o]), y) p = a, m = o, h = s, y = !1, s && (c.lineStart(), c.point(a, o));
			else if (s && v) c.point(a, o);
			else {
				var l = [g = Math.max(Tc, Math.min(wc, g)), _ = Math.max(Tc, Math.min(wc, _))], u = [a = Math.max(Tc, Math.min(wc, a)), o = Math.max(Tc, Math.min(wc, o))];
				Cc(l, u, e, t, n, r) ? (v || (c.lineStart(), c.point(l[0], l[1])), c.point(u[0], u[1]), s || c.lineEnd(), b = !1) : s && (c.lineStart(), c.point(a, o), b = !1);
			}
			g = a, _ = o, v = s;
		}
		return x;
	};
}
//#endregion
//#region node_modules/d3-geo/src/identity.js
var Dc = (e) => e, Oc = new v(), kc = new v(), Ac, jc, Mc, Nc, Pc = {
	point: zs,
	lineStart: zs,
	lineEnd: zs,
	polygonStart: function() {
		Pc.lineStart = Fc, Pc.lineEnd = Rc;
	},
	polygonEnd: function() {
		Pc.lineStart = Pc.lineEnd = Pc.point = zs, Oc.add(L(kc)), kc = new v();
	},
	result: function() {
		var e = Oc / 2;
		return Oc = new v(), e;
	}
};
function Fc() {
	Pc.point = Ic;
}
function Ic(e, t) {
	Pc.point = Lc, Ac = Mc = e, jc = Nc = t;
}
function Lc(e, t) {
	kc.add(Nc * e - Mc * t), Mc = e, Nc = t;
}
function Rc() {
	Lc(Ac, jc);
}
//#endregion
//#region node_modules/d3-geo/src/path/bounds.js
var zc = Infinity, Bc = zc, Vc = -zc, Hc = Vc, Uc = {
	point: Wc,
	lineStart: zs,
	lineEnd: zs,
	polygonStart: zs,
	polygonEnd: zs,
	result: function() {
		var e = [[zc, Bc], [Vc, Hc]];
		return Vc = Hc = -(Bc = zc = Infinity), e;
	}
};
function Wc(e, t) {
	e < zc && (zc = e), e > Vc && (Vc = e), t < Bc && (Bc = t), t > Hc && (Hc = t);
}
//#endregion
//#region node_modules/d3-geo/src/path/centroid.js
var Gc = 0, Kc = 0, qc = 0, Jc = 0, Yc = 0, Xc = 0, Zc = 0, Qc = 0, $c = 0, el, tl, nl, rl, il = {
	point: al,
	lineStart: ol,
	lineEnd: ll,
	polygonStart: function() {
		il.lineStart = ul, il.lineEnd = dl;
	},
	polygonEnd: function() {
		il.point = al, il.lineStart = ol, il.lineEnd = ll;
	},
	result: function() {
		var e = $c ? [Zc / $c, Qc / $c] : Xc ? [Jc / Xc, Yc / Xc] : qc ? [Gc / qc, Kc / qc] : [NaN, NaN];
		return Gc = Kc = qc = Jc = Yc = Xc = Zc = Qc = $c = 0, e;
	}
};
function al(e, t) {
	Gc += e, Kc += t, ++qc;
}
function ol() {
	il.point = sl;
}
function sl(e, t) {
	il.point = cl, al(nl = e, rl = t);
}
function cl(e, t) {
	var n = e - nl, r = t - rl, i = Fs(n * n + r * r);
	Jc += i * (nl + e) / 2, Yc += i * (rl + t) / 2, Xc += i, al(nl = e, rl = t);
}
function ll() {
	il.point = al;
}
function ul() {
	il.point = fl;
}
function dl() {
	pl(el, tl);
}
function fl(e, t) {
	il.point = pl, al(el = nl = e, tl = rl = t);
}
function pl(e, t) {
	var n = e - nl, r = t - rl, i = Fs(n * n + r * r);
	Jc += i * (nl + e) / 2, Yc += i * (rl + t) / 2, Xc += i, i = rl * e - nl * t, Zc += i * (nl + e), Qc += i * (rl + t), $c += i * 3, al(nl = e, rl = t);
}
//#endregion
//#region node_modules/d3-geo/src/path/context.js
function ml(e) {
	this._context = e;
}
ml.prototype = {
	_radius: 4.5,
	pointRadius: function(e) {
		return this._radius = e, this;
	},
	polygonStart: function() {
		this._line = 0;
	},
	polygonEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._point = 0;
	},
	lineEnd: function() {
		this._line === 0 && this._context.closePath(), this._point = NaN;
	},
	point: function(e, t) {
		switch (this._point) {
			case 0:
				this._context.moveTo(e, t), this._point = 1;
				break;
			case 1:
				this._context.lineTo(e, t);
				break;
			default: this._context.moveTo(e + this._radius, t), this._context.arc(e, t, this._radius, 0, Ds);
		}
	},
	result: zs
};
//#endregion
//#region node_modules/d3-geo/src/path/measure.js
var hl = new v(), gl, _l, vl, yl, bl, xl = {
	point: zs,
	lineStart: function() {
		xl.point = Sl;
	},
	lineEnd: function() {
		gl && Cl(_l, vl), xl.point = zs;
	},
	polygonStart: function() {
		gl = !0;
	},
	polygonEnd: function() {
		gl = null;
	},
	result: function() {
		var e = +hl;
		return hl = new v(), e;
	}
};
function Sl(e, t) {
	xl.point = Cl, _l = yl = e, vl = bl = t;
}
function Cl(e, t) {
	yl -= e, bl -= t, hl.add(Fs(yl * yl + bl * bl)), yl = e, bl = t;
}
//#endregion
//#region node_modules/d3-geo/src/path/string.js
var wl, Tl, El, Dl, Ol = class {
	constructor(e) {
		this._append = e == null ? kl : Al(e), this._radius = 4.5, this._ = "";
	}
	pointRadius(e) {
		return this._radius = +e, this;
	}
	polygonStart() {
		this._line = 0;
	}
	polygonEnd() {
		this._line = NaN;
	}
	lineStart() {
		this._point = 0;
	}
	lineEnd() {
		this._line === 0 && (this._ += "Z"), this._point = NaN;
	}
	point(e, t) {
		switch (this._point) {
			case 0:
				this._append`M${e},${t}`, this._point = 1;
				break;
			case 1:
				this._append`L${e},${t}`;
				break;
			default:
				if (this._append`M${e},${t}`, this._radius !== El || this._append !== Tl) {
					let e = this._radius, t = this._;
					this._ = "", this._append`m0,${e}a${e},${e} 0 1,1 0,${-2 * e}a${e},${e} 0 1,1 0,${2 * e}z`, El = e, Tl = this._append, Dl = this._, this._ = t;
				}
				this._ += Dl;
		}
	}
	result() {
		let e = this._;
		return this._ = "", e.length ? e : null;
	}
};
function kl(e) {
	let t = 1;
	this._ += e[0];
	for (let n = e.length; t < n; ++t) this._ += arguments[t] + e[t];
}
function Al(e) {
	let t = Math.floor(e);
	if (!(t >= 0)) throw RangeError(`invalid digits: ${e}`);
	if (t > 15) return kl;
	if (t !== wl) {
		let e = 10 ** t;
		wl = t, Tl = function(t) {
			let n = 1;
			this._ += t[0];
			for (let r = t.length; n < r; ++n) this._ += Math.round(arguments[n] * e) / e + t[n];
		};
	}
	return Tl;
}
//#endregion
//#region node_modules/d3-geo/src/path/index.js
function jl(e, t) {
	let n = 3, r = 4.5, i, a;
	function o(e) {
		return e && (typeof r == "function" && a.pointRadius(+r.apply(this, arguments)), Gs(e, i(a))), a.result();
	}
	return o.area = function(e) {
		return Gs(e, i(Pc)), Pc.result();
	}, o.measure = function(e) {
		return Gs(e, i(xl)), xl.result();
	}, o.bounds = function(e) {
		return Gs(e, i(Uc)), Uc.result();
	}, o.centroid = function(e) {
		return Gs(e, i(il)), il.result();
	}, o.projection = function(t) {
		return arguments.length ? (i = t == null ? (e = null, Dc) : (e = t).stream, o) : e;
	}, o.context = function(e) {
		return arguments.length ? (a = e == null ? (t = null, new Ol(n)) : new ml(t = e), typeof r != "function" && a.pointRadius(r), o) : t;
	}, o.pointRadius = function(e) {
		return arguments.length ? (r = typeof e == "function" ? e : (a.pointRadius(+e), +e), o) : r;
	}, o.digits = function(e) {
		if (!arguments.length) return n;
		if (e == null) n = null;
		else {
			let t = Math.floor(e);
			if (!(t >= 0)) throw RangeError(`invalid digits: ${e}`);
			n = t;
		}
		return t === null && (a = new Ol(n)), o;
	}, o.projection(e).digits(n).context(t);
}
//#endregion
//#region node_modules/d3-geo/src/transform.js
function Ml(e) {
	return { stream: Nl(e) };
}
function Nl(e) {
	return function(t) {
		var n = new Pl();
		for (var r in e) n[r] = e[r];
		return n.stream = t, n;
	};
}
function Pl() {}
Pl.prototype = {
	constructor: Pl,
	point: function(e, t) {
		this.stream.point(e, t);
	},
	sphere: function() {
		this.stream.sphere();
	},
	lineStart: function() {
		this.stream.lineStart();
	},
	lineEnd: function() {
		this.stream.lineEnd();
	},
	polygonStart: function() {
		this.stream.polygonStart();
	},
	polygonEnd: function() {
		this.stream.polygonEnd();
	}
};
//#endregion
//#region node_modules/d3-geo/src/projection/fit.js
function Fl(e, t, n) {
	var r = e.clipExtent && e.clipExtent();
	return e.scale(150).translate([0, 0]), r != null && e.clipExtent(null), Gs(n, e.stream(Uc)), t(Uc.result()), r != null && e.clipExtent(r), e;
}
function Il(e, t, n) {
	return Fl(e, function(n) {
		var r = t[1][0] - t[0][0], i = t[1][1] - t[0][1], a = Math.min(r / (n[1][0] - n[0][0]), i / (n[1][1] - n[0][1])), o = +t[0][0] + (r - a * (n[1][0] + n[0][0])) / 2, s = +t[0][1] + (i - a * (n[1][1] + n[0][1])) / 2;
		e.scale(150 * a).translate([o, s]);
	}, n);
}
function Ll(e, t, n) {
	return Il(e, [[0, 0], t], n);
}
function Rl(e, t, n) {
	return Fl(e, function(n) {
		var r = +t, i = r / (n[1][0] - n[0][0]), a = (r - i * (n[1][0] + n[0][0])) / 2, o = -i * n[0][1];
		e.scale(150 * i).translate([a, o]);
	}, n);
}
function zl(e, t, n) {
	return Fl(e, function(n) {
		var r = +t, i = r / (n[1][1] - n[0][1]), a = -i * n[0][0], o = (r - i * (n[1][1] + n[0][1])) / 2;
		e.scale(150 * i).translate([a, o]);
	}, n);
}
//#endregion
//#region node_modules/d3-geo/src/projection/resample.js
var Bl = 16, Vl = R(30 * I);
function Hl(e, t) {
	return +t ? Wl(e, t) : Ul(e);
}
function Ul(e) {
	return Nl({ point: function(t, n) {
		t = e(t, n), this.stream.point(t[0], t[1]);
	} });
}
function Wl(e, t) {
	function n(r, i, a, o, s, c, l, u, d, f, p, m, h, g) {
		var _ = l - r, v = u - i, y = _ * _ + v * v;
		if (y > 4 * t && h--) {
			var b = o + f, x = s + p, S = c + m, C = Fs(b * b + x * x + S * S), w = Rs(S /= C), T = L(L(S) - 1) < 1e-6 || L(a - d) < 1e-6 ? (a + d) / 2 : As(x, b), E = e(T, w), D = E[0], O = E[1], k = D - r, A = O - i, j = v * k - _ * A;
			(j * j / y > t || L((_ * k + v * A) / y - .5) > .3 || o * f + s * p + c * m < Vl) && (n(r, i, a, o, s, c, D, O, T, b /= C, x /= C, S, h, g), g.point(D, O), n(D, O, T, b, x, S, l, u, d, f, p, m, h, g));
		}
	}
	return function(t) {
		var r, i, a, o, s, c, l, u, d, f, p, m, h = {
			point: g,
			lineStart: _,
			lineEnd: y,
			polygonStart: function() {
				t.polygonStart(), h.lineStart = b;
			},
			polygonEnd: function() {
				t.polygonEnd(), h.lineStart = _;
			}
		};
		function g(n, r) {
			n = e(n, r), t.point(n[0], n[1]);
		}
		function _() {
			u = NaN, h.point = v, t.lineStart();
		}
		function v(r, i) {
			var a = qs([r, i]), o = e(r, i);
			n(u, d, l, f, p, m, u = o[0], d = o[1], l = r, f = a[0], p = a[1], m = a[2], Bl, t), t.point(u, d);
		}
		function y() {
			h.point = g, t.lineEnd();
		}
		function b() {
			_(), h.point = x, h.lineEnd = S;
		}
		function x(e, t) {
			v(r = e, t), i = u, a = d, o = f, s = p, c = m, h.point = v;
		}
		function S() {
			n(u, d, l, f, p, m, i, a, r, o, s, c, Bl, t), h.lineEnd = y, y();
		}
		return h;
	};
}
//#endregion
//#region node_modules/d3-geo/src/projection/index.js
var Gl = Nl({ point: function(e, t) {
	this.stream.point(e * I, t * I);
} });
function Kl(e) {
	return Nl({ point: function(t, n) {
		var r = e(t, n);
		return this.stream.point(r[0], r[1]);
	} });
}
function ql(e, t, n, r, i) {
	function a(a, o) {
		return a *= r, o *= i, [t + e * a, n - e * o];
	}
	return a.invert = function(a, o) {
		return [(a - t) / e * r, (n - o) / e * i];
	}, a;
}
function Jl(e, t, n, r, i, a) {
	if (!a) return ql(e, t, n, r, i);
	var o = R(a), s = z(a), c = o * e, l = s * e, u = o / e, d = s / e, f = (s * n - o * t) / e, p = (s * t + o * n) / e;
	function m(e, a) {
		return e *= r, a *= i, [c * e - l * a + t, n - l * e - c * a];
	}
	return m.invert = function(e, t) {
		return [r * (u * e - d * t + f), i * (p - d * e - u * t)];
	}, m;
}
function Yl(e) {
	return Xl(function() {
		return e;
	})();
}
function Xl(e) {
	var t, n = 150, r = 480, i = 250, a = 0, o = 0, s = 0, c = 0, l = 0, u, d = 0, f = 1, p = 1, m = null, h = vc, g = null, _, v, y, b = Dc, x = .5, S, C, w, T, E;
	function D(e) {
		return w(e[0] * I, e[1] * I);
	}
	function O(e) {
		return e = w.invert(e[0], e[1]), e && [e[0] * Os, e[1] * Os];
	}
	D.stream = function(e) {
		return T && E === e ? T : T = Gl(Kl(u)(h(S(b(E = e)))));
	}, D.preclip = function(e) {
		return arguments.length ? (h = e, m = void 0, A()) : h;
	}, D.postclip = function(e) {
		return arguments.length ? (b = e, g = _ = v = y = null, A()) : b;
	}, D.clipAngle = function(e) {
		return arguments.length ? (h = +e ? Sc(m = e * I) : (m = null, vc), A()) : m * Os;
	}, D.clipExtent = function(e) {
		return arguments.length ? (b = e == null ? (g = _ = v = y = null, Dc) : Ec(g = +e[0][0], _ = +e[0][1], v = +e[1][0], y = +e[1][1]), A()) : g == null ? null : [[g, _], [v, y]];
	}, D.scale = function(e) {
		return arguments.length ? (n = +e, k()) : n;
	}, D.translate = function(e) {
		return arguments.length ? (r = +e[0], i = +e[1], k()) : [r, i];
	}, D.center = function(e) {
		return arguments.length ? (a = e[0] % 360 * I, o = e[1] % 360 * I, k()) : [a * Os, o * Os];
	}, D.rotate = function(e) {
		return arguments.length ? (s = e[0] % 360 * I, c = e[1] % 360 * I, l = e.length > 2 ? e[2] % 360 * I : 0, k()) : [
			s * Os,
			c * Os,
			l * Os
		];
	}, D.angle = function(e) {
		return arguments.length ? (d = e % 360 * I, k()) : d * Os;
	}, D.reflectX = function(e) {
		return arguments.length ? (f = e ? -1 : 1, k()) : f < 0;
	}, D.reflectY = function(e) {
		return arguments.length ? (p = e ? -1 : 1, k()) : p < 0;
	}, D.precision = function(e) {
		return arguments.length ? (S = Hl(C, x = e * e), A()) : Fs(x);
	}, D.fitExtent = function(e, t) {
		return Il(D, e, t);
	}, D.fitSize = function(e, t) {
		return Ll(D, e, t);
	}, D.fitWidth = function(e, t) {
		return Rl(D, e, t);
	}, D.fitHeight = function(e, t) {
		return zl(D, e, t);
	};
	function k() {
		var e = Jl(n, 0, 0, f, p, d).apply(null, t(a, o)), m = Jl(n, r - e[0], i - e[1], f, p, d);
		return u = tc(s, c, l), C = $s(t, m), w = $s(u, C), S = Hl(C, x), A();
	}
	function A() {
		return T = E = null, D;
	}
	return function() {
		return t = e.apply(this, arguments), D.invert = t.invert && O, k();
	};
}
//#endregion
//#region node_modules/d3-geo/src/projection/conic.js
function Zl(e) {
	var t = 0, n = P / 3, r = Xl(e), i = r(t, n);
	return i.parallels = function(e) {
		return arguments.length ? r(t = e[0] * I, n = e[1] * I) : [t * Os, n * Os];
	}, i;
}
//#endregion
//#region node_modules/d3-geo/src/projection/cylindricalEqualArea.js
function Ql(e) {
	var t = R(e);
	function n(e, n) {
		return [e * t, z(n) / t];
	}
	return n.invert = function(e, n) {
		return [e / t, Rs(n * t)];
	}, n;
}
//#endregion
//#region node_modules/d3-geo/src/projection/conicEqualArea.js
function $l(e, t) {
	var n = z(e), r = (n + z(t)) / 2;
	if (L(r) < 1e-6) return Ql(e);
	var i = 1 + n * (2 * r - n), a = Fs(i) / r;
	function o(e, t) {
		var n = Fs(i - 2 * r * z(t)) / r;
		return [n * z(e *= r), a - n * R(e)];
	}
	return o.invert = function(e, t) {
		var n = a - t, o = As(e, L(n)) * Ps(n);
		return n * r < 0 && (o -= P * Ps(e) * Ps(n)), [o / r, Rs((i - (e * e + n * n) * r * r) / (2 * r))];
	}, o;
}
function eu() {
	return Zl($l).scale(155.424).center([0, 33.6442]);
}
//#endregion
//#region node_modules/d3-geo/src/projection/albers.js
function tu() {
	return eu().parallels([29.5, 45.5]).scale(1070).translate([480, 250]).rotate([96, 0]).center([-.6, 38.7]);
}
//#endregion
//#region node_modules/d3-geo/src/projection/albersUsa.js
function nu(e) {
	var t = e.length;
	return {
		point: function(n, r) {
			for (var i = -1; ++i < t;) e[i].point(n, r);
		},
		sphere: function() {
			for (var n = -1; ++n < t;) e[n].sphere();
		},
		lineStart: function() {
			for (var n = -1; ++n < t;) e[n].lineStart();
		},
		lineEnd: function() {
			for (var n = -1; ++n < t;) e[n].lineEnd();
		},
		polygonStart: function() {
			for (var n = -1; ++n < t;) e[n].polygonStart();
		},
		polygonEnd: function() {
			for (var n = -1; ++n < t;) e[n].polygonEnd();
		}
	};
}
function ru() {
	var e, t, n = tu(), r, i = eu().rotate([154, 0]).center([-2, 58.5]).parallels([55, 65]), a, o = eu().rotate([157, 0]).center([-3, 19.9]).parallels([8, 18]), s, c, l = { point: function(e, t) {
		c = [e, t];
	} };
	function u(e) {
		var t = e[0], n = e[1];
		return c = null, r.point(t, n), c || (a.point(t, n), c) || (s.point(t, n), c);
	}
	u.invert = function(e) {
		var t = n.scale(), r = n.translate(), a = (e[0] - r[0]) / t, s = (e[1] - r[1]) / t;
		return (s >= .12 && s < .234 && a >= -.425 && a < -.214 ? i : s >= .166 && s < .234 && a >= -.214 && a < -.115 ? o : n).invert(e);
	}, u.stream = function(r) {
		return e && t === r ? e : e = nu([
			n.stream(t = r),
			i.stream(r),
			o.stream(r)
		]);
	}, u.precision = function(e) {
		return arguments.length ? (n.precision(e), i.precision(e), o.precision(e), d()) : n.precision();
	}, u.scale = function(e) {
		return arguments.length ? (n.scale(e), i.scale(e * .35), o.scale(e), u.translate(n.translate())) : n.scale();
	}, u.translate = function(e) {
		if (!arguments.length) return n.translate();
		var t = n.scale(), c = +e[0], u = +e[1];
		return r = n.translate(e).clipExtent([[c - .455 * t, u - .238 * t], [c + .455 * t, u + .238 * t]]).stream(l), a = i.translate([c - .307 * t, u + .201 * t]).clipExtent([[c - .425 * t + N, u + .12 * t + N], [c - .214 * t - N, u + .234 * t - N]]).stream(l), s = o.translate([c - .205 * t, u + .212 * t]).clipExtent([[c - .214 * t + N, u + .166 * t + N], [c - .115 * t - N, u + .234 * t - N]]).stream(l), d();
	}, u.fitExtent = function(e, t) {
		return Il(u, e, t);
	}, u.fitSize = function(e, t) {
		return Ll(u, e, t);
	}, u.fitWidth = function(e, t) {
		return Rl(u, e, t);
	}, u.fitHeight = function(e, t) {
		return zl(u, e, t);
	};
	function d() {
		return e = t = null, u;
	}
	return u.scale(1070);
}
//#endregion
//#region node_modules/d3-geo/src/projection/azimuthal.js
function iu(e) {
	return function(t, n) {
		var r = R(t), i = R(n), a = e(r * i);
		return a === Infinity ? [2, 0] : [a * i * z(t), a * z(n)];
	};
}
function au(e) {
	return function(t, n) {
		var r = Fs(t * t + n * n), i = e(r), a = z(i), o = R(i);
		return [As(t * a, r * o), Rs(r && n * a / r)];
	};
}
//#endregion
//#region node_modules/d3-geo/src/projection/azimuthalEqualArea.js
var ou = iu(function(e) {
	return Fs(2 / (1 + e));
});
ou.invert = au(function(e) {
	return 2 * Rs(e / 2);
});
function su() {
	return Yl(ou).scale(124.75).clipAngle(179.999);
}
//#endregion
//#region node_modules/d3-geo/src/projection/azimuthalEquidistant.js
var cu = iu(function(e) {
	return (e = Ls(e)) && e / z(e);
});
cu.invert = au(function(e) {
	return e;
});
function lu() {
	return Yl(cu).scale(79.4188).clipAngle(179.999);
}
//#endregion
//#region node_modules/d3-geo/src/projection/mercator.js
function uu(e, t) {
	return [e, Ms(Is((F + t) / 2))];
}
uu.invert = function(e, t) {
	return [e, 2 * ks(js(t)) - F];
};
function du() {
	return fu(uu).scale(961 / Ds);
}
function fu(e) {
	var t = Yl(e), n = t.center, r = t.scale, i = t.translate, a = t.clipExtent, o = null, s, c, l;
	t.scale = function(e) {
		return arguments.length ? (r(e), u()) : r();
	}, t.translate = function(e) {
		return arguments.length ? (i(e), u()) : i();
	}, t.center = function(e) {
		return arguments.length ? (n(e), u()) : n();
	}, t.clipExtent = function(e) {
		return arguments.length ? (e == null ? o = s = c = l = null : (o = +e[0][0], s = +e[0][1], c = +e[1][0], l = +e[1][1]), u()) : o == null ? null : [[o, s], [c, l]];
	};
	function u() {
		var n = P * r(), i = t(ac(t.rotate()).invert([0, 0]));
		return a(o == null ? [[i[0] - n, i[1] - n], [i[0] + n, i[1] + n]] : e === uu ? [[Math.max(i[0] - n, o), s], [Math.min(i[0] + n, c), l]] : [[o, Math.max(i[1] - n, s)], [c, Math.min(i[1] + n, l)]]);
	}
	return u();
}
//#endregion
//#region node_modules/d3-geo/src/projection/conicConformal.js
function pu(e) {
	return Is((F + e) / 2);
}
function mu(e, t) {
	var n = R(e), r = e === t ? z(e) : Ms(n / R(t)) / Ms(pu(t) / pu(e)), i = n * Ns(pu(e), r) / r;
	if (!r) return uu;
	function a(e, t) {
		i > 0 ? t < -F + 1e-6 && (t = -F + N) : t > F - 1e-6 && (t = F - N);
		var n = i / Ns(pu(t), r);
		return [n * z(r * e), i - n * R(r * e)];
	}
	return a.invert = function(e, t) {
		var n = i - t, a = Ps(r) * Fs(e * e + n * n), o = As(e, L(n)) * Ps(n);
		return n * r < 0 && (o -= P * Ps(e) * Ps(n)), [o / r, 2 * ks(Ns(i / a, 1 / r)) - F];
	}, a;
}
function hu() {
	return Zl(mu).scale(109.5).parallels([30, 30]);
}
//#endregion
//#region node_modules/d3-geo/src/projection/equirectangular.js
function gu(e, t) {
	return [e, t];
}
gu.invert = gu;
function _u() {
	return Yl(gu).scale(152.63);
}
//#endregion
//#region node_modules/d3-geo/src/projection/conicEquidistant.js
function vu(e, t) {
	var n = R(e), r = e === t ? z(e) : (n - R(t)) / (t - e), i = n / r + e;
	if (L(r) < 1e-6) return gu;
	function a(e, t) {
		var n = i - t, a = r * e;
		return [n * z(a), i - n * R(a)];
	}
	return a.invert = function(e, t) {
		var n = i - t, a = As(e, L(n)) * Ps(n);
		return n * r < 0 && (a -= P * Ps(e) * Ps(n)), [a / r, i - Ps(r) * Fs(e * e + n * n)];
	}, a;
}
function yu() {
	return Zl(vu).scale(131.154).center([0, 13.9389]);
}
//#endregion
//#region node_modules/d3-geo/src/projection/equalEarth.js
var bu = 1.340264, xu = -.081106, Su = 893e-6, Cu = .003796, wu = Fs(3) / 2, Tu = 12;
function Eu(e, t) {
	var n = Rs(wu * z(t)), r = n * n, i = r * r * r;
	return [e * R(n) / (wu * (bu + 3 * xu * r + i * (7 * Su + 9 * Cu * r))), n * (bu + xu * r + i * (Su + Cu * r))];
}
Eu.invert = function(e, t) {
	for (var n = t, r = n * n, i = r * r * r, a = 0, o, s, c; a < Tu && (s = n * (bu + xu * r + i * (Su + Cu * r)) - t, c = bu + 3 * xu * r + i * (7 * Su + 9 * Cu * r), n -= o = s / c, r = n * n, i = r * r * r, !(L(o) < 1e-12)); ++a);
	return [wu * e * (bu + 3 * xu * r + i * (7 * Su + 9 * Cu * r)) / R(n), Rs(z(n) / wu)];
};
function Du() {
	return Yl(Eu).scale(177.158);
}
//#endregion
//#region node_modules/d3-geo/src/projection/gnomonic.js
function Ou(e, t) {
	var n = R(t), r = R(e) * n;
	return [n * z(e) / r, z(t) / r];
}
Ou.invert = au(ks);
function ku() {
	return Yl(Ou).scale(144.049).clipAngle(60);
}
//#endregion
//#region node_modules/d3-geo/src/projection/orthographic.js
function Au(e, t) {
	return [R(t) * z(e), z(t)];
}
Au.invert = au(Rs);
function ju() {
	return Yl(Au).scale(249.5).clipAngle(90 + N);
}
//#endregion
//#region node_modules/d3-geo/src/projection/stereographic.js
function Mu(e, t) {
	var n = R(t), r = 1 + R(e) * n;
	return [n * z(e) / r, z(t) / r];
}
Mu.invert = au(function(e) {
	return 2 * ks(e);
});
function Nu() {
	return Yl(Mu).scale(250).clipAngle(142);
}
//#endregion
//#region node_modules/d3-geo/src/projection/transverseMercator.js
function Pu(e, t) {
	return [Ms(Is((F + t) / 2)), -e];
}
Pu.invert = function(e, t) {
	return [-t, 2 * ks(js(e)) - F];
};
function Fu() {
	var e = fu(Pu), t = e.center, n = e.rotate;
	return e.center = function(e) {
		return arguments.length ? t([-e[1], e[0]]) : (e = t(), [e[1], -e[0]]);
	}, e.rotate = function(e) {
		return arguments.length ? n([
			e[0],
			e[1],
			e.length > 2 ? e[2] + 90 : 90
		]) : (e = n(), [
			e[0],
			e[1],
			e[2] - 90
		]);
	}, n([
		0,
		0,
		90
	]).scale(159.155);
}
//#endregion
//#region node_modules/d3-scale/src/init.js
function Iu(e, t) {
	switch (arguments.length) {
		case 0: break;
		case 1:
			this.range(e);
			break;
		default: this.range(t).domain(e);
	}
	return this;
}
function Lu(e, t) {
	switch (arguments.length) {
		case 0: break;
		case 1:
			typeof e == "function" ? this.interpolator(e) : this.range(e);
			break;
		default: this.domain(e), typeof t == "function" ? this.interpolator(t) : this.range(t);
	}
	return this;
}
//#endregion
//#region node_modules/d3-scale/src/ordinal.js
var Ru = Symbol("implicit");
function zu() {
	var e = new y(), t = [], n = [], r = Ru;
	function i(i) {
		let a = e.get(i);
		if (a === void 0) {
			if (r !== Ru) return r;
			e.set(i, a = t.push(i) - 1);
		}
		return n[a % n.length];
	}
	return i.domain = function(n) {
		if (!arguments.length) return t.slice();
		t = [], e = new y();
		for (let r of n) e.has(r) || e.set(r, t.push(r) - 1);
		return i;
	}, i.range = function(e) {
		return arguments.length ? (n = Array.from(e), i) : n.slice();
	}, i.unknown = function(e) {
		return arguments.length ? (r = e, i) : r;
	}, i.copy = function() {
		return zu(t, n).unknown(r);
	}, Iu.apply(i, arguments), i;
}
//#endregion
//#region node_modules/d3-scale/src/band.js
function Bu() {
	var e = zu().unknown(void 0), t = e.domain, n = e.range, r = 0, i = 1, a, o, s = !1, c = 0, l = 0, u = .5;
	delete e.unknown;
	function d() {
		var e = t().length, d = i < r, f = d ? i : r, p = d ? r : i;
		a = (p - f) / Math.max(1, e - c + l * 2), s && (a = Math.floor(a)), f += (p - f - a * (e - c)) * u, o = a * (1 - c), s && (f = Math.round(f), o = Math.round(o));
		var m = ke(e).map(function(e) {
			return f + a * e;
		});
		return n(d ? m.reverse() : m);
	}
	return e.domain = function(e) {
		return arguments.length ? (t(e), d()) : t();
	}, e.range = function(e) {
		return arguments.length ? ([r, i] = e, r = +r, i = +i, d()) : [r, i];
	}, e.rangeRound = function(e) {
		return [r, i] = e, r = +r, i = +i, s = !0, d();
	}, e.bandwidth = function() {
		return o;
	}, e.step = function() {
		return a;
	}, e.round = function(e) {
		return arguments.length ? (s = !!e, d()) : s;
	}, e.padding = function(e) {
		return arguments.length ? (c = Math.min(1, l = +e), d()) : c;
	}, e.paddingInner = function(e) {
		return arguments.length ? (c = Math.min(1, e), d()) : c;
	}, e.paddingOuter = function(e) {
		return arguments.length ? (l = +e, d()) : l;
	}, e.align = function(e) {
		return arguments.length ? (u = Math.max(0, Math.min(1, e)), d()) : u;
	}, e.copy = function() {
		return Bu(t(), [r, i]).round(s).paddingInner(c).paddingOuter(l).align(u);
	}, Iu.apply(d(), arguments);
}
function Vu(e) {
	var t = e.copy;
	return e.padding = e.paddingOuter, delete e.paddingInner, delete e.paddingOuter, e.copy = function() {
		return Vu(t());
	}, e;
}
function Hu() {
	return Vu(Bu.apply(null, arguments).paddingInner(1));
}
//#endregion
//#region node_modules/d3-scale/src/constant.js
function Uu(e) {
	return function() {
		return e;
	};
}
//#endregion
//#region node_modules/d3-scale/src/number.js
function Wu(e) {
	return +e;
}
//#endregion
//#region node_modules/d3-scale/src/continuous.js
var Gu = [0, 1];
function Ku(e) {
	return e;
}
function qu(e, t) {
	return (t -= e = +e) ? function(n) {
		return (n - e) / t;
	} : Uu(isNaN(t) ? NaN : .5);
}
function Ju(e, t) {
	var n;
	return e > t && (n = e, e = t, t = n), function(n) {
		return Math.max(e, Math.min(t, n));
	};
}
function Yu(e, t, n) {
	var r = e[0], i = e[1], a = t[0], o = t[1];
	return i < r ? (r = qu(i, r), a = n(o, a)) : (r = qu(r, i), a = n(a, o)), function(e) {
		return a(r(e));
	};
}
function Xu(e, t, n) {
	var r = Math.min(e.length, t.length) - 1, i = Array(r), a = Array(r), o = -1;
	for (e[r] < e[0] && (e = e.slice().reverse(), t = t.slice().reverse()); ++o < r;) i[o] = qu(e[o], e[o + 1]), a[o] = n(t[o], t[o + 1]);
	return function(t) {
		var n = s(e, t, 1, r) - 1;
		return a[n](i[n](t));
	};
}
function Zu(e, t) {
	return t.domain(e.domain()).range(e.range()).interpolate(e.interpolate()).clamp(e.clamp()).unknown(e.unknown());
}
function Qu() {
	var e = Gu, t = Gu, n = Ri, r, i, a, o = Ku, s, c, l;
	function u() {
		var n = Math.min(e.length, t.length);
		return o !== Ku && (o = Ju(e[0], e[n - 1])), s = n > 2 ? Xu : Yu, c = l = null, d;
	}
	function d(i) {
		return i == null || isNaN(i = +i) ? a : (c ||= s(e.map(r), t, n))(r(o(i)));
	}
	return d.invert = function(n) {
		return o(i((l ||= s(t, e.map(r), ji))(n)));
	}, d.domain = function(t) {
		return arguments.length ? (e = Array.from(t, Wu), u()) : e.slice();
	}, d.range = function(e) {
		return arguments.length ? (t = Array.from(e), u()) : t.slice();
	}, d.rangeRound = function(e) {
		return t = Array.from(e), n = zi, u();
	}, d.clamp = function(e) {
		return arguments.length ? (o = e ? !0 : Ku, u()) : o !== Ku;
	}, d.interpolate = function(e) {
		return arguments.length ? (n = e, u()) : n;
	}, d.unknown = function(e) {
		return arguments.length ? (a = e, d) : a;
	}, function(e, t) {
		return r = e, i = t, u();
	};
}
function $u() {
	return Qu()(Ku, Ku);
}
//#endregion
//#region node_modules/d3-scale/src/tickFormat.js
function ed(e, t, n, r) {
	var i = le(e, t, n), a;
	switch (r = cs(r ?? ",f"), r.type) {
		case "s":
			var o = Math.max(Math.abs(e), Math.abs(t));
			return r.precision == null && !isNaN(a = ws(i, o)) && (r.precision = a), xs(r, o);
		case "":
		case "e":
		case "g":
		case "p":
		case "r":
			r.precision == null && !isNaN(a = Ts(i, Math.max(Math.abs(e), Math.abs(t)))) && (r.precision = a - (r.type === "e"));
			break;
		case "f":
		case "%": r.precision == null && !isNaN(a = Cs(i)) && (r.precision = a - (r.type === "%") * 2);
	}
	return bs(r);
}
//#endregion
//#region node_modules/d3-scale/src/linear.js
function td(e) {
	var t = e.domain;
	return e.ticks = function(e) {
		var n = t();
		return se(n[0], n[n.length - 1], e ?? 10);
	}, e.tickFormat = function(e, n) {
		var r = t();
		return ed(r[0], r[r.length - 1], e ?? 10, n);
	}, e.nice = function(n) {
		n ??= 10;
		var r = t(), i = 0, a = r.length - 1, o = r[i], s = r[a], c, l, u = 10;
		for (s < o && (l = o, o = s, s = l, l = i, i = a, a = l); u-- > 0;) {
			if (l = ce(o, s, n), l === c) return r[i] = o, r[a] = s, t(r);
			if (l > 0) o = Math.floor(o / l) * l, s = Math.ceil(s / l) * l;
			else if (l < 0) o = Math.ceil(o * l) / l, s = Math.floor(s * l) / l;
			else break;
			c = l;
		}
		return e;
	}, e;
}
function nd() {
	var e = $u();
	return e.copy = function() {
		return Zu(e, nd());
	}, Iu.apply(e, arguments), td(e);
}
//#endregion
//#region node_modules/d3-scale/src/identity.js
function rd(e) {
	var t;
	function n(e) {
		return e == null || isNaN(e = +e) ? t : e;
	}
	return n.invert = n, n.domain = n.range = function(t) {
		return arguments.length ? (e = Array.from(t, Wu), n) : e.slice();
	}, n.unknown = function(e) {
		return arguments.length ? (t = e, n) : t;
	}, n.copy = function() {
		return rd(e).unknown(t);
	}, e = arguments.length ? Array.from(e, Wu) : [0, 1], td(n);
}
//#endregion
//#region node_modules/d3-scale/src/nice.js
function id(e, t) {
	e = e.slice();
	var n = 0, r = e.length - 1, i = e[n], a = e[r], o;
	return a < i && (o = n, n = r, r = o, o = i, i = a, a = o), e[n] = t.floor(i), e[r] = t.ceil(a), e;
}
//#endregion
//#region node_modules/d3-scale/src/log.js
function ad(e) {
	return Math.log(e);
}
function od(e) {
	return Math.exp(e);
}
function sd(e) {
	return -Math.log(-e);
}
function cd(e) {
	return -Math.exp(-e);
}
function ld(e) {
	return isFinite(e) ? +("1e" + e) : e < 0 ? 0 : e;
}
function ud(e) {
	return e === 10 ? ld : e === Math.E ? Math.exp : (t) => e ** +t;
}
function dd(e) {
	return e === Math.E ? Math.log : e === 10 && Math.log10 || e === 2 && Math.log2 || (e = Math.log(e), (t) => Math.log(t) / e);
}
function fd(e) {
	return (t, n) => -e(-t, n);
}
function pd(e) {
	let t = e(ad, od), n = t.domain, r = 10, i, a;
	function o() {
		return i = dd(r), a = ud(r), n()[0] < 0 ? (i = fd(i), a = fd(a), e(sd, cd)) : e(ad, od), t;
	}
	return t.base = function(e) {
		return arguments.length ? (r = +e, o()) : r;
	}, t.domain = function(e) {
		return arguments.length ? (n(e), o()) : n();
	}, t.ticks = (e) => {
		let t = n(), o = t[0], s = t[t.length - 1], c = s < o;
		c && ([o, s] = [s, o]);
		let l = i(o), u = i(s), d, f, p = e == null ? 10 : +e, m = [];
		if (!(r % 1) && u - l < p) {
			if (l = Math.floor(l), u = Math.ceil(u), o > 0) {
				for (; l <= u; ++l) for (d = 1; d < r; ++d) if (f = l < 0 ? d / a(-l) : d * a(l), !(f < o)) {
					if (f > s) break;
					m.push(f);
				}
			} else for (; l <= u; ++l) for (d = r - 1; d >= 1; --d) if (f = l > 0 ? d / a(-l) : d * a(l), !(f < o)) {
				if (f > s) break;
				m.push(f);
			}
			m.length * 2 < p && (m = se(o, s, p));
		} else m = se(l, u, Math.min(u - l, p)).map(a);
		return c ? m.reverse() : m;
	}, t.tickFormat = (e, n) => {
		if (e ??= 10, n ??= r === 10 ? "s" : ",", typeof n != "function" && (!(r % 1) && (n = cs(n)).precision == null && (n.trim = !0), n = bs(n)), e === Infinity) return n;
		let o = Math.max(1, r * e / t.ticks().length);
		return (e) => {
			let t = e / a(Math.round(i(e)));
			return t * r < r - .5 && (t *= r), t <= o ? n(e) : "";
		};
	}, t.nice = () => n(id(n(), {
		floor: (e) => a(Math.floor(i(e))),
		ceil: (e) => a(Math.ceil(i(e)))
	})), t;
}
function md() {
	let e = pd(Qu()).domain([1, 10]);
	return e.copy = () => Zu(e, md()).base(e.base()), Iu.apply(e, arguments), e;
}
//#endregion
//#region node_modules/d3-scale/src/symlog.js
function hd(e) {
	return function(t) {
		return Math.sign(t) * Math.log1p(Math.abs(t / e));
	};
}
function gd(e) {
	return function(t) {
		return Math.sign(t) * Math.expm1(Math.abs(t)) * e;
	};
}
function _d(e) {
	var t = 1, n = e(hd(t), gd(t));
	return n.constant = function(n) {
		return arguments.length ? e(hd(t = +n), gd(t)) : t;
	}, td(n);
}
function vd() {
	var e = _d(Qu());
	return e.copy = function() {
		return Zu(e, vd()).constant(e.constant());
	}, Iu.apply(e, arguments);
}
//#endregion
//#region node_modules/d3-scale/src/pow.js
function yd(e) {
	return function(t) {
		return t < 0 ? -((-t) ** +e) : t ** +e;
	};
}
function bd(e) {
	return e < 0 ? -Math.sqrt(-e) : Math.sqrt(e);
}
function xd(e) {
	return e < 0 ? -e * e : e * e;
}
function Sd(e) {
	var t = e(Ku, Ku), n = 1;
	function r() {
		return n === 1 ? e(Ku, Ku) : n === .5 ? e(bd, xd) : e(yd(n), yd(1 / n));
	}
	return t.exponent = function(e) {
		return arguments.length ? (n = +e, r()) : n;
	}, td(t);
}
function Cd() {
	var e = Sd(Qu());
	return e.copy = function() {
		return Zu(e, Cd()).exponent(e.exponent());
	}, Iu.apply(e, arguments), e;
}
//#endregion
//#region node_modules/d3-scale/src/quantile.js
function wd() {
	var t = [], n = [], r = [], i;
	function a() {
		var e = 0, i = Math.max(1, n.length);
		for (r = Array(i - 1); ++e < i;) r[e - 1] = ye(t, e / i);
		return o;
	}
	function o(e) {
		return e == null || isNaN(e = +e) ? i : n[s(r, e)];
	}
	return o.invertExtent = function(e) {
		var i = n.indexOf(e);
		return i < 0 ? [NaN, NaN] : [i > 0 ? r[i - 1] : t[0], i < r.length ? r[i] : t[t.length - 1]];
	}, o.domain = function(n) {
		if (!arguments.length) return t.slice();
		t = [];
		for (let e of n) e != null && !isNaN(e = +e) && t.push(e);
		return t.sort(e), a();
	}, o.range = function(e) {
		return arguments.length ? (n = Array.from(e), a()) : n.slice();
	}, o.unknown = function(e) {
		return arguments.length ? (i = e, o) : i;
	}, o.quantiles = function() {
		return r.slice();
	}, o.copy = function() {
		return wd().domain(t).range(n).unknown(i);
	}, Iu.apply(o, arguments);
}
//#endregion
//#region node_modules/d3-scale/src/threshold.js
function Td() {
	var e = [.5], t = [0, 1], n, r = 1;
	function i(i) {
		return i != null && i <= i ? t[s(e, i, 0, r)] : n;
	}
	return i.domain = function(n) {
		return arguments.length ? (e = Array.from(n), r = Math.min(e.length, t.length - 1), i) : e.slice();
	}, i.range = function(n) {
		return arguments.length ? (t = Array.from(n), r = Math.min(e.length, t.length - 1), i) : t.slice();
	}, i.invertExtent = function(n) {
		var r = t.indexOf(n);
		return [e[r - 1], e[r]];
	}, i.unknown = function(e) {
		return arguments.length ? (n = e, i) : n;
	}, i.copy = function() {
		return Td().domain(e).range(t).unknown(n);
	}, Iu.apply(i, arguments);
}
//#endregion
//#region node_modules/d3-time/src/interval.js
var Ed = /* @__PURE__ */ new Date(), Dd = /* @__PURE__ */ new Date();
function B(e, t, n, r) {
	function i(t) {
		return e(t = arguments.length === 0 ? /* @__PURE__ */ new Date() : /* @__PURE__ */ new Date(+t)), t;
	}
	return i.floor = (t) => (e(t = /* @__PURE__ */ new Date(+t)), t), i.ceil = (n) => (e(n = /* @__PURE__ */ new Date(n - 1)), t(n, 1), e(n), n), i.round = (e) => {
		let t = i(e), n = i.ceil(e);
		return e - t < n - e ? t : n;
	}, i.offset = (e, n) => (t(e = /* @__PURE__ */ new Date(+e), n == null ? 1 : Math.floor(n)), e), i.range = (n, r, a) => {
		let o = [];
		if (n = i.ceil(n), a = a == null ? 1 : Math.floor(a), !(n < r) || !(a > 0)) return o;
		let s;
		do
			o.push(s = /* @__PURE__ */ new Date(+n)), t(n, a), e(n);
		while (s < n && n < r);
		return o;
	}, i.filter = (n) => B((t) => {
		if (t >= t) for (; e(t), !n(t);) t.setTime(t - 1);
	}, (e, r) => {
		if (e >= e) {
			if (r < 0) for (; ++r <= 0;) for (; t(e, -1), !n(e););
			else for (; --r >= 0;) for (; t(e, 1), !n(e););
		}
	}), n && (i.count = (t, r) => (Ed.setTime(+t), Dd.setTime(+r), e(Ed), e(Dd), Math.floor(n(Ed, Dd))), i.every = (e) => (e = Math.floor(e), !isFinite(e) || !(e > 0) ? null : e > 1 ? i.filter(r ? (t) => r(t) % e === 0 : (t) => i.count(0, t) % e === 0) : i)), i;
}
//#endregion
//#region node_modules/d3-time/src/millisecond.js
var Od = B(() => {}, (e, t) => {
	e.setTime(+e + t);
}, (e, t) => t - e);
Od.every = (e) => (e = Math.floor(e), !isFinite(e) || !(e > 0) ? null : e > 1 ? B((t) => {
	t.setTime(Math.floor(t / e) * e);
}, (t, n) => {
	t.setTime(+t + n * e);
}, (t, n) => (n - t) / e) : Od), Od.range;
//#endregion
//#region node_modules/d3-time/src/duration.js
var kd = 1e3, Ad = kd * 60, jd = Ad * 60, Md = jd * 24, Nd = Md * 7, Pd = Md * 30, Fd = Md * 365, Id = B((e) => {
	e.setTime(e - e.getMilliseconds());
}, (e, t) => {
	e.setTime(+e + t * kd);
}, (e, t) => (t - e) / kd, (e) => e.getUTCSeconds());
Id.range;
//#endregion
//#region node_modules/d3-time/src/minute.js
var Ld = B((e) => {
	e.setTime(e - e.getMilliseconds() - e.getSeconds() * kd);
}, (e, t) => {
	e.setTime(+e + t * Ad);
}, (e, t) => (t - e) / Ad, (e) => e.getMinutes());
Ld.range;
var Rd = B((e) => {
	e.setUTCSeconds(0, 0);
}, (e, t) => {
	e.setTime(+e + t * Ad);
}, (e, t) => (t - e) / Ad, (e) => e.getUTCMinutes());
Rd.range;
//#endregion
//#region node_modules/d3-time/src/hour.js
var zd = B((e) => {
	e.setTime(e - e.getMilliseconds() - e.getSeconds() * kd - e.getMinutes() * Ad);
}, (e, t) => {
	e.setTime(+e + t * jd);
}, (e, t) => (t - e) / jd, (e) => e.getHours());
zd.range;
var Bd = B((e) => {
	e.setUTCMinutes(0, 0, 0);
}, (e, t) => {
	e.setTime(+e + t * jd);
}, (e, t) => (t - e) / jd, (e) => e.getUTCHours());
Bd.range;
//#endregion
//#region node_modules/d3-time/src/day.js
var Vd = B((e) => e.setHours(0, 0, 0, 0), (e, t) => e.setDate(e.getDate() + t), (e, t) => (t - e - (t.getTimezoneOffset() - e.getTimezoneOffset()) * Ad) / Md, (e) => e.getDate() - 1);
Vd.range;
var Hd = B((e) => {
	e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
	e.setUTCDate(e.getUTCDate() + t);
}, (e, t) => (t - e) / Md, (e) => e.getUTCDate() - 1);
Hd.range;
var Ud = B((e) => {
	e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
	e.setUTCDate(e.getUTCDate() + t);
}, (e, t) => (t - e) / Md, (e) => Math.floor(e / Md));
Ud.range;
//#endregion
//#region node_modules/d3-time/src/week.js
function Wd(e) {
	return B((t) => {
		t.setDate(t.getDate() - (t.getDay() + 7 - e) % 7), t.setHours(0, 0, 0, 0);
	}, (e, t) => {
		e.setDate(e.getDate() + t * 7);
	}, (e, t) => (t - e - (t.getTimezoneOffset() - e.getTimezoneOffset()) * Ad) / Nd);
}
var Gd = Wd(0), Kd = Wd(1), qd = Wd(2), Jd = Wd(3), Yd = Wd(4), Xd = Wd(5), Zd = Wd(6);
Gd.range, Kd.range, qd.range, Jd.range, Yd.range, Xd.range, Zd.range;
function Qd(e) {
	return B((t) => {
		t.setUTCDate(t.getUTCDate() - (t.getUTCDay() + 7 - e) % 7), t.setUTCHours(0, 0, 0, 0);
	}, (e, t) => {
		e.setUTCDate(e.getUTCDate() + t * 7);
	}, (e, t) => (t - e) / Nd);
}
var $d = Qd(0), ef = Qd(1), tf = Qd(2), nf = Qd(3), rf = Qd(4), af = Qd(5), of = Qd(6);
$d.range, ef.range, tf.range, nf.range, rf.range, af.range, of.range;
//#endregion
//#region node_modules/d3-time/src/month.js
var sf = B((e) => {
	e.setDate(1), e.setHours(0, 0, 0, 0);
}, (e, t) => {
	e.setMonth(e.getMonth() + t);
}, (e, t) => t.getMonth() - e.getMonth() + (t.getFullYear() - e.getFullYear()) * 12, (e) => e.getMonth());
sf.range;
var cf = B((e) => {
	e.setUTCDate(1), e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
	e.setUTCMonth(e.getUTCMonth() + t);
}, (e, t) => t.getUTCMonth() - e.getUTCMonth() + (t.getUTCFullYear() - e.getUTCFullYear()) * 12, (e) => e.getUTCMonth());
cf.range;
//#endregion
//#region node_modules/d3-time/src/year.js
var lf = B((e) => {
	e.setMonth(0, 1), e.setHours(0, 0, 0, 0);
}, (e, t) => {
	e.setFullYear(e.getFullYear() + t);
}, (e, t) => t.getFullYear() - e.getFullYear(), (e) => e.getFullYear());
lf.every = (e) => !isFinite(e = Math.floor(e)) || !(e > 0) ? null : B((t) => {
	t.setFullYear(Math.floor(t.getFullYear() / e) * e), t.setMonth(0, 1), t.setHours(0, 0, 0, 0);
}, (t, n) => {
	t.setFullYear(t.getFullYear() + n * e);
}), lf.range;
var uf = B((e) => {
	e.setUTCMonth(0, 1), e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
	e.setUTCFullYear(e.getUTCFullYear() + t);
}, (e, t) => t.getUTCFullYear() - e.getUTCFullYear(), (e) => e.getUTCFullYear());
uf.every = (e) => !isFinite(e = Math.floor(e)) || !(e > 0) ? null : B((t) => {
	t.setUTCFullYear(Math.floor(t.getUTCFullYear() / e) * e), t.setUTCMonth(0, 1), t.setUTCHours(0, 0, 0, 0);
}, (t, n) => {
	t.setUTCFullYear(t.getUTCFullYear() + n * e);
}), uf.range;
//#endregion
//#region node_modules/d3-time/src/ticks.js
function df(e, t, r, i, a, o) {
	let s = [
		[
			Id,
			1,
			kd
		],
		[
			Id,
			5,
			5 * kd
		],
		[
			Id,
			15,
			15 * kd
		],
		[
			Id,
			30,
			30 * kd
		],
		[
			o,
			1,
			Ad
		],
		[
			o,
			5,
			5 * Ad
		],
		[
			o,
			15,
			15 * Ad
		],
		[
			o,
			30,
			30 * Ad
		],
		[
			a,
			1,
			jd
		],
		[
			a,
			3,
			3 * jd
		],
		[
			a,
			6,
			6 * jd
		],
		[
			a,
			12,
			12 * jd
		],
		[
			i,
			1,
			Md
		],
		[
			i,
			2,
			2 * Md
		],
		[
			r,
			1,
			Nd
		],
		[
			t,
			1,
			Pd
		],
		[
			t,
			3,
			3 * Pd
		],
		[
			e,
			1,
			Fd
		]
	];
	function c(e, t, n) {
		let r = t < e;
		r && ([e, t] = [t, e]);
		let i = n && typeof n.range == "function" ? n : l(e, t, n), a = i ? i.range(e, +t + 1) : [];
		return r ? a.reverse() : a;
	}
	function l(t, r, i) {
		let a = Math.abs(r - t) / i, o = n(([, , e]) => e).right(s, a);
		if (o === s.length) return e.every(le(t / Fd, r / Fd, i));
		if (o === 0) return Od.every(Math.max(le(t, r, i), 1));
		let [c, l] = s[a / s[o - 1][2] < s[o][2] / a ? o - 1 : o];
		return c.every(l);
	}
	return [c, l];
}
var [ff, pf] = df(uf, cf, $d, Ud, Bd, Rd), [mf, hf] = df(lf, sf, Gd, Vd, zd, Ld);
//#endregion
//#region node_modules/d3-time-format/src/locale.js
function gf(e) {
	if (0 <= e.y && e.y < 100) {
		var t = new Date(-1, e.m, e.d, e.H, e.M, e.S, e.L);
		return t.setFullYear(e.y), t;
	}
	return new Date(e.y, e.m, e.d, e.H, e.M, e.S, e.L);
}
function _f(e) {
	if (0 <= e.y && e.y < 100) {
		var t = new Date(Date.UTC(-1, e.m, e.d, e.H, e.M, e.S, e.L));
		return t.setUTCFullYear(e.y), t;
	}
	return new Date(Date.UTC(e.y, e.m, e.d, e.H, e.M, e.S, e.L));
}
function vf(e, t, n) {
	return {
		y: e,
		m: t,
		d: n,
		H: 0,
		M: 0,
		S: 0,
		L: 0
	};
}
function yf(e) {
	var t = e.dateTime, n = e.date, r = e.time, i = e.periods, a = e.days, o = e.shortDays, s = e.months, c = e.shortMonths, l = wf(i), u = Tf(i), d = wf(a), f = Tf(a), p = wf(o), m = Tf(o), h = wf(s), g = Tf(s), _ = wf(c), v = Tf(c), y = {
		a: te,
		A: ne,
		b: re,
		B: ie,
		c: null,
		d: Kf,
		e: Kf,
		f: Zf,
		g: cp,
		G: up,
		H: qf,
		I: Jf,
		j: Yf,
		L: Xf,
		m: Qf,
		M: $f,
		p: ae,
		q: oe,
		Q: Np,
		s: Pp,
		S: ep,
		u: tp,
		U: np,
		V: ip,
		w: ap,
		W: op,
		x: null,
		X: null,
		y: sp,
		Y: lp,
		Z: dp,
		"%": Mp
	}, b = {
		a: se,
		A: ce,
		b: le,
		B: ue,
		c: null,
		d: fp,
		e: fp,
		f: _p,
		g: Op,
		G: Ap,
		H: pp,
		I: mp,
		j: hp,
		L: gp,
		m: vp,
		M: yp,
		p: de,
		q: fe,
		Q: Np,
		s: Pp,
		S: bp,
		u: xp,
		U: Sp,
		V: wp,
		w: Tp,
		W: Ep,
		x: null,
		X: null,
		y: Dp,
		Y: kp,
		Z: jp,
		"%": Mp
	}, x = {
		a: E,
		A: D,
		b: O,
		B: k,
		c: A,
		d: If,
		e: If,
		f: Hf,
		g: Mf,
		G: jf,
		H: Rf,
		I: Rf,
		j: Lf,
		L: Vf,
		m: Ff,
		M: zf,
		p: T,
		q: Pf,
		Q: Wf,
		s: Gf,
		S: Bf,
		u: Df,
		U: Of,
		V: kf,
		w: Ef,
		W: Af,
		x: j,
		X: ee,
		y: Mf,
		Y: jf,
		Z: Nf,
		"%": Uf
	};
	y.x = S(n, y), y.X = S(r, y), y.c = S(t, y), b.x = S(n, b), b.X = S(r, b), b.c = S(t, b);
	function S(e, t) {
		return function(n) {
			var r = [], i = -1, a = 0, o = e.length, s, c, l;
			for (n instanceof Date || (n = /* @__PURE__ */ new Date(+n)); ++i < o;) e.charCodeAt(i) === 37 && (r.push(e.slice(a, i)), (c = bf[s = e.charAt(++i)]) == null ? c = s === "e" ? " " : "0" : s = e.charAt(++i), (l = t[s]) && (s = l(n, c)), r.push(s), a = i + 1);
			return r.push(e.slice(a, i)), r.join("");
		};
	}
	function C(e, t) {
		return function(n) {
			var r = vf(1900, void 0, 1), i = w(r, e, n += "", 0), a, o;
			if (i != n.length) return null;
			if ("Q" in r) return new Date(r.Q);
			if ("s" in r) return new Date(r.s * 1e3 + ("L" in r ? r.L : 0));
			if (t && !("Z" in r) && (r.Z = 0), "p" in r && (r.H = r.H % 12 + r.p * 12), r.m === void 0 && (r.m = "q" in r ? r.q : 0), "V" in r) {
				if (r.V < 1 || r.V > 53) return null;
				"w" in r || (r.w = 1), "Z" in r ? (a = _f(vf(r.y, 0, 1)), o = a.getUTCDay(), a = o > 4 || o === 0 ? ef.ceil(a) : ef(a), a = Hd.offset(a, (r.V - 1) * 7), r.y = a.getUTCFullYear(), r.m = a.getUTCMonth(), r.d = a.getUTCDate() + (r.w + 6) % 7) : (a = gf(vf(r.y, 0, 1)), o = a.getDay(), a = o > 4 || o === 0 ? Kd.ceil(a) : Kd(a), a = Vd.offset(a, (r.V - 1) * 7), r.y = a.getFullYear(), r.m = a.getMonth(), r.d = a.getDate() + (r.w + 6) % 7);
			} else ("W" in r || "U" in r) && ("w" in r || (r.w = "u" in r ? r.u % 7 : +("W" in r)), o = "Z" in r ? _f(vf(r.y, 0, 1)).getUTCDay() : gf(vf(r.y, 0, 1)).getDay(), r.m = 0, r.d = "W" in r ? (r.w + 6) % 7 + r.W * 7 - (o + 5) % 7 : r.w + r.U * 7 - (o + 6) % 7);
			return "Z" in r ? (r.H += r.Z / 100 | 0, r.M += r.Z % 100, _f(r)) : gf(r);
		};
	}
	function w(e, t, n, r) {
		for (var i = 0, a = t.length, o = n.length, s, c; i < a;) {
			if (r >= o) return -1;
			if (s = t.charCodeAt(i++), s === 37) {
				if (s = t.charAt(i++), c = x[s in bf ? t.charAt(i++) : s], !c || (r = c(e, n, r)) < 0) return -1;
			} else if (s != n.charCodeAt(r++)) return -1;
		}
		return r;
	}
	function T(e, t, n) {
		var r = l.exec(t.slice(n));
		return r ? (e.p = u.get(r[0].toLowerCase()), n + r[0].length) : -1;
	}
	function E(e, t, n) {
		var r = p.exec(t.slice(n));
		return r ? (e.w = m.get(r[0].toLowerCase()), n + r[0].length) : -1;
	}
	function D(e, t, n) {
		var r = d.exec(t.slice(n));
		return r ? (e.w = f.get(r[0].toLowerCase()), n + r[0].length) : -1;
	}
	function O(e, t, n) {
		var r = _.exec(t.slice(n));
		return r ? (e.m = v.get(r[0].toLowerCase()), n + r[0].length) : -1;
	}
	function k(e, t, n) {
		var r = h.exec(t.slice(n));
		return r ? (e.m = g.get(r[0].toLowerCase()), n + r[0].length) : -1;
	}
	function A(e, n, r) {
		return w(e, t, n, r);
	}
	function j(e, t, r) {
		return w(e, n, t, r);
	}
	function ee(e, t, n) {
		return w(e, r, t, n);
	}
	function te(e) {
		return o[e.getDay()];
	}
	function ne(e) {
		return a[e.getDay()];
	}
	function re(e) {
		return c[e.getMonth()];
	}
	function ie(e) {
		return s[e.getMonth()];
	}
	function ae(e) {
		return i[+(e.getHours() >= 12)];
	}
	function oe(e) {
		return 1 + ~~(e.getMonth() / 3);
	}
	function se(e) {
		return o[e.getUTCDay()];
	}
	function ce(e) {
		return a[e.getUTCDay()];
	}
	function le(e) {
		return c[e.getUTCMonth()];
	}
	function ue(e) {
		return s[e.getUTCMonth()];
	}
	function de(e) {
		return i[+(e.getUTCHours() >= 12)];
	}
	function fe(e) {
		return 1 + ~~(e.getUTCMonth() / 3);
	}
	return {
		format: function(e) {
			var t = S(e += "", y);
			return t.toString = function() {
				return e;
			}, t;
		},
		parse: function(e) {
			var t = C(e += "", !1);
			return t.toString = function() {
				return e;
			}, t;
		},
		utcFormat: function(e) {
			var t = S(e += "", b);
			return t.toString = function() {
				return e;
			}, t;
		},
		utcParse: function(e) {
			var t = C(e += "", !0);
			return t.toString = function() {
				return e;
			}, t;
		}
	};
}
var bf = {
	"-": "",
	_: " ",
	0: "0"
}, V = /^\s*\d+/, xf = /^%/, Sf = /[\\^$*+?|[\]().{}]/g;
function H(e, t, n) {
	var r = e < 0 ? "-" : "", i = (r ? -e : e) + "", a = i.length;
	return r + (a < n ? Array(n - a + 1).join(t) + i : i);
}
function Cf(e) {
	return e.replace(Sf, "\\$&");
}
function wf(e) {
	return RegExp("^(?:" + e.map(Cf).join("|") + ")", "i");
}
function Tf(e) {
	return new Map(e.map((e, t) => [e.toLowerCase(), t]));
}
function Ef(e, t, n) {
	var r = V.exec(t.slice(n, n + 1));
	return r ? (e.w = +r[0], n + r[0].length) : -1;
}
function Df(e, t, n) {
	var r = V.exec(t.slice(n, n + 1));
	return r ? (e.u = +r[0], n + r[0].length) : -1;
}
function Of(e, t, n) {
	var r = V.exec(t.slice(n, n + 2));
	return r ? (e.U = +r[0], n + r[0].length) : -1;
}
function kf(e, t, n) {
	var r = V.exec(t.slice(n, n + 2));
	return r ? (e.V = +r[0], n + r[0].length) : -1;
}
function Af(e, t, n) {
	var r = V.exec(t.slice(n, n + 2));
	return r ? (e.W = +r[0], n + r[0].length) : -1;
}
function jf(e, t, n) {
	var r = V.exec(t.slice(n, n + 4));
	return r ? (e.y = +r[0], n + r[0].length) : -1;
}
function Mf(e, t, n) {
	var r = V.exec(t.slice(n, n + 2));
	return r ? (e.y = +r[0] + (+r[0] > 68 ? 1900 : 2e3), n + r[0].length) : -1;
}
function Nf(e, t, n) {
	var r = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(t.slice(n, n + 6));
	return r ? (e.Z = r[1] ? 0 : -(r[2] + (r[3] || "00")), n + r[0].length) : -1;
}
function Pf(e, t, n) {
	var r = V.exec(t.slice(n, n + 1));
	return r ? (e.q = r[0] * 3 - 3, n + r[0].length) : -1;
}
function Ff(e, t, n) {
	var r = V.exec(t.slice(n, n + 2));
	return r ? (e.m = r[0] - 1, n + r[0].length) : -1;
}
function If(e, t, n) {
	var r = V.exec(t.slice(n, n + 2));
	return r ? (e.d = +r[0], n + r[0].length) : -1;
}
function Lf(e, t, n) {
	var r = V.exec(t.slice(n, n + 3));
	return r ? (e.m = 0, e.d = +r[0], n + r[0].length) : -1;
}
function Rf(e, t, n) {
	var r = V.exec(t.slice(n, n + 2));
	return r ? (e.H = +r[0], n + r[0].length) : -1;
}
function zf(e, t, n) {
	var r = V.exec(t.slice(n, n + 2));
	return r ? (e.M = +r[0], n + r[0].length) : -1;
}
function Bf(e, t, n) {
	var r = V.exec(t.slice(n, n + 2));
	return r ? (e.S = +r[0], n + r[0].length) : -1;
}
function Vf(e, t, n) {
	var r = V.exec(t.slice(n, n + 3));
	return r ? (e.L = +r[0], n + r[0].length) : -1;
}
function Hf(e, t, n) {
	var r = V.exec(t.slice(n, n + 6));
	return r ? (e.L = Math.floor(r[0] / 1e3), n + r[0].length) : -1;
}
function Uf(e, t, n) {
	var r = xf.exec(t.slice(n, n + 1));
	return r ? n + r[0].length : -1;
}
function Wf(e, t, n) {
	var r = V.exec(t.slice(n));
	return r ? (e.Q = +r[0], n + r[0].length) : -1;
}
function Gf(e, t, n) {
	var r = V.exec(t.slice(n));
	return r ? (e.s = +r[0], n + r[0].length) : -1;
}
function Kf(e, t) {
	return H(e.getDate(), t, 2);
}
function qf(e, t) {
	return H(e.getHours(), t, 2);
}
function Jf(e, t) {
	return H(e.getHours() % 12 || 12, t, 2);
}
function Yf(e, t) {
	return H(1 + Vd.count(lf(e), e), t, 3);
}
function Xf(e, t) {
	return H(e.getMilliseconds(), t, 3);
}
function Zf(e, t) {
	return Xf(e, t) + "000";
}
function Qf(e, t) {
	return H(e.getMonth() + 1, t, 2);
}
function $f(e, t) {
	return H(e.getMinutes(), t, 2);
}
function ep(e, t) {
	return H(e.getSeconds(), t, 2);
}
function tp(e) {
	var t = e.getDay();
	return t === 0 ? 7 : t;
}
function np(e, t) {
	return H(Gd.count(lf(e) - 1, e), t, 2);
}
function rp(e) {
	var t = e.getDay();
	return t >= 4 || t === 0 ? Yd(e) : Yd.ceil(e);
}
function ip(e, t) {
	return e = rp(e), H(Yd.count(lf(e), e) + (lf(e).getDay() === 4), t, 2);
}
function ap(e) {
	return e.getDay();
}
function op(e, t) {
	return H(Kd.count(lf(e) - 1, e), t, 2);
}
function sp(e, t) {
	return H(e.getFullYear() % 100, t, 2);
}
function cp(e, t) {
	return e = rp(e), H(e.getFullYear() % 100, t, 2);
}
function lp(e, t) {
	return H(e.getFullYear() % 1e4, t, 4);
}
function up(e, t) {
	var n = e.getDay();
	return e = n >= 4 || n === 0 ? Yd(e) : Yd.ceil(e), H(e.getFullYear() % 1e4, t, 4);
}
function dp(e) {
	var t = e.getTimezoneOffset();
	return (t > 0 ? "-" : (t *= -1, "+")) + H(t / 60 | 0, "0", 2) + H(t % 60, "0", 2);
}
function fp(e, t) {
	return H(e.getUTCDate(), t, 2);
}
function pp(e, t) {
	return H(e.getUTCHours(), t, 2);
}
function mp(e, t) {
	return H(e.getUTCHours() % 12 || 12, t, 2);
}
function hp(e, t) {
	return H(1 + Hd.count(uf(e), e), t, 3);
}
function gp(e, t) {
	return H(e.getUTCMilliseconds(), t, 3);
}
function _p(e, t) {
	return gp(e, t) + "000";
}
function vp(e, t) {
	return H(e.getUTCMonth() + 1, t, 2);
}
function yp(e, t) {
	return H(e.getUTCMinutes(), t, 2);
}
function bp(e, t) {
	return H(e.getUTCSeconds(), t, 2);
}
function xp(e) {
	var t = e.getUTCDay();
	return t === 0 ? 7 : t;
}
function Sp(e, t) {
	return H($d.count(uf(e) - 1, e), t, 2);
}
function Cp(e) {
	var t = e.getUTCDay();
	return t >= 4 || t === 0 ? rf(e) : rf.ceil(e);
}
function wp(e, t) {
	return e = Cp(e), H(rf.count(uf(e), e) + (uf(e).getUTCDay() === 4), t, 2);
}
function Tp(e) {
	return e.getUTCDay();
}
function Ep(e, t) {
	return H(ef.count(uf(e) - 1, e), t, 2);
}
function Dp(e, t) {
	return H(e.getUTCFullYear() % 100, t, 2);
}
function Op(e, t) {
	return e = Cp(e), H(e.getUTCFullYear() % 100, t, 2);
}
function kp(e, t) {
	return H(e.getUTCFullYear() % 1e4, t, 4);
}
function Ap(e, t) {
	var n = e.getUTCDay();
	return e = n >= 4 || n === 0 ? rf(e) : rf.ceil(e), H(e.getUTCFullYear() % 1e4, t, 4);
}
function jp() {
	return "+0000";
}
function Mp() {
	return "%";
}
function Np(e) {
	return +e;
}
function Pp(e) {
	return Math.floor(e / 1e3);
}
//#endregion
//#region node_modules/d3-time-format/src/defaultLocale.js
var Fp, Ip, Lp;
Rp({
	dateTime: "%x, %X",
	date: "%-m/%-d/%Y",
	time: "%-I:%M:%S %p",
	periods: ["AM", "PM"],
	days: [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday"
	],
	shortDays: [
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat"
	],
	months: [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	],
	shortMonths: [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	]
});
function Rp(e) {
	return Fp = yf(e), Ip = Fp.format, Fp.parse, Lp = Fp.utcFormat, Fp.utcParse, Fp;
}
//#endregion
//#region node_modules/d3-scale/src/time.js
function zp(e) {
	return new Date(e);
}
function Bp(e) {
	return e instanceof Date ? +e : +/* @__PURE__ */ new Date(+e);
}
function Vp(e, t, n, r, i, a, o, s, c, l) {
	var u = $u(), d = u.invert, f = u.domain, p = l(".%L"), m = l(":%S"), h = l("%I:%M"), g = l("%I %p"), _ = l("%a %d"), v = l("%b %d"), y = l("%B"), b = l("%Y");
	function x(e) {
		return (c(e) < e ? p : s(e) < e ? m : o(e) < e ? h : a(e) < e ? g : r(e) < e ? i(e) < e ? _ : v : n(e) < e ? y : b)(e);
	}
	return u.invert = function(e) {
		return new Date(d(e));
	}, u.domain = function(e) {
		return arguments.length ? f(Array.from(e, Bp)) : f().map(zp);
	}, u.ticks = function(t) {
		var n = f();
		return e(n[0], n[n.length - 1], t ?? 10);
	}, u.tickFormat = function(e, t) {
		return t == null ? x : l(t);
	}, u.nice = function(e) {
		var n = f();
		return (!e || typeof e.range != "function") && (e = t(n[0], n[n.length - 1], e ?? 10)), e ? f(id(n, e)) : u;
	}, u.copy = function() {
		return Zu(u, Vp(e, t, n, r, i, a, o, s, c, l));
	}, u;
}
function Hp() {
	return Iu.apply(Vp(mf, hf, lf, sf, Gd, Vd, zd, Ld, Id, Ip).domain([new Date(2e3, 0, 1), new Date(2e3, 0, 2)]), arguments);
}
//#endregion
//#region node_modules/d3-scale/src/utcTime.js
function Up() {
	return Iu.apply(Vp(ff, pf, uf, cf, $d, Hd, Bd, Rd, Id, Lp).domain([Date.UTC(2e3, 0, 1), Date.UTC(2e3, 0, 2)]), arguments);
}
//#endregion
//#region node_modules/d3-scale/src/sequential.js
function Wp(e, t) {
	return t.domain(e.domain()).interpolator(e.interpolator()).clamp(e.clamp()).unknown(e.unknown());
}
//#endregion
//#region node_modules/d3-scale/src/diverging.js
function Gp() {
	var e = 0, t = .5, n = 1, r = 1, i, a, o, s, c, l = Ku, u, d = !1, f;
	function p(e) {
		return isNaN(e = +e) ? f : (e = .5 + ((e = +u(e)) - a) * (r * e < r * a ? s : c), l(d ? Math.max(0, Math.min(1, e)) : e));
	}
	p.domain = function(l) {
		return arguments.length ? ([e, t, n] = l, i = u(e = +e), a = u(t = +t), o = u(n = +n), s = i === a ? 0 : .5 / (a - i), c = a === o ? 0 : .5 / (o - a), r = a < i ? -1 : 1, p) : [
			e,
			t,
			n
		];
	}, p.clamp = function(e) {
		return arguments.length ? (d = !!e, p) : d;
	}, p.interpolator = function(e) {
		return arguments.length ? (l = e, p) : l;
	};
	function m(e) {
		return function(t) {
			var n, r, i;
			return arguments.length ? ([n, r, i] = t, l = na(e, [
				n,
				r,
				i
			]), p) : [
				l(0),
				l(.5),
				l(1)
			];
		};
	}
	return p.range = m(Ri), p.rangeRound = m(zi), p.unknown = function(e) {
		return arguments.length ? (f = e, p) : f;
	}, function(l) {
		return u = l, i = l(e), a = l(t), o = l(n), s = i === a ? 0 : .5 / (a - i), c = a === o ? 0 : .5 / (o - a), r = a < i ? -1 : 1, p;
	};
}
function Kp() {
	var e = td(Gp()(Ku));
	return e.copy = function() {
		return Wp(e, Kp());
	}, Lu.apply(e, arguments);
}
function qp() {
	var e = pd(Gp()).domain([
		.1,
		1,
		10
	]);
	return e.copy = function() {
		return Wp(e, qp()).base(e.base());
	}, Lu.apply(e, arguments);
}
function Jp() {
	var e = _d(Gp());
	return e.copy = function() {
		return Wp(e, Jp()).constant(e.constant());
	}, Lu.apply(e, arguments);
}
function Yp() {
	var e = Sd(Gp());
	return e.copy = function() {
		return Wp(e, Yp()).exponent(e.exponent());
	}, Lu.apply(e, arguments);
}
//#endregion
//#region node_modules/d3-scale-chromatic/src/colors.js
function U(e) {
	for (var t = e.length / 6 | 0, n = Array(t), r = 0; r < t;) n[r] = "#" + e.slice(r * 6, ++r * 6);
	return n;
}
//#endregion
//#region node_modules/d3-scale-chromatic/src/categorical/category10.js
var Xp = U("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf"), Zp = U("7fc97fbeaed4fdc086ffff99386cb0f0027fbf5b17666666"), Qp = U("1b9e77d95f027570b3e7298a66a61ee6ab02a6761d666666"), $p = U("4269d0efb118ff725c6cc5b03ca951ff8ab7a463f297bbf59c6b4e9498a0"), em = U("a6cee31f78b4b2df8a33a02cfb9a99e31a1cfdbf6fff7f00cab2d66a3d9affff99b15928"), tm = U("fbb4aeb3cde3ccebc5decbe4fed9a6ffffcce5d8bdfddaecf2f2f2"), nm = U("b3e2cdfdcdaccbd5e8f4cae4e6f5c9fff2aef1e2cccccccc"), rm = U("e41a1c377eb84daf4a984ea3ff7f00ffff33a65628f781bf999999"), im = U("66c2a5fc8d628da0cbe78ac3a6d854ffd92fe5c494b3b3b3"), am = U("8dd3c7ffffb3bebadafb807280b1d3fdb462b3de69fccde5d9d9d9bc80bdccebc5ffed6f"), om = U("4e79a7f28e2ce1575976b7b259a14fedc949af7aa1ff9da79c755fbab0ab"), W = (e) => Ei(e[e.length - 1]), sm = [
	,
	,
	,
	"d8b365f5f5f55ab4ac",
	"a6611adfc27d80cdc1018571",
	"a6611adfc27df5f5f580cdc1018571",
	"8c510ad8b365f6e8c3c7eae55ab4ac01665e",
	"8c510ad8b365f6e8c3f5f5f5c7eae55ab4ac01665e",
	"8c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e",
	"8c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e",
	"5430058c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e003c30",
	"5430058c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e003c30"
].map(U), cm = W(sm), lm = [
	,
	,
	,
	"af8dc3f7f7f77fbf7b",
	"7b3294c2a5cfa6dba0008837",
	"7b3294c2a5cff7f7f7a6dba0008837",
	"762a83af8dc3e7d4e8d9f0d37fbf7b1b7837",
	"762a83af8dc3e7d4e8f7f7f7d9f0d37fbf7b1b7837",
	"762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b7837",
	"762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b7837",
	"40004b762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b783700441b",
	"40004b762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b783700441b"
].map(U), um = W(lm), dm = [
	,
	,
	,
	"e9a3c9f7f7f7a1d76a",
	"d01c8bf1b6dab8e1864dac26",
	"d01c8bf1b6daf7f7f7b8e1864dac26",
	"c51b7de9a3c9fde0efe6f5d0a1d76a4d9221",
	"c51b7de9a3c9fde0eff7f7f7e6f5d0a1d76a4d9221",
	"c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221",
	"c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221",
	"8e0152c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221276419",
	"8e0152c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221276419"
].map(U), fm = W(dm), pm = [
	,
	,
	,
	"998ec3f7f7f7f1a340",
	"5e3c99b2abd2fdb863e66101",
	"5e3c99b2abd2f7f7f7fdb863e66101",
	"542788998ec3d8daebfee0b6f1a340b35806",
	"542788998ec3d8daebf7f7f7fee0b6f1a340b35806",
	"5427888073acb2abd2d8daebfee0b6fdb863e08214b35806",
	"5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b35806",
	"2d004b5427888073acb2abd2d8daebfee0b6fdb863e08214b358067f3b08",
	"2d004b5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b358067f3b08"
].map(U), mm = W(pm), hm = [
	,
	,
	,
	"ef8a62f7f7f767a9cf",
	"ca0020f4a58292c5de0571b0",
	"ca0020f4a582f7f7f792c5de0571b0",
	"b2182bef8a62fddbc7d1e5f067a9cf2166ac",
	"b2182bef8a62fddbc7f7f7f7d1e5f067a9cf2166ac",
	"b2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac",
	"b2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac",
	"67001fb2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac053061",
	"67001fb2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac053061"
].map(U), gm = W(hm), _m = [
	,
	,
	,
	"ef8a62ffffff999999",
	"ca0020f4a582bababa404040",
	"ca0020f4a582ffffffbababa404040",
	"b2182bef8a62fddbc7e0e0e09999994d4d4d",
	"b2182bef8a62fddbc7ffffffe0e0e09999994d4d4d",
	"b2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d",
	"b2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d",
	"67001fb2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d1a1a1a",
	"67001fb2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d1a1a1a"
].map(U), vm = W(_m), ym = [
	,
	,
	,
	"fc8d59ffffbf91bfdb",
	"d7191cfdae61abd9e92c7bb6",
	"d7191cfdae61ffffbfabd9e92c7bb6",
	"d73027fc8d59fee090e0f3f891bfdb4575b4",
	"d73027fc8d59fee090ffffbfe0f3f891bfdb4575b4",
	"d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4",
	"d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4",
	"a50026d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4313695",
	"a50026d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4313695"
].map(U), bm = W(ym), xm = [
	,
	,
	,
	"fc8d59ffffbf91cf60",
	"d7191cfdae61a6d96a1a9641",
	"d7191cfdae61ffffbfa6d96a1a9641",
	"d73027fc8d59fee08bd9ef8b91cf601a9850",
	"d73027fc8d59fee08bffffbfd9ef8b91cf601a9850",
	"d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850",
	"d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850",
	"a50026d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850006837",
	"a50026d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850006837"
].map(U), Sm = W(xm), Cm = [
	,
	,
	,
	"fc8d59ffffbf99d594",
	"d7191cfdae61abdda42b83ba",
	"d7191cfdae61ffffbfabdda42b83ba",
	"d53e4ffc8d59fee08be6f59899d5943288bd",
	"d53e4ffc8d59fee08bffffbfe6f59899d5943288bd",
	"d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd",
	"d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd",
	"9e0142d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd5e4fa2",
	"9e0142d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd5e4fa2"
].map(U), wm = W(Cm), Tm = [
	,
	,
	,
	"e5f5f999d8c92ca25f",
	"edf8fbb2e2e266c2a4238b45",
	"edf8fbb2e2e266c2a42ca25f006d2c",
	"edf8fbccece699d8c966c2a42ca25f006d2c",
	"edf8fbccece699d8c966c2a441ae76238b45005824",
	"f7fcfde5f5f9ccece699d8c966c2a441ae76238b45005824",
	"f7fcfde5f5f9ccece699d8c966c2a441ae76238b45006d2c00441b"
].map(U), Em = W(Tm), Dm = [
	,
	,
	,
	"e0ecf49ebcda8856a7",
	"edf8fbb3cde38c96c688419d",
	"edf8fbb3cde38c96c68856a7810f7c",
	"edf8fbbfd3e69ebcda8c96c68856a7810f7c",
	"edf8fbbfd3e69ebcda8c96c68c6bb188419d6e016b",
	"f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d6e016b",
	"f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d810f7c4d004b"
].map(U), Om = W(Dm), km = [
	,
	,
	,
	"e0f3dba8ddb543a2ca",
	"f0f9e8bae4bc7bccc42b8cbe",
	"f0f9e8bae4bc7bccc443a2ca0868ac",
	"f0f9e8ccebc5a8ddb57bccc443a2ca0868ac",
	"f0f9e8ccebc5a8ddb57bccc44eb3d32b8cbe08589e",
	"f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe08589e",
	"f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe0868ac084081"
].map(U), Am = W(km), jm = [
	,
	,
	,
	"fee8c8fdbb84e34a33",
	"fef0d9fdcc8afc8d59d7301f",
	"fef0d9fdcc8afc8d59e34a33b30000",
	"fef0d9fdd49efdbb84fc8d59e34a33b30000",
	"fef0d9fdd49efdbb84fc8d59ef6548d7301f990000",
	"fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301f990000",
	"fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301fb300007f0000"
].map(U), Mm = W(jm), Nm = [
	,
	,
	,
	"ece2f0a6bddb1c9099",
	"f6eff7bdc9e167a9cf02818a",
	"f6eff7bdc9e167a9cf1c9099016c59",
	"f6eff7d0d1e6a6bddb67a9cf1c9099016c59",
	"f6eff7d0d1e6a6bddb67a9cf3690c002818a016450",
	"fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016450",
	"fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016c59014636"
].map(U), Pm = W(Nm), Fm = [
	,
	,
	,
	"ece7f2a6bddb2b8cbe",
	"f1eef6bdc9e174a9cf0570b0",
	"f1eef6bdc9e174a9cf2b8cbe045a8d",
	"f1eef6d0d1e6a6bddb74a9cf2b8cbe045a8d",
	"f1eef6d0d1e6a6bddb74a9cf3690c00570b0034e7b",
	"fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0034e7b",
	"fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0045a8d023858"
].map(U), Im = W(Fm), Lm = [
	,
	,
	,
	"e7e1efc994c7dd1c77",
	"f1eef6d7b5d8df65b0ce1256",
	"f1eef6d7b5d8df65b0dd1c77980043",
	"f1eef6d4b9dac994c7df65b0dd1c77980043",
	"f1eef6d4b9dac994c7df65b0e7298ace125691003f",
	"f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125691003f",
	"f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125698004367001f"
].map(U), Rm = W(Lm), zm = [
	,
	,
	,
	"fde0ddfa9fb5c51b8a",
	"feebe2fbb4b9f768a1ae017e",
	"feebe2fbb4b9f768a1c51b8a7a0177",
	"feebe2fcc5c0fa9fb5f768a1c51b8a7a0177",
	"feebe2fcc5c0fa9fb5f768a1dd3497ae017e7a0177",
	"fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a0177",
	"fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a017749006a"
].map(U), Bm = W(zm), Vm = [
	,
	,
	,
	"edf8b17fcdbb2c7fb8",
	"ffffcca1dab441b6c4225ea8",
	"ffffcca1dab441b6c42c7fb8253494",
	"ffffccc7e9b47fcdbb41b6c42c7fb8253494",
	"ffffccc7e9b47fcdbb41b6c41d91c0225ea80c2c84",
	"ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea80c2c84",
	"ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea8253494081d58"
].map(U), Hm = W(Vm), Um = [
	,
	,
	,
	"f7fcb9addd8e31a354",
	"ffffccc2e69978c679238443",
	"ffffccc2e69978c67931a354006837",
	"ffffccd9f0a3addd8e78c67931a354006837",
	"ffffccd9f0a3addd8e78c67941ab5d238443005a32",
	"ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443005a32",
	"ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443006837004529"
].map(U), Wm = W(Um), Gm = [
	,
	,
	,
	"fff7bcfec44fd95f0e",
	"ffffd4fed98efe9929cc4c02",
	"ffffd4fed98efe9929d95f0e993404",
	"ffffd4fee391fec44ffe9929d95f0e993404",
	"ffffd4fee391fec44ffe9929ec7014cc4c028c2d04",
	"ffffe5fff7bcfee391fec44ffe9929ec7014cc4c028c2d04",
	"ffffe5fff7bcfee391fec44ffe9929ec7014cc4c02993404662506"
].map(U), Km = W(Gm), qm = [
	,
	,
	,
	"ffeda0feb24cf03b20",
	"ffffb2fecc5cfd8d3ce31a1c",
	"ffffb2fecc5cfd8d3cf03b20bd0026",
	"ffffb2fed976feb24cfd8d3cf03b20bd0026",
	"ffffb2fed976feb24cfd8d3cfc4e2ae31a1cb10026",
	"ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cb10026",
	"ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cbd0026800026"
].map(U), Jm = W(qm), Ym = [
	,
	,
	,
	"deebf79ecae13182bd",
	"eff3ffbdd7e76baed62171b5",
	"eff3ffbdd7e76baed63182bd08519c",
	"eff3ffc6dbef9ecae16baed63182bd08519c",
	"eff3ffc6dbef9ecae16baed64292c62171b5084594",
	"f7fbffdeebf7c6dbef9ecae16baed64292c62171b5084594",
	"f7fbffdeebf7c6dbef9ecae16baed64292c62171b508519c08306b"
].map(U), Xm = W(Ym), Zm = [
	,
	,
	,
	"e5f5e0a1d99b31a354",
	"edf8e9bae4b374c476238b45",
	"edf8e9bae4b374c47631a354006d2c",
	"edf8e9c7e9c0a1d99b74c47631a354006d2c",
	"edf8e9c7e9c0a1d99b74c47641ab5d238b45005a32",
	"f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45005a32",
	"f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45006d2c00441b"
].map(U), Qm = W(Zm), $m = [
	,
	,
	,
	"f0f0f0bdbdbd636363",
	"f7f7f7cccccc969696525252",
	"f7f7f7cccccc969696636363252525",
	"f7f7f7d9d9d9bdbdbd969696636363252525",
	"f7f7f7d9d9d9bdbdbd969696737373525252252525",
	"fffffff0f0f0d9d9d9bdbdbd969696737373525252252525",
	"fffffff0f0f0d9d9d9bdbdbd969696737373525252252525000000"
].map(U), eh = W($m), th = [
	,
	,
	,
	"efedf5bcbddc756bb1",
	"f2f0f7cbc9e29e9ac86a51a3",
	"f2f0f7cbc9e29e9ac8756bb154278f",
	"f2f0f7dadaebbcbddc9e9ac8756bb154278f",
	"f2f0f7dadaebbcbddc9e9ac8807dba6a51a34a1486",
	"fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a34a1486",
	"fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a354278f3f007d"
].map(U), nh = W(th), rh = [
	,
	,
	,
	"fee0d2fc9272de2d26",
	"fee5d9fcae91fb6a4acb181d",
	"fee5d9fcae91fb6a4ade2d26a50f15",
	"fee5d9fcbba1fc9272fb6a4ade2d26a50f15",
	"fee5d9fcbba1fc9272fb6a4aef3b2ccb181d99000d",
	"fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181d99000d",
	"fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181da50f1567000d"
].map(U), ih = W(rh), ah = [
	,
	,
	,
	"fee6cefdae6be6550d",
	"feeddefdbe85fd8d3cd94701",
	"feeddefdbe85fd8d3ce6550da63603",
	"feeddefdd0a2fdae6bfd8d3ce6550da63603",
	"feeddefdd0a2fdae6bfd8d3cf16913d948018c2d04",
	"fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d948018c2d04",
	"fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d94801a636037f2704"
].map(U), oh = W(ah);
//#endregion
//#region node_modules/d3-scale-chromatic/src/sequential-multi/cividis.js
function sh(e) {
	return e = Math.max(0, Math.min(1, e)), "rgb(" + Math.max(0, Math.min(255, Math.round(-4.54 - e * (35.34 - e * (2381.73 - e * (6402.7 - e * (7024.72 - e * 2710.57))))))) + ", " + Math.max(0, Math.min(255, Math.round(32.49 + e * (170.73 + e * (52.82 - e * (131.46 - e * (176.58 - e * 67.37))))))) + ", " + Math.max(0, Math.min(255, Math.round(81.24 + e * (442.36 - e * (2482.43 - e * (6167.24 - e * (6614.94 - e * 2475.67))))))) + ")";
}
//#endregion
//#region node_modules/d3-scale-chromatic/src/sequential-multi/cubehelix.js
var ch = ta(mi(300, .5, 0), mi(-240, .5, 1)), lh = ta(mi(-100, .75, .35), mi(80, 1.5, .8)), uh = ta(mi(260, .75, .35), mi(80, 1.5, .8)), dh = mi();
function fh(e) {
	(e < 0 || e > 1) && (e -= Math.floor(e));
	var t = Math.abs(e - .5);
	return dh.h = 360 * e - 100, dh.s = 1.5 - 1.5 * t, dh.l = .8 - .9 * t, dh + "";
}
//#endregion
//#region node_modules/d3-scale-chromatic/src/sequential-multi/sinebow.js
var ph = wr(), mh = Math.PI / 3, hh = Math.PI * 2 / 3;
function gh(e) {
	var t;
	return e = (.5 - e) * Math.PI, ph.r = 255 * (t = Math.sin(e)) * t, ph.g = 255 * (t = Math.sin(e + mh)) * t, ph.b = 255 * (t = Math.sin(e + hh)) * t, ph + "";
}
//#endregion
//#region node_modules/d3-scale-chromatic/src/sequential-multi/turbo.js
function _h(e) {
	return e = Math.max(0, Math.min(1, e)), "rgb(" + Math.max(0, Math.min(255, Math.round(34.61 + e * (1172.33 - e * (10793.56 - e * (33300.12 - e * (38394.49 - e * 14825.05))))))) + ", " + Math.max(0, Math.min(255, Math.round(23.31 + e * (557.33 + e * (1225.33 - e * (3574.96 - e * (1073.77 + e * 707.56))))))) + ", " + Math.max(0, Math.min(255, Math.round(27.2 + e * (3211.1 - e * (15327.97 - e * (27814 - e * (22569.18 - e * 6838.66))))))) + ")";
}
//#endregion
//#region node_modules/d3-scale-chromatic/src/sequential-multi/viridis.js
function vh(e) {
	var t = e.length;
	return function(n) {
		return e[Math.max(0, Math.min(t - 1, Math.floor(n * t)))];
	};
}
var yh = vh(U("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725")), bh = vh(U("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf")), xh = vh(U("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4")), Sh = vh(U("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));
//#endregion
//#region node_modules/d3-shape/src/constant.js
function Ch(e) {
	return function() {
		return e;
	};
}
//#endregion
//#region node_modules/d3-shape/src/math.js
var wh = Math.cos, Th = Math.min, Eh = Math.sin, G = Math.sqrt, Dh = Math.PI;
Dh / 2;
var Oh = 2 * Dh;
//#endregion
//#region node_modules/d3-shape/src/path.js
function kh(e) {
	let t = 3;
	return e.digits = function(n) {
		if (!arguments.length) return t;
		if (n == null) t = null;
		else {
			let e = Math.floor(n);
			if (!(e >= 0)) throw RangeError(`invalid digits: ${n}`);
			t = e;
		}
		return e;
	}, () => new es(t);
}
Array.prototype.slice;
function Ah(e) {
	return typeof e == "object" && "length" in e ? e : Array.from(e);
}
//#endregion
//#region node_modules/d3-shape/src/curve/linear.js
function jh(e) {
	this._context = e;
}
jh.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._point = 0;
	},
	lineEnd: function() {
		(this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
				break;
			case 1: this._point = 2;
			default: this._context.lineTo(e, t);
		}
	}
};
function Mh(e) {
	return new jh(e);
}
//#endregion
//#region node_modules/d3-shape/src/point.js
function Nh(e) {
	return e[0];
}
function Ph(e) {
	return e[1];
}
//#endregion
//#region node_modules/d3-shape/src/line.js
function Fh(e, t) {
	var n = Ch(!0), r = null, i = Mh, a = null, o = kh(s);
	e = typeof e == "function" ? e : e === void 0 ? Nh : Ch(e), t = typeof t == "function" ? t : t === void 0 ? Ph : Ch(t);
	function s(s) {
		var c, l = (s = Ah(s)).length, u, d = !1, f;
		for (r ?? (a = i(f = o())), c = 0; c <= l; ++c) !(c < l && n(u = s[c], c, s)) === d && ((d = !d) ? a.lineStart() : a.lineEnd()), d && a.point(+e(u, c, s), +t(u, c, s));
		if (f) return a = null, f + "" || null;
	}
	return s.x = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : Ch(+t), s) : e;
	}, s.y = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : Ch(+e), s) : t;
	}, s.defined = function(e) {
		return arguments.length ? (n = typeof e == "function" ? e : Ch(!!e), s) : n;
	}, s.curve = function(e) {
		return arguments.length ? (i = e, r != null && (a = i(r)), s) : i;
	}, s.context = function(e) {
		return arguments.length ? (e == null ? r = a = null : a = i(r = e), s) : r;
	}, s;
}
//#endregion
//#region node_modules/d3-shape/src/curve/bump.js
var Ih = class {
	constructor(e, t) {
		this._context = e, this._x = t;
	}
	areaStart() {
		this._line = 0;
	}
	areaEnd() {
		this._line = NaN;
	}
	lineStart() {
		this._point = 0;
	}
	lineEnd() {
		(this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
	}
	point(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
				break;
			case 1: this._point = 2;
			default: this._x ? this._context.bezierCurveTo(this._x0 = (this._x0 + e) / 2, this._y0, this._x0, t, e, t) : this._context.bezierCurveTo(this._x0, this._y0 = (this._y0 + t) / 2, e, this._y0, e, t);
		}
		this._x0 = e, this._y0 = t;
	}
};
function Lh(e) {
	return new Ih(e, !0);
}
function Rh(e) {
	return new Ih(e, !1);
}
//#endregion
//#region node_modules/d3-shape/src/symbol/asterisk.js
var zh = G(3), Bh = { draw(e, t) {
	let n = G(t + Th(t / 28, .75)) * .59436, r = n / 2, i = r * zh;
	e.moveTo(0, n), e.lineTo(0, -n), e.moveTo(-i, -r), e.lineTo(i, r), e.moveTo(-i, r), e.lineTo(i, -r);
} }, Vh = { draw(e, t) {
	let n = G(t / Dh);
	e.moveTo(n, 0), e.arc(0, 0, n, 0, Oh);
} }, Hh = { draw(e, t) {
	let n = G(t / 5) / 2;
	e.moveTo(-3 * n, -n), e.lineTo(-n, -n), e.lineTo(-n, -3 * n), e.lineTo(n, -3 * n), e.lineTo(n, -n), e.lineTo(3 * n, -n), e.lineTo(3 * n, n), e.lineTo(n, n), e.lineTo(n, 3 * n), e.lineTo(-n, 3 * n), e.lineTo(-n, n), e.lineTo(-3 * n, n), e.closePath();
} }, Uh = G(1 / 3), Wh = Uh * 2, Gh = { draw(e, t) {
	let n = G(t / Wh), r = n * Uh;
	e.moveTo(0, -n), e.lineTo(r, 0), e.lineTo(0, n), e.lineTo(-r, 0), e.closePath();
} }, Kh = { draw(e, t) {
	let n = G(t) * .62625;
	e.moveTo(0, -n), e.lineTo(n, 0), e.lineTo(0, n), e.lineTo(-n, 0), e.closePath();
} }, qh = { draw(e, t) {
	let n = G(t - Th(t / 7, 2)) * .87559;
	e.moveTo(-n, 0), e.lineTo(n, 0), e.moveTo(0, n), e.lineTo(0, -n);
} }, Jh = { draw(e, t) {
	let n = G(t), r = -n / 2;
	e.rect(r, r, n, n);
} }, Yh = { draw(e, t) {
	let n = G(t) * .4431;
	e.moveTo(n, n), e.lineTo(n, -n), e.lineTo(-n, -n), e.lineTo(-n, n), e.closePath();
} }, Xh = .8908130915292852, Zh = Eh(Dh / 10) / Eh(7 * Dh / 10), Qh = Eh(Oh / 10) * Zh, $h = -wh(Oh / 10) * Zh, eg = { draw(e, t) {
	let n = G(t * Xh), r = Qh * n, i = $h * n;
	e.moveTo(0, -n), e.lineTo(r, i);
	for (let t = 1; t < 5; ++t) {
		let a = Oh * t / 5, o = wh(a), s = Eh(a);
		e.lineTo(s * n, -o * n), e.lineTo(o * r - s * i, s * r + o * i);
	}
	e.closePath();
} }, tg = G(3), ng = { draw(e, t) {
	let n = -G(t / (tg * 3));
	e.moveTo(0, n * 2), e.lineTo(-tg * n, -n), e.lineTo(tg * n, -n), e.closePath();
} }, rg = G(3), ig = { draw(e, t) {
	let n = G(t) * .6824, r = n / 2, i = n * rg / 2;
	e.moveTo(0, -n), e.lineTo(i, r), e.lineTo(-i, r), e.closePath();
} }, ag = -.5, og = G(3) / 2, sg = 1 / G(12), cg = (sg / 2 + 1) * 3, lg = { draw(e, t) {
	let n = G(t / cg), r = n / 2, i = n * sg, a = r, o = n * sg + n, s = -a, c = o;
	e.moveTo(r, i), e.lineTo(a, o), e.lineTo(s, c), e.lineTo(ag * r - og * i, og * r + ag * i), e.lineTo(ag * a - og * o, og * a + ag * o), e.lineTo(ag * s - og * c, og * s + ag * c), e.lineTo(ag * r + og * i, ag * i - og * r), e.lineTo(ag * a + og * o, ag * o - og * a), e.lineTo(ag * s + og * c, ag * c - og * s), e.closePath();
} }, ug = { draw(e, t) {
	let n = G(t - Th(t / 6, 1.7)) * .6189;
	e.moveTo(-n, -n), e.lineTo(n, n), e.moveTo(-n, n), e.lineTo(n, -n);
} }, dg = [
	Vh,
	Hh,
	Gh,
	Jh,
	eg,
	ng,
	lg
], fg = [
	Vh,
	qh,
	ug,
	ig,
	Bh,
	Yh,
	Kh
];
//#endregion
//#region node_modules/d3-shape/src/noop.js
function pg() {}
//#endregion
//#region node_modules/d3-shape/src/curve/basis.js
function mg(e, t, n) {
	e._context.bezierCurveTo((2 * e._x0 + e._x1) / 3, (2 * e._y0 + e._y1) / 3, (e._x0 + 2 * e._x1) / 3, (e._y0 + 2 * e._y1) / 3, (e._x0 + 4 * e._x1 + t) / 6, (e._y0 + 4 * e._y1 + n) / 6);
}
function hg(e) {
	this._context = e;
}
hg.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x0 = this._x1 = this._y0 = this._y1 = NaN, this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 3: mg(this, this._x1, this._y1);
			case 2: this._context.lineTo(this._x1, this._y1);
		}
		(this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
				break;
			case 1:
				this._point = 2;
				break;
			case 2: this._point = 3, this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6);
			default: mg(this, e, t);
		}
		this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
	}
};
function gg(e) {
	return new hg(e);
}
//#endregion
//#region node_modules/d3-shape/src/curve/basisClosed.js
function _g(e) {
	this._context = e;
}
_g.prototype = {
	areaStart: pg,
	areaEnd: pg,
	lineStart: function() {
		this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = NaN, this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 1:
				this._context.moveTo(this._x2, this._y2), this._context.closePath();
				break;
			case 2:
				this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3), this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3), this._context.closePath();
				break;
			case 3: this.point(this._x2, this._y2), this.point(this._x3, this._y3), this.point(this._x4, this._y4);
		}
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._x2 = e, this._y2 = t;
				break;
			case 1:
				this._point = 2, this._x3 = e, this._y3 = t;
				break;
			case 2:
				this._point = 3, this._x4 = e, this._y4 = t, this._context.moveTo((this._x0 + 4 * this._x1 + e) / 6, (this._y0 + 4 * this._y1 + t) / 6);
				break;
			default: mg(this, e, t);
		}
		this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
	}
};
function vg(e) {
	return new _g(e);
}
//#endregion
//#region node_modules/d3-shape/src/curve/basisOpen.js
function yg(e) {
	this._context = e;
}
yg.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x0 = this._x1 = this._y0 = this._y1 = NaN, this._point = 0;
	},
	lineEnd: function() {
		(this._line || this._line !== 0 && this._point === 3) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1;
				break;
			case 1:
				this._point = 2;
				break;
			case 2:
				this._point = 3;
				var n = (this._x0 + 4 * this._x1 + e) / 6, r = (this._y0 + 4 * this._y1 + t) / 6;
				this._line ? this._context.lineTo(n, r) : this._context.moveTo(n, r);
				break;
			case 3: this._point = 4;
			default: mg(this, e, t);
		}
		this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
	}
};
function bg(e) {
	return new yg(e);
}
//#endregion
//#region node_modules/d3-shape/src/curve/bundle.js
function xg(e, t) {
	this._basis = new hg(e), this._beta = t;
}
xg.prototype = {
	lineStart: function() {
		this._x = [], this._y = [], this._basis.lineStart();
	},
	lineEnd: function() {
		var e = this._x, t = this._y, n = e.length - 1;
		if (n > 0) for (var r = e[0], i = t[0], a = e[n] - r, o = t[n] - i, s = -1, c; ++s <= n;) c = s / n, this._basis.point(this._beta * e[s] + (1 - this._beta) * (r + c * a), this._beta * t[s] + (1 - this._beta) * (i + c * o));
		this._x = this._y = null, this._basis.lineEnd();
	},
	point: function(e, t) {
		this._x.push(+e), this._y.push(+t);
	}
};
var Sg = (function e(t) {
	function n(e) {
		return t === 1 ? new hg(e) : new xg(e, t);
	}
	return n.beta = function(t) {
		return e(+t);
	}, n;
})(.85);
//#endregion
//#region node_modules/d3-shape/src/curve/cardinal.js
function Cg(e, t, n) {
	e._context.bezierCurveTo(e._x1 + e._k * (e._x2 - e._x0), e._y1 + e._k * (e._y2 - e._y0), e._x2 + e._k * (e._x1 - t), e._y2 + e._k * (e._y1 - n), e._x2, e._y2);
}
function wg(e, t) {
	this._context = e, this._k = (1 - t) / 6;
}
wg.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN, this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 2:
				this._context.lineTo(this._x2, this._y2);
				break;
			case 3: Cg(this, this._x1, this._y1);
		}
		(this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
				break;
			case 1:
				this._point = 2, this._x1 = e, this._y1 = t;
				break;
			case 2: this._point = 3;
			default: Cg(this, e, t);
		}
		this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
};
var Tg = (function e(t) {
	function n(e) {
		return new wg(e, t);
	}
	return n.tension = function(t) {
		return e(+t);
	}, n;
})(0);
//#endregion
//#region node_modules/d3-shape/src/curve/cardinalClosed.js
function Eg(e, t) {
	this._context = e, this._k = (1 - t) / 6;
}
Eg.prototype = {
	areaStart: pg,
	areaEnd: pg,
	lineStart: function() {
		this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN, this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 1:
				this._context.moveTo(this._x3, this._y3), this._context.closePath();
				break;
			case 2:
				this._context.lineTo(this._x3, this._y3), this._context.closePath();
				break;
			case 3: this.point(this._x3, this._y3), this.point(this._x4, this._y4), this.point(this._x5, this._y5);
		}
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._x3 = e, this._y3 = t;
				break;
			case 1:
				this._point = 2, this._context.moveTo(this._x4 = e, this._y4 = t);
				break;
			case 2:
				this._point = 3, this._x5 = e, this._y5 = t;
				break;
			default: Cg(this, e, t);
		}
		this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
};
var Dg = (function e(t) {
	function n(e) {
		return new Eg(e, t);
	}
	return n.tension = function(t) {
		return e(+t);
	}, n;
})(0);
//#endregion
//#region node_modules/d3-shape/src/curve/cardinalOpen.js
function Og(e, t) {
	this._context = e, this._k = (1 - t) / 6;
}
Og.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN, this._point = 0;
	},
	lineEnd: function() {
		(this._line || this._line !== 0 && this._point === 3) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1;
				break;
			case 1:
				this._point = 2;
				break;
			case 2:
				this._point = 3, this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);
				break;
			case 3: this._point = 4;
			default: Cg(this, e, t);
		}
		this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
};
var kg = (function e(t) {
	function n(e) {
		return new Og(e, t);
	}
	return n.tension = function(t) {
		return e(+t);
	}, n;
})(0);
//#endregion
//#region node_modules/d3-shape/src/curve/catmullRom.js
function Ag(e, t, n) {
	var r = e._x1, i = e._y1, a = e._x2, o = e._y2;
	if (e._l01_a > 1e-12) {
		var s = 2 * e._l01_2a + 3 * e._l01_a * e._l12_a + e._l12_2a, c = 3 * e._l01_a * (e._l01_a + e._l12_a);
		r = (r * s - e._x0 * e._l12_2a + e._x2 * e._l01_2a) / c, i = (i * s - e._y0 * e._l12_2a + e._y2 * e._l01_2a) / c;
	}
	if (e._l23_a > 1e-12) {
		var l = 2 * e._l23_2a + 3 * e._l23_a * e._l12_a + e._l12_2a, u = 3 * e._l23_a * (e._l23_a + e._l12_a);
		a = (a * l + e._x1 * e._l23_2a - t * e._l12_2a) / u, o = (o * l + e._y1 * e._l23_2a - n * e._l12_2a) / u;
	}
	e._context.bezierCurveTo(r, i, a, o, e._x2, e._y2);
}
function jg(e, t) {
	this._context = e, this._alpha = t;
}
jg.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN, this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 2:
				this._context.lineTo(this._x2, this._y2);
				break;
			case 3: this.point(this._x2, this._y2);
		}
		(this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		if (e = +e, t = +t, this._point) {
			var n = this._x2 - e, r = this._y2 - t;
			this._l23_a = Math.sqrt(this._l23_2a = (n * n + r * r) ** +this._alpha);
		}
		switch (this._point) {
			case 0:
				this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
				break;
			case 1:
				this._point = 2;
				break;
			case 2: this._point = 3;
			default: Ag(this, e, t);
		}
		this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
};
var Mg = (function e(t) {
	function n(e) {
		return t ? new jg(e, t) : new wg(e, 0);
	}
	return n.alpha = function(t) {
		return e(+t);
	}, n;
})(.5);
//#endregion
//#region node_modules/d3-shape/src/curve/catmullRomClosed.js
function Ng(e, t) {
	this._context = e, this._alpha = t;
}
Ng.prototype = {
	areaStart: pg,
	areaEnd: pg,
	lineStart: function() {
		this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN, this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 1:
				this._context.moveTo(this._x3, this._y3), this._context.closePath();
				break;
			case 2:
				this._context.lineTo(this._x3, this._y3), this._context.closePath();
				break;
			case 3: this.point(this._x3, this._y3), this.point(this._x4, this._y4), this.point(this._x5, this._y5);
		}
	},
	point: function(e, t) {
		if (e = +e, t = +t, this._point) {
			var n = this._x2 - e, r = this._y2 - t;
			this._l23_a = Math.sqrt(this._l23_2a = (n * n + r * r) ** +this._alpha);
		}
		switch (this._point) {
			case 0:
				this._point = 1, this._x3 = e, this._y3 = t;
				break;
			case 1:
				this._point = 2, this._context.moveTo(this._x4 = e, this._y4 = t);
				break;
			case 2:
				this._point = 3, this._x5 = e, this._y5 = t;
				break;
			default: Ag(this, e, t);
		}
		this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
};
var Pg = (function e(t) {
	function n(e) {
		return t ? new Ng(e, t) : new Eg(e, 0);
	}
	return n.alpha = function(t) {
		return e(+t);
	}, n;
})(.5);
//#endregion
//#region node_modules/d3-shape/src/curve/catmullRomOpen.js
function Fg(e, t) {
	this._context = e, this._alpha = t;
}
Fg.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN, this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
	},
	lineEnd: function() {
		(this._line || this._line !== 0 && this._point === 3) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		if (e = +e, t = +t, this._point) {
			var n = this._x2 - e, r = this._y2 - t;
			this._l23_a = Math.sqrt(this._l23_2a = (n * n + r * r) ** +this._alpha);
		}
		switch (this._point) {
			case 0:
				this._point = 1;
				break;
			case 1:
				this._point = 2;
				break;
			case 2:
				this._point = 3, this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);
				break;
			case 3: this._point = 4;
			default: Ag(this, e, t);
		}
		this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
};
var Ig = (function e(t) {
	function n(e) {
		return t ? new Fg(e, t) : new Og(e, 0);
	}
	return n.alpha = function(t) {
		return e(+t);
	}, n;
})(.5);
//#endregion
//#region node_modules/d3-shape/src/curve/linearClosed.js
function Lg(e) {
	this._context = e;
}
Lg.prototype = {
	areaStart: pg,
	areaEnd: pg,
	lineStart: function() {
		this._point = 0;
	},
	lineEnd: function() {
		this._point && this._context.closePath();
	},
	point: function(e, t) {
		e = +e, t = +t, this._point ? this._context.lineTo(e, t) : (this._point = 1, this._context.moveTo(e, t));
	}
};
function Rg(e) {
	return new Lg(e);
}
//#endregion
//#region node_modules/d3-shape/src/curve/monotone.js
function zg(e) {
	return e < 0 ? -1 : 1;
}
function Bg(e, t, n) {
	var r = e._x1 - e._x0, i = t - e._x1, a = (e._y1 - e._y0) / (r || i < 0 && -0), o = (n - e._y1) / (i || r < 0 && -0), s = (a * i + o * r) / (r + i);
	return (zg(a) + zg(o)) * Math.min(Math.abs(a), Math.abs(o), .5 * Math.abs(s)) || 0;
}
function Vg(e, t) {
	var n = e._x1 - e._x0;
	return n ? (3 * (e._y1 - e._y0) / n - t) / 2 : t;
}
function Hg(e, t, n) {
	var r = e._x0, i = e._y0, a = e._x1, o = e._y1, s = (a - r) / 3;
	e._context.bezierCurveTo(r + s, i + s * t, a - s, o - s * n, a, o);
}
function Ug(e) {
	this._context = e;
}
Ug.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN, this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 2:
				this._context.lineTo(this._x1, this._y1);
				break;
			case 3: Hg(this, this._t0, Vg(this, this._t0));
		}
		(this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		var n = NaN;
		if (e = +e, t = +t, e !== this._x1 || t !== this._y1) {
			switch (this._point) {
				case 0:
					this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
					break;
				case 1:
					this._point = 2;
					break;
				case 2:
					this._point = 3, Hg(this, Vg(this, n = Bg(this, e, t)), n);
					break;
				default: Hg(this, this._t0, n = Bg(this, e, t));
			}
			this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t, this._t0 = n;
		}
	}
};
function Wg(e) {
	this._context = new Gg(e);
}
(Wg.prototype = Object.create(Ug.prototype)).point = function(e, t) {
	Ug.prototype.point.call(this, t, e);
};
function Gg(e) {
	this._context = e;
}
Gg.prototype = {
	moveTo: function(e, t) {
		this._context.moveTo(t, e);
	},
	closePath: function() {
		this._context.closePath();
	},
	lineTo: function(e, t) {
		this._context.lineTo(t, e);
	},
	bezierCurveTo: function(e, t, n, r, i, a) {
		this._context.bezierCurveTo(t, e, r, n, a, i);
	}
};
function Kg(e) {
	return new Ug(e);
}
function qg(e) {
	return new Wg(e);
}
//#endregion
//#region node_modules/d3-shape/src/curve/natural.js
function Jg(e) {
	this._context = e;
}
Jg.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x = [], this._y = [];
	},
	lineEnd: function() {
		var e = this._x, t = this._y, n = e.length;
		if (n) {
			if (this._line ? this._context.lineTo(e[0], t[0]) : this._context.moveTo(e[0], t[0]), n === 2) this._context.lineTo(e[1], t[1]);
			else for (var r = Yg(e), i = Yg(t), a = 0, o = 1; o < n; ++a, ++o) this._context.bezierCurveTo(r[0][a], i[0][a], r[1][a], i[1][a], e[o], t[o]);
		}
		(this._line || this._line !== 0 && n === 1) && this._context.closePath(), this._line = 1 - this._line, this._x = this._y = null;
	},
	point: function(e, t) {
		this._x.push(+e), this._y.push(+t);
	}
};
function Yg(e) {
	var t, n = e.length - 1, r, i = Array(n), a = Array(n), o = Array(n);
	for (i[0] = 0, a[0] = 2, o[0] = e[0] + 2 * e[1], t = 1; t < n - 1; ++t) i[t] = 1, a[t] = 4, o[t] = 4 * e[t] + 2 * e[t + 1];
	for (i[n - 1] = 2, a[n - 1] = 7, o[n - 1] = 8 * e[n - 1] + e[n], t = 1; t < n; ++t) r = i[t] / a[t - 1], a[t] -= r, o[t] -= r * o[t - 1];
	for (i[n - 1] = o[n - 1] / a[n - 1], t = n - 2; t >= 0; --t) i[t] = (o[t] - i[t + 1]) / a[t];
	for (a[n - 1] = (e[n] + i[n - 1]) / 2, t = 0; t < n - 1; ++t) a[t] = 2 * e[t + 1] - i[t + 1];
	return [i, a];
}
function Xg(e) {
	return new Jg(e);
}
//#endregion
//#region node_modules/d3-shape/src/curve/step.js
function Zg(e, t) {
	this._context = e, this._t = t;
}
Zg.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x = this._y = NaN, this._point = 0;
	},
	lineEnd: function() {
		0 < this._t && this._t < 1 && this._point === 2 && this._context.lineTo(this._x, this._y), (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line >= 0 && (this._t = 1 - this._t, this._line = 1 - this._line);
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
				break;
			case 1: this._point = 2;
			default: if (this._t <= 0) this._context.lineTo(this._x, t), this._context.lineTo(e, t);
			else {
				var n = this._x * (1 - this._t) + e * this._t;
				this._context.lineTo(n, this._y), this._context.lineTo(n, t);
			}
		}
		this._x = e, this._y = t;
	}
};
function Qg(e) {
	return new Zg(e, .5);
}
function $g(e) {
	return new Zg(e, 0);
}
function e_(e) {
	return new Zg(e, 1);
}
//#endregion
//#region node_modules/d3-zoom/src/transform.js
function t_(e, t, n) {
	this.k = e, this.x = t, this.y = n;
}
t_.prototype = {
	constructor: t_,
	scale: function(e) {
		return e === 1 ? this : new t_(this.k * e, this.x, this.y);
	},
	translate: function(e, t) {
		return e === 0 & t === 0 ? this : new t_(this.k, this.x + this.k * e, this.y + this.k * t);
	},
	apply: function(e) {
		return [e[0] * this.k + this.x, e[1] * this.k + this.y];
	},
	applyX: function(e) {
		return e * this.k + this.x;
	},
	applyY: function(e) {
		return e * this.k + this.y;
	},
	invert: function(e) {
		return [(e[0] - this.x) / this.k, (e[1] - this.y) / this.k];
	},
	invertX: function(e) {
		return (e - this.x) / this.k;
	},
	invertY: function(e) {
		return (e - this.y) / this.k;
	},
	rescaleX: function(e) {
		return e.copy().domain(e.range().map(this.invertX, this).map(e.invert, e));
	},
	rescaleY: function(e) {
		return e.copy().domain(e.range().map(this.invertY, this).map(e.invert, e));
	},
	toString: function() {
		return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
	}
};
var n_ = new t_(1, 0, 0);
r_.prototype = t_.prototype;
function r_(e) {
	for (; !e.__zoom;) if (!(e = e.parentNode)) return n_;
	return e.__zoom;
}
//#endregion
//#region node_modules/@observablehq/plot/src/defined.js
function i_(e) {
	return e != null && !Number.isNaN(e);
}
function a_(t, n) {
	return +i_(n) - i_(t) || e(t, n);
}
function o_(e, n) {
	return +i_(n) - i_(e) || t(e, n);
}
function s_(e) {
	return e != null && `${e}` != "";
}
function c_(e) {
	return isFinite(e) ? e : NaN;
}
function l_(e) {
	return e > 0 && isFinite(e) ? e : NaN;
}
function u_(e) {
	return e < 0 && isFinite(e) ? e : NaN;
}
//#endregion
//#region node_modules/isoformat/src/format.js
function d_(e, t) {
	if (e instanceof Date || (e = /* @__PURE__ */ new Date(+e)), isNaN(e)) return typeof t == "function" ? t(e) : t;
	let n = e.getUTCHours(), r = e.getUTCMinutes(), i = e.getUTCSeconds(), a = e.getUTCMilliseconds();
	return `${f_(e.getUTCFullYear(), 4)}-${p_(e.getUTCMonth() + 1, 2)}-${p_(e.getUTCDate(), 2)}${n || r || i || a ? `T${p_(n, 2)}:${p_(r, 2)}${i || a ? `:${p_(i, 2)}${a ? `.${p_(a, 3)}` : ""}` : ""}Z` : ""}`;
}
function f_(e) {
	return e < 0 ? `-${p_(-e, 6)}` : e > 9999 ? `+${p_(e, 6)}` : p_(e, 4);
}
function p_(e, t) {
	return `${e}`.padStart(t, "0");
}
//#endregion
//#region node_modules/isoformat/src/parse.js
var m_ = /^(?:[-+]\d{2})?\d{4}(?:-\d{2}(?:-\d{2})?)?(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d{3})?)?(?:Z|[-+]\d{2}:?\d{2})?)?$/;
function h_(e, t) {
	return m_.test(e += "") ? new Date(e) : typeof t == "function" ? t(e) : t;
}
//#endregion
//#region node_modules/@observablehq/plot/src/order.js
function g_(e) {
	if (e == null) return;
	let n = e[0], r = e[e.length - 1];
	return t(n, r);
}
//#endregion
//#region node_modules/@observablehq/plot/src/time.js
var __ = 1e3, v_ = __ * 60, y_ = v_ * 60, b_ = y_ * 24, x_ = b_ * 7, S_ = b_ * 30, C_ = b_ * 365, w_ = [
	["millisecond", 1],
	["2 milliseconds", 2],
	["5 milliseconds", 5],
	["10 milliseconds", 10],
	["20 milliseconds", 20],
	["50 milliseconds", 50],
	["100 milliseconds", 100],
	["200 milliseconds", 200],
	["500 milliseconds", 500],
	["second", __],
	["5 seconds", 5 * __],
	["15 seconds", 15 * __],
	["30 seconds", 30 * __],
	["minute", v_],
	["5 minutes", 5 * v_],
	["15 minutes", 15 * v_],
	["30 minutes", 30 * v_],
	["hour", y_],
	["3 hours", 3 * y_],
	["6 hours", 6 * y_],
	["12 hours", 12 * y_],
	["day", b_],
	["2 days", 2 * b_],
	["week", x_],
	["2 weeks", 2 * x_],
	["month", S_],
	["3 months", 3 * S_],
	["6 months", 6 * S_],
	["year", C_],
	["2 years", 2 * C_],
	["5 years", 5 * C_],
	["10 years", 10 * C_],
	["20 years", 20 * C_],
	["50 years", 50 * C_],
	["100 years", 100 * C_]
], T_ = /* @__PURE__ */ new Map([
	["second", __],
	["minute", v_],
	["hour", y_],
	["day", b_],
	["monday", x_],
	["tuesday", x_],
	["wednesday", x_],
	["thursday", x_],
	["friday", x_],
	["saturday", x_],
	["sunday", x_],
	["week", x_],
	["month", S_],
	["year", C_]
]), E_ = /* @__PURE__ */ new Map([
	["second", Id],
	["minute", Ld],
	["hour", zd],
	["day", Vd],
	["monday", Kd],
	["tuesday", qd],
	["wednesday", Jd],
	["thursday", Yd],
	["friday", Xd],
	["saturday", Zd],
	["sunday", Gd],
	["week", Gd],
	["month", sf],
	["year", lf]
]), D_ = /* @__PURE__ */ new Map([
	["second", Id],
	["minute", Rd],
	["hour", Bd],
	["day", Ud],
	["monday", ef],
	["tuesday", tf],
	["wednesday", nf],
	["thursday", rf],
	["friday", af],
	["saturday", of],
	["sunday", $d],
	["week", $d],
	["month", cf],
	["year", uf]
]), O_ = Symbol("intervalDuration"), k_ = Symbol("intervalType");
for (let [e, t] of E_) t[O_] = T_.get(e), t[k_] = "time";
for (let [e, t] of D_) t[O_] = T_.get(e), t[k_] = "utc";
var A_ = [
	[
		"year",
		uf,
		"utc"
	],
	[
		"month",
		cf,
		"utc"
	],
	[
		"day",
		Ud,
		"utc",
		6 * S_
	],
	[
		"hour",
		Bd,
		"utc",
		3 * b_
	],
	[
		"minute",
		Rd,
		"utc",
		6 * y_
	],
	[
		"second",
		Id,
		"utc",
		30 * v_
	]
], j_ = [
	[
		"year",
		lf,
		"time"
	],
	[
		"month",
		sf,
		"time"
	],
	[
		"day",
		Vd,
		"time",
		6 * S_
	],
	[
		"hour",
		zd,
		"time",
		3 * b_
	],
	[
		"minute",
		Ld,
		"time",
		6 * y_
	],
	[
		"second",
		Id,
		"time",
		30 * v_
	]
], M_ = [
	A_[0],
	j_[0],
	A_[1],
	j_[1],
	A_[2],
	j_[2],
	...A_.slice(3)
];
function N_(e) {
	let t = `${e}`.toLowerCase();
	t.endsWith("s") && (t = t.slice(0, -1));
	let n = 1, r = /^(?:(\d+)\s+)/.exec(t);
	switch (r && (t = t.slice(r[0].length), n = +r[1]), t) {
		case "quarter":
			t = "month", n *= 3;
			break;
		case "half": t = "month", n *= 6;
	}
	let i = D_.get(t);
	if (!i) throw Error(`unknown interval: ${e}`);
	if (n > 1 && !i.every) throw Error(`non-periodic interval: ${t}`);
	return [t, n];
}
function P_(e) {
	return I_(N_(e), "time");
}
function F_(e) {
	return I_(N_(e), "utc");
}
function I_([e, t], n) {
	let r = (n === "time" ? E_ : D_).get(e);
	return t > 1 && (r = r.every(t), r[O_] = T_.get(e) * t, r[k_] = n), r;
}
function L_(e, t) {
	if (!(t > 1)) return;
	let r = e[O_];
	if (!w_.some(([, e]) => e === r) || r % b_ === 0 && b_ < r && r < S_) return;
	let [i] = w_[n(([, e]) => Math.log(e)).center(w_, Math.log(r * t))];
	return (e[k_] === "time" ? P_ : F_)(i);
}
function R_(e, t, n) {
	let r = t === "time" ? Ip : Lp;
	if (n == null) return r(e === "year" ? "%Y" : e === "month" ? "%Y-%m" : e === "day" ? "%Y-%m-%d" : e === "hour" || e === "minute" ? "%Y-%m-%dT%H:%M" : e === "second" ? "%Y-%m-%dT%H:%M:%S" : "%Y-%m-%dT%H:%M:%S.%L");
	let i = z_(n);
	switch (e) {
		case "millisecond": return H_(r(".%L"), r(":%M:%S"), i);
		case "second": return H_(r(":%S"), r("%-I:%M"), i);
		case "minute": return H_(r("%-I:%M"), r("%p"), i);
		case "hour": return H_(r("%-I %p"), r("%b %-d"), i);
		case "day": return H_(r("%-d"), r("%b"), i);
		case "month": return H_(r("%b"), r("%Y"), i);
		case "year": return r("%Y");
	}
	throw Error("unable to format time ticks");
}
function z_(e) {
	return e === "left" || e === "right" ? (e, t) => `\n${e}\n${t}` : e === "top" ? (e, t) => `${t}\n${e}` : (e, t) => `${e}\n${t}`;
}
function B_(e) {
	return e === "time" ? j_ : e === "utc" ? A_ : M_;
}
function V_(e, t, n) {
	let r = de(De(t, (e, t) => Math.abs(t - e)));
	if (r < 1e3) return R_("millisecond", "utc", n);
	for (let [i, a, o, s] of B_(e)) {
		if (r > s || i === "hour" && !r) break;
		if (t.every((e) => a.floor(e) >= e)) return R_(i, o, n);
	}
}
function H_(e, t, n) {
	return (r, i, a) => {
		let o = e(r, i), s = t(r, i), c = i - g_(a);
		return i !== c && a[c] !== void 0 && s === t(a[c], c) ? o : n(o, s);
	};
}
//#endregion
//#region node_modules/@observablehq/plot/src/options.js
var U_ = Object.getPrototypeOf(Uint8Array), W_ = Object.prototype.toString;
function G_(e) {
	return e instanceof Array || e instanceof U_;
}
function K_(e) {
	return e instanceof U_ && !J_(e);
}
function q_(e) {
	return e?.prototype instanceof U_ && !Y_(e);
}
function J_(e) {
	return e instanceof BigInt64Array || e instanceof BigUint64Array;
}
function Y_(e) {
	return e === BigInt64Array || e === BigUint64Array;
}
var X_ = Symbol("reindex");
function K(e, t, n) {
	let r = typeof t;
	return r === "string" ? Sy(e) ? ev(e.getChild(t), n) : Q_(e, rv(t), n) : r === "function" ? Q_(e, t, n) : r === "number" || t instanceof Date || r === "boolean" ? q(e, fv(t), n) : typeof t?.transform == "function" ? $_(t.transform(e), n) : Z_($_(t, n), e?.[X_]);
}
function Z_(e, t) {
	return e != null && t ? Rv(e, t) : e;
}
function Q_(e, t, n) {
	return q(e, q_(n) ? (e, n) => hv(t(e, n)) : t, n);
}
function $_(e, t) {
	return t === void 0 ? Cv(e) : Cy(e) ? ev(e, t) : e instanceof t ? e : t.from(e, q_(t) && !K_(e) ? hv : void 0);
}
function ev(e, t) {
	return e == null ? e : (t === void 0 || t === Array) && wy(e.type) ? gv(tv(e)) : $_(tv(e), t);
}
function tv(e) {
	return e.nullCount ? e.toJSON() : e.toArray();
}
var nv = [null], rv = (e) => (t) => {
	let n = t[e];
	return n === void 0 && t.type === "Feature" ? t.properties?.[e] : n;
}, iv = { transform: Lv }, av = { transform: (e) => e }, ov = () => 1, sv = () => !0, cv = (e) => e == null ? e : `${e}`, lv = (e) => e == null ? e : +e, uv = (e) => e ? e[0] : void 0, dv = (e) => e ? e[1] : void 0, fv = (e) => () => e;
function pv(e) {
	let t = `${e}`.slice(1) / 100;
	return (e, n) => ve(e, t, n);
}
function mv(e) {
	return K_(e) ? e : q(e, hv, Float64Array);
}
function hv(e) {
	return e == null ? NaN : Number(e);
}
function gv(e) {
	return q(e, _v);
}
function _v(e) {
	return e instanceof Date && !isNaN(e) ? e : typeof e == "string" ? h_(e) : e == null || isNaN(e = Number(e)) ? void 0 : new Date(e);
}
function vv(e, t) {
	return e === void 0 && (e = t), e === null ? [void 0, "none"] : dy(e) ? [void 0, e] : [e, void 0];
}
function yv(e, t) {
	return e === void 0 && (e = t), e === null || typeof e == "number" ? [void 0, e] : [e, void 0];
}
function bv(e, t, n) {
	if (e != null) return xv(e, t, n);
}
function xv(e, t, n) {
	let r = `${e}`.toLowerCase();
	if (!n.includes(r)) throw Error(`invalid ${t}: ${e}`);
	return r;
}
function Sv(e) {
	return Sy(e) ? e : Cv(e);
}
function Cv(e) {
	if (e == null || G_(e)) return e;
	if (Cy(e)) return ev(e);
	if (wv(e)) switch (e.type) {
		case "FeatureCollection": return e.features;
		case "GeometryCollection": return e.geometries;
		default: return [e];
	}
	return Array.from(e);
}
function wv(e) {
	switch (e?.type) {
		case "FeatureCollection":
		case "GeometryCollection":
		case "Feature":
		case "LineString":
		case "MultiLineString":
		case "MultiPoint":
		case "MultiPolygon":
		case "Point":
		case "Polygon":
		case "Sphere": return !0;
		default: return !1;
	}
}
function q(e, t, n = Array) {
	return e == null ? e : e instanceof n ? e.map(t) : n.from(e, t);
}
function Tv(e, t = Array) {
	return e instanceof t ? e.slice() : t.from(e);
}
function Ev({ x: e, x1: t, x2: n }) {
	return e !== void 0 || t !== void 0 || n !== void 0;
}
function Dv({ y: e, y1: t, y2: n }) {
	return e !== void 0 || t !== void 0 || n !== void 0;
}
function Ov(e) {
	return Ev(e) || Dv(e) || e.interval !== void 0;
}
function kv(e) {
	return e?.toString === W_;
}
function Av(e) {
	return kv(e) && (e.type !== void 0 || e.domain !== void 0);
}
function jv(e) {
	return kv(e) && typeof e.transform != "function";
}
function Mv(e) {
	return jv(e) && e.value === void 0 && e.channel === void 0;
}
function Nv(e, t, n, r = av) {
	return t === void 0 && n === void 0 ? (t = 0, n = e === void 0 ? r : e) : t === void 0 ? t = e === void 0 ? 0 : e : n === void 0 && (n = e === void 0 ? 0 : e), [t, n];
}
function Pv(e, t) {
	return e === void 0 && t === void 0 ? [uv, dv] : [e, t];
}
function Fv({ z: e, fill: t, stroke: n } = {}) {
	return e === void 0 && ([e] = vv(t)), e === void 0 && ([e] = vv(n)), e;
}
function Iv(e) {
	return G_(e) ? e.length : e?.numRows;
}
function Lv(e) {
	let t = Iv(e), n = new Uint32Array(t);
	for (let e = 0; e < t; ++e) n[e] = e;
	return n;
}
function Rv(e, t) {
	return G_(e) ? q(t, (t) => e[t], e.constructor) : q(t, (t) => e.at(t));
}
function zv(e, t, n) {
	return e.subarray ? e.subarray(t, n) : e.slice(t, n);
}
function Bv(e) {
	return typeof e == "object" && e ? e.valueOf() : e;
}
function Vv(e, t) {
	if (t[e] !== void 0) return t[e];
	switch (e) {
		case "x1":
		case "x2":
			e = "x";
			break;
		case "y1":
		case "y2": e = "y";
	}
	return t[e];
}
function Hv(e) {
	let t;
	return [{
		transform: () => t,
		label: Wv(e)
	}, (e) => t = e];
}
function Uv(e) {
	return e == null ? [e] : Hv(e);
}
function Wv(e, t) {
	return typeof e == "string" ? e : e && e.label !== void 0 ? e.label : t;
}
function Gv(e, t) {
	return {
		transform(n) {
			let r = e.transform(n), i = t.transform(n);
			return ay(r) || ay(i) ? q(r, (e, t) => /* @__PURE__ */ new Date((+r[t] + +i[t]) / 2)) : q(r, (e, t) => (+r[t] + +i[t]) / 2, Float64Array);
		},
		label: e.label
	};
}
function Kv(e, t) {
	let n = qv(t?.interval, t?.type);
	return n ? q(e, n) : e;
}
function qv(e, t) {
	let n = Jv(e, t);
	return n && ((e) => i_(e) ? n.floor(e) : e);
}
function Jv(e, t) {
	if (e != null) {
		if (typeof e == "number") return Yv(e);
		if (typeof e == "string") return (t === "time" ? P_ : F_)(e);
		if (typeof e.floor != "function") throw Error("invalid interval; missing floor method");
		if (typeof e.offset != "function") throw Error("invalid interval; missing offset method");
		return e;
	}
}
function Yv(e) {
	e = +e, 0 < e && e < 1 && Number.isInteger(1 / e) && (e = -1 / e);
	let t = Math.abs(e);
	return e < 0 ? {
		floor: (e) => Math.floor(e * t) / t,
		offset: (e, n = 1) => (e * t + Math.floor(n)) / t,
		range: (e, n) => ke(Math.ceil(e * t), n * t).map((e) => e / t)
	} : {
		floor: (e) => Math.floor(e / t) * t,
		offset: (e, n = 1) => e + t * Math.floor(n),
		range: (e, n) => ke(Math.ceil(e / t), n / t).map((e) => e * t)
	};
}
function Xv(e, t) {
	if (e = Jv(e, t), e && typeof e.range != "function") throw Error("invalid interval: missing range method");
	return e;
}
function Zv(e, t) {
	if (e = Xv(e, t), e && typeof e.ceil != "function") throw Error("invalid interval: missing ceil method");
	return e;
}
function Qv(e) {
	return $v(e) && typeof e?.floor == "function" && e.floor() instanceof Date;
}
function $v(e) {
	return typeof e?.range == "function";
}
function ey(e) {
	return e === void 0 || jv(e) ? e : { value: e };
}
function ty(e) {
	return e == null ? null : {
		transform: (t) => K(t, e, Float64Array),
		label: Wv(e)
	};
}
function ny(e) {
	return e && typeof e[Symbol.iterator] == "function";
}
function ry(e) {
	for (let t of e) if (t != null) return typeof t != "object" || t instanceof Date;
}
function iy(e) {
	for (let t of e) {
		if (t == null) continue;
		let e = typeof t;
		return e === "string" || e === "boolean";
	}
}
function ay(e) {
	for (let t of e) if (t != null) return t instanceof Date;
}
function oy(e) {
	for (let t of e) if (t != null) return typeof t == "string" && isNaN(t) && h_(t);
}
function sy(e) {
	for (let t of e) if (t != null) {
		if (typeof t != "string") return !1;
		if (t.trim()) return !isNaN(t);
	}
}
function cy(e) {
	for (let t of e) if (t != null) return typeof t == "number";
}
function ly(e, t) {
	let n;
	for (let r of e) if (r != null) {
		if (!t(r)) return !1;
		n = !0;
	}
	return n;
}
var uy = new Set("none,currentcolor,transparent,aliceblue,antiquewhite,aqua,aquamarine,azure,beige,bisque,black,blanchedalmond,blue,blueviolet,brown,burlywood,cadetblue,chartreuse,chocolate,coral,cornflowerblue,cornsilk,crimson,cyan,darkblue,darkcyan,darkgoldenrod,darkgray,darkgreen,darkgrey,darkkhaki,darkmagenta,darkolivegreen,darkorange,darkorchid,darkred,darksalmon,darkseagreen,darkslateblue,darkslategray,darkslategrey,darkturquoise,darkviolet,deeppink,deepskyblue,dimgray,dimgrey,dodgerblue,firebrick,floralwhite,forestgreen,fuchsia,gainsboro,ghostwhite,gold,goldenrod,gray,green,greenyellow,grey,honeydew,hotpink,indianred,indigo,ivory,khaki,lavender,lavenderblush,lawngreen,lemonchiffon,lightblue,lightcoral,lightcyan,lightgoldenrodyellow,lightgray,lightgreen,lightgrey,lightpink,lightsalmon,lightseagreen,lightskyblue,lightslategray,lightslategrey,lightsteelblue,lightyellow,lime,limegreen,linen,magenta,maroon,mediumaquamarine,mediumblue,mediumorchid,mediumpurple,mediumseagreen,mediumslateblue,mediumspringgreen,mediumturquoise,mediumvioletred,midnightblue,mintcream,mistyrose,moccasin,navajowhite,navy,oldlace,olive,olivedrab,orange,orangered,orchid,palegoldenrod,palegreen,paleturquoise,palevioletred,papayawhip,peachpuff,peru,pink,plum,powderblue,purple,rebeccapurple,red,rosybrown,royalblue,saddlebrown,salmon,sandybrown,seagreen,seashell,sienna,silver,skyblue,slateblue,slategray,slategrey,snow,springgreen,steelblue,tan,teal,thistle,tomato,turquoise,violet,wheat,white,whitesmoke,yellow".split(","));
function dy(e) {
	return typeof e == "string" && (e = e.toLowerCase().trim(), /^#[0-9a-f]{3,8}$/.test(e) || /^(?:url|var|rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color|color-mix)\(.*\)$/.test(e) || uy.has(e));
}
function fy(e) {
	return typeof e == "number" && (0 <= e && e <= 1 || isNaN(e));
}
function py(e) {
	return e == null || my(e);
}
function my(e) {
	return /^\s*none\s*$/i.test(e);
}
function hy(e) {
	return /^\s*round\s*$/i.test(e);
}
function gy(e, t) {
	return bv(e, t, [
		"middle",
		"top-left",
		"top",
		"top-right",
		"right",
		"bottom-right",
		"bottom",
		"bottom-left",
		"left"
	]);
}
function _y(e = "middle") {
	return gy(e, "frameAnchor");
}
function vy(e = {}, ...t) {
	let n = e;
	for (let r of t) for (let t in r) if (n[t] === void 0) {
		let i = r[t];
		n === e ? n = {
			...n,
			[t]: i
		} : n[t] = i;
	}
	return n;
}
function yy(e) {
	console.warn("named iterables are deprecated; please use an object instead");
	let t = /* @__PURE__ */ new Set();
	return Object.fromEntries(Array.from(e, (e) => {
		let { name: n } = e;
		if (n == null) throw Error("missing name");
		let r = `${n}`;
		if (r === "__proto__") throw Error(`illegal name: ${r}`);
		if (t.has(r)) throw Error(`duplicate name: ${r}`);
		return t.add(r), [n, e];
	}));
}
function by(e) {
	return ny(e) ? yy(e) : e;
}
function xy(e) {
	return e === !0 ? e = "frame" : e === !1 ? e = null : !wv(e) && e != null && (e = xv(e, "clip", ["frame", "sphere"]), e === "sphere" && (e = { type: "Sphere" })), e;
}
function Sy(e) {
	return e && typeof e.getChild == "function" && typeof e.toArray == "function" && e.schema && Array.isArray(e.schema.fields);
}
function Cy(e) {
	return e && typeof e.toArray == "function" && e.type;
}
function wy(e) {
	return e && (e.typeId === 8 || e.typeId === 10) && e.unit === 1;
}
//#endregion
//#region node_modules/@observablehq/plot/src/scales/index.js
var Ty = Symbol("position"), Ey = Symbol("color"), Dy = Symbol("radius"), Oy = Symbol("length"), ky = Symbol("opacity"), Ay = Symbol("symbol"), jy = Symbol("projection"), J = /* @__PURE__ */ new Map([
	["x", Ty],
	["y", Ty],
	["fx", Ty],
	["fy", Ty],
	["r", Dy],
	["color", Ey],
	["opacity", ky],
	["symbol", Ay],
	["length", Oy],
	["projection", jy]
]);
function My(e) {
	return e === Ty || e === jy;
}
function Ny(e) {
	return e === Ty || e === Dy || e === Oy || e === ky;
}
var Py = 2 / Math.sqrt(3), Fy = /* @__PURE__ */ new Map([
	["asterisk", Bh],
	["circle", Vh],
	["cross", Hh],
	["diamond", Gh],
	["diamond2", Kh],
	["hexagon", { draw(e, t) {
		let n = Math.sqrt(t / Math.PI), r = n * Py, i = r / 2;
		e.moveTo(0, r), e.lineTo(n, i), e.lineTo(n, -i), e.lineTo(0, -r), e.lineTo(-n, -i), e.lineTo(-n, i), e.closePath();
	} }],
	["plus", qh],
	["square", Jh],
	["square2", Yh],
	["star", eg],
	["times", ug],
	["triangle", ng],
	["triangle2", ig],
	["wye", lg]
]);
function Iy(e) {
	return e && typeof e.draw == "function";
}
function Ly(e) {
	return Iy(e) ? !0 : typeof e == "string" && Fy.has(e.toLowerCase());
}
function Ry(e) {
	if (e == null || Iy(e)) return e;
	let t = Fy.get(`${e}`.toLowerCase());
	if (t) return t;
	throw Error(`invalid symbol: ${e}`);
}
function zy(e) {
	if (e == null || Iy(e)) return [void 0, e];
	if (typeof e == "string") {
		let t = Fy.get(`${e}`.toLowerCase());
		if (t) return [void 0, t];
	}
	return [e, void 0];
}
//#endregion
//#region node_modules/@observablehq/plot/src/transforms/basic.js
function By({ filter: e, sort: t, reverse: n, transform: r, initializer: i, ...a } = {}, o) {
	if (r === void 0 && (e != null && (r = Gy(e)), t != null && !Mv(t) && (r = Hy(r, Jy(t))), n && (r = Hy(r, Ky))), o != null && i != null) throw Error("transforms cannot be applied after initializers");
	return {
		...a,
		...(t === null || Mv(t)) && { sort: t },
		transform: Hy(r, o)
	};
}
function Vy({ filter: e, sort: t, reverse: n, initializer: r, ...i } = {}, a) {
	return r === void 0 && (e != null && (r = Gy(e)), t != null && !Mv(t) && (r = Uy(r, Jy(t))), n && (r = Uy(r, Ky))), {
		...i,
		...(t === null || Mv(t)) && { sort: t },
		initializer: Uy(r, a)
	};
}
function Hy(e, t) {
	return e == null ? t === null ? void 0 : t : t == null ? e === null ? void 0 : e : function(n, r, i) {
		return {data: n, facets: r} = e.call(this, n, r, i), t.call(this, Sv(n), r, i);
	};
}
function Uy(e, t) {
	return e == null ? t === null ? void 0 : t : t == null ? e === null ? void 0 : e : function(n, r, i, ...a) {
		let o, s, c, l, u, d;
		return {data: s = n, facets: c = r, channels: o} = e.call(this, n, r, i, ...a), {data: u = s, facets: d = c, channels: l} = t.call(this, s, c, {
			...i,
			...o
		}, ...a), {
			data: u,
			facets: d,
			channels: {
				...o,
				...l
			}
		};
	};
}
function Wy(e, t) {
	return (e.initializer == null ? By : Vy)(e, t);
}
function Gy(e) {
	return (t, n) => {
		let r = K(t, e);
		return {
			data: t,
			facets: n.map((e) => e.filter((e) => r[e]))
		};
	};
}
function Ky(e, t) {
	return {
		data: e,
		facets: t.map((e) => e.slice().reverse())
	};
}
function qy(e, { sort: t, ...n } = {}) {
	return {
		...(jv(e) && e.channel !== void 0 ? Vy : Wy)(n, Jy(e)),
		sort: Mv(t) ? t : null
	};
}
function Jy(e) {
	return (typeof e == "function" && e.length !== 1 ? Yy : Xy)(e);
}
function Yy(e) {
	return (t, n) => {
		let r = G_(t) ? (n, r) => e(t[n], t[r]) : (n, r) => e(t.get(n), t.get(r));
		return {
			data: t,
			facets: n.map((e) => e.slice().sort(r))
		};
	};
}
function Xy(e) {
	let t, n;
	({channel: t, value: e, order: n} = { ...ey(e) });
	let r = t?.startsWith("-");
	if (r && (t = t.slice(1)), n === void 0 && (n = r ? o_ : a_), typeof n != "function") switch (`${n}`.toLowerCase()) {
		case "ascending":
			n = a_;
			break;
		case "descending":
			n = o_;
			break;
		default: throw Error(`invalid order: ${n}`);
	}
	return (r, i, a) => {
		let o;
		if (t === void 0) o = K(r, e);
		else {
			if (a === void 0) throw Error("channel sort requires an initializer");
			if (o = a[t], !o) return {};
			o = o.value;
		}
		let s = (e, t) => n(o[e], o[t]);
		return {
			data: r,
			facets: i.map((e) => e.slice().sort(s))
		};
	};
}
//#endregion
//#region node_modules/@observablehq/plot/src/transforms/group.js
function Zy(e, ...t) {
	for (let { name: n } of e) if (t.includes(n)) return !0;
	return !1;
}
function Qy(e, t, n = $y) {
	let r = Object.entries(e);
	return t.title != null && e.title === void 0 && r.push(["title", pb]), t.href != null && e.href === void 0 && r.push(["href", fb]), r.filter(([, e]) => e !== void 0).map(([e, r]) => r === null ? eb(e) : n(e, r, t));
}
function $y(e, t, n, r = tb) {
	let i;
	kv(t) && "reduce" in t && (i = t.scale, t = t.reduce);
	let a = r(e, t, n), [o, s] = Hv(a.label), c;
	return {
		name: e,
		output: i === void 0 ? o : {
			value: o,
			scale: i
		},
		initialize(e) {
			a.initialize(e), c = s([]);
		},
		scope(e, t) {
			a.scope(e, t);
		},
		reduce(e, t) {
			c.push(a.reduce(e, t));
		}
	};
}
function eb(e) {
	return {
		name: e,
		initialize() {},
		scope() {},
		reduce() {}
	};
}
function tb(e, t, n, r = rb) {
	let i = Vv(e, n), a = r(t, i), o, s;
	return {
		label: Wv(a === hb ? null : i, a.label),
		initialize(e) {
			o = i === void 0 ? e : K(e, i), a.scope === "data" && (s = a.reduceIndex(Lv(e), o));
		},
		scope(e, t) {
			a.scope === e && (s = a.reduceIndex(t, o));
		},
		reduce(e, t) {
			return a.scope == null ? a.reduceIndex(e, o, t) : a.reduceIndex(e, o, s, t);
		}
	};
}
function nb(e, t) {
	return t ? E(e, (e) => t[e]) : [[, e]];
}
function rb(e, t, n = ib) {
	if (e == null) return n(e);
	if (typeof e.reduceIndex == "function") return e;
	if (typeof e.reduce == "function" && kv(e)) return sb(e);
	if (typeof e == "function") return cb(e);
	if (/^p\d{2}$/i.test(e)) return lb(pv(e));
	switch (`${e}`.toLowerCase()) {
		case "first": return fb;
		case "last": return mb;
		case "identity": return db;
		case "count": return hb;
		case "distinct": return gb;
		case "sum": return t == null ? hb : _b;
		case "proportion": return vb(t, "data");
		case "proportion-facet": return vb(t, "facet");
		case "deviation": return lb(g);
		case "min": return lb(pe);
		case "min-index": return lb(me);
		case "max": return lb(de);
		case "max-index": return lb(fe);
		case "mean": return ub(Se);
		case "median": return ub(Ce);
		case "variance": return lb(h);
		case "mode": return lb(Ee);
	}
	return n(e);
}
function ib(e) {
	throw Error(`invalid reduce: ${e}`);
}
function ab(e, t) {
	for (let n in t) {
		let r = t[n];
		if (r !== void 0 && !e.some((e) => e.name === n)) return r;
	}
}
function ob(e, t, n) {
	if (t) {
		let n = t.output.transform(), r = (e, t) => a_(n[e], n[t]);
		e.forEach((e) => e.sort(r));
	}
	n && e.forEach((e) => e.reverse());
}
function sb(e) {
	return console.warn("deprecated reduce interface; implement reduceIndex instead."), {
		...e,
		reduceIndex: e.reduce.bind(e)
	};
}
function cb(e) {
	return { reduceIndex(t, n, r) {
		return e(Rv(n, t), r);
	} };
}
function lb(e) {
	return { reduceIndex(t, n) {
		return e(t, (e) => n[e]);
	} };
}
function ub(e) {
	return { reduceIndex(t, n) {
		let r = e(t, (e) => n[e]);
		return ay(n) ? new Date(r) : r;
	} };
}
var db = { reduceIndex(e, t) {
	return Rv(t, e);
} }, fb = { reduceIndex(e, t) {
	return t[e[0]];
} }, pb = { reduceIndex(e, t) {
	let n = j(D(e, (e) => e.length, (e) => t[e]), dv), r = n.slice(-5).reverse();
	if (r.length < n.length) {
		let e = n.slice(0, -4);
		r[4] = [`… ${e.length.toLocaleString("en-US")} more`, Ae(e, dv)];
	}
	return r.map(([e, t]) => `${e} (${t.toLocaleString("en-US")})`).join("\n");
} }, mb = { reduceIndex(e, t) {
	return t[e[e.length - 1]];
} }, hb = {
	label: "Frequency",
	reduceIndex(e) {
		return e.length;
	}
}, gb = {
	label: "Distinct",
	reduceIndex(e, t) {
		let n = new b();
		for (let r of e) n.add(t[r]);
		return n.size;
	}
}, _b = lb(Ae);
function vb(e, t) {
	return e == null ? {
		scope: t,
		label: "Frequency",
		reduceIndex: (e, t, n = 1) => e.length / n
	} : {
		scope: t,
		reduceIndex: (e, t, n = 1) => Ae(e, (e) => t[e]) / n
	};
}
var yb = { reduceIndex(e, t, { z: n }) {
	return n;
} };
//#endregion
//#region node_modules/@observablehq/plot/src/channel.js
function bb(e, { scale: t, type: n, value: r, filter: i, hint: a, label: o = Wv(r) }, s) {
	return a === void 0 && typeof r?.transform == "function" && (a = r.hint), Cb(s, {
		scale: t,
		type: n,
		value: K(e, r),
		label: o,
		filter: i,
		hint: a
	});
}
function xb(e, t) {
	return Object.fromEntries(Object.entries(e).map(([e, n]) => [e, bb(t, n, e)]));
}
function Sb(e, t) {
	let n = Object.fromEntries(Object.entries(e).map(([e, { scale: n, value: r }]) => {
		let i = n == null ? null : t[n];
		return [e, i == null ? r : q(r, i)];
	}));
	return n.channels = e, n;
}
function Cb(e, t) {
	let { scale: n, value: r } = t;
	if (n === !0 || n === "auto") switch (e) {
		case "fill":
		case "stroke":
		case "color":
			t.scale = n !== !0 && ly(r, dy) ? null : "color", t.defaultScale = "color";
			break;
		case "fillOpacity":
		case "strokeOpacity":
		case "opacity":
			t.scale = n !== !0 && ly(r, fy) ? null : "opacity", t.defaultScale = "opacity";
			break;
		case "symbol":
			n !== !0 && ly(r, Ly) ? (t.scale = null, t.value = q(r, Ry)) : t.scale = "symbol", t.defaultScale = "symbol";
			break;
		default: t.scale = J.has(e) ? e : null;
	}
	else if (n === !1) t.scale = null;
	else if (n != null && !J.has(n)) throw Error(`unknown scale: ${n}`);
	return t;
}
function wb(e, t, n, r, i) {
	let { order: a, reverse: o, reduce: s = !0, limit: c } = i;
	for (let l in i) {
		if (!J.has(l)) continue;
		let { value: u, order: d = a, reverse: f = o, reduce: p = s, limit: m = c } = ey(i[l]), h = u?.startsWith("-");
		if (h && (u = u.slice(1)), d = d === void 0 ? h === (u === "width" || u === "height") ? Ab : jb : kb(d), p == null || p === !1) continue;
		let g = l === "fx" || l === "fy" ? Eb(t, r[l]) : Tb(n, l);
		if (!g) throw Error(`missing channel for scale: ${l}`);
		let _ = g.value, [v = 0, y = Infinity] = ny(m) ? m : m < 0 ? [m] : [0, m];
		if (u == null) g.domain = () => {
			let e = Array.from(new b(_));
			return f && (e = e.reverse()), (v !== 0 || y !== Infinity) && (e = e.slice(v, y)), e;
		};
		else {
			let t = u === "data" ? e : u === "height" ? Db(n, "y1", "y2") : u === "width" ? Db(n, "x1", "x2") : Ob(n, u, u === "y" ? "y2" : u === "x" ? "x2" : void 0), r = rb(p === !0 ? "max" : p, t);
			g.domain = () => {
				let e = O(Lv(_), (e) => r.reduceIndex(e, t), (e) => _[e]);
				return d && e.sort(d), f && e.reverse(), (v !== 0 || y !== Infinity) && (e = e.slice(v, y)), e.map(uv);
			};
		}
	}
}
function Tb(e, t) {
	for (let n in e) {
		let r = e[n];
		if (r.scale === t) return r;
	}
}
function Eb(e, t) {
	let n = e.original;
	if (n === e) return t;
	let r = t.value, i = t.value = [];
	for (let t = 0; t < n.length; ++t) {
		let a = r[n[t][0]];
		for (let n of e[t]) i[n] = a;
	}
	return t;
}
function Db(e, t, n) {
	let r = Ob(e, t);
	return q(Ob(e, n), (e, t) => Math.abs(e - r[t]), Float64Array);
}
function Ob(e, t, n) {
	let r = e[t];
	if (!r && n !== void 0 && (r = e[n]), r) return r.value;
	throw Error(`missing channel: ${t}`);
}
function kb(e) {
	if (e == null || typeof e == "function") return e;
	switch (`${e}`.toLowerCase()) {
		case "ascending": return Ab;
		case "descending": return jb;
	}
	throw Error(`invalid order: ${e}`);
}
function Ab([e, t], [n, r]) {
	return a_(t, r) || a_(e, n);
}
function jb([e, t], [n, r]) {
	return o_(t, r) || a_(e, n);
}
function Mb(e, t) {
	let n = e[t];
	if (n) {
		for (; n.source;) n = n.source;
		return n.source === null ? null : n;
	}
}
//#endregion
//#region node_modules/@observablehq/plot/src/scales/schemes.js
var Nb = /* @__PURE__ */ new Map([
	["accent", Zp],
	["category10", Xp],
	["dark2", Qp],
	["observable10", $p],
	["paired", em],
	["pastel1", tm],
	["pastel2", nm],
	["set1", rm],
	["set2", im],
	["set3", am],
	["tableau10", om]
]);
function Pb(e) {
	return e != null && Nb.has(`${e}`.toLowerCase());
}
var Fb = new Map([
	...Nb,
	["brbg", Ib(sm, cm)],
	["prgn", Ib(lm, um)],
	["piyg", Ib(dm, fm)],
	["puor", Ib(pm, mm)],
	["rdbu", Ib(hm, gm)],
	["rdgy", Ib(_m, vm)],
	["rdylbu", Ib(ym, bm)],
	["rdylgn", Ib(xm, Sm)],
	["spectral", Ib(Cm, wm)],
	["burd", Lb(hm, gm)],
	["buylrd", Lb(ym, bm)],
	["blues", Y(Ym, Xm)],
	["greens", Y(Zm, Qm)],
	["greys", Y($m, eh)],
	["oranges", Y(ah, oh)],
	["purples", Y(th, nh)],
	["reds", Y(rh, ih)],
	["turbo", Rb(_h)],
	["viridis", Rb(yh)],
	["magma", Rb(bh)],
	["inferno", Rb(xh)],
	["plasma", Rb(Sh)],
	["cividis", Rb(sh)],
	["cubehelix", Rb(ch)],
	["warm", Rb(lh)],
	["cool", Rb(uh)],
	["bugn", Y(Tm, Em)],
	["bupu", Y(Dm, Om)],
	["gnbu", Y(km, Am)],
	["orrd", Y(jm, Mm)],
	["pubu", Y(Fm, Im)],
	["pubugn", Y(Nm, Pm)],
	["purd", Y(Lm, Rm)],
	["rdpu", Y(zm, Bm)],
	["ylgn", Y(Um, Wm)],
	["ylgnbu", Y(Vm, Hm)],
	["ylorbr", Y(Gm, Km)],
	["ylorrd", Y(qm, Jm)],
	["rainbow", zb(fh)],
	["sinebow", zb(gh)]
]);
function Y(e, t) {
	return ({ length: n }) => n === 1 ? [e[3][1]] : n === 2 ? [e[3][1], e[3][2]] : (n = Math.max(3, Math.floor(n)), n > 9 ? ra(t, n) : e[n]);
}
function Ib(e, t) {
	return ({ length: n }) => n === 2 ? [e[3][0], e[3][2]] : (n = Math.max(3, Math.floor(n)), n > 11 ? ra(t, n) : e[n]);
}
function Lb(e, t) {
	return ({ length: n }) => n === 2 ? [e[3][2], e[3][0]] : (n = Math.max(3, Math.floor(n)), n > 11 ? ra((e) => t(1 - e), n) : e[n].slice().reverse());
}
function Rb(e) {
	return ({ length: t }) => ra(e, Math.max(2, Math.floor(t)));
}
function zb(e) {
	return ({ length: t }) => ra(e, Math.floor(t) + 1).slice(0, -1);
}
function Bb(e) {
	let t = `${e}`.toLowerCase();
	if (!Fb.has(t)) throw Error(`unknown ordinal scheme: ${t}`);
	return Fb.get(t);
}
function Vb(e, t) {
	let n = Bb(e), r = typeof n == "function" ? n({ length: t }) : n;
	return r.length === t ? r : r.slice(0, t);
}
function Hb(e, t = "greys") {
	let n = /* @__PURE__ */ new Set(), [r, i] = Vb(t, 2);
	for (let t of e) if (t != null) {
		if (t === !0) n.add(i);
		else if (t === !1) n.add(r);
		else return;
	}
	return [...n];
}
var Ub = /* @__PURE__ */ new Map([
	["brbg", cm],
	["prgn", um],
	["piyg", fm],
	["puor", mm],
	["rdbu", gm],
	["rdgy", vm],
	["rdylbu", bm],
	["rdylgn", Sm],
	["spectral", wm],
	["burd", (e) => gm(1 - e)],
	["buylrd", (e) => bm(1 - e)],
	["blues", Xm],
	["greens", Qm],
	["greys", eh],
	["purples", nh],
	["reds", ih],
	["oranges", oh],
	["turbo", _h],
	["viridis", yh],
	["magma", bh],
	["inferno", xh],
	["plasma", Sh],
	["cividis", sh],
	["cubehelix", ch],
	["warm", lh],
	["cool", uh],
	["bugn", Em],
	["bupu", Om],
	["gnbu", Am],
	["orrd", Mm],
	["pubugn", Pm],
	["pubu", Im],
	["purd", Rm],
	["rdpu", Bm],
	["ylgnbu", Hm],
	["ylgn", Wm],
	["ylorbr", Km],
	["ylorrd", Jm],
	["rainbow", fh],
	["sinebow", gh]
]);
function Wb(e) {
	let t = `${e}`.toLowerCase();
	if (!Ub.has(t)) throw Error(`unknown quantitative scheme: ${t}`);
	return Ub.get(t);
}
var Gb = /* @__PURE__ */ new Set([
	"brbg",
	"prgn",
	"piyg",
	"puor",
	"rdbu",
	"rdgy",
	"rdylbu",
	"rdylgn",
	"spectral",
	"burd",
	"buylrd"
]);
function Kb(e) {
	return e != null && Gb.has(`${e}`.toLowerCase());
}
//#endregion
//#region node_modules/@observablehq/plot/src/scales/quantitative.js
var qb = (e) => (t) => e(1 - t), Jb = [0, 1], Yb = /* @__PURE__ */ new Map([
	["number", ji],
	["rgb", wi],
	["hsl", Xi],
	["hcl", $i],
	["lab", Zi]
]);
function Xb(e) {
	let t = `${e}`.toLowerCase();
	if (!Yb.has(t)) throw Error(`unknown interpolator: ${t}`);
	return Yb.get(t);
}
function Zb(e, t, n, { type: r, nice: i, clamp: a, zero: o, domain: s = dx(e, n), unknown: c, round: l, scheme: u, interval: d, range: f = J.get(e) === Dy ? px(n, s) : J.get(e) === Oy ? mx(n, s) : J.get(e) === ky ? Jb : void 0, interpolate: p = J.get(e) === Ey ? u == null && f !== void 0 ? wi : Wb(u === void 0 ? r === "cyclical" ? "rainbow" : "turbo" : u) : l ? zi : ji, reverse: m }) {
	if (s = Qb(s), d = Xv(d, r), (r === "cyclical" || r === "sequential") && (r = "linear"), typeof p != "function" && (p = Xb(p)), m = !!m, f !== void 0 && s.length !== (f = Qb(f)).length) {
		if (p.length === 1) throw Error("invalid piecewise interpolator");
		p = na(p, f), f = void 0;
	}
	if (p.length === 1 ? (m &&= (p = qb(p), !1), f === void 0 && (f = Float64Array.from(s, (e, t) => t / (s.length - 1)), f.length === 2 && (f = Jb)), t.interpolate((f === Jb ? fv : _x)(p))) : t.interpolate(p), o) {
		let [e, t] = _(s);
		(e > 0 || t < 0) && (s = Tv(s), (g_(s) || 1) === Math.sign(e) ? s[0] = 0 : s[s.length - 1] = 0);
	}
	return m && (s = je(s)), t.domain(s).unknown(c), i && (t.nice($b(i, r)), s = t.domain()), f !== void 0 && t.range(f), a && t.clamp(a), {
		type: r,
		domain: s,
		range: f,
		scale: t,
		interpolate: p,
		interval: d
	};
}
function Qb(e) {
	return e = Cv(e), e.length >= 2 ? e : [e[0], e[0]];
}
function $b(e, t) {
	return e === !0 ? void 0 : typeof e == "number" ? e : Zv(e, t);
}
function ex(e, t, n) {
	return Zb(e, nd(), t, n);
}
function tx(e, t, n) {
	return nx(e, t, {
		...n,
		exponent: .5
	});
}
function nx(e, t, { exponent: n = 1, ...r }) {
	return Zb(e, Cd().exponent(n), t, {
		...r,
		type: "pow"
	});
}
function rx(e, t, { base: n = 10, domain: r = hx(t), ...i }) {
	return Zb(e, md().base(n), t, {
		...i,
		domain: r
	});
}
function ix(e, t, { constant: n = 1, ...r }) {
	return Zb(e, vd().constant(n), t, r);
}
function ax(e, t, { range: n, quantiles: r = n === void 0 ? 5 : (n = [...n]).length, n: i = r, scheme: a = "rdylbu", domain: o = gx(t), unknown: s, interpolate: c, reverse: l }) {
	return n === void 0 && (n = c === void 0 ? J.get(e) === Ey ? Vb(a, i) : void 0 : ra(c, i)), o.length > 0 && (o = wd(o, n === void 0 ? { length: i } : n).quantiles()), sx(e, t, {
		domain: o,
		range: n,
		reverse: l,
		unknown: s
	});
}
function ox(e, t, { range: n, n: r = n === void 0 ? 5 : (n = [...n]).length, scheme: i = "rdylbu", domain: a = dx(e, t), unknown: o, interpolate: s, reverse: c }) {
	let [l, u] = _(a), d;
	return n === void 0 ? (d = se(l, u, r), d[0] <= l && d.splice(0, 1), d[d.length - 1] >= u && d.pop(), r = d.length + 1, n = s === void 0 ? J.get(e) === Ey ? Vb(i, r) : void 0 : ra(s, r)) : (d = ra(ji(l, u), r + 1).slice(1, -1), l instanceof Date && (d = d.map((e) => new Date(e)))), g_(Cv(a)) < 0 && d.reverse(), sx(e, t, {
		domain: d,
		range: n,
		reverse: c,
		unknown: o
	});
}
function sx(e, t, { domain: n = [0], unknown: r, scheme: i = "rdylbu", interpolate: a, range: o = a === void 0 ? J.get(e) === Ey ? Vb(i, n.length + 1) : void 0 : ra(a, n.length + 1), reverse: s }) {
	n = Cv(n);
	let c = g_(n);
	if (!isNaN(c) && !cx(n, c)) throw Error(`the ${e} scale has a non-monotonic domain`);
	return s && (o = je(o)), {
		type: "threshold",
		scale: Td(c < 0 ? je(n) : n, o === void 0 ? [] : o).unknown(r),
		domain: n,
		range: o
	};
}
function cx(e, n) {
	for (let r = 1, i = e.length, a = e[0]; r < i; ++r) {
		let i = t(a, a = e[r]);
		if (i !== 0 && i !== n) return !1;
	}
	return !0;
}
function lx(e) {
	return {
		type: "identity",
		scale: Ny(J.get(e)) ? rd() : (e) => e
	};
}
function ux(e, t = c_) {
	return e.length ? [pe(e, ({ value: e }) => e === void 0 ? e : pe(e, t)), de(e, ({ value: e }) => e === void 0 ? e : de(e, t))] : [0, 1];
}
function dx(e, t) {
	let n = J.get(e);
	return (n === Dy || n === ky || n === Oy ? fx : ux)(t);
}
function fx(e) {
	return [0, e.length ? de(e, ({ value: e }) => e === void 0 ? e : de(e, c_)) : 1];
}
function px(e, t) {
	let n = e.find(({ radius: e }) => e !== void 0);
	if (n !== void 0) return [0, n.radius];
	let r = ve(e, .5, ({ value: e }) => e === void 0 ? NaN : ve(e, .25, l_)), i = t.map((e) => 3 * Math.sqrt(e / r)), a = 30 / de(i);
	return a < 1 ? i.map((e) => e * a) : i;
}
function mx(e, t) {
	let n = Ce(e, ({ value: e }) => e === void 0 ? NaN : Ce(e, Math.abs)), r = t.map((e) => 12 * e / n), i = 60 / de(r);
	return i < 1 ? r.map((e) => e * i) : r;
}
function hx(e) {
	for (let { value: t } of e) if (t !== void 0) for (let n of t) {
		if (n > 0) return ux(e, l_);
		if (n < 0) return ux(e, u_);
	}
	return [1, 10];
}
function gx(e) {
	let t = [];
	for (let { value: n } of e) if (n !== void 0) for (let e of n) t.push(e);
	return t;
}
function _x(e) {
	return (t, n) => (r) => e(t + r * (n - t));
}
//#endregion
//#region node_modules/@observablehq/plot/src/warnings.js
var vx = 0, yx;
function bx() {
	let e = vx;
	return vx = 0, yx = void 0, e;
}
function xx(e) {
	e !== yx && (yx = e, console.warn(e), ++vx);
}
//#endregion
//#region node_modules/@observablehq/plot/src/scales/diverging.js
function Sx(e, n, r, i, { type: a, nice: o, clamp: s, domain: c = ux(i), unknown: l, pivot: u = 0, scheme: d, range: f, symmetric: p = !0, interpolate: m = J.get(e) === Ey ? d == null && f !== void 0 ? wi : Wb(d === void 0 ? "rdbu" : d) : ji, reverse: h }) {
	u = +u, c = Cv(c);
	let [g, _] = c;
	if (c.length > 2 && xx(`Warning: the diverging ${e} scale domain contains extra elements.`), t(g, _) < 0 && ([g, _] = [_, g], h = !h), g = Math.min(g, u), _ = Math.max(_, u), typeof m != "function" && (m = Xb(m)), f !== void 0 && (m = m.length === 1 ? _x(m)(...f) : na(m, f)), h && (m = qb(m)), p) {
		let e = r.apply(u), t = e - r.apply(g), n = r.apply(_) - e;
		t < n ? g = r.invert(e - n) : t > n && (_ = r.invert(e + t));
	}
	return n.domain([
		g,
		u,
		_
	]).unknown(l).interpolator(m), s && n.clamp(s), o && n.nice(o), {
		type: a,
		domain: [g, _],
		pivot: u,
		interpolate: m,
		scale: n
	};
}
function Cx(e, t, n) {
	return Sx(e, Kp(), Ox, t, n);
}
function wx(e, t, n) {
	return Tx(e, t, {
		...n,
		exponent: .5
	});
}
function Tx(e, t, { exponent: n = 1, ...r }) {
	return Sx(e, Yp().exponent(n = +n), jx(n), t, {
		...r,
		type: "diverging-pow"
	});
}
function Ex(e, t, { base: n = 10, pivot: r = 1, domain: i = ux(t, r < 0 ? u_ : l_), ...a }) {
	return Sx(e, qp().base(n = +n), kx, t, {
		domain: i,
		pivot: r,
		...a
	});
}
function Dx(e, t, { constant: n = 1, ...r }) {
	return Sx(e, Jp().constant(n = +n), Mx(n), t, r);
}
var Ox = {
	apply(e) {
		return e;
	},
	invert(e) {
		return e;
	}
}, kx = {
	apply: Math.log,
	invert: Math.exp
}, Ax = {
	apply(e) {
		return Math.sign(e) * Math.sqrt(Math.abs(e));
	},
	invert(e) {
		return e * e * Math.sign(e);
	}
};
function jx(e) {
	return e === .5 ? Ax : {
		apply(t) {
			return Math.sign(t) * Math.abs(t) ** +e;
		},
		invert(t) {
			return Math.sign(t) * Math.abs(t) ** (1 / e);
		}
	};
}
function Mx(e) {
	return {
		apply(t) {
			return Math.sign(t) * Math.log1p(Math.abs(t / e));
		},
		invert(t) {
			return Math.sign(t) * Math.expm1(Math.abs(t)) * e;
		}
	};
}
//#endregion
//#region node_modules/@observablehq/plot/src/scales/temporal.js
function Nx(e, t, n, r) {
	return Zb(e, t, n, r);
}
function Px(e, t, n) {
	return Nx(e, Hp(), t, n);
}
function Fx(e, t, n) {
	return Nx(e, Up(), t, n);
}
//#endregion
//#region node_modules/@observablehq/plot/src/scales/ordinal.js
var Ix = Symbol("ordinal");
function Lx(e, t, n, { type: r, interval: i, domain: a, range: o, reverse: s, hint: c }) {
	return i = Xv(i, r), a === void 0 && (a = Hx(n, i, e)), (r === "categorical" || r === Ix) && (r = "ordinal"), s && (a = je(a)), a = t.domain(a).domain(), o !== void 0 && (typeof o == "function" && (o = o(a)), t.range(o)), {
		type: r,
		domain: a,
		range: o,
		scale: t,
		hint: c,
		interval: i
	};
}
function Rx(e, t, { type: n, interval: r, domain: i, range: a, scheme: o, unknown: s, ...c }) {
	r = Xv(r, n), i === void 0 && (i = Hx(t, r, e));
	let l;
	if (J.get(e) === Ay) l = Wx(t), a = a === void 0 ? Gx(l) : q(a, Ry);
	else if (J.get(e) === Ey && (a === void 0 && (n === "ordinal" || n === Ix) && (a = Hb(i, o), a !== void 0 && (o = void 0)), o === void 0 && a === void 0 && (o = n === "ordinal" ? "turbo" : "observable10"), o !== void 0)) {
		if (a !== void 0) {
			let e = Wb(o), t = a[0], n = a[1] - a[0];
			a = ({ length: r }) => ra((r) => e(t + n * r), r);
		} else a = Bb(o);
	}
	if (s === Ru) throw Error(`implicit unknown on ${e} scale is not supported`);
	return Lx(e, zu().unknown(s), t, {
		...c,
		type: n,
		domain: i,
		range: a,
		hint: l
	});
}
function zx(e, t, { align: n = .5, padding: r = .5, ...i }) {
	return Vx(Hu().align(n).padding(r), t, i, e);
}
function Bx(e, t, { align: n = .5, padding: r = .1, paddingInner: i = r, paddingOuter: a = e === "fx" || e === "fy" ? 0 : r, ...o }) {
	return Vx(Bu().align(n).paddingInner(i).paddingOuter(a), t, o, e);
}
function Vx(e, t, n, r) {
	let { round: i } = n;
	return i !== void 0 && e.round(i = !!i), e = Lx(r, e, t, n), e.round = i, e;
}
function Hx(e, t, n) {
	let r = new b();
	for (let { value: t, domain: n } of e) {
		if (n !== void 0) return n();
		if (t !== void 0) for (let e of t) r.add(e);
	}
	if (t !== void 0) {
		let [e, n] = _(r).map(t.floor, t);
		return t.range(e, t.offset(n));
	}
	if (r.size > 1e4 && J.get(n) === Ty) throw Error(`implicit ordinal domain of ${n} scale has more than 10,000 values`);
	return j(r, a_);
}
function Ux(e, t) {
	let n;
	for (let { hint: r } of e) {
		let e = r?.[t];
		if (e !== void 0) {
			if (n === void 0) n = e;
			else if (n !== e) return;
		}
	}
	return n;
}
function Wx(e) {
	return {
		fill: Ux(e, "fill"),
		stroke: Ux(e, "stroke")
	};
}
function Gx(e) {
	return py(e.fill) ? fg : dg;
}
//#endregion
//#region node_modules/@observablehq/plot/src/scales.js
function Kx(e, { label: t, inset: n = 0, insetTop: r = n, insetRight: i = n, insetBottom: a = n, insetLeft: o = n, round: s, nice: c, clamp: l, zero: u, align: d, padding: f, projection: p, facet: { label: m = t } = {}, ...h } = {}) {
	let g = {};
	for (let [n, _] of e) {
		let e = h[n], v = iS(n, _, {
			round: J.get(n) === Ty ? s : void 0,
			nice: c,
			clamp: l,
			zero: u,
			align: d,
			padding: f,
			projection: p,
			...e
		});
		if (v) {
			let { label: s = n === "fx" || n === "fy" ? m : t, percent: c, transform: l, inset: u, insetTop: d = u === void 0 ? n === "y" ? r : 0 : u, insetRight: f = u === void 0 ? n === "x" ? i : 0 : u, insetBottom: p = u === void 0 ? n === "y" ? a : 0 : u, insetLeft: h = u === void 0 ? n === "x" ? o : 0 : u } = e || {};
			if (l == null) l = void 0;
			else if (typeof l != "function") throw Error("invalid scale transform; not a function");
			v.percent = !!c, v.label = s === void 0 ? Yx(_, v) : s, v.transform = l, n === "x" || n === "fx" ? (v.insetLeft = +h, v.insetRight = +f) : (n === "y" || n === "fy") && (v.insetTop = +d, v.insetBottom = +p), g[n] = v;
		}
	}
	return g;
}
function qx(e) {
	let t = {}, n = { scales: t };
	for (let [r, i] of Object.entries(e)) {
		let { scale: e, type: a, interval: o, label: s } = i;
		t[r] = _S(i), n[r] = e, e.type = a, o != null && (e.interval = o), s != null && (e.label = s);
	}
	return n;
}
function Jx(e, t) {
	let { x: n, y: r, fx: i, fy: a } = e, o = i || a ? Zx(t) : t;
	i && $x(i, o), a && eS(a, o);
	let s = i || a ? Qx(e, t) : t;
	n && $x(n, s), r && eS(r, s);
}
function Yx(e = [], t) {
	let n;
	for (let { label: t } of e) if (t !== void 0) {
		if (n === void 0) n = t;
		else if (n !== t) return;
	}
	if (n !== void 0) return !uS(t) && t.percent && (n = `${n} (%)`), {
		inferred: !0,
		toString: () => n
	};
}
function Xx(e) {
	return Math.sign(g_(e.domain())) * Math.sign(g_(e.range()));
}
function Zx(e) {
	let { marginTop: t, marginRight: n, marginBottom: r, marginLeft: i, width: a, height: o, facet: { marginTop: s, marginRight: c, marginBottom: l, marginLeft: u } } = e;
	return {
		marginTop: Math.max(t, s),
		marginRight: Math.max(n, c),
		marginBottom: Math.max(r, l),
		marginLeft: Math.max(i, u),
		width: a,
		height: o
	};
}
function Qx({ fx: e, fy: t }, n) {
	let { marginTop: r, marginRight: i, marginBottom: a, marginLeft: o, width: s, height: c } = Zx(n);
	return {
		marginTop: r,
		marginRight: i,
		marginBottom: a,
		marginLeft: o,
		width: e ? e.scale.bandwidth() + o + i : s,
		height: t ? t.scale.bandwidth() + r + a : c,
		facet: {
			width: s,
			height: c
		}
	};
}
function $x(e, t) {
	if (e.range === void 0) {
		let { insetLeft: n, insetRight: r } = e, { width: i, marginLeft: a = 0, marginRight: o = 0 } = t, s = a + n, c = i - o - r;
		e.range = [s, Math.max(s, c)], uS(e) || (e.range = rS(e)), e.scale.range(e.range);
	}
	tS(e);
}
function eS(e, t) {
	if (e.range === void 0) {
		let { insetTop: n, insetBottom: r } = e, { height: i, marginTop: a = 0, marginBottom: o = 0 } = t, s = a + n, c = i - o - r;
		e.range = [Math.max(s, c), s], uS(e) ? e.range.reverse() : e.range = rS(e), e.scale.range(e.range);
	}
	tS(e);
}
function tS(e) {
	e.round === void 0 && fS(e) && nS(e) <= 30 && e.scale.round(!0);
}
function nS({ scale: e }) {
	let t = e.domain().length, [n, r] = e.range(), i = e.paddingInner ? e.paddingInner() : 1, a = e.paddingOuter ? e.paddingOuter() : e.padding(), o = t - i, s = Math.abs(r - n) / Math.max(1, o + a * 2);
	return (s - Math.floor(s)) * o;
}
function rS(e) {
	let t = e.scale.domain().length + dS(e);
	if (!(t > 2)) return e.range;
	let [n, r] = e.range;
	return Array.from({ length: t }, (e, i) => n + i / (t - 1) * (r - n));
}
function iS(e, t = [], n = {}) {
	let r = cS(e, t, n);
	if (n.type === void 0 && n.domain === void 0 && n.range === void 0 && n.interval == null && e !== "fx" && e !== "fy" && uS({ type: r })) {
		let n = t.map(({ value: e }) => e).filter((e) => e !== void 0);
		n.some(ay) ? xx(`Warning: some data associated with the ${e} scale are dates. Dates are typically associated with a "utc" or "time" scale rather than a "${aS(r)}" scale. If you are using a bar mark, you probably want a rect mark with the interval option instead; if you are using a group transform, you probably want a bin transform instead. If you want to treat this data as ordinal, you can specify the interval of the ${e} scale (e.g., d3.utcDay), or you can suppress this warning by setting the type of the ${e} scale to "${aS(r)}".`) : n.some(oy) ? xx(`Warning: some data associated with the ${e} scale are strings that appear to be dates (e.g., YYYY-MM-DD). If these strings represent dates, you should parse them to Date objects. Dates are typically associated with a "utc" or "time" scale rather than a "${aS(r)}" scale. If you are using a bar mark, you probably want a rect mark with the interval option instead; if you are using a group transform, you probably want a bin transform instead. If you want to treat this data as ordinal, you can suppress this warning by setting the type of the ${e} scale to "${aS(r)}".`) : n.some(sy) && xx(`Warning: some data associated with the ${e} scale are strings that appear to be numbers. If these strings represent numbers, you should parse or coerce them to numbers. Numbers are typically associated with a "linear" scale rather than a "${aS(r)}" scale. If you want to treat this data as ordinal, you can specify the interval of the ${e} scale (e.g., 1 for integers), or you can suppress this warning by setting the type of the ${e} scale to "${aS(r)}".`);
	}
	switch (n.type = r, r) {
		case "diverging":
		case "diverging-sqrt":
		case "diverging-pow":
		case "diverging-log":
		case "diverging-symlog":
		case "cyclical":
		case "sequential":
		case "linear":
		case "sqrt":
		case "threshold":
		case "quantile":
		case "pow":
		case "log":
		case "symlog":
			n = mS(t, n, mv);
			break;
		case "identity":
			switch (J.get(e)) {
				case Ty:
					n = mS(t, n, mv);
					break;
				case Ay: n = mS(t, n, hS);
			}
			break;
		case "utc":
		case "time": n = mS(t, n, gv);
	}
	switch (r) {
		case "diverging": return Cx(e, t, n);
		case "diverging-sqrt": return wx(e, t, n);
		case "diverging-pow": return Tx(e, t, n);
		case "diverging-log": return Ex(e, t, n);
		case "diverging-symlog": return Dx(e, t, n);
		case "categorical":
		case "ordinal":
		case Ix: return Rx(e, t, n);
		case "cyclical":
		case "sequential":
		case "linear": return ex(e, t, n);
		case "sqrt": return tx(e, t, n);
		case "threshold": return sx(e, t, n);
		case "quantile": return ax(e, t, n);
		case "quantize": return ox(e, t, n);
		case "pow": return nx(e, t, n);
		case "log": return rx(e, t, n);
		case "symlog": return ix(e, t, n);
		case "utc": return Fx(e, t, n);
		case "time": return Px(e, t, n);
		case "point": return zx(e, t, n);
		case "band": return Bx(e, t, n);
		case "identity": return lx(e);
		case void 0: return;
		default: throw Error(`unknown scale type: ${r}`);
	}
}
function aS(e) {
	return typeof e == "symbol" ? e.description : e;
}
function oS(e) {
	return typeof e == "string" ? `${e}`.toLowerCase() : e;
}
var sS = { toString: () => "projection" };
function cS(e, t, { type: n, domain: r, range: i, scheme: a, pivot: o, projection: s }) {
	if (n = oS(n), e === "fx" || e === "fy") return "band";
	(e === "x" || e === "y") && s != null && (n = sS);
	for (let e of t) {
		let t = oS(e.type);
		if (t !== void 0) {
			if (n === void 0) n = t;
			else if (n !== t) throw Error(`scale incompatible with channel: ${n} !== ${t}`);
		}
	}
	if (n === sS) return;
	if (n !== void 0) return n;
	if (r === void 0 && !t.some(({ value: e }) => e !== void 0)) return;
	let c = J.get(e);
	if (c === Dy) return "sqrt";
	if (c === ky || c === Oy) return "linear";
	if (c === Ay) return "ordinal";
	let l = (r ?? i)?.length;
	if (l < 2 || l > 2) return lS(c);
	if (r !== void 0) {
		if (iy(r)) return lS(c);
		if (ay(r)) return "utc";
	} else {
		let e = t.map(({ value: e }) => e).filter((e) => e !== void 0);
		if (e.some(iy)) return lS(c);
		if (e.some(ay)) return "utc";
	}
	if (c === Ey) {
		if (o != null || Kb(a)) return "diverging";
		if (Pb(a)) return "categorical";
	}
	return "linear";
}
function lS(e) {
	switch (e) {
		case Ty: return "point";
		case Ey: return Ix;
		default: return "ordinal";
	}
}
function uS({ type: e }) {
	return e === "ordinal" || e === "point" || e === "band" || e === Ix;
}
function dS({ type: e }) {
	return e === "threshold";
}
function fS({ type: e }) {
	return e === "point" || e === "band";
}
function pS(e) {
	if (e === void 0) return !0;
	let t = e.domain(), n = e(t[0]);
	for (let r = 1, i = t.length; r < i; ++r) if (e(t[r]) - n) return !1;
	return !0;
}
function mS(e, { domain: t, ...n }, r) {
	for (let n of e) n.value !== void 0 && (t === void 0 && (t = n.value?.domain), n.value = r(n.value));
	return {
		domain: t === void 0 ? t : r(t),
		...n
	};
}
function hS(e) {
	return q(e, Ry);
}
function gS(e) {
	return (t) => {
		if (!J.has(t = `${t}`)) throw Error(`unknown scale: ${t}`);
		return e[t];
	};
}
function _S({ scale: e, type: t, domain: n, range: r, interpolate: i, interval: a, transform: o, percent: s, pivot: c }) {
	if (t === "identity") return {
		type: "identity",
		apply: (e) => e,
		invert: (e) => e
	};
	let l = e.unknown ? e.unknown() : void 0;
	return {
		type: t,
		domain: Tv(n),
		...r !== void 0 && { range: Tv(r) },
		...o !== void 0 && { transform: o },
		...s && { percent: s },
		...l !== void 0 && { unknown: l },
		...a !== void 0 && { interval: a },
		...i !== void 0 && { interpolate: i },
		...e.clamp && { clamp: e.clamp() },
		...c !== void 0 && {
			pivot: c,
			symmetric: !1
		},
		...e.base && { base: e.base() },
		...e.exponent && { exponent: e.exponent() },
		...e.constant && { constant: e.constant() },
		...e.align && {
			align: e.align(),
			round: e.round()
		},
		...e.padding && (e.paddingInner ? {
			paddingInner: e.paddingInner(),
			paddingOuter: e.paddingOuter()
		} : { padding: e.padding() }),
		...e.bandwidth && {
			bandwidth: e.bandwidth(),
			step: e.step()
		},
		apply: (t) => e(t),
		...e.invert && { invert: (t) => e.invert(t) }
	};
}
//#endregion
//#region node_modules/@observablehq/plot/src/facet.js
function vS(e, t) {
	let { fx: n, fy: r } = Kx(e, t), i = n?.scale.domain(), a = r?.scale.domain();
	return i && a ? p(i, a).map(([e, t], n) => ({
		x: e,
		y: t,
		i: n
	})) : i ? i.map((e, t) => ({
		x: e,
		i: t
	})) : a ? a.map((e, t) => ({
		y: e,
		i: t
	})) : void 0;
}
function yS(e, { x: t, y: n }) {
	return t &&= ES(t), n &&= ES(n), e.filter(t && n ? (e) => t.has(e.x) && n.has(e.y) : t ? (e) => t.has(e.x) : (e) => n.has(e.y)).sort(t && n ? (e, r) => t.get(e.x) - t.get(r.x) || n.get(e.y) - n.get(r.y) : t ? (e, n) => t.get(e.x) - t.get(n.x) : (e, t) => n.get(e.y) - n.get(t.y));
}
function bS(e, { fx: t, fy: n }) {
	let r = Lv(e), i = t?.value, a = n?.value;
	return t && n ? D(r, (e) => (e.fx = i[e[0]], e.fy = a[e[0]], e), (e) => i[e], (e) => a[e]) : t ? D(r, (e) => (e.fx = i[e[0]], e), (e) => i[e]) : D(r, (e) => (e.fy = a[e[0]], e), (e) => a[e]);
}
function xS(e, t, { marginTop: n, marginLeft: r }) {
	let i = e ? ({ x: t }) => e(t) - r : () => 0, a = t ? ({ y: e }) => t(e) - n : () => 0;
	return function(e) {
		this.tagName === "svg" ? (this.setAttribute("x", i(e)), this.setAttribute("y", a(e))) : this.setAttribute("transform", `translate(${i(e)},${a(e)})`);
	};
}
function SS(e) {
	let t = [], n = new Uint32Array(Ae(e, (e) => e.length));
	for (let r of e) {
		let i = 0;
		for (let t of e) r !== t && (n.set(t, i), i += t.length);
		t.push(n.slice(0, i));
	}
	return t;
}
var CS = /* @__PURE__ */ new Map([
	["top", AS],
	["right", NS],
	["bottom", jS],
	["left", MS],
	["top-left", zS(AS, MS)],
	["top-right", zS(AS, NS)],
	["bottom-left", zS(jS, MS)],
	["bottom-right", zS(jS, NS)],
	["top-empty", PS],
	["right-empty", LS],
	["bottom-empty", FS],
	["left-empty", IS],
	["empty", RS]
]);
function wS(e) {
	if (e == null) return null;
	let t = CS.get(`${e}`.toLowerCase());
	if (t) return t;
	throw Error(`invalid facet anchor: ${e}`);
}
var TS = /* @__PURE__ */ new WeakMap();
function ES(e) {
	let t = TS.get(e);
	return t || TS.set(e, t = new y(q(e, (e, t) => [e, t]))), t;
}
function DS(e, t) {
	return ES(e).get(t);
}
function OS(e, t, n) {
	return t = Bv(t), n = Bv(n), e.find((e) => Object.is(Bv(e.x), t) && Object.is(Bv(e.y), n));
}
function kS(e, t, n) {
	return OS(e, t, n)?.empty;
}
function AS(e, { y: t }, { y: n }) {
	return !t || DS(t, n) === 0;
}
function jS(e, { y: t }, { y: n }) {
	return !t || DS(t, n) === t.length - 1;
}
function MS(e, { x: t }, { x: n }) {
	return !t || DS(t, n) === 0;
}
function NS(e, { x: t }, { x: n }) {
	return !t || DS(t, n) === t.length - 1;
}
function PS(e, { y: t }, { x: n, y: r, empty: i }) {
	if (i) return !1;
	if (!t) return;
	let a = DS(t, r);
	if (a > 0) return kS(e, n, t[a - 1]);
}
function FS(e, { y: t }, { x: n, y: r, empty: i }) {
	if (i) return !1;
	if (!t) return;
	let a = DS(t, r);
	if (a < t.length - 1) return kS(e, n, t[a + 1]);
}
function IS(e, { x: t }, { x: n, y: r, empty: i }) {
	if (i) return !1;
	if (!t) return;
	let a = DS(t, n);
	if (a > 0) return kS(e, t[a - 1], r);
}
function LS(e, { x: t }, { x: n, y: r, empty: i }) {
	if (i) return !1;
	if (!t) return;
	let a = DS(t, n);
	if (a < t.length - 1) return kS(e, t[a + 1], r);
}
function RS(e, t, { empty: n }) {
	return n;
}
function zS(e, t) {
	return function() {
		return e.apply(null, arguments) && t.apply(null, arguments);
	};
}
function BS(e, { channels: { fx: t, fy: n }, groups: r }) {
	return t && n ? e.map(({ x: e, y: t }) => r.get(e)?.get(t) ?? []) : t ? e.map(({ x: e }) => r.get(e) ?? []) : e.map(({ y: e }) => r.get(e) ?? []);
}
//#endregion
//#region node_modules/@observablehq/plot/src/projection.js
var VS = Math.PI, HS = 2 * VS, US = .618;
function WS({ projection: e, inset: t = 0, insetTop: n = t, insetRight: r = t, insetBottom: i = t, insetLeft: a = t } = {}, o) {
	if (e == null) return;
	if (typeof e.stream == "function") return e;
	let s, c, l = "frame";
	if (kv(e)) {
		let t;
		if ({type: e, domain: c, inset: t, insetTop: n = t === void 0 ? n : t, insetRight: r = t === void 0 ? r : t, insetBottom: i = t === void 0 ? i : t, insetLeft: a = t === void 0 ? a : t, clip: l = l, ...s} = e, e == null) return;
	}
	typeof e != "function" && ({type: e} = GS(e));
	let { width: u, height: d, marginLeft: f, marginRight: p, marginTop: m, marginBottom: h } = o, g = u - f - p - a - r, _ = d - m - h - n - i;
	if (e = e?.({
		width: g,
		height: _,
		clip: l,
		...s
	}), e == null) return;
	l = KS(l, f, m, u - p, d - h);
	let v = f + a, y = m + n, b;
	if (c != null) {
		let [[t, n], [r, i]] = jl(e).bounds(c), a = Math.min(g / (r - t), _ / (i - n));
		a > 0 ? (v -= (a * (t + r) - g) / 2, y -= (a * (n + i) - _) / 2, b = Ml({ point(e, t) {
			this.stream.point(e * a + v, t * a + y);
		} })) : xx("Warning: the projection could not be fit to the specified domain; using the default scale.");
	}
	return b ??= v === 0 && y === 0 ? YS() : Ml({ point(e, t) {
		this.stream.point(e + v, t + y);
	} }), { stream: (t) => e.stream(b.stream(l(t))) };
}
function GS(e) {
	switch (`${e}`.toLowerCase()) {
		case "albers-usa": return qS(ru, .7463, .4673);
		case "albers": return JS(tu, .7463, .4673);
		case "azimuthal-equal-area": return qS(su, 4, 4);
		case "azimuthal-equidistant": return qS(lu, HS, HS);
		case "conic-conformal": return JS(hu, HS, HS);
		case "conic-equal-area": return JS(eu, 6.1702, 2.9781);
		case "conic-equidistant": return JS(yu, 7.312, 3.6282);
		case "equal-earth": return qS(Du, 5.4133, 2.6347);
		case "equirectangular": return qS(_u, HS, VS);
		case "gnomonic": return qS(ku, 3.4641, 3.4641);
		case "identity": return { type: YS };
		case "reflect-y": return { type: XS };
		case "mercator": return qS(du, HS, HS);
		case "orthographic": return qS(ju, 2, 2);
		case "stereographic": return qS(Nu, 2, 2);
		case "transverse-mercator": return qS(Fu, HS, HS);
		default: throw Error(`unknown projection type: ${e}`);
	}
}
function KS(e, t, n, r, i) {
	if (e === !1 || e == null || typeof e == "number") return (e) => e;
	switch (e === !0 && (e = "frame"), `${e}`.toLowerCase()) {
		case "frame": return Ec(t, n, r, i);
		default: throw Error(`unknown projection clip type: ${e}`);
	}
}
function qS(e, t, n) {
	return {
		type: ({ width: r, height: i, rotate: a, precision: o = .15, clip: s }) => {
			let c = e();
			return o != null && c.precision?.(o), a != null && c.rotate?.(a), typeof s == "number" && c.clipAngle?.(s), r != null && (c.scale(Math.min(r / t, i / n)), c.translate([r / 2, i / 2])), c;
		},
		aspectRatio: n / t
	};
}
function JS(e, t, n) {
	let { type: r, aspectRatio: i } = qS(e, t, n);
	return {
		type: (e) => {
			let { parallels: t, domain: n, width: i, height: a } = e, o = r(e);
			return t != null && (o.parallels(t), n === void 0 && i != null && o.fitSize([i, a], { type: "Sphere" })), o;
		},
		aspectRatio: i
	};
}
var YS = fv({ stream: (e) => e }), XS = fv(Ml({ point(e, t) {
	this.stream.point(e, -t);
} }));
function ZS(e, t, n, r) {
	let i = n[e], a = n[t], o = i.length, s = n[e] = new Float64Array(o).fill(NaN), c = n[t] = new Float64Array(o).fill(NaN), l, u = r.stream({ point(e, t) {
		s[l] = e, c[l] = t;
	} });
	for (l = 0; l < o; ++l) u.point(i[l], a[l]);
}
function QS({ projection: e } = {}) {
	return e == null ? !1 : typeof e.stream == "function" || (kv(e) && (e = e.type), e != null);
}
function $S(e) {
	if (typeof e?.stream == "function") return US;
	if (kv(e)) {
		let t, n;
		if ({domain: t, type: e, ...n} = e, t != null && e != null) {
			let [[r, i], [a, o]] = jl((typeof e == "string" ? GS(e).type : e)({
				...n,
				width: 100,
				height: 100
			})).bounds(t), s = (o - i) / (a - r);
			return s && isFinite(s) ? s < .2 ? .2 : s > 5 ? 5 : s : US;
		}
	}
	if (e != null) {
		if (typeof e != "function") {
			let { aspectRatio: t } = GS(e);
			if (t) return t;
		}
		return US;
	}
}
function eC(e) {
	let t = [], n = [], r = {
		scale: "x",
		value: t
	}, i = {
		scale: "y",
		value: n
	}, a = {
		point(e, r) {
			t.push(e), n.push(r);
		},
		lineStart() {},
		lineEnd() {},
		polygonStart() {},
		polygonEnd() {},
		sphere() {}
	};
	for (let t of e.value) Gs(t, a);
	return [r, i];
}
function tC({ x: e, y: t }) {
	if (e || t) return e ??= (e) => e, t ??= (e) => e, Ml({ point(n, r) {
		this.stream.point(e(n), t(r));
	} });
}
//#endregion
//#region node_modules/@observablehq/plot/src/context.js
function nC(e = {}) {
	let { document: t = typeof window < "u" ? window.document : void 0, clip: n } = e;
	return {
		document: t,
		clip: xy(n)
	};
}
function X(e, { document: t }) {
	return Zn(tt(e).call(t.documentElement));
}
//#endregion
//#region node_modules/@observablehq/plot/src/memoize.js
var rC = Symbol("unset");
function iC(e) {
	return (e.length === 1 ? aC : oC)(e);
}
function aC(e) {
	let t, n = rC;
	return (r) => (Object.is(n, r) || (n = r, t = e(r)), t);
}
function oC(e) {
	let t, n;
	return (...r) => ((n?.length !== r.length || n.some((e, t) => !Object.is(e, r[t]))) && (n = r, t = e(...r)), t);
}
//#endregion
//#region node_modules/@observablehq/plot/src/format.js
var sC = iC((e) => new Intl.NumberFormat(e));
iC((e, t) => new Intl.DateTimeFormat(e, {
	timeZone: "UTC",
	...t && { month: t }
})), iC((e, t) => new Intl.DateTimeFormat(e, {
	timeZone: "UTC",
	...t && { weekday: t }
}));
function cC(e = "en-US") {
	let t = sC(e);
	return (e) => e != null && !isNaN(e) ? t.format(e) : void 0;
}
function lC(e) {
	return d_(e, "Invalid Date");
}
function uC(e = "en-US") {
	let t = cC(e);
	return (e) => (e instanceof Date ? lC : typeof e == "number" ? t : cv)(e);
}
var dC = uC(), fC = (typeof window < "u" ? window.devicePixelRatio > 1 : typeof it > "u") ? 0 : .5, pC = 0;
function mC() {
	return `plot-clip-${++pC}`;
}
function hC(e, { title: t, href: n, ariaLabel: r, ariaDescription: i, ariaHidden: a, target: o, fill: s, fillOpacity: c, stroke: l, strokeWidth: u, strokeOpacity: d, strokeLinejoin: f, strokeLinecap: p, strokeMiterlimit: m, strokeDasharray: h, strokeDashoffset: g, opacity: _, mixBlendMode: v, imageFilter: y, paintOrder: b, pointerEvents: x, shapeRendering: S, channels: C }, { ariaLabel: w, fill: T = "currentColor", fillOpacity: E, stroke: D = "none", strokeOpacity: O, strokeWidth: k, strokeLinecap: A, strokeLinejoin: j, strokeMiterlimit: ee, paintOrder: te }) {
	T === null && (s = null, c = null), D === null && (l = null, d = null), py(T) ? !py(D) && (!py(s) || C?.fill) && (D = "none") : py(D) && (!py(l) || C?.stroke) && (T = "none");
	let [ne, re] = vv(s, T), [ie, ae] = yv(c, E), [oe, se] = vv(l, D), [ce, le] = yv(d, O), [ue, de] = yv(_);
	my(se) || (u === void 0 && (u = k), p === void 0 && (p = A), f === void 0 && (f = j), m === void 0 && !hy(f) && (m = ee), !my(re) && b === void 0 && (b = te));
	let [fe, pe] = yv(u);
	return T !== null && (e.fill = Q(re, "currentColor"), e.fillOpacity = IC(ae, 1)), D !== null && (e.stroke = Q(se, "none"), e.strokeWidth = IC(pe, 1), e.strokeOpacity = IC(le, 1), e.strokeLinejoin = Q(f, "miter"), e.strokeLinecap = Q(p, "butt"), e.strokeMiterlimit = IC(m, 4), e.strokeDasharray = Q(h, "none"), e.strokeDashoffset = Q(g, "0")), e.target = cv(o), e.ariaLabel = cv(w), e.ariaDescription = cv(i), e.ariaHidden = cv(a), e.opacity = IC(de, 1), e.mixBlendMode = Q(v, "normal"), e.imageFilter = Q(y, "none"), e.paintOrder = Q(b, "normal"), e.pointerEvents = Q(x, "auto"), e.shapeRendering = Q(S, "auto"), {
		title: {
			value: t,
			optional: !0,
			filter: null
		},
		href: {
			value: n,
			optional: !0,
			filter: null
		},
		ariaLabel: {
			value: r,
			optional: !0,
			filter: null
		},
		fill: {
			value: ne,
			scale: "auto",
			optional: !0
		},
		fillOpacity: {
			value: ie,
			scale: "auto",
			optional: !0
		},
		stroke: {
			value: oe,
			scale: "auto",
			optional: !0
		},
		strokeOpacity: {
			value: ce,
			scale: "auto",
			optional: !0
		},
		strokeWidth: {
			value: fe,
			optional: !0
		},
		opacity: {
			value: ue,
			scale: "auto",
			optional: !0
		}
	};
}
function gC(e, t) {
	t && e.filter((e) => s_(t[e])).append("title").call(vC, t);
}
function _C(e, t) {
	t && e.filter(([e]) => s_(t[e])).append("title").call(yC, t);
}
function vC(e, t) {
	t && e.text((e) => dC(t[e]));
}
function yC(e, t) {
	t && e.text(([e]) => dC(t[e]));
}
function bC(e, { target: t, tip: n }, { ariaLabel: r, title: i, fill: a, fillOpacity: o, stroke: s, strokeOpacity: c, strokeWidth: l, opacity: u, href: d }) {
	r && Z(e, "aria-label", (e) => r[e]), a && Z(e, "fill", (e) => a[e]), o && Z(e, "fill-opacity", (e) => o[e]), s && Z(e, "stroke", (e) => s[e]), c && Z(e, "stroke-opacity", (e) => c[e]), l && Z(e, "stroke-width", (e) => l[e]), u && Z(e, "opacity", (e) => u[e]), d && NC(e, (e) => d[e], t), n || gC(e, i);
}
function xC(e, { target: t, tip: n }, { ariaLabel: r, title: i, fill: a, fillOpacity: o, stroke: s, strokeOpacity: c, strokeWidth: l, opacity: u, href: d }) {
	r && Z(e, "aria-label", ([e]) => r[e]), a && Z(e, "fill", ([e]) => a[e]), o && Z(e, "fill-opacity", ([e]) => o[e]), s && Z(e, "stroke", ([e]) => s[e]), c && Z(e, "stroke-opacity", ([e]) => c[e]), l && Z(e, "stroke-width", ([e]) => l[e]), u && Z(e, "opacity", ([e]) => u[e]), d && NC(e, ([e]) => d[e], t), n || _C(e, i);
}
function SC({ ariaLabel: e, title: t, fill: n, fillOpacity: r, stroke: i, strokeOpacity: a, strokeWidth: o, opacity: s, href: c }, { tip: l }) {
	return [
		e,
		l ? void 0 : t,
		n,
		r,
		i,
		a,
		o,
		s,
		c
	].filter((e) => e !== void 0);
}
function CC(e, t, n) {
	let r = E(e, (e) => t[e]);
	return n === void 0 && r.size > 1 + e.length >> 1 && xx("Warning: the implicit z channel has high cardinality. This may occur when the fill or stroke channel is associated with quantitative data rather than ordinal or categorical data. You can suppress this warning by setting the z option explicitly; if this data represents a single series, set z to null."), r.values();
}
function* wC(e, t, n, r) {
	let { z: i } = n, { z: a } = r, o = SC(r, n), s = [...t, ...o];
	for (let t of a ? CC(e, a, i) : [e]) {
		let e, n;
		out: for (let r of t) {
			for (let e of s) if (!i_(e[r])) {
				n && n.push(-1);
				continue out;
			}
			if (e === void 0) {
				n && (yield n), e = o.map((e) => Bv(e[r])), n = [r];
				continue;
			}
			n.push(r);
			for (let t = 0; t < o.length; ++t) if (Bv(o[t][r]) !== e[t]) {
				yield n, e = o.map((e) => Bv(e[r])), n = [r];
				continue out;
			}
		}
		n && (yield n);
	}
}
function TC(e, t, n, r) {
	let i, { clip: a = r.clip } = t;
	a === "frame" ? (e = X("svg:g", r).each(function() {
		this.appendChild(e.node()), e.node = () => this;
	}), i = DC(r, n)) : a && (i = AC(a, r)), Z(e, "aria-label", t.ariaLabel), Z(e, "aria-description", t.ariaDescription), Z(e, "aria-hidden", t.ariaHidden), Z(e, "clip-path", i);
}
function EC(e) {
	let t = /* @__PURE__ */ new WeakMap();
	return (n, r) => {
		let i = t.get(n);
		if (!i) {
			let a = mC();
			Zn(n.ownerSVGElement).append("clipPath").attr("id", a).call(e, n, r), t.set(n, i = `url(#${a})`);
		}
		return i;
	};
}
var DC = EC((e, t, n) => {
	let { width: r, height: i, marginLeft: a, marginRight: o, marginTop: s, marginBottom: c } = n;
	e.append("rect").attr("x", a).attr("y", s).attr("width", r - o - a).attr("height", i - s - c);
}), OC = /* @__PURE__ */ new WeakMap(), kC = { type: "Sphere" };
function AC(e, t) {
	let n, r;
	if ((n = OC.get(t)) || OC.set(t, n = /* @__PURE__ */ new WeakMap()), e.type === "Sphere" && (e = kC), !(r = n.get(e))) {
		let i = mC();
		Zn(t.ownerSVGElement).append("clipPath").attr("id", i).append("path").attr("d", t.path()(e)), n.set(e, r = `url(#${i})`);
	}
	return r;
}
function jC(e, t, n, r) {
	TC(e, t, n, r), Z(e, "class", t.className), Z(e, "fill", t.fill), Z(e, "fill-opacity", t.fillOpacity), Z(e, "stroke", t.stroke), Z(e, "stroke-width", t.strokeWidth), Z(e, "stroke-opacity", t.strokeOpacity), Z(e, "stroke-linejoin", t.strokeLinejoin), Z(e, "stroke-linecap", t.strokeLinecap), Z(e, "stroke-miterlimit", t.strokeMiterlimit), Z(e, "stroke-dasharray", t.strokeDasharray), Z(e, "stroke-dashoffset", t.strokeDashoffset), Z(e, "shape-rendering", t.shapeRendering), Z(e, "filter", t.imageFilter), Z(e, "paint-order", t.paintOrder);
	let { pointerEvents: i = r.pointerSticky === !1 ? "none" : void 0 } = t;
	Z(e, "pointer-events", i);
}
function MC(e, t) {
	PC(e, "mix-blend-mode", t.mixBlendMode), Z(e, "opacity", t.opacity);
}
function NC(e, t, n) {
	e.each(function(e) {
		let r = t(e);
		if (r != null) {
			let e = this.ownerDocument.createElementNS(Ze.svg, "a");
			e.setAttribute("fill", "inherit"), e.setAttributeNS(Ze.xlink, "href", r), n != null && e.setAttribute("target", n), this.parentNode.insertBefore(e, this).appendChild(this);
		}
	});
}
function Z(e, t, n) {
	n != null && e.attr(t, n);
}
function PC(e, t, n) {
	n != null && e.style(t, n);
}
function FC(e, t, { x: n, y: r }, i = fC, a = fC) {
	i += t.dx, a += t.dy, n?.bandwidth && (i += n.bandwidth() / 2), r?.bandwidth && (a += r.bandwidth() / 2), (i || a) && e.attr("transform", `translate(${i},${a})`);
}
function Q(e, t) {
	if ((e = cv(e)) !== t) return e;
}
function IC(e, t) {
	if ((e = lv(e)) !== t) return e;
}
var LC = /^-?([_a-z]|[\240-\377]|\\[0-9a-f]{1,6}(\r\n|[ \t\r\n\f])?|\\[^\r\n\f0-9a-f])([_a-z0-9-]|[\240-\377]|\\[0-9a-f]{1,6}(\r\n|[ \t\r\n\f])?|\\[^\r\n\f0-9a-f])*$/i;
function RC(e) {
	if (e === void 0) return "plot-d6a7b5";
	if (e = `${e}`, !LC.test(e)) throw Error(`invalid class name: ${e}`);
	return e;
}
function zC(e, t) {
	if (typeof t == "string") e.property("style", t);
	else if (t != null) for (let n of e) Object.assign(n.style, t);
}
function BC({ frameAnchor: e }, { width: t, height: n, marginTop: r, marginRight: i, marginBottom: a, marginLeft: o }) {
	return [/left$/.test(e) ? o : /right$/.test(e) ? t - i : (o + t - i) / 2, /^top/.test(e) ? r : /^bottom/.test(e) ? n - a : (r + n - a) / 2];
}
//#endregion
//#region node_modules/@observablehq/plot/src/mark.js
var VC = class {
	constructor(e, t = {}, n = {}, r) {
		let { facet: i = "auto", facetAnchor: a, fx: o, fy: s, sort: c, dx: l = 0, dy: u = 0, margin: d = 0, marginTop: f = d, marginRight: p = d, marginBottom: m = d, marginLeft: h = d, className: g, clip: _ = r?.clip, channels: v, tip: y, render: b } = n;
		if (this.data = e, this.sort = Mv(c) ? c : null, this.initializer = Vy(n).initializer, this.transform = this.initializer ? n.transform : By(n).transform, i === null || i === !1 ? this.facet = null : (this.facet = xv(i === !0 ? "include" : i, "facet", [
			"auto",
			"include",
			"exclude",
			"super"
		]), this.fx = e === nv && typeof o == "string" ? [o] : o, this.fy = e === nv && typeof s == "string" ? [s] : s), this.facetAnchor = wS(a), t = by(t), v !== void 0 && (t = {
			...WC(v),
			...t
		}), r !== void 0 && (t = {
			...hC(this, n, r),
			...t
		}), this.channels = Object.fromEntries(Object.entries(t).map(([t, n]) => {
			if (jv(n.value)) {
				let { value: e, label: t = n.label, scale: r = n.scale } = n.value;
				n = {
					...n,
					label: t,
					scale: r,
					value: e
				};
			}
			if (e === nv && typeof n.value == "string") {
				let { value: e } = n;
				n = {
					...n,
					value: [e]
				};
			}
			return [t, n];
		}).filter(([e, { value: t, optional: n }]) => {
			if (t != null) return !0;
			if (n) return !1;
			throw Error(`missing channel value: ${e}`);
		})), this.dx = +l, this.dy = +u, this.marginTop = +f, this.marginRight = +p, this.marginBottom = +m, this.marginLeft = +h, this.clip = xy(_), this.tip = GC(y), this.className = cv(g), this.facet === "super") {
			if (o || s) throw Error("super-faceting cannot use fx or fy");
			for (let e in this.channels) {
				let { scale: n } = t[e];
				if (n === "x" || n === "y") throw Error("super-faceting cannot use x or y");
			}
		}
		b != null && (this.render = UC(b, this.render));
	}
	initialize(e, t, n) {
		let r = Sv(this.data);
		e === void 0 && r != null && (e = [Lv(r)]);
		let i = e;
		this.transform != null && ({facets: e, data: r} = this.transform(r, e, n), r = Sv(r)), e !== void 0 && (e.original = i);
		let a = xb(this.channels, r);
		return this.sort != null && wb(r, e, a, t, this.sort), {
			data: r,
			facets: e,
			channels: a
		};
	}
	filter(e, t, n) {
		for (let r in t) {
			let { filter: i = i_ } = t[r];
			if (i !== null) {
				let t = n[r];
				e = e.filter((e) => i(t[e]));
			}
		}
		return e;
	}
	project(e, t, n) {
		for (let r in e) if (e[r].scale === "x" && /^x|x$/.test(r)) {
			let i = r.replace(/^x|x$/, "y");
			i in e && e[i].scale === "y" && ZS(r, i, t, n.projection);
		}
	}
	scale(e, t, n) {
		let r = Sb(e, t);
		return n.projection && this.project(e, r, n), r;
	}
};
function HC(...e) {
	return e.plot = VC.prototype.plot, e;
}
function UC(e, t) {
	if (e == null) return t === null ? void 0 : t;
	if (t == null) return e === null ? void 0 : e;
	if (typeof e != "function") throw TypeError(`invalid render transform: ${e}`);
	if (typeof t != "function") throw TypeError(`invalid render transform: ${t}`);
	return function(n, r, i, a, o, s) {
		return e.call(this, n, r, i, a, o, (e, n, r, i, a) => t.call(this, e, n, r, i, a, s));
	};
}
function WC(e) {
	return Object.fromEntries(Object.entries(by(e)).map(([e, t]) => (t = typeof t == "string" ? {
		value: t,
		label: e
	} : ey(t), t.filter === void 0 && t.scale == null && (t = {
		...t,
		filter: null
	}), [e, t])));
}
function GC(e) {
	return e === !0 ? "xy" : e === !1 || e == null ? null : typeof e == "string" ? xv(e, "tip", [
		"x",
		"y",
		"xy"
	]) : e;
}
function KC(e, t) {
	return e?.tip === !0 ? {
		...e,
		tip: t
	} : kv(e?.tip) && e.tip.pointer === void 0 ? {
		...e,
		tip: {
			...e.tip,
			pointer: t
		}
	} : e;
}
//#endregion
//#region node_modules/@observablehq/plot/src/dimensions.js
function qC(e, t, n = {}) {
	let r = .5 - fC, i = .5 + fC, a = .5 + fC, o = .5 - fC;
	for (let { marginTop: e, marginRight: n, marginBottom: s, marginLeft: c } of t) e > r && (r = e), n > i && (i = n), s > a && (a = s), c > o && (o = c);
	let { margin: s, marginTop: c = s === void 0 ? r : s, marginRight: l = s === void 0 ? i : s, marginBottom: u = s === void 0 ? a : s, marginLeft: d = s === void 0 ? o : s } = n;
	c = +c, l = +l, u = +u, d = +d;
	let { width: f = 640, height: p = JC(e, n, {
		width: f,
		marginTopDefault: r,
		marginRightDefault: i,
		marginBottomDefault: a,
		marginLeftDefault: o
	}) + Math.max(0, c - r + u - a) } = n;
	f = +f, p = +p;
	let m = {
		width: f,
		height: p,
		marginTop: c,
		marginRight: l,
		marginBottom: u,
		marginLeft: d
	};
	if (e.fx || e.fy) {
		let { margin: e, marginTop: t = e === void 0 ? c : e, marginRight: r = e === void 0 ? l : e, marginBottom: i = e === void 0 ? u : e, marginLeft: a = e === void 0 ? d : e } = n.facet ?? {};
		t = +t, r = +r, i = +i, a = +a, m.facet = {
			marginTop: t,
			marginRight: r,
			marginBottom: i,
			marginLeft: a
		};
	}
	return m;
}
function JC({ x: e, y: t, fy: n, fx: r }, { projection: i, aspectRatio: a }, { width: o, marginTopDefault: s, marginRightDefault: c, marginBottomDefault: l, marginLeftDefault: u }) {
	let d = n && n.scale.domain().length || 1, f = $S(i);
	if (f) {
		let e = r ? r.scale.domain().length : 1, t = (1.1 * d - .1) / (1.1 * e - .1) * f, n = Math.max(.1, Math.min(10, t));
		return Math.round((o - u - c) * n + s + l);
	}
	let p = t ? uS(t) ? t.scale.domain().length || 1 : Math.max(7, 17 / d) : 1;
	if (a != null) {
		if (a = +a, !(isFinite(a) && a > 0)) throw Error(`invalid aspectRatio: ${a}`);
		let i = YC("y", t) / (YC("x", e) * a), d = r ? r.scale.bandwidth() : 1, f = n ? n.scale.bandwidth() : 1;
		return (i * (d * (o - u - c) - e.insetLeft - e.insetRight) + t.insetTop + t.insetBottom) / f + s + l;
	}
	return !!(t || n) * Math.max(1, Math.min(60, p * d)) * 20 + !!r * 30 + 60;
}
function YC(e, t) {
	if (!t) throw Error(`aspectRatio requires ${e} scale`);
	let { type: n, domain: r } = t, i;
	switch (n) {
		case "linear":
		case "utc":
		case "time":
			i = Number;
			break;
		case "pow": {
			let e = t.scale.exponent();
			i = (t) => t ** +e;
			break;
		}
		case "log":
			i = Math.log;
			break;
		case "point":
		case "band": return r.length;
		default: throw Error(`unsupported ${e} scale for aspectRatio: ${n}`);
	}
	let [a, o] = _(r);
	return Math.abs(i(o) - i(a));
}
//#endregion
//#region node_modules/@observablehq/plot/src/interactions/pointer.js
var XC = /* @__PURE__ */ new WeakMap();
function ZC(e, t, { x: n, y: r, px: i, py: a, maxRadius: o = 40, channels: s, render: c, ...l } = {}) {
	return o = +o, i != null && (n ??= null, s = {
		...s,
		px: {
			value: i,
			scale: "x"
		}
	}), a != null && (r ??= null, s = {
		...s,
		py: {
			value: a,
			scale: "y"
		}
	}), {
		x: n,
		y: r,
		channels: s,
		...l,
		render: UC(function(n, r, i, a, s, c) {
			s = {
				...s,
				pointerSticky: !1
			};
			let l = s.ownerSVGElement, { data: u } = s.getMarkState(this), d = XC.get(l);
			d || XC.set(l, d = {
				sticky: !1,
				roots: [],
				renders: []
			});
			let f = d.renders.push(ee) - 1, { x: p, y: m, fx: h, fy: g } = r, _ = h ? h(n.fx) - a.marginLeft : 0, v = g ? g(n.fy) - a.marginTop : 0;
			p?.bandwidth && (_ += p.bandwidth() / 2), m?.bandwidth && (v += m.bandwidth() / 2);
			let y = n.fi != null, b;
			if (y) {
				let e = d.facetStates;
				e || (d.facetStates = e = /* @__PURE__ */ new Map()), b = e.get(this), b || e.set(this, b = /* @__PURE__ */ new Map());
			}
			let [x, S] = BC(this, a), { px: C, py: w } = i, T = C ? (e) => C[e] : tw(i, x), E = w ? (e) => w[e] : nw(i, S), D, O, k, A;
			function j(e, t) {
				if (y) {
					if (A &&= cancelAnimationFrame(A), e == null) b.delete(n.fi);
					else {
						b.set(n.fi, t), A = requestAnimationFrame(() => {
							A = null;
							for (let [r, i] of b) if (i < t || i === t && r < n.fi) {
								e = null;
								break;
							}
							ee(e);
						});
						return;
					}
				}
				ee(e);
			}
			function ee(e) {
				if (D === e && k === d.sticky) return;
				D = e, k = s.pointerSticky = d.sticky;
				let t = D == null ? [] : [D];
				y && (t.fx = n.fx, t.fy = n.fy, t.fi = n.fi);
				let o = c(t, r, i, a, s);
				if (O) {
					if (y) {
						let e = O.parentNode, t = O.getAttribute("transform"), n = o.getAttribute("transform");
						t ? o.setAttribute("transform", t) : o.removeAttribute("transform"), n ? e.setAttribute("transform", n) : e.removeAttribute("transform"), o.removeAttribute("aria-label"), o.removeAttribute("aria-description"), o.removeAttribute("aria-hidden");
					}
					O.replaceWith(o);
				}
				if (d.roots[f] = O = o, !(D == null && b?.size > 1)) {
					let e = D == null ? null : G_(u) ? u[D] : u.get(D);
					s.dispatchValue(e);
				}
				return o;
			}
			function te(r) {
				if (d.sticky || r.pointerType === "mouse" && r.buttons === 1) return;
				let [i, s] = $n(r);
				i -= _, s -= v;
				let c = i < a.marginLeft || i > a.width - a.marginRight ? 1 : e, l = s < a.marginTop || s > a.height - a.marginBottom ? 1 : t, u = null, f = o * o;
				for (let e of n) {
					let t = c * (T(e) - i), n = l * (E(e) - s), r = t * t + n * n;
					r <= f && (u = e, f = r);
				}
				if (u != null && (e !== 1 || t !== 1)) {
					let e = T(u) - i, t = E(u) - s;
					f = e * e + t * t;
				}
				j(u, f);
			}
			function ne(e) {
				e.pointerType === "mouse" && D != null && (d.sticky && d.roots.some((t) => t?.contains(e.target)) || (d.sticky ? (d.sticky = !1, d.renders.forEach((e) => e(null))) : (d.sticky = !0, ee(D)), e.stopImmediatePropagation()));
			}
			function re(e) {
				e.pointerType === "mouse" && (d.sticky || j(null));
			}
			return l.addEventListener("pointerenter", te), l.addEventListener("pointermove", te), l.addEventListener("pointerdown", ne), l.addEventListener("pointerleave", re), ee(null);
		}, c)
	};
}
function QC(e) {
	return ZC(1, 1, e);
}
function $C(e) {
	return ZC(1, .01, e);
}
function ew(e) {
	return ZC(.01, 1, e);
}
function tw({ x1: e, x2: t, x: n = e }, r) {
	return e && t ? (n) => (e[n] + t[n]) / 2 : n ? (e) => n[e] : () => r;
}
function nw({ y1: e, y2: t, y: n = e }, r) {
	return e && t ? (n) => (e[n] + t[n]) / 2 : n ? (e) => n[e] : () => r;
}
//#endregion
//#region node_modules/@observablehq/plot/src/axes.js
function rw(e) {
	return uS(e) && e.interval === void 0 ? void 0 : "tabular-nums";
}
//#endregion
//#region node_modules/@observablehq/plot/src/legends/ramp.js
function iw(e, t) {
	let { label: n = e.label, tickSize: r = 6, width: i = 240, height: a = 44 + r, marginTop: o = 18, marginRight: s = 0, marginBottom: c = 16 + r, marginLeft: l = 0, style: u, ticks: d = (i - l - s) / 64, tickFormat: f, fontVariant: p = rw(e), round: m = !0, opacity: h, className: g } = t, _ = nC(t);
	g = RC(g), h = yv(h)[1], f === null && (f = () => null);
	let v = X("svg", _).attr("class", `${g}-ramp`).attr("font-family", "system-ui, sans-serif").attr("font-size", 10).attr("width", i).attr("height", a).attr("viewBox", `0 0 ${i} ${a}`).call((e) => e.append("style").text(`:where(.${g}-ramp) {
  display: block;
  height: auto;
  height: intrinsic;
  max-width: 100%;
  overflow: visible;
}
:where(.${g}-ramp text) {
  white-space: pre;
}`)).call(zC, u), y = (e) => e.selectAll(".tick line").attr("y1", o + c - a), b, x = m ? (e, t) => e.rangeRound(t) : (e, t) => e.range(t), { type: S, domain: C, range: w, interpolate: T, scale: E, pivot: D } = e;
	if (T) {
		let e = w === void 0 ? T : na(T.length === 1 ? _x(T) : T, w);
		b = x(E.copy(), ra(ji(l, i - s), Math.min(C.length + (D !== void 0), w === void 0 ? Infinity : w.length)));
		let t = _.document.createElement("canvas");
		t.width = 256, t.height = 1;
		let n = t.getContext("2d");
		for (let t = 0; t < 256; ++t) n.fillStyle = e(t / 255), n.fillRect(t, 0, 1, 1);
		v.append("image").attr("opacity", h).attr("x", l).attr("y", o).attr("width", i - l - s).attr("height", a - o - c).attr("preserveAspectRatio", "none").attr("xlink:href", t.toDataURL());
	} else if (S === "threshold") {
		let e = C, t = f === void 0 ? (e) => e : typeof f == "string" ? bs(f) : f;
		b = x(nd().domain([-1, w.length - 1]), [l, i - s]), v.append("g").attr("fill-opacity", h).selectAll().data(w).enter().append("rect").attr("x", (e, t) => b(t - 1)).attr("y", o).attr("width", (e, t) => b(t) - b(t - 1)).attr("height", a - o - c).attr("fill", (e) => e), d = q(e, (e, t) => t), f = (n) => t(e[n], n);
	} else b = x(Bu().domain(C), [l, i - s]), v.append("g").attr("fill-opacity", h).selectAll().data(C).enter().append("rect").attr("x", b).attr("y", o).attr("width", Math.max(0, b.bandwidth() - 1)).attr("height", a - o - c).attr("fill", E), y = () => {};
	return v.append("g").attr("transform", `translate(0,${a - c})`).call(We(b).ticks(Array.isArray(d) ? null : d, typeof f == "string" ? f : void 0).tickFormat(typeof f == "function" ? f : void 0).tickSize(r).tickValues(Array.isArray(d) ? d : null)).attr("font-size", null).attr("font-family", null).attr("font-variant", Q(p, "normal")).call(y).call((e) => e.select(".domain").remove()), n !== void 0 && v.append("text").attr("x", l).attr("y", o - 6).attr("fill", "currentColor").attr("font-weight", "bold").text(n), v.node();
}
//#endregion
//#region node_modules/@observablehq/plot/src/math.js
var aw = Math.PI / 180;
//#endregion
//#region node_modules/@observablehq/plot/src/marker.js
function ow(e, { marker: t, markerStart: n = t, markerMid: r = t, markerEnd: i = t } = {}) {
	e.markerStart = sw(n), e.markerMid = sw(r), e.markerEnd = sw(i);
}
function sw(e) {
	if (e == null || e === !1) return null;
	if (e === !0) return uw;
	if (typeof e == "function") return e;
	switch (`${e}`.toLowerCase()) {
		case "none": return null;
		case "arrow": return cw("auto");
		case "arrow-reverse": return cw("auto-start-reverse");
		case "dot": return lw;
		case "circle":
		case "circle-fill": return uw;
		case "circle-stroke": return dw;
		case "tick": return fw("auto");
		case "tick-x": return fw(90);
		case "tick-y": return fw(0);
	}
	throw Error(`invalid marker: ${e}`);
}
function cw(e) {
	return (t, n) => X("svg:marker", n).attr("viewBox", "-5 -5 10 10").attr("markerWidth", 6.67).attr("markerHeight", 6.67).attr("orient", e).attr("fill", "none").attr("stroke", t).attr("stroke-width", 1.5).attr("stroke-linecap", "round").attr("stroke-linejoin", "round").call((e) => e.append("path").attr("d", "M-1.5,-3l3,3l-3,3")).node();
}
function lw(e, t) {
	return X("svg:marker", t).attr("viewBox", "-5 -5 10 10").attr("markerWidth", 6.67).attr("markerHeight", 6.67).attr("fill", e).attr("stroke", "none").call((e) => e.append("circle").attr("r", 2.5)).node();
}
function uw(e, t) {
	return X("svg:marker", t).attr("viewBox", "-5 -5 10 10").attr("markerWidth", 6.67).attr("markerHeight", 6.67).attr("fill", e).attr("stroke", "var(--plot-background)").attr("stroke-width", 1.5).call((e) => e.append("circle").attr("r", 3)).node();
}
function dw(e, t) {
	return X("svg:marker", t).attr("viewBox", "-5 -5 10 10").attr("markerWidth", 6.67).attr("markerHeight", 6.67).attr("fill", "var(--plot-background)").attr("stroke", e).attr("stroke-width", 1.5).call((e) => e.append("circle").attr("r", 3)).node();
}
function fw(e) {
	return (t, n) => X("svg:marker", n).attr("viewBox", "-3 -3 6 6").attr("markerWidth", 6).attr("markerHeight", 6).attr("orient", e).attr("stroke", t).call((e) => e.append("path").attr("d", "M0,-3v6")).node();
}
var pw = 0;
function mw(e, t, { stroke: n }, r) {
	return yw(e, t, n && ((e) => n[e]), null, r);
}
function hw(e, t, { stroke: n, z: r }, i) {
	return yw(e, t, n && (([e]) => n[e]), r, i);
}
var gw = 1, _w = 2;
function vw(e, t) {
	let n = new Uint8Array(t.length), r = e.data().filter((e) => e.length > 1), i = r.length;
	for (let e = 0, a = rC; e < i; ++e) {
		let i = r[e];
		if (i.length > 1) {
			let e = i[0];
			a !== (a = Bv(t[e])) && (n[e] |= gw);
		}
	}
	for (let e = i - 1, a = rC; e >= 0; --e) {
		let i = r[e];
		if (i.length > 1) {
			let e = i[0];
			a !== (a = Bv(t[e])) && (n[e] |= _w);
		}
	}
	return ([e]) => n[e];
}
function yw(e, { markerStart: t, markerMid: n, markerEnd: r, stroke: i }, a = () => i, o, s) {
	if (!t && !n && !r) return;
	let c = /* @__PURE__ */ new Map(), l = o && vw(e, o);
	function u(e, t, n) {
		return function(r) {
			if (n && !n(r)) return;
			let i = a(r), o = c.get(t);
			o || c.set(t, o = /* @__PURE__ */ new Map());
			let l = o.get(i);
			if (!l) {
				let e = this.parentNode.insertBefore(t(i, s), this), n = `plot-marker-${++pw}`;
				e.setAttribute("id", n), o.set(i, l = `url(#${n})`);
			}
			this.setAttribute(e, l);
		};
	}
	t && e.each(u("marker-start", t, l && ((e) => l(e) & gw))), n && l && e.each(u("marker-start", n, (e) => !(l(e) & gw))), n && e.each(u("marker-mid", n)), r && e.each(u("marker-end", r, l && ((e) => l(e) & _w)));
}
//#endregion
//#region node_modules/@observablehq/plot/src/transforms/inset.js
function bw({ inset: e, insetLeft: t, insetRight: n, ...r } = {}) {
	return [t, n] = Sw(e, t, n), {
		inset: e,
		insetLeft: t,
		insetRight: n,
		...r
	};
}
function xw({ inset: e, insetTop: t, insetBottom: n, ...r } = {}) {
	return [t, n] = Sw(e, t, n), {
		inset: e,
		insetTop: t,
		insetBottom: n,
		...r
	};
}
function Sw(e, t, n) {
	return e === void 0 && t === void 0 && n === void 0 ? fC ? [1, 0] : [.5, .5] : [t, n];
}
//#endregion
//#region node_modules/@observablehq/plot/src/transforms/interval.js
function Cw(e, { interval: t }) {
	return e = { ...ey(e) }, e.interval = Jv(e.interval === void 0 ? t : e.interval), e;
}
function ww(e, t, n, r) {
	let { [e]: i, [`${e}1`]: a, [`${e}2`]: o } = n, { value: s, interval: c } = Cw(i, n);
	if (s == null || c == null && !r) return n;
	let l = Wv(i);
	if (c == null) {
		let t, i = {
			transform: (e) => t ||= K(e, s),
			label: l
		};
		return {
			...n,
			[e]: void 0,
			[`${e}1`]: a === void 0 ? i : a,
			[`${e}2`]: o === void 0 && !(a === o && r) ? i : o
		};
	}
	let u, d;
	function f(e) {
		return d !== void 0 && e === u ? d : d = q(K(u = e, s), (e) => c.floor(e));
	}
	return t({
		...n,
		[e]: void 0,
		[`${e}1`]: a === void 0 ? {
			transform: f,
			label: l
		} : a,
		[`${e}2`]: o === void 0 ? {
			transform: (e) => f(e).map((e) => c.offset(e)),
			label: l
		} : o
	});
}
function Tw(e, t, n) {
	let { [e]: r } = n, { value: i, interval: a } = Cw(r, n);
	return i == null || a == null ? n : t({
		...n,
		[e]: {
			label: Wv(r),
			transform: (e) => {
				let t = q(K(e, i), (e) => a.floor(e)), n = t.map((e) => a.offset(e));
				return t.map(ay(t) ? (e, t) => e == null || isNaN(e = +e) || (t = n[t], t == null) || isNaN(t = +t) ? void 0 : /* @__PURE__ */ new Date((e + t) / 2) : (e, t) => e == null || (t = n[t], t == null) ? NaN : (+e + +t) / 2);
			}
		}
	});
}
function Ew(e = {}) {
	return ww("x", bw, e);
}
function Dw(e = {}) {
	return ww("y", xw, e);
}
function Ow(e = {}) {
	return Tw("x", bw, e);
}
function kw(e = {}) {
	return Tw("y", xw, e);
}
//#endregion
//#region node_modules/@observablehq/plot/src/marks/rule.js
var Aw = {
	ariaLabel: "rule",
	fill: null,
	stroke: "currentColor"
}, jw = class extends VC {
	constructor(e, t = {}) {
		let { x: n, y1: r, y2: i, inset: a = 0, insetTop: o = a, insetBottom: s = a } = t;
		super(e, {
			x: {
				value: n,
				scale: "x",
				optional: !0
			},
			y1: {
				value: r,
				scale: "y",
				optional: !0
			},
			y2: {
				value: i,
				scale: "y",
				optional: !0
			}
		}, KC(t, "x"), Aw), this.insetTop = lv(o), this.insetBottom = lv(s), ow(this, t);
	}
	render(e, t, n, r, i) {
		let { x: a, y: o } = t, { x: s, y1: c, y2: l } = n, { width: u, height: d, marginTop: f, marginRight: p, marginLeft: m, marginBottom: h } = r, { insetTop: g, insetBottom: _ } = this;
		return X("svg:g", i).call(jC, this, r, i).call(FC, this, { x: s && a }, fC, 0).call((t) => t.selectAll().data(e).enter().append("line").call(MC, this).attr("x1", s ? (e) => s[e] : (m + u - p) / 2).attr("x2", s ? (e) => s[e] : (m + u - p) / 2).attr("y1", c && !pS(o) ? (e) => c[e] + g : f + g).attr("y2", l && !pS(o) ? o.bandwidth ? (e) => l[e] + o.bandwidth() - _ : (e) => l[e] - _ : d - h - _).call(bC, this, n).call(mw, this, n, i)).node();
	}
}, Mw = class extends VC {
	constructor(e, t = {}) {
		let { x1: n, x2: r, y: i, inset: a = 0, insetRight: o = a, insetLeft: s = a } = t;
		super(e, {
			y: {
				value: i,
				scale: "y",
				optional: !0
			},
			x1: {
				value: n,
				scale: "x",
				optional: !0
			},
			x2: {
				value: r,
				scale: "x",
				optional: !0
			}
		}, KC(t, "y"), Aw), this.insetRight = lv(o), this.insetLeft = lv(s), ow(this, t);
	}
	render(e, t, n, r, i) {
		let { x: a, y: o } = t, { y: s, x1: c, x2: l } = n, { width: u, height: d, marginTop: f, marginRight: p, marginLeft: m, marginBottom: h } = r, { insetLeft: g, insetRight: _ } = this;
		return X("svg:g", i).call(jC, this, r, i).call(FC, this, { y: s && o }, 0, fC).call((t) => t.selectAll().data(e).enter().append("line").call(MC, this).attr("x1", c && !pS(a) ? (e) => c[e] + g : m + g).attr("x2", l && !pS(a) ? a.bandwidth ? (e) => l[e] + a.bandwidth() - _ : (e) => l[e] - _ : u - p - _).attr("y1", s ? (e) => s[e] : (f + d - h) / 2).attr("y2", s ? (e) => s[e] : (f + d - h) / 2).call(bC, this, n).call(mw, this, n, i)).node();
	}
};
function Nw(e, t) {
	let { x: n = av, y: r, y1: i, y2: a, ...o } = Dw(t);
	return [i, a] = Fw(r, i, a), new jw(e, {
		...o,
		x: n,
		y1: i,
		y2: a
	});
}
function Pw(e, t) {
	let { y: n = av, x: r, x1: i, x2: a, ...o } = Ew(t);
	return [i, a] = Fw(r, i, a), new Mw(e, {
		...o,
		y: n,
		x1: i,
		x2: a
	});
}
function Fw(e, t, n) {
	if (e == null) {
		if (t === void 0) {
			if (n !== void 0) return [0, n];
		} else if (n === void 0) return [0, t];
	} else if (t === void 0) return n === void 0 ? [0, e] : [e, n];
	else if (n === void 0) return [e, t];
	return [t, n];
}
//#endregion
//#region node_modules/@observablehq/plot/src/template.js
function Iw(e, ...t) {
	let n = t.length;
	for (let r = 0, i = !0; r < n; ++r) typeof t[r] != "function" && (i &&= (e = e.slice(), !1), e.splice(r, 2, e[r] + t[r] + e[r + 1]), t.splice(r, 1), --r, --n);
	return (r) => {
		let i = e[0];
		for (let a = 0; a < n; ++a) i += t[a](r) + e[a + 1];
		return i;
	};
}
//#endregion
//#region node_modules/@observablehq/plot/src/marks/text.js
var Lw = {
	ariaLabel: "text",
	strokeLinejoin: "round",
	strokeWidth: 3,
	paintOrder: "stroke"
}, Rw = "­", zw = class extends VC {
	constructor(e, t = {}) {
		let { x: n, y: r, text: i = ny(e) && ry(e) ? av : iv, frameAnchor: a, textAnchor: o = /right$/i.test(a) ? "end" : /left$/i.test(a) ? "start" : "middle", lineAnchor: s = /^top/i.test(a) ? "top" : /^bottom/i.test(a) ? "bottom" : "middle", lineHeight: c = 1, lineWidth: l = Infinity, textOverflow: u, monospace: d, fontFamily: f = d ? "ui-monospace, monospace" : void 0, fontSize: p, fontStyle: m, fontVariant: h, fontWeight: g, rotate: _ } = t, [v, y] = yv(_, 0), [b, x] = Jw(p);
		if (super(e, {
			x: {
				value: n,
				scale: "x",
				optional: !0
			},
			y: {
				value: r,
				scale: "y",
				optional: !0
			},
			fontSize: {
				value: b,
				optional: !0
			},
			rotate: {
				value: ty(v),
				optional: !0
			},
			text: {
				value: i,
				filter: s_,
				optional: !0
			}
		}, t, Lw), this.rotate = y, this.textAnchor = Q(o, "middle"), this.lineAnchor = xv(s, "lineAnchor", [
			"top",
			"middle",
			"bottom"
		]), this.lineHeight = +c, this.lineWidth = +l, this.textOverflow = Bw(u), this.monospace = !!d, this.fontFamily = cv(f), this.fontSize = x, this.fontStyle = cv(m), this.fontVariant = cv(h), this.fontWeight = cv(g), this.frameAnchor = _y(a), !(this.lineWidth >= 0)) throw Error(`invalid lineWidth: ${l}`);
		this.splitLines = eT(this), this.clipLine = tT(this);
	}
	render(e, t, n, r, i) {
		let { x: a, y: o } = t, { x: s, y: c, rotate: l, text: u, title: d, fontSize: f } = n, { rotate: p } = this, [m, h] = BC(this, r);
		return X("svg:g", i).call(jC, this, r, i).call(Gw, this, u, r).call(FC, this, {
			x: s && a,
			y: c && o
		}).call((t) => t.selectAll().data(e).enter().append("text").call(MC, this).call(Vw, this, u, d).attr("transform", Iw`translate(${s ? (e) => s[e] : m},${c ? (e) => c[e] : h})${l ? (e) => ` rotate(${l[e]})` : p ? ` rotate(${p})` : ""}`).call(Z, "font-size", f && ((e) => f[e])).call(bC, this, n)).node();
	}
};
function Bw(e) {
	return e == null ? null : xv(e, "textOverflow", [
		"clip",
		"ellipsis",
		"clip-start",
		"clip-end",
		"ellipsis-start",
		"ellipsis-middle",
		"ellipsis-end"
	]).replace(/^(clip|ellipsis)$/, "$1-end");
}
function Vw(e, t, n, r) {
	if (!n) return;
	let { lineAnchor: i, lineHeight: a, textOverflow: o, splitLines: s, clipLine: c } = t;
	e.each(function(e) {
		let t = s(dC(n[e]) ?? "").map(c), l = t.length, u = i === "top" ? .71 : i === "bottom" ? 1 - l : (164 - l * 100) / 200;
		if (l > 1) {
			let e = 0;
			for (let n = 0; n < l; ++n) {
				if (++e, !t[n]) continue;
				let r = this.ownerDocument.createElementNS(Ze.svg, "tspan");
				r.setAttribute("x", 0), n === e - 1 ? r.setAttribute("y", `${(u + n) * a}em`) : r.setAttribute("dy", `${e * a}em`), r.textContent = t[n], this.appendChild(r), e = 0;
			}
		} else u && this.setAttribute("y", `${u * a}em`), this.textContent = t[0];
		if (o && !r && t[0] !== n[e]) {
			let t = this.ownerDocument.createElementNS(Ze.svg, "title");
			t.textContent = n[e], this.appendChild(t);
		}
	});
}
function Hw(e, { x: t, y: n, ...r } = {}) {
	return r.frameAnchor === void 0 && ([t, n] = Pv(t, n)), new zw(e, {
		...r,
		x: t,
		y: n
	});
}
function Uw(e, { x: t = av, ...n } = {}) {
	return new zw(e, kw({
		...n,
		x: t
	}));
}
function Ww(e, { y: t = av, ...n } = {}) {
	return new zw(e, Ow({
		...n,
		y: t
	}));
}
function Gw(e, t, n) {
	Z(e, "text-anchor", t.textAnchor), Z(e, "font-family", t.fontFamily), Z(e, "font-size", t.fontSize), Z(e, "font-style", t.fontStyle), Z(e, "font-variant", t.fontVariant === void 0 ? Kw(n) : t.fontVariant), Z(e, "font-weight", t.fontWeight);
}
function Kw(e) {
	return e && (cy(e) || ay(e)) ? "tabular-nums" : void 0;
}
var qw = /* @__PURE__ */ new Set([
	"inherit",
	"initial",
	"revert",
	"unset",
	"xx-small",
	"x-small",
	"small",
	"medium",
	"large",
	"x-large",
	"xx-large",
	"xxx-large",
	"larger",
	"smaller"
]);
function Jw(e) {
	return e == null || typeof e == "number" ? [void 0, e] : typeof e == "string" ? (e = e.trim().toLowerCase(), qw.has(e) || /^[+-]?\d*\.?\d+(e[+-]?\d+)?(\w*|%)$/.test(e) ? [void 0, e] : [e, void 0]) : [e, void 0];
}
function Yw(e, t, n) {
	let r = [], i, a = 0;
	for (let [o, s, c] of Xw(e)) {
		if (i === void 0 && (i = o), a > i && n(e, i, s) > t && (r.push(e.slice(i, a) + (e[a - 1] === Rw ? "-" : "")), i = o), c) {
			r.push(e.slice(i, s)), i = void 0;
			continue;
		}
		a = s;
	}
	return r;
}
function* Xw(e) {
	let t = 0, n = 0, r = e.length;
	for (; n < r;) {
		let r = 1;
		switch (e[n]) {
			case Rw:
			case "-":
				++n, yield [
					t,
					n,
					!1
				], t = n;
				break;
			case " ":
				for (yield [
					t,
					n,
					!1
				]; e[++n] === " ";);
				t = n;
				break;
			case "\r": e[n + 1] === "\n" && ++r;
			case "\n":
				yield [
					t,
					n,
					!0
				], n += r, t = n;
				break;
			default: ++n;
		}
	}
	yield [
		t,
		n,
		!0
	];
}
var Zw = {
	a: 56,
	b: 63,
	c: 57,
	d: 63,
	e: 58,
	f: 37,
	g: 62,
	h: 60,
	i: 26,
	j: 26,
	k: 55,
	l: 26,
	m: 88,
	n: 60,
	o: 60,
	p: 62,
	q: 62,
	r: 39,
	s: 54,
	t: 38,
	u: 60,
	v: 55,
	w: 79,
	x: 54,
	y: 55,
	z: 55,
	A: 69,
	B: 67,
	C: 73,
	D: 74,
	E: 61,
	F: 58,
	G: 76,
	H: 75,
	I: 28,
	J: 55,
	K: 67,
	L: 58,
	M: 89,
	N: 75,
	O: 78,
	P: 65,
	Q: 78,
	R: 67,
	S: 65,
	T: 65,
	U: 75,
	V: 69,
	W: 98,
	X: 69,
	Y: 67,
	Z: 67,
	0: 64,
	1: 48,
	2: 62,
	3: 64,
	4: 66,
	5: 63,
	6: 65,
	7: 58,
	8: 65,
	9: 65,
	" ": 29,
	"!": 32,
	"\"": 49,
	"'": 31,
	"(": 39,
	")": 39,
	",": 31,
	"-": 48,
	".": 31,
	"/": 32,
	":": 31,
	";": 31,
	"?": 52,
	"‘": 31,
	"’": 31,
	"“": 47,
	"”": 47,
	"…": 82
};
function Qw(e, t = 0, n = e.length) {
	let r = 0;
	for (let i = t; i < n; i = cT(e, i)) r += Zw[e[i]] ?? (pT(e, i) ? 120 : Zw.e);
	return r;
}
function $w(e, t = 0, n = e.length) {
	let r = 0;
	for (let i = t; i < n; i = cT(e, i)) r += pT(e, i) ? 126 : 63;
	return r;
}
function eT({ monospace: e, lineWidth: t, textOverflow: n }) {
	if (n != null || t == Infinity) return (e) => e.split(/\r\n?|\n/g);
	let r = e ? $w : Qw, i = t * 100;
	return (e) => Yw(e, i, r);
}
function tT({ monospace: e, lineWidth: t, textOverflow: n }) {
	if (n == null || t == Infinity) return (e) => e;
	let r = e ? $w : Qw, i = t * 100;
	switch (n) {
		case "clip-start": return (e) => aT(e, i, r, "");
		case "clip-end": return (e) => rT(e, i, r, "");
		case "ellipsis-start": return (e) => aT(e, i, r, "…");
		case "ellipsis-middle": return (e) => iT(e, i, r, "…");
		case "ellipsis-end": return (e) => rT(e, i, r, "…");
	}
}
function nT(e, t, n, r) {
	let i = [], a = 0;
	for (let o = 0, s = 0, c = e.length; o < c; o = s) {
		s = cT(e, o);
		let c = n(e, o, s);
		if (a + c > t) {
			for (a += r; a > t && o > 0;) s = o, o = i.pop(), a -= n(e, o, s);
			return [o, t - a];
		}
		a += c, i.push(o);
	}
	return [-1, 0];
}
function rT(e, t, n, r) {
	e = e.trim();
	let i = n(r), [a] = nT(e, t, n, i);
	return a < 0 ? e : e.slice(0, a).trimEnd() + r;
}
function iT(e, t, n, r) {
	e = e.trim();
	let i = n(e);
	if (i <= t) return e;
	let a = n(r) / 2, [o, s] = nT(e, t / 2, n, a), [c] = nT(e, i - t / 2 - s + a, n, -a);
	return c < 0 ? r : e.slice(0, o).trimEnd() + r + e.slice(cT(e, c)).trimStart();
}
function aT(e, t, n, r) {
	e = e.trim();
	let i = n(e);
	if (i <= t) return e;
	let a = n(r), [o] = nT(e, i - t + a, n, -a);
	return o < 0 ? r : r + e.slice(cT(e, o)).trimStart();
}
var oT = /[\p{Combining_Mark}\p{Emoji_Modifier}]+/uy, sT = /\p{Extended_Pictographic}/uy;
function cT(e, t) {
	return t += uT(e, t) ? 2 : 1, fT(e, t) && (t = oT.lastIndex), dT(e, t) ? cT(e, t + 1) : t;
}
function lT(e, t) {
	return e.charCodeAt(t) < 128;
}
function uT(e, t) {
	let n = e.charCodeAt(t);
	if (n >= 55296 && n < 56320) {
		let n = e.charCodeAt(t + 1);
		return n >= 56320 && n < 57344;
	}
	return !1;
}
function dT(e, t) {
	return e.charCodeAt(t) === 8205;
}
function fT(e, t) {
	return !lT(e, t) && (oT.lastIndex = t, oT.test(e));
}
function pT(e, t) {
	return !lT(e, t) && (sT.lastIndex = t, sT.test(e));
}
//#endregion
//#region node_modules/@observablehq/plot/src/marks/vector.js
var mT = {
	ariaLabel: "vector",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 1.5,
	strokeLinejoin: "round",
	strokeLinecap: "round"
}, hT = 3.5, gT = hT * 5, _T = { draw(e, t, n) {
	let r = t * n / gT;
	e.moveTo(0, 0), e.lineTo(0, -t), e.moveTo(-r, r - t), e.lineTo(0, -t), e.lineTo(r, r - t);
} }, vT = /* @__PURE__ */ new Map([["arrow", _T], ["spike", { draw(e, t, n) {
	e.moveTo(-n, 0), e.lineTo(0, -t), e.lineTo(n, 0);
} }]]);
function yT(e) {
	return e && typeof e.draw == "function";
}
function bT(e) {
	if (yT(e)) return e;
	let t = vT.get(`${e}`.toLowerCase());
	if (t) return t;
	throw Error(`invalid shape: ${e}`);
}
var xT = class extends VC {
	constructor(e, t = {}) {
		let { x: n, y: r, r: i = hT, length: a, rotate: o, shape: s = _T, anchor: c = "middle", frameAnchor: l } = t, [u, d] = yv(a, 12), [f, p] = yv(o, 0);
		super(e, {
			x: {
				value: n,
				scale: "x",
				optional: !0
			},
			y: {
				value: r,
				scale: "y",
				optional: !0
			},
			length: {
				value: u,
				scale: "length",
				optional: !0
			},
			rotate: {
				value: f,
				optional: !0
			}
		}, t, mT), this.r = +i, this.length = d, this.rotate = p, this.shape = bT(s), this.anchor = xv(c, "anchor", [
			"start",
			"middle",
			"end"
		]), this.frameAnchor = _y(l);
	}
	render(e, t, n, r, i) {
		let { x: a, y: o } = t, { x: s, y: c, length: l, rotate: u } = n, { length: d, rotate: f, anchor: p, shape: m, r: h } = this, [g, _] = BC(this, r);
		return X("svg:g", i).call(jC, this, r, i).call(FC, this, {
			x: s && a,
			y: c && o
		}).call((t) => t.selectAll().data(e).enter().append("path").call(MC, this).attr("transform", Iw`translate(${s ? (e) => s[e] : g},${c ? (e) => c[e] : _})${u ? (e) => ` rotate(${u[e]})` : f ? ` rotate(${f})` : ""}${p === "start" ? "" : p === "end" ? l ? (e) => ` translate(0,${l[e]})` : ` translate(0,${d})` : l ? (e) => ` translate(0,${l[e] / 2})` : ` translate(0,${d / 2})`}`).attr("d", l ? (e) => {
			let t = ts();
			return m.draw(t, l[e], h), t;
		} : (() => {
			let e = ts();
			return m.draw(e, d, h), e;
		})()).call(bC, this, n)).node();
	}
};
function ST(e, t = {}) {
	let { x: n = av, ...r } = t;
	return new xT(e, {
		...r,
		x: n
	});
}
function CT(e, t = {}) {
	let { y: n = av, ...r } = t;
	return new xT(e, {
		...r,
		y: n
	});
}
//#endregion
//#region node_modules/@observablehq/plot/src/marks/axis.js
function wT(e, t) {
	return arguments.length < 2 && !ny(e) && (t = e, e = null), t === void 0 && (t = {}), [e, t];
}
function TT({ anchor: e } = {}, t) {
	return e === void 0 ? t[0] : xv(e, "anchor", t);
}
function ET(e) {
	return TT(e, ["left", "right"]);
}
function DT(e) {
	return TT(e, ["right", "left"]);
}
function OT(e) {
	return TT(e, ["bottom", "top"]);
}
function kT(e) {
	return TT(e, ["top", "bottom"]);
}
function AT() {
	let [e, t] = wT(...arguments);
	return PT("y", ET(t), e, t);
}
function jT() {
	let [e, t] = wT(...arguments);
	return PT("fy", DT(t), e, t);
}
function MT() {
	let [e, t] = wT(...arguments);
	return FT("x", OT(t), e, t);
}
function NT() {
	let [e, t] = wT(...arguments);
	return FT("fx", kT(t), e, t);
}
function PT(e, t, n, { color: r = "currentColor", opacity: i = 1, stroke: a = r, strokeOpacity: o = i, strokeWidth: s = 1, fill: c = r, fillOpacity: l = i, textAnchor: u, textStroke: d, textStrokeOpacity: f, textStrokeWidth: p, tickSize: m = e === "y" ? 6 : 0, tickPadding: h, tickRotate: g, x: _, margin: v, marginTop: y = v === void 0 ? 20 : v, marginRight: b = v === void 0 ? t === "right" ? 40 : 0 : v, marginBottom: x = v === void 0 ? 20 : v, marginLeft: S = v === void 0 ? t === "left" ? 40 : 0 : v, label: C, labelAnchor: w, labelArrow: T, labelOffset: E, ariaLabel: D = `${e}-axis`, ...O }) {
	return m = lv(m), h = lv(h), g = lv(g), w !== void 0 && (w = xv(w, "labelAnchor", [
		"center",
		"top",
		"bottom"
	])), T = aE(T), HC(m && !py(a) ? IT(e, t, n, {
		stroke: a,
		strokeOpacity: o,
		strokeWidth: s,
		tickSize: m,
		tickPadding: h,
		tickRotate: g,
		x: _,
		ariaLabel: D,
		...O
	}) : null, py(c) ? null : RT(e, t, n, {
		fill: c,
		fillOpacity: l,
		stroke: d,
		strokeOpacity: f,
		strokeWidth: p,
		textAnchor: u,
		tickSize: m,
		tickPadding: h,
		tickRotate: g,
		x: _,
		marginTop: y,
		marginRight: b,
		marginBottom: x,
		marginLeft: S,
		ariaLabel: D,
		...O
	}), !py(c) && C !== null ? Hw([], qT({
		fill: c,
		fillOpacity: l,
		...O
	}, function(n, r, i, a, o) {
		let s = a[e], { marginTop: c, marginRight: l, marginBottom: u, marginLeft: d } = e === "y" && o.inset || o, f = w ?? (s.bandwidth ? "center" : "top"), p = E ?? (t === "right" ? l : d) - 3;
		return f === "center" ? (this.textAnchor = void 0, this.lineAnchor = t === "right" ? "bottom" : "top", this.frameAnchor = t, this.rotate = -90) : (this.textAnchor = t === "right" ? "end" : "start", this.lineAnchor = f, this.frameAnchor = `${f}-${t}`, this.rotate = 0), this.dy = f === "top" ? 3 - c : f === "bottom" ? u - 3 : 0, this.dx = t === "right" ? p : -p, this.ariaLabel = `${D} label`, {
			facets: [[0]],
			channels: { text: { value: [iE(e, s, {
				anchor: t,
				label: C,
				labelAnchor: f,
				labelArrow: T
			})] } }
		};
	})) : null);
}
function FT(e, t, n, { color: r = "currentColor", opacity: i = 1, stroke: a = r, strokeOpacity: o = i, strokeWidth: s = 1, fill: c = r, fillOpacity: l = i, textAnchor: u, textStroke: d, textStrokeOpacity: f, textStrokeWidth: p, tickSize: m = e === "x" ? 6 : 0, tickPadding: h, tickRotate: g, y: _, margin: v, marginTop: y = v === void 0 ? t === "top" ? 30 : 0 : v, marginRight: b = v === void 0 ? 20 : v, marginBottom: x = v === void 0 ? t === "bottom" ? 30 : 0 : v, marginLeft: S = v === void 0 ? 20 : v, label: C, labelAnchor: w, labelArrow: T, labelOffset: E, ariaLabel: D = `${e}-axis`, ...O }) {
	return m = lv(m), h = lv(h), g = lv(g), w !== void 0 && (w = xv(w, "labelAnchor", [
		"center",
		"left",
		"right"
	])), T = aE(T), HC(m && !py(a) ? LT(e, t, n, {
		stroke: a,
		strokeOpacity: o,
		strokeWidth: s,
		tickSize: m,
		tickPadding: h,
		tickRotate: g,
		y: _,
		ariaLabel: D,
		...O
	}) : null, py(c) ? null : zT(e, t, n, {
		fill: c,
		fillOpacity: l,
		stroke: d,
		strokeOpacity: f,
		strokeWidth: p,
		textAnchor: u,
		tickSize: m,
		tickPadding: h,
		tickRotate: g,
		y: _,
		marginTop: y,
		marginRight: b,
		marginBottom: x,
		marginLeft: S,
		ariaLabel: D,
		...O
	}), !py(c) && C !== null ? Hw([], qT({
		fill: c,
		fillOpacity: l,
		...O
	}, function(n, r, i, a, o) {
		let s = a[e], { marginTop: c, marginRight: l, marginBottom: u, marginLeft: d } = e === "x" && o.inset || o, f = w ?? (s.bandwidth ? "center" : "right"), p = E ?? (t === "top" ? c : u) - 3;
		return f === "center" ? (this.frameAnchor = t, this.textAnchor = void 0) : (this.frameAnchor = `${t}-${f}`, this.textAnchor = f === "right" ? "end" : "start"), this.lineAnchor = t, this.dy = t === "top" ? -p : p, this.dx = f === "right" ? l - 3 : f === "left" ? 3 - d : 0, this.ariaLabel = `${D} label`, {
			facets: [[0]],
			channels: { text: { value: [iE(e, s, {
				anchor: t,
				label: C,
				labelAnchor: f,
				labelArrow: T
			})] } }
		};
	})) : null);
}
function IT(e, t, n, { strokeWidth: r = 1, strokeLinecap: i = null, strokeLinejoin: a = null, facetAnchor: o = t + (e === "y" ? "-empty" : ""), frameAnchor: s = t, tickSize: c, inset: l = 0, insetLeft: u = l, insetRight: d = l, dx: f = 0, y: p = e === "y" ? void 0 : null, ariaLabel: m, ...h }) {
	return JT(CT, e, n, {
		ariaLabel: `${m} tick`,
		ariaHidden: !0
	}, {
		strokeWidth: r,
		strokeLinecap: i,
		strokeLinejoin: a,
		facetAnchor: o,
		frameAnchor: s,
		y: p,
		...h,
		dx: t === "left" ? +f - fC + +u : +f + fC - d,
		anchor: "start",
		length: c,
		shape: t === "left" ? tE : nE
	});
}
function LT(e, t, n, { strokeWidth: r = 1, strokeLinecap: i = null, strokeLinejoin: a = null, facetAnchor: o = t + (e === "x" ? "-empty" : ""), frameAnchor: s = t, tickSize: c, inset: l = 0, insetTop: u = l, insetBottom: d = l, dy: f = 0, x: p = e === "x" ? void 0 : null, ariaLabel: m, ...h }) {
	return JT(ST, e, n, {
		ariaLabel: `${m} tick`,
		ariaHidden: !0
	}, {
		strokeWidth: r,
		strokeLinejoin: a,
		strokeLinecap: i,
		facetAnchor: o,
		frameAnchor: s,
		x: p,
		...h,
		dy: t === "bottom" ? +f - fC - d : +f + fC + +u,
		anchor: "start",
		length: c,
		shape: t === "bottom" ? $T : eE
	});
}
function RT(e, t, n, { facetAnchor: r = t + (e === "y" ? "-empty" : ""), frameAnchor: i = t, tickSize: a, tickRotate: o = 0, tickPadding: s = Math.max(3, 9 - a) + (Math.abs(o) > 60 ? 4 * Math.cos(o * aw) : 0), text: c, textAnchor: l = Math.abs(o) > 60 ? "middle" : t === "left" ? "end" : "start", lineAnchor: u = o > 60 ? "top" : o < -60 ? "bottom" : "middle", fontVariant: d, inset: f = 0, insetLeft: p = f, insetRight: m = f, dx: h = 0, ariaLabel: g, y: _ = e === "y" ? void 0 : null, ...v }) {
	return JT(Ww, e, n, { ariaLabel: `${g} tick label` }, {
		facetAnchor: r,
		frameAnchor: i,
		text: c,
		textAnchor: l,
		lineAnchor: u,
		fontVariant: d,
		rotate: o,
		y: _,
		...v,
		dx: t === "left" ? +h - a - s + +p : +h + +a + +s - m
	}, function(e, n, r, i, a) {
		d === void 0 && (this.fontVariant = rE(e)), c === void 0 && (a.text = XT(e, n, r, i, t));
	});
}
function zT(e, t, n, { facetAnchor: r = t + (e === "x" ? "-empty" : ""), frameAnchor: i = t, tickSize: a, tickRotate: o = 0, tickPadding: s = Math.max(3, 9 - a) + (Math.abs(o) >= 10 ? 4 * Math.cos(o * aw) : 0), text: c, textAnchor: l = Math.abs(o) >= 10 ? o < 0 ^ t === "bottom" ? "start" : "end" : "middle", lineAnchor: u = Math.abs(o) >= 10 ? "middle" : t === "bottom" ? "top" : "bottom", fontVariant: d, inset: f = 0, insetTop: p = f, insetBottom: m = f, dy: h = 0, x: g = e === "x" ? void 0 : null, ariaLabel: _, ...v }) {
	return JT(Uw, e, n, { ariaLabel: `${_} tick label` }, {
		facetAnchor: r,
		frameAnchor: i,
		text: c === void 0 ? null : c,
		textAnchor: l,
		lineAnchor: u,
		fontVariant: d,
		rotate: o,
		x: g,
		...v,
		dy: t === "bottom" ? +h + +a + +s - m : +h - a - s + +p
	}, function(e, n, r, i, a) {
		d === void 0 && (this.fontVariant = rE(e)), c === void 0 && (a.text = XT(e, n, r, i, t));
	});
}
function BT() {
	let [e, t] = wT(...arguments);
	return WT("y", ET(t), e, t);
}
function VT() {
	let [e, t] = wT(...arguments);
	return WT("fy", DT(t), e, t);
}
function HT() {
	let [e, t] = wT(...arguments);
	return GT("x", OT(t), e, t);
}
function UT() {
	let [e, t] = wT(...arguments);
	return GT("fx", kT(t), e, t);
}
function WT(e, t, n, { y: r = e === "y" ? void 0 : null, x: i = null, x1: a = t === "left" ? i : null, x2: o = t === "right" ? i : null, ariaLabel: s = `${e}-grid`, ariaHidden: c = !0, ...l }) {
	return JT(Pw, e, n, {
		ariaLabel: s,
		ariaHidden: c
	}, {
		y: r,
		x1: a,
		x2: o,
		...KT(l)
	});
}
function GT(e, t, n, { x: r = e === "x" ? void 0 : null, y: i = null, y1: a = t === "top" ? i : null, y2: o = t === "bottom" ? i : null, ariaLabel: s = `${e}-grid`, ariaHidden: c = !0, ...l }) {
	return JT(Nw, e, n, {
		ariaLabel: s,
		ariaHidden: c
	}, {
		x: r,
		y1: a,
		y2: o,
		...KT(l)
	});
}
function KT({ color: e = "currentColor", opacity: t = .1, stroke: n = e, strokeOpacity: r = t, strokeWidth: i = 1, ...a }) {
	return {
		stroke: n,
		strokeOpacity: r,
		strokeWidth: i,
		...a
	};
}
function qT({ fill: e, fillOpacity: t, fontFamily: n, fontSize: r, fontStyle: i, fontVariant: a, fontWeight: o, monospace: s, pointerEvents: c, shapeRendering: l, clip: u = !1 }, d) {
	return [, e] = vv(e), [, t] = yv(t), {
		facet: "super",
		x: null,
		y: null,
		fill: e,
		fillOpacity: t,
		fontFamily: n,
		fontSize: r,
		fontStyle: i,
		fontVariant: a,
		fontWeight: o,
		monospace: s,
		pointerEvents: c,
		shapeRendering: l,
		clip: u,
		initializer: d
	};
}
function JT(e, t, n, r, i, a) {
	let o;
	function s(e, n, r, s, c, l) {
		let u = e == null && (t === "fx" || t === "fy"), { [t]: d } = s;
		if (!d) throw Error(`missing scale: ${t}`);
		let f = d.domain(), { interval: p, ticks: m, tickFormat: h, tickSpacing: g = t === "x" ? 80 : 35 } = i;
		if (typeof m == "string" && oE(d) && (p = m, m = void 0), m === void 0 && (m = Xv(p, d.type) ?? YT(d, g)), e == null) {
			if (ny(m)) e = Cv(m);
			else if ($v(m)) e = QT(m, ..._(f));
			else if (d.interval) {
				let t = d.interval;
				if (d.ticks) {
					let [n, r] = _(f), i = (r - n) / t[O_];
					t = L_(t, i / m) ?? t, e = QT(t, n, r);
				} else {
					e = f;
					let n = e.length;
					t = L_(t, n / m) ?? t, t !== d.interval && (e = QT(t, ..._(e)));
				}
				if (t === d.interval) {
					let t = Math.round(e.length / m);
					t > 1 && (e = e.filter((e, n) => n % t === 0));
				}
			} else e = d.ticks ? d.ticks(m) : f;
			if (!d.ticks && e.length && e !== f) {
				let n = new b(f);
				e = e.filter((e) => n.has(e)), e.length || xx(`Warning: the ${t}-axis ticks appear to not align with the scale domain, resulting in no ticks. Try different ticks?`);
			}
			t === "y" || t === "x" ? n = [Lv(e)] : o[t] = {
				scale: t,
				value: av
			};
		}
		a?.call(this, d, e, m, h, o);
		let v = Object.fromEntries(Object.entries(o).map(([t, n]) => [t, {
			...n,
			value: K(e, n.value)
		}]));
		return u && (n = l.filterFacets(e, v)), {
			data: e,
			facets: n,
			channels: v
		};
	}
	let c = Vy(i).initializer, l = e(n, Vy({
		...i,
		initializer: s
	}, c));
	return n == null ? (o = l.channels, l.channels = {}) : o = {}, r !== void 0 && Object.assign(l, r), l.clip === void 0 && (l.clip = !1), l;
}
function YT(e, t) {
	let [n, r] = _(e.range());
	return (r - n) / t;
}
function XT(e, t, n, r, i) {
	return { value: ZT(e, t, n, r, i) };
}
function ZT(e, t, n, r, i) {
	return typeof r == "function" && !(e.type === "log" && e.tickFormat) ? r : r === void 0 && t && ay(t) ? V_(e.type, t, i) ?? dC : e.tickFormat ? e.tickFormat(typeof n == "number" ? n : null, r) : typeof r == "string" && e.domain().length > 0 ? (ay(e.domain()) ? Lp : bs)(r) : r === void 0 ? dC : fv(r);
}
function QT(e, t, n) {
	return e.range(t, e.offset(e.floor(n)));
}
var $T = { draw(e, t) {
	e.moveTo(0, 0), e.lineTo(0, t);
} }, eE = { draw(e, t) {
	e.moveTo(0, 0), e.lineTo(0, -t);
} }, tE = { draw(e, t) {
	e.moveTo(0, 0), e.lineTo(-t, 0);
} }, nE = { draw(e, t) {
	e.moveTo(0, 0), e.lineTo(t, 0);
} };
function rE(e) {
	return e.bandwidth && !e.interval ? void 0 : "tabular-nums";
}
function iE(e, t, { anchor: n, label: r = t.label, labelAnchor: i, labelArrow: a } = {}) {
	if (!(r == null || r.inferred && oE(t) && /^(date|time|year)$/i.test(r))) {
		if (r = String(r), a === "auto" && (a = (!t.bandwidth || t.interval) && !/[↑↓→←]/.test(r)), !a) return r;
		if (a === !0) {
			let n = Xx(t);
			n && (a = /x$/.test(e) || i === "center" ? /x$/.test(e) === n < 0 ? "left" : "right" : n < 0 ? "up" : "down");
		}
		switch (a) {
			case "left": return `← ${r}`;
			case "right": return `${r} →`;
			case "up": return n === "right" ? `${r} ↑` : `↑ ${r}`;
			case "down": return n === "right" ? `${r} ↓` : `↓ ${r}`;
		}
		return r;
	}
}
function aE(e = "auto") {
	return py(e) ? !1 : typeof e == "boolean" ? e : xv(e, "labelArrow", [
		"auto",
		"up",
		"right",
		"down",
		"left"
	]);
}
function oE(e) {
	return ay(e.domain());
}
//#endregion
//#region node_modules/@observablehq/plot/src/legends/swatches.js
function sE(e, t) {
	if (t == null) return t;
	let n = e(t);
	if (!n) throw Error(`scale not found: ${t}`);
	return n;
}
function cE(e, { opacity: t, ...n } = {}) {
	if (!uS(e) && !dS(e)) throw Error(`swatches legend requires ordinal or threshold color scale (not ${e.type})`);
	return uE(e, n, (e, n, r, i) => e.append("svg").attr("width", r).attr("height", i).attr("fill", n.scale).attr("fill-opacity", yv(t)[1]).append("rect").attr("width", "100%").attr("height", "100%"));
}
function lE(e, { fill: t = e.hint?.fill === void 0 ? "none" : e.hint.fill, fillOpacity: n = 1, stroke: r = e.hint?.stroke === void 0 ? py(t) ? "currentColor" : "none" : e.hint.stroke, strokeOpacity: i = 1, strokeWidth: a = 1.5, r: o = 4.5, ...s } = {}, c) {
	let [l, u] = vv(t), [d, f] = vv(r), p = sE(c, l), m = sE(c, d), h = o * o * Math.PI;
	return n = yv(n)[1], i = yv(i)[1], a = yv(a)[1], uE(e, s, (t, r, o, s) => t.append("svg").attr("viewBox", "-8 -8 16 16").attr("width", o).attr("height", s).attr("fill", l === "color" ? (e) => p.scale(e) : u).attr("fill-opacity", n).attr("stroke", d === "color" ? (e) => m.scale(e) : f).attr("stroke-opacity", i).attr("stroke-width", a).append("path").attr("d", (t) => {
		let n = ts();
		return e.scale(t).draw(n, h), n;
	}));
}
function uE(e, t = {}, n) {
	let { columns: r, tickFormat: i, fontVariant: a = rw(e), swatchSize: o = 15, swatchWidth: s = o, swatchHeight: c = o, marginLeft: l = 0, className: u, style: d, width: f } = t, p = nC(t);
	u = RC(u), i = ZT(e.scale, e.domain, void 0, i);
	let m = X("div", p).attr("class", `${u}-swatches ${u}-swatches-${r == null ? "wrap" : "columns"}`), h;
	return r == null ? (h = `:where(.${u}-swatches-wrap) {
  display: flex;
  align-items: center;
  min-height: 33px;
  flex-wrap: wrap;
}
:where(.${u}-swatches-wrap .${u}-swatch) {
  display: inline-flex;
  align-items: center;
  margin-right: 1em;
}`, m.selectAll().data(e.domain).enter().append("span").attr("class", `${u}-swatch`).call(n, e, s, c).append(function() {
		return this.ownerDocument.createTextNode(i.apply(this, arguments));
	})) : (h = `:where(.${u}-swatches-columns .${u}-swatch) {
  display: flex;
  align-items: center;
  break-inside: avoid;
  padding-bottom: 1px;
}
:where(.${u}-swatches-columns .${u}-swatch::before) {
  flex-shrink: 0;
}
:where(.${u}-swatches-columns .${u}-swatch-label) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}`, m.style("columns", r).selectAll().data(e.domain).enter().append("div").attr("class", `${u}-swatch`).call(n, e, s, c).call((e) => e.append("div").attr("class", `${u}-swatch-label`).attr("title", i).text(i))), m.call((e) => e.insert("style", "*").text(`:where(.${u}-swatches) {
  font-family: system-ui, sans-serif;
  font-size: 10px;
  margin-bottom: 0.5em;
}
:where(.${u}-swatch > svg) {
  margin-right: 0.5em;
  overflow: visible;
}
${h}`)).style("margin-left", l ? `${+l}px` : null).style("width", f === void 0 ? null : `${+f}px`).style("font-variant", Q(a, "normal")).call(zC, d).node();
}
//#endregion
//#region node_modules/@observablehq/plot/src/legends.js
var dE = /* @__PURE__ */ new Map([
	["symbol", lE],
	["color", mE],
	["opacity", hE]
]);
function fE(e, t, n = {}) {
	return (r, i) => {
		if (!dE.has(r)) throw Error(`unknown legend type: ${r}`);
		if (r in e) return dE.get(r)(e[r], pE(t, n[r], i), (t) => e[t]);
	};
}
function pE({ className: e, ...t }, { label: n, ticks: r, tickFormat: i } = {}, a) {
	return vy(a, {
		className: e,
		...t
	}, {
		label: n,
		ticks: r,
		tickFormat: i
	});
}
function mE(e, { legend: t = !0, ...n }) {
	if (t === !0 && (t = e.type === "ordinal" ? "swatches" : "ramp"), e.domain !== void 0) switch (`${t}`.toLowerCase()) {
		case "swatches": return cE(e, n);
		case "ramp": return iw(e, n);
		default: throw Error(`unknown legend type: ${t}`);
	}
}
function hE({ type: e, interpolate: t, ...n }, { legend: r = !0, color: i = wr(0, 0, 0), ...a }) {
	if (!t) throw Error(`${e} opacity scales are not supported`);
	if (r === !0 && (r = "ramp"), `${r}`.toLowerCase() !== "ramp") throw Error(`${r} opacity legends are not supported`);
	return mE({
		type: e,
		...n,
		interpolate: gE(i)
	}, {
		legend: r,
		...a
	});
}
function gE(e) {
	let { r: t, g: n, b: r } = wr(e) || wr(0, 0, 0);
	return (e) => `rgba(${t},${n},${r},${e})`;
}
function _E(e, t, n) {
	let r = [];
	for (let [i, a] of dE) {
		let o = n[i];
		if (o?.legend && i in e) {
			let n = a(e[i], pE(t, e[i], o), (t) => e[t]);
			n != null && r.push(n);
		}
	}
	return r;
}
//#endregion
//#region node_modules/@observablehq/plot/src/transforms/identity.js
function vE(e = {}, t = "x") {
	return Ev(e) ? e : {
		...e,
		[t]: av
	};
}
//#endregion
//#region node_modules/@observablehq/plot/src/transforms/exclusiveFacets.js
function yE(e, t) {
	if (t.length === 1) return {
		data: e,
		facets: t
	};
	let n = Iv(e), r = new Uint8Array(n), i = 0;
	for (let e of t) for (let t of e) r[t] && ++i, r[t] = 1;
	if (i === 0) return {
		data: e,
		facets: t
	};
	e = Tv(e);
	let a = e[X_] = new Uint32Array(n + i);
	t = t.map((e) => Tv(e, Uint32Array));
	let o = n;
	r.fill(0);
	for (let n of t) for (let t = 0, i = n.length; t < i; ++t) {
		let i = n[t];
		r[i] ? (n[t] = o, e[o] = e[i], a[o] = i, ++o) : a[i] = i, r[i] = 1;
	}
	return {
		data: e,
		facets: t
	};
}
//#endregion
//#region node_modules/@observablehq/plot/src/transforms/stack.js
function bE(e = {}, t = {}) {
	arguments.length === 1 && ([e, t] = SE(e));
	let { y1: n, y: r = n, x: i, ...a } = t, [o, s, c, l] = wE(r, i, "y", "x", e, a);
	return {
		...o,
		y1: n,
		y: s,
		x1: c,
		x2: l,
		x: Gv(c, l)
	};
}
function xE({ x: e, x1: t, x2: n, ...r } = {}) {
	return r = KC(r, "y"), t === void 0 && n === void 0 ? bE({
		x: e,
		...r
	}) : ([t, n] = Nv(e, t, n), {
		...r,
		x1: t,
		x2: n
	});
}
function SE(e) {
	let { offset: t, order: n, reverse: r, ...i } = e;
	return [{
		offset: t,
		order: n,
		reverse: r
	}, i];
}
var CE = { length: !0 };
function wE(e, t = ov, n, r, { offset: i, order: a, reverse: o }, s) {
	if (t === null) throw Error(`stack requires ${r}`);
	let c = Fv(s), [l, u] = Uv(e), [d, f] = Hv(t), [p, m] = Hv(t);
	return d.hint = p.hint = CE, i = TE(i), a = ME(a, i, r), [
		By(s, (r, s, l) => {
			({data: r, facets: s} = yE(r, s));
			let d = e == null ? void 0 : u(Kv(K(r, e), l?.[n])), p = K(r, t, Float64Array), h = K(r, c), g = a && a(r, d, p, h), _ = Iv(r), v = f(new Float64Array(_)), y = m(new Float64Array(_)), b = [];
			for (let e of s) {
				let t = d ? Array.from(E(e, (e) => d[e]).values()) : [e];
				if (g) for (let e of t) e.sort(g);
				for (let e of t) {
					let t = 0, n = 0;
					o && e.reverse();
					for (let r of e) {
						let e = p[r];
						e < 0 ? t = y[r] = (v[r] = t) + e : e > 0 ? n = y[r] = (v[r] = n) + e : y[r] = v[r] = n;
					}
				}
				b.push(t);
			}
			return i && i(b, v, y, h), {
				data: r,
				facets: s
			};
		}),
		l,
		d,
		p
	];
}
function TE(e) {
	if (e != null) {
		if (typeof e == "function") return e;
		switch (`${e}`.toLowerCase()) {
			case "expand":
			case "normalize": return DE;
			case "center":
			case "silhouette": return OE;
			case "wiggle": return kE;
		}
		throw Error(`unknown offset: ${e}`);
	}
}
function EE(e, t) {
	let n = 0, r = 0;
	for (let i of e) {
		let e = t[i];
		e < n && (n = e), e > r && (r = e);
	}
	return [n, r];
}
function DE(e, t, n) {
	for (let r of e) for (let e of r) {
		let [r, i] = EE(e, n);
		for (let a of e) {
			let e = 1 / (i - r || 1);
			t[a] = e * (t[a] - r), n[a] = e * (n[a] - r);
		}
	}
}
function OE(e, t, n) {
	for (let r of e) {
		for (let e of r) {
			let [r, i] = EE(e, n);
			for (let a of e) {
				let e = (i + r) / 2;
				t[a] -= e, n[a] -= e;
			}
		}
		AE(r, t, n);
	}
	jE(e, t, n);
}
function kE(e, t, n, r) {
	for (let i of e) {
		let e = new y(), a = 0;
		for (let o of i) {
			let i = -1, s = o.map((e) => Math.abs(n[e] - t[e])), c = o.map((a) => {
				i = r ? r[a] : ++i;
				let o = n[a] - t[a], s = e.has(i) ? o - e.get(i) : 0;
				return e.set(i, o), s;
			}), l = [0, ...m(c)];
			for (let e of o) t[e] += a, n[e] += a;
			let u = Ae(s);
			u && (a -= Ae(s, (e, t) => (c[t] / 2 + l[t]) * e) / u);
		}
		AE(i, t, n);
	}
	jE(e, t, n);
}
function AE(e, t, n) {
	let r = pe(e, (e) => pe(e, (e) => t[e]));
	for (let i of e) for (let e of i) t[e] -= r, n[e] -= r;
}
function jE(e, t, n) {
	let r = e.length;
	if (r === 1) return;
	let i = e.map((e) => e.flat()), a = i.map((e) => (pe(e, (e) => t[e]) + de(e, (e) => n[e])) / 2), o = pe(a);
	for (let e = 0; e < r; e++) {
		let r = o - a[e];
		for (let a of i[e]) t[a] += r, n[a] += r;
	}
}
function ME(e, t, n) {
	if (e === void 0 && t === kE) return LE(a_);
	if (e != null) {
		if (typeof e == "string") {
			let t = e.startsWith("-"), r = t ? o_ : a_;
			switch ((t ? e.slice(1) : e).toLowerCase()) {
				case "value":
				case n: return NE(r);
				case "z": return PE(r);
				case "sum": return FE(r);
				case "appearance": return IE(r);
				case "inside-out": return LE(r);
			}
			return RE(rv(e));
		}
		if (typeof e == "function") return (e.length === 1 ? RE : zE)(e);
		if (G_(e)) return BE(e);
		throw Error(`invalid order: ${e}`);
	}
}
function NE(e) {
	return (t, n, r) => (t, n) => e(r[t], r[n]);
}
function PE(e) {
	return (t, n, r, i) => (t, n) => e(i[t], i[n]);
}
function FE(e) {
	return VE(e, (e, t, n, r) => ne(Lv(e), (e) => Ae(e, (e) => n[e]), (e) => r[e]));
}
function IE(e) {
	return VE(e, (e, t, n, r) => ne(Lv(e), (e) => t[_e(e, (e) => n[e])], (e) => r[e]));
}
function LE(e) {
	return VE(e, (e, t, n, r) => {
		let i = Lv(e), a = ne(i, (e) => t[_e(e, (e) => n[e])], (e) => r[e]), o = D(i, (e) => Ae(e, (e) => n[e]), (e) => r[e]), s = [], c = [], l = 0;
		for (let e of a) l < 0 ? (l += o.get(e), s.push(e)) : (l -= o.get(e), c.push(e));
		return c.reverse().concat(s);
	});
}
function RE(e) {
	return (t) => {
		let n = K(t, e);
		return (e, t) => a_(n[e], n[t]);
	};
}
function zE(e) {
	return (t) => G_(t) ? (n, r) => e(t[n], t[r]) : (n, r) => e(t.get(n), t.get(r));
}
function BE(e) {
	return VE(a_, () => e);
}
function VE(e, t) {
	return (n, r, i, a) => {
		if (!a) throw Error("missing channel: z");
		let o = new y(t(n, r, i, a).map((e, t) => [e, t]));
		return (t, n) => e(o.get(a[t]), o.get(a[n]));
	};
}
//#endregion
//#region node_modules/@observablehq/plot/src/marks/rect.js
function HE(e, { inset: t = 0, insetTop: n = t, insetRight: r = t, insetBottom: i = t, insetLeft: a = t } = {}) {
	e.insetTop = lv(n), e.insetRight = lv(r), e.insetBottom = lv(i), e.insetLeft = lv(a);
}
function UE(e, { r: t, rx: n, ry: r, rx1: i = t, ry1: a = t, rx2: o = t, ry2: s = t, rx1y1: c = i === void 0 ? a === void 0 ? 0 : +a : +i, rx1y2: l = i === void 0 ? s === void 0 ? 0 : +s : +i, rx2y1: u = o === void 0 ? a === void 0 ? 0 : +a : +o, rx2y2: d = o === void 0 ? s === void 0 ? 0 : +s : +o } = {}) {
	c || l || u || d ? (e.rx1y1 = c, e.rx1y2 = l, e.rx2y1 = u, e.rx2y2 = d) : (e.rx = Q(n, "auto"), e.ry = Q(r, "auto"));
}
function WE(e, t, n, r, i, a) {
	let { rx1y1: o, rx1y2: s, rx2y1: c, rx2y2: l } = a;
	typeof t != "function" && (t = fv(t)), typeof n != "function" && (n = fv(n)), typeof r != "function" && (r = fv(r)), typeof i != "function" && (i = fv(i));
	let u = Math.max(Math.abs(o + c), Math.abs(s + l)), d = Math.max(Math.abs(o + s), Math.abs(c + l));
	e.attr("d", (e) => {
		let a = t(e), f = n(e), p = r(e), m = i(e), h = a > p, g = f > m, _ = h ? p : a, v = h ? a : p, y = g ? m : f, b = g ? f : m, x = Math.min(1, (v - _) / u, (b - y) / d), S = x * (h ? g ? l : c : g ? s : o), C = x * (h ? g ? s : o : g ? l : c), w = x * (h ? g ? o : s : g ? c : l), T = x * (h ? g ? c : l : g ? o : s);
		return `M${_},${y + KE(S, T)}A${S},${S} 0 0 ${S < 0 ? 0 : 1} ${_ + GE(S, T)},${y}H${v - GE(C, w)}A${C},${C} 0 0 ${C < 0 ? 0 : 1} ${v},${y + KE(C, w)}V${b - KE(w, C)}A${w},${w} 0 0 ${w < 0 ? 0 : 1} ${v - GE(w, C)},${b}H${_ + GE(T, S)}A${T},${T} 0 0 ${T < 0 ? 0 : 1} ${_},${b - KE(T, S)}Z`;
	});
}
function GE(e, t) {
	return t < 0 ? e : Math.abs(e);
}
function KE(e, t) {
	return t < 0 ? Math.abs(e) : e;
}
//#endregion
//#region node_modules/@observablehq/plot/src/marks/frame.js
var qE = {
	ariaLabel: "frame",
	fill: "none",
	stroke: "currentColor",
	clip: !1
}, JE = {
	ariaLabel: "frame",
	fill: null,
	stroke: "currentColor",
	strokeLinecap: "square",
	clip: !1
}, YE = class extends VC {
	constructor(e = {}) {
		let { anchor: t = null } = e;
		super(nv, void 0, e, t == null ? qE : JE), this.anchor = bv(t, "anchor", [
			"top",
			"right",
			"bottom",
			"left"
		]), HE(this, e), t || UE(this, e);
	}
	render(e, t, n, r, i) {
		let { marginTop: a, marginRight: o, marginBottom: s, marginLeft: c, width: l, height: u } = r, { anchor: d, insetTop: f, insetRight: p, insetBottom: m, insetLeft: h } = this, { rx: g, ry: _, rx1y1: v, rx1y2: y, rx2y1: b, rx2y2: x } = this, S = c + h, C = l - o - p, w = a + f, T = u - s - m;
		return X(d ? "svg:line" : v || y || b || x ? "svg:path" : "svg:rect", i).datum(0).call(jC, this, r, i).call(MC, this).call(bC, this, n).call(FC, this, {}).call(d === "left" ? (e) => e.attr("x1", S).attr("x2", S).attr("y1", w).attr("y2", T) : d === "right" ? (e) => e.attr("x1", C).attr("x2", C).attr("y1", w).attr("y2", T) : d === "top" ? (e) => e.attr("x1", S).attr("x2", C).attr("y1", w).attr("y2", w) : d === "bottom" ? (e) => e.attr("x1", S).attr("x2", C).attr("y1", T).attr("y2", T) : v || y || b || x ? (e) => e.call(WE, S, w, C, T, this) : (e) => e.attr("x", S).attr("y", w).attr("width", C - S).attr("height", T - w).attr("rx", g).attr("ry", _)).node();
	}
};
function XE(e) {
	return new YE(e);
}
//#endregion
//#region node_modules/@observablehq/plot/src/marks/tip.js
var ZE = {
	ariaLabel: "tip",
	fill: "var(--plot-background)",
	stroke: "currentColor"
}, QE = /* @__PURE__ */ new Set([
	"geometry",
	"href",
	"src",
	"ariaLabel",
	"scales"
]), $E = class extends VC {
	constructor(e, t = {}) {
		t.tip && (t = {
			...t,
			tip: !1
		}), t.title === void 0 && ny(e) && ry(e) && (t = {
			...t,
			title: av
		});
		let { x: n, y: r, x1: i, x2: a, y1: o, y2: s, anchor: c, preferredAnchor: l = "bottom", monospace: u, fontFamily: d = u ? "ui-monospace, monospace" : void 0, fontSize: f, fontStyle: p, fontVariant: m, fontWeight: h, lineHeight: g = 1, lineWidth: _ = 20, frameAnchor: v, format: y, textAnchor: b = "start", textOverflow: x, textPadding: S = 8, title: C, pointerSize: w = 12, pathFilter: T = "drop-shadow(0 3px 4px rgba(0,0,0,0.2))" } = t;
		super(e, {
			x: {
				value: i != null && a != null ? null : n,
				scale: "x",
				optional: !0
			},
			y: {
				value: o != null && s != null ? null : r,
				scale: "y",
				optional: !0
			},
			x1: {
				value: i,
				scale: "x",
				optional: a == null
			},
			y1: {
				value: o,
				scale: "y",
				optional: s == null
			},
			x2: {
				value: a,
				scale: "x",
				optional: i == null
			},
			y2: {
				value: s,
				scale: "y",
				optional: o == null
			},
			title: {
				value: C,
				optional: !0
			}
		}, t, ZE), this.anchor = gy(c, "anchor"), this.preferredAnchor = gy(l, "preferredAnchor"), this.frameAnchor = _y(v), this.textAnchor = Q(b, "middle"), this.textPadding = +S, this.pointerSize = +w, this.pathFilter = cv(T), this.lineHeight = +g, this.lineWidth = +_, this.textOverflow = Bw(x), this.monospace = !!u, this.fontFamily = cv(d), this.fontSize = lv(f), this.fontStyle = cv(p), this.fontVariant = cv(m), this.fontWeight = cv(h);
		for (let e in ZE) e in this.channels && (this[e] = ZE[e]);
		this.splitLines = eT(this), this.clipLine = tT(this), this.format = typeof y == "string" || typeof y == "function" ? { title: y } : { ...y };
	}
	render(e, t, n, r, i) {
		let a = this, { x: o, y: s, fx: c, fy: l } = t, { ownerSVGElement: u, document: d } = i, { anchor: f, monospace: p, lineHeight: m, lineWidth: h } = this, { textPadding: g, pointerSize: _, pathFilter: v } = this, { marginTop: y, marginLeft: b } = r, { x1: x, y1: S, x2: C, y2: w, x: T = x ?? C, y: E = S ?? w } = n, D = c ? c(e.fx) - b : 0, O = l ? l(e.fy) - y : 0, [k, A] = BC(this, r), j = tw(n, k), ee = nw(n, A), te = p ? $w : Qw, ne = te("…"), re, ie;
		"title" in n ? (re = iD.call(this, { title: n.channels.title }, t), ie = oD) : (re = iD.call(this, n.channels, t), ie = sD);
		let ae = X("svg:g", i).call(jC, this, r, i).call(Gw, this).call(FC, this, {
			x: T && o,
			y: E && s
		}).call((r) => r.selectAll().data(e).enter().append("g").attr("transform", (e) => `translate(${Math.round(j(e))},${Math.round(ee(e))})`).call(MC, this).call((e) => e.append("path").attr("filter", v)).call((r) => r.append("text").each(function(r) {
			let i = Zn(this);
			this.setAttribute("fill", "currentColor"), this.setAttribute("fill-opacity", 1), this.setAttribute("stroke", "none");
			let o = ie.call(a, r, e, re, t, n);
			if (typeof o == "string") for (let e of a.splitLines(o)) oe(i, { value: a.clipLine(e) });
			else {
				let e = /* @__PURE__ */ new Set();
				for (let t of o) {
					let { label: n = "" } = t;
					n && e.has(n) || (e.add(n), oe(i, t));
				}
			}
		})));
		function oe(e, { label: t, value: n, color: r, opacity: i }) {
			t ??= "", n ??= "";
			let a = r != null || i != null, o, s = h * 100, [c] = nT(t, s, te, ne);
			if (c >= 0) t = t.slice(0, c).trimEnd() + "…", o = n.trim(), n = "";
			else {
				(t || !n && !a) && (n = " " + n);
				let [e] = nT(n, s - te(t), te, ne);
				e >= 0 && (o = n.trim(), n = n.slice(0, e).trimEnd() + "…");
			}
			let l = e.append("tspan").attr("x", 0).attr("dy", `${m}em`).text("​");
			t && l.append("tspan").attr("font-weight", "bold").text(t), n && l.append(() => d.createTextNode(n)), a && l.append("tspan").text(" ■").attr("fill", r).attr("fill-opacity", i).style("user-select", "none"), o && l.append("title").text(o);
		}
		function se() {
			let { width: e, height: t } = r.facet ?? r;
			ae.selectChildren().each(function(n) {
				let { x: r, width: i, height: o } = this.getBBox();
				i = Math.round(i), o = Math.round(o);
				let s = f;
				if (s === void 0) {
					let r = j(n) + D, c = ee(n) + O, l = r + i + _ + g * 2 < e, u = r - i - _ - g * 2 > 0, d = c + o + _ + g * 2 < t, f = c - o - _ - g * 2 > 0;
					s = l && u ? d && f ? a.preferredAnchor : f ? "bottom" : "top" : d && f ? l ? "left" : "right" : (l || u) && (d || f) ? `${f ? "bottom" : "top"}-${l ? "left" : "right"}` : a.preferredAnchor;
				}
				let c = this.firstChild, l = this.lastChild;
				if (c.setAttribute("d", rD(s, _, g, i, o)), r) for (let e of l.childNodes) e.setAttribute("x", -r);
				l.setAttribute("y", `${+tD(s, l.childNodes.length, m).toFixed(6)}em`), l.setAttribute("transform", `translate(${nD(s, _, g, i, o)})`);
			}), ae.attr("visibility", null);
		}
		return e.length && (ae.attr("visibility", "hidden"), u.isConnected ? Promise.resolve().then(se) : typeof requestAnimationFrame < "u" && requestAnimationFrame(se)), ae.node();
	}
};
function eD(e, { x: t, y: n, ...r } = {}) {
	return r.frameAnchor === void 0 && ([t, n] = Pv(t, n)), new $E(e, {
		...r,
		x: t,
		y: n
	});
}
function tD(e, t, n) {
	return /^top(?:-|$)/.test(e) ? .94 - n : -.29 - t * n;
}
function nD(e, t, n, r, i) {
	switch (e) {
		case "middle": return [-r / 2, i / 2];
		case "top-left": return [n, t + n];
		case "top": return [-r / 2, t / 2 + n];
		case "top-right": return [-r - n, t + n];
		case "right": return [-t / 2 - r - n, i / 2];
		case "bottom-left": return [n, -t - n];
		case "bottom": return [-r / 2, -t / 2 - n];
		case "bottom-right": return [-r - n, -t - n];
		case "left": return [n + t / 2, i / 2];
	}
}
function rD(e, t, n, r, i) {
	let a = r + n * 2, o = i + n * 2;
	switch (e) {
		case "middle": return `M${-a / 2},${-o / 2}h${a}v${o}h${-a}z`;
		case "top-left": return `M0,0l${t},${t}h${a - t}v${o}h${-a}z`;
		case "top": return `M0,0l${t / 2},${t / 2}h${(a - t) / 2}v${o}h${-a}v${-o}h${(a - t) / 2}z`;
		case "top-right": return `M0,0l${-t},${t}h${t - a}v${o}h${a}z`;
		case "right": return `M0,0l${-t / 2},${-t / 2}v${t / 2 - o / 2}h${-a}v${o}h${a}v${t / 2 - o / 2}z`;
		case "bottom-left": return `M0,0l${t},${-t}h${a - t}v${-o}h${-a}z`;
		case "bottom": return `M0,0l${t / 2},${-t / 2}h${(a - t) / 2}v${-o}h${-a}v${o}h${(a - t) / 2}z`;
		case "bottom-right": return `M0,0l${-t},${-t}h${t - a}v${-o}h${a}z`;
		case "left": return `M0,0l${t / 2},${-t / 2}v${t / 2 - o / 2}h${a}v${o}h${-a}v${t / 2 - o / 2}z`;
	}
}
function iD(e, t) {
	let n = {}, r = this.format;
	r = aD(r, e, "x"), r = aD(r, e, "y"), this.format = r;
	for (let t in r) {
		let i = r[t];
		if (i !== null && i !== !1) {
			if (t === "fx" || t === "fy") n[t] = !0;
			else {
				let r = Mb(e, t);
				r && (n[t] = r);
			}
		}
	}
	for (let t in e) {
		if (t in n || t in r || QE.has(t) || (t === "x" || t === "y") && e.geometry) continue;
		let i = Mb(e, t);
		if (i) {
			if (i.scale == null && i.defaultScale === "color") continue;
			n[t] = i;
		}
	}
	this.facet && (t.fx && !("fx" in r) && (n.fx = !0), t.fy && !("fy" in r) && (n.fy = !0));
	for (let e in n) {
		let r = this.format[e];
		if (typeof r == "string") {
			let i = n[e]?.value ?? t[e]?.domain() ?? [];
			this.format[e] = (ay(i) ? Lp : bs)(r);
		} else if (r === void 0 || r === !0) {
			let n = t[e];
			this.format[e] = n?.bandwidth ? ZT(n, n.domain()) : dC;
		}
	}
	return n;
}
function aD(e, t, n) {
	if (!(n in e)) return e;
	let r = `${n}1`, i = `${n}2`;
	if ((r in e || !(r in t)) && (i in e || !(i in t))) return e;
	let a = Object.entries(e), o = e[n];
	return a.splice(a.findIndex(([e]) => e === n) + 1, 0, [r, o], [i, o]), Object.fromEntries(a);
}
function oD(e, t, { title: n }) {
	return this.format.title(n.value[e], e);
}
function* sD(e, t, n, r, i) {
	for (let a in n) {
		if (a === "fx" || a === "fy") {
			yield {
				label: uD(r, n, a),
				value: this.format[a](t[a], e)
			};
			continue;
		}
		if (a === "x1" && "x2" in n || a === "y1" && "y2" in n) continue;
		let o = n[a];
		if (a === "x2" && "x1" in n) yield {
			label: lD(r, n, "x"),
			value: cD(this.format.x2, n.x1, o, e)
		};
		else if (a === "y2" && "y1" in n) yield {
			label: lD(r, n, "y"),
			value: cD(this.format.y2, n.y1, o, e)
		};
		else {
			let t = o.value[e], s = o.scale;
			if (!i_(t) && s == null) continue;
			yield {
				label: uD(r, n, a),
				value: this.format[a](t, e),
				color: s === "color" ? i[a][e] : null,
				opacity: s === "opacity" ? i[a][e] : null
			};
		}
	}
}
function cD(e, t, n, r) {
	return n.hint?.length ? `${e(n.value[r] - t.value[r], r)}` : `${e(t.value[r], r)}–${e(n.value[r], r)}`;
}
function lD(e, t, n) {
	let r = uD(e, t, `${n}1`, n), i = uD(e, t, `${n}2`, n);
	return r === i ? r : `${r}–${i}`;
}
function uD(e, t, n, r = n) {
	let i = t[n], a = e[i?.scale ?? n];
	return String(a?.label ?? i?.label ?? r);
}
//#endregion
//#region node_modules/@observablehq/plot/src/plot.js
function dD(e = {}) {
	let { facet: t, style: n, title: r, subtitle: i, caption: a, ariaLabel: o, ariaDescription: s } = e, c = RC(e.className), l = e.marks === void 0 ? [] : mD(e.marks);
	l.push(...TD(l));
	let u = SD(t, e), d = /* @__PURE__ */ new Map();
	for (let t of l) {
		let n = CD(t, u, e);
		n && d.set(t, n);
	}
	let f = /* @__PURE__ */ new Map();
	u && bD(f, [u], e), bD(f, d, e);
	let p = mD(ED(l, f, e));
	for (let t of p) {
		let n = CD(t, u, e);
		n && d.set(t, n);
	}
	l.unshift(...p);
	let m = vS(f, e);
	if (m !== void 0) {
		let e = u ? BS(m, u) : void 0;
		for (let t of l) {
			if (t.facet === null || t.facet === "super") continue;
			let n = d.get(t);
			n !== void 0 && (n.facetsIndex = t.fx != null || t.fy != null ? BS(m, n) : e);
		}
		let t = /* @__PURE__ */ new Set();
		for (let { facetsIndex: e } of d.values()) e?.forEach((e, n) => {
			e?.length > 0 && t.add(n);
		});
		m.forEach(0 < t.size && t.size < m.length ? (e, n) => e.empty = !t.has(n) : (e) => e.empty = !1);
		for (let e of l) if (e.facet === "exclude") {
			let t = d.get(e);
			t !== void 0 && (t.facetsIndex = SS(t.facetsIndex));
		}
	}
	for (let t of J.keys()) Av(e[t]) && t !== "fx" && t !== "fy" && f.set(t, []);
	let h = /* @__PURE__ */ new Map();
	for (let t of l) {
		if (h.has(t)) throw Error("duplicate mark; each mark must be unique");
		let { facetsIndex: n, channels: r } = d.get(t) ?? {}, { data: i, facets: a, channels: o } = t.initialize(n, r, e);
		_D(o, e), h.set(t, {
			data: i,
			facets: a,
			channels: o
		});
	}
	let g = Kx(bD(f, h, e), e), _ = qC(g, l, e);
	Jx(g, _);
	let v = qx(g), { fx: y, fy: b } = v, x = y || b ? Qx(g, _) : _, S = y || b ? LD(v, _) : _, C = nC(e), w = C.document, T = tt("svg").call(w.documentElement), E = T;
	C.ownerSVGElement = T, C.className = c, C.projection = WS(e, x), C.path = function() {
		return jl(this.projection ?? tC(v));
	}, C.filterFacets = (e, t) => BS(m, {
		channels: t,
		groups: bS(e, t)
	}), C.getMarkState = (e) => {
		let t = h.get(e), n = d.get(e);
		return {
			...t,
			channels: {
				...t.channels,
				...n?.channels
			}
		};
	}, C.dispatchValue = (e) => {
		E.value !== e && (E.value = e, E.dispatchEvent(new C.document.defaultView.Event("input", { bubbles: !0 })));
	};
	let D = /* @__PURE__ */ new Set();
	for (let [t, n] of h) if (t.initializer != null) {
		let r = t.facet === "super" ? S : x, i = t.initializer(n.data, n.facets, n.channels, v, r, C);
		if (i.data !== void 0 && (n.data = i.data), i.facets !== void 0 && (n.facets = i.facets), i.channels !== void 0) {
			let { fx: r, fy: a, ...o } = i.channels;
			yD(o), Object.assign(n.channels, o);
			for (let t of Object.values(o)) {
				let { scale: n } = t;
				n != null && !My(J.get(n)) && (vD(t, e), D.add(n));
			}
			(r != null || a != null) && d.set(t, !0);
		}
	}
	if (D.size) {
		let t = /* @__PURE__ */ new Map();
		bD(t, h, e, (e) => D.has(e)), bD(f, h, e, (e) => D.has(e));
		let n = ID(Kx(t, e), g), { scales: r, ...i } = qx(n);
		Object.assign(g, n), Object.assign(v, i), Object.assign(v.scales, r);
	}
	let O, k;
	m !== void 0 && (O = {
		x: y?.domain(),
		y: b?.domain()
	}, m = yS(m, O), k = xS(y, b, _));
	for (let [e, t] of h) t.values = e.scale(t.channels, v, C);
	let { width: A, height: j } = _;
	Zn(T).attr("class", c).attr("fill", "currentColor").attr("font-family", "system-ui, sans-serif").attr("font-size", 10).attr("text-anchor", "middle").attr("width", A).attr("height", j).attr("viewBox", `0 0 ${A} ${j}`).attr("aria-label", o).attr("aria-description", s).call((e) => e.append("style").text(`:where(.${c}) {
  --plot-background: white;
  display: block;
  height: auto;
  height: intrinsic;
  max-width: 100%;
}
:where(.${c} text),
:where(.${c} tspan) {
  white-space: pre;
}`)).call(zC, n);
	for (let e of l) {
		let { channels: t, values: n, facets: r } = h.get(e);
		if (m === void 0 || e.facet === "super") {
			let i = null;
			if (r && (i = r[0], i = e.filter(i, t, n), i.length === 0)) continue;
			let a = e.render(i, v, n, S, C);
			if (a == null) continue;
			T.appendChild(a);
		} else {
			let i;
			for (let a of m) {
				if (!(e.facetAnchor?.(m, O, a) ?? !a.empty)) continue;
				let o = null;
				if (r) {
					let i = d.has(e);
					if (o = r[i ? a.i : 0], o = e.filter(o, t, n), o.length === 0) continue;
					!i && o === r[0] && (o = zv(o)), o.fx = a.x, o.fy = a.y, o.fi = a.i;
				}
				let s = e.render(o, v, n, x, C);
				if (s != null) {
					(i ??= Zn(T).append("g")).append(() => s).datum(a);
					for (let e of [
						"aria-label",
						"aria-description",
						"aria-hidden",
						"transform"
					]) s.hasAttribute(e) && (i.attr(e, s.getAttribute(e)), s.removeAttribute(e));
				}
			}
			i?.selectChildren().each(k);
		}
	}
	let ee = _E(g, C, e), { figure: te = r != null || i != null || a != null || ee.length > 0 } = e;
	te && (E = w.createElement("figure"), E.className = `${c}-figure`, E.style.maxWidth = "initial", r != null && E.append(fD(w, r, "h2")), i != null && E.append(fD(w, i, "h3")), E.append(...ee, T), a != null && E.append(pD(w, a)), "value" in T && (E.value = T.value, delete T.value)), E.scale = gS(v.scales), E.legend = fE(g, C, e);
	let ne = bx();
	return ne > 0 && Zn(T).append("text").attr("x", A).attr("y", 20).attr("dy", "-1em").attr("text-anchor", "end").attr("font-family", "initial").text("⚠️").append("title").text(`${ne.toLocaleString("en-US")} warning${ne === 1 ? "" : "s"}. Please check the console.`), E;
}
function fD(e, t, n) {
	if (t.ownerDocument) return t;
	let r = e.createElement(n);
	return r.append(t), r;
}
function pD(e, t) {
	let n = e.createElement("figcaption");
	return n.append(t), n;
}
function mD(e) {
	return e.flat(Infinity).filter((e) => e != null).map(hD);
}
function hD(e) {
	return typeof e.render == "function" ? e : new gD(e);
}
var gD = class extends VC {
	constructor(e) {
		if (typeof e != "function") throw TypeError("invalid mark; missing render function");
		super(), this.render = e;
	}
	render() {}
};
function _D(e, t) {
	for (let n in e) vD(e[n], t);
	return e;
}
function vD(e, t) {
	let { scale: n, transform: r = !0 } = e;
	if (n == null || !r) return;
	let { type: i, percent: a, interval: o, transform: s = a ? (e) => e == null ? NaN : e * 100 : qv(o, i) } = t[n] ?? {};
	s != null && (e.value = q(e.value, s), e.transform = !1);
}
function yD(e) {
	for (let t in e) Cb(t, e[t]);
}
function bD(e, t, n, r = sv) {
	for (let { channels: i } of t.values()) for (let t in i) {
		let a = i[t], { scale: o } = a;
		if (o != null && r(o)) {
			if (o === "projection") {
				if (!QS(n)) {
					let t = n.x?.domain === void 0, r = n.y?.domain === void 0;
					if (t || r) {
						let [n, i] = eC(a);
						t && xD(e, "x", n), r && xD(e, "y", i);
					}
				}
			} else xD(e, o, a);
		}
	}
	return e;
}
function xD(e, t, n) {
	let r = e.get(t);
	r === void 0 ? e.set(t, [n]) : r.push(n);
}
function SD(e, t) {
	if (e == null) return;
	let { x: n, y: r } = e;
	if (n == null && r == null) return;
	let i = Sv(e.data);
	if (i == null) throw Error("missing facet data");
	let a = {};
	return n != null && (a.fx = bb(i, {
		value: n,
		scale: "fx"
	})), r != null && (a.fy = bb(i, {
		value: r,
		scale: "fy"
	})), _D(a, t), {
		channels: a,
		groups: bS(i, a),
		data: e.data
	};
}
function CD(e, t, n) {
	if (e.facet === null || e.facet === "super") return;
	let { fx: r, fy: i } = e;
	if (r != null || i != null) {
		let t = Sv(e.data ?? r ?? i);
		if (t === void 0) throw Error(`missing facet data in ${e.ariaLabel}`);
		if (t === null) return;
		let a = {};
		return r != null && (a.fx = bb(t, {
			value: r,
			scale: "fx"
		})), i != null && (a.fy = bb(t, {
			value: i,
			scale: "fy"
		})), _D(a, n), {
			channels: a,
			groups: bS(t, a)
		};
	}
	if (t === void 0) return;
	let { channels: a, groups: o, data: s } = t;
	if (e.facet !== "auto" || e.data === s) return {
		channels: a,
		groups: o
	};
	s.length > 0 && (o.size > 1 || o.size === 1 && a.fx && a.fy && [...o][0][1].size > 1) && Iv(Sv(e.data)) === Iv(s) && xx(`Warning: the ${e.ariaLabel} mark appears to use faceted data, but isn’t faceted. The mark data has the same length as the facet data and the mark facet option is "auto", but the mark data and facet data are distinct. If this mark should be faceted, set the mark facet option to true; otherwise, suppress this warning by setting the mark facet option to false.`);
}
function wD(e, t = {}) {
	return Vy({
		...t,
		x: null,
		y: null
	}, (t, n, r, i, a, o) => o.getMarkState(e));
}
function TD(e) {
	let t = [];
	for (let n of e) {
		let e = n.tip;
		if (e) {
			e === !0 ? e = {} : typeof e == "string" && (e = { pointer: e });
			let { pointer: r, preferredAnchor: i } = e;
			r = /^x$/i.test(r) ? $C : /^y$/i.test(r) ? ew : QC, e = r(wD(n, e)), e.title = null, i === void 0 && (e.preferredAnchor = r === ew ? "left" : "bottom");
			let a = eD(n.data, e);
			a.facet = n.facet, a.facetAnchor = n.facetAnchor, t.push(a);
		}
	}
	return t;
}
function ED(e, t, n) {
	let { projection: r, x: i = {}, y: a = {}, fx: o = {}, fy: s = {}, axis: c, grid: l, facet: u = {}, facet: { axis: d = c, grid: f } = u, x: { axis: p = c, grid: m = p === null ? null : l } = i, y: { axis: h = c, grid: g = h === null ? null : l } = a, fx: { axis: _ = d, grid: v = _ === null ? null : f } = o, fy: { axis: y = d, grid: b = y === null ? null : f } = s } = n;
	(r || !Av(i) && !FD("x", e)) && (p = m = null), (r || !Av(a) && !FD("y", e)) && (h = g = null), t.has("fx") || (_ = v = null), t.has("fy") || (y = b = null), p === void 0 && (p = !PD(e, "x")), h === void 0 && (h = !PD(e, "y")), _ === void 0 && (_ = !PD(e, "fx")), y === void 0 && (y = !PD(e, "fy")), p === !0 && (p = "bottom"), h === !0 && (h = "left"), _ === !0 && (_ = p === "top" || p === null ? "bottom" : "top"), y === !0 && (y = h === "right" || h === null ? "left" : "right");
	let x = [];
	return OD(x, b, VT, s), DD(x, y, jT, "right", "left", u, s), OD(x, v, UT, o), DD(x, _, NT, "top", "bottom", u, o), OD(x, g, BT, a), DD(x, h, AT, "left", "right", n, a), OD(x, m, HT, i), DD(x, p, MT, "bottom", "top", n, i), x;
}
function DD(e, t, n, r, i, a, o) {
	if (!t) return;
	let s = kD(t);
	o = AD(s ? r : t, a, o);
	let { line: c } = o;
	(n === AT || n === MT) && c && !my(c) && e.push(XE(jD(o))), e.push(n(o)), s && e.push(n({
		...o,
		anchor: i,
		label: null
	}));
}
function OD(e, t, n, r) {
	!t || my(t) || e.push(n(MD(t, r)));
}
function kD(e) {
	return /^\s*both\s*$/i.test(e);
}
function AD(e, t, { line: n = t.line, ticks: r, tickSize: i, tickSpacing: a, tickPadding: o, tickFormat: s, tickRotate: c, fontVariant: l, ariaLabel: u, ariaDescription: d, label: f = t.label, labelAnchor: p, labelArrow: m = t.labelArrow, labelOffset: h }) {
	return {
		anchor: e,
		line: n,
		ticks: r,
		tickSize: i,
		tickSpacing: a,
		tickPadding: o,
		tickFormat: s,
		tickRotate: c,
		fontVariant: l,
		ariaLabel: u,
		ariaDescription: d,
		label: f,
		labelAnchor: p,
		labelArrow: m,
		labelOffset: h
	};
}
function jD(e) {
	let { anchor: t, line: n } = e;
	return {
		anchor: t,
		facetAnchor: t + "-empty",
		stroke: n === !0 ? void 0 : n
	};
}
function MD(e, { stroke: t = dy(e) ? e : void 0, ticks: n = ND(e) ? e : void 0, tickSpacing: r, ariaLabel: i, ariaDescription: a }) {
	return {
		stroke: t,
		ticks: n,
		tickSpacing: r,
		ariaLabel: i,
		ariaDescription: a
	};
}
function ND(e) {
	switch (typeof e) {
		case "number": return !0;
		case "string": return !dy(e);
	}
	return ny(e) || typeof e?.range == "function";
}
function PD(e, t) {
	let n = `${t}-axis `;
	return e.some((e) => e.ariaLabel?.startsWith(n));
}
function FD(e, t) {
	for (let n of t) for (let t in n.channels) {
		let { scale: r } = n.channels[t];
		if (r === e || r === "projection") return !0;
	}
	return !1;
}
function ID(e, t) {
	for (let n in e) {
		let r = e[n], i = t[n];
		r.label === void 0 && i && (r.label = i.label);
	}
	return e;
}
function LD({ fx: e, fy: t }, n) {
	let { marginTop: r, marginRight: i, marginBottom: a, marginLeft: o, width: s, height: c } = Zx(n), l = e && RD(e), u = t && RD(t);
	return {
		marginTop: t ? u[0] : r,
		marginRight: e ? s - l[1] : i,
		marginBottom: t ? c - u[1] : a,
		marginLeft: e ? l[0] : o,
		inset: {
			marginTop: n.marginTop,
			marginRight: n.marginRight,
			marginBottom: n.marginBottom,
			marginLeft: n.marginLeft
		},
		width: s,
		height: c
	};
}
function RD(e) {
	let t = e.domain();
	if (t.length === 0) return [0, e.bandwidth()];
	let n = e(t[0]), r = e(t[t.length - 1]);
	return r < n && ([n, r] = [r, n]), [n, r + e.bandwidth()];
}
//#endregion
//#region node_modules/@observablehq/plot/src/curve.js
var zD = /* @__PURE__ */ new Map([
	["basis", gg],
	["basis-closed", vg],
	["basis-open", bg],
	["bundle", Sg],
	["bump-x", Lh],
	["bump-y", Rh],
	["cardinal", Tg],
	["cardinal-closed", Dg],
	["cardinal-open", kg],
	["catmull-rom", Mg],
	["catmull-rom-closed", Pg],
	["catmull-rom-open", Ig],
	["linear", Mh],
	["linear-closed", Rg],
	["monotone-x", Kg],
	["monotone-y", qg],
	["natural", Xg],
	["step", Qg],
	["step-after", e_],
	["step-before", $g]
]);
function BD(e = Mh, t) {
	if (typeof e == "function") return e;
	let n = zD.get(`${e}`.toLowerCase());
	if (!n) throw Error(`unknown curve: ${e}`);
	if (t !== void 0) {
		if ("beta" in n) return n.beta(t);
		if ("tension" in n) return n.tension(t);
		if ("alpha" in n) return n.alpha(t);
	}
	return n;
}
function VD(e = HD, t) {
	return typeof e != "function" && `${e}`.toLowerCase() === "auto" ? HD : BD(e, t);
}
function HD(e) {
	return Mh(e);
}
//#endregion
//#region node_modules/@observablehq/plot/src/transforms/bin.js
function UD(e = { y: "count" }, t = {}) {
	[e, t] = qD(e, t);
	let { x: n, y: r } = t;
	return KD(JD(n, t, av), null, null, r, e, bw(t));
}
function WD(e, t, n = {}) {
	if (n?.interval == null) return n;
	let { reduce: r = fb } = n, i = { filter: null };
	return n[t] != null && (i[t] = r), n[`${t}1`] != null && (i[`${t}1`] = r), n[`${t}2`] != null && (i[`${t}2`] = r), e(i, n);
}
function GD(e = {}) {
	return WD(UD, "y", KC(e, "x"));
}
function KD(e, t, n, r, { data: i = db, filter: a = hb, sort: o, reverse: s, ...c } = {}, l = {}) {
	e = YD(e), t = YD(t), c = ZD(c, l), i = eO(i, av), o = o == null ? void 0 : QD("sort", o, l), a = a == null ? void 0 : $D("filter", a, l), n != null && Zy(c, "x", "x1", "x2") && (n = null), r != null && Zy(c, "y", "y1", "y2") && (r = null);
	let [u, d] = Uv(e), [f, p] = Uv(e), [m, h] = Uv(t), [g, _] = Uv(t), [v, y] = n == null ? r == null ? [] : [r, "y"] : [n, "x"], [b, x] = Uv(v), { x: S, y: C, z: w, fill: T, stroke: E, x1: D, x2: O, y1: k, y2: A, domain: j, cumulative: ee, thresholds: te, interval: ne, ...re } = l, [ie, ae] = Uv(w), [oe] = vv(T), [se] = vv(E), [ce, le] = Uv(oe), [ue, de] = Uv(se);
	return {
		..."z" in l && { z: ie || w },
		..."fill" in l && { fill: ce || T },
		..."stroke" in l && { stroke: ue || E },
		...By(re, (n, r, l) => {
			let u = Kv(K(n, v), l?.[y]), f = K(n, w), m = K(n, oe), g = K(n, se), b = ab(c, {
				z: f,
				fill: m,
				stroke: g
			}), S = [], C = [], T = u && x([]), E = f && ae([]), D = m && le([]), O = g && de([]), k = e && d([]), A = e && p([]), j = t && h([]), ee = t && _([]), te = iO(e, t, n), ne = 0;
			for (let e of c) e.initialize(n);
			o && o.initialize(n), a && a.initialize(n);
			for (let e of r) {
				let t = [];
				for (let t of c) t.scope("facet", e);
				o && o.scope("facet", e), a && a.scope("facet", e);
				for (let [r, s] of nb(e, b)) for (let [e, l] of nb(s, u)) for (let [s, d] of te(l)) if (b && (d.z = r), !(a && !a.reduce(s, d))) {
					t.push(ne++), C.push(i.reduceIndex(s, n, d)), u && T.push(e), f && E.push(b === f ? r : f[(s.length > 0 ? s : l)[0]]), m && D.push(b === m ? r : m[(s.length > 0 ? s : l)[0]]), g && O.push(b === g ? r : g[(s.length > 0 ? s : l)[0]]), k && (k.push(d.x1), A.push(d.x2)), j && (j.push(d.y1), ee.push(d.y2));
					for (let e of c) e.reduce(s, d);
					o && o.reduce(s, d);
				}
				S.push(t);
			}
			return ob(S, o, s), {
				data: C,
				facets: S
			};
		}),
		...!Zy(c, "x") && (u ? {
			x1: u,
			x2: f,
			x: Gv(u, f)
		} : {
			x: S,
			x1: D,
			x2: O
		}),
		...!Zy(c, "y") && (m ? {
			y1: m,
			y2: g,
			y: Gv(m, g)
		} : {
			y: C,
			y1: k,
			y2: A
		}),
		...b && { [y]: b },
		...Object.fromEntries(c.map(({ name: e, output: t }) => [e, t]))
	};
}
function qD({ cumulative: e, domain: t, thresholds: n, interval: r, ...i }, a) {
	return [i, {
		cumulative: e,
		domain: t,
		thresholds: n,
		interval: r,
		...a
	}];
}
function JD(e, { cumulative: t, domain: n, thresholds: r, interval: i }, a) {
	return e = { ...ey(e) }, e.domain === void 0 && (e.domain = n), e.cumulative === void 0 && (e.cumulative = t), e.thresholds === void 0 && (e.thresholds = r), e.interval === void 0 && (e.interval = i), e.value === void 0 && (e.value = a), e.thresholds = XD(e.thresholds, e.interval), e;
}
function YD(e) {
	if (e == null) return;
	let { value: t, cumulative: n, domain: r = _, thresholds: i } = e, a = (e) => {
		let a = K(e, t), o;
		if (ay(a) || rO(i)) {
			a = q(a, _v, Float64Array);
			let [e, t] = typeof r == "function" ? r(a) : r, n = typeof i == "function" && !$v(i) ? i(a, e, t) : i;
			typeof n == "number" && (n = pf(e, t, n)), $v(n) && (r === _ && (e = n.floor(e), t = n.offset(n.floor(t))), n = n.range(e, n.offset(t))), o = n;
		} else {
			a = mv(a);
			let [e, t] = typeof r == "function" ? r(a) : r, n = typeof i == "function" && !$v(i) ? i(a, e, t) : i;
			if (typeof n == "number") {
				if (r === _) {
					let r = ce(e, t, n);
					if (isFinite(r)) {
						if (r > 0) {
							let i = Math.round(e / r), a = Math.round(t / r);
							i * r <= e || --i, a * r > t || ++a;
							let o = a - i + 1;
							n = new Float64Array(o);
							for (let e = 0; e < o; ++e) n[e] = (i + e) * r;
						} else if (r < 0) {
							r = -r;
							let i = Math.round(e * r), a = Math.round(t * r);
							i / r <= e || --i, a / r > t || ++a;
							let o = a - i + 1;
							n = new Float64Array(o);
							for (let e = 0; e < o; ++e) n[e] = (i + e) / r;
						} else n = [e];
					} else n = [e];
				} else n = se(e, t, n);
			} else $v(n) && (r === _ && (e = n.floor(e), t = n.offset(n.floor(t))), n = n.range(e, n.offset(t)));
			o = n;
		}
		let s = [];
		if (o.length === 1) s.push([o[0], o[0]]);
		else for (let e = 1; e < o.length; ++e) s.push([o[e - 1], o[e]]);
		return s.bin = (n < 0 ? sO : n > 0 ? oO : aO)(s, o, a), s;
	};
	return a.label = Wv(t), a;
}
function XD(e, t, n = nO) {
	if (e === void 0) return t === void 0 ? n : Xv(t);
	if (typeof e == "string") {
		switch (e.toLowerCase()) {
			case "freedman-diaconis": return be;
			case "scott": return xe;
			case "sturges": return ue;
			case "auto": return nO;
		}
		return F_(e);
	}
	return e;
}
function ZD(e, t) {
	return Qy(e, t, QD);
}
function QD(e, t, n) {
	return $y(e, t, n, $D);
}
function $D(e, t, n) {
	return tb(e, t, n, eO);
}
function eO(e, t) {
	return rb(e, t, tO);
}
function tO(e) {
	switch (`${e}`.toLowerCase()) {
		case "x": return lO;
		case "x1": return dO;
		case "x2": return fO;
		case "y": return uO;
		case "y1": return pO;
		case "y2": return mO;
		case "z": return yb;
	}
	throw Error(`invalid bin reduce: ${e}`);
}
function nO(e, t, n) {
	return Math.min(200, xe(e, t, n));
}
function rO(e) {
	return Qv(e) || ny(e) && ay(e);
}
function iO(e, t, n) {
	let r = e?.(n), i = t?.(n);
	return r && i ? function* (e) {
		let t = r.bin(e);
		for (let [e, [a, o]] of r.entries()) {
			let r = i.bin(t[e]);
			for (let [e, [t, s]] of i.entries()) yield [r[e], {
				data: n,
				x1: a,
				y1: t,
				x2: o,
				y2: s
			}];
		}
	} : r ? function* (e) {
		let t = r.bin(e);
		for (let [e, [i, a]] of r.entries()) yield [t[e], {
			data: n,
			x1: i,
			x2: a
		}];
	} : function* (e) {
		let t = i.bin(e);
		for (let [e, [r, a]] of i.entries()) yield [t[e], {
			data: n,
			y1: r,
			y2: a
		}];
	};
}
function aO(e, t, n) {
	return t = mv(t), (r) => {
		let i = e.map(() => []);
		for (let e of r) i[s(t, n[e]) - 1]?.push(e);
		return i;
	};
}
function oO(e, t, n) {
	let r = aO(e, t, n);
	return (e) => {
		let t = r(e);
		for (let e = 1, n = t.length; e < n; ++e) {
			let n = t[e - 1], r = t[e];
			for (let e of n) r.push(e);
		}
		return t;
	};
}
function sO(e, t, n) {
	let r = aO(e, t, n);
	return (e) => {
		let t = r(e);
		for (let e = t.length - 2; e >= 0; --e) {
			let n = t[e + 1], r = t[e];
			for (let e of n) r.push(e);
		}
		return t;
	};
}
function cO(e, t) {
	let n = (+e + +t) / 2;
	return e instanceof Date ? new Date(n) : n;
}
var lO = { reduceIndex(e, t, { x1: n, x2: r }) {
	return cO(n, r);
} }, uO = { reduceIndex(e, t, { y1: n, y2: r }) {
	return cO(n, r);
} }, dO = { reduceIndex(e, t, { x1: n }) {
	return n;
} }, fO = { reduceIndex(e, t, { x2: n }) {
	return n;
} }, pO = { reduceIndex(e, t, { y1: n }) {
	return n;
} }, mO = { reduceIndex(e, t, { y2: n }) {
	return n;
} }, hO = { ariaLabel: "bar" }, gO = class extends VC {
	constructor(e, t, n = {}, r = hO) {
		super(e, t, n, r), HE(this, n), UE(this, n);
	}
	render(e, t, n, r, i) {
		let { rx: a, ry: o, rx1y1: s, rx1y2: c, rx2y1: l, rx2y2: u } = this, d = this._x(t, n, r), f = this._y(t, n, r), p = this._width(t, n, r), m = this._height(t, n, r);
		return X("svg:g", i).call(jC, this, r, i).call(this._transform, this, t).call((t) => t.selectAll().data(e).enter().call(s || c || l || u ? (e) => e.append("path").call(MC, this).call(WE, d, f, _O(d, p), _O(f, m), this).call(bC, this, n) : (e) => e.append("rect").call(MC, this).attr("x", d).attr("width", p).attr("y", f).attr("height", m).call(Z, "rx", a).call(Z, "ry", o).call(bC, this, n))).node();
	}
	_x(e, { x: t }, { marginLeft: n }) {
		let { insetLeft: r } = this;
		return t ? (e) => t[e] + r : n + r;
	}
	_y(e, { y: t }, { marginTop: n }) {
		let { insetTop: r } = this;
		return t ? (e) => t[e] + r : n + r;
	}
	_width({ x: e }, { x: t }, { marginRight: n, marginLeft: r, width: i }) {
		let { insetLeft: a, insetRight: o } = this, s = t && e ? e.bandwidth() : i - n - r;
		return Math.max(0, s - a - o);
	}
	_height({ y: e }, { y: t }, { marginTop: n, marginBottom: r, height: i }) {
		let { insetTop: a, insetBottom: o } = this, s = t && e ? e.bandwidth() : i - n - r;
		return Math.max(0, s - a - o);
	}
};
function _O(e, t) {
	return typeof e == "function" && typeof t == "function" ? (n) => e(n) + t(n) : typeof e == "function" ? (n) => e(n) + t : typeof t == "function" ? (n) => e + t(n) : e + t;
}
var vO = class extends gO {
	constructor(e, t = {}, n) {
		let { x1: r, x2: i, y: a } = t;
		super(e, {
			x1: {
				value: r,
				scale: "x"
			},
			x2: {
				value: i,
				scale: "x"
			},
			y: {
				value: a,
				scale: "y",
				type: "band",
				optional: !0
			}
		}, t, n);
	}
	_transform(e, t, { x: n }) {
		e.call(FC, t, { x: n }, 0, 0);
	}
	_x({ x: e }, { x1: t, x2: n }, { marginLeft: r }) {
		let { insetLeft: i } = this;
		return pS(e) ? r + i : (e) => Math.min(t[e], n[e]) + i;
	}
	_width({ x: e }, { x1: t, x2: n }, { marginRight: r, marginLeft: i, width: a }) {
		let { insetLeft: o, insetRight: s } = this;
		return pS(e) ? a - r - i - o - s : (e) => Math.max(0, Math.abs(n[e] - t[e]) - o - s);
	}
};
function yO(e, t = {}) {
	return Ov(t) || (t = {
		...t,
		y: iv,
		x2: av
	}), new vO(e, xE(Ew(vE(t))));
}
//#endregion
//#region node_modules/@observablehq/plot/src/marks/dot.js
var bO = {
	ariaLabel: "dot",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 1.5
};
function xO(e) {
	return e.sort === void 0 && e.reverse === void 0 ? qy({ channel: "-r" }, e) : e;
}
var SO = class extends VC {
	constructor(e, t = {}) {
		let { x: n, y: r, r: i, rotate: a, symbol: o = Vh, frameAnchor: s } = t, [c, l] = yv(a, 0), [u, d] = zy(o), [f, p] = yv(i, u == null ? 3 : 4.5);
		super(e, {
			x: {
				value: n,
				scale: "x",
				optional: !0
			},
			y: {
				value: r,
				scale: "y",
				optional: !0
			},
			r: {
				value: f,
				scale: "r",
				filter: l_,
				optional: !0
			},
			rotate: {
				value: c,
				optional: !0
			},
			symbol: {
				value: u,
				scale: "auto",
				optional: !0
			}
		}, xO(t), bO), this.r = p, this.rotate = l, this.symbol = d, this.frameAnchor = _y(s);
		let { channels: m } = this, { symbol: h } = m;
		if (h) {
			let { fill: e, stroke: t } = m;
			h.hint = {
				fill: e ? e.value === h.value ? "color" : "currentColor" : this.fill ?? "currentColor",
				stroke: t ? t.value === h.value ? "color" : "currentColor" : this.stroke ?? "none"
			};
		}
	}
	render(e, t, n, r, i) {
		let { x: a, y: o } = t, { x: s, y: c, r: l, rotate: u, symbol: d } = n, { r: f, rotate: p, symbol: m } = this, [h, g] = BC(this, r), _ = m === Vh, v = l ? void 0 : f * f * Math.PI;
		return u_(f) && (e = []), X("svg:g", i).call(jC, this, r, i).call(FC, this, {
			x: s && a,
			y: c && o
		}).call((t) => t.selectAll().data(e).enter().append(_ ? "circle" : "path").call(MC, this).call(_ ? (e) => {
			e.attr("cx", s ? (e) => s[e] : h).attr("cy", c ? (e) => c[e] : g).attr("r", l ? (e) => l[e] : f);
		} : (e) => {
			e.attr("transform", Iw`translate(${s ? (e) => s[e] : h},${c ? (e) => c[e] : g})${u ? (e) => ` rotate(${u[e]})` : p ? ` rotate(${p})` : ""}`).attr("d", l && d ? (e) => {
				let t = ts();
				return d[e].draw(t, l[e] * l[e] * Math.PI), t;
			} : l ? (e) => {
				let t = ts();
				return m.draw(t, l[e] * l[e] * Math.PI), t;
			} : d ? (e) => {
				let t = ts();
				return d[e].draw(t, v), t;
			} : (() => {
				let e = ts();
				return m.draw(e, v), e;
			})());
		}).call(bC, this, n)).node();
	}
};
function CO(e, { x: t, y: n, ...r } = {}) {
	return r.frameAnchor === void 0 && ([t, n] = Pv(t, n)), new SO(e, {
		...r,
		x: t,
		y: n
	});
}
//#endregion
//#region node_modules/@observablehq/plot/src/marks/line.js
var wO = {
	ariaLabel: "line",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 1.5,
	strokeLinecap: "round",
	strokeLinejoin: "round",
	strokeMiterlimit: 1
}, TO = class extends VC {
	constructor(e, t = {}) {
		let { x: n, y: r, z: i, curve: a, tension: o } = t;
		super(e, {
			x: {
				value: n,
				scale: "x"
			},
			y: {
				value: r,
				scale: "y"
			},
			z: {
				value: Fv(t),
				optional: !0
			}
		}, t, wO), this.z = i, this.curve = VD(a, o), ow(this, t);
	}
	filter(e) {
		return e;
	}
	project(e, t, n) {
		this.curve !== HD && super.project(e, t, n);
	}
	render(e, t, n, r, i) {
		let { x: a, y: o } = n, { curve: s } = this;
		return X("svg:g", i).call(jC, this, r, i).call(FC, this, t).call((t) => t.selectAll().data(wC(e, [a, o], this, n)).enter().append("path").call(MC, this).call(xC, this, n).call(hw, this, n, i).attr("d", s === HD && i.projection ? EO(i.path(), a, o) : Fh().curve(s).defined((e) => e >= 0).x((e) => a[e]).y((e) => o[e]))).node();
	}
};
function EO(e, t, n) {
	return t = mv(t), n = mv(n), (r) => {
		let i = [], a = [i];
		for (let e of r) e === -1 ? (i = [], a.push(i)) : i.push([t[e], n[e]]);
		return e({
			type: "MultiLineString",
			coordinates: a
		});
	};
}
function DO(e, { x: t = iv, y: n = av, ...r } = {}) {
	return new TO(e, GD({
		...r,
		x: t,
		y: n
	}));
}
//#endregion
//#region node_modules/@observablehq/plot/src/index.js
VC.prototype.plot = function({ marks: e = [], ...t } = {}) {
	return dD({
		...t,
		marks: [...e, this]
	});
};
//#endregion
//#region node_modules/hyparquet/src/constants.js
var OO = [
	"BOOLEAN",
	"INT32",
	"INT64",
	"INT96",
	"FLOAT",
	"DOUBLE",
	"BYTE_ARRAY",
	"FIXED_LEN_BYTE_ARRAY"
], kO = [
	"PLAIN",
	"GROUP_VAR_INT",
	"PLAIN_DICTIONARY",
	"RLE",
	"BIT_PACKED",
	"DELTA_BINARY_PACKED",
	"DELTA_LENGTH_BYTE_ARRAY",
	"DELTA_BYTE_ARRAY",
	"RLE_DICTIONARY",
	"BYTE_STREAM_SPLIT"
], AO = [
	"REQUIRED",
	"OPTIONAL",
	"REPEATED"
], jO = [
	"UTF8",
	"MAP",
	"MAP_KEY_VALUE",
	"LIST",
	"ENUM",
	"DECIMAL",
	"DATE",
	"TIME_MILLIS",
	"TIME_MICROS",
	"TIMESTAMP_MILLIS",
	"TIMESTAMP_MICROS",
	"UINT_8",
	"UINT_16",
	"UINT_32",
	"UINT_64",
	"INT_8",
	"INT_16",
	"INT_32",
	"INT_64",
	"JSON",
	"BSON",
	"INTERVAL"
], MO = [
	"UNCOMPRESSED",
	"SNAPPY",
	"GZIP",
	"LZO",
	"BROTLI",
	"LZ4",
	"ZSTD",
	"LZ4_RAW"
], NO = [
	"DATA_PAGE",
	"INDEX_PAGE",
	"DICTIONARY_PAGE",
	"DATA_PAGE_V2"
], PO = [
	"UNORDERED",
	"ASCENDING",
	"DESCENDING"
], FO = [
	"SPHERICAL",
	"VINCENTY",
	"THOMAS",
	"ANDOYER",
	"KARNEY"
];
//#endregion
//#region node_modules/hyparquet/src/wkb.js
function IO(e) {
	let t = LO(e);
	if (t.type === 1) return {
		type: "Point",
		coordinates: RO(e, t)
	};
	if (t.type === 2) return {
		type: "LineString",
		coordinates: zO(e, t)
	};
	if (t.type === 3) return {
		type: "Polygon",
		coordinates: BO(e, t)
	};
	if (t.type === 4) {
		let n = [];
		for (let r = 0; r < t.count; r++) n.push(RO(e, LO(e)));
		return {
			type: "MultiPoint",
			coordinates: n
		};
	}
	if (t.type === 5) {
		let n = [];
		for (let r = 0; r < t.count; r++) n.push(zO(e, LO(e)));
		return {
			type: "MultiLineString",
			coordinates: n
		};
	}
	if (t.type === 6) {
		let n = [];
		for (let r = 0; r < t.count; r++) n.push(BO(e, LO(e)));
		return {
			type: "MultiPolygon",
			coordinates: n
		};
	}
	if (t.type === 7) {
		let n = [];
		for (let r = 0; r < t.count; r++) n.push(IO(e));
		return {
			type: "GeometryCollection",
			geometries: n
		};
	}
	throw Error(`Unsupported geometry type: ${t.type}`);
}
function LO(e) {
	let { view: t } = e, n = t.getUint8(e.offset++) === 1, r = t.getUint32(e.offset, n);
	e.offset += 4;
	let i = r % 1e3, a = Math.floor(r / 1e3), o = 0;
	i > 1 && i <= 7 && (o = t.getUint32(e.offset, n), e.offset += 4);
	let s = 2;
	return a && s++, a === 3 && s++, {
		littleEndian: n,
		type: i,
		dim: s,
		count: o
	};
}
function RO(e, t) {
	let n = [];
	for (let r = 0; r < t.dim; r++) {
		let r = e.view.getFloat64(e.offset, t.littleEndian);
		e.offset += 8, n.push(r);
	}
	return n;
}
function zO(e, t) {
	let n = [];
	for (let r = 0; r < t.count; r++) n.push(RO(e, t));
	return n;
}
function BO(e, t) {
	let { view: n } = e, r = [];
	for (let i = 0; i < t.count; i++) {
		let i = n.getUint32(e.offset, t.littleEndian);
		e.offset += 4, r.push(zO(e, {
			...t,
			count: i
		}));
	}
	return r;
}
//#endregion
//#region node_modules/hyparquet/src/convert.js
var VO = new TextDecoder(), HO = {
	timestampFromMilliseconds(e) {
		return new Date(Number(e));
	},
	timestampFromMicroseconds(e) {
		return new Date(Number(e / 1000n));
	},
	timestampFromNanoseconds(e) {
		return new Date(Number(e / 1000000n));
	},
	dateFromDays(e) {
		return /* @__PURE__ */ new Date(e * 864e5);
	},
	stringFromBytes(e) {
		return e && VO.decode(e);
	},
	jsonFromBytes(e) {
		return e && JSON.parse(VO.decode(e));
	},
	geometryFromBytes(e) {
		return e && IO({
			view: new DataView(e.buffer, e.byteOffset, e.byteLength),
			offset: 0
		});
	},
	geographyFromBytes(e) {
		return e && IO({
			view: new DataView(e.buffer, e.byteOffset, e.byteLength),
			offset: 0
		});
	},
	uuidFromBytes(e) {
		if (!e) return;
		let t = Array.from(e, (e) => e.toString(16).padStart(2, "0")).join("");
		return t.slice(0, 8) + "-" + t.slice(8, 12) + "-" + t.slice(12, 16) + "-" + t.slice(16, 20) + "-" + t.slice(20, 32);
	}
};
function UO(e, t, n, r) {
	if (t && n.endsWith("_DICTIONARY")) {
		let n = e;
		e instanceof Uint8Array && !(t instanceof Uint8Array) && (n = new t.constructor(e.length));
		for (let r = 0; r < e.length; r++) n[r] = t[e[r]];
		return n;
	}
	return WO(e, r);
}
function WO(e, t) {
	let { element: n, parsers: r, utf8: i = !0, schemaPath: a } = t, { type: o, converted_type: s, logical_type: c } = n, l = n.repetition_type !== "REQUIRED";
	if (a?.some((e) => e.element.logical_type?.type === "VARIANT") && o === "BYTE_ARRAY" && s !== "UTF8" && c?.type !== "STRING") return e;
	if (s === "DECIMAL") {
		let t = 10 ** -(n.scale || 0), r = Array(e.length);
		for (let n = 0; n < r.length; n++) e[n] instanceof Uint8Array ? r[n] = GO(e[n]) * t : r[n] = Number(e[n]) * t;
		return r;
	}
	if (!s && o === "INT96") return Array.from(e).map((e) => r.timestampFromNanoseconds(KO(e)));
	if (s === "DATE") return Array.from(e).map((e) => r.dateFromDays(e));
	if (s === "TIMESTAMP_MILLIS") return Array.from(e).map((e) => r.timestampFromMilliseconds(e));
	if (s === "TIMESTAMP_MICROS") return Array.from(e).map((e) => r.timestampFromMicroseconds(e));
	if (s === "JSON") return e.map((e) => r.jsonFromBytes(e));
	if (s === "BSON") throw Error("parquet bson not supported");
	if (s === "INTERVAL") throw Error("parquet interval not supported");
	if (c?.type === "GEOMETRY") return e.map((e) => r.geometryFromBytes(e));
	if (c?.type === "GEOGRAPHY") return e.map((e) => r.geographyFromBytes(e));
	if (c?.type === "UUID") return e.map((e) => r.uuidFromBytes(e));
	if (s === "UTF8" || c?.type === "STRING" || i && o === "BYTE_ARRAY") return e.map((e) => r.stringFromBytes(e));
	if (s === "UINT_64" || c?.type === "INTEGER" && c.bitWidth === 64 && !c.isSigned) {
		if (e instanceof BigInt64Array) return new BigUint64Array(e.buffer, e.byteOffset, e.length);
		let t = l ? Array(e.length) : new BigUint64Array(e.length);
		for (let n = 0; n < t.length; n++) t[n] = e[n];
		return t;
	}
	if (s === "UINT_32" || c?.type === "INTEGER" && c.bitWidth === 32 && !c.isSigned) {
		if (e instanceof Int32Array) return new Uint32Array(e.buffer, e.byteOffset, e.length);
		let t = l ? Array(e.length) : new Uint32Array(e.length);
		for (let n = 0; n < t.length; n++) t[n] = e[n] < 0 ? 4294967296 + e[n] : e[n];
		return t;
	}
	if (c?.type === "FLOAT16") return Array.from(e).map(qO);
	if (c?.type === "TIMESTAMP") {
		let { unit: t } = c, n = r.timestampFromMilliseconds;
		t === "MICROS" && (n = r.timestampFromMicroseconds), t === "NANOS" && (n = r.timestampFromNanoseconds);
		let i = Array(e.length);
		for (let t = 0; t < i.length; t++) i[t] = n(e[t]);
		return i;
	}
	return e;
}
function GO(e) {
	if (!e.length) return 0;
	let t = 0n;
	for (let n of e) t = t * 256n + BigInt(n);
	let n = e.length * 8;
	return t >= 2n ** BigInt(n - 1) && (t -= 2n ** BigInt(n)), Number(t);
}
function KO(e) {
	let t = (e >> 64n) - 2440588n, n = e & 18446744073709551615n;
	return t * 86400000000000n + n;
}
function qO(e) {
	if (!e) return;
	let t = e[1] << 8 | e[0], n = t >> 15 ? -1 : 1, r = t >> 10 & 31, i = t & 1023;
	return r === 0 ? n * 2 ** -14 * (i / 1024) : r === 31 ? i ? NaN : n * Infinity : n * 2 ** (r - 15) * (1 + i / 1024);
}
//#endregion
//#region node_modules/hyparquet/src/schema.js
function JO(e, t, n) {
	let r = e[t], i = [], a = 1;
	if (r.num_children) for (; i.length < r.num_children;) {
		let r = e[t + a], o = JO(e, t + a, [...n, r.name]);
		a += o.count, i.push(o);
	}
	return {
		count: a,
		element: r,
		children: i,
		path: n
	};
}
function YO(e, t) {
	let n = JO(e, 0, []), r = [n];
	for (let e of t) {
		let i = n.children.find((t) => t.element.name === e);
		if (!i) throw Error(`parquet schema element not found: ${t}`);
		r.push(i), n = i;
	}
	return r;
}
function XO(e) {
	let t = [];
	function n(e) {
		if (e.children.length) for (let t of e.children) n(t);
		else t.push(e.path.join("."));
	}
	return n(e), t;
}
function ZO(e) {
	let t = 0;
	for (let { element: n } of e) n.repetition_type === "REPEATED" && t++;
	return t;
}
function QO(e) {
	let t = 0;
	for (let { element: n } of e.slice(1)) n.repetition_type !== "REQUIRED" && t++;
	return t;
}
function $O(e) {
	if (!e || e.element.converted_type !== "LIST" || e.children.length > 1) return !1;
	let t = e.children[0];
	return !(t.children.length > 1 || t.element.repetition_type !== "REPEATED");
}
function ek(e) {
	if (!e || e.element.converted_type !== "MAP" || e.children.length > 1) return !1;
	let t = e.children[0];
	return t.children.length === 2 && t.element.repetition_type === "REPEATED" && t.children.find((e) => e.element.name === "key")?.element.repetition_type !== "REPEATED" && t.children.find((e) => e.element.name === "value")?.element.repetition_type !== "REPEATED";
}
function tk(e) {
	if (e.length !== 2) return !1;
	let [, t] = e;
	return !(t.element.repetition_type === "REPEATED" || t.children.length);
}
//#endregion
//#region node_modules/hyparquet/src/thrift.js
var nk = 0, rk = 1, ik = 2, ak = 3, ok = 4, sk = 5, ck = 6, lk = 7, uk = 8, dk = 9, fk = 12;
function pk(e) {
	let t = {}, n = 0;
	for (; e.offset < e.view.byteLength;) {
		let r = e.view.getUint8(e.offset++), i = r & 15;
		if (i === nk) break;
		let a = r >> 4;
		n = a ? n + a : _k(e), t[`field_${n}`] = mk(e, i);
	}
	return t;
}
function mk(e, t) {
	switch (t) {
		case rk: return !0;
		case ik: return !1;
		case ak: return e.view.getInt8(e.offset++);
		case ok:
		case sk: return _k(e);
		case ck: return vk(e);
		case lk: {
			let t = e.view.getFloat64(e.offset, !0);
			return e.offset += 8, t;
		}
		case uk: {
			let t = hk(e), n = new Uint8Array(e.view.buffer, e.view.byteOffset + e.offset, t);
			return e.offset += t, n;
		}
		case dk: {
			let t = e.view.getUint8(e.offset++), n = t & 15, r = t >> 4;
			r === 15 && (r = hk(e));
			let i = n === rk || n === ik, a = Array(r);
			for (let t = 0; t < r; t++) a[t] = i ? mk(e, ak) === 1 : mk(e, n);
			return a;
		}
		case fk: return pk(e);
		default: throw Error(`thrift unhandled type: ${t}`);
	}
}
function hk(e) {
	let t = 0, n = 0;
	for (;;) {
		let r = e.view.getUint8(e.offset++);
		if (t |= (r & 127) << n, !(r & 128)) return t;
		n += 7;
	}
}
function gk(e) {
	let t = 0n, n = 0n;
	for (;;) {
		let r = e.view.getUint8(e.offset++);
		if (t |= BigInt(r & 127) << n, !(r & 128)) return t;
		n += 7n;
	}
}
function _k(e) {
	let t = hk(e);
	return t >>> 1 ^ -(t & 1);
}
function vk(e) {
	let t = gk(e);
	return t >> 1n ^ -(t & 1n);
}
//#endregion
//#region node_modules/hyparquet/src/geoparquet.js
function yk(e, t) {
	let n = /* @__PURE__ */ new Map(), r = t?.find(({ key: e }) => e === "geo")?.value, i = (r && JSON.parse(r)?.columns) ?? {};
	for (let [e, t] of Object.entries(i)) {
		if (t.encoding !== "WKB") continue;
		let r = t.edges === "spherical" ? "GEOGRAPHY" : "GEOMETRY", i = t.crs?.id ?? t.crs?.ids?.[0], a = i ? `${i.authority}:${i.code.toString()}` : void 0;
		n.set(e, {
			type: r,
			crs: a
		});
	}
	for (let t = 1; t < e.length; t++) {
		let { logical_type: r, name: i, num_children: a, type: o } = e[t];
		if (a) {
			t += a;
			continue;
		}
		o === "BYTE_ARRAY" && !r && (e[t].logical_type = n.get(i));
	}
}
//#endregion
//#region node_modules/hyparquet/src/metadata.js
var bk = 1 << 19, xk = new TextDecoder();
function Sk(e) {
	return e && xk.decode(e);
}
async function Ck(e, { parsers: t, initialFetchSize: n = bk, geoparquet: r = !0 } = {}) {
	if (!e || !(e.byteLength >= 0)) throw Error("parquet expected AsyncBuffer");
	let i = Math.max(0, e.byteLength - n), a = await e.slice(i, e.byteLength), o = new DataView(a);
	if (o.getUint32(a.byteLength - 4, !0) !== 827474256) throw Error("parquet file invalid (footer != PAR1)");
	let s = o.getUint32(a.byteLength - 8, !0);
	if (s > e.byteLength - 8) throw Error(`parquet metadata length ${s} exceeds available buffer ${e.byteLength - 8}`);
	if (s + 8 > n) {
		let n = e.byteLength - s - 8, o = await e.slice(n, i), c = new ArrayBuffer(s + 8), l = new Uint8Array(c);
		return l.set(new Uint8Array(o)), l.set(new Uint8Array(a), i - n), wk(c, {
			parsers: t,
			geoparquet: r
		});
	}
	return wk(a, {
		parsers: t,
		geoparquet: r
	});
}
function wk(e, { parsers: t, geoparquet: n = !0 } = {}) {
	if (!(e instanceof ArrayBuffer)) throw Error("parquet expected ArrayBuffer");
	let r = new DataView(e);
	if (t = {
		...HO,
		...t
	}, r.byteLength < 8) throw Error("parquet file is too short");
	if (r.getUint32(r.byteLength - 4, !0) !== 827474256) throw Error("parquet file invalid (footer != PAR1)");
	let i = r.byteLength - 8, a = r.getUint32(i, !0);
	if (a > r.byteLength - 8) throw Error(`parquet metadata length ${a} exceeds available buffer ${r.byteLength - 8}`);
	let o = pk({
		view: r,
		offset: i - a
	}), s = o.field_1, c = o.field_2.map((e) => ({
		type: OO[e.field_1],
		type_length: e.field_2,
		repetition_type: AO[e.field_3],
		name: Sk(e.field_4),
		num_children: e.field_5,
		converted_type: jO[e.field_6],
		scale: e.field_7,
		precision: e.field_8,
		field_id: e.field_9,
		logical_type: Ek(e.field_10)
	})), l = c.filter((e) => e.type), u = o.field_3, d = o.field_4.map((e) => ({
		columns: e.field_1.map((e, n) => ({
			file_path: Sk(e.field_1),
			file_offset: e.field_2,
			meta_data: e.field_3 && {
				type: OO[e.field_3.field_1],
				encodings: e.field_3.field_2?.map((e) => kO[e]),
				path_in_schema: e.field_3.field_3.map(Sk),
				codec: MO[e.field_3.field_4],
				num_values: e.field_3.field_5,
				total_uncompressed_size: e.field_3.field_6,
				total_compressed_size: e.field_3.field_7,
				key_value_metadata: e.field_3.field_8?.map((e) => ({
					key: Sk(e.field_1),
					value: Sk(e.field_2)
				})),
				data_page_offset: e.field_3.field_9,
				index_page_offset: e.field_3.field_10,
				dictionary_page_offset: e.field_3.field_11,
				statistics: Ok(e.field_3.field_12, l[n], t),
				encoding_stats: e.field_3.field_13?.map((e) => ({
					page_type: NO[e.field_1],
					encoding: kO[e.field_2],
					count: e.field_3
				})),
				bloom_filter_offset: e.field_3.field_14,
				bloom_filter_length: e.field_3.field_15,
				size_statistics: e.field_3.field_16 && {
					unencoded_byte_array_data_bytes: e.field_3.field_16.field_1,
					repetition_level_histogram: e.field_3.field_16.field_2,
					definition_level_histogram: e.field_3.field_16.field_3
				},
				geospatial_statistics: e.field_3.field_17 && {
					bbox: e.field_3.field_17.field_1 && {
						xmin: e.field_3.field_17.field_1.field_1,
						xmax: e.field_3.field_17.field_1.field_2,
						ymin: e.field_3.field_17.field_1.field_3,
						ymax: e.field_3.field_17.field_1.field_4,
						zmin: e.field_3.field_17.field_1.field_5,
						zmax: e.field_3.field_17.field_1.field_6,
						mmin: e.field_3.field_17.field_1.field_7,
						mmax: e.field_3.field_17.field_1.field_8
					},
					geospatial_types: e.field_3.field_17.field_2
				}
			},
			offset_index_offset: e.field_4,
			offset_index_length: e.field_5,
			column_index_offset: e.field_6,
			column_index_length: e.field_7,
			crypto_metadata: e.field_8,
			encrypted_column_metadata: e.field_9
		})),
		total_byte_size: e.field_2,
		num_rows: e.field_3,
		sorting_columns: e.field_4?.map((e) => ({
			column_idx: e.field_1,
			descending: e.field_2,
			nulls_first: e.field_3
		})),
		file_offset: e.field_5,
		total_compressed_size: e.field_6,
		ordinal: e.field_7
	})), f = o.field_5?.map((e) => ({
		key: Sk(e.field_1),
		value: Sk(e.field_2)
	})), p = Sk(o.field_6);
	return n && yk(c, f), {
		version: s,
		schema: c,
		num_rows: u,
		row_groups: d,
		key_value_metadata: f,
		created_by: p,
		metadata_length: a
	};
}
function Tk({ schema: e }) {
	return YO(e, [])[0];
}
function Ek(e) {
	return e?.field_1 ? { type: "STRING" } : e?.field_2 ? { type: "MAP" } : e?.field_3 ? { type: "LIST" } : e?.field_4 ? { type: "ENUM" } : e?.field_5 ? {
		type: "DECIMAL",
		scale: e.field_5.field_1,
		precision: e.field_5.field_2
	} : e?.field_6 ? { type: "DATE" } : e?.field_7 ? {
		type: "TIME",
		isAdjustedToUTC: e.field_7.field_1,
		unit: Dk(e.field_7.field_2)
	} : e?.field_8 ? {
		type: "TIMESTAMP",
		isAdjustedToUTC: e.field_8.field_1,
		unit: Dk(e.field_8.field_2)
	} : e?.field_10 ? {
		type: "INTEGER",
		bitWidth: e.field_10.field_1,
		isSigned: e.field_10.field_2
	} : e?.field_11 ? { type: "NULL" } : e?.field_12 ? { type: "JSON" } : e?.field_13 ? { type: "BSON" } : e?.field_14 ? { type: "UUID" } : e?.field_15 ? { type: "FLOAT16" } : e?.field_16 ? {
		type: "VARIANT",
		specification_version: e.field_16.field_1
	} : e?.field_17 ? {
		type: "GEOMETRY",
		crs: Sk(e.field_17.field_1)
	} : e?.field_18 ? {
		type: "GEOGRAPHY",
		crs: Sk(e.field_18.field_1),
		algorithm: FO[e.field_18.field_2]
	} : e;
}
function Dk(e) {
	if (e.field_1) return "MILLIS";
	if (e.field_2) return "MICROS";
	if (e.field_3) return "NANOS";
	throw Error("parquet time unit required");
}
function Ok(e, t, n) {
	return e && {
		max: kk(e.field_1, t, n),
		min: kk(e.field_2, t, n),
		null_count: e.field_3,
		distinct_count: e.field_4,
		max_value: kk(e.field_5, t, n),
		min_value: kk(e.field_6, t, n),
		is_max_value_exact: e.field_7,
		is_min_value_exact: e.field_8
	};
}
function kk(e, t, n) {
	let { type: r, converted_type: i, logical_type: a } = t;
	if (e === void 0) return e;
	if (r === "BOOLEAN") return e[0] === 1;
	if (r === "BYTE_ARRAY") return n.stringFromBytes(e);
	let o = new DataView(e.buffer, e.byteOffset, e.byteLength);
	if (r === "FLOAT" && o.byteLength === 4) return o.getFloat32(0, !0);
	if (r === "DOUBLE" && o.byteLength === 8) return o.getFloat64(0, !0);
	if (r === "INT32" && i === "DECIMAL" && o.byteLength === 4) return o.getInt32(0, !0) * 10 ** -(t.scale || 0);
	if (r === "INT64" && i === "DECIMAL" && o.byteLength === 8) return Number(o.getBigInt64(0, !0)) * 10 ** -(t.scale || 0);
	if (r === "INT32" && i === "DATE") return n.dateFromDays(o.getInt32(0, !0));
	if (r === "INT64" && i === "TIMESTAMP_MILLIS") return n.timestampFromMilliseconds(o.getBigInt64(0, !0));
	if (r === "INT64" && i === "TIMESTAMP_MICROS") return n.timestampFromMicroseconds(o.getBigInt64(0, !0));
	if (r === "INT64" && a?.type === "TIMESTAMP" && a?.unit === "NANOS") return n.timestampFromNanoseconds(o.getBigInt64(0, !0));
	if (r === "INT64" && a?.type === "TIMESTAMP" && a?.unit === "MICROS") return n.timestampFromMicroseconds(o.getBigInt64(0, !0));
	if (r === "INT64" && a?.type === "TIMESTAMP") return n.timestampFromMilliseconds(o.getBigInt64(0, !0));
	let s = i?.startsWith("UINT_") || a?.type === "INTEGER" && !a.isSigned;
	return r === "INT32" && s && o.byteLength === 4 ? o.getUint32(0, !0) : r === "INT64" && s && o.byteLength === 8 ? o.getBigUint64(0, !0) : r === "INT32" && o.byteLength === 4 ? o.getInt32(0, !0) : r === "INT64" && o.byteLength === 8 ? o.getBigInt64(0, !0) : i === "DECIMAL" ? GO(e) * 10 ** -(t.scale || 0) : a?.type === "FLOAT16" ? qO(e) : a?.type === "UUID" ? n.uuidFromBytes(e) : e;
}
//#endregion
//#region node_modules/hyparquet/src/indexes.js
function Ak(e, t, n = void 0) {
	n = {
		...HO,
		...n
	};
	let r = pk(e);
	return {
		null_pages: r.field_1,
		min_values: r.field_2.map((e) => kk(e, t, n)),
		max_values: r.field_3.map((e) => kk(e, t, n)),
		boundary_order: PO[r.field_4],
		null_counts: r.field_5,
		repetition_level_histograms: r.field_6,
		definition_level_histograms: r.field_7
	};
}
function jk(e) {
	let t = pk(e);
	return {
		page_locations: t.field_1.map((e) => ({
			offset: e.field_1,
			compressed_page_size: e.field_2,
			first_row_index: e.field_3
		})),
		unencoded_byte_array_data_bytes: t.field_2
	};
}
//#endregion
//#region node_modules/hyparquet/src/xxhash.js
var $ = 18446744073709551615n, Mk = 11400714785074694791n, Nk = 14029467366897019727n, Pk = 1609587929392839161n, Fk = 9650029242287828579n, Ik = 2870177450012600261n;
function Lk(e, t) {
	return (e << t | e >> 64n - t) & $;
}
function Rk(e, t) {
	return e = e + t * Nk & $, e = Lk(e, 31n), e * Mk & $;
}
function zk(e, t) {
	return e ^= Rk(0n, t), e * Mk + Fk & $;
}
function Bk(e, t = 0n) {
	let n = new DataView(e.buffer, e.byteOffset, e.byteLength), r = e.byteLength, i = 0, a;
	if (r >= 32) {
		let e = t + Mk + Nk & $, o = t + Nk & $, s = t, c = t - Mk & $;
		for (; i + 32 <= r;) e = Rk(e, n.getBigUint64(i, !0)), i += 8, o = Rk(o, n.getBigUint64(i, !0)), i += 8, s = Rk(s, n.getBigUint64(i, !0)), i += 8, c = Rk(c, n.getBigUint64(i, !0)), i += 8;
		a = Lk(e, 1n) + Lk(o, 7n) + Lk(s, 12n) + Lk(c, 18n) & $, a = zk(a, e), a = zk(a, o), a = zk(a, s), a = zk(a, c);
	} else a = t + Ik & $;
	for (a = a + BigInt(r) & $; i + 8 <= r;) a ^= Rk(0n, n.getBigUint64(i, !0)), a = Lk(a, 27n) * Mk + Fk & $, i += 8;
	for (i + 4 <= r && (a ^= BigInt(n.getUint32(i, !0)) * Mk & $, a = Lk(a, 23n) * Nk + Pk & $, i += 4); i < r;) a ^= BigInt(n.getUint8(i)) * Ik & $, a = Lk(a, 11n) * Mk & $, i += 1;
	return a ^= a >> 33n, a = a * Nk & $, a ^= a >> 29n, a = a * Pk & $, a ^= a >> 32n, a;
}
//#endregion
//#region node_modules/hyparquet/src/bloom.js
var Vk = new TextEncoder(), Hk = new Uint32Array([
	1203114875,
	1150766481,
	2284105051,
	2729912477,
	1884591559,
	770785867,
	2667333959,
	1550580529
]);
function Uk(e, t) {
	return Number((e >> 32n) * BigInt(t) >> 32n);
}
function Wk(e) {
	let t = /* @__PURE__ */ new Uint32Array(8), n = Number(e & 4294967295n) | 0;
	for (let e = 0; e < 8; e++) t[e] = 1 << (Math.imul(n, Hk[e]) >>> 27);
	return t;
}
function Gk(e, t) {
	let n = Uk(t, e.length >> 3) << 3, r = Wk(t);
	for (let t = 0; t < 8; t++) if ((e[n + t] & r[t]) === 0) return !1;
	return !0;
}
function Kk(e) {
	let t = pk(e), n = t.field_1;
	if (typeof n != "number" || n <= 0 || n % 32 != 0 || !t.field_2?.field_1 || !t.field_3?.field_1 || !t.field_4?.field_1) return;
	let { view: r, offset: i } = e;
	if (i + n > r.byteLength) throw Error(`parquet bloom filter truncated: need ${n} bytes, have ${r.byteLength - i}`);
	let a = new Uint32Array(n >> 2);
	for (let e = 0; e < a.length; e++) a[e] = r.getUint32(i + e * 4, !0);
	return e.offset = i + n, {
		numBytes: n,
		blocks: a
	};
}
function qk(e, t) {
	if (e == null) return;
	let { type: n, converted_type: r, logical_type: i } = t;
	if (n === "BOOLEAN") return typeof e == "boolean" ? Bk(new Uint8Array([+!!e])) : void 0;
	if (n === "FLOAT") {
		if (typeof e != "number") return;
		let t = /* @__PURE__ */ new ArrayBuffer(4);
		return new DataView(t).setFloat32(0, e, !0), Bk(new Uint8Array(t));
	}
	if (n === "DOUBLE") {
		if (typeof e != "number") return;
		let t = /* @__PURE__ */ new ArrayBuffer(8);
		return new DataView(t).setFloat64(0, e, !0), Bk(new Uint8Array(t));
	}
	if (n === "INT32") {
		if (r === "DATE" || r === "DECIMAL" || r === "TIME_MILLIS" || i?.type === "DATE" || i?.type === "TIME" || i?.type === "DECIMAL" || typeof e != "number" || !Number.isInteger(e)) return;
		let t = /* @__PURE__ */ new ArrayBuffer(4);
		return new DataView(t).setInt32(0, e | 0, !0), Bk(new Uint8Array(t));
	}
	if (n === "INT64") {
		if (r === "TIMESTAMP_MILLIS" || r === "TIMESTAMP_MICROS" || r === "TIME_MICROS" || r === "DECIMAL" || i?.type === "TIMESTAMP" || i?.type === "TIME" || i?.type === "DECIMAL") return;
		let t;
		if (typeof e == "bigint") t = e;
		else if (typeof e == "number" && Number.isSafeInteger(e)) t = BigInt(e);
		else return;
		let n = /* @__PURE__ */ new ArrayBuffer(8);
		return new DataView(n).setBigUint64(0, BigInt.asUintN(64, t), !0), Bk(new Uint8Array(n));
	}
	if (n === "BYTE_ARRAY") return r === "JSON" || r === "BSON" || r === "DECIMAL" || i?.type === "JSON" || i?.type === "BSON" || i?.type === "VARIANT" || i?.type === "GEOMETRY" || i?.type === "GEOGRAPHY" ? void 0 : typeof e == "string" ? Bk(Vk.encode(e)) : e instanceof Uint8Array ? Bk(e) : void 0;
	if (n === "FIXED_LEN_BYTE_ARRAY") return r === "DECIMAL" || r === "INTERVAL" || i?.type === "DECIMAL" || i?.type === "UUID" || i?.type === "FLOAT16" || i?.type === "GEOMETRY" || i?.type === "GEOGRAPHY" ? void 0 : e instanceof Uint8Array ? Bk(e) : void 0;
}
function Jk(e) {
	let t = /* @__PURE__ */ new Set();
	return Yk(e, t), t;
}
function Yk(e, t) {
	if (e) {
		if ("$and" in e && Array.isArray(e.$and)) {
			for (let n of e.$and) Yk(n, t);
			return;
		}
		if ("$or" in e && Array.isArray(e.$or)) {
			for (let n of e.$or) Yk(n, t);
			return;
		}
		if (!("$nor" in e)) for (let [n, r] of Object.entries(e)) n.startsWith("$") || (typeof r == "object" && r && !Array.isArray(r) ? ("$eq" in r || "$in" in r) && t.add(n) : t.add(n));
	}
}
//#endregion
//#region node_modules/hyparquet/src/utils.js
function Xk(e, t) {
	let n = 1e4;
	for (let r = 0; r < t.length; r += n) e.push(...t.slice(r, r + n));
}
function Zk(e, t, n = !0) {
	if (n ? e === t : e == t) return !0;
	if (!e || !t || typeof e != "object" || typeof t != "object") return !1;
	if (e instanceof Uint8Array && t instanceof Uint8Array) {
		if (e.length !== t.length) return !1;
		for (let n = 0; n < e.length; n++) if (e[n] !== t[n]) return !1;
		return !0;
	}
	if (e instanceof Date || t instanceof Date) return e instanceof Date && t instanceof Date && e.getTime() === t.getTime();
	if (Array.isArray(e) && Array.isArray(t)) {
		if (e.length !== t.length) return !1;
		for (let r = 0; r < e.length; r++) if (!Zk(e[r], t[r], n)) return !1;
		return !0;
	}
	let r = Object.keys(e);
	if (r.length !== Object.keys(t).length) return !1;
	for (let i of r) if (!Zk(e[i], t[i], n)) return !1;
	return !0;
}
async function Qk(e, t = {}, n = globalThis.fetch) {
	let r = new AbortController(), i = new Headers(t.headers);
	i.set("Range", "bytes=0-0");
	let a = await n(e, {
		...t,
		headers: i,
		signal: r.signal
	});
	if (!a.ok) throw Error(`fetch with range failed ${a.status}`);
	if (a.status === 206) {
		let e = a.headers.get("Content-Range");
		if (!e) throw Error("missing content-range header");
		let t = e.match(/bytes \d+-\d+\/(\d+)/);
		if (!t) throw Error(`invalid content-range header: ${e}`);
		return parseInt(t[1]);
	}
	if (a.status === 200) {
		let e = a.headers.get("Content-Length");
		if (r.abort(), e) return parseInt(e);
	}
	throw Error("server does not support range requests and missing content-length");
}
async function $k(e, t, n) {
	let r = n ?? globalThis.fetch, i = await r(e, {
		...t,
		method: "HEAD"
	});
	if (i.status === 403) return Qk(e, t, r);
	if (!i.ok) throw Error(`fetch head failed ${i.status}`);
	let a = i.headers.get("Content-Length");
	return a ? parseInt(a) : Qk(e, t, r);
}
async function eA({ url: e, byteLength: t, requestInit: n, fetch: r }) {
	if (!e) throw Error("missing url");
	let i = r ?? globalThis.fetch;
	t ??= await $k(e, n, i);
	let a, o = n || {};
	return {
		byteLength: t,
		async slice(t, n) {
			if (a) return a.then((e) => e.slice(t, n));
			let r = new Headers(o.headers), s = n === void 0 ? "" : n - 1;
			r.set("Range", `bytes=${t}-${s}`);
			let c = await i(e, {
				...o,
				headers: r
			});
			if (!c.ok || !c.body) throw Error(`fetch failed ${c.status}`);
			if (c.status === 200) return a = c.arrayBuffer(), a.then((e) => e.slice(t, n));
			if (c.status === 206) return c.arrayBuffer();
			throw Error(`fetch received unexpected status code ${c.status}`);
		}
	};
}
function tA(e) {
	if (!e) return [];
	if (e.length === 1) return e[0];
	let t = [];
	for (let n of e) Xk(t, n);
	return t;
}
//#endregion
//#region node_modules/hyparquet/src/filter.js
var nA = new TextEncoder();
function rA(e) {
	if (!e) return [];
	let t = [];
	return "$and" in e && Array.isArray(e.$and) ? t.push(...e.$and.flatMap(rA)) : "$or" in e && Array.isArray(e.$or) ? t.push(...e.$or.flatMap(rA)) : "$nor" in e && Array.isArray(e.$nor) ? t.push(...e.$nor.flatMap(rA)) : t.push(...Object.keys(e)), [...new Set(t)];
}
function iA(e) {
	return [...new Set(rA(e).map((e) => e.split(".")[0]))];
}
function aA(e, t, n = !0) {
	return "$and" in t && Array.isArray(t.$and) ? t.$and.every((t) => aA(e, t, n)) : "$or" in t && Array.isArray(t.$or) ? t.$or.some((t) => aA(e, t, n)) : "$nor" in t && Array.isArray(t.$nor) ? !t.$nor.some((t) => aA(e, t, n)) : Object.entries(t).every(([t, r]) => {
		let i = hA(e, t);
		return typeof r != "object" || !r || Array.isArray(r) ? Zk(i, r, n) : Object.entries(r || {}).every(([e, r]) => e === "$gt" ? i != null && i > r : e === "$gte" ? i != null && i >= r : e === "$lt" ? i != null && i < r : e === "$lte" ? i != null && i <= r : e === "$eq" ? Zk(i, r, n) : e === "$ne" ? !Zk(i, r, n) : e === "$in" ? Array.isArray(r) && oA(i, r, n) : e === "$nin" ? Array.isArray(r) && !oA(i, r, n) : e !== "$not" || !aA({ [t]: i }, { [t]: r }, n));
	});
}
function oA(e, t, n) {
	return t.some((t) => Zk(e, t, n) || Array.isArray(e) && e.some((e) => Zk(e, t, n)));
}
function sA({ rowGroup: e, physicalColumns: t, filter: n, strict: r = !0, bloomFilters: i, schemaElements: a }) {
	if (!n) return !1;
	if ("$and" in n && Array.isArray(n.$and)) return n.$and.some((n) => sA({
		rowGroup: e,
		physicalColumns: t,
		filter: n,
		strict: r,
		bloomFilters: i,
		schemaElements: a
	}));
	if ("$or" in n && Array.isArray(n.$or)) return n.$or.every((n) => sA({
		rowGroup: e,
		physicalColumns: t,
		filter: n,
		strict: r,
		bloomFilters: i,
		schemaElements: a
	}));
	if ("$nor" in n && Array.isArray(n.$nor)) return !1;
	for (let [o, s] of Object.entries(n)) {
		let n = t.indexOf(o);
		if (n === -1) continue;
		let { min: c, max: l, min_value: u, max_value: d, null_count: f } = e.columns[n].meta_data?.statistics || {}, p = u === void 0 ? c : u, m = d === void 0 ? l : d, h = p !== void 0 && m !== void 0, g = i?.[o], _ = a?.[o], v = aA({ value: null }, { value: s }, r) && (f === void 0 || f > 0);
		if (h && !v && cA(s, p, m, r, _)) return !0;
		for (let [e, t] of Object.entries(s || {})) if (g && _) {
			if (e === "$eq") {
				let e = qk(t, _);
				if (e !== void 0 && !Gk(g.blocks, e)) return !0;
			}
			if (e === "$in" && Array.isArray(t) && t.length > 0) {
				let e = !0;
				for (let n of t) {
					let t = qk(n, _);
					if (t === void 0 || Gk(g.blocks, t)) {
						e = !1;
						break;
					}
				}
				if (e) return !0;
			}
		}
	}
	return !1;
}
function cA(e, t, n, r, i) {
	if (t === void 0 || n === void 0) return !1;
	let a = i?.type === "FLOAT" || i?.type === "DOUBLE" || i?.logical_type?.type === "FLOAT16";
	for (let [o, s] of Object.entries(e || {})) {
		let e = lA(t, s, r, i), c = lA(n, s, r, i), l = !(t instanceof Uint8Array || n instanceof Uint8Array) && (i?.type !== "BYTE_ARRAY" || typeof s == "string" && [...s].every((e) => e.charCodeAt(0) <= 127));
		if (o === "$gt" && l && c !== void 0 && c <= 0 || o === "$gte" && l && c !== void 0 && c < 0 || o === "$lt" && l && e !== void 0 && e >= 0 || o === "$lte" && l && e !== void 0 && e > 0) return !0;
		if (o === "$eq") {
			let e = lA(s, t, r, i), a = lA(s, n, r, i);
			if (e !== void 0 && e < 0 || a !== void 0 && a > 0) return !0;
		}
		if (o === "$ne" && !a && Zk(t, n, r) && Zk(t, s, r) || o === "$in" && Array.isArray(s) && s.every((e) => {
			let a = lA(e, t, r, i), o = lA(e, n, r, i);
			return a !== void 0 && a < 0 || o !== void 0 && o > 0;
		}) || o === "$nin" && !a && Array.isArray(s) && Zk(t, n, r) && s.some((e) => Zk(t, e, r))) return !0;
	}
	return !1;
}
function lA(e, t, n, r) {
	if (r?.type === "BYTE_ARRAY") return typeof e != "string" || typeof t != "string" ? void 0 : uA(nA.encode(e), nA.encode(t));
	if (e instanceof Uint8Array || t instanceof Uint8Array) return !(e instanceof Uint8Array) || !(t instanceof Uint8Array) ? void 0 : uA(e, t);
	if (e < t) return -1;
	if (e > t) return 1;
	if (Zk(e, t, n)) return 0;
}
function uA(e, t) {
	let n = Math.min(e.length, t.length);
	for (let r = 0; r < n; r++) {
		if (e[r] < t[r]) return -1;
		if (e[r] > t[r]) return 1;
	}
	return e.length < t.length ? -1 : +(e.length > t.length);
}
function dA(e, t) {
	return aA({ value: null }, { value: e }, t);
}
function fA(e, t, n, r = !0) {
	if (!e) return;
	if ("$and" in e && Array.isArray(e.$and)) {
		let i;
		for (let a of e.$and) i = pA(i, fA(a, t, n, r));
		return i;
	}
	if ("$or" in e && Array.isArray(e.$or)) {
		let i = [];
		for (let a of e.$or) {
			let e = fA(a, t, n, r);
			if (!e) return;
			i = mA(i, e);
		}
		return i;
	}
	if ("$nor" in e && Array.isArray(e.$nor)) return;
	let i;
	for (let [a, o] of Object.entries(e)) {
		let e = t[a];
		if (!e) continue;
		let s = dA(o, r), c = [];
		for (let t = 0; t < e.pageStarts.length; t++) {
			let i = e.pageStarts[t], a = t + 1 < e.pageStarts.length ? e.pageStarts[t + 1] : n, l = e.nullCounts?.[t], u = s && (l === void 0 || l > 0);
			if (!(!e.nullPages[t] && !u && cA(o, e.minValues[t], e.maxValues[t], r, e.element))) {
				let e = c[c.length - 1];
				e && e[1] === i ? e[1] = a : c.push([i, a]);
			}
		}
		i = pA(i, c);
	}
	return i;
}
function pA(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = [], r = 0, i = 0;
	for (; r < e.length && i < t.length;) {
		let a = Math.max(e[r][0], t[i][0]), o = Math.min(e[r][1], t[i][1]);
		a < o && n.push([a, o]), e[r][1] < t[i][1] ? r++ : i++;
	}
	return n;
}
function mA(e, t) {
	let n = [], r = 0, i = 0;
	for (; r < e.length || i < t.length;) {
		let a = i >= t.length || r < e.length && e[r][0] <= t[i][0] ? e[r++] : t[i++], o = n[n.length - 1];
		o && a[0] <= o[1] ? o[1] = Math.max(o[1], a[1]) : n.push([a[0], a[1]]);
	}
	return n;
}
function hA(e, t) {
	let n = e;
	for (let e of t.split(".")) n = n?.[e];
	return n;
}
//#endregion
//#region node_modules/hyparquet/src/plan.js
var gA = 1 << 21;
function _A(e) {
	let { metadata: t, rowStart: n = 0, columns: r, useOffsetIndex: i = !1 } = e;
	if (!t) throw Error("parquetPlan requires metadata");
	let a = [], o = [], s = [], c = vA(e);
	for (let e of c.groups) {
		let t = yA({
			...e,
			columns: r,
			useOffsetIndex: i
		});
		a.push(...t.groups), o.push(...t.fetches), s.push(...t.indexes);
	}
	return o.push(...s), {
		metadata: t,
		rowStart: n,
		rowEnd: c.rowEnd,
		columns: r,
		fetches: o,
		groups: a
	};
}
function vA({ metadata: e, rowStart: t = 0, rowEnd: n = Infinity, columns: r, filter: i, filterStrict: a = !0, bloomFiltersByGroup: o, schemaElements: s, pageRangesByGroup: c, pageLocationsByGroup: l }) {
	if (!e) throw Error("parquetPlan requires metadata");
	let u = Tk(e), d = XO(u), f = i ? {
		...TA(u),
		...s
	} : s, p = [], m = 0;
	for (let s = 0; s < e.row_groups.length; s++) {
		let u = e.row_groups[s], h = Number(u.num_rows), g = m + h;
		if (h > 0 && g > t && m < n && !sA({
			rowGroup: u,
			physicalColumns: d,
			filter: i,
			strict: a,
			bloomFilters: o?.[s],
			schemaElements: f
		})) {
			let e = Math.max(t - m, 0), i = Math.min(n - m, h), a = c?.[s], o = l?.[s], d = a ? a.map(([t, n]) => [Math.max(t, e), Math.min(n, i)]).filter(([e, t]) => e < t) : [[e, i]];
			d.length > 1 && (d = u.columns.every((e) => {
				let t = e.meta_data?.path_in_schema[0], n = e.meta_data?.path_in_schema.join(".");
				return r && t && !r.includes(t) ? !0 : !!(e.offset_index_offset && e.offset_index_length) || !!(n && o?.[n]);
			}) ? bA(d, u, r, o) : [[d[0][0], d[d.length - 1][1]]]), d.length && p.push({
				rowGroup: u,
				groupIndex: s,
				groupStart: m,
				groupRows: h,
				ranges: d,
				pageRanges: a,
				pageLocations: o
			});
		}
		m = g;
	}
	return {
		groups: p,
		rowEnd: isFinite(n) ? n : m
	};
}
function yA({ rowGroup: e, groupStart: t, groupRows: n, ranges: r, columns: i, useOffsetIndex: a = !1, pageRanges: o, pageLocations: s }) {
	let c = [], l = [], u = [], d = r.length > 1 || r[0][0] > 0 || r[0][1] < n;
	for (let t of e.columns) {
		let e = t.meta_data;
		if (t.file_path) throw Error("parquet file_path not supported");
		if (!e) throw Error("parquet column metadata is undefined");
		if (i && !i.includes(e.path_in_schema[0])) continue;
		let n = e.dictionary_page_offset || e.data_page_offset, r = Number(n), l = Number(n + e.total_compressed_size), u = s?.[e.path_in_schema.join(".")];
		if (u && d) c.push({
			columnMetadata: e,
			pageLocations: u,
			range: {
				startByte: r,
				endByte: l
			}
		});
		else if ((a || o) && t.offset_index_offset && t.offset_index_length && d) {
			let r = Number(t.offset_index_offset);
			c.push({
				columnMetadata: e,
				offsetIndex: {
					startByte: r,
					endByte: r + t.offset_index_length
				},
				range: {
					startByte: Number(n),
					endByte: l
				}
			});
		} else c.push({
			columnMetadata: e,
			range: {
				startByte: r,
				endByte: l
			}
		});
	}
	let f;
	for (let e of c) "pageLocations" in e || ("offsetIndex" in e ? u.push(e.offsetIndex) : i ? l.push(e.range) : f && e.range.endByte - f.startByte <= gA ? f.endByte = e.range.endByte : (f && l.push(f), f = { ...e.range }));
	return f && l.push(f), {
		groups: r.map(([r, i]) => ({
			chunks: c,
			rowGroup: e,
			groupStart: t,
			groupRows: n,
			selectStart: r,
			selectEnd: i
		})),
		fetches: l,
		indexes: u
	};
}
function bA(e, t, n, r) {
	let i = t.columns.filter((e) => !n || n.includes(e.meta_data?.path_in_schema[0] || "")).map((e) => r?.[e.meta_data?.path_in_schema.join(".") || ""]), a = [];
	for (let n of e) {
		let e = a[a.length - 1], r = e && i.some((r) => {
			if (!r) return !0;
			let i = xA(e, r, Number(t.num_rows)), a = xA(n, r, Number(t.num_rows));
			return i[0] <= a[1] && a[0] <= i[1];
		});
		e && r ? e[1] = n[1] : a.push([...n]);
	}
	return a;
}
function xA([e, t], n, r) {
	let i = Infinity, a = -Infinity;
	for (let o = 0; o < n.length; o++) {
		let s = Number(n[o].first_row_index);
		(o + 1 < n.length ? Number(n[o + 1].first_row_index) : r) > e && s < t && (i = Math.min(i, o), a = o);
	}
	return [i, a];
}
async function SA({ file: e, metadata: t, filter: n, filterStrict: r = !0 }) {
	let i = t.row_groups.map(() => ({})), a = Jk(n);
	if (a.size === 0) return i;
	let o = XO(Tk(t)), s = [];
	return t.row_groups.forEach((t, c) => {
		if (!sA({
			rowGroup: t,
			physicalColumns: o,
			filter: n,
			strict: r
		})) for (let n of a) {
			let r = o.indexOf(n);
			if (r === -1) continue;
			let a = t.columns[r]?.meta_data;
			if (!a?.bloom_filter_offset || !a.bloom_filter_length) continue;
			let l = Number(a.bloom_filter_offset), u = l + a.bloom_filter_length;
			s.push((async () => {
				let t = await e.slice(l, u), r = Kk({
					view: new DataView(t),
					offset: 0
				});
				r && (i[c][n] = r);
			})());
		}
	}), s.length && await Promise.all(s), i;
}
async function CA({ file: e, metadata: t, filter: n, filterStrict: r = !0, rowStart: i = 0, rowEnd: a = Infinity, columns: o, bloomFiltersByGroup: s, schemaElements: c, parsers: l }) {
	let u = t.row_groups.map(() => void 0), d = t.row_groups.map(() => ({}));
	if (n && "$nor" in n && Array.isArray(n.$nor)) return {
		pageRangesByGroup: u,
		pageLocationsByGroup: d
	};
	let f = rA(n);
	if (!f.length) return {
		pageRangesByGroup: u,
		pageLocationsByGroup: d
	};
	let p = Tk(t), m = XO(p), h = {
		...TA(p),
		...c
	}, g = [], _ = [], v = [], y = 0;
	if (t.row_groups.forEach((e, t) => {
		let c = Number(e.num_rows), u = y + c, p = c > 0 && u > i && y < a;
		if (y = u, !p || sA({
			rowGroup: e,
			physicalColumns: m,
			filter: n,
			strict: r,
			bloomFilters: s?.[t],
			schemaElements: h
		})) return;
		let b = {}, x = 0, S = /* @__PURE__ */ new Set(), C = !1;
		for (let n of f) {
			let r = m.indexOf(n);
			if (r === -1) continue;
			let i = e.columns[r];
			if (!i?.meta_data || !i.column_index_offset || !i.column_index_length || !i.offset_index_offset || !i.offset_index_length) continue;
			let a = h[n];
			if (!a) continue;
			C = !0, S.add(n);
			let o = Number(i.column_index_offset), s = Number(i.offset_index_offset), c = o + i.column_index_length, u = s + i.offset_index_length;
			g.push({
				startByte: o,
				endByte: c
			}, {
				startByte: s,
				endByte: u
			}), x++, _.push(async (e) => {
				let [r, i] = await Promise.all([e.slice(o, c), e.slice(s, u)]), f = Ak({
					view: new DataView(r),
					offset: 0
				}, a, l), p = jk({
					view: new DataView(i),
					offset: 0
				});
				d[t][n] = p.page_locations, b[n] = {
					minValues: f.min_values,
					maxValues: f.max_values,
					nullPages: f.null_pages,
					nullCounts: f.null_counts,
					pageStarts: p.page_locations.map((e) => Number(e.first_row_index)),
					element: a
				};
			});
		}
		if (C) for (let n of e.columns) {
			let e = n.meta_data;
			if (!e) continue;
			let r = e.path_in_schema[0], i = e.path_in_schema.join(".");
			if (o && !o.includes(r) || S.has(i) || !n.offset_index_offset || !n.offset_index_length) continue;
			S.add(i);
			let a = Number(n.offset_index_offset), s = a + n.offset_index_length;
			g.push({
				startByte: a,
				endByte: s
			}), x++, _.push(async (e) => {
				let n = await e.slice(a, s), r = jk({
					view: new DataView(n),
					offset: 0
				});
				d[t][i] = r.page_locations;
			});
		}
		x && v.push({
			rgIdx: t,
			groupRows: c,
			columnPages: b
		});
	}), _.length) {
		let t = EA(e, { fetches: wA(g) });
		await Promise.all(_.map((e) => e(t)));
		for (let { rgIdx: e, groupRows: t, columnPages: i } of v) u[e] = fA(n, i, t, r);
	}
	return {
		pageRangesByGroup: u,
		pageLocationsByGroup: d
	};
}
function wA(e) {
	let t = e.map((e) => ({ ...e })).sort((e, t) => e.startByte - t.startByte || e.endByte - t.endByte), n = [];
	for (let e of t) {
		let t = n[n.length - 1];
		t && e.startByte <= t.endByte ? t.endByte = Math.max(t.endByte, e.endByte) : n.push(e);
	}
	return n;
}
function TA(e) {
	let t = {};
	function n(e) {
		if (e.children.length) for (let t of e.children) n(t);
		else t[e.path.join(".")] = e.element;
	}
	return n(e), t;
}
function EA(e, { fetches: t }) {
	let n = t.map(({ startByte: t, endByte: n }) => e.slice(t, n));
	return {
		byteLength: e.byteLength,
		slice(r, i = e.byteLength) {
			let a = t.findIndex(({ startByte: e, endByte: t }) => e <= r && i <= t);
			if (a < 0) return e.slice(r, i);
			if (t[a].startByte !== r || t[a].endByte !== i) {
				let e = r - t[a].startByte, o = i - t[a].startByte;
				return n[a] instanceof Promise ? n[a].then((t) => t.slice(e, o)) : n[a].slice(e, o);
			}
			return n[a];
		}
	};
}
//#endregion
//#region node_modules/hyparquet/src/variant.js
var DA = new TextDecoder(), OA = /* @__PURE__ */ new WeakMap();
function kA(e, t = HO) {
	if (Array.isArray(e)) return e.map((e) => kA(e, t));
	if (typeof e != "object") return e;
	if ("metadata" in e) {
		let n = MA(e.metadata), r = e.typed_value && AA(e.typed_value, n, t), i = e.value && PA(jA(e.value), n, t);
		return r && i ? {
			...i,
			...r
		} : r ?? i;
	}
	return e;
}
function AA(e, t, n) {
	if (e instanceof Date) return e;
	if (e && typeof e == "object" && !Array.isArray(e) && !(e instanceof Uint8Array)) {
		if ("typed_value" in e && e.typed_value !== null && e.typed_value !== void 0) return AA(e.typed_value, t, n);
		if ("value" in e && e.value instanceof Uint8Array) return PA(jA(e.value), t, n);
		if ("typed_value" in e || "value" in e) return null;
		let r = {};
		for (let [i, a] of Object.entries(e)) t.dictionary.includes(i) && (r[i] = AA(a, t, n));
		return r;
	}
	return e instanceof Uint8Array ? PA(jA(e), t, n) : Array.isArray(e) ? e.map((e) => AA(e, t, n)) : e;
}
function jA(e) {
	return {
		view: new DataView(e.buffer, e.byteOffset, e.byteLength),
		offset: 0
	};
}
function MA(e) {
	let t = OA.get(e.buffer);
	t || (t = /* @__PURE__ */ new Map(), OA.set(e.buffer, t));
	let n = `${e.byteOffset}:${e.byteLength}`, r = t.get(n);
	if (r) return r;
	let i = jA(e), a = i.view.getUint8(i.offset++), o = a & 15;
	if (o !== 1) throw Error(`parquet unsupported variant metadata version: ${o}`);
	let s = (a >> 4 & 1) == 1, c = (a >> 6 & 3) + 1, l = NA(i, c), u = Array(l + 1);
	for (let e = 0; e < u.length; e++) u[e] = NA(i, c);
	let d = i.offset, f = Array(l);
	for (let t = 0; t < l; t++) {
		let n = u[t], r = u[t + 1], i = new Uint8Array(e.buffer, e.byteOffset + d + n, r - n);
		f[t] = DA.decode(i);
	}
	let p = {
		dictionary: f,
		sorted: s
	};
	return t.set(n, p), p;
}
function NA(e, t) {
	let n = 0;
	for (let r = 0; r < t; r++) n |= e.view.getUint8(e.offset + r) << r * 8;
	return e.offset += t, n;
}
function PA(e, t, n) {
	let r = e.view.getUint8(e.offset++), i = r & 3, a = r >> 2;
	if (i === 0) return FA(e, a, n);
	if (i === 2) return IA(e, a, t, n);
	if (i === 3) return LA(e, a, t, n);
	let o = new Uint8Array(e.view.buffer, e.view.byteOffset + e.offset, a);
	return e.offset += a, DA.decode(o);
}
function FA(e, t, n) {
	switch (t) {
		case 0: return null;
		case 1: return !0;
		case 2: return !1;
		case 3: {
			let t = e.view.getInt8(e.offset);
			return e.offset += 1, t;
		}
		case 4: {
			let t = e.view.getInt16(e.offset, !0);
			return e.offset += 2, t;
		}
		case 5: {
			let t = e.view.getInt32(e.offset, !0);
			return e.offset += 4, t;
		}
		case 6: {
			let t = e.view.getBigInt64(e.offset, !0);
			return e.offset += 8, t;
		}
		case 7: {
			let t = e.view.getFloat64(e.offset, !0);
			return e.offset += 8, t;
		}
		case 8: return RA(e, 4);
		case 9: return RA(e, 8);
		case 10: return RA(e, 16);
		case 11: {
			let t = e.view.getInt32(e.offset, !0);
			return e.offset += 4, n.dateFromDays(t);
		}
		case 12:
		case 13: {
			let t = e.view.getBigInt64(e.offset, !0);
			return e.offset += 8, n.timestampFromMicroseconds(t);
		}
		case 14: {
			let t = e.view.getFloat32(e.offset, !0);
			return e.offset += 4, t;
		}
		case 15: return zA(e);
		case 16: {
			let t = zA(e);
			return DA.decode(t);
		}
		case 17: {
			let t = e.view.getBigInt64(e.offset, !0);
			return e.offset += 8, t;
		}
		case 18:
		case 19: {
			let t = e.view.getBigInt64(e.offset, !0);
			return e.offset += 8, n.timestampFromNanoseconds(t);
		}
		case 20: {
			let t = new Uint8Array(e.view.buffer, e.view.byteOffset + e.offset, 16);
			e.offset += 16;
			let n = Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
			return `${n.slice(0, 8)}-${n.slice(8, 12)}-${n.slice(12, 16)}-${n.slice(16, 20)}-${n.slice(20)}`;
		}
		default: throw Error(`parquet unsupported variant primitive type: ${t}`);
	}
}
function IA(e, t, n, r) {
	let i = (t & 3) + 1, a = (t >> 2 & 3) + 1, o = t >> 4 & 1 ? NA(e, 4) : e.view.getUint8(e.offset++), s = Array(o);
	for (let t = 0; t < o; t++) s[t] = NA(e, a);
	let c = Array(o + 1);
	for (let t = 0; t < c.length; t++) c[t] = NA(e, i);
	let l = {};
	for (let t = 0; t < o; t++) {
		let i = n.dictionary[s[t]];
		l[i] = PA({
			view: e.view,
			offset: e.offset + c[t]
		}, n, r);
	}
	return e.offset += c[c.length - 1], l;
}
function LA(e, t, n, r) {
	let i = t & 3, a = t >> 2 & 1, o = i + 1, s = NA(e, a ? 4 : 1), c = Array(s + 1);
	for (let t = 0; t < c.length; t++) c[t] = NA(e, o);
	let l = e.offset, u = Array(s);
	for (let t = 0; t < s; t++) {
		let i = {
			view: e.view,
			offset: l + c[t]
		};
		u[t] = PA(i, n, r);
	}
	return e.offset = l + c[c.length - 1], u;
}
function RA(e, t) {
	let n = e.view.getUint8(e.offset);
	e.offset += 1;
	let r;
	if (t === 4) r = BigInt(e.view.getInt32(e.offset, !0)), e.offset += 4;
	else if (t === 8) r = e.view.getBigInt64(e.offset, !0), e.offset += 8;
	else {
		let t = e.view.getBigUint64(e.offset, !0);
		r = e.view.getBigInt64(e.offset + 8, !0) << 64n | t, e.offset += 16;
	}
	return Number(r) * 10 ** -n;
}
function zA(e) {
	let t = e.view.getUint32(e.offset, !0);
	e.offset += 4;
	let n = new Uint8Array(e.view.buffer, e.view.byteOffset + e.offset, t);
	return e.offset += t, n;
}
//#endregion
//#region node_modules/hyparquet/src/assemble.js
function BA(e, t, n, r, i) {
	let a = QO(i);
	if (!t?.length && !n.length) {
		if (!a || !r.length) return r;
		t = Array(r.length).fill(a);
	}
	let o = t?.length || n.length, s = i.map(({ element: e }) => e.repetition_type), c = 0, l = [e], u = e, d = 0, f = 0, p = 0;
	if (n[0]) for (; d < s.length - 2 && p < n[0];) d++, s[d] !== "REQUIRED" && (u = u.at(-1), l.push(u), f++), s[d] === "REPEATED" && p++;
	for (let e = 0; e < o; e++) {
		let i = t?.length ? t[e] : a, o = n[e];
		for (; d && (o < p || s[d] !== "REPEATED");) s[d] !== "REQUIRED" && (l.pop(), f--), s[d] === "REPEATED" && p--, d--;
		for (u = l.at(-1); (d < s.length - 2 || s[d + 1] === "REPEATED") && (f < i || s[d + 1] === "REQUIRED");) {
			if (d++, s[d] !== "REQUIRED") {
				let e = [];
				u.push(e), u = e, l.push(e), f++;
			}
			s[d] === "REPEATED" && p++;
		}
		i === a ? u.push(r[c++]) : d === s.length - 2 ? u.push(null) : u.push([]);
	}
	if (!e.length) for (let e = 0; e < a; e++) {
		let e = [];
		u.push(e), u = e;
	}
	return e;
}
function VA(e, t, n, r = 0) {
	let i = t.path.join("."), a = t.element.repetition_type === "OPTIONAL", o = a ? r + 1 : r;
	if ($O(t)) {
		let s = t.children[0], c = o;
		s.children.length === 1 && (s = s.children[0], c++), VA(e, s, n, c);
		let l = s.path.join("."), u = e.get(l);
		if (!u) throw Error("parquet list column missing values");
		a && HA(u, r), e.set(i, u), e.delete(l);
		return;
	}
	if (ek(t)) {
		let s = t.children[0].element.name;
		VA(e, t.children[0].children[0], n, o + 1), VA(e, t.children[0].children[1], n, o + 1);
		let c = e.get(`${i}.${s}.key`), l = e.get(`${i}.${s}.value`);
		if (!c) throw Error("parquet map column missing keys");
		if (!l) throw Error("parquet map column missing values");
		if (c.length !== l.length) throw Error("parquet map column key/value length mismatch");
		let u = UA(c, l, o);
		a && HA(u, r), e.delete(`${i}.${s}.key`), e.delete(`${i}.${s}.value`), e.set(i, u);
		return;
	}
	if (t.children.length) {
		let o = t.element.repetition_type === "REQUIRED" ? r : r + 1, s = {};
		for (let r of t.children) {
			VA(e, r, n, o);
			let t = e.get(r.path.join("."));
			if (!t) throw Error("parquet struct missing child data");
			s[r.element.name] = t;
		}
		for (let n of t.children) e.delete(n.path.join("."));
		let c = WA(s, o);
		t.element.logical_type?.type === "VARIANT" && (c = kA(c, n)), a && HA(c, r), e.set(i, c);
	}
}
function HA(e, t) {
	for (let n = 0; n < e.length; n++) t ? HA(e[n], t - 1) : e[n] = e[n][0];
}
function UA(e, t, n) {
	let r = [];
	for (let i = 0; i < e.length; i++) if (n) r.push(UA(e[i], t[i], n - 1));
	else if (e[i]) {
		let n = {};
		for (let r = 0; r < e[i].length; r++) {
			let a = t[i][r];
			n[e[i][r]] = a === void 0 ? null : a;
		}
		r.push(n);
	} else r.push(void 0);
	return r;
}
function WA(e, t) {
	let n = Object.keys(e), r = e[n[0]]?.length, i = [];
	for (let a = 0; a < r; a++) {
		let o = {};
		for (let t of n) {
			if (e[t].length !== r) throw Error("parquet struct parsing error");
			o[t] = e[t][a];
		}
		t ? i.push(WA(o, t - 1)) : i.push(o);
	}
	return i;
}
//#endregion
//#region node_modules/hyparquet/src/delta.js
function GA(e, t, n) {
	let r = n instanceof Int32Array, i = hk(e), a = hk(e);
	hk(e);
	let o = vk(e), s = 0;
	n[s++] = r ? Number(o) : o;
	let c = i / a;
	for (; s < t;) {
		let i = vk(e), l = new Uint8Array(a);
		for (let t = 0; t < a; t++) l[t] = e.view.getUint8(e.offset++);
		for (let u = 0; u < a && s < t; u++) {
			let a = BigInt(l[u]);
			if (a) {
				let l = 0n, u = c, d = (1n << a) - 1n;
				for (; u && s < t;) {
					let t = BigInt(e.view.getUint8(e.offset)) >> l & d;
					for (l += a; l >= 8;) l -= 8n, e.offset++, l && (t |= BigInt(e.view.getUint8(e.offset)) << a - l & d);
					let c = i + t;
					o += c, n[s++] = r ? Number(o) : o, u--;
				}
				u && (e.offset += Math.ceil((u * Number(a) + Number(l)) / 8));
			} else for (let e = 0; e < c && s < t; e++) o += i, n[s++] = r ? Number(o) : o;
		}
	}
}
function KA(e, t, n) {
	let r = new Int32Array(t);
	GA(e, t, r);
	for (let i = 0; i < t; i++) n[i] = new Uint8Array(e.view.buffer, e.view.byteOffset + e.offset, r[i]), e.offset += r[i];
}
function qA(e, t, n) {
	let r = new Int32Array(t);
	GA(e, t, r);
	let i = new Int32Array(t);
	GA(e, t, i);
	for (let a = 0; a < t; a++) {
		let t = new Uint8Array(e.view.buffer, e.view.byteOffset + e.offset, i[a]);
		r[a] ? (n[a] = new Uint8Array(r[a] + i[a]), n[a].set(n[a - 1].subarray(0, r[a])), n[a].set(t, r[a])) : n[a] = t, e.offset += i[a];
	}
}
//#endregion
//#region node_modules/hyparquet/src/encoding.js
function JA(e, t, n, r) {
	r === void 0 && (r = e.view.getUint32(e.offset, !0), e.offset += 4);
	let i = e.offset, a = 0;
	for (; a < n.length;) {
		let r = hk(e);
		if (r & 1) a = XA(e, r, t, n, a);
		else {
			let i = r >>> 1;
			YA(e, i, t, n, a), a += i;
		}
	}
	e.offset = i + r;
}
function YA(e, t, n, r, i) {
	let a = n + 7 >> 3, o = 0;
	for (let t = 0; t < a; t++) o |= e.view.getUint8(e.offset++) << (t << 3);
	for (let e = 0; e < t; e++) r[i + e] = o;
}
function XA(e, t, n, r, i) {
	let a = t >> 1 << 3, o = (1 << n) - 1, s = 0;
	if (e.offset < e.view.byteLength) s = e.view.getUint8(e.offset++);
	else if (o) throw Error(`parquet bitpack offset ${e.offset} out of range`);
	let c = 8, l = 0;
	for (; a;) l > 8 ? (l -= 8, c -= 8, s >>>= 8) : c - l < n ? (s |= e.view.getUint8(e.offset) << c, e.offset++, c += 8) : (i < r.length && (r[i++] = s >> l & o), a--, l += n);
	return i;
}
function ZA(e, t, n, r) {
	let i = QA(n, r), a = new Uint8Array(t * i);
	for (let n = 0; n < i; n++) for (let r = 0; r < t; r++) a[r * i + n] = e.view.getUint8(e.offset++);
	if (n === "FLOAT") return new Float32Array(a.buffer);
	if (n === "DOUBLE") return new Float64Array(a.buffer);
	if (n === "INT32") return new Int32Array(a.buffer);
	if (n === "INT64") return new BigInt64Array(a.buffer);
	if (n === "FIXED_LEN_BYTE_ARRAY") {
		let e = Array(t);
		for (let n = 0; n < t; n++) e[n] = a.subarray(n * i, (n + 1) * i);
		return e;
	}
	throw Error(`parquet byte_stream_split unsupported type: ${n}`);
}
function QA(e, t) {
	switch (e) {
		case "INT32":
		case "FLOAT": return 4;
		case "INT64":
		case "DOUBLE": return 8;
		case "FIXED_LEN_BYTE_ARRAY":
			if (!t) throw Error("parquet byteWidth missing type_length");
			return t;
		default: throw Error(`parquet unsupported type: ${e}`);
	}
}
//#endregion
//#region node_modules/hyparquet/src/plain.js
function $A(e, t, n, r) {
	if (n === 0) return [];
	if (t === "BOOLEAN") return ej(e, n);
	if (t === "INT32") return tj(e, n);
	if (t === "INT64") return nj(e, n);
	if (t === "INT96") return rj(e, n);
	if (t === "FLOAT") return ij(e, n);
	if (t === "DOUBLE") return aj(e, n);
	if (t === "BYTE_ARRAY") return oj(e, n);
	if (t === "FIXED_LEN_BYTE_ARRAY") {
		if (!r) throw Error("parquet missing fixed length");
		return sj(e, n, r);
	}
	throw Error(`parquet unhandled type: ${t}`);
}
function ej(e, t) {
	let n = Array(t);
	for (let r = 0; r < t; r++) {
		let t = e.offset + (r / 8 | 0), i = r % 8, a = e.view.getUint8(t);
		n[r] = !!(a & 1 << i);
	}
	return e.offset += Math.ceil(t / 8), n;
}
function tj(e, t) {
	let n = (e.view.byteOffset + e.offset) % 4 ? new Int32Array(cj(e.view.buffer, e.view.byteOffset + e.offset, t * 4)) : new Int32Array(e.view.buffer, e.view.byteOffset + e.offset, t);
	return e.offset += t * 4, n;
}
function nj(e, t) {
	let n = (e.view.byteOffset + e.offset) % 8 ? new BigInt64Array(cj(e.view.buffer, e.view.byteOffset + e.offset, t * 8)) : new BigInt64Array(e.view.buffer, e.view.byteOffset + e.offset, t);
	return e.offset += t * 8, n;
}
function rj(e, t) {
	let n = Array(t);
	for (let r = 0; r < t; r++) {
		let t = e.view.getBigInt64(e.offset + r * 12, !0), i = e.view.getInt32(e.offset + r * 12 + 8, !0);
		n[r] = BigInt(i) << 64n | t;
	}
	return e.offset += t * 12, n;
}
function ij(e, t) {
	let n = (e.view.byteOffset + e.offset) % 4 ? new Float32Array(cj(e.view.buffer, e.view.byteOffset + e.offset, t * 4)) : new Float32Array(e.view.buffer, e.view.byteOffset + e.offset, t);
	return e.offset += t * 4, n;
}
function aj(e, t) {
	let n = (e.view.byteOffset + e.offset) % 8 ? new Float64Array(cj(e.view.buffer, e.view.byteOffset + e.offset, t * 8)) : new Float64Array(e.view.buffer, e.view.byteOffset + e.offset, t);
	return e.offset += t * 8, n;
}
function oj(e, t) {
	let n = Array(t);
	for (let r = 0; r < t; r++) {
		let t = e.view.getUint32(e.offset, !0);
		e.offset += 4, n[r] = new Uint8Array(e.view.buffer, e.view.byteOffset + e.offset, t), e.offset += t;
	}
	return n;
}
function sj(e, t, n) {
	let r = Array(t);
	for (let i = 0; i < t; i++) r[i] = new Uint8Array(e.view.buffer, e.view.byteOffset + e.offset, n), e.offset += n;
	return r;
}
function cj(e, t, n) {
	let r = new ArrayBuffer(n);
	return new Uint8Array(r).set(new Uint8Array(e, t, n)), r;
}
//#endregion
//#region node_modules/hyparquet/src/snappy.js
var lj = [
	0,
	255,
	65535,
	16777215,
	4294967295
];
function uj(e, t, n, r, i) {
	for (let a = 0; a < i; a++) n[r + a] = e[t + a];
}
function dj(e, t) {
	let n = e.byteLength, r = t.byteLength, i = 0, a = 0;
	for (; i < n;) {
		let t = e[i];
		if (i++, t < 128) break;
	}
	if (r && i >= n) throw Error("invalid snappy length header");
	for (; i < n;) {
		let r = e[i], o = 0;
		if (i++, i >= n) throw Error("missing eof marker");
		if (r & 3) {
			let s = 0;
			switch (r & 3) {
				case 1:
					o = (r >>> 2 & 7) + 4, s = e[i] + (r >>> 5 << 8), i++;
					break;
				case 2:
					if (n <= i + 1) throw Error("snappy error end of input");
					o = (r >>> 2) + 1, s = e[i] + (e[i + 1] << 8), i += 2;
					break;
				case 3:
					if (n <= i + 3) throw Error("snappy error end of input");
					o = (r >>> 2) + 1, s = e[i] + (e[i + 1] << 8) + (e[i + 2] << 16) + (e[i + 3] << 24), i += 4;
			}
			if (s === 0 || isNaN(s)) throw Error(`invalid offset ${s} pos ${i} inputLength ${n}`);
			if (s > a) throw Error("cannot copy from before start of buffer");
			uj(t, a - s, t, a, o), a += o;
		} else {
			let o = (r >>> 2) + 1;
			if (o > 60) {
				if (i + 3 >= n) throw Error("snappy error literal pos + 3 >= inputLength");
				let t = o - 60;
				o = e[i] + (e[i + 1] << 8) + (e[i + 2] << 16) + (e[i + 3] << 24), o = (o & lj[t]) + 1, i += t;
			}
			if (i + o > n) throw Error("snappy error literal exceeds input length");
			uj(e, i, t, a, o), i += o, a += o;
		}
	}
	if (a !== r) throw Error("premature end of input");
}
//#endregion
//#region node_modules/hyparquet/src/datapage.js
function fj(e, t, { type: n, element: r, schemaPath: i }) {
	let a = new DataView(e.buffer, e.byteOffset, e.byteLength), o = {
		view: a,
		offset: 0
	}, s, c = pj(o, t, i), { definitionLevels: l, numNulls: u } = mj(o, t, i), d = t.num_values - u;
	if (t.encoding === "PLAIN") s = $A(o, n, d, r.type_length);
	else if (t.encoding === "PLAIN_DICTIONARY" || t.encoding === "RLE_DICTIONARY" || t.encoding === "RLE") {
		let e = n === "BOOLEAN" ? 1 : a.getUint8(o.offset++);
		e ? (s = Array(d), n === "BOOLEAN" ? (JA(o, e, s), s = s.map((e) => !!e)) : JA(o, e, s, a.byteLength - o.offset)) : s = new Uint8Array(d);
	} else if (t.encoding === "BYTE_STREAM_SPLIT") s = ZA(o, d, n, r.type_length);
	else if (t.encoding === "DELTA_BINARY_PACKED") s = n === "INT32" ? new Int32Array(d) : new BigInt64Array(d), GA(o, d, s);
	else if (t.encoding === "DELTA_LENGTH_BYTE_ARRAY") s = Array(d), KA(o, d, s);
	else throw Error(`parquet unsupported encoding: ${t.encoding}`);
	return {
		definitionLevels: l,
		repetitionLevels: c,
		dataPage: s
	};
}
function pj(e, t, n) {
	if (n.length > 1) {
		let r = ZO(n);
		if (r) {
			let n = Array(t.num_values);
			return JA(e, yj(r), n), n;
		}
	}
	return [];
}
function mj(e, t, n) {
	let r = QO(n);
	if (!r) return {
		definitionLevels: [],
		numNulls: 0
	};
	let i = Array(t.num_values);
	JA(e, yj(r), i);
	let a = t.num_values;
	for (let e of i) e === r && a--;
	return a === 0 && (i.length = 0), {
		definitionLevels: i,
		numNulls: a
	};
}
function hj(e, t, n, r) {
	let i, a = r?.[n];
	if (n === "UNCOMPRESSED") i = e;
	else if (a) i = a(e, t);
	else if (n === "SNAPPY") i = new Uint8Array(t), dj(e, i);
	else throw Error(`parquet unsupported compression codec: ${n}`);
	if (i?.length !== t) throw Error(`parquet decompressed page length ${i?.length} does not match header ${t}`);
	return i;
}
function gj(e, t, n) {
	let r = {
		view: new DataView(e.buffer, e.byteOffset, e.byteLength),
		offset: 0
	}, { type: i, element: a, schemaPath: o, codec: s, compressors: c } = n, l = t.data_page_header_v2;
	if (!l) throw Error("parquet data page header v2 is undefined");
	let u = _j(r, l, o);
	r.offset = l.repetition_levels_byte_length;
	let d = vj(r, l, o), f = t.uncompressed_page_size - l.definition_levels_byte_length - l.repetition_levels_byte_length, p = e.subarray(r.offset);
	l.is_compressed !== !1 && (p = hj(p, f, s, c));
	let m = new DataView(p.buffer, p.byteOffset, p.byteLength), h = {
		view: m,
		offset: 0
	}, g, _ = l.num_values - l.num_nulls;
	if (l.encoding === "PLAIN") g = $A(h, i, _, a.type_length);
	else if (l.encoding === "RLE") g = Array(_), JA(h, 1, g), g = g.map((e) => !!e);
	else if (l.encoding === "PLAIN_DICTIONARY" || l.encoding === "RLE_DICTIONARY") {
		let e = m.getUint8(h.offset++);
		g = Array(_), JA(h, e, g, f - 1);
	} else if (l.encoding === "DELTA_BINARY_PACKED") g = i === "INT32" ? new Int32Array(_) : new BigInt64Array(_), GA(h, _, g);
	else if (l.encoding === "DELTA_LENGTH_BYTE_ARRAY") g = Array(_), KA(h, _, g);
	else if (l.encoding === "DELTA_BYTE_ARRAY") g = Array(_), qA(h, _, g);
	else if (l.encoding === "BYTE_STREAM_SPLIT") g = ZA(h, _, i, a.type_length);
	else throw Error(`parquet unsupported encoding: ${l.encoding}`);
	return {
		definitionLevels: d,
		repetitionLevels: u,
		dataPage: g
	};
}
function _j(e, t, n) {
	let r = ZO(n);
	if (!r) return [];
	let i = Array(t.num_values);
	return JA(e, yj(r), i, t.repetition_levels_byte_length), i;
}
function vj(e, t, n) {
	let r = QO(n);
	if (r) {
		let n = Array(t.num_values);
		return JA(e, yj(r), n, t.definition_levels_byte_length), n;
	}
}
function yj(e) {
	return 32 - Math.clz32(e);
}
//#endregion
//#region node_modules/hyparquet/src/column.js
function bj(e, { groupStart: t, selectStart: n, selectEnd: r }, i, a) {
	let { pathInSchema: o, schemaPath: s } = i, c = tk(s), l = [], u, d, f = 0, p = 0, m = a && (() => {
		d && a({
			pathInSchema: o,
			columnData: d,
			rowStart: t + f - d.length,
			rowEnd: t + f
		});
	});
	for (; (c ? f < r : e.offset < e.view.byteLength - 1) && !(e.offset >= e.view.byteLength - 1);) {
		let t = Sj(e);
		if (t.type === "DICTIONARY_PAGE") {
			let { data: n } = xj(e, t, i, u, void 0, 0);
			n && (u = WO(n, i));
		} else {
			let r = d?.length || 0, a = xj(e, t, i, u, d, n - f);
			a.skipped ? (l.length || (p += a.skipped), f += a.skipped) : a.data && d === a.data ? f += a.data.length - r : a.data && a.data.length && (m?.(), l.push(a.data), f += a.data.length, d = a.data);
		}
	}
	return m?.(), {
		data: l,
		skipped: p
	};
}
function xj(e, t, n, r, i, a) {
	let { type: o, element: s, schemaPath: c, codec: l, compressors: u } = n, d = new Uint8Array(e.view.buffer, e.view.byteOffset + e.offset, t.compressed_page_size);
	if (e.offset += t.compressed_page_size, t.type === "DATA_PAGE") {
		let e = t.data_page_header;
		if (!e) throw Error("parquet data page header is undefined");
		if (a > e.num_values && tk(c)) return { skipped: e.num_values };
		let { definitionLevels: o, repetitionLevels: s, dataPage: f } = fj(hj(d, Number(t.uncompressed_page_size), l, u), e, n), p = UO(f, r, e.encoding, n);
		return {
			skipped: 0,
			data: BA(Array.isArray(i) ? i : [], o, s, p, c)
		};
	}
	if (t.type === "DATA_PAGE_V2") {
		let e = t.data_page_header_v2;
		if (!e) throw Error("parquet data page header v2 is undefined");
		if (a > e.num_rows) return { skipped: e.num_values };
		let { definitionLevels: o, repetitionLevels: s, dataPage: l } = gj(d, t, n), u = UO(l, r, e.encoding, n);
		return {
			skipped: 0,
			data: BA(Array.isArray(i) ? i : [], o, s, u, c)
		};
	}
	if (t.type === "DICTIONARY_PAGE") {
		let e = t.dictionary_page_header;
		if (!e) throw Error("parquet dictionary page header is undefined");
		let n = hj(d, Number(t.uncompressed_page_size), l, u);
		return {
			skipped: 0,
			data: $A({
				view: new DataView(n.buffer, n.byteOffset, n.byteLength),
				offset: 0
			}, o, e.num_values, s.type_length)
		};
	}
	throw Error(`parquet unsupported page type: ${t.type}`);
}
function Sj(e) {
	let t = pk(e);
	return {
		type: NO[t.field_1],
		uncompressed_page_size: t.field_2,
		compressed_page_size: t.field_3,
		crc: t.field_4,
		data_page_header: t.field_5 && {
			num_values: t.field_5.field_1,
			encoding: kO[t.field_5.field_2],
			definition_level_encoding: kO[t.field_5.field_3],
			repetition_level_encoding: kO[t.field_5.field_4],
			statistics: t.field_5.field_5 && {
				max: t.field_5.field_5.field_1,
				min: t.field_5.field_5.field_2,
				null_count: t.field_5.field_5.field_3,
				distinct_count: t.field_5.field_5.field_4,
				max_value: t.field_5.field_5.field_5,
				min_value: t.field_5.field_5.field_6
			}
		},
		index_page_header: t.field_6,
		dictionary_page_header: t.field_7 && {
			num_values: t.field_7.field_1,
			encoding: kO[t.field_7.field_2],
			is_sorted: t.field_7.field_3
		},
		data_page_header_v2: t.field_8 && {
			num_values: t.field_8.field_1,
			num_nulls: t.field_8.field_2,
			num_rows: t.field_8.field_3,
			encoding: kO[t.field_8.field_4],
			definition_levels_byte_length: t.field_8.field_5,
			repetition_levels_byte_length: t.field_8.field_6,
			is_compressed: t.field_8.field_7 === void 0 || t.field_8.field_7,
			statistics: t.field_8.field_8
		}
	};
}
//#endregion
//#region node_modules/hyparquet/src/rowgroup.js
function Cj(e, { metadata: t }, n) {
	let r = [];
	for (let i of n.chunks) {
		let { path_in_schema: a } = i.columnMetadata, o = YO(t.schema, a), s = {
			pathInSchema: a,
			element: o[o.length - 1].element,
			schemaPath: o,
			parsers: {
				...HO,
				...e.parsers
			},
			...e,
			...i.columnMetadata
		}, { startByte: c, endByte: l } = i.range;
		"pageLocations" in i ? r.push({
			pathInSchema: a,
			data: wj(e, n, i, i.pageLocations, s)
		}) : "offsetIndex" in i ? r.push({
			pathInSchema: a,
			data: Promise.resolve(e.file.slice(i.offsetIndex.startByte, i.offsetIndex.endByte)).then((t) => {
				let r = jk({
					view: new DataView(t),
					offset: 0
				}).page_locations;
				return wj(e, n, i, r, s);
			})
		}) : r.push({
			pathInSchema: a,
			data: Promise.resolve(e.file.slice(c, l)).then((t) => bj({
				view: new DataView(t),
				offset: 0
			}, n, s, e.onPage))
		});
	}
	return {
		groupStart: n.groupStart,
		groupRows: n.groupRows,
		selectStart: n.selectStart,
		selectEnd: n.selectEnd,
		asyncColumns: r
	};
}
async function wj(e, t, n, r, i) {
	let { data_page_offset: a, dictionary_page_offset: o } = n.columnMetadata, { selectStart: s, selectEnd: c } = t, { startByte: l, endByte: u } = n.range, d = -1, f = o || a < r[0].offset;
	for (let e = 0; e < r.length; e++) {
		let n = r[e], i = Number(n.first_row_index), a = e + 1 < r.length ? Number(r[e + 1].first_row_index) : t.groupRows;
		d < 0 && a > s && (l = Number(n.offset), d = i), i < c && (u = Number(n.offset) + n.compressed_page_size);
	}
	d < 0 && (d = 0);
	let p;
	if (f && d) {
		let t = Number(r[0].offset) - n.range.startByte, [i, a] = await Promise.all([e.file.slice(n.range.startByte, Number(r[0].offset)), e.file.slice(l, u)]), o = new Uint8Array(t + a.byteLength);
		o.set(new Uint8Array(i, 0, t)), o.set(new Uint8Array(a), t), p = new DataView(o.buffer);
	} else p = f ? new DataView(await e.file.slice(n.range.startByte, u)) : new DataView(await e.file.slice(l, u));
	let { data: m, skipped: h } = bj({
		view: p,
		offset: 0
	}, d ? {
		...t,
		groupStart: t.groupStart + d,
		selectStart: t.selectStart - d,
		selectEnd: t.selectEnd - d
	} : t, i, e.onPage);
	return {
		data: m,
		skipped: d + h
	};
}
async function Tj({ asyncColumns: e }, t, n, r, i) {
	let a = await Promise.all(e.map((e) => e.data.then(({ skipped: e, data: t }) => ({
		skipped: e,
		data: tA(t)
	})))), o = n - t;
	if (i === "object") {
		let n = Array(o);
		for (let r = 0; r < o; r++) {
			let i = {};
			for (let n = 0; n < e.length; n++) {
				let { data: o, skipped: s } = a[n];
				i[e[n].pathInSchema[0]] = o[t + r - s];
			}
			n[r] = i;
		}
		return n;
	}
	let s = e.map((e) => e.pathInSchema[0]).filter((e) => !r || r.includes(e)), c = r ?? s, l = c.map((t) => e.findIndex((e) => e.pathInSchema[0] === t)), u = Array(o);
	for (let n = 0; n < o; n++) {
		let r = Array(e.length);
		for (let e = 0; e < c.length; e++) {
			let i = l[e];
			if (i < 0) throw Error(`parquet column not found: ${c[e]}`);
			let { data: o, skipped: s } = a[i];
			r[e] = o[t + n - s];
		}
		u[n] = r;
	}
	return u;
}
function Ej(e, t, n) {
	let { asyncColumns: r } = e;
	n = {
		...HO,
		...n
	};
	let i = [];
	for (let e of t.children) if (e.children.length) {
		let t = r.filter((t) => t.pathInSchema[0] === e.element.name);
		if (!t.length) continue;
		i.push({
			pathInSchema: e.path,
			data: (async () => {
				let r = await Promise.all(t.map((e) => e.data)), i = /* @__PURE__ */ new Map(), a = r.map(({ data: e }) => tA(e)), o = Math.max(...r.map((e) => e.skipped)), s = Math.min(...r.map((e, t) => e.skipped + a[t].length));
				for (let e = 0; e < t.length; e++) {
					let n = o - r[e].skipped, c = Math.max(0, s - o);
					i.set(t[e].pathInSchema.join("."), a[e].slice(n, n + c));
				}
				VA(i, e, n);
				let c = i.get(e.element.name);
				if (!c) throw Error("parquet column data not assembled");
				return {
					data: [c],
					skipped: o
				};
			})()
		});
	} else {
		let t = r.find((t) => t.pathInSchema[0] === e.element.name);
		t && i.push(t);
	}
	return {
		...e,
		asyncColumns: i
	};
}
//#endregion
//#region node_modules/hyparquet/src/scan.js
async function Dj(e) {
	let t = await Oj(e);
	return {
		options: t,
		plan: _A(t)
	};
}
async function Oj(e) {
	let t = e.metadata ?? await Ck(e.file, e), n = Tk(t).children.map((e) => e.element.name), r = iA(e.filter).filter((e) => !n.includes(e));
	if (r.length) throw Error(`parquet filter columns not found: ${r.join(", ")}`);
	if (e.columns) {
		let t = e.columns.filter((e) => !n.includes(e));
		if (t.length) throw Error(`parquet column not found: ${t[0]}`);
	}
	let i = {
		...e,
		metadata: t
	};
	return i = await Aj(i), i = await jj(i), i;
}
function kj(e, t) {
	let n = {
		...e,
		file: EA(e.file, t)
	};
	return t.groups.map((e) => Cj(n, t, e));
}
async function Aj(e) {
	if (!e.useBloomFilters || !e.filter || !e.metadata) return e;
	let t = Tk(e.metadata), n = {};
	for (let e of t.children) n[e.element.name] = e.element;
	let r = await SA({
		file: e.file,
		metadata: e.metadata,
		filter: e.filter,
		filterStrict: e.filterStrict
	});
	return {
		...e,
		bloomFiltersByGroup: r,
		schemaElements: n
	};
}
async function jj(e) {
	if (!e.usePageIndex || !e.filter || !e.metadata) return e;
	let { pageRangesByGroup: t, pageLocationsByGroup: n } = await CA({
		file: e.file,
		metadata: e.metadata,
		filter: e.filter,
		filterStrict: e.filterStrict,
		rowStart: e.rowStart,
		rowEnd: e.rowEnd,
		columns: e.columns,
		bloomFiltersByGroup: e.bloomFiltersByGroup,
		schemaElements: e.schemaElements,
		parsers: e.parsers
	});
	return {
		...e,
		pageRangesByGroup: t,
		pageLocationsByGroup: n
	};
}
//#endregion
//#region node_modules/hyparquet/src/read.js
async function Mj(e) {
	e.metadata ??= await Ck(e.file, e);
	let { rowStart: t = 0, rowEnd: n, columns: r, onChunk: i, onComplete: a, rowFormat: o, filter: s, filterStrict: c = !0 } = e;
	if (s && o !== "object") throw Error("parquet filter requires rowFormat: \"object\"");
	let l = iA(s), u = r;
	if (r && l.length) {
		let e = new Set(r), t = l.filter((t) => !e.has(t));
		t.length && (u = [...r, ...t]);
	}
	let d = await Dj(u === r ? e : {
		...e,
		columns: u
	}), f = d.options, p = u !== r, m = kj(f, d.plan);
	if (!a && !i) {
		await Nj(m);
		return;
	}
	if (!f.metadata) throw Error("parquet requires metadata");
	let h = Tk(f.metadata), g = m.map((t) => Ej(t, h, e.parsers));
	if (i) for (let e of g) for (let t of e.asyncColumns) t.data.then(({ data: n, skipped: r }) => {
		let a = e.groupStart + r;
		for (let e of n) i({
			columnName: t.pathInSchema[0],
			columnData: e,
			rowStart: a,
			rowEnd: a + e.length
		}), a += e.length;
	}, () => {});
	if (a) {
		await Nj(g);
		let e = [];
		for (let i of g) {
			let a = i.selectStart ?? Math.max(t - i.groupStart, 0), d = i.selectEnd ?? Math.min((n ?? Infinity) - i.groupStart, i.groupRows), f = o === "object" ? await Tj(i, a, d, u, "object") : await Tj(i, a, d, r, "array");
			if (s) {
				for (let t of f) if (aA(t, s, c)) {
					if (p && r) for (let e of l) r.includes(e) || delete t[e];
					e.push(t);
				}
			} else Xk(e, f);
		}
		a(e);
	} else await Nj(g);
}
async function Nj(e) {
	let t = e.flatMap((e) => e.asyncColumns.map((e) => e.data)), n = (await Promise.allSettled(t)).find((e) => e.status === "rejected");
	if (n) throw n.reason;
}
async function Pj(e) {
	if (e.columns?.length !== 1) throw Error("parquetReadColumn expected columns: [columnName]");
	e.metadata ??= await Ck(e.file, e);
	let t = e.columns[0], n = await Dj(e), r = kj(n.options, n.plan);
	if (!n.options.metadata) throw Error("parquet requires metadata");
	let i = Tk(n.options.metadata), a = r.map((t) => Ej(t, i, e.parsers));
	await Nj(a);
	let o = [];
	for (let e of a) {
		let n = e.asyncColumns.find((e) => e.pathInSchema[0] === t);
		if (!n) throw Error(`parquet column not found: ${t}`);
		let { data: r } = await n.data;
		for (let e of r) Xk(o, e);
	}
	return o;
}
function Fj(e) {
	return new Promise((t, n) => {
		Mj({
			...e,
			rowFormat: "object",
			onComplete: t
		}).catch(n);
	});
}
//#endregion
//#region node_modules/hyparquet/src/query.js
async function Ij(e) {
	if (!e.file || !(e.file.byteLength >= 0)) throw Error("parquet expected AsyncBuffer");
	e.metadata ??= await Ck(e.file, e);
	let { metadata: t, rowStart: n = 0, columns: r, orderBy: i, filter: a } = e;
	if (n < 0) throw Error("parquet rowStart must be positive");
	let o = e.rowEnd ?? Number(t.num_rows);
	if (i && !Tk(e.metadata).children.map((e) => e.element.name).includes(i)) throw Error(`parquet orderBy column not found: ${i}`);
	if (a && !i && o < t.num_rows) {
		let r = [], i = 0;
		for (let n of t.row_groups) {
			let t = i + Number(n.num_rows), a = await Fj({
				...e,
				rowStart: i,
				rowEnd: t
			});
			if (r.push(...a), r.length >= o) break;
			i = t;
		}
		return r.slice(n, o);
	}
	if (a && i) {
		let t = r && !r.includes(i) ? [...r, i] : r, a = await Fj({
			...e,
			rowStart: void 0,
			rowEnd: void 0,
			columns: t
		});
		if (a.sort((e, t) => Rj(e[i], t[i])), t !== r) for (let e of a) delete e[i];
		return a.slice(n, o);
	}
	if (a) return (await Fj({
		...e,
		rowStart: void 0,
		rowEnd: void 0
	})).slice(n, o);
	if (typeof i == "string") {
		let t = await Pj({
			...e,
			rowStart: void 0,
			rowEnd: void 0,
			columns: [i]
		}), r = Array.from(t, (e, t) => t).sort((e, n) => Rj(t[e], t[n])).slice(n, o), a = await Lj({
			...e,
			rows: r
		});
		return r.map((e) => a[e]);
	}
	return await Fj(e);
}
async function Lj(e) {
	let { file: t, rows: n } = e;
	e.metadata ??= await Ck(t, e);
	let { row_groups: r } = e.metadata, i = Array(r.length).fill(!1), a = 0, o = r.map((e) => a += Number(e.num_rows));
	for (let e of n) {
		let t = o.findIndex((t) => e < t);
		i[t] = !0;
	}
	let s = [], c;
	a = 0;
	for (let e = 0; e < i.length; e++) {
		let t = a + Number(r[e].num_rows);
		i[e] ? c === void 0 && (c = a) : c !== void 0 && (s.push([c, t]), c = void 0), a = t;
	}
	c !== void 0 && s.push([c, a]);
	let l = Array(Number(e.metadata.num_rows));
	for (let [t, n] of s) {
		let r = await Fj({
			...e,
			rowStart: t,
			rowEnd: n
		});
		for (let e = t; e < n; e++) l[e] = {
			__index__: e,
			...r[e - t]
		};
	}
	return l;
}
function Rj(e, t) {
	return e < t ? -1 : +(e > t);
}
//#endregion
//#region src/data/cube.ts
var zj = /* @__PURE__ */ new Map(), Bj = /* @__PURE__ */ new Map();
function Vj(e, t) {
	let n = {
		sessionBytes: 0,
		totalBytes: t.byteLength
	};
	return Bj.set(e, n), {
		byteLength: t.byteLength,
		async slice(e, r) {
			return n.sessionBytes += (r ?? t.byteLength) - e, t.slice(e, r);
		}
	};
}
async function Hj(e) {
	let [t, n] = await Promise.all([fetch(e.manifest).then((t) => {
		if (!t.ok) throw Error(`Failed to fetch manifest: ${e.manifest} (${t.status})`);
		return t.json();
	}), eA({ url: e.parquet })]), r = Vj(e.parquet, n);
	return {
		file: r,
		metadata: await Ck(r),
		manifest: t
	};
}
function Uj(e) {
	return zj.has(e.parquet) || zj.set(e.parquet, Hj(e)), zj.get(e.parquet);
}
function Wj(e) {
	return Bj.get(e) ?? null;
}
var Gj = /^(u?int|float|double|decimal)/i;
function Kj(e, t) {
	let n = {};
	for (let [r, i] of Object.entries(e)) n[r] = { $eq: Gj.test(t.columns[r] ?? "") ? Number(i) : i };
	return n;
}
async function qj(e, t) {
	let { file: n, metadata: r, manifest: i } = await Uj(e);
	return Ij({
		file: n,
		metadata: r,
		filter: Kj(t, i)
	});
}
//#endregion
//#region src/data/latestGuard.ts
var Jj = Symbol("stale-query");
function Yj() {
	let e = 0;
	return async function(t) {
		let n = ++e, r = await t;
		return n === e ? r : Jj;
	};
}
//#endregion
//#region src/data/treeSlice.ts
function Xj(e, t, n) {
	if (!e) return [];
	let r = e;
	for (;;) {
		let e = t[r.column];
		if (e == null) break;
		let n = r.values.find((t) => t.value === e);
		if (!n || !n.children) break;
		r = n.children;
	}
	return r.values.map((e) => ({
		value: e.value,
		total: Number(e[n] ?? 0)
	}));
}
//#endregion
//#region src/shared/dimensionControls.ts
function Zj(e, t, n) {
	let r = document.createElement("div");
	r.className = "obis-controls";
	let i = e.dimension_tree, a = { ...t.filter }, o = t.metric || e.measures[0] || "";
	function s(e) {
		e && (e.column in a || (a[e.column] = e.values[0]?.value), s((e.values.find((t) => t.value === a[e.column]) ?? e.values[0])?.children ?? null));
	}
	function c(e) {
		let t = [], n = e;
		for (; n;) t.push(n), n = (n.values.find((e) => e.value === a[n.column]) ?? n.values[0])?.children ?? null;
		return t;
	}
	function l(e, t, n, r) {
		let i = document.createElement("label");
		i.className = "obis-field";
		let a = document.createElement("span");
		a.textContent = e;
		let o = document.createElement("select");
		for (let e of t) {
			let t = document.createElement("option");
			t.value = e, t.textContent = e, t.selected = e === n, o.appendChild(t);
		}
		return o.addEventListener("change", () => r(o.value)), i.append(a, o), i;
	}
	function u() {
		r.textContent = "";
		let t = c(i);
		if (t.forEach((e, c) => {
			let d = l(e.column, e.values.map((e) => e.value), a[e.column], (r) => {
				a[e.column] = r;
				for (let e = c + 1; e < t.length; e++) delete a[t[e].column];
				s(i), u(), n({ ...a }, o);
			});
			r.appendChild(d);
		}), e.measures.length > 0) {
			let t = l("metric", e.measures, o, (e) => {
				o = e, n({ ...a }, o);
			});
			r.appendChild(t);
		}
	}
	return s(i), u(), {
		element: r,
		getFilter: () => ({ ...a }),
		getMetric: () => o,
		setFilter(e) {
			a = { ...e }, s(i), u();
		},
		setMetric(e) {
			o = e, u();
		}
	};
}
//#endregion
//#region src/shared/styles.ts
var Qj = "\n:host {\n	display: block;\n	font-family: system-ui, -apple-system, \"Segoe UI\", sans-serif;\n	color: #0b0b0b;\n	--obis-surface: #fcfcfb;\n	--obis-border: rgba(11, 11, 11, 0.1);\n	--obis-ink-secondary: #52514e;\n	--obis-ink-muted: #898781;\n	--obis-accent: #2a78d6;\n}\n* { box-sizing: border-box; }\n\n.obis-controls {\n	display: flex;\n	flex-wrap: wrap;\n	align-items: center;\n	gap: 0.5rem 1rem;\n	margin-bottom: 0.75rem;\n}\n.obis-field {\n	display: flex;\n	align-items: center;\n	gap: 0.4rem;\n	font-size: 0.78rem;\n	color: var(--obis-ink-secondary);\n	font-weight: 500;\n	text-transform: capitalize;\n}\n.obis-field select {\n	font: inherit;\n	font-size: 0.85rem;\n	padding: 0.28rem 0.45rem;\n	border: 1px solid var(--obis-border);\n	border-radius: 6px;\n	background: var(--obis-surface);\n	color: #0b0b0b;\n	min-width: 9rem;\n}\n\n.obis-panel {\n	position: absolute;\n	z-index: 5;\n	background: var(--obis-surface);\n	border: 1px solid var(--obis-border);\n	border-radius: 8px;\n	padding: 0.55rem 0.7rem;\n	font-size: 0.74rem;\n	color: var(--obis-ink-secondary);\n	box-shadow: 0 1px 4px rgba(11, 11, 11, 0.08);\n	pointer-events: none;\n}\n.obis-legend { top: 0.75rem; right: 0.75rem; width: 12rem; }\n.obis-legend-title { font-size: 0.76rem; font-weight: 600; color: #0b0b0b; margin-bottom: 0.35rem; }\n.obis-legend-ramp { height: 0.55rem; border-radius: 3px; margin-bottom: 0.2rem; }\n.obis-legend-scale { display: flex; justify-content: space-between; font-variant-numeric: tabular-nums; }\n.obis-stats { bottom: 0.75rem; left: 0.75rem; }\n.obis-stats .value { color: #0b0b0b; font-weight: 600; font-variant-numeric: tabular-nums; }\n\n.obis-map {\n	position: relative;\n	width: 100%;\n	aspect-ratio: 16 / 9;\n	border-radius: 8px;\n	overflow: hidden;\n	background: var(--obis-surface);\n}\n\n.obis-chart-container { width: 100%; }\n\n.obis-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }\n.obis-table th, .obis-table td {\n	text-align: left;\n	padding: 0.4rem 0.6rem;\n	border-bottom: 1px solid var(--obis-border);\n	font-variant-numeric: tabular-nums;\n}\n.obis-table th { cursor: pointer; user-select: none; color: var(--obis-ink-secondary); font-weight: 600; }\n.obis-table th:hover { color: var(--obis-accent); }\n.obis-table-wrap { max-height: 24rem; overflow: auto; border: 1px solid var(--obis-border); border-radius: 8px; }\n\n.obis-error { color: #b3261e; font-size: 0.85rem; padding: 0.5rem 0; }\n.obis-loading { color: var(--obis-ink-muted); font-size: 0.85rem; padding: 0.5rem 0; }\n";
[
	"#cde2fb",
	"#b7d3f6",
	"#9ec5f4",
	"#86b6ef",
	"#6da7ec",
	"#5598e7",
	"#3987e5",
	"#2a78d6",
	"#256abf",
	"#1c5cab",
	"#184f95",
	"#104281",
	"#0d366b"
].map((e) => [
	parseInt(e.slice(1, 3), 16),
	parseInt(e.slice(3, 5), 16),
	parseInt(e.slice(5, 7), 16)
]);
function $j(e) {
	return e >= 1e6 ? (e / 1e6).toFixed(e >= 1e7 ? 0 : 1) + "M" : e >= 1e3 ? (e / 1e3).toFixed(e >= 1e4 ? 0 : 1) + "K" : String(Math.round(e));
}
function eM(e) {
	return e >= 1e6 ? (e / 1e6).toFixed(2) + " MB" : e >= 1e3 ? (e / 1e3).toFixed(1) + " KB" : Math.round(e) + " B";
}
//#endregion
//#region src/obis-chart.ts
var tM = class extends HTMLElement {
	static get observedAttributes() {
		return [
			"parquet",
			"manifest",
			"kind",
			"metric",
			"filter",
			"top-n",
			"height",
			"hide-controls"
		];
	}
	root;
	controlsHost;
	bodyEl;
	statusEl;
	statsEl;
	controls;
	manifest;
	guard = Yj();
	sourceKey = "";
	sort = null;
	tableRows = [];
	constructor() {
		super(), this.root = this.attachShadow({ mode: "open" });
		let e = document.createElement("style");
		e.textContent = Qj, this.controlsHost = document.createElement("div"), this.statusEl = document.createElement("div"), this.statusEl.className = "obis-loading", this.statusEl.textContent = "Loading…", this.bodyEl = document.createElement("div"), this.statsEl = document.createElement("div"), this.statsEl.className = "obis-stats", this.statsEl.style.cssText = "position:static;margin-top:0.5rem;", this.root.append(e, this.controlsHost, this.statusEl, this.bodyEl, this.statsEl);
	}
	connectedCallback() {
		this.init();
	}
	attributeChangedCallback(e, t, n) {
		t === n || !this.isConnected || (e === "parquet" || e === "manifest" ? this.init() : e === "kind" || e === "top-n" ? this.refresh() : e === "metric" && this.controls ? (this.controls.setMetric(n ?? ""), this.refresh()) : e === "filter" && this.controls ? (this.controls.setFilter(n ? JSON.parse(n) : {}), this.refresh()) : e === "hide-controls" && this.controls && (this.controlsHost.style.display = this.hasAttribute("hide-controls") ? "none" : ""));
	}
	get filter() {
		return this.controls?.getFilter() ?? {};
	}
	set filter(e) {
		this.controls?.setFilter(e), this.refresh();
	}
	get metric() {
		return this.controls?.getMetric() ?? "";
	}
	set metric(e) {
		this.controls?.setMetric(e), this.refresh();
	}
	get kind() {
		let e = this.getAttribute("kind");
		return e === "line" || e === "table" ? e : "bar";
	}
	get topN() {
		let e = Number(this.getAttribute("top-n"));
		return Number.isFinite(e) && e > 0 ? e : this.kind === "table" ? 100 : 10;
	}
	async init() {
		let e = this.getAttribute("parquet"), t = this.getAttribute("manifest");
		if (!e || !t) {
			this.showError("obis-chart requires parquet and manifest attributes");
			return;
		}
		this.sourceKey = e;
		let n;
		try {
			n = await Uj({
				parquet: e,
				manifest: t
			});
		} catch (e) {
			this.showError(e instanceof Error ? e.message : String(e));
			return;
		}
		this.manifest = n.manifest, this.statusEl.style.display = "none";
		let r = this.getAttribute("filter") ? JSON.parse(this.getAttribute("filter")) : void 0, i = this.getAttribute("metric") || void 0;
		this.controls = Zj(n.manifest, {
			filter: r,
			metric: i
		}, (e, t) => {
			this.dispatchEvent(new CustomEvent("filterchange", {
				detail: {
					filter: e,
					metric: t
				},
				bubbles: !0
			})), this.refresh();
		}), this.controlsHost.replaceChildren(this.controls.element), this.controlsHost.style.display = this.hasAttribute("hide-controls") ? "none" : "", this.refresh();
	}
	async refresh() {
		!this.manifest || !this.controls || (this.kind === "table" ? await this.renderTable() : this.renderPlot());
	}
	renderPlot() {
		let e = this.controls.getMetric(), t = this.controls.getFilter(), n = Xj(this.manifest.dimension_tree, t, e);
		this.bodyEl.textContent = "";
		let r = document.createElement("div");
		if (r.className = "obis-chart-container", this.bodyEl.appendChild(r), this.statsEl.textContent = "", this.kind === "bar") {
			let t = [...n].sort((e, t) => t.total - e.total).slice(0, this.topN), i = dD({
				marginLeft: 140,
				x: {
					label: e,
					grid: !0
				},
				y: { label: null },
				marks: [yO(t, {
					y: "value",
					x: "total",
					sort: { y: "-x" },
					fill: "#2a78d6"
				}), Nw([0])]
			});
			r.appendChild(i);
		} else {
			let t = n.map((e) => ({
				...e,
				x: isNaN(Number(e.value)) ? e.value : Number(e.value)
			})).sort((e, t) => e.x < t.x ? -1 : +(e.x > t.x)), i = dD({
				x: { label: null },
				y: {
					label: e,
					grid: !0
				},
				marks: [DO(t, {
					x: "x",
					y: "total",
					stroke: "#2a78d6",
					strokeWidth: 2
				}), CO(t, {
					x: "x",
					y: "total",
					fill: "#2a78d6",
					r: 3
				})]
			});
			r.appendChild(i);
		}
	}
	async renderTable() {
		let e = this.controls.getMetric(), t = this.controls.getFilter(), n = this.getAttribute("parquet"), r = this.getAttribute("manifest"), i = await this.guard(qj({
			parquet: n,
			manifest: r
		}, t));
		i !== Jj && (this.tableRows = i, this.sort = {
			column: e,
			dir: -1
		}, this.paintTable(), this.updateStats());
	}
	paintTable() {
		if (!this.manifest) return;
		let e = Object.keys(this.manifest.columns), t = [...this.tableRows];
		if (this.sort) {
			let { column: e, dir: n } = this.sort;
			t.sort((t, r) => {
				let i = t[e], a = r[e];
				return typeof i == "number" && typeof a == "number" ? (i - a) * n : String(i ?? "").localeCompare(String(a ?? "")) * n;
			});
		}
		t = t.slice(0, this.topN), this.bodyEl.textContent = "";
		let n = document.createElement("div");
		n.className = "obis-table-wrap";
		let r = document.createElement("table");
		r.className = "obis-table";
		let i = document.createElement("thead"), a = document.createElement("tr");
		for (let t of e) {
			let e = document.createElement("th");
			e.textContent = t + (this.sort?.column === t ? this.sort.dir === 1 ? " ▲" : " ▼" : ""), e.addEventListener("click", () => {
				this.sort = {
					column: t,
					dir: this.sort?.column === t ? this.sort.dir === 1 ? -1 : 1 : -1
				}, this.paintTable();
			}), a.appendChild(e);
		}
		i.appendChild(a);
		let o = document.createElement("tbody");
		for (let n of t) {
			let t = document.createElement("tr");
			for (let r of e) {
				let e = document.createElement("td"), i = n[r];
				e.textContent = typeof i == "number" ? $j(i) : String(i ?? ""), t.appendChild(e);
			}
			o.appendChild(t);
		}
		r.append(i, o), n.appendChild(r), this.getAttribute("height") && (n.style.maxHeight = this.getAttribute("height")), this.bodyEl.appendChild(n);
	}
	updateStats() {
		let e = Wj(this.sourceKey);
		if (this.statsEl.textContent = "", !e) return;
		let t = document.createElement("span");
		t.className = "value", t.textContent = eM(e.sessionBytes), this.statsEl.append(`${this.tableRows.length} rows · `, t, ` of ${eM(e.totalBytes)} read this session`);
	}
	showError(e) {
		this.statusEl.className = "obis-error", this.statusEl.textContent = e, this.statusEl.style.display = "";
	}
};
customElements.get("obis-chart") || customElements.define("obis-chart", tM);
//#endregion
export { tM as ObisChart };
