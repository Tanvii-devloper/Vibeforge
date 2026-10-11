import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { TrendingUp, ShieldCheck, Zap, AlertOctagon } from 'lucide-react';

export default function EpidemicSimulationChart({ simulationData = [], summary = {} }) {
  const [horizon, setHorizon] = useState(14); // 7, 14, 30

  // Filter simulation data based on selected horizon
  const filteredData = (simulationData || []).filter(item => item.dayNum <= horizon);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-xs space-y-1">
          <div className="font-bold text-slate-200 border-b border-slate-800 pb-1">
            Simulation Timeline: {label}
          </div>
          <div className="text-red-400 flex items-center justify-between gap-4">
            <span>Unmanaged Spread:</span>
            <span className="font-mono font-bold">{payload.find(p => p.dataKey === 'unmanaged')?.value}% canopy</span>
          </div>
          <div className="text-amber-400 flex items-center justify-between gap-4">
            <span>Delayed Standard:</span>
            <span className="font-mono font-bold">{payload.find(p => p.dataKey === 'standardTreatment')?.value}% canopy</span>
          </div>
          <div className="text-emerald-400 flex items-center justify-between gap-4">
            <span>Calibrated Early Warning:</span>
            <span className="font-mono font-bold">{payload.find(p => p.dataKey === 'calibratedIntervention')?.value}% canopy</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Epidemic Spread Modeling & Canopy Protection</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Secondary sporulation velocity and canopy collapse projection comparing intervention regimes
          </p>
        </div>

        {/* Horizon Selector: 7, 14, 30 days */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700 self-start sm:self-auto">
          {[7, 14, 30].map(h => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                horizon === h
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {h}-Day Horizon
            </button>
          ))}
        </div>
      </div>

      {/* Protective Yield Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="bg-emerald-950/30 border border-emerald-800/40 p-3 rounded-xl flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-emerald-300 font-medium">Canopy Saved</div>
            <div className="text-lg font-bold text-emerald-400 font-mono">
              +{summary.canopySavedPercentage || '84.2'}%
            </div>
          </div>
        </div>

        <div className="bg-cyan-950/30 border border-cyan-800/40 p-3 rounded-xl flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-cyan-300 font-medium">Chemical Runoff Reduced</div>
            <div className="text-lg font-bold text-cyan-400 font-mono">
              -{summary.chemicalReductionPct || '62.5'}%
            </div>
          </div>
        </div>

        <div className="bg-amber-950/30 border border-amber-800/40 p-3 rounded-xl flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-amber-300 font-medium">Yield Loss Averted</div>
            <div className="text-lg font-bold text-amber-400 font-mono">
              ~{summary.projectedLossAvertedKgPerHa || '15,200'} kg/ha
            </div>
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36} 
              wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} 
            />

            {/* Unmanaged Epidemic Curve */}
            <Line
              type="monotone"
              dataKey="unmanaged"
              name="Unmanaged Epidemic Curve"
              stroke="#ef4444"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={false}
            />

            {/* Standard Delayed Treatment */}
            <Line
              type="monotone"
              dataKey="standardTreatment"
              name="Delayed Calendar Spray (Day 6)"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
            />

            {/* Calibrated Early Warning Intervention */}
            <Line
              type="monotone"
              dataKey="calibratedIntervention"
              name="Calibrated Early-Warning (Micro-Climatic Gated)"
              stroke="#10b981"
              strokeWidth={3.5}
              dot={{ r: 2, fill: '#10b981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
