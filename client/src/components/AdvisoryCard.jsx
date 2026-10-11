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

  const getRiskBadge = () => {
    if (riskLevel === 'High') {
      return (
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-bold uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" />
          <span>High Risk Outbreak ({riskScore}%)</span>
        </span>
      );
    }
    if (riskLevel === 'Moderate') {
      return (
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4" />
          <span>Moderate Risk ({riskScore}%)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider">
        <ShieldCheck className="w-4 h-4" />
        <span>Low Risk / Safe ({riskScore}%)</span>
      </span>
    );
  };

  const isLow = riskScore < 40;
  const isMod = riskScore >= 40 && riskScore <= 70;

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div 
        className={`absolute -right-20 -top-20 w-60 h-60 rounded-full blur-3xl pointer-events-none ${
          !isLow ? (isMod ? 'bg-amber-500/10' : 'bg-red-500/10') : 'bg-emerald-500/10'
        }`}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            Calibrated Agronomic Decision Plan
          </span>
          <h2 className="text-xl font-extrabold text-white mt-1">
            {interventionViability}
          </h2>
        </div>
        <div>{getRiskBadge()}</div>
      </div>

      {/* Risk meter bar */}
      <div className="my-5">
        <div className="flex justify-between text-xs font-medium text-slate-400 mb-1.5">
          <span>Sporulation Probability Index</span>
          <span className="font-mono font-bold text-white">{riskScore}%</span>
        </div>
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isLow 
                ? 'bg-gradient-to-r from-emerald-500 to-green-400' 
                : isMod 
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400' 
                : 'bg-gradient-to-r from-orange-500 to-red-600'
            }`}
            style={{ width: `${Math.min(100, Math.max(5, riskScore))}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
          <span>0% (Safe)</span>
          <span>40% (Threshold)</span>
          <span>70% (Alarm)</span>
          <span>100%</span>
        </div>
      </div>

      {/* Optimal Spray Window Banner */}
      <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/80 mb-5">
        <div className="flex items-start space-x-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Optimal Intervention & Spray Window
            </div>
            <div className="text-sm font-semibold text-emerald-400 mt-0.5 font-mono">
              {optimalSprayWindow}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Gated by wind speed (&lt;10 km/h) and leaf drying kinetics to prevent run-off and drift.
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Treatment Protocol */}
      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
            <Beaker className="w-4 h-4 text-emerald-400" />
            <span>Pathology-Calibrated Prescriptive Advisory</span>
          </h4>
          <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 text-sm leading-relaxed text-slate-200">
            {treatmentRecommendation}
          </div>
        </div>

        {/* Safety & Pre-Harvest Intervals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-750 text-xs">
            <div className="font-semibold text-slate-300 mb-1 flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Pre-Harvest Interval (PHI)</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              {riskLevel === 'High' ? '14 Days strictly observed prior to crop harvesting.' : '1 to 3 Days for bio-fungicide formulations.'}
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-750 text-xs">
            <div className="font-semibold text-slate-300 mb-1 flex items-center space-x-1.5">
              <Wind className="w-3.5 h-3.5 text-amber-400" />
              <span>Chemical Runoff Protection</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Threshold gating eliminates false sprays during dry spells, cutting chemical overhead by up to 60%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
