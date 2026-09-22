import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { CV, CVTemplateType } from '../../types';
import { ATSClassicTemplate } from '../cv-templates/ATSClassicTemplate';
import { ATSModernTemplate } from '../cv-templates/ATSModernTemplate';
import { ProfessionalMinimalTemplate } from '../cv-templates/ProfessionalMinimalTemplate';
import { DeveloperCVTemplate } from '../cv-templates/DeveloperCVTemplate';
import {
  FileText,
  Save,
  Download,
  Printer,
  Sparkles,
  RefreshCw,
  Eye,
  Check,
  Layout,
  Code,
  CheckCircle2,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const AdminCVManager: React.FC = () => {
  const { data, activeCV, updateCV, setActiveCV, showToast } = usePortfolio();

  const currentCv = activeCV || data?.cvs?.[0];
  const [formData, setFormData] = useState<Partial<CV>>({});
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    if (currentCv) {
      setFormData(currentCv);
    }
  }, [currentCv]);

  if (!currentCv) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
        <p className="text-sm text-slate-500">Memuat data CV...</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTemplateSelect = (template: CVTemplateType) => {
    setFormData((prev) => ({ ...prev, template }));
  };

  const handleSyncWithProfile = () => {
    if (!data) return;
    const profile = data.profile;
    setFormData((prev) => ({
      ...prev,
      name: profile.name,
      professional_title: profile.title,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      website: profile.website,
      github: profile.github,
      linkedin: profile.linkedin,
      photo: profile.photo,
      summary: profile.bio || profile.short_bio,
      educations: data.educations.map((e) => ({
        id: e.id,
        institution: e.institution,
        degree: e.degree,
        field: e.field,
        start_year: e.start_year,
        end_year: e.end_year,
        description: e.description,
      })),
      experiences: data.experiences.map((exp) => ({
        id: exp.id,
        position: exp.position,
        company: exp.company,
        location: exp.location,
        start_date: exp.start_date,
        end_date: exp.end_date,
        description: exp.description,
        responsibilities: exp.responsibilities,
      })),
      projects: data.projects.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        technologies: p.technologies,
        project_url: p.project_url,
      })),
      skills: data.skills.map((s) => ({
        id: s.id,
        skill: s.name,
        level: s.level,
        category: s.category,
      })),
      certifications: data.certifications.map((c) => ({
        id: c.id,
        name: c.name,
        issuer: c.issuer,
        date: c.issue_date,
      })),
    }));
    showToast('success', '✓ Seluruh data terbaru di Portofolio berhasil disinkronkan ke CV!');
  };

  const handleSave = async () => {
    await updateCV(currentCv.id, formData);
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    showToast('info', 'Sedang memproses dokumen PDF...');

    try {
      const element = document.getElementById('cv-render-target');
      if (!element) throw new Error('CV element not found');

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

      showToast('success', '✓ Berhasil mendownload Delv-Andriawan-CV.pdf');
    } catch (err) {
      console.error(err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const fullCvToRender = { ...currentCv, ...formData } as CV;

  const templates: { id: CVTemplateType; name: string; desc: string; tag: string }[] = [
    { id: 'ats_classic', name: 'ATS Classic', desc: 'Monokrom, font serif, ramah mesin filter HR', tag: 'ATS 99%' },
    { id: 'ats_modern', name: 'ATS Modern', desc: 'Single column rapi dengan aksen oranye', tag: 'Paling Populer' },
    { id: 'professional_minimal', name: 'Professional Minimal', desc: 'Ruang baca lega, bersih & elegan', tag: 'Clean' },
    { id: 'developer_cv', name: 'Developer CV', desc: 'Tech stack & GitHub ditaruh di awal', tag: 'Tech Focus' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Manajemen CV & ATS Template Builder</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Aktif di Web Publik
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Konfigurasi data resume, pilih template terstandarisasi, dan ekspor ke PDF kualitas tinggi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSyncWithProfile}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
            title="Tarik data otomatis dari riwayat portfolio"
          >
            <RefreshCw className="w-3.5 h-3.5 text-orange-500" />
            <span>Sinkronkan Portofolio</span>
          </button>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-slate-950 shadow-md transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Perubahan CV</span>
          </button>
        </div>
      </div>

      {/* Template Selection Radio Cards */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">
          Pilih Template Desain CV Aktif:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {templates.map((tpl) => {
            const isSelected = formData.template === tpl.id;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => handleTemplateSelect(tpl.id)}
                className={`p-4 rounded-2xl text-left border transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-orange-500/50'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white hover:border-orange-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs">{tpl.name}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-orange-500 text-white' : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    {tpl.tag}
                  </span>
                </div>
                <p className={`text-[11px] leading-tight ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                  {tpl.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor & Preview Mode Switcher */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'editor'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Formulir Data CV
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Pratinjau A4 Live</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            title="Print"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Tab: Form Editor */}
      {activeTab === 'editor' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 text-orange-600">
              1. Informasi Kontak di CV
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Title Profesional *
                </label>
                <input
                  type="text"
                  name="professional_title"
                  value={formData.professional_title || ''}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Telepon / WhatsApp
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Lokasi
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  GitHub
                </label>
                <input
                  type="text"
                  name="github"
                  value={formData.github || ''}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Ringkasan Profesional (Summary ATS)
            </label>
            <textarea
              name="summary"
              rows={4}
              value={formData.summary || ''}
              onChange={handleChange}
              placeholder="Fullstack Developer dengan pengalaman 4+ tahun..."
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500"
            />
          </div>

          {/* Quick stats of linked records */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 text-orange-600">
              2. Data Terkait di CV Ini
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Pengalaman Kerja:</span>
                <span className="text-base font-bold text-slate-900">
                  {formData.experiences?.length || 0} entri
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Projek Pilihan:</span>
                <span className="text-base font-bold text-slate-900">
                  {formData.projects?.length || 0} entri
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Riwayat Pendidikan:</span>
                <span className="text-base font-bold text-slate-900">
                  {formData.educations?.length || 0} entri
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Keahlian (Skills):</span>
                <span className="text-base font-bold text-slate-900">
                  {formData.skills?.length || 0} skill
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              * Tips: Anda dapat mengklik tombol "Sinkronkan Portofolio" di atas kapan saja untuk menyegarkan data CV dengan pembaruan terakhir di dashboard.
            </p>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs shadow-md transition-all"
            >
              Simpan Data CV
            </button>
          </div>
        </div>
      )}

      {/* Tab: Live A4 Preview */}
      {activeTab === 'preview' && (
        <div className="rounded-3xl border border-slate-300 overflow-hidden shadow-xl bg-slate-200/50 p-4 sm:p-8 flex justify-center">
          <div className="w-full max-w-[800px]">
            {formData.template === 'ats_classic' && <ATSClassicTemplate cv={fullCvToRender} />}
            {formData.template === 'ats_modern' && <ATSModernTemplate cv={fullCvToRender} />}
            {formData.template === 'professional_minimal' && (
              <ProfessionalMinimalTemplate cv={fullCvToRender} />
            )}
            {formData.template === 'developer_cv' && <DeveloperCVTemplate cv={fullCvToRender} />}
          </div>
        </div>
      )}
    </div>
  );
};
