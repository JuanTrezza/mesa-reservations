import type { Reservation } from '../types';
import { SEATING_MINUTES } from './booking';
import { getTable } from './floorplan';

export const RESTAURANT_ADDRESS = 'Honduras 5123, Palermo Soho, CABA';

/** Buenos Aires es UTC−3 todo el año (sin horario de verano), así que convertimos a UTC sin VTIMEZONE. */
function toUtcStamp(date: string, time: string, plusMinutes = 0): string {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  const utc = new Date(Date.UTC(y, m - 1, d, hh + 3, mm + plusMinutes));
  return utc.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');

export function buildICS(r: Reservation): string {
  const table = getTable(r.tableId);
  const details = [
    `Código: ${r.code}`,
    `${r.guests} ${r.guests === 1 ? 'persona' : 'personas'} · ${r.zone}${table ? ` · Mesa ${table.id}` : ''}`,
    r.specialRequests ? `Pedido: ${r.specialRequests}` : '',
    'Mostrá tu QR en la recepción.',
  ]
    .filter(Boolean)
    .join('\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MESA//Reservas//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${r.code}-${r.id}@mesa.com.ar`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
    `DTSTART:${toUtcStamp(r.date, r.time)}`,
    `DTEND:${toUtcStamp(r.date, r.time, SEATING_MINUTES)}`,
    `SUMMARY:${esc(`Reserva en MESA (${r.code})`)}`,
    `DESCRIPTION:${esc(details)}`,
    `LOCATION:${esc(RESTAURANT_ADDRESS)}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reserva en MESA',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadFile(filename: string, href: string) {
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function downloadICS(r: Reservation) {
  const url = URL.createObjectURL(new Blob([buildICS(r)], { type: 'text/calendar;charset=utf-8' }));
  downloadFile(`reserva-${r.code}.ics`, url);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
