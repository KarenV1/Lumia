import { CSSProperties, useEffect, useState } from 'react';
import { DayOfWeek, Routine, RoutineFrequencyType } from '../../types/index.ts';
import { ALL_DAYS, getFrequency, syncDaysFromFrequency } from '../../utils/routine.ts';
import { Icon, IconName } from '../ui/Icon.tsx';
import { InputField } from '../ui/InputField.tsx';
import { PrimaryButton } from '../ui/PrimaryButton.tsx';

interface RoutineEditorProps {
  routine: Routine | null;
  isNew: boolean;
  onClose: () => void;
  onSave: (routine: Routine) => void;
  onDelete: (id: string) => void;
}

const ICON_OPTIONS: { name: IconName; label: string }[] = [
  { name: 'moon', label: 'Dormir' },
  { name: 'droplet', label: 'Agua' },
  { name: 'book', label: 'Estudiar' },
  { name: 'laptop', label: 'Trabajo' },
  { name: 'cup', label: 'Descanso' },
  { name: 'heart', label: 'Salud' },
  { name: 'apple', label: 'Comida' },
  { name: 'sun', label: 'Mañana' },
  { name: 'star', label: 'Importante' },
  { name: 'check', label: 'Tarea' },
  { name: 'walk', label: 'Ejercicio' },
  { name: 'bell', label: 'Recordatorio' },
];

const COLOR_OPTIONS = [
  'var(--lavanda)',
  'var(--azul)',
  'var(--verde)',
  'var(--beige)',
  'var(--rosa)',
  'var(--gris)',
];

const FREQUENCIES: { value: RoutineFrequencyType; label: string }[] = [
  { value: 'daily', label: 'Todos los días' },
  { value: 'weekly', label: 'Días' },
  { value: 'interval', label: 'Intervalo' },
  { value: 'once', label: 'Una vez' },
];

const INTERVALS = [
  { value: 20, label: '20 min' },
  { value: 30, label: '30 min' },
  { value: 60, label: '1 h' },
  { value: 180, label: '3 h' },
];

const DAY_LETTER: Record<DayOfWeek, string> = {
  lunes: 'L',
  martes: 'M',
  miércoles: 'X',
  jueves: 'J',
  viernes: 'V',
  sábado: 'S',
  domingo: 'D',
};

export const RoutineEditor = ({ routine, isNew, onClose, onSave, onDelete }: RoutineEditorProps) => {
  const [draft, setDraft] = useState<Routine | null>(routine);

  useEffect(() => {
    setDraft(routine);
  }, [routine]);

  if (!routine || !draft) return null;

  const freq = getFrequency(draft);
  const set = (patch: Partial<Routine>) => setDraft((d) => (d ? { ...d, ...patch } : d));
  const setFreq = (type: RoutineFrequencyType) => {
    if (type === 'weekly') {
      set({ frequency: { type, days: freq.days ?? [...ALL_DAYS] } });
    } else if (type === 'interval') {
      set({
        frequency: { type, everyMinutes: freq.everyMinutes ?? 180, from: freq.from ?? '08:00', to: freq.to ?? '22:00' },
      });
    } else {
      set({ frequency: { type } });
    }
  };

  const toggleDay = (day: DayOfWeek) => {
    const days = freq.days ?? [];
    const next = days.includes(day) ? days.filter((d) => d !== day) : [...days, day];
    set({ frequency: { type: 'weekly', days: next } });
  };

  const handleSave = () => {
    if (!draft.name.trim()) return;
    onSave(syncDaysFromFrequency({ ...draft, name: draft.name.trim() }));
  };

  return (
    <div className="av-sheet-overlay" onClick={onClose}>
      <div className="av-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="av-sheet-handle" />

        <div className="av-sheet-head">
          <h2 className="av-sheet-title">{isNew ? 'Nueva rutina' : 'Editar rutina'}</h2>
          <label className="av-switch">
            <input
              type="checkbox"
              checked={draft.active}
              onChange={(e) => set({ active: e.target.checked })}
            />
            <span className="av-switch-track">
              <span className="av-switch-thumb" />
            </span>
          </label>
        </div>

        <div className="av-sheet-body">
          <InputField
            label="Nombre"
            value={draft.name}
            onChange={(v) => set({ name: v })}
            placeholder="Nombre de la rutina"
          />

          {/* Icono */}
          <div className="av-field-group">
            <span className="av-quickfield-label">Icono</span>
            <div className="av-icon-grid">
              {ICON_OPTIONS.map((opt) => (
                <button
                  key={opt.name}
                  type="button"
                  className={`av-icon-opt${draft.icon === opt.name ? ' is-selected' : ''}`}
                  style={{ '--routine-color': draft.color } as CSSProperties}
                  onClick={() => set({ icon: opt.name })}
                  title={opt.label}
                  aria-label={opt.label}
                >
                  <Icon name={opt.name} size={20} />
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="av-field-group">
            <span className="av-quickfield-label">Color</span>
            <div className="av-color-row">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`av-color-opt${draft.color === c ? ' is-selected' : ''}`}
                  style={{ '--swatch': c } as CSSProperties}
                  onClick={() => set({ color: c })}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
          </div>

          {/* Frecuencia */}
          <div className="av-field-group">
            <span className="av-quickfield-label">Frecuencia</span>
            <div className="av-freq-row">
              {FREQUENCIES.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  className={`av-freq-opt${freq.type === f.value ? ' is-selected' : ''}`}
                  onClick={() => setFreq(f.value)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Días (weekly) */}
          {freq.type === 'weekly' && (
            <div className="av-field-group">
              <span className="av-quickfield-label">Días</span>
              <div className="av-days-row">
                {ALL_DAYS.map((day) => (
                  <button
                    key={day}
                    type="button"
                    className={`av-day-opt${(freq.days ?? []).includes(day) ? ' is-selected' : ''}`}
                    onClick={() => toggleDay(day)}
                    aria-label={day}
                  >
                    {DAY_LETTER[day]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Intervalo */}
          {freq.type === 'interval' && (
            <>
              <div className="av-field-group">
                <span className="av-quickfield-label">Cada</span>
                <div className="av-freq-row">
                  {INTERVALS.map((it) => (
                    <button
                      key={it.value}
                      type="button"
                      className={`av-freq-opt${freq.everyMinutes === it.value ? ' is-selected' : ''}`}
                      onClick={() =>
                        set({ frequency: { ...freq, type: 'interval', everyMinutes: it.value } })
                      }
                    >
                      {it.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="av-quickform-row">
                <label className="av-quickfield">
                  <span className="av-quickfield-label">Desde</span>
                  <input
                    type="time"
                    className="av-input av-input--mini"
                    value={freq.from ?? '08:00'}
                    onChange={(e) => set({ frequency: { ...freq, type: 'interval', from: e.target.value } })}
                  />
                </label>
                <label className="av-quickfield">
                  <span className="av-quickfield-label">Hasta</span>
                  <input
                    type="time"
                    className="av-input av-input--mini"
                    value={freq.to ?? '22:00'}
                    onChange={(e) => set({ frequency: { ...freq, type: 'interval', to: e.target.value } })}
                  />
                </label>
              </div>
            </>
          )}

          {/* Horario (no intervalo) */}
          {freq.type !== 'interval' && (
            <div className="av-quickform-row">
              <label className="av-quickfield">
                <span className="av-quickfield-label">Hora</span>
                <input
                  type="time"
                  className="av-input av-input--mini"
                  value={draft.startTime}
                  onChange={(e) => set({ startTime: e.target.value })}
                />
              </label>
              {freq.type !== 'once' && (
                <label className="av-quickfield">
                  <span className="av-quickfield-label">Hasta</span>
                  <input
                    type="time"
                    className="av-input av-input--mini"
                    value={draft.endTime}
                    onChange={(e) => set({ endTime: e.target.value })}
                  />
                </label>
              )}
            </div>
          )}
        </div>

        <div className="av-sheet-actions">
          {!isNew && (
            <button type="button" className="av-btn-danger" onClick={() => onDelete(draft.id)}>
              <Icon name="trash" size={18} />
              Eliminar
            </button>
          )}
          <PrimaryButton onClick={handleSave} disabled={!draft.name.trim()}>
            Guardar
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
