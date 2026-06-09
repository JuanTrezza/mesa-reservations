import React, { useState } from 'react';
import { Sparkles, CircleIcon } from 'lucide-react';
import { MenuItem } from '../types';

export default function Carta() {
  const menuList: MenuItem[] = [
    // Entradas
    {
      name: 'Burrata de Búfala',
      price: 18,
      description: 'Con tomates confitados, pesto artesanal de albahaca fresca y crocante crujiente de focaccia.',
      category: 'entradas'
    },
    {
      name: 'Carpaccio de Ternera',
      price: 22,
      description: 'Láminas finas de solomillo de buey, lascas de queso parmesano cura 24 meses y trufa negra fresca.',
      category: 'entradas'
    },
    {
      name: 'Ostras Fine de Claire (4 uds)',
      price: 24,
      description: 'Con emulsión de cítricos frescos, perlas de chalota crujiente y reducción de vinagre envejecido de Jerez.',
      category: 'entradas'
    },
    {
      name: 'Foie Gras Curado',
      price: 21,
      description: 'Acompañado de higos macerados al ron añejo, brioche artesanal horneado a la mantequilla.',
      category: 'entradas'
    },

    // Principales
    {
      name: 'Risotto de Hongos',
      price: 32,
      description: 'Arroz italiano Carnaroli, mix perfumado de setas silvestres de temporada y gotas de aceite de trufa blanca.',
      category: 'principales'
    },
    {
      name: 'Cordero Lechal',
      price: 38,
      description: 'Cocción lenta a baja temperatura por 24 horas con cremoso puré de boniato ahumado y reducción de demi-glace.',
      category: 'principales'
    },
    {
      name: 'Pulpo Braseado',
      price: 35,
      description: 'Tentáculo marcado a la parrilla sobre crema fina de patata ratte y pimentón ahumado de la Vera.',
      category: 'principales'
    },
    {
      name: 'Solomillo de Buey Angus',
      price: 45,
      description: 'Medallón premium acompañado de milhojas crujiente de patata, trufa negra y salsa untuosa de tinto de Rioja.',
      category: 'principales'
    },
    {
      name: 'Rodaballo Salvaje',
      price: 42,
      description: 'Asado delicadamente en sartén, servido con emulsión de ajos tiernos confitados y bimi al dente.',
      category: 'principales'
    },

    // Postres
    {
      name: 'Tarte Tatin',
      price: 14,
      description: 'Manzanas golden caramelizadas en su punto justo sobre masa quebrada hojaldrada, helado cremoso de bourbon.',
      category: 'postres'
    },
    {
      name: 'Texturas de Cacao',
      price: 15,
      description: 'Mousse de chocolate belga 70%, arena fina de trufa dulce, crujiente de grué y helado levemente ahumado.',
      category: 'postres'
    },
    {
      name: 'Créme de Vainilla de Madagascar',
      price: 12,
      description: 'Capítulo dulce caramelizado al soplete con fresas silvestres marinadas al licor Grand Marnier.',
      category: 'postres'
    }
  ];

  const [activeCategory, setActiveCategory] = useState<'entradas' | 'principales' | 'postres'>('entradas');

  const filteredItems = menuList.filter((item) => item.category === activeCategory);

  return (
    <section id="carta" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Title */}
      <div className="text-center mb-16 space-y-2">
        <span className="text-primary font-sans text-xs font-bold uppercase tracking-[0.25em] block">
          El Arte de Cocinar
        </span>
        <h2 className="font-serif text-3xl md:text-5xl italic text-on-surface">
          Una experiencia gastronómica
        </h2>
        <p className="text-xs text-on-surface-variant max-w-md mx-auto">
          Sabores refinados e ingredientes nobles seleccionados meticulosamente para exaltar sus sentidos en cada bocado.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-10 md:gap-14 mb-16 border-b border-outline-variant/30 max-w-lg mx-auto">
        {(['entradas', 'principales', 'postres'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`pb-4 text-xs md:text-sm font-sans font-bold uppercase tracking-[0.15em] transition-all relative cursor-pointer ${
              activeCategory === cat
                ? 'text-primary'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            {cat}
            
            {activeCategory === cat && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-slideIn"></span>
            )}
          </button>
        ))}
      </div>

      {/* Dishes Menu List Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
        {filteredItems.map((item, index) => (
          <div
            key={item.name + index}
            className="flex flex-col gap-1 hover:bg-surface-container-low/30 p-2 rounded-sm transition-all duration-300 group"
          >
            {/* Top Row: Name and price connected by dotted line */}
            <div className="flex items-end justify-between">
              <span className="font-serif text-lg md:text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
                {item.name}
              </span>
              
              <span className="dotted-leader mb-1 opacity-40"></span>
              
              <span className="font-serif text-lg md:text-xl font-medium text-primary whitespace-nowrap">
                €{item.price}
              </span>
            </div>

            {/* Bottom Row: description */}
            <p className="text-on-surface-variant/80 text-xs md:text-sm font-serif italic leading-relaxed pr-6 mt-1">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Extra Note */}
      <div className="mt-16 text-center">
        <p className="text-[11px] text-on-surface-variant font-sans uppercase tracking-[0.15em] flex items-center justify-center gap-2">
          <span>* Ofrecemos alternativas vegetarianas y opciones sin gluten. Consulte con su sumiller.</span>
        </p>
      </div>
    </section>
  );
}
