import { Icon } from './Icon.tsx';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Encabezado de tarjeta: título (Display) + acción secundaria opcional.
 * Sin contadores de cantidad (estética limpia).
 */
export const SectionHeader = ({ title, actionLabel, onAction }: SectionHeaderProps) => (
  <header className="av-sec">
    <h2 className="av-sec-title">{title}</h2>
    {actionLabel && (
      <button type="button" className="av-sec-action" onClick={onAction}>
        {actionLabel}
        <Icon name="arrow-right" size={15} />
      </button>
    )}
  </header>
);
