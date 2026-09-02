'use client';

import React from 'react';
import { LayoutDashboard, AlertTriangle, ShieldCheck, Volume2, VolumeX, Droplet } from 'lucide-react';

interface SidebarProps {
  activeTab: 'dashboard' | 'alerts' | 'devices';
  setActiveTab: (tab: 'dashboard' | 'alerts' | 'devices') => void;
  isUnsafe: boolean;
  audioMuted: boolean;
  onToggleAudio: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isUnsafe,
  audioMuted,
  onToggleAudio
}) => {
  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0 min-h-screen">
      
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-3 mb-6">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Droplet className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-extrabold text-slate-100 text-base leading-tight tracking-tight">
              JalRakshak
            </h1>
            <p className="text-xs text-slate-400 font-medium">Smart Water Monitoring</p>
          </div>
        </div>

        {/* Navigation Menu Items */}
        <nav className="space-y-1.5">
          {/* Dashboard */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </button>

          {/* Alerts */}
          <button
            onClick={() => setActiveTab('alerts')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'alerts'
                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Alerts</span>
            </div>
            {isUnsafe && (
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-red-600 text-white animate-pulse">
                ALARM
              </span>
            )}
          </button>

          {/* Device Status */}
          <button
            onClick={() => setActiveTab('devices')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'devices'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Device Status</span>
          </button>
        </nav>
      </div>

      {/* Audio Mute / Unmute Control */}
      <div className="pt-4 border-t border-slate-800">
        <button
          onClick={onToggleAudio}
          className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all ${
            audioMuted
              ? 'bg-slate-800/80 border-slate-700 text-slate-400'
              : 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {audioMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span>{audioMuted ? 'Voice Alerts Off' : 'Voice Alerts Active'}</span>
          </div>
          <span className="text-[10px] uppercase font-black opacity-80">
            {audioMuted ? 'Muted' : 'Live'}
          </span>
        </button>
      </div>

    </aside>
  );
};
