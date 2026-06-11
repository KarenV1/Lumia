import { Routine, Task } from '../types/index.ts';
import { timeHelper } from './timeHelper.ts';
import { getFrequency, routineAppliesOn, routineOccupiedMinutes } from './routine.ts';

const DAY_START = 7 * 60; // 07:00
const DAY_END = 23 * 60; // 23:00
const WAKING = DAY_END - DAY_START; // 960 min

/** Minutos de un bloque dentro de la franja despierta (ignora la noche). */
const clipBlock = (start: number, end: number): number => {
  let s = start;
  let e = end;
  if (e < s) e = DAY_END; // cruza medianoche → cuenta solo la parte diurna
  s = Math.max(DAY_START, s);
  e = Math.min(DAY_END, e);
  return Math.max(0, e - s);
};

/**
 * Ocupación de un día (0–100%) dentro de la franja despierta, según tareas y
 * rutinas aplicables. Sirve para el degradado de saturación de la agenda.
 */
export const getDayOccupancyPercent = (
  tasks: Task[],
  routines: Routine[],
  date: string,
): number => {
  const dayOfWeek = timeHelper.getDayOfWeek(date);
  let occupied = 0;

  for (const t of tasks) {
    if (t.date !== date || t.status === 'completada') continue;
    occupied += clipBlock(timeHelper.timeToMinutes(t.startTime), timeHelper.timeToMinutes(t.endTime));
  }

  for (const r of routines) {
    if (!r.active || !routineAppliesOn(r, dayOfWeek)) continue;
    if (getFrequency(r).type === 'interval') {
      occupied += routineOccupiedMinutes(r); // recordatorios breves
    } else {
      occupied += clipBlock(timeHelper.timeToMinutes(r.startTime), timeHelper.timeToMinutes(r.endTime));
    }
  }

  return Math.max(0, Math.min(100, Math.round((occupied / WAKING) * 100)));
};

/**
 * Color rosa de saturación según el porcentaje de ocupación.
 * Escala suave Lumia (nunca rojo ni colores agresivos).
 */
export const occupancyColor = (percent: number): string => {
  if (percent <= 0) return 'transparent';
  if (percent <= 25) return 'rgba(245, 213, 203, 0.12)';
  if (percent <= 50) return 'rgba(245, 213, 203, 0.24)';
  if (percent <= 75) return 'rgba(245, 213, 203, 0.42)';
  return 'rgba(245, 213, 203, 0.62)';
};
