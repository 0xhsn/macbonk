import { Box, Text } from 'ink';

export default function ProgressBar({ current, total, label }: { current: number; total: number; label: string }) {
  const pct = Math.round((current / total) * 100);
  const filled = Math.round((current / total) * 20);
  const bar = '█'.repeat(filled) + '░'.repeat(20 - filled);
  return (
    <Box>
      <Text dimColor>[{bar}] {pct}% — Step {current}/{total} in </Text>
      <Text bold>{label}</Text>
    </Box>
  );
}
