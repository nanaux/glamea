"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Star, 
  CreditCard, 
  HeartHandshake, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  SlidersHorizontal 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { MuaCard } from '@/components/client/MuaCard';
import { mockMuas, mockMuaAggregates } from '@/data/mock-muas';

export default function LandingPage() {
  const router = useRouter();

  // Search & Filter State
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');

  // Scroll reveal observer
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    const revealElements = document.querySelectorAll('.reveal-fade-up');
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedLocation) params.append('location', selectedLocation);
    if (selectedCategory) params.append('category', selectedCategory);
    if (selectedStyle) params.append('style', selectedStyle);
    if (selectedPrice) params.append('price', selectedPrice);

    router.push(`/cari-mua?${params.toString()}`);
  };

  const handleQuickFilter = (styleName: string) => {
    setSelectedStyle(styleName);
    const target = document.getElementById('cari-mua-section');
    if (target) {
      const navOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  // Filtered MUAs for display on landing page
  const displayedMuas = mockMuas.filter((mua) => {
    if (selectedLocation && mua.location !== selectedLocation) return false;
    if (selectedStyle && !mua.makeupStyles.some(s => s.toLowerCase().includes(selectedStyle.toLowerCase()))) return false;
    return true;
  }).slice(0, 4);

  return (
    <div ref={containerRef} className="flex flex-col min-h-screen bg-[#FAF6F0] text-[#292321] selection:bg-[#641A2B]/10 selection:text-[#641A2B]">
      {/* 1. Header & Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <section id="beranda" className="relative pt-8 pb-20 md:pt-16 md:pb-32 overflow-hidden">
          {/* Subtle decorative background glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#641A2B]/5 to-[#C9A45C]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Headline, Subheadline & Value Props */}
              <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left">
                {/* Micro badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#EDE3D9] shadow-sm mb-6 w-fit mx-auto lg:mx-0 reveal-fade-up">
                  <Sparkles className="w-4 h-4 text-[#C9A45C]" />
                  <span className="font-poppins text-xs font-semibold tracking-wide uppercase text-[#641A2B]">
                    Marketplace MUA Resmi Pertama di Padang
                  </span>
                </div>

                {/* Primary Headline */}
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#641A2B] leading-[1.15] mb-6 reveal-fade-up delay-100">
                  Temukan Makeup Artist Terbaik di Padang
                </h1>

                {/* Subheadline */}
                <p className="font-sans text-base sm:text-lg text-[#746A67] leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0 reveal-fade-up delay-200">
                  Wujudkan riasan impian untuk hari pernikahan, baralek Minang, wisuda, atau lamaran Anda. Bandingkan portofolio asli, ulasan transparan, dan booking aman dengan sistem pembayaran terproteksi.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10 reveal-fade-up delay-300">
                  <Link href="/cari-mua" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="font-poppins w-full sm:w-auto bg-[#641A2B] hover:bg-[#4E1321] text-white px-8 py-3.5 h-12 text-base font-semibold shadow-md shadow-[#641A2B]/15 transition-all hover:shadow-lg hover:-translate-y-0.5"
                    >
                      <Search className="w-4 h-4 mr-2" /> Jelajahi MUA
                    </Button>
                  </Link>
                  <a
                    href="#cara-kerja"
                    onClick={(e) => {
                      e.preventDefault();
                      const target = document.getElementById('cara-kerja');
                      if (target) {
                        const offsetPosition = target.getBoundingClientRect().top + window.pageYOffset - 80;
                        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                      }
                    }}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="font-poppins w-full sm:w-auto border-[#EDE3D9] bg-white/70 hover:bg-white text-[#292321] hover:text-[#641A2B] px-7 py-3.5 h-12 text-base font-semibold backdrop-blur transition-all"
                    >
                      Pelajari Cara Kerja
                    </Button>
                  </a>
                </div>

                {/* Trust Points / Micro Social Proof */}
                <div className="font-poppins pt-6 border-t border-[#EDE3D9]/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-8 text-xs sm:text-sm text-[#746A67] reveal-fade-up delay-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2F7D68]" />
                    <span>MUA Terverifikasi Kota Padang</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-[#C9A45C] text-[#C9A45C]" />
                    <span>Rating Rata-rata 4.9/5.0</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#641A2B]" />
                    <span>Garansi Pembayaran Aman</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Editorial Visual with Arched Frame */}
              <div className="lg:col-span-5 relative flex justify-center reveal-fade-up delay-200">
                <div className="relative w-full max-w-sm sm:max-w-md aspect-[4/5]">
                  {/* Decorative warm aura ring */}
                  <div className="absolute -inset-4 bg-gradient-to-tr from-[#641A2B]/15 via-[#C9A45C]/20 to-transparent rounded-[48px] blur-2xl opacity-70 transform rotate-1" />

                  {/* Arched Editorial Container */}
                  <div className="relative w-full h-full rounded-t-[140px] rounded-b-[32px] overflow-hidden border-2 border-white/80 shadow-2xl shadow-[#641A2B]/10 bg-white">
                    <Image
                      src="/images/hero-editorial.png"
                      alt="Model kecantikan GLAMÉA dengan riasan editorial flawless"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 500px"
                      className="object-cover object-center transition-transform duration-700 hover:scale-105"
                    />

                    {/* Subtle aesthetic gradient overlay at base */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#292321]/60 via-transparent to-transparent opacity-40" />

                    {/* Floating Glassmorphism Badge 1: Top Rated */}
                    <div className="absolute top-8 right-6 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-white/60 flex items-center gap-2.5 animate-in fade-in duration-500">
                      <div className="w-8 h-8 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#C9A45C]">
                        <Star className="w-4 h-4 fill-[#C9A45C]" />
                      </div>
                      <div>
                        <div className="font-poppins text-xs font-bold text-[#641A2B]">4.9 / 5.0</div>
                        <div className="font-sans text-[10px] text-[#746A67]">Ulasan Klien Padang</div>
                      </div>
                    </div>

                    {/* Floating Glassmorphism Badge 2: Verified Escrow */}
                    <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-white/60 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#641A2B]/10 flex items-center justify-center text-[#641A2B] shrink-0">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-poppins text-xs font-bold text-[#292321]">Garansi Booking Aman</div>
                        <div className="font-sans text-[11px] text-[#746A67]">Dana diteruskan setelah acara selesai</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 3. Search & Filter Bar Section */}
        <section id="cari-mua-section" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full mb-16 scroll-mt-24">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-[#641A2B]/5 border border-[#EDE3D9] p-6 sm:p-8 reveal-fade-up">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#641A2B]" />
                <h2 className="font-poppins text-sm font-semibold tracking-wide uppercase text-[#641A2B]">
                  Pencarian Cepat MUA
                </h2>
              </div>
              <span className="font-sans text-xs text-[#746A67] hidden sm:inline">
                Tersedia 8+ MUA Terverifikasi di Padang
              </span>
            </div>

            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              {/* Lokasi */}
              <div>
                <label className="font-poppins block text-xs font-semibold text-[#292321] mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C9A45C]" /> Wilayah Padang
                </label>
                <Select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="font-sans bg-[#FAF6F0]/60 border-[#EDE3D9] text-xs h-11 focus:border-[#641A2B] focus:ring-[#641A2B]"
                >
                  <option value="">Semua Kecamatan</option>
                  <option value="Padang Barat">Padang Barat</option>
                  <option value="Padang Timur">Padang Timur</option>
                  <option value="Kuranji">Kuranji</option>
                  <option value="Koto Tangah">Koto Tangah</option>
                  <option value="Pauh">Pauh (Unand)</option>
                  <option value="Lubuk Begalung">Lubuk Begalung</option>
                  <option value="Nanggalo">Nanggalo</option>
                </Select>
              </div>

              {/* Jenis Acara */}
              <div>
                <label className="font-poppins block text-xs font-semibold text-[#292321] mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#C9A45C]" /> Acara
                </label>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="font-sans bg-[#FAF6F0]/60 border-[#EDE3D9] text-xs h-11 focus:border-[#641A2B] focus:ring-[#641A2B]"
                >
                  <option value="">Semua Acara</option>
                  <option value="Wedding">Wedding / Akad</option>
                  <option value="Baralek">Baralek Minang</option>
                  <option value="Graduation">Wisuda</option>
                  <option value="Lamaran">Lamaran & Tunangan</option>
                  <option value="Photoshoot">Prewedding & Event</option>
                </Select>
              </div>

              {/* Gaya Riasan */}
              <div>
                <label className="font-poppins block text-xs font-semibold text-[#292321] mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A45C]" /> Gaya Makeup
                </label>
                <Select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="font-sans bg-[#FAF6F0]/60 border-[#EDE3D9] text-xs h-11 focus:border-[#641A2B] focus:ring-[#641A2B]"
                >
                  <option value="">Semua Gaya Look</option>
                  <option value="Flawless">Natural / Flawless</option>
                  <option value="Korean Look">Korean Glowing Look</option>
                  <option value="Soft Glam">Soft Glam</option>
                  <option value="Bold">Bold Glam / Arabic</option>
                  <option value="Traditional">Tradisional Minang</option>
                </Select>
              </div>

              {/* Kisaran Harga */}
              <div>
                <label className="font-poppins block text-xs font-semibold text-[#292321] mb-1.5 flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-[#C9A45C]" /> Anggaran
                </label>
                <Select
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                  className="font-sans bg-[#FAF6F0]/60 border-[#EDE3D9] text-xs h-11 focus:border-[#641A2B] focus:ring-[#641A2B]"
                >
                  <option value="">Semua Range Harga</option>
                  <option value="<350">Di bawah Rp 350.000</option>
                  <option value="350-750">Rp 350.000 - Rp 750.000</option>
                  <option value=">750">Di atas Rp 750.000</option>
                </Select>
              </div>

              {/* Action Button */}
              <div>
                <Button
                  type="submit"
                  className="font-poppins w-full h-11 bg-[#641A2B] hover:bg-[#4E1321] text-white font-semibold shadow-sm transition-all text-sm rounded-lg"
                >
                  <Search className="w-4 h-4 mr-2" /> Temukan MUA
                </Button>
              </div>
            </form>

            {/* Quick Filter Pills */}
            <div className="mt-5 pt-4 border-t border-[#EDE3D9]/60 flex flex-wrap items-center gap-2">
              <span className="font-poppins text-xs text-[#746A67] mr-1">Rekomendasi Cepat:</span>
              {[
                'Baralek Tradisional',
                'Flawless',
                'Korean Look',
                'Soft Glam',
                'Kuranji',
                'Padang Barat'
              ].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleQuickFilter(tag)}
                  className="font-poppins text-xs px-3 py-1 rounded-full bg-[#FAF6F0] hover:bg-[#641A2B] hover:text-white text-[#641A2B] border border-[#EDE3D9] transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 4. MUA Pilihan di Padang (Featured MUA) */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 reveal-fade-up">
            <div>
              <span className="font-poppins text-xs font-semibold tracking-wider uppercase text-[#C9A45C] block mb-2">
                Kurasi Terbaik
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#641A2B]">
                MUA Pilihan di Kota Padang
              </h2>
            </div>
            <p className="font-sans text-sm sm:text-base text-[#746A67] max-w-md mt-2 md:mt-0">
              Setiap makeup artist telah melalui proses verifikasi identitas, standar kualitas portofolio, dan ulasan pelanggan asli.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {displayedMuas.map((mua, index) => (
              <div key={mua.id} className={`reveal-fade-up delay-${(index + 1) * 100}`}>
                <MuaCard mua={mua} stats={mockMuaAggregates[mua.id]} />
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12 reveal-fade-up">
            <Link href="/cari-mua">
              <Button
                variant="outline"
                size="lg"
                className="font-poppins border-[#641A2B] text-[#641A2B] hover:bg-[#641A2B] hover:text-white px-8 h-12 text-base font-semibold rounded-xl transition-all inline-flex items-center gap-2 group"
              >
                <span>Lihat Semua Makeup Artist</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </section>

        {/* 5. Promotion Banner Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-r from-[#641A2B] to-[#4E1321] text-white w-full relative overflow-hidden my-8">
          {/* Subtle gold decoration pattern */}
          <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#C9A45C]/20 to-transparent pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left max-w-2xl reveal-fade-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A45C] font-poppins text-xs font-semibold mb-4 border border-white/10">
                <Sparkles className="w-3.5 h-3.5" /> Promo Eksklusif Padang
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#FAF6F0] mb-3">
                Booking Pertama Lebih Hemat 10%
              </h2>
              <p className="font-sans text-[#FAF6F0]/80 text-base leading-relaxed">
                Gunakan kode voucher <span className="font-poppins font-semibold text-[#C9A45C] bg-white/10 px-2 py-0.5 rounded">GLAMEA10</span> saat checkout untuk potongan harga langsung pada pemesanan pertama Anda. Bebas pilih MUA manapun di Padang.
              </p>
            </div>

            <div className="shrink-0 reveal-fade-up delay-200">
              <Link href="/cari-mua">
                <Button
                  className="font-poppins bg-[#C9A45C] hover:bg-[#B59149] text-[#292321] font-semibold px-8 py-3.5 h-12 text-base rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Mulai Booking Sekarang
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* 6. Cara Kerja (How It Works) Section */}
        <section id="cara-kerja" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full scroll-mt-24">
          <div className="text-center mb-16 reveal-fade-up">
            <span className="font-poppins text-xs font-semibold tracking-wider uppercase text-[#C9A45C] block mb-2">
              Kemudahan & Transparansi
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#641A2B] mb-4">
              Cara Kerja GLAMÉA
            </h2>
            <p className="font-sans text-[#746A67] max-w-2xl mx-auto text-base">
              Pesan riasan profesional dengan empat langkah praktis tanpa ribet chat manual bolak-balik atau risiko transfer langsung.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                icon: Search,
                title: 'Cari & Bandingkan MUA',
                desc: 'Filter berdasarkan lokasi Padang, gaya riasan, tanggal, dan portofolio foto asli dengan harga transparan.'
              },
              {
                step: '02',
                icon: Calendar,
                title: 'Pilih Layanan & Jadwal',
                desc: 'Pilih paket makeup impian Anda dan kunci jadwal MUA secara instan di sistem GLAMÉA.'
              },
              {
                step: '03',
                icon: ShieldCheck,
                title: 'Bayar Aman via Escrow',
                desc: 'Pembayaran disimpan aman di rekening bersama GLAMÉA. Dana tidak langsung ditransfer ke MUA sebelum acara.'
              },
              {
                step: '04',
                icon: HeartHandshake,
                title: 'Riasan Sempurna di Hari H',
                desc: 'MUA hadir tepat waktu sesuai lokasi Anda. Dana baru diteruskan ke MUA setelah riasan selesai dengan sempurna.'
              }
            ].map((item, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-3xl bg-white border border-[#EDE3D9] shadow-sm hover:shadow-md transition-all flex flex-col justify-between reveal-fade-up delay-${(index + 1) * 100}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-serif text-3xl font-bold text-[#C9A45C]/50">
                      {item.step}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-[#FAF6F0] flex items-center justify-center text-[#641A2B] border border-[#EDE3D9]">
                      <item.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-[#292321] mb-2 font-poppins">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#746A67] leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Platform Escrow Clarification Banner */}
          <div className="mt-12 p-6 rounded-2xl bg-white/60 border border-[#EDE3D9] flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left reveal-fade-up">
            <div className="w-12 h-12 rounded-full bg-[#2F7D68]/10 text-[#2F7D68] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-poppins text-sm font-bold text-[#292321]">
                Jaminan Perlindungan Transaksi Klien GLAMÉA
              </h4>
              <p className="font-sans text-xs text-[#746A67] mt-0.5">
                Jangan khawatir tentang pembatalan mendadak atau ketidaksesuaian layanan. Tim dukungan kami siap mendampingi Anda hingga hari spesial selesai dengan kepuasan penuh.
              </p>
            </div>
            <Link href="/faq" className="shrink-0">
              <Button variant="ghost" size="sm" className="font-poppins text-[#641A2B] hover:bg-[#FAF6F0] text-xs font-semibold">
                Pelajari Kebijakan Garansi &rarr;
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* 7. Footer */}
      <Footer />
    </div>
  );
}
