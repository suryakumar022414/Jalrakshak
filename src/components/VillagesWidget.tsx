'use client';

import React from 'react';
import { Send, Users, Smartphone, CheckCircle2, AlertTriangle } from 'lucide-react';

interface VillagesWidgetProps {
  isUnsafe?: boolean;
}

export const VillagesWidget: React.FC<VillagesWidgetProps> = ({ isUnsafe = false }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex-1">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Send className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-slate-100 text-base">Village Leaders SMS Dispatch</h3>
        </div>
        <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
          SMS Broadcast Gateway
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* Recipient Village Heads / Mukhiyas */}
        <div className="flex flex-col justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Selected Village Heads</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-100">60</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-[10px] text-slate-500 font-medium mt-1">Panchayat & Community Leaders</span>
        </div>

        {/* SMS Delivery Network */}
        <div className="flex flex-col justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Broadcast Channel</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-100">Cellular SMS</span>
            <Smartphone className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-[10px] text-slate-500 font-medium mt-1">No Internet Needed</span>
        </div>

        {/* Dispatch Status */}
        <div className={`flex flex-col justify-between p-3.5 rounded-xl border transition-all ${
          isUnsafe
            ? 'bg-red-950/50 border-red-500/70 text-red-200 shadow-md shadow-red-950/40'
            : 'bg-slate-950/60 border-slate-800 text-slate-300'
        }`}>
          <span className="text-xs font-semibold opacity-90">Dispatch Status</span>
          <div className="mt-2 flex items-center justify-between">
            <span className={`text-lg font-extrabold ${isUnsafe ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
              {isUnsafe ? 'SENT (60/60)' : 'STANDBY'}
            </span>
            {isUnsafe ? (
              <AlertTriangle className="w-4 h-4 text-red-400 animate-bounce" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
          </div>
          <span className="text-[10px] opacity-75 font-medium mt-1">
            {isUnsafe ? 'Messages Delivered to Phone' : '60 Contacts Ready'}
          </span>
        </div>
      </div>

      {/* Live Message Dispatch Preview */}
      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 text-xs flex items-start gap-2.5">
        <Send className={`w-4 h-4 shrink-0 mt-0.5 ${isUnsafe ? 'text-red-400 animate-pulse' : 'text-slate-500'}`} />
        <div className="space-y-0.5">
          <div className="font-bold text-slate-300 flex items-center gap-2">
            <span>SMS Message Payload</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">GSM 7-bit</span>
          </div>
          <p className={`font-mono leading-relaxed ${isUnsafe ? 'text-red-300 font-bold' : 'text-slate-400'}`}>
            {isUnsafe
              ? '"EMERGENCY: High Heavy Metal Runoff detected at Kiosk #12. Solenoid Tap LOCKED. - JalRakshak"'
              : '"NOTICE: Water at Kiosk #12 is tested SAFE for drinking. - JalRakshak"'}
          </p>
        </div>
      </div>

    </div>
  );
};
