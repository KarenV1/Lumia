import { useState, useEffect } from 'react';
import { Task, Routine } from '../types/index.ts';
import { storage } from '../utils/storage.ts';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);

  useEffect(() => {
    setTasks(storage.getTasks());
    setRoutines(storage.getRoutines());
  }, []);

  const addTask = (task: Task) => {
    const newTasks = [...tasks, task];
    setTasks(newTasks);
    storage.saveTasks(newTasks);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const newTasks = tasks.map(t => (t.id === id ? { ...t, ...updates } : t));
    setTasks(newTasks);
    storage.saveTasks(newTasks);
  };

  const deleteTask = (id: string) => {
    const newTasks = tasks.filter(t => t.id !== id);
    setTasks(newTasks);
    storage.saveTasks(newTasks);
  };

  const addRoutine = (routine: Routine) => {
    const newRoutines = [...routines, routine];
    setRoutines(newRoutines);
    storage.saveRoutines(newRoutines);
  };

  const updateRoutine = (id: string, updates: Partial<Routine>) => {
    const newRoutines = routines.map(r => (r.id === id ? { ...r, ...updates } : r));
    setRoutines(newRoutines);
    storage.saveRoutines(newRoutines);
  };

  const deleteRoutine = (id: string) => {
    const newRoutines = routines.filter(r => r.id !== id);
    setRoutines(newRoutines);
    storage.saveRoutines(newRoutines);
  };

  return {
    tasks,
    routines,
    addTask,
    updateTask,
    deleteTask,
    addRoutine,
    updateRoutine,
    deleteRoutine,
  };
};
