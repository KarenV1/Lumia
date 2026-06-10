import { CSSProperties } from 'react';
import { Routine } from '../../types/index.ts';
import { getRoutineStyle } from '../../utils/categoryStyle.ts';
import { Icon } from '../ui/Icon.tsx';

interface RoutineItemProps {
  routine: Routine;
}

/**
 * Fila de rutina: icono cuadrado-redondeado con color propio, nombre y horario.
 */
export const RoutineItem = ({ routine }: RoutineItemProps) => {
  const { icon, color } = getRoutineStyle(routine.name);

  return (
    <div className="av-routine">
      <span
        className="av-routine-icon"
        style={{ '--routine-color': color } as CSSProperties}
      >
        <Icon name={icon} size={21} />
      </span>
      <div className="av-routine-body">
        <p className="av-routine-name">{routine.name}</p>
      </div>
      <span className="av-routine-time">
        {routine.startTime} – {routine.endTime}
      </span>
    </div>
  );
};
