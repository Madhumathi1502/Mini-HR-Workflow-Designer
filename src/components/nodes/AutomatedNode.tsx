import { Handle, Position } from '@xyflow/react';
import type { NodeProps, Node } from '@xyflow/react';
import type { AutomatedNodeData } from '../../types/workflow';
import { useWorkflowStore } from '../../store/workflowStore';

type AutomatedNodeType = Node<AutomatedNodeData, 'automated'>;

export function AutomatedNode({ id, data, selected }: NodeProps<AutomatedNodeType>) {
  const validationErrors = useWorkflowStore(state => state.validationErrors);
  const hasError = validationErrors.some(e => e.nodeIds?.includes(id));

  return (
    <div
      className={`min-w-[200px] min-h-[60px] rounded-md border-2 bg-white flex flex-col justify-center px-4 py-2 shadow-sm
        ${hasError ? 'ring-2 ring-[#E24B4A] border-[#E24B4A] shadow-[#E24B4A]/20' : ''}
        ${selected && !hasError ? 'border-[#7F77DD] bg-[#f4f3ff] shadow-md ring-2 ring-[#7F77DD]/20' : !hasError ? 'border-[#7F77DD]' : ''}
        ${selected && hasError ? 'bg-[#fdf2f2]' : ''}`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-[#7F77DD]" />
      <div className="text-xs font-bold text-[#7F77DD] tracking-wider mb-1">AUTO</div>
      <div className="font-medium text-gray-800">{data.title as string}</div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-[#7F77DD]" />
    </div>
  );
}
