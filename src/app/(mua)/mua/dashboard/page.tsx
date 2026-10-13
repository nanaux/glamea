"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Calendar, 
  Clock, 
  Wallet, 
  ArrowRight, 
  ArrowUpRight, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  Star, 
  MapPin, 
  Phone, 
  MessageCircle, 
  PlusCircle, 
  CalendarDays, 
  AlertCircle, 
  Eye, 
  ExternalLink, 
  ChevronRight, 
  UploadCloud,
  Check,
  X
} from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { mockMuas } from '@/data/mock-muas';

const INDO_DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const INDO_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];
const INDO_MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
];

export default function MuaDashboardPage() {
  const mua = mockMuas.find(m => m.id === 'mua-1') || mockMuas[0];
  
  // Real-time Date Handling
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  const todayDayName = INDO_DAYS[currentDate.getDay()];
  const todayDateNum = currentDate.getDate();
  const todayMonthName = INDO_MONTHS[currentDate.getMonth()];
  const todayYear = currentDate.getFullYear();
  const realtimeDateString = `${todayDayName}, ${todayDateNum} ${todayMonthName} ${todayYear}`;

  // Tomorrow (Agenda Terdekat)
  const tomorrow = new Date(currentDate);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDayName = INDO_DAYS[tomorrow.getDay()];
  const tomorrowDateNum = tomorrow.getDate();
  const tomorrowMonthShort = INDO_MONTHS_SHORT[tomorrow.getMonth()];
  const tomorrowYear = tomorrow.getFullYear();
  const tomorrowDateString = `${tomorrowDayName}, ${tomorrowDateNum} ${tomorrowMonthShort} ${tomorrowYear}`;

  // Upcoming Saturday for Permintaan Booking Baru
  const bookingDate = new Date(currentDate);
  const daysUntilSaturday = (6 - currentDate.getDay() + 7) % 7 || 7;
  bookingDate.setDate(bookingDate.getDate() + daysUntilSaturday);
  const bookingDayName = INDO_DAYS[bookingDate.getDay()];
  const bookingDateNum = bookingDate.getDate();
  const bookingMonthShort = INDO_MONTHS_SHORT[bookingDate.getMonth()];
  const bookingYear = bookingDate.getFullYear();
  const bookingDateString = `${bookingDayName}, ${bookingDateNum} ${bookingMonthShort} ${bookingYear}`;

  // Dynamic Week Days (Senin - Minggu)
  const dayOfWeek = currentDate.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(currentDate);
  monday.setDate(currentDate.getDate() + diffToMonday);

  const weekDates = [0, 1, 2, 3, 4, 5, 6].map((offset) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + offset);
    return d;
  });

  const sunday = weekDates[6];
  const weekRangeString = `Pekan ${monday.getDate()} ${INDO_MONTHS_SHORT[monday.getMonth()]} – ${sunday.getDate()} ${INDO_MONTHS_SHORT[sunday.getMonth()]} ${sunday.getFullYear()}`;

  // State interaktif sederhana untuk demo aksi
  const [requestActionState, setRequestActionState] = useState<'idle' | 'accepted' | 'declined'>('idle');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Metrik Keuangan & Booking
  const availablePayout = 1500000;
  const heldFunds = 225000;
  const completedCount = 1;
  const upcomingCount = 1;

  // Jadwal Minggu Ini (Ketersediaan Slot Rias Real-time)
  const weeklySchedule = [
    { day: 'Senin', date: `${weekDates[0].getDate()} ${INDO_MONTHS_SHORT[weekDates[0].getMonth()]}`, status: 'available', label: 'Tersedia' },
    { day: 'Selasa', date: `${weekDates[1].getDate()} ${INDO_MONTHS_SHORT[weekDates[1].getMonth()]}`, status: 'booked', label: 'Wisuda UNP (05:00)' },
    { day: 'Rabu', date: `${weekDates[2].getDate()} ${INDO_MONTHS_SHORT[weekDates[2].getMonth()]}`, status: 'available', label: 'Tersedia' },
    { day: 'Kamis', date: `${weekDates[3].getDate()} ${INDO_MONTHS_SHORT[weekDates[3].getMonth()]}`, status: 'available', label: 'Tersedia' },
    { day: 'Jumat', date: `${weekDates[4].getDate()} ${INDO_MONTHS_SHORT[weekDates[4].getMonth()]}`, status: 'available', label: 'Tersedia' },
    { day: 'Sabtu', date: `${weekDates[5].getDate()} ${INDO_MONTHS_SHORT[weekDates[5].getMonth()]}`, status: 'off', label: 'Libur Studio' },
    { day: 'Minggu', date: `${weekDates[6].getDate()} ${INDO_MONTHS_SHORT[weekDates[6].getMonth()]}`, status: 'pending', label: 'Permintaan Masuk' },
  ];

  // Portofolio Unggulan
  const showcaseLooks = [
    {
      id: 'look-1',
      title: 'Baralek Gadang Minang Modern',
      category: 'Wedding',
      image: '/images/hero-editorial.png',
      views: '1.2k',
      likes: 184
    },
    {
      id: 'look-2',
      title: 'Flawless Soft Korean Bridal',
      category: 'Bridal',
      image: '/images/mua-nadira.png',
      views: '890',
      likes: 142
    },
    {
      id: 'look-3',
      title: 'Fresh Glow Graduation Look',
      category: 'Wisuda',
      image: '/images/mua-citra.png',
      views: '640',
      likes: 95
    }
  ];

  return (
    <div className="space-y-7 pb-12">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#2D0A13] text-[#FAF6F0] px-5 py-3 rounded-xl shadow-lg border border-[#C9A45C]/30 text-xs sm:text-sm font-medium flex items-center gap-2.5 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
      
      {/* ======================================================== */}
      {/* 1. EXECUTIVE STUDIO HEADER & ACTION TOOLBAR              */}
      {/* ======================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#EDE3D9]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FAF4EB] text-[#A67C37] border border-[#C9A45C]/30 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A45C]" />
              Mitra Terverifikasi GLAMÉA
            </span>
            <span className="text-xs text-[#7A6E6A]">• Kota Padang</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#641A2B] tracking-tight">
            Selamat Beraktivitas!
          </h1>
          <p suppressHydrationWarning className="text-xs sm:text-sm text-[#7A6E6A] mt-1 font-light">
            {realtimeDateString}
          </p>
        </div>

        {/* Quick Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1 md:pt-0">
          <Link
            href="/mua/jadwal"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold font-poppins bg-[#641A2B] text-white hover:bg-[#4D1320] transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4 text-[#C9A45C]" />
            <span>Catat Jadwal</span>
          </Link>

          <Link
            href="/mua/pendapatan"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold font-poppins bg-white border border-[#EDE3D9] text-[#292321] hover:border-[#641A2B] hover:text-[#641A2B] transition-colors shadow-xs"
          >
            <ArrowUpRight className="w-4 h-4 text-[#A67C37]" />
            <span>Tarik Saldo</span>
          </Link>

          <Link
            href="/mua"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold font-poppins text-[#7A6E6A] hover:text-[#641A2B] hover:bg-[#FAF4EB]/60 transition-colors"
            title="Lihat profil publik Anda sebagaimana dilihat calon pengantin"
          >
            <span>Profil Publik</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. HARMONIOUS KPI METRIC CARDS (CLEAN & SCANNABLE)       */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Saldo Siap Cair */}
        <div className="group relative bg-white rounded-2xl border border-[#EDE3D9] p-5 shadow-xs hover:border-[#C9A45C]/60 hover:-translate-y-1.5 hover:shadow-[0_12px_28px_-6px_rgba(201,164,92,0.18)] transition-all duration-300 flex flex-col justify-between overflow-hidden">
          {/* Subtle top glow highlight line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#C9A45C]/0 to-transparent group-hover:via-[#C9A45C] transition-all duration-500" />
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#FAF4EB]/0 rounded-full blur-xl group-hover:bg-[#FAF4EB] transition-all duration-500 pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <span className="text-[11px] uppercase tracking-wider text-[#7A6E6A] font-semibold font-poppins group-hover:text-[#641A2B] transition-colors">
              Saldo Siap Cair
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF4EB] text-[#A67C37] flex items-center justify-center border border-[#C9A45C]/20 group-hover:scale-110 group-hover:border-[#C9A45C]/50 transition-all duration-300">
              <Wallet className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3 relative z-10">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#641A2B] tracking-tight group-hover:text-[#4D1320] transition-colors">
              {formatRupiah(availablePayout)}
            </div>
            <p className="text-xs text-[#7A6E6A] mt-1 font-light">
              BCA <span className="font-mono text-[11px]">•••• 7890</span> (Alya Putri)
            </p>
          </div>

          <div className="pt-3 border-t border-[#EDE3D9]/60 flex items-center justify-between text-xs relative z-10">
            <Link 
              href="/mua/pendapatan"
              className="text-[#641A2B] hover:underline font-semibold font-poppins inline-flex items-center gap-1 whitespace-nowrap shrink-0 group-hover:text-[#4D1320]"
            >
              <span>Tarik Saldo</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C9A45C] group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <span className="text-[10px] text-[#7A6E6A] bg-[#FAF6F0] px-2 py-0.5 rounded-md border border-[#EDE3D9] shrink-0 group-hover:border-[#C9A45C]/30 transition-colors">
              Bebas Admin
            </span>
          </div>
        </div>

        {/* Card 2: Dana Terproteksi Escrow */}
        <div className="group relative bg-white rounded-2xl border border-[#EDE3D9] p-5 shadow-xs hover:border-emerald-400/60 hover:-translate-y-1.5 hover:shadow-[0_12px_28px_-6px_rgba(16,185,129,0.15)] transition-all duration-300 flex flex-col justify-between overflow-hidden">
          {/* Subtle top glow highlight line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400/0 to-transparent group-hover:via-emerald-500 transition-all duration-500" />
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-emerald-50/0 rounded-full blur-xl group-hover:bg-emerald-50/60 transition-all duration-500 pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <span className="text-[11px] uppercase tracking-wider text-[#7A6E6A] font-semibold font-poppins group-hover:text-emerald-800 transition-colors">
              Dana Escrow Aktif
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/50 group-hover:scale-110 group-hover:border-emerald-300 transition-all duration-300">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3 relative z-10">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#292321] tracking-tight group-hover:text-emerald-950 transition-colors">
              {formatRupiah(heldFunds)}
            </div>
            <p className="text-xs text-[#7A6E6A] mt-1 font-light">
              1 pesanan aktif terproteksi aman
            </p>
          </div>

          <div className="pt-3 border-t border-[#EDE3D9]/60 flex items-center justify-between text-xs text-emerald-700 font-medium relative z-10">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
              <span>Sistem Proteksi Escrow</span>
            </span>
          </div>
        </div>

        {/* Card 3: Reservasi Bulan Ini */}
        <div className="group relative bg-white rounded-2xl border border-[#EDE3D9] p-5 shadow-xs hover:border-[#641A2B]/40 hover:-translate-y-1.5 hover:shadow-[0_12px_28px_-6px_rgba(100,26,43,0.15)] transition-all duration-300 flex flex-col justify-between overflow-hidden">
          {/* Subtle top glow highlight line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#641A2B]/0 to-transparent group-hover:via-[#641A2B] transition-all duration-500" />
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#FAF4EB]/0 rounded-full blur-xl group-hover:bg-[#FAF4EB] transition-all duration-500 pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <span suppressHydrationWarning className="text-[11px] uppercase tracking-wider text-[#7A6E6A] font-semibold font-poppins group-hover:text-[#641A2B] transition-colors">
              Reservasi {todayMonthName}
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF4EB] text-[#641A2B] flex items-center justify-center border border-[#EDE3D9] group-hover:scale-110 group-hover:border-[#C9A45C]/40 transition-all duration-300">
              <CalendarDays className="w-4 h-4 text-[#A67C37]" />
            </div>
          </div>

          <div className="my-3 relative z-10">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#292321] tracking-tight group-hover:text-[#641A2B] transition-colors">
              2 <span className="text-sm font-sans font-normal text-[#7A6E6A]">Sesi Rias</span>
            </div>
            <p className="text-xs text-[#7A6E6A] mt-1 font-light">
              1 Selesai • 1 Terkonfirmasi besok
            </p>
          </div>

          <div className="pt-3 border-t border-[#EDE3D9]/60 flex items-center justify-between text-xs relative z-10">
            <Link 
              href="/mua/jadwal" 
              className="text-[#641A2B] hover:underline font-medium inline-flex items-center gap-1 group-hover:text-[#4D1320]"
            >
              <span>Buka Kalender</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#C9A45C] group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium border border-emerald-200 group-hover:border-emerald-300 transition-colors">
              100% Hadir
            </span>
          </div>
        </div>

        {/* Card 4: Reputasi & Ulasan Klien */}
        <div className="group relative bg-white rounded-2xl border border-[#EDE3D9] p-5 shadow-xs hover:border-amber-400/60 hover:-translate-y-1.5 hover:shadow-[0_12px_28px_-6px_rgba(245,158,11,0.18)] transition-all duration-300 flex flex-col justify-between overflow-hidden">
          {/* Subtle top glow highlight line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/0 to-transparent group-hover:via-amber-400 transition-all duration-500" />
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-amber-50/0 rounded-full blur-xl group-hover:bg-amber-50/70 transition-all duration-500 pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <span className="text-[11px] uppercase tracking-wider text-[#7A6E6A] font-semibold font-poppins group-hover:text-amber-800 transition-colors">
              Rating
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
          </div>

          <div className="my-3 relative z-10">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#292321] tracking-tight group-hover:text-amber-950 transition-colors">4.9</span>
              <span className="text-xs text-[#7A6E6A]">/ 5.0</span>
            </div>
            <p className="text-xs text-[#7A6E6A] mt-1 font-light">
              Berdasarkan 48 ulasan terverifikasi
            </p>
          </div>

          <div className="pt-3 border-t border-[#EDE3D9]/60 flex items-center justify-between text-xs relative z-10">
            <span className="inline-flex items-center gap-1 text-[#A67C37] font-medium text-[11px]">
              <Sparkles className="w-3.5 h-3.5 group-hover:scale-125 transition-transform duration-300 text-amber-500" />
              <span className="group-hover:text-amber-800 transition-colors">Top Rated Padang 2026</span>
            </span>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 3. MAIN WORKSPACE (2 CLEAN EDITORIAL COLUMNS)             */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        
        {/* KOLOM KIRI (7/12): Agenda Rias Terdekat & Permintaan Booking */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Hero Call Sheet: Sesi Rias Terdekat */}
          <div className="bg-white rounded-2xl border border-[#EDE3D9] shadow-xs overflow-hidden">
            {/* Header Strip */}
            <div className="px-6 py-4 bg-[#FAF4EB]/60 border-b border-[#EDE3D9] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold font-poppins uppercase tracking-wider text-[#641A2B]">
                  Agenda Rias Terdekat
                </span>
                <span className="text-[11px] font-semibold font-poppins bg-white text-[#A67C37] border border-[#C9A45C]/30 px-2 py-0.5 rounded-full">
                  Besok Pagi
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#7A6E6A]">
                #BKG-001
              </span>
            </div>

            {/* Card Content */}
            <div className="p-6">
              {/* Title & Price Row */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-5 border-b border-[#EDE3D9]/60">
                <div>
                  <h3 className="font-poppins text-xl font-bold text-[#292321]">
                    Graduation Glam Makeup
                  </h3>
                  <p className="text-xs sm:text-sm text-[#7A6E6A] mt-1">
                    Klien: <span className="font-medium text-[#292321]">Siti Aminah</span> • 1 Orang Wisudawati
                  </p>
                </div>

                <div className="sm:text-right">
                  <span className="text-[11px] uppercase tracking-wider text-[#7A6E6A] block">Nilai Pembayaran</span>
                  <span className="text-xl font-bold text-[#641A2B] font-serif">{formatRupiah(225000)}</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full inline-block mt-1 font-medium">
                    ✓ Lunas via Escrow
                  </span>
                </div>
              </div>

              {/* Rincian Operasional (Clean Minimalist Info) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 border-b border-[#EDE3D9]/60 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF4EB] text-[#641A2B] flex items-center justify-center shrink-0 border border-[#C9A45C]/20">
                    <Clock className="w-4 h-4 text-[#A67C37]" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-[#7A6E6A] font-semibold">Jadwal Sesi Rias</p>
                    <p suppressHydrationWarning className="font-semibold text-[#292321] mt-0.5">{tomorrowDateString}</p>
                    <p className="text-xs text-[#641A2B] font-medium">05:00 WIB (Subuh)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF4EB] text-[#641A2B] flex items-center justify-center shrink-0 border border-[#C9A45C]/20">
                    <MapPin className="w-4 h-4 text-[#A67C37]" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-[#7A6E6A] font-semibold">Lokasi Panggilan</p>
                    <p className="font-semibold text-[#292321] mt-0.5">Gedung Serbaguna UNP</p>
                    <p className="text-xs text-[#7A6E6A]">Air Tawar Barat, Kota Padang</p>
                  </div>
                </div>
              </div>

              {/* Catatan Permintaan Klien (Clean Editorial Quote) */}
              <div className="my-5 pl-4 border-l-2 border-[#C9A45C] py-1 bg-[#FAF6F0]/50 rounded-r-xl pr-3">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#A67C37] block mb-0.5">
                  Catatan Klien:
                </span>
                <p className="text-xs sm:text-sm italic text-[#524644] leading-relaxed">
                  &ldquo;Tolong jangan terlalu tebal foundation-nya ya kak, mau look fresh natural Korean tone untuk wisuda fakultas bahasa.&rdquo;
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2.5">
                  <a
                    href="https://wa.me/6281122223333"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold font-poppins bg-[#641A2B] text-white hover:bg-[#4D1320] transition-colors shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#C9A45C]" />
                    <span>Hubungi Klien via WA</span>
                  </a>

                  <Link
                    href="/mua/chat"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold font-poppins bg-white border border-[#EDE3D9] text-[#292321] hover:border-[#641A2B] hover:text-[#641A2B] transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#7A6E6A]" />
                    <span>Kirim Pesan</span>
                  </Link>
                </div>

                <Link
                  href="/mua/booking"
                  className="text-xs text-[#7A6E6A] hover:text-[#641A2B] hover:underline inline-flex items-center gap-1 font-semibold font-poppins"
                >
                  <span>Detail Pemesanan</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Permintaan Booking Baru */}
          <div className="bg-white rounded-2xl border border-[#EDE3D9] shadow-xs p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#EDE3D9]/60">
              <div className="flex items-center gap-2">
                <h3 className="font-poppins text-lg font-bold text-[#292321]">
                  Permintaan Booking Baru
                </h3>
                <span className="text-[11px] font-bold font-poppins bg-[#641A2B]/10 text-[#641A2B] px-2.5 py-0.5 rounded-full shrink-0">
                  1 Menunggu
                </span>
              </div>
              <Link 
                href="/mua/booking" 
                className="text-xs text-[#641A2B] font-semibold font-poppins hover:underline inline-flex items-center gap-1 shrink-0"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Interactive Request Card */}
            {requestActionState === 'idle' ? (
              <div className="mt-5 p-5 rounded-xl border border-[#EDE3D9] bg-[#FAF6F0]/40 hover:bg-[#FAF6F0]/70 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#641A2B] text-white flex items-center justify-center font-serif font-bold text-sm shrink-0 shadow-xs">
                      R
                    </div>
                    <div>
                      <h4 className="font-semibold font-poppins text-sm text-[#292321]">Rina Permatasari</h4>
                      <p className="text-xs text-[#7A6E6A] mt-0.5">Makeup Lamaran & Engagement Look</p>
                      
                      <div className="flex flex-wrap items-center gap-2.5 mt-2 text-xs text-[#7A6E6A]">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#A67C37]" />
                          <span suppressHydrationWarning>{bookingDateString}</span>
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#A67C37]" />
                          <span>08:00 WIB</span>
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#A67C37]" />
                          <span>Pangeran Beach Hotel</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <span className="text-[11px] text-[#7A6E6A] block">Estimasi Total</span>
                    <span className="font-bold text-base text-[#641A2B] font-serif">{formatRupiah(500000)}</span>
                    <span className="text-[11px] text-[#A67C37] block font-medium">2 Orang (Pengantin + Ibu)</span>
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-[#EDE3D9]/60 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-[#7A6E6A] italic">
                    &ldquo;Mohon info apakah ada biaya transport untuk area Pantai Padang?&rdquo;
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRequestActionState('declined')}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold font-poppins text-rose-700 hover:bg-rose-50 border border-rose-200/60 transition-colors"
                    >
                      Tolak
                    </button>
                    <button
                      onClick={() => setRequestActionState('accepted')}
                      className="px-4 py-1.5 rounded-xl text-xs font-semibold font-poppins bg-[#641A2B] text-white hover:bg-[#4D1320] transition-colors shadow-xs"
                    >
                      Terima & Kunci Jadwal
                    </button>
                  </div>
                </div>
              </div>
            ) : requestActionState === 'accepted' ? (
              <div className="mt-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Permintaan Rina Permatasari diterima! Slot telah dikunci di kalender jadwal Anda.</span>
                </div>
                <button
                  onClick={() => setRequestActionState('idle')}
                  className="text-xs text-emerald-900 underline font-medium ml-2"
                >
                  Reset
                </button>
              </div>
            ) : (
              <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-between">
                <span className="text-xs">Permintaan ditolak dengan sopan. Slot waktu tetap tersedia untuk calon klien lain.</span>
                <button
                  onClick={() => setRequestActionState('idle')}
                  className="text-xs text-slate-900 underline font-medium ml-2"
                >
                  Reset
                </button>
              </div>
            )}
          </div>

        </div>

        {/* KOLOM KANAN (5/12): Ketersediaan Slot & Portofolio Teratas */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Widget 1: Kalender Ketersediaan Slot Mingguan */}
          <div className="bg-white rounded-2xl border border-[#EDE3D9] shadow-xs p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#EDE3D9]/60">
              <div>
                <h3 className="font-poppins text-lg font-bold text-[#292321]">
                  Ketersediaan Slot Rias
                </h3>
                <p suppressHydrationWarning className="text-xs text-[#7A6E6A]">{weekRangeString}</p>
              </div>
              <Link 
                href="/mua/jadwal" 
                className="text-xs text-[#641A2B] font-semibold font-poppins hover:underline inline-flex items-center gap-1"
              >
                <span>Kelola Slot</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#C9A45C]" />
              </Link>
            </div>

            <div className="mt-3.5 divide-y divide-[#EDE3D9]/40">
              {weeklySchedule.map((item, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between py-2.5 text-xs hover:bg-[#FAF6F0]/40 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-12 font-medium text-[#292321]">{item.day}</span>
                    <span className="text-[#A0938E] text-[11px] font-mono">{item.date}</span>
                  </div>

                  <div>
                    {item.status === 'booked' && (
                      <span className="px-2.5 py-0.5 rounded-full font-medium bg-[#641A2B] text-white text-[11px] shadow-xs">
                        {item.label}
                      </span>
                    )}
                    {item.status === 'available' && (
                      <span className="px-2.5 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[11px]">
                        ✓ {item.label}
                      </span>
                    )}
                    {item.status === 'off' && (
                      <span className="px-2.5 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600 text-[11px]">
                        {item.label}
                      </span>
                    )}
                    {item.status === 'pending' && (
                      <span className="px-2.5 py-0.5 rounded-full font-medium bg-amber-50 text-amber-800 border border-amber-200/60 text-[11px]">
                        • {item.label}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Widget 2: Showcase Portofolio Teratas */}
          <div className="bg-white rounded-2xl border border-[#EDE3D9] shadow-xs p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#EDE3D9]/60">
              <div>
                <h3 className="font-poppins text-lg font-bold text-[#292321]">
                  Portofolio Teratas
                </h3>
                <p className="text-xs text-[#7A6E6A]">Look paling sering dilihat calon pengantin</p>
              </div>
              <Link 
                href="/mua/portofolio" 
                className="text-xs text-[#641A2B] font-semibold font-poppins hover:underline inline-flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#C9A45C]" />
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {showcaseLooks.map((look) => (
                <div 
                  key={look.id}
                  className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-[#FAF6F0]/60 transition-colors group"
                >
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#EDE3D9] shrink-0 bg-[#4A101D]">
                    <Image
                      src={look.image}
                      alt={look.title}
                      fill
                      sizes="48px"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase tracking-wider text-[#A67C37] font-semibold block">
                      {look.category}
                    </span>
                    <h4 className="font-medium text-xs text-[#292321] truncate mt-0.5">
                      {look.title}
                    </h4>
                    <div className="flex items-center gap-2.5 mt-0.5 text-[11px] text-[#A0938E]">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{look.views} tayangan</span>
                      </span>
                      <span>•</span>
                      <span>{look.likes} suka</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-[#EDE3D9]/60">
              <Link
                href="/mua/portofolio"
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-dashed border-[#C9A45C] text-xs font-semibold font-poppins text-[#641A2B] bg-[#FAF4EB]/40 hover:bg-[#FAF4EB] transition-colors"
              >
                <UploadCloud className="w-3.5 h-3.5 text-[#A67C37]" />
                <span>+ Upload Karya Rias Baru</span>
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
