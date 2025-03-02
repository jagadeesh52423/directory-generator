import { TreeNode } from '@/types/node';

/**
 * Utility functions for tree manipulation
 */
export const treeUtils = {
  /**
   * Calculate the full path for a node
   */
  calculateNodePath(node: TreeNode, nodes: TreeNode[]): string {
    // If it's a top-level node, return its name
    if (node.depth === 0) {
      return node.name;
    }

    // Otherwise, traverse the tree to find the node's parents
    const pathParts: string[] = [node.name];
    let currentNode = node;

    const findParent = (currentNode: TreeNode, nodeList: TreeNode[]): TreeNode | null => {
      for (const potential of nodeList) {
        if (potential.children) {
          const directChild = potential.children.find(child => child.id === currentNode.id);
          if (directChild) {
            return potential;
          }

          const deeperParent = findParent(currentNode, potential.children);
          if (deeperParent) {
            return deeperParent;
          }
        }
      }
      return null;
    };

    while (currentNode.depth && currentNode.depth > 0) {
      const parent = findParent(currentNode, nodes);
      if (!parent) break;

      pathParts.unshift(parent.name);
      currentNode = parent;
    }

    return pathParts.join('/');
  },

  /**
   * Get all paths for selected nodes
   */
  getSelectedNodePaths(nodes: TreeNode[]): string[] {
    const paths: string[] = [];

    const processNode = (node: TreeNode, parentPath: string = '') => {
      const nodePath = parentPath ? `${parentPath}/${node.name}` : node.name;

      if (node.selected) {
        paths.push(nodePath);
      }

      if (node.children) {
        node.children.forEach(child => processNode(child, nodePath));
      }
    };

    nodes.forEach(node => processNode(node));

    return paths;
  },

  /**
   * Count the total number of nodes in a tree
   */
  countNodes(nodes: TreeNode[]): number {
    let count = nodes.length;

    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        count += this.countNodes(node.children);
      }
    }

    return count;
  },

  /**
   * Count selected nodes in a tree
   */
  countSelectedNodes(nodes: TreeNode[]): number {
    let count = 0;

    for (const node of nodes) {
      if (node.selected) {
        count += 1;
      }
      
      if (node.children && node.children.length > 0) {
        count += this.countSelectedNodes(node.children);
      }
    }

    return count;
  },

  /**
   * Calculate tree statistics
   */
  getTreeStats(nodes: TreeNode[]): {
    totalNodes: number;
    selectedNodes: number;
    directories: number;
    files: number;
  } {
    let stats = {
      totalNodes: 0,
      selectedNodes: 0,
      directories: 0,
      files: 0,
    };

    const processNode = (node: TreeNode) => {
      stats.totalNodes += 1;
      
      if (node.selected) {
        stats.selectedNodes += 1;
      }
      
      if (node.type === 'directory') {
        stats.directories += 1;
      } else {
        stats.files += 1;
      }

      if (node.children) {
        node.children.forEach(processNode);
      }
    };

    nodes.forEach(processNode);

    return stats;
  }
};