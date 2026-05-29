import { NextResponse } from 'next/server';
import { projectService } from '@/lib/services';

export async function POST(request: Request) {
  const start = Date.now();
  try {
    const { url, method, headers, body } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Try to parse projectId out of the URL path if querying submissions
    // E.g., /api/submissions/proj-1234
    let projectId = 'default-project';
    const match = url.match(/\/submissions\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      projectId = match[1];
    } else {
      // Fallback: use first active project in database
      const list = await projectService.getProjects();
      if (list.length > 0) {
        projectId = list[0].id;
      }
    }

    // Simulate network latency of the API endpoint under test
    const durationMs = Math.floor(Math.random() * 180) + 40;
    await new Promise(resolve => setTimeout(resolve, durationMs));

    // Determine mock response based on URL or inputs
    let status = 200;
    let responseData: any = { message: 'API executed successfully (Simulated response)' };

    if (method === 'POST') {
      status = 201;
      if (body) {
        try {
          const parsedBody = typeof body === 'string' ? JSON.parse(body) : body;
          responseData = {
            message: 'Record created successfully',
            submittedData: parsedBody,
            id: `sub-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date(),
          };
          
          // Actually record form submission if testing submissions!
          if (url.includes('/submissions/')) {
            await projectService.createSubmission(projectId, parsedBody);
          }
        } catch (e) {
          status = 400;
          responseData = { error: 'Invalid JSON request payload' };
        }
      }
    } else if (method === 'GET') {
      if (url.includes('/submissions/')) {
        const subs = await projectService.getSubmissions(projectId);
        responseData = subs.slice(0, 10);
      } else {
        const proj = await projectService.getProject(projectId);
        responseData = proj ? { id: proj.id, name: proj.name, config: proj.config } : { error: 'Project not found' };
      }
    }

    const elapsed = Date.now() - start;

    // Log the API request record inside the project history so it aggregates in dashboards immediately!
    await projectService.createApiRequest(
      projectId,
      url,
      method,
      status,
      elapsed
    );

    // If an error occurred, log inside the Error Monitor as well!
    if (status >= 400) {
      await projectService.createErrorLog(
        projectId,
        `Explorer Test Error: Request to ${url} failed with status ${status}`,
        status >= 500 ? 'critical' : 'error',
        JSON.stringify(responseData)
      );
    }

    return NextResponse.json({
      status,
      durationMs: elapsed,
      headers: {
        'content-type': 'application/json',
        'x-powered-by': 'FormForge AI Engine',
        'cache-control': 'no-store',
      },
      body: responseData,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
