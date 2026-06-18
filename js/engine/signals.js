// signals.js — turn recent logs into readable signals + warning flags.
// Pure functions over stored data; no UI.
import { store } from '../store.js';
import { today, parseYmd, addDays, ymd, isoWeek } from '../util.js';

// Pull the last N daily logs (most recent first), with their dates.
export function recentDailies(n = 7) {
  const logs = store.read('dailyLogs');
  const out = [];
  let d = parseYmd(today());
  for (let i = 0; i < n; i++) {
    const k = ymd(d);
    if (logs[k]) out.push({ date: k, ...logs[k] });
    d = addDays(d, -1);
  }
  return out;
}

function avg(arr) { return arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : null; }

// Aggregate recovery picture from the last week of daily taps.
export function recoverySnapshot() {
  const week = recentDailies(7).filter((l) => l.energy != null || l.sleep != null);
  return {
    count: week.length,
    energy: avg(week.map((l) => l.energy).filter((v) => v != null)),
    sleep: avg(week.map((l) => l.sleep).filter((v) => v != null)),
    soreness: avg(week.map((l) => l.soreness).filter((v) => v != null)),
    mood: avg(week.map((l) => l.mood).filter((v) => v != null)),
    poorSleepNights: week.filter((l) => (l.sleep || 5) <= 2).length,
  };
}

// Weekly weight series (chronological) from weeklyLogs.
export function weightSeries() {
  const wl = store.read('weeklyLogs');
  return Object.entries(wl)
    .filter(([, v]) => v && v.weight != null)
    .map(([wk, v]) => ({ week: wk, weight: Number(v.weight) }))
    .sort((a, b) => (a.week < b.week ? -1 : 1));
}

// Rate of weight change over the last ~2 weeks (lb/week). null if not enough data.
export function weightTrendPerWeek() {
  const s = weightSeries();
  if (s.length < 2) return null;
  const last = s[s.length - 1], prev = s[Math.max(0, s.length - 3)];
  const span = (s.length - 1) - Math.max(0, s.length - 3);
  if (span <= 0) return null;
  return (last.weight - prev.weight) / span;
}

// Active warning flags from the most recent weekly check-in + symptoms log.
export function activeWarnings() {
  const wl = store.read('weeklyLogs');
  const weeks = Object.keys(wl).sort();
  const latest = weeks.length ? wl[weeks[weeks.length - 1]] : null;
  const flags = [];
  if (latest && latest.symptoms) {
    const s = latest.symptoms;
    if (s.leak) flags.push('leak');
    if (s.heavy) flags.push('heavy');
    if (s.cone) flags.push('cone');
    if (s.scar) flags.push('scar');
    if (s.pain) flags.push('pain');
  }
  if (latest && latest.bleeding === 'returned') flags.push('bleed');
  return flags;
}

// Has the user logged anything today?
export function loggedToday() {
  const logs = store.read('dailyLogs');
  return !!logs[today()];
}
