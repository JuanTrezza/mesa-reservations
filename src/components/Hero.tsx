import React, { useState } from 'react';
import { ArrowRight, Calendar, User, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { Reservation } from '../types';

interface HeroProps {
  onAddReservation: (res: Omit<Reservation, 'id' | 'status' | 'createdAt'>) => void;
}

export default function Hero({ onAddReservation }: HeroProps) {
  // Booking form state
  const [date, setDate] = useState('2026-06-15');
  const [time, setTime] = useState('20:30');
  const [guests, setGuests] = useState(2);
  const [zone, setZone] = useState('Interior Principal');

  // Guest details form state
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Quick Book Submit handler
  const handleOpenDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDetailsForm(true);
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      alert('Por favor complete todos los datos de contacto obligatorios.');
      return;
    }

    onAddReservation({
      date,
      time,
      guests,
      zone,
      name,
      email,
      phone,
      specialRequests,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setShowDetailsForm(false);
      setIsSuccess(false);
      // Reset details
      setName('');
      setEmail('');
      setPhone('');
      setSpecialRequests('');
    }, 2500);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="inicio" className="relative min-h-[95vh] flex items-center overflow-hidden pt-12 md:pt-0">
      {/* Editorial Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#16130b] via-[#16130b]/80 to-[#16130b]/20 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#16130b] via-transparent to-transparent z-10"></div>
        <img
          alt="Mesa Fine Dining Interior"
          className="w-full h-full object-cover brightness-[0.70] scale-105 transition-all duration-1000"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpuzkmVqmVmTaEXQ7LHDsvlOS60jJFuW4R9ZnXs-YWgxS6By8vXjw_DRj0VZDZAfb92hVos6PEAg896YYV3hnklFncAPpvELAptpn5movqpgo0oEaE9slyMogEuIXNmw0MzLDyq3lIxzvCiYjCcJR5bfVr251pMq_5xxh3wsLiz_xwil5vCpTDcBJyIpumeFet8uKZJhjK478CGIOtf_rMeDvkRMmlYwvJXhdL_VOXCsaaVt-NZgKbfV4ck-hL2UuTaInwBVDtJ8s"
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-16 md:py-24">
        {/* Left Side: Brand presentation */}
        <div className="lg:col-span-7 space-y-6">
          <span className="text-primary tracking-[0.3em] font-sans text-xs md:text-sm font-bold block uppercase animate-fadeIn">
            Gastronomía · Experiencia · Tradición
          </span>
          <h1 className="font-display text-4xl md:text-6xl italic text-primary leading-tight mt-2">
            Tu mesa te espera en MESA.
          </h1>
          <p className="text-on-surface-variant font-sans text-base md:text-lg max-w-xl leading-relaxed">
            Sistema de reservas premium diseñado para los paladares más exigentes. Asegure su lugar en el corazón de nuestra propuesta gastronómica y disfrute de una noche inigualable.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => scrollToSection('reservas')}
              className="bg-primary hover:bg-primary-container text-on-primary font-sans text-xs font-bold uppercase tracking-[0.2em] px-8 py-5 rounded-sm flex items-center gap-3 gold-glow transition-all active:scale-95 cursor-pointer"
            >
              Reservar ahora <ArrowRight size={16} />
            </button>
            <button
              onClick={() => scrollToSection('carta')}
              className="border border-[#d4af37]/40 text-primary hover:bg-primary/5 font-sans text-xs font-bold uppercase tracking-[0.2em] px-8 py-5 rounded-sm transition-all cursor-pointer"
            >
              Ver carta
            </button>
          </div>

          {/* Premium stats */}
          <div className="grid grid-cols-3 gap-6 pt-12 border-t border-outline-variant/35 max-w-lg">
            <div>
              <p className="font-display italic text-primary text-3xl md:text-4xl font-semibold">98%</p>
              <p className="text-on-surface-variant font-sans text-[10px] md:text-xs font-bold uppercase tracking-wider mt-1">
                Satisfacción
              </p>
            </div>
            <div>
              <p className="font-display italic text-primary text-3xl md:text-4xl font-semibold">12</p>
              <p className="text-on-surface-variant font-sans text-[10px] md:text-xs font-bold uppercase tracking-wider mt-1">
                Premios de Oro
              </p>
            </div>
            <div>
              <p className="font-display italic text-primary text-3xl md:text-4xl font-semibold">150+</p>
              <p className="text-on-surface-variant font-sans text-[10px] md:text-xs font-bold uppercase tracking-wider mt-1">
                Etiquetas en Cava
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Quick reservation panel */}
        <div id="quick-book-form" className="lg:col-span-5 w-full">
          <div className="glass-card p-6 md:p-8 rounded-lg shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary to-primary-container"></div>
            
            <h3 className="font-serif text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
              Reserva Rápida
            </h3>

            <form onSubmit={handleOpenDetails} className="space-y-5">
              {/* Date Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold block">
                  Fecha
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-primary scale-90">
                    <Calendar size={18} />
                  </span>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-sm text-on-surface p-3 pl-10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm font-sans"
                  />
                </div>
              </div>

              {/* Time & Guests Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold block">
                    Hora
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-primary scale-90">
                      <Clock size={18} />
                    </span>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-sm text-on-surface p-3 pl-10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm font-sans"
                    >
                      <option value="13:30">13:30 hs</option>
                      <option value="14:00">14:00 hs</option>
                      <option value="14:30">14:30 hs</option>
                      <option value="20:00">20:00 hs</option>
                      <option value="20:30">20:30 hs</option>
                      <option value="21:00">21:00 hs</option>
                      <option value="21:30">21:30 hs</option>
                      <option value="22:00">22:00 hs</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold block">
                    Comensales
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-primary scale-90">
                      <User size={18} />
                    </span>
                    <input
                      type="number"
                      required
                      min={1}
                      max={12}
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-sm text-on-surface p-3 pl-10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Ambient selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold block">
                  Ubicación preferida
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-primary scale-90">
                    <MapPin size={18} />
                  </span>
                  <select
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-sm text-on-surface p-3 pl-10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm font-sans"
                  >
                    <option value="Interior Principal">Interior Principal (Climatizado)</option>
                    <option value="Terraza">Terraza (Al aire libre)</option>
                    <option value="Barra Premium">Barra Premium (Cocina en vivo)</option>
                    <option value="Salón Privado">Salón Privado (Exclusivo)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary-container hover:bg-primary text-on-primary hover:text-on-primary p-4 rounded-sm font-sans text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 pointer mt-2 cursor-pointer"
              >
                Ver disponibilidad
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Guest Details Modal Form Overlay */}
      {showDetailsForm && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-surface-container border border-outline-variant/35 p-6 md:p-8 rounded-lg max-w-md w-full relative">
            <button
              onClick={() => setShowDetailsForm(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors text-lg font-bold cursor-pointer"
            >
              ✕
            </button>

            {isSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-2">
                  <CheckCircle2 size={44} />
                </div>
                <h3 className="font-serif text-2xl text-primary">¡Reserva Registrada!</h3>
                <p className="text-sm text-on-surface-variant max-w-xs mx-auto">
                  Hemos confirmado su mesa para el día {date} a las {time} hs en {zone} para {guests} comensales.
                </p>
                <div className="text-xs text-primary font-mono bg-surface-container-lowest py-2 px-3 rounded inline-block">
                  CÓDIGO QR GENERADO Y ENVIADO
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmReservation} className="space-y-4">
                <div className="border-b border-outline-variant/20 pb-3 mb-4">
                  <h3 className="font-serif text-xl text-primary">Completa tu Reserva</h3>
                  <p className="text-xs text-on-surface-variant">
                    {guests} personas · {date} · {time} hs · {zone}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-sm text-on-surface p-2.5 text-sm font-sans focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-sm text-on-surface p-2.5 text-sm font-sans focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
                    Teléfono de contacto *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+34 600 000 000"
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-sm text-on-surface p-2.5 text-sm font-sans focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
                    Requerimientos especiales / Alergias (Opcional)
                  </label>
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Ej. Opción vegetariana, alergia a frutos secos..."
                    rows={2}
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-sm text-on-surface p-2.5 text-sm font-sans focus:outline-none focus:border-primary resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-on-primary py-3.5 rounded-sm font-sans text-xs font-bold uppercase tracking-[0.2em] hover:bg-primary-container transition-all cursor-pointer mt-4"
                >
                  Confirmar Reserva Premium
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
