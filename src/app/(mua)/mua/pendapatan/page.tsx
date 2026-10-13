"use client";

import React, { useState, useMemo } from 'react';
import {
  Wallet,
  Landmark,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  Download,
  Search,
  Filter,
  X,
  CreditCard,
  AlertCircle,
  Building2,
  ChevronRight,
  Receipt,
  Sparkles,
  Info,
  ExternalLink
} from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { mockMuas } from '@/data/mock-muas';

interface TransactionRecord {
  id: string;
  bookingRef: string;
  clientName: string;
  serviceName: string;
  completedDate: string;
  grossAmount: number;
  platformFee: number;
  netAmount: number;
  status: 'READY' | 'PROCESSING' | 'COMPLETED' | 'HELD';
  payoutDate?: string;
  destinationBank?: string;
}

const initialTransactions: TransactionRecord[] = [
  {
    id: 'TRX-2026-104',
    bookingRef: 'booking-3',
    clientName: 'Farah Nabila',
    serviceName: 'Paket Baralek Gadang Premium',
    completedDate: '4 Okt 2026',
    grossAmount: 1500000,
    platformFee: 0,
    netAmount: 1500000,
    status: 'READY',
  },
  {
    id: 'TRX-2026-098',
    bookingRef: 'booking-1',
    clientName: 'Nadia Safitri',
    serviceName: 'Paket Wisuda & Sumpah Dokter',
    completedDate: '1 Okt 2026',
    grossAmount: 250000,
    platformFee: 0,
    netAmount: 250000,
    status: 'HELD', // Escrow ditahan karena booking berlangsung
  },
  {
    id: 'TRX-2026-072',
    bookingRef: 'booking-091',
    clientName: 'Putri Rahmadani',
    serviceName: 'Paket Lamaran & Tunangan Elegan',
    completedDate: '24 Sep 2026',
    grossAmount: 1200000,
    platformFee: 0,
    netAmount: 1200000,
    status: 'COMPLETED',
    payoutDate: '25 Sep 2026',
    destinationBank: 'BCA (1234••••890)'
  },
  {
    id: 'TRX-2026-065',
    bookingRef: 'booking-084',
    clientName: 'Zaskia Maharani',
    serviceName: 'Paket Baralek Gadang Lengkap',
    completedDate: '18 Sep 2026',
    grossAmount: 1800000,
    platformFee: 0,
    netAmount: 1800000,
    status: 'COMPLETED',
    payoutDate: '19 Sep 2026',
    destinationBank: 'BCA (1234••••890)'
  },
];

type FilterTab = 'ALL' | 'READY' | 'COMPLETED' | 'HELD';

export default function MuaPendapatanPage() {
  const muaId = 'mua-1';
  const mua = mockMuas.find(m => m.id === muaId) || mockMuas[0];

  // Bank Account State
  const [bankAccount, setBankAccount] = useState({
    bankName: mua.bankAccount?.bankName || 'BCA',
    accountNumber: mua.bankAccount?.accountNumber || '1234567890',
    accountHolder: mua.bankAccount?.accountHolder || 'Alya Putri'
  });

  // Financial Ledger State
  const [transactions, setTransactions] = useState<TransactionRecord[]>(initialTransactions);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Feedback
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isEditBankModalOpen, setIsEditBankModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<TransactionRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State: Withdraw
  const [withdrawAmount, setWithdrawAmount] = useState<string>('1500000');

  // Form State: Edit Bank
  const [bankForm, setBankForm] = useState(bankAccount);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Dynamic Metrics Calculation
  const saldoSiapCair = transactions
    .filter(t => t.status === 'READY')
    .reduce((sum, t) => sum + t.netAmount, 0);

  const danaEscrowDitahan = transactions
    .filter(t => t.status === 'HELD')
    .reduce((sum, t) => sum + t.netAmount, 0);

  const sedangDiprosesBank = transactions
    .filter(t => t.status === 'PROCESSING')
    .reduce((sum, t) => sum + t.netAmount, 0);

  const totalSelesaiDicairkan = transactions
    .filter(t => t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.netAmount, 0);

  const totalAkumulasiBersih = saldoSiapCair + danaEscrowDitahan + sedangDiprosesBank + totalSelesaiDicairkan;

  // Filtered Ledger
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (activeFilter !== 'ALL' && t.status !== activeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchClient = t.clientName.toLowerCase().includes(q);
        const matchRef = t.bookingRef.toLowerCase().includes(q);
        const matchService = t.serviceName.toLowerCase().includes(q);
        const matchId = t.id.toLowerCase().includes(q);
        if (!matchClient && !matchRef && !matchService && !matchId) return false;
      }
      return true;
    });
  }, [transactions, activeFilter, searchQuery]);

  // Handle Withdraw Submission
  const handleConfirmWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(withdrawAmount.replace(/\D/g, ''), 10) || 0;

    if (amountNum <= 0) {
      alert('Masukkan nominal penarikan yang valid');
      return;
    }

    if (amountNum > saldoSiapCair) {
      alert(`Nominal melebihi saldo siap cair (${formatRupiah(saldoSiapCair)})`);
      return;
    }

    // Ubah status transaksi siap cair menjadi PROCESSING
    let remainingToDeduct = amountNum;
    const updatedTransactions = transactions.map(t => {
      if (t.status === 'READY' && remainingToDeduct > 0) {
        if (t.netAmount <= remainingToDeduct) {
          remainingToDeduct -= t.netAmount;
          return {
            ...t,
            status: 'PROCESSING' as const,
            destinationBank: `${bankAccount.bankName} (${bankAccount.accountNumber.slice(0, 4)}••••${bankAccount.accountNumber.slice(-3)})`
          };
        }
      }
      return t;
    });

    setTransactions(updatedTransactions);
    setIsWithdrawModalOpen(false);
    triggerToast(`Pengajuan pencairan ${formatRupiah(amountNum)} berhasil dikirim ke bank.`);
  };

  // Handle Edit Bank Submission
  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankForm.accountNumber || !bankForm.accountHolder) {
      alert('Mohon lengkapi nomor dan nama pemilik rekening');
      return;
    }
    setBankAccount(bankForm);
    setIsEditBankModalOpen(false);
    triggerToast(`Rekening pencairan berhasil diperbarui ke ${bankForm.bankName}.`);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">

      {/* 1. Header Section & Action Bar */}
      <div className="bg-white rounded-2xl border border-[#EDE3D9] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#641A2B] tracking-tight">
              Pendapatan & Rekening Pencairan
            </h1>

            <p className="text-sm text-[#7A6E6A] max-w-2xl font-light leading-relaxed">
              Pantau arus kas riasan, saldo yang siap dicairkan, dan histori transfer ke rekening bank studio Anda dengan sistem perlindungan rekening bersama (Escrow).
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap font-poppins">
            <button
              onClick={() => {
                alert('Laporan keuangan periode berjalan berhasil diekspor.');
              }}
              className="px-4 py-2.5 rounded-xl border border-[#EDE3D9] text-[#641A2B] bg-[#FAF6F0]/60 hover:bg-[#FAF6F0] text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5 opacity-70" />
              <span>Unduh Rekap Laporan</span>
            </button>

            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              disabled={saldoSiapCair <= 0}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shadow-xs ${saldoSiapCair > 0
                  ? 'bg-[#641A2B] hover:bg-[#4E1220] text-white cursor-pointer'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
            >
              <Wallet className="w-4 h-4 text-[#C9A45C]" />
              <span>+ Tarik Saldo Sekarang</span>
            </button>
          </div>

        </div>

        {/* 2. Four Prestigious Financial Cards (High Contrast & Balanced) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#F5EFEB]">

          {/* Card 1: Saldo Siap Dicairkan (Primary Highlight) */}
          <div className="rounded-2xl p-5 bg-linear-to-br from-[#FAF6F0] to-[#F5ECE0] border border-[#C9A45C]/60 shadow-xs relative overflow-hidden flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold font-poppins text-[#641A2B]">Saldo Siap Dicairkan</span>
              <span className="text-[10px] font-bold font-poppins px-2 py-0.5 rounded-full bg-[#641A2B]/10 text-[#641A2B]">
                Bisa Ditarik
              </span>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-poppins font-bold text-[#641A2B]">
                {formatRupiah(saldoSiapCair)}
              </h3>
              <p className="text-[11px] text-[#7A6E6A] mt-1 font-light">
                Dari sesi riasan yang telah selesai & terkonfirmasi.
              </p>
            </div>
          </div>

          {/* Card 2: Dana Ditahan (Escrow) */}
          <div className="rounded-2xl p-5 bg-white border border-[#EDE3D9] shadow-xs flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold font-poppins text-[#7A6E6A]">Dana Ditahan (Escrow)</span>
              <span className="text-[10px] font-bold font-poppins px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
                Menunggu Selesai
              </span>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-poppins font-bold text-[#292321]">
                {formatRupiah(danaEscrowDitahan)}
              </h3>
              <p className="text-[11px] text-[#7A6E6A] mt-1 font-light">
                Otomatis cair begitu layanan selesai dikerjakan.
              </p>
            </div>
          </div>

          {/* Card 3: Sedang Diproses Bank */}
          <div className="rounded-2xl p-5 bg-white border border-[#EDE3D9] shadow-xs flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold font-poppins text-[#7A6E6A]">Sedang Diproses Bank</span>
              <span className="text-[10px] font-bold font-poppins px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                Kliring 1x24 Jam
              </span>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-poppins font-bold text-[#292321]">
                {formatRupiah(sedangDiprosesBank)}
              </h3>
              <p className="text-[11px] text-[#7A6E6A] mt-1 font-light">
                Menunggu konfirmasi transfer sistem perbankan.
              </p>
            </div>
          </div>

          {/* Card 4: Total Akumulasi Bersih */}
          <div className="rounded-2xl p-5 bg-white border border-[#EDE3D9] shadow-xs flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold font-poppins text-[#7A6E6A]">Total Penghasilan Bersih</span>
              <span className="text-[10px] font-bold font-poppins px-2 py-0.5 rounded-full bg-[#FAF6F0] text-[#641A2B] border border-[#EDE3D9]">
                All-Time
              </span>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-poppins font-bold text-[#641A2B]">
                {formatRupiah(totalAkumulasiBersih)}
              </h3>
              <p className="text-[11px] text-[#7A6E6A] mt-1 font-light">
                Total bruto bersih seluruh pesanan studio.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-[#FAF4EB] border border-[#C9A45C] text-[#641A2B] px-4 py-3 rounded-xl flex items-center justify-between text-sm shadow-xs animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#C9A45C] shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-[#7A6E6A] hover:text-[#641A2B]">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. Bespoke GLAMÉA Escrow Protection Strip (Replaces the generic blue box) */}
      <div className="bg-[#FAF4EB] border border-[#C9A45C]/50 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#641A2B] text-[#C9A45C] flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-poppins font-bold text-[#641A2B] text-sm">
              Perlindungan Escrow & Jaminan Pembayaran GLAMÉA
            </h4>
            <p className="text-xs text-[#7A6E6A] leading-relaxed font-light max-w-3xl">
              Pembayaran klien diamankan di rekening penampungan resmi GLAMÉA hingga hari-H. Dana otomatis berpindah ke <strong className="font-semibold text-[#641A2B]">Saldo Siap Dicairkan</strong> begitu sesi makeup selesai tanpa potongan biaya admin penarikan.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto font-poppins">
          <span className="text-[11px] font-semibold text-[#641A2B] bg-white border border-[#EDE3D9] px-3 py-1 rounded-full shadow-2xs">
            0% Biaya Penarikan Bank
          </span>
          <span className="text-[11px] font-semibold text-[#641A2B] bg-white border border-[#EDE3D9] px-3 py-1 rounded-full shadow-2xs">
            Proses Maks. 1x24 Jam
          </span>
        </div>
      </div>

      {/* 4. Main Two-Column Layout (Ledger on Left 7, Bank & Terms on Right 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column (7 Cols): Buku Kas & Riwayat Transaksi */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#EDE3D9] p-6 shadow-xs space-y-6">

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-poppins font-bold text-lg sm:text-xl text-[#292321]">
                Riwayat Transaksi & Pencairan
              </h2>
              <p className="text-xs text-[#7A6E6A] mt-0.5">
                Histori komisi dan mutasi pencairan dana studio Anda.
              </p>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-52">
              <Search className="w-3.5 h-3.5 text-[#7A6E6A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari ID, klien..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-[#EDE3D9] text-xs text-[#292321] placeholder:text-[#A8A29E] focus:outline-hidden focus:border-[#641A2B] focus:ring-1 focus:ring-[#641A2B]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar font-poppins">
            {(
              [
                { key: 'ALL', label: 'Semua Transaksi', count: transactions.length },
                { key: 'READY', label: 'Siap Dicairkan', count: transactions.filter(t => t.status === 'READY').length },
                { key: 'COMPLETED', label: 'Selesai Ditransfer', count: transactions.filter(t => t.status === 'COMPLETED').length },
                { key: 'HELD', label: 'Escrow Ditahan', count: transactions.filter(t => t.status === 'HELD').length }
              ] as const
            ).map(tab => {
              const isActive = activeFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${isActive
                      ? 'bg-[#641A2B] text-white shadow-xs'
                      : 'bg-white border border-[#EDE3D9] text-[#7A6E6A] hover:bg-[#FAF6F0]'
                    }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-[#FAF6F0] text-[#7A6E6A]'
                    }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Transactions List */}
          <div className="divide-y divide-[#F5EFEB] border-t border-[#F5EFEB]">
            {filteredTransactions.length === 0 ? (
              <div className="py-12 text-center text-[#7A6E6A] space-y-2">
                <Receipt className="w-8 h-8 mx-auto text-[#EDE3D9]" />
                <p className="text-xs">Tidak ada riwayat transaksi yang cocok dengan filter.</p>
              </div>
            ) : (
              filteredTransactions.map(item => {
                const isReady = item.status === 'READY';
                const isCompleted = item.status === 'COMPLETED';
                const isProcessing = item.status === 'PROCESSING';
                const isHeld = item.status === 'HELD';

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedReceipt(item)}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF6F0]/60 p-2.5 rounded-xl transition-colors cursor-pointer group"
                  >
                    {/* Left: ID & Service */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#641A2B]">
                          {item.id}
                        </span>
                        <span className="text-[11px] text-[#7A6E6A]">
                          Ref: {item.bookingRef}
                        </span>
                      </div>

                      <div className="font-medium text-sm text-[#292321] group-hover:text-[#641A2B] transition-colors">
                        {item.clientName} — <span className="text-[#7A6E6A] font-light">{item.serviceName}</span>
                      </div>

                      <div className="text-[11px] text-[#A8A29E]">
                        Selesai: {item.completedDate}
                      </div>
                    </div>

                    {/* Right: Amount & Status Badge */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 shrink-0">
                      <span className="font-poppins font-bold text-base text-[#641A2B]">
                        {formatRupiah(item.netAmount)}
                      </span>

                      {/* Status Badges */}
                      {isReady && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-poppins bg-amber-50 text-amber-800 border border-amber-200">
                          Siap Dicairkan
                        </span>
                      )}
                      {isCompleted && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-poppins bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Selesai Ditransfer
                        </span>
                      )}
                      {isProcessing && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-poppins bg-blue-50 text-blue-800 border border-blue-200">
                          Diproses Bank
                        </span>
                      )}
                      {isHeld && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-poppins bg-slate-100 text-slate-700 border border-slate-200">
                          Escrow Ditahan
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right Column (5 Cols): Rekening Pencairan & Ketentuan */}
        <div className="lg:col-span-5 space-y-6">

          {/* Bespoke Debit Card Component */}
          <div className="bg-linear-to-br from-[#641A2B] via-[#4E1220] to-[#2B0A12] text-white rounded-2xl p-6 shadow-md border border-[#85273C] relative overflow-hidden space-y-6">

            {/* Background Decorative Pattern */}
            <div className="absolute right-0 top-0 w-44 h-44 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-10 -bottom-10 w-44 h-44 bg-[#C9A45C]/10 rounded-full blur-2xl pointer-events-none" />

            {/* Card Header */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-[#C9A45C]" />
                <span className="font-poppins font-bold tracking-wider text-sm text-[#FAF6F0]">
                  GLAMÉA PAYOUT CARD
                </span>
              </div>
              <span className="text-[10px] font-semibold font-poppins uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/15 border border-white/20 text-[#FAF6F0]">
                Akun Terverifikasi
              </span>
            </div>

            {/* Chip & Bank Logo */}
            <div className="flex items-center justify-between relative z-10">
              <div className="w-10 h-7 rounded-md bg-[#C9A45C]/80 border border-white/30 flex items-center justify-center">
                <div className="w-6 h-4 border border-black/30 rounded-xs" />
              </div>
              <span className="font-poppins font-bold text-lg text-white tracking-widest">
                {bankAccount.bankName}
              </span>
            </div>

            {/* Account Number */}
            <div className="relative z-10">
              <span className="text-[10px] text-white/60 block uppercase tracking-wider">
                Nomor Rekening Tujuan
              </span>
              <p className="font-mono text-xl sm:text-2xl font-semibold tracking-widest text-[#FAF6F0] mt-0.5">
                {bankAccount.accountNumber}
              </p>
            </div>

            {/* Card Holder & Edit Action */}
            <div className="flex items-end justify-between pt-2 border-t border-white/10 relative z-10">
              <div>
                <span className="text-[10px] text-white/60 block uppercase tracking-wider">
                  Nama Pemilik Rekening
                </span>
                <p className="font-semibold font-poppins text-sm text-white uppercase tracking-wider mt-0.5">
                  {bankAccount.accountHolder}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setBankForm(bankAccount);
                  setIsEditBankModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs text-white font-semibold font-poppins transition-colors"
              >
                Ubah Rekening
              </button>
            </div>

          </div>

          {/* Jadwal & Kebijakan Transfer Otomatis */}
          <div className="bg-white rounded-2xl border border-[#EDE3D9] p-6 shadow-xs space-y-4">
            <h3 className="font-poppins font-bold text-base text-[#292321] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C9A45C]" />
              Ketentuan Pencairan Dana
            </h3>

            <div className="space-y-3 text-xs text-[#7A6E6A] font-light leading-relaxed">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#641A2B] shrink-0 mt-0.5" />
                <p>
                  <strong className="text-[#292321] font-semibold">Tarik Kapan Saja:</strong> Saldo yang berstatus <span className="text-[#641A2B] font-medium">Siap Dicairkan</span> dapat ditarik manual tanpa batas minimal jam kerja.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#641A2B] shrink-0 mt-0.5" />
                <p>
                  <strong className="text-[#292321] font-semibold">Waktu Proses Transfer:</strong> Dana akan masuk ke rekening Anda maksimal 1x24 jam (hari kerja perbankan).
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#641A2B] shrink-0 mt-0.5" />
                <p>
                  <strong className="text-[#292321] font-semibold">Gratis Biaya Admin:</strong> GLAMÉA menanggung 100% biaya transfer antarbank mitra MUA.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#F5EFEB]">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); alert('Panduan pencairan dana escrow MUA dibuka.'); }}
                className="text-xs text-[#641A2B] hover:text-[#4E1220] font-medium flex items-center gap-1 hover:underline"
              >
                <span>Pelajari Kebijakan Perlindungan Escrow Selengkapnya</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* 5. Modal: "+ Tarik Saldo Sekarang" */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#EDE3D9] shadow-2xl max-w-lg w-full overflow-hidden max-h-[92vh] flex flex-col my-auto animate-scale-up">

            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#641A2B] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#C9A45C]" />
                <h3 className="font-poppins font-bold text-base sm:text-lg text-white">Ajukan Pencairan Saldo</h3>
              </div>
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleConfirmWithdraw} className="p-6 space-y-5 overflow-y-auto">

              {/* Available Balance Box */}
              <div className="p-4 rounded-xl bg-[#FAF6F0] border border-[#EDE3D9] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#7A6E6A] block">Saldo Siap Dicairkan</span>
                  <span className="font-poppins font-bold text-xl text-[#641A2B]">
                    {formatRupiah(saldoSiapCair)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setWithdrawAmount(saldoSiapCair.toString())}
                  className="px-2.5 py-1 text-xs font-semibold font-poppins bg-white border border-[#EDE3D9] text-[#641A2B] rounded-lg hover:bg-[#FAF4EB]"
                >
                  Tarik Semua
                </button>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-xs font-semibold text-[#292321] mb-1.5">
                  Nominal Penarikan (Rp) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-serif font-bold text-sm text-[#7A6E6A]">
                    Rp
                  </span>
                  <input
                    type="number"
                    min={50000}
                    max={saldoSiapCair}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#EDE3D9] text-base font-semibold focus:outline-hidden focus:border-[#641A2B] focus:ring-1 focus:ring-[#641A2B]"
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {[500000, 1000000, 1500000].map(val => (
                    val <= saldoSiapCair && (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setWithdrawAmount(val.toString())}
                        className="text-xs px-2.5 py-1 rounded-lg border border-[#EDE3D9] bg-white text-[#7A6E6A] hover:text-[#641A2B] hover:border-[#641A2B]"
                      >
                        {formatRupiah(val)}
                      </button>
                    )
                  ))}
                </div>
              </div>

              {/* Destination Account Preview */}
              <div className="p-4 rounded-xl bg-white border border-[#EDE3D9] space-y-2">
                <span className="text-xs font-semibold text-[#7A6E6A] block">
                  Rekening Bank Tujuan Transfer
                </span>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#292321]">{bankAccount.bankName} — {bankAccount.accountNumber}</span>
                  <span className="text-[#7A6E6A]">a.n. {bankAccount.accountHolder}</span>
                </div>
              </div>

              {/* Summary Notes */}
              <div className="p-3.5 rounded-xl bg-[#FAF4EB] border border-[#C9A45C]/40 text-xs text-[#641A2B] space-y-1">
                <div className="flex items-center justify-between">
                  <span>Biaya Penarikan (Admin):</span>
                  <span className="font-bold text-emerald-700">Rp 0 (Gratis)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Estimasi Masuk Rekening:</span>
                  <span className="font-bold">Maks. 1x24 Jam Kerja</span>
                </div>
              </div>

              {/* Form Action */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#EDE3D9] font-poppins">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#7A6E6A] hover:bg-[#FAF6F0] transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#641A2B] text-white hover:bg-[#4E1220] transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <ArrowDownRight className="w-4 h-4 text-[#C9A45C]" />
                  <span>Konfirmasi Penarikan</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 6. Modal: "Ubah Rekening Bank" */}
      {isEditBankModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#EDE3D9] shadow-2xl max-w-lg w-full overflow-hidden max-h-[92vh] flex flex-col my-auto animate-scale-up">

            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#641A2B] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#C9A45C]" />
                <h3 className="font-poppins font-bold text-base sm:text-lg text-white">Ubah Rekening Bank Pencairan</h3>
              </div>
              <button
                onClick={() => setIsEditBankModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveBank} className="p-6 space-y-4 overflow-y-auto">

              <div>
                <label className="block text-xs font-semibold text-[#292321] mb-1">
                  Nama Bank <span className="text-red-500">*</span>
                </label>
                <select
                  value={bankForm.bankName}
                  onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE3D9] text-sm focus:outline-hidden focus:border-[#641A2B] focus:ring-1 focus:ring-[#641A2B] bg-white"
                >
                  <option value="BCA">BCA — Bank Central Asia</option>
                  <option value="Mandiri">Bank Mandiri</option>
                  <option value="BNI">BNI — Bank Negara Indonesia</option>
                  <option value="BRI">BRI — Bank Rakyat Indonesia</option>
                  <option value="Bank Nagari">Bank Nagari (Sumatera Barat)</option>
                  <option value="BSI">BSI — Bank Syariah Indonesia</option>
                  <option value="CIMB Niaga">CIMB Niaga</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#292321] mb-1">
                  Nomor Rekening <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 1234567890"
                  value={bankForm.accountNumber}
                  onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE3D9] text-sm font-mono focus:outline-hidden focus:border-[#641A2B] focus:ring-1 focus:ring-[#641A2B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#292321] mb-1">
                  Nama Pemilik Rekening (Sesuai Buku Tabungan / KTP) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Alya Putri"
                  value={bankForm.accountHolder}
                  onChange={(e) => setBankForm({ ...bankForm, accountHolder: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE3D9] text-sm focus:outline-hidden focus:border-[#641A2B] focus:ring-1 focus:ring-[#641A2B]"
                />
                <p className="text-[11px] text-[#7A6E6A] mt-1">
                  Pastikan nama pemilik rekening sesuai dengan nama penanggung jawab studio untuk mencegah kegagalan transfer.
                </p>
              </div>

              {/* Form Action */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#EDE3D9] font-poppins">
                <button
                  type="button"
                  onClick={() => setIsEditBankModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#7A6E6A] hover:bg-[#FAF6F0] transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#641A2B] text-white hover:bg-[#4E1220] transition-colors shadow-sm"
                >
                  Simpan Rekening Baru
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 7. Modal: "Rincian Transaksi & Bukti Penerimaan" */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#EDE3D9] shadow-2xl max-w-md w-full overflow-hidden max-h-[92vh] flex flex-col my-auto animate-scale-up">

            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#641A2B] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#C9A45C]" />
                <h3 className="font-poppins font-bold text-base sm:text-lg text-white">Rincian Transaksi Layanan</h3>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Content */}
            <div className="p-6 space-y-4 overflow-y-auto text-xs">

              <div className="p-4 rounded-xl bg-[#FAF6F0] border border-[#EDE3D9] text-center space-y-1">
                <span className="text-[#7A6E6A] font-poppins">Nominal Diterima Studio</span>
                <h3 className="font-poppins font-bold text-2xl text-[#641A2B]">
                  {formatRupiah(selectedReceipt.netAmount)}
                </h3>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white border border-[#EDE3D9] text-[#292321]">
                  Status: {selectedReceipt.status === 'READY' ? 'Siap Dicairkan' : selectedReceipt.status === 'COMPLETED' ? 'Selesai Ditransfer' : selectedReceipt.status === 'HELD' ? 'Escrow Ditahan' : 'Sedang Diproses'}
                </span>
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="flex justify-between py-1 border-b border-[#F5EFEB]">
                  <span className="text-[#7A6E6A]">ID Transaksi</span>
                  <span className="font-mono font-bold text-[#292321]">{selectedReceipt.id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F5EFEB]">
                  <span className="text-[#7A6E6A]">ID Booking</span>
                  <span className="font-mono text-[#292321]">{selectedReceipt.bookingRef}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F5EFEB]">
                  <span className="text-[#7A6E6A]">Nama Klien</span>
                  <span className="font-medium text-[#292321]">{selectedReceipt.clientName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F5EFEB]">
                  <span className="text-[#7A6E6A]">Layanan Rias</span>
                  <span className="text-[#292321] font-medium">{selectedReceipt.serviceName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F5EFEB]">
                  <span className="text-[#7A6E6A]">Tanggal Selesai</span>
                  <span className="text-[#292321]">{selectedReceipt.completedDate}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F5EFEB]">
                  <span className="text-[#7A6E6A]">Biaya Bruto Layanan</span>
                  <span className="font-medium text-[#292321]">{formatRupiah(selectedReceipt.grossAmount)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F5EFEB]">
                  <span className="text-[#7A6E6A]">Potongan Platform GLAMÉA</span>
                  <span className="font-medium text-emerald-700">Rp 0 (Promo Mitra 0%)</span>
                </div>
                {selectedReceipt.destinationBank && (
                  <div className="flex justify-between py-1 border-b border-[#F5EFEB]">
                    <span className="text-[#7A6E6A]">Rekening Tujuan</span>
                    <span className="text-[#292321]">{selectedReceipt.destinationBank}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 font-poppins">
                <button
                  type="button"
                  onClick={() => setSelectedReceipt(null)}
                  className="w-full py-2.5 rounded-xl bg-[#FAF6F0] hover:bg-[#F5EFEB] text-[#641A2B] font-semibold border border-[#EDE3D9]"
                >
                  Tutup Rincian
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
