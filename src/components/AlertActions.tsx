'use client';
import React from 'react';
import { Volume2, MessageSquare, BellRing, Clock, CheckCircle2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { AlertActions as AlertActionsType, WaterAlarmData } from '@/types/alarm';

interface AlertActionsProps {
  actions: AlertActionsType;
  data: WaterAlarmData;
}

export const AlertActions: React.FC<AlertActionsProps> = ({ actions, data }) => {
  const isUnsafe = data.status === 'UNSAFE';

  // Formatted alarm timestamp
  const formatAlarmTimestamp = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return {
        date: d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
      };
    } catch {
      return { date: 'September 2, 2026', time: '2:10 PM' };
    }
  };

  const { date, time } = formatAlarmTimestamp(data.timestamp);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      
      {/* Alert Actions Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
          <BellRing className={`w-5 h-5 ${isUnsafe ? 'text-red-500' : 'text-slate-400'}`} />
          <h3 className="text-lg font-bold text-white tracking-tight">Alert Actions Executed</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* Physical Siren Action */}
          <div className={`p-3.5 rounded-lg border flex items-center justify-between ${
            actions.siren
              ? 'bg-red-950/40 border-red-800/80 text-white shadow-md shadow-red-950/40'
              : 'bg-slate-950/60 border-slate-800 text-slate-300'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${actions.siren ? 'bg-red-600/30 text-red-400 animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Physical Siren</h4>
                <p className="text-xs text-slate-400">Kiosk Audio Alert</p>
              </div>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-md border uppercase ${
              actions.siren
                ? 'bg-red-600 text-white border-red-500'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              {actions.siren ? 'Activated' : 'Standby'}
            </span>
          </div>

          {/* SMS Notification Action */}
          <div className={`p-3.5 rounded-lg border flex items-center justify-between ${
            actions.sms
              ? 'bg-red-950/40 border-red-800/80 text-white shadow-md shadow-red-950/40'
              : 'bg-slate-950/60 border-slate-800 text-slate-300'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${actions.sms ? 'bg-red-600/30 text-red-400' : 'bg-slate-800 text-slate-400'}`}>
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Emergency SMS</h4>
                <p className="text-xs text-slate-400">
                  {actions.sms ? `Sent to ${actions.smsRecipients} contacts` : 'Not required'}
                </p>
              </div>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-md border uppercase ${
              actions.sms
                ? 'bg-red-600 text-white border-red-500'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              {actions.sms ? 'Dispatched' : 'Standby'}
            </span>
          </div>

        </div>
      </div>

      {/* Alarm Timestamp & Live Status Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">Alarm Event Timestamp</h3>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase border ${
            isUnsafe
              ? 'bg-red-950 text-red-400 border-red-800 animate-pulse'
              : 'bg-emerald-950 text-emerald-400 border-emerald-800'
          }`}>
            Status: {isUnsafe ? 'Active Alarm' : 'Normal Operations'}
          </span>
        </div>

        <div className="my-3 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
              Alarm Detected Date & Time
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-100">
              {date}
            </div>
            <div className="text-base font-bold text-emerald-400">
              {time}
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${
            isUnsafe
              ? 'bg-red-950/50 border-red-800 text-red-400'
              : 'bg-emerald-950/50 border-emerald-800 text-emerald-400'
          }`}>
            {isUnsafe ? <AlertTriangle className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
          </div>
        </div>

        <p className="text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          * Automated alarm logged in kiosk non-volatile local buffer.
        </p>
      </div>

    </div>
  );
};
