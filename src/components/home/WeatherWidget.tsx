import { Icon } from '../ui/Icon.tsx';

interface WeatherWidgetProps {
  temp: number;
  description: string;
}

/**
 * Clima minimalista, sin tarjeta ni borde. Icono outline monocromático.
 */
export const WeatherWidget = ({ temp, description }: WeatherWidgetProps) => (
  <div className="av-weather">
    <div className="av-weather-top">
      <Icon name="cloud-sun" size={24} />
      <span className="av-weather-temp">{temp}°</span>
    </div>
    <span className="av-weather-desc">{description}</span>
  </div>
);
