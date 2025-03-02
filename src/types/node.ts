export type NodeType = 'file' | 'directory';

export interface TreeNode {
  id: string;
  name: string;
  type: NodeType;
  selected: boolean;
  children?: TreeNode[];
  comment?: string;
  isExpanded?: boolean;
  isEditing?: boolean;
  isNew?: boolean;
  depth?: number;
}

export interface TreeData {
  nodes: TreeNode[];
}