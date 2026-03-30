import type { HardeningStep } from '../types.ts';

export const verificationSteps: HardeningStep[] = [
  {
    id: 'verify.sip',
    title: 'Check SIP status',
    description: 'Verify System Integrity Protection is enabled',
    category: 'verification',
    commands: ['csrutil status'],
    dangerLevel: 'low',
    requiresSudo: false,
  },
  {
    id: 'verify.filevault',
    title: 'Check FileVault status',
    description: 'Verify FileVault disk encryption is enabled',
    category: 'verification',
    commands: ['fdesetup status'],
    dangerLevel: 'low',
    requiresSudo: false,
  },
];
