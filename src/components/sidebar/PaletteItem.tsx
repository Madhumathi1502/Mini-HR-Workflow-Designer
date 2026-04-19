import React from 'react';
import type { NodeType } from '../../types/workflow';

interface PaletteItemProps {
  type: NodeType;
  label: string;
  color: string;
}

export function PaletteItem({ type, label, color }: PaletteItemProps) {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('application/reactflow-type', type);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="flex items-center gap-3 p-3 mb-2 border rounded-md bg-white cursor-grab hover:bg-gray-50 transition-colors shadow-sm"
      draggable
      onDragStart={onDragStart}
    >
      <div
        className="w-4 h-4 rounded-full border-2"
        style={{ borderColor: color, backgroundColor: `${color}20` }}
      />
      <span className="font-medium text-sm text-gray-700">{label}</span>
    </div>
  );
}
