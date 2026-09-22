import React, { useState, useMemo } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project, ProjectCategory } from '../../types';
import { ProjectDetailModal } from './ProjectDetailModal';
import { ExternalLink, Eye, Search, Sparkles, FolderCode } from 'lucide-react';

export const ProjectsSection: React.FC = () => {
  const { data } = usePortfolio();
  const projects = data?.projects || [];

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const categories = ['All', 'POS', 'Education', 'Finance', 'Web Application', 'SaaS', 'Business'];

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.technologies?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <section id="projek" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200 mb-3">
            Karya Unggulan
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Portofolio Projek
          </h2>
          <p className="mt-3 text-slate-600 max-w-xl text-sm sm:text-base">
            Koleksi aplikasi web, sistem enterprise, dan solusi digital yang telah saya bangun dengan standar industri.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama atau teknologi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-2xs"
            />
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
            <FolderCode className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">Tidak ada projek ditemukan</h3>
            <p className="text-xs text-slate-500 mt-1">
              Coba sesuaikan kata kunci pencarian atau ubah filter kategori.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-orange-300 transition-all duration-300 flex flex-col"
              >
                {/* Image Container with overlay */}
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  <img
                    src={project.thumbnail}
                    alt={project.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-900/85 text-white backdrop-blur-xs border border-white/20">
                      {project.category}
                    </span>

                    {project.is_featured && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-500 text-white shadow-xs">
                        <Sparkles className="w-3 h-3" />
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {project.name}
                    </h3>
                    <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tech Badges */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.technologies?.slice(0, 4).map((tech, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                      {(project.technologies?.length || 0) > 4 && (
                        <span className="text-[10px] font-semibold text-slate-400 self-center">
                          +{project.technologies.length - 4} lainnya
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      onClick={() => setActiveModalProject(project)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-orange-600 transition-colors py-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Detail</span>
                    </button>

                    {project.project_url && (
                      <a
                        href={project.project_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-orange-50 text-orange-700 hover:bg-orange-500 hover:text-white border border-orange-200 transition-all shadow-2xs"
                      >
                        <span>Demo</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={activeModalProject}
        isOpen={!!activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />
    </section>
  );
};
