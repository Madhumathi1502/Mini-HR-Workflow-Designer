import React from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import type { EndNodeData } from '../../types/workflow';

interface Props {
  nodeId: string;
  data: EndNodeData;
}

export function EndNodeForm({ nodeId, data }: Props) {
  const { updateNodeData } = useWorkflowStore();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(nodeId, { title: e.target.value });
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(nodeId, { endMessage: e.target.value });
  };

  const handleFlagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(nodeId, { summaryFlag: e.target.checked });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#E24B4A]"
          value={data.title}
          onChange={handleTitleChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">End Message</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#E24B4A]"
          value={data.endMessage || ''}
          onChange={handleMessageChange}
        />
      </div>

      <div className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          id="summaryFlag"
          className="w-4 h-4 text-[#E24B4A] border-gray-300 rounded focus:ring-[#E24B4A]"
          checked={data.summaryFlag || false}
          onChange={handleFlagChange}
        />
        <label htmlFor="summaryFlag" className="text-sm text-slate-700 select-none">
          Generate summary report
        </label>
      </div>
    </div>
  );
}
