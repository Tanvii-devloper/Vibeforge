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
  Info,
  Radio 
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
        <div className="w-10 h-10 border-4 border-neon-mint border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { regionalTrends, pathogenDistribution, cropVulnerability, efficacySummary } = data;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="glass-panel-3d rounded-2xl p-6 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-neon-mint uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 text-neon-mint animate-pulse" />
            <span>Regional Epidemiology &amp; Micro-Climate Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans text-glow-mint">
            Epidemic Trends &amp; Humidity Correlation
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Empirical field data correlating prolonged canopy humidity spikes (&gt;85% RH) with active sporulation cycles.
          </p>
        </div>
      </div>

      {/* KPI Cards: Efficacy Summary (3D Glass Pods) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel-3d rounded-2xl p-5 border border-white/10">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between mb-2">
            <span>Diagnostics Ingested</span>
            <div className="w-7 h-7 rounded-lg bg-forest-900 text-neon-mint flex items-center justify-center border border-neon-mint/30 shadow-[0_0_10px_rgba(0,255,135,0.2)]">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono mt-1 text-glow-mint">
            {efficacySummary.totalDiagnosticsProcessed}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">Multi-regional field sensors</div>
        </div>

        <div className="glass-panel-3d rounded-2xl p-5 border border-white/10">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between mb-2">
            <span>False Alarms Gated</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-950 text-cyan-400 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-cyan-300 font-mono mt-1 text-glow-cyan">
            {efficacySummary.falseChemicalAlarmsEliminated}
          </div>
          <div className="text-[11px] text-cyan-400 mt-1 font-mono">Gated during dry micro-climate windows</div>
        </div>

        <div className="glass-panel-3d rounded-2xl p-5 border border-white/10">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between mb-2">
            <span>Chemical Runoff Reduced</span>
            <div className="w-7 h-7 rounded-lg bg-forest-900 text-neon-mint flex items-center justify-center border border-neon-mint/30 shadow-[0_0_10px_rgba(0,255,135,0.2)]">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-neon-mint font-mono mt-1 text-glow-mint">
            {efficacySummary.chemicalRunoffReductionPct}%
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">Direct fungicide volume saved</div>
        </div>

        <div className="glass-panel-3d rounded-2xl p-5 border border-white/10">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between mb-2">
            <span>Avg Early Warning Lead</span>
            <div className="w-7 h-7 rounded-lg bg-amber-950 text-amber-400 flex items-center justify-center border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono mt-1">
            {efficacySummary.avgEarlyWarningLeadTimeHours} hrs
          </div>
          <div className="text-[11px] text-amber-400 mt-1 font-mono">Prior to widespread foliar lesions</div>
        </div>

      </div>

      {/* Main Historical Chart: Humidity Spikes vs Disease Outbreaks */}
      <div className="glass-panel-3d rounded-2xl p-6 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
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
            <span className="flex items-center space-x-1.5 text-cyan-400">
              <span className="w-3 h-3 rounded bg-cyan-500/30 border border-cyan-400 inline-block shadow-[0_0_8px_#00F0FF]"></span>
              <span>Humidity Spike (RH %)</span>
            </span>
            <span className="flex items-center space-x-1.5 text-rose-400">
              <span className="w-3 h-1 bg-rose-500 inline-block shadow-[0_0_8px_#EF4444]"></span>
              <span>Outbreaks Reported</span>
            </span>
            <span className="flex items-center space-x-1.5 text-neon-mint">
              <span className="w-3 h-1 bg-neon-mint inline-block shadow-[0_0_8px_#00FF87]"></span>
              <span>False Alarms Gated</span>
            </span>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={regionalTrends} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="month" stroke="#64748B" tick={{ fontSize: 12, fill: '#94A3B8' }} />
              <YAxis stroke="#64748B" tick={{ fontSize: 12, fill: '#94A3B8' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#081711', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '12px', fontSize: '12px', fontFamily: 'monospace' }} 
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace' }} />

              {/* Humidity Spike Bar */}
              <Bar 
                dataKey="humiditySpike" 
                name="Humidity Spike (% RH)" 
                fill="#00F0FF" 
                radius={[4, 4, 0, 0]} 
                opacity={0.4} 
              />

              {/* Disease Outbreaks Line */}
              <Line 
                type="monotone" 
                dataKey="outbreaksReported" 
                name="Field Outbreaks" 
                stroke="#EF4444" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#EF4444' }} 
              />

              {/* False Alarms Prevented Line */}
              <Line 
                type="monotone" 
                dataKey="falseAlarmsPrevented" 
                name="False Alarms Eliminated" 
                stroke="#00FF87" 
                strokeWidth={2.5} 
                dot={{ r: 3, fill: '#00FF87' }} 
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pathogen Taxonomy & Crop Vulnerability Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Pathogen Taxonomy Distribution (5 cols) */}
        <div className="lg:col-span-5 glass-panel-3d rounded-2xl p-6 border border-white/10 space-y-4">
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center space-x-2 pb-3 border-b border-white/10">
            <PieIcon className="w-4 h-4 text-neon-mint" />
            <span>Pathogen Category Distribution</span>
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
                  contentStyle={{ backgroundColor: '#081711', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '12px', fontSize: '12px' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/10 text-xs font-mono">
            {pathogenDistribution.map(item => (
              <div key={item.name} className="flex items-center justify-between text-slate-300">
                <span className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span>{item.name}</span>
                </span>
                <span className="font-bold text-slate-200">{item.percentage}% ({item.count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Crop Vulnerability Matrix (7 cols) */}
        <div className="lg:col-span-7 glass-panel-3d rounded-2xl p-6 border border-white/10 space-y-4">
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center space-x-2 pb-3 border-b border-white/10">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Crop Pathology Vulnerability Matrix</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-black/40 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-2.5 px-3">Crop Category</th>
                  <th className="py-2.5 px-3">Active Plots</th>
                  <th className="py-2.5 px-3">High-Risk Ratio</th>
                  <th className="py-2.5 px-3">Avg Leaf Dew</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {cropVulnerability.map(c => (
                  <tr key={c.crop} className="hover:bg-white/5">
                    <td className="py-3 px-3 font-bold text-white">{c.crop}</td>
                    <td className="py-3 px-3">{c.activePlots}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-black/60 h-2 rounded-full overflow-hidden border border-white/10">
                          <div 
                            className={`h-full ${c.highRiskRatio > 35 ? 'bg-rose-500 shadow-[0_0_8px_#EF4444]' : 'bg-amber-500'}`}
                            style={{ width: `${c.highRiskRatio}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-200">{c.highRiskRatio}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-cyan-400">{c.avgLeafWetnessHours} hrs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="glass-subpanel rounded-xl p-3 border border-white/10 flex items-start space-x-2.5 text-[11px] text-slate-300">
            <Info className="w-4 h-4 text-neon-mint shrink-0 mt-0.5" />
            <span>
              Solanaceae (Tomato, Potato) and Viticulture demonstrate the highest biological sensitivity to continuous canopy wetness exceeding 6.0 hours, triggering zoosporangial sporulation.
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
