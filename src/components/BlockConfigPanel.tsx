import { ChangeEvent } from 'react';
import type { Node } from 'reactflow';
import { BLOCK_LIBRARY, BlockNodeData } from '../types/blocks';
import './BlockConfigPanel.css';

interface BlockConfigPanelProps {
  node: Node<BlockNodeData> | null;
  onRequestClose: () => void;
  onConfigChange: (id: string, updates: Record<string, string | number>) => void;
}

const handleTextChange = (
  event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  nodeId: string,
  onConfigChange: BlockConfigPanelProps['onConfigChange']
) => {
  const { name, value } = event.target;
  onConfigChange(nodeId, { [name]: value });
};

const BlockConfigPanel = ({ node, onRequestClose, onConfigChange }: BlockConfigPanelProps) => {
  if (!node) {
    return (
      <aside className="config-panel">
        <div className="config-panel__empty">
          <h2>No block selected</h2>
          <p>Tap any block on the canvas to configure its behaviour.</p>
        </div>
      </aside>
    );
  }

  const block = BLOCK_LIBRARY[node.data.blockType];
  const config = node.data.config;

  return (
    <aside className="config-panel" aria-labelledby="config-heading">
      <header className="config-panel__header">
        <div>
          <p className="config-panel__eyebrow">Settings</p>
          <h2 id="config-heading">{block.title}</h2>
          <p className="config-panel__description">{block.description}</p>
        </div>
        <button type="button" onClick={onRequestClose} className="config-panel__close" aria-label="Close configuration">
          ×
        </button>
      </header>

      <div className="config-panel__content">
        {node.data.blockType === 'amazon' && (
          <form className="config-panel__form" aria-label="Amazon configuration">
            <label className="config-panel__field">
              <span>Dataset</span>
              <select
                name="dataset"
                value={String(config.dataset ?? '')}
                onChange={(event) => handleTextChange(event, node.id, onConfigChange)}
              >
                <option value="Customer Reviews">Customer Reviews</option>
                <option value="Inventory Health">Inventory Health</option>
                <option value="Pricing Trends">Pricing Trends</option>
              </select>
            </label>
            <label className="config-panel__field">
              <span>Marketplace</span>
              <select
                name="marketplace"
                value={String(config.marketplace ?? '')}
                onChange={(event) => handleTextChange(event, node.id, onConfigChange)}
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="European Union">European Union</option>
                <option value="Asia Pacific">Asia Pacific</option>
              </select>
            </label>
            <label className="config-panel__field">
              <span>Notes</span>
              <textarea
                name="notes"
                rows={4}
                value={String(config.notes ?? '')}
                onChange={(event) => handleTextChange(event, node.id, onConfigChange)}
              />
            </label>
          </form>
        )}

        {node.data.blockType === 'aiAgent' && (
          <form className="config-panel__form" aria-label="AI agent configuration">
            <label className="config-panel__field">
              <span>Model</span>
              <select
                name="model"
                value={String(config.model ?? '')}
                onChange={(event) => handleTextChange(event, node.id, onConfigChange)}
              >
                <option value="gpt-4o-mini">GPT-4o mini</option>
                <option value="sonnet-3.5">Claude 3.5 Sonnet</option>
                <option value="jarvio-orchestrator">Jarvio Orchestrator</option>
              </select>
            </label>
            <label className="config-panel__field">
              <span>Temperature</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                name="temperature"
                value={Number(config.temperature ?? 0)}
                onChange={(event) => handleTextChange(event, node.id, onConfigChange)}
              />
              <output className="config-panel__output">{Number(config.temperature ?? 0).toFixed(1)}</output>
            </label>
            <label className="config-panel__field">
              <span>Prompt</span>
              <textarea
                name="prompt"
                rows={5}
                value={String(config.prompt ?? '')}
                onChange={(event) => handleTextChange(event, node.id, onConfigChange)}
              />
            </label>
          </form>
        )}

        {node.data.blockType === 'gmail' && (
          <form className="config-panel__form" aria-label="Gmail configuration">
            <label className="config-panel__field">
              <span>Recipients</span>
              <input
                type="text"
                name="recipients"
                placeholder="you@example.com"
                value={String(config.recipients ?? '')}
                onChange={(event) => handleTextChange(event, node.id, onConfigChange)}
              />
            </label>
            <label className="config-panel__field">
              <span>Subject</span>
              <input
                type="text"
                name="subject"
                value={String(config.subject ?? '')}
                onChange={(event) => handleTextChange(event, node.id, onConfigChange)}
              />
            </label>
            <label className="config-panel__field">
              <span>Email body</span>
              <textarea
                name="body"
                rows={6}
                value={String(config.body ?? '')}
                onChange={(event) => handleTextChange(event, node.id, onConfigChange)}
              />
            </label>
          </form>
        )}

        {node.data.blockType === 'slack' && (
          <form className="config-panel__form" aria-label="Slack configuration">
            <label className="config-panel__field">
              <span>Channel</span>
              <select
                name="channel"
                value={String(config.channel ?? '')}
                onChange={(event) => handleTextChange(event, node.id, onConfigChange)}
              >
                <option value="#marketplace-pulse">#marketplace-pulse</option>
                <option value="#growth">#growth</option>
                <option value="#alerts">#alerts</option>
              </select>
            </label>
            <label className="config-panel__field">
              <span>Mention</span>
              <input
                type="text"
                name="mention"
                value={String(config.mention ?? '')}
                onChange={(event) => handleTextChange(event, node.id, onConfigChange)}
              />
            </label>
            <label className="config-panel__field">
              <span>Message</span>
              <textarea
                name="message"
                rows={5}
                value={String(config.message ?? '')}
                onChange={(event) => handleTextChange(event, node.id, onConfigChange)}
              />
            </label>
          </form>
        )}
      </div>
    </aside>
  );
};

export default BlockConfigPanel;
