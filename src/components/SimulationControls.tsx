'use client';

import React, { useEffect, useState } from 'react';
import { Sliders, RefreshCw, Play, Pause, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { WaterAlarmData, WaterParameters } from '@/types/alarm';
import { speakStatusAnnouncement, startSirenAudio, stopSirenAudio } from '@/utils/audioAlert';

interface SimulationControlsProps {
  data: WaterAlarmData;
  onUpdateParameters: (newParams: WaterParameters) => void;
  audioMuted: boolean;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  data,
  onUpdateParameters,
  audioMuted
}) => {
  const [autoStream, setAutoStream] = useState(false);

  // Auto-stream interval to simulate continuous random telemetry variations
  useEffect(() => {
    if (!autoStream) return;

    const interval = setInterval(() => {
      onUpdateParameters({
        ph: Number((data.parameters.ph + (Math.random() * 0.4 - 0.2)).toFixed(1)),
        tds: Math.max(100, Math.round(data.parameters.tds + (Math.random() * 60 - 30))),
        turbidity: Math.max(1, Math.round(data.parameters.turbidity + (Math.random() * 6 - 3))),
        temperature: Math.round(data.parameters.temperature + (Math.random() * 2 - 1))
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [autoStream, data.parameters, onUpdateParameters]);

  // Quick preset triggers
  const triggerUnsafePreset = () => {
    onUpdateParameters({
      ph: 6.1,
      tds: 720,
      turbidity: 45,
      temperature: 30
    });
  };

  const triggerSafePreset = () => {
    onUpdateParameters({
      ph: 6.8,
      tds: 420,
      turbidity: 12,
      temperature: 28
    });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      
      {/* Title & Stream Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-slate-100 text-base">Real-Time Telemetry Simulator</h3>
        </div>

        <div className="flex items-center gap-3">
          {/* Preset Buttons */}
          <button
            onClick={triggerUnsafePreset}
            className="px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-800 text-red-300 text-xs font-bold hover:bg-red-900 transition-all flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Simulate Unsafe Water</span>
          </button>

          <button
            onClick={triggerSafePreset}
            className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-bold hover:bg-emerald-900 transition-all flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Simulate Safe Water</span>
          </button>

          {/* Auto Stream Toggle */}
          <button
            onClick={() => setAutoStream(!autoStream)}
            className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-2 border transition-all ${
              autoStream
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/50'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {autoStream ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{autoStream ? 'Auto Telemetry: ON' : 'Auto Telemetry: OFF'}</span>
          </button>
        </div>
      </div>

      {/* Parameter Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
        
        {/* pH Slider */}
        <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span>pH Level</span>
            <span className={data.parameters.ph < 6.5 || data.parameters.ph > 8.5 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
              {data.parameters.ph}
            </span>
          </div>
          <input
            type="range"
            min="4.0"
            max="10.0"
            step="0.1"
            value={data.parameters.ph}
            onChange={(e) => onUpdateParameters({ ...data.parameters, ph: parseFloat(e.target.value) })}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* TDS Slider */}
        <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span>TDS (ppm)</span>
            <span className={data.parameters.tds > 500 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
              {data.parameters.tds} ppm
            </span>
          </div>
          <input
            type="range"
            min="100"
            max="1000"
            step="10"
            value={data.parameters.tds}
            onChange={(e) => onUpdateParameters({ ...data.parameters, tds: parseInt(e.target.value) })}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* Turbidity Slider */}
        <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span>Turbidity (NTU)</span>
            <span className={data.parameters.turbidity > 15 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
              {data.parameters.turbidity} NTU
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="60"
            step="1"
            value={data.parameters.turbidity}
            onChange={(e) => onUpdateParameters({ ...data.parameters, turbidity: parseInt(e.target.value) })}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* Temperature Slider */}
        <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span>Temperature (°C)</span>
            <span className={data.parameters.temperature > 28 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
              {data.parameters.temperature} °C
            </span>
          </div>
          <input
            type="range"
            min="15"
            max="45"
            step="1"
            value={data.parameters.temperature}
            onChange={(e) => onUpdateParameters({ ...data.parameters, temperature: parseInt(e.target.value) })}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

      </div>

    </div>
  );
};
