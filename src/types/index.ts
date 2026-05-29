export type ComponentType =
  | 'input'
  | 'email'
  | 'password'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'textarea'
  | 'button'
  | 'table'
  | 'metric'
  | 'chart'
  | 'grid'
  | 'tabs'
  | 'modal'
  | 'alert';

export interface ComponentOption {
  label: string;
  value: string;
}

export interface ComponentValidation {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  errorMessage?: string;
}

export interface ComponentConfig {
  id: string;
  type: ComponentType;
  label: string;
  name?: string; // used for form inputs
  placeholder?: string;
  defaultValue?: any;
  options?: (string | ComponentOption)[]; // for select, radio
  validation?: ComponentValidation;
  gridSpan?: number; // for grid layouts (1-12)
  variant?: 'primary' | 'secondary' | 'danger' | 'outline'; // for buttons/alerts
  chartType?: 'line' | 'bar' | 'area' | 'pie'; // for charts
  metricValue?: string; // for metrics (e.g. "$12,450" or dynamic)
  metricChange?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  components?: ComponentConfig[]; // for containers (tabs, grid, modal)
  conditional?: {
    field: string;
    operator: 'equals' | 'not_equals' | 'contains';
    value: any;
  };
}

export interface PageConfig {
  page: string;
  layout: 'grid' | 'vertical' | 'horizontal';
  columns?: number; // for grid layout
  components: ComponentConfig[];
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  config: PageConfig;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface ErrorLog {
  id: string;
  projectId: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  stack?: string;
  timestamp: Date;
}
