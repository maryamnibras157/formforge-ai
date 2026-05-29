'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { useProjectsStore } from '../../store/projectsStore';
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
  Globe,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'App Builder', href: '/builder', icon: Hammer },
  { name: 'Templates', href: '/templates', icon: Grid3X3 },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'API Explorer', href: '/explorer', icon: Code2 },
  { name: 'CSV Imports', href: '/imports', icon: FileDown },
  { name: 'Error Monitor', href: '/errors', icon: AlertOctagon },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, language, setLanguage, isAuthenticated } = useAuthStore();
  const { toasts, removeToast } = useProjectsStore();
  const pathname = usePathname();
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Authenticated route protection
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-zinc-400 font-medium">
        Redirecting to Landing gate...
      </div>
    );
  }

  const notifications = [
    { id: 1, title: 'Prisma Client Updated', desc: 'Successfully synchronized schema logs.', time: '5m ago' },
    { id: 2, title: 'Broken Config Restored', desc: 'Auto-recovery triggered for Inventory app.', time: '1h ago' },
    { id: 3, title: 'API Limit Warning', desc: 'Lead Intake API reached 85% bandwidth.', time: '4h ago' }
  ];

  return (
    <div className="min-h-screen bg-[#09090b] flex text-zinc-100 antialiased overflow-hidden">
      {/* Toast Alert System overlay wrapper */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`p-4 rounded-xl border flex items-center gap-3 shadow-xl backdrop-blur-md pointer-events-auto ${
                toast.type === 'success'
                  ? 'bg-green-950/90 border-green-500/30 text-green-300'
                  : toast.type === 'error'
                  ? 'bg-red-950/90 border-red-500/30 text-red-300'
                  : toast.type === 'warning'
                  ? 'bg-amber-950/90 border-amber-500/30 text-amber-300'
                  : 'bg-blue-950/90 border-blue-500/30 text-blue-300'
              }`}
            >
              {toast.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              )}
              <div className="flex-1 text-xs font-semibold leading-normal pr-4">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 1. Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0 w-64 bg-[#0d0d12]/95 border-r border-zinc-800/80 backdrop-blur-md flex flex-col justify-between transition-all duration-300 ease-in-out shrink-0`}
      >
        <div className="flex flex-col gap-6 p-6">
          {/* Logo / Header */}
          <div className="flex items-center justify-between border-b border-zinc-800/60 pb-5">
            <Link href="/dashboard" className="flex items-center gap-2.5">
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
            </Link>
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
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
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
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Card */}
        {user && (
          <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/30 flex items-center justify-between">
            <Link href="/profile" className="flex items-center gap-2.5 overflow-hidden group">
              <img
                src={user.avatarUrl}
                alt="Avatar"
                className="w-8 h-8 rounded-lg object-cover border border-zinc-700/50 group-hover:border-zinc-500 shrink-0 transition-colors"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold truncate text-zinc-200 group-hover:text-white transition-colors">{user.name}</span>
                <span className="text-[10px] truncate text-zinc-500 font-medium">{user.role}</span>
              </div>
            </Link>
            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
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
              className="p-2 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 cursor-pointer flex items-center justify-center shrink-0 animate-fade-in"
            >
              <Menu className="w-4.5 h-4.5" />
            </button>

            {/* Quick Search */}
            <div className="relative hidden md:block max-w-xs">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search logs, templates..."
                className="w-64 glass-input pl-9 pr-4 py-1.5 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switch */}
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
                <div className="absolute right-0 mt-3 w-80 rounded-2xl glass-panel p-4 z-50 flex flex-col gap-3 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-xs font-bold text-zinc-200">Alert Center</span>
                    <button className="text-[10px] font-bold text-blue-400 hover:underline cursor-pointer">
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/40 hover:bg-zinc-900/60 transition-colors">
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
                    className="w-6.5 h-6.5 rounded-lg object-cover border border-zinc-700/50"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-48 rounded-xl glass-panel p-2 z-50 flex flex-col gap-0.5 shadow-2xl">
                    <Link
                      href="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full text-left py-2 px-3 hover:bg-zinc-900 text-xs font-semibold rounded-lg text-zinc-300 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <UserCircle className="w-4 h-4 text-zinc-500" /> Profile Settings
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full text-left py-2 px-3 hover:bg-zinc-900 text-xs font-semibold rounded-lg text-zinc-300 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Settings className="w-4 h-4 text-zinc-500" /> Account Settings
                    </Link>
                    <div className="border-t border-zinc-800/80 my-1" />
                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                        router.push('/');
                      }}
                      className="w-full text-left py-2 px-3 hover:bg-zinc-900 text-xs font-semibold rounded-lg text-red-400 flex items-center gap-2 cursor-pointer transition-colors"
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
