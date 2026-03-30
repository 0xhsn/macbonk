import { Box, Text } from 'ink';

export default function ErrorDisplay({ error }: { error: string }) {
  return (
    <Box marginLeft={2}>
      <Text color="red">✗ {error.trim().split('\n')[0]}</Text>
    </Box>
  );
}
