"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  PlusCircle, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Coffee, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Lock, 
  Unlock, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  Filter,
  User,
  DollarSign
} from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

interface ScheduleSlot {
  id: string;
  timeRange: string;
  type: 'booked' | 'pending' | 'off' | 'available';
  clientName?: string;
  clientPhone?: string;
  occasion?: string;
  location?: string;
  notes?: string;
  total?: number;
  paymentStatus?: 'Lunas via Escrow' | 'Menunggu Pembayaran' | 'Manual / Cash';
  source?: 'GLAMÉA' | 'Manual';
}

interface DaySchedule {
  date: string; // YYYY-MM-DD
  isStudioOff?: boolean;
  slots: ScheduleSlot[];
}

export default function MuaJadwalPage() {
  // Calendar month state
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(9); // 0-indexed: 9 = Oktober
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-10-15');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'BOOKED' | 'PENDING' | 'OFF'>('ALL');

  // Modal State
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);
  const [manualForm, setManualForm] = useState({
    clientName: '',
    clientPhone: '',
    occasion: 'Wisuda',
    date: '2026-10-16',
    time: '06:00',
    location: '',
    total: '',
    notes: '',
  });
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Default Operating slots config
  const [operatingSlots, setOperatingSlots] = useState({
    subuh: true, // 04:00 - 07:00
    pagi: true,  // 08:00 - 12:00
    siang: true, // 13:00 - 17:00
    malam: false // 18:00 - 21:00
  });

  // Schedule mock store (Pertengahan - Akhir Oktober 2026)
  const [schedules, setSchedules] = useState<Record<string, DaySchedule>>({
    '2026-10-15': {
      date: '2026-10-15',
      isStudioOff: false,
      slots: [
        {
          id: 'slot-1',
          timeRange: '05:00 - 08:00 WIB (Subuh)',
          type: 'booked',
          clientName: 'Siti Aminah',
          clientPhone: '081267891234',
          occasion: 'Graduation Glam Makeup',
          location: 'Gedung Serbaguna UNP (Air Tawar Barat, Padang)',
          notes: 'Tolong jangan terlalu tebal foundation-nya ya kak, mau look fresh natural Korean tone untuk wisuda fakultas bahasa.',
          total: 225000,
          paymentStatus: 'Lunas via Escrow',
          source: 'GLAMÉA',
        },
        {
          id: 'slot-2',
          timeRange: '09:00 - 12:00 WIB (Pagi)',
          type: 'available',
        },
        {
          id: 'slot-3',
          timeRange: '13:00 - 17:00 WIB (Siang/Sore)',
          type: 'available',
        }
      ]
    },
    '2026-10-17': {
      date: '2026-10-17',
      isStudioOff: false,
      slots: [
        {
          id: 'slot-4',
          timeRange: '08:00 - 11:30 WIB (Pagi)',
          type: 'pending',
          clientName: 'Rina Permatasari',
          clientPhone: '081398765432',
          occasion: 'Makeup Lamaran & Engagement Look',
          location: 'Pangeran Beach Hotel, Jl. Ir. H. Juanda No.79, Flamboyan Baru',
          notes: 'Mohon info apakah ada biaya transport untuk area Pantai Padang? Booking untuk 2 orang (Calon Pengantin + Ibu).',
          total: 500000,
          paymentStatus: 'Menunggu Pembayaran',
          source: 'GLAMÉA',
        },
        {
          id: 'slot-5',
          timeRange: '13:00 - 17:00 WIB (Siang/Sore)',
          type: 'available',
        }
      ]
    },
    '2026-10-19': {
      date: '2026-10-19',
      isStudioOff: true,
      slots: [
        {
          id: 'slot-off-1',
          timeRange: 'Sepanjang Hari',
          type: 'off',
          notes: 'Studio Libur Berkala / Maintenance Alat Rias'
        }
      ]
    },
    '2026-10-25': {
      date: '2026-10-25',
      isStudioOff: false,
      slots: [
        {
          id: 'slot-6',
          timeRange: '06:00 - 12:00 WIB (Pagi)',
          type: 'booked',
          clientName: 'Nadira Safitri',
          clientPhone: '085211223344',
          occasion: 'Akad & Baralek Gadang Minang',
          location: 'Rumah Mempelai, Lubuk Begalung, Kota Padang',
          notes: 'Paket Bridal Adat Minang Modern lengkap dengan Suntiang.',
          total: 1850000,
          paymentStatus: 'Lunas via Escrow',
          source: 'GLAMÉA',
        }
      ]
    }
  });

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const dayNames = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

  // Navigate month
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Calendar matrix calculation for the selected month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    // 0 = Sunday, 1 = Monday, etc. Adjust so Monday = 0
    const day = new Date(year, month, 1).getDay();
    return (day + 6) % 7;
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // Generate calendar grid dates
  const calendarCells: Array<{ dateStr: string; dayNumber: number; isCurrentMonth: boolean }> = [];
  
  // Empty cells before month start
  const prevMonthDays = getDaysInMonth(currentYear, currentMonth === 0 ? 11 : currentMonth - 1);
  for (let i = firstDay - 1; i >= 0; i--) {
    const dayNum = prevMonthDays - i;
    const m = currentMonth === 0 ? 12 : currentMonth;
    const y = currentMonth === 0 ? currentYear - 1 : currentYear;
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    calendarCells.push({ dateStr, dayNumber: dayNum, isCurrentMonth: false });
  }

  // Days of current month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    calendarCells.push({ dateStr, dayNumber: day, isCurrentMonth: true });
  }

  // Remaining cells to fill row of 7
  const remaining = (7 - (calendarCells.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    const m = currentMonth === 11 ? 1 : currentMonth + 2;
    const y = currentMonth === 11 ? currentYear + 1 : currentYear;
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarCells.push({ dateStr, dayNumber: i, isCurrentMonth: false });
  }

  // Selected Day data
  const selectedDayData: DaySchedule = schedules[selectedDateStr] || {
    date: selectedDateStr,
    isStudioOff: false,
    slots: [
      { id: 'def-1', timeRange: '05:00 - 08:00 WIB (Subuh)', type: 'available' },
      { id: 'def-2', timeRange: '08:00 - 12:00 WIB (Pagi)', type: 'available' },
      { id: 'def-3', timeRange: '13:00 - 17:00 WIB (Siang/Sore)', type: 'available' },
    ]
  };

  // Format Indonesian date representation
  const formatIndoDate = (dateString: string) => {
    try {
      const parts = dateString.split('-');
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      const dateObj = new Date(y, m, d);
      const dayNamesLong = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const dayName = dayNamesLong[dateObj.getDay()];
      return `${dayName}, ${d} ${monthNames[m]} ${y}`;
    } catch {
      return dateString;
    }
  };

  // Toggle day off state
  const handleToggleStudioOff = (dateStr: string) => {
    const current = schedules[dateStr] || {
      date: dateStr,
      isStudioOff: false,
      slots: []
    };

    const newOff = !current.isStudioOff;
    setSchedules({
      ...schedules,
      [dateStr]: {
        ...current,
        isStudioOff: newOff,
        slots: newOff 
          ? [{ id: `off-${Date.now()}`, timeRange: 'Sepanjang Hari', type: 'off', notes: 'Studio Libur / Istirahat' }]
          : [
              { id: `def-1-${Date.now()}`, timeRange: '05:00 - 08:00 WIB (Subuh)', type: 'available' },
              { id: `def-2-${Date.now()}`, timeRange: '08:00 - 12:00 WIB (Pagi)', type: 'available' },
              { id: `def-3-${Date.now()}`, timeRange: '13:00 - 17:00 WIB (Siang/Sore)', type: 'available' },
            ]
      }
    });

    setSuccessToast(newOff ? 'Status hari ini diubah menjadi Libur Studio.' : 'Status studio kembali dibuka.');
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Close a specific slot
  const handleToggleSlotAvailability = (slotId: string) => {
    const current = selectedDayData;
    const updatedSlots = current.slots.map(s => {
      if (s.id === slotId) {
        if (s.type === 'available') {
          return { ...s, type: 'off' as const, notes: 'Slot Ditutup Sementara oleh MUA' };
        } else if (s.type === 'off') {
          return { ...s, type: 'available' as const, notes: undefined };
        }
      }
      return s;
    });

    setSchedules({
      ...schedules,
      [selectedDateStr]: {
        ...current,
        slots: updatedSlots
      }
    });
  };

  // Handle Manual booking submission
  const handleSaveManualBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.clientName || !manualForm.date) {
      alert('Nama Klien dan Tanggal wajib diisi.');
      return;
    }

    const newSlot: ScheduleSlot = {
      id: `manual-${Date.now()}`,
      timeRange: `${manualForm.time} WIB`,
      type: 'booked',
      clientName: manualForm.clientName,
      clientPhone: manualForm.clientPhone,
      occasion: manualForm.occasion,
      location: manualForm.location || 'Studio Alya Makeup / Alamat Klien',
      notes: manualForm.notes || 'Reservasi offline manual via WhatsApp / Walk-in.',
      total: manualForm.total ? parseInt(manualForm.total.replace(/\D/g, ''), 10) : 0,
      paymentStatus: 'Manual / Cash',
      source: 'Manual',
    };

    const targetDay = schedules[manualForm.date] || {
      date: manualForm.date,
      isStudioOff: false,
      slots: []
    };

    setSchedules({
      ...schedules,
      [manualForm.date]: {
        ...targetDay,
        isStudioOff: false,
        slots: [newSlot, ...targetDay.slots.filter(s => s.type !== 'off')]
      }
    });

    setSelectedDateStr(manualForm.date);
    setIsManualModalOpen(false);
    setManualForm({
      clientName: '',
      clientPhone: '',
      occasion: 'Wisuda',
      date: '2026-10-16',
      time: '06:00',
      location: '',
      total: '',
      notes: '',
    });

    setSuccessToast(`Jadwal manual untuk ${newSlot.clientName} berhasil dikunci pada kalender!`);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // Helper check for cell status
  const getDayStatusSummary = (dateStr: string) => {
    const day = schedules[dateStr];
    if (!day) return null;
    if (day.isStudioOff) return { type: 'off', label: 'Libur' };
    const hasBooked = day.slots.some(s => s.type === 'booked');
    const hasPending = day.slots.some(s => s.type === 'pending');
    if (hasBooked) {
      const bSlot = day.slots.find(s => s.type === 'booked');
      return { type: 'booked', label: bSlot?.occasion ? bSlot.occasion.split(' ')[0] : 'Terkunci' };
    }
    if (hasPending) return { type: 'pending', label: 'Menunggu' };
    return null;
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#EDE3D9]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FAF4EB] text-[#A67C37] border border-[#C9A45C]/30 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A45C] animate-pulse" />
              Kalender Operasional
            </span>
            <span className="text-xs text-[#7A6E6A]">• Studio Alya Makeup Padang</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#641A2B] tracking-tight">
            Jadwal & Ketersediaan Slot
          </h1>
        </div>

          {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 font-poppins">
          <button
            onClick={() => handleToggleStudioOff(selectedDateStr)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white border border-[#EDE3D9] text-[#7A6E6A] hover:text-[#641A2B] hover:border-[#641A2B] transition-colors shadow-sm"
          >
            <Coffee className="w-4 h-4 text-[#A67C37]" />
            <span>{selectedDayData.isStudioOff ? 'Buka Slot Hari Ini' : 'Tandai Libur Hari Ini'}</span>
          </button>

          <button
            onClick={() => {
              setManualForm(prev => ({ ...prev, date: selectedDateStr }));
              setIsManualModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#641A2B] text-white hover:bg-[#4E1220] transition-colors shadow-sm shadow-[#641A2B]/15"
          >
            <PlusCircle className="w-4 h-4 text-[#E8D4B0]" />
            <span>+ Catat Jadwal Manual</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successToast && (
        <div className="p-4 rounded-xl bg-[#DCFCE7] border border-[#86EFAC] text-[#14532D] text-sm flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />
            <span className="font-medium">{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-[#16A34A] hover:text-[#14532D]">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Main Operational Workspace (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Kolom Kiri: Kalender Grid (7 Kolom) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#EDE3D9] shadow-sm p-6 space-y-6">
          
          {/* Calendar Header with Month Navigation & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F5EFEB]">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-poppins font-bold text-[#641A2B] whitespace-nowrap">
                {monthNames[currentMonth]} {currentYear}
              </h2>
              <div className="flex items-center gap-1 bg-[#FAF6F0] p-1 rounded-lg border border-[#EDE3D9]">
                <button
                  onClick={handlePrevMonth}
                  aria-label="Bulan Sebelumnya"
                  className="p-1.5 rounded-md hover:bg-white text-[#7A6E6A] hover:text-[#641A2B] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  aria-label="Bulan Berikutnya"
                  className="p-1.5 rounded-md hover:bg-white text-[#7A6E6A] hover:text-[#641A2B] transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Status Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap font-poppins">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  statusFilter === 'ALL'
                    ? 'bg-[#641A2B] text-white shadow-xs'
                    : 'bg-[#FAF6F0] text-[#7A6E6A] hover:bg-[#F5EFEB]'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setStatusFilter('BOOKED')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  statusFilter === 'BOOKED'
                    ? 'bg-[#641A2B] text-white shadow-xs'
                    : 'bg-[#FAF6F0] text-[#7A6E6A] hover:bg-[#F5EFEB]'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === 'BOOKED' ? 'bg-[#E8D4B0]' : 'bg-[#641A2B]'}`} />
                Terkonfirmasi
              </button>
              <button
                onClick={() => setStatusFilter('PENDING')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  statusFilter === 'PENDING'
                    ? 'bg-[#641A2B] text-white shadow-xs'
                    : 'bg-[#FAF6F0] text-[#7A6E6A] hover:bg-[#F5EFEB]'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === 'PENDING' ? 'bg-[#FDE68A]' : 'bg-[#D97706]'}`} />
                Menunggu
              </button>
              <button
                onClick={() => setStatusFilter('OFF')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  statusFilter === 'OFF'
                    ? 'bg-[#641A2B] text-white shadow-xs'
                    : 'bg-[#FAF6F0] text-[#7A6E6A] hover:bg-[#F5EFEB]'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === 'OFF' ? 'bg-[#E7E5E4]' : 'bg-[#A8A29E]'}`} />
                Libur
              </button>
            </div>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-2 text-center font-poppins">
            {dayNames.map((d, idx) => (
              <div 
                key={idx} 
                className={`text-xs font-semibold uppercase tracking-wider py-1 ${
                  idx >= 5 ? 'text-[#A67C37]' : 'text-[#7A6E6A]'
                }`}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Grid Matrix */}
          <div className="grid grid-cols-7 gap-2">
            {calendarCells.map((cell, idx) => {
              const isSelected = cell.dateStr === selectedDateStr;
              const summary = getDayStatusSummary(cell.dateStr);

              // Apply filter display logic
              let isDimmedByFilter = false;
              if (statusFilter === 'BOOKED' && summary?.type !== 'booked') isDimmedByFilter = true;
              if (statusFilter === 'PENDING' && summary?.type !== 'pending') isDimmedByFilter = true;
              if (statusFilter === 'OFF' && summary?.type !== 'off') isDimmedByFilter = true;

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDateStr(cell.dateStr)}
                  disabled={!cell.isCurrentMonth}
                  className={`min-h-[76px] sm:min-h-[88px] p-1.5 sm:p-2 rounded-xl text-left border flex flex-col justify-between transition-all ${
                    !cell.isCurrentMonth
                      ? 'opacity-30 bg-[#FAF9F7] border-transparent cursor-default'
                      : isSelected
                      ? 'bg-[#FAF4EB] border-[#C9A45C] ring-2 ring-[#C9A45C]/30 shadow-sm'
                      : isDimmedByFilter
                      ? 'opacity-40 bg-white border-[#F5EFEB]'
                      : 'bg-white border-[#EDE3D9] hover:border-[#C9A45C]/60 hover:bg-[#FAF6F0]/50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span 
                      className={`text-xs sm:text-sm font-medium ${
                        isSelected 
                          ? 'text-[#641A2B] font-bold' 
                          : cell.isCurrentMonth 
                          ? 'text-[#292321]' 
                          : 'text-[#A8A29E]'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>

                    {/* Today marker (15 Okt simulation) */}
                    {cell.dateStr === '2026-10-15' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#641A2B]" title="Hari ini" />
                    )}
                  </div>

                  {/* Day Status Pill */}
                  <div className="w-full mt-1">
                    {summary?.type === 'booked' && (
                      <div className="w-full truncate px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#641A2B] text-white">
                        {summary.label}
                      </div>
                    )}
                    {summary?.type === 'pending' && (
                      <div className="w-full truncate px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                        {summary.label}
                      </div>
                    )}
                    {summary?.type === 'off' && (
                      <div className="w-full truncate px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#F5F5F4] text-[#78716C]">
                        Libur
                      </div>
                    )}
                    {!summary && cell.isCurrentMonth && (
                      <span className="text-[10px] text-[#A8A29E] font-light hidden sm:inline-block">
                        Tersedia
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Calendar Legend */}
          <div className="pt-4 border-t border-[#F5EFEB] flex flex-wrap items-center gap-4 text-xs text-[#7A6E6A]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#641A2B]" />
              <span>Sesi Terkonfirmasi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#FEF3C7] border border-[#FDE68A]" />
              <span>Permintaan Menunggu</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#F5F5F4] border border-[#E7E5E4]" />
              <span>Libur Studio</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded border border-[#EDE3D9] bg-white" />
              <span>Slot Kosong (Bisa Dipesan)</span>
            </div>
          </div>

        </div>

        {/* Kolom Kanan: Panel Agenda Harian Terpilih (Dispatch Sheet) (5 Kolom) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-2xl border border-[#EDE3D9] shadow-sm p-6 space-y-6">
            
            {/* Header Selected Date */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#EDE3D9]">
              <div>
                <div className="text-xs uppercase tracking-wider text-[#A67C37] font-semibold font-poppins flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>Agenda Harian Studio</span>
                </div>
                <h3 className="text-xl font-poppins font-bold text-[#641A2B] mt-1">
                  {formatIndoDate(selectedDateStr)}
                </h3>
              </div>

              {/* Status Badge of the day */}
              <span 
                className={`px-3 py-1 rounded-full text-xs font-semibold font-poppins border ${
                  selectedDayData.isStudioOff
                    ? 'bg-[#F5F5F4] text-[#78716C] border-[#E7E5E4]'
                    : 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]'
                }`}
              >
                {selectedDayData.isStudioOff ? 'Studio Libur' : 'Hari Kerja Aktif'}
              </span>
            </div>

            {/* List of Time Slots */}
            <div className="space-y-4">
              {selectedDayData.isStudioOff ? (
                <div className="p-6 rounded-xl bg-[#FAF9F7] border border-[#EDE3D9] text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#EDE3D9]/60 flex items-center justify-center mx-auto text-[#7A6E6A]">
                    <Coffee className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-poppins font-bold text-[#292321] text-base">Studio Sedang Libur</h4>
                    <p className="text-xs text-[#7A6E6A] mt-1">
                      Slot pemesanan publik dinonaktifkan untuk tanggal ini. Anda dapat mengaktifkannya kembali kapan saja.
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleStudioOff(selectedDateStr)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold font-poppins bg-[#641A2B] text-white hover:bg-[#4E1220] transition-colors"
                  >
                    <Unlock className="w-3.5 h-3.5 text-[#E8D4B0]" />
                    <span>Buka Kembali Slot Hari Ini</span>
                  </button>
                </div>
              ) : (
                selectedDayData.slots.map((slot) => {
                  
                  // Booked Slot Card
                  if (slot.type === 'booked') {
                    return (
                      <div 
                        key={slot.id} 
                        className="p-5 rounded-xl border border-[#C9A45C]/40 bg-[#FAF4EB]/40 shadow-xs space-y-4 transition-all"
                      >
                        <div className="flex items-center justify-between border-b border-[#EDE3D9] pb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#641A2B]" />
                            <span className="font-medium text-xs text-[#641A2B] font-mono tracking-tight">
                              {slot.timeRange}
                            </span>
                          </div>

                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold font-poppins bg-[#DCFCE7] text-[#166534] border border-[#86EFAC] flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-[#16A34A]" />
                            <span>{slot.paymentStatus}</span>
                          </span>
                        </div>

                        {/* Booking Details */}
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="text-base font-poppins font-bold text-[#292321]">
                              {slot.occasion}
                            </h4>
                            {slot.total ? (
                              <span className="font-poppins font-bold text-sm text-[#641A2B]">
                                {formatRupiah(slot.total)}
                              </span>
                            ) : null}
                          </div>

                          <div className="mt-2 space-y-1.5 text-xs text-[#524B48]">
                            <div className="flex items-center gap-2">
                              <User className="w-3.5 h-3.5 text-[#A67C37] shrink-0" />
                              <span className="font-medium text-[#292321]">{slot.clientName}</span>
                              {slot.source === 'Manual' && (
                                <span className="text-[10px] bg-[#EDE3D9] px-1.5 py-0.2 rounded text-[#7A6E6A]">Offline</span>
                              )}
                            </div>

                            {slot.location && (
                              <div className="flex items-start gap-2">
                                <MapPin className="w-3.5 h-3.5 text-[#A67C37] shrink-0 mt-0.5" />
                                <span className="line-clamp-2">{slot.location}</span>
                              </div>
                            )}

                            {slot.notes && (
                              <div className="mt-2 p-2.5 rounded-lg bg-white/80 border border-[#EDE3D9] italic text-[#635B57] text-[11px]">
                                &ldquo;{slot.notes}&rdquo;
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 pt-1 font-poppins">
                          {slot.clientPhone && (
                            <a
                              href={`https://wa.me/${slot.clientPhone.replace(/^0/, '62')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-[#641A2B] text-white hover:bg-[#4E1220] transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5 text-[#E8D4B0]" />
                              <span>WhatsApp</span>
                            </a>
                          )}

                          <Link
                            href="/mua/chat"
                            className="inline-flex items-center justify-center py-2 px-3 rounded-lg text-xs font-medium bg-white border border-[#EDE3D9] text-[#292321] hover:text-[#641A2B] hover:border-[#641A2B] transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-[#7A6E6A]" />
                          </Link>
                        </div>
                      </div>
                    );
                  }

                  // Pending Slot Card
                  if (slot.type === 'pending') {
                    return (
                      <div 
                        key={slot.id} 
                        className="p-5 rounded-xl border border-[#FDE68A] bg-[#FEF3C7]/40 shadow-xs space-y-4"
                      >
                        <div className="flex items-center justify-between border-b border-[#FDE68A] pb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse" />
                            <span className="font-medium text-xs text-[#92400E] font-mono">
                              {slot.timeRange}
                            </span>
                          </div>

                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold font-poppins bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                            Menunggu Konfirmasi
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="text-base font-poppins font-bold text-[#292321]">
                              {slot.occasion}
                            </h4>
                            <span className="font-poppins font-bold text-sm text-[#92400E]">
                              {formatRupiah(slot.total || 0)}
                            </span>
                          </div>

                          <div className="mt-2 space-y-1 text-xs text-[#78350F]">
                            <p className="font-medium">{slot.clientName} (2 Orang)</p>
                            <p className="line-clamp-2">{slot.location}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1 font-poppins">
                          <Link
                            href="/mua/dashboard"
                            className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-[#641A2B] text-white hover:bg-[#4E1220] transition-colors"
                          >
                            <span>Tinjau Permintaan di Dashboard</span>
                          </Link>
                        </div>
                      </div>
                    );
                  }

                  // Available Slot Card
                  return (
                    <div 
                      key={slot.id}
                      className="p-4 rounded-xl border border-dashed border-[#EDE3D9] bg-white hover:bg-[#FAF9F7] transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#FAF6F0] flex items-center justify-center border border-[#EDE3D9] text-[#7A6E6A]">
                          <Clock className="w-4 h-4 text-[#A67C37]" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-[#292321] block">
                            {slot.timeRange}
                          </span>
                          <span className="text-[11px] text-[#16A34A] flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                            Slot Terbuka (Dapat Dipesan Klien)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 font-poppins">
                        <button
                          onClick={() => {
                            setManualForm(prev => ({ 
                              ...prev, 
                              date: selectedDateStr,
                              time: slot.timeRange.split(' ')[0] || '08:00'
                            }));
                            setIsManualModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#641A2B] hover:bg-[#FAF4EB] transition-colors"
                          title="Isi jadwal dari pesanan luar"
                        >
                          + Catat
                        </button>
                        <button
                          onClick={() => handleToggleSlotAvailability(slot.id)}
                          className="p-1.5 rounded-lg text-[#7A6E6A] hover:text-[#641A2B] hover:bg-gray-100 transition-colors"
                          title="Kunci / Tutup slot ini"
                        >
                          <Lock className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-4 border-t border-[#EDE3D9] text-xs text-[#7A6E6A]">
              <span>Slot yang terbuka otomatis sinkron dengan pencarian calon pengantin di Kota Padang.</span>
            </div>

          </div>

          {/* Operating Hours Preference Card */}
          <div className="bg-white rounded-2xl border border-[#EDE3D9] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-poppins font-bold text-[#641A2B] text-sm">Jam Operasional Default</h4>
                <p className="text-[11px] text-[#7A6E6A]">Preferensi slot rias harian Studio Alya Makeup</p>
              </div>
              <span className="text-xs font-semibold font-poppins text-[#A67C37] bg-[#FAF4EB] px-2 py-0.5 rounded border border-[#C9A45C]/30">
                Aktif
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EDE3D9] flex items-center justify-between">
                <div>
                  <span className="font-medium text-[#292321] block">Sesi Subuh</span>
                  <span className="text-[10px] text-[#7A6E6A]">04:00 - 07:00</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
              </div>

              <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EDE3D9] flex items-center justify-between">
                <div>
                  <span className="font-medium text-[#292321] block">Sesi Pagi</span>
                  <span className="text-[10px] text-[#7A6E6A]">08:00 - 12:00</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
              </div>

              <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EDE3D9] flex items-center justify-between">
                <div>
                  <span className="font-medium text-[#292321] block">Sesi Siang/Sore</span>
                  <span className="text-[10px] text-[#7A6E6A]">13:00 - 17:00</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
              </div>

              <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EDE3D9] flex items-center justify-between opacity-60">
                <div>
                  <span className="font-medium text-[#292321] block">Sesi Malam</span>
                  <span className="text-[10px] text-[#7A6E6A]">18:00 - 21:00</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-gray-400" />
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 3. Modal "+ Catat Jadwal Manual" */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#EDE3D9] shadow-2xl max-w-lg w-full overflow-hidden max-h-[92vh] flex flex-col my-auto animate-scale-up">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#641A2B] text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-poppins font-bold text-lg text-white">Catat Jadwal Rias Manual</h3>
                <p className="text-xs text-[#E8D4B0] font-light mt-0.5">
                  Kunci slot kalender untuk reservasi offline / WhatsApp pribadi
                </p>
              </div>
              <button 
                onClick={() => setIsManualModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveManualBooking} className="p-6 space-y-4 overflow-y-auto">
              
              <div>
                <label className="block text-xs font-semibold text-[#292321] mb-1">
                  Nama Klien <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dinda Puspita"
                  value={manualForm.clientName}
                  onChange={(e) => setManualForm({ ...manualForm, clientName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE3D9] text-sm focus:outline-hidden focus:border-[#641A2B] focus:ring-1 focus:ring-[#641A2B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#292321] mb-1">
                    No. WhatsApp Klien
                  </label>
                  <input
                    type="tel"
                    placeholder="0812xxxxxxxx"
                    value={manualForm.clientPhone}
                    onChange={(e) => setManualForm({ ...manualForm, clientPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE3D9] text-sm focus:outline-hidden focus:border-[#641A2B] focus:ring-1 focus:ring-[#641A2B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#292321] mb-1">
                    Kategori Acara
                  </label>
                  <select
                    value={manualForm.occasion}
                    onChange={(e) => setManualForm({ ...manualForm, occasion: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE3D9] text-sm focus:outline-hidden focus:border-[#641A2B] focus:ring-1 focus:ring-[#641A2B] bg-white"
                  >
                    <option value="Wisuda">Wisuda / Graduation</option>
                    <option value="Wedding / Baralek">Wedding / Baralek</option>
                    <option value="Lamaran & Engagement">Lamaran & Engagement</option>
                    <option value="Prewedding Photoshoot">Prewedding Photoshoot</option>
                    <option value="Pesta / Party Makeup">Pesta / Party Makeup</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#292321] mb-1">
                    Tanggal Sesi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={manualForm.date}
                    onChange={(e) => setManualForm({ ...manualForm, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE3D9] text-sm focus:outline-hidden focus:border-[#641A2B] focus:ring-1 focus:ring-[#641A2B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#292321] mb-1">
                    Jam Mulai Sesi
                  </label>
                  <input
                    type="time"
                    value={manualForm.time}
                    onChange={(e) => setManualForm({ ...manualForm, time: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE3D9] text-sm focus:outline-hidden focus:border-[#641A2B] focus:ring-1 focus:ring-[#641A2B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#292321] mb-1">
                  Lokasi Rias
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Hotel Santika Premiere Padang / Studio"
                  value={manualForm.location}
                  onChange={(e) => setManualForm({ ...manualForm, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE3D9] text-sm focus:outline-hidden focus:border-[#641A2B] focus:ring-1 focus:ring-[#641A2B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#292321] mb-1">
                    Tarif / Kesepakatan (Rp)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 350.000"
                    value={manualForm.total}
                    onChange={(e) => setManualForm({ ...manualForm, total: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE3D9] text-sm focus:outline-hidden focus:border-[#641A2B] focus:ring-1 focus:ring-[#641A2B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#292321] mb-1">
                    Catatan Khusus
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Bawa softlens & hijab stylist"
                    value={manualForm.notes}
                    onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE3D9] text-sm focus:outline-hidden focus:border-[#641A2B] focus:ring-1 focus:ring-[#641A2B]"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#EDE3D9] font-poppins">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#7A6E6A] hover:bg-[#FAF6F0] transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#641A2B] text-white hover:bg-[#4E1220] transition-colors shadow-sm"
                >
                  Simpan & Kunci Slot
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
