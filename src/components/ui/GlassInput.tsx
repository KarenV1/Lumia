import { InputHTMLAttributes } from 'react';

type GlassInputProps = InputHTMLAttributes<HTMLInputElement>;

/**
 * Input de vidrio base (presentacional). Estilos según design-system.md:
 * alto 56px, glass, radio 28px, placeholder claro, bordes muy suaves.
 */
export const GlassInput = ({ className = '', ...rest }: GlassInputProps) => (
  <input className={`av-input ${className}`.trim()} {...rest} />
);
