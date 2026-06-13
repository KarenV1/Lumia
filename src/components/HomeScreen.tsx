import { Task, Routine } from '../types/index.ts';
import { Theme } from '../hooks/useTheme.ts';
import { timeHelper } from '../utils/timeHelper.ts';
import { getFreeSummary } from '../utils/freeTime.ts';
import { Header } from './home/Header.tsx';
import { QuickTaskInput } from './home/QuickTaskInput.tsx';
import { TodayCard } from './TodayCard.tsx';
import { RoutinesCard } from './home/RoutinesCard.tsx';
import { UrgentCard } from './home/UrgentCard.tsx';
import { FreeTimeBar } from './home/FreeTimeBar.tsx';

interface HomeScreenProps {
  tasks: Task[];
  routines: Routine[];
  theme: Theme;
  onToggleTheme: () => void;
  onOpenCalendar: () => void;
  onAddTask: (task: Task) => void;
  onNewRoutine: () => void;
  onEditRoutine: (routine: Routine) => void;
  onToggleRoutine: (routine: Routine) => void;
}

/**
 * Pantalla principal de Aveli. Compone los bloques del Home sobre el fondo
 * fotográfico glass. El orden define la jerarquía y el ritmo vertical.
 */
export const HomeScreen = ({
  tasks,
  routines,
  theme,
  onToggleTheme,
  onOpenCalendar,
  onAddTask,
  onNewRoutine,
  onEditRoutine,
  onToggleRoutine,
}: HomeScreenProps) => {
  const today = timeHelper.getDateString();

  const tomorrow = timeHelper.getDateString(new Date(Date.now() + 24 * 60 * 60 * 1000));
  const urgentTask = tasks.find(
    (t) => t.date === tomorrow && (t.urgency === 'alta' || t.urgency === 'urgente'),
  );

  const freeSummary = getFreeSummary(tasks, routines, today);

  return (
    <div className="av-home">
      <Header
        name="Karen"
        weather={{ temp: 26, description: 'Parcialmente nublado' }}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      <QuickTaskInput onAdd={onAddTask} />

      <TodayCard tasks={tasks} routines={routines} date={today} onOpenCalendar={onOpenCalendar} />

      {urgentTask && <UrgentCard task={urgentTask} />}

      <FreeTimeBar summary={freeSummary} />

      <RoutinesCard
        routines={routines}
        onNew={onNewRoutine}
        onEdit={onEditRoutine}
        onToggle={onToggleRoutine}
      />
    </div>
  );
};
