// education.js — warning signs, nutrition guidance, and sources shown in-app.
// Educational only; not medical advice.

export const WARNING_SIGNS = [
  { id: 'leak', label: 'Leaking urine with running, jumping, coughing', action: 'Ease off impact and consider a pelvic-floor PT.' },
  { id: 'heavy', label: 'Heaviness, dragging, or a bulge "down there"', action: 'Stop impact for now; this is worth a PT/provider check.' },
  { id: 'cone', label: 'Midline doming or "coning" when you exert', action: 'Regress to breath + deep-core work; avoid crunches/planks.' },
  { id: 'bleed', label: 'Bright-red bleeding returns after activity', action: 'A sign you did too much — back off and rest.' },
  { id: 'scar', label: 'Incision pain, pulling, opening, or spreading numbness', action: 'Pause loading and check with your provider.' },
  { id: 'pain', label: 'Pelvic, low-back, or pubic pain with running', action: 'Stop that stimulus; reduce volume.' },
  { id: 'rhr', label: 'Resting heart rate up 7+ bpm for several days', action: 'Under-recovered or getting sick — take easy days.' },
];

export const NUTRITION_NOTES = [
  { t: 'Eat enough', d: 'Breastfeeding burns roughly 500+ kcal/day. Fuel your runs — don’t run a deficit and a big-mileage day at once.' },
  { t: 'Protein', d: 'Aim ~100–130 g/day. It speeds recovery and keeps you full. Eggs, canned fish, beans, yogurt, cottage cheese.' },
  { t: 'Don’t crash diet', d: 'A gentle ~1 lb/week is the target. Faster isn’t better while nursing — and the scale is noisy postpartum anyway.' },
  { t: 'Skip keto while nursing', d: 'Very-low-carb during breastfeeding carries a rare but real ketoacidosis risk. Keep carbs in.' },
  { t: 'Hydrate', d: 'Aim ~16 cups of fluid a day; a glass of water each time you nurse is an easy rule.' },
  { t: 'Caffeine & alcohol', d: 'Caffeine ≤ ~300 mg/day (2–3 coffees). If you drink, ~1 drink and wait ~2 hrs before nursing.' },
];

export const SOURCES = [
  ['Goom/Donnelly — Returning to Running Postnatal guideline', 'https://absolute.physio/wp-content/uploads/2019/09/returning-to-running-postnatal-guidelines.pdf'],
  ['ACOG — Exercise After Pregnancy', 'https://www.acog.org/womens-health/faqs/exercise-after-pregnancy'],
  ['Academy of Nutrition & Dietetics — Losing Weight While Breastfeeding', 'https://www.eatright.org/health/pregnancy/breastfeeding-and-formula/losing-weight-while-breastfeeding'],
  ['CDC — Maternal Diet & Breastfeeding', 'https://www.cdc.gov/breastfeeding-special-circumstances/hcp/diet-micronutrients/maternal-diet.html'],
  ['La Leche League — Weight Loss While Breastfeeding', 'https://llli.org/breastfeeding-info/weight-loss-mothers/'],
];

export const DISCLAIMER =
  'This app is educational and supportive — not medical advice. Melissa’s OB/midwife and a pelvic-floor physical therapist are the right people to clear her for running and screen her in person. If anything hurts or feels off, stop and ask them.';
