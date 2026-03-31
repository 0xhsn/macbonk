import { describe, test, expect, beforeEach } from 'bun:test';
import { saveSession, loadSession, clearSession } from '../src/utils/session.ts';
import { allSteps } from '../src/constants.ts';

beforeEach(() => {
  clearSession();
});

describe('session persistence', () => {
  test('save and load round-trips', () => {
    const queue = allSteps.slice(0, 5);
    const outcomes = [{ step: queue[0]!, result: 'applied' as const, durationMs: 100 }];
    saveSession(queue, 1, outcomes);
    const loaded = loadSession();
    expect(loaded).not.toBeNull();
    expect(loaded!.currentIndex).toBe(1);
    expect(loaded!.queue).toHaveLength(5);
    expect(loaded!.outcomes).toHaveLength(1);
  });

  test('clear removes session', () => {
    saveSession(allSteps.slice(0, 3), 0, []);
    clearSession();
    expect(loadSession()).toBeNull();
  });

  test('load returns null when no session exists', () => {
    expect(loadSession()).toBeNull();
  });

  test('saves step IDs not full objects', () => {
    const queue = allSteps.slice(0, 2);
    saveSession(queue, 0, []);
    const loaded = loadSession();
    expect(typeof loaded!.queue[0]).toBe('string');
    expect(loaded!.queue[0]).toBe(queue[0]!.id);
  });
});
