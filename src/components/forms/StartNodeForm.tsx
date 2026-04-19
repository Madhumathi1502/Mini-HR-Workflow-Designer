import React from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import type { StartNodeData } from '../../types/workflow';

interface Props {
  nodeId: string;
  data: StartNodeData;
}

export function StartNodeForm({ nodeId, data }: Props) {
  const { updateNodeData } = useWorkflowStore();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(nodeId, { title: e.target.value });
  };

  const handleMetadataChange = (key: string, value: string, index: number) => {
    const entries = Object.entries(data.metadata || {});
    entries[index] = [key, value];
    
    const newMetadata = Object.fromEntries(entries.filter(([k]) => k.trim() !== ''));
    updateNodeData(nodeId, { metadata: newMetadata });
  };

  const addMetadataField = () => {
    const entries = Object.entries(data.metadata || {});
    entries.push([`field_${entries.length + 1}`, '']);
    updateNodeData(nodeId, { metadata: Object.fromEntries(entries) });
  };

  const removeMetadataField = (keyToRemove: string) => {
    const entries = Object.entries(data.metadata || {}).filter(([k]) => k !== keyToRemove);
    updateNodeData(nodeId, { metadata: Object.fromEntries(entries) });
  };

  const metadataEntries = Object.entries(data.metadata || {});

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#639922]"
          value={data.title}
          onChange={handleTitleChange}
          required
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-slate-700">Metadata</label>
          <button
            onClick={addMetadataField}
            className="text-xs text-[#639922] font-medium hover:underline"
          >
            + Add field
          </button>
        </div>

        {metadataEntries.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No metadata defined.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {metadataEntries.map(([key, value], index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  className="w-1/2 px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#639922]"
                  value={key}
                  onChange={(e) => handleMetadataChange(e.target.value, value as string, index)}
                  placeholder="Key"
                />
                <input
                  type="text"
                  className="w-1/2 px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#639922]"
                  value={value as string}
                  onChange={(e) => handleMetadataChange(key, e.target.value, index)}
                  placeholder="Value"
                />
                <button
                  onClick={() => removeMetadataField(key)}
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
