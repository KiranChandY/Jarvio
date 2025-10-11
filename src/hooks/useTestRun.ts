import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { BlockNode, BlockStatus } from '../types';

interface UseTestRunResult {
  statusMap: Record<string, BlockStatus>;
  isRunning: boolean;
  run: () => void;
  reset: () => void;
}

const STATUS_SEQUENCE: BlockStatus[] = ['idle', 'running', 'success'];

export const STATUS_LABELS: Record<BlockStatus, string> = {
  idle: 'Idle',
  running: 'Running',
  success: 'Success',
};

const STEP_DURATION = 800;

export function useTestRun(nodes: BlockNode[]): UseTestRunResult {
  const [statusMap, setStatusMap] = useState<Record<string, BlockStatus>>({});
  const [isRunning, setIsRunning] = useState(false);
  const timersRef = useRef<number[]>([]);

  const sortedNodes = useMemo(
    () => [...nodes].sort((a, b) => a.position.x - b.position.x),
    [nodes],
  );

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    setStatusMap({});
    setIsRunning(false);
  }, [clearTimers]);

  const run = useCallback(() => {
    if (!sortedNodes.length) {
      return;
    }

    clearTimers();
    setIsRunning(true);

    const initialStatus = sortedNodes.reduce<Record<string, BlockStatus>>((acc, node) => {
      acc[node.id] = 'idle';
      return acc;
    }, {});
    setStatusMap(initialStatus);

    sortedNodes.forEach((node, index) => {
      STATUS_SEQUENCE.forEach((status, stepIndex) => {
        const timer = window.setTimeout(() => {
          setStatusMap((prev) => ({
            ...prev,
            [node.id]: status,
          }));

          if (index === sortedNodes.length - 1 && status === 'success') {
            setIsRunning(false);
          }
        }, STEP_DURATION * index + (STEP_DURATION / STATUS_SEQUENCE.length) * stepIndex);

        timersRef.current.push(timer);
      });
    });
  }, [clearTimers, sortedNodes]);

  useEffect(() => reset, [reset]);

  useEffect(() => {
    setStatusMap((prev) => {
      const next: Record<string, BlockStatus> = {};
      sortedNodes.forEach((node) => {
        if (prev[node.id]) {
          next[node.id] = prev[node.id];
        }
      });
      return next;
    });
  }, [sortedNodes]);

  return { statusMap, isRunning, run, reset };
}
