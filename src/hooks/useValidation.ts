import { useMemo } from 'react';
import { useWorkflowStore } from '../store/workflowStore';
import { validateWorkflow } from '../utils/graphValidator';
import type { ValidationResult } from '../utils/graphValidator';

export function useValidation(): ValidationResult {
  const { nodes, edges } = useWorkflowStore();
  return useMemo(() => validateWorkflow(nodes, edges), [nodes, edges]);
}
