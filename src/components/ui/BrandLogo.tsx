import { Theme } from '../../hooks/useTheme.ts';

export type LogoVariant = 'isologo' | 'imagotipo' | 'isotipo' | 'logotipo';

interface BrandLogoProps {
  theme: Theme;
  /** Tipo de logo de la marca Lumia */
  variant?: LogoVariant;
  className?: string;
  alt?: string;
}

/**
 * Logo de marca Lumia. Selecciona automáticamente la variante light/dark.
 * Los archivos viven en /public/logos con nombres kebab-case.
 */
export const BrandLogo = ({
  theme,
  variant = 'imagotipo',
  className = '',
  alt = 'Lumia',
}: BrandLogoProps) => {
  const src = `/logos/${variant}-${theme}.png`;
  return <img src={src} alt={alt} className={className} draggable={false} />;
};
