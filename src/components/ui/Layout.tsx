'use client';

import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard,
  FolderKanban,
  Hammer,
  Grid3X3,
  BarChart3,
  Code2,
  FileDown,
  AlertOctagon,
  Settings,
  UserCircle,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Sparkles,
  Globe
} from 'lucide-react';

interface SidebarItem {
  name: string;
  id: string;
  icon: React.ComponentType<any>;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { name: 'Dashboard', id: 'dashboard', icon: LayoutDashboard },
  { name: 'Projects', id: 'projects', icon: FolderKanban },
  { name: 'App Builder', id: 'builder', icon: Hammer },
  { name: 'Templates', id: 'templates', icon: Grid3X3 },
  { name: 'Analytics', id: 'analytics', icon: BarChart3 },
  { name: 'API Explorer', id: 'apis', icon: Code2 },
  { name: 'CSV Imports', id: 'imports', icon: FileDown },
  { name: 'Error Monitor', id: 'errors', icon: AlertOctagon },
  { name: 'Settings', id: 'settings', icon: Settings },
];

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  setActivePage: (page: string) => void;
}

export default function Layout({ children, activePage, setActivePage }: LayoutProps) {
  const { user, logout, language, setLanguage } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    { id: 1, title: 'Prisma Client Updated', desc: 'Successfully synchronized schema logs.', time: '5m ago' },
    { id: 2, title: 'Broken Config Restored', desc: 'Auto-recovery triggered for Inventory app.', time: '1h ago' },
    { id: 3, title: 'API Limit Warning', desc: 'Lead Intake API reached 85% bandwidth.', time: '4h ago' }
  ];

  return (
    <div className="min-h-screen bg-[#09090b] flex text-zinc-100 antialiased overflow-hidden">
      {/* 1. Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0 w-64 bg-[#0d0d12]/95 border-r border-zinc-800/80 backdrop-blur-md flex flex-col justify-between transition-all duration-300 ease-in-out shrink-0`}
      >
        <div className="flex flex-col gap-6 p-6">
          {/* Logo / Header */}
          <div className="flex items-center justify-between border-b border-zinc-800/60 pb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 shadow-md shadow-violet-500/25 shrink-0 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-wider text-zinc-100 uppercase">
                  FormForge AI
                </h1>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                  Metadata v1.0
                </span>
              </div>
            </div>
            {/* Collapse Trigger on Mobile */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    // Close sidebar on mobile clicking navigation
                    if (window.innerWidth < 1024) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wide flex items-center gap-3.5 transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-950/40 to-violet-950/40 border border-violet-500/20 text-blue-400'
                      : 'hover:bg-zinc-900/60 border border-transparent text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-zinc-500'}`} />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Card */}
        {user && (
          <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={user.avatarUrl}
                alt="Avatar"
                className="w-8 h-8 rounded-lg object-cover border border-zinc-700/50 shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold truncate text-zinc-200">{user.name}</span>
                <span className="text-[10px] truncate text-zinc-500 font-medium">{user.role}</span>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
              title="Logout session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>

      {/* 2. Main Page Content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-16 border-b border-zinc-800/60 bg-[#0d0d12]/95 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 cursor-pointer flex items-center justify-center shrink-0"
            >
              <Menu className="w-4.5 h-4.5" />
            </button>

            {/* Quick Command search mock */}
            <div className="relative hidden md:block max-w-xs">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search resources, templates..."
                className="w-64 glass-input pl-9 pr-4 py-1.5 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language switch */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" />
              {language === 'en' ? 'EN' : 'தமிழ்'}
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 cursor-pointer flex items-center justify-center relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-blue-500 ring-2 ring-[#0d0d12]" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl glass-panel p-4 z-50 flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-xs font-bold text-zinc-200">Alert Center</span>
                    <button className="text-[10px] font-bold text-blue-400 hover:underline cursor-pointer">
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/40 hover:bg-zinc-900/60 transition-colors">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="text-xs font-bold text-zinc-300">{n.title}</span>
                          <span className="text-[9px] text-zinc-500">{n.time}</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 leading-normal">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowProfileMenu(!showProfileMenu);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 cursor-pointer transition-colors"
                >
                  <img
                    src={user.avatarUrl}
                    alt="Avatar"
                    className="w-6.5 h-6.5 rounded-lg object-cover"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-48 rounded-xl glass-panel p-2.5 z-50 flex flex-col gap-1">
                    <button
                      onClick={() => {
                        setActivePage('profile');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left py-2 px-3 hover:bg-zinc-900 text-xs font-semibold rounded-lg text-zinc-300 flex items-center gap-2 cursor-pointer"
                    >
                      <UserCircle className="w-4 h-4 text-zinc-500" /> Profile Settings
                    </button>
                    <button
                      onClick={() => {
                        setActivePage('settings');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left py-2 px-3 hover:bg-zinc-900 text-xs font-semibold rounded-lg text-zinc-300 flex items-center gap-2 cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-zinc-500" /> Account Settings
                    </button>
                    <div className="border-t border-zinc-800/80 my-1.5" />
                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left py-2 px-3 hover:bg-zinc-900 text-xs font-semibold rounded-lg text-red-400 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Scrollable Layout Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
