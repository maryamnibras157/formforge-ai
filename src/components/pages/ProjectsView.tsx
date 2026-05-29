'use client';

import React, { useState } from 'react';
import {
  Search,
  Grid,
  List,
  Sparkles,
  Zap,
  Trash2,
  Copy,
  FolderPlus,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  MoreVertical,
  Calendar,
  Layers,
  X
} from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';
import { PageConfig } from '../../types';

interface ProjectsViewProps {
  onNavigate: (page: string) => void;
}

interface ProjectItem {
  id: string;
  name: string;
  desc: string;
  componentsCount: number;
  updated: string;
  status: 'active' | 'draft' | 'deprecated';
  config: PageConfig;
}

export default function ProjectsView({ onNavigate }: ProjectsViewProps) {
  const { setConfig } = useBuilderStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Project creation fields
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newLayout, setNewLayout] = useState<'grid' | 'vertical' | 'horizontal'>('grid');

  const [projects, setProjects] = useState<ProjectItem[]>([
    {
      id: 'default-project',
      name: 'Inventory Catalog',
      desc: 'Dynamic catalog with stock notifications, thresholds and product listings.',
      componentsCount: 4,
      updated: '2026-05-29',
      status: 'active',
      config: {
        page: "Stock Management Room",
        layout: "grid",
        columns: 3,
        components: [
          { id: "stock-alert", type: "alert", label: "Critical Stock Warn", variant: "danger", placeholder: "3 inventory items are currently running low on stock." },
          { id: "total-items", type: "metric", label: "Stock Items", metricValue: "1,248", gridSpan: 1 },
          { id: "reorder-items", type: "metric", label: "Reorder Triggered", metricValue: "3", metricChange: { value: "Urgent", trend: "down" }, gridSpan: 1 },
          { id: "inventory-table", type: "table", label: "Product Catalog", gridSpan: 3 }
        ]
      }
    },
    {
      id: 'leads-crm',
      name: 'Lead Intake Portal',
      desc: 'FormForge-compiled CRM sales funnel intake pipeline.',
      componentsCount: 4,
      updated: '2026-05-28',
      status: 'active',
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
      id: 'fb-form',
      name: 'Feedback Forms Portal',
      desc: 'Simple responsive single column feedback collection form with email validation.',
      componentsCount: 6,
      updated: '2026-05-27',
      status: 'draft',
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
    }
  ]);

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Duplication Helper
  const handleDuplicate = (proj: ProjectItem) => {
    const copy = {
      ...proj,
      id: `copy-${Math.random().toString(36).substr(2, 9)}`,
      name: `${proj.name} (Copy)`,
      updated: new Date().toISOString().split('T')[0],
    };
    setProjects([...projects, copy]);
  };

  // Delete Helper
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this metadata configuration? This cannot be undone.")) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  // Create Project Helper
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const newProject: ProjectItem = {
      id: `proj-${Math.random().toString(36).substr(2, 9)}`,
      name: newName,
      desc: newDesc || 'Compiled runtime page configuration.',
      componentsCount: 1,
      updated: new Date().toISOString().split('T')[0],
      status: 'draft',
      config: {
        page: newName,
        layout: newLayout,
        components: [
          {
            id: `metric-${Math.random().toString(36).substr(2, 5)}`,
            type: 'metric',
            label: 'Total Sessions',
            metricValue: '124',
          }
        ]
      }
    };

    setProjects([newProject, ...projects]);
    setNewName('');
    setNewDesc('');
    setShowCreateModal(false);
  };

  // Boot config into editor workspace
  const handleOpenInBuilder = (proj: ProjectItem) => {
    setConfig(proj.config);
    onNavigate('builder');
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            Project Archives <FolderPlus className="w-5 h-5 text-blue-400" />
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Store and retrieve dynamic app layouts. Instantly boot layouts into active builders.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-xs font-bold text-white transition-all cursor-pointer shadow-lg shadow-violet-500/10 flex items-center gap-1.5 self-start"
        >
          <FolderPlus className="w-4 h-4" /> Create Project
        </button>
      </div>

      {/* Toolbar filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved layouts..."
            className="w-full glass-input pl-10 pr-4 py-2 rounded-xl text-xs"
          />
        </div>

        {/* View Mode Switcher */}
        <div className="flex gap-1 bg-zinc-900 border border-zinc-800/60 p-1.5 rounded-xl">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'grid' ? 'bg-zinc-800 text-blue-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'list' ? 'bg-zinc-800 text-blue-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Projects list */}
      {filteredProjects.length > 0 ? (
        viewMode === 'grid' ? (
          /* Grid View Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className="glass-panel p-6 rounded-2xl glow-blue/5 hover:border-zinc-700/60 flex flex-col justify-between h-56 transition-all group duration-200"
              >
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-start justify-between">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold border capitalize ${
                        proj.status === 'active'
                          ? 'bg-green-950/30 border-green-500/20 text-green-400'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                      }`}
                    >
                      {proj.status}
                    </span>
                    
                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDuplicate(proj)}
                        className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                        title="Duplicate configuration"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(proj.id)}
                        className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-zinc-200 truncate">{proj.name}</h3>
                  <p className="text-xs text-zinc-400 leading-normal line-clamp-2 h-9">
                    {proj.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-800/80 pt-4 mt-2">
                  <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-zinc-600" />
                      {proj.componentsCount} components
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                      {proj.updated}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleOpenInBuilder(proj)}
                    className="py-1.5 px-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    Open <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View Layout */
          <div className="glass-panel rounded-2xl overflow-hidden divide-y divide-zinc-900">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className="p-5 hover:bg-zinc-900/25 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-sm font-bold text-zinc-200 truncate">{proj.name}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold border capitalize shrink-0 ${
                        proj.status === 'active'
                          ? 'bg-green-950/30 border-green-500/20 text-green-400'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                      }`}
                    >
                      {proj.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-normal truncate max-w-xl">
                    {proj.desc}
                  </p>
                </div>

                <div className="flex items-center gap-6 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t border-zinc-900 sm:border-0 pt-3.5 sm:pt-0">
                  <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      {proj.componentsCount} components
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {proj.updated}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDuplicate(proj)}
                      className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                      title="Duplicate configuration"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(proj.id)}
                      className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenInBuilder(proj)}
                      className="p-2 rounded-xl bg-gradient-to-r from-blue-950/40 to-violet-950/40 border border-violet-500/20 text-blue-400 hover:text-blue-300 transition-all cursor-pointer"
                      title="Open in Builder"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Empty State */
        <div className="glass-panel p-12 rounded-3xl flex flex-col items-center justify-center text-center gap-4 max-w-md mx-auto w-full glow-violet/5">
          <div className="p-4 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 animate-pulse">
            <Layers className="w-8 h-8" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-bold text-zinc-200">No Projects Found</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We couldn't discover any saved metadata configs matching your search query.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="py-2 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-200 cursor-pointer"
          >
            Create Your First Layout
          </button>
        </div>
      )}

      {/* 4. Project Creation Dialog Overlay */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-md rounded-3xl glass-panel p-8 flex flex-col gap-5 border border-zinc-800 shadow-2xl relative"
          >
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-zinc-900 text-zinc-500 hover:text-zinc-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-sm font-bold tracking-wider text-zinc-200 uppercase flex items-center gap-2 border-b border-zinc-850 pb-3">
              <FolderPlus className="w-4.5 h-4.5 text-blue-400" /> Create Application Layout
            </h3>

            <div className="flex flex-col gap-4">
              {/* Project Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Application Name</label>
                <input
                  required
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="E.g. Student Registration"
                  className="w-full glass-input py-2.5 px-4 rounded-xl text-xs"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Short Description</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Briefly state the goal of this application..."
                  rows={3}
                  className="w-full glass-input py-2.5 px-4 rounded-xl text-xs min-h-[80px]"
                />
              </div>

              {/* Layout Mode */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Default Workspace Layout</label>
                <select
                  value={newLayout}
                  onChange={(e: any) => setNewLayout(e.target.value)}
                  className="w-full glass-input py-2.5 px-4 rounded-xl text-xs cursor-pointer bg-zinc-950"
                >
                  <option value="grid">Grid Panel Dashboard (Recommended)</option>
                  <option value="vertical">Vertical Form flow</option>
                  <option value="horizontal">Horizontal blocks</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-4">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="py-2.5 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-1.5"
              >
                Create Template
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
