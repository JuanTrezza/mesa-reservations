import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenQuickBook: () => void;
}

export default function Navbar({ onOpenQuickBook }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 md:px-12 ${
          isScrolled
            ? 'bg-background/95 backdrop-blur-md border-b border-outline-variant/30 shadow-lg'
            : 'bg-background/80 backdrop-blur-sm border-b border-outline-variant/15'
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div
            onClick={() => scrollToSection('inicio')}
            className="font-display text-3xl font-semibold italic text-primary cursor-pointer tracking-wider hover:opacity-90 active:scale-95 transition-all"
            id="logo-mesa"
          >
            MESA
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex gap-8 font-sans text-xs font-semibold uppercase tracking-[0.2em] items-center">
            <button
              onClick={() => scrollToSection('inicio')}
              className="text-primary border-b border-primary/80 pb-0.5 cursor-pointer hover:text-primary-container transition-colors"
            >
              Inicio
            </button>
            <button
              onClick={() => scrollToSection('zonas')}
              className="text-secondary hover:text-primary transition-colors cursor-pointer"
            >
              Ambientes
            </button>
            <button
              onClick={() => scrollToSection('carta')}
              className="text-secondary hover:text-primary transition-colors cursor-pointer"
            >
              Carta
            </button>
            <button
              onClick={() => scrollToSection('reservas')}
              className="text-secondary hover:text-primary transition-colors cursor-pointer"
            >
              Reservas
            </button>
            <button
              onClick={() => scrollToSection('FAQ')}
              className="text-secondary hover:text-primary transition-colors cursor-pointer"
            >
              Nosotros
            </button>
            <button
              onClick={() => scrollToSection('contacto')}
              className="text-secondary hover:text-primary transition-colors cursor-pointer"
            >
              Contacto
            </button>
          </div>

          {/* Booking / Action Button */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onOpenQuickBook}
              className="bg-primary-container text-on-primary hover:bg-primary font-sans text-xs font-bold uppercase tracking-[0.15em] px-6 py-3 rounded-sm shadow-md gold-glow transition-all active:scale-95 cursor-pointer"
            >
              Reservar Mesa
            </button>
          </div>

          {/* Mobile Menu toggle button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-on-background focus:outline-none p-1 cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-background/98 z-40 md:hidden flex flex-col justify-center items-center gap-8 animate-fadeIn">
          {/* Close button inside overlay */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-6 right-6 text-on-background cursor-pointer"
          >
            <X size={28} />
          </button>

          <span className="font-display text-4xl italic text-primary mb-2">MESA</span>
          
          <button
            onClick={() => scrollToSection('inicio')}
            className="text-lg font-medium text-on-background hover:text-primary tracking-widest uppercase"
          >
            Inicio
          </button>
          <button
            onClick={() => scrollToSection('zonas')}
            className="text-lg font-medium text-on-background hover:text-primary tracking-widest uppercase"
          >
            Ambientes
          </button>
          <button
            onClick={() => scrollToSection('carta')}
            className="text-lg font-medium text-on-background hover:text-primary tracking-widest uppercase"
          >
            Carta
          </button>
          <button
            onClick={() => scrollToSection('reservas')}
            className="text-lg font-medium text-on-background hover:text-primary tracking-widest uppercase"
          >
            Reservas
          </button>
          <button
            onClick={() => scrollToSection('FAQ')}
            className="text-lg font-medium text-on-background hover:text-primary tracking-widest uppercase"
          >
            Nosotros / FAQ
          </button>
          <button
            onClick={() => scrollToSection('contacto')}
            className="text-lg font-medium text-on-background hover:text-primary tracking-widest uppercase"
          >
            Contacto
          </button>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenQuickBook();
            }}
            className="bg-primary text-on-primary font-sans font-bold uppercase tracking-[0.1em] px-8 py-4 rounded-sm mt-4 cursor-pointer"
          >
            Reservar Mesa
          </button>
        </div>
      )}
    </>
  );
}
