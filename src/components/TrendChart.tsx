'use client';

import React, { useState } from 'react';
import { TrendDataPoint } from '@/types/alarm';
import { TrendingUp, Clock } from 'lucide-react';

interface TrendChartProps {
  history: TrendDataPoint[];
  currentTds: number;
  currentPh: number;
}

export const TrendChart: React.FC<TrendChartProps> = ({ history, currentTds, currentPh }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Append current real-time point to graph if history length > 0
  const points = [...history];
  if (points.length > 0) {
    points[points.length - 1] = {
      ...points[points.length - 1],
      tds: currentTds,
      ph: currentPh
    };
  }

  // Dimensions for SVG rendering
  const width = 800;
  const height = 240;
  const paddingX = 50;
  const paddingY = 30;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Scales
  // TDS scale: 0 to 800
  const getTdsY = (tds: number) => {
    const minVal = 0;
    const maxVal = 800;
    const norm = (tds - minVal) / (maxVal - minVal);
    return height - paddingY - norm * chartHeight;
  };

  // pH scale: 4 to 9
  const getPhY = (ph: number) => {
    const minVal = 4;
    const maxVal = 9;
    const norm = (ph - minVal) / (maxVal - minVal);
    return height - paddingY - norm * chartHeight;
  };

  const getX = (index: number) => {
    const step = chartWidth / Math.max(points.length - 1, 1);
    return paddingX + index * step;
  };

  // Generate SVG path commands for smooth cubic bezier curves
  const makePath = (getY: (val: number) => number, key: 'tds' | 'ph') => {
    if (points.length === 0) return '';
    return points.reduce((acc, point, idx) => {
      const x = getX(idx);
      const y = getY(point[key]);
      if (idx === 0) return `M ${x} ${y}`;
      const prevX = getX(idx - 1);
      const prevY = getY(points[idx - 1][key]);
      const cpX1 = prevX + (x - prevX) / 2;
      const cpX2 = prevX + (x - prevX) / 2;
      return `${acc} C ${cpX1} ${prevY}, ${cpX2} ${y}, ${x} ${y}`;
    }, '');
  };

  const tdsPath = makePath(getTdsY, 'tds');
  const phPath = makePath(getPhY, 'ph');

  const activeIndex = hoveredIdx !== null ? hoveredIdx : points.length - 1;
  const activePoint = points[activeIndex] || points[0];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
      
      {/* Header with Title & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-slate-100 text-base">Last 24 Hours — TDS & pH</h3>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 rounded-full bg-cyan-400" />
            <span className="text-slate-300">TDS (ppm)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 rounded-full bg-lime-400" />
            <span className="text-slate-300">pH</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-xs">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Last 24 Hours</span>
          </div>
        </div>
      </div>

      {/* SVG Chart Area */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-64 overflow-visible"
        >
          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = paddingY + ratio * chartHeight;
            return (
              <line
                key={i}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#1e293b"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Left Y Axis Labels (pH 4 - 9) */}
          <text x={paddingX - 10} y={paddingY + 5} fill="#94a3b8" fontSize="11" textAnchor="end">9</text>
          <text x={paddingX - 10} y={paddingY + chartHeight / 2 + 4} fill="#94a3b8" fontSize="11" textAnchor="end">6.5</text>
          <text x={paddingX - 10} y={height - paddingY} fill="#94a3b8" fontSize="11" textAnchor="end">4</text>

          {/* Right Y Axis Labels (TDS 0 - 800) */}
          <text x={width - paddingX + 10} y={paddingY + 5} fill="#94a3b8" fontSize="11" textAnchor="start">800</text>
          <text x={width - paddingX + 10} y={paddingY + chartHeight / 2 + 4} fill="#94a3b8" fontSize="11" textAnchor="start">400</text>
          <text x={width - paddingX + 10} y={height - paddingY} fill="#94a3b8" fontSize="11" textAnchor="start">0</text>

          {/* TDS Curve (Cyan) */}
          <path
            d={tdsPath}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* pH Curve (Lime) */}
          <path
            d={phPath}
            fill="none"
            stroke="#a3e635"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Interactive Data Points & Vertical Guide */}
          {points.map((pt, idx) => {
            const x = getX(idx);
            const yTds = getTdsY(pt.tds);
            const yPh = getPhY(pt.ph);
            const isHovered = idx === activeIndex;

            return (
              <g key={idx} onMouseEnter={() => setHoveredIdx(idx)} onMouseLeave={() => setHoveredIdx(null)}>
                {/* Vertical hover line */}
                {isHovered && (
                  <line
                    x1={x}
                    y1={paddingY}
                    x2={x}
                    y2={height - paddingY}
                    stroke="#475569"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                )}

                {/* TDS Point */}
                <circle
                  cx={x}
                  cy={yTds}
                  r={isHovered ? 6 : 4}
                  fill="#22d3ee"
                  stroke="#0f172a"
                  strokeWidth="2"
                  className="cursor-pointer transition-all"
                />

                {/* pH Point */}
                <circle
                  cx={x}
                  cy={yPh}
                  r={isHovered ? 6 : 4}
                  fill="#a3e635"
                  stroke="#0f172a"
                  strokeWidth="2"
                  className="cursor-pointer transition-all"
                />

                {/* X Axis Time Label */}
                <text
                  x={x}
                  y={height - 8}
                  fill="#94a3b8"
                  fontSize="11"
                  textAnchor="middle"
                  fontWeight={isHovered ? "bold" : "normal"}
                >
                  {pt.time}
                </text>
              </g>
            );
          })}

          {/* Callout Tooltip matching user screenshot */}
          {activePoint && (
            <g transform={`translate(${getX(activeIndex)}, ${getTdsY(activePoint.tds) - 35})`}>
              <rect
                x="-35"
                y="-18"
                width="70"
                height="28"
                rx="6"
                fill="#0f172a"
                stroke="#22d3ee"
                strokeWidth="1.5"
              />
              <text x="0" y="-4" fill="#22d3ee" fontSize="10" textAnchor="middle" fontWeight="bold">
                TDS: {activePoint.tds}
              </text>
              <text x="0" y="6" fill="#a3e635" fontSize="9" textAnchor="middle">
                pH: {activePoint.ph}
              </text>
            </g>
          )}

        </svg>
      </div>

    </div>
  );
};
