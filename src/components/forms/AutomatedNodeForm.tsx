import React from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import type { AutomatedNodeData } from '../../types/workflow';
import { useAutomations } from '../../hooks/useAutomations';

interface Props {
  nodeId: string;
  data: AutomatedNodeData;
}

export function AutomatedNodeForm({ nodeId, data }: Props) {
  const { updateNodeData } = useWorkflowStore();
  const { automations, loading } = useAutomations();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(nodeId, { title: e.target.value });
  };

  const handleActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newActionId = e.target.value;
    updateNodeData(nodeId, { actionId: newActionId, params: {} });
  };

  const handleParamChange = (paramName: string, value: string) => {
    updateNodeData(nodeId, {
      params: { ...data.params, [paramName]: value }
    });
  };

  const selectedAction = automations.find(a => a.id === data.actionId);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#7F77DD]"
          value={data.title}
          onChange={handleTitleChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Action</label>
        {loading ? (
          <p className="text-sm text-slate-500 italic px-3 py-2 border border-slate-200 rounded-md bg-slate-50">
            Loading actions...
          </p>
        ) : (
          <select
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#7F77DD] bg-white"
            value={data.actionId}
            onChange={handleActionChange}
          >
            <option value="" disabled>Select an action</option>
            {automations.map(act => (
              <option key={act.id} value={act.id}>{act.label}</option>
            ))}
          </select>
        )}
      </div>

      {selectedAction && selectedAction.params.length > 0 && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
          <h4 className="text-xs font-bold text-slate-600 mb-3 uppercase tracking-wider">Action Parameters</h4>
          <div className="flex flex-col gap-3">
            {selectedAction.params.map((param) => (
              <div key={param}>
                <label className="block text-xs font-medium text-slate-700 mb-1 capitalize">
                  {param}
                </label>
                <input
                  type="text"
                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#7F77DD]"
                  value={(data.params && data.params[param]) || ''}
                  onChange={(e) => handleParamChange(param, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
