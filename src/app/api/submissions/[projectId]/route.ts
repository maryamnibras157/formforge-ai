import { NextResponse } from 'next/server';
import { projectService } from '@/lib/services';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const list = await projectService.getSubmissions(projectId);
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const body = await request.json();

    const project = await projectService.getProject(projectId);
    if (!project) {
      return NextResponse.json({ error: 'Project configuration not active' }, { status: 404 });
    }

    const newSubmission = await projectService.createSubmission(projectId, body);

    // Dynamic logging of the incoming API request!
    await projectService.createApiRequest(
      projectId,
      `/api/submissions/${projectId}`,
      'POST',
      201,
      Math.floor(Math.random() * 80) + 10
    );

    return NextResponse.json(newSubmission);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
