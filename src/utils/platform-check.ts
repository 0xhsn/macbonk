import { platform, arch, hostname, cpus, totalmem } from 'node:os';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(exec);

export function assertMacOS() {
  if (platform() !== 'darwin') {
    console.error('macbonk only runs on macOS');
    process.exit(1);
  }
}

async function shell(cmd: string, fallback: string): Promise<string> {
  try {
    const { stdout } = await run(cmd, { timeout: 5000 });
    return stdout.trim();
  } catch {
    return fallback;
  }
}

let _cached: string[] | null = null;
let _prefetch: Promise<string[]> | null = null;

async function fetchSystemInfo(): Promise<string[]> {
  const [productName, productVersion, chip] = await Promise.all([
    shell('sw_vers -productName', 'macOS'),
    shell('sw_vers -productVersion', ''),
    shell('sysctl -n machdep.cpu.brand_string', arch()),
  ]);
  const mem = `${Math.round(totalmem() / (1024 ** 3))} GB RAM`;
  return [
    `${productName} ${productVersion} (${arch()})`,
    `${chip} · ${cpus().length} cores · ${mem}`,
    `Host: ${hostname()}`,
  ];
}

export function prefetchSystemInfo() {
  if (!_prefetch) _prefetch = fetchSystemInfo().then(info => { _cached = info; return info; });
}

export function getSystemInfo(): string[] {
  return _cached ?? [`macOS (${arch()})`, `${cpus().length} cores · ${Math.round(totalmem() / (1024 ** 3))} GB RAM`, `Host: ${hostname()}`];
}
