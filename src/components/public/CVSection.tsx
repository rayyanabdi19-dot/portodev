import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { CVTemplateType } from '../../types';
import { ATSClassicTemplate } from '../cv-templates/ATSClassicTemplate';
import { ATSModernTemplate } from '../cv-templates/ATSModernTemplate';
import { ProfessionalMinimalTemplate } from '../cv-templates/ProfessionalMinimalTemplate';
import { DeveloperCVTemplate } from '../cv-templates/DeveloperCVTemplate';
import { Download, Printer, Check, Eye, Sparkles, FileText, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const CVSection: React.FC = () => {
  const { data, activeCV, showToast, trackDownloadCV } = usePortfolio();
  const cv = activeCV || data?.cvs?.[0];

  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplateType>(
    cv?.template || 'ats_modern'
  );
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!cv) return null;

  const currentCvToRender = {
    ...cv,
    template: selectedTemplate,
  };

  const templates: { id: CVTemplateType; name: string; description: string; badge: string }[] = [
    {
      id: 'ats_classic',
      name: 'ATS Classic',
      description: 'Format monokrom standar ATS dengan hierarkiGeorgia klasik, sangat ramah bot scanner HR.',
      badge: 'ATS 99%',
    },
    {
      id: 'ats_modern',
      name: 'ATS Modern',
      description: 'Single-column kontemporer dengan aksen oranye lembut dan penataan kontak rapi.',
      badge: 'Rekomendasi',
    },
    {
      id: 'professional_minimal',
      name: 'Professional Minimal',
      description: 'Desain minimalis berjarak lega untuk kesan eksekutif dan kematangan karir.',
      badge: 'Executive',
    },
    {
      id: 'developer_cv',
      name: 'Developer CV',
      description: 'Spesifik untuk Programmer/Engineer: Tech Stack disajikan di bagian atas beserta link GitHub.',
      badge: 'Tech Lead',
    },
  ];

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    showToast('info', 'Sedang memproses dokumen PDF profesional...');

    try {
      const element = document.getElementById('cv-render-target');
      if (!element) {
        throw new Error('Element CV tidak ditemukan.');
      }

      // Generate canvas with high scale for crisp vector-like text
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Delv-Andriawan-CV.pdf');
      trackDownloadCV();

      showToast('success', '✓ Berhasil mendownload Delv-Andriawan-CV.pdf');
    } catch (err) {
      console.error('PDF generation error:', err);
      // Fallback: window print
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="cv" className="py-24 bg-slate-100/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200 mb-3">
            Curriculum Vitae
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Curriculum Vitae & Resume
          </h2>
          <p className="mt-3 text-slate-600 max-w-xl text-sm sm:text-base">
            Tersedia dalam 4 format ATS-friendly terstandarisasi untuk kebutuhan lamaran korporat, tech company, maupun freelance.
          </p>
        </div>

        {/* Template Selector Pills */}
        <div className="mb-10 max-w-4xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-center sm:text-left">
            Pilih Template CV:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {templates.map((tpl) => {
              const isSelected = selectedTemplate === tpl.id;
              return (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl.id)}
                  className={`p-3.5 rounded-2xl text-left border transition-all relative ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-orange-500/50'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-orange-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs">{tpl.name}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {tpl.badge}
                    </span>
                  </div>
                  <p
                    className={`text-[11px] leading-tight ${
                      isSelected ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {tpl.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <FileText className="w-4 h-4 text-orange-500" />
            <span>Format Aktif: <strong>{templates.find((t) => t.id === selectedTemplate)?.name}</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-xs transition-colors disabled:opacity-50"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Membuat PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live CV Container Preview */}
        <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl shadow-xl border border-slate-200/90 bg-white">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between text-xs font-mono no-print">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="ml-2 text-slate-400">Delv-Andriawan-CV.pdf — Preview A4</span>
            </div>
            <span className="text-orange-400 font-semibold">{currentCvToRender.template}</span>
          </div>

          <div className="overflow-x-auto bg-slate-200/40 p-2 sm:p-6">
            {selectedTemplate === 'ats_classic' && <ATSClassicTemplate cv={currentCvToRender} />}
            {selectedTemplate === 'ats_modern' && <ATSModernTemplate cv={currentCvToRender} />}
            {selectedTemplate === 'professional_minimal' && (
              <ProfessionalMinimalTemplate cv={currentCvToRender} />
            )}
            {selectedTemplate === 'developer_cv' && <DeveloperCVTemplate cv={currentCvToRender} />}
          </div>
        </div>
      </div>
    </section>
  );
};
