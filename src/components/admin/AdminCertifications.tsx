import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Certification } from '../../types';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { Plus, Edit2, Trash2, Award, ExternalLink, Calendar } from 'lucide-react';

export const AdminCertifications: React.FC = () => {
  const { data, createCertification, updateCertification, deleteCertification } = usePortfolio();
  const certs = data?.certifications || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Certification | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [issueDate, setIssueDate] = useState('2023');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [description, setDescription] = useState('');

  const openAddModal = () => {
    setEditingItem(null);
    setName('');
    setIssuer('');
    setIssueDate('2023');
    setCredentialUrl('');
    setCredentialId('');
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: Certification) => {
    setEditingItem(item);
    setName(item.name);
    setIssuer(item.issuer);
    setIssueDate(item.issue_date);
    setCredentialUrl(item.credential_url || '');
    setCredentialId(item.credential_id || '');
    setDescription(item.description || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      issuer,
      issue_date: issueDate,
      credential_url: credentialUrl,
      credential_id: credentialId,
      description,
    };

    if (editingItem) {
      await updateCertification(editingItem.id, payload);
    } else {
      await createCertification(payload);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (deleteConfirmId) {
      await deleteCertification(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Kelola Sertifikasi & Lisensi</h2>
          <p className="text-xs text-slate-500">
            Bukti kompetensi formal dan kelulusan program sertifikasi teknis ({certs.length} entri).
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Sertifikasi</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certs.map((c) => (
          <div
            key={c.id}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                  {c.issuer}
                </span>
                <span className="text-xs font-mono font-medium text-slate-500">{c.issue_date}</span>
              </div>
              <h3 className="font-extrabold text-base text-slate-900">{c.name}</h3>
              {c.description && <p className="text-xs text-slate-600 mt-2">{c.description}</p>}
              {c.credential_id && (
                <p className="text-[11px] font-mono text-slate-400 mt-1">ID: {c.credential_id}</p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              {c.credential_url ? (
                <a
                  href={c.credential_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-slate-700 hover:text-orange-600 flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Verifikasi Kredensial</span>
                </a>
              ) : (
                <span />
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(c)}
                  className="p-1.5 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setDeleteConfirmId(c.id)}
                  className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Sertifikasi' : 'Tambah Sertifikasi Baru'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Nama Sertifikasi / Kompetensi *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Certified Web Developer"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white font-bold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Penerbit / Institusi *
              </label>
              <input
                type="text"
                required
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                placeholder="Contoh: BNSP / Dicoding / Binar"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Bulan & Tahun Terbit *
              </label>
              <input
                type="text"
                required
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                placeholder="Contoh: Okt 2023"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                URL Kredensial / Sertifikat
              </label>
              <input
                type="text"
                value={credentialUrl}
                onChange={(e) => setCredentialUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Credential ID / Nomor Sertifikat
              </label>
              <input
                type="text"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                placeholder="Contoh: CERT-2023-9821"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Deskripsi Singkat Materi
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Pengujian kompetensi arsitektur MVC, RESTful API, dan database query optimization..."
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
              {editingItem ? 'Simpan Perubahan' : 'Tambah Sertifikasi'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Hapus Sertifikasi?"
        message="Sertifikasi ini akan dihapus dari portofolio Anda."
      />
    </div>
  );
};
