import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  Lock,
  Mail,
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { login, resetPassword, setCurrentView } = usePortfolio();

  const [email, setEmail] = useState(() => localStorage.getItem('delv_admin_saved_email') || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('Email dan kata sandi wajib diisi.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    const result = await login(email.trim(), password);
    setIsSubmitting(false);

    if (result.success) {
      localStorage.setItem('delv_admin_saved_email', email.trim());
    } else {
      setErrorMsg(result.message || 'Kredensial tidak valid. Silakan periksa kembali email dan kata sandi Anda.');
    }
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setErrorMsg('Ketikkan alamat email Anda pada kolom di atas untuk menerima tautan reset kata sandi.');
      return;
    }
    setErrorMsg('');
    setIsResetting(true);
    await resetPassword(email.trim());
    setIsResetting(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Return to website link */}
      <button
        onClick={() => {
          setCurrentView('public');
          window.location.hash = '';
        }}
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors py-2 px-3 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-xs cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Portofolio</span>
      </button>

      <div className="w-full max-w-md bg-slate-950/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md relative z-10 animate-in zoom-in-95">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-orange-500 text-slate-950 font-black text-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/20">
            DA
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Admin Dashboard Login</h1>
          <p className="text-xs text-slate-400 mt-1.5">
            Sistem Manajemen Portofolio & CV — Delv Andriawan
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">
              Email Administrator
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Kata Sandi
              </label>
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={isResetting}
                className="text-[11px] font-semibold text-orange-400 hover:text-orange-300 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isResetting ? 'Mengirim...' : 'Lupa kata sandi?'}
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
                aria-label="Toggle password view"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-98 text-slate-950 font-black text-sm shadow-lg shadow-orange-500/25 transition-all mt-6 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSubmitting ? 'Memverifikasi...' : 'Masuk ke Dashboard'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
