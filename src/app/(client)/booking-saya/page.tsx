"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Search } from 'lucide-react';
import { mockBookings } from '@/data/mock-bookings';
import { mockMuas } from '@/data/mock-muas';
import { mockServices } from '@/data/mock-services';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { formatRupiah } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

export default function BookingSayaPage() {
  const [activeTab, setActiveTab] = useState('semua');
  
  // get client's bookings (mock: using client-1)
  const clientBookings = mockBookings.filter(b => b.clientId === 'client-1');

  // filtering dummy logic
  const filteredBookings = clientBookings.filter(b => {
    if (activeTab === 'semua') return true;
    if (activeTab === 'menunggu pembayaran') return b.paymentStatus === 'Pending';
    if (activeTab === 'menunggu konfirmasi') return b.bookingStatus === 'Pending' && b.paymentStatus === 'Success';
    if (activeTab === 'dikonfirmasi') return b.bookingStatus === 'Confirmed';
    if (activeTab === 'selesai') return b.bookingStatus === 'Completed';
    if (activeTab === 'dibatalkan') return b.bookingStatus === 'Cancelled';
    return true;
  });

  const tabs = [
    { id: 'semua', label: 'Semua' },
    { id: 'menunggu pembayaran', label: 'Menunggu Pembayaran' },
    { id: 'menunggu konfirmasi', label: 'Menunggu Konfirmasi' },
    { id: 'dikonfirmasi', label: 'Dikonfirmasi' },
    { id: 'selesai', label: 'Selesai' },
    { id: 'dibatalkan', label: 'Dibatalkan' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-screen">
      <h1 className="text-3xl font-serif font-bold text-glamea-primary mb-8">Riwayat Booking</h1>
      
      {/* Scrollable Tabs */}
      <div className="flex overflow-x-auto pb-4 mb-6 border-b border-glamea-secondary gap-6 custom-scrollbar">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`font-poppins whitespace-nowrap pb-2 font-medium text-xs sm:text-sm transition-colors border-b-2 px-1 ${activeTab === tab.id ? 'border-glamea-primary text-glamea-primary font-semibold' : 'border-transparent text-glamea-text-muted hover:text-glamea-primary'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-20 bg-white border border-glamea-secondary rounded-2xl shadow-xs">
             <Calendar className="w-12 h-12 text-glamea-secondary mx-auto mb-4" />
             <h3 className="font-serif text-xl font-bold text-glamea-primary mb-2">Tidak ada booking</h3>
             <p className="font-sans text-xs sm:text-sm text-glamea-text-muted mb-6">Belum ada riwayat booking dalam kategori ini.</p>
             <Link href="/cari-mua">
               <Button className="font-poppins font-semibold text-xs rounded-xl">Cari MUA Sekarang</Button>
             </Link>
          </div>
        ) : (
          filteredBookings.map(booking => {
            const mua = mockMuas.find(m => m.id === booking.muaId);
            const service = mockServices.find(s => s.id === booking.serviceId);
            
            return (
              <Card key={booking.id} className="overflow-hidden rounded-2xl border-glamea-secondary shadow-2xs hover:shadow-sm transition-shadow">
                <div className="border-b border-glamea-secondary p-4 bg-glamea-background/50 flex flex-wrap gap-4 justify-between items-center text-xs">
                  <div className="flex gap-4 items-center">
                    <span className="font-mono text-glamea-text-muted">ID: {booking.id}</span>
                    <span className="font-sans text-glamea-text-muted">{booking.date} | {booking.time} WIB</span>
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
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex items-start gap-4 flex-1">
                       <div className="w-16 h-16 bg-glamea-secondary rounded-2xl flex-shrink-0 border border-white shadow-sm flex items-center justify-center text-glamea-primary font-bold font-serif text-2xl">
                          {mua?.name.charAt(0)}
                       </div>
                       <div>
                         <h3 className="font-serif font-bold text-lg text-glamea-primary">{mua?.name}</h3>
                         <p className="font-sans text-glamea-text-muted text-sm my-1">{service?.name}</p>
                         <p className="font-sans text-glamea-text-muted text-xs flex items-center mt-2">
                           <MapPin className="w-3.5 h-3.5 mr-1 text-[#C9A45C]" /> {booking.location}
                         </p>
                       </div>
                    </div>
                    <div className="md:text-right shrink-0 flex flex-col justify-between">
                       <div>
                         <p className="font-poppins text-xs text-glamea-text-muted mb-1 uppercase tracking-wider font-semibold">Total Belanja</p>
                         <p className="font-serif font-bold text-xl text-glamea-primary">{formatRupiah(booking.total)}</p>
                       </div>
                       <Link href={`/booking-saya/${booking.id}`} className="mt-4 md:mt-2 block">
                         <Button variant="outline" className="font-poppins font-semibold text-xs rounded-xl w-full md:w-auto">Lihat Detail</Button>
                       </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

    </div>
  );
}
