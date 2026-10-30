import { useState } from 'react';
import Modal from './Modal';
import { FieldError, fieldClass, fieldState, labelClass } from './Field';
import { formatLongDate, type BookingState } from '../lib/booking';
import { getTable } from '../lib/floorplan';
import { validateContact, type ContactErrors } from '../lib/validation';

interface BookingDetailsDialogProps {
  open: boolean;
  booking: BookingState;
  onChange: (patch: Partial<BookingState>) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export default function BookingDetailsDialog({ open, booking, onChange, onClose, onConfirm }: BookingDetailsDialogProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const errors: ContactErrors = validateContact(booking);
  const show = (k: keyof ContactErrors) => (submitted || touched[k] ? errors[k] : undefined);
  const table = getTable(booking.tableId);

  const handleClose = () => {
    setTouched({});
    setSubmitted(false);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length) {
      const first = Object.keys(errors)[0];
      document.getElementById(`bk-${first}`)?.focus();
      return;
    }
    setTouched({});
    setSubmitted(false);
    onConfirm();
  };

  const field = (key: 'name' | 'email' | 'phone', label: string, props: React.InputHTMLAttributes<HTMLInputElement>) => {
    const err = show(key);
    return (
      <div>
        <label htmlFor={`bk-${key}`} className={labelClass}>
          {label}
        </label>
        <input
          id={`bk-${key}`}
          value={booking[key]}
          onChange={(e) => onChange({ [key]: e.target.value })}
          onBlur={() => setTouched((t) => ({ ...t, [key]: true }))}
          aria-invalid={err ? true : undefined}
          aria-describedby={err ? `bk-${key}-error` : undefined}
          className={`${fieldClass} ${fieldState(err)} mt-1.5`}
          {...props}
        />
        <FieldError id={`bk-${key}-error`} message={err} />
      </div>
    );
  };

  return (
    <Modal open={open} onClose={handleClose} labelledBy="booking-dialog-title" className="max-w-md">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="border-b border-outline-variant/60 pb-3 pr-10">
          <h2 id="booking-dialog-title" className="font-serif text-3xl font-semibold text-primary">
            Completá tu reserva
          </h2>
          <p className="text-sm text-on-surface-variant mt-1 first-letter:uppercase">
            {formatLongDate(booking.date)} · {booking.time} hs · {booking.guests} {booking.guests === 1 ? 'persona' : 'personas'}
          </p>
          <p className="text-sm text-on-surface-variant">
            {booking.zone}
            {table ? ` · Mesa ${table.id}` : ' · te asignamos la mejor mesa disponible'}
          </p>
        </div>

        {field('name', 'Nombre y apellido *', { type: 'text', autoComplete: 'name', placeholder: 'Ej. Lucía Fernández', 'data-autofocus': true } as React.InputHTMLAttributes<HTMLInputElement>)}
        {field('email', 'Email *', { type: 'email', autoComplete: 'email', inputMode: 'email', placeholder: 'tu@email.com' })}
        {field('phone', 'Celular *', { type: 'tel', autoComplete: 'tel', inputMode: 'tel', placeholder: '+54 11 5123-4567' })}

        <div>
          <label htmlFor="bk-notes" className={labelClass}>
            Pedidos especiales o alergias (opcional)
          </label>
          <textarea
            id="bk-notes"
            value={booking.specialRequests}
            onChange={(e) => onChange({ specialRequests: e.target.value })}
            placeholder="Ej. opción vegetariana, alergia a frutos secos…"
            rows={2}
            maxLength={240}
            className={`${fieldClass} ${fieldState()} resize-none mt-1.5`}
          />
        </div>

        <button
          type="submit"
          // Sin esto, el blur del último campo muestra su error, el botón se corre y el click se pierde
          onMouseDown={(e) => e.preventDefault()}
          className="w-full min-h-12 bg-primary text-on-primary rounded-sm text-xs font-bold uppercase tracking-[0.2em] hover:bg-primary-container transition-colors"
        >
          Confirmar reserva
        </button>
      </form>
    </Modal>
  );
}
