import { ReactNode } from 'react';

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  /** 'primary' = rosa pastel · 'ghost' = vidrio sin relleno */
  variant?: 'primary' | 'ghost';
  /** Ocupa el ancho disponible (con un máximo elegante) */
  block?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

/**
 * Botón principal de Lumia. Rosa pastel con texto oscuro (o variante vidrio).
 * Nunca azul. Reutilizable en welcome, auth y futuras acciones.
 */
export const PrimaryButton = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  block = false,
  loading = false,
  disabled = false,
}: PrimaryButtonProps) => {
  const base = variant === 'ghost' ? 'av-btn-ghost' : 'av-btn-primary';
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base}${block ? ` ${base}--block` : ''}`}
      aria-busy={loading}
    >
      {loading ? <span className="av-spinner" aria-hidden="true" /> : children}
    </button>
  );
};
