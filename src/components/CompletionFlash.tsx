import { useState, useEffect } from 'react';
import { Text } from 'ink';
import type { StepResult } from '../types.ts';

const ICONS: Record<StepResult, string> = { applied: '✓', skipped: '–', failed: '✗' };
const FLASH_MS = 300;

export default function CompletionFlash({ result, title, durationMs }: { result: StepResult; title: string; durationMs: number }) {
  const [flash, setFlash] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setFlash(false), FLASH_MS);
    return () => clearTimeout(id);
  }, []);

  const isFail = result === 'failed';
  const isSkip = result === 'skipped';

  return (
    <Text
      color={isFail ? 'red' : undefined}
      dimColor={isSkip && !flash}
      bold={flash && !isSkip}
    >
      {ICONS[result]} {title}{durationMs > 0 ? ` (${durationMs}ms)` : ''}
    </Text>
  );
}
