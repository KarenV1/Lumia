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
  onEditRoutines?: () => void;
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
  onEditRoutines,
}: HomeScreenProps) => {
  const today = timeHelper.getDateString();
  const dayOfWeek = timeHelper.getDayOfWeek(today);

  const todayTasks = tasks
    .filter((t) => t.date === today && t.status !== 'completada')
    .sort((a, b) => timeHelper.timeToMinutes(a.startTime) - timeHelper.timeToMinutes(b.startTime));
  const todayRoutines = routines.filter((r) => r.active && r.daysOfWeek.includes(dayOfWeek));

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

      <TodayCard tasks={todayTasks} onOpenCalendar={onOpenCalendar} />

      {urgentTask && <UrgentCard task={urgentTask} />}

      <FreeTimeBar summary={freeSummary} />

      {todayRoutines.length > 0 && (
        <RoutinesCard routines={todayRoutines} onEdit={onEditRoutines} />
      )}
    </div>
  );
};
