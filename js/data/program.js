// program.js — phase definitions, weekly session templates, and the
// readiness self-checks. Templates reference exercise ids from exercises.js.

export const PHASES = [
  {
    n: 0, key: 'foundation', name: 'Foundation',
    blurb: 'Rebuild deep core, pelvic floor, and scar mobility — layered alongside your easy ~1-mile runs.',
    focus: ['Breath + deep core', 'Pelvic floor', 'C-section scar', 'Walking base', 'Keep easy runs easy'],
    typicalWeeks: '~2–6 weeks (guided by how the self-checks feel)',
    runGuidance: 'Keep current easy runs (~1 mile) relaxed and conversational. Don\'t add volume yet — build the base first.',
  },
  {
    n: 1, key: 'walkrun', name: 'Walk / Run Build',
    blurb: 'Grow easy running with short run-walk progressions while strength continues.',
    focus: ['Run-walk progressions', '2 strength sessions/week', 'Core + pelvic floor', '≤10%/week volume'],
    typicalWeeks: '~4–8 weeks',
    runGuidance: 'Build run intervals first (e.g., 2→3→5 min) before shrinking walk breaks; aim toward ~20–30 min continuous.',
  },
  {
    n: 2, key: 'base', name: 'Aerobic Base',
    blurb: 'Continuous easy mileage, mostly conversational (Zone 2), with steady strength.',
    focus: ['Continuous easy runs', 'One slightly longer run', 'Strength 2×/week', '≤10%/week'],
    typicalWeeks: '~6–10 weeks',
    runGuidance: 'Keep almost all running easy. Grow the long run by ≤10%/week. Hills/strides only once stable.',
  },
  {
    n: 3, key: 'strength', name: 'Strength & Structure',
    blurb: 'Add structure (tempo, longer long runs) on a solid easy base.',
    focus: ['Tempo + strides', 'Longer long run', 'Heavier strength', 'Recovery discipline'],
    typicalWeeks: '~6–8 weeks',
    runGuidance: 'Introduce comfortably-hard tempo work sparingly. Long run extends toward half-marathon distance.',
  },
  {
    n: 4, key: 'speed', name: 'Speed & Marathon Prep',
    blurb: 'Sharpen with speed and build the long run toward marathon distance.',
    focus: ['Intervals (last to add)', 'Long-run build', 'Race-specific work', 'Stay symptom-free'],
    typicalWeeks: 'ongoing to race day',
    runGuidance: 'A realistic marathon is ~9–12+ months postpartum, contingent on staying symptom-free and well-fueled.',
  },
];

// Weekly session templates per phase. Each session: {key,title,type,items[],note}
// type: 'strength' | 'core' | 'run' | 'walk' | 'rest'
// items reference exercise ids (with optional override target).
export const WEEK_TEMPLATES = {
  0: [
    { key: 'd1', title: 'Core + Pelvic Floor', type: 'core', items: [
      { id: 'breath-360' }, { id: 'pf-quick' }, { id: 'pf-holds' }, { id: 'deadbug' }, { id: 'glutebridge' } ] },
    { key: 'd2', title: 'Easy Run + Walk', type: 'run', items: [ { id: 'walk', target: '5 min warm-up' }, { id: 'easy-run', target: '~1 mile easy' } ],
      note: 'Keep it conversational. This is your current base — no pressure to push.' },
    { key: 'd3', title: 'Foundation Strength', type: 'strength', items: [
      { id: 'sit2stand' }, { id: 'clamshell' }, { id: 'birddog' }, { id: 'calf-raise' }, { id: 'scar-mob' } ] },
    { key: 'd4', title: 'Walk + Mobility', type: 'walk', items: [ { id: 'walk', target: '30 min' }, { id: 'catcow' }, { id: 'pf-long' } ] },
    { key: 'd5', title: 'Core + Pelvic Floor', type: 'core', items: [
      { id: 'breath-360' }, { id: 'pf-holds' }, { id: 'heelslide' }, { id: 'birddog' }, { id: 'glutebridge' } ] },
    { key: 'rest', title: 'Rest / gentle movement', type: 'rest', items: [],
      note: 'Carrying the babies counts as load — let rest be rest.' },
  ],
  1: [
    { key: 'd1', title: 'Run / Walk', type: 'run', items: [ { id: 'walk', target: '5 min warm-up' }, { id: 'run-walk' } ],
      note: 'Use the interval prescription on your Today screen.' },
    { key: 'd2', title: 'Lower Strength + Core', type: 'strength', items: [
      { id: 'squat' }, { id: 'glutebridge-sl' }, { id: 'stepup' }, { id: 'calf-raise' }, { id: 'deadbug' } ] },
    { key: 'd3', title: 'Easy Walk', type: 'walk', items: [ { id: 'walk', target: '30–40 min' }, { id: 'pf-holds' } ] },
    { key: 'd4', title: 'Run / Walk', type: 'run', items: [ { id: 'walk', target: '5 min warm-up' }, { id: 'run-walk' } ] },
    { key: 'd5', title: 'Strength + Core', type: 'strength', items: [
      { id: 'sl-squat' }, { id: 'sl-abduction' }, { id: 'clamshell' }, { id: 'birddog' }, { id: 'scar-mob' } ] },
    { key: 'rest', title: 'Rest', type: 'rest', items: [] },
  ],
  2: [
    { key: 'd1', title: 'Easy Run', type: 'run', items: [ { id: 'walk', target: '5 min' }, { id: 'easy-run' } ] },
    { key: 'd2', title: 'Strength', type: 'strength', items: [ { id: 'squat' }, { id: 'rdl' }, { id: 'stepup' }, { id: 'calf-raise' }, { id: 'deadbug' } ] },
    { key: 'd3', title: 'Easy Run', type: 'run', items: [ { id: 'easy-run' } ] },
    { key: 'd4', title: 'Walk / Mobility', type: 'walk', items: [ { id: 'walk', target: '30 min' }, { id: 'catcow' } ] },
    { key: 'd5', title: 'Long(er) Easy Run', type: 'run', items: [ { id: 'easy-run', target: 'longest run of the week, easy' } ] },
    { key: 'd6', title: 'Strength', type: 'strength', items: [ { id: 'sl-squat' }, { id: 'glutebridge-sl' }, { id: 'sl-abduction' }, { id: 'birddog' } ] },
    { key: 'rest', title: 'Rest', type: 'rest', items: [] },
  ],
  3: [
    { key: 'd1', title: 'Tempo', type: 'run', items: [ { id: 'walk', target: '10 min warm-up' }, { id: 'tempo' }, { id: 'strides' } ] },
    { key: 'd2', title: 'Strength', type: 'strength', items: [ { id: 'squat' }, { id: 'rdl' }, { id: 'stepup' }, { id: 'calf-raise' } ] },
    { key: 'd3', title: 'Easy Run', type: 'run', items: [ { id: 'easy-run' } ] },
    { key: 'd4', title: 'Easy Run + Strides', type: 'run', items: [ { id: 'easy-run' }, { id: 'strides' } ] },
    { key: 'd5', title: 'Long Run', type: 'run', items: [ { id: 'easy-run', target: 'long run, mostly easy' } ] },
    { key: 'd6', title: 'Strength', type: 'strength', items: [ { id: 'sl-squat' }, { id: 'glutebridge-sl' }, { id: 'rdl' } ] },
    { key: 'rest', title: 'Rest', type: 'rest', items: [] },
  ],
  4: [
    { key: 'd1', title: 'Intervals', type: 'run', items: [ { id: 'walk', target: '10 min warm-up' }, { id: 'easy-run', target: 'intervals — see notes' }, { id: 'strides' } ] },
    { key: 'd2', title: 'Strength', type: 'strength', items: [ { id: 'squat' }, { id: 'rdl' }, { id: 'calf-raise' } ] },
    { key: 'd3', title: 'Easy Run', type: 'run', items: [ { id: 'easy-run' } ] },
    { key: 'd4', title: 'Tempo / Marathon-pace', type: 'run', items: [ { id: 'tempo' } ] },
    { key: 'd5', title: 'Long Run', type: 'run', items: [ { id: 'easy-run', target: 'long run — build toward race distance' } ] },
    { key: 'd6', title: 'Strength + Strides', type: 'strength', items: [ { id: 'rdl' }, { id: 'glutebridge-sl' }, { id: 'strides' } ] },
    { key: 'rest', title: 'Rest', type: 'rest', items: [] },
  ],
};

// Run-walk interval progression for Phase 1 (indexed by weekInPhase).
export const RUNWALK_LADDER = [
  { run: 1, walk: 3, sets: 6, label: 'Run 1 min / walk 3 min × 6' },
  { run: 2, walk: 3, sets: 5, label: 'Run 2 min / walk 3 min × 5' },
  { run: 3, walk: 2, sets: 5, label: 'Run 3 min / walk 2 min × 5' },
  { run: 4, walk: 2, sets: 4, label: 'Run 4 min / walk 2 min × 4' },
  { run: 5, walk: 1, sets: 4, label: 'Run 5 min / walk 1 min × 4' },
  { run: 8, walk: 1, sets: 3, label: 'Run 8 min / walk 1 min × 3' },
  { run: 10, walk: 1, sets: 3, label: 'Run 10 min / walk 1 min × 3 (~30 min)' },
];

// ---- Readiness self-checks (Goom/Donnelly battery) ----
export const READINESS_TESTS = [
  { id: 'walk30', group: 'Load', label: 'Walk 30 minutes, symptom-free' },
  { id: 'balance', group: 'Load', label: 'Single-leg balance — 10s each side' },
  { id: 'slsquat', group: 'Load', label: 'Single-leg squat — 10 reps each side' },
  { id: 'jog', group: 'Load', label: 'Jog in place — 60 seconds' },
  { id: 'bounds', group: 'Load', label: 'Forward bounds — 10 each side' },
  { id: 'hop', group: 'Load', label: 'Single-leg hop — 10 each side' },
  { id: 'runman', group: 'Load', label: '"Running man" — 10 each side' },
  { id: 'calf20', group: 'Strength', label: 'Single-leg calf raise × 20' },
  { id: 'bridge20', group: 'Strength', label: 'Single-leg bridge × 20' },
  { id: 'abd20', group: 'Strength', label: 'Single-leg abduction × 20' },
  { id: 's2s20', group: 'Strength', label: 'Single-leg sit-to-stand × 20' },
];
export const READINESS_RULE =
  '“Ready” means completing each with no pain, no leaking, and no heaviness or bulge. Weakness isn’t a barrier — it just shows where to put your strength work.';
