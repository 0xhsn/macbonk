import { Box, Text, Static, useInput } from 'ink';
import { getSystemInfo } from '../utils/platform-check.ts';
import { allSteps, categories } from '../constants.ts';
import DryRunBadge from './DryRunBadge.tsx';

const VERSION = '0.1.0';

const DOGE = [
  '　　 　　/＾>》, -―‐‐＜＾}',
  '　　 　./    /,≠´        ヽ.',
  '　　　/     〃      ／}  丿ハ',
  '　　./      i{l|  ／　ﾉ／ }  }',
  '　 /        瓜   イ＞　´＜ ,\'   ﾉ',
  '  ./        |ﾉﾍ.{､ 　( ﾌ_ノﾉイ',
  '  |         |　／}｀ｽ/￣￣￣￣/',
  ' .|         |(_   つ/macbonk!/',
  ' .￣￣￣￣￣       ＼/＿＿＿＿/￣￣',
];

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

  return (
    <Box flexDirection="column">
      <Static items={['banner']}>
        {() => (
          <Box key="banner" flexDirection="column">
            <Box
              borderStyle="round"
              borderColor="gray"
              flexDirection="row"
              paddingX={1}
              paddingY={1}
            >
              <Box flexDirection="column" marginRight={2}>
                {DOGE.map((line, i) => (
                  <Text key={i} color="#F5A623">{line}</Text>
                ))}
              </Box>

              <Box flexDirection="column" justifyContent="center">
                <Text bold>macbonk</Text>
                <Text dimColor>v{VERSION}</Text>
                <Text>{''}</Text>
                {info.map((line, i) => (
                  <Text key={i} dimColor>{line}</Text>
                ))}
                <Text>{''}</Text>
                <Text>{stepCount} steps · {catCount} categories · {sudoCount} require sudo</Text>
                {dryRun && <DryRunBadge />}
                {yolo && (
                  <Box flexDirection="column">
                    <Text color="red" bold>[YOLO]</Text>
                    <Text color="red">⚠ All steps will run without prompting</Text>
                  </Box>
                )}
              </Box>
            </Box>

            <Box marginLeft={1} marginTop={1} flexDirection="column">
              <Text dimColor>This automation script operationalizes a curated set of hardening</Text>
              <Text dimColor>techniques for macOS security and privacy. The guide is targeted to</Text>
              <Text dimColor>power users who wish to adopt enterprise-standard security, but is</Text>
              <Text dimColor>also suitable for novice users with an interest in improving their</Text>
              <Text dimColor>privacy and security on a Mac.</Text>
              <Text dimColor>https://github.com/drduh/macos-security-and-privacy-guide</Text>
            </Box>
          </Box>
        )}
      </Static>
    </Box>
  );
}
