import { useCallback, useMemo, useState } from 'react';
import { Edge, Node, OnNodesChange, useNodesState } from 'reactflow';
import FlowCanvas from './components/FlowCanvas';
import BlockConfigPanel from './components/BlockConfigPanel';
import { useTestRun } from './hooks/useTestRun';
import {
  BLOCK_LIBRARY,
  BlockNodeData,
  BlockType,
  createConfigForBlock,
} from './types/blocks';
import './App.css';

const NODE_GAP = 320;

let idCounter = 0;

const createBlockNode = (type: BlockType, xPosition: number): Node<BlockNodeData> => {
  const template = BLOCK_LIBRARY[type];
  return {
    id: `${type}-${++idCounter}`,
    position: { x: xPosition, y: 40 },
    data: {
      blockType: type,
      title: template.title,
      description: template.description,
      config: createConfigForBlock(type),
      status: 'idle',
    },
    type: 'block',
  };
};

const generateEdges = (nodes: Node<BlockNodeData>[]): Edge[] => {
  if (nodes.length < 2) {
    return [];
  }

  const sorted = [...nodes].sort((a, b) => a.position.x - b.position.x);
  const edges: Edge[] = [];

  for (let index = 0; index < sorted.length - 1; index += 1) {
    const current = sorted[index];
    const next = sorted[index + 1];
    edges.push({
      id: `${current.id}-${next.id}`,
      source: current.id,
      target: next.id,
      animated: true,
      style: { stroke: '#6b5bff', strokeWidth: 2 },
    });
  }

  return edges;
};

const initialNodes: Node<BlockNodeData>[] = ['amazon', 'aiAgent', 'gmail', 'slack'].map((type, index) =>
  createBlockNode(type as BlockType, index * NODE_GAP)
);

const App = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<BlockNodeData>(initialNodes);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(initialNodes[0]?.id ?? null);
  const { statusMap, start, isRunning } = useTestRun(nodes);

  const nodesWithStatus = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          status: statusMap[node.id] ?? 'idle',
        },
      })),
    [nodes, statusMap]
  );

  const edges = useMemo(() => generateEdges(nodes), [nodes]);

  const handleCreateNode = useCallback(
    (type: BlockType) => {
      setNodes((current) => {
        const maxX = current.reduce((value, node) => Math.max(value, node.position.x), 0);
        const nextX = current.length === 0 ? 0 : maxX + NODE_GAP;
        const nextNode = createBlockNode(type, nextX);
        return [...current, nextNode];
      });
    },
    [setNodes]
  );

  const handleDeleteNode = useCallback(
    (id: string) => {
      setNodes((current) => current.filter((node) => node.id !== id));
      setSelectedNodeId((current) => (current === id ? null : current));
    },
    [setNodes]
  );

  const handleConfigChange = useCallback(
    (id: string, configUpdates: Record<string, string | number>) => {
      setNodes((current) =>
        current.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  config: {
                    ...node.data.config,
                    ...configUpdates,
                  },
                },
              }
            : node
        )
      );
    },
    [setNodes]
  );

  const handleNodesChange: OnNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
    },
    [onNodesChange]
  );

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId]
  );

  return (
    <div className="app-shell">
      <FlowCanvas
        nodes={nodesWithStatus}
        edges={edges}
        onNodesChange={handleNodesChange}
        selectedNodeId={selectedNodeId}
        onSelectNode={setSelectedNodeId}
        onCreateNode={handleCreateNode}
        onDeleteNode={handleDeleteNode}
        onRun={start}
        isRunning={isRunning}
      />
      <BlockConfigPanel
        node={selectedNode}
        onRequestClose={() => setSelectedNodeId(null)}
        onConfigChange={handleConfigChange}
      />
    </div>
  );
};

export default App;
