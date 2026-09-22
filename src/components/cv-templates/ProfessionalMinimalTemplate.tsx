import React from 'react';
import { CV } from '../../types';

export const ProfessionalMinimalTemplate: React.FC<{ cv: CV }> = ({ cv }) => {
  return (
    <div
      id="cv-render-target"
      className="cv-print-area bg-white text-zinc-900 p-8 sm:p-14 font-sans max-w-[800px] mx-auto text-[13px] leading-relaxed shadow-sm border border-slate-200 print:border-none print:shadow-none"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-wide text-zinc-900 uppercase">
          {cv.name.split(' ')[0]} <span className="font-bold">{cv.name.split(' ').slice(1).join(' ')}</span>
        </h1>
        <p className="text-sm tracking-widest uppercase text-zinc-500 font-medium mt-1">
          {cv.professional_title}
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 mt-4 pt-3 border-t border-zinc-200">
          {cv.email && <span>{cv.email}</span>}
          {cv.phone && <span>/ {cv.phone}</span>}
          {cv.location && <span>/ {cv.location}</span>}
          {cv.website && <span>/ {cv.website.replace('https://', '')}</span>}
          {cv.github && <span>/ {cv.github.replace('https://', '')}</span>}
        </div>
      </div>

      {/* Summary */}
      {cv.summary && (
        <div className="mb-8">
          <p className="text-zinc-700 leading-relaxed text-sm font-light border-l border-zinc-300 pl-4 py-1 italic">
            "{cv.summary}"
          </p>
        </div>
      )}

      {/* Experience */}
      {cv.experiences && cv.experiences.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
            Pengalaman Profesional
          </h2>
          <div className="space-y-5">
            {cv.experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-semibold text-zinc-900">{exp.position}</h3>
                  <span className="text-xs text-zinc-400 font-mono">
                    {exp.start_date} — {exp.end_date}
                  </span>
                </div>
                <div className="text-xs text-zinc-600 mb-2">
                  {exp.company} {exp.location && `· ${exp.location}`}
                </div>
                {exp.description && <p className="text-xs text-zinc-600 mb-2">{exp.description}</p>}
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul className="space-y-1 text-xs text-zinc-600">
                    {exp.responsibilities.map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-zinc-300 select-none">—</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {cv.projects && cv.projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
            Projek Pilihan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cv.projects.map((proj) => (
              <div key={proj.id} className="p-3 bg-zinc-50/80 rounded-lg border border-zinc-100">
                <div className="font-semibold text-zinc-900 text-xs">{proj.name}</div>
                <p className="text-[11px] text-zinc-600 mt-1">{proj.description}</p>
                {proj.technologies && (
                  <div className="text-[10px] text-zinc-400 font-mono mt-2">
                    {proj.technologies.join(' · ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education & Skills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-6">
        {cv.educations && cv.educations.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
              Pendidikan
            </h2>
            <div className="space-y-3">
              {cv.educations.map((edu) => (
                <div key={edu.id}>
                  <div className="font-semibold text-zinc-900 text-xs">
                    {edu.degree} {edu.field && `· ${edu.field}`}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {edu.institution} ({edu.start_year} - {edu.end_year})
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {cv.skills && cv.skills.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
              Keahlian
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {cv.skills.map((s) => (
                <span
                  key={s.id}
                  className="text-xs bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded font-mono text-[11px]"
                >
                  {s.skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
