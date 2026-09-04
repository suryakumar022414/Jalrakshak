'use client';
import React from 'react';
import { Droplet, MapPin, Clock, ShieldAlert, ShieldCheck, Radio } from 'lucide-react';
import { WaterAlarmData } from '@/types/alarm';

interface HeaderProps {
  data: WaterAlarmData;
}

export const Header: React.FC<HeaderProps> = ({ data }) => {
  const isUnsafe = data.status === 'UNSAFE';

  // Format timestamp nicely
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return isoString;
    }
  };

  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 text-white py-4 px-4 sm:px-8 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${isUnsafe ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'} transition-colors`}>
            <Droplet className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                JalRakshak
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Smart Water Box
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-400">
              Smart Water Safety Alarm System
            </p>
          </div>
        </div>

        {/* Location & Live Info */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm">
          {/* Location Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-200">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{data.location}</span>
          </div>

          {/* Timestamp */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{formatDate(data.timestamp)}</span>
          </div>

          {/* LoRaWAN Telemetry Protocol Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-950/50 border border-indigo-500/50 text-indigo-200">
            <Radio className="w-4 h-4 text-indigo-400 shrink-0 animate-pulse" />
            <span className="font-semibold text-xs">
              Connectivity: <strong className="text-white font-bold">LoRaWAN (Primary) | GSM Fallback</strong>
            </span>
          </div>

          {/* Quick System Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider text-xs border ${
            isUnsafe 
              ? 'bg-red-950/60 text-red-400 border-red-800/80 animate-pulse' 
              : 'bg-emerald-950/60 text-emerald-400 border-emerald-800/80'
          }`}>
            {isUnsafe ? (
              <>
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>ALARM ACTIVE</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>SYSTEM NORMAL</span>
              </>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
