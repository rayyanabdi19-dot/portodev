import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PortfolioData,
  Profile,
  Education,
  Experience,
  Project,
  Skill,
  Certification,
  CV,
  Settings,
  User,
  ToastMessage,
  ToastType,
} from '../types';
import {
  db,
  auth,
  loginWithGoogle,
  loginWithEmailFirebase,
  logoutFirebase,
  sendFirebasePasswordReset,
  testFirestoreConnection,
} from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export interface LoginStepResult {
  success: boolean;
  requireOtp?: boolean;
  tempSessionId?: string;
  email?: string;
  message?: string;
  otpPreview?: string;
}

interface PortfolioContextType {
  data: PortfolioData | null;
  isLoading: boolean;
  user: User | null;
  isAuthenticated: boolean;
  toasts: ToastMessage[];
  currentView: string;
  setCurrentView: (view: string) => void;
  showToast: (type: ToastType, message: string) => void;
  removeToast: (id: string) => void;
  login: (email: string, password: string) => Promise<LoginStepResult>;
  verifyOtp: (tempSessionId: string, code: string) => Promise<boolean>;
  resendOtp: (tempSessionId: string) => Promise<string | null>;
  loginGoogle: () => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  logout: () => void;
  refreshData: () => Promise<void>;
  isFirebaseConnected: boolean;

  // CRUD Actions
  updateProfile: (profile: Partial<Profile>) => Promise<boolean>;
  
  createEducation: (edu: Omit<Education, 'id'>) => Promise<boolean>;
  updateEducation: (id: string, edu: Partial<Education>) => Promise<boolean>;
  deleteEducation: (id: string) => Promise<boolean>;

  createExperience: (exp: Omit<Experience, 'id'>) => Promise<boolean>;
  updateExperience: (id: string, exp: Partial<Experience>) => Promise<boolean>;
  deleteExperience: (id: string) => Promise<boolean>;

  createProject: (proj: Omit<Project, 'id' | 'slug'>) => Promise<boolean>;
  updateProject: (id: string, proj: Partial<Project>) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;

  createSkill: (skill: Omit<Skill, 'id'>) => Promise<boolean>;
  updateSkill: (id: string, skill: Partial<Skill>) => Promise<boolean>;
  deleteSkill: (id: string) => Promise<boolean>;

  createCertification: (cert: Omit<Certification, 'id'>) => Promise<boolean>;
  updateCertification: (id: string, cert: Partial<Certification>) => Promise<boolean>;
  deleteCertification: (id: string) => Promise<boolean>;

  createCV: (cv: Omit<CV, 'id'>) => Promise<boolean>;
  updateCV: (id: string, cv: Partial<CV>) => Promise<boolean>;
  setActiveCV: (id: string) => Promise<boolean>;
  deleteCV: (id: string) => Promise<boolean>;

  updateSettings: (settings: Partial<Settings>) => Promise<boolean>;
  activeCV: CV | null;

  // Messaging & Inbox
  sendMessage: (msg: { name: string; email: string; phone?: string; subject?: string; message: string }) => Promise<boolean>;
  toggleMessageRead: (id: string) => Promise<boolean>;
  deleteMessage: (id: string) => Promise<boolean>;

  // Analytics
  trackView: () => Promise<void>;
  trackDownloadCV: () => Promise<void>;

  // Media / File Upload
  uploadMedia: (file: File) => Promise<string | null>;

  // Account & Database Maintenance
  updateAdminAccount: (payload: { name?: string; email?: string; currentPassword?: string; newPassword?: string }) => Promise<boolean>;
  resetDatabase: () => Promise<boolean>;
  importDatabase: (jsonData: any) => Promise<boolean>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [currentView, setCurrentView] = useState<string>('public');

  const showToast = (type: ToastType, message: string) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);

  const refreshData = async () => {
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
      showToast('error', 'Gagal memuat data dari server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    // Test Firestore connectivity
    testFirestoreConnection().catch(() => setIsFirebaseConnected(false));

    // Listen to Firebase Auth state for real-time secure session persistence
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const token = await fbUser.getIdToken();
          const adminUser: User = {
            id: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Administrator',
            email: fbUser.email || '',
            role: 'admin',
          };
          setUser(adminUser);
          localStorage.setItem('delv_admin_token', token);
          localStorage.setItem('delv_admin_user', JSON.stringify(adminUser));
        } catch (e) {
          console.warn('Failed to obtain Firebase ID token:', e);
        }
      } else {
        // If current session is a Firebase session, clear it on sign out
        const savedToken = localStorage.getItem('delv_admin_token');
        if (savedToken && !savedToken.startsWith('jwt_')) {
          setUser(null);
          localStorage.removeItem('delv_admin_token');
          localStorage.removeItem('delv_admin_user');
        }
      }
    });

    // Track session view once
    if (!sessionStorage.getItem('portfolio_viewed')) {
      sessionStorage.setItem('portfolio_viewed', '1');
      fetch('/api/analytics/view', { method: 'POST' }).catch(() => {});
    }

    // Check localStorage auth
    const savedToken = localStorage.getItem('delv_admin_token');
    const savedUser = localStorage.getItem('delv_admin_user');
    if (savedToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('delv_admin_token');
        localStorage.removeItem('delv_admin_user');
      }
    }

    // Hash route sync if present
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('/admin')) {
        setCurrentView(hash.replace('/', ''));
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => {
      window.removeEventListener('hashchange', handleHash);
      unsubscribeAuth();
    };
  }, []);

  const login = async (email: string, password: string): Promise<LoginStepResult> => {
    const cleanEmail = email.trim();
    try {
      // 1. Primary: Verify credentials and initiate Two-Step Authentication via backend
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
      });
      const result = await res.json();

      if (result.success && result.requireOtp) {
        showToast('info', `Kode autentikasi 6-digit telah dikirim ke email: ${result.email || cleanEmail}`);
        return {
          success: true,
          requireOtp: true,
          tempSessionId: result.tempSessionId,
          email: result.email || cleanEmail,
          message: result.message,
          otpPreview: result.otpPreview,
        };
      }

      if (result.success && result.token) {
        setUser(result.user);
        localStorage.setItem('delv_admin_token', result.token);
        localStorage.setItem('delv_admin_user', JSON.stringify(result.user));
        showToast('success', '✓ Selamat datang di Dashboard Admin!');
        setCurrentView('admin/dashboard');
        window.location.hash = '/admin/dashboard';
        return { success: true };
      }

      // If backend rejected credentials, attempt Firebase Authentication
      try {
        const fbUser = await loginWithEmailFirebase(cleanEmail, password);
        const token = await fbUser.getIdToken();
        const adminUser: User = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Administrator',
          email: fbUser.email || cleanEmail,
          role: 'admin',
        };
        setUser(adminUser);
        localStorage.setItem('delv_admin_token', token);
        localStorage.setItem('delv_admin_user', JSON.stringify(adminUser));
        showToast('success', `✓ Berhasil login dengan Firebase Authentication!`);
        setCurrentView('admin/dashboard');
        window.location.hash = '/admin/dashboard';
        return { success: true };
      } catch (fbErr: any) {
        console.warn('Firebase email auth attempt:', fbErr?.code || fbErr?.message);
        let message = result.message || 'Email atau kata sandi tidak valid. Periksa kembali kredensial Anda.';
        if (fbErr?.code === 'auth/wrong-password') {
          message = 'Kata sandi tidak sesuai.';
        } else if (fbErr?.code === 'auth/invalid-email') {
          message = 'Format alamat email tidak valid.';
        }
        showToast('error', message);
        return { success: false, message };
      }
    } catch (err: any) {
      console.error('Login process error:', err);
      const msg = 'Terjadi kesalahan jaringan saat proses login.';
      showToast('error', msg);
      return { success: false, message: msg };
    }
  };

  const verifyOtp = async (tempSessionId: string, code: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempSessionId, code }),
      });
      const result = await res.json();
      if (result.success && result.token) {
        setUser(result.user);
        localStorage.setItem('delv_admin_token', result.token);
        localStorage.setItem('delv_admin_user', JSON.stringify(result.user));
        showToast('success', '✓ Autentikasi dua langkah berhasil! Selamat datang di Dashboard.');
        setCurrentView('admin/dashboard');
        window.location.hash = '/admin/dashboard';
        return true;
      } else {
        showToast('error', result.message || 'Kode verifikasi tidak sesuai atau kedaluwarsa.');
        return false;
      }
    } catch (err) {
      console.error('Verify OTP error:', err);
      showToast('error', 'Terjadi gangguan jaringan saat memverifikasi kode.');
      return false;
    }
  };

  const resendOtp = async (tempSessionId: string): Promise<string | null> => {
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempSessionId }),
      });
      const result = await res.json();
      if (result.success) {
        showToast('info', '✓ Kode autentikasi baru telah dikirimkan ke email Anda.');
        return result.otpPreview || null;
      } else {
        showToast('error', result.message || 'Gagal mengirim ulang kode autentikasi.');
        return null;
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      showToast('error', 'Koneksi jaringan terputus saat meminta kode baru.');
      return null;
    }
  };

  const loginGoogle = async (): Promise<boolean> => {
    try {
      const fbUser = await loginWithGoogle();
      if (fbUser) {
        const token = await fbUser.getIdToken();
        const adminUser: User = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Administrator',
          email: fbUser.email || '',
          role: 'admin',
        };
        setUser(adminUser);
        localStorage.setItem('delv_admin_token', token);
        localStorage.setItem('delv_admin_user', JSON.stringify(adminUser));
        showToast('success', `✓ Berhasil masuk via Google Firebase: ${adminUser.name}`);
        setCurrentView('admin/dashboard');
        window.location.hash = '/admin/dashboard';
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Google login failed:', err);
      let message = 'Gagal masuk dengan akun Google.';
      if (err?.code === 'auth/popup-closed-by-user') {
        message = 'Jendela login Google ditutup sebelum selesai.';
      } else if (err?.code === 'auth/cancelled-popup-request') {
        message = 'Proses login pop-up dibatalkan.';
      } else if (err?.message) {
        message = err.message;
      }
      showToast('error', message);
      return false;
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      showToast('error', 'Masukkan alamat email terlebih dahulu.');
      return false;
    }
    try {
      await sendFirebasePasswordReset(cleanEmail);
      showToast('success', `✓ Tautan pemulihan kata sandi telah dikirim ke ${cleanEmail}`);
      return true;
    } catch (err: any) {
      console.error('Firebase password reset error:', err);
      let msg = 'Gagal mengirim email reset kata sandi.';
      if (err?.code === 'auth/user-not-found') {
        msg = 'Email tidak terdaftar di Firebase Authentication.';
      } else if (err?.code === 'auth/invalid-email') {
        msg = 'Format alamat email tidak valid.';
      }
      showToast('error', msg);
      return false;
    }
  };

  const logout = async () => {
    try {
      await logoutFirebase();
    } catch (e) {
      console.warn('Firebase logout warning:', e);
    }
    setUser(null);
    localStorage.removeItem('delv_admin_token');
    localStorage.removeItem('delv_admin_user');
    showToast('info', 'Anda telah keluar dari sesi admin.');
    setCurrentView('public');
    window.location.hash = '';
  };

  // --- CRUD ACTIONS ---
  const updateProfile = async (profile: Partial<Profile>): Promise<boolean> => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        showToast('success', '✓ Profil berhasil diperbarui');
        await refreshData();
        return true;
      }
      throw new Error();
    } catch {
      showToast('error', 'Gagal memperbarui profil');
      return false;
    }
  };

  const createEducation = async (edu: Omit<Education, 'id'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/educations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(edu),
      });
      if (res.ok) {
        showToast('success', '✓ Pendidikan berhasil ditambahkan');
        await refreshData();
        return true;
      }
      throw new Error();
    } catch {
      showToast('error', 'Gagal menambahkan pendidikan');
      return false;
    }
  };

  const updateEducation = async (id: string, edu: Partial<Education>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/educations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(edu),
      });
      if (res.ok) {
        showToast('success', '✓ Pendidikan berhasil diperbarui');
        await refreshData();
        return true;
      }
      throw new Error();
    } catch {
      showToast('error', 'Gagal memperbarui pendidikan');
      return false;
    }
  };

  const deleteEducation = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/educations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('success', '✓ Pendidikan berhasil dihapus');
        await refreshData();
        return true;
      }
      throw new Error();
    } catch {
      showToast('error', 'Gagal menghapus pendidikan');
      return false;
    }
  };

  const createExperience = async (exp: Omit<Experience, 'id'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exp),
      });
      if (res.ok) {
        showToast('success', '✓ Pengalaman berhasil ditambahkan');
        await refreshData();
        return true;
      }
      throw new Error();
    } catch {
      showToast('error', 'Gagal menambahkan pengalaman');
      return false;
    }
  };

  const updateExperience = async (id: string, exp: Partial<Experience>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/experiences/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exp),
      });
      if (res.ok) {
        showToast('success', '✓ Pengalaman berhasil diperbarui');
        await refreshData();
        return true;
      }
      throw new Error();
    } catch {
      showToast('error', 'Gagal memperbarui pengalaman');
      return false;
    }
  };

  const deleteExperience = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/experiences/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('success', '✓ Pengalaman berhasil dihapus');
        await refreshData();
        return true;
      }
      throw new Error();
    } catch {
      showToast('error', 'Gagal menghapus pengalaman');
      return false;
    }
  };

  const createProject = async (proj: Omit<Project, 'id' | 'slug'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proj),
      });
      if (res.ok) {
        showToast('success', '✓ Projek berhasil ditambahkan');
        await refreshData();
        return true;
      }
      throw new Error();
    } catch {
      showToast('error', 'Gagal menambahkan projek');
      return false;
    }
  };

  const updateProject = async (id: string, proj: Partial<Project>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proj),
      });
      if (res.ok) {
        showToast('success', '✓ Projek berhasil diperbarui');
        await refreshData();
        return true;
      }
      throw new Error();
    } catch {
      showToast('error', 'Gagal memperbarui projek');
      return false;
    }
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('success', '✓ Projek berhasil dihapus');
        await refreshData();
        return true;
      }
      throw new Error();
    } catch {
      showToast('error', 'Gagal menghapus projek');
      return false;
    }
  };

  const createSkill = async (skill: Omit<Skill, 'id'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skill),
      });
      if (res.ok) {
        showToast('success', '✓ Skill berhasil ditambahkan');
        await refreshData();
        return true;
      }
      throw new Error();
    } catch {
      showToast('error', 'Gagal menambahkan skill');
      return false;
    }
  };

  const updateSkill = async (id: string, skill: Partial<Skill>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/skills/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skill),
      });
      if (res.ok) {
        showToast('success', '✓ Skill berhasil diperbarui');
        await refreshData();
        return true;
      }
      throw new Error();
    } catch {
      showToast('error', 'Gagal memperbarui skill');
      return false;
    }
  };

  const deleteSkill = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/skills/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('success', '✓ Skill berhasil dihapus');
        await refreshData();
        return true;
      }
      throw new Error();
    } catch {
      showToast('error', 'Gagal menghapus skill');
      return false;
    }
  };

  const createCertification = async (cert: Omit<Certification, 'id'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/certifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cert),
      });
      if (res.ok) {
        showToast('success', '✓ Sertifikasi berhasil ditambahkan');
        await refreshData();
        return true;
      }
      throw new Error();
    } catch {
      showToast('error', 'Gagal menambahkan sertifikasi');
      return false;
    }
  };

  const updateCertification = async (id: string, cert: Partial<Certification>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/certifications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cert),
      });
      if (res.ok) {
        showToast('success', '✓ Sertifikasi berhasil diperbarui');
        await refreshData();
        return true;
      }
      throw new Error();
    } catch {
      showToast('error', 'Gagal memperbarui sertifikasi');
      return false;
    }
  };

  const deleteCertification = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/certifications/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('success', '✓ Sertifikasi berhasil dihapus');
        await refreshData();
        return true;
      }
      throw new Error();
    } catch {
      showToast('error', 'Gagal menghapus sertifikasi');
      return false;
    }
  };

  const createCV = async (cv: Omit<CV, 'id'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/cvs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cv),
      });
      if (res.ok) {
        showToast('success', '✓ CV berhasil dibuat');
        await refreshData();
        return true;
      }
      throw new Error();
    } catch {
      showToast('error', 'Gagal membuat CV');
      return false;
    }
  };

  const updateCV = async (id: string, cv: Partial<CV>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/cvs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cv),
      });
      if (res.ok) {
        showToast('success', '✓ CV berhasil disimpan');
        await refreshData();
        return true;
      }
      throw new Error();
    } catch {
      showToast('error', 'Gagal menyimpan CV');
      return false;
    }
  };

  const setActiveCV = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/cvs/${id}/set-active`, {
        method: 'POST',
      });
      if (res.ok) {
        showToast('success', '✓ CV aktif berhasil diperbarui');
        await refreshData();
        return true;
      }
      throw new Error();
    } catch {
      showToast('error', 'Gagal mengatur CV aktif');
      return false;
    }
  };

  const deleteCV = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/cvs/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        showToast('success', '✓ CV berhasil dihapus');
        await refreshData();
        return true;
      } else {
        showToast('error', result.message || 'Gagal menghapus CV');
        return false;
      }
    } catch {
      showToast('error', 'Gagal menghapus CV');
      return false;
    }
  };

  const updateSettings = async (settings: Partial<Settings>): Promise<boolean> => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        showToast('success', '✓ Pengaturan berhasil diperbarui');
        await refreshData();
        return true;
      }
      throw new Error();
    } catch {
      showToast('error', 'Gagal memperbarui pengaturan');
      return false;
    }
  };

  // --- Real Messaging (Inbox Kontak) ---
  const sendMessage = async (msg: {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
  }): Promise<boolean> => {
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg),
      });
      const result = await res.json();

      // Mirror message to Firebase Cloud Firestore
      try {
        const msgId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
        await setDoc(doc(db, 'messages', msgId), {
          id: msgId,
          name: msg.name,
          email: msg.email,
          phone: msg.phone || '',
          subject: msg.subject || '',
          message: msg.message,
          status: 'unread',
          created_at: new Date().toISOString(),
        });
      } catch (fbErr) {
        console.warn('Firebase Firestore message mirror notice:', fbErr);
      }

      if (result.success) {
        showToast('success', '✓ ' + (result.message || 'Pesan Anda berhasil dikirim ke Delv Andriawan!'));
        await refreshData();
        return true;
      } else {
        showToast('error', result.message || 'Gagal mengirim pesan.');
        return false;
      }
    } catch {
      showToast('error', 'Terjadi kesalahan jaringan saat mengirim pesan.');
      return false;
    }
  };

  const toggleMessageRead = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/messages/${id}/read`, { method: 'PUT' });
      if (res.ok) {
        await refreshData();
        return true;
      }
      throw new Error();
    } catch {
      showToast('error', 'Gagal memperbarui status pesan');
      return false;
    }
  };

  const deleteMessage = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('success', '✓ Pesan berhasil dihapus');
        await refreshData();
        return true;
      }
      throw new Error();
    } catch {
      showToast('error', 'Gagal menghapus pesan');
      return false;
    }
  };

  // --- Real Analytics Tracking ---
  const trackView = async (): Promise<void> => {
    try {
      await fetch('/api/analytics/view', { method: 'POST' });
    } catch {}
  };

  const trackDownloadCV = async (): Promise<void> => {
    try {
      await fetch('/api/analytics/download-cv', { method: 'POST' });
      await refreshData();
    } catch {}
  };

  // --- Media & File Upload ---
  const uploadMedia = async (file: File): Promise<string | null> => {
    try {
      const reader = new FileReader();
      const dataUrlPromise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const dataUrl = await dataUrlPromise;
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataUrl, filename: file.name }),
      });

      const result = await res.json();
      if (result.success && result.url) {
        showToast('success', '✓ Berkas berhasil diunggah');
        return result.url;
      } else {
        showToast('error', result.message || 'Gagal mengunggah berkas');
        return null;
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      showToast('error', 'Terjadi kesalahan saat mengunggah file.');
      return null;
    }
  };

  // --- Admin Account & Database Maintenance ---
  const updateAdminAccount = async (payload: {
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  }): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/profile-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        showToast('success', '✓ ' + result.message);
        if (result.user) {
          setUser(result.user);
          localStorage.setItem('delv_admin_user', JSON.stringify(result.user));
        }
        await refreshData();
        return true;
      } else {
        showToast('error', result.message || 'Gagal memperbarui akun.');
        return false;
      }
    } catch {
      showToast('error', 'Gagal memperbarui akun admin.');
      return false;
    }
  };

  const resetDatabase = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/database/reset', { method: 'POST' });
      const result = await res.json();
      if (result.success) {
        showToast('success', '✓ ' + result.message);
        await refreshData();
        return true;
      }
      throw new Error();
    } catch {
      showToast('error', 'Gagal mereset database.');
      return false;
    }
  };

  const importDatabase = async (jsonData: any): Promise<boolean> => {
    try {
      const res = await fetch('/api/database/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData),
      });
      const result = await res.json();
      if (result.success) {
        showToast('success', '✓ ' + result.message);
        await refreshData();
        return true;
      } else {
        showToast('error', result.message || 'Gagal mengimpor database.');
        return false;
      }
    } catch {
      showToast('error', 'Format file JSON tidak dapat diimpor.');
      return false;
    }
  };

  const activeCV = data?.cvs?.find((c) => c.is_active) || data?.cvs?.[0] || null;

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isLoading,
        user,
        isAuthenticated: !!user,
        toasts,
        currentView,
        setCurrentView,
        showToast,
        removeToast,
        login,
        verifyOtp,
        resendOtp,
        loginGoogle,
        resetPassword,
        logout,
        refreshData,
        isFirebaseConnected,
        updateProfile,
        createEducation,
        updateEducation,
        deleteEducation,
        createExperience,
        updateExperience,
        deleteExperience,
        createProject,
        updateProject,
        deleteProject,
        createSkill,
        updateSkill,
        deleteSkill,
        createCertification,
        updateCertification,
        deleteCertification,
        createCV,
        updateCV,
        setActiveCV,
        deleteCV,
        updateSettings,
        activeCV,
        sendMessage,
        toggleMessageRead,
        deleteMessage,
        trackView,
        trackDownloadCV,
        uploadMedia,
        updateAdminAccount,
        resetDatabase,
        importDatabase,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
