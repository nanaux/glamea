"use client";
import React, { use, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ChevronLeft, 
  Info, 
  Calendar as CalendarIcon, 
  MapPin, 
  Users, 
  Clock, 
  MessageCircle, 
  Check, 
  X, 
  ShieldCheck, 
  Phone, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { mockBookings } from '@/data/mock-bookings';
import { mockClients } from '@/data/mock-users';
import { mockServices } from '@/data/mock-services';
import { formatRupiah } from '@/lib/utils';
import { Modal } from '@/components/ui/modal';

export default function MuaDetailBookingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  const initialBooking = mockBookings.find(b => b.id === resolvedParams.id);
  const [booking, setBooking] = useState(initialBooking);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!booking) return notFound();

  const service = mockServices.find(s => s.id === booking.serviceId);
  const client = mockClients.find(c => c.id === booking.clientId) || {
    id: booking.clientId,
    name: 'Pelanggan GLAMÉA',
    phone: '0812-3456-7890',
    email: 'pelanggan@glamea.com',
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleApprove = () => {
    setBooking({ ...booking, bookingStatus: 'Confirmed' });
    setIsConfirmModalOpen(false);
    showToast(`Pesanan untuk ${client.name} berhasil disetujui!`);
  };

  const handleReject = () => {
    setBooking({ ...booking, bookingStatus: 'Cancelled' });
    setIsRejectModalOpen(false);
    showToast(`Pesanan dari ${client.name} telah ditolak.`);
  };

  const formatDateIndonesia = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (name[0] || 'U').toUpperCase();
  };

  return (
    <div className="max-w-4xl space-y-6 pb-12">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#641A2B] text-white px-5 py-3 rounded-xl shadow-lg border border-[#C9A45C]/40 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#C9A45C] shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Back button */}
      <div>
        <Link 
          href="/mua/booking"
          className="inline-flex items-center text-xs font-medium text-[#7A6E6A] hover:text-[#641A2B] transition-colors gap-1.5 py-1 px-2.5 rounded-lg hover:bg-white border border-transparent hover:border-[#EDE3D9]"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Permintaan</span>
        </Link>
      </div>

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EDE3D9]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#641A2B]">
              Detail Reservasi
            </h1>
            <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-stone-100 text-[#7A6E6A] border border-stone-200">
              #{booking.id.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-[#7A6E6A] mt-1">
            Dibuat pada {new Date(booking.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2">
          {booking.bookingStatus === 'Pending' && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200/80 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Menunggu Respon MUA
            </span>
          )}
          {booking.bookingStatus === 'Confirmed' && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#641A2B]/10 text-[#641A2B] border border-[#641A2B]/20 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              Jadwal Dikonfirmasi
            </span>
          )}
          {booking.bookingStatus === 'Completed' && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Layanan Selesai
            </span>
          )}
          {booking.bookingStatus === 'Cancelled' && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-600 border border-stone-200">
              Pesanan Dibatalkan
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Details & Client */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Client Card */}
          <div className="bg-white rounded-2xl border border-[#EDE3D9] p-5 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-[#292321] flex items-center gap-2">
              <span>Profil Pelanggan</span>
            </h3>

            <div className="flex items-center gap-4 pt-1">
              <div className="w-14 h-14 rounded-2xl bg-[#FAF4EB] text-[#641A2B] border border-[#EDE3D9] flex items-center justify-center font-serif font-bold text-lg shrink-0">
                {getInitials(client.name)}
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-base text-[#292321]">{client.name}</h4>
                <div className="flex items-center gap-3 text-xs text-[#7A6E6A] flex-wrap">
                  <a 
                    href={`tel:${client.phone}`}
                    className="inline-flex items-center gap-1 text-[#641A2B] hover:underline font-mono"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#C9A45C]" />
                    {client.phone}
                  </a>
                  <span>•</span>
                  <span className="font-mono">{client.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Service & Event Details */}
          <div className="bg-white rounded-2xl border border-[#EDE3D9] p-5 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-[#292321] flex items-center gap-2 border-b border-[#EDE3D9] pb-3">
              <Info className="w-4 h-4 text-[#C9A45C]" />
              <span>Rincian Layanan & Sesi Rias</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="col-span-1 sm:col-span-2 bg-[#FAF4EB]/60 p-4 rounded-xl border border-[#EDE3D9]">
                <span className="text-[10px] uppercase font-semibold text-[#A67C37] tracking-wider block">
                  Layanan Dipilih
                </span>
                <p className="font-serif font-bold text-lg text-[#292321] mt-0.5">
                  {service?.name || booking.occasion}
                </p>
                <p className="text-[#7A6E6A] mt-1 leading-relaxed">
                  {service?.description || 'Layanan tata rias profesional oleh mitra terverifikasi GLAMÉA.'}
                </p>
              </div>

              <div className="bg-[#FAF6F0] p-3.5 rounded-xl border border-[#EDE3D9]/60">
                <span className="text-[#7A6E6A] text-[11px] block">Acara & Peserta</span>
                <p className="font-semibold text-[#292321] text-sm mt-0.5 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#7A6E6A]" />
                  <span>{booking.occasion} ({booking.numberOfPeople} Orang)</span>
                </p>
              </div>

              <div className="bg-[#FAF6F0] p-3.5 rounded-xl border border-[#EDE3D9]/60">
                <span className="text-[#7A6E6A] text-[11px] block">Tanggal & Waktu Standby</span>
                <p className="font-semibold text-[#641A2B] text-sm mt-0.5 flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 text-[#C9A45C]" />
                  <span>{formatDateIndonesia(booking.date)}</span>
                </p>
                <p className="text-xs text-[#7A6E6A] mt-0.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#7A6E6A]" />
                  <span>Pukul {booking.time} WIB</span>
                </p>
              </div>

              <div className="col-span-1 sm:col-span-2 bg-[#FAF6F0] p-3.5 rounded-xl border border-[#EDE3D9]/60">
                <span className="text-[#7A6E6A] text-[11px] block">Lokasi Pelaksanaan</span>
                <p className="font-medium text-[#292321] text-xs mt-1 flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-[#641A2B] shrink-0 mt-0.5" />
                  <span>{booking.location}</span>
                </p>
              </div>

              {booking.notes && (
                <div className="col-span-1 sm:col-span-2 bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/60">
                  <span className="text-amber-900 text-[11px] font-semibold block">Catatan Khusus Klien</span>
                  <p className="text-xs text-[#292321] italic mt-1 leading-relaxed">
                    &quot;{booking.notes}&quot;
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Escrow & Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#EDE3D9] p-5 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-[#292321] border-b border-[#EDE3D9] pb-3">
              Informasi Pembayaran
            </h3>

            {/* Escrow badge */}
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-900">Dana Terproteksi Escrow</p>
                <p className="text-emerald-700 mt-0.5 leading-relaxed text-[11px]">
                  Klien telah membayar lunas ke rekening bersama GLAMÉA. Dana otomatis cair setelah sesi rias diselesaikan.
                </p>
              </div>
            </div>

            {/* Price list */}
            <div className="space-y-2 text-xs py-2">
              <div className="flex justify-between text-[#7A6E6A]">
                <span>Biaya Layanan</span>
                <span>{formatRupiah(booking.subtotal)}</span>
              </div>
              {booking.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Diskon Promo</span>
                  <span>-{formatRupiah(booking.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-serif font-bold text-[#292321] pt-3 border-t border-[#EDE3D9]">
                <span>Total Biaya</span>
                <span className="text-[#641A2B]">{formatRupiah(booking.total)}</span>
              </div>
            </div>

            {/* Action buttons */}
            {booking.bookingStatus === 'Pending' && (
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => setIsConfirmModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#641A2B] hover:bg-[#4A1220] text-white transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-[#C9A45C]" />
                  <span>Setujui & Kunci Jadwal</span>
                </button>
                <button
                  onClick={() => setIsRejectModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-rose-700 hover:bg-rose-50 border border-rose-200 transition-all flex items-center justify-center gap-1"
                >
                  <X className="w-4 h-4" />
                  <span>Tolak Permintaan</span>
                </button>
              </div>
            )}

            <div className="pt-2">
              <Link
                href="/mua/chat"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-medium bg-[#FAF4EB] hover:bg-[#641A2B] text-[#641A2B] hover:text-white border border-[#EDE3D9] transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-[#C9A45C]" />
                <span>Kirim Pesan ke Klien</span>
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Confirm Approve Modal */}
      <Modal 
        isOpen={isConfirmModalOpen} 
        onClose={() => setIsConfirmModalOpen(false)}
        title="Setujui Reservasi Rias"
      >
        <p className="text-xs text-[#7A6E6A] leading-relaxed mb-6">
          Dengan menyetujui pesanan ini, jadwal Anda untuk <strong>{formatDateIndonesia(booking.date)}</strong> pukul <strong>{booking.time} WIB</strong> akan resmi dikunci di kalender. Klien akan segera mendapatkan notifikasi konfirmasi.
        </p>
        <div className="flex justify-end gap-2 text-xs">
          <button
            onClick={() => setIsConfirmModalOpen(false)}
            className="px-4 py-2 rounded-xl text-[#7A6E6A] hover:bg-stone-100 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleApprove}
            className="px-4 py-2 rounded-xl font-semibold bg-[#641A2B] text-white hover:bg-[#4A1220] transition-colors"
          >
            Ya, Setujui Reservasi
          </button>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal 
        isOpen={isRejectModalOpen} 
        onClose={() => setIsRejectModalOpen(false)}
        title="Tolak Reservasi Rias"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-rose-600">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-xs font-semibold">Tindakan ini tidak dapat dibatalkan</span>
          </div>
          <p className="text-xs text-[#7A6E6A] leading-relaxed">
            Apakah Anda yakin ingin menolak pesanan dari <strong>{client.name}</strong>? Dana yang telah disetorkan klien ke sistem Escrow akan dikembalikan secara utuh.
          </p>
        </div>
        <div className="flex justify-end gap-2 text-xs mt-6">
          <button
            onClick={() => setIsRejectModalOpen(false)}
            className="px-4 py-2 rounded-xl text-[#7A6E6A] hover:bg-stone-100 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleReject}
            className="px-4 py-2 rounded-xl font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-colors"
          >
            Konfirmasi Tolak
          </button>
        </div>
      </Modal>

    </div>
  );
}
