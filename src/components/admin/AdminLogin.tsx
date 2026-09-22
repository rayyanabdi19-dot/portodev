import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Shield, ShieldCheck, Lock, Mail, ArrowLeft, Eye, EyeOff, KeyRound, RefreshCw } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { login, verifyOtp, resendOtp, loginGoogle, resetPassword, setCurrentView } = usePortfolio();

  // Authentication Flow Steps: 'credentials' -> 'otp'
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [email, setEmail] = useState('rayyan.abdi19@gmail.com');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [tempSessionId, setTempSessionId] = useState('');
  const [targetEmail, setTargetEmail] = useState('');
  const [otpPreview, setOtpPreview] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Step 1: Submit Credentials
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success && result.requireOtp && result.tempSessionId) {
      setTempSessionId(result.tempSessionId);
      setTargetEmail(result.email || email);
      setOtpPreview(result.otpPreview || null);
      setStep('otp');
      setResendCooldown(30);
      setOtpCode('');
    } else if (!result.success) {
      setErrorMsg(result.message || 'Kredensial tidak valid. Silakan coba kembali.');
    }
  };

  // Step 2: Verify 6-digit OTP Code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length < 6) {
      setErrorMsg('Masukkan 6-digit kode autentikasi yang dikirim ke email Anda.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    const success = await verifyOtp(tempSessionId, otpCode.trim());
    setIsSubmitting(false);

    if (!success) {
      setErrorMsg('Kode autentikasi tidak sesuai atau telah kedaluwarsa. Silakan periksa kembali.');
    }
  };

  // Resend OTP Code
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isResending) return;
    setErrorMsg('');
    setIsResending(true);

    const newPreview = await resendOtp(tempSessionId);
    setIsResending(false);

    if (newPreview) {
      setOtpPreview(newPreview);
    }
    setResendCooldown(30);
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

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setIsGoogleSubmitting(true);
    const success = await loginGoogle();
    setIsGoogleSubmitting(false);
    if (!success) {
      setErrorMsg('Autentikasi Google Firebase gagal atau dibatalkan.');
    }
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
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors py-2 px-3 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Portofolio</span>
      </button>

      <div className="w-full max-w-md bg-slate-950/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md relative z-10 animate-in zoom-in-95">
        {/* Step 1: Credential Input Form */}
        {step === 'credentials' ? (
          <>
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
                    className="text-[11px] font-semibold text-orange-400 hover:text-orange-300 transition-colors disabled:opacity-50"
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
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                    aria-label="Toggle password view"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isGoogleSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-98 text-slate-950 font-black text-sm shadow-lg shadow-orange-500/25 transition-all mt-6 disabled:opacity-50"
              >
                {isSubmitting ? 'Memverifikasi...' : 'Lanjutkan ke Verifikasi Kode'}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-slate-950 px-3 text-slate-500 font-semibold">Atau</span>
              </div>
            </div>

            {/* Google Firebase Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleSubmitting || isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isGoogleSubmitting ? 'Membuka Google Popup...' : 'Masuk dengan Google (Firebase)'}</span>
            </button>
          </>
        ) : (
          /* Step 2: 2FA OTP Code Verification */
          <div className="space-y-6 animate-in fade-in zoom-in-95">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black text-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/10">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">Verifikasi Dua Langkah</h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Kode autentikasi 6-digit telah dikirimkan ke email:
                <br />
                <span className="text-orange-400 font-semibold">{targetEmail}</span>
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {/* Email OTP Delivery Notice / Preview */}
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
                <Mail className="w-3.5 h-3.5" />
                <span>Pesan Verifikasi Terkirim</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Silakan periksa kotak masuk atau folder spam email Anda.
              </p>
              {otpPreview && (
                <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Kode Verifikasi:</span>
                  <span className="font-mono font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    {otpPreview}
                  </span>
                </div>
              )}
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider text-center mb-2">
                  Masukkan 6-Digit Kode Autentikasi
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    maxLength={6}
                    required
                    autoFocus
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full text-center font-mono font-bold text-xl tracking-[0.5em] py-3.5 pl-10 pr-4 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-600 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || otpCode.length < 6}
                className="w-full py-3.5 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-98 text-slate-950 font-black text-sm shadow-lg shadow-orange-500/25 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Memverifikasi Kode...' : 'Verifikasi & Masuk ke Dashboard'}
              </button>
            </form>

            <div className="flex items-center justify-between pt-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setStep('credentials');
                  setErrorMsg('');
                  setOtpCode('');
                }}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ← Ganti Email / Password
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || isResending}
                className="text-orange-400 hover:text-orange-300 transition-colors disabled:opacity-50 flex items-center gap-1 font-semibold"
              >
                <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
                <span>
                  {resendCooldown > 0 ? `Kirim ulang (${resendCooldown}s)` : 'Kirim Ulang Kode'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
