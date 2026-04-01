import { Box, Text } from 'ink';

const SUBTLE = '#505050';

export default function CommandPreview({ commands }: { commands: string[] }) {
  return (
    <Box flexDirection="column" marginLeft={2}>
      {commands.map((cmd, i) => (
        <Text key={i} color={SUBTLE}>$ {cmd}</Text>
      ))}
    </Box>
  );
}
