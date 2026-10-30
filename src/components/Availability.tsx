import { useMemo } from 'react';
import { CalendarDays, Check, Flame } from 'lucide-react';
import type { Reservation } from '../types';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import { addDays, formatLongDate, isClosed, isClosedISO, isSlotPast, SHIFTS, toISODate, TIME_SLOTS, type BookingState } from '../lib/booking';
import { availableSlots } from '../lib/floorplan';

interface AvailabilityProps {
  booking: BookingState;
  reservations: Reservation[];
  onSelectDay: (date: string) => void;
  onSelectSlot: (date: string, time: string) => void;
}

export default function Availability({ booking, reservations, onSelectDay, onSelectSlot }: AvailabilityProps) {
  const days = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = addDays(today, i);
      const iso = toISODate(d);
      const closed = isClosed(d);
      const open = closed ? new Set<string>() : availableSlots(iso, booking.guests, reservations, booking.zone);
      const free = TIME_SLOTS.filter((t) => open.has(t) && !isSlotPast(iso, t)).length;
      return {
        iso,
        closed,
        open,
        free,
        dayName: d.toLocaleDateString('es-AR', { weekday: 'short' }).replace('.', ''),
        dateNum: d.getDate(),
        isToday: i === 0,
      };
    });
  }, [booking.guests, booking.zone, reservations]);

  const active = days.find((d) => d.iso === booking.date);
  // La fecha elegida puede estar fuera de los 7 días visibles (se cambió en el formulario)
  const activeOpen = useMemo(
    () => active?.open ?? availableSlots(booking.date, booking.guests, reservations, booking.zone),
    [active, booking.date, booking.guests, booking.zone, reservations]
  );

  return (
    <section id="reservas" className="py-20 md:py-28 px-5 sm:px-6 md:px-12 bg-surface border-t border-outline-variant/30">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Disponibilidad"
          title="Elegí tu día y horario"
          description={`Turnos libres para ${booking.guests} ${booking.guests === 1 ? 'persona' : 'personas'} en ${booking.zone}. Al elegir un horario, lo cargamos en tu reserva.`}
        />

        <Reveal>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-3" role="group" aria-label="Elegí un día">
            {days.map((day) => {
              const isSelected = booking.date === day.iso;
              const soldOut = day.free === 0;
              return (
                <button
                  key={day.iso}
                  type="button"
                  aria-pressed={isSelected}
                  aria-label={`${formatLongDate(day.iso)}: ${day.closed ? 'cerrado' : soldOut ? 'completo' : `${day.free} turnos libres`}`}
                  onClick={() => onSelectDay(day.iso)}
                  className={`text-center px-1 py-3 sm:p-4 min-h-[5.5rem] rounded-sm border transition-colors relative flex flex-col items-center justify-between ${
                    isSelected
                      ? 'bg-primary/15 border-primary'
                      : soldOut
                      ? 'border-outline-variant/40 bg-transparent hover:border-outline-variant'
                      : 'border-outline-variant/60 bg-surface-container-low hover:bg-surface-container-high hover:border-primary/50'
                  }`}
                >
                  {!soldOut && <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />}
                  <span className="text-[11px] text-on-surface-variant uppercase font-semibold tracking-wider">{day.isToday ? 'Hoy' : day.dayName}</span>
                  <span className={`font-serif text-3xl font-semibold leading-none my-1 ${isSelected ? 'text-primary' : soldOut ? 'text-on-surface-variant' : 'text-on-surface'}`}>
                    {day.dateNum}
                  </span>
                  <span className="text-[11px] uppercase tracking-tight">
                    {day.closed ? (
                      <span className="text-on-surface-variant">Cerrado</span>
                    ) : soldOut ? (
                      <span className="text-rose-300">Completo</span>
                    ) : (
                      <span className="text-emerald-300">{day.free} libres</span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal className="mt-8 md:mt-10">
          <div className="p-5 sm:p-6 md:p-8 bg-surface-container rounded-md border border-outline-variant/50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <p className="text-xs text-primary uppercase font-semibold tracking-widest flex items-center gap-1.5">
                  <CalendarDays size={14} aria-hidden="true" /> Horarios
                </p>
                <h3 className="font-serif text-2xl md:text-3xl italic font-semibold text-on-surface mt-1 first-letter:uppercase">
                  {formatLongDate(booking.date)}
                </h3>
              </div>
              {active && !active.closed && active.free > 0 && active.free <= 3 && (
                <p className="bg-primary/10 border border-primary/40 rounded-sm px-3 py-2 text-xs text-primary font-semibold flex items-center gap-1.5">
                  <Flame size={14} aria-hidden="true" /> Quedan pocos turnos
                </p>
              )}
            </div>

            {isClosedISO(booking.date) ? (
              <p className="text-on-surface-variant text-base py-6 text-center border border-dashed border-outline-variant/60 rounded-sm">
                Los lunes MESA descansa. Te esperamos de martes a domingo.
              </p>
            ) : (
              <div className="space-y-5">
                {SHIFTS.map((shift) => (
                  <div key={shift.id}>
                    <p className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold mb-2">{shift.label}</p>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
                      {shift.slots.map((time) => {
                        const past = isSlotPast(booking.date, time);
                        const open = activeOpen.has(time);
                        const disabled = past || !open;
                        const isSelected = booking.time === time && !disabled;
                        return (
                          <button
                            key={time}
                            type="button"
                            disabled={disabled}
                            onClick={() => onSelectSlot(booking.date, time)}
                            aria-pressed={isSelected}
                            aria-label={`${time} hs${past ? ', ya pasó' : !open ? ', completo' : ''}`}
                            className={`min-h-12 rounded-sm text-sm font-semibold tracking-wider relative transition-colors ${
                              disabled
                                ? 'border border-outline-variant/40 text-on-surface-variant/60 line-through cursor-not-allowed'
                                : isSelected
                                ? 'bg-primary text-on-primary border border-primary shadow-lg'
                                : 'border border-primary/50 text-primary hover:bg-primary/10'
                            }`}
                          >
                            {time}
                            {isSelected && (
                              <span className="absolute -top-2 -right-2 bg-on-primary text-primary rounded-full p-0.5 border border-primary" aria-hidden="true">
                                <Check size={10} />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 justify-center text-sm text-on-surface-variant border-t border-outline-variant/40 pt-6">
              <li className="flex items-center gap-2"><span className="w-3 h-3 bg-primary rounded-sm" aria-hidden="true" /> Seleccionado</li>
              <li className="flex items-center gap-2"><span className="w-3 h-3 border border-primary/60 rounded-sm" aria-hidden="true" /> Disponible</li>
              <li className="flex items-center gap-2"><span className="w-3 h-3 border border-outline-variant/50 rounded-sm" aria-hidden="true" /> Completo o pasado</li>
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
