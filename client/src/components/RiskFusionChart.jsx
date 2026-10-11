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
      <div className="h-64 flex items-center justify-center text-slate-400 text-sm bg-white rounded-xl border border-slate-200">
        No diurnal simulation data available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const pData = payload[0].payload;
      return (
        <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-lg text-xs space-y-1.5 min-w-[200px]">
          <div className="font-bold text-slate-900 border-b border-slate-100 pb-1.5 flex items-center justify-between">
            <span>Time: {label}</span>
            {pData.isOptimalSprayWindow && (
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200 font-bold">
                Optimal Window
              </span>
            )}
          </div>
          <div className="text-rose-600 flex items-center justify-between gap-4 font-medium">
            <span>Sporulation Risk:</span>
            <span className="font-mono font-bold">{pData.riskScore}%</span>
          </div>
          <div className="text-sky-600 flex items-center justify-between gap-4 font-medium">
            <span>Relative Humidity:</span>
            <span className="font-mono font-bold">{pData.relativeHumidity}%</span>
          </div>
          <div className="text-amber-600 flex items-center justify-between gap-4 font-medium">
            <span>Temperature:</span>
            <span className="font-mono font-bold">{pData.temperature}°C</span>
          </div>
          <div className="text-teal-600 flex items-center justify-between gap-4 font-medium">
            <span>Leaf Wetness:</span>
            <span className="font-mono font-bold">{pData.leafWetnessHours}h</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-150">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Activity className="w-5 h-5 text-forest-700" />
            <span>{title}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronized overlay of ambient relative humidity with secondary-infection risk curve
          </p>
        </div>
        <div className="flex items-center space-x-4 text-xs font-medium">
          <span className="flex items-center space-x-1.5 text-slate-700">
            <span className="w-3 h-3 rounded bg-rose-500/20 border border-rose-500 inline-block"></span>
            <span>Risk Score</span>
          </span>
          <span className="flex items-center space-x-1.5 text-slate-700">
            <span className="w-3 h-1 bg-sky-500 inline-block"></span>
            <span>Humidity (%)</span>
          </span>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="riskGradientLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stop-color="#ef4444" stop-opacity={0.35}/>
                <stop offset="50%" stop-color="#f59e0b" stop-opacity={0.15}/>
                <stop offset="95%" stop-color="#10b981" stop-opacity={0.02}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="hour" stroke="#94A3B8" tick={{ fontSize: 11, fill: '#64748B' }} />
            <YAxis domain={[0, 100]} stroke="#94A3B8" tick={{ fontSize: 11, fill: '#64748B' }} />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Critical High Risk Threshold Line (> 70%) */}
            <ReferenceLine y={70} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'High Risk (>70%)', fill: '#DC2626', fontSize: 10, position: 'insideTopRight' }} />
            {/* Moderate Risk Threshold Line (40%) */}
            <ReferenceLine y={40} stroke="#F59E0B" strokeDasharray="4 4" label={{ value: 'Moderate Risk (40%)', fill: '#D97706', fontSize: 10, position: 'insideTopRight' }} />
            
            {/* Risk Area */}
            <Area 
              type="monotone" 
              dataKey="riskScore" 
              name="Micro-Climatic Risk" 
              stroke="#EF4444" 
              strokeWidth={2.5} 
              fillOpacity={1} 
              fill="url(#riskGradientLight)" 
            />
            {/* Relative Humidity Line */}
            <Line 
              type="monotone" 
              dataKey="relativeHumidity" 
              name="Relative Humidity (%)" 
              stroke="#0284C7" 
              strokeWidth={2} 
              dot={false} 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-slate-150 text-[11px] text-slate-600 font-medium">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>&lt; 40%: Routine monitoring (Chemical spray prevented)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>40-70%: Bio-fungicide protective window (48h)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span>&gt; 70%: Targeted translaminar systemic intervention</span>
        </div>
      </div>
    </div>
  );
}
