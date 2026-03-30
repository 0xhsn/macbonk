import { platform, release, arch, hostname, cpus, totalmem } from 'node:os';
import { execSync } from 'node:child_process';

export function assertMacOS() {
  if (platform() !== 'darwin') {
    console.error('macbonk only runs on macOS');
    process.exit(1);
  }
}

function getProductVersion(): string {
  try {
    return execSync('sw_vers -productVersion', { encoding: 'utf-8' }).trim();
  } catch {
    return release();
  }
}

function getProductName(): string {
  try {
    return execSync('sw_vers -productName', { encoding: 'utf-8' }).trim();
  } catch {
    return 'macOS';
  }
}

function getChipName(): string {
  try {
    return execSync('sysctl -n machdep.cpu.brand_string', { encoding: 'utf-8' }).trim();
  } catch {
    return arch();
  }
}

export function getSystemInfo(): string[] {
  const mem = `${Math.round(totalmem() / (1024 ** 3))} GB RAM`;
  return [
    `${getProductName()} ${getProductVersion()} (${arch()})`,
    `${getChipName()} · ${cpus().length} cores · ${mem}`,
    `Host: ${hostname()}`,
  ];
}
