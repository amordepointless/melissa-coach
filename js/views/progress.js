// progress.js — trends, weekly review, provider export, safety reference.
import { h, lineChart, smooth, parseYmd, prettyDate } from '../util.js';
import { store } from '../store.js';
import { weeksPostpartum, currentPhase, displayName } from '../state.js';
import { weeklyRecommendation, applyDecision } from '../engine/training-engine.js';
import { weightSeries, weightTrendPerWeek, activeWarnings } from '../engine/signals.js';
import { WARNING_SIGNS, SOURCES, DISCLAIMER } from '../data/education.js';
import { pageHeader, toast, sheet } from '../ui.js';
import { buildSummaryHtml } from '../export.js';

export function renderProgress(root, _arg, go) {
  const frag = h('div', {}, [ pageHeader('Progress', { sub: 'The trend matters more than any single day' }) ]);

  // ---- Weekly review ----
  const rec = weeklyRecommendation();
  const reviewCard = h('div.card.tint', {}, [
    h('div.card-h', {}, [ h('h2', {}, 'Weekly review'), recBadge(rec.status) ]),
    ...rec.reasons.map((r) => h('p', { style: 'margin:0 0 6px' }, r)),
  ]);
  reviewCard.appendChild(h('p', {}, narrative()));
  reviewCard.appendChild(h('button.btn', { onclick: () => { applyDecision(rec.status); toast(applyMsg(rec.status)); go('progress'); } }, applyLabel(rec.status)));
  frag.appendChild(reviewCard);

  // ---- Weight trend ----
  const ws = weightSeries();
  const wcard = h('div.card', {}, [ h('div.card-h', {}, [ h('h3', {}, 'Weight trend'), trendBadge() ]) ]);
  if (ws.length >= 2) {
    const sm = smooth(ws.map((d) => d.weight), 3);
    const pts = ws.map((d, i) => ({ x: i, y: sm[i] }));
    wcard.appendChild(lineChart(pts, { w: 320, h: 120, color: '#c8910c', fill: 'rgba(247,189,18,.16)' }));
    wcard.appendChild(h('div.row.between.tiny.muted', {}, [ h('span', {}, `${ws[0].weight} lb`), h('span', {}, `${ws[ws.length - 1].weight} lb (smoothed)`) ]));
  } else {
    wcard.appendChild(h('p', {}, 'Log your weight weekly (Log → Week) and the trend line shows up here.'));
  }
  frag.appendChild(wcard);

  // ---- Waist trend ----
  const meas = store.read('measurements').filter((m) => m.waist != null);
  if (meas.length >= 2) {
    const pts = meas.map((m, i) => ({ x: i, y: m.waist }));
    frag.appendChild(h('div.card', {}, [ h('h3', {}, 'Waist trend'), lineChart(pts, { w: 320, h: 100, color: '#6f7682', fill: 'rgba(139,147,160,.14)' }), h('div.row.between.tiny.muted', {}, [ h('span', {}, `${meas[0].waist}"`), h('span', {}, `${meas[meas.length - 1].waist}"`) ]) ]));
  }

  // ---- Recent workouts ----
  const wks = store.read('workouts').slice(-5).reverse();
  if (wks.length) {
    frag.appendChild(h('div.card', {}, [ h('h3', {}, 'Recent workouts'),
      h('ul.list', {}, wks.map((w) => h('li', {}, [ h('span.lead', {}, ({ run: '🏃‍♀️', walk: '🚶‍♀️', strength: '💪', core: '🧘‍♀️', cross: '🚴‍♀️' })[w.type] || '•'),
        h('div.grow', {}, [ h('div.ttl', {}, `${w.type}${w.distanceMi ? ' · ' + w.distanceMi + ' mi' : ''}${w.durationMin ? ' · ' + w.durationMin + ' min' : ''}`), h('div.sub', {}, prettyDate(w.date) + (w.note ? ' · ' + w.note : '')) ]) ]))) ]));
  }

  // ---- Warning signs reference ----
  frag.appendChild(h('h2', {}, 'Signs to watch for'));
  frag.appendChild(h('div.card', {}, [
    h('p.tiny.muted', {}, 'If any of these show up, ease off and consider checking with your OB or a pelvic-floor PT.'),
    h('ul.list', {}, WARNING_SIGNS.map((w) => h('li', { style: 'align-items:flex-start' }, [ h('span.lead', { style: 'color:var(--amber)' }, '!'), h('div.grow', {}, [ h('div.ttl', {}, w.label), h('div.sub', {}, w.action) ]) ]))),
  ]));

  // ---- Export / backup ----
  frag.appendChild(h('h2', {}, 'Backup & sharing'));
  frag.appendChild(h('div.card', {}, [
    h('p.tiny.muted', {}, 'Your data lives only on this phone. Back it up now and then, and make a clean summary to show your OB or PT.'),
    h('div.btn-row', {}, [
      h('button.btn.secondary', { onclick: providerSummary }, 'Summary for provider'),
      h('button.btn.secondary', { onclick: exportBackup }, 'Export backup'),
    ]),
    h('button.btn.ghost', { style: 'margin-top:8px', onclick: () => importBackup(go) }, 'Restore from backup'),
  ]));

  // ---- About / disclaimer / sources ----
  frag.appendChild(h('div.card', {}, [
    h('h3', {}, 'Good to know'),
    h('p.tiny', {}, DISCLAIMER),
    h('details', {}, [ h('summary', { style: 'cursor:pointer;color:var(--brand-ink);font-size:.85rem' }, 'Sources'),
      h('ul', { style: 'padding-left:18px' }, SOURCES.map(([t, u]) => h('li', { style: 'font-size:.8rem;margin:4px 0' }, [ h('a', { href: u, target: '_blank', rel: 'noopener' }, t) ]))) ]),
  ]));

  // ---- Reset ----
  frag.appendChild(h('button.btn.ghost', { style: 'color:var(--red);margin-top:4px', onclick: () => { if (confirm('Erase everything and start over? Export a backup first if you want to keep it.')) { store.wipe(); location.reload(); } } }, 'Reset app'));

  root.appendChild(frag);
}

function narrative() {
  const wpp = weeksPostpartum();
  const trend = weightTrendPerWeek();
  const warns = activeWarnings();
  const parts = [];
  if (warns.length) parts.push('You flagged a symptom this week, so the plan suggests easing back — recovery first.');
  if (trend != null) {
    if (trend < -1) parts.push(`Weight is dropping about ${Math.abs(Math.round(trend * 10) / 10)} lb/week — a touch fast while nursing, so we nudged calories up.`);
    else if (trend < 0) parts.push('Weight is easing down gently — right in the safe zone.');
    else parts.push('Weight is steady this week; if your waist or runs are improving, that’s real progress the scale won’t show.');
  }
  if (wpp != null) parts.push(`You’re ${wpp} weeks postpartum and building back — this is a months-long arc by design.`);
  return parts.join(' ') || 'Keep logging a few days and your weekly story will show up here.';
}

function recBadge(s) { const m = { progress: ['green', 'Progress'], hold: ['amber', 'Hold'], deload: ['red', 'Ease off'] }; const [c, t] = m[s] || m.hold; return h(`span.badge.${c}`, {}, t); }
function applyLabel(s) { return { progress: 'Advance to next week ✓', hold: 'Repeat this week', deload: 'Step back a week' }[s] || 'Log this review'; }
function applyMsg(s) { return { progress: 'Nice work — moving forward', hold: 'Holding steady this week', deload: 'Backed off — recover well' }[s] || 'Saved'; }
function trendBadge() {
  const t = weightTrendPerWeek();
  if (t == null) return h('span.badge.brand', {}, 'need data');
  if (t < -1) return h('span.badge.amber', {}, 'fast');
  if (t < 0) return h('span.badge.green', {}, 'gentle');
  return h('span.badge.brand', {}, 'steady');
}

// ---- export helpers ----
function exportBackup() {
  const data = store.exportAll();
  download(`melissa-coach-backup.json`, JSON.stringify(data, null, 2), 'application/json');
  toast('Backup downloaded');
}
function importBackup(go) {
  const input = h('input', { type: 'file', accept: 'application/json', style: 'display:none', onchange: (e) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => { try { store.importAll(JSON.parse(r.result)); toast('Restored ✓'); go('today'); } catch (err) { toast('Could not read that file'); } };
    r.readAsText(f);
  } });
  document.body.appendChild(input); input.click(); setTimeout(() => input.remove(), 1000);
}
function providerSummary() {
  const html = buildSummaryHtml();
  const w = window.open('', '_blank');
  if (!w) { toast('Allow pop-ups to view the summary'); return; }
  w.document.write(html); w.document.close();
}
function download(name, text, type) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = h('a', { href: url, download: name }); document.body.appendChild(a); a.click();
  setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 1000);
}
