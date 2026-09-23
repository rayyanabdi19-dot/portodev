import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Settings as SettingsType } from '../../types';
import {
  Save,
  Download,
  Upload,
  RefreshCw,
  Shield,
  Globe,
  Sparkles,
  Check,
  Key,
  Eye,
  Lock,
  Mail,
  AlertTriangle,
  RotateCcw,
  Send,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const {
    data,
    user,
    updateSettings,
    updateAdminAccount,
    resetDatabase,
    importDatabase,
    showToast,
    refreshData,
    isFirebaseConnected,
  } = usePortfolio();

  const [settings, setSettings] = useState<Partial<SettingsType>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Admin Account State
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdatingAccount, setIsUpdatingAccount] = useState(false);

  // Email SMTP Settings State
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [smtpSecure, setSmtpSecure] = useState(false);
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [isSavingSmtp, setIsSavingSmtp] = useState(false);
  const [emailTestStatus, setEmailTestStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  useEffect(() => {
    if (data?.settings) {
      setSettings(data.settings);
      if (data.settings.smtp) {
        setSmtpHost(data.settings.smtp.host || 'smtp.gmail.com');
        setSmtpPort(data.settings.smtp.port || 587);
        setSmtpUser(data.settings.smtp.user || '');
        setSmtpPass(data.settings.smtp.pass || '');
        setSmtpSecure(!!data.settings.smtp.secure);
      }
    }
    if (data?.user) {
      setAdminName(data.user.name || '');
      setAdminEmail(data.user.email || '');
    }
  }, [data?.settings, data?.user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSettings((prev) => ({ ...prev, [name]: checked }));
    } else {
      setSettings((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateSettings(settings);
    setIsSaving(false);
  };

  const handleAccountUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingAccount(true);
    const success = await updateAdminAccount({
      name: adminName,
      email: adminEmail,
      currentPassword: currentPassword || undefined,
      newPassword: newPassword || undefined,
    });
    setIsUpdatingAccount(false);
    if (success) {
      setCurrentPassword('');
      setNewPassword('');
    }
  };

  const handleSaveSmtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSmtp(true);
    await updateSettings({
      smtp: {
        host: smtpHost,
        port: Number(smtpPort),
        user: smtpUser,
        pass: smtpPass,
        secure: smtpSecure,
      },
    });
    setIsSavingSmtp(false);
    showToast('success', '✓ Pengaturan email server SMTP berhasil disimpan!');
  };

  const handleTestEmail = async () => {
    if (!smtpUser || !smtpPass) {
      showToast('error', 'Masukkan Email Akun Pengirim dan Password / App Password sebelum menguji.');
      return;
    }
    setIsTestingEmail(true);
    setEmailTestStatus(null);
    try {
      const res = await fetch('/api/auth/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: smtpHost,
          port: smtpPort,
          secure: smtpSecure,
          user: smtpUser,
          pass: smtpPass,
          recipient: adminEmail || 'rayyan.abdi19@gmail.com',
        }),
      });
      const result = await res.json();
      setEmailTestStatus(result);
      if (result.success) {
        showToast('success', result.message || 'Email uji coba berhasil dikirim!');
      } else {
        showToast('error', result.message || 'Pengiriman email uji coba gagal.');
      }
    } catch (err: any) {
      const msg = err?.message || 'Gagal menghubungi server.';
      setEmailTestStatus({ success: false, message: msg });
      showToast('error', msg);
    } finally {
      setIsTestingEmail(false);
    }
  };

  const handleExportDatabase = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', '✓ Backup data portofolio berhasil diekspor.');
  };

  const handleImportDatabase = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (confirm('Apakah Anda yakin ingin menimpa database dengan file backup ini?')) {
          await importDatabase(parsed);
        }
      } catch {
        showToast('error', 'File tidak valid atau rusak. Pastikan file berformat JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetDatabase = async () => {
    if (confirm('PERINGATAN: Apakah Anda yakin ingin mereset database ke pengaturan bawaan (default)? Semua modifikasi akan diganti dengan data awal default.')) {
      await resetDatabase();
    }
  };

  const analytics = data?.analytics || { views_count: 0, downloads_count: 0 };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Analytics Summary */}
      <div className="bg-linear-to-r from-slate-900 to-slate-800 text-white p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 inline-block mb-2">
            Statistik Real-time
          </span>
          <h2 className="text-xl sm:text-2xl font-black">Aktivitas Pengunjung Portofolio</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-md">
            Pelacakan interaksi langsung setiap kali pengunjung membuka halaman atau mengunduh dokumen CV.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-slate-950/60 border border-slate-700 p-4 rounded-2xl min-w-[120px] text-center">
            <span className="text-xs text-slate-400 block mb-1">Total Kunjungan</span>
            <span className="text-2xl font-black text-white">{analytics.views_count || 1}</span>
          </div>
          <div className="bg-slate-950/60 border border-slate-700 p-4 rounded-2xl min-w-[120px] text-center">
            <span className="text-xs text-slate-400 block mb-1">Download CV</span>
            <span className="text-2xl font-black text-orange-400">{analytics.downloads_count || 0}</span>
          </div>
        </div>
      </div>

      {/* Website & SEO Settings Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Pengaturan Website & SEO</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Konfigurasi metadata, tema, visibilitas download CV, dan preferensi sistem.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Judul Website (SEO Title) *
              </label>
              <input
                type="text"
                name="site_title"
                value={settings.site_title || ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Warna Aksen Primer
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="primary_color"
                  value={settings.primary_color || '#F97316'}
                  onChange={handleChange}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 p-1"
                />
                <span className="text-xs font-mono font-bold text-slate-700">
                  {settings.primary_color || '#F97316'} (Orange Accent)
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Deskripsi Meta SEO
            </label>
            <textarea
              name="site_description"
              rows={2}
              value={settings.site_description || ''}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Visibilitas Fitur
            </h3>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="allow_cv_download"
                name="allow_cv_download"
                checked={settings.allow_cv_download ?? true}
                onChange={handleChange}
                className="rounded text-orange-500 focus:ring-orange-500"
              />
              <label htmlFor="allow_cv_download" className="text-xs font-medium text-slate-700 cursor-pointer">
                Izinkan pengunjung publik mengunduh CV format PDF
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="show_hire_badge"
                name="show_hire_badge"
                checked={settings.show_hire_badge ?? true}
                onChange={handleChange}
                className="rounded text-orange-500 focus:ring-orange-500"
              />
              <label htmlFor="show_hire_badge" className="text-xs font-medium text-slate-700 cursor-pointer">
                Tampilkan status "Open for Projects / Ketersediaan Kerja" di Hero Section
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs shadow-md transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Admin Account Security & Password Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs">
        <form onSubmit={handleAccountUpdate} className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Keamanan Akun & Kredensial Admin</h2>
              <p className="text-xs text-slate-500">
                Ubah nama akun, email login admin, dan perbarui kata sandi sistem.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Nama Admin
              </label>
              <input
                type="text"
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Email Login Admin
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Kata Sandi Lama (jika ingin mengganti)
              </label>
              <input
                type="password"
                placeholder="Masukkan kata sandi saat ini"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Kata Sandi Baru (minimal 4 karakter)
              </label>
              <input
                type="password"
                placeholder="Masukkan kata sandi baru"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isUpdatingAccount}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
            >
              <Lock className="w-4 h-4 text-orange-400" />
              <span>{isUpdatingAccount ? 'Memperbarui...' : 'Simpan Kredensial Akun'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Real Email Server (SMTP & 2FA OTP) Integration Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
        <form onSubmit={handleSaveSmtp} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Integrasi Server Email (SMTP & Pengiriman OTP Nyata)</h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-600 border border-orange-500/20">
                  Pengiriman Langsung ke Inbox
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Konfigurasi akun pengirim email untuk mengirimkan 6-digit kode verifikasi 2FA langsung ke email Anda (<strong>{adminEmail || 'rayyan.abdi19@gmail.com'}</strong>).
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-orange-500" />
              <span>Panduan Akun Gmail (Rekomendasi Google):</span>
            </p>
            <p className="text-[11px] leading-relaxed text-slate-600">
              Jika menggunakan Gmail, gunakan <strong>Sandi Aplikasi (App Password)</strong> 16-karakter dari Akun Google Anda:
              <br />
              1. Buka <em>myaccount.google.com</em> &rarr; <em>Keamanan (Security)</em> &rarr; Aktifkan <em>Verifikasi 2 Langkah</em>.
              <br />
              2. Buat <em>Sandi Aplikasi (App Password)</em> baru dan tempelkan 16 karakter password tersebut pada kolom kata sandi di bawah.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                SMTP Server Host *
              </label>
              <input
                type="text"
                required
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
                placeholder="smtp.gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                SMTP Port *
              </label>
              <input
                type="number"
                required
                value={smtpPort}
                onChange={(e) => setSmtpPort(Number(e.target.value))}
                placeholder="587"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Email Pengirim (SMTP User) *
              </label>
              <input
                type="email"
                value={smtpUser}
                onChange={(e) => setSmtpUser(e.target.value)}
                placeholder="contoh@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Kata Sandi SMTP / App Password Google (16 Karakter) *
              </label>
              <input
                type="password"
                value={smtpPass}
                onChange={(e) => setSmtpPass(e.target.value)}
                placeholder="xxxx xxxx xxxx xxxx"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 font-mono"
              />
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={smtpSecure}
                  onChange={(e) => setSmtpSecure(e.target.checked)}
                  className="rounded text-orange-500 focus:ring-orange-500"
                />
                <span>Gunakan Koneksi SSL/TLS (Port 465)</span>
              </label>
            </div>
          </div>

          {emailTestStatus && (
            <div
              className={`p-3.5 rounded-xl text-xs font-medium border ${
                emailTestStatus.success
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-700'
              }`}
            >
              {emailTestStatus.message}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleTestEmail}
              disabled={isTestingEmail || !smtpUser || !smtpPass}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs border border-orange-200 transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isTestingEmail ? 'Mengirim Email Uji Coba...' : `Kirim Email Uji Coba ke ${adminEmail || 'Admin'}`}</span>
            </button>

            <button
              type="submit"
              disabled={isSavingSmtp}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-orange-400" />
              <span>{isSavingSmtp ? 'Menyimpan...' : 'Simpan Pengaturan Server Email'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Firebase Cloud Firestore Integration Status Card */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold border border-orange-500/30">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Google Firebase & Cloud Firestore</h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Terhubung & Aktif
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Konfigurasi cloud database Firestore tersinkronisasi untuk penyimpanan pesan kontak dan analitik.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-800 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">Project ID</span>
            <code className="text-orange-300 font-mono font-medium text-[11px] block truncate">gen-lang-client-0254900148</code>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">Cloud Region</span>
            <span className="text-white font-medium text-[11px] block">europe-west2 (London)</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">Security Rules</span>
            <span className="text-emerald-300 font-medium text-[11px] block">firestore.rules (ABAC v2)</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">Akses Kontrol</span>
            <span className="text-emerald-300 font-medium text-[11px] block truncate">Terproteksi (RBAC Admin)</span>
          </div>
        </div>
      </div>

      {/* Database Backup, Import, and Reset Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">Manajemen & Pemeliharaan Database</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadangkan data lengkap portofolio, pulihkan dari cadangan file JSON, atau reset ke pengaturan awal pabrik.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          {/* Export JSON */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-1">Ekspor Database JSON</h4>
              <p className="text-[11px] text-slate-500 mb-4">
                Unduh file snapshot data portofolio lengkap ke perangkat Anda.
              </p>
            </div>
            <button
              onClick={handleExportDatabase}
              className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5 text-orange-600" />
              <span>Unduh Backup JSON</span>
            </button>
          </div>

          {/* Import JSON */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-1">Impor File Backup</h4>
              <p className="text-[11px] text-slate-500 mb-4">
                Pulihkan atau perbarui seluruh data dari berkas JSON tersimpan.
              </p>
            </div>
            <label className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-indigo-600" />
              <span>Pilih File JSON</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleImportDatabase}
                className="hidden"
              />
            </label>
          </div>

          {/* Factory Reset */}
          <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-rose-900 mb-1">Reset Database</h4>
              <p className="text-[11px] text-rose-600/80 mb-4">
                Kembalikan seluruh isi database ke pengaturan contoh bawaan awal.
              </p>
            </div>
            <button
              onClick={handleResetDatabase}
              className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset ke Default</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
