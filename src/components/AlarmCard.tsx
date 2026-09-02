'use client';
import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, Activity, Info } from 'lucide-react';
import { WaterAlarmData } from '@/types/alarm';

interface AlarmCardProps {
  data: WaterAlarmData;
}

export const AlarmCard: React.FC<AlarmCardProps> = ({ data }) => {
  const isUnsafe = data.status === 'UNSAFE';

  return (
    <div className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-500 p-6 sm:p-8 text-center ${
      isUnsafe
        ? 'bg-gradient-to-b from-red-950 via-red-900 to-slate-950 border-red-600 shadow-2xl shadow-red-900/40 text-white'
        : 'bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 border-emerald-500 shadow-xl shadow-emerald-950/50 text-white'
    }`}>
      
      {/* Background Subtle Glow Pulse for Unsafe State */}
      {isUnsafe && (
        <div className="absolute inset-0 bg-red-600/10 animate-pulse pointer-events-none" />
      )}

      <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
        
        {/* Alarm Siren / Icon Badge */}
        <div className="mb-4">
          <div className={`relative p-5 rounded-full ${
            isUnsafe
              ? 'bg-red-600/20 text-red-500 ring-4 ring-red-500/30 animate-bounce'
              : 'bg-emerald-500/20 text-emerald-400 ring-4 ring-emerald-500/30'
          }`}>
            {isUnsafe ? (
              <span className="text-4xl sm:text-5xl" role="img" aria-label="alarm siren">
                🚨
              </span>
            ) : (
              <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14 stroke-[2.5]" />
            )}
          </div>
        </div>

        {/* Section Tag */}
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold tracking-widest uppercase mb-1 opacity-90">
          <Activity className="w-4 h-4" />
          <span>WATER SAFETY STATUS</span>
        </div>

        {/* Main Status Headline */}
        <h2 className={`text-4xl sm:text-6xl font-black tracking-tight my-2 ${
          isUnsafe ? 'text-red-400 drop-shadow-[0_0_25px_rgba(239,68,68,0.5)]' : 'text-emerald-400 drop-shadow-[0_0_25px_rgba(16,185,129,0.4)]'
        }`}>
          {data.status}
        </h2>

        {/* Risk Level Badge */}
        <div className="my-3">
          <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm sm:text-base font-extrabold uppercase tracking-wider shadow-md ${
            isUnsafe
              ? 'bg-red-600 text-white shadow-red-900/50 ring-2 ring-red-400/50'
              : 'bg-emerald-600 text-white shadow-emerald-950/50 ring-2 ring-emerald-400/50'
          }`}>
            {isUnsafe ? <ShieldAlert className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            {data.alarmLevel} ALARM RISK — MICROBIAL RISK: {data.microbialRisk}
          </span>
        </div>

        {/* Cause / Explanation text */}
        <p className={`text-base sm:text-xl font-semibold max-w-xl my-2 ${
          isUnsafe ? 'text-red-200' : 'text-emerald-200'
        }`}>
          {isUnsafe
            ? '"High microbial contamination risk suspected."'
            : '"Water quality parameters within safe parameters. Purification active."'
          }
        </p>

        {/* Scientific Framing Disclaimer (Mandatory Requirement) */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 w-full flex items-start justify-center gap-2 text-xs text-slate-400 max-w-lg">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-left leading-relaxed">
            <span className="font-semibold text-slate-300">Scientific Framing:</span> Microbial risk is estimated using physical and chemical indicators (turbidity, TDS, temperature, and purification operational status).
          </p>
        </div>

      </div>
    </div>
  );
};
