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
        <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-lg text-xs space-y-1.5 min-w-[210px]">
          <div className="font-bold text-slate-900 border-b border-slate-100 pb-1.5">
            Simulation Timeline: {label}
          </div>
          <div className="text-rose-600 flex items-center justify-between gap-4 font-medium">
            <span>Unmanaged Spread:</span>
            <span className="font-mono font-bold">{payload.find(p => p.dataKey === 'unmanaged')?.value}% canopy</span>
          </div>
          <div className="text-amber-600 flex items-center justify-between gap-4 font-medium">
            <span>Delayed Standard:</span>
            <span className="font-mono font-bold">{payload.find(p => p.dataKey === 'standardTreatment')?.value}% canopy</span>
          </div>
          <div className="text-forest-800 flex items-center justify-between gap-4 font-medium">
            <span>Calibrated Early Warning:</span>
            <span className="font-mono font-bold">{payload.find(p => p.dataKey === 'calibratedIntervention')?.value}% canopy</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-150">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-forest-700" />
            <h3 className="text-base font-bold text-slate-900">Epidemic Spread Modeling &amp; Canopy Protection</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Secondary sporulation velocity and foliar protection curves across intervention regimes
          </p>
        </div>

        {/* Horizon Selector: 7, 14, 30 days */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 self-start sm:self-auto">
          {[7, 14, 30].map(h => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                horizon === h
                  ? 'bg-forest-800 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {h}-Day Horizon
            </button>
          ))}
        </div>
      </div>

      {/* Protective Yield Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-5">
        <div className="bg-forest-50/70 border border-forest-200 p-4 rounded-xl flex items-center space-x-3.5">
          <div className="w-9 h-9 rounded-lg bg-forest-800 text-mint-300 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-forest-800 font-bold uppercase tracking-wider">Canopy Saved</div>
            <div className="text-xl font-extrabold text-forest-900 font-mono mt-0.5">
              +{summary.canopySavedPercentage || '84.2'}%
            </div>
          </div>
        </div>

        <div className="bg-sky-50/70 border border-sky-200 p-4 rounded-xl flex items-center space-x-3.5">
          <div className="w-9 h-9 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-sky-800 font-bold uppercase tracking-wider">Chemical Volume Reduced</div>
            <div className="text-xl font-extrabold text-sky-900 font-mono mt-0.5">
              -{summary.chemicalReductionPct || '62.5'}%
            </div>
          </div>
        </div>

        <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl flex items-center space-x-3.5">
          <div className="w-9 h-9 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-amber-800 font-bold uppercase tracking-wider">Yield Loss Averted</div>
            <div className="text-xl font-extrabold text-amber-900 font-mono mt-0.5">
              ~{summary.projectedLossAvertedKgPerHa || '15,200'} kg/ha
            </div>
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="day" stroke="#94A3B8" tick={{ fontSize: 11, fill: '#64748B' }} />
            <YAxis domain={[0, 100]} stroke="#94A3B8" tick={{ fontSize: 11, fill: '#64748B' }} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36} 
              wrapperStyle={{ fontSize: '11px', color: '#475569', fontWeight: 500 }} 
            />

            {/* Unmanaged Epidemic Curve */}
            <Line
              type="monotone"
              dataKey="unmanaged"
              name="Unmanaged Epidemic Curve"
              stroke="#EF4444"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={false}
            />

            {/* Standard Delayed Treatment */}
            <Line
              type="monotone"
              dataKey="standardTreatment"
              name="Delayed Calendar Spray (Day 6)"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={false}
            />

            {/* Calibrated Early Warning Intervention */}
            <Line
              type="monotone"
              dataKey="calibratedIntervention"
              name="Calibrated Early Warning (Micro-Climatic Gated)"
              stroke="#1B4D3E"
              strokeWidth={3.5}
              dot={{ r: 3, fill: '#1B4D3E' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
