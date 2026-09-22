import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  MapPin,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  Instagram,
  MessageCircle,
  Briefcase,
  GraduationCap,
  Code2,
  CheckCircle,
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { data } = usePortfolio();
  const profile = data?.profile;

  const highlights = [
    { title: 'Fullstack Mastery', desc: 'Pengembangan end-to-end dari perancangan database relasional, REST API, hingga UI modern yang reaktif.' },
    { title: 'Vibe Coding & AI', desc: 'Memanfaatkan tooling AI terkini untuk akselerasi prototyping, refactoring, dan deployment fitur tanpa kompromi kualitas.' },
    { title: 'Pragmatic & Clean Code', desc: 'Menulis kode yang mudah dirawat (maintainable), terdokumentasi rapi, dan teruji performanya di lingkungan produksi.' },
  ];

  return (
    <section id="profil" className="py-24 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200 mb-3">
            Tentang Saya
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Profil Profesional
          </h2>
          <p className="mt-3 text-slate-600 max-w-xl text-sm sm:text-base">
            Mengenal lebih dekat dedikasi, prinsip rekayasa perangkat lunak, dan kapabilitas teknologi yang saya tawarkan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Bio Card with Photo & Personal Data */}
          <div className="lg:col-span-5 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-200">
              <img
                src={
                  profile?.photo ||
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800'
                }
                alt={profile?.name || 'Delv Andriawan'}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm"
              />
              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                  {profile?.name || 'Delv Andriawan'}
                </h3>
                <p className="text-xs font-semibold text-orange-600 mt-0.5">
                  {profile?.title || 'Fullstack Developer'}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profile?.location || 'Indonesia'}</span>
                </div>
              </div>
            </div>

            {/* Biodata Contact Details */}
            <div className="py-6 space-y-3.5 border-b border-slate-200 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4 text-orange-500" /> Email:
                </span>
                <a
                  href={`mailto:${profile?.email}`}
                  className="font-semibold text-slate-800 hover:text-orange-600 transition-colors"
                >
                  {profile?.email}
                </a>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4 text-orange-500" /> Telepon:
                </span>
                <a
                  href={`tel:${profile?.phone}`}
                  className="font-semibold text-slate-800 hover:text-orange-600 transition-colors"
                >
                  {profile?.phone}
                </a>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium flex items-center gap-2">
                  <Globe className="w-4 h-4 text-orange-500" /> Website:
                </span>
                <a
                  href={profile?.website}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-slate-800 hover:text-orange-600 transition-colors truncate max-w-[180px]"
                >
                  {profile?.website?.replace('https://', '')}
                </a>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-orange-500" /> Status:
                </span>
                <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Open for Projects
                </span>
              </div>
            </div>

            {/* Social Channels Matrix */}
            <div className="pt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Sosial Media & Repositori
              </p>
              <div className="grid grid-cols-2 gap-2">
                {profile?.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-orange-600 hover:border-orange-300 text-xs font-semibold shadow-2xs transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>
                )}
                {profile?.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-orange-600 hover:border-orange-300 text-xs font-semibold shadow-2xs transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {profile?.whatsapp && (
                  <a
                    href={profile.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-emerald-600 hover:border-emerald-300 text-xs font-semibold shadow-2xs transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                )}
                {profile?.instagram && (
                  <a
                    href={profile.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-300 text-xs font-semibold shadow-2xs transition-colors"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>Instagram</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Bio Narrative & Engineering Pillars */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                "Membawa nilai nyata melalui arsitektur web yang kokoh dan antarmuka yang memikat pengguna."
              </h3>
              <p className="mt-4 text-slate-600 text-base leading-relaxed">
                {profile?.bio ||
                  'Halo! Saya Delv Andriawan, seorang Fullstack Developer yang berfokus pada pembangunan solusi digital yang efektif, terukur, dan berkinerja tinggi.'}
              </p>
              <p className="mt-3 text-slate-600 text-base leading-relaxed">
                Dengan pengalaman di bidang rekayasa web frontend dan backend, saya biasa menangani siklus hidup aplikasi secara menyeluruh — mulai dari analisis kebutuhan sistem, pembuatan antarmuka di React atau Tailwind, hingga integrasi database relasional MySQL/PostgreSQL dan REST API di Node.js atau Laravel.
              </p>
            </div>

            {/* Highlights Pillars */}
            <div className="space-y-4">
              {highlights.map((h, idx) => (
                <div
                  key={idx}
                  className="p-4.5 rounded-2xl border border-slate-200 bg-white hover:border-orange-200 hover:shadow-xs transition-all flex items-start gap-4"
                >
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{h.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
