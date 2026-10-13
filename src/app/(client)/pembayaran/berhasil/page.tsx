"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ChevronRight, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatRupiah } from '@/lib/utils';
import { mockMuas } from '@/data/mock-muas';
import { mockServices } from '@/data/mock-services';

export default function PembayaranBerhasilPage() {
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem('glamea_recent_booking');
    if (data) {
      setBooking(JSON.parse(data));
    } else {
      router.push('/');
    }
  }, [router]);

  if (!booking) return <div className="font-poppins p-20 text-center text-sm text-[#3A101C]/60">Memuat...</div>;

  const mua = mockMuas.find(m => m.id === booking.muaId);
  const service = mockServices.find(s => s.id === booking.serviceId);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 md:py-20 text-center">
      
      <div className="w-20 h-20 bg-glamea-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-12 h-12 text-glamea-success" />
      </div>
      
      <h1 className="text-3xl font-serif font-bold text-glamea-primary mb-2">Pembayaran Berhasil!</h1>
      <p className="font-sans text-xs sm:text-sm text-glamea-text-muted mb-8">Dana pembayaran Anda telah dikelola oleh sistem GLAMÉA dengan aman.</p>
      
      <div className="bg-white rounded-3xl border border-glamea-secondary shadow-sm overflow-hidden text-left mb-8">
        
        <div className="p-6 border-b border-glamea-secondary bg-glamea-background/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="font-poppins text-xs text-glamea-text-muted mb-1">Booking ID</p>
            <p className="font-mono text-sm font-semibold text-glamea-text flex items-center">
              {booking.id} <Copy className="w-3.5 h-3.5 ml-2 text-glamea-text-muted cursor-pointer hover:text-glamea-primary transition-colors" />
            </p>
          </div>
          <div className="flex gap-2">
            <StatusBadge status="Pembayaran Berhasil" />
            <StatusBadge status="Dana Ditahan" />
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-y-4 text-xs font-sans">
            <div>
              <p className="text-glamea-text-muted mb-1">MUA</p>
              <p className="font-poppins font-medium text-sm text-glamea-text">{mua?.name}</p>
            </div>
            <div>
              <p className="text-glamea-text-muted mb-1">Layanan</p>
              <p className="font-poppins font-medium text-sm text-glamea-text">{service?.name}</p>
            </div>
            <div>
              <p className="text-glamea-text-muted mb-1">Tanggal</p>
              <p className="font-poppins font-medium text-sm text-glamea-text">{booking.date}</p>
            </div>
            <div>
              <p className="text-glamea-text-muted mb-1">Waktu</p>
              <p className="font-poppins font-medium text-sm text-glamea-text">{booking.time} WIB</p>
            </div>
            <div className="col-span-2">
              <p className="text-glamea-text-muted mb-1">Lokasi</p>
              <p className="font-poppins font-medium text-sm text-glamea-text">{booking.location}</p>
            </div>
            <div className="col-span-2">
              <p className="text-glamea-text-muted mb-1">Metode Pembayaran</p>
              <p className="font-poppins font-medium text-sm text-glamea-text">{booking.paymentMethod} (ID: {booking.paymentId})</p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-glamea-secondary flex justify-between items-center">
            <span className="font-poppins font-bold text-xs uppercase tracking-wider text-glamea-text-muted">Total Dibayar</span>
            <span className="font-serif font-bold text-2xl text-glamea-primary">{formatRupiah(booking.total)}</span>
          </div>
        </div>
        
      </div>
      
      <p className="font-sans text-xs text-glamea-text-muted mb-8 leading-relaxed max-w-lg mx-auto">
        Dana Anda ditahan dan akan dicairkan kepada MUA <strong className="font-poppins font-semibold">setelah layanan selesai</strong> sesuai ketentuan platform GLAMÉA demi menjamin kepuasan Anda.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link href="/">
          <Button variant="outline" className="font-poppins font-semibold text-xs w-full sm:w-auto px-8 rounded-xl">Ke Beranda</Button>
        </Link>
        <Link href="/booking-saya">
          <Button className="font-poppins font-semibold text-xs w-full sm:w-auto px-8 rounded-xl">Lihat Detail Booking</Button>
        </Link>
      </div>
      
    </div>
  );
}
