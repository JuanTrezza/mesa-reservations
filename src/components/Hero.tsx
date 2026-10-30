import { useMemo, useState } from 'react';
import { m } from 'motion/react';
import { ArrowRight, Calendar, User, Clock, MapPin, LayoutGrid } from 'lucide-react';
import type { Reservation } from '../types';
import { FieldError, fieldClass, fieldState, labelClass } from './Field';
import { formatLongDate, isClosedISO, isSlotPast, MAX_GUESTS, scrollToId, SHIFTS, todayISO, ZONES, type BookingState } from '../lib/booking';
import { availableSlots, getTable } from '../lib/floorplan';
import { validateBooking, type BookingErrors } from '../lib/validation';
import heroImg from '../assets/images/hero.webp';
import heroImgSm from '../assets/images/hero-768.webp';

interface HeroProps {
  booking: BookingState;
  reservations: Reservation[];
  highlight: boolean;
  onChange: (patch: Partial<BookingState>) => void;
  onContinue: () => void;
}

export default function Hero({ booking, reservations, highlight, onChange, onContinue }: HeroProps) {
  const [submitted, setSubmitted] = useState(false);
  const errors: BookingErrors = validateBooking(booking, reservations);
  // La fecha y el horario se validan en vivo; el resto, al intentar continuar
  const visible: BookingErrors = submitted ? errors : { date: errors.date, time: errors.time, table: errors.table };

  const openSlots = useMemo(
    () => availableSlots(booking.date, booking.guests, reservations, booking.zone),
    [booking.date, booking.guests, booking.zone, reservations]
  );
  const table = getTable(booking.tableId);
  const closed = isClosedISO(booking.date);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const first = (['date', 'time', 'guests', 'zone', 'table'] as const).find((k) => errors[k]);
    if (first) {
      document.getElementById(first === 'table' ? 'qb-zone' : `qb-${first}`)?.focus();
      return;
    }
    setSubmitted(false);
    onContinue();
  };

  const describedBy = (key: keyof BookingErrors, extra?: string) =>
    [visible[key] ? `qb-${key}-error` : null, extra].filter(Boolean).join(' ') || undefined;

  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative lg:min-h-[calc(100vh-4.5rem)] flex items-center overflow-hidden">
      {/* Foto de fondo con overlay oscuro para garantizar legibilidad */}
      <div className="absolute inset-0 z-0 img-placeholder" aria-hidden="true">
        <img
          src={heroImg}
          srcSet={`${heroImgSm} 768w, ${heroImg} 1536w`}
          sizes="100vw"
          alt=""
          width={1536}
          height={864}
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover object-[72%_50%] lg:object-center"
        />
        <div className="absolute inset-0 bg-background/40" />
        <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-background/90 via-background/70 to-background/10" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center py-14 md:py-20">
        <m.div
          className="lg:col-span-7 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-primary tracking-[0.3em] text-xs md:text-sm font-semibold uppercase">Palermo · Buenos Aires</p>
          <h1 id="hero-title" className="font-display text-[2.6rem] leading-[1.1] sm:text-6xl lg:text-7xl italic text-primary">
            Tu mesa te espera en MESA.
          </h1>
          <p className="text-on-surface text-lg md:text-xl max-w-xl leading-relaxed">
            Cocina de autor con producto argentino, en una casona de Palermo. Elegí tu día, tu horario y tu mesa en el plano:
            reservás en menos de un minuto.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
            <button
              onClick={() => scrollToId('plano')}
              className="min-h-12 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold uppercase tracking-[0.2em] px-8 py-4 rounded-sm inline-flex items-center justify-center gap-3 gold-glow transition-colors"
            >
              Ver plano de mesas <ArrowRight size={16} aria-hidden="true" />
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
        </m.div>

        <m.div
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

            <form onSubmit={handleSubmit} noValidate className="space-y-5" aria-label="Reserva rápida">
              <div>
                <label htmlFor="qb-date" className={labelClass}>Fecha</label>
                <div className="relative mt-1.5">
                  <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" aria-hidden="true" />
                  <input
                    id="qb-date"
                    type="date"
                    required
                    min={todayISO()}
                    value={booking.date}
                    onChange={(e) => onChange({ date: e.target.value })}
                    aria-invalid={visible.date ? true : undefined}
                    aria-describedby={describedBy('date', visible.date ? undefined : 'qb-date-help')}
                    className={`${fieldClass} ${fieldState(visible.date)} pl-10`}
                  />
                </div>
                {visible.date ? (
                  <FieldError id="qb-date-error" message={visible.date} />
                ) : (
                  <p id="qb-date-help" className="text-xs text-on-surface-variant mt-1.5 first-letter:uppercase">
                    {booking.date ? formatLongDate(booking.date) : 'De martes a domingo'}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="qb-time" className={labelClass}>Hora</label>
                  <div className="relative mt-1.5">
                    <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" aria-hidden="true" />
                    <select
                      id="qb-time"
                      value={booking.time}
                      onChange={(e) => onChange({ time: e.target.value })}
                      aria-invalid={visible.time ? true : undefined}
                      aria-describedby={describedBy('time')}
                      className={`${fieldClass} ${fieldState(visible.time)} pl-10`}
                    >
                      {SHIFTS.map((shift) => (
                        <optgroup key={shift.id} label={shift.label}>
                          {shift.slots.map((t) => {
                            const past = !closed && isSlotPast(booking.date, t);
                            const full = !closed && !past && !openSlots.has(t);
                            return (
                              <option key={t} value={t} disabled={closed || past || full}>
                                {t} hs{past ? ' · ya pasó' : full ? ' · completo' : ''}
                              </option>
                            );
                          })}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="qb-guests" className={labelClass}>Personas</label>
                  <div className="relative mt-1.5">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" aria-hidden="true" />
                    <select
                      id="qb-guests"
                      value={booking.guests}
                      onChange={(e) => onChange({ guests: Number(e.target.value) })}
                      aria-invalid={visible.guests ? true : undefined}
                      aria-describedby={describedBy('guests')}
                      className={`${fieldClass} ${fieldState(visible.guests)} pl-10`}
                    >
                      {Array.from({ length: MAX_GUESTS }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              {(visible.time || visible.guests) && (
                <div className="-mt-3">
                  <FieldError id="qb-time-error" message={visible.time} />
                  <FieldError id="qb-guests-error" message={visible.guests} />
                </div>
              )}

              <div>
                <label htmlFor="qb-zone" className={labelClass}>Ambiente preferido</label>
                <div className="relative mt-1.5">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" aria-hidden="true" />
                  <select
                    id="qb-zone"
                    value={booking.zone}
                    onChange={(e) => onChange({ zone: e.target.value })}
                    aria-invalid={visible.table ? true : undefined}
                    aria-describedby={describedBy('table', 'qb-table-status')}
                    className={`${fieldClass} ${fieldState(visible.table)} pl-10`}
                  >
                    {ZONES.map((z) => (
                      <option key={z.value} value={z.value}>{z.label}</option>
                    ))}
                  </select>
                </div>
                <FieldError id="qb-table-error" message={visible.table} />
                <p id="qb-table-status" className="flex items-center justify-between gap-2 text-sm text-on-surface-variant mt-2">
                  <span>{table ? <>Mesa <strong className="text-on-surface">{table.id}</strong> · {table.seats} lugares</> : 'Sin mesa elegida: te asignamos la mejor'}</span>
                  <button
                    type="button"
                    onClick={() => scrollToId('plano')}
                    className="min-h-11 inline-flex items-center gap-1.5 text-primary font-semibold hover:text-primary-container shrink-0"
                  >
                    <LayoutGrid size={15} aria-hidden="true" /> {table ? 'Cambiar' : 'Elegir en el plano'}
                  </button>
                </p>
              </div>

              <button
                type="submit"
                className="w-full min-h-12 bg-primary hover:bg-primary-container text-on-primary p-4 rounded-sm text-xs font-bold uppercase tracking-[0.2em] transition-colors"
              >
                Continuar con la reserva
              </button>
            </form>
          </div>
        </m.div>
      </div>
    </section>
  );
}
