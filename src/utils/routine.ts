import { DayOfWeek, Routine, RoutineFrequency, RoutineKind } from '../types/index.ts';
import { timeHelper } from './timeHelper.ts';

export const ALL_DAYS: DayOfWeek[] = [
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado',
  'domingo',
];

const DAY_SHORT: Record<DayOfWeek, string> = {
  lunes: 'Lun',
  martes: 'Mar',
  miércoles: 'Mié',
  jueves: 'Jue',
  viernes: 'Vie',
  sábado: 'Sáb',
  domingo: 'Dom',
};

/** Frecuencia efectiva: usa `frequency` o la deriva de `daysOfWeek` (compat). */
export const getFrequency = (routine: Routine): RoutineFrequency => {
  if (routine.frequency) return routine.frequency;
  const days = routine.daysOfWeek ?? [];
  if (days.length >= 7) return { type: 'daily' };
  return { type: 'weekly', days };
};

/** ¿La rutina aplica en un día de la semana dado? */
export const routineAppliesOn = (routine: Routine, day: DayOfWeek): boolean => {
  const f = getFrequency(routine);
  switch (f.type) {
    case 'weekly':
      return (f.days ?? []).includes(day);
    case 'daily':
    case 'interval':
    case 'once':
    default:
      return true;
  }
};

/** Tipo efectivo de la rutina (infiere si falta: interval → reminder). */
export const getRoutineKind = (routine: Routine): RoutineKind => {
  if (routine.kind) return routine.kind;
  return getFrequency(routine).type === 'interval' ? 'reminder' : 'fixed';
};

/** ¿Es un bloque que choca con otros? Solo las rutinas fijas bloquean. */
export const isBlocking = (routine: Routine): boolean => getRoutineKind(routine) === 'fixed';

/** ¿Consume tiempo real del día? (fija o flexible; los recordatorios no). */
export const occupiesTime = (routine: Routine): boolean => {
  const k = getRoutineKind(routine);
  return k === 'fixed' || k === 'flexible';
};

export const KIND_LABEL: Record<RoutineKind, string> = {
  fixed: 'Fija',
  reminder: 'Recordatorio',
  flexible: 'Flexible',
};

/** Texto de horario legible para mostrar en la tarjeta. */
export const routineScheduleText = (routine: Routine): string => {
  const f = getFrequency(routine);
  if (getRoutineKind(routine) === 'flexible') {
    const dur = routine.duration ?? 30;
    const durText = dur % 60 === 0 ? `${dur / 60} h` : `${dur} min`;
    return `Flexible · ${durText}`;
  }
  if (f.type === 'interval') {
    const every = f.everyMinutes ?? 60;
    const label =
      every % 60 === 0 ? `Cada ${every / 60} h` : `Cada ${every} min`;
    if (f.from && f.to) return `${label} · ${f.from}–${f.to}`;
    return label;
  }
  if (f.type === 'weekly') {
    const days = (f.days ?? []).map((d) => DAY_SHORT[d]).join(', ');
    return `${days || 'Sin días'} · ${routine.startTime}`;
  }
  if (f.type === 'once') {
    return `Una vez al día · ${routine.startTime}`;
  }
  // daily
  return `${routine.startTime} – ${routine.endTime}`;
};

/** Minutos ocupados aproximados de la rutina en un día (para saturación). */
export const routineOccupiedMinutes = (routine: Routine): number => {
  const f = getFrequency(routine);
  if (f.type === 'interval') {
    const every = f.everyMinutes ?? 60;
    const from = timeHelper.timeToMinutes(f.from ?? '08:00');
    const to = timeHelper.timeToMinutes(f.to ?? '22:00');
    const span = Math.max(0, to - from);
    const occurrences = Math.floor(span / every) + 1;
    return occurrences * 10; // ~10 min nominales por recordatorio
  }
  let start = timeHelper.timeToMinutes(routine.startTime);
  let end = timeHelper.timeToMinutes(routine.endTime);
  if (end < start) end += 24 * 60; // cruza medianoche (ej. dormir)
  return Math.max(0, end - start);
};

/** Crea una rutina nueva con valores por defecto suaves. */
export const createEmptyRoutine = (): Routine => ({
  id: Date.now().toString(),
  name: '',
  startTime: '08:00',
  endTime: '09:00',
  daysOfWeek: [...ALL_DAYS],
  color: 'var(--lavanda)',
  active: true,
  icon: 'star',
  frequency: { type: 'daily' },
  kind: 'fixed',
  duration: 30,
  description: '',
  notification: { notificationEnabled: false },
});

/** Mantiene daysOfWeek sincronizado con la frecuencia (para la lógica existente). */
export const syncDaysFromFrequency = (routine: Routine): Routine => {
  const f = getFrequency(routine);
  const daysOfWeek = f.type === 'weekly' ? f.days ?? [] : [...ALL_DAYS];
  return { ...routine, daysOfWeek };
};
