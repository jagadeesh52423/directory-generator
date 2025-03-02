// src/services/fileSystemService.ts
import { ExecutionItem, ExecutionResult } from '@/types/fileSystem';
import { TreeNode } from '@/types/node';

/**
 * Service responsible for file system operations
 * In a real application, this would interact with the File System Access API 
 * or make API calls to the server for file system operations
 */
export const fileSystemService = {
  /**
   * Execute the creation of directories and files
   * @param targetPath Base directory where items will be created
   * @param items List of items (files/directories) to create
   * @returns Results of the execution
   */
  async executeCreation(
    targetPath: string,
    items: ExecutionItem[]
  ): Promise<ExecutionResult[]> {
    try {
      // In a real implementation, this would call a server API
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetPath,
          items,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to execute creation');
      }

      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error executing creation:', error);
      
      // Return a single error result
      return [
        {
          success: false,
          path: targetPath,
          type: 'directory',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      ];
    }
  },

  /**
   * Convert tree structure to flat list of execution items
   * This properly handles the hierarchical paths
   */
  prepareExecutionItems(nodes: TreeNode[]): ExecutionItem[] {
    const items: ExecutionItem[] = [];
    
    const processNode = (node: TreeNode, parentPath: string = '') => {
      if (!node.selected) return;
      
      const nodePath = parentPath ? `${parentPath}/${node.name}` : node.name;
      
      items.push({
        path: nodePath,
        type: node.type
      });
      
      if (node.children) {
        node.children.forEach(child => processNode(child, nodePath));
      }
    };
    
    nodes.forEach(node => processNode(node));
    
    return items;
  },

  /**
   * Get available directories in the file system
   * This is a mock implementation
   * @returns List of available directories
   */
  async getAvailableDirectories(
    basePath?: string
  ): Promise<{ path: string; name: string }[]> {
    // In a real implementation, this would call a server API
    // Here we return mock data
    return [
      { path: '/home/user/projects', name: 'projects' },
      { path: '/home/user/documents', name: 'documents' },
      { path: '/var/www/html', name: 'html' },
      { path: 'C:\\Users\\user\\Projects', name: 'Projects' },
      { path: 'C:\\Program Files', name: 'Program Files' },
    ];
  },
};