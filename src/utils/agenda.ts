import { Routine, Task } from '../types/index.ts';
import { timeHelper } from './timeHelper.ts';
import { ALL_DAYS, getFrequency, getRoutineKind, occupiesTime, routineAppliesOn } from './routine.ts';

export const DAY_START = 7 * 60; // 07:00
export const DAY_END = 23 * 60; // 23:00
export const WAKING = DAY_END - DAY_START; // 960

export interface AgendaBlock {
  id: string;
  name: string;
  start: number; // minutos
  end: number;
  startLabel: string;
  endLabel: string;
  color: string;
  icon: string;
  source: 'task' | 'routine';
  kind: 'fixed' | 'flexible';
  description?: string;
}

export interface ReminderMark {
  id: string;
  name: string;
  icon: string;
  color: string;
  label?: string;
  times: string[]; // "HH:MM" de cada ocurrencia
}

export interface FreeBlock {
  start: number;
  end: number;
  startLabel: string;
  endLabel: string;
  minutes: number;
}

const clip = (n: number) => Math.max(DAY_START, Math.min(DAY_END, n));

/** Bloques que ocupan tiempo real ese día: tareas + rutinas fija/flexible. */
export const getOccupyingBlocks = (
  tasks: Task[],
  routines: Routine[],
  date: string,
): AgendaBlock[] => {
  const dayOfWeek = timeHelper.getDayOfWeek(date);
  const blocks: AgendaBlock[] = [];

  for (const t of tasks) {
    if (t.date !== date || t.status === 'completada') continue;
    blocks.push({
      id: t.id,
      name: t.title,
      start: timeHelper.timeToMinutes(t.startTime),
      end: timeHelper.timeToMinutes(t.endTime),
      startLabel: t.startTime,
      endLabel: t.endTime,
      color: 'var(--rosa)',
      icon: 'sparkle',
      source: 'task',
      kind: 'fixed',
      description: t.description,
    });
  }

  for (const r of routines) {
    if (!r.active || !occupiesTime(r) || !routineAppliesOn(r, dayOfWeek)) continue;
    let start = timeHelper.timeToMinutes(r.startTime);
    let end =
      getRoutineKind(r) === 'flexible'
        ? start + (r.duration ?? 30)
        : timeHelper.timeToMinutes(r.endTime);
    if (end < start) end = DAY_END; // cruza medianoche (ej. dormir) → recorta a la noche
    blocks.push({
      id: r.id,
      name: r.name,
      start,
      end,
      startLabel: timeHelper.minutesToTime(start),
      endLabel: timeHelper.minutesToTime(Math.min(end, 24 * 60 - 1)),
      color: r.color,
      icon: (r.icon as string) || 'clock',
      source: 'routine',
      kind: getRoutineKind(r) === 'flexible' ? 'flexible' : 'fixed',
      description: r.description,
    });
  }

  return blocks.sort((a, b) => a.start - b.start);
};

/** Recordatorios del día (no bloquean): cada uno con sus horas de ocurrencia. */
export const getReminders = (routines: Routine[], date: string): ReminderMark[] => {
  const dayOfWeek = timeHelper.getDayOfWeek(date);
  const marks: ReminderMark[] = [];

  for (const r of routines) {
    if (!r.active || getRoutineKind(r) !== 'reminder' || !routineAppliesOn(r, dayOfWeek)) continue;
    const f = getFrequency(r);
    let times: string[] = [];
    if (f.type === 'interval') {
      const every = f.everyMinutes ?? 180;
      const from = timeHelper.timeToMinutes(f.from ?? '08:00');
      const to = timeHelper.timeToMinutes(f.to ?? '22:00');
      for (let m = from; m <= to; m += every) times.push(timeHelper.minutesToTime(m));
    } else {
      times = [r.startTime];
    }
    marks.push({
      id: r.id,
      name: r.name,
      icon: (r.icon as string) || 'bell',
      color: r.color,
      label: r.label,
      times,
    });
  }

  return marks;
};

/** Une intervalos solapados. */
const mergeIntervals = (intervals: { start: number; end: number }[]) => {
  const sorted = [...intervals].sort((a, b) => a.start - b.start);
  const merged: { start: number; end: number }[] = [];
  for (const it of sorted) {
    const s = clip(it.start);
    const e = clip(it.end);
    if (e <= s) continue;
    const last = merged[merged.length - 1];
    if (last && s <= last.end) last.end = Math.max(last.end, e);
    else merged.push({ start: s, end: e });
  }
  return merged;
};

/** Espacios libres del día (franja despierta), excluyendo recordatorios. */
export const getFreeBlocks = (tasks: Task[], routines: Routine[], date: string): FreeBlock[] => {
  const blocks = getOccupyingBlocks(tasks, routines, date);
  const merged = mergeIntervals(blocks);
  const free: FreeBlock[] = [];
  let cursor = DAY_START;
  for (const b of merged) {
    if (b.start > cursor) {
      free.push({
        start: cursor,
        end: b.start,
        startLabel: timeHelper.minutesToTime(cursor),
        endLabel: timeHelper.minutesToTime(b.start),
        minutes: b.start - cursor,
      });
    }
    cursor = Math.max(cursor, b.end);
  }
  if (cursor < DAY_END) {
    free.push({
      start: cursor,
      end: DAY_END,
      startLabel: timeHelper.minutesToTime(cursor),
      endLabel: timeHelper.minutesToTime(DAY_END),
      minutes: DAY_END - cursor,
    });
  }
  return free;
};

/** Minutos ocupados (solo lo que bloquea tiempo). */
export const getOccupiedMinutes = (tasks: Task[], routines: Routine[], date: string): number =>
  mergeIntervals(getOccupyingBlocks(tasks, routines, date)).reduce((sum, b) => sum + (b.end - b.start), 0);

export interface Conflict {
  name: string;
  startLabel: string;
  endLabel: string;
}

/**
 * Detecta traslape de un rango contra los bloques BLOQUEANTES del día.
 * `excludeId` evita chocar consigo mismo al editar.
 */
export const findConflict = (
  tasks: Task[],
  routines: Routine[],
  date: string,
  start: number,
  end: number,
  excludeId?: string,
): Conflict | null => {
  if (end <= start) return null;
  const blocks = getOccupyingBlocks(tasks, routines, date).filter(
    (b) => b.kind === 'fixed' && b.id !== excludeId,
  );
  for (const b of blocks) {
    if (start < b.end && end > b.start) {
      return { name: b.name, startLabel: b.startLabel, endLabel: b.endLabel };
    }
  }
  return null;
};

/**
 * Conflicto de una rutina fija contra otras rutinas fijas que comparten día.
 * Ignora bloques que cruzan medianoche (ej. dormir) para evitar falsos positivos.
 */
export const findRoutineConflict = (routines: Routine[], draft: Routine): Conflict | null => {
  if (getRoutineKind(draft) !== 'fixed') return null;
  const start = timeHelper.timeToMinutes(draft.startTime);
  const end = timeHelper.timeToMinutes(draft.endTime);
  if (end <= start) return null; // nocturno o inválido → no validamos

  const days = ALL_DAYS.filter((d) => routineAppliesOn(draft, d));
  for (const r of routines) {
    if (r.id === draft.id || !r.active || getRoutineKind(r) !== 'fixed') continue;
    const rs = timeHelper.timeToMinutes(r.startTime);
    const re = timeHelper.timeToMinutes(r.endTime);
    if (re <= rs) continue; // nocturno
    const sharesDay = days.some((d) => routineAppliesOn(r, d));
    if (sharesDay && start < re && end > rs) {
      return { name: r.name, startLabel: r.startTime, endLabel: r.endTime };
    }
  }
  return null;
};

/** Lista de bloques fijos del día, para mostrar "ocupado por…". */
export const getFixedBlocksForDay = (
  tasks: Task[],
  routines: Routine[],
  date: string,
): AgendaBlock[] => getOccupyingBlocks(tasks, routines, date).filter((b) => b.kind === 'fixed');

/** Siguiente espacio libre que admita `durationMin`, a partir de `fromMin`. */
export const nextFreeSlot = (
  tasks: Task[],
  routines: Routine[],
  date: string,
  durationMin: number,
  fromMin = DAY_START,
): FreeBlock | null => {
  const free = getFreeBlocks(tasks, routines, date);
  for (const b of free) {
    const start = Math.max(b.start, fromMin);
    if (b.end - start >= durationMin) {
      return {
        start,
        end: start + durationMin,
        startLabel: timeHelper.minutesToTime(start),
        endLabel: timeHelper.minutesToTime(start + durationMin),
        minutes: durationMin,
      };
    }
  }
  return null;
};
