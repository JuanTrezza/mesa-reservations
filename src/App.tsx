import { useState, useEffect, useCallback } from 'react';
import { MotionConfig } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Availability from './components/Availability';
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
import { Reservation } from './types';
import { addDays, isClosed, nextOpenDate, scrollToId, toISODate, todayISO, type BookingDraft } from './lib/booking';

const STORAGE_KEY = 'mesa_reservations_v2';

/** Reservas de ejemplo relativas a hoy: una próxima y una pasada. */
function makeSeedReservations(): Reservation[] {
  const today = new Date();
  let upcoming = addDays(today, 5);
  if (isClosed(upcoming)) upcoming = addDays(upcoming, 1);
  const past = addDays(today, -12);

  return [
    {
      id: 'res-seed-1',
      date: toISODate(upcoming),
      time: '21:00',
      guests: 2,
      zone: 'Interior Principal',
      status: 'confirmada',
      name: 'Elena Pérez',
      email: 'elena.perez@gmail.com',
      phone: '+54 11 5123-4567',
      specialRequests: 'Si se puede, una mesa cerca de la ventana.',
      createdAt: addDays(today, -2).toISOString(),
    },
    {
      id: 'res-seed-2',
      date: toISODate(past),
      time: '14:00',
      guests: 4,
      zone: 'Terraza',
      status: 'finalizada',
      name: 'Elena Pérez',
      email: 'elena.perez@gmail.com',
      phone: '+54 11 5123-4567',
      specialRequests: '',
      createdAt: addDays(today, -15).toISOString(),
    },
  ];
}

/** Las reservas confirmadas cuya fecha ya pasó se muestran como finalizadas. */
function settlePastReservations(list: Reservation[]): Reservation[] {
  const today = todayISO();
  return list.map((r) => (r.status === 'confirmada' && r.date < today ? { ...r, status: 'finalizada' } : r));
}

export default function App() {
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return settlePastReservations(JSON.parse(saved));
    } catch (e) {
      console.warn('Error reading from localStorage:', e);
    }
    return makeSeedReservations();
  });

  const [draft, setDraft] = useState<{ values: BookingDraft; nonce: number } | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
    } catch (e) {
      console.warn('Error writing to localStorage:', e);
    }
  }, [reservations]);

  const notify = useCallback((t: Omit<ToastData, 'id'>) => setToast({ ...t, id: Date.now() }), []);
  const dismissToast = useCallback(() => setToast(null), []);

  const handleAddNewReservation = (newRes: Omit<Reservation, 'id' | 'status' | 'createdAt'>) => {
    const freshReservation: Reservation = {
      ...newRes,
      id: 'res-' + Math.random().toString(36).slice(2, 11),
      status: 'confirmada',
      createdAt: new Date().toISOString(),
    };
    setReservations((prev) => [freshReservation, ...prev]);
  };

  const handleCancelReservation = (id: string) => {
    setReservations((prev) => prev.map((res) => (res.id === id ? { ...res, status: 'cancelada' } : res)));
    notify({ title: 'Reserva cancelada', message: 'Liberamos tu mesa. Podés repetirla cuando quieras desde el historial.', tone: 'info' });
  };

  /** Precarga el formulario de Reserva Rápida y lleva al usuario hasta él. */
  const prefillBooking = (values: BookingDraft) => {
    setDraft({ values, nonce: Date.now() });
    scrollToId('quick-book-form', 'center');
  };

  const handleRepeatReservation = (res: Reservation) => {
    prefillBooking({
      date: nextOpenDate(),
      time: res.time,
      guests: res.guests,
      zone: res.zone,
      name: res.name,
      email: res.email,
      phone: res.phone,
      specialRequests: res.specialRequests,
    });
    notify({
      title: 'Cargamos tu reserva anterior',
      message: `${res.guests} personas · ${res.zone} · ${res.time} hs. Revisá la fecha y confirmá.`,
    });
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-background text-on-background min-h-screen font-sans overflow-x-clip selection:bg-primary-container selection:text-on-primary-container">
        <a
          href="#inicio"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:bg-primary focus:text-on-primary focus:px-4 focus:py-3 focus:rounded-sm"
        >
          Saltar al contenido
        </a>

        <Navbar onOpenQuickBook={() => scrollToId('quick-book-form', 'center')} />

        <main className="pt-[4.5rem]">
          <Hero onAddReservation={handleAddNewReservation} draft={draft} />
          <Availability onSelectSlot={(date, time) => prefillBooking({ date, time })} />
          <Ambientes onSelectZone={(zone) => prefillBooking({ zone })} />
          <Carta />
          <Proceso />
          <ReservasDashboard
            reservations={reservations}
            onCancelReservation={handleCancelReservation}
            onRepeatReservation={handleRepeatReservation}
          />
          <Testimonios />
          <FAQ />
          <Contacto />
          <FinalCTA />
        </main>

        <Footer onNotify={notify} />

        <Toast toast={toast} onDismiss={dismissToast} />
      </div>
    </MotionConfig>
  );
}
