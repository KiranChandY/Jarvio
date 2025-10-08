export type BlockType = 'amazon' | 'aiAgent' | 'gmail' | 'slack';

export type RunStatus = 'idle' | 'running' | 'success';

export type BlockConfig = Record<string, string | number>;

export interface BlockLibraryItem {
  type: BlockType;
  title: string;
  description: string;
  accent: string;
  icon: string;
  defaultConfig: BlockConfig;
}

export interface BlockNodeData {
  blockType: BlockType;
  title: string;
  description: string;
  config: BlockConfig;
  status?: RunStatus;
  isSelected?: boolean;
  onDelete?: (id: string) => void;
}

export const BLOCK_LIBRARY: Record<BlockType, BlockLibraryItem> = {
  amazon: {
    type: 'amazon',
    title: 'Amazon Dataset',
    description: 'Gather marketplace insights and catalog details.',
    accent: '#ff9900',
    icon: '/amazon.svg',
    defaultConfig: {
      dataset: 'Customer Reviews',
      marketplace: 'United States',
      notes: 'Summarize key sentiment before passing to the agent.'
    }
  },
  aiAgent: {
    type: 'aiAgent',
    title: 'AI Agent',
    description: 'Orchestrate reasoning and planning with Jarvio AI.',
    accent: '#6b5bff',
    icon: '/ai-agent.svg',
    defaultConfig: {
      model: 'gpt-4o-mini',
      temperature: '0.4',
      prompt: 'Craft a concise executive summary using the Amazon context.'
    }
  },
  gmail: {
    type: 'gmail',
    title: 'Gmail',
    description: 'Send polished updates directly to your stakeholders.',
    accent: '#ea4335',
    icon: '/gmail.svg',
    defaultConfig: {
      recipients: 'team@jarvio.ai',
      subject: 'Weekly marketplace pulse',
      body: 'Hi team,\nHere is what we are seeing this week...'
    }
  },
  slack: {
    type: 'slack',
    title: 'Slack',
    description: 'Trigger real-time alerts in the right channel.',
    accent: '#36c5f0',
    icon: '/slack.svg',
    defaultConfig: {
      channel: '#marketplace-pulse',
      mention: '@here',
      message: 'Fresh insights from Amazon are ready to review.'
    }
  }
};

export const createConfigForBlock = (type: BlockType): BlockConfig => {
  const template = BLOCK_LIBRARY[type];
  return { ...template.defaultConfig };
};
