import type { HardeningStep } from '../types.ts';

export const sshSteps: HardeningStep[] = [
  {
    id: 'ssh.client-config',
    title: 'Install hardened SSH client config',
    description: 'Download and install a security-focused SSH client configuration',
    category: 'ssh',
    commands: ['curl -sL https://raw.githubusercontent.com/drduh/config/main/ssh_config -o ~/.ssh/config'],
    dangerLevel: 'medium',
    requiresSudo: false,
    warning: 'Overwrites existing ~/.ssh/config',
  },
  {
    id: 'ssh.enable-sshd',
    title: 'Enable Remote Login (sshd)',
    description: 'Start the SSH server for remote access',
    category: 'ssh',
    commands: ['sudo launchctl load -w /System/Library/LaunchDaemons/ssh.plist'],
    dangerLevel: 'high',
    requiresSudo: true,
    warning: 'Opens your machine to remote SSH connections',
  },
  {
    id: 'ssh.server-config',
    title: 'Install hardened sshd config',
    description: 'Download and install a security-focused SSH server configuration',
    category: 'ssh',
    commands: ['sudo curl -sL https://raw.githubusercontent.com/drduh/config/main/sshd_config -o /etc/ssh/sshd_config'],
    dangerLevel: 'high',
    requiresSudo: true,
    warning: 'Overwrites /etc/ssh/sshd_config — ensure you have an alternative way to access this machine',
  },
];
