import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Education } from '../../types';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { Plus, Edit2, Trash2, GraduationCap, Calendar, Award } from 'lucide-react';

export const AdminEducation: React.FC = () => {
  const { data, createEducation, updateEducation, deleteEducation } = usePortfolio();
  const educations = data?.educations || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Education | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('S1');
  const [field, setField] = useState('');
  const [startYear, setStartYear] = useState('2019');
  const [endYear, setEndYear] = useState('2023');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Lulus');

  const openAddModal = () => {
    setEditingItem(null);
    setInstitution('');
    setDegree('S1');
    setField('');
    setStartYear('2019');
    setEndYear('2023');
    setDescription('');
    setStatus('Lulus');
    setIsModalOpen(true);
  };

  const openEditModal = (item: Education) => {
    setEditingItem(item);
    setInstitution(item.institution);
    setDegree(item.degree);
    setField(item.field);
    setStartYear(item.start_year);
    setEndYear(item.end_year);
    setDescription(item.description || '');
    setStatus(item.status || 'Lulus');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      institution,
      degree,
      field,
      start_year: startYear,
      end_year: endYear,
      description,
      status,
      sort_order: 1,
    };

    if (editingItem) {
      await updateEducation(editingItem.id, payload);
    } else {
      await createEducation(payload);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (deleteConfirmId) {
      await deleteEducation(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Kelola Riwayat Pendidikan</h2>
          <p className="text-xs text-slate-500">
            Daftar universitas, sekolah kejuruan, dan latar belakang studi formal ({educations.length} entri).
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pendidikan</span>
        </button>
      </div>

      {/* Grid of Education Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {educations.map((edu) => (
          <div
            key={edu.id}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                  {edu.degree} — {edu.status || 'Lulus'}
                </span>
                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-md border border-slate-200">
                  {edu.start_year} – {edu.end_year}
                </span>
              </div>
              <h3 className="font-extrabold text-base text-slate-900">{edu.institution}</h3>
              <p className="text-xs font-semibold text-orange-600 mt-0.5">{edu.field}</p>
              {edu.description && (
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">{edu.description}</p>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => openEditModal(edu)}
                className="p-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setDeleteConfirmId(edu.id)}
                className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Riwayat Pendidikan' : 'Tambah Pendidikan Baru'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Institusi / Universitas / Sekolah *
            </label>
            <input
              type="text"
              required
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="Contoh: Universitas Dian Nuswantoro"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Jenjang *
              </label>
              <select
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
              >
                <option value="S1">S1 — Sarjana</option>
                <option value="S2">S2 — Magister</option>
                <option value="D3">D3 — Diploma Tiga</option>
                <option value="D4">D4 — Diploma Empat</option>
                <option value="SMK">SMK — Kejuruan</option>
                <option value="SMA">SMA</option>
                <option value="Bootcamp">Bootcamp / Sertifikasi</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Jurusan / Bidang Studi *
              </label>
              <input
                type="text"
                required
                value={field}
                onChange={(e) => setField(e.target.value)}
                placeholder="Contoh: Teknik Informatika"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Tahun Mulai *
              </label>
              <input
                type="text"
                required
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
                placeholder="2019"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Tahun Selesai *
              </label>
              <input
                type="text"
                required
                value={endYear}
                onChange={(e) => setEndYear(e.target.value)}
                placeholder="2023 atau Sekarang"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
              >
                <option value="Lulus">Lulus</option>
                <option value="Sedang Berjalan">Sedang Berjalan</option>
                <option value="Cuti">Cuti</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Deskripsi Singkat / Fokus Studi
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Fokus pada rekayasa perangkat lunak, perancangan database, dan skripsi..."
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
              {editingItem ? 'Simpan Perubahan' : 'Tambah Pendidikan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Hapus Data Pendidikan?"
        message="Data riwayat pendidikan ini akan dihapus permanen dari portofolio dan CV Anda."
      />
    </div>
  );
};
