import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { Activity, ShieldCheck, AlertTriangle, Droplets } from 'lucide-react';

export default function RiskFusionChart({ data = [], title = "Diurnal Micro-Climatic Risk Fusion (24h Forecast)" }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 text-sm glass-panel-3d rounded-2xl">
        No diurnal simulation data available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const pData = payload[0].payload;
      return (
        <div className="bg-[#081711]/95 border border-white/10 p-3.5 rounded-xl shadow-2xl backdrop-blur-xl text-xs space-y-1.5 min-w-[210px] font-mono">
          <div className="font-bold text-slate-200 border-b border-white/10 pb-1.5 flex items-center justify-between">
            <span>Time: {label}</span>
            {pData.isOptimalSprayWindow && (
              <span className="text-[10px] bg-emerald-500/20 text-neon-mint px-2 py-0.5 rounded border border-emerald-500/40 font-bold shadow-[0_0_8px_rgba(0,255,135,0.3)]">
                Optimal Window
              </span>
            )}
          </div>
          <div className="text-rose-400 flex items-center justify-between gap-4 font-semibold">
            <span>Sporulation Risk:</span>
            <span className="font-bold text-glow-red">{pData.riskScore}%</span>
          </div>
          <div className="text-cyan-400 flex items-center justify-between gap-4 font-semibold">
            <span>Relative Humidity:</span>
            <span className="font-bold text-glow-cyan">{pData.relativeHumidity}%</span>
          </div>
          <div className="text-amber-400 flex items-center justify-between gap-4">
            <span>Temperature:</span>
            <span className="font-bold">{pData.temperature}°C</span>
          </div>
          <div className="text-teal-400 flex items-center justify-between gap-4">
            <span>Leaf Dew:</span>
            <span className="font-bold">{pData.leafWetnessHours}h</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel-3d rounded-2xl p-6 relative overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-forest-800/20 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10 relative z-10">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Activity className="w-5 h-5 text-neon-mint" />
            <span>{title}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Synchronized overlay of ambient relative humidity with secondary-infection risk curve
          </p>
        </div>
        <div className="flex items-center space-x-4 text-xs font-mono">
          <span className="flex items-center space-x-1.5 text-slate-300">
            <span className="w-3 h-3 rounded bg-rose-500/30 border border-rose-500 inline-block shadow-[0_0_8px_#EF4444]"></span>
            <span>Risk Score</span>
          </span>
          <span className="flex items-center space-x-1.5 text-slate-300">
            <span className="w-3 h-1 bg-cyan-400 inline-block shadow-[0_0_8px_#00F0FF]"></span>
            <span>Humidity (%)</span>
          </span>
        </div>
      </div>

      <div className="h-72 w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="riskGradient3D" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stop-color="#EF4444" stop-opacity={0.6}/>
                <stop offset="50%" stop-color="#F59E0B" stop-opacity={0.3}/>
                <stop offset="95%" stop-color="#10B981" stop-opacity={0.02}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="hour" stroke="#64748B" tick={{ fontSize: 11, fill: '#94A3B8' }} />
            <YAxis domain={[0, 100]} stroke="#64748B" tick={{ fontSize: 11, fill: '#94A3B8' }} />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Critical High Risk Threshold Line (> 70%) */}
            <ReferenceLine y={70} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'Critical Trigger (>70%)', fill: '#EF4444', fontSize: 10, position: 'insideTopRight' }} />
            {/* Moderate Risk Threshold Line (40%) */}
            <ReferenceLine y={40} stroke="#F59E0B" strokeDasharray="4 4" label={{ value: 'Moderate Gate (40%)', fill: '#F59E0B', fontSize: 10, position: 'insideTopRight' }} />
            
            {/* Risk Area */}
            <Area 
              type="monotone" 
              dataKey="riskScore" 
              name="Micro-Climatic Risk" 
              stroke="#EF4444" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#riskGradient3D)" 
            />
            {/* Relative Humidity Line */}
            <Line 
              type="monotone" 
              dataKey="relativeHumidity" 
              name="Relative Humidity (%)" 
              stroke="#00F0FF" 
              strokeWidth={2.5} 
              dot={false} 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-white/10 text-[11px] text-slate-400 font-mono relative z-10">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]"></span>
          <span>&lt; 40%: Routine monitoring (Chemical spray prevented)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B]"></span>
          <span>40-70%: Bio-fungicide protective window (48h)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#EF4444] animate-ping"></span>
          <span>&gt; 70%: Targeted translaminar systemic intervention</span>
        </div>
      </div>
    </div>
  );
}
