import type { HardeningStep } from '../types.ts';

const ALF = 'sudo /usr/libexec/ApplicationFirewall/socketfilterfw';

export const firewallSteps: HardeningStep[] = [
  {
    id: 'fw.enable-alf',
    title: 'Enable Application Layer Firewall',
    description: 'Turn on the built-in application firewall',
    category: 'firewall',
    commands: [`${ALF} --setglobalstate on`],
    dangerLevel: 'low',
    requiresSudo: true,
  },
  {
    id: 'fw.stealth-mode',
    title: 'Enable Stealth Mode',
    description: 'Don\'t respond to ping or connection attempts from closed ports',
    category: 'firewall',
    commands: [`${ALF} --setstealthmode on`],
    dangerLevel: 'low',
    requiresSudo: true,
  },
  {
    id: 'fw.no-auto-signed',
    title: 'Disable auto-allow signed software',
    description: 'Prevent automatically allowing built-in signed software through the firewall',
    category: 'firewall',
    commands: [`${ALF} --setallowsigned off`],
    dangerLevel: 'medium',
    requiresSudo: true,
    warning: 'May require manually allowing system services through the firewall',
  },
  {
    id: 'fw.no-auto-signed-app',
    title: 'Disable auto-allow downloaded signed apps',
    description: 'Prevent automatically allowing downloaded signed apps through the firewall',
    category: 'firewall',
    commands: [`${ALF} --setallowsignedapp off`],
    dangerLevel: 'medium',
    requiresSudo: true,
    warning: 'You will need to manually approve each app that needs network access',
  },
  {
    id: 'fw.restart',
    title: 'Restart firewall process',
    description: 'Apply firewall changes by restarting socketfilterfw',
    category: 'firewall',
    commands: ['sudo pkill -HUP socketfilterfw'],
    dangerLevel: 'low',
    requiresSudo: true,
  },
  {
    id: 'fw.pf-rules',
    title: 'Install pf kernel firewall rules',
    description: 'Install and enable packet filter rules for kernel-level firewall',
    category: 'firewall',
    commands: [
      'sudo cp /etc/pf.conf /etc/pf.conf.bak',
      'echo "anchor \\"user_rules\\"\\nload anchor user_rules from \\"/etc/pf.rules\\"" | sudo tee -a /etc/pf.conf',
      'echo "block in all\\npass out proto tcp from any to any\\npass out proto udp from any to any port { 53, 123 }\\npass on lo0" | sudo tee /etc/pf.rules',
      'sudo pfctl -e -f /etc/pf.conf',
    ],
    dangerLevel: 'high',
    requiresSudo: true,
    warning: 'This modifies kernel-level packet filtering. Misconfiguration can break networking. A backup of pf.conf will be created.',
    backupPaths: ['/etc/pf.conf'],
  },
];
