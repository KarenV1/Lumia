import { useState } from 'react';
import { Task, Routine } from '../types/index.ts';
import { timeHelper } from '../utils/timeHelper.ts';

interface CalendarOverlayProps {
  isOpen: boolean;
  state: 'capsule' | 'expanded';
  tasks: Task[];
  routines: Routine[];
  onClose: () => void;
  onExpand: () => void;
}

export const CalendarOverlay = ({
  isOpen,
  state,
  tasks,
  routines,
  onClose,
  onExpand,
}: CalendarOverlayProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [selectedDate, setSelectedDate] = useState(timeHelper.getDateString());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  if (!isOpen) return null;

  const today = new Date();
  const month = today.toLocaleDateString('es-ES', { month: 'long' }).toUpperCase();
  const day = today.getDate();
  const dayName = today.toLocaleDateString('es-ES', { weekday: 'long' }).toUpperCase();
  const year = today.getFullYear();
  const taskCount = tasks.filter(t => t.date === today.toISOString().split('T')[0]).length;

  // Calendar logic
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = timeHelper.getDateString(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i)
    );
    days.push(dateStr);
  }

  const monthName = currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase();
  const selectedDayTasks = tasks.filter(t => t.date === selectedDate && t.status !== 'completada');
  const selectedDayOfWeek = timeHelper.getDayOfWeek(selectedDate);
  const selectedDayRoutines = routines.filter(r => r.active && r.daysOfWeek.includes(selectedDayOfWeek));

  return (
    <div className="calendar-overlay" onClick={onClose}>
      {/* Cápsula en modo "capsule" */}
      {state === 'capsule' && (
        <div
          className="calendar-capsule-floating"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={(e) => e.stopPropagation()}
          style={{
            transform: isHovering ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.3s ease',
          }}
        >
          <div className="capsule-content">
            <div className="capsule-month">{month}</div>
            <div className="capsule-year">{year}</div>
            <div className="capsule-day">{day}</div>
            <div className="capsule-dayname">{dayName}</div>

            {taskCount > 0 && (
              <div className="capsule-badge">{taskCount} evento{taskCount !== 1 ? 's' : ''}</div>
            )}

            <div className="capsule-cta" onClick={onExpand}>
              Abrir agenda
            </div>
          </div>

          <div className="capsule-shine"></div>
        </div>
      )}

      {/* Calendario expandido en modo "expanded" */}
      {state === 'expanded' && (
        <div className="calendar-expanded-floating" onClick={(e) => e.stopPropagation()}>
          <div className="capsule-expanded-header">
            <h2 className="expanded-title">{monthName}</h2>
            <button className="expanded-close" onClick={onClose}>
              ✕
            </button>
          </div>

          <div className="calendar-nav">
            <button
              onClick={() =>
                setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
              }
              className="nav-btn"
            >
              ‹ Anterior
            </button>
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="nav-btn-today"
            >
              Hoy
            </button>
            <button
              onClick={() =>
                setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
              }
              className="nav-btn"
            >
              Siguiente ›
            </button>
          </div>

          <div className="calendar-grid-container">
            <div className="weekday-header">
              {['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'].map(dayLabel => (
                <div key={dayLabel} className="weekday-label">
                  {dayLabel}
                </div>
              ))}
            </div>

            <div className="calendar-grid">
              {days.map((dateStr, idx) => {
                const isSelected = dateStr === selectedDate;
                const isToday = dateStr === timeHelper.getDateString(new Date());
                const dayTasks = dateStr
                  ? tasks.filter(t => t.date === dateStr && t.status !== 'completada')
                  : [];

                return (
                  <div
                    key={idx}
                    className={`calendar-day ${isSelected ? 'selected' : ''} ${
                      isToday ? 'today' : ''
                    }`}
                    onClick={() => dateStr && setSelectedDate(dateStr)}
                  >
                    {dateStr && (
                      <>
                        <div className="day-number">{parseInt(dateStr.split('-')[2])}</div>
                        {dayTasks.length > 0 && <div className="day-indicator">{dayTasks.length}</div>}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="selected-day-agenda">
            <div className="agenda-header">
              <h3 className="agenda-title">Agenda</h3>
            </div>

            {selectedDayTasks.length === 0 && selectedDayRoutines.length === 0 ? (
              <div className="empty-state">
                <p>Sin eventos</p>
              </div>
            ) : (
              <div className="agenda-items">
                {selectedDayRoutines.map(routine => (
                  <div key={routine.id} className="agenda-item routine-item">
                    <div className="agenda-time">{routine.startTime}</div>
                    <div className="agenda-content">
                      <div className="agenda-name">{routine.name}</div>
                      <div className="agenda-meta">
                        {routine.startTime} – {routine.endTime}
                      </div>
                    </div>
                  </div>
                ))}

                {selectedDayTasks.map(task => (
                  <div key={task.id} className="agenda-item task-item">
                    <div className="agenda-time">{task.startTime}</div>
                    <div className="agenda-content">
                      <div className="agenda-name">{task.title}</div>
                      {task.description && (
                        <div className="agenda-meta">{task.description}</div>
                      )}
                      <div className="agenda-meta">
                        {task.startTime} – {task.endTime}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
