import type { HardeningStep } from '../types.ts';

export const monitoringSteps: HardeningStep[] = [
  {
    id: 'mon.openbsm-status',
    title: 'Check OpenBSM audit status',
    description: 'Display current audit configuration and status',
    category: 'monitoring',
    commands: ['sudo cat /etc/security/audit_control'],
    dangerLevel: 'low',
    requiresSudo: true,
  },
];
