import type { HardeningStep } from '../types.ts';

export const privacySteps: HardeningStep[] = [
  {
    id: 'privacy.firefox-userjs',
    title: 'Install hardened Firefox user.js',
    description: 'Apply privacy-focused Firefox preferences from drduh/config',
    category: 'privacy',
    commands: [
      'find ~/Library/Application\\ Support/Firefox/Profiles -maxdepth 1 -name "*.default-release" -exec curl -sL https://raw.githubusercontent.com/drduh/config/main/firefox.user.js -o {}/user.js \\;',
    ],
    dangerLevel: 'medium',
    requiresSudo: false,
    warning: 'Overwrites existing Firefox user.js in default profile',
  },
];
