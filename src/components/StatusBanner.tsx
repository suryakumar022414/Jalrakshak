'use client';

import React from 'react';
import { CheckCircle2, ShieldAlert, Bell, Settings, User, Volume2 } from 'lucide-react';
import { WaterAlarmData } from '@/types/alarm';
import { playHindiVoiceAlert } from '@/utils/audioAlert';

interface StatusBannerProps {
  data: WaterAlarmData;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({ data }) => {
  const isUnsafe = data.status === 'UNSAFE';

  const handleAudioClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playHindiVoiceAlert(data.status);
  };

  return (
    <div className="w-full space-y-4">
      
      {/* Top Header Controls Bar */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-slate-300 text-sm font-semibold">
          <span className="text-slate-400">JalRakshak</span>
          <span>/</span>
          <span className="text-white font-bold">{data.location}</span>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors">
            <User className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Status Pill Banner (Exact Layout match from Reference Image) */}
      <div className={`w-full py-4 px-6 rounded-full flex flex-wrap items-center justify-center gap-3 text-lg sm:text-xl font-black tracking-wide shadow-lg transition-all duration-500 ${
        isUnsafe
          ? 'bg-gradient-to-r from-red-700 via-red-600 to-red-800 text-white shadow-red-950/60 ring-2 ring-red-500/50 animate-pulse'
          : 'bg-emerald-800 text-white shadow-emerald-950/40 ring-1 ring-emerald-600/40'
      }`}>
        {isUnsafe ? (
          <>
            <ShieldAlert className="w-7 h-7 text-white animate-bounce" />
            <span>WATER STATUS: UNSAFE — HIGH CONTAMINATION RISK</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-7 h-7 text-emerald-300" />
            <span>WATER STATUS: SAFE</span>
          </>
        )}

        {/* Multilingual Voice Alert Button (Hindi Audio Trigger for Village Illiteracy Accessibility) */}
        <button
          onClick={handleAudioClick}
          title="Play Hindi Voice Alert / DFPlayer Mini Audio Announcement"
          className="ml-2 p-2 rounded-full bg-slate-950/40 hover:bg-slate-950/70 border border-white/20 text-white transition-all transform hover:scale-110 flex items-center gap-1.5 text-xs font-bold shrink-0"
        >
          <Volume2 className="w-5 h-5 text-amber-300 animate-pulse" />
          <span className="hidden sm:inline text-amber-200">🔊 हिंदी (Voice Alert)</span>
        </button>
      </div>

    </div>
  );
};
