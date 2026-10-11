import React from 'react';
import { Thermometer, Droplets, Wind, Clock, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

export default function WeatherSensorBadge({
  temperature = 21.5,
  relativeHumidity = 85.0,
  leafWetnessHours = 6.5,
  windSpeed = 5.2,
  compact = false
}) {
  const isHighRisk = relativeHumidity > 85.0 && leafWetnessHours >= 6.0;
  const isModerateRisk = (relativeHumidity >= 70.0 && relativeHumidity <= 85.0) || (leafWetnessHours >= 4.0 && leafWetnessHours < 6.0);
  const isFalseAlarmSuppressed = relativeHumidity < 68.0 && leafWetnessHours < 3.5;

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
        <span className="flex items-center space-x-1.5 bg-slate-100/80 px-2.5 py-1 rounded-md border border-slate-200 text-slate-700">
          <Thermometer className="w-3.5 h-3.5 text-amber-600" />
          <span>{temperature}°C</span>
        </span>
        <span className="flex items-center space-x-1.5 bg-slate-100/80 px-2.5 py-1 rounded-md border border-slate-200 text-slate-700">
          <Droplets className="w-3.5 h-3.5 text-sky-600" />
          <span>{relativeHumidity}% RH</span>
        </span>
        <span className="flex items-center space-x-1.5 bg-slate-100/80 px-2.5 py-1 rounded-md border border-slate-200 text-slate-700">
          <Clock className="w-3.5 h-3.5 text-teal-600" />
          <span>{leafWetnessHours}h Wet</span>
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-150 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-forest-50 text-forest-800 flex items-center justify-center border border-forest-200">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Hyper-Local Micro-Climatic Telemetry</h4>
            <p className="text-[11px] text-slate-500">Real-time canopy weather vectors streaming from field sensors</p>
          </div>
        </div>

        {/* Dynamic Risk Matrix Badge */}
        <div>
          {isHighRisk ? (
            <span className="inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-300 shadow-sm pulse-critical">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Critical Spore Risk (RH &gt; 85% &amp; LW &gt; 6h)</span>
            </span>
          ) : isFalseAlarmSuppressed ? (
            <span className="inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe Window: False Spray Alarm Suppressed</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 shadow-sm">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Moderate Humidity Vector</span>
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        
        {/* Temperature Tile */}
        <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span className="flex items-center space-x-1.5">
              <Thermometer className="w-4 h-4 text-amber-500" />
              <span>Temperature</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Ambient</span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">{temperature}°C</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Optimum: 15°C – 24°C</div>
        </div>

        {/* Relative Humidity Tile */}
        <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 hover:border-sky-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span className="flex items-center space-x-1.5">
              <Droplets className="w-4 h-4 text-sky-500" />
              <span>Relative Humidity</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">RH</span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">{relativeHumidity}%</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Critical trigger: &gt; 85%</div>
        </div>

        {/* Leaf Wetness Tile */}
        <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 hover:border-teal-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>Leaf Wetness</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Dew</span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">{leafWetnessHours} hrs</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Sporulation: &gt; 6.0 hrs</div>
        </div>

        {/* Wind Speed Tile */}
        <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span className="flex items-center space-x-1.5">
              <Wind className="w-4 h-4 text-indigo-500" />
              <span>Wind Speed</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Velocity</span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">{windSpeed} km/h</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Spray viable: &lt; 10 km/h</div>
        </div>

      </div>
    </div>
  );
}
