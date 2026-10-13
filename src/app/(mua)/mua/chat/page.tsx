"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MessageSquare, 
  Search, 
  CheckCheck, 
  Clock, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Info, 
  User, 
  ArrowLeft, 
  Phone, 
  Paperclip, 
  ChevronRight, 
  X, 
  Filter, 
  Copy, 
  Check, 
  Image as ImageIcon,
  ExternalLink,
  HeartHandshake
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  sender: 'client' | 'mua';
  text: string;
  time: string;
  image?: string;
  isRead?: boolean;
}

interface Conversation {
  id: string;
  clientName: string;
  avatarColor: string;
  serviceName: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  totalPrice: number;
  bookingStatus: 'Confirmed' | 'Pending' | 'Consultation';
  escrowStatus: 'Held' | 'PendingPayment' | 'None';
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  isOnline: boolean;
  phone: string;
  clientNotes: string;
  messages: Message[];
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    clientName: 'Siti Aminah',
    avatarColor: 'bg-rose-100 text-[#641A2B]',
    serviceName: 'Paket Wisuda Glamour Natural',
    eventDate: '15 Desember 2026',
    eventTime: '05:00 WIB (Sesi Subuh)',
    venue: 'Gedung Serbaguna UNP, Padang',
    totalPrice: 250000,
    bookingStatus: 'Confirmed',
    escrowStatus: 'Held',
    unreadCount: 2,
    lastMessage: 'Halo kak Alya, untuk busana wisudanya warna peach pastel, look makeupnya cocok yang mana ya?',
    lastMessageTime: '10:35',
    isOnline: true,
    phone: '0812-7654-3210',
    clientNotes: 'Kulit kombinasi agak berminyak di T-zone. Request hijab styling rapi tanpa jarum pentul berlebih & bulu mata natural.',
    messages: [
      {
        id: 'm1',
        sender: 'mua',
        text: 'Halo Kak Siti! Terima kasih sudah melakukan reservasi di Alya Makeup via GLAMÉA. Pembayaran DP Kakak sudah aman tersimpan di sistem Escrow kami.',
        time: '10:15',
        isRead: true,
      },
      {
        id: 'm2',
        sender: 'client',
        text: 'Halo kak Alya! Terima kasih banyak kak, seneng banget bisa dapet slot subuh tanggal 15 Desember buat wisuda UNP nanti.',
        time: '10:28',
        isRead: true,
      },
      {
        id: 'm3',
        sender: 'client',
        text: 'Halo kak Alya, untuk busana wisudanya warna peach pastel, look makeupnya cocok yang mana ya?',
        time: '10:35',
        isRead: false,
      },
    ],
  },
  {
    id: 'conv-2',
    clientName: 'Rina Permatasari',
    avatarColor: 'bg-amber-100 text-amber-900',
    serviceName: 'Baralek Minang Suntiang Gadang Modern',
    eventDate: '20 November 2026',
    eventTime: '08:00 WIB',
    venue: 'Pangeran Beach Hotel, Padang',
    totalPrice: 5500000,
    bookingStatus: 'Pending',
    escrowStatus: 'PendingPayment',
    unreadCount: 0,
    lastMessage: 'Baik kak, nanti H-2 kami kabari untuk fitting suntiang dan jadwal tim MUA tiba di lokasi.',
    lastMessageTime: 'Kemarin',
    isOnline: false,
    phone: '0855-6666-7777',
    clientNotes: 'Suntiang gadang adat Minang pesisir, kebaya maroon beludru gold. Kulit sensitif terhadap foundation berbasis minyak.',
    messages: [
      {
        id: 'm2-1',
        sender: 'client',
        text: 'Kak Alya, untuk akad dan resepsi di Pangeran Beach Hotel tanggal 20 November apakah tim Kakak bawa asisten untuk touch up pas resepsi?',
        time: 'Kemarin 14:10',
        isRead: true,
      },
      {
        id: 'm2-2',
        sender: 'mua',
        text: 'Tentu Kak Rina! Paket Baralek Minang kami sudah termasuk standby 1 orang asisten profesional hingga sesi foto resepsi selesai pukul 14:00 WIB.',
        time: 'Kemarin 14:30',
        isRead: true,
      },
      {
        id: 'm2-3',
        sender: 'mua',
        text: 'Baik kak, nanti H-2 kami kabari untuk fitting suntiang dan jadwal tim MUA tiba di lokasi.',
        time: 'Kemarin 15:00',
        isRead: true,
      },
    ],
  },
  {
    id: 'conv-3',
    clientName: 'Dinda Maharani',
    avatarColor: 'bg-emerald-100 text-emerald-900',
    serviceName: 'Prewedding Outdoor Glowing Look',
    eventDate: '28 Desember 2026',
    eventTime: '06:30 WIB',
    venue: 'Pantai Air Manis & Bukit Gado-Gado, Padang',
    totalPrice: 1200000,
    bookingStatus: 'Consultation',
    escrowStatus: 'None',
    unreadCount: 0,
    lastMessage: 'Kak, kalau untuk prewedding outdoor apakah sudah termasuk touch up pas ganti baju kedua?',
    lastMessageTime: '08 Okt',
    isOnline: true,
    phone: '0821-9988-7711',
    clientNotes: 'Tema kasual santai & etnik pantai. Khawatir makeup luntur karena cuaca panas tepi pantai.',
    messages: [
      {
        id: 'm3-1',
        sender: 'client',
        text: 'Pagi Kak Alya, saya mau tanya paket prewedding outdoor untuk akhir Desember di daerah Pantai Air Manis.',
        time: '08 Okt 09:12',
        isRead: true,
      },
      {
        id: 'm3-2',
        sender: 'client',
        text: 'Kak, kalau untuk prewedding outdoor apakah sudah termasuk touch up pas ganti baju kedua?',
        time: '08 Okt 09:15',
        isRead: true,
      },
    ],
  },
  {
    id: 'conv-4',
    clientName: 'Zahra Safitri',
    avatarColor: 'bg-purple-100 text-purple-900',
    serviceName: 'Akad Nikah Khidmat & Hijab Do',
    eventDate: '05 Januari 2027',
    eventTime: '07:00 WIB',
    venue: 'Masjid Raya Sumatera Barat, Padang',
    totalPrice: 2000000,
    bookingStatus: 'Consultation',
    escrowStatus: 'None',
    unreadCount: 0,
    lastMessage: 'Terima kasih banyak kak atas diskusinya! Nanti saya diskusikan dulu sama keluarga ya.',
    lastMessageTime: '03 Okt',
    isOnline: false,
    phone: '0813-4455-6677',
    clientNotes: 'Riasan syar’i tanpa cukur alis, hijab menjuntai rapi menutup dada.',
    messages: [
      {
        id: 'm4-1',
        sender: 'client',
        text: 'Assalamualaikum Kak Alya, apakah melayani riasan akad di Masjid Raya Sumbar?',
        time: '03 Okt 11:20',
        isRead: true,
      },
      {
        id: 'm4-2',
        sender: 'mua',
        text: 'Waalaikumsalam Kak Zahra. Sangat bisa kak! Kami sangat berpengalaman untuk akad syari tanpa cukur alis di Masjid Raya Sumbar.',
        time: '03 Okt 11:45',
        isRead: true,
      },
      {
        id: 'm4-3',
        sender: 'client',
        text: 'Terima kasih banyak kak atas diskusinya! Nanti saya diskusikan dulu sama keluarga ya.',
        time: '03 Okt 12:00',
        isRead: true,
      },
    ],
  },
];

const QUICK_REPLIES = [
  {
    label: 'Slot Tanggal Tersedia',
    text: 'Halo Kak! Tanggal tersebut saat ini masih tersedia di agenda studio kami. Apakah Kakak ingin saya amankan slotnya sekarang?',
  },
  {
    label: 'Saran Look Peach Wisuda',
    text: 'Untuk kebaya/busana peach pastel, kami sarankan konsep "Korean Soft Glam" dengan sentuhan blush-on peach dewy dan glossy lips lembut agar wajah tampak segar di kamera wisuda.',
  },
  {
    label: 'Panduan Persiapan Kulit',
    text: 'Tips persiapan hari-H: pastikan istirahat cukup, minum air putih 2L, gunakan pelembap ringan malam sebelumnya, dan hindari scrub wajah 2 hari sebelum sesi riasan ya Kak!',
  },
  {
    label: 'Pembayaran via GLAMÉA Escrow',
    text: 'Untuk keamanan transaksi bersama, seluruh pembayaran aman menggunakan sistem GLAMÉA Escrow. Dana baru diteruskan ke kami setelah sesi riasan selesai.',
  },
];

export default function MuaChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeChatId, setActiveChatId] = useState<string>('conv-1');
  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'booking'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [showDrawer, setShowDrawer] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === activeChatId) || conversations[0];

  // Auto scroll to bottom of active messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages]);

  // Mark active conversation as read
  useEffect(() => {
    if (activeConv && activeConv.unreadCount > 0) {
      setConversations(prev =>
        prev.map(c => (c.id === activeChatId ? { ...c, unreadCount: 0 } : c))
      );
    }
  }, [activeChatId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || messageInput).trim();
    if (!text) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newMessage: Message = {
      id: `m-${Date.now()}`,
      sender: 'mua',
      text,
      time: timeStr,
      isRead: false,
    };

    setConversations(prev =>
      prev.map(c => {
        if (c.id === activeChatId) {
          return {
            ...c,
            lastMessage: text,
            lastMessageTime: timeStr,
            messages: [...c.messages, newMessage],
          };
        }
        return c;
      })
    );

    setMessageInput('');
    showToast('Pesan berhasil terkirim');
  };

  const handleSendInspirationPhoto = () => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newMessage: Message = {
      id: `m-${Date.now()}`,
      sender: 'mua',
      text: 'Ini contoh referensi riasan Korean Soft Glam peach wisuda dari portofolio terbaru Alya Makeup kak. Sentuhan blush peach-nya sangat pas dengan kebaya pastel.',
      time: timeStr,
      image: '/images/hero-editorial.png',
      isRead: false,
    };

    setConversations(prev =>
      prev.map(c => {
        if (c.id === activeChatId) {
          return {
            ...c,
            lastMessage: '📷 Mengirim foto portofolio inspirasi look',
            lastMessageTime: timeStr,
            messages: [...c.messages, newMessage],
          };
        }
        return c;
      })
    );

    showToast('Foto inspirasi look berhasil dilampirkan');
  };

  const handleCopyPhone = (phone: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(phone);
      setCopiedPhone(true);
      showToast('Nomor WhatsApp klien disalin ke clipboard');
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch =
      conv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTab === 'unread') return conv.unreadCount > 0;
    if (filterTab === 'booking') return conv.bookingStatus === 'Confirmed' || conv.bookingStatus === 'Pending';
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#641A2B] text-[#FAF6F0] px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#C9A45C]/40 animate-in fade-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-4 h-4 text-[#C9A45C]" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#C9A45C]/20 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#641A2B]/10 border border-[#641A2B]/20 text-[#641A2B] text-xs font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A45C]" />
            <span>GLAMÉA ATELIER CONSULTATION</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#641A2B] tracking-tight">
            Pesan & Konsultasi Klien
          </h1>
          <p className="text-[#641A2B]/70 text-sm mt-1 max-w-2xl leading-relaxed">
            Kelola diskusi pra-sesi riasan, konfirmasi ketersediaan slot, dan kirim panduan persiapan hari-H langsung kepada calon pengantin dan pelanggan.
          </p>
        </div>

        {/* Quick Performance Indicators */}
        <div className="flex flex-wrap items-center gap-2.5 font-poppins">
          <div className="bg-white px-3.5 py-2 rounded-xl border border-[#C9A45C]/30 shadow-xs flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-[#641A2B]/80 font-semibold">Respon Kilat: &lt; 5 Menit</span>
          </div>
          <div className="bg-[#641A2B]/5 px-3.5 py-2 rounded-xl border border-[#641A2B]/20 text-[#641A2B] text-xs font-semibold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C9A45C]" />
            <span>Escrow Protected</span>
          </div>
        </div>
      </div>

      {/* Main Studio Container */}
      <div className="bg-white rounded-2xl border border-[#C9A45C]/30 shadow-sm overflow-hidden flex flex-col md:flex-row h-[740px] relative">
        {/* ======================================================== */}
        {/* PANEL KIRI: DAFTAR PERCAKAPAN KLIEN                     */}
        {/* ======================================================== */}
        <div 
          className={`w-full md:w-80 lg:w-[350px] flex flex-col border-r border-[#C9A45C]/20 bg-[#FAF6F0]/40 shrink-0 ${
            activeChatId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Header Kontak & Filter Tabs */}
          <div className="p-4 border-b border-[#C9A45C]/20 space-y-3 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#641A2B]/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari nama klien atau paket..."
                className="w-full pl-9 pr-4 py-2 bg-[#FAF6F0] border border-[#C9A45C]/30 rounded-xl text-xs text-[#641A2B] placeholder:text-[#641A2B]/40 focus:outline-none focus:ring-1 focus:ring-[#641A2B]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#641A2B]/40 hover:text-[#641A2B]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-[#FAF6F0] rounded-xl border border-[#C9A45C]/20 font-poppins">
              <button
                onClick={() => setFilterTab('all')}
                className={`flex-1 py-1.5 text-[11px] font-semibold rounded-lg transition-all ${
                  filterTab === 'all'
                    ? 'bg-[#641A2B] text-[#FAF6F0] shadow-xs'
                    : 'text-[#641A2B]/70 hover:text-[#641A2B]'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setFilterTab('unread')}
                className={`flex-1 py-1.5 text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                  filterTab === 'unread'
                    ? 'bg-[#641A2B] text-[#FAF6F0] shadow-xs'
                    : 'text-[#641A2B]/70 hover:text-[#641A2B]'
                }`}
              >
                <span>Belum Dibalas</span>
                <span className="w-4 h-4 rounded-full bg-[#C9A45C] text-[#641A2B] font-bold text-[9px] flex items-center justify-center">
                  2
                </span>
              </button>
              <button
                onClick={() => setFilterTab('booking')}
                className={`flex-1 py-1.5 text-[11px] font-semibold rounded-lg transition-all ${
                  filterTab === 'booking'
                    ? 'bg-[#641A2B] text-[#FAF6F0] shadow-xs'
                    : 'text-[#641A2B]/70 hover:text-[#641A2B]'
                }`}
              >
                Booking
              </button>
            </div>
          </div>

          {/* List Item Percakapan */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#C9A45C]/10 custom-scrollbar">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-[#641A2B]/60 text-xs">
                Tidak ada percakapan yang cocok dengan pencarian Anda.
              </div>
            ) : (
              filteredConversations.map(conv => {
                const isSelected = conv.id === activeChatId;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveChatId(conv.id)}
                    className={`w-full p-4 text-left transition-all flex gap-3 items-start relative group ${
                      isSelected
                        ? 'bg-white shadow-xs border-l-4 border-l-[#641A2B]'
                        : 'hover:bg-white/80'
                    }`}
                  >
                    {/* Avatar Initials / Status */}
                    <div className="relative shrink-0 mt-0.5">
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center font-serif font-bold text-sm shadow-xs ${conv.avatarColor}`}
                      >
                        {conv.clientName
                          .split(' ')
                          .map(n => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      {conv.isOnline && (
                        <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
                      )}
                    </div>

                    {/* Metadata Klien */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4 className="font-poppins font-semibold text-xs text-[#2D221E] truncate">
                          {conv.clientName}
                        </h4>
                        <span className="text-[10px] text-[#641A2B]/50 shrink-0 font-poppins">
                          {conv.lastMessageTime}
                        </span>
                      </div>

                      {/* Event Tag */}
                      <div className="flex items-center gap-1.5 mb-1.5 font-poppins">
                        <span className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-[#C9A45C]/15 text-[#641A2B] font-semibold truncate max-w-[170px]">
                          {conv.serviceName.split(' ')[0]} {conv.serviceName.split(' ')[1]}
                        </span>
                        {conv.bookingStatus === 'Confirmed' && (
                          <span className="text-[9px] px-1 py-0.2 bg-emerald-50 text-emerald-700 font-semibold rounded border border-emerald-200">
                            Terjadwal
                          </span>
                        )}
                      </div>

                      {/* Snippet Pesan Terakhir */}
                      <p
                        className={`text-xs truncate ${
                          conv.unreadCount > 0
                            ? 'font-medium text-[#2D221E]'
                            : 'text-[#2D221E]/60'
                        }`}
                      >
                        {conv.lastMessage}
                      </p>
                    </div>

                    {/* Badge Unread Count */}
                    {conv.unreadCount > 0 && (
                      <div className="shrink-0 mt-2">
                        <span className="w-5 h-5 rounded-full bg-[#641A2B] text-[#FAF6F0] text-[10px] font-bold flex items-center justify-center shadow-xs">
                          {conv.unreadCount}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* PANEL TENGAH: RUANG DISKUSI & TIMELINE OBROLAN           */}
        {/* ======================================================== */}
        <div
          className={`flex-1 flex flex-col h-full bg-[#FAF6F0]/20 min-w-0 ${
            !activeChatId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Header Ruang Obrolan Aktif */}
          <div className="p-3.5 md:p-4 border-b border-[#C9A45C]/20 bg-white flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              {/* Back button for mobile */}
              <button
                onClick={() => setActiveChatId('')}
                className="md:hidden p-1.5 rounded-lg text-[#641A2B] hover:bg-[#FAF6F0]"
                title="Kembali ke daftar pesan"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="relative shrink-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-sm ${activeConv.avatarColor}`}
                >
                  {activeConv.clientName
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                {activeConv.isOnline && (
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-poppins font-semibold text-sm text-[#2D221E] truncate">
                    {activeConv.clientName}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF6F0] border border-[#C9A45C]/30 text-[#641A2B] font-semibold font-poppins shrink-0 hidden sm:inline-block">
                    Klien Terverifikasi
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#641A2B]/60 truncate font-sans">
                  <span>{activeConv.serviceName}</span>
                  <span>•</span>
                  <span>{activeConv.eventDate}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions (Info Drawer & WhatsApp Copy) */}
            <div className="flex items-center gap-2 shrink-0 font-poppins">
              <button
                onClick={() => handleCopyPhone(activeConv.phone)}
                className="p-2 rounded-xl border border-[#C9A45C]/30 text-[#641A2B] hover:bg-[#FAF6F0] transition-colors text-xs flex items-center gap-1.5 font-semibold"
                title="Salin nomor WhatsApp"
              >
                {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">WhatsApp</span>
              </button>

              <button
                onClick={() => setShowDrawer(!showDrawer)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  showDrawer
                    ? 'bg-[#641A2B] text-[#FAF6F0]'
                    : 'border border-[#C9A45C]/30 text-[#641A2B] hover:bg-[#FAF6F0]'
                }`}
                title="Tampilkan ringkasan pesanan & catatan khusus"
              >
                <Info className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Rincian Booking</span>
              </button>
            </div>
          </div>

          {/* Timeline Pesan / Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar bg-[#FAF6F0]/30">
            {/* Escrow Trust Guarantee Banner */}
            <div className="max-w-xl mx-auto p-3 rounded-xl bg-white border border-[#C9A45C]/30 shadow-xs flex items-center gap-3 text-xs text-[#2D221E]/80">
              <div className="w-8 h-8 rounded-lg bg-[#641A2B]/10 flex items-center justify-center shrink-0 text-[#641A2B]">
                <ShieldCheck className="w-4 h-4 text-[#C9A45C]" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-[#641A2B]">GLAMÉA Escrow Protection:</span>{' '}
                Semua kesepakatan sesi riasan & pembayaran terlindungi secara resmi hingga hari-H selesai.
              </div>
            </div>

            {/* Date Badge */}
            <div className="text-center my-3">
              <span className="px-3 py-1 bg-white border border-[#C9A45C]/20 rounded-full text-[10px] font-medium text-[#641A2B]/70 shadow-xs">
                Hari Ini, 12 Oktober 2026
              </span>
            </div>

            {/* Message Bubbles */}
            {activeConv.messages.map(msg => {
              const isMua = msg.sender === 'mua';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMua ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-3.5 text-xs shadow-xs transition-all leading-relaxed ${
                      isMua
                        ? 'bg-gradient-to-r from-[#641A2B] to-[#4D1320] text-[#FAF6F0] rounded-tr-none border border-[#641A2B]'
                        : 'bg-white text-[#2D221E] rounded-tl-none border border-[#E8DFD5]'
                    }`}
                  >
                    {/* Optional Image Attachment */}
                    {msg.image && (
                      <div className="mb-2.5 rounded-xl overflow-hidden border border-[#C9A45C]/30 relative aspect-video bg-[#FAF6F0]">
                        <Image
                          src={msg.image}
                          alt="Referensi Look"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>

                  {/* Message Timestamp & Status */}
                  <div className="flex items-center gap-1.5 px-1 text-[10px] text-[#641A2B]/50">
                    <span>{msg.time}</span>
                    {isMua && (
                      <CheckCheck className="w-3.5 h-3.5 text-[#C9A45C]" />
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies Bar (Atelier Templates) */}
          <div className="px-4 py-2 bg-white/80 border-t border-[#C9A45C]/20 overflow-x-auto whitespace-nowrap custom-scrollbar flex items-center gap-2 font-poppins">
            <span className="text-[10px] font-semibold text-[#641A2B]/60 uppercase tracking-wider shrink-0">
              Template Cepat:
            </span>
            {QUICK_REPLIES.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(reply.text)}
                className="px-2.5 py-1 rounded-full bg-[#FAF6F0] border border-[#C9A45C]/30 text-[11px] text-[#641A2B] hover:bg-[#641A2B] hover:text-[#FAF6F0] transition-all shrink-0 font-semibold shadow-xs"
              >
                {reply.label}
              </button>
            ))}
          </div>

          {/* Form Input Obrolan */}
          <div className="p-3 md:p-4 bg-white border-t border-[#C9A45C]/20">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              {/* Attachment Inspirasi Portofolio */}
              <button
                type="button"
                onClick={handleSendInspirationPhoto}
                className="p-2.5 rounded-xl border border-[#C9A45C]/30 text-[#641A2B] hover:bg-[#FAF6F0] transition-colors shrink-0"
                title="Kirim Foto Portofolio / Inspirasi Look"
              >
                <ImageIcon className="w-4 h-4 text-[#C9A45C]" />
              </button>

              <input
                type="text"
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                placeholder="Tulis pesan atau konsultasi riasan untuk klien di sini..."
                className="flex-1 bg-[#FAF6F0] border border-[#C9A45C]/30 rounded-xl px-4 py-2.5 text-xs text-[#2D221E] placeholder:text-[#641A2B]/40 focus:outline-none focus:ring-1 focus:ring-[#641A2B]"
              />

              <Button
                type="submit"
                disabled={!messageInput.trim()}
                className="h-10 px-5 bg-[#641A2B] hover:bg-[#4D1320] text-[#FAF6F0] rounded-xl text-xs font-semibold font-poppins shadow-sm transition-all disabled:opacity-40"
              >
                Kirim
              </Button>
            </form>
          </div>
        </div>

        {/* ======================================================== */}
        {/* PANEL KANAN: BOOKING CONTEXT DRAWER (RINCIAN PESANAN)    */}
        {/* ======================================================== */}
        {showDrawer && (
          <div className="w-full md:w-80 lg:w-[320px] bg-white border-l border-[#C9A45C]/20 flex flex-col shrink-0 animate-in slide-in-from-right duration-200 z-20 absolute inset-y-0 right-0 md:relative">
            {/* Header Drawer */}
            <div className="p-4 border-b border-[#C9A45C]/20 flex items-center justify-between bg-[#FAF6F0]/40">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#641A2B]" />
                <h3 className="font-poppins font-bold text-sm text-[#641A2B]">
                  Rincian Pesanan Klien
                </h3>
              </div>
              <button
                onClick={() => setShowDrawer(false)}
                className="p-1 rounded-lg text-[#641A2B]/60 hover:text-[#641A2B] hover:bg-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Isi Drawer */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar text-xs">
              {/* Profile Card */}
              <div className="p-3.5 rounded-xl bg-[#FAF6F0] border border-[#C9A45C]/20 space-y-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-sm ${activeConv.avatarColor}`}
                  >
                    {activeConv.clientName
                      .split(' ')
                      .map(n => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-poppins font-semibold text-sm text-[#2D221E]">
                      {activeConv.clientName}
                    </h4>
                    <p className="text-[11px] text-[#641A2B]/60 font-sans">{activeConv.phone}</p>
                  </div>
                </div>
              </div>

              {/* Status Pesanan & Escrow */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-semibold text-[#641A2B]/60 uppercase tracking-wider block font-poppins">
                  Status Kontrak & Escrow
                </span>
                <div className="p-3 rounded-xl border border-[#C9A45C]/25 bg-white space-y-2 shadow-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[#641A2B]/70 font-sans">Status Reservasi:</span>
                    <span
                      className={`font-semibold font-poppins px-2 py-0.5 rounded text-[10px] ${
                        activeConv.bookingStatus === 'Confirmed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : activeConv.bookingStatus === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}
                    >
                      {activeConv.bookingStatus === 'Confirmed'
                        ? 'Terkonfirmasi (DP Masuk)'
                        : activeConv.bookingStatus === 'Pending'
                        ? 'Menunggu DP'
                        : 'Konsultasi Pra-Booking'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#641A2B]/70 font-sans">Garansi Escrow:</span>
                    <span className="font-semibold font-poppins text-[#641A2B] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C9A45C]" />
                      {activeConv.escrowStatus === 'Held'
                        ? 'Dana Tersimpan'
                        : activeConv.escrowStatus === 'PendingPayment'
                        ? 'Menunggu Transfer'
                        : 'Belum Ada Transaksi'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-[#C9A45C]/15">
                    <span className="text-[#641A2B]/70 font-sans">Nilai Kontrak:</span>
                    <span className="font-bold text-sm text-[#641A2B] font-poppins">
                      Rp {activeConv.totalPrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Jadwal & Lokasi Acara */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-semibold text-[#641A2B]/60 uppercase tracking-wider block">
                  Jadwal & Lokasi Sesi
                </span>
                <div className="p-3 rounded-xl border border-[#C9A45C]/20 bg-[#FAF6F0]/50 space-y-2">
                  <div className="flex items-start gap-2.5">
                    <Calendar className="w-4 h-4 text-[#C9A45C] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-[#2D221E]">{activeConv.eventDate}</div>
                      <div className="text-[11px] text-[#641A2B]/60">{activeConv.eventTime}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 pt-2 border-t border-[#C9A45C]/15">
                    <MapPin className="w-4 h-4 text-[#C9A45C] shrink-0 mt-0.5" />
                    <div className="text-[11px] text-[#2D221E] leading-relaxed">
                      {activeConv.venue}
                    </div>
                  </div>
                </div>
              </div>

              {/* Catatan Khusus & Preferensi Kulit */}
              <div className="space-y-2">
                <span className="text-[10px] font-semibold text-[#641A2B]/60 uppercase tracking-wider block">
                  Preferensi & Catatan Kulit Klien
                </span>
                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-[#2D221E] text-xs leading-relaxed">
                  {activeConv.clientNotes}
                </div>
              </div>

              {/* Fast Navigation Links */}
              <div className="pt-2 space-y-2 font-poppins">
                <Link
                  href="/mua/booking"
                  className="w-full py-2.5 px-3 rounded-xl border border-[#641A2B]/20 text-[#641A2B] hover:bg-[#641A2B]/5 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Buka Data Permintaan Booking</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/mua/jadwal"
                  className="w-full py-2.5 px-3 rounded-xl bg-[#FAF6F0] border border-[#C9A45C]/30 text-[#641A2B] hover:bg-[#C9A45C]/20 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#C9A45C]" />
                  <span>Lihat di Kalender Dispatch</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
