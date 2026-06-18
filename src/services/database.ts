/**
 * Capa de acceso a datos de Lumia.
 *
 * Cuando Supabase está configurado (VITE_SUPABASE_URL + ANON_KEY), usa la base de
 * datos remota con Row Level Security — cada usuario solo ve sus propios datos.
 * Sin esas variables, cae de vuelta a localStorage para que la app siga
 * funcionando en desarrollo sin conexión.
 */

import { Task, Routine } from '../types/index.ts';
import { supabase, hasSupabase } from '../lib/supabase.ts';
import { storage } from '../utils/storage.ts';

/* ── Converters (snake_case DB ↔ camelCase TS) ───────────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rowToTask = (r: any): Task => ({
  id: r.id,
  title: r.title,
  description: r.description ?? undefined,
  date: r.date,
  startTime: r.start_time,
  endTime: r.end_time,
  urgency: r.urgency,
  status: r.status,
  hasReminder: r.has_reminder,
  isRoutine: r.is_routine ?? undefined,
  notification: r.notification ?? undefined,
});

const taskToRow = (t: Task) => ({
  id: t.id,
  title: t.title,
  description: t.description ?? null,
  date: t.date,
  start_time: t.startTime,
  end_time: t.endTime,
  urgency: t.urgency,
  status: t.status,
  has_reminder: t.hasReminder,
  is_routine: t.isRoutine ?? false,
  notification: t.notification ?? null,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rowToRoutine = (r: any): Routine => ({
  id: r.id,
  name: r.name,
  startTime: r.start_time,
  endTime: r.end_time,
  daysOfWeek: r.days_of_week,
  color: r.color,
  active: r.active,
  icon: r.icon ?? undefined,
  kind: r.kind ?? undefined,
  frequency: r.frequency ?? undefined,
  duration: r.duration ?? undefined,
  label: r.label ?? undefined,
  description: r.description ?? undefined,
  notification: r.notification ?? undefined,
});

const routineToRow = (r: Routine) => ({
  id: r.id,
  name: r.name,
  start_time: r.startTime,
  end_time: r.endTime,
  days_of_week: r.daysOfWeek,
  color: r.color,
  active: r.active,
  icon: r.icon ?? null,
  kind: r.kind ?? 'fixed',
  frequency: r.frequency ?? null,
  duration: r.duration ?? null,
  label: r.label ?? null,
  description: r.description ?? null,
  notification: r.notification ?? null,
});

/* ── Patch builder for partial updates ───────────────────────── */

const taskPatch = (u: Partial<Task>) => {
  const p: Record<string, unknown> = {};
  if ('title' in u)        p.title = u.title;
  if ('description' in u)  p.description = u.description;
  if ('date' in u)         p.date = u.date;
  if ('startTime' in u)    p.start_time = u.startTime;
  if ('endTime' in u)      p.end_time = u.endTime;
  if ('urgency' in u)      p.urgency = u.urgency;
  if ('status' in u)       p.status = u.status;
  if ('hasReminder' in u)  p.has_reminder = u.hasReminder;
  if ('isRoutine' in u)    p.is_routine = u.isRoutine;
  if ('notification' in u) p.notification = u.notification;
  return p;
};

const routinePatch = (u: Partial<Routine>) => {
  const p: Record<string, unknown> = {};
  if ('name' in u)         p.name = u.name;
  if ('startTime' in u)    p.start_time = u.startTime;
  if ('endTime' in u)      p.end_time = u.endTime;
  if ('daysOfWeek' in u)   p.days_of_week = u.daysOfWeek;
  if ('color' in u)        p.color = u.color;
  if ('active' in u)       p.active = u.active;
  if ('icon' in u)         p.icon = u.icon;
  if ('kind' in u)         p.kind = u.kind;
  if ('frequency' in u)    p.frequency = u.frequency;
  if ('duration' in u)     p.duration = u.duration;
  if ('label' in u)        p.label = u.label;
  if ('description' in u)  p.description = u.description;
  if ('notification' in u) p.notification = u.notification;
  return p;
};

/* ── DB interface ────────────────────────────────────────────── */

export const db = {
  /* Tasks */

  async getTasks(): Promise<Task[]> {
    if (!hasSupabase) return storage.getTasks();
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('start_time', { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map(rowToTask);
  },

  async addTask(task: Task): Promise<void> {
    if (!hasSupabase) {
      storage.saveTasks([...storage.getTasks(), task]);
      return;
    }
    const { error } = await supabase.from('tasks').insert(taskToRow(task));
    if (error) throw new Error(error.message);
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    if (!hasSupabase) {
      storage.saveTasks(storage.getTasks().map((t) => (t.id === id ? { ...t, ...updates } : t)));
      return;
    }
    const patch = taskPatch(updates);
    if (!Object.keys(patch).length) return;
    const { error } = await supabase.from('tasks').update(patch).eq('id', id);
    if (error) throw new Error(error.message);
  },

  async deleteTask(id: string): Promise<void> {
    if (!hasSupabase) {
      storage.saveTasks(storage.getTasks().filter((t) => t.id !== id));
      return;
    }
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  /* Routines */

  async getRoutines(): Promise<Routine[]> {
    if (!hasSupabase) return storage.getRoutines();
    const { data, error } = await supabase
      .from('routines')
      .select('*')
      .order('start_time', { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map(rowToRoutine);
  },

  async addRoutine(routine: Routine): Promise<void> {
    if (!hasSupabase) {
      storage.saveRoutines([...storage.getRoutines(), routine]);
      return;
    }
    const { error } = await supabase.from('routines').insert(routineToRow(routine));
    if (error) throw new Error(error.message);
  },

  async updateRoutine(id: string, updates: Partial<Routine>): Promise<void> {
    if (!hasSupabase) {
      storage.saveRoutines(storage.getRoutines().map((r) => (r.id === id ? { ...r, ...updates } : r)));
      return;
    }
    const patch = routinePatch(updates);
    if (!Object.keys(patch).length) return;
    const { error } = await supabase.from('routines').update(patch).eq('id', id);
    if (error) throw new Error(error.message);
  },

  async deleteRoutine(id: string): Promise<void> {
    if (!hasSupabase) {
      storage.saveRoutines(storage.getRoutines().filter((r) => r.id !== id));
      return;
    }
    const { error } = await supabase.from('routines').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },
};
