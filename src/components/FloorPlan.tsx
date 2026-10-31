import { useMemo, useState, type KeyboardEvent } from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import type { Reservation } from '../types';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import { formatLongDate, isClosedISO, isSlotPast, type BookingState } from '../lib/booking';
import { occupiedTables, tableState, TABLES, ZONE_AREAS, type Table, type TableState } from '../lib/floorplan';

interface FloorPlanProps {
  booking: BookingState;
  reservations: Reservation[];
  onSelectTable: (table: Table) => void;
  onContinue: () => void;
}

const STATE_LABEL: Record<TableState, string> = {
  libre: 'libre',
  ocupada: 'ocupada',
  seleccionada: 'seleccionada',
  'no-apta': 'no apta para la cantidad de personas',
};

// Colores del tema (los mismos tokens de tailwind.config.js)
const C = {
  gold: '#D4AF37',
  goldSoft: 'rgba(212,175,55,0.14)',
  onGold: '#1A1405',
  cream: '#F2EBDD',
  muted: '#8F8672',
  line: '#4D4635',
  occupied: '#2A241C',
  floor: '#15120E',
};

function chairPositions(tb: Table, w: number, h: number): [number, number][] {
  const off = 13;
  if (tb.shape === 'round') return [[0, -h / 2 - off], [0, h / 2 + off]];
  if (tb.shape === 'square') return [[0, -h / 2 - off], [0, h / 2 + off], [-w / 2 - off, 0], [w / 2 + off, 0]];
  const perSide = (tb.seats - 2) / 2;
  const pts: [number, number][] = [[-w / 2 - off, 0], [w / 2 + off, 0]];
  for (let i = 0; i < perSide; i++) {
    const x = -w / 2 + (w / perSide) * (i + 0.5);
    pts.push([x, -h / 2 - off], [x, h / 2 + off]);
  }
  return pts;
}

function tableSize(tb: Table): [number, number] {
  switch (tb.shape) {
    case 'round':
      return [48, 48];
    case 'square':
      return [58, 58];
    case 'rect':
      return [124, 52];
    default:
      return [230, 52];
  }
}

function TableShapeSvg({ tb, state, onSelect }: { tb: Table; state: TableState; onSelect: () => void }) {
  const [w, h] = tableSize(tb);
  const selectable = state === 'libre' || state === 'seleccionada';
  const fill = state === 'seleccionada' ? C.gold : state === 'ocupada' ? C.occupied : C.goldSoft;
  const stroke = state === 'ocupada' ? C.line : C.gold;
  const text = state === 'seleccionada' ? C.onGold : state === 'ocupada' ? C.muted : C.cream;
  const label = `Mesa ${tb.id}, ${tb.seats} personas, ${tb.zone}, ${STATE_LABEL[state]}`;

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (selectable) onSelect();
    }
  };

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={state === 'seleccionada'}
      aria-disabled={!selectable || undefined}
      data-table={tb.id}
      data-state={state}
      onClick={() => selectable && onSelect()}
      onKeyDown={onKey}
      transform={`translate(${tb.x} ${tb.y})`}
      className={`outline-none group ${selectable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
      opacity={state === 'no-apta' ? 0.35 : 1}
    >
      <title>{label}</title>
      {/* Área táctil generosa */}
      <rect x={-w / 2 - 16} y={-h / 2 - 16} width={w + 32} height={h + 32} fill="transparent" />
      {chairPositions(tb, w, h).map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={6} fill={state === 'ocupada' ? C.occupied : C.floor} stroke={stroke} strokeWidth={1.5} />
      ))}
      {tb.shape === 'round' ? (
        <circle r={w / 2} fill={fill} stroke={stroke} strokeWidth={2} strokeDasharray={state === 'no-apta' ? '4 4' : undefined} />
      ) : (
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={tb.shape === 'square' ? 6 : 10} fill={fill} stroke={stroke} strokeWidth={2} strokeDasharray={state === 'no-apta' ? '4 4' : undefined} />
      )}
      {state === 'ocupada' && (
        <line x1={-w / 2 + 8} y1={h / 2 - 8} x2={w / 2 - 8} y2={-h / 2 + 8} stroke={C.line} strokeWidth={1.5} />
      )}
      <text textAnchor="middle" dy="-0.1em" fontSize={16} fontWeight={700} fill={text} fontFamily="Inter, sans-serif">
        {tb.id}
      </text>
      <text textAnchor="middle" dy="1.15em" fontSize={10} fill={text} fontFamily="Inter, sans-serif">
        {tb.seats}p
      </text>
      {/* Anillo de foco visible para teclado */}
      <rect
        x={-w / 2 - 20}
        y={-h / 2 - 20}
        width={w + 40}
        height={h + 40}
        rx={12}
        fill="none"
        stroke={C.gold}
        strokeWidth={2.5}
        className="opacity-0 group-focus-visible:opacity-100"
      />
    </g>
  );
}

export default function FloorPlan({ booking, reservations, onSelectTable, onContinue }: FloorPlanProps) {
  const [zoom, setZoom] = useState(1);
  const occupied = useMemo(
    () => occupiedTables(booking.date, booking.time, reservations),
    [booking.date, booking.time, reservations]
  );
  const unavailableDay = isClosedISO(booking.date) || isSlotPast(booking.date, booking.time);
  const states = TABLES.map((tb) => ({
    tb,
    state: unavailableDay ? ('ocupada' as TableState) : tableState(tb, booking.guests, occupied, booking.tableId),
  }));
  const freeCount = states.filter((s) => s.state === 'libre' || s.state === 'seleccionada').length;
  const selected = TABLES.find((tb) => tb.id === booking.tableId);

  return (
    <section id="plano" className="py-20 md:py-28 px-5 sm:px-6 md:px-12 bg-background border-t border-outline-variant/30">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Plano del salón"
          title="Elegí tu mesa"
          description="Las mesas libres se actualizan con la fecha, el horario y la cantidad de personas que elegiste."
        />

        <Reveal className="bg-surface-container border border-outline-variant/50 rounded-md p-4 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <p className="text-on-surface text-base" aria-live="polite">
              <span className="first-letter:uppercase inline-block font-semibold">{formatLongDate(booking.date)}</span> · {booking.time} hs ·{' '}
              {booking.guests} {booking.guests === 1 ? 'persona' : 'personas'}
              <span className="block text-sm text-on-surface-variant">
                {unavailableDay
                  ? 'Ese día u horario no está disponible. Cambialo en la reserva rápida.'
                  : `${freeCount} ${freeCount === 1 ? 'mesa disponible' : 'mesas disponibles'} para tu grupo`}
              </span>
            </p>

            <div className="flex items-center gap-2" role="group" aria-label="Zoom del plano">
              <button type="button" onClick={() => setZoom((z) => Math.max(1, z - 0.5))} disabled={zoom <= 1} aria-label="Alejar plano" className="w-11 h-11 inline-flex items-center justify-center border border-outline-variant rounded-sm text-on-surface hover:border-primary disabled:opacity-40">
                <Minus size={18} />
              </button>
              <span className="w-12 text-center text-sm text-on-surface-variant tabular-nums" aria-live="polite">
                {Math.round(zoom * 100)}%
              </span>
              <button type="button" onClick={() => setZoom((z) => Math.min(2.5, z + 0.5))} disabled={zoom >= 2.5} aria-label="Acercar plano" className="w-11 h-11 inline-flex items-center justify-center border border-outline-variant rounded-sm text-on-surface hover:border-primary disabled:opacity-40">
                <Plus size={18} />
              </button>
              <button type="button" onClick={() => setZoom(1)} aria-label="Restablecer zoom" className="w-11 h-11 inline-flex items-center justify-center border border-outline-variant rounded-sm text-on-surface hover:border-primary">
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          {/* Contenedor con scroll propio: el plano puede crecer sin romper el layout */}
          <div
            className="overflow-auto overscroll-contain rounded-sm border border-outline-variant/50 bg-surface-dim touch-pan-x touch-pan-y"
            tabIndex={-1}
            data-testid="floorplan-scroll"
          >
            <div style={{ width: `${zoom * 100}%` }} className="min-w-[720px]">
              <svg viewBox="0 0 800 520" className="block w-full h-auto" role="group" aria-label="Plano del salón de MESA">
                <defs>
                  <pattern id="floor-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M20 0H0V20" fill="none" stroke="#1F1A14" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="800" height="520" fill="url(#floor-grid)" />

                {ZONE_AREAS.map((z) => {
                  const active = booking.zone === z.zone;
                  return (
                    <g key={z.zone} aria-hidden="true">
                      <rect x={z.x} y={z.y} width={z.w} height={z.h} rx={10} fill={active ? 'rgba(212,175,55,0.06)' : 'rgba(21,18,14,0.6)'} stroke={active ? C.gold : C.line} strokeOpacity={active ? 0.7 : 1} strokeWidth={1.5} strokeDasharray={z.zone === 'Terraza' ? '6 5' : undefined} />
                      <text x={z.x + 14} y={z.y + 24} fontSize={13} fontWeight={600} letterSpacing="2" fill={active ? C.gold : C.muted} fontFamily="Inter, sans-serif">
                        {z.zone.toUpperCase()}
                      </text>
                    </g>
                  );
                })}

                {/* Mostrador de la barra y cava */}
                <g aria-hidden="true">
                  <rect x={40} y={460} width={420} height={20} rx={4} fill="#2A241C" stroke={C.line} />
                  <text x={250} y={474} textAnchor="middle" fontSize={10} fill={C.muted} fontFamily="Inter, sans-serif" letterSpacing="3">MOSTRADOR</text>
                  <text x={640} y={490} textAnchor="middle" fontSize={10} fill={C.muted} fontFamily="Inter, sans-serif" letterSpacing="2">JUNTO A LA CAVA</text>
                </g>

                {states.map(({ tb, state }) => (
                  <TableShapeSvg key={tb.id} tb={tb} state={state} onSelect={() => onSelectTable(tb)} />
                ))}
              </svg>
            </div>
          </div>
          <p className="md:hidden text-xs text-on-surface-variant mt-2">Deslizá el plano para ver todas las zonas.</p>

          <div className="mt-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-on-surface-variant">
              <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-sm border-2 border-primary bg-primary/15" aria-hidden="true" />Libre</li>
              <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-sm bg-primary" aria-hidden="true" />Seleccionada</li>
              <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-sm border-2 border-outline-variant bg-surface-container-high" aria-hidden="true" />Ocupada</li>
              <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-sm border-2 border-dashed border-primary opacity-40" aria-hidden="true" />No apta para tu grupo</li>
            </ul>

            <button
              type="button"
              onClick={onContinue}
              disabled={unavailableDay}
              className="min-h-12 px-6 bg-primary text-on-primary hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold uppercase tracking-[0.15em] rounded-sm transition-colors"
            >
              {selected ? `Reservar la mesa ${selected.id}` : 'Continuar sin elegir mesa'}
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
