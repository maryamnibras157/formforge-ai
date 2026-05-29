'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { PageConfig, ComponentConfig } from '../../types';

interface DynamicFormProps {
  config: PageConfig;
  onSubmitSuccess?: (data: Record<string, any>) => void;
  readOnly?: boolean;
}

export default function DynamicForm({ config, onSubmitSuccess, readOnly = false }: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  // Seed default values from component configurations
  useEffect(() => {
    const defaults: Record<string, any> = {};
    const extractDefaults = (components: ComponentConfig[]) => {
      components.forEach((comp) => {
        if (comp.name) {
          defaults[comp.name] = comp.defaultValue !== undefined ? comp.defaultValue : '';
        }
        if (comp.components) {
          extractDefaults(comp.components);
        }
      });
    };
    extractDefaults(config.components);
    setFormData(defaults);
    setErrors({});
    setSubmitStatus('idle');
  }, [config]);

  // Form Field Value Change Handler
  const handleChange = (name: string, value: any) => {
    if (readOnly) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when editing field
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  // Evaluate conditional display logic
  const shouldRenderField = (comp: ComponentConfig): boolean => {
    if (!comp.conditional) return true;
    const { field, operator, value } = comp.conditional;
    const targetVal = formData[field];

    if (operator === 'equals') {
      return String(targetVal) === String(value);
    }
    if (operator === 'not_equals') {
      return String(targetVal) !== String(value);
    }
    if (operator === 'contains') {
      return typeof targetVal === 'string' && targetVal.toLowerCase().includes(String(value).toLowerCase());
    }
    return true;
  };

  // Field validation processor
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const validateRecursive = (components: ComponentConfig[]) => {
      components.forEach((comp) => {
        if (!shouldRenderField(comp)) return; // Skip validation for hidden conditional fields
        
        if (comp.name) {
          const val = formData[comp.name];
          const rules = comp.validation;

          if (rules) {
            // Required validation
            if (rules.required && (val === undefined || val === null || val === '')) {
              newErrors[comp.name] = rules.errorMessage || `${comp.label} is required`;
            }
            
            // Email pattern validation
            if (comp.type === 'email' && val && !/\S+@\S+\.\S+/.test(val)) {
              newErrors[comp.name] = 'Invalid email address';
            }

            // Min length validation
            if (rules.min && typeof val === 'string' && val.length < rules.min) {
              newErrors[comp.name] = `Must be at least ${rules.min} characters`;
            }

            // Max length validation
            if (rules.max && typeof val === 'string' && val.length > rules.max) {
              newErrors[comp.name] = `Must be less than ${rules.max} characters`;
            }

            // Regex pattern validation
            if (rules.pattern && val) {
              try {
                const regex = new RegExp(rules.pattern);
                if (!regex.test(val)) {
                  newErrors[comp.name] = rules.errorMessage || 'Invalid format';
                }
              } catch (e) {
                console.error("Invalid regex: ", rules.pattern);
              }
            }
          }
        }

        if (comp.components) {
          validateRecursive(comp.components);
        }
      });
    };

    validateRecursive(config.components);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;

    if (!validateForm()) {
      setSubmitStatus('error');
      setStatusMessage('Please fix all field validation errors before submitting.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Mock network latency for API generation simulator
      await new Promise((resolve) => setTimeout(resolve, 1200));
      
      setSubmitStatus('success');
      setStatusMessage('Form data submitted and stored successfully!');
      
      if (onSubmitSuccess) {
        onSubmitSuccess(formData);
      }
    } catch (err) {
      setSubmitStatus('error');
      setStatusMessage('Network submission error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderer for components recursively
  const renderComponent = (comp: ComponentConfig): React.ReactNode => {
    if (!shouldRenderField(comp)) return null;

    const error = comp.name ? errors[comp.name] : null;

    switch (comp.type) {
      case 'input':
      case 'email':
      case 'password':
        return (
          <div key={comp.id} className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-semibold text-zinc-400 tracking-wide uppercase">
              {comp.label} {comp.validation?.required && <span className="text-red-400">*</span>}
            </label>
            <input
              type={comp.type === 'password' ? 'password' : 'text'}
              name={comp.name}
              value={formData[comp.name || ''] || ''}
              onChange={(e) => handleChange(comp.name || '', e.target.value)}
              placeholder={comp.placeholder}
              disabled={readOnly || isSubmitting}
              className={`w-full glass-input py-2.5 px-4 rounded-xl text-sm ${
                error ? 'border-red-500/50 focus:border-red-500 focus:shadow-[0_0_12px_rgba(239,68,68,0.2)]' : ''
              }`}
            />
            {error && <span className="text-xs text-red-400 flex items-center gap-1 mt-0.5"><AlertCircle className="w-3 h-3" /> {error}</span>}
          </div>
        );

      case 'textarea':
        return (
          <div key={comp.id} className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-semibold text-zinc-400 tracking-wide uppercase">
              {comp.label} {comp.validation?.required && <span className="text-red-400">*</span>}
            </label>
            <textarea
              name={comp.name}
              value={formData[comp.name || ''] || ''}
              onChange={(e) => handleChange(comp.name || '', e.target.value)}
              placeholder={comp.placeholder}
              rows={4}
              disabled={readOnly || isSubmitting}
              className={`w-full glass-input py-2.5 px-4 rounded-xl text-sm min-h-[100px] ${
                error ? 'border-red-500/50 focus:border-red-500' : ''
              }`}
            />
            {error && <span className="text-xs text-red-400 flex items-center gap-1 mt-0.5"><AlertCircle className="w-3 h-3" /> {error}</span>}
          </div>
        );

      case 'select':
        return (
          <div key={comp.id} className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-semibold text-zinc-400 tracking-wide uppercase">
              {comp.label} {comp.validation?.required && <span className="text-red-400">*</span>}
            </label>
            <select
              name={comp.name}
              value={formData[comp.name || ''] || ''}
              onChange={(e) => handleChange(comp.name || '', e.target.value)}
              disabled={readOnly || isSubmitting}
              className="w-full glass-input py-2.5 px-4 rounded-xl text-sm appearance-none cursor-pointer bg-zinc-950/80"
            >
              <option value="" disabled className="bg-zinc-950">Select preference...</option>
              {comp.options?.map((opt, i) => {
                const label = typeof opt === 'string' ? opt : opt.label;
                const val = typeof opt === 'string' ? opt : opt.value;
                return (
                  <option key={i} value={val} className="bg-zinc-950 text-white">
                    {label}
                  </option>
                );
              })}
            </select>
            {error && <span className="text-xs text-red-400 flex items-center gap-1 mt-0.5"><AlertCircle className="w-3 h-3" /> {error}</span>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={comp.id} className="flex items-start gap-3 w-full py-2">
            <input
              type="checkbox"
              id={comp.id}
              name={comp.name}
              checked={!!formData[comp.name || '']}
              onChange={(e) => handleChange(comp.name || '', e.target.checked)}
              disabled={readOnly || isSubmitting}
              className="w-4 h-4 rounded text-blue-500 bg-zinc-950 border-zinc-700/50 focus:ring-blue-500/50 cursor-pointer mt-0.5"
            />
            <div className="flex flex-col">
              <label htmlFor={comp.id} className="text-sm font-medium text-zinc-300 cursor-pointer select-none">
                {comp.label}
              </label>
              {error && <span className="text-xs text-red-400 flex items-center gap-1 mt-0.5"><AlertCircle className="w-3 h-3" /> {error}</span>}
            </div>
          </div>
        );

      case 'radio':
        return (
          <div key={comp.id} className="flex flex-col gap-2 w-full">
            <label className="text-xs font-semibold text-zinc-400 tracking-wide uppercase">
              {comp.label} {comp.validation?.required && <span className="text-red-400">*</span>}
            </label>
            <div className="flex flex-wrap gap-4 py-1">
              {comp.options?.map((opt, i) => {
                const label = typeof opt === 'string' ? opt : opt.label;
                const val = typeof opt === 'string' ? opt : opt.value;
                const isChecked = String(formData[comp.name || '']) === String(val);
                return (
                  <label key={i} className="flex items-center gap-2 cursor-pointer text-sm text-zinc-300">
                    <input
                      type="radio"
                      name={comp.name}
                      value={val}
                      checked={isChecked}
                      onChange={() => handleChange(comp.name || '', val)}
                      disabled={readOnly || isSubmitting}
                      className="w-4 h-4 text-blue-500 bg-zinc-900 border-zinc-700 focus:ring-blue-500 focus:ring-offset-zinc-900"
                    />
                    {label}
                  </label>
                );
              })}
            </div>
            {error && <span className="text-xs text-red-400 flex items-center gap-1 mt-0.5"><AlertCircle className="w-3 h-3" /> {error}</span>}
          </div>
        );

      case 'button':
        return (
          <button
            key={comp.id}
            type="submit"
            disabled={readOnly || isSubmitting}
            className={`w-full py-3 px-6 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
              comp.variant === 'secondary'
                ? 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700/80 border border-zinc-700/50'
                : comp.variant === 'danger'
                ? 'bg-red-950/80 text-red-200 border border-red-500/30 hover:bg-red-900'
                : 'bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:from-blue-500 hover:to-violet-500 shadow-lg shadow-violet-500/10'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving Submission...
              </>
            ) : (
              comp.label
            )}
          </button>
        );

      case 'alert':
        return (
          <div
            key={comp.id}
            className={`w-full p-4 rounded-xl border flex gap-3 text-sm leading-relaxed ${
              comp.variant === 'danger'
                ? 'bg-red-950/20 border-red-500/20 text-red-300'
                : comp.variant === 'primary'
                ? 'bg-blue-950/20 border-blue-500/20 text-blue-300'
                : 'bg-zinc-900/60 border-zinc-700/40 text-zinc-300'
            }`}
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-semibold mb-0.5">{comp.label}</p>
              {comp.placeholder && <p className="text-xs opacity-80">{comp.placeholder}</p>}
            </div>
          </div>
        );

      case 'grid':
        return (
          <div key={comp.id} className="w-full glass-panel p-6 rounded-2xl flex flex-col gap-4 glow-violet/5">
            <h3 className="text-sm font-semibold tracking-wider text-zinc-300 uppercase border-b border-zinc-800/60 pb-3">
              {comp.label}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {comp.components?.map((nested) => (
                <div key={nested.id} className={nested.gridSpan === 2 ? 'col-span-1 md:col-span-2' : 'col-span-1'}>
                  {renderComponent(nested)}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      {/* Notifications Alert Banner */}
      <AnimatePresence mode="wait">
        {submitStatus !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-xl border flex gap-3 text-sm items-center ${
              submitStatus === 'success'
                ? 'bg-green-950/30 border-green-500/30 text-green-300'
                : 'bg-red-950/30 border-red-500/30 text-red-300'
            }`}
          >
            {submitStatus === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span className="font-medium">{statusMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-4">
        {config.components.map((comp) => {
          // In standard vertical/horizontal form layouts, cards stretch full width
          return (
            <div key={comp.id} className="w-full">
              {renderComponent(comp)}
            </div>
          );
        })}
      </div>
    </form>
  );
}
