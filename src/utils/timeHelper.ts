import { Task, Routine, TimeBlock, DayOfWeek } from '../types/index.ts';

export const timeHelper = {
  timeToMinutes: (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  },

  minutesToTime: (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  },

  getDateString: (date: Date = new Date()): string => {
    return date.toISOString().split('T')[0];
  },

  getDayOfWeek: (date: string): DayOfWeek => {
    const days: DayOfWeek[] = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const dayIndex = new Date(date + 'T00:00:00').getDay();
    return days[dayIndex];
  },

  formatDate: (date: string): string => {
    const d = new Date(date + 'T00:00:00');
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(d);
  },

  getUrgencyColor: (urgency: string): string => {
    const colors: { [key: string]: string } = {
      baja: 'bg-blue-100 border-blue-300 text-blue-800',
      media: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      alta: 'bg-red-100 border-red-300 text-red-800',
      urgente: 'bg-purple-100 border-purple-300 text-purple-800',
    };
    return colors[urgency] || colors.baja;
  },

  getUrgencyBg: (urgency: string): string => {
    const colors: { [key: string]: string } = {
      baja: 'bg-blue-200',
      media: 'bg-yellow-200',
      alta: 'bg-red-200',
      urgente: 'bg-purple-200',
    };
    return colors[urgency] || colors.baja;
  },

  calculateFreeBlocks: (tasks: Task[], routines: Routine[], date: string): TimeBlock[] => {
    const dayOfWeek = timeHelper.getDayOfWeek(date);
    const blocks: TimeBlock[] = [];

    const dayTasks = tasks.filter(t => t.date === date && t.status !== 'completada');
    const dayRoutines = routines.filter(r => r.active && r.daysOfWeek.includes(dayOfWeek));

    const allEvents = [
      ...dayTasks.map(t => ({ startTime: t.startTime, endTime: t.endTime, type: 'task' as const, data: t })),
      ...dayRoutines.map(r => ({ startTime: r.startTime, endTime: r.endTime, type: 'routine' as const, data: r })),
    ].sort((a, b) => timeHelper.timeToMinutes(a.startTime) - timeHelper.timeToMinutes(b.startTime));

    let currentTime = 0;
    for (const event of allEvents) {
      const eventStart = timeHelper.timeToMinutes(event.startTime);
      if (currentTime < eventStart) {
        blocks.push({
          startTime: timeHelper.minutesToTime(currentTime),
          endTime: event.startTime,
          type: 'free',
        });
      }
      currentTime = Math.max(currentTime, timeHelper.timeToMinutes(event.endTime));
    }

    if (currentTime < 24 * 60) {
      blocks.push({
        startTime: timeHelper.minutesToTime(currentTime),
        endTime: '23:59',
        type: 'free',
      });
    }

    return blocks;
  },

  hasUrgentForTomorrow: (tasks: Task[]): boolean => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = timeHelper.getDateString(tomorrow);
    return tasks.some(t => t.date === tomorrowStr && (t.urgency === 'alta' || t.urgency === 'urgente'));
  },
};
