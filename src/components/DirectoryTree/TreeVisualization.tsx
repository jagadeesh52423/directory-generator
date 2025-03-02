import React, { JSX } from 'react';
import { TreeNode } from '@/types/node';
import { Folder, File } from 'lucide-react';

interface TreeVisualizationProps {
  nodes: TreeNode[];
}

export const TreeVisualization: React.FC<TreeVisualizationProps> = ({ nodes }) => {
  const renderNode = (node: TreeNode, index: number, parentPath: string[] = []): JSX.Element => {
    const isLast = index === nodes.length - 1;
    const currentPath = [...parentPath, node.name];
    const prefix = parentPath.map((_, i) => 
      i === parentPath.length - 1 
        ? (isLast ? '└── ' : '├── ')
        : (parentPath[i + 1] ? '│   ' : '    ')
    ).join('');

    return (
      <div key={node.id} className={`tree-node ${!node.selected ? 'opacity-50' : ''}`}>
        <div className="flex items-start">
          <div className="font-mono whitespace-pre text-gray-500">
            {parentPath.length > 0 ? prefix : ''}
            {parentPath.length === 0 ? (isLast ? '└── ' : '├── ') : ''}
          </div>
          <div className="flex items-center">
            {node.type === 'directory' ? (
              <Folder size={16} className="mr-1 text-blue-500" />
            ) : (
              <File size={16} className="mr-1 text-green-500" />
            )}
            <span className={node.type === 'directory' ? 'font-semibold' : ''}>
              {node.name}
              {node.type === 'directory' ? '/' : ''}
            </span>
            {node.comment && (
              <span className="ml-2 text-gray-500 text-sm italic">
                # {node.comment}
              </span>
            )}
          </div>
        </div>
        
        {node.type === 'directory' && node.children && node.isExpanded && (
          <div className="ml-4">
            {node.children.map((child, i) => 
              renderNode(child, i, currentPath)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="tree-visualization p-3 bg-gray-50 rounded-lg border overflow-auto font-mono text-sm">
      {nodes.length === 0 ? (
        <div className="text-gray-500 italic">No structure defined</div>
      ) : (
        nodes.map((node, index) => renderNode(node, index))
      )}
    </div>
  );
};