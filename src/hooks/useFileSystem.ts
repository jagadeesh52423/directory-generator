// src/hooks/useFileSystem.ts
import { useState, useCallback } from 'react';
import { ExecutionItem, ExecutionResult } from '@/types/fileSystem';
import { fileSystemService } from '@/services/fileSystemService';
import { TreeNode } from '@/types/node';

export function useFileSystem() {
  const [targetPath, setTargetPath] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionResults, setExecutionResults] = useState<ExecutionResult[]>([]);

  // Select a target directory path
  const selectTargetPath = useCallback((path: string) => {
    setTargetPath(path);
  }, []);

  // Execute the creation of files and directories
  const executeCreation = useCallback(
    async (nodes: TreeNode[]) => {
      if (!targetPath) {
        return [
          {
            success: false,
            path: '',
            type: 'directory',
            message: 'No target directory selected',
          } as ExecutionResult,
        ];
      }

      setIsExecuting(true);
      setExecutionResults([]);

      try {
        // Convert tree nodes to flat execution items with proper paths
        const executionItems = fileSystemService.prepareExecutionItems(nodes);

        // Execute the creation
        const results = await fileSystemService.executeCreation(
          targetPath,
          executionItems
        );

        setExecutionResults(results);
        return results;
      } catch (error) {
        const errorResult: ExecutionResult = {
          success: false,
          path: targetPath,
          type: 'directory',
          message: error instanceof Error ? error.message : 'Unknown error',
        };
        setExecutionResults([errorResult]);
        return [errorResult];
      } finally {
        setIsExecuting(false);
      }
    },
    [targetPath]
  );

  return {
    targetPath,
    selectTargetPath,
    isExecuting,
    executionResults,
    executeCreation,
  };
}