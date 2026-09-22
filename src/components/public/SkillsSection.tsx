import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SkillCategory } from '../../types';
import { Code, Server, Database, Wrench, Sparkles } from 'lucide-react';

export const SkillsSection: React.FC = () => {
  const { data } = usePortfolio();
  const skills = data?.skills || [];

  const [activeTab, setActiveTab] = useState<string>('All');

  const categories: { label: string; key: string; icon: React.ReactNode }[] = [
    { label: 'Semua Skill', key: 'All', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { label: 'Frontend', key: 'Frontend', icon: <Code className="w-3.5 h-3.5" /> },
    { label: 'Backend', key: 'Backend', icon: <Server className="w-3.5 h-3.5" /> },
    { label: 'Database', key: 'Database', icon: <Database className="w-3.5 h-3.5" /> },
    { label: 'Tools', key: 'Tools', icon: <Wrench className="w-3.5 h-3.5" /> },
    { label: 'AI & Vibe Coding', key: 'AI & Vibe Coding', icon: <Sparkles className="w-3.5 h-3.5 text-orange-500" /> },
  ];

  const filteredSkills = skills.filter((s) => {
    if (activeTab === 'All') return true;
    return s.category === activeTab;
  });

  return (
    <section id="skill" className="py-24 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200 mb-3">
            Kompetensi
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Keahlian Teknis & Tools
          </h2>
          <p className="mt-3 text-slate-600 max-w-xl text-sm sm:text-base">
            Perangkat lunak, bahasa pemrograman, dan framework yang saya kuasai secara mendalam untuk produksi sistem nyata.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveTab(cat.key)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === cat.key
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 border border-slate-200'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-orange-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-slate-900 group-hover:text-orange-600 transition-colors">
                  {skill.name}
                </span>
                <span className="text-xs font-bold text-orange-600 font-mono">
                  {skill.percentage}%
                </span>
              </div>

              {/* Progress bar container */}
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-2.5">
                <div
                  className="h-full bg-linear-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-700"
                  style={{ width: `${skill.percentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-medium bg-white px-2 py-0.5 rounded border border-slate-200">
                  {skill.category}
                </span>
                <span className="font-semibold text-slate-700">{skill.level}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
