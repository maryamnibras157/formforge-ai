import { z } from 'zod';

const componentTypeSchema = z.enum([
  'input',
  'email',
  'password',
  'select',
  'checkbox',
  'radio',
  'textarea',
  'button',
  'table',
  'metric',
  'chart',
  'grid',
  'tabs',
  'modal',
  'alert',
]);

export const validationRuleSchema = z.object({
  required: z.boolean().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  pattern: z.string().optional(),
  errorMessage: z.string().optional(),
}).optional();

export const componentOptionSchema = z.union([
  z.string(),
  z.object({
    label: z.string(),
    value: z.string(),
  }),
]);

// Recursive Zod schema for nested components
export const componentConfigSchema: any = z.lazy(() =>
  z.object({
    id: z.string({ required_error: "Component ID is required" }),
    type: componentTypeSchema,
    label: z.string({ required_error: "Label is required for components" }),
    name: z.string().optional(),
    placeholder: z.string().optional(),
    defaultValue: z.any().optional(),
    options: z.array(componentOptionSchema).optional(),
    validation: validationRuleSchema,
    gridSpan: z.number().min(1).max(12).optional(),
    variant: z.enum(['primary', 'secondary', 'danger', 'outline']).optional(),
    chartType: z.enum(['line', 'bar', 'area', 'pie']).optional(),
    metricValue: z.string().optional(),
    metricChange: z.object({
      value: z.string(),
      trend: z.enum(['up', 'down', 'neutral']),
    }).optional(),
    components: z.array(componentConfigSchema).optional(),
    conditional: z.object({
      field: z.string(),
      operator: z.enum(['equals', 'not_equals', 'contains']),
      value: z.any(),
    }).optional(),
  })
);

export const pageConfigSchema = z.object({
  page: z.string({ required_error: "Page title is required" }),
  layout: z.enum(['grid', 'vertical', 'horizontal'], {
    invalid_type_error: "Layout must be grid, vertical, or horizontal",
  }),
  columns: z.number().min(1).max(12).optional(),
  components: z.array(componentConfigSchema, {
    required_error: "At least one component is required",
  }),
});

export interface ConfigValidationError {
  path: string;
  message: string;
}

export function validateConfig(config: any): { success: boolean; data?: any; errors?: ConfigValidationError[] } {
  try {
    const validated = pageConfigSchema.parse(config);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      return { success: false, errors: formattedErrors };
    }
    return { success: false, errors: [{ path: 'unknown', message: 'An unknown error occurred during validation' }] };
  }
}
