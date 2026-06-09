import React, { useState, useEffect } from 'react';
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
import { Reservation } from './types';

const STORAGE_KEY = 'mesa_reservations_v1';

const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-seed-1',
    date: '2026-05-15',
    time: '21:00',
    guests: 2,
    zone: 'Interior Principal',
    status: 'confirmada',
    name: 'Elena Pérez',
    email: 'elena@gmail.com',
    phone: '+34 912 345 678',
    specialRequests: 'Me gustaría una mesa cerca de las ventanas si es posible.',
    createdAt: new Date('2026-05-13T10:00:00Z').toISOString()
  },
  {
    id: 'res-seed-2',
    date: '2026-04-28',
    time: '14:30',
    guests: 4,
    zone: 'Terraza',
    status: 'finalizada',
    name: 'Elena Pérez',
    email: 'elena@gmail.com',
    phone: '+34 912 345 678',
    specialRequests: '',
    createdAt: new Date('2026-04-25T14:00:00Z').toISOString()
  }
];

export default function App() {
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error reading from localStorage:', e);
    }
    return INITIAL_RESERVATIONS;
  });

  // Track state in localStorage on adjustments
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
    } catch (e) {
      console.warn('Error writing to localStorage:', e);
    }
  }, [reservations]);

  // Handle building new bookings
  const handleAddNewReservation = (newRes: Omit<Reservation, 'id' | 'status' | 'createdAt'>) => {
    const freshReservation: Reservation = {
      ...newRes,
      id: 'res-' + Math.random().toString(36).substr(2, 9),
      status: 'confirmada',
      createdAt: new Date().toISOString()
    };
    setReservations((prev) => [freshReservation, ...prev]);
  };

  // Handle cancellation
  const handleCancelReservation = (id: string) => {
    setReservations((prev) =>
      prev.map((res) => (res.id === id ? { ...res, status: 'cancelada' } : res))
    );
  };

  // Handle repeating / pre-filling parameters
  const handleRepeatReservation = (res: Reservation) => {
    // Scroll to booking form
    const bookEl = document.getElementById('quick-book-form');
    if (bookEl) {
      bookEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    // Simple toast notification feedback
    alert(`Se ha solicitado repetir la reserva para ${res.guests} personas en la zona: ${res.zone}. Por favor configure la nueva fecha en el panel de Reserva Rápida.`);
  };

  const handleOpenQuickBook = () => {
    const el = document.getElementById('quick-book-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen font-sans selection:bg-primary-container selection:text-on-primary-container">
      {/* Fixed top nav header */}
      <Navbar onOpenQuickBook={handleOpenQuickBook} />

      <main className="pt-20">
        {/* Cinematic landing hero block, including quick booking widget */}
        <Hero onAddReservation={handleAddNewReservation} />

        {/* Calendar time slot selector */}
        <Availability />

        {/* Visual environments/dining zones preview card grid */}
        <Ambientes />

        {/* Tasting menu with dot-connected category tabs */}
        <Carta />

        {/* Linear step process progression */}
        <Proceso />

        {/* User live reservation dashboard */}
        <ReservasDashboard
          reservations={reservations}
          onCancelReservation={handleCancelReservation}
          onRepeatReservation={handleRepeatReservation}
        />

        {/* Reviews */}
        <Testimonios />

        {/* Collapsible FAQ accordion */}
        <FAQ />

        {/* Coordinates contact, direct email dialog, and architectural map pin */}
        <Contacto />

        {/* Direct final CTA promotion */}
        <FinalCTA />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
