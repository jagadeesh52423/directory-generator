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
  
  // Handle root node separately
  const rootNodes: TreeNode[] = [];
  if (lines.length > 0) {
    const rootLine = lines[0].trim();
    const rootName = rootLine.replace(/\/$/, ''); // Remove trailing slash if present
    
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
  }
  
  // Process non-root lines
  const nodesByDepth: { [depth: number]: TreeNode[] } = {};
  nodesByDepth[0] = rootNodes;
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Count vertical bars to determine depth
    const verticalBars = (line.match(/│/g) || []).length;
    let depth = verticalBars;
    
    // If the line contains a treebox character (├ or └), add 1 to the depth
    if (line.includes('├') || line.includes('└')) {
      depth += 1;
    }
    
    // Extract node name (remove tree characters and indentation)
    const nameMatch = line.match(/[├└]──\s*([^#]*?)(?:\s+#.*)?$/);
    let nodeName = '';
    
    if (nameMatch && nameMatch[1]) {
      nodeName = nameMatch[1].trim();
    } else {
      // If no tree characters, try to extract name directly
      const simpleName = line.replace(/^[\s│]*/, '').split('#')[0].trim();
      nodeName = simpleName;
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
    
    // Create the new node
    const newNode: TreeNode = {
      id: generateId(),
      name,
      type,
      selected: true,
      depth,
      comment,
      isExpanded: true,
      children: type === 'directory' ? [] : undefined
    };
    
    // Find the parent node
    const parentDepth = depth - 1;
    if (parentDepth >= 0 && nodesByDepth[parentDepth] && nodesByDepth[parentDepth].length > 0) {
      // Get the last node at the parent depth as the parent
      const parentNode = nodesByDepth[parentDepth][nodesByDepth[parentDepth].length - 1];
      if (parentNode.children) {
        parentNode.children.push(newNode);
      }
    } else if (depth === 0) {
      // This is another root node
      rootNodes.push(newNode);
    }
    
    // Add this node to its depth level
    if (!nodesByDepth[depth]) {
      nodesByDepth[depth] = [];
    }
    nodesByDepth[depth].push(newNode);
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