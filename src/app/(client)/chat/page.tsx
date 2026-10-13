import React from 'react';
import { Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ChatPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-80px)] flex flex-col">
      <h1 className="text-2xl font-serif font-bold text-glamea-primary mb-6">Pesan & Diskusi</h1>
      
      <div className="flex-1 bg-white border border-glamea-secondary rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row">
        
        {/* Contact List */}
        <div className="w-full md:w-1/3 border-r border-glamea-secondary bg-glamea-background/30 flex flex-col h-1/3 md:h-full overflow-y-auto custom-scrollbar">
          <div className="p-4 border-b border-glamea-secondary">
             <Input placeholder="Cari percakapan..." className="h-9" />
          </div>
          
          <div className="flex-1">
            {/* Mock Contact */}
            <div className="p-4 border-b border-glamea-secondary bg-white cursor-pointer hover:bg-glamea-secondary/20 transition-colors flex gap-3 items-center">
               <div className="w-12 h-12 bg-glamea-primary/10 rounded-full flex items-center justify-center text-glamea-primary font-bold font-serif shrink-0">
                  A
               </div>
               <div className="flex-1 min-w-0">
                 <div className="flex justify-between items-center mb-1">
                   <h4 className="font-semibold text-sm truncate">Alya Makeup</h4>
                   <span className="text-xs text-glamea-text-muted">10:30</span>
                 </div>
                 <p className="text-xs text-glamea-text-muted truncate">Iya kak, untuk tanggal segitu masih kosong. Mau booking paket yang mana?</p>
               </div>
            </div>
            
            <div className="p-4 border-b border-glamea-secondary cursor-pointer hover:bg-glamea-secondary/20 transition-colors flex gap-3 items-center">
               <div className="w-12 h-12 bg-glamea-secondary rounded-full flex items-center justify-center text-glamea-primary font-bold font-serif shrink-0">
                  N
               </div>
               <div className="flex-1 min-w-0">
                 <div className="flex justify-between items-center mb-1">
                   <h4 className="font-medium text-sm truncate text-glamea-text-muted">Nadira Beauty</h4>
                   <span className="text-xs text-glamea-text-muted">Kemarin</span>
                 </div>
                 <p className="text-xs text-glamea-text-muted truncate">Terima kasih kak.</p>
               </div>
            </div>
          </div>
        </div>

        {/* Active Chat */}
        <div className="w-full md:w-2/3 flex flex-col h-2/3 md:h-full">
           <div className="p-4 border-b border-glamea-secondary flex items-center gap-3 bg-white">
              <div className="w-10 h-10 bg-glamea-primary/10 rounded-full flex items-center justify-center text-glamea-primary font-bold font-serif shrink-0">
                A
              </div>
              <div>
                <h3 className="font-bold text-sm">Alya Makeup</h3>
                <p className="text-xs text-glamea-success flex items-center">Online</p>
              </div>
           </div>
           
           <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-glamea-background/30 flex flex-col gap-4">
              <div className="text-center text-xs text-glamea-text-muted my-4">Hari ini, 10:25</div>
              
              <div className="flex justify-end">
                 <div className="bg-glamea-primary text-white rounded-2xl rounded-tr-sm p-3 max-w-[80%] text-sm">
                   Halo kak, untuk tanggal 15 Desember apakah slot pagi masih tersedia untuk paket Graduation?
                 </div>
              </div>
              
              <div className="flex justify-start">
                 <div className="bg-white border border-glamea-secondary rounded-2xl rounded-tl-sm p-3 max-w-[80%] text-sm shadow-sm text-glamea-text">
                   Iya kak, untuk tanggal segitu masih kosong. Mau booking paket yang mana?
                 </div>
              </div>
           </div>
           
           <div className="p-4 bg-white border-t border-glamea-secondary mt-auto">
              <div className="flex gap-2">
                 <Input className="flex-1 bg-glamea-background/50 h-11" placeholder="Ketik pesan di sini..." />
                 <Button className="h-11 px-6"><Send className="w-4 h-4 mr-2" /> Kirim</Button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
