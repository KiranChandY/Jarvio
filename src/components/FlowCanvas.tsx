import { memo, useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  NodeChange,
  NodeProps,
  Position,
  ReactFlowProvider,
  Handle,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';

import type {
  BlockLibraryItem,
  BlockNode,
  BlockNodeData,
  BlockStatus,
  BlockType,
} from '../types';
import { STATUS_LABELS } from '../hooks/useTestRun';

interface FlowCanvasProps {
  nodes: BlockNode[];
  library: Record<BlockType, BlockLibraryItem>;
  onNodesChange: (changes: NodeChange[]) => void;
  onCreateNode: (type: BlockType) => void;
  onDeleteNode: (id: string) => void;
  onSelectNode: (id: string | null) => void;
  selectedNodeId: string | null;
  statusMap: Record<string, BlockStatus>;
  isRunning: boolean;
  onRun: () => void;
  onReset: () => void;
}

const createEdgesFromNodes = (nodes: BlockNode[]) => {
  const ordered = [...nodes].sort((a, b) => a.position.x - b.position.x);
  return ordered.slice(0, -1).map((node, index) => ({
    id: `edge-${node.id}-${ordered[index + 1].id}`,
    source: node.id,
    target: ordered[index + 1].id,
  }));
};

const STATUS_TONE: Record<BlockStatus, string> = {
  idle: '#94a3c8',
  running: '#6b5bff',
  success: '#2db87c',
};

const BlockNodeCard = memo(
  ({
    data,
    selected,
    id,
    library,
    status,
    onDelete,
  }: NodeProps<BlockNodeData> & {
    library: Record<BlockType, BlockLibraryItem>;
    status: BlockStatus;
    onDelete: (id: string) => void;
  }) => {
    const block = library[data.blockType];
    const statusLabel = STATUS_LABELS[status] ?? STATUS_LABELS.idle;
    const accent = block.accent;

    return (
      <div
        className={`block-node ${selected ? 'block-node--selected' : ''}`}
        style={{
          borderColor: selected ? accent : '#e1e6f2',
          boxShadow: selected ? `0 18px 40px -24px ${accent}` : 'none',
        }}
      >
        <Handle type="target" position={Position.Left} />
        <Handle type="source" position={Position.Right} />
        <div className="block-node__header">
          <span className="block-node__icon" style={{ backgroundColor: `${accent}1a` }}>
            <img src={block.icon} alt="" />
          </span>
          <div>
            <h3>{data.title}</h3>
            <p>{block.description}</p>
          </div>
        </div>
        <dl className="block-node__config">
          {Object.entries(data.config).map(([key, value]) => (
            <div key={key} className="block-node__config-row">
              <dt>{key}</dt>
              <dd title={value}>{value}</dd>
            </div>
          ))}
        </dl>
        <div className="block-node__footer">
          <span className="block-node__status" style={{ color: STATUS_TONE[status] }}>
            <span className="block-node__status-dot" style={{ backgroundColor: STATUS_TONE[status] }} />
            {statusLabel}
          </span>
          <button
            type="button"
            className="block-node__delete"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(id);
            }}
          >
            Remove
          </button>
        </div>
      </div>
    );
  },
);

BlockNodeCard.displayName = 'BlockNodeCard';

const FlowCanvasInner = ({
  nodes,
  library,
  onNodesChange,
  onCreateNode,
  onDeleteNode,
  onSelectNode,
  selectedNodeId,
  statusMap,
  isRunning,
  onRun,
  onReset,
}: FlowCanvasProps) => {
  const reactFlowInstance = useReactFlow();

  const edges = useMemo(() => createEdgesFromNodes(nodes), [nodes]);

  const nodeTypes = useMemo(
    () => ({
      block: (props: NodeProps<BlockNodeData>) => (
        <BlockNodeCard
          {...props}
          selected={props.id === selectedNodeId}
          library={library}
          status={statusMap[props.id] ?? 'idle'}
          onDelete={onDeleteNode}
        />
      ),
    }),
    [library, onDeleteNode, selectedNodeId, statusMap],
  );

  const handleRun = useCallback(() => {
    onRun();
    requestAnimationFrame(() => {
      reactFlowInstance.fitView({ padding: 0.2 });
    });
  }, [onRun, reactFlowInstance]);

  return (
    <div className="flow-shell">
      <header className="flow-toolbar">
        <div className="flow-toolbar__group">
          <h1 className="flow-toolbar__title">Jarvio Automation Journey</h1>
          <p className="flow-toolbar__subtitle">
            Drag, configure, and preview how customer insights travel through each block.
          </p>
        </div>
        <div className="flow-toolbar__controls">
          {Object.values(library).map((item) => (
            <button
              key={item.type}
              type="button"
              className="flow-toolbar__button"
              onClick={() => onCreateNode(item.type)}
              disabled={isRunning}
            >
              <span className="flow-toolbar__icon">
                <img src={item.icon} alt="" />
              </span>
              Add {item.title}
            </button>
          ))}
          <button
            type="button"
            className="flow-toolbar__button flow-toolbar__button--primary"
            onClick={handleRun}
            disabled={!nodes.length || isRunning}
          >
            Run test
          </button>
          <button
            type="button"
            className="flow-toolbar__button"
            onClick={onReset}
            disabled={isRunning}
          >
            Reset
          </button>
        </div>
      </header>
      <div className="flow-canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onNodeClick={(_, node) => onSelectNode(node.id)}
          onPaneClick={() => onSelectNode(null)}
          fitView
          panOnScroll
          panOnDrag={[1, 2]}
          selectionOnDrag
        >
          <MiniMap className="flow-minimap" />
          <Controls />
          <Background gap={24} color="#dce1f2" />
        </ReactFlow>
      </div>
    </div>
  );
};

const FlowCanvas = (props: FlowCanvasProps) => (
  <ReactFlowProvider>
    <FlowCanvasInner {...props} />
  </ReactFlowProvider>
);

export default FlowCanvas;
