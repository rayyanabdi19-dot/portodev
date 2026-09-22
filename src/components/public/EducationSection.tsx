import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { GraduationCap, Calendar, Award } from 'lucide-react';

export const EducationSection: React.FC = () => {
  const { data } = usePortfolio();
  const educations = data?.educations || [];

  return (
    <section id="pendidikan" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200 mb-3">
            Latar Belakang
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Riwayat Pendidikan
          </h2>
          <p className="mt-3 text-slate-600 max-w-xl text-sm sm:text-base">
            Fondasi akademis formal dan kompetensi rekayasa perangkat lunak yang telah ditempuh.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {educations.map((edu, idx) => (
            <div
              key={edu.id}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs hover:border-orange-300 hover:shadow-md transition-all relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-orange-500 flex items-center justify-center shrink-0 shadow-xs">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                        {edu.degree}
                      </span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {edu.status || 'Lulus'}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                      {edu.institution}
                    </h3>
                    <p className="text-sm font-semibold text-orange-600 mt-0.5">{edu.field}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto shrink-0">
                  <Calendar className="w-3.5 h-3.5 text-orange-500" />
                  <span>
                    {edu.start_year} — {edu.end_year}
                  </span>
                </div>
              </div>

              {edu.description && (
                <div className="mt-5 pt-5 border-t border-slate-100 text-sm text-slate-600 leading-relaxed">
                  {edu.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
