"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/shared/Sidebar';
import { 
  Users, 
  CalendarDays, 
  CreditCard, 
  Landmark, 
  Activity, 
  FileText,
  Tags,
  LayoutDashboard,
  LogOut
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  useEffect(() => {
    const role = localStorage.getItem('user_role');
    if (role !== 'ADMIN') {
      router.push('/admin/masuk');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
    router.push('/admin/masuk');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { id: 'akun', label: 'Akun Pengguna', href: '/admin/akun', icon: Users },
    { id: 'booking', label: 'Booking', href: '/admin/booking', icon: CalendarDays },
    { id: 'pembayaran', label: 'Pembayaran', href: '/admin/pembayaran', icon: CreditCard },
    { id: 'pencairan', label: 'Pencairan', href: '/admin/pencairan', icon: Landmark },
    { id: 'aktivitas', label: 'Aktivitas', href: '/admin/aktivitas', icon: Activity },
    { id: 'laporan', label: 'Laporan', href: '/admin/laporan', icon: FileText },
    { id: 'kategori', label: 'Kategori', href: '/admin/kategori', icon: Tags },
    { id: 'logout', label: 'Keluar', icon: LogOut, action: handleLogout, danger: true },
  ];

  return (
    <div className="flex min-h-screen bg-[#F4F7FC] text-[#172033] font-sans">
      <Sidebar 
        title="GLAMÉA Admin" 
        items={navItems}
        userRole="Administrator"
        userName="Super Admin"
        theme="admin"
      />
      <main className="flex-1 h-screen overflow-y-auto bg-[#F4F7FC] font-sans text-[#172033] [&_h1]:font-serif [&_h1]:text-[#172033] [&_h2]:font-poppins [&_h2]:text-[#172033] [&_h3]:font-poppins [&_h3]:text-[#172033] [&_h4]:font-poppins [&_h4]:text-[#172033] [&_h5]:font-poppins [&_h5]:text-[#172033] [&_h6]:font-poppins [&_h6]:text-[#172033]">
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
           {children}
        </div>
      </main>
    </div>
  );
}
