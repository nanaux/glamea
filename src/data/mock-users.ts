import { Client, Admin } from '../types';

export const mockClients: Client[] = [
  {
    id: 'client-1',
    name: 'Siti Aminah',
    email: 'client@glamea.test',
    phone: '081122223333',
    role: 'CLIENT',
    createdAt: '2026-10-12T00:00:00Z',
  },
  {
    id: 'client-2',
    name: 'Rina Permatasari',
    email: 'rina@glamea.test',
    phone: '085566667777',
    role: 'CLIENT',
    createdAt: '2026-10-12T00:00:00Z',
  },
  {
    id: 'client-3',
    name: 'Dinda Maharani',
    email: 'dinda@glamea.test',
    phone: '081399881122',
    role: 'CLIENT',
    createdAt: '2026-10-12T00:00:00Z',
  },
  {
    id: 'client-4',
    name: 'Rahma Fadilah',
    email: 'rahma@glamea.test',
    phone: '082177334455',
    role: 'CLIENT',
    createdAt: '2026-10-12T00:00:00Z',
  },
  {
    id: 'client-5',
    name: 'Annisa Zahra',
    email: 'annisa@glamea.test',
    phone: '081266554433',
    role: 'CLIENT',
    createdAt: '2026-10-12T00:00:00Z',
  }
];

export const mockAdmins: Admin[] = [
  {
    id: 'admin-1',
    name: 'Super Admin',
    email: 'admin@glamea.test',
    phone: '080000000000',
    role: 'ADMIN',
    createdAt: '2026-10-12T00:00:00Z',
  }
];
