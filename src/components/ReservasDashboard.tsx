import React, { useState } from 'react';
import { Star, QrCode, ClipboardList, Trash2, Calendar, RefreshCcw, HelpCircle, CheckCircle } from 'lucide-react';
import { Reservation } from '../types';

interface ReservasDashboardProps {
  reservations: Reservation[];
  onCancelReservation: (id: string) => void;
  onRepeatReservation: (res: Reservation) => void;
}

export default function ReservasDashboard({
  reservations,
  onCancelReservation,
  onRepeatReservation,
}: ReservasDashboardProps) {
  // Simple State to view QR Code popup
  const [activeQrRes, setActiveQrRes] = useState<Reservation | null>(null);

  // Filter reservations
  const activeReservations = reservations.filter((r) => r.status === 'confirmada');
  const pastReservations = reservations.filter((r) => r.status === 'finalizada' || r.status === 'cancelada');

  // Compute points: e.g. 200 points base + 45 for each active/past non-cancelled reservation
  const completedOrConfirmedCount = reservations.filter((r) => r.status !== 'cancelada').length;
  const loyaltyPoints = 200 + completedOrConfirmedCount * 45;

  return (
    <section id="reservas-dashboard" className="py-20 px-6 md:px-12 max-w-7xl mx-auto border-t border-outline-variant/15">
      <div className="bg-surface-container-low border border-outline-variant/20 p-6 md:p-10 rounded-sm shadow-xl">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b border-outline-variant/15">
          <div className="space-y-1">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-on-surface">
              Mis Reservas
            </h2>
            <p className="text-on-surface-variant text-sm">
              Gestione sus visitas programadas, códigos QR de acceso automático y puntos de fidelidad.
            </p>
          </div>

          {/* Loyalty badge */}
          <div className="bg-primary/10 border border-primary/30 px-5 py-2.5 rounded-full flex items-center gap-2 shadow-inner">
            <Star size={16} className="text-primary fill-primary animate-pulse" />
            <span className="text-primary font-sans text-xs font-bold uppercase tracking-[0.1em]">
              {loyaltyPoints} PUNTOS MESA
            </span>
          </div>
        </div>

        {/* Reservations Container */}
        <div className="space-y-6">
          {/* Active Reservations Header */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase font-sans tracking-widest text-primary font-bold">
              Turnos Confirmados
            </h3>

            {activeReservations.length === 0 ? (
              <div className="text-center py-8 bg-surface-container/60 rounded border border-dashed border-outline-variant/10">
                <p className="text-on-surface-variant text-xs italic">
                  No tiene ninguna reserva activa en este momento.
                </p>
                <button
                  onClick={() => {
                    document.getElementById('quick-book-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="mt-3 text-primary text-xs font-bold underline hover:text-primary-container cursor-pointer"
                >
                  ¡Reserve una mesa ahora!
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {activeReservations.map((res) => {
                  // Format Date nicely: e.g. "2026-06-15" to month and day
                  const d = new Date(res.date);
                  const isInvalid = isNaN(d.getTime());
                  const dayNum = isInvalid ? res.date.split('-')[2] || '15' : d.getDate();
                  const monthName = isInvalid ? 'JUNIO' : d.toLocaleDateString('es-ES', { month: 'long' }).toUpperCase();

                  return (
                    <div
                      key={res.id}
                      className="flex flex-col md:flex-row justify-between p-6 bg-surface-bright rounded-sm border-l-4 border-primary shadow-md gap-4 items-start md:items-center hover:bg-surface-bright/80 transition-all"
                    >
                      {/* Left: Date pill & Details */}
                      <div className="flex gap-6 items-center">
                        <div className="text-center min-w-[70px] bg-background p-2 rounded border border-outline-variant/25">
                          <p className="text-[9px] uppercase text-primary font-bold tracking-wider">
                            {monthName.substring(0, 4)}
                          </p>
                          <p className="text-3xl font-serif font-bold text-primary leading-none">
                            {dayNum}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-serif text-lg font-bold text-on-surface flex items-center gap-2">
                            Mesa para {res.guests} comensales
                          </h4>
                          <p className="text-on-surface-variant text-xs md:text-sm font-sans">
                            <span className="font-bold text-on-surface">{res.time} hs</span> · {res.zone}
                          </p>
                          {res.specialRequests && (
                            <p className="text-on-surface-variant/80 text-[11px] font-serif italic max-w-sm">
                              Req: "{res.specialRequests}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Status, QR View button, and Cancel button */}
                      <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t border-outline-variant/15 md:border-0 pt-4 md:pt-0">
                        <div className="flex items-center gap-2">
                          <span className="bg-emerald-500/10 text-emerald-400 text-[10px] md:text-xs uppercase font-bold tracking-widest px-3 py-1 rounded border border-emerald-500/20">
                            Confirmada
                          </span>
                        </div>

                        <div className="flex gap-4 items-center">
                          {/* QR Code Action */}
                          <button
                            onClick={() => setActiveQrRes(res)}
                            className="text-primary hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer bg-[#ffffff]/5 hover:bg-[#ffffff]/10 py-1.5 px-3 rounded"
                          >
                            <QrCode size={14} /> Ver QR
                          </button>

                          {/* Cancel Action */}
                          <button
                            onClick={() => {
                              if (confirm('¿Está seguro de que desea cancelar su reserva premium?')) {
                                onCancelReservation(res.id);
                              }
                            }}
                            className="text-on-surface-variant hover:text-rose-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer py-1.5"
                          >
                            <Trash2 size={14} /> Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Past/Cancelled Reservations */}
          {pastReservations.length > 0 && (
            <div className="space-y-4 pt-4">
              <h3 className="text-xs uppercase font-sans tracking-widest text-on-surface-variant font-bold">
                Historial de Reservas
              </h3>
              
              <div className="space-y-3 opacity-80">
                {pastReservations.map((res) => {
                  const d = new Date(res.date);
                  const isInvalid = isNaN(d.getTime());
                  const dayNum = isInvalid ? res.date.split('-')[2] || '28' : d.getDate();
                  const monthName = isInvalid ? 'ABRIL' : d.toLocaleDateString('es-ES', { month: 'long' }).toUpperCase();

                  return (
                    <div
                      key={res.id}
                      className="flex flex-col md:flex-row justify-between p-5 bg-surface border border-outline-variant/10 rounded-sm gap-4 items-start md:items-center"
                    >
                      <div className="flex gap-5 items-center">
                        <div className="text-center min-w-[64px] bg-surface-container p-2 rounded">
                          <p className="text-[9px] uppercase text-on-surface-variant tracking-wider">
                            {monthName.substring(0, 4)}
                          </p>
                          <p className="text-2xl font-serif font-bold text-on-surface-variant leading-none">
                            {dayNum}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-serif text-base font-bold text-on-surface-variant">
                            Mesa para {res.guests} personas
                          </h4>
                          <p className="text-on-surface-variant text-xs">
                            {res.time} hs · {res.zone}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                        {res.status === 'cancelada' ? (
                          <span className="text-rose-400/70 text-[10px] uppercase font-bold tracking-widest bg-rose-500/5 px-2.5 py-1 border border-rose-500/10">
                            Cancelada
                          </span>
                        ) : (
                          <span className="text-on-surface-variant/70 text-[10px] uppercase font-bold tracking-widest bg-surface-container py-1 px-2.5 rounded">
                            Finalizada
                          </span>
                        )}

                        <button
                          onClick={() => onRepeatReservation(res)}
                          className="text-primary hover:underline hover:text-primary-container font-sans text-xs uppercase font-bold tracking-widest flex items-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCcw size={12} /> Repetir Reserva
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* QR Code detail Modal */}
      {activeQrRes && (
        <div className="fixed inset-0 bg-[#000000]/80 backdrop-blur-md z-[110] flex items-center justify-center p-4">
          <div className="bg-surface-container border border-outline-variant/30 px-6 py-8 rounded-lg max-w-sm w-full text-center space-y-6 relative">
            <button
              onClick={() => setActiveQrRes(null)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors font-bold cursor-pointer"
            >
              ✕
            </button>

            <div className="border-b border-outline-variant/20 pb-2">
              <h4 className="font-serif text-xl italic text-primary">Acceso Inteligente</h4>
              <p className="text-xs text-on-surface-variant">Código de Check-in MESA</p>
            </div>

            {/* Simulated nice luxury QR and details */}
            <div className="bg-white p-4 rounded-sm inline-block mx-auto shadow-2xl relative">
              {/* Fake aesthetic QR drawing using vectors to guarantee precision */}
              <div className="w-44 h-44 bg-neutral-900 flex flex-col justify-between p-3 rounded text-white font-mono text-[9px] relative overflow-hidden">
                <div className="flex justify-between">
                  <div className="w-10 h-10 border-2 border-white bg-white/10 rounded-sm"></div>
                  <div className="w-10 h-10 border-2 border-white bg-white/10 rounded-sm"></div>
                </div>
                {/* Visual tech matrix mockup decoration */}
                <div className="absolute inset-x-0 inset-y-12 flex flex-wrap gap-1 leading-none text-center select-none justify-center">
                  <span className="text-primary font-bold">M E S A </span>
                  <span className="text-[#cac6be]">G O U R M E T </span>
                  <span className="text-primary font-bold">R E S E R V E </span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="w-10 h-10 border-2 border-white bg-white/10 rounded-sm"></div>
                  <div className="w-8 h-8 flex items-center justify-center font-display italic text-[11px] text-primary">
                    M
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1 font-sans text-xs">
              <p className="text-on-surface font-bold">Titular: {activeQrRes.name}</p>
              <p className="text-on-surface-variant">
                Mesa de {activeQrRes.guests} pers. · {activeQrRes.zone}
              </p>
              <p className="text-primary font-semibold font-mono tracking-widest uppercase mt-2">
                QR-TICKET: MESA-REF-{activeQrRes.id.substring(0, 6)}
              </p>
            </div>

            <p className="text-[10px] text-on-surface-variant italic leading-relaxed">
              Muestre este código al maitre en la recepción y será conducido directamente a su mesa asignada.
            </p>

            <button
              onClick={() => setActiveQrRes(null)}
              className="w-full bg-primary-container text-on-primary font-sans text-xs font-bold uppercase tracking-[0.1em] py-2.5 rounded-sm hover:bg-primary transition-all cursor-pointer"
            >
              Listo, cerrar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
