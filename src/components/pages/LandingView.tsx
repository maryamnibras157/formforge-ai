'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, Zap, Code, ShieldCheck, Database, RefreshCw, Cpu, Layers, MessageSquare, ChevronDown } from 'lucide-react';

interface LandingViewProps {
  onGetStarted: () => void;
}

export default function LandingView({ onGetStarted }: LandingViewProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const features = [
    { icon: Zap, title: 'Dynamic UI Generation', desc: 'Instantly compile complex forms, charts, tables and container grids directly from raw metadata schema configs.' },
    { icon: Database, title: 'Auto CRUD APIs', desc: 'Every saved configuration automatically spins up dedicated serverless CRUD endpoints with schema guards.' },
    { icon: ShieldCheck, title: 'Runtime Safe Boundaries', desc: 'Built-in schema sanitizers. Unknown nodes or malformed payloads recover gracefully without crashing.' },
    { icon: RefreshCw, title: 'CSV Import Parser', desc: 'Drag-and-drop client CSV parsing utilizing Papa Parse. Automated field matching and duplicate checking.' },
    { icon: Cpu, title: 'Progressive PWA Caching', desc: 'Offline support, secure client storage, and native app installations for seamless runtime execution.' },
    { icon: Layers, title: 'Multi-Language i18n', desc: 'Translate interface texts globally. Real-time language toggles supporting English and Tamil.' }
  ];

  const pricing = [
    { name: 'Developer', price: '$0', desc: 'Perfect for building local dashboards.', features: ['Up to 3 active projects', 'Local memory database client', 'Base builder features', 'English/Tamil UI languages'], action: 'Start Coding Free', current: true },
    { name: 'Professional', price: '$49', desc: 'Empower small engineering squads.', features: ['Unlimited active projects', 'Neon PostgreSQL connection', 'Real-time validation engine', 'Automated CRUD API generation', 'CSV matching parser'], action: 'Upgrade to Professional', current: false, glow: true },
    { name: 'Enterprise', price: '$299', desc: 'Custom enterprise-grade security.', features: ['Custom workspace subdomains', 'Multi-tenant auth access config', 'Sentry-grade Error monitoring', 'Dedicated support channels', '99.9% uptime guarantees'], action: 'Contact Enterprise Sales', current: false }
  ];

  const faqs = [
    { q: 'How does FormForge AI prevent frontend crashes?', a: 'FormForge AI uses standard Zod validation schemas to sanitize JSON configs before compilation. If an invalid attribute or unregistered component type (e.g. "datepicker-pro") is detected, the runtime isolates the node and renders a stylish Fallback component with recovery suggestions, keeping the rest of the application fully intact.' },
    { q: 'Can I connect my own custom PostgreSQL database?', a: 'Yes! While FormForge AI includes a seamless in-memory database fallback to run instantly, you can plug in any standard Neon or local PostgreSQL database connection string in the settings dashboard to persist production CRUD data.' },
    { q: 'What layout structures are supported in the JSON configs?', a: 'We support vertical flows, horizontal blocks, and fully flexible 12-column Grid systems. Inside grids, components can define custom "gridSpan" configurations to resize cleanly on mobile, tablet, and desktop viewports.' }
  ];

  return (
    <div className="w-full bg-[#09090b] text-zinc-100 min-h-screen overflow-y-auto">
      {/* 1. Navbar */}
      <header className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-zinc-900/60 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 shadow-md shadow-violet-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-bold tracking-wider uppercase">FormForge AI</span>
        </div>
        <button
          onClick={onGetStarted}
          className="py-2 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-xs font-semibold text-white transition-all cursor-pointer shadow-lg shadow-violet-500/10"
        >
          Enter Dashboard
        </button>
      </header>

      {/* 2. Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-28 flex flex-col lg:flex-row gap-12 items-center">
        <div className="flex-1 flex flex-col gap-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-blue-400 self-center lg:self-start">
            <Zap className="w-3.5 h-3.5 fill-blue-500/20" /> Enterprise Metaruntime Engine
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-zinc-100">
            Turn JSON configs into <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">functional apps</span> instantly.
          </h1>
          <p className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Ditch boilerplate scaffolding. FormForge AI dynamically compiles robust enterprise forms, dashboard grids, Recharts statistics, and CRUD APIs directly from declarative JSON schemas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-4">
            <button
              onClick={onGetStarted}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-sm font-bold text-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl shadow-violet-500/15"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#pricing"
              className="py-3 px-6 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-sm font-bold text-zinc-200 transition-all text-center"
            >
              Explore Pricing
            </a>
          </div>
        </div>

        {/* Dynamic JSON-to-UI Hero Interactive Mockup */}
        <div className="flex-1 w-full max-w-2xl glass-panel p-6 rounded-2xl glow-violet/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-violet-600/5 blur-[80px] rounded-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Editor preview */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase flex items-center gap-1.5"><Code className="w-3.5 h-3.5" /> schema.json</span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              </div>
              <pre className="text-[10px] font-mono text-zinc-400 bg-zinc-950 p-3.5 rounded-xl border border-zinc-900 overflow-x-auto leading-relaxed">
{`{
  "page": "Intake Portal",
  "layout": "grid",
  "components": [
    {
      "type": "metric",
      "label": "New Leads",
      "value": "284"
    },
    {
      "type": "input",
      "label": "Full Name",
      "required": true
    }
  ]
}`}
              </pre>
            </div>

            {/* Compiled UI preview */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">Compiled View</span>
                <span className="text-[10px] font-bold text-blue-400">Live Preview</span>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-950/40 border border-zinc-900 flex flex-col gap-4">
                {/* Metric mock */}
                <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/40 flex flex-col gap-1">
                  <span className="text-[9px] font-semibold text-zinc-500 uppercase">New Leads</span>
                  <span className="text-xl font-black text-zinc-100">284</span>
                </div>
                {/* Field mock */}
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase">Full Name *</span>
                  <input disabled placeholder="Jane Doe" className="w-full bg-zinc-900 border border-zinc-800 text-[10px] px-3 py-1.5 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Trusted By section */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-y border-zinc-900/80">
        <p className="text-center text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-6">
          ENGINEERED FOR MODERN ENTERPRISE DEVELOPMENT teams
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-40 grayscale contrast-200">
          <span className="text-sm font-black tracking-widest">RETOOL.FF</span>
          <span className="text-sm font-black tracking-widest">BASE44.AI</span>
          <span className="text-sm font-black tracking-widest">APPSMITH.CO</span>
          <span className="text-sm font-black tracking-widest">INTERNAL.OS</span>
        </div>
      </section>

      {/* 4. Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 flex flex-col gap-12">
        <div className="flex flex-col gap-3 text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">Feature Matrix</span>
          <h2 className="text-3xl font-extrabold text-zinc-100 tracking-tight">
            Engineered for high performance applications
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            FormForge AI packages enterprise capabilities directly into client runtimes. No custom configurations, instant compiles.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="glass-panel p-6 rounded-2xl hover:border-zinc-700/60 transition-colors flex flex-col gap-4">
                <div className="p-2.5 rounded-xl bg-blue-950/20 border border-blue-500/20 text-blue-400 w-fit shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-sm font-bold text-zinc-200">{f.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-24 flex flex-col gap-12 border-t border-zinc-900/60">
        <div className="flex flex-col gap-3 text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Simple Tiering</span>
          <h2 className="text-3xl font-extrabold text-zinc-100 tracking-tight">
            Transparent pricing for teams of all sizes
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full">
          {pricing.map((p, i) => (
            <div
              key={i}
              className={`glass-panel p-8 rounded-3xl flex flex-col justify-between relative ${
                p.glow ? 'border-violet-500/40 glow-violet/10 bg-[#0e0e16]/80' : ''
              }`}
            >
              {p.glow && (
                <span className="absolute top-0 right-8 -translate-y-1/2 bg-violet-600 border border-violet-400 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-lg">
                  Popular choice
                </span>
              )}
              <div className="flex flex-col gap-5">
                <div>
                  <h3 className="text-base font-bold text-zinc-200">{p.name}</h3>
                  <p className="text-[11px] text-zinc-500 mt-1">{p.desc}</p>
                </div>
                <div className="flex items-baseline gap-1 py-2">
                  <span className="text-4xl font-black text-zinc-100">{p.price}</span>
                  <span className="text-xs font-semibold text-zinc-500">/ month</span>
                </div>
                <div className="border-t border-zinc-800/80 my-1" />
                <ul className="flex flex-col gap-2.5 text-xs text-zinc-400 pl-1">
                  {p.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={onGetStarted}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer mt-8 ${
                  p.glow
                    ? 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-lg shadow-violet-500/10'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                {p.action}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ Accordions */}
      <section className="max-w-4xl mx-auto px-6 py-24 flex flex-col gap-12 border-t border-zinc-900/60">
        <div className="text-center flex flex-col gap-3">
          <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">Help Center</span>
          <h2 className="text-3xl font-extrabold text-zinc-100 tracking-tight">Frequently Asked Questions</h2>
        </div>
        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className="glass-panel rounded-2xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-zinc-200 hover:text-zinc-100 text-sm font-semibold select-none cursor-pointer"
                >
                  {faq.q}
                  <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-zinc-400 leading-relaxed border-t border-zinc-900 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="border-t border-zinc-900/60 bg-zinc-950/20 py-12 text-center text-xs text-zinc-500">
        <p>© 2026 FormForge AI Inc. Built on Next.js App Router and Prisma ORM.</p>
      </footer>
    </div>
  );
}
