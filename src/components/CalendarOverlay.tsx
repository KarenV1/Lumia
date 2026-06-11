import { CSSProperties, useState } from 'react';
import { Task, Routine } from '../types/index.ts';
import { timeHelper } from '../utils/timeHelper.ts';
import { getDayOccupancyPercent, occupancyColor } from '../utils/dayLoad.ts';
import { routineAppliesOn, routineScheduleText } from '../utils/routine.ts';

interface CalendarOverlayProps {
  isOpen: boolean;
  tasks: Task[];
  routines: Routine[];
  onClose: () => void;
}

const WEEKDAYS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

/**
 * Calendario mensual con degradado de saturación por día (qué tan ocupado está)
 * y agenda del día seleccionado. Se abre directamente, sin paso intermedio.
 */
export const CalendarOverlay = ({ isOpen, tasks, routines, onClose }: CalendarOverlayProps) => {
  const [selectedDate, setSelectedDate] = useState(timeHelper.getDateString());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  if (!isOpen) return null;

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  // Semana iniciando en lunes
  const firstWeekday = (new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() + 6) % 7;

  const days: (string | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(timeHelper.getDateString(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i)));
  }

  const monthName = currentMonth
    .toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    .toUpperCase();
  const todayStr = timeHelper.getDateString(new Date());

  const selectedDayOfWeek = timeHelper.getDayOfWeek(selectedDate);
  const selectedTasks = tasks
    .filter((t) => t.date === selectedDate && t.status !== 'completada')
    .map((t) => ({ id: t.id, name: t.title, meta: t.description, time: t.startTime, kind: 'task' as const }));
  const selectedRoutines = routines
    .filter((r) => r.active && routineAppliesOn(r, selectedDayOfWeek))
    .map((r) => ({ id: r.id, name: r.name, meta: routineScheduleText(r), time: r.startTime, kind: 'routine' as const }));

  const agenda = [...selectedRoutines, ...selectedTasks].sort(
    (a, b) => timeHelper.timeToMinutes(a.time) - timeHelper.timeToMinutes(b.time),
  );

  const goMonth = (delta: number) =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta, 1));

  return (
    <div className="calendar-overlay" onClick={onClose}>
      <div className="calendar-expanded-floating" onClick={(e) => e.stopPropagation()}>
        <div className="calendar-expanded-header">
          <h2 className="expanded-title">{monthName}</h2>
          <button className="expanded-close" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className="calendar-nav">
          <button onClick={() => goMonth(-1)} className="nav-btn">
            ‹ Anterior
          </button>
          <button onClick={() => setCurrentMonth(new Date())} className="nav-btn-today">
            Hoy
          </button>
          <button onClick={() => goMonth(1)} className="nav-btn">
            Siguiente ›
          </button>
        </div>

        <div className="calendar-grid-container">
          <div className="weekday-header">
            {WEEKDAYS.map((d) => (
              <div key={d} className="weekday-label">
                {d}
              </div>
            ))}
          </div>

          <div className="calendar-grid">
            {days.map((dateStr, idx) => {
              if (!dateStr) return <div key={idx} className="calendar-day is-empty" />;
              const isSelected = dateStr === selectedDate;
              const isToday = dateStr === todayStr;
              const percent = getDayOccupancyPercent(tasks, routines, dateStr);

              return (
                <button
                  key={idx}
                  type="button"
                  className={`calendar-day${isSelected ? ' selected' : ''}${isToday ? ' today' : ''}`}
                  style={{ '--sat': occupancyColor(percent) } as CSSProperties}
                  onClick={() => setSelectedDate(dateStr)}
                  aria-label={`${parseInt(dateStr.split('-')[2])} · ${percent}% ocupado`}
                >
                  <span className="day-number">{parseInt(dateStr.split('-')[2])}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="selected-day-agenda">
          <div className="agenda-header">
            <h3 className="agenda-title">Agenda</h3>
          </div>

          {agenda.length === 0 ? (
            <div className="empty-state">
              <p>Día libre. Disfruta la calma.</p>
            </div>
          ) : (
            <div className="agenda-items">
              {agenda.map((item) => (
                <div key={item.kind + item.id} className={`agenda-item ${item.kind}-item`}>
                  <div className="agenda-time">{item.time}</div>
                  <div className="agenda-content">
                    <div className="agenda-name">{item.name}</div>
                    {item.meta && <div className="agenda-meta">{item.meta}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
