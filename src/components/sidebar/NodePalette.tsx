import { PaletteItem } from './PaletteItem';
import type { NodeType } from '../../types/workflow';

export function NodePalette() {
  const items: { type: NodeType; label: string; color: string }[] = [
    { type: 'start', label: 'Start', color: '#639922' },
    { type: 'task', label: 'Task', color: '#378ADD' },
    { type: 'approval', label: 'Approval', color: '#BA7517' },
    { type: 'automated', label: 'Automated Step', color: '#7F77DD' },
    { type: 'end', label: 'End', color: '#E24B4A' },
  ];

  return (
    <aside className="w-[220px] bg-slate-50 border-r border-slate-200 p-4 shrink-0 flex flex-col h-full overflow-y-auto">
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Components</h2>
      <div className="flex flex-col">
        {items.map((item) => (
          <PaletteItem
            key={item.type}
            type={item.type}
            label={item.label}
            color={item.color}
          />
        ))}
      </div>
    </aside>
  );
}
