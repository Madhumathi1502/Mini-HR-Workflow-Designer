import { Handle, Position } from '@xyflow/react';
import type { NodeProps, Node } from '@xyflow/react';
import type { StartNodeData } from '../../types/workflow';
import { useWorkflowStore } from '../../store/workflowStore';

type StartNodeType = Node<StartNodeData, 'start'>;

export function StartNode({ id, data, selected }: NodeProps<StartNodeType>) {
  const validationErrors = useWorkflowStore(state => state.validationErrors);
  const hasError = validationErrors.some(e => e.nodeIds?.includes(id));

  return (
    <div
      className={`min-w-[200px] min-h-[60px] rounded-full border-2 bg-white flex flex-col justify-center items-center shadow-sm
        ${hasError ? 'ring-2 ring-[#E24B4A] border-[#E24B4A] shadow-[#E24B4A]/20' : ''}
        ${selected && !hasError ? 'border-[#639922] bg-[#f2fae8] shadow-md ring-2 ring-[#639922]/20' : !hasError ? 'border-[#639922]' : ''}
        ${selected && hasError ? 'bg-[#fdf2f2]' : ''}`}
    >
      <div className="text-xs font-bold text-[#639922] tracking-wider mb-1">START</div>
      <div className="font-medium text-gray-800">{data.title as string}</div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-[#639922]" />
    </div>
  );
}
