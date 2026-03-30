import { mkdirSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const dir = join(homedir(), '.macbonk');
const file = join(dir, `log-${new Date().toISOString().replace(/[:.]/g, '-')}.txt`);

try { mkdirSync(dir, { recursive: true }); } catch {}

export function log(msg: string) {
  appendFileSync(file, `${new Date().toISOString()} ${msg}\n`);
}

export function getLogPath() {
  return file;
}
