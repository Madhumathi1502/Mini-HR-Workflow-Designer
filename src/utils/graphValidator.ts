import type { Node, Edge } from '@xyflow/react';
import type { ValidationError } from '../types/workflow';

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export function validateWorkflow(nodes: Node[], edges: Edge[]): ValidationResult {
  const errors: ValidationError[] = [];

  // CHECKS 1 & 2: Start and End Node count
  const startNodes = nodes.filter(n => n.type === 'start');
  const endNodes = nodes.filter(n => n.type === 'end');

  if (startNodes.length === 0) {
    errors.push({ type: 'missing_start', message: 'Workflow must have a Start node.' });
  }

  if (endNodes.length > 1) {
    errors.push({ type: 'multiple_end', message: 'Workflow has multiple End nodes. Only one is recommended.' });
  }

  // CHECK 3: Orphan node detection
  const connectedNodes = new Set<string>();
  for (const edge of edges) {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  }

  for (const node of nodes) {
    if (!connectedNodes.has(node.id) && nodes.length > 1) {
      errors.push({
        type: 'orphan',
        message: `Node "${node.data.title || node.type}" is not connected to anything.`,
        nodeIds: [node.id],
      });
    }
  }

  // CHECK 4: Cycle detection (DFS)
  const adjList = new Map<string, string[]>();
  for (const node of nodes) {
    adjList.set(node.id, []);
  }
  for (const edge of edges) {
    if (adjList.has(edge.source)) {
      adjList.get(edge.source)!.push(edge.target);
    }
  }

  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function dfs(nodeId: string, path: string[]) {
    visited.add(nodeId);
    recursionStack.add(nodeId);
    path.push(nodeId);

    const neighbors = adjList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor, path)) return true;
      } else if (recursionStack.has(neighbor)) {
        // Cycle detected
        const cycleStartIndex = path.indexOf(neighbor);
        const cycleNodes = path.slice(cycleStartIndex);
        errors.push({
          type: 'cycle',
          message: 'Workflow contains a circular connection.',
          nodeIds: cycleNodes,
        });
        return true; // Stop after first cycle for simplicity
      }
    }
    
    recursionStack.delete(nodeId);
    path.pop();
    return false;
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id, [])) break; // Only report one cycle to prevent flooding
    }
  }

  // CHECK 5: Unreachable node detection (BFS from Start)
  if (startNodes.length > 0) {
    const reachable = new Set<string>();
    const queue: string[] = startNodes.map(n => n.id);

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (!reachable.has(currentId)) {
        reachable.add(currentId);
        const neighbors = adjList.get(currentId) || [];
        for (const neighbor of neighbors) {
          if (!reachable.has(neighbor)) {
            queue.push(neighbor);
          }
        }
      }
    }

    for (const node of nodes) {
      if (node.type !== 'start' && !reachable.has(node.id)) {
        // Avoid duplicate reporting if it's already caught as an orphan
        const isAlreadyOrphan = !connectedNodes.has(node.id) && nodes.length > 1;
        if (!isAlreadyOrphan) {
          errors.push({
            type: 'unreachable',
            message: `Node "${node.data.title || node.type}" cannot be reached from the Start node.`,
            nodeIds: [node.id]
          });
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
