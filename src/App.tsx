import { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { LazyMotion, MotionConfig } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Availability from './components/Availability';
import FloorPlan from './components/FloorPlan';
import Ambientes from './components/Ambientes';
import Carta from './components/Carta';
import Proceso from './components/Proceso';
import ReservasDashboard from './components/ReservasDashboard';
import Testimonios from './components/Testimonios';
import FAQ from './components/FAQ';
import Contacto from './components/Contacto';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import Toast, { type ToastData } from './components/Toast';
import BookingDetailsDialog from './components/BookingDetailsDialog';
import ReservationDialog from './components/ReservationDialog';
import { Reservation, ReservationStatus } from './types';
import { makeReservationCode, nextOpenDate, scrollToId, TIME_SLOTS, type BookingState } from './lib/booking';
import { availableSlots, freeTables, getTable, occupiedTables, tableFits, type Table } from './lib/floorplan';
import { loadReservations, saveReservations } from './lib/storage';
import { validateBooking } from './lib/validation';

const AdminPanel = lazy(() => import('./admin/AdminPanel'));
const loadMotionFeatures = () => import('./lib/motion-features').then((mod) => mod.default);

const INITIAL_BOOKING: BookingState = {
  date: nextOpenDate(),
  time: '20:30',
  guests: 2,
  zone: 'Interior Principal',
  tableId: null,
  name: '',
  email: '',
  phone: '',
  specialRequests: '',
};

function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  const navigate = useCallback((to: string) => {
    if (to) window.location.hash = to;
    else {
      history.pushState(null, '', window.location.pathname + window.location.search);
      setHash('');
    }
    window.scrollTo(0, 0);
  }, []);
  return { hash, navigate };
}

export default function App() {
  const [reservations, setReservations] = useState<Reservation[]>(loadReservations);
  const [booking, setBooking] = useState<BookingState>(() => {
    // Arranca en el primer horario de cena con lugar (o el primero del día)
    const open = availableSlots(INITIAL_BOOKING.date, INITIAL_BOOKING.guests, reservations, INITIAL_BOOKING.zone);
    const time = TIME_SLOTS.find((t) => t >= INITIAL_BOOKING.time && open.has(t)) ?? TIME_SLOTS.find((t) => open.has(t));
    return { ...INITIAL_BOOKING, time: time ?? INITIAL_BOOKING.time };
  });
  const [highlightNonce, setHighlightNonce] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [qr, setQr] = useState<{ reservation: Reservation; justBooked: boolean } | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);
  const { hash, navigate } = useHashRoute();
  const isAdmin = hash.startsWith('#/admin');

  useEffect(() => saveReservations(reservations), [reservations]);

  // El resaltado del formulario dura un instante después de cada precarga
  const [highlight, setHighlight] = useState(false);
  useEffect(() => {
    if (!highlightNonce) return;
    setHighlight(true);
    const t = window.setTimeout(() => setHighlight(false), 1600);
    return () => window.clearTimeout(t);
  }, [highlightNonce]);

  const notify = useCallback((t: Omit<ToastData, 'id'>) => setToast({ ...t, id: Date.now() }), []);
  const dismissToast = useCallback(() => setToast(null), []);

  /** Actualiza la reserva en curso y suelta la mesa elegida si dejó de servir. */
  const updateBooking = useCallback(
    (patch: Partial<BookingState>) => {
      setBooking((prev) => {
        const next = { ...prev, ...patch };
        const table = getTable(next.tableId);
        if (
          table &&
          (table.zone !== next.zone ||
            !tableFits(table, next.guests) ||
            occupiedTables(next.date, next.time, reservations).has(table.id))
        ) {
          next.tableId = null;
        }
        return next;
      });
    },
    [reservations]
  );

  /** Precarga datos en la reserva rápida y lleva al usuario hasta el formulario. */
  const prefillBooking = (patch: Partial<BookingState>, target = 'quick-book-form') => {
    updateBooking(patch);
    setHighlightNonce(Date.now());
    scrollToId(target, 'center');
  };

  const handleSelectTable = (table: Table) => {
    updateBooking({ zone: table.zone, tableId: table.id });
    setHighlightNonce(Date.now());
  };

  const openDetails = () => {
    const errors = validateBooking(booking, reservations);
    if (Object.keys(errors).length) {
      scrollToId('quick-book-form', 'center');
      notify({ title: 'Revisá tu reserva', message: Object.values(errors)[0], tone: 'info' });
      return;
    }
    setDetailsOpen(true);
  };

  const confirmBooking = () => {
    const errors = validateBooking(booking, reservations);
    if (Object.keys(errors).length) {
      setDetailsOpen(false);
      notify({ title: 'No pudimos confirmar', message: Object.values(errors)[0], tone: 'info' });
      return;
    }
    const table = getTable(booking.tableId) ?? freeTables(booking.date, booking.time, booking.guests, reservations, booking.zone)[0];
    const codes = new Set(reservations.map((r) => r.code));
    let code = makeReservationCode();
    while (codes.has(code)) code = makeReservationCode();

    const fresh: Reservation = {
      id: 'res-' + Math.random().toString(36).slice(2, 11),
      code,
      date: booking.date,
      time: booking.time,
      guests: booking.guests,
      zone: booking.zone,
      tableId: table?.id,
      // El Salón Privado lo confirma el restaurante
      status: booking.zone === 'Salón Privado' ? 'pendiente' : 'confirmada',
      name: booking.name.trim(),
      email: booking.email.trim(),
      phone: booking.phone.trim(),
      specialRequests: booking.specialRequests.trim(),
      createdAt: new Date().toISOString(),
      mine: true,
    };
    setReservations((prev) => [fresh, ...prev]);
    setBooking((b) => ({ ...b, tableId: null, specialRequests: '' }));
    setDetailsOpen(false);
    setQr({ reservation: fresh, justBooked: true });
  };

  const setStatus = useCallback((id: string, status: ReservationStatus) => {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }, []);

  const handleCancelReservation = (id: string) => {
    setStatus(id, 'cancelada');
    notify({ title: 'Reserva cancelada', message: 'Liberamos tu mesa. Podés repetirla cuando quieras desde el historial.', tone: 'info' });
  };

  const handleRepeatReservation = (res: Reservation) => {
    prefillBooking({
      date: nextOpenDate(),
      time: res.time,
      guests: res.guests,
      zone: res.zone,
      tableId: null,
      name: res.name,
      email: res.email,
      phone: res.phone,
      specialRequests: res.specialRequests ?? '',
    });
    notify({
      title: 'Cargamos tu reserva anterior',
      message: `${res.guests} personas · ${res.zone} · ${res.time} hs. Revisá la fecha y confirmá.`,
    });
  };

  const mine = useMemo(() => reservations.filter((r) => r.mine), [reservations]);
  // El modal muestra siempre la versión actual de la reserva (por si cambió de estado)
  const qrReservation = qr ? reservations.find((r) => r.id === qr.reservation.id) ?? qr.reservation : null;

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion="user">
        <div className="bg-background text-on-background min-h-screen font-sans overflow-x-clip selection:bg-primary-container selection:text-on-primary-container">
          {isAdmin ? (
            <Suspense fallback={<p className="p-10 text-on-surface-variant">Cargando panel…</p>}>
              <AdminPanel reservations={reservations} onSetStatus={setStatus} onNotify={notify} onExit={() => navigate('')} />
            </Suspense>
          ) : (
            <>
              <a
                href="#inicio"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:bg-primary focus:text-on-primary focus:px-4 focus:py-3 focus:rounded-sm"
              >
                Saltar al contenido
              </a>

              <Navbar onOpenQuickBook={() => scrollToId('quick-book-form', 'center')} />

              <main className="pt-[4.5rem]">
                <Hero booking={booking} reservations={reservations} highlight={highlight} onChange={updateBooking} onContinue={openDetails} />
                <Availability
                  booking={booking}
                  reservations={reservations}
                  onSelectDay={(date) => updateBooking({ date })}
                  onSelectSlot={(date, time) => {
                    updateBooking({ date, time });
                    setHighlightNonce(Date.now());
                    scrollToId('plano');
                  }}
                />
                <FloorPlan booking={booking} reservations={reservations} onSelectTable={handleSelectTable} onContinue={openDetails} />
                <Ambientes onSelectZone={(zone) => prefillBooking({ zone }, 'plano')} />
                <Carta />
                <Proceso />
                <ReservasDashboard
                  reservations={mine}
                  onCancelReservation={handleCancelReservation}
                  onRepeatReservation={handleRepeatReservation}
                  onShowQR={(reservation) => setQr({ reservation, justBooked: false })}
                />
                <Testimonios />
                <FAQ />
                <Contacto />
                <FinalCTA />
              </main>

              <Footer onNotify={notify} />

              <BookingDetailsDialog
                open={detailsOpen}
                booking={booking}
                onChange={updateBooking}
                onClose={() => setDetailsOpen(false)}
                onConfirm={confirmBooking}
              />
              <ReservationDialog
                reservation={qrReservation}
                justBooked={!!qr?.justBooked}
                onClose={() => setQr(null)}
                onGoToMine={() => {
                  setQr(null);
                  setTimeout(() => scrollToId('reservas-dashboard'), 50);
                }}
              />
            </>
          )}

          <Toast toast={toast} onDismiss={dismissToast} />
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
