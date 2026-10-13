import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Dialog content */}
      <div 
        className={cn(
          "relative bg-white rounded-xl shadow-lg w-full max-w-md mx-4 overflow-hidden flex flex-col max-h-[90vh]",
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-glamea-secondary">
            <h3 className="font-serif text-lg font-semibold text-glamea-primary">{title}</h3>
            <button 
              onClick={onClose}
              className="p-1 rounded-md text-glamea-text-muted hover:bg-glamea-secondary transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}
        
        {!title && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-md text-glamea-text-muted hover:bg-glamea-secondary transition-colors z-10"
          >
            <X size={20} />
          </button>
        )}
        
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
