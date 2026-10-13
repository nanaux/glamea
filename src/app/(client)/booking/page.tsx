"use client";

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ChevronLeft, 
  Info, 
  Calendar as CalendarIcon, 
  MapPin, 
  Users, 
  Clock, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { mockServices } from '@/data/mock-services';
import { mockMuas } from '@/data/mock-muas';
import { formatRupiah, calculatePricing } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const serviceId = searchParams.get('serviceId');
  const muaId = searchParams.get('muaId');
  
  const [isFirstBooking, setIsFirstBooking] = useState(true); // Demo first booking discount
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState('1');
  const [occasion, setOccasion] = useState('');
  const [notes, setNotes] = useState('');

  // Fallback ke MUA pertama dan layanannya jika param tidak ada
  const mua = mockMuas.find(m => m.id === muaId) || mockMuas[0];
  const service = mockServices.find(s => s.id === serviceId) 
    || mockServices.find(s => s.muaId === mua.id) 
    || mockServices[0];

  const { subtotal, discount, total } = calculatePricing(service.price, isFirstBooking);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const draft = {
      muaId: mua.id,
      serviceId: service.id,
      date,
      time,
      location,
      numberOfPeople: parseInt(numberOfPeople),
      occasion,
      notes,
      subtotal,
      discount,
      total
    };
    
    localStorage.setItem('glamea_draft_booking', JSON.stringify(draft));
    router.push('/pembayaran');
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 md:py-12 text-[#2D221E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb / Back */}
        <button 
          onClick={() => router.back()} 
          className="font-poppins inline-flex items-center gap-1.5 text-xs font-semibold text-[#3A101C]/70 hover:text-[#3A101C] mb-6 transition-colors bg-white px-3.5 py-1.5 rounded-full border border-[#C9A45C]/30 shadow-2xs"
        >
          <ChevronLeft size={16} className="text-[#C9A45C]" />
          <span>Kembali ke Detail Studio</span>
        </button>

        {/* Header Title */}
        <div className="mb-8">

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#3A101C]">
            Formulir Reservasi Layanan
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#2D221E]/75 mt-1">
            Lengkapi spesifikasi waktu dan lokasi acara Anda. Dana Anda dilindungi sepenuhnya oleh Garansi Escrow GLAMÉA.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Col - Atelier Form Specification */}
          <div className="flex-1 w-full">
            <form 
              id="booking-form" 
              onSubmit={handleSubmit} 
              className="bg-white p-6 md:p-8 rounded-3xl border border-[#C9A45C]/25 shadow-sm space-y-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3A101C] via-[#C9A45C] to-[#3A101C]" />

              <div className="border-b border-[#C9A45C]/15 pb-4">
                <h3 className="font-serif text-lg font-bold text-[#3A101C]">
                  Spesifikasi Acara & Jadwal Rias
                </h3>
                <p className="font-sans text-xs text-[#2D221E]/70 mt-0.5">
                  Informasi ini akan disinkronkan langsung ke agenda kalender resmi MUA.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-sans">
                <div>
                  <label className="font-poppins block font-semibold text-[#3A101C] mb-2">
                    Kategori Acara
                  </label>
                  <Select 
                    value={occasion} 
                    onChange={e => setOccasion(e.target.value)} 
                    required
                    className="font-sans border-[#C9A45C]/35 rounded-xl text-xs py-2.5 bg-[#FAF8F5]"
                  >
                    <option value="">Pilih Kategori Acara...</option>
                    <option value="Wedding">Akad & Resepsi Pernikahan</option>
                    <option value="Baralek">Baralek Adat Minang</option>
                    <option value="Engagement">Lamaran & Tunangan</option>
                    <option value="Graduation">Wisuda & Yudisium</option>
                    <option value="Party">Pesta & Evening Glamour</option>
                    <option value="Photoshoot">Sesi Foto / Prewedding</option>
                  </Select>
                </div>
                
                <div>
                  <label className="font-poppins block font-semibold text-[#3A101C] mb-2">
                    Jumlah Orang yang Dirias
                  </label>
                  <Select 
                    value={numberOfPeople} 
                    onChange={e => setNumberOfPeople(e.target.value)} 
                    required
                    className="font-sans border-[#C9A45C]/35 rounded-xl text-xs py-2.5 bg-[#FAF8F5]"
                  >
                    <option value="1">1 Orang (Pengantin / Wisudawati Utama)</option>
                    <option value="2">2 Orang (+ Ibu / Saudara)</option>
                    <option value="3">3 Orang (+ Bridesmaids)</option>
                    <option value="4">4 Orang</option>
                    <option value="5">5+ Orang (Rombongan Keluarga)</option>
                  </Select>
                </div>

                <div>
                  <label className="font-poppins block font-semibold text-[#3A101C] mb-2">
                    Tanggal Acara
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <CalendarIcon className="h-4 w-4 text-[#C9A45C]" />
                    </div>
                    <Input 
                      type="date" 
                      className="font-sans pl-10 h-11 border-[#C9A45C]/35 rounded-xl text-xs bg-[#FAF8F5]" 
                      value={date} 
                      onChange={e => setDate(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="font-poppins block font-semibold text-[#3A101C] mb-2">
                    Waktu Mulai Rias (WIB)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Clock className="h-4 w-4 text-[#C9A45C]" />
                    </div>
                    <Input 
                      type="time" 
                      className="font-sans pl-10 h-11 border-[#C9A45C]/35 rounded-xl text-xs bg-[#FAF8F5]" 
                      value={time} 
                      onChange={e => setTime(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="font-poppins block font-semibold text-[#3A101C] mb-2">
                    Lokasi Acara Lengkap (Home Service / Gedung di Padang)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 pt-3.5 pointer-events-none">
                      <MapPin className="h-4 w-4 text-[#C9A45C]" />
                    </div>
                    <textarea 
                      className="font-sans flex w-full rounded-2xl border border-[#C9A45C]/35 bg-[#FAF8F5] pl-10 pr-3.5 py-3 text-xs text-[#2D221E] transition-colors placeholder:text-[#2D221E]/40 focus-visible:outline-none focus-visible:border-[#3A101C] focus-visible:ring-1 focus-visible:ring-[#3A101C] min-h-[100px]"
                      placeholder="Contoh: Gedung UPI Convention Center, Lt. 1, Jl. Raya Lubuk Begalung, Padang"
                      required
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="font-poppins block font-semibold text-[#3A101C] mb-2">
                    Catatan Tambahan & Preferensi Look (Opsional)
                  </label>
                  <textarea 
                    className="font-sans flex w-full rounded-2xl border border-[#C9A45C]/35 bg-[#FAF8F5] px-3.5 py-3 text-xs text-[#2D221E] transition-colors placeholder:text-[#2D221E]/40 focus-visible:outline-none focus-visible:border-[#3A101C] focus-visible:ring-1 focus-visible:ring-[#3A101C] min-h-[80px]"
                    placeholder="Contoh: Ingin alis tetap rapi tanpa dicukur, tema busana warna maroon & suntiang emas, kulit cenderung sensitif."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>

              {/* Escrow Banner inside form */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-poppins font-bold text-emerald-900">Garansi Rekening Escrow GLAMÉA</p>
                  <p className="font-sans text-[11px] text-emerald-800 leading-relaxed">
                    Pembayaran Anda tidak langsung diteruskan ke rekening MUA. Uang disimpan aman di sistem GLAMÉA dan baru dilepas ke MUA setelah sesi rias Anda selesai pada hari H.
                  </p>
                </div>
              </div>

            </form>
          </div>

          {/* Right Col - Atelier Reservation Summary Ticket */}
          <div className="w-full lg:w-[420px] shrink-0">
            <Card className="sticky top-24 border-[#C9A45C]/30 rounded-3xl shadow-md overflow-hidden bg-white">
              <CardContent className="p-0">
                
                {/* Header Ticket */}
                <div className="p-6 border-b border-[#C9A45C]/20 bg-[#FAF8F5] relative">
                  <span className="font-poppins text-[10px] uppercase font-bold tracking-wider text-[#C9A45C] block mb-2">
                    Ringkasan Reservasi Atelier
                  </span>
                  
                  {/* MUA Info Card */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden relative shrink-0 border-2 border-white shadow-sm ring-1 ring-[#C9A45C]/30">
                      <Image
                        src={mua.portfolioImage || '/images/mua-alya.png'}
                        alt={mua.name}
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#3A101C] leading-tight">
                        {mua.name}
                      </h4>
                      <p className="font-sans text-xs text-[#2D221E]/70 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#C9A45C]" />
                        {mua.location}, Padang
                      </p>
                    </div>
                  </div>

                  {/* Selected Service Card */}
                  <div className="bg-white p-3.5 rounded-2xl border border-[#C9A45C]/25 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-poppins text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF4EB] text-[#3A101C] uppercase tracking-wide">
                        {service.category}
                      </span>
                      <span className="font-poppins text-[11px] text-[#2D221E]/60 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#C9A45C]" />
                        {service.durationMinutes} Menit
                      </span>
                    </div>
                    <p className="font-serif font-bold text-sm text-[#3A101C] pt-0.5">
                      {service.name}
                    </p>
                  </div>
                </div>
                
                {/* Price Breakdown */}
                <div className="p-6 space-y-3.5 text-xs">
                  <div className="flex justify-between items-center text-[#2D221E]/80 font-sans">
                    <span>Tarif Paket Layanan</span>
                    <span className="font-poppins font-semibold text-[#3A101C]">{formatRupiah(service.price)}</span>
                  </div>
                  
                  {isFirstBooking && (
                    <div className="flex justify-between items-center text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-sans">
                      <span className="flex items-center gap-1 font-medium">
                        <Sparkles size={13} className="text-emerald-600" />
                        Diskon Selamat Datang (10%)
                      </span>
                      <span className="font-poppins font-bold">-{formatRupiah(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-[#2D221E]/70 pt-1 font-sans">
                    <span>Biaya Jasa Perlindungan Escrow</span>
                    <span className="font-poppins text-emerald-700 font-semibold">GRATIS</span>
                  </div>
                  
                  <div className="border-t border-[#C9A45C]/20 pt-4 mt-2">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <span className="font-poppins font-bold text-xs uppercase tracking-wider text-[#3A101C]/60 block">
                          Total Pembayaran
                        </span>
                        <span className="font-sans text-[10px] text-emerald-800">
                          (Ditampung di Rekening Escrow)
                        </span>
                      </div>
                      <span className="font-serif font-bold text-2xl text-[#3A101C]">
                        {formatRupiah(total)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-[#FAF4EB] border border-[#C9A45C]/35 rounded-2xl p-3.5 text-[11px] text-[#3A101C] font-sans leading-relaxed mb-4">
                    <strong className="font-poppins font-bold">Pemberitahuan Transaksi:</strong> <br/>
                    Pembayaran diproses secara terenkripsi via GLAMÉA. Tidak diperkenankan bertransaksi tunai di luar sistem demi jaminan keamanan jadwal Anda.
                  </div>

                  <Button 
                    type="submit" 
                    form="booking-form" 
                    className="font-poppins w-full py-3 bg-[#3A101C] hover:bg-[#641A2B] text-[#FAF8F5] rounded-2xl font-semibold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Lanjut ke Pembayaran Terproteksi</span>
                    <ArrowRight className="w-4 h-4 text-[#C9A45C]" />
                  </Button>
                  
                  <div className="text-center pt-1">
                    <label className="font-sans text-[11px] text-[#3A101C]/60 cursor-pointer hover:underline inline-flex items-center gap-1">
                      <input 
                        type="checkbox" 
                        checked={isFirstBooking} 
                        onChange={e => setIsFirstBooking(e.target.checked)} 
                        className="rounded text-[#3A101C]"
                      />
                      <span>Simulasi Kupon Diskon Klien Baru</span>
                    </label>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="font-poppins p-20 text-center text-sm text-[#3A101C]/60">Memuat Formulir Reservasi Atelier...</div>}>
      <BookingForm />
    </Suspense>
  );
}
