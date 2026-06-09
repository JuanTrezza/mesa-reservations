import React from 'react';
import { Calendar } from 'lucide-react';

export default function FinalCTA() {
  const handleScrollToBooking = () => {
    const el = document.getElementById('quick-book-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section className="py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto bg-primary-container p-10 md:p-16 text-center rounded-sm shadow-2xl relative overflow-hidden group">
        
        {/* Subtle physical texture backing */}
        <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-container via-[#f2ca50] to-primary-container opacity-40 mix-blend-color-dodge"></div>

        <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
          <div className="inline-flex p-2 bg-background/10 border border-background/25 rounded-full text-on-primary">
            <Calendar size={24} />
          </div>
          
          <h2 className="font-display text-3xl md:text-5xl text-on-primary font-bold italic tracking-tight">
            Reservá tu próxima experiencia gastronómica
          </h2>
          
          <p className="text-on-primary/80 font-sans text-sm md:text-base leading-relaxed">
            Plazas limitadas para cada turno de cena. Asegure su mesa de forma inmediata y disfrute de los sabores más nobles creados exclusivamente para usted.
          </p>

          <div className="pt-4">
            <button
              onClick={handleScrollToBooking}
              className="bg-[#16130b] text-[#f2ca50] hover:bg-neutral-900 border border-[#f2ca50]/15 hover:border-[#f2ca50] font-sans text-xs font-bold uppercase tracking-[0.2em] px-10 py-5 rounded-sm shadow-xl transition-all duration-300 transform active:scale-95 hover:scale-105 cursor-pointer"
            >
              Confirmar reserva ahora
            </button>
          </div>
        </div>

        {/* Decorative corner borders */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-on-primary/30 pointer-events-none"></div>
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-on-primary/30 pointer-events-none"></div>
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-on-primary/30 pointer-events-none"></div>
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-on-primary/30 pointer-events-none"></div>
      </div>
    </section>
  );
}
