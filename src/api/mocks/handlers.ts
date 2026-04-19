import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/automations', () => {
    return HttpResponse.json([
      { id: 'send_email', label: 'Send Email', params: ['to', 'subject'] },
      { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
      { id: 'notify_slack', label: 'Notify Slack', params: ['channel', 'message'] },
    ]);
  }),

  http.post('/simulate', async ({ request }) => {
    const data = await request.json() as { nodes: any[]; edges: any[] };
    
    if (!data.nodes || !Array.isArray(data.nodes)) {
      return HttpResponse.json({ status: 'error', steps: [] }, { status: 400 });
    }

    const steps = data.nodes.map(node => {
      let status = 'completed';
      if (node.type === 'approval') status = 'pending';
      
      let message = '';
      const title = node.data?.title || node.type;
      
      switch (node.type) {
        case 'start':
          message = `Workflow started: ${title}`;
          break;
        case 'task':
          message = `Task assigned: ${title}`;
          break;
        case 'approval':
          message = `Awaiting approval: ${title}`;
          break;
        case 'automated':
          message = `Executing: ${title}`;
          break;
        case 'end':
          message = `Workflow complete: ${title}`;
          break;
        default:
          message = `Processed: ${title}`;
      }

      return {
        nodeId: node.id,
        type: node.type,
        status,
        message,
      };
    });

    return HttpResponse.json({
      status: 'success',
      steps,
    });
  }),
];
