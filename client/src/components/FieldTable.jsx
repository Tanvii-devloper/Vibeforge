import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Trash2, 
  ScanLine, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  Thermometer, 
  Droplets 
} from 'lucide-react';

export default function FieldTable({ fields = [], onDelete }) {
  if (!fields || fields.length === 0) {
    return (
      <div className="glass-panel-3d rounded-2xl p-12 text-center">
        <div className="w-12 h-12 rounded-xl bg-forest-900/80 text-neon-mint border border-neon-mint/30 flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px_rgba(0,255,135,0.2)]">
          <MapPin className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-white">No Farm Plots Registered</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Register agricultural field plots to track micro-climates, soil pathology, and real-time disease spread risks.
        </p>
      </div>
    );
  }

  const getRiskPill = (level, score) => {
    if (level === 'High' || score > 70) {
      return (
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-950/80 text-rose-300 border border-rose-500/60 shadow-[0_0_15px_rgba(239,68,68,0.35)] pulse-critical-3d font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span>Critical ({score || 85}%)</span>
        </span>
      );
    }
    if (level === 'Moderate' || (score >= 40 && score <= 70)) {
      return (
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-950/80 text-amber-300 border border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.25)] font-mono">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Moderate ({score || 50}%)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.25)] font-mono">
        <ShieldCheck className="w-3.5 h-3.5 text-neon-mint" />
        <span>Safe ({score || 15}%)</span>
      </span>
    );
  };

  const getCropBadgeColor = (crop) => {
    const c = (crop || '').toLowerCase();
    if (c.includes('tomato')) return 'bg-rose-950/60 text-rose-300 border-rose-500/40';
    if (c.includes('potato')) return 'bg-amber-950/60 text-amber-300 border-amber-500/40';
    if (c.includes('wheat') || c.includes('cereal')) return 'bg-yellow-950/60 text-yellow-300 border-yellow-500/40';
    if (c.includes('grape')) return 'bg-purple-950/60 text-purple-300 border-purple-500/40';
    return 'bg-forest-900/60 text-emerald-300 border-emerald-500/40';
  };

  return (
    <div className="glass-panel-3d rounded-2xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-black/50 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-white/10">
            <tr>
              <th className="py-3.5 px-5">Plot Sector &amp; Coordinates</th>
              <th className="py-3.5 px-4">Crop Category</th>
              <th className="py-3.5 px-4">Latest Pathology Scan</th>
              <th className="py-3.5 px-4">Canopy Micro-Climate</th>
              <th className="py-3.5 px-4">Sporulation Threat</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {fields.map((field) => (
              <tr 
                key={field.id}
                className="hover:bg-white/[0.04] transition-colors group"
              >
                <td className="py-4 px-5">
                  <div className="font-bold text-white group-hover:text-neon-mint transition-colors">
                    {field.name}
                  </div>
                  <div className="flex items-center space-x-1.5 text-xs text-slate-400 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{field.location}</span>
                    {field.latitude && field.longitude && (
                      <span className="text-[10px] text-slate-500 font-mono ml-1">
                        ({Number(field.latitude).toFixed(2)}, {Number(field.longitude).toFixed(2)})
                      </span>
                    )}
                  </div>
                </td>

                <td className="py-4 px-4">
                  <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold border ${getCropBadgeColor(field.crop_type)}`}>
                    {field.crop_type}
                  </span>
                </td>

                <td className="py-4 px-4">
                  <div className="font-semibold text-slate-200">
                    {field.latest_disease || 'Healthy / Untested'}
                  </div>
                  {field.diagnostic_confidence && (
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Confidence: {field.diagnostic_confidence}%
                    </div>
                  )}
                </td>

                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2.5 text-xs font-mono">
                    <span className="flex items-center text-amber-300">
                      <Thermometer className="w-3.5 h-3.5 text-amber-400 mr-1" />
                      {field.temperature || 21}°C
                    </span>
                    <span className="flex items-center text-cyan-300">
                      <Droplets className="w-3.5 h-3.5 text-cyan-400 mr-1" />
                      {field.relative_humidity || 75}%
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Dew: {field.leaf_wetness_hours || 4}h
                  </div>
                </td>

                <td className="py-4 px-4">
                  {getRiskPill(field.risk_level, field.risk_score)}
                </td>

                <td className="py-4 px-5 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      to={`/diagnose?fieldId=${field.id}&cropType=${encodeURIComponent(field.crop_type)}`}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-forest-800/80 hover:bg-forest-700 text-neon-mint hover:text-white border border-neon-mint/30 transition-all font-mono text-xs shadow-sm"
                      title="Run Diagnostic Scan"
                    >
                      <ScanLine className="w-3.5 h-3.5" />
                      <span>Scan</span>
                    </Link>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(field.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                        title="Delete Field Plot"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
