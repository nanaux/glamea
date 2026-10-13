/**
 * Formats a number to Indonesian Rupiah currency string.
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculates discount and total.
 * Applies 10% discount if isFirstBooking is true.
 */
export function calculatePricing(subtotal: number, isFirstBooking: boolean) {
  const discountRate = isFirstBooking ? 0.10 : 0;
  const discount = subtotal * discountRate;
  const total = subtotal - discount;

  return {
    subtotal,
    discount,
    total
  };
}

/**
 * Generic cn utility typically built with clsx and tailwind-merge
 */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
