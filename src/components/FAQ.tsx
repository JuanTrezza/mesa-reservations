import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldAlert } from 'lucide-react';
import { FAQItem } from '../types';

export default function FAQ() {
  const faqs: FAQItem[] = [
    {
      id: 'faq-1',
      question: '¿Cuál es la política de cancelación?',
      answer: 'Aceptamos cancelaciones y modificaciones de horario sin penalización alguna hasta 24 horas antes de su reserva. Posterior a ese tiempo, rogamos nos avise telefónicamente a la brevedad posible.'
    },
    {
      id: 'faq-2',
      question: '¿Tienen opciones vegetarianas/veganas?',
      answer: 'Contamos con platos diseñados especialmente para comensales vegetarianos en nuestra carta permanente (como nuestro Risotto de Setas) y podemos adaptar postres o platos fuertes para dietas veganas previo aviso en el formulario de reserva.'
    },
    {
      id: 'faq-3',
      question: '¿Cómo gestionan grupos grandes de comensales?',
      answer: 'Para mesas con más de 8 personas, disponemos de nuestro exclusivo Salón Privado con menús de degustación cerrados para garantizar un ritmo impecable de la cocina y el máximo confort posible.'
    },
    {
      id: 'faq-4',
      question: '¿Hay un límite de tiempo de permanencia en mesa?',
      answer: 'No obligamos a los comensales a retirarse, pero sugerimos un promedio estimativo de 2.5 horas para que pueda saborear pausadamente cada paso gastronómico e interactuar plácidamente.'
    },
    {
      id: 'faq-5',
      question: '¿Qué formas de pago y tarjetas son admitidas?',
      answer: 'Aceptamos todas las tarjetas de crédito y débito internacionales (Visa, Mastercard, American Express), pagos digitales inalámbricos seguros, así como transferencias bancarias de reserva corporativa.'
    },
    {
      id: 'faq-6',
      question: '¿Cuentan con estacionamiento o servicio de aparcacoches?',
      answer: 'Sí, disponemos de servicio gratuito de Valetparking (aparcacoches premium) exclusivo para nuestros clientes directamente en las puertas del restaurante durante el horario de apertura.'
    }
  ];

  const [openedFaq, setOpenedFaq] = useState<string | null>('faq-1');

  const toggleFaq = (id: string) => {
    if (openedFaq === id) {
      setOpenedFaq(null);
    } else {
      setOpenedFaq(id);
    }
  };

  return (
    <section id="FAQ" className="py-24 bg-surface-dim border-t border-outline-variant/15">
      <div className="max-w-3xl mx-auto px-6">
        
        {/* Title */}
        <div className="text-center mb-16 space-y-2">
          <span className="text-primary font-sans text-xs font-bold uppercase tracking-[0.25em] block">
            Dudas Frecuentes
          </span>
          <h2 className="font-serif text-3xl md:text-5xl italic text-on-surface">
            Preguntas frecuentes
          </h2>
          <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
            Respuestas a las inquietudes comunes para garantizar un servicio insuperable durante su visita culinaria.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openedFaq === faq.id;

            return (
              <div
                key={faq.id}
                className="border-b border-outline-variant/30 pb-4 transition-all duration-300"
              >
                {/* Header question button */}
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left flex justify-between items-center py-3 group focus:outline-none cursor-pointer"
                >
                  <span className={`font-serif text-lg md:text-xl font-bold transition-colors ${
                    isOpen ? 'text-primary' : 'text-on-surface hover:text-primary'
                  }`}>
                    {faq.question}
                  </span>
                  
                  <span className={`transform transition-transform duration-300 text-primary p-1 ${
                    isOpen ? 'rotate-180' : ''
                  }`}>
                    <ChevronDown size={20} />
                  </span>
                </button>

                {/* Answer block */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-on-surface-variant/90 text-xs md:text-sm leading-relaxed font-sans pr-4">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
