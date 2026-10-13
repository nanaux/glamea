"use client";
import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function MuaEmptyPage({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-glamea-primary">{title}</h1>
        <p className="text-glamea-text-muted mt-2">{desc}</p>
      </div>

      <Card>
        <CardContent className="p-16 flex flex-col items-center text-center justify-center">
            <h2 className="text-xl font-poppins font-medium mb-3">Modul sedang dalam pengembangan</h2>
            <p className="text-glamea-text-muted max-w-md font-sans">Layanan backend untuk {title} (seperti kalender interaktif dan portofolio upload) belum dihubungkan dengan mock server.</p>
            <Link href="/mua/dashboard">
              <Button className="mt-6 font-poppins" variant="outline">Kembali ke Dashboard</Button>
            </Link>
        </CardContent>
      </Card>
    </div>
  );
}
