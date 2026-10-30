import { AlertCircle } from 'lucide-react';

export const fieldClass =
  'w-full min-h-12 bg-surface-container-lowest border rounded-sm text-on-surface p-3 text-base sm:text-sm focus:outline-none focus:ring-1 transition-colors placeholder:text-on-surface-variant/80';
export const labelClass = 'text-xs text-on-surface-variant uppercase tracking-wider font-semibold block';

export function fieldState(error?: string) {
  return error
    ? 'border-rose-400 focus:border-rose-300 focus:ring-rose-300/40'
    : 'border-outline-variant focus:border-primary focus:ring-primary/40';
}

/** Mensaje de error debajo del campo; se vincula con aria-describedby. */
export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="flex items-start gap-1.5 text-sm text-rose-300 mt-1.5">
      <AlertCircle size={15} className="shrink-0 mt-0.5" aria-hidden="true" />
      {message}
    </p>
  );
}
