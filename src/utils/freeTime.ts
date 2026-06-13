import { Task, Routine } from '../types/index.ts';
import { WAKING, getFreeBlocks, getOccupiedMinutes } from './agenda.ts';

export interface FreeSummary {
  /** Minutos libres totales dentro de la franja despierta */
  freeMinutes: number;
  /** Porcentaje 0–100 del día despierto que está libre */
  percent: number;
  /** Rango del bloque libre más grande, ej. "12:30 – 14:00" (o null) */
  largestRange: string | null;
}

/**
 * Resume el tiempo libre real del día. Los recordatorios (agua, etc.) NO
 * reducen el tiempo libre; solo lo hacen las actividades que ocupan tiempo.
 */
export const getFreeSummary = (tasks: Task[], routines: Routine[], date: string): FreeSummary => {
  const free = getFreeBlocks(tasks, routines, date);
  const freeMinutes = WAKING - getOccupiedMinutes(tasks, routines, date);

  let largest = free[0];
  for (const b of free) if (b.minutes > (largest?.minutes ?? 0)) largest = b;

  const percent = Math.max(0, Math.min(100, Math.round((freeMinutes / WAKING) * 100)));
  const largestRange = largest ? `${largest.startLabel} – ${largest.endLabel}` : null;

  return { freeMinutes: Math.max(0, freeMinutes), percent, largestRange };
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
