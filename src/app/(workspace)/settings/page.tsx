'use client';

import React, { useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { useProjectsStore } from '../../../store/projectsStore';
import { Settings, Key, User, Globe, Trash2, Eye, EyeOff, Clipboard, Check } from 'lucide-react';

export default function SettingsPage() {
  const { user, updateProfile, generateApiKey, language, setLanguage } = useAuthStore();
  const { addToast } = useProjectsStore();
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Profile inputs state
  const [name, setName] = useState(user?.name || 'Alex Mercer');
  const [email, setEmail] = useState(user?.email || 'alex@formforge.ai');
  const [activeTab, setActiveTab] = useState<'profile' | 'api' | 'i18n' | 'danger'>('profile');

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email });
    addToast('Profile metadata synchronized successfully!', 'success');
  };

  const handleCopyKey = () => {
    if (!user?.apiKey) return;
    navigator.clipboard.writeText(user.apiKey);
    setCopied(true);
    addToast('API live token copied to clipboard.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRotateKey = () => {
    const newKey = generateApiKey();
    addToast('Successfully rolled API authorization keys!', 'info');
  };

  const handlePurgeSimulation = () => {
    if (confirm("Are you sure you want to purge all active cache logs? This resets submissions and latencies to mock defaults.")) {
      addToast('Simulated operations data reset completed.', 'info');
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-zinc-800/60 pb-5 shrink-0">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
          Control Panel Settings <Settings className="w-5 h-5 text-zinc-400" />
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Adjust profile details, translate interface variables, and handle OAuth tokens.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left Segmented selector */}
        <div className="md:col-span-1 flex flex-col gap-2.5">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">
            Dashboard Groups
          </span>
          <div className="glass-panel p-2.5 rounded-2xl flex flex-col gap-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left py-2 px-3 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-zinc-900 text-blue-400 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <User className="w-4 h-4" /> Personal Profile
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`w-full text-left py-2 px-3 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'api'
                  ? 'bg-zinc-900 text-blue-400 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Key className="w-4 h-4" /> API Credentials
            </button>
            <button
              onClick={() => setActiveTab('i18n')}
              className={`w-full text-left py-2 px-3 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'i18n'
                  ? 'bg-zinc-900 text-blue-400 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Globe className="w-4 h-4" /> Language i18n
            </button>
          </div>
        </div>

        {/* Right Tab Content */}
        <div className="md:col-span-2 flex flex-col gap-6">
          
          {activeTab === 'profile' && (
            /* Profile Card */
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider border-b border-zinc-855 pb-2 flex items-center gap-1.5">
                <User className="w-4 h-4 text-zinc-500" /> Account Information
              </h3>
              
              <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Your Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full glass-input py-2.5 px-3.5 rounded-xl text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Work Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full glass-input py-2.5 px-3.5 rounded-xl text-xs"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-200 cursor-pointer self-end transition-colors"
                >
                  Save Details
                </button>
              </form>
            </div>
          )}

          {activeTab === 'api' && (
            /* Secure Keys Card */
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 glow-blue/5">
              <div className="flex justify-between items-center border-b border-zinc-850 pb-2">
                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-zinc-500" /> API Access Tokens
                </h3>
                <button
                  onClick={handleRotateKey}
                  className="text-[10px] font-bold text-blue-400 hover:underline cursor-pointer"
                >
                  Revoke & Roll Key
                </button>
              </div>
              
              <p className="text-[11px] text-zinc-450 leading-relaxed">
                Use this token key to authenticate external CSV uploads and dynamic form data submissions.
              </p>

              <div className="flex gap-2 items-center mt-1">
                <div className="flex-1 glass-input py-2.5 px-4 rounded-xl flex items-center justify-between">
                  <span className="font-mono text-xs select-all text-zinc-350 tracking-wider">
                    {showKey ? user?.apiKey : 'ff_live_••••••••••••••••••••••••'}
                  </span>
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="p-1 rounded text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  onClick={handleCopyKey}
                  className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200 cursor-pointer flex items-center justify-center shrink-0 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Clipboard className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'i18n' && (
            /* Internationalization setting */
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider border-b border-zinc-850 pb-2 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-zinc-500" /> Localization & Language
              </h3>
              <p className="text-[11px] text-zinc-450 leading-relaxed">
                Toggle the system compiler workspace rendering vocabulary translations.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setLanguage('en')}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    language === 'en'
                      ? 'bg-blue-950/40 border-blue-500/20 text-blue-400 font-bold'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
                  }`}
                >
                  English (United States)
                </button>
                <button
                  onClick={() => setLanguage('ta')}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    language === 'ta'
                      ? 'bg-blue-950/40 border-blue-500/20 text-blue-400 font-bold'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
                  }`}
                >
                  Tamil (தமிழ்)
                </button>
              </div>
            </div>
          )}

          {/* Dangerous accounts card */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 border-red-500/20 mt-4">
            <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider border-b border-red-950 pb-2 flex items-center gap-1.5">
              <Trash2 className="w-4.5 h-4.5 text-red-500" /> Destruction Danger Zone
            </h3>
            <p className="text-[11px] text-zinc-450 leading-relaxed">
              Permanently purge simulated client databases, API latencies logs, and submission records histories. This is irreversible.
            </p>
            <button
              onClick={handlePurgeSimulation}
              className="py-2.5 px-4 rounded-xl bg-red-950/20 hover:bg-red-950/40 border border-red-500/30 hover:border-red-500/60 text-xs font-bold text-red-400 cursor-pointer self-start transition-colors"
            >
              Destroy Simulation Cache
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
