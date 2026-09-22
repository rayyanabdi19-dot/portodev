import React, { useEffect } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { PublicPortfolio } from './components/public/PublicPortfolio';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminProfile } from './components/admin/AdminProfile';
import { AdminEducation } from './components/admin/AdminEducation';
import { AdminExperience } from './components/admin/AdminExperience';
import { AdminProjects } from './components/admin/AdminProjects';
import { AdminSkills } from './components/admin/AdminSkills';
import { AdminCertifications } from './components/admin/AdminCertifications';
import { AdminCVManager } from './components/admin/AdminCVManager';
import { AdminSettings } from './components/admin/AdminSettings';
import { AdminMessages } from './components/admin/AdminMessages';
import { ToastContainer } from './components/common/Toast';

const AppContent: React.FC = () => {
  const { currentView, setCurrentView, isAuthenticated } = usePortfolio();

  // Synchronize hash with currentView
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash.startsWith('admin')) {
        if (!isAuthenticated && hash !== 'admin/login') {
          setCurrentView('admin/login');
        } else {
          setCurrentView(hash);
        }
      } else if (hash === '' || ['home', 'profil', 'pendidikan', 'pengalaman', 'projek', 'skill', 'cv', 'kontak'].includes(hash)) {
        setCurrentView('public');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial check on load
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAuthenticated, setCurrentView]);

  // Route: Public Portfolio
  if (currentView === 'public') {
    return (
      <>
        <PublicPortfolio />
        <ToastContainer />
      </>
    );
  }

  // Route: Admin Login
  if (currentView === 'admin/login' || (!isAuthenticated && currentView.startsWith('admin/'))) {
    return (
      <>
        <AdminLogin />
        <ToastContainer />
      </>
    );
  }

  // Route: Admin Protected Views inside AdminLayout
  const getAdminViewConfig = () => {
    switch (currentView) {
      case 'admin/dashboard':
        return {
          title: 'Dashboard Ringkasan',
          subtitle: 'Statistik performa, kelengkapan profil, dan aksi cepat',
          component: <AdminDashboard onNavigate={(v) => { setCurrentView(v); window.location.hash = `/${v}`; }} />,
        };
      case 'admin/messages':
        return {
          title: 'Kotak Masuk (Pesan)',
          subtitle: 'Kelola pesan dan pertanyaan dari formulir kontak portofolio',
          component: <AdminMessages />,
        };
      case 'admin/profil':
        return {
          title: 'Profil & Biodata',
          subtitle: 'Kelola informasi pribadi, bio, kontak, dan tautan sosial',
          component: <AdminProfile />,
        };
      case 'admin/pendidikan':
        return {
          title: 'Riwayat Pendidikan',
          subtitle: 'Kelola universitas, sekolah, jenjang, dan tahun studi',
          component: <AdminEducation />,
        };
      case 'admin/pengalaman':
        return {
          title: 'Pengalaman Kerja',
          subtitle: 'Kelola posisi, perusahaan, tanggung jawab, dan teknologi',
          component: <AdminExperience />,
        };
      case 'admin/projek':
        return {
          title: 'Projek & Showcase',
          subtitle: 'Kelola portofolio aplikasi, thumbnail, live demo, dan fitur',
          component: <AdminProjects />,
        };
      case 'admin/skill':
        return {
          title: 'Keahlian Teknis & Tools',
          subtitle: 'Kelola kategori keahlian, level, dan persentase',
          component: <AdminSkills />,
        };
      case 'admin/certifications':
        return {
          title: 'Sertifikasi & Lisensi',
          subtitle: 'Kelola sertifikat kompetensi dan nomor lisensi',
          component: <AdminCertifications />,
        };
      case 'admin/cv':
        return {
          title: 'ATS CV & Template Builder',
          subtitle: 'Kelola template resume, sinkronisasi portofolio, dan ekspor PDF',
          component: <AdminCVManager />,
        };
      case 'admin/settings':
        return {
          title: 'Pengaturan & Backup',
          subtitle: 'Konfigurasi SEO, preferensi website, dan ekspor database JSON',
          component: <AdminSettings />,
        };
      default:
        return {
          title: 'Dashboard Ringkasan',
          subtitle: 'Statistik performa, kelengkapan profil, dan aksi cepat',
          component: <AdminDashboard onNavigate={(v) => { setCurrentView(v); window.location.hash = `/${v}`; }} />,
        };
    }
  };

  const { title, subtitle, component } = getAdminViewConfig();

  return (
    <>
      <AdminLayout
        activeMenu={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.location.hash = `/${view}`;
        }}
        title={title}
        subtitle={subtitle}
      >
        {component}
      </AdminLayout>
      <ToastContainer />
    </>
  );
};

export default function App() {
  return (
    <PortfolioProvider>
      <AppContent />
    </PortfolioProvider>
  );
}
