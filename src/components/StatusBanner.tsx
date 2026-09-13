'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  ShieldAlert,
  Bell,
  Settings,
  User,
  Volume2,
  AlertTriangle,
  Users,
  ChevronDown,
  ChevronUp,
  Info,
  Check
} from 'lucide-react';
import { WaterAlarmData } from '@/types/alarm';
import { speakMultilingualMaleAlert } from '@/utils/audioAlert';
import { MagicRings } from '@/components/MagicRings';

interface StatusBannerProps {
  data: WaterAlarmData;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({ data }) => {
  const isUnsafe = data.status === 'UNSAFE';
  const [showHighRiskList, setShowHighRiskList] = useState<boolean>(true);

  const handleAudioClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    speakMultilingualMaleAlert(data.status);
  };

  const highRiskGroupsBilingual = [
    { en: "Infants and young children", hi: "छोटे बच्चे और शिशु" },
    { en: "Pregnant people", hi: "गर्भवती महिलाएँ" },
    { en: "Older adults", hi: "बुजुर्ग व्यक्ति" },
    { en: "Immunocompromised people", hi: "कमजोर प्रतिरक्षा वाले लोग" },
    { en: "People on chemotherapy / immune-suppressing drugs", hi: "कीमोथेरेपी या इम्यूनो-सप्रेसिव दवाएं लेने वाले" },
    { en: "People with serious chronic illness", hi: "गंभीर पुरानी बीमारी वाले व्यक्ति" },
    { en: "People preparing infant formula", hi: "शिशु आहार तैयार करने वाले" },
    { en: "People with kidney disease / restricted diets", hi: "गुर्दे की बीमारी या विशेष आहार वाले" }
  ];

  return (
    <div className="w-full space-y-4">
      
      {/* Top Header Controls Bar */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-slate-300 text-sm font-semibold">
          <span className="text-slate-400">JalRakshak / जल रक्षक</span>
          <span>/</span>
          <span className="text-white font-bold">{data.location}</span>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors">
            <User className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Status Banner Container featuring WebGL MagicRings */}
      <div className="relative w-full rounded-2xl overflow-hidden p-[2px]">
        {/* MagicRings canvas overlay */}
        <MagicRings
          key={isUnsafe ? 'unsafe-rings' : 'safe-rings'}
          color={isUnsafe ? '#ef4444' : '#10b981'}
          colorTwo={isUnsafe ? '#dc2626' : '#06b6d4'}
          ringCount={6}
          speed={isUnsafe ? 1.8 : 0.8}
          lineThickness={2.5}
          baseRadius={0.25}
          radiusStep={0.12}
          opacity={0.85}
          noiseAmount={isUnsafe ? 0.25 : 0.08}
        />

        <div
          className={`relative z-10 w-full py-4 px-6 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-lg sm:text-xl font-black tracking-wide shadow-xl transition-all duration-500 backdrop-blur-md ${
            isUnsafe
              ? 'bg-gradient-to-r from-red-950/90 via-red-900/90 to-red-950/90 text-white border border-red-500/80 shadow-red-950/70 ring-2 ring-red-500/50'
              : 'bg-gradient-to-r from-emerald-950/90 via-slate-900/90 to-emerald-950/90 text-white border border-emerald-500/60 shadow-emerald-950/50 ring-1 ring-emerald-500/40'
          }`}
        >
          <div className="flex items-center gap-3">
            {isUnsafe ? (
              <ShieldAlert className="w-8 h-8 text-red-400 animate-bounce shrink-0" />
            ) : (
              <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
            )}
            <div>
              <div className="text-xs font-extrabold uppercase tracking-widest text-slate-300">
                Official Telemetry Status / आधिकारिक जल सुरक्षा स्थिति
              </div>
              <div className="text-lg sm:text-xl font-black tracking-tight">
                {isUnsafe ? (
                  <>
                    <span>WATER STATUS: UNSAFE (DO NOT DRINK)</span>
                    <span className="block text-sm font-semibold text-red-300">
                      जल स्थिति: असुरक्षित — पानी न पिएं (DO NOT DRINK THIS WATER)
                    </span>
                  </>
                ) : (
                  <>
                    <span>WATER STATUS: SAFE — YOU CAN DRINK THIS WATER</span>
                    <span className="block text-sm font-semibold text-emerald-300">
                      जल स्थिति: सुरक्षित — आप यह पानी पी सकते हैं (YOU CAN DRINK THIS WATER)
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHighRiskList(!showHighRiskList)}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-all"
            >
              <Users className="w-4 h-4 text-amber-400" />
              <span>Safety & Advisory Details / सुरक्षा विवरण</span>
              {showHighRiskList ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Multilingual English + Hindi Voice Alert Button */}
            <button
              onClick={handleAudioClick}
              title="Play English & Hindi Voice Announcement"
              className="p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-950/90 border border-white/30 text-white transition-all transform hover:scale-105 flex items-center gap-1.5 text-xs font-bold shrink-0 shadow-lg"
            >
              <Volume2 className="w-5 h-5 text-amber-300 animate-pulse" />
              <span className="hidden sm:inline text-amber-200">🔊 Voice Alert (English + हिंदी)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Bilingual Caution Alert Box & High-Risk People List */}
      {showHighRiskList && (
        <div
          className={`p-5 rounded-xl border transition-all duration-300 shadow-lg ${
            isUnsafe
              ? 'bg-red-950/40 border-red-800/80 text-red-100'
              : 'bg-emerald-950/30 border-emerald-800/60 text-emerald-100'
          }`}
        >
          <div className="flex items-start gap-3">
            {isUnsafe ? (
              <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 mt-0.5 animate-pulse" />
            ) : (
              <Check className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-3 w-full">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-white/10 pb-2">
                <div>
                  <h4 className="text-base font-extrabold tracking-wide flex items-center gap-2">
                    <span>STATUS ADVISORY / सुरक्षा एवं सावधानी सलाह:</span>
                  </h4>
                  <span className={`text-sm font-bold block ${isUnsafe ? 'text-red-300' : 'text-emerald-300'}`}>
                    {isUnsafe
                      ? 'DO NOT DRINK — WATER UNFIT FOR CONSUMPTION / यह पानी पीने के योग्य नहीं है'
                      : 'SAFE TO DRINK — You can drink this water! / आप यह पानी बेझिझक पी सकते हैं!'}
                  </span>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-slate-900/80 border border-white/10 ${
                  isUnsafe ? 'text-red-300' : 'text-emerald-300'
                }`}>
                  {isUnsafe ? 'Unsafe Alert / खतरा चेतावनी' : 'Safe Advisory / सुरक्षा सलाह'}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm leading-relaxed text-slate-200 font-medium">
                {isUnsafe ? (
                  <>
                    <strong>⚠️ CAUTION:</strong> High contamination detected. The following people MUST NOT drink this water untreated:
                    <br />
                    <strong>सावधान:</strong> उच्च संदूषण जोखिम पाई गई है। निम्नलिखित लोग यह पानी बिना उबाले या फिल्टर किए बिल्कुल न पिएं:
                  </>
                ) : (
                  <>
                    <strong>✅ SAFE WATER NOTICE:</strong> All general community members, healthy adults, and residents can safely drink this water!
                    <br />
                    <strong>सुरक्षित जल सूचना:</strong> सभी नागरिक, गाँव के लोग और स्वस्थ व्यक्ति यह पानी सुरक्षित रूप से पी सकते हैं! (संवेदनशील वर्ग अतिरिक्त सुरक्षा हेतु उबला पानी पिएं।)
                  </>
                )}
              </p>

              {/* High Risk People & Safety Grid */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {isUnsafe
                    ? 'People Who MUST NOT Drink This Water / ये लोग यह पानी बिल्कुल न पिएं:'
                    : 'Extra-Caution Vulnerable Groups Notice / संवेदनशील वर्गों हेतु विशेष सूचना:'}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs font-semibold pt-1">
                  {highRiskGroupsBilingual.map((group, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border flex flex-col gap-0.5 ${
                        isUnsafe
                          ? 'bg-red-950/60 border-red-800/80 text-red-100'
                          : 'bg-slate-900/80 border-slate-800 text-amber-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${isUnsafe ? 'bg-red-400' : 'bg-amber-400'}`} />
                        <span className="font-bold text-white">{group.en}</span>
                      </div>
                      <span className="text-[11px] text-amber-300/90 pl-4 font-normal">
                        ({group.hi})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Notice */}
              <div className="flex items-center gap-2 text-xs text-slate-300 pt-1 font-medium">
                <Info className="w-4 h-4 text-sky-400 shrink-0" />
                <span>
                  {isUnsafe
                    ? 'Always use verified treated/boiled water or certified alternate sources during advisories. / जल चेतावनी के दौरान हमेशा उबले हुए या सुरक्षित पानी का ही उपयोग करें।'
                    : 'Water quality is continuously monitored by JalRakshak sensor network. / जल सुरक्षा की लगातार निगरानी सेंसर नेटवर्क द्वारा की जा रही है।'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
