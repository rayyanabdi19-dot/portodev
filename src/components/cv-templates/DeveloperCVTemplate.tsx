import React from 'react';
import { CV } from '../../types';

export const DeveloperCVTemplate: React.FC<{ cv: CV }> = ({ cv }) => {
  return (
    <div
      id="cv-render-target"
      className="cv-print-area bg-white text-slate-800 p-8 sm:p-12 font-sans max-w-[800px] mx-auto text-[13px] leading-relaxed shadow-sm border border-slate-200 print:border-none print:shadow-none"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-300 pb-4 mb-5 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span className="text-orange-500 font-mono">$&gt;</span> {cv.name}
          </h1>
          <p className="text-sm font-semibold text-slate-700 font-mono mt-0.5">{cv.professional_title}</p>
        </div>
        <div className="text-right text-xs text-slate-600 font-mono space-y-0.5">
          {cv.email && <div>✉ {cv.email}</div>}
          {cv.phone && <div>☎ {cv.phone}</div>}
          {cv.github && <div className="text-orange-600">gh: {cv.github.replace('https://github.com/', '')}</div>}
          {cv.linkedin && <div>in: {cv.linkedin.replace('https://linkedin.com/in/', '')}</div>}
        </div>
      </div>

      {/* Summary */}
      {cv.summary && (
        <div className="mb-5 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
          <p className="text-xs text-slate-700 leading-normal font-sans">{cv.summary}</p>
        </div>
      )}

      {/* Tech Stack (Highlighted Upfront for Developer CV) */}
      {cv.skills && cv.skills.length > 0 && (
        <div className="mb-5">
          <div className="text-xs font-mono font-bold uppercase text-slate-900 border-b border-slate-200 pb-1 mb-2.5 flex items-center justify-between">
            <span>// Tech Stack & Tooling</span>
            <span className="text-[10px] text-orange-600 font-normal">Expertise Matrix</span>
          </div>
          <div className="flex flex-wrap gap-1.5 font-mono text-xs">
            {cv.skills.map((s) => (
              <span
                key={s.id}
                className="bg-slate-900 text-white px-2 py-0.5 rounded text-[11px] font-medium"
              >
                {s.skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {cv.experiences && cv.experiences.length > 0 && (
        <div className="mb-5">
          <div className="text-xs font-mono font-bold uppercase text-slate-900 border-b border-slate-200 pb-1 mb-3">
            // Work Experience
          </div>
          <div className="space-y-4">
            {cv.experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline font-mono">
                  <h3 className="font-bold text-slate-900 text-xs">
                    {exp.position} <span className="text-orange-600">@{exp.company}</span>
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    [{exp.start_date} - {exp.end_date}]
                  </span>
                </div>
                {exp.description && (
                  <p className="text-xs text-slate-700 mt-1 leading-normal font-sans">{exp.description}</p>
                )}
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-1.5 space-y-1 text-xs text-slate-700 font-sans">
                    {exp.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
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
        <div className="mb-5">
          <div className="text-xs font-mono font-bold uppercase text-slate-900 border-b border-slate-200 pb-1 mb-3">
            // Key Projects & Production Systems
          </div>
          <div className="space-y-3 font-sans">
            {cv.projects.map((proj) => (
              <div key={proj.id} className="border border-slate-200 p-3 rounded-lg">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-xs">{proj.name}</span>
                  {proj.project_url && (
                    <span className="text-[11px] font-mono text-orange-600">
                      {proj.project_url.replace('https://', '')}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-700 mt-1">{proj.description}</p>
                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {proj.technologies.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200"
                      >
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

      {/* Education & Certs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cv.educations && cv.educations.length > 0 && (
          <div>
            <div className="text-xs font-mono font-bold uppercase text-slate-900 border-b border-slate-200 pb-1 mb-2">
              // Education
            </div>
            {cv.educations.map((edu) => (
              <div key={edu.id} className="text-xs">
                <div className="font-semibold text-slate-900">
                  {edu.degree} - {edu.field}
                </div>
                <div className="text-slate-600 font-mono text-[11px]">
                  {edu.institution} ({edu.start_year}-{edu.end_year})
                </div>
              </div>
            ))}
          </div>
        )}

        {cv.certifications && cv.certifications.length > 0 && (
          <div>
            <div className="text-xs font-mono font-bold uppercase text-slate-900 border-b border-slate-200 pb-1 mb-2">
              // Certifications
            </div>
            <ul className="text-xs space-y-1">
              {cv.certifications.map((c) => (
                <li key={c.id}>
                  <span className="font-semibold">{c.name}</span>{' '}
                  <span className="text-slate-500 font-mono text-[11px]">[{c.issuer}]</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
