import { useState, useEffect } from 'react';
import { getAutomations } from '../api/client';
import type { AutomationAction } from '../types/workflow';

export function useAutomations() {
  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchActions() {
      try {
        setLoading(true);
        const data = await getAutomations();
        if (mounted) {
          setAutomations(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchActions();

    return () => {
      mounted = false;
    };
  }, []);

  return { automations, loading, error };
}
