'use client';

import React, { useState } from 'react';
import { InputArea } from '@/components/InputParser/InputArea';
import { DirectoryTree } from '@/components/DirectoryTree/DirectoryTree';
import { NodeEditor } from '@/components/ModificationPanel/NodeEditor';
import { BulkActions } from '@/components/ModificationPanel/BulkActions';
import { DirectoryBrowser } from '@/components/DirectorySelector/DirectoryBrowser';
import { ExecutionPanel } from '@/components/Execution/ExecutionPanel';
import { useDirectoryTree } from '@/hooks/useDirectoryTree';
import { useFileSystem } from '@/hooks/useFileSystem';

export default function Home() {
  const {
    nodes,
    selectedNode,
    parseInput,
    selectNode,
    updateNode,
    toggleNode,
    toggleNodeSelection,
    toggleNodeType,
    deleteNode,
    addRootNode,
    addChildNode,
    selectAll,
    deselectAll,
    expandAll,
    collapseAll,
  } = useDirectoryTree();

  const {
    targetPath,
    selectTargetPath,
    executeCreation,
  } = useFileSystem();

  const handleExecute = async () => {
    return executeCreation(nodes);
  };

  return (
    <div className="directory-generator">
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {/* Left Column - Input & Directory Selection */}
        <div className="md:col-span-2 space-y-4">
          <InputArea onParse={parseInput} />
          <DirectoryBrowser onSelect={selectTargetPath} />
        </div>

        {/* Middle Column - Tree View */}
        <div className="md:col-span-3">
          <DirectoryTree
            nodes={nodes}
            onToggle={toggleNode}
            onSelect={toggleNodeSelection}
            onEdit={selectNode}
            onDelete={deleteNode}
            onTypeChange={toggleNodeType}
            onAddRoot={addRootNode}
            onAddChild={addChildNode}
            onExpandAll={expandAll}
            onCollapseAll={collapseAll}
            onSelectAll={selectAll}
            onDeselectAll={deselectAll}
          />
        </div>

        {/* Right Column - Editor & Execution */}
        <div className="md:col-span-2 space-y-4">
          <NodeEditor
            node={selectedNode}
            onSave={updateNode}
            onCancel={() => selectNode(null)}
          />
          <BulkActions nodes={nodes} />
          <ExecutionPanel
            targetPath={targetPath}
            onExecute={handleExecute}
            disabled={!targetPath || nodes.length === 0}
          />
        </div>
      </div>
    </div>
  );
}