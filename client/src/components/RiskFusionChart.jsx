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
      <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
        No diurnal simulation data available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const pData = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-xs space-y-1">
          <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 flex items-center justify-between">
            <span>Time: {label}</span>
            {pData.isOptimalSprayWindow && (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">
                Optimal Spray Window
              </span>
            )}
          </div>
          <div className="text-red-400 flex items-center justify-between gap-4">
            <span>Sporulation Risk:</span>
            <span className="font-mono font-bold">{pData.riskScore}%</span>
          </div>
          <div className="text-cyan-400 flex items-center justify-between gap-4">
            <span>Relative Humidity:</span>
            <span className="font-mono font-bold">{pData.relativeHumidity}%</span>
          </div>
          <div className="text-amber-400 flex items-center justify-between gap-4">
            <span>Temperature:</span>
            <span className="font-mono font-bold">{pData.temperature}°C</span>
          </div>
          <div className="text-blue-400 flex items-center justify-between gap-4">
            <span>Leaf Wetness:</span>
            <span className="font-mono font-bold">{pData.leafWetnessHours}h</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span>{title}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Synchronized overlay of ambient relative humidity with secondary-infection risk curve
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <span className="flex items-center space-x-1 text-slate-300">
            <span className="w-3 h-3 rounded bg-red-500/30 border border-red-500 inline-block"></span>
            <span>Risk Score</span>
          </span>
          <span className="flex items-center space-x-1 text-slate-300">
            <span className="w-3 h-1 bg-cyan-400 inline-block"></span>
            <span>Humidity (%)</span>
          </span>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stop-color="#ef4444" stop-opacity={0.5}/>
                <stop offset="50%" stop-color="#f59e0b" stop-opacity={0.3}/>
                <stop offset="95%" stop-color="#10b981" stop-opacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Critical High Risk Threshold Line (> 70%) */}
            <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'High Risk (>70%)', fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }} />
            {/* Moderate Risk Threshold Line (40%) */}
            <ReferenceLine y={40} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Moderate Risk (40%)', fill: '#f59e0b', fontSize: 10, position: 'insideTopRight' }} />
            
            {/* Risk Area */}
            <Area 
              type="monotone" 
              dataKey="riskScore" 
              name="Micro-Climatic Risk" 
              stroke="#ef4444" 
              strokeWidth={2.5} 
              fillOpacity={1} 
              fill="url(#riskGradient)" 
            />
            {/* Relative Humidity Line */}
            <Line 
              type="monotone" 
              dataKey="relativeHumidity" 
              name="Relative Humidity (%)" 
              stroke="#38bdf8" 
              strokeWidth={2} 
              dot={false} 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>&lt; 40%: Routine monitoring (Chemical spray prevented)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span>40-70%: Bio-fungicide protective window (48h)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          <span>&gt; 70%: Targeted translaminar systemic intervention</span>
        </div>
      </div>
    </div>
  );
}
