"use client";
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Activity, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  ShieldCheck, 
  UserCheck, 
  CreditCard, 
  Calendar, 
  Building2, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  Copy, 
  Check, 
  X, 
  FileText, 
  KeyRound, 
  Terminal, 
  ArrowUpRight, 
  Clock, 
  Server, 
  User, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export type ActivityActorRole = 'ADMIN' | 'MUA' | 'CLIENT' | 'SYSTEM';
export type ActivityCategory = 
  | 'TRANSAKSI_ESCROW' 
  | 'BOOKING' 
  | 'PENCAIRAN' 
  | 'VERIFIKASI_AKUN' 
  | 'KEAMANAN_AKSES' 
  | 'SISTEM_CRON';

export interface AuditLog {
  id: string;
  timestamp: string; // ISO string
  timeFormatted: string; // e.g., "21:42 WIB"
  actorName: string;
  actorRole: ActivityActorRole;
  actorEmail?: string;
  actorIp: string;
  actorLocation: string;
  actorDevice: string;
  category: ActivityCategory;
  categoryLabel: string;
  actionTitle: string;
  actionDescription: string;
  targetEntityId: string;
  targetEntityType: 'BOOKING' | 'PAYMENT' | 'PAYOUT' | 'MUA' | 'CLIENT' | 'AUTH' | 'SYSTEM';
  httpStatus: number;
  statusCodeText: string;
  severity: 'SUCCESS' | 'INFO' | 'WARNING';
  payload: Record<string, any>;
}

const mockAuditLogs: AuditLog[] = [
  {
    id: 'AUD-20261012-101',
    timestamp: '2026-10-12T21:42:15+07:00',
    timeFormatted: '21:42 WIB',
    actorName: 'Super Admin',
    actorRole: 'ADMIN',
    actorEmail: 'admin@glamea.test',
    actorIp: '103.28.12.89',
    actorLocation: 'Padang, Sumatera Barat',
    actorDevice: 'macOS 15.0 • Google Chrome 130',
    category: 'PENCAIRAN',
    categoryLabel: 'Pencairan Payout',
    actionTitle: 'Approval Pencairan Dana Escrow',
    actionDescription: 'Menyetujui pencairan dana bersih Rp 1.764.000 via BI-FAST BCA ke rekening Alya Putri.',
    targetEntityId: 'WD-001',
    targetEntityType: 'PAYOUT',
    httpStatus: 200,
    statusCodeText: '200 OK',
    severity: 'SUCCESS',
    payload: {
      payoutId: 'WD-001',
      muaId: 'mua-1',
      muaName: 'Alya Makeup',
      bank: 'BCA',
      accountNumber: '1234567890',
      grossAmount: 1800000,
      adminFee: 36000,
      netDisbursed: 1764000,
      approvedBy: 'admin-1',
      gateway: 'BI-FAST Gateway'
    }
  },
  {
    id: 'AUD-20261012-102',
    timestamp: '2026-10-12T20:15:40+07:00',
    timeFormatted: '20:15 WIB',
    actorName: 'GLAMÉA Escrow Engine',
    actorRole: 'SYSTEM',
    actorIp: '10.0.4.12',
    actorLocation: 'GLAMÉA Cloud Cluster (ID-JKT)',
    actorDevice: 'Automated Microservice Worker v2.4',
    category: 'TRANSAKSI_ESCROW',
    categoryLabel: 'Transaksi & Escrow',
    actionTitle: 'Lock Saldo Escrow Pesanan',
    actionDescription: 'Dana titipan klien Rp 1.500.000 diamankan di rekening penampung GLAMÉA untuk pesanan BOOK-001.',
    targetEntityId: 'PAY-001',
    targetEntityType: 'PAYMENT',
    httpStatus: 200,
    statusCodeText: '200 OK',
    severity: 'SUCCESS',
    payload: {
      paymentId: 'PAY-001',
      bookingId: 'BOOK-001',
      amountLocked: 1500000,
      escrowVault: 'VAULT-BCA-ESCROW-01',
      event: 'ESCROW_HELD',
      releaseCondition: 'EVENT_COMPLETED_H1'
    }
  },
  {
    id: 'AUD-20261012-103',
    timestamp: '2026-10-12T20:10:08+07:00',
    timeFormatted: '20:10 WIB',
    actorName: 'Siti Aminah',
    actorRole: 'CLIENT',
    actorEmail: 'client@glamea.test',
    actorIp: '114.122.208.45',
    actorLocation: 'Padang Barat, Sumatera Barat',
    actorDevice: 'iOS 18.0 • Safari Mobile',
    category: 'TRANSAKSI_ESCROW',
    categoryLabel: 'Transaksi & Escrow',
    actionTitle: 'Pelunasan Pembayaran Virtual Account',
    actionDescription: 'Klien berhasil melunasi pembayaran pesanan Baralek Wedding sebesar Rp 1.500.000 via BCA VA.',
    targetEntityId: 'PAY-001',
    targetEntityType: 'PAYMENT',
    httpStatus: 200,
    statusCodeText: '200 OK',
    severity: 'SUCCESS',
    payload: {
      paymentId: 'PAY-001',
      bookingId: 'BOOK-001',
      paymentMethod: 'Virtual Account',
      channel: 'BCA VA',
      amount: 1500000,
      reference: 'BCA-VA-9849102834',
      status: 'SUCCESS'
    }
  },
  {
    id: 'AUD-20261012-104',
    timestamp: '2026-10-12T19:45:22+07:00',
    timeFormatted: '19:45 WIB',
    actorName: 'Alya Makeup',
    actorRole: 'MUA',
    actorEmail: 'alya@glamea.test',
    actorIp: '180.252.164.71',
    actorLocation: 'Kuranji, Kota Padang',
    actorDevice: 'Android 14 • Chrome Mobile 130',
    category: 'BOOKING',
    categoryLabel: 'Booking Layanan',
    actionTitle: 'Konfirmasi Penerimaan Jadwal Rias',
    actionDescription: 'MUA mengonfirmasi ketersediaan jadwal untuk tanggal 15 Okt 2026 dan menyetujui detail pesanan BOOK-001.',
    targetEntityId: 'BOOK-001',
    targetEntityType: 'BOOKING',
    httpStatus: 200,
    statusCodeText: '200 OK',
    severity: 'SUCCESS',
    payload: {
      bookingId: 'BOOK-001',
      clientId: 'client-1',
      clientName: 'Siti Aminah',
      serviceName: 'Baralek Wedding Traditional',
      scheduledDate: '2026-10-15',
      sessionTime: '07:00 WIB',
      location: 'Kuranji, Padang'
    }
  },
  {
    id: 'AUD-20261012-105',
    timestamp: '2026-10-12T18:30:11+07:00',
    timeFormatted: '18:30 WIB',
    actorName: 'Nadira Beauty',
    actorRole: 'MUA',
    actorEmail: 'nadira@glamea.test',
    actorIp: '114.124.88.19',
    actorLocation: 'Padang Barat, Kota Padang',
    actorDevice: 'Windows 11 • Microsoft Edge 130',
    category: 'VERIFIKASI_AKUN',
    categoryLabel: 'Verifikasi & Akun',
    actionTitle: 'Pembaruan Katalog Layanan Studio',
    actionDescription: 'Memperbarui tarif dan deskripsi paket layanan Soft Glam Graduation menjadi Rp 450.000.',
    targetEntityId: 'mua-2',
    targetEntityType: 'MUA',
    httpStatus: 200,
    statusCodeText: '200 OK',
    severity: 'INFO',
    payload: {
      muaId: 'mua-2',
      serviceId: 'svc-grad-02',
      serviceName: 'Soft Glam Graduation',
      oldPrice: 400000,
      newPrice: 450000,
      durationMinutes: 90
    }
  },
  {
    id: 'AUD-20261012-106',
    timestamp: '2026-10-12T16:55:04+07:00',
    timeFormatted: '16:55 WIB',
    actorName: 'BI-FAST Gateway Node',
    actorRole: 'SYSTEM',
    actorIp: '10.0.8.21',
    actorLocation: 'Bank Indonesia Gateway API (Direct Connect)',
    actorDevice: 'Core Banking Relay Daemon v4.1',
    category: 'PENCAIRAN',
    categoryLabel: 'Pencairan Payout',
    actionTitle: 'Callback Kliring Payout Sukses',
    actionDescription: 'Menerima konfirmasi mutasi kliring real-time transfer Rp 980.000 ke Bank Nagari rekening Citra Lestari.',
    targetEntityId: 'WD-003',
    targetEntityType: 'PAYOUT',
    httpStatus: 200,
    statusCodeText: '200 OK',
    severity: 'SUCCESS',
    payload: {
      payoutId: 'WD-003',
      rrn: 'BIF-NAGARI-99018472910',
      settlementAmount: 980000,
      clearingChannel: 'BI-FAST REALTIME',
      statusCode: 'SUCCESS_CREDITED'
    }
  },
  {
    id: 'AUD-20261012-107',
    timestamp: '2026-10-12T15:20:55+07:00',
    timeFormatted: '15:20 WIB',
    actorName: 'Super Admin',
    actorRole: 'ADMIN',
    actorEmail: 'admin@glamea.test',
    actorIp: '103.28.12.89',
    actorLocation: 'Padang, Sumatera Barat',
    actorDevice: 'macOS 15.0 • Google Chrome 130',
    category: 'VERIFIKASI_AKUN',
    categoryLabel: 'Verifikasi & Akun',
    actionTitle: 'Verifikasi Kemitraan MUA Disetujui',
    actionDescription: 'Memvalidasi kelengkapan berkas legalitas KTP dan portofolio keahlian resmi Alya Makeup.',
    targetEntityId: 'mua-1',
    targetEntityType: 'MUA',
    httpStatus: 200,
    statusCodeText: '200 OK',
    severity: 'SUCCESS',
    payload: {
      muaId: 'mua-1',
      brandName: 'Alya Makeup',
      verifiedBy: 'admin-1',
      ktpVerified: true,
      bankVerified: true,
      badgeIssued: 'GLAMEA_CERTIFIED_PARTNER'
    }
  },
  {
    id: 'AUD-20261012-108',
    timestamp: '2026-10-12T14:05:39+07:00',
    timeFormatted: '14:05 WIB',
    actorName: 'Rina Permatasari',
    actorRole: 'CLIENT',
    actorEmail: 'rina@glamea.test',
    actorIp: '182.1.77.34',
    actorLocation: 'Pauh, Kota Padang',
    actorDevice: 'Android 14 • Chrome 129',
    category: 'BOOKING',
    categoryLabel: 'Booking Layanan',
    actionTitle: 'Pembuatan Reservasi Baru',
    actionDescription: 'Klien membuat reservasi baru untuk sesi Wisuda Universitas Andalas dengan Nadira Beauty (BOOK-002).',
    targetEntityId: 'BOOK-002',
    targetEntityType: 'BOOKING',
    httpStatus: 201,
    statusCodeText: '201 Created',
    severity: 'INFO',
    payload: {
      bookingId: 'BOOK-002',
      muaId: 'mua-2',
      muaName: 'Nadira Beauty',
      occasion: 'Wisuda UNAND',
      eventDate: '2026-10-18',
      totalAmount: 450000,
      status: 'CONFIRMED'
    }
  },
  {
    id: 'AUD-20261012-109',
    timestamp: '2026-10-12T11:40:18+07:00',
    timeFormatted: '11:40 WIB',
    actorName: 'Bella Makeupart',
    actorRole: 'MUA',
    actorEmail: 'bella@glamea.test',
    actorIp: '110.137.91.50',
    actorLocation: 'Padang Timur, Kota Padang',
    actorDevice: 'iOS 17.6 • Safari Mobile',
    category: 'PENCAIRAN',
    categoryLabel: 'Pencairan Payout',
    actionTitle: 'Pengajuan Penarikan Saldo Escrow',
    actionDescription: 'MUA mengajukan pencairan dana escrow dari pesanan BOOK-004 sebesar Rp 833.000 ke rekening BRI.',
    targetEntityId: 'WD-002',
    targetEntityType: 'PAYOUT',
    httpStatus: 200,
    statusCodeText: '200 OK',
    severity: 'INFO',
    payload: {
      payoutId: 'WD-002',
      muaId: 'mua-4',
      requestedAmount: 850000,
      platformFeePercent: 2,
      netAmount: 833000,
      bankName: 'BRI',
      accountNumber: '9988776655'
    }
  },
  {
    id: 'AUD-20261012-110',
    timestamp: '2026-10-12T10:15:30+07:00',
    timeFormatted: '10:15 WIB',
    actorName: 'Dinda Maharani',
    actorRole: 'CLIENT',
    actorEmail: 'dinda@glamea.test',
    actorIp: '36.68.210.12',
    actorLocation: 'Padang Selatan, Kota Padang',
    actorDevice: 'macOS 14.5 • Safari 17.5',
    category: 'TRANSAKSI_ESCROW',
    categoryLabel: 'Transaksi & Escrow',
    actionTitle: 'Pelunasan Pembayaran Virtual Account',
    actionDescription: 'Klien melunasi pembayaran pesanan BOOK-003 sebesar Rp 1.500.000 via Mandiri Virtual Account.',
    targetEntityId: 'PAY-003',
    targetEntityType: 'PAYMENT',
    httpStatus: 200,
    statusCodeText: '200 OK',
    severity: 'SUCCESS',
    payload: {
      paymentId: 'PAY-003',
      bookingId: 'BOOK-003',
      channel: 'Mandiri VA',
      amount: 1500000,
      status: 'SUCCESS'
    }
  },
  {
    id: 'AUD-20261012-111',
    timestamp: '2026-10-12T09:00:02+07:00',
    timeFormatted: '09:00 WIB',
    actorName: 'Super Admin',
    actorRole: 'ADMIN',
    actorEmail: 'admin@glamea.test',
    actorIp: '103.28.12.89',
    actorLocation: 'Padang, Sumatera Barat',
    actorDevice: 'macOS 15.0 • Google Chrome 130',
    category: 'KEAMANAN_AKSES',
    categoryLabel: 'Keamanan & Akses',
    actionTitle: 'Autentikasi Administrator Berhasil',
    actionDescription: 'Sesi masuk Super Admin aktif dengan token otorisasi OAuth JWT dan verifikasi identitas internal.',
    targetEntityId: 'ADM-1',
    targetEntityType: 'AUTH',
    httpStatus: 200,
    statusCodeText: '200 OK',
    severity: 'SUCCESS',
    payload: {
      adminId: 'admin-1',
      sessionScope: 'SUPER_ADMIN_READ_WRITE',
      mfaVerified: true,
      authMethod: 'PASSKEY_SECURE',
      expiresIn: '8h'
    }
  },
  {
    id: 'AUD-20261012-112',
    timestamp: '2026-10-12T08:30:00+07:00',
    timeFormatted: '08:30 WIB',
    actorName: 'Sistem Keamanan GLAMÉA',
    actorRole: 'SYSTEM',
    actorIp: '127.0.0.1',
    actorLocation: 'Local Loopback Daemon (cron.d)',
    actorDevice: 'glamea-core-cron / scheduler',
    category: 'SISTEM_CRON',
    categoryLabel: 'Sistem & Pemeliharaan',
    actionTitle: 'Pemeliharaan Rutin & Rekonsiliasi Escrow',
    actionDescription: 'Menjalankan rekonsiliasi harian seluruh saldo escrow BI-FAST dan pembersihan token sesi kedaluwarsa.',
    targetEntityId: 'SYS-CRON',
    targetEntityType: 'SYSTEM',
    httpStatus: 200,
    statusCodeText: '200 OK',
    severity: 'INFO',
    payload: {
      routine: 'DAILY_RECONCILIATION',
      reconciledAccounts: 8,
      escrowDiscrepancy: 0,
      expiredTokensRevoked: 14,
      status: 'HEALTHY'
    }
  }
];

export default function AdminAktivitasPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [selectedRole, setSelectedRole] = useState<'ALL' | ActivityActorRole>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | ActivityCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectModalLog, setInspectModalLog] = useState<AuditLog | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = [
      'ID Audit',
      'Waktu WIB',
      'Tanggal',
      'Nama Aktor',
      'Peran Aktor',
      'Kategori',
      'Judul Aksi',
      'Deskripsi',
      'ID Entitas',
      'Status HTTP',
      'IP Address',
      'Lokasi'
    ];

    const rows = filteredLogs.map(log => [
      `"${log.id}"`,
      `"${log.timeFormatted}"`,
      `"12 Oktober 2026"`,
      `"${log.actorName}"`,
      `"${log.actorRole}"`,
      `"${log.categoryLabel}"`,
      `"${log.actionTitle}"`,
      `"${log.actionDescription.replace(/"/g, '""')}"`,
      `"${log.targetEntityId}"`,
      `"${log.statusCodeText}"`,
      `"${log.actorIp}"`,
      `"${log.actorLocation}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GLAMEA_Audit_Trail_12Okt2026_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      // Role filter
      if (selectedRole !== 'ALL' && log.actorRole !== selectedRole) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'ALL' && log.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesQuery = 
          log.id.toLowerCase().includes(query) ||
          log.actorName.toLowerCase().includes(query) ||
          log.actionTitle.toLowerCase().includes(query) ||
          log.actionDescription.toLowerCase().includes(query) ||
          log.targetEntityId.toLowerCase().includes(query) ||
          log.actorIp.toLowerCase().includes(query) ||
          log.categoryLabel.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }
      return true;
    });
  }, [auditLogs, selectedRole, selectedCategory, searchQuery]);

  // Counts by role
  const roleCounts = useMemo(() => {
    return {
      ALL: auditLogs.length,
      ADMIN: auditLogs.filter(l => l.actorRole === 'ADMIN').length,
      MUA: auditLogs.filter(l => l.actorRole === 'MUA').length,
      CLIENT: auditLogs.filter(l => l.actorRole === 'CLIENT').length,
      SYSTEM: auditLogs.filter(l => l.actorRole === 'SYSTEM').length,
    };
  }, [auditLogs]);

  // Badge helpers
  const getRoleBadge = (role: ActivityActorRole) => {
    switch (role) {
      case 'ADMIN':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#11182D]/10 text-[#11182D] border border-[#11182D]/20">ADMIN</span>;
      case 'MUA':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">MUA</span>;
      case 'CLIENT':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">KLIEN</span>;
      case 'SYSTEM':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">SISTEM</span>;
    }
  };

  const getActorInitialBg = (role: ActivityActorRole) => {
    switch (role) {
      case 'ADMIN': return 'bg-[#11182D] text-white';
      case 'MUA': return 'bg-purple-600 text-white';
      case 'CLIENT': return 'bg-amber-600 text-white';
      case 'SYSTEM': return 'bg-slate-700 text-white';
    }
  };

  const getCategoryBadge = (category: ActivityCategory, label: string) => {
    switch (category) {
      case 'TRANSAKSI_ESCROW':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200"><CreditCard className="w-3 h-3 text-emerald-600" />{label}</span>;
      case 'BOOKING':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-800 border border-blue-200"><Calendar className="w-3 h-3 text-blue-600" />{label}</span>;
      case 'PENCAIRAN':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-violet-50 text-violet-800 border border-violet-200"><Building2 className="w-3 h-3 text-violet-600" />{label}</span>;
      case 'VERIFIKASI_AKUN':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-teal-50 text-teal-800 border border-teal-200"><ShieldCheck className="w-3 h-3 text-teal-600" />{label}</span>;
      case 'KEAMANAN_AKSES':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-indigo-50 text-indigo-800 border border-indigo-200"><KeyRound className="w-3 h-3 text-indigo-600" />{label}</span>;
      case 'SISTEM_CRON':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-300"><Terminal className="w-3 h-3 text-slate-600" />{label}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* ======================================================== */}
      {/* 1. EXECUTIVE AUDIT HEADER (ZERO AI SLOP)                 */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E1E7F0] pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-serif text-[#11182D]">
              Log Aktivitas & Audit Trail
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#4778C7]/10 text-[#4778C7] border border-[#4778C7]/20">
              {auditLogs.length} Total Peristiwa
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Rekam jejak kepatuhan dan audit operasional GLAMÉA real-time tanpa penundaan.
          </p>
        </div>

        {/* Live Stream Indicator & Global Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Live Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Audit Stream Aktif</span>
            <span className="text-[11px] font-normal text-emerald-700/80">• 12 Okt 2026, 21:56 WIB</span>
          </div>

          {/* Refresh Stream Button */}
          <button
            onClick={handleRefresh}
            title="Refresh stream aktivitas"
            className="p-2 bg-white border border-[#E1E7F0] hover:bg-[#F8FAFC] text-[#11182D] rounded-xl text-xs transition-colors shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 text-[#64748B] ${isRefreshing ? 'animate-spin text-[#4778C7]' : ''}`} />
          </button>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#E1E7F0] hover:bg-[#F8FAFC] text-[#11182D] rounded-xl text-xs font-semibold font-poppins transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#4778C7]" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. HIGH-DENSITY FILTER & SEARCH CONTROL BAR              */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl border border-[#E1E7F0] p-4 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Actor Role Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-[#64748B] mr-1 hidden sm:inline">Aktor:</span>
            {(['ALL', 'ADMIN', 'MUA', 'CLIENT', 'SYSTEM'] as const).map(role => {
              const labelMap: Record<string, string> = {
                ALL: 'Semua Aktor',
                ADMIN: 'Admin',
                MUA: 'Mitra MUA',
                CLIENT: 'Klien',
                SYSTEM: 'Sistem'
              };
              const isSelected = selectedRole === role;
              return (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-poppins transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#11182D] text-white shadow-xs'
                      : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#11182D] border border-transparent hover:border-[#E1E7F0]'
                  }`}
                >
                  <span>{labelMap[role]}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#E1E7F0] text-[#64748B]'
                  }`}>
                    {roleCounts[role]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Controls: Category Dropdown & Search Input */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* Category Dropdown */}
            <div className="relative w-full sm:w-56">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value as any)}
                className="w-full bg-[#F8FAFC] border border-[#E1E7F0] text-xs font-medium text-[#11182D] rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4778C7] transition-all cursor-pointer appearance-none pr-8"
              >
                <option value="ALL">Semua Kategori Aktivitas</option>
                <option value="TRANSAKSI_ESCROW">Transaksi & Escrow</option>
                <option value="BOOKING">Booking Layanan</option>
                <option value="PENCAIRAN">Pencairan Payout</option>
                <option value="VERIFIKASI_AKUN">Verifikasi & Akun</option>
                <option value="KEAMANAN_AKSES">Keamanan & Akses</option>
                <option value="SISTEM_CRON">Sistem & Pemeliharaan</option>
              </select>
              <Filter className="w-3.5 h-3.5 text-[#64748B] absolute right-3 top-2.5 pointer-events-none" />
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Cari aktor, aksi, ID entitas..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#E1E7F0] text-xs text-[#11182D] rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4778C7] transition-all placeholder:text-[#94A3B8]"
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
        </div>

        {/* Counter Info Bar */}
        <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
          <span>
            Menampilkan <strong className="text-[#11182D]">{filteredLogs.length}</strong> dari {auditLogs.length} log aktivitas sistem
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. OPERATIONAL AUDIT TABLE (HIGH DENSITY)                */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl border border-[#E1E7F0] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E1E7F0] text-[11px] font-semibold text-[#64748B] uppercase tracking-wider font-poppins">
                <th className="py-3 px-4 w-32">Waktu WIB</th>
                <th className="py-3 px-4">Aktor / Pengguna</th>
                <th className="py-3 px-4">Aktivitas & Uraian Operasional</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4 w-28">ID Entitas</th>
                <th className="py-3 px-4 w-24">Status</th>
                <th className="py-3 px-4 text-right w-24">Inspeksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1E7F0] text-xs">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#64748B]">
                    <div className="max-w-xs mx-auto space-y-2">
                      <AlertCircle className="w-8 h-8 text-[#94A3B8] mx-auto stroke-1" />
                      <p className="font-semibold text-sm text-[#11182D]">Tidak Ada Log Aktivitas Ditemukan</p>
                      <p className="text-xs text-[#64748B]">Coba sesuaikan kata kunci pencarian atau reset filter aktor & kategori.</p>
                      <button
                        onClick={() => { setSelectedRole('ALL'); setSelectedCategory('ALL'); setSearchQuery(''); }}
                        className="mt-2 px-3 py-1.5 bg-[#11182D] text-white text-xs rounded-xl font-medium"
                      >
                        Reset Semua Filter
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => {
                  return (
                    <tr 
                      key={log.id} 
                      className="hover:bg-[#F8FAFC]/80 transition-colors group"
                    >
                      {/* Waktu & Stempel */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-[#11182D] font-mono font-medium">
                          <Clock className="w-3.5 h-3.5 text-[#4778C7] shrink-0" />
                          <span>{log.timeFormatted}</span>
                        </div>
                        <span className="text-[10px] text-[#64748B] block mt-0.5 font-sans">
                          12 Okt 2026
                        </span>
                      </td>

                      {/* Aktor / Pengguna */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${getActorInitialBg(log.actorRole)}`}>
                            {log.actorName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-[#11182D] leading-tight">
                                {log.actorName}
                              </span>
                              {getRoleBadge(log.actorRole)}
                            </div>
                            <span className="text-[10px] text-[#64748B] block font-mono mt-0.5">
                              {log.actorIp}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Aktivitas & Uraian Operasional */}
                      <td className="py-3.5 px-4">
                        <div className="max-w-md">
                          <span className="font-semibold text-[#11182D] block">
                            {log.actionTitle}
                          </span>
                          <span className="text-[11px] text-[#64748B] line-clamp-1 mt-0.5">
                            {log.actionDescription}
                          </span>
                        </div>
                      </td>

                      {/* Kategori */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getCategoryBadge(log.category, log.categoryLabel)}
                      </td>

                      {/* ID Entitas */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-1 rounded-lg text-xs font-mono font-semibold bg-[#F1F5F9] text-[#11182D] border border-[#E1E7F0]">
                          {log.targetEntityId}
                        </span>
                      </td>

                      {/* Status Code HTTP */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {log.statusCodeText}
                        </span>
                      </td>

                      {/* Tombol Inspeksi */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setInspectModalLog(log)}
                          className="px-2.5 py-1.5 bg-white border border-[#E1E7F0] hover:bg-[#11182D] hover:text-white hover:border-[#11182D] text-[#11182D] rounded-xl text-xs font-medium font-poppins transition-all flex items-center gap-1.5 ml-auto shadow-xs"
                          title="Inspeksi metadata dan payload JSON"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspeksi</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-3.5 bg-[#F8FAFC] border-t border-[#E1E7F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Integritas Audit Log: Terenkripsi SHA-256 (Tahan Perubahan)</span>
          </div>
          <span className="font-mono text-[11px]">
            Server Node: padang-edge-01.glamea.internal
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. MODAL RINCIAN INSPEKSI AUDIT LOG FORENSIK            */}
      {/* ======================================================== */}
      {inspectModalLog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E1E7F0] shadow-2xl max-w-2xl w-full p-6 md:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="flex items-start justify-between border-b border-[#E1E7F0] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-[#11182D] text-white">
                    {inspectModalLog.id}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {inspectModalLog.statusCodeText}
                  </span>
                </div>
                <h3 className="font-poppins font-bold text-lg text-[#11182D] mt-1.5">
                  {inspectModalLog.actionTitle}
                </h3>
                <p className="text-xs text-[#64748B]">
                  Dicatat pada 12 Oktober 2026, {inspectModalLog.timeFormatted} (WIB)
                </p>
              </div>

              <button
                onClick={() => setInspectModalLog(null)}
                className="p-1.5 text-[#64748B] hover:text-[#11182D] hover:bg-[#F1F5F9] rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Forensic Detail Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E1E7F0] space-y-1">
                <span className="text-[10px] font-semibold text-[#64748B] uppercase block">Aktor Operasi</span>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="font-semibold text-[#11182D]">{inspectModalLog.actorName}</span>
                  {getRoleBadge(inspectModalLog.actorRole)}
                </div>
                <span className="text-[11px] text-[#64748B] block">{inspectModalLog.actorEmail || 'Sistem Internal'}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E1E7F0] space-y-1">
                <span className="text-[10px] font-semibold text-[#64748B] uppercase block">Jaringan & Lokasi</span>
                <span className="font-mono font-semibold text-[#11182D] block pt-0.5">
                  {inspectModalLog.actorIp}
                </span>
                <span className="text-[11px] text-[#64748B] block">{inspectModalLog.actorLocation}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E1E7F0] space-y-1">
                <span className="text-[10px] font-semibold text-[#64748B] uppercase block">Perangkat & Klien</span>
                <span className="text-[#11182D] font-medium block pt-0.5 line-clamp-1">
                  {inspectModalLog.actorDevice}
                </span>
                <span className="text-[10px] text-[#94A3B8] font-mono">TLS 1.3 / HTTP 2.0 Secure</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E1E7F0] space-y-1">
                <span className="text-[10px] font-semibold text-[#64748B] uppercase block">Entitas Terkait</span>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="font-mono font-bold text-sm text-[#4778C7]">
                    {inspectModalLog.targetEntityId}
                  </span>
                  <span className="text-[11px] text-[#64748B]">({inspectModalLog.targetEntityType})</span>
                </div>
                <span className="text-[11px] text-[#64748B] block">{inspectModalLog.categoryLabel}</span>
              </div>
            </div>

            {/* Description Summary */}
            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/60 text-xs text-blue-900 leading-relaxed">
              <strong>Uraian Transaksi:</strong> {inspectModalLog.actionDescription}
            </div>

            {/* JSON Payload Viewer */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#11182D] flex items-center gap-1.5 font-poppins">
                  <Terminal className="w-3.5 h-3.5 text-[#4778C7]" />
                  <span>Payload Event Data (JSON)</span>
                </span>
                <button
                  onClick={() => handleCopy(JSON.stringify(inspectModalLog.payload, null, 2), 'payload')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-[#4778C7] hover:bg-[#4778C7]/10 transition-colors"
                >
                  {copiedKey === 'payload' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Salin JSON</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="bg-[#0B1120] text-[#E2E8F0] p-4 rounded-xl text-[11px] font-mono overflow-x-auto max-h-48 border border-slate-800 leading-relaxed custom-scrollbar">
                {JSON.stringify(inspectModalLog.payload, null, 2)}
              </pre>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 border-t border-[#E1E7F0] flex items-center justify-between">
              <button
                onClick={() => handleCopy(inspectModalLog.id, 'auditId')}
                className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#11182D] transition-colors"
              >
                {copiedKey === 'auditId' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-medium">ID Audit Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin ID Audit</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setInspectModalLog(null)}
                className="px-5 py-2 bg-[#11182D] hover:bg-[#1E293B] text-white rounded-xl text-xs font-semibold font-poppins transition-colors shadow-xs"
              >
                Tutup Inspeksi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
