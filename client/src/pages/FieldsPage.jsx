import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Plus, 
  Search, 
  Trash2, 
  ScanLine, 
  X, 
  Sprout,
  Radio 
} from 'lucide-react';
import FieldTable from '../components/FieldTable';

export default function FieldsPage() {
  const [fields, setFields] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCropFilter, setSelectedCropFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [newFieldName, setNewFieldName] = useState('');
  const [newCropType, setNewCropType] = useState('Tomato');
  const [newLocation, setNewLocation] = useState('');
  const [newLatitude, setNewLatitude] = useState('');
  const [newLongitude, setNewLongitude] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadFields = () => {
    setIsLoading(true);
    fetch('/api/fields')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFields(data.fields || []);
        }
      })
      .catch(err => console.error('Failed to load fields:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadFields();
  }, []);

  const handleCreateField = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      if (!newFieldName.trim() || !newLocation.trim()) {
        throw new Error('Field name and location are required.');
      }

      const res = await fetch('/api/fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newFieldName,
          cropType: newCropType,
          location: newLocation,
          latitude: newLatitude ? parseFloat(newLatitude) : null,
          longitude: newLongitude ? parseFloat(newLongitude) : null
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create field');
      }

      setNewFieldName('');
      setNewLocation('');
      setNewLatitude('');
      setNewLongitude('');
      setIsModalOpen(false);
      loadFields();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteField = async (fieldId) => {
    if (!window.confirm('Are you sure you want to delete this farm plot? Associated diagnostics and advisories will be removed.')) {
      return;
    }

    try {
      const res = await fetch(`/api/fields/${fieldId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setFields(prev => prev.filter(f => f.id !== fieldId));
      }
    } catch (err) {
      console.error('Failed to delete field:', err);
    }
  };

  const filteredFields = fields.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCrop = selectedCropFilter === 'All' || f.crop_type.toLowerCase() === selectedCropFilter.toLowerCase();
    return matchesSearch && matchesCrop;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & New Plot Action */}
      <div className="glass-panel-3d rounded-2xl p-6 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-neon-mint uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 text-neon-mint animate-pulse" />
            <span>Farm Plot Telemetry Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans text-glow-mint">
            Registered Agricultural Sectors
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Manage geographical farm sectors, coordinate soil vectors, and oversee crop disease vulnerability.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-forest-800 to-forest-700 hover:from-forest-700 hover:to-forest-600 border border-neon-mint/40 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-[0_0_20px_rgba(0,255,135,0.25)] transition-all self-start sm:self-auto font-mono"
        >
          <Plus className="w-4 h-4 text-neon-mint" />
          <span>Register New Sector</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel-3d rounded-2xl p-4 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sector name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-neon-mint font-mono"
          />
        </div>

        <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 font-mono">
          <span className="text-xs text-slate-400 font-bold shrink-0 mr-1">Crop:</span>
          {['All', 'Tomato', 'Potato', 'Grapes', 'Wheat', 'Rice'].map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCropFilter(crop)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                selectedCropFilter === crop
                  ? 'bg-forest-800 text-neon-mint border border-neon-mint/40 shadow-[0_0_10px_rgba(0,255,135,0.3)]'
                  : 'bg-black/30 text-slate-400 hover:text-white'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      {/* Field Table */}
      <FieldTable 
        fields={filteredFields} 
        onDelete={handleDeleteField} 
      />

      {/* Modal: Register New Farm Plot (3D Frosted Glass Modal) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="glass-panel-3d rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-4 border border-white/15">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Sprout className="w-5 h-5 text-neon-mint" />
                <h3 className="text-base font-bold text-white font-mono">Register Farm Sector</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl text-xs text-rose-300 font-mono">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateField} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Sector Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maharashtra - Nashik Vineyard Plot A"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-neon-mint"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Crop Category</label>
                <select
                  value={newCropType}
                  onChange={(e) => setNewCropType(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-neon-mint"
                >
                  <option value="Grapes" className="bg-slate-900">Grapes (Viticulture)</option>
                  <option value="Tomato" className="bg-slate-900">Tomato (Solanaceae)</option>
                  <option value="Potato" className="bg-slate-900">Potato (Solanaceae)</option>
                  <option value="Onions" className="bg-slate-900">Onion (Alliaceae)</option>
                  <option value="Wheat" className="bg-slate-900">Wheat (Cereals)</option>
                  <option value="Rice" className="bg-slate-900">Rice / Paddy (Cereals)</option>
                  <option value="Sugarcane" className="bg-slate-900">Sugarcane (Cash Crop)</option>
                  <option value="Cotton" className="bg-slate-900">Cotton (Fiber / Cash Crop)</option>
                  <option value="Soybean" className="bg-slate-900">Soybean (Oilseeds)</option>
                  <option value="Groundnuts" className="bg-slate-900">Groundnut (Oilseeds)</option>
                  <option value="Maize" className="bg-slate-900">Maize / Corn (Cereals)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Geographical Location (India Hub)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nashik / Pune (Maharashtra)"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-neon-mint"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 36.677"
                    value={newLatitude}
                    onChange={(e) => setNewLatitude(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-neon-mint"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. -121.655"
                    value={newLongitude}
                    onChange={(e) => setNewLongitude(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-neon-mint"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-black/40 hover:bg-white/10 text-slate-300 font-bold border border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-white font-bold border border-neon-mint/40 shadow-[0_0_15px_rgba(0,255,135,0.25)]"
                >
                  {isSubmitting ? 'Registering...' : 'Register Sector'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
