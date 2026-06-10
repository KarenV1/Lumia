import { Task, Routine } from '../types/index.ts';

const TASKS_KEY = 'agenda_tasks';
const ROUTINES_KEY = 'agenda_routines';

export const storage = {
  getTasks: (): Task[] => {
    const stored = localStorage.getItem(TASKS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveTasks: (tasks: Task[]): void => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  },

  getRoutines: (): Routine[] => {
    const stored = localStorage.getItem(ROUTINES_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveRoutines: (routines: Routine[]): void => {
    localStorage.setItem(ROUTINES_KEY, JSON.stringify(routines));
  },

  clear: (): void => {
    localStorage.removeItem(TASKS_KEY);
    localStorage.removeItem(ROUTINES_KEY);
  },
};
