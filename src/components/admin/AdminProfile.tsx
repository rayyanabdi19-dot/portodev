import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Profile } from '../../types';
import { Save, User, MapPin, Mail, Phone, Globe, Github, Linkedin, Instagram, MessageCircle, Upload, Check } from 'lucide-react';

export const AdminProfile: React.FC = () => {
  const { data, updateProfile, uploadMedia, showToast } = usePortfolio();
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (data?.profile) {
      setFormData(data.profile);
    }
  }, [data?.profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const uploadedUrl = await uploadMedia(file);
      setIsUploading(false);
      if (uploadedUrl) {
        setFormData((prev) => ({ ...prev, photo: uploadedUrl }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile(formData);
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section: Profile Photo & Basic Identity */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Identitas Utama</h3>
            <p className="text-xs text-slate-500 mb-6">
              Foto dan informasi dasar yang tampil di Hero dan section Tentang Saya.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
              <div className="relative group">
                <img
                  src={
                    formData.photo ||
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800'
                  }
                  alt="Profile"
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-slate-200 shadow-md"
                />
                <label className="absolute inset-0 bg-slate-900/60 rounded-3xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Upload className="w-5 h-5 mb-1 text-orange-400" />
                  <span className="text-[10px] font-bold">Ganti Foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex-1 w-full space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    URL Foto Profil (atau Upload di atas)
                  </label>
                  <input
                    type="text"
                    name="photo"
                    value={formData.photo || ''}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      name="name"
                      value={formData.name || ''}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Jabatan / Profesi *
                    </label>
                    <input
                      type="text"
                      required
                      name="title"
                      value={formData.title || ''}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Bio & Descriptions */}
          <div className="space-y-4 pb-6 border-b border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Deskripsi Singkat (Hero Section)
              </label>
              <textarea
                name="short_bio"
                rows={2}
                value={formData.short_bio || ''}
                onChange={handleChange}
                placeholder="Membangun aplikasi digital yang membantu pekerjaan menjadi lebih efektif..."
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Biodata Lengkap (About / Profil Section)
              </label>
              <textarea
                name="bio"
                rows={4}
                value={formData.bio || ''}
                onChange={handleChange}
                placeholder="Tuliskan pengalaman komprehensif, filosofi rekayasa perangkat lunak, dan dedikasi..."
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Section: Contact & Coordinates */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Kontak & Lokasi</h3>
            <p className="text-xs text-slate-500 mb-4">Informasi komunikasi profesional.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    className="w-full pl-8 pr-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Nomor Telepon
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    className="w-full pl-8 pr-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Lokasi
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleChange}
                    className="w-full pl-8 pr-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Website Pribadi
                </label>
                <div className="relative">
                  <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="website"
                    value={formData.website || ''}
                    onChange={handleChange}
                    className="w-full pl-8 pr-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Social Media Links */}
          <div className="pb-6 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">Tautan Media Sosial</h3>
            <p className="text-xs text-slate-500 mb-4">Link akun profesional & media sosial aktif.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  GitHub
                </label>
                <div className="relative">
                  <Github className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="github"
                    value={formData.github || ''}
                    onChange={handleChange}
                    placeholder="https://github.com/delvandriawan"
                    className="w-full pl-8 pr-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  LinkedIn
                </label>
                <div className="relative">
                  <Linkedin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="linkedin"
                    value={formData.linkedin || ''}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/delvandriawan"
                    className="w-full pl-8 pr-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  WhatsApp URL
                </label>
                <div className="relative">
                  <MessageCircle className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="whatsapp"
                    value={formData.whatsapp || ''}
                    onChange={handleChange}
                    placeholder="https://wa.me/6281234567890"
                    className="w-full pl-8 pr-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Instagram
                </label>
                <div className="relative">
                  <Instagram className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="instagram"
                    value={formData.instagram || ''}
                    onChange={handleChange}
                    placeholder="https://instagram.com/delvandriawan"
                    className="w-full pl-8 pr-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs shadow-md transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan Profil'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
