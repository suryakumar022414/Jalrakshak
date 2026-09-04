'use client';

import React from 'react';
import { Pickaxe, AlertTriangle, ShieldCheck, AlertCircle, Biohazard } from 'lucide-react';
import { WaterParameters } from '@/types/alarm';
import { calculateMiningRisk } from '@/utils/waterMetrics';

interface MiningRiskCardProps {
  parameters: WaterParameters;
}

export const MiningRiskCard: React.FC<MiningRiskCardProps> = ({ parameters }) => {
  const risk = calculateMiningRisk(parameters);
  const isHighRisk = risk.score >= 70;
  const isModRisk = risk.score >= 35 && risk.score < 70;
  
  // Is Unsafe triggered (e.g. by slider parameters or Simulate Unsafe Water button)
  const isUnsafeWater = isHighRisk || isModRisk || parameters.tds > 500 || parameters.ph < 6.5 || parameters.turbidity > 15;

  const heavyMetals = [
    { name: 'Arsenic (As)', safeVal: '<0.01 mg/L (Safe)', unsafeVal: '0.08 mg/L (CRITICAL SPIKE)', critical: true },
    { name: 'Lead (Pb)', safeVal: '<0.01 mg/L (Safe)', unsafeVal: '0.12 mg/L (CRITICAL SPIKE)', critical: true },
    { name: 'Chromium (Cr)', safeVal: '<0.05 mg/L (Safe)', unsafeVal: '0.09 mg/L (ELEVATED)', critical: false },
    { name: 'Fluoride (F)', safeVal: '<1.5 mg/L (Safe)', unsafeVal: '2.8 mg/L (ELEVATED)', critical: false },
  ];

  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-300 ${
        isUnsafeWater
          ? 'bg-red-950/40 border-red-500/70 shadow-lg shadow-red-950/50 text-white ring-2 ring-red-500/30 animate-pulse'
          : 'bg-slate-900/80 border-slate-800 shadow-md text-slate-100 hover:border-slate-700'
      }`}
    >
      {/* Title & Icon Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 text-slate-300">
          <div
            className={`p-2 rounded-xl ${
              isUnsafeWater
                ? 'bg-red-500/20 text-red-400'
                : 'bg-emerald-500/20 text-emerald-400'
            }`}
          >
            <Pickaxe className="w-5 h-5" />
          </div>
          <span className="font-semibold text-sm">Mining Runoff Risk</span>
        </div>

        {isUnsafeWater && (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wide bg-red-900/90 text-red-200 border border-red-500 animate-bounce flex items-center gap-1.5 shadow-md">
            <Biohazard className="w-4 h-4 text-red-300" />
            CRITICAL: Lead & Arsenic Spike Detected
          </span>
        )}
      </div>

      {/* Dynamic Score & Status Tag */}
      <div className="my-2 flex items-baseline justify-between gap-2 flex-wrap">
        <div className="flex items-baseline gap-1">
          <span
            className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${
              isUnsafeWater ? 'text-red-400' : 'text-emerald-400'
            }`}
          >
            {isUnsafeWater ? (risk.score === 0 ? 85 : risk.score) : 0}%
          </span>
          <span className="text-xs font-bold text-slate-400">Risk Index</span>
        </div>

        <div>
          {isUnsafeWater ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wide bg-red-950 text-red-400 border border-red-800 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              High Heavy Metal Risk
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wide bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              0% Low Risk
            </span>
          )}
        </div>
      </div>

      {/* Targeted Heavy Metal Indicator Badges */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-1">
          <span>Targeted Heavy Metal Indicators</span>
          <span className={isUnsafeWater ? 'text-red-400 font-extrabold' : 'text-emerald-400'}>
            {isUnsafeWater ? '⚠️ Heavy Metal Spike Active' : '● Baseline Safe'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {heavyMetals.map((metal, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-xl text-xs flex flex-col justify-center transition-all ${
                isUnsafeWater
                  ? 'bg-red-950/80 border border-red-500/80 text-red-200 font-bold shadow-md ring-1 ring-red-500/40'
                  : 'bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 font-semibold hover:border-emerald-500/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold">{metal.name}</span>
                {isUnsafeWater ? (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                )}
              </div>
              <span
                className={`text-[11px] font-mono mt-1 ${
                  isUnsafeWater ? 'text-red-300 font-extrabold' : 'text-emerald-400/90'
                }`}
              >
                {isUnsafeWater ? metal.unsafeVal : metal.safeVal}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
