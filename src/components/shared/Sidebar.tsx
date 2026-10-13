"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ElementType } from 'react';
import { CheckCircle2, Star, Sparkles, ShieldCheck } from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  href?: string;
  icon: ElementType;
  action?: () => void;
  danger?: boolean;
  badge?: string | number;
}

interface SidebarProps {
  title: string;
  items: SidebarItem[];
  userRole: string;
  userName: string;
  userAvatar?: string;
  isVerified?: boolean;
  rating?: number;
  location?: string;
  theme?: 'default' | 'admin';
}

export function Sidebar({ 
  title, 
  items, 
  userRole, 
  userName,
  userAvatar,
  isVerified,
  rating,
  location,
  theme = 'default'
}: SidebarProps) {
  const pathname = usePathname();
  const isAdmin = theme === 'admin';

  return (
    <aside className={cn(
      "w-64 min-h-screen flex flex-col shrink-0 hidden md:flex sticky top-0 h-screen overflow-y-auto z-20 font-sans",
      isAdmin 
        ? "bg-[#11182D] border-r border-[#1E2538] text-white" 
        : "bg-white border-r border-[#EDE3D9]"
    )}>
      
      {/* Brand Header */}
      <div className={cn(
        "h-20 flex items-center justify-between px-6 shrink-0",
        isAdmin ? "border-b border-[#1E2538]" : "border-b border-[#EDE3D9]"
      )}>
        <Link href="/" className="group flex items-center gap-2">
          <span className={cn(
            "font-serif tracking-tight transition-opacity",
            isAdmin 
              ? "text-xl text-white group-hover:text-slate-200 tracking-wide" 
              : "text-2xl tracking-[0.1em] text-[#641A2B] group-hover:opacity-90"
          )}>
            {title || (isAdmin ? 'GLAMÉA Admin' : 'GLAMÉA')}
          </span>
        </Link>
        <span className={cn(
          "text-[10px] uppercase font-poppins font-semibold px-2 py-0.5 rounded-full tracking-wider",
          isAdmin 
            ? "text-[#93C5FD] bg-[#1E294B] border border-[#3565AE]/40" 
            : "text-[#A67C37] bg-[#FAF4EB] border border-[#C9A45C]/30 tracking-[0.25em]"
        )}>
          {isAdmin ? 'ADMIN' : 'PARTNER'}
        </span>
      </div>

      {/* User Info / Profile Card */}
      <div className={cn(
        "p-4 shrink-0",
        isAdmin 
          ? "border-b border-[#1E2538] bg-[#172033]/80" 
          : "p-5 border-b border-[#EDE3D9] bg-[#FAF6F0]/60"
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            "relative w-11 h-11 rounded-full overflow-hidden shrink-0 shadow-sm flex items-center justify-center font-bold",
            isAdmin 
              ? "border border-[#3565AE]/50 bg-[#1E294B] text-white font-poppins" 
              : "border-2 border-[#C9A45C]/40 bg-[#641A2B]/10 font-serif text-[#641A2B] text-lg"
          )}>
            {userAvatar ? (
              <Image
                src={userAvatar}
                alt={userName}
                fill
                sizes="44px"
                className="object-cover object-center"
              />
            ) : (
              <span>{userName.charAt(0)}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className={cn(
                "font-semibold text-sm truncate font-poppins",
                isAdmin ? "text-white" : "text-[#292321]"
              )}>
                {userName}
              </h4>
              {isVerified && (
                <CheckCircle2 
                  className={cn("w-3.5 h-3.5 shrink-0", isAdmin ? "text-[#4778C7]" : "text-[#C9A45C]")} 
                  aria-label="Terverifikasi" 
                />
              )}
            </div>
            <p className={cn(
              "text-[11px] truncate font-sans",
              isAdmin ? "text-[#94A3B8]" : "text-[#7A6E6A]"
            )}>
              {location ? `${location} • ` : ''}{userRole}
            </p>
            {rating && !isAdmin && (
              <div className="flex items-center gap-1 mt-1 text-[11px] text-[#A67C37] font-medium font-sans">
                <Star className="w-3 h-3 fill-[#C9A45C] text-[#C9A45C]" />
                <span className="font-poppins font-semibold">{rating.toFixed(1)}</span>
                <span className="text-[#A0938E] text-[10px]">(48 ulasan)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const commonClasses = cn(
            "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group font-poppins",
            isAdmin 
              ? isActive
                ? "bg-[#4778C7] hover:bg-[#3565AE] text-white font-semibold shadow-sm"
                : item.danger
                  ? "text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 font-medium"
                  : "text-[#CBD5E1] hover:bg-white/[0.06] hover:text-white font-normal"
              : isActive 
                ? "bg-[#641A2B] text-white shadow-sm shadow-[#641A2B]/20 font-semibold" 
                : item.danger
                  ? "text-rose-700 hover:bg-rose-50 font-medium"
                  : "text-[#4A3E3D] hover:bg-[#FAF4EB] hover:text-[#641A2B] font-medium"
          );

          const content = (
            <>
              <div className="flex items-center gap-3">
                <item.icon 
                  className={cn(
                    "w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-105", 
                    isAdmin
                      ? isActive
                        ? "text-white"
                        : item.danger
                          ? "text-rose-400 group-hover:text-rose-300"
                          : "text-[#94A3B8] group-hover:text-white"
                      : isActive 
                        ? "text-white" 
                        : item.danger 
                          ? "text-rose-600" 
                          : "text-[#8C7A75] group-hover:text-[#641A2B]"
                  )} 
                />
                <span className="text-[13px] tracking-wide">
                  {item.label}
                </span>
              </div>
              {item.badge && (
                <span className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full font-poppins font-semibold",
                  isAdmin
                    ? isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#1E294B] text-[#93C5FD]"
                    : isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#641A2B]/10 text-[#641A2B]"
                )}>
                  {item.badge}
                </span>
              )}
            </>
          );

          return item.href ? (
            <Link key={item.id} href={item.href} className={commonClasses}>
              {content}
            </Link>
          ) : (
            <button key={item.id} onClick={item.action} className={cn(commonClasses, "w-full text-left")}>
              {content}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className={cn(
        "p-3.5 text-[11px] text-center shrink-0 font-sans",
        isAdmin 
          ? "border-t border-[#1E2538] text-[#64748B] bg-[#11182D]" 
          : "border-t border-[#EDE3D9] text-[#A0938E] bg-[#FAF6F0]/30"
      )}>
        <p className="flex items-center justify-center gap-1.5">
          {isAdmin ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-[#4778C7]" />
              <span>GLAMÉA Admin Control</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3 text-[#C9A45C]" />
              <span>GLAMÉA Pro Verified</span>
            </>
          )}
        </p>
      </div>
      
    </aside>
  );
}
