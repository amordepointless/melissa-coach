// exercises.js — seed exercise library.
// videoId is intentionally null: we open a YouTube search biased to reputable
// postpartum/pelvic-health channels rather than embed unverified IDs. Drop a
// verified 11-char YouTube id into videoId to switch an exercise to an embed.
//
// cat:   core | pelvic | strength | mobility | scar | run | warmup
// phases: which program phases include it (0=Foundation .. 4=Speed)

const TRUSTED = '(Goom OR "pelvic floor" OR postpartum OR "physical therapist")';

export const EXERCISES = [
  // ---- Pelvic floor ----
  { id: 'pf-quick', name: 'Pelvic floor — quick contractions', cat: 'pelvic', phases: [0,1,2],
    target: '10 quick lifts', videoId: null, searchQuery: 'pelvic floor quick contractions kegel technique physical therapist',
    diastasisSafe: true, impact: false,
    cues: ['Sit or lie comfortably', 'Quick lift-and-release, like stopping gas', 'Fully relax between each — relaxation matters as much as the squeeze'] },
  { id: 'pf-holds', name: 'Pelvic floor — endurance holds', cat: 'pelvic', phases: [0,1,2],
    target: '10–12 × 6–8s holds', videoId: null, searchQuery: 'pelvic floor endurance holds postpartum physical therapist',
    diastasisSafe: true, impact: false,
    cues: ['Lift and hold 6–8 seconds', 'Keep breathing — do not hold your breath', 'Rest equal time between reps'] },
  { id: 'pf-long', name: 'Pelvic floor — 60s submaximal hold', cat: 'pelvic', phases: [0,1],
    target: '1 × 60s at ~50%', videoId: null, searchQuery: 'pelvic floor submaximal endurance hold postpartum',
    diastasisSafe: true, impact: false,
    cues: ['Gentle ~50% lift', 'Hold up to 60 seconds while breathing normally', 'Stop early if it fatigues — build over time'] },

  // ---- Breath & deep core ----
  { id: 'breath-360', name: '360° diaphragmatic breathing', cat: 'core', phases: [0,1,2],
    target: '8–10 breaths', videoId: null, searchQuery: '360 diaphragmatic breathing core postpartum demonstration',
    diastasisSafe: true, impact: false,
    cues: ['Hands on lower ribs', 'Inhale: ribs expand all directions, pelvic floor relaxes', 'Exhale: ribs soften, gentle pelvic-floor + lower-belly lift'] },
  { id: 'tva', name: 'Transversus abdominis activation', cat: 'core', phases: [0,1],
    target: '10 × 5s', videoId: null, searchQuery: 'transversus abdominis activation postpartum core connection',
    diastasisSafe: true, impact: false,
    cues: ['Lie knees bent', 'Exhale and gently draw lower belly toward spine', 'No bearing down or breath holding — watch for coning'] },
  { id: 'deadbug', name: 'Dead bug', cat: 'core', phases: [0,1,2],
    target: '8–10 / side', videoId: null, searchQuery: 'dead bug exercise postpartum core diastasis safe',
    diastasisSafe: true, impact: false,
    cues: ['On back, arms up, knees over hips', 'Exhale, lower opposite arm + leg', 'Keep lower back gently down; stop if midline domes'] },
  { id: 'birddog', name: 'Bird dog', cat: 'core', phases: [0,1,2],
    target: '8–10 / side', videoId: null, searchQuery: 'bird dog exercise postpartum core stability',
    diastasisSafe: true, impact: false,
    cues: ['On hands and knees, flat back', 'Reach opposite arm + leg', 'Keep hips level — no rotation'] },
  { id: 'heelslide', name: 'Heel slides', cat: 'core', phases: [0,1],
    target: '8–10 / side', videoId: null, searchQuery: 'heel slides postpartum core exercise',
    diastasisSafe: true, impact: false,
    cues: ['On back, exhale to engage core', 'Slide one heel out and back', 'Keep pelvis still'] },

  // ---- C-section scar ----
  { id: 'scar-mob', name: 'C-section scar mobilization', cat: 'scar', phases: [0,1,2],
    target: '3–5 min', videoId: null, searchQuery: 'c-section scar mobilization massage technique physical therapist',
    diastasisSafe: true, impact: false,
    cues: ['Only once incision is fully closed and cleared', 'Start with gentle circles around (not on) the scar', 'Progress to light pressure on the scar as it tolerates — never painful'] },

  // ---- Glutes / lower-body strength ----
  { id: 'glutebridge', name: 'Glute bridge', cat: 'strength', phases: [0,1,2,3],
    target: '10–15', videoId: null, searchQuery: 'glute bridge exercise form postpartum',
    diastasisSafe: true, impact: false,
    cues: ['On back, feet flat', 'Exhale, press through heels, lift hips', 'Squeeze glutes; ribs stay down'] },
  { id: 'glutebridge-sl', name: 'Single-leg glute bridge', cat: 'strength', phases: [1,2,3],
    target: '8–12 / side', videoId: null, searchQuery: 'single leg glute bridge form',
    diastasisSafe: true, impact: false,
    cues: ['Extend one leg', 'Lift hips level — no drop on one side', 'Control the lower'] },
  { id: 'clamshell', name: 'Side-lying clamshell', cat: 'strength', phases: [0,1,2],
    target: '12–15 / side', videoId: null, searchQuery: 'clamshell exercise glute medius form',
    diastasisSafe: true, impact: false,
    cues: ['Side-lying, knees bent', 'Open top knee, keep feet together', 'No rolling backward'] },
  { id: 'sit2stand', name: 'Sit-to-stand', cat: 'strength', phases: [0,1,2],
    target: '10–15', videoId: null, searchQuery: 'sit to stand exercise form',
    diastasisSafe: true, impact: false,
    cues: ['Stand up from a chair without hands if able', 'Exhale on the way up', 'Knees track over toes'] },
  { id: 'stepup', name: 'Step-up', cat: 'strength', phases: [1,2,3],
    target: '8–10 / side', videoId: null, searchQuery: 'step up exercise form beginner',
    diastasisSafe: true, impact: false,
    cues: ['Step onto a low sturdy surface', 'Drive through the top heel', 'Control down — no flopping'] },
  { id: 'squat', name: 'Bodyweight squat', cat: 'strength', phases: [1,2,3,4],
    target: '10–15', videoId: null, searchQuery: 'bodyweight squat form',
    diastasisSafe: true, impact: false,
    cues: ['Feet shoulder-width', 'Sit back and down', 'Exhale up; ribs over pelvis'] },
  { id: 'sl-squat', name: 'Single-leg squat (to chair)', cat: 'strength', phases: [1,2,3],
    target: '6–10 / side', videoId: null, searchQuery: 'single leg squat to chair regression form',
    diastasisSafe: true, impact: false,
    cues: ['Sit back to a chair on one leg', 'Keep knee tracking over foot', 'Use this in the run-readiness check'] },
  { id: 'rdl', name: 'Hip hinge / RDL', cat: 'strength', phases: [2,3,4],
    target: '8–12', videoId: null, searchQuery: 'romanian deadlift hip hinge form beginner',
    diastasisSafe: true, impact: false,
    cues: ['Soft knees, push hips back', 'Flat back, feel hamstrings', 'Exhale to stand tall'] },
  { id: 'calf-raise', name: 'Calf raise', cat: 'strength', phases: [1,2,3],
    target: '15–20 (or / side)', videoId: null, searchQuery: 'calf raise exercise form',
    diastasisSafe: true, impact: false,
    cues: ['Rise onto toes', 'Pause at top', 'Slow lower — key for running resilience'] },
  { id: 'sl-abduction', name: 'Single-leg abduction', cat: 'strength', phases: [1,2,3],
    target: '15–20 / side', videoId: null, searchQuery: 'standing hip abduction exercise form',
    diastasisSafe: true, impact: false,
    cues: ['Stand tall, lift one leg out to side', 'Keep torso still', 'Used in the run-readiness check'] },

  // ---- Mobility / warmup ----
  { id: 'catcow', name: 'Cat–cow', cat: 'mobility', phases: [0,1,2,3,4],
    target: '8–10', videoId: null, searchQuery: 'cat cow stretch spine mobility',
    diastasisSafe: true, impact: false,
    cues: ['On hands and knees', 'Alternate arch and round with breath', 'Move slowly'] },
  { id: 'walk', name: 'Easy walk', cat: 'warmup', phases: [0,1,2,3,4],
    target: '20–40 min', videoId: null, searchQuery: 'postpartum walking program',
    diastasisSafe: true, impact: false,
    cues: ['Comfortable conversational pace', 'Great base aerobic work', 'Stroller pushing counts'] },

  // ---- Running ----
  { id: 'run-walk', name: 'Run / walk intervals', cat: 'run', phases: [1,2],
    target: 'see plan', videoId: null, searchQuery: 'postpartum return to running run walk method',
    diastasisSafe: true, impact: true,
    cues: ['Easy conversational effort on the run portions', 'Stop for any leaking, heaviness, pain or coning', 'Progress run time before cutting walk time'] },
  { id: 'easy-run', name: 'Easy continuous run', cat: 'run', phases: [2,3,4],
    target: 'see plan', videoId: null, searchQuery: 'easy zone 2 running form postpartum',
    diastasisSafe: true, impact: true,
    cues: ['Conversational — you can talk in full sentences', 'Relaxed posture, quick light steps', 'Most of your running lives here'] },
  { id: 'strides', name: 'Strides', cat: 'run', phases: [3,4],
    target: '4–6 × 20s', videoId: null, searchQuery: 'running strides technique',
    diastasisSafe: true, impact: true,
    cues: ['Smooth build to ~85% over 20s', 'Full recovery between', 'Only once symptom-free with base mileage'] },
  { id: 'tempo', name: 'Tempo run', cat: 'run', phases: [3,4],
    target: 'see plan', videoId: null, searchQuery: 'tempo run threshold pace explained',
    diastasisSafe: true, impact: true,
    cues: ['Comfortably hard, sustainable effort', 'Build duration gradually', 'Marathon-prep work — late phase only'] },
];

export const exById = Object.fromEntries(EXERCISES.map((e) => [e.id, e]));
export function exercisesForPhase(phase, cat) {
  return EXERCISES.filter((e) => e.phases.includes(phase) && (!cat || e.cat === cat));
}
