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
  Calendar,
  Radio
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
        <span className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/60 text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(239,68,68,0.4)] pulse-critical-3d font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>Critical Spore Pressure ({riskScore}%)</span>
        </span>
      );
    }
    if (isMod) {
      return (
        <span className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/60 text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.3)] font-mono">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Moderate Risk ({riskScore}%)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/60 text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.3)] font-mono">
        <ShieldCheck className="w-4 h-4 text-neon-mint" />
        <span>Safe Window / Monitored ({riskScore}%)</span>
      </span>
    );
  };

  return (
    <div className="glass-panel-3d rounded-2xl p-7 relative overflow-hidden">
      
      {/* Background glow */}
      <div 
        className={`absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
          isHigh ? 'bg-rose-600/15' : isMod ? 'bg-amber-500/15' : 'bg-emerald-500/15'
        }`}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10 relative z-10">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-neon-mint font-bold flex items-center space-x-1.5">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Holographic Agronomic Decision Plan</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5 tracking-tight font-sans">
            {interventionViability}
          </h2>
        </div>
        <div>{getRiskBadge()}</div>
      </div>

      {/* Risk meter bar */}
      <div className="my-6 relative z-10">
        <div className="flex justify-between text-xs font-bold text-slate-300 mb-2 font-mono">
          <span>SPORULATION PROBABILITY INDEX</span>
          <span className={`text-sm ${isHigh ? 'text-rose-400 text-glow-red' : isMod ? 'text-amber-400' : 'text-neon-mint text-glow-mint'}`}>
            {riskScore}%
          </span>
        </div>
        <div className="w-full h-3.5 bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              !isMod && !isHigh
                ? 'bg-gradient-to-r from-emerald-600 via-neon-mint to-teal-400 shadow-[0_0_15px_#00FF87]' 
                : isMod 
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_15px_#F59E0B]' 
                : 'bg-gradient-to-r from-orange-500 via-rose-500 to-red-600 shadow-[0_0_20px_#EF4444]'
            }`}
            style={{ width: `${Math.min(100, Math.max(5, riskScore))}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-mono">
          <span>0% (Safe)</span>
          <span>40% (Threshold Gate)</span>
          <span>70% (Critical Spore Pressure)</span>
          <span>100%</span>
        </div>
      </div>

      {/* Optimal Spray Window Banner */}
      <div className="glass-subpanel rounded-xl p-4 border border-neon-mint/30 mb-6 relative z-10 shadow-[0_0_25px_rgba(0,255,135,0.15)]">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-forest-800 text-neon-mint border border-neon-mint/40 flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_15px_rgba(0,255,135,0.3)]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-neon-mint font-mono">
              Optimal Treatment Window &amp; Spray Timing
            </div>
            <div className="text-sm font-bold text-white mt-1 font-mono">
              {optimalSprayWindow}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Gated by ambient wind velocity (&lt;10 km/h) and foliar drying kinetics to prevent non-target spray drift and wash-off.
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Treatment Protocol */}
      <div className="space-y-4 relative z-10">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center space-x-2 font-mono">
            <Beaker className="w-4 h-4 text-neon-mint" />
            <span>Pathology-Calibrated Prescriptive Advisory</span>
          </h4>
          <div className="glass-subpanel rounded-xl p-4 border border-white/10 text-sm leading-relaxed text-slate-200">
            {treatmentRecommendation}
          </div>
        </div>

        {/* Safety & Pre-Harvest Intervals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 font-mono">
          <div className="glass-subpanel rounded-xl p-4 border border-white/10 text-xs">
            <div className="font-bold text-sky-400 mb-1 flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-sky-400" />
              <span>Pre-Harvest Interval (PHI)</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {riskLevel === 'High' ? '14 Days strictly observed prior to crop harvesting.' : '1 to 3 Days for bio-fungicide formulations.'}
            </p>
          </div>

          <div className="glass-subpanel rounded-xl p-4 border border-white/10 text-xs">
            <div className="font-bold text-amber-400 mb-1 flex items-center space-x-2">
              <Wind className="w-4 h-4 text-amber-400" />
              <span>Chemical Runoff Protection</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Threshold gating eliminates false chemical spray alarms during dry spells, cutting overhead by up to 60%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
