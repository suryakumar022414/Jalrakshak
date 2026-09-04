'use client';

import React from 'react';
import { ShieldCheck, Wifi, WifiOff, Radio } from 'lucide-react';
import { SystemStatusStats } from '@/types/alarm';

interface SystemStatusWidgetProps {
  stats: SystemStatusStats;
}

export const SystemStatusWidget: React.FC<SystemStatusWidgetProps> = ({ stats }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg w-full md:w-80">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
        <ShieldCheck className="w-5 h-5 text-emerald-400" />
        <h3 className="font-bold text-slate-100 text-base">System Status</h3>
      </div>

      {/* Online / Offline List */}
      <div className="space-y-3">
        {/* Online Count */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Online</span>
          </div>
          <span className="text-2xl font-black text-slate-100">{stats.online}</span>
        </div>

        {/* Offline Count */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>Offline</span>
          </div>
          <span className="text-2xl font-black text-slate-100">{stats.offline}</span>
        </div>
      </div>

      {/* Network Protocol Telemetry Badge */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col gap-1.5 p-3 rounded-xl bg-slate-950/80 border border-indigo-500/30">
        <div className="flex items-center justify-between text-xs text-indigo-300 font-bold">
          <div className="flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>Network Protocol</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>
        <div className="text-xs font-semibold text-slate-200">
          Connectivity: <strong className="text-indigo-400">LoRaWAN (Primary) | GSM Fallback</strong>
        </div>
      </div>

    </div>
  );
};
