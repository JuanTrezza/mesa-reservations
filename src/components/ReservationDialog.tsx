import { useEffect, useState } from 'react';
import { CalendarPlus, CheckCircle2, Clock3, Download } from 'lucide-react';
import Modal from './Modal';
import type { Reservation } from '../types';
import { formatLongDate, STATUS_LABEL } from '../lib/booking';
import { getTable } from '../lib/floorplan';
import { downloadFile, downloadICS, RESTAURANT_ADDRESS } from '../lib/ics';

interface ReservationDialogProps {
  reservation: Reservation | null;
  /** true justo después de reservar: cambia el título y muestra el acceso a "Mis reservas". */
  justBooked: boolean;
  onClose: () => void;
  onGoToMine: () => void;
}

const QR_COLORS = { dark: '#1A1405', light: '#FFFFFF' };

/** Arma un PNG imprimible: QR + código + datos de la reserva. */
async function buildQrPng(r: Reservation): Promise<string> {
  const QRCode = (await import('qrcode')).default;
  const qr = document.createElement('canvas');
  await QRCode.toCanvas(qr, r.code, { width: 480, margin: 2, color: QR_COLORS, errorCorrectionLevel: 'M' });

  const c = document.createElement('canvas');
  c.width = 600;
  c.height = 820;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = '#1A1405';
  ctx.textAlign = 'center';
  ctx.font = 'italic 700 44px "Playfair Display", Georgia, serif';
  ctx.fillText('MESA', 300, 70);
  ctx.drawImage(qr, 60, 95);
  ctx.font = '700 40px Inter, Arial, sans-serif';
  ctx.fillText(r.code, 300, 630);
  ctx.font = '400 24px Inter, Arial, sans-serif';
  ctx.fillStyle = '#4D4635';
  const date = formatLongDate(r.date);
  ctx.fillText(`${date.charAt(0).toUpperCase() + date.slice(1)} · ${r.time} hs`, 300, 680);
  ctx.fillText(`${r.guests} ${r.guests === 1 ? 'persona' : 'personas'} · ${r.zone}`, 300, 718);
  ctx.font = '400 20px Inter, Arial, sans-serif';
  ctx.fillText(RESTAURANT_ADDRESS, 300, 775);
  return c.toDataURL('image/png');
}

export default function ReservationDialog({ reservation: r, justBooked, onClose, onGoToMine }: ReservationDialogProps) {
  const [qrSrc, setQrSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!r) return;
    let cancelled = false;
    setQrSrc(null);
    import('qrcode').then(({ default: QRCode }) =>
      QRCode.toDataURL(r.code, { width: 360, margin: 2, color: QR_COLORS, errorCorrectionLevel: 'M' }).then((url) => {
        if (!cancelled) setQrSrc(url);
      })
    );
    return () => {
      cancelled = true;
    };
  }, [r]);

  const table = r ? getTable(r.tableId) : undefined;
  const pending = r?.status === 'pendiente';
  const inactive = r && (r.status === 'cancelada' || r.status === 'finalizada');

  return (
    <Modal open={!!r} onClose={onClose} labelledBy="reservation-dialog-title" className="max-w-md">
      {r && (
        <div className="text-center space-y-5">
          <div className="space-y-2 pt-2">
            {justBooked && (
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary" aria-hidden="true">
                {pending ? <Clock3 size={34} /> : <CheckCircle2 size={36} />}
              </div>
            )}
            <h2 id="reservation-dialog-title" className="font-serif text-3xl font-semibold text-primary">
              {justBooked ? (pending ? '¡Solicitud recibida!' : '¡Reserva confirmada!') : 'Tu reserva'}
            </h2>
            {pending && (
              <p className="text-sm text-amber-200">Te confirmamos por teléfono dentro de las próximas 24 horas.</p>
            )}
          </div>

          <div className="bg-white p-3 rounded-sm inline-block shadow-xl">
            {qrSrc ? (
              <img src={qrSrc} alt={`Código QR de la reserva ${r.code}`} width={180} height={180} className="w-[180px] h-[180px]" />
            ) : (
              <div className="w-[180px] h-[180px] bg-neutral-100 animate-pulse" role="img" aria-label="Generando código QR" />
            )}
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-on-surface-variant font-semibold">Código de reserva</p>
            <p className="font-mono text-2xl font-bold tracking-[0.15em] text-on-surface mt-1" data-testid="reservation-code">
              {r.code}
            </p>
          </div>

          <dl className="text-left text-sm grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 bg-surface-container-low border border-outline-variant/60 rounded-sm p-4">
            <dt className="text-on-surface-variant">Fecha</dt>
            <dd className="text-on-surface first-letter:uppercase">{formatLongDate(r.date)}</dd>
            <dt className="text-on-surface-variant">Hora</dt>
            <dd className="text-on-surface">{r.time} hs</dd>
            <dt className="text-on-surface-variant">Personas</dt>
            <dd className="text-on-surface">{r.guests}</dd>
            <dt className="text-on-surface-variant">Lugar</dt>
            <dd className="text-on-surface">
              {r.zone}
              {table ? ` · Mesa ${table.id}` : ''}
            </dd>
            <dt className="text-on-surface-variant">Titular</dt>
            <dd className="text-on-surface break-words">{r.name}</dd>
            <dt className="text-on-surface-variant">Estado</dt>
            <dd className="text-on-surface">{STATUS_LABEL[r.status]}</dd>
          </dl>

          {!inactive && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => downloadICS(r)}
                className="min-h-12 px-4 inline-flex items-center justify-center gap-2 bg-primary text-on-primary hover:bg-primary-container text-xs font-bold uppercase tracking-[0.12em] rounded-sm transition-colors"
              >
                <CalendarPlus size={16} aria-hidden="true" /> Agregar al calendario
              </button>
              <button
                type="button"
                onClick={async () => downloadFile(`qr-${r.code}.png`, await buildQrPng(r))}
                className="min-h-12 px-4 inline-flex items-center justify-center gap-2 border border-primary/60 text-primary hover:bg-primary/10 text-xs font-bold uppercase tracking-[0.12em] rounded-sm transition-colors"
              >
                <Download size={16} aria-hidden="true" /> Descargar QR
              </button>
            </div>
          )}

          <p className="text-sm text-on-surface-variant leading-relaxed">
            Mostrá este código en la recepción y te acompañamos directo a tu mesa.
          </p>

          {justBooked && (
            <button
              type="button"
              onClick={onGoToMine}
              className="min-h-11 px-3 text-primary text-sm font-semibold underline underline-offset-4 hover:text-primary-container"
            >
              Ver mis reservas
            </button>
          )}
        </div>
      )}
    </Modal>
  );
}
