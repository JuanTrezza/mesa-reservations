import { Star, ShieldCheck } from 'lucide-react';
import { Review } from '../types';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';

const reviews: Review[] = [
  {
    id: 'rev-1',
    author: 'Valentina R.',
    text: 'La mejor burrata que probé en mi vida. La atención es impecable, están en cada detalle, y la casona te transporta. Volvemos seguro.',
    rating: 5,
    verified: true,
  },
  {
    id: 'rev-2',
    author: 'Martín V.',
    text: 'Un oasis en pleno Palermo. El risotto de hongos es una obra maestra y el sommelier la pegó con el Malbec. Ideal para una noche especial.',
    rating: 5,
    verified: true,
  },
  {
    id: 'rev-3',
    author: 'Sofía G.',
    text: 'Fuimos a la terraza al atardecer y fue increíble. El ojo de bife, en su punto justo. Reservar online fue rapidísimo.',
    rating: 5,
    verified: true,
  },
];

export default function Testimonios() {
  return (
    <section aria-labelledby="testimonios-title" className="py-20 md:py-28 bg-surface border-t border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
        <SectionHeader
          id="testimonios-title"
          eyebrow="Opiniones"
          title="Lo que dicen nuestros invitados"
          description="Lo que más nos enorgullece es que vuelvan. Esto nos contaron."
        />

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((rev, i) => (
            <Reveal
              as="li"
              key={rev.id}
              delay={i * 0.1}
              className="p-6 md:p-8 bg-surface-container rounded-md border border-outline-variant/50 hover:border-primary/50 transition-colors flex flex-col"
            >
              <div className="flex justify-between items-center gap-3 mb-6">
                <div className="flex gap-1 text-primary" role="img" aria-label={`${rev.rating} de 5 estrellas`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      size={18}
                      strokeWidth={1.5}
                      className={i < rev.rating ? 'fill-primary text-primary' : 'text-outline-variant'}
                      aria-hidden="true"
                    />
                  ))}
                </div>

                {rev.verified && (
                  <span className="inline-flex items-center gap-1 text-primary text-[11px] font-bold uppercase tracking-widest bg-primary/10 px-2.5 py-1 border border-primary/30 rounded-full">
                    <ShieldCheck size={12} aria-hidden="true" /> Verificada
                  </span>
                )}
              </div>

              <blockquote className="font-serif text-xl italic text-on-surface leading-relaxed mb-8">“{rev.text}”</blockquote>

              <div className="border-t border-outline-variant/50 pt-4 mt-auto">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{rev.author}</p>
                <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-1">Cliente frecuente</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
