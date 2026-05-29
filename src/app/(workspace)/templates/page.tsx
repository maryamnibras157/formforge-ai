'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProjectsStore } from '../../../store/projectsStore';
import { useBuilderStore } from '../../../store/builderStore';
import { Grid3X3, ArrowUpRight, Flame, Layers, LayoutGrid, CheckCircle, Eye, X } from 'lucide-react';
import PageRenderer from '../../../components/builder/PageRenderer';

export default function TemplatesPage() {
  const { installTemplate, isLoading } = useProjectsStore();
  const { setConfig } = useBuilderStore();
  const router = useRouter();

  const [templates, setTemplates] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [installedId, setInstalledId] = useState<string | null>(null);
  
  // Preview modal state
  const [previewTemplate, setPreviewTemplate] = useState<any | null>(null);

  const categories = ['all', 'sales', 'support', 'hr', 'it'];

  // Fetch templates from dynamic DB endpoint!
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const res = await fetch('/api/templates');
        if (res.ok) {
          const list = await res.json();
          setTemplates(list);
        }
      } catch (e) {
        console.error('Failed to load templates from database API', e);
      }
    };
    loadTemplates();
  }, []);

  const filteredTemplates = activeCategory === 'all'
    ? templates
    : templates.filter(t => t.category.toLowerCase() === activeCategory.toLowerCase());

  // Instantly populates builder config and installs in the DB!
  const handleInstall = async (tpl: any) => {
    setInstalledId(tpl.id);
    const createdProject = await installTemplate(tpl.id, `${tpl.name} Instance`, tpl.description);
    
    if (createdProject) {
      setConfig(createdProject.config);
      router.push('/builder');
    }
    setInstalledId(null);
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            Marketplace Blueprints <Grid3X3 className="w-5 h-5 text-violet-400 animate-pulse" />
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
                : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-850 text-zinc-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Catalog Grid */}
      {templates.length === 0 ? (
        <div className="w-full min-h-[30vh] flex flex-col items-center justify-center text-zinc-500 text-xs font-semibold animate-pulse">
          Seeding library from master registries...
        </div>
      ) : (
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
                    {tpl.popularity || 145} hot
                  </div>
                </div>

                <h3 className="text-sm font-bold text-zinc-200">{tpl.name}</h3>
                <p className="text-xs text-zinc-400 leading-normal line-clamp-3 h-14">
                  {tpl.description}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-900 pt-4 mt-2 relative z-10">
                <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <LayoutGrid className="w-3.5 h-3.5 text-zinc-650" />
                    {tpl.config?.layout}
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-zinc-650" />
                    {tpl.config?.components?.length || 0} items
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewTemplate(tpl)}
                    className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                    title="Live preview schema"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleInstall(tpl)}
                    disabled={installedId !== null}
                    className={`py-2 px-4 rounded-xl text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      installedId === tpl.id
                        ? 'bg-green-950/40 border border-green-500/20 text-green-400'
                        : 'bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:from-blue-500 hover:to-violet-500'
                    }`}
                  >
                    {installedId === tpl.id ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 animate-pulse" /> Installing...
                      </>
                    ) : (
                      <>
                        Install <ArrowUpRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dynamic Interactive Template Preview Drawer / Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-6 overflow-y-auto">
          <div className="w-full max-w-4xl rounded-3xl glass-panel p-8 border border-zinc-800 shadow-2xl relative flex flex-col gap-6 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setPreviewTemplate(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col gap-1 border-b border-zinc-800/80 pb-4">
              <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">
                Template Preview Engine
              </span>
              <h3 className="text-lg font-bold text-zinc-100">{previewTemplate.name}</h3>
              <p className="text-xs text-zinc-400">{previewTemplate.description}</p>
            </div>

            {/* Render template configuration inside previewer dynamically! */}
            <div className="p-6 rounded-2xl bg-zinc-950/60 border border-zinc-900 overflow-y-auto max-h-[45vh]">
              <PageRenderer config={previewTemplate.config} readOnly={true} />
            </div>

            <div className="flex gap-3 justify-end border-t border-zinc-850 pt-4">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="py-2.5 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 hover:bg-zinc-850 transition-colors cursor-pointer"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  const tpl = previewTemplate;
                  setPreviewTemplate(null);
                  handleInstall(tpl);
                }}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-1.5"
              >
                Deploy Configuration <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
