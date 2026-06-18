// eat.js — customizable nutrition: targets, her meal library (ingredients +
// prep), weekly plan from her meals, and a have-vs-buy shopping list.
import { h, clear, isoWeek, uid } from '../util.js';
import {
  targets, allMeals, saveMeal, deleteMeal, mealById, mealFit,
  getPlan, setPlanCell, autoFillPlan, shoppingList, DAY_LABELS,
} from '../engine/nutrition-engine.js';
import { SLOTS, SLOT_LABEL } from '../data/meals.js';
import { NUTRITION_NOTES } from '../data/education.js';
import { pageHeader, sheet, toast } from '../ui.js';

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export function renderEat(root, _arg, go) {
  let tab = 'plan';
  const frag = h('div', {}, [ pageHeader('Eat', { sub: 'Built around the meals you already make' }) ]);

  const t = targets();
  frag.appendChild(h('div.stats', {}, [
    statTile(`${t.kcal}`, 'kcal/day'),
    statTile(`${t.protein}g`, 'protein'),
    statTile(`${t.fluidCups}`, 'cups fluid'),
  ]));
  if (t.nudge === 'fast-loss') frag.appendChild(h('div.callout.warn', {}, [ h('p', {}, 'Your weight is dropping fast — target bumped up. Fuel your runs and keep the loss gentle.') ]));
  else frag.appendChild(h('p.tiny.muted', { style: 'margin-top:-4px' }, `Gentle defaults for a nursing, active mom. Floor ~${t.floor} kcal — these guide, they don’t restrict.`));

  const seg = h('div.seg', { style: 'margin:8px 0 14px' }, [
    segBtn('Week plan', 'plan'), segBtn('My meals', 'meals'), segBtn('Shopping', 'shop'), segBtn('Guide', 'guide'),
  ]);
  const panel = h('div');
  frag.appendChild(seg);
  frag.appendChild(panel);
  root.appendChild(frag);

  function segBtn(lbl, key) { return h('button', { type: 'button', class: key === tab ? 'on' : '', onclick: () => { tab = key; [...seg.children].forEach((c, i) => c.classList.toggle('on', ['plan', 'meals', 'shop', 'guide'][i] === key)); paint(); } }, lbl); }

  function paint() {
    clear(panel);
    if (tab === 'plan') panel.appendChild(planPanel());
    else if (tab === 'meals') panel.appendChild(mealsPanel(paint));
    else if (tab === 'shop') panel.appendChild(shopPanel());
    else panel.appendChild(guidePanel());
  }
  paint();
}

function statTile(v, k) { return h('div.stat', {}, [ h('div.v', {}, v), h('div.k', {}, k) ]); }

// ---------- WEEK PLAN ----------
function planPanel() {
  const wk = isoWeek();
  const plan = getPlan(wk);
  const wrap = h('div', {}, [
    h('div.row.between', {}, [ h('h3', {}, 'This week'), h('button.btn.small.secondary', { onclick: () => { autoFillPlan(wk); toast('Filled from your meals'); rerender(); } }, 'Auto-fill') ]),
  ]);
  if (!plan) wrap.appendChild(h('p.tiny.muted', {}, 'Tap a slot to pick one of your meals, or auto-fill to rotate them across the week.'));

  DAYS.forEach((day) => {
    const dayPlan = (plan && plan[day]) || {};
    const card = h('div.card', { style: 'padding:12px' }, [ h('div.ttl', { style: 'margin-bottom:6px' }, DAY_LABELS[day]) ]);
    SLOTS.forEach((slot) => {
      const mealId = dayPlan[slot];
      const m = mealId ? mealById(mealId) : null;
      card.appendChild(h('div.row.between', { style: 'padding:5px 0', onclick: () => pickMeal(wk, day, slot) }, [
        h('div', {}, [ h('div.tiny.muted', {}, SLOT_LABEL[slot]), h('div', { style: m ? '' : 'color:var(--ink-soft)' }, m ? m.name : '+ add') ]),
        m ? h('span.tiny.muted', {}, `${m.protein}g`) : null,
      ]));
    });
    wrap.appendChild(card);
  });
  return wrap;
}

function pickMeal(wk, day, slot) {
  const opts = allMeals().filter((m) => m.slot === slot);
  const body = h('div', {}, [ h('h3', {}, `${SLOT_LABEL[slot]} — ${DAY_LABELS[day]}`) ]);
  body.appendChild(h('ul.list', {}, opts.map((m) => h('li', { onclick: () => { setPlanCell(wk, day, slot, m.id); s.close(); rerender(); } }, [
    h('div.grow', {}, [ h('div.ttl', {}, m.name), h('div.sub', {}, `${m.kcal} kcal · ${m.protein}g protein`) ]), h('span.tiny.muted', {}, m.tags && m.tags[0] || '') ]))));
  if (!opts.length) body.appendChild(h('p', {}, 'No meals in this slot yet — add one in “My meals”.'));
  const s = sheet(body);
}

// ---------- MEAL LIBRARY ----------
function mealsPanel(refresh) {
  const wrap = h('div', {}, [
    h('div.row.between', {}, [ h('h3', {}, 'My meals'), h('button.btn.small', { onclick: () => editMeal(null, refresh) }, '+ Add meal') ]),
    h('p.tiny.muted', {}, 'Add what you already cook — ingredients and steps. The app shows how each fits your targets and suggests easy additions.'),
  ]);
  SLOTS.forEach((slot) => {
    const meals = allMeals().filter((m) => m.slot === slot);
    if (!meals.length) return;
    wrap.appendChild(h('h3', { style: 'margin:14px 0 6px;font-size:.8rem;text-transform:uppercase;letter-spacing:.05em;color:var(--brand)' }, SLOT_LABEL[slot]));
    meals.forEach((m) => wrap.appendChild(h('div.card', { style: 'padding:12px', onclick: () => viewMeal(m, refresh) }, [
      h('div.row.between', {}, [ h('div.ttl', {}, m.name), h('span.tiny.muted', {}, `${m.kcal} kcal · ${m.protein}g`) ]),
      h('div.tiny.muted', {}, (m.tags || []).join(' · ') || (m.seed ? 'suggested' : 'your meal')),
    ])));
  });
  return wrap;
}

function viewMeal(m, refresh) {
  const fit = mealFit(m);
  const body = h('div', {}, [
    h('div.row.between', {}, [ h('h2', {}, m.name), h('span.badge.brand', {}, SLOT_LABEL[m.slot]) ]),
    h('div.stats', {}, [ statTile(`${m.kcal}`, 'kcal'), statTile(`${m.protein}g`, 'protein'), statTile(m.cost || '$', 'cost') ]),
    fit.tips.length ? h('div.callout', { style: 'margin-top:12px' }, [ h('h3', {}, 'Make it fit better'), ...fit.tips.map((tp) => h('p', {}, tp)) ]) : h('div.callout', { style: 'margin-top:12px' }, [ h('p', {}, '✓ Solid fit for your targets.') ]),
    h('h3', { style: 'margin-top:14px' }, 'Ingredients'),
    h('ul', { style: 'padding-left:18px;color:var(--ink-soft)' }, (m.ingredients || []).map((i) => h('li', {}, `${i.qty ? i.qty + ' — ' : ''}${i.item}${i.staple ? '' : '  (buy)'}`))),
    h('h3', { style: 'margin-top:8px' }, 'Steps'),
    h('ol', { style: 'padding-left:18px;color:var(--ink-soft)' }, (m.steps || []).map((st) => h('li', {}, st))),
    m.note ? h('p.tiny.muted', {}, m.note) : null,
    h('div.btn-row', { style: 'margin-top:12px' }, [
      h('button.btn.secondary', { onclick: () => { s.close(); editMeal(m, refresh); } }, 'Edit'),
      h('button.btn.danger', { onclick: () => { if (confirm('Delete this meal?')) { deleteMeal(m.id); s.close(); refresh(); } } }, 'Delete'),
    ]),
  ]);
  const s = sheet(body);
}

function editMeal(existing, refresh) {
  const m = existing ? JSON.parse(JSON.stringify(existing)) : { id: uid(), name: '', slot: 'dinner', kcal: 400, protein: 20, servings: 1, cost: '$', ingredients: [{ item: '', qty: '', staple: false }], steps: [''], tags: [], note: '' };

  const ingWrap = h('div');
  function paintIngs() {
    clear(ingWrap);
    m.ingredients.forEach((ing, i) => {
      ingWrap.appendChild(h('div.row', { style: 'gap:6px;margin-bottom:6px' }, [
        h('input', { placeholder: 'qty', value: ing.qty, style: 'flex:0 0 70px', oninput: (e) => ing.qty = e.target.value }),
        h('input', { placeholder: 'ingredient', value: ing.item, oninput: (e) => ing.item = e.target.value }),
        h('button.chip', { type: 'button', class: ing.staple ? 'on' : '', title: 'I usually have this', onclick: (e) => { ing.staple = !ing.staple; e.target.classList.toggle('on'); } }, 'have'),
        h('button.link-btn', { onclick: () => { m.ingredients.splice(i, 1); paintIngs(); } }, '✕'),
      ]));
    });
    ingWrap.appendChild(h('button.link-btn', { onclick: () => { m.ingredients.push({ item: '', qty: '', staple: false }); paintIngs(); } }, '+ ingredient'));
  }
  paintIngs();

  const stepWrap = h('div');
  function paintSteps() {
    clear(stepWrap);
    m.steps.forEach((st, i) => stepWrap.appendChild(h('div.row', { style: 'gap:6px;margin-bottom:6px' }, [
      h('span.tiny.muted', { style: 'flex:0 0 16px;padding-top:12px' }, String(i + 1)),
      h('input', { placeholder: 'step', value: st, oninput: (e) => m.steps[i] = e.target.value }),
      h('button.link-btn', { onclick: () => { m.steps.splice(i, 1); paintSteps(); } }, '✕'),
    ])));
    stepWrap.appendChild(h('button.link-btn', { onclick: () => { m.steps.push(''); paintSteps(); } }, '+ step'));
  }
  paintSteps();

  const body = h('div', {}, [
    h('h2', {}, existing ? 'Edit meal' : 'Add a meal'),
    field('Name', h('input', { value: m.name, placeholder: 'e.g. Mom’s lentil soup', oninput: (e) => m.name = e.target.value })),
    field('Meal', slotSelect(m)),
    h('div.row', { style: 'gap:8px' }, [
      field('Calories', h('input', { type: 'number', inputmode: 'numeric', value: m.kcal, oninput: (e) => m.kcal = Number(e.target.value) })),
      field('Protein (g)', h('input', { type: 'number', inputmode: 'numeric', value: m.protein, oninput: (e) => m.protein = Number(e.target.value) })),
    ]),
    h('p.tiny.muted', { style: 'margin-top:-6px' }, 'Rough estimates are fine — they just guide the targets.'),
    h('h3', { style: 'margin-top:8px' }, 'Ingredients'), ingWrap,
    h('h3', { style: 'margin-top:14px' }, 'Steps'), stepWrap,
    field('Note (optional)', h('textarea', { value: m.note, placeholder: 'batch tip, one-handed, etc.', oninput: (e) => m.note = e.target.value }), 'mt'),
    h('button.btn', { style: 'margin-top:8px', onclick: () => {
      if (!m.name.trim()) { toast('Give it a name'); return; }
      m.ingredients = m.ingredients.filter((i) => i.item.trim());
      m.steps = m.steps.filter((s) => s.trim());
      m.seed = false;
      saveMeal(m); s.close(); toast('Saved'); refresh();
    } }, 'Save meal'),
  ]);
  const s = sheet(body);
}

function slotSelect(m) {
  const sel = h('select', { onchange: (e) => m.slot = e.target.value });
  SLOTS.forEach((s) => { const o = h('option', { value: s }, SLOT_LABEL[s]); if (m.slot === s) o.selected = true; sel.appendChild(o); });
  return sel;
}
function field(label, control, cls) { return h('label.field', {}, [ h('span', {}, label), control ]); }

// ---------- SHOPPING ----------
function shopPanel() {
  const wk = isoWeek();
  const { have, buy } = shoppingList(wk);
  if (!have.length && !buy.length) {
    return h('div', {}, [ h('div.card', {}, [ h('p', {}, 'Plan some meals for the week first — then your shopping list builds itself.') ]) ]);
  }
  return h('div', {}, [
    h('div.card', {}, [
      h('h3', {}, `🛒 Get from the store (${buy.length})`),
      buy.length ? h('ul.list', {}, buy.map((i) => h('li', {}, [ h('span.lead', {}, '○'), h('div.grow', {}, i) ]))) : h('p.tiny.muted', {}, 'Nothing extra — you likely have it all!'),
    ]),
    h('div.card', {}, [
      h('h3', {}, `✓ Likely in your pantry (${have.length})`),
      h('ul.list', {}, have.map((i) => h('li', {}, [ h('span.lead', { style: 'color:var(--green)' }, '✓'), h('div.grow.muted', {}, i) ]))),
    ]),
    h('p.tiny.muted', {}, 'Tip: mark ingredients as “have” when adding a meal to keep this list tight.'),
  ]);
}

// ---------- GUIDE ----------
function guidePanel() {
  return h('div', {}, NUTRITION_NOTES.map((n) => h('div.card', { style: 'padding:14px' }, [ h('h3', {}, n.t), h('p', { style: 'margin:0' }, n.d) ])));
}

function rerender() { window.__go('eat'); }
