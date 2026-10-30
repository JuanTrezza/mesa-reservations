import type { Reservation } from '../types';

export const ZONES = [
  { value: 'Interior Principal', label: 'Interior Principal (climatizado)' },
  { value: 'Terraza', label: 'Terraza (al aire libre)' },
  { value: 'Barra Premium', label: 'Barra Premium (cocina a la vista)' },
  { value: 'Salón Privado', label: 'Salón Privado (exclusivo)' },
] as const;

export type ZoneName = (typeof ZONES)[number]['value'];

export const TIME_SLOTS = ['13:00', '13:30', '14:00', '14:30', '20:00', '20:30', '21:00', '21:30', '22:00'];

/** Datos que se pueden precargar en el formulario de Reserva Rápida. */
export type BookingDraft = Partial<
  Pick<Reservation, 'date' | 'time' | 'guests' | 'zone' | 'name' | 'email' | 'phone' | 'specialRequests'>
>;

/** Fecha local en formato YYYY-MM-DD (evita el corrimiento de zona horaria de toISOString). */
export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Interpreta YYYY-MM-DD como fecha local (new Date('2026-05-15') la toma en UTC y en Buenos Aires da el día anterior). */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function addDays(base: Date, days: number): Date {
  const d = new Date(base.getFullYear(), base.getMonth(), base.getDate());
  d.setDate(d.getDate() + days);
  return d;
}

export function todayISO(): string {
  return toISODate(new Date());
}

/** Los lunes MESA está cerrado. */
export function isClosed(d: Date): boolean {
  return d.getDay() === 1;
}

/** Próximo día abierto a partir de mañana. */
export function nextOpenDate(from = new Date()): string {
  let d = addDays(from, 1);
  while (isClosed(d)) d = addDays(d, 1);
  return toISODate(d);
}

/** "jueves 5 de noviembre" */
export function formatLongDate(iso: string): string {
  return parseISODate(iso).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
}

const ars = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

/** $ 18.500 */
export function formatARS(value: number): string {
  return ars.format(value);
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function scrollToId(id: string, block: ScrollLogicalPosition = 'start') {
  document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block });
}
