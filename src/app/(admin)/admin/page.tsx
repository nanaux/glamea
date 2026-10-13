"use client";
import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  Building2, 
  CalendarDays, 
  CreditCard, 
  ShieldCheck, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Calendar,
  Lock,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { mockBookings, mockPayments } from '@/data/mock-bookings';
import { mockMuas } from '@/data/mock-muas';
import { mockClients } from '@/data/mock-users';

export default function AdminDashboardPage() {
  const totalPelanggan = mockClients.length;
  const totalMua = mockMuas.length;
  const totalBooking = mockBookings.length;
  const totalTransaksi = mockPayments.length;
  
  const pembayaranMasuk = mockPayments
    .filter(p => p.status === 'Success')
    .reduce((acc, p) => acc + p.amount, 0);

  const danaEscrow = mockBookings
    .filter(b => b.fundStatus === 'Held' || b.fundStatus === 'PendingPayout')
    .reduce((acc, b) => acc + b.total, 0);

  const danaDicairkan = mockBookings
    .filter(b => b.fundStatus === 'PaidOut')
    .reduce((acc, b) => acc + b.total, 0);

  const estimasiFee = Math.round(pembayaranMasuk * 0.1);

  // Operational action queue counts
  const pendingPayoutCount = 1; // Payout-1 Alya Makeup
  const pendingPaymentApprovalCount = mockPayments.filter(p => p.status === 'Pending').length;
  const pendingBookingCount = mockBookings.filter(b => b.bookingStatus === 'Pending').length;

  // Helper maps for client & MUA readable names
  const getClientName = (id: string) => {
    const client = mockClients.find(c => c.id === id);
    return client ? client.name : id;
  };

  const getMuaName = (id: string) => {
    const mua = mockMuas.find(m => m.id === id);
    return mua ? mua.name : id;
  };

  return (
    <div className="space-y-6">
      {/* Executive Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#E1E7F0]/80">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#172033] tracking-tight font-serif">
            Dashboard Utama
          </h1>
          <p className="text-sm text-[#64748B] mt-1 font-sans">
            Pusat kendali operasional ekosistem, perputaran dana escrow, dan monitoring layanan tata rias di Kota Padang
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Gateway Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E1E7F0] rounded-full text-xs text-[#172033] shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium font-sans">Escrow Gateway:</span>
            <span className="text-emerald-700 font-semibold font-sans">Aktif & Normal</span>
          </div>

          {/* Period Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E1E7F0] rounded-full text-xs text-[#64748B] shadow-xs font-sans">
            <Calendar className="w-3.5 h-3.5 text-[#4778C7]" />
            <span>12 - 31 Okt 2026</span>
          </div>
        </div>
      </div>

      {/* 3 Focused Executive Metrics + Operational Action Center */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Metric 1: Total Perputaran Escrow */}
        <div className="bg-white border border-[#E1E7F0] rounded-2xl p-5 shadow-xs hover:-translate-y-[2px] transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider text-[#64748B] uppercase font-poppins">
              Saldo Escrow Terproteksi
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#4778C7] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold text-[#172033] tracking-tight font-poppins">
              {formatRupiah(danaEscrow)}
            </div>
            <div className="mt-2.5 flex items-center justify-between text-xs font-sans">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100 font-sans">
                3 Reservasi Tertahan
              </span>
              <span className="text-[#64748B] text-[11px] font-sans">Rekening Bersama</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Gross Merchandise Value */}
        <div className="bg-white border border-[#E1E7F0] rounded-2xl p-5 shadow-xs hover:-translate-y-[2px] transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider text-[#64748B] uppercase font-poppins">
              Total Inflow Terbayar
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#F0FDF4] text-emerald-600 flex items-center justify-center shrink-0">
              <CreditCard className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold text-[#172033] tracking-tight font-poppins">
              {formatRupiah(pembayaranMasuk)}
            </div>
            <div className="mt-2.5 flex items-center justify-between text-xs font-sans">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100 font-sans">
                Fee Platform: {formatRupiah(estimasiFee)}
              </span>
              <span className="text-[#64748B] text-[11px] font-sans">6 Transaksi Masuk</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Ekosistem Pengguna Kota Padang */}
        <div className="bg-white border border-[#E1E7F0] rounded-2xl p-5 shadow-xs hover:-translate-y-[2px] transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider text-[#64748B] uppercase font-poppins">
              Ekosistem Kota Padang
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#F5F3FF] text-[#8B5CF6] flex items-center justify-center shrink-0">
              <Users className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold text-[#172033] tracking-tight font-poppins">
              {totalMua} MUA • {totalPelanggan} Klien
            </div>
            <div className="mt-2.5 flex items-center justify-between text-xs font-sans">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-100 font-sans">
                100% Terverifikasi
              </span>
              <span className="text-[#64748B] text-[11px] font-sans">{totalBooking} Reservasi</span>
            </div>
          </div>
        </div>

        {/* Metric 4 / Action Center: Antrean Tindakan Operasional */}
        <div className="bg-[#172033] text-white rounded-2xl p-5 shadow-xs flex flex-col justify-between border border-[#172033]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wider text-[#94A3B8] uppercase font-poppins">
                Antrean Aksi Admin
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EF4444] text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                {pendingPayoutCount + pendingPaymentApprovalCount + pendingBookingCount} Perlu Ditinjau
              </span>
            </div>

            <div className="mt-2.5 space-y-1.5 text-xs font-sans">
              <Link 
                href="/admin/pencairan" 
                className="flex items-center justify-between py-1 px-2 rounded-lg bg-white/10 hover:bg-white/15 transition-colors text-white"
              >
                <span className="truncate">1 Payout MUA Siap Transfer</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
              </Link>
              <Link 
                href="/admin/pembayaran" 
                className="flex items-center justify-between py-1 px-2 rounded-lg bg-white/10 hover:bg-white/15 transition-colors text-white"
              >
                <span className="truncate">1 Bukti Bayar Butuh Audit</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
              </Link>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-[#94A3B8] font-sans">
            <span>Audit harian admin</span>
            <Link href="/admin/booking" className="text-[#60A5FA] hover:underline font-medium">
              Audit Booking &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Middle Section: Clean Two-Column Layout (Zero Nested Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Fintech Escrow & Perputaran Dana Widget (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E1E7F0] rounded-2xl shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E1E7F0]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#4778C7] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#172033] font-poppins">
                    Perputaran Dana & Escrow
                  </h2>
                  <p className="text-xs text-[#64748B] font-sans">
                    Rekonsiliasi dana masuk, saldo tertahan di escrow, & dana dicairkan ke MUA
                  </p>
                </div>
              </div>

              <Link 
                href="/admin/pencairan" 
                className="text-xs font-semibold text-[#4778C7] hover:text-[#3565AE] flex items-center gap-1 transition-colors font-poppins shrink-0 self-start sm:self-auto"
              >
                <span>Kelola Pencairan</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Segmented Distribution Bar */}
            <div className="mt-6">
              <div className="flex justify-between items-center text-xs font-sans mb-2">
                <span className="font-medium text-[#172033]">Distribusi Saldo Transaksi</span>
                <span className="text-[#64748B]">Total Terbayar: <strong className="text-[#172033] font-sans">{formatRupiah(pembayaranMasuk)}</strong></span>
              </div>

              <div className="w-full h-3 rounded-full bg-[#F1F5F9] overflow-hidden flex shadow-inner">
                <div 
                  className="bg-[#10B981] h-full transition-all duration-500" 
                  style={{ width: `${(danaDicairkan / pembayaranMasuk) * 100}%` }}
                  title={`Dicairkan ke MUA: ${formatRupiah(danaDicairkan)}`}
                />
                <div 
                  className="bg-[#3B82F6] h-full transition-all duration-500" 
                  style={{ width: `${(danaEscrow / pembayaranMasuk) * 100}%` }}
                  title={`Dana Tertahan Escrow: ${formatRupiah(danaEscrow)}`}
                />
              </div>

              {/* Bar Legend */}
              <div className="flex flex-wrap items-center gap-4 mt-2.5 text-xs font-sans">
                <div className="flex items-center gap-1.5 text-[#64748B]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shrink-0"></span>
                  <span>Tuntas Dicairkan ({Math.round((danaDicairkan / pembayaranMasuk) * 100)}%)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#64748B]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] shrink-0"></span>
                  <span>Tertahan di Escrow ({Math.round((danaEscrow / pembayaranMasuk) * 100)}%)</span>
                </div>
              </div>
            </div>

            {/* 3 Metric Breakdown Columns (Clean Divider Grid, NOT nested cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#E1E7F0]">
              <div className="sm:border-r sm:border-[#E1E7F0] sm:pr-4">
                <p className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider font-poppins">
                  Dana Masuk (GMV)
                </p>
                <p className="text-lg font-bold text-[#172033] mt-1 font-poppins">
                  {formatRupiah(pembayaranMasuk)}
                </p>
                <p className="text-[11px] text-[#10B981] mt-0.5 font-sans font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  6 transaksi lunas
                </p>
              </div>

              <div className="sm:border-r sm:border-[#E1E7F0] sm:pr-4">
                <p className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider font-poppins">
                  Dana Tertahan Escrow
                </p>
                <p className="text-lg font-bold text-[#2563EB] mt-1 font-poppins">
                  {formatRupiah(danaEscrow)}
                </p>
                <p className="text-[11px] text-[#64748B] mt-0.5 font-sans">
                  Aman sampai rias tuntas
                </p>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider font-poppins">
                  Fee Platform (10%)
                </p>
                <p className="text-lg font-bold text-[#4778C7] mt-1 font-poppins">
                  {formatRupiah(estimasiFee)}
                </p>
                <p className="text-[11px] text-[#64748B] mt-0.5 font-sans">
                  Proyeksi revenue bersih
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Escrow Security Assurance Strip */}
          <div className="mt-6 pt-4 border-t border-[#E1E7F0] flex items-center justify-between text-xs text-[#64748B] font-sans">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-[#4778C7] shrink-0" />
              <span>Sistem Escrow GLAMÉA menjamin dana aman hingga sesi rias disetujui pelanggan.</span>
            </div>
            <span className="hidden sm:inline-block font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-sans">
              Tervalidasi
            </span>
          </div>
        </div>

        {/* Right Column: Clean Activity Timeline Feed (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E1E7F0] rounded-2xl shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#E1E7F0]">
              <div>
                <h2 className="text-base font-bold text-[#172033] font-poppins">
                  Aktivitas Platform Terbaru
                </h2>
                <p className="text-xs text-[#64748B] font-sans">
                  3 transaksi & reservasi teranyar
                </p>
              </div>
              <span className="text-[11px] font-medium text-[#4778C7] bg-[#EFF6FF] px-2.5 py-1 rounded-full font-sans">
                Real-Time
              </span>
            </div>

            {/* Clean, Non-Cluttered List (3 Items Saja) */}
            <div className="divide-y divide-[#F1F5F9] mt-1">
              {mockBookings.slice(0, 3).map((booking) => {
                const clientName = getClientName(booking.clientId);
                const muaName = getMuaName(booking.muaId);
                const isCompleted = booking.bookingStatus === 'Completed';
                const isPending = booking.bookingStatus === 'Pending';

                return (
                  <div key={booking.id} className="py-4 first:pt-3.5 last:pb-2 transition-colors hover:bg-[#F8FAFC]/80 px-2 -mx-2 rounded-xl">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1 font-sans">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#172033] truncate">
                            {booking.occasion}
                          </span>
                          <span className="text-[10px] text-[#94A3B8] font-mono">
                            #{booking.id}
                          </span>
                        </div>

                        <p className="text-xs text-[#64748B] mt-1 truncate">
                          <span className="font-medium text-[#172033]">{clientName}</span>
                          <span className="text-[#94A3B8] mx-1.5">&rarr;</span>
                          <span className="text-[#4778C7] font-medium">{muaName}</span>
                        </p>

                        <div className="flex items-center gap-1.5 text-[11px] text-[#94A3B8] mt-1.5 truncate">
                          <MapPin className="w-3 h-3 text-[#94A3B8] shrink-0" />
                          <span className="truncate">{booking.location}</span>
                        </div>
                      </div>

                      {/* Right side: Status Badge + Amount */}
                      <div className="text-right shrink-0 flex flex-col items-end justify-between font-sans">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isCompleted
                            ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                            : isPending
                            ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        }`}>
                          {booking.bookingStatus === 'Confirmed' ? 'Dikonfirmasi' : booking.bookingStatus === 'Pending' ? 'Menunggu' : 'Selesai'}
                        </span>
                        <span className="text-xs font-bold text-[#172033] mt-3 font-mono">
                          {formatRupiah(booking.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#E1E7F0]">
            <Link 
              id="btn-view-all-bookings"
              href="/admin/booking" 
              className="w-full py-2.5 px-3 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E1E7F0] text-xs font-semibold text-[#172033] hover:text-[#4778C7] flex items-center justify-center gap-1.5 transition-colors font-poppins"
            >
              <span>Lihat Seluruh Riwayat Pemesanan</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#64748B]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Section: Agenda Operasional Booking Rias Terdekat (Kota Padang) */}
      <div className="bg-white border border-[#E1E7F0] rounded-2xl shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E1E7F0]">
          <div>
            <h2 className="text-base font-bold text-[#172033] font-poppins">
              Agenda Sesi Rias Terdekat (Kota Padang)
            </h2>
            <p className="text-xs text-[#64748B] font-sans">
              Monitoring jadwal acara, lokasi di Padang, dan kesiapan mitra MUA secara langsung
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#64748B] font-sans">Total: <strong className="text-[#172033]">{mockBookings.length} Sesi Terjadwal</strong></span>
          </div>
        </div>

        {/* Clean Structured Table */}
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="border-b border-[#E1E7F0] text-[#64748B]">
                <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px] font-poppins">ID & Acara</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px] font-poppins">Pelanggan</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px] font-poppins">Mitra MUA</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px] font-poppins">Jadwal Pelaksanaan</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px] font-poppins">Lokasi Venue</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px] font-poppins">Nilai Transaksi</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px] font-poppins">Status Dana</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1E7F0]">
              {mockBookings.map((b) => (
                <tr key={b.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3.5 px-3">
                    <span className="font-semibold text-[#172033] font-mono text-xs">#{b.id}</span>
                    <span className="block text-[11px] text-[#64748B]">{b.occasion}</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-medium text-[#172033]">{getClientName(b.clientId)}</span>
                    <span className="block text-[10px] text-[#94A3B8]">{b.numberOfPeople} orang</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-medium text-[#172033]">{getMuaName(b.muaId)}</span>
                    <span className="block text-[10px] text-[#4778C7]">Terverifikasi</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-medium text-[#172033]">
                      {new Date(b.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="text-[11px] text-[#64748B] flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-[#94A3B8]" />
                      {b.time} WIB
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-[#172033] font-medium max-w-[180px] truncate block" title={b.location}>
                      {b.location}
                    </span>
                    <span className="text-[10px] text-[#94A3B8]">Kota Padang</span>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-[#172033]">
                    {formatRupiah(b.total)}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                      b.fundStatus === 'Held'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        : b.fundStatus === 'PendingPayout'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                        : b.fundStatus === 'PaidOut'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        : 'bg-slate-50 text-slate-700 border border-slate-200/60'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {b.fundStatus === 'Held' 
                        ? 'Tertahan di Escrow' 
                        : b.fundStatus === 'PendingPayout' 
                        ? 'Siap Dicairkan ke MUA' 
                        : b.fundStatus === 'PaidOut' 
                        ? 'Tuntas Dicairkan' 
                        : 'Menunggu Pembayaran'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
