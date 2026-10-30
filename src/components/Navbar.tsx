import { useState, useEffect } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { scrollToId } from '../lib/booking';

interface NavbarProps {
  onOpenQuickBook: () => void;
}

const LINKS = [
  { id: 'reservas', label: 'Disponibilidad' },
  { id: 'plano', label: 'Plano' },
  { id: 'zonas', label: 'Ambientes' },
  { id: 'carta', label: 'Carta' },
  { id: 'reservas-dashboard', label: 'Mis reservas' },
  { id: 'contacto', label: 'Contacto' },
];

export default function Navbar({ onOpenQuickBook }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Resalta el link de la sección visible
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActiveId(e.target.id));
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsMobileMenuOpen(false);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [isMobileMenuOpen]);

  const go = (id: string) => {
    setIsMobileMenuOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <nav
        aria-label="Principal"
        className={`fixed top-0 inset-x-0 z-50 h-[4.5rem] transition-colors duration-300 px-5 md:px-12 ${
          isScrolled || isMobileMenuOpen
            ? 'bg-background/95 backdrop-blur-md border-b border-outline-variant/40 shadow-lg'
            : 'bg-background/70 backdrop-blur-sm border-b border-outline-variant/20'
        }`}
      >
        <div className="max-w-7xl h-full mx-auto flex justify-between items-center gap-6">
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              go('inicio');
            }}
            className="font-display text-3xl font-semibold italic text-primary tracking-wider min-h-11 inline-flex items-center"
            aria-label="MESA, ir al inicio"
          >
            MESA
          </a>

          <ul className="hidden lg:flex gap-7 text-xs font-semibold uppercase tracking-[0.18em] items-center">
            {LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(l.id);
                  }}
                  aria-current={activeId === l.id ? 'true' : undefined}
                  className={`min-h-11 inline-flex items-center border-b transition-colors ${
                    activeId === l.id
                      ? 'text-primary border-primary'
                      : 'text-secondary border-transparent hover:text-primary'
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            onClick={onOpenQuickBook}
            className="hidden lg:inline-flex min-h-11 items-center bg-primary text-on-primary hover:bg-primary-container text-xs font-bold uppercase tracking-[0.15em] px-6 rounded-sm shadow-md gold-glow transition-colors"
          >
            Reservar mesa
          </button>

          <button
            onClick={() => setIsMobileMenuOpen((o) => !o)}
            className="lg:hidden w-11 h-11 -mr-2 inline-flex items-center justify-center text-on-background rounded-sm"
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <m.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-[4.5rem] bg-background z-40 lg:hidden overflow-y-auto"
          >
            <ul className="flex flex-col items-center justify-center gap-2 min-h-full py-10 px-6">
              {LINKS.map((l) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(l.id);
                    }}
                    className={`min-h-12 px-4 inline-flex items-center font-serif text-3xl italic ${
                      activeId === l.id ? 'text-primary' : 'text-on-background hover:text-primary'
                    }`}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li className="mt-6">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenQuickBook();
                  }}
                  className="min-h-12 bg-primary text-on-primary font-bold text-sm uppercase tracking-[0.15em] px-8 rounded-sm"
                >
                  Reservar mesa
                </button>
              </li>
            </ul>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
