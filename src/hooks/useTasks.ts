import { useState, useEffect, useCallback } from 'react';
import { Task, Routine } from '../types/index.ts';
import { db } from '../services/database.ts';
import { timeHelper } from '../utils/timeHelper.ts';

/* ── Datos de ejemplo (se insertan solo si la cuenta está vacía) ── */

const makeSeedData = (today: string, tomorrow: string) => {
  const uid = () => crypto.randomUUID();

  const routines: Routine[] = [
    {
      id: uid(),
      name: 'Dormir',
      startTime: '23:00',
      endTime: '07:00',
      daysOfWeek: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
      color: 'var(--lavanda)',
      active: true,
      icon: 'moon',
      kind: 'fixed',
      frequency: { type: 'daily' },
    },
    {
      id: uid(),
      name: 'Tomar agua',
      startTime: '08:00',
      endTime: '22:00',
      daysOfWeek: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
      color: 'var(--azul)',
      active: true,
      icon: 'droplet',
      kind: 'reminder',
      frequency: { type: 'interval', everyMinutes: 180, from: '08:00', to: '22:00' },
    },
    {
      id: uid(),
      name: 'Clases',
      startTime: '10:00',
      endTime: '12:00',
      daysOfWeek: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'],
      color: 'var(--beige)',
      active: true,
      icon: 'book',
      kind: 'fixed',
      frequency: { type: 'weekly', days: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'] },
    },
    {
      id: uid(),
      name: 'Leer',
      startTime: '20:00',
      endTime: '20:30',
      daysOfWeek: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
      color: 'var(--verde)',
      active: true,
      icon: 'book',
      kind: 'flexible',
      duration: 30,
      frequency: { type: 'daily' },
    },
  ];

  const tasks: Task[] = [
    {
      id: uid(),
      title: 'Trabajo creativo',
      description: 'Diseño de presentación',
      date: today,
      startTime: '09:00',
      endTime: '11:00',
      urgency: 'media',
      status: 'pendiente',
      hasReminder: true,
    },
    {
      id: uid(),
      title: 'Proyecto urgente',
      description: 'Completar presentación del proyecto',
      date: today,
      startTime: '14:00',
      endTime: '16:00',
      urgency: 'alta',
      status: 'pendiente',
      hasReminder: true,
    },
    {
      id: uid(),
      title: 'Leer documentación',
      description: 'Revisar los documentos del curso',
      date: today,
      startTime: '18:30',
      endTime: '19:30',
      urgency: 'baja',
      status: 'pendiente',
      hasReminder: true,
    },
    {
      id: uid(),
      title: 'Entrega de proyecto',
      description: 'Entregar el informe final',
      date: tomorrow,
      startTime: '09:00',
      endTime: '11:00',
      urgency: 'urgente',
      status: 'pendiente',
      hasReminder: true,
    },
  ];

  return { tasks, routines };
};

/* ── Hook ────────────────────────────────────────────────────── */

export const useTasks = (userId?: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [dbLoading, setDbLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;
    setDbLoading(true);

    Promise.all([db.getTasks(), db.getRoutines()])
      .then(async ([loadedTasks, loadedRoutines]) => {
        if (cancelled) return;

        if (loadedTasks.length === 0 && loadedRoutines.length === 0) {
          const today = timeHelper.getDateString();
          const tomorrow = timeHelper.getDateString(new Date(Date.now() + 86_400_000));
          const { tasks: seedTasks, routines: seedRoutines } = makeSeedData(today, tomorrow);

          await Promise.all([
            ...seedTasks.map((t) => db.addTask(t)),
            ...seedRoutines.map((r) => db.addRoutine(r)),
          ]);

          if (!cancelled) {
            setTasks(seedTasks);
            setRoutines(seedRoutines);
          }
        } else {
          setTasks(loadedTasks);
          setRoutines(loadedRoutines);
        }
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setDbLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  /* Tasks CRUD — optimistic */

  const addTask = useCallback(async (task: Task) => {
    setTasks((prev) => [...prev, task]);
    try {
      await db.addTask(task);
    } catch (e) {
      console.error(e);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    }
  }, []);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    try {
      await db.updateTask(id, updates);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await db.deleteTask(id);
    } catch (e) {
      console.error(e);
    }
  }, []);

  /* Routines CRUD — optimistic */

  const addRoutine = useCallback(async (routine: Routine) => {
    setRoutines((prev) => [...prev, routine]);
    try {
      await db.addRoutine(routine);
    } catch (e) {
      console.error(e);
      setRoutines((prev) => prev.filter((r) => r.id !== routine.id));
    }
  }, []);

  const updateRoutine = useCallback(async (id: string, updates: Partial<Routine>) => {
    setRoutines((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    try {
      await db.updateRoutine(id, updates);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const deleteRoutine = useCallback(async (id: string) => {
    setRoutines((prev) => prev.filter((r) => r.id !== id));
    try {
      await db.deleteRoutine(id);
    } catch (e) {
      console.error(e);
    }
  }, []);

  return {
    tasks,
    routines,
    dbLoading,
    addTask,
    updateTask,
    deleteTask,
    addRoutine,
    updateRoutine,
    deleteRoutine,
  };
};
