import React from 'react';
import { CV } from '../../types';

export const ATSModernTemplate: React.FC<{ cv: CV }> = ({ cv }) => {
  return (
    <div
      id="cv-render-target"
      className="cv-print-area bg-white text-slate-800 p-8 sm:p-12 font-sans max-w-[800px] mx-auto text-[13px] leading-relaxed shadow-sm border border-slate-200 print:border-none print:shadow-none"
    >
      {/* Header */}
      <div className="border-b-2 border-orange-500 pb-5 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{cv.name}</h1>
            <p className="text-base font-semibold text-orange-600 mt-0.5">{cv.professional_title}</p>
          </div>
          {cv.photo && (
            <img
              src={cv.photo}
              alt={cv.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-xl object-cover border border-slate-200 print:hidden"
            />
          )}
        </div>
        <div className="flex flex-wrap gap-y-1 gap-x-4 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100">
          {cv.email && (
            <span>
              <strong>Email:</strong> {cv.email}
            </span>
          )}
          {cv.phone && (
            <span>
              <strong>Telepon:</strong> {cv.phone}
            </span>
          )}
          {cv.location && (
            <span>
              <strong>Lokasi:</strong> {cv.location}
            </span>
          )}
          {cv.linkedin && (
            <span>
              <strong>LinkedIn:</strong> {cv.linkedin.replace('https://', '')}
            </span>
          )}
          {cv.github && (
            <span>
              <strong>GitHub:</strong> {cv.github.replace('https://', '')}
            </span>
          )}
        </div>
      </div>

      {/* Summary */}
      {cv.summary && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-1 rounded-sm mb-2.5">
            Ringkasan Profesional
          </h2>
          <p className="text-slate-700 leading-relaxed text-justify">{cv.summary}</p>
        </div>
      )}

      {/* Experience */}
      {cv.experiences && cv.experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-1 rounded-sm mb-3">
            Pengalaman Kerja
          </h2>
          <div className="space-y-4">
            {cv.experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-slate-900 text-sm">{exp.position}</h3>
                  <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    {exp.start_date} – {exp.end_date}
                  </span>
                </div>
                <div className="text-xs font-semibold text-orange-600 mb-1.5">
                  {exp.company} {exp.location ? `• ${exp.location}` : ''}
                </div>
                {exp.description && (
                  <p className="text-xs text-slate-700 mb-1.5 leading-relaxed">{exp.description}</p>
                )}
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-700">
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
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
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-1 rounded-sm mb-3">
            Portofolio Projek Utama
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {cv.projects.map((proj) => (
              <div key={proj.id} className="border-l-2 border-orange-400 pl-3">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-[13px]">{proj.name}</span>
                  {proj.project_url && (
                    <span className="text-[11px] text-orange-600">{proj.project_url.replace('https://', '')}</span>
                  )}
                </div>
                <p className="text-xs text-slate-700 mt-0.5">{proj.description}</p>
                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {proj.technologies.map((t, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {cv.educations && cv.educations.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-1 rounded-sm mb-3">
            Pendidikan
          </h2>
          <div className="space-y-3">
            {cv.educations.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">
                    {edu.degree} {edu.field ? `— ${edu.field}` : ''}
                  </span>
                  <span className="text-xs text-slate-500">
                    {edu.start_year} – {edu.end_year}
                  </span>
                </div>
                <div className="text-xs text-slate-600 font-medium">{edu.institution}</div>
                {edu.description && <p className="text-xs text-slate-600 mt-1">{edu.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {cv.skills && cv.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-1 rounded-sm mb-2.5">
            Keahlian Teknis & Tools
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {cv.skills.map((s) => (
              <span
                key={s.id}
                className="text-xs font-medium bg-slate-50 text-slate-800 border border-slate-200 px-2.5 py-1 rounded-md"
              >
                {s.skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Languages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cv.certifications && cv.certifications.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-1 rounded-sm mb-2">
              Sertifikasi
            </h2>
            <ul className="text-xs space-y-1.5 text-slate-700">
              {cv.certifications.map((c) => (
                <li key={c.id}>
                  <strong>{c.name}</strong> • {c.issuer} ({c.date})
                </li>
              ))}
            </ul>
          </div>
        )}

        {cv.languages && cv.languages.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-1 rounded-sm mb-2">
              Kemampuan Bahasa
            </h2>
            <ul className="text-xs space-y-1 text-slate-700">
              {cv.languages.map((l) => (
                <li key={l.id}>
                  <strong>{l.language}:</strong> {l.level}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
