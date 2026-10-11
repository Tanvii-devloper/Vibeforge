import React from 'react';
import { Thermometer, Droplets, Wind, Clock, AlertTriangle, ShieldCheck, Activity, Radio } from 'lucide-react';

export default function WeatherSensorBadge({
  temperature = 21.5,
  relativeHumidity = 85.0,
  leafWetnessHours = 6.5,
  windSpeed = 5.2,
  regionName = '',
  regionHub = '',
  regionBadge = '',
  compact = false
}) {
  const isHighRisk = relativeHumidity > 85.0 && leafWetnessHours >= 6.0;
  const isModerateRisk = (relativeHumidity >= 70.0 && relativeHumidity <= 85.0) || (leafWetnessHours >= 4.0 && leafWetnessHours < 6.0);
  const isFalseAlarmSuppressed = relativeHumidity < 68.0 && leafWetnessHours < 3.5;

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
        {regionName && (
          <span className="bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40 text-emerald-300 font-bold">
            {regionName}
          </span>
        )}
        <span className="flex items-center space-x-1.5 bg-black/40 px-2.5 py-1 rounded-lg border border-white/10 text-slate-200">
          <Thermometer className="w-3.5 h-3.5 text-amber-400" />
          <span>{temperature}°C</span>
        </span>
        <span className="flex items-center space-x-1.5 bg-black/40 px-2.5 py-1 rounded-lg border border-white/10 text-cyan-300">
          <Droplets className="w-3.5 h-3.5 text-cyan-400" />
          <span>{relativeHumidity}% RH</span>
        </span>
        <span className="flex items-center space-x-1.5 bg-black/40 px-2.5 py-1 rounded-lg border border-white/10 text-teal-300">
          <Clock className="w-3.5 h-3.5 text-teal-400" />
          <span>{leafWetnessHours}h Dew</span>
        </span>
      </div>
    );
  }

  return (
    <div className="glass-panel-3d rounded-2xl p-6 relative overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute top-0 right-1/4 w-60 h-60 bg-forest-700/20 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-white/10 gap-3 relative z-10">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-forest-900/80 text-neon-mint flex items-center justify-center border border-neon-mint/30 shadow-[0_0_15px_rgba(0,255,135,0.2)]">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                Hyper-Local Micro-Climatic Telemetry HUD
              </h4>
              {regionName && (
                <span className="text-[10px] bg-forest-800/80 text-neon-mint border border-neon-mint/40 px-2 py-0.5 rounded-md font-mono font-bold">
                  {regionName}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              {regionHub ? `Active Hub: ${regionHub} · Canopy nodes streaming ambient vectors` : 'Canopy sensor nodes streaming ambient vectors in real time'}
            </p>
          </div>
        </div>

        {/* Dynamic Risk Matrix Badge */}
        <div>
          {isHighRisk ? (
            <span className="inline-flex items-center space-x-2 text-xs font-bold px-3.5 py-1.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/60 shadow-[0_0_20px_rgba(239,68,68,0.4)] pulse-critical-3d font-mono">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Critical Spore Vector (RH &gt; 85% &amp; Dew &gt; 6h)</span>
            </span>
          ) : isFalseAlarmSuppressed ? (
            <span className="inline-flex items-center space-x-2 text-xs font-bold px-3.5 py-1.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)] font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-neon-mint" />
              <span>Safe Window: False Spray Alarm Suppressed</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-2 text-xs font-bold px-3.5 py-1.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.3)] font-mono">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Moderate Humidity Vector</span>
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
        
        {/* Temperature Tile */}
        <div className="glass-subpanel p-4 rounded-xl border border-white/5 hover:border-amber-400/40 transition-all group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1 font-mono">
            <span className="flex items-center space-x-1.5">
              <Thermometer className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Temperature</span>
            </span>
            <span className="text-[10px] text-slate-500">CANOPY</span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-white mt-1 group-hover:text-amber-300 transition-colors">
            {temperature}°C
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Optimum: 15°C – 24°C</div>
        </div>

        {/* Relative Humidity Tile */}
        <div className="glass-subpanel p-4 rounded-xl border border-white/5 hover:border-cyan-400/40 transition-all group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1 font-mono">
            <span className="flex items-center space-x-1.5">
              <Droplets className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Humidity (RH)</span>
            </span>
            <span className="text-[10px] text-slate-500">ATMOS</span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-cyan-300 mt-1 text-glow-cyan">
            {relativeHumidity}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Critical threshold: &gt; 85%</div>
        </div>

        {/* Leaf Wetness Tile */}
        <div className="glass-subpanel p-4 rounded-xl border border-white/5 hover:border-teal-400/40 transition-all group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1 font-mono">
            <span className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
              <span>Leaf Dew</span>
            </span>
            <span className="text-[10px] text-slate-500">FOLIAR</span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-teal-300 mt-1">
            {leafWetnessHours} hrs
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Sporulation trigger: &gt; 6.0 hrs</div>
        </div>

        {/* Wind Speed Tile */}
        <div className="glass-subpanel p-4 rounded-xl border border-white/5 hover:border-indigo-400/40 transition-all group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1 font-mono">
            <span className="flex items-center space-x-1.5">
              <Wind className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span>Wind Velocity</span>
            </span>
            <span className="text-[10px] text-slate-500">DRIFT</span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-indigo-300 mt-1">
            {windSpeed} km/h
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Spray viable: &lt; 10 km/h</div>
        </div>

      </div>
    </div>
  );
}
