import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#EDE3D9] pt-16 pb-12 text-[#292321]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-[#641A2B] mb-4 block">
              GLAMÉA
            </Link>
            <p className="text-sm text-[#746A67] leading-relaxed mb-4">
              Platform marketplace terpercaya yang menghubungkan Anda dengan Makeup Artist profesional terverifikasi di Kota Padang untuk momen berharga Anda.
            </p>
            <div className="text-xs text-[#746A67] flex items-center gap-1.5">
              <span>Dibuat dengan</span>
              <Heart className="w-3.5 h-3.5 text-[#641A2B] fill-[#641A2B]" />
              <span>untuk masyarakat Padang</span>
            </div>
          </div>
          
          <div>
            <h4 className="font-poppins text-base font-semibold text-[#292321] mb-4">Layanan Populer</h4>
            <ul className="space-y-3 text-sm text-[#746A67]">
              <li><Link href="/cari-mua?category=Wedding" className="hover:text-[#641A2B] transition-colors">Wedding Makeup Padang</Link></li>
              <li><Link href="/cari-mua?category=Baralek" className="hover:text-[#641A2B] transition-colors">Baralek Tradisional Minang</Link></li>
              <li><Link href="/cari-mua?category=Graduation" className="hover:text-[#641A2B] transition-colors">Wisuda (Unand / UNP / UIN)</Link></li>
              <li><Link href="/cari-mua?category=Party" className="hover:text-[#641A2B] transition-colors">Party & Event Glam</Link></li>
              <li><Link href="/cari-mua?category=Photoshoot" className="hover:text-[#641A2B] transition-colors">Prewedding & Studio</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-poppins text-base font-semibold text-[#292321] mb-4">GLAMÉA</h4>
            <ul className="space-y-3 text-sm text-[#746A67]">
              <li><Link href="/tentang" className="hover:text-[#641A2B] transition-colors">Tentang Kami</Link></li>
              <li><Link href="/#cara-kerja" className="hover:text-[#641A2B] transition-colors">Cara Kerja Sistem Escrow</Link></li>
              <li><Link href="/mua/daftar" className="hover:text-[#641A2B] transition-colors">Gabung Sebagai Mitra MUA</Link></li>
              <li><Link href="/kontak" className="hover:text-[#641A2B] transition-colors">Hubungi Bantuan</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-poppins text-base font-semibold text-[#292321] mb-4">Ketentuan & Keamanan</h4>
            <ul className="space-y-3 text-sm text-[#746A67]">
              <li><Link href="/faq" className="hover:text-[#641A2B] transition-colors">Pusat Bantuan & FAQ</Link></li>
              <li><Link href="/syarat-ketentuan" className="hover:text-[#641A2B] transition-colors">Syarat & Ketentuan Layanan</Link></li>
              <li><Link href="/kebijakan-privasi" className="hover:text-[#641A2B] transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="/kebijakan-pengembalian" className="hover:text-[#641A2B] transition-colors">Garansi Pengembalian Dana</Link></li>
            </ul>
          </div>
          
        </div>
        
        <div className="mt-16 pt-8 border-t border-[#EDE3D9] flex flex-col md:flex-row justify-between items-center text-xs text-[#746A67]">
          <p>&copy; {new Date().getFullYear()} GLAMÉA. Platform Marketplace MUA Kota Padang. Seluruh hak cipta dilindungi.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <span className="hover:text-[#641A2B] transition-colors cursor-pointer">Instagram @glamea.padang</span>
            <span className="hover:text-[#641A2B] transition-colors cursor-pointer">TikTok @glamea.official</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

