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
  CheckCircle2
} from 'lucide-react';

const PRESET_BENCHMARKS = [
  {
    title: 'Tomato Late Blight (High Epidemic Vector)',
    cropType: 'Tomato',
    growthStage: 'Fruit Development',
    symptomDescription: 'Water-soaked irregular dark olive-brown lesions on leaf margins with pale halo.',
    temperature: 19.5,
    relativeHumidity: 92.0,
    leafWetnessHours: 9.0,
    windSpeed: 5.5,
    imageSrc: '/samples/tomato_late_blight.jpg'
  },
  {
    title: 'Dry Spell Lesion (False Chemical Alarm Prevention)',
    cropType: 'Tomato',
    growthStage: 'Vegetative',
    symptomDescription: 'Old brown lesions observed, but ambient conditions are dry and hot.',
    temperature: 28.0,
    relativeHumidity: 52.0,
    leafWetnessHours: 1.5,
    windSpeed: 7.0,
    imageSrc: '/samples/tomato_late_blight.jpg'
  },
  {
    title: 'Potato Early Blight (Concentric Rings)',
    cropType: 'Potato',
    growthStage: 'Vegetative',
    symptomDescription: 'Concentric ring target lesions on mature leaves.',
    temperature: 24.5,
    relativeHumidity: 68.0,
    leafWetnessHours: 4.0,
    windSpeed: 8.0,
    imageSrc: '/samples/potato_early_blight.jpg'
  },
  {
    title: 'Grape Powdery Mildew (Vineyard Specimen)',
    cropType: 'Grapes',
    growthStage: 'Flowering',
    symptomDescription: 'White powdery patches on adaxial leaf surface.',
    temperature: 23.0,
    relativeHumidity: 85.0,
    leafWetnessHours: 6.5,
    windSpeed: 4.5,
    imageSrc: '/samples/grape_powdery_mildew.jpg'
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
  const [symptomDescription, setSymptomDescription] = useState('Water-soaked dark lesions spreading on margins');
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

  // Execute diagnostic submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      setProgressStage('1/4: Ingesting high-resolution foliar image...');
      await new Promise(r => setTimeout(r, 600));

      setProgressStage('2/4: Invoking Gemini 2.5 Flash multimodal vision...');
      await new Promise(r => setTimeout(r, 800));

      setProgressStage('3/4: Fusing micro-climatic environmental vectors...');
      await new Promise(r => setTimeout(r, 600));

      setProgressStage('4/4: Calibrating intervention viability to prevent false alarms...');

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

      // Success: Navigate to advisory details
      navigate(`/advisory/${data.advisoryId}`);
    } catch (err) {
      console.error('Submission failed:', err);
      setErrorMessage(err.message || 'An error occurred during diagnostic analysis');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Multimodal Plant Pathology & Weather Fusion Studio</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Crop Disease Early Warning Studio
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Upload or capture high-resolution imagery of symptomatic crop foliage. The system passes visual vectors to Gemini 2.5 Flash and synchronously models micro-climatic sporulation risk to prevent false alarms.
        </p>
      </div>

      {/* Benchmark Specimen Quick Bar */}
      <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>1-Click Benchmark Test Specimens</span>
          </span>
          <span className="text-[11px] text-slate-500">Instant test load</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PRESET_BENCHMARKS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadBenchmarkPreset(preset)}
              className="text-left p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 hover:border-emerald-500/50 border border-slate-750 transition-all group"
            >
              <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                {preset.title}
              </div>
              <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-1 font-mono">
                <span>{preset.cropType}</span>
                <span>•</span>
                <span>{preset.relativeHumidity}% RH</span>
                <span>•</span>
                <span>{preset.leafWetnessHours}h Wet</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Diagnostic Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Image Upload & Visual Evidence (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>Visual Foliar Specimen</span>
              </h3>
              <div className="flex items-center space-x-2">
                {!isCameraActive ? (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="flex items-center space-x-1 text-xs px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Live Cam</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="text-xs px-2.5 py-1 rounded-md bg-rose-900/40 text-rose-300 border border-rose-800/50"
                  >
                    Cancel Cam
                  </button>
                )}
              </div>
            </div>

            {/* Camera Viewfinder or Image Preview */}
            <div className="relative aspect-video sm:aspect-square w-full rounded-xl overflow-hidden bg-slate-950 border-2 border-dashed border-slate-750 flex items-center justify-center">
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
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg flex items-center space-x-1.5"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Capture Leaf Photo</span>
                  </button>
                </div>
              ) : previewUrl ? (
                <div className="relative w-full h-full group">
                  <img
                    src={previewUrl}
                    alt="Crop Specimen Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold shadow-md hover:bg-emerald-500"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer text-center p-6 space-y-2 hover:text-emerald-400 transition-colors"
                >
                  <UploadCloud className="w-10 h-10 mx-auto text-slate-500" />
                  <div className="text-xs font-semibold text-slate-300">
                    Click to browse or drag & drop foliar image
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Supports high-res JPEG, PNG, WebP up to 10MB
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

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>Pathogen visual resolution:</span>
              <span className="font-mono text-emerald-400">Gemini 2.5 Flash Active</span>
            </div>
          </div>
        </div>

        {/* Right Column: Agronomic Metadata & Micro-Climatic Parameters (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5">
            
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2 pb-3 border-b border-slate-800">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Agronomic Metadata & Micro-Climate Vectors</span>
            </h3>

            {/* Field Plot & Crop Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Farm Plot Target
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
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
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
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Crop Category
                </label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
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
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Phenological Growth Stage
                </label>
                <select
                  value={growthStage}
                  onChange={(e) => setGrowthStage(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Vegetative">Vegetative Canopy</option>
                  <option value="Flowering">Flowering / Inflorescence</option>
                  <option value="Fruit Development">Fruit Development / Tuber Bulk</option>
                  <option value="Maturation">Heading / Pre-Harvest</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Field Coordinates / Location
                </label>
                <input
                  type="text"
                  value={fieldLocation}
                  onChange={(e) => setFieldLocation(e.target.value)}
                  placeholder="e.g. Salinas Valley, Sector 12"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Symptom Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Observed Symptom Pathology Notes
              </label>
              <textarea
                rows="2"
                value={symptomDescription}
                onChange={(e) => setSymptomDescription(e.target.value)}
                placeholder="Describe lesion morphology, presence of halos, spore dust, or leaf curling..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Micro-Climatic Vector Sliders */}
            <div className="pt-2 border-t border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Micro-Climatic Sensor Vectors
                </span>
                {relativeHumidity > 85 && leafWetnessHours >= 6 && (
                  <span className="text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30 flex items-center space-x-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Critical Sporulation Vector Triggered</span>
                  </span>
                )}
                {relativeHumidity < 68 && leafWetnessHours < 3.5 && (
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>False Spray Alarm Suppression Active</span>
                  </span>
                )}
              </div>

              {/* Temperature Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 flex items-center space-x-1">
                    <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ambient Temperature</span>
                  </span>
                  <span className="font-mono font-bold text-white">{temperature}°C</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="0.5"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              {/* Relative Humidity Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 flex items-center space-x-1">
                    <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Relative Humidity</span>
                  </span>
                  <span className="font-mono font-bold text-cyan-400">{relativeHumidity}% RH</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="1"
                  value={relativeHumidity}
                  onChange={(e) => setRelativeHumidity(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              {/* Leaf Wetness Hours Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>Continuous Leaf Wetness Duration</span>
                  </span>
                  <span className="font-mono font-bold text-blue-400">{leafWetnessHours} Hours</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="0.5"
                  value={leafWetnessHours}
                  onChange={(e) => setLeafWetnessHours(parseFloat(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              {/* Wind Speed Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 flex items-center space-x-1">
                    <Wind className="w-3.5 h-3.5 text-teal-400" />
                    <span>Wind Velocity</span>
                  </span>
                  <span className="font-mono font-bold text-teal-400">{windSpeed} km/h</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="35"
                  step="0.5"
                  value={windSpeed}
                  onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
                  className="w-full accent-teal-500"
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-300">
                {errorMessage}
              </div>
            )}

            {/* Submit Action & Loading Progress */}
            <div className="pt-3">
              {isSubmitting ? (
                <div className="bg-slate-800/80 rounded-xl p-4 border border-emerald-500/40 space-y-2">
                  <div className="flex items-center space-x-3 text-emerald-400 text-xs font-semibold">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{progressStage}</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 animate-pulse w-3/4"></div>
                  </div>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-950 transition-all flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Execute Multimodal AI Diagnostic & Risk Fusion</span>
                </button>
              )}
            </div>

          </div>
        </div>

      </form>
    </div>
  );
}
