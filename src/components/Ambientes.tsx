import { ArrowRight, Users } from 'lucide-react';
import { AmbientZone } from '../types';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import interiorImg from '../assets/images/interior.webp';
import terrazaImg from '../assets/images/terraza.webp';
import barraImg from '../assets/images/barra.webp';
import salonImg from '../assets/images/salon-privado.webp';

interface AmbientesProps {
  onSelectZone: (zone: string) => void;
}

const zones: (AmbientZone & { zone: string; width: number; height: number })[] = [
  {
    id: 'interior',
    zone: 'Interior Principal',
    title: 'Interior Principal',
    description: 'Techos altos con bóvedas, lámparas de bronce y mesas vestidas con mantelería de lino.',
    capacity: 'Hasta 60 personas · climatizado',
    image: interiorImg,
    imageAlt: 'Salón principal con techos abovedados, ventanales altos y lámparas de bronce encendidas sobre mesas de madera',
    width: 512,
    height: 512,
  },
  {
    id: 'terraza',
    zone: 'Terraza',
    title: 'Terraza',
    description: 'Guirnaldas de luces, sillones bajos y vista a los techos de Palermo. Ideal para las noches de verano.',
    capacity: 'Al aire libre · con calefactores',
    image: terrazaImg,
    imageAlt: 'Terraza de noche con guirnaldas de luces cálidas, sillones de exterior y vista a la ciudad iluminada',
    width: 512,
    height: 288,
  },
  {
    id: 'barra',
    zone: 'Barra Premium',
    title: 'Barra Premium',
    description: 'Barra de mármol negro frente a la cocina abierta. Coctelería de autor y platos al paso.',
    capacity: 'En primera fila · hasta 14 personas',
    image: barraImg,
    imageAlt: 'Barra de mármol negro con estantes iluminados repletos de botellas de destilados',
    width: 512,
    height: 512,
  },
  {
    id: 'salon',
    zone: 'Salón Privado',
    title: 'Salón Privado',
    description: 'Un espacio reservado para cenas de empresa, cumpleaños o celebraciones íntimas.',
    capacity: 'Mesa imperial para 12 invitados',
    image: salonImg,
    imageAlt: 'Salón privado con una mesa larga de madera, sillas tapizadas en terracota y una lámpara colgante dorada',
    width: 512,
    height: 512,
  },
];

export default function Ambientes({ onSelectZone }: AmbientesProps) {
  return (
    <section id="zonas" className="py-20 md:py-28 bg-background border-t border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
        <SectionHeader
          align="split"
          eyebrow="Ambientes"
          title="Elegí tu ambiente ideal"
          description="Cada rincón de MESA tiene su propio clima. Elegí el escenario que mejor va con tu noche."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {zones.map((zone, i) => (
            <Reveal key={zone.id} delay={(i % 2) * 0.1}>
              <article className="group relative aspect-[4/5] sm:aspect-[16/10] overflow-hidden rounded-md img-placeholder border border-outline-variant/50 shadow-xl">
                <img
                  src={zone.image}
                  alt={zone.imageAlt}
                  width={zone.width}
                  height={zone.height}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/0" />

                <div className="absolute inset-0 p-5 sm:p-6 md:p-8 flex flex-col justify-end">
                  <div className="space-y-2">
                    <h3 className="font-serif text-3xl font-semibold text-primary italic">{zone.title}</h3>
                    <p className="text-on-surface text-base max-w-md">{zone.description}</p>
                    <p className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <Users size={14} className="text-primary" aria-hidden="true" />
                      {zone.capacity}
                    </p>
                    <button
                      onClick={() => onSelectZone(zone.zone)}
                      className="min-h-11 inline-flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-[0.15em] hover:text-primary-container transition-colors group/btn"
                    >
                      Reservar en {zone.title}
                      <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
