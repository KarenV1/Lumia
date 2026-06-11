import { Routine } from '../../types/index.ts';
import { GlassCard } from '../ui/GlassCard.tsx';
import { SectionHeader } from '../ui/SectionHeader.tsx';
import { Icon } from '../ui/Icon.tsx';
import { RoutineItem } from './RoutineItem.tsx';

interface RoutinesCardProps {
  routines: Routine[];
  onNew: () => void;
  onEdit: (routine: Routine) => void;
  onToggle: (routine: Routine) => void;
}

export const RoutinesCard = ({ routines, onNew, onEdit, onToggle }: RoutinesCardProps) => (
  <GlassCard>
    <SectionHeader title="Rutinas" actionLabel="Nueva" onAction={onNew} />
    <div className="av-routines">
      {routines.map((routine) => (
        <RoutineItem key={routine.id} routine={routine} onEdit={onEdit} onToggle={onToggle} />
      ))}
    </div>
    <button type="button" className="av-routine-add" onClick={onNew}>
      <Icon name="plus" size={18} strokeWidth={2} />
      Nueva rutina
    </button>
  </GlassCard>
);
