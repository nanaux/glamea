"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export default function MuaLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('mua@glamea.test');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validasi field
    if (!email.trim()) {
      setErrorMessage('Silakan masukkan alamat email MUA Anda.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Silakan masukkan kata sandi Anda.');
      return;
    }

    setIsLoading(true);

    // Simulasi autentikasi mock/demo
    setTimeout(() => {
      // Simpan role dan email demo untuk pengalaman dashboard MUA yang konsisten
      localStorage.setItem('user_role', 'MUA');
      localStorage.setItem('user_email', 'alya@glamea.test');
      if (rememberMe) {
        localStorage.setItem('remember_mua', 'true');
      } else {
        localStorage.removeItem('remember_mua');
      }

      router.push('/mua/dashboard');
    }, 850);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FAF6F0] text-[#292321] selection:bg-[#641A2B] selection:text-white">

      {/* Kolom Kiri: Brand Panel (Desktop & Tablet) */}
      <section
        aria-label="Panel Brand GLAMÉA Professional"
        className="relative w-full lg:w-1/2 text-white flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden min-h-[360px] lg:min-h-screen bg-[#2D060F]"
      >
        {/* Background Editorial Visual dengan Scrim Burgundy Mewah */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/images/hero-editorial.png"
            alt="GLAMÉA Editorial Beauty"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center filter brightness-[0.38] contrast-[1.08] scale-105"
          />
          {/* Deep Burgundy & Charcoal Gradient Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#20040A] via-[#480E1C]/85 to-[#641A2B]/75" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Top Bar: Navigasi Kembali & Badge Mitra */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#FAF6F0]/80 hover:text-white transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1 text-[#C9A45C]" />
            <span>Kembali ke Beranda</span>
          </Link>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#E8D4B0] font-medium border border-[#C9A45C]/40 bg-[#360812]/70 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
            Mitra Resmi
          </span>
        </div>

        {/* Konten Utama Panel Kiri: Bersih, Bernapas, Typografi Editorial */}
        <div className="relative z-10 my-auto py-10 lg:py-0 max-w-lg">
          {/* Header Brand Terpadu */}
          <Link href="/" className="inline-block mb-8 group">
            <span className="font-serif text-2xl sm:text-3xl tracking-[0.18em] text-white font-bold block transition-opacity group-hover:opacity-90">
              GLAMÉA
            </span>
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C9A45C] block mt-1 font-medium">
              Professional Portal
            </span>
          </Link>

          {/* Headline Bersih */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#FAF6F0] mb-5 leading-tight tracking-tight">
            Your Art. Your Spotlight.
          </h1>

          {/* Copy Utama */}
          <p className="text-sm sm:text-base text-[#FAF6F0]/85 leading-relaxed font-light max-w-md">
            Wujudkan pengalaman kecantikan yang berkesan bersama GLAMÉA. Kelola pemesanan, tampilkan portofolio terbaik Anda.
          </p>

          {/* Aksen Minimalis Terkurasi */}
          <div className="mt-8 flex items-center gap-3 pt-6 border-t border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A45C] flex-shrink-0" />
            <p className="text-xs text-[#FAF6F0]/70 font-light tracking-wide">
              Platform Marketplace Makeup Artist Terkurasi Kota Padang
            </p>
          </div>
        </div>

        {/* Footer Panel Kiri */}
        <div className="relative z-10 text-[11px] text-[#FAF6F0]/40 tracking-wider">
          © {new Date().getFullYear()} GLAMÉA. Seluruh hak cipta dilindungi.
        </div>
      </section>

      {/* Kolom Kanan: Form Login */}
      <section
        aria-label="Formulir Masuk Portal MUA"
        className="w-full lg:w-1/2 flex items-center justify-center p-5 sm:p-10 lg:p-16"
      >
        <div className="w-full max-w-[440px] bg-white rounded-xl border border-[#EDE3D9] p-7 sm:p-10 shadow-lg shadow-[#641A2B]/[0.03]">

          {/* Header Form */}
          <div className="mb-8">
            <div className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A45C] mb-2">
              Kemitraan MUA
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#641A2B] tracking-tight">
              Masuk ke Portal MUA
            </h2>
            <p className="mt-2 text-sm text-[#746A67] leading-relaxed">
              Akses untuk mengelola bisnis Anda.
            </p>
          </div>

          {/* Pesan Kesalahan */}
          {errorMessage && (
            <div
              role="alert"
              className="mb-6 p-3.5 rounded-lg bg-red-50 border border-red-200/80 text-red-800 text-xs flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Formulir */}
          <form onSubmit={handleLogin} noValidate className="space-y-5">

            {/* Field: Email MUA */}
            <div>
              <label
                htmlFor="mua-email"
                className="block text-xs font-semibold uppercase tracking-wider text-[#3C3230] mb-2"
              >
                Email MUA
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#746A67]">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="mua-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="nama@domain.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  className="w-full h-11 pl-10 pr-3.5 rounded-lg border border-[#EDE3D9] bg-white text-sm text-[#292321] placeholder:text-[#9A918E] transition-all duration-200 focus:outline-none focus:border-[#641A2B] focus:ring-1 focus:ring-[#641A2B]"
                />
              </div>
            </div>

            {/* Field: Kata Sandi */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="mua-password"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#3C3230]"
                >
                  Kata Sandi
                </label>
                <Link
                  href="/kontak"
                  className="text-xs text-[#641A2B] hover:text-[#C9A45C] transition-colors duration-150 font-medium"
                >
                  Lupa kata sandi?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#746A67]">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="mua-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="Masukkan kata sandi"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  className="w-full h-11 pl-10 pr-11 rounded-lg border border-[#EDE3D9] bg-white text-sm text-[#292321] placeholder:text-[#9A918E] transition-all duration-200 focus:outline-none focus:border-[#641A2B] focus:ring-1 focus:ring-[#641A2B]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#746A67] hover:text-[#641A2B] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Opsi: Ingat Saya */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#EDE3D9] text-[#641A2B] focus:ring-[#641A2B] focus:ring-offset-0 cursor-pointer accent-[#641A2B]"
                />
                <span className="text-xs text-[#5C524F]">Ingat saya di perangkat ini</span>
              </label>
            </div>

            {/* Tombol Masuk */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-lg bg-[#641A2B] text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#521321] active:scale-[0.99] transition-all duration-200 shadow-sm shadow-[#641A2B]/20 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Akses...</span>
                </>
              ) : (
                <span>Masuk</span>
              )}
            </button>

            {/* Demo Hint Banner (Khusus simulasi/demo teruji) */}
            <div className="mt-4 p-2.5 rounded-md bg-[#FAF6F0] border border-[#EDE3D9] text-center">
              <p className="text-[11px] text-[#746A67]">
                <strong className="text-[#641A2B] font-medium">Akun Demo MUA:</strong>{' '}
                <span className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-[#EDE3D9] text-[#292321]">
                  mua@glamea.test
                </span>{' '}
                / sandi otomatis terisi
              </p>
            </div>

          </form>

        </div>
      </section>

    </div>
  );
}
