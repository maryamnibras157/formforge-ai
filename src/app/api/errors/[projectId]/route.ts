import { NextResponse } from 'next/server';
import { projectService } from '@/lib/services';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const list = await projectService.getErrorLogs(projectId);
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
    const { message, severity, stack } = await request.json();
    if (!message || !severity) {
      return NextResponse.json({ error: 'Message and severity are required' }, { status: 400 });
    }
    const newLog = await projectService.createErrorLog(projectId, message, severity, stack);
    return NextResponse.json(newLog);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
