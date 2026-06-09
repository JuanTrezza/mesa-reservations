/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Reservation {
  id: string;
  date: string; // e.g. "2026-06-15" or "2026-05-15"
  time: string; // e.g. "20:30"
  guests: number;
  zone: string; // e.g. "Interior Principal", "Terraza", "Barra Premium", "Salón Privado"
  status: 'confirmada' | 'finalizada' | 'cancelada';
  name: string;
  email: string;
  phone: string;
  specialRequests?: string;
  createdAt: string;
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
