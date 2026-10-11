import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers, 
  MapPin, 
  Thermometer, 
  Droplets, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  ScanLine, 
  Compass, 
  Radio, 
  Activity 
} from 'lucide-react';

export default function IsometricFarmGrid({ fields = [] }) {
  const [hoveredPlot, setHoveredPlot] = useState(null);
  const [selectedPlotId, setSelectedPlotId] = useState(1);

  // Default plots if loading
  const plotList = fields.length > 0 ? fields : [
    {
      id: 1,
      name: 'North Valley Tomato Plot A',
      crop_type: 'Tomato',
      location: 'Salinas Valley, Sector 12',
      risk_level: 'High',
      risk_score: 87.5,
      temperature: 18.5,
      relative_humidity: 92.0,
      leaf_wetness_hours: 9.5
    },
    {
      id: 2,
      name: 'East Ridge Potato Sector 4',
      crop_type: 'Potato',
      location: 'Columbia Basin, Plot B',
      risk_level: 'Moderate',
      risk_score: 48.0,
      temperature: 24.0,
      relative_humidity: 68.0,
      leaf_wetness_hours: 3.5
    },
    {
      id: 3,
      name: 'Sunburst Wheat Field 2',
      crop_type: 'Wheat',
      location: 'Walla Walla Flats',
      risk_level: 'Low',
      risk_score: 12.0,
      temperature: 22.5,
      relative_humidity: 65.0,
      leaf_wetness_hours: 2.0
    },
    {
      id: 4,
      name: 'Valley Crest Grape Vineyard',
      crop_type: 'Grapes',
      location: 'Napa Valley Hillside',
      risk_level: 'High',
      risk_score: 72.0,
      temperature: 23.5,
      relative_humidity: 86.5,
      leaf_wetness_hours: 7.0
    }
  ];

  const selectedPlot = plotList.find(p => p.id === selectedPlotId) || plotList[0];

  const getStatusVisuals = (riskLevel, riskScore) => {
    if (riskLevel === 'High' || riskScore > 70) {
      return {
        zoneColor: 'bg-gradient-to-br from-rose-950/70 to-rose-900/40 border-rose-500/60 shadow-[0_0_30px_rgba(239,68,68,0.35)]',
        accentBorder: 'border-rose-500',
        badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/50',
        radarPulse: 'pulse-critical-3d bg-rose-500',
        textColor: 'text-rose-400',
        statusLabel: 'Critical Spore Risk'
      };
    }
    if (riskLevel === 'Moderate' || (riskScore >= 40 && riskScore <= 70)) {
      return {
        zoneColor: 'bg-gradient-to-br from-amber-950/60 to-amber-900/30 border-amber-500/60 shadow-[0_0_25px_rgba(245,158,11,0.25)]',
        accentBorder: 'border-amber-500',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
        radarPulse: 'bg-amber-400 shadow-[0_0_15px_#F59E0B]',
        textColor: 'text-amber-400',
        statusLabel: 'Moderate Vector'
      };
    }
    return {
      zoneColor: 'bg-gradient-to-br from-emerald-950/60 to-forest-900/40 border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.25)]',
      accentBorder: 'border-emerald-500',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
      radarPulse: 'pulse-mint-3d bg-emerald-400',
      textColor: 'text-emerald-400',
      statusLabel: 'Healthy / Monitored'
    };
  };

  return (
    <div className="glass-panel-3d rounded-2xl p-6 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-forest-800/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-900/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-white/10 gap-3 relative z-10">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-neon-mint">
            <Radio className="w-4 h-4 text-neon-mint animate-pulse" />
            <span>3D Zoned Geospatial Farm Telemetry</span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight mt-1">
            Canopy Epidemic Threat Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive visual grid displaying real-time pathogen sporulation pressure across monitored farm sectors
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-xs font-mono bg-black/40 px-3.5 py-1.5 rounded-xl border border-white/10">
          <span className="flex items-center space-x-1.5 text-emerald-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]"></span>
            <span>Healthy</span>
          </span>
          <span className="flex items-center space-x-1.5 text-amber-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B]"></span>
            <span>Moderate</span>
          </span>
          <span className="flex items-center space-x-1.5 text-rose-300">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#EF4444] animate-ping"></span>
            <span>Critical Spore</span>
          </span>
        </div>
      </div>

      {/* 3D Isometric Visual Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Left Side: 3D Visual Sector Cards (8 cols) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {plotList.map((plot) => {
            const visual = getStatusVisuals(plot.risk_level, plot.risk_score);
            const isSelected = selectedPlotId === plot.id;

            return (
              <div
                key={plot.id}
                onClick={() => setSelectedPlotId(plot.id)}
                onMouseEnter={() => setHoveredPlot(plot.id)}
                onMouseLeave={() => setHoveredPlot(null)}
                className={`relative rounded-xl p-5 border cursor-pointer transition-all duration-300 transform ${
                  visual.zoneColor
                } ${
                  isSelected 
                    ? 'scale-[1.02] ring-2 ring-neon-mint/60 border-neon-mint shadow-[0_0_35px_rgba(0,255,135,0.25)]' 
                    : 'hover:scale-[1.01]'
                }`}
              >
                {/* Sector Radar Beacon */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className={`w-3 h-3 rounded-full ${visual.radarPulse}`}></span>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300">
                      Sector 0{plot.id} • {plot.crop_type}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${visual.badgeBg}`}>
                    {plot.risk_level || 'Safe'} ({plot.risk_score || 15}%)
                  </span>
                </div>

                <div className="font-bold text-white text-base leading-snug line-clamp-1 mb-1">
                  {plot.name}
                </div>
                <div className="text-xs text-slate-400 flex items-center space-x-1 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{plot.location}</span>
                </div>

                {/* Telemetry Sensor Readout Bar */}
                <div className="grid grid-cols-3 gap-2 bg-black/40 rounded-lg p-2.5 border border-white/5 text-center font-mono">
                  <div>
                    <div className="text-[10px] text-slate-400 flex items-center justify-center space-x-1">
                      <Thermometer className="w-3 h-3 text-amber-400" />
                      <span>Temp</span>
                    </div>
                    <div className="text-xs font-bold text-slate-200 mt-0.5">{plot.temperature || 21}°C</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 flex items-center justify-center space-x-1">
                      <Droplets className="w-3 h-3 text-cyan-400" />
                      <span>RH</span>
                    </div>
                    <div className="text-xs font-bold text-cyan-300 mt-0.5">{plot.relative_humidity || 75}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Dew</div>
                    <div className="text-xs font-bold text-teal-300 mt-0.5">{plot.leaf_wetness_hours || 4}h</div>
                  </div>
                </div>

                {/* 3D Corner Accent Light */}
                <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden rounded-tr-xl pointer-events-none">
                  <div className="w-16 h-16 -mr-8 -mt-8 bg-white/10 rotate-45 transform"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Floating Holographic Plot Detail HUD (4 cols) */}
        <div className="lg:col-span-4 glass-subpanel rounded-xl p-5 border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-[11px] font-mono uppercase text-neon-mint font-bold tracking-wider">
                Telemetry Station HUD
              </span>
              <span className="w-2 h-2 rounded-full bg-neon-mint animate-pulse"></span>
            </div>

            <div className="mt-3 space-y-2">
              <h3 className="text-lg font-bold text-white font-sans">
                {selectedPlot.name}
              </h3>
              <div className="text-xs text-slate-400 flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{selectedPlot.location}</span>
              </div>
            </div>

            {/* Pathology Status Card */}
            <div className="mt-4 p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Current Diagnosis:</span>
                <span className="font-bold text-white">
                  {selectedPlot.latest_disease || 'Late Blight (Phytophthora infestans)'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Sporulation Probability:</span>
                <span className="font-mono font-bold text-rose-400">
                  {selectedPlot.risk_score || 87.5}%
                </span>
              </div>

              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    selectedPlot.risk_score > 70 
                      ? 'bg-rose-500 shadow-[0_0_10px_#EF4444]' 
                      : selectedPlot.risk_score > 40 
                      ? 'bg-amber-500' 
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${selectedPlot.risk_score || 70}%` }}
                />
              </div>
            </div>

            {/* Environmental Vector Sensors */}
            <div className="mt-4 space-y-1.5 text-xs text-slate-300 font-mono">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Canopy Temp:</span>
                <span className="font-bold text-amber-400">{selectedPlot.temperature || 18.5}°C</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Relative Humidity:</span>
                <span className="font-bold text-cyan-400">{selectedPlot.relative_humidity || 92}% RH</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Continuous Dew:</span>
                <span className="font-bold text-teal-400">{selectedPlot.leaf_wetness_hours || 9.5} Hours</span>
              </div>
            </div>
          </div>

          {/* Quick Action Button to scan this plot */}
          <Link
            to={`/diagnose?fieldId=${selectedPlot.id}&cropType=${encodeURIComponent(selectedPlot.crop_type)}`}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-forest-800 to-forest-700 hover:from-forest-700 hover:to-forest-600 border border-neon-mint/30 text-white font-bold text-xs shadow-[0_0_20px_rgba(0,255,135,0.2)] flex items-center justify-center space-x-2 transition-all hover:scale-102"
          >
            <ScanLine className="w-4 h-4 text-neon-mint" />
            <span>Launch Laser Diagnosis for Plot</span>
          </Link>
        </div>

      </div>

    </div>
  );
}
