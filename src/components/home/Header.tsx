import { Theme } from '../../hooks/useTheme.ts';
import { formatHeaderDate } from '../../utils/dateHelper.ts';
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
 * Cabecera de la pantalla: cambio de tema discreto, saludo editorial (elemento
 * más grande), clima y fecha.
 */
export const Header = ({ name, weather, theme, onToggleTheme }: HeaderProps) => {
  const date = formatHeaderDate();

  return (
    <header className="av-header">
      {/* Cambio de tema, discreto, arriba a la derecha */}
      <div className="av-statusbar">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} mini />
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
