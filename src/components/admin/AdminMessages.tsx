import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ContactMessage } from '../../types';
import {
  Inbox,
  Mail,
  MessageCircle,
  Trash2,
  CheckCircle,
  Clock,
  Search,
  ExternalLink,
  ChevronRight,
  User,
  Phone,
  Calendar,
} from 'lucide-react';

export const AdminMessages: React.FC = () => {
  const { data, toggleMessageRead, deleteMessage, showToast } = usePortfolio();
  const messages = data?.messages || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (msg.subject && msg.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === 'unread') return matchesSearch && msg.status === 'unread';
    if (filterStatus === 'read') return matchesSearch && msg.status === 'read';
    return matchesSearch;
  });

  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  const handleOpenDetail = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (msg.status === 'unread') {
      await toggleMessageRead(msg.id);
    }
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm('Apakah Anda yakin ingin menghapus pesan ini?')) {
      await deleteMessage(id);
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    }
  };

  const handleReplyEmail = (msg: ContactMessage) => {
    const mailto = `mailto:${msg.email}?subject=${encodeURIComponent(
      'Re: ' + (msg.subject || 'Diskusi Projek')
    )}`;
    window.open(mailto, '_blank');
  };

  const handleReplyWhatsApp = (msg: ContactMessage) => {
    if (!msg.phone) {
      showToast('info', 'Pengirim tidak menyertakan nomor telepon/WhatsApp.');
      return;
    }
    const cleanPhone = msg.phone.replace(/[^0-9]/g, '');
    const intlPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    const text = encodeURIComponent(
      `Halo ${msg.name}, terima kasih telah menghubungi Delv Andriawan mengenai "${msg.subject || 'projek web'}".`
    );
    window.open(`https://wa.me/${intlPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Inbox className="w-6 h-6 text-orange-600" />
            <span>Pesan Masuk (Kotak Masuk)</span>
            {unreadCount > 0 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-600 text-white font-bold animate-pulse">
                {unreadCount} baru
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Kelola seluruh pertanyaan, tawaran projek, dan pesan kontak dari pengunjung portofolio.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Semua ({messages.length})
          </button>
          <button
            onClick={() => setFilterStatus('unread')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === 'unread'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Belum Dibaca ({unreadCount})
          </button>
          <button
            onClick={() => setFilterStatus('read')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === 'read'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Sudah Dibaca ({messages.length - unreadCount})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Cari berdasarkan nama, email, subjek, atau pesan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-xs"
        />
      </div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Inbox className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800 mb-1">Belum Ada Pesan</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm
              ? 'Tidak ada pesan yang cocok dengan kata kunci pencarian Anda.'
              : 'Pesan dari pengunjung yang mengisi formulir kontak akan tampil secara real-time di sini.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {filteredMessages.map((msg) => {
            const isUnread = msg.status === 'unread';
            return (
              <div
                key={msg.id}
                onClick={() => handleOpenDetail(msg)}
                className={`p-4 sm:p-5 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 ${
                  isUnread ? 'bg-orange-50/30' : ''
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isUnread
                        ? 'bg-orange-600 text-white shadow-xs shadow-orange-500/30'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {msg.name.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-sm ${isUnread ? 'font-black text-slate-900' : 'font-semibold text-slate-700'}`}>
                        {msg.name}
                      </span>
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-orange-600 inline-block shrink-0"></span>
                      )}
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500 truncate">{msg.email}</span>
                      {msg.phone && (
                        <>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-emerald-600 font-medium truncate">{msg.phone}</span>
                        </>
                      )}
                    </div>

                    <h4 className={`text-xs truncate ${isUnread ? 'font-bold text-slate-900' : 'text-slate-700'}`}>
                      {msg.subject || 'Tanpa Subjek'}
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{msg.message}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {new Date(msg.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMessageRead(msg.id);
                      }}
                      title={isUnread ? 'Tandai sudah dibaca' : 'Tandai belum dibaca'}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <CheckCircle className={`w-4 h-4 ${!isUnread ? 'text-emerald-600' : ''}`} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(msg.id, e)}
                      title="Hapus pesan"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-slate-300 ml-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-orange-600/20">
                  {selectedMessage.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedMessage.name}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {selectedMessage.email}
                    </span>
                    {selectedMessage.phone && (
                      <span className="flex items-center gap-1 text-emerald-600 font-medium">
                        <Phone className="w-3.5 h-3.5" />
                        {selectedMessage.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                  selectedMessage.status === 'unread'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {selectedMessage.status === 'unread' ? 'Baru' : 'Sudah Dibaca'}
              </span>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Subjek / Topik
                </span>
                <p className="text-sm font-bold text-slate-900">
                  {selectedMessage.subject || 'Diskusi Projek Portofolio'}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Isi Pesan
                </span>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  Diterima pada:{' '}
                  {new Date(selectedMessage.created_at).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleReplyEmail(selectedMessage)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Balas Email</span>
                </button>

                {selectedMessage.phone && (
                  <button
                    type="button"
                    onClick={() => handleReplyWhatsApp(selectedMessage)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Balas via WA</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Hapus Pesan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
