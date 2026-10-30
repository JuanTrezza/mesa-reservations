import { useState } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { Star, QrCode, Trash2, RefreshCcw } from 'lucide-react';
import { Reservation } from '../types';
import Reveal from './Reveal';
import { formatLongDate, isActive, parseISODate, scrollToId, STATUS_LABEL } from '../lib/booking';
import { getTable } from '../lib/floorplan';

interface ReservasDashboardProps {
  /** Solo las reservas hechas desde este dispositivo */
  reservations: Reservation[];
  onCancelReservation: (id: string) => void;
  onRepeatReservation: (res: Reservation) => void;
  onShowQR: (res: Reservation) => void;
}

function DateChip({ iso, muted = false }: { iso: string; muted?: boolean }) {
  const d = parseISODate(iso);
  const month = d.toLocaleDateString('es-AR', { month: 'short' }).replace('.', '');
  return (
    <div
      className={`text-center w-16 shrink-0 py-2 rounded-sm border ${
        muted ? 'bg-surface-container border-outline-variant/50' : 'bg-background border-primary/40'
      }`}
      aria-hidden="true"
    >
      <p className={`text-[11px] uppercase font-semibold tracking-wider ${muted ? 'text-on-surface-variant' : 'text-primary'}`}>{month}</p>
      <p className={`text-3xl font-serif font-semibold leading-none mt-0.5 ${muted ? 'text-on-surface-variant' : 'text-primary'}`}>
        {d.getDate()}
      </p>
    </div>
  );
}

const BADGE: Record<Reservation['status'], string> = {
  confirmada: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  pendiente: 'bg-amber-500/10 text-amber-200 border-amber-400/40',
  llego: 'bg-sky-500/10 text-sky-200 border-sky-400/40',
  finalizada: 'bg-surface-container text-on-surface-variant border-outline-variant/50',
  cancelada: 'bg-rose-500/10 text-rose-300 border-rose-400/30',
};

export default function ReservasDashboard({ reservations, onCancelReservation, onRepeatReservation, onShowQR }: ReservasDashboardProps) {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const upcoming = reservations.filter(isActive).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const history = reservations.filter((r) => !isActive(r)).sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
  const loyaltyPoints = 200 + reservations.filter((r) => r.status !== 'cancelada').length * 45;

  return (
    <section id="reservas-dashboard" aria-labelledby="dashboard-title" className="py-20 md:py-28 px-5 sm:px-6 md:px-12 bg-background border-t border-outline-variant/30">
      <Reveal className="max-w-5xl mx-auto bg-surface-container-low border border-outline-variant/50 p-5 sm:p-6 md:p-10 rounded-md shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 mb-8 pb-6 border-b border-outline-variant/50">
          <div className="space-y-2">
            <p className="text-primary text-xs font-semibold uppercase tracking-[0.25em]">Tu cuenta</p>
            <h2 id="dashboard-title" className="font-serif text-4xl font-semibold italic text-on-surface">Mis reservas</h2>
            <p className="text-on-surface-variant text-base">Gestioná tus visitas, tu código QR de acceso y tus puntos MESA.</p>
          </div>
          <p className="bg-primary/10 border border-primary/40 px-5 py-2.5 rounded-full flex items-center gap-2">
            <Star size={16} className="text-primary fill-current" aria-hidden="true" />
            <span className="text-primary text-xs font-bold uppercase tracking-[0.1em]">{loyaltyPoints} puntos MESA</span>
          </p>
        </div>

        <div className="space-y-10">
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-primary font-bold">Próximas</h3>

            {upcoming.length === 0 ? (
              <div className="text-center py-8 px-4 bg-surface-container/60 rounded-sm border border-dashed border-outline-variant/60">
                <p className="text-on-surface-variant text-base">No tenés reservas activas por ahora.</p>
                <button
                  onClick={() => scrollToId('quick-book-form', 'center')}
                  className="mt-2 min-h-11 px-3 text-primary text-sm font-semibold underline underline-offset-4 hover:text-primary-container"
                >
                  Reservá una mesa
                </button>
              </div>
            ) : (
              <ul className="space-y-4">
                <AnimatePresence initial={false}>
                  {upcoming.map((res) => {
                    const table = getTable(res.tableId);
                    return (
                      <m.li
                        key={res.id}
                        layout
                        data-testid="my-reservation"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col md:flex-row justify-between p-4 sm:p-6 bg-surface-bright rounded-sm border-l-4 border-primary shadow-md gap-4 md:items-center"
                      >
                        <div className="flex gap-4 sm:gap-6 items-center min-w-0">
                          <DateChip iso={res.date} />
                          <div className="space-y-1 min-w-0">
                            <h4 className="font-serif text-xl font-semibold text-on-surface">
                              Mesa para {res.guests} {res.guests === 1 ? 'persona' : 'personas'}
                            </h4>
                            <p className="text-on-surface-variant text-sm">
                              <span className="first-letter:uppercase inline-block">{formatLongDate(res.date)}</span> ·{' '}
                              <span className="font-semibold text-on-surface">{res.time} hs</span> · {res.zone}
                              {table ? ` · Mesa ${table.id}` : ''}
                            </p>
                            <p className="text-on-surface-variant text-xs font-mono tracking-wider">{res.code}</p>
                            {res.specialRequests && <p className="text-on-surface-variant text-sm italic break-words">“{res.specialRequests}”</p>}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:justify-end border-t border-outline-variant/40 md:border-0 pt-3 md:pt-0">
                          <span className={`text-xs uppercase font-bold tracking-widest px-3 py-1.5 rounded-sm border mr-auto md:mr-2 ${BADGE[res.status]}`}>
                            {STATUS_LABEL[res.status]}
                          </span>

                          {confirmingId === res.id ? (
                            <div className="flex items-center gap-2" role="group" aria-label="Confirmar cancelación">
                              <span className="text-sm text-on-surface">¿Cancelar?</span>
                              <button
                                onClick={() => {
                                  setConfirmingId(null);
                                  onCancelReservation(res.id);
                                }}
                                className="min-h-11 px-4 bg-rose-500/15 text-rose-200 border border-rose-400/50 hover:bg-rose-500/25 text-xs font-bold uppercase tracking-wider rounded-sm"
                              >
                                Sí, cancelar
                              </button>
                              <button
                                onClick={() => setConfirmingId(null)}
                                className="min-h-11 px-4 text-on-surface-variant hover:text-on-surface text-xs font-bold uppercase tracking-wider rounded-sm"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() => onShowQR(res)}
                                className="min-h-11 px-4 text-primary hover:bg-primary/10 border border-primary/40 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 rounded-sm"
                              >
                                <QrCode size={16} aria-hidden="true" /> Ver QR
                              </button>
                              {res.status !== 'llego' && (
                                <button
                                  onClick={() => setConfirmingId(res.id)}
                                  className="min-h-11 px-3 text-on-surface-variant hover:text-rose-300 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 rounded-sm"
                                >
                                  <Trash2 size={16} aria-hidden="true" /> Cancelar
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </m.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            )}
          </div>

          {history.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Historial</h3>
              <ul className="space-y-3">
                {history.map((res) => (
                  <li
                    key={res.id}
                    data-testid="my-reservation-history"
                    className="flex flex-col md:flex-row justify-between p-4 sm:p-5 bg-surface border border-outline-variant/40 rounded-sm gap-4 md:items-center"
                  >
                    <div className="flex gap-4 sm:gap-5 items-center">
                      <DateChip iso={res.date} muted />
                      <div>
                        <h4 className="font-serif text-lg font-semibold text-on-surface">
                          Mesa para {res.guests} {res.guests === 1 ? 'persona' : 'personas'}
                        </h4>
                        <p className="text-on-surface-variant text-sm">
                          {res.time} hs · {res.zone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 justify-between md:justify-end">
                      <span className={`text-xs uppercase font-bold tracking-widest px-3 py-1.5 border rounded-sm ${BADGE[res.status]}`}>
                        {STATUS_LABEL[res.status]}
                      </span>
                      <button
                        onClick={() => onRepeatReservation(res)}
                        className="min-h-11 px-3 text-primary hover:text-primary-container text-xs uppercase font-bold tracking-widest inline-flex items-center gap-1.5 rounded-sm whitespace-nowrap"
                      >
                        <RefreshCcw size={14} aria-hidden="true" /> Repetir reserva
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
