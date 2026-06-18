// app.js — bootstrap, service worker, router.
import { store } from './store.js';
import { isOnboarded } from './state.js';
import { $, clear } from './util.js';

import { renderOnboarding } from './views/onboarding.js';
import { renderToday } from './views/today.js';
import { renderTrain } from './views/train.js';
import { renderEat } from './views/eat.js';
import { renderLog } from './views/log.js';
import { renderProgress } from './views/progress.js';

const viewEl = $('#view');
const tabbar = $('#tabbar');

const ROUTES = {
  today: renderToday,
  train: renderTrain,
  eat: renderEat,
  log: renderLog,
  progress: renderProgress,
};

let current = 'today';

export function go(route, arg) {
  if (!isOnboarded()) { showOnboarding(); return; }
  current = route in ROUTES ? route : 'today';
  tabbar.hidden = false;
  syncTabs();
  const fn = ROUTES[current];
  clear(viewEl);
  fn(viewEl, arg, go);
}
window.__go = go;

function showOnboarding() {
  tabbar.hidden = true;
  clear(viewEl);
  renderOnboarding(viewEl, () => { go('today'); });
}

function syncTabs() {
  [...tabbar.querySelectorAll('.tab')].forEach((t) => {
    t.classList.toggle('on', t.dataset.route === current);
  });
}

tabbar.addEventListener('click', (e) => {
  const tab = e.target.closest('.tab');
  if (tab) go(tab.dataset.route);
});

// ---- boot ----
store.init();
if (isOnboarded()) go('today'); else showOnboarding();

// ---- service worker (offline) ----
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch((e) => console.warn('SW failed', e));
  });
}
