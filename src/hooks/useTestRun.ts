import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Node } from 'reactflow';
import type { BlockNodeData, RunStatus } from '../types/blocks';

const STEP_DURATION = 900;

const sortNodesLeftToRight = (nodes: Node<BlockNodeData>[]) =>
  [...nodes].sort((a, b) => a.position.x - b.position.x);

export interface UseTestRunResult {
  statusMap: Record<string, RunStatus>;
  isRunning: boolean;
  start: () => void;
  reset: () => void;
}

export const useTestRun = (nodes: Node<BlockNodeData>[]): UseTestRunResult => {
  const [statusMap, setStatusMap] = useState<Record<string, RunStatus>>({});
  const [isRunning, setIsRunning] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const decoratedNodes = useMemo(() => sortNodesLeftToRight(nodes), [nodes]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((timer) => clearTimeout(timer));
    timers.current = [];
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    setIsRunning(false);
    setStatusMap((prev) => {
      const next: Record<string, RunStatus> = {};
      nodes.forEach((node) => {
        next[node.id] = prev[node.id] ?? 'idle';
      });
      return next;
    });
  }, [clearTimers, nodes]);

  useEffect(() => {
    setStatusMap((prev) => {
      const next: Record<string, RunStatus> = {};
      nodes.forEach((node) => {
        next[node.id] = prev[node.id] ?? 'idle';
      });
      return next;
    });
  }, [nodes]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const start = useCallback(() => {
    if (!decoratedNodes.length) {
      return;
    }

    clearTimers();
    setIsRunning(true);
    setStatusMap((prev) => {
      const next: Record<string, RunStatus> = {};
      decoratedNodes.forEach((node) => {
        next[node.id] = 'idle';
      });
      return next;
    });

    decoratedNodes.forEach((node, index) => {
      const startTimer = setTimeout(() => {
        setStatusMap((prev) => ({ ...prev, [node.id]: 'running' }));
      }, STEP_DURATION * index);

      const successTimer = setTimeout(() => {
        setStatusMap((prev) => ({ ...prev, [node.id]: 'success' }));
        if (index === decoratedNodes.length - 1) {
          setIsRunning(false);
        }
      }, STEP_DURATION * index + STEP_DURATION * 0.7);

      timers.current.push(startTimer, successTimer);
    });
  }, [clearTimers, decoratedNodes]);

  return { statusMap, isRunning, start, reset };
};
