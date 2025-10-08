import { useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Edge,
  MiniMap,
  Node,
  OnNodesChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { BLOCK_LIBRARY, BlockNodeData, BlockType } from '../types/blocks';
import BlockNode from './nodes/BlockNode';
import './FlowCanvas.css';

const nodeTypes = { block: BlockNode };

interface FlowCanvasProps {
  nodes: Node<BlockNodeData>[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  onCreateNode: (type: BlockType) => void;
  onDeleteNode: (nodeId: string) => void;
  onRun: () => void;
  isRunning: boolean;
}

const FlowCanvas = ({
  nodes,
  edges,
  onNodesChange,
  selectedNodeId,
  onSelectNode,
  onCreateNode,
  onDeleteNode,
  onRun,
  isRunning,
}: FlowCanvasProps) => {
  const decoratedNodes = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        type: 'block',
        data: {
          ...node.data,
          isSelected: node.id === selectedNodeId,
          onDelete: onDeleteNode,
        },
      })),
    [nodes, onDeleteNode, selectedNodeId]
  );

  return (
    <section className="flow-shell">
      <header className="flow-toolbar" aria-label="Flow actions">
        <div className="flow-toolbar__group">
          <h1 className="flow-toolbar__title">Automation Journey</h1>
          <p className="flow-toolbar__subtitle">
            Drag to reorder and stitch together your Amazon insights pipeline.
          </p>
        </div>
        <div className="flow-toolbar__controls">
          {Object.values(BLOCK_LIBRARY).map((block) => (
            <button
              key={block.type}
              type="button"
              className="flow-toolbar__button"
              onClick={() => onCreateNode(block.type)}
            >
              <span className="flow-toolbar__icon" aria-hidden="true">
                <img src={block.icon} alt="" />
              </span>
              Add {block.title}
            </button>
          ))}
          <button
            type="button"
            className="flow-toolbar__button flow-toolbar__button--primary"
            onClick={onRun}
            disabled={isRunning || !nodes.length}
          >
            {isRunning ? 'Running...' : 'Test Run'}
          </button>
        </div>
      </header>
      <div className="flow-canvas" role="application">
        <ReactFlow
          nodes={decoratedNodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onNodeClick={(_, node) => onSelectNode(node.id)}
          onPaneClick={() => onSelectNode(null)}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.5}
          maxZoom={1.5}
          panOnScroll
          panOnDrag
        >
          <MiniMap pannable zoomable className="flow-minimap" />
          <Controls showInteractive={false} />
          <Background gap={24} color="#dce1ef" />
        </ReactFlow>
      </div>
    </section>
  );
};

export default FlowCanvas;
