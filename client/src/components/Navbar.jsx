import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sprout, 
  Activity, 
  MapPin, 
  BarChart3, 
  ScanLine, 
  ShieldCheck, 
  Radio, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: Activity },
    { name: 'Diagnostic Studio', path: '/diagnose', icon: ScanLine },
    { name: 'Farm Plots', path: '/fields', icon: MapPin },
    { name: 'Epidemic Analytics', path: '/analytics', icon: BarChart3 },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#081711]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Title */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-800 to-forest-900 border border-neon-mint/30 flex items-center justify-center text-white shadow-[0_0_20px_rgba(0,255,135,0.25)] group-hover:scale-105 transition-all">
              <Sprout className="w-5 h-5 text-neon-mint" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg text-white tracking-tight font-sans text-glow-mint">
                  AgriGuard
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest-800/80 text-neon-mint border border-neon-mint/30 shadow-[0_0_10px_rgba(0,255,135,0.2)] font-mono">
                  3D CONTROL
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase font-mono">
                Micro-Climatic Defense System
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links (Floating Glass Pill) */}
          <nav className="hidden md:flex items-center space-x-1.5 bg-black/40 p-1.5 rounded-xl border border-white/10 backdrop-blur-md">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    active
                      ? 'bg-gradient-to-r from-forest-800 to-forest-700 text-white border border-neon-mint/40 shadow-[0_0_15px_rgba(0,255,135,0.25)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-neon-mint' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Status Badges & Quick Action */}
          <div className="hidden sm:flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-forest-900/60 border border-emerald-500/30 text-xs text-emerald-300 font-mono shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-mint opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span>Canopy IoT: Active</span>
            </div>

            <Link
              to="/diagnose"
              className="flex items-center space-x-1.5 bg-gradient-to-r from-forest-800 to-forest-700 hover:from-forest-700 hover:to-forest-600 border border-neon-mint/40 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-[0_0_20px_rgba(0,255,135,0.25)] transition-all hover:scale-102"
            >
              <ScanLine className="w-4 h-4 text-neon-mint" />
              <span>Laser Diagnostic Scan</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#081711]/95 backdrop-blur-2xl border-b border-white/10 px-4 pt-2 pb-4 space-y-1.5 shadow-2xl">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  active
                    ? 'bg-forest-800 text-white border border-neon-mint/30'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-neon-mint' : 'text-slate-400'}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-white/10">
            <Link
              to="/diagnose"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center space-x-2 w-full py-2.5 bg-forest-800 text-white text-sm font-bold rounded-lg border border-neon-mint/30 shadow-[0_0_15px_rgba(0,255,135,0.25)]"
            >
              <ScanLine className="w-4 h-4 text-neon-mint" />
              <span>Launch Laser Scan</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
