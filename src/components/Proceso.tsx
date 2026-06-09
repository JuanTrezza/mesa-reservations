import React from 'react';
import { Calendar, ShieldAlert, QrCode } from 'lucide-react';

export default function Proceso() {
  const steps = [
    {
      num: '01',
      title: 'Elegí el momento',
      desc: 'Seleccione la fecha, hora y número de invitados según su preferencia gastronómica.',
      icon: <Calendar className="w-5 h-5 text-primary" />
    },
    {
      num: '02',
      title: 'Confirmá detalles',
      desc: 'Ingrese sus datos fundamentales de contacto y configure preferencias dietéticas especiales.',
      icon: <ShieldAlert className="w-5 h-5 text-primary" />
    },
    {
      num: '03',
      title: 'Recibí confirmación',
      desc: 'Recibirá un código QR único e inmediato en su móvil para validar su mesa sin esperas.',
      icon: <QrCode className="w-5 h-5 text-primary" />
    }
  ];

  return (
    <section className="py-20 bg-surface-container border-y border-outline-variant/15">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h2 className="font-serif text-2xl md:text-4xl italic text-center text-on-surface mb-16">
          Reservá en 3 simples pasos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className="space-y-4 text-center group relative p-4 transition-all duration-300 rounded-sm"
            >
              {/* Central gold circle */}
              <div className="relative inline-flex items-center justify-center w-16 h-16 border border-primary/30 rounded-full bg-surface-container-low text-primary font-display text-2xl font-semibold mb-2 group-hover:border-primary group-hover:scale-105 transition-all shadow-md">
                {step.num}
                {/* Micro logo icon */}
                <div className="absolute -bottom-1 -right-1 bg-surface-container-high border border-outline-variant/20 p-1 rounded-full scale-90">
                  {step.icon}
                </div>
              </div>

              <h4 className="font-serif text-xl font-semibold text-on-surface">
                {step.title}
              </h4>
              
              <p className="text-on-surface-variant text-sm max-w-xs mx-auto leading-relaxed">
                {step.desc}
              </p>

              {/* Connector lines (only for desktop view, hiding on mobile) */}
              {idx < 2 && (
                <div className="hidden md:block absolute top-[15%] left-[75%] w-[50%] h-[1px] border-t border-dashed border-outline-variant/30 z-0"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
