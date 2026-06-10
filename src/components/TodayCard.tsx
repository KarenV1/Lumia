import { Task } from '../types/index.ts';
import { GlassCard } from './ui/GlassCard.tsx';
import { SectionHeader } from './ui/SectionHeader.tsx';
import { Timeline } from './home/Timeline.tsx';

interface TodayCardProps {
  tasks: Task[];
  onOpenCalendar: () => void;
}

/**
 * Tarjeta "Hoy": encabezado + línea de tiempo con las actividades del día.
 * La acción "Ver agenda" abre la cápsula del calendario.
 */
export const TodayCard = ({ tasks, onOpenCalendar }: TodayCardProps) => (
  <GlassCard>
    <SectionHeader
      title="Hoy"
      count={tasks.length}
      actionLabel="Ver agenda"
      onAction={onOpenCalendar}
    />
    <Timeline tasks={tasks.slice(0, 3)} />
  </GlassCard>
);
