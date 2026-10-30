import { useState } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { MenuItem } from '../types';
import SectionHeader from './SectionHeader';
import { formatARS } from '../lib/booking';

const menuList: MenuItem[] = [
  // Entradas
  {
    name: 'Burrata de búfala',
    price: 18500,
    description: 'Tomates confitados, pesto de albahaca fresca y focaccia crocante de masa madre.',
    category: 'entradas',
  },
  {
    name: 'Carpaccio de lomo',
    price: 21000,
    description: 'Láminas finas de lomo, lascas de reggianito estacionado 24 meses y aceite de trufa negra.',
    category: 'entradas',
  },
  {
    name: 'Langostinos patagónicos',
    price: 26500,
    description: 'Salteados en manteca de ajo, emulsión de cítricos y chalotas crocantes.',
    category: 'entradas',
  },
  {
    name: 'Mollejas al limón',
    price: 22000,
    description: 'Mollejas de corazón crocantes, puré de coliflor ahumado y gremolata.',
    category: 'entradas',
  },

  // Principales
  {
    name: 'Risotto de hongos',
    price: 34500,
    description: 'Arroz carnaroli, hongos de pino de temporada y unas gotas de aceite de trufa blanca.',
    category: 'principales',
  },
  {
    name: 'Cordero patagónico',
    price: 46000,
    description: 'Cocción lenta durante 12 horas, puré de batata ahumada y reducción de Malbec.',
    category: 'principales',
  },
  {
    name: 'Pulpo grillado',
    price: 42500,
    description: 'Tentáculo a las brasas sobre crema de papa andina y pimentón ahumado.',
    category: 'principales',
  },
  {
    name: 'Ojo de bife madurado',
    price: 52000,
    description: 'Corte de 400 g madurado 30 días, papas rotas, chimichurri de la casa y sal de Maldon.',
    category: 'principales',
  },
  {
    name: 'Merluza negra',
    price: 58000,
    description: 'Dorada a la sartén, beurre blanc de ajos confitados y espárragos al dente.',
    category: 'principales',
  },

  // Postres
  {
    name: 'Tarte tatin',
    price: 14500,
    description: 'Manzanas caramelizadas sobre masa hojaldrada y helado de crema americana.',
    category: 'postres',
  },
  {
    name: 'Texturas de cacao',
    price: 15500,
    description: 'Mousse de chocolate 70 %, crumble de cacao, crocante de nibs y helado ahumado.',
    category: 'postres',
  },
  {
    name: 'Flan de dulce de leche',
    price: 12000,
    description: 'Flan casero con dulce de leche repostero y crema batida a la vainilla de Madagascar.',
    category: 'postres',
  },
];

const CATEGORIES = [
  { id: 'entradas', label: 'Entradas' },
  { id: 'principales', label: 'Principales' },
  { id: 'postres', label: 'Postres' },
] as const;

export default function Carta() {
  const [activeCategory, setActiveCategory] = useState<MenuItem['category']>('entradas');
  const filteredItems = menuList.filter((item) => item.category === activeCategory);

  return (
    <section id="carta" className="py-20 md:py-28 bg-surface border-t border-outline-variant/30">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-12">
        <SectionHeader
          eyebrow="La carta"
          title="Una experiencia gastronómica"
          description="Producto argentino de estación, técnica cuidada y sabores que se quedan con vos."
        />

        <div role="tablist" aria-label="Categorías de la carta" className="flex justify-center gap-2 sm:gap-8 mb-12 md:mb-16 border-b border-outline-variant/60 max-w-lg mx-auto">
          {CATEGORIES.map((cat) => {
            const selected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                role="tab"
                id={`tab-${cat.id}`}
                aria-selected={selected}
                aria-controls="carta-panel"
                onClick={() => setActiveCategory(cat.id)}
                className={`min-h-12 px-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] relative transition-colors ${
                  selected ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {cat.label}
                {selected && <m.span layoutId="carta-tab" className="absolute -bottom-px left-0 right-0 h-0.5 bg-primary" />}
              </button>
            );
          })}
        </div>

        <div id="carta-panel" role="tabpanel" aria-labelledby={`tab-${activeCategory}`}>
          <AnimatePresence mode="wait">
            <m.ul
              key={activeCategory}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8"
            >
              {filteredItems.map((item) => (
                <li key={item.name} className="flex flex-col gap-1.5">
                  <div className="flex items-end justify-between gap-2">
                    <span className="font-serif text-2xl font-semibold text-on-surface leading-tight">{item.name}</span>
                    <span className="dotted-leader hidden sm:block" aria-hidden="true" />
                    <span className="font-sans text-base font-semibold text-primary whitespace-nowrap tabular-nums">
                      {formatARS(item.price)}
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-base leading-relaxed">{item.description}</p>
                </li>
              ))}
            </m.ul>
          </AnimatePresence>
        </div>

        <p className="mt-14 text-center text-sm text-on-surface-variant">
          Tenemos opciones vegetarianas y sin TACC. Consultá con nuestro sommelier por el maridaje.
        </p>
      </div>
    </section>
  );
}
