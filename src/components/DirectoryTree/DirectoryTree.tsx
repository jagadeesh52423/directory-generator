import React from 'react';
import { TreeNode as TreeNodeType } from '@/types/node';
import { TreeNode } from './TreeNode';
import { TreeControls } from './TreeControls';

interface DirectoryTreeProps {
  nodes: TreeNodeType[];
  onToggle: (id: string) => void;
  onSelect: (id: string, selected: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onTypeChange: (id: string) => void;
  onAddRoot: () => void;
  onAddChild: (parentId: string) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export const DirectoryTree: React.FC<DirectoryTreeProps> = ({
  nodes,
  onToggle,
  onSelect,
  onEdit,
  onDelete,
  onTypeChange,
  onAddRoot,
  onAddChild,
  onExpandAll,
  onCollapseAll,
  onSelectAll,
  onDeselectAll,
}) => {
  return (
    <div className="directory-tree border rounded-lg p-4 h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Directory Structure</h2>
      
      <TreeControls
        onAddRoot={onAddRoot}
        onExpandAll={onExpandAll}
        onCollapseAll={onCollapseAll}
        onSelectAll={onSelectAll}
        onDeselectAll={onDeselectAll}
      />
      
      <div className="tree-container mt-4 flex-grow overflow-auto border rounded p-2">
        {nodes.length === 0 ? (
          <div className="text-gray-500 p-4 text-center">
            No structure to display. Paste a directory structure in the input area and click "Parse".
          </div>
        ) : (
          nodes.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              onToggle={onToggle}
              onSelect={onSelect}
              onEdit={onEdit}
              onDelete={onDelete}
              onTypeChange={onTypeChange}
              onAddChild={onAddChild}
            />
          ))
        )}
      </div>
    </div>
  );
};