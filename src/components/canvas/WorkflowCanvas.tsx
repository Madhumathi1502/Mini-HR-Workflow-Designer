import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useWorkflowStore } from '../../store/workflowStore';
import { nodeTypes } from '../nodes';
import type { NodeType } from '../../types/workflow';
import { useValidation } from '../../hooks/useValidation';
import { CanvasToolbar } from './CanvasToolbar';
import { SandboxPanel } from '../sandbox/SandboxPanel';

function WorkflowCanvasInner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setSelectedNodeId,
    deleteNode,
    selectedNodeId,
    setValidationErrors,
  } = useWorkflowStore();

  const validation = useValidation();

  // Sync validation to store for nodes to read
  useEffect(() => {
    setValidationErrors(validation.errors);
  }, [validation.errors, setValidationErrors]);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow-type') as NodeType;
      if (!type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(type, position);
    },
    [addNode, screenToFlowPosition]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: { id: string }) => {
    setSelectedNodeId(node.id);
  }, [setSelectedNodeId]);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  // Handle delete key
  const onKeyDown = useCallback((event: React.KeyboardEvent) => {
    if ((event.key === 'Delete' || event.key === 'Backspace') && selectedNodeId) {
      deleteNode(selectedNodeId);
    }
  }, [deleteNode, selectedNodeId]);

  return (
    <div 
      className="flex-1 h-full w-full relative flex flex-col" 
      ref={reactFlowWrapper}
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <Controls />
          <CanvasToolbar 
            isSandboxOpen={isSandboxOpen} 
            onToggleSandbox={() => setIsSandboxOpen(!isSandboxOpen)} 
          />
        </ReactFlow>
        
        <SandboxPanel isOpen={isSandboxOpen} />
      </div>

      {/* Validation Status Bar */}
      <div className="h-9 bg-white border-t border-slate-200 flex items-center px-4 text-xs font-medium shrink-0 shadow-[0_-2px_4px_rgba(0,0,0,0.02)] z-10">
        {nodes.length === 0 ? (
          <span className="text-slate-500">Canvas is empty</span>
        ) : validation.valid ? (
          <div className="flex items-center gap-2 text-slate-600">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Workflow is valid · {nodes.length} nodes · {edges.length} edges</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-600">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span>
              <span className="text-red-600 font-bold">{validation.errors.length} validation error(s)</span> 
              {' · click Test Workflow to see details'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function WorkflowCanvas() {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner />
    </ReactFlowProvider>
  );
}
