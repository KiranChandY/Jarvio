import { memo } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import clsx from 'clsx';
import { BLOCK_LIBRARY, BlockNodeData, RunStatus } from '../../types/blocks';
import './BlockNode.css';

const STATUS_LABELS: Record<RunStatus, string> = {
  idle: 'Idle',
  running: 'Running',
  success: 'Success',
};

const BlockNode = ({ id, data }: NodeProps<BlockNodeData>) => {
  const block = BLOCK_LIBRARY[data.blockType];
  const status = data.status ?? 'idle';

  return (
    <article
      className={clsx('block-node', `block-node--${status}`, data.isSelected && 'block-node--selected')}
      tabIndex={0}
      aria-label={`${block.title} block, status ${STATUS_LABELS[status]}`}
    >
      <Handle type="target" position={Position.Left} className="block-node__handle" />
      <Handle type="source" position={Position.Right} className="block-node__handle" />
      <header className="block-node__header">
        <span className="block-node__badge" style={{ backgroundColor: block.accent }}>
          <img src={block.icon} alt="" />
        </span>
        <div className="block-node__heading">
          <h2>{block.title}</h2>
          <p>{data.description}</p>
        </div>
        <span className={clsx('block-node__status', `block-node__status--${status}`)}>
          {STATUS_LABELS[status]}
        </span>
      </header>
      <dl className="block-node__config">
        {Object.entries(data.config).map(([key, value]) => (
          <div key={key} className="block-node__config-row">
            <dt>{key}</dt>
            <dd>{String(value)}</dd>
          </div>
        ))}
      </dl>
      <footer className="block-node__footer">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            data.onDelete?.(id);
          }}
          className="block-node__delete"
        >
          Remove
        </button>
      </footer>
    </article>
  );
};

export default memo(BlockNode);
