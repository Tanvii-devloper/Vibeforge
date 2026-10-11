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
        <div className="w-10 h-10 border-4 border-forest-800 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-500 font-mono">Synthesizing predictive advisory &amp; risk fusion models...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-4 shadow-sm">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Advisory Record Unavailable</h2>
        <p className="text-sm text-slate-500">{error || 'Could not retrieve advisory data'}</p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-forest-800 hover:bg-forest-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  const { advisory, diagnostic, field, microClimate, epidemicSimulation, hourlyRiskProfile } = data;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* Top Navigation & Action Controls */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <Link
            to="/"
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase text-forest-800 font-bold tracking-wider">
                Advisory Plan #{advisory.id}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-mono">
                {new Date(advisory.createdAt).toLocaleDateString()} at {new Date(advisory.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {diagnostic.detectedDisease}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 self-end sm:self-auto">
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Report</span>
          </button>

          <Link
            to={`/diagnose?fieldId=${field.id}&cropType=${encodeURIComponent(field.cropType)}`}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-forest-800 hover:bg-forest-700 text-white text-xs font-bold shadow-sm transition-all"
          >
            <ScanLine className="w-4 h-4 text-mint-400" />
            <span>Scan Another Specimen</span>
          </Link>
        </div>
      </div>

      {/* Main Advisory Action Card */}
      <AdvisoryCard advisory={advisory} diagnostic={diagnostic} />

      {/* Diagnostic Evidence & Micro-Climate Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Specimen Visual & Pathology Diagnostic (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-150">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-forest-700" />
              <span>Diagnostic Precision Profile</span>
            </h3>
            <span className="text-xs font-mono font-bold text-forest-800 bg-forest-50 px-2 py-0.5 rounded border border-forest-200">
              Confidence: {diagnostic.diagnosticConfidence}%
            </span>
          </div>

          <div className="aspect-video sm:aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={diagnostic.imageUrl}
              alt="Foliar Pathology Specimen"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-[11px] font-mono uppercase text-slate-500 font-bold">Target Specimen / Plot</div>
              <div className="text-sm font-bold text-slate-900 flex items-center space-x-1.5 mt-0.5">
                <span>{field.name}</span>
                <span className="text-xs text-slate-500">({field.cropType})</span>
              </div>
              <div className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{field.location}</span>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-mono uppercase text-slate-500 font-bold">Pathology Symptoms &amp; Morphology</div>
              <p className="text-xs text-slate-700 leading-relaxed mt-1 bg-slate-50 p-3 rounded-lg border border-slate-200 font-medium">
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
