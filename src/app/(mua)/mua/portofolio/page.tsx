"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Sparkles,
  PlusCircle, 
  Eye, 
  Heart, 
  Star, 
  Search, 
  Filter, 
  ArrowUpDown, 
  X, 
  CheckCircle2, 
  ExternalLink, 
  Trash2, 
  Tag, 
  Palette, 
  Layers, 
  Check, 
  Image as ImageIcon,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { initialPortfolioItems, PortfolioItem } from '@/data/mock-portfolio';
import { formatRupiah } from '@/lib/utils';

type CategoryFilter = 'ALL' | 'Bridal & Baralek' | 'Wisuda & Graduation' | 'Lamaran & Engagement' | 'Editorial & Pesta';
type SortOption = 'NEWEST' | 'POPULAR' | 'PINNED';

export default function MuaPortofolioPage() {
  const [portfolioList, setPortfolioList] = useState<PortfolioItem[]>(initialPortfolioItems);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('NEWEST');
  
  // Modals state
  const [inspectItem, setInspectItem] = useState<PortfolioItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for "+ Unggah Karya Baru"
  const [newLook, setNewLook] = useState({
    title: '',
    category: 'Bridal & Baralek' as PortfolioItem['category'],
    imageUrl: '/images/hero-editorial.png',
    description: '',
    technique: '',
    keyProducts: '',
    serviceName: 'Paket Baralek Gadang Premium',
    servicePrice: '3500000',
    isPinned: false
  });

  const availableImagePresets = [
    { label: 'Suntiang Minang Glam', url: '/images/hero-editorial.png' },
    { label: 'Soft Graduation Look', url: '/images/mua-nadira.png' },
    { label: 'Rose Gold Engagement', url: '/images/mua-alya.png' },
    { label: 'Sunset Arabian Eyes', url: '/images/mua-citra.png' },
    { label: 'Classic Akad Bride', url: '/images/mua-bella.png' },
  ];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Toggle Pinned Status
  const handleTogglePin = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPortfolioList(prev => prev.map(item => {
      if (item.id === id) {
        const nextState = !item.isPinned;
        triggerToast(nextState ? `"${item.title}" disematkan ke feed utama profil.` : `"${item.title}" dilepas dari feed unggulan.`);
        return { ...item, isPinned: nextState };
      }
      return item;
    }));
  };

  // Delete/Archive Item
  const handleDeleteItem = (id: string, title: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm(`Hapus karya rias "${title}" dari galeri portofolio studio Anda?`)) {
      setPortfolioList(prev => prev.filter(item => item.id !== id));
      if (inspectItem?.id === id) setInspectItem(null);
      triggerToast(`Karya "${title}" telah dihapus.`);
    }
  };

  // Submit New Look
  const handleSaveNewLook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLook.title.trim()) {
      alert('Mohon masukkan judul karya rias');
      return;
    }

    const productsArray = newLook.keyProducts
      ? newLook.keyProducts.split(',').map(p => p.trim()).filter(Boolean)
      : ['Foundation High-Definition', 'Eye Shadow Palette', 'Setting Spray Longwear'];

    const newItem: PortfolioItem = {
      id: `port-${Date.now()}`,
      title: newLook.title,
      category: newLook.category,
      imageUrl: newLook.imageUrl || '/images/hero-editorial.png',
      description: newLook.description || 'Karya riasan terbaru dari Alya Makeup dengan formula tahan lama dan sentuhan keindahan estetika Minang.',
      technique: newLook.technique || 'Flawless Complexion, Soft Glam Focus',
      keyProducts: productsArray,
      linkedService: {
        name: newLook.serviceName || 'Paket Layanan Rias Khusus',
        price: parseInt(newLook.servicePrice, 10) || 1500000
      },
      viewsCount: 1,
      savesCount: 0,
      isPinned: newLook.isPinned,
      publishedDate: '12 Okt 2026'
    };

    setPortfolioList([newItem, ...portfolioList]);
    setIsUploadModalOpen(false);
    triggerToast(`Karya baru "${newItem.title}" berhasil diunggah ke showroom!`);

    // Reset Form
    setNewLook({
      title: '',
      category: 'Bridal & Baralek',
      imageUrl: '/images/hero-editorial.png',
      description: '',
      technique: '',
      keyProducts: '',
      serviceName: 'Paket Baralek Gadang Premium',
      servicePrice: '3500000',
      isPinned: false
    });
  };

  // Filtered & Sorted List
  const filteredList = useMemo(() => {
    return portfolioList
      .filter(item => {
        if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchProduct = item.keyProducts.some(p => p.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchProduct) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'PINNED') {
          if (a.isPinned === b.isPinned) return 0;
          return a.isPinned ? -1 : 1;
        }
        if (sortOption === 'POPULAR') {
          return b.viewsCount - a.viewsCount;
        }
        return 0; // Default order
      });
  }, [portfolioList, selectedCategory, searchQuery, sortOption]);

  // Aggregate Stats
  const totalViews = portfolioList.reduce((acc, curr) => acc + curr.viewsCount, 0);
  const totalSaves = portfolioList.reduce((acc, curr) => acc + curr.savesCount, 0);
  const pinnedCount = portfolioList.filter(item => item.isPinned).length;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* 1. Atelier Header & Executive Showroom Summary */}
      <div className="bg-white rounded-2xl border border-[#EDE3D9] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#641A2B] tracking-tight">
              Koleksi Portofolio Rias
            </h1>
            
            <p className="text-sm text-[#7A6E6A] max-w-2xl font-light leading-relaxed">
              Kurasi hasil karya rias terbaik studio Anda untuk ditampilkan secara eksklusif pada profil publik calon pengantin di Kota Padang.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap font-poppins">
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2.5 rounded-xl border border-[#EDE3D9] text-[#641A2B] bg-[#FAF6F0]/60 hover:bg-[#FAF6F0] text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <span>Pratinjau Publik</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </Link>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#641A2B] hover:bg-[#4E1220] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-[#C9A45C]" />
              <span>+ Unggah Karya Baru</span>
            </button>
          </div>

        </div>

        {/* Performance Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-[#F5EFEB]">
          <div className="p-3.5 rounded-xl bg-[#FAF6F0]/80 border border-[#EDE3D9]/60">
            <span className="text-xs font-poppins text-[#7A6E6A] block">Total Look Aktif</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg sm:text-xl font-bold font-poppins text-[#641A2B]">
                {portfolioList.length}
              </span>
              <span className="text-xs text-[#7A6E6A]">Karya</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF6F0]/80 border border-[#EDE3D9]/60">
            <span className="text-xs font-poppins text-[#7A6E6A] block">Unggulan di Profil</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg sm:text-xl font-bold font-poppins text-[#C9A45C]">
                {pinnedCount}
              </span>
              <span className="text-xs text-[#7A6E6A]">Disematkan</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF6F0]/80 border border-[#EDE3D9]/60">
            <span className="text-xs font-poppins text-[#7A6E6A] block">Total Dilihat Klien</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg sm:text-xl font-bold font-poppins text-[#292321]">
                {totalViews.toLocaleString('id-ID')}
              </span>
              <span className="text-xs text-[#7A6E6A]">Tayangan</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF6F0]/80 border border-[#EDE3D9]/60">
            <span className="text-xs font-poppins text-[#7A6E6A] block">Disimpan Favorit</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg sm:text-xl font-bold font-poppins text-[#641A2B]">
                {totalSaves.toLocaleString('id-ID')}
              </span>
              <span className="text-xs text-[#7A6E6A]">Koleksi</span>
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

      {/* 2. Category Navigation & Search / Sort Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar font-poppins">
          {(
            [
              { key: 'ALL', label: 'Semua Karya', count: portfolioList.length },
              { key: 'Bridal & Baralek', label: 'Bridal & Baralek', count: portfolioList.filter(p => p.category === 'Bridal & Baralek').length },
              { key: 'Wisuda & Graduation', label: 'Wisuda', count: portfolioList.filter(p => p.category === 'Wisuda & Graduation').length },
              { key: 'Lamaran & Engagement', label: 'Lamaran', count: portfolioList.filter(p => p.category === 'Lamaran & Engagement').length },
              { key: 'Editorial & Pesta', label: 'Editorial & Pesta', count: portfolioList.filter(p => p.category === 'Editorial & Pesta').length }
            ] as const
          ).map(tab => {
            const isActive = selectedCategory === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedCategory(tab.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#641A2B] text-white shadow-xs'
                    : 'bg-white border border-[#EDE3D9] text-[#7A6E6A] hover:border-[#C9A45C]/50 hover:bg-[#FAF6F0]'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#FAF6F0] text-[#7A6E6A]'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-[#7A6E6A] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari look, teknik, produk..."
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

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1 bg-white border border-[#EDE3D9] rounded-xl px-2.5 py-1.5 text-xs text-[#292321]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#7A6E6A]" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="bg-transparent focus:outline-hidden text-xs cursor-pointer font-medium text-[#7A6E6A]"
            >
              <option value="NEWEST">Terbaru</option>
              <option value="POPULAR">Paling Banyak Dilihat</option>
              <option value="PINNED">Hanya Karya Unggulan</option>
            </select>
          </div>
        </div>

      </div>

      {/* 3. Bespoke Editorial Gallery Grid */}
      {filteredList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#EDE3D9] p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#FAF6F0] flex items-center justify-center mx-auto text-[#641A2B]">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-poppins font-bold text-lg text-[#292321]">Tidak ada karya ditemukan</h3>
            <p className="text-xs text-[#7A6E6A] mt-1 max-w-sm mx-auto">
              Tidak ada hasil untuk filter yang dipilih. Coba reset pencarian atau kategori Anda.
            </p>
          </div>
          <button
            onClick={() => { setSelectedCategory('ALL'); setSearchQuery(''); }}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-[#FAF6F0] text-[#641A2B] hover:bg-[#F5EFEB] border border-[#EDE3D9]"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-start">
          {filteredList.map((item) => (
            <div
              key={item.id}
              onClick={() => setInspectItem(item)}
              className="group bg-white rounded-2xl border border-[#EDE3D9] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col hover:border-[#C9A45C]/50"
            >
              {/* Photo Showcase Container (Portrait 4:5 Aspect Ratio) */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#FAF6F0]">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Top Subtle Gradient Shade */}
                <div className="absolute inset-x-0 top-0 h-20 bg-linear-to-b from-black/50 via-black/20 to-transparent pointer-events-none" />

                {/* Bottom Subtle Gradient Shade */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

                {/* Badges Over Image */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                  {/* Category Pill */}
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-black/40 backdrop-blur-md text-[#FAF6F0] border border-white/20">
                    {item.category}
                  </span>

                  {/* Pinned Crown/Star Badge */}
                  {item.isPinned && (
                    <span 
                      title="Disematkan di Profil Utama"
                      className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#C9A45C] text-[#292321] shadow-xs flex items-center gap-1"
                    >
                      <Star className="w-3 h-3 fill-current text-[#292321]" />
                      <span>Unggulan</span>
                    </span>
                  )}
                </div>

                {/* View / Save Stats on Bottom of Photo */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/90 text-xs z-10 font-light">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[11px] bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md">
                      <Eye className="w-3.5 h-3.5 text-[#E8D4B0]" />
                      {item.viewsCount}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md">
                      <Heart className="w-3.5 h-3.5 text-rose-300" />
                      {item.savesCount}
                    </span>
                  </div>

                  <span className="text-[10px] text-white/80 bg-black/30 backdrop-blur-md px-2 py-0.5 rounded-md">
                    {item.publishedDate}
                  </span>
                </div>
              </div>

              {/* Look Info & Actions */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                
                <div className="space-y-1.5">
                  <h3 className="font-poppins font-bold text-base text-[#292321] group-hover:text-[#641A2B] transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#7A6E6A] line-clamp-2 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>

                {/* Service Link Pill */}
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF6F0] border border-[#EDE3D9] text-[#641A2B] text-[11px] font-medium max-w-full truncate">
                    <Tag className="w-3 h-3 text-[#C9A45C] shrink-0" />
                    <span className="truncate">{item.linkedService.name}</span>
                    <span className="text-[#7A6E6A] shrink-0">({formatRupiah(item.linkedService.price)})</span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-[#F5EFEB] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setInspectItem(item);
                    }}
                    className="text-xs font-semibold font-poppins text-[#641A2B] hover:text-[#4E1220] flex items-center gap-1 hover:underline"
                  >
                    <span>Detail Karya</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>

                  <div className="flex items-center gap-1">
                    {/* Toggle Pin Button */}
                    <button
                      type="button"
                      title={item.isPinned ? "Lepas sematan dari profil utama" : "Sematkan di profil utama"}
                      onClick={(e) => handleTogglePin(item.id, e)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        item.isPinned
                          ? 'bg-[#FAF4EB] border-[#C9A45C] text-[#C9A45C]'
                          : 'bg-white border-[#EDE3D9] text-[#7A6E6A] hover:text-[#641A2B] hover:bg-[#FAF6F0]'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${item.isPinned ? 'fill-current' : ''}`} />
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      title="Hapus karya ini"
                      onClick={(e) => handleDeleteItem(item.id, item.title, e)}
                      className="p-1.5 rounded-lg border border-[#EDE3D9] text-[#7A6E6A] hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Modal: Look Inspector (Detail Lengkap Karya) */}
      {inspectItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#EDE3D9] shadow-2xl max-w-3xl w-full overflow-hidden max-h-[92vh] flex flex-col my-auto animate-scale-up">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#641A2B] text-white flex items-center justify-between shrink-0">
              <h3 className="font-poppins font-bold text-base sm:text-lg text-white">Detail Karya Rias Showroom</h3>
              <button 
                onClick={() => setInspectItem(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (2 Columns on medium screens) */}
            <div className="overflow-y-auto p-6 sm:p-7 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Kolom Kiri: Foto Potret Resolusi Tinggi */}
              <div className="md:col-span-5 relative aspect-[4/5] rounded-xl overflow-hidden border border-[#EDE3D9] shadow-xs bg-[#FAF6F0]">
                <Image
                  src={inspectItem.imageUrl}
                  alt={inspectItem.title}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/50 backdrop-blur-md text-white border border-white/20">
                    {inspectItem.category}
                  </span>
                </div>
              </div>

              {/* Kolom Kanan: Detail Look, Produk, & Layanan */}
              <div className="md:col-span-7 space-y-5">
                
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-[#7A6E6A]">Dipublikasikan {inspectItem.publishedDate}</span>
                    {inspectItem.isPinned && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF4EB] border border-[#C9A45C] text-[#641A2B] flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current text-[#C9A45C]" />
                        Unggulan di Profil
                      </span>
                    )}
                  </div>
                  
                  <h2 className="font-poppins font-bold text-xl sm:text-2xl text-[#641A2B] mt-1">
                    {inspectItem.title}
                  </h2>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-4 py-2.5 px-3.5 rounded-xl bg-[#FAF6F0] border border-[#EDE3D9] text-xs text-[#292321]">
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-[#641A2B]" />
                    <span className="font-bold">{inspectItem.viewsCount}</span>
                    <span className="text-[#7A6E6A]">Dilihat</span>
                  </div>
                  <span className="text-[#EDE3D9]">|</span>
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span className="font-bold">{inspectItem.savesCount}</span>
                    <span className="text-[#7A6E6A]">Disimpan</span>
                  </div>
                </div>

                {/* Deskripsi */}
                <div>
                  <h4 className="text-xs font-bold font-poppins uppercase tracking-wider text-[#7A6E6A] mb-1.5">
                    Konsep & Karakter Riasan
                  </h4>
                  <p className="text-xs sm:text-sm text-[#292321] leading-relaxed font-light">
                    {inspectItem.description}
                  </p>
                </div>

                {/* Teknik */}
                <div>
                  <h4 className="text-xs font-bold font-poppins uppercase tracking-wider text-[#7A6E6A] mb-1.5 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-[#C9A45C]" />
                    Teknik Utama
                  </h4>
                  <p className="text-xs text-[#292321] bg-[#FAF6F0] p-2.5 rounded-xl border border-[#EDE3D9]">
                    {inspectItem.technique}
                  </p>
                </div>

                {/* Produk Utama */}
                <div>
                  <h4 className="text-xs font-bold font-poppins uppercase tracking-wider text-[#7A6E6A] mb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#C9A45C]" />
                    Produk Makeup Kunci
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {inspectItem.keyProducts.map((prod, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs bg-white border border-[#EDE3D9] text-[#292321] font-medium"
                      >
                        {prod}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Paket Terkait */}
                <div>
                  <h4 className="text-xs font-bold font-poppins uppercase tracking-wider text-[#7A6E6A] mb-1.5 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#C9A45C]" />
                    Paket Layanan yang Ditautkan
                  </h4>
                  <div className="p-3 rounded-xl bg-[#FAF6F0] border border-[#EDE3D9] flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-xs sm:text-sm text-[#641A2B] block">
                        {inspectItem.linkedService.name}
                      </span>
                      <span className="text-xs text-[#7A6E6A]">Tarif Resmi Studio</span>
                    </div>
                    <span className="font-poppins font-bold text-sm sm:text-base text-[#292321]">
                      {formatRupiah(inspectItem.linkedService.price)}
                    </span>
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Actions Footer */}
            <div className="px-6 py-4 bg-[#FAF6F0] border-t border-[#EDE3D9] flex items-center justify-between shrink-0 font-poppins">
              <button
                type="button"
                onClick={() => handleTogglePin(inspectItem.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                  inspectItem.isPinned
                    ? 'bg-white border-[#C9A45C] text-[#641A2B]'
                    : 'bg-white border-[#EDE3D9] text-[#7A6E6A] hover:bg-[#F5EFEB]'
                }`}
              >
                <span>{inspectItem.isPinned ? 'Batal Sematkan' : 'Sematkan di Profil Utama'}</span>
              </button>

              <button
                type="button"
                onClick={() => setInspectItem(null)}
                className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#641A2B] text-white hover:bg-[#4E1220] transition-colors"
              >
                Selesai
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. Modal: "+ Unggah Karya Baru" */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#EDE3D9] shadow-2xl max-w-xl w-full overflow-hidden max-h-[92vh] flex flex-col my-auto animate-scale-up">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#641A2B] text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-poppins font-bold text-lg text-white">Unggah Karya Rias Baru</h3>
                <p className="text-xs text-[#E8D4B0] font-light mt-0.5">
                  Tambahkan ke koleksi showroom untuk ditampilkan pada profil publik
                </p>
              </div>
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveNewLook} className="p-6 space-y-4 overflow-y-auto">
              
              {/* Photo Preview & Preset Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#292321] mb-1.5">
                  Pilih Foto Riasan (Preset Editorial) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-5 gap-2 mb-2">
                  {availableImagePresets.map((preset, idx) => {
                    const isSelected = newLook.imageUrl === preset.url;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setNewLook({ ...newLook, imageUrl: preset.url })}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                          isSelected 
                            ? 'border-[#641A2B] ring-2 ring-[#641A2B]/20 scale-95' 
                            : 'border-[#EDE3D9] opacity-70 hover:opacity-100'
                        }`}
                      >
                        <Image
                          src={preset.url}
                          alt={preset.label}
                          fill
                          className="object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#641A2B]/30 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-[#7A6E6A]">
                  Pilih salah satu portofolio masterclass beresolusi tinggi di atas untuk demonstrasi showroom.
                </p>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-[#292321] mb-1">
                  Nama / Judul Look Rias <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Suntiang Gadang Modern — Flawless Akad"
                  value={newLook.title}
                  onChange={(e) => setNewLook({ ...newLook, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE3D9] text-sm focus:outline-hidden focus:border-[#641A2B] focus:ring-1 focus:ring-[#641A2B]"
                />
              </div>

              {/* Category & Service Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#292321] mb-1">
                    Kategori Look <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newLook.category}
                    onChange={(e) => setNewLook({ ...newLook, category: e.target.value as PortfolioItem['category'] })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE3D9] text-sm focus:outline-hidden focus:border-[#641A2B] focus:ring-1 focus:ring-[#641A2B] bg-white"
                  >
                    <option value="Bridal & Baralek">Bridal & Baralek</option>
                    <option value="Wisuda & Graduation">Wisuda & Graduation</option>
                    <option value="Lamaran & Engagement">Lamaran & Engagement</option>
                    <option value="Editorial & Pesta">Editorial & Pesta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#292321] mb-1">
                    Tautkan ke Paket Layanan
                  </label>
                  <select
                    value={newLook.serviceName}
                    onChange={(e) => setNewLook({ ...newLook, serviceName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE3D9] text-sm focus:outline-hidden focus:border-[#641A2B] focus:ring-1 focus:ring-[#641A2B] bg-white"
                  >
                    <option value="Paket Baralek Gadang Premium">Paket Baralek Gadang Premium</option>
                    <option value="Paket Akad Nikah Intimate">Paket Akad Nikah Intimate</option>
                    <option value="Paket Wisuda & Sumpah Dokter">Paket Wisuda & Sumpah Dokter</option>
                    <option value="Paket Lamaran & Tunangan Elegan">Paket Lamaran & Tunangan Elegan</option>
                    <option value="Paket Pesta & Evening Glamour">Paket Pesta & Evening Glamour</option>
                    <option value="Paket Sesi Prewedding Outdoor">Paket Sesi Prewedding Outdoor</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#292321] mb-1">
                  Deskripsi & Filosofi Konsep Rias
                </label>
                <textarea
                  rows={2}
                  placeholder="Ceritakan detail keunikan riasan ini, ketahanan warna, dan kecocokannya untuk klien..."
                  value={newLook.description}
                  onChange={(e) => setNewLook({ ...newLook, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE3D9] text-sm focus:outline-hidden focus:border-[#641A2B] focus:ring-1 focus:ring-[#641A2B]"
                />
              </div>

              {/* Technique & Products */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#292321] mb-1">
                    Teknik Rias Utama
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Velvet Matte Finish, Soft Cut Crease"
                    value={newLook.technique}
                    onChange={(e) => setNewLook({ ...newLook, technique: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE3D9] text-sm focus:outline-hidden focus:border-[#641A2B] focus:ring-1 focus:ring-[#641A2B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#292321] mb-1">
                    Produk Kunci (Pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Dior Forever 2N, Huda Beauty"
                    value={newLook.keyProducts}
                    onChange={(e) => setNewLook({ ...newLook, keyProducts: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE3D9] text-sm focus:outline-hidden focus:border-[#641A2B] focus:ring-1 focus:ring-[#641A2B]"
                  />
                </div>
              </div>

              {/* Pin Toggle Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF6F0] border border-[#EDE3D9] cursor-pointer hover:bg-[#FAF4EB] transition-colors">
                  <input
                    type="checkbox"
                    checked={newLook.isPinned}
                    onChange={(e) => setNewLook({ ...newLook, isPinned: e.target.checked })}
                    className="w-4 h-4 rounded text-[#641A2B] focus:ring-[#641A2B] border-gray-300"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#641A2B] block">
                      Sematkan sebagai Karya Unggulan (Pinned)
                    </span>
                    <span className="text-[11px] text-[#7A6E6A]">
                      Karya ini akan langsung muncul di baris paling atas feed profil publik Anda.
                    </span>
                  </div>
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#EDE3D9] font-poppins">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#7A6E6A] hover:bg-[#FAF6F0] transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#641A2B] text-white hover:bg-[#4E1220] transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4 text-[#C9A45C]" />
                  <span>Publikasikan Karya</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
