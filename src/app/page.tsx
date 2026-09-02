'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { StatusBanner } from '@/components/StatusBanner';
import { ParameterGrid } from '@/components/ParameterGrid';
import { TrendChart } from '@/components/TrendChart';
import { VillagesWidget } from '@/components/VillagesWidget';
import { SystemStatusWidget } from '@/components/SystemStatusWidget';
import { SimulationControls } from '@/components/SimulationControls';
import { AlarmReasons } from '@/components/AlarmReasons';
import { PurificationStatus } from '@/components/PurificationStatus';
import { AlertActions } from '@/components/AlertActions';
import { WaterAlarmData, WaterParameters, INITIAL_WATER_DATA } from '@/types/alarm';
import { speakMultilingualMaleAlert, startSirenAudio, stopSirenAudio } from '@/utils/audioAlert';

export default function Home() {
  const [alarmData, setAlarmData] = useState<WaterAlarmData>(INITIAL_WATER_DATA);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'alerts' | 'devices'>('dashboard');
  const [audioMuted, setAudioMuted] = useState(false);

  const prevStatusRef = useRef<'SAFE' | 'UNSAFE'>('SAFE');

  // Dynamic evaluation whenever parameters change
  const handleUpdateParameters = (newParams: WaterParameters) => {
    const triggers: string[] = [];

    if (newParams.ph < 6.5 || newParams.ph > 8.5) {
      triggers.push(`pH outside safe range (${newParams.ph})`);
    }
    if (newParams.tds > 500) {
      triggers.push(`High TDS level (${newParams.tds} ppm)`);
    }
    if (newParams.turbidity > 15) {
      triggers.push(`High turbidity (${newParams.turbidity} NTU)`);
    }
    if (newParams.temperature > 28) {
      triggers.push(`High water temperature (${newParams.temperature} °C)`);
    }

    const isUnsafe = triggers.length > 0;
    const newStatus: 'SAFE' | 'UNSAFE' = isUnsafe ? 'UNSAFE' : 'SAFE';

    // Handle voice announcement on status change (Male P.A. Voice - Jharkhand Rural Public Address)
    if (prevStatusRef.current !== newStatus && !audioMuted) {
      speakMultilingualMaleAlert(newStatus);
      if (newStatus === 'UNSAFE') {
        startSirenAudio();
      } else {
        stopSirenAudio();
      }
      prevStatusRef.current = newStatus;
    } else if (newStatus === 'SAFE') {
      stopSirenAudio();
    }

    setAlarmData(prev => ({
      ...prev,
      status: newStatus,
      alarmLevel: isUnsafe ? 'HIGH' : 'NORMAL',
      microbialRisk: isUnsafe ? 'HIGH' : 'LOW',
      timestamp: new Date().toISOString(),
      parameters: newParams,
      purification: {
        uv: !isUnsafe,
        roUf: !isUnsafe
      },
      trigger: isUnsafe
        ? [...triggers, "Purification system inactive", "High microbial contamination risk"]
        : [],
      actions: {
        siren: isUnsafe,
        sms: isUnsafe,
        smsRecipients: isUnsafe ? 12 : 0
      }
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isUnsafe={alarmData.status === 'UNSAFE'}
        audioMuted={audioMuted}
        onToggleAudio={() => setAudioMuted(!audioMuted)}
      />

      {/* 2. Main Dashboard Area */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full overflow-hidden">
        
        {/* Top Header & Status Banner matching user image */}
        <StatusBanner data={alarmData} />

        {/* Dynamic Telemetry Simulator Controls */}
        <SimulationControls
          data={alarmData}
          onUpdateParameters={handleUpdateParameters}
          audioMuted={audioMuted}
        />

        {/* Tab 1: Main Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Top Metric Cards Row (pH, TDS, Turbidity, Temp) */}
            <ParameterGrid parameters={alarmData.parameters} />

            {/* 24-Hour TDS & pH Trend Chart */}
            <TrendChart
              history={alarmData.trendHistory}
              currentTds={alarmData.parameters.tds}
              currentPh={alarmData.parameters.ph}
            />

            {/* Bottom Widgets Row (Village SMS Dispatch & System Status) */}
            <div className="flex flex-col md:flex-row gap-6">
              <VillagesWidget isUnsafe={alarmData.status === 'UNSAFE'} />
              <SystemStatusWidget stats={alarmData.systemStatusStats} />
            </div>

          </div>
        )}

        {/* Tab 2: Detailed Alerts & Alarm Triggers */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <AlarmReasons data={alarmData} />
            <PurificationStatus purification={alarmData.purification} />
            <AlertActions actions={alarmData.actions} data={alarmData} />
          </div>
        )}

        {/* Tab 3: Device & Sensor Telemetry Status */}
        {activeTab === 'devices' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-white mb-4">IoT Sensor & Kiosk Network Telemetry</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-xs text-slate-400 font-semibold">Optical Turbidity Sensor</span>
                  <div className="text-lg font-bold text-slate-100 mt-1">TS-300B Optical Sensor</div>
                  <span className="text-xs text-emerald-400 font-bold block mt-2">● Signal Strength: 98% (Online)</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-xs text-slate-400 font-semibold">TDS Probe Array</span>
                  <div className="text-lg font-bold text-slate-100 mt-1">Analog TDS Sensor V1.0</div>
                  <span className="text-xs text-emerald-400 font-bold block mt-2">● Calibrated (Online)</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-xs text-slate-400 font-semibold">pH Electrode Probe</span>
                  <div className="text-lg font-bold text-slate-100 mt-1">Industrial Glass Electrode</div>
                  <span className="text-xs text-emerald-400 font-bold block mt-2">● Sampling: Every 1 sec</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
