"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<'beranda' | 'cari-mua' | 'cara-kerja' | ''>('beranda');
  const [userRole, setUserRole] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === '/';

  // Baca status login dari localStorage setiap kali path berubah
  useEffect(() => {
    const role = localStorage.getItem('user_role');
    setUserRole(role);
  }, [pathname]);

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      if (!isHomePage) return;

      const searchEl = document.getElementById('cari-mua-section');
      const caraKerjaEl = document.getElementById('cara-kerja');
      const scrollPos = window.scrollY + 120;

      if (caraKerjaEl && scrollPos >= caraKerjaEl.offsetTop - 100) {
        setActiveSection('cara-kerja');
      } else if (searchEl && scrollPos >= searchEl.offsetTop - 100) {
        setActiveSection('cari-mua');
      } else {
        setActiveSection('beranda');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const handleNavClick = (sectionId: 'beranda' | 'cari-mua' | 'cara-kerja', e: React.MouseEvent) => {
    if (isHomePage) {
      e.preventDefault();
      setIsMobileMenuOpen(false);

      if (sectionId === 'beranda') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveSection('beranda');
      } else {
        const target = document.getElementById(sectionId === 'cari-mua' ? 'cari-mua-section' : 'cara-kerja');
        if (target) {
          const navOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          setActiveSection(sectionId);
        }
      }
    } else {
      setIsMobileMenuOpen(false);
    }
  };

  const isNavActive = (section: 'beranda' | 'cari-mua' | 'cara-kerja') => {
    if (isHomePage) return activeSection === section;
    if (section === 'cari-mua') return pathname === '/cari-mua';
    if (section === 'beranda') return pathname === '/';
    return false;
  };

  const isClientLoggedIn = userRole === 'CLIENT';

  return (
    <header
      className={cn(
        "sticky top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-[#FAF6F0]/95 backdrop-blur-md shadow-sm border-b border-[#EDE3D9]"
          : "bg-[#FAF6F0]/80 backdrop-blur-sm border-b border-[#EDE3D9]/60"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          {/* Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              href={isClientLoggedIn ? "/profil" : "/"}
              onClick={(e) => !isClientLoggedIn && isHomePage && handleNavClick('beranda', e)}
              className="group flex items-center gap-2"
            >
              <span className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-[#641A2B] transition-colors group-hover:text-[#4E1321]">
                GLAMÉA
              </span>
            </Link>
          </div>

          {/* Nav & Buttons: hanya tampil saat TAMU (belum login) */}
          {!isClientLoggedIn && (
            <>
              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center space-x-8 font-poppins">
                <Link
                  href="/#beranda"
                  onClick={(e) => handleNavClick('beranda', e)}
                  className={cn(
                    "relative py-2 text-sm font-medium transition-colors hover:text-[#641A2B]",
                    isNavActive('beranda')
                      ? "text-[#641A2B] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#641A2B] after:rounded-full"
                      : "text-[#746A67]"
                  )}
                >
                  Beranda
                </Link>

                <Link
                  href={isHomePage ? "/#cari-mua-section" : "/cari-mua"}
                  onClick={(e) => isHomePage && handleNavClick('cari-mua', e)}
                  className={cn(
                    "relative py-2 text-sm font-medium transition-colors hover:text-[#641A2B]",
                    isNavActive('cari-mua')
                      ? "text-[#641A2B] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#641A2B] after:rounded-full"
                      : "text-[#746A67]"
                  )}
                >
                  Cari MUA
                </Link>

                <Link
                  href="/#cara-kerja"
                  onClick={(e) => handleNavClick('cara-kerja', e)}
                  className={cn(
                    "relative py-2 text-sm font-medium transition-colors hover:text-[#641A2B]",
                    isNavActive('cara-kerja')
                      ? "text-[#641A2B] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#641A2B] after:rounded-full"
                      : "text-[#746A67]"
                  )}
                >
                  Cara Kerja
                </Link>
              </nav>

              {/* Desktop Buttons */}
              <div className="hidden md:flex items-center space-x-3">
                <Link href="/masuk">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#292321] hover:text-[#641A2B] hover:bg-[#EDE3D9]/50 font-medium px-4 h-10 transition-colors"
                  >
                    Masuk
                  </Button>
                </Link>
                <Link href="/daftar">
                  <Button
                    size="sm"
                    className="bg-[#641A2B] hover:bg-[#4E1321] text-white font-medium px-5 h-10 rounded-lg shadow-sm hover:shadow transition-all"
                  >
                    Daftar
                  </Button>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <div className="flex items-center md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-lg text-[#641A2B] hover:bg-[#EDE3D9]/60 focus:outline-none transition-colors"
                  aria-label={isMobileMenuOpen ? "Tutup menu" : "Buka menu navigasi"}
                  aria-expanded={isMobileMenuOpen}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </div>
            </>
          )}

        </div>
      </div>

      {/* Mobile Drawer — hanya untuk tamu */}
      {isMobileMenuOpen && !isClientLoggedIn && (
        <div className="md:hidden bg-[#FAF6F0] border-b border-[#EDE3D9] shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-3 pb-4 space-y-2 font-poppins">
            <Link
              href="/#beranda"
              onClick={(e) => handleNavClick('beranda', e)}
              className={cn(
                "block px-3 py-2.5 rounded-lg text-base font-medium transition-colors",
                isNavActive('beranda')
                  ? "bg-[#641A2B]/10 text-[#641A2B] font-semibold border-l-4 border-[#641A2B]"
                  : "text-[#292321] hover:bg-[#EDE3D9]/50"
              )}
            >
              Beranda
            </Link>
            <Link
              href={isHomePage ? "/#cari-mua-section" : "/cari-mua"}
              onClick={(e) => isHomePage && handleNavClick('cari-mua', e)}
              className={cn(
                "block px-3 py-2.5 rounded-lg text-base font-medium transition-colors",
                isNavActive('cari-mua')
                  ? "bg-[#641A2B]/10 text-[#641A2B] font-semibold border-l-4 border-[#641A2B]"
                  : "text-[#292321] hover:bg-[#EDE3D9]/50"
              )}
            >
              Cari MUA
            </Link>
            <Link
              href="/#cara-kerja"
              onClick={(e) => handleNavClick('cara-kerja', e)}
              className={cn(
                "block px-3 py-2.5 rounded-lg text-base font-medium transition-colors",
                isNavActive('cara-kerja')
                  ? "bg-[#641A2B]/10 text-[#641A2B] font-semibold border-l-4 border-[#641A2B]"
                  : "text-[#292321] hover:bg-[#EDE3D9]/50"
              )}
            >
              Cara Kerja
            </Link>
          </div>
          <div className="pt-3 pb-5 px-4 border-t border-[#EDE3D9] flex flex-col space-y-2.5">
            <Link href="/masuk" onClick={() => setIsMobileMenuOpen(false)}>
              <Button
                variant="outline"
                className="w-full border-[#EDE3D9] text-[#292321] hover:bg-[#EDE3D9]/40 hover:text-[#641A2B] h-11"
              >
                Masuk
              </Button>
            </Link>
            <Link href="/daftar" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full bg-[#641A2B] hover:bg-[#4E1321] text-white h-11">
                Daftar
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
