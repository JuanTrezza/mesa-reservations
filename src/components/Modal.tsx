import { useEffect, useRef, type ReactNode } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
  className?: string;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Diálogo accesible: Escape cierra, el foco queda adentro y vuelve al disparador al cerrar. */
export default function Modal({ open, onClose, labelledBy, children, className = '' }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  // onClose suele ser una función nueva en cada render: con un ref, el efecto corre solo al abrir/cerrar
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const onClose = () => onCloseRef.current();
    const previous = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    const raf = requestAnimationFrame(() => {
      const first = panelRef.current?.querySelector<HTMLElement>('[data-autofocus]') ?? panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      first?.focus();
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
      if (e.key === 'Tab' && panelRef.current) {
        const items = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
        if (!items.length) return;
        const [first, last] = [items[0], items[items.length - 1]];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previous?.focus?.();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <m.div
          className="fixed inset-0 bg-background/90 backdrop-blur-md z-[100] flex items-start sm:items-center justify-center p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <m.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
            className={`bg-surface-container border border-outline-variant p-6 md:p-8 rounded-md w-full relative my-auto shadow-2xl ${className}`}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute top-2 right-2 w-11 h-11 inline-flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors rounded-sm"
            >
              <X size={20} />
            </button>
            {children}
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
