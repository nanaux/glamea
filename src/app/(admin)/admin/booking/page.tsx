"use client";
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Search, 
  Filter, 
  Download, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  Clock3, 
  XCircle, 
  Eye, 
  ArrowUpDown, 
  Building2, 
  Sparkles, 
  CreditCard, 
  DollarSign, 
  FileText, 
  ExternalLink, 
  Copy, 
  Check, 
  X,
  Phone,
  Mail,
  ChevronRight,
  RefreshCw,
  BadgePercent
} from 'lucide-react';
import { mockClients } from '@/data/mock-users';
import { mockMuas } from '@/data/mock-muas';
import { mockServices } from '@/data/mock-services';
import { mockBookings } from '@/data/mock-bookings';
import { formatRupiah } from '@/lib/utils';
import { BookingStatus, FundStatus } from '@/types';

interface ExtendedBooking {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  muaId: string;
  muaName: string;
  serviceId: string;
  serviceName: string;
  occasion: string;
  date: string;
  time: string;
  location: string;
  numberOfPeople: number;
  notes: string;
  subtotal: number;
  discount: number;
  total: number;
  bookingStatus: BookingStatus;
  paymentStatus: 'Success' | 'Pending' | 'Failed';
  fundStatus: FundStatus;
  paymentMethod: string;
  createdAt: string;
}

const initialBookings: ExtendedBooking[] = mockBookings.map(b => {
  const client = mockClients.find(c => c.id === b.clientId);
  const mua = mockMuas.find(m => m.id === b.muaId);
  const svc = mockServices.find(s => s.id === b.serviceId);
  return {
    ...b,
    clientName: client?.name || 'Klien GLAMÉA',
    clientPhone: client?.phone || '-',
    clientEmail: client?.email || '-',
    muaName: mua?.name || 'Mitra MUA',
    serviceName: svc?.name || b.occasion,
    paymentMethod: b.id === 'booking-1' 
      ? 'Transfer Bank (BCA)' 
      : b.id === 'booking-4' 
      ? 'QRIS GLAMÉA' 
      : b.id === 'booking-6' 
      ? 'Transfer Bank (BCA)' 
      : 'Virtual Account',
  };
});

export default function AdminBookingPage() {
  const [bookings, setBookings] = useState<ExtendedBooking[]>(initialBookings);
  const [selectedStatusTab, setSelectedStatusTab] = useState<'ALL' | BookingStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [occasionFilter, setOccasionFilter] = useState<string>('ALL');
  const [fundStatusFilter, setFundStatusFilter] = useState<'ALL' | FundStatus>('ALL');
  const [selectedBookingModal, setSelectedBookingModal] = useState<ExtendedBooking | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    showToast(`${label} disalin: ${text}`);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Admin audit action on booking
  const updateBookingStatus = (id: string, newStatus: BookingStatus, newFundStatus?: FundStatus) => {
    setBookings(prev => prev.map(b => {
      if (b.id === id) {
        return {
          ...b,
          bookingStatus: newStatus,
          fundStatus: newFundStatus || b.fundStatus
        };
      }
      return b;
    }));
    showToast(`Status booking #${id} diperbarui menjadi: ${newStatus}`);
    if (selectedBookingModal && selectedBookingModal.id === id) {
      setSelectedBookingModal(prev => prev ? ({
        ...prev,
        bookingStatus: newStatus,
        fundStatus: newFundStatus || prev.fundStatus
      }) : null);
    }
  };

  // Distinct occasions for filter
  const occasions = useMemo(() => {
    const set = new Set<string>();
    initialBookings.forEach(b => set.add(b.occasion));
    return Array.from(set);
  }, []);

  // Filtered dataset
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      // Tab filter
      if (selectedStatusTab !== 'ALL' && b.bookingStatus !== selectedStatusTab) return false;

      // Occasion filter
      if (occasionFilter !== 'ALL' && b.occasion !== occasionFilter) return false;

      // Fund status filter
      if (fundStatusFilter !== 'ALL' && b.fundStatus !== fundStatusFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = b.id.toLowerCase().includes(q);
        const matchClient = b.clientName.toLowerCase().includes(q);
        const matchMua = b.muaName.toLowerCase().includes(q);
        const matchLocation = b.location.toLowerCase().includes(q);
        const matchService = b.serviceName.toLowerCase().includes(q);
        if (!matchId && !matchClient && !matchMua && !matchLocation && !matchService) return false;
      }

      return true;
    });
  }, [bookings, selectedStatusTab, occasionFilter, fundStatusFilter, searchQuery]);

  // Aggregate Metrics
  const totalCount = bookings.length;
  const confirmedCount = bookings.filter(b => b.bookingStatus === 'Confirmed').length;
  const pendingCount = bookings.filter(b => b.bookingStatus === 'Pending').length;
  const completedCount = bookings.filter(b => b.bookingStatus === 'Completed').length;
  const cancelledCount = bookings.filter(b => b.bookingStatus === 'Cancelled').length;

  const totalGMV = bookings.reduce((acc, curr) => acc + (curr.bookingStatus !== 'Cancelled' ? curr.total : 0), 0);
  const heldEscrow = bookings.filter(b => b.fundStatus === 'Held').reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-[#172033] text-white rounded-xl shadow-xl text-xs font-sans animate-fade-in border border-[#4778C7]/30">
          <CheckCircle2 className="w-4 h-4 text-[#4778C7]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Executive Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#E1E7F0]/80">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-[#172033] tracking-tight font-serif">
              Pemantauan & Audit Booking
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#4778C7] border border-[#BFDBFE]">
              {totalCount} Reservasi
            </span>
          </div>
          <p className="text-sm text-[#64748B] mt-1 font-sans">
            Monitoring real-time seluruh reservasi tata rias, status MUA, dan proteksi dana escrow di Kota Padang
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#ECFDF5] border border-emerald-200/80 rounded-xl text-xs text-emerald-800 font-sans">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium">Escrow Protected</span>
          </div>

          <button 
            onClick={() => showToast('Laporan pemantauan booking berhasil diunduh (CSV format)')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#E1E7F0] rounded-xl text-xs font-semibold text-[#172033] hover:bg-[#F8FAFC] transition-colors shadow-xs font-poppins"
          >
            <Download className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Unduh Laporan</span>
          </button>
        </div>
      </div>

      {/* Main Panel: Filter & Data Table (Zero Nested Cards) */}
      <div className="bg-white border border-[#E1E7F0] rounded-2xl shadow-xs overflow-hidden">
        
        {/* Top Filter & Search Toolbar */}
        <div className="p-4 md:p-5 border-b border-[#E1E7F0] space-y-4">
          
          {/* Segmented Status Tabs & Results Counter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="inline-flex p-1 bg-[#F1F5F9] rounded-xl text-xs font-semibold font-poppins overflow-x-auto max-w-full">
              <button
                onClick={() => setSelectedStatusTab('ALL')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  selectedStatusTab === 'ALL'
                    ? 'bg-white text-[#172033] shadow-xs'
                    : 'text-[#64748B] hover:text-[#172033]'
                }`}
              >
                Semua ({totalCount})
              </button>
              <button
                onClick={() => setSelectedStatusTab('Pending')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  selectedStatusTab === 'Pending'
                    ? 'bg-white text-[#172033] shadow-xs'
                    : 'text-[#64748B] hover:text-[#172033]'
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setSelectedStatusTab('Confirmed')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  selectedStatusTab === 'Confirmed'
                    ? 'bg-white text-[#172033] shadow-xs'
                    : 'text-[#64748B] hover:text-[#172033]'
                }`}
              >
                Confirmed ({confirmedCount})
              </button>
              <button
                onClick={() => setSelectedStatusTab('Completed')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  selectedStatusTab === 'Completed'
                    ? 'bg-white text-[#172033] shadow-xs'
                    : 'text-[#64748B] hover:text-[#172033]'
                }`}
              >
                Completed ({completedCount})
              </button>
              <button
                onClick={() => setSelectedStatusTab('Cancelled')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  selectedStatusTab === 'Cancelled'
                    ? 'bg-white text-[#172033] shadow-xs'
                    : 'text-[#64748B] hover:text-[#172033]'
                }`}
              >
                Cancelled ({cancelledCount})
              </button>
            </div>

            <div className="text-xs text-[#64748B] font-sans">
              Menampilkan <strong className="text-[#172033] font-medium">{filteredBookings.length}</strong> dari {bookings.length} transaksi
            </div>
          </div>

          {/* Search Bar & Dropdown Selects */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari ID booking, klien, MUA, layanan, atau venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#E1E7F0] focus:border-[#4778C7] focus:bg-white rounded-xl text-xs text-[#172033] placeholder-[#94A3B8] focus:outline-hidden transition-colors font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#172033]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Occasion Filter */}
            <div className="sm:col-span-3">
              <select
                value={occasionFilter}
                onChange={(e) => setOccasionFilter(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E1E7F0] focus:border-[#4778C7] focus:bg-white rounded-xl text-xs text-[#172033] focus:outline-hidden transition-colors font-sans"
              >
                <option value="ALL">Semua Kategori Acara</option>
                {occasions.map(occ => (
                  <option key={occ} value={occ}>{occ}</option>
                ))}
              </select>
            </div>

            {/* Fund Status Filter */}
            <div className="sm:col-span-3">
              <select
                value={fundStatusFilter}
                onChange={(e) => setFundStatusFilter(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E1E7F0] focus:border-[#4778C7] focus:bg-white rounded-xl text-xs text-[#172033] focus:outline-hidden transition-colors font-sans"
              >
                <option value="ALL">Semua Status Escrow</option>
                <option value="Held">Tertahan di Escrow (Held)</option>
                <option value="PendingPayout">Siap Cair (PendingPayout)</option>
                <option value="PaidOut">Telah Dicairkan (PaidOut)</option>
                <option value="None">Tanpa Dana / Refund</option>
              </select>
            </div>
          </div>
        </div>

        {/* Flat Structured Table (Zero Nested Cards) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans min-w-[980px]">
            <thead>
              <tr className="border-b border-[#E1E7F0] bg-[#F8FAFC]/60 text-[#64748B]">
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px] font-poppins w-[145px]">Kode & Jadwal</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px] font-poppins w-[160px]">Klien & Kontak</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px] font-poppins w-[140px]">Mitra MUA</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px] font-poppins w-[160px]">Layanan / Acara</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px] font-poppins w-[170px]">Lokasi Venue Padang</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px] font-poppins w-[125px]">Nominal</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px] font-poppins w-[115px]">Status Booking</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px] font-poppins w-[115px]">Escrow Dana</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px] text-right font-poppins w-[80px]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1E7F0]">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#64748B] font-sans">
                    <p className="text-sm font-medium text-[#172033]">Tidak ada pemesanan yang sesuai dengan filter</p>
                    <p className="text-xs mt-1 text-[#94A3B8]">Coba sesuaikan kata kunci atau bersihkan filter di atas.</p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const bookingDateFormatted = new Date(b.date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  });

                  return (
                    <tr key={b.id} className="hover:bg-[#F8FAFC] transition-colors group">
                      
                      {/* Code & Schedule */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyToClipboard(b.id, 'ID Booking')}
                            className="font-mono font-semibold text-[#172033] hover:text-[#4778C7] transition-colors text-xs flex items-center gap-1"
                            title="Salin Kode Booking"
                          >
                            #{b.id}
                            {copiedText === b.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3 text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] mt-0.5">
                          <Calendar className="w-3 h-3 text-[#94A3B8]" />
                          <span>{bookingDateFormatted} • {b.time} WIB</span>
                        </div>
                      </td>

                      {/* Client & Contact */}
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-[#172033] font-poppins text-xs">
                          {b.clientName}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-[#64748B] mt-0.5">
                          <Phone className="w-2.5 h-2.5 text-[#94A3B8]" />
                          <span>{b.clientPhone}</span>
                          <span className="text-[#CBD5E1]">•</span>
                          <span>{b.numberOfPeople} Org</span>
                        </div>
                      </td>

                      {/* MUA Partner */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#F5F3FF] text-[#8B5CF6] border border-[#DDD6FE] flex items-center justify-center font-bold text-[10px]">
                            {b.muaName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-medium text-[#172033] text-xs block">
                              {b.muaName}
                            </span>
                            <span className="text-[10px] text-[#94A3B8] font-mono">
                              #{b.muaId}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Service / Occasion */}
                      <td className="py-3.5 px-3">
                        <div className="font-medium text-[#172033] max-w-[155px] truncate" title={b.serviceName}>
                          {b.serviceName}
                        </div>
                        <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-[#F1F5F9] text-[#475569]">
                          {b.occasion}
                        </span>
                      </td>

                      {/* Location in Padang */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-start gap-1 max-w-[165px]">
                          <MapPin className="w-3 h-3 text-[#64748B] shrink-0 mt-0.5" />
                          <span className="text-xs text-[#172033] leading-tight line-clamp-2" title={b.location}>
                            {b.location}
                          </span>
                        </div>
                      </td>

                      {/* Price / Total */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="font-semibold text-[#172033] text-xs font-sans">
                          {formatRupiah(b.total)}
                        </div>
                        {b.discount > 0 ? (
                          <span className="text-[10px] text-emerald-600 block">
                            Disc: -{formatRupiah(b.discount)}
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#94A3B8] block">
                            {b.paymentMethod}
                          </span>
                        )}
                      </td>

                      {/* Booking Status Badge */}
                      <td className="py-3.5 px-3">
                        {b.bookingStatus === 'Confirmed' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/70">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                            Confirmed
                          </span>
                        ) : b.bookingStatus === 'Pending' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/70">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            Pending
                          </span>
                        ) : b.bookingStatus === 'Completed' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/70">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            Cancelled
                          </span>
                        )}
                      </td>

                      {/* Escrow Fund Status */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {b.fundStatus === 'Held' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                            <ShieldCheck className="w-3 h-3 text-[#2563EB]" />
                            Held (Escrow)
                          </span>
                        ) : b.fundStatus === 'PendingPayout' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#FAF5FF] text-[#9333EA] border border-[#E9D5FF]">
                            <Clock className="w-3 h-3 text-[#9333EA]" />
                            Siap Cair
                          </span>
                        ) : b.fundStatus === 'PaidOut' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Dicairkan
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-50 text-slate-600 border border-slate-200">
                            <RefreshCw className="w-3 h-3 text-slate-500" />
                            Refund / Nihil
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          id={`btn-detail-${b.id}`}
                          onClick={() => setSelectedBookingModal(b)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#4778C7] hover:bg-[#EFF6FF] border border-[#E1E7F0] hover:border-[#BFDBFE] rounded-lg transition-colors font-poppins"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Rincian</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Pagination / Summary Bar */}
        <div className="px-5 py-3.5 border-t border-[#E1E7F0] bg-[#F8FAFC]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#64748B] font-sans">
          <span>Menampilkan rekapitulasi audit booking ekosistem GLAMÉA Kota Padang</span>
          <div className="flex items-center gap-2">
            <span className="text-[11px]">Escrow Status: 100% Reconciled</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </div>
        </div>
      </div>

      {/* Booking Detail Inspection Modal */}
      {selectedBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E1E7F0] rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden animate-scale-up">
            
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-[#E1E7F0] flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#4778C7] flex items-center justify-center font-bold text-xs">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#172033] font-poppins">
                    Rincian Audit Reservasi #{selectedBookingModal.id}
                  </h3>
                  <p className="text-[11px] text-[#64748B] font-mono">
                    Dibuat pada {new Date(selectedBookingModal.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedBookingModal(null)}
                className="w-7 h-7 rounded-lg text-[#94A3B8] hover:text-[#172033] hover:bg-[#F1F5F9] flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4.5 text-xs font-sans max-h-[75vh] overflow-y-auto">
              
              {/* Dual Party Grid (Client & MUA) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Client Side */}
                <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E1E7F0]">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B] font-poppins block mb-1">
                    Pihak Pemesan (Klien)
                  </span>
                  <div className="font-bold text-[#172033] text-sm font-poppins">
                    {selectedBookingModal.clientName}
                  </div>
                  <div className="text-[#64748B] mt-1 space-y-0.5 text-xs">
                    <p className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-[#94A3B8]" /> {selectedBookingModal.clientPhone}</p>
                    <p className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-[#94A3B8]" /> {selectedBookingModal.clientEmail}</p>
                  </div>
                </div>

                {/* MUA Side */}
                <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E1E7F0]">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B] font-poppins block mb-1">
                    Mitra Penyedia Jasa (MUA)
                  </span>
                  <div className="font-bold text-[#172033] text-sm font-poppins">
                    {selectedBookingModal.muaName}
                  </div>
                  <div className="text-[#64748B] mt-1 space-y-0.5 text-xs">
                    <p className="font-mono text-[11px]">ID MUA: #{selectedBookingModal.muaId}</p>
                    <p className="text-[#4778C7] font-medium">Terverifikasi Resmi GLAMÉA</p>
                  </div>
                </div>
              </div>

              {/* Service & Venue Information */}
              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E1E7F0] space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-semibold uppercase text-[#64748B]">
                      Paket Rias & Kategori
                    </span>
                    <h4 className="text-sm font-bold text-[#172033] mt-0.5 font-poppins">
                      {selectedBookingModal.serviceName}
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EFF6FF] text-[#2563EB]">
                    {selectedBookingModal.occasion}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#E1E7F0]/80">
                  <div>
                    <span className="text-[11px] text-[#64748B] block">Jadwal Acara</span>
                    <span className="font-semibold text-[#172033] mt-0.5 block">
                      {new Date(selectedBookingModal.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} • {selectedBookingModal.time} WIB
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#64748B] block">Jumlah Orang Dirias</span>
                    <span className="font-semibold text-[#172033] mt-0.5 block">
                      {selectedBookingModal.numberOfPeople} Orang
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E1E7F0]/80">
                  <span className="text-[11px] text-[#64748B] block">Alamat / Venue Pelaksanaan</span>
                  <p className="font-medium text-[#172033] mt-0.5 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#4778C7] shrink-0 mt-0.5" />
                    <span>{selectedBookingModal.location}</span>
                  </p>
                </div>

                {selectedBookingModal.notes && (
                  <div className="pt-2 border-t border-[#E1E7F0]/80">
                    <span className="text-[11px] text-[#64748B] block">Catatan Khusus Klien</span>
                    <p className="italic text-[#172033] mt-0.5 bg-white p-2.5 rounded-lg border border-[#E1E7F0]">
                      "{selectedBookingModal.notes}"
                    </p>
                  </div>
                )}
              </div>

              {/* Financial & Escrow Breakdown */}
              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E1E7F0] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#64748B] uppercase">
                    Rincian Pembayaran & Proteksi Escrow
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                    Lunas • {selectedBookingModal.paymentMethod}
                  </span>
                </div>

                <div className="space-y-1 pt-1 text-xs">
                  <div className="flex justify-between text-[#64748B]">
                    <span>Biaya Layanan / Paket:</span>
                    <span>{formatRupiah(selectedBookingModal.subtotal)}</span>
                  </div>
                  {selectedBookingModal.discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Voucher Promo Diskon:</span>
                      <span>-{formatRupiah(selectedBookingModal.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#172033] font-bold text-sm pt-1.5 border-t border-[#E1E7F0]">
                    <span>Total Bersih:</span>
                    <span className="text-[#4778C7]">{formatRupiah(selectedBookingModal.total)}</span>
                  </div>
                </div>

                <div className="mt-2 p-2.5 bg-[#EFF6FF]/70 rounded-lg border border-[#BFDBFE] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#1E40AF]">
                    <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                    <span className="font-medium">Status Dana Rekening Bersama:</span>
                  </div>
                  <strong className="text-[#1E40AF]">
                    {selectedBookingModal.fundStatus === 'Held' ? 'Tertahan Aman (Escrow)' : selectedBookingModal.fundStatus === 'PendingPayout' ? 'Siap Dicairkan ke MUA' : selectedBookingModal.fundStatus === 'PaidOut' ? 'Sudah Ditransfer ke MUA' : 'Dana Dikembalikan ke Klien'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Modal Footer with Admin Overrides */}
            <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E1E7F0] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {selectedBookingModal.bookingStatus === 'Pending' && (
                  <button
                    onClick={() => updateBookingStatus(selectedBookingModal.id, 'Confirmed')}
                    className="px-3.5 py-1.5 bg-[#4778C7] hover:bg-[#3565AE] text-white rounded-xl text-xs font-semibold font-poppins transition-colors"
                  >
                    Setujui Reservasi
                  </button>
                )}
                {selectedBookingModal.bookingStatus === 'Confirmed' && (
                  <button
                    onClick={() => updateBookingStatus(selectedBookingModal.id, 'Completed', 'PendingPayout')}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold font-poppins transition-colors"
                  >
                    Tandai Selesai Rias
                  </button>
                )}
                {selectedBookingModal.fundStatus === 'PendingPayout' && (
                  <button
                    onClick={() => updateBookingStatus(selectedBookingModal.id, 'Completed', 'PaidOut')}
                    className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold font-poppins transition-colors"
                  >
                    Cairkan Dana ke MUA
                  </button>
                )}
              </div>

              <button
                onClick={() => setSelectedBookingModal(null)}
                className="px-4 py-1.5 bg-white border border-[#E1E7F0] hover:bg-[#F1F5F9] text-[#172033] rounded-xl text-xs font-semibold font-poppins transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
