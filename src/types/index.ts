export type Urgency = 'baja' | 'media' | 'alta' | 'urgente';
export type TaskStatus = 'pendiente' | 'en_progreso' | 'completada' | 'pospuesta';
export type DayOfWeek = 'lunes' | 'martes' | 'miércoles' | 'jueves' | 'viernes' | 'sábado' | 'domingo';

export interface Notification {
  notificationEnabled: boolean;
  notificationTime?: string;
  notificationMessage?: string;
}

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
  /** Notificaciones (estructura preparada para Notification API / Supabase) */
  notification?: Notification;
}

/**
 * Clasificación de rutinas:
 * - fixed: bloque que ocupa tiempo real (clase, dormir, trabajo).
 * - reminder: hábito breve que NO bloquea tiempo (agua, retenedores).
 * - flexible: tiene duración pero se acomoda en espacios libres (leer 20 min).
 */
export type RoutineKind = 'fixed' | 'reminder' | 'flexible';

export type RoutineFrequencyType = 'daily' | 'weekly' | 'interval' | 'once';

export interface RoutineFrequency {
  type: RoutineFrequencyType;
  /** weekly: días aplicables */
  days?: DayOfWeek[];
  /** interval: cada cuántos minutos (60, 180, 30, 20…) */
  everyMinutes?: number;
  /** interval: rango horario opcional, ej. "08:00"–"22:00" */
  from?: string;
  to?: string;
}

export interface Routine {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  daysOfWeek: DayOfWeek[];
  color: string;
  active: boolean;
  /** Nombre del icono outline (ver Icon) */
  icon?: string;
  /** Frecuencia de la rutina. Si falta, se deriva de daysOfWeek (compatibilidad). */
  frequency?: RoutineFrequency;
  /** Tipo de rutina. Si falta, se infiere (interval → reminder, resto → fixed). */
  kind?: RoutineKind;
  /** flexible: duración estimada en minutos */
  duration?: number;
  /** Etiqueta corta opcional (ej. "Ret") */
  label?: string;
  /** Descripción opcional */
  description?: string;
  /** Notificaciones (preparado para futuro) */
  notification?: Notification;
}

export interface TimeBlock {
  startTime: string;
  endTime: string;
  type: 'task' | 'routine' | 'free';
  data?: Task | Routine;
}
