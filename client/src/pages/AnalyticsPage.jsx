import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Droplets, 
  TrendingUp, 
  ShieldCheck, 
  Activity, 
  AlertTriangle,
  PieChart as PieIcon,
  Zap,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/epidemic')
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json);
      })
      .catch(err => console.error('Error fetching analytics:', err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !data) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { regionalTrends, pathogenDistribution, cropVulnerability, efficacySummary } = data;

  return (
    <div className="space-y-8 pb-12">
      
      {/* Page Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
          <BarChart3 className="w-4 h-4" />
          <span>Regional Epidemiology & Micro-Climate Analytics</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Epidemic Trends & Humidity Correlation
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Historical epidemiological data demonstrating the non-linear relationship between prolonged relative humidity spikes (&gt;85% RH) and secondary sporulation outbreaks.
        </p>
      </div>

      {/* KPI Cards: Efficacy Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between mb-2">
            <span>Diagnostics Processed</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {efficacySummary.totalDiagnosticsProcessed}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Multi-regional field sensors</div>
        </div>

        <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between mb-2">
            <span>False Alarms Eliminated</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-cyan-400 font-mono">
            {efficacySummary.falseChemicalAlarmsEliminated}
          </div>
          <div className="text-[11px] text-cyan-300 mt-1">Gated during dry micro-climate windows</div>
        </div>

        <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between mb-2">
            <span>Chemical Runoff Reduced</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">
            {efficacySummary.chemicalRunoffReductionPct}%
          </div>
          <div className="text-[11px] text-emerald-300 mt-1">Direct fungicide volume saved</div>
        </div>

        <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between mb-2">
            <span>Avg Early Warning Lead</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono">
            {efficacySummary.avgEarlyWarningLeadTimeHours} hrs
          </div>
          <div className="text-[11px] text-amber-300 mt-1">Prior to widespread foliar lesions</div>
        </div>

      </div>

      {/* Main Historical Chart: Humidity Spikes vs Disease Outbreaks */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Droplets className="w-5 h-5 text-cyan-400" />
              <span>Humidity Spikes vs Epidemic Outbreaks Correlation</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Correlating monthly micro-climatic humidity spikes with verified field disease outbreaks and prevented false alarms
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-mono">
            <span className="flex items-center space-x-1 text-cyan-400">
              <span className="w-3 h-3 rounded bg-cyan-500/40 border border-cyan-400 inline-block"></span>
              <span>Humidity Spike (RH %)</span>
            </span>
            <span className="flex items-center space-x-1 text-red-400">
              <span className="w-3 h-1 bg-red-400 inline-block"></span>
              <span>Outbreaks Reported</span>
            </span>
            <span className="flex items-center space-x-1 text-emerald-400">
              <span className="w-3 h-1 bg-emerald-400 inline-block"></span>
              <span>False Alarms Gated</span>
            </span>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={regionalTrends} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} 
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />

              {/* Humidity Spike Bar */}
              <Bar 
                dataKey="humiditySpike" 
                name="Humidity Spike (% RH)" 
                fill="#0284c7" 
                radius={[4, 4, 0, 0]} 
                opacity={0.7} 
              />

              {/* Disease Outbreaks Line */}
              <Line 
                type="monotone" 
                dataKey="outbreaksReported" 
                name="Field Outbreaks" 
                stroke="#ef4444" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#ef4444' }} 
              />

              {/* False Alarms Prevented Line */}
              <Line 
                type="monotone" 
                dataKey="falseAlarmsPrevented" 
                name="False Alarms Eliminated" 
                stroke="#10b981" 
                strokeWidth={2.5} 
                dot={{ r: 3, fill: '#10b981' }} 
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pathogen Taxonomy & Crop Vulnerability Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Pathogen Taxonomy Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2 pb-3 border-b border-slate-800">
            <PieIcon className="w-4 h-4 text-emerald-400" />
            <span>Pathogen Category Breakdown</span>
          </h3>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pathogenDistribution}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={45}
                  paddingAngle={4}
                >
                  {pathogenDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            {pathogenDistribution.map(item => (
              <div key={item.name} className="flex items-center justify-between text-slate-300">
                <span className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span>{item.name}</span>
                </span>
                <span className="font-mono font-bold text-slate-400">{item.percentage}% ({item.count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Crop Vulnerability Matrix (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2 pb-3 border-b border-slate-800">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Crop Pathology Vulnerability Matrix</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">Crop Category</th>
                  <th className="py-2.5 px-3">Active Plots</th>
                  <th className="py-2.5 px-3">High-Risk Ratio</th>
                  <th className="py-2.5 px-3">Avg Leaf Wetness</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {cropVulnerability.map(c => (
                  <tr key={c.crop} className="hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-bold text-white font-sans">{c.crop}</td>
                    <td className="py-3 px-3">{c.activePlots}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${c.highRiskRatio > 35 ? 'bg-red-500' : 'bg-amber-500'}`}
                            style={{ width: `${c.highRiskRatio}%` }}
                          />
                        </div>
                        <span>{c.highRiskRatio}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-cyan-400">{c.avgLeafWetnessHours} hrs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-750 flex items-start space-x-2 text-[11px] text-slate-400">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              Solanaceae (Tomato, Potato) and Viticulture show highest sensitivity to continuous leaf wetness durations exceeding 6.0 hours, triggering rapid zoosporangial sporulation.
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
