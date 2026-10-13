"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, CreditCard, Wallet, Building, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatRupiah } from '@/lib/utils';
import { mockServices } from '@/data/mock-services';
import { mockMuas } from '@/data/mock-muas';

export default function PembayaranPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('glamea_draft_booking');
    if (data) {
      setDraft(JSON.parse(data));
    } else {
      router.push('/');
    }
  }, [router]);

  if (!draft) return <div className="font-poppins p-20 text-center text-sm text-[#3A101C]/60">Memuat...</div>;

  const mua = mockMuas.find(m => m.id === draft.muaId);
  const service = mockServices.find(s => s.id === draft.serviceId);

  const handlePay = () => {
    if (!paymentMethod) {
      alert("Pilih metode pembayaran terlebih dahulu.");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment process
    setTimeout(() => {
      // Clean draft, create mock real booking state
      localStorage.removeItem('glamea_draft_booking');
      
      const newBooking = {
        ...draft,
        id: `mock-b-${Date.now()}`,
        paymentId: `mock-p-${Date.now()}`,
        paymentMethod,
      };
      
      localStorage.setItem('glamea_recent_booking', JSON.stringify(newBooking));
      router.push('/pembayaran/berhasil');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-serif font-bold text-glamea-primary mb-4">Pilih Metode Pembayaran</h1>
        <p className="font-sans text-xs sm:text-sm text-glamea-text-muted leading-relaxed">Total pembayaran Anda adalah <strong className="font-poppins font-semibold text-glamea-text">{formatRupiah(draft.total)}</strong>. Uang Anda akan ditahan dengan aman oleh GLAMÉA hingga layanan selesai diberikan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left - Payment Methods */}
        <div className="space-y-6">
          <h3 className="font-serif font-bold text-lg text-glamea-primary">Metode Pembayaran</h3>
          
          <div className="space-y-3">
            {[
              { id: 'Transfer Bank', icon: Building, title: 'Transfer Bank' },
              { id: 'Virtual Account', icon: CreditCard, title: 'Virtual Account' },
              { id: 'E-Wallet', icon: Wallet, title: 'E-Wallet (OVO, GoPay, DANA)' }
            ].map(method => (
              <label 
                key={method.id}
                className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === method.id ? 'border-glamea-primary bg-glamea-secondary/20' : 'border-glamea-secondary hover:border-glamea-primary/50 bg-white'}`}
              >
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value={method.id}
                  className="mr-4 accent-glamea-primary cursor-pointer w-4 h-4"
                  onChange={() => setPaymentMethod(method.id)}
                />
                <method.icon className={`mr-3 w-5 h-5 ${paymentMethod === method.id ? 'text-glamea-primary' : 'text-glamea-text-muted'}`} />
                <span className="font-poppins font-medium text-sm text-glamea-text">{method.title}</span>
              </label>
            ))}
          </div>
          
          <div className="bg-glamea-success/10 border border-glamea-success/20 rounded-xl p-4 flex gap-3 text-xs text-glamea-success font-sans">
             <Shield className="w-5 h-5 shrink-0 text-glamea-success" />
             <p className="leading-relaxed">Platform Aman. Pembayaran tidak akan diteruskan ke MUA sebelum pesanan 100% selesai.</p>
          </div>
        </div>

        {/* Right - Summary Box */}
        <div>
          <Card className="border-glamea-secondary shadow-lg shadow-glamea-primary/5 sticky top-28 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <h3 className="font-serif font-bold text-xl border-b border-glamea-secondary pb-4 mb-4 text-glamea-primary">Ringkasan Pesanan</h3>
              
              <div className="space-y-2 mb-6 text-xs">
                <div className="flex justify-between font-sans">
                  <span className="text-glamea-text-muted">MUA</span>
                  <span className="font-poppins font-medium text-glamea-text">{mua?.name}</span>
                </div>
                <div className="flex justify-between font-sans">
                  <span className="text-glamea-text-muted">Kategori</span>
                  <span className="font-poppins font-medium text-glamea-text">{service?.category}</span>
                </div>
                <div className="flex justify-between font-sans">
                  <span className="text-glamea-text-muted">Waktu</span>
                  <span className="font-poppins font-medium text-glamea-text">{draft.date} | {draft.time} WIB</span>
                </div>
              </div>

              <div className="space-y-2 py-4 border-y border-glamea-secondary mb-6 text-xs font-sans">
                <div className="flex justify-between">
                  <span className="text-glamea-text-muted">Harga Layanan</span>
                  <span className="font-poppins font-medium text-glamea-text">{formatRupiah(draft.subtotal)}</span>
                </div>
                {draft.discount > 0 && (
                  <div className="flex justify-between text-glamea-success font-sans">
                    <span>Diskon Booking Pertama</span>
                    <span className="font-poppins font-bold">-{formatRupiah(draft.discount)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="font-poppins font-bold text-xs uppercase tracking-wider text-glamea-text-muted">Total Bayar</span>
                <span className="font-serif font-bold text-2xl text-glamea-primary">{formatRupiah(draft.total)}</span>
              </div>

              <Button 
                className="font-poppins font-semibold w-full py-3 rounded-xl" 
                size="lg" 
                onClick={handlePay} 
                isLoading={isProcessing}
                disabled={!paymentMethod}
              >
                Bayar Sekarang
              </Button>
              
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  );
}
