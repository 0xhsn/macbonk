import { useState, useEffect, useRef } from 'react';

export function useElapsed(running: boolean): number {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    if (!running) return;
    startRef.current = Date.now();
    const id = setInterval(() => setElapsed(Date.now() - startRef.current), 100);
    return () => clearInterval(id);
  }, [running]);

  return elapsed;
}

export function formatElapsed(ms: number): string {
  if (ms < 1000) return '';
  const s = Math.floor(ms / 1000);
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m${s % 60}s`;
}
