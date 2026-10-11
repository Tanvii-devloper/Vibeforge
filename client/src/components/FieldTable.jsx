import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Trash2, 
  ExternalLink, 
  ScanLine, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert,
  Thermometer,
  Droplets,
  ChevronRight
} from 'lucide-react';

export default function FieldTable({ fields = [], onDelete }) {
  if (!fields || fields.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/90 p-12 text-center shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <MapPin className="w-6 h-6 text-forest-700" />
        </div>
        <h3 className="text-base font-bold text-slate-900">No Farm Plots Registered</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Register your agricultural field plots to track micro-climates, soil pathology, and real-time disease spread risks.
        </p>
      </div>
    );
  }

  const getRiskPill = (level, score) => {
    if (level === 'High' || score > 70) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-300 shadow-sm pulse-critical">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping"></span>
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          <span>High ({score || 85}%)</span>
        </span>
      );
    }
    if (level === 'Moderate' || (score >= 40 && score <= 70)) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-sm">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>Moderate ({score || 50}%)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-sm">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Low ({score || 15}%)</span>
      </span>
    );
  };

  const getCropBadgeColor = (crop) => {
    const c = (crop || '').toLowerCase();
    if (c.includes('tomato')) return 'bg-rose-50 text-rose-800 border-rose-200';
    if (c.includes('potato')) return 'bg-amber-50 text-amber-800 border-amber-200';
    if (c.includes('wheat') || c.includes('cereal')) return 'bg-yellow-50 text-yellow-800 border-yellow-200';
    if (c.includes('grape')) return 'bg-purple-50 text-purple-800 border-purple-200';
    return 'bg-forest-50 text-forest-800 border-forest-200';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-5">Plot Name &amp; Coordinates</th>
              <th className="py-3.5 px-4">Crop Category</th>
              <th className="py-3.5 px-4">Latest Pathology Scan</th>
              <th className="py-3.5 px-4">Canopy Micro-Climate</th>
              <th className="py-3.5 px-4">Sporulation Risk</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150">
            {fields.map((field) => (
              <tr 
                key={field.id}
                className="hover:bg-slate-50/80 transition-colors group"
              >
                <td className="py-4 px-5">
                  <div className="font-bold text-slate-900 group-hover:text-forest-800 transition-colors">
                    {field.name}
                  </div>
                  <div className="flex items-center space-x-1.5 text-xs text-slate-500 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{field.location}</span>
                    {field.latitude && field.longitude && (
                      <span className="text-[10px] text-slate-400 font-mono ml-1">
                        ({Number(field.latitude).toFixed(2)}, {Number(field.longitude).toFixed(2)})
                      </span>
                    )}
                  </div>
                </td>

                <td className="py-4 px-4">
                  <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-bold border ${getCropBadgeColor(field.crop_type)}`}>
                    {field.crop_type}
                  </span>
                </td>

                <td className="py-4 px-4">
                  <div className="font-semibold text-slate-900">
                    {field.latest_disease || 'Healthy / Untested'}
                  </div>
                  {field.diagnostic_confidence && (
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Confidence: {field.diagnostic_confidence}%
                    </div>
                  )}
                </td>

                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2 text-xs font-mono font-medium">
                    <span className="flex items-center text-slate-800">
                      <Thermometer className="w-3.5 h-3.5 text-amber-500 mr-1" />
                      {field.temperature || 21}°C
                    </span>
                    <span className="flex items-center text-slate-800">
                      <Droplets className="w-3.5 h-3.5 text-sky-500 mr-1" />
                      {field.relative_humidity || 75}%
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Leaf Wetness: {field.leaf_wetness_hours || 4}h
                  </div>
                </td>

                <td className="py-4 px-4">
                  {getRiskPill(field.risk_level, field.risk_score)}
                </td>

                <td className="py-4 px-5 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      to={`/diagnose?fieldId=${field.id}&cropType=${encodeURIComponent(field.crop_type)}`}
                      className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-forest-50 text-forest-800 hover:bg-forest-800 hover:text-white border border-forest-200 transition-all font-semibold text-xs shadow-sm"
                      title="Run Diagnostic Scan"
                    >
                      <ScanLine className="w-3.5 h-3.5" />
                      <span>Diagnose</span>
                    </Link>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(field.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
