"use client";
import React, { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, Info, Calendar as CalendarIcon, MapPin, Users, Clock, Receipt } from 'lucide-react';
import { mockBookings } from '@/data/mock-bookings';
import { mockMuas } from '@/data/mock-muas';
import { mockServices } from '@/data/mock-services';
import { mockPayments } from '@/data/mock-bookings';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatRupiah } from '@/lib/utils';

export default function DetailBookingSayaPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const booking = mockBookings.find(b => b.id === resolvedParams.id);
  
  if (!booking) return notFound();

  const mua = mockMuas.find(m => m.id === booking.muaId);
  const service = mockServices.find(s => s.id === booking.serviceId);
  const payment = mockPayments.find(p => p.bookingId === booking.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-screen">
      <Link href="/booking-saya">
        <button className="font-poppins inline-flex items-center text-xs font-semibold text-glamea-text-muted hover:text-glamea-primary mb-6 transition-colors">
          <ChevronLeft size={16} className="mr-1" />
          Kembali ke Riwayat
        </button>
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-glamea-primary mb-2">Detail Booking</h1>
          <p className="font-mono text-xs text-glamea-text-muted">ID: {booking.id}</p>
        </div>
        <div className="flex gap-2">
          <StatusBadge status={booking.paymentStatus === 'Pending' ? 'Menunggu Pembayaran' : 'Pembayaran Berhasil'} />
          <StatusBadge status={
            booking.bookingStatus === 'Pending' ? 'Menunggu Konfirmasi' : 
            booking.bookingStatus === 'Confirmed' ? 'Dikonfirmasi' : 
            booking.bookingStatus === 'Completed' ? 'Selesai' : 'Dibatalkan'
          } />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Col - Timeline & Information */}
        <div className="md:col-span-2 space-y-6">
          
          <Card className="rounded-2xl border-glamea-secondary shadow-2xs">
            <CardContent className="p-6">
              <h3 className="font-serif font-bold text-lg mb-4 flex items-center text-glamea-primary">
                <Info className="w-5 h-5 mr-2 text-[#C9A45C]" /> Informasi Layanan
              </h3>
              
              <div className="flex items-start gap-4 p-4 border rounded-2xl border-glamea-secondary bg-glamea-background/50 mb-6">
                 <div className="w-14 h-14 bg-glamea-secondary rounded-2xl flex-shrink-0 flex items-center justify-center text-glamea-primary font-bold font-serif text-xl border border-white shadow-xs">
                    {mua?.name.charAt(0)}
                 </div>
                 <div>
                   <h4 className="font-serif font-bold text-lg text-glamea-primary">{mua?.name}</h4>
                   <p className="font-sans text-glamea-text-muted text-sm">{service?.name}</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-xs font-sans">
                 <div>
                   <p className="font-poppins text-glamea-text-muted mb-1 text-[11px] uppercase tracking-wider font-semibold">Acara</p>
                   <p className="font-medium text-sm text-glamea-text">{booking.occasion}</p>
                 </div>
                 <div>
                   <p className="font-poppins text-glamea-text-muted mb-1 text-[11px] uppercase tracking-wider font-semibold">Jumlah Orang</p>
                   <p className="font-medium text-sm text-glamea-text flex items-center"><Users className="w-4 h-4 mr-1 text-[#C9A45C]" /> {booking.numberOfPeople} Orang</p>
                 </div>
                 <div>
                   <p className="font-poppins text-glamea-text-muted mb-1 text-[11px] uppercase tracking-wider font-semibold">Tanggal</p>
                   <p className="font-medium text-sm text-glamea-text flex items-center"><CalendarIcon className="w-4 h-4 mr-1 text-[#C9A45C]" /> {booking.date}</p>
                 </div>
                 <div>
                   <p className="font-poppins text-glamea-text-muted mb-1 text-[11px] uppercase tracking-wider font-semibold">Mulai Rias</p>
                   <p className="font-medium text-sm text-glamea-text flex items-center"><Clock className="w-4 h-4 mr-1 text-[#C9A45C]" /> {booking.time} WIB</p>
                 </div>
                 <div className="col-span-1 sm:col-span-2">
                   <p className="font-poppins text-glamea-text-muted mb-1 text-[11px] uppercase tracking-wider font-semibold">Lokasi Lengkap</p>
                   <p className="font-medium text-sm text-glamea-text flex items-start"><MapPin className="w-4 h-4 mr-1 mt-0.5 text-[#C9A45C] shrink-0" /> {booking.location}</p>
                 </div>
                 {(booking.notes && booking.notes.length > 0) && (
                   <div className="col-span-1 sm:col-span-2">
                     <p className="font-poppins text-glamea-text-muted mb-1 text-[11px] uppercase tracking-wider font-semibold">Catatan</p>
                     <p className="font-sans text-xs bg-glamea-secondary/20 p-3 rounded-xl border border-glamea-secondary/50 text-[#3A101C]">{booking.notes}</p>
                   </div>
                 )}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Col - Payment & Status tracking */}
        <div className="md:col-span-1 space-y-6">
          
          <Card className="rounded-2xl border-glamea-secondary shadow-2xs">
            <CardContent className="p-6">
              <h3 className="font-serif font-bold text-lg mb-4 flex items-center text-glamea-primary">
                <Receipt className="w-5 h-5 mr-2 text-[#C9A45C]" /> Riwayat Pembayaran
              </h3>
              
              {!payment ? (
                 <div className="text-center py-4">
                   <p className="font-sans text-xs text-glamea-text-muted mb-4">Pembayaran belum dilakukan.</p>
                   <Button className="font-poppins font-semibold text-xs rounded-xl w-full">Bayar Sekarang</Button>
                 </div>
              ) : (
                <div className="space-y-4 text-xs font-sans">
                  <div className="flex justify-between items-center">
                    <span className="text-glamea-text-muted">Payment ID</span>
                    <span className="font-mono text-glamea-text">{payment.id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-glamea-text-muted">Metode</span>
                    <span className="font-poppins font-medium text-glamea-text">{payment.method}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-glamea-text-muted">Status</span>
                    <span className="font-poppins font-semibold text-glamea-success">{payment.status === 'Success' ? 'Berhasil' : payment.status}</span>
                  </div>
                  <div className="pt-4 border-t border-glamea-secondary">
                     <p className="font-sans text-center text-[11px] text-[#3A101C] bg-[#FAF4EB] border border-[#C9A45C]/30 p-2.5 rounded-xl">Dana saat ini ditahan aman oleh GLAMÉA</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-glamea-secondary shadow-2xs">
             <CardContent className="p-6">
                <h3 className="font-serif font-bold text-base mb-4 border-b border-glamea-secondary pb-2 text-glamea-primary">Rincian Harga</h3>
                <div className="space-y-2 text-xs font-sans mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-glamea-text-muted">Harga Layanan</span>
                    <span className="font-poppins font-medium text-glamea-text">{formatRupiah(booking.subtotal)}</span>
                  </div>
                  {booking.discount > 0 && (
                    <div className="flex justify-between items-center text-glamea-success">
                      <span>Diskon (10%)</span>
                      <span className="font-poppins font-bold">-{formatRupiah(booking.discount)}</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-glamea-secondary">
                  <span className="font-poppins font-bold text-xs uppercase tracking-wider text-glamea-text-muted">Total</span>
                  <span className="font-serif font-bold text-xl text-glamea-primary">{formatRupiah(booking.total)}</span>
                </div>
             </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}
