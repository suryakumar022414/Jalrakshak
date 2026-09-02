'use client';

import React from 'react';
import { FlaskConical, Gauge, Waves, Thermometer, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PARAMETER_LIMITS } from '@/types/alarm';

interface ParameterCardProps {
  paramKey: 'ph' | 'tds' | 'turbidity' | 'temperature';
  value: number;
}

export const ParameterCard: React.FC<ParameterCardProps> = ({ paramKey, value }) => {
  const config = PARAMETER_LIMITS[paramKey];

  let isConcerning = false;

  if (paramKey === 'ph') {
    isConcerning = value < (config.min || 6.5) || value > (config.max || 8.5);
  } else if (paramKey === 'tds') {
    isConcerning = value > (config.max || 500);
  } else if (paramKey === 'turbidity') {
    isConcerning = value > (config.max || 15);
  } else if (paramKey === 'temperature') {
    isConcerning = value > (config.max || 28);
  }

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
    <div className={`rounded-2xl border p-5 transition-all duration-300 ${
      isConcerning
        ? 'bg-red-950/40 border-red-500/70 shadow-lg shadow-red-950/50 text-white ring-2 ring-red-500/30 animate-pulse'
        : 'bg-slate-900/80 border-slate-800 shadow-md text-slate-100 hover:border-slate-700'
    }`}>
      
      {/* Title & Icon */}
      <div className="flex items-center gap-2 mb-3 text-slate-300">
        <div className={`p-2 rounded-xl ${isConcerning ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
          {renderIcon()}
        </div>
        <span className="font-semibold text-sm">{config.label}</span>
      </div>

      {/* Large Value Display */}
      <div className="my-2 flex items-baseline gap-2">
        <span className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${
          isConcerning ? 'text-red-400' : 'text-slate-100'
        }`}>
          {value}
        </span>
        {config.unit && (
          <span className="text-base font-bold text-slate-400">{config.unit}</span>
        )}
      </div>

      {/* Status Dot (Exact layout match with user's screenshot: • Safe / • Unsafe) */}
      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-800/80 text-xs font-bold">
        <span className={`w-2 h-2 rounded-full ${isConcerning ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`} />
        <span className={isConcerning ? 'text-red-400' : 'text-emerald-400'}>
          {isConcerning ? '• Unsafe (Threshold Exceeded)' : '• Safe'}
        </span>
      </div>

    </div>
  );
};
