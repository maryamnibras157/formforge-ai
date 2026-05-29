'use client';

import React, { useEffect, useState } from 'react';
import { useProjectsStore } from '../../../store/projectsStore';
import { BarChart3, TrendingUp, Zap, Clock, ShieldAlert } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';

export default function AnalyticsPage() {
  const { projects, fetchProjects } = useProjectsStore();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  
  // Analytics State
  const [metrics, setMetrics] = useState<any>({
    totalRequests: 0,
    averageLatency: 0,
    successRate: 100,
    trends: [],
    recentRequests: [],
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects]);

  useEffect(() => {
    if (!selectedProjectId) return;

    const loadAnalytics = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/analytics/${selectedProjectId}`);
        if (res.ok) {
          const data = await res.json();
          setMetrics(data);
        }
      } catch (e) {
        console.error('Failed to load analytics', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, [selectedProjectId]);

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            System Analytics <BarChart3 className="w-5 h-5 text-blue-400" />
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time insights, request metrics, compile stats and platform performance telemetry.
          </p>
        </div>

        {/* Project Selector */}
        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="glass-input py-2 px-4 rounded-xl text-xs bg-zinc-950 cursor-pointer min-w-[200px]"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="w-full min-h-[40vh] flex flex-col items-center justify-center text-zinc-500 text-xs font-semibold animate-pulse">
          Recalculating database request averages...
        </div>
      ) : (
        <>
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="glass-panel p-5 rounded-2xl glow-blue/5 flex flex-col justify-between h-30 hover:border-zinc-700/60 transition-colors">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Total Requests Executed</span>
              <div className="flex items-baseline justify-between mt-3">
                <span className="text-3xl font-black text-zinc-100">{metrics.totalRequests}</span>
                <span className="p-2 rounded-xl bg-blue-950/30 text-blue-400 border border-blue-500/20"><TrendingUp className="w-4 h-4" /></span>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl glow-violet/5 flex flex-col justify-between h-30 hover:border-zinc-700/60 transition-colors">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Average End-Point Latency</span>
              <div className="flex items-baseline justify-between mt-3">
                <span className="text-3xl font-black text-zinc-100">{metrics.averageLatency}ms</span>
                <span className="p-2 rounded-xl bg-violet-950/30 text-violet-400 border border-violet-500/20"><Clock className="w-4 h-4" /></span>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl glow-blue/5 flex flex-col justify-between h-30 hover:border-zinc-700/60 transition-colors">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Request Success Rate</span>
              <div className="flex items-baseline justify-between mt-3">
                <span className="text-3xl font-black text-zinc-100">{metrics.successRate}%</span>
                <span className={`p-2 rounded-xl border ${
                  metrics.successRate >= 95 
                    ? 'bg-green-950/30 text-green-400 border-green-500/20' 
                    : 'bg-red-950/30 text-red-400 border-red-500/20'
                }`}><ShieldAlert className="w-4 h-4" /></span>
              </div>
            </div>
          </div>

          {/* Recharts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Latency Area Chart */}
            <div className="glass-panel p-6 rounded-2xl min-h-[350px] flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">Execution Latency Trend</h3>
                <p className="text-[10px] text-zinc-500">Visualizes duration latency (ms) of the last several active tests.</p>
              </div>
              <div className="w-full h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metrics.trends}>
                    <defs>
                      <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
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
                    <Area type="monotone" dataKey="latency" stroke="#8b5cf6" fillOpacity={1} fill="url(#latencyGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Status distribution Bar Chart */}
            <div className="glass-panel p-6 rounded-2xl min-h-[350px] flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">HTTP Response Codes Distribution</h3>
                <p className="text-[10px] text-zinc-500">Status code aggregates logged dynamically in project telemetry.</p>
              </div>
              <div className="w-full h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={Object.entries(metrics.statusDistribution || {}).map(([key, val]) => ({ name: `HTTP ${key}`, value: val }))}>
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
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                      {Object.entries(metrics.statusDistribution || {}).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={Number(entry[0]) >= 400 ? '#f43f5e' : '#10b981'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent API Requests logs */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider mb-4">Telemetry Requests History</h3>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 font-semibold select-none bg-zinc-950/30">
                    <th className="p-3">Method</th>
                    <th className="p-3">Endpoint Route</th>
                    <th className="p-3">Latency</th>
                    <th className="p-3">HTTP Status</th>
                    <th className="p-3">Logged Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {metrics.recentRequests?.length > 0 ? (
                    metrics.recentRequests.map((req: any) => (
                      <tr key={req.id} className="hover:bg-zinc-900/20 transition-colors">
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            req.method === 'POST'
                              ? 'bg-blue-950/20 border-blue-500/20 text-blue-400'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                          }`}>
                            {req.method}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-zinc-300 max-w-xs truncate">{req.endpoint}</td>
                        <td className="p-3 font-mono text-zinc-400">{req.durationMs}ms</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            req.status >= 200 && req.status < 300
                              ? 'bg-green-950/20 border-green-500/20 text-green-400'
                              : 'bg-red-950/20 border-red-500/20 text-red-400'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="p-3 text-zinc-500">{new Date(req.timestamp).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-zinc-500 font-medium">No requests recorded yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
