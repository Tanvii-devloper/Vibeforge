import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Droplet, 
  Beaker, 
  Wind,
  Calendar
} from 'lucide-react';

export default function AdvisoryCard({ advisory = {}, diagnostic = {} }) {
  const {
    riskScore = 0,
    riskLevel = 'Low',
    interventionViability = 'Monitor Only',
    treatmentRecommendation = 'No immediate action required.',
    optimalSprayWindow = 'N/A'
  } = advisory;

  const isHigh = riskLevel === 'High' || riskScore > 70;
  const isMod = riskLevel === 'Moderate' || (riskScore >= 40 && riskScore <= 70);

  const getRiskBadge = () => {
    if (isHigh) {
      return (
        <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-300 text-xs font-bold uppercase tracking-wider shadow-sm pulse-critical">
          <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>High Risk Spore Pressure ({riskScore}%)</span>
        </span>
      );
    }
    if (isMod) {
      return (
        <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold uppercase tracking-wider shadow-sm">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Moderate Risk ({riskScore}%)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold uppercase tracking-wider shadow-sm">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Low Risk / Safe Window ({riskScore}%)</span>
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-sm relative overflow-hidden">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-150">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-forest-800 font-bold">
            Agronomic Decision &amp; Pathology Protocol
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            {interventionViability}
          </h2>
        </div>
        <div>{getRiskBadge()}</div>
      </div>

      {/* Risk meter bar */}
      <div className="my-5">
        <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
          <span>Sporulation Probability Index</span>
          <span className="font-mono font-bold text-slate-900">{riskScore}%</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              !isMod && !isHigh
                ? 'bg-gradient-to-r from-emerald-500 to-green-600' 
                : isMod 
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500' 
                : 'bg-gradient-to-r from-orange-500 to-rose-600'
            }`}
            style={{ width: `${Math.min(100, Math.max(5, riskScore))}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-500 mt-1.5 font-mono font-medium">
          <span>0% (Safe)</span>
          <span>40% (Threshold Gate)</span>
          <span>70% (Alarm Critical)</span>
          <span>100%</span>
        </div>
      </div>

      {/* Optimal Spray Window Banner */}
      <div className="bg-forest-50/80 rounded-xl p-4 border border-forest-200 mb-5">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-forest-800 text-mint-300 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-forest-900">
              Optimal Treatment Window &amp; Spray Timing
            </div>
            <div className="text-sm font-bold text-forest-800 mt-0.5 font-mono">
              {optimalSprayWindow}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Threshold-gated by ambient wind velocity (&lt;10 km/h) and foliar drying kinetics to prevent wash-off and non-target drift.
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Treatment Protocol */}
      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center space-x-2">
            <Beaker className="w-4 h-4 text-forest-700" />
            <span>Pathology-Calibrated Prescriptive Advisory</span>
          </h4>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-sm leading-relaxed text-slate-800 font-medium">
            {treatmentRecommendation}
          </div>
        </div>

        {/* Safety & Pre-Harvest Intervals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs">
            <div className="font-bold text-slate-800 mb-1 flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-sky-600" />
              <span>Pre-Harvest Interval (PHI)</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {riskLevel === 'High' ? '14 Days strictly observed prior to crop harvesting.' : '1 to 3 Days for bio-fungicide formulations.'}
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs">
            <div className="font-bold text-slate-800 mb-1 flex items-center space-x-1.5">
              <Wind className="w-4 h-4 text-amber-600" />
              <span>Chemical Runoff Protection</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Eliminates false chemical spray alarms during dry spells, cutting chemical overhead by up to 60%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
