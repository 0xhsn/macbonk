import { useState, useEffect } from 'react';
import { Text } from 'ink';

const CHARS = ['·', '✢', '✳', '✶', '✻', '✽'];
const FRAMES = [...CHARS, ...[...CHARS].reverse()];
const FRAME_MS = 120;
const STALL_START = 5_000;
const STALL_FULL = 12_000;

interface RGB { r: number; g: number; b: number }
const BASE: RGB = { r: 150, g: 150, b: 150 };
const RED: RGB = { r: 171, g: 43, b: 63 };

function lerp(a: RGB, b: RGB, t: number): string {
  const r = Math.round(a.r + (b.r - a.r) * t);
  const g = Math.round(a.g + (b.g - a.g) * t);
  const bl = Math.round(a.b + (b.b - a.b) * t);
  return `rgb(${r},${g},${bl})`;
}

export default function SpinnerAnim({ elapsed = 0 }: { elapsed?: number }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setFrame(f => (f + 1) % FRAMES.length), FRAME_MS);
    return () => clearInterval(id);
  }, []);

  const intensity = elapsed > STALL_START
    ? Math.min((elapsed - STALL_START) / (STALL_FULL - STALL_START), 1)
    : 0;
  const color = intensity > 0 ? lerp(BASE, RED, intensity) : undefined;

  return <Text color={color} dimColor={!color}>{FRAMES[frame]}</Text>;
}
