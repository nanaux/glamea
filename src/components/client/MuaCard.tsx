import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, CheckCircle2, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MuaProfile, MuaAggregatedData } from '@/types';
import { formatRupiah } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MuaCardProps {
  mua: MuaProfile;
  stats?: MuaAggregatedData;
}

export function MuaCard({ mua, stats }: MuaCardProps) {
  const rating = stats?.rating || 0;
  const reviews = stats?.reviewCount || 0;
  const startingPrice = stats?.startingPrice || 0;

  return (
    <Card className="group overflow-hidden rounded-2xl bg-white border border-[#EDE3D9] transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 flex flex-col h-full">
      {/* Portfolio Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF6F0]">
        {mua.portfolioImage ? (
          <Image
            src={mua.portfolioImage}
            alt={`Portofolio riasan ${mua.name}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#FAF6F0] to-[#EDE3D9] text-[#746A67]">
            <Sparkles className="w-10 h-10 text-[#C9A45C] opacity-70 mb-2" />
            <span className="text-xs font-medium">GLAMÉA Artist</span>
          </div>
        )}

        {/* Gradient overlay on image bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Verified Badge */}
        {mua.isVerified && (
          <div className="absolute top-3 left-3 z-10">
            <span className="font-poppins inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/95 text-[#641A2B] shadow-sm backdrop-blur-sm border border-[#EDE3D9]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A45C] fill-[#C9A45C]/20" />
              Terverifikasi
            </span>
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute bottom-3 right-3 z-10">
          <div className="font-poppins inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 text-[#292321] shadow-sm backdrop-blur-sm">
            <Star className="w-3.5 h-3.5 fill-[#C9A45C] text-[#C9A45C]" />
            <span>{rating > 0 ? rating.toFixed(1) : 'Baru'}</span>
            {reviews > 0 && <span className="font-sans text-[#746A67] text-[10px]">({reviews})</span>}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <CardContent className="p-5 flex flex-col flex-grow justify-between">
        <div>
          {/* MUA Name & Location */}
          <div className="mb-2">
            <h3 className="font-serif text-lg font-bold text-[#641A2B] group-hover:text-[#4E1321] transition-colors line-clamp-1">
              {mua.name}
            </h3>
            <div className="font-sans flex items-center text-xs text-[#746A67] mt-1">
              <MapPin className="w-3.5 h-3.5 mr-1 shrink-0 text-[#C9A45C]" />
              <span className="truncate">{mua.location}, Padang</span>
            </div>
          </div>

          {/* Makeup Styles / Categories */}
          <div className="flex flex-wrap gap-1.5 my-3">
            {mua.makeupStyles.slice(0, 3).map((style, i) => (
              <span
                key={i}
                className="font-poppins text-[11px] px-2.5 py-0.5 rounded-full bg-[#FAF6F0] text-[#641A2B] font-medium border border-[#EDE3D9]/70"
              >
                {style}
              </span>
            ))}
            {mua.makeupStyles.length > 3 && (
              <span className="font-poppins text-[10px] text-[#746A67] self-center ml-0.5 font-medium">
                +{mua.makeupStyles.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Price & CTA */}
        <div className="pt-3 border-t border-[#EDE3D9]/60 mt-2 space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="font-sans text-xs text-[#746A67]">Mulai dari</span>
            <span className="font-poppins text-sm font-bold text-[#641A2B]">
              {startingPrice > 0 ? formatRupiah(startingPrice) : 'Konsultasi'}
            </span>
          </div>

          <Link href={`/mua/${mua.id}`} className="block">
            <Button
              variant="outline"
              size="sm"
              className="font-poppins w-full border-[#641A2B]/20 text-[#641A2B] hover:bg-[#641A2B] hover:text-white font-semibold transition-colors h-9"
            >
              Lihat Profil
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

