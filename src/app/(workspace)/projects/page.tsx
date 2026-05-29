'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProjectsStore } from '../../../store/projectsStore';
import { useBuilderStore } from '../../../store/builderStore';
import {
  Search,
  Grid,
  List,
  Trash2,
  Copy,
  FolderPlus,
  ArrowRight,
  ChevronRight,
  MoreVertical,
  Calendar,
  Layers,
  X,
  Edit2
} from 'lucide-react';
import { Project } from '../../../types';

export default function ProjectsPage() {
  const {
    projects,
    isLoading,
    searchQuery,
    setSearchQuery,
    fetchProjects,
    createProject,
    updateProjectDetails,
    deleteProject,
    duplicateProject,
    setActiveProject,
  } = useProjectsStore();

  const { setConfig } = useBuilderStore();
  const router = useRouter();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [selectedProj, setSelectedProj] = useState<Project | null>(null);

  // Creation fields
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newLayout, setNewLayout] = useState<'grid' | 'vertical' | 'horizontal'>('grid');

  // Rename fields
  const [renameName, setRenameName] = useState('');
  const [renameDesc, setRenameDesc] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Duplicate Helper
  const handleDuplicate = async (id: string) => {
    await duplicateProject(id);
  };

  // Delete Helper
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this metadata configuration? This cannot be undone.")) {
      await deleteProject(id);
    }
  };

  // Create Project Helper
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const newProj = await createProject(newName, newDesc, newLayout);
    if (newProj) {
      setNewName('');
      setNewDesc('');
      setShowCreateModal(false);
      
      // Boot newly created project directly into App Builder!
      setConfig(newProj.config);
      setActiveProject(newProj);
      router.push('/builder');
    }
  };

  // Rename Project Helper
  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProj || !renameName) return;

    const success = await updateProjectDetails(selectedProj.id, renameName, renameDesc);
    if (success) {
      setShowRenameModal(false);
      setSelectedProj(null);
    }
  };

  // Boot config into editor workspace
  const handleOpenInBuilder = (proj: Project) => {
    setConfig(proj.config);
    setActiveProject(proj);
    router.push('/builder');
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            Project Archives <Layers className="w-5 h-5 text-blue-400" />
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

      {/* Loading State */}
      {isLoading && projects.length === 0 ? (
        <div className="w-full min-h-[30vh] flex flex-col items-center justify-center text-zinc-500 text-xs font-medium animate-pulse">
          Querying archive database...
        </div>
      ) : filteredProjects.length > 0 ? (
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
                      className="px-2 py-0.5 rounded text-[9px] font-bold border capitalize bg-green-950/30 border-green-500/20 text-green-400"
                    >
                      Active
                    </span>
                    
                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedProj(proj);
                          setRenameName(proj.name);
                          setRenameDesc(proj.description || '');
                          setShowRenameModal(true);
                        }}
                        className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-500 hover:text-zinc-350 transition-colors cursor-pointer"
                        title="Rename details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(proj.id)}
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
                    {proj.description || 'Compiled runtime metadata configuration.'}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-800/80 pt-4 mt-2">
                  <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-zinc-600" />
                      {proj.config?.components?.length || 0} items
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                      {new Date(proj.updatedAt).toISOString().split('T')[0]}
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
                      className="px-2 py-0.5 rounded text-[9px] font-bold border capitalize bg-green-950/30 border-green-500/20 text-green-400"
                    >
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-normal truncate max-w-xl">
                    {proj.description || 'Compiled runtime metadata configuration.'}
                  </p>
                </div>

                <div className="flex items-center gap-6 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t border-zinc-900 sm:border-0 pt-3.5 sm:pt-0">
                  <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      {proj.config?.components?.length || 0} items
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(proj.updatedAt).toISOString().split('T')[0]}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedProj(proj);
                        setRenameName(proj.name);
                        setRenameDesc(proj.description || '');
                        setShowRenameModal(true);
                      }}
                      className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-350 cursor-pointer"
                      title="Rename details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(proj.id)}
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
            className="py-2.5 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-200 cursor-pointer"
          >
            Create Your First Layout
          </button>
        </div>
      )}

      {/* Project Creation Dialog Modal */}
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
                  className="w-full glass-input py-2.5 px-4 rounded-xl text-xs cursor-pointer bg-zinc-955"
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
                className="py-2.5 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 hover:bg-zinc-850 transition-colors cursor-pointer"
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

      {/* Rename Project Dialog Modal */}
      {showRenameModal && selectedProj && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <form
            onSubmit={handleRenameSubmit}
            className="w-full max-w-md rounded-3xl glass-panel p-8 flex flex-col gap-5 border border-zinc-800 shadow-2xl relative"
          >
            <button
              type="button"
              onClick={() => {
                setShowRenameModal(false);
                setSelectedProj(null);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-zinc-900 text-zinc-500 hover:text-zinc-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-sm font-bold tracking-wider text-zinc-200 uppercase flex items-center gap-2 border-b border-zinc-850 pb-3">
              <Edit2 className="w-4.5 h-4.5 text-blue-400" /> Edit Project Details
            </h3>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Application Name</label>
                <input
                  required
                  type="text"
                  value={renameName}
                  onChange={(e) => setRenameName(e.target.value)}
                  className="w-full glass-input py-2.5 px-4 rounded-xl text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Short Description</label>
                <textarea
                  value={renameDesc}
                  onChange={(e) => setRenameDesc(e.target.value)}
                  rows={3}
                  className="w-full glass-input py-2.5 px-4 rounded-xl text-xs min-h-[80px]"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowRenameModal(false);
                  setSelectedProj(null);
                }}
                className="py-2.5 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 hover:bg-zinc-850 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-xs font-bold text-white transition-all cursor-pointer"
              >
                Save Details
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
