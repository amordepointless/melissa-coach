// export.js — build a clean, printable summary page for her OB / PT.
import { store } from './store.js';
import { weeksPostpartum, currentPhase } from './state.js';
import { weightSeries } from './engine/signals.js';

export function buildSummaryHtml() {
  const p = store.read('profile');
  const wpp = weeksPostpartum();
  const phase = currentPhase();
  const ws = weightSeries();
  const meas = store.read('measurements');
  const workouts = store.read('workouts');
  const weekly = store.read('weeklyLogs');
  const readiness = store.read('readiness');

  const last8Workouts = workouts.slice(-8).reverse();
  const weeklyRows = Object.entries(weekly).sort().slice(-6);

  const esc = (s) => String(s == null ? '' : s).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
  const symptomList = (s) => s ? Object.entries(s).filter(([, v]) => v).map(([k]) => k).join(', ') : '';

  const css = `
    body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#222;max-width:720px;margin:24px auto;padding:0 18px;line-height:1.5}
    h1{font-size:1.4rem;margin:0 0 2px} h2{font-size:1.05rem;margin:22px 0 6px;border-bottom:2px solid #7c5cbf;padding-bottom:4px}
    .muted{color:#666} table{width:100%;border-collapse:collapse;font-size:.9rem;margin:6px 0}
    th,td{text-align:left;padding:6px 8px;border-bottom:1px solid #eee} th{color:#555}
    .note{background:#f6f2fb;border-left:3px solid #7c5cbf;padding:10px 12px;border-radius:6px;font-size:.85rem;margin:10px 0}
    @media print{button{display:none}}
    button{margin-top:16px;padding:10px 18px;border:0;border-radius:8px;background:#7c5cbf;color:#fff;font-size:1rem}
  `;

  const head = `
    <h1>Postpartum Training Summary — ${esc(p.name || 'Melissa')}</h1>
    <div class="muted">Generated ${new Date().toLocaleDateString()} · ${wpp != null ? wpp + ' weeks postpartum' : ''} · ${esc(phase.name)} phase</div>
    <div class="note">Self-reported data from a personal training app. Educational use; not a clinical record.</div>
    <h2>Profile</h2>
    <table>
      <tr><th>Height</th><td>${esc(p.heightIn)} in</td><th>Delivery</th><td>${esc(p.deliveryType)}</td></tr>
      <tr><th>Feeding</th><td>${esc(p.feeding)}</td><th>Clearance</th><td>${esc(p.clearance)}</td></tr>
      <tr><th>Current run</th><td>${esc(p.currentRun)}</td><th>Goal</th><td>${esc((p.goalsRanked || []).join(', '))}</td></tr>
    </table>`;

  const weight = `
    <h2>Weight (weekly)</h2>
    ${ws.length ? `<table><tr><th>Week</th><th>lb</th></tr>${ws.slice(-8).map((d) => `<tr><td>${esc(d.week)}</td><td>${esc(d.weight)}</td></tr>`).join('')}</table>` : '<p class="muted">No weight logged yet.</p>'}`;

  const measure = `
    <h2>Measurements (in)</h2>
    ${meas.length ? `<table><tr><th>Date</th><th>Waist</th><th>Hip</th><th>Thigh</th><th>Chest</th></tr>${meas.slice(-6).map((m) => `<tr><td>${esc(m.date)}</td><td>${esc(m.waist)}</td><td>${esc(m.hip)}</td><td>${esc(m.thigh)}</td><td>${esc(m.chest)}</td></tr>`).join('')}</table>` : '<p class="muted">None logged.</p>'}`;

  const weeklyTbl = `
    <h2>Weekly check-ins</h2>
    ${weeklyRows.length ? `<table><tr><th>Week</th><th>Bleeding</th><th>Symptoms noted</th><th>Note</th></tr>${weeklyRows.map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v.bleeding)}</td><td>${esc(symptomList(v.symptoms))}</td><td>${esc(v.note)}</td></tr>`).join('')}</table>` : '<p class="muted">None logged.</p>'}`;

  const workoutsTbl = `
    <h2>Recent workouts</h2>
    ${last8Workouts.length ? `<table><tr><th>Date</th><th>Type</th><th>Distance</th><th>Time</th><th>Effort</th><th>Note</th></tr>${last8Workouts.map((w) => `<tr><td>${esc(w.date)}</td><td>${esc(w.type)}</td><td>${w.distanceMi ? esc(w.distanceMi) + ' mi' : ''}</td><td>${w.durationMin ? esc(w.durationMin) + ' min' : ''}</td><td>${w.rpe ? esc(w.rpe) + '/5' : ''}</td><td>${esc(w.note)}</td></tr>`).join('')}</table>` : '<p class="muted">None logged.</p>'}`;

  const readinessTbl = readiness ? `
    <h2>Run-readiness self-check</h2>
    <div class="muted">Taken ${new Date(readiness.takenAt).toLocaleDateString()}</div>
    <table>${Object.entries(readiness.items).map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v || '—')}</td></tr>`).join('')}</table>` : '';

  return `<!doctype html><html><head><meta charset="utf-8"><title>Summary — ${esc(p.name || 'Melissa')}</title><style>${css}</style></head>
    <body>${head}${weight}${measure}${weeklyTbl}${workoutsTbl}${readinessTbl}
    <button onclick="window.print()">Print / Save as PDF</button></body></html>`;
}
