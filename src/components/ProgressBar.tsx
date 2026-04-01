import { Box, Text } from 'ink';

const BLOCKS = [' ', '▏', '▎', '▍', '▌', '▋', '▊', '▉', '█'];
const SUBTLE = '#505050';

export default function ProgressBar({ current, total, label }: { current: number; total: number; label: string }) {
  const pct = Math.round((current / total) * 100);
  const width = 20;
  const fill = (current / total) * width;
  const full = Math.floor(fill);
  const partial = Math.round((fill - full) * 8);
  const bar = '█'.repeat(full) + (full < width ? BLOCKS[partial]! : '') + ' '.repeat(Math.max(0, width - full - 1));
  return (
    <Box>
      <Text color={SUBTLE}>  [{bar}] {pct}%</Text>
      <Text dimColor> · Step {current}/{total} in </Text>
      <Text bold>{label}</Text>
    </Box>
  );
}
