import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import DiagnosticStudioPage from './pages/DiagnosticStudioPage';
import AdvisoryDetailPage from './pages/AdvisoryDetailPage';
import FieldsPage from './pages/FieldsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AgriGuardChatbot from './components/AgriGuardChatbot';
import { Sprout, ShieldCheck, Radio } from 'lucide-react';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#081711] text-slate-100 font-sans selection:bg-emerald-500 selection:text-black">
        
        {/* Floating 3D Navigation Bar */}
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

        {/* Floating 3D AgriGuard Expert Chatbot */}
        <AgriGuardChatbot />

        {/* Futuristic Glassmorphic Footer */}
        <footer className="border-t border-white/10 bg-[#081711]/90 backdrop-blur-xl py-6 text-xs text-slate-400 font-mono">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-6 h-6 rounded-lg bg-forest-800 text-neon-mint flex items-center justify-center font-bold border border-neon-mint/30 shadow-[0_0_10px_rgba(0,255,135,0.25)]">
                <Sprout className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-white text-glow-mint">AgriGuard 3D</span>
              <span className="text-slate-400">— Futuristic Micro-Climatic Agritech Control Center</span>
            </div>

            <div className="flex items-center space-x-6 text-[11px] font-medium text-slate-400">
              <span className="flex items-center space-x-1.5 text-neon-mint font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-neon-mint" />
                <span>Zero False Alarms Standard</span>
              </span>
              <span>Gemini 2.5 Flash Multimodal</span>
              <span>3D Zoned Telemetry</span>
            </div>
          </div>
        </footer>

      </div>
    </Router>
  );
}
