export type Urgency = 'baja' | 'media' | 'alta' | 'urgente';
export type TaskStatus = 'pendiente' | 'en_progreso' | 'completada' | 'pospuesta';
export type DayOfWeek = 'lunes' | 'martes' | 'miércoles' | 'jueves' | 'viernes' | 'sábado' | 'domingo';

export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  urgency: Urgency;
  status: TaskStatus;
  hasReminder: boolean;
  isRoutine?: boolean;
}

export interface Routine {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  daysOfWeek: DayOfWeek[];
  color: string;
  active: boolean;
}

export interface TimeBlock {
  startTime: string;
  endTime: string;
  type: 'task' | 'routine' | 'free';
  data?: Task | Routine;
}
