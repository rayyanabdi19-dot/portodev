import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { AboutSection } from './AboutSection';
import { EducationSection } from './EducationSection';
import { ExperienceSection } from './ExperienceSection';
import { ProjectsSection } from './ProjectsSection';
import { SkillsSection } from './SkillsSection';
import { CVSection } from './CVSection';
import { ContactSection } from './ContactSection';
import { Footer } from './Footer';
import { DashboardSkeleton } from '../common/Skeleton';

export const PublicPortfolio: React.FC = () => {
  const { isLoading } = usePortfolio();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-orange-500 font-extrabold text-xl flex items-center justify-center mx-auto shadow-md animate-bounce">
            DA
          </div>
          <p className="text-sm font-bold text-slate-700">Memuat Delv Andriawan Portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <EducationSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <CVSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};
