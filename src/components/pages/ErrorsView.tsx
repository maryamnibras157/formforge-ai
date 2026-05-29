'use client';

import React, { useState } from 'react';
import { AlertOctagon, Terminal, Search, Activity, ChevronRight, HelpCircle } from 'lucide-react';

interface ErrorLogItem {
  id: string;
  app: string;
  msg: string;
  severity: 'warning' | 'error' | 'critical';
  timestamp: string;
  stack?: string;
  triggerNode?: string;
}

export default function ErrorsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedError, setSelectedError] = useState<ErrorLogItem | null>(null);

  const errors: ErrorLogItem[] = [
    {
      id: 'ERR-501',
      app: 'Inventory Catalog',
      msg: 'Render warning: Unknown component detected "datepicker-pro" inside inventory catalog. UI isolated block and successfully compiled other metrics.',
      severity: 'warning',
      timestamp: '2026-05-29 14:12:05',
      stack: 'Error: Unknown component "datepicker-pro"\n  at PageRenderer.renderSingleComponent (PageRenderer.tsx:142:12)\n  at PageRenderer.tsx:280:36\n  at Array.map (<anonymous>)\n  at PageRenderer (PageRenderer.tsx:278:22)',
      triggerNode: 'datepicker-pro'
    },
    {
      id: 'ERR-109',
      app: 'CRM Sales Funnel',
      msg: 'Zod validation error: Expected "options" array for component select element "fb-satisfaction" but got type "null" instead.',
      severity: 'error',
      timestamp: '2026-05-28 09:34:18',
      stack: 'ZodError: [\n  {\n    "code": "invalid_type",\n    "expected": "array",\n    "received": "null",\n    "path": ["components", 3, "options"],\n    "message": "Required options array mapping is missing"\n  }\n]',
      triggerNode: 'fb-satisfaction'
    },
    {
      id: 'ERR-902',
      app: 'Feedback Intake',
      msg: 'API Submission failure: Dynamic POST submission payload triggered validation mismatch against Zod model rules.',
      severity: 'critical',
      timestamp: '2026-05-27 18:22:50',
      stack: 'ValidationError: "email" must be a valid email string address\n  at validatePayload (api/submit.ts:18:24)\n  at POST (api/submit.ts:32:12)\n  at NextNodeServer.runHandler (server.js:82:18)',
      triggerNode: 'fb-email'
    }
  ];

  const filteredErrors = errors.filter((err) =>
    err.app.toLowerCase().includes(searchQuery.toLowerCase()) ||
    err.msg.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/60 pb-5 shrink-0">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            Runtime Error Monitor <AlertOctagon className="w-5 h-5 text-amber-500 animate-pulse" />
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time telemetry logging parser. Monitor compiler faults and isolated runtime boundary recovered warnings.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 shrink-0">
          <Activity className="w-4 h-4 text-green-400" /> Operational telemetry: Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Errors List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search runtime telemetry logs..."
              className="w-full glass-input pl-10 pr-4 py-2 rounded-xl text-xs"
            />
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden divide-y divide-zinc-900">
            {filteredErrors.map((err) => (
              <div
                key={err.id}
                onClick={() => setSelectedError(err)}
                className={`p-4 hover:bg-zinc-900/30 transition-colors flex items-center justify-between gap-4 cursor-pointer select-none ${
                  selectedError?.id === err.id ? 'bg-zinc-900/35 border-l-2 border-violet-500' : ''
                }`}
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[10px] font-bold text-zinc-500">{err.id}</span>
                    <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">{err.app}</span>
                    <span className="text-[10px] text-zinc-500 font-semibold">{err.timestamp}</span>
                  </div>
                  <p className="text-xs text-zinc-400 truncate leading-relaxed">
                    {err.msg}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold border capitalize ${
                      err.severity === 'warning'
                        ? 'bg-amber-950/30 border-amber-500/20 text-amber-400'
                        : err.severity === 'error'
                        ? 'bg-red-950/20 border-red-500/20 text-red-400'
                        : 'bg-red-950/40 border-red-500/40 text-red-300 font-black animate-pulse'
                    }`}
                  >
                    {err.severity}
                  </span>
                  <ChevronRight className="w-4 h-4 text-zinc-650" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Stack Trace Inspector */}
        <div className="glass-panel p-6 rounded-2xl min-h-[380px] flex flex-col gap-4 glow-violet/5">
          <div className="flex items-center gap-2 border-b border-zinc-850 pb-3 shrink-0">
            <Terminal className="w-4.5 h-4.5 text-violet-400 animate-pulse" />
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-200">
              Stack Trace Diagnostic
            </h3>
          </div>

          {selectedError ? (
            /* Selected stack warning */
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-zinc-500 uppercase">Alert Source Location</span>
                <span className="text-xs font-bold text-zinc-300 leading-normal">{selectedError.msg}</span>
              </div>

              {selectedError.triggerNode && (
                <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-900 text-[10px] font-mono text-zinc-400">
                  Target Component Node: <strong className="text-violet-400 font-bold">{selectedError.triggerNode}</strong>
                </div>
              )}

              {selectedError.stack && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase">Compiled Debug Stack</span>
                  <pre className="p-3 text-[10px] font-mono leading-relaxed bg-zinc-950 text-zinc-400 rounded-xl border border-zinc-900 overflow-x-auto whitespace-pre-wrap">
                    {selectedError.stack}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            /* Default prompt info */
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3.5 py-12 text-zinc-500">
              <HelpCircle className="w-8 h-8 opacity-40 animate-bounce" />
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-bold text-zinc-400">Diagnostic Inspector</span>
                <p className="text-[10px] text-zinc-500 leading-normal px-2">
                  Select any active warning from the telemetry log list to load its raw stack trace diagnostics, trigger keys and suggestions.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
