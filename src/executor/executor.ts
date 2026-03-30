import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import type { HardeningStep } from '../types.ts';
import { log } from './logger.ts';

const run = promisify(exec);

export interface ExecuteResult {
  success: boolean;
  stdout: string;
  stderr: string;
  durationMs: number;
}

export async function executeStep(step: HardeningStep, dryRun: boolean): Promise<ExecuteResult> {
  const joined = step.commands.join(' && ');

  if (dryRun) {
    log(`[DRY RUN] ${step.id}: ${joined}`);
    return { success: true, stdout: `Would execute: ${joined}`, stderr: '', durationMs: 0 };
  }

  const start = Date.now();
  try {
    let stdout = '';
    let stderr = '';
    for (const cmd of step.commands) {
      log(`[EXEC] ${step.id}: ${cmd}`);
      const result = await run(cmd, { timeout: 60_000 });
      stdout += result.stdout;
      stderr += result.stderr;
    }
    log(`[OK] ${step.id} (${Date.now() - start}ms)`);
    return { success: true, stdout, stderr, durationMs: Date.now() - start };
  } catch (err: any) {
    const ms = Date.now() - start;
    log(`[FAIL] ${step.id}: ${err.message}`);
    if (step.tolerateFailure) {
      log(`[TOLERATED] ${step.id}`);
      return { success: true, stdout: err.stdout ?? '', stderr: err.stderr ?? err.message, durationMs: ms };
    }
    return { success: false, stdout: err.stdout ?? '', stderr: err.stderr ?? err.message, durationMs: ms };
  }
}
