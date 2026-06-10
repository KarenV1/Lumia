import { IconName } from '../components/ui/Icon.tsx';
import { Urgency } from '../types/index.ts';

export interface CategoryStyle {
  icon: IconName;
  color: string;
}

/**
 * Mapea una rutina (por su nombre) a icono + color pastel.
 * Colores según design-system.md:
 *   Dormir → Lavanda · Agua → Azul · Trabajo → Gris
 *   Cursos/Clases → Beige · Ejercicio → Verde
 */
export const getRoutineStyle = (name: string): CategoryStyle => {
  const n = name.toLowerCase();
  if (/(dorm|sue|noche)/.test(n)) return { icon: 'moon', color: 'var(--lavanda)' };
  if (/(agua|hidrat|beber)/.test(n)) return { icon: 'droplet', color: 'var(--azul)' };
  if (/(clase|curso|estud|leer|escuela|universidad)/.test(n)) return { icon: 'book', color: 'var(--beige)' };
  if (/(trabaj|reuni|oficina|proyecto)/.test(n)) return { icon: 'briefcase', color: 'var(--gris)' };
  if (/(ejerc|gym|deporte|correr|entren)/.test(n)) return { icon: 'dumbbell', color: 'var(--verde)' };
  return { icon: 'clock', color: 'var(--rosa)' };
};

/**
 * Mapea una tarea a icono + color según su urgencia, para los nodos del timeline.
 */
export const getTaskStyle = (urgency: Urgency): CategoryStyle => {
  switch (urgency) {
    case 'urgente':
    case 'alta':
      return { icon: 'sparkle', color: 'var(--rosa)' };
    case 'media':
      return { icon: 'clock', color: 'var(--azul)' };
    case 'baja':
      return { icon: 'clock', color: 'var(--verde)' };
    default:
      return { icon: 'clock', color: 'var(--beige)' };
  }
};
