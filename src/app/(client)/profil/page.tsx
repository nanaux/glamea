"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  User, 
  Calendar, 
  Heart, 
  ShieldCheck, 
  LogOut, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  MessageCircle, 
  Edit3, 
  Shield, 
  Star, 
  Check, 
  X,
  ExternalLink,
  ChevronRight,
  Bell,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { mockClients } from '@/data/mock-users';
import { mockBookings } from '@/data/mock-bookings';
import { mockMuas } from '@/data/mock-muas';
import { mockServices } from '@/data/mock-services';
import { formatRupiah } from '@/lib/utils';
import { Modal } from '@/components/ui/modal';

type ActiveTab = 'profil' | 'booking' | 'wishlist' | 'keamanan';

export default function ProfilPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as ActiveTab) || 'profil';

  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab);
  const [email, setEmail] = useState('client@glamea.test');
  
  // Profile state
  const [profileData, setProfileData] = useState({
    name: 'Siti Aminah',
    email: 'client@glamea.test',
    phone: '0811-2222-3333',
    city: 'Padang Barat, Kota Padang',
    address: 'Jl. Khatib Sulaiman No. 42, RT 02 / RW 05, Lolong Belanti',
    stylePreference: 'Soft Glam, Natural Flawless, & Hijab Styling'
  });

  // Modal edit state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ ...profileData });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Logout modal state
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Booking filter state inside booking tab
  const [bookingFilter, setBookingFilter] = useState<'semua' | 'aktif' | 'selesai'>('semua');

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState<string[]>(['mua-1', 'mua-2', 'mua-4']);

  useEffect(() => {
    const usrEmail = localStorage.getItem('user_email');
    if (usrEmail) {
      setEmail(usrEmail);
      const foundClient = mockClients.find(c => c.email === usrEmail);
      if (foundClient) {
        setProfileData(prev => ({
          ...prev,
          name: foundClient.name,
          email: foundClient.email,
          phone: foundClient.phone,
        }));
      }
    }
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileData({ ...editFormData });
    setIsEditModalOpen(false);
    showToast('Profil Anda berhasil diperbarui.');
  };

  const handleLogout = () => {
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
    router.push('/masuk');
  };

  const removeWishlist = (muaId: string, muaName: string) => {
    setWishlistIds(prev => prev.filter(id => id !== muaId));
    showToast(`${muaName} dihapus dari Wishlist.`);
  };

  // Filter client bookings (for client-1)
  const clientBookings = mockBookings.filter(b => b.clientId === 'client-1');

  const filteredBookings = clientBookings.filter(b => {
    if (bookingFilter === 'aktif') return b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Pending';
    if (bookingFilter === 'selesai') return b.bookingStatus === 'Completed';
    return true;
  });

  const wishlistMuas = mockMuas.filter(m => wishlistIds.includes(m.id));

  const formatDateIndonesia = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-[calc(100vh-80px)] py-8 md:py-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-[#3A101C] text-white px-5 py-3.5 rounded-xl shadow-2xl border border-[#C9A45C]/30 flex items-center gap-3 animate-in slide-in-from-top-3 duration-300">
          <CheckCircle2 className="w-4 h-4 text-[#C9A45C] shrink-0" />
          <span className="font-sans text-xs font-medium tracking-wide">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mobile Navigation Pills */}
        <div className="md:hidden mb-6 overflow-x-auto pb-1 scrollbar-none sticky top-16 z-20 bg-[#FAF8F5]/95 backdrop-blur-sm pt-2">
          <div className="flex items-center gap-1 p-1 bg-white border border-[#EAE3DC] rounded-xl shadow-xs min-w-max">
            <button
              onClick={() => setActiveTab('profil')}
              className={`font-poppins flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'profil'
                  ? 'bg-[#3A101C] text-white shadow-xs font-semibold'
                  : 'text-[#7A6E6A] hover:text-[#292321] hover:bg-[#FAF4EB]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profil</span>
            </button>
            <button
              onClick={() => setActiveTab('booking')}
              className={`font-poppins flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'booking'
                  ? 'bg-[#3A101C] text-white shadow-xs font-semibold'
                  : 'text-[#7A6E6A] hover:text-[#292321] hover:bg-[#FAF4EB]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Reservasi ({clientBookings.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`font-poppins flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'wishlist'
                  ? 'bg-[#3A101C] text-white shadow-xs font-semibold'
                  : 'text-[#7A6E6A] hover:text-[#292321] hover:bg-[#FAF4EB]'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Wishlist ({wishlistIds.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('keamanan')}
              className={`font-poppins flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'keamanan'
                  ? 'bg-[#3A101C] text-white shadow-xs font-semibold'
                  : 'text-[#7A6E6A] hover:text-[#292321] hover:bg-[#FAF4EB]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Keamanan</span>
            </button>
          </div>
        </div>

        {/* 2-Column Atelier Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* ================= UNIFIED ATELIER SIDEBAR ================= */}
          <aside className="md:col-span-4 lg:col-span-3 md:sticky md:top-24">
            <div className="bg-white rounded-2xl border border-[#EAE3DC] shadow-[0_2px_16px_rgba(41,35,33,0.03)] overflow-hidden">
              
              {/* Sidebar Identity Header */}
              <div className="p-6 text-center border-b border-[#EAE3DC] relative">
                {/* Subtle top decorative bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3A101C] via-[#C9A45C] to-[#3A101C]" />
                
                <div className="w-16 h-16 rounded-full bg-[#3A101C] text-[#C9A45C] border-2 border-[#C9A45C]/50 flex items-center justify-center font-serif font-bold text-xl mx-auto shadow-xs tracking-wider">
                  SA
                </div>

                <div className="mt-3.5 space-y-1">
                  <h2 className="font-serif font-bold text-lg text-[#292321]">
                    {profileData.name}
                  </h2>
                  <p className="font-mono text-xs text-[#8C7A75]">
                    {profileData.email}
                  </p>
                </div>

                <div className="mt-3 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FAF4EB] border border-[#EAE3DC] font-poppins text-[10px] font-semibold text-[#641A2B] tracking-wide">
                  <Sparkles className="w-3 h-3 text-[#C9A45C]" />
                  <span>GLAMÉA PRIVILEGE CLIENT</span>
                </div>

                {/* Sub-meta */}
                <div className="mt-4 pt-3.5 border-t border-[#F2ECE6] grid grid-cols-2 gap-2 text-[11px] text-[#8C7A75] font-sans">
                  <div>
                    <span className="font-poppins block text-[9px] uppercase tracking-wider text-[#A39490] font-semibold">Bergabung</span>
                    <span className="font-medium text-[#292321]">12 Okt 2026</span>
                  </div>
                  <div>
                    <span className="font-poppins block text-[9px] uppercase tracking-wider text-[#A39490] font-semibold">Kota</span>
                    <span className="font-medium text-[#292321]">Padang, Sumbar</span>
                  </div>
                </div>
              </div>

              {/* Sidebar Navigation Menu */}
              <nav className="p-2.5 space-y-1 hidden md:block">
                <button
                  onClick={() => setActiveTab('profil')}
                  className={`font-poppins w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                    activeTab === 'profil'
                      ? 'bg-[#FAF4EB] text-[#3A101C] font-bold border-l-2 border-[#C9A45C]'
                      : 'text-[#5C504D] hover:bg-[#FAF8F5] hover:text-[#292321] font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <User className={`w-4 h-4 ${activeTab === 'profil' ? 'text-[#C9A45C]' : 'text-[#8C7A75]'}`} />
                    <span>Profil & Data Diri</span>
                  </div>
                  <span className="font-sans text-[10px] text-[#8C7A75]">Lengkap</span>
                </button>

                <button
                  onClick={() => setActiveTab('booking')}
                  className={`font-poppins w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                    activeTab === 'booking'
                      ? 'bg-[#FAF4EB] text-[#3A101C] font-bold border-l-2 border-[#C9A45C]'
                      : 'text-[#5C504D] hover:bg-[#FAF8F5] hover:text-[#292321] font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Calendar className={`w-4 h-4 ${activeTab === 'booking' ? 'text-[#C9A45C]' : 'text-[#8C7A75]'}`} />
                    <span>Riwayat Reservasi</span>
                  </div>
                  <span className={`font-poppins text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    activeTab === 'booking' ? 'bg-[#3A101C] text-white' : 'bg-stone-100 text-[#7A6E6A]'
                  }`}>
                    {clientBookings.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`font-poppins w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                    activeTab === 'wishlist'
                      ? 'bg-[#FAF4EB] text-[#3A101C] font-bold border-l-2 border-[#C9A45C]'
                      : 'text-[#5C504D] hover:bg-[#FAF8F5] hover:text-[#292321] font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Heart className={`w-4 h-4 ${activeTab === 'wishlist' ? 'text-[#C9A45C]' : 'text-[#8C7A75]'}`} />
                    <span>Wishlist MUA</span>
                  </div>
                  <span className={`font-poppins text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    activeTab === 'wishlist' ? 'bg-[#3A101C] text-white' : 'bg-stone-100 text-[#7A6E6A]'
                  }`}>
                    {wishlistIds.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('keamanan')}
                  className={`font-poppins w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                    activeTab === 'keamanan'
                      ? 'bg-[#FAF4EB] text-[#3A101C] font-bold border-l-2 border-[#C9A45C]'
                      : 'text-[#5C504D] hover:bg-[#FAF8F5] hover:text-[#292321] font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className={`w-4 h-4 ${activeTab === 'keamanan' ? 'text-[#C9A45C]' : 'text-[#8C7A75]'}`} />
                    <span>Keamanan Akun</span>
                  </div>
                  <span className="font-poppins text-[10px] text-emerald-700 font-semibold">Aman</span>
                </button>

                <div className="pt-2 mt-2 border-t border-[#F2ECE6]">
                  <button
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="font-poppins w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-rose-700 hover:bg-rose-50 transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>Keluar Akun</span>
                  </button>
                </div>
              </nav>

              {/* Sidebar Escrow Footer */}
              <div className="p-4 bg-[#FAF8F5] border-t border-[#EAE3DC] text-[11px] space-y-1.5 font-sans">
                <div className="font-poppins flex items-center gap-1.5 text-[#3A101C] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Garansi Rekening Escrow</span>
                </div>
                <p className="text-[#8C7A75] leading-relaxed text-[10.5px]">
                  Pembayaran disimpan aman di rekening bersama GLAMÉA hingga hari acara rias selesai.
                </p>
              </div>

            </div>
          </aside>


          {/* ================= RIGHT ATELIER SANCTUARY ================= */}
          <main className="md:col-span-8 lg:col-span-9 space-y-6">

            {/* Editorial Greeting & Integrated Metric Strip */}
            <div className="bg-white rounded-2xl border border-[#EAE3DC] p-6 shadow-[0_2px_16px_rgba(41,35,33,0.03)] space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#F2ECE6] pb-5">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#3A101C]">
                    Selamat Datang, {profileData.name}
                  </h1>
                  <p className="font-sans text-xs sm:text-sm text-[#8C7A75] mt-1">
                    Atelier Concierge • Kelola reservasi, profil riasan, dan artis favorit Anda.
                  </p>
                </div>
                <span className="font-mono text-xs text-[#8C7A75] shrink-0">
                  ID: <span className="text-[#292321] font-semibold">GLM-PADANG-01</span>
                </span>
              </div>

              {/* Integrated Metric Strip (Seamless 3-Column Bar) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#EAE3DC] bg-[#FAF8F5] rounded-xl border border-[#EAE3DC] p-1 font-sans">
                <div className="p-3.5 sm:px-5">
                  <span className="font-poppins text-[10px] uppercase tracking-widest text-[#8C7A75] font-semibold block">
                    Total Reservasi
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-serif font-bold text-[#3A101C]">
                      {clientBookings.length} Sesi
                    </span>
                    <span className="font-poppins text-[11px] text-[#C9A45C] font-medium">1 Aktif • 1 Selesai</span>
                  </div>
                </div>

                <div className="p-3.5 sm:px-5">
                  <span className="font-poppins text-[10px] uppercase tracking-widest text-[#8C7A75] font-semibold block">
                    Wishlist MUA
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-serif font-bold text-[#292321]">
                      {wishlistIds.length} MUA
                    </span>
                    <span className="font-sans text-[11px] text-[#8C7A75]">Pilihan Padang</span>
                  </div>
                </div>

                <div className="p-3.5 sm:px-5">
                  <span className="font-poppins text-[10px] uppercase tracking-widest text-[#8C7A75] font-semibold block">
                    Proteksi Pembayaran
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-1 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-base font-serif font-bold">100% Escrow</span>
                    <span className="font-poppins text-[11px] text-emerald-700 font-medium">Terlindungi</span>
                  </div>
                </div>
              </div>

            </div>

            {/* TAB 1: PROFIL & DATA DIRI */}
            {activeTab === 'profil' && (
              <div className="space-y-6 animate-in fade-in-50 duration-200">
                
                {/* Upcoming Reservation Atelier Pass (Ticket Card) */}
                <div className="bg-white rounded-2xl border border-[#EAE3DC] p-6 shadow-[0_2px_16px_rgba(41,35,33,0.03)] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#F2ECE6] pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#C9A45C]" />
                      <h3 className="font-serif font-bold text-base text-[#3A101C]">
                        Reservasi Rias Terdekat
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('booking')}
                      className="font-poppins text-xs font-semibold text-[#641A2B] hover:text-[#3A101C] flex items-center gap-1 group"
                    >
                      <span>Lihat Semua Jadwal</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>

                  {/* Bespoke Ticket Layout */}
                  <div className="rounded-xl border border-[#EAE3DC] bg-[#FAF8F5] overflow-hidden flex flex-col md:flex-row font-sans">
                    {/* Date Ribbon */}
                    <div className="bg-[#3A101C] text-white p-5 md:w-44 flex flex-col justify-center items-center text-center shrink-0 border-b md:border-b-0 md:border-r border-[#C9A45C]/30">
                      <span className="font-poppins text-[10px] tracking-widest uppercase text-[#C9A45C] font-semibold">SELASA</span>
                      <span className="text-3xl font-serif font-bold tracking-tight my-0.5">15 DES</span>
                      <span className="text-xs text-stone-300 font-mono">2026 • 05:00 WIB</span>
                    </div>

                    {/* Middle Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-serif font-bold text-base text-[#292321]">Alya Makeup</span>
                          <span className="font-poppins px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Dikonfirmasi MUA
                          </span>
                        </div>
                        <p className="font-sans text-xs text-[#641A2B] font-medium">Party / Graduation Makeup • 1 Orang</p>
                        <p className="font-sans text-xs text-[#8C7A75] flex items-center gap-1.5 mt-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#C9A45C] shrink-0" />
                          <span>Gedung Serbaguna UNP, Air Tawar, Padang</span>
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#EAE3DC] flex items-center justify-between text-xs font-sans">
                        <span className="text-[#8C7A75] text-[11px] italic">
                          "Tolong jangan terlalu tebal foundation-nya ya kak."
                        </span>
                        <div className="text-right">
                          <span className="font-poppins text-[10px] text-[#8C7A75] block uppercase tracking-wider">Total Biaya</span>
                          <span className="font-serif font-bold text-sm text-[#3A101C]">Rp 225.000</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions on right */}
                    <div className="p-5 bg-white md:w-48 flex flex-col justify-center gap-2 border-t md:border-t-0 md:border-l border-[#EAE3DC] shrink-0">
                      <Link
                        href="/chat"
                        className="font-poppins w-full py-2 px-3 rounded-xl text-xs font-semibold text-center border border-[#EAE3DC] hover:border-[#3A101C] text-[#3A101C] hover:bg-[#FAF4EB] transition-all flex items-center justify-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat MUA</span>
                      </Link>
                      <button
                        onClick={() => setActiveTab('booking')}
                        className="font-poppins w-full py-2 px-3 rounded-xl text-xs font-semibold text-center bg-[#3A101C] text-white hover:bg-[#4E1321] transition-all"
                      >
                        Detail Tiket
                      </button>
                      <span className="font-sans text-[10px] text-center text-emerald-700 font-medium flex items-center justify-center gap-1 pt-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        Garansi Escrow
                      </span>
                    </div>
                  </div>
                </div>

                {/* Editorial Specification Card (Data Diri) */}
                <div className="bg-white rounded-2xl border border-[#EAE3DC] p-6 shadow-[0_2px_16px_rgba(41,35,33,0.03)] space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F2ECE6] pb-4">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-[#3A101C]">
                        Spesifikasi Data Diri & Kontak
                      </h3>
                      <p className="font-sans text-xs text-[#8C7A75] mt-0.5">
                        Rincian kontak personal untuk komunikasi resmi dan koordinasi hari pelaksanaan.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditFormData({ ...profileData });
                        setIsEditModalOpen(true);
                      }}
                      className="font-poppins inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-[#EAE3DC] text-[#3A101C] hover:bg-[#3A101C] hover:text-white hover:border-[#3A101C] transition-all shrink-0 self-start sm:self-auto shadow-2xs"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#C9A45C]" />
                      <span>Ubah Data Diri</span>
                    </button>
                  </div>

                  {/* Architectural Specification List */}
                  <div className="divide-y divide-[#F2ECE6] text-xs font-sans">
                    
                    {/* Row 1 */}
                    <div className="py-3.5 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
                      <div className="font-poppins md:col-span-4 text-[10px] uppercase tracking-widest text-[#8C7A75] font-semibold">
                        Nama Lengkap
                      </div>
                      <div className="md:col-span-8 font-serif font-bold text-base text-[#292321]">
                        {profileData.name}
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="py-3.5 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
                      <div className="font-poppins md:col-span-4 text-[10px] uppercase tracking-widest text-[#8C7A75] font-semibold">
                        Alamat Email
                      </div>
                      <div className="md:col-span-8 flex items-center gap-3">
                        <span className="font-mono text-[#292321] font-medium">{profileData.email}</span>
                        <span className="font-poppins inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-200">
                          <Check className="w-3 h-3 text-emerald-600" />
                          Terverifikasi
                        </span>
                      </div>
                    </div>

                    {/* Row 3 */}
                    <div className="py-3.5 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
                      <div className="font-poppins md:col-span-4 text-[10px] uppercase tracking-widest text-[#8C7A75] font-semibold">
                        Nomor WhatsApp / HP
                      </div>
                      <div className="md:col-span-8 flex items-center gap-3">
                        <span className="font-mono text-[#292321] font-medium">{profileData.phone}</span>
                        <span className="font-poppins inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-200">
                          WhatsApp Aktif
                        </span>
                      </div>
                    </div>

                    {/* Row 4 */}
                    <div className="py-3.5 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
                      <div className="font-poppins md:col-span-4 text-[10px] uppercase tracking-widest text-[#8C7A75] font-semibold">
                        Kota & Kecamatan
                      </div>
                      <div className="md:col-span-8 font-medium text-[#292321]">
                        {profileData.city}
                      </div>
                    </div>

                    {/* Row 5 */}
                    <div className="py-3.5 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-start">
                      <div className="font-poppins md:col-span-4 text-[10px] uppercase tracking-widest text-[#8C7A75] font-semibold pt-0.5">
                        Alamat Sesi Riasan
                      </div>
                      <div className="md:col-span-8 font-medium text-[#292321] flex items-start gap-1.5 leading-relaxed">
                        <MapPin className="w-3.5 h-3.5 text-[#C9A45C] shrink-0 mt-0.5" />
                        <span>{profileData.address}</span>
                      </div>
                    </div>

                    {/* Row 6 */}
                    <div className="py-3.5 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
                      <div className="font-poppins md:col-span-4 text-[10px] uppercase tracking-widest text-[#8C7A75] font-semibold">
                        Preferensi Gaya Rias
                      </div>
                      <div className="md:col-span-8">
                        <span className="font-poppins inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF4EB] border border-[#EAE3DC] text-xs font-medium text-[#3A101C]">
                          <Sparkles className="w-3 h-3 text-[#C9A45C]" />
                          <span>{profileData.stylePreference}</span>
                        </span>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: RIWAYAT & STATUS BOOKING */}
            {activeTab === 'booking' && (
              <div className="space-y-6 animate-in fade-in-50 duration-200">
                <div className="bg-white rounded-2xl border border-[#EAE3DC] p-6 shadow-[0_2px_16px_rgba(41,35,33,0.03)] space-y-6">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F2ECE6] pb-4">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-[#3A101C]">
                        Riwayat & Jadwal Reservasi
                      </h3>
                      <p className="font-sans text-xs text-[#8C7A75] mt-0.5">
                        Semua transaksi dilindungi sistem rekening escrow terpercaya GLAMÉA.
                      </p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1 p-1 bg-[#FAF8F5] rounded-xl border border-[#EAE3DC] text-xs font-poppins">
                      <button
                        onClick={() => setBookingFilter('semua')}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                          bookingFilter === 'semua'
                            ? 'bg-[#3A101C] text-white shadow-xs font-semibold'
                            : 'text-[#8C7A75] hover:text-[#292321]'
                        }`}
                      >
                        Semua ({clientBookings.length})
                      </button>
                      <button
                        onClick={() => setBookingFilter('aktif')}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                          bookingFilter === 'aktif'
                            ? 'bg-[#3A101C] text-white shadow-xs font-semibold'
                            : 'text-[#8C7A75] hover:text-[#292321]'
                        }`}
                      >
                        Aktif
                      </button>
                      <button
                        onClick={() => setBookingFilter('selesai')}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                          bookingFilter === 'selesai'
                            ? 'bg-[#3A101C] text-white shadow-xs font-semibold'
                            : 'text-[#8C7A75] hover:text-[#292321]'
                        }`}
                      >
                        Selesai
                      </button>
                    </div>
                  </div>

                  {/* Booking Receipts */}
                  <div className="space-y-4">
                    {filteredBookings.map((b) => {
                      const mua = mockMuas.find(m => m.id === b.muaId);
                      const service = mockServices.find(s => s.id === b.serviceId);

                      return (
                        <div
                          key={b.id}
                          className="bg-[#FAF8F5] rounded-2xl border border-[#EAE3DC] p-5 space-y-4 hover:border-[#C9A45C]/50 transition-all"
                        >
                          {/* Receipt Header */}
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EAE3DC] pb-3 text-xs font-sans">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-[#3A101C]">#{b.id.toUpperCase()}</span>
                              <span className="text-[#8C7A75]">•</span>
                              <span className="text-[#8C7A75]">Reservasi dibuat {new Date(b.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>

                            <div>
                              {b.bookingStatus === 'Confirmed' && (
                                <span className="font-poppins px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  Jadwal Terkonfirmasi
                                </span>
                              )}
                              {b.bookingStatus === 'Completed' && (
                                <span className="font-poppins px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-800 border border-stone-200 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-stone-600" />
                                  Layanan Selesai
                                </span>
                              )}
                              {b.bookingStatus === 'Pending' && (
                                <span className="font-poppins px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                                  Menunggu Konfirmasi
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Details Row */}
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-xl bg-[#3A101C] text-[#C9A45C] flex items-center justify-center font-serif font-bold text-base shrink-0 shadow-xs">
                                {mua?.name.charAt(0) || 'M'}
                              </div>

                              <div className="space-y-1">
                                <h4 className="font-serif font-bold text-base text-[#292321]">
                                  {mua?.name}
                                </h4>
                                <p className="font-sans text-xs text-[#3A101C] font-medium">
                                  {service?.name || b.occasion}
                                </p>
                                <div className="space-y-0.5 pt-1 text-xs text-[#8C7A75] font-sans">
                                  <p className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-[#C9A45C]" />
                                    <span className="font-medium text-[#292321]">{formatDateIndonesia(b.date)}</span>
                                    <span>• Pukul {b.time} WIB</span>
                                  </p>
                                  <p className="flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-[#8C7A75]" />
                                    <span>{b.location}</span>
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Escrow badge & price */}
                            <div className="md:text-right flex flex-col justify-between shrink-0 space-y-2">
                              <div>
                                <span className="font-poppins text-[10px] text-[#8C7A75] uppercase tracking-wider block">Total Tagihan</span>
                                <span className="text-lg font-serif font-bold text-[#3A101C]">
                                  {formatRupiah(b.total)}
                                </span>
                              </div>

                              <div className="font-sans inline-flex items-center md:self-end gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10.5px] font-medium">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>Dana Aman di Rekening Escrow</span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="pt-2 border-t border-[#EAE3DC] flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
                            <span className="text-[#8C7A75] italic text-[11px]">
                              {b.notes ? `“${b.notes}”` : 'Tidak ada catatan instruksi khusus.'}
                            </span>

                            <div className="flex items-center gap-2">
                              <Link
                                href="/chat"
                                className="font-poppins px-3 py-1.5 rounded-xl font-medium border border-[#EAE3DC] hover:border-[#3A101C] text-[#3A101C] hover:bg-white transition-all flex items-center gap-1"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>Chat MUA</span>
                              </Link>
                              <Link
                                href={`/booking-saya/${b.id}`}
                                className="font-poppins px-3.5 py-1.5 rounded-xl font-semibold bg-[#3A101C] text-white hover:bg-[#4E1321] transition-all"
                              >
                                Detail Invoice
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>
            )}

            {/* TAB 3: WISHLIST MUA PADANG */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6 animate-in fade-in-50 duration-200">
                <div className="bg-white rounded-2xl border border-[#EAE3DC] p-6 shadow-[0_2px_16px_rgba(41,35,33,0.03)] space-y-6">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F2ECE6] pb-4">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-[#3A101C]">
                        Koleksi MUA Favorit Pilihan
                      </h3>
                      <p className="font-sans text-xs text-[#8C7A75] mt-0.5">
                        Artis rias terverifikasi yang Anda simpan untuk kemudahan reservasi di momen berikutnya.
                      </p>
                    </div>
                    <span className="font-poppins text-xs font-semibold text-[#3A101C] bg-[#FAF4EB] px-3 py-1 rounded-full border border-[#EAE3DC] self-start sm:self-auto">
                      {wishlistMuas.length} MUA Tersimpan
                    </span>
                  </div>

                  {wishlistMuas.length === 0 ? (
                    <div className="text-center py-16 space-y-3 font-sans">
                      <Heart className="w-12 h-12 text-[#EAE3DC] mx-auto" />
                      <h4 className="font-serif font-bold text-base text-[#292321]">Belum ada MUA tersimpan</h4>
                      <p className="text-xs text-[#8C7A75] max-w-sm mx-auto">
                        Jelajahi direktori perias GLAMÉA di Padang dan klik ikon hati untuk menyimpannya di koleksi Anda.
                      </p>
                      <Link
                        href="/cari-mua"
                        className="font-poppins inline-block mt-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#3A101C] text-white hover:bg-[#4E1321] transition-all"
                      >
                        Jelajahi MUA Padang
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {wishlistMuas.map((mua) => (
                        <div
                          key={mua.id}
                          className="bg-[#FAF8F5] rounded-2xl border border-[#EAE3DC] p-4 flex flex-col justify-between hover:border-[#C9A45C]/50 transition-all relative group font-sans"
                        >
                          <div>
                            {/* Top row */}
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-[#3A101C] text-[#C9A45C] flex items-center justify-center font-serif font-bold text-base shadow-xs">
                                  {mua.name.charAt(0)}
                                </div>
                                <div>
                                  <h4 className="font-serif font-bold text-sm text-[#292321] group-hover:text-[#3A101C] transition-colors">
                                    {mua.name}
                                  </h4>
                                  <p className="font-sans text-[11px] text-[#8C7A75] flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-[#C9A45C]" />
                                    <span>{mua.location}, Padang</span>
                                  </p>
                                </div>
                              </div>

                              <button
                                onClick={() => removeWishlist(mua.id, mua.name)}
                                title="Hapus dari wishlist"
                                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Bio */}
                            <p className="font-sans text-xs text-[#8C7A75] line-clamp-2 leading-relaxed mb-3">
                              {mua.bio}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1 mb-4 font-poppins">
                              {mua.makeupStyles.slice(0, 2).map((style, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white text-[#3A101C] border border-[#EAE3DC]"
                                >
                                  {style}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Footer Action */}
                          <div className="pt-3 border-t border-[#EAE3DC] flex items-center justify-between gap-2">
                            <div>
                              <span className="font-poppins text-[9.5px] uppercase tracking-wider text-[#8C7A75] block">Mulai dari</span>
                              <span className="font-serif font-bold text-xs text-[#3A101C]">
                                Rp 250.000
                              </span>
                            </div>

                            <Link
                              href={`/mua/${mua.id}`}
                              className="font-poppins px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#3A101C] text-white hover:bg-[#4E1321] transition-all flex items-center gap-1 shadow-xs"
                            >
                              <span>Reservasi</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* TAB 4: KEAMANAN & AKUN */}
            {activeTab === 'keamanan' && (
              <div className="space-y-6 animate-in fade-in-50 duration-200">
                <div className="bg-white rounded-2xl border border-[#EAE3DC] p-6 shadow-[0_2px_16px_rgba(41,35,33,0.03)] space-y-6">
                  
                  <div className="border-b border-[#F2ECE6] pb-4">
                    <h3 className="font-serif font-bold text-lg text-[#3A101C]">
                      Keamanan Akun & Notifikasi
                    </h3>
                    <p className="font-sans text-xs text-[#8C7A75] mt-0.5">
                      Pengaturan kredensial sandi, verifikasi 2 langkah, dan preferensi pemberitahuan reservasi.
                    </p>
                  </div>

                  <div className="space-y-4 font-sans">
                    {/* Password */}
                    <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE3DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                      <div className="space-y-1">
                        <span className="font-poppins font-semibold text-[#292321] text-sm block">Kata Sandi Akun</span>
                        <p className="text-[#8C7A75]">Terakhir diubah 2 bulan lalu. Gunakan kombinasi aman huruf kapital, angka, dan karakter.</p>
                      </div>
                      <button
                        onClick={() => showToast('Tautan ganti kata sandi telah dikirim ke email Anda.')}
                        className="font-poppins px-4 py-2 rounded-xl font-medium border border-[#EAE3DC] bg-white hover:border-[#3A101C] text-[#3A101C] hover:bg-[#FAF4EB] transition-all shrink-0 self-start sm:self-auto"
                      >
                        Ubah Sandi
                      </button>
                    </div>

                    {/* WhatsApp OTP */}
                    <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE3DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-poppins font-semibold text-[#292321] text-sm">Verifikasi 2 Langkah (WhatsApp OTP)</span>
                          <span className="font-poppins px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            Aktif
                          </span>
                        </div>
                        <p className="text-[#8C7A75]">Kode verifikasi dikirimkan ke nomor WhatsApp {profileData.phone} untuk konfirmasi transaksi escrow.</p>
                      </div>
                      <span className="font-poppins text-emerald-700 font-semibold text-xs flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Terlindungi
                      </span>
                    </div>

                    {/* Notifications */}
                    <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE3DC] space-y-3 text-xs">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#C9A45C]" />
                        <span className="font-poppins font-semibold text-[#292321] text-sm">Preferensi Notifikasi Jadwal Rias</span>
                      </div>
                      <div className="space-y-2 pt-1 text-[#5C504D]">
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input type="checkbox" defaultChecked className="rounded text-[#3A101C] focus:ring-[#3A101C]" />
                          <span>Pengingat jadwal kedatangan MUA H-1 via WhatsApp</span>
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input type="checkbox" defaultChecked className="rounded text-[#3A101C] focus:ring-[#3A101C]" />
                          <span>Notifikasi status konfirmasi booking dan mutasi escrow via Email</span>
                        </label>
                      </div>
                    </div>

                    {/* Active session */}
                    <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE3DC] flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <span className="font-poppins font-semibold text-[#292321]">Sesi Login Aktif</span>
                        <p className="text-[#8C7A75]">Kota Padang, Indonesia • Perangkat Web Chrome di Windows</p>
                      </div>
                      <span className="font-poppins px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold">
                        Sesi Ini
                      </span>
                    </div>

                  </div>

                </div>
              </div>
            )}

          </main>

        </div>

      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Ubah Data Profil Klien"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-sans">
          <div>
            <label className="font-poppins block text-[#8C7A75] font-semibold mb-1">Nama Lengkap</label>
            <input
              type="text"
              required
              value={editFormData.name}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3DC] focus:outline-none focus:border-[#3A101C] text-sm text-[#292321]"
            />
          </div>

          <div>
            <label className="font-poppins block text-[#8C7A75] font-semibold mb-1">Nomor WhatsApp / HP</label>
            <input
              type="text"
              required
              value={editFormData.phone}
              onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3DC] focus:outline-none focus:border-[#3A101C] text-sm font-mono text-[#292321]"
            />
          </div>

          <div>
            <label className="font-poppins block text-[#8C7A75] font-semibold mb-1">Kota & Kecamatan</label>
            <input
              type="text"
              required
              value={editFormData.city}
              onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3DC] focus:outline-none focus:border-[#3A101C] text-sm text-[#292321]"
            />
          </div>

          <div>
            <label className="font-poppins block text-[#8C7A75] font-semibold mb-1">Alamat Lengkap Sesi Rias</label>
            <textarea
              rows={2}
              required
              value={editFormData.address}
              onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3DC] focus:outline-none focus:border-[#3A101C] text-sm text-[#292321]"
            />
          </div>

          <div>
            <label className="font-poppins block text-[#8C7A75] font-semibold mb-1">Preferensi Gaya Rias</label>
            <input
              type="text"
              value={editFormData.stylePreference}
              onChange={(e) => setEditFormData({ ...editFormData, stylePreference: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3DC] focus:outline-none focus:border-[#3A101C] text-sm text-[#292321]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#EAE3DC]">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="font-poppins px-4 py-2 rounded-xl text-[#8C7A75] hover:bg-stone-100 transition-colors font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="font-poppins px-4 py-2 rounded-xl font-semibold bg-[#3A101C] text-white hover:bg-[#4E1321] transition-colors"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Konfirmasi Keluar Akun"
      >
        <p className="font-sans text-xs text-[#8C7A75] leading-relaxed mb-6">
          Apakah Anda yakin ingin keluar dari portal akun GLAMÉA? Anda dapat masuk kembali kapan saja dengan email dan sandi Anda.
        </p>
        <div className="flex justify-end gap-2 text-xs">
          <button
            onClick={() => setIsLogoutModalOpen(false)}
            className="font-poppins px-4 py-2 rounded-xl text-[#8C7A75] hover:bg-stone-100 transition-colors font-medium"
          >
            Batal
          </button>
          <button
            onClick={handleLogout}
            className="font-poppins px-4 py-2 rounded-xl font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-colors"
          >
            Ya, Keluar Akun
          </button>
        </div>
      </Modal>

    </div>
  );
}
