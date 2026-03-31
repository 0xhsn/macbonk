import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { copyFileSync, existsSync } from 'node:fs';
import type { HardeningStep } from '../types.ts';
import { log } from './logger.ts';

const run = promisify(exec);

export interface ExecuteResult {
  success: boolean;
  stdout: string;
  stderr: string;
  durationMs: number;
  backedUp?: string[];
}

function expandPath(p: string): string {
  return p.replace(/^~/, process.env.HOME ?? '');
}

function backupFiles(paths: string[]): string[] {
  const backed: string[] = [];
  for (const raw of paths) {
    const p = expandPath(raw);
    if (existsSync(p)) {
      const dest = `${p}.macbonk.bak`;
      try {
        copyFileSync(p, dest);
        log(`[BACKUP] ${p} -> ${dest}`);
        backed.push(dest);
      } catch (e: any) {
        log(`[BACKUP FAIL] ${p}: ${e.message}`);
      }
    }
  }
  return backed;
}

export async function executeStep(step: HardeningStep, dryRun: boolean): Promise<ExecuteResult> {
  const joined = step.commands.join(' && ');

  if (dryRun) {
    const backupMsg = step.backupPaths?.length ? `\nWould backup: ${step.backupPaths.join(', ')}` : '';
    log(`[DRY RUN] ${step.id}: ${joined}`);
    return { success: true, stdout: `Would execute: ${joined}${backupMsg}`, stderr: '', durationMs: 0 };
  }

  const backedUp = step.backupPaths ? backupFiles(step.backupPaths) : [];
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
    return { success: true, stdout, stderr, durationMs: Date.now() - start, backedUp };
  } catch (err: any) {
    const ms = Date.now() - start;
    log(`[FAIL] ${step.id}: ${err.message}`);
    if (step.tolerateFailure) {
      log(`[TOLERATED] ${step.id}`);
      return { success: true, stdout: err.stdout ?? '', stderr: err.stderr ?? err.message, durationMs: ms, backedUp };
    }
    return { success: false, stdout: err.stdout ?? '', stderr: err.stderr ?? err.message, durationMs: ms, backedUp };
  }
}
