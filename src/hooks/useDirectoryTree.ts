import { useState, useCallback } from 'react';
import { TreeNode } from '@/types/node';
import { parseDirectoryStructure } from '@/services/parserService';

// Helper function to generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export function useDirectoryTree() {
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);

  // Parse input text into a tree structure
  const parseInput = useCallback((input: string) => {
    const parsedNodes = parseDirectoryStructure(input);
    setNodes(parsedNodes);
    setSelectedNode(null);
  }, []);

  // Find a node by its ID
  const findNodeById = useCallback((id: string, nodeList: TreeNode[]): TreeNode | null => {
    for (const node of nodeList) {
      if (node.id === id) {
        return node;
      }
      if (node.children && node.children.length > 0) {
        const found = findNodeById(id, node.children);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }, []);

  // Update tree nodes with a modified node
  const updateTreeWithNode = useCallback((updatedNode: TreeNode, nodeList: TreeNode[]): TreeNode[] => {
    return nodeList.map(node => {
      if (node.id === updatedNode.id) {
        return updatedNode;
      }
      if (node.children) {
        return {
          ...node,
          children: updateTreeWithNode(updatedNode, node.children)
        };
      }
      return node;
    });
  }, []);

  // Select a node for editing
  const selectNode = useCallback((id: string | null) => {
    if (id === null) {
      setSelectedNode(null);
      return;
    }
    
    const foundNode = findNodeById(id, nodes);
    setSelectedNode(foundNode);
  }, [nodes, findNodeById]);

  // Update a node's properties
  const updateNode = useCallback((updatedNode: TreeNode) => {
    setNodes(prevNodes => updateTreeWithNode(updatedNode, prevNodes));
    setSelectedNode(null);
  }, [updateTreeWithNode]);

  // Toggle a node's expanded state
  const toggleNode = useCallback((id: string) => {
    setNodes(prevNodes => {
      const updateToggle = (nodeList: TreeNode[]): TreeNode[] => {
        return nodeList.map(node => {
          if (node.id === id) {
            return { ...node, isExpanded: !node.isExpanded };
          }
          if (node.children) {
            return { ...node, children: updateToggle(node.children) };
          }
          return node;
        });
      };
      return updateToggle(prevNodes);
    });
  }, []);

  // Toggle a node's selected state
  const toggleNodeSelection = useCallback((id: string, selected: boolean) => {
    setNodes(prevNodes => {
      const updateSelection = (nodeList: TreeNode[]): TreeNode[] => {
        return nodeList.map(node => {
          if (node.id === id) {
            return { ...node, selected };
          }
          if (node.children) {
            return { ...node, children: updateSelection(node.children) };
          }
          return node;
        });
      };
      return updateSelection(prevNodes);
    });
  }, []);

  // Toggle a node's type (file/directory)
  const toggleNodeType = useCallback((id: string) => {
    setNodes(prevNodes => {
      const updateType = (nodeList: TreeNode[]): TreeNode[] => {
        return nodeList.map(node => {
          if (node.id === id) {
            const newType = node.type === 'file' ? 'directory' : 'file';
            return { 
              ...node, 
              type: newType,
              children: newType === 'directory' ? [] : undefined
            };
          }
          if (node.children) {
            return { ...node, children: updateType(node.children) };
          }
          return node;
        });
      };
      return updateType(prevNodes);
    });
  }, []);

  // Delete a node
  const deleteNode = useCallback((id: string) => {
    setNodes(prevNodes => {
      const removeNode = (nodeList: TreeNode[]): TreeNode[] => {
        return nodeList.filter(node => {
          if (node.id === id) {
            return false;
          }
          if (node.children) {
            node.children = removeNode(node.children);
          }
          return true;
        });
      };
      return removeNode(prevNodes);
    });
    
    // If the deleted node was selected, clear selection
    if (selectedNode?.id === id) {
      setSelectedNode(null);
    }
  }, [selectedNode]);

  // Add a new root node
  const addRootNode = useCallback(() => {
    const newNode: TreeNode = {
      id: generateId(),
      name: 'New Node',
      type: 'directory',
      selected: true,
      isExpanded: true,
      children: [],
      depth: 0
    };
    
    setNodes(prevNodes => [...prevNodes, newNode]);
    setSelectedNode(newNode);
  }, []);

  // Add a child node to a parent
  const addChildNode = useCallback((parentId: string) => {
    setNodes(prevNodes => {
      const addChild = (nodeList: TreeNode[]): TreeNode[] => {
        return nodeList.map(node => {
          if (node.id === parentId) {
            // If it's a file, convert to directory
            if (node.type === 'file') {
              node = { ...node, type: 'directory', children: [] };
            }
            
            const newNode: TreeNode = {
              id: generateId(),
              name: 'New Node',
              type: 'file',
              selected: true,
              depth: (node.depth || 0) + 1
            };
            
            return {
              ...node,
              children: [...(node.children || []), newNode]
            };
          }
          
          if (node.children) {
            return { ...node, children: addChild(node.children) };
          }
          
          return node;
        });
      };
      
      return addChild(prevNodes);
    });
  }, []);

  // Select all nodes
  const selectAll = useCallback(() => {
    setNodes(prevNodes => {
      const markSelected = (nodeList: TreeNode[]): TreeNode[] => {
        return nodeList.map(node => {
          const updatedNode = { ...node, selected: true };
          if (node.children) {
            updatedNode.children = markSelected(node.children);
          }
          return updatedNode;
        });
      };
      return markSelected(prevNodes);
    });
  }, []);

  // Deselect all nodes
  const deselectAll = useCallback(() => {
    setNodes(prevNodes => {
      const markDeselected = (nodeList: TreeNode[]): TreeNode[] => {
        return nodeList.map(node => {
          const updatedNode = { ...node, selected: false };
          if (node.children) {
            updatedNode.children = markDeselected(node.children);
          }
          return updatedNode;
        });
      };
      return markDeselected(prevNodes);
    });
  }, []);

  // Expand all nodes
  const expandAll = useCallback(() => {
    setNodes(prevNodes => {
      const markExpanded = (nodeList: TreeNode[]): TreeNode[] => {
        return nodeList.map(node => {
          const updatedNode = { ...node, isExpanded: true };
          if (node.children) {
            updatedNode.children = markExpanded(node.children);
          }
          return updatedNode;
        });
      };
      return markExpanded(prevNodes);
    });
  }, []);

  // Collapse all nodes
  const collapseAll = useCallback(() => {
    setNodes(prevNodes => {
      const markCollapsed = (nodeList: TreeNode[]): TreeNode[] => {
        return nodeList.map(node => {
          const updatedNode = { ...node, isExpanded: false };
          if (node.children) {
            updatedNode.children = markCollapsed(node.children);
          }
          return updatedNode;
        });
      };
      return markCollapsed(prevNodes);
    });
  }, []);

  // Get all selected nodes for execution
  const getSelectedNodes = useCallback(() => {
    const collectSelected = (
      nodeList: TreeNode[], 
      parentPath: string = ''
    ): { node: TreeNode; fullPath: string }[] => {
      let result: { node: TreeNode; fullPath: string }[] = [];
      
      for (const node of nodeList) {
        if (!node.selected) continue;
        
        const nodePath = parentPath ? `${parentPath}/${node.name}` : node.name;
        result.push({ node, fullPath: nodePath });
        
        if (node.children && node.children.length > 0) {
          result = result.concat(collectSelected(node.children, nodePath));
        }
      }
      
      return result;
    };
    
    return collectSelected(nodes);
  }, [nodes]);

  return {
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
    getSelectedNodes
  };
}