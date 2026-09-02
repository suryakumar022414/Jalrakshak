'use client';
import React from 'react';
import { Power, Zap, Shield, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { PurificationStatus as PurificationType } from '@/types/alarm';

interface PurificationStatusProps {
  purification: PurificationType;
}

export const PurificationStatus: React.FC<PurificationStatusProps> = ({ purification }) => {
  const isAllActive = purification.uv && purification.roUf;

  return (
    <div className={`rounded-xl border p-5 transition-all duration-300 ${
      isAllActive
        ? 'bg-slate-900/80 border-slate-800 shadow-sm'
        : 'bg-slate-900 border-red-900/60 shadow-lg shadow-red-950/30 ring-1 ring-red-500/30'
    }`}>
      
      {/* Top Title Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Power className={`w-5 h-5 ${isAllActive ? 'text-emerald-400' : 'text-red-500'}`} />
          <h3 className="text-lg font-bold text-white tracking-tight">Purification Status</h3>
        </div>
        
        {/* Main Status Pill */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
          isAllActive
            ? 'bg-emerald-950 text-emerald-400 border-emerald-800/80'
            : 'bg-red-950 text-red-400 border-red-800/80 animate-pulse'
        }`}>
          {isAllActive ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>STATUS: ACTIVE (ON)</span>
            </>
          ) : (
            <>
              <AlertOctagon className="w-4 h-4" />
              <span>STATUS: INACTIVE (OFF)</span>
            </>
          )}
        </div>
      </div>

      {/* Subsystem Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* UV Subsystem */}
        <div className={`flex items-center justify-between p-4 rounded-lg border ${
          purification.uv
            ? 'bg-emerald-950/20 border-emerald-800/60 text-slate-100'
            : 'bg-red-950/30 border-red-800/70 text-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <Zap className={`w-6 h-6 ${purification.uv ? 'text-emerald-400' : 'text-red-500'}`} />
            <div>
              <h4 className="font-bold text-sm text-slate-100">UV Purification Unit</h4>
              <p className="text-xs text-slate-400">Ultraviolet Disinfection</p>
            </div>
          </div>
          <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-md border ${
            purification.uv
              ? 'bg-emerald-900/60 text-emerald-300 border-emerald-700'
              : 'bg-red-900/60 text-red-300 border-red-700'
          }`}>
            {purification.uv ? 'ON' : 'OFF'}
          </span>
        </div>

        {/* RO / UF Subsystem */}
        <div className={`flex items-center justify-between p-4 rounded-lg border ${
          purification.roUf
            ? 'bg-emerald-950/20 border-emerald-800/60 text-slate-100'
            : 'bg-red-950/30 border-red-800/70 text-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <Shield className={`w-6 h-6 ${purification.roUf ? 'text-emerald-400' : 'text-red-500'}`} />
            <div>
              <h4 className="font-bold text-sm text-slate-100">RO / UF Membrane</h4>
              <p className="text-xs text-slate-400">Reverse Osmosis & Filtration</p>
            </div>
          </div>
          <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-md border ${
            purification.roUf
              ? 'bg-emerald-900/60 text-emerald-300 border-emerald-700'
              : 'bg-red-900/60 text-red-300 border-red-700'
          }`}>
            {purification.roUf ? 'ON' : 'OFF'}
          </span>
        </div>

      </div>

      {!isAllActive && (
        <div className="mt-3 text-xs text-red-300 bg-red-950/40 border border-red-900/40 p-2.5 rounded-lg flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-red-400 shrink-0" />
          <span>Purification systems disabled/inactive. Water output automatically locked to prevent contamination delivery.</span>
        </div>
      )}

    </div>
  );
};
