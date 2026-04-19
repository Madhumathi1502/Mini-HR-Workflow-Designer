import { NodePalette } from './components/sidebar/NodePalette';
import { WorkflowCanvas } from './components/canvas/WorkflowCanvas';
import { NodeFormPanel } from './components/forms/NodeFormPanel';

function App() {
  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden bg-gray-50 text-slate-800">
      <header className="h-14 border-b border-gray-200 bg-white flex items-center px-6 shrink-0 shadow-sm z-10 relative">
        <h1 className="font-bold text-lg text-slate-800">HR Workflow Designer</h1>
      </header>
      
      <div className="flex flex-1 overflow-hidden relative">
        <NodePalette />
        
        <main className="flex-1 flex flex-col relative h-full">
          <WorkflowCanvas />
        </main>
        
        <NodeFormPanel />
      </div>
    </div>
  );
}

export default App;