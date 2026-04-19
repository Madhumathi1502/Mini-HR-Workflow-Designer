import React, { useRef, useState } from 'react';
import { Panel } from '@xyflow/react';
import { useWorkflowStore } from '../../store/workflowStore';
import type { Node, Edge } from '@xyflow/react';
import type { WorkflowNodeData } from '../../types/workflow';

interface Props {
  onToggleSandbox: () => void;
  isSandboxOpen: boolean;
}

const TEMPLATES = {
  onboarding: {
    nodes: [
      { id: 'onb-start', type: 'start', position: { x: 250, y: 50 }, data: { id: 'onb-start', type: 'start', title: 'Start Onboarding', metadata: {} } },
      { id: 'onb-t1', type: 'task', position: { x: 250, y: 150 }, data: { id: 'onb-t1', type: 'task', title: 'Setup IT Equipment', assignee: 'IT Dept', customFields: {} } },
      { id: 'onb-t2', type: 'task', position: { x: 250, y: 250 }, data: { id: 'onb-t2', type: 'task', title: 'HR Orientation', assignee: 'HRBP', customFields: {} } },
      { id: 'onb-a1', type: 'approval', position: { x: 250, y: 350 }, data: { id: 'onb-a1', type: 'approval', title: 'Manager Approval', approverRole: 'Manager', autoApproveThreshold: 0 } },
      { id: 'onb-auto', type: 'automated', position: { x: 250, y: 450 }, data: { id: 'onb-auto', type: 'automated', title: 'Welcome Email', actionId: 'send_email', params: { to: 'employee', subject: 'Welcome!' } } },
      { id: 'onb-end', type: 'end', position: { x: 250, y: 550 }, data: { id: 'onb-end', type: 'end', title: 'End Onboarding', summaryFlag: true } }
    ],
    edges: [
      { id: 'e-onb-1', source: 'onb-start', target: 'onb-t1' },
      { id: 'e-onb-2', source: 'onb-t1', target: 'onb-t2' },
      { id: 'e-onb-3', source: 'onb-t2', target: 'onb-a1' },
      { id: 'e-onb-4', source: 'onb-a1', target: 'onb-auto' },
      { id: 'e-onb-5', source: 'onb-auto', target: 'onb-end' }
    ]
  },
  leave: {
    nodes: [
      { id: 'lv-start', type: 'start', position: { x: 250, y: 50 }, data: { id: 'lv-start', type: 'start', title: 'Leave Request', metadata: {} } },
      { id: 'lv-t1', type: 'task', position: { x: 250, y: 150 }, data: { id: 'lv-t1', type: 'task', title: 'Submit Request Details', assignee: 'Employee', customFields: {} } },
      { id: 'lv-a1', type: 'approval', position: { x: 250, y: 250 }, data: { id: 'lv-a1', type: 'approval', title: 'Manager Approval', approverRole: 'Manager', autoApproveThreshold: 3 } },
      { id: 'lv-auto', type: 'automated', position: { x: 250, y: 350 }, data: { id: 'lv-auto', type: 'automated', title: 'Update HRIS', actionId: 'notify_slack', params: { message: 'Leave approved' } } },
      { id: 'lv-end', type: 'end', position: { x: 250, y: 450 }, data: { id: 'lv-end', type: 'end', title: 'End Process', summaryFlag: false } }
    ],
    edges: [
      { id: 'e-lv-1', source: 'lv-start', target: 'lv-t1' },
      { id: 'e-lv-2', source: 'lv-t1', target: 'lv-a1' },
      { id: 'e-lv-3', source: 'lv-a1', target: 'lv-auto' },
      { id: 'e-lv-4', source: 'lv-auto', target: 'lv-end' }
    ]
  },
  offboarding: {
    nodes: [
      { id: 'off-start', type: 'start', position: { x: 250, y: 50 }, data: { id: 'off-start', type: 'start', title: 'Start Offboarding', metadata: {} } },
      { id: 'off-t1', type: 'task', position: { x: 250, y: 150 }, data: { id: 'off-t1', type: 'task', title: 'Exit Interview', assignee: 'HRBP', customFields: {} } },
      { id: 'off-t2', type: 'task', position: { x: 250, y: 250 }, data: { id: 'off-t2', type: 'task', title: 'Revoke Logic Access', assignee: 'IT Dept', customFields: {} } },
      { id: 'off-auto', type: 'automated', position: { x: 250, y: 350 }, data: { id: 'off-auto', type: 'automated', title: 'Notify Payroll', actionId: 'send_email', params: { to: 'payroll', subject: 'Offboarding' } } },
      { id: 'off-end', type: 'end', position: { x: 250, y: 450 }, data: { id: 'off-end', type: 'end', title: 'End Process', summaryFlag: true } }
    ],
    edges: [
      { id: 'e-off-1', source: 'off-start', target: 'off-t1' },
      { id: 'e-off-2', source: 'off-t1', target: 'off-t2' },
      { id: 'e-off-3', source: 'off-t2', target: 'off-auto' },
      { id: 'e-off-4', source: 'off-auto', target: 'off-end' }
    ]
  }
};

export function CanvasToolbar({ onToggleSandbox, isSandboxOpen }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const { nodes, edges, setNodes, setEdges } = useWorkflowStore();

  const handleExport = () => {
    const dataStr = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'workflow.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.nodes && json.edges) {
          setNodes(json.nodes);
          setEdges(json.edges);
        }
      } catch (error) {
        console.error('Failed to parse JSON', error);
        alert('Invalid workflow JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const loadTemplate = (key: keyof typeof TEMPLATES) => {
    const template = TEMPLATES[key];
    setNodes(template.nodes as Node<WorkflowNodeData>[]);
    setEdges(template.edges as Edge[]);
    setShowTemplates(false);
  };

  return (
    <Panel position="top-right" className="bg-white p-2 rounded-md shadow flex items-center gap-2 border border-slate-200">
      
      {/* Export / Import */}
      <div className="flex gap-1 pr-2 border-r border-slate-200">
        <button
          onClick={handleExport}
          className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded transition"
        >
          Export JSON
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded transition"
        >
          Import JSON
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept=".json"
          onChange={handleImport}
        />
      </div>

      {/* Templates Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded transition flex items-center gap-1"
        >
          Templates <span className="text-[10px]">▼</span>
        </button>
        
        {showTemplates && (
          <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-slate-200 shadow-lg rounded-md overflow-hidden z-50">
            <button
              onClick={() => loadTemplate('onboarding')}
              className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 transition"
            >
              Employee Onboarding
            </button>
            <button
              onClick={() => loadTemplate('leave')}
              className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 transition"
            >
              Leave Approval
            </button>
            <button
              onClick={() => loadTemplate('offboarding')}
              className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 transition"
            >
              Employee Offboarding
            </button>
          </div>
        )}
      </div>

      <div className="w-px h-6 bg-slate-200 mx-1"></div>

      <button
        onClick={onToggleSandbox}
        className={`px-4 py-1.5 text-xs font-bold rounded transition ml-1
          ${isSandboxOpen ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
      >
        {isSandboxOpen ? 'Close ✕' : 'Test Workflow ▲'}
      </button>
    </Panel>
  );
}
