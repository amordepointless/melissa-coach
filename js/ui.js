// ui.js — shared UI helpers: toast, bottom sheet, video block, headers.
import { h, clear } from './util.js';

export function toast(msg, ms = 2200) {
  const t = h('div.toast', {}, msg);
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; }, ms - 300);
  setTimeout(() => t.remove(), ms);
}
window.__toast = toast;

// Bottom sheet modal. content is an element; returns a close() fn.
export function sheet(content, { onClose } = {}) {
  const inner = h('div.sheet', {}, [ h('div.sheet-grab'), content ]);
  const bg = h('div.sheet-bg', { onclick: (e) => { if (e.target === bg) close(); } }, [inner]);
  document.body.appendChild(bg);
  document.body.style.overflow = 'hidden';
  function close() { bg.remove(); document.body.style.overflow = ''; if (onClose) onClose(); }
  return { close, el: inner };
}

// Page header with optional back button + action.
export function pageHeader(title, { sub, back, action } = {}) {
  return h('div', {}, [
    back ? h('button.link-btn', { onclick: back, style: 'margin-bottom:4px' }, '‹ Back') : null,
    h('div.row.between', {}, [
      h('div', {}, [ h('h1', {}, title), sub ? h('p.muted', { style: 'margin:0' }, sub) : null ]),
      action || null,
    ]),
  ]);
}

// Video / demo block. If videoId present -> embed; else a "watch demo" button
// that opens a YouTube search for a reputable demonstration.
export function demoVideo(ex) {
  if (ex.videoId) {
    return h('div.video', {}, [
      h('iframe', { src: `https://www.youtube-nocookie.com/embed/${ex.videoId}`, allow: 'encrypted-media; picture-in-picture', loading: 'lazy', referrerpolicy: 'no-referrer' }),
    ]);
  }
  const url = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(ex.searchQuery || ex.name);
  return h('button.btn.secondary.small', { onclick: () => window.open(url, '_blank', 'noopener') }, '▶  Watch a demo');
}

// A simple labeled stat tile.
export function stat(value, key) {
  return h('div.stat', {}, [ h('div.v', {}, value), h('div.k', {}, key) ]);
}

// 1–5 scale picker. onPick(value). selected highlights.
export function scalePicker(selected, onPick, labels) {
  const wrap = h('div.scale');
  for (let i = 1; i <= 5; i++) {
    const b = h('button', { onclick: () => { onPick(i); [...wrap.children].forEach((c) => c.classList.remove('on')); b.classList.add('on'); } }, String(i));
    if (selected === i) b.classList.add('on');
    wrap.appendChild(b);
  }
  return h('div', {}, [ wrap, labels ? h('div.row.between.tiny.muted', { style: 'margin-top:4px' }, [ h('span', {}, labels[0]), h('span', {}, labels[1]) ]) : null ]);
}

export function render(viewEl, node) { clear(viewEl); viewEl.appendChild(node); window.scrollTo(0, 0); }
