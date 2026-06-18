// questions.js — onboarding question set, grouped into one screen per section.
// Field types: text | longtext | number | date | select | multi | segmented
// Each field stores into profile[<id>]. `optional` fields never block "Next".

export const ONBOARDING = [
  {
    key: 'welcome', title: 'Welcome, Melissa', kind: 'intro',
    body: [
      'This is your private coach — everything stays on your phone.',
      'We’ll confirm a few things to personalize your plan. It takes about 5 minutes, and you can change any answer later.',
      'Nothing here is a hard rule or medical advice. It points you in a sensible direction and watches your back; you’re always in charge.',
    ],
  },
  {
    key: 'basics', title: 'The basics',
    fields: [
      { id: 'age', type: 'number', label: 'Age', placeholder: 'years', optional: true },
      { id: 'heightIn', type: 'number', label: 'Height (inches)', hint: '5\'6" = 66 inches', value: 66 },
      { id: 'weight', type: 'number', label: 'Current weight (lb)', hint: 'Or leave blank if you’ll weigh this week', optional: true },
      { id: 'prePregWeight', type: 'number', label: 'Pre-pregnancy weight (lb)', optional: true, value: 110 },
    ],
  },
  {
    key: 'birth', title: 'Your recovery',
    fields: [
      { id: 'recentBirthDate', type: 'date', label: 'Date of your most recent birth', hint: 'Used to track weeks postpartum' },
      { id: 'deliveryType', type: 'select', label: 'Delivery', value: 'csection2',
        options: [ ['csection2', 'C-section (2nd)'], ['csection1', 'C-section (1st)'], ['vaginal', 'Vaginal'] ] },
      { id: 'twinsNote', type: 'segmented', label: 'Other little ones at home?', value: 'twins',
        options: [ ['twins', 'Yes — twins too'], ['one', 'One other'], ['none', 'Just the newborn'] ],
        hint: 'Carrying toddlers is real load — we factor it into recovery.' },
      { id: 'clearance', type: 'select', label: 'Cleared for exercise by your provider?', value: 'light',
        options: [ ['full', 'Fully cleared'], ['light', 'Cleared for light activity'], ['notyet', 'Not yet / unsure'] ] },
      { id: 'scar', type: 'select', label: 'C-section scar right now', value: 'healing', optional: true,
        options: [ ['healed', 'Healed & comfortable'], ['healing', 'Healing, a little tender'], ['issue', 'Pulling, painful, or numb'] ] },
      { id: 'bleeding', type: 'select', label: 'Bleeding (lochia)', value: 'light', optional: true,
        options: [ ['none', 'None'], ['light', 'Light / spotting'], ['moderate', 'Still moderate'], ['returned', 'Returned after activity'] ] },
    ],
  },
  {
    key: 'feeding', title: 'Breastfeeding',
    fields: [
      { id: 'feeding', type: 'select', label: 'Feeding', value: 'exclusive',
        options: [ ['exclusive', 'Breastfeeding'], ['mixed', 'Breast + formula'], ['pumping', 'Mostly pumping'], ['weaning', 'Weaning'], ['none', 'Not breastfeeding'] ] },
      { id: 'feedsPerDay', type: 'number', label: 'Feeds / pumps per day (approx)', optional: true },
      { id: 'supply', type: 'segmented', label: 'Milk supply', value: 'abundant',
        options: [ ['low', 'Low'], ['ok', 'Adequate'], ['abundant', 'Abundant'] ],
        hint: 'Tracked for info only — it won’t restrict your plan.' },
    ],
  },
  {
    key: 'activity', title: 'Where you’re at',
    fields: [
      { id: 'currentRun', type: 'segmented', label: 'Running right now', value: 'light',
        options: [ ['none', 'Not yet'], ['light', 'Light, ~1 mile'], ['some', 'A few miles'] ] },
      { id: 'longestWalk', type: 'select', label: 'Longest comfortable walk today', value: '30',
        options: [ ['10', 'Under 10 min'], ['20', '10–20 min'], ['30', '20–30 min'], ['30+', '30+ min'] ] },
      { id: 'runHistory', type: 'longtext', label: 'Running background', placeholder: 'e.g. marathoner, ~110 lb, typical paces / PRs', optional: true },
      { id: 'goalEvent', type: 'text', label: 'Goal event or distance (if any)', placeholder: 'e.g. half marathon this fall', optional: true },
    ],
  },
  {
    key: 'screen', title: 'A quick body check',
    body: ['These help us pace your running — they don’t block anything. Answer honestly so the warnings can actually help.'],
    fields: [
      { id: 'pain', type: 'multi', label: 'Any current pain?', optional: true,
        options: [ ['back', 'Low back'], ['pelvis', 'Pelvis'], ['hips', 'Hips'], ['incision', 'Incision'], ['none', 'None'] ] },
      { id: 'pelvicFloor', type: 'multi', label: 'Pelvic-floor signs (tap any that apply)', optional: true,
        options: [ ['leak', 'Leaking with cough/jump/run'], ['heavy', 'Heaviness or bulge'], ['pain', 'Pain with intercourse'], ['none', 'None of these'] ],
        hint: 'Any of these → worth a pelvic-floor PT visit before adding impact.' },
      { id: 'sawPT', type: 'segmented', label: 'Seen a pelvic-floor PT?', value: 'no', optional: true,
        options: [ ['yes', 'Yes'], ['planned', 'Planned'], ['no', 'No'] ] },
    ],
  },
  {
    key: 'diastasis', title: 'Diastasis self-check', kind: 'diastasis',
    body: [
      'Lie on your back, knees bent, feet flat. Place 2–3 fingers flat just above your belly button, pointing toward your toes. Slowly lift your head and shoulders a little.',
      'Feel for the gap between the ab muscles, and whether the middle stays firm or sinks.',
    ],
    fields: [
      { id: 'diastasisGap', type: 'select', label: 'Gap width', value: '2',
        options: [ ['1', '1 finger or less'], ['2', 'About 2 fingers'], ['3', '3+ fingers'] ] },
      { id: 'diastasisDome', type: 'segmented', label: 'Does the midline bulge/dome up?', value: 'no',
        options: [ ['no', 'No'], ['yes', 'Yes'] ] },
    ],
  },
  {
    key: 'logistics', title: 'Your week',
    fields: [
      { id: 'equipment', type: 'multi', label: 'Equipment you have', value: ['bodyweight'],
        options: [ ['bodyweight', 'Bodyweight only'], ['dumbbells', 'Dumbbells'], ['bands', 'Resistance bands'], ['kettlebell', 'Kettlebell'], ['treadmill', 'Treadmill'], ['stroller', 'Jogging stroller'], ['gym', 'Gym access'] ] },
      { id: 'sessionLen', type: 'segmented', label: 'Realistic time per session', value: '20',
        options: [ ['15', '15 min'], ['20', '20–30 min'], ['40', '30–45 min'] ] },
      { id: 'sessionsPerWeek', type: 'segmented', label: 'Sessions per week', value: '3',
        options: [ ['2', '2'], ['3', '3'], ['4', '4+'] ] },
    ],
  },
  {
    key: 'food', title: 'Food & budget',
    fields: [
      { id: 'budget', type: 'segmented', label: 'Grocery budget', value: 'tight',
        options: [ ['tight', 'Tight'], ['moderate', 'Moderate'], ['flexible', 'Flexible'] ] },
      { id: 'cookTime', type: 'segmented', label: 'Time to cook', value: 'minimal',
        options: [ ['minimal', 'Minimal'], ['some', 'Some'], ['enjoy', 'I enjoy it'] ] },
      { id: 'restrictions', type: 'text', label: 'Allergies / restrictions', placeholder: 'e.g. none, dairy, vegetarian', optional: true },
      { id: 'dislikes', type: 'text', label: 'Foods you won’t eat', placeholder: 'comma separated', optional: true },
      { id: 'caffeine', type: 'segmented', label: 'Coffee / caffeine?', value: 'yes', optional: true,
        options: [ ['yes', 'Yes'], ['no', 'No'] ] },
    ],
  },
  {
    key: 'goals', title: 'What matters to you',
    fields: [
      { id: 'goalsRanked', type: 'multi', label: 'Top goals (tap your main ones)', value: ['run', 'feel'],
        options: [ ['run', 'Return to running'], ['weight', 'Lose the baby weight'], ['strength', 'Rebuild strength'], ['energy', 'More energy'], ['feel', 'Feel like myself'] ] },
      { id: 'success3mo', type: 'longtext', label: 'In 3 months, success looks like…', optional: true },
      { id: 'obstacle', type: 'segmented', label: 'Biggest obstacle', value: 'time', optional: true,
        options: [ ['time', 'Time'], ['energy', 'Energy'], ['hunger', 'Hunger'], ['motivation', 'Motivation'] ] },
    ],
  },
];
