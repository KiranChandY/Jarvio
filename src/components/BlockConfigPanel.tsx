import { ChangeEvent, Fragment } from 'react';
import type { BlockLibraryItem, BlockNode, BlockType } from '../types';

interface ConfigField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  placeholder?: string;
  options?: string[];
  helperText?: string;
}

const CONFIG_SCHEMAS: Record<BlockType, ConfigField[]> = {
  amazon: [
    {
      name: 'dataset',
      label: 'Dataset',
      type: 'select',
      options: ['Customer Reviews', 'Sales Performance', 'Inventory Health'],
    },
    {
      name: 'marketplace',
      label: 'Marketplace',
      type: 'select',
      options: ['United States', 'United Kingdom', 'Germany', 'Japan'],
    },
    {
      name: 'notes',
      label: 'Pre-processing notes',
      type: 'textarea',
      placeholder: 'Share any prep instructions for the agent...',
    },
  ],
  aiAgent: [
    {
      name: 'model',
      label: 'Model',
      type: 'select',
      options: ['gpt-4o-mini', 'gpt-4.1', 'gpt-3.5-turbo'],
    },
    {
      name: 'temperature',
      label: 'Temperature',
      type: 'select',
      options: ['0.2', '0.4', '0.6', '0.8'],
    },
    {
      name: 'prompt',
      label: 'Prompt',
      type: 'textarea',
      placeholder: 'Describe the task you want this agent to perform...',
    },
  ],
  gmail: [
    {
      name: 'recipients',
      label: 'Recipients',
      type: 'text',
      placeholder: 'team@jarvio.ai',
    },
    {
      name: 'subject',
      label: 'Subject',
      type: 'text',
      placeholder: 'Weekly marketplace pulse',
    },
    {
      name: 'body',
      label: 'Message body',
      type: 'textarea',
      placeholder: 'Hi team, here is what we are seeing this week...',
    },
  ],
  slack: [
    {
      name: 'channel',
      label: 'Channel',
      type: 'text',
      placeholder: '#marketplace-pulse',
    },
    {
      name: 'mention',
      label: 'Mention',
      type: 'select',
      options: ['@here', '@channel', 'None'],
    },
    {
      name: 'message',
      label: 'Message',
      type: 'textarea',
      placeholder: 'Fresh insights from Amazon are ready to review.',
    },
  ],
};

interface BlockConfigPanelProps {
  node: BlockNode | null;
  library: Record<BlockType, BlockLibraryItem>;
  onUpdateConfig: (nodeId: string, config: Record<string, string>) => void;
}

const BlockConfigPanel = ({ node, library, onUpdateConfig }: BlockConfigPanelProps) => {
  if (!node) {
    return (
      <aside className="config-panel config-panel--empty">
        <div>
          <p className="config-panel__empty-title">Select a block to configure it</p>
          <p className="config-panel__empty-body">
            Click a card on the canvas to update its content and see the changes reflected instantly.
          </p>
        </div>
      </aside>
    );
  }

  const block = library[node.data.blockType];
  const fields = CONFIG_SCHEMAS[node.data.blockType];
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    onUpdateConfig(node.id, {
      ...node.data.config,
      [name]: value,
    });
  };

  return (
    <aside className="config-panel">
      <header className="config-panel__header">
        <span className="config-panel__icon" style={{ backgroundColor: `${block.accent}1a` }}>
          <img src={block.icon} alt="" />
        </span>
        <div>
          <p className="config-panel__eyebrow">Block configuration</p>
          <h2 className="config-panel__title">{block.title}</h2>
          <p className="config-panel__description">{block.description}</p>
        </div>
      </header>
      <form className="config-panel__form">
        {fields.map((field) => (
          <Fragment key={field.name}>
            <label htmlFor={`${node.id}-${field.name}`} className="config-panel__label">
              {field.label}
            </label>
            {field.type === 'select' ? (
              <select
                id={`${node.id}-${field.name}`}
                name={field.name}
                value={node.data.config[field.name] ?? ''}
                onChange={handleChange}
                className="config-panel__input"
              >
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                id={`${node.id}-${field.name}`}
                name={field.name}
                value={node.data.config[field.name] ?? ''}
                placeholder={field.placeholder}
                onChange={handleChange}
                className="config-panel__textarea"
                rows={field.name === 'notes' ? 4 : 5}
              />
            ) : (
              <input
                id={`${node.id}-${field.name}`}
                type="text"
                name={field.name}
                value={node.data.config[field.name] ?? ''}
                placeholder={field.placeholder}
                onChange={handleChange}
                className="config-panel__input"
              />
            )}
            {field.helperText ? <p className="config-panel__helper">{field.helperText}</p> : null}
          </Fragment>
        ))}
      </form>
    </aside>
  );
};

export default BlockConfigPanel;
