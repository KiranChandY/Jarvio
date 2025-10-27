import React, { memo, useCallback, useMemo } from 'https://esm.sh/react@18?bundle';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  Handle,
  Position,
  useReactFlow,
} from 'https://esm.sh/reactflow@11?bundle';

import { STATUS_LABELS } from './use-test-run.js';

const createEdgesFromNodes = (nodes) => {
  const ordered = [...nodes].sort((a, b) => a.position.x - b.position.x);
  return ordered.slice(0, -1).map((node, index) => ({
    id: `edge-${node.id}-${ordered[index + 1].id}`,
    source: node.id,
    target: ordered[index + 1].id,
  }));
};

const STATUS_TONE = {
  idle: '#94a3c8',
  running: '#6b5bff',
  success: '#2db87c',
};

const BlockNodeCard = memo((props) => {
  const { data, selected, id, library, status, onDelete } = props;
  const block = library[data.blockType];
  const statusLabel = STATUS_LABELS[status] ?? STATUS_LABELS.idle;
  const accent = block.accent;

  const configEntries = Object.entries(data.config || {});

  return React.createElement(
    'div',
    {
      className: `block-node ${selected ? 'block-node--selected' : ''}`,
      style: {
        borderColor: selected ? accent : '#e1e6f2',
        boxShadow: selected ? `0 18px 40px -24px ${accent}` : 'none',
      },
    },
    React.createElement(Handle, { type: 'target', position: Position.Left }),
    React.createElement(Handle, { type: 'source', position: Position.Right }),
    React.createElement(
      'div',
      { className: 'block-node__header' },
      React.createElement(
        'span',
        { className: 'block-node__icon', style: { backgroundColor: `${accent}1a` } },
        React.createElement('img', { src: block.icon, alt: '' }),
      ),
      React.createElement(
        'div',
        null,
        React.createElement('h3', null, data.title),
        React.createElement('p', null, block.description),
      ),
    ),
    React.createElement(
      'dl',
      { className: 'block-node__config' },
      configEntries.map(([key, value]) =>
        React.createElement(
          'div',
          { key: key, className: 'block-node__config-row' },
          React.createElement('dt', null, key),
          React.createElement('dd', { title: value }, value),
        ),
      ),
    ),
    React.createElement(
      'div',
      { className: 'block-node__footer' },
      React.createElement(
        'span',
        { className: 'block-node__status', style: { color: STATUS_TONE[status] } },
        React.createElement('span', {
          className: 'block-node__status-dot',
          style: { backgroundColor: STATUS_TONE[status] },
        }),
        statusLabel,
      ),
      React.createElement(
        'button',
        {
          type: 'button',
          className: 'block-node__delete',
          onClick: (event) => {
            event.stopPropagation();
            onDelete(id);
          },
        },
        'Remove',
      ),
    ),
  );
});

BlockNodeCard.displayName = 'BlockNodeCard';

const FlowCanvasInner = (props) => {
  const {
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
  } = props;

  const reactFlowInstance = useReactFlow();
  const edges = useMemo(() => createEdgesFromNodes(nodes), [nodes]);

  const nodeTypes = useMemo(
    () => ({
      block: (nodeProps) =>
        React.createElement(BlockNodeCard, {
          ...nodeProps,
          selected: nodeProps.id === selectedNodeId,
          library,
          status: statusMap[nodeProps.id] ?? 'idle',
          onDelete: onDeleteNode,
        }),
    }),
    [library, onDeleteNode, selectedNodeId, statusMap],
  );

  const handleRun = useCallback(() => {
    onRun();
    requestAnimationFrame(() => {
      reactFlowInstance.fitView({ padding: 0.2 });
    });
  }, [onRun, reactFlowInstance]);

  return React.createElement(
    'div',
    { className: 'flow-shell' },
    React.createElement(
      'header',
      { className: 'flow-toolbar' },
      React.createElement(
        'div',
        { className: 'flow-toolbar__group' },
        React.createElement('h1', { className: 'flow-toolbar__title' }, 'Jarvio Automation Journey'),
        React.createElement(
          'p',
          { className: 'flow-toolbar__subtitle' },
          'Drag, configure, and preview how customer insights travel through each block.',
        ),
      ),
      React.createElement(
        'div',
        { className: 'flow-toolbar__controls' },
        Object.values(library).map((item) =>
          React.createElement(
            'button',
            {
              key: item.type,
              type: 'button',
              className: 'flow-toolbar__button',
              onClick: () => onCreateNode(item.type),
              disabled: isRunning,
            },
            React.createElement(
              'span',
              { className: 'flow-toolbar__icon' },
              React.createElement('img', { src: item.icon, alt: '' }),
            ),
            `Add ${item.title}`,
          ),
        ),
        React.createElement(
          'button',
          {
            type: 'button',
            className: 'flow-toolbar__button flow-toolbar__button--primary',
            onClick: handleRun,
            disabled: !nodes.length || isRunning,
          },
          'Run test',
        ),
        React.createElement(
          'button',
          {
            type: 'button',
            className: 'flow-toolbar__button',
            onClick: onReset,
            disabled: isRunning,
          },
          'Reset',
        ),
      ),
    ),
    React.createElement(
      'div',
      { className: 'flow-canvas' },
      React.createElement(
        ReactFlow,
        {
          nodes,
          edges,
          nodeTypes,
          onNodesChange,
          onNodeClick: (_, node) => onSelectNode(node.id),
          onPaneClick: () => onSelectNode(null),
          fitView: true,
          panOnScroll: true,
          panOnDrag: [1, 2],
          selectionOnDrag: true,
        },
        React.createElement(MiniMap, { className: 'flow-minimap' }),
        React.createElement(Controls, null),
        React.createElement(Background, { gap: 24, color: '#dce1f2' }),
      ),
    ),
  );
};

const FlowCanvas = (props) =>
  React.createElement(ReactFlowProvider, null, React.createElement(FlowCanvasInner, { ...props }));

export default FlowCanvas;
