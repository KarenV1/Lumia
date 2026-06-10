import { useState } from 'react';
import { Task, Routine } from '../types/index.ts';
import { Theme } from '../hooks/useTheme.ts';
import { timeHelper } from '../utils/timeHelper.ts';
import { backgroundHelper } from '../utils/backgroundHelper.ts';
import { HomeScreen } from './HomeScreen.tsx';
import { CalendarOverlay } from './CalendarOverlay.tsx';

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

type CalendarState = 'closed' | 'capsule' | 'expanded';

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
  const [calendarState, setCalendarState] = useState<CalendarState>('closed');

  const selectedDate = timeHelper.getDateString();
  const dayOfWeek = timeHelper.getDayOfWeek(selectedDate);
  const bgImage = backgroundHelper.getDayBackground(dayOfWeek);

  const handleOpenCalendar = () => {
    setCalendarState('capsule');
  };

  const handleExpandCalendar = () => {
    setCalendarState('expanded');
  };

  const handleCloseCalendar = () => {
    if (calendarState === 'capsule') {
      setCalendarState('closed');
    } else if (calendarState === 'expanded') {
      setCalendarState('capsule');
    }
  };

  return (
    <div className="bg-container">
      <div
        className="bg-base"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>
      <div className="bg-overlay"></div>
      <div className="content-wrapper">
        <HomeScreen
          tasks={tasks}
          routines={routines}
          theme={theme}
          onToggleTheme={onToggleTheme}
          onOpenCalendar={handleOpenCalendar}
        />

        <CalendarOverlay
          isOpen={calendarState !== 'closed'}
          state={calendarState as 'capsule' | 'expanded'}
          tasks={tasks}
          routines={routines}
          onClose={handleCloseCalendar}
          onExpand={handleExpandCalendar}
        />
      </div>
    </div>
  );
};
