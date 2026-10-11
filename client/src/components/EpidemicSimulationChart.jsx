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
        <div className="bg-[#081711]/95 border border-white/10 p-3.5 rounded-xl shadow-2xl backdrop-blur-xl text-xs space-y-1.5 min-w-[210px] font-mono">
          <div className="font-bold text-slate-200 border-b border-white/10 pb-1.5">
            Simulation: {label}
          </div>
          <div className="text-rose-400 flex items-center justify-between gap-4">
            <span>Unmanaged Spread:</span>
            <span className="font-bold text-glow-red">{payload.find(p => p.dataKey === 'unmanaged')?.value}%</span>
          </div>
          <div className="text-amber-400 flex items-center justify-between gap-4">
            <span>Delayed Standard:</span>
            <span className="font-bold">{payload.find(p => p.dataKey === 'standardTreatment')?.value}%</span>
          </div>
          <div className="text-neon-mint flex items-center justify-between gap-4">
            <span>Calibrated Early Warning:</span>
            <span className="font-bold text-glow-mint">{payload.find(p => p.dataKey === 'calibratedIntervention')?.value}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel-3d rounded-2xl p-6 relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-0 right-1/3 w-80 h-80 bg-forest-800/20 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-white/10 relative z-10">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-neon-mint" />
            <h3 className="text-base font-bold text-white font-sans text-glow-mint">
              Epidemic Spread Modeling &amp; Canopy Protection
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Secondary sporulation velocity and foliar protection curves across intervention regimes
          </p>
        </div>

        {/* Horizon Selector: 7, 14, 30 days */}
        <div className="flex items-center bg-black/50 p-1 rounded-xl border border-white/10 self-start sm:self-auto font-mono">
          {[7, 14, 30].map(h => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                horizon === h
                  ? 'bg-forest-800 text-neon-mint border border-neon-mint/40 shadow-[0_0_12px_rgba(0,255,135,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {h}-Day Horizon
            </button>
          ))}
        </div>
      </div>

      {/* Protective Yield Summary Cards (Floating Glass Pods) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5 relative z-10">
        
        <div className="glass-subpanel p-4 rounded-xl border border-emerald-500/30 flex items-center space-x-3.5 shadow-[0_0_20px_rgba(16,185,129,0.15)] group hover:scale-[1.02] transition-transform">
          <div className="w-10 h-10 rounded-xl bg-forest-900/80 text-neon-mint border border-neon-mint/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,255,135,0.25)]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider font-mono">Canopy Saved</div>
            <div className="text-2xl font-extrabold text-white font-mono mt-0.5 text-glow-mint">
              +{summary.canopySavedPercentage || '84.2'}%
            </div>
          </div>
        </div>

        <div className="glass-subpanel p-4 rounded-xl border border-cyan-500/30 flex items-center space-x-3.5 shadow-[0_0_20px_rgba(6,182,212,0.15)] group hover:scale-[1.02] transition-transform">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-cyan-400 font-bold uppercase tracking-wider font-mono">Chemical Volume Reduced</div>
            <div className="text-2xl font-extrabold text-cyan-300 font-mono mt-0.5 text-glow-cyan">
              -{summary.chemicalReductionPct || '62.5'}%
            </div>
          </div>
        </div>

        <div className="glass-subpanel p-4 rounded-xl border border-amber-500/30 flex items-center space-x-3.5 shadow-[0_0_20px_rgba(245,158,11,0.15)] group hover:scale-[1.02] transition-transform">
          <div className="w-10 h-10 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-amber-400 font-bold uppercase tracking-wider font-mono">Yield Loss Averted</div>
            <div className="text-2xl font-extrabold text-amber-300 font-mono mt-0.5">
              ~{summary.projectedLossAvertedKgPerHa || '15,200'} kg/ha
            </div>
          </div>
        </div>

      </div>

      <div className="h-72 w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="day" stroke="#64748B" tick={{ fontSize: 11, fill: '#94A3B8' }} />
            <YAxis domain={[0, 100]} stroke="#64748B" tick={{ fontSize: 11, fill: '#94A3B8' }} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36} 
              wrapperStyle={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace' }} 
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
              name="Calibrated Early Warning"
              stroke="#00FF87"
              strokeWidth={3.5}
              dot={{ r: 3, fill: '#00FF87' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
