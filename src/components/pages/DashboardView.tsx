'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Folder,
  Globe,
  Settings,
  TrendingUp,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  FolderOpen,
  Calendar,
  Sparkles,
  Zap
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

interface DashboardViewProps {
  onNavigate: (page: string) => void;
}

export default function DashboardView({ onNavigate }: DashboardViewProps) {
  
  const stats = [
    { label: 'Active Projects', value: '4', change: '+1 this week', icon: Folder, color: 'text-blue-400', glow: 'glow-blue/5' },
    { label: 'API Requests', value: '14,842', change: '+24% vs yesterday', icon: Globe, color: 'text-violet-400', glow: 'glow-violet/5' },
    { label: 'Config Validations', value: '100%', change: '0 compile crashes', icon: ShieldCheck, color: 'text-green-400', glow: 'glow-blue/5' },
    { label: 'Runtime Faults', value: '3', change: 'Isolated by sandbox', icon: AlertTriangle, color: 'text-amber-400', glow: 'glow-violet/5' },
  ];

  const recentActivity = [
    { title: 'Project Cloned', desc: 'Duplicated "Student Intake Form" to "Student Intake v2".', time: '12m ago', icon: Zap },
    { title: 'CSV Records Imported', desc: 'Papa Parse processed 140 entries for Catalog.', time: '2h ago', icon: Cpu },
    { title: 'Configuration Saved', desc: 'Updated schema fields for CRM Pipeline layout.', time: '1d ago', icon: FolderOpen },
  ];

  const performanceChartData = [
    { name: 'Mon', requests: 1400, latency: 45 },
    { name: 'Tue', requests: 1800, latency: 42 },
    { name: 'Wed', requests: 2400, latency: 48 },
    { name: 'Thu', requests: 2100, latency: 40 },
    { name: 'Fri', requests: 3100, latency: 38 },
    { name: 'Sat', requests: 4500, latency: 32 },
    { name: 'Sun', requests: 5200, latency: 35 },
  ];

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* 1. Header welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/60 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            Workspace Hub <Sparkles className="w-5 h-5 text-violet-400 animate-pulse" />
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Build and compile real-time applications directly from metadata registries.
          </p>
        </div>
        <button
          onClick={() => onNavigate('builder')}
          className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-xs font-bold text-white transition-all cursor-pointer shadow-lg shadow-violet-500/10 flex items-center gap-1.5 self-start"
        >
          <Zap className="w-3.5 h-3.5" /> Initialize App Builder
        </button>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className={`glass-panel p-5 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group hover:border-zinc-700/60 transition-colors ${s.glow}`}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-zinc-400 tracking-wide uppercase">{s.label}</span>
                <div className={`p-2 rounded-xl bg-zinc-900 border border-zinc-800 ${s.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex flex-col mt-2">
                <span className="text-2xl font-black tracking-tight text-zinc-100">{s.value}</span>
                <span className="text-[10px] text-zinc-500 font-semibold mt-0.5">{s.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Performance Chart and Recent Activity splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph Card */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col justify-between min-h-[360px] glow-violet/5">
          <div>
            <h3 className="text-sm font-bold tracking-wide text-zinc-200 uppercase">
              API Requests Trend
            </h3>
            <p className="text-[10px] text-zinc-400 mt-0.5">
              Visualizing requests and network latencies processed across all runtime APIs.
            </p>
          </div>
          <div className="w-full h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceChartData}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#09090b',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    color: '#fafafa',
                    fontSize: '11px',
                  }}
                />
                <Area type="monotone" dataKey="requests" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRequests)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity feed Card */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between glow-blue/5">
          <div className="flex flex-col gap-1 border-b border-zinc-800/80 pb-4">
            <h3 className="text-sm font-bold tracking-wide text-zinc-200 uppercase">
              Audit Operations Log
            </h3>
            <p className="text-[10px] text-zinc-400">
              Recent events processed inside the metadata workspace.
            </p>
          </div>
          <div className="flex-1 flex flex-col gap-4.5 mt-5">
            {recentActivity.map((act, i) => {
              const Icon = act.icon;
              return (
                <div key={i} className="flex gap-3.5 items-start">
                  <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-violet-400 shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="text-xs font-bold text-zinc-300 truncate">{act.title}</span>
                      <span className="text-[9px] text-zinc-500 font-semibold shrink-0">{act.time}</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-normal">{act.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => onNavigate('settings')}
            className="w-full mt-6 py-2 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" /> View System Keys
          </button>
        </div>
      </div>
    </div>
  );
}
