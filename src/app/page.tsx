'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { AlarmCard } from '@/components/AlarmCard';
import { AlarmReasons } from '@/components/AlarmReasons';
import { ParameterGrid } from '@/components/ParameterGrid';
import { PurificationStatus } from '@/components/PurificationStatus';
import { AlertActions } from '@/components/AlertActions';
import { SimulationToolbar } from '@/components/SimulationToolbar';
import { WaterAlarmData } from '@/types/alarm';
import mockData from '@/data/mockAlarm.json';
import { ShieldCheck, LifeBuoy } from 'lucide-react';

export default function Home() {
  const [alarmData, setAlarmData] = useState<WaterAlarmData>(mockData as WaterAlarmData);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white pb-16">
      
      {/* 1. Minimal Header */}
      <Header data={alarmData} />

      {/* Main Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Simulation Interactive Bar */}
        <SimulationToolbar currentData={alarmData} onUpdate={setAlarmData} />

        {/* 2. Main Hero Alarm Card */}
        <AlarmCard data={alarmData} />

        {/* 3. Alarm Reasons / Triggers */}
        <AlarmReasons data={alarmData} />

        {/* 4. Core Water Quality Parameters */}
        <ParameterGrid parameters={alarmData.parameters} />

        {/* 5. Purification Status */}
        <PurificationStatus purification={alarmData.purification} />

        {/* 6 & 7. Alert Actions & Timestamp */}
        <AlertActions actions={alarmData.actions} data={alarmData} />

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-300">JalRakshak — Smart Water Box Safety System</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>RAMNAGAR KIOSK UNIT #402</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <LifeBuoy className="w-3.5 h-3.5" /> Prototype Demonstration
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
