import { getDb } from './db';
import { Project, PageConfig } from '../types';

const DEMO_USER_ID = 'demo-user';

export const projectService = {
  async getProjects() {
    const db = getDb();
    if (db.type === 'prisma') {
      return await db.client.project.findMany({
        where: { userId: DEMO_USER_ID, isDeleted: false },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      return db.client.getProjects(DEMO_USER_ID);
    }
  },

  async getProject(id: string) {
    const db = getDb();
    if (db.type === 'prisma') {
      return await db.client.project.findUnique({
        where: { id, isDeleted: false },
      });
    } else {
      return db.client.getProject(id);
    }
  },

  async createProject(name: string, description: string, layout: 'grid' | 'vertical' | 'horizontal') {
    const db = getDb();
    const defaultConfig: PageConfig = {
      page: name,
      layout,
      columns: layout === 'grid' ? 3 : undefined,
      components: [
        {
          id: `metric-${Math.random().toString(36).substr(2, 5)}`,
          type: 'metric',
          label: 'Total Page Visits',
          metricValue: '1,048',
          metricChange: {
            value: '+15%',
            trend: 'up'
          },
          gridSpan: 1,
        },
        {
          id: `form-card-${Math.random().toString(36).substr(2, 5)}`,
          type: 'grid',
          label: 'Form Intake Core',
          gridSpan: 2,
          components: [
            {
              id: `input-name-${Math.random().toString(36).substr(2, 5)}`,
              type: 'input',
              label: 'Full Name',
              placeholder: 'John Doe',
              validation: { required: true }
            },
            {
              id: `input-email-${Math.random().toString(36).substr(2, 5)}`,
              type: 'email',
              label: 'Email',
              placeholder: 'john@domain.com',
              validation: { required: true }
            },
            {
              id: `btn-submit-${Math.random().toString(36).substr(2, 5)}`,
              type: 'button',
              label: 'Submit Registration',
              variant: 'primary'
            }
          ]
        }
      ],
    };

    if (db.type === 'prisma') {
      return await db.client.project.create({
        data: {
          name,
          description,
          config: defaultConfig as any,
          userId: DEMO_USER_ID,
        },
      });
    } else {
      return db.client.createProject(name, description, defaultConfig, DEMO_USER_ID);
    }
  },

  async updateProject(id: string, updates: Partial<Project>) {
    const db = getDb();
    const cleanUpdates: any = {};
    if (updates.name !== undefined) cleanUpdates.name = updates.name;
    if (updates.description !== undefined) cleanUpdates.description = updates.description;
    if (updates.config !== undefined) cleanUpdates.config = updates.config as any;

    if (db.type === 'prisma') {
      return await db.client.project.update({
        where: { id },
        data: cleanUpdates,
      });
    } else {
      return db.client.updateProject(id, cleanUpdates);
    }
  },

  async deleteProject(id: string) {
    const db = getDb();
    if (db.type === 'prisma') {
      await db.client.project.update({
        where: { id },
        data: { isDeleted: true },
      });
      return true;
    } else {
      return db.client.deleteProject(id);
    }
  },

  async duplicateProject(id: string) {
    const project = await this.getProject(id);
    if (!project) return null;

    const db = getDb();
    const duplicatedName = `${project.name} (Copy)`;
    const duplicatedDesc = project.description || '';
    const duplicatedConfig = JSON.parse(JSON.stringify(project.config));

    if (db.type === 'prisma') {
      return await db.client.project.create({
        data: {
          name: duplicatedName,
          description: duplicatedDesc,
          config: duplicatedConfig,
          userId: DEMO_USER_ID,
        },
      });
    } else {
      return db.client.createProject(duplicatedName, duplicatedDesc, duplicatedConfig, DEMO_USER_ID);
    }
  },

  async getTemplates() {
    const db = getDb();
    if (db.type === 'prisma') {
      // Seed templates if database has none
      let list = await db.client.template.findMany();
      if (list.length === 0) {
        const memoryTemplates = db.client.getTemplates();
        for (const t of memoryTemplates) {
          await db.client.template.create({
            data: {
              id: t.id,
              name: t.name,
              category: t.category,
              description: t.description,
              config: t.config as any,
              popularity: t.popularity,
            }
          });
        }
        list = await db.client.template.findMany();
      }
      return list;
    } else {
      return db.client.getTemplates();
    }
  },

  async getSubmissions(projectId: string) {
    const db = getDb();
    if (db.type === 'prisma') {
      return await db.client.formSubmission.findMany({
        where: { projectId },
        orderBy: { submittedAt: 'desc' },
      });
    } else {
      return db.client.getSubmissions(projectId);
    }
  },

  async createSubmission(projectId: string, data: any) {
    const db = getDb();
    if (db.type === 'prisma') {
      return await db.client.formSubmission.create({
        data: {
          projectId,
          data: data as any,
        },
      });
    } else {
      return db.client.createSubmission(projectId, data);
    }
  },

  async getErrorLogs(projectId: string) {
    const db = getDb();
    if (db.type === 'prisma') {
      return await db.client.errorLog.findMany({
        where: { projectId },
        orderBy: { timestamp: 'desc' },
      });
    } else {
      return db.client.getErrorLogs(projectId);
    }
  },

  async createErrorLog(projectId: string, message: string, severity: 'info' | 'warning' | 'error' | 'critical', stack?: string) {
    const db = getDb();
    if (db.type === 'prisma') {
      return await db.client.errorLog.create({
        data: {
          projectId,
          message,
          severity,
          stack,
        },
      });
    } else {
      return db.client.createErrorLog(projectId, message, severity, stack);
    }
  },

  async getApiRequests(projectId: string) {
    const db = getDb();
    if (db.type === 'prisma') {
      return await db.client.apiRequest.findMany({
        where: { projectId },
        orderBy: { timestamp: 'desc' },
      });
    } else {
      return db.client.getApiRequests(projectId);
    }
  },

  async createApiRequest(projectId: string, endpoint: string, method: string, status: number, durationMs: number) {
    const db = getDb();
    if (db.type === 'prisma') {
      return await db.client.apiRequest.create({
        data: {
          projectId,
          endpoint,
          method,
          status,
          durationMs,
        },
      });
    } else {
      return db.client.createApiRequest(projectId, endpoint, method, status, durationMs);
    }
  },
};
