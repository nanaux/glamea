export type UserRole = 'CLIENT' | 'MUA' | 'ADMIN';

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
}

export interface Client extends BaseUser {
  role: 'CLIENT';
}

export interface MuaProfile extends BaseUser {
  role: 'MUA';
  location: string;
  bio: string;
  makeupStyles: string[];
  isVerified: boolean;
  portfolioImage?: string;
  avatarUrl?: string;
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
}

export interface MuaAggregatedData {
  rating: number;
  reviewCount: number;
  startingPrice: number;
}

export interface Admin extends BaseUser {
  role: 'ADMIN';
}

export interface Service {
  id: string;
  muaId: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  category: 'Wedding' | 'Baralek' | 'Engagement' | 'Graduation' | 'Party' | 'Photoshoot';
}

export interface PortfolioItem {
  id: string;
  muaId: string;
  imageUrl: string;
  title: string;
  makeupStyle: string;
  description: string;
}

export interface Review {
  id: string;
  muaId: string;
  clientId: string;
  clientName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Success' | 'Failed';
export type FundStatus = 'Held' | 'PendingPayout' | 'PaidOut' | 'None';

export interface Booking {
  id: string;
  clientId: string;
  muaId: string;
  serviceId: string;
  occasion: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  location: string;
  numberOfPeople: number;
  notes: string;
  
  subtotal: number;
  discount: number;
  total: number;
  
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  fundStatus: FundStatus; // derived/sync with payoutStatus conceptually, but tracked per booking
  payoutId?: string; // link to payout if it exists
  
  createdAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  method: 'Transfer Bank' | 'Virtual Account' | 'E-Wallet';
  status: PaymentStatus;
  createdAt: string;
}

export type PayoutStatus = 'Menunggu Pencairan' | 'Diproses' | 'Dicairkan' | 'Gagal Dicairkan';

export interface Payout {
  id: string;
  bookingId: string;
  muaId: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  status: PayoutStatus;
  processedAt?: string;
  createdAt: string;
}
