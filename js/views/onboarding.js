// onboarding.js — one screen per section, stores answers into profile.
// Autosaves on every change and every step, and resumes where she left off,
// so exiting mid-setup never loses anything.
import { h, clear } from '../util.js';
import { store } from '../store.js';
import { ONBOARDING } from '../data/questions.js';
import { DISCLAIMER } from '../data/education.js';
import { toast } from '../ui.js';

export function renderOnboarding(root, done) {
  const draft = { ...store.read('profile') };

  // pre-seed defaults from field.value (only where she hasn't answered)
  ONBOARDING.forEach((s) => (s.fields || []).forEach((f) => {
    if (draft[f.id] === undefined && f.value !== undefined) draft[f.id] = f.value;
  }));

  // resume at the saved step if she left mid-setup
  let step = Number.isInteger(draft._onbStep) ? Math.min(draft._onbStep, ONBOARDING.length - 1) : 0;

  // Persist partial progress (onboarding stays incomplete until Finish).
  function saveDraft() {
    store.write('profile', { ...draft, onboardingComplete: false, _onbStep: step });
  }

  function commit() {
    delete draft._onbStep;
    draft.onboardingComplete = true;
    store.write('profile', draft);
    store.patch('phase', { startedAt: new Date().toISOString() });
    done();
  }

  function paint() {
    const sec = ONBOARDING[step];
    const pct = Math.round((step / (ONBOARDING.length - 1)) * 100);
    clear(root);
    root.className = 'view full';

    const top = h('div.ob-top', {}, [
      step > 0 ? h('button.link-btn', { onclick: () => { step--; saveDraft(); paint(); } }, '‹') : h('span', { style: 'width:18px' }),
      h('div.ob-bar', {}, [ h('i', { style: `width:${Math.max(6, pct)}%` }) ]),
      h('span.ob-step', {}, `${step + 1}/${ONBOARDING.length}`),
    ]);

    const body = h('div', {}, [ h('h1', {}, sec.title) ]);
    (sec.body || []).forEach((p) => body.appendChild(h('p', {}, p)));

    if (sec.kind === 'intro') {
      body.appendChild(h('div.callout', {}, [ h('p', { html: DISCLAIMER }) ]));
    }

    (sec.fields || []).forEach((f) => body.appendChild(fieldEl(f, draft, saveDraft)));

    const isLast = step === ONBOARDING.length - 1;
    const cta = h('div.footer-cta', {}, [
      h('button.btn', { onclick: () => {
        if (!validate(sec, draft)) { toast('Just fill the highlighted field'); return; }
        if (isLast) commit(); else { step++; saveDraft(); paint(); }
      } }, isLast ? 'Finish setup ✓' : (sec.kind === 'intro' ? 'Let’s go' : 'Next')),
      step > 0 && !isLast ? h('p.tiny.muted.center', { style: 'margin-top:8px' }, 'Saved automatically — you can close and come back anytime.') : null,
    ]);

    root.appendChild(top);
    root.appendChild(body);
    root.appendChild(cta);
  }

  // Save once on entry so even an immediate exit keeps the resume point.
  saveDraft();
  paint();
}

function validate(sec, draft) {
  for (const f of (sec.fields || [])) {
    if (f.optional) continue;
    const v = draft[f.id];
    if (v === undefined || v === '' || (Array.isArray(v) && v.length === 0)) return false;
  }
  return true;
}

function fieldEl(f, draft, onChange) {
  const save = () => { if (onChange) onChange(); };
  const wrap = h('label.field');
  if (f.label) wrap.appendChild(h('span', {}, f.label));

  if (f.type === 'segmented' || f.type === 'select') {
    if (f.type === 'segmented' && f.options.length <= 3) {
      const seg = h('div.seg');
      f.options.forEach(([val, lbl]) => {
        const b = h('button', { type: 'button', onclick: () => { draft[f.id] = val; [...seg.children].forEach((c) => c.classList.remove('on')); b.classList.add('on'); save(); } }, lbl);
        if (draft[f.id] === val) b.classList.add('on');
        seg.appendChild(b);
      });
      wrap.appendChild(seg);
    } else {
      const sel = h('select', { onchange: (e) => { draft[f.id] = e.target.value; save(); } });
      f.options.forEach(([val, lbl]) => {
        const o = h('option', { value: val }, lbl);
        if (draft[f.id] === val) o.selected = true;
        sel.appendChild(o);
      });
      if (draft[f.id] === undefined) draft[f.id] = f.options[0][0];
      wrap.appendChild(sel);
    }
  } else if (f.type === 'multi') {
    if (!Array.isArray(draft[f.id])) draft[f.id] = f.value ? [...f.value] : [];
    const chips = h('div.chips');
    f.options.forEach(([val, lbl]) => {
      const on = draft[f.id].includes(val);
      const c = h('button.chip', { type: 'button' }, lbl);
      if (on) c.classList.add('on');
      c.addEventListener('click', () => {
        if (val === 'none') { draft[f.id] = ['none']; }
        else { draft[f.id] = draft[f.id].filter((x) => x !== 'none'); }
        const j = draft[f.id].indexOf(val);
        if (j >= 0) draft[f.id].splice(j, 1); else draft[f.id].push(val);
        [...chips.children].forEach((ch, k) => ch.classList.toggle('on', draft[f.id].includes(f.options[k][0])));
        save();
      });
      chips.appendChild(c);
    });
    wrap.appendChild(chips);
  } else if (f.type === 'longtext') {
    wrap.appendChild(h('textarea', { placeholder: f.placeholder || '', value: draft[f.id] || '', oninput: (e) => { draft[f.id] = e.target.value; save(); } }));
  } else {
    const type = f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text';
    wrap.appendChild(h('input', { type, placeholder: f.placeholder || '', value: draft[f.id] != null ? draft[f.id] : '', inputmode: f.type === 'number' ? 'decimal' : null, oninput: (e) => { draft[f.id] = f.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value; save(); } }));
  }
  if (f.hint) wrap.appendChild(h('div.hint', {}, f.hint));
  return wrap;
}
