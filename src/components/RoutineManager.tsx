import { useState } from 'react';
import { Routine, DayOfWeek } from '../types/index.ts';

interface RoutineManagerProps {
  routines: Routine[];
  onAddRoutine: (routine: Routine) => void;
  onUpdateRoutine: (id: string, updates: Partial<Routine>) => void;
  onDeleteRoutine: (id: string) => void;
}

const DAYS: DayOfWeek[] = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

export const RoutineManager = ({
  routines,
  onAddRoutine,
  onUpdateRoutine,
  onDeleteRoutine,
}: RoutineManagerProps) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [daysOfWeek, setDaysOfWeek] = useState<DayOfWeek[]>(['lunes']);
  const [color, setColor] = useState('#10B981');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const routine: Routine = {
      id: Date.now().toString(),
      name,
      startTime,
      endTime,
      daysOfWeek,
      color,
      active: true,
    };

    onAddRoutine(routine);
    setName('');
    setStartTime('09:00');
    setEndTime('10:00');
    setDaysOfWeek(['lunes']);
    setColor('#10B981');
    setShowForm(false);
  };

  const toggleDay = (day: DayOfWeek) => {
    setDaysOfWeek(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day],
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Rutinas cotidianas</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
        >
          {showForm ? 'Cancelar' : '+ Agregar rutina'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ej: Dormir, Estudiar, Ejercicio..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora inicio</label>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora fin</label>
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Días de la semana</label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map(day => (
                <label key={day} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={daysOfWeek.includes(day)}
                    onChange={() => toggleDay(day)}
                    className="h-4 w-4 text-green-600 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">{day}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <input
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              className="h-10 w-20 rounded cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Crear rutina
          </button>
        </form>
      )}

      <div className="space-y-3">
        {routines.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No hay rutinas configuradas</p>
        ) : (
          routines.map(routine => (
            <div
              key={routine.id}
              className="border-l-4 p-3 bg-gray-50 rounded flex justify-between items-start"
              style={{ borderColor: routine.color }}
            >
              <div>
                <h3 className="font-semibold text-gray-800">{routine.name}</h3>
                <p className="text-sm text-gray-600">
                  {routine.startTime} - {routine.endTime}
                </p>
                <p className="text-xs text-gray-500 mt-1 capitalize">
                  {routine.daysOfWeek.join(', ')}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onUpdateRoutine(routine.id, { active: !routine.active })}
                  className={`px-3 py-1 text-sm rounded ${
                    routine.active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {routine.active ? 'Activa' : 'Inactiva'}
                </button>
                <button
                  onClick={() => onDeleteRoutine(routine.id)}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
