'use client';
import React from 'react';
import { ParameterCard } from './ParameterCard';
import { WaterParameters } from '@/types/alarm';
import { Sliders } from 'lucide-react';

interface ParameterGridProps {
  parameters: WaterParameters;
}

export const ParameterGrid: React.FC<ParameterGridProps> = ({ parameters }) => {
  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2 text-slate-200">
        <Sliders className="w-5 h-5 text-emerald-400" />
        <h3 className="text-lg font-bold tracking-tight">Real-Time Water Parameters</h3>
      </div>

      {/* Grid of 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ParameterCard paramKey="ph" value={parameters.ph} />
        <ParameterCard paramKey="tds" value={parameters.tds} />
        <ParameterCard paramKey="turbidity" value={parameters.turbidity} />
        <ParameterCard paramKey="temperature" value={parameters.temperature} />
      </div>
    </div>
  );
};
