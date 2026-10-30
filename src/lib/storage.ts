import type { Reservation } from '../types';
import { addDays, isClosed, isSlotPast, makeReservationCode, SHIFTS, toISODate, todayISO } from './booking';
import { TABLES, freeTables, occupiedTables } from './floorplan';

export const STORAGE_KEY = 'mesa_reservations_v3';
const LEGACY_KEY = 'mesa_reservations_v2';
const DEMO_DATES_KEY = 'mesa_demo_dates_v1';

/** Ventana de días con reservas demo de otros clientes (para el plano y el panel admin). */
const DEMO_PAST_DAYS = 14;
const DEMO_FUTURE_DAYS = 13;

/** PRNG determinista (mulberry32): la misma fecha genera siempre las mismas reservas demo. */
function seeded(seedText: string) {
  let h = 1779033703;
  for (const ch of seedText) h = Math.imul(h ^ ch.charCodeAt(0), 3432918353);
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let x = Math.imul(a ^ (a >>> 15), 1 | a);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST = ['Lucía', 'Martín', 'Sofía', 'Mateo', 'Valentina', 'Benjamín', 'Camila', 'Joaquín', 'Martina', 'Tomás', 'Julieta', 'Santiago', 'Catalina', 'Facundo', 'Agustina', 'Nicolás', 'Florencia', 'Ignacio', 'Micaela', 'Federico'];
const LAST = ['González', 'Rodríguez', 'Fernández', 'López', 'Martínez', 'Díaz', 'Pérez', 'Romero', 'Sosa', 'Álvarez', 'Torres', 'Ruiz', 'Ramírez', 'Benítez', 'Acosta', 'Medina', 'Herrera', 'Suárez', 'Aguirre', 'Giménez'];
const NOTES = ['', '', '', '', 'Aniversario', 'Cumpleaños, si pueden traer una vela', 'Una persona celíaca', 'Vegetariano', 'Silla para bebé'];

/** Demanda relativa por día (0 = domingo) y turno. */
const DEMAND: Record<number, { almuerzo: number; cena: number }> = {
  0: { almuerzo: 0.85, cena: 0.4 },
  2: { almuerzo: 0.3, cena: 0.45 },
  3: { almuerzo: 0.35, cena: 0.55 },
  4: { almuerzo: 0.4, cena: 0.7 },
  5: { almuerzo: 0.5, cena: 0.95 },
  6: { almuerzo: 0.65, cena: 1 },
};

function generateDemoForDate(date: string, existing: Reservation[]): Reservation[] {
  const d = new Date(date + 'T12:00:00');
  if (isClosed(d)) return [];
  const rand = seeded(date);
  const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)];
  const today = todayISO();
  const out: Reservation[] = [];
  // Solo importan las reservas del mismo día (evita recorrer cientos en cada intento)
  const sameDay = existing.filter((r) => r.date === date);

  for (const shift of SHIFTS) {
    const demand = DEMAND[d.getDay()][shift.id];
    const target = Math.round(demand * TABLES.length * 1.15 * (0.85 + rand() * 0.3));
    let attempts = 0;
    while (out.filter((r) => shift.slots.includes(r.time as never)).length < target && attempts++ < target * 6) {
      const time = pick(shift.slots);
      const occ = occupiedTables(date, time, [...sameDay, ...out]);
      const candidates = TABLES.filter((tb) => !occ.has(tb.id) && (tb.seats < 12 || rand() < 0.25));
      if (!candidates.length) continue;
      const table = pick(candidates);
      const guests = table.minGuests + Math.floor(rand() * (table.seats - table.minGuests + 1));
      const first = pick(FIRST);
      const last = pick(LAST);
      const roll = rand();
      const past = date < today || (date === today && isSlotPast(date, time));
      const status: Reservation['status'] = past
        ? roll < 0.08 ? 'cancelada' : date === today ? 'llego' : 'finalizada'
        : roll < 0.07 ? 'cancelada' : table.zone === 'Salón Privado' || roll > 0.93 ? 'pendiente' : 'confirmada';

      out.push({
        id: `demo-${date}-${out.length}`,
        code: makeReservationCode(rand),
        date,
        time,
        guests: Math.max(1, guests),
        zone: table.zone,
        tableId: table.id,
        status,
        name: `${first} ${last}`,
        email: `${first}.${last}`.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '') + '@mail.com',
        phone: `+54 11 ${5000 + Math.floor(rand() * 4999)}-${1000 + Math.floor(rand() * 8999)}`,
        specialRequests: pick(NOTES),
        createdAt: addDays(d, -3).toISOString(),
        mine: false,
      });
    }
  }
  return out;
}

/** Reservas de ejemplo propias, relativas a hoy: una próxima y una pasada. */
function makeMySeeds(all: Reservation[]): Reservation[] {
  const today = new Date();
  let upcoming = addDays(today, 5);
  if (isClosed(upcoming)) upcoming = addDays(upcoming, 1);
  const upDate = toISODate(upcoming);
  const pastDate = toISODate(addDays(today, -12));
  const upTable = freeTables(upDate, '21:00', 2, all, 'Interior Principal')[0] ?? freeTables(upDate, '21:00', 2, all)[0];
  const pastTable = freeTables(pastDate, '14:00', 4, all, 'Terraza')[0];
  const base = { name: 'Elena Pérez', email: 'elena.perez@gmail.com', phone: '+54 11 5123-4567', mine: true };

  return [
    {
      ...base,
      id: 'res-seed-1',
      code: 'MESA-7K2P',
      date: upDate,
      time: '21:00',
      guests: 2,
      zone: upTable?.zone ?? 'Interior Principal',
      tableId: upTable?.id,
      status: 'confirmada',
      specialRequests: 'Si se puede, una mesa cerca de la ventana.',
      createdAt: addDays(today, -2).toISOString(),
    },
    {
      ...base,
      id: 'res-seed-2',
      code: 'MESA-4HQ9',
      date: pastDate,
      time: '14:00',
      guests: 4,
      zone: 'Terraza',
      tableId: pastTable?.id,
      status: 'finalizada',
      specialRequests: '',
      createdAt: addDays(today, -15).toISOString(),
    },
  ];
}

/** Las reservas activas cuya fecha ya pasó se muestran como finalizadas. */
function settlePast(list: Reservation[]): Reservation[] {
  const today = todayISO();
  return list.map((r) =>
    r.date < today && (r.status === 'confirmada' || r.status === 'pendiente' || r.status === 'llego') ? { ...r, status: 'finalizada' } : r
  );
}

function readJSON<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function loadReservations(): Reservation[] {
  let list = readJSON<Reservation[]>(STORAGE_KEY);
  let demoDates = new Set(readJSON<string[]>(DEMO_DATES_KEY) ?? []);
  const isFirstVisit = !list;

  if (!list) {
    // Migra las reservas de la versión anterior (todas eran de este dispositivo)
    const legacy = readJSON<Omit<Reservation, 'code' | 'mine'>[]>(LEGACY_KEY) ?? [];
    list = legacy.map((r) => ({ ...r, code: makeReservationCode(), mine: true }));
    demoDates = new Set();
  }

  // Descarta demos viejas y genera las fechas que falten en la ventana
  const today = new Date();
  const oldest = toISODate(addDays(today, -DEMO_PAST_DAYS));
  list = list.filter((r) => r.mine || r.date >= oldest);
  for (let i = -DEMO_PAST_DAYS; i <= DEMO_FUTURE_DAYS; i++) {
    const date = toISODate(addDays(today, i));
    if (demoDates.has(date)) continue;
    list.push(...generateDemoForDate(date, list));
    demoDates.add(date);
  }
  demoDates = new Set([...demoDates].filter((dt) => dt >= oldest));

  if (isFirstVisit && !list.some((r) => r.mine)) list.push(...makeMySeeds(list));

  try {
    localStorage.setItem(DEMO_DATES_KEY, JSON.stringify([...demoDates]));
  } catch {
    /* modo privado o sin espacio */
  }
  return settlePast(list);
}

export function saveReservations(list: Reservation[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Error writing to localStorage:', e);
  }
}
