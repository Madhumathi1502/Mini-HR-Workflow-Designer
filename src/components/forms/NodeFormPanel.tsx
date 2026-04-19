import { useWorkflowStore } from '../../store/workflowStore';
import { StartNodeForm } from './StartNodeForm';
import { TaskNodeForm } from './TaskNodeForm';
import { ApprovalNodeForm } from './ApprovalNodeForm';
import { AutomatedNodeForm } from './AutomatedNodeForm';
import { EndNodeForm } from './EndNodeForm';
import type { 
  StartNodeData, 
  TaskNodeData, 
  ApprovalNodeData, 
  AutomatedNodeData, 
  EndNodeData 
} from '../../types/workflow';

const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  start: { bg: '#f2fae8', text: '#639922' },
  task: { bg: '#eef6ff', text: '#378ADD' },
  approval: { bg: '#fff8ef', text: '#BA7517' },
  automated: { bg: '#f4f3ff', text: '#7F77DD' },
  end: { bg: '#fdf2f2', text: '#E24B4A' },
};

export function NodeFormPanel() {
  const { nodes, selectedNodeId, deleteNode } = useWorkflowStore();

  if (!selectedNodeId) {
    return (
      <aside className="w-[300px] bg-white border-l border-gray-200 shrink-0 h-full flex items-center justify-center">
        <p className="text-sm text-gray-400 font-medium select-none">Select a node to configure it</p>
      </aside>
    );
  }

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  if (!selectedNode) return null;

  const type = selectedNode.type as string;
  const colors = BADGE_COLORS[type] || { bg: '#f1f5f9', text: '#475569' };

  return (
    <aside className="w-[300px] bg-white border-l border-gray-200 shrink-0 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="font-bold text-slate-800">Properties</h2>
        <span 
          className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider"
          style={{ backgroundColor: colors.bg, color: colors.text }}
        >
          {type === 'automated' ? 'auto' : type}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {selectedNode.type === 'start' && <StartNodeForm nodeId={selectedNode.id} data={selectedNode.data as StartNodeData} />}
        {selectedNode.type === 'task' && <TaskNodeForm nodeId={selectedNode.id} data={selectedNode.data as TaskNodeData} />}
        {selectedNode.type === 'approval' && <ApprovalNodeForm nodeId={selectedNode.id} data={selectedNode.data as ApprovalNodeData} />}
        {selectedNode.type === 'automated' && <AutomatedNodeForm nodeId={selectedNode.id} data={selectedNode.data as AutomatedNodeData} />}
        {selectedNode.type === 'end' && <EndNodeForm nodeId={selectedNode.id} data={selectedNode.data as EndNodeData} />}
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50 mt-auto">
        <button
          onClick={() => deleteNode(selectedNode.id)}
          className="w-full py-2 px-4 rounded-md text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
        >
          Delete node
        </button>
      </div>
    </aside>
  );
}
