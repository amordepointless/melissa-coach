// log.js — daily check-in, weekly check-in, measurements, workout logging.
import { h, clear, today, isoWeek, ymd } from '../util.js';
import { store } from '../store.js';
import { WARNING_SIGNS } from '../data/education.js';
import { pageHeader, scalePicker, toast } from '../ui.js';

export function renderLog(root, _arg, go) {
  let tab = 'daily';
  const frag = h('div', {}, [ pageHeader('Log', { sub: 'Keep it quick — a few taps is plenty' }) ]);
  const seg = h('div.seg', { style: 'margin:8px 0 14px' }, [
    sb('Today', 'daily'), sb('Week', 'weekly'), sb('Measure', 'measure'), sb('Run/Workout', 'workout'),
  ]);
  const panel = h('div');
  frag.appendChild(seg); frag.appendChild(panel); root.appendChild(frag);

  function sb(lbl, key) { return h('button', { type: 'button', class: key === tab ? 'on' : '', onclick: () => { tab = key; [...seg.children].forEach((c, i) => c.classList.toggle('on', ['daily', 'weekly', 'measure', 'workout'][i] === key)); paint(); } }, lbl); }
  function paint() { clear(panel); panel.appendChild(({ daily: dailyPanel, weekly: weeklyPanel, measure: measurePanel, workout: workoutPanel }[tab])(go)); }
  paint();
}

// ---------- DAILY ----------
function dailyPanel(go) {
  const k = today();
  const logs = store.read('dailyLogs');
  const cur = logs[k] || {};
  const draft = { ...cur };

  const wrap = h('div', {}, [ h('div.card', {}, [
    h('h3', {}, 'How are you today?'),
    metric('Energy', 'energy'), metric('How rested (sleep)', 'sleep'),
    metric('Mood', 'mood'), metric('Soreness', 'soreness', true),
    h('label.field', { style: 'margin-top:6px' }, [ h('span', {}, 'Milk supply (info only)'),
      h('div.seg', {}, ['low', 'ok', 'abundant'].map((v) => {
        const b = h('button', { type: 'button', class: draft.supply === v ? 'on' : '', onclick: () => { draft.supply = v; b.parentNode.querySelectorAll('button').forEach((x) => x.classList.remove('on')); b.classList.add('on'); } }, { low: 'Low', ok: 'OK', abundant: 'Abundant' }[v]);
        return b;
      })) ]),
    h('label.field', {}, [ h('span', {}, 'Note (optional)'), h('textarea', { value: draft.note || '', placeholder: 'anything worth remembering…', oninput: (e) => draft.note = e.target.value }) ]),
    h('button.btn', { onclick: () => { logs[k] = draft; store.write('dailyLogs', logs); toast('Logged ✓'); go('today'); } }, 'Save today'),
  ]) ]);

  function metric(label, key, invert) {
    const box = h('label.field', {}, [ h('span', {}, label) ]);
    box.appendChild(scalePicker(draft[key] || null, (v) => draft[key] = v, invert ? ['none', 'a lot'] : ['low', 'great']));
    return box;
  }
  return wrap;
}

// ---------- WEEKLY ----------
function weeklyPanel(go) {
  const wk = isoWeek();
  const wl = store.read('weeklyLogs');
  const cur = wl[wk] || { symptoms: {} };
  const draft = { ...cur, symptoms: { ...(cur.symptoms || {}) } };

  const symRows = WARNING_SIGNS.filter((w) => w.id !== 'rhr').map((w) => {
    const on = !!draft.symptoms[w.id];
    const c = h('button.chip', { type: 'button', class: on ? 'on' : '', onclick: (e) => { draft.symptoms[w.id] = !draft.symptoms[w.id]; e.currentTarget.classList.toggle('on'); } }, w.label);
    return c;
  });

  return h('div', {}, [
    h('div.card', {}, [
      h('h3', {}, 'Weekly check-in'),
      h('label.field', {}, [ h('span', {}, 'Weight (lb)'), h('input', { type: 'number', inputmode: 'decimal', value: draft.weight != null ? draft.weight : '', placeholder: 'same morning, after the bathroom', oninput: (e) => draft.weight = e.target.value === '' ? null : Number(e.target.value) }) ]),
      h('p.tiny.muted', { style: 'margin-top:-8px' }, 'Weekly is plenty. We show the trend, not the daily number.'),
      h('label.field', {}, [ h('span', {}, 'Bleeding'), seldraft(draft, 'bleeding', [['none', 'None'], ['light', 'Light'], ['moderate', 'Moderate'], ['returned', 'Returned after activity']]) ]),
      h('h3', { style: 'margin-top:8px' }, 'Any of these this week?'),
      h('p.tiny.muted', {}, 'Tap any you noticed — they’ll flag a gentle “ease off” on your dashboard.'),
      h('div.chips', {}, symRows),
      h('label.field', { style: 'margin-top:12px' }, [ h('span', {}, 'How did the week feel?'), h('textarea', { value: draft.note || '', oninput: (e) => draft.note = e.target.value }) ]),
      h('button.btn', { onclick: () => { wl[wk] = draft; store.write('weeklyLogs', wl); toast('Week saved ✓'); go('progress'); } }, 'Save week'),
    ]),
  ]);
}

// ---------- MEASUREMENTS ----------
function measurePanel(go) {
  const list = store.read('measurements');
  const draft = { date: today(), waist: '', hip: '', thigh: '', chest: '' };
  const last = list[list.length - 1];
  return h('div', {}, [
    h('div.card', {}, [
      h('h3', {}, 'Tape measurements (inches)'),
      h('p.tiny.muted', {}, 'Every couple weeks. Waist is the most useful — measure relaxed, morning, at the navel.'),
      ...['waist', 'hip', 'thigh', 'chest'].map((kk) => h('label.field', {}, [ h('span', {}, kk[0].toUpperCase() + kk.slice(1) + (last && last[kk] ? ` (last: ${last[kk]}")` : '')), h('input', { type: 'number', inputmode: 'decimal', placeholder: 'in', oninput: (e) => draft[kk] = e.target.value === '' ? null : Number(e.target.value) }) ])),
      h('button.btn', { onclick: () => { if (!draft.waist && !draft.hip && !draft.thigh && !draft.chest) { toast('Add at least one'); return; } list.push(draft); store.write('measurements', list); toast('Saved ✓'); go('progress'); } }, 'Save measurements'),
    ]),
    last ? h('p.tiny.muted', { style: 'text-align:center' }, `Last logged ${last.date}`) : null,
  ]);
}

// ---------- WORKOUT ----------
function workoutPanel(go) {
  const list = store.read('workouts');
  const draft = { date: today(), type: 'run', distanceMi: '', durationMin: '', rpe: null, note: '' };
  return h('div', {}, [ h('div.card', {}, [
    h('h3', {}, 'Log a run / workout'),
    h('label.field', {}, [ h('span', {}, 'Type'), seldraft(draft, 'type', [['run', 'Run'], ['walk', 'Walk'], ['strength', 'Strength'], ['core', 'Core/Pelvic'], ['cross', 'Cross-train']]) ]),
    h('div.row', { style: 'gap:8px' }, [
      h('label.field', {}, [ h('span', {}, 'Distance (mi)'), h('input', { type: 'number', inputmode: 'decimal', oninput: (e) => draft.distanceMi = e.target.value === '' ? null : Number(e.target.value) }) ]),
      h('label.field', {}, [ h('span', {}, 'Time (min)'), h('input', { type: 'number', inputmode: 'numeric', oninput: (e) => draft.durationMin = e.target.value === '' ? null : Number(e.target.value) }) ]),
    ]),
    h('label.field', {}, [ h('span', {}, 'How hard did it feel? (1 easy – 5 hard)') ]),
    scalePicker(null, (v) => draft.rpe = v, ['easy', 'hard']),
    h('label.field', { style: 'margin-top:10px' }, [ h('span', {}, 'Note (optional)'), h('textarea', { placeholder: 'felt great / any leaking or pain?', oninput: (e) => draft.note = e.target.value }) ]),
    h('button.btn', { onclick: () => { list.push(draft); store.write('workouts', list); toast('Workout logged ✓'); go('today'); } }, 'Save workout'),
  ]) ]);
}

function seldraft(draft, key, options) {
  const sel = h('select', { onchange: (e) => draft[key] = e.target.value });
  options.forEach(([v, l]) => { const o = h('option', { value: v }, l); if (draft[key] === v) o.selected = true; sel.appendChild(o); });
  if (draft[key] === undefined) draft[key] = options[0][0];
  return sel;
}
