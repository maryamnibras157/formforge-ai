import { NextResponse } from 'next/server';
import { projectService } from '@/lib/services';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const duplicated = await projectService.duplicateProject(id);
    if (!duplicated) {
      return NextResponse.json({ error: 'Project cloning failed' }, { status: 404 });
    }
    return NextResponse.json(duplicated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
