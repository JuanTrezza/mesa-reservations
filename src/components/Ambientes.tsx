import React from 'react';
import { ArrowRight, MapPin, Users, Sparkles } from 'lucide-react';
import { AmbientZone } from '../types';

export default function Ambientes() {
  const zones: AmbientZone[] = [
    {
      id: 'interior',
      title: 'Interior Principal',
      description: 'Atmósfera sofisticada con techos altos, lámparas de diseñador y mesas vestidas en hilo fino.',
      capacity: 'Hasta 60 personas. Totalmente Climatizado.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_msuDmZWTJrlAVpNTN8W0II2esEeTIIL0ldEZqdZg5TiTNv5EfHoNefL0VEVRHuTL6OTBDp92_Yl0qz-gp-Y4tmChLABOOW2UBlKVxq6tJ0vfUa2N8DTi5HVW-521kGYh2EPimuYdYl6kQCWZpvnaB_MEYwEKPuWKrYNuakHUq7Holk8HY7gW_8jBxXklp7nsxg5fzV9ZwL8IiT7VVoKa4byQexIhTMtk8L-s8nndALHhe1JZ4LER8-I0FA54lHcyp3EhBl-ZKj0',
      imageAlt: 'Interior Principal MESA'
    },
    {
      id: 'terraza',
      title: 'Terraza Privada',
      description: 'Un elegante dosel flotante iluminado por delicadas luces de guirnalda y sutiles vistas a la ciudad.',
      capacity: 'Espacio al aire libre con calefacción.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhT_i2rnkH01-O4lA9qkauP7aq0D8aKCC9bo7vPLRsy0tZp4D1XDd9t2SHlfhTNkxWzVg5SUMI_SHUBHEOV4Fcafa7X8LSXJvZOaHHhsZxa_93hs0-SA90u5VZJCz_q8_bJEWfJ-XpJ59eZNq0qioc_sSI9UhTFQFPadv9jR4HbkV7x8BXQvVNzdi_V1rWaxoc5fe_yRWwHCz2Qll_IX0eDjJjbm7nJbat1B5aROd9GmHTEdHzCRTmLuBn7X_ETUFz5d4Ffwazoek',
      imageAlt: 'Terraza MESA'
    },
    {
      id: 'barra',
      title: 'Barra Premium',
      description: 'Lujoso mesón de mármol negro frente a la cocina abierta. Ideal para cócteles y alta repostería.',
      capacity: 'Experiencia inmersiva en primera fila.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmYQVu6bPQ_Btty_lj4Jy33gbfAPdb2j3mV5K44uMDkFTVoHS59FyzyNsbhGZaHMa1-O44RGHLdgjEeqCxrcoYeT1XZ8x7UmYTr8BHv2_GdzeOpp8tx5L8kTFD-OE4JowzQFsVHGWBL5kp6w6jNM-2S29gcl2gEkfdRUyz6VOn6_Pi8Wx9W0ta5oRvKbYtur2AkN9Pgyjh7W4gbmGOPyALgNmqEee49MYX81k4fkJzDKfuBGxlxqjvtpKHpxugkzMrOuLjZwa2mjc',
      imageAlt: 'Barra Premium MESA'
    },
    {
      id: 'salon',
      title: 'Salón Privado',
      description: 'Salón apartado y confidencial diseñado para cenas corporativas o celebraciones festivas muy íntimas.',
      capacity: 'Mesa imperial con capacidad para 12 invitados.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1enD3e8M6qF_tGuLLa6LDqy5OcvFR9k06i-Jga68lAhnVObdr6OFtb1jrQ-GT7YZ_YQwOu5KeOcCguxlQ0avVAcb9Iky2ooey-x-ASAyBbN_Zi_zClElmqtPKQpcEVjfHUIu5d58BzOKejdWbTQ1DEtn2p9ewQYeoyhfk1IIK_BvaG4hDO49PdLydSd6ast9NFU9y4HlPDq9Nv4SAgsuOru0KZVgdSiiHQutQHXj03MP6nLW4rb5R329sejKSI-bddvrjAsEMe0w',
      imageAlt: 'Salón Privado MESA'
    }
  ];

  const handleZoneSelect = (title: string) => {
    // Scroll to the book form and set standard focus or select dropdown if possible
    const quickBookEl = document.getElementById('quick-book-form');
    if (quickBookEl) {
      quickBookEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="zonas" className="py-24 bg-surface-dim border-t border-outline-variant/15">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Intro */}
        <div className="mb-16 md:flex justify-between items-end gap-8">
          <div className="space-y-2">
            <span className="text-primary font-sans text-xs font-bold uppercase tracking-[0.25em] block">
              Ambientes
            </span>
            <h2 className="font-serif text-3xl md:text-5xl italic text-on-surface">
              Elegí tu ambiente ideal
            </h2>
          </div>
          <p className="text-on-surface-variant font-sans text-sm max-w-sm mt-4 md:mt-0">
            Cada rincón de MESA cuenta una historia sensorial distinta. Escoja el escenario idóneo para su velada.
          </p>
        </div>

        {/* Zones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="group relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden rounded-sm bg-[#110e07] border border-outline-variant/20 shadow-xl transition-all duration-300"
            >
              {/* Back Image with zoom hover effect */}
              <img
                alt={zone.imageAlt}
                className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110 brightness-[0.75] group-hover:brightness-[0.80]"
                src={zone.image}
              />
              
              {/* Bottom Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#16130b] via-[#16130b]/40 to-transparent opacity-95 transition-all"></div>

              {/* Text content absolute inside */}
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                <div className="space-y-2 translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="font-serif text-2xl font-bold text-primary italic">
                    {zone.title}
                  </h3>
                  <p className="text-on-surface-variant text-sm max-w-md line-clamp-2">
                    {zone.description}
                  </p>
                  
                  {/* Capacity Tag details */}
                  <div className="flex items-center gap-1.5 text-xs text-secondary/90 font-sans pb-2">
                    <Users size={12} className="text-primary" />
                    <span>{zone.capacity}</span>
                  </div>

                  {/* Booking Trigger Link */}
                  <button
                    onClick={() => handleZoneSelect(zone.title)}
                    className="inline-flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-[0.15em] hover:text-primary-container transition-colors group/btn pt-1 cursor-pointer"
                  >
                    <span>Reservar aquí</span>
                    <ArrowRight size={14} className="transform group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
