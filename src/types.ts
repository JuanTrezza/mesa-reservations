export type ReservationStatus = 'pendiente' | 'confirmada' | 'llego' | 'finalizada' | 'cancelada';

export interface Reservation {
  id: string;
  /** Código visible para el cliente, p. ej. MESA-7K2P */
  code: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  guests: number;
  zone: string; // "Interior Principal" | "Terraza" | "Barra Premium" | "Salón Privado"
  tableId?: number;
  status: ReservationStatus;
  name: string;
  email: string;
  phone: string;
  specialRequests?: string;
  createdAt: string;
  /** true = hecha desde este dispositivo (aparece en "Mis reservas"); false = otros clientes (demo) */
  mine: boolean;
}

export interface MenuItem {
  name: string;
  price: number;
  description: string;
  category: 'entradas' | 'principales' | 'postres';
}

export interface AmbientZone {
  id: string;
  title: string;
  description: string;
  capacity: string;
  image: string;
  imageAlt: string;
}

export interface Review {
  id: string;
  author: string;
  text: string;
  rating: number;
  verified: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
