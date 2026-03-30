import { Text } from 'ink';
import type { DangerLevel } from '../types.ts';

export default function DangerBadge({ level }: { level: DangerLevel }) {
  if (level === 'low') return null;
  const isHigh = level === 'high' || level === 'critical';
  return <Text color={isHigh ? 'red' : undefined} dimColor={!isHigh}>[{level.toUpperCase()}]</Text>;
}
