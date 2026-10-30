import type { Reservation } from '../types';
import { parseISODate } from '../lib/booking';

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function Bars({ counts, width, height, id, className }: { counts: number[]; width: number; height: number; id: string; className: string }) {
  const max = Math.max(1, ...counts);
  const pad = { top: 28, bottom: 32, x: 8 };
  const slot = (width - pad.x * 2) / DAYS.length;
  const barW = slot * 0.6;
  const chartH = height - pad.top - pad.bottom;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={`w-full h-auto ${className}`} role="img" aria-labelledby={`chart-title chart-desc-${id}`}>
      <desc id={`chart-desc-${id}`}>{DAYS.map((d, i) => `${d}: ${i === 0 ? 'cerrado' : counts[i]}`).join(', ')}</desc>
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <line key={f} x1={pad.x} x2={width - pad.x} y1={pad.top + chartH * (1 - f)} y2={pad.top + chartH * (1 - f)} stroke="#2A241C" />
      ))}
      <line x1={pad.x} x2={width - pad.x} y1={pad.top + chartH} y2={pad.top + chartH} stroke="#4D4635" />
      {counts.map((c, i) => {
        const h = (c / max) * chartH;
        const x = pad.x + slot * i + (slot - barW) / 2;
        const y = pad.top + chartH - h;
        const peak = c === max && c > 0;
        return (
          <g key={DAYS[i]}>
            {i === 0 ? (
              <text x={x + barW / 2} y={pad.top + chartH - 8} textAnchor="middle" fontSize="11" fill="#8F8672" fontFamily="Inter, sans-serif">
                cerrado
              </text>
            ) : (
              <>
                <rect x={x} y={y} width={barW} height={Math.max(h, 1)} rx={3} fill={peak ? '#E9C45A' : '#D4AF37'} fillOpacity={peak ? 1 : 0.75} />
                <text x={x + barW / 2} y={y - 8} textAnchor="middle" fontSize="13" fontWeight="600" fill="#F2EBDD" fontFamily="Inter, sans-serif">
                  {c}
                </text>
              </>
            )}
            <text x={x + barW / 2} y={height - 10} textAnchor="middle" fontSize="12" fill="#CBC1AF" fontFamily="Inter, sans-serif">
              {DAYS[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Barras simples en SVG: reservas (no canceladas) por día de la semana. */
export default function WeekdayChart({ reservations }: { reservations: Reservation[] }) {
  const counts = DAYS.map(() => 0);
  for (const r of reservations) {
    if (r.status === 'cancelada') continue;
    counts[(parseISODate(r.date).getDay() + 6) % 7]++; // lunes = 0
  }

  return (
    <figure className="bg-surface-container border border-outline-variant/50 rounded-md p-4 sm:p-6">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 mb-3">
        <span id="chart-title" className="font-serif text-2xl font-semibold text-on-surface">Reservas por día</span>
        <span className="text-xs text-on-surface-variant">Últimas 2 semanas y próximas 2</span>
      </figcaption>
      {/* Mismo gráfico con dos proporciones para que los textos se lean en mobile y no quede gigante en escritorio */}
      <Bars counts={counts} width={340} height={230} id="sm" className="sm:hidden" />
      <Bars counts={counts} width={900} height={240} id="lg" className="hidden sm:block" />
    </figure>
  );
}
