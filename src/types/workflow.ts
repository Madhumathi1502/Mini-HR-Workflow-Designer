export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

export type BaseNodeData = Record<string, unknown> & {
  id: string;
  type: NodeType;
  title: string;
};

export type StartNodeData = BaseNodeData & {
  type: 'start';
  metadata: Record<string, any>;
};

export type TaskNodeData = BaseNodeData & {
  type: 'task';
  description?: string;
  assignee: string;
  dueDate?: string;
  customFields: Record<string, any>;
};

export type ApprovalNodeData = BaseNodeData & {
  type: 'approval';
  approverRole: 'Manager' | 'HRBP' | 'Director';
  autoApproveThreshold: number;
};

export type AutomatedNodeData = BaseNodeData & {
  type: 'automated';
  actionId: string;
  params: Record<string, any>;
};

export type EndNodeData = BaseNodeData & {
  type: 'end';
  endMessage?: string;
  summaryFlag: boolean;
};

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

export interface ValidationError {
  type: 'orphan' | 'cycle' | 'missing_start' | 'unreachable' | 'multiple_end';
  message: string;
  nodeIds?: string[];
}

export interface SimulateStep {
  nodeId: string;
  type: NodeType;
  status: 'completed' | 'pending' | 'failed';
  message: string;
}

export interface SimulateResponse {
  status: 'success' | 'error';
  steps: SimulateStep[];
}

export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}
