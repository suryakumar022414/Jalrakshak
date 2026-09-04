'use client';

import React from 'react';
import { CheckCircle2, ShieldAlert, Bell, Settings, User, Volume2 } from 'lucide-react';
import { WaterAlarmData } from '@/types/alarm';
import { playHindiVoiceAlert } from '@/utils/audioAlert';
import { MagicRings } from '@/components/MagicRings';

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

      {/* Main Status Banner Container featuring React Bits <MagicRings /> WebGL animation */}
      <div className="relative w-full rounded-full overflow-hidden p-[2px]">
        {/* React Bits MagicRings canvas overlay */}
        <MagicRings
          key={isUnsafe ? 'unsafe-rings' : 'safe-rings'}
          color={isUnsafe ? '#ef4444' : '#10b981'}
          colorTwo={isUnsafe ? '#dc2626' : '#06b6d4'}
          ringCount={6}
          speed={isUnsafe ? 1.8 : 0.8}
          lineThickness={2.5}
          baseRadius={0.25}
          radiusStep={0.12}
          opacity={0.85}
          noiseAmount={isUnsafe ? 0.25 : 0.08}
        />

        <div
          className={`relative z-10 w-full py-4 px-6 rounded-full flex flex-wrap items-center justify-center gap-3 text-lg sm:text-xl font-black tracking-wide shadow-xl transition-all duration-500 backdrop-blur-md ${
            isUnsafe
              ? 'bg-gradient-to-r from-red-950/90 via-red-900/90 to-red-950/90 text-white border border-red-500/80 shadow-red-950/70 ring-2 ring-red-500/50 animate-pulse'
              : 'bg-gradient-to-r from-emerald-950/90 via-slate-900/90 to-emerald-950/90 text-white border border-emerald-500/60 shadow-emerald-950/50 ring-1 ring-emerald-500/40'
          }`}
        >
          {isUnsafe ? (
            <>
              <ShieldAlert className="w-7 h-7 text-red-400 animate-bounce shrink-0" />
              <span>WATER STATUS: UNSAFE — HIGH CONTAMINATION RISK</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0" />
              <span>WATER STATUS: SAFE</span>
            </>
          )}

          {/* Multilingual Voice Alert Button (Hindi Audio Trigger for Village Illiteracy Accessibility) */}
          <button
            onClick={handleAudioClick}
            title="Play Hindi Voice Alert / DFPlayer Mini Audio Announcement"
            className="ml-2 p-2 rounded-full bg-slate-950/60 hover:bg-slate-950/90 border border-white/20 text-white transition-all transform hover:scale-110 flex items-center gap-1.5 text-xs font-bold shrink-0 shadow-lg"
          >
            <Volume2 className="w-5 h-5 text-amber-300 animate-pulse" />
            <span className="hidden sm:inline text-amber-200">🔊 हिंदी (Voice Alert)</span>
          </button>
        </div>
      </div>

    </div>
  );
};
