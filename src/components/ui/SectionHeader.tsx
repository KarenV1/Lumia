import { Icon } from './Icon.tsx';

interface SectionHeaderProps {
  title: string;
  count?: number;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Encabezado de tarjeta: título (Display) + contador opcional + acción secundaria.
 */
export const SectionHeader = ({ title, count, actionLabel, onAction }: SectionHeaderProps) => (
  <header className="av-sec">
    <div className="av-sec-left">
      <h2 className="av-sec-title">{title}</h2>
      {count !== undefined && <span className="av-sec-count">{count}</span>}
    </div>
    {actionLabel && (
      <button type="button" className="av-sec-action" onClick={onAction}>
        {actionLabel}
        <Icon name="arrow-right" size={15} />
      </button>
    )}
  </header>
);
