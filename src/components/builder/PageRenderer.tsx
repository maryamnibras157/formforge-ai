'use client';

import React from 'react';
import { COMPONENT_REGISTRY } from '../../lib/runtime/registry';
import { PageConfig, ComponentConfig } from '../../types';
import { ComponentErrorBoundary } from '../fallback/FallbackComponent';
import DynamicForm from '../forms/DynamicForm';
import DynamicTable from '../tables/DynamicTable';
import DynamicChart from '../charts/DynamicChart';
import { ArrowUpRight, ArrowDownRight, Minus, AlertTriangle, Play, HelpCircle } from 'lucide-react';

interface PageRendererProps {
  config: PageConfig;
  readOnly?: boolean;
}

export default function PageRenderer({ config, readOnly = false }: PageRendererProps) {
  
  // Render an individual component based on its registration
  const renderSingleComponent = (comp: ComponentConfig): React.ReactNode => {
    // Check if the component type is registered
    const registryInfo = COMPONENT_REGISTRY[comp.type];
    if (!registryInfo) {
      throw new Error(`Unknown component type detected: "${comp.type}"`);
    }

    switch (comp.type) {
      // Metric KPI Card
      case 'metric':
        const trend = comp.metricChange?.trend || 'neutral';
        return (
          <div key={comp.id} className="glass-panel p-5 rounded-2xl glow-blue/5 flex flex-col justify-between h-full group hover:border-zinc-700/60 transition-colors">
            <span className="text-xs font-semibold text-zinc-400 tracking-wide uppercase">
              {comp.label}
            </span>
            <div className="flex items-baseline justify-between mt-2.5">
              <span className="text-2xl font-bold tracking-tight text-zinc-100">
                {comp.metricValue || '$0.00'}
              </span>
              {comp.metricChange && (
                <div
                  className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded ${
                    trend === 'up'
                      ? 'bg-green-950/45 text-green-400 border border-green-500/20'
                      : trend === 'down'
                      ? 'bg-red-950/45 text-red-400 border border-red-500/20'
                      : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                  }`}
                >
                  {trend === 'up' ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : trend === 'down' ? (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  ) : (
                    <Minus className="w-3.5 h-3.5" />
                  )}
                  {comp.metricChange.value}
                </div>
              )}
            </div>
          </div>
        );

      // Data Table Component
      case 'table':
        return (
          <div key={comp.id} className="w-full glass-panel p-6 rounded-2xl hover:border-zinc-700/60 transition-colors">
            <h3 className="text-sm font-bold tracking-wide text-zinc-200 mb-4">{comp.label}</h3>
            <DynamicTable label={comp.label} readOnly={readOnly} />
          </div>
        );

      // Analytics Chart Card
      case 'chart':
        return (
          <div key={comp.id} className="glass-panel p-6 rounded-2xl glow-violet/5 hover:border-zinc-700/60 transition-colors h-full flex flex-col">
            <h3 className="text-sm font-bold tracking-wide text-zinc-200 mb-4">{comp.label}</h3>
            <div className="flex-1 min-h-[280px]">
              <DynamicChart label={comp.label} chartType={comp.chartType || 'bar'} />
            </div>
          </div>
        );

      // Recursive Grid Container
      case 'grid':
        return (
          <div key={comp.id} className="w-full glass-panel p-6 rounded-2xl glow-violet/5 flex flex-col gap-4">
            <h3 className="text-sm font-semibold tracking-wider text-zinc-400 uppercase border-b border-zinc-800/80 pb-3">
              {comp.label}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {comp.components?.map((nested) => {
                const nestedSpan = nested.gridSpan || 1;
                let spanClass = 'col-span-1';
                if (nestedSpan === 2) spanClass = 'col-span-1 md:col-span-2';
                if (nestedSpan >= 3) spanClass = 'col-span-1 md:col-span-2 lg:col-span-3';

                return (
                  <div key={nested.id} className={spanClass}>
                    <ComponentErrorBoundary componentType={nested.type} componentLabel={nested.label}>
                      {renderSingleComponent(nested)}
                    </ComponentErrorBoundary>
                  </div>
                );
              })}
            </div>
          </div>
        );

      // Active Alert Banner
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
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-semibold mb-0.5">{comp.label}</p>
              {comp.placeholder && <p className="text-xs opacity-80">{comp.placeholder}</p>}
            </div>
          </div>
        );

      // Dynamic Form Engine component
      default:
        // Inputs are treated as standard inputs in a global DynamicForm wrapper
        // If an input is listed standalone in components list, we wrap it in a standalone single-input form for clean display!
        if (['input', 'email', 'password', 'select', 'checkbox', 'radio', 'textarea', 'button'].includes(comp.type)) {
          const mockFormConfig: PageConfig = {
            page: comp.label,
            layout: 'vertical',
            components: [comp]
          };
          return (
            <div key={comp.id} className="glass-panel p-6 rounded-2xl hover:border-zinc-700/60 transition-colors">
              <DynamicForm config={mockFormConfig} readOnly={readOnly} />
            </div>
          );
        }
        
        throw new Error(`Unsupported component type: "${comp.type}"`);
    }
  };

  // Check if all primary page elements are input elements
  const isAllInputs = config.components.every(comp => 
    ['input', 'email', 'password', 'select', 'checkbox', 'radio', 'textarea', 'button', 'alert', 'grid'].includes(comp.type)
  );

  // Layout wrapper generator
  const renderLayout = () => {
    // If it's pure input form elements, render it inside a unified interactive form sheet
    if (isAllInputs) {
      return (
        <div className="w-full glass-panel p-8 rounded-2xl border border-zinc-800 glow-violet/5">
          <DynamicForm config={config} readOnly={readOnly} />
        </div>
      );
    }

    // Grid layout for metric cards, tables, charts
    if (config.layout === 'grid') {
      const cols = config.columns || 3;
      
      let gridClass = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      if (cols === 1) gridClass = 'grid-cols-1';
      if (cols === 2) gridClass = 'grid-cols-1 md:grid-cols-2';
      if (cols >= 4) gridClass = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

      return (
        <div className={`grid ${gridClass} gap-5 w-full`}>
          {config.components.map((comp) => {
            const span = comp.gridSpan || 1;
            let spanClass = 'col-span-1';
            
            if (span === 2) {
              spanClass = 'col-span-1 md:col-span-2';
            } else if (span >= 3) {
              spanClass = 'col-span-1 md:col-span-2 lg:col-span-3';
              if (cols >= 4) spanClass = 'col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4';
            }

            return (
              <div key={comp.id} className={spanClass}>
                <ComponentErrorBoundary componentType={comp.type} componentLabel={comp.label}>
                  {renderSingleComponent(comp)}
                </ComponentErrorBoundary>
              </div>
            );
          })}
        </div>
      );
    }

    // Vertical simple flow layout
    if (config.layout === 'vertical') {
      return (
        <div className="flex flex-col gap-5 w-full">
          {config.components.map((comp) => (
            <div key={comp.id} className="w-full">
              <ComponentErrorBoundary componentType={comp.type} componentLabel={comp.label}>
                {renderSingleComponent(comp)}
              </ComponentErrorBoundary>
            </div>
          ))}
        </div>
      );
    }

    // Horizontal flex flow layout
    return (
      <div className="flex flex-col md:flex-row gap-5 w-full">
        {config.components.map((comp) => (
          <div key={comp.id} className="flex-1 w-full md:w-auto">
            <ComponentErrorBoundary componentType={comp.type} componentLabel={comp.label}>
              {renderSingleComponent(comp)}
            </ComponentErrorBoundary>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Dynamic Header */}
      <div className="flex flex-col gap-1.5 border-b border-zinc-800/60 pb-5">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-100">
          {config.page}
        </h2>
        <span className="text-xs text-zinc-400 font-medium">
          Metadata Runtime Application · Layout: <strong className="text-blue-400 capitalize">{config.layout}</strong>
        </span>
      </div>

      {/* Main Layout Area */}
      {renderLayout()}
    </div>
  );
}
