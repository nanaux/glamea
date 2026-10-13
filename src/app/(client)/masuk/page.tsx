"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('client@glamea.test');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login
    setTimeout(() => {
      // Set to localStorage for demo
      localStorage.setItem('user_role', 'CLIENT');
      localStorage.setItem('user_email', email);
      
      // Redirect to profile or home
      router.push('/profil');
    }, 1000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-xl shadow-glamea-primary/5 border border-glamea-secondary">
        
        <div className="text-center">
          <h2 className="text-3xl font-bold font-serif text-glamea-primary">Masuk ke GLAMÉA</h2>
          <p className="mt-3 text-sm text-glamea-text-muted">
            Selamat datang kembali! Silakan masuk ke akun Anda.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-glamea-text mb-1.5" htmlFor="email-address">Email</label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Masukkan email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-glamea-text mb-1.5" htmlFor="password">Kata Sandi</label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Masukkan kata sandi Anda"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm">
              <a href="#" className="font-medium text-glamea-primary hover:text-glamea-accent transition-colors">
                Lupa kata sandi?
              </a>
            </div>
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Masuk
          </Button>
          
          <div className="text-center mt-6">
            <p className="text-sm text-glamea-text-muted">
              Belum punya akun?{' '}
              <Link href="/daftar" className="font-medium text-glamea-primary hover:text-glamea-accent transition-colors">
                Daftar sekarang
              </Link>
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-glamea-secondary text-center">
            <p className="text-xs text-glamea-text-muted mb-2">Simulasi role login (Mock)</p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="text-xs bg-glamea-secondary p-1 px-2 rounded-md font-mono text-glamea-primary cursor-pointer hover:bg-glamea-secondary-hover" onClick={() => setEmail('client@glamea.test')}>Client</span>
              <span className="text-xs bg-glamea-secondary p-1 px-2 rounded-md font-mono text-glamea-primary cursor-pointer hover:bg-glamea-secondary-hover" onClick={() => {setEmail('mua@glamea.test'); router.push('/mua/masuk');}}>MUA</span>
              <span className="text-xs bg-glamea-secondary p-1 px-2 rounded-md font-mono text-glamea-primary cursor-pointer hover:bg-glamea-secondary-hover" onClick={() => {setEmail('admin@glamea.test'); router.push('/admin/masuk');}}>Admin</span>
            </div>
          </div>
        </form>
        
      </div>
    </div>
  );
}
