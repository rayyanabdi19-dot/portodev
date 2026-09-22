import React from 'react';
import { CV } from '../../types';

export const ATSClassicTemplate: React.FC<{ cv: CV }> = ({ cv }) => {
  return (
    <div
      id="cv-render-target"
      className="cv-print-area bg-white text-black p-8 sm:p-12 font-serif max-w-[800px] mx-auto text-[13px] leading-relaxed shadow-sm border border-slate-200 print:border-none print:shadow-none"
      style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif' }}
    >
      {/* Header */}
      <div className="text-center border-b border-black pb-4 mb-5">
        <h1 className="text-2xl font-bold uppercase tracking-wider text-black">{cv.name}</h1>
        <p className="text-sm font-semibold tracking-wide text-gray-800 mt-1 uppercase">
          {cv.professional_title}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs text-gray-700 mt-2 font-sans">
          {cv.location && <span>{cv.location}</span>}
          {cv.phone && <span>• {cv.phone}</span>}
          {cv.email && <span>• {cv.email}</span>}
          {cv.linkedin && <span>• {cv.linkedin.replace('https://', '')}</span>}
          {cv.github && <span>• {cv.github.replace('https://', '')}</span>}
          {cv.website && <span>• {cv.website.replace('https://', '')}</span>}
        </div>
      </div>

      {/* Professional Summary */}
      {cv.summary && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-1 mb-2 font-sans text-black">
            Professional Summary
          </h2>
          <p className="text-gray-900 text-justify leading-normal">{cv.summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {cv.experiences && cv.experiences.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-1 mb-2.5 font-sans text-black">
            Work Experience
          </h2>
          <div className="space-y-4">
            {cv.experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline font-sans">
                  <span className="font-bold text-black text-[13px]">{exp.position}</span>
                  <span className="text-xs text-gray-700">
                    {exp.start_date} – {exp.end_date}
                  </span>
                </div>
                <div className="flex justify-between items-baseline italic text-xs text-gray-800 mb-1">
                  <span>{exp.company}</span>
                  {exp.location && <span>{exp.location}</span>}
                </div>
                {exp.description && (
                  <p className="text-gray-900 text-xs mb-1.5 leading-normal">{exp.description}</p>
                )}
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-gray-900">
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

      {/* Education */}
      {cv.educations && cv.educations.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-1 mb-2 font-sans text-black">
            Education
          </h2>
          <div className="space-y-3">
            {cv.educations.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline font-sans">
                  <span className="font-bold text-black text-[13px]">
                    {edu.degree} {edu.field ? `in ${edu.field}` : ''}
                  </span>
                  <span className="text-xs text-gray-700">
                    {edu.start_year} – {edu.end_year}
                  </span>
                </div>
                <div className="italic text-xs text-gray-800">{edu.institution}</div>
                {edu.description && (
                  <p className="text-xs text-gray-800 mt-1 leading-normal">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {cv.skills && cv.skills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-1 mb-2 font-sans text-black">
            Technical Skills
          </h2>
          <div className="text-xs text-gray-900 font-sans leading-relaxed">
            <span className="font-semibold">Core Competencies: </span>
            {cv.skills.map((s) => s.skill).join(' • ')}
          </div>
        </div>
      )}

      {/* Projects */}
      {cv.projects && cv.projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-1 mb-2.5 font-sans text-black">
            Selected Projects
          </h2>
          <div className="space-y-3">
            {cv.projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline font-sans">
                  <span className="font-bold text-black text-[13px]">{proj.name}</span>
                  {proj.project_url && (
                    <span className="text-xs text-gray-600 underline">
                      {proj.project_url.replace('https://', '')}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-900 mt-0.5 leading-normal">{proj.description}</p>
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-[11px] text-gray-700 italic mt-0.5 font-sans">
                    Stack: {proj.technologies.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Languages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cv.certifications && cv.certifications.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-1 mb-2 font-sans text-black">
              Certifications
            </h2>
            <ul className="text-xs space-y-1.5">
              {cv.certifications.map((c) => (
                <li key={c.id}>
                  <span className="font-semibold">{c.name}</span> —{' '}
                  <span className="italic">{c.issuer}</span> ({c.date})
                </li>
              ))}
            </ul>
          </div>
        )}

        {cv.languages && cv.languages.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-1 mb-2 font-sans text-black">
              Languages
            </h2>
            <ul className="text-xs space-y-1">
              {cv.languages.map((l) => (
                <li key={l.id}>
                  <span className="font-semibold">{l.language}</span>: {l.level}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
