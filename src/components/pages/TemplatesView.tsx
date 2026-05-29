'use client';

import React, { useState } from 'react';
import { Grid3X3, ArrowUpRight, Flame, Layers, LayoutGrid, CheckCircle } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';
import { PageConfig } from '../../types';

interface TemplatesViewProps {
  onNavigate: (page: string) => void;
}

interface TemplateItem {
  id: string;
  name: string;
  category: string;
  desc: string;
  downloads: number;
  componentsCount: number;
  config: PageConfig;
}

export default function TemplatesView({ onNavigate }: TemplatesViewProps) {
  const { setConfig } = useBuilderStore();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [installedId, setInstalledId] = useState<string | null>(null);

  const categories = ['all', 'sales', 'support', 'hr', 'it'];

  const templates: TemplateItem[] = [
    {
      id: 'tpl-crm',
      name: 'CRM Sales Funnel',
      category: 'sales',
      desc: 'Complete leads pipeline CRM featuring revenue progress statistics cards, win-rate KPI gauges and interactive contacts list directory tables.',
      downloads: 145,
      componentsCount: 4,
      config: {
        page: "CRM Pipeline Dashboard",
        layout: "grid",
        columns: 3,
        components: [
          { id: "leads-metric", type: "metric", label: "New Leads", metricValue: "284", metricChange: { value: "+18%", trend: "up" }, gridSpan: 1 },
          { id: "revenue-metric", type: "metric", label: "Pipeline Value", metricValue: "$98,200", metricChange: { value: "+12%", trend: "up" }, gridSpan: 1 },
          { id: "winrate-metric", type: "metric", label: "Win Rate", metricValue: "24.5%", metricChange: { value: "-1.2%", trend: "neutral" }, gridSpan: 1 },
          { id: "leads-table", type: "table", label: "Lead Directory", gridSpan: 3 }
        ]
      }
    },
    {
      id: 'tpl-feedback',
      name: 'Customer Feedback Portal',
      category: 'support',
      desc: 'Single column responsive client survey intake portal with validated satisfaction levels, details sections, conditional options and custom alert greetings.',
      downloads: 92,
      componentsCount: 6,
      config: {
        page: "Feedback Intake Form",
        layout: "vertical",
        components: [
          { id: "intro-alert", type: "alert", label: "Feedback System", variant: "primary", placeholder: "Thank you for taking 2 minutes to help us improve FormForge AI!" },
          { id: "fb-name", type: "input", label: "Your Name", placeholder: "John Doe", validation: { required: true } },
          { id: "fb-email", type: "email", label: "Email Address", placeholder: "john@domain.com", validation: { required: true } },
          { id: "fb-satisfaction", type: "select", label: "Satisfaction Level", options: ["Very Satisfied", "Satisfied", "Neutral", "Unsatisfied"], validation: { required: true } },
          { id: "fb-comments", type: "textarea", label: "Detailed Comments", placeholder: "What can we improve?", validation: { required: false } },
          { id: "fb-submit", type: "button", label: "Send Feedback", variant: "primary" }
        ]
      }
    },
    {
      id: 'tpl-employees',
      name: 'Staff Directory Hub',
      category: 'hr',
      desc: 'Manage active employee directory registry, roles, activity status gauges, join timestamps and interactive search indexes.',
      downloads: 78,
      componentsCount: 3,
      config: {
        page: "Staff Directory Room",
        layout: "grid",
        columns: 2,
        components: [
          { id: "active-metric", type: "metric", label: "Active Employees", metricValue: "42", metricChange: { value: "+3 new", trend: "up" }, gridSpan: 1 },
          { id: "dept-metric", type: "metric", label: "Departments", metricValue: "6", metricChange: { value: "Stable", trend: "neutral" }, gridSpan: 1 },
          { id: "staff-table", type: "table", label: "All Active Staff", gridSpan: 2 }
        ]
      }
    },
    {
      id: 'tpl-it',
      name: 'System Status Room',
      category: 'it',
      desc: 'Real-time telemetry monitor layout checking operational response times, server active alerts, and network requests Recharts graphs.',
      downloads: 120,
      componentsCount: 3,
      config: {
        page: "Operational Health Telemetry",
        layout: "grid",
        columns: 3,
        components: [
          { id: "telemetry-warn", type: "alert", label: "Incident Alert", variant: "danger", placeholder: "Primary API Gateway experiencing minor request queue bottlenecks." },
          { id: "latency-metric", type: "metric", label: "Response Latency", metricValue: "38ms", metricChange: { value: "Perfect", trend: "up" }, gridSpan: 1 },
          { id: "uptime-metric", type: "metric", label: "Uptime Telemetry", metricValue: "99.98%", metricChange: { value: "+0.02%", trend: "up" }, gridSpan: 1 },
          { id: "requests-chart", type: "chart", label: "Hourly Requests Count", chartType: "area", gridSpan: 3 }
        ]
      }
    }
  ];

  const filteredTemplates = activeCategory === 'all'
    ? templates
    : templates.filter(t => t.category === activeCategory);

  // Instantly populates builder config
  const handleInstall = (tpl: TemplateItem) => {
    setInstalledId(tpl.id);
    setConfig(tpl.config);
    
    // Smooth loader delay before routing to active workspace
    setTimeout(() => {
      onNavigate('builder');
      setInstalledId(null);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            Marketplace Blueprint <Grid3X3 className="w-5 h-5 text-violet-400" />
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Pre-assembled metadata packages. Select any config to initialize the workspace instantly.
          </p>
        </div>
      </div>

      {/* Toolbar filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 shrink-0 select-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`py-1.5 px-4 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-blue-950/40 to-violet-950/40 border-violet-500/20 text-blue-400'
                : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            className="glass-panel p-6 rounded-3xl glow-violet/5 hover:border-zinc-700/60 transition-all flex flex-col justify-between h-64 relative group overflow-hidden"
          >
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 blur-3xl rounded-full translate-x-12 -translate-y-12" />

            <div className="flex flex-col gap-2.5 relative z-10">
              <div className="flex items-start justify-between">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-950/60 border border-zinc-900 px-2 py-0.5 rounded">
                  {tpl.category}
                </span>
                
                {/* Popularity badge */}
                <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
                  <Flame className="w-3.5 h-3.5 fill-amber-500/10" />
                  {tpl.downloads} hot
                </div>
              </div>

              <h3 className="text-sm font-bold text-zinc-200">{tpl.name}</h3>
              <p className="text-xs text-zinc-400 leading-normal line-clamp-3 h-14">
                {tpl.desc}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-zinc-900 pt-4 mt-2 relative z-10">
              <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <LayoutGrid className="w-3.5 h-3.5 text-zinc-650" />
                  {tpl.config.layout} layout
                </span>
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-zinc-650" />
                  {tpl.componentsCount} components
                </span>
              </div>

              <button
                onClick={() => handleInstall(tpl)}
                disabled={installedId !== null}
                className={`py-2 px-4 rounded-xl text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  installedId === tpl.id
                    ? 'bg-green-950/40 border border-green-500/20 text-green-400'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-200 hover:bg-zinc-800 hover:text-zinc-100'
                }`}
              >
                {installedId === tpl.id ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" /> Loading Config...
                  </>
                ) : (
                  <>
                    Install Template <ArrowUpRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
