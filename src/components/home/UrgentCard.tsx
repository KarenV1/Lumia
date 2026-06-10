import { Task } from '../../types/index.ts';
import { GlassCard } from '../ui/GlassCard.tsx';
import { Icon } from '../ui/Icon.tsx';

interface UrgentCardProps {
  task: Task;
}

/**
 * Tarjeta de urgencia: vidrio ligeramente más oscuro, círculo rosa con icono
 * de advertencia oscuro. Destaca sin romper la armonía (sin rojo fuerte).
 */
export const UrgentCard = ({ task }: UrgentCardProps) => (
  <GlassCard dark className="av-urgent">
    <span className="av-urgent-icon">
      <Icon name="alert" size={22} />
    </span>
    <div className="av-urgent-body">
      <p className="av-urgent-label">Urgente</p>
      <p className="av-urgent-title">{task.title}</p>
      <p className="av-urgent-sub">Antes de las {task.endTime}</p>
    </div>
  </GlassCard>
);
