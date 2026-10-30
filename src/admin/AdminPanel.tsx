import { useMemo, useState } from 'react';
import { ArrowLeft, Check, LogOut, Search, UserCheck, X } from 'lucide-react';
import type { Reservation, ReservationStatus } from '../types';
import type { ToastData } from '../components/Toast';
import AdminLogin from './AdminLogin';
import WeekdayChart from './WeekdayChart';
import { fieldClass, fieldState, labelClass } from '../components/Field';
import { addDays, formatLongDate, SHIFTS, STATUS_LABEL, toISODate, todayISO, ZONES } from '../lib/booking';
import { getTable, occupiedTables, TABLES } from '../lib/floorplan';

interface AdminPanelProps {
  reservations: Reservation[];
  onSetStatus: (id: string, status: ReservationStatus) => void;
  onNotify: (t: Omit<ToastData, 'id'>) => void;
  onExit: () => void;
}

type DateMode = 'hoy' | 'semana' | 'fecha' | 'todas';

const SESSION_KEY = 'mesa_admin_session';

const BADGE: Record<ReservationStatus, string> = {
  confirmada: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  pendiente: 'bg-amber-500/10 text-amber-200 border-amber-400/40',
  llego: 'bg-sky-500/10 text-sky-200 border-sky-400/40',
  finalizada: 'bg-surface-container-high text-on-surface-variant border-outline-variant/60',
  cancelada: 'bg-rose-500/10 text-rose-300 border-rose-400/30',
};

/** Ocupación promedio de mesas en los horarios de un turno. */
function shiftOccupancy(date: string, slots: readonly string[], reservations: Reservation[]): number {
  const total = slots.reduce((acc, time) => acc + occupiedTables(date, time, reservations).size, 0);
  return Math.round((total / (slots.length * TABLES.length)) * 100);
}

export default function AdminPanel({ reservations, onSetStatus, onNotify, onExit }: AdminPanelProps) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1');
  const [dateMode, setDateMode] = useState<DateMode>('hoy');
  const [date, setDate] = useState(todayISO());
  const [zone, setZone] = useState('todas');
  const [status, setStatus] = useState<'todos' | ReservationStatus>('todos');
  const [query, setQuery] = useState('');

  const today = todayISO();
  const refDate = dateMode === 'fecha' ? date : today;

  const filtered = useMemo(() => {
    const weekEnd = toISODate(addDays(new Date(), 6));
    const q = query.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    return reservations
      .filter((r) => {
        if (dateMode === 'hoy' && r.date !== today) return false;
        if (dateMode === 'semana' && (r.date < today || r.date > weekEnd)) return false;
        if (dateMode === 'fecha' && r.date !== date) return false;
        if (zone !== 'todas' && r.zone !== zone) return false;
        if (status !== 'todos' && r.status !== status) return false;
        if (q) {
          const hay = `${r.name} ${r.code}`.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  }, [reservations, dateMode, date, zone, status, query, today]);

  const groups = useMemo(() => {
    const map = new Map<string, Reservation[]>();
    for (const r of filtered) map.set(r.date, [...(map.get(r.date) ?? []), r]);
    return [...map.entries()];
  }, [filtered]);

  const kpis = useMemo(() => {
    const day = reservations.filter((r) => r.date === refDate);
    const live = day.filter((r) => r.status !== 'cancelada');
    return {
      count: live.length,
      covers: live.reduce((acc, r) => acc + r.guests, 0),
      lunch: shiftOccupancy(refDate, SHIFTS[0].slots, reservations),
      dinner: shiftOccupancy(refDate, SHIFTS[1].slots, reservations),
      cancelled: day.length - live.length,
      pending: live.filter((r) => r.status === 'pendiente').length,
    };
  }, [reservations, refDate]);

  if (!authed) {
    return (
      <AdminLogin
        onExit={onExit}
        onSuccess={() => {
          sessionStorage.setItem(SESSION_KEY, '1');
          setAuthed(true);
        }}
      />
    );
  }

  const change = (r: Reservation, next: ReservationStatus) => {
    onSetStatus(r.id, next);
    onNotify({ title: `${r.code} · ${STATUS_LABEL[next]}`, message: `${r.name}, ${r.time} hs, ${r.guests} personas.` });
  };

  const refLabel = refDate === today ? 'Hoy' : formatLongDate(refDate);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-outline-variant/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-3 min-w-0">
            <span className="font-display italic text-primary text-2xl">MESA</span>
            <span className="text-xs uppercase tracking-[0.2em] text-on-surface-variant font-semibold truncate">Panel del restaurante</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={onExit} className="min-h-11 px-3 inline-flex items-center gap-2 text-sm text-on-surface hover:text-primary rounded-sm">
              <ArrowLeft size={16} aria-hidden="true" /> <span className="hidden sm:inline">Ver sitio</span>
              <span className="sm:hidden">Sitio</span>
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem(SESSION_KEY);
                setAuthed(false);
              }}
              className="min-h-11 px-3 inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary rounded-sm"
            >
              <LogOut size={16} aria-hidden="true" /> Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <p className="text-sm text-amber-100 bg-amber-500/10 border border-amber-400/30 rounded-sm px-4 py-3">
          Modo demo: los datos se guardan solo en este navegador e incluyen reservas de ejemplo de otros clientes.
        </p>

        <section aria-labelledby="kpi-title" className="space-y-3">
          <h1 id="kpi-title" className="font-serif text-3xl sm:text-4xl font-semibold italic text-on-surface first-letter:uppercase">
            {refLabel}
          </h1>
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: 'Reservas', value: kpis.count, hint: kpis.pending ? `${kpis.pending} por confirmar` : 'Todas confirmadas' },
              { label: 'Cubiertos', value: kpis.covers, hint: 'Personas esperadas' },
              { label: 'Ocupación', value: `${kpis.lunch}% · ${kpis.dinner}%`, hint: 'Almuerzo · cena (promedio de mesas)' },
              { label: 'Cancelaciones', value: kpis.cancelled, hint: refDate === today ? 'En el día' : 'Para esa fecha' },
            ].map((k) => (
              <div key={k.label} className="bg-surface-container border border-outline-variant/50 rounded-md p-4 sm:p-5 flex flex-col-reverse justify-end">
                <dt className="text-xs text-on-surface-variant mt-1">{k.hint}</dt>
                <dd className="font-display text-2xl sm:text-4xl text-primary font-semibold tabular-nums" data-testid={`kpi-${k.label.toLowerCase()}`}>
                  {k.value}
                </dd>
                <dt className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold mb-1">{k.label}</dt>
              </div>
            ))}
          </dl>
        </section>

        <WeekdayChart reservations={reservations} />

        <section aria-labelledby="list-title" className="space-y-4">
          <h2 id="list-title" className="font-serif text-3xl font-semibold text-on-surface">
            Reservas <span className="text-on-surface-variant text-xl">({filtered.length})</span>
          </h2>

          <div className="bg-surface-container border border-outline-variant/50 rounded-md p-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-[auto_1fr_1fr_1fr_1.4fr] lg:items-end">
            <fieldset>
              <legend className={labelClass}>Fecha</legend>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {(
                  [
                    ['hoy', 'Hoy'],
                    ['semana', '7 días'],
                    ['todas', 'Todas'],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={dateMode === value}
                    onClick={() => setDateMode(value)}
                    className={`min-h-12 px-4 rounded-sm text-sm font-semibold border transition-colors ${
                      dateMode === value ? 'bg-primary text-on-primary border-primary' : 'border-outline-variant text-on-surface hover:border-primary'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>
            <div>
              <label htmlFor="f-date" className={labelClass}>Día puntual</label>
              <input
                id="f-date"
                type="date"
                value={dateMode === 'fecha' ? date : ''}
                onChange={(e) => {
                  if (!e.target.value) return setDateMode('hoy');
                  setDate(e.target.value);
                  setDateMode('fecha');
                }}
                className={`${fieldClass} ${fieldState()} mt-1.5`}
              />
            </div>
            <div>
              <label htmlFor="f-zone" className={labelClass}>Zona</label>
              <select id="f-zone" value={zone} onChange={(e) => setZone(e.target.value)} className={`${fieldClass} ${fieldState()} mt-1.5`}>
                <option value="todas">Todas</option>
                {ZONES.map((z) => (
                  <option key={z.value} value={z.value}>{z.value}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="f-status" className={labelClass}>Estado</label>
              <select id="f-status" value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className={`${fieldClass} ${fieldState()} mt-1.5`}>
                <option value="todos">Todos</option>
                {(Object.keys(STATUS_LABEL) as ReservationStatus[]).map((s) => (
                  <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="f-query" className={labelClass}>Buscar</label>
              <div className="relative mt-1.5">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" aria-hidden="true" />
                <input
                  id="f-query"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Nombre o código"
                  className={`${fieldClass} ${fieldState()} pl-9`}
                />
              </div>
            </div>
          </div>

          {groups.length === 0 ? (
            <p className="text-center text-on-surface-variant py-12 border border-dashed border-outline-variant/60 rounded-md">
              No hay reservas con esos filtros.
            </p>
          ) : (
            groups.map(([day, list]) => (
              <div key={day} className="space-y-2">
                <h3 className="text-sm uppercase tracking-widest text-primary font-semibold pt-2">
                  {day === today ? 'Hoy · ' : ''}
                  {formatLongDate(day)} <span className="text-on-surface-variant">· {list.length}</span>
                </h3>
                <ul className="divide-y divide-outline-variant/40 border border-outline-variant/50 rounded-md bg-surface overflow-hidden">
                  {list.map((r) => {
                    const table = getTable(r.tableId);
                    return (
                      <li
                        key={r.id}
                        data-testid="admin-row"
                        className="p-4 grid gap-3 grid-cols-[4rem_1fr] lg:grid-cols-[4rem_1.6fr_1.2fr_8rem_16rem] lg:items-center"
                      >
                        <p className="font-mono text-lg font-semibold text-on-surface tabular-nums">{r.time}</p>
                        <div className="min-w-0">
                          <p className="text-on-surface font-semibold truncate">{r.name}</p>
                          <p className="text-sm text-on-surface-variant">
                            {r.guests} {r.guests === 1 ? 'persona' : 'personas'} · <span className="font-mono">{r.code}</span>
                            {r.specialRequests ? <span className="italic"> · {r.specialRequests}</span> : null}
                          </p>
                        </div>
                        <p className="text-sm text-on-surface col-start-2 lg:col-start-auto">
                          {r.zone}
                          {table ? <span className="text-on-surface-variant"> · Mesa {table.id}</span> : null}
                        </p>
                        <p className="col-start-2 lg:col-start-auto">
                          <span className={`inline-block text-xs uppercase font-bold tracking-widest px-2.5 py-1 rounded-sm border ${BADGE[r.status]}`}>
                            {STATUS_LABEL[r.status]}
                          </span>
                        </p>
                        <div className="col-span-2 lg:col-span-1 flex flex-wrap gap-2 lg:justify-end">
                          {r.status === 'pendiente' && (
                            <button onClick={() => change(r, 'confirmada')} className="min-h-11 px-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider rounded-sm bg-primary text-on-primary hover:bg-primary-container">
                              <Check size={15} aria-hidden="true" /> Confirmar
                            </button>
                          )}
                          {r.status === 'confirmada' && (
                            <button onClick={() => change(r, 'llego')} className="min-h-11 px-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider rounded-sm border border-sky-400/50 text-sky-200 hover:bg-sky-500/10">
                              <UserCheck size={15} aria-hidden="true" /> Llegó
                            </button>
                          )}
                          {(r.status === 'pendiente' || r.status === 'confirmada') && (
                            <button onClick={() => change(r, 'cancelada')} className="min-h-11 px-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider rounded-sm text-on-surface-variant hover:text-rose-300">
                              <X size={15} aria-hidden="true" /> Cancelar
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
