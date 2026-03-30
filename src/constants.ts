import type { CategoryInfo, StepCategory } from './types.ts';
import { systemHardeningSteps } from './steps/system-hardening.ts';
import { firewallSteps } from './steps/firewall.ts';
import { dnsSteps } from './steps/dns.ts';
import { privoxySteps } from './steps/privoxy.ts';
import { homebrewSteps } from './steps/homebrew.ts';
import { sshSteps } from './steps/ssh.ts';
import { metadataSteps } from './steps/metadata.ts';
import { privacySteps } from './steps/privacy.ts';
import { encryptionSteps } from './steps/encryption.ts';
import { monitoringSteps } from './steps/monitoring.ts';
import { verificationSteps } from './steps/verification.ts';

export const DANGER_COLORS: Record<string, string> = {
  low: 'green',
  medium: 'yellow',
  high: 'red',
  critical: 'magenta',
};

const categoryMeta: Record<StepCategory, { title: string; description: string }> = {
  'system-hardening': { title: 'System Hardening', description: 'defaults write, umask, hostname' },
  firewall: { title: 'Firewall', description: 'ALF, stealth mode, pf kernel firewall' },
  dns: { title: 'DNS', description: 'Hosts blocklist, DNSCrypt, Dnsmasq' },
  privoxy: { title: 'Privoxy', description: 'Local filtering proxy' },
  homebrew: { title: 'Homebrew', description: 'Analytics, security settings' },
  ssh: { title: 'SSH', description: 'Hardened client/server configuration' },
  metadata: { title: 'Metadata Cleanup', description: 'Clear caches, history, artifacts' },
  privacy: { title: 'Privacy', description: 'Browser hardening' },
  encryption: { title: 'Encryption', description: 'GnuPG setup' },
  monitoring: { title: 'Monitoring', description: 'Audit and monitoring tools' },
  verification: { title: 'Verification', description: 'SIP, FileVault status checks' },
};

const stepsByCategory: Record<StepCategory, typeof systemHardeningSteps> = {
  'system-hardening': systemHardeningSteps,
  firewall: firewallSteps,
  dns: dnsSteps,
  privoxy: privoxySteps,
  homebrew: homebrewSteps,
  ssh: sshSteps,
  metadata: metadataSteps,
  privacy: privacySteps,
  encryption: encryptionSteps,
  monitoring: monitoringSteps,
  verification: verificationSteps,
};

export const categories: CategoryInfo[] = (Object.keys(categoryMeta) as StepCategory[]).map(id => ({
  id,
  ...categoryMeta[id],
  steps: stepsByCategory[id],
}));

export const allSteps = categories.flatMap(c => c.steps);
