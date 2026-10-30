import type { Reservation, ReservationStatus } from '../types';

export const ZONES = [
  { value: 'Interior Principal', label: 'Interior Principal (climatizado)', min: 1, max: 6 },
  { value: 'Terraza', label: 'Terraza (al aire libre)', min: 1, max: 6 },
  { value: 'Barra Premium', label: 'Barra Premium (cocina a la vista)', min: 1, max: 4 },
  { value: 'Salón Privado', label: 'Salón Privado (grupos de 6 a 12)', min: 6, max: 12 },
] as const;

export type ZoneName = (typeof ZONES)[number]['value'];

export function zoneInfo(zone: string) {
  return ZONES.find((z) => z.value === zone) ?? ZONES[0];
}

export const MAX_GUESTS = 12;

/** Turnos: el último horario de cada turno es la última mesa que se sienta. */
export const SHIFTS = [
  { id: 'almuerzo', label: 'Almuerzo', slots: ['12:30', '13:00', '13:30', '14:00', '14:30'] },
  { id: 'cena', label: 'Cena', slots: ['20:00', '20:30', '21:00', '21:30', '22:00', '22:30'] },
] as const;

export type ShiftId = (typeof SHIFTS)[number]['id'];

export const TIME_SLOTS: string[] = SHIFTS.flatMap((s) => [...s.slots]);

export function shiftOf(time: string): ShiftId {
  return time < '17:00' ? 'almuerzo' : 'cena';
}

/** Una reserva ocupa la mesa durante 2 horas. */
export const SEATING_MINUTES = 120;

export function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/** Estado de la reserva en curso (formulario + plano de mesas). */
export interface BookingState {
  date: string;
  time: string;
  guests: number;
  zone: string;
  tableId: number | null;
  name: string;
  email: string;
  phone: string;
  specialRequests: string;
}

export type BookingDraft = Partial<BookingState>;

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

export function isClosedISO(iso: string): boolean {
  return isClosed(parseISODate(iso));
}

/** Próximo día abierto a partir de mañana. */
export function nextOpenDate(from = new Date()): string {
  let d = addDays(from, 1);
  while (isClosed(d)) d = addDays(d, 1);
  return toISODate(d);
}

/** true si el horario de hoy ya pasó. */
export function isSlotPast(date: string, time: string, now = new Date()): boolean {
  const today = toISODate(now);
  if (date !== today) return date < today;
  return toMinutes(time) <= now.getHours() * 60 + now.getMinutes();
}

/** "jueves 5 de noviembre" */
export function formatLongDate(iso: string): string {
  return parseISODate(iso).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
}

/** "jue 5/11" */
export function formatShortDate(iso: string): string {
  const d = parseISODate(iso);
  return `${d.toLocaleDateString('es-AR', { weekday: 'short' }).replace('.', '')} ${d.getDate()}/${d.getMonth() + 1}`;
}

const ars = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

/** $ 18.500 */
export function formatARS(value: number): string {
  return ars.format(value);
}

const CODE_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

/** Código corto y legible, sin caracteres ambiguos (0/O, 1/I). */
export function makeReservationCode(random: () => number = Math.random): string {
  let s = '';
  for (let i = 0; i < 4; i++) s += CODE_ALPHABET[Math.floor(random() * CODE_ALPHABET.length)];
  return `MESA-${s}`;
}

export const STATUS_LABEL: Record<ReservationStatus, string> = {
  pendiente: 'Pendiente',
  confirmada: 'Confirmada',
  llego: 'Llegó',
  finalizada: 'Finalizada',
  cancelada: 'Cancelada',
};

/** Reservas que ocupan una mesa. */
export function isActive(r: Reservation): boolean {
  return r.status === 'pendiente' || r.status === 'confirmada' || r.status === 'llego';
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function scrollToId(id: string, block: ScrollLogicalPosition = 'start') {
  document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block });
}
