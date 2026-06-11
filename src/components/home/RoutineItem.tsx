import { CSSProperties } from 'react';
import { Routine } from '../../types/index.ts';
import { getRoutineStyle } from '../../utils/categoryStyle.ts';
import { routineScheduleText } from '../../utils/routine.ts';
import { Icon, IconName } from '../ui/Icon.tsx';

interface RoutineItemProps {
  routine: Routine;
  onEdit: (routine: Routine) => void;
  onToggle: (routine: Routine) => void;
}

/**
 * Fila de rutina: icono con color propio, nombre y horario legible. Tocar la
 * fila abre el editor; el interruptor activa/desactiva.
 */
export const RoutineItem = ({ routine, onEdit, onToggle }: RoutineItemProps) => {
  const icon = (routine.icon as IconName) || getRoutineStyle(routine.name).icon;
  const color = routine.color || getRoutineStyle(routine.name).color;

  return (
    <div
      className={`av-routine${routine.active ? '' : ' is-off'}`}
      role="button"
      tabIndex={0}
      onClick={() => onEdit(routine)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onEdit(routine)}
    >
      <span className="av-routine-icon" style={{ '--routine-color': color } as CSSProperties}>
        <Icon name={icon} size={21} />
      </span>
      <div className="av-routine-body">
        <p className="av-routine-name">{routine.name}</p>
        <p className="av-routine-sub">{routineScheduleText(routine)}</p>
      </div>
      <label className="av-switch av-switch--sm" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={routine.active}
          onChange={() => onToggle(routine)}
          aria-label={routine.active ? 'Desactivar rutina' : 'Activar rutina'}
        />
        <span className="av-switch-track">
          <span className="av-switch-thumb" />
        </span>
      </label>
    </div>
  );
};
