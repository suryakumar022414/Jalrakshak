'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Info,
  Users,
  Activity,
  Droplets,
  FlaskConical,
  Wind,
  CheckCircle2,
  XCircle,
  FileSpreadsheet
} from 'lucide-react';
import { WaterParameters, PurificationStatus } from '@/types/alarm';

interface WaterSafetyAdvisoryProps {
  parameters: WaterParameters;
  purification: PurificationStatus;
}

export const WaterSafetyAdvisory: React.FC<WaterSafetyAdvisoryProps> = ({
  parameters,
  purification
}) => {
  // Simulated laboratory result & pump/flow failure toggles for screening
  const [ecoliPositive, setEcoliPositive] = useState<boolean>(false);
  const [pumpFlowFailure, setPumpFlowFailure] = useState<boolean>(false);

  // 1. Evaluate Parameters against rules
  const phOutOfRange = parameters.ph < 6.5 || parameters.ph > 8.5;
  const tdsHigh = parameters.tds > 500;
  const turbidityHigh = parameters.turbidity > 5;
  const treatmentFailed = !purification.uv || !purification.roUf || pumpFlowFailure;

  // Determine Overall Status
  // RED: DO NOT DRINK — USE VERIFIED ALTERNATE WATER
  // GREEN: WITHIN SCREENING RANGE
  // YELLOW: CAUTION — TREATMENT OR RETESTING REQUIRED
  let status: 'GREEN' | 'YELLOW' | 'RED' = 'GREEN';

  if (ecoliPositive || treatmentFailed || parameters.turbidity > 15) {
    status = 'RED';
  } else if (phOutOfRange || tdsHigh || turbidityHigh) {
    status = 'YELLOW';
  } else {
    status = 'GREEN';
  }

  const hasMicrobialRisk = turbidityHigh || treatmentFailed || ecoliPositive;

  const extraCautionGroups = [
    { en: "Infants and young children", hi: "छोटे बच्चे और शिशु" },
    { en: "Pregnant people", hi: "गर्भवती महिलाएँ" },
    { en: "Older adults", hi: "बुजुर्ग व्यक्ति" },
    { en: "Immunocompromised people", hi: "कमजोर प्रतिरक्षा वाले लोग" },
    { en: "People undergoing chemotherapy or taking immune-suppressing medicines", hi: "कीमोथेरेपी या इम्यूनो-सप्रेसिव दवाएं लेने वाले" },
    { en: "People with serious chronic illness", hi: "गंभीर पुरानी बीमारी वाले व्यक्ति" },
    { en: "People preparing infant formula", hi: "शिशु आहार तैयार करने वाले" },
    { en: "People with kidney disease or medically restricted diets when chemical contamination is suspected", hi: "गुर्दे की बीमारी या विशेष प्रतिबंधित आहार वाले लोग" }
  ];

  return (
    <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-sky-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Water Safety & Health Advisory / जल सुरक्षा एवं स्वास्थ्य चेतावनी
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time health screening evaluation based on BIS drinking water guidelines & multi-sensor analysis. / बीआईएस मानक के अनुसार जल सुरक्षा मूल्यांकन।
          </p>
        </div>

        {/* Interactive Lab & Hardware Simulation Controls */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-950/80 p-2 rounded-xl border border-slate-800/80 text-xs">
          <span className="text-slate-400 font-medium px-1">Simulate Test:</span>
          <button
            onClick={() => setEcoliPositive(!ecoliPositive)}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              ecoliPositive
                ? 'bg-red-950 border border-red-700 text-red-300 shadow-sm'
                : 'bg-slate-900 border border-slate-700 text-slate-300 hover:border-slate-500'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            E. coli Lab: {ecoliPositive ? 'POSITIVE ⚠️ (दूषित)' : 'Negative (सामान्य)'}
          </button>
          <button
            onClick={() => setPumpFlowFailure(!pumpFlowFailure)}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              pumpFlowFailure
                ? 'bg-red-950 border border-red-700 text-red-300 shadow-sm'
                : 'bg-slate-900 border border-slate-700 text-slate-300 hover:border-slate-500'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Pump/Flow: {pumpFlowFailure ? 'FAILURE ❌ (खराबी)' : 'Normal (सामान्य)'}
          </button>
        </div>
      </div>

      {/* Main Status Indicator Banner (Bilingual English + Hindi) */}
      <div>
        {status === 'GREEN' && (
          <div className="bg-emerald-950/40 border-2 border-emerald-500/60 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-emerald-200 shadow-lg shadow-emerald-950/30">
            <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400 border border-emerald-500/40 shrink-0">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Screening Status / जांच स्थिति</div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-wide">
                GREEN: WITHIN SCREENING RANGE / हरा: मानक सीमा के भीतर
              </h3>
              <p className="text-sm text-emerald-300/90 mt-1">
                All monitored parameters (pH, TDS, Turbidity, Treatment Status) are currently within acceptable reference screening ranges. / सभी मापदंड वर्तमान में सुरक्षित सीमा के भीतर हैं।
              </p>
            </div>
          </div>
        )}

        {status === 'YELLOW' && (
          <div className="bg-amber-950/40 border-2 border-amber-500/60 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-amber-200 shadow-lg shadow-amber-950/30">
            <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400 border border-amber-500/40 shrink-0">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Screening Status / जांच स्थिति</div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-wide">
                YELLOW: CAUTION — TREATMENT OR RETESTING REQUIRED / पीला: सावधानी — जल उपचार या पुनः परीक्षण आवश्यक
              </h3>
              <p className="text-sm text-amber-300/90 mt-1">
                One or more parameters exceed normal screening standards. Secondary treatment or laboratory retesting is advised. / एक या अधिक मापदंड सामान्य सीमा से अधिक हैं। पानी का उपचार या लैब पुनः जांच आवश्यक है।
              </p>
            </div>
          </div>
        )}

        {status === 'RED' && (
          <div className="bg-red-950/50 border-2 border-red-500/80 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-red-200 shadow-lg shadow-red-950/40 animate-pulse">
            <div className="p-3 bg-red-500/20 rounded-xl text-red-400 border border-red-500/40 shrink-0">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-red-400 uppercase tracking-wider">Critical Advisory / गंभीर चेतावनी</div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-wide">
                RED: DO NOT DRINK — USE VERIFIED ALTERNATE WATER / लाल: पानी न पिएं — केवल प्रमाणित वैकल्पिक जल का उपयोग करें
              </h3>
              <p className="text-sm text-red-200 mt-1 font-medium">
                Active microbial contamination confirmed or severe treatment failure detected. Do not consume raw water. / जीवाणु संदूषण या फ़िल्टर विफलता पाई गई है। कच्चा पानी न पिएं।
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Grid Layout for Advisory Breakdown & Health Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left Column: Parameter Screening Evaluation & Specific Alerts */}
        <div className="space-y-4">
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 sm:p-5">
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-3">
              <FileSpreadsheet className="w-4 h-4 text-sky-400" />
              Parameter Screening & Diagnostic Triggers / मापदंड जांच निष्कर्ष
            </h4>
            
            <div className="space-y-2.5">
              {/* pH Rule check */}
              <div className={`p-3 rounded-lg border text-xs sm:text-sm flex flex-col gap-1 ${
                phOutOfRange
                  ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold">
                    {phOutOfRange ? <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    <span>pH Level ({parameters.ph}):</span>
                  </div>
                  <span className="font-medium">
                    {phOutOfRange ? "pH outside screening range" : "within BIS screening range"}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 pl-6">
                  {phOutOfRange ? "(pH मानक सीमा 6.5–8.5 से बाहर है)" : "(pH मानक 6.5–8.5 सीमा के भीतर है)"}
                </div>
              </div>

              {/* TDS Rule check */}
              <div className={`p-3 rounded-lg border text-xs sm:text-sm flex flex-col gap-1 ${
                tdsHigh
                  ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold">
                    {tdsHigh ? <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    <span>TDS ({parameters.tds} mg/L):</span>
                  </div>
                  <span className="font-medium">
                    {tdsHigh ? "high dissolved solids; further chemical testing required" : "acceptable screening reference"}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 pl-6">
                  {tdsHigh ? "(उच्च घुलनशील ठोस पदार्थ; रासायनिक परीक्षण आवश्यक)" : "(स्वीकार्य टीडीएस स्तर)"}
                </div>
              </div>

              {/* Turbidity Rule check */}
              <div className={`p-3 rounded-lg border text-xs sm:text-sm flex flex-col gap-1 ${
                turbidityHigh
                  ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold">
                    {turbidityHigh ? <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    <span>Turbidity ({parameters.turbidity} NTU):</span>
                  </div>
                  <span className="font-medium">
                    {turbidityHigh
                      ? "high turbidity; possible microbial risk; treatment and E. coli testing required"
                      : "acceptable (<= 5 NTU)"}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 pl-6">
                  {turbidityHigh ? "(उच्च गंदलापन; सूक्ष्मजैविक जोखिम संभव, ई. कोलाई जांच आवश्यक)" : "(सामान्य गंदलापन स्तर)"}
                </div>
              </div>

              {/* Treatment status check */}
              <div className={`p-3 rounded-lg border text-xs sm:text-sm flex flex-col gap-1 ${
                treatmentFailed
                  ? 'bg-red-950/40 border-red-800/80 text-red-200'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold">
                    {treatmentFailed ? <XCircle className="w-4 h-4 text-red-400 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    <span>UV/UF Treatment:</span>
                  </div>
                  <span className="font-medium">
                    {treatmentFailed ? "treatment failure; do not drink until verified" : "purification systems operational"}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 pl-6">
                  {treatmentFailed ? "(उपचार विफलता; पुष्टि होने तक पानी न पिएं)" : "(उपचार प्रणाली सामान्य रूप से कार्यरत)"}
                </div>
              </div>

              {/* E. coli lab status */}
              <div className={`p-3 rounded-lg border text-xs sm:text-sm flex flex-col gap-1 ${
                ecoliPositive
                  ? 'bg-red-950/50 border-red-800 text-red-200'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold">
                    {ecoliPositive ? <FlaskConical className="w-4 h-4 text-red-400 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    <span>Lab E. coli Result:</span>
                  </div>
                  <span className="font-medium">
                    {ecoliPositive ? "microbial contamination confirmed; do not drink untreated water" : "Negative / Normal"}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 pl-6">
                  {ecoliPositive ? "(जीवाणु संदूषण की पुष्टि; अदूषित या बिना उबला पानी न पिएं)" : "(कोई जीवाणु संदूषण नहीं पाया गया)"}
                </div>
              </div>
            </div>
          </div>

          {/* Conditional Guidance Notices */}
          <div className="space-y-3">
            {/* Microbial Risk Guidance Alert */}
            {hasMicrobialRisk && (
              <div className="bg-red-950/40 border border-red-900/80 rounded-xl p-4 flex items-start gap-3 text-red-200">
                <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-red-400 uppercase tracking-wide">
                    Microbial Risk Alert / जीवाणु संदूषण चेतावनी
                  </h5>
                  <p className="text-xs sm:text-sm font-semibold mt-0.5">
                    Do not drink untreated water. Use a verified alternate source and arrange E. coli/coliform testing.
                  </p>
                  <p className="text-xs text-red-300 mt-1">
                    अशोधित पानी न पिएं। प्रमाणित वैकल्पिक स्रोत का उपयोग करें और ई. कोलाई परीक्षण करवाएं।
                  </p>
                </div>
              </div>
            )}

            {/* Respiratory Condition Notice */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex items-start gap-3 text-slate-300">
              <Wind className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-sky-400 uppercase tracking-wide">
                  Respiratory Illness Note / श्वसन रोग संबंधी जानकारी
                </h5>
                <p className="text-xs sm:text-sm text-slate-200 mt-1">
                  Respiratory illness is not assessed by pH/TDS readings. Follow medical advice and use verified treated water during any water advisory.
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  श्वसन संबंधी बीमारियों का मूल्यांकन pH या TDS रीडिंग द्वारा नहीं किया जाता है। चिकित्सीय सलाह का पालन करें और जल चेतावनी के दौरान प्रमाणित उपचारित पानी का उपयोग करें।
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Extra-Caution Groups Card */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-amber-400" />
              <h4 className="text-base font-bold text-white tracking-tight">
                Extra-Caution Groups / विशेष सावधानी वाले वर्ग
              </h4>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Individuals in the following categories must exercise extra vigilance and avoid raw water during advisories: / निम्नलिखित वर्गों के व्यक्तियों को विशेष सतर्कता बरतनी चाहिए:
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-slate-200">
              {extraCautionGroups.map((group, idx) => (
                <li
                  key={idx}
                  className={`flex flex-col p-2.5 rounded-lg bg-slate-900 border border-slate-800 ${
                    idx === 4 || idx === 7 ? 'sm:col-span-2' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                    <span className="font-bold text-white">{group.en}</span>
                  </div>
                  <span className="text-[11px] text-amber-300/90 pl-4">
                    ({group.hi})
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-2 text-xs text-amber-400/90 font-medium">
              <Droplets className="w-4 h-4 shrink-0" />
              <span>Always boil or use certified bottled / community dispenser water. / हमेशा उबला या प्रमाणित पानी ही उपयोग करें।</span>
            </div>
          </div>
        </div>

      </div>

      {/* Permanent Mandatory Legal & Clinical Disclaimer */}
      <div className="bg-slate-950 border border-sky-900/40 rounded-xl p-4 flex items-start gap-3 text-slate-400">
        <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block">
            Official Advisory Disclaimer / आधिकारिक अस्वीकरण
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            JalRakshak provides early-warning water-quality screening. It does not diagnose illness, identify all contaminants, or replace laboratory testing, official advisories, or medical advice.
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
            जलरक्षक प्रारंभिक चेतावनी जल-गुणवत्ता जांच प्रदान करता है। यह बीमारी का निदान नहीं करता है, सभी दूषित पदार्थों की पहचान नहीं करता है, या प्रयोगशाला परीक्षण, आधिकारिक सलाह या चिकित्सीय सलाह का स्थान नहीं लेता है।
          </p>
        </div>
      </div>

    </section>
  );
};
