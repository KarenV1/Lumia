import { CSSProperties, FormEvent, useEffect, useRef, useState } from 'react';
import { Task, Urgency } from '../../types/index.ts';
import { timeHelper } from '../../utils/timeHelper.ts';
import { Icon } from '../ui/Icon.tsx';
import { PrimaryButton } from '../ui/PrimaryButton.tsx';

interface QuickTaskInputProps {
  onAdd: (task: Task) => void;
}

const URGENCY: { value: Urgency; label: string; color: string }[] = [
  { value: 'baja', label: 'Baja', color: 'var(--verde)' },
  { value: 'media', label: 'Media', color: 'var(--azul)' },
  { value: 'alta', label: 'Alta', color: 'var(--beige)' },
  { value: 'urgente', label: 'Urgente', color: 'var(--rosa)' },
];

/** Hora actual redondeada a la siguiente en punto, ej. "14:00" */
const nextHour = (): string => {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  d.setHours(d.getHours() + 1);
  return `${String(d.getHours()).padStart(2, '0')}:00`;
};

/**
 * Captura rápida. Barra elegante que, al tocarla, despliega un panel glass para
 * dar al pendiente un día, una hora (lugar en el calendario) y una relevancia.
 */
export const QuickTaskInput = ({ onAdd }: QuickTaskInputProps) => {
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => timeHelper.getDateString());
  const [time, setTime] = useState(() => nextHour());
  const [urgency, setUrgency] = useState<Urgency>('media');

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (expanded) titleRef.current?.focus();
  }, [expanded]);

  const reset = () => {
    setTitle('');
    setDate(timeHelper.getDateString());
    setTime(nextHour());
    setUrgency('media');
  };

  const close = () => {
    setExpanded(false);
    reset();
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const clean = title.trim();
    if (!clean) return;

    const startMin = timeHelper.timeToMinutes(time);
    const endTime = timeHelper.minutesToTime(Math.min(startMin + 60, 24 * 60 - 1));

    const task: Task = {
      id: Date.now().toString(),
      title: clean,
      description: '',
      date,
      startTime: time,
      endTime,
      urgency,
      status: 'pendiente',
      hasReminder: true,
    };

    onAdd(task);
    setExpanded(false);
    reset();
  };

  return (
    <div className="av-quickadd-wrap">
      {!expanded ? (
        <div
          className="av-quickadd"
          role="button"
          tabIndex={0}
          onClick={() => setExpanded(true)}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setExpanded(true)}
        >
          <span className="av-quickadd-fab" aria-hidden="true">
            <Icon name="plus" size={22} strokeWidth={2} />
          </span>
          <span className="av-quickadd-placeholder">Añadir pendiente rápido</span>
        </div>
      ) : (
        <form className="av-card av-quickform" onSubmit={submit}>
          <input
            ref={titleRef}
            className="av-input av-quickform-title"
            placeholder="¿Qué quieres recordar?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="Título del pendiente"
          />

          <div className="av-quickform-row">
            <label className="av-quickfield">
              <span className="av-quickfield-label">Día</span>
              <input
                type="date"
                className="av-input av-input--mini"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            <label className="av-quickfield">
              <span className="av-quickfield-label">Hora</span>
              <input
                type="time"
                className="av-input av-input--mini"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </label>
          </div>

          <div className="av-quickform-urgency" role="group" aria-label="Relevancia">
            {URGENCY.map((u) => (
              <button
                key={u.value}
                type="button"
                className={`av-urg${urgency === u.value ? ' is-selected' : ''}`}
                style={{ '--urg-color': u.color } as CSSProperties}
                onClick={() => setUrgency(u.value)}
                aria-pressed={urgency === u.value}
              >
                <span className="av-urg-dot" />
                {u.label}
              </button>
            ))}
          </div>

          <div className="av-quickform-actions">
            <PrimaryButton variant="ghost" onClick={close}>
              Cancelar
            </PrimaryButton>
            <PrimaryButton type="submit" disabled={!title.trim()}>
              Añadir
            </PrimaryButton>
          </div>
        </form>
      )}
    </div>
  );
};
