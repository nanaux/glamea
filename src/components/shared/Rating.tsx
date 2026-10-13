import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
  rating: number;
  max?: number;
  className?: string;
  iconClassName?: string;
}

export function Rating({ rating, max = 5, className, iconClassName }: RatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center space-x-0.5", className)}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className={cn("w-4 h-4 fill-amber-400 text-amber-400", iconClassName)} />
      ))}
      {hasHalfStar && (
        <div className="relative">
          <Star className={cn("w-4 h-4 text-amber-400", iconClassName)} />
          <StarHalf className={cn("w-4 h-4 fill-amber-400 text-amber-400 absolute top-0 left-0", iconClassName)} />
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className={cn("w-4 h-4 text-gray-300", iconClassName)} />
      ))}
    </div>
  );
}
