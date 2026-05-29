'use client';

import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useBuilderStore } from '../../../store/builderStore';
import { useProjectsStore } from '../../../store/projectsStore';
import PageRenderer from '../../../components/builder/PageRenderer';
import { COMPONENT_REGISTRY } from '../../../lib/runtime/registry';
import { ComponentType, ComponentConfig } from '../../../types';
import {
  Hammer,
  Eye,
  Monitor,
  Tablet,
  Smartphone,
  Undo2,
  Redo2,
  Plus,
  Trash2,
  Settings2,
  HelpCircle,
  FileCode,
  CheckCircle,
  AlertTriangle,
  Save,
  Wrench
} from 'lucide-react';

export default function BuilderPage() {
  const {
    config,
    errors,
    updateConfigJson,
    setConfig,
    selectedComponentId,
    selectComponent,
    updateComponent,
    addComponent,
    removeComponent,
    viewMode,
    setViewMode,
    undo,
    redo,
    canUndo,
    canRedo
  } = useBuilderStore();

  const {
    activeProject,
    updateProjectConfig,
    addToast
  } = useProjectsStore();

  const [jsonText, setJsonText] = useState('');
  const [editorTab, setEditorTab] = useState<'editor' | 'components'>('components');
  const [isSaving, setIsSaving] = useState(false);

  // Sync builderStore config changes to local text editor content
  useEffect(() => {
    setJsonText(JSON.stringify(config, null, 2));
  }, [config]);

  // JSON direct input handler
  const handleJsonChange = (val: string | undefined) => {
    if (val === undefined) return;
    setJsonText(val);
    updateConfigJson(val);
  };

  // Add Component helper
  const handleAddNewComponent = (type: ComponentType) => {
    const reg = COMPONENT_REGISTRY[type];
    const newComp: ComponentConfig = {
      id: `${type}-${Math.random().toString(36).substr(2, 5)}`,
      type,
      label: reg.defaultConfig.label || `New ${reg.label}`,
      name: ['input', 'email', 'password', 'select', 'checkbox', 'radio', 'textarea'].includes(type)
        ? `field_${Math.random().toString(36).substr(2, 4)}`
        : undefined,
      ...JSON.parse(JSON.stringify(reg.defaultConfig))
    };
    addComponent(newComp);
    addToast(`Added '${reg.label}' component to canvas!`, 'success');
  };

  // Save config back to the active project in the database!
  const handleSaveConfig = async () => {
    if (!activeProject) {
      addToast('No project active. Create a project to persist config.', 'warning');
      return;
    }
    
    setIsSaving(true);
    try {
      const success = await updateProjectConfig(activeProject.id, config);
      if (success) {
        // Record simulated API call
        await fetch(`/api/explorer/test`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: `/api/projects/${activeProject.id}`,
            method: 'PUT',
            body: JSON.stringify({ config })
          })
        });
      }
    } catch (e) {
      addToast('Error saving project layout config.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const selectedComponent = React.useMemo(() => {
    if (!selectedComponentId) return null;
    
    const findRecursive = (components: ComponentConfig[]): ComponentConfig | null => {
      for (const comp of components) {
        if (comp.id === selectedComponentId) return comp;
        if (comp.components) {
          const found = findRecursive(comp.components);
          if (found) return found;
        }
      }
      return null;
    };
    
    return findRecursive(config.components);
  }, [config.components, selectedComponentId]);

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-140px)] w-full overflow-hidden">
      {/* 1. Header Toolbar Controls */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 border-b border-zinc-800/60 pb-4 shrink-0">
        <div className="flex flex-wrap items-center gap-3">
          <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-blue-400">
            <Hammer className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-100 flex items-center gap-1.5">
              Metaruntime Designer
            </h2>
            <span className="text-[10px] text-zinc-500 font-semibold leading-none">
              {activeProject ? `Project: ${activeProject.name}` : 'Sandbox Sandbox Mode'}
            </span>
          </div>
        </div>

        {/* Workspace controls */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Save button */}
          {activeProject && (
            <button
              onClick={handleSaveConfig}
              disabled={isSaving || errors.length > 0}
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-violet-500/10"
            >
              <Save className="w-3.5 h-3.5" />
              {isSaving ? 'Synchronizing...' : 'Save Configuration'}
            </button>
          )}

          {/* Viewport switch */}
          <div className="flex bg-zinc-900 border border-zinc-800/80 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('desktop')}
              className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                viewMode === 'desktop' ? 'bg-zinc-800 text-blue-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Desktop Layout View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('tablet')}
              className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                viewMode === 'tablet' ? 'bg-zinc-800 text-blue-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Tablet Layout View"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                viewMode === 'mobile' ? 'bg-zinc-800 text-blue-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Mobile Responsive View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-5 bg-zinc-800" />

          {/* Undo / Redo */}
          <div className="flex gap-1.5">
            <button
              disabled={!canUndo()}
              onClick={undo}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800/60 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-400 hover:text-zinc-200 cursor-pointer"
              title="Undo design change"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              disabled={!canRedo()}
              onClick={redo}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800/60 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-400 hover:text-zinc-200 cursor-pointer"
              title="Redo design change"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Three Column Builder Layout splits */}
      <div className="flex-1 flex gap-5 overflow-hidden w-full">
        {/* Left Column: Config Panel / JSON Editor / Toolbox */}
        <div className="w-80 flex flex-col border border-zinc-800/60 bg-[#0d0d12]/50 backdrop-blur-md rounded-2xl overflow-hidden shrink-0">
          <div className="flex border-b border-zinc-800/80 bg-zinc-950/40 p-1">
            <button
              onClick={() => setEditorTab('components')}
              className={`flex-1 py-2 text-center text-[10px] font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-colors ${
                editorTab === 'components' ? 'bg-zinc-900 text-blue-400 border border-zinc-800/40' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Toolbox
            </button>
            <button
              onClick={() => setEditorTab('editor')}
              className={`flex-1 py-2 text-center text-[10px] font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-colors ${
                editorTab === 'editor' ? 'bg-zinc-900 text-blue-400 border border-zinc-800/40' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              JSON Editor
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {editorTab === 'components' ? (
              /* Component Adders */
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">
                  Toolbox Components
                </span>
                
                {/* Inputs category */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-bold text-zinc-650 uppercase px-1">Forms & Inputs</span>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(COMPONENT_REGISTRY)
                      .filter((c) => c.category === 'input')
                      .map((c) => (
                        <button
                          key={c.type}
                          onClick={() => handleAddNewComponent(c.type)}
                          className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-900 hover:bg-zinc-900 hover:border-zinc-800 text-left text-[11px] font-semibold text-zinc-300 transition-all flex items-center gap-2 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 text-blue-400" />
                          {c.label.replace(' Input', '')}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Displays category */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-bold text-zinc-655 uppercase px-1">Data Display & KPI</span>
                  <div className="flex flex-col gap-2">
                    {Object.values(COMPONENT_REGISTRY)
                      .filter((c) => c.category === 'display' || c.category === 'action')
                      .map((c) => (
                        <button
                          key={c.type}
                          onClick={() => handleAddNewComponent(c.type)}
                          className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-900 hover:bg-zinc-900 hover:border-zinc-800 text-left text-[11px] font-semibold text-zinc-300 transition-all flex items-center justify-between cursor-pointer"
                        >
                          <span className="flex items-center gap-2">{c.label}</span>
                          <Plus className="w-4 h-4 text-violet-400" />
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Raw JSON Monaco Editor area */
              <div className="flex flex-col gap-3 h-full justify-between overflow-hidden">
                <div className="flex flex-col gap-2 flex-1 overflow-hidden">
                  <div className="flex items-center justify-between border-b border-zinc-850 pb-2 shrink-0">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5"><FileCode className="w-3.5 h-3.5" /> schema.json</span>
                    {errors.length === 0 ? (
                      <span className="text-[9px] font-bold text-green-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Valid Config</span>
                    ) : (
                      <span className="text-[9px] font-bold text-amber-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Broken Syntax</span>
                    )}
                  </div>
                  
                  <div className="flex-1 w-full rounded-xl overflow-hidden border border-zinc-900">
                    <Editor
                      height="100%"
                      defaultLanguage="json"
                      theme="vs-dark"
                      value={jsonText}
                      onChange={handleJsonChange}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 10,
                        lineNumbers: 'on',
                        wordWrap: 'on',
                        scrollbar: { vertical: 'auto', horizontal: 'auto' }
                      }}
                    />
                  </div>
                </div>
                
                {/* Embedded Zod error warning list */}
                {errors.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/25 flex flex-col gap-1.5 max-h-32 overflow-y-auto shrink-0 mt-2">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Zod Mismatch Warning
                    </span>
                    {errors.map((err, i) => (
                      <span key={i} className="text-[10px] text-zinc-400 leading-tight block">
                        • <strong className="text-zinc-350 font-bold">{err.path || 'Root'}</strong>: {err.message}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Center Column: Live Preview Viewport */}
        <div className="flex-1 flex flex-col border border-zinc-800/60 bg-[#0d0d12]/20 backdrop-blur-sm rounded-2xl overflow-hidden relative group">
          {/* Resizing Viewport bounding borders */}
          <div className="w-full flex items-center justify-between border-b border-zinc-800/60 bg-zinc-950/40 px-5 py-2.5 shrink-0 text-xs text-zinc-400 select-none">
            <span className="font-bold flex items-center gap-1.5"><Eye className="w-4 h-4 text-blue-400" /> Compiled Canvas Viewport</span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
              Active mode
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 flex justify-center bg-zinc-950/25">
            <div
              className={`w-full transition-all duration-300 ${
                viewMode === 'mobile'
                  ? 'max-w-[360px] border-x border-zinc-800/80 p-4 rounded-3xl bg-[#09090b]'
                  : viewMode === 'tablet'
                  ? 'max-w-[768px] border-x border-zinc-800/80 p-6 rounded-3xl bg-[#09090b]'
                  : 'max-w-full'
              }`}
            >
              {/* Clicking layout nodes allows selection to show in inspector */}
              <div 
                onClickCapture={(e: any) => {
                  // Bubble up and find nearest layout item with component ID
                  let target = e.target;
                  while (target && target !== e.currentTarget) {
                    if (target.getAttribute && target.key) {
                      selectComponent(target.key);
                      break;
                    }
                    // Monaco/Fallback helpers
                    if (target.id && (target.id.includes('-') || target.id.includes('metrics') || target.id.includes('table') || target.id.includes('form') || target.id.includes('input') || target.id.includes('btn') || target.id.includes('alert'))) {
                      selectComponent(target.id);
                      break;
                    }
                    target = target.parentNode;
                  }
                }}
              >
                <PageRenderer config={config} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Attribute Settings Inspector */}
        <div className="w-80 border border-zinc-800/60 bg-[#0d0d12]/50 backdrop-blur-md rounded-2xl overflow-y-auto p-4 shrink-0 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-zinc-850 pb-3 shrink-0">
            <Settings2 className="w-4 h-4 text-violet-400 animate-pulse" />
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-200">
              Attribute Inspector
            </h3>
          </div>

          {selectedComponent ? (
            /* Selected Component Form Settings */
            <div className="flex flex-col gap-4.5">
              <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950 border border-zinc-900">
                <span className="text-[11px] font-mono text-zinc-400">ID: {selectedComponent.id}</span>
                <button
                  onClick={() => {
                    removeComponent(selectedComponent.id);
                    addToast('Removed component from canvas layout.', 'info');
                  }}
                  className="p-1.5 rounded-lg hover:bg-zinc-900 text-zinc-500 hover:text-red-400 cursor-pointer transition-colors"
                  title="Remove Component"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Editable label attribute */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Component Title / Label</label>
                <input
                  type="text"
                  value={selectedComponent.label}
                  onChange={(e) => updateComponent(selectedComponent.id, { label: e.target.value })}
                  className="w-full glass-input py-2.5 px-4 rounded-xl text-xs"
                />
              </div>

              {/* Required state checkbox */}
              {selectedComponent.validation && (
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 py-1 select-none">
                  <input
                    type="checkbox"
                    checked={!!selectedComponent.validation.required}
                    onChange={(e) =>
                      updateComponent(selectedComponent.id, {
                        validation: { ...selectedComponent.validation, required: e.target.checked }
                      })
                    }
                    className="rounded bg-zinc-950 border-zinc-700 text-blue-500 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  Mark as Required Field
                </label>
              )}

              {/* Grid Span */}
              {selectedComponent.gridSpan !== undefined && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Grid Card Span</label>
                  <select
                    value={selectedComponent.gridSpan}
                    onChange={(e) => updateComponent(selectedComponent.id, { gridSpan: Number(e.target.value) })}
                    className="w-full glass-input py-2.5 px-4 rounded-xl text-xs bg-zinc-950 cursor-pointer"
                  >
                    <option value="1">Span 1 Column</option>
                    <option value="2">Span 2 Columns</option>
                    <option value="3">Span 3 Columns (Full Width)</option>
                  </select>
                </div>
              )}

              {/* Chart Types */}
              {selectedComponent.type === 'chart' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Chart Style</label>
                  <select
                    value={selectedComponent.chartType}
                    onChange={(e) => updateComponent(selectedComponent.id, { chartType: e.target.value as any })}
                    className="w-full glass-input py-2.5 px-4 rounded-xl text-xs bg-zinc-950 cursor-pointer"
                  >
                    <option value="bar">Bar Chart</option>
                    <option value="line">Line Graph</option>
                    <option value="area">Area Glow Chart</option>
                    <option value="pie">Pie Ring Chart</option>
                  </select>
                </div>
              )}

              {/* Form Input standalones mapping details */}
              {['input', 'email', 'password', 'select', 'textarea'].includes(selectedComponent.type) && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Input ID name key</label>
                  <input
                    type="text"
                    value={selectedComponent.name || ''}
                    onChange={(e) => updateComponent(selectedComponent.id, { name: e.target.value })}
                    className="w-full glass-input py-2.5 px-4 rounded-xl text-xs font-mono"
                    placeholder="field_name_key"
                  />
                  <span className="text-[9px] text-zinc-650 leading-relaxed">
                    Values posted to external API bodies are indexed against this name key string.
                  </span>
                </div>
              )}
            </div>
          ) : (
            /* Selected default config info */
            <div className="flex flex-col items-center justify-center text-center gap-3.5 py-12 text-zinc-500">
              <Wrench className="w-8 h-8 opacity-40 animate-pulse" />
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-bold text-zinc-400">Select any component</span>
                <p className="text-[10px] text-zinc-500 leading-normal px-2">
                  Click on an element in the builder canvas layout to load its adjustable attributes in this Inspector pane.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
