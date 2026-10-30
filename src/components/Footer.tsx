import { Instagram, Share2 } from 'lucide-react';
import type { ToastData } from './Toast';

interface FooterProps {
  onNotify: (t: Omit<ToastData, 'id'>) => void;
}

export default function Footer({ onNotify }: FooterProps) {
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'MESA — Reservas', text: 'Reservá tu mesa en MESA, Palermo.', url });
      } catch {
        /* el usuario cerró el diálogo */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      onNotify({ title: 'Link copiado', message: 'Ya podés pegarlo donde quieras.' });
    } catch {
      onNotify({ title: 'No pudimos copiar el link', message: url, tone: 'info' });
    }
  };

  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface-dim border-t border-outline-variant/40">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 py-12 md:py-16 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
        <div className="flex flex-col items-center md:items-start gap-2">
          <p className="font-display font-semibold italic text-primary text-3xl tracking-widest">MESA</p>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Honduras 5123, Palermo · Buenos Aires
            <br />© {year} MESA. Todos los derechos reservados.
          </p>
        </div>

        <nav aria-label="Legales" className="flex flex-wrap gap-x-2 justify-center text-sm text-on-surface-variant font-medium">
          {['Privacidad', 'Términos', 'Prensa'].map((l) => (
            <a key={l} href="#inicio" className="min-h-11 px-2 inline-flex items-center hover:text-primary transition-colors">
              {l}
            </a>
          ))}
          <a href="#FAQ" className="min-h-11 px-2 inline-flex items-center hover:text-primary transition-colors">
            Preguntas frecuentes
          </a>
          <a href="#/admin" className="min-h-11 px-2 inline-flex items-center text-on-surface-variant/90 hover:text-primary transition-colors">
            Acceso restaurante
          </a>
        </nav>

        <div className="flex gap-3">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="MESA en Instagram"
            className="w-11 h-11 inline-flex items-center justify-center border border-outline-variant rounded-full text-on-surface-variant hover:text-primary hover:border-primary transition-colors"
          >
            <Instagram size={18} />
          </a>
          <button
            onClick={handleShare}
            aria-label="Compartir MESA"
            className="w-11 h-11 inline-flex items-center justify-center border border-outline-variant rounded-full text-on-surface-variant hover:text-primary hover:border-primary transition-colors"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>
    </footer>
  );
}
