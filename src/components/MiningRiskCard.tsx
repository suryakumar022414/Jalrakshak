'use client';

import React from 'react';
import { Pickaxe, AlertTriangle, ShieldCheck, AlertCircle } from 'lucide-react';
import { WaterParameters } from '@/types/alarm';
import { calculateMiningRisk, MiningRiskTag } from '@/utils/waterMetrics';

interface MiningRiskCardProps {
  parameters: WaterParameters;
}

export const MiningRiskCard: React.FC<MiningRiskCardProps> = ({ parameters }) => {
  const risk = calculateMiningRisk(parameters);

  const getTagBadge = (statusTag: MiningRiskTag) => {
    switch (statusTag) {
      case 'High Heavy Metal Risk':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wide bg-red-950 text-red-400 border border-red-800 animate-pulse flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            High Heavy Metal Risk
          </span>
        );
      case 'Moderate Risk':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wide bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-300" />
            Moderate Risk
          </span>
        );
      case 'Low Risk':
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wide bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Low Risk
          </span>
        );
    }
  };

  const isHighRisk = risk.score >= 70;
  const isModRisk = risk.score >= 35 && risk.score < 70;

  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-300 ${
        isHighRisk
          ? 'bg-red-950/40 border-red-500/70 shadow-lg shadow-red-950/50 text-white ring-2 ring-red-500/30 animate-pulse'
          : isModRisk
          ? 'bg-amber-950/30 border-amber-600/50 shadow-md text-amber-100 hover:border-amber-500'
          : 'bg-slate-900/80 border-slate-800 shadow-md text-slate-100 hover:border-slate-700'
      }`}
    >
      {/* Title & Icon */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 text-slate-300">
          <div
            className={`p-2 rounded-xl ${
              isHighRisk
                ? 'bg-red-500/20 text-red-400'
                : isModRisk
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-emerald-500/20 text-emerald-400'
            }`}
          >
            <Pickaxe className="w-5 h-5" />
          </div>
          <span className="font-semibold text-sm">Mining Runoff Risk</span>
        </div>
      </div>

      {/* Dynamic Score & Status Tag */}
      <div className="my-2 flex items-baseline justify-between gap-2 flex-wrap">
        <div className="flex items-baseline gap-1">
          <span
            className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${
              isHighRisk ? 'text-red-400' : isModRisk ? 'text-amber-300' : 'text-emerald-400'
            }`}
          >
            {risk.score}%
          </span>
          <span className="text-xs font-bold text-slate-400">Risk Index</span>
        </div>

        <div>{getTagBadge(risk.statusTag)}</div>
      </div>

      {/* Breakdown or indicators */}
      <div className="flex flex-col gap-1 mt-3 pt-2 border-t border-slate-800/80 text-xs">
        {risk.indicators.length > 0 ? (
          risk.indicators.map((ind, idx) => (
            <span key={idx} className="text-amber-300/90 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              {ind}
            </span>
          ))
        ) : (
          <span className="text-emerald-400/90 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            No active heavy metal runoff indicators detected.
          </span>
        )}
      </div>
    </div>
  );
};
