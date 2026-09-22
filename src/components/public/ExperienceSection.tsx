import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

export const ExperienceSection: React.FC = () => {
  const { data } = usePortfolio();
  const experiences = data?.experiences || [];

  return (
    <section id="pengalaman" className="py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200 mb-3">
            Rekam Jejak
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Pengalaman Kerja
          </h2>
          <p className="mt-3 text-slate-600 max-w-xl text-sm sm:text-base">
            Perjalanan karir profesional, peran engineering, dan kontribusi proyek bernilai tambah.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical timeline line */}
          <div className="hidden sm:block absolute left-8 top-6 bottom-6 w-0.5 bg-slate-200" />

          <div className="space-y-8">
            {experiences.map((exp, idx) => (
              <div key={exp.id} className="relative sm:pl-20">
                {/* Timeline icon node */}
                <div className="hidden sm:flex absolute left-4 top-6 w-8 h-8 -translate-x-1/2 rounded-full bg-slate-900 text-orange-500 border-4 border-white shadow-md items-center justify-center">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>

                <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs hover:border-orange-300 hover:shadow-md transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
                          {exp.employment_type}
                        </span>
                        {exp.is_current && (
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500 text-white animate-pulse">
                            Posisi Aktif
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        {exp.position}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 mt-0.5 font-medium">
                        <span className="text-orange-600 font-bold">{exp.company}</span>
                        {exp.location && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-slate-500">
                              <MapPin className="w-3.5 h-3.5" />
                              {exp.location}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto shrink-0 shadow-2xs">
                      <Calendar className="w-3.5 h-3.5 text-orange-500" />
                      <span>
                        {exp.start_date} — {exp.end_date}
                      </span>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-slate-700 leading-relaxed">{exp.description}</p>

                  {/* Responsibilities */}
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <div className="mt-4 space-y-1.5">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Tanggung Jawab Utama:
                      </p>
                      <ul className="space-y-1.5">
                        {exp.responsibilities.map((r, i) => (
                          <li key={i} className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tech stack badges */}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-slate-200 flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-slate-400 mr-1">Teknologi:</span>
                      {exp.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-medium bg-white text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md shadow-2xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
