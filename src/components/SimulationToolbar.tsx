'use client';
import React from 'react';
import { AlertTriangle, CheckCircle2, PlayCircle, SlidersHorizontal } from 'lucide-react';
import { WaterAlarmData, SAFE_ALARM_PRESET } from '@/types/alarm';
import defaultMockData from '@/data/mockAlarm.json';

interface SimulationToolbarProps {
  currentData: WaterAlarmData;
  onUpdate: (newData: WaterAlarmData) => void;
}

export const SimulationToolbar: React.FC<SimulationToolbarProps> = ({ currentData, onUpdate }) => {
  const isUnsafe = currentData.status === 'UNSAFE';

  const handleSimulateAlarm = () => {
    onUpdate({
      ...defaultMockData,
      status: 'UNSAFE',
      alarmLevel: 'HIGH',
      microbialRisk: 'HIGH',
      timestamp: new Date().toISOString(),
      parameters: {
        ph: 6.1,
        tds: 720,
        turbidity: 45,
        temperature: 30
      },
      purification: {
        uv: false,
        roUf: false
      },
      trigger: [
        "High turbidity — 45 NTU",
        "High TDS — 720 ppm",
        "pH outside safe range — 6.1",
        "Purification system inactive",
        "High microbial contamination risk"
      ],
      actions: {
        siren: true,
        sms: true,
        smsRecipients: 12
      }
    } as WaterAlarmData);
  };

  const handleSimulateNormal = () => {
    onUpdate({
      ...SAFE_ALARM_PRESET,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Title */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <span>Presentation Simulation Mode</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                Frontend Only
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Toggle water conditions live to demonstrate Smart Water Box alarm responses.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          
          {/* Simulate Alarm Button */}
          <button
            onClick={handleSimulateAlarm}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-black uppercase tracking-wider transition-all duration-300 ${
              isUnsafe
                ? 'bg-red-600 text-white ring-2 ring-red-400 shadow-lg shadow-red-950/60 scale-[1.02]'
                : 'bg-slate-800 text-red-400 border border-red-900/60 hover:bg-red-950/40'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Simulate Alarm (Unsafe)</span>
          </button>

          {/* Simulate Normal Button */}
          <button
            onClick={handleSimulateNormal}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-black uppercase tracking-wider transition-all duration-300 ${
              !isUnsafe
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 shadow-lg shadow-emerald-950/60 scale-[1.02]'
                : 'bg-slate-800 text-emerald-400 border border-emerald-900/60 hover:bg-emerald-950/40'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Simulate Normal Water</span>
          </button>

        </div>

      </div>
    </div>
  );
};
