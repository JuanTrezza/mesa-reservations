import { Calendar, ClipboardCheck, QrCode } from 'lucide-react';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';

const steps = [
  {
    num: '01',
    title: 'Elegí el momento',
    desc: 'Seleccioná fecha, horario, cantidad de personas y el ambiente que más te guste.',
    Icon: Calendar,
  },
  {
    num: '02',
    title: 'Confirmá tus datos',
    desc: 'Dejanos tu nombre, email y celular, y contanos si tenés alguna alergia o pedido especial.',
    Icon: ClipboardCheck,
  },
  {
    num: '03',
    title: 'Recibí tu QR',
    desc: 'Te llega un código QR al instante. Lo mostrás en la entrada y te llevamos directo a tu mesa.',
    Icon: QrCode,
  },
];

export default function Proceso() {
  return (
    <section aria-labelledby="proceso-title" className="py-20 md:py-28 bg-surface-container-low border-t border-outline-variant/30">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-12">
        <SectionHeader id="proceso-title" eyebrow="Cómo funciona" title="Reservá en 3 simples pasos" />

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 relative before:hidden md:before:block before:absolute before:top-8 before:left-[16.66%] before:right-[16.66%] before:border-t before:border-dashed before:border-primary/40">
          {steps.map(({ num, title, desc, Icon }, idx) => (
            <Reveal as="li" key={num} delay={idx * 0.12} className="text-center relative space-y-4">
                <div className="relative inline-flex items-center justify-center w-16 h-16 border border-primary/60 rounded-full bg-surface-container text-primary font-display text-2xl font-semibold shadow-md">
                  {num}
                  <span className="absolute -bottom-1 -right-1 bg-surface-container-high border border-outline-variant p-1.5 rounded-full" aria-hidden="true">
                    <Icon className="w-4 h-4 text-primary" />
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-semibold text-on-surface">{title}</h3>
                <p className="text-on-surface-variant text-base max-w-xs mx-auto leading-relaxed">{desc}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
