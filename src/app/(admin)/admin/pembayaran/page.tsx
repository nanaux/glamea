"use client";
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  CreditCard, 
  ArrowDownLeft, 
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
  Phone, 
  Building2, 
  QrCode, 
  Wallet, 
  FileCheck2, 
  Receipt, 
  Printer, 
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { PaymentStatus } from '@/types';
import { mockPayments, mockBookings } from '@/data/mock-bookings';
import { mockClients } from '@/data/mock-users';
import { mockMuas } from '@/data/mock-muas';
import { mockServices } from '@/data/mock-services';

interface ExtendedPayment {
  id: string;
  bookingId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  muaName: string;
  serviceName: string;
  amount: number;
  subtotal: number;
  discount: number;
  method: 'Virtual Account' | 'Transfer Bank' | 'QRIS' | 'E-Wallet';
  channel: string;
  gatewayRef: string;
  status: PaymentStatus;
  createdAt: string;
  settledAt?: string;
  proofNote?: string;
}

const initialPayments: ExtendedPayment[] = mockPayments.map(p => {
  const booking = mockBookings.find(b => b.id === p.bookingId);
  const client = mockClients.find(c => c.id === booking?.clientId);
  const mua = mockMuas.find(m => m.id === booking?.muaId);
  const service = mockServices.find(s => s.id === booking?.serviceId);

  const channelMap: Record<string, string> = {
    'pay-1': 'BCA Manual',
    'pay-2': 'Mandiri VA',
    'pay-3': 'BNI VA',
    'pay-4': 'QRIS GLAMÉA',
    'pay-6': 'BCA Manual',
  };

  const refMap: Record<string, string> = {
    'pay-1': 'MANUAL-BCA-8891024',
    'pay-2': 'MDR-VA-8910294182',
    'pay-3': 'BNI-VA-9901847162',
    'pay-4': 'QRIS-NMID-938174910',
    'pay-6': 'MANUAL-BCA-9938172',
  };

  return {
    id: p.id.toUpperCase(),
    bookingId: p.bookingId,
    clientName: client?.name || 'Klien GLAMÉA',
    clientPhone: client?.phone || '-',
    clientEmail: client?.email || '-',
    muaName: mua?.name || 'Mitra MUA',
    serviceName: service?.name || booking?.occasion || 'Layanan Tata Rias',
    amount: p.amount,
    subtotal: booking?.subtotal || p.amount,
    discount: booking?.discount || 0,
    method: (p.method === 'E-Wallet' ? 'QRIS' : p.method) as ExtendedPayment['method'],
    channel: channelMap[p.id] || p.method,
    gatewayRef: refMap[p.id] || `REF-${p.id.toUpperCase()}`,
    status: p.status,
    createdAt: p.createdAt,
    settledAt: p.status === 'Success' ? p.createdAt : undefined,
    proofNote: p.id === 'pay-6' ? 'Pengguna mengunggah bukti transfer ATM BCA Rp 350.000. Menunggu verifikasi mutasi admin.' : undefined,
  };
});

export default function AdminPembayaranPage() {
  const [payments, setPayments] = useState<ExtendedPayment[]>(initialPayments);
  const [selectedStatusTab, setSelectedStatusTab] = useState<'ALL' | PaymentStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');
  const [channelFilter, setChannelFilter] = useState<string>('ALL');
  const [selectedReceiptModal, setSelectedReceiptModal] = useState<ExtendedPayment | null>(null);
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

  // Admin action: manual settlement approval
  const approvePayment = (id: string) => {
    const nowIso = new Date().toISOString();
    setPayments(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: 'Success',
          settledAt: nowIso
        };
      }
      return p;
    }));
    showToast(`Pembayaran #${id} berhasil diverifikasi Lunas!`);
    if (selectedReceiptModal && selectedReceiptModal.id === id) {
      setSelectedReceiptModal(prev => prev ? ({
        ...prev,
        status: 'Success',
        settledAt: nowIso
      }) : null);
    }
  };

  // Distinct channels for filter
  const channels = useMemo(() => {
    const set = new Set<string>();
    initialPayments.forEach(p => set.add(p.channel));
    return Array.from(set);
  }, []);

  // Filtered dataset
  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      // Tab filter
      if (selectedStatusTab !== 'ALL' && p.status !== selectedStatusTab) return false;

      // Method filter
      if (methodFilter !== 'ALL' && p.method !== methodFilter) return false;

      // Channel filter
      if (channelFilter !== 'ALL' && p.channel !== channelFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = p.id.toLowerCase().includes(q);
        const matchBooking = p.bookingId.toLowerCase().includes(q);
        const matchClient = p.clientName.toLowerCase().includes(q);
        const matchMua = p.muaName.toLowerCase().includes(q);
        const matchChannel = p.channel.toLowerCase().includes(q);
        const matchRef = p.gatewayRef.toLowerCase().includes(q);
        if (!matchId && !matchBooking && !matchClient && !matchMua && !matchChannel && !matchRef) return false;
      }

      return true;
    });
  }, [payments, selectedStatusTab, methodFilter, channelFilter, searchQuery]);

  // Aggregate Metrics
  const totalCount = payments.length;
  const successCount = payments.filter(p => p.status === 'Success').length;
  const pendingCount = payments.filter(p => p.status === 'Pending').length;
  const failedCount = payments.filter(p => p.status === 'Failed').length;

  const totalInflow = payments.filter(p => p.status === 'Success').reduce((acc, curr) => acc + curr.amount, 0);
  const successRate = totalCount > 0 ? ((successCount / totalCount) * 100).toFixed(1) : '0';

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
              Manajemen Pembayaran & Inflow
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#4778C7] border border-[#BFDBFE]">
              {totalCount} Transaksi Masuk
            </span>
          </div>
          <p className="text-sm text-[#64748B] mt-1 font-sans">
            Monitoring arus kas masuk, verifikasi setoran klien, dan rekonsiliasi payment gateway platform GLAMÉA
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#ECFDF5] border border-emerald-200/80 rounded-xl text-xs text-emerald-800 font-sans">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium">Gateway Terhubung & Aktif</span>
          </div>

          <button 
            onClick={() => showToast('Rekapitulasi mutasi pembayaran berhasil diunduh (CSV format)')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#E1E7F0] rounded-xl text-xs font-semibold text-[#172033] hover:bg-[#F8FAFC] transition-colors shadow-xs font-poppins"
          >
            <Download className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Ekspor Rekap Finansial</span>
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
                onClick={() => setSelectedStatusTab('Success')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  selectedStatusTab === 'Success'
                    ? 'bg-white text-[#172033] shadow-xs'
                    : 'text-[#64748B] hover:text-[#172033]'
                }`}
              >
                Berhasil ({successCount})
              </button>
              <button
                onClick={() => setSelectedStatusTab('Pending')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  selectedStatusTab === 'Pending'
                    ? 'bg-white text-[#172033] shadow-xs'
                    : 'text-[#64748B] hover:text-[#172033]'
                }`}
              >
                Menunggu Verifikasi ({pendingCount})
              </button>
              <button
                onClick={() => setSelectedStatusTab('Failed')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  selectedStatusTab === 'Failed'
                    ? 'bg-white text-[#172033] shadow-xs'
                    : 'text-[#64748B] hover:text-[#172033]'
                }`}
              >
                Gagal / Expired ({failedCount})
              </button>
            </div>

            <div className="text-xs text-[#64748B] font-sans">
              Menampilkan <strong className="text-[#172033] font-medium">{filteredPayments.length}</strong> dari {payments.length} transaksi setoran
            </div>
          </div>

          {/* Search Bar & Dropdown Selects */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari ID pembayaran (#PAY-xxx), booking, pembayar, atau MUA..."
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

            {/* Method Filter */}
            <div className="sm:col-span-3">
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E1E7F0] focus:border-[#4778C7] focus:bg-white rounded-xl text-xs text-[#172033] focus:outline-hidden transition-colors font-sans"
              >
                <option value="ALL">Semua Metode Pembayaran</option>
                <option value="Virtual Account">Virtual Account</option>
                <option value="Transfer Bank">Transfer Bank Manual</option>
                <option value="QRIS">QRIS Instant</option>
                <option value="E-Wallet">E-Wallet</option>
              </select>
            </div>

            {/* Channel Bank Filter */}
            <div className="sm:col-span-3">
              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E1E7F0] focus:border-[#4778C7] focus:bg-white rounded-xl text-xs text-[#172033] focus:outline-hidden transition-colors font-sans"
              >
                <option value="ALL">Semua Kanal Bank / Gateway</option>
                {channels.map(ch => (
                  <option key={ch} value={ch}>{ch}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Flat Structured Table (Zero Nested Cards) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans min-w-[980px]">
            <thead>
              <tr className="border-b border-[#E1E7F0] bg-[#F8FAFC]/60 text-[#64748B]">
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px] font-poppins w-[150px]">ID & Waktu Setoran</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px] font-poppins w-[130px]">No. Booking</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px] font-poppins w-[160px]">Pembayar (Klien)</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px] font-poppins w-[140px]">Mitra MUA</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px] font-poppins w-[160px]">Metode & Kanal</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px] font-poppins w-[135px]">Jumlah Setoran</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px] font-poppins w-[125px]">Status Settlement</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px] text-right font-poppins w-[80px]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1E7F0]">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#64748B] font-sans">
                    <p className="text-sm font-medium text-[#172033]">Tidak ada transaksi pembayaran yang sesuai</p>
                    <p className="text-xs mt-1 text-[#94A3B8]">Coba sesuaikan kata kunci atau bersihkan filter di atas.</p>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => {
                  const paymentDateFormatted = new Date(p.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  });
                  const paymentTimeFormatted = new Date(p.createdAt).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <tr key={p.id} className="hover:bg-[#F8FAFC] transition-colors group">
                      
                      {/* ID & Timestamp */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyToClipboard(p.id, 'ID Transaksi')}
                            className="font-mono font-semibold text-[#172033] hover:text-[#4778C7] transition-colors text-xs flex items-center gap-1 whitespace-nowrap"
                            title="Salin ID Pembayaran"
                          >
                            <span>{p.id}</span>
                            {copiedText === p.id ? (
                              <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                            ) : (
                              <Copy className="w-3 h-3 text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                            )}
                          </button>
                        </div>
                        <div className="text-[11px] text-[#64748B] mt-0.5 whitespace-nowrap">
                          {paymentDateFormatted} • {paymentTimeFormatted} WIB
                        </div>
                      </td>

                      {/* Booking ID Ref */}
                      <td className="py-3.5 px-3">
                        <span className="font-mono text-xs font-medium text-[#4778C7] bg-[#EFF6FF] px-2 py-0.5 rounded-md border border-[#BFDBFE]">
                          #{p.bookingId}
                        </span>
                        <div className="text-[10px] text-[#94A3B8] mt-1 truncate max-w-[120px]" title={p.serviceName}>
                          {p.serviceName}
                        </div>
                      </td>

                      {/* Client / Payer */}
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-[#172033] font-poppins text-xs">
                          {p.clientName}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-[#64748B] mt-0.5">
                          <Phone className="w-2.5 h-2.5 text-[#94A3B8]" />
                          <span>{p.clientPhone}</span>
                        </div>
                      </td>

                      {/* MUA Beneficiary */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#F5F3FF] text-[#8B5CF6] border border-[#DDD6FE] flex items-center justify-center font-bold text-[10px]">
                            {p.muaName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-medium text-[#172033] text-xs block">
                              {p.muaName}
                            </span>
                            <span className="text-[10px] text-emerald-600 font-medium">
                              Rekening Mitra
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Method & Channel */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5 font-medium text-[#172033]">
                          {p.method === 'Virtual Account' ? (
                            <Building2 className="w-3.5 h-3.5 text-[#4778C7]" />
                          ) : p.method === 'QRIS' ? (
                            <QrCode className="w-3.5 h-3.5 text-[#8B5CF6]" />
                          ) : p.method === 'E-Wallet' ? (
                            <Wallet className="w-3.5 h-3.5 text-amber-600" />
                          ) : (
                            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                          )}
                          <span>{p.channel}</span>
                        </div>
                        <span className="text-[10px] text-[#94A3B8] font-mono block mt-0.5 truncate max-w-[150px]" title={p.gatewayRef}>
                          Ref: {p.gatewayRef}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="font-bold text-[#172033] text-xs font-sans">
                          {formatRupiah(p.amount)}
                        </div>
                        {p.discount > 0 ? (
                          <span className="text-[10px] text-emerald-600 block">
                            Disc: -{formatRupiah(p.discount)}
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#94A3B8] block">
                            Gross Amount
                          </span>
                        )}
                      </td>

                      {/* Status Settlement Badge */}
                      <td className="py-3.5 px-3">
                        {p.status === 'Success' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Settled (Lunas)
                          </span>
                        ) : p.status === 'Pending' ? (
                          <button
                            onClick={() => approvePayment(p.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors cursor-pointer"
                            title="Klik untuk langsung verifikasi lunas"
                          >
                            <Clock className="w-3 h-3 text-amber-600" />
                            Verifikasi
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
                            <XCircle className="w-3 h-3 text-rose-500" />
                            Expired
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          id={`btn-receipt-${p.id}`}
                          onClick={() => setSelectedReceiptModal(p)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#4778C7] hover:bg-[#EFF6FF] border border-[#E1E7F0] hover:border-[#BFDBFE] rounded-lg transition-colors font-poppins"
                        >
                          <Receipt className="w-3 h-3" />
                          <span>Kuitansi</span>
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
          <span>Menampilkan rekapitulasi audit pembayaran mutasi platform GLAMÉA</span>
          <div className="flex items-center gap-2">
            <span className="text-[11px]">Bank Gateway Settlement: Active</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </div>
        </div>
      </div>

      {/* Payment Digital Receipt & Audit Modal */}
      {selectedReceiptModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E1E7F0] rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-up">
            
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-[#E1E7F0] flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#4778C7] flex items-center justify-center font-bold text-xs">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#172033] font-poppins">
                    Bukti Kuitansi & Rekonsiliasi
                  </h3>
                  <p className="text-[11px] text-[#64748B] font-mono">
                    ID Transaksi: #{selectedReceiptModal.id}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedReceiptModal(null)}
                className="w-7 h-7 rounded-lg text-[#94A3B8] hover:text-[#172033] hover:bg-[#F1F5F9] flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Digital Receipt */}
            <div className="p-6 space-y-4 text-xs font-sans max-h-[75vh] overflow-y-auto">
              
              {/* Receipt Header Badge */}
              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E1E7F0] text-center space-y-1">
                <span className="text-[10px] font-semibold tracking-wider text-[#64748B] uppercase font-poppins">
                  Total Pembayaran Terverifikasi
                </span>
                <div className="text-2xl font-bold text-[#172033] font-poppins">
                  {formatRupiah(selectedReceiptModal.amount)}
                </div>
                <div className="pt-1">
                  {selectedReceiptModal.status === 'Success' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Lunas • Berhasil Dicatat di Escrow
                    </span>
                  ) : selectedReceiptModal.status === 'Pending' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      Menunggu Verifikasi Mutasi Bank Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      Kedaluwarsa / Dibatalkan
                    </span>
                  )}
                </div>
              </div>

              {/* Transaction Metadata */}
              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E1E7F0] space-y-2.5">
                <div className="flex justify-between items-center text-[#64748B]">
                  <span>Referensi Gateway:</span>
                  <span className="font-mono text-[#172033] font-semibold">{selectedReceiptModal.gatewayRef}</span>
                </div>
                <div className="flex justify-between items-center text-[#64748B]">
                  <span>Metode / Kanal:</span>
                  <span className="text-[#172033] font-medium">{selectedReceiptModal.method} ({selectedReceiptModal.channel})</span>
                </div>
                <div className="flex justify-between items-center text-[#64748B]">
                  <span>Waktu Dibuat:</span>
                  <span className="text-[#172033]">
                    {new Date(selectedReceiptModal.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} • {new Date(selectedReceiptModal.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                  </span>
                </div>
                {selectedReceiptModal.settledAt && (
                  <div className="flex justify-between items-center text-[#64748B]">
                    <span>Waktu Settlement:</span>
                    <span className="text-emerald-700 font-medium">
                      {new Date(selectedReceiptModal.settledAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} • {new Date(selectedReceiptModal.settledAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                    </span>
                  </div>
                )}
              </div>

              {/* Order & Parties Info */}
              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E1E7F0] space-y-2">
                <span className="text-[10px] font-semibold text-[#64748B] uppercase font-poppins block">
                  Rincian Pemesanan Rias Terkait
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-[11px] text-[#64748B] block">Pembayar (Klien):</span>
                    <strong className="text-[#172033] font-medium block">{selectedReceiptModal.clientName}</strong>
                    <span className="text-[11px] text-[#64748B]">{selectedReceiptModal.clientPhone}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#64748B] block">Mitra MUA Penerima:</span>
                    <strong className="text-[#172033] font-medium block">{selectedReceiptModal.muaName}</strong>
                    <span className="text-[11px] text-[#4778C7]">ID Booking #{selectedReceiptModal.bookingId}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-[#E1E7F0] text-xs">
                  <span className="text-[11px] text-[#64748B] block">Paket Layanan:</span>
                  <p className="font-semibold text-[#172033] mt-0.5">{selectedReceiptModal.serviceName}</p>
                </div>
              </div>

              {/* Proof note if any */}
              {selectedReceiptModal.proofNote && (
                <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200/70 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-[#1E40AF] mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Catatan Audit Bukti Setoran:</span>
                  </div>
                  <p className="text-[#1E40AF]/90 text-[11px] leading-relaxed">
                    {selectedReceiptModal.proofNote}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E1E7F0] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {selectedReceiptModal.status === 'Pending' && (
                  <button
                    onClick={() => approvePayment(selectedReceiptModal.id)}
                    className="px-3.5 py-1.5 bg-[#4778C7] hover:bg-[#3565AE] text-white rounded-xl text-xs font-semibold font-poppins transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Konfirmasi Pembayaran Lunas</span>
                  </button>
                )}
                <button
                  onClick={() => showToast(`Kuitansi resmi #${selectedReceiptModal.id} dikirim ke antrean cetak.`)}
                  className="px-3 py-1.5 bg-white border border-[#E1E7F0] hover:bg-[#F1F5F9] text-[#172033] rounded-xl text-xs font-semibold font-poppins transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Cetak Kuitansi</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedReceiptModal(null)}
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
