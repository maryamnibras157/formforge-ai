'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, HelpCircle, Code } from 'lucide-react';

interface FallbackComponentProps {
  componentType: string;
  componentLabel?: string;
  errorMsg?: string;
  onReset?: () => void;
}

export default function FallbackComponent({
  componentType,
  componentLabel = 'Dynamic Node',
  errorMsg = 'This component failed to compile or contains invalid field mappings.',
  onReset,
}: FallbackComponentProps) {
  return (
    <div className="w-full p-6 rounded-2xl bg-zinc-950/80 border border-amber-500/25 shadow-xl shadow-amber-500/5 relative overflow-hidden group">
      {/* Sleek Alert Edge Accent */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />

      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
          <AlertTriangle className="w-6 h-6 animate-pulse" />
        </div>

        <div className="flex-1 flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Runtime Warning
            </span>
            <span className="text-xs font-mono text-zinc-400">
              Type: {componentType}
            </span>
          </div>

          <h4 className="text-sm font-bold text-zinc-200">
            Unknown Component Detected: "{componentLabel}"
          </h4>
          
          <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
            {errorMsg} The runtime UI engine recovered gracefully and continues executing other active dashboard widgets.
          </p>

          {/* Quick Resolution Blueprint Tips */}
          <div className="mt-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/40 text-xs text-zinc-400 flex flex-col gap-2">
            <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-zinc-400" /> Recovery suggestions:
            </span>
            <ul className="list-disc list-inside space-y-1 pl-1 text-[11px]">
              <li>Verify the component type is registered in the FormForge Component Registry (e.g., use <code className="text-blue-400">input</code>, not <code className="text-blue-400">input-pro</code>).</li>
              <li>Check for missing attributes in your JSON config schema (e.g. valid <code className="text-violet-400">options</code> arrays).</li>
              <li>Ensure the schema compiles against Zod validation models in the editor panel.</li>
            </ul>
          </div>
        </div>

        {/* Diagnostic Action buttons */}
        <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0 mt-3 sm:mt-0">
          {onReset && (
            <button
              onClick={onReset}
              className="flex-1 sm:flex-initial py-2 px-3.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/60 text-xs font-medium text-zinc-200 flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Re-render
            </button>
          )}
          <a
            href="#json-editor"
            className="flex-1 sm:flex-initial py-2 px-3.5 rounded-lg bg-blue-950/40 hover:bg-blue-900/40 border border-blue-500/20 text-xs font-medium text-blue-300 flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer text-center"
          >
            <Code className="w-3.5 h-3.5" /> Edit JSON
          </a>
        </div>
      </div>
    </div>
  );
}

// React Error Boundary Wrapper for robust crash protection
export class ComponentErrorBoundary extends React.Component<
  { children: React.ReactNode; componentType: string; componentLabel?: string },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("FormForge component crash captured:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <FallbackComponent
          componentType={this.props.componentType}
          componentLabel={this.props.componentLabel}
          errorMsg={this.state.error?.message || 'A critical rendering error occurred inside this component.'}
          onReset={() => this.setState({ hasError: false, error: null })}
        />
      );
    }
    return this.props.children;
  }
}
