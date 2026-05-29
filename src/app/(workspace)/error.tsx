'use client';

import React, { useEffect } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Workspace layout boundary error captured:', error);
  }, [error]);

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <div className="glass-panel p-8 rounded-3xl max-w-md w-full border border-red-500/20 glow-red/5 flex flex-col items-center gap-5">
        <div className="p-4 rounded-full bg-red-950/20 border border-red-500/30 text-red-400">
          <AlertOctagon className="w-8 h-8" />
        </div>

        <div className="flex flex-col gap-1.5">
          <h3 className="text-sm font-bold text-zinc-200">Workspace Execution Failure</h3>
          <p className="text-xs text-zinc-400 leading-normal">
            A critical boundary error occurred while compiling active UI components.
          </p>
          <div className="mt-3 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-[10px] font-mono text-zinc-500 text-left overflow-x-auto max-w-full">
            {error.message || 'Unknown compilation error'}
          </div>
        </div>

        <button
          onClick={reset}
          className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-xs font-bold text-zinc-200 flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Re-initialize Runtime
        </button>
      </div>
    </div>
  );
}
