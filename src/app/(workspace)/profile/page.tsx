'use client';

import React from 'react';
import { useAuthStore } from '../../../store/authStore';
import { User, Sparkles, Terminal, Activity, Calendar, ShieldCheck, Mail } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuthStore();

  const timeline = [
    { action: 'Dynamic POST api called', desc: 'Processed Inventory payload entry.', time: '10m ago' },
    { action: 'Zod config validation', desc: 'Validated Leads funnel successfully.', time: '1h ago' },
    { action: 'Project compiled', desc: 'CRM Dashboard built and deployed.', time: '1d ago' }
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-zinc-800/60 pb-5 shrink-0">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
          Developer Workspace Profile <User className="w-5 h-5 text-zinc-400 font-bold" />
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Review credentials logs, activity statistics, and live telemetry feed timeline.
        </p>
      </div>

      {user && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* Left card Profile card */}
          <div className="md:col-span-1 glass-panel p-6 rounded-3xl glow-violet/5 flex flex-col items-center text-center gap-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-violet-600" />
            
            <img
              src={user.avatarUrl}
              alt="Profile Avatar"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-zinc-800 shadow-md mt-2"
            />
            
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-bold text-zinc-200">{user.name}</h3>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{user.role}</span>
            </div>

            <div className="border-t border-zinc-900 w-full my-1" />

            <div className="flex flex-col gap-3 w-full text-xs text-zinc-400 pl-1">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-zinc-600 shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
                <span>Security Access: Active</span>
              </div>
            </div>
          </div>

          {/* Right Cards: Stats and Activity Timeline */}
          <div className="md:col-span-2 flex flex-col gap-6">
            
            {/* Quick telemetry metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-panel p-4.5 rounded-2xl text-center flex flex-col gap-1">
                <span className="text-[9px] font-bold text-zinc-500 uppercase">Compiled Apps</span>
                <strong className="text-zinc-200 text-lg font-black">4</strong>
              </div>
              <div className="glass-panel p-4.5 rounded-2xl text-center flex flex-col gap-1">
                <span className="text-[9px] font-bold text-zinc-500 uppercase">Telemetry status</span>
                <strong className="text-green-400 text-sm font-bold flex items-center justify-center gap-1 mt-0.5"><Activity className="w-3.5 h-3.5 animate-pulse" /> Operational</strong>
              </div>
              <div className="glass-panel p-4.5 rounded-2xl text-center flex flex-col gap-1">
                <span className="text-[9px] font-bold text-zinc-500 uppercase">API status</span>
                <strong className="text-blue-400 text-sm font-bold flex items-center justify-center gap-1 mt-0.5"><Sparkles className="w-3.5 h-3.5" /> High Bandwidth</strong>
              </div>
            </div>

            {/* Timeline */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider border-b border-zinc-850 pb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-zinc-500" /> Dynamic Activity Timeline
              </h3>

              <div className="flex flex-col gap-5 mt-2.5">
                {timeline.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start relative group">
                    {idx < timeline.length - 1 && (
                      <div className="absolute left-3.5 top-8 bottom-0 w-0.5 bg-zinc-900 group-hover:bg-zinc-850" />
                    )}
                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-900 text-zinc-500 shrink-0">
                      <Terminal className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                      <div className="flex justify-between items-baseline gap-2">
                        <span className="text-xs font-bold text-zinc-300 truncate">{item.action}</span>
                        <span className="text-[9px] text-zinc-500 font-semibold shrink-0">{item.time}</span>
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-normal">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
