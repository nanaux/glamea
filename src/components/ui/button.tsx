import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glamea-accent disabled:pointer-events-none disabled:opacity-50';
    
    const variants = {
      primary: 'bg-glamea-primary text-white hover:bg-glamea-primary-hover',
      secondary: 'bg-glamea-secondary text-glamea-primary hover:bg-glamea-secondary-hover',
      accent: 'bg-glamea-accent text-white hover:bg-glamea-accent-hover',
      outline: 'border-2 border-glamea-primary text-glamea-primary hover:bg-glamea-secondary',
      ghost: 'hover:bg-glamea-secondary/50 text-glamea-text',
      danger: 'bg-glamea-danger text-white hover:bg-glamea-danger/90',
    };

    const sizes = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-11 px-4 py-2',
      lg: 'h-14 px-8 text-lg',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
