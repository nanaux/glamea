"use client";
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Users, 
  Building2, 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  Filter, 
  Download, 
  UserPlus, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Mail, 
  Phone, 
  Star, 
  Calendar, 
  CreditCard, 
  ExternalLink, 
  Copy, 
  Check, 
  X,
  Sparkles,
  ArrowUpDown,
  BadgeCheck
} from 'lucide-react';
import { mockClients, mockAdmins } from '@/data/mock-users';
import { mockMuas, mockMuaAggregates } from '@/data/mock-muas';
import { mockBookings } from '@/data/mock-bookings';
import { formatRupiah } from '@/lib/utils';
import { UserRole } from '@/types';

interface UnifiedUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
  location?: string;
  bio?: string;
  makeupStyles?: string[];
  isVerified?: boolean;
  portfolioImage?: string;
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
}

export default function AdminAkunPage() {
  // Initialize unified user list with state for interactive verification toggling
  // Hanya menampilkan akun aktif: Alya Makeup, Nadira Beauty, Bella Makeupart, Siti Aminah, dan Rina Permatasari
  const initialUsers: UnifiedUser[] = useMemo(() => {
    const allowedMuaNames = ['Alya Makeup', 'Nadira Beauty', 'Bella Makeupart'];
    const muas: UnifiedUser[] = mockMuas
      .filter(m => allowedMuaNames.includes(m.name))
      .map(m => ({
        ...m
      }));

    const allowedClientNames = ['Siti Aminah', 'Rina Permatasari'];
    const clients: UnifiedUser[] = mockClients
      .filter(c => allowedClientNames.includes(c.name))
      .map(c => ({
        ...c,
        location: 'Padang Barat',
        isVerified: true
      }));

    return [...muas, ...clients];
  }, []);

  const [users, setUsers] = useState<UnifiedUser[]>(initialUsers);
  const [selectedRole, setSelectedRole] = useState<'ALL' | UserRole>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationFilter, setVerificationFilter] = useState<'ALL' | 'VERIFIED' | 'UNVERIFIED'>('ALL');
  const [locationFilter, setLocationFilter] = useState<string>('ALL');
  const [selectedUserModal, setSelectedUserModal] = useState<UnifiedUser | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    showToast(`${label} berhasil disalin ke clipboard`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleVerification = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = !u.isVerified;
        showToast(`Status verifikasi ${u.name} diubah menjadi: ${nextStatus ? 'Terverifikasi' : 'Belum Terverifikasi'}`);
        return { ...u, isVerified: nextStatus };
      }
      return u;
    }));
    if (selectedUserModal && selectedUserModal.id === userId) {
      setSelectedUserModal(prev => prev ? ({ ...prev, isVerified: !prev.isVerified }) : null);
    }
  };

  // Distinct Padang locations for filter
  const padangDistricts = useMemo(() => {
    const districts = new Set<string>();
    users.forEach(m => {
      if (m.location) districts.add(m.location);
    });
    return Array.from(districts);
  }, [users]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Role filter
      if (selectedRole !== 'ALL' && user.role !== selectedRole) return false;

      // Verification filter
      if (verificationFilter === 'VERIFIED' && !user.isVerified) return false;
      if (verificationFilter === 'UNVERIFIED' && user.isVerified) return false;

      // Location filter
      if (locationFilter !== 'ALL' && user.location !== locationFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = user.name.toLowerCase().includes(q);
        const matchEmail = user.email.toLowerCase().includes(q);
        const matchPhone = user.phone.includes(q);
        const matchLocation = user.location ? user.location.toLowerCase().includes(q) : false;
        if (!matchName && !matchEmail && !matchPhone && !matchLocation) return false;
      }

      return true;
    });
  }, [users, selectedRole, verificationFilter, locationFilter, searchQuery]);

  // Metric counts
  const totalUsers = users.length;
  const totalMua = users.filter(u => u.role === 'MUA').length;
  const verifiedMua = users.filter(u => u.role === 'MUA' && u.isVerified).length;
  const totalClients = users.filter(u => u.role === 'CLIENT').length;
  const totalAdmins = users.filter(u => u.role === 'ADMIN').length;

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
              Manajemen Akun Pengguna
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#4778C7] border border-[#BFDBFE]">
              {totalUsers} Akun Terdaftar
            </span>
          </div>
          <p className="text-sm text-[#64748B] mt-1 font-sans">
            Direktori operasional mitra MUA terdaftar, akun pelanggan aktif, dan tata kelola hak akses GLAMÉA
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button 
            onClick={() => showToast('Data direktori pengguna diekspor ke format CSV')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#E1E7F0] rounded-xl text-xs font-semibold text-[#172033] hover:bg-[#F8FAFC] transition-colors shadow-xs font-poppins"
          >
            <Download className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Ekspor CSV</span>
          </button>

          <button 
            onClick={() => showToast('Form pendaftaran akun baru siap digunakan')}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#4778C7] hover:bg-[#3565AE] text-white rounded-xl text-xs font-semibold transition-all shadow-xs font-poppins"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Tambah Pengguna</span>
          </button>
        </div>
      </div>



      {/* Main Panel: Filter & Data Table (Zero Nested Cards) */}
      <div className="bg-white border border-[#E1E7F0] rounded-2xl shadow-xs overflow-hidden">
        
        {/* Top Filter & Search Toolbar */}
        <div className="p-4 md:p-5 border-b border-[#E1E7F0] space-y-4">
          
          {/* Segmented Role Tabs & Results Counter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="inline-flex p-1 bg-[#F1F5F9] rounded-xl text-xs font-semibold font-poppins">
              <button
                onClick={() => setSelectedRole('ALL')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  selectedRole === 'ALL'
                    ? 'bg-white text-[#172033] shadow-xs'
                    : 'text-[#64748B] hover:text-[#172033]'
                }`}
              >
                Semua ({users.length})
              </button>
              <button
                onClick={() => setSelectedRole('MUA')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  selectedRole === 'MUA'
                    ? 'bg-white text-[#172033] shadow-xs'
                    : 'text-[#64748B] hover:text-[#172033]'
                }`}
              >
                Mitra MUA ({totalMua})
              </button>
              <button
                onClick={() => setSelectedRole('CLIENT')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  selectedRole === 'CLIENT'
                    ? 'bg-white text-[#172033] shadow-xs'
                    : 'text-[#64748B] hover:text-[#172033]'
                }`}
              >
                Klien ({totalClients})
              </button>
              {totalAdmins > 0 && (
                <button
                  onClick={() => setSelectedRole('ADMIN')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all ${
                    selectedRole === 'ADMIN'
                      ? 'bg-white text-[#172033] shadow-xs'
                      : 'text-[#64748B] hover:text-[#172033]'
                  }`}
                >
                  Admin ({totalAdmins})
                </button>
              )}
            </div>

            <div className="text-xs text-[#64748B] font-sans">
              Menampilkan <strong className="text-[#172033] font-medium">{filteredUsers.length}</strong> dari {users.length} akun
            </div>
          </div>

          {/* Search Bar & Dropdown Selects */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama, email, no HP, atau kecamatan..."
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

            {/* Status Filter */}
            <div className="sm:col-span-3">
              <select
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E1E7F0] focus:border-[#4778C7] focus:bg-white rounded-xl text-xs text-[#172033] focus:outline-hidden transition-colors font-sans"
              >
                <option value="ALL">Semua Status Verifikasi</option>
                <option value="VERIFIED">Hanya Terverifikasi</option>
                <option value="UNVERIFIED">Menunggu / Belum Verifikasi</option>
              </select>
            </div>

            {/* Location Filter */}
            <div className="sm:col-span-3">
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E1E7F0] focus:border-[#4778C7] focus:bg-white rounded-xl text-xs text-[#172033] focus:outline-hidden transition-colors font-sans"
              >
                <option value="ALL">Semua Kecamatan</option>
                {padangDistricts.map(dist => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Flat Structured Table (Zero Nested Cards) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="border-b border-[#E1E7F0] bg-[#F8FAFC]/60 text-[#64748B]">
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px] font-poppins">Pengguna</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px] font-poppins">Tipe Akun</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px] font-poppins">Kontak & WhatsApp</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px] font-poppins">Wilayah</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px] font-poppins">Status Akun</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px] font-poppins">Performa / Sesi</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px] text-right font-poppins">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1E7F0]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#64748B] font-sans">
                    <p className="text-sm font-medium text-[#172033]">Tidak ada akun yang sesuai kriteria pencarian</p>
                    <p className="text-xs mt-1 text-[#94A3B8]">Coba sesuaikan kata kunci atau bersihkan filter di atas.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const aggregate = user.role === 'MUA' ? mockMuaAggregates[user.id] : null;
                  const clientBookingsCount = user.role === 'CLIENT' ? mockBookings.filter(b => b.clientId === user.id).length : 0;

                  return (
                    <tr key={user.id} className="hover:bg-[#F8FAFC] transition-colors group">
                      
                      {/* Name & ID Column */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {/* Avatar Circle */}
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
                            user.role === 'MUA' 
                              ? 'bg-[#F5F3FF] text-[#8B5CF6] border border-[#DDD6FE]'
                              : user.role === 'ADMIN'
                              ? 'bg-[#172033] text-white'
                              : 'bg-[#EFF6FF] text-[#4778C7] border border-[#BFDBFE]'
                          }`}>
                            {user.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span 
                                onClick={() => setSelectedUserModal(user)}
                                className="font-semibold text-[#172033] hover:text-[#4778C7] cursor-pointer transition-colors font-poppins text-xs"
                              >
                                {user.name}
                              </span>
                              {user.isVerified && (
                                <span title="Akun Terverifikasi" className="inline-flex">
                                  <BadgeCheck className="w-3.5 h-3.5 text-[#4778C7] shrink-0" />
                                </span>
                              )}
                            </div>
                            <span className="block text-[11px] text-[#94A3B8] font-mono">
                              #{user.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role Pill Column */}
                      <td className="py-3.5 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold font-sans ${
                          user.role === 'MUA'
                            ? 'bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE]'
                            : user.role === 'ADMIN'
                            ? 'bg-[#F1F5F9] text-[#1E293B] border border-[#CBD5E1]'
                            : 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]'
                        }`}>
                          {user.role === 'MUA' ? 'Mitra MUA' : user.role === 'CLIENT' ? 'Klien' : 'Super Admin'}
                        </span>
                      </td>

                      {/* Contact & WA Column */}
                      <td className="py-3.5 px-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-xs text-[#172033]">
                            <Mail className="w-3 h-3 text-[#94A3B8] shrink-0" />
                            <span className="truncate max-w-[170px]" title={user.email}>{user.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
                            <Phone className="w-3 h-3 text-[#94A3B8] shrink-0" />
                            <span>{user.phone}</span>
                            <button
                              onClick={() => copyToClipboard(user.phone, 'Nomor Telepon')}
                              className="text-[#94A3B8] hover:text-[#4778C7] p-0.5"
                              title="Salin Nomor WhatsApp"
                            >
                              {copiedId === user.phone ? <Check className="w-2.5 h-2.5 text-emerald-600" /> : <Copy className="w-2.5 h-2.5" />}
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Location Column */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5 text-xs text-[#172033]">
                          <MapPin className="w-3 h-3 text-[#64748B] shrink-0" />
                          <span className="font-medium">{user.location || 'Kota Padang'}</span>
                        </div>
                        <span className="block text-[10px] text-[#94A3B8] ml-4.5">Sumatera Barat</span>
                      </td>

                      {/* Verification Status Column */}
                      <td className="py-3.5 px-3">
                        {user.isVerified ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Terverifikasi
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/70">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            Menunggu Audit
                          </span>
                        )}
                      </td>

                      {/* Performance / Sessions Column */}
                      <td className="py-3.5 px-3">
                        {user.role === 'MUA' && aggregate ? (
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 font-semibold text-[#172033] text-xs">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                              {aggregate.rating.toFixed(1)}
                            </span>
                            <span className="text-[11px] text-[#64748B]">
                              ({aggregate.reviewCount} ulasan)
                            </span>
                          </div>
                        ) : user.role === 'CLIENT' ? (
                          <span className="text-xs text-[#64748B]">
                            <strong className="text-[#172033]">{clientBookingsCount}</strong> Pesanan Selesai
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#64748B]">
                            Akses Penuh
                          </span>
                        )}
                      </td>

                      {/* Action Column */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedUserModal(user)}
                            className="px-2.5 py-1 text-xs font-semibold text-[#4778C7] hover:bg-[#EFF6FF] rounded-lg transition-colors font-poppins"
                          >
                            Detail
                          </button>

                          {user.role === 'MUA' && (
                            <button
                              onClick={() => toggleVerification(user.id)}
                              className={`px-2 py-1 text-[11px] font-medium rounded-lg transition-colors ${
                                user.isVerified
                                  ? 'text-amber-700 hover:bg-amber-50'
                                  : 'text-emerald-700 hover:bg-emerald-50'
                              }`}
                              title={user.isVerified ? 'Tangguhkan Verifikasi' : 'Setujui Verifikasi'}
                            >
                              {user.isVerified ? 'Tangguhkan' : 'Verifikasi'}
                            </button>
                          )}
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
          <span>Menampilkan seluruh direktori ekosistem GLAMÉA Kota Padang</span>
          <div className="flex items-center gap-2">
            <span className="text-[11px]">Status: Real-time Mock Integrasi</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUserModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E1E7F0] rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-up">
            
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-[#E1E7F0] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                  selectedUserModal.role === 'MUA'
                    ? 'bg-[#F5F3FF] text-[#8B5CF6]'
                    : selectedUserModal.role === 'ADMIN'
                    ? 'bg-[#172033] text-white'
                    : 'bg-[#EFF6FF] text-[#4778C7]'
                }`}>
                  {selectedUserModal.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#172033] font-poppins">
                    Rincian Profil Akun
                  </h3>
                  <p className="text-[11px] text-[#64748B] font-mono">
                    ID: {selectedUserModal.id}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedUserModal(null)}
                className="w-7 h-7 rounded-lg text-[#94A3B8] hover:text-[#172033] hover:bg-[#F1F5F9] flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs font-sans max-h-[75vh] overflow-y-auto">
              {/* Profile Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-bold text-[#172033] font-poppins">
                    {selectedUserModal.name}
                  </h4>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    {selectedUserModal.email} • {selectedUserModal.phone}
                  </p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                  selectedUserModal.role === 'MUA'
                    ? 'bg-[#F5F3FF] text-[#7C3AED]'
                    : selectedUserModal.role === 'ADMIN'
                    ? 'bg-[#F1F5F9] text-[#1E293B]'
                    : 'bg-[#EFF6FF] text-[#2563EB]'
                }`}>
                  {selectedUserModal.role}
                </span>
              </div>

              {/* Bio if MUA */}
              {selectedUserModal.bio && (
                <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E1E7F0]">
                  <p className="text-[11px] font-semibold text-[#64748B] uppercase font-poppins mb-1">
                    Biografi & Spesialisasi
                  </p>
                  <p className="text-xs text-[#172033] leading-relaxed">
                    {selectedUserModal.bio}
                  </p>
                </div>
              )}

              {/* Makeup Styles if MUA */}
              {selectedUserModal.makeupStyles && selectedUserModal.makeupStyles.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-[#64748B] uppercase font-poppins mb-2">
                    Keahlian Gaya Rias
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedUserModal.makeupStyles.map(style => (
                      <span key={style} className="px-2.5 py-1 bg-[#F1F5F9] text-[#172033] rounded-lg text-[11px] font-medium">
                        {style}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bank Account Info if MUA */}
              {selectedUserModal.bankAccount && (
                <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E1E7F0] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#64748B] uppercase font-poppins">
                      Rekening Pencairan Escrow
                    </span>
                    <span className="text-[10px] font-bold text-[#4778C7] bg-[#EFF6FF] px-2 py-0.5 rounded">
                      {selectedUserModal.bankAccount.bankName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#64748B]">No. Rekening:</span>
                    <span className="font-mono font-semibold text-[#172033]">{selectedUserModal.bankAccount.accountNumber}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#64748B]">Atas Nama:</span>
                    <span className="font-medium text-[#172033]">{selectedUserModal.bankAccount.accountHolder}</span>
                  </div>
                </div>
              )}

              {/* Registration & Location */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#E1E7F0]">
                <div>
                  <span className="text-[11px] text-[#64748B] block">Wilayah Operasional</span>
                  <span className="font-semibold text-[#172033] mt-0.5 block">{selectedUserModal.location || 'Kota Padang'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#64748B] block">Terdaftar Sejak</span>
                  <span className="font-semibold text-[#172033] mt-0.5 block">
                    {new Date(selectedUserModal.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E1E7F0] flex items-center justify-between">
              {selectedUserModal.role === 'MUA' ? (
                <button
                  onClick={() => toggleVerification(selectedUserModal.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-poppins transition-colors ${
                    selectedUserModal.isVerified
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {selectedUserModal.isVerified ? 'Tangguhkan Verifikasi' : 'Setujui Verifikasi MUA'}
                </button>
              ) : (
                <span className="text-[11px] text-[#64748B]">Akun Terdaftar Sistem</span>
              )}

              <button
                onClick={() => setSelectedUserModal(null)}
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
