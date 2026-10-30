import { useState } from 'react';
import { Lock } from 'lucide-react';
import { FieldError, fieldClass, fieldState, labelClass } from '../components/Field';

export const DEMO_PIN = '1234';

interface AdminLoginProps {
  onSuccess: () => void;
  onExit: () => void;
}

export default function AdminLogin({ onSuccess, onExit }: AdminLoginProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string>();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === DEMO_PIN) onSuccess();
    else setError('PIN incorrecto. En esta demo el PIN es 1234.');
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-5">
      <div className="w-full max-w-sm bg-surface-container border border-outline-variant/60 rounded-md p-6 sm:p-8 shadow-2xl">
        <div className="text-center space-y-2 mb-6">
          <span className="inline-flex w-12 h-12 items-center justify-center rounded-full bg-primary/10 text-primary" aria-hidden="true">
            <Lock size={22} />
          </span>
          <p className="font-display italic text-primary text-3xl">MESA</p>
          <h1 className="font-serif text-2xl font-semibold text-on-surface">Acceso restaurante</h1>
        </div>

        <p className="text-sm bg-primary/10 border border-primary/40 text-on-surface rounded-sm p-3 mb-5">
          <strong className="text-primary">Demo:</strong> este panel es de muestra y no tiene seguridad real. Ingresá con el PIN{' '}
          <strong className="font-mono text-primary">1234</strong>.
        </p>

        <form onSubmit={submit} noValidate className="space-y-4">
          <div>
            <label htmlFor="admin-pin" className={labelClass}>
              PIN
            </label>
            <input
              id="admin-pin"
              type="password"
              inputMode="numeric"
              autoComplete="off"
              maxLength={4}
              autoFocus
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, ''));
                setError(undefined);
              }}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'admin-pin-error' : undefined}
              className={`${fieldClass} ${fieldState(error)} mt-1.5 text-center text-2xl tracking-[0.6em] font-mono`}
            />
            <FieldError id="admin-pin-error" message={error} />
          </div>
          <button type="submit" className="w-full min-h-12 bg-primary text-on-primary hover:bg-primary-container text-xs font-bold uppercase tracking-[0.2em] rounded-sm transition-colors">
            Entrar
          </button>
          <button type="button" onClick={onExit} className="w-full min-h-11 text-sm text-on-surface-variant hover:text-primary">
            Volver al sitio
          </button>
        </form>
      </div>
    </main>
  );
}
