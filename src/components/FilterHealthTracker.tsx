'use client';

import React from 'react';
import { Activity, AlertTriangle, ShieldCheck, Wrench } from 'lucide-react';
import { WaterParameters } from '@/types/alarm';
import { calculateFilterHealth } from '@/utils/waterMetrics';

interface FilterHealthTrackerProps {
  parameters: WaterParameters;
  operatingHours?: number;
}

export const FilterHealthTracker: React.FC<FilterHealthTrackerProps> = ({
  parameters,
  operatingHours = 240
}) => {
  const health = calculateFilterHealth(parameters, operatingHours);

  const filters = [
    {
      stage: 'Stage 1',
      name: 'Sediment Filter',
      description: 'Particulate & Silt Filtration',
      val: health.sediment
    },
    {
      stage: 'Stage 2',
      name: 'Activated Alumina & Bio-Adsorbent (Rice Husk Ash)',
      description: 'Sustainable Heavy Metal & Fluoride Filtration Media',
      val: health.carbon
    },
    {
      stage: 'Stage 3',
      name: 'RO / UV Membrane',
      description: 'Microbial & Dissolved Solid Barrier',
      val: health.ro
    }
  ];

  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-300 ${
        health.hasWarning
          ? 'bg-slate-900 border-red-500/70 shadow-lg shadow-red-950/40 ring-1 ring-red-500/30'
          : 'bg-slate-900/90 border-slate-800 shadow-lg'
      }`}
    >
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Wrench className={`w-5 h-5 ${health.hasWarning ? 'text-red-400' : 'text-emerald-400'}`} />
          <h3 className="font-bold text-slate-100 text-base">Filter Health & Maintenance</h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">
            Runtime: <strong className="text-slate-200">{operatingHours} hrs</strong>
          </span>
          {health.hasWarning ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-950 text-red-400 border border-red-800 animate-pulse flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              CRITICAL MAINTENANCE REQUIRED
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              SYSTEM OPTIMAL
            </span>
          )}
        </div>
      </div>

      {/* 3 Stages Progress Bars */}
      <div className="space-y-4">
        {filters.map((f, i) => {
          const isCritical = f.val < 20;

          return (
            <div
              key={i}
              className={`p-3.5 rounded-xl border transition-all ${
                isCritical
                  ? 'bg-red-950/40 border-red-800/80 text-white animate-pulse'
                  : 'bg-slate-950/60 border-slate-800 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      {f.stage}
                    </span>
                    <h4 className="font-bold text-sm text-slate-100">{f.name}</h4>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{f.description}</p>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xl font-extrabold font-mono ${
                      isCritical ? 'text-red-400' : f.val < 50 ? 'text-amber-300' : 'text-emerald-400'
                    }`}
                  >
                    {f.val}%
                  </span>
                  {isCritical && (
                    <span className="block text-[10px] text-red-400 font-black uppercase tracking-wide">
                      REPLACE FILTER!
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar Track */}
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mt-2">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    isCritical
                      ? 'bg-red-500 shadow-lg shadow-red-500/50'
                      : f.val < 50
                      ? 'bg-amber-400'
                      : 'bg-emerald-400'
                  }`}
                  style={{ width: `${f.val}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
