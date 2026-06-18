// meals.js — seed meals built on cheap staples. Melissa can edit any of these
// or add her own (same shape) on the Eat tab.
//
// Meal shape:
//  { id, name, slot, servings, kcal, protein, ingredients:[{item,qty,staple}],
//    steps:[], tags:[], cost:'$'|'$$', note, seed:true }
//  slot:  breakfast | lunch | dinner | snack
//  tags:  one-handed | batch | no-cook | freezer | quick
//  kcal/protein are per serving, rough estimates to guide — not lab values.

export const SEED_MEALS = [
  {
    id: 'seed-oats', name: 'Peanut-butter overnight oats', slot: 'breakfast',
    servings: 1, kcal: 480, protein: 20, cost: '$', tags: ['one-handed', 'batch', 'no-cook'],
    ingredients: [
      { item: 'Rolled oats', qty: '1/2 cup', staple: true },
      { item: 'Milk (or fortified soy)', qty: '3/4 cup', staple: true },
      { item: 'Peanut butter', qty: '1 tbsp', staple: true },
      { item: 'Chia seeds', qty: '1 tsp', staple: true },
      { item: 'Frozen berries', qty: '1/3 cup', staple: false },
    ],
    steps: ['Combine everything in a jar.', 'Stir, lid on, refrigerate overnight.', 'Eat cold — make 3–4 jars at once for the week.'],
    note: 'The batch-prep breakfast. Grab-and-eat with one hand.',
  },
  {
    id: 'seed-eggs', name: 'Veggie scramble + toast', slot: 'breakfast',
    servings: 1, kcal: 420, protein: 24, cost: '$', tags: ['quick'],
    ingredients: [
      { item: 'Eggs', qty: '2–3', staple: true },
      { item: 'Frozen mixed veg', qty: '1/2 cup', staple: true },
      { item: 'Whole-wheat bread', qty: '1–2 slices', staple: true },
      { item: 'Olive oil or butter', qty: '1 tsp', staple: true },
    ],
    steps: ['Sauté frozen veg 2 min.', 'Add beaten eggs, scramble.', 'Toast bread; serve.'],
  },
  {
    id: 'seed-yogurt', name: 'Greek yogurt + fruit + granola', slot: 'breakfast',
    servings: 1, kcal: 350, protein: 20, cost: '$', tags: ['one-handed', 'no-cook', 'quick'],
    ingredients: [
      { item: 'Greek yogurt', qty: '3/4 cup', staple: true },
      { item: 'Banana or seasonal fruit', qty: '1', staple: false },
      { item: 'Granola or oats', qty: '2 tbsp', staple: true },
    ],
    steps: ['Layer in a bowl or jar.', 'Eat.'],
  },
  {
    id: 'seed-salmonbowl', name: 'Salmon rice bowl', slot: 'lunch',
    servings: 1, kcal: 520, protein: 30, cost: '$', tags: ['quick', 'one-handed'],
    ingredients: [
      { item: 'Canned salmon (or tuna)', qty: '1 can', staple: true },
      { item: 'Microwave brown rice', qty: '1 cup', staple: true },
      { item: 'Frozen mixed veg', qty: '1 cup', staple: true },
      { item: 'Olive oil', qty: '1 tsp', staple: true },
      { item: 'Hot sauce / soy sauce', qty: 'to taste', staple: true },
    ],
    steps: ['Microwave rice + frozen veg.', 'Top with drained salmon and oil.', 'Season; eat warm.'],
    note: 'Salmon/sardines = cheap protein + iron + omega-3 + calcium (with bones).',
  },
  {
    id: 'seed-burrito', name: 'Bean & cheese burrito', slot: 'lunch',
    servings: 1, kcal: 470, protein: 19, cost: '$', tags: ['one-handed', 'quick', 'freezer'],
    ingredients: [
      { item: 'Whole-wheat tortilla', qty: '1 large', staple: true },
      { item: 'Canned/refried beans', qty: '1/2 cup', staple: true },
      { item: 'Shredded cheese', qty: '2 tbsp', staple: true },
      { item: 'Salsa', qty: '2 tbsp', staple: true },
    ],
    steps: ['Warm beans, spread on tortilla.', 'Add cheese + salsa, roll.', 'Wrap and freeze extras — microwave to reheat.'],
    note: 'Make a batch and freeze — perfect one-handed lunch.',
  },
  {
    id: 'seed-saladeggs', name: 'Big salad + boiled eggs + bread', slot: 'lunch',
    servings: 1, kcal: 430, protein: 22, cost: '$', tags: ['no-cook', 'quick'],
    ingredients: [
      { item: 'Hard-boiled eggs', qty: '2', staple: true },
      { item: 'Mixed greens / bagged salad', qty: '2 cups', staple: false },
      { item: 'Olive oil + vinegar', qty: '1 tbsp', staple: true },
      { item: 'Whole-grain bread', qty: '1 slice', staple: true },
    ],
    steps: ['Toss greens with oil + vinegar.', 'Top with sliced boiled eggs.', 'Serve with bread.'],
  },
  {
    id: 'seed-chili', name: 'Lentil / bean chili', slot: 'dinner',
    servings: 5, kcal: 410, protein: 22, cost: '$', tags: ['batch', 'freezer'],
    ingredients: [
      { item: 'Dried or canned lentils/beans', qty: '2 cups dry / 3 cans', staple: true },
      { item: 'Canned tomatoes', qty: '2 cans', staple: true },
      { item: 'Onion', qty: '1', staple: true },
      { item: 'Chili spices (cumin, chili powder)', qty: '2 tbsp', staple: true },
      { item: 'Rice, to serve', qty: '1 cup cooked', staple: true },
      { item: 'Cheese, to top', qty: '2 tbsp', staple: true },
    ],
    steps: ['Sauté onion.', 'Add lentils/beans, tomatoes, spices, water.', 'Simmer 30–40 min (or slow-cooker all day).', 'Serve over rice; freezes well.'],
    note: 'One big pot = ~5 meals. The backbone of a low-budget week.',
  },
  {
    id: 'seed-sheetpan', name: 'Sheet-pan chicken + veg + potatoes', slot: 'dinner',
    servings: 4, kcal: 520, protein: 34, cost: '$$', tags: ['batch'],
    ingredients: [
      { item: 'Chicken thighs', qty: '6–8', staple: false },
      { item: 'Potatoes', qty: '4', staple: true },
      { item: 'Frozen or fresh veg', qty: '4 cups', staple: true },
      { item: 'Olive oil + seasoning', qty: '2 tbsp', staple: true },
    ],
    steps: ['Chop potatoes + veg, toss with oil.', 'Add chicken, season.', 'Roast 425°F ~30–35 min.', 'Leftovers reheat well.'],
  },
  {
    id: 'seed-pasta', name: 'Pasta + sauce + lentils/meatballs', slot: 'dinner',
    servings: 4, kcal: 540, protein: 24, cost: '$', tags: ['quick', 'batch'],
    ingredients: [
      { item: 'Whole-wheat pasta', qty: '12 oz', staple: true },
      { item: 'Jarred tomato sauce', qty: '1 jar', staple: true },
      { item: 'Cooked lentils or frozen meatballs', qty: '2 cups', staple: true },
      { item: 'Side veg (frozen broccoli)', qty: '3 cups', staple: true },
    ],
    steps: ['Boil pasta; steam broccoli.', 'Warm sauce with lentils/meatballs.', 'Combine; top with cheese if you like.'],
  },
  // ---- Snacks ----
  { id: 'seed-pbtoast', name: 'Peanut-butter toast + fruit', slot: 'snack', servings: 1, kcal: 260, protein: 9, cost: '$', tags: ['one-handed', 'quick'],
    ingredients: [ { item: 'Whole-grain bread', qty: '1 slice', staple: true }, { item: 'Peanut butter', qty: '1 tbsp', staple: true }, { item: 'Apple or banana', qty: '1', staple: false } ],
    steps: ['Toast, spread PB.', 'Eat with fruit.'] },
  { id: 'seed-cottage', name: 'Cottage cheese + fruit', slot: 'snack', servings: 1, kcal: 180, protein: 20, cost: '$', tags: ['one-handed', 'no-cook', 'quick'],
    ingredients: [ { item: 'Cottage cheese', qty: '3/4 cup', staple: true }, { item: 'Seasonal fruit', qty: '1/2 cup', staple: false } ],
    steps: ['Combine and eat — great slow protein before bed.'] },
  { id: 'seed-eggs2', name: 'Hard-boiled eggs', slot: 'snack', servings: 1, kcal: 140, protein: 12, cost: '$', tags: ['one-handed', 'no-cook', 'batch'],
    ingredients: [ { item: 'Eggs', qty: '2', staple: true } ],
    steps: ['Boil a dozen at the start of the week.', 'Grab 2 anytime.'] },
  { id: 'seed-trail', name: 'Trail mix / nuts', slot: 'snack', servings: 1, kcal: 200, protein: 6, cost: '$', tags: ['one-handed', 'no-cook'],
    ingredients: [ { item: 'Mixed nuts', qty: '1/4 cup', staple: true }, { item: 'Raisins/dried fruit', qty: '2 tbsp', staple: true } ],
    steps: ['Portion into small bags for one-handed snacking.'] },
];

// Default pantry staples we assume are usually on hand (used to split the
// shopping list into "likely have" vs "get from the store"). Editable later.
export const DEFAULT_STAPLES = [
  'rolled oats', 'milk', 'peanut butter', 'chia seeds', 'eggs', 'whole-wheat bread',
  'olive oil', 'butter', 'greek yogurt', 'granola', 'canned salmon', 'canned tuna',
  'microwave brown rice', 'rice', 'frozen mixed veg', 'frozen broccoli', 'hot sauce',
  'soy sauce', 'whole-wheat tortilla', 'canned beans', 'refried beans', 'shredded cheese',
  'salsa', 'canned tomatoes', 'onion', 'chili spices', 'whole-wheat pasta',
  'jarred tomato sauce', 'lentils', 'cottage cheese', 'mixed nuts', 'raisins', 'potatoes',
];

export const SLOTS = ['breakfast', 'lunch', 'dinner', 'snack'];
export const SLOT_LABEL = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack' };
