import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import DiagnosticStudioPage from './pages/DiagnosticStudioPage';
import AdvisoryDetailPage from './pages/AdvisoryDetailPage';
import FieldsPage from './pages/FieldsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import { Sprout, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/diagnose" element={<DiagnosticStudioPage />} />
            <Route path="/advisory/:id" element={<AdvisoryDetailPage />} />
            <Route path="/fields" element={<FieldsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Application Footer */}
        <footer className="border-t border-slate-900 bg-slate-950/80 py-8 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold">
                <Sprout className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-slate-300">CropGuard AI</span>
              <span>— AI-Powered Micro-Climatic Crop Disease Early Warning System</span>
            </div>

            <div className="flex items-center space-x-6 text-[11px]">
              <span className="flex items-center space-x-1 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero False Chemical Alarms Standard</span>
              </span>
              <span>Powered by Gemini 2.5 Flash</span>
              <span>Deployed on Replit</span>
            </div>
          </div>
        </footer>

      </div>
    </Router>
  );
}
