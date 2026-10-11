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
  ChevronDown,
  Menu,
  X
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Title */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center text-white shadow-md shadow-forest-900/10 group-hover:bg-forest-700 transition-colors">
              <Sprout className="w-5 h-5 text-mint-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight font-sans">AgriGuard</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-forest-50 text-forest-800 border border-forest-200">
                  ENTERPRISE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide">Micro-Climatic Pathology Platform</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    active
                      ? 'bg-forest-800 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-mint-300' : 'text-slate-500'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Status Badges & Quick Action */}
          <div className="hidden sm:flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-forest-600"></span>
              </span>
              <span className="font-mono text-slate-600">IoT Hub: Active</span>
            </div>

            <Link
              to="/diagnose"
              className="flex items-center space-x-1.5 bg-forest-800 hover:bg-forest-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all"
            >
              <ScanLine className="w-4 h-4 text-mint-400" />
              <span>Run Diagnostic Scan</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1.5 shadow-lg">
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
                    ? 'bg-forest-800 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-mint-300' : 'text-slate-500'}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-150">
            <Link
              to="/diagnose"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center space-x-2 w-full py-2.5 bg-forest-800 text-white text-sm font-bold rounded-lg shadow-sm"
            >
              <ScanLine className="w-4 h-4 text-mint-400" />
              <span>Run Diagnostic Scan</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
