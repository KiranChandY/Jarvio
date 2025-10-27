import React, { useCallback, useMemo, useRef, useState } from 'https://esm.sh/react@18?bundle';
import { createRoot } from 'https://esm.sh/react-dom@18/client?bundle';
import { applyNodeChanges } from 'https://esm.sh/reactflow@11?bundle';

import FlowCanvas from './flow-canvas.js';
import BlockConfigPanel from './block-config-panel.js';
import { useTestRun } from './use-test-run.js';
import { BLOCK_LIBRARY, DEFAULT_SEQUENCE, createBlockNode } from './library.js';

const App = () => {
  const idCounter = useRef(0);
  const [nodes, setNodes] = useState(() => {
    return DEFAULT_SEQUENCE.map((type, index) => {
      const node = createBlockNode(type, index, idCounter.current);
      idCounter.current += 1;
      return node;
    });
  });
  const [selectedNodeId, setSelectedNodeId] = useState(() => (nodes.length ? nodes[0].id : null));

  const { statusMap, isRunning, run, reset } = useTestRun(nodes);

  const handleNodesChange = useCallback((changes) => {
    setNodes((previous) => applyNodeChanges(changes, previous));
  }, []);

  const handleCreateNode = useCallback((type) => {
    setNodes((previous) => {
      const nextIndex = previous.length;
      const node = createBlockNode(type, nextIndex, idCounter.current);
      idCounter.current += 1;
      setSelectedNodeId(node.id);
      return [...previous, node];
    });
    reset();
  }, [reset]);

  const handleDeleteNode = useCallback((id) => {
    setNodes((previous) => {
      const filtered = previous.filter((node) => node.id !== id);
      setSelectedNodeId((prev) => {
        if (prev && prev !== id) {
          return filtered.some((node) => node.id === prev) ? prev : (filtered[0]?.id ?? null);
        }
        return filtered[0]?.id ?? null;
      });
      return filtered;
    });
    reset();
  }, [reset]);

  const handleSelectNode = useCallback((id) => {
    setSelectedNodeId(id);
  }, []);

  const handleUpdateConfig = useCallback((nodeId, config) => {
    setNodes((previous) =>
      previous.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                config,
              },
            }
          : node,
      ),
    );
    reset();
  }, [reset]);

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  );

  const handleRun = useCallback(() => {
    run();
  }, [run]);

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  return (
    React.createElement(
      'div',
      { className: 'app-shell' },
      React.createElement(FlowCanvas, {
        nodes,
        library: BLOCK_LIBRARY,
        onNodesChange: handleNodesChange,
        onCreateNode: handleCreateNode,
        onDeleteNode: handleDeleteNode,
        onSelectNode: handleSelectNode,
        selectedNodeId,
        statusMap,
        isRunning,
        onRun: handleRun,
        onReset: handleReset,
      }),
      React.createElement(BlockConfigPanel, {
        node: selectedNode,
        library: BLOCK_LIBRARY,
        onUpdateConfig: handleUpdateConfig,
      }),
    )
  );
};

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(React.createElement(App));
