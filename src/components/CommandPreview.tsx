import { Box, Text } from 'ink';

export default function CommandPreview({ commands }: { commands: string[] }) {
  return (
    <Box flexDirection="column" marginLeft={2}>
      {commands.map((cmd, i) => (
        <Text key={i} dimColor>$ {cmd}</Text>
      ))}
    </Box>
  );
}
