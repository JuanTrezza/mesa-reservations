import React from 'react';
import { Globe, Share2, HelpCircle } from 'lucide-react';

export default function Footer() {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'MESA | Experiencia Gastronómica Exclusiva',
        text: '¡Reserva una mesa de lujo en MESA!',
        url: window.location.href,
      }).catch(err => console.log(err));
    } else {
      alert('Enlace copiado al portapapeles: ' + window.location.href);
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <footer className="w-full py-16 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8 bg-surface-dim border-t border-outline-variant/15 text-center md:text-left">
      {/* Brand logo & Copy */}
      <div className="flex flex-col items-center md:items-start gap-2">
        <div className="font-display font-semibold italic text-primary text-2xl tracking-widest">
          MESA
        </div>
        <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
          &copy; 2026 MESA. Experiencia Gastronómica Exclusiva. <br />
          Todos los derechos reservados.
        </p>
      </div>

      {/* Corporate Links */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center font-sans text-xs text-on-surface-variant font-semibold">
        <a href="#inicio" className="hover:text-primary transition-colors">Privacidad</a>
        <a href="#inicio" className="hover:text-primary transition-colors">Términos</a>
        <a href="#inicio" className="hover:text-primary transition-colors">Sostenibilidad</a>
        <a href="#inicio" className="hover:text-primary transition-colors">Prensa</a>
        <a href="#FAQ" className="hover:text-primary transition-colors">Preguntas</a>
      </div>

      {/* Share / Lang Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => alert('Idioma establecido en Español (Castellano).')}
          className="p-2 border border-outline-variant/20 rounded-full text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors cursor-pointer"
          title="Cambiar idioma"
        >
          <Globe size={16} />
        </button>
        <button
          onClick={handleShare}
          className="p-2 border border-outline-variant/20 rounded-full text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors cursor-pointer"
          title="Compartir Restaurante"
        >
          <Share2 size={16} />
        </button>
      </div>
    </footer>
  );
}
