import React from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import type { TaskNodeData } from '../../types/workflow';

interface Props {
  nodeId: string;
  data: TaskNodeData;
}

export function TaskNodeForm({ nodeId, data }: Props) {
  const { updateNodeData } = useWorkflowStore();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(nodeId, { title: e.target.value });
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(nodeId, { description: e.target.value });
  };

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(nodeId, { assignee: e.target.value });
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(nodeId, { dueDate: e.target.value });
  };

  const handleCustomFieldChange = (key: string, value: string, index: number) => {
    const entries = Object.entries(data.customFields || {});
    entries[index] = [key, value];
    
    const newFields = Object.fromEntries(entries.filter(([k]) => k.trim() !== ''));
    updateNodeData(nodeId, { customFields: newFields });
  };

  const addCustomField = () => {
    const entries = Object.entries(data.customFields || {});
    entries.push([`field_${entries.length + 1}`, '']);
    updateNodeData(nodeId, { customFields: Object.fromEntries(entries) });
  };

  const removeCustomField = (keyToRemove: string) => {
    const entries = Object.entries(data.customFields || {}).filter(([k]) => k !== keyToRemove);
    updateNodeData(nodeId, { customFields: Object.fromEntries(entries) });
  };

  const customFieldEntries = Object.entries(data.customFields || {});

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#378ADD]"
          value={data.title}
          onChange={handleTitleChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#378ADD]"
          value={data.description || ''}
          onChange={handleDescChange}
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Assignee</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#378ADD]"
          value={data.assignee || ''}
          onChange={handleAssigneeChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
        <input
          type="date"
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#378ADD]"
          value={data.dueDate || ''}
          onChange={handleDueDateChange}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-slate-700">Custom Fields</label>
          <button
            onClick={addCustomField}
            className="text-xs text-[#378ADD] font-medium hover:underline"
          >
            + Add field
          </button>
        </div>

        {customFieldEntries.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No custom fields defined.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {customFieldEntries.map(([key, value], index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  className="w-1/2 px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#378ADD]"
                  value={key}
                  onChange={(e) => handleCustomFieldChange(e.target.value, value as string, index)}
                  placeholder="Key"
                />
                <input
                  type="text"
                  className="w-1/2 px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#378ADD]"
                  value={value as string}
                  onChange={(e) => handleCustomFieldChange(key, e.target.value, index)}
                  placeholder="Value"
                />
                <button
                  onClick={() => removeCustomField(key)}
                  className="text-slate-400 hover:text-red-500 p-1"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
