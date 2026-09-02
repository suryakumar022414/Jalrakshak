'use client';
import React from 'react';
import { AlertTriangle, CheckCircle2, FlaskConical, Thermometer, Waves, Gauge } from 'lucide-react';
import { PARAMETER_LIMITS } from '@/types/alarm';

interface ParameterCardProps {
  paramKey: 'ph' | 'tds' | 'turbidity' | 'temperature';
  value: number;
}

export const ParameterCard: React.FC<ParameterCardProps> = ({ paramKey, value }) => {
  const config = PARAMETER_LIMITS[paramKey];

  let isConcerning = false;
  let statusText = 'Normal';
  let percentage = 50;

  if (paramKey === 'ph') {
    isConcerning = value < (config.min || 6.5) || value > (config.max || 8.5);
    statusText = isConcerning ? (value < 6.5 ? 'Acidic / Out of Safe Range' : 'Alkaline / High') : 'Optimal (6.5-8.5)';
    // Gauge percentage for pH 0 to 14
    percentage = Math.min(Math.max((value / 14) * 100, 5), 95);
  } else if (paramKey === 'tds') {
    isConcerning = value > (config.max || 500);
    statusText = isConcerning ? 'Elevated Solids' : 'Normal TDS (<500)';
    percentage = Math.min((value / 1000) * 100, 100);
  } else if (paramKey === 'turbidity') {
    isConcerning = value > (config.max || 5);
    statusText = isConcerning ? 'High Contamination Risk' : 'Clear Water (<5)';
    percentage = Math.min((value / 100) * 100, 100);
  } else if (paramKey === 'temperature') {
    isConcerning = value > (config.max || 28);
    statusText = isConcerning ? 'Warm Water Temp' : 'Optimal Temp (<28°C)';
    percentage = Math.min((value / 50) * 100, 100);
  }

  // Icons mapping
  const renderIcon = () => {
    switch (paramKey) {
      case 'ph':
        return <FlaskConical className="w-5 h-5" />;
      case 'tds':
        return <Gauge className="w-5 h-5" />;
      case 'turbidity':
        return <Waves className="w-5 h-5" />;
      case 'temperature':
        return <Thermometer className="w-5 h-5" />;
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-xl border p-5 transition-all duration-300 ${
      isConcerning
        ? 'bg-slate-900/90 border-red-500/70 shadow-lg shadow-red-950/40 text-white ring-1 ring-red-500/30'
        : 'bg-slate-900/80 border-slate-800 shadow-sm text-slate-100'
    }`}>
      
      {/* Header Info */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${
            isConcerning ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
          }`}>
            {renderIcon()}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-200">{config.label}</h4>
            <span className="text-xs text-slate-400">Safe: {config.safeRange}</span>
          </div>
        </div>

        {/* Normal vs Concerning Badge */}
        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${
          isConcerning
            ? 'bg-red-950 text-red-400 border-red-800/80 animate-pulse'
            : 'bg-emerald-950 text-emerald-400 border-emerald-800/80'
        }`}>
          {isConcerning ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>CONCERNING</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>NORMAL</span>
            </>
          )}
        </span>
      </div>

      {/* Large Value Display */}
      <div className="my-2 flex items-baseline gap-2">
        <span className={`text-4xl font-black tracking-tight ${
          isConcerning ? 'text-red-400' : 'text-emerald-400'
        }`}>
          {value}
        </span>
        {config.unit && (
          <span className="text-lg font-bold text-slate-400">{config.unit}</span>
        )}
      </div>

      {/* Status subtext */}
      <p className="text-xs font-medium text-slate-400 mb-3">
        Status: <span className={isConcerning ? 'text-red-300 font-semibold' : 'text-emerald-300 font-semibold'}>{statusText}</span>
      </p>

      {/* Meter Bar */}
      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isConcerning ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-emerald-400 to-emerald-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

    </div>
  );
};
