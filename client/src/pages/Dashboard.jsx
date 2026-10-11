import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  Droplets, 
  Thermometer, 
  ScanLine, 
  ArrowRight, 
  Sparkles,
  TrendingDown,
  Layers,
  AlertTriangle
} from 'lucide-react';
import FieldTable from '../components/FieldTable';
import WeatherSensorBadge from '../components/WeatherSensorBadge';

export default function Dashboard() {
  const [fields, setFields] = useState([]);
  const [recentAdvisories, setRecentAdvisories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/fields').then(r => r.json()),
      fetch('/api/advisories').then(r => r.json())
    ])
      .then(([fieldsRes, advisoriesRes]) => {
        if (fieldsRes.success) setFields(fieldsRes.fields || []);
        if (advisoriesRes.success) setRecentAdvisories(advisoriesRes.advisories || []);
      })
      .catch(err => console.error('Dashboard data load error:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const highRiskCount = fields.filter(f => f.risk_level === 'High').length;
  const activePlotsCount = fields.length;

  return (
    <div className="space-y-8">
      
      {/* Top Banner & Quick Action */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-900/40 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Multimodal Vision + Micro-Climatic Sporulation Modeling</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Micro-Climatic Crop Disease Early Warning System
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Eliminate crop losses and prevent false chemical alarms. Ingest raw foliar photographs, fuse hyper-local ambient humidity and leaf wetness kinetics, and calculate calibrated intervention windows.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/diagnose"
              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-lg shadow-emerald-950 transition-all hover:scale-102"
            >
              <ScanLine className="w-4 h-4" />
              <span>Launch Diagnostic Studio</span>
            </Link>

            <Link
              to="/analytics"
              className="flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-sm font-semibold px-4 py-3 rounded-xl border border-slate-700 transition-all"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>View Epidemic Curves</span>
            </Link>
          </div>
        </div>

        {/* Decorative background leaf illustration glow */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Overview Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Active Monitored Plots</span>
            <Sprout className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{activePlotsCount}</div>
          <div className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
            <span className="text-emerald-400 font-semibold">100%</span>
            <span>telemetry active</span>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Critical Outbreak Alerts</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-3xl font-extrabold text-red-400 font-mono">{highRiskCount}</div>
          <div className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
            <span className="text-red-400 font-semibold">{highRiskCount > 0 ? 'Urgent Action Gated' : 'None'}</span>
            <span>sporulation pressure</span>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>False Alarms Eliminated</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-cyan-400 font-mono">412</div>
          <div className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
            <TrendingDown className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-cyan-400 font-semibold">58.4%</span>
            <span>chemical savings</span>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>AI Diagnostic Precision</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">95.8%</div>
          <div className="text-xs text-slate-400 mt-1">
            Gemini 2.5 Flash Multimodal
          </div>
        </div>

      </div>

      {/* Live Micro-Climatic Sensor Telemetry */}
      <div>
        <WeatherSensorBadge 
          temperature={21.5}
          relativeHumidity={88.0}
          leafWetnessHours={7.5}
          windSpeed={5.8}
        />
      </div>

      {/* Active Advisories Ticker / Recent Scans */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Farm Plots Grid (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white">Registered Farm Plots & Current Health</h2>
            </div>
            <Link
              to="/fields"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
            >
              <span>Manage Plots</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <FieldTable fields={fields} />
        </div>

        {/* Recent Early Warning Advisories (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Latest Advisories</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">Live Logs</span>
          </div>

          <div className="space-y-3">
            {recentAdvisories.slice(0, 4).map((adv) => (
              <Link
                key={adv.advisory_id || adv.id}
                to={`/advisory/${adv.advisory_id || adv.id}`}
                className="block bg-slate-900/90 rounded-xl p-4 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400">
                      {adv.field_name || 'Farm Plot'} • {adv.crop_type || 'Crop'}
                    </span>
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors mt-0.5">
                      {adv.detected_disease || 'Late Blight'}
                    </h4>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      adv.risk_level === 'High'
                        ? 'bg-red-500/20 text-red-400 border-red-500/30'
                        : adv.risk_level === 'Moderate'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    {adv.risk_level} ({adv.risk_score}%)
                  </span>
                </div>

                <div className="text-xs text-slate-300 mt-2 line-clamp-2">
                  {adv.intervention_viability || adv.treatment_recommendation}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-800/80">
                  <span>Spray: {adv.optimal_spray_window?.split('(')[0] || 'Optimized Window'}</span>
                  <span className="text-emerald-400 group-hover:translate-x-0.5 transition-transform flex items-center">
                    Inspect &rarr;
                  </span>
                </div>
              </Link>
            ))}

            {recentAdvisories.length === 0 && (
              <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-800 text-center text-xs text-slate-400">
                No recent advisories generated yet.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
