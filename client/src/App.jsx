import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import DiagnosticStudioPage from './pages/DiagnosticStudioPage';
import AdvisoryDetailPage from './pages/AdvisoryDetailPage';
import FieldsPage from './pages/FieldsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import { Sprout, ShieldCheck } from 'lucide-react';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
        
        {/* Enterprise Top Navigation */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/diagnose" element={<DiagnosticStudioPage />} />
            <Route path="/advisory/:id" element={<AdvisoryDetailPage />} />
            <Route path="/fields" element={<FieldsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Enterprise Footer */}
        <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-6 h-6 rounded-md bg-forest-800 text-mint-300 flex items-center justify-center font-bold">
                <Sprout className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-slate-800">AgriGuard Enterprise</span>
              <span className="text-slate-400">— AI-Powered Micro-Climatic Pathology Platform</span>
            </div>

            <div className="flex items-center space-x-6 text-[11px] font-medium text-slate-500">
              <span className="flex items-center space-x-1.5 text-forest-800 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-forest-700" />
                <span>Zero False Chemical Alarms Standard</span>
              </span>
              <span>Gemini 2.5 Flash Multimodal</span>
              <span>Cloud Telemetry Sync</span>
            </div>
          </div>
        </footer>

      </div>
    </Router>
  );
}
