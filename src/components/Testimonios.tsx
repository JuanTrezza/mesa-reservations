import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';
import { Review } from '../types';

export default function Testimonios() {
  const reviews: Review[] = [
    {
      id: 'rev-1',
      author: 'Elena R.',
      text: '"La mejor burrata que he probado en mi vida. El servicio es verdaderamente impecable, atento a cada detalle mínimo, y la hermosa atmósfera de la casona te transporta por completo."',
      rating: 5,
      verified: true
    },
    {
      id: 'rev-2',
      author: 'Marco V.',
      text: '"Un rotundo oasis de tranquilidad en medio de la ciudad. El risotto de setas es una auténtica obra maestra de técnica culinaria. Altamente recomendado para veladas de prestigio."',
      rating: 5,
      verified: true
    },
    {
      id: 'rev-3',
      author: 'Sofía G.',
      text: '"La espectacular terraza de cristal al atardecer ofrece una experiencia inigualable. El maridaje sugerido por el sumiller con la carne de buey fue sencillamente soberbio."',
      rating: 5,
      verified: true
    }
  ];

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto text-center border-t border-outline-variant/15">
      <div className="space-y-2 mb-16">
        <span className="text-primary font-sans text-xs font-bold uppercase tracking-[0.25em] block">
          Opiniones del Comensal
        </span>
        <h2 className="font-serif text-3xl md:text-5xl italic text-on-surface">
          Voces de nuestros invitados
        </h2>
        <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
          La satisfacción de quienes nos visitan es nuestro mayor galardón. Descubra sus vivencias sensoriales.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-6 md:p-8 bg-surface-container rounded-sm border border-outline-variant/15 relative overflow-hidden group hover:border-[#d4af37]/40 transition-all duration-300 flex flex-col justify-between text-left"
          >
            {/* Top row: Star and verification check */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-1 text-primary">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} size={14} className="fill-primary" />
                ))}
              </div>

              {rev.verified && (
                <span className="inline-flex items-center gap-1 text-primary text-[10px] font-sans font-bold uppercase tracking-widest bg-[#d4af37]/5 px-2.5 py-1 border border-[#d4af37]/15 rounded-full">
                  <ShieldCheck size={12} /> Verificado ✓
                </span>
              )}
            </div>

            {/* Testimonial Quote */}
            <p className="text-on-surface-variant text-sm font-serif italic leading-relaxed mb-8 select-none">
              {rev.text}
            </p>

            {/* Author */}
            <div className="border-t border-outline-variant/10 pt-4 mt-auto">
              <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-primary">
                — {rev.author}
              </p>
              <p className="text-[10px] text-on-surface-variant/70 uppercase tracking-widest mt-0.5">
                Cliente Premium
              </p>
            </div>
            
            {/* Subtle background aesthetic highlight */}
            <div className="absolute top-0 right-0 w-[4px] h-full bg-gradient-to-b from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
