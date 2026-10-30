import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Calendar, User, Clock, MapPin, CheckCircle2, X } from 'lucide-react';
import { Reservation } from '../types';
import { formatLongDate, nextOpenDate, parseISODate, isClosed, scrollToId, TIME_SLOTS, todayISO, ZONES, type BookingDraft } from '../lib/booking';
import heroImg from '../assets/images/hero.webp';

interface HeroProps {
  onAddReservation: (res: Omit<Reservation, 'id' | 'status' | 'createdAt'>) => void;
  draft: { values: BookingDraft; nonce: number } | null;
}

const fieldClass =
  'w-full min-h-12 bg-surface-container-lowest border border-outline-variant rounded-sm text-on-surface p-3 text-base sm:text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-colors';
const labelClass = 'text-xs text-on-surface-variant uppercase tracking-wider font-semibold block';

export default function Hero({ onAddReservation, draft }: HeroProps) {
  const [date, setDate] = useState(nextOpenDate);
  const [time, setTime] = useState('20:30');
  const [guests, setGuests] = useState(2);
  const [zone, setZone] = useState<string>('Interior Principal');

  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [highlight, setHighlight] = useState(false);

  // Precarga desde "Repetir reserva", Disponibilidad o Ambientes
  useEffect(() => {
    if (!draft) return;
    const v = draft.values;
    if (v.date) setDate(v.date);
    if (v.time) setTime(v.time);
    if (v.guests) setGuests(v.guests);
    if (v.zone) setZone(v.zone);
    if (v.name !== undefined) setName(v.name);
    if (v.email !== undefined) setEmail(v.email);
    if (v.phone !== undefined) setPhone(v.phone);
    if (v.specialRequests !== undefined) setSpecialRequests(v.specialRequests);
    setHighlight(true);
    const t = window.setTimeout(() => setHighlight(false), 1600);
    return () => window.clearTimeout(t);
  }, [draft]);

  useEffect(() => {
    if (!showDetailsForm) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeModal();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showDetailsForm]);

  const dateIsClosed = isClosed(parseISODate(date));

  const handleOpenDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (dateIsClosed) return;
    setShowDetailsForm(true);
  };

  const closeModal = () => {
    setShowDetailsForm(false);
    if (isSuccess) {
      setIsSuccess(false);
      setSpecialRequests('');
    }
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    onAddReservation({ date, time, guests, zone, name, email, phone, specialRequests });
    setIsSuccess(true);
  };

  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative lg:min-h-[calc(100vh-4.5rem)] flex items-center overflow-hidden">
      {/* Foto de fondo con overlay oscuro para garantizar legibilidad */}
      <div className="absolute inset-0 z-0 img-placeholder" aria-hidden="true">
        <img
          src={heroImg}
          alt=""
          width={430}
          height={392}
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-background/40" />
        <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-background/90 via-background/70 to-background/10" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center py-14 md:py-20">
        <motion.div
          className="lg:col-span-7 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-primary tracking-[0.3em] text-xs md:text-sm font-semibold uppercase">
            Palermo · Buenos Aires
          </p>
          <h1 id="hero-title" className="font-display text-[2.6rem] leading-[1.1] sm:text-6xl lg:text-7xl italic text-primary">
            Tu mesa te espera en MESA.
          </h1>
          <p className="text-on-surface text-lg md:text-xl max-w-xl leading-relaxed">
            Cocina de autor con producto argentino, en una casona de Palermo. Elegí tu día, tu horario y tu rincón
            favorito: reservás en menos de un minuto.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
            <button
              onClick={() => scrollToId('reservas')}
              className="min-h-12 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold uppercase tracking-[0.2em] px-8 py-4 rounded-sm inline-flex items-center justify-center gap-3 gold-glow transition-colors"
            >
              Ver disponibilidad <ArrowRight size={16} aria-hidden="true" />
            </button>
            <button
              onClick={() => scrollToId('carta')}
              className="min-h-12 border border-primary/60 text-primary hover:bg-primary/10 text-xs font-bold uppercase tracking-[0.2em] px-8 py-4 rounded-sm transition-colors"
            >
              Ver carta
            </button>
          </div>

          <dl className="grid grid-cols-3 gap-4 sm:gap-6 pt-8 mt-4 border-t border-outline-variant/60 max-w-lg">
            {[
              ['98%', 'Satisfacción'],
              ['12', 'Premios'],
              ['150+', 'Etiquetas en cava'],
            ].map(([value, label]) => (
              <div key={label} className="flex flex-col-reverse justify-end">
                <dt className="text-on-surface-variant text-[11px] md:text-xs font-semibold uppercase tracking-wider mt-1">{label}</dt>
                <dd className="font-display italic text-primary text-3xl md:text-4xl font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
        </motion.div>

        {/* Reserva rápida */}
        <motion.div
          id="quick-book-form"
          className="lg:col-span-5 w-full"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className={`glass-card p-6 md:p-8 rounded-md shadow-2xl relative overflow-hidden transition-shadow duration-500 ${
              highlight ? 'ring-2 ring-primary shadow-[0_0_40px_rgba(212,175,55,0.35)]' : ''
            }`}
          >
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary to-primary-container" />

            <h2 className="font-serif text-3xl font-semibold text-primary mb-6">Reserva rápida</h2>

            <form onSubmit={handleOpenDetails} className="space-y-5" aria-label="Reserva rápida">
              <div className="space-y-1.5">
                <label htmlFor="qb-date" className={labelClass}>Fecha</label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" aria-hidden="true" />
                  <input
                    id="qb-date"
                    type="date"
                    required
                    min={todayISO()}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    aria-describedby="qb-date-help"
                    className={`${fieldClass} pl-10`}
                  />
                </div>
                <p id="qb-date-help" className={`text-xs ${dateIsClosed ? 'text-amber-300' : 'text-on-surface-variant'}`}>
                  {dateIsClosed ? 'Los lunes estamos cerrados. Elegí otro día.' : formatLongDate(date)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="qb-time" className={labelClass}>Hora</label>
                  <div className="relative">
                    <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" aria-hidden="true" />
                    <select id="qb-time" value={time} onChange={(e) => setTime(e.target.value)} className={`${fieldClass} pl-10`}>
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>{t} hs</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="qb-guests" className={labelClass}>Personas</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" aria-hidden="true" />
                    <select id="qb-guests" value={guests} onChange={(e) => setGuests(Number(e.target.value))} className={`${fieldClass} pl-10`}>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="qb-zone" className={labelClass}>Ambiente preferido</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" aria-hidden="true" />
                  <select id="qb-zone" value={zone} onChange={(e) => setZone(e.target.value)} className={`${fieldClass} pl-10`}>
                    {ZONES.map((z) => (
                      <option key={z.value} value={z.value}>{z.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={dateIsClosed}
                className="w-full min-h-12 bg-primary hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed text-on-primary p-4 rounded-sm text-xs font-bold uppercase tracking-[0.2em] transition-colors mt-2"
              >
                Continuar con la reserva
              </button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Modal de datos de contacto */}
      <AnimatePresence>
        {showDetailsForm && (
          <motion.div
            className="fixed inset-0 bg-background/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="booking-dialog-title"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25 }}
              className="bg-surface-container border border-outline-variant p-6 md:p-8 rounded-md max-w-md w-full relative my-auto"
            >
              <button
                onClick={closeModal}
                aria-label="Cerrar"
                className="absolute top-2 right-2 w-11 h-11 inline-flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
              >
                <X size={20} />
              </button>

              {isSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                    <CheckCircle2 size={44} aria-hidden="true" />
                  </div>
                  <h3 id="booking-dialog-title" className="font-serif text-3xl font-semibold text-primary">¡Reserva confirmada!</h3>
                  <p className="text-base text-on-surface-variant max-w-xs mx-auto">
                    Te esperamos el {formatLongDate(date)} a las {time} hs en {zone}, mesa para {guests}{' '}
                    {guests === 1 ? 'persona' : 'personas'}. Te mandamos el código QR a {email}.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
                    <button
                      onClick={() => {
                        closeModal();
                        scrollToId('reservas-dashboard');
                      }}
                      className="min-h-12 bg-primary text-on-primary px-6 rounded-sm text-xs font-bold uppercase tracking-[0.15em] hover:bg-primary-container transition-colors"
                    >
                      Ver mis reservas
                    </button>
                    <button
                      onClick={closeModal}
                      className="min-h-12 border border-outline-variant text-on-surface px-6 rounded-sm text-xs font-bold uppercase tracking-[0.15em] hover:border-primary transition-colors"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleConfirmReservation} className="space-y-4">
                  <div className="border-b border-outline-variant/60 pb-3 mb-2 pr-10">
                    <h3 id="booking-dialog-title" className="font-serif text-2xl font-semibold text-primary">Completá tu reserva</h3>
                    <p className="text-sm text-on-surface-variant mt-1">
                      {guests} {guests === 1 ? 'persona' : 'personas'} · {formatLongDate(date)} · {time} hs · {zone}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="bk-name" className={labelClass}>Nombre y apellido *</label>
                    <input id="bk-name" type="text" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Lucía Fernández" className={fieldClass} />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="bk-email" className={labelClass}>Email *</label>
                    <input id="bk-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" className={fieldClass} />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="bk-phone" className={labelClass}>Celular *</label>
                    <input id="bk-phone" type="tel" required autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+54 11 5555-5555" className={fieldClass} />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="bk-notes" className={labelClass}>Pedidos especiales o alergias (opcional)</label>
                    <textarea
                      id="bk-notes"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Ej. opción vegetariana, alergia a frutos secos…"
                      rows={2}
                      className={`${fieldClass} resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full min-h-12 bg-primary text-on-primary rounded-sm text-xs font-bold uppercase tracking-[0.2em] hover:bg-primary-container transition-colors mt-2"
                  >
                    Confirmar reserva
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
