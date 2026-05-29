import { ComponentType, ComponentConfig } from '../../types';

export interface RegistryItem {
  type: ComponentType;
  label: string;
  category: 'input' | 'display' | 'container' | 'action';
  description: string;
  iconName: string;
  defaultConfig: Partial<ComponentConfig>;
}

export const COMPONENT_REGISTRY: Record<ComponentType, RegistryItem> = {
  input: {
    type: 'input',
    label: 'Text Input',
    category: 'input',
    description: 'Standard single-line text input field',
    iconName: 'Type',
    defaultConfig: {
      label: 'New Text Field',
      placeholder: 'Enter text here...',
      validation: { required: false },
      gridSpan: 1,
    },
  },
  email: {
    type: 'email',
    label: 'Email Input',
    category: 'input',
    description: 'Email validation enabled text field',
    iconName: 'Mail',
    defaultConfig: {
      label: 'Email Address',
      placeholder: 'user@domain.com',
      validation: { required: true },
      gridSpan: 1,
    },
  },
  password: {
    type: 'password',
    label: 'Password Input',
    category: 'input',
    description: 'Secure hidden password input field',
    iconName: 'Lock',
    defaultConfig: {
      label: 'Password',
      placeholder: '••••••••',
      validation: { required: true, min: 8 },
      gridSpan: 1,
    },
  },
  select: {
    type: 'select',
    label: 'Select Dropdown',
    category: 'input',
    description: 'Dropdown selection list for single option select',
    iconName: 'ChevronDown',
    defaultConfig: {
      label: 'Choose Option',
      options: ['Option A', 'Option B', 'Option C'],
      validation: { required: false },
      gridSpan: 1,
    },
  },
  checkbox: {
    type: 'checkbox',
    label: 'Checkbox Option',
    category: 'input',
    description: 'Single toggle checkbox switch or multi-select list',
    iconName: 'CheckSquare',
    defaultConfig: {
      label: 'I accept terms and conditions',
      defaultValue: false,
      validation: { required: true },
      gridSpan: 1,
    },
  },
  radio: {
    type: 'radio',
    label: 'Radio Group',
    category: 'input',
    description: 'Radio button set for choosing single item from list',
    iconName: 'CircleDot',
    defaultConfig: {
      label: 'Select Preference',
      options: ['Preference One', 'Preference Two'],
      validation: { required: false },
      gridSpan: 1,
    },
  },
  textarea: {
    type: 'textarea',
    label: 'Text Area',
    category: 'input',
    description: 'Multi-line large text field for descriptive entries',
    iconName: 'AlignLeft',
    defaultConfig: {
      label: 'Detailed Comments',
      placeholder: 'Type your feedback here...',
      validation: { required: false },
      gridSpan: 2,
    },
  },
  button: {
    type: 'button',
    label: 'Action Button',
    category: 'action',
    description: 'Interactive button to trigger forms or actions',
    iconName: 'Play',
    defaultConfig: {
      label: 'Trigger Process',
      variant: 'primary',
      gridSpan: 1,
    },
  },
  table: {
    type: 'table',
    label: 'Data Table',
    category: 'display',
    description: 'Advanced responsive interactive records grid table',
    iconName: 'Table',
    defaultConfig: {
      label: 'Recent Invoices',
      gridSpan: 3,
    },
  },
  metric: {
    type: 'metric',
    label: 'Metric KPI',
    category: 'display',
    description: 'Single numeric metric stats card with dynamic progress indicators',
    iconName: 'TrendingUp',
    defaultConfig: {
      label: 'Total Revenue',
      metricValue: '$0.00',
      metricChange: {
        value: '0%',
        trend: 'neutral',
      },
      gridSpan: 1,
    },
  },
  chart: {
    type: 'chart',
    label: 'Analytics Chart',
    category: 'display',
    description: 'Interactive graphical visualization (bar, line, area, pie)',
    iconName: 'BarChart2',
    defaultConfig: {
      label: 'Monthly Trend Analytics',
      chartType: 'bar',
      gridSpan: 2,
    },
  },
  grid: {
    type: 'grid',
    label: 'Grid Panel',
    category: 'container',
    description: 'Multi-column nested container layout wrapper card',
    iconName: 'LayoutGrid',
    defaultConfig: {
      label: 'Information Panel',
      gridSpan: 3,
      components: [],
    },
  },
  tabs: {
    type: 'tabs',
    label: 'Tabs Interface',
    category: 'container',
    description: 'Organize children inside dynamic responsive tab panes',
    iconName: 'Folder',
    defaultConfig: {
      label: 'Settings Directory',
      gridSpan: 3,
      components: [],
    },
  },
  modal: {
    type: 'modal',
    label: 'Popup Dialog',
    category: 'container',
    description: 'Overlay overlay modal view with dedicated triggers',
    iconName: 'ExternalLink',
    defaultConfig: {
      label: 'Confirm Action',
      components: [],
    },
  },
  alert: {
    type: 'alert',
    label: 'Alert Banner',
    category: 'display',
    description: 'Dynamic highlight notification banner for crucial alerts',
    iconName: 'AlertTriangle',
    defaultConfig: {
      label: 'Alert Title',
      variant: 'secondary',
      placeholder: 'Important notification description details here...',
      gridSpan: 3,
    },
  },
};

export const getComponentCategory = (type: ComponentType): string => {
  return COMPONENT_REGISTRY[type]?.category || 'input';
};
