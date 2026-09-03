'use client';

import React from 'react';
import { Droplet, Award, PlusCircle } from 'lucide-react';

interface CommunityWaterDispenserProps {
  litersPurifiedToday: number;
  dailyTarget: number;
  onDispense10L?: () => void;
}

export const CommunityWaterDispenser: React.FC<CommunityWaterDispenserProps> = ({
  litersPurifiedToday,
  dailyTarget,
  onDispense10L
}) => {
  const percentage = Math.min(100, Math.round((litersPurifiedToday / dailyTarget) * 100));

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Droplet className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-slate-100 text-base">Community Water Dispensing & Usage</h3>
        </div>
        <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300">
          Village Dispenser Telemetry
        </span>
      </div>

      {/* Main Counter Display */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div>
          <span className="text-xs font-semibold text-slate-400 block mb-1">Liters Purified Today</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-slate-100 font-mono tracking-tight">
              {litersPurifiedToday.toLocaleString()}
            </span>
            <span className="text-lg font-bold text-slate-400 font-mono">/ {dailyTarget.toLocaleString()} L</span>
          </div>
        </div>

        {/* Completion Rate Pill */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-bold text-slate-300">
          <Award className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-500 font-semibold block leading-tight">Daily Goal Progress</span>
            <span className="text-sm font-extrabold text-cyan-400">{percentage}% Completed</span>
          </div>
        </div>
      </div>

      {/* Subtle Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-400 font-medium">
          <span>Village Daily Supply Target</span>
          <span>{percentage}%</span>
        </div>
        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-600 via-teal-500 to-emerald-400 transition-all duration-500 rounded-full shadow-sm"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
