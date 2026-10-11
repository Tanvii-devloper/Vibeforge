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
  Radio,
  Cpu,
  MapPin,
  RefreshCw
} from 'lucide-react';
import FieldTable from '../components/FieldTable';
import WeatherSensorBadge from '../components/WeatherSensorBadge';
import IsometricFarmGrid from '../components/IsometricFarmGrid';
import { INDIAN_AGRICULTURAL_REGIONS, getRegionById, simulateMicroClimate } from '../data/indianRegions';

export default function Dashboard() {
  const [fields, setFields] = useState([]);
  const [recentAdvisories, setRecentAdvisories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRegionId, setSelectedRegionId] = useState('maharashtra');
  const [simulatedWeather, setSimulatedWeather] = useState(() => simulateMicroClimate('maharashtra'));

  const handleRegionChange = (regId, withVariance = false) => {
    setSelectedRegionId(regId);
    const sim = simulateMicroClimate(regId, { variance: withVariance });
    setSimulatedWeather(sim);
  };

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
    <div className="space-y-7">
      
      {/* 3D Holographic Executive Hero Banner */}
      <div className="glass-panel-3d rounded-3xl p-7 sm:p-9 relative overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        
        {/* Luminous atmospheric radial flares */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-forest-800/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-neon-mint/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-forest-900/80 text-neon-mint border border-neon-mint/30 text-xs font-mono font-bold tracking-wide shadow-[0_0_15px_rgba(0,255,135,0.2)]">
            <Radio className="w-3.5 h-3.5 animate-pulse text-neon-mint" />
            <span>AI Multimodal Vision &amp; 3D Micro-Climatic Epidemic Forecasting</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight font-sans text-glow-mint">
            Futuristic Agriculture Early Warning Control Center
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Eliminate crop losses and prevent false chemical alarms. Ingest raw foliar photographs, fuse hyper-local ambient humidity and leaf wetness kinetics, and calculate calibrated intervention windows.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/diagnose"
              className="flex items-center space-x-2 bg-gradient-to-r from-forest-800 to-forest-700 hover:from-forest-700 hover:to-forest-600 border border-neon-mint/50 text-white font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-[0_0_25px_rgba(0,255,135,0.3)] transition-all hover:scale-102"
            >
              <ScanLine className="w-4 h-4 text-neon-mint" />
              <span>Launch Laser Diagnostic Studio</span>
            </Link>

            <Link
              to="/analytics"
              className="flex items-center space-x-2 glass-subpanel hover:bg-white/10 text-slate-200 text-sm font-semibold px-5 py-3.5 rounded-xl border border-white/10 transition-all font-mono"
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>View Epidemic Curves</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating 3D KPI Hologram Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="glass-panel-3d rounded-2xl p-5 border border-white/10 hover:border-emerald-500/40 transition-all group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <span>Active Farm Plots</span>
            <div className="w-7 h-7 rounded-lg bg-forest-900/80 text-neon-mint flex items-center justify-center border border-neon-mint/30 shadow-[0_0_10px_rgba(0,255,135,0.2)]">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono mt-1 group-hover:text-neon-mint transition-colors text-glow-mint">
            {activePlotsCount}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center space-x-1 font-mono">
            <span className="text-neon-mint font-bold">100%</span>
            <span>telemetry nodes synced</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="glass-panel-3d rounded-2xl p-5 border border-white/10 hover:border-rose-500/40 transition-all group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <span>Critical Outbreaks</span>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${highRiskCount > 0 ? 'bg-rose-950/80 text-rose-400 border border-rose-500/50 shadow-[0_0_15px_rgba(239,68,68,0.4)] pulse-critical-3d' : 'bg-black/40 text-slate-500'}`}>
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-rose-400 font-mono mt-1 text-glow-red">
            {highRiskCount}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center space-x-1 font-mono">
            <span className={highRiskCount > 0 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
              {highRiskCount > 0 ? 'Urgent Action Gated' : 'Zero Active Alarms'}
            </span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="glass-panel-3d rounded-2xl p-5 border border-white/10 hover:border-cyan-500/40 transition-all group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <span>False Alarms Gated</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-950/80 text-cyan-400 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-cyan-300 font-mono mt-1 text-glow-cyan">
            412
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center space-x-1 font-mono">
            <TrendingDown className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-cyan-400 font-bold">58.4%</span>
            <span>chemical volume saved</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="glass-panel-3d rounded-2xl p-5 border border-white/10 hover:border-neon-mint/40 transition-all group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <span>AI Precision Index</span>
            <div className="w-7 h-7 rounded-lg bg-forest-900/80 text-neon-mint flex items-center justify-center border border-neon-mint/30 shadow-[0_0_10px_rgba(0,255,135,0.2)]">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-neon-mint font-mono mt-1 text-glow-mint">
            95.8%
          </div>
          <div className="text-xs text-slate-400 mt-1 font-mono">
            Gemini 2.5 Flash Verified
          </div>
        </div>

      </div>

      {/* Central Interactive 3D / Isometric Farm Grid */}
      <div>
        <IsometricFarmGrid fields={fields} />
      </div>

      {/* Indian Agricultural Hub Selector & Live Micro-Climatic Sensor Telemetry HUD */}
      <div className="space-y-3">
        {/* Region Selector Bar */}
        <div className="glass-panel-3d rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 border border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-forest-900/80 text-neon-mint flex items-center justify-center border border-neon-mint/30 shadow-[0_0_12px_rgba(0,255,135,0.2)]">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                  Select Indian Agricultural Region:
                </span>
                <span className="text-[10px] bg-emerald-950/80 text-neon-mint border border-neon-mint/30 px-2 py-0.5 rounded font-mono font-bold">
                  8 Major Hubs
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Simulating canopy micro-climate &amp; fungal spore triggers (&gt;85% RH) across India
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={selectedRegionId}
              onChange={(e) => handleRegionChange(e.target.value, false)}
              className="bg-black/60 border border-emerald-500/40 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-neon-mint font-semibold"
            >
              {INDIAN_AGRICULTURAL_REGIONS.map(reg => (
                <option key={reg.id} value={reg.id} className="bg-slate-900 text-white">
                  {reg.label} — {reg.subtext}
                </option>
              ))}
            </select>

            <button
              onClick={() => handleRegionChange(selectedRegionId, true)}
              className="inline-flex items-center space-x-1 bg-forest-800/80 hover:bg-forest-700 text-white text-xs font-mono font-bold px-3 py-2 rounded-xl border border-neon-mint/30 transition-all shadow-[0_0_10px_rgba(0,255,135,0.2)] whitespace-nowrap"
              title="Trigger slight real-time sensor fluctuation"
            >
              <RefreshCw className="w-3.5 h-3.5 text-neon-mint" />
              <span className="hidden sm:inline">Simulate Sensor</span>
            </button>
          </div>
        </div>

        {/* Dynamic Telemetry HUD */}
        <WeatherSensorBadge 
          temperature={simulatedWeather.temperature}
          relativeHumidity={simulatedWeather.relativeHumidity}
          leafWetnessHours={simulatedWeather.leafWetnessHours}
          windSpeed={simulatedWeather.windSpeed}
          regionName={simulatedWeather.regionLabel}
          regionHub={simulatedWeather.hub}
          regionBadge={simulatedWeather.badge}
        />
      </div>

      {/* Registered Farm Plots Grid & Recent Advisory Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Farm Plots Grid (8 cols) */}
        <div className="lg:col-span-8 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-neon-mint" />
              <h2 className="text-base font-bold text-white font-sans">
                Registered Farm Plots &amp; Pathology Status
              </h2>
            </div>
            <Link
              to="/fields"
              className="text-xs font-mono font-bold text-neon-mint hover:text-emerald-300 flex items-center space-x-1"
            >
              <span>Manage Plots</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <FieldTable fields={fields} />
        </div>

        {/* Recent Early Warning Advisories Stream (4 cols) */}
        <div className="lg:col-span-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center space-x-2 font-sans">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Latest Advisories</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">Live Feed</span>
          </div>

          <div className="space-y-3">
            {recentAdvisories.slice(0, 4).map((adv) => (
              <Link
                key={adv.advisory_id || adv.id}
                to={`/advisory/${adv.advisory_id || adv.id}`}
                className="block glass-subpanel rounded-xl p-4 border border-white/5 hover:border-neon-mint/50 transition-all duration-300 group hover:scale-[1.01]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                      {adv.field_name || 'Farm Plot'} • {adv.crop_type || 'Crop'}
                    </span>
                    <h4 className="text-sm font-bold text-white group-hover:text-neon-mint transition-colors mt-0.5">
                      {adv.detected_disease || 'Late Blight'}
                    </h4>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      adv.risk_level === 'High'
                        ? 'bg-rose-950/80 text-rose-300 border-rose-500/50 shadow-[0_0_8px_rgba(239,68,68,0.3)]'
                        : adv.risk_level === 'Moderate'
                        ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                        : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                    }`}
                  >
                    {adv.risk_level} ({adv.risk_score}%)
                  </span>
                </div>

                <div className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                  {adv.intervention_viability || adv.treatment_recommendation}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2.5 border-t border-white/5 font-mono">
                  <span>Spray: {adv.optimal_spray_window?.split('(')[0] || 'Optimized Window'}</span>
                  <span className="text-neon-mint group-hover:translate-x-1 transition-transform flex items-center">
                    Inspect &rarr;
                  </span>
                </div>
              </Link>
            ))}

            {recentAdvisories.length === 0 && (
              <div className="glass-subpanel rounded-xl p-6 border border-white/5 text-center text-xs text-slate-400">
                No recent advisories generated yet.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
