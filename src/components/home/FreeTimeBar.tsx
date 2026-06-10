import { GlassCard } from '../ui/GlassCard.tsx';
import { FreeSummary, formatFreeDuration } from '../../utils/freeTime.ts';

interface FreeTimeBarProps {
  summary: FreeSummary;
}

/**
 * Tarjeta de espacios libres: barra elegante rosa pastel que visualiza cuánto
 * tiempo libre queda en el día. Objetivo central de Aveli.
 */
export const FreeTimeBar = ({ summary }: FreeTimeBarProps) => (
  <GlassCard>
    <div className="av-free-head">
      <h2 className="av-free-title">Espacios libres</h2>
      {summary.largestRange && <span className="av-free-range">{summary.largestRange}</span>}
    </div>
    <div className="av-free-track">
      <div className="av-free-fill" style={{ width: `${summary.percent}%` }} />
    </div>
    <p className="av-free-caption">{formatFreeDuration(summary.freeMinutes)}</p>
  </GlassCard>
);
