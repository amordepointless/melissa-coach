// today.js — the dashboard: greeting, quick log, today's workout + meals, alerts.
import { h, today, isoWeek, parseYmd } from '../util.js';
import { store } from '../store.js';
import { weeksPostpartum, currentPhase, displayName } from '../state.js';
import { todaySession, weeklyRecommendation, runWalkForWeek } from '../engine/training-engine.js';
import { loggedToday, activeWarnings, recoverySnapshot } from '../engine/signals.js';
import { WARNING_SIGNS } from '../data/education.js';
import { exById } from '../data/exercises.js';
import { ensurePlan, mealById, dayTotals, PLAN_SLOTS, rerollMeal } from '../engine/nutrition-engine.js';
import { pageHeader, stat } from '../ui.js';
import { APP_VERSION, BUILD_DATE } from '../version.js';

export function renderToday(root, _arg, go) {
  const wpp = weeksPostpartum();
  const phase = currentPhase();
  const greet = greeting();

  const frag = h('div', {}, [
    pageHeader(`${greet}, ${displayName()} 🌼`, { sub: wpp != null ? `${wpp} weeks postpartum · ${phase.name} phase` : phase.name }),
  ]);

  // ---- Warnings (if any logged this week) ----
  const warns = activeWarnings();
  if (warns.length) {
    const list = warns.map((id) => WARNING_SIGNS.find((w) => w.id === id)).filter(Boolean);
    frag.appendChild(h('div.callout.warn', {}, [
      h('h3', {}, '⚠️ Worth easing off this week'),
      ...list.map((w) => h('p', {}, `${w.label} — ${w.action}`)),
      h('p.tiny', {}, 'You decide what’s right — this is just a heads-up.'),
    ]));
  }

  // ---- Quick daily check-in ----
  if (!loggedToday()) {
    frag.appendChild(h('div.card.tint', {}, [
      h('div.row.between', {}, [
        h('div', {}, [ h('h3', {}, 'Quick check-in'), h('p.tiny', { style: 'margin:0' }, '20 seconds — how are you today?') ]),
        h('button.btn.small', { onclick: () => go('log') }, 'Log'),
      ]),
    ]));
  } else {
    const r = recoverySnapshot();
    frag.appendChild(h('div.stats', {}, [
      stat(fmt(r.energy), 'Energy'),
      stat(fmt(r.sleep), 'Rested'),
      stat(fmt(r.soreness), 'Soreness'),
    ]));
  }

  // ---- Today's workout ----
  const sess = todaySession();
  const sessCard = h('div.card', {}, [
    h('div.card-h', {}, [ h('h2', {}, 'Today’s movement'), h('span.badge.brand', {}, sess.type) ]),
    h('h3', {}, sess.title),
  ]);
  if (sess.type === 'run' && phase.n === 1 && sess.items.some((i) => i.id === 'run-walk')) {
    const rw = runWalkForWeek();
    sessCard.appendChild(h('div.callout', {}, [ h('p', {}, `Intervals: ${rw.label}`) ]));
  }
  if (sess.note) sessCard.appendChild(h('p', {}, sess.note));
  if (sess.items.length) {
    sessCard.appendChild(h('ul.list', {}, sess.items.slice(0, 5).map((it) => {
      const ex = exById[it.id];
      return h('li', {}, [
        h('span.lead', {}, iconFor(ex ? ex.cat : '')),
        h('div.grow', {}, [ h('div.ttl', {}, ex ? ex.name : it.id), h('div.sub', {}, it.target || (ex && ex.target) || '') ]),
      ]);
    })));
  } else {
    sessCard.appendChild(h('p', {}, 'Rest day — gentle movement only. Carrying the babies counts.'));
  }
  sessCard.appendChild(h('button.btn.secondary', { onclick: () => go('train') }, 'Open full plan'));

  // ---- Mark done / skip (skipping is always fine — logged, never penalized) ----
  const slog = store.read('sessionLog');
  const tKey = today();
  const status = slog[tKey] && slog[tKey].status;
  const mark = (st) => { const s = store.read('sessionLog'); if (status === st) delete s[tKey]; else s[tKey] = { status: st, title: sess.title }; store.write('sessionLog', s); go('today'); };
  sessCard.appendChild(h('div.btn-row', { style: 'margin-top:10px' }, [
    h(status === 'done' ? 'button.btn' : 'button.btn.secondary', { onclick: () => mark('done') }, status === 'done' ? 'Done ✓' : 'Did it ✓'),
    h(status === 'skipped' ? 'button.btn' : 'button.btn.secondary', { onclick: () => mark('skipped') }, status === 'skipped' ? 'Skipped — that’s ok' : 'Skip / rest day'),
  ]));
  const wk = isoWeek();
  let done = 0, skipped = 0;
  Object.entries(slog).forEach(([d, v]) => { if (isoWeek(parseYmd(d)) === wk) { if (v.status === 'done') done++; else if (v.status === 'skipped') skipped++; } });
  sessCard.appendChild(h('p.tiny.muted.center', { style: 'margin-top:8px' }, `This week: ${done} done · ${skipped} skipped — rest days count, skipping never sets you back.`));
  frag.appendChild(sessCard);

  // ---- Today's meals ----
  const wkk = isoWeek();
  const plan = ensurePlan(wkk);   // always have a recommendation
  const dayKey = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][new Date().getDay()];
  const todayPlan = plan && plan[dayKey];
  const mealsCard = h('div.card', {}, [ h('div.card-h', {}, [ h('h2', {}, 'Eat today'), h('button.link-btn', { onclick: () => go('eat') }, 'Swap') ]) ]);
  if (todayPlan) {
    mealsCard.appendChild(h('ul.list', {}, PLAN_SLOTS.filter((s) => todayPlan[s]).map((s) => {
      const m = mealById(todayPlan[s]);
      return h('li', {}, [
        h('span.lead', {}, slotIcon(s)),
        h('div.grow', { onclick: () => go('eat') }, [ h('div.ttl', {}, m ? m.name : '—'), h('div.sub', {}, m ? `${m.kcal} kcal · ${m.protein}g protein` : '') ]),
        m ? h('button.link-btn', { title: 'Skip — suggest another', style: 'font-size:1.05rem;padding:4px 8px', onclick: (e) => { e.stopPropagation(); rerollMeal(wkk, dayKey, s); go('today'); } }, '↻') : null,
      ]);
    })));
    const tot = dayTotals(wkk, dayKey);
    mealsCard.appendChild(h('p.tiny.muted.center', { style: 'margin-top:6px' }, `~${tot.kcal} kcal · ${tot.protein}g protein planned today`));
  } else {
    mealsCard.appendChild(h('button.btn.secondary', { onclick: () => go('eat') }, 'See meal plan'));
  }
  frag.appendChild(mealsCard);

  // ---- Weekly nudge ----
  const rec = weeklyRecommendation();
  frag.appendChild(h('div.card', {}, [
    h('div.card-h', {}, [ h('h3', {}, 'This week'), recBadge(rec.status) ]),
    ...rec.reasons.map((r) => h('p', { style: 'margin:0 0 6px' }, r)),
    h('button.link-btn', { onclick: () => go('progress') }, 'See progress & review →'),
  ]));

  // Inconspicuous version stamp — confirms she's on the latest build.
  frag.appendChild(h('p.tiny.muted.center', { style: 'margin-top:20px;opacity:.55;font-size:.72rem' }, `v${APP_VERSION} · ${BUILD_DATE}`));

  root.appendChild(frag);
}

function greeting() { const hr = new Date().getHours(); return hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening'; }
function fmt(v) { return v == null ? '—' : (Math.round(v * 10) / 10).toString(); }
function recBadge(s) { const m = { progress: ['green', 'Progress'], hold: ['amber', 'Hold'], deload: ['red', 'Ease off'] }; const [c, t] = m[s] || m.hold; return h(`span.badge.${c}`, {}, t); }
function iconFor(cat) { return ({ pelvic: '🌸', core: '🧘‍♀️', strength: '💪', scar: '🩹', mobility: '🤸‍♀️', run: '🏃‍♀️', warmup: '🚶‍♀️' })[cat] || '•'; }
function slotIcon(s) { return ({ breakfast: '🥣', lunch: '🥗', dinner: '🍲', snack: '🍎', snack2: '🥜' })[s] || '•'; }
