"use client";

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import { 
  MapPin, 
  Star, 
  ShieldCheck, 
  Heart, 
  MessageCircle, 
  Calendar, 
  Clock, 
  Check, 
  CheckCircle2, 
  ChevronRight, 
  Share2, 
  Info, 
  Sparkles, 
  Eye, 
  X, 
  ArrowLeft, 
  ArrowUpRight, 
  Award, 
  Lock, 
  Phone, 
  Compass,
  FileCheck2,
  CalendarCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockMuas, mockMuaAggregates } from '@/data/mock-muas';
import { mockServices } from '@/data/mock-services';
import { initialPortfolioItems, PortfolioItem } from '@/data/mock-portfolio';
import { formatRupiah } from '@/lib/utils';
import { Service } from '@/types';

// Kecamatan di Padang yang dicakup
const PADANG_DISTRICTS = [
  'Kuranji', 'Padang Barat', 'Padang Timur', 'Padang Utara', 
  'Padang Selatan', 'Koto Tangah', 'Pauh', 'Nanggalo'
];

export default function MuaProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  
  const mua = mockMuas.find(m => m.id === resolvedParams.id);
  const stats = mockMuaAggregates[resolvedParams.id] || { rating: 4.9, reviewCount: 85, startingPrice: 250000 };
  
  // Ambil layanan MUA atau sediakan fallback layanan jika belum ada
  const muaServices = mockServices.filter(s => s.muaId === resolvedParams.id);
  const services: Service[] = muaServices.length > 0 ? muaServices : [
    {
      id: `svc-${resolvedParams.id}-1`,
      muaId: resolvedParams.id,
      name: 'Bridal & Baralek Gadang Premium',
      category: 'Wedding',
      price: 1800000,
      durationMinutes: 180,
      description: 'Paket riasan pengantin lengkap adat Minang / Modern. Termasuk pemasangan suntiang/aksesoris, hijab styling, dan touch-up kit eksklusif.'
    },
    {
      id: `svc-${resolvedParams.id}-2`,
      muaId: resolvedParams.id,
      name: 'Wisuda & Graduation Flawless Look',
      category: 'Graduation',
      price: 350000,
      durationMinutes: 90,
      description: 'Riasan wisuda tahan badai dan terik matahari Padang dengan complexion natural glowing serta lip tint tahan lama.'
    },
    {
      id: `svc-${resolvedParams.id}-3`,
      muaId: resolvedParams.id,
      name: 'Lamaran & Intimate Engagement',
      category: 'Engagement',
      price: 650000,
      durationMinutes: 120,
      description: 'Konsep soft glam elegan untuk prosesi lamaran keluarga dengan aura anggun dan sentuhan warna rose gold.'
    }
  ];

  // State navigasi tab
  const [activeTab, setActiveTab] = useState<'layanan' | 'portofolio' | 'profil' | 'kebijakan'>('layanan');
  
  // State wishlist
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // State modal pratinjau portofolio
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioItem | null>(null);
  const [portfolioCategory, setPortfolioCategory] = useState<string>('ALL');

  useEffect(() => {
    // Sinkronisasi state wishlist dari localStorage
    try {
      const stored = localStorage.getItem('glamea_client_wishlist');
      if (stored) {
        const ids: string[] = JSON.parse(stored);
        if (ids.includes(resolvedParams.id)) {
          setIsWishlisted(true);
        }
      }
    } catch {
      // ignore storage errors
    }
  }, [resolvedParams.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleWishlist = () => {
    try {
      const stored = localStorage.getItem('glamea_client_wishlist');
      let ids: string[] = stored ? JSON.parse(stored) : ['mua-1', 'mua-2', 'mua-4'];
      if (isWishlisted) {
        ids = ids.filter(id => id !== resolvedParams.id);
        setIsWishlisted(false);
        showToast('MUA dihapus dari daftar Wishlist Anda.');
      } else {
        ids.push(resolvedParams.id);
        setIsWishlisted(true);
        showToast('MUA berhasil disimpan ke Wishlist Favorit.');
      }
      localStorage.setItem('glamea_client_wishlist', JSON.stringify(ids));
    } catch {
      setIsWishlisted(!isWishlisted);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Tautan profil atelier berhasil disalin ke clipboard.');
    }
  };

  if (!mua) return notFound();

  // Portofolio terfilter
  const filteredPortfolio = portfolioCategory === 'ALL' 
    ? initialPortfolioItems 
    : initialPortfolioItems.filter(p => p.category.toLowerCase().includes(portfolioCategory.toLowerCase()));

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-24 text-[#2D221E]">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#3A101C] text-[#FAF8F5] px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-[#C9A45C]/40 animate-in fade-in slide-in-from-top-4 duration-300">
          <Check className="w-4 h-4 text-[#C9A45C]" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. ATELIER STUDIO COVER BANNER                          */}
      {/* ======================================================== */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden bg-[#2D0A13]">
        {/* Studio Background Image */}
        <Image
          src="/images/studio-cover.png"
          alt={`${mua.name} Atelier Studio`}
          fill
          priority
          className="object-cover object-center opacity-70 scale-105 transition-transform duration-1000 ease-out"
        />

        {/* Deep Burgundy & Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2D0A13]/90 via-[#3A101C]/65 to-[#2D0A13]/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-transparent to-black/35" />

        {/* Top Floating Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10 flex items-center justify-between">
          <Link
            href="/profil"
            className="font-poppins inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white text-xs font-medium border border-white/20 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#C9A45C]" />
            <span>Kembali ke Portal Klien</span>
          </Link>


        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. ATELIER IDENTITY HEADER CARD                          */}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 md:-mt-28 relative z-20">
        <div className="bg-white rounded-3xl border border-[#C9A45C]/25 shadow-xl shadow-[#3A101C]/5 p-6 md:p-8 backdrop-blur-sm relative overflow-hidden">
          
          {/* Subtle gold line accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3A101C] via-[#C9A45C] to-[#3A101C]" />

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2">
            
            {/* Avatar & Main Info */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              
              {/* MUA Real Photo Avatar */}
              <div className="relative shrink-0 -mt-16 sm:-mt-20">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl border-4 border-white shadow-lg overflow-hidden relative bg-[#FAF8F5] ring-2 ring-[#C9A45C]/30">
                  <Image
                    src={mua.portfolioImage || '/images/mua-alya.png'}
                    alt={mua.name}
                    fill
                    className="object-cover object-top"
                    priority
                  />
                </div>
                {mua.isVerified && (
                  <div className="font-poppins absolute -bottom-2 -right-2 bg-[#3A101C] text-[#C9A45C] p-1.5 rounded-xl border-2 border-white shadow-md" title="MUA Terverifikasi Resmi">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Title, Badge & Meta */}
              <div className="space-y-2 pb-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#3A101C]">
                    {mua.name}
                  </h1>
                  <span className="font-poppins inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF4EB] text-[#3A101C] border border-[#C9A45C]/40">
                    <Sparkles className="w-3 h-3 text-[#C9A45C]" />
                    GLAMÉA Certified Atelier
                  </span>
                </div>

                <p className="font-sans text-xs sm:text-sm text-[#3A101C]/80 font-medium leading-relaxed max-w-xl">
                  {mua.bio || 'Professional Makeup Artist spesialis Wedding & Baralek Minang Tradisional.'}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#2D221E]/75 pt-1">
                  <span className="font-sans flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#C9A45C]" />
                    {mua.location}, Kota Padang
                  </span>
                  <span className="font-sans flex items-center gap-1.5 font-medium">
                    <Star className="w-3.5 h-3.5 fill-[#C9A45C] text-[#C9A45C]" />
                    <strong className="font-poppins text-[#3A101C]">{stats.rating.toFixed(1)}</strong> ({stats.reviewCount} Ulasan Terverifikasi)
                  </span>
                  <span className="font-poppins hidden sm:flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-emerald-200">
                    <Lock className="w-3 h-3 text-emerald-600 mr-0.5" />
                    Garansi Escrow Aktif
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Buttons Header */}
            <div className="flex items-center gap-3 pt-2 sm:pt-0">
              <Link href={`/chat?muaId=${mua.id}`} className="flex-1 sm:flex-initial">
                <Button 
                  variant="outline" 
                  className="font-poppins w-full sm:w-auto px-4 py-2.5 border-[#C9A45C]/50 text-[#3A101C] hover:bg-[#FAF4EB] rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 text-[#C9A45C]" />
                  <span>Chat Studio</span>
                </Button>
              </Link>

              <button
                onClick={toggleWishlist}
                className={`p-2.5 rounded-2xl border transition-all shadow-xs flex items-center justify-center ${
                  isWishlisted 
                    ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-rose-100' 
                    : 'bg-white border-[#C9A45C]/35 text-[#3A101C] hover:bg-[#FAF4EB]'
                }`}
                title={isWishlisted ? 'Hapus dari Wishlist' : 'Simpan ke Wishlist'}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-[#3A101C]'}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-2xl border border-[#C9A45C]/35 bg-white text-[#3A101C] hover:bg-[#FAF4EB] transition-colors shadow-xs flex items-center justify-center"
                title="Bagikan Tautan Profil Studio"
              >
                <Share2 className="w-4 h-4 text-[#3A101C]" />
              </button>
            </div>

          </div>

          {/* Quick Style Badges Strip */}
          <div className="mt-6 pt-5 border-t border-[#C9A45C]/15 flex flex-wrap items-center gap-2">
            <span className="font-poppins text-[11px] font-medium text-[#3A101C]/60 uppercase tracking-wider mr-2">
              Signature Style:
            </span>
            {mua.makeupStyles.map((style, idx) => (
              <span
                key={idx}
                className="font-poppins text-xs px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#C9A45C]/30 text-[#3A101C] font-medium shadow-2xs"
              >
                {style}
              </span>
            ))}
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. ATELIER NAVIGATION TABS & CONTENT LAYOUT              */}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Navigation Tabs Bar */}
        <div className="bg-white rounded-2xl border border-[#C9A45C]/20 shadow-xs p-1.5 flex items-center gap-1.5 overflow-x-auto mb-8">
          <button
            onClick={() => setActiveTab('layanan')}
            className={`font-poppins flex-1 py-3 px-4 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
              activeTab === 'layanan'
                ? 'bg-[#3A101C] text-[#FAF8F5] shadow-sm'
                : 'text-[#3A101C]/70 hover:text-[#3A101C] hover:bg-[#FAF4EB]'
            }`}
          >
            <CalendarCheck className="w-4 h-4 text-[#C9A45C]" />
            <span>Katalog Layanan & Reservasi</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'layanan' ? 'bg-white/20 text-white' : 'bg-[#3A101C]/10 text-[#3A101C]'
            }`}>
              {services.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('portofolio')}
            className={`font-poppins flex-1 py-3 px-4 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
              activeTab === 'portofolio'
                ? 'bg-[#3A101C] text-[#FAF8F5] shadow-sm'
                : 'text-[#3A101C]/70 hover:text-[#3A101C] hover:bg-[#FAF4EB]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#C9A45C]" />
            <span>Galeri Portofolio Riasan</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'portofolio' ? 'bg-white/20 text-white' : 'bg-[#3A101C]/10 text-[#3A101C]'
            }`}>
              {initialPortfolioItems.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('profil')}
            className={`font-poppins flex-1 py-3 px-4 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
              activeTab === 'profil'
                ? 'bg-[#3A101C] text-[#FAF8F5] shadow-sm'
                : 'text-[#3A101C]/70 hover:text-[#3A101C] hover:bg-[#FAF4EB]'
            }`}
          >
            <Compass className="w-4 h-4 text-[#C9A45C]" />
            <span>Profil & Filosofi Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('kebijakan')}
            className={`font-poppins flex-1 py-3 px-4 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
              activeTab === 'kebijakan'
                ? 'bg-[#3A101C] text-[#FAF8F5] shadow-sm'
                : 'text-[#3A101C]/70 hover:text-[#3A101C] hover:bg-[#FAF4EB]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#C9A45C]" />
            <span>Jangkauan & Garansi Escrow</span>
          </button>
        </div>

        {/* Content Grid (Main Column + Side Concierge Column) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ======================================================== */}
          {/* MAIN COLUMN (COL-SPAN-2)                                */}
          {/* ======================================================== */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* ------------------------------------------------------ */}
            {/* TAB 1: KATALOG LAYANAN & RESERVASI                     */}
            {/* ------------------------------------------------------ */}
            {activeTab === 'layanan' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-[#3A101C]">
                      Pilihan Paket Layanan Rias
                    </h2>
                    <p className="font-sans text-xs text-[#3A101C]/70 mt-0.5">
                      Pilih paket yang sesuai untuk acara Anda, lengkapi jadwal, dan bayar aman dengan proteksi Escrow.
                    </p>
                  </div>
                  <span className="text-xs text-[#C9A45C] font-serif italic hidden sm:inline-block">
                    ✦ Garansi Kepuasan GLAMÉA
                  </span>
                </div>

                <div className="space-y-5">
                  {services.map((svc) => (
                    <div
                      key={svc.id}
                      className="bg-white rounded-3xl border border-[#C9A45C]/25 p-6 shadow-sm hover:border-[#3A101C]/40 hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
                    >
                      <div className="space-y-3.5">
                        {/* Top Label & Duration */}
                        <div className="flex items-center justify-between">
                          <span className="font-poppins text-[10px] font-bold px-3 py-1 rounded-full bg-[#FAF4EB] text-[#3A101C] uppercase tracking-wider border border-[#C9A45C]/30">
                            {svc.category}
                          </span>
                          <span className="font-poppins flex items-center gap-1.5 text-xs text-[#3A101C]/70 font-medium">
                            <Clock className="w-3.5 h-3.5 text-[#C9A45C]" />
                            Estimasi Pengerjaan: {svc.durationMinutes} Menit
                          </span>
                        </div>

                        {/* Service Title & Description */}
                        <div>
                          <h3 className="text-lg font-serif font-bold text-[#3A101C] group-hover:text-[#641A2B] transition-colors">
                            {svc.name}
                          </h3>
                          <p className="font-sans text-xs text-[#2D221E]/75 mt-1.5 leading-relaxed">
                            {svc.description}
                          </p>
                        </div>

                        {/* Inclusions / Perks */}
                        <div className="bg-[#FAF8F5] rounded-2xl p-3 border border-[#C9A45C]/15 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#3A101C]/80 font-sans">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Konsultasi Look & Skintone</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Hijab Styling / Hairdo Rapi</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Produk Original & Tahan Lama</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Free Touch-up Kit Mini</span>
                          </div>
                        </div>
                      </div>

                      {/* Pricing & Reservation CTA */}
                      <div className="pt-5 mt-5 border-t border-[#C9A45C]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <span className="font-poppins text-[10px] uppercase font-bold tracking-wider text-[#3A101C]/60 block">
                            Tarif Resmi Atelier
                          </span>
                          <div className="flex items-baseline gap-2">
                            <span className="font-poppins font-bold text-2xl text-[#3A101C]">
                              {formatRupiah(svc.price)}
                            </span>
                            <span className="font-sans text-[11px] text-emerald-700 font-medium">
                              (Termasuk Proteksi Escrow)
                            </span>
                          </div>
                        </div>

                        <Link 
                          href={`/booking?serviceId=${svc.id}&muaId=${mua.id}`}
                          className="block shrink-0"
                        >
                          <Button className="font-poppins w-full sm:w-auto px-6 py-2.5 bg-[#3A101C] hover:bg-[#641A2B] text-[#FAF8F5] rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all group-hover:scale-102">
                            <span>Reservasi Sekarang</span>
                            <ArrowUpRight className="w-4 h-4 text-[#C9A45C]" />
                          </Button>
                        </Link>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ------------------------------------------------------ */}
            {/* TAB 2: GALERI PORTOFOLIO RIASAN NYATA                 */}
            {/* ------------------------------------------------------ */}
            {activeTab === 'portofolio' && (
              <div className="space-y-6">
                
                {/* Header Portofolio */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-[#3A101C]">
                      Karya Seni Riasan Atelier
                    </h2>
                    <p className="font-sans text-xs text-[#3A101C]/70 mt-0.5">
                      Klik karya di bawah untuk melihat rincian teknik, produk yang digunakan, dan layanan terkait.
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex flex-wrap gap-1.5 bg-white p-1 rounded-2xl border border-[#C9A45C]/20 shadow-2xs">
                    {['ALL', 'Bridal', 'Wisuda', 'Lamaran', 'Editorial'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setPortfolioCategory(cat)}
                        className={`font-poppins px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                          portfolioCategory === cat
                            ? 'bg-[#3A101C] text-[#FAF8F5]'
                            : 'text-[#3A101C]/70 hover:text-[#3A101C]'
                        }`}
                      >
                        {cat === 'ALL' ? 'Semua' : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Portfolio Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {filteredPortfolio.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedPortfolio(item)}
                      className="bg-white rounded-3xl border border-[#C9A45C]/25 overflow-hidden shadow-xs hover:shadow-lg transition-all cursor-pointer group flex flex-col"
                    >
                      {/* Image Container */}
                      <div className="relative aspect-4/3 w-full bg-[#FAF8F5] overflow-hidden">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                        
                        <div className="font-poppins absolute top-3 left-3 bg-[#3A101C]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-[#FAF8F5] text-[10px] font-semibold">
                          {item.category}
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <h4 className="font-serif font-bold text-base leading-tight drop-shadow-sm">
                            {item.title}
                          </h4>
                          <p className="font-sans text-[11px] text-white/80 line-clamp-1 mt-0.5">
                            {item.technique}
                          </p>
                        </div>
                      </div>

                      {/* Footer Info */}
                      <div className="p-4 flex items-center justify-between text-xs border-t border-[#C9A45C]/15 font-sans">
                        <span className="text-[#3A101C]/70">
                          {item.linkedService.name}
                        </span>
                        <span className="font-poppins font-semibold text-[#3A101C] flex items-center gap-1 group-hover:text-[#C9A45C] transition-colors">
                          <span>Detail Karya</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* ------------------------------------------------------ */}
            {/* TAB 3: PROFIL & FILOSOFI STUDIO                        */}
            {/* ------------------------------------------------------ */}
            {activeTab === 'profil' && (
              <div className="space-y-6">
                
                {/* Bio Card */}
                <div className="bg-white rounded-3xl border border-[#C9A45C]/25 p-6 md:p-8 shadow-xs space-y-4">
                  <div className="border-b border-[#C9A45C]/15 pb-4">
                    <h3 className="font-serif font-bold text-lg text-[#3A101C]">
                      Filosofi & Seni Rias {mua.name}
                    </h3>
                    <p className="font-sans text-xs text-[#3A101C]/70 mt-0.5">
                      Karakter karya, nilai profesionalisme, dan komitmen pelayanan studio.
                    </p>
                  </div>

                  <p className="font-sans text-xs sm:text-sm text-[#2D221E]/80 leading-relaxed">
                    {mua.bio} Setiap calon pengantin dan klien memiliki keunikan anatomi wajah serta karakter personal yang patut dirayakan. Melalui pendekatan atelier, kami mengombinasikan ketelitian teknik riasan tahan lama dengan sentuhan artistik yang natural, memastikan Anda tampil memukau di momen paling sakral.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#C9A45C]/20">
                      <h4 className="font-poppins font-semibold text-sm text-[#3A101C] mb-1">
                        Peralatan & Higienitas
                      </h4>
                      <p className="font-sans text-xs text-[#2D221E]/70 leading-relaxed">
                        Seluruh kuas, spons, dan alat rias disterilisasi UV sebelum setiap sesi pelayanan klien demi keamanan kulit Anda.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#C9A45C]/20">
                      <h4 className="font-poppins font-semibold text-sm text-[#3A101C] mb-1">
                        Produk High-End Terkurasi
                      </h4>
                      <p className="font-sans text-xs text-[#2D221E]/70 leading-relaxed">
                        Menggunakan fondasi dan kosmetik premium (Dior, Charlotte Tilbury, NARS, Make Up For Ever) yang teruji tahan 16 jam.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Studio Physical Location & Hours */}
                <div className="bg-white rounded-3xl border border-[#C9A45C]/25 p-6 md:p-8 shadow-xs space-y-4">
                  <div className="border-b border-[#C9A45C]/15 pb-4">
                    <h3 className="font-serif font-bold text-lg text-[#3A101C]">
                      Studio & Workshop Fisik
                    </h3>
                    <p className="font-sans text-xs text-[#3A101C]/70 mt-0.5">
                      Lokasi konsultasi langsung dan sesi fitting look di Kota Padang.
                    </p>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[#C9A45C] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-poppins font-semibold text-[#3A101C]">Alamat Workshop Studio:</p>
                        <p className="font-sans text-[#2D221E]/70 mt-0.5">
                          Jl. Bypass KM 11, Belimbing, Kec. {mua.location}, Kota Padang, Sumatera Barat
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-[#C9A45C] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-poppins font-semibold text-[#3A101C]">Jam Operasional Layanan:</p>
                        <p className="font-sans text-[#2D221E]/70 mt-0.5">
                          Senin - Minggu: 05:00 - 19:00 WIB (Sesuai Reservasi & Jadwal Akad/Resepsi)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ------------------------------------------------------ */}
            {/* TAB 4: JANGKAUAN WILAYAH & GARANSI ESCROW             */}
            {/* ------------------------------------------------------ */}
            {activeTab === 'kebijakan' && (
              <div className="space-y-6">
                
                {/* Area Coverage Card */}
                <div className="bg-white rounded-3xl border border-[#C9A45C]/25 p-6 md:p-8 shadow-xs space-y-5">
                  <div className="border-b border-[#C9A45C]/15 pb-4">
                    <h3 className="font-serif font-bold text-lg text-[#3A101C]">
                      Wilayah Jangkauan Home Service (Kota Padang)
                    </h3>
                    <p className="font-sans text-xs text-[#3A101C]/70 mt-0.5">
                      MUA bersedia datang langsung ke kediaman, hotel, atau gedung resepsi di wilayah berikut:
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {PADANG_DISTRICTS.map((dist, idx) => (
                      <div
                        key={idx}
                        className="font-poppins p-3 rounded-2xl bg-[#FAF8F5] border border-[#C9A45C]/20 text-center text-xs font-semibold text-[#3A101C] flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{dist}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF4EB] border border-[#C9A45C]/30 text-xs text-[#3A101C] space-y-1">
                    <p className="font-poppins font-bold">Ketentuan Transportasi:</p>
                    <p className="font-sans text-[#2D221E]/75 leading-relaxed">
                      Gratis biaya transportasi untuk lokasi dalam radius 5 km dari studio di {mua.location}. Untuk luar radius tersebut, berlaku tarif transport standar Rp 5.000 / km.
                    </p>
                  </div>
                </div>

                {/* Escrow Guarantee Highlight */}
                <div className="bg-gradient-to-br from-[#3A101C] to-[#2D0A13] text-[#FAF8F5] rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden space-y-4">
                  <div className="font-poppins flex items-center gap-2 text-[#C9A45C] text-xs font-bold uppercase tracking-wider">
                    <Lock className="w-4 h-4 text-[#C9A45C]" />
                    <span>Perlindungan Transaksi GLAMÉA Escrow</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                    Uang Anda 100% Aman Hingga Hari Acara Selesai
                  </h3>

                  <p className="font-sans text-xs sm:text-sm text-[#FAF8F5]/80 leading-relaxed">
                    Setiap pembayaran paket reservasi tidak langsung dikirim ke rekening pribadi MUA. Dana diamankan di rekening penampung resmi GLAMÉA Escrow dan baru dicairkan setelah MUA selesai merias Anda dengan memuaskan.
                  </p>

                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                    <div className="flex items-center gap-2 text-[#FAF8F5]/90">
                      <CheckCircle2 className="w-4 h-4 text-[#C9A45C] shrink-0" />
                      <span>Bebas risiko penipuan atau ketidakhadiran</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#FAF8F5]/90">
                      <CheckCircle2 className="w-4 h-4 text-[#C9A45C] shrink-0" />
                      <span>Kebijakan refund transparan jika terjadi kendala</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* ======================================================== */}
          {/* SIDE CONCIERGE COLUMN (COL-SPAN-1)                      */}
          {/* ======================================================== */}
          <div className="space-y-6">
            
            {/* Concierge Summary Card */}
            <div className="bg-white rounded-3xl border border-[#C9A45C]/25 p-6 shadow-sm sticky top-24 space-y-6">
              
              <div className="border-b border-[#C9A45C]/15 pb-4">
                <span className="font-poppins text-[10px] uppercase font-bold tracking-wider text-[#C9A45C] block">
                  Concierge Reservasi
                </span>
                <h3 className="font-serif font-bold text-lg text-[#3A101C] mt-0.5">
                  Pemesanan & Konsultasi
                </h3>
              </div>

              {/* MUA Quick Snapshot */}
              <div className="flex items-center gap-3.5 bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#C9A45C]/20">
                <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0 border border-white shadow-2xs">
                  <Image
                    src={mua.portfolioImage || '/images/mua-alya.png'}
                    alt={mua.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#3A101C]">{mua.name}</h4>
                  <p className="font-sans text-[11px] text-[#3A101C]/70">{mua.location}, Padang</p>
                </div>
              </div>

              {/* Escrow Guarantee Pill */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
                <div className="font-poppins flex items-center gap-1.5 font-bold text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Garansi Rekening Escrow</span>
                </div>
                <p className="font-sans text-[11px] text-emerald-800/90 leading-relaxed">
                  Pembayaran Anda disimpan aman oleh sistem GLAMÉA hingga sesi riasan selesai dengan sempurna.
                </p>
              </div>

              {/* Concierge Highlights */}
              <div className="space-y-2.5 text-xs text-[#2D221E]/80">
                <div className="flex items-center justify-between py-1 border-b border-[#C9A45C]/10 font-sans">
                  <span className="text-[#3A101C]/70">Waktu Respons:</span>
                  <span className="font-poppins font-semibold text-[#3A101C]">&lt; 15 Menit</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#C9A45C]/10 font-sans">
                  <span className="text-[#3A101C]/70">Rating Klien:</span>
                  <span className="font-poppins font-semibold text-[#3A101C]">★ {stats.rating.toFixed(1)} / 5.0</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#C9A45C]/10 font-sans">
                  <span className="text-[#3A101C]/70">Layanan Tersedia:</span>
                  <span className="font-poppins font-semibold text-[#3A101C]">{services.length} Paket Pilihan</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => {
                    setActiveTab('layanan');
                    window.scrollTo({ top: 350, behavior: 'smooth' });
                  }}
                  className="font-poppins w-full py-3 px-4 bg-[#3A101C] hover:bg-[#641A2B] text-[#FAF8F5] rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <Calendar className="w-4 h-4 text-[#C9A45C]" />
                  <span>Pilih Paket & Jadwalkan</span>
                </button>

                <Link href={`/chat?muaId=${mua.id}`} className="block">
                  <Button
                    variant="outline"
                    className="font-poppins w-full py-3 px-4 border-[#C9A45C]/40 text-[#3A101C] hover:bg-[#FAF4EB] rounded-2xl text-xs font-semibold flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-[#C9A45C]" />
                    <span>Konsultasi Tanya Jawab</span>
                  </Button>
                </Link>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* 4. MODAL DETAIL PORTOFOLIO (LIGHTBOX)                    */}
      {/* ======================================================== */}
      {selectedPortfolio && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#C9A45C]/30 shadow-2xl relative">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedPortfolio(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Image */}
            <div className="relative aspect-16/10 w-full bg-[#FAF8F5]">
              <Image
                src={selectedPortfolio.imageUrl}
                alt={selectedPortfolio.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="font-poppins text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#3A101C]/80 border border-white/20 text-[#C9A45C]">
                  {selectedPortfolio.category}
                </span>
                <h3 className="font-serif font-bold text-2xl mt-1.5 !text-white drop-shadow-md">{selectedPortfolio.title}</h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 space-y-5 text-xs text-[#2D221E]">
              <div>
                <h4 className="font-poppins font-bold text-[#3A101C] text-sm mb-1">Deskripsi Karya:</h4>
                <p className="font-sans text-[#2D221E]/80 leading-relaxed">{selectedPortfolio.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#C9A45C]/20">
                  <h4 className="font-poppins font-bold text-[#3A101C] mb-1">Teknik Aplikasi:</h4>
                  <p className="font-sans text-[#2D221E]/75">{selectedPortfolio.technique}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#C9A45C]/20">
                  <h4 className="font-poppins font-bold text-[#3A101C] mb-1">Produk Unggulan:</h4>
                  <ul className="font-sans list-disc list-inside space-y-0.5 text-[#2D221E]/75">
                    {selectedPortfolio.keyProducts.map((prod, i) => (
                      <li key={i}>{prod}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Linked Service CTA */}
              <div className="pt-4 border-t border-[#C9A45C]/20 flex items-center justify-between">
                <div>
                  <span className="font-poppins text-[10px] text-[#3A101C]/60 uppercase font-semibold block">Paket Terkait:</span>
                  <span className="font-serif font-bold text-base text-[#3A101C]">{selectedPortfolio.linkedService.name}</span>
                  <span className="font-poppins text-xs text-[#C9A45C] font-semibold block">{formatRupiah(selectedPortfolio.linkedService.price)}</span>
                </div>

                <button
                  onClick={() => {
                    setSelectedPortfolio(null);
                    setActiveTab('layanan');
                    window.scrollTo({ top: 350, behavior: 'smooth' });
                  }}
                  className="font-poppins px-5 py-2.5 bg-[#3A101C] hover:bg-[#641A2B] text-[#FAF8F5] rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
                >
                  <span>Reservasi Tampilan Ini</span>
                  <ChevronRight className="w-4 h-4 text-[#C9A45C]" />
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
