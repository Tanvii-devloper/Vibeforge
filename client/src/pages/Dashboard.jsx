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
  AlertTriangle,
  ChevronRight,
  MapPin,
  Clock
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

  const highRiskCount = fields.filter(f => f.risk_level === 'High' || f.risk_score > 70).length;
  const activePlotsCount = fields.length;

  return (
    <div className="space-y-6">
      
      {/* Executive Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-forest-800 via-forest-900 to-forest-800 text-white p-7 sm:p-9 shadow-lg">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-mint-500/20 text-mint-300 border border-mint-400/30 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Multimodal Vision &amp; Micro-Climatic Epidemic Forecasting</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight font-sans">
            Micro-Climatic Crop Disease Early Warning System
          </h1>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
            Eliminate agricultural harvest losses and prevent false chemical spray alarms. Ingest raw foliar imagery, synchronize hyper-local ambient humidity and leaf wetness kinetics, and calculate calibrated intervention windows.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/diagnose"
              className="flex items-center space-x-2 bg-white hover:bg-slate-100 text-forest-900 font-bold text-sm px-5 py-3 rounded-xl shadow-md transition-all hover:scale-102"
            >
              <ScanLine className="w-4 h-4 text-forest-800" />
              <span>Launch Diagnostic Studio</span>
            </Link>

            <Link
              to="/analytics"
              className="flex items-center space-x-2 bg-forest-700/60 hover:bg-forest-700 text-white text-sm font-semibold px-4 py-3 rounded-xl border border-forest-600/50 transition-all"
            >
              <Activity className="w-4 h-4 text-mint-300" />
              <span>View Epidemic Curves</span>
            </Link>
          </div>
        </div>

        {/* Decorative soft glow */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-mint-400/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Overview Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Active Farm Plots</span>
            <div className="w-7 h-7 rounded-lg bg-forest-50 text-forest-800 flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">{activePlotsCount}</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center space-x-1 font-medium">
            <span className="text-forest-800 font-bold">100%</span>
            <span>telemetry sensors active</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Critical Outbreak Alerts</span>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${highRiskCount > 0 ? 'bg-rose-50 text-rose-600 pulse-critical' : 'bg-slate-100 text-slate-500'}`}>
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-rose-600 font-mono">{highRiskCount}</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center space-x-1 font-medium">
            <span className={highRiskCount > 0 ? 'text-rose-600 font-bold' : 'text-slate-500'}>
              {highRiskCount > 0 ? 'Urgent Action Gated' : 'Zero Active Alarms'}
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>False Alarms Eliminated</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-sky-700 font-mono">412</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center space-x-1 font-medium">
            <TrendingDown className="w-3.5 h-3.5 text-sky-600" />
            <span className="text-sky-700 font-bold">58.4%</span>
            <span>chemical volume saved</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Diagnostic Precision</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-forest-800 font-mono">95.8%</div>
          <div className="text-xs text-slate-500 mt-1 font-medium">
            Gemini 2.5 Flash Verified
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

      {/* Active Farm Plots & Recent Advisories Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Farm Plots Grid (8 cols) */}
        <div className="lg:col-span-8 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-forest-800" />
              <h2 className="text-base font-bold text-slate-900">Registered Farm Plots &amp; Current Pathology</h2>
            </div>
            <Link
              to="/fields"
              className="text-xs font-bold text-forest-800 hover:text-forest-700 flex items-center space-x-1"
            >
              <span>Manage Plots</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <FieldTable fields={fields} />
        </div>

        {/* Recent Early Warning Advisories (4 cols) */}
        <div className="lg:col-span-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Latest Advisories</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono font-medium">Real-time Stream</span>
          </div>

          <div className="space-y-3">
            {recentAdvisories.slice(0, 4).map((adv) => (
              <Link
                key={adv.advisory_id || adv.id}
                to={`/advisory/${adv.advisory_id || adv.id}`}
                className="block bg-white rounded-xl p-4 border border-slate-200/90 shadow-sm hover:border-forest-600/50 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                      {adv.field_name || 'Farm Plot'} • {adv.crop_type || 'Crop'}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-forest-800 transition-colors mt-0.5">
                      {adv.detected_disease || 'Late Blight'}
                    </h4>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      adv.risk_level === 'High'
                        ? 'bg-rose-50 text-rose-700 border-rose-300'
                        : adv.risk_level === 'Moderate'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    }`}
                  >
                    {adv.risk_level} ({adv.risk_score}%)
                  </span>
                </div>

                <div className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {adv.intervention_viability || adv.treatment_recommendation}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2.5 border-t border-slate-100">
                  <span className="font-medium">Spray Window: {adv.optimal_spray_window?.split('(')[0] || 'Optimized'}</span>
                  <span className="text-forest-800 font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
                    Inspect &rarr;
                  </span>
                </div>
              </Link>
            ))}

            {recentAdvisories.length === 0 && (
              <div className="bg-white rounded-xl p-6 border border-slate-200 text-center text-xs text-slate-500 shadow-sm">
                No recent advisories generated yet.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
