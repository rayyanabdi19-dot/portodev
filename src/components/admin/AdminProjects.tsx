import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project, ProjectCategory, ProjectStatus } from '../../types';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import {
  Plus,
  Edit2,
  Trash2,
  FolderCode,
  Sparkles,
  ExternalLink,
  Upload,
  Search,
  Eye,
  CheckCircle,
} from 'lucide-react';

export const AdminProjects: React.FC = () => {
  const { data, createProject, updateProject, deleteProject, uploadMedia, showToast } = usePortfolio();
  const projects = data?.projects || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Project | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('POS');
  const [thumbnail, setThumbnail] = useState('');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [technologiesText, setTechnologiesText] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('Completed');
  const [year, setYear] = useState('2024');
  const [client, setClient] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [galleryText, setGalleryText] = useState('');

  const openAddModal = () => {
    setEditingItem(null);
    setName('');
    setCategory('POS');
    setThumbnail('https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&q=80&w=800');
    setDescription('');
    setLongDescription('');
    setProblem('');
    setSolution('');
    setFeaturesText('');
    setTechnologiesText('PHP, MySQL, Tailwind CSS, JavaScript');
    setProjectUrl('');
    setGithubUrl('');
    setStatus('Completed');
    setYear('2024');
    setClient('');
    setIsFeatured(false);
    setGalleryText('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: Project) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category);
    setThumbnail(item.thumbnail);
    setDescription(item.description);
    setLongDescription(item.long_description || '');
    setProblem(item.problem || '');
    setSolution(item.solution || '');
    setFeaturesText(item.features?.join('\n') || '');
    setTechnologiesText(item.technologies?.join(', ') || '');
    setProjectUrl(item.project_url || '');
    setGithubUrl(item.github_url || '');
    setStatus(item.status);
    setYear(item.year || '2024');
    setClient(item.client || '');
    setIsFeatured(item.is_featured || false);
    setGalleryText(item.gallery?.join('\n') || '');
    setIsModalOpen(true);
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const uploadedUrl = await uploadMedia(file);
      if (uploadedUrl) {
        setThumbnail(uploadedUrl);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      category,
      thumbnail,
      description,
      long_description: longDescription,
      problem,
      solution,
      features: featuresText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      technologies: technologiesText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      project_url: projectUrl,
      github_url: githubUrl,
      status,
      year,
      client,
      is_featured: isFeatured,
      gallery: galleryText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      sort_order: 1,
    };

    if (editingItem) {
      await updateProject(editingItem.id, payload);
    } else {
      await createProject(payload);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (deleteConfirmId) {
      await deleteProject(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Kelola Projek Portofolio</h2>
          <p className="text-xs text-slate-500">
            Daftar aplikasi dan sistem yang ditampilkan di halaman publik ({projects.length} entri).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari projek..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500"
            />
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs shadow-md transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Projek</span>
          </button>
        </div>
      </div>

      {/* Projects List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((proj) => (
          <div
            key={proj.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
          >
            <div>
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                <img
                  src={proj.thumbnail}
                  alt={proj.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 text-white backdrop-blur-xs">
                    {proj.category}
                  </span>
                  {proj.is_featured && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500 text-white shadow-xs">
                      <Sparkles className="w-3 h-3" /> Featured
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-sm text-slate-900 leading-snug">{proj.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{proj.description}</p>

                <div className="flex flex-wrap gap-1 mt-3">
                  {proj.technologies?.slice(0, 3).map((t, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                  {(proj.technologies?.length || 0) > 3 && (
                    <span className="text-[10px] text-slate-400">+{proj.technologies.length - 3}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">{proj.year}</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(proj)}
                  className="p-1.5 text-slate-600 hover:text-orange-600 hover:bg-white rounded-lg transition-colors text-xs font-semibold flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setDeleteConfirmId(proj.id)}
                  className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-white rounded-lg transition-colors text-xs font-semibold flex items-center gap-1"
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
        title={editingItem ? 'Edit Data Projek' : 'Tambah Projek Baru'}
        maxWidth="3xl"
      >
        <form onSubmit={handleSave} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Nama Projek *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: DPos — Point of Sale System"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Kategori *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
              >
                <option value="POS">POS (Point of Sale)</option>
                <option value="Web Application">Web Application</option>
                <option value="Education">Education</option>
                <option value="Finance">Finance</option>
                <option value="SaaS">SaaS</option>
                <option value="Mobile Application">Mobile Application</option>
                <option value="Business">Business</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Thumbnail image and upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Thumbnail URL atau Unggah Gambar *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
              />
              <label className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer flex items-center gap-1.5 shrink-0">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Deskripsi Singkat (Card Portofolio) *
            </label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Sistem kasir cerdas untuk UMKM dengan manajemen inventaris real-time..."
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Deskripsi Lengkap (Detail Modal)
            </label>
            <textarea
              rows={3}
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              placeholder="Jelaskan arsitektur teknis, implementasi database, dan skalabilitas sistem..."
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
            />
          </div>

          {/* Problem & Solution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Problem / Masalah yang Diselesaikan
              </label>
              <textarea
                rows={2}
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Pencatatan manual yang lambat dan rawan human-error..."
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Solusi Rekayasa Sistem
              </label>
              <textarea
                rows={2}
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                placeholder="Aplikasi web responsive berbasis cloud dengan sinkronisasi inventori otomatis..."
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Fitur Utama (1 baris per fitur)
              </label>
              <textarea
                rows={3}
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                placeholder="Multi-cabang kasir&#10;Laporan laba rugi otomatis&#10;Cetak struk thermal bluetooth"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Teknologi Digunakan (Pisahkan dengan koma) *
              </label>
              <input
                type="text"
                required
                value={technologiesText}
                onChange={(e) => setTechnologiesText(e.target.value)}
                placeholder="PHP, Laravel, MySQL, Tailwind CSS, Alpine.js"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
              />

              <div className="mt-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Galeri Foto Tambahan (1 URL per baris)
                </label>
                <textarea
                  rows={2}
                  value={galleryText}
                  onChange={(e) => setGalleryText(e.target.value)}
                  placeholder="https://.../screenshot1.png&#10;https://.../screenshot2.png"
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Link Live Demo
              </label>
              <input
                type="text"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                placeholder="https://demo.delvandriawan.com"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Link Repository GitHub
              </label>
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/delvandriawan/project-name"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Status Projek *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
              >
                <option value="Completed">Completed</option>
                <option value="In Development">In Development</option>
                <option value="Maintained">Maintained</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Tahun Pembuatan
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2024"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Nama Klien (Opsional)
              </label>
              <input
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="PT Retail Nusantara"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_featured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded text-orange-500 focus:ring-orange-500"
            />
            <label htmlFor="is_featured" className="text-xs font-bold text-slate-800 cursor-pointer">
              Tandai sebagai Projek Unggulan (Featured Project Badge)
            </label>
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
              {editingItem ? 'Simpan Perubahan' : 'Tambah Projek'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Hapus Projek Portofolio?"
        message="Projek ini akan dihapus permanen dari portofolio publik dan CV Anda."
      />
    </div>
  );
};
