import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Shield, Heart, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, isAuthenticated } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 py-14 border-t border-slate-900 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-slate-950 font-extrabold flex items-center justify-center text-sm shadow-sm">
              DA
            </div>
            <div>
              <span className="text-white font-bold text-base block tracking-tight">Delv Andriawan</span>
              <span className="text-xs text-slate-500 block">Personal Portfolio & CV Management System</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <a href="#profil" className="hover:text-white transition-colors">Profil</a>
            <a href="#projek" className="hover:text-white transition-colors">Projek</a>
            <a href="#skill" className="hover:text-white transition-colors">Skill</a>
            <a href="#cv" className="hover:text-white transition-colors">CV</a>
            <a href="#kontak" className="hover:text-white transition-colors">Kontak</a>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => {
                if (isAuthenticated) {
                  setCurrentView('admin/dashboard');
                  window.location.hash = '/admin/dashboard';
                } else {
                  setCurrentView('admin/login');
                  window.location.hash = '/admin/login';
                }
              }}
              className="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Delv Andriawan. Built with passion & technology.</p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors p-1"
          >
            <span>Kembali ke atas</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
