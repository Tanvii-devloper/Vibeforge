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
        <div className="w-8 h-8 border-4 border-forest-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { regionalTrends, pathogenDistribution, cropVulnerability, efficacySummary } = data;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-forest-800 uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4 text-forest-700" />
            <span>Regional Epidemiology &amp; Micro-Climate Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Epidemic Trends &amp; Humidity Correlation
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Empirical field data correlating prolonged canopy humidity spikes (&gt;85% RH) with active sporulation cycles.
          </p>
        </div>
      </div>

      {/* KPI Cards: Efficacy Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between mb-2">
            <span>Diagnostics Processed</span>
            <div className="w-7 h-7 rounded-lg bg-forest-50 text-forest-800 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">
            {efficacySummary.totalDiagnosticsProcessed}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Multi-regional field sensors</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between mb-2">
            <span>False Alarms Eliminated</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-sky-700 font-mono">
            {efficacySummary.falseChemicalAlarmsEliminated}
          </div>
          <div className="text-[11px] text-sky-600 mt-1 font-semibold">Gated during dry micro-climate windows</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between mb-2">
            <span>Chemical Runoff Reduced</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-forest-800 font-mono">
            {efficacySummary.chemicalRunoffReductionPct}%
          </div>
          <div className="text-[11px] text-forest-700 mt-1 font-semibold">Direct fungicide volume saved</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between mb-2">
            <span>Avg Early Warning Lead</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-600 font-mono">
            {efficacySummary.avgEarlyWarningLeadTimeHours} hrs
          </div>
          <div className="text-[11px] text-amber-700 mt-1 font-semibold">Prior to widespread foliar lesions</div>
        </div>

      </div>

      {/* Main Historical Chart: Humidity Spikes vs Disease Outbreaks */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-150">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Droplets className="w-5 h-5 text-sky-600" />
              <span>Humidity Spikes vs Epidemic Outbreaks Correlation</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Correlating monthly micro-climatic humidity spikes with verified field disease outbreaks and prevented false alarms
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-mono font-medium">
            <span className="flex items-center space-x-1.5 text-sky-700">
              <span className="w-3 h-3 rounded bg-sky-500/20 border border-sky-500 inline-block"></span>
              <span>Humidity Spike (RH %)</span>
            </span>
            <span className="flex items-center space-x-1.5 text-rose-700">
              <span className="w-3 h-1 bg-rose-500 inline-block"></span>
              <span>Outbreaks Reported</span>
            </span>
            <span className="flex items-center space-x-1.5 text-forest-800">
              <span className="w-3 h-1 bg-forest-800 inline-block"></span>
              <span>False Alarms Gated</span>
            </span>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={regionalTrends} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" stroke="#94A3B8" tick={{ fontSize: 12, fill: '#64748B' }} />
              <YAxis stroke="#94A3B8" tick={{ fontSize: 12, fill: '#64748B' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} 
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', color: '#475569', fontWeight: 500 }} />

              {/* Humidity Spike Bar */}
              <Bar 
                dataKey="humiditySpike" 
                name="Humidity Spike (% RH)" 
                fill="#0284C7" 
                radius={[4, 4, 0, 0]} 
                opacity={0.75} 
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
                stroke="#1B4D3E" 
                strokeWidth={2.5} 
                dot={{ r: 3, fill: '#1B4D3E' }} 
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pathogen Taxonomy & Crop Vulnerability Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Pathogen Taxonomy Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2 pb-3 border-b border-slate-150">
            <PieIcon className="w-4 h-4 text-forest-700" />
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
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', fontSize: '12px' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-150 text-xs">
            {pathogenDistribution.map(item => (
              <div key={item.name} className="flex items-center justify-between text-slate-700 font-medium">
                <span className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span>{item.name}</span>
                </span>
                <span className="font-mono font-bold text-slate-900">{item.percentage}% ({item.count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Crop Vulnerability Matrix (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2 pb-3 border-b border-slate-150">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Crop Pathology Vulnerability Matrix</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Crop Category</th>
                  <th className="py-2.5 px-3">Active Plots</th>
                  <th className="py-2.5 px-3">High-Risk Ratio</th>
                  <th className="py-2.5 px-3">Avg Leaf Wetness</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 font-mono">
                {cropVulnerability.map(c => (
                  <tr key={c.crop} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900 font-sans">{c.crop}</td>
                    <td className="py-3 px-3 font-medium">{c.activePlots}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${c.highRiskRatio > 35 ? 'bg-rose-500' : 'bg-amber-500'}`}
                            style={{ width: `${c.highRiskRatio}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-800">{c.highRiskRatio}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-sky-700 font-bold">{c.avgLeafWetnessHours} hrs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-forest-50/60 rounded-xl p-3 border border-forest-200 flex items-start space-x-2.5 text-[11px] text-forest-900">
            <Info className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
            <span className="font-medium">
              Solanaceae (Tomato, Potato) and Viticulture demonstrate the highest biological sensitivity to continuous canopy wetness exceeding 6.0 hours, triggering zoosporangial sporulation.
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
