import { NextResponse } from 'next/server';
import { projectService } from '@/lib/services';
import { getDb } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, description } = await request.json();

    // Retrieve template configs
    const templatesList = await projectService.getTemplates();
    const targetTemplate = templatesList.find((t: any) => t.id === id);

    if (!targetTemplate) {
      return NextResponse.json({ error: 'Template config not found' }, { status: 404 });
    }

    // Persist as a new active project configuration
    const db = getDb();
    const createdName = name || targetTemplate.name;
    const createdDesc = description || targetTemplate.description;
    const configData = JSON.parse(JSON.stringify(targetTemplate.config));

    let newProj;
    if (db.type === 'prisma') {
      newProj = await db.client.project.create({
        data: {
          name: createdName,
          description: createdDesc,
          config: configData,
          userId: 'demo-user'
        }
      });
    } else {
      newProj = await db.client.createProject(createdName, createdDesc, configData, 'demo-user');
    }

    return NextResponse.json(newProj);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
