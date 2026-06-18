// sw.js — offline cache. Bump CACHE when you change app files.
const CACHE = 'melissa-coach-v1';
const ASSETS = [
  './', './index.html', './manifest.webmanifest', './css/styles.css',
  './js/app.js', './js/store.js', './js/state.js', './js/util.js', './js/ui.js', './js/export.js',
  './js/data/exercises.js', './js/data/program.js', './js/data/meals.js', './js/data/questions.js', './js/data/education.js',
  './js/engine/signals.js', './js/engine/training-engine.js', './js/engine/nutrition-engine.js',
  './js/views/onboarding.js', './js/views/today.js', './js/views/train.js', './js/views/eat.js', './js/views/log.js', './js/views/progress.js',
  './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;
  // Network-first for app code (so updates land), cache fallback for offline.
  e.respondWith(
    fetch(request).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(request, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(request).then((r) => r || caches.match('./index.html')))
  );
});
