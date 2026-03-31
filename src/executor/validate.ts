const DANGEROUS_PATTERNS = [
  { pattern: /rm\s+(-[^\s]*\s+)*\/\s*$/, reason: 'Deletes root filesystem' },
  { pattern: /rm\s+(-[^\s]*\s+)*~\s*$/, reason: 'Deletes entire home directory' },
  { pattern: /rm\s+(-[^\s]*\s+)*\/usr/, reason: 'Deletes system binaries' },
  { pattern: /rm\s+(-[^\s]*\s+)*\/System/, reason: 'Deletes macOS system files' },
  { pattern: /rm\s+(-[^\s]*\s+)*\/Applications/, reason: 'Deletes all applications' },
  { pattern: /mkfs|dd\s+.*of=\/dev/, reason: 'Formats or overwrites disk device' },
  { pattern: />\s*\/dev\/sd|>\s*\/dev\/disk/, reason: 'Writes directly to disk device' },
  { pattern: /chmod\s+777\s+\//, reason: 'Opens root filesystem permissions' },
  { pattern: /curl.*\|\s*sh/, reason: 'Pipes remote script to shell' },
  { pattern: /wget.*\|\s*sh/, reason: 'Pipes remote script to shell' },
];

const WRITE_WITHOUT_SUDO = [
  />\s*\/etc\//,
  />\s*\/Library\//,
  />\s*\/System\//,
  /tee\s+\/etc\//,
  /tee\s+\/Library\//,
];

export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

export function validateCommand(cmd: string): ValidationResult {
  for (const { pattern, reason } of DANGEROUS_PATTERNS) {
    if (pattern.test(cmd)) {
      return { valid: false, reason };
    }
  }

  for (const pattern of WRITE_WITHOUT_SUDO) {
    if (pattern.test(cmd) && !cmd.trimStart().startsWith('sudo')) {
      return { valid: false, reason: `Writing to system path without sudo: ${cmd.slice(0, 60)}` };
    }
  }

  return { valid: true };
}

export function validateStep(commands: string[]): ValidationResult {
  for (const cmd of commands) {
    const result = validateCommand(cmd);
    if (!result.valid) return result;
  }
  return { valid: true };
}
