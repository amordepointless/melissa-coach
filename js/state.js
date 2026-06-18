// state.js — derived/profile helpers sitting on top of store.js.
import { store } from './store.js';
import { weeksSince, today, isoWeek } from './util.js';
import { PHASES } from './data/program.js';

export function profile() { return store.read('profile'); }
export function settings() { return store.read('settings'); }

export function isOnboarded() { return !!profile().onboardingComplete; }

// Weeks since most recent birth (postpartum clock).
export function weeksPostpartum() {
  const p = profile();
  return p.recentBirthDate ? weeksSince(p.recentBirthDate) : null;
}

export function phaseState() { return store.read('phase'); }
export function currentPhase() {
  const ps = phaseState();
  return PHASES[ps.phase] || PHASES[0];
}

export function displayName() { return 'Melissa'; }

// "Has a toddler/twin lifting load" — biases recovery conservative.
export function hasTwinsTax() {
  const p = profile();
  return p.twinsNote === 'twins' || p.twinsNote === 'one';
}

// Convenience for week/day keys.
export const keys = { today, isoWeek };
