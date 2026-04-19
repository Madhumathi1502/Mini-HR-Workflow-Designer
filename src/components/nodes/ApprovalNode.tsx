import { Handle, Position } from '@xyflow/react';
import type { NodeProps, Node } from '@xyflow/react';
import type { ApprovalNodeData } from '../../types/workflow';
import { useWorkflowStore } from '../../store/workflowStore';

type ApprovalNodeType = Node<ApprovalNodeData, 'approval'>;

export function ApprovalNode({ id, data, selected }: NodeProps<ApprovalNodeType>) {
  const validationErrors = useWorkflowStore(state => state.validationErrors);
  const hasError = validationErrors.some(e => e.nodeIds?.includes(id));

  return (
    <div
      className={`min-w-[200px] min-h-[60px] rounded-md border-2 bg-white flex flex-col justify-center px-4 py-2 shadow-sm
        ${hasError ? 'ring-2 ring-[#E24B4A] border-[#E24B4A] shadow-[#E24B4A]/20' : ''}
        ${selected && !hasError ? 'border-[#BA7517] bg-[#fff8ef] shadow-md ring-2 ring-[#BA7517]/20' : !hasError ? 'border-[#BA7517]' : ''}
        ${selected && hasError ? 'bg-[#fdf2f2]' : ''}`}
      style={{ clipPath: 'polygon(5% 0, 95% 0, 100% 50%, 95% 100%, 5% 100%, 0 50%)' }}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-[#BA7517]" />
      <div className="text-xs font-bold text-[#BA7517] tracking-wider mb-1 text-center">APPROVAL</div>
      <div className="font-medium text-gray-800 text-center">{data.title as string}</div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-[#BA7517]" />
    </div>
  );
}
