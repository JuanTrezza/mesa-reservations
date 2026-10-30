import type { Reservation } from '../types';
import { formatLongDate, isClosedISO, isSlotPast, MAX_GUESTS, TIME_SLOTS, todayISO, zoneInfo, type BookingState } from './booking';
import { freeTables, getTable, occupiedTables, tableFits } from './floorplan';

export type BookingErrors = Partial<Record<'date' | 'time' | 'guests' | 'zone' | 'table', string>>;
export type ContactErrors = Partial<Record<'name' | 'email' | 'phone', string>>;

export function validateBooking(b: BookingState, reservations: Reservation[]): BookingErrors {
  const e: BookingErrors = {};

  if (!b.date) e.date = 'Elegí una fecha.';
  else if (b.date < todayISO()) e.date = 'La fecha ya pasó. Elegí hoy o un día próximo.';
  else if (isClosedISO(b.date)) e.date = 'Los lunes estamos cerrados. Elegí otro día.';

  if (!e.date) {
    if (!TIME_SLOTS.includes(b.time)) e.time = 'Elegí un horario de almuerzo (12:30 a 14:30) o de cena (20:00 a 22:30).';
    else if (isSlotPast(b.date, b.time)) e.time = 'Ese horario ya pasó. Elegí uno más tarde.';
  }

  const zone = zoneInfo(b.zone);
  if (!Number.isInteger(b.guests) || b.guests < 1 || b.guests > MAX_GUESTS) e.guests = `Podés reservar de 1 a ${MAX_GUESTS} personas.`;
  else if (b.guests > zone.max) e.guests = `${zone.value} admite hasta ${zone.max} personas por mesa.`;
  else if (b.guests < zone.min) e.guests = `${zone.value} es para grupos de ${zone.min} a ${zone.max} personas.`;

  if (!e.date && !e.time && !e.guests) {
    const table = getTable(b.tableId);
    if (table) {
      if (table.zone !== b.zone) e.table = `La mesa ${table.id} no está en ${b.zone}.`;
      else if (!tableFits(table, b.guests)) e.table = `La mesa ${table.id} es para ${table.minGuests} a ${table.seats} personas.`;
      else if (occupiedTables(b.date, b.time, reservations).has(table.id)) e.table = `La mesa ${table.id} ya está reservada a las ${b.time} hs.`;
    } else if (freeTables(b.date, b.time, b.guests, reservations, b.zone).length === 0) {
      e.time = `No quedan mesas para ${b.guests} en ${b.zone} el ${formatLongDate(b.date)} a las ${b.time} hs. Probá otro horario o ambiente.`;
    }
  }

  return e;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Celular o fijo argentino: acepta +54 9 11 5123-4567, 011 15 5123-4567, 11 5123 4567, etc.
 * Quita el 54, el 9 de celulares, el 0 de larga distancia y el 15 local, y exige 10 dígitos (área + número).
 */
export function normalizeArPhone(raw: string): string | null {
  if (/[^\d\s()+.-]/.test(raw)) return null;
  let d = raw.replace(/\D/g, '');
  if (d.startsWith('54')) d = d.slice(2);
  if (d.startsWith('9') && d.length === 11) d = d.slice(1);
  if (d.startsWith('0')) d = d.slice(1);
  if (d.length === 12) {
    // 15 después de un código de área de 2, 3 o 4 dígitos
    for (const areaLen of [2, 3, 4]) {
      if (d.slice(areaLen, areaLen + 2) === '15') {
        d = d.slice(0, areaLen) + d.slice(areaLen + 2);
        break;
      }
    }
  }
  return /^[1-9]\d{9}$/.test(d) ? d : null;
}

export function validateContact(c: { name: string; email: string; phone: string }): ContactErrors {
  const e: ContactErrors = {};
  const name = c.name.trim();
  if (!name) e.name = 'Ingresá tu nombre y apellido.';
  else if (name.split(/\s+/).length < 2 || !/^[\p{L}' .-]+$/u.test(name)) e.name = 'Ingresá nombre y apellido, solo con letras.';

  if (!c.email.trim()) e.email = 'Ingresá tu email para mandarte la confirmación.';
  else if (!EMAIL_RE.test(c.email.trim())) e.email = 'Revisá el email: tiene que ser como nombre@dominio.com.';

  if (!c.phone.trim()) e.phone = 'Ingresá un celular para avisarte cualquier cambio.';
  else if (!normalizeArPhone(c.phone)) e.phone = 'Ingresá un número argentino con código de área, por ejemplo +54 11 5123-4567.';

  return e;
}
