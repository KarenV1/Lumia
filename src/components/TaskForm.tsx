import { useState } from 'react';
import { Task, Urgency, TaskStatus } from '../types/index.ts';
import { timeHelper } from '../utils/timeHelper.ts';

interface TaskFormProps {
  onSubmit: (task: Task) => void;
  defaultDate?: string;
}

export const TaskForm = ({ onSubmit, defaultDate }: TaskFormProps) => {
  const today = defaultDate || timeHelper.getDateString();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [urgency, setUrgency] = useState<Urgency>('media');
  const [hasReminder, setHasReminder] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title,
      description,
      date,
      startTime,
      endTime,
      urgency,
      status: 'pendiente' as TaskStatus,
      hasReminder,
    };

    onSubmit(task);
    setTitle('');
    setDescription('');
    setDate(today);
    setStartTime('09:00');
    setEndTime('10:00');
    setUrgency('media');
    setHasReminder(true);
  };

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 mb-6 text-white backdrop-blur-xl">
      <h2 className="text-2xl font-bold mb-6 text-shadow-lg">✨ Agregar nueva tarea</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-2 opacity-95 text-shadow">📝 Título *</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="¿Qué necesitas hacer?"
            className="w-full px-4 py-2.5 border border-white border-opacity-40 rounded-lg bg-white bg-opacity-15 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-80 text-white placeholder-white placeholder-opacity-60 font-medium"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-2 opacity-95 text-shadow">📄 Descripción</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Detalles adicionales..."
            className="w-full px-4 py-2.5 border border-white border-opacity-40 rounded-lg bg-white bg-opacity-15 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-80 text-white placeholder-white placeholder-opacity-60 font-medium"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 opacity-95 text-shadow">📅 Fecha</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full px-4 py-2.5 border border-white border-opacity-40 rounded-lg bg-white bg-opacity-15 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-80 text-white font-medium"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 opacity-95 text-shadow">⚡ Urgencia</label>
          <select
            value={urgency}
            onChange={e => setUrgency(e.target.value as Urgency)}
            className="w-full px-4 py-2.5 border border-white border-opacity-40 rounded-lg bg-white bg-opacity-15 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-80 text-white font-medium"
          >
            <option value="baja">🟢 Baja</option>
            <option value="media">🟡 Media</option>
            <option value="alta">🔴 Alta</option>
            <option value="urgente">🔴 Urgente para mañana</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 opacity-95 text-shadow">🕐 Hora inicio</label>
          <input
            type="time"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            className="w-full px-4 py-2.5 border border-white border-opacity-40 rounded-lg bg-white bg-opacity-15 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-80 text-white font-medium"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 opacity-95 text-shadow">🕑 Hora fin</label>
          <input
            type="time"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            className="w-full px-4 py-2.5 border border-white border-opacity-40 rounded-lg bg-white bg-opacity-15 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-80 text-white font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="reminder"
            checked={hasReminder}
            onChange={e => setHasReminder(e.target.checked)}
            className="h-5 w-5 rounded accent-white cursor-pointer"
          />
          <label htmlFor="reminder" className="text-sm font-semibold cursor-pointer opacity-95 text-shadow">
            🔔 Recordatorio
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 w-full bg-white bg-opacity-95 text-gray-900 hover:bg-opacity-100 font-bold py-3 px-4 rounded-lg transition duration-200 shadow-lg text-shadow"
      >
        ✨ Crear tarea
      </button>
    </form>
  );
};
