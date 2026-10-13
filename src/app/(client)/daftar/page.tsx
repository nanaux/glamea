"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate register
    setTimeout(() => {
      // Set to localStorage for demo
      localStorage.setItem('user_role', 'CLIENT');
      localStorage.setItem('user_email', 'client@glamea.test'); // dummy
      
      router.push('/profil');
    }, 1000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-xl shadow-glamea-primary/5 border border-glamea-secondary">
        
        <div className="text-center">
          <h2 className="text-3xl font-bold font-serif text-glamea-primary">Daftar Akun Baru</h2>
          <p className="mt-3 text-sm text-glamea-text-muted">
            Bergabunglah dengan ratusan klien GLAMÉA lainnya.
          </p>
        </div>
        
        <form className="mt-8 space-y-4" onSubmit={handleRegister}>
          
          <div>
            <label className="block text-sm font-medium text-glamea-text mb-1.5" htmlFor="name">Nama Lengkap</label>
            <Input id="name" name="name" type="text" required placeholder="Nama Lengkap" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-glamea-text mb-1.5" htmlFor="email">Email</label>
            <Input id="email" name="email" type="email" required placeholder="Email aktif" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-glamea-text mb-1.5" htmlFor="phone">Nomor HP</label>
            <Input id="phone" name="phone" type="tel" required placeholder="08xxxxxxxxxx" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-glamea-text mb-1.5" htmlFor="password">Kata Sandi</label>
            <Input id="password" name="password" type="password" required placeholder="Buat kata sandi yang kuat" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-glamea-text mb-1.5" htmlFor="password_confirm">Konfirmasi Kata Sandi</label>
            <Input id="password_confirm" name="password_confirm" type="password" required placeholder="Ulangi kata sandi" />
          </div>

          <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
            Daftar Sekarang
          </Button>
          
          <div className="text-center mt-6">
            <p className="text-sm text-glamea-text-muted">
              Sudah punya akun?{' '}
              <Link href="/masuk" className="font-medium text-glamea-primary hover:text-glamea-accent transition-colors">
                Masuk di sini
              </Link>
            </p>
          </div>
        
        </form>
        
      </div>
    </div>
  );
}
