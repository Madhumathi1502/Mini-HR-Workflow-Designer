import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import type {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from '@xyflow/react';
import type { NodeType, WorkflowNodeData, ValidationError } from '../types/workflow';

interface WorkflowState {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;
  validationErrors: ValidationError[];
  onNodesChange: OnNodesChange<Node<WorkflowNodeData>>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node<WorkflowNodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  setSelectedNodeId: (id: string | null) => void;
  setValidationErrors: (errors: ValidationError[]) => void;
  addNode: (type: NodeType, position: { x: number; y: number }) => void;
  updateNodeData: (id: string, data: Partial<WorkflowNodeData>) => void;
  deleteNode: (id: string) => void;
  deleteEdge: (id: string) => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  validationErrors: [],
  onNodesChange: (changes: NodeChange<Node<WorkflowNodeData>>[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  setNodes: (nodes) => {
    set({ nodes });
  },
  setEdges: (edges) => {
    set({ edges });
  },
  setSelectedNodeId: (id) => {
    set({ selectedNodeId: id });
  },
  setValidationErrors: (errors) => {
    set({ validationErrors: errors });
  },
  addNode: (type, position) => {
    const id = `${type}-${Date.now()}`;
    let data: any = { id, type };

    switch (type) {
      case 'start':
        data = { ...data, title: 'Start', metadata: {} };
        break;
      case 'task':
        data = { ...data, title: 'New Task', description: '', assignee: '', dueDate: '', customFields: {} };
        break;
      case 'approval':
        data = { ...data, title: 'Approval', approverRole: 'Manager', autoApproveThreshold: 3 };
        break;
      case 'automated':
        data = { ...data, title: 'Automated Step', actionId: '', params: {} };
        break;
      case 'end':
        data = { ...data, title: 'End', endMessage: '', summaryFlag: false };
        break;
    }

    const newNode: Node<WorkflowNodeData> = {
      id,
      type,
      position,
      data: data as WorkflowNodeData,
    };

    set({ nodes: [...get().nodes, newNode] });
  },
  updateNodeData: (id, updateData) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...updateData,
            } as WorkflowNodeData,
          };
        }
        return node;
      }),
    });
  },
  deleteNode: (id) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== id),
      edges: get().edges.filter((edge) => edge.source !== id && edge.target !== id),
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
    });
  },
  deleteEdge: (id) => {
    set({
      edges: get().edges.filter((edge) => edge.id !== id),
    });
  },
}));
