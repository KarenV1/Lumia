import { Task, Routine } from '../types/index.ts';
import { timeHelper } from '../utils/timeHelper.ts';

interface AgendaViewProps {
  date: string;
  tasks: Task[];
  routines: Routine[];
  onTaskStatusChange: (taskId: string, status: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const AgendaView = ({
  date,
  tasks,
  routines,
  onTaskStatusChange,
  onDeleteTask,
}: AgendaViewProps) => {
  const dayOfWeek = timeHelper.getDayOfWeek(date);
  const dayTasks = tasks.filter(t => t.date === date);
  const dayRoutines = routines.filter(r => r.active && r.daysOfWeek.includes(dayOfWeek));
  const freeBlocks = timeHelper.calculateFreeBlocks(tasks, routines, date);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getItemsInHour = (hour: number) => {
    const hourStart = `${String(hour).padStart(2, '0')}:00`;
    const hourEnd = `${String(hour + 1).padStart(2, '0')}:00`;
    const hourMinStart = timeHelper.timeToMinutes(hourStart);
    const hourMinEnd = timeHelper.timeToMinutes(hourEnd);

    const itemsInHour = [
      ...dayTasks
        .filter(
          t =>
            timeHelper.timeToMinutes(t.startTime) < hourMinEnd &&
            timeHelper.timeToMinutes(t.endTime) > hourMinStart,
        )
        .map(t => ({ ...t, type: 'task' as const })),
      ...dayRoutines
        .filter(
          r =>
            timeHelper.timeToMinutes(r.startTime) < hourMinEnd &&
            timeHelper.timeToMinutes(r.endTime) > hourMinStart,
        )
        .map(r => ({ ...r, type: 'routine' as const })),
    ];

    return itemsInHour;
  };

  const hasTasksOrRoutines = (hour: number) => getItemsInHour(hour).length > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{timeHelper.formatDate(date)}</h2>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {hours.map(hour => {
          const hourStr = `${String(hour).padStart(2, '0')}:00`;
          const items = getItemsInHour(hour);
          const isFull = items.length > 0;

          return (
            <div key={hour} className="flex gap-4">
              <div className="w-20 font-medium text-gray-600 text-sm flex-shrink-0 pt-2">
                {hourStr}
              </div>
              <div className="flex-1">
                {isFull ? (
                  <div className="space-y-1">
                    {items.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded text-sm font-medium ${
                          item.type === 'task'
                            ? timeHelper.getUrgencyBg((item as Task).urgency)
                            : 'bg-green-100'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold">
                              {item.type === 'task' ? (item as Task).title : (item as Routine).name}
                            </div>
                            <div className="text-xs opacity-75">
                              {item.startTime} - {item.endTime}
                            </div>
                          </div>
                          {item.type === 'task' && (
                            <div className="flex gap-1 ml-2">
                              <select
                                value={(item as Task).status}
                                onChange={e => onTaskStatusChange((item as Task).id, e.target.value)}
                                className="px-2 py-1 text-xs border rounded"
                              >
                                <option value="pendiente">Pendiente</option>
                                <option value="en_progreso">En progreso</option>
                                <option value="completada">Completada</option>
                                <option value="pospuesta">Pospuesta</option>
                              </select>
                              <button
                                onClick={() => onDeleteTask((item as Task).id)}
                                className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 rounded text-red-700"
                              >
                                ✕
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-12 bg-gray-50 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <span className="text-xs text-gray-400">Libre</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {freeBlocks.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">⏱️ Espacios libres disponibles:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {freeBlocks.map((block, idx) => (
              <div key={idx} className="bg-blue-100 p-2 rounded text-sm text-blue-800">
                {block.startTime} - {block.endTime}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
