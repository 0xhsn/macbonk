import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { Box, Text, Static, useInput } from 'ink';
import { getSystemInfo } from '../utils/platform-check.ts';
import { allSteps, categories } from '../constants.ts';
import DryRunBadge from './DryRunBadge.tsx';

const VERSION = '0.1.0';

const DOGE = readFileSync(join(dirname(new URL(import.meta.url).pathname), '..', 'art.txt'), 'utf-8').trimEnd().split('\n');

function visualWidth(str: string): number {
  let w = 0;
  for (const ch of str) {
    const code = ch.codePointAt(0)!;
    if (
      (code >= 0x1100 && code <= 0x115F) ||
      (code >= 0x2E80 && code <= 0x303E) ||
      (code >= 0x3040 && code <= 0x33BF) ||
      (code >= 0x3400 && code <= 0x4DBF) ||
      (code >= 0x4E00 && code <= 0x9FFF) ||
      (code >= 0xF900 && code <= 0xFAFF) ||
      (code >= 0xFE30 && code <= 0xFE6F) ||
      (code >= 0xFF00 && code <= 0xFF60) ||
      (code >= 0xFFE0 && code <= 0xFFE6) ||
      (code >= 0x3000 && code <= 0x303F)
    ) {
      w += 2;
    } else {
      w += 1;
    }
  }
  return w;
}

interface Props {
  dryRun: boolean;
  yolo: boolean;
  onContinue: () => void;
}

export default function Welcome({ dryRun, yolo, onContinue }: Props) {
  useInput((_input, key) => {
    if (key.return) onContinue();
  });

  const info = getSystemInfo();
  const stepCount = allSteps.length;
  const catCount = categories.length;
  const sudoCount = allSteps.filter(s => s.requiresSudo).length;

  const rightLines = [
    { text: 'macbonk', bold: true },
    { text: `v${VERSION}`, dim: true },
    { text: '' },
    ...info.map(line => ({ text: line, dim: true })),
    { text: '' },
    { text: `${stepCount} steps · ${catCount} categories · ${sudoCount} require sudo` },
  ];

  const maxLeft = Math.max(...DOGE.map(visualWidth));
  const gap = 4;

  return (
    <Box flexDirection="column">
      <Static items={['banner']}>
        {() => (
          <Box key="banner" flexDirection="column" marginTop={1}>
            {DOGE.map((line, i) => {
              const right = rightLines[i];
              const pad = ' '.repeat(Math.max(0, maxLeft - visualWidth(line) + gap));
              return (
                <Box key={i}>
                  <Text color="#F5A623">{line}</Text>
                  <Text>{pad}</Text>
                  {right && <Text bold={right.bold} dimColor={right.dim}>{right.text}</Text>}
                </Box>
              );
            })}
            {rightLines.slice(DOGE.length).map((right, i) => (
              <Box key={`r-${i}`}>
                <Text>{' '.repeat(maxLeft + gap)}</Text>
                <Text bold={right.bold} dimColor={right.dim}>{right.text}</Text>
              </Box>
            ))}

            {dryRun && (
              <Box marginTop={1} marginLeft={1}><DryRunBadge /></Box>
            )}
            {yolo && (
              <Box marginTop={1} marginLeft={1} flexDirection="column">
                <Text color="red" bold>[YOLO]</Text>
                <Text color="red">⚠ All steps will run without prompting</Text>
              </Box>
            )}

            <Box marginLeft={1} marginTop={1} flexDirection="column">
              <Text>This automation script operationalizes a curated set of hardening</Text>
              <Text>techniques for macOS security and privacy. The guide is targeted to</Text>
              <Text>power users who wish to adopt enterprise-standard security, but is</Text>
              <Text>also suitable for novice users with an interest in improving their</Text>
              <Text>privacy and security on a Mac.</Text>
              <Text>https://github.com/drduh/macos-security-and-privacy-guide</Text>
            </Box>
          </Box>
        )}
      </Static>
    </Box>
  );
}
