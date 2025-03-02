import React from 'react';
import { treeUtils } from '@/utils/treeUtils';
import { TreeNode } from '@/types/node';
import { FileIcon, FolderIcon, CheckCircle, CheckSquare } from 'lucide-react';

interface BulkActionsProps {
  nodes: TreeNode[];
}

export const BulkActions: React.FC<BulkActionsProps> = ({ nodes }) => {
  const stats = treeUtils.getTreeStats(nodes);

  return (
    <div className="bulk-actions p-4 border rounded-lg bg-white">
      <h2 className="text-lg font-semibold mb-3">Structure Summary</h2>
      
      <div className="stats grid grid-cols-2 gap-3">
        <div className="stat p-3 bg-blue-50 rounded border border-blue-100">
          <div className="stat-label text-xs text-blue-700 font-medium">Total Items</div>
          <div className="stat-value flex items-center mt-1">
            <span className="text-xl font-bold text-blue-700">{stats.totalNodes}</span>
          </div>
        </div>
        
        <div className="stat p-3 bg-green-50 rounded border border-green-100">
          <div className="stat-label text-xs text-green-700 font-medium">Selected</div>
          <div className="stat-value flex items-center mt-1">
            <CheckCircle size={18} className="mr-2 text-green-600" />
            <span className="text-xl font-bold text-green-700">{stats.selectedNodes}</span>
          </div>
        </div>
        
        <div className="stat p-3 bg-yellow-50 rounded border border-yellow-100">
          <div className="stat-label text-xs text-yellow-700 font-medium">Directories</div>
          <div className="stat-value flex items-center mt-1">
            <FolderIcon size={18} className="mr-2 text-yellow-600" />
            <span className="text-xl font-bold text-yellow-700">{stats.directories}</span>
          </div>
        </div>
        
        <div className="stat p-3 bg-purple-50 rounded border border-purple-100">
          <div className="stat-label text-xs text-purple-700 font-medium">Files</div>
          <div className="stat-value flex items-center mt-1">
            <FileIcon size={18} className="mr-2 text-purple-600" />
            <span className="text-xl font-bold text-purple-700">{stats.files}</span>
          </div>
        </div>
      </div>

      {nodes.length > 0 ? (
        <div className="status mt-4 flex items-center p-2 bg-gray-100 rounded">
          <CheckSquare size={18} className="mr-2 text-green-600" />
          <span className="text-sm">
            Ready to create{' '}
            <span className="font-bold">{stats.selectedNodes}</span> items
          </span>
        </div>
      ) : (
        <div className="empty-state mt-4 p-2 text-sm text-gray-500 bg-gray-100 rounded text-center">
          Parse a directory structure to see statistics
        </div>
      )}
    </div>
  );
};