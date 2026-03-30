import meow from 'meow';
import { render } from 'ink';
import { assertMacOS } from './utils/platform-check.ts';
import { categories, allSteps } from './constants.ts';
import App from './app.tsx';

const cli = meow(`
  Usage
    $ macbonk [options]

  Options
    --yolo        Run everything without prompting
    --dry-run     Show what would be executed without running anything
    --category    Run only a specific category
    --list        List all categories and steps, then exit

  Examples
    $ macbonk
    $ macbonk --dry-run
    $ macbonk --yolo
    $ macbonk --yolo --dry-run
    $ macbonk --category firewall
`, {
  importMeta: import.meta,
  flags: {
    yolo: { type: 'boolean', default: false },
    dryRun: { type: 'boolean', default: false },
    category: { type: 'string' },
    list: { type: 'boolean', default: false },
  },
});

assertMacOS();

if (cli.flags.list) {
  for (const cat of categories) {
    console.log(`\n${cat.title} (${cat.steps.length} steps)`);
    console.log('─'.repeat(40));
    for (const step of cat.steps) {
      const badges = [
        step.dangerLevel !== 'low' ? step.dangerLevel.toUpperCase() : '',
        step.requiresSudo ? 'sudo' : '',
      ].filter(Boolean).join(' ');
      console.log(`  ${step.title}${badges ? ` [${badges}]` : ''}`);
    }
  }
  console.log(`\nTotal: ${allSteps.length} steps across ${categories.length} categories`);
  process.exit(0);
}

if (cli.flags.category) {
  const valid = categories.find(c => c.id === cli.flags.category);
  if (!valid) {
    console.error(`Unknown category: ${cli.flags.category}`);
    console.error(`Valid categories: ${categories.map(c => c.id).join(', ')}`);
    process.exit(1);
  }
}

const options = cli.flags.yolo ? { stdin: process.stdin } : {};
render(<App dryRun={cli.flags.dryRun} yolo={cli.flags.yolo} filterCategory={cli.flags.category} />, options);
