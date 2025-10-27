export const BLOCK_LIBRARY = {
  amazon: {
    type: 'amazon',
    title: 'Amazon Dataset',
    description: 'Gather marketplace insights and catalog details.',
    accent: '#ff9900',
    icon: './assets/amazon.svg',
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
    icon: './assets/ai-agent.svg',
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
    icon: './assets/gmail.svg',
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
    icon: './assets/slack.svg',
    defaultConfig: {
      channel: '#marketplace-pulse',
      mention: '@here',
      message: 'Fresh insights from Amazon are ready to review.',
    },
  },
};

export const DEFAULT_SEQUENCE = ['amazon', 'aiAgent', 'gmail', 'slack'];

export const CONFIG_SCHEMAS = {
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

export const createBlockNode = (type, index, idCounter) => {
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
