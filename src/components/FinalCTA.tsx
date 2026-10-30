import { Calendar } from 'lucide-react';
import Reveal from './Reveal';
import { scrollToId } from '../lib/booking';

export default function FinalCTA() {
  return (
    <section aria-labelledby="cta-title" className="py-16 md:py-24 px-5 sm:px-6 md:px-12 bg-background">
      <Reveal className="max-w-6xl mx-auto bg-primary-container px-6 py-12 sm:p-12 md:p-16 text-center rounded-md shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 paper-texture opacity-40 mix-blend-multiply pointer-events-none" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-primary/40 pointer-events-none" aria-hidden="true" />

        <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
          <div className="inline-flex p-3 border border-on-primary/30 rounded-full text-on-primary" aria-hidden="true">
            <Calendar size={24} />
          </div>

          <h2 id="cta-title" className="font-display text-3xl sm:text-4xl md:text-5xl text-on-primary font-semibold italic leading-tight">
            Reservá tu próxima experiencia gastronómica
          </h2>

          <p className="text-on-primary/90 text-base md:text-lg leading-relaxed">
            Los lugares por turno son limitados. Asegurá tu mesa ahora y disfrutá de una noche pensada para vos.
          </p>

          <div className="pt-2">
            <button
              onClick={() => scrollToId('quick-book-form', 'center')}
              className="min-h-12 bg-background text-primary hover:bg-surface-container-low border border-background text-xs font-bold uppercase tracking-[0.2em] px-10 py-4 rounded-sm shadow-xl transition-colors"
            >
              Reservar ahora
            </button>
          </div>
        </div>

        {['top-4 left-4 border-t-2 border-l-2', 'top-4 right-4 border-t-2 border-r-2', 'bottom-4 left-4 border-b-2 border-l-2', 'bottom-4 right-4 border-b-2 border-r-2'].map((pos) => (
          <div key={pos} className={`absolute w-6 h-6 border-on-primary/40 pointer-events-none ${pos}`} aria-hidden="true" />
        ))}
      </Reveal>
    </section>
  );
}
