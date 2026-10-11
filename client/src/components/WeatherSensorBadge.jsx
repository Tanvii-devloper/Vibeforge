import React from 'react';
import { Thermometer, Droplets, Wind, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function WeatherSensorBadge({
  temperature = 21.5,
  relativeHumidity = 85.0,
  leafWetnessHours = 6.5,
  windSpeed = 5.2,
  compact = false
}) {
  const isHighRisk = relativeHumidity > 85.0 && leafWetnessHours >= 6.0;
  const isFalseAlarmSuppressed = relativeHumidity < 68.0 && leafWetnessHours < 3.5;

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-300">
        <span className="flex items-center space-x-1 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
          <Thermometer className="w-3.5 h-3.5 text-amber-400" />
          <span>{temperature}°C</span>
        </span>
        <span className="flex items-center space-x-1 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
          <Droplets className="w-3.5 h-3.5 text-cyan-400" />
          <span>{relativeHumidity}% RH</span>
        </span>
        <span className="flex items-center space-x-1 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>{leafWetnessHours}h Wetness</span>
        </span>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 shadow-md">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Micro-Climatic Sensor Telemetry</h4>
        </div>
        {isHighRisk ? (
          <span className="inline-flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
            <AlertCircle className="w-3 h-3" />
            <span>Sporulation Trigger Active</span>
          </span>
        ) : isFalseAlarmSuppressed ? (
          <span className="inline-flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>Alarm Suppression (Dry)</span>
          </span>
        ) : (
          <span className="inline-flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <span>Moderate Vector</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-750">
          <div className="flex items-center space-x-1.5 text-slate-400 text-xs mb-1">
            <Thermometer className="w-4 h-4 text-amber-400" />
            <span>Temperature</span>
          </div>
          <div className="text-xl font-bold font-mono text-white">{temperature}°C</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Optimal range: 15-24°C</div>
        </div>

        <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-750">
          <div className="flex items-center space-x-1.5 text-slate-400 text-xs mb-1">
            <Droplets className="w-4 h-4 text-cyan-400" />
            <span>Relative Humidity</span>
          </div>
          <div className="text-xl font-bold font-mono text-white">{relativeHumidity}%</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Trigger threshold: &gt;85%</div>
        </div>

        <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-750">
          <div className="flex items-center space-x-1.5 text-slate-400 text-xs mb-1">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>Leaf Wetness</span>
          </div>
          <div className="text-xl font-bold font-mono text-white">{leafWetnessHours} hrs</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Critical threshold: &gt;6 hrs</div>
        </div>

        <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-750">
          <div className="flex items-center space-x-1.5 text-slate-400 text-xs mb-1">
            <Wind className="w-4 h-4 text-teal-400" />
            <span>Wind Speed</span>
          </div>
          <div className="text-xl font-bold font-mono text-white">{windSpeed} km/h</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Spray safe: &lt;10 km/h</div>
        </div>
      </div>
    </div>
  );
}
