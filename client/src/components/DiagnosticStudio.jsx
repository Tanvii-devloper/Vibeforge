import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UploadCloud, 
  Camera, 
  RefreshCw, 
  Check, 
  AlertTriangle, 
  Sparkles, 
  Thermometer, 
  Droplets, 
  Clock, 
  Wind, 
  Layers, 
  FileText, 
  Sliders, 
  CheckCircle2, 
  Cpu, 
  ShieldCheck, 
  Zap,
  Scan,
  MapPin,
  Compass
} from 'lucide-react';
import { INDIAN_AGRICULTURAL_REGIONS, getRegionById, simulateMicroClimate } from '../data/indianRegions';

const PRESET_BENCHMARKS = [
  {
    title: 'Maharashtra: Nashik Vineyard Powdery Mildew',
    regionId: 'maharashtra',
    cropType: 'Grapes',
    growthStage: 'Flowering',
    symptomDescription: 'White talcum powdery mycelial patches on adaxial leaf surfaces causing upward leaf curling across Nashik vineyard belt.',
    temperature: 23.5,
    relativeHumidity: 89.0,
    leafWetnessHours: 8.0,
    windSpeed: 4.8,
    imageSrc: '/samples/grape_powdery_mildew.jpg',
    riskBadge: 'Critical Spore Vector',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
  },
  {
    title: 'Punjab: Ludhiana Potato Late Blight (Fog Vector)',
    regionId: 'punjab',
    cropType: 'Potato',
    growthStage: 'Vegetative',
    symptomDescription: 'Water-soaked irregular dark olive-brown lesions spreading rapidly under dense Punjab fog and cold morning dew.',
    temperature: 18.2,
    relativeHumidity: 94.5,
    leafWetnessHours: 9.5,
    windSpeed: 3.5,
    imageSrc: '/samples/tomato_late_blight.jpg',
    riskBadge: 'High Risk (Dense Fog)',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
  },
  {
    title: 'West Bengal: Hooghly Paddy Sheath Blight',
    regionId: 'west-bengal',
    cropType: 'Rice',
    growthStage: 'Vegetative',
    symptomDescription: 'Elliptical diamond greenish-gray water-soaked lesions on leaf sheaths under hyper-humid Gangetic delta micro-climate.',
    temperature: 25.0,
    relativeHumidity: 96.0,
    leafWetnessHours: 10.0,
    windSpeed: 3.8,
    imageSrc: '/samples/potato_early_blight.jpg',
    riskBadge: 'Hyper-Humid Surge',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
  },
  {
    title: 'Dry Spell Lesion (False Alarm Prevention)',
    regionId: 'madhya-pradesh',
    cropType: 'Tomato',
    growthStage: 'Vegetative',
    symptomDescription: 'Old brown lesions observed, but ambient conditions are dry and warm. Safe spray window.',
    temperature: 28.0,
    relativeHumidity: 52.0,
    leafWetnessHours: 1.5,
    windSpeed: 7.0,
    imageSrc: '/samples/tomato_late_blight.jpg',
    riskBadge: 'Suppressed',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
  }
];

export default function DiagnosticStudio({ initialFieldId, initialCropType }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [fields, setFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState(initialFieldId || 1);
  const [selectedRegionId, setSelectedRegionId] = useState('maharashtra');
  const [cropType, setCropType] = useState(initialCropType || 'Grapes');
  const [growthStage, setGrowthStage] = useState('Vegetative');
  const [symptomDescription, setSymptomDescription] = useState('White powdery patches on adaxial leaf surface causing upward curling along leaf margins');
  const [fieldLocation, setFieldLocation] = useState('Nashik / Pune (Maharashtra)');

  // Micro-climatic sliders (default to Maharashtra Nashik simulated climate)
  const [temperature, setTemperature] = useState(23.5);
  const [relativeHumidity, setRelativeHumidity] = useState(89.0);
  const [leafWetnessHours, setLeafWetnessHours] = useState(8.0);
  const [windSpeed, setWindSpeed] = useState(4.8);

  // Image capture states
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('/samples/tomato_late_blight.jpg');
  const [imageBase64, setImageBase64] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Submission state & analysis animation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressStage, setProgressStage] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch available fields
  useEffect(() => {
    fetch('/api/fields')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.fields.length > 0) {
          setFields(data.fields);
          if (!initialFieldId) {
            setSelectedFieldId(data.fields[0].id);
            if (!initialCropType) setCropType(data.fields[0].crop_type);
          }
        }
      })
      .catch(err => console.warn('Could not fetch fields list:', err));
  }, [initialFieldId, initialCropType]);

  // Handle file select
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Start webcam
  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      alert('Camera access unavailable. You can upload an image file or use the benchmark specimens.');
      setIsCameraActive(false);
    }
  };

  // Stop webcam
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Capture photo from video
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setPreviewUrl(dataUrl);
      setImageBase64(dataUrl);
      setImageFile(null);
      stopCamera();
    }
  };

  // Handle Indian Agricultural Region selection and micro-climate simulation
  const handleRegionSelect = (regId, withVariance = false) => {
    setSelectedRegionId(regId);
    const reg = getRegionById(regId);
    setFieldLocation(`${reg.hub} (${reg.state})`);
    if (!reg.crops.map(c => c.toLowerCase()).some(c => cropType.toLowerCase().includes(c))) {
      setCropType(reg.defaultCrop);
    }
    const sim = simulateMicroClimate(regId, { variance: withVariance });
    setTemperature(sim.temperature);
    setRelativeHumidity(sim.relativeHumidity);
    setLeafWetnessHours(sim.leafWetnessHours);
    setWindSpeed(sim.windSpeed);
  };

  // Load a preset benchmark specimen
  const loadBenchmarkPreset = (preset) => {
    if (preset.regionId) {
      setSelectedRegionId(preset.regionId);
      const reg = getRegionById(preset.regionId);
      setFieldLocation(`${reg.hub} (${reg.state})`);
    }
    setCropType(preset.cropType);
    setGrowthStage(preset.growthStage);
    setSymptomDescription(preset.symptomDescription);
    setTemperature(preset.temperature);
    setRelativeHumidity(preset.relativeHumidity);
    setLeafWetnessHours(preset.leafWetnessHours);
    setWindSpeed(preset.windSpeed);
    setPreviewUrl(preset.imageSrc);
    setImageBase64('');
    setImageFile(null);
  };

  // Execute diagnostic submission with multi-phase futuristic scanner animation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setProgressPercent(15);

    try {
      setProgressStage('Holographic foliar ingestion & alignment...');
      await new Promise(r => setTimeout(r, 450));
      setProgressPercent(40);

      setProgressStage('Gemini 2.5 Flash neural visual pathology inference...');
      await new Promise(r => setTimeout(r, 650));
      setProgressPercent(70);

      setProgressStage('Fusing micro-climatic environmental vectors...');
      await new Promise(r => setTimeout(r, 450));
      setProgressPercent(90);

      setProgressStage('Calibrating threshold-gated intervention viability...');

      const formData = new FormData();
      formData.append('fieldId', String(selectedFieldId));
      formData.append('cropType', cropType);
      formData.append('growthStage', growthStage);
      formData.append('temperature', String(temperature));
      formData.append('relativeHumidity', String(relativeHumidity));
      formData.append('leafWetnessHours', String(leafWetnessHours));
      formData.append('windSpeed', String(windSpeed));
      formData.append('symptomDescription', symptomDescription);
      formData.append('fieldLocation', fieldLocation);

      if (imageFile) {
        formData.append('imageFile', imageFile);
      } else if (imageBase64) {
        formData.append('imageBase64', imageBase64);
      }

      const res = await fetch('/api/diagnostics', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || 'Failed to analyze crop image');
      }

      setProgressPercent(100);
      await new Promise(r => setTimeout(r, 300));

      navigate(`/advisory/${data.advisoryId}`);
    } catch (err) {
      console.error('Submission failed:', err);
      setErrorMessage(err.message || 'An error occurred during diagnostic analysis');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* 3D Glassmorphic Studio Header */}
      <div className="glass-panel-3d rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-neon-mint mb-1">
            <Cpu className="w-4 h-4 text-neon-mint" />
            <span>Multimodal Neural Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans text-glow-mint">
            3D Holographic Pathology &amp; Risk Scanner
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Upload or capture foliar imagery. The neural vision pipeline executes Gemini multimodal symptom identification and dynamically computes micro-climatic sporulation thresholds.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start md:self-auto">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-forest-900/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <ShieldCheck className="w-4 h-4 text-neon-mint" />
            <span>Zero False Alarms Calibrated</span>
          </span>
        </div>
      </div>

      {/* 1-Click Benchmark Specimen Selector */}
      <div className="glass-panel-3d rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center space-x-2">
            <Layers className="w-4 h-4 text-neon-mint" />
            <span>1-Click Benchmark Test Specimens</span>
          </span>
          <span className="text-xs text-slate-400 font-mono">Instant Test Matrix</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_BENCHMARKS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadBenchmarkPreset(preset)}
              className="text-left p-3.5 rounded-xl glass-subpanel hover:border-neon-mint/50 border border-white/5 transition-all duration-300 group hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-200 group-hover:text-neon-mint transition-colors">
                  {preset.cropType} Specimen
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${preset.badgeColor}`}>
                  {preset.riskBadge}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 line-clamp-1">
                {preset.title}
              </div>
              <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-2 font-mono">
                <span>{preset.temperature}°C</span>
                <span>•</span>
                <span>{preset.relativeHumidity}% RH</span>
                <span>•</span>
                <span>{preset.leafWetnessHours}h Dew</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Diagnostic Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Foliar Viewport with Holographic Laser Scanner (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel-3d rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2 font-mono">
                <Camera className="w-4 h-4 text-neon-mint" />
                <span>Visual Foliar Viewport</span>
              </h3>
              <div>
                {!isCameraActive ? (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-black/40 hover:bg-forest-900 border border-white/10 text-slate-200 transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5 text-neon-mint" />
                    <span>Live Cam</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-950/80 text-rose-300 border border-rose-500/50"
                  >
                    Close Cam
                  </button>
                )}
              </div>
            </div>

            {/* Specimen Viewport Container with Holographic Laser Scanning */}
            <div className="relative aspect-video sm:aspect-square w-full rounded-xl overflow-hidden bg-black/80 border-2 border-white/10 flex items-center justify-center group shadow-2xl">
              
              {/* Laser scanning beam overlay */}
              <div className="laser-scanner" />

              {/* Viewport corner HUD crosshairs */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-neon-mint/60 pointer-events-none" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-neon-mint/60 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-neon-mint/60 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-neon-mint/60 pointer-events-none" />

              {isCameraActive ? (
                <div className="w-full h-full relative">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-forest-800 hover:bg-forest-700 text-white font-bold text-xs px-4 py-2 rounded-full border border-neon-mint/40 shadow-[0_0_20px_rgba(0,255,135,0.4)] flex items-center space-x-1.5"
                  >
                    <Camera className="w-4 h-4 text-neon-mint" />
                    <span>Capture Snapshot</span>
                  </button>
                </div>
              ) : previewUrl ? (
                <div className="relative w-full h-full">
                  <img
                    src={previewUrl}
                    alt="Crop Foliar Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-xl bg-forest-800 border border-neon-mint/50 text-white text-xs font-bold shadow-lg hover:bg-forest-700"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer text-center p-6 space-y-2 hover:text-neon-mint transition-colors"
                >
                  <UploadCloud className="w-10 h-10 mx-auto text-slate-400" />
                  <div className="text-xs font-bold text-slate-200">
                    Click to browse or drop foliar photo here
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Supports high-resolution JPEG, PNG, WebP up to 10MB
                  </div>
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1 font-mono">
              <span>Pipeline:</span>
              <span className="font-semibold text-neon-mint">Gemini 2.5 Flash Vision</span>
            </div>
          </div>
        </div>

        {/* Right Column: Agronomic Metadata & Weather Sliders (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel-3d rounded-2xl p-6 space-y-5">
            
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2 pb-3 border-b border-white/10 font-mono">
              <Sliders className="w-4 h-4 text-neon-mint" />
              <span>Agronomic Metadata &amp; Micro-Climatic Simulation</span>
            </h3>

            {/* Indian Agricultural Region & Micro-Climate Simulator */}
            <div className="p-4 rounded-xl bg-forest-950/80 border border-emerald-500/30 space-y-3 shadow-inner">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-bold text-neon-mint uppercase tracking-wider flex items-center space-x-2 font-mono">
                  <MapPin className="w-4 h-4 text-neon-mint" />
                  <span>Agricultural Region &amp; State (India Hubs)</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleRegionSelect(selectedRegionId, true)}
                  className="inline-flex items-center space-x-1.5 text-[11px] font-mono font-bold text-cyan-300 hover:text-white bg-cyan-950/80 hover:bg-cyan-900 px-3 py-1.5 rounded-lg border border-cyan-500/40 transition-all shadow-[0_0_10px_rgba(6,182,212,0.25)]"
                  title="Simulate hyper-local canopy telemetry for this Indian agricultural hub"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Simulate Micro-Climate Telemetry</span>
                </button>
              </div>

              <select
                value={selectedRegionId}
                onChange={(e) => handleRegionSelect(e.target.value, false)}
                className="w-full bg-black/60 border border-emerald-500/40 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-neon-mint transition-all font-semibold"
              >
                {INDIAN_AGRICULTURAL_REGIONS.map(reg => (
                  <option key={reg.id} value={reg.id} className="bg-slate-900 text-white">
                    {reg.label} — {reg.subtext}
                  </option>
                ))}
              </select>

              {/* Regional Telemetry & Crop Mapping Banner */}
              {(() => {
                const activeReg = getRegionById(selectedRegionId);
                return (
                  <div className="text-xs grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 font-mono">
                    <div className="bg-black/50 p-2.5 rounded-xl border border-white/10 space-y-1.5">
                      <div className="text-slate-400 text-[10px] uppercase font-bold flex items-center justify-between">
                        <span>Regional Crops:</span>
                        <span className="text-neon-mint font-bold">{activeReg.state}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {activeReg.crops.map(c => (
                          <button
                            type="button"
                            key={c} 
                            onClick={() => setCropType(c)}
                            className={`px-2.5 py-1 rounded-md text-xs border transition-all ${
                              cropType.toLowerCase().includes(c.toLowerCase())
                                ? 'bg-forest-800 text-neon-mint border-neon-mint/60 font-bold shadow-[0_0_10px_rgba(0,255,135,0.3)]'
                                : 'bg-black/40 text-slate-300 border-white/10 hover:border-neon-mint/40 hover:text-white'
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-black/50 p-2.5 rounded-xl border border-white/10 space-y-1.5">
                      <div className="text-slate-400 text-[10px] uppercase font-bold flex items-center justify-between">
                        <span>Primary Vectors:</span>
                        <span className="text-rose-400 font-bold">Spore Trigger</span>
                      </div>
                      <div className="text-[11px] text-slate-200 truncate font-semibold" title={activeReg.primaryPathogens.join(', ')}>
                        {activeReg.primaryPathogens[0]}
                      </div>
                      <div className="text-[10px] text-amber-300/90 font-mono">
                        Base: {activeReg.simulatedClimate.temperature}°C · {activeReg.simulatedClimate.relativeHumidity}% RH · {activeReg.simulatedClimate.leafWetnessHours}h Dew
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Farm Plot & Crop Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 font-mono">
                  Target Farm Plot / Sector
                </label>
                <select
                  value={selectedFieldId}
                  onChange={(e) => {
                    const id = parseInt(e.target.value, 10);
                    setSelectedFieldId(id);
                    const match = fields.find(f => f.id === id);
                    if (match) {
                      setCropType(match.crop_type);
                      setFieldLocation(match.location);
                    }
                  }}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-mint transition-all font-medium"
                >
                  {fields.map(f => (
                    <option key={f.id} value={f.id} className="bg-slate-900 text-white">
                      {f.name} ({f.crop_type})
                    </option>
                  ))}
                  {fields.length === 0 && (
                    <option value="1" className="bg-slate-900 text-white">Maharashtra - Nashik Vineyard Plot A</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 font-mono">
                  Crop Category
                </label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-mint transition-all font-medium"
                >
                  <option value="Grapes" className="bg-slate-900 text-white">Grapes (Viticulture)</option>
                  <option value="Tomato" className="bg-slate-900 text-white">Tomato (Solanaceae)</option>
                  <option value="Potato" className="bg-slate-900 text-white">Potato (Solanaceae)</option>
                  <option value="Onions" className="bg-slate-900 text-white">Onion (Alliaceae)</option>
                  <option value="Wheat" className="bg-slate-900 text-white">Wheat (Cereals)</option>
                  <option value="Rice" className="bg-slate-900 text-white">Rice / Paddy (Cereals)</option>
                  <option value="Sugarcane" className="bg-slate-900 text-white">Sugarcane (Cash Crop)</option>
                  <option value="Cotton" className="bg-slate-900 text-white">Cotton (Fiber / Cash Crop)</option>
                  <option value="Soybean" className="bg-slate-900 text-white">Soybean (Oilseeds)</option>
                  <option value="Groundnuts" className="bg-slate-900 text-white">Groundnut (Oilseeds)</option>
                  <option value="Maize" className="bg-slate-900 text-white">Maize / Corn (Cereals)</option>
                </select>
              </div>
            </div>

            {/* Growth Stage & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 font-mono">
                  Phenological Stage
                </label>
                <select
                  value={growthStage}
                  onChange={(e) => setGrowthStage(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-mint transition-all font-medium"
                >
                  <option value="Vegetative" className="bg-slate-900 text-white">Vegetative Canopy</option>
                  <option value="Flowering" className="bg-slate-900 text-white">Flowering / Inflorescence</option>
                  <option value="Fruit Development" className="bg-slate-900 text-white">Fruit Development / Tuber Bulk</option>
                  <option value="Maturation" className="bg-slate-900 text-white">Heading / Pre-Harvest</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 font-mono">
                  Field Location Coordinates
                </label>
                <input
                  type="text"
                  value={fieldLocation}
                  onChange={(e) => setFieldLocation(e.target.value)}
                  placeholder="e.g. Salinas Valley, Sector 12"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-mint transition-all font-medium"
                />
              </div>
            </div>

            {/* Symptom Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 font-mono">
                Observed Symptom Pathology Notes
              </label>
              <textarea
                rows="2"
                value={symptomDescription}
                onChange={(e) => setSymptomDescription(e.target.value)}
                placeholder="Describe foliar lesion morphology, halos, or sporulation..."
                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-neon-mint transition-all"
              />
            </div>

            {/* Environmental Vector Sliders */}
            <div className="pt-2 border-t border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                  Micro-Climatic Vector Overrides
                </span>
                {relativeHumidity > 85 && leafWetnessHours >= 6 && (
                  <span className="text-[11px] font-bold text-rose-300 bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-500/50 flex items-center space-x-1 shadow-[0_0_15px_rgba(239,68,68,0.4)] pulse-critical-3d font-mono">
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                    <span>Critical Sporulation Triggered</span>
                  </span>
                )}
                {relativeHumidity < 68 && leafWetnessHours < 3.5 && (
                  <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/50 flex items-center space-x-1 shadow-[0_0_15px_rgba(16,185,129,0.3)] font-mono">
                    <CheckCircle2 className="w-3 h-3 text-neon-mint" />
                    <span>False Spray Alarm Suppression Active</span>
                  </span>
                )}
              </div>

              {/* Temperature Slider */}
              <div className="space-y-1 glass-subpanel p-3.5 rounded-xl border border-white/5">
                <div className="flex justify-between text-xs font-mono font-semibold">
                  <span className="text-slate-300 flex items-center space-x-1.5">
                    <Thermometer className="w-4 h-4 text-amber-400" />
                    <span>Temperature</span>
                  </span>
                  <span className="font-bold text-amber-400">{temperature}°C</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="0.5"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Relative Humidity Slider */}
              <div className="space-y-1 glass-subpanel p-3.5 rounded-xl border border-white/5">
                <div className="flex justify-between text-xs font-mono font-semibold">
                  <span className="text-slate-300 flex items-center space-x-1.5">
                    <Droplets className="w-4 h-4 text-cyan-400" />
                    <span>Relative Humidity</span>
                  </span>
                  <span className="font-bold text-cyan-400 text-glow-cyan">{relativeHumidity}% RH</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="1"
                  value={relativeHumidity}
                  onChange={(e) => setRelativeHumidity(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Leaf Wetness Hours Slider */}
              <div className="space-y-1 glass-subpanel p-3.5 rounded-xl border border-white/5">
                <div className="flex justify-between text-xs font-mono font-semibold">
                  <span className="text-slate-300 flex items-center space-x-1.5">
                    <Clock className="w-4 h-4 text-teal-400" />
                    <span>Continuous Leaf Wetness</span>
                  </span>
                  <span className="font-bold text-teal-300">{leafWetnessHours} Hours</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="0.5"
                  value={leafWetnessHours}
                  onChange={(e) => setLeafWetnessHours(parseFloat(e.target.value))}
                  className="w-full accent-teal-400 cursor-pointer"
                />
              </div>

              {/* Wind Speed Slider */}
              <div className="space-y-1 glass-subpanel p-3.5 rounded-xl border border-white/5">
                <div className="flex justify-between text-xs font-mono font-semibold">
                  <span className="text-slate-300 flex items-center space-x-1.5">
                    <Wind className="w-4 h-4 text-indigo-400" />
                    <span>Wind Velocity</span>
                  </span>
                  <span className="font-bold text-indigo-300">{windSpeed} km/h</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="35"
                  step="0.5"
                  value={windSpeed}
                  onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
                  className="w-full accent-indigo-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl text-xs text-rose-300 font-mono">
                {errorMessage}
              </div>
            )}

            {/* Submit Action & Futuristic Multi-Phase Laser Loader */}
            <div className="pt-2">
              {isSubmitting ? (
                <div className="glass-subpanel rounded-2xl p-4 border border-neon-mint/30 space-y-3 shadow-[0_0_30px_rgba(0,255,135,0.2)]">
                  <div className="flex items-center justify-between text-xs font-bold text-neon-mint font-mono">
                    <span className="flex items-center space-x-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-neon-mint" />
                      <span>{progressStage}</span>
                    </span>
                    <span>{progressPercent}%</span>
                  </div>
                  {/* Glowing progress bar */}
                  <div className="w-full bg-black/60 h-2.5 rounded-full overflow-hidden border border-white/10 p-0.5">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-forest-700 via-neon-mint to-cyan-400 transition-all duration-300 shadow-[0_0_15px_#00FF87]"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-400 text-center font-mono">
                    Synthesizing multimodal plant pathology with micro-climatic vectors
                  </div>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-forest-800 via-forest-700 to-forest-800 hover:from-forest-700 hover:to-forest-600 border border-neon-mint/40 text-white font-extrabold text-sm shadow-[0_0_25px_rgba(0,255,135,0.25)] hover:shadow-[0_0_35px_rgba(0,255,135,0.4)] transition-all flex items-center justify-center space-x-2 group hover:scale-[1.01]"
                >
                  <Sparkles className="w-4 h-4 text-neon-mint group-hover:scale-120 transition-transform" />
                  <span>Execute Multimodal AI Diagnostic &amp; Risk Fusion</span>
                </button>
              )}
            </div>

          </div>
        </div>

      </form>
    </div>
  );
}
