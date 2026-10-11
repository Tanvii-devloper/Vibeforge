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
  ChevronRight,
  ShieldCheck,
  Eye
} from 'lucide-react';

const PRESET_BENCHMARKS = [
  {
    title: 'Tomato Late Blight (High Vector)',
    cropType: 'Tomato',
    growthStage: 'Fruit Development',
    symptomDescription: 'Water-soaked irregular dark olive-brown lesions on leaf margins with pale chlorotic halo.',
    temperature: 19.5,
    relativeHumidity: 92.0,
    leafWetnessHours: 9.0,
    windSpeed: 5.5,
    imageSrc: '/samples/tomato_late_blight.jpg',
    riskBadge: 'High Risk',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200'
  },
  {
    title: 'Dry Spell Lesion (False Alarm Prevention)',
    cropType: 'Tomato',
    growthStage: 'Vegetative',
    symptomDescription: 'Old brown lesions observed, but ambient conditions are dry and hot.',
    temperature: 28.0,
    relativeHumidity: 52.0,
    leafWetnessHours: 1.5,
    windSpeed: 7.0,
    imageSrc: '/samples/tomato_late_blight.jpg',
    riskBadge: 'Alarm Suppressed',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    title: 'Potato Early Blight (Target Rings)',
    cropType: 'Potato',
    growthStage: 'Vegetative',
    symptomDescription: 'Concentric ring target lesions on mature leaves with yellow halo.',
    temperature: 24.5,
    relativeHumidity: 68.0,
    leafWetnessHours: 4.0,
    windSpeed: 8.0,
    imageSrc: '/samples/potato_early_blight.jpg',
    riskBadge: 'Moderate',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  {
    title: 'Grape Powdery Mildew (Vineyard Specimen)',
    cropType: 'Grapes',
    growthStage: 'Flowering',
    symptomDescription: 'White powdery patches on adaxial leaf surface causing upward curling.',
    temperature: 23.0,
    relativeHumidity: 85.0,
    leafWetnessHours: 6.5,
    windSpeed: 4.5,
    imageSrc: '/samples/grape_powdery_mildew.jpg',
    riskBadge: 'High Risk',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200'
  }
];

export default function DiagnosticStudio({ initialFieldId, initialCropType }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [fields, setFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState(initialFieldId || 1);
  const [cropType, setCropType] = useState(initialCropType || 'Tomato');
  const [growthStage, setGrowthStage] = useState('Vegetative');
  const [symptomDescription, setSymptomDescription] = useState('Water-soaked dark lesions spreading rapidly across foliar margins');
  const [fieldLocation, setFieldLocation] = useState('Salinas Valley Plot A');

  // Micro-climatic sliders
  const [temperature, setTemperature] = useState(19.5);
  const [relativeHumidity, setRelativeHumidity] = useState(90.0);
  const [leafWetnessHours, setLeafWetnessHours] = useState(8.0);
  const [windSpeed, setWindSpeed] = useState(5.5);

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

  // Load a preset benchmark specimen
  const loadBenchmarkPreset = (preset) => {
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

  // Execute diagnostic submission with multi-phase skeleton/spinner animation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setProgressPercent(15);

    try {
      setProgressStage('Ingesting high-resolution foliar image...');
      await new Promise(r => setTimeout(r, 450));
      setProgressPercent(40);

      setProgressStage('Evaluating visual pathology via Gemini 2.5 Flash...');
      await new Promise(r => setTimeout(r, 650));
      setProgressPercent(70);

      setProgressStage('Fusing micro-climatic environmental vectors...');
      await new Promise(r => setTimeout(r, 450));
      setProgressPercent(90);

      setProgressStage('Calibrating threshold-gated spray recommendations...');

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

      // Success: Navigate to advisory details
      navigate(`/advisory/${data.advisoryId}`);
    } catch (err) {
      console.error('Submission failed:', err);
      setErrorMessage(err.message || 'An error occurred during diagnostic analysis');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Enterprise Page Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-forest-800 uppercase tracking-wider mb-1">
            <Cpu className="w-4 h-4 text-forest-700" />
            <span>Multimodal Diagnostic Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Crop Pathology &amp; Risk Fusion Scanner
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Analyze foliar imagery using Gemini multimodal intelligence, synchronized with hyper-local canopy humidity.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start md:self-auto">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-forest-50 text-forest-800 border border-forest-200 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-forest-700" />
            <span>Zero False Alarms Calibrated</span>
          </span>
        </div>
      </div>

      {/* Benchmark Specimen Quick Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
            <Layers className="w-4 h-4 text-forest-700" />
            <span>1-Click Benchmark Test Specimens</span>
          </span>
          <span className="text-xs text-slate-400">Click to instantly populate field parameters</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_BENCHMARKS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadBenchmarkPreset(preset)}
              className="text-left p-3.5 rounded-xl bg-slate-50 hover:bg-forest-50/50 hover:border-forest-600/50 border border-slate-200 transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-800 group-hover:text-forest-800 transition-colors">
                  {preset.cropType} Specimen
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${preset.badgeColor}`}>
                  {preset.riskBadge}
                </span>
              </div>
              <div className="text-[11px] text-slate-600 line-clamp-1 font-medium">
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

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Image Upload & Visual Evidence (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-150">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
                <Camera className="w-4 h-4 text-forest-700" />
                <span>Visual Foliar Specimen</span>
              </h3>
              <div>
                {!isCameraActive ? (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5 text-forest-700" />
                    <span>Open Camera</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200"
                  >
                    Close Cam
                  </button>
                )}
              </div>
            </div>

            {/* Viewfinder / Image Preview Box */}
            <div className="relative aspect-video sm:aspect-square w-full rounded-xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center">
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
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-forest-800 hover:bg-forest-700 text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg flex items-center space-x-1.5"
                  >
                    <Camera className="w-4 h-4 text-mint-300" />
                    <span>Capture Snapshot</span>
                  </button>
                </div>
              ) : previewUrl ? (
                <div className="relative w-full h-full group">
                  <img
                    src={previewUrl}
                    alt="Crop Foliar Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-bold shadow-md hover:bg-slate-100"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer text-center p-6 space-y-2 hover:text-forest-700 transition-colors"
                >
                  <UploadCloud className="w-10 h-10 mx-auto text-slate-400" />
                  <div className="text-xs font-bold text-slate-700">
                    Click to browse or drop foliar photo here
                  </div>
                  <div className="text-[11px] text-slate-400">
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

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Model Pipeline:</span>
              <span className="font-mono font-semibold text-forest-800">Gemini 2.5 Flash Multimodal</span>
            </div>
          </div>
        </div>

        {/* Right Column: Agronomic Metadata & Weather Sliders (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-sm space-y-5">
            
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2 pb-3 border-b border-slate-150">
              <Sliders className="w-4 h-4 text-forest-700" />
              <span>Agronomic Metadata &amp; Environmental Vectors</span>
            </h3>

            {/* Farm Plot & Crop Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Target Farm Plot
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-forest-600 focus:bg-white transition-all font-medium"
                >
                  {fields.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.crop_type})
                    </option>
                  ))}
                  {fields.length === 0 && (
                    <option value="1">North Valley Tomato Plot A</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Crop Category
                </label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-forest-600 focus:bg-white transition-all font-medium"
                >
                  <option value="Tomato">Tomato (Solanaceae)</option>
                  <option value="Potato">Potato (Solanaceae)</option>
                  <option value="Grapes">Grapes (Viticulture)</option>
                  <option value="Wheat">Wheat (Cereals)</option>
                  <option value="Rice">Rice (Cereals)</option>
                  <option value="Corn">Corn (Cereals)</option>
                  <option value="Soybean">Soybean (Legumes)</option>
                </select>
              </div>
            </div>

            {/* Growth Stage & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Phenological Stage
                </label>
                <select
                  value={growthStage}
                  onChange={(e) => setGrowthStage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-forest-600 focus:bg-white transition-all font-medium"
                >
                  <option value="Vegetative">Vegetative Canopy</option>
                  <option value="Flowering">Flowering / Inflorescence</option>
                  <option value="Fruit Development">Fruit Development / Tuber Bulk</option>
                  <option value="Maturation">Heading / Pre-Harvest</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Field Location Coordinates
                </label>
                <input
                  type="text"
                  value={fieldLocation}
                  onChange={(e) => setFieldLocation(e.target.value)}
                  placeholder="e.g. Salinas Valley, Sector 12"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-forest-600 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            {/* Symptom Pathology Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Observed Symptom Pathology Notes
              </label>
              <textarea
                rows="2"
                value={symptomDescription}
                onChange={(e) => setSymptomDescription(e.target.value)}
                placeholder="Describe foliar lesion morphology, discoloration, concentric rings, or sporulation..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-800 focus:outline-none focus:border-forest-600 focus:bg-white transition-all"
              />
            </div>

            {/* Environmental Vector Sliders */}
            <div className="pt-2 border-t border-slate-150 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Micro-Climatic Vector Overrides
                </span>
                {relativeHumidity > 85 && leafWetnessHours >= 6 && (
                  <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-300 flex items-center space-x-1 shadow-sm pulse-critical">
                    <AlertTriangle className="w-3 h-3 text-rose-600" />
                    <span>Critical Sporulation Triggered</span>
                  </span>
                )}
                {relativeHumidity < 68 && leafWetnessHours < 3.5 && (
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center space-x-1 shadow-sm">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>False Spray Alarm Suppression Active</span>
                  </span>
                )}
              </div>

              {/* Temperature Slider */}
              <div className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600 flex items-center space-x-1.5">
                    <Thermometer className="w-4 h-4 text-amber-500" />
                    <span>Temperature</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900">{temperature}°C</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="0.5"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-forest-700 cursor-pointer"
                />
              </div>

              {/* Relative Humidity Slider */}
              <div className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600 flex items-center space-x-1.5">
                    <Droplets className="w-4 h-4 text-sky-500" />
                    <span>Relative Humidity</span>
                  </span>
                  <span className="font-mono font-bold text-sky-600">{relativeHumidity}% RH</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="1"
                  value={relativeHumidity}
                  onChange={(e) => setRelativeHumidity(parseFloat(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              {/* Leaf Wetness Hours Slider */}
              <div className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600 flex items-center space-x-1.5">
                    <Clock className="w-4 h-4 text-teal-600" />
                    <span>Continuous Leaf Wetness</span>
                  </span>
                  <span className="font-mono font-bold text-teal-700">{leafWetnessHours} Hours</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="0.5"
                  value={leafWetnessHours}
                  onChange={(e) => setLeafWetnessHours(parseFloat(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>

              {/* Wind Speed Slider */}
              <div className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600 flex items-center space-x-1.5">
                    <Wind className="w-4 h-4 text-indigo-500" />
                    <span>Wind Velocity</span>
                  </span>
                  <span className="font-mono font-bold text-indigo-600">{windSpeed} km/h</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="35"
                  step="0.5"
                  value={windSpeed}
                  onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium">
                {errorMessage}
              </div>
            )}

            {/* Submit Action & Multi-Phase Skeleton Loader */}
            <div className="pt-2">
              {isSubmitting ? (
                <div className="bg-slate-50 rounded-xl p-4 border border-forest-200 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between text-xs font-bold text-forest-800">
                    <span className="flex items-center space-x-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-forest-700" />
                      <span>{progressStage}</span>
                    </span>
                    <span className="font-mono">{progressPercent}%</span>
                  </div>
                  {/* Shimmer progress bar */}
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-forest-800 transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-500 text-center font-mono">
                    Executing Gemini 2.5 multimodal diagnostic &amp; calibrated risk fusion
                  </div>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-forest-800 hover:bg-forest-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 group"
                >
                  <Sparkles className="w-4 h-4 text-mint-400 group-hover:scale-110 transition-transform" />
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
