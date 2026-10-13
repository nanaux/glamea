import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  let variant: 'default' | 'secondary' | 'outline' | 'success' | 'danger' | 'warning' = 'default';
  
  switch (status.toLowerCase()) {
    case 'success':
    case 'completed':
    case 'pembayaran berhasil':
    case 'dikonfirmasi':
    case 'selesai':
    case 'dicairkan':
      variant = 'success';
      break;
    case 'pending':
    case 'menunggu pembayaran':
    case 'menunggu konfirmasi':
    case 'menunggu pencairan':
    case 'diproses':
      variant = 'warning';
      break;
    case 'failed':
    case 'cancelled':
    case 'dibatalkan':
    case 'gagal dicairkan':
    case 'pembayaran gagal':
      variant = 'danger';
      break;
    case 'held':
    case 'dana ditahan':
      variant = 'secondary';
      break;
    default:
      variant = 'default';
  }

  // translate to Indonesian if still in English for demo purposes
  const labelMap: Record<string, string> = {
    'Pending': 'Menunggu',
    'Confirmed': 'Dikonfirmasi',
    'Completed': 'Selesai',
    'Cancelled': 'Dibatalkan',
    'Success': 'Berhasil',
    'Failed': 'Gagal',
    'Held': 'Dana Ditahan',
    'None': 'Belum Ada',
    'PendingPayout': 'Menunggu Pencairan',
    'PaidOut': 'Dicairkan',
  };

  const label = labelMap[status] || status;

  return <Badge variant={variant}>{label}</Badge>;
}
