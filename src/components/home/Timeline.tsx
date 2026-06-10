import { CSSProperties } from 'react';
import { Task } from '../../types/index.ts';
import { getTaskStyle } from '../../utils/categoryStyle.ts';
import { Icon } from '../ui/Icon.tsx';

interface TimelineProps {
  tasks: Task[];
}

/**
 * Línea de tiempo vertical. Cada actividad: nodo con icono (izquierda),
 * título + subtítulo, y hora alineada a la derecha. Una línea conecta los nodos.
 */
export const Timeline = ({ tasks }: TimelineProps) => {
  if (tasks.length === 0) {
    return <p className="av-empty">Nada en la agenda de hoy. Disfruta la calma.</p>;
  }

  return (
    <ul className="av-timeline">
      {tasks.map((task) => {
        const { icon, color } = getTaskStyle(task.urgency);
        return (
          <li key={task.id} className="av-tl-item">
            <div className="av-tl-left">
              <span
                className="av-tl-node"
                style={{ '--node-color': color } as CSSProperties}
              >
                <Icon name={icon} size={19} />
              </span>
              <span className="av-tl-line" />
            </div>
            <div className="av-tl-body">
              <p className="av-tl-title">{task.title}</p>
              {task.description && <p className="av-tl-sub">{task.description}</p>}
            </div>
            <span className="av-tl-time">{task.startTime}</span>
          </li>
        );
      })}
    </ul>
  );
};
