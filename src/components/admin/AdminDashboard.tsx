import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  FolderCode,
  Wrench,
  GraduationCap,
  Briefcase,
  FileText,
  Plus,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Eye,
  Inbox,
  Download,
  Mail,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (view: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { data, activeCV } = usePortfolio();
  const profile = data?.profile;
  const projects = data?.projects || [];
  const skills = data?.skills || [];
  const educations = data?.educations || [];
  const experiences = data?.experiences || [];
  const cvs = data?.cvs || [];
  const messages = data?.messages || [];
  const analytics = data?.analytics || { views_count: 0, downloads_count: 0 };
  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  // Profile completion calculation
  const checklist = [
    { label: 'Biodata & Nama Lengkap', done: !!profile?.name && !!profile?.title },
    { label: 'Foto Profil Berkualitas', done: !!profile?.photo },
    { label: 'Pengalaman Kerja Terdata', done: experiences.length > 0 },
    { label: 'Projek & Showcase Unggulan', done: projects.length >= 3 },
    { label: 'Skill & Persentase Kemampuan', done: skills.length >= 5 },
    { label: 'Kontak WhatsApp & Email Aktif', done: !!profile?.whatsapp && !!profile?.email },
    { label: 'Curriculum Vitae (CV) ATS Aktif', done: !!activeCV },
  ];
  const completedCount = checklist.filter((c) => c.done).length;
  const completionPercentage = Math.round((completedCount / checklist.length) * 100);

  const stats = [
    { label: 'Total Projek', value: projects.length, icon: FolderCode, color: 'text-orange-600', bg: 'bg-orange-50', link: 'admin/projek' },
    { label: 'Keahlian Teknis', value: skills.length, icon: Wrench, color: 'text-blue-600', bg: 'bg-blue-50', link: 'admin/skill' },
    { label: 'Pengalaman', value: experiences.length, icon: Briefcase, color: 'text-emerald-600', bg: 'bg-emerald-50', link: 'admin/pengalaman' },
    { label: 'Pesan Masuk', value: messages.length, icon: Inbox, color: 'text-rose-600', bg: 'bg-rose-50', link: 'admin/messages', badge: unreadCount > 0 ? `${unreadCount} baru` : undefined },
    { label: 'Total Kunjungan', value: analytics.views_count || 1, icon: Eye, color: 'text-indigo-600', bg: 'bg-indigo-50', link: 'admin/settings' },
    { label: 'Download CV', value: analytics.downloads_count || 0, icon: Download, color: 'text-amber-600', bg: 'bg-amber-50', link: 'admin/cv' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Welcome Banner */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-slate-900">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sistem Portofolio & CV Terintegrasi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Selamat Datang Kembali, {profile?.name || 'Delv Andriawan'}!
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-400 max-w-xl">
              Kelola seluruh konten portofolio publik, rekam jejak pengalaman kerja, dan rancangan CV ATS profesional Anda dari satu dasbor terpusat.
            </p>
          </div>

          {/* Quick Actions Cluster */}
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigate('admin/projek')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Projek</span>
            </button>
            <button
              onClick={() => onNavigate('admin/skill')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Skill</span>
            </button>
            <button
              onClick={() => onNavigate('admin/cv')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all"
            >
              <FileText className="w-4 h-4 text-orange-400" />
              <span>Update CV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {stats.map((st, i) => {
          const Icon = st.icon;
          return (
            <button
              key={i}
              onClick={() => onNavigate(st.link)}
              className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs hover:border-orange-300 hover:shadow-md transition-all text-left group relative"
            >
              {st.badge && (
                <span className="absolute top-3 right-3 text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-600 text-white animate-pulse">
                  {st.badge}
                </span>
              )}
              <div className="flex items-center justify-between mb-2.5">
                <div className={`w-9 h-9 rounded-xl ${st.bg} ${st.color} flex items-center justify-center font-bold`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                {!st.badge && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
                )}
              </div>
              <span className="block text-2xl font-black text-slate-900">{st.value}</span>
              <span className="text-[11px] font-semibold text-slate-500 truncate block">{st.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Status & Recents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recent Messages, Projects & Experiences */}
        <div className="lg:col-span-8 space-y-6">
          {/* Recent Messages Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <Inbox className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Pesan Masuk Terbaru</h3>
                  <p className="text-xs text-slate-500">Pesan langsung dari formulir kontak publik</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('admin/messages')}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                <span>Buka Kotak Masuk ({messages.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {messages.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                Belum ada pesan yang masuk dari pengunjung.
              </div>
            ) : (
              <div className="space-y-2.5">
                {messages.slice(0, 3).map((m) => (
                  <div
                    key={m.id}
                    onClick={() => onNavigate('admin/messages')}
                    className={`p-3.5 rounded-2xl flex items-center justify-between gap-4 border transition-all cursor-pointer ${
                      m.status === 'unread'
                        ? 'bg-orange-50/40 border-orange-200 hover:bg-orange-50/80'
                        : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        m.status === 'unread' ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {m.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs ${m.status === 'unread' ? 'font-black text-slate-900' : 'font-semibold text-slate-700'}`}>
                            {m.name}
                          </span>
                          {m.status === 'unread' && (
                            <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-orange-600 text-white">BARU</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{m.subject || m.message}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400">
                        {new Date(m.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Recent Projects List */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">Projek Terbaru</h3>
                <p className="text-xs text-slate-500">Showcase yang sedang tampil di portofolio</p>
              </div>
              <button
                onClick={() => onNavigate('admin/projek')}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                <span>Kelola Semua ({projects.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {projects.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.thumbnail}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{p.name}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{p.description}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                        {p.category}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('admin/projek')}
                    className="p-2 text-slate-500 hover:text-orange-600 rounded-lg"
                    title="Edit projek"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Experience List */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">Pengalaman Kerja Terbaru</h3>
                <p className="text-xs text-slate-500">Peran rekayasa dan kontribusi karir</p>
              </div>
              <button
                onClick={() => onNavigate('admin/pengalaman')}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                <span>Kelola Semua ({experiences.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {experiences.slice(0, 2).map((exp) => (
                <div
                  key={exp.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-4"
                >
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{exp.position}</h4>
                    <span className="text-xs font-semibold text-orange-600">{exp.company}</span>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{exp.description}</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-white text-slate-600 px-2 py-1 rounded border border-slate-200 whitespace-nowrap">
                    {exp.start_date} - {exp.end_date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Profile Health & CV Status */}
        <div className="lg:col-span-4 space-y-6">
          {/* Profile Completion Card (PRD: 85%) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-900">Kelengkapan Profil</h3>
              <span className="text-sm font-black text-orange-600 font-mono">
                {completionPercentage}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-5">
              <div
                className="h-full bg-linear-to-r from-orange-500 to-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            {/* Checklist */}
            <div className="space-y-2">
              {checklist.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs">
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${
                      item.done ? 'text-emerald-500' : 'text-slate-300'
                    }`}
                  />
                  <span className={item.done ? 'text-slate-700 font-medium' : 'text-slate-400'}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('admin/profil')}
              className="w-full mt-6 py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors text-center block"
            >
              Lengkapi Data Profil
            </button>
          </div>

          {/* Active CV Quick Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-900">Status CV Publik</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Aktif
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-4">
              <span className="text-xs font-bold text-slate-800 block">
                {activeCV?.title || 'CV Software Engineer (ATS Friendly)'}
              </span>
              <span className="text-[11px] text-orange-600 font-semibold block mt-0.5">
                Template: {activeCV?.template.toUpperCase().replace('_', ' ')}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">
                Terakhir disinkronkan: {activeCV?.updated_at || 'Hari ini'}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onNavigate('admin/cv')}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-orange-400" />
                <span>Atur CV</span>
              </button>

              <button
                onClick={() => onNavigate('admin/cv')}
                className="py-2 px-3 rounded-xl text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition-colors"
                title="Preview CV"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
