// train.js — phase plan, the week's sessions, exercise detail, readiness check.
import { h, clear } from '../util.js';
import { store } from '../store.js';
import { currentPhase, phaseState } from '../state.js';
import { PHASES, READINESS_TESTS, READINESS_RULE } from '../data/program.js';
import { weekSessions, runWalkForWeek } from '../engine/training-engine.js';
import { exById } from '../data/exercises.js';
import { pageHeader, demoVideo, sheet, toast } from '../ui.js';

export function renderTrain(root, _arg, go) {
  const phase = currentPhase();
  const ps = phaseState();

  const frag = h('div', {}, [
    pageHeader('Train', { sub: `${phase.name} · week ${ps.weekInPhase}` }),
  ]);

  // Phase overview
  const pcard = h('div.card.tint', {}, [
    h('div.card-h', {}, [ h('h2', {}, `Phase ${phase.n}: ${phase.name}`), h('span.badge.brand', {}, phase.typicalWeeks) ]),
    h('p', {}, phase.blurb),
    h('div.chips', {}, phase.focus.map((f) => h('span.chip', {}, f))),
    h('div.callout', { style: 'margin-top:12px' }, [ h('p', {}, phase.runGuidance) ]),
  ]);
  frag.appendChild(pcard);

  // Readiness check prompt
  const readiness = store.read('readiness');
  frag.appendChild(h('div.card', {}, [
    h('div.card-h', {}, [ h('h3', {}, 'Run-readiness check'), readiness ? h('span.badge.green', {}, 'Done') : h('span.badge.amber', {}, 'Recommended') ]),
    h('p.tiny', {}, readiness ? `Last done ${new Date(readiness.takenAt).toLocaleDateString()}. Re-check anytime before adding running volume.` : 'Optional, but it tells us how fast to grow your running. Doesn’t block your easy runs.'),
    h('button.btn.secondary.small', { onclick: () => openReadiness(go) }, readiness ? 'Re-check readiness' : 'Take the check'),
  ]));

  // This week's sessions
  frag.appendChild(h('h2', {}, 'This week'));
  if (phase.n === 1) {
    const rw = runWalkForWeek();
    frag.appendChild(h('div.callout', {}, [ h('p', {}, `Run/walk this week: ${rw.label}` ) ]));
  }
  weekSessions().forEach((s) => {
    const card = h('div.card', { onclick: () => { if (s.items.length) openSession(s); } }, [
      h('div.card-h', {}, [ h('h3', {}, s.title), h('span.badge.brand', {}, s.type) ]),
      s.items.length ? h('p.tiny', { style: 'margin:0' }, s.items.map((i) => (exById[i.id] || {}).name || i.id).join(' · ')) : h('p.tiny', { style: 'margin:0' }, s.note || 'Rest'),
    ]);
    frag.appendChild(card);
  });

  // Phase map
  frag.appendChild(h('h2', {}, 'The road ahead'));
  frag.appendChild(h('div.card', {}, PHASES.map((p) => h('div.row', { style: 'padding:8px 0;align-items:flex-start;gap:10px' }, [
    h('span.lead', { style: p.n === phase.n ? '' : 'opacity:.4' }, p.n === phase.n ? '📍' : '○'),
    h('div.grow', {}, [ h('div.ttl', { style: p.n === phase.n ? 'color:var(--brand-ink)' : '' }, `${p.name}`), h('div.sub', {}, p.blurb) ]),
  ]))));

  root.appendChild(frag);
}

function openSession(s) {
  const content = h('div', {}, [
    h('h2', {}, s.title),
    s.note ? h('div.callout', {}, [ h('p', {}, s.note) ]) : null,
    ...s.items.map((it) => {
      const ex = exById[it.id];
      if (!ex) return null;
      return h('div.card', {}, [
        h('div.card-h', {}, [ h('h3', {}, ex.name), h('span.badge.brand', {}, it.target || ex.target || '') ]),
        h('ul', { style: 'margin:0 0 8px;padding-left:18px;color:var(--ink-soft);font-size:.9rem' }, ex.cues.map((c) => h('li', {}, c))),
        demoVideo(ex),
        ex.impact ? h('p.tiny', { style: 'color:var(--red)' }, 'Stop for any leaking, heaviness, pain, or coning.') : null,
      ]);
    }),
  ]);
  sheet(content);
}

function openReadiness(go) {
  const answers = {};
  READINESS_TESTS.forEach((t) => (answers[t.id] = null));
  const groups = [...new Set(READINESS_TESTS.map((t) => t.group))];

  const body = h('div', {}, [
    h('h2', {}, 'Run-readiness check'),
    h('div.callout', {}, [ h('p', {}, READINESS_RULE) ]),
  ]);

  groups.forEach((g) => {
    body.appendChild(h('h3', { style: 'margin-top:14px' }, g));
    READINESS_TESTS.filter((t) => t.group === g).forEach((t) => {
      const row = h('div.card', { style: 'padding:12px' }, [
        h('div.ttl', { style: 'margin-bottom:8px' }, t.label),
        h('div.seg', {}, [
          segBtn('Ready', () => set(t.id, 'ready')),
          segBtn('Needs work', () => set(t.id, 'needswork')),
        ]),
      ]);
      const seg = row.querySelector('.seg');
      function set(id, val) { answers[id] = val; [...seg.children].forEach((c) => c.classList.remove('on')); seg.children[val === 'ready' ? 0 : 1].classList.add('on'); }
      body.appendChild(row);
    });
  });

  body.appendChild(h('button.btn', { style: 'margin-top:8px', onclick: () => {
    store.write('readiness', { items: answers, takenAt: new Date().toISOString() });
    s.close();
    toast('Readiness saved');
    go('train');
  } }, 'Save check'));

  const s = sheet(body);
  function segBtn(lbl, fn) { return h('button', { type: 'button', onclick: fn }, lbl); }
}
