import { MuaProfile, MuaAggregatedData } from '../types';

export const mockMuas: MuaProfile[] = [
  {
    id: 'mua-1',
    name: 'Alya Makeup',
    email: 'alya@glamea.test',
    phone: '081234567890',
    role: 'MUA',
    createdAt: '2026-10-12T00:00:00Z',
    location: 'Kuranji',
    bio: 'Professional Makeup Artist spesialis Wedding dan Baralek dengan pengalaman lebih dari 5 tahun.',
    makeupStyles: ['Korean Look', 'Flawless', 'Bold', 'Traditional'],
    portfolioImage: '/images/mua-alya.png',
    isVerified: true,
    bankAccount: {
      bankName: 'BCA',
      accountNumber: '1234567890',
      accountHolder: 'Alya Putri'
    }
  },
  {
    id: 'mua-2',
    name: 'Nadira Beauty',
    email: 'nadira@glamea.test',
    phone: '081298765432',
    role: 'MUA',
    createdAt: '2026-10-12T00:00:00Z',
    location: 'Padang Barat',
    bio: 'MUA Certified. Melayani makeup wisuda, lamaran, dan pesta dengan hasil yang tahan lama.',
    makeupStyles: ['Soft Glam', 'Natural', 'Flawless'],
    portfolioImage: '/images/mua-nadira.png',
    isVerified: true,
    bankAccount: {
      bankName: 'Mandiri',
      accountNumber: '0987654321',
      accountHolder: 'Nadira Maharani'
    }
  },
  {
    id: 'mua-3',
    name: 'Citra MUA',
    email: 'citra@glamea.test',
    phone: '085311223344',
    role: 'MUA',
    createdAt: '2026-10-12T00:00:00Z',
    location: 'Koto Tangah',
    bio: 'Menjadikan hari spesialmu lebih berkesan dengan riasan yang elegan.',
    makeupStyles: ['Arabic Look', 'Bold Glam', 'Traditional'],
    portfolioImage: '/images/mua-citra.png',
    isVerified: false,
    bankAccount: {
      bankName: 'BNI',
      accountNumber: '1122334455',
      accountHolder: 'Citra Lestari'
    }
  },
  {
    id: 'mua-4',
    name: 'Bella Makeupart',
    email: 'bella@glamea.test',
    phone: '081399887766',
    role: 'MUA',
    createdAt: '2026-10-12T00:00:00Z',
    location: 'Padang Timur',
    bio: 'Spesialis makeup photoshoot dan editorial. Tersedia untuk luar kota.',
    makeupStyles: ['Editorial', 'Creative', 'Soft Glam'],
    portfolioImage: '/images/mua-bella.png',
    isVerified: true,
    bankAccount: {
      bankName: 'BRI',
      accountNumber: '9988776655',
      accountHolder: 'Bella Saphira'
    }
  },
  {
    id: 'mua-5',
    name: 'Dina Aesthetics',
    email: 'dina@glamea.test',
    phone: '087766554433',
    role: 'MUA',
    createdAt: '2026-10-12T00:00:00Z',
    location: 'Pauh',
    bio: 'Minimalist and clean beauty makeup.',
    makeupStyles: ['Clean Beauty', 'Natural', 'Korean Look'],
    portfolioImage: '/images/mua-nadira.png',
    isVerified: false,
  },
  {
    id: 'mua-6',
    name: 'Eka Glam',
    email: 'eka@glamea.test',
    phone: '082233445566',
    role: 'MUA',
    createdAt: '2026-10-12T00:00:00Z',
    location: 'Lubuk Begalung',
    bio: 'Pilihan terbaik untuk wedding dan prewedding di Padang.',
    makeupStyles: ['Wedding', 'Prewedding', 'Bold'],
    portfolioImage: '/images/mua-citra.png',
    isVerified: true,
  },
  {
    id: 'mua-7',
    name: 'Viona Bridal',
    email: 'viona@glamea.test',
    phone: '089988776655',
    role: 'MUA',
    createdAt: '2026-10-12T00:00:00Z',
    location: 'Nanggalo',
    bio: 'Spesialis gaun pengantin dan makeup komprehensif.',
    makeupStyles: ['Bridal', 'Flawless'],
    portfolioImage: '/images/mua-alya.png',
    isVerified: true,
  },
  {
    id: 'mua-8',
    name: 'Mawar Sari Makeup',
    email: 'mawar@glamea.test',
    phone: '085544332211',
    role: 'MUA',
    createdAt: '2026-10-12T00:00:00Z',
    location: 'Lubuk Kilangan',
    bio: 'Menonjolkan kecantikan alami Anda.',
    makeupStyles: ['Natural', 'Flawless'],
    portfolioImage: '/images/mua-bella.png',
    isVerified: false,
  },
];

// Mock aggregated data for MUAs
export const mockMuaAggregates: Record<string, MuaAggregatedData> = {
  'mua-1': { rating: 4.9, reviewCount: 120, startingPrice: 250000 },
  'mua-2': { rating: 4.8, reviewCount: 85, startingPrice: 350000 },
  'mua-3': { rating: 4.7, reviewCount: 45, startingPrice: 300000 },
  'mua-4': { rating: 4.9, reviewCount: 92, startingPrice: 400000 },
  'mua-5': { rating: 4.6, reviewCount: 30, startingPrice: 200000 },
  'mua-6': { rating: 4.8, reviewCount: 110, startingPrice: 500000 },
  'mua-7': { rating: 5.0, reviewCount: 200, startingPrice: 750000 },
  'mua-8': { rating: 4.5, reviewCount: 15, startingPrice: 200000 },
};
