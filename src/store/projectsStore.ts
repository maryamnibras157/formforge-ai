import { create } from 'zustand';
import { Project, PageConfig } from '../types';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface ProjectsState {
  projects: Project[];
  activeProject: Project | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  toasts: Toast[];

  // Toast actions
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;

  // Setters
  setSearchQuery: (query: string) => void;
  setActiveProject: (project: Project | null) => void;

  // Thunk actions
  fetchProjects: () => Promise<void>;
  fetchProjectById: (id: string) => Promise<Project | null>;
  createProject: (name: string, description: string, layout: 'grid' | 'vertical' | 'horizontal') => Promise<Project | null>;
  updateProjectConfig: (id: string, config: PageConfig) => Promise<boolean>;
  updateProjectDetails: (id: string, name: string, description: string) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  duplicateProject: (id: string) => Promise<boolean>;
  installTemplate: (templateId: string, name: string, description: string) => Promise<Project | null>;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  activeProject: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  toasts: [],

  addToast: (message, type) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    // Auto-remove after 4 seconds
    setTimeout(() => {
      get().removeToast(id);
    }, 4000);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  setActiveProject: (activeProject) => set({ activeProject }),

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error('Failed to load project database');
      const data = await res.json();
      set({ projects: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Error loading projects', isLoading: false });
      get().addToast('Error fetching projects. Using client sandbox.', 'error');
    }
  },

  fetchProjectById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`/api/projects/${id}`);
      if (!res.ok) throw new Error('Project not found');
      const project = await res.json();
      set({ activeProject: project, isLoading: false });
      return project;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      // In-memory recovery for active fallback
      const match = get().projects.find((p) => p.id === id);
      if (match) {
        set({ activeProject: match });
        return match;
      }
      return null;
    }
  },

  createProject: async (name, description, layout) => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, layout }),
      });
      if (!res.ok) throw new Error('Failed to record project');
      const newProj = await res.json();
      set((state) => ({
        projects: [newProj, ...state.projects],
        isLoading: false,
      }));
      get().addToast('Application layout initialized successfully!', 'success');
      return newProj;
    } catch (err: any) {
      set({ isLoading: false });
      get().addToast('Error creating project configuration.', 'error');
      return null;
    }
  },

  updateProjectConfig: async (id, config) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config }),
      });
      if (!res.ok) throw new Error('Failed to update config in server');
      const updatedProj = await res.json();
      
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? updatedProj : p)),
        activeProject: state.activeProject?.id === id ? updatedProj : state.activeProject,
      }));
      get().addToast('Compiled layout saved to active runtime!', 'success');
      return true;
    } catch (err: any) {
      get().addToast('Saved locally. Server failed to synchronize.', 'warning');
      // Optimistic local state update
      set((state) => {
        const updated = state.projects.map((p) => {
          if (p.id === id) {
            return { ...p, config, updatedAt: new Date() };
          }
          return p;
        });
        const active = state.activeProject?.id === id 
          ? { ...state.activeProject, config, updatedAt: new Date() } 
          : state.activeProject;
        return { projects: updated, activeProject: active };
      });
      return true;
    }
  },

  updateProjectDetails: async (id, name, description) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });
      if (!res.ok) throw new Error('Failed to update project metadata');
      const updatedProj = await res.json();

      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? updatedProj : p)),
        activeProject: state.activeProject?.id === id ? updatedProj : state.activeProject,
      }));
      get().addToast('Project details successfully renamed.', 'success');
      return true;
    } catch (err: any) {
      get().addToast('Error saving project details.', 'error');
      return false;
    }
  },

  deleteProject: async (id) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete project');
      
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        activeProject: state.activeProject?.id === id ? null : state.activeProject,
      }));
      get().addToast('Metadata configuration permanent archives purged.', 'info');
      return true;
    } catch (err: any) {
      get().addToast('Error removing project config.', 'error');
      return false;
    }
  },

  duplicateProject: async (id) => {
    try {
      const res = await fetch(`/api/projects/${id}/duplicate`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to clone project');
      const duplicatedProj = await res.json();

      set((state) => ({
        projects: [...state.projects, duplicatedProj],
      }));
      get().addToast('Cloned runtime metadata configuration successfully.', 'success');
      return true;
    } catch (err: any) {
      get().addToast('Error duplicating project config.', 'error');
      return false;
    }
  },

  installTemplate: async (templateId, name, description) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/templates/${templateId}/install`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });
      if (!res.ok) throw new Error('Failed to install template layout');
      const installedProj = await res.json();

      set((state) => ({
        projects: [installedProj, ...state.projects],
        activeProject: installedProj,
        isLoading: false,
      }));
      get().addToast(`Template '${name}' successfully installed to builder!`, 'success');
      return installedProj;
    } catch (err: any) {
      set({ isLoading: false });
      get().addToast('Error installing library template config.', 'error');
      return null;
    }
  },
}));
