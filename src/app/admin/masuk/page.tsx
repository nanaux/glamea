"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@glamea.test');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      localStorage.setItem('user_role', 'ADMIN');
      localStorage.setItem('user_email', email);

      router.push('/admin');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F4F7FC] font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-[#E1E7F0]">

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#11182D] text-white font-bold text-lg mb-4 shadow-sm">
            G
          </div>
          <h2 className="text-2xl font-bold text-[#172033] tracking-tight font-sans">Admin Control Panel</h2>
          <p className="mt-1.5 text-sm text-[#64748B]">
            Masuk ke dashboard utama GLAMÉA.
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#172033] mb-1.5">Email Admin</label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-[#E1E7F0] focus-visible:border-[#4778C7] focus-visible:ring-[#4778C7] rounded-xl text-[#172033] bg-[#F8FAFC]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#172033] mb-1.5">Kata Sandi</label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-[#E1E7F0] focus-visible:border-[#4778C7] focus-visible:ring-[#4778C7] rounded-xl text-[#172033] bg-[#F8FAFC]/50"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#4778C7] hover:bg-[#3565AE] text-white font-semibold rounded-xl h-11 transition-colors shadow-sm font-sans"
            size="lg"
            isLoading={isLoading}
          >
            Masuk
          </Button>

          <div className="text-center mt-6">
            <Link href="/masuk" className="text-sm font-medium text-[#64748B] hover:text-[#172033] transition-colors font-sans">
              Kembali
            </Link>
          </div>
        </form>

      </div>
    </div>
  );
}
