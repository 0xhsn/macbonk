import type { HardeningStep } from '../types.ts';

export const privoxySteps: HardeningStep[] = [
  {
    id: 'priv.install',
    title: 'Install Privoxy',
    description: 'Non-caching web proxy with advanced filtering',
    category: 'privoxy',
    commands: ['brew install privoxy'],
    dangerLevel: 'low',
    requiresSudo: false,
  },
  {
    id: 'priv.start',
    title: 'Start Privoxy service',
    description: 'Start Privoxy as a background service',
    category: 'privoxy',
    commands: ['brew services start privoxy'],
    dangerLevel: 'low',
    requiresSudo: false,
  },
  {
    id: 'priv.http-proxy',
    title: 'Set system HTTP proxy to Privoxy',
    description: 'Route HTTP traffic through Privoxy at 127.0.0.1:8118',
    category: 'privoxy',
    commands: ['sudo networksetup -setwebproxy "Wi-Fi" 127.0.0.1 8118'],
    dangerLevel: 'high',
    requiresSudo: true,
    warning: 'All HTTP traffic will route through Privoxy. Ensure it is running.',
  },
  {
    id: 'priv.https-proxy',
    title: 'Set system HTTPS proxy to Privoxy',
    description: 'Route HTTPS traffic through Privoxy at 127.0.0.1:8118',
    category: 'privoxy',
    commands: ['sudo networksetup -setsecurewebproxy "Wi-Fi" 127.0.0.1 8118'],
    dangerLevel: 'high',
    requiresSudo: true,
    warning: 'All HTTPS traffic will route through Privoxy. Ensure it is running.',
  },
];
