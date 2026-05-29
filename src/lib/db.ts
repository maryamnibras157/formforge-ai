import { PrismaClient } from '@prisma/client';

// Global declaration for Prisma in development to prevent hot-reload duplicates
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Crash-proof In-Memory Database Fallback for development if DATABASE_URL is absent
class MemoryDB {
  private users: any[] = [];
  private projects: any[] = [];
  private submissions: any[] = [];
  private activityLogs: any[] = [];
  private errorLogs: any[] = [];
  private templates: any[] = [];
  private apiRequests: any[] = [];

  constructor() {
    // Populate some default Templates
    this.templates = [
      {
        id: "tpl-crm",
        name: "CRM Sales Pipeline",
        category: "Sales",
        description: "Manage leads, opportunities, and log customer interactions instantly.",
        popularity: 145,
        config: {
          page: "CRM Pipeline Dashboard",
          layout: "grid",
          columns: 3,
          components: [
            { id: "leads-metric", type: "metric", label: "New Leads", metricValue: "284", metricChange: { value: "+18%", trend: "up" }, gridSpan: 1 },
            { id: "revenue-metric", type: "metric", label: "Pipeline Value", metricValue: "$98,200", metricChange: { value: "+12%", trend: "up" }, gridSpan: 1 },
            { id: "winrate-metric", type: "metric", label: "Win Rate", metricValue: "24.5%", metricChange: { value: "-1.2%", trend: "neutral" }, gridSpan: 1 },
            {
              id: "leads-table",
              type: "table",
              label: "Lead Directory",
              gridSpan: 3,
            }
          ]
        }
      },
      {
        id: "tpl-feedback",
        name: "Customer Feedback Portal",
        category: "Support",
        description: "Clean responsive customer feedback collection form with validation.",
        popularity: 92,
        config: {
          page: "Feedback Intake Form",
          layout: "vertical",
          components: [
            { id: "intro-alert", type: "alert", label: "Feedback System", variant: "primary", placeholder: "Thank you for taking 2 minutes to help us improve FormForge AI!" },
            { id: "fb-name", type: "input", label: "Your Name", placeholder: "John Doe", validation: { required: true } },
            { id: "fb-email", type: "email", label: "Email Address", placeholder: "john@domain.com", validation: { required: true } },
            { id: "fb-satisfaction", type: "select", label: "Satisfaction Level", options: ["Very Satisfied", "Satisfied", "Neutral", "Unsatisfied"], validation: { required: true } },
            { id: "fb-comments", type: "textarea", label: "Detailed Comments", placeholder: "What can we improve?", validation: { required: false } },
            { id: "fb-submit", type: "button", label: "Send Feedback", variant: "primary" }
          ]
        }
      },
      {
        id: "tpl-employees",
        name: "Employee Portal Directory",
        category: "HR",
        description: "Manage employee profiles, roles, and quick search directory.",
        popularity: 78,
        config: {
          page: "Staff Directory",
          layout: "grid",
          columns: 2,
          components: [
            { id: "active-metric", type: "metric", label: "Active Employees", metricValue: "42", metricChange: { value: "+3 new", trend: "up" }, gridSpan: 1 },
            { id: "dept-metric", type: "metric", label: "Departments", metricValue: "6", metricChange: { value: "Stable", trend: "neutral" }, gridSpan: 1 },
            { id: "staff-table", type: "table", label: "All Active Staff", gridSpan: 2 }
          ]
        }
      }
    ];

    // Seed a default project
    this.projects = [
      {
        id: "default-project",
        name: "Inventory Tracker",
        description: "Dynamic CRUD inventory tracker with alert triggers.",
        config: {
          page: "Stock Management Room",
          layout: "grid",
          columns: 3,
          components: [
            { id: "stock-alert", type: "alert", label: "Critical Stock Warn", variant: "danger", placeholder: "3 inventory items are currently running low on stock." },
            { id: "total-items", type: "metric", label: "Stock Items", metricValue: "1,248", gridSpan: 1 },
            { id: "reorder-items", type: "metric", label: "Reorder Triggered", metricValue: "3", metricChange: { value: "Urgent", trend: "down" }, gridSpan: 1 },
            { id: "inventory-table", type: "table", label: "Product Catalog", gridSpan: 3 }
          ]
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "demo-user",
        isDeleted: false
      }
    ];
  }

  // Basic implementation of queries
  getProjects(userId: string) {
    return this.projects.filter(p => p.userId === userId && !p.isDeleted);
  }

  getProject(id: string) {
    return this.projects.find(p => p.id === id && !p.isDeleted) || null;
  }

  createProject(name: string, description: string, config: any, userId: string) {
    const newProj = {
      id: `proj-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      config,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId,
      isDeleted: false
    };
    this.projects.push(newProj);
    return newProj;
  }

  updateProject(id: string, updates: any) {
    const projIndex = this.projects.findIndex(p => p.id === id);
    if (projIndex > -1) {
      this.projects[projIndex] = {
        ...this.projects[projIndex],
        ...updates,
        updatedAt: new Date()
      };
      return this.projects[projIndex];
    }
    return null;
  }

  deleteProject(id: string) {
    const proj = this.getProject(id);
    if (proj) {
      proj.isDeleted = true;
      return true;
    }
    return false;
  }

  getSubmissions(projectId: string) {
    return this.submissions.filter(s => s.projectId === projectId);
  }

  createSubmission(projectId: string, data: any) {
    const newSub = {
      id: `sub-${Math.random().toString(36).substr(2, 9)}`,
      projectId,
      data,
      submittedAt: new Date()
    };
    this.submissions.push(newSub);
    return newSub;
  }

  getErrorLogs(projectId: string) {
    return this.errorLogs.filter(e => e.projectId === projectId);
  }

  createErrorLog(projectId: string, message: string, severity: string, stack?: string) {
    const newLog = {
      id: `err-${Math.random().toString(36).substr(2, 9)}`,
      projectId,
      message,
      severity,
      stack,
      timestamp: new Date()
    };
    this.errorLogs.push(newLog);
    return newLog;
  }

  getTemplates() {
    return this.templates;
  }

  getApiRequests(projectId: string) {
    return this.apiRequests.filter(r => r.projectId === projectId);
  }

  createApiRequest(projectId: string, endpoint: string, method: string, status: number, durationMs: number) {
    const newReq = {
      id: `req-${Math.random().toString(36).substr(2, 9)}`,
      projectId,
      endpoint,
      method,
      status,
      durationMs,
      timestamp: new Date()
    };
    this.apiRequests.push(newReq);
    return newReq;
  }
}

export const memoryDb = new MemoryDB();

// Dynamic DB selector helper to guarantee zero-crashes
export const getDb = () => {
  const isDbConfigured = !!process.env.DATABASE_URL;
  if (isDbConfigured) {
    return {
      type: 'prisma',
      client: prisma
    };
  } else {
    return {
      type: 'memory',
      client: memoryDb
    };
  }
};
