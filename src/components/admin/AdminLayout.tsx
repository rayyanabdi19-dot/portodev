import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  LayoutDashboard,
  User,
  GraduationCap,
  Briefcase,
  FolderCode,
  Wrench,
  Award,
  FileText,
  Settings as SettingsIcon,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  Inbox,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeMenu: string;
  onNavigate: (menu: string) => void;
  title: string;
  subtitle?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeMenu,
  onNavigate,
  title,
  subtitle,
}) => {
  const { data, user, logout, setCurrentView } = usePortfolio();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const unreadMessagesCount = (data?.messages || []).filter((m) => m.status === 'unread').length;

  const navSections = [
    {
      group: 'Overview',
      items: [
        { id: 'admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        {
          id: 'admin/messages',
          label: 'Pesan Masuk',
          icon: Inbox,
          badge: unreadMessagesCount,
        },
      ],
    },
    {
      group: 'Portfolio Management',
      items: [
        { id: 'admin/profil', label: 'Profil Saya', icon: User },
        { id: 'admin/pendidikan', label: 'Pendidikan', icon: GraduationCap },
        { id: 'admin/pengalaman', label: 'Pengalaman', icon: Briefcase },
        { id: 'admin/projek', label: 'Projek & Showcase', icon: FolderCode },
        { id: 'admin/skill', label: 'Skill & Keahlian', icon: Wrench },
        { id: 'admin/certifications', label: 'Sertifikasi', icon: Award },
      ],
    },
    {
      group: 'CV Builder System',
      items: [
        { id: 'admin/cv', label: 'Kelola CV & Template', icon: FileText },
      ],
    },
    {
      group: 'Preferences',
      items: [
        { id: 'admin/settings', label: 'Pengaturan & SEO', icon: SettingsIcon },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        id="admin-sidebar"
        className={`fixed lg:sticky top-0 bottom-0 left-0 w-72 bg-slate-950 text-white z-50 flex flex-col justify-between border-r border-slate-800 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Logo Header */}
          <div className="p-6 border-b border-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-slate-950 font-black flex items-center justify-center text-lg shadow-sm">
                DA
              </div>
              <div>
                <span className="font-bold text-sm text-white block">Delv Andriawan</span>
                <span className="text-[11px] text-orange-400 font-medium block">Admin Control Panel</span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Groups */}
          <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-16rem)]">
            {navSections.map((sec, idx) => (
              <div key={idx}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block mb-2">
                  {sec.group}
                </span>
                <div className="space-y-1">
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeMenu === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onNavigate(item.id);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-orange-500 text-slate-950 font-bold shadow-md shadow-orange-500/20'
                            : 'text-slate-400 hover:text-white hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                              isActive
                                ? 'bg-slate-950 text-white'
                                : 'bg-orange-600 text-white'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer: User & Exit */}
        <div className="p-4 border-t border-slate-900 space-y-2 bg-slate-950/80">
          <button
            onClick={() => {
              setCurrentView('public');
              window.location.hash = '';
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
              Lihat Website Publik
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200/80 z-30 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Admin</span>
                <span>/</span>
                <span className="font-semibold text-slate-700 capitalize">
                  {activeMenu.replace('admin/', '')}
                </span>
              </div>
              <h1 className="text-xl font-black text-slate-900 leading-tight">{title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 py-1.5 px-3 rounded-full">
              <div className="w-6 h-6 rounded-full bg-orange-500 text-slate-900 font-bold text-xs flex items-center justify-center">
                DA
              </div>
              <span className="text-xs font-bold text-slate-700">{user?.name || 'Delv Andriawan'}</span>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="p-4 sm:p-8 flex-1 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};
