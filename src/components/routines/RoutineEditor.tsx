import { CSSProperties, useEffect, useState } from 'react';
import { DayOfWeek, Routine, RoutineFrequencyType, RoutineKind, Task } from '../../types/index.ts';
import {
  ALL_DAYS,
  getFrequency,
  getRoutineKind,
  KIND_LABEL,
  syncDaysFromFrequency,
} from '../../utils/routine.ts';
import {
  DAY_START,
  findRoutineConflict,
  getFixedBlocksForDay,
  nextFreeSlot,
} from '../../utils/agenda.ts';
import { timeHelper } from '../../utils/timeHelper.ts';
import { Icon, IconName } from '../ui/Icon.tsx';
import { InputField } from '../ui/InputField.tsx';
import { PrimaryButton } from '../ui/PrimaryButton.tsx';

interface RoutineEditorProps {
  routine: Routine | null;
  isNew: boolean;
  tasks: Task[];
  routines: Routine[];
  date: string;
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
  { name: 'walk', label: 'Ejercicio' },
  { name: 'music', label: 'Música' },
  { name: 'bell', label: 'Recordatorio' },
  { name: 'star', label: 'Importante' },
  { name: 'check', label: 'Tarea' },
  { name: 'tag', label: 'Genérico' },
];

const COLOR_OPTIONS = [
  'var(--lavanda)',
  'var(--azul)',
  'var(--verde)',
  'var(--beige)',
  'var(--rosa)',
  'var(--gris)',
];

const KINDS: RoutineKind[] = ['fixed', 'reminder', 'flexible'];

const FREQ_BY_KIND: Record<RoutineKind, RoutineFrequencyType[]> = {
  fixed: ['daily', 'weekly', 'once'],
  reminder: ['daily', 'weekly', 'interval', 'once'],
  flexible: ['daily', 'weekly'],
};

const FREQ_LABEL: Record<RoutineFrequencyType, string> = {
  daily: 'Todos los días',
  weekly: 'Días',
  interval: 'Intervalo',
  once: 'Una vez',
};

const INTERVALS = [
  { value: 20, label: '20 min' },
  { value: 30, label: '30 min' },
  { value: 60, label: '1 h' },
  { value: 180, label: '3 h' },
];

const DURATIONS = [
  { value: 20, label: '20 min' },
  { value: 30, label: '30 min' },
  { value: 60, label: '1 h' },
  { value: 90, label: '1.5 h' },
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

export const RoutineEditor = ({
  routine,
  isNew,
  tasks,
  routines,
  date,
  onClose,
  onSave,
  onDelete,
}: RoutineEditorProps) => {
  const [draft, setDraft] = useState<Routine | null>(routine);

  useEffect(() => {
    setDraft(routine);
  }, [routine]);

  if (!routine || !draft) return null;

  const kind = getRoutineKind(draft);
  const freq = getFrequency(draft);
  const set = (patch: Partial<Routine>) => setDraft((d) => (d ? { ...d, ...patch } : d));

  const setKind = (k: RoutineKind) => {
    const allowed = FREQ_BY_KIND[k];
    let nextFreq = freq;
    if (!allowed.includes(freq.type)) {
      nextFreq = k === 'reminder' ? { type: 'interval', everyMinutes: 180, from: '08:00', to: '22:00' } : { type: 'daily' };
    }
    set({ kind: k, frequency: nextFreq });
  };

  const setFreq = (type: RoutineFrequencyType) => {
    if (type === 'weekly') set({ frequency: { type, days: freq.days ?? [...ALL_DAYS] } });
    else if (type === 'interval')
      set({
        frequency: {
          type,
          everyMinutes: freq.everyMinutes ?? 180,
          from: freq.from ?? '08:00',
          to: freq.to ?? '22:00',
        },
      });
    else set({ frequency: { type } });
  };

  const toggleDay = (day: DayOfWeek) => {
    const days = freq.days ?? [];
    const next = days.includes(day) ? days.filter((d) => d !== day) : [...days, day];
    set({ frequency: { type: 'weekly', days: next } });
  };

  // Validación de traslapes (solo rutinas fijas)
  const conflict = kind === 'fixed' ? findRoutineConflict(routines, syncDaysFromFrequency(draft)) : null;
  const fixedBlocks = getFixedBlocksForDay(tasks, routines, date).filter((b) => b.id !== draft.id);

  // Sugerencia de hueco libre (conflicto fijo o rutina flexible)
  const suggestDuration =
    kind === 'flexible'
      ? draft.duration ?? 30
      : Math.max(15, timeHelper.timeToMinutes(draft.endTime) - timeHelper.timeToMinutes(draft.startTime));
  const suggestion =
    kind === 'reminder' ? null : nextFreeSlot(tasks, routines, date, suggestDuration, DAY_START);

  const canSave = !!draft.name.trim() && !conflict;

  const handleSave = () => {
    if (!canSave) return;
    let out = syncDaysFromFrequency({ ...draft, name: draft.name.trim(), kind });
    // Flexible: acomoda en el hueco sugerido
    if (kind === 'flexible' && suggestion) {
      out = { ...out, startTime: suggestion.startLabel, endTime: suggestion.endLabel };
    }
    if (out.notification?.notificationEnabled && !out.notification.notificationTime) {
      out = { ...out, notification: { ...out.notification, notificationTime: out.startTime, notificationMessage: out.name } };
    }
    onSave(out);
  };

  const availableFreqs = FREQ_BY_KIND[kind];

  return (
    <div className="av-sheet-overlay" onClick={onClose}>
      <div className="av-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="av-sheet-handle" />

        <div className="av-sheet-head">
          <h2 className="av-sheet-title">{isNew ? 'Nueva rutina' : 'Editar rutina'}</h2>
          <label className="av-switch">
            <input type="checkbox" checked={draft.active} onChange={(e) => set({ active: e.target.checked })} />
            <span className="av-switch-track">
              <span className="av-switch-thumb" />
            </span>
          </label>
        </div>

        <div className="av-sheet-body">
          <InputField label="Nombre" value={draft.name} onChange={(v) => set({ name: v })} placeholder="Nombre de la rutina" />

          {/* Tipo de rutina */}
          <div className="av-field-group">
            <span className="av-quickfield-label">Tipo</span>
            <div className="av-freq-row">
              {KINDS.map((k) => (
                <button
                  key={k}
                  type="button"
                  className={`av-freq-opt${kind === k ? ' is-selected' : ''}`}
                  onClick={() => setKind(k)}
                >
                  {KIND_LABEL[k]}
                </button>
              ))}
            </div>
            <span className="av-hint">
              {kind === 'fixed' && 'Ocupa tiempo real en tu día (clase, trabajo, dormir).'}
              {kind === 'reminder' && 'Hábito breve que no bloquea tiempo (agua, retenedores).'}
              {kind === 'flexible' && 'Tiene duración y se acomoda en un espacio libre.'}
            </span>
          </div>

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
              {availableFreqs.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`av-freq-opt${freq.type === f ? ' is-selected' : ''}`}
                  onClick={() => setFreq(f)}
                >
                  {FREQ_LABEL[f]}
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

          {/* Intervalo (recordatorio) */}
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
                      onClick={() => set({ frequency: { ...freq, type: 'interval', everyMinutes: it.value } })}
                    >
                      {it.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="av-quickform-row">
                <label className="av-quickfield">
                  <span className="av-quickfield-label">Desde</span>
                  <input type="time" className="av-input av-input--mini" value={freq.from ?? '08:00'} onChange={(e) => set({ frequency: { ...freq, type: 'interval', from: e.target.value } })} />
                </label>
                <label className="av-quickfield">
                  <span className="av-quickfield-label">Hasta</span>
                  <input type="time" className="av-input av-input--mini" value={freq.to ?? '22:00'} onChange={(e) => set({ frequency: { ...freq, type: 'interval', to: e.target.value } })} />
                </label>
              </div>
            </>
          )}

          {/* Duración (flexible) */}
          {kind === 'flexible' && (
            <div className="av-field-group">
              <span className="av-quickfield-label">Duración</span>
              <div className="av-freq-row">
                {DURATIONS.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    className={`av-freq-opt${(draft.duration ?? 30) === d.value ? ' is-selected' : ''}`}
                    onClick={() => set({ duration: d.value })}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              {suggestion && (
                <span className="av-suggest">
                  Cabe hoy de {suggestion.startLabel} a {suggestion.endLabel}
                </span>
              )}
            </div>
          )}

          {/* Horario (fija / una vez no-flexible / no-interval) */}
          {kind !== 'flexible' && freq.type !== 'interval' && (
            <div className="av-quickform-row">
              <label className="av-quickfield">
                <span className="av-quickfield-label">Hora</span>
                <input type="time" className="av-input av-input--mini" value={draft.startTime} onChange={(e) => set({ startTime: e.target.value })} />
              </label>
              {kind === 'fixed' && freq.type !== 'once' && (
                <label className="av-quickfield">
                  <span className="av-quickfield-label">Hasta</span>
                  <input type="time" className="av-input av-input--mini" value={draft.endTime} onChange={(e) => set({ endTime: e.target.value })} />
                </label>
              )}
            </div>
          )}

          {/* Horarios ocupados + conflicto (rutina fija) */}
          {kind === 'fixed' && fixedBlocks.length > 0 && (
            <div className="av-occupied">
              {fixedBlocks.slice(0, 4).map((b) => (
                <span key={b.id} className="av-occupied-chip">
                  {b.startLabel}–{b.endLabel} · {b.name}
                </span>
              ))}
            </div>
          )}
          {conflict && (
            <div className="av-conflict">
              <p className="av-conflict-msg">
                Este horario se cruza con {conflict.name} de {conflict.startLabel} a {conflict.endLabel}.
              </p>
              {suggestion && (
                <p className="av-conflict-alt">
                  Siguiente espacio libre: {suggestion.startLabel} – {suggestion.endLabel}.
                </p>
              )}
            </div>
          )}

          {/* Etiqueta + descripción */}
          <InputField label="Etiqueta corta (opcional)" value={draft.label ?? ''} onChange={(v) => set({ label: v })} placeholder="Ej. Ret" />
          <InputField label="Descripción (opcional)" value={draft.description ?? ''} onChange={(v) => set({ description: v })} placeholder="Notas de la rutina" />

          {/* Notificaciones */}
          <div className="av-notif-row">
            <span className="av-notif-label">
              <Icon name="bell" size={18} />
              Notificaciones
            </span>
            <label className="av-switch av-switch--sm">
              <input
                type="checkbox"
                checked={draft.notification?.notificationEnabled ?? false}
                onChange={(e) =>
                  set({ notification: { ...draft.notification, notificationEnabled: e.target.checked } })
                }
              />
              <span className="av-switch-track">
                <span className="av-switch-thumb" />
              </span>
            </label>
          </div>
        </div>

        <div className="av-sheet-actions">
          {!isNew && (
            <button type="button" className="av-btn-danger" onClick={() => onDelete(draft.id)}>
              <Icon name="trash" size={18} />
              Eliminar
            </button>
          )}
          <PrimaryButton onClick={handleSave} disabled={!canSave}>
            Guardar
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
