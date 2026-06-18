// training-engine.js — deterministic progress / hold / deload logic and the
// current session prescription. The safety-critical decisions live here, in
// plain readable code (not an LLM), so they can be trusted and audited.
import { store } from '../store.js';
import { phaseState } from '../state.js';
import { PHASES, WEEK_TEMPLATES, RUNWALK_LADDER } from '../data/program.js';
import { recoverySnapshot, activeWarnings, weightTrendPerWeek } from './signals.js';
import { recentDailies } from './signals.js';

// Decide a recommendation for the coming week.
// Returns { status:'progress'|'hold'|'deload', reasons:[], warnings:[] }
export function weeklyRecommendation() {
  const rec = recoverySnapshot();
  const warnings = activeWarnings();
  const reasons = [];

  // Any red-flag symptom => recommend deload (she decides).
  if (warnings.length) {
    return {
      status: 'deload',
      warnings,
      reasons: ['A warning sign was logged this week — the safest move is to ease back.'],
    };
  }

  // Count amber signals.
  let amber = 0;
  if (rec.energy != null && rec.energy < 3) { amber++; reasons.push('Energy has been low.'); }
  if (rec.soreness != null && rec.soreness >= 3) { amber++; reasons.push('Soreness has been lingering.'); }
  if (rec.poorSleepNights >= 3) { amber++; reasons.push('Several rough-sleep nights.'); }

  if (amber >= 2) {
    return { status: 'hold', warnings: [], reasons: reasons.length ? reasons : ['A couple of recovery signals are down — repeat this week.'] };
  }

  // Green: enough data and things look good.
  if (rec.count >= 3 && (rec.energy == null || rec.energy >= 3) && (rec.soreness == null || rec.soreness <= 2)) {
    return { status: 'progress', warnings: [], reasons: ['Recovery is holding up — you’re clear to nudge things forward.'] };
  }

  // Not enough data yet → hold by default (gentle).
  return { status: 'hold', warnings: [], reasons: ['Not much logged yet this week — keep things steady and log a few days.'] };
}

// Apply a decision to advance/hold/regress the phase pointer.
export function applyDecision(status) {
  const ps = phaseState();
  if (status === 'progress') {
    const inPhase = ps.weekInPhase + 1;
    const maxWeeks = phaseLadderLength(ps.phase);
    if (inPhase > maxWeeks && ps.phase < PHASES.length - 1) {
      store.patch('phase', { phase: ps.phase + 1, weekInPhase: 1, lastReview: new Date().toISOString() });
    } else {
      store.patch('phase', { weekInPhase: inPhase, lastReview: new Date().toISOString() });
    }
  } else if (status === 'deload') {
    const inPhase = Math.max(1, ps.weekInPhase - 1);
    store.patch('phase', { weekInPhase: inPhase, lastReview: new Date().toISOString() });
  } else {
    store.patch('phase', { lastReview: new Date().toISOString() });
  }
  return phaseState();
}

function phaseLadderLength(phase) {
  if (phase === 1) return RUNWALK_LADDER.length; // walk/run progresses through the ladder
  return 4; // ~4 weeks per phase by default before considering advancement
}

// The run-walk prescription for the current Phase-1 week.
export function runWalkForWeek() {
  const ps = phaseState();
  const idx = Math.min(ps.weekInPhase - 1, RUNWALK_LADDER.length - 1);
  return RUNWALK_LADDER[Math.max(0, idx)];
}

// Sessions for this week (template for the current phase).
export function weekSessions() {
  const ps = phaseState();
  return WEEK_TEMPLATES[ps.phase] || WEEK_TEMPLATES[0];
}

// Pick "today's" session: rotate through the week's non-rest sessions by day index,
// so the Today screen always has something sensible to show.
export function todaySession() {
  const sessions = weekSessions();
  const dayIdx = new Date().getDay(); // 0..6
  const ordered = sessions.filter((s) => s.type !== 'rest');
  if (!ordered.length) return sessions[0];
  // Map weekday to a session, leaving roughly one rest day.
  const map = [ 'rest', 0, 1, 2, 3, 4, 5 ]; // Sun rest, then cycle
  const sel = map[dayIdx];
  if (sel === 'rest') return sessions.find((s) => s.type === 'rest') || ordered[0];
  return ordered[sel % ordered.length];
}
