import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Mail, MessageCircle, Send, CheckCircle2, Github, Linkedin, Instagram, Sparkles } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { data, showToast, sendMessage } = usePortfolio();
  const profile = data?.profile;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast('error', 'Mohon lengkapi nama, email, dan pesan Anda.');
      return;
    }

    setIsSubmitting(true);
    const success = await sendMessage({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      subject: subject.trim() || `Diskusi Projek dari ${name}`,
      message: message.trim(),
    });
    setIsSubmitting(false);

    if (success) {
      setIsSent(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    }
  };

  const waText = encodeURIComponent('Halo Delv Andriawan, saya melihat portofolio Anda dan ingin berdiskusi tentang sebuah projek.');
  const waBaseUrl = profile?.whatsapp || 'https://wa.me/6281234567890';
  const fullWaUrl = waBaseUrl.includes('?') ? `${waBaseUrl}&text=${waText}` : `${waBaseUrl}?text=${waText}`;

  return (
    <section id="kontak" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200 mb-3 inline-block">
            Mulai Kolaborasi
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Let's Work Together
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-xl mx-auto">
            Punya ide projek, ingin konsultasi arsitektur web, atau membutuhkan developer freelance berdedikasi? Mari berdiskusi!
          </p>

          {/* Quick Direct Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={fullWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Hubungi via WhatsApp</span>
            </a>

            <a
              href={`mailto:${profile?.email || 'delv.andriawan@gmail.com'}`}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all transform hover:-translate-y-0.5"
            >
              <Mail className="w-5 h-5 text-orange-400" />
              <span>Kirim Email Langsung</span>
            </a>
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="max-w-2xl mx-auto bg-slate-50 p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs">
          {isSent ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Pesan Berhasil Terkirim!</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                Terima kasih telah menghubungi. Pesan Anda telah tersimpan di sistem dan masuk ke Inbox Admin Delv Andriawan. Kami akan segera merespons ke email Anda.
              </p>
              <button
                type="button"
                onClick={() => setIsSent(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
              >
                Kirim Pesan Lainnya
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Kirim Pesan Langsung</h3>
              <p className="text-xs text-slate-500 mb-6">
                Pesan akan langsung tersimpan di sistem portofolio dan masuk ke dashboard admin Delv Andriawan.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Nama Anda *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Budi Santoso"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-white border border-slate-200 text-slate-800 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Email Anda *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="budi@perusahaan.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-white border border-slate-200 text-slate-800 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Nomor WhatsApp / HP (Opsional)
                    </label>
                    <input
                      type="tel"
                      placeholder="Contoh: 081234567890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-white border border-slate-200 text-slate-800 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Topik / Subjek
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Pembuatan Sistem POS / ERP"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-white border border-slate-200 text-slate-800 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Pesan Lengkap *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Ceritakan gambaran projek, timeline, atau kebutuhan sistem yang Anda rencanakan..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-white border border-slate-200 text-slate-800 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Mengirimkan Pesan...' : 'Kirimkan Pesan Sekarang'}</span>
                </button>
              </form>
            </>
          )}

          {/* Social Links Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-600">
            {profile?.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-orange-600 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            )}
            {profile?.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-orange-600 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            )}
            {profile?.instagram && (
              <a
                href={profile.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-rose-600 transition-colors"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
