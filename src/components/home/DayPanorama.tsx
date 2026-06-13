import { CSSProperties } from 'react';
import { Routine, Task } from '../../types/index.ts';
import {
  DAY_END,
  DAY_START,
  WAKING,
  getFreeBlocks,
  getOccupyingBlocks,
  getReminders,
} from '../../utils/agenda.ts';
import { timeHelper } from '../../utils/timeHelper.ts';
import { Icon, IconName } from '../ui/Icon.tsx';

interface DayPanoramaProps {
  tasks: Task[];
  routines: Routine[];
  date: string;
}

const fmtDur = (min: number) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h && m) return `${h} h ${m} min`;
  if (h) return `${h} h`;
  return `${m} min`;
};

/**
 * Panorama del día: bloques que ocupan tiempo, espacios libres suaves y una
 * franja ligera de hábitos (recordatorios) como marcas distribuidas por hora.
 */
export const DayPanorama = ({ tasks, routines, date }: DayPanoramaProps) => {
  const blocks = getOccupyingBlocks(tasks, routines, date);
  const free = getFreeBlocks(tasks, routines, date);
  const reminders = getReminders(routines, date);

  type Row =
    | { type: 'block'; start: number; data: (typeof blocks)[number] }
    | { type: 'free'; start: number; data: (typeof free)[number] };

  const rows: Row[] = [
    ...blocks.map((b) => ({ type: 'block' as const, start: b.start, data: b })),
    ...free.map((f) => ({ type: 'free' as const, start: f.start, data: f })),
  ].sort((a, b) => a.start - b.start);

  const pos = (label: string) => {
    const m = timeHelper.timeToMinutes(label);
    return Math.max(0, Math.min(100, ((m - DAY_START) / WAKING) * 100));
  };

  return (
    <div className="av-panorama">
      <ul className="av-timeline">
        {rows.map((row, i) => {
          if (row.type === 'free') {
            return (
              <li key={`f${i}`} className="av-tl-item av-tl-item--free">
                <div className="av-tl-left">
                  <span className="av-tl-node av-tl-node--free" />
                  <span className="av-tl-line" />
                </div>
                <div className="av-tl-body">
                  <p className="av-tl-free-title">Espacio libre · {fmtDur(row.data.minutes)}</p>
                  <p className="av-tl-sub">
                    {row.data.startLabel} – {row.data.endLabel}
                  </p>
                </div>
              </li>
            );
          }
          const b = row.data;
          return (
            <li key={`b${b.source}${b.id}`} className="av-tl-item">
              <div className="av-tl-left">
                <span className="av-tl-node" style={{ '--node-color': b.color } as CSSProperties}>
                  <Icon name={b.icon as IconName} size={19} />
                </span>
                <span className="av-tl-line" />
              </div>
              <div className="av-tl-body">
                <p className="av-tl-title">
                  {b.name}
                  {b.kind === 'flexible' && <span className="av-tl-flex">flexible</span>}
                </p>
                {b.description && <p className="av-tl-sub">{b.description}</p>}
              </div>
              <span className="av-tl-time">{b.startLabel}</span>
            </li>
          );
        })}
      </ul>

      {reminders.length > 0 && (
        <div className="av-reminders">
          <span className="av-reminders-title">Hábitos del día</span>
          {reminders.map((r) => (
            <div
              className="av-rem-track"
              key={r.id}
              style={{ '--routine-color': r.color } as CSSProperties}
              title={`${r.name} · ${r.times.join(', ')}`}
            >
              <span className="av-rem-icon">
                <Icon name={r.icon as IconName} size={15} />
              </span>
              <span className="av-rem-name">{r.label || r.name}</span>
              <span className="av-rem-line">
                {r.times.map((t, idx) => (
                  <span key={idx} className="av-rem-dot" style={{ left: `${pos(t)}%` }} title={t} />
                ))}
              </span>
            </div>
          ))}
        </div>
      )}

      {rows.length === 0 && reminders.length === 0 && (
        <p className="av-empty">Día libre de {timeHelper.minutesToTime(DAY_START)} a {timeHelper.minutesToTime(DAY_END)}.</p>
      )}
    </div>
  );
};
