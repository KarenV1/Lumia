export type LogoVariant = 'isologo' | 'imagotipo' | 'isotipo' | 'logotipo';

interface BrandLogoProps {
  variant?: LogoVariant;
  className?: string;
  /** Compatibilidad: ya no se usa para elegir imagen (el SVG se adapta solo). */
  theme?: unknown;
  alt?: string;
}

/**
 * Marca Lumia 100% vectorial (sin imágenes con fondo).
 * - El sol usa un degradado durazno constante (identidad de marca).
 * - La palabra "LUMIA" usa `currentColor`, así cambia de tema al instante junto
 *   al resto de la UI, sin halo, borde ni recorte.
 */
const Mark = () => (
  <svg className="av-logo-mark" viewBox="0 0 120 92" aria-hidden="true">
    <defs>
      <linearGradient id="lumiaSun" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F8DBD0" />
        <stop offset="0.55" stopColor="#EBAE96" />
        <stop offset="1" stopColor="#CE8067" />
      </linearGradient>
    </defs>
    {/* crescent / destello superior */}
    <path
      d="M43 45 A19 19 0 0 1 77 39"
      fill="none"
      stroke="url(#lumiaSun)"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    {/* disco solar */}
    <circle cx="60" cy="49" r="18.5" fill="url(#lumiaSun)" />
    {/* horizonte */}
    <path
      d="M16 74 Q60 62 104 74"
      fill="none"
      stroke="url(#lumiaSun)"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);

const Word = () => <span className="av-logo-word">LUMIA</span>;

export const BrandLogo = ({ variant = 'imagotipo', className = '' }: BrandLogoProps) => {
  return (
    <div className={`av-logo av-logo--${variant} ${className}`.trim()} role="img" aria-label="Lumia">
      {variant !== 'logotipo' && <Mark />}
      {variant !== 'isotipo' && <Word />}
    </div>
  );
};
