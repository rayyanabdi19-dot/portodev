import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Menu, X, Shield, ExternalLink, Download } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { data, setCurrentView, isAuthenticated } = usePortfolio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'profil', 'pendidikan', 'pengalaman', 'projek', 'skill', 'cv', 'kontak'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'Profil', href: '#profil', id: 'profil' },
    { name: 'Pendidikan', href: '#pendidikan', id: 'pendidikan' },
    { name: 'Pengalaman', href: '#pengalaman', id: 'pengalaman' },
    { name: 'Projek', href: '#projek', id: 'projek' },
    { name: 'Skill', href: '#skill', id: 'skill' },
    { name: 'CV', href: '#cv', id: 'cv' },
    { name: 'Kontak', href: '#kontak', id: 'kontak' },
  ];

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-xs border-b border-slate-200/80 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Brand */}
          <a
            href="#home"
            className="flex items-center gap-2.5 group"
            id="navbar-brand"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-orange-500 font-extrabold flex items-center justify-center text-lg shadow-sm border border-slate-800 transition-transform group-hover:scale-105">
              DA
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 tracking-tight block">
                Delv Andriawan
              </span>
              <span className="text-[11px] font-medium text-orange-600 block tracking-wider uppercase">
                Fullstack Developer
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/60 shadow-inner">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </div>

          {/* Action Buttons: CV & Admin */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="#cv"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download CV
            </a>

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
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xs"
              title="Akses Admin Dashboard"
              id="admin-portal-button"
            >
              <Shield className="w-3.5 h-3.5 text-orange-400" />
              <span>{isAuthenticated ? 'Dashboard' : 'Admin'}</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center gap-2">
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
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              title="Admin"
            >
              <Shield className="w-4 h-4 text-orange-500" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-5 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-4">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  activeSection === link.id
                    ? 'bg-orange-500 text-white'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-3 mt-2 border-t border-slate-100 flex flex-col gap-2">
              <a
                href="#cv"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 text-center rounded-xl text-sm font-semibold bg-orange-50 text-orange-700 border border-orange-200"
              >
                Download CV
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (isAuthenticated) {
                    setCurrentView('admin/dashboard');
                    window.location.hash = '/admin/dashboard';
                  } else {
                    setCurrentView('admin/login');
                    window.location.hash = '/admin/login';
                  }
                }}
                className="w-full py-2.5 px-4 text-center rounded-xl text-sm font-semibold bg-slate-900 text-white"
              >
                {isAuthenticated ? 'Buka Dashboard Admin' : 'Login Admin'}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
