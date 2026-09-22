import React, { useState } from 'react';
import { Project } from '../../types';
import { Modal } from '../common/Modal';
import { ExternalLink, Github, CheckCircle2, AlertCircle, Sparkles, Tag, Calendar, User } from 'lucide-react';

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, isOpen, onClose }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!project) return null;

  const allImages = [
    project.thumbnail,
    ...(project.gallery || []),
  ].filter(Boolean);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project.name}
      subtitle={`${project.category} • ${project.year}`}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Main Image Banner / Gallery Viewer */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video border border-slate-200">
          <img
            src={allImages[activeImageIndex] || project.thumbnail}
            alt={project.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-white backdrop-blur-md border border-white/20">
              {project.category}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold text-white backdrop-blur-md border border-white/20 ${
                project.status === 'Completed'
                  ? 'bg-emerald-600/90'
                  : project.status === 'In Development'
                  ? 'bg-amber-600/90'
                  : 'bg-slate-700/90'
              }`}
            >
              {project.status}
            </span>
          </div>
        </div>

        {/* Thumbnail Selector if multiple images */}
        {allImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImageIndex(i)}
                className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                  activeImageIndex === i ? 'border-orange-500 scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-4 text-xs text-slate-600">
            {project.client && (
              <span className="flex items-center gap-1.5 font-medium">
                <User className="w-4 h-4 text-orange-500" />
                Klien: <strong className="text-slate-900">{project.client}</strong>
              </span>
            )}
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-4 h-4 text-orange-500" />
              Tahun: <strong className="text-slate-900">{project.year}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:border-orange-300 hover:text-orange-600 shadow-2xs transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            )}
            {project.project_url && (
              <a
                href={project.project_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-xs transition-colors"
              >
                <span>Lihat Live Demo</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Long Description */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Deskripsi Projek
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed">
            {project.long_description || project.description}
          </p>
        </div>

        {/* Problem & Solution Grid */}
        {(project.problem || project.solution) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.problem && (
              <div className="p-4.5 rounded-2xl bg-rose-50/60 border border-rose-100">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase tracking-wide mb-2">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Problem / Masalah</span>
                </div>
                <p className="text-xs text-rose-950 leading-relaxed">{project.problem}</p>
              </div>
            )}
            {project.solution && (
              <div className="p-4.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wide mb-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Solusi Rekayasa</span>
                </div>
                <p className="text-xs text-emerald-950 leading-relaxed">{project.solution}</p>
              </div>
            )}
          </div>
        )}

        {/* Features List */}
        {project.features && project.features.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Fitur-Fitur Kunci
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {project.features.map((feat, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technology Stack Pills */}
        {project.technologies && project.technologies.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Tech Stack & Libraries
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((t, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-1.5"
                >
                  <Tag className="w-3 h-3 text-orange-500" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
