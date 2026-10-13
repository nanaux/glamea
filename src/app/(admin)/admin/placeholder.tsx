"use client";
import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Layers, ArrowLeft } from 'lucide-react';

export default function AdminEmptyPage({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="space-y-6 font-sans">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#172033] tracking-tight">{title}</h1>
        <p className="text-sm text-[#64748B] mt-1">{desc}</p>
      </div>

      <Card className="bg-white border-[#E1E7F0] shadow-sm rounded-2xl">
        <CardContent className="p-12 md:p-16 flex flex-col items-center text-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] text-[#4778C7] border border-[#BFDBFE]/70 flex items-center justify-center mb-5 shadow-sm">
              <Layers className="w-8 h-8" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#EFF6FF] text-[#4778C7] border border-[#BFDBFE] mb-3">
              <span>Status: Dalam Integrasi</span>
            </div>
            <h2 className="text-lg md:text-xl font-poppins font-bold text-[#172033] mb-2">Modul {title}</h2>
            <p className="text-sm text-[#64748B] max-w-md leading-relaxed mb-6 font-sans">
              Layanan visual dan kontrol manajemen untuk {title} telah disesuaikan dengan tema Navy &amp; Soft Blue. Data backend live akan terhubung pada rilis berikutnya.
            </p>
            <Link 
              href="/admin" 
              className="inline-flex items-center gap-2 bg-[#4778C7] hover:bg-[#3565AE] text-white text-xs font-poppins font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Dashboard
            </Link>
        </CardContent>
      </Card>
    </div>
  );
}
