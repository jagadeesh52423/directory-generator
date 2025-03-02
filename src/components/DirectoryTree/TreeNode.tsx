import React from 'react';
import { TreeNode as TreeNodeType } from '@/types/node';
import { ChevronRight, ChevronDown, Folder, FolderOpen, File, Edit, Trash2, ToggleLeft, ToggleRight, Plus } from 'lucide-react';

interface TreeNodeProps {
  node: TreeNodeType;
  onToggle: (id: string) => void;
  onSelect: (id: string, selected: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onTypeChange: (id: string) => void;
  onAddChild: (parentId: string) => void;
}

export const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  onToggle,
  onSelect,
  onEdit,
  onDelete,
  onTypeChange,
  onAddChild,
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const indent = (node.depth || 0) * 20; // 20px per level

  return (
    <div className="node-container">
      <div 
        className="node-row flex items-center p-1 hover:bg-gray-100 rounded" 
        style={{ marginLeft: `${indent}px` }}
      >
        {/* Expand/Collapse icon for directories */}
        {node.type === 'directory' && (
          <button 
            onClick={() => onToggle(node.id)} 
            className="mr-1 text-gray-500"
          >
            {node.isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        )}
        
        {/* Spacer for files to align with directories */}
        {node.type === 'file' && <div className="w-4 mr-1"></div>}
        
        {/* Checkbox for selection */}
        <input
          type="checkbox"
          checked={node.selected}
          onChange={(e) => onSelect(node.id, e.target.checked)}
          className="mr-2"
        />
        
        {/* Node icon */}
        <span className="mr-2 text-blue-500">
          {node.type === 'directory' 
            ? (node.isExpanded ? <FolderOpen size={16} /> : <Folder size={16} />)
            : <File size={16} />
          }
        </span>
        
        {/* Node name */}
        <span className="node-name flex-grow font-medium">
          {node.name}
        </span>
        
        {/* Comment if any */}
        {node.comment && (
          <span className="comment text-gray-500 mr-2 text-sm italic">
            # {node.comment}
          </span>
        )}
        
        {/* Action buttons */}
        <div className="node-actions flex opacity-0 group-hover:opacity-100">
          <button 
            onClick={() => onTypeChange(node.id)} 
            className="action-button p-1 text-gray-500 hover:text-blue-500"
            title={node.type === 'directory' ? 'Convert to file' : 'Convert to directory'}
          >
            {node.type === 'directory' ? <ToggleLeft size={16} /> : <ToggleRight size={16} />}
          </button>
          <button 
            onClick={() => onEdit(node.id)} 
            className="action-button p-1 text-gray-500 hover:text-blue-500"
            title="Edit node"
          >
            <Edit size={16} />
          </button>
          {node.type === 'directory' && (
            <button 
              onClick={() => onAddChild(node.id)} 
              className="action-button p-1 text-gray-500 hover:text-blue-500"
              title="Add child node"
            >
              <Plus size={16} />
            </button>
          )}
          <button 
            onClick={() => onDelete(node.id)} 
            className="action-button p-1 text-gray-500 hover:text-red-500"
            title="Delete node"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      {/* Render children if expanded and node is a directory */}
      {node.type === 'directory' && node.isExpanded && node.children && (
        <div className="node-children pl-4">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              onToggle={onToggle}
              onSelect={onSelect}
              onEdit={onEdit}
              onDelete={onDelete}
              onTypeChange={onTypeChange}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  );
};