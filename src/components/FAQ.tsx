import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { FAQItem } from '../types';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';

const faqs: FAQItem[] = [
  {
    id: 'faq-1',
    question: '¿Cuál es la política de cancelación?',
    answer:
      'Podés cancelar o cambiar el horario sin cargo hasta 24 horas antes desde “Mis reservas”. Si es con menos anticipación, avisanos por teléfono o WhatsApp lo antes posible.',
  },
  {
    id: 'faq-2',
    question: '¿Tienen opciones vegetarianas, veganas o sin TACC?',
    answer:
      'Sí. La carta tiene platos vegetarianos (como el risotto de hongos) y adaptamos principales y postres para dietas veganas o sin TACC. Contanos en el formulario de reserva.',
  },
  {
    id: 'faq-3',
    question: '¿Cómo reservo para un grupo grande?',
    answer:
      'Para más de 8 personas te recomendamos el Salón Privado, con menú de pasos cerrado para que la cocina mantenga el ritmo y estén cómodos. Escribinos y armamos la propuesta.',
  },
  {
    id: 'faq-4',
    question: '¿Hay límite de tiempo en la mesa?',
    answer:
      'No te vamos a apurar. Una cena completa suele durar unas dos horas y media, así que tenelo en cuenta si venís con otro plan después.',
  },
  {
    id: 'faq-5',
    question: '¿Qué medios de pago aceptan?',
    answer:
      'Efectivo, tarjetas de débito y crédito (Visa, Mastercard, American Express), Mercado Pago y transferencia para reservas corporativas.',
  },
  {
    id: 'faq-6',
    question: '¿Tienen estacionamiento?',
    answer: 'Sí, hay valet parking sin cargo para clientes en la puerta del restaurante durante todo el horario de servicio.',
  },
];

export default function FAQ() {
  const [openedFaq, setOpenedFaq] = useState<string | null>('faq-1');

  return (
    <section id="FAQ" className="py-20 md:py-28 bg-background border-t border-outline-variant/30">
      <div className="max-w-3xl mx-auto px-5 sm:px-6">
        <SectionHeader
          eyebrow="Preguntas frecuentes"
          title="¿Tenés dudas?"
          description="Todo lo que necesitás saber antes de tu visita."
        />

        <Reveal>
          <ul className="divide-y divide-outline-variant/60 border-y border-outline-variant/60">
            {faqs.map((faq) => {
              const isOpen = openedFaq === faq.id;
              return (
                <li key={faq.id}>
                  <h3>
                    <button
                      id={`${faq.id}-q`}
                      onClick={() => setOpenedFaq(isOpen ? null : faq.id)}
                      aria-expanded={isOpen}
                      aria-controls={`${faq.id}-a`}
                      className="w-full min-h-14 text-left flex justify-between items-center gap-4 py-4 group"
                    >
                      <span
                        className={`font-serif text-xl md:text-2xl font-semibold transition-colors ${
                          isOpen ? 'text-primary' : 'text-on-surface group-hover:text-primary'
                        }`}
                      >
                        {faq.question}
                      </span>
                      <ChevronDown
                        size={22}
                        aria-hidden="true"
                        className={`shrink-0 text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`${faq.id}-a`}
                        role="region"
                        aria-labelledby={`${faq.id}-q`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <p className="text-on-surface-variant text-base leading-relaxed pb-5 pr-8">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
