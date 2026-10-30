import type { ReactNode } from 'react';
import { m } from 'motion/react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'li' | 'article';
}

/**
 * Animación de entrada suave al entrar en pantalla.
 * Con prefers-reduced-motion, MotionConfig (en App) anula el desplazamiento y solo queda el fundido.
 */
export default function Reveal({ children, className, delay = 0, as = 'div' }: RevealProps) {
  const Component = m[as] as typeof m.div;
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </Component>
  );
}
