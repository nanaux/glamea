"use client";
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Phone, 
  MessageCircle, 
  Check, 
  X, 
  ShieldCheck, 
  Info, 
  Eye, 
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { mockBookings } from '@/data/mock-bookings';
import { mockClients } from '@/data/mock-users';
import { mockServices } from '@/data/mock-services';
import { formatRupiah } from '@/lib/utils';
import { BookingStatus, Booking } from '@/types';

type TabFilter = 'ALL' | 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export default function MuaBookingPage() {
  const muaId = 'mua-1'; // Logged-in MUA
  
  // State for bookings list to allow real-time approvals & rejections
  const [bookingsList, setBookingsList] = useState<Booking[]>(() => {
    return mockBookings.filter(b => b.muaId === muaId);
  });

  const [activeTab, setActiveTab] = useState<TabFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [bookingToReject, setBookingToReject] = useState<Booking | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Helper function to show temporary toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Helper mapping for client data
  const getClientInfo = (clientId: string) => {
    return mockClients.find(c => c.id === clientId) || {
      id: clientId,
      name: 'Pelanggan GLAMÉA',
      phone: '0812-3456-7890',
      email: 'pelanggan@glamea.com',
    };
  };

  // Helper mapping for service data
  const getServiceInfo = (serviceId: string) => {
    return mockServices.find(s => s.id === serviceId);
  };

  // Tab counters
  const counts = useMemo(() => {
    return {
      all: bookingsList.length,
      pending: bookingsList.filter(b => b.bookingStatus === 'Pending').length,
      confirmed: bookingsList.filter(b => b.bookingStatus === 'Confirmed').length,
      completed: bookingsList.filter(b => b.bookingStatus === 'Completed').length,
      cancelled: bookingsList.filter(b => b.bookingStatus === 'Cancelled').length,
    };
  }, [bookingsList]);

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    return bookingsList.filter(b => {
      // Tab filter
      if (activeTab !== 'ALL' && b.bookingStatus !== activeTab) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const client = getClientInfo(b.clientId);
        const service = getServiceInfo(b.serviceId);
        const query = searchQuery.toLowerCase();
        const matchName = client.name.toLowerCase().includes(query);
        const matchOccasion = b.occasion.toLowerCase().includes(query);
        const matchLocation = b.location.toLowerCase().includes(query);
        const matchService = service?.name.toLowerCase().includes(query);
        const matchId = b.id.toLowerCase().includes(query);
        return matchName || matchOccasion || matchLocation || matchService || matchId;
      }
      return true;
    });
  }, [bookingsList, activeTab, searchQuery]);

  // Handlers
  const handleApprove = (bookingId: string) => {
    const target = bookingsList.find(b => b.id === bookingId);
    const client = target ? getClientInfo(target.clientId) : null;
    
    setBookingsList(prev => 
      prev.map(b => b.id === bookingId ? { ...b, bookingStatus: 'Confirmed' as BookingStatus } : b)
    );
    
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking(prev => prev ? { ...prev, bookingStatus: 'Confirmed' } : null);
    }
    
    showToast(`Pesanan untuk ${client?.name || 'klien'} berhasil disetujui & jadwal telah dikunci!`);
  };

  const handleOpenReject = (booking: Booking) => {
    setBookingToReject(booking);
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!bookingToReject) return;
    const client = getClientInfo(bookingToReject.clientId);
    
    setBookingsList(prev => 
      prev.map(b => b.id === bookingToReject.id ? { ...b, bookingStatus: 'Cancelled' as BookingStatus } : b)
    );
    
    if (selectedBooking && selectedBooking.id === bookingToReject.id) {
      setSelectedBooking(prev => prev ? { ...prev, bookingStatus: 'Cancelled' } : null);
    }
    
    setIsRejectModalOpen(false);
    setBookingToReject(null);
    showToast(`Pesanan dari ${client.name} telah ditolak.`);
  };

  const handleOpenDetail = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailDrawerOpen(true);
  };

  // Helper date formatter
  const formatDateIndonesia = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('id-ID', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Helper client initials
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return (name[0] || 'U').toUpperCase();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#641A2B] text-white px-5 py-3.5 rounded-xl shadow-lg border border-[#C9A45C]/40 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#C9A45C] shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-white/70 hover:text-white ml-2 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#641A2B] tracking-tight">
            Permintaan Booking
          </h1>
          <p className="text-sm text-[#7A6E6A] mt-1 font-light max-w-xl">
            Tinjau pesanan masuk, konfirmasi ketersediaan jadwal, dan pantau status proteksi pembayaran setiap sesi riasan.
          </p>
        </div>

        {/* Quick Summary Pill Counters */}
        <div className="flex items-center gap-2 flex-wrap text-xs font-poppins">
          <div className="bg-white border border-[#EDE3D9] px-3 py-2 rounded-xl flex items-center gap-2 shadow-2xs">
            <span className="text-[#7A6E6A]">Perlu Respon:</span>
            <span className={`font-semibold px-2 py-0.5 rounded-md ${
              counts.pending > 0 
                ? 'bg-amber-100 text-amber-900 font-bold' 
                : 'bg-stone-100 text-stone-600'
            }`}>
              {counts.pending}
            </span>
          </div>

          <div className="bg-white border border-[#EDE3D9] px-3 py-2 rounded-xl flex items-center gap-2 shadow-2xs">
            <span className="text-[#7A6E6A]">Terkonfirmasi:</span>
            <span className="font-semibold px-2 py-0.5 rounded-md bg-[#641A2B]/10 text-[#641A2B]">
              {counts.confirmed}
            </span>
          </div>

          <div className="bg-white border border-[#EDE3D9] px-3 py-2 rounded-xl flex items-center gap-2 shadow-2xs">
            <span className="text-[#7A6E6A]">Selesai:</span>
            <span className="font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
              {counts.completed}
            </span>
          </div>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl border border-[#EDE3D9] shadow-xs overflow-hidden">
        
        {/* Filter Tabs & Search Bar */}
        <div className="p-4 sm:p-5 border-b border-[#EDE3D9] bg-[#FDFCFA] space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none font-poppins">
              <button
                onClick={() => setActiveTab('ALL')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-2 ${
                  activeTab === 'ALL'
                    ? 'bg-[#641A2B] text-white shadow-xs'
                    : 'text-[#7A6E6A] hover:text-[#292321] hover:bg-stone-100'
                }`}
              >
                <span>Semua Pesanan</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                  activeTab === 'ALL' ? 'bg-white/20 text-white' : 'bg-[#EDE3D9] text-[#7A6E6A]'
                }`}>
                  {counts.all}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('Pending')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-2 ${
                  activeTab === 'Pending'
                    ? 'bg-[#641A2B] text-white shadow-xs'
                    : 'text-[#7A6E6A] hover:text-[#292321] hover:bg-stone-100'
                }`}
              >
                {counts.pending > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
                <span>Menunggu Respon</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                  activeTab === 'Pending' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900 font-semibold'
                }`}>
                  {counts.pending}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('Confirmed')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-2 ${
                  activeTab === 'Confirmed'
                    ? 'bg-[#641A2B] text-white shadow-xs'
                    : 'text-[#7A6E6A] hover:text-[#292321] hover:bg-stone-100'
                }`}
              >
                <span>Dikonfirmasi</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                  activeTab === 'Confirmed' ? 'bg-white/20 text-white' : 'bg-[#EDE3D9] text-[#7A6E6A]'
                }`}>
                  {counts.confirmed}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('Completed')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-2 ${
                  activeTab === 'Completed'
                    ? 'bg-[#641A2B] text-white shadow-xs'
                    : 'text-[#7A6E6A] hover:text-[#292321] hover:bg-stone-100'
                }`}
              >
                <span>Selesai</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                  activeTab === 'Completed' ? 'bg-white/20 text-white' : 'bg-[#EDE3D9] text-[#7A6E6A]'
                }`}>
                  {counts.completed}
                </span>
              </button>

              {counts.cancelled > 0 && (
                <button
                  onClick={() => setActiveTab('Cancelled')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-2 ${
                    activeTab === 'Cancelled'
                      ? 'bg-[#641A2B] text-white shadow-xs'
                      : 'text-[#7A6E6A] hover:text-[#292321] hover:bg-stone-100'
                  }`}
                >
                  <span>Dibatalkan</span>
                  <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                    activeTab === 'Cancelled' ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
                  }`}>
                    {counts.cancelled}
                  </span>
                </button>
              )}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 text-[#7A6E6A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, acara, lokasi..."
                className="w-full pl-9 pr-8 py-2 bg-white border border-[#EDE3D9] rounded-xl text-xs text-[#292321] placeholder-[#7A6E6A]/70 focus:outline-hidden focus:border-[#C9A45C] focus:ring-1 focus:ring-[#C9A45C]/30 transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7A6E6A] hover:text-[#292321]"
                >
                  ✕
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Bookings List Area */}
        <div className="divide-y divide-[#EDE3D9]/70">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF4EB] text-[#C9A45C] mx-auto flex items-center justify-center border border-[#EDE3D9] mb-3">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <h3 className="font-poppins font-bold text-lg text-[#292321]">
                Tidak Ada Permintaan Booking
              </h3>
              <p className="text-xs text-[#7A6E6A] mt-1 max-w-sm mx-auto">
                {searchQuery 
                  ? `Tidak ditemukan hasil yang cocok dengan kata kunci "${searchQuery}". Coba kata kunci lain.`
                  : activeTab === 'Pending'
                  ? 'Saat ini belum ada pesanan baru yang membutuhkan respon Anda.'
                  : 'Belum ada data pesanan pada kategori filter yang dipilih.'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-3.5 py-1.5 rounded-lg text-xs bg-[#FAF4EB] text-[#641A2B] hover:bg-[#641A2B] hover:text-white transition-all font-medium border border-[#EDE3D9]"
                >
                  Bersihkan Pencarian
                </button>
              )}
            </div>
          ) : (
            filteredBookings.map((booking) => {
              const client = getClientInfo(booking.clientId);
              const service = getServiceInfo(booking.serviceId);
              const isPending = booking.bookingStatus === 'Pending';
              const isConfirmed = booking.bookingStatus === 'Confirmed';
              const isCompleted = booking.bookingStatus === 'Completed';
              const isCancelled = booking.bookingStatus === 'Cancelled';

              return (
                <div 
                  key={booking.id}
                  className="p-4 sm:p-5 hover:bg-[#FAF6F0]/40 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* Left Column: Client & Event Details */}
                  <div className="flex items-start gap-3.5 sm:gap-4 flex-1">
                    {/* Client Initials Avatar */}
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#FAF4EB] text-[#641A2B] border border-[#EDE3D9] flex items-center justify-center font-serif font-bold text-sm shrink-0 shadow-2xs">
                      {getInitials(client.name)}
                    </div>

                    <div className="min-w-0 space-y-1">
                      {/* Name & Reference ID */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm sm:text-base text-[#292321] hover:text-[#641A2B] transition-colors font-poppins">
                          {client.name}
                        </span>
                        <span className="text-[11px] font-mono text-[#7A6E6A] px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200">
                          #{booking.id.toUpperCase()}
                        </span>
                        
                        {/* Status Badge */}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium font-poppins bg-amber-50 text-amber-900 border border-amber-200/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Menunggu Respon
                          </span>
                        )}
                        {isConfirmed && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium font-poppins bg-[#641A2B]/10 text-[#641A2B] border border-[#641A2B]/20">
                            <Check className="w-3 h-3 text-[#641A2B]" />
                            Dikonfirmasi
                          </span>
                        )}
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium font-poppins bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Selesai
                          </span>
                        )}
                        {isCancelled && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium font-poppins bg-stone-100 text-stone-600 border border-stone-200">
                            Dibatalkan
                          </span>
                        )}
                      </div>

                      {/* Service & Occasion */}
                      <p className="text-xs text-[#292321] font-medium flex items-center gap-1.5 flex-wrap">
                        <span>{service?.name || booking.occasion}</span>
                        <span className="text-[#EDE3D9]">•</span>
                        <span className="text-[#7A6E6A]">Acara: {booking.occasion}</span>
                        <span className="text-[#EDE3D9]">•</span>
                        <span className="text-[#7A6E6A] flex items-center gap-1">
                          <Users className="w-3 h-3 text-[#7A6E6A]" />
                          {booking.numberOfPeople} Orang
                        </span>
                      </p>

                      {/* Date, Time & Location */}
                      <div className="flex items-center gap-x-4 gap-y-1 text-xs text-[#7A6E6A] flex-wrap pt-0.5">
                        <span className="inline-flex items-center gap-1 text-[#641A2B] font-medium">
                          <CalendarIcon className="w-3.5 h-3.5 text-[#C9A45C]" />
                          {formatDateIndonesia(booking.date)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#7A6E6A]" />
                          {booking.time} WIB
                        </span>
                        <span className="inline-flex items-center gap-1 max-w-xs truncate" title={booking.location}>
                          <MapPin className="w-3.5 h-3.5 text-[#7A6E6A] shrink-0" />
                          <span className="truncate">{booking.location}</span>
                        </span>
                      </div>

                      {/* Client Note Excerpt (if any) */}
                      {booking.notes && (
                        <div className="pt-1">
                          <p className="text-[11px] text-[#7A6E6A] bg-[#FAF4EB]/60 px-2.5 py-1 rounded-md border border-[#EDE3D9] inline-block italic max-w-md truncate">
                            &quot;{booking.notes}&quot;
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Pricing, Escrow & Contextual Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between sm:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#EDE3D9]/60 shrink-0">
                    
                    {/* Financial & Escrow Pill */}
                    <div className="text-left lg:text-right">
                      <div className="text-base sm:text-lg font-serif font-bold text-[#292321] tracking-tight">
                        {formatRupiah(booking.total)}
                      </div>
                      <div className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 mt-0.5">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Dana Terproteksi Escrow</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 w-full sm:w-auto font-poppins">
                      {isPending && (
                        <>
                          <button
                            onClick={() => handleApprove(booking.id)}
                            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#641A2B] hover:bg-[#4A1220] text-white transition-all shadow-2xs flex items-center justify-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5 text-[#C9A45C]" />
                            <span>Terima</span>
                          </button>
                          <button
                            onClick={() => handleOpenReject(booking)}
                            className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 transition-all flex items-center justify-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Tolak</span>
                          </button>
                        </>
                      )}

                      {isConfirmed && (
                        <Link
                          href="/mua/chat"
                          className="flex-1 sm:flex-initial px-3 py-2 rounded-xl text-xs font-semibold bg-[#FAF4EB] hover:bg-[#641A2B] text-[#641A2B] hover:text-white border border-[#EDE3D9] transition-all flex items-center justify-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-[#C9A45C]" />
                          <span>Chat Klien</span>
                        </Link>
                      )}

                      {/* Detail Drawer Trigger */}
                      <button
                        onClick={() => handleOpenDetail(booking)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold text-[#7A6E6A] hover:text-[#292321] hover:bg-stone-100 border border-[#EDE3D9] transition-all flex items-center justify-center gap-1"
                        title="Lihat Detail Pesanan"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#7A6E6A]" />
                        <span>Rincian</span>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Slide-over Detail Drawer Modal */}
      {isDetailDrawerOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-2xs flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#EDE3D9] flex items-center justify-between bg-[#FAF6F0]">
              <div>
                <span className="text-[11px] font-mono text-[#7A6E6A] uppercase tracking-wider">
                  Rincian Reservasi #{selectedBooking.id.toUpperCase()}
                </span>
                <h3 className="font-poppins font-bold text-lg text-[#641A2B]">
                  {getClientInfo(selectedBooking.clientId).name}
                </h3>
              </div>
              <button
                onClick={() => setIsDetailDrawerOpen(false)}
                className="w-8 h-8 rounded-xl bg-white border border-[#EDE3D9] text-[#7A6E6A] hover:text-[#292321] flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-5 overflow-y-auto space-y-6 flex-1">
              
              {/* Status & Escrow Banner */}
              <div className="p-4 rounded-xl bg-[#FAF4EB] border border-[#EDE3D9] flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-[#292321]">
                    Pembayaran Terjamin oleh Escrow GLAMÉA
                  </p>
                  <p className="text-[#7A6E6A] mt-0.5 leading-relaxed">
                    Klien telah menyetorkan pembayaran senilai {formatRupiah(selectedBooking.total)}. Dana aman di rekening bersama dan akan otomatis cair ke saldo Anda setelah sesi riasan selesai.
                  </p>
                </div>
              </div>

              {/* Client Info */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider font-semibold font-poppins text-[#7A6E6A]">
                  Informasi Kontak Klien
                </h4>
                <div className="bg-white rounded-xl border border-[#EDE3D9] p-3.5 space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-[#EDE3D9]/60">
                    <span className="text-[#7A6E6A]">Nama Lengkap</span>
                    <span className="font-semibold text-[#292321]">
                      {getClientInfo(selectedBooking.clientId).name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#EDE3D9]/60">
                    <span className="text-[#7A6E6A]">Nomor Telepon</span>
                    <a 
                      href={`tel:${getClientInfo(selectedBooking.clientId).phone}`}
                      className="font-mono text-[#641A2B] hover:underline flex items-center gap-1 font-medium"
                    >
                      <Phone className="w-3 h-3 text-[#C9A45C]" />
                      {getClientInfo(selectedBooking.clientId).phone}
                    </a>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-[#7A6E6A]">Email</span>
                    <span className="font-mono text-[#292321]">
                      {getClientInfo(selectedBooking.clientId).email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Service & Schedule Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider font-semibold font-poppins text-[#7A6E6A]">
                  Rincian Layanan & Jadwal
                </h4>
                <div className="bg-white rounded-xl border border-[#EDE3D9] p-4 space-y-3 text-xs">
                  <div className="pb-3 border-b border-[#EDE3D9]">
                    <span className="text-[#A67C37] font-semibold uppercase text-[10px] tracking-wider">
                      Paket Dipilih
                    </span>
                    <p className="font-serif font-bold text-base text-[#292321] mt-0.5">
                      {getServiceInfo(selectedBooking.serviceId)?.name || selectedBooking.occasion}
                    </p>
                    <p className="text-[#7A6E6A] mt-0.5">
                      {getServiceInfo(selectedBooking.serviceId)?.description || 'Layanan makeup profesional GLAMÉA'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-1">
                    <div>
                      <span className="text-[#7A6E6A] block text-[11px]">Tanggal Acara</span>
                      <span className="font-semibold text-[#641A2B] mt-0.5 block">
                        {formatDateIndonesia(selectedBooking.date)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#7A6E6A] block text-[11px]">Waktu Standby</span>
                      <span className="font-semibold text-[#292321] mt-0.5 block">
                        {selectedBooking.time} WIB
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#EDE3D9]">
                    <span className="text-[#7A6E6A] block text-[11px]">Lokasi Acara</span>
                    <p className="font-medium text-[#292321] flex items-start gap-1.5 mt-1">
                      <MapPin className="w-4 h-4 text-[#641A2B] shrink-0 mt-0.5" />
                      <span>{selectedBooking.location}</span>
                    </p>
                  </div>

                  {selectedBooking.notes && (
                    <div className="pt-2 border-t border-[#EDE3D9]">
                      <span className="text-[#7A6E6A] block text-[11px]">Catatan Khusus Klien</span>
                      <p className="bg-[#FAF4EB] p-2.5 rounded-lg border border-[#EDE3D9] text-[#292321] italic mt-1 leading-relaxed">
                        &quot;{selectedBooking.notes}&quot;
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider font-semibold font-poppins text-[#7A6E6A]">
                  Rincian Biaya
                </h4>
                <div className="bg-white rounded-xl border border-[#EDE3D9] p-4 text-xs space-y-2">
                  <div className="flex justify-between text-[#7A6E6A]">
                    <span>Biaya Layanan ({selectedBooking.numberOfPeople} Orang)</span>
                    <span>{formatRupiah(selectedBooking.subtotal)}</span>
                  </div>
                  {selectedBooking.discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Potongan Promosi</span>
                      <span>-{formatRupiah(selectedBooking.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-serif font-bold text-[#292321] pt-2 border-t border-[#EDE3D9]">
                    <span>Total Bersih</span>
                    <span className="text-[#641A2B]">{formatRupiah(selectedBooking.total)}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-[#EDE3D9] bg-[#FAF6F0] flex items-center gap-2 font-poppins">
              {selectedBooking.bookingStatus === 'Pending' && (
                <>
                  <button
                    onClick={() => {
                      handleApprove(selectedBooking.id);
                      setIsDetailDrawerOpen(false);
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#641A2B] hover:bg-[#4A1220] text-white transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4 text-[#C9A45C]" />
                    <span>Setujui & Kunci Jadwal</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsDetailDrawerOpen(false);
                      handleOpenReject(selectedBooking);
                    }}
                    className="py-2.5 px-4 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 transition-all"
                  >
                    Tolak
                  </button>
                </>
              )}

              {selectedBooking.bookingStatus === 'Confirmed' && (
                <Link
                  href="/mua/chat"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#641A2B] hover:bg-[#4A1220] text-white transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-[#C9A45C]" />
                  <span>Kirim Pesan ke Klien</span>
                </Link>
              )}

              {selectedBooking.bookingStatus === 'Completed' && (
                <button
                  onClick={() => setIsDetailDrawerOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-white border border-[#EDE3D9] text-[#292321] hover:bg-stone-50"
                >
                  Tutup Rincian
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {isRejectModalOpen && bookingToReject && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-[#EDE3D9] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-poppins font-bold text-lg text-[#292321]">
                Tolak Permintaan Booking?
              </h3>
              <p className="text-xs text-[#7A6E6A] mt-1 leading-relaxed">
                Anda akan menolak reservasi dari <strong>{getClientInfo(bookingToReject.clientId).name}</strong> untuk tanggal <strong>{formatDateIndonesia(bookingToReject.date)}</strong>. Dana klien yang berada di escrow akan otomatis dikembalikan penuh.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 font-poppins">
              <button
                onClick={() => {
                  setIsRejectModalOpen(false);
                  setBookingToReject(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#7A6E6A] hover:bg-stone-100 transition-colors"
              >
                Kembali
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors"
              >
                Ya, Tolak Pesanan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
