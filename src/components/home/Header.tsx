import { useClock } from '../../hooks/useClock.ts';
import { Theme } from '../../hooks/useTheme.ts';
import { formatHeaderDate } from '../../utils/dateHelper.ts';
import { Icon } from '../ui/Icon.tsx';
import { ThemeToggle } from '../ui/ThemeToggle.tsx';
import { Avatar } from './Avatar.tsx';
import { WeatherWidget } from './WeatherWidget.tsx';

interface HeaderProps {
  name: string;
  weather: { temp: number; description: string };
  theme: Theme;
  onToggleTheme: () => void;
}

/**
 * Cabecera de la pantalla: barra de estado (hora + tema + indicadores del
 * sistema), saludo editorial (elemento más grande), clima y fecha.
 */
export const Header = ({ name, weather, theme, onToggleTheme }: HeaderProps) => {
  const time = useClock();
  const date = formatHeaderDate();

  return (
    <header className="av-header">
      {/* Barra de estado */}
      <div className="av-statusbar">
        <span className="av-statusbar-time">{time}</span>
        <div className="av-statusbar-icons">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} mini />
          <Icon name="signal" size={16} />
          <Icon name="wifi" size={16} />
          <Icon name="battery" size={18} />
        </div>
      </div>

      {/* Saludo + clima */}
      <div className="av-header-main">
        <h1 className="av-greeting">
          <span className="av-greeting-comma">Hola,</span>
          <span>{name}</span>
        </h1>

        <div className="av-header-right">
          <Avatar initial={name.charAt(0)} />
          <WeatherWidget temp={weather.temp} description={weather.description} />
        </div>
      </div>

      <p className="av-date">{date}</p>
    </header>
  );
};
