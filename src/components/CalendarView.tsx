import { Task } from '../types/index.ts';
import { timeHelper } from '../utils/timeHelper.ts';

interface CalendarViewProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  tasks: Task[];
}

export const CalendarView = ({ selectedDate, onSelectDate, tasks }: CalendarViewProps) => {
  const date = new Date(selectedDate + 'T00:00:00');
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = new Array(startingDayOfWeek).fill(null);

  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  const getTasksForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(t => t.date === dateStr && t.status !== 'completada');
  };

  const hasUrgentForDay = (day: number) => {
    const tasksForDay = getTasksForDay(day);
    return tasksForDay.some(t => t.urgency === 'alta' || t.urgency === 'urgente');
  };

  const monthName = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(
    new Date(year, month),
  );

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 capitalize">{monthName}</h2>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center font-semibold text-gray-600 text-sm py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="space-y-1">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7 gap-1">
            {week.map((day, dayIdx) => {
              if (!day) {
                return <div key={dayIdx} className="aspect-square bg-gray-50 rounded" />;
              }

              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isSelected = selectedDate === dateStr;
              const dayTasks = getTasksForDay(day);
              const isUrgent = hasUrgentForDay(day);

              return (
                <button
                  key={dayIdx}
                  onClick={() => onSelectDate(dateStr)}
                  className={`aspect-square p-1 rounded border-2 text-sm font-medium transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? 'bg-blue-500 text-white border-blue-600'
                      : isUrgent
                        ? 'bg-red-50 border-red-300 text-gray-800'
                        : 'bg-white border-gray-200 text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <span>{day}</span>
                  {dayTasks.length > 0 && <span className="text-xs">{dayTasks.length}📋</span>}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
