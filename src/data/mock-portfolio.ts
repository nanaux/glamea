export interface PortfolioItem {
  id: string;
  title: string;
  category: 'Bridal & Baralek' | 'Wisuda & Graduation' | 'Lamaran & Engagement' | 'Editorial & Pesta';
  imageUrl: string;
  description: string;
  technique: string;
  keyProducts: string[];
  linkedService: {
    name: string;
    price: number;
  };
  viewsCount: number;
  savesCount: number;
  isPinned: boolean;
  publishedDate: string;
}

export const initialPortfolioItems: PortfolioItem[] = [
  {
    id: 'port-1',
    title: 'Suntiang Gadang Minang',
    category: 'Bridal & Baralek',
    imageUrl: '/images/suntiang-gadang.jpeg',
    description: 'Tampil memukau dalam balutan adat Minang dengan suntiang keemasan yang megah, detail perhiasan nan anggun, dan riasan flawless yang memancarkan pesona bak ratu sehari.',
    technique: 'Velvet Matte Finish, Soft Cut Crease, 3D Dimension Suntiang Framing',
    keyProducts: [
      'Make Over Powerstay 24H Weightless Liquid Foundation',
      'Mother of Pearl (MOP) Cover Concealer',
      'Dior Forever Velvet Matte Foundation',
      'Huda Beauty Rose Quartz Palette',
      'Somethinc Checkmatte Transferproof Lipstick'
    ],
    linkedService: {
      name: 'Paket Baralek Gadang Premium',
      price: 3500000
    },
    viewsCount: 1840,
    savesCount: 242,
    isPinned: true,
    publishedDate: '12 Okt 2026'
  },
  {
    id: 'port-2',
    title: 'Korean Glass Skin Graduation',
    category: 'Wisuda & Graduation',
    imageUrl: '/images/korean-soft-glam.jpeg',
    description: 'Tampilan wisuda segar dan memikat dengan efek dewy glass skin yang natural, tahan terhadap terik cuaca kota Padang, dan perpaduan gradasi ombre tint peach yang awet muda.',
    technique: 'Luminous Glass Complexion, Feathered Brows, Aegyo-sal Highlight',
    keyProducts: [
      'Somethinc Copy Paste Breathable Mesh Cushion',
      'Rare Beauty Soft Pinch Liquid Blush (Hope)',
      'Rosé All Day Plush Lip Tint #Opera Night',
      'Luxcrime Blur & Cover Two Way Cake',
      'Fenty Beauty Diamond Bomb Highlighter'
    ],
    linkedService: {
      name: 'Paket Wisuda & Sumpah Dokter',
      price: 650000
    },
    viewsCount: 1290,
    savesCount: 184,
    isPinned: true,
    publishedDate: '12 Okt 2026'
  },
  {
    id: 'port-3',
    title: 'Warm Rose Gold Engagement',
    category: 'Lamaran & Engagement',
    imageUrl: '/images/warm-gold.jpeg',
    description: 'Harmonisasi warna rose gold lembut dan warm bronze untuk prosesi lamaran intimate. Memancarkan keanggunan alami tanpa kesan berlebihan di hadapan keluarga besar.',
    technique: 'Soft Glam Radiance, Blended Wing Liner, Nude Satin Lip',
    keyProducts: [
      'Studio Tropik Balance Priming Water',
      'Estée Lauder Double Wear Stay-in-Place',
      'BLP Beauty Face Glow #Sunset and Sunrise',
      'Mother of Pearl (MOP) AM to PM Colorfast Lip Tint',
      'Charlotte Tilbury Luxury Palette Pillow Talk'
    ],
    linkedService: {
      name: 'Paket Lamaran & Tunangan Elegan',
      price: 950000
    },
    viewsCount: 980,
    savesCount: 132,
    isPinned: true,
    publishedDate: '10 Okt 2026'
  },
  {
    id: 'port-4',
    title: 'Sunset Bronze Arabian Glam',
    category: 'Editorial & Pesta',
    imageUrl: '/images/arabian-makeup.jpeg',
    description: 'Riasan mata dramatis dengan perpaduan smokey cut-crease tembaga hangat dan terra-cotta, disempurnakan dengan contouring berdefinisi tinggi untuk resepsi pesta malam hari.',
    technique: 'Dramatic Arabian Cut Crease, Sculpted Cheeks, Overlined Nude Lip',
    keyProducts: [
      'Make Over Powerstay Eye Palette #Uptown Bae',
      'Anastasia Beverly Hills Soft Glam Palette',
      'Somethinc Forever Stay Waterproof Liquid Eyeliner',
      'Luxcrime Ultra Creamy Lip Velvet #Pearl Milk',
      'Studio Tropik DreamSetter Setting Spray'
    ],
    linkedService: {
      name: 'Paket Pesta & Evening Glamour',
      price: 850000
    },
    viewsCount: 740,
    savesCount: 88,
    isPinned: false,
    publishedDate: '08 Okt 2026'
  },
  {
    id: 'port-5',
    title: 'Classic Minang Akad',
    category: 'Bridal & Baralek',
    imageUrl: '/images/classic-minang.jpeg',
    description: 'Tampilan pengantin Minang yang elegan dengan sentuhan silver berkilau dan riasan glamor yang memikat. Complexion semi-matte dengan rona pipi coral peach memancarkan aura pengantin yang khidmat.',
    technique: 'Flawless Poreless Complexion, Semi-Matte Velvet, Soft Defined Eyes',
    keyProducts: [
      'Mother of Pearl (MOP) So X-Tra Peptight Foundation',
      'Make Over Silky Smooth Translucent Powder',
      'Dior Backstage Rosy Glow Blush',
      'Rosé All Day Lip Mousse Record #Grovvy Brown',
      'Shu Uemura Hard Formula Eyebrow Pencil'
    ],
    linkedService: {
      name: 'Paket Akad Nikah Intimate',
      price: 2200000
    },
    viewsCount: 1120,
    savesCount: 156,
    isPinned: true,
    publishedDate: '05 Okt 2026'
  },
  {
    id: 'port-6',
    title: 'Prewedding Outdoor Sunset Glow',
    category: 'Editorial & Pesta',
    imageUrl: '/images/prewedding-outdoor.jpeg',
    description: 'Pesona anggun dalam balutan hijab silver, riasan mata yang memikat, dan kilauan mahkota mewah untuk tampilan prewedding yang elegan dan berkelas.',
    technique: 'Sweatproof Airbrush Finish, Bronzed Glow, Hydrated Glossy Lips',
    keyProducts: [
      'Somethinc Hooman Breathable UV Cushion SPF 35',
      'BLP Beauty Butter Fudge Lip Coat',
      'Rare Beauty Warm Wishes Bronzer Stick',
      'Studio Tropik DreamSetter Glowy Setting Spray',
      'NARS Radiant Creamy Concealer'
    ],
    linkedService: {
      name: 'Paket Sesi Prewedding Outdoor',
      price: 1200000
    },
    viewsCount: 890,
    savesCount: 110,
    isPinned: false,
    publishedDate: '02 Okt 2026'
  }
];
