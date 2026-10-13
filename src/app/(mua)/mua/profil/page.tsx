"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShieldCheck, 
  MapPin, 
  Star, 
  ExternalLink, 
  Camera, 
  Check, 
  Plus, 
  Edit3, 
  Trash2, 
  Clock, 
  DollarSign, 
  Building2, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  AtSign, 
  Phone, 
  Mail, 
  Sparkles,
  Info,
  Sliders,
  Calendar,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatRupiah } from '@/lib/utils';
import { mockMuas } from '@/data/mock-muas';
import { mockServices } from '@/data/mock-services';
import { Service } from '@/types';

// Opsi Kecamatan di Kota Padang
const PADANG_DISTRICTS = [
  'Kuranji',
  'Padang Barat',
  'Padang Timur',
  'Padang Utara',
  'Padang Selatan',
  'Koto Tangah',
  'Pauh',
  'Lubuk Begalung',
  'Lubuk Kilangan',
  'Nanggalo',
  'Bungus Teluk Kabung'
];

// Opsi Gaya Signature Makeup
const AVAILABLE_STYLES = [
  'Korean Soft Glam',
  'Traditional Minang',
  'Suntiang Gadang Modern',
  'Flawless Dewy',
  'Bold Reception Glam',
  'Clean Hijab Bridal',
  'Natural Photoshoot',
  'Arabic Smokey Eyes'
];

export default function MuaProfilPage() {
  const defaultMua = mockMuas[0]; // Alya Makeup
  const defaultServices = mockServices.filter(s => s.muaId === 'mua-1');

  // State Profil Utama
  const [activeTab, setActiveTab] = useState<'profil' | 'layanan' | 'operasional' | 'rekening'>('profil');
  const [studioName, setStudioName] = useState(defaultMua.name);
  const [tagline, setTagline] = useState('Spesialis Wedding & Baralek Minang Tradisional');
  const [email, setEmail] = useState(defaultMua.email);
  const [phone, setPhone] = useState(defaultMua.phone);
  const [instagram, setInstagram] = useState('@alyamakeup.padang');
  const [location, setLocation] = useState(defaultMua.location);
  const [address, setAddress] = useState('Jl. Bypass KM 11, Belimbing, Kuranji, Kota Padang');
  const [bio, setBio] = useState(defaultMua.bio);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(defaultMua.makeupStyles);
  
  // State Layanan
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    category: 'Wedding' as Service['category'],
    price: 1500000,
    durationMinutes: 180,
    description: '',
  });

  // State Operasional & Kebijakan
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([
    'Kuranji',
    'Padang Barat',
    'Padang Timur',
    'Padang Utara',
    'Koto Tangah',
    'Pauh'
  ]);
  const [homeServiceAvailable, setHomeServiceAvailable] = useState(true);
  const [transportFeePerKm, setTransportFeePerKm] = useState('Rp 5.000 / km (Free radius 5 km)');
  const [reschedulePolicy, setReschedulePolicy] = useState('Maksimal H-7 sebelum hari pelaksanaan tanpa biaya tambahan, tergantung ketersediaan agenda studio.');
  const [cancellationPolicy, setCancellationPolicy] = useState('Deposit DP 30% ditahan di GLAMÉA Escrow. Pembatalan sepihak oleh klien H-3 ke bawah mengakibatkan DP hangus.');

  // State Rekening & Keamanan
  const [bankName, setBankName] = useState(defaultMua.bankAccount?.bankName || 'BCA');
  const [accountNumber, setAccountNumber] = useState(defaultMua.bankAccount?.accountNumber || '1234567890');
  const [accountHolder, setAccountHolder] = useState(defaultMua.bankAccount?.accountHolder || 'Alya Putri');
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);

  // State Notifikasi Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handler Toggle Style
  const toggleStyle = (style: string) => {
    if (selectedStyles.includes(style)) {
      if (selectedStyles.length > 1) {
        setSelectedStyles(selectedStyles.filter(s => s !== style));
      }
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  // Handler Toggle Kecamatan
  const toggleDistrict = (district: string) => {
    if (selectedDistricts.includes(district)) {
      if (selectedDistricts.length > 1) {
        setSelectedDistricts(selectedDistricts.filter(d => d !== district));
      }
    } else {
      setSelectedDistricts([...selectedDistricts, district]);
    }
  };

  // Handler Buka Modal Layanan
  const handleOpenAddService = () => {
    setEditingServiceId(null);
    setServiceForm({
      name: '',
      category: 'Wedding',
      price: 1500000,
      durationMinutes: 180,
      description: '',
    });
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (service: Service) => {
    setEditingServiceId(service.id);
    setServiceForm({
      name: service.name,
      category: service.category,
      price: service.price,
      durationMinutes: service.durationMinutes,
      description: service.description,
    });
    setIsServiceModalOpen(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.name.trim()) return;

    if (editingServiceId) {
      // Edit existing
      setServices(services.map(s => s.id === editingServiceId ? {
        ...s,
        name: serviceForm.name,
        category: serviceForm.category,
        price: serviceForm.price,
        durationMinutes: serviceForm.durationMinutes,
        description: serviceForm.description,
      } : s));
      showToast('Layanan berhasil diperbarui.');
    } else {
      // Create new
      const newSvc: Service = {
        id: `svc-${Date.now()}`,
        muaId: 'mua-1',
        name: serviceForm.name,
        category: serviceForm.category,
        price: serviceForm.price,
        durationMinutes: serviceForm.durationMinutes,
        description: serviceForm.description || 'Paket riasan profesional GLAMÉA Atelier.',
      };
      setServices([...services, newSvc]);
      showToast('Layanan baru berhasil ditambahkan.');
    }

    setIsServiceModalOpen(false);
  };

  const handleDeleteService = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menonaktifkan paket layanan ini?')) {
      setServices(services.filter(s => s.id !== id));
      showToast('Layanan telah dihapus.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#641A2B] text-[#FAF6F0] px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#C9A45C]/40 animate-in fade-in slide-in-from-top-4 duration-200">
          <Check className="w-4 h-4 text-[#C9A45C]" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. ATELIER IDENTITY HEADER & BANNER                      */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl border border-[#C9A45C]/20 shadow-xs overflow-hidden">
        {/* Banner Cover Top */}
        <div className="h-48 md:h-56 w-full relative overflow-hidden bg-[#2D0A13]">
          {/* Studio Atelier Cover Image */}
          <Image
            src="/images/studio-cover.png"
            alt="Studio Cover Atelier"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Luxury Burgundy & Vignette Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#2D0A13]/80 via-[#4D1320]/50 to-[#2D0A13]/85" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2D0A13]/90 via-transparent to-black/30" />

          {/* Top Status Badge */}
          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-[#FAF6F0] text-xs font-semibold font-poppins flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Status Profil: Publik & Aktif</span>
          </div>

          {/* Change Cover Button (Bottom-Right of Banner) */}
          <button
            onClick={() => showToast('Pilih foto sampul studio baru (rekomendasi: 1920x600 px).')}
            className="absolute bottom-3 right-4 bg-black/50 hover:bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 text-[#FAF6F0] text-xs font-semibold font-poppins flex items-center gap-2 transition-colors shadow-sm"
            title="Ubah Foto Sampul Studio"
          >
            <Camera className="w-3.5 h-3.5 text-[#C9A45C]" />
            <span>Ubah Sampul Studio</span>
          </button>
        </div>

        {/* Profile Card Body */}
        <div className="px-6 md:px-8 pb-6 relative pt-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-3">
            {/* Avatar & Main Titles */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              <div className="relative group shrink-0 -mt-16 md:-mt-20">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl border-4 border-white shadow-md overflow-hidden relative bg-[#FAF6F0]">
                  <Image 
                    src={defaultMua.portfolioImage || '/images/mua-alya.png'} 
                    alt={studioName}
                    fill
                    className="object-cover"
                  />
                </div>
                <button 
                  onClick={() => showToast('Pilih foto baru dari galeri komputer Anda.')}
                  className="absolute bottom-1 right-1 p-2 bg-[#641A2B] text-[#FAF6F0] rounded-xl shadow-md hover:bg-[#4D1320] transition-colors border-2 border-white"
                  title="Ganti Foto Profil Studio"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5 pb-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#641A2B]">
                    {studioName}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Terverifikasi
                  </span>
                </div>
                <p className="text-xs md:text-sm text-[#641A2B]/80 font-medium">
                  {tagline}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#2D221E]/70 pt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#C9A45C]" />
                    {location}, Kota Padang
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-[#C9A45C] text-[#C9A45C]" />
                    <strong className="text-[#2D221E]">4.9</strong> (48 Ulasan Klien)
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons Top */}
            <div className="flex items-center gap-3 pb-1">
              <Link 
                href="/mua/mua-1" 
                target="_blank"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#C9A45C]/40 text-xs font-semibold font-poppins text-[#641A2B] hover:bg-[#FAF6F0] transition-colors shadow-xs"
              >
                <span>Lihat Halaman Publik</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <Button
                onClick={() => showToast('Semua pembaruan profil telah disimpan.')}
                className="px-5 py-2.5 bg-[#641A2B] hover:bg-[#4D1320] text-[#FAF6F0] rounded-xl text-xs font-semibold font-poppins shadow-xs"
              >
                Simpan Perubahan
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="border-t border-[#C9A45C]/20 px-6 md:px-8 bg-[#FAF6F0]/50 flex items-center gap-2 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab('profil')}
            className={`py-3.5 px-4 text-xs font-semibold font-poppins border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'profil'
                ? 'border-[#641A2B] text-[#641A2B] bg-white/70'
                : 'border-transparent text-[#641A2B]/60 hover:text-[#641A2B]'
            }`}
          >
            <span>Identitas & Filosofi Atelier</span>
          </button>
          <button
            onClick={() => setActiveTab('layanan')}
            className={`py-3.5 px-4 text-xs font-semibold font-poppins border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'layanan'
                ? 'border-[#641A2B] text-[#641A2B] bg-white/70'
                : 'border-transparent text-[#641A2B]/60 hover:text-[#641A2B]'
            }`}
          >
            <span>Katalog Layanan & Tarif</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#641A2B]/10 text-[#641A2B]">
              {services.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('operasional')}
            className={`py-3.5 px-4 text-xs font-semibold font-poppins border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'operasional'
                ? 'border-[#641A2B] text-[#641A2B] bg-white/70'
                : 'border-transparent text-[#641A2B]/60 hover:text-[#641A2B]'
            }`}
          >
            <span>Area Jangkauan & Kebijakan</span>
          </button>
          <button
            onClick={() => setActiveTab('rekening')}
            className={`py-3.5 px-4 text-xs font-semibold font-poppins border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'rekening'
                ? 'border-[#641A2B] text-[#641A2B] bg-white/70'
                : 'border-transparent text-[#641A2B]/60 hover:text-[#641A2B]'
            }`}
          >
            <span>Rekening & Keamanan Escrow</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. TAB 1: IDENTITAS & FILOSOFI ATELIER                   */}
      {/* ======================================================== */}
      {activeTab === 'profil' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri: Form Identitas & Kontak */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-[#C9A45C]/20 p-6 md:p-8 shadow-xs space-y-5">
              <div className="border-b border-[#C9A45C]/15 pb-4">
                <h3 className="font-poppins font-bold text-lg text-[#641A2B]">Informasi Brand & Studio</h3>
                <p className="text-xs text-[#641A2B]/70 mt-0.5">
                  Informasi ini ditampilkan di direktori pencarian MUA dan halaman detail pesanan klien.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#2D221E]">Nama Studio / Brand</label>
                  <input
                    type="text"
                    value={studioName}
                    onChange={e => setStudioName(e.target.value)}
                    className="w-full bg-[#FAF6F0] border border-[#C9A45C]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#2D221E] focus:outline-none focus:ring-1 focus:ring-[#641A2B]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#2D221E]">Slogan / Spesialisasi Riasan</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={e => setTagline(e.target.value)}
                    className="w-full bg-[#FAF6F0] border border-[#C9A45C]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#2D221E] focus:outline-none focus:ring-1 focus:ring-[#641A2B]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#2D221E]">Nomor WhatsApp Bisnis</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full bg-[#FAF6F0] border border-[#C9A45C]/30 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#2D221E] focus:outline-none focus:ring-1 focus:ring-[#641A2B]"
                    />
                    <Phone className="w-3.5 h-3.5 text-[#C9A45C] absolute left-3 top-3" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#2D221E]">Akun Instagram Portofolio</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={instagram}
                      onChange={e => setInstagram(e.target.value)}
                      className="w-full bg-[#FAF6F0] border border-[#C9A45C]/30 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#2D221E] focus:outline-none focus:ring-1 focus:ring-[#641A2B]"
                    />
                    <AtSign className="w-3.5 h-3.5 text-[#C9A45C] absolute left-3 top-3" />
                  </div>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-[#2D221E]">Email Akun MUA</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full bg-[#FAF6F0]/60 border border-[#C9A45C]/20 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#2D221E]/60 cursor-not-allowed"
                    />
                    <Mail className="w-3.5 h-3.5 text-[#C9A45C]/60 absolute left-3 top-3" />
                  </div>
                  <p className="text-[10px] text-[#641A2B]/50">Email terdaftar digunakan untuk autentikasi sistem dan tidak dapat diubah sembarangan.</p>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-[#2D221E]">Alamat Studio / Workshop Fisik</label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full bg-[#FAF6F0] border border-[#C9A45C]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#2D221E] focus:outline-none focus:ring-1 focus:ring-[#641A2B]"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#2D221E]">Bio & Filosofi Seni Rias</label>
                    <span className="text-[10px] text-[#641A2B]/50">{bio.length}/500 karakter</span>
                  </div>
                  <textarea
                    rows={4}
                    value={bio}
                    maxLength={500}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Ceritakan latar belakang pengalaman, teknik riasan unggulan, dan komitmen profesional Anda kepada calon pengantin..."
                    className="w-full bg-[#FAF6F0] border border-[#C9A45C]/30 rounded-xl p-3.5 text-xs text-[#2D221E] focus:outline-none focus:ring-1 focus:ring-[#641A2B] leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Signature Styles & Ringkasan */}
          <div className="space-y-6">
            {/* Signature Makeup Styles Card */}
            <div className="bg-white rounded-2xl border border-[#C9A45C]/20 p-6 shadow-xs space-y-4">
              <div className="border-b border-[#C9A45C]/15 pb-3">
                <h3 className="font-poppins font-bold text-base text-[#641A2B]">Spesialisasi & Signature Look</h3>
                <p className="text-[11px] text-[#641A2B]/70 mt-0.5">
                  Pilih gaya riasan yang menjadi keahlian utama studio Anda:
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {AVAILABLE_STYLES.map((style, idx) => {
                  const isSelected = selectedStyles.includes(style);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleStyle(style)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#641A2B] text-[#FAF6F0] border-[#641A2B] shadow-xs'
                          : 'bg-[#FAF6F0] text-[#641A2B]/80 border-[#C9A45C]/30 hover:border-[#641A2B]'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-[#C9A45C]" />}
                      <span>{style}</span>
                    </button>
                  );
                })}
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF6F0] border border-[#C9A45C]/20 text-[11px] text-[#641A2B]/80 leading-relaxed">
                <p className="font-semibold text-[#641A2B] mb-1">Tips Reputasi Atelier:</p>
                Tag spesialisasi membantu calon pengantin menemukan profil Anda saat memfilter hasil pencarian berdasarkan konsep tema pernikahan.
              </div>
            </div>

            {/* Status Keanggotaan Partner */}
            <div className="bg-gradient-to-br from-[#641A2B] to-[#4D1320] text-[#FAF6F0] rounded-2xl p-6 shadow-xs space-y-3 relative overflow-hidden">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#C9A45C]">
                  Status Kemitraan
                </span>
                <h4 className="font-poppins font-bold text-lg text-white">GLAMÉA Certified Partner</h4>
                <p className="text-xs text-[#FAF6F0]/80 leading-relaxed">
                  Identitas resmi studio dan portofolio Anda telah lolos kurasi tim GLAMÉA Padang.
                </p>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-white/70">Bergabung Sejak:</span>
                <span className="font-semibold text-[#C9A45C]">12 Oktober 2026</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. TAB 2: KATALOG LAYANAN & TARIF                        */}
      {/* ======================================================== */}
      {activeTab === 'layanan' && (
        <div className="space-y-6">
          {/* Header Bar Layanan */}
          <div className="bg-white rounded-2xl border border-[#C9A45C]/20 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-poppins font-bold text-lg text-[#641A2B]">Daftar Paket Layanan & Harga</h3>
              <p className="text-xs text-[#641A2B]/70 mt-0.5">
                Kelola paket riasan yang dapat dipesan langsung oleh calon pengantin dan pelanggan umum.
              </p>
            </div>
            <Button
              onClick={handleOpenAddService}
              className="px-4 py-2.5 bg-[#641A2B] hover:bg-[#4D1320] text-[#FAF6F0] rounded-xl text-xs font-semibold font-poppins flex items-center gap-2 shadow-xs shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-[#C9A45C]" />
              <span>Tambah Paket Layanan</span>
            </Button>
          </div>

          {/* Grid Layanan */}
          {services.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#C9A45C]/20 p-12 text-center space-y-3">
              <p className="text-sm text-[#641A2B]/70">Belum ada paket layanan aktif di studio Anda.</p>
              <Button
                onClick={handleOpenAddService}
                className="bg-[#641A2B] text-[#FAF6F0] text-xs px-4 py-2 rounded-xl"
              >
                Tambah Layanan Pertama
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map(svc => (
                <div 
                  key={svc.id}
                  className="bg-white rounded-2xl border border-[#C9A45C]/25 p-5 shadow-xs hover:border-[#641A2B]/40 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C9A45C]/15 text-[#641A2B] uppercase tracking-wide">
                        {svc.category}
                      </span>
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEditService(svc)}
                          className="p-1.5 hover:bg-[#FAF6F0] text-[#641A2B] rounded-lg transition-colors"
                          title="Edit Layanan"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(svc.id)}
                          className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"
                          title="Hapus Layanan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-poppins font-bold text-base text-[#2D221E] group-hover:text-[#641A2B] transition-colors">
                        {svc.name}
                      </h4>
                      <p className="text-xs text-[#2D221E]/70 line-clamp-2 mt-1 leading-relaxed">
                        {svc.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#641A2B]/70 pt-1 border-t border-[#C9A45C]/10">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#C9A45C]" />
                        {svc.durationMinutes} Menit
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Termasuk Konsultasi
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#C9A45C]/15 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#641A2B]/60 uppercase font-medium block">
                        Tarif Per Sesi
                      </span>
                      <span className="font-serif font-bold text-base text-[#641A2B]">
                        {formatRupiah(svc.price)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenEditService(svc)}
                      className="px-3 py-1.5 rounded-xl border border-[#C9A45C]/30 text-xs font-semibold font-poppins text-[#641A2B] hover:bg-[#641A2B] hover:text-[#FAF6F0] transition-colors"
                    >
                      Ubah Rincian
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. TAB 3: AREA JANGKAUAN & KEBIJAKAN STUDIO             */}
      {/* ======================================================== */}
      {activeTab === 'operasional' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Jangkauan Wilayah Layanan Padang */}
          <div className="bg-white rounded-2xl border border-[#C9A45C]/20 p-6 md:p-8 shadow-xs space-y-5">
            <div className="border-b border-[#C9A45C]/15 pb-3">
              <h3 className="font-poppins font-bold text-lg text-[#641A2B]">Wilayah Layanan di Kota Padang</h3>
              <p className="text-xs text-[#641A2B]/70 mt-0.5">
                Tentukan kecamatan di mana tim studio Anda siap melayani riasan di lokasi klien (Home Service).
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {PADANG_DISTRICTS.map((dist, idx) => {
                const isChecked = selectedDistricts.includes(dist);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleDistrict(dist)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border flex items-center gap-1.5 ${
                      isChecked
                        ? 'bg-[#641A2B] text-[#FAF6F0] border-[#641A2B] shadow-xs'
                        : 'bg-[#FAF6F0] text-[#641A2B]/80 border-[#C9A45C]/30 hover:border-[#641A2B]'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 text-[#C9A45C]" />}
                    <span>{dist}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2D221E]">Ketentuan Biaya Transportasi Luar Radius</label>
                <input
                  type="text"
                  value={transportFeePerKm}
                  onChange={e => setTransportFeePerKm(e.target.value)}
                  className="w-full bg-[#FAF6F0] border border-[#C9A45C]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#2D221E] focus:outline-none focus:ring-1 focus:ring-[#641A2B]"
                />
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FAF6F0] border border-[#C9A45C]/20">
                <input
                  type="checkbox"
                  id="homeService"
                  checked={homeServiceAvailable}
                  onChange={e => setHomeServiceAvailable(e.target.checked)}
                  className="w-4 h-4 rounded text-[#641A2B] focus:ring-[#641A2B]"
                />
                <label htmlFor="homeService" className="text-xs text-[#2D221E] font-medium cursor-pointer">
                  Bersedia menerima pesanan Home Service (ke rumah pengantin / hotel / gedung resepsi)
                </label>
              </div>
            </div>
          </div>

          {/* Card 2: Kebijakan Booking & Pembatalan */}
          <div className="bg-white rounded-2xl border border-[#C9A45C]/20 p-6 md:p-8 shadow-xs space-y-5">
            <div className="border-b border-[#C9A45C]/15 pb-3">
              <h3 className="font-poppins font-bold text-lg text-[#641A2B]">Kebijakan Booking & Reschedule</h3>
              <p className="text-xs text-[#641A2B]/70 mt-0.5">
                Kebijakan ini mengikat calon pengantin saat melakukan konfirmasi pesanan di GLAMÉA.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2D221E]">Kebijakan Perubahan Jadwal (Reschedule)</label>
                <textarea
                  rows={3}
                  value={reschedulePolicy}
                  onChange={e => setReschedulePolicy(e.target.value)}
                  className="w-full bg-[#FAF6F0] border border-[#C9A45C]/30 rounded-xl p-3 text-xs text-[#2D221E] focus:outline-none focus:ring-1 focus:ring-[#641A2B] leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2D221E]">Kebijakan Pembatalan & Deposit Escrow</label>
                <textarea
                  rows={3}
                  value={cancellationPolicy}
                  onChange={e => setCancellationPolicy(e.target.value)}
                  className="w-full bg-[#FAF6F0] border border-[#C9A45C]/30 rounded-xl p-3 text-xs text-[#2D221E] focus:outline-none focus:ring-1 focus:ring-[#641A2B] leading-relaxed"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Perlindungan Dana:</strong> Seluruh deposit pesanan ditampung di GLAMÉA Escrow hingga hari acara selesai. MUA dijamin menerima pencairan sesuai ketentuan bila klien membatalkan secara sepihak.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. TAB 4: REKENING & KEAMANAN ESCROW                     */}
      {/* ======================================================== */}
      {activeTab === 'rekening' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri: Rekening Bank Pencairan */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-[#C9A45C]/20 p-6 md:p-8 shadow-xs space-y-5">
              <div className="border-b border-[#C9A45C]/15 pb-4">
                <h3 className="font-poppins font-bold text-lg text-[#641A2B]">Rekening Pencairan Escrow</h3>
                <p className="text-xs text-[#641A2B]/70 mt-0.5">
                  Dana dari pesanan yang telah selesai akan otomatis dicairkan ke rekening bank ini.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#2D221E]">Bank Penerima</label>
                  <select
                    value={bankName}
                    onChange={e => setBankName(e.target.value)}
                    className="w-full bg-[#FAF6F0] border border-[#C9A45C]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#2D221E] focus:outline-none focus:ring-1 focus:ring-[#641A2B]"
                  >
                    <option value="BCA">BCA - Bank Central Asia</option>
                    <option value="Mandiri">Bank Mandiri</option>
                    <option value="BNI">BNI - Bank Negara Indonesia</option>
                    <option value="BRI">BRI - Bank Rakyat Indonesia</option>
                    <option value="Nagari">Bank Nagari (Sumatera Barat)</option>
                    <option value="BSI">BSI - Bank Syariah Indonesia</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#2D221E]">Nomor Rekening</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={e => setAccountNumber(e.target.value)}
                    className="w-full bg-[#FAF6F0] border border-[#C9A45C]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#2D221E] focus:outline-none focus:ring-1 focus:ring-[#641A2B]"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-[#2D221E]">Nama Pemilik Rekening (Sesuai KTP)</label>
                  <input
                    type="text"
                    value={accountHolder}
                    onChange={e => setAccountHolder(e.target.value)}
                    className="w-full bg-[#FAF6F0] border border-[#C9A45C]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#2D221E] focus:outline-none focus:ring-1 focus:ring-[#641A2B]"
                  />
                  <p className="text-[10px] text-[#641A2B]/60">Nama pemilik rekening harus identik dengan nama KTP terdaftar untuk kelancaran verifikasi BI-FAST.</p>
                </div>
              </div>

              {/* Status Validasi Rekening */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-emerald-900">Rekening Terverifikasi Otomatis</span>
                </div>
                <span className="text-emerald-700 font-medium">BCA • {accountNumber}</span>
              </div>
            </div>

            {/* Preferensi Notifikasi */}
            <div className="bg-white rounded-2xl border border-[#C9A45C]/20 p-6 md:p-8 shadow-xs space-y-4">
              <div className="border-b border-[#C9A45C]/15 pb-3">
                <h3 className="font-poppins font-bold text-base text-[#641A2B]">Preferensi Notifikasi Pesanan</h3>
                <p className="text-xs text-[#641A2B]/70 mt-0.5">
                  Tentukan saluran untuk menerima pembaruan booking dan bukti pencairan escrow.
                </p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-xl bg-[#FAF6F0] border border-[#C9A45C]/20 cursor-pointer">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-[#2D221E] block">Notifikasi WhatsApp Seketika</span>
                    <span className="text-[11px] text-[#2D221E]/60 block">Terima alert saat ada permintaan pesanan baru atau pesan dari calon pengantin.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyWhatsApp}
                    onChange={e => setNotifyWhatsApp(e.target.checked)}
                    className="w-4 h-4 text-[#641A2B] rounded focus:ring-[#641A2B]"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-[#FAF6F0] border border-[#C9A45C]/20 cursor-pointer">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-[#2D221E] block">Email Rekapitulasi & Slip Pencairan</span>
                    <span className="text-[11px] text-[#2D221E]/60 block">Kirim kuitansi resmi dan laporan pendapatan bulanan ke alamat email terdaftar.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyEmail}
                    onChange={e => setNotifyEmail(e.target.checked)}
                    className="w-4 h-4 text-[#641A2B] rounded focus:ring-[#641A2B]"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Dokumen Kemitraan & Keamanan */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#C9A45C]/20 p-6 shadow-xs space-y-4">
              <div className="border-b border-[#C9A45C]/15 pb-3">
                <h3 className="font-poppins font-bold text-base text-[#641A2B]">Dokumen Legalitas MUA</h3>
                <p className="text-[11px] text-[#641A2B]/70 mt-0.5">
                  Arsip verifikasi identitas resmi mitra GLAMÉA.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-emerald-950 block">Kartu Tanda Penduduk (KTP)</span>
                    <span className="text-[10px] text-emerald-700">137105********0001 • Terverifikasi</span>
                  </div>
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>

                <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-emerald-950 block">Sertifikasi & Portofolio Kurasi</span>
                    <span className="text-[10px] text-emerald-700">Certified Makeup Artist Padang</span>
                  </div>
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF6F0] border border-[#C9A45C]/20 text-[11px] text-[#641A2B]/80 leading-relaxed">
                <p className="font-semibold text-[#641A2B] mb-1">Keamanan Data:</p>
                Dokumen identitas Anda disimpan terenkripsi dan hanya digunakan untuk keperluan kepatuhan pencairan dana perbankan.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL INTERAKTIF: TAMBAH / EDIT LAYANAN                  */}
      {/* ======================================================== */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#C9A45C]/30 shadow-2xl max-w-lg w-full p-6 md:p-8 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#C9A45C]/20 pb-4">
              <div>
                <h3 className="font-poppins font-bold text-xl text-[#641A2B]">
                  {editingServiceId ? 'Ubah Rincian Layanan' : 'Tambah Paket Layanan Baru'}
                </h3>
                <p className="text-xs text-[#641A2B]/70 mt-0.5">
                  Layanan ini akan langsung ditampilkan di katalog studio Anda.
                </p>
              </div>
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="p-1.5 hover:bg-[#FAF6F0] text-[#641A2B] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2D221E]">Nama Paket Layanan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Baralek Wedding Traditional Look"
                  value={serviceForm.name}
                  onChange={e => setServiceForm({ ...serviceForm, name: e.target.value })}
                  className="w-full bg-[#FAF6F0] border border-[#C9A45C]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#2D221E] focus:outline-none focus:ring-1 focus:ring-[#641A2B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#2D221E]">Kategori Layanan</label>
                  <select
                    value={serviceForm.category}
                    onChange={e => setServiceForm({ ...serviceForm, category: e.target.value as Service['category'] })}
                    className="w-full bg-[#FAF6F0] border border-[#C9A45C]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#2D221E] focus:outline-none focus:ring-1 focus:ring-[#641A2B]"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Baralek">Baralek</option>
                    <option value="Engagement">Engagement</option>
                    <option value="Graduation">Graduation</option>
                    <option value="Party">Party</option>
                    <option value="Photoshoot">Photoshoot</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#2D221E]">Durasi Riasan (Menit)</label>
                  <input
                    type="number"
                    min={30}
                    step={15}
                    value={serviceForm.durationMinutes}
                    onChange={e => setServiceForm({ ...serviceForm, durationMinutes: Number(e.target.value) })}
                    className="w-full bg-[#FAF6F0] border border-[#C9A45C]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#2D221E] focus:outline-none focus:ring-1 focus:ring-[#641A2B]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2D221E]">Tarif Layanan (IDR)</label>
                <div className="relative">
                  <input
                    type="number"
                    min={50000}
                    step={50000}
                    required
                    value={serviceForm.price}
                    onChange={e => setServiceForm({ ...serviceForm, price: Number(e.target.value) })}
                    className="w-full bg-[#FAF6F0] border border-[#C9A45C]/30 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#2D221E] focus:outline-none focus:ring-1 focus:ring-[#641A2B]"
                  />
                  <span className="text-xs font-semibold text-[#641A2B]/70 absolute left-3 top-2.5">Rp</span>
                </div>
                <p className="text-[10px] text-[#641A2B]/60">Terbaca: {formatRupiah(serviceForm.price)}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2D221E]">Deskripsi & Fasilitas Termasuk</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Deskripsikan produk yang digunakan, touch-up asisten, aksesori hijab/melati, dan detail teknis lainnya..."
                  value={serviceForm.description}
                  onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })}
                  className="w-full bg-[#FAF6F0] border border-[#C9A45C]/30 rounded-xl p-3 text-xs text-[#2D221E] focus:outline-none focus:ring-1 focus:ring-[#641A2B] leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#C9A45C]/15">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 text-xs border-[#C9A45C]/30 text-[#641A2B] hover:bg-[#FAF6F0] font-poppins"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="px-5 py-2 text-xs bg-[#641A2B] hover:bg-[#4D1320] text-[#FAF6F0] rounded-xl font-semibold font-poppins"
                >
                  {editingServiceId ? 'Simpan Perubahan' : 'Tambahkan Layanan'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
