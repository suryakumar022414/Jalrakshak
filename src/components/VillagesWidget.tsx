'use client';

import React from 'react';
import { MapPin, Cpu, Radio } from 'lucide-react';
import { VillageStats } from '@/types/alarm';

interface VillagesWidgetProps {
  stats: VillageStats;
}

export const VillagesWidget: React.FC<VillagesWidgetProps> = ({ stats }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex-1">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
        <MapPin className="w-5 h-5 text-emerald-400" />
        <h3 className="font-bold text-slate-100 text-base">Villages Monitored</h3>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3">
        {/* Total Villages */}
        <div className="flex flex-col justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-xs font-medium text-slate-400">Total Villages</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-100">{stats.totalVillages}</span>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
          </div>
        </div>

        {/* Devices Deployed */}
        <div className="flex flex-col justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-xs font-medium text-slate-400">Devices Deployed</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-100">{stats.devicesDeployed}</span>
            <Cpu className="w-4 h-4 text-slate-500" />
          </div>
        </div>

        {/* Active Devices */}
        <div className="flex flex-col justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-xs font-medium text-slate-400">Active Devices</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black text-emerald-400">{stats.activeDevices}</span>
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
        </div>
      </div>

    </div>
  );
};
