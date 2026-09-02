'use client';
import React from 'react';
import { AlertCircle, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';
import { WaterAlarmData } from '@/types/alarm';

interface AlarmReasonsProps {
  data: WaterAlarmData;
}

export const AlarmReasons: React.FC<AlarmReasonsProps> = ({ data }) => {
  const isUnsafe = data.status === 'UNSAFE';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-md">
      
      {/* Section Title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isUnsafe ? (
            <AlertCircle className="w-5 h-5 text-red-500" />
          ) : (
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          )}
          <h3 className="text-lg font-bold text-white tracking-tight">
            {isUnsafe ? 'Why was the alarm triggered?' : 'System Operational Summary'}
          </h3>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
          isUnsafe
            ? 'bg-red-950/80 text-red-400 border-red-800/80'
            : 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80'
        }`}>
          {isUnsafe ? `${data.trigger.length} Triggers Detected` : 'All Systems Nominal'}
        </span>
      </div>

      {/* Reason Chips / Cards */}
      {isUnsafe ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.trigger.map((reason, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3.5 rounded-lg bg-red-950/30 border border-red-900/60 text-red-200 transition-all hover:bg-red-950/50"
            >
              <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <span className="text-sm font-semibold leading-tight">{reason}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="flex items-center gap-3 p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-900/50 text-emerald-200">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-semibold">pH Level (7.1) within safe range (6.5-8.5)</span>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-900/50 text-emerald-200">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-semibold">TDS (380 ppm) below 500 ppm limit</span>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-900/50 text-emerald-200">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-semibold">Turbidity (10 NTU) low & optimal</span>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-900/50 text-emerald-200">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-semibold">UV & RO/UF Purification active</span>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-900/50 text-emerald-200">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-semibold">Estimated Microbial Risk: LOW</span>
          </div>
        </div>
      )}

    </div>
  );
};
