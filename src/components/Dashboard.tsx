import { useState } from 'react';
import { Task, Routine } from '../types/index.ts';
import { Theme } from '../hooks/useTheme.ts';
import { timeHelper } from '../utils/timeHelper.ts';
import { backgroundHelper } from '../utils/backgroundHelper.ts';
import { createEmptyRoutine } from '../utils/routine.ts';
import { HomeScreen } from './HomeScreen.tsx';
import { CalendarOverlay } from './CalendarOverlay.tsx';
import { RoutineEditor } from './routines/RoutineEditor.tsx';

interface DashboardProps {
  tasks: Task[];
  routines: Routine[];
  theme: Theme;
  onToggleTheme: () => void;
  onAddTask: (task: Task) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onAddRoutine: (routine: Routine) => void;
  onUpdateRoutine: (id: string, updates: Partial<Routine>) => void;
  onDeleteRoutine: (id: string) => void;
}

export const Dashboard = ({
  tasks,
  routines,
  theme,
  onToggleTheme,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onAddRoutine,
  onUpdateRoutine,
  onDeleteRoutine,
}: DashboardProps) => {
  // El calendario se abre directamente (sin cápsula intermedia)
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Editor de rutinas
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [isNewRoutine, setIsNewRoutine] = useState(false);

  const selectedDate = timeHelper.getDateString();
  const dayOfWeek = timeHelper.getDayOfWeek(selectedDate);
  const bgImage = backgroundHelper.getDayBackground(dayOfWeek);

  const handleNewRoutine = () => {
    setEditingRoutine(createEmptyRoutine());
    setIsNewRoutine(true);
  };

  const handleEditRoutine = (routine: Routine) => {
    setEditingRoutine(routine);
    setIsNewRoutine(false);
  };

  const handleToggleRoutine = (routine: Routine) => {
    onUpdateRoutine(routine.id, { active: !routine.active });
  };

  const handleSaveRoutine = (routine: Routine) => {
    if (isNewRoutine) onAddRoutine(routine);
    else onUpdateRoutine(routine.id, routine);
    setEditingRoutine(null);
  };

  const handleDeleteRoutine = (id: string) => {
    onDeleteRoutine(id);
    setEditingRoutine(null);
  };

  return (
    <div className="bg-container">
      <div className="bg-base" style={{ backgroundImage: `url(${bgImage})` }}></div>
      <div className="bg-overlay"></div>
      <div className="content-wrapper">
        <HomeScreen
          tasks={tasks}
          routines={routines}
          theme={theme}
          onToggleTheme={onToggleTheme}
          onOpenCalendar={() => setCalendarOpen(true)}
          onAddTask={onAddTask}
          onNewRoutine={handleNewRoutine}
          onEditRoutine={handleEditRoutine}
          onToggleRoutine={handleToggleRoutine}
        />

        <CalendarOverlay
          isOpen={calendarOpen}
          tasks={tasks}
          routines={routines}
          onClose={() => setCalendarOpen(false)}
        />

        <RoutineEditor
          routine={editingRoutine}
          isNew={isNewRoutine}
          onClose={() => setEditingRoutine(null)}
          onSave={handleSaveRoutine}
          onDelete={handleDeleteRoutine}
        />
      </div>
    </div>
  );
};
