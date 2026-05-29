import { NextResponse } from 'next/server';
import { projectService } from '@/lib/services';

export async function GET() {
  try {
    const list = await projectService.getTemplates();
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
