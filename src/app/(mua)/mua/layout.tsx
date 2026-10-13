"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/shared/Sidebar';
import { mockMuas } from '@/data/mock-muas';
import { 
  Building2, 
  CalendarDays, 
  Wallet, 
  Image as ImageIcon, 
  MessageCircle, 
  UserCircle,
  LayoutDashboard,
  LogOut
} from 'lucide-react';

export default function MuaLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mua, setMua] = useState<any>(null);
  
  useEffect(() => {
    const role = localStorage.getItem('user_role');
    const email = localStorage.getItem('user_email');
    
    if (role !== 'MUA') {
      router.push('/mua/masuk');
    } else {
      // Find mua profile for sidebar
      const profile = mockMuas.find(m => m.email === email) || mockMuas[0];
      setMua(profile);
    }
  }, [router]);

  if (!mua) return <div className="h-screen flex items-center justify-center p-4">Memuat panel MUA...</div>;

  const handleLogout = () => {
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
    router.push('/mua/masuk');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', href: '/mua/dashboard', icon: LayoutDashboard },
    { id: 'booking', label: 'Permintaan Booking', href: '/mua/booking', icon: Building2, badge: '1' },
    { id: 'jadwal', label: 'Jadwal', href: '/mua/jadwal', icon: CalendarDays },
    { id: 'portofolio', label: 'Portofolio', href: '/mua/portofolio', icon: ImageIcon },
    { id: 'pendapatan', label: 'Pendapatan', href: '/mua/pendapatan', icon: Wallet },
    { id: 'chat', label: 'Chat', href: '/mua/chat', icon: MessageCircle, badge: '2' },
    { id: 'profil', label: 'Profil', href: '/mua/profil', icon: UserCircle },
    { id: 'logout', label: 'Keluar', icon: LogOut, action: handleLogout, danger: true },
  ];

  return (
    <div className="flex min-h-screen bg-[#FAF6F0]">
      <Sidebar 
        title="GLAMÉA" 
        items={navItems}
        userRole="Spesialis Wedding & Baralek"
        userName={mua.name}
        userAvatar={mua.portfolioImage}
        isVerified={mua.isVerified}
        rating={4.9}
        location={mua.location}
      />
      <main className="flex-1 h-screen overflow-y-auto bg-[#FAF6F0]">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
           {children}
        </div>
      </main>
    </div>
  );
}
