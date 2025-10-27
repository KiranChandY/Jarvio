import React, { useCallback, useEffect, useMemo, useRef, useState } from 'https://esm.sh/react@18?bundle';

export const STATUS_LABELS = {
  idle: 'Idle',
  running: 'Running',
  success: 'Success',
};

const STATUS_SEQUENCE = ['idle', 'running', 'success'];
const STEP_DURATION = 800;

export function useTestRun(nodes) {
  const [statusMap, setStatusMap] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const timersRef = useRef([]);

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

    const initialStatus = sortedNodes.reduce((acc, node) => {
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
      const next = {};
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
