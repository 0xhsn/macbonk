import { useState, useEffect } from 'react';
import { Text } from 'ink';
import type { StepResult } from '../types.ts';

const ICONS: Record<StepResult, string> = { applied: '✓', skipped: '–', failed: '✗' };
const APPLIED = '#4EBA65';
const SUBTLE = '#505050';
const FLASH_MS = 300;

export default function CompletionFlash({ result, title, durationMs }: { result: StepResult; title: string; durationMs: number }) {
  const [flash, setFlash] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setFlash(false), FLASH_MS);
    return () => clearTimeout(id);
  }, []);

  const isFail = result === 'failed';
  const isSkip = result === 'skipped';
  const isApplied = result === 'applied';

  return (
    <Text
      color={isFail ? 'red' : isApplied && flash ? APPLIED : isSkip ? SUBTLE : undefined}
      dimColor={isSkip && !flash}
      bold={flash && isApplied}
    >
      {ICONS[result]} {title}{durationMs > 0 ? ` ${durationMs}ms` : ''}
    </Text>
  );
}
