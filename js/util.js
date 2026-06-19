// util.js — dates, DOM helpers, tiny SVG charts. No dependencies.

// ---------- DOM ----------
// h('div.card#id', {onclick}, [children|strings]) -> element
export function h(sel, attrs = {}, children = []) {
  const [tagAndId, ...classes] = sel.split('.');
  const [tag, id] = tagAndId.split('#');
  const el = document.createElement(tag || 'div');
  if (id) el.id = id;
  if (classes.length) el.className = classes.join(' ');
  if (Array.isArray(attrs) || typeof attrs === 'string') { children = attrs; attrs = {}; }
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = (el.className ? el.className + ' ' : '') + v;
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'text') el.textContent = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if (k === 'dataset') Object.assign(el.dataset, v);
    else if (k in el && k !== 'list' && k !== 'type') { try { el[k] = v; } catch { el.setAttribute(k, v); } }
    else el.setAttribute(k, v);
  }
  appendChildren(el, children);
  return el;
}
function appendChildren(el, children) {
  if (children == null) return;
  const arr = Array.isArray(children) ? children : [children];
  for (const c of arr) {
    if (c == null || c === false) continue;
    el.appendChild(typeof c === 'string' || typeof c === 'number'
      ? document.createTextNode(String(c)) : c);
  }
}
export const frag = (children) => { const f = document.createDocumentFragment(); appendChildren(f, children); return f; };
export const clear = (el) => { while (el.firstChild) el.removeChild(el.firstChild); return el; };
export const $ = (sel, root = document) => root.querySelector(sel);

// ---------- Dates ----------
export function today() { return ymd(new Date()); }
export function ymd(d) {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
export function parseYmd(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
export function daysBetween(a, b) { return Math.round((b - a) / 86400000); }
export function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }

// ISO week key 'YYYY-Www'
export function isoWeek(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

export function weeksSince(isoDateStr) {
  if (!isoDateStr) return null;
  const start = parseYmd(isoDateStr);
  return Math.max(0, Math.floor(daysBetween(start, new Date()) / 7));
}

export function prettyDate(s) {
  const d = typeof s === 'string' ? parseYmd(s) : s;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
export function weekdayShort(s) {
  const d = typeof s === 'string' ? parseYmd(s) : s;
  return d.toLocaleDateString(undefined, { weekday: 'short' });
}

// ---------- Numbers ----------
export const round = (n, p = 0) => { const f = 10 ** p; return Math.round(n * f) / f; };
export const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
export function lbsToKg(lb) { return lb * 0.453592; }
export function feetInToCm(totalIn) { return totalIn * 2.54; }

// ---------- Tiny SVG line chart ----------
// points: [{x:Date|number, y:number}], opts {w,h,color,fill}
export function lineChart(points, opts = {}) {
  const w = opts.w || 320, hh = opts.h || 120, pad = 10;
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', `0 0 ${w} ${hh}`);
  svg.setAttribute('width', '100%');
  svg.style.display = 'block';
  if (!points || points.length === 0) return svg;

  const xs = points.map((p) => +p.x), ys = points.map((p) => p.y);
  const xmin = Math.min(...xs), xmax = Math.max(...xs);
  let ymin = Math.min(...ys), ymax = Math.max(...ys);
  if (ymin === ymax) { ymin -= 1; ymax += 1; }
  const sx = (x) => pad + ((x - xmin) / (xmax - xmin || 1)) * (w - 2 * pad);
  const sy = (y) => hh - pad - ((y - ymin) / (ymax - ymin || 1)) * (hh - 2 * pad);

  const d = points.map((p, i) => `${i ? 'L' : 'M'}${round(sx(+p.x), 1)},${round(sy(p.y), 1)}`).join(' ');
  const color = opts.color || '#c8910c';
  if (opts.fill) {
    const area = document.createElementNS(ns, 'path');
    area.setAttribute('d', `${d} L${round(sx(xmax),1)},${hh - pad} L${round(sx(xmin),1)},${hh - pad} Z`);
    area.setAttribute('fill', opts.fill);
    svg.appendChild(area);
  }
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', d);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', color);
  path.setAttribute('stroke-width', '2.5');
  path.setAttribute('stroke-linejoin', 'round');
  path.setAttribute('stroke-linecap', 'round');
  svg.appendChild(path);

  points.forEach((p) => {
    const c = document.createElementNS(ns, 'circle');
    c.setAttribute('cx', round(sx(+p.x), 1)); c.setAttribute('cy', round(sy(p.y), 1));
    c.setAttribute('r', '2.6'); c.setAttribute('fill', color);
    svg.appendChild(c);
  });
  return svg;
}

// simple moving average smoothing
export function smooth(values, win = 3) {
  if (values.length <= 1) return values.slice();
  return values.map((_, i) => {
    const a = Math.max(0, i - win + 1);
    const slice = values.slice(a, i + 1);
    return slice.reduce((s, v) => s + v, 0) / slice.length;
  });
}

// ---------- misc ----------
export function uid() { return 'm' + Math.abs(hashStr(String(Date.now()) + Math.floor(performance.now() * 1000))).toString(36); }
function hashStr(s) { let h = 0; for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; } return h; }
export function titleCase(s) { return s.replace(/\b\w/g, (c) => c.toUpperCase()); }
