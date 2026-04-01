import { Box, Text } from 'ink';
import type { StepOutcome } from '../types.ts';
import { getLogPath } from '../executor/logger.ts';

const SUBTLE = '#505050';
const APPLIED = '#4EBA65';
const ICONS = { applied: '✓', skipped: '–', failed: '✗' } as const;

export default function Summary({ outcomes }: { outcomes: StepOutcome[] }) {
  const counts = { applied: 0, skipped: 0, failed: 0 };
  outcomes.forEach(o => counts[o.result]++);
  const totalMs = outcomes.reduce((s, o) => s + o.durationMs, 0);

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text color={SUBTLE}>  {'─'.repeat(50)}</Text>
      <Text bold>  Summary</Text>
      <Box marginTop={1} marginLeft={2} gap={1}>
        <Text color={APPLIED}>✓ {counts.applied} applied</Text>
        <Text color={SUBTLE}>·</Text>
        <Text dimColor>– {counts.skipped} skipped</Text>
        {counts.failed > 0 && <><Text color={SUBTLE}>·</Text><Text color="red">✗ {counts.failed} failed</Text></>}
      </Box>
      <Box marginTop={1} flexDirection="column">
        {outcomes.map((o, i) => (
          <Box key={i} gap={1} marginLeft={2}>
            <Text color={o.result === 'failed' ? 'red' : o.result === 'applied' ? APPLIED : SUBTLE}>
              {ICONS[o.result]}
            </Text>
            <Text color={o.result === 'failed' ? 'red' : undefined} dimColor={o.result === 'skipped'}>
              {o.step.title}
            </Text>
            {o.durationMs > 0 && <Text color={SUBTLE}>{o.durationMs}ms</Text>}
          </Box>
        ))}
      </Box>
      <Text color={SUBTLE}>  {'─'.repeat(50)}</Text>
      <Box marginLeft={2} gap={1}>
        <Text color={SUBTLE}>{(totalMs / 1000).toFixed(1)}s total</Text>
        <Text color={SUBTLE}>·</Text>
        <Text color={SUBTLE}>{getLogPath()}</Text>
      </Box>
    </Box>
  );
}
