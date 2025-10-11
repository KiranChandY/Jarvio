import type { Node } from 'reactflow';

export type BlockType = 'amazon' | 'aiAgent' | 'gmail' | 'slack';

export type BlockStatus = 'idle' | 'running' | 'success';

export type BlockConfig = Record<string, string>;

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
}

export type BlockNode = Node<BlockNodeData>;
