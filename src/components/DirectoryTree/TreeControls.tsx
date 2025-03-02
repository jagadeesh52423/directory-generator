import React from 'react';
import { Plus, ChevronDown, ChevronRight, Check, Square } from 'lucide-react';

interface TreeControlsProps {
  onAddRoot: () => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export const TreeControls: React.FC<TreeControlsProps> = ({
  onAddRoot,
  onExpandAll,
  onCollapseAll,
  onSelectAll,
  onDeselectAll,
}) => {
  return (
    <div className="tree-controls flex flex-wrap gap-2">
      <button 
        onClick={onAddRoot}
        className="control-button flex items-center bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
      >
        <Plus size={16} className="mr-1" /> Add Root
      </button>
      
      <button 
        onClick={onExpandAll}
        className="control-button flex items-center bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300"
      >
        <ChevronDown size={16} className="mr-1" /> Expand All
      </button>
      
      <button 
        onClick={onCollapseAll}
        className="control-button flex items-center bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300"
      >
        <ChevronRight size={16} className="mr-1" /> Collapse All
      </button>
      
      <button 
        onClick={onSelectAll}
        className="control-button flex items-center bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300"
      >
        <Check size={16} className="mr-1" /> Select All
      </button>
      
      <button 
        onClick={onDeselectAll}
        className="control-button flex items-center bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300"
      >
        <Square size={16} className="mr-1" /> Deselect All
      </button>
    </div>
  );
};