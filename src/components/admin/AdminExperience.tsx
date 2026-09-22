import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Experience, EmploymentType } from '../../types';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { Plus, Edit2, Trash2, Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

export const AdminExperience: React.FC = () => {
  const { data, createExperience, updateExperience, deleteExperience } = usePortfolio();
  const experiences = data?.experiences || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Experience | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [position, setPosition] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('Semarang, Indonesia');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('Full Time');
  const [startDate, setStartDate] = useState('Jan 2022');
  const [endDate, setEndDate] = useState('Sekarang');
  const [isCurrent, setIsCurrent] = useState(false);
  const [description, setDescription] = useState('');
  const [responsibilitiesText, setResponsibilitiesText] = useState('');
  const [technologiesText, setTechnologiesText] = useState('');

  const openAddModal = () => {
    setEditingItem(null);
    setPosition('');
    setCompany('');
    setLocation('Semarang, Indonesia');
    setEmploymentType('Full Time');
    setStartDate('Jan 2022');
    setEndDate('Sekarang');
    setIsCurrent(true);
    setDescription('');
    setResponsibilitiesText('');
    setTechnologiesText('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: Experience) => {
    setEditingItem(item);
    setPosition(item.position);
    setCompany(item.company);
    setLocation(item.location || '');
    setEmploymentType(item.employment_type);
    setStartDate(item.start_date);
    setEndDate(item.end_date);
    setIsCurrent(item.is_current || false);
    setDescription(item.description);
    setResponsibilitiesText(item.responsibilities?.join('\n') || '');
    setTechnologiesText(item.technologies?.join(', ') || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      position,
      company,
      location,
      employment_type: employmentType,
      start_date: startDate,
      end_date: isCurrent ? 'Sekarang' : endDate,
      is_current: isCurrent,
      description,
      responsibilities: responsibilitiesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      technologies: technologiesText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      achievements: [],
      sort_order: 1,
    };

    if (editingItem) {
      await updateExperience(editingItem.id, payload);
    } else {
      await createExperience(payload);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (deleteConfirmId) {
      await deleteExperience(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Kelola Pengalaman Kerja</h2>
          <p className="text-xs text-slate-500">
            Daftar peran engineering, perusahaan, dan tanggung jawab teknis ({experiences.length} entri).
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengalaman</span>
        </button>
      </div>

      <div className="space-y-4">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
                    {exp.employment_type}
                  </span>
                  {exp.is_current && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Posisi Aktif
                    </span>
                  )}
                </div>
                <h3 className="font-extrabold text-lg text-slate-900">{exp.position}</h3>
                <div className="text-xs text-slate-600 font-semibold mt-0.5">
                  <span className="text-orange-600">{exp.company}</span>
                  {exp.location && <span> • {exp.location}</span>}
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                  {exp.start_date} – {exp.end_date}
                </span>
                <button
                  onClick={() => openEditModal(exp)}
                  className="p-1.5 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(exp.id)}
                  className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-700 mt-3 leading-relaxed">{exp.description}</p>

            {exp.responsibilities && exp.responsibilities.length > 0 && (
              <div className="mt-3 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Tanggung Jawab:
                </span>
                <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
                  {exp.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {exp.technologies && exp.technologies.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                {exp.technologies.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Add/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Pengalaman Kerja' : 'Tambah Pengalaman Baru'}
        maxWidth="2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Posisi / Jabatan *
              </label>
              <input
                type="text"
                required
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Contoh: Senior Fullstack Developer"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Perusahaan / Organisasi *
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Contoh: PT Solusi Teknologi Digital"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Tipe Pekerjaan *
              </label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
              >
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Freelance">Freelance</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Self Employed">Self Employed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Lokasi
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Semarang, Indonesia (atau Remote)"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Tanggal Mulai *
              </label>
              <input
                type="text"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Jan 2022"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Tanggal Selesai *
              </label>
              <input
                type="text"
                disabled={isCurrent}
                value={isCurrent ? 'Sekarang' : endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="Sekarang atau Des 2023"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white disabled:opacity-60"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_current"
              checked={isCurrent}
              onChange={(e) => setIsCurrent(e.target.checked)}
              className="rounded text-orange-500 focus:ring-orange-500"
            />
            <label htmlFor="is_current" className="text-xs font-medium text-slate-700 cursor-pointer">
              Saya sedang bekerja di posisi ini (Posisi Sekarang)
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Deskripsi Singkat Peran *
            </label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Memimpin arsitektur dan pengembangan modul..."
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Daftar Tanggung Jawab (1 baris per poin)
            </label>
            <textarea
              rows={3}
              value={responsibilitiesText}
              onChange={(e) => setResponsibilitiesText(e.target.value)}
              placeholder="Merancang database relasional MySQL&#10;Mengembangkan REST API dengan Laravel&#10;Implementasi automated testing"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Teknologi Digunakan (Pisahkan dengan koma)
            </label>
            <input
              type="text"
              value={technologiesText}
              onChange={(e) => setTechnologiesText(e.target.value)}
              placeholder="Laravel, PHP, MySQL, React, Docker"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-slate-950 shadow-md transition-all"
            >
              {editingItem ? 'Simpan Perubahan' : 'Tambah Pengalaman'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Hapus Pengalaman Kerja?"
        message="Data pengalaman ini akan dihapus permanen dari portofolio dan CV Anda."
      />
    </div>
  );
};
