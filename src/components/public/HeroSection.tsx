import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ArrowRight, Download, Github, Linkedin, Mail, MessageCircle, Sparkles, Terminal } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { data } = usePortfolio();
  const profile = data?.profile;
  const settings = data?.settings;

  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-slate-900/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Text Content */}
          <div className="w-full lg:w-3/5 text-center lg:text-left">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 text-orange-700 text-xs font-semibold mb-6 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Tersedia untuk Freelance & Full-time Project</span>
            </div>

            {/* Main Title & Subtitle */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              DELV ANDRIAWAN
            </h1>
            <div className="mt-3 flex items-center justify-center lg:justify-start gap-2.5">
              <span className="text-xl sm:text-2xl font-bold text-orange-600">
                {profile?.title || 'Freelancer'}
              </span>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                Professional
              </span>
            </div>

            {/* Tagline / Subtitle */}
            <p className="mt-3 text-sm sm:text-base font-semibold text-slate-600 tracking-wide">
              Vibe Coding • Web Application • Digital Solution
            </p>

            {/* Value Proposition Description */}
            <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed mx-auto lg:mx-0">
              {profile?.short_bio ||
                'Membangun aplikasi digital yang membantu pekerjaan menjadi lebih efektif, terorganisir, dan menghasilkan dampak bisnis nyata.'}
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <a
                href="#projek"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                id="hero-see-projects-btn"
              >
                <span>Lihat Projek</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#cv"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 shadow-xs transition-all hover:border-slate-300 transform hover:-translate-y-0.5"
                id="hero-download-cv-btn"
              >
                <Download className="w-4 h-4 text-orange-500" />
                <span>Download CV</span>
              </a>
            </div>

            {/* Social Icons & Contact Links */}
            <div className="mt-10 pt-8 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Terhubung:
              </span>
              <div className="flex items-center gap-2">
                {profile?.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-orange-600 hover:border-orange-300 shadow-xs transition-colors"
                    title="GitHub Delv Andriawan"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {profile?.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-orange-600 hover:border-orange-300 shadow-xs transition-colors"
                    title="LinkedIn Delv Andriawan"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {profile?.whatsapp && (
                  <a
                    href={profile.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-emerald-600 hover:border-emerald-300 shadow-xs transition-colors"
                    title="WhatsApp Delv Andriawan"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                )}
                {profile?.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-orange-600 hover:border-orange-300 shadow-xs transition-colors"
                    title="Email Delv Andriawan"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Profile Photo Display */}
          <div className="w-full lg:w-2/5 flex justify-center">
            <div className="relative">
              {/* Outer decorative ring */}
              <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-3xl bg-linear-to-tr from-slate-900 to-slate-800 p-2 shadow-2xl relative">
                <div className="w-full h-full rounded-2.5xl overflow-hidden relative bg-slate-900">
                  <img
                    src={
                      profile?.photo ||
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800'
                    }
                    alt={profile?.name || 'Delv Andriawan'}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs font-mono text-orange-400">// Ready to collaborate</p>
                    <p className="text-sm font-bold tracking-tight">Freelancer & Web Solution Specialist</p>
                  </div>
                </div>

                {/* Floating Metric Pill 1 */}
                <div className="absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-6 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-lg font-black text-slate-900 leading-none">4+ Tahun</span>
                    <span className="text-[11px] font-medium text-slate-500">Pengalaman Coding</span>
                  </div>
                </div>

                {/* Floating Metric Pill 2 */}
                <div className="absolute -top-4 -right-4 sm:-top-5 sm:-right-6 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-orange-400 flex items-center justify-center">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-lg font-black text-slate-900 leading-none">15+ Projek</span>
                    <span className="text-[11px] font-medium text-slate-500">Web & POS Siap Pakai</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
