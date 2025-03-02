import React, { useState, useEffect } from 'react';
import { TreeNode as TreeNodeType } from '@/types/node';
import { Save, X } from 'lucide-react';

interface NodeEditorProps {
  node: TreeNodeType | null;
  onSave: (node: TreeNodeType) => void;
  onCancel: () => void;
}

export const NodeEditor: React.FC<NodeEditorProps> = ({ node, onSave, onCancel }) => {
  const [editedNode, setEditedNode] = useState<TreeNodeType | null>(null);

  useEffect(() => {
    if (node) {
      setEditedNode({ ...node });
    } else {
      setEditedNode(null);
    }
  }, [node]);

  if (!editedNode) {
    return (
      <div className="node-editor border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Node Editor</h2>
        <div className="text-gray-500 p-4 text-center">
          Select a node to edit its properties
        </div>
      </div>
    );
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedNode({ ...editedNode, name: e.target.value });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as 'file' | 'directory';
    setEditedNode({
      ...editedNode,
      type: newType,
      children: newType === 'directory' ? (editedNode.children || []) : undefined,
    });
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedNode({ ...editedNode, comment: e.target.value });
  };

  const handleSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedNode({ ...editedNode, selected: e.target.checked });
  };

  const handleSave = () => {
    if (editedNode && editedNode.name.trim()) {
      onSave(editedNode);
    }
  };

  return (
    <div className="node-editor border rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Node Editor</h2>
      
      <div className="form-group mb-3">
        <label htmlFor="nodeName" className="block text-sm font-medium mb-1">
          Name:
        </label>
        <input
          id="nodeName"
          type="text"
          value={editedNode.name}
          onChange={handleNameChange}
          className="w-full border rounded p-2"
          placeholder="Enter node name"
        />
      </div>
      
      <div className="form-group mb-3">
        <label htmlFor="nodeType" className="block text-sm font-medium mb-1">
          Type:
        </label>
        <select
          id="nodeType"
          value={editedNode.type}
          onChange={handleTypeChange}
          className="w-full border rounded p-2"
        >
          <option value="file">File</option>
          <option value="directory">Directory</option>
        </select>
      </div>
      
      <div className="form-group mb-3">
        <label htmlFor="nodeComment" className="block text-sm font-medium mb-1">
          Comment:
        </label>
        <input
          id="nodeComment"
          type="text"
          value={editedNode.comment || ''}
          onChange={handleCommentChange}
          className="w-full border rounded p-2"
          placeholder="Enter comment (optional)"
        />
      </div>
      
      <div className="form-group mb-4">
        <label className="flex items-center text-sm font-medium">
          <input
            type="checkbox"
            checked={editedNode.selected}
            onChange={handleSelectionChange}
            className="mr-2"
          />
          Include in creation
        </label>
      </div>
      
      <div className="button-group flex gap-2">
        <button
          onClick={handleSave}
          disabled={!editedNode.name.trim()}
          className={`bg-green-500 text-white px-3 py-2 rounded flex items-center ${!editedNode.name.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
        >
          <Save size={16} className="mr-1" /> Save
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-200 px-3 py-2 rounded flex items-center hover:bg-gray-300"
        >
          <X size={16} className="mr-1" /> Cancel
        </button>
      </div>
    </div>
  );
};