import { Routine, Task } from '../types/index.ts';
import { WAKING, getOccupiedMinutes } from './agenda.ts';

/**
 * Ocupación de un día (0–100%) según las actividades que bloquean tiempo
 * (tareas + rutinas fija/flexible). Los recordatorios NO cuentan.
 */
export const getDayOccupancyPercent = (
  tasks: Task[],
  routines: Routine[],
  date: string,
): number => {
  const occupied = getOccupiedMinutes(tasks, routines, date);
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
