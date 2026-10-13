"use client";
import React, { useState, useMemo } from 'react';
import { 
  Tags, 
  Search, 
  Plus, 
  Edit3, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Building2, 
  Sparkles, 
  ArrowUpDown, 
  Layers, 
  Check, 
  X, 
  ExternalLink,
  SlidersHorizontal,
  ChevronRight,
  Info,
  Calendar
} from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { mockServices } from '@/data/mock-services';
import { mockMuas } from '@/data/mock-muas';

export interface CategoryItem {
  id: string;
  code: string;
  name: string;
  slug: string;
  description: string;
  standardDuration: number; // menit
  minPrice: number;
  maxPrice: number;
  status: 'ACTIVE' | 'INACTIVE';
  badge?: string;
  badgeColor?: string;
  updatedAt: string;
}

const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'CAT-WED',
    code: 'CAT-WED',
    name: 'Wedding (Pernikahan)',
    slug: 'wedding',
    description: 'Rias pengantin akad nikah dan resepsi lengkap, termasuk tata rias rambut/hijab styling, aksesoris pengantin, dan touch-up intensif.',
    standardDuration: 180,
    minPrice: 1500000,
    maxPrice: 2500000,
    status: 'ACTIVE',
    badge: 'Katalog Utama',
    badgeColor: 'bg-[#4778C7]/10 text-[#4778C7] border-[#4778C7]/20',
    updatedAt: '12 Okt 2026',
  },
  {
    id: 'CAT-BAR',
    code: 'CAT-BAR',
    name: 'Baralek (Adat Minang)',
    slug: 'baralek',
    description: 'Tata rias pengantin Minangkabau berkarakter bold nan tahan lama, presisi pemasangan suntiang atau deta, serta busana adat darat & pesisir.',
    standardDuration: 150,
    minPrice: 1200000,
    maxPrice: 1800000,
    status: 'ACTIVE',
    badge: 'Khas Minangkabau',
    badgeColor: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
    updatedAt: '12 Okt 2026',
  },
  {
    id: 'CAT-ENG',
    code: 'CAT-ENG',
    name: 'Lamaran / Engagement',
    slug: 'engagement',
    description: 'Riasan semi-formal flawless dan natural glow untuk prosesi pertunangan, tukar cincin, atau pertemuan keluarga besar.',
    standardDuration: 120,
    minPrice: 500000,
    maxPrice: 750000,
    status: 'ACTIVE',
    badge: 'Populer',
    badgeColor: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
    updatedAt: '12 Okt 2026',
  },
  {
    id: 'CAT-GRD',
    code: 'CAT-GRD',
    name: 'Wisuda & Yudisium',
    slug: 'graduation',
    description: 'Makeup tahan lama tahan keringat khusus prosesi seremonial wisuda sarjana dan pascasarjana perguruan tinggi di Kota Padang.',
    standardDuration: 90,
    minPrice: 250000,
    maxPrice: 350000,
    status: 'ACTIVE',
    badge: 'Volume Tinggi',
    badgeColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    updatedAt: '12 Okt 2026',
  },
  {
    id: 'CAT-PRT',
    code: 'CAT-PRT',
    name: 'Party & Formal Event',
    slug: 'party',
    description: 'Riasan glamor untuk pesta perayaan, gala dinner, resepsi keluarga, dan penampilan busana formal malam/siang.',
    standardDuration: 120,
    minPrice: 400000,
    maxPrice: 600000,
    status: 'ACTIVE',
    updatedAt: '12 Okt 2026',
  },
  {
    id: 'CAT-PHT',
    code: 'CAT-PHT',
    name: 'Photoshoot & Prewedding',
    slug: 'photoshoot',
    description: 'Riasan berdefinisi tinggi (*high definition camera-ready*) untuk pemotretan studio fotografi, video sinematik, maupun outdoor.',
    standardDuration: 150,
    minPrice: 400000,
    maxPrice: 750000,
    status: 'ACTIVE',
    updatedAt: '12 Okt 2026',
  },
];

export default function AdminKategoriPage() {
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  
  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [viewingServicesCategory, setViewingServicesCategory] = useState<CategoryItem | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    slug: '',
    description: '',
    standardDuration: 90,
    minPrice: 300000,
    maxPrice: 800000,
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
    badge: '',
  });

  // Hubungkan statistik riil layanan MUA per kategori
  const categoryStats = useMemo(() => {
    const stats: Record<string, { totalServices: number; muaList: { muaName: string; serviceName: string; price: number; duration: number; district: string }[] }> = {};
    
    categories.forEach(cat => {
      // Cari services yang cocok dengan kategori ini
      const matchedServices = mockServices.filter(svc => {
        const catKey = cat.slug.toLowerCase();
        const svcCat = svc.category.toLowerCase();
        if (catKey === 'wedding' && svcCat === 'wedding') return true;
        if (catKey === 'baralek' && svcCat === 'baralek') return true;
        if (catKey === 'graduation' && svcCat === 'graduation') return true;
        if (catKey === 'engagement' && svcCat === 'engagement') return true;
        if (catKey === 'party' && svcCat === 'party') return true;
        if (catKey === 'photoshoot' && (svcCat === 'photoshoot' || svc.name.toLowerCase().includes('prewed'))) return true;
        return false;
      });

      const muaList = matchedServices.map(svc => {
        const mua = mockMuas.find(m => m.id === svc.muaId);
        return {
          muaName: mua?.name || 'Mitra MUA',
          serviceName: svc.name,
          price: svc.price,
          duration: svc.durationMinutes,
          district: mua?.location || 'Kota Padang',
        };
      });

      stats[cat.id] = {
        totalServices: matchedServices.length,
        muaList,
      };
    });

    return stats;
  }, [categories]);

  // Filter Categories
  const filteredCategories = useMemo(() => {
    return categories.filter(cat => {
      const matchSearch = 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchStatus = 
        statusFilter === 'ALL' ? true : cat.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [categories, searchQuery, statusFilter]);

  // Action: Toggle Status
  const handleToggleStatus = (id: string) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id === id) {
        return {
          ...cat,
          status: cat.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
          updatedAt: '12 Okt 2026',
        };
      }
      return cat;
    }));
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormData({
      code: `CAT-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
      name: '',
      slug: '',
      description: '',
      standardDuration: 120,
      minPrice: 500000,
      maxPrice: 1500000,
      status: 'ACTIVE',
      badge: '',
    });
    setIsFormOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormData({
      code: cat.code,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      standardDuration: cat.standardDuration,
      minPrice: cat.minPrice,
      maxPrice: cat.maxPrice,
      status: cat.status,
      badge: cat.badge || '',
    });
    setIsFormOpen(true);
  };

  // Save Form
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingCategory) {
      // Update
      setCategories(prev => prev.map(cat => {
        if (cat.id === editingCategory.id) {
          return {
            ...cat,
            name: formData.name,
            code: formData.code,
            slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            description: formData.description,
            standardDuration: Number(formData.standardDuration),
            minPrice: Number(formData.minPrice),
            maxPrice: Number(formData.maxPrice),
            status: formData.status,
            badge: formData.badge || undefined,
            updatedAt: '12 Okt 2026',
          };
        }
        return cat;
      }));
    } else {
      // Add New
      const newCat: CategoryItem = {
        id: formData.code || `CAT-${Date.now().toString().slice(-3)}`,
        code: formData.code || `CAT-${Date.now().toString().slice(-3)}`,
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        description: formData.description,
        standardDuration: Number(formData.standardDuration),
        minPrice: Number(formData.minPrice),
        maxPrice: Number(formData.maxPrice),
        status: formData.status,
        badge: formData.badge || undefined,
        updatedAt: '12 Okt 2026',
      };
      setCategories(prev => [newCat, ...prev]);
    }
    setIsFormOpen(false);
  };

  const totalServicesAll = Object.values(categoryStats).reduce((acc, curr) => acc + curr.totalServices, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* ======================================================== */}
      {/* 1. EXECUTIVE HEADER (ZERO AI SLOP - DATA FIRST)          */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E1E7F0] pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-serif text-[#11182D]">
              Manajemen Kategori Layanan
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#4778C7]/10 text-[#4778C7] border border-[#4778C7]/20">
              {categories.filter(c => c.status === 'ACTIVE').length} Kategori Aktif
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Konfigurasi taksonomi rias Kota Padang, monitoring sebaran tarif MUA, dan kontrol visibilitas pencarian klien.
          </p>
        </div>

        {/* Global Action */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#E1E7F0] text-xs font-medium text-[#64748B] shadow-xs">
            <Layers className="w-3.5 h-3.5 text-[#4778C7]" />
            <span>{totalServicesAll} Paket Terdistribusi</span>
          </div>
          <button
            id="btn-add-category"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#11182D] hover:bg-[#1E293B] text-white rounded-xl text-xs font-semibold font-poppins transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kategori</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. FILTER & SEARCH CONTROL BAR                           */}
      {/* ======================================================== */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#E1E7F0] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Tab Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-[#11182D] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#11182D] hover:bg-[#F1F5F9]'
            }`}
          >
            Semua ({categories.length})
          </button>
          <button
            onClick={() => setStatusFilter('ACTIVE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              statusFilter === 'ACTIVE'
                ? 'bg-[#11182D] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#11182D] hover:bg-[#F1F5F9]'
            }`}
          >
            Katalog Aktif ({categories.filter(c => c.status === 'ACTIVE').length})
          </button>
          <button
            onClick={() => setStatusFilter('INACTIVE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              statusFilter === 'INACTIVE'
                ? 'bg-[#11182D] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#11182D] hover:bg-[#F1F5F9]'
            }`}
          >
            Nonaktif ({categories.filter(c => c.status === 'INACTIVE').length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <input
            id="search-category"
            type="text"
            placeholder="Cari kode atau nama kategori..."
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

      {/* ======================================================== */}
      {/* 3. HIGH-DENSITY CATEGORY MANAGEMENT TABLE                */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl border border-[#E1E7F0] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E1E7F0] text-[#64748B] font-semibold uppercase tracking-wider font-poppins">
                <th className="py-3 px-4 w-28">Kode</th>
                <th className="py-3 px-4">Nama & Ruang Lingkup Layanan</th>
                <th className="py-3 px-4 text-center">Mitra & Paket</th>
                <th className="py-3 px-4 text-right">Rentang Tarif Pasar</th>
                <th className="py-3 px-4 text-center">Visibilitas</th>
                <th className="py-3 px-4 text-center">Pembaruan</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1E7F0]">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#94A3B8]">
                    <Tags className="w-8 h-8 mx-auto text-[#CBD5E1] mb-2" />
                    <p className="font-medium text-sm text-[#11182D]">Tidak ada kategori ditemukan</p>
                    <p className="text-xs text-[#64748B] mt-0.5">Silakan atur ulang kata kunci pencarian atau filter status.</p>
                  </td>
                </tr>
              ) : (
                filteredCategories.map(cat => {
                  const stat = categoryStats[cat.id] || { totalServices: 0, muaList: [] };
                  const isMinang = cat.id === 'CAT-BAR';

                  return (
                    <tr 
                      key={cat.id} 
                      className="hover:bg-[#F8FAFC]/80 transition-colors group"
                    >
                      {/* 1. Kode Kategori */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#11182D]">
                        <span className="px-2 py-1 rounded-md bg-[#F1F5F9] border border-[#E1E7F0] text-[11px] text-[#4778C7]">
                          {cat.code}
                        </span>
                      </td>

                      {/* 2. Nama & Deskripsi */}
                      <td className="py-3.5 px-4 max-w-md">
                        <div className="flex items-center gap-2">
                          <span className="font-poppins font-bold text-sm text-[#11182D]">
                            {cat.name}
                          </span>
                          {cat.badge && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cat.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                              {cat.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#64748B] mt-1 leading-relaxed line-clamp-2">
                          {cat.description}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[#94A3B8]">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#4778C7]" />
                            <span>Durasi Standar: {cat.standardDuration} Menit</span>
                          </span>
                        </div>
                      </td>

                      {/* 3. Mitra & Paket Layanan */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <button
                            id={`btn-view-services-${cat.id}`}
                            onClick={() => setViewingServicesCategory(cat)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#11182D] text-xs font-semibold transition-colors cursor-pointer"
                            title="Klik untuk melihat paket MUA"
                          >
                            <Building2 className="w-3 h-3 text-[#4778C7]" />
                            <span>{stat.totalServices} Paket</span>
                            <ChevronRight className="w-3 h-3 text-[#94A3B8]" />
                          </button>
                          <span className="text-[10px] text-[#94A3B8] mt-0.5">
                            {stat.muaList.length} Studio MUA
                          </span>
                        </div>
                      </td>

                      {/* 4. Rentang Tarif Pasar */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="font-mono font-semibold text-[#11182D] text-xs">
                          {formatRupiah(cat.minPrice)}
                        </div>
                        <div className="text-[10px] text-[#94A3B8] font-mono">
                          s/d {formatRupiah(cat.maxPrice)}
                        </div>
                      </td>

                      {/* 5. Visibilitas Katalog */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          id={`btn-toggle-${cat.id}`}
                          onClick={() => handleToggleStatus(cat.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors cursor-pointer ${
                            cat.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {cat.status === 'ACTIVE' ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Aktif di Katalog</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-slate-500" />
                              <span>Nonaktif</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* 6. Pembaruan */}
                      <td className="py-3.5 px-4 text-center text-[#64748B] text-[11px]">
                        {cat.updatedAt}
                      </td>

                      {/* 7. Aksi */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            id={`btn-detail-${cat.id}`}
                            onClick={() => setViewingServicesCategory(cat)}
                            title="Lihat Daftar Layanan"
                            className="p-1.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#11182D] border border-[#E1E7F0] rounded-xl transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`btn-edit-${cat.id}`}
                            onClick={() => handleOpenEditModal(cat)}
                            title="Edit Kategori"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#11182D] hover:bg-[#1E293B] text-white rounded-xl text-xs font-semibold font-poppins transition-colors shadow-xs cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {/* Table Footer Summary */}
            <tfoot>
              <tr className="bg-[#F8FAFC] border-t border-[#E1E7F0] font-semibold text-[#64748B]">
                <td className="py-3 px-4 font-mono text-xs">TOTAL</td>
                <td className="py-3 px-4 font-bold text-[#11182D]">
                  {categories.length} Kategori Layanan Rias
                </td>
                <td className="py-3 px-4 text-center font-bold text-[#11182D]">
                  {totalServicesAll} Layanan Aktif
                </td>
                <td className="py-3 px-4 text-right font-mono text-[11px] text-[#4778C7]">
                  Pusat Tarif Resmi
                </td>
                <td className="py-3 px-4 text-center text-emerald-700 font-bold">
                  {categories.filter(c => c.status === 'ACTIVE').length} Aktif
                </td>
                <td className="py-3 px-4 text-center text-[10px]">
                  12 OKT 2026
                </td>
                <td className="py-3 px-4 text-right"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. MODAL FORM: TAMBAH / EDIT KATEGORI                     */}
      {/* ======================================================== */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E1E7F0] shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E1E7F0] pb-4">
              <div className="flex items-center gap-2">
                <Tags className="w-4 h-4 text-[#4778C7]" />
                <h3 className="font-poppins font-bold text-base text-[#11182D]">
                  {editingCategory ? 'Edit Kategori Layanan' : 'Tambah Kategori Layanan Baru'}
                </h3>
              </div>
              <button
                id="btn-close-form-x"
                onClick={() => setIsFormOpen(false)}
                className="text-[#94A3B8] hover:text-[#11182D] p-1 rounded-lg hover:bg-[#F1F5F9] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveForm} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#11182D] mb-1">
                    Kode Kategori
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="Contoh: CAT-NEW"
                    className="w-full bg-[#F8FAFC] border border-[#E1E7F0] text-xs rounded-xl px-3 py-2 font-mono text-[#11182D] focus:outline-none focus:ring-1 focus:ring-[#4778C7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#11182D] mb-1">
                    Slug URL
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
                    placeholder="contoh: new-look"
                    className="w-full bg-[#F8FAFC] border border-[#E1E7F0] text-xs rounded-xl px-3 py-2 text-[#11182D] focus:outline-none focus:ring-1 focus:ring-[#4778C7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#11182D] mb-1">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Photoshoot & Editorial"
                  className="w-full bg-[#F8FAFC] border border-[#E1E7F0] text-xs rounded-xl px-3 py-2 text-[#11182D] focus:outline-none focus:ring-1 focus:ring-[#4778C7]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#11182D] mb-1">
                  Ruang Lingkup & Deskripsi
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Jelaskan cakupan layanan yang termasuk dalam kategori ini..."
                  className="w-full bg-[#F8FAFC] border border-[#E1E7F0] text-xs rounded-xl p-3 text-[#11182D] focus:outline-none focus:ring-1 focus:ring-[#4778C7] leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#11182D] mb-1">
                    Durasi (Menit)
                  </label>
                  <input
                    type="number"
                    min={30}
                    step={15}
                    value={formData.standardDuration}
                    onChange={e => setFormData({ ...formData, standardDuration: Number(e.target.value) })}
                    className="w-full bg-[#F8FAFC] border border-[#E1E7F0] text-xs rounded-xl px-3 py-2 text-[#11182D] focus:outline-none focus:ring-1 focus:ring-[#4778C7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#11182D] mb-1">
                    Tarif Bawah (Rp)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={50000}
                    value={formData.minPrice}
                    onChange={e => setFormData({ ...formData, minPrice: Number(e.target.value) })}
                    className="w-full bg-[#F8FAFC] border border-[#E1E7F0] text-xs rounded-xl px-3 py-2 font-mono text-[#11182D] focus:outline-none focus:ring-1 focus:ring-[#4778C7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#11182D] mb-1">
                    Tarif Atas (Rp)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={50000}
                    value={formData.maxPrice}
                    onChange={e => setFormData({ ...formData, maxPrice: Number(e.target.value) })}
                    className="w-full bg-[#F8FAFC] border border-[#E1E7F0] text-xs rounded-xl px-3 py-2 font-mono text-[#11182D] focus:outline-none focus:ring-1 focus:ring-[#4778C7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-[#11182D] mb-1">
                    Visibilitas Katalog
                  </label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
                    className="w-full bg-[#F8FAFC] border border-[#E1E7F0] text-xs rounded-xl px-3 py-2 text-[#11182D] focus:outline-none focus:ring-1 focus:ring-[#4778C7] cursor-pointer"
                  >
                    <option value="ACTIVE">Aktif (Tampil di Klien)</option>
                    <option value="INACTIVE">Nonaktif (Arsip)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#11182D] mb-1">
                    Badge Tag (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={e => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Contoh: Khas Minang"
                    className="w-full bg-[#F8FAFC] border border-[#E1E7F0] text-xs rounded-xl px-3 py-2 text-[#11182D] focus:outline-none focus:ring-1 focus:ring-[#4778C7]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#E1E7F0]">
                <button
                  type="button"
                  id="btn-cancel-form"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-[#E1E7F0] text-[#64748B] hover:bg-[#F8FAFC] rounded-xl text-xs font-semibold font-poppins transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  id="btn-save-category"
                  className="px-5 py-2 bg-[#11182D] hover:bg-[#1E293B] text-white rounded-xl text-xs font-semibold font-poppins transition-colors shadow-xs cursor-pointer"
                >
                  {editingCategory ? 'Simpan Perubahan' : 'Tambahkan Kategori'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. MODAL PRATINJAU DAFTAR LAYANAN MITRA PER KATEGORI     */}
      {/* ======================================================== */}
      {viewingServicesCategory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E1E7F0] shadow-2xl max-w-2xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E1E7F0] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#4778C7]" />
                  <h3 className="font-poppins font-bold text-base text-[#11182D]">
                    Paket Layanan Mitra Terdaftar
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#4778C7]/10 text-[#4778C7]">
                    {viewingServicesCategory.name}
                  </span>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Daftar studio rias pengantin dan MUA aktif yang menyediakan kategori ini di Kota Padang.
                </p>
              </div>
              <button
                id="btn-close-view-services-x"
                onClick={() => setViewingServicesCategory(null)}
                className="text-[#94A3B8] hover:text-[#11182D] p-1 rounded-lg hover:bg-[#F1F5F9] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List Table */}
            <div className="border border-[#E1E7F0] rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E1E7F0] text-[#64748B] font-semibold font-poppins">
                    <th className="py-2.5 px-3">Mitra Studio MUA</th>
                    <th className="py-2.5 px-3">Nama Paket Layanan</th>
                    <th className="py-2.5 px-3">Kecamatan</th>
                    <th className="py-2.5 px-3 text-center">Durasi</th>
                    <th className="py-2.5 px-3 text-right">Tarif Paket</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E1E7F0]">
                  {categoryStats[viewingServicesCategory.id]?.muaList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-[#94A3B8]">
                        Belum ada MUA yang mendaftarkan paket pada kategori ini.
                      </td>
                    </tr>
                  ) : (
                    categoryStats[viewingServicesCategory.id]?.muaList.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#F8FAFC]">
                        <td className="py-2.5 px-3 font-semibold text-[#11182D]">
                          {item.muaName}
                        </td>
                        <td className="py-2.5 px-3 text-[#4778C7] font-medium">
                          {item.serviceName}
                        </td>
                        <td className="py-2.5 px-3 text-[#64748B]">
                          {item.district}
                        </td>
                        <td className="py-2.5 px-3 text-center text-[#64748B]">
                          {item.duration} mnt
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-[#11182D]">
                          {formatRupiah(item.price)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[#64748B]">
                Total: {categoryStats[viewingServicesCategory.id]?.muaList.length || 0} Paket MUA Aktif
              </span>
              <button
                id="btn-close-view-services"
                onClick={() => setViewingServicesCategory(null)}
                className="px-4 py-2 bg-[#11182D] hover:bg-[#1E293B] text-white rounded-xl text-xs font-semibold font-poppins transition-colors cursor-pointer"
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
