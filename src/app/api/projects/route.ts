import { NextResponse } from 'next/server';
import { projectService } from '@/lib/services';

export async function GET() {
  try {
    const list = await projectService.getProjects();
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, layout } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }
    const newProject = await projectService.createProject(name, description || '', layout || 'grid');
    return NextResponse.json(newProject);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
