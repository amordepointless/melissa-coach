// store.js — tiny persistence layer over localStorage.
// Everything lives on the device. One namespaced key per collection.
// Schema is versioned so future changes can migrate safely.

const NS = 'pc.';
const SCHEMA_VERSION = 1;

const DEFAULTS = {
  meta: { schemaVersion: SCHEMA_VERSION, createdAt: null },
  profile: { onboardingComplete: false },
  readiness: null,          // { items, diastasis, takenAt }
  phase: { phase: 0, weekInPhase: 1, startedAt: null, lastReview: null },
  dailyLogs: {},            // 'YYYY-MM-DD' -> { sleep,energy,mood,soreness,supply,note }
  weeklyLogs: {},           // 'YYYY-Www'  -> { weight, bleeding, symptoms{...}, note }
  measurements: [],         // [{ date, waist, hip, thigh, chest }]
  workouts: [],             // [{ date, type, distanceMi, durationMin, rpe, note }]
  meals: [],                // see data/meals.js shape
  mealPlan: {},             // 'YYYY-Www' -> { mon:{...}, ... }
  pantry: [],               // staples she says she keeps on hand (names, lowercased)
  settings: { units: 'imperial' },
};

function read(key) {
  try {
    const raw = localStorage.getItem(NS + key);
    if (raw == null) return clone(DEFAULTS[key]);
    return JSON.parse(raw);
  } catch (e) {
    console.warn('store.read failed', key, e);
    return clone(DEFAULTS[key]);
  }
}

function write(key, value) {
  try {
    localStorage.setItem(NS + key, JSON.stringify(value));
  } catch (e) {
    console.error('store.write failed (storage full?)', key, e);
    toastError();
  }
  return value;
}

function clone(v) { return v == null ? v : JSON.parse(JSON.stringify(v)); }

function toastError() {
  // best-effort; app.js may override window.__toast
  if (window.__toast) window.__toast('Could not save — storage may be full');
}

// Merge helper for object-shaped collections (profile/settings/phase).
function patch(key, partial) {
  const cur = read(key) || {};
  const next = { ...cur, ...partial };
  return write(key, next);
}

// Initialise on first run.
function init() {
  const meta = read('meta');
  if (!meta.createdAt) {
    meta.createdAt = new Date().toISOString();
    meta.schemaVersion = SCHEMA_VERSION;
    write('meta', meta);
  }
  // (future) run migrations here when meta.schemaVersion < SCHEMA_VERSION
}

// Export / import the whole dataset (backup for OB/PT, device transfer).
function exportAll() {
  const out = { _app: 'melissa-coach', _exportedAt: new Date().toISOString(), data: {} };
  Object.keys(DEFAULTS).forEach((k) => { out.data[k] = read(k); });
  return out;
}

function importAll(obj) {
  if (!obj || !obj.data) throw new Error('Not a valid backup file');
  Object.keys(DEFAULTS).forEach((k) => {
    if (obj.data[k] !== undefined) write(k, obj.data[k]);
  });
}

function wipe() {
  Object.keys(DEFAULTS).forEach((k) => localStorage.removeItem(NS + k));
}

export const store = { read, write, patch, init, exportAll, importAll, wipe, DEFAULTS };
