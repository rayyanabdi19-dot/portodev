import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Skill, SkillCategory, SkillLevel } from '../../types';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { Plus, Edit2, Trash2, Wrench, Search, Code, Server, Database, Sparkles } from 'lucide-react';

export const AdminSkills: React.FC = () => {
  const { data, createSkill, updateSkill, deleteSkill } = usePortfolio();
  const skills = data?.skills || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Skill | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<SkillCategory>('Backend');
  const [level, setLevel] = useState<SkillLevel>('Advanced');
  const [percentage, setPercentage] = useState(85);

  const openAddModal = () => {
    setEditingItem(null);
    setName('');
    setCategory('Backend');
    setLevel('Advanced');
    setPercentage(85);
    setIsModalOpen(true);
  };

  const openEditModal = (item: Skill) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category);
    setLevel(item.level);
    setPercentage(item.percentage);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      category,
      level,
      percentage: Number(percentage),
      sort_order: 1,
      status: 'active' as const,
    };

    if (editingItem) {
      await updateSkill(editingItem.id, payload);
    } else {
      await createSkill(payload);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (deleteConfirmId) {
      await deleteSkill(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const categories = ['All', 'Frontend', 'Backend', 'Database', 'Tools', 'AI & Vibe Coding'];

  const filtered = skills.filter((s) => {
    if (selectedCategory === 'All') return true;
    return s.category === selectedCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Kelola Keahlian & Tools</h2>
          <p className="text-xs text-slate-500">
            Daftar kompetensi teknologi yang tampil dengan persentase dan badge level ({skills.length} entri).
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Skill</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === c
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((skill) => (
          <div
            key={skill.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-slate-900">{skill.name}</span>
                <span className="text-xs font-bold text-orange-600 font-mono">
                  {skill.percentage}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-linear-to-r from-orange-500 to-amber-400 rounded-full"
                  style={{ width: `${skill.percentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-semibold bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                  {skill.category}
                </span>
                <span className="font-medium text-slate-600">{skill.level}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => openEditModal(skill)}
                className="p-1.5 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setDeleteConfirmId(skill.id)}
                className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Keahlian' : 'Tambah Keahlian Baru'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Nama Keahlian / Bahasa / Framework *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Laravel, PHP, React, MySQL..."
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white font-bold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Kategori Skill *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SkillCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="Tools">Tools & DevOps</option>
                <option value="AI & Vibe Coding">AI & Vibe Coding</option>
                <option value="Mobile">Mobile</option>
                <option value="Soft Skills">Soft Skills</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Tingkat Kemahiran (Level) *
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as SkillLevel)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Persentase Penguasaan
              </label>
              <span className="text-xs font-black text-orange-600 font-mono">{percentage}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={percentage}
              onChange={(e) => setPercentage(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
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
              {editingItem ? 'Simpan Perubahan' : 'Tambah Keahlian'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Hapus Keahlian?"
        message="Skill ini akan dihapus dari bagan keahlian portofolio dan CV."
      />
    </div>
  );
};
