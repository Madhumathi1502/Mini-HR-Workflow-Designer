import type { SimulateResponse, AutomationAction } from '../types/workflow';

export async function getAutomations(): Promise<AutomationAction[]> {
  try {
    const response = await fetch('/automations');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch automations:', error);
    return [];
  }
}

export async function postSimulate(payload: { nodes: any[]; edges: any[] }): Promise<SimulateResponse> {
  try {
    const response = await fetch('/simulate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to post simulation:', error);
    return { status: 'error', steps: [] };
  }
}
