import { Routine } from '../../types/index.ts';
import { GlassCard } from '../ui/GlassCard.tsx';
import { SectionHeader } from '../ui/SectionHeader.tsx';
import { RoutineItem } from './RoutineItem.tsx';

interface RoutinesCardProps {
  routines: Routine[];
  onEdit?: () => void;
}

export const RoutinesCard = ({ routines, onEdit }: RoutinesCardProps) => (
  <GlassCard>
    <SectionHeader title="Rutinas" count={routines.length} actionLabel="Editar" onAction={onEdit} />
    <div className="av-routines">
      {routines.map((routine) => (
        <RoutineItem key={routine.id} routine={routine} />
      ))}
    </div>
  </GlassCard>
);
