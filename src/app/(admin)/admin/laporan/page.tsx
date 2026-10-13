"use client";
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Download, 
  Printer, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Building2, 
  CreditCard, 
  ShieldCheck, 
  TrendingUp, 
  Eye, 
  Copy, 
  Check, 
  X, 
  ChevronRight, 
  Calendar, 
  ExternalLink, 
  AlertCircle,
  FileCheck2,
  FolderDown,
  Layers
} from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { mockMuas } from '@/data/mock-muas';
import { mockBookings, mockPayments, mockPayouts } from '@/data/mock-bookings';

// Interface untuk Dokumen Laporan Resmi
export interface OfficialReportDoc {
  id: string;
  docNumber: string;
  title: string;
  category: 'ESCROW' | 'REVENUE' | 'PAYOUT' | 'OPERATIONS';
  categoryLabel: string;
  description: string;
  period: string;
  generatedAt: string; // 12 Oktober 2026
  status: 'FINAL' | 'RECONCILED';
  keyMetricLabel: string;
  keyMetricValue: string;
  totalRecords: number;
  tableHeaders: string[];
  tableRows: { code: string; label: string; debit?: number; credit?: number; notes: string }[];
}

// Interface untuk Rekapitulasi Mitra MUA
export interface MuaFinancialSummary {
  muaId: string;
  muaName: string;
  district: string;
  bankName: string;
  totalBookings: number;
  grossGmv: number;
  platformFee: number;
  payoutDisbursed: number;
  escrowHeld: number;
  reconciliationStatus: 'TERKONSILIASI' | 'PROSES_PENCAIRAN';
}

const mockReportDocuments: OfficialReportDoc[] = [
  {
    id: 'REP-001',
    docNumber: 'GLM/FIN-ESC/2026/10-01',
    title: 'Laporan Rekonsiliasi Escrow & Mutasi Bank Rekanan',
    category: 'ESCROW',
    categoryLabel: 'Rekonsiliasi Escrow',
    description: 'Dokumentasi kepatuhan dana titipan klien yang ditampung dalam escrow vault BI-FAST & Virtual Account.',
    period: 'Oktober 2026',
    generatedAt: '12 Oktober 2026, 21:56 WIB',
    status: 'RECONCILED',
    keyMetricLabel: 'Saldo Escrow Aktif',
    keyMetricValue: 'Rp 3.225.000',
    totalRecords: 7,
    tableHeaders: ['Pos Pembukuan', 'Deskripsi Mutasi', 'Nominal (Rp)', 'Status Verifikasi'],
    tableRows: [
      { code: 'ESC-IN-01', label: 'Inflow Escrow BOOK-001 (Siti Aminah)', debit: 1500000, notes: 'Lunas - Held in Vault' },
      { code: 'ESC-IN-02', label: 'Inflow Escrow BOOK-002 (Rina Permatasari)', debit: 500000, notes: 'Lunas - Held in Vault' },
      { code: 'ESC-IN-03', label: 'Inflow Escrow BOOK-003 (Dinda Maharani)', debit: 1500000, notes: 'Lunas - Held in Vault' },
      { code: 'ESC-IN-04', label: 'Inflow Escrow BOOK-004 (Tiara Andini)', debit: 850000, notes: 'Lunas - Held in Vault' },
      { code: 'ESC-IN-05', label: 'Inflow Escrow BOOK-005 (Maya Putri)', debit: 750000, notes: 'Lunas - Selesai Layanan' },
      { code: 'ESC-IN-07', label: 'Inflow Escrow BOOK-007 (Annisa Zahra)', debit: 2200000, notes: 'Lunas - Payout Disetujui' },
    ]
  },
  {
    id: 'REP-002',
    docNumber: 'GLM/FIN-REV/2026/10-02',
    title: 'Laporan Pendapatan Platform & Komisi 2% GLAMÉA',
    category: 'REVENUE',
    categoryLabel: 'Pendapatan Komisi',
    description: 'Akumulasi pemotongan biaya administrasi platform resmi 2% dari seluruh transaksi pemesanan selesai.',
    period: 'Oktober 2026',
    generatedAt: '12 Oktober 2026, 21:56 WIB',
    status: 'FINAL',
    keyMetricLabel: 'Pendapatan Platform Bersih',
    keyMetricValue: 'Rp 179.500',
    totalRecords: 7,
    tableHeaders: ['Kode Transaksi', 'Mitra Penerima', 'Nilai Bruto (GMV)', 'Fee 2% GLAMÉA', 'Status'],
    tableRows: [
      { code: 'TRX-001', label: 'Alya Makeup (Baralek Wedding)', debit: 1500000, credit: 30000, notes: 'Terkumpul di Escrow' },
      { code: 'TRX-002', label: 'Nadira Beauty (Wisuda UNAND)', debit: 500000, credit: 10000, notes: 'Terkumpul di Escrow' },
      { code: 'TRX-003', label: 'Alya Makeup (Wedding Hairdo)', debit: 1500000, credit: 30000, notes: 'Proses Payout' },
      { code: 'TRX-004', label: 'Bella Makeupart (Bridal Syari)', debit: 850000, credit: 17000, notes: 'Terkumpul di Escrow' },
      { code: 'TRX-005', label: 'Citra MUA (Prewedding Natural)', debit: 750000, credit: 15000, notes: 'Selesai Dicairkan' },
      { code: 'TRX-007', label: 'Viona Bridal (Grand Royal)', debit: 2200000, credit: 44000, notes: 'Selesai Dicairkan' },
    ]
  },
  {
    id: 'REP-003',
    docNumber: 'GLM/FIN-PAY/2026/10-03',
    title: 'Laporan Penyaluran Dana & Payout Mitra MUA',
    category: 'PAYOUT',
    categoryLabel: 'Penyaluran Payout',
    description: 'Rekapitulasi pencairan dana escrow pasca-layanan ke rekening bank mitra MUA Kota Padang.',
    period: 'Oktober 2026',
    generatedAt: '12 Oktober 2026, 21:56 WIB',
    status: 'RECONCILED',
    keyMetricLabel: 'Total Dana Disalurkan',
    keyMetricValue: 'Rp 6.784.000',
    totalRecords: 6,
    tableHeaders: ['ID Pencairan', 'Mitra Penerima', 'Bank Tujuan', 'Net Disalurkan (Rp)', 'Status Kliring'],
    tableRows: [
      { code: 'WD-001', label: 'Alya Makeup (Alya Putri)', debit: 1764000, notes: 'BCA • Menunggu Approval' },
      { code: 'WD-002', label: 'Nadira Beauty (Nadira Maharani)', debit: 1764000, notes: 'Bank Nagari • Diproses BI-FAST' },
      { code: 'WD-003', label: 'Viona Bridal (Viona Anggraini)', debit: 2156000, notes: 'Mandiri • Berhasil Dicairkan' },
      { code: 'WD-004', label: 'Citra MUA (Citra Lestari)', debit: 735000, notes: 'BNI • Berhasil Dicairkan' },
    ]
  },
  {
    id: 'REP-004',
    docNumber: 'GLM/OPS-RES/2026/10-04',
    title: 'Laporan Kepatuhan & Performa Reservasi Layanan',
    category: 'OPERATIONS',
    categoryLabel: 'Kepatuhan Operasi',
    description: 'Catatan pemenuhan jadwal rias, mitigasi pembatalan, dan transparansi rating kepuasan pelanggan.',
    period: 'Oktober 2026',
    generatedAt: '12 Oktober 2026, 21:56 WIB',
    status: 'FINAL',
    keyMetricLabel: 'Tingkat Kepatuhan Jadwal',
    keyMetricValue: '100% (On-Time)',
    totalRecords: 7,
    tableHeaders: ['ID Booking', 'Mitra MUA', 'Acara / Layanan', 'Tanggal Jadwal', 'Status Operasional'],
    tableRows: [
      { code: 'BOOK-001', label: 'Alya Makeup • Siti Aminah', notes: 'Baralek Wedding Traditional • 15 Okt 2026 (Confirmed)' },
      { code: 'BOOK-002', label: 'Nadira Beauty • Rina Permatasari', notes: 'Wisuda UNAND • 18 Okt 2026 (Confirmed)' },
      { code: 'BOOK-003', label: 'Alya Makeup • Dinda Maharani', notes: 'Wedding Glam • 12 Okt 2026 (Completed)' },
      { code: 'BOOK-004', label: 'Bella Makeupart • Tiara Andini', notes: 'Prewedding Outdoor • 20 Okt 2026 (Confirmed)' },
      { code: 'BOOK-005', label: 'Citra MUA • Maya Putri', notes: 'Graduation Makeup • 12 Okt 2026 (Completed)' },
      { code: 'BOOK-007', label: 'Viona Bridal • Annisa Zahra', notes: 'Grand Royal Wedding • 12 Okt 2026 (Completed)' },
    ]
  }
];

// Data Rekapitulasi per Mitra MUA di Kota Padang
const mockMuaSummaries: MuaFinancialSummary[] = [
  {
    muaId: 'mua-1',
    muaName: 'Alya Makeup',
    district: 'Kuranji',
    bankName: 'BCA (1234567890)',
    totalBookings: 2,
    grossGmv: 3000000,
    platformFee: 60000,
    payoutDisbursed: 1470000,
    escrowHeld: 1470000,
    reconciliationStatus: 'PROSES_PENCAIRAN'
  },
  {
    muaId: 'mua-2',
    muaName: 'Nadira Beauty',
    district: 'Padang Barat',
    bankName: 'Bank Nagari (2100021009841)',
    totalBookings: 1,
    grossGmv: 500000,
    platformFee: 10000,
    payoutDisbursed: 0,
    escrowHeld: 490000,
    reconciliationStatus: 'TERKONSILIASI'
  },
  {
    muaId: 'mua-3',
    muaName: 'Citra MUA',
    district: 'Padang Timur',
    bankName: 'BNI (1122334455)',
    totalBookings: 1,
    grossGmv: 750000,
    platformFee: 15000,
    payoutDisbursed: 735000,
    escrowHeld: 0,
    reconciliationStatus: 'TERKONSILIASI'
  },
  {
    muaId: 'mua-4',
    muaName: 'Bella Makeupart',
    district: 'Lubuk Begalung',
    bankName: 'BRI (9988776655)',
    totalBookings: 1,
    grossGmv: 850000,
    platformFee: 17000,
    payoutDisbursed: 0,
    escrowHeld: 833000,
    reconciliationStatus: 'TERKONSILIASI'
  },
  {
    muaId: 'mua-7',
    muaName: 'Viona Bridal',
    district: 'Padang Barat',
    bankName: 'Mandiri (1110099882233)',
    totalBookings: 1,
    grossGmv: 2200000,
    platformFee: 44000,
    payoutDisbursed: 2156000,
    escrowHeld: 0,
    reconciliationStatus: 'TERKONSILIASI'
  },
  {
    muaId: 'mua-5',
    muaName: 'Diva Beauty Studio',
    district: 'Pauh',
    bankName: 'BCA (5544332211)',
    totalBookings: 0,
    grossGmv: 0,
    platformFee: 0,
    payoutDisbursed: 0,
    escrowHeld: 0,
    reconciliationStatus: 'TERKONSILIASI'
  }
];

export default function AdminLaporanPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('Oktober 2026');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | OfficialReportDoc['category']>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewDoc, setPreviewDoc] = useState<OfficialReportDoc | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Filtered official documents
  const filteredDocs = useMemo(() => {
    return mockReportDocuments.filter(doc => {
      if (selectedCategory !== 'ALL' && doc.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = 
          doc.title.toLowerCase().includes(q) ||
          doc.docNumber.toLowerCase().includes(q) ||
          doc.description.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  // Filtered MUA summary
  const filteredMuaSummaries = useMemo(() => {
    if (!searchQuery.trim()) return mockMuaSummaries;
    const q = searchQuery.toLowerCase();
    return mockMuaSummaries.filter(m => 
      m.muaName.toLowerCase().includes(q) ||
      m.district.toLowerCase().includes(q) ||
      m.bankName.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Download CSV for single report
  const handleDownloadDocCSV = (doc: OfficialReportDoc) => {
    const csvRows: string[] = [
      `"DOKUMEN RESMI: ${doc.title}"`,
      `"NOMOR ARSIP: ${doc.docNumber}"`,
      `"PERIODE: ${doc.period}"`,
      `"TANGGAL TERBIT: ${doc.generatedAt}"`,
      `""`,
      doc.tableHeaders.map(h => `"${h}"`).join(','),
      ...doc.tableRows.map(row => {
        return [
          `"${row.code}"`,
          `"${row.label}"`,
          `"${row.debit || 0}"`,
          `"${row.credit || 0}"`,
          `"${row.notes.replace(/"/g, '""')}"`
        ].join(',');
      })
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${doc.id}_${doc.period.replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download All Consolidated CSV
  const handleDownloadConsolidatedCSV = () => {
    const csvRows: string[] = [
      `"REKAPITULASI LAPORAN KEUANGAN & OPERASIONAL GLAMÉA"`,
      `"PERIODE: ${selectedPeriod}"`,
      `"STATUS: 100% TERKONSILIASI"`,
      `""`,
      `"MITRA MUA","KECAMATAN","REKENING","TOTAL PESANAN","GMV BRUTO (RP)","KOMISI PLATFORM 2% (RP)","PAYOUT SELESAI (RP)","ESCROW TERTAHAN (RP)","STATUS"`,
      ...mockMuaSummaries.map(m => [
        `"${m.muaName}"`,
        `"${m.district}"`,
        `"${m.bankName}"`,
        `"${m.totalBookings}"`,
        `"${m.grossGmv}"`,
        `"${m.platformFee}"`,
        `"${m.payoutDisbursed}"`,
        `"${m.escrowHeld}"`,
        `"${m.reconciliationStatus}"`
      ].join(','))
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `GLAMEA_Laporan_Konsolidasi_${selectedPeriod.replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* ======================================================== */}
      {/* 1. EXECUTIVE REPORT HEADER (ZERO AI SLOP)                */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E1E7F0] pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-serif text-[#11182D]">
              Laporan Keuangan & Operasional
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#4778C7]/10 text-[#4778C7] border border-[#4778C7]/20">
              Periode {selectedPeriod}
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Dokumentasi kepatuhan finansial, mutasi escrow, dan rekapitulasi platform GLAMÉA.
          </p>
        </div>

        {/* Executive Actions & Period Selector */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Pembukuan */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-semibold shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Terkonsiliasi 100%</span>
          </div>

          {/* Period Selector */}
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={e => setSelectedPeriod(e.target.value)}
              className="bg-white border border-[#E1E7F0] text-xs font-semibold text-[#11182D] rounded-xl px-3 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-[#4778C7] shadow-xs cursor-pointer appearance-none font-poppins"
            >
              <option value="Oktober 2026">Oktober 2026</option>
              <option value="September 2026">September 2026</option>
              <option value="Agustus 2026">Agustus 2026</option>
            </select>
            <Calendar className="w-3.5 h-3.5 text-[#64748B] absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Download Consolidated CSV */}
          <button
            onClick={handleDownloadConsolidatedCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#11182D] hover:bg-[#1E293B] text-white rounded-xl text-xs font-semibold font-poppins transition-colors shadow-xs"
          >
            <FolderDown className="w-3.5 h-3.5" />
            <span>Unduh Rekap (CSV)</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. KATALOG DOKUMEN LAPORAN RESMI (4 BUKU LAPORAN)        */}
      {/* ======================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#4778C7]" />
            <h2 className="text-sm font-bold font-poppins text-[#11182D]">
              Buku Dokumen Laporan Resmi
            </h2>
            <span className="text-xs text-[#64748B]">• Siap Diaudit & Dicetak</span>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            {(['ALL', 'ESCROW', 'REVENUE', 'PAYOUT', 'OPERATIONS'] as const).map(cat => {
              const labelMap = {
                ALL: 'Semua Dokumen',
                ESCROW: 'Escrow',
                REVENUE: 'Pendapatan',
                PAYOUT: 'Payout',
                OPERATIONS: 'Operasional'
              };
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-[#11182D] text-white shadow-xs'
                      : 'bg-white text-[#64748B] hover:text-[#11182D] border border-[#E1E7F0]'
                  }`}
                >
                  {labelMap[cat]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid 4 Dokumen Laporan (Flat Layout, Bebas AI Slop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map(doc => {
            return (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-[#E1E7F0] p-4.5 hover:border-[#4778C7]/50 transition-all shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#F1F5F9] text-[#11182D] border border-[#E1E7F0]">
                      {doc.docNumber}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                      {doc.status === 'RECONCILED' ? 'Terkonsiliasi' : 'Final'}
                    </span>
                  </div>

                  <h3 className="font-poppins font-bold text-sm text-[#11182D] mt-2">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed line-clamp-2">
                    {doc.description}
                  </p>
                </div>

                {/* Key Metric Indicator */}
                <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#94A3B8] uppercase block font-medium">
                      {doc.keyMetricLabel}
                    </span>
                    <span className="text-sm font-bold font-mono text-[#11182D]">
                      {doc.keyMetricValue}
                    </span>
                  </div>

                  {/* Actions: View Document & Download CSV */}
                  <div className="flex items-center gap-2">
                    <button
                      id={`btn-download-doc-${doc.id}`}
                      onClick={() => handleDownloadDocCSV(doc)}
                      title="Unduh format CSV"
                      className="p-1.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#11182D] border border-[#E1E7F0] rounded-xl transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id={`btn-open-doc-${doc.id}`}
                      onClick={() => setPreviewDoc(doc)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#11182D] hover:bg-[#1E293B] text-white rounded-xl text-xs font-semibold font-poppins transition-colors shadow-xs cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Buka Dokumen</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. REKAPITULASI FINANSIAL MITRA MUA (HIGH DENSITY LEDGER) */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl border border-[#E1E7F0] overflow-hidden shadow-xs space-y-0">
        <div className="p-4 border-b border-[#E1E7F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#4778C7]" />
              <h2 className="text-sm font-bold font-poppins text-[#11182D]">
                Rekapitulasi Finansial per Mitra MUA
              </h2>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Rincian komisi platform 2%, penyaluran pencairan, dan saldo escrow tertampung.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Cari studio MUA, kecamatan..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#E1E7F0] text-xs text-[#11182D] rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4778C7] placeholder:text-[#94A3B8]"
            />
            <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-[#94A3B8] hover:text-[#11182D]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* High-Density Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E1E7F0] text-[11px] font-semibold text-[#64748B] uppercase tracking-wider font-poppins">
                <th className="py-3 px-4">Mitra Studio MUA</th>
                <th className="py-3 px-4">Rekening Bank</th>
                <th className="py-3 px-4 text-center">Pesanan</th>
                <th className="py-3 px-4 text-right">GMV Bruto</th>
                <th className="py-3 px-4 text-right">Fee GLAMÉA (2%)</th>
                <th className="py-3 px-4 text-right">Payout Dicairkan</th>
                <th className="py-3 px-4 text-right">Escrow Held</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1E7F0] text-xs font-sans">
              {filteredMuaSummaries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#64748B]">
                    Tidak ada mitra MUA yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredMuaSummaries.map(mua => {
                  return (
                    <tr key={mua.muaId} className="hover:bg-[#F8FAFC]/80 transition-colors">
                      {/* Mitra Studio MUA */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-[#11182D] text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {mua.muaName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-semibold text-[#11182D] block">
                              {mua.muaName}
                            </span>
                            <span className="text-[10px] text-[#64748B] block">
                              Kecamatan {mua.district}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Rekening Bank */}
                      <td className="py-3 px-4 font-mono text-[11px] text-[#64748B]">
                        {mua.bankName}
                      </td>

                      {/* Total Booking */}
                      <td className="py-3 px-4 text-center font-semibold text-[#11182D]">
                        {mua.totalBookings}
                      </td>

                      {/* GMV Bruto */}
                      <td className="py-3 px-4 text-right font-mono font-semibold text-[#11182D]">
                        {formatRupiah(mua.grossGmv)}
                      </td>

                      {/* Fee GLAMÉA 2% */}
                      <td className="py-3 px-4 text-right font-mono font-medium text-[#4778C7]">
                        {formatRupiah(mua.platformFee)}
                      </td>

                      {/* Payout Dicairkan */}
                      <td className="py-3 px-4 text-right font-mono font-medium text-emerald-700">
                        {formatRupiah(mua.payoutDisbursed)}
                      </td>

                      {/* Escrow Held */}
                      <td className="py-3 px-4 text-right font-mono font-medium text-amber-700">
                        {formatRupiah(mua.escrowHeld)}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {mua.reconciliationStatus === 'TERKONSILIASI' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                            Terkonsiliasi
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            <Clock className="w-2.5 h-2.5 text-amber-600" />
                            Kliring Payout
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {/* Total Footer Row */}
            <tfoot className="bg-[#F8FAFC] border-t-2 border-[#E1E7F0] font-semibold text-xs text-[#11182D]">
              <tr>
                <td colSpan={2} className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">
                  Total Konsolidasi Finansial
                </td>
                <td className="py-3 px-4 text-center font-bold">
                  {mockMuaSummaries.reduce((acc, m) => acc + m.totalBookings, 0)}
                </td>
                <td className="py-3 px-4 text-right font-mono font-bold">
                  {formatRupiah(mockMuaSummaries.reduce((acc, m) => acc + m.grossGmv, 0))}
                </td>
                <td className="py-3 px-4 text-right font-mono font-bold text-[#4778C7]">
                  {formatRupiah(mockMuaSummaries.reduce((acc, m) => acc + m.platformFee, 0))}
                </td>
                <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                  {formatRupiah(mockMuaSummaries.reduce((acc, m) => acc + m.payoutDisbursed, 0))}
                </td>
                <td className="py-3 px-4 text-right font-mono font-bold text-amber-700">
                  {formatRupiah(mockMuaSummaries.reduce((acc, m) => acc + m.escrowHeld, 0))}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-[10px] text-emerald-700 font-bold">OKTOBER 2026</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. MODAL PRATINJAU DOKUMEN LAPORAN RESMI (BERKOP SURAT)  */}
      {/* ======================================================== */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl border border-[#E1E7F0] shadow-2xl max-w-3xl w-full p-6 md:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Tombol X Close */}
            <button
              id="btn-modal-close-x"
              onClick={() => setPreviewDoc(null)}
              className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-[#11182D] rounded-full hover:bg-[#F1F5F9] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Kop Surat Dokumen Resmi */}
            <div className="border-b-2 border-[#11182D] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-8 sm:pr-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-black text-xl tracking-tight text-[#11182D]">
                    GLAMÉA
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#11182D] text-white">
                    FINANCIAL COMPLIANCE
                  </span>
                </div>
                <p className="text-xs text-[#64748B] mt-1">
                  PT Glamea Tata Rias Nusantara • Jl. Khatib Sulaiman No. 42, Kota Padang
                </p>
                <p className="text-[10px] text-[#94A3B8] font-mono">
                  Sistem Rekonsiliasi Otomatis Escrow & Kliring Perbankan
                </p>
              </div>

              <div className="text-left sm:text-right text-xs">
                <span className="font-mono font-bold text-[#11182D] block">
                  {previewDoc.docNumber}
                </span>
                <span className="text-[#64748B] block mt-0.5">
                  Diterbitkan: {previewDoc.generatedAt}
                </span>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Status: Dokumen Sah
                </span>
              </div>
            </div>

            {/* Judul & Keterangan Laporan */}
            <div>
              <h3 className="font-poppins font-bold text-lg text-[#11182D]">
                {previewDoc.title}
              </h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                {previewDoc.description}
              </p>
            </div>

            {/* Rincian Pos Akuntansi */}
            <div className="border border-[#E1E7F0] rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E1E7F0] font-semibold text-[#64748B] text-[11px] font-poppins">
                    {previewDoc.tableHeaders.map((head, idx) => (
                      <th key={idx} className="py-2.5 px-3">{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E1E7F0]">
                  {previewDoc.tableRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#F8FAFC]/50">
                      <td className="py-2.5 px-3 font-mono font-bold text-[#11182D]">{row.code}</td>
                      <td className="py-2.5 px-3 font-medium text-[#11182D]">{row.label}</td>
                      {row.debit !== undefined && (
                        <td className="py-2.5 px-3 font-mono font-semibold text-right">
                          {formatRupiah(row.debit)}
                        </td>
                      )}
                      {row.credit !== undefined && (
                        <td className="py-2.5 px-3 font-mono text-[#4778C7] font-semibold text-right">
                          {formatRupiah(row.credit)}
                        </td>
                      )}
                      <td className="py-2.5 px-3 text-[#64748B] text-[11px]">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tanda Tangan & Pengesahan Digital */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E1E7F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-semibold text-[#64748B] block">Otoritas Validasi</span>
                <span className="font-bold text-[#11182D] block">Super Admin GLAMÉA</span>
                <span className="text-[11px] text-[#64748B] font-mono">admin@glamea.test (ID: ADM-PADANG-01)</span>
              </div>
              <div className="text-left sm:text-right">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E1E7F0] font-mono text-[11px] text-emerald-800 font-semibold shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>SHA256: VALIDATED-20261012</span>
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-[#E1E7F0] flex items-center justify-between">
              <button
                onClick={() => handleCopy(previewDoc.docNumber, 'docNum')}
                className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#11182D] transition-colors"
              >
                {copiedKey === 'docNum' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-medium">Nomor Dokumen Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin No. Dokumen</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadDocCSV(previewDoc)}
                  className="px-3.5 py-2 bg-white border border-[#E1E7F0] hover:bg-[#F8FAFC] text-[#11182D] rounded-xl text-xs font-semibold font-poppins transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#4778C7]" />
                  <span>Unduh CSV</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 bg-white border border-[#E1E7F0] hover:bg-[#F8FAFC] text-[#11182D] rounded-xl text-xs font-semibold font-poppins transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5 text-[#4778C7]" />
                  <span>Cetak Dokumen</span>
                </button>
                <button
                  id="btn-close-preview-modal"
                  onClick={() => setPreviewDoc(null)}
                  className="px-5 py-2 bg-[#11182D] hover:bg-[#1E293B] text-white rounded-xl text-xs font-semibold font-poppins transition-colors shadow-xs cursor-pointer"
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
}
