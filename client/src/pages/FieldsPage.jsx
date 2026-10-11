import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  ScanLine, 
  X, 
  Check, 
  AlertCircle,
  Sprout
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

      // Reset and close
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

  // Filtered list
  const filteredFields = fields.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCrop = selectedCropFilter === 'All' || f.crop_type.toLowerCase() === selectedCropFilter.toLowerCase();
    return matchesSearch && matchesCrop;
  });

  return (
    <div className="space-y-8">
      
      {/* Header & New Plot Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4" />
            <span>Farm Plot Management</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Registered Agricultural Plots
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Manage geographical farm plots, coordinate soil vectors, and oversee crop disease vulnerability.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-950 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Plot</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search plot name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-750 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-400 font-semibold shrink-0">Crop:</span>
          {['All', 'Tomato', 'Potato', 'Grapes', 'Wheat', 'Rice'].map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCropFilter(crop)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                selectedCropFilter === crop
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
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

      {/* Modal: Register New Farm Plot */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Sprout className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">Register Farm Plot</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-300">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateField} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Plot Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. South Ridge Tomato Sector 5"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Crop Type</label>
                <select
                  value={newCropType}
                  onChange={(e) => setNewCropType(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Tomato">Tomato</option>
                  <option value="Potato">Potato</option>
                  <option value="Grapes">Grapes</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Rice">Rice</option>
                  <option value="Corn">Corn</option>
                  <option value="Soybean">Soybean</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Geographical Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Columbia Basin, Sector 4"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
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
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
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
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-950"
                >
                  {isSubmitting ? 'Registering...' : 'Register Plot'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
