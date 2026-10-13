"use client";
import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { MuaCard } from '@/components/client/MuaCard';
import { mockMuas, mockMuaAggregates } from '@/data/mock-muas';

export default function CariMuaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('rek');

  const filteredMuas = useMemo(() => {
    return mockMuas.filter(mua => {
      const matchSearch = mua.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          mua.makeupStyles.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchLocation = location ? mua.location === location : true;
      const matchCategory = category ? mua.makeupStyles.some(s => s.toLowerCase().includes(category.toLowerCase())) : true;
      
      const price = mockMuaAggregates[mua.id]?.startingPrice || 0;
      let matchPrice = true;
      if (priceRange === '<500') matchPrice = price < 500000;
      if (priceRange === '500-1000') matchPrice = price >= 500000 && price <= 1000000;
      if (priceRange === '>1000') matchPrice = price > 1000000;
      
      return matchSearch && matchLocation && matchCategory && matchPrice;
    }).sort((a, b) => {
      const aRating = mockMuaAggregates[a.id]?.rating || 0;
      const bRating = mockMuaAggregates[b.id]?.rating || 0;
      const aPrice = mockMuaAggregates[a.id]?.startingPrice || 0;
      const bPrice = mockMuaAggregates[b.id]?.startingPrice || 0;

      if (sortBy === 'rating') return bRating - aRating;
      if (sortBy === 'price_asc') return aPrice - bPrice;
      if (sortBy === 'price_desc') return bPrice - aPrice;
      return 0; // rekomendasi (default)
    });
  }, [searchTerm, location, category, priceRange, sortBy]);

  return (
    <div className="bg-glamea-background min-h-screen pb-20">
      
      {/* Header & Search Bar */}
      <div className="bg-white border-b border-glamea-secondary py-8 pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold font-serif text-glamea-primary mb-6">Cari MUA Terbaik di Padang</h1>
          
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-glamea-text-muted" />
            </div>
            <Input 
              type="text" 
              className="font-sans pl-10 h-12 text-base" 
              placeholder="Cari nama MUA, gaya makeup..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 shrink-0 space-y-6">
          <div className="bg-white p-5 rounded-xl border border-glamea-secondary flex items-center justify-between">
            <h3 className="font-poppins font-semibold text-sm inline-flex items-center text-glamea-text"><SlidersHorizontal size={18} className="mr-2"/> Filter</h3>
            <span className="font-poppins text-xs font-semibold text-glamea-text-muted">{filteredMuas.length} MUA</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-glamea-secondary space-y-5">
            <div>
              <label className="font-poppins block text-xs font-semibold text-glamea-text mb-2">Lokasi</label>
              <Select value={location} onChange={e => setLocation(e.target.value)} className="font-sans text-xs">
                <option value="">Semua Area Padang</option>
                <option value="Kuranji">Kuranji</option>
                <option value="Koto Tangah">Koto Tangah</option>
                <option value="Padang Barat">Padang Barat</option>
                <option value="Padang Timur">Padang Timur</option>
                <option value="Pauh">Pauh</option>
                <option value="Lubuk Begalung">Lubuk Begalung</option>
                <option value="Nanggalo">Nanggalo</option>
                <option value="Lubuk Kilangan">Lubuk Kilangan</option>
              </Select>
            </div>
            
            <div>
              <label className="font-poppins block text-xs font-semibold text-glamea-text mb-2">Acara / Momen</label>
              <Select value={category} onChange={e => setCategory(e.target.value)} className="font-sans text-xs">
                <option value="">Semua Acara</option>
                <option value="Wedding">Wedding</option>
                <option value="Baralek">Baralek</option>
                <option value="Engagement">Lamaran (Engagement)</option>
                <option value="Graduation">Wisuda</option>
                <option value="Party">Party</option>
                <option value="Photoshoot">Photoshoot / Prewed</option>
              </Select>
            </div>
            
            <div>
              <label className="font-poppins block text-xs font-semibold text-glamea-text mb-2">Kisaran Harga</label>
              <Select value={priceRange} onChange={e => setPriceRange(e.target.value)} className="font-sans text-xs">
                <option value="">Semua Harga</option>
                <option value="<500">{"<"} Rp 500.000</option>
                <option value="500-1000">Rp 500.000 - Rp 1.000.000</option>
                <option value=">1000">{">"} Rp 1.000.000</option>
              </Select>
            </div>
            
            <Button variant="outline" className="font-poppins w-full font-semibold text-xs" onClick={() => {
              setSearchTerm(''); setLocation(''); setCategory(''); setPriceRange(''); setSortBy('rek');
            }}>Reset Filter</Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-poppins text-lg font-bold text-glamea-text">Menampilkan MUA Padang</h2>
            <div className="flex items-center gap-3">
              <label className="font-poppins text-xs font-semibold text-glamea-text-muted whitespace-nowrap">Urutkan:</label>
              <Select className="font-sans text-xs h-9 py-1 w-[180px]" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="rek">Rekomendasi</option>
                <option value="rating">Rating Tertinggi</option>
                <option value="price_asc">Harga Terendah</option>
                <option value="price_desc">Harga Tertinggi</option>
              </Select>
            </div>
          </div>

          {filteredMuas.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-xl border border-glamea-secondary">
              <Search className="h-12 w-12 text-glamea-secondary mx-auto mb-4" />
              <h3 className="font-poppins text-lg font-semibold text-glamea-primary mb-2">Tidak menemukan MUA</h3>
              <p className="font-sans text-sm text-glamea-text-muted">Coba ubah filter atau kata kunci pencarian Anda.</p>
              <Button className="font-poppins mt-4 font-semibold text-xs" variant="outline" onClick={() => {
                setSearchTerm(''); setLocation(''); setCategory(''); setPriceRange('');
              }}>Reset Semua Filter</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMuas.map(mua => (
                <MuaCard key={mua.id} mua={mua} stats={mockMuaAggregates[mua.id]} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
