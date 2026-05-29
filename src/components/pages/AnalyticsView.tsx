'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { BarChart3, TrendingUp, Sparkles, Filter, Download } from 'lucide-react';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];

export default function AnalyticsView() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  const performanceData = [
    { name: 'Mon', requests: 1400, success: 1390, errors: 10 },
    { name: 'Tue', requests: 1800, success: 1785, errors: 15 },
    { name: 'Wed', requests: 2400, success: 2380, errors: 20 },
    { name: 'Thu', requests: 2100, success: 2085, errors: 15 },
    { name: 'Fri', requests: 3100, success: 3080, errors: 20 },
    { name: 'Sat', requests: 4500, success: 4480, errors: 20 },
    { name: 'Sun', requests: 5200, success: 5175, errors: 25 },
  ];

  const distributionData = [
    { name: 'Inventory Catalog', value: 45 },
    { name: 'Lead Intake', value: 30 },
    { name: 'Feedback Forms', value: 25 },
  ];

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-5 shrink-0">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            Workspace Insights <BarChart3 className="w-5 h-5 text-violet-400" />
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Aggregated analytical reporting. Monitor metrics trends across all compiled runtime nodes.
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex gap-2 shrink-0 select-none">
          <select
            value={timeRange}
            onChange={(e: any) => setTimeRange(e.target.value)}
            className="py-1.5 px-3 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-800 focus:outline-none cursor-pointer text-zinc-400"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button
            onClick={() => alert("Simulated: Downloading PDF Analytical report.")}
            className="py-1.5 px-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-[10px] font-bold text-zinc-300 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* requests area graph */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col justify-between min-h-[340px] glow-violet/5">
          <div>
            <h3 className="text-xs font-bold tracking-wide text-zinc-200 uppercase">Requests Operational Traffic</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">Analysing active calls processed versus error codes boundaries.</p>
          </div>
          
          <div className="w-full h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
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
                <Area type="monotone" dataKey="requests" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRequests)" strokeWidth={2} />
                <Area type="monotone" dataKey="success" stroke="#10b981" fillOpacity={0} strokeWidth={1.5} strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Allocation pie card */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between min-h-[340px] glow-blue/5">
          <div>
            <h3 className="text-xs font-bold tracking-wide text-zinc-200 uppercase">Requests Volume Allocation</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">Percentage distribution of api bandwidth consumed by active layouts.</p>
          </div>

          <div className="w-full h-48 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#09090b',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    color: '#fafafa',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col gap-2 mt-4 text-[10px] font-semibold text-zinc-450 border-t border-zinc-900 pt-3">
            {distributionData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <span>{item.name}</span>
                </div>
                <strong className="text-zinc-200 font-bold">{item.value}%</strong>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
