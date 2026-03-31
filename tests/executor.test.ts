import { describe, test, expect } from 'bun:test';
import { writeFileSync, readFileSync, unlinkSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
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
    const step = makeStep({ commands: ['echo dangerous-but-harmless'] });
    const result = await executeStep(step, true);
    expect(result.success).toBe(true);
    expect(result.stdout).toContain('Would execute');
    expect(result.durationMs).toBe(0);
  });

  test('blocks dangerous commands even in dry run', async () => {
    const step = makeStep({ commands: ['rm -rf /'] });
    const result = await executeStep(step, true);
    expect(result.success).toBe(false);
    expect(result.stderr).toContain('Blocked');
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

  test('backup creates .macbonk.bak before execution', async () => {
    const tmp = join(tmpdir(), `macbonk-test-${Date.now()}.txt`);
    writeFileSync(tmp, 'original');
    const step = makeStep({ commands: [`echo overwritten > ${tmp}`], backupPaths: [tmp] });
    const result = await executeStep(step, false);
    expect(result.success).toBe(true);
    expect(result.backedUp).toContain(`${tmp}.macbonk.bak`);
    expect(readFileSync(`${tmp}.macbonk.bak`, 'utf-8')).toBe('original');
    unlinkSync(tmp);
    unlinkSync(`${tmp}.macbonk.bak`);
  });

  test('backup skips nonexistent files', async () => {
    const step = makeStep({ commands: ['echo ok'], backupPaths: ['/tmp/nonexistent-macbonk-file'] });
    const result = await executeStep(step, false);
    expect(result.success).toBe(true);
    expect(result.backedUp).toHaveLength(0);
  });

  test('dry run mentions backups without creating them', async () => {
    const step = makeStep({ commands: ['echo ok'], backupPaths: ['~/.ssh/config'] });
    const result = await executeStep(step, true);
    expect(result.stdout).toContain('Would backup');
    expect(result.stdout).toContain('~/.ssh/config');
  });
});
