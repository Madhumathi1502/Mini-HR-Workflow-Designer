import React from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import type { ApprovalNodeData } from '../../types/workflow';

interface Props {
  nodeId: string;
  data: ApprovalNodeData;
}

export function ApprovalNodeForm({ nodeId, data }: Props) {
  const { updateNodeData } = useWorkflowStore();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(nodeId, { title: e.target.value });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateNodeData(nodeId, { approverRole: e.target.value as 'Manager' | 'HRBP' | 'Director' });
  };

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(nodeId, { autoApproveThreshold: parseInt(e.target.value, 10) || 0 });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#BA7517]"
          value={data.title}
          onChange={handleTitleChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Approver Role</label>
        <select
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#BA7517] bg-white"
          value={data.approverRole}
          onChange={handleRoleChange}
        >
          <option value="Manager">Manager</option>
          <option value="HRBP">HRBP</option>
          <option value="Director">Director</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Auto-approve Threshold</label>
        <input
          type="number"
          min="0"
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#BA7517]"
          value={data.autoApproveThreshold}
          onChange={handleThresholdChange}
        />
        <p className="mt-1 text-xs text-slate-500">0 = always requires manual approval</p>
      </div>
    </div>
  );
}
