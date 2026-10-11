import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Printer, 
  Share2, 
  ScanLine, 
  AlertTriangle, 
  ShieldCheck, 
  MapPin, 
  Activity, 
  Droplets, 
  Thermometer, 
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import AdvisoryCard from '../components/AdvisoryCard';
import RiskFusionChart from '../components/RiskFusionChart';
import EpidemicSimulationChart from '../components/EpidemicSimulationChart';
import WeatherSensorBadge from '../components/WeatherSensorBadge';

export default function AdvisoryDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/advisories/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Advisory record not found');
        return res.json();
      })
      .then(json => {
        if (json.success) {
          setData(json);
        } else {
          throw new Error(json.error || 'Failed to load advisory');
        }
      })
      .catch(err => {
        console.error('Error fetching advisory:', err);
        setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-400 font-mono">Synthesizing predictive advisory & risk fusion models...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-slate-900 rounded-2xl p-8 border border-slate-800 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Advisory Record Unavailable</h2>
        <p className="text-sm text-slate-400">{error || 'Could not retrieve advisory data'}</p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  const { advisory, diagnostic, field, microClimate, epidemicSimulation, hourlyRiskProfile } = data;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Top Navigation & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link
            to="/"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase text-emerald-400 tracking-wider">
                Advisory Plan #{advisory.id}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400 font-mono">
                {new Date(advisory.createdAt).toLocaleDateString()} {new Date(advisory.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
              {diagnostic.detectedDisease}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-end sm:self-auto">
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Print Report</span>
          </button>

          <Link
            to={`/diagnose?fieldId=${field.id}&cropType=${encodeURIComponent(field.cropType)}`}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950 transition-all"
          >
            <ScanLine className="w-4 h-4" />
            <span>Scan Another Leaf</span>
          </Link>
        </div>
      </div>

      {/* Main Advisory Action Card */}
      <AdvisoryCard advisory={advisory} diagnostic={diagnostic} />

      {/* Diagnostic Evidence & Micro-Climate Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Specimen Visual & Pathology Diagnostic (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Diagnostic Precision Profile</span>
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              Confidence: {diagnostic.diagnosticConfidence}%
            </span>
          </div>

          <div className="aspect-video sm:aspect-square rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
            <img
              src={diagnostic.imageUrl}
              alt="Foliar Pathology Specimen"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-[11px] font-mono uppercase text-slate-400">Target Specimen / Plot</div>
              <div className="text-sm font-bold text-white flex items-center space-x-1.5 mt-0.5">
                <span>{field.name}</span>
                <span className="text-xs text-slate-400">({field.cropType})</span>
              </div>
              <div className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{field.location}</span>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-mono uppercase text-slate-400">Pathology Symptoms</div>
              <p className="text-xs text-slate-300 leading-relaxed mt-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                {diagnostic.symptomSummary}
              </p>
            </div>
          </div>
        </div>

        {/* Micro-Climate Telemetry & Diurnal Risk Fusion Curve (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <WeatherSensorBadge
            temperature={microClimate.temperature}
            relativeHumidity={microClimate.relativeHumidity}
            leafWetnessHours={microClimate.leafWetnessHours}
            windSpeed={microClimate.windSpeed}
          />

          <RiskFusionChart 
            data={hourlyRiskProfile} 
            title="Diurnal Micro-Climatic Risk Fusion (24h Profile)"
          />
        </div>

      </div>

      {/* Epidemic Spread Modeling (7, 14, 30 days) */}
      <EpidemicSimulationChart 
        simulationData={epidemicSimulation?.simulationData}
        summary={epidemicSimulation?.summary}
      />

    </div>
  );
}
