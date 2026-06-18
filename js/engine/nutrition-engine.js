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

// Auto-fill a week by rotating her meals across days (snacks get 1 slot).
export function autoFillPlan(weekKey) {
  const meals = allMeals();
  const bySlot = {};
  SLOTS.forEach((s) => { bySlot[s] = meals.filter((m) => m.slot === s); });
  const plans = store.read('mealPlan');
  plans[weekKey] = {};
  DAYS.forEach((day, di) => {
    plans[weekKey][day] = {};
    ['breakfast', 'lunch', 'dinner', 'snack'].forEach((slot) => {
      const opts = bySlot[slot];
      if (opts && opts.length) plans[weekKey][day][slot] = opts[di % opts.length].id;
    });
  });
  store.write('mealPlan', plans);
  return plans[weekKey];
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
