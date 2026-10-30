import type { Reservation } from '../types';
import { isActive, SEATING_MINUTES, TIME_SLOTS, toMinutes, zoneInfo } from './booking';

export type TableShape = 'round' | 'square' | 'rect' | 'long';

export interface Table {
  id: number;
  seats: number;
  /** Mínimo de comensales para asignar la mesa (no sentamos 1 persona en una de 6). */
  minGuests: number;
  zone: string;
  shape: TableShape;
  x: number; // centro, en unidades del viewBox (800 × 520)
  y: number;
}

const t = (id: number, seats: number, zone: string, x: number, y: number): Table => ({
  id,
  seats,
  zone,
  x,
  y,
  minGuests: seats === 2 ? 1 : seats === 4 ? 2 : seats === 6 ? 4 : 6,
  shape: seats === 2 ? 'round' : seats === 4 ? 'square' : seats === 6 ? 'rect' : 'long',
});

export const TABLES: Table[] = [
  // Interior Principal
  t(1, 2, 'Interior Principal', 85, 100),
  t(2, 2, 'Interior Principal', 85, 225),
  t(3, 4, 'Interior Principal', 195, 100),
  t(4, 4, 'Interior Principal', 195, 225),
  t(5, 4, 'Interior Principal', 305, 100),
  t(6, 6, 'Interior Principal', 360, 225),
  t(7, 2, 'Interior Principal', 420, 100),
  // Barra Premium
  t(8, 2, 'Barra Premium', 85, 410),
  t(9, 2, 'Barra Premium', 185, 410),
  t(10, 2, 'Barra Premium', 285, 410),
  t(11, 4, 'Barra Premium', 400, 410),
  // Terraza
  t(12, 2, 'Terraza', 560, 100),
  t(13, 4, 'Terraza', 695, 100),
  t(14, 4, 'Terraza', 560, 225),
  t(15, 6, 'Terraza', 690, 225),
  // Salón Privado: mesa imperial
  t(16, 12, 'Salón Privado', 640, 425),
];

export const ZONE_AREAS: { zone: string; x: number; y: number; w: number; h: number }[] = [
  { zone: 'Interior Principal', x: 20, y: 20, w: 460, h: 290 },
  { zone: 'Barra Premium', x: 20, y: 330, w: 460, h: 170 },
  { zone: 'Terraza', x: 500, y: 20, w: 280, h: 290 },
  { zone: 'Salón Privado', x: 500, y: 330, w: 280, h: 170 },
];

export function getTable(id: number | null | undefined): Table | undefined {
  return TABLES.find((tb) => tb.id === id);
}

export function tableFits(table: Table, guests: number): boolean {
  return guests <= table.seats && guests >= table.minGuests;
}

/** Mesas ocupadas en una fecha y horario (una reserva bloquea la mesa 2 horas). */
export function occupiedTables(date: string, time: string, reservations: Reservation[], ignoreId?: string): Set<number> {
  const start = toMinutes(time);
  const set = new Set<number>();
  for (const r of reservations) {
    if (r.id === ignoreId || r.date !== date || r.tableId == null || !isActive(r)) continue;
    if (Math.abs(toMinutes(r.time) - start) < SEATING_MINUTES) set.add(r.tableId);
  }
  return set;
}

export type TableState = 'libre' | 'ocupada' | 'seleccionada' | 'no-apta';

export function tableState(table: Table, guests: number, occupied: Set<number>, selectedId: number | null): TableState {
  if (occupied.has(table.id)) return 'ocupada';
  if (!tableFits(table, guests)) return 'no-apta';
  if (table.id === selectedId) return 'seleccionada';
  return 'libre';
}

/** Mesas libres y aptas para la cantidad de personas (opcionalmente en una zona). */
export function freeTables(date: string, time: string, guests: number, reservations: Reservation[], zone?: string): Table[] {
  const occ = occupiedTables(date, time, reservations);
  return TABLES.filter((tb) => (!zone || tb.zone === zone) && !occ.has(tb.id) && tableFits(tb, guests)).sort(
    (a, b) => a.seats - b.seats // primero la mesa más chica que alcance
  );
}

/** Horarios del día con al menos una mesa apta libre. */
export function availableSlots(date: string, guests: number, reservations: Reservation[], zone?: string): Set<string> {
  return new Set(TIME_SLOTS.filter((time) => freeTables(date, time, guests, reservations, zone).length > 0));
}

export function zoneCapacity(zone: string): { min: number; max: number } {
  const z = zoneInfo(zone);
  return { min: z.min, max: z.max };
}

export const TOTAL_SEATS = TABLES.reduce((acc, tb) => acc + tb.seats, 0);
