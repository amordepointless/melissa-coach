// nutrition-engine.js — targets, per-meal fit, weekly plan, and shopping list.
import { store } from '../store.js';
import { profile } from '../state.js';
import { SEED_MEALS, DEFAULT_STAPLES, SLOTS } from '../data/meals.js';
import { weightTrendPerWeek } from './signals.js';

// ---- Targets ----
// Gentle defaults for a breastfeeding, active mom. Not a prescription.
export function targets() {
  const p = profile();
  const breastfeeding = p.feeding && p.feeding !== 'none' && p.feeding !== 'weaning';
  // Base maintenance estimate (rough) + lactation + activity buffer.
  let kcal = 2100;
  if (breastfeeding) kcal += 200;            // lactation buffer (gentle)
  const sessions = Number(p.sessionsPerWeek || 3);
  if (sessions >= 4) kcal += 100;
  const floor = breastfeeding ? 1800 : 1500;

  // If losing too fast, nudge the target up.
  const trend = weightTrendPerWeek();
  let nudge = null;
  if (trend != null && trend < -1) { kcal += 200; nudge = 'fast-loss'; }

  return {
    kcal: Math.max(floor, Math.round(kcal / 10) * 10),
    protein: 120,             // g/day target
    fluidCups: 16,
    floor,
    breastfeeding,
    nudge,
  };
}

// ---- Meals storage (seed on first use, then user-owned) ----
export function allMeals() {
  let meals = store.read('meals');
  if (!meals || meals.length === 0) {
    meals = SEED_MEALS.map((m) => ({ ...m, seed: true }));
    store.write('meals', meals);
  }
  return meals;
}
export function saveMeal(meal) {
  const meals = allMeals();
  const i = meals.findIndex((m) => m.id === meal.id);
  if (i >= 0) meals[i] = meal; else meals.push(meal);
  store.write('meals', meals);
  return meal;
}
export function deleteMeal(id) {
  store.write('meals', allMeals().filter((m) => m.id !== id));
}
export function mealById(id) { return allMeals().find((m) => m.id === id) || null; }

// ---- Per-meal fit vs targets ----
export function mealFit(meal) {
  const t = targets();
  const perMealKcal = t.kcal / 4;       // rough share if 4 eating occasions
  const proteinShare = t.protein / 4;
  const tips = [];
  if ((meal.protein || 0) < proteinShare * 0.8) {
    tips.push('Lower in protein — add eggs, beans, yogurt, or canned fish for +10–15 g.');
  }
  if ((meal.kcal || 0) < perMealKcal * 0.6 && meal.slot !== 'snack') {
    tips.push('On the light side — pair with a carb (rice/bread/fruit) to fuel your runs.');
  }
  if (!meal.ingredients || meal.ingredients.some((i) => /fruit|veg|berr|green|broccoli|salad/i.test(i.item)) === false) {
    tips.push('Add a fruit or vegetable for fiber + micronutrients.');
  }
  return { tips, proteinShare: Math.round(proteinShare) };
}

// ---- Weekly plan ----
const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
export const DAY_LABELS = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' };

// The plan uses 5 eating occasions (two snacks) to fuel a nursing, active mom.
export const PLAN_SLOTS = ['breakfast', 'lunch', 'dinner', 'snack', 'snack2'];
export const PLAN_SLOT_LABEL = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack', snack2: 'Second snack' };
export const planMealType = (slot) => (slot === 'snack2' ? 'snack' : slot); // which meal category fills a plan slot

export function getPlan(weekKey) {
  const plans = store.read('mealPlan');
  return plans[weekKey] || null;
}
export function setPlanCell(weekKey, day, slot, mealId) {
  const plans = store.read('mealPlan');
  if (!plans[weekKey]) plans[weekKey] = {};
  if (!plans[weekKey][day]) plans[weekKey][day] = {};
  plans[weekKey][day][slot] = mealId;
  store.write('mealPlan', plans);
}
export function clearPlanCell(weekKey, day, slot) {
  const plans = store.read('mealPlan');
  if (plans[weekKey] && plans[weekKey][day]) { delete plans[weekKey][day][slot]; store.write('mealPlan', plans); }
}

// ---- Meal preferences (one-time, editable) ----
export function getMealPrefs() {
  const p = store.read('mealPrefs') || {};
  return { set: false, snacks: 2, prep: 'mix', variety: 'rotate', prepDay: 'Sun', times: {}, ...p };
}
export function setMealPrefs(prefs) {
  store.write('mealPrefs', { ...getMealPrefs(), ...prefs, set: true });
}

// Which eating occasions the plan uses, per her snack preference.
export function activeSlots(prefs = getMealPrefs()) {
  return prefs.snacks >= 2 ? PLAN_SLOTS : PLAN_SLOTS.filter((s) => s !== 'snack2');
}

// Candidate meals for a slot, biased by her prep style.
function poolFor(slot, meals, prefs) {
  const type = planMealType(slot);
  let pool = meals.filter((m) => m.slot === type);
  if (prefs.prep === 'batch') {
    const pref = pool.filter((m) => (m.tags || []).some((t) => t === 'batch' || t === 'freezer'));
    if (pref.length) pool = pref;
  } else if (prefs.prep === 'quick') {
    const pref = pool.filter((m) => (m.tags || []).some((t) => t === 'quick' || t === 'no-cook' || t === 'one-handed'));
    if (pref.length) pool = pref;
  }
  return pool;
}

// Build a recommended week — a real plan that tells her what to eat, shaped by
// her preferences (snacks, prep style, variety), leaning on cheap staples.
export function autoFillPlan(weekKey) {
  const meals = allMeals();
  const prefs = getMealPrefs();
  const slots = activeSlots(prefs);
  const plans = store.read('mealPlan');
  plans[weekKey] = {};
  DAYS.forEach((day, di) => {
    plans[weekKey][day] = {};
    slots.forEach((slot, si) => {
      const pool = poolFor(slot, meals, prefs);
      if (!pool.length) return;
      const idx = prefs.variety === 'simple' ? (si % pool.length) : ((di + si) % pool.length);
      plans[weekKey][day][slot] = pool[idx].id;
    });
  });
  store.write('mealPlan', plans);
  return plans[weekKey];
}

// Skip a recommendation: swap in a different meal of the same type for one slot.
export function rerollMeal(weekKey, day, slot) {
  let pool = poolFor(slot, allMeals(), getMealPrefs());
  // if her prep filter leaves only one option, widen to all meals of this type
  if (pool.length <= 1) pool = allMeals().filter((m) => m.slot === planMealType(slot));
  if (!pool.length) return null;
  const plan = getPlan(weekKey) || {};
  const cur = plan[day] && plan[day][slot];
  const curIdx = pool.findIndex((m) => m.id === cur);
  let pick = pool[(curIdx + 1) % pool.length];
  if (pool.length > 1 && pick.id === cur) pick = pool[(curIdx + 2) % pool.length];
  setPlanCell(weekKey, day, slot, pick.id);
  return pick;
}

// Return the existing plan, or generate one the first time so the app always
// has something to recommend (it tells her what to eat, she can swap).
export function ensurePlan(weekKey) {
  const existing = getPlan(weekKey);
  if (existing && Object.keys(existing).length) return existing;
  return autoFillPlan(weekKey);
}

// Daily totals for a planned day, for showing the plan hits her targets.
export function dayTotals(weekKey, day) {
  const plan = getPlan(weekKey);
  let kcal = 0, protein = 0;
  if (plan && plan[day]) {
    Object.values(plan[day]).forEach((id) => { const m = mealById(id); if (m) { kcal += m.kcal || 0; protein += m.protein || 0; } });
  }
  return { kcal, protein };
}

// ---- Batch-prep schedule from a week's plan ----
// Looks at which meals repeat and suggests simple cook-ahead actions, so most
// of the week is "open and eat." Kept deliberately low-effort.
export function prepPlan(weekKey) {
  const plan = getPlan(weekKey);
  const counts = {};
  if (plan) Object.values(plan).forEach((day) => Object.values(day).forEach((id) => { counts[id] = (counts[id] || 0) + 1; }));
  const items = [];
  const seen = new Set();
  Object.entries(counts).forEach(([id, n]) => {
    const m = mealById(id);
    if (!m) return;
    const tags = m.tags || [];
    const batchy = tags.includes('batch') || tags.includes('freezer') || tags.includes('no-cook');
    if (n >= 2 && batchy) {
      let action;
      if (/oat/i.test(m.name)) action = `Make ${n} jars of ${m.name} at once (5 min).`;
      else if (/^hard-boiled eggs/i.test(m.name)) action = `Boil a dozen eggs for the week.`;
      else if (tags.includes('freezer') || tags.includes('batch')) action = `Cook one big batch of ${m.name} — covers ${n} meals; fridge or freeze portions.`;
      else action = `Prep ${m.name} ahead for ${n} servings.`;
      if (seen.has(action)) return;
      seen.add(action);
      items.push({ id, name: m.name, n, action });
    }
  });
  items.sort((a, b) => b.n - a.n);
  return items;
}

// ---- Shopping list from a week's plan ----
export function staples() {
  const p = store.read('pantry');
  return new Set((p && p.length ? p : DEFAULT_STAPLES).map((s) => s.toLowerCase()));
}
export function setPantry(list) { store.write('pantry', list); }

export function shoppingList(weekKey) {
  const plan = getPlan(weekKey);
  const have = [], buy = [];
  const seen = new Set();
  if (!plan) return { have, buy };
  const stapleSet = staples();
  Object.values(plan).forEach((day) => {
    Object.values(day).forEach((mealId) => {
      const m = mealById(mealId);
      if (!m || !m.ingredients) return;
      m.ingredients.forEach((ing) => {
        const key = ing.item.toLowerCase();
        if (seen.has(key)) return;
        seen.add(key);
        const isStaple = ing.staple || stapleSet.has(key);
        (isStaple ? have : buy).push(ing.item);
      });
    });
  });
  return { have: have.sort(), buy: buy.sort() };
}
