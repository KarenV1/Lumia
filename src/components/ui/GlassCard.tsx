import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  /** Variante más oscura (p. ej. tarjeta de urgencia) */
  dark?: boolean;
  className?: string;
}

/**
 * Contenedor de vidrio base. Todos los valores vienen del design system.
 */
export const GlassCard = ({ children, dark = false, className = '' }: GlassCardProps) => (
  <section className={`av-card ${dark ? 'av-card--dark' : ''} ${className}`}>{children}</section>
);
