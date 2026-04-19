import { Handle, Position } from '@xyflow/react';
import type { NodeProps, Node } from '@xyflow/react';
import type { EndNodeData } from '../../types/workflow';
import { useWorkflowStore } from '../../store/workflowStore';

type EndNodeType = Node<EndNodeData, 'end'>;

export function EndNode({ id, data, selected }: NodeProps<EndNodeType>) {
  const validationErrors = useWorkflowStore(state => state.validationErrors);
  const hasError = validationErrors.some(e => e.nodeIds?.includes(id));

  return (
    <div
      className={`min-w-[200px] min-h-[60px] rounded-full border-2 bg-white flex flex-col justify-center items-center shadow-sm
        ${hasError ? 'ring-2 ring-[#E24B4A] border-[#E24B4A] shadow-[#E24B4A]/20' : ''}
        ${selected && !hasError ? 'border-[#E24B4A] bg-[#fdf2f2] shadow-md ring-2 ring-[#E24B4A]/20' : !hasError ? 'border-[#E24B4A]' : ''}
        ${selected && hasError ? 'bg-[#fdf2f2]' : ''}`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-[#E24B4A]" />
      <div className="text-xs font-bold text-[#E24B4A] tracking-wider mb-1">END</div>
      <div className="font-medium text-gray-800">{data.title as string}</div>
    </div>
  );
}
