import { Text } from 'ink';
import type { DangerLevel } from '../types.ts';

const COLORS: Record<DangerLevel, string | undefined> = {
  low: undefined,
  medium: '#F5A623',
  high: '#FF6B80',
  critical: '#FF6B80',
};

export default function DangerBadge({ level }: { level: DangerLevel }) {
  if (level === 'low') return null;
  return <Text color={COLORS[level]}>[{level.toUpperCase()}]</Text>;
}
