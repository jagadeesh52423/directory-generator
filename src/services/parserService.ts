// src/services/parserService.ts
import { TreeNode, NodeType } from '@/types/node';

// Generate a unique ID (in a real app, use a library like uuid)
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

/**
 * Parse a text representation of a directory structure into a tree of nodes
 */
export function parseDirectoryStructure(input: string): TreeNode[] {
  const lines = input.split('\n').filter(line => line.trim() !== '');
  const rootNodes: TreeNode[] = [];
  let currentPath: TreeNode[] = []; // Track the current path in the tree
  
  // First line is usually the root directory
  if (lines.length > 0) {
    const rootLine = lines[0];
    const rootName = rootLine.trim().replace(/\/$/, ''); // Remove trailing slash if present
    
    const rootNode: TreeNode = {
      id: generateId(),
      name: rootName,
      type: 'directory',
      selected: true,
      depth: 0,
      isExpanded: true,
      children: []
    };
    
    rootNodes.push(rootNode);
    currentPath.push(rootNode);
  }
  
  // Process the rest of the lines (skipping the first line)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    // Calculate indentation level based on characters
    let indentLevel = 0;
    
    // Count the indentation level by looking at the position of the last tree character
    const treeCharMatch = line.match(/^(.*?)[├└│]──/);
    if (treeCharMatch) {
      indentLevel = Math.floor(treeCharMatch[1].length / 2) + 1;
    } else {
      // Simple indentation without tree characters
      const simpleIndentMatch = line.match(/^(\s+)/);
      indentLevel = simpleIndentMatch ? Math.floor(simpleIndentMatch[1].length / 2) : 0;
    }
    
    // Extract node name from the line (after tree characters) and remove trailing slash
    const nodeNameMatch = line.match(/[├└│]──\s*([^#]+)/);
    let nodeName = '';
    
    if (nodeNameMatch) {
      // Extract from tree format
      nodeName = nodeNameMatch[1].trim();
    } else {
      // Try to extract from simple indented format
      const simpleNameMatch = line.match(/\s*([^#]+)/);
      nodeName = simpleNameMatch ? simpleNameMatch[1].trim() : line.trim();
    }
    
    // Extract comment if present
    const commentMatch = line.match(/#\s*(.+)$/);
    const comment = commentMatch ? commentMatch[1].trim() : undefined;
    
    // Determine if it's a file or directory
    let type: NodeType = 'directory';
    let name = nodeName.replace(/\/$/, ''); // Remove trailing slash if present
    
    // If it ends with **, it's a file (remove ** when storing)
    if (name.endsWith('**')) {
      name = name.substring(0, name.length - 2);
      type = 'file';
    } 
    // If it has an extension and doesn't end with /, assume it's a file
    else if (name.includes('.') && !nodeName.endsWith('/')) {
      type = 'file';
    }
    
    // Adjust the current path based on indentation level
    while (currentPath.length > indentLevel) {
      currentPath.pop();
    }
    
    // Create the new node
    const newNode: TreeNode = {
      id: generateId(),
      name,
      type,
      selected: true,
      depth: indentLevel,
      comment,
      isExpanded: true,
      children: type === 'directory' ? [] : undefined
    };
    
    // Add to parent node
    if (currentPath.length > 0) {
      const parent = currentPath[currentPath.length - 1];
      if (parent.children) {
        parent.children.push(newNode);
      }
    } else {
      // This is a root node
      rootNodes.push(newNode);
    }
    
    // If this is a directory, add it to the current path for potential children
    if (type === 'directory') {
      currentPath.push(newNode);
    }
  }
  
  return rootNodes;
}

/**
 * Serialize a tree of nodes back to a text representation
 */
export function serializeTreeToText(nodes: TreeNode[], level: number = 0): string {
  let result = '';
  const indent = '  '.repeat(level); // 2 spaces per level

  for (const node of nodes) {
    if (!node.selected) continue; // Skip nodes that are not selected
    
    result += `${indent}${node.name}${node.type === 'file' ? '' : '/'}`;
    if (node.comment) {
      result += ` # ${node.comment}`;
    }
    result += '\n';

    if (node.children && node.children.length > 0) {
      result += serializeTreeToText(node.children, level + 1);
    }
  }

  return result;
}