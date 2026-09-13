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
  HelpCircle,
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

  // Active Advisory Notes & Messages based on rules
  const advisoryNotes: string[] = [];

  // Rule: pH 6.5–8.5: within BIS screening range / below 6.5 or above 8.5: show "pH outside screening range"
  if (phOutOfRange) {
    advisoryNotes.push(`pH outside screening range (${parameters.ph})`);
  } else {
    advisoryNotes.push(`pH ${parameters.ph}: within BIS screening range`);
  }

  // Rule: TDS up to 500 mg/L: acceptable screening reference / above 500 mg/L: show "high dissolved solids; further chemical testing required"
  if (tdsHigh) {
    advisoryNotes.push(`TDS ${parameters.tds} mg/L: high dissolved solids; further chemical testing required`);
  } else {
    advisoryNotes.push(`TDS ${parameters.tds} mg/L: acceptable screening reference`);
  }

  // Rule: Turbidity above 5 NTU: show "high turbidity; possible microbial risk; treatment and E. coli testing required"
  if (turbidityHigh) {
    advisoryNotes.push(`Turbidity ${parameters.turbidity} NTU: high turbidity; possible microbial risk; treatment and E. coli testing required`);
  }

  // Rule: UV/UF treatment OFF, pump failure, or flow failure: show "treatment failure; do not drink until verified"
  if (treatmentFailed) {
    advisoryNotes.push("treatment failure; do not drink until verified");
  }

  // Rule: Positive E. coli or coliform laboratory result: show "microbial contamination confirmed; do not drink untreated water"
  if (ecoliPositive) {
    advisoryNotes.push("microbial contamination confirmed; do not drink untreated water");
  }

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

  return (
    <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-sky-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Water Safety & Health Advisory
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time health screening evaluation based on BIS drinking water guidelines & multi-sensor analysis.
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
            E. coli Lab: {ecoliPositive ? 'POSITIVE ⚠️' : 'Negative'}
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
            Pump/Flow: {pumpFlowFailure ? 'FAILURE ❌' : 'Normal'}
          </button>
        </div>
      </div>

      {/* Main Status Indicator Banner */}
      <div>
        {status === 'GREEN' && (
          <div className="bg-emerald-950/40 border-2 border-emerald-500/60 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-emerald-200 shadow-lg shadow-emerald-950/30">
            <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400 border border-emerald-500/40 shrink-0">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Screening Status</div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-wide">
                GREEN: WITHIN SCREENING RANGE
              </h3>
              <p className="text-sm text-emerald-300/90 mt-1">
                All monitored parameters (pH, TDS, Turbidity, Treatment Status) are currently within acceptable reference screening ranges.
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
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Screening Status</div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-wide">
                YELLOW: CAUTION — TREATMENT OR RETESTING REQUIRED
              </h3>
              <p className="text-sm text-amber-300/90 mt-1">
                One or more parameters exceed normal screening standards. Secondary treatment, filtration check, or laboratory retesting is advised.
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
              <div className="text-xs font-bold text-red-400 uppercase tracking-wider">Critical Advisory</div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-wide">
                RED: DO NOT DRINK — USE VERIFIED ALTERNATE WATER
              </h3>
              <p className="text-sm text-red-200 mt-1 font-medium">
                Active microbial contamination confirmed or severe treatment failure detected. Do not consume raw or untreated water.
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
              Parameter Screening & Diagnostic Triggers
            </h4>
            
            <div className="space-y-2.5">
              {/* pH Rule check */}
              <div className={`p-3 rounded-lg border text-xs sm:text-sm flex items-start justify-between gap-3 ${
                phOutOfRange
                  ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}>
                <div className="flex items-center gap-2">
                  {phOutOfRange ? <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  <span className="font-semibold">pH Level ({parameters.ph}):</span>
                </div>
                <span className="text-right font-medium">
                  {phOutOfRange ? "pH outside screening range" : "within BIS screening range"}
                </span>
              </div>

              {/* TDS Rule check */}
              <div className={`p-3 rounded-lg border text-xs sm:text-sm flex items-start justify-between gap-3 ${
                tdsHigh
                  ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}>
                <div className="flex items-center gap-2">
                  {tdsHigh ? <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  <span className="font-semibold">TDS ({parameters.tds} mg/L):</span>
                </div>
                <span className="text-right font-medium">
                  {tdsHigh ? "high dissolved solids; further chemical testing required" : "acceptable screening reference"}
                </span>
              </div>

              {/* Turbidity Rule check */}
              <div className={`p-3 rounded-lg border text-xs sm:text-sm flex items-start justify-between gap-3 ${
                turbidityHigh
                  ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}>
                <div className="flex items-center gap-2">
                  {turbidityHigh ? <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  <span className="font-semibold">Turbidity ({parameters.turbidity} NTU):</span>
                </div>
                <span className="text-right font-medium">
                  {turbidityHigh
                    ? "high turbidity; possible microbial risk; treatment and E. coli testing required"
                    : "acceptable (<= 5 NTU)"}
                </span>
              </div>

              {/* Treatment status check */}
              <div className={`p-3 rounded-lg border text-xs sm:text-sm flex items-start justify-between gap-3 ${
                treatmentFailed
                  ? 'bg-red-950/40 border-red-800/80 text-red-200'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}>
                <div className="flex items-center gap-2">
                  {treatmentFailed ? <XCircle className="w-4 h-4 text-red-400 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  <span className="font-semibold">UV/UF & Hardware:</span>
                </div>
                <span className="text-right font-medium">
                  {treatmentFailed ? "treatment failure; do not drink until verified" : "purification systems operational"}
                </span>
              </div>

              {/* E. coli lab status */}
              <div className={`p-3 rounded-lg border text-xs sm:text-sm flex items-start justify-between gap-3 ${
                ecoliPositive
                  ? 'bg-red-950/50 border-red-800 text-red-200'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}>
                <div className="flex items-center gap-2">
                  {ecoliPositive ? <FlaskConical className="w-4 h-4 text-red-400 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  <span className="font-semibold">Lab E. coli / Coliform:</span>
                </div>
                <span className="text-right font-medium">
                  {ecoliPositive ? "microbial contamination confirmed; do not drink untreated water" : "Negative / No lab alert"}
                </span>
              </div>
            </div>
          </div>

          {/* Conditional Guidance Notices (Microbial & Respiratory) */}
          <div className="space-y-3">
            {/* Microbial Risk Guidance Alert */}
            {hasMicrobialRisk && (
              <div className="bg-red-950/40 border border-red-900/80 rounded-xl p-4 flex items-start gap-3 text-red-200">
                <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-red-400 uppercase tracking-wide">Microbial Risk Alert</h5>
                  <p className="text-sm font-semibold mt-0.5">
                    Do not drink untreated water. Use a verified alternate source and arrange E. coli/coliform testing.
                  </p>
                </div>
              </div>
            )}

            {/* Respiratory Condition Notice */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex items-start gap-3 text-slate-300">
              <Wind className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-sky-400 uppercase tracking-wide">Respiratory & General Medical Note</h5>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Respiratory illness is not assessed by pH/TDS readings. Follow medical advice and use verified treated water during any water advisory.
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
                Extra-Caution Groups
              </h4>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Individuals in the following vulnerability categories should exercise extra vigilance and avoid unverified or untreated water sources during any screening advisory:
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-200">
              <li className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <span>Infants and young children</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <span>Pregnant people</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <span>Older adults</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <span>Immunocompromised people</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 sm:col-span-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <span>People undergoing chemotherapy or taking immune-suppressing medicines</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <span>People with serious chronic illness</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <span>People preparing infant formula</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 sm:col-span-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <span>People with kidney disease or medically restricted diets when chemical contamination is suspected</span>
              </li>
            </ul>
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-2 text-xs text-amber-400/90 font-medium">
              <Droplets className="w-4 h-4 shrink-0" />
              <span>Always boil or use certified bottled / community dispenser water when advisory is active.</span>
            </div>
          </div>
        </div>

      </div>

      {/* Permanent Mandatory Legal & Clinical Disclaimer */}
      <div className="bg-slate-950 border border-sky-900/40 rounded-xl p-4 flex items-start gap-3 text-slate-400">
        <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block">Official Advisory Disclaimer</span>
          <p className="text-xs text-slate-300 leading-relaxed">
            JalRakshak provides early-warning water-quality screening. It does not diagnose illness, identify all contaminants, or replace laboratory testing, official advisories, or medical advice.
          </p>
        </div>
      </div>

    </section>
  );
};
