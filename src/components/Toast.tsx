import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Info, X } from 'lucide-react';

export interface ToastData {
  id: number;
  title: string;
  message?: string;
  tone?: 'success' | 'info';
}

interface ToastProps {
  toast: ToastData | null;
  onDismiss: () => void;
}

export default function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(onDismiss, 6000);
    return () => window.clearTimeout(t);
  }, [toast, onDismiss]);

  const Icon = toast?.tone === 'info' ? Info : CheckCircle2;

  return (
    <div
      aria-live="polite"
      role="status"
      className="fixed z-[120] bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-96 pointer-events-none"
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="pointer-events-auto flex items-start gap-3 bg-surface-container-high border border-primary/40 border-l-4 border-l-primary rounded-sm shadow-2xl p-4 pr-2"
          >
            <Icon size={20} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-on-surface">{toast.title}</p>
              {toast.message && <p className="text-sm text-on-surface-variant mt-1 leading-snug">{toast.message}</p>}
            </div>
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Cerrar aviso"
              className="w-11 h-11 -my-2 shrink-0 inline-flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors rounded-sm"
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
