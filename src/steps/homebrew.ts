import type { HardeningStep } from '../types.ts';

export const homebrewSteps: HardeningStep[] = [
  {
    id: 'brew.no-analytics',
    title: 'Disable Homebrew analytics',
    description: 'Opt out of Homebrew anonymous usage analytics',
    category: 'homebrew',
    commands: ['brew analytics off'],
    dangerLevel: 'low',
    requiresSudo: false,
  },
  {
    id: 'brew.no-insecure-redirect',
    title: 'Set HOMEBREW_NO_INSECURE_REDIRECT',
    description: 'Prevent Homebrew from following insecure redirects',
    category: 'homebrew',
    commands: [
      'echo \'export HOMEBREW_NO_INSECURE_REDIRECT=1\' >> ~/.zshrc',
      'echo \'export HOMEBREW_NO_ANALYTICS=1\' >> ~/.zshrc',
    ],
    dangerLevel: 'low',
    requiresSudo: false,
    warning: 'Appends to ~/.zshrc — check for duplicates if running multiple times',
  },
];
