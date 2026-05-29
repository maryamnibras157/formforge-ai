'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border border-violet-500/10 border-t-violet-500 animate-spin absolute" />
        <Loader2 className="w-5 h-5 text-blue-400 animate-pulse" />
      </div>
      
      <div className="flex flex-col gap-1 mt-2">
        <h3 className="text-sm font-bold text-zinc-200">Assembling Runtime Interface</h3>
        <p className="text-xs text-zinc-500">Compiling metadata schemas and loading active dashboard components...</p>
      </div>
    </div>
  );
}
