import { create } from 'zustand';
import { PageConfig, ComponentConfig } from '../types';
import { validateConfig, ConfigValidationError } from '../lib/validators';

interface BuilderState {
  config: PageConfig;
  errors: ConfigValidationError[];
  history: PageConfig[];
  historyIndex: number;
  selectedComponentId: string | null;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  isPreviewMode: boolean;
  
  // Actions
  setConfig: (config: PageConfig) => void;
  updateConfigJson: (jsonString: string) => boolean; // returns true if valid
  selectComponent: (id: string | null) => void;
  updateComponent: (id: string, updated: Partial<ComponentConfig>) => void;
  addComponent: (component: ComponentConfig, parentId?: string) => void;
  removeComponent: (id: string) => void;
  setViewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  setIsPreviewMode: (isPreview: boolean) => void;
  
  // Undo / Redo
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

const DEFAULT_CONFIG: PageConfig = {
  page: "New Application",
  layout: "grid",
  columns: 2,
  components: [
    {
      id: "metric-1",
      type: "metric",
      label: "Total Sales",
      metricValue: "$24,500",
      metricChange: {
        value: "+12%",
        trend: "up",
      },
      gridSpan: 1,
    },
    {
      id: "metric-2",
      type: "metric",
      label: "Conversion Rate",
      metricValue: "4.8%",
      metricChange: {
        value: "-1.5%",
        trend: "down",
      },
      gridSpan: 1,
    },
    {
      id: "form-card",
      type: "grid",
      label: "Customer Information Form",
      gridSpan: 2,
      components: [
        {
          id: "input-name",
          type: "input",
          label: "Full Name",
          placeholder: "Jane Doe",
          validation: { required: true },
        },
        {
          id: "input-email",
          type: "email",
          label: "Email Address",
          placeholder: "jane@example.com",
          validation: { required: true },
        },
        {
          id: "btn-submit",
          type: "button",
          label: "Submit Form",
          variant: "primary",
        }
      ]
    }
  ],
};

const pushToHistory = (history: PageConfig[], index: number, config: PageConfig) => {
  const newHistory = history.slice(0, index + 1);
  newHistory.push(JSON.parse(JSON.stringify(config))); // deep clone
  return {
    history: newHistory,
    historyIndex: newHistory.length - 1,
  };
};

export const useBuilderStore = create<BuilderState>((set, get) => ({
  config: DEFAULT_CONFIG,
  errors: [],
  history: [DEFAULT_CONFIG],
  historyIndex: 0,
  selectedComponentId: null,
  viewMode: 'desktop',
  isPreviewMode: false,

  setConfig: (config) => {
    const validation = validateConfig(config);
    const historyUpdate = pushToHistory(get().history, get().historyIndex, config);
    set({
      config,
      errors: validation.errors || [],
      ...historyUpdate,
    });
  },

  updateConfigJson: (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      const validation = validateConfig(parsed);
      
      const historyUpdate = pushToHistory(get().history, get().historyIndex, parsed);
      set({
        config: parsed,
        errors: validation.errors || [],
        ...historyUpdate,
      });
      return validation.success;
    } catch (e) {
      set({
        errors: [{ path: 'json', message: e instanceof Error ? e.message : 'Invalid JSON format' }]
      });
      return false;
    }
  },

  selectComponent: (id) => set({ selectedComponentId: id }),

  updateComponent: (id, updated) => {
    const updateRecursive = (components: ComponentConfig[]): ComponentConfig[] => {
      return components.map((comp) => {
        if (comp.id === id) {
          return { ...comp, ...updated };
        }
        if (comp.components) {
          return { ...comp, components: updateRecursive(comp.components) };
        }
        return comp;
      });
    };

    const newConfig = {
      ...get().config,
      components: updateRecursive(get().config.components),
    };

    const validation = validateConfig(newConfig);
    const historyUpdate = pushToHistory(get().history, get().historyIndex, newConfig);
    set({
      config: newConfig,
      errors: validation.errors || [],
      ...historyUpdate,
    });
  },

  addComponent: (component, parentId) => {
    const addRecursive = (components: ComponentConfig[]): ComponentConfig[] => {
      if (!parentId) {
        return [...components, component];
      }
      return components.map((comp) => {
        if (comp.id === parentId) {
          return {
            ...comp,
            components: [...(comp.components || []), component],
          };
        }
        if (comp.components) {
          return { ...comp, components: addRecursive(comp.components) };
        }
        return comp;
      });
    };

    const newComponents = addRecursive(get().config.components);
    const newConfig = { ...get().config, components: newComponents };
    const validation = validateConfig(newConfig);
    const historyUpdate = pushToHistory(get().history, get().historyIndex, newConfig);
    
    set({
      config: newConfig,
      errors: validation.errors || [],
      ...historyUpdate,
    });
  },

  removeComponent: (id) => {
    const removeRecursive = (components: ComponentConfig[]): ComponentConfig[] => {
      return components
        .filter((comp) => comp.id !== id)
        .map((comp) => {
          if (comp.components) {
            return { ...comp, components: removeRecursive(comp.components) };
          }
          return comp;
        });
    };

    const newComponents = removeRecursive(get().config.components);
    const newConfig = { ...get().config, components: newComponents };
    const validation = validateConfig(newConfig);
    const historyUpdate = pushToHistory(get().history, get().historyIndex, newConfig);

    set({
      config: newConfig,
      errors: validation.errors || [],
      selectedComponentId: get().selectedComponentId === id ? null : get().selectedComponentId,
      ...historyUpdate,
    });
  },

  setViewMode: (viewMode) => set({ viewMode }),
  setIsPreviewMode: (isPreviewMode) => set({ isPreviewMode }),

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const prevConfig = history[prevIndex];
      const validation = validateConfig(prevConfig);
      set({
        config: prevConfig,
        historyIndex: prevIndex,
        errors: validation.errors || [],
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const nextConfig = history[nextIndex];
      const validation = validateConfig(nextConfig);
      set({
        config: nextConfig,
        historyIndex: nextIndex,
        errors: validation.errors || [],
      });
    }
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,
}));
