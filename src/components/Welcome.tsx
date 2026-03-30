import { Box, Text, useInput } from 'ink';
import { getSystemInfo } from '../utils/platform-check.ts';
import BannerArt from './BannerArt.tsx';
import DryRunBadge from './DryRunBadge.tsx';

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

  return (
    <Box flexDirection="column">
      <BannerArt />
      <Box flexDirection="column" marginTop={1}>
        {info.map((line, i) => (
          <Text key={i} dimColor>  {line}</Text>
        ))}
      </Box>
      <Box gap={1} marginTop={1}>
        {dryRun && <Box marginLeft={2}><DryRunBadge /></Box>}
        {yolo && <Box marginLeft={dryRun ? 0 : 2}><Text color="red" bold>[YOLO]</Text></Box>}
      </Box>
      {yolo && <Text color="red">  ⚠ All steps will execute without prompting</Text>}
    </Box>
  );
}
