import { describe, test, expect, mock } from 'bun:test';
import { executeStep } from '../src/executor/executor.ts';
import type { HardeningStep } from '../src/types.ts';

const makeStep = (overrides: Partial<HardeningStep> = {}): HardeningStep => ({
  id: 'test.step',
  title: 'Test step',
  description: 'A test step',
  category: 'verification',
  commands: ['echo hello'],
  dangerLevel: 'low',
  requiresSudo: false,
  ...overrides,
});

describe('executor', () => {
  test('dry run never executes commands', async () => {
    const step = makeStep({ commands: ['rm -rf /'] });
    const result = await executeStep(step, true);
    expect(result.success).toBe(true);
    expect(result.stdout).toContain('Would execute');
    expect(result.durationMs).toBe(0);
  });

  test('successful command returns success', async () => {
    const step = makeStep({ commands: ['echo test'] });
    const result = await executeStep(step, false);
    expect(result.success).toBe(true);
    expect(result.stdout.trim()).toBe('test');
  });

  test('failed command returns failure', async () => {
    const step = makeStep({ commands: ['false'] });
    const result = await executeStep(step, false);
    expect(result.success).toBe(false);
  });

  test('tolerated failure returns success', async () => {
    const step = makeStep({ commands: ['false'], tolerateFailure: true });
    const result = await executeStep(step, false);
    expect(result.success).toBe(true);
  });

  test('multiple commands run sequentially', async () => {
    const step = makeStep({ commands: ['echo one', 'echo two'] });
    const result = await executeStep(step, false);
    expect(result.success).toBe(true);
    expect(result.stdout).toContain('one');
    expect(result.stdout).toContain('two');
  });

  test('second command failure stops execution', async () => {
    const step = makeStep({ commands: ['echo first', 'false', 'echo third'] });
    const result = await executeStep(step, false);
    expect(result.success).toBe(false);
  });

  test('duration is tracked for real commands', async () => {
    const step = makeStep({ commands: ['sleep 0.1'] });
    const result = await executeStep(step, false);
    expect(result.durationMs).toBeGreaterThanOrEqual(50);
  });
});
