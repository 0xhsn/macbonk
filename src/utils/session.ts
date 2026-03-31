import { readFileSync, writeFileSync, unlinkSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import type { StepOutcome, HardeningStep } from '../types.ts';

const DIR = join(homedir(), '.macbonk');
const STATE_FILE = join(DIR, 'state.json');

interface SessionState {
  queue: string[];
  currentIndex: number;
  outcomes: StepOutcome[];
  timestamp: string;
}

try { mkdirSync(DIR, { recursive: true }); } catch {}

export function saveSession(queue: HardeningStep[], currentIndex: number, outcomes: StepOutcome[]) {
  const state: SessionState = {
    queue: queue.map(s => s.id),
    currentIndex,
    outcomes,
    timestamp: new Date().toISOString(),
  };
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

export function loadSession(): SessionState | null {
  try {
    const data = JSON.parse(readFileSync(STATE_FILE, 'utf-8')) as SessionState;
    const age = Date.now() - new Date(data.timestamp).getTime();
    if (age > 24 * 60 * 60 * 1000) {
      clearSession();
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function clearSession() {
  try { unlinkSync(STATE_FILE); } catch {}
}
