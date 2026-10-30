import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Star, QrCode, Trash2, RefreshCcw, X } from 'lucide-react';
import { Reservation } from '../types';
import Reveal from './Reveal';
import { formatLongDate, parseISODate, scrollToId } from '../lib/booking';

interface ReservasDashboardProps {
  reservations: Reservation[];
  onCancelReservation: (id: string) => void;
  onRepeatReservation: (res: Reservation) => void;
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

export default function ReservasDashboard({ reservations, onCancelReservation, onRepeatReservation }: ReservasDashboardProps) {
  const [activeQrRes, setActiveQrRes] = useState<Reservation | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const activeReservations = reservations
    .filter((r) => r.status === 'confirmada')
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const pastReservations = reservations
    .filter((r) => r.status !== 'confirmada')
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));

  const loyaltyPoints = 200 + reservations.filter((r) => r.status !== 'cancelada').length * 45;

  useEffect(() => {
    if (!activeQrRes) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setActiveQrRes(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeQrRes]);

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

            {activeReservations.length === 0 ? (
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
                  {activeReservations.map((res) => (
                    <motion.li
                      key={res.id}
                      layout
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
                          </p>
                          {res.specialRequests && (
                            <p className="text-on-surface-variant text-sm italic break-words">“{res.specialRequests}”</p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:justify-end border-t border-outline-variant/40 md:border-0 pt-3 md:pt-0">
                        <span className="bg-emerald-500/10 text-emerald-300 text-xs uppercase font-bold tracking-widest px-3 py-1.5 rounded-sm border border-emerald-500/30 mr-auto md:mr-2">
                          Confirmada
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
                              onClick={() => setActiveQrRes(res)}
                              className="min-h-11 px-4 text-primary hover:bg-primary/10 border border-primary/40 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 rounded-sm"
                            >
                              <QrCode size={16} aria-hidden="true" /> Ver QR
                            </button>
                            <button
                              onClick={() => setConfirmingId(res.id)}
                              className="min-h-11 px-3 text-on-surface-variant hover:text-rose-300 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 rounded-sm"
                            >
                              <Trash2 size={16} aria-hidden="true" /> Cancelar
                            </button>
                          </>
                        )}
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>

          {pastReservations.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Historial</h3>

              <ul className="space-y-3">
                {pastReservations.map((res) => (
                  <li
                    key={res.id}
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
                      {res.status === 'cancelada' ? (
                        <span className="text-rose-300 text-xs uppercase font-bold tracking-widest bg-rose-500/10 px-3 py-1.5 border border-rose-400/30 rounded-sm">
                          Cancelada
                        </span>
                      ) : (
                        <span className="text-on-surface-variant text-xs uppercase font-bold tracking-widest bg-surface-container py-1.5 px-3 border border-outline-variant/50 rounded-sm">
                          Finalizada
                        </span>
                      )}

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

      <AnimatePresence>
        {activeQrRes && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setActiveQrRes(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="qr-title"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-surface-container border border-outline-variant px-6 py-8 rounded-md max-w-sm w-full text-center space-y-5 relative"
            >
              <button
                onClick={() => setActiveQrRes(null)}
                aria-label="Cerrar"
                className="absolute top-2 right-2 w-11 h-11 inline-flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
              >
                <X size={20} />
              </button>

              <div className="border-b border-outline-variant/50 pb-3">
                <h4 id="qr-title" className="font-serif text-2xl italic font-semibold text-primary">Tu acceso a MESA</h4>
                <p className="text-sm text-on-surface-variant">Código de check-in</p>
              </div>

              <div className="bg-white p-4 rounded-sm inline-block mx-auto shadow-2xl" aria-hidden="true">
                <div className="w-44 h-44 bg-neutral-900 flex flex-col justify-between p-3 rounded-sm text-white font-mono text-[10px] relative overflow-hidden">
                  <div className="flex justify-between">
                    <div className="w-10 h-10 border-2 border-white bg-white/10 rounded-sm" />
                    <div className="w-10 h-10 border-2 border-white bg-white/10 rounded-sm" />
                  </div>
                  <div className="absolute inset-x-0 inset-y-12 flex flex-wrap gap-1 leading-none justify-center select-none">
                    <span className="text-primary font-bold">M E S A</span>
                    <span className="text-neutral-300">P A L E R M O</span>
                    <span className="text-primary font-bold">R E S E R V A</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="w-10 h-10 border-2 border-white bg-white/10 rounded-sm" />
                    <div className="w-8 h-8 flex items-center justify-center font-display italic text-xs text-primary">M</div>
                  </div>
                </div>
              </div>

              <div className="space-y-1 text-sm">
                <p className="text-on-surface font-semibold">Titular: {activeQrRes.name}</p>
                <p className="text-on-surface-variant">
                  {activeQrRes.guests} {activeQrRes.guests === 1 ? 'persona' : 'personas'} · {activeQrRes.zone}
                </p>
                <p className="text-on-surface-variant first-letter:uppercase">
                  {formatLongDate(activeQrRes.date)} · {activeQrRes.time} hs
                </p>
                <p className="text-primary font-semibold font-mono tracking-widest uppercase pt-2">
                  MESA-{activeQrRes.id.replace('res-', '').slice(0, 6)}
                </p>
              </div>

              <p className="text-sm text-on-surface-variant leading-relaxed">
                Mostrá este código en la recepción y te acompañamos directo a tu mesa.
              </p>

              <button
                onClick={() => setActiveQrRes(null)}
                className="w-full min-h-12 bg-primary text-on-primary text-xs font-bold uppercase tracking-[0.1em] rounded-sm hover:bg-primary-container transition-colors"
              >
                Listo
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
