import { CSSProperties, useEffect, useState } from 'react';
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

/** Minuto actual del día (0–1440), refrescado cada minuto. */
const useNowMinutes = () => {
  const [now, setNow] = useState(() => {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  });
  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      setNow(d.getHours() * 60 + d.getMinutes());
    }, 60_000);
    return () => clearInterval(id);
  }, []);
  return now;
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/**
 * Panorama del día: bloques que ocupan tiempo, espacios libres suaves y una
 * franja ligera de hábitos (recordatorios) como marcas distribuidas por hora.
 * Una línea vertical se llena conforme avanza el día, mostrando el recorrido
 * de las tareas.
 */
export const DayPanorama = ({ tasks, routines, date }: DayPanoramaProps) => {
  const blocks = getOccupyingBlocks(tasks, routines, date);
  const free = getFreeBlocks(tasks, routines, date);
  const reminders = getReminders(routines, date);

  const liveNow = useNowMinutes();
  const todayStr = timeHelper.getDateString();
  // "Ahora" relativo a la fecha mostrada: días pasados están completos,
  // días futuros aún no empiezan, hoy avanza en vivo.
  const now = date < todayStr ? Number.POSITIVE_INFINITY : date > todayStr ? -1 : liveNow;

  type Row =
    | { type: 'block'; start: number; data: (typeof blocks)[number] }
    | { type: 'free'; start: number; data: (typeof free)[number] };

  const rows: Row[] = [
    ...blocks.map((b) => ({ type: 'block' as const, start: b.start, data: b })),
    ...free.map((f) => ({ type: 'free' as const, start: f.start, data: f })),
  ].sort((a, b) => a.start - b.start);

  // Índice del último nodo ya alcanzado por "ahora" (el actual en curso).
  const currentIndex = rows.reduce((acc, r, i) => (now >= r.start ? i : acc), -1);

  // Relleno (0–1) del tramo que conecta la fila i con la i+1, según el tiempo
  // transcurrido entre ambas. Da una línea continua que avanza con el día.
  const segmentFill = (i: number) => {
    if (i >= rows.length - 1) return 0;
    const a = rows[i].start;
    const b = rows[i + 1].start;
    if (now <= a) return 0;
    if (now >= b || b === a) return 1;
    return clamp01((now - a) / (b - a));
  };

  const pos = (label: string) => {
    const m = timeHelper.timeToMinutes(label);
    return Math.max(0, Math.min(100, ((m - DAY_START) / WAKING) * 100));
  };

  return (
    <div className="av-panorama">
      <ul className="av-timeline">
        {rows.map((row, i) => {
          const reached = now >= row.start;
          const isCurrent = i === currentIndex;
          const fill = segmentFill(i);
          const leftClass =
            'av-tl-left' + (reached ? ' is-reached' : '') + (isCurrent ? ' is-current' : '');

          if (row.type === 'free') {
            return (
              <li key={`f${i}`} className="av-tl-item av-tl-item--free">
                <div className={leftClass}>
                  <span className="av-tl-node av-tl-node--free" />
                  <span className="av-tl-line">
                    <span className="av-tl-line-fill" style={{ height: `${fill * 100}%` }} />
                  </span>
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
              <div className={leftClass}>
                <span className="av-tl-node" style={{ '--node-color': b.color } as CSSProperties}>
                  <Icon name={b.icon as IconName} size={19} />
                </span>
                <span className="av-tl-line">
                  <span className="av-tl-line-fill" style={{ height: `${fill * 100}%` }} />
                </span>
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
