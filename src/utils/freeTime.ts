import { Task, Routine } from '../types/index.ts';
import { timeHelper } from './timeHelper.ts';

const DAY_START = 7 * 60; // 07:00
const DAY_END = 23 * 60; // 23:00
const WAKING_MINUTES = DAY_END - DAY_START;

export interface FreeSummary {
  /** Minutos libres totales dentro de la franja despierta */
  freeMinutes: number;
  /** Porcentaje 0–100 del día despierto que está libre */
  percent: number;
  /** Rango del bloque libre más grande, ej. "12:30 – 14:00" (o null) */
  largestRange: string | null;
}

/**
 * Resume el tiempo libre del día dentro de la franja 07:00–23:00.
 * Aveli existe para ayudar a visualizar cuánto tiempo libre hay.
 */
export const getFreeSummary = (tasks: Task[], routines: Routine[], date: string): FreeSummary => {
  const blocks = timeHelper
    .calculateFreeBlocks(tasks, routines, date)
    .filter((b) => b.type === 'free');

  let freeMinutes = 0;
  let largest = { minutes: 0, start: '', end: '' };

  for (const b of blocks) {
    const start = Math.max(DAY_START, timeHelper.timeToMinutes(b.startTime));
    const end = Math.min(DAY_END, timeHelper.timeToMinutes(b.endTime));
    const dur = end - start;
    if (dur <= 0) continue;
    freeMinutes += dur;
    if (dur > largest.minutes) {
      largest = {
        minutes: dur,
        start: timeHelper.minutesToTime(start),
        end: timeHelper.minutesToTime(end),
      };
    }
  }

  const percent = Math.max(0, Math.min(100, Math.round((freeMinutes / WAKING_MINUTES) * 100)));
  const largestRange = largest.minutes > 0 ? `${largest.start} – ${largest.end}` : null;

  return { freeMinutes, percent, largestRange };
};

/** Convierte minutos a un texto humano, ej. "5 h 30 min libres" */
export const formatFreeDuration = (minutes: number): string => {
  if (minutes <= 0) return 'Sin tiempo libre';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const parts: string[] = [];
  if (h > 0) parts.push(`${h} h`);
  if (m > 0) parts.push(`${m} min`);
  return `${parts.join(' ')} libres`;
};
