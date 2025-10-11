import { useCallback, useMemo, useRef, useState } from 'react';
import type { NodeChange } from 'reactflow';
import { applyNodeChanges } from 'reactflow';

import FlowCanvas from './components/FlowCanvas';
import BlockConfigPanel from './components/BlockConfigPanel';
import { useTestRun } from './hooks/useTestRun';
import type { BlockLibraryItem, BlockNode, BlockType } from './types';

import amazonIcon from './assets/amazon.svg';
import aiAgentIcon from './assets/ai-agent.svg';
import gmailIcon from './assets/gmail.svg';
import slackIcon from './assets/slack.svg';

const BLOCK_LIBRARY: Record<BlockType, BlockLibraryItem> = {
  amazon: {
    type: 'amazon',
    title: 'Amazon Dataset',
    description: 'Gather marketplace insights and catalog details.',
    accent: '#ff9900',
    icon: amazonIcon,
    defaultConfig: {
      dataset: 'Customer Reviews',
      marketplace: 'United States',
      notes: 'Summarize key sentiment before passing to the agent.',
    },
  },
  aiAgent: {
    type: 'aiAgent',
    title: 'AI Agent',
    description: 'Orchestrate reasoning and planning with Jarvio AI.',
    accent: '#6b5bff',
    icon: aiAgentIcon,
    defaultConfig: {
      model: 'gpt-4o-mini',
      temperature: '0.4',
      prompt: 'Craft a concise executive summary using the Amazon context.',
    },
  },
  gmail: {
    type: 'gmail',
    title: 'Gmail',
    description: 'Send polished updates directly to your stakeholders.',
    accent: '#ea4335',
    icon: gmailIcon,
    defaultConfig: {
      recipients: 'team@jarvio.ai',
      subject: 'Weekly marketplace pulse',
      body: 'Hi team,\nHere is what we are seeing this week...',
    },
  },
  slack: {
    type: 'slack',
    title: 'Slack',
    description: 'Trigger real-time alerts in the right channel.',
    accent: '#36c5f0',
    icon: slackIcon,
    defaultConfig: {
      channel: '#marketplace-pulse',
      mention: '@here',
      message: 'Fresh insights from Amazon are ready to review.',
    },
  },
};

const DEFAULT_SEQUENCE: BlockType[] = ['amazon', 'aiAgent', 'gmail', 'slack'];

const createBlockNode = (type: BlockType, index: number, idCounter: number): BlockNode => {
  const block = BLOCK_LIBRARY[type];
  return {
    id: `${type}-${idCounter}`,
    type: 'block',
    position: { x: 160 + index * 260, y: 180 },
    data: {
      blockType: type,
      title: block.title,
      description: block.description,
      config: { ...block.defaultConfig },
    },
  };
};

const App = () => {
  const idCounter = useRef(0);
  const [nodes, setNodes] = useState<BlockNode[]>(() => {
    return DEFAULT_SEQUENCE.map((type, index) => {
      const node = createBlockNode(type, index, idCounter.current);
      idCounter.current += 1;
      return node;
    });
  });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    () => (nodes.length ? nodes[0].id : null),
  );

  const { statusMap, isRunning, run, reset } = useTestRun(nodes);

  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((previous) => applyNodeChanges(changes, previous));
  }, []);

  const handleCreateNode = useCallback((type: BlockType) => {
    setNodes((previous) => {
      const nextIndex = previous.length;
      const node = createBlockNode(type, nextIndex, idCounter.current);
      idCounter.current += 1;
      setSelectedNodeId(node.id);
      return [...previous, node];
    });
    reset();
  }, [reset]);

  const handleDeleteNode = useCallback((id: string) => {
    setNodes((previous) => {
      const filtered = previous.filter((node) => node.id !== id);
      setSelectedNodeId((prev) => {
        if (prev && prev !== id) {
          return filtered.some((node) => node.id === prev) ? prev : filtered[0]?.id ?? null;
        }
        return filtered[0]?.id ?? null;
      });
      return filtered;
    });
    reset();
  }, [reset]);

  const handleSelectNode = useCallback((id: string | null) => {
    setSelectedNodeId(id);
  }, []);

  const handleUpdateConfig = useCallback((nodeId: string, config: Record<string, string>) => {
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
    <div className="app-shell">
      <FlowCanvas
        nodes={nodes}
        library={BLOCK_LIBRARY}
        onNodesChange={handleNodesChange}
        onCreateNode={handleCreateNode}
        onDeleteNode={handleDeleteNode}
        onSelectNode={handleSelectNode}
        selectedNodeId={selectedNodeId}
        statusMap={statusMap}
        isRunning={isRunning}
        onRun={handleRun}
        onReset={handleReset}
      />
      <BlockConfigPanel
        node={selectedNode}
        library={BLOCK_LIBRARY}
        onUpdateConfig={handleUpdateConfig}
      />
    </div>
  );
};

export default App;
