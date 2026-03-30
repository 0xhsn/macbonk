import { Box, Text } from 'ink';
import type { StepOutcome } from '../types.ts';
import { getLogPath } from '../executor/logger.ts';

const ICONS = { applied: '✓', skipped: '–', failed: '✗' } as const;

export default function Summary({ outcomes }: { outcomes: StepOutcome[] }) {
  const counts = { applied: 0, skipped: 0, failed: 0 };
  outcomes.forEach(o => counts[o.result]++);
  const totalMs = outcomes.reduce((s, o) => s + o.durationMs, 0);

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text bold>{'─'.repeat(50)}</Text>
      <Text bold>Summary</Text>
      <Box marginTop={1} gap={2}>
        <Text>✓ Applied: {counts.applied}</Text>
        <Text dimColor>– Skipped: {counts.skipped}</Text>
        {counts.failed > 0 && <Text color="red">✗ Failed: {counts.failed}</Text>}
      </Box>
      <Box marginTop={1} flexDirection="column">
        {outcomes.map((o, i) => (
          <Box key={i} gap={1}>
            <Text color={o.result === 'failed' ? 'red' : undefined} dimColor={o.result === 'skipped'}>{ICONS[o.result]}</Text>
            <Text color={o.result === 'failed' ? 'red' : undefined} dimColor={o.result === 'skipped'}>{o.step.title}</Text>
            {o.durationMs > 0 && <Text dimColor>({o.durationMs}ms)</Text>}
          </Box>
        ))}
      </Box>
      <Box marginTop={1}>
        <Text dimColor>Total time: {(totalMs / 1000).toFixed(1)}s — Log: {getLogPath()}</Text>
      </Box>
    </Box>
  );
}
