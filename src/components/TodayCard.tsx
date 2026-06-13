import { Task, Routine } from '../types/index.ts';
import { GlassCard } from './ui/GlassCard.tsx';
import { SectionHeader } from './ui/SectionHeader.tsx';
import { DayPanorama } from './home/DayPanorama.tsx';

interface TodayCardProps {
  tasks: Task[];
  routines: Routine[];
  date: string;
  onOpenCalendar: () => void;
}

/**
 * Tarjeta "Hoy": panorama del día (bloques + espacios libres + hábitos).
 * La acción "Calendario" abre la vista de calendario.
 */
export const TodayCard = ({ tasks, routines, date, onOpenCalendar }: TodayCardProps) => (
  <GlassCard>
    <SectionHeader title="Hoy" actionLabel="Calendario" onAction={onOpenCalendar} />
    <DayPanorama tasks={tasks} routines={routines} date={date} />
  </GlassCard>
);
