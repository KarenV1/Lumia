import { Theme } from '../../hooks/useTheme.ts';
import { Icon } from './Icon.tsx';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
  /** Variante compacta y sin vidrio (para la barra de estado del Home) */
  mini?: boolean;
}

/**
 * Botón para alternar tema. Muestra el icono del modo al que se cambiará.
 */
export const ThemeToggle = ({ theme, onToggle, mini = false }: ThemeToggleProps) => {
  const goingToDark = theme === 'light';
  return (
    <button
      type="button"
      className={`av-theme-toggle ${mini ? 'av-theme-toggle--mini' : ''}`}
      onClick={onToggle}
      aria-label={goingToDark ? 'Activar modo oscuro' : 'Activar modo claro'}
      title={goingToDark ? 'Modo oscuro' : 'Modo claro'}
    >
      <Icon key={theme} name={goingToDark ? 'moon' : 'sun'} size={mini ? 18 : 20} />
    </button>
  );
};
