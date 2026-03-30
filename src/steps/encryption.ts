import type { HardeningStep } from '../types.ts';

export const encryptionSteps: HardeningStep[] = [
  {
    id: 'enc.install-gnupg',
    title: 'Install GnuPG',
    description: 'Install GNU Privacy Guard for encryption and signing',
    category: 'encryption',
    commands: ['brew install gnupg'],
    dangerLevel: 'low',
    requiresSudo: false,
  },
  {
    id: 'enc.gpg-conf',
    title: 'Install hardened gpg.conf',
    description: 'Apply security-focused GnuPG configuration from drduh/config',
    category: 'encryption',
    commands: ['mkdir -p ~/.gnupg', 'curl -sL https://raw.githubusercontent.com/drduh/config/main/gpg.conf -o ~/.gnupg/gpg.conf'],
    dangerLevel: 'low',
    requiresSudo: false,
    warning: 'Overwrites existing ~/.gnupg/gpg.conf',
  },
];
