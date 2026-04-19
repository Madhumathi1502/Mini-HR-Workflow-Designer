import { useState } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { postSimulate } from '../../api/client';
import type { SimulateStep } from '../../types/workflow';

interface Props {
  isOpen: boolean;
}

const BADGE_COLORS: Record<string, string> = {
  orphan: 'bg-amber-100 text-amber-800',
  cycle: 'bg-red-100 text-red-800',
  missing_start: 'bg-red-100 text-red-800',
  unreachable: 'bg-amber-100 text-amber-800',
  multiple_end: 'bg-amber-100 text-amber-800'
};

const BADGE_LABELS: Record<string, string> = {
  orphan: 'Orphan',
  cycle: 'Cycle',
  missing_start: 'No start',
  unreachable: 'Unreachable',
  multiple_end: 'Multiple ends'
};

export function SandboxPanel({ isOpen }: Props) {
  const { nodes, edges, validationErrors } = useWorkflowStore();
  const [running, setRunning] = useState(false);
  const [simulationSteps, setSimulationSteps] = useState<SimulateStep[] | null>(null);

  if (!isOpen) return null;

  const hasBlockingErrors = validationErrors.some(e => e.type === 'missing_start' || e.type === 'cycle');

  const handleSimulate = async () => {
    setRunning(true);
    setSimulationSteps(null);
    const response = await postSimulate({ nodes, edges });
    setSimulationSteps(response.steps);
    setRunning(false);
  };

  const getStatusIcon = (status: string) => {
    if (status === 'completed') return 'bg-green-500';
    if (status === 'pending') return 'bg-amber-500';
    return 'bg-red-500';
  };

  const completedCount = simulationSteps?.filter(s => s.status === 'completed').length || 0;
  const pendingCount = simulationSteps?.filter(s => s.status === 'pending').length || 0;

  return (
    <div className="h-[280px] bg-white border-t border-slate-200 shrink-0 flex shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] z-20 absolute bottom-0 left-0 right-[300px]">
      
      {/* Validation Section */}
      <div className="w-1/2 border-r border-slate-200 p-4 overflow-y-auto flex flex-col">
        <h3 className="font-bold text-slate-800 mb-4 sticky top-0 bg-white z-10 pb-2 border-b border-slate-100">Validation</h3>
        
        {validationErrors.length === 0 ? (
          <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-md border border-green-200">
            <div className="w-2 h-2 rounded-full bg-green-600"></div>
            <span className="text-sm font-medium">All checks passed</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {validationErrors.map((err, i) => (
              <div key={i} className="flex flex-col border border-slate-200 rounded-md p-3">
                <div className="flex items-start gap-3">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded shrink-0 ${BADGE_COLORS[err.type]}`}>
                    {BADGE_LABELS[err.type]}
                  </span>
                  <span className="text-sm text-slate-700">{err.message}</span>
                </div>
                {err.nodeIds && err.nodeIds.length > 0 && (
                  <div className="mt-2 text-xs text-slate-400 pl-[80px]">
                    Node IDs: {err.nodeIds.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Simulation Section */}
      <div className="w-1/2 p-4 overflow-y-auto flex flex-col bg-slate-50 relative">
        <div className="flex items-center justify-between sticky top-0 bg-slate-50 z-10 pb-2 border-b border-slate-200 mb-4">
          <h3 className="font-bold text-slate-800">Simulation log</h3>
          <button
            onClick={handleSimulate}
            disabled={hasBlockingErrors || running}
            className={`px-3 py-1.5 text-xs font-bold rounded shadow-sm transition-colors
              ${hasBlockingErrors || running 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          >
            {hasBlockingErrors ? 'Fix errors before simulating' : 'Run Simulation'}
          </button>
        </div>

        {running ? (
          <div className="flex items-center justify-center p-8 text-sm font-medium text-slate-500 animate-pulse">
            Running simulation...
          </div>
        ) : simulationSteps ? (
          <div className="flex flex-col gap-2 relative">
            {/* Timeline line */}
            <div className="absolute left-3 top-2 bottom-6 w-0.5 bg-slate-200"></div>

            {simulationSteps.map((step, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-3 bg-white p-2.5 rounded border border-slate-200 relative ml-8 shadow-sm transition-all animate-[slideIn_0.3s_ease-out_forwards]"
                style={{ animationDelay: `${idx * 150}ms`, opacity: 0, transform: 'translateY(10px)' }}
              >
                {/* Timeline dot */}
                <div className={`absolute -left-7 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full ${getStatusIcon(step.status)} ring-4 ring-slate-50`}></div>
                
                <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded self-start shrink-0 w-16 text-center">
                  {step.type}
                </span>
                
                <span className="text-sm text-slate-700 flex-1 px-2 border-l border-slate-100">{step.message}</span>
                
                <span className={`text-[10px] font-bold px-2 py-1 rounded lowercase 
                  ${step.status === 'completed' ? 'text-green-700 bg-green-50' : 
                    step.status === 'pending' ? 'text-amber-700 bg-amber-50' : 'text-red-700 bg-red-50'}`}>
                  {step.status}
                </span>
              </div>
            ))}
            
            <div className="mt-4 pt-3 border-t border-slate-200 text-xs font-medium text-slate-500 text-center animate-[fadeIn_0.5s_ease-out_forwards]" style={{ animationDelay: `${simulationSteps.length * 150}ms`, opacity: 0 }}>
              Simulation complete · {completedCount} completed · {pendingCount} pending
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-8 text-sm text-slate-400">
            Click 'Run Simulation' to test your workflow execution path.
          </div>
        )}
        
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes slideIn { to { opacity: 1; transform: translateY(0); } }
          @keyframes fadeIn { to { opacity: 1; } }
        `}} />
      </div>
    </div>
  );
}
