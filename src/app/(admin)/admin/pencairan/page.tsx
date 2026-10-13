"use client";
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  ArrowUpRight, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Eye, 
  Copy, 
  Check, 
  X, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Receipt,
  FileCheck2,
  Printer,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  Send,
  UserCheck
} from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { PayoutStatus } from '@/types';

interface ExtendedPayout {
  id: string;
  bookingId: string;
  muaId: string;
  muaName: string;
  serviceName: string;
  clientName: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  status: PayoutStatus;
  processedAt?: string;
  transferRef?: string;
  failureReason?: string;
  createdAt: string;
}

const initialPayouts: ExtendedPayout[] = [
  {
    id: 'payout-1',
    bookingId: 'booking-3',
    muaId: 'mua-1',
    muaName: 'Alya Makeup',
    serviceName: 'Wedding Makeup & Hairdo',
    clientName: 'Siti Aminah',
    amount: 1500000,
    bankName: 'BCA',
    accountNumber: '1234567890',
    accountHolder: 'Alya Putri',
    status: 'Menunggu Pencairan',
    createdAt: '2026-10-12T09:00:00Z',
  },
  {
    id: 'payout-2',
    bookingId: 'booking-4',
    muaId: 'mua-2',
    muaName: 'Nadira Beauty',
    serviceName: 'Baralek Minang Tradisional',
    clientName: 'Rina Permatasari',
    amount: 1800000,
    bankName: 'Bank Nagari',
    accountNumber: '2100021009841',
    accountHolder: 'Nadira Maharani',
    status: 'Diproses',
    createdAt: '2026-10-12T11:30:00Z',
    transferRef: 'NAGARI-LLG-8829104',
  },
  {
    id: 'payout-3',
    bookingId: 'booking-6',
    muaId: 'mua-4',
    muaName: 'Bella Makeupart',
    serviceName: 'Editorial Photoshoot',
    clientName: 'Siti Aminah',
    amount: 350000,
    bankName: 'Bank Mandiri',
    accountNumber: '1110099882233',
    accountHolder: 'Bella Maharani',
    status: 'Menunggu Pencairan',
    createdAt: '2026-10-12T16:00:00Z',
  },
  {
    id: 'payout-5',
    bookingId: 'booking-1',
    muaId: 'mua-1',
    muaName: 'Alya Makeup',
    serviceName: 'Party / Graduation Makeup',
    clientName: 'Siti Aminah',
    amount: 225000,
    bankName: 'BCA',
    accountNumber: '1234567890',
    accountHolder: 'Alya Putri',
    status: 'Dicairkan',
    createdAt: '2026-10-12T15:00:00Z',
    processedAt: '2026-10-12T16:15:00Z',
    transferRef: 'BCA-TRF-1029481',
  },
  {
    id: 'payout-6',
    bookingId: 'booking-2',
    muaId: 'mua-1',
    muaName: 'Alya Makeup',
    serviceName: 'Engagement Flawless Look',
    clientName: 'Rina Permatasari',
    amount: 500000,
    bankName: 'BCA',
    accountNumber: '1234567890',
    accountHolder: 'Alya Putri',
    status: 'Menunggu Pencairan',
    createdAt: '2026-10-12T17:00:00Z',
  }
];

export default function AdminPencairanPage() {
  const [payouts, setPayouts] = useState<ExtendedPayout[]>(initialPayouts);
  const [selectedStatusTab, setSelectedStatusTab] = useState<'ALL' | PayoutStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [bankFilter, setBankFilter] = useState('ALL');
  const [selectedPayoutModal, setSelectedPayoutModal] = useState<ExtendedPayout | null>(null);
  const [transferRefInput, setTransferRefInput] = useState('');
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

  // Status transitions
  const updatePayoutStatus = (id: string, newStatus: PayoutStatus, customRef?: string) => {
    const nowIso = new Date().toISOString();
    setPayouts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: newStatus,
          transferRef: customRef || p.transferRef || `TRF-${p.bankName.toUpperCase()}-${Date.now().toString().slice(-6)}`,
          processedAt: newStatus === 'Dicairkan' ? nowIso : p.processedAt
        };
      }
      return p;
    }));

    if (newStatus === 'Diproses') {
      showToast(`Payout #${id} dialihkan ke antrean transfer bank (Sedang Diproses).`);
    } else if (newStatus === 'Dicairkan') {
      showToast(`Payout #${id} sukses ditandai Dicairkan ke rekening mitra!`);
    } else if (newStatus === 'Gagal Dicairkan') {
      showToast(`Payout #${id} ditolak / diminta perbaikan rekening.`);
    }

    // Sync modal if open
    if (selectedPayoutModal && selectedPayoutModal.id === id) {
      setSelectedPayoutModal(prev => prev ? ({
        ...prev,
        status: newStatus,
        transferRef: customRef || prev.transferRef || `TRF-${prev.bankName.toUpperCase()}-${Date.now().toString().slice(-6)}`,
        processedAt: newStatus === 'Dicairkan' ? nowIso : prev.processedAt
      }) : null);
    }
  };

  // Distinct banks for filter
  const distinctBanks = useMemo(() => {
    const set = new Set<string>();
    initialPayouts.forEach(p => set.add(p.bankName));
    return Array.from(set);
  }, []);

  // Filtered dataset
  const filteredPayouts = useMemo(() => {
    return payouts.filter(p => {
      // Tab filter
      if (selectedStatusTab !== 'ALL' && p.status !== selectedStatusTab) return false;

      // Bank filter
      if (bankFilter !== 'ALL' && p.bankName !== bankFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = p.id.toLowerCase().includes(q);
        const matchBooking = p.bookingId.toLowerCase().includes(q);
        const matchMua = p.muaName.toLowerCase().includes(q);
        const matchHolder = p.accountHolder.toLowerCase().includes(q);
        const matchAccNumber = p.accountNumber.includes(q);
        const matchBank = p.bankName.toLowerCase().includes(q);
        if (!matchId && !matchBooking && !matchMua && !matchHolder && !matchAccNumber && !matchBank) return false;
      }

      return true;
    });
  }, [payouts, selectedStatusTab, bankFilter, searchQuery]);

  // Aggregate Metrics
  const totalCount = payouts.length;
  const pendingPayouts = payouts.filter(p => p.status === 'Menunggu Pencairan');
  const processingPayouts = payouts.filter(p => p.status === 'Diproses');
  const completedPayouts = payouts.filter(p => p.status === 'Dicairkan');
  const failedPayouts = payouts.filter(p => p.status === 'Gagal Dicairkan');

  const pendingAmount = pendingPayouts.reduce((acc, curr) => acc + curr.amount, 0);
  const completedAmount = completedPayouts.reduce((acc, curr) => acc + curr.amount, 0);
  const activeQueueCount = pendingPayouts.length + processingPayouts.length;

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
              Manajemen Pencairan Dana MUA (Payouts)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#4778C7] border border-[#BFDBFE]">
              {totalCount} Permintaan Payout
            </span>
          </div>
          <p className="text-sm text-[#64748B] mt-1 font-sans">
            Otorisasi dan audit penyaluran dana escrow ke rekening bank resmi mitra MUA GLAMÉA di Padang
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl text-xs text-[#1E40AF] font-sans">
            <span className="w-2 h-2 rounded-full bg-[#4778C7] animate-pulse"></span>
            <span className="font-medium">SLA Transfer: Sameday Max 1x24 Jam</span>
          </div>

          <button 
            onClick={() => showToast('Rekapitulasi payout bank MUA berhasil diunduh (Excel format)')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#E1E7F0] rounded-xl text-xs font-semibold text-[#172033] hover:bg-[#F8FAFC] transition-colors shadow-xs font-poppins"
          >
            <Download className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Unduh Rekap Payout</span>
          </button>
        </div>
      </div>

      {/* Actionable Urgent Alert Banner for Pending Payouts (Only when pending payouts exist) */}
      {pendingPayouts.length > 0 && (
        <div className="bg-[#FFFBEB] border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#92400E] font-poppins">
                {pendingPayouts.length} Antrean Pencairan Dana Menunggu Transfer Bank (Total {formatRupiah(pendingAmount)})
              </div>
              <p className="text-xs text-amber-800/80 font-sans mt-0.5">
                Segera lakukan transfer via Bank/Internet Banking dan masukkan nomor referensi mutasi transfer.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (pendingPayouts[0]) {
                setSelectedPayoutModal(pendingPayouts[0]);
                setTransferRefInput('');
              }
            }}
            className="self-start sm:self-auto shrink-0 inline-flex items-center gap-2 px-3.5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs font-poppins"
          >
            <span>Proses Antrean Teratas</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

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
                onClick={() => setSelectedStatusTab('Menunggu Pencairan')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  selectedStatusTab === 'Menunggu Pencairan'
                    ? 'bg-white text-[#172033] shadow-xs'
                    : 'text-[#64748B] hover:text-[#172033]'
                }`}
              >
                Menunggu ({pendingPayouts.length})
              </button>
              <button
                onClick={() => setSelectedStatusTab('Diproses')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  selectedStatusTab === 'Diproses'
                    ? 'bg-white text-[#172033] shadow-xs'
                    : 'text-[#64748B] hover:text-[#172033]'
                }`}
              >
                Diproses ({processingPayouts.length})
              </button>
              <button
                onClick={() => setSelectedStatusTab('Dicairkan')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  selectedStatusTab === 'Dicairkan'
                    ? 'bg-white text-[#172033] shadow-xs'
                    : 'text-[#64748B] hover:text-[#172033]'
                }`}
              >
                Dicairkan ({completedPayouts.length})
              </button>
              <button
                onClick={() => setSelectedStatusTab('Gagal Dicairkan')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  selectedStatusTab === 'Gagal Dicairkan'
                    ? 'bg-white text-[#172033] shadow-xs'
                    : 'text-[#64748B] hover:text-[#172033]'
                }`}
              >
                Perlu Perbaikan ({failedPayouts.length})
              </button>
            </div>

            <div className="text-xs text-[#64748B] font-sans">
              Menampilkan <strong className="text-[#172033] font-medium">{filteredPayouts.length}</strong> dari {payouts.length} pengajuan payout
            </div>
          </div>

          {/* Search Bar & Dropdown Selects */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-8 relative">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari ID payout, ref booking, nama MUA, nama pemilik, atau nomor rekening..."
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

            {/* Bank Filter Dropdown */}
            <div className="sm:col-span-4">
              <select
                value={bankFilter}
                onChange={(e) => setBankFilter(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E1E7F0] focus:border-[#4778C7] focus:bg-white rounded-xl text-xs text-[#172033] focus:outline-hidden transition-colors font-sans"
              >
                <option value="ALL">Semua Bank Tujuan</option>
                {distinctBanks.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Flat Structured Table (Zero Nested Cards) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans min-w-[880px]">
            <thead>
              <tr className="border-b border-[#E1E7F0] bg-[#F8FAFC]/60 text-[#64748B]">
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px] font-poppins w-[120px]">ID Payout</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px] font-poppins w-[120px]">Ref Booking</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px] font-poppins w-[150px]">Mitra MUA Penerima</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px] font-poppins w-[180px]">Rekening Bank Tujuan</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px] font-poppins w-[130px]">Jumlah Transfer</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px] font-poppins w-[130px]">Status Payout</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px] text-right font-poppins w-[120px] whitespace-nowrap">Aksi Transfer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1E7F0]">
              {filteredPayouts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#64748B] font-sans">
                    <p className="text-sm font-medium text-[#172033]">Tidak ada data pencairan yang sesuai</p>
                    <p className="text-xs mt-1 text-[#94A3B8]">Coba sesuaikan kata kunci pencarian atau ubah filter tab.</p>
                  </td>
                </tr>
              ) : (
                filteredPayouts.map((p) => {
                  const createdDateFormatted = new Date(p.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  });

                  return (
                    <tr key={p.id} className="hover:bg-[#F8FAFC] transition-colors group">
                      
                      {/* ID Payout */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyToClipboard(p.id, 'ID Payout')}
                            className="font-mono font-semibold text-[#172033] hover:text-[#4778C7] transition-colors text-xs flex items-center gap-1 whitespace-nowrap"
                            title="Salin ID Payout"
                          >
                            <span>#{p.id}</span>
                            {copiedText === p.id ? (
                              <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                            ) : (
                              <Copy className="w-3 h-3 text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                            )}
                          </button>
                        </div>
                        <div className="text-[11px] text-[#64748B] mt-0.5 whitespace-nowrap">
                          {createdDateFormatted}
                        </div>
                      </td>

                      {/* Booking Ref */}
                      <td className="py-3.5 px-3">
                        <span className="font-mono text-xs font-medium text-[#4778C7] bg-[#EFF6FF] px-2 py-0.5 rounded-md border border-[#BFDBFE]">
                          #{p.bookingId}
                        </span>
                        <div className="text-[10px] text-[#94A3B8] mt-1 truncate max-w-[125px]" title={p.serviceName}>
                          {p.serviceName}
                        </div>
                      </td>

                      {/* MUA Mitra */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#EFF6FF] text-[#4778C7] border border-[#BFDBFE] flex items-center justify-center font-bold text-[10px]">
                            {p.muaName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-semibold text-[#172033] font-poppins text-xs block">
                              {p.muaName}
                            </span>
                            <span className="text-[10px] text-emerald-600 font-medium">
                              Terverifikasi GLAMÉA
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Bank Details */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5 font-semibold text-[#172033]">
                          <Building2 className="w-3.5 h-3.5 text-[#4778C7]" />
                          <span>{p.bankName}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <button
                            onClick={() => copyToClipboard(p.accountNumber, 'No. Rekening')}
                            className="font-mono text-xs text-[#172033] hover:text-[#4778C7] bg-[#F1F5F9] px-1.5 py-0.5 rounded transition-colors flex items-center gap-1"
                            title="Salin No. Rekening Bank"
                          >
                            <span>{p.accountNumber}</span>
                            {copiedText === p.accountNumber ? (
                              <Check className="w-2.5 h-2.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-2.5 h-2.5 text-[#94A3B8]" />
                            )}
                          </button>
                        </div>
                        <span className="text-[11px] text-[#64748B] block mt-0.5 font-medium">
                          a.n. {p.accountHolder}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="font-bold text-[#172033] text-xs font-sans">
                          {formatRupiah(p.amount)}
                        </div>
                        <span className="text-[10px] text-emerald-600 block">
                          Net Disbursed
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        {p.status === 'Menunggu Pencairan' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Menunggu Transfer
                          </span>
                        ) : p.status === 'Diproses' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                            <RefreshCw className="w-3 h-3 text-blue-600 animate-spin" />
                            Sedang Diproses
                          </span>
                        ) : p.status === 'Dicairkan' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Selesai Dicairkan
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            Perlu Perbaikan
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {p.status === 'Menunggu Pencairan' && (
                            <button
                              id={`btn-action-${p.id}`}
                              onClick={() => {
                                setSelectedPayoutModal(p);
                                setTransferRefInput(p.transferRef || `TRF-${p.bankName.toUpperCase()}-${Date.now().toString().slice(-6)}`);
                              }}
                              className="px-2.5 py-1 bg-[#4778C7] hover:bg-[#3565AE] text-white rounded-lg text-xs font-semibold font-poppins transition-colors shadow-xs"
                            >
                              Proses Bank
                            </button>
                          )}
                          {p.status === 'Diproses' && (
                            <button
                              id={`btn-action-${p.id}`}
                              onClick={() => updatePayoutStatus(p.id, 'Dicairkan')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold font-poppins transition-colors shadow-xs flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              <span>Selesai</span>
                            </button>
                          )}
                          <button
                            id={`btn-detail-${p.id}`}
                            onClick={() => {
                              setSelectedPayoutModal(p);
                              setTransferRefInput(p.transferRef || `TRF-${p.bankName.toUpperCase()}-${Date.now().toString().slice(-6)}`);
                            }}
                            className="p-1 text-[#64748B] hover:text-[#172033] hover:bg-[#F1F5F9] border border-[#E1E7F0] rounded-lg transition-colors"
                            title="Rincian & Audit Payout"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
          <span>Sistem rekonsiliasi pengeluaran dana escrow rekening bersama GLAMÉA</span>
          <div className="flex items-center gap-2">
            <span className="text-[11px]">Kliring Antarbank: Normal (RTGS/BI-FAST)</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </div>
        </div>
      </div>

      {/* Payout Audit & Transfer Modal */}
      {selectedPayoutModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E1E7F0] rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-up">
            
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-[#E1E7F0] flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#4778C7] flex items-center justify-center font-bold text-xs">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#172033] font-poppins">
                    Audit & Eksekusi Payout #{selectedPayoutModal.id}
                  </h3>
                  <p className="text-[11px] text-[#64748B] font-mono">
                    Ref Pemesanan: #{selectedPayoutModal.bookingId}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPayoutModal(null)}
                className="w-7 h-7 rounded-lg text-[#94A3B8] hover:text-[#172033] hover:bg-[#F1F5F9] flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs font-sans max-h-[75vh] overflow-y-auto">
              
              {/* Transfer Destination Card */}
              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E1E7F0] space-y-2.5">
                <span className="text-[10px] font-semibold tracking-wider text-[#64748B] uppercase font-poppins block">
                  Informasi Rekening Bank Tujuan
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Bank Mitra:</span>
                  <strong className="text-[#172033] font-semibold text-sm">{selectedPayoutModal.bankName}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Nomor Rekening:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-sm font-bold text-[#172033] bg-white px-2 py-0.5 rounded border border-[#E1E7F0]">
                      {selectedPayoutModal.accountNumber}
                    </span>
                    <button
                      onClick={() => copyToClipboard(selectedPayoutModal.accountNumber, 'Nomor Rekening')}
                      className="p-1 hover:bg-[#EFF6FF] text-[#4778C7] rounded transition-colors"
                      title="Salin No Rekening"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Nama Pemilik Rekening:</span>
                  <strong className="text-[#172033] font-medium">{selectedPayoutModal.accountHolder}</strong>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[#E1E7F0]">
                  <span className="text-[#64748B]">Nama Mitra MUA:</span>
                  <span className="font-semibold text-[#4778C7]">{selectedPayoutModal.muaName}</span>
                </div>
              </div>

              {/* Amount Box */}
              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/60 text-center space-y-1">
                <span className="text-[10px] font-semibold text-emerald-800 uppercase font-poppins">
                  Nominal Bersih yang Harus Ditransfer
                </span>
                <div className="text-2xl font-bold text-emerald-950 font-poppins">
                  {formatRupiah(selectedPayoutModal.amount)}
                </div>
                <span className="text-[10px] text-emerald-700 block">
                  Bebas Biaya Platform • Full Disbursed ke Mitra
                </span>
              </div>

              {/* Transfer Reference Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-[#172033] block">
                  Nomor Referensi Transfer Bank (Bank Ref ID):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={transferRefInput}
                    onChange={(e) => setTransferRefInput(e.target.value)}
                    placeholder="Contoh: NAGARI-LLG-8829104 atau BCA-11029384"
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E1E7F0] focus:border-[#4778C7] focus:bg-white rounded-xl text-xs font-mono text-[#172033] focus:outline-hidden transition-colors"
                  />
                </div>
                <p className="text-[10px] text-[#64748B]">
                  Nomor referensi bukti transfer dari KlikBCA Bisnis, Nagari Portal, atau m-Banking GLAMÉA.
                </p>
              </div>

              {/* Service Info */}
              <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E1E7F0] text-xs space-y-1">
                <span className="text-[10px] text-[#64748B] block font-semibold uppercase">Layanan Selesai:</span>
                <p className="font-semibold text-[#172033]">{selectedPayoutModal.serviceName}</p>
                <p className="text-[11px] text-[#64748B]">Klien: {selectedPayoutModal.clientName}</p>
              </div>

              {/* Failure notice if failed */}
              {selectedPayoutModal.failureReason && (
                <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-rose-800 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Catatan Kendala Rekening:</span>
                  </div>
                  <p className="text-rose-700 text-[11px] leading-relaxed">
                    {selectedPayoutModal.failureReason}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E1E7F0] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {selectedPayoutModal.status === 'Menunggu Pencairan' && (
                  <button
                    onClick={() => updatePayoutStatus(selectedPayoutModal.id, 'Diproses', transferRefInput)}
                    className="px-3.5 py-1.5 bg-[#4778C7] hover:bg-[#3565AE] text-white rounded-xl text-xs font-semibold font-poppins transition-colors"
                  >
                    Mulai Proses Transfer
                  </button>
                )}

                {(selectedPayoutModal.status === 'Menunggu Pencairan' || selectedPayoutModal.status === 'Diproses') && (
                  <button
                    onClick={() => updatePayoutStatus(selectedPayoutModal.id, 'Dicairkan', transferRefInput)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold font-poppins transition-colors flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Tandai Berhasil Dicairkan</span>
                  </button>
                )}

                {selectedPayoutModal.status === 'Dicairkan' && (
                  <button
                    onClick={() => showToast(`Kwitansi payout resmi #${selectedPayoutModal.id} dikirim ke antrean cetak.`)}
                    className="px-3 py-1.5 bg-white border border-[#E1E7F0] hover:bg-[#F1F5F9] text-[#172033] rounded-xl text-xs font-semibold font-poppins transition-colors flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>Cetak Bukti Payout</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => setSelectedPayoutModal(null)}
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
