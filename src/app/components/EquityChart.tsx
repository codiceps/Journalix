'use client';

import React from 'react';

interface EquityPoint {
  date: string;
  equity: number;
}

interface EquityChartProps {
  data: EquityPoint[];
}

export default function EquityChart({ data }: EquityChartProps) {
  // If no data or 1 point, can't really draw a line chart well
  if (data.length < 2) {
    return (
      <div className="flex-1 w-full h-64 flex items-center justify-center text-slate-500 font-mono text-sm">
        Data tidak cukup untuk menggambar grafik.
      </div>
    );
  }

  // Find min and max for scaling
  const maxEquity = Math.max(...data.map(d => d.equity));
  const minEquity = Math.min(0, ...data.map(d => d.equity)); // start from at least 0 or lower if negative
  const range = maxEquity - minEquity || 1; // avoid division by zero

  // SVG dimensions
  const svgWidth = 800;
  const svgHeight = 240;
  const paddingX = 40;
  const paddingY = 20;
  
  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  // Generate points
  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * chartWidth;
    const y = paddingY + chartHeight - ((d.equity - minEquity) / range) * chartHeight;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${paddingX + chartWidth},${svgHeight - paddingY} L ${paddingX},${svgHeight - paddingY} Z`;

  return (
    <section className="bg-ink border border-ink-border rounded-lg p-5 flex flex-col mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-slate-50">Cumulative Equity</h3>
        <div className="flex gap-2">
          <span className="flex items-center gap-1 font-mono text-xs text-slate-400">
            <div className="w-2 h-2 rounded-full bg-profit"></div> Portfolio Value
          </span>
        </div>
      </div>
      <div className="flex-1 w-full h-64 relative">
        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          <defs>
            <linearGradient id="equity-gradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="var(--color-profit-text)" stopOpacity="0.3"></stop>
              <stop offset="95%" stopColor="var(--color-profit-text)" stopOpacity="0"></stop>
            </linearGradient>
          </defs>
          
          <g className="chart-grid opacity-30">
            <line x1={paddingX} x2={svgWidth - paddingX} y1={paddingY} y2={paddingY} stroke="var(--color-ink-border)" strokeDasharray="4 4" />
            <line x1={paddingX} x2={svgWidth - paddingX} y1={paddingY + chartHeight / 2} y2={paddingY + chartHeight / 2} stroke="var(--color-ink-border)" strokeDasharray="4 4" />
            <line x1={paddingX} x2={svgWidth - paddingX} y1={svgHeight - paddingY} y2={svgHeight - paddingY} stroke="var(--color-ink-border)" strokeDasharray="4 4" />
          </g>

          <path d={areaD} fill="url(#equity-gradient)" />
          <path d={pathD} fill="none" stroke="var(--color-profit-text)" strokeWidth="3" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}
