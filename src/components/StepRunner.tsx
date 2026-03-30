import { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import Spinner from 'ink-spinner';
import type { HardeningStep, StepOutcome } from '../types.ts';
import { executeStep } from '../executor/executor.ts';
import DangerBadge from './DangerBadge.tsx';
import SudoBadge from './SudoBadge.tsx';
import DryRunBadge from './DryRunBadge.tsx';
import CommandPreview from './CommandPreview.tsx';
import ErrorDisplay from './ErrorDisplay.tsx';

type Phase = 'prompt' | 'executing' | 'done';

interface Props {
  step: HardeningStep;
  dryRun: boolean;
  yolo: boolean;
  onOutcome: (outcome: StepOutcome) => void;
}

export default function StepRunner({ step, dryRun, yolo, onOutcome }: Props) {
  const [phase, setPhase] = useState<Phase>(yolo ? 'executing' : 'prompt');
  const [showInfo, setShowInfo] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (phase !== 'executing') return;
    let cancelled = false;
    executeStep(step, dryRun).then(result => {
      if (cancelled) return;
      if (!result.success) setError(result.stderr);
      setPhase('done');
      onOutcome({
        step,
        result: result.success ? 'applied' : 'failed',
        error: result.success ? undefined : result.stderr,
        durationMs: result.durationMs,
      });
    });
    return () => { cancelled = true; };
  }, [phase]);

  useInput((input, _key) => {
    if (phase !== 'prompt') return;
    if (input === 'a' || input === 'y') setPhase('executing');
    if (input === 's' || input === 'n') onOutcome({ step, result: 'skipped', durationMs: 0 });
    if (input === 'i') setShowInfo(s => !s);
    if (input === 'q') {
      onOutcome({ step, result: 'skipped', durationMs: 0 });
      process.exit(0);
    }
  }, { isActive: !yolo });

  return (
    <Box flexDirection="column" marginTop={1}>
      <Box gap={1}>
        <DangerBadge level={step.dangerLevel} />
        {step.requiresSudo && <SudoBadge />}
        {dryRun && <DryRunBadge />}
        <Text bold> {step.title}</Text>
      </Box>
      <Box marginLeft={2}>
        <Text dimColor>{step.description}</Text>
      </Box>
      {step.warning && (
        <Box marginLeft={2}>
          <Text color="red">⚠ {step.warning}</Text>
        </Box>
      )}
      {(showInfo || yolo) && <CommandPreview commands={step.commands} />}
      {phase === 'prompt' && (
        <Box marginTop={1} marginLeft={2}>
          <Text dimColor>[a]pply  [s]kip  [i]nfo  [q]uit</Text>
        </Box>
      )}
      {phase === 'executing' && (
        <Box marginLeft={2} gap={1}>
          <Spinner type="dots" />
          <Text dimColor>Executing...</Text>
        </Box>
      )}
      {error && <ErrorDisplay error={error} />}
    </Box>
  );
}
