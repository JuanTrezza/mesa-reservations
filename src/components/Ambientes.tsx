import { ArrowRight, Users } from 'lucide-react';
import { AmbientZone } from '../types';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import interiorImg from '../assets/images/interior.webp';
import interiorImgSm from '../assets/images/interior-768.webp';
import terrazaImg from '../assets/images/terraza.webp';
import terrazaImgSm from '../assets/images/terraza-768.webp';
import barraImg from '../assets/images/barra.webp';
import barraImgSm from '../assets/images/barra-768.webp';
import salonImg from '../assets/images/salon-privado.webp';
import salonImgSm from '../assets/images/salon-privado-768.webp';

interface AmbientesProps {
  onSelectZone: (zone: string) => void;
}

type Zone = AmbientZone & { zone: string; imageSm: string; position: string };

// Todas las fotos son 1536 × 1024 (variante de 768 px para mobile).
// position: encuadre en las tarjetas verticales de mobile, donde se recortan los costados.
const zones: Zone[] = [
  {
    id: 'interior',
    zone: 'Interior Principal',
    title: 'Interior Principal',
    description: 'Ventanales altos, arañas de cristal y mesas vestidas con mantelería blanca.',
    capacity: 'Hasta 60 personas · climatizado',
    image: interiorImg,
    imageSm: interiorImgSm,
    position: 'object-[60%_40%]',
    imageAlt: 'Salón principal con mesas de mantel blanco, sillones de cuero y grandes ventanales en arco iluminados de noche',
  },
  {
    id: 'terraza',
    zone: 'Terraza',
    title: 'Terraza',
    description: 'Guirnaldas de luces, plantas y el atardecer sobre los edificios de Palermo.',
    capacity: 'Al aire libre · con calefactores',
    image: terrazaImg,
    imageSm: terrazaImgSm,
    position: 'object-[70%_45%]',
    imageAlt: 'Terraza al atardecer con mesas iluminadas por velas, guirnaldas de luces y la silueta de la ciudad de fondo',
  },
  {
    id: 'barra',
    zone: 'Barra Premium',
    title: 'Barra Premium',
    description: 'Barra de mármol negro frente a la cocina abierta. Coctelería de autor y platos al paso.',
    capacity: 'En primera fila · hasta 4 personas',
    image: barraImg,
    imageSm: barraImgSm,
    position: 'object-[55%_50%]',
    imageAlt: 'Barra de mármol negro con banquetas de terciopelo verde, un cóctel servido y estantes de botellas iluminados',
  },
  {
    id: 'salon',
    zone: 'Salón Privado',
    title: 'Salón Privado',
    description: 'Un espacio reservado junto a la cava para cenas de empresa, cumpleaños o celebraciones.',
    capacity: 'Mesa imperial para 6 a 12 invitados',
    image: salonImg,
    imageSm: salonImgSm,
    position: 'object-[45%_40%]',
    imageAlt: 'Salón privado de paredes verdes con una mesa larga iluminada por velas, una araña de cristal y la cava vidriada al fondo',
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
              <article className="group relative aspect-[4/5] sm:aspect-[3/2] overflow-hidden rounded-md img-placeholder border border-outline-variant/50 shadow-xl">
                <img
                  src={zone.image}
                  srcSet={`${zone.imageSm} 768w, ${zone.image} 1536w`}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  alt={zone.imageAlt}
                  width={1536}
                  height={1024}
                  loading="lazy"
                  decoding="async"
                  className={`absolute inset-0 w-full h-full object-cover ${zone.position} sm:object-center transition-transform duration-[1200ms] ease-out group-hover:scale-105`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/0" />

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
